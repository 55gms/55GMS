import path from "path";
import compression from "compression";

const ONE_DAY = 24 * 60 * 60;
const ONE_WEEK = 7 * ONE_DAY;

// Files whose contents change without a URL change must always revalidate.
const REVALIDATE_EXTENSIONS = new Set([".html", ".json", ".txt", ".xml"]);
const REVALIDATE_FILES = new Set(["sw.js"]);

export const LONG_CACHE_CONTROL = `public, max-age=${ONE_DAY}, stale-while-revalidate=${ONE_WEEK}`;
export const REVALIDATE_CACHE_CONTROL = "no-cache";

export function getStaticCacheControl(filePath) {
  const base = path.basename(filePath).toLowerCase();
  if (REVALIDATE_FILES.has(base)) return REVALIDATE_CACHE_CONTROL;
  if (REVALIDATE_EXTENSIONS.has(path.extname(base))) {
    return REVALIDATE_CACHE_CONTROL;
  }
  return LONG_CACHE_CONTROL;
}

export function setStaticCacheHeaders(res, filePath) {
  res.setHeader("Cache-Control", getStaticCacheControl(filePath));
}

export const staticOptions = { setHeaders: setStaticCacheHeaders };

// For answers that depend on who is asking (accounts, saves, chat, billing).
// Browsers read Cache-Control; CDNs read CDN-Cache-Control or
// Surrogate-Control first where they support them; old proxies read Pragma
// and Expires. A Bunny pull zone with a cache-time override ignores all of
// these, which is why api-fetch in script.js also gives each GET its own URL.
export const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Surrogate-Control": "no-store",
  Pragma: "no-cache",
  Expires: "0",
};

export function setNoStoreHeaders(res) {
  for (const [name, value] of Object.entries(NO_STORE_HEADERS)) {
    res.setHeader(name, value);
  }
}

// Music proxy streams upstream bytes untouched (including range responses),
// so it must not be re-encoded.
export function shouldCompress(req, res) {
  if (req.path.startsWith("/api/music")) return false;
  return compression.filter(req, res);
}

export function createCompression() {
  return compression({ filter: shouldCompress });
}
