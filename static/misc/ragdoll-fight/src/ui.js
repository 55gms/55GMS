// Ragdoll Fight — DOM overlay UI (menus, HUD, shop, skins, results, pause, PvP).
//
// const ui = createUI(rootEl = #ui, { save, audio })
//
// Methods
//   ui.on(event, fn) -> off()        ui.off(event, fn)
//   ui.show('menu' | 'level' | 'pvp' | 'none')     (closes popups, resets fighting/prompt)
//   ui.hud({dough, level, bossName, bossHp, score:[p1, p2]})   partial updates; bossName null hides boss bar
//   ui.prompt({keys:['D'], text:'HOLD', after, highlight:['D'], cluster}) | ui.prompt(null)
//   ui.setFighting(bool)             hides shop columns + skins once the fight starts
//   ui.results({win, healthRatio, slices, reward, isBoss, note})   note: small line under the reward ('BOSS BONUS x3')
//   ui.daily({claimable, day, days:[{day, coins, weapon}]})   7-day login calendar popup; ui.dailyClaimed({day, coins, weapon})
//   ui.setDailyDot(bool)             red dot on the menu gift button (a reward is claimable)
//   ui.pause(open = true, {fromMenu})   ui.pvpResult({winner:'p1'|'p2'|'draw', score:[a,b], matchOver})
//   ui.closePopup()   ui.isPopupOpen() -> bool   ui.popup() -> name | null
//   ui.flashDough(amount?)   ui.refresh()
//   ui.setIconPainter(fn(ctx, weaponId, w, h))   ui.setSkinPainter(fn(ctx, skin, w, h))
//   ui.destroy()
//
// Events (emitted)
//   play1p, play2p, restart, pause, resume, menu, skip (HUD skip-level button + lose popup), setting(key, value),
//   equipWeapon(id, player), buyWeapon(id, player), equipSkin(id), buySkin(id), denied,
//   openSkins, closeSkins, retry, next, skip, nextRound, rematch,
//   adCoins (HUD "+100" pill), adRent(id, player) (yellow watch-an-ad shop row) — main plays the ad, then rewards
//   ui.setOffer(weaponId | null, level)   ui.celebrate(weaponId)
//
// The UI performs purchases / equips / setting changes on `save` itself and then emits events,
// so main.js only has to forward them to the running scene.

import { WEAPONS, SKINS, weaponById } from './catalog.js';
import { RENT_LEVELS } from './ads.js';
import * as saveMod from './save.js';
import * as audioMod from './audio.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------------------------------------------------------------- inline icons

export const ICON = {
  // gold coin (key kept as `dough` so every currency spot picks it up)
  dough: `<svg class="ico-dough" viewBox="0 0 32 32" aria-hidden="true"><ellipse cx="16" cy="28.2" rx="10" ry="2.3" fill="#000" opacity=".22"/><circle cx="16" cy="15.5" r="12" fill="#e9a91f" stroke="#9c6a12" stroke-width="2"/><circle cx="16" cy="15.5" r="8.4" fill="#ffc93d" stroke="#d18f16" stroke-width="1.6"/><path d="M16 9.4l1.8 3.7 4 .5-3 2.7.8 4-3.6-2-3.6 2 .8-4-3-2.7 4-.5z" fill="#e9a91f"/><path d="M8.3 11.4a9 9 0 0 1 5.2-5" fill="none" stroke="#fff3c4" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  restart: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M25.5 17.5A9.6 9.6 0 1 1 22 9.2" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M23.5 3.5v6.8h-6.8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pause: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="8" y="7" width="5.5" height="18" rx="2.2" fill="currentColor"/><rect x="18.5" y="7" width="5.5" height="18" rx="2.2" fill="currentColor"/></svg>`,
  skip: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 7.5l12.5 8.5L6 24.5z" fill="currentColor" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><rect x="21" y="6.5" width="5" height="19" rx="2" fill="currentColor"/></svg>`,
  gear: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" stroke-width="5.5" stroke-dasharray="4.2 3.65"/><circle cx="16" cy="16" r="6.5" fill="none" stroke="currentColor" stroke-width="3.5"/></svg>`,
  // main menu "more games" link (pizzaedition.com)
  controller: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9.6 9h12.8c3.6 0 6 2.6 6.6 6.4l1 6.6c.5 3.2-2.6 5.2-5 3.2l-3.6-3.2H10.6L7 25.2c-2.4 2-5.5 0-5-3.2l1-6.6C3.6 11.6 6 9 9.6 9z" fill="currentColor"/><path d="M9.5 13.4v5.4M6.8 16.1h5.4" stroke="#f2eee6" stroke-width="2.4" stroke-linecap="round"/><circle cx="21.4" cy="14.4" r="1.7" fill="#f2eee6"/><circle cx="24.6" cy="17.8" r="1.7" fill="#f2eee6"/></svg>`,
  // "watch an ad" hint: movie clapperboard with a play button
  ad: `<svg class="ico-ad" viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="12.5" width="24" height="15" rx="2.6" fill="currentColor"/><path d="M4.2 8.1l22.4-4.3 1.1 5.4-22.4 4.3z" fill="currentColor"/><path d="M9 6.9l2.4 5M15 5.8l2.4 5M21 4.6l2.4 5" stroke="#23262e" stroke-width="2.3" stroke-linecap="round"/><path d="M13.6 16.4v7.6l6.4-3.8z" fill="#23262e"/></svg>`,
  // HUD mode switch: crossed swords = go to 2 players, single sword = back to 1 player
  swords2: `<svg class="ico-2p" viewBox="0 0 32 32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round"><path d="M26 5.5L12.5 19M6 5.5L19.5 19" stroke-width="3.2"/><path d="M9.5 16.5l6 6M22.5 16.5l-6 6" stroke-width="2.6"/><path d="M10.5 21.5l-4 4M21.5 21.5l4 4" stroke-width="3"/></g><circle cx="5.6" cy="26.4" r="1.9" fill="currentColor"/><circle cx="26.4" cy="26.4" r="1.9" fill="currentColor"/></svg>`,
  sword1: `<svg class="ico-1p" viewBox="0 0 32 32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round"><path d="M25.5 5.5L12.5 18.5" stroke-width="3.4"/><path d="M9 15l7.5 7.5" stroke-width="2.8"/><path d="M10.5 20.5l-4.2 4.2" stroke-width="3.2"/></g><circle cx="5.4" cy="25.6" r="2" fill="currentColor"/></svg>`,
  // daily reward: wrapped present
  gift: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4.5" y="13" width="23" height="15" rx="2" fill="currentColor"/><rect x="3" y="9" width="26" height="6" rx="1.8" fill="currentColor"/><path d="M14 9h4v19h-4z" fill="#d8432f"/><path d="M16 9c-2-5-8-6-8-2.5S12.5 9 16 9zm0 0c2-5 8-6 8-2.5S19.5 9 16 9z" fill="none" stroke="#d8432f" stroke-width="2.4" stroke-linejoin="round"/></svg>`,
  hat: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="9" y="20" width="14" height="7" rx="1.5" fill="currentColor"/><path d="M8.5 19.5c-3 0-5.5-2.4-5.5-5.4s2.4-5.3 5.4-5.1C9.6 5.6 12.6 3.5 16 3.5s6.4 2.1 7.6 5.5c3-.2 5.4 2.1 5.4 5.1s-2.5 5.4-5.5 5.4z" fill="currentColor"/></svg>`,
  left: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20 6L10 16l10 10" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  right: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M12 6l10 10-10 10" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  close: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 9l14 14M23 9L9 23" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/></svg>`,
};

