// Copies a web game by doing what you would do by hand
// in the DevTools Network tab: load the game, save every file it requests into
// a matching folder structure, then open the copy and fetch whatever 404s.
//
//   node scripts/rip-game.js <url> [--name <folder>] [--headless] [--wait 30]
//                                  [--rounds 5] [--force]
//
// By default Chrome opens visibly so you can click through the menus and a
// level (games load most assets lazily); press Enter in the terminal when done.
// With --headless the script waits --wait seconds instead.
//
// If the URL is a portal page, the script follows the largest iframe (nested
// ones too) down to the game itself and only keeps what that frame requested.
// Files from other hosts land in _ext/<host>/ and their URLs in the saved
// HTML/JS/CSS are rewritten to /misc/<name>/_ext/..., so the folder has to keep
// its name.
//
// The pages (*.html) end up in static/misc/<name>/; every other file ends up in
// the 55gms/assets clone under misc/<name>/, which is what jsDelivr serves.
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { chromium } from "playwright-core";
import {
  filesDir,
  isPage,
  pagesDir,
  requireAssetsRepo,
} from "./lib/gameFiles.js";

const args = process.argv.slice(2);
const flags = new Set(["headless", "force"]);
const options = {};
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (!args[i].startsWith("--")) positional.push(args[i]);
  else if (flags.has(args[i].slice(2))) options[args[i].slice(2)] = true;
  else options[args[i].slice(2)] = args[++i];
}
const startUrl = positional[0];
if (!startUrl || !/^https?:\/\//.test(startUrl)) {
  console.error(
    "Usage: node scripts/rip-game.js <url> [--name <folder>] [--headless] [--wait 30] [--rounds 5] [--force]",
  );
  process.exit(1);
}
const waitMs = (Number(options.wait) || 30) * 1000;
const maxRounds = Number(options.rounds) || 5;
const name = (
  options.name ||
  new URL(startUrl).pathname.split("/").filter(Boolean).at(-1) ||
  new URL(startUrl).hostname
)
  .toLowerCase()
  .replace(/\.[a-z0-9]+$/, "")
  .replace(/[^a-z0-9-_]+/g, "-");

// The copy is assembled in the assets clone; its pages move to this repo at
// the end, since the site serves pages and jsDelivr serves everything else.
requireAssetsRepo();
const outDir = filesDir(name);
const pageDir = pagesDir(name);
const prefix = `/misc/${name}/`;
for (const dir of [outDir, pageDir]) {
  if (!fs.existsSync(dir)) continue;
  if (!options.force) {
    console.error(`${dir} already exists (use --force or --name)`);
    process.exit(1);
  }
  fs.rmSync(dir, { recursive: true });
}

