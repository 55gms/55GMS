// Ragdoll Fight — persistent save (localStorage key rf_save_v1).
// Every storage access is wrapped in try/catch; missing / corrupt data falls back to defaults.
//
// API:
//   load() -> state            save() -> bool          get() -> state (live object, treat as read-only)
//   addDough(n)                spend(n) -> bool
//   own(type, id)              owns(type, id) -> bool   equip(type, id) -> bool
//   setLevel(n)                setSetting(k, v)         setPvpWeapon('p1'|'p2', id)
//   addStat(key, n = 1)        reset()
//   rent(id, untilLevel)       rentLeft(id, level)      pruneRentals(level)
//   weapon upgrades (1P only; fists, rentals and 2P always count as level 1):
//     UPGRADE_MAX = 5   UPGRADE_STEP = 0.12 (+12% damage per level; knockback follows damage)
//     upgradeLevel(id) -> 1..5   upgradeMult(id) -> damage x   upgradeCost(id) -> coins (0 = maxed / not upgradable)
//     upgrade(id) -> new level | false (pays the cost)
//   daily login reward (local calendar dates, 7-day run, a missed day starts over, clock going backwards never pays twice):
//     dateKey(date?) -> 'YYYY-MM-DD'   dailyStatus(now?) -> {claimable, day, streak, claimedToday, today}
//     claimDaily(now?) -> claimed day 1..7 | 0     markDailySeen(now?) -> true the first time it's called on a local day
//   on('change', fn) -> unsubscribe   off(event, fn)
// type: 'weapon' | 'skin' (plural forms accepted).

import { weaponById } from './catalog.js';

const KEY = 'rf_save_v1';

export const UPGRADE_MAX = 5;
export const UPGRADE_STEP = 0.12;
const UPGRADE_COST = [0.25, 0.4, 0.6, 0.85];   // x weapon price for level 1->2, 2->3, 3->4, 4->5 (2.1x price in total)
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const makeDefaults = () => ({
  level: 1,
  dough: 0,
  ownedWeapons: ['fists'],
  equippedWeapon: 'fists',
  ownedSkins: ['classic'],
  equippedSkin: 'classic',
  settings: { sound: true, shake: true, gore: true, decals: true, splatColor: 'sauce' },
  pvp: { p1Weapon: 'fists', p2Weapon: 'fists' },
  rentals: {},          // weaponId -> level it expires at (watched an ad: usable for 5 levels)
  rentReturn: 'fists',  // owned weapon to re-equip when an equipped rental runs out
  upgrades: {},         // weaponId -> upgrade level 2..5 (missing = 1); owned weapons only
  daily: { streak: 0, last: '', seen: '' },   // days claimed in the current run, local date of the last claim / last auto-popup
  stats: {},
});

let state = null;
const listeners = new Map();

function isPlainObject(o) {
  return o !== null && typeof o === 'object' && !Array.isArray(o);
}

// Keep the defaults' shape; take stored values only when the type matches.
function merge(def, src) {
  if (!isPlainObject(src)) return def;
  const out = { ...def };
  for (const k of Object.keys(src)) {
    const d = def[k];
    const v = src[k];
    if (!(k in def)) { out[k] = v; continue; }
    if (isPlainObject(d)) out[k] = merge(d, v);
    else if (Array.isArray(d)) out[k] = Array.isArray(v) ? v.filter((x) => typeof x === 'string') : d;
    else if (typeof d === typeof v) out[k] = v;
  }
  return out;
}

function sanitize(s) {
  s.level = Math.max(1, Math.floor(Number(s.level) || 1));
  s.dough = Math.max(0, Math.floor(Number.isFinite(s.dough) ? s.dough : 0));
  if (!s.ownedWeapons.includes('fists')) s.ownedWeapons.unshift('fists');
  if (!s.ownedSkins.includes('classic')) s.ownedSkins.unshift('classic');
  s.ownedWeapons = [...new Set(s.ownedWeapons)];
  s.ownedSkins = [...new Set(s.ownedSkins)];
  if (!isPlainObject(s.rentals)) s.rentals = {};
  for (const [id, until] of Object.entries(s.rentals)) {
    if (!Number.isFinite(until) || s.ownedWeapons.includes(id)) delete s.rentals[id];
  }
  if (!s.ownedWeapons.includes(s.equippedWeapon) && !Object.hasOwn(s.rentals, s.equippedWeapon)) {
    s.equippedWeapon = s.ownedWeapons.includes(s.rentReturn) ? s.rentReturn : 'fists';
  }
  if (!s.ownedSkins.includes(s.equippedSkin)) s.equippedSkin = 'classic';
  // 2-player mode: every weapon is unlocked, so pvp picks don't need to be owned
  if (typeof s.pvp.p1Weapon !== 'string' || !s.pvp.p1Weapon) s.pvp.p1Weapon = 'fists';
  if (typeof s.pvp.p2Weapon !== 'string' || !s.pvp.p2Weapon) s.pvp.p2Weapon = 'fists';
  if (!isPlainObject(s.upgrades)) s.upgrades = {};
  for (const [id, lv] of Object.entries(s.upgrades)) {
    const n = Math.floor(Number(lv));
    if (id === 'fists' || !s.ownedWeapons.includes(id) || !(n >= 2)) delete s.upgrades[id];
    else s.upgrades[id] = Math.min(UPGRADE_MAX, n);
  }
  const d = s.daily;
  d.streak = Math.max(0, Math.min(7, Math.floor(Number(d.streak) || 0)));
  if (!DATE_RE.test(d.last)) { d.last = ''; d.streak = 0; }
  if (!DATE_RE.test(d.seen)) d.seen = '';
  return s;
}

