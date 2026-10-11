import express from "express";
import axios from "axios";
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
import { rateLimit } from "../utils/rateLimit.js";
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

async function verifyHcaptcha(captchaResponse) {
  const captchaVerifyResponse = await axios.post(
    "https://hcaptcha.com/siteverify",
    new URLSearchParams({
      secret: process.env.hcaptchaSecret,
      response: captchaResponse,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  if (!captchaVerifyResponse.data.success) {
    console.log(captchaVerifyResponse.data["error-codes"]);
    return false;
  }
  return true;
}

export function createAuthRouter({
  accounts = defaultAccounts,
  verifyCaptcha = verifyHcaptcha,
} = {}) {
  const router = express.Router();

  router.post("/signUp", async (req, res) => {
    // premium is never taken from the client
    let { password, username, captchaResponse } = req.body;

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

    try {
      if (!(await verifyCaptcha(captchaResponse))) {
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
