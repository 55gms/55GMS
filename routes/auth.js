import express from "express";
import axios from "axios";
import defaultAccounts, {
  ACCOUNT_WRITES_FROZEN_ERROR,
  areAccountWritesFrozen,
} from "../services/accounts.js";
import { clearSessionCookie, setSessionCookie } from "../utils/sessionToken.js";

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
    if (password.length < 6) {
      return res.status(400).json({ error: "Password too short" });
    }
    if (username.length < 3) {
      return res.status(400).json({ error: "Username too short" });
    }
    if (areAccountWritesFrozen()) {
      return res.status(503).json({ error: ACCOUNT_WRITES_FROZEN_ERROR });
    }

    try {
      if (!(await verifyCaptcha(captchaResponse))) {
        return res.status(400).json({ error: "Invalid CAPTCHA" });
      }

      const user = await accounts.createUser({ username, password });

      setSessionCookie(req, res, user.uuid);
      res.status(200).json(user);
    } catch (error) {
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
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Invalid Email or password" });
    }
  });

  router.post("/logout", (req, res) => {
    clearSessionCookie(req, res);
    res.status(200).json({ success: true });
  });

  return router;
}

export default createAuthRouter();