function emit(event, payload) {
  const set = listeners.get(event);
  if (!set) return;
  for (const fn of [...set]) {
    try { fn(payload, state); } catch (e) { console.error('[save] listener error', e); }
  }
}

function changed(key) {
  save();
  emit('change', { key, state });
}

function listKey(type) {
  const t = String(type || '').toLowerCase();
  if (t.startsWith('weapon')) return ['ownedWeapons', 'equippedWeapon'];
  if (t.startsWith('skin')) return ['ownedSkins', 'equippedSkin'];
  return null;
}

export function load() {
  let raw = null;
  try { raw = localStorage.getItem(KEY); } catch (e) { /* storage blocked */ }
  let parsed = null;
  if (raw) {
    try { parsed = JSON.parse(raw); } catch (e) { parsed = null; }
  }
  state = sanitize(merge(makeDefaults(), parsed));
  return state;
}

export function save() {
  if (!state) load();
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    return false;
  }
}

export function get() {
  if (!state) load();
  return state;
}

export function addDough(n) {
  const s = get();
  const v = Math.floor(Number(n) || 0);
  if (!v) return s.dough;
  s.dough = Math.max(0, s.dough + v);
  changed('dough');
  return s.dough;
}

export function spend(n) {
  const s = get();
  const v = Math.max(0, Math.floor(Number(n) || 0));
  if (s.dough < v) return false;
  s.dough -= v;
  changed('dough');
  return true;
}

export function owns(type, id) {
  const k = listKey(type);
  return !!k && get()[k[0]].includes(id);
}

export function own(type, id) {
  const k = listKey(type);
  if (!k || !id) return false;
  const s = get();
  if (!s[k[0]].includes(id)) {
    s[k[0]].push(id);
    changed(k[0]);
  }
  return true;
}

export function equip(type, id) {
  const k = listKey(type);
  if (!k) return false;
  const s = get();
  const rented = k[0] === 'ownedWeapons' && Object.hasOwn(s.rentals, id);
  if (!s[k[0]].includes(id) && !rented) return false;
  if (s[k[1]] !== id) {
    s[k[1]] = id;
    changed(k[1]);
  }
  return true;
}

/** Watched an ad for a weapon: usable while playing levels below `untilLevel`. */
export function rent(id, untilLevel) {
  const s = get();
  if (!id || s.ownedWeapons.includes(id)) return false;
  if (s.ownedWeapons.includes(s.equippedWeapon)) s.rentReturn = s.equippedWeapon;
  s.rentals[id] = Math.max(s.rentals[id] || 0, Math.floor(Number(untilLevel) || 0));
  changed('rentals');
  return true;
}

/** Levels of play left on a rented weapon when playing `level` (0 = not rented / expired). */
export function rentLeft(id, level) {
  const until = get().rentals[id] || 0;
  return Math.max(0, until - level);
}

/** Drop rentals that have run out by `level`; an expired equipped weapon goes back to the last owned one. */
export function pruneRentals(level) {
  const s = get();
  let dirty = false;
  for (const [id, until] of Object.entries(s.rentals)) {
    if (until <= level || s.ownedWeapons.includes(id)) { delete s.rentals[id]; dirty = true; }
  }
  if (!s.ownedWeapons.includes(s.equippedWeapon) && !Object.hasOwn(s.rentals, s.equippedWeapon)) {
    s.equippedWeapon = s.ownedWeapons.includes(s.rentReturn) ? s.rentReturn : 'fists';
    dirty = true;
  }
  if (dirty) changed('rentals');
}

// ------------------------------------------------------------------ weapon upgrades

