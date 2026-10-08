// Splits every file over jsDelivr's 20 MB limit in a game folder into 10 MB
// .part1, .part2, ... pieces, removes the original, and prints the
// [path, bytes] lists that GameLoader.prepare() and GameLoader.merge() take.
//
//   node scripts/split-game-files.js <folder> [--limit 20] [--chunk 10]
//
// --limit and --chunk are in MB. Lower both for a game whose files the CDN
// keeps refusing: small pieces fail far less often than large ones.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const megabytes = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return (index >= 0 ? Number(args[index + 1]) : fallback) * 1_000_000;
};
const LIMIT = megabytes("limit", 20);
const CHUNK = megabytes("chunk", 10);
const folder = args[0];
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const gameDir = path.join(root, "static/misc", folder || "");
if (!folder || !fs.existsSync(gameDir) || !(LIMIT > 0) || !(CHUNK > 0)) {
  console.error(
    "Usage: node scripts/split-game-files.js <folder> [--limit 20] [--chunk 10]",
  );
  process.exit(1);
}

const split = {};
for (const entry of fs.readdirSync(gameDir, {
  recursive: true,
  withFileTypes: true,
})) {
  const file = path.join(entry.parentPath, entry.name);
  if (!entry.isFile() || /\.part\d+$/.test(file)) continue;
  const size = fs.statSync(file).size;
  if (size <= LIMIT) continue;
  const rel = path.relative(gameDir, file).split(path.sep).join("/");
  const source = fs.openSync(file, "r");
  const parts = [];
  for (let offset = 0, number = 1; offset < size; offset += CHUNK, number++) {
    const buffer = Buffer.alloc(Math.min(CHUNK, size - offset));
    fs.readSync(source, buffer, 0, buffer.length, offset);
    fs.writeFileSync(`${file}.part${number}`, buffer);
    parts.push([`${rel}.part${number}`, buffer.length]);
  }
  fs.closeSync(source);
  fs.rmSync(file);
  split[rel] = parts;
}
if (!Object.keys(split).length)
  console.error(`Nothing over ${LIMIT / 1_000_000} MB.`);
else console.log(JSON.stringify(split, null, 2));
