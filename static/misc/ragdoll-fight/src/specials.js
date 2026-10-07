// Premium weapon specials (shop tier 3.5k → 50k):
//   saw     – Buzzsaw Pike (3.5k): the spinning disc grinds what it hits (damage ticks) and spits sparks that ricochet off walls into foes
//   frost   – Frost Scythe (7k): hits chill (slower swings); 3 quick hits or a crit freeze the foe solid (can't fight, slides like ice);
//             hitting a frozen foe SHATTERS the ice for big damage
//   fire    – Dragon Blade (10k): every hit sets the victim burning (damage ticks for a few seconds, flames on the blade)
//   gravity – Gravity Mace (12.5k): a hard hit launches the foe straight up, holds them in the air, then slams them down (shockwave)
//   void    – Void Maul (15k): the black-hole head drags nearby foes toward it; a hard hit implodes (area damage + blast)
//   meteor  – Meteor Staff (17.5k): hits call a volley of meteors down on the foe (area blasts + short burn)
//   storm   – Storm Glaive (20k): always crackling with electricity; hits chain lightning through nearby foes, fast spins zap
//   sun     – Sun Hammer (30k): spinning charges the sun head; at full charge the next hit (or a foe in reach) sets off a SUPERNOVA
//   plasma  – Plasma Katana (50k): the beam blade extends up to +1.5 m while spinning; hits are repeated by a ghost echo slash
// createSpecials({ physics, fighters: () => [...], fx, sfx, hooks }) -> { onHit(evt), update(dt), draw(ctx), destroy(), debug() }
// Extra damage is dealt as source 'special' events (fighter.applyHit + hooks.onHit), so it never re-triggers specials.
// Strength scales with the weapon instance (upgrades): powerOf(w) = w.power × w.damage / def.damage (1 for a stock weapon).
// Effects never touch dead bodies (isFoe checks victim.dead) and never hurt the wielder; every effect list is capped.
import { weaponPoint } from './weapons.js';
import { V } from './physics.js';

export const SPECIALS_TUNE = {
  fire:    { burnTime: 3.2, tick: 0.4, damage: 3 },
  void:    { radius: 3.2, pull: 9, burstSpeed: 9, burstCd: 1.2, burstRadius: 2.5, burstDamage: 14, burstKnock: 7 },
  storm:   { cd: 0.35, damage: 12, chains: 3, chainRange: 6, arcEvery: 2.2, arcRange: 3, arcDamage: 5, arcSpin: 8 },
  saw:     { grindTime: 0.45, tick: 0.11, grindDamage: 1.8, reach: 0.6, push: 0.3, shards: 4, shardCd: 0.3, shardSpeed: 8.5, shardDamage: 5, shardLife: 0.8, maxShards: 28 },
  frost:   { stacks: 3, chillTime: 1.8, chillSlow: 0.55, freezeTime: 1.9, bossFreeze: 1.0, shatterAfter: 0.3, friction: 0.03, immune: 1.1, shatterDamage: 24, shatterKnock: 6 },
  gravity: { cd: 1.2, minSpeed: 6, liftVy: 10, liftTime: 0.42, hang: 0.15, slamVy: 18, slamDamage: 36, shockRadius: 2.6, shockDamage: 12, bossLift: 0.55, victimCd: 2.0 },
  meteor:  { cd: 0.85, count: 3, spread: 1.25, height: 8, drift: 2.6, fall: 0.5, stagger: 0.13, radius: 1.7, damage: 16, knock: 5, burn: 1.4, maxMeteors: 12 },
  sun:     { chargeTime: 1.5, hitCharge: 0.25, decay: 0.2, radius: 4.2, damage: 65, knock: 2.5, lift: 4, burn: 3.2, proximity: 1.8 },   // low knock: a nova must not blast foes out of reach
  plasma:  { ext: 1.5, extSpin: 7, beamFrom: 1.2, beamDamage: 0.55, beamCd: 0.22, minSpeed: 5, echoDelay: 0.2, echo: 0.5, echoCd: 0.1, maxEchoes: 10 },
};
// effect anchor per special, in the weapon frame (grip at origin, +x along the weapon)
const TIP = { fire: [1.35, 0.02], void: [1.62, 0], storm: [2.05, 0.05], saw: [1.62, 0], frost: [1.2, 0.45], gravity: [1.28, 0], meteor: [1.9, 0], sun: [1.45, 0], plasma: [1.25, 0] };
const MAX_RINGS = 24, MAX_BOLTS = 16, MAX_FLARES = 4;
const rand = (a, b) => a + Math.random() * (b - a);
const TAU = Math.PI * 2;

