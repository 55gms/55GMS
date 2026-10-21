import express from "express";
const router = express.Router();
import requestIp from "request-ip";
import { getJsonCache, setJsonCache } from "../utils/redisCache.js";

// Suggestions are the same for every visitor, so one lookup serves all ten
// workers for a while, and the browser may keep them too.
const SUGGESTION_TTL_SECONDS = 10 * 60;
const SUGGESTION_TIMEOUT_MS = 2000;
const MAX_QUERY_LENGTH = 200;

router.get("/autocomplete", async (req, res) => {
  const q = String(req.query.q || "")
    .trim()
    .toLowerCase()
    .slice(0, MAX_QUERY_LENGTH);
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (!q) return res.json([]);

  const cacheKey = `autocomplete:${q}`;
  const cached = await getJsonCache(cacheKey);
  if (cached) {
    res.setHeader("Cache-Control", `public, max-age=${SUGGESTION_TTL_SECONDS}`);
    return res.json(cached);
  }

  const duckUrl = `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}`;

  try {
    const response = await fetch(duckUrl, {
      signal: AbortSignal.timeout(SUGGESTION_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`DuckDuckGo answered ${response.status}`);
    const data = await response.json();

    void setJsonCache(cacheKey, data, SUGGESTION_TTL_SECONDS);
    res.setHeader("Cache-Control", `public, max-age=${SUGGESTION_TTL_SECONDS}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

router.get("/ip", (req, res) => {
  const clientIp = requestIp.getClientIp(req);
  const ip = clientIp || "127.0.0.1";
  const cleanIp = ip.includes("::ffff:") ? ip.replace("::ffff:", "") : ip;
  const prefix = cleanIp.split(".")[0];

  res.send(prefix);
});

export default router;
