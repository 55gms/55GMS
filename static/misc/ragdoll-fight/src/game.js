// The real level scene: physics fighters + AI + arena, wired to the shell's fx / audio / ui hooks.
// Contract: see the top of main.js.

import { CONFIG } from './config.js';
import { createPhysics } from './physics.js';
import { Fighter, createCombat } from './fighter.js';
import { buildWeapon, updateWeapons } from './weapons.js';
import { createCamera, drawWorld, drawHat } from './render.js';
import { createInput } from './input.js';
import { createAI } from './ai.js';
import { enemySpec } from './enemies.js';
import { getLevel } from './levels.js';
import { buildArena } from './arena.js';
import { createHazards } from './hazards.js';
import { createBossKit } from './bosses.js';
import { createSpecials } from './specials.js';
import { skinById } from './catalog.js';

const ZERO = Object.freeze({ spin: 0, jump: false, kick: false, grab: false, grabPress: false });
const HOLD_INTENT = Object.freeze({ spin: 0, jump: false, kick: false, grab: true, grabPress: false });
const FIRE_STREAK = 3;        // fist hits in a row to ignite
const FIRE_STREAK_WINDOW = 2; // s between those hits
const FIRE_TIME = 4.5;        // s of burning fists
const FIRE_BONUS = 0.6;       // extra damage fraction while burning
const COMBO_WINDOW = 1.2;
const LOOSE_HAT = Object.freeze({ dead: true });   // knocked-off helmets draw with no wearer: eyes / LEDs / flames off

