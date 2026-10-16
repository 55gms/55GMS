// Reads progress again for every current cloud save of a game with a
// progress adapter (utils/saveProgress.js), so saves synced before an
// adapter existed or changed show what it reads on /profile now, instead of
// on their next upload. Safe to re-run. Needs node scripts/add-game-saves.js
// first.
//
//   node scripts/refresh-save-progress.js
import "dotenv/config";
import { sequelize } from "../models/index.js";
import { parseSaveText } from "../services/gameSaves.js";
import { loadSaveText } from "../services/saveBlobs.js";
import { readProgress } from "../utils/saveProgress.js";
import { getGame } from "../utils/saveRegistry.js";

const BATCH = 200;

try {
  let lastId = 0;
  let updated = 0;
  let failed = 0;
  for (;;) {
    const [rows] = await sequelize.query(
      `SELECT id, game_id, data, blob_key FROM game_saves
       WHERE id > :lastId ORDER BY id LIMIT :limit`,
      { replacements: { lastId, limit: BATCH } },
    );
    if (!rows.length) break;
    for (const row of rows) {
      lastId = row.id;
      const game = getGame(row.game_id);
      if (!game?.progress) continue;
      try {
        const text = await loadSaveText({
          data: row.data,
          blobKey: row.blob_key,
        });
        const progress = readProgress(game, parseSaveText(text).save);
        await sequelize.query(
          `UPDATE game_saves SET progress = CAST(:progress AS JSONB) WHERE id = :id`,
          {
            replacements: {
              id: row.id,
              progress: progress ? JSON.stringify(progress) : null,
            },
          },
        );
        updated += 1;
      } catch (error) {
        failed += 1;
        console.error(`save ${row.id} (${row.game_id}): ${error.message}`);
      }
    }
  }
  console.log(`Read progress again for ${updated} saves, ${failed} failed.`);
  await sequelize.close();
} catch (error) {
  console.error("Refreshing save progress failed:", error);
  process.exit(1);
}