// level-result crowns (1-3 earned)
const CROWN_FULL = `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 22l12 11 12-19 12 19 12-11-5 27H13z" fill="#ffc23d" stroke="#1d2027" stroke-width="3" stroke-linejoin="round"/><path d="M15 29l4 4M26 24l-3 5" fill="none" stroke="#fff3c4" stroke-width="2.4" stroke-linecap="round"/><rect x="11" y="46" width="42" height="10" rx="2.5" fill="#f0a91d" stroke="#1d2027" stroke-width="3"/><path d="M16 51h9" stroke="#fff3c4" stroke-width="2.4" stroke-linecap="round"/><circle cx="8" cy="20" r="4" fill="#ffc23d" stroke="#1d2027" stroke-width="2.5"/><circle cx="32" cy="11" r="4.4" fill="#ffc23d" stroke="#1d2027" stroke-width="2.5"/><circle cx="56" cy="20" r="4" fill="#ffc23d" stroke="#1d2027" stroke-width="2.5"/><circle cx="32" cy="37" r="4.3" fill="#d8432f" stroke="#1d2027" stroke-width="2"/><circle cx="21" cy="40.5" r="2.8" fill="#5fbf6a" stroke="#1d2027" stroke-width="1.6"/><circle cx="43" cy="40.5" r="2.8" fill="#5fbf6a" stroke="#1d2027" stroke-width="1.6"/></svg>`;
const CROWN_EMPTY = `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="#1d2027" opacity=".55"><path d="M8 22l12 11 12-19 12 19 12-11-5 27H13z"/><rect x="11" y="46" width="42" height="10" rx="2.5"/><circle cx="8" cy="20" r="4"/><circle cx="32" cy="11" r="4.4"/><circle cx="56" cy="20" r="4"/></g></svg>`;

// menu weapons, drawn in local coords (+x along the weapon, origin at the grip)
const SCYTHE_END = `<path d="M44 5L61 5C69-13 64-40 36-56C47-37 48-19 42-3Z" fill="none" stroke="#f2eee6" stroke-width="9" stroke-linejoin="round"/>
    <path d="M59 5L80 0L59-5Z" fill="none" stroke="#f2eee6" stroke-width="9" stroke-linejoin="round"/>
    <path d="M44 5L61 5C69-13 64-40 36-56C47-37 48-19 42-3Z" fill="#a8171b" stroke="#23262e" stroke-width="3" stroke-linejoin="round"/>
    <path d="M47-2C51-18 50-34 41-48" fill="none" stroke="#ff6b55" stroke-width="3" stroke-linecap="round"/>
    <path d="M59 5L80 0L59-5Z" fill="#cfd4dc" stroke="#23262e" stroke-width="3" stroke-linejoin="round"/>
    <rect x="42" y="-7" width="10" height="14" rx="2" fill="#23262e"/>`;
const DUAL_SCYTHE_ART = `<rect x="-58" y="-4.5" width="116" height="9" rx="4.5" fill="#3a2c2c" stroke="#23262e" stroke-width="3"/>
    <rect x="-17" y="-6" width="5" height="12" rx="1.5" fill="#ffc23d" stroke="#23262e" stroke-width="2"/><rect x="12" y="-6" width="5" height="12" rx="1.5" fill="#ffc23d" stroke="#23262e" stroke-width="2"/>
    ${SCYTHE_END}<g transform="rotate(180)">${SCYTHE_END}</g>`;
const SWORD_ART = `<circle cx="-15" cy="0" r="5" fill="#ffc23d" stroke="#23262e" stroke-width="2.5"/>
    <rect x="-13" y="-4.5" width="16" height="9" rx="3" fill="#23262e"/>
    <path d="M6-5L66-4.5L82 0L66 4.5L6 5Z" fill="#dfe4ea" stroke="#23262e" stroke-width="3" stroke-linejoin="round"/>
    <path d="M10 0L64 0" stroke="#9aa3ae" stroke-width="2" stroke-linecap="round"/>
    <rect x="1" y="-14" width="7" height="28" rx="3" fill="#ffc23d" stroke="#23262e" stroke-width="2.5"/>`;
const SPIKE_BALL = (() => {
  const pts = [];
  for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2, r = i % 2 ? 13 : 25; pts.push(`${(60 + r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`); }
  return `<rect x="-12" y="-5" width="58" height="10" rx="5" fill="#b8793c" stroke="#23262e" stroke-width="3"/>
    <rect x="42" y="-8" width="8" height="16" rx="2" fill="#6b7079" stroke="#23262e" stroke-width="2.5"/>
    <polygon points="${pts.join(' ')}" fill="#9aa3ae" stroke="#23262e" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="60" cy="0" r="15" fill="#6b7079" stroke="#23262e" stroke-width="3"/>
    <circle cx="55" cy="-5" r="4.5" fill="#c3c9d1"/>`;
})();

const MENU_ART_1P = `<svg class="art" viewBox="0 -14 230 234" aria-hidden="true">
  <ellipse cx="100" cy="203" rx="62" ry="8" fill="#000" opacity=".16"/>
  <path d="M190 6A92 92 0 0 1 226 92" fill="none" stroke="#f2eee6" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 14" opacity=".55"/>
  <path d="M70 150A92 92 0 0 1 40 70" fill="none" stroke="#f2eee6" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 12" opacity=".35"/>
  <g transform="translate(148 66) rotate(-70)">
    ${DUAL_SCYTHE_ART}
  </g>
  <g fill="none" stroke="#23262e" stroke-width="17" stroke-linecap="round" stroke-linejoin="round">
    <path d="M102 84L96 136"/><path d="M96 136L76 166L62 198"/><path d="M96 136L121 163L138 195"/><path d="M100 94L78 106L66 128"/><path d="M100 94L126 86L148 66"/>
  </g>
  <g fill="none" stroke="#f2eee6" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
    <path d="M102 84L96 136"/><path d="M96 136L76 166L62 198"/><path d="M96 136L121 163L138 195"/><path d="M100 94L78 106L66 128"/><path d="M100 94L126 86L148 66"/>
  </g>
  <circle cx="106" cy="62" r="19" fill="#f2eee6" stroke="#23262e" stroke-width="3"/>
</svg>`;

const MENU_ART_2P = `<svg class="art" viewBox="0 -14 260 234" aria-hidden="true">
  <ellipse cx="68" cy="203" rx="46" ry="7" fill="#000" opacity=".16"/>
  <ellipse cx="192" cy="203" rx="46" ry="7" fill="#000" opacity=".16"/>
  <g transform="translate(108 72) rotate(-75)">
    ${SWORD_ART}
  </g>
  <g transform="translate(152 98) rotate(-100)">
    ${SPIKE_BALL}
  </g>
  <path d="M123 23l5 12 9-8-3 12 12 1-11 6 7 10-12-4-2 12-4-11-10 7 5-11-12-3 12-4-6-10z" fill="#ffc23d" stroke="#23262e" stroke-width="3.5" stroke-linejoin="round" transform="translate(117 36) scale(0.62) translate(-129 -40)"/>
  <g fill="none" stroke="#23262e" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">
    <path d="M65 88L70 140"/><path d="M70 140L50 170L40 198"/><path d="M70 140L89 168L97 198"/><path d="M66 98L48 112L40 134"/><path d="M66 98L90 92L108 72"/>
    <path d="M196 90L190 142"/><path d="M190 142L210 170L220 198"/><path d="M190 142L172 170L164 198"/><path d="M194 100L214 114L222 136"/><path d="M194 100L170 110L152 98"/>
  </g>
  <g fill="none" stroke="#f2eee6" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path d="M65 88L70 140"/><path d="M70 140L50 170L40 198"/><path d="M70 140L89 168L97 198"/><path d="M66 98L48 112L40 134"/><path d="M66 98L90 92L108 72"/>
    <path d="M196 90L190 142"/><path d="M190 142L210 170L220 198"/><path d="M190 142L172 170L164 198"/><path d="M194 100L214 114L222 136"/><path d="M194 100L170 110L152 98"/>
  </g>
  <circle cx="64" cy="70" r="17" fill="#f2eee6" stroke="#23262e" stroke-width="3"/>
  <path d="M48 66h32" stroke="#ffc23d" stroke-width="7" stroke-linecap="round"/>
  <path d="M49 66l-10 7M49 66l-12-1" stroke="#ffc23d" stroke-width="4.5" stroke-linecap="round"/>
  <circle cx="196" cy="72" r="17" fill="#f2eee6" stroke="#23262e" stroke-width="3"/>
  <path d="M180 68a16 15 0 0 1 32 0z" fill="#d8432f" stroke="#23262e" stroke-width="3" stroke-linejoin="round"/>
  <path d="M182 68h-14" stroke="#23262e" stroke-width="8" stroke-linecap="round"/>
  <path d="M182 68h-14" stroke="#d8432f" stroke-width="4" stroke-linecap="round"/>
</svg>`;

