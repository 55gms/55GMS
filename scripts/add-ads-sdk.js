// Wires every game document under static/misc/ (not play/ or media/) to
// 55GMS Ads' in-game SDK, so a game's own rewarded-ad calls reach a real ad.
// Safe to re-run; run it after adding a game.
//
//  - the pinned SDK tag goes in <head>, right after the save agent and before
//    any game code, with the document's cloud saves game id. On a play page
//    the frame's data-gms-game wins over it.
//  - data-compat lists the portal SDK stand-ins the game both carries and
//    asks for a rewarded ad through (poki, crazygames, gamedistribution,
//    yandex, famobi), read from the game's files in a 55gms/assets clone.
//    A game with none still gets the tag, with data-compat empty, for a
//    hand-written hook or a later adapter.
//  - a tag already there is updated in place, never added twice. Without a
//    clone, a tag keeps the data-compat it has.
//
//   node scripts/add-ads-sdk.js [path to a 55gms/assets clone, default ../assets]
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";
import { gameIdFromLocation } from "../utils/saveRegistry.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MISC = path.join(ROOT, "static/misc");
const SKIP = new Set(["play", "media"]);

// gms-ads embed release: the tag and embed/dist/manifest.json files.sdk.integrity.
const SDK_VERSION = "1.3.1";
const SDK_INTEGRITY =
  "sha384-qoUP32Uh4cuTWMH2h+GTUzp9xAeyxMJN7T54L5sYX/3e03d1kZspMEAlc4bpSLF9";
