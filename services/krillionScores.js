import fs from "node:fs/promises";
import path from "node:path";
import { KRILLION_CACHE_DIR } from "./krillion.js";

// Today's finished scores, for the results screen's "better than N%" and its
// distribution chart. krillion.io keeps these on its own leaderboard, which
// this copy of the game never reaches, so the server counts its own players.
//
// One append-only file per day next to the cached answers, shared by every pm2
// worker: a finish appends "<player> <score>", and each worker reads what the
// others appended since it last looked. A player's last finish counts.
const MAX_DAY_SCORE = 700; // the game's MAX_DAY_SCORE: the chart's x axis
const BINS = 35;
const MAX_FILE_BYTES = 20 * 1024 * 1024;
const PLAYER = /^[A-Za-z0-9_-]{8,64}$/;

const scoresFile = (date) =>
  path.join(KRILLION_CACHE_DIR, `${date}.scores.log`);

// What this worker has read of the day's file.
let seen = { date: null, offset: 0, players: new Map() };

async function catchUp(date) {
  if (seen.date !== date) seen = { date, offset: 0, players: new Map() };
  let handle;
  try {
    handle = await fs.open(scoresFile(date), "r");
  } catch {
    return;
  }
  try {
    const { size } = await handle.stat();
    if (size <= seen.offset) return;
    const buffer = Buffer.alloc(size - seen.offset);
    await handle.read(buffer, 0, buffer.length, seen.offset);
    // A line still being written by another worker waits for the next read.
    const end = buffer.lastIndexOf(10);
    if (end < 0) return;
    for (const line of buffer.subarray(0, end).toString("utf8").split("\n")) {
      const [player, text] = line.split(" ");
      const score = Number(text);
      if (PLAYER.test(player) && Number.isInteger(score)) {
        seen.players.set(player, score);
      }
    }
    seen.offset += end + 1;
  } finally {
    await handle.close();
  }
}

function stats(score) {
  const dist = new Array(BINS).fill(0);
  let below = 0;
  for (const value of seen.players.values()) {
    dist[Math.min(BINS - 1, Math.floor((value / MAX_DAY_SCORE) * BINS))]++;
    if (value < score) below++;
  }
  const share = (below / Math.max(1, seen.players.size)) * 100;
  // The page prints two decimals from 99.5 up, the number as it is below.
  const betterThan =
    share >= 99.5 ? Math.floor(share * 100) / 100 : Math.floor(share);
  return { betterThan, dist, players: seen.players.size };
}

// Records a finish of `date` (today) and returns where it stands.
export async function recordScore(date, player, score) {
  score = Math.max(0, Math.min(MAX_DAY_SCORE, Math.round(score)));
  await catchUp(date);
  if (PLAYER.test(player) && seen.players.get(player) !== score) {
    const file = scoresFile(date);
    const { size } = await fs.stat(file).catch(() => ({ size: 0 }));
    if (size < MAX_FILE_BYTES) {
      await fs.mkdir(KRILLION_CACHE_DIR, { recursive: true });
      await fs.appendFile(file, `${player} ${score}\n`);
    }
    await catchUp(date);
    // Counted even when the file is full, so the chart still shows the player.
    seen.players.set(player, score);
  }
  return stats(score);
}
