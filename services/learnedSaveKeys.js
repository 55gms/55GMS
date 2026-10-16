import { createHash } from "node:crypto";
import { sequelize } from "../models/index.js";

// Which storage each game keeps its save in, learned from uploads. Only the
// names are kept (localStorage keys, IndexedDB databases, stores, folder
// prefixes and record keys), never a value. A browser uses them to find a
// save the game wrote before the save agent ran there, such as one from
// before per-game saves. See docs/cloud-saves.md.

// A name is published once this many accounts uploaded it for the game, so
// one account can neither teach nor hide a key, and a name holding an id
// unique to one player is never shared.
export const MIN_ACCOUNTS = 2;
// An upload from this account (the site owner, as in routes/admin.js) is
// enough on its own.
const TRUSTED_USERNAME = "jiayang";
const MAX_NAMES = 300;
const MAX_NAME_LENGTH = 512;
const PUBLISHED_TTL_MS = 10 * 60 * 1000;

const seen = new Map();
let published = { at: 0, rows: null, loading: null };

// The names in a parsed save, as rows of [kind, db, store, name].
export function namesIn(save) {
  const names = [];
  for (const key of Object.keys(save.ls || {})) names.push(["ls", "", "", key]);
  for (const database of save.idb || []) {
    for (const store of database.stores || []) {
      for (const prefix of store.prefixes || []) {
        if (typeof prefix === "string")
          names.push(["prefix", database.name, store.name, prefix]);
      }
      for (const key of store.keys || []) {
        names.push(["key", database.name, store.name, JSON.stringify(key)]);
      }
    }
  }
  return names
    .filter(([, db, store, name]) =>
      [db, store, name].every((part) => part.length <= MAX_NAME_LENGTH),
    )
    .slice(0, MAX_NAMES);
}

// Records the names in a save an account uploaded for a game. Repeats of
// the same set by the same account are skipped without a query.
export async function learnFrom(uuid, gameId, save) {
  const names = namesIn(save);
  if (!names.length) return;
  const signature = createHash("sha1")
    .update(JSON.stringify(names))
    .digest("hex");
  const id = `${uuid}|${gameId}`;
  if (seen.get(id) === signature) return;
  const values = [];
  const replacements = { uuid, gameId };
  names.forEach(([kind, db, store, name], i) => {
    values.push(`(:gameId, :k${i}, :d${i}, :s${i}, :n${i}, :uuid)`);
    replacements[`k${i}`] = kind;
    replacements[`d${i}`] = db;
    replacements[`s${i}`] = store;
    replacements[`n${i}`] = name;
  });
  await sequelize.query(
    `INSERT INTO game_save_keys (game_id, kind, db, store, name, user_uuid)
     VALUES ${values.join(", ")}
     ON CONFLICT DO NOTHING`,
    { replacements },
  );
  if (seen.size > 50000) seen.clear();
  seen.set(id, signature);
}

// Rows as { [gameId]: { ls: [...], idb: [{ db, store, prefixes, keys }] } }.
function group(rows) {
  const games = {};
  for (const row of rows) {
    const game = (games[row.game_id] ||= { ls: [], idb: [] });
    if (row.kind === "ls") {
      if (!game.ls.includes(row.name)) game.ls.push(row.name);
      continue;
    }
    let target = game.idb.find(
      (entry) => entry.db === row.db && entry.store === row.store,
    );
    if (!target) {
      target = { db: row.db, store: row.store, prefixes: [], keys: [] };
      game.idb.push(target);
    }
    if (row.kind === "prefix") target.prefixes.push(row.name);
    else {
      try {
        target.keys.push(JSON.parse(row.name));
      } catch {}
    }
  }
  return games;
}

// A name that qualifies for two or more games belongs to no single one (an
// engine's settings key, say) and is left out.
async function loadPublished() {
  return await sequelize.query(
    `WITH counted AS (
       SELECT game_id, kind, db, store, name
       FROM game_save_keys
       GROUP BY game_id, kind, db, store, name
       HAVING count(*) >= :min
         OR bool_or(user_uuid IN (
           SELECT uuid FROM users WHERE username = :trusted
         ))
     ), owners AS (
       SELECT *, count(*) OVER (PARTITION BY kind, db, store, name) AS games
       FROM counted
     )
     SELECT game_id, kind, db, store, name FROM owners WHERE games = 1`,
    {
      replacements: { min: MIN_ACCOUNTS, trusted: TRUSTED_USERNAME },
      type: sequelize.QueryTypes.SELECT,
    },
  );
}

// The names every browser may use, kept for a few minutes per worker. A
// stale copy is served while the next one loads.
export async function publishedRows() {
  if (Date.now() - published.at > PUBLISHED_TTL_MS && !published.loading) {
    published.loading = loadPublished().then(
      (rows) => {
        published = { at: Date.now(), rows, loading: null };
        return rows;
      },
      (error) => {
        published.loading = null;
        throw error;
      },
    );
    if (published.rows) published.loading.catch(() => {});
  }
  return published.rows || published.loading;
}

// The published names, plus the account's own: its other devices' uploads
// teach a new browser even for a game nobody else has synced.
export async function learnedKeys(uuid = null) {
  const rows = [...(await publishedRows())];
  if (uuid) {
    rows.push(
      ...(await sequelize.query(
        `SELECT DISTINCT game_id, kind, db, store, name
         FROM game_save_keys WHERE user_uuid = :uuid`,
        { replacements: { uuid }, type: sequelize.QueryTypes.SELECT },
      )),
    );
  }
  const games = group(rows);
  for (const game of Object.values(games)) {
    for (const target of game.idb) {
      target.prefixes = [...new Set(target.prefixes)];
      const unique = new Map(
        target.keys.map((key) => [JSON.stringify(key), key]),
      );
      target.keys = [...unique.values()];
    }
  }
  return games;
}

// The localStorage keys learned for one game, published or the account's.
export async function learnedLsKeys(gameId, uuid = null) {
  const games = await learnedKeys(uuid);
  return games[gameId]?.ls || [];
}
