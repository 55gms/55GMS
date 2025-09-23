import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ChatMember = sequelize.define(
  "ChatMember",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    chatId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "chats",
        key: "id",
      },
    },
    userUuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "member"),
      defaultValue: "member",
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    lastReadAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "chat_members",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["chatId", "userUuid"],
      },
      {
        fields: ["userUuid"],
      },
    ],
  }
);

export default ChatMember;
