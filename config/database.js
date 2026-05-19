import { Sequelize } from "sequelize";
import "dotenv/config";

// Check if running in CodeSandbox or without database
const isCodeSandbox = process.env.CODESANDBOX_HOST || process.env.SANDBOX_URL;
const isTestEnv = process.env.NODE_ENV === 'test';
const dbUrl = process.env.POSTGRES_URL;

let sequelize;

if (isCodeSandbox || isTestEnv || !dbUrl) {
  console.log('⚠️ Running in CodeSandbox or test mode - using SQLite in-memory database');
  sequelize = new Sequelize('sqlite::memory:', {
    dialect: 'sqlite',
    logging: false,
  });
} else {
  sequelize = new Sequelize(dbUrl, {
    dialect: "postgres",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

export default sequelize;
