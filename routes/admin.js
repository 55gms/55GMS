import express from "express";
import defaultAccounts from "../services/accounts.js";
import userCache from "../utils/userCache.js";
import { readSession } from "../utils/sessionToken.js";

// The only account allowed to manage premium. Handles are unique and stored
// lowercase, so this matches exactly one user.
const ADMIN_USERNAME = "jiayang";

// recomputePremium is passed only when billing is on: premium is then the
// grant or a live subscription, and services/billing.js decides.
export function createAdminRouter({
  accounts = defaultAccounts,
  recomputePremium = null,
} = {}) {
  const router = express.Router();

  // UUIDs are visible to chat members, so admin calls are authorized by the
  // session cookie set at login, never by uuid alone.
  async function requireAdmin(req, res, next) {
    if (!process.env.ADMIN_TOKEN_SECRET) {
      return res.status(503).json({ error: "Admin is not configured" });
    }

    const session = readSession(req);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const user = await accounts.getUserByUuid(session.uuid);
      if (!user || user.username !== ADMIN_USERNAME) {
        return res.status(403).json({ error: "Forbidden" });
      }
      req.adminUser = user;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Authorization failed" });
    }
  }

  router.use("/admin", requireAdmin);

  router.get("/admin/users", async (req, res) => {
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

    try {
      res.status(200).json({ users: await accounts.searchUsers(query) });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  router.post("/admin/premium", async (req, res) => {
    const { uuid, premium } = req.body;

    if (typeof uuid !== "string" || !uuid || typeof premium !== "boolean") {
      return res.status(400).json({ error: "Not enough arguments" });
    }

    try {
      const user = await accounts.setPremium(uuid, premium);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (recomputePremium) {
        user.premium = Boolean(await recomputePremium(uuid));
      }

      await userCache.invalidateUser(uuid);
      res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Update failed" });
    }
  });

  // The game bot (github.com/55gms/game-bot) adds games from links. The page
  // never talks to it directly: these routes pass the admin's calls on with
  // the shared token, which stays on this server.
  const gameBot = () => {
    const url = process.env.GAME_BOT_URL?.trim().replace(/\/+$/, "");
    const token = process.env.GAME_BOT_TOKEN?.trim();
    return url && token ? { url, token } : null;
  };

  async function callGameBot(res, method, path, body) {
    const bot = gameBot();
    if (!bot)
      return res.status(503).json({ error: "The game bot is not configured" });
    try {
      const response = await fetch(`${bot.url}/api${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${bot.token}`,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json().catch(() => ({}));
      res.status(response.status).json(data);
    } catch (error) {
      console.log(error);
      res.status(502).json({ error: "The game bot did not answer" });
    }
  }

  const jobId = (req) => Number.parseInt(req.params.id, 10) || 0;

  router.get("/admin/games/status", (req, res) => {
    res.status(200).json({ enabled: Boolean(gameBot()) });
  });

  router.get("/admin/games/batches", (req, res) =>
    callGameBot(res, "GET", "/batches?limit=15"),
  );

  router.post("/admin/games/batches", (req, res) => {
    const links = typeof req.body?.links === "string" ? req.body.links : "";
    if (!links.trim())
      return res.status(400).json({ error: "Paste some links" });
    callGameBot(res, "POST", "/batches", {
      links: links.slice(0, 20000),
      requestedBy: req.adminUser.username,
    });
  });

  router.get("/admin/games/jobs/:id/log", (req, res) => {
    const after = Number.parseInt(req.query.after, 10) || 0;
    callGameBot(res, "GET", `/jobs/${jobId(req)}/log?after=${after}`);
  });

  router.post("/admin/games/jobs/:id/:action(retry|cancel)", (req, res) =>
    callGameBot(res, "POST", `/jobs/${jobId(req)}/${req.params.action}`),
  );

  return router;
}

export default createAdminRouter();
