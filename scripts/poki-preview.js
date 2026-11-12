// Downloads a game's hover clip from Poki: the short muted square video Poki
// plays over its own tile (v.poki-cdn.com/<id>/thumbnail.3x3.h264.mp4), which
// is what every clip in static/img/videos/preview/ is. hover-preview.js plays
// it over the game's tile once the catalog entry has
// "preview": "/img/videos/preview/<file>.mp4".
//
//   node scripts/poki-preview.js "<Game Name>" [<poki url or slug>] [--force]
//
// Without a URL or slug it tries poki.com/en/g/<name as a slug>, and keeps the
// clip only if Poki's title for that page is the same game name. The file is
// named after the game: lowercase letters and digits only ("Crazy Cars" ->
// crazycars.mp4). --force replaces an existing clip, or accepts a Poki title
// that differs from the name.
//
// Prints the catalog value on success. Exits 2 when Poki has no such game or
// no clip for it (nothing to add), 1 on any other error.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const force = args.includes("--force");
const [name, source] = args.filter((arg) => !arg.startsWith("--"));
if (!name) {
  console.error(
    'Usage: node scripts/poki-preview.js "<Game Name>" [<poki url or slug>] [--force]',
  );
  process.exit(1);
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const previewDir = path.join(root, "static", "img", "videos", "preview");
const MAX_BYTES = 3 * 1024 * 1024;
const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

const fileName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
const compact = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, "");
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function slugFrom(value) {
  if (!value) return slugify(name);
  const match = /poki\.[a-z.]+\/(?:[a-z]{2}\/)?g\/([a-z0-9-]+)/i.exec(value);
  if (match) return match[1].toLowerCase();
  if (/^[a-z0-9-]+$/i.test(value)) return value.toLowerCase();
  console.error(`Not a Poki game URL or slug: ${value}`);
  process.exit(1);
}

function none(message) {
  console.log(`No Poki clip: ${message}`);
  process.exit(2);
}

if (!fileName) {
  console.error(`"${name}" has no letters or digits to name the file after.`);
  process.exit(1);
}
const target = path.join(previewDir, `${fileName}.mp4`);
const catalogValue = `/img/videos/preview/${fileName}.mp4`;
if (fs.existsSync(target) && !force) {
  console.log(`Already have ${catalogValue} (pass --force to replace it).`);
  console.log(`preview: ${catalogValue}`);
  process.exit(0);
}

const slug = slugFrom(source);
const pageUrl = `https://poki.com/en/g/${slug}`;
const page = await fetch(pageUrl, {
  headers: { "User-Agent": USER_AGENT, "Accept-Language": "en" },
  redirect: "follow",
});
if (page.status === 404) none(`${pageUrl} does not exist.`);
if (!page.ok) {
  console.error(`${pageUrl} answered ${page.status}.`);
  process.exit(1);
}
// The page embeds its data as escaped JSON; unescape the slashes and quotes.
const html = (await page.text()).replace(/\\u002F/gi, "/").replace(/\\"/g, '"');

// Related games on the page carry clips too. The game itself is the "data"
// of the page's getGame request: read its own fields, which come before its
// list of the developer's other games.
const request = html.indexOf('"endpointName":"getGame"');
const dataStart = request < 0 ? -1 : html.indexOf('"data":{', request);
if (dataStart < 0) {
  console.error(`${pageUrl} has no game data where this script expects it.`);
  process.exit(1);
}
const ends = ['"developer_games"', '"endpointName"']
  .map((marker) => html.indexOf(marker, dataStart))
  .filter((index) => index > 0);
const game = html.slice(dataStart, Math.min(...ends, dataStart + 50000));
const gameSlug = /"slug":"([a-z0-9-]+)"/.exec(game)?.[1];
if (gameSlug !== slug) {
  console.error(`${pageUrl} describes "${gameSlug}", not "${slug}".`);
  process.exit(1);
}
const title = /"title":"([^"]+)"/.exec(game)?.[1] || null;
const animated = /"animated_thumbnail":"([0-9a-f-]{36})\/thumbnail"/.exec(game);
if (!animated) none(`${pageUrl} has no animated thumbnail for this game.`);
const clip = `https://v.poki-cdn.com/${animated[1]}/thumbnail.3x3.h264.mp4`;

if (title && compact(title) !== compact(name) && !force) {
  none(
    `Poki calls ${pageUrl} "${title}", not "${name}". If it is the same game, run again with --force.`,
  );
}

const response = await fetch(clip, { headers: { "User-Agent": USER_AGENT } });
if (response.status === 404 || response.status === 403) {
  none(`${clip} answered ${response.status}.`);
}
if (!response.ok) {
  console.error(`${clip} answered ${response.status}.`);
  process.exit(1);
}
const bytes = Buffer.from(await response.arrayBuffer());
if (bytes.length > MAX_BYTES) {
  console.error(
    `${clip} is ${bytes.length} bytes, more than a tile clip should be.`,
  );
  process.exit(1);
}
if (bytes.subarray(4, 8).toString("latin1") !== "ftyp") {
  console.error(`${clip} is not an MP4.`);
  process.exit(1);
}

fs.mkdirSync(previewDir, { recursive: true });
fs.writeFileSync(target, bytes);
console.log(
  `Saved ${path.relative(root, target)} (${Math.round(bytes.length / 1024)} KB) from ${clip}${title ? ` ("${title}" on Poki)` : ""}.`,
);
console.log(`preview: ${catalogValue}`);
