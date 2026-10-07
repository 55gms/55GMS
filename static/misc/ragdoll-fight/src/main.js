// Ragdoll Fight — Pizza Edition : boot, fixed-step loop, scene manager.
//
// ============================================================== SCENE CONTRACT
// A level scene module exports:
//
//   createLevelScene({ mode:'1p'|'2p', level, weaponId, p2WeaponId, skinId, ctx: {fx, audio, save, ui}, hooks })
//   returns { update(dt), draw(ctx, view), destroy(), setWeapon(player, id), [setSkin(player, id)], [camera] }
//
//   hooks: onResult({win, healthRatio, isBoss, finisher})   1P: level finished (main shows results after a short delay;
//                                                      finisher = the slow-motion finishing shot is playing → longer delay)
//          onBoss({name, hpRatio})                    boss banner + HP bar (hpRatio 0..1); call again to update
//          onPrompt(p | null)                         tutorial prompt, p = {keys:['D'], text:'HOLD', highlight, cluster, after}
//          onFightStart()                             first player input: hides the shops
//          onRoundEnd({winner:'p1'|'p2'|'draw', finisher})   2P: round finished
//
//   update(dt)     fixed step, dt = 1/60 s of *game* time. Main already applies fx.timeScale() (hitstop/slow-mo)
//                  and the 2x toggle by running more/fewer steps. Not called while paused.
//   draw(ctx, view) view = {width, height, dpr, time}. ctx is pre-scaled to CSS pixels and already translated
//                  by the screen-shake offset. The scene draws background/arena/fighters and calls
//                  ctx.fx.drawDecals(ctx, camera) / drawParticles(ctx, camera) (or drawWorld) itself.
//   camera         optional {toScreen(x,y)->[sx,sy], scale}; main uses it for fx.drawScreen (pop texts).
//   setWeapon(player, id)   player 'p1' | 'p2'; called when a weapon is equipped before the fight starts.
//   setSkin(player, id)     optional; if missing, main rebuilds the scene when the skin changes pre-fight.
//   destroy()      remove listeners / physics world. Main calls fx.clear() between scenes.
//
// Weapon upgrades (save.upgradeMult) are applied by the scene to P1's loadout weapon in 1P only.
//
// The scene is loaded from ./game.js (Phase 3); if that import fails or lacks createLevelScene we fall back
// to ./scenes/mock-level.js. Force the mock with ?mock=1.
// =============================================================================

import * as save from './save.js';
import * as audio from './audio.js';
import { createFx } from './fx.js';
import { createUI } from './ui.js';
import { drawWeaponIcon } from './weapons.js';
import { drawSkinPreview } from './render.js';
import * as ads from './ads.js';
import { WEAPONS } from './catalog.js';

const STEP = 1 / 60;
const MAX_STEPS = 8;
const RESULT_DELAY = 950;   // ms after onResult / onRoundEnd before the popup shows
const FINISH_DELAY = 1650;  // ... when the slow-motion finishing shot plays (it lasts ~1.35 s real time)
const PVP_TARGET = 3;
const BG = '#23262e';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const view = { width: 0, height: 0, dpr: 1, time: 0 };

save.load();
const fx = createFx();
const ui = createUI(document.getElementById('ui'), { save, audio });
ui.setIconPainter((g, id, w, h) => drawWeaponIcon(g, id, w, h));
ui.setSkinPainter((g, skin, w, h) => drawSkinPreview(g, skin && skin.id ? skin.id : skin, w, h));

// rewarded ads: freeze the fight and the sound while one plays
let pausedBeforeAd = false;
ads.setHooks({
  pause() { pausedBeforeAd = state.paused; setPaused(true); audio.setMuted(true); },
  resume() { audio.setMuted(null); setPaused(pausedBeforeAd || ui.popup() === 'pause'); },
});

const state = {
  mode: 'menu', // 'menu' | '1p' | '2p'
  scene: null,
  sceneFactory: null,
  sceneSource: null,
  level: 1,
  fighting: false,
  finished: false,
  paused: false,
  score: [0, 0],
  pvpLevel: 1,
  pendingTimer: null,
};

// ------------------------------------------------------------------ canvas sizing

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, window.innerWidth);
  const h = Math.max(1, window.innerHeight);
  view.width = w;
  view.height = h;
  view.dpr = dpr;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 120));
