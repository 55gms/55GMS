// Splits the legacy full-browser cloud backups (user_saves) into per-game
// saves, for the games whose save keys are known (the `keys` of their entry
// in static/assets/json/saves.json). Only creates a game's save where the
// account has none, so it never replaces newer progress and can be re-run.
// user_saves itself is never changed.
//
//   node scripts/migrate-legacy-saves.js            # dry run: counts only
//   node scripts/migrate-legacy-saves.js --apply    # create the saves
//   node scripts/migrate-legacy-saves.js --rollback # remove the ones it made
//
// --rollback deletes per-game saves made from a legacy backup that no device
// has changed since (origin 'legacy', revision 1), whether this script or a
// device's first launch of the game made them. The legacy backups are still
// there, so --apply can make them again. See docs/cloud-saves.md.
import "dotenv/config";
import { readFileSync } from "node:fs";
import { sequelize } from "../models/index.js";
import { importLegacy, legacySaveFor } from "../services/gameSaves.js";

const apply = process.argv.includes("--apply");
const rollback = process.argv.includes("--rollback");

const registry = JSON.parse(
  readFileSync(
    new URL("../static/assets/json/saves.json", import.meta.url),
    "utf8",
  ),
);
const games = Object.values(registry.games).filter(
  (game) => game.keys?.length && game.status !== "local-only",
);

try {
  if (rollback) {
    const [rows] = await sequelize.query(
      `DELETE FROM game_saves WHERE origin = 'legacy' AND revision = 1 RETURNING id`,
    );
    console.log(
      `ok: removed ${rows.length} per-game saves made from legacy backups`,
    );
  } else {
    const counts = { accounts: 0, created: 0, existing: 0, empty: 0 };
    let lastUuid = "";
    for (;;) {
      const [rows] = await sequelize.query(
        `SELECT uuid, "saveData" FROM user_saves WHERE uuid > :lastUuid
          ORDER BY uuid LIMIT 200`,
        { replacements: { lastUuid } },
      );
      if (!rows.length) break;
      for (const row of rows) {
        lastUuid = row.uuid;
        counts.accounts += 1;
        let snapshot;
        try {
          snapshot = JSON.parse(row.saveData);
        } catch {
          continue;
        }
        if (!snapshot || typeof snapshot !== "object") continue;
        for (const game of games) {
          if (!legacySaveFor(snapshot, game.keys)) {
            counts.empty += 1;
            continue;
          }
          if (!apply) {
            counts.created += 1;
            continue;
          }
          const outcome = await importLegacy({
            uuid: row.uuid,
            gameId: game.id,
          });
          if (outcome.result === "imported") counts.created += 1;
          else counts.existing += 1;
        }
      }
    }
    console.log(
      `${apply ? "ok" : "dry run"}: ${counts.accounts} legacy backups read, ` +
        `${counts.created} game saves ${apply ? "created" : "would be created"}, ` +
        `${counts.existing} already had one`,
    );
    if (!apply) console.log("Run again with --apply to create them.");
  }
  await sequelize.close();
} catch (error) {
  console.error("Migrating legacy saves failed:", error);
  process.exit(1);
}
