import { readFileSync } from "node:fs";

// The 1v1.lol remote config this site serves to the game (GET /api/1v1/config)
// and prices everything from: SettingsV6 (skins, coin packs, modes) and the
// battle pass. Generated from the game's own defaults in
// 55gms/assets misc/nowgg/js/firebase-config.js; see docs/1v1-backend.md.
const config = JSON.parse(
  readFileSync(new URL("../utils/1v1-config.json", import.meta.url), "utf8"),
);

export const SEASON = 1;

// Competitive modes whose result the multiplayer server can read
// (55gms/multiplayer docs/1v1-match-events.md). The others stay out of the
// competitive list until it can.
const READABLE_COMPETITIVE = new Set(["1v1_Competitive"]);

export function competitiveModes() {
  return config.SettingsV6.competitive_modes
    .map((rotation) =>
      rotation.filter((mode) => READABLE_COMPETITIVE.has(mode)),
    )
    .filter((rotation) => rotation.length);
}

// The config as the game reads it, with the competitive list narrowed.
export function gameConfig() {
  return {
    ...config,
    SettingsV6: { ...config.SettingsV6, competitive_modes: competitiveModes() },
  };
}

const settings = config.SettingsV6;
const battlePass = config.BattlePass.battle_passes[config.BattlePassId];

// Price of a skin sold in the shop for coins, or null when it isn't one.
// Mystery (rewarded) skins are priced by rvSkinPrice instead.
export function skinPrice(itemId) {
  const skin = settings.skins_data[itemId];
  if (!skin || skin.Currency !== "LC" || settings.rv_skins.includes(itemId)) {
    return null;
  }
  return skin.Prices.LC;
}

export function isRvSkin(itemId) {
  return settings.rv_skins.includes(itemId);
}

export function rvSkinPrice() {
  return settings.rv_settings.PriceLC;
}

export function isSkin(itemId) {
  return Object.hasOwn(settings.skins_data, itemId);
}

// A coin pack by product id: { amount, priceCents }, or null.
export function coinPack(productId) {
  const pack = settings.coins_data[productId];
  if (!pack) return null;
  return { amount: pack.Amount, priceCents: Math.round(pack.Price * 100) };
}

export function coinPackIds() {
  return Object.keys(settings.coins_data);
}

export function battlePassRules() {
  return {
    winXp: battlePass.win_xp,
    loseXp: battlePass.lose_xp,
    tierUpPrice: battlePass.tier_up_price,
  };
}

// [{ xp, free_rewards, premium_rewards }], xp ascending: the XP at which each
// tier is reached.
export function battlePassTiers() {
  return battlePass.tiers;
}

export function battlePassId() {
  return config.BattlePassId;
}
