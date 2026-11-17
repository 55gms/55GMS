import { sequelize } from "../models/index.js";

// 1v1.lol accounts on 55GMS (docs/1v1-backend.md): profiles, cosmetics,
// the battle pass, leaderboards and match results. Mounted by
// routes/onev1.js, which authenticates every call with the game token.

// Ratings by mode for the multiplayer server's matchmaking:
// { <mode>: rating }.
export async function ratingsOf(uuid) {
  const [rows] = await sequelize.query(
    `SELECT ratings FROM onev1_profiles WHERE uuid = :uuid`,
    { replacements: { uuid } },
  );
  const out = {};
  for (const [mode, value] of Object.entries(rows[0]?.ratings || {})) {
    out[mode] = value.rating;
  }
  return out;
}

export function mount() {}

export async function applyMatch() {
  const error = new Error("Not ready");
  error.status = 503;
  throw error;
}
