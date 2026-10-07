// Loads one game page in headless Chrome and reports what breaks, before the
// game's files have reached GitHub. Requests to the page's jsDelivr base for
// 55gms/55gms are answered from static/misc/<folder>/ the way the CDN would
// answer them (CORS headers, 404 for missing files, 403 over 20 MB), so the
// page is tested exactly as committed.
//
//   node scripts/check-game.js <folder> [--wait 15] [--live] [--shot <png>]
//
// --live skips the mapping and uses the real CDN (after the files are pushed).
// Exits 1 when a request fails or the page throws.
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
};
const folder = args[0];
if (!folder || folder.startsWith("--")) {
  console.error(
    "Usage: node scripts/check-game.js <folder> [--wait 15] [--live] [--shot <png>]",
  );
  process.exit(1);
}
const waitMs = (Number(option("wait")) || 15) * 1000;
const live = args.includes("--live");
const shot = option("shot", path.join(os.tmpdir(), `check-${folder}.png`));

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const staticDir = path.join(root, "static");
const gameDir = path.join(staticDir, "misc", folder);
const entryPage = path.join(gameDir, "index.html");
if (!fs.existsSync(entryPage)) {
  console.error(`No static/misc/${folder}/index.html`);
  process.exit(1);
}

const CDN = new RegExp(
  `^https://cdn\\.jsdelivr\\.net/gh/55gms/55gms@[^/]+/static/misc/${folder}/`,
  "i",
);
const CDN_LIMIT = 20_000_000;
const MIME = {
  html: "text/html",
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
  otf: "font/otf",
};
const mime = (file) =>
  MIME[path.extname(file).slice(1).toLowerCase()] || "application/octet-stream";

// The site itself is not needed, only its static files.
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(staticDir, pathname);
  if (pathname.endsWith("/")) file = path.join(file, "index.html");
  if (
    !file.startsWith(staticDir) ||
    !fs.existsSync(file) ||
    !fs.statSync(file).isFile()
  ) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, {
    "Content-Type": mime(file),
    "Cache-Control": "no-store",
  });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const local = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--autoplay-policy=no-user-gesture-required", "--mute-audio"],
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  serviceWorkers: "block",
});
const page = await context.newPage();
const failed = new Map(); // url -> reason
const external = new Map(); // host -> request count
const errors = new Set();
let fromCdn = 0;

if (!live) {
  await context.route(CDN, (route) => {
    const url = new URL(route.request().url());
    const rel = decodeURIComponent(
      url.pathname.split(`/static/misc/${folder}/`)[1],
    );
    const file = path.join(gameDir, rel);
    const headers = {
      "access-control-allow-origin": "*",
      "cross-origin-resource-policy": "cross-origin",
    };
    fromCdn++;
    if (
      !file.startsWith(gameDir) ||
      !fs.existsSync(file) ||
      !fs.statSync(file).isFile()
    ) {
      return route.fulfill({ status: 404, headers, body: "" });
    }
    if (fs.statSync(file).size > CDN_LIMIT) {
      failed.set(url.href, "over jsDelivr's 20 MB limit, split it into parts");
      return route.fulfill({ status: 403, headers, body: "" });
    }
    return route.fulfill({
      status: 200,
      headers,
      contentType: mime(file),
      path: file,
    });
  });
}
page.on("request", (request) => {
  const url = request.url();
  if (!/^https?:/.test(url) || url.startsWith(local) || CDN.test(url)) return;
  const host = new URL(url).host;
  external.set(host, (external.get(host) || 0) + 1);
});
page.on("response", (response) => {
  if (response.status() >= 400 && !failed.has(response.url())) {
    if (response.url() === `${local}/favicon.ico`) return;
    failed.set(response.url(), `HTTP ${response.status()}`);
  }
});
page.on("requestfailed", (request) => {
  const reason = request.failure()?.errorText || "failed";
  if (reason !== "net::ERR_ABORTED" && !failed.has(request.url())) {
    failed.set(request.url(), reason);
  }
});
page.on("pageerror", (error) => errors.add(error.message.split("\n")[0]));
page.on("console", (message) => {
  if (
    message.type() === "error" &&
    !/Failed to load resource/.test(message.text())
  ) {
    errors.add(message.text().split("\n")[0].slice(0, 300));
  }
});

await page.goto(`${local}/misc/${folder}/index.html`, {
  waitUntil: "load",
  timeout: 60000,
});
await page.waitForTimeout(waitMs);
const state = await page.evaluate(() => ({
  base: document.querySelector("base")?.href || "",
  canvases: [...document.querySelectorAll("canvas")].map(
    (canvas) => `${canvas.width}x${canvas.height}`,
  ),
  // The shared loading screen should be gone once the game is running.
  loaderUp: [
    ...document.querySelectorAll("#game-loading, #unity-cdn-loading"),
  ].some(
    (element) =>
      !element.hidden && getComputedStyle(element).display !== "none",
  ),
}));
await page.screenshot({ path: shot });
await browser.close();
server.close();

// Catalog and launcher files
const catalog = JSON.parse(
  fs.readFileSync(path.join(staticDir, "assets/json/load/g.json"), "utf8"),
);
const entries = catalog.filter((game) =>
  [game.image, game.url].some((value) => value?.includes(`/misc/${folder}/`)),
);

const list = (title, items) => {
  if (!items.length) return;
  console.log(`\n${title}`);
  for (const item of items.slice(0, 40)) console.log(`  ${item}`);
  if (items.length > 40) console.log(`  ...and ${items.length - 40} more`);
};
console.log(`static/misc/${folder}`);
console.log(`  base:     ${state.base || "(none, files load from the site)"}`);
console.log(
  `  cdn:      ${live ? "real CDN" : `${fromCdn} requests answered from local files`}`,
);
console.log(`  canvas:   ${state.canvases.join(", ") || "none"}`);
console.log(
  `  loader:   ${state.loaderUp ? `STILL SHOWING after ${waitMs / 1000}s` : "not showing"}`,
);
console.log(
  `  cover:    ${fs.existsSync(path.join(gameDir, "img.webp")) ? "img.webp" : "MISSING img.webp"}`,
);
console.log(
  `  catalog:  ${
    entries.length === 1
      ? `"${entries[0].name}"${entries[0].author ? ` by ${entries[0].author}` : ""}`
      : entries.length
        ? `${entries.length} ENTRIES`
        : "NO ENTRY in g.json"
  }`,
);
list(
  "Failed requests:",
  [...failed].map(([url, reason]) => `${reason}  ${url}`),
);
list("Errors:", [...errors]);
list(
  "Other sites contacted:",
  [...external].map(([host, count]) => `${host} (${count})`),
);
console.log(`\nScreenshot: ${shot}`);
process.exit(failed.size || errors.size ? 1 : 0);
