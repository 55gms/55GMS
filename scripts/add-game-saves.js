// Adds the per-game cloud save tables: game_saves (the current save of each
// game, per account and slot) and game_save_versions (earlier and losing
// saves, kept for recovery). Safe to re-run, and safe to run while an older
// build of the server is live, which reads neither. The legacy user_saves
// table is not touched. Run it before deploying a build that reads them.
//
//   node scripts/add-game-saves.js
import "dotenv/config";
import { sequelize } from "../models/index.js";

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS game_saves (
     id BIGSERIAL PRIMARY KEY,
     user_uuid VARCHAR(255) NOT NULL,
     game_id VARCHAR(96) NOT NULL,
     slot VARCHAR(32) NOT NULL DEFAULT 'default',
     revision INTEGER NOT NULL,
     content_hash CHAR(64) NOT NULL,
     format VARCHAR(32) NOT NULL,
     size INTEGER NOT NULL,
     data BYTEA,
     blob_key VARCHAR(255),
     progress JSONB,
     device_id VARCHAR(64),
     origin VARCHAR(16) NOT NULL DEFAULT 'device',
     restore_barrier INTEGER NOT NULL DEFAULT 0,
     client_modified_at TIMESTAMPTZ NOT NULL,
     last_synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS game_saves_user_game_slot
     ON game_saves (user_uuid, game_id, slot)`,
  `CREATE TABLE IF NOT EXISTS game_save_versions (
     id BIGSERIAL PRIMARY KEY,
     user_uuid VARCHAR(255) NOT NULL,
     game_id VARCHAR(96) NOT NULL,
     slot VARCHAR(32) NOT NULL DEFAULT 'default',
     revision INTEGER,
     content_hash CHAR(64) NOT NULL,
     format VARCHAR(32) NOT NULL,
     size INTEGER NOT NULL,
     data BYTEA,
     blob_key VARCHAR(255),
     progress JSONB,
     device_id VARCHAR(64),
     reason VARCHAR(24) NOT NULL,
     client_modified_at TIMESTAMPTZ NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS game_save_versions_user_game
     ON game_save_versions (user_uuid, game_id, slot, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS game_save_versions_created_at
     ON game_save_versions (created_at)`,
  `CREATE INDEX IF NOT EXISTS game_save_versions_blob_key
     ON game_save_versions (blob_key) WHERE blob_key IS NOT NULL`,
];

try {
  for (const statement of STATEMENTS) {
    await sequelize.query(statement);
    console.log(`ok: ${statement.split("\n")[0].trim()}`);
  }
  await sequelize.close();
} catch (error) {
  console.error("Adding the game save schema failed:", error);
  process.exit(1);
}
