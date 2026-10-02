import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "User",
  {
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // bcrypt(sha256hex(password)), see utils/passwordHash.js
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    premium: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["username"],
      },
    ],
  },
);

export default User;
