import assert from "node:assert/strict";
import test from "node:test";
import {
  hashPassword,
  isLegacyHash,
  verifyPassword,
  wrapLegacyHash,
} from "../utils/passwordHash.js";

// Shaped like a Worker-stored hash: 64 lowercase hex characters.
const SAMPLE_LEGACY_HASH =
  "7c6a61c68ef8b9b6b061b28c348bc1ed7921cb53a4cf4a2bf0a1b9b0e2bb9b9b";

async function workerHash(plain) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(plain),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

test("a wrapped Worker hash verifies against the original password", async () => {
  const legacy = await workerHash("hunter22");
  const stored = await wrapLegacyHash(legacy, 4);

  assert.equal(await verifyPassword("hunter22", stored), true);
  assert.equal(await verifyPassword("hunter23", stored), false);
});

test("wrapped hashes keep non-ASCII passwords working", async () => {
  const legacy = await workerHash("pässwörd✓");
  const stored = await wrapLegacyHash(legacy, 4);

  assert.equal(await verifyPassword("pässwörd✓", stored), true);
});

test("hashPassword output verifies and is salted", async () => {
  const first = await hashPassword("correct horse", 4);
  const second = await hashPassword("correct horse", 4);

  assert.notEqual(first, second);
  assert.equal(await verifyPassword("correct horse", first), true);
  assert.equal(await verifyPassword("wrong horse", first), false);
});

test("verifyPassword rejects a missing stored hash", async () => {
  assert.equal(await verifyPassword("anything", null), false);
  assert.equal(await verifyPassword("anything", ""), false);
});

test("wrapLegacyHash refuses values that are not SHA-256 hex", async () => {
  assert.equal(isLegacyHash(SAMPLE_LEGACY_HASH), true);
  assert.equal(isLegacyHash("plaintext"), false);
  assert.equal(isLegacyHash(SAMPLE_LEGACY_HASH.toUpperCase()), false);
  assert.throws(() => wrapLegacyHash("plaintext"));
});
