import express from "express";
import defaultAccounts from "../services/accounts.js";
import userCache from "../utils/userCache.js";
import { readSession } from "../utils/sessionToken.js";

// The only account allowed to manage premium. Usernames are unique and
// case-sensitive, so this matches exactly one user.
const ADMIN_USERNAME = "jiayang";

export function createAdminRouter({ accounts = defaultAccounts } = {}) {
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

      await userCache.invalidateUser(uuid);
      res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Update failed" });
    }
  });

  return router;
}

export default createAdminRouter();
