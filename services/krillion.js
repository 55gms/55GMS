import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

// Krillion (krillion.io) is a daily game: seven prompts, the same for
// everyone, and an answer scores by how rare it is. The site publishes the
// day's whole answer table, so this server keeps one copy of it and plays the
// part of the game's API (the page under /misc/krillion/ calls /api/krillion/*)
// without sending any visitor to krillion.io.
//
// One copy per day, on disk, shared by every pm2 worker: the first worker to
// need a new day fetches it under a lock file, the rest read the files.
const UPSTREAM = "https://krillion.io";
export const KRILLION_CACHE_DIR =
  process.env.KRILLION_CACHE_DIR ||
  path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    ".krillion-cache",
  );
const FETCH_TIMEOUT_MS = 180_000; // the answer table takes about a minute
const RETRY_MS = 30_000;
const LOCK_STALE_MS = 2 * 60_000;
const LOCK_WAIT_MS = 30_000;
const KEEP_FILES = 3;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const CACHE_DIR = KRILLION_CACHE_DIR;

const todayFile = (date) => path.join(CACHE_DIR, `${date}.today.json`);
const revealFile = (date) => path.join(CACHE_DIR, `${date}.reveal.json.gz`);
const lockFile = path.join(CACHE_DIR, "fetch.lock");

export const isDate = (value) => typeof value === "string" && DATE.test(value);

