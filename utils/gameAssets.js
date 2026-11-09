import { readdirSync, statSync, existsSync, readFileSync } from "node:fs";
import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { getStaticCacheControl } from "./httpPerformance.js";

// Game files live in the 55gms/assets repo, whose misc/ mirrors static/misc/.
// Pages load them from jsDelivr through their <base>, but some games still ask
// this server (a page without the base, or a script that builds URLs from
// `location`). A file that is no longer on disk here is fetched from the mirror
// and passed through, so those requests keep working from the same origin.
const DEFAULT_BASE =
  "https://cdn.jsdelivr.net/gh/55gms/assets@e899179b25ba3966a87383c0e4092168d9513472/misc/";
const IMPORTED_CSP = "default-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'self' data: blob:; style-src 'self' 'unsafe-inline' data:; img-src 'self' data: blob:; media-src 'self' data: blob:; font-src 'self' data:; worker-src 'self' blob:; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'";
const APP_ROOT = fileURLToPath(new URL("../", import.meta.url));
export function importedAssetsRoot() {
  if (process.env.GAME_ASSETS_ROOT) return path.resolve(process.env.GAME_ASSETS_ROOT);
  const pin = JSON.parse(readFileSync(path.join(APP_ROOT, "docs/game-imports/asset-mirror.json"), "utf8"));
  const installed = path.join(APP_ROOT, ".game-assets", pin.commit);
  return existsSync(installed) ? installed : path.resolve(APP_ROOT, "../assets");
}
const IMPORTED_FOLDERS = new Set([
  "steep-descent",
  "gta-vice-city",
  "rooftop-run",
  "shrek-escape",
  "mr-dude",
  "driven-wild",
  "supermarket-simulator",
  "climb-hard",
  "cs-1-6",
  "obby-99-will-lose",
  "draw-climber",
  "chicken-royale",

  "half-life",
  "nitro-car",
  "delivery-mystery",
  "dig-out-of-prison",
  "call-of-battle",
  "unreal-drift",
  "scary-shawarma-kiosk",
  "ks2-teams",
  "mad-pursuit",

  "real-kart",
  "two-ball-3d",
  "blocky-snakes",
  "search-for-the-needle",
  "obby-snowboard",
  "crazy-roll",
  "granny-2",
  "vavex",
  "fly-the-plane",
  "slap-aura",
  "ragdoll-freefall",
  "jacksmith",
  "swords-and-souls",
  "cactus-mccoy",
  "cactusmccoy2",
  "super-mario-63",
  "achievement-unlocked",
  "dont-escape",
  "dont-escape-2",
  "dont-escape-3",
  "warfare-1917",
  "the-enchanted-cave",
  "gun-mayhem",
  "swords-and-sandals-2",
  "the-last-stand",
  "strike-force-heroes-2",
  "bloons-supermonkey",
  "city-siege",
  "city-siege-2",
  "city-siege-3",
  "city-siege-4",
  "shopping-cart-hero",
  "grow-island",
  "grow-valley",
  "armor-mayhem",
  "electric-box-2",
  "civiballs",
  "papas-bakeria",
  "papa-louie-2-when-burgers-attack",
  "diggy",
  "murloc",
  "madness-accelerant",
  "boxhead-2play-rooms",
  "endless-war-3",
  "armed-with-wings",
  "stick-war-2",
  "dragon-fist-3",
  "miami-shark",
  "rage-3",
  "flood-runner-2",
  "dads-me",
  "plazma-burst",
  "strike-force-kitty",
  "strike-force-kitty-2",
  "strike-force-kitty-3",
  "browman",
  "ricochet-kills",
  "interactive-buddy",
  "dead-zed",
  "3-slices",
  "effing-worms",
  "effing-hail",
  "dragon-ball-devolution",
  "bomb-it-4",
  "bounzy-2",
  "commando",
  "intrusion",
  "gunmaster-onslaught",
  "giants-and-dwarves-td",
  "gretel-and-hansel-1",
  "obey-the-game",
  "black-knight",
  "crazy-penguin-catapult",
  "achilles",
  "thing-thing-4",
  "sift-heads-world-ultimatum",
  "animal-raceway",
  "drag-racer-v3",
  "ragdoll-achievement",
  "gold-miner-2",
  "crazy-flasher-3",
  "gravity-driver",
  "weapon",
  "smileys-war",
  "batman-the-cobblebot-caper",
  "acid-bunny",
  "dead-samurai",
  "dog-vs-cat",
  "alone-in-the-madness",
  "dragon-ball-kart",
  "endless-war-7",
  "storm-ops-4",
  "effing-worms-2",
  "supermario-world-flash",
  "1-on-1-basketball",
  "santa-run-2",
  "axis-football-league",
  "siegius",
  "aqua-turret",
  "ownage-burst",
  "overkill-apache",
]);

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
  const sourceBackups = JSON.parse(readFileSync(path.join(APP_ROOT, "docs/game-imports/asset-mirror.json"), "utf8")).upstreamBackups || [];
  async function backupImported(req, res, next) {
    let file;
    try { file = decodeURIComponent(req.path.slice(1)); } catch { return res.status(404).end(); }
    const source = sourceBackups.find(item => file.startsWith(item.folder + "/" + item.prefix));
    if (!source) return res.status(404).end();
    const suffix = file.slice(source.folder.length + 1 + source.prefix.length);
    const target = new URL(suffix, source.url);
    if (!target.href.startsWith(source.url)) return res.status(404).end();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT);
    try {
      const headers = { "accept-encoding": "identity" };
      if (req.headers.range) headers.range = req.headers.range;
      const upstream = await fetch(target, {method:req.method, headers, signal:controller.signal});
      if (![200,206].includes(upstream.status)) { await upstream.body?.cancel(); return res.status(404).end(); }
      console.warn(`[game-assets] local mirror miss; source backup used: ${file}`);
      res.status(upstream.status);
      for (const name of PASS_HEADERS) { const value=upstream.headers.get(name); if(value)res.setHeader(name,value); }
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("X-Game-Asset-Source", "upstream-backup");
      res.setHeader("Content-Security-Policy", IMPORTED_CSP);
      if(req.method === "HEAD" || !upstream.body) return res.end();
      await pipeline(Readable.fromWeb(upstream.body),res);
    } catch (error) { if(res.headersSent)res.destroy();else res.status(502).end(); }
    finally { clearTimeout(timer); }
  }
  const localImported = express.static(path.join(importedAssetsRoot(), "misc"), {
    index: false, redirect: false,
    setHeaders(res, file) {
      res.setHeader("Cache-Control", getStaticCacheControl(file));
      res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
      res.setHeader("Content-Security-Policy", IMPORTED_CSP);
    },
  });
  let folders;
  try {
    // In a build, each game folder is a symlink to static/misc (prepare.js),
    // so the check follows links.
    const misc = path.join(staticRoot, "misc");
    folders = new Set(
      readdirSync(misc).filter((name) => {
        try {
          return statSync(path.join(misc, name)).isDirectory();
        } catch {
          return false;
        }
      }),
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
    let importedFolder;
    try { importedFolder = decodeURIComponent(file.split("/")[0]); } catch { return next(); }
    if (IMPORTED_FOLDERS.has(importedFolder)) {
      // Prefer committed local files. A recorded source is an emergency backup;
      // misses are logged so the next mirror update can include them.
      return localImported(req, res, (error) => {
        if (error) return next(error);
        // Engines also request StreamingAssets relative to the page instead of
        // their recorded source root. Resolve those against the local mirror.
        const suffix = file.slice(importedFolder.length + 1);
        for (const source of sourceBackups.filter(item => item.folder === importedFolder)) {
          const relative = importedFolder + "/" + source.prefix + suffix;
          const root = path.join(importedAssetsRoot(), "misc");
          const candidate = path.resolve(root, relative);
          if (candidate.startsWith(root + path.sep) && existsSync(candidate) && statSync(candidate).isFile()) {
            const original = req.url;
            req.url = "/" + relative.split("/").map(encodeURIComponent).join("/");
            return localImported(req, res, (failure) => { req.url = original; if(failure)return next(failure);return backupImported(req,res,next); });
          }
        }
        return backupImported(req, res, next);
      });
    }
    if (!path.extname(file) || PAGE.test(file)) return next();

    let folder;
    let target;
    let selectedBase;
    try {
      folder = decodeURIComponent(file.split("/")[0]);
      selectedBase = base;
      target = new URL(file, selectedBase);
    } catch {
      return next();
    }
    // The URL parser resolves `..`, so check the result is still in the mirror.
    if (!folders.has(folder) || !target.href.startsWith(selectedBase))
      return next();
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
