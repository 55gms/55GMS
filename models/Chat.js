import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Chat = sequelize.define(
  "Chat",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true, // null for direct messages
    },
    type: {
      type: DataTypes.ENUM("direct", "group"),
      allowNull: false,
      defaultValue: "direct",
    },
    createdBy: {
      type: DataTypes.STRING, // UUID of creator
      allowNull: false,
    },
    lastActivity: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "chats",
    timestamps: true,
  }
);

export default Chat;