const SDK_SRC = `https://cdn.jsdelivr.net/gh/55gms/gms-ads@${SDK_VERSION}/embed/dist/sdk.min.js`;
const SDK_TAG =
  /[ \t]*<script\b[^>]*\bsrc=["'][^"']*\/gms-ads@[^"'/]+\/embed\/dist\/sdk(?:\.min)?\.js["'][^>]*>\s*<\/script>[ \t]*/i;
const AGENT_TAG = /<script\b[^>]*\/assets\/js\/save-agent\.js[^>]*><\/script>/i;

// A stand-in counts when the game defines or loads it and also makes the
// rewarded call the adapter wraps. Calls the adapters cannot reach (the
// CrazyGames v1 gameframe, a template's own RewardedShow) do not count.
const PORTALS = {
  poki: {
    loads: /PokiSDK\s*=|poki-sdk[\w.-]*\.js/,
    calls: /rewardedBreak\s*\(|\[["']rewardedBreak["']\]\s*\(/,
  },
  crazygames: {
    loads: /CrazyGames\s*=|crazygames-sdk-v[23]\.js|cg-sdk\.js|crazy\/sdk\.js/,
    // Unity's jslib passes the ad type in a variable.
    calls:
      /requestAd\(\s*["'`]rewarded|CrazyGames\.SDK\.ad\.requestAd\(\s*[\w$]/,
  },
  gamedistribution: {
    loads: /gdsdk\s*=|gamedistribution\.com\/main\.min\.js|GD_OPTIONS\s*=/,
    // Unity's plugin names the type through gdsdk.AdType.
    calls:
      /showAd\(\s*["'`]rewarded|gdsdk\.showAd\([^)]{0,40}[Rr]ewarded|gdsdk\.AdType\.Rewarded/,
  },
  yandex: {
    loads: /YaGames\s*=|yandex\.ru\/games\/sdk|yandex-sdk\.js|yagames-stub\.js/,
    calls: /adv\.showRewardedVideo\s*\(/,
  },
  famobi: {
    loads: /famobi\s*=|famobi_gameJS|gameapi\/v1\.js|famobi\.js/,
    calls: /famobi\.rewardedAd\s*\(|\["famobi"\]\["rewardedAd"\]/,
  },
};

// Games read wrong from their files, decided by hand: folder -> adapters.
const COMPAT = {
  // Builds carrying several portals' code: only the one the game starts.
  "happy-glass": ["poki"],
  "idle-ants": ["poki"],
  "nsr-street-car-racing": ["poki"],
  swingo: ["poki"],
  "escape-road-3": ["crazygames"],
  "turbo-moto-racer": ["poki"],
  // pk-sdk.js defines PokiSDK under obfuscated names.
  motox3m: ["poki"],
  // A WebSdkWrapper started with no network: rewarded() never reaches an SDK.
  ovo: [],
  ovo3: [],
  // Rewarded ads go through Voodoo's H5SDK, which has no adapter yet.
  helixjump: [],
  // The page answers the build's showRewardedAd with nothing; what the game
  // waits for after a reward is not known.
  "time-shooter2": [],
  // Rewarded calls that reach GMSAds through a hook in the game's own code.
  brawl: [],
  "deadly-descent": [],
};

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) {
      if (dir === MISC && SKIP.has(name)) continue;
      yield* htmlFiles(file);
    } else if (/\.html?$/i.test(name)) {
      yield file;
    }
  }
}

// Some games keep binary data in files named .html; only real documents
// (valid UTF-8 with a <head>, <html> or doctype, or the save agent) are
// touched.
function isDocument(bytes) {
  try {
    new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return false;
  }
  const text = bytes.toString("utf8");
  return /<head\b|<html\b|<!doctype html/i.test(text) || AGENT_TAG.test(text);
}

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(file);
    else yield file;
  }
}

// Script text of a game file; Unity frameworks are often gzip or brotli.
function scriptText(file) {
  // PlayCanvas lists the SDK it loads in config.json.
  if (/\.(m?js|html?)$|(^|\/)config\.json$/i.test(file)) {
    return readFileSync(file, "latin1");
  }
  if (!/\.(unityweb|gz|br)$/i.test(file) || !/framework|\.js\./i.test(file)) {
    return "";
  }
  const bytes = readFileSync(file);
  for (const unpack of [zlib.gunzipSync, zlib.brotliDecompressSync]) {
    try {
      return unpack(bytes).toString("latin1");
    } catch {}
  }
  return bytes.toString("latin1");
}

// The adapters a game folder needs, from its pages and its files in the
// clone. A patch/ folder of spare portal SDKs counts only for the files the
// game names.
function detect(folder, clone) {
  const texts = [];
  for (const file of walk(path.join(MISC, folder))) {
    if (/\.html?$/i.test(file)) texts.push(readFileSync(file, "latin1"));
  }
  const files = path.join(clone, "misc", folder);
  const patches = [];
  if (existsSync(files)) {
    for (const file of walk(files)) {
      const rel = path.relative(files, file).split(path.sep).join("/");
      // The page the site serves is the one in static/misc/.
      if (existsSync(path.join(MISC, folder, rel)) && /\.html?$/i.test(rel)) {
        continue;
      }
      if (statSync(file).size > 64 * 1024 * 1024) continue;
      if (/(^|\/)patch\//.test(rel)) patches.push([rel, file]);
      else texts.push(scriptText(file));
    }
  }
  const all = texts.join("\n");
  for (const [rel, file] of patches) {
    if (all.includes(rel)) texts.push(scriptText(file));
  }
  return Object.entries(PORTALS)
    .filter(([, p]) => texts.some((t) => p.loads.test(t)))
    .filter(([, p]) => texts.some((t) => p.calls.test(t)))
    .map(([name]) => name);
}

function tag(gameId, compat, eol) {
  return [
    "<script",
    `    src="${SDK_SRC}"`,
    `    integrity="${SDK_INTEGRITY}"`,
    '    crossorigin="anonymous"',
    `    data-game-id="${gameId}"`,
    `    data-compat="${compat.join(",")}"`,
    "  ></script>",
  ].join(eol);
}

const clone = path.resolve(process.argv[2] || path.join(ROOT, "../assets"));
const haveClone = existsSync(path.join(clone, "misc"));
if (!haveClone) {
  console.warn(
    `No 55gms/assets clone at ${clone}: existing tags keep their data-compat, new ones are read from the pages alone.`,
  );
}

const compatOf = new Map();
let added = 0;
let updated = 0;
for (const file of htmlFiles(MISC)) {
  const bytes = readFileSync(file);
  if (!isDocument(bytes)) continue;
  const html = bytes.toString("utf8");
  const rel = path.relative(MISC, file).split(path.sep).join("/");
  // Only documents in a game folder; misc/index.html is a site page.
  if (!rel.includes("/")) continue;
  const folder = rel.split("/")[0];
  const gameId = gameIdFromLocation(`/misc/${rel}`);
  if (!gameId) continue;

  const existing = SDK_TAG.exec(html);
  // The tag takes the line ending of the line it goes after (or its own).
  const anchor =
    existing ||
    AGENT_TAG.exec(html) ||
    /<head\b[^>]*>|<html\b[^>]*>|<!doctype[^>]*>/i.exec(html);
  const eol = /\r\n/.test(
    anchor ? html.slice(anchor.index, anchor.index + anchor[0].length + 2) : "",
  )
    ? "\r\n"
    : "\n";
  let compat = COMPAT[folder];
  if (!compat && !haveClone && existing) {
    const kept = /\bdata-compat=["']([^"']*)["']/i.exec(existing[0]);
    compat = kept ? kept[1].split(",").filter(Boolean) : [];
  }
  if (!compat) {
    if (!compatOf.has(folder)) compatOf.set(folder, detect(folder, clone));
    compat = compatOf.get(folder);
  }

  let next;
  if (existing) {
    next = html.replace(SDK_TAG, (old) => {
      const indent = /^[ \t]*/.exec(old)[0];
      return indent + tag(gameId, compat, eol);
    });
  } else if (AGENT_TAG.test(html)) {
    next = html.replace(
      AGENT_TAG,
      (agent) => `${agent}${eol}  ${tag(gameId, compat, eol)}`,
    );
  } else if (/<head\b[^>]*>/i.test(html)) {
    next = html.replace(
      /<head\b[^>]*>/i,
      (head) => `${head}${eol}  ${tag(gameId, compat, eol)}`,
    );
  } else if (/<html\b[^>]*>/i.test(html)) {
    next = html.replace(
      /<html\b[^>]*>/i,
      (open) => `${open}${eol}${tag(gameId, compat, eol)}`,
    );
  } else {
    next = html.replace(
      /<!doctype[^>]*>/i,
      (open) => `${open}${eol}${tag(gameId, compat, eol)}`,
    );
  }
  if (next === html) continue;
  writeFileSync(file, next);
  if (existing) updated += 1;
  else added += 1;
}

const wired = [...compatOf].filter(([, c]) => c.length).length;
console.log(
  `ok: ads SDK added to ${added} game documents, updated in ${updated}; ${wired} game folders detected with a rewarded stand-in`,
);