resize();

// ------------------------------------------------------------------ scene loading

async function loadSceneFactory() {
  if (state.sceneFactory) return state.sceneFactory;
  const forceMock = /[?&]mock=1\b/.test(location.search);
  if (!forceMock) {
    try {
      const mod = await import('./game.js');
      if (typeof mod.createLevelScene === 'function') {
        state.sceneFactory = mod.createLevelScene;
        state.sceneSource = 'game';
        return state.sceneFactory;
      }
      console.warn('[main] game.js has no createLevelScene export — using mock level');
    } catch (e) {
      console.info('[main] game.js not available, using mock level.', e && e.message ? e.message : e);
    }
  }
  const mock = await import('./scenes/mock-level.js');
  state.sceneFactory = mock.createLevelScene;
  state.sceneSource = 'mock';
  return state.sceneFactory;
}

async function createScene(opts) {
  const factory = await loadSceneFactory();
  try {
    return factory(opts);
  } catch (e) {
    if (state.sceneSource === 'game') {
      console.error('[main] game.js createLevelScene threw — falling back to mock level', e);
      const mock = await import('./scenes/mock-level.js');
      state.sceneFactory = mock.createLevelScene;
      state.sceneSource = 'mock';
      return state.sceneFactory(opts);
    }
    throw e;
  }
}

function destroyScene() {
  clearTimeout(state.pendingTimer);
  state.pendingTimer = null;
  if (state.scene) {
    try { state.scene.destroy(); } catch (e) { console.error('[main] scene.destroy failed', e); }
  }
  state.scene = null;
  fx.clear();
  ui.prompt(null);
}

// ------------------------------------------------------------------ rewards (DESIGN.md §13 Economy)

export function slicesFor(healthRatio) {
  if (healthRatio >= 0.7) return 3;
  if (healthRatio >= 0.35) return 2;
  return 1;
}

export const BOSS_BONUS = 3;     // first boss clear pays x3
export const REPLAY_RATE = 0.25; // beating a level below your saved progress pays 25%, no boss bonus (ad-skipped levels count as replays)

/** Coins for a win: (40 + 7L + 0.06L²) × crown factor (1 crown 0.7, 2 = 0.85, 3 = 1.0); x3 first boss clear, x0.25 replays. */
export function rewardFor(level, crowns, isBoss, firstClear = true) {
  const L = Math.max(1, level | 0);
  const c = Math.max(1, Math.min(3, crowns | 0));
  const base = (40 + 7 * L + 0.06 * L * L) * (0.55 + 0.15 * c);
  const mult = firstClear ? (isBoss ? BOSS_BONUS : 1) : REPLAY_RATE;
  return Math.max(5, Math.round((base * mult) / 5) * 5);
}

// ------------------------------------------------------------------ 1P flow

let startToken = 0;

async function startLevel(level) {
  const token = ++startToken;
  destroyScene();
  state.mode = '1p';
  state.level = Math.max(1, level | 0);
  state.fighting = false;
  state.finished = false;
  setPaused(false);
  save.pruneRentals(state.level);   // ad weapons run out after 5 levels
  ui.show('level');
  ui.hud({ level: state.level, dough: save.get().dough, bossName: null });
  ui.setOffer(ads.offerFor(state.level, save.get()), state.level);

  const s = save.get();
  const hooks = {
    onFightStart() {
      if (token !== startToken || state.fighting) return;
      state.fighting = true;
      ui.setFighting(true);
      ads.gameplayStart();
    },
    onPrompt(p) {
      if (token === startToken) ui.prompt(p || null);
    },
    onBoss(b) {
      if (token !== startToken) return;
      if (!b || !b.name) ui.hud({ bossName: null });
      else ui.hud({ bossName: b.name, bossHp: b.hpRatio ?? 1 });
    },
    onResult(r) {
      if (token !== startToken || state.finished) return;
      state.finished = true;
      finishLevel(r || {});
    },
    onRoundEnd() {},
  };

  const scene = await createScene({
    mode: '1p',
    level: state.level,
    weaponId: s.equippedWeapon,
    p2WeaponId: null,
    skinId: s.equippedSkin,
    ctx: { fx, audio, save, ui },
    hooks,
  });
  if (token !== startToken) { scene.destroy(); return; }
  state.scene = scene;
}

