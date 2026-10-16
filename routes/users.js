import crypto from "node:crypto";
import express from "express";
import defaultAccounts, {
  ACCOUNT_WRITES_FROZEN_ERROR,
  areAccountWritesFrozen,
} from "../services/accounts.js";
import { noteSeen } from "../utils/lastSeen.js";
import { isProxyStorageKey, withoutProxyKeys } from "../utils/saveKeys.js";
import { readSession } from "../utils/sessionToken.js";

// Keys the profile page rewrites on its own, left out of the fingerprint.
// Proxied sites' storage is left out too: saves uploaded before it was
// stripped still hold it, and Restore skips it.
const SAVE_HASH_IGNORED_KEYS = new Set(["premium", "gms-session"]);
const SAVE_HASH_CACHE_MAX = 1000;

// Fingerprint of a save, matching what static/account.html computes from
// localStorage: sorted [key, value] pairs, values as Restore would write them.
// The key names come back too, so the page can tell a save that differs from
// one that is only missing keys added locally since the last upload.
function fingerprintSave(saveJson) {
  const save = JSON.parse(saveJson);
  if (!save || typeof save !== "object" || Array.isArray(save)) {
    throw new Error("Save is not an object");
  }
  const keys = Object.keys(save)
    .filter(
      (key) => !SAVE_HASH_IGNORED_KEYS.has(key) && !isProxyStorageKey(key),
    )
    .sort();
  const entries = keys.map((key) => {
    const value = save[key];
    return [
      key,
      typeof value === "object" ? JSON.stringify(value) : String(value),
    ];
  });
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(entries))
    .digest("hex");
  return { hash, keys };
}

// The account a legacy save request may touch. Where sessions are
// configured it must be the signed-in account: a uuid alone is known to
// everyone the account has chatted with. Without sessions (a self-hosted copy
// with no ADMIN_TOKEN_SECRET) the uuid sent is all there is.
function legacySaveOwner(req, claimed) {
  if (!process.env.ADMIN_TOKEN_SECRET) return claimed ? String(claimed) : null;
  const uuid = readSession(req)?.uuid;
  if (!uuid || (claimed && String(claimed) !== String(uuid))) return null;
  return String(uuid);
}

// perGameSaves: per-game cloud saves are on (routes/saves.js). The legacy
// full-browser backup is then read-only, so nothing replaces what existing
// accounts already have in it before it has been split into games.
export function createUsersRouter({
  accounts = defaultAccounts,
  perGameSaves = false,
} = {}) {
  const router = express.Router();
  // uuid -> { hash, keys }, so repeat checks skip re-parsing large saves.
  const saveHashCache = new Map();

  router.post("/checkPremium", async (req, res) => {
    let { uuid } = req.body;

    if (!uuid) {
      return res.status(400).json({ error: "Not enough arguments" });
    }

    try {
      const result = await accounts.isPremium(uuid);
      if (!result) {
        return res.status(500).json({ error: "User not found" });
      }

      noteSeen(uuid, accounts);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });

  router.post("/uploadSave", async (req, res) => {
    if (perGameSaves) {
      return res.status(410).json({
        error: "Cloud saves now sync per game. Reload the page to use them.",
      });
    }
    let saveData = withoutProxyKeys(req.body);
    let uuid = req.headers["uuid"];

    if (!saveData || !uuid) {
      return res.status(400).json({ error: "Not enough arguments" });
    }
    uuid = legacySaveOwner(req, uuid);
    if (!uuid) return res.status(401).json({ error: "sign_in_again" });
    if (areAccountWritesFrozen()) {
      return res.status(503).json({ error: ACCOUNT_WRITES_FROZEN_ERROR });
    }

    try {
      const result = await accounts.writeSave(uuid, saveData);
      saveHashCache.delete(String(uuid));

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });

  router.post("/saveStatus", async (req, res) => {
    let { uuid } = req.body;

    if (!uuid) {
      return res.status(400).json({ error: "Not enough arguments" });
    }
    uuid = legacySaveOwner(req, uuid);
    if (!uuid) return res.status(401).json({ error: "sign_in_again" });

    try {
      let fingerprint = saveHashCache.get(uuid);
      if (!fingerprint) {
        const saveJson = await accounts.readSave(uuid);
        if (saveJson === null || saveJson === undefined) {
          return res.status(200).json({ exists: false });
        }
        fingerprint = fingerprintSave(saveJson);
        if (saveHashCache.size >= SAVE_HASH_CACHE_MAX) saveHashCache.clear();
        saveHashCache.set(uuid, fingerprint);
      }

      res.status(200).json({ exists: true, ...fingerprint });
    } catch (error) {
      res.status(500).json({ error: "Could not check save status" });
    }
  });

  router.post("/readSave", async (req, res) => {
    let { uuid } = req.body;

    if (!uuid) {
      return res.status(400).json({ error: "Not enough arguments" });
    }
    uuid = legacySaveOwner(req, uuid);
    if (!uuid) return res.status(401).json({ error: "sign_in_again" });

    try {
      const saveJson = await accounts.readSave(uuid);
      if (saveJson === null || saveJson === undefined) {
        return res
          .status(500)
          .json({ error: "No data found for the provided UUID" });
      }

      // Already a JSON string; send it without parsing (saves can be 25 MB).
      res.status(200).type("application/json").send(saveJson);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });

  return router;
}

export default createUsersRouter();
