import { readdirSync, statSync } from "node:fs";
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
const IMPORTED_BASE =
  "https://cdn.jsdelivr.net/gh/55gms/assets@d9deca77d305dcc8fbfce6c068865a4c374812cb/misc/";
const IMPORTED_FOLDERS = new Set([
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
    if (!path.extname(file) || PAGE.test(file)) return next();

    let folder;
    let target;
    let selectedBase;
    try {
      folder = decodeURIComponent(file.split("/")[0]);
      selectedBase =
        !process.env.GAME_ASSETS_BASE && IMPORTED_FOLDERS.has(folder)
          ? IMPORTED_BASE
          : base;
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
