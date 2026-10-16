import express from "express";
import defaultAccounts, {
  ACCOUNT_WRITES_FROZEN_ERROR,
  areAccountWritesFrozen,
} from "../services/accounts.js";
import * as defaultSaves from "../services/gameSaves.js";
import { rateLimit } from "../utils/rateLimit.js";
import { createScopedToken, readSession } from "../utils/sessionToken.js";
import {
  DEFAULT_SLOT,
  GAME_ID_PATTERN,
  SLOT_PATTERN,
  getGame,
} from "../utils/saveRegistry.js";

export const SAVE_SOCKET_SCOPE = "saves";
const SOCKET_TOKEN_TTL_MS = 10 * 60 * 1000;
const DEVICE_ID = /^[A-Za-z0-9_-]{8,64}$/;
const MINUTE = 60 * 1000;

// Per-game cloud saves (services/gameSaves.js). Every route needs the
// session cookie set at login: a uuid alone is known to everyone the account
// has chatted with, so it never decides whose saves are read or written.
// `io` gets a note on each change, sent to the account's other devices.
export function createSavesRouter({
  accounts = defaultAccounts,
  saves = defaultSaves,
  io = null,
} = {}) {
  const router = express.Router();

  async function requireSession(req, res, next) {
    const session = readSession(req);
    if (!session?.uuid) {
      return res
        .status(401)
        .json({
          error: "sign_in_again",
          message: "Sign in again to sync saves",
        });
    }
    req.uuid = String(session.uuid);
    try {
      const found = await accounts.isPremium(req.uuid);
      if (!found)
        return res
          .status(401)
          .json({ error: "sign_in_again", message: "Account not found" });
      req.premium = Boolean(found.premium);
    } catch (error) {
      console.error("[saves] premium check failed:", error);
      return res
        .status(503)
        .json({ error: "unavailable", message: "Cloud saves are unavailable" });
    }
    next();
  }

  const perAccount = (req) => req.uuid;
  const readLimit = rateLimit({
    windowMs: 10 * MINUTE,
    max: 1200,
    key: perAccount,
    message: "Too many requests. Try again in a few minutes.",
  });
  // Premium syncs in the background, so it gets more room.
  const writeLimit = rateLimit({
    windowMs: 10 * MINUTE,
    max: (req) => (req.premium ? 900 : 150),
    key: perAccount,
    message: "Too many uploads. Try again in a few minutes.",
  });

  function gameParams(req, res) {
    const { gameId } = req.params;
    const slot = String(req.query.slot || req.body?.slot || DEFAULT_SLOT);
    if (!GAME_ID_PATTERN.test(gameId) || !SLOT_PATTERN.test(slot)) {
      res
        .status(400)
        .json({ error: "bad_request", message: "Bad game or slot" });
      return null;
    }
    if (!getGame(gameId)) {
      res.status(404).json({ error: "unknown_game", message: "Unknown game" });
      return null;
    }
    return { gameId, slot };
  }

  function deviceOf(req) {
    const device = req.body?.deviceId;
    return typeof device === "string" && DEVICE_ID.test(device) ? device : null;
  }

  function fail(res, error, what) {
    if (error instanceof saves.SaveError) {
      return res
        .status(error.status)
        .json({ error: error.code, message: error.message });
    }
    console.error(`[saves] ${what} failed:`, error);
    res
      .status(500)
      .json({ error: "server_error", message: `Couldn't ${what}` });
  }

  // Tells the account's other devices a game's cloud save changed. Only the
  // game, revision and hash are sent; devices fetch the save if they want it.
  function announce(uuid, meta, deviceId) {
    if (!io || !meta) return;
    io.to(`saves_${uuid}`).emit("save_updated", {
      gameId: meta.gameId,
      slot: meta.slot,
      revision: meta.revision,
      hash: meta.hash,
      deviceId: deviceId || null,
    });
  }

  router.use(
    ["/saves", "/saves-socket-token", "/saves-legacy"],
    requireSession,
  );

  router.get("/saves", readLimit, async (req, res) => {
    try {
      const manifest = await saves.getManifest(req.uuid);
      const limits = saves.limitsFor(req.premium);
      res.status(200).json({
        premium: req.premium,
        autoSync: req.premium,
        limits: {
          versions: limits.versions,
          historyDays: limits.historyDays,
          quotaBytes: limits.quotaBytes,
          maxSaveBytes: limits.maxSaveBytes,
        },
        ...manifest,
      });
    } catch (error) {
      fail(res, error, "load your cloud saves");
    }
  });

  router.get("/saves/:gameId", readLimit, async (req, res) => {
    const params = gameParams(req, res);
    if (!params) return;
    try {
      if (req.query.meta === "1") {
        const save = await saves.getSaveMeta(
          req.uuid,
          params.gameId,
          params.slot,
        );
        return res.status(200).json({ save });
      }
      const found = await saves.getSave(req.uuid, params.gameId, params.slot);
      if (!found)
        return res
          .status(404)
          .json({ error: "no_save", message: "No cloud save" });
      res.status(200).json(found);
    } catch (error) {
      fail(res, error, "load the save");
    }
  });

  router.post("/saves/:gameId", writeLimit, async (req, res) => {
    const params = gameParams(req, res);
    if (!params) return;
    if (areAccountWritesFrozen()) {
      return res
        .status(503)
        .json({ error: "frozen", message: ACCOUNT_WRITES_FROZEN_ERROR });
    }
    const body = req.body || {};
    // Background sync is a premium feature. Manual syncs work for everyone.
    if (body.mode === "auto" && !req.premium) {
      return res
        .status(403)
        .json({
          error: "premium_required",
          message: "Automatic sync needs Premium",
        });
    }
    try {
      const deviceId = deviceOf(req);
      const outcome = await saves.uploadSave({
        uuid: req.uuid,
        ...params,
        baseRevision: Number(body.baseRevision),
        hash: String(body.hash || ""),
        text: body.data,
        modifiedAt: body.modifiedAt,
        deviceId,
        premium: req.premium,
      });
      if (outcome.result === "accepted")
        announce(req.uuid, outcome.save, deviceId);
      res.status(200).json(outcome);
    } catch (error) {
      fail(res, error, "save to the cloud");
    }
  });

  router.get("/saves/:gameId/history", readLimit, async (req, res) => {
    const params = gameParams(req, res);
    if (!params) return;
    try {
      const versions = await saves.listHistory(
        req.uuid,
        params.gameId,
        params.slot,
        req.premium,
      );
      const limits = saves.limitsFor(req.premium);
      res
        .status(200)
        .json({
          versions,
          keepDays: limits.historyDays,
          keepVersions: limits.versions,
        });
    } catch (error) {
      fail(res, error, "load the save history");
    }
  });

  router.post("/saves/:gameId/restore", writeLimit, async (req, res) => {
    const params = gameParams(req, res);
    if (!params) return;
    if (areAccountWritesFrozen()) {
      return res
        .status(503)
        .json({ error: "frozen", message: ACCOUNT_WRITES_FROZEN_ERROR });
    }
    try {
      const deviceId = deviceOf(req);
      const restored = await saves.restoreVersion({
        uuid: req.uuid,
        ...params,
        versionId: req.body?.versionId,
        deviceId,
        premium: req.premium,
      });
      announce(req.uuid, restored.save, deviceId);
      res.status(200).json(restored);
    } catch (error) {
      fail(res, error, "restore that version");
    }
  });

  // Turns the part of the legacy full-browser backup that belongs to this
  // game into its first per-game save. The registry's keys for the game are
  // always tried; `keys` adds the ones this device has seen the game use.
  router.post("/saves/:gameId/import-legacy", writeLimit, async (req, res) => {
    const params = gameParams(req, res);
    if (!params) return;
    const keys = Array.isArray(req.body?.keys)
      ? req.body.keys
          .filter((key) => typeof key === "string" && key.length <= 512)
          .slice(0, 2000)
      : [];
    try {
      const deviceId = deviceOf(req);
      const outcome = await saves.importLegacy({
        uuid: req.uuid,
        gameId: params.gameId,
        keys,
        deviceId,
      });
      if (outcome.result === "imported")
        announce(req.uuid, outcome.save, deviceId);
      res.status(200).json(outcome);
    } catch (error) {
      fail(res, error, "import the old backup");
    }
  });

  // The legacy full-browser backup, read-only. The profile page offers it as
  // "Restore everything" for data the per-game saves do not cover.
  router.get("/saves-legacy", readLimit, async (req, res) => {
    try {
      const snapshot = await accounts.readSave(req.uuid);
      if (snapshot === null || snapshot === undefined) {
        return res
          .status(404)
          .json({ error: "no_save", message: "No older backup" });
      }
      res.status(200).type("application/json").send(snapshot);
    } catch (error) {
      fail(res, error, "load the older backup");
    }
  });

  router.post("/saves-socket-token", (req, res) => {
    const token = createScopedToken(
      req.uuid,
      SAVE_SOCKET_SCOPE,
      SOCKET_TOKEN_TTL_MS,
    );
    if (!token) return res.status(503).json({ error: "unavailable" });
    res.status(200).json({ token, premium: req.premium });
  });

  return router;
}
