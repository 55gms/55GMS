import { gunzipSync, gzipSync } from "node:zlib";

// Where the bytes of a game save live. A save is gzipped and kept in its
// Postgres row; one still larger than SAVE_INLINE_MAX_BYTES after
// compression goes to a BunnyCDN storage zone when BUNNY_SAVES_ZONE and
// BUNNY_SAVES_KEY are set. Storage zones are private: files are read back
// through the storage API with the zone's key, never through a pull zone.

const INLINE_MAX = Number(process.env.SAVE_INLINE_MAX_BYTES) || 512 * 1024;

function bunny() {
  const zone = process.env.BUNNY_SAVES_ZONE;
  const key = process.env.BUNNY_SAVES_KEY;
  if (!zone || !key) return null;
  const host = process.env.BUNNY_SAVES_HOST || "storage.bunnycdn.com";
  return { base: `https://${host}/${encodeURIComponent(zone)}/`, key };
}

export function objectStorageConfigured() {
  return Boolean(bunny());
}

// Saves are content-addressed per account, so an unchanged save that comes
// back (a restore, a retried upload) reuses its file.
function blobKeyFor(uuid, hash) {
  return `game-saves/${encodeURIComponent(uuid)}/${hash}.gz`;
}

async function request(method, key, body) {
  const store = bunny();
  if (!store) throw new Error("Object storage is not configured");
  const response = await fetch(store.base + key, {
    method,
    headers: {
      AccessKey: store.key,
      ...(body ? { "Content-Type": "application/octet-stream" } : {}),
    },
    body,
    signal: AbortSignal.timeout(20000),
  });
  if (method === "DELETE" && response.status === 404) return response;
  if (!response.ok) {
    throw new Error(`Object storage ${method} failed: ${response.status}`);
  }
  return response;
}

// { data, blobKey } for a save's text: the gzipped bytes for the row, or the
// object storage key they were written to.
export async function storeSaveText(uuid, hash, text) {
  const compressed = gzipSync(Buffer.from(text, "utf8"), { level: 6 });
  if (compressed.length <= INLINE_MAX || !bunny()) {
    return { data: compressed, blobKey: null };
  }
  const blobKey = blobKeyFor(uuid, hash);
  await request("PUT", blobKey, compressed);
  return { data: null, blobKey };
}

export async function loadSaveText({ data, blobKey }) {
  let compressed = data;
  if (!compressed && blobKey) {
    compressed = Buffer.from(
      await (await request("GET", blobKey)).arrayBuffer(),
    );
  }
  if (!compressed) throw new Error("Save has no data");
  return gunzipSync(compressed).toString("utf8");
}

export async function deleteBlob(blobKey) {
  if (!blobKey || !bunny()) return;
  await request("DELETE", blobKey);
}
