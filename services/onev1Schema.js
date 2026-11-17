// The tables behind 1v1.lol on 55GMS accounts (docs/1v1-backend.md). Only
// services/onev1.js and services/onev1Coins.js read and write them, in raw
// SQL. scripts/add-1v1.js adds them to an existing database and setup-db.js
// to a new one; every statement is safe to re-run.
export const ONEV1_SCHEMA = [
  // One row per account that has signed in to the game. ratings is
  // { <mode>: { rating, games } }; stats is ServerUserStats as the game reads it.
  `CREATE TABLE IF NOT EXISTS onev1_profiles (
     uuid VARCHAR(255) PRIMARY KEY REFERENCES users(uuid) ON DELETE CASCADE,
     xp INTEGER NOT NULL DEFAULT 0,
     stats JSONB NOT NULL DEFAULT '{}',
     ratings JSONB NOT NULL DEFAULT '{}',
     equipped JSONB NOT NULL DEFAULT '{}',
     settings JSONB NOT NULL DEFAULT '{}',
     rv_skin_at TIMESTAMPTZ,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  // Owned cosmetics. source: shop, rv, bp, admin.
  `CREATE TABLE IF NOT EXISTS onev1_items (
     uuid VARCHAR(255) NOT NULL REFERENCES users(uuid) ON DELETE CASCADE,
     item_id VARCHAR(128) NOT NULL,
     source VARCHAR(32) NOT NULL,
     acquired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     PRIMARY KEY (uuid, item_id)
   )`,
  // Battle pass progress per season. claimed_* are reward ids already taken.
  `CREATE TABLE IF NOT EXISTS onev1_battle_pass (
     uuid VARCHAR(255) NOT NULL REFERENCES users(uuid) ON DELETE CASCADE,
     season INTEGER NOT NULL,
     xp INTEGER NOT NULL DEFAULT 0,
     tiers_bought INTEGER NOT NULL DEFAULT 0,
     claimed_free JSONB NOT NULL DEFAULT '[]',
     claimed_premium JSONB NOT NULL DEFAULT '[]',
     PRIMARY KEY (uuid, season)
   )`,
  // Every coin change, once: source is unique, so a retried webhook, claim or
  // purchase cannot count twice. The balance is the sum of delta.
  `CREATE TABLE IF NOT EXISTS onev1_coin_ledger (
     id BIGSERIAL PRIMARY KEY,
     uuid VARCHAR(255) NOT NULL REFERENCES users(uuid) ON DELETE CASCADE,
     delta INTEGER NOT NULL,
     reason VARCHAR(32) NOT NULL,
     source VARCHAR(255) NOT NULL UNIQUE,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS onev1_coin_ledger_uuid ON onev1_coin_ledger (uuid)`,
  // Results the multiplayer server decided, once per match. players is
  // [{ uuid, team, outcome, kills, deaths }].
  `CREATE TABLE IF NOT EXISTS onev1_matches (
     match_id VARCHAR(128) PRIMARY KEY,
     mode VARCHAR(64) NOT NULL,
     rated BOOLEAN NOT NULL,
     players JSONB NOT NULL,
     rating_changes JSONB NOT NULL DEFAULT '{}',
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS onev1_matches_created_at ON onev1_matches (created_at)`,
];

export async function ensureOneV1Schema(sequelize) {
  for (const statement of ONEV1_SCHEMA) await sequelize.query(statement);
}
