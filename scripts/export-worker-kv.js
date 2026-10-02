// One-off export of the Worker's KV saves to migration-data/saves.ndjson.
//
//   CF_API_TOKEN=... CF_ACCOUNT_ID=... CF_KV_NAMESPACE_ID=... \
//     node scripts/export-worker-kv.js [--fresh] [--out <file>]
//
// Each output line is {"uuid": "<kv key>", "saveData": "<raw value>"}.
// A re-run skips keys already in the file, so an interrupted export resumes.
// Pass --fresh to start over (required for the final run during the freeze,
// because KV cannot tell us which saves changed since the last export).
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { readNdjsonLines } from "./lib/ndjson.js";

const API_ROOT =
  process.env.CF_API_ROOT || "https://api.cloudflare.com/client/v4";
const LIST_PAGE_SIZE = 1000;
const BULK_GET_SIZE = 100;
// Cloudflare allows 1,200 API requests per 5 minutes.
const MIN_REQUEST_INTERVAL_MS = 260;
const MAX_ATTEMPTS = 6;

const args = process.argv.slice(2);
const fresh = args.includes("--fresh");
const outIndex = args.indexOf("--out");
const outFile = path.resolve(
  outIndex === -1 ? "migration-data/saves.ndjson" : args[outIndex + 1],
);

const { CF_API_TOKEN, CF_ACCOUNT_ID, CF_KV_NAMESPACE_ID } = process.env;
if (!CF_API_TOKEN || !CF_ACCOUNT_ID || !CF_KV_NAMESPACE_ID) {
  console.error(
    "Set CF_API_TOKEN, CF_ACCOUNT_ID and CF_KV_NAMESPACE_ID before running.",
  );
  process.exit(1);
}

