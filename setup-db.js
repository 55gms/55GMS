import { initDatabase } from "./models/index.js";

async function setupDatabase() {
  try {
    console.log("🔄 Setting up database...");
    await initDatabase({ sync: true, alter: true });
    console.log("✅ Database setup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
}

setupDatabase();
