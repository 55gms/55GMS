import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

// The current cloud save of one game, per account and slot. Read and written
// only by services/gameSaves.js, with raw SQL under a row lock; this model
// is the schema node setup-db.js creates (scripts/add-game-saves.js adds the
// same tables to an existing database).
const GameSave = sequelize.define(
  "GameSave",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    userUuid: { type: DataTypes.STRING, allowNull: false, field: "user_uuid" },
    gameId: { type: DataTypes.STRING(96), allowNull: false, field: "game_id" },
    slot: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "default",
    },
    // Grows by one with every accepted change; devices send the revision
    // their copy is based on.
    revision: { type: DataTypes.INTEGER, allowNull: false },
    // SHA-256 of the save text, as the browser computed and the server checked.
    contentHash: {
      type: DataTypes.CHAR(64),
      allowNull: false,
      field: "content_hash",
    },
    format: { type: DataTypes.STRING(32), allowNull: false },
    // Bytes of the save text before compression.
    size: { type: DataTypes.INTEGER, allowNull: false },
    // The save text, gzipped. Null when it is in object storage instead.
    data: { type: DataTypes.BLOB, allowNull: true },
    blobKey: { type: DataTypes.STRING, allowNull: true, field: "blob_key" },
    // What utils/saveProgress.js read from the save; null for games without
    // an adapter.
    progress: { type: DataTypes.JSONB, allowNull: true },
    deviceId: {
      type: DataTypes.STRING(64),
      allowNull: true,
      field: "device_id",
    },
    // "device", "legacy" (split from a full-browser backup) or "restore".
    origin: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: "device",
    },
    // Set to the revision a version was restored at: uploads based on an
    // earlier revision are kept in history instead of replacing it.
    restoreBarrier: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "restore_barrier",
    },
    clientModifiedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "client_modified_at",
    },
    lastSyncedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "last_synced_at",
    },
  },
  {
    tableName: "game_saves",
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ["user_uuid", "game_id", "slot"] }],
  },
);

export default GameSave;
