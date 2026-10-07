// Boss signature attacks, layered on top of the normal boss AI (enemies.js `special`).
//   cheese    – The Big Cheese: a wedge appears in the off-hand, gets whipped at you, bounces and hurts
//   slam      – Sir Pepperoni: leaps with the giant hammer; the landing shockwave launches anyone on the floor
//   laser     – Oven Lord: eyes charge (glow + aim line, aim locks), then a 3-pulse laser burst
//   snowball  – Snowball Sam: off-hand snowballs that freeze you (slow spin) for a moment
//   icicles   – Brain Freeze: marks spots under you, icicles drop from the sky
//   anchor    – Captain Anchovy: hurls an anchor on a chain; if it hooks you, you get yanked in
//   tentacles – Calamari King: the floor ripples under you, then tentacles burst up
//   flame     – Hot Sauce: fire-breath cone
//   meteors   – Chili Colossus: warning circles, fireballs rain down and explode
//   gust      – Windbag: inhales, then a huge wind blast shoves you away (hold on to a wall!)
//   lightning – Thunder Crust: 3 marked lightning strikes at your position
//   teleport  – Glitch: glitches out, reappears behind you and swings
//   rockets   – Mecha Mozzarella: slow homing rockets; smack one with a weapon / spinning fist to send it back
//   gravity   – Zero-G: gravity pulse lifts you helplessly, then slams you down
//   emperor   – Emperor Crust: alternates orbiting saw-discs flung at you and expanding shock rings to jump over
//   forge / blizzard / kraken / inferno / tempest / overclock / void – remixed bosses 190-250: phase cycles and combos of
//             the moves above, plus 'quake' (slam + shock rings); see REMIX_BOSS_TUNE
// createBossKit(boss, spec, {physics, arena, deathY, fx, sfx, hooks, targets, dmgScale})
//   -> { filter(intent, foe), update(dt, live), draw(ctx), debug(), destroy() }
// Damage goes straight to fighter.applyHit + hooks.onHit (never hurts enemies). Draw runs in camera space (metres, y-up).
import { CAT, ALL, V } from './physics.js';
import { weaponPoint } from './weapons.js';

export const BOSS_TUNE = {
  start: 2.0,   // s into the fight before the first special
  cheese:    { cd: [2.4, 3.4], wind: 0.5, swing: 0.14, gap: 0.4, recover: 0.35, damage: 10, hitSpeed: 2.5, life: 3.2, size: 0.37, restitution: 0.55 },
  snowball:  { cd: [3.2, 4.4], wind: 0.45, swing: 0.14, gap: 0.4, recover: 0.35, damage: 8, hitSpeed: 2.5, life: 3.0, size: 0.24, restitution: 0.25, freeze: 0.9, slow: 0.6 },
  slam:      { cd: [3.4, 4.6], wind: 0.65, leapVy: 8.5, leapVx: 2.8, maxAir: 1.8, recover: 0.8, radius: 4.6, damage: 18, launchVx: 5, launchVy: 8.5, range: 9 },
  laser:     { cd: [3.6, 4.8], wind: 1.0, track: 0.62, pulses: 3, gap: 0.24, beam: 0.12, recover: 0.45, damage: 8, range: 26, knock: 2.4 },
  icicles:   { cd: [3.8, 5.0], wind: 0.7, count: 4, gap: 0.45, warn: 0.75, height: 9, fall: 20, radius: 0.55, damage: 11, recover: 0.3 },
  tentacles: { cd: [3.8, 5.0], wind: 0.6, count: 3, gap: 0.6, warn: 0.8, rise: 0.65, radius: 0.65, height: 2.6, damage: 12, launch: 9, recover: 0.3 },
  meteors:   { cd: [5.0, 6.2], wind: 0.7, count: 4, gap: 0.32, warn: 0.95, fallTime: 0.45, spread: 4, radius: 1.5, damage: 14, knock: 7, recover: 0.3 },
  lightning: { cd: [3.6, 4.8], wind: 0.6, count: 3, gap: 0.55, warn: 0.65, radius: 0.75, damage: 11, recover: 0.3 },
  anchor:    { cd: [4.2, 5.4], wind: 0.6, speed: 15, range: 10, hookR: 0.55, damage: 7, yank: 8, hold: 0.3, recover: 0.5, maxWait: 2.2 },
  flame:     { cd: [4.0, 5.2], wind: 0.55, dur: 0.9, range: 3.6, cone: 0.42, tick: 0.2, damage: 3, recover: 0.4 },
  gust:      { cd: [4.0, 5.2], wind: 0.9, dur: 1.5, range: 14, accel: 18, damage: 4, recover: 0.5 },
  teleport:  { cd: [3.4, 4.6], wind: 0.55, behind: 1.7, strike: 0.9 },
  rockets:   { cd: [4.4, 5.6], wind: 0.6, count: 2, speed: 5.5, turn: 2.2, life: 5.5, radius: 1.6, damage: 10, deflectDamage: 30, recover: 0.4 },
  gravity:   { cd: [4.6, 5.8], wind: 0.8, lift: 1.4, liftAccel: 17, maxVy: 3.2, slamVy: 15, land: 1.5, damage: 12, recover: 0.6, range: 16 },
  emperor:   { cd: [3.0, 4.0], discWind: 1.1, discs: 3, discGap: 0.3, discSpeed: 11, discR: 0.4, discDamage: 11, discLife: 2.6, orbit: 2.3,
               novaCount: 2, novaGap: 0.7, novaSpeed: 7.5, novaRange: 12, novaDamage: 12, recover: 0.4 },
};
// ---- remixed bosses (levels 190-250, enemies.js `special` = key below). Each one cycles existing moves by phase
// (phase 2 at 66% hp, final phase at 33%, like Mamma Mia); cd = cooldown multiplier per phase.
// 'a>b' is a combo: b starts `link` s after a ends. 'quake' is a new move: a hammer slam whose landing also sends
// out two expanding shock rings (the emperor's nova rings) you have to jump over. Existing bosses never read this.
export const REMIX_BOSS_TUNE = {
  forge:     { link: 0.3, cd: [0.9, 0.8, 0.65], phases: [['slam', 'laser'], ['quake', 'laser'], ['quake>laser', 'quake']] },
  blizzard:  { link: 0.3, cd: [0.85, 0.75, 0.62], phases: [['icicles', 'snowball'], ['snowball>icicles', 'icicles'], ['snowball>icicles', 'icicles>snowball']] },
  kraken:    { link: 0.25, cd: [0.85, 0.75, 0.62], phases: [['tentacles', 'anchor'], ['anchor>tentacles', 'tentacles'], ['anchor>tentacles', 'tentacles>anchor']] },
  inferno:   { link: 0.3, cd: [0.8, 0.7, 0.6], phases: [['meteors', 'flame'], ['flame>meteors', 'meteors'], ['meteors>flame', 'quake>meteors']] },
  tempest:   { link: 0.2, cd: [0.8, 0.7, 0.58], phases: [['lightning', 'gust'], ['gust>lightning', 'lightning'], ['gust>lightning', 'lightning>gust']] },
  overclock: { link: 0.25, cd: [0.8, 0.7, 0.55], phases: [['rockets', 'teleport'], ['teleport', 'rockets>teleport'], ['rockets>teleport', 'teleport>laser']] },
  void:      { link: 0.25, cd: [0.8, 0.68, 0.55], phases: [['discs', 'nova'], ['gravity>nova', 'discs'], ['gravity>nova', 'discs>rockets', 'quake']] },
};
const MAMMA_PHASES = [null, ['cheese'], ['laser', 'cheese'], ['slam', 'laser', 'cheese']];
const RAIN = new Set(['icicles', 'tentacles', 'meteors', 'lightning']);
const DEFAULT_EYES = [[0.3, 0.18], [0.68, 0.18]];   // head-frame eye spots (see render.js drawFighter)
const rand = (a, b) => a + Math.random() * (b - a);
const TAU = Math.PI * 2;
const CHEESE = '#ffd35a', RIND = '#e39b2d', HOLE = '#e8a92e', INK = '#23262e';

