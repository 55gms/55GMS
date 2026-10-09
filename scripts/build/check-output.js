// Checks that a built tree hides what the build is meant to hide. CI runs it
// after `npm run build`, so a build that silently stopped transforming blocks
// the deploy instead of shipping readable text.
//
//   node scripts/build/check-output.js [builtStatic] [sourceStatic]
//
// Defaults: dist/current/static and static. Exits 1 and lists every problem.
// It reads only catalogues, top-level pages and app scripts, so it does not
// need static/misc (absent from the CI checkout).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JS_SKIP } from "./util.js";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../../..");
const BUILT = path.resolve(process.argv[2] || path.join(ROOT, "dist/current/static"));
const SRC = path.resolve(process.argv[3] || path.join(ROOT, "static"));

const problems = [];
const counts = { catalogues: 0, pages: 0, scripts: 0 };
const fail = (file, message) => problems.push(`${file}: ${message}`);

// The built file, or null (with a problem recorded) when the build lost it.
function readBuilt(rel, encoding) {
  const file = path.join(BUILT, rel);
  if (!existsSync(file)) {
    fail(rel, "missing from the built tree");
    return null;
  }
  return readFileSync(file, encoding);
}

// --- Catalogues: base64url only, and no title readable in the file or in its
// plain base64 decoding (which would mean the XOR step was skipped).
const CATALOGUE_DIR = "assets/json/load";
const CATALOGUES = ["g.json", "apps.json", "packs.json"];
// Short titles could turn up in random base64 by chance; long ones cannot.
const MIN_TITLE = 8;

for (const name of CATALOGUES) {
  const rel = `${CATALOGUE_DIR}/${name}`;
  const titles = JSON.parse(readFileSync(path.join(SRC, rel), "utf8"))
    .map((entry) => entry.name)
    .filter((title) => typeof title === "string" && title.length >= MIN_TITLE);
  if (!titles.length) {
    fail(rel, "source catalogue has no titles to look for");
    continue;
  }
  const built = readBuilt(rel, "utf8");
  if (built === null) continue;
  counts.catalogues++;

  if (!/^[A-Za-z0-9_-]+$/.test(built.trim())) {
    fail(rel, "is not base64url (still plain JSON?)");
  }
  const decoded = Buffer.from(built, "base64url").toString("latin1");
  const readable = titles.filter((t) => built.includes(t) || decoded.includes(t));
  if (readable.length) {
    fail(rel, `${readable.length} titles readable, e.g. "${readable[0]}"`);
  }
}

// --- Pages: no word of the source page's visible text may appear as raw text
// in the built page. Scripts, styles and tags are left out on both sides:
// inline scripts are obfuscated separately, and attributes such as the meta
// description stay readable by design.
const TAG = /<[a-zA-Z!/][^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>/g;

function rawWords(html) {
  const text = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|template|pre|textarea)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(TAG, " ")
    .replace(/&#?\w+;/g, " "); // entities are not raw text
  return new Set(text.match(/[A-Za-z]{4,}/g) || []);
}

const pages = readdirSync(SRC).filter((name) => name.endsWith(".html"));
if (!pages.length) fail(SRC, "no pages to check");

for (const name of pages) {
  const sourceWords = rawWords(readFileSync(path.join(SRC, name), "utf8"));
  if (!sourceWords.size) continue; // a page with no visible text
  const built = readBuilt(name, "utf8");
  if (built === null) continue;
  counts.pages++;

  const builtWords = rawWords(built);
  const leaked = [...sourceWords].filter((word) => builtWords.has(word));
  if (leaked.length) {
    fail(name, `${leaked.length} visible words readable, e.g. "${leaked.slice(0, 5).join('", "')}"`);
  }
  if (!/&#\d+;/.test(built)) fail(name, "has no numeric entities");
}

// --- App scripts: every one must differ from its source, and the catalogue
// path the readers fetch must not survive as a plain string.
const JS_DIR = "assets/js";
const CATALOGUE_PATH = `/${CATALOGUE_DIR}/`;
let readers = 0;

for (const entry of readdirSync(path.join(SRC, JS_DIR), { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".js") || JS_SKIP.has(entry.name)) continue;
  const rel = `${JS_DIR}/${entry.name}`;
  const source = readFileSync(path.join(SRC, rel), "utf8");
  const built = readBuilt(rel, "utf8");
  if (built === null) continue;
  counts.scripts++;

  if (built === source) fail(rel, "is identical to its source");
  if (source.includes(CATALOGUE_PATH)) {
    readers++;
    if (built.includes(CATALOGUE_PATH)) {
      fail(rel, `contains the plain string "${CATALOGUE_PATH}"`);
    }
  }
}
if (!readers) fail(JS_DIR, `no source script mentions ${CATALOGUE_PATH}; update this check`);

if (problems.length) {
  console.error(`[check] ${BUILT} exposes readable content:`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(
  `[check] ok: ${counts.catalogues} catalogues, ${counts.pages} pages, ${counts.scripts} scripts in ${BUILT}`,
);
