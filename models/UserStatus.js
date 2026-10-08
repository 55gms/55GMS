import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserStatus = sequelize.define(
  "UserStatus",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userUuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastSeen: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    socketId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "user_status",
    timestamps: true,
    indexes: [
      // Named, so sync({ alter: true }) reuses it. A column-level
      // `unique: true` adds another unnamed constraint on every alter.
      {
        name: "user_status_userUuid_key",
        unique: true,
        fields: ["userUuid"],
      },
      {
        fields: ["isOnline"],
      },
    ],
  }
);

export default UserStatus;
