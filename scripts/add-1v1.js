// Adds the 1v1.lol tables (services/onev1Schema.js): game profiles, owned
// items, battle pass progress, the coin ledger and decided matches. Safe to
// re-run, and safe to run while an older build of the server is live, which
// reads none of them. Run it before deploying a build that does.
//
//   node scripts/add-1v1.js
import "dotenv/config";
import { sequelize } from "../models/index.js";
import { ONEV1_SCHEMA } from "../services/onev1Schema.js";

try {
  for (const statement of ONEV1_SCHEMA) {
    await sequelize.query(statement);
    console.log(`ok: ${statement.split("\n")[0].trim()}`);
  }
  await sequelize.close();
} catch (error) {
  console.error("Adding the 1v1.lol schema failed:", error);
  process.exit(1);
}
