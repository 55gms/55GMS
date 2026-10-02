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

// Returns a Map of key -> raw value for whatever the bulk endpoint gives us.
// Anything missing (or a failed call) is fetched one key at a time instead.
async function bulkGet(keys) {
  const values = new Map();

  try {
    const response = await cloudflareFetch(`${namespaceUrl}/bulk/get`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys, type: "text" }),
    });
    if (!response.ok) return values;

    const body = await response.json();
    const found = body?.result?.values;
    if (!body.success || !found || typeof found !== "object") return values;

    for (const key of keys) {
      if (typeof found[key] === "string") values.set(key, found[key]);
    }
  } catch (error) {
    console.warn(`Bulk get failed, falling back to single reads: ${error}`);
  }

  return values;
}

async function getOne(key) {
  const response = await cloudflareFetch(
    `${namespaceUrl}/values/${encodeURIComponent(key)}`,
  );
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Reading KV key ${key} failed: ${response.status}`);
  }
  return response.text();
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
  let missing = 0;
  let bytes = 0;

  try {
    for (let start = 0; start < pending.length; start += BULK_GET_SIZE) {
      const batch = pending.slice(start, start + BULK_GET_SIZE);
      const values = await bulkGet(batch);

      for (const key of batch) {
        const value = values.has(key) ? values.get(key) : await getOne(key);
        if (value === null) {
          missing += 1;
          continue;
        }

        const line = `${JSON.stringify({ uuid: key, saveData: value })}\n`;
        fs.writeSync(out, line);
        written += 1;
        bytes += Buffer.byteLength(line);
      }

      console.log(
        `Fetched ${Math.min(start + BULK_GET_SIZE, pending.length)}/${pending.length}`,
      );
    }
  } finally {
    fs.closeSync(out);
  }

  console.log("\nKV export finished");
  console.log(`  keys in KV:            ${allKeys.length}`);
  console.log(`  already in the file:   ${alreadyExported.size}`);
  console.log(`  written this run:      ${written}`);
  console.log(`  deleted before fetch:  ${missing}`);
  console.log(`  bytes written:         ${bytes}`);
  console.log(`  output:                ${outFile}`);
}

main().catch((error) => {
  console.error("KV export failed:", error);
  process.exit(1);
});
