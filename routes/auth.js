import express from "express";
import defaultAccounts, {
  ACCOUNT_WRITES_FROZEN_ERROR,
  areAccountWritesFrozen,
} from "../services/accounts.js";
import {
  clearSessionCookie,
  readSession,
  setSessionCookie,
} from "../utils/sessionToken.js";
import {
  HANDLE_RULE_MESSAGE,
  HandleError,
  handleDeadline,
  isHandleChoiceOpen,
  isValidHandle,
  normalizeHandle,
} from "../utils/handle.js";
import { AVATAR_IDS } from "../utils/avatars.js";
import { rateLimit } from "../utils/rateLimit.js";
import { createChallenge, verifySolution } from "../utils/captcha.js";
import { noteSeen } from "../utils/lastSeen.js";
import userCache from "../utils/userCache.js";

const HANDLE_ERROR_RESPONSES = {
  invalid_handle: [400, HANDLE_RULE_MESSAGE],
  handle_taken: [409, "That handle is taken"],
  not_pending: [409, "This account already has its handle"],
  deadline_passed: [410, "The time to choose a handle has passed"],
};

// Sends the reply for a HandleError and returns true, or returns false.
function sendHandleError(res, error) {
  if (!(error instanceof HandleError)) return false;
  const [status, message] = HANDLE_ERROR_RESPONSES[error.code] || [400, ""];
  res.status(status).json({ error: message || HANDLE_RULE_MESSAGE });
  return true;
}

// Handles exist only where accounts live in the local database.
function handlesSupported() {
  return process.env.ACCOUNT_BACKEND === "postgres";
}

