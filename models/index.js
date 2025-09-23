import sequelize from "../config/database.js";
import Chat from "./Chat.js";
import Message from "./Message.js";
import ChatMember from "./ChatMember.js";
import Friend from "./Friend.js";
import UserStatus from "./UserStatus.js";

// Define associations
Chat.hasMany(Message, { foreignKey: "chatId", as: "messages" });
Message.belongsTo(Chat, { foreignKey: "chatId", as: "chat" });

Chat.hasMany(ChatMember, { foreignKey: "chatId", as: "members" });
ChatMember.belongsTo(Chat, { foreignKey: "chatId", as: "chat" });

// Initialize database
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Sync all models
    await sequelize.sync({ alter: true }); // Use { force: true } only in development to reset tables
    console.log("✅ Database models synchronized successfully.");
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
  UserStatus,
  initDatabase,
};
