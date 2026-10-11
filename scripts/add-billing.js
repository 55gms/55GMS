// Adds what premium billing stores: users.premium_granted (the admin grant)
// and the subscriptions table. Safe to re-run, and safe to run while an older
// build of the server is live, which reads neither. Run it before deploying a
// build that does.
//
// Everyone premium before billing existed got it by hand, so the grant is
// copied from users.premium, but only when the column is first added: on a
// re-run, premium may come from a paid subscription instead.
//
//   node scripts/add-billing.js
import "dotenv/config";
import { sequelize } from "../models/index.js";

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS subscriptions (
     uuid VARCHAR(255) PRIMARY KEY,
     stripe_customer_id VARCHAR(255) NOT NULL,
     stripe_subscription_id VARCHAR(255),
     status VARCHAR(32),
     plan VARCHAR(16),
     current_period_end TIMESTAMPTZ,
     cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_stripe_customer_id
     ON subscriptions (stripe_customer_id)`,
];

try {
  const [columns] = await sequelize.query(
    `SELECT 1 FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = 'users' AND column_name = 'premium_granted'`,
  );

  if (columns.length) {
    console.log("ok: users.premium_granted already exists, grants left alone");
  } else {
    await sequelize.transaction(async (transaction) => {
      await sequelize.query(
        `ALTER TABLE users
           ADD COLUMN premium_granted BOOLEAN NOT NULL DEFAULT false`,
        { transaction },
      );
      const [, result] = await sequelize.query(
        `UPDATE users SET premium_granted = true WHERE premium`,
        { transaction },
      );
      console.log(
        `ok: added users.premium_granted, ${result.rowCount} grants copied`,
      );
    });
  }

  for (const statement of STATEMENTS) {
    await sequelize.query(statement);
    console.log(`ok: ${statement.split("\n")[0].trim()}`);
  }
  await sequelize.close();
} catch (error) {
  console.error("Adding the billing schema failed:", error);
  process.exit(1);
}