export function createSpecials(o = {}) {
  const { physics, fx } = o;
  const sfx = o.sfx || (() => {});
  const hooks = o.hooks || {};
  const all = () => (o.fighters ? o.fighters() : []);
  const T = SPECIALS_TUNE;
  const F = T.fire, VD = T.void, ST = T.storm, SW = T.saw, FR = T.frost, GR = T.gravity, MT = T.meteor, SN = T.sun, PL = T.plasma;
  const burning = new Map();    // fighter -> { t, tick, atk, pow }
  const grinds = new Map();     // fighter -> { t, tick, atk, w }
  const chills = new Map();     // fighter -> { stacks, t, frozen, age, immune, spin0, saved, atk, pow }
  const launched = new Map();   // fighter -> { phase, t, atk, pow }
  const gravCd = new Map();     // fighter -> clock of its last slam (no juggling a foe forever)
  const beamCd = new Map();     // 'weaponUid>fighterId' -> clock
  const bolts = [], rings = [], shards = [], meteors = [], echoes = [], flares = [];
  const stats = { ignites: 0, burnDamage: 0, pulls: 0, bursts: 0, chainHits: 0, zaps: 0, grindTicks: 0, shardHits: 0, freezes: 0, shatters: 0, launches: 0, slams: 0, meteors: 0, novas: 0, beamHits: 0, echoes: 0 };
  let clock = 0;
  const capPush = (arr, item, max) => { if (arr.length >= max) arr.shift(); arr.push(item); };

  const isFoe = (a, b) => a && b && a !== b && !b.dead && !(a.side === 'enemy' && b.side === 'enemy');
  const centre = (f) => ({ x: f.x, y: f.y + 0.35 * (f.scale || 1) });
  const tip = (w) => weaponPoint(w, TIP[w.special][0], TIP[w.special][1]);
  const powerOf = (w) => (w ? (w.power || 1) * (w.damage && w.def && w.def.damage ? w.damage / w.def.damage : 1) : 1);
  const isBig = (f) => (f.scale || 1) > 1.3;
  const unit = (x, y) => { const l = Math.hypot(x, y) || 1; return { x: x / l, y: y / l }; };
  const liveParts = (f) => Object.entries(f.ragdoll.parts).filter(([name, b]) => b && !b.__removed && !b.__dead && !f.ragdoll.detached[name]);
  function nearestPartD(f, p) {
    let best = 'spine1', bd = Infinity;
    for (const [name, b] of liveParts(f)) {
      const q = b.getPosition(), d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2;
      if (d < bd) { bd = d; best = name; }
    }
    return { name: best, d: Math.sqrt(bd) };
  }
  const nearestPart = (f, p) => nearestPartD(f, p).name;
  function segDist(q, a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, L2 = dx * dx + dy * dy || 1e-9;
    const k = Math.max(0, Math.min(1, ((q.x - a.x) * dx + (q.y - a.y) * dy) / L2));
    const x = a.x + dx * k, y = a.y + dy * k;
    return { d: Math.hypot(q.x - x, q.y - y), x, y };
  }
  // ray against level geometry (statics + non-dynamic hazard platforms)
  function rayStatic(x0, y0, x1, y1) {
    if ((x1 - x0) ** 2 + (y1 - y0) ** 2 < 1e-8) return null;
    let hit = null;
    physics.world.rayCast(V(x0, y0), V(x1, y1), (fix, point, normal, fraction) => {
      const ud = fix.getUserData();
      if (!ud || !(ud.kind === 'static' || (ud.kind === 'hazard' && !fix.getBody().isDynamic()))) return -1;
      hit = { x: point.x, y: point.y, nx: normal.x, ny: normal.y };
      return fraction;
    });
    return hit;
  }
  function groundBelow(x, y, depth = 12) { const h = rayStatic(x, y, x, y - depth); return h && h.ny > 0.4 ? h.y : null; }

  function deal(attacker, f, dmg, kind, dir, kick, point) {
    if (!f || f.dead || !(dmg > 0)) return 0;
    const d = dmg / (f.toughness || 1);
    const p = point || centre(f);
    const evt = {
      attacker, victim: f, part: nearestPart(f, p), point: p, normal: dir, speed: 10, impulse: 0, damage: d, isCrit: false,
      source: 'special', kind, weaponId: null, weapon: null, isBlade: false, hazard: null,
      attackerVel: { x: dir.x * 10, y: dir.y * 10 }, relVel: { x: dir.x * 10, y: dir.y * 10 }, time: physics.time, wasDead: false,
    };
    f.applyHit(evt);
    if (kick && !f.dead) f.ragdoll.addVelocity(kick.x, kick.y);
    if (hooks.onHit) hooks.onHit(evt);
    return d;
  }

  // ---------------------------------------------------------------- hits
  function onHit(e) {
    if (e.source === 'special' || e.source === 'boss' || !e.weapon || e.wasDead) return;
    const w = e.weapon, atk = e.attacker, v = e.victim;
    if (!w.special || !atk || !isFoe(atk, v)) return;
    switch (w.special) {
      case 'fire': ignite(v, atk, F.burnTime, powerOf(w)); break;
      case 'void': if (e.speed >= VD.burstSpeed && clock - (w._burstT ?? -99) >= VD.burstCd) { w._burstT = clock; voidBurst(w, atk); } break;
      case 'storm': if (clock - (w._stormT ?? -99) >= ST.cd) { w._stormT = clock; chainLightning(w, atk, v); } break;
      case 'saw': sawHit(w, atk, v); break;
      case 'frost': frostHit(w, atk, v, e); break;
      case 'gravity':
        if (e.speed >= GR.minSpeed && clock - (w._gravT ?? -99) >= GR.cd && !launched.has(v) && clock - (gravCd.get(v) ?? -99) >= GR.victimCd) { w._gravT = clock; launch(w, atk, v); }
        break;
      case 'meteor': if (clock - (w._metT ?? -99) >= MT.cd) { w._metT = clock; callMeteors(w, atk, v); } break;
      case 'sun': if ((w._charge || 0) >= 1) nova(w, atk); else w._charge = Math.min(1, (w._charge || 0) + SN.hitCharge); break;
      case 'plasma':
        beamCd.set(w.uid + '>' + v.id, clock);
        echo(w, atk, v, e.damage * (v.toughness || 1), e.point, e.attackerVel);
        break;
    }
  }

  function ignite(f, atk, time = F.burnTime, pow = 1) {
    const cur = burning.get(f);
    if (!cur) {
      stats.ignites++;
      sfx('fire', { volume: 0.7, pitch: 1.1 });
      const c = centre(f);
      fx?.popText(c.x, c.y + 1.2 * (f.scale || 1), 'BURNING!', { color: '#ff8a2a', size: 30 });
    }
    burning.set(f, { t: Math.max(time, cur ? cur.t : 0), tick: cur ? cur.tick : 0.15, atk, pow: Math.max(pow, cur ? cur.pow : 0) });
  }

  function voidBurst(w, atk) {
    const h = tip(w), pow = powerOf(w);
    stats.bursts++;
    sfx('explosion', { pitch: 0.55, volume: 0.8 });
    fx?.flash('#8f6bff', 70);
    fx?.shake(14);
    fx?.hitstop(40);
    fx?.sparks(h.x, h.y, { count: 26, color: '#b48cff', speed: 8 });
    fx?.sparks(h.x, h.y, { count: 12, color: '#f2eee6', speed: 5 });
    capPush(rings, { x: h.x, y: h.y, t: 0, dur: 0.45, R: VD.burstRadius, col: '#b48cff' }, MAX_RINGS);
    for (const f of all()) {
      if (!isFoe(atk, f)) continue;
      const c = centre(f), dx = c.x - h.x, dy = c.y - h.y, d = Math.hypot(dx, dy);
      if (d > VD.burstRadius) continue;
      const fall = 1 - d / VD.burstRadius, nx = d > 0.05 ? dx / d : atk.facing || 1, ny = d > 0.05 ? dy / d : 0;
      deal(atk, f, VD.burstDamage * pow * (0.5 + 0.5 * fall), 'explosion', { x: nx, y: ny }, { x: nx * VD.burstKnock * (0.4 + 0.6 * fall), y: 2.5 + 4 * fall });
    }
  }

  function jagged(a, b, n = 7, amp = 0.2) {
    const pts = [[a.x, a.y]];
    const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1, px = -dy / L, py = dx / L;
    for (let i = 1; i < n; i++) { const k = i / n, off = rand(-amp, amp) * Math.min(1, L / 1.5); pts.push([a.x + dx * k + px * off, a.y + dy * k + py * off]); }
    pts.push([b.x, b.y]);
    return pts;
  }

  function chainLightning(w, atk, first) {
    const from = tip(w), pow = powerOf(w);
    const hit = [first];
    let cur = first, prev = from;
    deal(atk, first, ST.damage * pow, 'laser', { x: atk.facing || 1, y: 0.2 }, null);
    capPush(bolts, { pts: jagged(prev, centre(first)), t: 0, dur: 0.28 }, MAX_BOLTS);
    for (let k = 0; k < ST.chains; k++) {
      const c0 = centre(cur);
      let next = null, nd = ST.chainRange;
      for (const f of all()) {
        if (!isFoe(atk, f) || hit.includes(f)) continue;
        const c = centre(f), d = Math.hypot(c.x - c0.x, c.y - c0.y);
        if (d < nd) { nd = d; next = f; }
      }
      if (!next) break;
      const c1 = centre(next);
      capPush(bolts, { pts: jagged(c0, c1, 9, 0.35), t: 0, dur: 0.32 }, MAX_BOLTS);
      deal(atk, next, ST.damage * pow, 'laser', { x: Math.sign(c1.x - c0.x) || 1, y: 0.2 }, { x: (Math.sign(c1.x - c0.x) || 1) * 1.5, y: 1.5 });
      fx?.sparks(c1.x, c1.y, { count: 14, color: '#7fe7ff', speed: 6 });
      hit.push(next); cur = next;
    }
    stats.chainHits += hit.length;
    const c = centre(first);
    fx?.sparks(c.x, c.y, { count: 18, color: '#7fe7ff', speed: 7 });
    fx?.sparks(c.x, c.y, { count: 8, color: '#f4fdff', speed: 4 });
    fx?.flash('#bff4ff', 45);
    fx?.shake(9);
    sfx('laser', { pitch: 1.45, volume: 0.85 });
  }

  // ---- saw: grind + ricochet sparks
  function sawHit(w, atk, v) {
    const g = grinds.get(v);
    grinds.set(v, { t: SW.grindTime, tick: g ? g.tick : SW.tick * 0.5, atk, w });
    if (clock - (w._shardT ?? -99) < SW.shardCd) return;
    w._shardT = clock;
    const h = tip(w), c = centre(v), away = Math.atan2(h.y - c.y, h.x - c.x), pow = powerOf(w);
    for (let i = 0; i < SW.shards; i++) {
      const a = away + rand(-1.1, 1.1), sp = SW.shardSpeed * rand(0.7, 1.15);
      capPush(shards, { x: h.x, y: h.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp + 2.5, t: SW.shardLife, atk, pow, skip: v, bounces: 0 }, SW.maxShards);
    }
    fx?.sparks(h.x, h.y, { count: 16, color: '#ffc23d', speed: 9 });
    sfx('hit_metal', { pitch: 1.8, volume: 0.6 });
  }

  // ---- frost: chill -> freeze solid -> shatter
  function frostHit(w, atk, v, e) {
    let s = chills.get(v);
    if (!s) { s = { stacks: 0, t: 0, frozen: 0, age: 0, immune: 0, spin0: v.spinMult || 1, saved: null, atk, pow: 1 }; chills.set(v, s); }
    s.atk = atk; s.pow = powerOf(w);
    if (s.frozen > 0) { if (s.age >= FR.shatterAfter) shatter(v, s); return; }
    s.t = FR.chillTime;
    fx?.sparks(e.point.x, e.point.y, { count: 12, color: '#bfefff', speed: 5 });
    if (s.immune > 0) return;
    s.stacks++;
    if (s.stacks >= FR.stacks || e.isCrit) freeze(v, s);
  }
  function freeze(f, s) {
    s.frozen = isBig(f) ? FR.bossFreeze : FR.freezeTime; s.age = 0; s.stacks = 0;
    s.saved = [];
    for (const b of f.ragdoll.partList) {
      if (!b || b.__removed || b.__dead) continue;
      const fr = [];
      for (let fix = b.getFixtureList(); fix; fix = fix.getNext()) { fr.push([fix, fix.getFriction()]); fix.setFriction(FR.friction); }
      s.saved.push({ b, fr, ad: b.getAngularDamping ? b.getAngularDamping() : 0.3 });
      b.setAngularDamping(10);   // stiff statue
      for (let ce = b.getContactList(); ce; ce = ce.next) if (ce.contact.resetFriction) ce.contact.resetFriction();
    }
    f.spinSpeed = 0;
    stats.freezes++;
    const c = centre(f);
    fx?.popText(c.x, c.y + 1.2 * (f.scale || 1), 'FROZEN!', { color: '#9fe3ff', size: 32 });
    fx?.sparks(c.x, c.y, { count: 26, color: '#dff6ff', speed: 6 });
    fx?.flash('#cfefff', 50);
    sfx('hit_metal', { pitch: 2.1, volume: 0.7 });
    capPush(rings, { x: c.x, y: c.y, t: 0, dur: 0.4, R: 1.4, col: '#9fe3ff' }, MAX_RINGS);
  }
  function thaw(f, s) {
    if (s.saved) for (const { b, fr, ad } of s.saved) {
      if (b.__removed) continue;
      for (const [fix, v] of fr) if (!fix.__dead) fix.setFriction(v);
      b.setAngularDamping(ad);
      for (let ce = b.getContactList(); ce; ce = ce.next) if (ce.contact.resetFriction) ce.contact.resetFriction();
    }
    s.saved = null; s.frozen = 0; s.immune = FR.immune;
  }
  function shatter(f, s) {
    thaw(f, s);
    s.t = 0; s.stacks = 0;
    const c = centre(f), atk = s.atk, dx = Math.sign(c.x - atk.x) || atk.facing || 1;
    stats.shatters++;
    fx?.sparks(c.x, c.y, { count: 34, color: '#dff6ff', speed: 10 });
    fx?.sparks(c.x, c.y, { count: 18, color: '#6cc8f0', speed: 7 });
    fx?.popText(c.x, c.y + 1.3 * (f.scale || 1), 'SHATTER!', { color: '#bfefff', size: 40 });
    fx?.shake(14); fx?.hitstop(45); fx?.flash('#e6f8ff', 60);
    sfx('hit_metal', { pitch: 1.4, volume: 0.9 }); sfx('crit', { pitch: 1.6, volume: 0.6 });
    capPush(rings, { x: c.x, y: c.y, t: 0, dur: 0.35, R: 1.9, col: '#dff6ff' }, MAX_RINGS);
    deal(atk, f, FR.shatterDamage * (s.pow || 1), 'explosion', { x: dx, y: 0.3 }, { x: dx * FR.shatterKnock, y: 3 }, c);
  }

  // ---- gravity: launch -> hang -> slam
  function launch(w, atk, v) {
    if (v.gripping && v.releaseGrips) v.releaseGrips();
    launched.set(v, { phase: 'up', t: 0, atk, pow: powerOf(w) });
    stats.launches++;
    const c = centre(v);
    fx?.popText(c.x, c.y + 1.2 * (v.scale || 1), 'LIFT OFF!', { color: '#5ff2d8', size: 32 });
    fx?.sparks(c.x, c.y - 0.6, { count: 20, color: '#5ff2d8', speed: 7, dir: [0, 1], spread: 1.2 });
    capPush(rings, { x: c.x, y: v.ragdoll.lowestFootY(), t: 0, dur: 0.45, R: 1.3, col: '#c86bff' }, MAX_RINGS);
    sfx('laser_charge', { pitch: 0.7, volume: 0.8 });
  }
  function slamImpact(f, L) {
    const p = { x: f.x, y: f.ragdoll.lowestFootY() };
    stats.slams++;
    gravCd.set(f, clock);
    deal(L.atk, f, GR.slamDamage * L.pow, 'explosion', { x: 0, y: -1 }, null, { x: f.x, y: f.y });
    for (const g of all()) {
      if (g === f || !isFoe(L.atk, g)) continue;
      const c = centre(g), dx = c.x - p.x, d = Math.hypot(dx, c.y - p.y);
      if (d > GR.shockRadius) continue;
      const fall = 1 - d / GR.shockRadius, nx = Math.sign(dx) || 1;
      deal(L.atk, g, GR.shockDamage * L.pow * (0.5 + 0.5 * fall), 'explosion', { x: nx, y: 0.5 }, { x: nx * 3 * fall, y: 3 + 3 * fall }, c);
    }
    fx?.sparks(p.x, p.y + 0.1, { count: 30, color: '#c86bff', speed: 9, dir: [0, 1], spread: 2.6 });
    fx?.sparks(p.x, p.y + 0.1, { count: 16, color: '#5ff2d8', speed: 6 });
    fx?.popText(p.x, p.y + 2.2 * (f.scale || 1), 'SLAM!', { color: '#c86bff', size: 40 });
    fx?.shake(18); fx?.hitstop(50);
    capPush(rings, { x: p.x, y: p.y, t: 0, dur: 0.5, R: GR.shockRadius, col: '#c86bff', flat: true }, MAX_RINGS);
    capPush(rings, { x: p.x, y: p.y, t: 0, dur: 0.35, R: GR.shockRadius * 0.6, col: '#5ff2d8', flat: true }, MAX_RINGS);
    sfx('slam', { volume: 0.9 });
  }

  // ---- meteors
  function callMeteors(w, atk, v) {
    const pow = powerOf(w), side = Math.sign(v.x - atk.x) || atk.facing || 1;
    const offs = [0, -MT.spread, MT.spread];
    for (let i = 0; i < MT.count; i++) {
      const tx = v.x + (offs[i % 3] || 0) * rand(0.75, 1.15);
      const ty = groundBelow(tx, v.y + 1.5) ?? v.ragdoll.lowestFootY();
      capPush(meteors, { tx, ty, x0: tx - side * MT.drift, y0: ty + MT.height, t: -i * MT.stagger, atk, pow, r: rand(0.17, 0.25) }, MT.maxMeteors);
    }
    stats.meteors += MT.count;
    const c = centre(v);
    fx?.popText(c.x, c.y + 1.4 * (v.scale || 1), 'METEORS!', { color: '#ff8a2a', size: 30 });
    sfx('laser_charge', { pitch: 0.45, volume: 0.7 });
  }
  function meteorBlast(m) {
    const x = m.tx, y = m.ty + 0.15;
    for (const f of all()) {
      if (!isFoe(m.atk, f)) continue;
      const c = centre(f), dx = c.x - x, dy = (c.y - y) * 0.7, d = Math.hypot(dx, dy);
      if (d > MT.radius) continue;
      const fall = 1 - d / MT.radius, nx = Math.sign(dx) || 1;
      deal(m.atk, f, MT.damage * m.pow * (0.5 + 0.5 * fall), 'explosion', { x: nx, y: 0.6 }, { x: nx * MT.knock * 0.5 * fall, y: 2 + MT.knock * 0.6 * fall }, { x: c.x, y: c.y });
      if (!f.dead) ignite(f, m.atk, MT.burn, m.pow);
    }
    fx?.sparks(x, y, { count: 22, color: '#ffc23d', speed: 9, dir: [0, 1], spread: 2.8 });
    fx?.sparks(x, y, { count: 12, color: '#ff5a1f', speed: 6 });
    fx?.sparks(x, y, { count: 6, color: '#3a2f2c', speed: 5, dir: [0, 1], spread: 1.6 });
    fx?.shake(9);
    capPush(rings, { x, y, t: 0, dur: 0.4, R: MT.radius, col: '#ff8a2a', flat: true }, MAX_RINGS);
    sfx('explosion', { pitch: 1.25, volume: 0.55 });
  }

  // ---- sun: supernova
  function nova(w, atk) {
    w._charge = 0;
    const h = tip(w), pow = powerOf(w);
    stats.novas++;
    for (const f of all()) {
      if (!isFoe(atk, f)) continue;
      const c = centre(f), dx = c.x - h.x, dy = c.y - h.y, d = Math.hypot(dx, dy);
      if (d > SN.radius) continue;
      const fall = 1 - d / SN.radius, nx = d > 0.05 ? dx / d : atk.facing || 1, ny = d > 0.05 ? dy / d : 0;
      deal(atk, f, SN.damage * pow * (0.55 + 0.45 * fall), 'explosion', { x: nx, y: ny }, { x: nx * SN.knock * (0.4 + 0.6 * fall), y: SN.lift * (0.5 + 0.5 * fall) }, c);
      if (!f.dead) ignite(f, atk, SN.burn, pow);
    }
    capPush(rings, { x: h.x, y: h.y, t: 0, dur: 0.55, R: SN.radius, col: '#ffc23d' }, MAX_RINGS);
    capPush(rings, { x: h.x, y: h.y, t: 0, dur: 0.4, R: SN.radius * 0.7, col: '#fff3b0' }, MAX_RINGS);
    capPush(rings, { x: h.x, y: h.y, t: 0, dur: 0.7, R: SN.radius * 1.15, col: '#ff7a2a' }, MAX_RINGS);
    capPush(flares, { x: h.x, y: h.y, t: 0, dur: 0.5, rot: rand(0, TAU) }, MAX_FLARES);
    fx?.flash('#fff1a8', 110); fx?.shake(24); fx?.hitstop(60);
    fx?.sparks(h.x, h.y, { count: 40, color: '#ffe27a', speed: 12 });
    fx?.sparks(h.x, h.y, { count: 24, color: '#ff8a2a', speed: 8 });
    fx?.popText(h.x, h.y + 1.4, 'SUPERNOVA!', { color: '#ffd23d', size: 46 });
    sfx('explosion', { pitch: 0.75, volume: 1 }); sfx('fire', { pitch: 0.8, volume: 0.8 });
  }

  // ---- plasma: ghost echo slash
  function echo(w, atk, f, dmg, point, vel) {
    if (clock - (w._echoT ?? -99) < PL.echoCd || !(dmg > 0)) return;
    w._echoT = clock;
    const ang = vel ? Math.atan2(vel.y, vel.x) : 0;
    capPush(echoes, { f, atk, t: 0, dmg: dmg * PL.echo, ang, done: false }, PL.maxEchoes);
  }

  // ---------------------------------------------------------------- per step
  function update(dt) {
    clock += dt;
    for (const [f, b] of burning) {
      if (f.dead) { burning.delete(f); continue; }
      b.t -= dt; b.tick -= dt;
      if (b.tick <= 0) { b.tick = F.tick; stats.burnDamage += deal(b.atk, f, F.damage * (b.pow || 1), 'fire', { x: 0, y: 1 }, null); }
      if (Math.random() < dt * 22) { const c = centre(f); fx?.sparks(c.x + rand(-0.25, 0.25), c.y + rand(-0.5, 0.6), { count: 1, color: Math.random() < 0.5 ? '#ffc23d' : '#ff7a2a', speed: 1.6 }); }
      if (b.t <= 0) burning.delete(f);
    }
    // saw grinding
    for (const [f, g] of grinds) {
      if (f.dead || g.w.destroyed || g.w.holder !== g.atk) { grinds.delete(f); continue; }
      g.t -= dt; g.tick -= dt;
      if (g.tick <= 0) {
        g.tick = SW.tick;
        const h = tip(g.w), { d } = nearestPartD(f, h);
        if (d < SW.reach * Math.sqrt(f.scale || 1)) {
          const vel = g.w.body.getLinearVelocityFromWorldPoint(V(h.x, h.y)), u = unit(vel.x, vel.y);
          deal(g.atk, f, SW.grindDamage * powerOf(g.w), 'blade', u, { x: u.x * SW.push, y: 0.2 }, { x: h.x, y: h.y });
          stats.grindTicks++;
          fx?.sparks(h.x, h.y, { count: 6, color: Math.random() < 0.5 ? '#ffc23d' : '#fff1c2', speed: 8, dir: [-u.x, -u.y + 0.4], spread: 1.2 });
        }
      }
      if (g.t <= 0) grinds.delete(f);
    }
    // ricochet shards
    for (let i = shards.length - 1; i >= 0; i--) {
      const s = shards[i];
      s.t -= dt;
      const nx = s.x + s.vx * dt, ny = s.y + s.vy * dt, hit = rayStatic(s.x, s.y, nx, ny);
      if (hit) {
        const dot = s.vx * hit.nx + s.vy * hit.ny;
        s.vx = (s.vx - 2 * dot * hit.nx) * 0.75; s.vy = (s.vy - 2 * dot * hit.ny) * 0.75;
        s.x = hit.x + hit.nx * 0.02; s.y = hit.y + hit.ny * 0.02; s.bounces++;
        fx?.sparks(s.x, s.y, { count: 2, color: '#ffe08a', speed: 3 });
      } else { s.x = nx; s.y = ny; }
      s.vy -= 14 * dt;
      let gone = s.t <= 0 || s.bounces > 3;
      if (!gone) for (const f of all()) {
        if ((f === s.skip && s.bounces === 0) || !isFoe(s.atk, f)) continue;
        const c = centre(f);
        if (Math.abs(c.x - s.x) > 1.6 * (f.scale || 1) || Math.abs(c.y - s.y) > 1.8 * (f.scale || 1)) continue;
        if (nearestPartD(f, s).d < 0.24 * (f.scale || 1)) {
          deal(s.atk, f, SW.shardDamage * s.pow, 'blade', unit(s.vx, s.vy), null, { x: s.x, y: s.y });
          stats.shardHits++;
          fx?.sparks(s.x, s.y, { count: 6, color: '#ffc23d', speed: 5 });
          gone = true; break;
        }
      }
      if (gone) shards.splice(i, 1);
    }
    // frost
    for (const [f, s] of chills) {
      if (f.dead) {
        if (s.frozen > 0) { thaw(f, s); const c = centre(f); fx?.sparks(c.x, c.y, { count: 14, color: '#dff6ff', speed: 5 }); }
        f.spinMult = s.spin0; chills.delete(f); continue;
      }
      if (s.frozen > 0) {
        s.frozen -= dt; s.age += dt;
        f.spinMult = s.spin0 * 0.04;
        f.hopTimer = Math.max(f.hopTimer || 0, 0.2); f.jumpCd = Math.max(f.jumpCd || 0, 0.2); f.kickCd = Math.max(f.kickCd || 0, 0.2);
        if (Math.random() < dt * 8) { const c = centre(f); fx?.sparks(c.x + rand(-0.3, 0.3), c.y + rand(-0.6, 0.8), { count: 1, color: '#eaf9ff', speed: 0.8 }); }
        if (s.frozen <= 0) {
          thaw(f, s); s.t = FR.chillTime * 0.5;
          const c = centre(f); fx?.sparks(c.x, c.y, { count: 16, color: '#bfefff', speed: 5 }); sfx('hit_metal', { pitch: 2.4, volume: 0.4 });
        }
      } else {
        s.immune -= dt; s.t -= dt;
        if (s.t <= 0) s.stacks = 0;
        f.spinMult = s.t > 0 ? s.spin0 * FR.chillSlow : s.spin0;
        if (s.t > 0 && Math.random() < dt * 6) { const c = centre(f); fx?.sparks(c.x + rand(-0.3, 0.3), c.y + rand(-0.5, 0.7), { count: 1, color: '#bfefff', speed: 1 }); }
        if (s.t <= 0 && s.immune <= 0) { f.spinMult = s.spin0; chills.delete(f); }
      }
    }
    // gravity launches
    for (const [f, L] of launched) {
      if (f.dead) { launched.delete(f); continue; }
      const rd = f.ragdoll, v = rd.velocity(), k = isBig(f) ? GR.bossLift : 1;
      L.t += dt;
      f.stagger = Math.max(f.stagger || 0, 0.3); f.staggerFloor = 0;
      if (L.phase === 'up') {
        rd.addVelocity(-v.x * Math.min(1, dt * 6), Math.max(0, GR.liftVy * k - v.y) * Math.min(1, dt * 10));
        if (L.t >= GR.liftTime) { L.phase = 'hang'; L.t = 0; }
      } else if (L.phase === 'hang') {
        rd.addVelocity(-v.x * Math.min(1, dt * 6), (0.6 - v.y) * Math.min(1, dt * 12));
        if (L.t >= GR.hang) { L.phase = 'slam'; L.t = 0; sfx('throw', { pitch: 0.6, volume: 0.7 }); }
      } else {
        rd.addVelocity(-v.x * Math.min(1, dt * 4), Math.min(0, -GR.slamVy * k - v.y) * Math.min(1, dt * 14));
        if ((L.t > 0.12 && v.y > -2.5) || L.t > 1.6) { launched.delete(f); slamImpact(f, L); }
      }
    }
    // meteors
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.t += dt;
      if (m.t >= 0 && m.t < MT.fall && Math.random() < 0.5) {
        const u = Math.pow(m.t / MT.fall, 1.6);
        fx?.sparks(m.x0 + (m.tx - m.x0) * u, m.y0 + (m.ty - m.y0) * u, { count: 1, color: Math.random() < 0.5 ? '#ff8a2a' : '#ffc23d', speed: 1.5 });
      }
      if (m.t >= MT.fall) { meteorBlast(m); meteors.splice(i, 1); }
    }
    // plasma echoes
    for (let i = echoes.length - 1; i >= 0; i--) {
      const e = echoes[i];
      e.t += dt;
      if (!e.done && e.t >= PL.echoDelay) {
        e.done = true;
        if (isFoe(e.atk, e.f)) {
          const c = centre(e.f), u = { x: Math.cos(e.ang), y: Math.sin(e.ang) };
          deal(e.atk, e.f, e.dmg, 'laser', u, { x: u.x * 1.2, y: 1 }, c);
          stats.echoes++;
          fx?.sparks(c.x, c.y, { count: 10, color: '#ff7be6', speed: 6 });
          sfx('laser', { pitch: 2.1, volume: 0.35 });
        }
      }
      if (e.t >= PL.echoDelay + 0.3) echoes.splice(i, 1);
    }

    for (const w of physics.weapons) {
      if (w.destroyed || !w.body || w.body.__removed || !TIP[w.special]) continue;
      const holder = w.holder, spinning = !!(holder && holder.isSpinning);
      if (w.special === 'fire' && Math.random() < dt * (spinning ? 40 : 12)) {
        const p = weaponPoint(w, rand(0.3, 1.5), 0.1);
        fx?.sparks(p.x, p.y, { count: 1, color: Math.random() < 0.5 ? '#ff9a3a' : '#ffc23d', speed: 1.2 });
      }
      if (w.special === 'sun' && !spinning) w._charge = Math.max(0, (w._charge || 0) - SN.decay * dt);
      if (w.special === 'plasma' && !spinning) w._ext = Math.max(0, (w._ext || 0) - dt * 6);
      if (!holder || holder.dead) continue;
      switch (w.special) {
        case 'void': {
          const h = tip(w);
          for (const f of all()) {
            if (!isFoe(holder, f)) continue;
            const c = centre(f), dx = h.x - c.x, dy = h.y - c.y, d = Math.hypot(dx, dy);
            if (d > VD.radius || d < 0.4) continue;
            const a = VD.pull * (1 - d / VD.radius) * dt;
            f.ragdoll.addVelocity((dx / d) * a, (dy / d) * a * 0.6);
            stats.pulls++;
          }
          break;
        }
        case 'storm':
          if (!(spinning && holder.spinSpeed > ST.arcSpin)) break;
          w._arcT = (w._arcT ?? ST.arcEvery) - dt;
          if (w._arcT <= 0) {
            const h = tip(w);
            let target = null, td = ST.arcRange;
            for (const f of all()) { if (!isFoe(holder, f)) continue; const c = centre(f), d = Math.hypot(c.x - h.x, c.y - h.y); if (d < td) { td = d; target = f; } }
            if (target) {
              w._arcT = ST.arcEvery;
              const c = centre(target);
              capPush(bolts, { pts: jagged(h, c, 8, 0.3), t: 0, dur: 0.22 }, MAX_BOLTS);
              deal(holder, target, ST.arcDamage * powerOf(w), 'laser', { x: Math.sign(c.x - h.x) || 1, y: 0 }, null);
              fx?.sparks(c.x, c.y, { count: 8, color: '#7fe7ff', speed: 5 });
              sfx('laser', { pitch: 1.7, volume: 0.5 });
              stats.zaps++;
            } else w._arcT = 0.2;
          }
          break;
        case 'saw':
          if (spinning && Math.random() < dt * 18) { const h = tip(w); fx?.sparks(h.x, h.y - 0.25, { count: 1, color: '#ffc23d', speed: 4 }); }
          break;
        case 'frost':
          if (Math.random() < dt * (spinning ? 22 : 8)) { const p = weaponPoint(w, rand(1.05, 1.35), rand(-0.2, 0.85)); fx?.sparks(p.x, p.y, { count: 1, color: Math.random() < 0.5 ? '#dff6ff' : '#9fe3ff', speed: 0.9 }); }
          break;
        case 'meteor':
          if (Math.random() < dt * (spinning ? 26 : 10)) { const h = tip(w); fx?.sparks(h.x + rand(-0.15, 0.15), h.y + rand(-0.15, 0.15), { count: 1, color: Math.random() < 0.5 ? '#ff7a2a' : '#ffc23d', speed: 1.4 }); }
          break;
        case 'sun': {
          if (spinning) w._charge = Math.min(1, (w._charge || 0) + dt / SN.chargeTime);
          const q = w._charge || 0, h = tip(w);
          if (Math.random() < dt * 30 * q) fx?.sparks(h.x, h.y, { count: 1, color: Math.random() < 0.5 ? '#ffe27a' : '#ff8a2a', speed: 2 + 3 * q });
          if (q >= 1) {
            if (!w._readyFx) { w._readyFx = true; sfx('laser_charge', { pitch: 1.4, volume: 0.5 }); }
            for (const f of all()) { if (!isFoe(holder, f)) continue; const c = centre(f); if (Math.hypot(c.x - h.x, c.y - h.y) < SN.proximity * Math.sqrt(f.scale || 1)) { nova(w, holder); break; } }
          } else w._readyFx = false;
          break;
        }
        case 'plasma': {
          const want = spinning ? PL.ext * Math.min(1, holder.spinSpeed / PL.extSpin) : 0;
          w._ext = (w._ext || 0) + (want - (w._ext || 0)) * Math.min(1, dt * 8);
          if (w._ext < 0.15) break;
          const a = weaponPoint(w, PL.beamFrom, 0), b = weaponPoint(w, PL.beamFrom + w._ext, 0);
          for (const f of all()) {
            if (!isFoe(holder, f)) continue;
            const key = w.uid + '>' + f.id;
            if (clock - (beamCd.get(key) ?? -99) < PL.beamCd) continue;
            if (segDist(centre(f), a, b).d > 1.7 * (f.scale || 1)) continue;
            let hitName = null, hp = null, best = Infinity;
            for (const [name, body] of liveParts(f)) {
              const r = name === 'head' ? f.ragdoll.dims.head : 0.15 * (f.scale || 1);
              const s = segDist(body.getPosition(), a, b);
              if (s.d < r && s.d - r < best) { best = s.d - r; hitName = name; hp = { x: s.x, y: s.y }; }
            }
            if (!hitName) continue;
            const vel = w.body.getLinearVelocityFromWorldPoint(V(hp.x, hp.y)), sp = Math.hypot(vel.x, vel.y);
            if (sp < PL.minSpeed) continue;
            beamCd.set(key, clock);
            const pm = physics.cfg.combat.partMult || {}, mult = pm[hitName] ?? pm.limb ?? 0.55;
            const dmg = w.def.damage * powerOf(w) * PL.beamDamage * mult * Math.min(1.6, (sp - 4) / 12);
            const u = { x: vel.x / sp, y: vel.y / sp };
            deal(holder, f, dmg, 'laser', u, { x: u.x * 1.2, y: 0.8 }, hp);
            stats.beamHits++;
            fx?.sparks(hp.x, hp.y, { count: 8, color: '#ff7be6', speed: 6 });
            echo(w, holder, f, dmg, hp, vel);
          }
          break;
        }
      }
    }
    for (const b of bolts) b.t += dt;
    for (const r of rings) r.t += dt;
    for (const fl of flares) fl.t += dt;
    for (let i = bolts.length - 1; i >= 0; i--) if (bolts[i].t >= bolts[i].dur) bolts.splice(i, 1);
    for (let i = rings.length - 1; i >= 0; i--) if (rings[i].t >= rings[i].dur) rings.splice(i, 1);
    for (let i = flares.length - 1; i >= 0; i--) if (flares[i].t >= flares[i].dur) flares.splice(i, 1);
    if (beamCd.size > 64) for (const [k, t] of beamCd) if (clock - t > 1) beamCd.delete(k);
  }

  // ---------------------------------------------------------------- draw (camera space, metres, y-up)
  function strokePts(c, pts) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke(); }
  function boltStroke(c, pts, a, wide = 1) {
    c.globalAlpha = a * 0.3; c.strokeStyle = '#7fe7ff'; c.lineWidth = 0.16 * wide; strokePts(c, pts);
    c.globalAlpha = a * 0.85; c.strokeStyle = '#9ff0ff'; c.lineWidth = 0.06 * wide; strokePts(c, pts);
    c.globalAlpha = a; c.strokeStyle = '#f4fdff'; c.lineWidth = 0.025 * wide; strokePts(c, pts);
  }
  const dot = (c, x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
  const seg = (c, a, b) => { c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); };

  function drawStorm(c, w, t) {
    const pulse = 0.75 + 0.25 * Math.sin(t * 9 + w.uid);
    // glow halo along the blade
    for (const [lx, ly, r] of [[1.7, 0.1, 0.34], [1.95, 0.12, 0.4], [2.2, 0.08, 0.3], [1.0, 0, 0.2]]) {
      const p = weaponPoint(w, lx, ly);
      c.globalAlpha = 0.13 * pulse; c.fillStyle = '#7fe7ff'; c.beginPath(); c.arc(p.x, p.y, r * 1.5, 0, Math.PI * 2); c.fill();
      c.globalAlpha = 0.2 * pulse; c.beginPath(); c.arc(p.x, p.y, r * 0.8, 0, Math.PI * 2); c.fill();
    }
    // crawling arcs: coils -> blade, and around the blade edge (re-randomised every frame = flicker)
    const n = 3 + ((t * 20) | 0) % 2;
    for (let k = 0; k < n; k++) {
      const a = weaponPoint(w, [0.53, 0.93, 1.33, 1.5][(k + ((t * 7) | 0)) % 4], rand(-0.06, 0.06));
      const b = weaponPoint(w, rand(1.6, 2.25), rand(-0.2, 0.4));
      boltStroke(c, jagged(a, b, 6, 0.12), 0.55 + Math.random() * 0.45, 0.6);
    }
    if (Math.random() < 0.5) { const a = weaponPoint(w, 2.28, 0.02), b = weaponPoint(w, 2.28 + rand(0.1, 0.35), rand(-0.3, 0.4)); boltStroke(c, jagged(a, b, 4, 0.08), 0.8, 0.5); }
  }
  function drawFire(c, w, t) {
    for (let i = 0; i < 9; i++) {
      const x = 0.24 + i * 0.15, h = 0.1 + 0.09 * (0.5 + 0.5 * Math.sin(t * 19 + i * 1.7 + w.uid)) + 0.05 * Math.sin(t * 31 + i);
      const b0 = weaponPoint(w, x - 0.06, 0.07), b1 = weaponPoint(w, x + 0.06, 0.07), tp = weaponPoint(w, x + 0.03, 0.08 + h);
      c.globalAlpha = 0.75; c.fillStyle = '#ff7a2a';
      c.beginPath(); c.moveTo(b0.x, b0.y); c.lineTo(tp.x, tp.y); c.lineTo(b1.x, b1.y); c.closePath(); c.fill();
      const tq = weaponPoint(w, x + 0.02, 0.08 + h * 0.55), q0 = weaponPoint(w, x - 0.03, 0.075), q1 = weaponPoint(w, x + 0.03, 0.075);
      c.globalAlpha = 0.85; c.fillStyle = '#ffc23d';
      c.beginPath(); c.moveTo(q0.x, q0.y); c.lineTo(tq.x, tq.y); c.lineTo(q1.x, q1.y); c.closePath(); c.fill();
    }
    const g = weaponPoint(w, 0.9, 0);
    c.globalAlpha = 0.1 + 0.05 * Math.sin(t * 13); c.fillStyle = '#ff7a2a'; c.beginPath(); c.arc(g.x, g.y, 0.55, 0, Math.PI * 2); c.fill();
  }
  function drawVoid(c, w, t) {
    const h = tip(w);
    const R = VD.radius;
    if (w.holder) {   // faint pull field
      c.globalAlpha = 0.06; c.fillStyle = '#8f6bff'; c.beginPath(); c.arc(h.x, h.y, R, 0, Math.PI * 2); c.fill();
    }
    for (let i = 0; i < 14; i++) {   // matter spiralling in
      const u = (t * 0.8 + i / 14) % 1, ang = i * 2.4 + t * (2 + u * 3), r = 0.28 + (1 - u) * 0.75;
      c.globalAlpha = 0.25 + 0.6 * u; c.fillStyle = i % 3 ? '#b48cff' : '#f2eee6';
      c.beginPath(); c.arc(h.x + Math.cos(ang) * r, h.y + Math.sin(ang) * r * 0.55, 0.025 + 0.02 * u, 0, Math.PI * 2); c.fill();
    }
    c.globalAlpha = 0.9; c.strokeStyle = '#b48cff'; c.lineWidth = 0.035;
    c.beginPath(); c.ellipse(h.x, h.y, 0.46, 0.14, t * 1.3, 0, Math.PI * 2); c.stroke();
    c.globalAlpha = 1; c.fillStyle = '#05030a'; c.beginPath(); c.arc(h.x, h.y, 0.17, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#e2d4ff'; c.lineWidth = 0.02; c.stroke();
  }
  function drawSaw(c, w, t) {
    const h = tip(w), spinning = !!(w.holder && w.holder.isSpinning), a0 = -t * (spinning ? 38 : 5) - w.uid;
    c.globalAlpha = spinning ? 0.5 : 0.25; c.strokeStyle = '#f1f4f7'; c.lineWidth = 0.05;
    c.beginPath(); c.arc(h.x, h.y, 0.25, 0, TAU); c.stroke();
    c.globalAlpha = 0.95; c.strokeStyle = '#6f7782'; c.lineWidth = 0.035;
    for (let k = 0; k < 3; k++) { const a = a0 + k * 2.094; seg(c, { x: h.x + Math.cos(a) * 0.1, y: h.y + Math.sin(a) * 0.1 }, { x: h.x + Math.cos(a) * 0.27, y: h.y + Math.sin(a) * 0.27 }); }
    c.fillStyle = '#d8432f'; dot(c, h.x, h.y, 0.09);
    c.fillStyle = '#ffc23d'; dot(c, h.x, h.y, 0.04);
    if (spinning) {
      c.globalAlpha = 0.3 + 0.15 * Math.sin(t * 40); c.strokeStyle = '#ffc23d'; c.lineWidth = 0.05;
      c.beginPath(); c.arc(h.x, h.y, 0.38, a0 % TAU, (a0 % TAU) + 2.2); c.stroke();
    }
  }
  function drawFrost(c, w, t) {
    const pulse = 0.8 + 0.2 * Math.sin(t * 5 + w.uid);
    for (const [lx, ly, r] of [[1.2, 0.15, 0.3], [1.22, 0.45, 0.36], [1.15, 0.75, 0.28]]) {
      const p = weaponPoint(w, lx, ly);
      c.globalAlpha = 0.12 * pulse; c.fillStyle = '#9fe3ff'; dot(c, p.x, p.y, r * 1.4);
      c.globalAlpha = 0.16 * pulse; dot(c, p.x, p.y, r * 0.7);
    }
    c.strokeStyle = '#eaf9ff'; c.lineWidth = 0.018;
    for (let i = 0; i < 3; i++) {   // drifting snowflakes around the blade
      const a = t * 1.6 + i * 2.1, p = weaponPoint(w, 1.22 + Math.cos(a) * 0.32, 0.45 + Math.sin(a * 1.3) * 0.5), s = 0.05;
      c.globalAlpha = 0.85;
      for (let k = 0; k < 3; k++) { const b = a * 0.5 + k * 1.047; seg(c, { x: p.x - Math.cos(b) * s, y: p.y - Math.sin(b) * s }, { x: p.x + Math.cos(b) * s, y: p.y + Math.sin(b) * s }); }
    }
  }
  function drawGravity(c, w, t) {
    const h = tip(w), pulse = 0.5 + 0.5 * Math.sin(t * 6 + w.uid), boom = Math.max(0, 1 - (clock - (w._gravT ?? -99)) / 0.4);
    c.globalAlpha = 0.1 + 0.08 * pulse; c.fillStyle = '#c86bff'; dot(c, h.x, h.y, 0.45 + 0.1 * pulse);
    c.globalAlpha = 0.6; c.strokeStyle = '#5ff2d8'; c.lineWidth = 0.02;
    c.beginPath(); c.arc(h.x, h.y, 0.34 + 0.08 * pulse + boom * 0.5, 0, TAU); c.stroke();
    for (let i = 0; i < 5; i++) {   // pebbles in orbit
      const a = t * (2.2 + i * 0.3) + i * 1.26, rx = 0.42 + i * 0.03, p = { x: h.x + Math.cos(a) * rx, y: h.y + Math.sin(a) * rx * 0.45 };
      c.globalAlpha = 1; c.fillStyle = '#2a2350'; dot(c, p.x, p.y, 0.035);
      c.fillStyle = '#5ff2d8'; dot(c, p.x + 0.01, p.y + 0.01, 0.012);
    }
  }
  function drawMeteorStaff(c, w, t) {
    const h = tip(w), fl = 0.8 + 0.2 * Math.sin(t * 17 + w.uid);
    c.globalAlpha = 0.16 * fl; c.fillStyle = '#ff7a2a'; dot(c, h.x, h.y, 0.42);
    c.globalAlpha = 0.22 * fl; c.fillStyle = '#ffc23d'; dot(c, h.x, h.y, 0.26);
    for (let i = 0; i < 3; i++) { const a = t * 3 + i * 2.09; c.globalAlpha = 0.9; c.fillStyle = i % 2 ? '#ffc23d' : '#ff5a1f'; dot(c, h.x + Math.cos(a) * 0.32, h.y + Math.sin(a) * 0.32, 0.03); }
  }
  function drawSun(c, w, t) {
    const h = tip(w), q = w._charge || 0, full = q >= 1, fl = 0.85 + 0.15 * Math.sin(t * (full ? 22 : 9));
    c.globalAlpha = (0.1 + 0.22 * q) * fl; c.fillStyle = '#ffc23d'; dot(c, h.x, h.y, 0.32 + 0.5 * q);
    c.globalAlpha = (0.2 + 0.35 * q) * fl; c.fillStyle = '#fff3b0'; dot(c, h.x, h.y, 0.18 + 0.16 * q);
    const n = 10, L = 0.2 + 0.55 * q, rot = t * 1.5;
    c.fillStyle = '#ff9a3a'; c.globalAlpha = 0.35 + 0.45 * q;
    c.beginPath();
    for (let i = 0; i < n; i++) {
      const a = rot + (i / n) * TAU, r0 = 0.26, r1 = r0 + L * (i % 2 ? 0.6 : 1);
      c.moveTo(h.x + Math.cos(a - 0.12) * r0, h.y + Math.sin(a - 0.12) * r0);
      c.lineTo(h.x + Math.cos(a) * r1, h.y + Math.sin(a) * r1);
      c.lineTo(h.x + Math.cos(a + 0.12) * r0, h.y + Math.sin(a + 0.12) * r0);
    }
    c.fill();
    if (full) { c.globalAlpha = 0.6 + 0.4 * Math.sin(t * 20); c.strokeStyle = '#fffbe6'; c.lineWidth = 0.035; c.beginPath(); c.arc(h.x, h.y, 0.5 + 0.06 * Math.sin(t * 20), 0, TAU); c.stroke(); }
  }
  function drawPlasma(c, w, t) {
    const a = weaponPoint(w, 0.17, 0), b = weaponPoint(w, 1.28 + (w._ext || 0), 0), fl = 0.85 + 0.15 * Math.random();
    c.globalAlpha = 0.16 * fl; c.strokeStyle = '#ff3fd0'; c.lineWidth = 0.3; seg(c, a, b);
    c.globalAlpha = 0.5 * fl; c.strokeStyle = '#ff6fe0'; c.lineWidth = 0.12; seg(c, a, b);
    c.globalAlpha = 1; c.strokeStyle = '#fff0fb'; c.lineWidth = 0.045; seg(c, a, b);
    c.globalAlpha = 0.5 * fl; c.fillStyle = '#ffd6f6'; dot(c, b.x, b.y, 0.06 + 0.03 * Math.random());
    const e = weaponPoint(w, 0.12, 0);
    c.globalAlpha = 0.4 + 0.3 * Math.sin(t * 12); c.fillStyle = '#ff6fe0'; dot(c, e.x, e.y, 0.07);
  }

  function drawFrozen(c, f, s) {
    const rd = f.ragdoll, fade = Math.min(1, s.frozen / 0.25);
    for (const [name, b] of liveParts(f)) {
      if (name === 'head') {
        const p = b.getPosition();
        c.globalAlpha = 0.45 * fade; c.fillStyle = '#9fe3ff'; dot(c, p.x, p.y, rd.dims.head * 1.25);
        c.globalAlpha = 0.8 * fade; c.strokeStyle = '#eaf9ff'; c.lineWidth = 0.025; c.beginPath(); c.arc(p.x, p.y, rd.dims.head * 1.25, 0.3, 1.6); c.stroke();
        continue;
      }
      const ud = b.getUserData();
      if (!ud || !ud.len) continue;
      const [p0, p1] = rd.partEnds(name);
      c.globalAlpha = 0.42 * fade; c.strokeStyle = '#9fe3ff'; c.lineWidth = 0.3 * (f.scale || 1); seg(c, p0, p1);
      c.globalAlpha = 0.7 * fade; c.strokeStyle = '#eaf9ff'; c.lineWidth = 0.03; seg(c, { x: p0.x + 0.06, y: p0.y }, { x: p1.x + 0.06, y: p1.y });
    }
  }

  function draw(c) {
    const t = performance.now() / 1000;
    c.save();
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (const w of physics.weapons) {
      if (w.destroyed || !w.body || w.body.__removed || !TIP[w.special]) continue;
      switch (w.special) {
        case 'storm': drawStorm(c, w, t); break;
        case 'fire': drawFire(c, w, t); break;
        case 'void': drawVoid(c, w, t); break;
        case 'saw': drawSaw(c, w, t); break;
        case 'frost': drawFrost(c, w, t); break;
        case 'gravity': drawGravity(c, w, t); break;
        case 'meteor': drawMeteorStaff(c, w, t); break;
        case 'sun': drawSun(c, w, t); break;
        case 'plasma': drawPlasma(c, w, t); break;
      }
    }
    for (const [f, s] of chills) if (s.frozen > 0 && !f.dead) drawFrozen(c, f, s);
    for (const [f, L] of launched) {   // gravity beam under a launched foe
      if (f.dead) continue;
      const p = centre(f), k = f.scale || 1;
      c.globalAlpha = L.phase === 'slam' ? 0.05 : 0.1; c.fillStyle = '#5ff2d8'; c.fillRect(p.x - 0.4 * k, p.y - 5, 0.8 * k, 5);
      c.globalAlpha = 0.7; c.strokeStyle = '#c86bff'; c.lineWidth = 0.04;
      c.beginPath(); c.ellipse(p.x, p.y, 0.75 * k, 0.28 * k, 0, 0, TAU); c.stroke();
      c.strokeStyle = '#5ff2d8'; c.beginPath(); c.ellipse(p.x, p.y + 0.4 * Math.sin(t * 10), 0.55 * k, 0.2 * k, 0, 0, TAU); c.stroke();
    }
    for (const m of meteors) {
      const warn = Math.max(0, Math.min(1, (m.t + MT.stagger * 3) / (MT.fall + MT.stagger * 3)));
      c.globalAlpha = 0.25 + 0.45 * warn * (0.6 + 0.4 * Math.sin(t * 30)); c.strokeStyle = '#ff5a1f'; c.lineWidth = 0.05;
      c.beginPath(); c.ellipse(m.tx, m.ty + 0.03, MT.radius * (0.3 + 0.35 * warn), 0.12, 0, 0, TAU); c.stroke();
      if (m.t < 0) continue;
      const u = Math.pow(Math.min(1, m.t / MT.fall), 1.6), x = m.x0 + (m.tx - m.x0) * u, y = m.y0 + (m.ty - m.y0) * u;
      const d = unit(m.tx - m.x0, m.ty - m.y0), tail = { x: x - d.x * 1.4, y: y - d.y * 1.4 };
      c.globalAlpha = 0.3; c.strokeStyle = '#ff7a2a'; c.lineWidth = m.r * 2.2; seg(c, tail, { x, y });
      c.globalAlpha = 0.65; c.strokeStyle = '#ffc23d'; c.lineWidth = m.r * 1.1; seg(c, { x: x - d.x * 0.8, y: y - d.y * 0.8 }, { x, y });
      c.globalAlpha = 1; c.fillStyle = '#3a2f2c'; dot(c, x, y, m.r);
      c.fillStyle = '#ff7a2a'; dot(c, x + d.x * m.r * 0.35, y + d.y * m.r * 0.35, m.r * 0.55);
      c.fillStyle = '#fff1c2'; dot(c, x + d.x * m.r * 0.5, y + d.y * m.r * 0.5, m.r * 0.25);
    }
    c.strokeStyle = '#ffe08a'; c.lineWidth = 0.035;
    for (const s of shards) { c.globalAlpha = Math.min(1, s.t * 3); seg(c, { x: s.x - s.vx * 0.025, y: s.y - s.vy * 0.025 }, s); }
    for (const e of echoes) {   // ghost clone slash
      const f = e.f; if (!f || f.dead && e.done) continue;
      const p = centre(f), sweep = Math.max(0, Math.min(1, (e.t - PL.echoDelay + 0.1) / 0.25)), fade = e.t < PL.echoDelay ? 0.35 : Math.max(0, 1 - (e.t - PL.echoDelay) / 0.3);
      const a0 = e.ang + Math.PI / 2 + 1.3, a1 = a0 - 2.6 * sweep, R = 0.8 * (f.scale || 1);
      if (sweep <= 0) {
        c.globalAlpha = 0.3; c.strokeStyle = '#ff6fe0'; c.lineWidth = 0.05;
        seg(c, { x: p.x + Math.cos(a0) * R * 0.2, y: p.y + Math.sin(a0) * R * 0.2 }, { x: p.x + Math.cos(a0) * R * 1.3, y: p.y + Math.sin(a0) * R * 1.3 });
        continue;
      }
      c.globalAlpha = 0.35 * fade; c.strokeStyle = '#ff3fd0'; c.lineWidth = 0.22; c.beginPath(); c.arc(p.x, p.y, R, a1, a0); c.stroke();
      c.globalAlpha = 0.9 * fade; c.strokeStyle = '#fff0fb'; c.lineWidth = 0.05; c.beginPath(); c.arc(p.x, p.y, R, a1, a0); c.stroke();
    }
    for (const fl of flares) {   // supernova rays
      const u = fl.t / fl.dur;
      c.globalAlpha = 1 - u; c.strokeStyle = '#fff3b0'; c.lineWidth = 0.12 * (1 - u) + 0.02;
      for (let i = 0; i < 14; i++) { const a = fl.rot + (i / 14) * TAU, r0 = SN.radius * 0.25 * u, r1 = SN.radius * (0.35 + 0.75 * u) * (i % 2 ? 0.75 : 1); seg(c, { x: fl.x + Math.cos(a) * r0, y: fl.y + Math.sin(a) * r0 }, { x: fl.x + Math.cos(a) * r1, y: fl.y + Math.sin(a) * r1 }); }
    }
    for (const r of rings) {
      const u = r.t / r.dur;
      c.globalAlpha = 1 - u; c.strokeStyle = r.col; c.lineWidth = 0.12 * (1 - u) + 0.02;
      c.beginPath();
      if (r.flat) c.ellipse(r.x, r.y, r.R * (0.2 + 0.8 * u), r.R * 0.22 * (0.2 + 0.8 * u), 0, 0, TAU);
      else c.arc(r.x, r.y, r.R * (0.2 + 0.8 * u), 0, TAU);
      c.stroke();
    }
    for (const b of bolts) {
      const a = Math.max(0, 1 - b.t / b.dur);
      if (Math.random() < 0.5) b.pts = b.pts.map(([x, y], i, arr) => (i === 0 || i === arr.length - 1 ? [x, y] : [x + rand(-0.06, 0.06), y + rand(-0.06, 0.06)]));
      boltStroke(c, b.pts, a, 1.2);
    }
    c.restore();
  }

  function debug() {
    return { ...stats, burning: burning.size, bolts: bolts.length, grinding: grinds.size, shards: shards.length, frozen: [...chills.values()].filter((s) => s.frozen > 0).length, launched: launched.size, meteorsLive: meteors.length, echoesLive: echoes.length };
  }
  function destroy() {
    for (const [f, s] of chills) { try { if (s.frozen > 0) thaw(f, s); f.spinMult = s.spin0; } catch (e) { /* bodies already gone */ } }
    burning.clear(); grinds.clear(); chills.clear(); launched.clear(); gravCd.clear(); beamCd.clear();
    bolts.length = 0; rings.length = 0; shards.length = 0; meteors.length = 0; echoes.length = 0; flares.length = 0;
  }

  return { onHit, update, draw, debug, destroy };
}

export default createSpecials;