// Ads and analytics: never saved, and blocked when checking the local copy.
const SKIP_HOSTS = new RegExp(
  // Known networks...
  "(^|\\.)(google-analytics\\.com|googletagmanager\\.com|googletagservices\\.com|googlesyndication\\.com|doubleclick\\.net|google\\.com|gstatic\\.com|imasdk\\.googleapis\\.com|facebook\\.(net|com)|adnxs\\.com|amazon-adsystem\\.com|cloudflareinsights\\.com|scorecardresearch\\.com|hotjar\\.com|clarity\\.ms|adinplay\\.com|gamemonetize\\.com|gamedistribution\\.com|pubmatic\\.com|rubiconproject\\.com|criteo\\.(com|net)|taboola\\.com|outbrain\\.com|sentry\\.io|openx\\.net|openxcdn\\.net|id5-sync\\.com|adsrvr\\.org|turn\\.com|creativecdn\\.com|crwdcntrl\\.net|yahoo\\.com|im-apps\\.net|mgaru\\.dev|mygaru\\.com|applixir\\.com|adplus\\.io|33across\\.com|casalemedia\\.com|smartadserver\\.com|sharethrough\\.com|liadm\\.com|bidswitch\\.net)$" +
    // ...and anything whose hostname says what it is.
    "|(^|[.-])(ads?|adserver|analytics|rtb|bid|prebid|sync|track(ing|er)?|pixel|metrics|telemetry|dmp)\\d*[.-]",
);
// Same idea for ad tech served off a general-purpose CDN.
const SKIP_PATHS = /\/(prebid|pubcid|gpt|adsbygoogle)[./-]|\/gh\/prebid\//i;
const TEXT_EXT = /\.(html?|js|mjs|css|json|xml|svg|txt)$/i;
const MIME = {
  html: "text/html",
  htm: "text/html",
  js: "text/javascript",
  mjs: "text/javascript",
  css: "text/css",
  json: "application/json",
  wasm: "application/wasm",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  mp3: "audio/mpeg",
  ogg: "audio/ogg",
  wav: "audio/wav",
  m4a: "audio/mp4",
  mp4: "video/mp4",
  webm: "video/webm",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  xml: "application/xml",
  txt: "text/plain",
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const skipped = (url) => {
  const u = new URL(url);
  return SKIP_HOSTS.test(u.hostname) || SKIP_PATHS.test(u.pathname);
};

let gameUrl; // URL of the frame that holds the game
let gameRoot; // its directory, e.g. https://host/games/slime/
const saved = new Map(); // relative path -> source URL
const sources = new Map(); // source URL (no query/hash) -> relative path

// Where a URL lives inside the game folder, or null if it cannot be mirrored.
function localPath(url) {
  const u = new URL(url);
  let pathname;
  try {
    pathname = decodeURIComponent(u.pathname);
  } catch {
    pathname = u.pathname;
  }
  if (pathname.endsWith("/")) pathname += "index.html";
  let rel;
  if (u.origin + u.pathname === gameUrl.origin + gameUrl.pathname) {
    rel = "index.html";
  } else if (
    u.origin === gameRoot.origin &&
    pathname.startsWith(gameRoot.pathname)
  ) {
    rel = pathname.slice(gameRoot.pathname.length);
  } else {
    rel = `_ext/${u.host.replace(":", "_")}${pathname}`;
  }
  const parts = rel.split("/");
  if (parts.some((part) => !part || part === "." || part === "..")) return null;
  return parts.map((part) => part.replace(/[<>:"|?*\\]/g, "_")).join("/");
}

// The URL a local path was (or would have been) served from.
function sourceUrl(rel, search = "") {
  if (saved.has(rel)) return saved.get(rel);
  const ext = rel.match(/^_ext\/([^/]+)\/(.*)$/);
  const encoded = (ext ? ext[2] : rel)
    .split("/")
    .map(encodeURIComponent)
    .join("/");
  return ext
    ? `https://${ext[1].replace("_", ":")}/${encoded}${search}`
    : new URL(encoded + search, gameRoot).href;
}

function save(url, body, encoding = "") {
  const rel = localPath(url);
  if (!rel || saved.has(rel)) return false;
  // Browsers hand back decoded bytes; a file that is *named* as compressed
  // (Unity's .br/.gz builds) has to be stored compressed again.
  if (/\.(br|unityweb)$/i.test(rel) && encoding === "br") {
    body = zlib.brotliCompressSync(body, {
      params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 9 },
    });
  } else if (/\.(gz|unityweb)$/i.test(rel) && encoding === "gzip") {
    body = zlib.gzipSync(body);
  }
  const file = path.join(outDir, rel);
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body);
  } catch (error) {
    // A URL used both as a file and as a directory, or a name too long.
    console.warn(`  could not write ${rel}: ${error.code || error.message}`);
    return false;
  }
  saved.set(rel, url);
  const u = new URL(url);
  sources.set(u.origin + u.pathname, rel);
  return true;
}

// Resolves once no response has arrived for `quiet` ms (or after `max`).
function settle(activity, quiet = 3000, max = 45000) {
  const started = Date.now();
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      const now = Date.now();
      if (now - activity.last >= quiet || now - started >= max) {
        clearInterval(timer);
        resolve();
      }
    }, 250);
  });
}

// Follows the biggest iframe on each level down to the game.
async function findGameFrame(page, activity) {
  let frame = page.mainFrame();
  for (let depth = 0; depth < 6; depth++) {
    const viewport = page.viewportSize();
    let best = null;
    for (const child of frame.childFrames()) {
      if (!/^https?:/.test(child.url()) || skipped(child.url())) continue;
      const box = await child
        .frameElement()
        .then((element) => element.boundingBox())
        .catch(() => null);
      const area = box ? box.width * box.height : 0;
      if (area < viewport.width * viewport.height * 0.2) continue;
      if (!best || area > best.area) best = { frame: child, area };
    }
    if (!best) break;
    frame = best.frame;
    console.log(`  ${"  ".repeat(depth)}iframe -> ${frame.url()}`);
    await frame.waitForLoadState("load", { timeout: 30000 }).catch(() => {});
    await settle(activity);
  }
  return frame;
}

function inFrame(frame, target) {
  for (let f = frame; f; f = f.parentFrame()) if (f === target) return true;
  return false;
}

