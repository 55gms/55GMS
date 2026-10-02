import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";

const BCRYPT_COST = 10;
const LEGACY_HASH_PATTERN = /^[0-9a-f]{64}$/;

// The Worker stored passwords as unsalted SHA-256 hex. Stored hashes are
// bcrypt(sha256hex(password)) so those rows could be wrapped without the
// plaintext, and every row uses the same scheme.
function sha256Hex(plain) {
  return createHash("sha256").update(String(plain), "utf8").digest("hex");
}

export function isLegacyHash(value) {
  return typeof value === "string" && LEGACY_HASH_PATTERN.test(value);
}

export function wrapLegacyHash(legacyHash, cost = BCRYPT_COST) {
  if (!isLegacyHash(legacyHash)) {
    throw new Error("Expected a lowercase SHA-256 hex string");
  }
  return bcrypt.hash(legacyHash, cost);
}

export function hashPassword(plain, cost = BCRYPT_COST) {
  return bcrypt.hash(sha256Hex(plain), cost);
}

export function verifyPassword(plain, storedHash) {
  if (typeof storedHash !== "string" || !storedHash) {
    return Promise.resolve(false);
  }
  return bcrypt.compare(sha256Hex(plain), storedHash);
}
