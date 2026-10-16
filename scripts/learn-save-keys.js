// Records the storage names in every current cloud save into
// game_save_keys, as uploads do from now on (services/learnedSaveKeys.js),
// so saves synced before that teach browsers too. Safe to re-run. Needs
// node scripts/add-game-saves.js first.
//
//   node scripts/learn-save-keys.js
import "dotenv/config";
import { sequelize } from "../models/index.js";
import { parseSaveText } from "../services/gameSaves.js";
import { learnFrom } from "../services/learnedSaveKeys.js";
import { loadSaveText } from "../services/saveBlobs.js";

const BATCH = 200;

try {
  let lastId = 0;
  let learned = 0;
  let failed = 0;
  for (;;) {
    const [rows] = await sequelize.query(
      `SELECT id, user_uuid, game_id, data, blob_key FROM game_saves
       WHERE id > :lastId ORDER BY id LIMIT :limit`,
      { replacements: { lastId, limit: BATCH } },
    );
    if (!rows.length) break;
    for (const row of rows) {
      lastId = row.id;
      try {
        const text = await loadSaveText({
          data: row.data,
          blobKey: row.blob_key,
        });
        await learnFrom(row.user_uuid, row.game_id, parseSaveText(text).save);
        learned += 1;
      } catch (error) {
        failed += 1;
        console.error(`save ${row.id} (${row.game_id}): ${error.message}`);
      }
    }
  }
  console.log(`Learned from ${learned} saves, ${failed} failed.`);
  await sequelize.close();
} catch (error) {
  console.error("Learning save keys failed:", error);
  process.exit(1);
}
