// Writes static/assets/json/saves.json, the per-game cloud save registry:
// every game under static/misc/ with its stable id, its name, and how its
// saves are synced. Re-run after adding or removing a game, and commit the
// result. Hand-checked adapters are in CURATED below. See docs/cloud-saves.md.
//
//   node scripts/build-save-registry.js
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { adapterCompares } from "../utils/saveProgress.js";
import { gameIdFromLocation } from "../utils/saveRegistry.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATIC = path.join(ROOT, "static");
const MISC = path.join(STATIC, "misc");
const OUTPUT = path.join(STATIC, "assets/json/saves.json");

// Games whose save format was read from their source. keys are the
// localStorage keys that hold the save, known before the game has run on a
// device, so a returning player's existing save and a legacy cloud backup
// can be found; generic names ("progress", "settings") stay out, as a key
// given to one game is taken from every other. progress names the adapter
// in utils/saveProgress.js, which describes the save on /profile and, when
// it compares (adapterCompares), settles conflicts.
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
    progress: { adapter: "retro-bowl" },
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
    progress: { adapter: "retro-bowl-college" },
  },
  littlealchemy: { progress: { adapter: "little-alchemy" } },
  dogeminer: {
    keys: ["dogeminer2015", "achis"],
    progress: { adapter: "doge-miner" },
  },
  spacebarclicker: {
    keys: ["spacebar_clicker_game"],
    progress: { adapter: "spacebar-clicker" },
  },
  "csgo-clicker": { progress: { adapter: "csgo-clicker" } },
  wordle: { progress: { adapter: "wordle" } },
  hextris: { progress: { adapter: "hextris" } },
};

// Games that keep their storage under names of their own. Each group shares
// a localStorage key or an IndexedDB database with another game, found by
// reading the games' code; a key two games share goes in neither's cloud
// save, and a shared database lets one game overwrite another's data.
// save-agent.js stores every localStorage key of these games as
// "<game id>:<key>", copying a value from the old name the first time the
// game reads it, and opens the databases in idb as "<game id>:<name>" once
// cloud-saves.js has copied them. Listed in docs/cloud-saves.md.
//   games  ids, or a prefix ending in "*" for every game of a shared player
//   idb    database names the group shares
//   unityFolder  Poki's master-loader keeps the first Unity game's save
//          folder in "savegame_idbfs_hash" and sends every later game's
//          files there; each game gets a copy of that folder of its own
const RENAMED = [
  // OpenFL SharedObject with local path "/": the whole save.
  { games: ["baseballbros-io", "soccerbros"] },
  // PlayCanvas, the coin balance in "Coin".
  { games: ["car-machines", "steal-a-brainrot"] },
  // Pinpin's Unity template: the whole save in "GameData".
  { games: ["kick-the-buddy", "snow-train-odyssey"] },
  // "settings"; Little Alchemy's "uid" is also the Poki SDK's.
  { games: ["littlealchemy", "sandboxels", "wordle"] },
  // Famobi: "muted".
  { games: ["archeryworldtour", "tabletennisworldtour"] },
  // Two copies of Eaglercraft X: settings, profile, resource packs.
  { games: ["eaglercraftx", "misc-eloader"] },
  // Defold (Martin Magni): "startup-time" and the /sandbox file system.
  {
    games: [
      "dino-bros",
      "drive-mad",
      "gobble",
      "longcat",
      "monster-match",
      "monster-track",
      "recoil",
      "roller",
      "roper",
      "snake-pivot",
      "stacktris",
    ],
    idb: ["/sandbox"],
  },
  // Construct 2: the LocalStorage plugin's keys in localforage's default
  // database, and System save slots in _C2SaveStates. mrbullet's
  // WebStorage plugin writes plain localStorage keys.
  {
    games: [
      "asmallworldcup",
      "big-tower-tiny-square",
      "eggy-car",
      "idle-cowshed",
      "knifehit",
      "ovo",
      "ovo3",
      "paper-plane",
      "stickman-boost",
    ],
    idb: ["_C2SaveStates", "localforage"],
  },
  {
    games: [
      "bad-time-simulator",
      "choppyorc",
      "mrbullet",
      "penalty-shooters-2",
      "thereisnogame",
    ],
    idb: ["_C2SaveStates"],
  },
  // Unity games on Poki's master-loader.
  {
    games: [
      "dadish3d",
      "digging-master",
      "golforbit",
      "idle-digging-tycoon",
      "idle-lumber-inc",
      "mrracer",
      "my-perfect-hotel",
      "policechase",
      "ragdoll-fall",
      "redball-4",
      "slime-journey",
      "smash-it",
      "stunt-bike-extreme",
      "stunt-car-extreme",
    ],
    unityFolder: true,
  },
  // Every Flash game runs in one Ruffle page, whose SharedObjects are
  // localStorage keys named by the SWF; sequels reuse names.
  { games: ["flash-*"] },
];

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

