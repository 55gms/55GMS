// Adds the handle columns to an existing users table. Safe to re-run, and
// safe to run while an older build of the server is live: every column is
// nullable or has a default, and that build never reads them.
//
//   node scripts/add-handle-columns.js
import "dotenv/config";
import { sequelize } from "../models/index.js";

const STATEMENTS = [
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS legacy_username VARCHAR(255)`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS handle_pending BOOLEAN NOT NULL DEFAULT false`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ`,
  `CREATE INDEX IF NOT EXISTS users_legacy_username ON users (legacy_username)`,
  `CREATE INDEX IF NOT EXISTS users_legacy_username_lower ON users (lower(legacy_username))`,
];

try {
  for (const statement of STATEMENTS) {
    await sequelize.query(statement);
    console.log(`ok: ${statement}`);
  }
  await sequelize.close();
} catch (error) {
  console.error("Adding the handle columns failed:", error);
  process.exit(1);
}
