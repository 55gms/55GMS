import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 32],
      },
    },
    nickname: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    indexes: [
      {
        fields: ["username"],
        unique: true,
      },
      {
        fields: ["premium"],
      },
    ],
  },
);

export default User;
