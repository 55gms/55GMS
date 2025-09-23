import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: "postgres",
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
