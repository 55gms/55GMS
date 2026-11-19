import express from "express";
import { sequelize } from "../models/index.js";
import {
  createScopedToken,
  readSession,
  verifyScopedToken,
} from "../utils/sessionToken.js";
import { rateLimit } from "../utils/rateLimit.js";
import { requireMultiplayerServer } from "../utils/mpInternal.js";
import { gameConfig } from "../services/onev1Config.js";

// 1v1.lol on 55GMS accounts (docs/1v1-backend.md):
// - POST /api/1v1/token: a game token for the signed-in account
// - GET  /api/1v1/config: the remote config the game reads
// - /api/1v1/fn/<path>: the game's own backend calls, which the page
//   (static/misc/nowgg/index.html) sends here with the token in auth-token
// - /api/1v1/internal/*: for the multiplayer server only (MP_SHARED_SECRET)
export const GAME_TOKEN_SCOPE = "1v1";
const GAME_TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

async function accountOf(uuid) {
  const [rows] = await sequelize.query(
    `SELECT uuid, username, handle_pending, premium FROM users WHERE uuid = :uuid`,
    { replacements: { uuid } },
  );
  return rows[0] || null;
}

export function createOneV1Router({ game, coins, billing = false } = {}) {
  const router = express.Router();

  router.post("/1v1/token", async (req, res) => {
    const session = readSession(req);
    if (!session?.uuid) return res.status(401).json({ error: "sign_in" });
    try {
      const account = await accountOf(String(session.uuid));
      if (!account) return res.status(401).json({ error: "sign_in" });
      if (account.handle_pending) {
        return res.status(409).json({ error: "handle_pending" });
      }
      res.json({
        token: createScopedToken(
          account.uuid,
          GAME_TOKEN_SCOPE,
          GAME_TOKEN_TTL_MS,
        ),
        handle: account.username,
        uuid: account.uuid,
      });
    } catch (error) {
      console.error("[1v1] token failed:", error);
      res.status(503).json({ error: "unavailable" });
    }
  });

  if (coins) router.get("/1v1/coins/done", coins.coinsDonePage);

  router.get("/1v1/config", (req, res) => {
    res.set("Cache-Control", "public, max-age=300");
    res.json(gameConfig());
  });

  // --- the game's backend calls ----------------------------------------

  const fn = express.Router();
  const perAccount = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    message: "Too many requests",
    key: (req) => req.uuid,
  });

  // analytics is sent without a token and dropped.
  fn.post("/analytics", (req, res) => res.json({}));

  fn.use(async (req, res, next) => {
    const uuid = verifyScopedToken(
      String(req.headers["auth-token"] || ""),
      GAME_TOKEN_SCOPE,
    );
    if (!uuid) return res.status(401).json({ error: "User not logged in" });
    // The token alone is not enough: the 55GMS session it was made for must
    // still be signed in, so signing out of the site signs the game out too.
    const session = readSession(req);
    if (!session?.uuid || String(session.uuid) !== uuid) {
      return res.status(401).json({ error: "User not logged in" });
    }
    req.uuid = uuid;
    next();
  }, perAccount);

  // Each handler returns the reply body, or throws a GameError for the
  // game's {"error": message} with a 4xx.
  const handle = (run) => async (req, res) => {
    try {
      const params = { ...req.query, ...(req.body || {}) };
      const out = await run(req.uuid, params, req);
      res.json(out ?? {});
    } catch (error) {
      if (error?.status) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error(`[1v1] ${req.path} failed:`, error);
      res.status(500).json({ error: "Server error" });
    }
  };
  if (game) game.mount(fn, handle);
  if (coins) coins.mount(fn, handle, { billing });
  // Calls this build makes that change nothing here: the game's own
  // reports of results (the multiplayer server decides those), renames (the
  // name is the 55GMS handle) and the rest of docs/1v1-backend.md.
  for (const path of [
    "/rating/updateMMR",
    "/player/updateProgressAndStats",
    "/player/boostBattlePassRewards",
    "/player/nickname",
    "/battlePass/earnRewards",
  ]) {
    fn.post(path, (req, res) => res.json({}));
  }
  fn.use((req, res) => res.status(404).json({ error: "Not supported" }));
  router.use("/1v1/fn", fn);

  // --- the multiplayer server -------------------------------------------

  router.use("/1v1/internal", requireMultiplayerServer);
  router.post("/1v1/internal/verify", async (req, res) => {
    const uuid = verifyScopedToken(
      String(req.body?.token || ""),
      GAME_TOKEN_SCOPE,
    );
    if (!uuid) return res.status(404).json({ error: "unknown_token" });
    try {
      const account = await accountOf(uuid);
      if (!account || account.handle_pending) {
        return res.status(404).json({ error: "unknown_token" });
      }
      const ratings = game ? await game.ratingsOf(uuid) : {};
      res.json({ uuid, handle: account.username, ratings });
    } catch (error) {
      console.error("[1v1] verify failed:", error);
      res.status(503).json({ error: "unavailable" });
    }
  });
  if (game) {
    router.post("/1v1/internal/match", async (req, res) => {
      try {
        res.json(await game.applyMatch(req.body || {}));
      } catch (error) {
        if (error?.status) {
          return res.status(error.status).json({ error: error.message });
        }
        console.error("[1v1] match failed:", error);
        res.status(500).json({ error: "Server error" });
      }
    });
  }

  return router;
}
