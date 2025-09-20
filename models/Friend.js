import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Friend = sequelize.define(
  "Friend",
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
    addresseeUuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "blocked"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "friends",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["requesterUuid", "addresseeUuid"],
      },
      {
        fields: ["addresseeUuid"],
      },
    ],
  }
);

export default Friend;