// game id -> its "renamed" registry field.
const renamed = new Map();
for (const group of RENAMED) {
  const value = {
    ...(group.idb ? { idb: group.idb } : {}),
    ...(group.unityFolder ? { unityFolder: true } : {}),
  };
  for (const name of group.games) {
    const ids = name.endsWith("*")
      ? [...games.keys()].filter((id) => id.startsWith(name.slice(0, -1)))
      : [name];
    if (!ids.length || !ids.every((id) => games.has(id)))
      throw new Error(`RENAMED names ${name}, which is not a game`);
    for (const id of ids) {
      if (CURATED[id]?.keys)
        throw new Error(`RENAMED names ${id}, whose keys CURATED lists`);
      renamed.set(id, value);
    }
  }
}

const output = {};
for (const id of [...games.keys()].sort()) {
  const entry = games.get(id);
  const curated = CURATED[id];
  let status = "observed";
  if (curated?.progress && adapterCompares(curated.progress.adapter))
    status = "progress";
  if (!curated && runsOffSite(documentFor(entry.frame))) status = "local-only";
  output[id] = {
    id,
    name: entry.name || id,
    ...(entry.play ? { play: entry.play } : {}),
    frame: entry.frame,
    status,
    ...(curated?.keys ? { keys: curated.keys } : {}),
    ...(curated?.progress ? { progress: curated.progress } : {}),
    ...(renamed.has(id) ? { renamed: renamed.get(id) } : {}),
  };
}

for (const id of Object.keys(CURATED)) {
  if (!output[id]) throw new Error(`CURATED names ${id}, which is not a game`);
}

writeFileSync(
  OUTPUT,
  JSON.stringify({ version: 1, games: output }, null, 1) + "\n",
);

// save-agent.js must know before the game runs, so it carries the same
// table, written between its <renamed> markers as Prettier lays it out.
const AGENT = path.join(STATIC, "assets/js/save-agent.js");
const agent = readFileSync(AGENT, "utf8");
const block = /(\/\/ <renamed>[^\n]*\n)[\s\S]*?(\n\s*\/\/ <\/renamed>)/;
if (!block.test(agent)) throw new Error("save-agent.js: <renamed> not found");
const inline = (value) =>
  Object.keys(value).length
    ? `{ ${Object.entries(value)
        .map(
          ([key, item]) =>
            `${key}: ${JSON.stringify(item).replace(/,/g, ", ")}`,
        )
        .join(", ")} }`
    : "{}";
const table = [...renamed.keys()].sort().map((id) => {
  const key = /^[a-z_$][\w$]*$/i.test(id) ? id : JSON.stringify(id);
  return `    ${key}: ${inline(renamed.get(id))},`;
});
writeFileSync(
  AGENT,
  agent.replace(
    block,
    (_, open, close) =>
      `${open}  var RENAMED = {\n${table.join("\n")}\n  };${close}`,
  ),
);
const counts = Object.values(output).reduce((all, game) => {
  all[game.status] = (all[game.status] || 0) + 1;
  return all;
}, {});
console.log(
  `ok: ${Object.keys(output).length} games written to ${path.relative(ROOT, OUTPUT)}`,
  counts,
);
