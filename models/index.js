const sequelize = require("../config/database");
const Chat = require("./Chat");
const Message = require("./Message");
const ChatMember = require("./ChatMember");
const Friend = require("./Friend");
const UserStatus = require("./UserStatus");

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

module.exports = {
  sequelize,
  Chat,
  Message,
  ChatMember,
  Friend,
  UserStatus,
  initDatabase,
};
