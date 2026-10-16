// Wires the game pages into per-game cloud saves (docs/cloud-saves.md).
// Safe to re-run; run it after adding a game.
//
//  - every game document under static/misc/ (not play/ or media/) loads
//    /assets/js/save-agent.js first in <head>, before <base> and any game
//    code, so the agent sees everything the game stores
//  - every play page loads /assets/js/cloud-saves.js and starts its game
//    frame through GMSSaves.launch(), which restores a newer cloud save
//    before the game loads. The frame's address moves to data-src; if the
//    engine fails to load, the page sets src itself.
//
//   node scripts/add-save-agent.js
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MISC = path.join(ROOT, "static/misc");
const PLAY = path.join(MISC, "play");
const AGENT_TAG = '<script src="/assets/js/save-agent.js?v=2"></script>';
const ENGINE_TAG = '<script src="/assets/js/cloud-saves.js?v=3"></script>';
const LAUNCHER =
  '<script>(function(f){window.GMSSaves?GMSSaves.launch(f):f.src=f.dataset.src})(document.getElementById("iframe"))</script>';

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) {
      if (file === PLAY || file === path.join(MISC, "media")) continue;
      yield* htmlFiles(file);
    } else if (/\.html?$/i.test(name)) {
      yield file;
    }
  }
}

// Some games keep binary data in files named .html; only real documents
// (valid UTF-8 with a <head>, <html> or doctype) are touched.
function isDocument(bytes) {
  try {
    new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return false;
  }
  return /<head\b|<html\b|<!doctype html/i.test(bytes.toString("utf8"));
}

let agents = 0;
for (const file of htmlFiles(MISC)) {
  const bytes = readFileSync(file);
  if (!isDocument(bytes)) continue;
  const html = bytes.toString("utf8");
  if (html.includes("/assets/js/save-agent.js")) continue;
  let next;
  if (/<head\b[^>]*>/i.test(html)) {
    next = html.replace(/<head\b[^>]*>/i, (tag) => `${tag}\n  ${AGENT_TAG}`);
  } else if (/<html\b[^>]*>/i.test(html)) {
    next = html.replace(/<html\b[^>]*>/i, (tag) => `${tag}\n${AGENT_TAG}`);
  } else {
    next = html.replace(/<!doctype[^>]*>/i, (tag) => `${tag}\n${AGENT_TAG}`);
  }
  writeFileSync(file, next);
  agents += 1;
}

let plays = 0;
for (const name of readdirSync(PLAY)) {
  if (!name.endsWith(".html")) continue;
  const file = path.join(PLAY, name);
  let html = readFileSync(file, "utf8");
  if (html.includes("/assets/js/cloud-saves.js")) continue;

  if (name === "index.html") {
    // The shared play page picks its game from the query string.
    const assign =
      /iframeElement\.src = (`\/misc\/\$\{encodeURIComponent\(link\)\}\/index\.html`);/;
    if (!assign.test(html))
      throw new Error("play/index.html: frame assignment not found");
    html = html.replace(
      assign,
      "iframeElement.dataset.src = $1;\n" +
        "            if (window.GMSSaves) GMSSaves.launch(iframeElement);\n" +
        "            else iframeElement.src = iframeElement.dataset.src;",
    );
  } else {
    const frame = /<iframe\b[^>]*\bid=["']iframe["'][^>]*>/i.exec(html);
    if (!frame) continue;
    const src = /\ssrc=["']([^"']*)["']/i.exec(frame[0]);
    // Games framed from another site keep their storage there.
    if (!src || /^https?:/i.test(src[1])) continue;
    const gated = frame[0].replace(/\ssrc=(["'])/i, " data-src=$1");
    const end = html.indexOf("</iframe>", frame.index);
    if (end === -1) throw new Error(`${name}: </iframe> not found`);
    html =
      html.slice(0, frame.index) +
      gated +
      html.slice(frame.index + frame[0].length, end + 9) +
      LAUNCHER +
      html.slice(end + 9);
  }

  html = html.replace(/<\/head>/i, `    ${ENGINE_TAG}\n</head>`);
  writeFileSync(file, html);
  plays += 1;
}

console.log(
  `ok: save agent added to ${agents} game documents, ${plays} play pages gated`,
);