const SPLAT_CHOICES = [
  ['sauce', '#d8432f', 'Sauce'],
  ['cheese', '#ffc23d', 'Cheese'],
  ['pesto', '#5fbf6a', 'Pesto'],
  ['blue', '#3f86e0', 'Blue'],
  ['white', '#f2eee6', 'White'],
];

const TOGGLES = [
  ['sound', 'Sound'],
  ['shake', 'Screen shake'],
  ['gore', 'Gore'],
  ['decals', 'Splat decals'],
];

const KEY_LABEL = { LEFT: '←', RIGHT: '→', UP: '↑', DOWN: '↓', SPACE: 'SPACE', SHIFT: 'SHIFT', ENTER: 'ENTER' };
const CODE_TO_KEY = {
  Space: 'SPACE', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT', ArrowUp: 'UP', ArrowDown: 'DOWN',
  ShiftLeft: 'SHIFT', ShiftRight: 'SHIFT', Enter: 'ENTER',
};

// ---------------------------------------------------------------- placeholder painters

const OUT = '#1d2027';
const WOOD = '#b8793c';
const METAL = '#cfd4dc';

export function placeholderWeaponIcon(ctx, id, w, h) {
  const wp = weaponById(id);
  ctx.save();
  ctx.clearRect(0, 0, w, h);
  ctx.translate(w / 2, h / 2);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const L = Math.min(w * 0.86, Math.hypot(w, h) * 0.78);
  const u = h / 64; // unit relative to a 64px tall slot

  const stroke = (lw, color) => {
    ctx.lineWidth = lw + 5 * u;
    ctx.strokeStyle = OUT;
    ctx.stroke();
    ctx.lineWidth = lw;
    ctx.strokeStyle = color;
    ctx.stroke();
  };
  const line = (x1, y1, x2, y2, lw, color) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    stroke(lw, color);
  };
  const shape = (fill, draw) => {
    ctx.beginPath();
    draw();
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 3 * u;
    ctx.strokeStyle = OUT;
    ctx.stroke();
  };
  const circle = (x, y, r, fill) => shape(fill, () => ctx.arc(x, y, r, 0, Math.PI * 2));

  if (wp.id === 'fists') {
    ctx.rotate(-0.15);
    shape('#f2eee6', () => ctx.roundRect(-20 * u, -14 * u, 40 * u, 30 * u, 9 * u));
    for (let i = 0; i < 4; i++) circle(-15 * u + i * 10 * u, -14 * u, 5.5 * u, '#f2eee6');
    shape('#f2eee6', () => ctx.roundRect(-26 * u, -4 * u, 12 * u, 16 * u, 5 * u));
    ctx.restore();
    return;
  }

  ctx.rotate(-0.42);
  const a = -L / 2;
  const b = L / 2;
  const t = 7 * u;

  switch (wp.id) {
    case 'rolling_pin':
      line(a, 0, a + L * 0.22, 0, t * 0.8, WOOD);
      line(b - L * 0.22, 0, b, 0, t * 0.8, WOOD);
      shape('#e0a860', () => ctx.roundRect(a + L * 0.2, -9 * u, L * 0.6, 18 * u, 8 * u));
      break;
    case 'ladle':
      line(a, 0, b - 16 * u, 0, t * 0.8, METAL);
      shape(METAL, () => ctx.arc(b - 10 * u, 0, 12 * u, 0, Math.PI * 2));
      break;
    case 'baguette':
      shape('#e0a458', () => ctx.ellipse(0, 0, L / 2, 10 * u, 0, 0, Math.PI * 2));
      ctx.strokeStyle = '#b5762f';
      ctx.lineWidth = 3 * u;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(i * L * 0.15 + 5 * u, -6 * u);
        ctx.lineTo(i * L * 0.15 - 5 * u, 6 * u);
        ctx.stroke();
      }
      break;
    case 'bat':
      shape(WOOD, () => {
        ctx.moveTo(a, -3.5 * u);
        ctx.lineTo(b - 8 * u, -9 * u);
        ctx.arc(b - 8 * u, 0, 9 * u, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(a, 3.5 * u);
      });
      break;
    case 'pizza_cutter':
      line(a, 0, b - 18 * u, 0, t, WOOD);
      circle(b - 14 * u, 0, 16 * u, METAL);
      circle(b - 14 * u, 0, 3.5 * u, OUT);
      break;
    case 'cleaver':
      line(a, 0, a + L * 0.45, 0, t, WOOD);
      shape(METAL, () => ctx.roundRect(a + L * 0.42, -20 * u, L * 0.58, 24 * u, 3 * u));
      circle(b - 8 * u, -13 * u, 3 * u, OUT);
      break;
    case 'machete':
    case 'katana':
      line(a, 0, a + L * 0.3, 0, t, wp.id === 'katana' ? '#2e323b' : WOOD);
      line(a + L * 0.3, -9 * u, a + L * 0.3, 9 * u, 4 * u, '#ffc23d');
      shape(METAL, () => {
        ctx.moveTo(a + L * 0.31, -4 * u);
        ctx.quadraticCurveTo(b - L * 0.2, -6 * u, b, -12 * u * (wp.id === 'katana' ? 0.6 : 1));
        ctx.quadraticCurveTo(b - L * 0.2, 7 * u, a + L * 0.31, 5 * u);
      });
      break;
    case 'axe':
      line(a, 0, b - 4 * u, 0, t, WOOD);
      shape(METAL, () => {
        ctx.moveTo(b - 26 * u, -3 * u);
        ctx.quadraticCurveTo(b - 30 * u, -22 * u, b - 10 * u, -24 * u);
        ctx.quadraticCurveTo(b + 2 * u, -10 * u, b - 10 * u, 6 * u);
        ctx.lineTo(b - 22 * u, 4 * u);
      });
      break;
    case 'mace':
      line(a, 0, b - 18 * u, 0, t, WOOD);
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        line(b - 14 * u, 0, b - 14 * u + Math.cos(ang) * 17 * u, Math.sin(ang) * 17 * u, 3 * u, METAL);
      }
      circle(b - 14 * u, 0, 12 * u, '#8d939c');
      break;
    case 'hammer':
      line(a, 0, b - 12 * u, 0, t, WOOD);
      shape('#8d939c', () => ctx.roundRect(b - 22 * u, -18 * u, 20 * u, 36 * u, 4 * u));
      break;
    case 'peel':
      line(a, 0, b - L * 0.35, 0, t, WOOD);
      shape('#e6b36b', () => ctx.roundRect(b - L * 0.38, -18 * u, L * 0.38, 36 * u, 10 * u));
      break;
    case 'spear':
      line(a, 0, b - 14 * u, 0, t * 0.75, WOOD);
      shape(METAL, () => {
        ctx.moveTo(b - 18 * u, -7 * u);
        ctx.lineTo(b, 0);
        ctx.lineTo(b - 18 * u, 7 * u);
      });
      break;
    case 'staff':
      line(a, 0, b, 0, t * 0.8, WOOD);
      line(a, 0, a + 10 * u, 0, t * 1.1, '#ffc23d');
      line(b - 10 * u, 0, b, 0, t * 1.1, '#ffc23d');
      break;
    case 'trident':
    case 'giant_fork': {
      const prongs = wp.id === 'trident' ? [-9, 0, 9] : [-10, -3.3, 3.3, 10];
      line(a, 0, b - 22 * u, 0, t * 0.75, wp.id === 'trident' ? '#ffc23d' : METAL);
      line(b - 24 * u, (prongs[0] - 1) * u, b - 24 * u, (prongs[prongs.length - 1] + 1) * u, 4 * u, METAL);
      for (const p of prongs) line(b - 24 * u, p * u, b, p * u, 3.2 * u, METAL);
      break;
    }
    case 'nunchaku':
      line(a, 4 * u, a + L * 0.38, 4 * u, t, '#2e323b');
      line(b - L * 0.38, -6 * u, b, -12 * u, t, '#2e323b');
      for (let i = 1; i < 5; i++) circle(a + L * 0.38 + (i * L * 0.24) / 5, 4 * u - i * 2 * u, 2.2 * u, METAL);
      break;
    case 'flail':
      line(a, 0, a + L * 0.4, 0, t, WOOD);
      for (let i = 1; i < 5; i++) circle(a + L * 0.4 + i * L * 0.075, i * 2.5 * u, 2.4 * u, METAL);
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        line(b - 14 * u, 12 * u, b - 14 * u + Math.cos(ang) * 16 * u, 12 * u + Math.sin(ang) * 16 * u, 3 * u, METAL);
      }
      circle(b - 14 * u, 12 * u, 11 * u, '#8d939c');
      break;
    case 'double_blade':
      line(-L * 0.18, 0, L * 0.18, 0, t, '#2e323b');
      for (const s of [-1, 1]) {
        shape(METAL, () => {
          ctx.moveTo(s * L * 0.17, -5 * u);
          ctx.quadraticCurveTo(s * L * 0.38, -8 * u, s * L * 0.5, 0);
          ctx.quadraticCurveTo(s * L * 0.38, 6 * u, s * L * 0.17, 5 * u);
        });
      }
      break;
    case 'scythe':
      line(a, 0, b, 0, t * 0.8, WOOD);
      shape(METAL, () => {
        ctx.moveTo(b - 4 * u, -3 * u);
        ctx.quadraticCurveTo(b - L * 0.2, -30 * u, b - L * 0.5, -22 * u);
        ctx.quadraticCurveTo(b - L * 0.22, -18 * u, b - 10 * u, 3 * u);
      });
      break;
    default:
      if (wp.kind === 'blade') {
        line(a, 0, a + L * 0.3, 0, t, WOOD);
        shape(METAL, () => { ctx.moveTo(a + L * 0.3, -6 * u); ctx.lineTo(b, 0); ctx.lineTo(a + L * 0.3, 6 * u); });
      } else {
        line(a, 0, b, 0, t, WOOD);
      }
  }
  ctx.restore();
}