/** Upgrade level of an owned weapon (1..5). Fists, rented and unowned weapons are always 1. */
export function upgradeLevel(id) {
  const s = get();
  if (!id || id === 'fists' || !s.ownedWeapons.includes(id)) return 1;
  return Math.max(1, Math.min(UPGRADE_MAX, Math.floor(Number(s.upgrades[id]) || 1)));
}

/** Damage multiplier for the weapon's upgrade level: 1.00, 1.12, 1.24, 1.36, 1.48. */
export function upgradeMult(id) {
  return 1 + UPGRADE_STEP * (upgradeLevel(id) - 1);
}

/** Coins for the next upgrade level (0 = maxed or not upgradable). Scales with the weapon's price and the level. */
export function upgradeCost(id) {
  if (!id || id === 'fists' || !get().ownedWeapons.includes(id)) return 0;
  const lv = upgradeLevel(id);
  if (lv >= UPGRADE_MAX) return 0;
  const price = weaponById(id).price || 0;
  return Math.max(50, Math.round((price * UPGRADE_COST[lv - 1]) / 10) * 10);
}

export function upgrade(id) {
  const cost = upgradeCost(id);
  if (!cost) return false;
  const s = get();
  if (s.dough < cost) return false;
  const next = upgradeLevel(id) + 1;
  s.dough -= cost;
  s.upgrades[id] = next;
  changed('upgrades');
  return next;
}

// ------------------------------------------------------------------ daily login reward

/** Local calendar date as 'YYYY-MM-DD'. */
export function dateKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
// whole days since the epoch for a date key (UTC maths, so DST never makes a day 23 or 25 hours)
const dayNo = (key) => { const [y, m, d] = key.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 86400000); };

/**
 * { claimable, day, streak, claimedToday, today }
 * day = the day (1..7) to claim now, or the day already claimed today. streak = days claimed in the run before today.
 */
export function dailyStatus(now = new Date()) {
  const d = get().daily;
  const today = dateKey(now);
  // clock went backwards past the last claim: keep the streak, never pay twice — the next claim is on the next local day
  if (d.last && dayNo(today) < dayNo(d.last)) { d.last = today; changed('daily'); }
  const gap = d.last ? dayNo(today) - dayNo(d.last) : Infinity;
  const claimedToday = gap === 0;
  const streak = gap <= 1 ? d.streak : 0;   // a missed day starts the run over at day 1
  const day = claimedToday ? Math.max(1, d.streak) : (streak % 7) + 1;
  return { claimable: !claimedToday, day, streak: claimedToday ? d.streak : streak % 7, claimedToday, today };
}

/** Claim today's reward: returns the claimed day (1..7), or 0 if it was already claimed today. */
export function claimDaily(now = new Date()) {
  const st = dailyStatus(now);
  if (!st.claimable) return 0;
  const d = get().daily;
  d.streak = st.day;
  d.last = st.today;
  changed('daily');
  return st.day;
}

/** True the first time it's called on a local day (the menu auto-opens the calendar once per day). */
export function markDailySeen(now = new Date()) {
  const d = get().daily;
  const today = dateKey(now);
  if (d.seen === today) return false;
  d.seen = today;
  changed('daily');
  return true;
}

export function setPvpWeapon(player, id) {
  const s = get();
  const key = player === 'p2' ? 'p2Weapon' : 'p1Weapon';
  if (typeof id !== 'string' || !id) return false;   // all weapons are unlocked in 2-player mode
  if (s.pvp[key] !== id) {
    s.pvp[key] = id;
    changed('pvp');
  }
  return true;
}

export function setLevel(n) {
  const s = get();
  const v = Math.max(1, Math.floor(Number(n) || 1));
  if (s.level !== v) {
    s.level = v;
    changed('level');
  }
  return s.level;
}

export function setSetting(k, v) {
  const s = get();
  if (s.settings[k] === v) return;
  s.settings[k] = v;
  changed('settings');
}

export function addStat(key, n = 1) {
  const s = get();
  s.stats[key] = (Number(s.stats[key]) || 0) + n;
  changed('stats');
}

export function reset() {
  state = makeDefaults();
  changed('reset');
}

export function on(event, fn) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(fn);
  return () => off(event, fn);
}

export function off(event, fn) {
  const set = listeners.get(event);
  if (set) set.delete(fn);
}

export default {
  load, save, get, addDough, spend, own, owns, equip, rent, rentLeft, pruneRentals, setPvpWeapon, setLevel, setSetting, addStat, reset, on, off,
  upgradeLevel, upgradeMult, upgradeCost, upgrade, dateKey, dailyStatus, claimDaily, markDailySeen,
};