export function createAuthRouter({
  accounts = defaultAccounts,
  verifyCaptcha = verifySolution,
} = {}) {
  const router = express.Router();

  const checkLimit = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    message: "Too many checks. Try again in a minute.",
  });

  // What the signup form asks as a handle is typed: whether it is free, and
  // the captcha challenge to solve for it, in one round trip. `available` is
  // null when the lookup failed, which signup itself then settles.
  router.get("/signup-check", checkLimit, async (req, res) => {
    const handle = normalizeHandle(req.query.handle);
    if (!isValidHandle(handle)) {
      return res.status(400).json({ error: HANDLE_RULE_MESSAGE });
    }

    let available = null;
    try {
      available = !(await accounts.isHandleTaken(handle));
    } catch (error) {
      console.log(error);
    }

    res.set("Cache-Control", "no-store");
    res.status(200).json({
      handle,
      available,
      challenge: available === false ? null : createChallenge(handle),
    });
  });

  // Many students share one school address, so this only stops a flood.
  const signUpLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    message: "Too many signups from this network. Try again in a few minutes.",
  });

  router.post("/signUp", signUpLimit, async (req, res) => {
    // premium is never taken from the client
    let { password, username, captchaResponse, website } = req.body;

    if (!password || !username || !captchaResponse) {
      return res.status(400).json({ error: "Not enough arguments" });
    }
    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ error: "Password too short" });
    }
    const handle = normalizeHandle(username);
    if (!isValidHandle(handle)) {
      return res.status(400).json({ error: HANDLE_RULE_MESSAGE });
    }
    if (areAccountWritesFrozen()) {
      return res.status(503).json({ error: ACCOUNT_WRITES_FROZEN_ERROR });
    }
    // A field no person sees or fills in; only a form-filling script does.
    if (website) {
      return res.status(400).json({ error: "Invalid CAPTCHA" });
    }

    try {
      if (!(await verifyCaptcha(captchaResponse, handle))) {
        return res.status(400).json({ error: "Invalid CAPTCHA" });
      }

      const user = await accounts.createUser({ username: handle, password });

      setSessionCookie(req, res, user.uuid);
      noteSeen(user.uuid, accounts);
      res.status(200).json(user);
    } catch (error) {
      if (sendHandleError(res, error)) return;
      res
        .status(500)
        .json({ error: "An error occurred while processing your request." });
      console.log(error);
    }
  });

  router.post("/login", async (req, res) => {
    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Not enough arguments" });
    }

    try {
      const user = await accounts.verifyLogin({ username, password });
      if (!user) {
        return res.status(500).json({ error: "Invalid Email or password" });
      }

      setSessionCookie(req, res, user.uuid);
      noteSeen(user.uuid, accounts);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Invalid Email or password" });
    }
  });

  router.post("/logout", (req, res) => {
    clearSessionCookie(req, res);
    res.status(200).json({ success: true });
  });

  // The account this browser says it is. Pages call it on load to refresh
  // the handle they keep in localStorage and to learn whether the account
  // still has to choose one. It returns nothing a chat member cannot see.
  router.get("/me", async (req, res) => {
    const uuid = readSession(req)?.uuid || req.headers["x-user-uuid"];
    if (!uuid || typeof uuid !== "string") {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const user = await accounts.getUserByUuid(uuid);
      if (!user) return res.status(404).json({ error: "Account not found" });

      noteSeen(user.uuid, accounts);
      res.status(200).json({
        uuid: user.uuid,
        username: user.username,
        premium: user.premium,
        avatar: user.avatar ?? null,
        handlePending: Boolean(user.handlePending),
        deadline: handleDeadline()?.toISOString() ?? null,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Couldn't load the account" });
    }
  });

  router.get("/handle-config", (req, res) => {
    res.status(200).json({
      deadline: handleDeadline()?.toISOString() ?? null,
      open: isHandleChoiceOpen(),
    });
  });

  // Choosing a handle is a one-time, visible change, so it needs the session
  // cookie from a real login wherever sessions are configured: a uuid alone
  // is known to everyone the account has chatted with.
  router.post("/handle", async (req, res) => {
    if (!handlesSupported()) {
      return res.status(503).json({ error: "Handles are off on this server" });
    }

    const uuid = process.env.ADMIN_TOKEN_SECRET
      ? readSession(req)?.uuid
      : req.headers["x-user-uuid"];
    if (!uuid || typeof uuid !== "string") {
      return res.status(401).json({ error: "sign_in_again" });
    }
    if (areAccountWritesFrozen()) {
      return res.status(503).json({ error: ACCOUNT_WRITES_FROZEN_ERROR });
    }

    try {
      const user = await accounts.setHandle(uuid, req.body?.handle);
      if (!user) return res.status(404).json({ error: "Account not found" });

      userCache.invalidateUser(user.uuid);
      res.status(200).json(user);
    } catch (error) {
      if (sendHandleError(res, error)) return;
      console.log(error);
      res.status(500).json({ error: "Couldn't save the handle" });
    }
  });

  // The presets the profile page offers. Like handles, avatars exist only
  // where accounts live in the local database.
  router.get("/avatar-config", (req, res) => {
    res.status(200).json({
      supported: handlesSupported(),
      avatars: handlesSupported() ? AVATAR_IDS : [],
    });
  });

  const avatarLimit = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: "Too many changes. Try again in a minute.",
  });

  // A picture everyone in chat sees, so like a handle it needs the session
  // cookie wherever sessions are configured. `avatar: null` clears it.
  router.post("/avatar", avatarLimit, async (req, res) => {
    if (!handlesSupported()) {
      return res.status(503).json({ error: "Avatars are off on this server" });
    }

    const uuid = process.env.ADMIN_TOKEN_SECRET
      ? readSession(req)?.uuid
      : req.headers["x-user-uuid"];
    if (!uuid || typeof uuid !== "string") {
      return res.status(401).json({ error: "sign_in_again" });
    }
    if (areAccountWritesFrozen()) {
      return res.status(503).json({ error: ACCOUNT_WRITES_FROZEN_ERROR });
    }

    try {
      const user = await accounts.setAvatar(uuid, req.body?.avatar ?? null);
      if (user === false) {
        return res.status(400).json({ error: "That avatar doesn't exist" });
      }
      if (!user) return res.status(404).json({ error: "Account not found" });

      userCache.invalidateUser(user.uuid);
      res.status(200).json({ avatar: user.avatar });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Couldn't save the avatar" });
    }
  });

  const lookupLimit = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: "Too many lookups. Try again in a minute.",
  });

  router.post("/handle-lookup", lookupLimit, async (req, res) => {
    if (!handlesSupported()) {
      return res.status(503).json({ error: "Handles are off on this server" });
    }

    const username = req.body?.username;
    if (typeof username !== "string" || !username.trim()) {
      return res.status(400).json({ error: "Enter your old username" });
    }
    if (username.length > 64) return res.status(200).json({ status: "none" });

    try {
      res.status(200).json(await accounts.lookupLegacyUsername(username));
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Couldn't look that up" });
    }
  });

  return router;
}

export default createAuthRouter();