const namespaceUrl = `${API_ROOT}/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let lastRequestAt = 0;

// Spaces requests out and retries rate limits and server errors.
async function cloudflareFetch(url, options = {}) {
  for (let attempt = 1; ; attempt += 1) {
    const wait = lastRequestAt + MIN_REQUEST_INTERVAL_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastRequestAt = Date.now();

    let response;
    try {
      response = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          ...options.headers,
        },
      });
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS) throw error;
      await sleep(1000 * 2 ** attempt);
      continue;
    }

    if (response.status === 429 || response.status >= 500) {
      if (attempt >= MAX_ATTEMPTS) {
        throw new Error(`Cloudflare API ${response.status} for ${url}`);
      }
      const retryAfter = Number(response.headers.get("retry-after")) || 0;
      await sleep(Math.max(retryAfter * 1000, 1000 * 2 ** attempt));
      continue;
    }

    return response;
  }
}

async function listAllKeys() {
  const keys = [];
  let cursor = "";

  do {
    const url = new URL(`${namespaceUrl}/keys`);
    url.searchParams.set("limit", String(LIST_PAGE_SIZE));
    if (cursor) url.searchParams.set("cursor", cursor);

    const response = await cloudflareFetch(url);
    const body = await response.json();
    if (!response.ok || !body.success) {
      throw new Error(`Listing KV keys failed: ${JSON.stringify(body.errors)}`);
    }

    keys.push(...body.result.map((entry) => entry.name));
    cursor = body.result_info?.cursor || "";
    console.log(`Listed ${keys.length} keys...`);
  } while (cursor);

  return keys;
}

const stats = { bulkOk: 0, bulkFailed: 0, singleReads: 0 };

// Returns a Map of key -> raw value from the bulk endpoint, or null when the
// call fails (the response is capped at about 25 MB, so a batch of large
// saves is rejected as a whole).
async function bulkGet(keys) {
  try {
    const response = await cloudflareFetch(`${namespaceUrl}/bulk/get`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys, type: "text" }),
    });
    const body = response.ok ? await response.json() : null;
    const found = body?.result?.values;
    if (!body?.success || !found || typeof found !== "object") {
      stats.bulkFailed += 1;
      return null;
    }

    stats.bulkOk += 1;
    const values = new Map();
    for (const key of keys) {
      if (typeof found[key] === "string") values.set(key, found[key]);
    }
    return values;
  } catch (error) {
    stats.bulkFailed += 1;
    return null;
  }
}

// Fetches a batch in as few requests as possible: a rejected bulk call is
// retried as two halves, and keys a bulk call leaves out are read singly.
async function fetchValues(keys) {
  if (keys.length === 1) {
    return new Map([[keys[0], await getOne(keys[0])]]);
  }

  const found = await bulkGet(keys);
  if (!found) {
    const middle = Math.ceil(keys.length / 2);
    const left = await fetchValues(keys.slice(0, middle));
    const right = await fetchValues(keys.slice(middle));
    return new Map([...left, ...right]);
  }

  for (const key of keys) {
    if (!found.has(key)) found.set(key, await getOne(key));
  }
  return found;
}

const NOT_FOUND_ATTEMPTS = 3;

// A listed key can 404 briefly on a single read (seen in practice), so a
// 404 is retried before the key is treated as gone.
async function getOne(key) {
  stats.singleReads += 1;

  for (let attempt = 1; attempt <= NOT_FOUND_ATTEMPTS; attempt += 1) {
    const response = await cloudflareFetch(
      `${namespaceUrl}/values/${encodeURIComponent(key)}`,
    );
    if (response.ok) return response.text();
    if (response.status !== 404) {
      throw new Error(`Reading KV key ${key} failed: ${response.status}`);
    }
    if (attempt < NOT_FOUND_ATTEMPTS) await sleep(2000 * attempt);
  }

  return null;
}

async function readExportedKeys(file) {
  const exported = new Set();
  if (!fs.existsSync(file)) return exported;

  for await (const line of readNdjsonLines(file)) {
    try {
      exported.add(JSON.parse(line).uuid);
    } catch {
      throw new Error(
        `${file} has a truncated line (interrupted write?). Remove the last line or re-run with --fresh.`,
      );
    }
  }
  return exported;
}

async function main() {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  if (fresh) fs.rmSync(outFile, { force: true });

  const alreadyExported = await readExportedKeys(outFile);
  const allKeys = await listAllKeys();
  const pending = allKeys.filter((key) => !alreadyExported.has(key));
  console.log(
    `${allKeys.length} keys in KV, ${alreadyExported.size} already exported, ${pending.length} to fetch.`,
  );

  const out = fs.openSync(outFile, "a");
  let written = 0;
  const missing = [];
  let bytes = 0;

  try {
    for (let start = 0; start < pending.length; start += BULK_GET_SIZE) {
      const batch = pending.slice(start, start + BULK_GET_SIZE);
      const values = await fetchValues(batch);

      for (const key of batch) {
        const value = values.get(key);
        if (value === null) {
          missing.push(key);
          continue;
        }

        const line = `${JSON.stringify({ uuid: key, saveData: value })}\n`;
        fs.writeSync(out, line);
        written += 1;
        bytes += Buffer.byteLength(line);
      }

      console.log(
        `Fetched ${Math.min(start + BULK_GET_SIZE, pending.length)}/${pending.length} (bulk ok ${stats.bulkOk}, bulk rejected ${stats.bulkFailed}, single reads ${stats.singleReads})`,
      );
    }
  } finally {
    fs.closeSync(out);
  }

  console.log("\nKV export finished");
  console.log(`  keys in KV:            ${allKeys.length}`);
  console.log(`  already in the file:   ${alreadyExported.size}`);
  console.log(`  written this run:      ${written}`);
  console.log(`  listed but not found:  ${missing.length}`);
  if (missing.length) {
    console.log(`    ${missing.join("\n    ")}`);
    console.log("  Run again (without --fresh) to retry those keys.");
  }
  console.log(`  bytes written:         ${bytes}`);
  console.log(`  output:                ${outFile}`);
}

main().catch((error) => {
  console.error("KV export failed:", error);
  process.exit(1);
});
