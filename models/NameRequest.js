import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const NameRequest = sequelize.define(
  "NameRequest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    requesterUuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipientUuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chatId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "chats",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "answered"),
      defaultValue: "pending",
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
  },
  {
    tableName: "name_requests",
    timestamps: true,
    indexes: [
      {
        fields: ["recipientUuid", "status"],
      },
    ],
  },
);

export default NameRequest;