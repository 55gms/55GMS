import { createHash } from "node:crypto";
import { sequelize } from "../models/index.js";
import {
  DEFAULT_SLOT,
  getGame,
  isSiteStorageKey,
} from "../utils/saveRegistry.js";
import { compareProgress, readProgress } from "../utils/saveProgress.js";
import { deleteBlob, loadSaveText, storeSaveText } from "./saveBlobs.js";

// Per-game cloud saves. Each account has at most one current save per game
// and slot (game_saves), and earlier or losing saves are kept for a while in
// game_save_versions. Every change to a game's save happens in one
// transaction holding that save's row lock, so two devices uploading at the
// same moment are settled one after the other. See docs/cloud-saves.md.

const MB = 1024 * 1024;
const DAY_MS = 24 * 60 * 60 * 1000;

// What an account may keep. Current saves are never deleted by these
// limits, whatever happens to premium; only history is trimmed.
export const LIMITS = {
  free: {
    versions: 5,
    historyDays: 14,
    quotaBytes: 50 * MB,
    maxSaveBytes: 8 * MB,
  },
  premium: {
    versions: 30,
    historyDays: 90,
    quotaBytes: 250 * MB,
    maxSaveBytes: 16 * MB,
  },
};

export function limitsFor(premium) {
  return premium ? LIMITS.premium : LIMITS.free;
}

export class SaveError extends Error {
  constructor(status, code, message) {
    super(message || code);
    this.status = status;
    this.code = code;
  }
}

