// Clears every 1v1.lol competitive rating, so every account is back to
// unranked (0) on the next login. XP, stats, coins, items and the battle pass
// are left alone, and so are decided matches (the repeat-pair limit still
// reads them). Dry run unless --apply.
//
//   node scripts/reset-1v1-ratings.js           # how many would be reset
//   node scripts/reset-1v1-ratings.js --apply   # reset them
import "dotenv/config";
import { sequelize } from "../models/index.js";

const apply = process.argv.includes("--apply");

try {
  const [[{ count }]] = await sequelize.query(
    `SELECT count(*)::int AS count FROM onev1_profiles WHERE ratings <> '{}'::jsonb`,
  );
  if (!apply) {
    console.log(
      `${count} profile(s) have a rating. Run with --apply to reset them.`,
    );
  } else {
    const [, result] = await sequelize.query(
      `UPDATE onev1_profiles SET ratings = '{}'::jsonb, updated_at = now()
        WHERE ratings <> '{}'::jsonb`,
    );
    console.log(`Reset ${result?.rowCount ?? count} profile(s).`);
  }
  await sequelize.close();
} catch (error) {
  console.error("Resetting 1v1.lol ratings failed:", error);
  process.exit(1);
}