const HAT_DRAW = {
  chef_hat(ctx, x, y, r) {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = OUT;
    ctx.lineWidth = r * 0.12;
    ctx.beginPath();
    ctx.roundRect(x - r * 0.75, y - r * 1.25, r * 1.5, r * 0.55, r * 0.1);
    ctx.fill();
    ctx.stroke();
    for (const [dx, dy, rr] of [[-0.55, -1.55, 0.45], [0.55, -1.55, 0.45], [0, -1.85, 0.55]]) {
      ctx.beginPath();
      ctx.arc(x + dx * r, y + dy * r, rr * r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillRect(x - r * 0.7, y - r * 1.55, r * 1.4, r * 0.45);
  },
  cap_red(ctx, x, y, r) {
    ctx.fillStyle = '#d8432f';
    ctx.strokeStyle = OUT;
    ctx.lineWidth = r * 0.12;
    ctx.beginPath();
    ctx.arc(x, y - r * 0.2, r * 1.02, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(x + r * 0.2, y - r * 0.32, r * 1.2, r * 0.26, r * 0.12);
    ctx.fill();
    ctx.stroke();
  },
  bandana_green(ctx, x, y, r) {
    ctx.fillStyle = '#5fbf6a';
    ctx.strokeStyle = OUT;
    ctx.lineWidth = r * 0.12;
    ctx.beginPath();
    ctx.roundRect(x - r * 1.05, y - r * 0.62, r * 2.1, r * 0.42, r * 0.15);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - r * 1.0, y - r * 0.4);
    ctx.lineTo(x - r * 1.75, y - r * 0.05);
    ctx.lineTo(x - r * 1.6, y - r * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },
  salami_helm(ctx, x, y, r) {
    ctx.fillStyle = '#b8412f';
    ctx.strokeStyle = OUT;
    ctx.lineWidth = r * 0.12;
    ctx.beginPath();
    ctx.arc(x, y - r * 0.05, r * 1.12, Math.PI * 1.02, -0.02);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ef8c75';
    for (const [dx, dy] of [[-0.5, -0.55], [0.15, -0.8], [0.55, -0.35], [-0.1, -0.3]]) {
      ctx.beginPath();
      ctx.arc(x + dx * r, y + dy * r, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  crust_helm(ctx, x, y, r) {
    ctx.fillStyle = '#d4924b';
    ctx.strokeStyle = OUT;
    ctx.lineWidth = r * 0.12;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.14, Math.PI * 0.95, Math.PI * 0.05);
    ctx.lineTo(x + r * 1.14, y + r * 0.4);
    ctx.lineTo(x - r * 1.14, y + r * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = OUT;
    ctx.fillRect(x - r * 0.2, y - r * 0.18, r * 1.2, r * 0.2);
  },
  cheese_crown(ctx, x, y, r) {
    ctx.fillStyle = '#ffc23d';
    ctx.strokeStyle = OUT;
    ctx.lineWidth = r * 0.12;
    ctx.beginPath();
    ctx.moveTo(x - r * 0.9, y - r * 0.55);
    ctx.lineTo(x - r * 0.95, y - r * 1.5);
    ctx.lineTo(x - r * 0.4, y - r * 1.0);
    ctx.lineTo(x, y - r * 1.7);
    ctx.lineTo(x + r * 0.4, y - r * 1.0);
    ctx.lineTo(x + r * 0.95, y - r * 1.5);
    ctx.lineTo(x + r * 0.9, y - r * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e59e17';
    ctx.beginPath();
    ctx.arc(x - r * 0.35, y - r * 0.8, r * 0.13, 0, Math.PI * 2);
    ctx.arc(x + r * 0.3, y - r * 0.75, r * 0.1, 0, Math.PI * 2);
    ctx.fill();
  },
  oven_helm(ctx, x, y, r) {
    ctx.fillStyle = '#8b3a2b';
    ctx.strokeStyle = OUT;
    ctx.lineWidth = r * 0.12;
    ctx.beginPath();
    ctx.arc(x, y + r * 0.1, r * 1.22, Math.PI, 0);
    ctx.lineTo(x + r * 1.22, y + r * 0.55);
    ctx.lineTo(x - r * 1.22, y + r * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ff9b2e';
    ctx.beginPath();
    ctx.arc(x + r * 0.15, y + r * 0.35, r * 0.55, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#6d2c21';
    ctx.lineWidth = r * 0.07;
    ctx.beginPath();
    ctx.moveTo(x - r * 1.0, y - r * 0.35);
    ctx.lineTo(x + r * 1.0, y - r * 0.35);
    ctx.moveTo(x - r * 0.4, y - r * 0.35);
    ctx.lineTo(x - r * 0.4, y - r * 0.95);
    ctx.moveTo(x + r * 0.35, y - r * 0.35);
    ctx.lineTo(x + r * 0.35, y - r * 0.95);
    ctx.stroke();
  },
};

export function placeholderSkinPreview(ctx, skin, w, h) {
  ctx.save();
  ctx.clearRect(0, 0, w, h);
  const s = Math.min(w / 240, h / 280);
  ctx.translate(w / 2 - 120 * s, h / 2 - 140 * s);
  ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  ctx.beginPath();
  ctx.ellipse(120, 262, 70, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  const limbs = [
    [[120, 104], [120, 176]],
    [[120, 176], [100, 218], [92, 260]],
    [[120, 176], [142, 218], [150, 260]],
    [[120, 116], [90, 146], [80, 182]],
    [[120, 116], [152, 142], [168, 118]],
  ];
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const [lw, color] of [[24, OUT], [15, skin.body]]) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = color;
    for (const pts of limbs) {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
    }
  }
  ctx.fillStyle = skin.body;
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.arc(122, 76, 27, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (skin.hat && HAT_DRAW[skin.hat]) HAT_DRAW[skin.hat](ctx, 122, 76, 27);
  ctx.restore();
}

// ---------------------------------------------------------------- template

function shopColumn(player, title) {
  return `<aside class="shop shop-${player}" data-player="${player}">
    <div class="shop-head">${title}</div>
    <div class="shop-list" data-el="list-${player}"></div>
    ${player === 'p1' ? `<button class="upgrade-btn btn cheese" data-act="upgrade" data-el="upgradeBtn" title="+12% damage per level" hidden></button>
    <button class="skins-btn btn cheese" data-act="skins">${ICON.hat}<span>SKINS</span></button>` : ''}
  </aside>`;
}

function template() {
  return `
  <section class="screen menu" data-screen="menu">
    <button class="half half-1p" data-act="play1p" aria-label="1 player">
      <span class="half-inner"><span class="half-art">${MENU_ART_1P}</span><span class="half-label">1 PLAYER</span></span>
    </button>
    <button class="half half-2p" data-act="play2p" aria-label="2 players">
      <span class="half-inner"><span class="half-art">${MENU_ART_2P}</span><span class="half-label">2 PLAYERS</span></span>
    </button>
    <div class="menu-divider"></div>
    <header class="logo">
      <h1 class="logo-title"><span class="l1">RAGDOLL</span><span class="l2">FIGHT</span></h1>    </header>
    <div class="menu-foot">
      <div class="pill dough-pill">${ICON.dough}<b data-bind="dough">0</b></div>
      <button class="icon-btn daily-btn" data-act="daily" data-el="dailyBtn" aria-label="Daily reward" title="Daily reward">${ICON.gift}<i class="daily-dot" data-el="dailyDot" hidden></i></button>
      <a class="icon-btn more-games-btn" href="https://pizzaedition.com" target="_blank" rel="noopener" aria-label="More games at Pizza Edition" title="More games">${ICON.controller}</a>
      <button class="icon-btn" data-act="settings" aria-label="Settings">${ICON.gear}</button>
    </div>
  </section>

  <section class="screen hud mode-1p" data-screen="level" data-el="hud">
    <div class="hud-top">
      <div class="hud-left"><div class="pill dough-pill" data-el="doughPill">${ICON.dough}<b data-bind="dough">0</b></div><button class="pill ad-pill" data-act="adCoins" title="Watch an ad for +100 coins" aria-label="Watch an ad for 100 coins">${ICON.ad}<b>+100</b></button></div>
      <div class="hud-center">
        <div class="level-pill" data-el="levelPill">LEVEL <b data-bind="level">1</b></div>
        <div class="boss" data-el="boss" hidden>
          <div class="boss-name" data-bind="bossName"></div>
          <div class="boss-bar"><b data-el="bossGhost"></b><i data-el="bossFill"></i></div>
        </div>
        <div class="score"><span class="tag-p1">P1</span><b data-bind="s1">0</b><span class="dash">&ndash;</span><b data-bind="s2">0</b><span class="tag-p2">P2</span></div>
      </div>
      <div class="hud-right">
        <button class="icon-btn mode-btn" data-act="switchMode" aria-label="Switch between 1 player and 2 players">${ICON.swords2}${ICON.sword1}</button>
        <button class="icon-btn" data-act="pause" aria-label="Settings">${ICON.gear}</button>
        <button class="icon-btn skip-btn" data-act="skipLevel" aria-label="Skip level">${ICON.skip}<span class="ad-badge">${ICON.ad}</span></button>
      </div>
    </div>
    ${shopColumn('p1', 'WEAPONS')}
    ${shopColumn('p2', 'P2 WEAPON')}
    <div class="prompt" data-el="prompt"></div>
  </section>

  <div class="popup-layer" data-el="layer">
    <div class="popup results-pop" data-popup="results">
      <div class="ribbon" data-bind="resTitle">LEVEL CLEAR!</div>
      <div class="slices" data-el="slices">
        ${[0, 1, 2].map(() => `<div class="slice"><span class="empty">${CROWN_EMPTY}</span><span class="full">${CROWN_FULL}</span></div>`).join('')}
      </div>
      <div class="res-health">Health: <b data-bind="resHealth">100%</b></div>
      <div class="res-reward" data-el="resReward">+ ${ICON.dough}<b data-bind="resDough">0</b></div>
      <div class="res-note" data-el="resNote" hidden></div>
      <div class="btn-row">
        <button class="btn" data-act="retry">${ICON.restart}<span>Try again</span></button>
        <button class="btn go" data-act="next" data-el="btnNext"><span>Next</span>${ICON.right}</button>
        <button class="btn warn ad-btn" data-act="skip" data-el="btnSkip"><span>Skip</span>${ICON.right}<span class="ad-badge">${ICON.ad}</span></button>
      </div>
    </div>

    <div class="popup pause-pop" data-popup="pause">
      <h2 data-bind="pauseTitle">PAUSED</h2>
      <div class="toggles">
        ${TOGGLES.map(([k, label]) => `<button class="toggle" data-act="toggle" data-key="${k}" role="switch" aria-checked="true"><span>${label}</span><span class="sw"><i></i></span></button>`).join('')}
      </div>
      <div class="swatch-label">Splat colour</div>
      <div class="swatches">
        ${SPLAT_CHOICES.map(([k, c, label]) => `<button class="swatch" data-act="swatch" data-color="${k}" style="--c:${c}" aria-label="${label}" title="${label}"></button>`).join('')}
      </div>
      <div class="btn-row">
        <button class="btn warn" data-act="menu" data-el="btnMenu"><span>Main menu</span></button>
        <button class="btn go" data-act="resume" data-bind="resumeLabel">Resume</button>
      </div>
    </div>

    <div class="popup skins-pop" data-popup="skins">
      <button class="icon-btn close-btn" data-act="closeSkins" aria-label="Close">${ICON.close}</button>
      <h2>SKINS</h2>
      <div class="carousel">
        <button class="icon-btn arrow" data-act="skinPrev" aria-label="Previous skin">${ICON.left}</button>
        <div class="skin-stage" data-el="skinStage"><canvas width="240" height="280" data-el="skinCanvas"></canvas></div>
        <button class="icon-btn arrow" data-act="skinNext" aria-label="Next skin">${ICON.right}</button>
      </div>
      <div class="skin-name" data-bind="skinName"></div>
      <div class="dots" data-el="skinDots">${SKINS.map(() => '<i></i>').join('')}</div>
      <div class="btn-row"><button class="btn go skin-action" data-act="skinAction" data-el="skinBtn"></button></div>
    </div>

    <div class="popup daily-pop" data-popup="daily">
      <button class="icon-btn close-btn" data-act="closeDaily" aria-label="Close">${ICON.close}</button>
      <div class="ribbon">DAILY REWARD</div>
      <div class="daily-sub" data-bind="dailySub"></div>
      <div class="daily-grid" data-el="dailyGrid"></div>
      <div class="btn-row" data-el="dailyBtns">
        <button class="btn go" data-act="dailyClaim"><span>Claim</span></button>
        <button class="btn cheese ad-btn" data-act="dailyClaim2"><span>Claim x2</span><span class="ad-badge">${ICON.ad}</span></button>
      </div>
      <div class="daily-wait" data-el="dailyWait" hidden></div>
    </div>

    <div class="popup pvp-pop" data-popup="pvpResult">
      <div class="ribbon" data-bind="pvpTitle">P1 WINS!</div>
      <div class="pvp-score"><span class="tag-p1">P1</span><b data-bind="ps1">0</b><span class="dash">&ndash;</span><b data-bind="ps2">0</b><span class="tag-p2">P2</span></div>
      <div class="pvp-sub" data-bind="pvpSub">First to 3 wins the match</div>
      <div class="btn-row">
        <button class="btn warn" data-act="menu"><span>Menu</span></button>
        <button class="btn go" data-act="nextRound" data-el="btnNextRound"><span>Next round</span>${ICON.right}</button>
        <button class="btn go" data-act="rematch" data-el="btnRematch">${ICON.restart}<span>Rematch</span></button>
      </div>
    </div>
  </div>`;
}

// ---------------------------------------------------------------- createUI

export function createUI(root, deps = {}) {
  root = root || document.getElementById('ui');
  const save = deps.save || saveMod;
  const audio = deps.audio || audioMod;

  const handlers = new Map();
  const on = (ev, fn) => {
    if (!handlers.has(ev)) handlers.set(ev, new Set());
    handlers.get(ev).add(fn);
    return () => off(ev, fn);
  };
  const off = (ev, fn) => { const s = handlers.get(ev); if (s) s.delete(fn); };
  const emit = (ev, ...args) => {
    const s = handlers.get(ev);
    if (!s) return;
    for (const fn of [...s]) {
      try { fn(...args); } catch (e) { console.error(`[ui] handler for "${ev}" failed`, e); }
    }
  };

  root.innerHTML = template();
  root.classList.add('rf-ui');

  const el = (name) => root.querySelector(`[data-el="${name}"]`);
  const setText = (name, v) => root.querySelectorAll(`[data-bind="${name}"]`).forEach((n) => { n.textContent = v; });
  const sfx = (name, o) => { try { audio.play(name, o); } catch (e) { /* ignore */ } };

  const hudEl = el('hud');
  const layer = el('layer');
  let screen = 'none';
  let mode = '1p';
  let fighting = false;
  let popupName = null;
  let iconPainter = null;
  let skinPainter = null;
  let skinIndex = 0;
  let timers = [];
  let promptTimer = null;
  let offerId = null;   // this level's watch-an-ad weapon (yellow row)
  let playLevel = 1;    // level being played: rented weapons count down against it

  const later = (ms, fn) => { const id = setTimeout(fn, ms); timers.push(id); return id; };
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

  // ---------- shops ----------

  function buildShop(player) {
    const list = el(`list-${player}`);
    list.innerHTML = WEAPONS.map((w) => `
      <button class="shop-row" data-act="weapon" data-id="${w.id}" data-player="${player}">
        <span class="row-icon"><canvas width="128" height="64"></canvas></span>
        <span class="row-text"><span class="row-name">${esc(w.name)}</span><span class="row-tag"></span><span class="row-pips" hidden></span></span>
      </button>`).join('');
  }
  buildShop('p1');
  buildShop('p2');

  function paintIcons() {
    root.querySelectorAll('.shop-row canvas').forEach((c) => {
      const id = c.closest('.shop-row').dataset.id;
      const g = c.getContext('2d');
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, c.width, c.height);
      try {
        if (iconPainter) {
          g.save();
          iconPainter(g, id, c.width, c.height);
          g.restore();
        } else placeholderWeaponIcon(g, id, c.width, c.height);
      } catch (e) {
        g.setTransform(1, 0, 0, 1, 0, 0);
        placeholderWeaponIcon(g, id, c.width, c.height);
      }
    });
  }
  paintIcons();

  function equippedFor(player) {
    const s = save.get();
    if (mode === 'pvp') return player === 'p2' ? s.pvp.p2Weapon : s.pvp.p1Weapon;
    return s.equippedWeapon;
  }

  function refreshShops() {
    const s = save.get();
    root.querySelectorAll('.shop-row').forEach((row) => {
      const id = row.dataset.id;
      const w = weaponById(id);
      const bought = mode === 'pvp' || s.ownedWeapons.includes(id);   // 2-player mode: everything unlocked
      const left = bought ? 0 : Math.max(0, ((s.rentals || {})[id] || 0) - playLevel);   // watched-ad weapon: levels left
      const rented = left > 0;
      const owned = bought || rented;
      const offer = !owned && mode !== 'pvp' && id === offerId;   // yellow "watch an ad" row
      const eq = equippedFor(row.dataset.player) === id;
      const poor = !owned && !offer && w.price > s.dough;
      const lv = bought && mode !== 'pvp' && id !== 'fists' ? save.upgradeLevel(id) : 0;   // upgrade stars: 1P, owned weapons only
      const st = (eq ? `eq${left}` : rented ? `rent${left}` : bought ? 'own' : offer ? 'ad' : poor ? 'poor' : 'buy') + `u${lv}`;
      if (row.dataset.state === st) return;
      const pips = row.querySelector('.row-pips');
      pips.hidden = !lv;
      pips.innerHTML = lv ? Array.from({ length: save.UPGRADE_MAX || 5 }, (_, i) => `<i${i < lv ? ' class="on"' : ''}>★</i>`).join('') : '';
      row.dataset.state = st;
      row.classList.toggle('equipped', eq);
      row.classList.toggle('owned', owned);
      row.classList.toggle('rented', rented);
      row.classList.toggle('offer', offer);
      row.classList.toggle('locked', !owned);
      row.classList.toggle('poor', poor);
      const tag = row.querySelector('.row-tag');
      const lvls = (n) => `${n} LEVEL${n === 1 ? '' : 'S'}`;
      tag.innerHTML = rented ? `${ICON.ad}<span>${lvls(left)} LEFT</span>` : eq ? 'EQUIPPED' : owned ? 'OWNED'
        : offer ? `${ICON.ad}<span>FREE ${lvls(RENT_LEVELS)}</span>` : `${ICON.dough}<span>${w.price}</span>`;
    });
    refreshUpgrade();
  }

  // UPGRADE button under the 1P shop: upgrades the selected (= equipped, owned) weapon. Hidden for fists, rentals and 2P.
  function refreshUpgrade() {
    const btn = el('upgradeBtn');
    if (!btn) return;
    const s = save.get();
    const id = s.equippedWeapon;
    if (mode === 'pvp' || id === 'fists' || !s.ownedWeapons.includes(id) || typeof save.upgradeCost !== 'function') { btn.hidden = true; return; }
    const cost = save.upgradeCost(id);
    const key = `${id}:${cost}:${cost > s.dough}`;
    btn.hidden = false;
    if (btn.dataset.state === key) return;
    btn.dataset.state = key;
    btn.classList.toggle('done', !cost);
    btn.classList.toggle('cheese', !!cost && cost <= s.dough);
    btn.classList.toggle('poor', !!cost && cost > s.dough);
    btn.innerHTML = cost ? `<span>UPGRADE ⭑</span>${ICON.dough}<span>${cost}</span>` : '<span>MAX ⭑⭑⭑⭑⭑</span>';
  }

  function clickUpgrade(btn) {
    if (fighting || mode === 'pvp') return;
    const id = save.get().equippedWeapon;
    const cost = save.upgradeCost(id);
    if (!cost) { sfx('click'); return; }
    const lv = save.upgrade(id);
    if (!lv) { deny(btn); return; }
    sfx('coin', { pitch: 1 + lv * 0.06 });
    flashDough(-cost);
    const row = el('list-p1').querySelector(`.shop-row[data-id="${id}"]`);
    if (row) { row.classList.remove('bought'); void row.offsetWidth; row.classList.add('bought'); }
    refreshShops();
    emit('upgradeWeapon', id, lv);
  }

  function scrollEquippedIntoView() {
    for (const player of ['p1', 'p2']) {
      const row = el(`list-${player}`).querySelector('.shop-row.equipped');
      if (row && row.scrollIntoView) row.scrollIntoView({ block: 'nearest' });
    }
  }

  function deny(node) {
    node.classList.remove('deny');
    void node.offsetWidth;
    node.classList.add('deny');
    const pill = el('doughPill');
    pill.classList.remove('deny');
    void pill.offsetWidth;
    pill.classList.add('deny');
    sfx('click', { pitch: 0.45, volume: 0.9 });
    emit('denied');
  }

  function clickWeapon(row) {
    if (fighting) return;
    const id = row.dataset.id;
    const player = row.dataset.player || 'p1';
    const w = weaponById(id);
    const rented = ((save.get().rentals || {})[id] || 0) > playLevel;
    if (mode !== 'pvp' && !save.owns('weapon', id) && !rented) {   // 2-player mode: everything is free to pick
      if (id === offerId) { sfx('click'); emit('adRent', id, player); return; }   // yellow row: main plays the ad, then rents it
      if (!save.spend(w.price)) { deny(row); return; }
      save.own('weapon', id);
      sfx('coin');
      flashDough(-w.price);
      row.classList.remove('bought');
      void row.offsetWidth;
      row.classList.add('bought');
      emit('buyWeapon', id, player);
    } else {
      sfx('click');
    }
    if (mode === 'pvp') save.setPvpWeapon(player, id);
    else save.equip('weapon', id);
    refreshShops();
    emit('equipWeapon', id, player);
  }

  // ---------- skins ----------

  function paintSkin() {
    const c = el('skinCanvas');
    const g = c.getContext('2d');
    const skin = SKINS[skinIndex];
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, c.width, c.height);
    try {
      if (skinPainter) {
        g.save();
        skinPainter(g, skin, c.width, c.height);
        g.restore();
      } else placeholderSkinPreview(g, skin, c.width, c.height);
    } catch (e) {
      g.setTransform(1, 0, 0, 1, 0, 0);
      placeholderSkinPreview(g, skin, c.width, c.height);
    }
  }

  function renderSkin() {
    const s = save.get();
    const skin = SKINS[skinIndex];
    setText('skinName', skin.name);
    el('skinDots').querySelectorAll('i').forEach((d, i) => d.classList.toggle('on', i === skinIndex));
    const owned = s.ownedSkins.includes(skin.id);
    const eq = s.equippedSkin === skin.id;
    const btn = el('skinBtn');
    btn.classList.toggle('go', owned && !eq);
    btn.classList.toggle('cheese', !owned && skin.price <= s.dough);
    btn.classList.toggle('poor', !owned && skin.price > s.dough);
    btn.classList.toggle('done', eq);
    btn.innerHTML = eq ? '<span>EQUIPPED</span>' : owned ? '<span>EQUIP</span>' : `<span>BUY</span>${ICON.dough}<span>${skin.price}</span>`;
    paintSkin();
  }

  function openSkins() {
    if (fighting) return;
    const s = save.get();
    skinIndex = Math.max(0, SKINS.findIndex((k) => k.id === s.equippedSkin));
    renderSkin();
    openPopup('skins');
    emit('openSkins');
  }

  function stepSkin(d) {
    skinIndex = (skinIndex + d + SKINS.length) % SKINS.length;
    const stage = el('skinStage');
    stage.classList.remove('swap-l', 'swap-r');
    void stage.offsetWidth;
    stage.classList.add(d < 0 ? 'swap-l' : 'swap-r');
    renderSkin();
  }

  function skinAction() {
    const skin = SKINS[skinIndex];
    const s = save.get();
    const btn = el('skinBtn');
    if (s.equippedSkin === skin.id) { sfx('click'); return; }
    if (!s.ownedSkins.includes(skin.id)) {
      if (!save.spend(skin.price)) { deny(btn); return; }
      save.own('skin', skin.id);
      sfx('coin');
      flashDough(-skin.price);
      emit('buySkin', skin.id);
    } else {
      sfx('click');
    }
    save.equip('skin', skin.id);
    renderSkin();
    emit('equipSkin', skin.id);
  }

  // ---------- popups ----------

  function openPopup(name) {
    clearTimers();
    popupName = name;
    layer.classList.add('open');
    root.querySelectorAll('.popup').forEach((p) => p.classList.toggle('open', p.dataset.popup === name));
  }

  function closePopup() {
    clearTimers();
    const was = popupName;
    popupName = null;
    layer.classList.remove('open');
    root.querySelectorAll('.popup.open').forEach((p) => p.classList.remove('open'));
    return was;
  }

  function results({ win = false, healthRatio = 0, slices = 0, reward = 0, isBoss = false, note = '' } = {}) {
    const noteEl = el('resNote');
    noteEl.hidden = !(win && note);
    noteEl.textContent = note || '';
    noteEl.classList.toggle('replay', /^REPLAY/.test(note || ''));
    openPopup('results');
    const pop = root.querySelector('.results-pop');
    pop.classList.toggle('win', !!win);
    pop.classList.toggle('lose', !win);
    setText('resTitle', win ? (isBoss ? 'BOSS DEFEATED!' : 'LEVEL CLEAR!') : 'DEFEATED');
    setText('resHealth', `${Math.round(Math.max(0, Math.min(1, healthRatio)) * 100)}%`);
    setText('resDough', '0');
    el('resReward').hidden = !win;
    el('btnNext').hidden = !win;
    el('btnSkip').hidden = !!win;
    const slots = el('slices').querySelectorAll('.slice');
    slots.forEach((s) => s.classList.remove('on'));
    const n = win ? Math.max(0, Math.min(3, slices | 0)) : 0;

    sfx(win ? 'win' : 'lose');
    for (let i = 0; i < n; i++) {
      later(520 + i * 380, () => {
        slots[i].classList.add('on');
        sfx('slice_award', { pitch: 1 + i * 0.19 });
      });
    }
    if (win && reward > 0) {
      const start = 520 + n * 380 + 120;
      const steps = 14;
      for (let k = 1; k <= steps; k++) {
        later(start + k * 45, () => {
          setText('resDough', String(Math.round((reward * k) / steps)));
          if (k % 4 === 0 || k === steps) sfx('coin', { volume: 0.5, pitch: 1 + k * 0.01 });
          if (k === steps) flashDough(reward);
        });
      }
    }
  }

  function syncSettings() {
    const st = save.get().settings;
    root.querySelectorAll('.toggle').forEach((t) => {
      const on = st[t.dataset.key] !== false;
      t.classList.toggle('on', on);
      t.setAttribute('aria-checked', String(on));
    });
    root.querySelectorAll('.swatch').forEach((s) => s.classList.toggle('on', s.dataset.color === st.splatColor));
  }

  function pause(open = true, { fromMenu = false } = {}) {
    if (!open) {
      if (popupName === 'pause') closePopup();
      return;
    }
    syncSettings();
    setText('pauseTitle', fromMenu ? 'SETTINGS' : 'PAUSED');
    setText('resumeLabel', fromMenu ? 'Done' : 'Resume');
    el('btnMenu').hidden = !!fromMenu;
    openPopup('pause');
  }

  function pvpResult({ winner = 'draw', score = [0, 0], matchOver = false } = {}) {
    openPopup('pvpResult');
    const pop = root.querySelector('.pvp-pop');
    pop.classList.remove('w-p1', 'w-p2', 'w-draw');
    pop.classList.add(`w-${winner}`);
    const who = winner === 'p1' ? 'P1' : winner === 'p2' ? 'P2' : null;
    setText('pvpTitle', who ? (matchOver ? `${who} WINS THE MATCH!` : `${who} WINS!`) : 'DRAW!');
    setText('ps1', score[0] ?? 0);
    setText('ps2', score[1] ?? 0);
    setText('pvpSub', matchOver ? 'Pizza party for the champ' : 'First to 3 wins the match');
    el('btnNextRound').hidden = !!matchOver;
    el('btnRematch').hidden = !matchOver;
    sfx(matchOver ? 'win' : 'slice_award');
  }

  // ---------- HUD ----------

  function hud(o = {}) {
    if ('dough' in o) setText('dough', o.dough);
    if ('level' in o) setText('level', o.level);
    if ('bossName' in o) {
      const on = !!o.bossName;
      el('boss').hidden = !on;
      el('levelPill').hidden = on;
      setText('bossName', on ? o.bossName : '');
      if (on && !('bossHp' in o)) o.bossHp = 1;
    }
    if ('bossHp' in o && o.bossHp !== undefined && o.bossHp !== null) {
      const pct = `${Math.max(0, Math.min(1, o.bossHp)) * 100}%`;
      el('bossFill').style.width = pct;
      el('bossGhost').style.width = pct;
    }
    if (Array.isArray(o.score)) {
      setText('s1', o.score[0] ?? 0);
      setText('s2', o.score[1] ?? 0);
    }
  }

  function flashDough(amount) {
    root.querySelectorAll('.dough-pill').forEach((p) => {
      p.classList.remove('pulse');
      void p.offsetWidth;
      p.classList.add('pulse');
      if (amount) {
        const f = document.createElement('span');
        f.className = `dough-float ${amount < 0 ? 'neg' : ''}`;
        f.textContent = `${amount > 0 ? '+' : '−'}${Math.abs(amount)}`;
        p.appendChild(f);
        setTimeout(() => f.remove(), 900);
      }
    });
  }

  function setFighting(v) {
    fighting = !!v;
    hudEl.classList.toggle('fighting', fighting);
    if (fighting && popupName === 'skins') closePopup();
  }

  function capHTML(k, hl) {
    const label = KEY_LABEL[k] || k;
    const wide = k === 'SPACE' || k === 'SHIFT' || k === 'ENTER';
    return `<span class="kcap${wide ? ' wide' : ''}${hl ? ' hl' : ''}" data-key="${esc(k)}">${esc(label)}</span>`;
  }

  function prompt(p) {
    const box = el('prompt');
    clearTimeout(promptTimer);
    if (!p) {
      box.classList.remove('show');
      promptTimer = setTimeout(() => { if (!box.classList.contains('show')) box.innerHTML = ''; }, 250);
      return;
    }
    const keys = (p.keys || []).map((k) => String(k).toUpperCase());
    const isCluster = p.cluster ?? ['W', 'A', 'S', 'D'].every((k) => keys.includes(k));
    const hl = new Set((p.highlight || (isCluster ? [] : keys)).map((k) => String(k).toUpperCase()));
    let html = '';
    if (isCluster) {
      html = `${p.text ? `<div class="ptext">${esc(p.text)}</div>` : ''}
        <div class="kcluster">
          ${['W', 'A', 'S', 'D'].map((k) => `<span class="kc-${k.toLowerCase()}">${capHTML(k, hl.has(k))}</span>`).join('')}
          ${keys.includes('SPACE') ? `<span class="kc-space">${capHTML('SPACE', hl.has('SPACE'))}</span>` : ''}
        </div>
        ${p.after ? `<div class="ptext small">${esc(p.after)}</div>` : ''}`;
      box.className = 'prompt cluster show';
    } else {
      html = `<div class="prow">${p.text ? `<span class="ptext">${esc(p.text)}</span>` : ''}${keys.map((k) => capHTML(k, hl.has(k))).join('<span class="plus">+</span>')}${p.after ? `<span class="ptext">${esc(p.after)}</span>` : ''}</div>`;
      box.className = 'prompt show';
    }
    box.innerHTML = html;
  }

  function onKey(e, down) {
    let code = e.code;
    if (!code && e.key) code = e.key === ' ' ? 'Space' : e.key.length === 1 ? `Key${e.key.toUpperCase()}` : e.key;
    const k = CODE_TO_KEY[code] || (code && code.startsWith('Key') ? code.slice(3) : null);
    if (!k) return;
    root.querySelectorAll(`.kcap[data-key="${k}"]`).forEach((c) => c.classList.toggle('down', down));
  }
  const onKeyDown = (e) => onKey(e, true);
  const onKeyUp = (e) => onKey(e, false);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // ---------- screens ----------

  function refreshDough() {
    setText('dough', save.get().dough);
  }

  function show(name) {
    closePopup();
    screen = name;
    const target = name === 'pvp' ? 'level' : name;
    root.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.dataset.screen === target));
    if (name === 'level' || name === 'pvp') {
      mode = name === 'pvp' ? 'pvp' : '1p';
      hudEl.classList.toggle('mode-pvp', mode === 'pvp');
      hudEl.classList.toggle('mode-1p', mode === '1p');
      hudEl.querySelector('.shop-p1 .shop-head').textContent = mode === 'pvp' ? 'P1 WEAPON' : 'WEAPONS';
      root.querySelectorAll('.shop-row').forEach((r) => { delete r.dataset.state; });
      setFighting(false);
      prompt(null);
      hud({ bossName: null });
      refreshShops();
      requestAnimationFrame(scrollEquippedIntoView);
    }
    refreshDough();
  }

  // ---------- click routing ----------

  function onClick(e) {
    const b = e.target.closest('[data-act]');
    if (!b || !root.contains(b)) return;
    const act = b.dataset.act;
    if (b.blur) b.blur();
    switch (act) {
      case 'weapon': clickWeapon(b); return;
      case 'upgrade': clickUpgrade(b); return;
      case 'closeDaily': sfx('click'); closePopup(); return;
      case 'dailyClaim': sfx('click'); emit('dailyClaim', false); return;
      case 'dailyClaim2': sfx('click'); emit('dailyClaim', true); return;
      case 'skins': sfx('click'); openSkins(); return;
      case 'skinPrev': sfx('click', { pitch: 0.9 }); stepSkin(-1); return;
      case 'skinNext': sfx('click', { pitch: 1.1 }); stepSkin(1); return;
      case 'skinAction': skinAction(); return;
      case 'closeSkins': sfx('click'); closePopup(); emit('closeSkins'); return;
      case 'toggle': {
        const key = b.dataset.key;
        const v = !(save.get().settings[key] !== false);
        save.setSetting(key, v);
        syncSettings();
        sfx('click', { pitch: v ? 1.15 : 0.85 });
        emit('setting', key, v);
        return;
      }
      case 'swatch':
        save.setSetting('splatColor', b.dataset.color);
        syncSettings();
        sfx('click');
        emit('setting', 'splatColor', b.dataset.color);
        return;
      case 'settings': sfx('click'); pause(true, { fromMenu: true }); return;
      case 'resume':
        sfx('click');
        closePopup();
        emit('resume');
        return;
      case 'skipLevel':
        sfx('click', { pitch: 1.2 });
        emit('skip');
        return;
      default:
        sfx('click');
        emit(act);
    }
  }
  root.addEventListener('click', onClick);

  // Backdrop click closes the skins popup.
  layer.addEventListener('click', (e) => {
    if (e.target === layer && popupName === 'skins') {
      closePopup();
      emit('closeSkins');
    } else if (e.target === layer && popupName === 'daily') closePopup();
  });

  // ---------- daily login reward ----------

  function daily(model = {}) {
    const days = model.days || [];
    const grid = el('dailyGrid');
    const done = (d) => (model.claimable ? d < model.day : d <= model.day);
    grid.innerHTML = days.map((d) => {
      const w = d.weapon ? weaponById(d.weapon) : null;
      const cls = ['dtile', d.day === 7 ? 'big' : '', done(d.day) ? 'claimed' : '', model.claimable && d.day === model.day ? 'today' : ''].join(' ');
      return `<div class="${cls}" data-day="${d.day}"><span class="dt-day">DAY ${d.day}</span>${w ? `<canvas width="128" height="64" data-weapon="${esc(w.id)}"></canvas>` : ICON.dough}<b>${d.coins}</b>${w ? `<span class="dt-try">+ ${esc(w.name)} · ${RENT_LEVELS} LEVELS</span>` : ''}<i class="dt-check">✓</i></div>`;
    }).join('');
    grid.querySelectorAll('canvas[data-weapon]').forEach((c) => {
      const g = c.getContext('2d');
      try { g.save(); (iconPainter || placeholderWeaponIcon)(g, c.dataset.weapon, c.width, c.height); g.restore(); } catch (e) { /* ignore */ }
    });
    setText('dailySub', model.claimable ? `Day ${model.day} of 7 · miss a day and the streak restarts` : `Day ${model.day} claimed · next reward tomorrow`);
    el('dailyBtns').hidden = !model.claimable;
    const wait = el('dailyWait');
    wait.hidden = !!model.claimable;
    wait.textContent = 'Come back tomorrow!';
    openPopup('daily');
  }

  function dailyClaimed({ day = 1, coins = 0, weapon = null } = {}) {
    const tile = el('dailyGrid').querySelector(`.dtile[data-day="${day}"]`);
    if (tile) { tile.classList.remove('today'); tile.classList.add('claimed', 'just'); }
    el('dailyBtns').hidden = true;
    const wait = el('dailyWait');
    wait.hidden = false;
    wait.textContent = `+${coins} coins${weapon ? ` · ${weaponById(weapon).name} for ${RENT_LEVELS} levels` : ''}!`;
    setText('dailySub', `Day ${day} claimed · next reward tomorrow`);
    later(1600, () => { if (popupName === 'daily') closePopup(); });
  }

  function setDailyDot(on) {
    el('dailyDot').hidden = !on;
    el('dailyBtn').classList.toggle('ready', !!on);
  }

  const offSave = save.on('change', () => {
    refreshDough();
    refreshShops();
    if (popupName === 'skins') renderSkin();
  });

  function destroy() {
    clearTimers();
    clearTimeout(promptTimer);
    offSave();
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    root.removeEventListener('click', onClick);
    root.innerHTML = '';
    handlers.clear();
  }

  refreshShops();
  refreshDough();

  return {
    on, off, show, hud, prompt, setFighting, results, pause, pvpResult, daily, dailyClaimed, setDailyDot,
    closePopup,
    isPopupOpen: () => popupName !== null,
    popup: () => popupName,
    screen: () => screen,
    flashDough,
    refresh() { root.querySelectorAll('.shop-row').forEach((r) => { delete r.dataset.state; }); refreshShops(); refreshDough(); },
    /** This level's watch-an-ad weapon (null = none) and the level being played (rentals count down against it). */
    setOffer(id, level) {
      offerId = id || null;
      playLevel = Math.max(1, level | 0);
      root.querySelectorAll('.shop-row').forEach((r) => { delete r.dataset.state; });
      refreshShops();
    },
    /** Bounce a P1 shop row (after renting a weapon). */
    celebrate(id) {
      const row = el('list-p1').querySelector(`.shop-row[data-id="${id}"]`);
      if (!row) return;
      row.classList.remove('bought');
      void row.offsetWidth;
      row.classList.add('bought');
      if (row.scrollIntoView) row.scrollIntoView({ block: 'nearest' });
    },
    setIconPainter(fn) { iconPainter = typeof fn === 'function' ? fn : null; paintIcons(); },
    setSkinPainter(fn) { skinPainter = typeof fn === 'function' ? fn : null; if (popupName === 'skins') paintSkin(); },
    destroy,
  };
}

export default createUI;
