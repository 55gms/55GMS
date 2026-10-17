// Loads every game in the catalogue on the live site in headless Chrome and
// records what points at a game's own files being blocked or unreachable:
// failed requests, HTTP errors, blocked-request patches, cross-origin and
// Worker errors, uncaught exceptions. A screenshot of each game goes next to
// the results so a blank or half-drawn game shows up too.
//
//   node scripts/sweep-games.js [--out <dir>] [--shard 1/6] [--only <regexp>]
//                               [--site https://55gms.com] [--wait 45]
//
// Writes <out>/results.jsonl (one line per game) and <out>/shots/*.jpg.
// The "Game sweep" workflow runs it in shards on GitHub's runners.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
};
const outDir = path.resolve(option("out", "sweep"));
const site = option("site", "https://55gms.com");
const waitMs = (Number(option("wait")) || 45) * 1000;
const only = option("only") ? new RegExp(option("only")) : null;
const [shard, shards] = option("shard", "1/1").split("/").map(Number);
const concurrency = Number(option("concurrency")) || 4;

const catalogue = JSON.parse(
  fs.readFileSync(
    new URL("../static/assets/json/load/g.json", import.meta.url),
    "utf8",
  ),
);

// The game document each catalogue entry frames, by the play page's rule.
function gamePath(entry) {
  let link;
  if (entry.url) {
    if (!entry.url.startsWith("/misc/play/"))
      return entry.url.startsWith("/misc/") ? entry.url : null;
    link = new URL(entry.url, site).searchParams.get("link");
  } else if (entry.author) {
    link = entry.image.split("/").filter(Boolean).at(-2);
  }
  if (!link) return null;
  const [linkPath, linkQuery] = link.replace(/^\/+|\/+$/g, "").split(/\?(.*)/s);
  const lastPart = linkPath.split("/").pop();
  return `/misc/${linkPath}${lastPart.includes(".") ? "" : "/index.html"}${linkQuery ? "?" + linkQuery : ""}`;
}

const seen = new Set();
const games = [];
for (const entry of catalogue) {
  const gamePathname = gamePath(entry);
  if (!gamePathname || seen.has(gamePathname)) continue;
  seen.add(gamePathname);
  if (!only || only.test(gamePathname))
    games.push({ name: entry.name, path: gamePathname });
}
const mine = games.filter((_, index) => index % shards === shard - 1);

const INTERESTING =
  /\[patched\] blocked (external request|analytics|redirect)|SecurityError|Failed to construct 'Worker'|tainted|cross-origin|CORS|net::ERR|Uncaught|abort\(|RuntimeError|is not defined|Cannot read prop/i;
const SKIP_CONSOLE = /^Failed to load resource|^\[UnityCache\]/;
// Ads, analytics and portal SDKs: failing is expected and harmless.
const IGNORE_URL =
  /cloudflareinsights|cdn-cgi\/rum|google-analytics|googletagmanager|doubleclick|googlesyndication|\/_ads\/|poki\.(io|com)|gameanalytics|facebook|adinplay|cpmstar|crazygames|gamedistribution|imasdk/i;

fs.mkdirSync(path.join(outDir, "shots"), { recursive: true });
const resultsFile = path.join(outDir, "results.jsonl");

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: [
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--autoplay-policy=no-user-gesture-required",
    "--mute-audio",
  ],
});

async function scan(game) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();
  const issues = [];
  const add = (kind, text) => {
    text = String(text).slice(0, 300);
    if (issues.length < 40 && !issues.some((issue) => issue.text === text))
      issues.push({ kind, text });
  };
  page.on("console", (message) => {
    const text = message.text();
    if (
      INTERESTING.test(text) &&
      !SKIP_CONSOLE.test(text) &&
      !IGNORE_URL.test(text)
    )
      add(`console:${message.type()}`, text);
  });
  page.on("pageerror", (error) => add("pageerror", error.message));
  page.on("requestfailed", (request) => {
    const reason = request.failure()?.errorText;
    if (!IGNORE_URL.test(request.url()) && reason !== "net::ERR_ABORTED")
      add("failed", `${reason} ${request.url()}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400 && !IGNORE_URL.test(response.url()))
      add("http", `${response.status()} ${response.url()}`);
  });
  const shot = path.join(
    outDir,
    "shots",
    `${game.path.replace(/[^a-z0-9]+/gi, "_")}.jpg`,
  );
  const run = async () => {
    // A game that keeps downloading can hold its load event for minutes;
    // watch it anyway once the document arrives.
    await page.goto(site + game.path, { timeout: 30000, waitUntil: "commit" });
    await page.waitForTimeout(waitMs * 0.6);
    // Past a "click to play" screen, so the game loads what it loads next.
    await page.mouse.click(640, 360).catch(() => {});
    await page.waitForTimeout(waitMs * 0.4);
    await page.screenshot({
      path: shot,
      type: "jpeg",
      quality: 45,
      timeout: 15000,
    });
  };
  // A page that hangs the renderer must not hold up the rest of the shard.
  let timer;
  try {
    await Promise.race([
      run(),
      new Promise((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("game did not finish in time")),
          waitMs + 60000,
        );
      }),
    ]);
  } catch (error) {
    add("goto", error.message.split("\n")[0]);
  }
  clearTimeout(timer);
  await Promise.race([
    context.close(),
    new Promise((resolve) => setTimeout(resolve, 10000)),
  ]).catch(() => {});
  return { ...game, issues };
}

console.log(
  `Shard ${shard}/${shards}: ${mine.length} of ${games.length} games`,
);
const queue = [...mine];
let finished = 0;
await Promise.all(
  Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const game = queue.shift();
      const result = await scan(game);
      fs.appendFileSync(resultsFile, JSON.stringify(result) + "\n");
      console.log(
        `${++finished}/${mine.length} ${game.path} ${result.issues.length}`,
      );
    }
  }),
);
await browser.close();
