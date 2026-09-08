import sequelize from "../config/database.js";
import Chat from "./Chat.js";
import Message from "./Message.js";
import ChatMember from "./ChatMember.js";
import Friend from "./Friend.js";
import User from "./User.js";
import UserStatus from "./UserStatus.js";
import NameRequest from "./NameRequest.js";

// Define associations
Chat.hasMany(Message, { foreignKey: "chatId", as: "messages" });
Message.belongsTo(Chat, { foreignKey: "chatId", as: "chat" });

Chat.hasMany(ChatMember, { foreignKey: "chatId", as: "members" });
ChatMember.belongsTo(Chat, { foreignKey: "chatId", as: "chat" });

// Initialize database
const initDatabase = async ({ sync = false, alter = false } = {}) => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    if (sync) {
      await sequelize.sync({ alter }); // Use { force: true } only in development to reset tables
      console.log("✅ Database models synchronized successfully.");
    }

    await sequelize.query(
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "nickname" VARCHAR(64)',
    );
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "name_requests" (
        "id" UUID PRIMARY KEY,
        "requesterUuid" VARCHAR(255) NOT NULL,
        "recipientUuid" VARCHAR(255) NOT NULL,
        "chatId" UUID NOT NULL REFERENCES "chats"("id"),
        "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
        "firstName" VARCHAR(64),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS "name_requests_recipient_status"
      ON "name_requests" ("recipientUuid", "status")
    `);
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw error;
  }
};

export {
  sequelize,
  Chat,
  Message,
  ChatMember,
  Friend,
  User,
  UserStatus,
  NameRequest,
  initDatabase,
};
