import { sequelize } from "../models/index.js";

export const MESSAGE_RETENTION_MS = 365 * 24 * 60 * 60 * 1000;
export const MAX_MESSAGES_PER_CHAT = 200;

const SWEEP_INTERVAL_MS = 24 * 60 * 60 * 1000;
const FIRST_SWEEP_DELAY_MS = 60 * 1000;
const DEFAULT_BATCH_SIZE = 5000;

async function runDelete(sql, replacements) {
  const [, result] = await sequelize.query(sql, { replacements });
  return result?.rowCount || 0;
}

export function retentionCutoff(now = new Date()) {
  return new Date(now.getTime() - MESSAGE_RETENTION_MS);
}

function deleteExpiredBatch(cutoff, batchSize) {
  return runDelete(
    `DELETE FROM messages WHERE id IN (
       SELECT id FROM messages WHERE "createdAt" < :cutoff LIMIT :batchSize
     )`,
    { cutoff, batchSize },
  );
}

// Deletes messages older than the retention window. Works in batches so a
// large backlog never holds one long lock on the messages table.
export async function deleteExpiredMessages({
  now = new Date(),
  batchSize = DEFAULT_BATCH_SIZE,
  deleteBatch = deleteExpiredBatch,
} = {}) {
  const cutoff = retentionCutoff(now);
  let total = 0;

  for (;;) {
    const deleted = await deleteBatch(cutoff, batchSize);
    total += deleted;
    if (deleted < batchSize) break;
  }

  return total;
}

// Keeps only the newest `keep` messages of a chat, in a single statement.
export function trimChatMessages(
  chatId,
  keep = MAX_MESSAGES_PER_CHAT,
  run = runDelete,
) {
  return run(
    `DELETE FROM messages WHERE id IN (
       SELECT id FROM messages WHERE "chatId" = :chatId
       ORDER BY "createdAt" DESC OFFSET :keep
     )`,
    { chatId, keep },
  );
}

export function startMessageRetention() {
  const sweep = async () => {
    try {
      const deleted = await deleteExpiredMessages();
      if (deleted > 0) {
        console.log(`🧹 Deleted ${deleted} chat messages older than 1 year.`);
      }
    } catch (error) {
      console.error("Error deleting expired chat messages:", error);
    }
  };

  setTimeout(sweep, FIRST_SWEEP_DELAY_MS).unref();
  setInterval(sweep, SWEEP_INTERVAL_MS).unref();
}
