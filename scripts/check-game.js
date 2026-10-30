// Loads one game page in headless Chrome and reports what breaks, before the
// game's files have reached GitHub. The page comes from static/misc/<folder>/;
// requests to its jsDelivr base for 55gms/assets are answered from the local
// assets clone (misc/<folder>/) the way the CDN would answer them (CORS
// headers, 404 for missing files, 403 over 20 MB), so the game is tested
// exactly as committed in both repos.
//
//   node scripts/check-game.js <folder> [--wait 15] [--live] [--shot <png>]
//                                      [--actions <json>]
//
// --live skips the mapping and uses the real CDN (after the files are pushed).
// Exits 1 when a request fails or the page throws.
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { assetsRepo, filesDir, requireAssetsRepo } from "./lib/gameFiles.js";

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
const actionsFile = option("actions");
const beforeShot = option("before-shot");
const reportFile = option("report");
const automaticActions = [];

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const staticDir = path.join(root, "static");
const gameDir = filesDir(folder);
const entryPage = path.join(staticDir, "misc", folder, "index.html");
if (!fs.existsSync(entryPage)) {
  console.error(`No static/misc/${folder}/index.html`);
  process.exit(1);
}
requireAssetsRepo();

const CDN = new RegExp(
  `^https://cdn\\.jsdelivr\\.net/gh/55gms/assets@[^/]+/misc/${folder}/`,
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

// The site itself is not needed, only its static files. A game file that is
// not in static/ is answered from the assets clone, as the site relays it.
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(staticDir, pathname);
  if (pathname.endsWith("/")) file = path.join(file, "index.html");
  const isFile = (candidate, within) =>
    candidate.startsWith(within) &&
    fs.existsSync(candidate) &&
    fs.statSync(candidate).isFile();
  if (!isFile(file, staticDir) && pathname.startsWith("/misc/")) {
    file = path.join(assetsRepo, pathname);
  }
  if (!isFile(file, staticDir) && !isFile(file, assetsRepo)) {
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
const failed = new Map(); // url -> reason
const external = new Map(); // host -> request count
const errors = new Set();
let fromCdn = 0;
let state;

try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    serviceWorkers: "block",
  });
  const page = await context.newPage();

  if (!live) {
    await context.route(CDN, (route) => {
      const url = new URL(route.request().url());
      const rel = decodeURIComponent(url.pathname.split(`/misc/${folder}/`)[1]);
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
        failed.set(
          url.href,
          "over jsDelivr's 20 MB limit, split it into parts",
        );
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
  if (args.includes("--offline")) {
    await context.route(
      (url) =>
        /^https?:/.test(url.href) &&
        !url.href.startsWith(local) &&
        !CDN.test(url.href),
      (route) => route.abort(),
    );
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
  page.on("pageerror", (error) => errors.add(error.stack || error.message));
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
  if (actionsFile) {
    const actions = JSON.parse(fs.readFileSync(actionsFile, "utf8"));
    if (!Array.isArray(actions))
      throw new Error("Actions must be a JSON array");
    await page.bringToFront();
    if (await page.locator("#gms-import-config").count()) {
      await page
        .waitForFunction(
          () => {
            const loader = document.querySelector("#game-loading");
            return (
              loader &&
              (loader.hidden || getComputedStyle(loader).display === "none")
            );
          },
          null,
          { timeout: 90000 },
        )
        .catch(() => {});
      await page.waitForTimeout(3500);
    }
    if (beforeShot) await page.screenshot({ path: beforeShot });
    for (const action of actions) {
      if (action.wait) await page.waitForTimeout(action.wait);
      if (action.click)
        await page.mouse.click(...action.click, { delay: action.delay || 300 });
      if (action.key)
        await page.keyboard.press(action.key, { delay: action.delay || 100 });
      if (action.type) await page.keyboard.type(action.type, { delay: 40 });
      if (action.hold) {
        await page.keyboard.down(action.hold);
        await page.waitForTimeout(action.ms || 1000);
        await page.keyboard.up(action.hold);
      }
    }
  }
  // Optional OCR-assisted menu traversal for canvas games. Screenshots and the
  // actual clicks are retained for review; reaching a menu is never a pass.
  if (args.includes("--auto-play")) {
    await page.waitForTimeout(6000);
    for (let round = 0; round < 4; round++) {
      const menu = shot.replace(/\.png$/, `-step${round}.png`);
      await page.screenshot({ path: menu });
      const { stdout } = await promisify(execFile)(
        "tesseract",
        [menu, "stdout", "tsv"],
        { maxBuffer: 4e6 },
      );
      const words = stdout
        .split("\n")
        .slice(1)
        .map((line) => {
          const columns = line.split("\t");
          return {
            text: columns[11]?.trim().toUpperCase(),
            x: Number(columns[6]),
            y: Number(columns[7]),
            width: Number(columns[8]),
            height: Number(columns[9]),
            confidence: Number(columns[10]),
          };
        })
        .filter((word) => word.confidence > 20 && word.height > 10);
      const priority = [
        "OK",
        "TAKE",
        "CLAIM",
        "1P",
        "SINGLEPLAYER",
        "SINGLE",
        "START",
        "PLAY",
        "READY",
        "CONTINUE",
        "NEXT",
        "GO",
        "FREE",
        "RACE",
        "DRIVE",
        "1",
      ];
      const matches = words
        .filter((word) => priority.includes(word.text))
        .filter(
          (word) =>
            !words.some(
              (other) =>
                other.text === "MORE" &&
                Math.abs(other.y - word.y) < 25 &&
                Math.abs(other.x - word.x) < 160,
            ),
        );
      matches.sort(
        (a, b) =>
          priority.indexOf(a.text) - priority.indexOf(b.text) ||
          Math.abs(a.x + a.width / 2 - 640) - Math.abs(b.x + b.width / 2 - 640),
      );
      if (!matches.length) break;
      const button = matches[0];
      const click = [button.x + button.width / 2, button.y + button.height / 2];
      await page.mouse.click(...click, { delay: 300 });
      automaticActions.push({ click, label: button.text, screenshot: menu });
      await page.waitForTimeout(1800);
    }
    await page.mouse.click(640, 360, { delay: 300 });
    for (const key of ["Enter", "Space"])
      await page.keyboard.press(key, { delay: 200 });
    for (const key of ["KeyW", "ArrowUp", "ArrowRight"]) {
      await page.keyboard.down(key);
      await page.waitForTimeout(1200);
      await page.keyboard.up(key);
      automaticActions.push({ hold: key, ms: 1200 });
    }
    await page.mouse.move(640, 360);
    await page.mouse.down();
    await page.waitForTimeout(700);
    await page.mouse.move(440, 360, { steps: 15 });
    await page.mouse.move(840, 360, { steps: 25 });
    await page.waitForTimeout(700);
    await page.mouse.up();
    automaticActions.push({
      drag: [
        [640, 360],
        [440, 360],
        [840, 360],
      ],
      holdMs: 1400,
    });
  }
  await page.waitForTimeout(waitMs);
  state = await page.evaluate(() => ({
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
  if (reportFile)
    fs.writeFileSync(
      reportFile,
      JSON.stringify(
        {
          folder,
          state,
          failed: [...failed],
          errors: [...errors],
          external: [...external],
          actions: [
            ...(actionsFile
              ? JSON.parse(fs.readFileSync(actionsFile, "utf8"))
              : []),
            ...automaticActions,
          ],
          shot,
          beforeShot,
        },
        null,
        2,
      ),
    );
} finally {
  await browser.close();
  server.close();
}

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
