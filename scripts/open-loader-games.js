// Opens every game that uses the shared loading screen, a batch at a time, so
// the screens can be checked by hand. Start the site first (`node .`).
//
//   node scripts/open-loader-games.js [--base http://localhost:8080]
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
const base = option("base", `http://localhost:${process.env.PORT || 8080}`);
const batch = Math.max(1, Number(option("batch", 10)) || 10);
const from = option("from", "");

const misc = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../static/misc",
);
const LOADERS = ["game-loader", "unity-cdn-loader", "unity-loading"];
const games = [];
for (const folder of fs.readdirSync(misc).sort()) {
  const file = path.join(misc, folder, "index.html");
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  const loader = LOADERS.find((name) => html.includes(`/assets/js/${name}.js`));
  if (loader) games.push({ folder, loader });
}

let next = from ? games.findIndex((game) => game.folder === from) : 0;
if (next < 0) {
  console.error(`No loader game in static/misc/${from}`);
  process.exit(1);
}

function openUrl(url) {
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
  for (const { folder, loader } of group) {
    console.log(`  ${folder.padEnd(26)} ${loader}`);
    openUrl(`${base}/misc/${folder}/`);
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
