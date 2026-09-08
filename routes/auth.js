import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { User } from "../models/index.js";

const router = express.Router();

const SESSION_COOKIE_NAME = "site_session";

function normalizeUsername(value) {
  return String(value || "").trim();
}

function createSiteSession(data) {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", process.env.SESSION_SECRET || "55gms-default-dev-secret-change-me")
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

router.post("/signUp", async (req, res) => {
  let { password, username, premium = false, captchaResponse } = req.body;
  const cleanedUsername = normalizeUsername(username);

  if (!password || !cleanedUsername || !captchaResponse) {
    return res.status(400).json({ error: "Not enough arguments" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password too short" });
  }
  if (cleanedUsername.length < 3) {
    return res.status(400).json({ error: "Username too short" });
  }

  try {
    const existingUser = await User.findOne({
      where: { username: { [Op.iLike]: cleanedUsername } },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const isAdminUser =
      cleanedUsername.toLowerCase() === (process.env.ADMIN_USERNAME || "admin").toLowerCase();

    const user = await User.create({
      username: cleanedUsername,
      passwordHash,
      premium: Boolean(premium),
      admin: isAdminUser,
    });

    const sessionData = {
      uuid: user.id,
      username: user.username,
      premium: user.premium,
      admin: user.admin,
    };

    res.cookie(SESSION_COOKIE_NAME, createSiteSession(sessionData), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production" || req.secure || req.headers["x-forwarded-proto"] === "https",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      uuid: user.id,
      username: user.username,
      premium: user.premium,
    });
  } catch (error) {
    console.error("Signup auth failure:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body;
  const cleanedUsername = normalizeUsername(username);

  if (!cleanedUsername || !password) {
    return res.status(400).json({ error: "Not enough arguments" });
  }

  try {
    const user = await User.findOne({
      where: { username: { [Op.iLike]: cleanedUsername } },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const sessionData = {
      uuid: user.id,
      username: user.username,
      premium: user.premium,
    };

    res.cookie(SESSION_COOKIE_NAME, createSiteSession(sessionData), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production" || req.secure || req.headers["x-forwarded-proto"] === "https",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      uuid: user.id,
      username: user.username,
      premium: user.premium,
    });
  } catch (error) {
    console.error("Login auth failure:", error);
    res.status(500).json({ error: "Invalid username or password" });
  }
});

export default router;
