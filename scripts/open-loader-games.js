// Opens every game that uses the shared loading screen, a batch at a time, so
// the screens can be checked by hand. Start the site first (`node .`). Each
// game opens on the page its catalog card links to, not the bare game file.
//
//   node scripts/open-loader-games.js [--base http://localhost:8081]
//                                     [--batch 10] [--from <folder>]
//
// Press Enter (or Space) for the next batch, q to quit. --from resumes at a
// game folder, e.g. --from cuphead.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
};
const base = option("base", "http://localhost:8081");
const batch = Math.max(1, Number(option("batch", 10)) || 10);
const from = option("from", "");

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const misc = path.join(root, "static/misc");

// Catalog page for each game folder, resolved the way games.js does: author
// cards and full launcher links both go through the shared play page.
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "static/assets/json/load/g.json"), "utf8"),
);
const pages = new Map();
for (const game of catalog) {
  if (game.author && !game.url) {
    const folder = game.image.split("/").filter(Boolean).at(-2);
    pages.set(
      folder,
      `/misc/play/?title=${encodeURIComponent(game.name)}&author=${encodeURIComponent(
        game.author,
      )}&link=${encodeURIComponent(folder)}`,
    );
  } else if (game.url?.startsWith("/misc/play/?")) {
    // Launcher link written out in full; its link is a folder or a path.
    const parsed = new URL(game.url, "http://55gms.local");
    const folder = (parsed.searchParams.get("link") || "")
      .replace(/^\/+/, "")
      .split(/[/?]/)[0];
    if (folder && !pages.has(folder)) {
      pages.set(folder, parsed.pathname + parsed.search);
    }
  }
}
const LOADERS = ["game-loader", "unity-cdn-loader"];
const games = [];
for (const folder of fs.readdirSync(misc).sort()) {
  const file = path.join(misc, folder, "index.html");
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  const loader = LOADERS.find((name) => html.includes(`/assets/js/${name}.js`));
  if (loader) games.push({ folder, loader, page: pages.get(folder) });
}

let next = from ? games.findIndex((game) => game.folder === from) : 0;
if (next < 0) {
  console.error(`No loader game in static/misc/${from}`);
  process.exit(1);
}

function openUrl(url) {
  if (process.env.DRY_RUN) return console.log(`    ${url}`);
  const [command, ...rest] =
    process.platform === "darwin"
      ? ["open", url]
      : process.platform === "win32"
        ? ["cmd", "/c", "start", "", url]
        : ["xdg-open", url];
  spawn(command, rest, { stdio: "ignore", detached: true }).unref();
}

function openBatch() {
  const group = games.slice(next, next + batch);
  console.log(`\nGames ${next + 1}-${next + group.length} of ${games.length}:`);
  for (const { folder, loader, page } of group) {
    console.log(
      `  ${folder.padEnd(26)} ${loader}${page ? "" : "  (not in catalog)"}`,
    );
    if (page) openUrl(base + page);
  }
  next += group.length;
  if (next >= games.length) {
    console.log("\nThat was the last batch.");
    process.exit(0);
  }
  console.log(`\nEnter/Space: next ${batch}   q: quit`);
}

console.log(`${games.length} games, ${batch} at a time, from ${base}`);
openBatch();
if (process.stdin.isTTY) process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on("data", (data) => {
  const key = data.toString();
  // q, Ctrl+C, Ctrl+D
  if (key === "q" || key === "\u0003" || key === "\u0004") process.exit(0);
  if (key === "\r" || key === "\n" || key === " ") openBatch();
});