function waitForEnter(message) {
  console.log(message);
  return new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.once("data", () => {
      process.stdin.pause();
      resolve();
    });
  });
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Points absolute URLs in saved text files at the local copies.
function rewrite(files) {
  const absolute = []; // [url without scheme, local absolute path]
  const rootRelative = []; // [/path on the game's origin, local absolute path]
  for (const [source, rel] of sources) {
    const u = new URL(source);
    const inside = !rel.startsWith("_ext/");
    const target = prefix + rel.split("/").map(encodeURIComponent).join("/");
    if (!inside || u.origin !== gameRoot.origin) {
      absolute.push([`//${u.host}${u.pathname}`, target]);
    }
    if (u.origin === gameRoot.origin && !inside && u.pathname.length > 1) {
      rootRelative.push([u.pathname, target]);
    }
  }
  // Longest first so /a/b.js is not clobbered by a rewrite of /a/b
  absolute.sort((a, b) => b[0].length - a[0].length);
  let changed = 0;
  for (const rel of files) {
    if (!TEXT_EXT.test(rel)) continue;
    const file = path.join(outDir, rel);
    const before = fs.readFileSync(file, "utf8");
    let text = before;
    for (const [from, to] of absolute) {
      if (!text.includes(from)) continue;
      text = text.replace(
        new RegExp(`(?:https?:)?${escapeRegExp(from)}(?![\\w.%-])`, "g"),
        to,
      );
    }
    for (const [from, to] of rootRelative) {
      if (!text.includes(from)) continue;
      // Only whole quoted strings and url(...) values, optionally with a query
      text = text.replace(
        new RegExp(`(["'\`(=])${escapeRegExp(from)}(?=["'\`)?#\\s>])`, "g"),
        `$1${to}`,
      );
    }
    if (text !== before) {
      fs.writeFileSync(file, text);
      changed++;
    }
  }
  return changed;
}

function serve() {
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = null;
    if (pathname.startsWith(prefix)) {
      file = path.join(outDir, pathname.slice(prefix.length));
      if (pathname.endsWith("/")) file = path.join(file, "index.html");
    }
    if (
      !file ||
      !file.startsWith(outDir) ||
      !fs.existsSync(file) ||
      !fs.statSync(file).isFile()
    ) {
      res.writeHead(404).end();
      return;
    }
    const type =
      MIME[path.extname(file).slice(1).toLowerCase()] ||
      "application/octet-stream";
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () => resolve(server)),
  );
}

const browser = await chromium.launch({
  channel: "chrome",
  headless: Boolean(options.headless),
  args: ["--autoplay-policy=no-user-gesture-required", "--mute-audio"],
});
const contextOptions = {
  viewport: { width: 1280, height: 720 },
  // A service worker would answer requests where we cannot see them.
  serviceWorkers: "block",
};

// 1. Capture: load the original and keep everything the game frame requests.
console.log(`Loading ${startUrl}`);
const context = await browser.newContext(contextOptions);
const page = await context.newPage();
const activity = { last: Date.now() };
const responses = [];
page.on("response", (response) => {
  activity.last = Date.now();
  const request = response.request();
  if (request.method() !== "GET" || !/^https?:/.test(response.url())) return;
  if (response.status() < 200 || response.status() >= 300) return;
  let frame = null;
  try {
    frame = request.frame();
  } catch {
    // Requests made by a worker belong to no frame.
  }
  responses.push({
    response,
    frame,
    // A 206 is one slice of a file; the whole thing is fetched again below.
    body: response.status() === 206 ? null : response.body().catch(() => null),
  });
});
await page.goto(startUrl, { waitUntil: "load", timeout: 60000 });
await settle(activity);
const gameFrame = await findGameFrame(page, activity);
gameUrl = new URL(gameFrame.url());
gameRoot = new URL("./", gameUrl);
console.log(`Game root: ${gameRoot.href}`);

if (options.headless) {
  console.log(`Waiting ${waitMs / 1000}s for the game to load its assets...`);
  await sleep(waitMs);
  await settle(activity);
} else {
  await waitForEnter(
    "Play through the menus and a level in the Chrome window, then press Enter here.",
  );
}

async function download(url) {
  const response = await context.request.get(url, {
    headers: { Referer: gameUrl.href },
    timeout: 120000,
    failOnStatusCode: false,
  });
  if (!response.ok()) return null;
  return {
    body: await response.body(),
    encoding: response.headers()["content-encoding"],
  };
}

const firstPass = [];
for (const { response, frame, body } of responses) {
  const url = response.url();
  if (skipped(url)) continue;
  if (frame ? !inFrame(frame, gameFrame) : gameFrame !== page.mainFrame())
    continue;
  let bytes = body && (await body);
  let encoding = response.headers()["content-encoding"] || "";
  // Chrome hands back an empty body for some responses it has already
  // dropped (images decoded in a worker, for one), so those are fetched again.
  const empty =
    bytes && !bytes.length && response.headers()["content-length"] !== "0";
  if (!bytes || empty) {
    const again = await download(url).catch(() => null);
    if (!again) continue;
    ({ body: bytes, encoding = "" } = again);
  }
  // Also store the file under every URL that redirected to it.
  const chain = [url];
  for (let r = response.request().redirectedFrom(); r; r = r.redirectedFrom()) {
    if (!skipped(r.url())) chain.push(r.url());
  }
  for (const link of chain) {
    if (save(link, bytes, encoding)) firstPass.push(localPath(link));
  }
}
// The context stays open: download() uses its cookies for the gap-filling below.
await page.close();
if (!saved.has("index.html")) {
  console.error(
    "The game page itself was not captured; nothing usable was saved.",
  );
  await browser.close();
  process.exit(1);
}
console.log(`Saved ${saved.size} files from the live page`);
const rewritten = rewrite(firstPass);
if (rewritten) console.log(`Rewrote URLs in ${rewritten} files`);