function finishLevel({ win = false, healthRatio = 0, isBoss = false, finisher = false }) {
  const level = state.level;
  state.lastWin = !!win;
  ads.gameplayStop();
  const hr = Math.max(0, Math.min(1, Number(healthRatio) || 0));
  const slices = win ? slicesFor(hr) : 0;
  const firstClear = save.get().level <= level;   // levels below your progress (replays, or ones you skipped) pay the replay rate
  const reward = win ? rewardFor(level, slices, isBoss, firstClear) : 0;
  const note = !win ? '' : !firstClear ? `REPLAY ×${REPLAY_RATE}` : isBoss ? `BOSS BONUS ×${BOSS_BONUS}` : '';
  if (win) {
    save.addDough(reward);
    if (save.get().level <= level) save.setLevel(level + 1);
    save.addStat('wins');
    if (isBoss) save.addStat('bossesBeaten');
  } else {
    save.addStat('losses');
  }
  state.pendingTimer = setTimeout(() => {
    state.pendingTimer = null;
    ui.results({ win, healthRatio: hr, slices, reward, isBoss, note });
  }, finisher ? FINISH_DELAY : RESULT_DELAY);
}

// ------------------------------------------------------------------ 2P flow

import { ARENA_LEVELS } from './levels.js';
function randomArenaLevel() {
  // any level without a boss (original Ragdoll Hit arenas and ours)
  const pool = ARENA_LEVELS.filter((n) => n !== state.pvpLevel);
  return pool[Math.floor(Math.random() * pool.length)] || 1;
}

function startMatch() {
  state.score = [0, 0];
  startRound();
}

async function startRound(sameArena = false) {
  const token = ++startToken;
  destroyScene();
  state.mode = '2p';
  state.fighting = false;
  state.finished = false;
  setPaused(false);
  if (!sameArena) state.pvpLevel = randomArenaLevel();
  ui.show('pvp');
  ui.hud({ score: state.score, dough: save.get().dough });

  const s = save.get();
  const hooks = {
    onFightStart() {
      if (token !== startToken || state.fighting) return;
      state.fighting = true;
      ui.setFighting(true);
    },
    onPrompt(p) { if (token === startToken) ui.prompt(p || null); },
    onBoss() {},
    onResult() {},
    onRoundEnd(r) {
      if (token !== startToken || state.finished) return;
      state.finished = true;
      const winner = r && (r.winner === 'p1' || r.winner === 'p2') ? r.winner : 'draw';
      if (winner === 'p1') state.score[0]++;
      if (winner === 'p2') state.score[1]++;
      ui.hud({ score: state.score });
      const matchOver = Math.max(...state.score) >= PVP_TARGET;
      if (matchOver) save.addStat('pvpMatches');
      state.pendingTimer = setTimeout(() => {
        state.pendingTimer = null;
        ui.pvpResult({ winner, score: state.score.slice(), matchOver });
      }, r && r.finisher ? FINISH_DELAY : RESULT_DELAY);
    },
  };

  const scene = await createScene({
    mode: '2p',
    level: state.pvpLevel,
    weaponId: s.pvp.p1Weapon,
    p2WeaponId: s.pvp.p2Weapon,
    skinId: s.equippedSkin,
    ctx: { fx, audio, save, ui },
    hooks,
  });
  if (token !== startToken) { scene.destroy(); return; }
  state.scene = scene;
}

// ------------------------------------------------------------------ daily login reward

const DAILY_COINS = [100, 150, 250, 350, 500, 700, 1500];   // day 1..7 at level 1-10; x1.25 more every 10 levels of progress
const RENT_PREMIUM = 10000;                                // day 7 also lends the priciest weapon ≥ this you don't own
const dailyScale = (level) => 1 + Math.floor((Math.max(1, level) - 1) / 10) * 0.25;

function dailyTryWeapon(s) {
  const pool = WEAPONS.filter((w) => w.price >= RENT_PREMIUM && !s.ownedWeapons.includes(w.id)).sort((a, b) => b.price - a.price);
  return pool.length ? pool[0].id : null;
}

