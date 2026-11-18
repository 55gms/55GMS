import express from "express";
import zlib from "node:zlib";
import { rateLimit } from "../utils/rateLimit.js";
import { findAnswer, getDay, getReveal, isDate } from "../services/krillion.js";

// The API the Krillion page under /misc/krillion/ talks to, answered from the
// day's cached copy (services/krillion.js). Everything else the real site
// offers (accounts, friends, archive, packs, Puffer Party) needs its live
// servers, and the page sends those links to the proxy instead.
const MAX_ANSWER_LENGTH = 120;

export function createKrillionRouter() {
  const router = express.Router();

  const submitLimit = rateLimit({
    windowMs: 60_000,
    max: 90,
    message: "Too many answers. Wait a moment.",
  });

  // A day that cannot be loaded at all (first boot with krillion.io down).
  const withDay = async (req, res, next) => {
    try {
      req.krillionDay = await getDay();
      next();
    } catch {
      res.status(503).json({ error: "Today's prompts are not available yet" });
    }
  };

  router.get("/today", withDay, (req, res) => {
    res.set("Cache-Control", "public, max-age=30");
    res.type("json").send(req.krillionDay.todayText);
  });

  router.get("/reveal", withDay, async (req, res) => {
    const date =
      req.query.date === undefined ? req.krillionDay.date : req.query.date;
    if (!isDate(date)) return res.status(400).json({ error: "Bad date" });
    try {
      const gz = await getReveal(date);
      if (!gz) return res.status(404).json({ error: "That day is not cached" });
      res.set({
        "Cache-Control": "public, max-age=600",
        Vary: "Accept-Encoding",
      });
      res.type("json");
      if (req.acceptsEncodings("gzip")) {
        res.set("Content-Encoding", "gzip");
        return res.send(gz);
      }
      res.send(zlib.gunzipSync(gz));
    } catch {
      res.status(500).json({ error: "Could not read that day" });
    }
  });

  // Scores what the player typed against the day's answer table. There is no
  // leaderboard here, so no receipt comes back.
  router.post("/submit", submitLimit, withDay, (req, res) => {
    const day = req.krillionDay;
    const { date, promptId, answer } = req.body ?? {};
    if (date !== day.date) {
      return res.status(409).json({ error: "That day is over" });
    }
    if (typeof promptId !== "string" || !day.prompts.has(promptId)) {
      return res.status(400).json({ error: "Unknown prompt" });
    }
    if (typeof answer !== "string" || answer.length > MAX_ANSWER_LENGTH) {
      return res.json({ accepted: false });
    }
    const found = findAnswer(day, promptId, answer);
    if (!found) return res.json({ accepted: false });
    res.json({
      accepted: true,
      tier: found.tier,
      score: found.score,
      answer: found.answer,
      ...(found.quip ? { quip: found.quip } : {}),
    });
  });

  router.get("/announcements/current", withDay, (req, res) => {
    res.json({
      announcement: null,
      expiresAt: new Date(req.krillionDay.resetsAtMs).toISOString(),
    });
  });

  // Finished days are not recorded anywhere but the player's own browser.
  router.post("/today/complete", (req, res) => {
    res.json({ ok: true });
  });

  router.use("/account", (req, res) => {
    res.status(401).json({ error: "Accounts are on krillion.io" });
  });
  router.use((req, res) => {
    res.status(404).json({ error: "Not part of the cached daily game" });
  });

  return router;
}
