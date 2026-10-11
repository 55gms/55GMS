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
    // Premium given by hand from /admin. premium above is the effective
    // flag: this grant, or a live subscription (services/billing.js).
    premiumGranted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "premium_granted",
    },
    // The username before the handle migration, exactly as it was stored.
    // Null on accounts created since. Old names still sign in through it.
    legacyUsername: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "legacy_username",
    },
    // True while the account still has to choose a handle; it holds a
    // generated placeholder meanwhile.
    handlePending: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "handle_pending",
    },
    // A preset id from utils/avatars.js. Null shows the account's default.
    avatar: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    lastSeenAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_seen_at",
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
