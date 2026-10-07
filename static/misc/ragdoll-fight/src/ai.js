// Enemy AI. Produces the same intents as input.js ({spin, jump, kick, grab, grabPress}), so bots play by the player's rules.
// createAI(profileId, {level}) -> { intent(self, {foes, physics, hazards}, dt) }
//
// Behaviours: close in and swing (with whip-backs), pick up loose weapons, kick up close, climb walls to reach a foe
// on a ledge (hold grab + W / A-D, like the player), take running jumps over gaps, drop down to a foe below,
// hop over spikes/barrels and back off from saw blades, and (fist fighters) grab and drag the foe.

export const AI_PROFILES = {
  //          think time (s)   press in          whip back     jump        kick        weapons              edges          hazards           climb        grab foe
  dummy:   { think: [0.45, 0.8], aggression: 0.45, reverse: 0.08, jump: 0.04, kick: 0.08, grabWeapons: false, edgeCare: 0.6, range: 1.2, hazardCare: 0.5,  climb: true,  grabFoe: 0 },
  rookie:  { think: [0.35, 0.6], aggression: 0.6,  reverse: 0.12, jump: 0.07, kick: 0.15, grabWeapons: true,  edgeCare: 0.8, range: 1.3, hazardCare: 0.75, climb: true,  grabFoe: 0.06 },
  brawler: { think: [0.25, 0.45], aggression: 0.72, reverse: 0.16, jump: 0.1, kick: 0.28, grabWeapons: true,  edgeCare: 0.9, range: 1.4, hazardCare: 0.85, climb: true,  grabFoe: 0.14 },
  skilled: { think: [0.18, 0.34], aggression: 0.82, reverse: 0.2,  jump: 0.16, kick: 0.3,  grabWeapons: true,  edgeCare: 1,   range: 1.5, hazardCare: 0.95, climb: true,  grabFoe: 0.1 },
  boss:    { think: [0.2, 0.38], aggression: 0.88, reverse: 0.18, jump: 0.08, kick: 0.2,  grabWeapons: false, edgeCare: 1,   range: 1.8, hazardCare: 1,    climb: false, grabFoe: 0 },
};

const IDLE = Object.freeze({ spin: 0, jump: false, kick: false, grab: false, grabPress: false });
const rand = (a, b) => a + Math.random() * (b - a);
// non-damaging hazard surfaces the AI may stand on
const SAFE_SURFACES = new Set(['mover', 'rotor', 'conveyor', 'piston', 'crumble', 'seesaw', 'boat', 'bouncer', 'block', 'wheel', 'track', 'pendulum', 'bridge']);   // racks are walk-through, not ground
const isGround = (ud) => !!ud && (ud.kind === 'static' || (ud.kind === 'hazard' && !ud.damaging && SAFE_SURFACES.has(ud.type)));

/** First ground surface straight down from (x, yFrom) within `depth` m; returns its y or null. */
function groundBelow(physics, x, yFrom, depth) {
  const pl = window.planck;
  let y = null;
  physics.world.rayCast(pl.Vec2(x, yFrom), pl.Vec2(x, yFrom - depth), (fx, point, normal, fraction) => {
    if (!isGround(fx.getUserData())) return -1;
    y = point.y;
    return fraction;
  });
  return y;
}

/** A climbable surface in front of the chest? */
function wallAhead(physics, self, dir) {
  const pl = window.planck;
  const y = self.y + 0.55 * self.scale;
  let hit = false;
  physics.world.rayCast(pl.Vec2(self.x, y), pl.Vec2(self.x + dir * 1.2 * self.scale, y), (fx, point, normal, fraction) => {
    const ud = fx.getUserData();
    if (ud && (ud.kind === 'static' || (ud.kind === 'hazard' && ud.grabbable))) { hit = true; return fraction; }
    return -1;
  });
  return hit;
}

/** Position/extent of a hazard worth avoiding (blades, spikes, live explosives), else null. */
function hazardInfo(hz) {
  if (!hz || hz.exploded) return null;
  if (hz.danger) return hz.danger();   // §10 hazards describe themselves: { t, x, y, half, hop } | null (hop: jump over it)
  const t = hz.type;
  if (t !== 'blade' && t !== 'spikes' && t !== 'barrel' && t !== 'jar') return null;
  const b = hz.bodies && hz.bodies[0];
  const p = hz.centre ? hz.centre() : b ? b.getPosition() : { x: hz.def.x, y: hz.def.y };
  const half = t === 'spikes' ? (hz.def.w || 1) / 2 : t === 'blade' ? hz.def.r || 0.5 : 0.45;
  return { t, x: p.x, y: p.y, half, hop: t === 'spikes' || t === 'barrel' };
}

