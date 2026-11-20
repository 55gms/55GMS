// Adds the digdig.io tables (services/digdigSchema.js): owned skins, the gold
// ledger, achievements and lifetime stats. Safe to re-run, and safe to run while an older build of the
// server is live, which reads neither. Run it before deploying a build that
// does.
//
//   node scripts/add-digdig.js
import "dotenv/config";
import { sequelize } from "../models/index.js";
import { DIGDIG_SCHEMA } from "../services/digdigSchema.js";

try {
  for (const statement of DIGDIG_SCHEMA) {
    await sequelize.query(statement);
    console.log(`ok: ${statement.split("\n")[0].trim()}`);
  }
  await sequelize.close();
} catch (error) {
  console.error("Adding the digdig.io schema failed:", error);
  process.exit(1);
}
