// Adds the avatar column to an existing users table. Safe to re-run, and
// safe to run while an older build of the server is live: the column is
// nullable and that build never reads it. Run it before deploying a build
// that does, which selects the column on every account lookup.
//
//   node scripts/add-avatar-column.js
import "dotenv/config";
import { sequelize } from "../models/index.js";

const STATEMENTS = [
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(16)`,
];

try {
  for (const statement of STATEMENTS) {
    await sequelize.query(statement);
    console.log(`ok: ${statement}`);
  }
  await sequelize.close();
} catch (error) {
  console.error("Adding the avatar column failed:", error);
  process.exit(1);
}