/** Nearest avoid-worthy hazard ahead of `self` in `dir` within `look` m (roughly at body height). */
function dangerAhead(self, dir, hazards, look) {
  let best = null;
  for (const hz of hazards || []) {
    const h = hazardInfo(hz);
    if (!h) continue;
    const ahead = (h.x - self.x) * dir;
    const gap = ahead - h.half;
    if (ahead < -h.half || gap > look) continue;
    if (h.y > self.y + 1.6 * self.scale || h.y < self.y - 1.4 * self.scale) continue;
    if (!best || gap < best.gap) best = { ...h, gap };
  }
  return best;
}

export function createAI(profileId = 'rookie', opts = {}) {
  const base = AI_PROFILES[profileId] || AI_PROFILES.rookie;
  // later levels sharpen every bot a little
  const lv = Math.max(0, (opts.level || 1) - 1);
  const p = {
    ...base,
    aggression: Math.min(0.95, base.aggression + lv * 0.004),
    think: [Math.max(0.12, base.think[0] - lv * 0.003), Math.max(0.2, base.think[1] - lv * 0.004)],
  };
  const st = { t: 0, clock: 0, spin: 0, grab: false, pendingJump: false, pendingKick: false, pendingGrab: false, climbUntil: 0, climbStart: 0, grabFoeUntil: 0 };
  // grabOnStart (DESIGN.md §11): spawn holding grab (hang on to a pendulum / wheel / ledge) until a foe comes within
  // `grabRelease` m (default 3) or `grabTime` s runs out
  st.holdUntil = opts.grabOnStart ? (opts.grabTime ?? Infinity) : 0;
  const holdRelease = opts.grabRelease ?? 3;

  function nearestLooseWeapon(self, physics, maxDist) {
    let best = null, bestD = maxDist;
    for (const w of physics.weapons) {
      if (w.holder || w.destroyed || !w.body || w.prop || w.returnTo) continue;
      const c = w.body.getPosition();
      const d = Math.hypot(c.x - self.x, c.y - self.y);
      if (d < bestD) { bestD = d; best = { w, x: c.x, y: c.y, d }; }
    }
    return best;
  }

  function intent(self, world, dt) {
    st.clock += dt;
    if (self.dead) return IDLE;
    const phys = world.physics;
    const foes = (world.foes || []).filter((f) => !f.dead);
    if (st.holdUntil) {
      const near = foes.some((f) => Math.hypot(f.x - self.x, f.y - self.y) < holdRelease * self.scale);
      // waiting: hang on while there is something to hang on to (ride the ball / gear / tread), otherwise just stand
      // there (a bot on plain ground never reaches for the floor); knocked off the ride -> fight
      if (self.gripping) st.held = true;
      const knockedOff = st.held && !self.gripping;
      if (near || knockedOff || st.clock >= st.holdUntil) { st.holdUntil = 0; st.grab = false; st.t = 0; }
      else return { spin: 0, jump: false, kick: false, grab: self.gripping || st.clock < 0.5, grabPress: false };
    }
    const out = { spin: st.spin, jump: false, kick: false, grab: st.grab, grabPress: false };
    if (st.pendingGrab) { out.grabPress = true; st.pendingGrab = false; }
    if (st.pendingJump) { out.jump = true; st.pendingJump = false; }
    if (st.pendingKick) { out.kick = true; st.pendingKick = false; }

    st.t -= dt;
    if (st.t > 0) return out;
    st.t = rand(p.think[0], p.think[1]);

    if (!foes.length) { st.spin = 0; st.grab = false; st.climbUntil = 0; return { ...out, spin: 0, grab: false }; }
    let foe = foes[0], fd = Infinity;
    for (const f of foes) { const d = Math.abs(f.x - self.x); if (d < fd) { fd = d; foe = f; } }

    const dx = foe.x - self.x, dy = foe.y - self.y, adx = Math.abs(dx);
    const dir = Math.sign(dx) || -self.facing;
    const s = self.scale;
    const reach = p.range * s + (self.weapon ? 0.6 : 0);
    const r = Math.random();

    // ---- climbing a wall to reach a foe up on a ledge (hold grab, W to hop, A/D to pull up)
    if (st.climbUntil > st.clock) {
      // climbing up to a foe: done at their height. climbing out because stuck: done once over the wall (below)
      const reached = st.climbWhy === 'up' && !self.hangingWorld && self.grounded && dy < 0.6 * s;
      const ontop = !self.hangingWorld && self.grounded && st.clock - st.climbStart > 1.5 && !wallAhead(phys, self, dir);
      if (!reached && !ontop) {
        st.spin = dir; st.grab = true;
        if (self.hangingWorld ? Math.random() < 0.6 : self.grounded && Math.random() < 0.35) st.pendingJump = true;
        return { ...out, spin: st.spin, grab: true };
      }
      st.climbUntil = 0; st.grab = false;
    }
    // stuck: not closing the distance to the foe for a while (e.g. hopping in place at the bottom of a pit wall)
    if (!st.prog || adx < st.prog.d - 0.3 || adx <= reach + 0.5) st.prog = { d: adx, t: st.clock };
    const stuck = st.clock - st.prog.t > 1.5;
    if (p.climb && phys && wallAhead(phys, self, dir) && ((self.grounded && dy > 0.6 * s) || stuck)) {
      st.climbWhy = dy > 0.6 * s ? 'up' : 'stuck';
      st.climbUntil = st.clock + (st.climbWhy === 'up' ? 5 : 6); st.climbStart = st.clock;
      st.prog = null;
      st.spin = dir; st.grab = true;
      return { ...out, spin: dir, grab: true };
    }

    // ---- grab & drag the foe (fist fighters)
    if (st.grabFoeUntil > st.clock) return { ...out, spin: st.spin, grab: true };
    if (st.grabFoeUntil) { st.grabFoeUntil = 0; st.grab = false; }
    if (p.grabFoe && !self.weapon && adx < 1.1 * s && Math.abs(dy) < 1 && self.balance > 0.5 && Math.random() < p.grabFoe) {
      st.grabFoeUntil = st.clock + rand(0.8, 1.6);
      st.grab = true; st.spin = -dir;   // latch on and haul them the other way
      return { ...out, spin: st.spin, grab: true };
    }
    st.grab = false;

    // knocked silly: mostly let balance recover
    if (self.balance < 0.25 && Math.random() < 0.6) { st.spin = 0; return { ...out, spin: 0, grab: false }; }

    // ---- go for a loose weapon when empty-handed and it's not a detour
    let target = { x: foe.x, dir };
    if (p.grabWeapons && !self.weapon && phys) {
      const lw = nearestLooseWeapon(self, phys, 5);
      if (lw && (lw.d < adx * 0.8 || adx > 3)) {
        target = { x: lw.x, dir: Math.sign(lw.x - self.x) || dir };
        if (lw.d < 1.3) st.pendingGrab = true;   // press grab once in reach
      }
    }

    const tdx = Math.abs(target.x - self.x);
    if (target.x !== foe.x) {
      st.spin = tdx > 0.3 ? target.dir : (Math.random() < 0.5 ? 1 : -1); // sweep hands over the weapon
    } else if (adx > reach + 0.8) {
      st.spin = r < 0.9 ? dir : 0;                                        // close the distance
    } else if (r < p.aggression) {
      st.spin = dir;                                                      // swing at them
    } else if (r < p.aggression + p.reverse) {
      st.spin = -dir;                                                     // backswing / whip
    } else {
      st.spin = 0;                                                        // breathe
    }

    // ---- hazards: hop over spikes/barrels toward the foe, back off from blades
    const danger = st.spin ? dangerAhead(self, st.spin, world.hazards, 1.4 * s) : null;
    if (danger && Math.random() < p.hazardCare) {
      const foeBeyond = Math.sign(foe.x - danger.x) === st.spin && adx > Math.abs(danger.x - self.x);
      if (danger.hop && foeBeyond && self.grounded && danger.gap < 0.9) st.pendingJump = true;
      else if (!danger.hop || !foeBeyond) st.spin = danger.gap < 0.6 ? -st.spin : 0;
    }

    // ---- ledges & gaps: running jump over a gap, drop down to a foe below, otherwise don't walk off
    if (st.spin && phys && Math.random() < p.edgeCare && groundBelow(phys, self.x + st.spin * 0.9 * s, self.y + 0.3, 3.2) === null) {
      const towardFoe = Math.sign(dx) === st.spin;
      const farSide = groundBelow(phys, self.x + st.spin * 1.9 * s, self.y + 0.3, 1.9 * s);
      const dropTo = groundBelow(phys, self.x + st.spin * 1.1 * s, self.y + 0.3, Math.max(3.2, self.y - foe.y + 2));
      if (towardFoe && farSide !== null && self.grounded) st.pendingJump = true;            // jumpable gap: keep running and jump
      else if (towardFoe && dy < -1 * s && dropTo !== null) { /* foe is below on solid ground: step off */ }
      else if (towardFoe && foe.grounded && Math.abs(dy) < 1.2 && adx < 2.2) { /* foe right at the edge: fight */ }
      else st.spin = self.grounded ? (Math.random() < 0.5 ? -st.spin : 0) : st.spin;
    }

    if (self.grounded) {
      if (dy > 1.0 * s && adx < 4 && Math.random() < 0.5) st.pendingJump = true;
      else if (Math.random() < p.jump) st.pendingJump = true;
    }
    if (adx < 1.4 * s && Math.random() < p.kick) st.pendingKick = true;

    return { ...out, spin: st.spin, grab: false };
  }

  return { intent, profile: p };
}