function dailyModel() {
  const s = save.get();
  const st = save.dailyStatus();
  const k = dailyScale(s.level);
  const tryId = dailyTryWeapon(s);
  const days = DAILY_COINS.map((c, i) => ({
    day: i + 1,
    coins: Math.round((c * k * (i === 6 && !tryId ? 2 : 1)) / 50) * 50,   // no weapon left to lend: day 7 pays double coins
    weapon: i === 6 ? tryId : null,
  }));
  return { ...st, days };
}

function refreshDailyDot() { ui.setDailyDot(save.dailyStatus().claimable); }

function maybeShowDaily() {
  if (state.mode !== 'menu') return;
  const st = save.dailyStatus();
  ui.setDailyDot(st.claimable);
  if (st.claimable && !ui.isPopupOpen() && save.markDailySeen()) ui.daily(dailyModel());
}

let dailyBusy = false;
ui.on('daily', () => ui.daily(dailyModel()));
ui.on('dailyClaim', async (double) => {
  if (dailyBusy || ads.isBusy()) return;
  const model = dailyModel();
  if (!model.claimable) return;
  if (double) {
    dailyBusy = true;
    const ok = await ads.showRewarded();
    dailyBusy = false;
    if (!ok || ui.popup() !== 'daily') return;
  }
  const day = save.claimDaily();
  if (!day) return;
  const r = model.days[day - 1];
  const coins = r.coins * (double ? 2 : 1);
  save.addDough(coins);
  if (r.weapon && save.rent(r.weapon, save.get().level + ads.RENT_LEVELS)) save.equip('weapon', r.weapon);
  audio.play('coin');
  ui.flashDough(coins);
  ui.dailyClaimed({ day, coins, weapon: r.weapon });
  refreshDailyDot();
});

// ------------------------------------------------------------------ menu / pause

function goMenu() {
  startToken++;
  destroyScene();
  state.mode = 'menu';
  state.fighting = false;
  setPaused(false);
  ui.show('menu');
  maybeShowDaily();
}

function setPaused(p) {
  state.paused = !!p;
}

function openPause() {
  if (state.mode === 'menu') return;
  if (ui.isPopupOpen()) return;
  setPaused(true);
  ui.pause(true);
}

function closePause() {
  setPaused(false);
  ui.pause(false);
}

// ------------------------------------------------------------------ UI wiring

ui.on('play1p', () => startLevel(save.get().level));
ui.on('play2p', () => startMatch());
ui.on('restart', () => {
  if (state.mode === '1p') startLevel(state.level);
  else if (state.mode === '2p') startRound(true);
});
ui.on('switchMode', () => {
  if (state.mode === '1p') startMatch();
  else if (state.mode === '2p') startLevel(save.get().level);
});
ui.on('pause', openPause);
ui.on('resume', () => setPaused(false));
ui.on('menu', goMenu);
ui.on('retry', () => startLevel(state.level));
ui.on('next', () => startLevel(Math.max(save.get().level, state.level + 1)));
ui.on('skip', async () => {
  if (state.mode !== '1p' || ads.isBusy()) return;   // HUD skip-level button + lose-popup Skip: watch an ad first
  const level = state.level;
  if (!(await ads.showRewarded()) || state.mode !== '1p' || state.level !== level) return;
  const next = level + 1;
  if (save.get().level < next) save.setLevel(next);
  startLevel(next);
});
ui.on('adCoins', async () => {   // HUD "+100" pill
  if (state.mode !== '1p' || ads.isBusy()) return;
  if (!(await ads.showRewarded())) return;
  save.addDough(100);
  ui.flashDough(100);
  audio.play('coin');
});
ui.on('adRent', async (id) => {   // yellow shop row: watch an ad, use the weapon for the next RENT_LEVELS levels
  if (state.mode !== '1p' || state.fighting || ads.isBusy()) return;
  const level = state.level;
  if (!(await ads.showRewarded()) || state.mode !== '1p' || state.level !== level) return;
  save.rent(id, level + ads.RENT_LEVELS);
  audio.play('coin');
  if (!state.fighting && save.equip('weapon', id) && state.scene) {
    try { state.scene.setWeapon('p1', id); } catch (e) { console.error('[main] setWeapon failed', e); }
  }
  ui.refresh();
  ui.celebrate(id);
});
ui.on('nextRound', () => startRound());
ui.on('rematch', () => startMatch());

