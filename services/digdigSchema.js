// The tables behind digdig.io on 55GMS accounts (docs/multiplayer.md). Only
// services/digdig.js reads and writes them, in raw SQL. scripts/add-digdig.js
// adds them to an existing database and setup-db.js to a new one; every
// statement is safe to re-run.
export const DIGDIG_SCHEMA = [
  // Owned skins (utils/digdig-skins.json ids).
  `CREATE TABLE IF NOT EXISTS digdig_items (
     uuid VARCHAR(255) NOT NULL REFERENCES users(uuid) ON DELETE CASCADE,
     item_id VARCHAR(64) NOT NULL,
     acquired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     PRIMARY KEY (uuid, item_id)
   )`,
  // Every gold change, once: source is unique, so a grant the multiplayer
  // server retries, or a purchase, cannot count twice. The balance is the sum
  // of delta. reason: play (gold a life collected), buy.
  `CREATE TABLE IF NOT EXISTS digdig_gold_ledger (
     id BIGSERIAL PRIMARY KEY,
     uuid VARCHAR(255) NOT NULL REFERENCES users(uuid) ON DELETE CASCADE,
     delta INTEGER NOT NULL,
     reason VARCHAR(32) NOT NULL,
     source VARCHAR(255) NOT NULL UNIQUE,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS digdig_gold_ledger_uuid ON digdig_gold_ledger (uuid)`,
];

export async function ensureDigdigSchema(sequelize) {
  for (const statement of DIGDIG_SCHEMA) await sequelize.query(statement);
}
