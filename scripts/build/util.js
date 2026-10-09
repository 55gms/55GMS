import { randomBytes } from "node:crypto";
import { cp, readdir } from "node:fs/promises";
import path from "node:path";

// Files later stages are ALLOWED to modify. Anything else is copied through
// untouched by prepare, so a new kind of file is never half-transformed.
// easteregg.min.js is third-party and already minified, so it is left alone.
export const JS_SKIP = new Set(["easteregg.min.js"]);

// Scripts that export functions which are later serialized with
// Function.prototype.toString() and re-evaluated in a context that has none of
// this file's module-level helpers. frame-runtime.js hands codec.encode/decode
// to the proxy controller, which injects `${codec.encode.toString()}` into the
// service worker and every frame (see controller.api.js). The default RC4
// string-array + control-flow profile rewrites those bodies to reference a
// module-level decoder, so the serialized copy throws "<name> is not defined".
// These files get the serialization-safe profile in javascript.js instead.
export const SERIALIZED_FN_SCRIPTS = new Set(["frame-runtime.js"]);

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
