// Ragdoll Fight — rewarded ads through the Pizza Edition SDK (window.PokiSDK, loaded from
// poki-sdk.js in index.html) + the "try a weapon for 5 levels" offer.
//
//   setHooks({ pause(), resume() })   main pauses the game / mutes sound while an ad plays
//   showRewarded() -> Promise<bool>    true = give the reward. Without the SDK (blocked, offline dev) it resolves true
//   isBusy() -> bool                   an ad is playing (ignore more ad clicks)
//   offerFor(level, saveState) -> weaponId | null   the yellow ad weapon for this level (every other level)
//   gameplayStart() / gameplayStop() / loadingFinished()   SDK lifecycle pings (no-ops without the SDK)

import { WEAPONS } from './catalog.js';

export const RENT_LEVELS = 5;   // an ad weapon lasts this many levels
const OFFER_POOL = 6;           // offers come from the most expensive weapons the player doesn't have

let busy = false;
let hooks = { pause() {}, resume() {} };

const sdk = () => (typeof window !== 'undefined' && window.PokiSDK) || null;

export function setHooks(h = {}) { hooks = { ...hooks, ...h }; }
export const isBusy = () => busy;

export async function showRewarded() {
  if (busy) return false;
  busy = true;
  try { hooks.pause(); } catch (e) { /* ignore */ }
  try {
    const s = sdk();
    if (!s || typeof s.rewardedBreak !== 'function') return true;
    return (await s.rewardedBreak()) !== false;
  } catch (e) {
    console.warn('[ads] rewarded ad failed', e);
    return false;
  } finally {
    busy = false;
    try { hooks.resume(); } catch (e) { /* ignore */ }
  }
}

const ping = (name) => {
  if (busy) return;   // the stub's gameplayStart clears the ad overlay
  try { const s = sdk(); if (s && typeof s[name] === 'function') s[name](); } catch (e) { /* ignore */ }
};
export const gameplayStart = () => ping('gameplayStart');
export const gameplayStop = () => ping('gameplayStop');
export const loadingFinished = () => ping('gameLoadingFinished');

export function offerFor(level, s) {
  if (!s || level < 2 || level % 2) return null;   // every other level
  const pool = WEAPONS
    .filter((w) => w.price > 0 && !s.ownedWeapons.includes(w.id) && !((s.rentals || {})[w.id] > level))
    .sort((a, b) => b.price - a.price)
    .slice(0, OFFER_POOL);
  if (!pool.length) return null;
  // walk through the pool as the levels go by, with a little shuffle so it isn't strictly in price order
  const k = (level / 2 + ((Math.imul(level, 2654435761) >>> 0) % 3)) % pool.length;
  return pool[k].id;
}
