import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

// Saves that were replaced, lost a conflict, or arrived stale: kept so they
// can be restored, until the retention limits in services/gameSaves.js
// remove them. Same columns as game_saves, plus why it was kept.
const GameSaveVersion = sequelize.define(
  "GameSaveVersion",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    userUuid: { type: DataTypes.STRING, allowNull: false, field: "user_uuid" },
    gameId: { type: DataTypes.STRING(96), allowNull: false, field: "game_id" },
    slot: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "default",
    },
    // The revision it had as the current save; null for an upload that never was.
    revision: { type: DataTypes.INTEGER, allowNull: true },
    contentHash: {
      type: DataTypes.CHAR(64),
      allowNull: false,
      field: "content_hash",
    },
    format: { type: DataTypes.STRING(32), allowNull: false },
    size: { type: DataTypes.INTEGER, allowNull: false },
    data: { type: DataTypes.BLOB, allowNull: true },
    blobKey: { type: DataTypes.STRING, allowNull: true, field: "blob_key" },
    progress: { type: DataTypes.JSONB, allowNull: true },
    deviceId: {
      type: DataTypes.STRING(64),
      allowNull: true,
      field: "device_id",
    },
    // superseded, conflict, stale, restored-over, deleted
    reason: { type: DataTypes.STRING(24), allowNull: false },
    clientModifiedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "client_modified_at",
    },
  },
  {
    tableName: "game_save_versions",
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [
      { fields: ["user_uuid", "game_id", "slot", "created_at"] },
      { fields: ["created_at"] },
    ],
  },
);

export default GameSaveVersion;
