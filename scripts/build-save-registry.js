// Writes static/assets/json/saves.json, the per-game cloud save registry:
// every game under static/misc/ with its stable id, its name, and how its
// saves are synced. Re-run after adding or removing a game, and commit the
// result. Hand-checked adapters are in CURATED below. See docs/cloud-saves.md.
//
//   node scripts/build-save-registry.js
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gameIdFromLocation } from "../utils/saveRegistry.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATIC = path.join(ROOT, "static");
const MISC = path.join(STATIC, "misc");
const OUTPUT = path.join(STATIC, "assets/json/saves.json");

// Games whose save format was read from their source. keys are the
// localStorage keys that hold the save, known before the game has run on a
// device, so a returning player's existing save and a legacy cloud backup
// can be found. progress names the adapter in utils/saveProgress.js.
const CURATED = {
  cookieclicker: {
    keys: ["CookieClickerGame", "CookieClickerGameBeta"],
    progress: { adapter: "cookie-clicker" },
  },
  "universal-paperclips": {
    keys: [
      "saveGame",
      "saveGame1",
      "saveGame2",
      "savePrestige",
      "saveProjectsActive",
      "saveProjectsActive1",
      "saveProjectsActive2",
      "saveProjectsFlags",
      "saveProjectsFlags1",
      "saveProjectsFlags2",
      "saveProjectsUses",
      "saveProjectsUses1",
      "saveProjectsUses2",
      "saveStratsActive",
      "saveStratsActive1",
      "saveStratsActive2",
    ],
    progress: { adapter: "universal-paperclips" },
  },
  // GameMaker: files live under "<display name>.<game id>." in localStorage.
  "retro-bowl-game": {
    keys: [
      "RetroBowl.0.optiondata.dat",
      "RetroBowl.0.savedata.ini",
      "RetroBowl.0.savedata2.ini",
      "RetroBowl.0.savedata3.ini",
      "RetroBowl.0.savedata4.ini",
      "RetroBowl.0.savedata5.ini",
    ],
  },
  retrobowlcollege: {
    keys: [
      "RetroBowlCollege.0.optiondata.dat",
      "RetroBowlCollege.0.savedata.ini",
      "RetroBowlCollege.0.savedata2.ini",
      "RetroBowlCollege.0.savedata3.ini",
      "RetroBowlCollege.0.savedata4.ini",
      "RetroBowlCollege.0.savedata5.ini",
      "RetroBowlCollege.0.savedata_exh.ini",
    ],
  },
};

function idFromUrl(url) {
  const parsed = new URL(url, "https://55gms.local");
  if (parsed.host !== "55gms.local") return null;
  return gameIdFromLocation(parsed.pathname, parsed.search);
}

// The file a game page frames, relative to static/.
function documentFor(url) {
  const parsed = new URL(url, "https://55gms.local");
  let file = decodeURIComponent(parsed.pathname);
  if (file.endsWith("/")) file += "index.html";
  return path.join(STATIC, file);
}

// A game whose page frames another site keeps its storage on that site,
// out of reach of this one.
function runsOffSite(file) {
  if (!existsSync(file)) return false;
  const html = readFileSync(file, "utf8");
  return /<iframe[^>]+src=["']https?:\/\//i.test(html);
}

const games = new Map();

// The document the shared play page frames for its `link`, by the rule in
// static/misc/play/index.html: a folder, or a path under /misc/ whose last
// part opens its index.html when it has no extension.
function playFrame(link) {
  const [linkPath, linkQuery] = (link || "")
    .replace(/^\/+|\/+$/g, "")
    .split(/\?(.*)/s);
  const lastPart = linkPath.split("/").pop();
  return `/misc/${linkPath}${lastPart.includes(".") ? "" : "/index.html"}${
    linkQuery ? "?" + linkQuery : ""
  }`;
}

function add(id, fields) {
  if (!id) return;
  const entry = games.get(id) || { id };
  for (const [key, value] of Object.entries(fields)) {
    if (value && !entry[key]) entry[key] = value;
  }
  games.set(id, entry);
}

// 1. The catalogue: names, and games opened through the shared play page or
// straight from their own document.
const catalogue = JSON.parse(
  readFileSync(path.join(STATIC, "assets/json/load/g.json"), "utf8"),
);
for (const game of catalogue) {
  let url = game.url;
  if (!url && game.author && game.image) {
    const folder = game.image.split("/").filter(Boolean).at(-2);
    url = `/misc/play/?title=${encodeURIComponent(game.name)}&link=${encodeURIComponent(folder)}`;
  }
  if (!url || /^https?:/i.test(url) || game.usesProxy) continue;
  const parsed = new URL(url, "https://55gms.local");
  if (
    parsed.pathname === "/misc/play/" ||
    parsed.pathname === "/misc/play/index.html"
  ) {
    const frame = playFrame(parsed.searchParams.get("link"));
    add(idFromUrl(frame), { name: game.name, play: url, frame });
  } else {
    add(idFromUrl(url), { name: game.name, frame: url });
  }
}

// 2. Every other game folder with a page of its own.
for (const name of readdirSync(MISC).sort()) {
  if (name === "play" || name === "media") continue;
  if (!existsSync(path.join(MISC, name, "index.html"))) continue;
  add(idFromUrl(`/misc/${name}/index.html`), {
    name: name.replace(/[-_]+/g, " "),
    frame: `/misc/${name}/index.html`,
  });
}

const output = {};
for (const id of [...games.keys()].sort()) {
  const entry = games.get(id);
  const curated = CURATED[id];
  let status = "observed";
  if (curated?.progress) status = "progress";
  if (!curated && runsOffSite(documentFor(entry.frame))) status = "local-only";
  output[id] = {
    id,
    name: entry.name || id,
    ...(entry.play ? { play: entry.play } : {}),
    frame: entry.frame,
    status,
    ...(curated?.keys ? { keys: curated.keys } : {}),
    ...(curated?.progress ? { progress: curated.progress } : {}),
  };
}

for (const id of Object.keys(CURATED)) {
  if (!output[id]) throw new Error(`CURATED names ${id}, which is not a game`);
}

writeFileSync(
  OUTPUT,
  JSON.stringify({ version: 1, games: output }, null, 1) + "\n",
);
const counts = Object.values(output).reduce((all, game) => {
  all[game.status] = (all[game.status] || 0) + 1;
  return all;
}, {});
console.log(
  `ok: ${Object.keys(output).length} games written to ${path.relative(ROOT, OUTPUT)}`,
  counts,
);