// "Mr. Peabody & Sherman", "mr peabody and sherman" and "Mr Peabody and
// Sherman" are one answer.
export function normalize(text) {
  return String(text)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function checkToday(today) {
  const ok =
    today &&
    isDate(today.date) &&
    Number.isFinite(Date.parse(today.resetsAt)) &&
    Array.isArray(today.prompts) &&
    today.prompts.length > 0 &&
    today.prompts.every(
      (p) => typeof p?.id === "string" && typeof p.text === "string",
    );
  if (!ok) throw new Error("Krillion's /api/today has an unexpected shape");
}

function checkReveal(reveal, today) {
  const ok =
    reveal?.date === today.date &&
    Array.isArray(reveal.prompts) &&
    today.prompts.every((p) => {
      const found = reveal.prompts.find((r) => r?.id === p.id);
      return found && Array.isArray(found.answers) && found.answers.length > 0;
    });
  if (!ok) throw new Error("Krillion's /api/reveal has an unexpected shape");
}

// The answers as a lookup, one per prompt. Only what a reply needs is kept
// (the reveal file itself is served from the compressed copy).
function indexDay(today, todayText, revealGz, reveal) {
  const prompts = new Map();
  for (const prompt of reveal.prompts) {
    const answers = [];
    const keys = new Map();
    for (const item of prompt.answers) {
      const entry = {
        answer: String(item.answer),
        tier: String(item.tier),
        score: Number(item.score),
        quip: typeof item.quip === "string" ? item.quip : undefined,
      };
      const at = answers.push(entry) - 1;
      for (const name of [item.answer, ...(item.aliases || [])]) {
        const key = normalize(name);
        if (!key) continue;
        const known = keys.get(key);
        if (known === undefined || answers[known].score < entry.score) {
          keys.set(key, at);
        }
      }
    }
    prompts.set(prompt.id, { answers, keys });
  }
  return {
    date: today.date,
    resetsAtMs: Date.parse(today.resetsAt),
    todayText,
    revealGz,
    prompts,
  };
}

async function readDay(date) {
  try {
    const [todayText, revealGz] = await Promise.all([
      fs.readFile(todayFile(date), "utf8"),
      fs.readFile(revealFile(date)),
    ]);
    const today = JSON.parse(todayText);
    checkToday(today);
    const reveal = JSON.parse(await gunzip(revealGz));
    checkReveal(reveal, today);
    return indexDay(today, todayText, revealGz, reveal);
  } catch {
    return null;
  }
}

async function newestDay() {
  let names;
  try {
    names = await fs.readdir(CACHE_DIR);
  } catch {
    return null;
  }
  const dates = names
    .map((name) => name.match(/^(\d{4}-\d{2}-\d{2})\.today\.json$/)?.[1])
    .filter(Boolean)
    .sort()
    .reverse();
  for (const date of dates.slice(0, 2)) {
    const day = await readDay(date);
    if (day && day.resetsAtMs > Date.now()) return day;
  }
  return null;
}

async function getJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`${url} answered ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function writeAtomic(file, data) {
  const temp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(temp, data);
  await fs.rename(temp, file);
}

async function prune() {
  try {
    const names = await fs.readdir(CACHE_DIR);
    const dates = [
      ...new Set(
        names.map((name) => name.match(/^(\d{4}-\d{2}-\d{2})\./)?.[1]),
      ),
    ]
      .filter(Boolean)
      .sort()
      .reverse();
    for (const date of dates.slice(KEEP_FILES)) {
      await Promise.all([
        fs.rm(todayFile(date), { force: true }),
        fs.rm(revealFile(date), { force: true }),
        fs.rm(path.join(CACHE_DIR, `${date}.scores.log`), { force: true }),
      ]);
    }
  } catch {
    // Old files are only clutter.
  }
}

async function fetchFromUpstream() {
  const todayText = (await getJson(`${UPSTREAM}/api/today`)).toString("utf8");
  const today = JSON.parse(todayText);
  checkToday(today);
  if (Date.parse(today.resetsAt) <= Date.now()) {
    // Their edge cache can hold the old day for a minute after the reset.
    throw new Error("Krillion has not moved on to the new day yet");
  }
  const revealRaw = await getJson(
    `${UPSTREAM}/api/reveal?date=${encodeURIComponent(today.date)}`,
  );
  const reveal = JSON.parse(revealRaw.toString("utf8"));
  checkReveal(reveal, today);
  const revealGz = await gzip(revealRaw, { level: 9 });

  await fs.mkdir(CACHE_DIR, { recursive: true });
  // The reveal goes last: a day is there only when both files are.
  await writeAtomic(todayFile(today.date), todayText);
  await writeAtomic(revealFile(today.date), revealGz);
  void prune();
  return indexDay(today, todayText, revealGz, reveal);
}

async function takeLock() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const handle = await fs.open(lockFile, "wx");
      await handle.close();
      return true;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      const { mtimeMs } = await fs.stat(lockFile).catch(() => ({ mtimeMs: 0 }));
      if (Date.now() - mtimeMs < LOCK_STALE_MS) return false;
      await fs.rm(lockFile, { force: true });
    }
  }
  return false;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function loadDay() {
  const onDisk = await newestDay();
  if (onDisk) return onDisk;

  if (await takeLock()) {
    try {
      return await fetchFromUpstream();
    } finally {
      await fs.rm(lockFile, { force: true });
    }
  }
  // Another worker is fetching it.
  const until = Date.now() + LOCK_WAIT_MS;
  while (Date.now() < until) {
    await sleep(500);
    const day = await newestDay();
    if (day) return day;
  }
  throw new Error("Timed out waiting for another worker's Krillion fetch");
}

let current = null;
let loading = null;
let retryAt = 0;
let lastError = null;

// Today's day. Past the reset it fetches the next one; if that fails the old
// day keeps being served, and the fetch is tried again every 30 seconds.
export async function getDay() {
  if (current && Date.now() < current.resetsAtMs) return current;
  if (Date.now() < retryAt) {
    if (current) return current;
    throw lastError;
  }
  const pending = (loading ||= loadDay()
    .then((day) => {
      current = day;
      lastError = null;
      return day;
    })
    .catch((error) => {
      console.error("[krillion]", error.message);
      retryAt = Date.now() + RETRY_MS;
      lastError = error;
      if (!current) throw error;
      return current;
    })
    .finally(() => {
      loading = null;
    }));
  // The old day is still good for players while the new one is on its way.
  return current ?? pending;
}

let pastDay = null;

// The day a player is on, for scoring: today's, the new one this worker is
// still loading (its old day is returned meanwhile, while the page may have
// had the new one from another worker), or a recent one from disk, so a game
// started before the reset can be finished. Null for a day that is not kept.
export async function getDayFor(date) {
  const day = await getDay();
  if (day.date === date) return day;
  if (loading) {
    const next = await loading.catch(() => null);
    if (next?.date === date) return next;
  }
  if (!isDate(date)) return null;
  if (pastDay?.date === date) return pastDay;
  const past = await readDay(date);
  if (past) pastDay = past;
  return past;
}

// The compressed reveal for a day: today's from memory, a recent one from disk.
export async function getReveal(date) {
  const day = await getDay().catch(() => null);
  if (day && day.date === date) return day.revealGz;
  if (!isDate(date)) return null;
  return fs.readFile(revealFile(date)).catch(() => null);
}

// The scored answer for what a player typed, or null.
export function findAnswer(day, promptId, text) {
  const prompt = day.prompts.get(promptId);
  if (!prompt) return null;
  const key = normalize(text);
  if (!key) return null;
  let at = prompt.keys.get(key);
  if (at === undefined && key.startsWith("the ")) {
    at = prompt.keys.get(key.slice(4));
  }
  return at === undefined ? null : prompt.answers[at];
}

// Fetch the day at boot so the first player does not wait for it.
export function warmKrillion() {
  getDay().catch(() => {});
}