export function createLevelScene(opts = {}) {
  const mode = opts.mode === '2p' ? '2p' : '1p';
  const isPvp = mode === '2p';
  const levelNo = opts.level || 1;
  const services = opts.ctx || {};
  const { fx, audio, ui } = services;
  const hooks = opts.hooks || {};
  const sfx = (name, o) => { if (audio) audio.play(name, o); };

  const def = getLevel(levelNo);
  // enemies from level 10 on (bosses included) are toned down: less health, softer hits
  const LATE_NERF = levelNo > 9 ? { hp: 0.8, dmg: 0.7 } : { hp: 1, dmg: 1 };
  const physics = createPhysics(CONFIG);
  const arena = buildArena(physics, def.arena);
  const deathY = arena.deathY;
  const groundY = (x) => arena.floorAt(x) ?? 0;
  if (fx) fx.setFloor((x) => arena.floorAt(x));

  const st = { started: false, over: false, time: 0, combo: 0, comboT: 0, debris: [], lastBossHp: -1, promptT: 0, camInit: false, lastDrawT: 0 };
  const fighters = [];
  const enemies = [];
  const ais = new Map();
  let boss = null, bossSpec = null;

  // ---------------------------------------------------------------- feedback hooks
  const headPos = (f) => {
    const h = f.ragdoll.parts.head;
    const p = h && !h.__removed && !f.ragdoll.detached.head ? h.getPosition() : f.ragdoll.pelvis.getPosition();
    return { x: p.x, y: p.y };
  };

  /** "On fire" fists (players only): FIRE_TIME s of +FIRE_BONUS fist damage and much faster hand spin (f.spinBoost). */
  function igniteFists(f) {
    f._fire = FIRE_TIME; f._spinFullT = 0;
    const hp = headPos(f);
    fx?.popText(hp.x, hp.y + 0.7, 'ON FIRE!', { color: '#ff8a2a', size: 34 });
    sfx('fire', { volume: 0.9 });
  }

  function knockOffHelmet(f, e) {
    const hp = headPos(f);
    const r = f.ragdoll.dims.head;
    st.debris.push({ hat: f.hat, r, x: hp.x, y: hp.y + r * 0.4, vx: (e.attackerVel ? e.attackerVel.x * 0.25 : 0) + (Math.random() - 0.5) * 2, vy: 4 + Math.random() * 2, rot: 0, vr: (Math.random() - 0.5) * 14, t: 3.5 });
    f.hat = null;
    f.helmet = null;
    if (f.armour) delete f.armour.head;
    sfx('hit_metal', { pitch: 0.8 });
    fx?.sparks(hp.x, hp.y, { count: 12, color: '#f2eee6', speed: 7 });
    fx?.popText(hp.x, hp.y + 0.6, 'HELMET OFF!', { color: '#f2eee6', size: 26 });
  }

  let specials = null;   // premium weapon specials (created below, once the fighters exist)
  const phys = {
    onHit(e) {
      const { attacker, victim } = e;
      let dmg = e.damage;
      // hitting a body that was already dead: just a soft thud + a little splat, no crit / combo / shake / specials
      if (e.wasDead) {
        sfx(e.kind === 'blunt' || e.kind === 'chain' ? 'hit_wood' : 'hit_light', { volume: 0.5 });
        if (dmg > 4) fx?.splat(e.point.x, e.point.y, { size: Math.min(1.4, 0.35 + dmg * 0.04) });
        return;
      }
      if (specials) specials.onHit(e);

      // burning fists deal bonus damage
      if (e.source === 'fist' && attacker && attacker._fire > 0 && !victim.dead) {
        const extra = dmg * FIRE_BONUS;
        victim.applyHit({ ...e, damage: extra, isCrit: false });
        dmg += extra;
        fx?.sparks(e.point.x, e.point.y, { count: 10, color: '#ff8a2a', speed: 6 });
      }
      // fist streak -> ignite (players only; DESIGN.md §12 "On fire")
      if (e.source === 'fist' && attacker && !attacker.dead && (attacker === p1 || attacker === p2)) {
        attacker._streak = attacker._streakT > 0 ? (attacker._streak || 0) + 1 : 1;
        attacker._streakT = FIRE_STREAK_WINDOW;
        if (attacker._streak >= FIRE_STREAK && !(attacker._fire > 0)) igniteFists(attacker);
      }
      // helmets soak head hits until they fly off
      if (e.part === 'head' && victim.helmet && !victim.dead) {
        victim.helmet.hp -= dmg;
        if (victim.helmet.hp <= 0) knockOffHelmet(victim, e);
      }

      // sound
      // one body-hit sound per hit, a crit ping on top, and a crisp hitmarker (tick + icon) when a player lands it
      if (e.kind === 'explosion') sfx('hit_heavy', { pitch: 0.75, volume: 0.8 });
      else if (e.kind === 'hazard') sfx(dmg >= 10 ? 'hit_heavy' : 'hit_metal', { volume: 0.7 });
      else if (e.kind === 'blunt' || e.kind === 'chain') sfx(dmg >= 12 ? 'hit_heavy' : 'hit_wood');
      else sfx(dmg >= 11 ? 'hit_heavy' : 'hit_light');
      if (e.isCrit) sfx('crit', { volume: 0.8 });
      if (attacker && attacker.side !== 'enemy' && victim !== attacker && !e.wasDead) {   // no hitmarkers on bodies that are already down
        sfx('hitmarker', { pitch: e.isCrit ? 1.18 : 1, volume: e.isCrit ? 1 : 0.85 });
        fx?.hitmarker?.(e.point.x, e.point.y, { crit: e.isCrit });
      }
      if (e.kind === 'blade' && dmg >= 14) sfx('gore', { volume: 0.25 });

      // visuals
      const av = e.attackerVel || { x: 0, y: 0 };
      fx?.sparks(e.point.x, e.point.y, { count: Math.min(26, 4 + (dmg * 0.9) | 0), color: e.isCrit ? '#ffc23d' : '#f2eee6', speed: 5 + dmg * 0.25 });
      if (dmg > 4) fx?.splat(e.point.x, e.point.y, { size: Math.min(2.2, 0.45 + dmg * 0.06), dir: [av.x, av.y] });
      fx?.shake(Math.min(16, 2 + dmg * 0.45 + (e.isCrit ? 4 : 0)));
      if (dmg >= 10) fx?.hitstop(Math.min(75, dmg * 3.2));
      if (e.isCrit) fx?.popText(e.point.x, e.point.y + 0.5, 'CRIT!', { color: '#d8432f', size: 38 });

      // combo counter for the human player(s)
      if (attacker && attacker.side !== 'enemy' && victim !== attacker) {
        st.combo = st.comboT > 0 ? st.combo + 1 : 1;
        st.comboT = COMBO_WINDOW;
        if (st.combo >= 2) {
          const hp = headPos(victim);
          fx?.popText(hp.x + 0.5, hp.y + 0.9, `x${st.combo}`, { color: '#5fbf6a', size: 24 + Math.min(20, st.combo * 3) });
        }
      }
    },
    onKO(f, cause) {
      const hp = headPos(f);
      const aliveEnemies = enemies.filter((e) => !e.dead).length;
      const final = isPvp || f === p1 || aliveEnemies === 0;
      sfx('ko');
      fx?.shake(final ? 18 : 10);
      // slow-motion finishing shot: last enemy of a 1P level / the round-ending KO in 2P (falls off the map keep the plain OVERBOARD pop)
      if (cause !== 'fall' && !st.over && !st.finisher && (isPvp || (f !== p1 && aliveEnemies === 0 && !p1.dead))) { startFinisher(f); return; }
      if (final) fx?.slowmo(0.35, 850);
      fx?.popText(hp.x, hp.y + 0.8, cause === 'fall' ? 'OVERBOARD!' : 'K.O.!', { color: '#d8432f', size: final ? 54 : 38, life: 1.3 });
    },
    onDismember({ fighter, part, point }) {
      sfx('gore');
      fx?.splat(point.x, point.y, { size: 2 });
      fx?.sparks(point.x, point.y, { count: 14, color: '#d8432f', speed: 6 });
      if (part === 'head') {
        const rd = fighter.ragdoll;
        fx?.fountain(() => {
          const s = rd.parts.spine4;
          if (!s || s.__removed) return [point.x, point.y];
          const p = s.getWorldPoint(window.planck.Vec2(0, rd.dims.seg / 2));
          return [p.x, p.y];
        }, { duration: 1.5 });
      }
    },
    onSwing(f, speed) {
      if (st.time - (f._swingSfxT || -1) < 0.3) return;
      f._swingSfxT = st.time;
      sfx('swing', { volume: Math.min(0.55, 0.15 + speed / 60) * (f.side === 'enemy' ? 0.6 : 1), pitch: 0.8 + speed / 50 });
    },
    onJump() { sfx('jump', { volume: 0.5 }); },
    onKick() { sfx('kick'); },
    onGrab(f, what) { sfx('grab', { volume: what === 'world' ? 0.5 : 0.8 }); },
    onDrop() { sfx('grab', { volume: 0.5, pitch: 0.7 }); },
    onStick() { sfx('hit_heavy', { pitch: 0.7 }); },
    onClash(e) {
      sfx('hit_metal', { volume: 0.55 });
      fx?.sparks(e.point.x, e.point.y, { count: 8, color: '#ffc23d', speed: 6 });
    },
    // hazards: barrels / jars going off, and props (bag, crates) taking a whack
    onExplosion({ x, y, power }) {
      sfx('explosion', { volume: 0.9 });
      fx?.flash('#ffc23d', 90);
      fx?.shake(Math.min(26, 8 + power * 1.4));
      fx?.hitstop(45);
      fx?.sparks(x, y, { count: 34, color: '#ffc23d', speed: 9 + power * 0.4 });
      fx?.sparks(x, y, { count: 22, color: '#ff8a2a', speed: 6 + power * 0.3 });
      fx?.sparks(x, y, { count: 12, color: '#d8432f', speed: 4 });
    },
    onHazardHit(e) {
      sfx('hit_wood', { volume: Math.min(0.7, 0.25 + e.speed / 30), pitch: 0.85 });
      fx?.sparks(e.point.x, e.point.y, { count: 4, color: '#f2eee6', speed: 4 });
    },
  };
  // weapon upgrades (1P): hits with P1's loadout weapon deal +12% per upgrade level (createCombat scales knockback with damage).
  // Registered before createCombat so dmgMult is set for the hit being resolved; kicks, fists, pickups, rentals stay x1; 2P ignores upgrades.
  const upgradeSave = !isPvp && services.save && typeof services.save.upgradeMult === 'function' ? services.save : null;
  const offUpgrade = upgradeSave ? physics.onHit((evt) => {
    if (!evt.attacker || evt.attacker !== p1) return;
    const w = evt.source === 'weapon' ? evt.weapon : null;
    p1.dmgMult = w && w === p1._loadout ? upgradeSave.upgradeMult(w.id) : 1;
  }) : null;
  const combat = createCombat(physics, phys);

  // ---------------------------------------------------------------- fighters
  const skin = skinById(opts.skinId);
  const px = def.player.x;
  const p1 = new Fighter(physics, {
    x: px, y: def.player.y ?? groundY(px), facing: def.player.facing || 1, side: 'player', name: 'P1', hp: 100,   // y: exact feet height (converted levels with overhangs)
    weaponId: opts.weaponId || 'fists', skin: skin.id, hooks: phys, deathY,
  });
  fighters.push(p1);
  p1._loadout = p1.weapon;   // the shop weapon instance that carries the upgrade level (see offUpgrade above)

  let p2 = null;
  if (isPvp) {
    const x = def.enemies && def.enemies[0] ? def.enemies[0].x : -px;
    p2 = new Fighter(physics, {
      x, y: def.enemies && def.enemies[0] && def.enemies[0].yAbs != null ? def.enemies[0].yAbs : groundY(x), facing: -1, side: 'p2', name: 'P2', hp: 100,
      weaponId: opts.p2WeaponId || 'fists', color: '#bfe3b4', helmet: 'bandana_green', hooks: phys, deathY,
    });
    fighters.push(p2);
    p1.barColor = '#4a90e2';   // 2-player health bars: P1 blue, P2 red
    p2.barColor = '#d8432f';
  } else {
    // In fights with several enemies only the toughest one keeps its weapon; the others use their fists
    // (they can still grab loose weapons in the arena). Bosses always keep theirs.
    const entries = def.enemies || [];
    let armedIdx = -1;
    if (entries.length > 1) {
      let best = -1;
      entries.forEach((en, i) => { const sp = enemySpec(en); if (sp.hp > best) { best = sp.hp; armedIdx = i; } });
    }
    for (const [ei, entry] of entries.entries()) {
      const spec = enemySpec(entry);
      if (entries.length > 1 && ei !== armedIdx && !spec.boss) spec.weapon = 'fists';
      const f = new Fighter(physics, {
        x: entry.x, y: entry.yAbs ?? groundY(entry.x) + (entry.y || 0), facing: entry.facing || (entry.x > px ? -1 : 1),
        side: 'enemy', name: spec.name, hp: Math.round(spec.hp * def.hpScale * LATE_NERF.hp), weaponId: spec.weapon,
        color: spec.color, helmet: spec.hat || null, scale: spec.scale || 1, spinMult: spec.spinMult || 1, hooks: phys, deathY,
        armour: spec.helmet ? { head: spec.helmet.armour } : {},
      });
      f.helmet = spec.helmet ? { hp: spec.helmet.hp } : null;
      f.dmgMult = (spec.dmgMult || 1) * LATE_NERF.dmg;
      f.toughness = spec.toughness || 1;
      fighters.push(f);
      enemies.push(f);
      // AI sharpening follows progress through the game, not the raw number: with the original levels interleaved
      // there are ~1.8x as many levels, so level / 1.8 keeps our bosses near the AI they were tuned against
      ais.set(f, createAI(spec.ai, { level: def.aiLevel ?? Math.max(1, Math.round(levelNo / 1.8)), grabOnStart: !!entry.grabOnStart, grabTime: entry.grabTime, grabRelease: entry.grabRelease }));
      if (spec.boss && !boss) { boss = f; bossSpec = spec; }
    }
  }
  for (const l of def.loose || []) buildWeapon(physics, l.id, { x: l.x, y: l.y ?? groundY(l.x) + 0.25 }, l.angle || 0);
  const hazards = createHazards(physics, def.hazards || [], { hooks: phys, deathY });
  // bots flagged grabOnStart spawn already holding the nearest grabbable surface (pendulum / wheel / ledge); their AI keeps grab held
  // (a bot with nothing grabbable in reach — plain floor — just stands and waits; it never reaches for the ground)
  if (!isPvp) for (const [i, entry] of (def.enemies || []).entries()) if (entry.grabOnStart && enemies[i]) enemies[i]._holdStart = hazards.latch(enemies[i]) > 0;
  // boss signature attacks (cheese lobs / hammer slams / laser eyes / phases)
  specials = createSpecials({ physics, fighters: () => fighters, fx, sfx, hooks: phys });
  const bossKit = boss ? createBossKit(boss, bossSpec, { physics, arena, deathY, fx, sfx, hooks: phys, targets: () => fighters, dmgScale: LATE_NERF.dmg }) : null;

  const input = createInput({ mode });
  const camera = createCamera();

  // ---------------------------------------------------------------- prompts
  function preFightPrompt() {
    if (isPvp) return null;   // 2P controls are drawn above each player's health bar instead
    const foe = enemies[0];
    const dir = foe ? Math.sign(foe.x - p1.x) : 1;
    return { keys: [dir < 0 ? 'A' : 'D'], text: 'HOLD' };
  }
  hooks.onPrompt?.(preFightPrompt());
  if (boss) hooks.onBoss?.({ name: boss.name, hpRatio: 1 });

  function startFight() {
    st.started = true;
    hooks.onFightStart?.();
    if (def.tutorial === 'spin') {
      hooks.onPrompt?.({ keys: ['W', 'A', 'S', 'D', 'SPACE'], highlight: ['A', 'D'], cluster: true, text: 'SPIN', after: 'W jump · S kick · SPACE grab / drop' });
      st.promptT = 5;
    } else if (def.tutorial === 'grab') {
      hooks.onPrompt?.({ keys: ['SPACE'], text: 'PRESS', after: 'near a weapon to grab it · press again to drop' });
      st.promptT = 7;
    } else if (def.tutorial === 'climb') {
      hooks.onPrompt?.({ keys: ['SPACE'], text: 'HOLD', after: 'near a wall to grab it · W to climb up · A / D to pull yourself up' });
      st.promptT = 9;
    } else {
      hooks.onPrompt?.(null);
    }
  }

  function endLevel(win) {
    st.over = true;
    hooks.onPrompt?.(null);
    if (isPvp) return;
    if (boss && win) hooks.onBoss?.({ name: boss.name, hpRatio: 0 });
    sfx(win ? 'win' : 'lose', { volume: 0.8 });
    hooks.onResult?.({ win, healthRatio: Math.max(0, p1.hp / p1.maxHp), isBoss: !!boss, finisher: win && !!st.finisher });
  }

  // ---------------------------------------------------------------- update
  const anyInput = (i) => i.spin || i.jump || i.kick || i.grab || i.grabPress;

  function update(dt) {
    st.time += dt;
    const intents = input.consume();
    if (!st.started && !st.over) {
      const popup = ui && ui.isPopupOpen && ui.isPopupOpen();
      if (!popup && (anyInput(intents.p1) || (isPvp && anyInput(intents.p2)))) startFight();
    }
    const live = st.started && !st.over;

    p1.update(live ? intents.p1 : ZERO, dt);
    if (isPvp) {
      p2.update(live ? intents.p2 : ZERO, dt);
    } else {
      for (const e of enemies) {
        // before the fight starts, bots that spawn hanging on (wrecking ball / gear / tread) keep holding instead of dropping
        let it = live ? ais.get(e).intent(e, { foes: [p1], physics, hazards: hazards.list }, dt) : e._holdStart ? HOLD_INTENT : ZERO;
        if (live && bossKit && e === boss) it = bossKit.filter(it, p1);
        e.update(it, dt);
        if (!e.dead && !it.spin && !p1.dead) e.face(Math.sign(p1.x - e.x) || e.facing);
      }
    }

    hazards.update(dt);
    physics.step(dt);
    updateWeapons(physics, dt, deathY);
    if (bossKit) bossKit.update(dt, live);
    specials.update(dt);

    // timers: combo, fire, prompts
    st.comboT = Math.max(0, st.comboT - dt);
    if (st.promptT > 0) {
      st.promptT -= dt;
      if (st.promptT <= 0 || (def.tutorial === 'grab' && p1.weapon)) { st.promptT = 0; hooks.onPrompt?.(null); }
    }
    for (const f of fighters) {
      if (f._streakT > 0) f._streakT -= dt;
      // continuous full-speed empty-handed spinning also ignites (players only, not while hanging from a hold)
      if ((f === p1 || f === p2) && !f.dead && !f.weapon && !(f._fire > 0) && !f.hangingWorld
        && f.spinSpeed >= CONFIG.spin.armSpeedMax * (f.spinMult || 1) * 0.97) {
        f._spinFullT = (f._spinFullT || 0) + dt;
        if (f._spinFullT >= (CONFIG.spin.fireSpinTime ?? 3)) igniteFists(f);
      } else f._spinFullT = 0;
      if (f._fire > 0) {
        f._fire -= f.dead || f.weapon ? f._fire : dt;
        f._fireFx = (f._fireFx || 0) - dt;
        if (f._fireFx <= 0 && f._fire > 0) {
          f._fireFx = 0.03;
          // flame trail: particles left behind by the whirling fists + a lick along each forearm
          for (const hand of ['F', 'B']) {
            if (f.ragdoll.detached['foreArm' + hand]) continue;
            const hp = f.ragdoll.handPoint(hand), fa = f.ragdoll.parts['foreArm' + hand].getPosition();
            fx?.sparks(hp.x, hp.y, { count: 3, color: Math.random() < 0.5 ? '#ffc23d' : '#ff5a1a', speed: 1.6 });
            fx?.sparks((hp.x + fa.x) / 2, (hp.y + fa.y) / 2, { count: 1, color: '#ff8a2a', speed: 1.0 });
          }
        }
      }
      // on fire: the fists whirl much faster (fighter.js spin ramp + ragdoll.js shoulder torque); weapons put it out
      f.spinBoost = f._fire > 0 ? (CONFIG.spin.fireSpeedMult ?? 1.9) : 1;
    }

    // flying helmets
    for (const d of st.debris) {
      d.t -= dt; d.vy -= 16 * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.rot += d.vr * dt;
      const fy = arena.floorAt(d.x);
      if (fy !== null && d.y - d.r < fy && d.y > fy - 0.5 && d.vy < 0) { d.y = fy + d.r; d.vy *= -0.35; d.vx *= 0.6; d.vr *= 0.5; }
    }
    st.debris = st.debris.filter((d) => d.t > 0 && d.y > deathY - 4);

    // boss bar
    if (boss) {
      const r = Math.max(0, boss.hp / boss.maxHp);
      if (Math.abs(r - st.lastBossHp) > 0.004) { st.lastBossHp = r; hooks.onBoss?.({ name: boss.name, hpRatio: r }); }
    }

    // win / lose
    if (!st.over && st.started) {
      if (isPvp) {
        if (p1.dead || p2.dead) {
          st.over = true;
          hooks.onPrompt?.(null);
          hooks.onRoundEnd?.({ winner: p1.dead && p2.dead ? 'draw' : p1.dead ? 'p2' : 'p1', finisher: !!st.finisher });
        }
      } else if (p1.dead) endLevel(false);
      else if (enemies.every((e) => e.dead)) endLevel(true);
    }
  }

  // ---------------------------------------------------------------- draw
  function cameraTargets() {
    const alive = fighters.filter((f) => f.y > deathY + 0.5 && (!f.dead || f === p1));
    const list = alive.length ? alive : [p1];
    const pts = list.map((f) => f.pos);
    // before a 1P fight the weapon shop panel covers the left of the screen: frame a point left of the player
    // so the camera pans them out from under it (matters most on wide levels and short phone screens)
    if (!isPvp && !st.started) pts.push({ x: p1.x - 3.4, y: p1.y });
    if (isPvp && !st.started && p2) {
      // before a 2P round: pull the view out so both fighters (and the key hints over their heads)
      // sit in the open middle instead of under the two weapon-shop columns
      const mid = (p1.x + p2.x) / 2;
      for (const f of [p1, p2]) {
        const out = Math.sign(f.x - mid) || (f === p1 ? -1 : 1);
        pts.push({ x: f.x + out * 3.2, y: f.y }, { x: f.x, y: f.y + 2.6 });
      }
    }
    return pts;
  }

  // 2-player controls shown above each health bar before the round: W / A S D / hold-grab key (arrows + R-Shift for P2)
  const PVP_KEYS = [
    { top: 'W', mid: ['A', 'S', 'D'], hold: 'LEFT SHIFT', color: '#4a90e2' },
    { top: '↑', mid: ['←', '↓', '→'], hold: 'RIGHT SHIFT', color: '#d8432f' },
  ];
  function keyCap(c, x, y, w, h, label, accent) {
    c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.roundRect(x, y + 3, w, h, 6); c.fill();
    c.fillStyle = '#f2eee6'; c.beginPath(); c.roundRect(x, y, w, h, 6); c.fill();
    c.strokeStyle = accent; c.lineWidth = 2; c.stroke();
    c.fillStyle = '#23262e'; c.fillText(label, x + w / 2, y + h / 2 + 1);
  }
  function drawPvpKeys(c) {
    c.textAlign = 'center'; c.textBaseline = 'middle';
    [p1, p2].forEach((f, i) => {
      if (!f || f.dead) return;
      const rd = f.ragdoll, head = rd.parts.head;
      if (!head || head.__removed || rd.detached.head) return;
      const k = PVP_KEYS[i], hp = head.getPosition();
      const barTop = hp.y + rd.dims.head * (f.hat ? 2.25 : 1) + 0.42 * rd.scale;   // matches render.js drawHealthBars
      const [sx, sy] = camera.toScreen(hp.x, barTop);
      const cap = 26, gap = 4;
      let y = sy - cap;
      c.font = '700 11px "Baloo 2", system-ui, sans-serif';
      keyCap(c, sx - 48, y, 96, cap, k.hold, k.color);                              // bottom: hold-to-grab
      y -= cap + gap;
      c.font = '700 14px "Baloo 2", system-ui, sans-serif';
      const rowW = cap * 3 + gap * 2;
      k.mid.forEach((lbl, j) => keyCap(c, sx - rowW / 2 + j * (cap + gap), y, cap, cap, lbl, k.color));  // A S D
      y -= cap + gap;
      keyCap(c, sx - cap / 2, y, cap, cap, k.top, k.color);                          // top: W
    });
  }

  function draw(ctx, view) {
    const base = ctx.getTransform();
    const dt = Math.min(0.1, Math.max(0, view.time - st.lastDrawT));
    st.lastDrawT = view.time;
    if (st.camBase) { camera.x = st.camBase.x; camera.y = st.camBase.y; camera.zoom = st.camBase.zoom; st.camBase = null; }   // undo last frame's finisher zoom
    if (!st.camInit) { camera.snap(cameraTargets(), view); st.camInit = true; }
    else camera.follow(cameraTargets(), view, dt);
    const finT = finisherTime(), finK = finisherAmount(finT);
    if (finK > 0) {
      // finishing shot: pull the camera onto the victim / impact point on top of the normal framing (restored next frame)
      st.camBase = { x: camera.x, y: camera.y, zoom: camera.zoom };
      const F = st.finisher, v = F.f.pos;
      const zx = F.ix * 0.45 + v.x * 0.55, zy = F.iy * 0.45 + v.y * 0.55;
      const zoom = Math.min(camera.zoom * 2.4, Math.max(camera.zoom * 1.35, view.height / 5.5));
      camera.x += (zx - camera.x) * finK; camera.y += (zy - camera.y) * finK; camera.zoom += (zoom - camera.zoom) * finK;
    }

    drawWorld(ctx, view, {
      physics, fighters, camera, theme: st.themeOverride || def.theme, variant: st.themeOverride ? st.variantOverride : def.bgVariant || 0,
      before(c) {
        if (fx) { c.save(); c.setTransform(base); fx.drawDecals(c, camera); c.restore(); }
        hazards.draw(c);   // camera space: platforms / props behind loose weapons and fighters
      },
      after(c) {
        for (const d of st.debris) {
          c.save(); c.globalAlpha = Math.min(1, d.t); c.translate(d.x, d.y); c.rotate(d.rot); drawHat(c, d.hat, d.r, LOOSE_HAT); c.restore();
        }
        if (hazards.drawOver) hazards.drawOver(c);   // water surfaces in front of fighters
        if (bossKit) bossKit.draw(c);
        specials.draw(c);
        if (fx) { c.save(); c.setTransform(base); fx.drawParticles(c, camera); c.restore(); }
        // 2-player: controls float above each health bar until the round starts
        if (isPvp && !st.started) { c.save(); c.setTransform(base); drawPvpKeys(c); c.restore(); }
      },
    });
    if (finK > 0) drawFinisher(ctx, base, view, finK, finT);
  }

  // ---------------------------------------------------------------- slow-motion finishing shot
  // Runs on real time (so the curve is the same under the slow-mo it causes): snap in, hold, ease out; main waits FINISH_DELAY.
  const FIN = { dur: 1.35, in: 0.12, out: 0.4, slow: 0.12, font: '"Lilita One", "Baloo 2", "Arial Rounded MT Bold", system-ui, sans-serif' };
  function startFinisher(f) {
    const lh = f.lastHit && f.lastHit.point, p = f.pos;
    st.finisher = { f, t0: performance.now(), ix: lh ? lh.x : p.x, iy: lh ? lh.y : p.y + 0.4, text: isPvp ? 'K.O.!' : 'FINISHED!', fixedT: null };
    fx?.clearTexts?.();   // no "CRIT!" / "x3" sitting on top of the finishing title
    fx?.hitstop(90);
    fx?.slowmo(FIN.slow, FIN.dur * 1000);
    fx?.flash('#ffffff', 80);
  }
  function finisherTime() {
    const F = st.finisher;
    return !F ? Infinity : F.fixedT ?? (performance.now() - F.t0) / 1000;
  }
  function finisherAmount(t) {
    if (!(t < FIN.dur)) return 0;
    if (t < FIN.in) { const u = t / FIN.in; return 1 - (1 - u) ** 3; }
    const o = FIN.dur - FIN.out;
    if (t > o) { const u = (t - o) / FIN.out; return 1 - u * u * (3 - 2 * u); }
    return 1;
  }
  function drawFinisher(c, base, view, k, t) {
    const W = view.width, H = view.height;
    c.save();
    c.setTransform(base);
    const g = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.28, W / 2, H / 2, Math.hypot(W, H) * 0.6);
    g.addColorStop(0, 'rgba(8,6,10,0)');
    g.addColorStop(1, `rgba(8,6,10,${(0.65 * k).toFixed(3)})`);
    c.fillStyle = g;
    c.fillRect(-60, -60, W + 120, H + 120);
    const bar = H * 0.09 * k;   // letterbox
    c.fillStyle = '#0b0c0f';
    c.fillRect(-60, -60, W + 120, bar + 60);
    c.fillRect(-60, H - bar, W + 120, bar + 60);
    const u = t - 0.06;
    if (u > 0) {
      const pop = u < 0.1 ? 0.35 + (u / 0.1) : u < 0.2 ? 1.35 - ((u - 0.1) / 0.1) * 0.35 : 1 + (u - 0.2) * 0.04;
      const size = Math.round(Math.min(W * 0.12, H * 0.16));
      const text = st.finisher.text;
      c.globalAlpha = Math.max(0, Math.min(1, (FIN.dur - 0.05 - t) / 0.3));
      c.translate(W / 2, H * 0.3);
      c.rotate(-0.07);
      c.scale(pop, pop);
      c.font = `${size}px ${FIN.font}`;
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
      c.lineWidth = size * 0.16; c.strokeStyle = '#1d2027';
      c.strokeText(text, 0, size * 0.08); c.fillStyle = '#d8432f'; c.fillText(text, 0, size * 0.08);
      c.strokeText(text, 0, 0); c.fillStyle = '#ffc23d'; c.fillText(text, 0, 0);
    }
    c.restore();
  }

  // ---------------------------------------------------------------- contract
  function setWeapon(player, id) {
    if (st.started) return;
    const f = player === 'p2' ? p2 : p1;
    if (f) f.equip(id);
    if (f === p1) p1._loadout = p1.weapon;
  }

  function setSkin(player, id) {
    if (player === 'p2') return;
    const s = skinById(id);
    p1.skin = s; p1.color = s.body; p1.hat = s.hat;
  }

  function destroy() {
    input.destroy();
    if (offUpgrade) offUpgrade();
    combat.destroy();
    hazards.destroy();
    if (bossKit) bossKit.destroy();
    specials.destroy();
    for (const f of fighters) f.destroy();
    physics.destroy();
    st.debris.length = 0;
  }

  // ---------------------------------------------------------------- test hooks (console / automation)
  // hold: what the hands are gripping — 'static' (wall / floor), a hazard type (wheel, track, pendulum…), 'fighter', or ''
  const holdOf = (f) => {
    for (const h of ['F', 'B']) {
      const j = f.grips && f.grips[h];
      if (!j || j.__dead) continue;
      if (f.gripKind[h] === 'fighter') return 'fighter';
      const ud = j.getBodyA().getUserData() || {};
      return ud.kind === 'hazard' ? (ud.hazard ? ud.hazard.type : 'hazard') : ud.kind || 'world';
    }
    return '';
  };
  const brief = (f) => ({ name: f.name, hp: +f.hp.toFixed(1), x: +f.x.toFixed(2), y: +f.y.toFixed(2), dead: f.dead, weapon: f.weaponId, spin: +f.spinSpeed.toFixed(1), bal: +f.balance.toFixed(2), gr: f.grounded, hold: holdOf(f) });
  function debug() {
    return { time: +st.time.toFixed(2), started: st.started, over: st.over, p1: brief(p1), p2: p2 ? brief(p2) : null, enemies: enemies.map(brief), loose: [...physics.weapons].filter((w) => !w.holder).length, hazards: hazards.debug(), boss: bossKit ? bossKit.debug() : null, specials: specials.debug(),      looseAt: [...physics.weapons].filter((w) => !w.holder && !w.prop && w.body).map((w) => { const p = w.body.getPosition(); return [w.id, +p.x.toFixed(2), +p.y.toFixed(2)]; }) };
  }
  /** Step synchronously, ignoring rAF: sim(seconds, {spin, jump, kick, grab}). Edges fire on the first step. */
  function sim(seconds, p1Intent = {}) {
    const consume = input.consume;
    let first = true;
    input.consume = () => {
      const i = { spin: p1Intent.spin || 0, jump: first && !!p1Intent.jump, kick: first && !!p1Intent.kick, grab: !!p1Intent.grab, grabPress: first && !!p1Intent.grabPress };
      first = false;
      return { p1: i, p2: { ...ZERO } };
    };
    try { for (let k = Math.round(seconds / CONFIG.step); k > 0; k--) update(CONFIG.step); }
    finally { input.consume = consume; }
    return debug();
  }

  /** Test hook: set the boss's health to a fraction of max (e.g. to check Mamma Mia's phases). */
  function setBossHp(ratio) { if (boss && !boss.dead) boss.hp = boss.maxHp * ratio; return debug(); }
  /** Art test hooks: draw this level with another background theme/variant; restyle a fighter (index into enemies, or 'p1'). */
  function previewTheme(theme, variant = 0) { st.themeOverride = theme || null; st.variantOverride = variant | 0; }
  function previewLook(i, look = {}) {
    const f = i === 'p1' ? p1 : enemies[i];
    if (!f) return false;
    if (look.hat !== undefined) f.hat = look.hat;
    if (look.color) f.color = look.color;
    return true;
  }

  /** Test hook: freeze the finishing shot at t seconds (null = run on real time). Returns whether one is playing. */
  function finisherAt(t) { if (st.finisher) st.finisher.fixedT = t; return !!st.finisher; }

  return { update, draw, destroy, setWeapon, setSkin, camera, debug, sim, setBossHp, previewTheme, previewLook, finisherAt };
}

export default createLevelScene;
