import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Message = sequelize.define(
  "Message",
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
    senderUuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    editedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isSystem: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "messages",
    timestamps: true,
    indexes: [
      {
        fields: ["chatId", "createdAt"],
      },
      {
        fields: ["senderUuid"],
      },
    ],
  }
);

export default Message;
