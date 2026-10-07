import express from "express";
import defaultAccounts from "../services/accounts.js";
import userCache from "../utils/userCache.js";
import {
  ADMIN_TOKEN_TTL_MS,
  createAdminToken,
  verifyAdminToken,
} from "../utils/adminToken.js";

// The only account allowed to manage premium. Usernames are unique and
// case-sensitive, so this matches exactly one user.
const ADMIN_USERNAME = "jiayang";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAILURES = 10;

export function createAdminRouter({ accounts = defaultAccounts } = {}) {
  const router = express.Router();

  // Failed logins are counted globally, not per IP: there is one admin
  // account and client IP headers can be spoofed.
  let failedLogins = [];

  function isLoginLocked() {
    const cutoff = Date.now() - LOGIN_WINDOW_MS;
    failedLogins = failedLogins.filter((time) => time > cutoff);
    return failedLogins.length >= LOGIN_MAX_FAILURES;
  }

  function requireSecret(req, res, next) {
    if (!process.env.ADMIN_TOKEN_SECRET) {
      return res.status(503).json({ error: "Admin is not configured" });
    }
    next();
  }

  // UUIDs are visible to chat members, so admin calls are authorized by a
  // token issued after a password check, never by uuid alone.
  function requireAdmin(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!verifyAdminToken(token, process.env.ADMIN_TOKEN_SECRET)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  }

  router.use("/admin", requireSecret);

  router.post("/admin/login", async (req, res) => {
    const { password } = req.body;

    if (typeof password !== "string" || !password) {
      return res.status(400).json({ error: "Not enough arguments" });
    }
    if (isLoginLocked()) {
      return res
        .status(429)
        .json({ error: "Too many attempts. Try again later." });
    }

    try {
      const user = await accounts.verifyLogin({
        username: ADMIN_USERNAME,
        password,
      });
      if (!user || user.username !== ADMIN_USERNAME) {
        failedLogins.push(Date.now());
        return res.status(401).json({ error: "Invalid password" });
      }

      res.status(200).json({
        token: createAdminToken(user.uuid, process.env.ADMIN_TOKEN_SECRET),
        expiresIn: ADMIN_TOKEN_TTL_MS,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  router.get("/admin/users", requireAdmin, async (req, res) => {
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

    try {
      res.status(200).json({ users: await accounts.searchUsers(query) });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  router.post("/admin/premium", requireAdmin, async (req, res) => {
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
