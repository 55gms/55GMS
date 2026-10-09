import { randomBytes } from "node:crypto";
import { cp, readdir } from "node:fs/promises";
import path from "node:path";

// Files later stages are ALLOWED to modify. Anything else is copied through
// untouched by prepare, so a new kind of file is never half-transformed.
export const JS_SKIP = new Set(["easteregg.min.js", "frame-runtime.js"]);

export async function copyTree(src, dst) {
  await cp(src, dst, { recursive: true, dereference: false });
}

export async function* walkFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkFiles(p);
    else if (entry.isFile()) yield p;
  }
}

// Matches the committed readers: file = key(16) || (plain[i] ^ key[i % 16]),
// then base64url (no padding, URL-safe alphabet).
export function base64urlXor(plain, key) {
  const cipher = Buffer.alloc(plain.length);
  for (let i = 0; i < plain.length; i++) cipher[i] = plain[i] ^ key[i % 16];
  return Buffer.concat([key, cipher]).toString("base64url");
}

export { randomBytes };