// JSON with object keys sorted at every level. static/assets/js/cloud-saves.js
// serializes saves the same way, so the same save always has the same hash.
export function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((item) => (item === undefined ? "null" : stableStringify(item))).join(",")}]`;
  }
  const keys = Object.keys(value)
    .filter((key) => value[key] !== undefined)
    .sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

export function hashText(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

const NAME = /^[\s\S]{1,256}$/;

// Checks a save's text and returns the parsed save and its format. A save is
// { v: 1, ls?: { key: value }, idb?: [database] }: the game's localStorage
// keys and the IndexedDB records it owns (see cloud-saves.js).
export function parseSaveText(text) {
  let save;
  try {
    save = JSON.parse(text);
  } catch {
    throw new SaveError(400, "invalid_save", "The save is not valid JSON");
  }
  if (
    !save ||
    typeof save !== "object" ||
    Array.isArray(save) ||
    save.v !== 1
  ) {
    throw new SaveError(400, "invalid_save", "Unknown save format");
  }

  const parts = [];
  if (save.ls !== undefined) {
    if (!save.ls || typeof save.ls !== "object" || Array.isArray(save.ls)) {
      throw new SaveError(400, "invalid_save", "Bad localStorage section");
    }
    const keys = Object.keys(save.ls);
    if (keys.length > 5000)
      throw new SaveError(400, "invalid_save", "Too many keys");
    for (const key of keys) {
      if (typeof save.ls[key] !== "string") {
        throw new SaveError(
          400,
          "invalid_save",
          "localStorage values must be strings",
        );
      }
      // Account and site keys never belong in a game save.
      if (isSiteStorageKey(key)) {
        throw new SaveError(
          400,
          "site_key",
          `"${key.slice(0, 40)}" is not game data`,
        );
      }
    }
    if (keys.length) parts.push("ls");
  }

  if (save.idb !== undefined) {
    if (!Array.isArray(save.idb) || save.idb.length > 32) {
      throw new SaveError(400, "invalid_save", "Bad IndexedDB section");
    }
    for (const database of save.idb) {
      if (
        !database ||
        typeof database.name !== "string" ||
        !NAME.test(database.name) ||
        !Number.isInteger(database.version) ||
        database.version < 1 ||
        !Array.isArray(database.stores)
      ) {
        throw new SaveError(400, "invalid_save", "Bad IndexedDB database");
      }
      for (const store of database.stores) {
        if (
          !store ||
          typeof store.name !== "string" ||
          !NAME.test(store.name) ||
          !Array.isArray(store.records)
        ) {
          throw new SaveError(400, "invalid_save", "Bad IndexedDB store");
        }
      }
    }
    if (save.idb.length) parts.push("idb");
  }

  if (!parts.length)
    throw new SaveError(400, "empty_save", "The save holds no data");
  return { save, format: `v1:${parts.join("+")}` };
}

// A device's own clock, kept only when it is believable: never later than
// now, and within a year.
function clientTime(value, now) {
  const time = new Date(value);
  if (Number.isNaN(time.getTime())) return now;
  if (time > now) return now;
  if (now - time > 365 * DAY_MS) return now;
  return time;
}

function toMeta(row) {
  if (!row) return null;
  return {
    gameId: row.game_id,
    slot: row.slot,
    revision: row.revision,
    hash: row.content_hash,
    format: row.format,
    size: row.size,
    progress: row.progress?.summary ?? null,
    deviceId: row.device_id,
    origin: row.origin,
    modifiedAt: new Date(row.client_modified_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    lastSyncedAt: new Date(row.last_synced_at).toISOString(),
  };
}

async function query(sql, replacements, transaction) {
  const [rows] = await sequelize.query(sql, { replacements, transaction });
  return rows;
}

const SAVE_COLUMNS = `id, user_uuid, game_id, slot, revision, content_hash, format,
  size, progress, device_id, origin, restore_barrier, client_modified_at,
  last_synced_at, created_at, updated_at, data, blob_key`;

function lockCurrent(uuid, gameId, slot, transaction) {
  return query(
    `SELECT ${SAVE_COLUMNS} FROM game_saves
      WHERE user_uuid = :uuid AND game_id = :gameId AND slot = :slot
      FOR UPDATE`,
    { uuid, gameId, slot },
    transaction,
  ).then((rows) => rows[0] || null);
}

// Copies a save (current or incoming) into history, unless history already
// holds the same content for this game, and trims the game's history to the
// account's limit. Returns the object storage keys trimming released.
async function keepVersion(entry, reason, limits, transaction) {
  await query(
    `INSERT INTO game_save_versions
       (user_uuid, game_id, slot, revision, content_hash, format, size, data,
        blob_key, progress, device_id, reason, client_modified_at, created_at)
     SELECT :uuid, :gameId, :slot, :revision, :hash, :format, :size, :data,
            :blobKey, CAST(:progress AS JSONB), :deviceId, :reason, :modifiedAt, now()
      WHERE NOT EXISTS (
        SELECT 1 FROM game_save_versions
         WHERE user_uuid = :uuid AND game_id = :gameId AND slot = :slot
           AND content_hash = :hash)`,
    {
      uuid: entry.uuid,
      gameId: entry.gameId,
      slot: entry.slot,
      revision: entry.revision ?? null,
      hash: entry.hash,
      format: entry.format,
      size: entry.size,
      data: entry.data ?? null,
      blobKey: entry.blobKey ?? null,
      progress: entry.progress ? JSON.stringify(entry.progress) : null,
      deviceId: entry.deviceId ?? null,
      reason,
      modifiedAt: entry.modifiedAt,
    },
    transaction,
  );
  const trimmed = await query(
    `DELETE FROM game_save_versions WHERE id IN (
       SELECT id FROM game_save_versions
        WHERE user_uuid = :uuid AND game_id = :gameId AND slot = :slot
        ORDER BY created_at DESC, id DESC OFFSET :keep)
     RETURNING blob_key`,
    {
      uuid: entry.uuid,
      gameId: entry.gameId,
      slot: entry.slot,
      keep: limits.versions,
    },
    transaction,
  );
  return trimmed.map((row) => row.blob_key).filter(Boolean);
}

function rowAsEntry(row) {
  return {
    uuid: row.user_uuid,
    gameId: row.game_id,
    slot: row.slot,
    revision: row.revision,
    hash: row.content_hash,
    format: row.format,
    size: row.size,
    data: row.data,
    blobKey: row.blob_key,
    progress: row.progress,
    deviceId: row.device_id,
    modifiedAt: row.client_modified_at,
  };
}

// Deletes object storage files nothing refers to any more. Failures are
// logged, never thrown: a stray file costs storage, not data.
async function releaseBlobs(keys) {
  for (const key of new Set(keys)) {
    try {
      const used = await query(
        `SELECT 1 FROM game_saves WHERE blob_key = :key
          UNION ALL SELECT 1 FROM game_save_versions WHERE blob_key = :key LIMIT 1`,
        { key },
      );
      if (!used.length) await deleteBlob(key);
    } catch (error) {
      console.error("[saves] could not release a save file:", error.message);
    }
  }
}

async function writeCurrent(
  row,
  entry,
  { revision, origin, barrier },
  transaction,
) {
  const rows = await query(
    `UPDATE game_saves SET revision = :revision, content_hash = :hash,
        format = :format, size = :size, data = :data, blob_key = :blobKey,
        progress = CAST(:progress AS JSONB), device_id = :deviceId, origin = :origin,
        restore_barrier = :barrier, client_modified_at = :modifiedAt,
        last_synced_at = now(), updated_at = now()
      WHERE id = :id
      RETURNING ${SAVE_COLUMNS}`,
    {
      id: row.id,
      revision,
      hash: entry.hash,
      format: entry.format,
      size: entry.size,
      data: entry.data ?? null,
      blobKey: entry.blobKey ?? null,
      progress: entry.progress ? JSON.stringify(entry.progress) : null,
      deviceId: entry.deviceId ?? null,
      origin,
      barrier,
      modifiedAt: entry.modifiedAt,
    },
    transaction,
  );
  return rows[0];
}

function insertCurrent(entry, origin, transaction) {
  return query(
    `INSERT INTO game_saves
       (user_uuid, game_id, slot, revision, content_hash, format, size, data,
        blob_key, progress, device_id, origin, restore_barrier,
        client_modified_at, last_synced_at, created_at, updated_at)
     VALUES (:uuid, :gameId, :slot, 1, :hash, :format, :size, :data, :blobKey,
        CAST(:progress AS JSONB), :deviceId, :origin, 0, :modifiedAt, now(), now(), now())
     ON CONFLICT (user_uuid, game_id, slot) DO NOTHING
     RETURNING ${SAVE_COLUMNS}`,
    {
      uuid: entry.uuid,
      gameId: entry.gameId,
      slot: entry.slot,
      hash: entry.hash,
      format: entry.format,
      size: entry.size,
      data: entry.data ?? null,
      blobKey: entry.blobKey ?? null,
      progress: entry.progress ? JSON.stringify(entry.progress) : null,
      deviceId: entry.deviceId ?? null,
      origin,
      modifiedAt: entry.modifiedAt,
    },
    transaction,
  ).then((rows) => rows[0] || null);
}

// Which of two conflicting saves is kept: the one further into the game
// when the game's adapter can tell, otherwise the one changed last, and on
// an exact tie the larger hash, so every server decides the same way.
export function chooseWinner(incoming, current) {
  const byProgress = compareProgress(incoming.progress, current.progress);
  if (byProgress === 1) return { winner: "incoming", rule: "progress" };
  if (byProgress === -1) return { winner: "cloud", rule: "progress" };
  const left = new Date(incoming.modifiedAt).getTime();
  const right = new Date(current.modifiedAt).getTime();
  if (left !== right) {
    return {
      winner: left > right ? "incoming" : "cloud",
      rule: byProgress === 0 ? "equal-progress" : "recency",
    };
  }
  return {
    winner: incoming.hash > current.hash ? "incoming" : "cloud",
    rule: "tie",
  };
}

async function usedBytes(uuid, gameId, slot) {
  const rows = await query(
    `SELECT COALESCE(SUM(size), 0)::BIGINT AS total FROM game_saves
      WHERE user_uuid = :uuid AND NOT (game_id = :gameId AND slot = :slot)`,
    { uuid, gameId, slot },
  );
  return Number(rows[0]?.total || 0);
}

function requireGame(gameId) {
  const game = getGame(gameId);
  if (!game) throw new SaveError(404, "unknown_game", "Unknown game");
  if (game.status === "local-only") {
    throw new SaveError(
      409,
      "local_only",
      "This game's saves stay on the device",
    );
  }
  return game;
}

// Uploads a device's save of one game and settles it against the cloud's.
// Returns { result, winner, rule, save, data? }: data is the cloud's text
// when the device must take the cloud's save instead of its own.
export async function uploadSave({
  uuid,
  gameId,
  slot = DEFAULT_SLOT,
  baseRevision,
  hash,
  text,
  modifiedAt,
  deviceId,
  premium,
}) {
  const game = requireGame(gameId);
  const limits = limitsFor(premium);
  if (typeof text !== "string" || !text)
    throw new SaveError(400, "invalid_save", "No save");
  const size = Buffer.byteLength(text, "utf8");
  if (size > limits.maxSaveBytes) {
    throw new SaveError(413, "too_large", "This save is too large to sync");
  }
  if (hashText(text) !== hash) {
    throw new SaveError(400, "hash_mismatch", "The save arrived damaged");
  }
  const { save, format } = parseSaveText(text);
  if ((await usedBytes(uuid, gameId, slot)) + size > limits.quotaBytes) {
    throw new SaveError(413, "quota", "Your cloud save storage is full");
  }

  const now = new Date();
  const progress = readProgress(game, save);
  const stored = await storeSaveText(uuid, hash, text);
  const incoming = {
    uuid,
    gameId,
    slot,
    hash,
    format,
    size,
    ...stored,
    progress,
    deviceId,
    modifiedAt: clientTime(modifiedAt, now),
  };
  const base =
    Number.isInteger(baseRevision) && baseRevision > 0 ? baseRevision : 0;
  const released = [];

  const outcome = await sequelize.transaction(async (transaction) => {
    let row = await lockCurrent(uuid, gameId, slot, transaction);
    if (!row) {
      const inserted = await insertCurrent(incoming, "device", transaction);
      if (inserted)
        return {
          result: "accepted",
          winner: "incoming",
          rule: "first",
          row: inserted,
        };
      // Another device created it a moment ago: settle against that one.
      row = await lockCurrent(uuid, gameId, slot, transaction);
    }

    if (row.content_hash === hash) {
      return { result: "unchanged", winner: "cloud", rule: "same", row };
    }

    const current = rowAsEntry(row);
    if (base === row.revision) {
      released.push(
        ...(await keepVersion(current, "superseded", limits, transaction)),
      );
      const updated = await writeCurrent(
        row,
        incoming,
        {
          revision: row.revision + 1,
          origin: "device",
          barrier: row.restore_barrier,
        },
        transaction,
      );
      return {
        result: "accepted",
        winner: "incoming",
        rule: "fast-forward",
        row: updated,
      };
    }

    // The device's copy is not based on the cloud's current save: a restore
    // the device has not seen yet always stands.
    if (base < row.restore_barrier) {
      released.push(
        ...(await keepVersion(incoming, "stale", limits, transaction)),
      );
      return { result: "kept-cloud", winner: "cloud", rule: "restore", row };
    }

    const choice = chooseWinner(incoming, current);
    if (choice.winner === "incoming") {
      released.push(
        ...(await keepVersion(current, "conflict", limits, transaction)),
      );
      const updated = await writeCurrent(
        row,
        incoming,
        {
          revision: row.revision + 1,
          origin: "device",
          barrier: row.restore_barrier,
        },
        transaction,
      );
      return { result: "accepted", ...choice, row: updated };
    }
    released.push(
      ...(await keepVersion(incoming, "conflict", limits, transaction)),
    );
    return { result: "kept-cloud", ...choice, row };
  });

  releaseBlobs(released);
  const response = {
    result: outcome.result,
    winner: outcome.winner,
    rule: outcome.rule,
    save: toMeta(outcome.row),
  };
  if (outcome.result === "kept-cloud") {
    response.data = await loadSaveText({
      data: outcome.row.data,
      blobKey: outcome.row.blob_key,
    });
  }
  return response;
}

export async function getManifest(uuid) {
  const rows = await query(
    `SELECT game_id, slot, revision, content_hash, format, size, progress,
            device_id, origin, client_modified_at, updated_at, last_synced_at
       FROM game_saves WHERE user_uuid = :uuid ORDER BY updated_at DESC`,
    { uuid },
  );
  let legacy = null;
  try {
    const found = await query(
      `SELECT octet_length("saveData") AS size, "updatedAt" AS updated_at
         FROM user_saves WHERE uuid = :uuid`,
      { uuid },
    );
    if (found[0]) {
      legacy = {
        size: Number(found[0].size),
        updatedAt: new Date(found[0].updated_at).toISOString(),
      };
    }
  } catch {}
  return {
    saves: rows.map(toMeta),
    totalBytes: rows.reduce((sum, row) => sum + row.size, 0),
    legacy,
  };
}

export async function getSave(uuid, gameId, slot = DEFAULT_SLOT) {
  const rows = await query(
    `SELECT ${SAVE_COLUMNS} FROM game_saves
      WHERE user_uuid = :uuid AND game_id = :gameId AND slot = :slot`,
    { uuid, gameId, slot },
  );
  if (!rows[0]) return null;
  return {
    save: toMeta(rows[0]),
    data: await loadSaveText({ data: rows[0].data, blobKey: rows[0].blob_key }),
  };
}

export async function getSaveMeta(uuid, gameId, slot = DEFAULT_SLOT) {
  const rows = await query(
    `SELECT ${SAVE_COLUMNS} FROM game_saves
      WHERE user_uuid = :uuid AND game_id = :gameId AND slot = :slot`,
    { uuid, gameId, slot },
  );
  return toMeta(rows[0]);
}

export async function listHistory(
  uuid,
  gameId,
  slot = DEFAULT_SLOT,
  premium = false,
) {
  const limits = limitsFor(premium);
  const rows = await query(
    `SELECT id, revision, content_hash, format, size, progress, device_id,
            reason, client_modified_at, created_at
       FROM game_save_versions
      WHERE user_uuid = :uuid AND game_id = :gameId AND slot = :slot
        AND created_at > now() - (:days * interval '1 day')
      ORDER BY created_at DESC, id DESC LIMIT :limit`,
    { uuid, gameId, slot, days: limits.historyDays, limit: limits.versions },
  );
  return rows.map((row) => ({
    id: String(row.id),
    revision: row.revision,
    hash: row.content_hash,
    size: row.size,
    progress: row.progress?.summary ?? null,
    deviceId: row.device_id,
    reason: row.reason,
    modifiedAt: new Date(row.client_modified_at).toISOString(),
    keptAt: new Date(row.created_at).toISOString(),
  }));
}

// Makes a kept version the current save again. The save it replaces goes to
// history, and devices whose copy predates the restore take it on their next
// sync instead of winning against it (restore_barrier).
export async function restoreVersion({
  uuid,
  gameId,
  slot = DEFAULT_SLOT,
  versionId,
  deviceId,
  premium,
}) {
  requireGame(gameId);
  if (!/^\d{1,18}$/.test(String(versionId)))
    throw new SaveError(400, "bad_version", "Unknown version");
  const limits = limitsFor(premium);
  const released = [];

  const row = await sequelize.transaction(async (transaction) => {
    const versions = await query(
      `SELECT * FROM game_save_versions
        WHERE id = :id AND user_uuid = :uuid AND game_id = :gameId AND slot = :slot
          AND created_at > now() - (:days * interval '1 day')`,
      { id: String(versionId), uuid, gameId, slot, days: limits.historyDays },
      transaction,
    );
    const version = versions[0];
    if (!version)
      throw new SaveError(404, "bad_version", "That version is no longer kept");
    const entry = { ...rowAsEntry(version), deviceId, modifiedAt: new Date() };

    let current = await lockCurrent(uuid, gameId, slot, transaction);
    if (!current) {
      const inserted = await insertCurrent(entry, "restore", transaction);
      if (inserted) {
        return writeCurrent(
          inserted,
          entry,
          { revision: 1, origin: "restore", barrier: 1 },
          transaction,
        );
      }
      current = await lockCurrent(uuid, gameId, slot, transaction);
    }
    if (current.content_hash !== entry.hash) {
      released.push(
        ...(await keepVersion(
          rowAsEntry(current),
          "restored-over",
          limits,
          transaction,
        )),
      );
    }
    const revision = current.revision + 1;
    return writeCurrent(
      current,
      entry,
      { revision, origin: "restore", barrier: revision },
      transaction,
    );
  });

  releaseBlobs(released);
  return {
    save: toMeta(row),
    data: await loadSaveText({ data: row.data, blobKey: row.blob_key }),
  };
}

// The full-browser backup from before per-game saves (user_saves), read but
// never changed here.
async function readLegacySnapshot(uuid) {
  const rows = await query(
    `SELECT "saveData" FROM user_saves WHERE uuid = :uuid`,
    { uuid },
  );
  if (!rows[0]) return null;
  try {
    const snapshot = JSON.parse(rows[0].saveData);
    return snapshot && typeof snapshot === "object" && !Array.isArray(snapshot)
      ? snapshot
      : null;
  } catch {
    return null;
  }
}

// The keys of one game, taken out of a legacy snapshot as a per-game save.
export function legacySaveFor(snapshot, keys) {
  const ls = {};
  for (const key of keys) {
    if (
      typeof key !== "string" ||
      isSiteStorageKey(key) ||
      !Object.hasOwn(snapshot, key)
    )
      continue;
    const value = snapshot[key];
    if (value === null || value === undefined) continue;
    ls[key] = typeof value === "object" ? JSON.stringify(value) : String(value);
  }
  return Object.keys(ls).length ? { v: 1, ls } : null;
}

// Creates a game's first cloud save from the legacy backup, using the keys
// the registry knows for it and the ones the device saw the game use. Does
// nothing when the game already has a cloud save, so it can be repeated.
export async function importLegacy({
  uuid,
  gameId,
  keys = [],
  deviceId,
  origin = "legacy",
}) {
  const game = requireGame(gameId);
  const wanted = [...new Set([...(game.keys || []), ...keys])].slice(0, 2000);
  const snapshot = await readLegacySnapshot(uuid);
  const save = snapshot && legacySaveFor(snapshot, wanted);
  if (!save) return { result: "nothing" };

  const text = stableStringify(save);
  const hash = hashText(text);
  const size = Buffer.byteLength(text, "utf8");
  const stored = await storeSaveText(uuid, hash, text);
  const row = await sequelize.transaction(async (transaction) => {
    const inserted = await insertCurrent(
      {
        uuid,
        gameId,
        slot: DEFAULT_SLOT,
        hash,
        format: "v1:ls",
        size,
        ...stored,
        progress: readProgress(game, save),
        deviceId: deviceId ?? null,
        // Older than anything a device saves now, so a device's own newer
        // save of the game wins any recency comparison against it.
        modifiedAt: new Date(0),
      },
      origin,
      transaction,
    );
    return inserted;
  });
  if (!row) return { result: "exists", save: await getSaveMeta(uuid, gameId) };
  return { result: "imported", save: toMeta(row), data: text };
}

const SWEEP_INTERVAL_MS = 6 * 60 * 60 * 1000;
const BATCH = 5000;

// Removes history past each account's limits: by age, then by count, so an
// account that lost premium keeps the free amount. Current saves stay.
export async function sweepHistory() {
  const released = [];
  let total = 0;
  for (const sql of [
    `DELETE FROM game_save_versions WHERE id IN (
       SELECT v.id FROM game_save_versions v
         LEFT JOIN users u ON u.uuid = v.user_uuid
        WHERE v.created_at < now() - (CASE WHEN COALESCE(u.premium, false)
              THEN :premiumDays ELSE :freeDays END) * interval '1 day'
        LIMIT :batch)
     RETURNING blob_key`,
    `DELETE FROM game_save_versions WHERE id IN (
       SELECT id FROM (
         SELECT v.id, COALESCE(u.premium, false) AS premium,
                row_number() OVER (PARTITION BY v.user_uuid, v.game_id, v.slot
                                   ORDER BY v.created_at DESC, v.id DESC) AS n
           FROM game_save_versions v LEFT JOIN users u ON u.uuid = v.user_uuid
       ) ranked
        WHERE n > CASE WHEN premium THEN :premiumVersions ELSE :freeVersions END
        LIMIT :batch)
     RETURNING blob_key`,
  ]) {
    for (;;) {
      const rows = await query(sql, {
        premiumDays: LIMITS.premium.historyDays,
        freeDays: LIMITS.free.historyDays,
        premiumVersions: LIMITS.premium.versions,
        freeVersions: LIMITS.free.versions,
        batch: BATCH,
      });
      total += rows.length;
      released.push(...rows.map((row) => row.blob_key).filter(Boolean));
      if (rows.length < BATCH) break;
    }
  }
  await releaseBlobs(released);
  return total;
}

export function startSaveRetention() {
  const run = () =>
    sweepHistory()
      .then(
        (count) =>
          count && console.log(`[saves] removed ${count} old save versions`),
      )
      .catch((error) =>
        console.error("[saves] history sweep failed:", error.message),
      );
  setTimeout(run, 90 * 1000).unref?.();
  setInterval(run, SWEEP_INTERVAL_MS).unref?.();
}
