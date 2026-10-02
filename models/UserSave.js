import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserSave = sequelize.define(
  "UserSave",
  {
    // No foreign key to users: saves were always accepted for any uuid.
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    // The save as a JSON string, stored and returned without parsing.
    saveData: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "user_saves",
    timestamps: true,
    createdAt: false,
  },
);

export default UserSave;
