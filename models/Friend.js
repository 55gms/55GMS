const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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

module.exports = Friend;
