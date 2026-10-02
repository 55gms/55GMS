import assert from "node:assert/strict";
import test from "node:test";

process.env.POSTGRES_URL ||= "postgres://user:password@localhost:5432/test";

const {
  MAX_MESSAGES_PER_CHAT,
  deleteExpiredMessages,
  retentionCutoff,
  trimChatMessages,
} = await import("../services/messageRetention.js");

test("retention cutoff is 365 days before now", () => {
  const now = new Date("2026-10-01T12:00:00.000Z");
  assert.equal(retentionCutoff(now).toISOString(), "2025-10-01T12:00:00.000Z");
});

test("expired messages are deleted in batches until one comes back short", async () => {
  const now = new Date("2026-10-01T12:00:00.000Z");
  const batches = [100, 100, 40];
  const calls = [];

  const total = await deleteExpiredMessages({
    now,
    batchSize: 100,
    deleteBatch: async (cutoff, batchSize) => {
      calls.push({ cutoff: cutoff.toISOString(), batchSize });
      return batches.shift();
    },
  });

  assert.equal(total, 240);
  assert.equal(calls.length, 3);
  assert.deepEqual(calls[0], {
    cutoff: "2025-10-01T12:00:00.000Z",
    batchSize: 100,
  });
});

test("nothing expired means a single delete attempt", async () => {
  let callCount = 0;
  const total = await deleteExpiredMessages({
    deleteBatch: async () => {
      callCount += 1;
      return 0;
    },
  });

  assert.equal(total, 0);
  assert.equal(callCount, 1);
});

test("chat trim keeps the newest messages with one statement", async () => {
  const calls = [];
  const run = async (sql, replacements) => {
    calls.push({ sql, replacements });
    return 3;
  };

  assert.equal(await trimChatMessages("chat-1", undefined, run), 3);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].replacements, {
    chatId: "chat-1",
    keep: MAX_MESSAGES_PER_CHAT,
  });
  assert.match(calls[0].sql, /ORDER BY "createdAt" DESC OFFSET :keep/);
});
