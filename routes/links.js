import { Router } from "express";
import { createHash, randomInt } from "node:crypto";
import { setNoStoreHeaders } from "../utils/httpPerformance.js";

const MAX_LINKS = 500;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseLinkUrls(value) {
  if (!value) return [];
  const urls = JSON.parse(value);
  if (!Array.isArray(urls) || urls.length > MAX_LINKS) {
    throw new Error(
      "LINKS_URLS must be a JSON array of at most 500 HTTPS URLs",
    );
  }
  return [
    ...new Set(
      urls.map((value) => {
        if (typeof value !== "string" || value.length > 2048) {
          throw new Error("Invalid link URL");
        }
        const url = new URL(value);
        if (url.protocol !== "https:" || url.username || url.password) {
          throw new Error("Link URLs must use HTTPS without credentials");
        }
        return url.href;
      }),
    ),
  ];
}

export function createLinksRouter(options = {}) {
  const router = Router();
  let urls = [];
  try {
    urls = parseLinkUrls(
      options.urls !== undefined
        ? JSON.stringify(options.urls)
        : process.env.LINKS_URLS,
    );
  } catch {
    console.warn("[links] Invalid LINKS_URLS; link reveals are disabled.");
  }
  const links = urls.map((url) => ({
    id: createHash("sha256").update(url).digest("hex").slice(0, 24),
    url,
  }));
  const adServerUrl = (
    options.adServerUrl ??
    process.env.ADS_SERVER_URL ??
    ""
  ).replace(/\/+$/, "");
  const apiKey = options.apiKey ?? process.env.ADS_API_KEY;
  const request = options.fetch ?? globalThis.fetch;
  const pick = options.randomIndex ?? randomInt;
  const available = Boolean(links.length && adServerUrl && apiKey);

  router.use((_req, res, next) => {
    setNoStoreHeaders(res);
    next();
  });
  router.get("/", (_req, res) => res.json({ available, total: links.length }));
  router.post("/reveal", async (req, res) => {
    if (!available) {
      return res
        .status(503)
        .json({ error: "Links are not available on this server yet." });
    }
    const { grant, used = [] } = req.body ?? {};
    if (
      !grant ||
      typeof grant.id !== "string" ||
      !UUID.test(grant.id) ||
      typeof grant.signature !== "string" ||
      !/^[A-Za-z0-9_-]{43}$/.test(grant.signature) ||
      !Array.isArray(used) ||
      used.length > MAX_LINKS ||
      used.some((id) => typeof id !== "string" || !/^[a-f0-9]{24}$/.test(id))
    ) {
      return res.status(400).json({ error: "A valid ad reward is required." });
    }
    const usedIds = new Set(used);
    const remaining = links.filter((link) => !usedIds.has(link.id));
    if (!remaining.length) {
      return res
        .status(409)
        .json({ error: "You have revealed every available link." });
    }
    try {
      // This upstream atomically consumes the signed grant once, across all
      // Node workers. A client-supplied success flag is never sufficient.
      const response = await request(`${adServerUrl}/api/v1/rewards/redeem`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ grantId: grant.id, signature: grant.signature }),
        signal: AbortSignal.timeout(15000),
        redirect: "error",
      });
      if (
        response.status >= 500 ||
        response.status === 429 ||
        response.status === 401
      ) {
        return res.status(503).json({
          error: "Reward verification is unavailable. Try again later.",
        });
      }
      if (!response.ok) {
        return res.status(403).json({
          error: "This ad reward is invalid or has already been used.",
        });
      }
      const reward = await response.json();
      if (
        reward.redeemed !== true ||
        reward.gameId !== "links" ||
        reward.rewardId !== "site-link"
      ) {
        return res.status(403).json({
          error: "This ad reward is invalid or has already been used.",
        });
      }
      return res.json({
        link: remaining[pick(remaining.length)],
        remaining: remaining.length - 1,
      });
    } catch {
      return res.status(503).json({
        error: "Reward verification is unavailable. Try again later.",
      });
    }
  });
  return router;
}
