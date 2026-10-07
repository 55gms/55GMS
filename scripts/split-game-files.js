// Splits every file over jsDelivr's 20 MB limit in a game folder into 10 MB
// .part1, .part2, ... pieces, removes the original, and prints the
// [path, bytes] lists that GameLoader.prepare() and GameLoader.merge() take.
//
//   node scripts/split-game-files.js <folder>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const LIMIT = 20_000_000;
const CHUNK = 10_000_000;
const folder = process.argv[2];
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const gameDir = path.join(root, "static/misc", folder || "");
if (!folder || !fs.existsSync(gameDir)) {
  console.error("Usage: node scripts/split-game-files.js <folder>");
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
if (!Object.keys(split).length) console.error("Nothing over 20 MB.");
else console.log(JSON.stringify(split, null, 2));