// 2. Verify: open the copy, fetch what 404s from the original, repeat.
const server = await serve();
const local = `http://127.0.0.1:${server.address().port}`;
let missing = new Map(); // relative path -> reason
let external = new Set();
let outside = new Set();
const pageErrors = new Set();
const screenshot = path.join(os.tmpdir(), `rip-${name}.png`);
for (let round = 1; round <= maxRounds; round++) {
  const verify = await browser.newContext(contextOptions);
  const check = await verify.newPage();
  const seen = { last: Date.now() };
  const notFound = new Map(); // relative path -> query string
  external = new Set();
  outside = new Set();
  await check.route("**/*", (route) => {
    const url = route.request().url();
    if (url.startsWith(local) || !/^https?:/.test(url)) return route.continue();
    // The copy must stand on its own, so nothing off-site gets through.
    if (!skipped(url)) external.add(url.split("?")[0]);
    return route.abort();
  });
  check.on("response", (response) => {
    seen.last = Date.now();
    if (response.status() !== 404 || !response.url().startsWith(local)) return;
    const u = new URL(response.url());
    const pathname = decodeURIComponent(u.pathname);
    if (pathname.startsWith(prefix))
      notFound.set(pathname.slice(prefix.length), u.search);
    else if (pathname !== "/favicon.ico") outside.add(pathname);
  });
  check.on("pageerror", (error) =>
    pageErrors.add(error.message.split("\n")[0]),
  );
  await check.goto(`${local}${prefix}index.html`, {
    waitUntil: "load",
    timeout: 60000,
  });
  await settle(seen);
  await sleep(Math.min(waitMs, 15000));
  await settle(seen);
  await check.screenshot({ path: screenshot }).catch(() => {});
  await verify.close();

  const filled = [];
  for (const [rel, search] of notFound) {
    if (missing.has(rel)) continue;
    const url = sourceUrl(rel.endsWith("/") ? `${rel}index.html` : rel, search);
    const result = await download(url).catch(() => null);
    // A site's "not found" page comes back as 200 HTML; do not save it as an asset.
    const bogus =
      result &&
      !/\.html?$/i.test(rel) &&
      /^\s*<(!doctype|html)/i.test(result.body.subarray(0, 100).toString());
    if (
      result &&
      !bogus &&
      save(url.split("?")[0], result.body, result.encoding)
    ) {
      filled.push(localPath(url.split("?")[0]));
    } else {
      missing.set(rel, url);
    }
  }
  rewrite(filled);
  console.log(
    `Round ${round}: ${notFound.size} missing locally, fetched ${filled.length} from the original`,
  );
  if (!filled.length) break;
}
server.close();
await browser.close();

// 3. Report
let bytes = 0;
const big = [];
for (const rel of saved.keys()) {
  const size = fs.statSync(path.join(outDir, rel)).size;
  bytes += size;
  if (size > 95 * 1024 * 1024) big.push(rel);
}
const list = (title, items) => {
  if (!items.length) return;
  console.log(`\n${title}`);
  for (const item of items.slice(0, 40)) console.log(`  ${item}`);
  if (items.length > 40) console.log(`  ...and ${items.length - 40} more`);
};
const pages = [...saved.keys()].filter(isPage);
for (const rel of pages) {
  const target = path.join(pageDir, rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.renameSync(path.join(outDir, rel), target);
}
console.log(
  `\n${name}: ${saved.size} files, ${(bytes / 1024 / 1024).toFixed(1)} MB`,
);
console.log(`  pages (${pages.length}): ${pageDir}`);
console.log(`  files (${saved.size - pages.length}): ${outDir}`);
list("Still missing (the original server does not have them either):", [
  ...missing.values(),
]);
list("Still requested from other sites (blocked in the check):", [...external]);
list("Requested outside the game folder (fix these paths by hand):", [
  ...outside,
]);
list("Script errors in the local copy:", [...pageErrors]);
list("Over GitHub's 100 MB file limit:", big);
console.log(`\nScreenshot of the local copy: ${screenshot}`);
console.log(`Check it: node scripts/check-game.js ${name}`);