ui.on('equipWeapon', (id, player) => {
  if (!state.scene || state.fighting) return;
  try { state.scene.setWeapon(player || 'p1', id); } catch (e) { console.error('[main] setWeapon failed', e); }
});
// upgradeWeapon(id, level): nothing to rebuild — the scene reads save.upgradeMult() when the weapon lands a hit

ui.on('equipSkin', (id) => {
  if (!state.scene || state.fighting) return;
  if (typeof state.scene.setSkin === 'function') {
    try { state.scene.setSkin('p1', id); } catch (e) { console.error('[main] setSkin failed', e); }
  } else if (state.mode === '1p') {
    startLevel(state.level).then(() => {});
  }
});

window.addEventListener('keydown', (e) => {
  const code = e.code || (e.key === ' ' ? 'Space' : e.key && e.key.length === 1 ? `Key${e.key.toUpperCase()}` : e.key);
  // results screen: Space = next level after a win, restart after a loss
  if (code === 'Space' && !e.repeat && state.mode === '1p' && state.finished && !state.paused && ui.isPopupOpen() && ui.popup() !== 'skins') {
    e.preventDefault();
    if (state.lastWin) startLevel(Math.max(save.get().level, state.level + 1));
    else startLevel(state.level);
    return;
  }
  if (code === 'Escape' || code === 'KeyP') {
    if (state.mode === 'menu') {
      if (ui.popup() === 'pause') ui.pause(false);
      else if (ui.popup() === 'daily') ui.closePopup();
      return;
    }
    if (ui.popup() === 'pause') closePause();
    else if (ui.popup() === 'skins') ui.closePopup();
    else if (!ui.isPopupOpen()) openPause();
    e.preventDefault();
    return;
  }
  // Keep game keys from scrolling or re-activating a focused button.
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.code)) {
    const t = e.target;
    const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA');
    if (!typing) e.preventDefault();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.mode !== 'menu' && !ui.isPopupOpen()) openPause();
  if (!document.hidden && state.mode === 'menu') maybeShowDaily();   // came back to the tab on a new day
});

// Prevent the context menu / double-tap zoom from interrupting play on touch devices.
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

// ------------------------------------------------------------------ main loop

let last = performance.now();
let acc = 0;
let drawErrorLogged = false;
let updateErrorLogged = false;

function frame(now) {
  requestAnimationFrame(frame);
  let realDt = (now - last) / 1000;
  last = now;
  if (!(realDt > 0)) realDt = 0;
  if (realDt > 0.25) realDt = 0.25;
  view.time += realDt;

  if (!state.paused) {
    fx.update(realDt);
    const scene = state.scene;
    if (scene) {
      acc += realDt * fx.timeScale();
      let steps = 0;
      while (acc >= STEP && steps < MAX_STEPS && state.scene === scene) {
        try {
          scene.update(STEP);
        } catch (e) {
          if (!updateErrorLogged) { console.error('[main] scene.update failed', e); updateErrorLogged = true; }
        }
        acc -= STEP;
        steps++;
      }
      if (steps >= MAX_STEPS) acc = Math.min(acc, STEP);
    } else {
      acc = 0;
    }
  }

  draw();
}

function draw() {
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, view.width, view.height);
  const scene = state.scene;
  if (!scene) return;
  const [dx, dy] = fx.shakeOffset();
  ctx.save();
  ctx.translate(dx, dy);
  try {
    scene.draw(ctx, view);
  } catch (e) {
    if (!drawErrorLogged) { console.error('[main] scene.draw failed', e); drawErrorLogged = true; }
  }
  ctx.restore();
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  fx.drawScreen(ctx, scene.camera || null);
}

// ------------------------------------------------------------------ boot

ui.show('menu');
maybeShowDaily();
requestAnimationFrame(frame);
loadSceneFactory(); // warm the import so the first level starts instantly
ads.loadingFinished();

// Debug handle for the console / Phase 3 integration.
window.__rf = {
  save, audio, fx, ui, state, startLevel, startMatch, goMenu, rewardFor, dailyModel, maybeShowDaily,
  /** Force one fx tick + draw (the pane doesn't run rAF while hidden). */
  renderNow() { fx.update(1 / 60, 1); draw(); },
};