export function createBossKit(boss, spec = {}, o = {}) {
  const { physics, arena, fx } = o;
  const sfx = o.sfx || (() => {});
  const hooks = o.hooks || {};
  const dmgScale = (o.dmgScale ?? 1) * (spec.specialDmg || 1);   // specialDmg: remixed bosses only
  const deathY = o.deathY ?? -20;
  const special = spec.special || null;
  const remix = REMIX_BOSS_TUNE[special] || null;
  const eyes = spec.eyes || DEFAULT_EYES;
  const st = { clock: 0, next: BOSS_TUNE.start, phase: 1, cycle: 0 };
  const stats = { cheese: 0, cheeseHits: 0, slams: 0, slamHits: 0, lasers: 0, laserHits: 0, damage: 0, moves: {}, hits: {} };
  let act = null;
  const projectiles = [], beams = [], waves = [];
  const strikes = [], missiles = [], novas = [], ghosts = [];
  const frozen = new Map(), lifted = new Map();

  const foes = () => (o.targets ? o.targets() : []).filter((f) => f.side !== 'enemy' && !f.dead);
  const nearestFoe = () => { let best = null, bd = Infinity; for (const f of foes()) { const d = Math.abs(f.x - boss.x); if (d < bd) { bd = d; best = f; } } return best; };
  const floorY = (x, fallback) => { const y = arena && arena.floorAt ? arena.floorAt(x) : null; return y ?? fallback; };
  const bounds = (arena && arena.bounds) || { minX: -30, maxX: 30 };
  const clampX = (x) => Math.max(bounds.minX + 0.6, Math.min(bounds.maxX - 0.6, x));
  const hpRatio = () => Math.max(0, boss.hp / boss.maxHp);
  const centre = (f) => ({ x: f.x, y: f.y + 0.35 * (f.scale || 1) });
  const count = (key, type) => { stats[key][type] = (stats[key][type] || 0) + 1; };
  // giants hop while walking, so "grounded" flickers: also accept the pelvis being about standing height over the floor
  const nearFloor = () => {
    const fy = floorY(boss.x, null);
    if (fy === null) return boss.grounded;
    const h = boss.y - fy;
    if (boss.grounded && !st.standH && boss.balance > 0.8) st.standH = h;
    return boss.grounded || (st.standH > 0 && h < st.standH * 1.2);
  };
  const cdMult = () => (remix ? remix.cd[st.phase - 1] : special === 'mamma' && st.phase >= 3 ? 0.75 : special === 'emperor' && hpRatio() < 0.5 ? 0.7 : 1);

  function headInfo() {
    const rd = boss.ragdoll, h = rd.parts.head;
    if (!h || h.__removed || rd.detached.head) return null;
    const p = h.getPosition();
    return { body: h, x: p.x, y: p.y, r: rd.dims.head };
  }
  function eyePoints() {
    const h = headInfo(); if (!h) return [];
    const fxs = boss.facing || 1;
    return eyes.map(([ex, ey]) => { const p = h.body.getWorldPoint(V(fxs * ex * h.r, ey * h.r)); return { x: p.x, y: p.y }; });
  }
  function lowestPart(f) {
    let best = 'spine1', by = Infinity;
    for (const [name, b] of Object.entries(f.ragdoll.parts)) {
      if (!b || b.__removed || b.__dead || f.ragdoll.detached[name]) continue;
      const y = b.getPosition().y; if (y < by) { by = y; best = name; }
    }
    return best;
  }
  /** Closest body part of f within r (+ a part's own thickness) of (x, y), or null. */
  function partNear(f, x, y, r) {
    const pr = 0.14 * (f.scale || 1);
    let best = null, bd = (r + pr) * (r + pr);
    for (const [name, b] of Object.entries(f.ragdoll.parts)) {
      if (!b || b.__removed || b.__dead || f.ragdoll.detached[name]) continue;
      const p = b.getPosition(), d = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (d < bd) { bd = d; best = name; }
    }
    return best;
  }
  function backHand() {
    const rd = boss.ragdoll;
    if (!rd.detached.foreArmB && !rd.detached.upperArmB) return rd.handPoint('B');
    const h = headInfo();
    return h ? { x: h.x, y: h.y + h.r * 2.5 } : { x: boss.x, y: boss.y + 1.5 * boss.scale };
  }
  const armTorque = () => (boss.cfg.spin.weaponArmTorque || 150) * 3 * boss.scale * boss.scale;

  function hurt(f, part, point, dir, dmg, kind, kick, speed = 8, type = act ? act.type : special) {
    if (f.dead) return;
    const d = (dmg * dmgScale) / (f.toughness || 1);
    const evt = {
      attacker: null, victim: f, part, point, normal: dir, speed, impulse: 0, damage: d, isCrit: false,
      source: 'boss', kind, weaponId: null, weapon: null, isBlade: false, hazard: null, boss,
      attackerVel: { x: dir.x * speed, y: dir.y * speed }, relVel: { x: dir.x * speed, y: dir.y * speed },
      time: physics.time, wasDead: false,
    };
    f.applyHit(evt);
    if (kick && !f.dead) f.ragdoll.addVelocity(kick.x, kick.y);
    else if (kick) f.ragdoll.addVelocity(kick.x * 0.6, kick.y * 0.6);
    stats.damage += d;
    count('hits', type || 'special');
    if (hooks.onHit) hooks.onHit(evt);
  }
  function explodeAt(x, y, R, dmg, knock, type) {
    hooks.onExplosion?.({ x, y, power: 8, radius: R, damage: dmg });
    for (const f of foes()) {
      const c = centre(f), dx = c.x - x, dy = c.y - y, d = Math.hypot(dx, dy);
      if (d > R + 0.3 * (f.scale || 1)) continue;
      const fall = Math.max(0, 1 - d / (R + 0.3)), nx = d > 0.05 ? dx / d : 0, ny = d > 0.05 ? dy / d : 1;
      hurt(f, partNear(f, x, y, R + 1) || lowestPart(f), { x: c.x, y: c.y }, { x: nx, y: ny }, dmg * (0.45 + 0.55 * fall), 'explosion',
        { x: nx * knock * (0.4 + 0.6 * fall), y: 2 + 3.5 * fall }, 10, type);
    }
    const seen = new Set();
    physics.queryCircle(x, y, R, (fixture) => {
      const b = fixture.getBody(), ud = fixture.getUserData();
      if (seen.has(b) || b.__dead || !b.isDynamic() || (ud && ud.kind === 'part')) return;
      seen.add(b);
      const wc = b.getWorldCenter(), dx = wc.x - x, dy = wc.y - y + 0.4, L = Math.hypot(dx, dy) || 1;
      b.applyLinearImpulse(V((dx / L) * 3 * b.getMass(), (dy / L) * 3 * b.getMass()), wc, true);
    });
  }

  // ---------------------------------------------------------------- flow
  function pickMove() {
    if (remix) {
      if (st.chain && st.chain.length) return st.chain.shift();
      const list = remix.phases[st.phase - 1], parts = list[st.cycle++ % list.length].split('>');
      st.chain = parts.slice(1);
      return parts[0];
    }
    if (special === 'mamma') { const list = MAMMA_PHASES[st.phase]; return list[st.cycle++ % list.length]; }
    if (special === 'emperor') return st.cycle++ % 2 ? 'nova' : 'discs';
    return special;
  }
  function begin(type, foe) {
    act = { type, stage: 'wind', t: 0, foe, n: 0, dir: null, aimLen: BOSS_TUNE.laser.range };
    count('moves', type);
    if (type === 'laser') sfx('laser_charge', { volume: 0.8 });
    else if (type === 'lightning') sfx('laser_charge', { volume: 0.6, pitch: 0.7 });
    else if (type === 'gravity') sfx('laser_charge', { volume: 0.7, pitch: 0.5 });
    else if (type === 'teleport') sfx('laser_charge', { volume: 0.5, pitch: 2 });
    else if (type === 'gust') sfx('throw', { volume: 0.9, pitch: 0.45 });
    else if (type === 'flame') sfx('fire', { volume: 0.5, pitch: 0.7 });
  }
  function end(cd, extra = 1) {
    act = null;
    if (!boss.dead) boss._armRest();   // hand any posed arm back to the normal rest pose
    st.next = remix && st.chain && st.chain.length ? remix.link : rand(cd[0], cd[1]) * cdMult() * extra;
  }
  function tuneOf(type) { return BOSS_TUNE[type === 'discs' || type === 'nova' ? 'emperor' : type]; }
  function checkPhase() {
    const r = hpRatio(), ph = r > 0.66 ? 1 : r > 0.33 ? 2 : 3;
    if (ph <= st.phase || boss.dead) return;
    st.phase = ph; st.cycle = 0;
    const h = headInfo() || { x: boss.x, y: boss.y + 2, r: 0.3 };
    fx?.popText(h.x, h.y + h.r * 3 + 0.4, ph === 2 ? 'PHASE 2!' : 'FINAL PHASE!', { color: '#ffc23d', size: 46, life: 1.4 });
    fx?.flash('#ffc23d', 90);
    fx?.shake(16);
    sfx('fire', { pitch: 0.7, volume: 0.9 });
    if (!act) st.next = Math.min(st.next, 1.1);
  }

  /** While a special winds up / fires the boss stops swinging; a few moves drive the swing themselves. */
  function filter(it, foe) {
    if (!act || boss.dead) return it;
    const out = { ...it, spin: 0, jump: false, kick: false, grab: false, grabPress: false };
    const f = foe || act.foe;
    const toward = f ? Math.sign(f.x - boss.x) || boss.facing : boss.facing;
    if (act.type === 'slam' && act.stage === 'air') out.spin = toward;
    if (act.type === 'teleport' && act.stage === 'strike') out.spin = toward;
    return out;
  }

  function update(dt, live) {
    st.clock += dt;
    updateProjectiles(dt);
    updateStrikes(dt);
    updateMissiles(dt);
    updateNovas(dt);
    updateStatuses(dt);
    for (const b of beams) b.t += dt;
    for (const w of waves) w.t += dt;
    for (const g of ghosts) g.t += dt;
    for (let i = beams.length - 1; i >= 0; i--) if (beams[i].t >= beams[i].dur) beams.splice(i, 1);
    for (let i = waves.length - 1; i >= 0; i--) if (waves[i].t >= waves[i].dur) waves.splice(i, 1);
    for (let i = ghosts.length - 1; i >= 0; i--) if (ghosts[i].t >= ghosts[i].dur) ghosts.splice(i, 1);
    if (boss.dead || !special) { if (act) act = null; return; }
    nearFloor();   // keeps the standing-height calibration fresh
    if (!live) return;
    if (special === 'mamma' || remix) checkPhase();

    const foe = nearestFoe();
    if (!act) {
      if (!foe || boss.balance < 0.4 || boss.hangingWorld) return;
      st.next -= dt;
      if (st.next > 0) return;
      let type = pickMove();
      const quake = type === 'quake';
      if (quake) type = 'slam';
      // remixed bosses: a move that can't start right now drops its combo and retries the same cycle entry (for ~2 s)
      const retry = () => { if (remix) { st.chain = null; if ((st.retries = (st.retries || 0) + 1) < 14) st.cycle--; } };
      if (type === 'slam' && (Math.abs(foe.x - boss.x) > BOSS_TUNE.slam.range || !nearFloor())) {
        // not possible right now (mid-hop / too far): Mamma Mia retries the slam for ~2 s before moving on in her cycle
        st.slamWait = (st.slamWait || 0) + 0.15;
        if (special === 'mamma' && st.slamWait < 2) st.cycle--;
        retry();
        st.next = 0.15;
        return;
      }
      st.slamWait = 0;
      if ((type === 'laser' || type === 'flame') && !headInfo()) { retry(); st.next = 1; return; }
      if (type === 'gust' && Math.abs(foe.x - boss.x) > BOSS_TUNE.gust.range) { retry(); st.next = 0.4; return; }
      st.retries = 0;
      begin(type, foe);
      if (quake) act.quake = true;
      return;
    }
    act.t += dt;
    if ((act.stage === 'wind' || act.stage === 'swing') && boss.balance < 0.22) { st.chain = null; end([1.2, 1.2]); return; }   // knocked out of the wind-up
    if (!act.foe || act.foe.dead) act.foe = foe;
    switch (act.type) {
      case 'cheese': stepThrow(BOSS_TUNE.cheese, 'cheese'); break;
      case 'snowball': stepThrow(BOSS_TUNE.snowball, 'snow'); break;
      case 'slam': stepSlam(); break;
      case 'laser': stepLaser(); break;
      case 'anchor': stepAnchor(); break;
      case 'flame': stepFlame(dt); break;
      case 'gust': stepGust(dt); break;
      case 'teleport': stepTeleport(); break;
      case 'rockets': stepRockets(); break;
      case 'gravity': stepGravity(dt); break;
      case 'discs': stepDiscs(); break;
      case 'nova': stepNova(); break;
      default: if (RAIN.has(act.type)) stepRain(); else end([2, 3]);
    }
  }

  // ---------------------------------------------------------------- thrown projectiles (cheese / snowballs)
  // the item appears in the boss's off-hand (back hand), which cocks back over the shoulder and whips forward
  function stepThrow(T, kind) {
    const face = boss.facing || 1, rd = boss.ragdoll;
    if (act.stage === 'wind') {
      rd.setArmRest('B', face * -2.9, armTorque());
      if (act.t < T.wind) return;
      act.stage = 'swing'; act.t = 0;
    } else if (act.stage === 'swing') {
      rd.setArmRest('B', face * 2.1, armTorque() * 1.5);
      if (act.t < T.swing) return;
      if (act.foe && !act.foe.dead) throwProjectile(act.foe, kind, T);
      act.n++;
      const volley = special === 'mamma' ? (st.phase >= 3 ? 2 : 1) : hpRatio() < 0.5 ? 2 : 1;   // angry: two in a row
      if (act.n < volley) { act.stage = 'wind'; act.t = T.wind - T.gap; }
      else { act.stage = 'recover'; act.t = 0; }
    } else if (act.t >= T.recover) end(T.cd);
  }
  function throwProjectile(foe, kind, T) {
    const pl = window.planck, w = physics.world;
    const org = backHand();
    const v = foe.ragdoll.velocity ? foe.ragdoll.velocity() : { x: 0, y: 0 };
    const tx = foe.x + v.x * 0.25 + (Math.random() - 0.5) * 0.6, ty = foe.y + 0.2;
    const dx = tx - org.x, dy = ty - org.y;
    const time = Math.max(0.65, Math.min(1.3, 0.55 + Math.abs(dx) * 0.07));
    const g = w.getGravity().y;
    const vx = dx / time, vy = (dy - 0.5 * g * time * time) / time;
    const s = T.size;
    const body = w.createBody({ type: 'dynamic', position: V(org.x, org.y), bullet: true, angularDamping: 0.3 });
    const shape = kind === 'snow' ? new pl.Circle(s) : new pl.Polygon([V(-s, -0.55 * s), V(s, -0.55 * s), V(-s, 0.7 * s)]);
    body.createFixture(shape, {
      density: 1.4, friction: 0.5, restitution: T.restitution,
      filterGroupIndex: boss.group || 0, filterCategoryBits: CAT.PROP, filterMaskBits: ALL,
      userData: { kind: 'boss_proj', boss },
    });
    body.setLinearVelocity(V(vx, vy));
    body.setAngularVelocity(-(Math.sign(dx) || 1) * rand(6, 10));
    projectiles.push({ body, t: 0, s, kind, T, lastVy: vy, spent: false, gone: false });
    if (kind === 'cheese') stats.cheese++;
    sfx('throw', { volume: 0.8 });
  }
  function updateProjectiles(dt) {
    for (const p of projectiles) {
      const b = p.body, T = p.T;
      p.t += dt;
      if (!b || b.__dead) { p.gone = true; continue; }
      const pos = b.getPosition(), v = b.getLinearVelocity(), sp = Math.hypot(v.x, v.y);
      const col = p.kind === 'snow' ? '#eef7ff' : CHEESE;
      if (p.lastVy < -2.5 && v.y > 0.2) {   // bounced
        sfx('squish', { volume: Math.min(0.6, 0.15 + sp / 16), pitch: p.kind === 'snow' ? 1.6 : 1.1 });
        fx?.sparks(pos.x, pos.y - p.s * 0.5, { count: 5, color: col, speed: 3 });
      }
      p.lastVy = v.y;
      if (!p.spent && sp > T.hitSpeed) {
        for (let ce = b.getContactList(); ce; ce = ce.next) {
          const c = ce.contact;
          if (!c.isTouching()) continue;
          const other = c.getFixtureA().getBody() === b ? c.getFixtureB() : c.getFixtureA();
          const ud = other.getUserData();
          if (!ud || ud.kind !== 'part' || !ud.fighter || ud.detached) continue;
          const f = ud.fighter;
          if (f.side === 'enemy' || f.dead) continue;
          const n = { x: v.x / (sp || 1), y: v.y / (sp || 1) };
          hurt(f, ud.name, { x: pos.x, y: pos.y }, n, T.damage, 'blunt', { x: v.x * 0.35, y: 2.2 }, sp, p.kind === 'snow' ? 'snowball' : 'cheese');
          if (p.kind === 'snow') { freeze(f, T.freeze, T.slow); sfx('hit_metal', { pitch: 1.9, volume: 0.5 }); }
          else stats.cheeseHits++;
          sfx('squish', { volume: 0.9, pitch: p.kind === 'snow' ? 1.4 : 0.85 });
          fx?.sparks(pos.x, pos.y, { count: 16, color: col, speed: 6 });
          fx?.sparks(pos.x, pos.y, { count: 8, color: p.kind === 'snow' ? '#9fd3ee' : RIND, speed: 4 });
          p.spent = true; p.gone = true;
          break;
        }
      }
      if (!p.gone && (p.t > T.life || pos.y < deathY)) {
        p.gone = true;
        if (pos.y >= deathY) fx?.sparks(pos.x, pos.y, { count: 8, color: col, speed: 3 });
      }
    }
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      if (!p.gone) continue;
      if (p.body && !p.body.__dead) physics.destroyBody(p.body);
      projectiles.splice(i, 1);
    }
  }

  // ---------------------------------------------------------------- status effects
  function freeze(f, time, slow) {
    if (!frozen.has(f)) {
      f._preFreezeSpin = f.spinMult || 1;
      f.spinMult = f._preFreezeSpin * slow;
      const c = centre(f);
      fx?.popText(c.x, c.y + 1.2 * (f.scale || 1), 'FROZEN!', { color: '#9fe3ff', size: 30 });
    }
    frozen.set(f, Math.max(frozen.get(f) || 0, time));
  }
  function unfreeze(f) { f.spinMult = f._preFreezeSpin ?? 1; frozen.delete(f); }
  function updateStatuses(dt) {
    for (const [f, t] of frozen) { const left = t - dt; if (left <= 0 || f.dead) unfreeze(f); else frozen.set(f, left); }
    for (const [f, L] of lifted) {
      L.t += dt;
      if (f.dead) { lifted.delete(f); continue; }
      if (L.stage === 'fall') {
        if (L.t > 0.12 && f.grounded) {
          const fy = floorY(f.x, f.y - 1);
          hurt(f, lowestPart(f), { x: f.x, y: fy + 0.1 }, { x: 0, y: -1 }, BOSS_TUNE.gravity.damage, 'explosion', { x: 0, y: 2 }, 12, 'gravity');
          fx?.sparks(f.x, fy + 0.1, { count: 18, color: '#b48cff', speed: 6 });
          fx?.shake(14);
          sfx('slam', { volume: 0.6, pitch: 1.3 });
          lifted.delete(f);
        } else if (L.t > BOSS_TUNE.gravity.land) lifted.delete(f);
      }
    }
  }

  // ---------------------------------------------------------------- slam
  const T_S = BOSS_TUNE.slam;
  function stepSlam() {
    if (act.stage === 'wind') {
      if (act.t < T_S.wind) return;
      if (!nearFloor()) { if (act.t > T_S.wind + 0.6) end([0.8, 1.2]); return; }   // wait for the feet to come down
      const f = act.foe, dir = f ? Math.sign(f.x - boss.x) || boss.facing : boss.facing;
      const dist = f ? Math.abs(f.x - boss.x) : 0;
      boss.ragdoll.addVelocity(dir * Math.min(T_S.leapVx, dist * 0.5), T_S.leapVy);
      sfx('jump', { pitch: 0.5, volume: 1 });
      act.stage = 'air'; act.t = 0;
    } else if (act.stage === 'air') {
      const vy = boss.ragdoll.velocity ? boss.ragdoll.velocity().y : 0;
      if ((act.t > 0.3 && (boss.grounded || (nearFloor() && vy <= 0.5))) || act.t > T_S.maxAir) { slamImpact(); act.stage = 'recover'; act.t = 0; }
    } else {
      // quake (remixed bosses): the landing sends two shock rings along the floor, the second one 0.45 s later
      if (act.quake && (act.rings || 0) < 2 && act.t >= (act.rings || 0) * 0.45) {
        novas.push({ x: boss.x, y: floorY(boss.x, boss.y - 1.2 * boss.scale), r: 0.6, t: 0, hit: new Set() });
        sfx('slam', { pitch: 1.5, volume: 0.6 });
        act.rings = (act.rings || 0) + 1;
      }
      if (act.t >= T_S.recover) end(T_S.cd);
    }
  }
  function slamImpact() {
    const R = T_S.radius, x = boss.x, fy = floorY(x, boss.y - 1.2 * boss.scale);
    stats.slams++;
    sfx('slam', { volume: 1 });
    fx?.shake(28);
    fx?.hitstop(60);
    for (const side of [-1, 1]) fx?.sparks(x + side * 0.6, fy + 0.1, { count: 18, color: '#d9cbb0', speed: 7 });
    fx?.sparks(x, fy + 0.1, { count: 14, color: '#ffc23d', speed: 5 });
    waves.push({ x, y: fy, t: 0, dur: 0.55, R });
    for (const f of foes()) {
      const dx = f.x - x, d = Math.abs(dx);
      if (d > R) continue;
      const ffy = floorY(f.x, null);
      if (!f.grounded || ffy === null || Math.abs(ffy - fy) > 1.2) continue;   // jump (or hang on a wall) to dodge
      const fall = 1 - d / R, dir = Math.sign(dx) || 1;
      hurt(f, lowestPart(f), { x: f.x, y: ffy + 0.2 }, { x: dir, y: 0.6 }, T_S.damage * (0.45 + 0.55 * fall), 'explosion',
        { x: dir * T_S.launchVx * (0.5 + 0.5 * fall), y: T_S.launchVy * (0.55 + 0.45 * fall) }, 10);
      stats.slamHits++;
    }
    // loose stuff on the floor hops too
    const seen = new Set();
    physics.queryCircle(x, fy, R, (fixture) => {
      const b = fixture.getBody(), ud = fixture.getUserData();
      if (seen.has(b) || b.__dead || !b.isDynamic() || (ud && ud.kind === 'part')) return;
      seen.add(b);
      b.applyLinearImpulse(V(0, 4 * b.getMass()), b.getWorldCenter(), true);
    });
  }

  // ---------------------------------------------------------------- laser eyes
  const T_L = BOSS_TUNE.laser;
  function eyeMid() { const e = eyePoints(); if (!e.length) return null; return { x: e.reduce((a, p) => a + p.x, 0) / e.length, y: e.reduce((a, p) => a + p.y, 0) / e.length }; }
  function staticFraction(from, dir, len) {
    let sf = 1;
    physics.world.rayCast(V(from.x, from.y), V(from.x + dir.x * len, from.y + dir.y * len), (fixture, point, normal, fraction) => {
      const ud = fixture.getUserData();
      if (!ud || ud.kind !== 'static') return -1;
      if (fraction < sf) sf = fraction;
      return fraction;
    });
    return sf;
  }
  function stepLaser() {
    const mid = eyeMid();
    if (!mid) { end([1, 1.5]); return; }
    if (act.stage === 'wind') {
      if ((act.t < T_L.track || !act.dir) && act.foe) {
        const tx = act.foe.x, ty = act.foe.y + 0.35 * (act.foe.scale || 1);
        const L = Math.hypot(tx - mid.x, ty - mid.y) || 1;
        act.dir = { x: (tx - mid.x) / L, y: (ty - mid.y) / L };
        if (act.t + 1 / 60 >= T_L.track) sfx('click', { pitch: 1.6, volume: 0.6 });   // aim locked
      }
      if (act.dir) act.aimLen = T_L.range * staticFraction(mid, act.dir, T_L.range);
      if (act.t >= T_L.wind) { act.stage = 'fire'; act.t = 0; act.n = 0; }
    } else if (act.stage === 'fire') {
      while (act.n < T_L.pulses && act.t >= act.n * T_L.gap) { firePulse(); act.n++; }
      if (act.n >= T_L.pulses && act.t >= (T_L.pulses - 1) * T_L.gap + T_L.beam) { act.stage = 'recover'; act.t = 0; }
    } else if (act.t >= T_L.recover) end(T_L.cd);
  }
  function firePulse() {
    const dir = act.dir;
    if (!dir) return;
    stats.lasers++;
    sfx('laser', { volume: 0.85, pitch: 0.95 + Math.random() * 0.1 });
    const hits = new Map();
    for (const e of eyePoints()) {
      let sf = 1;
      const parts = [];
      physics.world.rayCast(V(e.x, e.y), V(e.x + dir.x * T_L.range, e.y + dir.y * T_L.range), (fixture, point, normal, fraction) => {
        const ud = fixture.getUserData();
        if (!ud) return -1;
        if (ud.kind === 'static') { if (fraction < sf) sf = fraction; return fraction; }
        if (ud.kind === 'part' && ud.fighter && !ud.detached && ud.fighter.side !== 'enemy' && !ud.fighter.dead) parts.push({ f: ud.fighter, part: ud.name, fraction, x: point.x, y: point.y });
        return -1;
      });
      const x1 = e.x + dir.x * T_L.range * sf, y1 = e.y + dir.y * T_L.range * sf;
      beams.push({ x0: e.x, y0: e.y, x1, y1, t: 0, dur: T_L.beam + 0.1 });
      if (sf < 1) fx?.sparks(x1, y1, { count: 5, color: '#ff6a3a', speed: 4 });
      for (const h of parts) {
        if (h.fraction >= sf) continue;
        const cur = hits.get(h.f);
        if (!cur || h.fraction < cur.fraction) hits.set(h.f, h);
      }
    }
    for (const [f, h] of hits) {
      hurt(f, h.part, { x: h.x, y: h.y }, dir, T_L.damage, 'laser', { x: dir.x * T_L.knock, y: Math.max(0, dir.y) * T_L.knock + 0.8 }, 12);
      stats.laserHits++;
      fx?.sparks(h.x, h.y, { count: 10, color: '#ffb03a', speed: 5 });
    }
  }

  // ---------------------------------------------------------------- sky / floor strikes (icicles, tentacles, meteors, lightning)
  function stepRain() {
    const T = BOSS_TUNE[act.type];
    boss.ragdoll.setArmRest('B', (boss.facing || 1) * 3.0, armTorque());   // off-hand raised: casting
    if (act.stage === 'wind') {
      if (act.t < T.wind) return;
      const n = act.type === 'meteors' && hpRatio() < 0.5 ? T.count + 2 : T.count;
      for (let i = 0; i < n; i++) strikes.push({ kind: act.type, T, stage: 'delay', t: 0, delay: i * T.gap, first: i === 0, x: 0, fy: 0, done: false, hit: new Set() });
      act.stage = 'recover'; act.t = 0;
    } else if (act.t >= T.recover) end(T.cd);
  }
  function placeStrike(s) {
    const foe = nearestFoe(), T = s.T;
    let x = foe ? foe.x : boss.x;
    if (foe) {
      const v = foe.ragdoll.velocity ? foe.ragdoll.velocity() : { x: 0 };
      x += v.x * 0.35;
      if (s.kind === 'meteors' && !s.first) x += rand(-T.spread, T.spread);
    }
    s.x = clampX(x);
    s.fy = floorY(s.x, foe ? floorY(foe.x, foe.y - 1) : boss.y - 1.5);
    if (s.kind === 'icicles') { s.y = s.fy + T.height; sfx('hit_metal', { pitch: 2.2, volume: 0.25 }); }
    else if (s.kind === 'tentacles') sfx('squish', { pitch: 0.55, volume: 0.6 });
    else if (s.kind === 'meteors') { s.sx = s.x - (Math.random() < 0.5 ? -1 : 1) * 3.5; s.sy = s.fy + 11; sfx('fire', { pitch: 0.6, volume: 0.35 }); }
    else if (s.kind === 'lightning') sfx('click', { pitch: 0.7, volume: 0.5 });
  }
  function fireStrike(s) {
    const T = s.T;
    if (s.kind === 'lightning') {
      s.bolt = jagged({ x: s.x + rand(-1, 1), y: s.fy + 13 }, { x: s.x, y: s.fy }, 12, 0.5);
      sfx('laser', { pitch: 0.55, volume: 1 });
      sfx('explosion', { pitch: 1.7, volume: 0.35 });
      fx?.flash('#fff6c9', 70);
      fx?.shake(12);
      fx?.sparks(s.x, s.fy + 0.1, { count: 22, color: '#ffe36a', speed: 7 });
      for (const f of foes()) {
        if (Math.abs(f.x - s.x) > T.radius + 0.2 * (f.scale || 1) || f.y - s.fy > 6) continue;
        hurt(f, partNear(f, s.x, f.y + 0.6, 2) || lowestPart(f), centre(f), { x: Math.sign(f.x - s.x) || 1, y: 0.5 }, T.damage, 'laser', { x: (Math.sign(f.x - s.x) || 1) * 2, y: 3 }, 12, 'lightning');
      }
    } else if (s.kind === 'tentacles') {
      sfx('squish', { pitch: 0.5, volume: 1 });
      sfx('hit_heavy', { pitch: 0.6, volume: 0.7 });
      fx?.sparks(s.x, s.fy + 0.1, { count: 14, color: '#f3c1dc', speed: 5 });
    }
  }
  function stepStrike(s, dt) {
    const T = s.T;
    if (s.kind === 'icicles') {
      const prevY = s.y;
      s.y -= T.fall * dt;
      for (const f of foes()) {
        if (s.hit.has(f)) continue;
        const part = partNear(f, s.x, (s.y + prevY) / 2, T.radius * 0.8);
        if (!part) continue;
        s.hit.add(f);
        hurt(f, part, { x: s.x, y: s.y }, { x: 0, y: -1 }, T.damage, 'blade', { x: 0, y: -1 }, 14, 'icicles');
        shatter(s); return;
      }
      if (s.y <= s.fy + 0.1) shatter(s);
    } else if (s.kind === 'tentacles') {
      if (s.t < T.rise) {
        for (const f of foes()) {
          if (s.hit.has(f) || Math.abs(f.x - s.x) > T.radius + 0.15 * (f.scale || 1) || f.y - s.fy > T.height) continue;
          s.hit.add(f);
          hurt(f, lowestPart(f), { x: f.x, y: s.fy + 0.3 }, { x: 0, y: 1 }, T.damage, 'blunt', { x: (Math.sign(f.x - s.x) || 1) * 1.5, y: T.launch }, 10, 'tentacles');
        }
      }
      if (s.t > T.rise + 0.35) s.done = true;
    } else if (s.kind === 'meteors') {
      if (s.t >= T.fallTime && !s.boom) {
        s.boom = true;
        explodeAt(s.x, s.fy + 0.3, T.radius, T.damage, T.knock, 'meteors');
        fx?.sparks(s.x, s.fy + 0.2, { count: 20, color: '#ff7a2a', speed: 8 });
      }
      if (s.t > T.fallTime + 0.05) s.done = true;
    } else if (s.kind === 'lightning') {
      if (s.t > 0.3) s.done = true;
    }
  }
  function shatter(s) {
    s.done = true;
    sfx('hit_metal', { pitch: 1.7, volume: 0.6 });
    fx?.sparks(s.x, Math.max(s.y, s.fy + 0.1), { count: 14, color: '#dff4ff', speed: 5 });
  }
  function updateStrikes(dt) {
    for (const s of strikes) {
      s.t += dt;
      if (s.stage === 'delay') { if (s.t >= s.delay) { s.stage = 'warn'; s.t = 0; placeStrike(s); } }
      else if (s.stage === 'warn') { if (s.t >= s.T.warn) { s.stage = 'go'; s.t = 0; fireStrike(s); } }
      else stepStrike(s, dt);
    }
    for (let i = strikes.length - 1; i >= 0; i--) if (strikes[i].done) strikes.splice(i, 1);
  }

  // ---------------------------------------------------------------- anchor on a chain
  const T_A = BOSS_TUNE.anchor;
  function stepAnchor() {
    const face = boss.facing || 1, rd = boss.ragdoll;
    if (act.stage === 'wind') {
      rd.setArmRest('B', face * -2.9, armTorque());
      if (act.t < T_A.wind) return;
      const org = backHand(), f = act.foe;
      const c = f ? centre(f) : { x: boss.x + face * 5, y: org.y };
      const dx = c.x - org.x, dy = c.y - org.y, L = Math.hypot(dx, dy) || 1;
      rd.setArmRest('B', face * 2.1, armTorque() * 1.5);
      act.anchor = { kind: 'anchor', x: org.x, y: org.y, vx: (dx / L) * T_A.speed, vy: (dy / L) * T_A.speed, dist: 0, stage: 'out', t: 0, target: null };
      missiles.push(act.anchor);
      sfx('throw', { volume: 0.9, pitch: 0.7 });
      act.stage = 'wait'; act.t = 0;
    } else if (act.stage === 'wait') {
      if (act.anchor.done || act.t > T_A.maxWait) { act.stage = 'recover'; act.t = 0; }
    } else if (act.t >= T_A.recover) end(T_A.cd);
  }
  function stepAnchorMissile(m, dt) {
    const hand = backHand();
    if (m.stage === 'out') {
      m.x += m.vx * dt; m.y += m.vy * dt; m.dist += T_A.speed * dt;
      for (const f of foes()) {
        const part = partNear(f, m.x, m.y, T_A.hookR);
        if (!part) continue;
        m.stage = 'hook'; m.t = 0; m.target = f;
        f.releaseGrips?.();
        const dir = Math.sign(boss.x - f.x) || 1;
        hurt(f, part, { x: m.x, y: m.y }, { x: dir, y: 0.3 }, T_A.damage, 'blade', { x: dir * T_A.yank, y: 3.5 }, 12, 'anchor');
        sfx('hit_metal', { pitch: 0.7, volume: 0.9 });
        fx?.popText(m.x, m.y + 0.8, 'HOOKED!', { color: '#9fd3ee', size: 30 });
        return;
      }
      const fy = floorY(m.x, null);
      if (m.dist > T_A.range || (fy !== null && m.y < fy + 0.1) || m.x < bounds.minX || m.x > bounds.maxX) {
        if (fy !== null && m.y < fy + 0.15) fx?.sparks(m.x, fy + 0.1, { count: 8, color: '#d9cbb0', speed: 4 });
        m.stage = 'back';
      }
    } else if (m.stage === 'hook') {
      m.t += dt;
      const f = m.target;
      if (f && !f.dead) { const c = centre(f); m.x = c.x; m.y = c.y; }
      if (m.t > T_A.hold || !f || f.dead) m.stage = 'back';
    } else {
      const dx = hand.x - m.x, dy = hand.y - m.y, L = Math.hypot(dx, dy);
      const sp = T_A.speed * 1.4 * dt;
      if (L <= sp + 0.2) { m.done = true; return; }
      m.x += (dx / L) * sp; m.y += (dy / L) * sp;
    }
  }

  // ---------------------------------------------------------------- fire breath
  const T_F = BOSS_TUNE.flame;
  function mouth() {
    const h = headInfo(); if (!h) return null;
    const p = h.body.getWorldPoint(V((boss.facing || 1) * h.r * 0.9, -h.r * 0.2));
    return { x: p.x, y: p.y };
  }
  function stepFlame(dt) {
    const m = mouth();
    if (!m) { end([1, 1.5]); return; }
    if (act.stage === 'wind') {
      if (act.t < T_F.wind) return;
      const f = act.foe, face = boss.facing || 1;
      let ang = face > 0 ? 0 : Math.PI;
      if (f) { const c = centre(f), a = Math.atan2(c.y - m.y, c.x - m.x), base = face > 0 ? 0 : Math.PI; let d = a - base; d = Math.atan2(Math.sin(d), Math.cos(d)); ang = base + Math.max(-0.5, Math.min(0.5, d)); }
      act.ang = ang; act.stage = 'breath'; act.t = 0; act.tick = 0; act.sfxT = 0;
      sfx('fire', { volume: 1, pitch: 0.8 });
    } else if (act.stage === 'breath') {
      act.tick -= dt; act.sfxT -= dt;
      if (act.sfxT <= 0) { act.sfxT = 0.4; sfx('fire', { volume: 0.6, pitch: 0.9 + Math.random() * 0.2 }); }
      for (let k = 0; k < 2; k++) {
        const a = act.ang + rand(-T_F.cone, T_F.cone), L = rand(0.4, T_F.range);
        fx?.sparks(m.x + Math.cos(a) * L, m.y + Math.sin(a) * L, { count: 1, color: Math.random() < 0.5 ? '#ff7a2a' : '#ffc23d', speed: 2 });
      }
      if (act.tick <= 0) {
        act.tick = T_F.tick;
        for (const f of foes()) {
          let inside = null;
          for (const [name, b] of Object.entries(f.ragdoll.parts)) {
            if (!b || b.__removed || f.ragdoll.detached[name]) continue;
            const p = b.getPosition(), dx = p.x - m.x, dy = p.y - m.y, d = Math.hypot(dx, dy);
            if (d > T_F.range || d < 0.05) continue;
            let da = Math.atan2(dy, dx) - act.ang; da = Math.atan2(Math.sin(da), Math.cos(da));
            if (Math.abs(da) <= T_F.cone) { inside = { name, p }; break; }
          }
          if (inside) hurt(f, inside.name, { x: inside.p.x, y: inside.p.y }, { x: Math.cos(act.ang), y: Math.sin(act.ang) }, T_F.damage, 'fire', { x: Math.cos(act.ang) * 0.8, y: 0.3 }, 6, 'flame');
        }
      }
      if (act.t >= T_F.dur) { act.stage = 'recover'; act.t = 0; }
    } else if (act.t >= T_F.recover) end(T_F.cd);
  }

  // ---------------------------------------------------------------- wind gust
  const T_G = BOSS_TUNE.gust;
  function stepGust(dt) {
    if (act.stage === 'wind') {
      act.dirx = act.foe ? Math.sign(act.foe.x - boss.x) || boss.facing : boss.facing;
      if (act.t < T_G.wind) return;
      act.stage = 'blow'; act.t = 0; act.sfxT = 0;
      fx?.shake(10);
      for (const f of foes()) {
        const dx = f.x - boss.x;
        if (Math.abs(dx) < T_G.range && Math.sign(dx) === act.dirx) hurt(f, lowestPart(f), centre(f), { x: act.dirx, y: 0.2 }, T_G.damage, 'blunt', { x: act.dirx * 3, y: 2 }, 6, 'gust');
      }
    } else if (act.stage === 'blow') {
      act.sfxT -= dt;
      if (act.sfxT <= 0) { act.sfxT = 0.3; sfx('swing', { volume: 0.9, pitch: 0.45 }); }
      for (const f of foes()) {
        const dx = f.x - boss.x;
        if (Math.abs(dx) > T_G.range || Math.sign(dx) !== act.dirx) continue;
        const k = 1 - (Math.abs(dx) / T_G.range) * 0.5;
        f.ragdoll.addVelocity(act.dirx * T_G.accel * k * dt, 0.15 * T_G.accel * dt);
      }
      if (act.t >= T_G.dur) { act.stage = 'recover'; act.t = 0; }
    } else if (act.t >= T_G.recover) end(T_G.cd);
  }

  // ---------------------------------------------------------------- teleport strike
  const T_T = BOSS_TUNE.teleport;
  function teleportTo(x) {
    const rd = boss.ragdoll;
    const fy = floorY(x, null);
    if (fy === null) return false;
    const dx = x - boss.x, dy = fy + (st.standH || 1.2 * boss.scale) - boss.y;
    const old = [];
    for (const [name, b] of Object.entries(rd.parts)) {
      if (!b || b.__removed || b.__dead || rd.detached[name]) continue;
      const p = b.getPosition();
      old.push([p.x, p.y]);
      b.setPosition(V(p.x + dx, p.y + dy));
      b.setLinearVelocity(V(0, 0)); b.setAngularVelocity(0);
    }
    for (const w of [boss.weapon, boss.weapon2]) {
      if (!w) continue;
      for (const b of [...(w.links || []), w.head, ...(w.flapBodies || [])]) { if (!b || b.__dead) continue; const p = b.getPosition(); b.setPosition(V(p.x + dx, p.y + dy)); b.setLinearVelocity(V(0, 0)); }
    }
    ghosts.push({ pts: old, t: 0, dur: 0.5, r: 0.16 * boss.scale });
    return true;
  }
  function stepTeleport() {
    if (act.stage === 'wind') {
      if (act.t < T_T.wind) return;
      const f = act.foe;
      if (!f) { end([1, 1.5]); return; }
      boss.releaseGrips?.();
      const side = Math.sign(f.x - boss.x) || 1;   // the far side of the foe = behind them
      const ffy = floorY(f.x, f.y - 1);
      const ok = (x) => { const y = floorY(x, null); return y !== null && Math.abs(y - ffy) < 1.0 && x > bounds.minX + 0.8 && x < bounds.maxX - 0.8; };
      let x = f.x + side * T_T.behind;
      if (!ok(x)) x = f.x - side * T_T.behind;
      if (!ok(x) || !teleportTo(x)) { end([1, 1.5]); return; }
      boss.face(Math.sign(f.x - boss.x) || boss.facing);
      boss._armRest();
      sfx('laser', { pitch: 2.2, volume: 0.8 });
      fx?.sparks(boss.x, boss.y + 0.5 * boss.scale, { count: 18, color: '#c89bff', speed: 6 });
      fx?.sparks(boss.x, boss.y + 0.5 * boss.scale, { count: 12, color: '#7fe7ff', speed: 5 });
      act.stage = 'strike'; act.t = 0;
    } else if (act.stage === 'strike') {
      if (act.t >= T_T.strike) end(T_T.cd);
    } else end(T_T.cd);
  }

  // ---------------------------------------------------------------- homing rockets
  const T_R = BOSS_TUNE.rockets;
  function stepRockets() {
    if (act.stage === 'wind') {
      if (act.t < T_R.wind) return;
      const h = headInfo() || { x: boss.x, y: boss.y + 1.5 * boss.scale, r: 0.3 };
      const face = boss.facing || 1;
      for (let i = 0; i < T_R.count; i++) {
        const off = (i - (T_R.count - 1) / 2) * 0.9;
        missiles.push({ kind: 'rocket', x: h.x - face * 0.4 + off, y: h.y + h.r * 1.5, ang: Math.PI / 2 + face * -0.4 + off * 0.3, speed: 2, t: 0, owner: 'boss' });
      }
      sfx('throw', { pitch: 0.5, volume: 1 });
      sfx('fire', { pitch: 1.4, volume: 0.5 });
      act.stage = 'recover'; act.t = 0;
    } else if (act.t >= T_R.recover) end(T_R.cd);
  }
  function stepRocket(m, dt) {
    m.t += dt;
    const bossC = centre(boss);
    const tgt = m.owner === 'boss' ? nearestFoe() : boss.dead ? null : boss;
    if (tgt) {
      const c = centre(tgt);
      let da = Math.atan2(c.y - m.y, c.x - m.x) - m.ang; da = Math.atan2(Math.sin(da), Math.cos(da));
      const turn = T_R.turn * (m.owner === 'boss' ? 1 : 3) * dt;
      m.ang += Math.max(-turn, Math.min(turn, da));
    }
    m.speed = Math.min(T_R.speed * (m.owner === 'boss' ? 1 : 2), m.speed + 6 * dt);
    m.x += Math.cos(m.ang) * m.speed * dt; m.y += Math.sin(m.ang) * m.speed * dt;
    if (Math.random() < 0.6) fx?.sparks(m.x - Math.cos(m.ang) * 0.35, m.y - Math.sin(m.ang) * 0.35, { count: 1, color: Math.random() < 0.5 ? '#9aa0a8' : '#ff9a3a', speed: 1 });
    const boom = (x, y, harmless) => {
      m.done = true;
      if (harmless) { hooks.onExplosion?.({ x, y, power: 6, radius: T_R.radius, damage: 0 }); return; }
      explodeAt(x, y, T_R.radius, T_R.damage, 6, 'rockets');
    };
    if (m.owner === 'boss') {
      // smacked by a weapon or a spinning fist: deflected back at the boss
      for (const f of foes()) {
        let hitBy = false;
        for (const w of [f.weapon, f.weapon2]) {
          if (!w || w.destroyed || !w.def) continue;
          for (const k of [0.45, 0.75, 1]) { const p = weaponPoint(w, (w.def.length || 1) * k, 0); if ((p.x - m.x) ** 2 + (p.y - m.y) ** 2 < 0.5 * 0.5) { hitBy = true; break; } }
          if (hitBy) break;
        }
        if (!hitBy && f.isSpinning) for (const hand of ['F', 'B']) { if (f.ragdoll.detached['foreArm' + hand]) continue; const p = f.ragdoll.handPoint(hand); if ((p.x - m.x) ** 2 + (p.y - m.y) ** 2 < 0.4 * 0.4) { hitBy = true; break; } }
        if (hitBy && f.isSpinning) {
          m.owner = 'player'; m.attacker = f; m.speed = T_R.speed * 1.6; m.t = 0;
          m.ang = Math.atan2(bossC.y - m.y, bossC.x - m.x);
          sfx('hit_metal', { pitch: 0.9, volume: 1 });
          fx?.sparks(m.x, m.y, { count: 12, color: '#ffc23d', speed: 6 });
          fx?.popText(m.x, m.y + 0.7, 'DEFLECTED!', { color: '#ffc23d', size: 30 });
          return;
        }
      }
      for (const f of foes()) if (partNear(f, m.x, m.y, 0.35)) { boom(m.x, m.y); return; }
    } else if (!boss.dead && partNear(boss, m.x, m.y, 0.5)) {
      const atk = m.attacker, d = T_R.deflectDamage / (boss.toughness || 1);
      const evt = { attacker: atk || null, victim: boss, part: partNear(boss, m.x, m.y, 0.5), point: { x: m.x, y: m.y }, normal: { x: Math.cos(m.ang), y: Math.sin(m.ang) }, speed: 12, impulse: 0, damage: d, isCrit: false, source: 'special', kind: 'explosion', weaponId: null, weapon: null, isBlade: false, hazard: null, attackerVel: { x: Math.cos(m.ang) * 12, y: Math.sin(m.ang) * 12 }, relVel: { x: 0, y: 0 }, time: physics.time, wasDead: false };
      boss.applyHit(evt);
      boss.ragdoll.addVelocity(Math.cos(m.ang) * 4, 3);
      hooks.onHit?.(evt);
      count('hits', 'deflected');
      boom(m.x, m.y, true);
      return;
    }
    const fy = floorY(m.x, null);
    if ((fy !== null && m.y < fy + 0.05) || m.t > T_R.life || m.x < bounds.minX - 1 || m.x > bounds.maxX + 1 || m.y < deathY) boom(m.x, Math.max(m.y, fy ?? m.y), m.owner !== 'boss');
  }

  // ---------------------------------------------------------------- gravity pulse
  const T_V = BOSS_TUNE.gravity;
  function stepGravity(dt) {
    boss.ragdoll.setArmRest('B', (boss.facing || 1) * 3.0, armTorque());
    if (act.stage === 'wind') {
      if (act.t < T_V.wind) return;
      act.victims = foes().filter((f) => Math.abs(f.x - boss.x) < T_V.range);
      for (const f of act.victims) { f.releaseGrips?.(); lifted.set(f, { stage: 'lift', t: 0 }); }
      sfx('laser_charge', { pitch: 1.3, volume: 0.7 });
      act.stage = 'lift'; act.t = 0;
    } else if (act.stage === 'lift') {
      const g = -physics.world.getGravity().y;
      for (const f of act.victims || []) {
        if (f.dead || !lifted.has(f)) continue;
        const v = f.ragdoll.velocity ? f.ragdoll.velocity() : { x: 0, y: 0 };
        f.ragdoll.addVelocity(-v.x * 2 * dt, v.y < T_V.maxVy ? (g + T_V.liftAccel - g * 0.5) * dt : g * dt);
      }
      if (act.t >= T_V.lift) {
        for (const f of act.victims || []) { if (f.dead || !lifted.has(f)) continue; f.ragdoll.addVelocity(0, -T_V.slamVy); lifted.set(f, { stage: 'fall', t: 0 }); }
        sfx('throw', { pitch: 0.4, volume: 1 });
        act.stage = 'recover'; act.t = 0;
      }
    } else if (act.t >= T_V.recover) end(T_V.cd);
  }

  // ---------------------------------------------------------------- emperor: saw-discs + shock rings
  const T_E = BOSS_TUNE.emperor;
  function orbitPoints() {
    const c = centre(boss), n = T_E.discs, pts = [];
    for (let i = 0; i < n - (act && act.type === 'discs' ? act.n : 0); i++) {
      const a = st.clock * 5 + (i * TAU) / n;
      pts.push({ x: c.x + Math.cos(a) * T_E.orbit, y: c.y + 0.4 + Math.sin(a) * T_E.orbit * 0.6 });
    }
    return pts;
  }
  function stepDiscs() {
    if (act.stage === 'wind') {
      for (const p of orbitPoints()) {   // the orbit itself is dangerous up close
        for (const f of foes()) { if (f._discCd > st.clock) continue; const part = partNear(f, p.x, p.y, T_E.discR); if (part) { f._discCd = st.clock + 0.5; hurt(f, part, p, { x: Math.sign(f.x - boss.x) || 1, y: 0.3 }, T_E.discDamage * 0.6, 'blade', { x: (Math.sign(f.x - boss.x) || 1) * 3, y: 2 }, 10, 'discs'); } }
      }
      if (act.t < T_E.discWind) return;
      act.stage = 'fling'; act.t = 0; act.n = 0;
    } else if (act.stage === 'fling') {
      while (act.n < T_E.discs && act.t >= act.n * T_E.discGap) {
        const pts = orbitPoints(), p = pts[0] || centre(boss), f = act.foe;
        const c = f ? centre(f) : { x: boss.x + boss.facing * 5, y: p.y };
        const dx = c.x - p.x, dy = c.y - p.y, L = Math.hypot(dx, dy) || 1;
        missiles.push({ kind: 'disc', x: p.x, y: p.y, vx: (dx / L) * T_E.discSpeed, vy: (dy / L) * T_E.discSpeed, t: 0 });
        sfx('swing', { pitch: 1.6, volume: 0.9 });
        act.n++;
      }
      if (act.n >= T_E.discs) { act.stage = 'recover'; act.t = 0; }
    } else if (act.t >= T_E.recover) end(T_E.cd);
  }
  function stepDisc(m, dt) {
    m.t += dt;
    m.x += m.vx * dt; m.y += m.vy * dt;
    for (const f of foes()) {
      const part = partNear(f, m.x, m.y, T_E.discR);
      if (!part) continue;
      hurt(f, part, { x: m.x, y: m.y }, { x: Math.sign(m.vx) || 1, y: 0.2 }, T_E.discDamage, 'blade', { x: m.vx * 0.3, y: 2 }, 12, 'discs');
      fx?.sparks(m.x, m.y, { count: 12, color: '#ffc23d', speed: 6 });
      m.done = true; return;
    }
    const fy = floorY(m.x, null);
    if ((fy !== null && m.y < fy + 0.1) || m.t > T_E.discLife || m.x < bounds.minX - 1 || m.x > bounds.maxX + 1) {
      m.done = true;
      fx?.sparks(m.x, Math.max(m.y, fy ?? m.y), { count: 10, color: '#f2eee6', speed: 5 });
      sfx('hit_metal', { pitch: 1.3, volume: 0.4 });
    }
  }
  function stepNova() {
    if (act.stage === 'wind') {
      boss.ragdoll.setArmRest('B', (boss.facing || 1) * 3.0, armTorque());
      if (act.t < 0.5) return;
      act.stage = 'rings'; act.t = 0; act.n = 0;
    } else if (act.stage === 'rings') {
      while (act.n < T_E.novaCount && act.t >= act.n * T_E.novaGap) {
        const fy = floorY(boss.x, boss.y - 1.2 * boss.scale);
        novas.push({ x: boss.x, y: fy, r: 0.6, t: 0, hit: new Set() });
        sfx('slam', { pitch: 1.5, volume: 0.6 });
        fx?.shake(10);
        act.n++;
      }
      if (act.n >= T_E.novaCount) { act.stage = 'recover'; act.t = 0; }
    } else if (act.t >= T_E.recover) end(T_E.cd);
  }
  function updateNovas(dt) {
    for (const n of novas) {
      n.t += dt; n.r += T_E.novaSpeed * dt;
      for (const f of foes()) {
        if (n.hit.has(f)) continue;
        const d = Math.abs(f.x - n.x), ffy = floorY(f.x, null);
        if (Math.abs(d - n.r) > 0.45 || !f.grounded || ffy === null || Math.abs(ffy - n.y) > 1.2) continue;   // jump over it
        n.hit.add(f);
        hurt(f, lowestPart(f), { x: f.x, y: ffy + 0.2 }, { x: Math.sign(f.x - n.x) || 1, y: 0.5 }, T_E.novaDamage, 'explosion', { x: (Math.sign(f.x - n.x) || 1) * 3, y: 6 }, 10, 'nova');
      }
    }
    for (let i = novas.length - 1; i >= 0; i--) if (novas[i].r > T_E.novaRange) novas.splice(i, 1);
  }

  function updateMissiles(dt) {
    for (const m of missiles) {
      if (m.kind === 'anchor') stepAnchorMissile(m, dt);
      else if (m.kind === 'rocket') stepRocket(m, dt);
      else if (m.kind === 'disc') stepDisc(m, dt);
    }
    for (let i = missiles.length - 1; i >= 0; i--) if (missiles[i].done) missiles.splice(i, 1);
  }

  function jagged(a, b, n = 7, amp = 0.2) {
    const pts = [[a.x, a.y]];
    const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1, px = -dy / L, py = dx / L;
    for (let i = 1; i < n; i++) { const k = i / n, off = rand(-amp, amp); pts.push([a.x + dx * k + px * off, a.y + dy * k + py * off]); }
    pts.push([b.x, b.y]);
    return pts;
  }

  // ---------------------------------------------------------------- draw (camera space: metres, y-up)
  function wedge(c, s) {
    c.beginPath(); c.moveTo(-s, -0.55 * s); c.lineTo(s, -0.55 * s); c.lineTo(-s, 0.7 * s); c.closePath();
    c.fillStyle = CHEESE; c.fill();
    c.lineWidth = s * 0.14; c.strokeStyle = INK; c.lineJoin = 'round'; c.stroke();
    c.beginPath(); c.moveTo(s * 0.92, -0.49 * s); c.lineTo(-s * 0.9, 0.6 * s);   // rind along the long edge
    c.lineWidth = s * 0.16; c.strokeStyle = RIND; c.stroke();
    c.fillStyle = HOLE; c.beginPath();
    for (const [hx, hy, hr] of [[-0.55, -0.15, 0.16], [0.1, -0.3, 0.11], [-0.7, 0.3, 0.09], [-0.25, 0.05, 0.07]]) { c.moveTo(hx * s + hr * s, hy * s); c.arc(hx * s, hy * s, hr * s, 0, TAU); }
    c.fill();
  }
  function snowball(c, s) {
    c.fillStyle = '#f4faff'; c.beginPath(); c.arc(0, 0, s, 0, TAU); c.fill();
    c.lineWidth = s * 0.14; c.strokeStyle = INK; c.stroke();
    c.fillStyle = '#cfe6f5'; c.beginPath(); c.arc(s * 0.25, -s * 0.25, s * 0.55, 0, TAU); c.fill();
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(-s * 0.3, s * 0.3, s * 0.22, 0, TAU); c.fill();
  }
  function glow(c, x, y, r, a, cols = ['#ff3b2f', '#ff6a3a', '#fff3c9']) {
    c.globalAlpha = a * 0.35; c.fillStyle = cols[0]; c.beginPath(); c.arc(x, y, r * 2.2, 0, TAU); c.fill();
    c.globalAlpha = a * 0.8; c.fillStyle = cols[1]; c.beginPath(); c.arc(x, y, r * 1.2, 0, TAU); c.fill();
    c.globalAlpha = a; c.fillStyle = cols[2]; c.beginPath(); c.arc(x, y, r * 0.55, 0, TAU); c.fill();
  }
  function strokePts(c, pts) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke(); }
  function floorMarker(c, x, y, r, col, u) {
    c.globalAlpha = 0.15 + 0.2 * u; c.fillStyle = col;
    c.beginPath(); c.ellipse(x, y + 0.02, r * (0.5 + 0.5 * u), 0.16, 0, 0, TAU); c.fill();
    c.globalAlpha = 0.5 + 0.4 * Math.abs(Math.sin(st.clock * 14)); c.strokeStyle = col; c.lineWidth = 0.05;
    c.beginPath(); c.ellipse(x, y + 0.02, r, 0.16, 0, 0, TAU); c.stroke();
  }
  function icicle(c, x, y, len) {
    c.globalAlpha = 1; c.fillStyle = '#dff4ff'; c.strokeStyle = '#7fb8d6'; c.lineWidth = 0.035;
    c.beginPath(); c.moveTo(x - 0.16, y + len * 0.35); c.lineTo(x + 0.16, y + len * 0.35); c.lineTo(x, y - len * 0.65); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(x - 0.06, y + len * 0.3); c.lineTo(x - 0.01, y + len * 0.3); c.lineTo(x - 0.02, y - len * 0.3); c.closePath(); c.fill();
  }
  function tentacle(c, x, y, h, t) {
    if (h <= 0.05) return;
    const sway = Math.sin(t * 9 + x) * 0.35;
    c.globalAlpha = 1; c.fillStyle = '#c86b9e'; c.strokeStyle = INK; c.lineWidth = 0.04;
    c.beginPath(); c.moveTo(x - 0.3, y);
    c.quadraticCurveTo(x - 0.35 + sway * 0.5, y + h * 0.55, x + sway, y + h);
    c.quadraticCurveTo(x + 0.3 + sway * 0.5, y + h * 0.5, x + 0.3, y);
    c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#f3c1dc'; c.beginPath();
    for (let k = 1; k <= 4; k++) { const u = k / 5; const px = x - 0.22 + sway * u * 0.8 + 0.06, py = y + h * u * 0.9; c.moveTo(px + 0.06 * (1 - u) + 0.03, py); c.arc(px, py, 0.06 * (1 - u) + 0.03, 0, TAU); }
    c.fill();
  }
  function fireball(c, x, y, vx, vy) {
    const L = Math.hypot(vx, vy) || 1;
    c.globalAlpha = 0.5; c.strokeStyle = '#ff7a2a'; c.lineWidth = 0.4; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x, y); c.lineTo(x - (vx / L) * 1.6, y - (vy / L) * 1.6); c.stroke();
    glow(c, x, y, 0.22, 1, ['#ff5a2a', '#ff9a3a', '#ffe8a8']);
    c.globalAlpha = 1; c.fillStyle = '#4a2a20'; c.beginPath(); c.arc(x, y, 0.2, 0, TAU); c.fill();
    c.fillStyle = '#ff7a2a'; c.beginPath(); c.arc(x + 0.06, y + 0.05, 0.07, 0, TAU); c.fill();
  }
  function anchorShape(c, x, y, ang) {
    c.save(); c.translate(x, y); c.rotate(ang - Math.PI / 2);
    c.strokeStyle = '#6f7782'; c.lineWidth = 0.09; c.lineCap = 'round';
    c.beginPath(); c.moveTo(0, 0.35); c.lineTo(0, -0.3); c.moveTo(-0.2, 0.18); c.lineTo(0.2, 0.18); c.stroke();
    c.beginPath(); c.arc(0, -0.05, 0.3, Math.PI * 1.15, Math.PI * 1.85, false); c.stroke();
    c.lineWidth = 0.05; c.beginPath(); c.arc(0, 0.42, 0.08, 0, TAU); c.stroke();
    c.restore();
  }
  function rocketShape(c, m) {
    c.save(); c.translate(m.x, m.y); c.rotate(m.ang);
    const fl = 0.25 + 0.12 * Math.sin(st.clock * 40 + m.x);
    c.fillStyle = '#ff9a3a'; c.beginPath(); c.moveTo(-0.3, 0.08); c.lineTo(-0.3 - fl, 0); c.lineTo(-0.3, -0.08); c.closePath(); c.fill();
    c.fillStyle = m.owner === 'boss' ? '#e8ecef' : '#ffe36a'; c.strokeStyle = INK; c.lineWidth = 0.03;
    c.beginPath(); c.roundRect(-0.3, -0.1, 0.46, 0.2, 0.06); c.fill(); c.stroke();
    c.fillStyle = '#d8432f'; c.beginPath(); c.moveTo(0.16, -0.1); c.lineTo(0.34, 0); c.lineTo(0.16, 0.1); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-0.3, 0.1); c.lineTo(-0.38, 0.18); c.lineTo(-0.18, 0.1); c.closePath(); c.moveTo(-0.3, -0.1); c.lineTo(-0.38, -0.18); c.lineTo(-0.18, -0.1); c.closePath(); c.fill();
    c.restore();
  }
  function discShape(c, x, y, r, spin) {
    c.save(); c.translate(x, y); c.rotate(spin);
    c.fillStyle = '#c3cad2'; c.beginPath();
    for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; c.moveTo(Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.9); c.lineTo(Math.cos(a + 0.18) * r * 1.25, Math.sin(a + 0.18) * r * 1.25); c.lineTo(Math.cos(a + 0.4) * r * 0.9, Math.sin(a + 0.4) * r * 0.9); }
    c.fill();
    c.fillStyle = '#c98a4b'; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
    c.strokeStyle = INK; c.lineWidth = 0.03; c.stroke();
    c.fillStyle = '#ffd35a'; c.beginPath(); c.arc(0, 0, r * 0.78, 0, TAU); c.fill();
    c.fillStyle = '#c23b2c'; c.beginPath();
    for (const [px, py] of [[0.3, 0.2], [-0.35, 0.1], [0.05, -0.4], [-0.1, 0.42]]) { c.moveTo(px * r + r * 0.15, py * r); c.arc(px * r, py * r, r * 0.15, 0, TAU); }
    c.fill();
    c.restore();
  }

  function draw(c) {
    const t = st.clock;
    c.save();
    c.lineCap = 'round'; c.lineJoin = 'round';
    // slam: warning zone on the floor during the wind-up / leap, then the shockwave
    if (act && act.type === 'slam' && act.stage !== 'recover' && !boss.dead) {
      const fy = floorY(boss.x, boss.y - 1.2 * boss.scale), R = T_S.radius;
      const pulse = 0.5 + 0.5 * Math.sin(t * 18);
      c.globalAlpha = 0.14 + 0.1 * pulse; c.fillStyle = '#d8432f';
      c.beginPath(); c.ellipse(boss.x, fy, R, 0.28, 0, 0, TAU); c.fill();
      c.globalAlpha = 0.55 + 0.35 * pulse; c.strokeStyle = '#d8432f'; c.lineWidth = 0.07; c.setLineDash([0.3, 0.18]);
      c.beginPath(); c.ellipse(boss.x, fy, R, 0.28, 0, 0, TAU); c.stroke();
      c.setLineDash([]);
    }
    for (const w of waves) {
      const u = w.t / w.dur, x = w.R * u, h = 1.1 * (1 - u) + 0.1;
      c.globalAlpha = 1 - u;
      for (const side of [-1, 1]) {
        c.fillStyle = '#f2eee6';
        c.beginPath(); c.ellipse(w.x + side * x, w.y + h * 0.5, 0.16 + 0.1 * (1 - u), h * 0.5, 0, 0, TAU); c.fill();
        c.strokeStyle = '#d9cbb0'; c.lineWidth = 0.08;
        c.beginPath(); c.moveTo(w.x + side * x * 0.3, w.y + 0.03); c.lineTo(w.x + side * x, w.y + 0.03); c.stroke();
      }
    }
    // shock rings (emperor)
    for (const n of novas) {
      const a = Math.max(0, 1 - n.r / T_E.novaRange);
      for (const side of [-1, 1]) {
        const x = n.x + side * n.r;
        c.globalAlpha = 0.35 * a + 0.2; c.fillStyle = '#ffc23d';
        c.beginPath(); c.ellipse(x, n.y + 0.45, 0.14, 0.45, 0, 0, TAU); c.fill();
        c.globalAlpha = 0.9 * a + 0.1; c.strokeStyle = '#fff3c9'; c.lineWidth = 0.05; c.stroke();
        c.globalAlpha = 0.3 * a; c.strokeStyle = '#ffc23d'; c.lineWidth = 0.1;
        c.beginPath(); c.moveTo(x - side * 0.9, n.y + 0.04); c.lineTo(x, n.y + 0.04); c.stroke();
      }
    }
    // strikes: warnings, then the thing itself
    for (const s of strikes) {
      if (s.stage === 'delay') continue;
      const T = s.T, u = s.stage === 'warn' ? Math.min(1, s.t / T.warn) : 1;
      if (s.kind === 'icicles') {
        if (s.stage === 'warn') { floorMarker(c, s.x, s.fy, T.radius, '#9fd3ee', u); icicle(c, s.x + Math.sin(t * 60) * 0.03 * u, s.y, 0.35 + 0.45 * u); }
        else icicle(c, s.x, s.y, 0.8);
      } else if (s.kind === 'tentacles') {
        if (s.stage === 'warn') {
          floorMarker(c, s.x, s.fy, T.radius, '#c86b9e', u);
          c.fillStyle = '#f3c1dc';
          for (let k = 0; k < 4; k++) { const bu = (t * 1.5 + k * 0.25) % 1; c.globalAlpha = (1 - bu) * u; c.beginPath(); c.arc(s.x + (k - 1.5) * 0.25, s.fy + bu * 0.6, 0.05 + 0.03 * k % 2, 0, TAU); c.fill(); }
        } else {
          const k = s.t < 0.18 ? s.t / 0.18 : s.t < T.rise ? 1 : Math.max(0, 1 - (s.t - T.rise) / 0.35);
          tentacle(c, s.x, s.fy, T.height * k, t);
        }
      } else if (s.kind === 'meteors') {
        floorMarker(c, s.x, s.fy, T.radius, '#ff6a3a', u);
        if (s.stage === 'go' && !s.boom) { const k = Math.min(1, s.t / T.fallTime); fireball(c, s.sx + (s.x - s.sx) * k, s.sy + (s.fy + 0.3 - s.sy) * k, s.x - s.sx, s.fy - s.sy); }
      } else if (s.kind === 'lightning') {
        if (s.stage === 'warn') {
          floorMarker(c, s.x, s.fy, T.radius, '#ffe36a', u);
          c.globalAlpha = 0.25 * u; c.strokeStyle = '#ffe36a'; c.lineWidth = 0.04; c.setLineDash([0.3, 0.3]);
          c.beginPath(); c.moveTo(s.x, s.fy); c.lineTo(s.x, s.fy + 12); c.stroke(); c.setLineDash([]);
        } else if (s.bolt) {
          const a = Math.max(0, 1 - s.t / 0.3);
          c.globalAlpha = a * 0.35; c.strokeStyle = '#ffe36a'; c.lineWidth = 0.4; strokePts(c, s.bolt);
          c.globalAlpha = a; c.strokeStyle = '#fff6c9'; c.lineWidth = 0.1; strokePts(c, s.bolt);
          c.strokeStyle = '#ffffff'; c.lineWidth = 0.04; strokePts(c, s.bolt);
        }
      }
    }
    // held items during wind-ups
    c.globalAlpha = 1;
    if (act && !boss.dead && (act.type === 'cheese' || act.type === 'snowball') && (act.stage === 'wind' || act.stage === 'swing')) {
      const org = backHand(), T = BOSS_TUNE[act.type], u = act.stage === 'swing' ? 1 : Math.min(1, act.t / 0.2);
      c.save(); c.translate(org.x, org.y); c.rotate(Math.sin(t * 20) * 0.12); c.scale(u, u);
      if (act.type === 'cheese') wedge(c, T.size); else snowball(c, T.size);
      c.restore();
    }
    if (act && !boss.dead && act.type === 'anchor' && act.stage === 'wind') { const h = backHand(); anchorShape(c, h.x, h.y, t * 12); }
    for (const p of projectiles) {
      const b = p.body; if (!b || b.__dead) continue;
      const pos = b.getPosition();
      c.save(); c.translate(pos.x, pos.y); c.rotate(b.getAngle());
      if (p.kind === 'snow') snowball(c, p.s); else wedge(c, p.s);
      c.restore();
    }
    // missiles
    for (const m of missiles) {
      if (m.kind === 'anchor') {
        const h = backHand();
        c.globalAlpha = 1; c.strokeStyle = '#97a1ad'; c.lineWidth = 0.05; c.setLineDash([0.08, 0.06]);
        c.beginPath(); c.moveTo(h.x, h.y); c.lineTo(m.x, m.y); c.stroke(); c.setLineDash([]);
        anchorShape(c, m.x, m.y, Math.atan2(m.y - h.y, m.x - h.x));
      } else if (m.kind === 'rocket') rocketShape(c, m);
      else if (m.kind === 'disc') discShape(c, m.x, m.y, T_E.discR, t * 20);
    }
    if (act && !boss.dead && act.type === 'discs' && act.stage !== 'recover') for (const p of orbitPoints()) discShape(c, p.x, p.y, T_E.discR, t * 20);
    // fire breath
    if (act && !boss.dead && act.type === 'flame') {
      const m = mouth();
      if (m && act.stage === 'wind') glow(c, m.x, m.y, 0.08 + 0.1 * Math.min(1, act.t / T_F.wind), 0.9, ['#ff5a2a', '#ff9a3a', '#ffe8a8']);
      if (m && act.stage === 'breath') {
        for (let k = 0; k < 6; k++) {
          const L = T_F.range * (0.55 + 0.45 * Math.abs(Math.sin(t * 17 + k))), spread = T_F.cone * (0.5 + 0.5 * Math.abs(Math.sin(t * 11 + k * 2)));
          const a0 = act.ang - spread, a1 = act.ang + spread;
          c.globalAlpha = k < 3 ? 0.28 : 0.45; c.fillStyle = k < 3 ? '#ff5a2a' : k < 5 ? '#ff9a3a' : '#ffe8a8';
          const Lk = k < 3 ? L : L * (0.75 - k * 0.08);
          c.beginPath(); c.moveTo(m.x, m.y); c.lineTo(m.x + Math.cos(a0) * Lk, m.y + Math.sin(a0) * Lk); c.lineTo(m.x + Math.cos(act.ang) * Lk * 1.08, m.y + Math.sin(act.ang) * Lk * 1.08); c.lineTo(m.x + Math.cos(a1) * Lk, m.y + Math.sin(a1) * Lk); c.closePath(); c.fill();
        }
      }
    }
    // wind gust streaks (inhale: toward the boss; blow: away)
    if (act && !boss.dead && act.type === 'gust' && act.stage !== 'recover') {
      const fy = floorY(boss.x, boss.y - 1.2 * boss.scale), dir = act.dirx || boss.facing || 1, blow = act.stage === 'blow';
      c.strokeStyle = '#e9eef3'; c.lineWidth = blow ? 0.06 : 0.035;
      for (let i = 0; i < (blow ? 22 : 12); i++) {
        const run = ((t * (blow ? 14 : 6) + i * 1.37) % T_G.range);
        const d = blow ? run : T_G.range - run, x = boss.x + dir * d, y = fy + 0.25 + ((i * 0.37) % 3.2);
        c.globalAlpha = (blow ? 0.45 : 0.25) * (1 - d / T_G.range);
        c.beginPath(); c.moveTo(x, y); c.lineTo(x + dir * (blow ? 1.2 : 0.6), y + Math.sin(t * 5 + i) * 0.05); c.stroke();
      }
    }
    // gravity: warning rings on the victims, then a purple aura while lifted
    if (act && !boss.dead && act.type === 'gravity' && act.stage === 'wind') {
      for (const f of foes()) { if (Math.abs(f.x - boss.x) > T_V.range) continue; const cc = centre(f); c.globalAlpha = 0.5 + 0.4 * Math.sin(t * 20); c.strokeStyle = '#b48cff'; c.lineWidth = 0.06; c.beginPath(); c.arc(cc.x, cc.y, 1.1 * (1 - 0.4 * act.t / T_V.wind) * (f.scale || 1), 0, TAU); c.stroke(); }
    }
    for (const [f, L] of lifted) {
      const cc = centre(f);
      c.globalAlpha = L.stage === 'lift' ? 0.22 : 0.12; c.fillStyle = '#8f6bff'; c.beginPath(); c.arc(cc.x, cc.y, 1.0 * (f.scale || 1), 0, TAU); c.fill();
      c.fillStyle = '#e2d4ff';
      for (let k = 0; k < 6; k++) { const up = (t * 1.2 + k / 6) % 1; c.globalAlpha = 0.6 * (1 - up); c.beginPath(); c.arc(cc.x + Math.sin(k * 2.1) * 0.6, cc.y - 0.9 + up * 1.8, 0.04, 0, TAU); c.fill(); }
    }
    // frozen fighters
    for (const [f] of frozen) {
      const cc = centre(f);
      c.globalAlpha = 0.22; c.fillStyle = '#9fe3ff'; c.beginPath(); c.arc(cc.x, cc.y, 0.95 * (f.scale || 1), 0, TAU); c.fill();
      c.globalAlpha = 0.7; c.strokeStyle = '#dff4ff'; c.lineWidth = 0.04;
      for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3 + t * 0.5, x = cc.x + 0.55, y = cc.y + 0.7; c.beginPath(); c.moveTo(x - Math.cos(a) * 0.14, y - Math.sin(a) * 0.14); c.lineTo(x + Math.cos(a) * 0.14, y + Math.sin(a) * 0.14); c.stroke(); }
    }
    // glitch: colour slices around the boss while charging, afterimage where it was
    if (act && !boss.dead && act.type === 'teleport' && act.stage === 'wind') {
      const cc = centre(boss);
      for (let k = 0; k < 7; k++) {
        c.globalAlpha = 0.35 + 0.3 * Math.random(); c.fillStyle = k % 2 ? '#7fe7ff' : '#ff5ad1';
        c.fillRect(cc.x + rand(-0.9, 0.9) * boss.scale, cc.y + rand(-1.2, 1.4) * boss.scale, rand(0.2, 0.7), rand(0.05, 0.14));
      }
    }
    for (const g of ghosts) {
      const a = Math.max(0, 1 - g.t / g.dur);
      c.globalAlpha = 0.45 * a; c.fillStyle = '#c89bff';
      c.beginPath(); for (const [x, y] of g.pts) { c.moveTo(x + g.r, y); c.arc(x, y, g.r, 0, TAU); } c.fill();
    }
    // laser eyes: charge glow + blinking aim line, then the beams
    if (act && act.type === 'laser' && !boss.dead) {
      const pts = eyePoints(), mid = eyeMid();
      if (act.stage === 'wind') {
        const u = Math.min(1, act.t / T_L.wind), locked = act.t >= T_L.track;
        for (const e of pts) glow(c, e.x, e.y, 0.05 + 0.09 * u, 0.5 + 0.5 * u);
        if (mid && act.dir && (locked ? Math.sin(t * 40) > -0.2 : Math.sin(t * 14) > 0)) {
          c.globalAlpha = locked ? 0.85 : 0.45; c.strokeStyle = '#ff3b2f'; c.lineWidth = locked ? 0.05 : 0.03; c.setLineDash([0.28, 0.16]);
          c.beginPath(); c.moveTo(mid.x, mid.y); c.lineTo(mid.x + act.dir.x * act.aimLen, mid.y + act.dir.y * act.aimLen); c.stroke();
          c.setLineDash([]);
        }
      } else if (act.stage === 'fire') for (const e of pts) glow(c, e.x, e.y, 0.15, 1);
    }
    // casting glow for sky strikes
    if (act && !boss.dead && RAIN.has(act.type) && act.stage === 'wind') {
      const h = backHand(), u = Math.min(1, act.t / BOSS_TUNE[act.type].wind);
      const cols = { icicles: ['#9fd3ee', '#dff4ff', '#ffffff'], tentacles: ['#c86b9e', '#f3c1dc', '#ffffff'], meteors: ['#ff5a2a', '#ff9a3a', '#ffe8a8'], lightning: ['#ffe36a', '#fff6c9', '#ffffff'] }[act.type];
      glow(c, h.x, h.y, 0.08 + 0.12 * u, 0.9, cols);
    }
    for (const bm of beams) {
      const a = Math.max(0, 1 - bm.t / bm.dur);
      c.globalAlpha = a * 0.4; c.strokeStyle = '#ff3b2f'; c.lineWidth = 0.34;
      c.beginPath(); c.moveTo(bm.x0, bm.y0); c.lineTo(bm.x1, bm.y1); c.stroke();
      c.globalAlpha = a * 0.9; c.strokeStyle = '#ff7a3a'; c.lineWidth = 0.15; c.stroke();
      c.globalAlpha = a; c.strokeStyle = '#fff3c9'; c.lineWidth = 0.06; c.stroke();
    }
    c.restore();
  }

  function debug() {
    const rd = boss.ragdoll, shB = rd.joints && rd.joints.shoulderB;
    const hp = (h) => { try { const p = rd.handPoint(h); return [+p.x.toFixed(2), +p.y.toFixed(2)]; } catch (e) { return null; } };
    return {
      arm: { shoulderB: shB && !shB.__dead ? +shB.getJointAngle().toFixed(2) : null, restB: rd.ctrl.armRest.B, torqueB: Math.round(rd.ctrl.armTorque.B), handF: hp('F'), handB: hp('B'), pelvis: [+boss.x.toFixed(2), +boss.y.toFixed(2)], facing: boss.facing, spinDir: rd.ctrl.spinDir, reach: rd.ctrl.reach, pull: rd.ctrl.pull },
      special, phase: st.phase, next: +st.next.toFixed(2), act: act ? { type: act.type, stage: act.stage, t: +act.t.toFixed(2) } : null,
      projectiles: projectiles.length, strikes: strikes.length, missiles: missiles.length, novas: novas.length, frozen: frozen.size, lifted: lifted.size,
      cheese: stats.cheese, cheeseHits: stats.cheeseHits, slams: stats.slams, slamHits: stats.slamHits, lasers: stats.lasers, laserHits: stats.laserHits,
      moves: { ...stats.moves }, hits: { ...stats.hits }, damage: +stats.damage.toFixed(1),
    };
  }
  function destroy() {
    for (const p of projectiles) if (p.body && !p.body.__dead) physics.destroyBody(p.body);
    for (const [f] of frozen) unfreeze(f);
    projectiles.length = 0; beams.length = 0; waves.length = 0; strikes.length = 0; missiles.length = 0; novas.length = 0; ghosts.length = 0;
    lifted.clear(); act = null;
  }

  return { filter, update, draw, debug, destroy };
}

export default createBossKit;
