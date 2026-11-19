import express from "express";
import { createScopedToken, readSession, verifyScopedToken } from "../utils/sessionToken.js";
import { requireMultiplayerServer } from "../utils/mpInternal.js";
import * as digdig from "../services/digdig.js";

// digdig.io on 55GMS accounts (docs/multiplayer.md):
// - POST /api/digdig/token: a game token for the signed-in account; the page
//   (static/misc/digdig-io/index.html) saves it as the game's own login, which
//   the game sends to the multiplayer server
// - /api/digdig/internal/*: for the multiplayer server only, which checks
//   tokens, grants the gold a player earned and asks for purchases
export const GAME_TOKEN_SCOPE = "digdig";
const GAME_TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

export function createDigdigRouter() {
  const router = express.Router();

  router.post("/digdig/token", async (req, res) => {
    const session = readSession(req);
    if (!session?.uuid) return res.status(401).json({ error: "sign_in" });
    try {
      const account = await digdig.accountOf(String(session.uuid));
      if (!account) return res.status(409).json({ error: "handle_pending" });
      res.json({
        token: createScopedToken(account.uuid, GAME_TOKEN_SCOPE, GAME_TOKEN_TTL_MS),
        expires: Date.now() + GAME_TOKEN_TTL_MS,
        handle: account.handle,
        uuid: account.uuid,
      });
    } catch (error) {
      console.error("[digdig] token failed:", error);
      res.status(503).json({ error: "unavailable" });
    }
  });

  const internal = express.Router();
  internal.use(requireMultiplayerServer);
  const handle = (run) => async (req, res) => {
    try {
      res.json(await run(req.body || {}));
    } catch (error) {
      if (error instanceof digdig.DigdigError) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error(`[digdig] ${req.path} failed:`, error);
      res.status(500).json({ error: "Server error" });
    }
  };

  internal.post(
    "/verify",
    handle(async (body) => {
      const uuid = verifyScopedToken(String(body.token || ""), GAME_TOKEN_SCOPE);
      const account = uuid ? await digdig.accountOf(uuid) : null;
      if (!account) throw new digdig.DigdigError("unknown_token", 404);
      return account;
    }),
  );
  internal.post(
    "/buy",
    handle(async (body) => {
      const account = await digdig.buySkin(String(body.uuid || ""), String(body.item || ""));
      if (!account) throw new digdig.DigdigError("unknown account", 404);
      return account;
    }),
  );
  internal.post(
    "/gold",
    handle(async (body) => ({
      gold: await digdig.grantGold(String(body.uuid || ""), body.amount, String(body.source || "")),
    })),
  );
  router.use("/digdig/internal", internal);

  return router;
}
