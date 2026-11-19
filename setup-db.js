import { initDatabase, sequelize } from "./models/index.js";
import { ensureOneV1Schema } from "./services/onev1Schema.js";
import { ensureDigdigSchema } from "./services/digdigSchema.js";

async function setupDatabase() {
  try {
    console.log("🔄 Setting up database...");
    await initDatabase({
      sync: true,
      alter: process.env.DB_SYNC_ALTER === "true",
    });
    // Tables without a model, created in raw SQL.
    await ensureOneV1Schema(sequelize);
    await ensureDigdigSchema(sequelize);
    console.log("✅ Database setup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
}

setupDatabase();
