import { readdirSync } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { getStaticCacheControl } from "./httpPerformance.js";

// Game files live in the 55gms/assets repo, whose misc/ mirrors static/misc/.
// Pages load them from jsDelivr through their <base>, but some games still ask
// this server (a page without the base, or a script that builds URLs from
// `location`). A file that is no longer on disk here is fetched from the mirror
// and passed through, so those requests keep working from the same origin.
const DEFAULT_BASE = "https://cdn.jsdelivr.net/gh/55gms/assets@main/misc/";

// Pages are always served from disk: jsDelivr serves HTML as plain text.
const PAGE = /\.html?$/i;
const PASS_HEADERS = [
  "content-type",
  "content-length",
  "content-range",
  "accept-ranges",
  "etag",
  "last-modified",
];
const UPSTREAM_TIMEOUT = 15_000;
const MISS_TTL = 5 * 60 * 1000;
const MISS_LIMIT = 5000;

export function mountGameAssetFallback(app, staticRoot) {
  const base = process.env.GAME_ASSETS_BASE || DEFAULT_BASE;
  let folders;
  try {
    folders = new Set(
      readdirSync(path.join(staticRoot, "misc"), { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name),
    );
  } catch {
    // A checkout without static/misc has no games to fall back for.
    return;
  }

  // Paths the mirror does not have either, so scanners do not turn into a
  // stream of requests to the CDN.
  const misses = new Map();
  const missed = (key) => {
    const at = misses.get(key);
    if (at === undefined) return false;
    if (Date.now() - at < MISS_TTL) return true;
    misses.delete(key);
    return false;
  };
  const remember = (key) => {
    if (misses.size >= MISS_LIMIT) misses.clear();
    misses.set(key, Date.now());
  };

  app.use("/misc", async (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    const file = req.path.slice(1);
    if (!path.extname(file) || PAGE.test(file)) return next();

    let folder;
    let target;
    try {
      folder = decodeURIComponent(file.split("/")[0]);
      target = new URL(file, base);
    } catch {
      return next();
    }
    // The URL parser resolves `..`, so check the result is still in the mirror.
    if (!folders.has(folder) || !target.href.startsWith(base)) return next();
    if (missed(target.pathname)) return next();

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT);
    res.on("close", () => controller.abort());

    let upstream;
    try {
      // Uncompressed, so Content-Length and Range describe the bytes we relay;
      // the compression middleware re-encodes text for the client.
      const headers = { "accept-encoding": "identity" };
      if (req.headers.range) headers.range = req.headers.range;
      upstream = await fetch(target, {
        method: req.method,
        headers,
        signal: controller.signal,
      });
    } catch {
      clearTimeout(timer);
      return res.headersSent ? undefined : next();
    }
    clearTimeout(timer);

    if (upstream.status !== 200 && upstream.status !== 206) {
      await upstream.body?.cancel().catch(() => {});
      // 404 is a file the mirror lacks; 403 is one over the CDN's size limit.
      if (upstream.status === 404 || upstream.status === 403) {
        remember(target.pathname);
      }
      return next();
    }

    res.status(upstream.status);
    for (const name of PASS_HEADERS) {
      const value = upstream.headers.get(name);
      if (value) res.setHeader(name, value);
    }
    res.setHeader("Cache-Control", getStaticCacheControl(file));
    if (req.method === "HEAD" || !upstream.body) return res.end();

    try {
      await pipeline(Readable.fromWeb(upstream.body), res);
    } catch {
      res.destroy();
    }
  });
}
