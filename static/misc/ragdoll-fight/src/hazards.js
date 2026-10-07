// Arena hazards (DESIGN.md §9): pistons, movers, rotors, conveyors, saw blades, spike strips,
// explosive barrels / hanging jars, item droppers, weapon racks and punching bags.
// Content expansion (DESIGN.md §10): spikeball, bouncer, wind, lowgrav, lava, firejet, crumble, swinger,
// lasergate, bumper, seesaw, boat, water, shock, icicle.
// Original-level fidelity (DESIGN.md §11): block (loose crate/plank), wheel (motor/free/loose/roll; rolling wheels under a
// block become a cart), spinner (sensor gloves + velocity knock: can never pin a fighter), track (tank tread), pendulum
// (free-swinging grabbable wrecking ball), bridge (hinged planks), piston trigger/launch, and latch(fighter) for grabOnStart bots.
//
// createHazards(physics, defs, { hooks, deathY }) -> { update(dt), draw(ctx), drawOver(ctx), destroy(), list, debug(), latch(fighter) }
//   update(dt) runs before physics.step: kinematic bodies are driven with velocities toward their
//   next pose (so riders are carried, never teleported), droppers tick, fused explosives blow up,
//   zones (wind / lowgrav / firejet) push bodies, timed strips (lava / shock / lasergate) burn fighters.
//   draw(ctx) draws every hazard in camera space (metres, y-up), behind fighters.
//   drawOver(ctx) draws the translucent water surface layer; call it after fighters (optional: without it,
//   water still draws in draw(), just behind everything).
//
// Bodies are tagged via physics.tagBody; fixtures carry userData
//   { kind: 'hazard', type, hazard, damaging, damage, grabbable, explosive, conveyor, style }.
// Damaging fixtures (blade, spikes, spikeball, swinger, icicle) become source 'hazard' attacks in physics.js /
// createCombat; a hazard may set hz.minSpeed (speed floor) and hz.knock (knockback multiplier) for that path.
// Zone / timed damage (lava, firejet, lasergate, shock) is resolved here: hazardBurn() builds a 'hazard' event
// (attacker null, per-fighter cooldown), applies fighter.applyHit(evt) and reports hooks.onHit(evt).
// Explosions are resolved here (radial impulse + falloff damage + chain reactions) and reported
// through hooks.onExplosion({x, y, power, radius, damage}) and hooks.onHit(evt) per damaged fighter.
// Every hazard exposes hz.danger() -> { t, x, y, half, hop } | null for the AI (ai.js hazardInfo).
//
// §10 defaults are used verbatim. Interpretation notes (not deviations): the icicle grows over the whole cycle and
// shakes for the last 0.6 s before dropping (reads better than a 0.6 s pop-in); wind's optional `duty` defaults to 0.5.
import { CONFIG } from './config.js';
import { CAT, ALL, V } from './physics.js';
import { buildWeapon } from './weapons.js';
import { partMult } from './fighter.js';
import { weaponById } from './catalog.js';

const COL = {
  slab: '#3b404b', edge: '#4d5363', top: '#5b6274', dark: '#2a2d33', darker: '#1d2027',
  steel: '#d3d9e0', steelD: '#97a1ad', yellow: '#ffc23d', yellowD: '#d9a02a', red: '#d8432f', redD: '#a8382c',
  wood: '#b98a5a', woodD: '#8a6240', clay: '#c98a5b', clayD: '#9c6640', rope: '#b9a98a',
  lava: '#ff6a1f', lavaD: '#c9381f', fire: '#ff8a2a', fireY: '#ffd24a', fireW: '#fff3c4',
  ice: '#dff4ff', iceD: '#8fd8ff', iceE: '#5aa9d6', water: '#2c6f9e', waterL: '#4f9fd0', foam: '#cfe9f7',
  laser: '#ff4a3d', laserL: '#ff9d8a', neon: '#ff5fb0', neonB: '#5fe0ff', bolt: '#8fd8ff', hull: '#5a3b2a', hullD: '#3d2a1e',
  crumble: '#4a4238', crumbleE: '#6a5e4c', pad: '#5fbf6a', padD: '#3f8f4a', gum: '#e05c7a',
};
const DIRS = { up: { x: 0, y: 1 }, down: { x: 0, y: -1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
const smooth = (t) => t * t * (3 - 2 * t);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const TAU = Math.PI * 2;

const DEFAULTS = {
  minSpeed: 1.2, refSpeed: 8, minFactor: 0.7, maxFactor: 1.5, cooldown: 0.45, knockback: 1.0,
  explodeSpeed: 5.5, power: 9, damage: 30, radius: 2.6, upBias: 0.45, chainDelay: 0.14, minPush: 0.25,
  piston: { out: 0.16, hold: 0.18, back: 0.3, friction: 0.6 },
  mover: { friction: 0.85 }, rotor: { friction: 0.7 }, conveyor: { friction: 0.9 },
  blade: { friction: 0.3, teeth: 22, knock: 1 }, spikes: { height: 0.32, friction: 0.2, knock: 1.5, launch: 3.5 },
  barrel: { w: 0.62, h: 0.82, mass: 9 }, jar: { r: 0.27, mass: 3, linkLen: 0.2, linkMass: 0.12 },
  crate: { size: 0.55, mass: 3 }, bag: { w: 0.5, h: 1.0, mass: 18 }, rack: { tier: 0.42, base: 0.35 },
  spikeball: { friction: 0.3, knock: 1.2 }, bouncer: { height: 0.22, cooldown: 0.4, friction: 0.9 }, wind: { warn: 0.5, duty: 0.5 },
  lava: { thick: 0.5, every: 0.5, pop: 3.5, friction: 0.5 }, firejet: { width: 0.7, sputter: 0.6, push: 22, pop: 2.5, every: 0.5 },
  crumble: { fallTime: 1.0, fade: 0.4, friction: 0.85 }, swinger: { minSpeed: 3, knock: 1.6, friction: 0.5 },
  lasergate: { flicker: 0.4, every: 0.5, knock: 5, halfWidth: 0.14 }, bumper: { cooldown: 0.3, restitution: 0.3 },
  seesaw: { mass: 25, damping: 0.8, friction: 0.85, post: 1.0 }, boat: { friction: 0.85, hullDepth: 0.9 }, water: { depth: 14 },
  shock: { warn: 0.5, every: 0.5, hop: 3, height: 0.4 }, icicle: { shake: 0.6, mass: 2.5, halfWidth: 0.13 },
  pistonLift: 0.25,
  block: { density: 9, metalMul: 1.8, minMass: 2, maxMass: 60, friction: 0.7, damping: 0.05 },
  wheel: { friction: 0.9, density: 10, minMass: 3, torque: 320, gain: 6, freeDamping: 0.25, cartMass: 25 },
  spinner: { cooldown: 0.3, base: 2.5, perSpeed: 0.6, min: 2, max: 9, radial: 0.6, up: 0.25 },
  track: { friction: 0.9, slat: 0.32 },
  pendulum: { friction: 0.6, minSpeed: 2.5, knock: 1.1, maxKnock: 9, cooldown: 0.5, damping: 0.03, damageKnock: 1.6 },
};
const MAX_PARTICLES = 320;

let hzUid = 1;

export function createHazards(physics, defs = [], opts = {}) {
  const pl = physics.pl || window.planck, world = physics.world, cfg = physics.cfg || CONFIG;
  const H = mergeCfg(DEFAULTS, cfg.hazards || {});
  const hooks = opts.hooks || {};
  const deathY = opts.deathY ?? cfg.deathY;
  const list = [];
  const rings = [];                       // explosion visuals
  const stats = { exploded: 0, dropped: 0 };

  // ---- helpers -------------------------------------------------------------------------------
  function base(type, def) {
    return { type, def, uid: hzUid++, bodies: [], joints: [], exploded: false, update: null, draw: null, destroy: null };
  }
  function mkBody(type, x, y, hz, o = {}) {
    const b = world.createBody({
      type, position: V(x, y), angle: o.angle || 0, bullet: !!o.bullet,
      linearDamping: o.ld || 0, angularDamping: o.ad || 0, fixedRotation: !!o.fixedRotation,
    });
    b.setUserData({ kind: 'hazard', hazard: hz, style: o.style || hz.type });
    physics.tagBody(b);
    hz.bodies.push(b);
    return b;
  }
  function fixture(body, shape, hz, o = {}) {
    return body.createFixture(shape, {
      density: o.density ?? 0, friction: o.friction ?? 0.8, restitution: o.restitution ?? 0,
      filterCategoryBits: o.cat || CAT.STATIC, filterMaskBits: o.mask ?? ALL, filterGroupIndex: o.group || 0,
      userData: {
        kind: 'hazard', type: hz.type, hazard: hz, damaging: !!o.damaging, damage: o.damage || 0,
        grabbable: o.grabbable || false, explosive: !!o.explosive, conveyor: o.conveyor || 0, style: o.style || hz.type,
      },
    });
  }
  function joint(hz, j) { hz.joints.push(j); return j; }
  /** Velocity-drive a kinematic body so it reaches (tx, ty) after this step. */
  function driveTo(body, tx, ty, dt) {
    const p = body.getPosition();
    body.setLinearVelocity(V((tx - p.x) / dt, (ty - p.y) / dt));
  }
  const phaseOf = (dt, period, phase) => (((physics.time + dt) / period + (phase || 0)) % 1 + 1) % 1;

  // ---- piston ----------------------------------------------------------------------------------
  function pistonProfile(u) {
    const P = H.piston, o = P.out, h = P.hold, b = P.back;
    if (u < o) return smooth(u / o);                                   // slam out (peak speed 1.5 * stroke / (out * period))
    if (u < o + h) return 1;                                           // hold
    if (u < o + h + b) return 1 - smooth((u - o - h) / b);             // ease back
    return 0;                                                          // rest
  }
  // §11: `dir` may also be a number (push direction, rad); `angle` rotates the w×h head box. `trigger:true` fires only when a
  // fighter enters the `zone` in front of the face (then re-arms `rearm` s after returning); `launch` m/s is a velocity kick
  // (topped up along the push direction, plus pistonLift*launch upward for sideways pushes) to bodies touching the face while it extends.
  function makePiston(def) {
    const hz = base('piston', def);
    const P = H.piston;
    const dirAng = typeof def.dir === 'number' ? def.dir : null;
    const d = dirAng !== null ? { x: Math.cos(dirAng), y: Math.sin(dirAng) } : (DIRS[def.dir] || DIRS.up);
    const w = def.w ?? 1.2, h = def.h ?? 0.6, stroke = def.stroke ?? 1.5, period = def.period ?? 2.4, ang = def.angle || 0;
    const trigger = !!def.trigger, zone = def.zone ?? 0.6, rearm = def.rearm ?? 0.6, launch = def.launch ?? 0;
    const body = mkBody('kinematic', def.x, def.y, hz, { angle: ang });
    fixture(body, new pl.Box(w / 2, h / 2), hz, { friction: P.friction, grabbable: false });
    // push direction in the head's local frame -> extent of the head along / across the push
    const dl = { x: d.x * Math.cos(ang) + d.y * Math.sin(ang), y: -d.x * Math.sin(ang) + d.y * Math.cos(ang) };
    const along = Math.abs(dl.x) * w + Math.abs(dl.y) * h, across = Math.abs(dl.y) * w + Math.abs(dl.x) * h;
    const perp = { x: -d.y, y: d.x };
    const face0 = { x: def.x + d.x * along / 2, y: def.y + d.y * along / 2 };   // face centre at rest
    hz.ext = 0; hz.state = trigger ? 'armed' : 'cycle'; hz.t = 0; hz.fires = 0; hz.launched = 0;
    /** Any live fighter part inside the trigger zone (a `zone` m deep strip in front of the rest face)? */
    const zoneHas = () => {
      const R = zone + across / 2 + 1.6;
      for (const f of liveFighters()) {
        if (Math.abs(f.x - face0.x) > R || Math.abs(f.y - face0.y) > R) continue;
        for (const b of f.ragdoll.attachedParts()) {
          const c = b.getWorldCenter(), rx = c.x - face0.x, ry = c.y - face0.y;
          const a = rx * d.x + ry * d.y, s = rx * perp.x + ry * perp.y;
          if (a >= -0.05 && a <= zone && Math.abs(s) <= across / 2 + 0.12) return true;
        }
      }
      return false;
    };
    let kicked = null;    // bodies / fighters already launched during this extension
    hz.update = (dt) => {
      let s;
      if (!trigger) s = pistonProfile(phaseOf(dt, period, def.phase));
      else if (hz.state === 'armed') { s = 0; if (zoneHas()) { hz.state = 'fire'; hz.t = 0; hz.fires++; } }
      else if (hz.state === 'fire') { hz.t += dt; const u = hz.t / period; s = pistonProfile(u); if (u >= P.out + P.hold + P.back) { s = 0; hz.state = 'rearm'; hz.t = 0; } }
      else { s = 0; hz.t += dt; if (hz.t >= rearm) hz.state = 'armed'; }
      const extending = s > hz.ext + 1e-5;
      hz.ext = s;
      driveTo(body, def.x + d.x * stroke * s, def.y + d.y * stroke * s, dt);
      if (launch > 0 && extending) {
        if (!kicked) kicked = new Set();
        const p = body.getPosition(), lift = d.y > 0.7 ? 0 : launch * H.pistonLift;
        forTouching(body, (ob, ud) => {
          if (!ob.isDynamic() || isHeldWeapon(ud)) return;
          const f = ud.kind === 'part' ? fighterOf(ud) : null;
          if (ud.kind === 'part' && !f) return;
          const key = f || ob;
          if (kicked.has(key)) return;
          const c = ob.getWorldCenter();
          if ((c.x - p.x) * d.x + (c.y - p.y) * d.y < along / 2 - 0.05) return;    // touching a flank, not the face
          kicked.add(key); hz.launched++;
          if (f) {
            const v = f.ragdoll.velocity(), cur = v.x * d.x + v.y * d.y, add = Math.max(0, launch - cur);
            f.ragdoll.addVelocity(d.x * add, d.y * add + Math.max(0, lift - v.y));
          } else {
            const v = ob.getLinearVelocity(), cur = v.x * d.x + v.y * d.y, add = Math.max(0, launch - cur), m = ob.getMass();
            ob.applyLinearImpulse(V(d.x * add * m, (d.y * add + lift) * m), c, true);
          }
          if (hooks.onBounce) hooks.onBounce({ hazard: hz, point: { x: c.x, y: c.y }, fighter: f, power: launch });
        });
      } else if (s <= 0) kicked = null;
    };
    hz.danger = () => null;
    // stripes go on the local side that faces the push direction
    const faceSide = Math.abs(dl.x) >= Math.abs(dl.y) ? (dl.x > 0 ? 'px' : 'nx') : (dl.y > 0 ? 'py' : 'ny');
    hz.draw = (ctx) => {
      const p = body.getPosition();
      // base plate behind the rest position, and the rod up to the head
      const bx = def.x - d.x * (along / 2 + 0.14), by = def.y - d.y * (along / 2 + 0.14);
      ctx.save(); ctx.translate(bx, by); ctx.rotate(Math.atan2(d.y, d.x));
      ctx.fillStyle = COL.darker; ctx.fillRect(-0.14, -across / 2 - 0.15, 0.28, across + 0.3);
      ctx.restore();
      const rw = Math.min(0.3, across * 0.45);
      ctx.strokeStyle = COL.steelD; ctx.lineWidth = rw; ctx.lineCap = 'butt';
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(p.x, p.y); ctx.stroke();
      ctx.strokeStyle = COL.steel; ctx.lineWidth = rw * 0.35;
      ctx.beginPath(); ctx.moveTo(bx - d.y * rw * 0.2, by + d.x * rw * 0.2); ctx.lineTo(p.x - d.y * rw * 0.2, p.y + d.x * rw * 0.2); ctx.stroke();
      // head
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(ang);
      slabBox(ctx, w, h);
      const t = 0.16;
      if (faceSide === 'py') stripes(ctx, -w / 2, h / 2 - t, w, t);
      else if (faceSide === 'ny') stripes(ctx, -w / 2, -h / 2, w, t);
      else if (faceSide === 'px') stripes(ctx, w / 2 - t, -h / 2, t, h);
      else stripes(ctx, -w / 2, -h / 2, t, h);
      if (trigger) {   // armed lamp
        ctx.fillStyle = hz.state === 'armed' ? COL.yellow : hz.state === 'fire' ? COL.red : COL.redD;
        ctx.beginPath(); ctx.arc(0, 0, Math.min(0.08, across * 0.12), 0, TAU); ctx.fill();
      }
      ctx.restore();
    };
    return hz;
  }

  // ---- mover ------------------------------------------------------------------------------------
  function makeMover(def) {
    const hz = base('mover', def);
    const w = def.w ?? 2, h = def.h ?? 0.35, period = def.period ?? 5;
    const ax = def.x, ay = def.y, bx = def.to ? def.to[0] : def.x, by = def.to ? def.to[1] : def.y;
    const body = mkBody('kinematic', ax, ay, hz);
    fixture(body, new pl.Box(w / 2, h / 2), hz, { friction: H.mover.friction, grabbable: true });
    // `rope` (m): a chain of grabbable links hangs from the platform's underside (the original's chain platform):
    // jump up, grab the end and swing along with the platform
    const rope = def.rope > 0 ? +def.rope : 0, nL = rope ? Math.max(2, Math.round(rope / 0.3)) : 0, LL = rope / (nL || 1);
    hz.links = [];
    if (rope) {
      const group = physics.newGroup();
      let prev = body;
      for (let i = 0; i < nL; i++) {
        const ly = ay - h / 2 - LL * (i + 0.5);
        const b = mkBody('dynamic', ax, ly, hz, { ld: 0.25, ad: 0.6, style: 'link' });
        fixture(b, new pl.Box(0.05, LL / 2), hz, { density: 0.9 / (0.1 * LL), friction: 0.5, cat: CAT.PROP, group, grabbable: true, style: 'link' });
        joint(hz, world.createJoint(new pl.RevoluteJoint({ collideConnected: false }, prev, b, V(ax, ay - h / 2 - LL * i))));
        hz.links.push(b); prev = b;
      }
    }
    hz.update = (dt) => {
      const u = phaseOf(dt, period, def.phase);
      const s = smooth(1 - Math.abs(u * 2 - 1));
      driveTo(body, ax + (bx - ax) * s, ay + (by - ay) * s, dt);
    };
    hz.draw = (ctx) => {
      // rail between the end points
      ctx.save();
      ctx.setLineDash([0.22, 0.16]); ctx.strokeStyle = COL.darker; ctx.lineWidth = 0.08; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      ctx.restore();
      for (const [x, y] of [[ax, ay], [bx, by]]) { ctx.fillStyle = COL.darker; ctx.beginPath(); ctx.arc(x, y, 0.1, 0, TAU); ctx.fill(); }
      const p = body.getPosition();
      ctx.save(); ctx.translate(p.x, p.y);
      slabBox(ctx, w, h);
      ctx.fillStyle = COL.yellow;
      ctx.fillRect(-w / 2, -h / 2, 0.12, h); ctx.fillRect(w / 2 - 0.12, -h / 2, 0.12, h);
      // rollers underneath
      ctx.fillStyle = COL.steelD;
      for (const rx of [-w * 0.3, w * 0.3]) { ctx.beginPath(); ctx.arc(rx, -h / 2, h * 0.28, 0, TAU); ctx.fill(); }
      ctx.restore();
      if (hz.links.length) {
        // hanging chain: shackle under the deck, a line through the links, a ring on every link, a heavier end ring
        ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.07; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(p.x, p.y - h / 2);
        for (const b of hz.links) { const q = b.getWorldPoint(V(0, -LL / 2)); ctx.lineTo(q.x, q.y); }
        ctx.stroke();
        ctx.strokeStyle = COL.steel; ctx.lineWidth = 0.03;
        for (const b of hz.links) { const c = b.getPosition(); ctx.beginPath(); ctx.arc(c.x, c.y, 0.06, 0, TAU); ctx.stroke(); }
        const end = hz.links[hz.links.length - 1].getWorldPoint(V(0, -LL / 2));
        ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(end.x, end.y, 0.11, 0, TAU); ctx.fill();
        ctx.strokeStyle = COL.yellow; ctx.lineWidth = 0.035; ctx.stroke();
      }
    };
    return hz;
  }

  // ---- rotor -------------------------------------------------------------------------------------
  function makeRotor(def) {
    const hz = base('rotor', def);
    const w = def.w ?? 3, h = def.h ?? 0.3, speed = def.speed ?? 1.5;
    const body = mkBody('kinematic', def.x, def.y, hz, { angle: def.angle || 0 });
    fixture(body, new pl.Box(w / 2, h / 2), hz, { friction: H.rotor.friction, grabbable: true });
    body.setAngularVelocity(speed);
    hz.update = () => { body.setAngularVelocity(speed); body.setLinearVelocity(V(0, 0)); };
    hz.draw = (ctx) => {
      const p = body.getPosition();
      ctx.save(); ctx.translate(p.x, p.y);
      // mount behind the bar
      ctx.fillStyle = COL.darker; ctx.beginPath(); ctx.arc(0, 0, Math.max(h * 0.9, 0.3), 0, TAU); ctx.fill();
      ctx.rotate(body.getAngle());
      slabBox(ctx, w, h);
      ctx.fillStyle = COL.yellow;
      ctx.fillRect(-w / 2, -h / 2, 0.14, h); ctx.fillRect(w / 2 - 0.14, -h / 2, 0.14, h);
      ctx.rotate(-body.getAngle());
      // hub
      ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(0, 0, Math.max(h * 0.6, 0.2), 0, TAU); ctx.fill();
      ctx.strokeStyle = COL.yellow; ctx.lineWidth = 0.05; ctx.stroke();
      ctx.fillStyle = COL.steelD; ctx.beginPath(); ctx.arc(0, 0, 0.06, 0, TAU); ctx.fill();
      ctx.restore();
    };
    return hz;
  }

  // ---- conveyor ------------------------------------------------------------------------------------
  function makeConveyor(def) {
    const hz = base('conveyor', def);
    const w = def.w ?? 4, h = def.h ?? 0.3, speed = def.speed ?? 2;
    const body = mkBody('static', def.x, def.y, hz);
    fixture(body, new pl.Box(w / 2, h / 2), hz, { friction: H.conveyor.friction, conveyor: speed, grabbable: false });
    hz.draw = (ctx) => {
      ctx.save(); ctx.translate(def.x, def.y);
      const r = h / 2;
      ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.roundRect(-w / 2, -r, w, h, r); ctx.fill();
      ctx.strokeStyle = COL.edge; ctx.lineWidth = 0.05; ctx.stroke();
      // rollers
      const ang = (physics.time * speed) / Math.max(0.05, r * 0.8);
      ctx.fillStyle = COL.steelD;
      for (const rx of [-w / 2 + r, w / 2 - r]) {
        ctx.beginPath(); ctx.arc(rx, 0, r * 0.72, 0, TAU); ctx.fill();
        ctx.strokeStyle = COL.dark; ctx.lineWidth = 0.04;
        ctx.beginPath(); ctx.moveTo(rx - Math.cos(ang) * r * 0.6, -Math.sin(ang) * r * 0.6); ctx.lineTo(rx + Math.cos(ang) * r * 0.6, Math.sin(ang) * r * 0.6); ctx.stroke();
      }
      // moving chevrons on the belt
      const step = 0.5, dir = Math.sign(speed) || 1;
      const off = ((physics.time * speed) % step + step) % step;
      ctx.fillStyle = COL.yellow; ctx.globalAlpha = 0.8;
      for (let x = -w / 2 + r + off - step; x < w / 2 - r; x += step) {
        if (x < -w / 2 + r) continue;
        ctx.beginPath(); ctx.moveTo(x, r - 0.05); ctx.lineTo(x + dir * 0.12, r - 0.13); ctx.lineTo(x, r - 0.21); ctx.lineTo(x + dir * 0.05, r - 0.13); ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = COL.top; ctx.lineWidth = 0.05; ctx.beginPath(); ctx.moveTo(-w / 2 + r, r); ctx.lineTo(w / 2 - r, r); ctx.stroke();
      ctx.restore();
    };
    return hz;
  }

  // ---- blade ---------------------------------------------------------------------------------------
  function makeBlade(def) {
    const hz = base('blade', def);
    const r = def.r ?? 0.6, speed = def.speed ?? 8, damage = def.damage ?? 12, period = def.period ?? 4;
    const body = mkBody('kinematic', def.x, def.y, hz);
    fixture(body, new pl.Circle(r), hz, { friction: H.blade.friction, damaging: true, damage });
    hz.knock = def.knock ?? H.blade.knock;
    body.setAngularVelocity(speed);
    const path = def.path;
    hz.update = (dt) => {
      body.setAngularVelocity(speed);
      if (path) {
        const u = phaseOf(dt, period, def.phase);
        const s = smooth(1 - Math.abs(u * 2 - 1));
        driveTo(body, def.x + (path[0] - def.x) * s, def.y + (path[1] - def.y) * s, dt);
      } else body.setLinearVelocity(V(0, 0));
    };
    const teeth = Math.max(10, Math.round(r * H.blade.teeth));
    hz.draw = (ctx) => {
      if (path) {
        ctx.save(); ctx.setLineDash([0.22, 0.16]); ctx.strokeStyle = COL.darker; ctx.lineWidth = 0.08; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(def.x, def.y); ctx.lineTo(path[0], path[1]); ctx.stroke(); ctx.restore();
      }
      const p = body.getPosition();
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(body.getAngle());
      ctx.fillStyle = COL.steel; ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const a0 = (i / teeth) * TAU, a1 = ((i + 0.55) / teeth) * TAU, a2 = ((i + 1) / teeth) * TAU;
        const R = r + 0.07, ri = r - 0.03;
        if (i === 0) ctx.moveTo(Math.cos(a0) * ri, Math.sin(a0) * ri);
        ctx.lineTo(Math.cos(a1) * R, Math.sin(a1) * R);
        ctx.lineTo(Math.cos(a2) * ri, Math.sin(a2) * ri);
      }
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.03; ctx.stroke();
      // inner plate with slots
      ctx.fillStyle = COL.steelD; ctx.beginPath(); ctx.arc(0, 0, r * 0.62, 0, TAU); ctx.fill();
      ctx.strokeStyle = COL.steel; ctx.lineWidth = 0.05;
      for (let i = 0; i < 3; i++) { const a = (i / 3) * TAU; ctx.beginPath(); ctx.arc(0, 0, r * 0.45, a, a + 1.2); ctx.stroke(); }
      ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(0, 0, r * 0.22, 0, TAU); ctx.fill();
      ctx.strokeStyle = COL.yellow; ctx.lineWidth = 0.045; ctx.stroke();
      ctx.fillStyle = COL.red; ctx.beginPath(); ctx.arc(0, 0, r * 0.09, 0, TAU); ctx.fill();
      ctx.restore();
    };
    return hz;
  }

  // ---- spikes ---------------------------------------------------------------------------------------
  function makeSpikes(def) {
    const hz = base('spikes', def);
    const w = def.w ?? 2, damage = def.damage ?? 14, sh = H.spikes.height;
    const body = mkBody('static', def.x, def.y + sh / 2, hz);
    fixture(body, new pl.Box(w / 2, sh / 2), hz, { friction: H.spikes.friction, damaging: true, damage });
    hz.knockDir = () => ({ x: 0, y: 1 });
    hz.knock = def.knock ?? H.spikes.knock;
    hz.launch = def.launch ?? H.spikes.launch;   // whole-body m/s upward per hit: victims bounce off (and land again -> another hit)
    const n = Math.max(2, Math.round(w / 0.22));
    hz.draw = (ctx) => {
      ctx.save(); ctx.translate(def.x, def.y);
      ctx.fillStyle = COL.darker; ctx.fillRect(-w / 2, -0.08, w, 0.14);
      const step = w / n;
      for (let i = 0; i < n; i++) {
        const x0 = -w / 2 + i * step, xm = x0 + step / 2;
        ctx.fillStyle = COL.steel; ctx.beginPath(); ctx.moveTo(x0 + 0.01, 0.04); ctx.lineTo(xm, sh + 0.06); ctx.lineTo(x0 + step - 0.01, 0.04); ctx.closePath(); ctx.fill();
        ctx.fillStyle = COL.steelD; ctx.beginPath(); ctx.moveTo(xm, 0.04); ctx.lineTo(xm, sh + 0.06); ctx.lineTo(x0 + step - 0.01, 0.04); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = COL.red; ctx.fillRect(-w / 2, -0.02, w, 0.05);
      ctx.restore();
    };
    return hz;
  }

  // ---- explosives ---------------------------------------------------------------------------------
  function makeBarrel(def) {
    const hz = base('barrel', def);
    const w = def.w ?? H.barrel.w, h = def.h ?? H.barrel.h, mass = def.mass ?? H.barrel.mass;
    const body = mkBody('dynamic', def.x, def.y, hz, { angle: def.angle || 0, ld: 0.1, ad: 0.5 });
    fixture(body, new pl.Box(w / 2, h / 2), hz, { density: mass / (w * h), friction: 0.5, restitution: 0.05, cat: CAT.PROP, explosive: true });
    hz.explosiveBodies = [body];
    hz.centre = () => body.getPosition();
    hz.draw = (ctx) => {
      if (hz.exploded) return;
      const p = body.getPosition();
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(body.getAngle());
      drawBarrel(ctx, w, h, hz);
      ctx.restore();
    };
    return hz;
  }

  function makeJar(def) {
    const hz = base('jar', def);
    const J = H.jar, r = def.r ?? J.r, mass = def.mass ?? J.mass, chain = Math.max(0.3, def.chain ?? 2);
    const n = Math.max(1, Math.round(chain / J.linkLen)), L = chain / n;
    const group = physics.newGroup();
    const anchor = mkBody('static', def.x, def.y, hz);
    let prev = anchor;
    hz.links = [];
    for (let i = 0; i < n; i++) {
      const cy = def.y - L * (i + 0.5);
      const b = mkBody('dynamic', def.x, cy, hz, { ld: 0.2, ad: 0.5, style: 'link' });
      fixture(b, new pl.Box(0.03, L / 2 - 0.005), hz, { density: J.linkMass / (0.06 * L), friction: 0.3, cat: CAT.PROP, group });
      joint(hz, world.createJoint(new pl.RevoluteJoint({ collideConnected: false }, prev, b, V(def.x, def.y - L * i))));
      hz.links.push(b); prev = b;
    }
    const jar = mkBody('dynamic', def.x, def.y - chain - r, hz, { ld: 0.15, ad: 0.5 });
    fixture(jar, new pl.Circle(r), hz, { density: mass / (Math.PI * r * r), friction: 0.4, restitution: 0.05, cat: CAT.PROP, group, explosive: true });
    joint(hz, world.createJoint(new pl.RevoluteJoint({ collideConnected: false }, prev, jar, V(def.x, def.y - chain))));
    hz.explosiveBodies = [jar];
    hz.centre = () => jar.getPosition();
    hz.draw = (ctx) => {
      // anchor plate + chain
      ctx.fillStyle = COL.darker; ctx.fillRect(def.x - 0.22, def.y - 0.05, 0.44, 0.14);
      ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.05; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(def.x, def.y);
      for (const b of hz.links) { const p = b.getPosition(); ctx.lineTo(p.x, p.y); }
      if (!hz.exploded) { const p = jar.getWorldPoint(V(0, r)); ctx.lineTo(p.x, p.y); }
      ctx.stroke();
      ctx.fillStyle = COL.steel;
      for (const b of hz.links) { const p = b.getPosition(); ctx.beginPath(); ctx.arc(p.x, p.y, 0.04, 0, TAU); ctx.fill(); }
      if (hz.exploded) return;
      const p = jar.getPosition();
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(jar.getAngle());
      drawJar(ctx, r, hz);
      ctx.restore();
    };
    return hz;
  }

  // ---- crate (dropper item) ----------------------------------------------------------------------
  const crates = [];
  function makeCrate(x, y, hz) {
    const s = H.crate.size;
    const b = mkBody('dynamic', x, y, hz, { angle: (Math.random() - 0.5) * 0.4, ld: 0.1, ad: 0.6, style: 'crate' });
    fixture(b, new pl.Box(s / 2, s / 2), hz, { density: H.crate.mass / (s * s), friction: 0.6, restitution: 0.05, cat: CAT.PROP, style: 'crate' });
    b.setAngularVelocity((Math.random() - 0.5) * 3);
    crates.push(b);
    return b;
  }
  function drawCrates(ctx) {
    const s = H.crate.size;
    for (const b of crates) {
      if (b.__dead) continue;
      const p = b.getPosition();
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(b.getAngle());
      ctx.fillStyle = COL.wood; ctx.fillRect(-s / 2, -s / 2, s, s);
      ctx.strokeStyle = COL.woodD; ctx.lineWidth = 0.05; ctx.lineJoin = 'round'; ctx.strokeRect(-s / 2 + 0.025, -s / 2 + 0.025, s - 0.05, s - 0.05);
      ctx.lineWidth = 0.06; ctx.beginPath(); ctx.moveTo(-s / 2 + 0.06, -s / 2 + 0.06); ctx.lineTo(s / 2 - 0.06, s / 2 - 0.06); ctx.moveTo(-s / 2 + 0.06, s / 2 - 0.06); ctx.lineTo(s / 2 - 0.06, -s / 2 + 0.06); ctx.stroke();
      ctx.restore();
    }
  }

  // ---- dropper ----------------------------------------------------------------------------------
  function makeDropper(def) {
    const hz = base('dropper', def);
    const every = Math.max(0.5, def.every ?? 4), items = def.items && def.items.length ? def.items : ['crate'], max = def.max ?? 3;
    hz.timer = def.delay ?? every * 0.5;
    hz.spawned = [];
    hz.flap = 0; hz.next = 0;
    const alive = (s) => s.kind === 'crate' ? !s.body.__dead : (!s.w.destroyed && !s.w.holder);
    hz.count = () => hz.spawned.filter(alive).length;
    hz.update = (dt) => {
      hz.flap = Math.max(0, hz.flap - dt);
      hz.spawned = hz.spawned.filter((s) => s.kind === 'crate' ? !s.body.__dead : !s.w.destroyed);
      hz.timer -= dt;
      if (hz.timer > 0) return;
      hz.timer = every;
      if (hz.count() >= max) return;
      const id = items[hz.next++ % items.length];
      const x = def.x + (Math.random() - 0.5) * 0.2, y = def.y - 0.35;
      if (id === 'crate') hz.spawned.push({ kind: 'crate', body: makeCrate(x, y, hz) });
      else {
        const w = buildWeapon(physics, id, { x, y }, (Math.random() - 0.5) * 0.8, { velocity: { x: 0, y: -1 }, angularVelocity: (Math.random() - 0.5) * 4 });
        if (w) hz.spawned.push({ kind: 'weapon', w });
      }
      hz.flap = 0.45; stats.dropped++;
      if (hooks.onDrop) hooks.onDrop(hz, id);
    };
    hz.draw = (ctx) => {
      const w = 1.0, h = 0.55;
      ctx.save(); ctx.translate(def.x, def.y + h / 2);
      slabBox(ctx, w, h);
      stripes(ctx, -w / 2, -h / 2, w, 0.13);
      // hatch flaps swing open after a drop
      const open = hz.flap > 0 ? Math.sin(Math.min(1, hz.flap / 0.45) * Math.PI) : 0;
      ctx.fillStyle = COL.steelD;
      for (const s of [-1, 1]) {
        ctx.save(); ctx.translate(s * w / 2, -h / 2); ctx.rotate(-s * open * 1.2);
        ctx.fillRect(s < 0 ? 0 : -w / 2, -0.06, w / 2, 0.06);
        ctx.restore();
      }
      // ready lamp
      const ready = hz.timer < 0.6 && hz.count() < max;
      ctx.fillStyle = ready ? COL.yellow : COL.redD; ctx.beginPath(); ctx.arc(0, h / 2 - 0.13, 0.07, 0, TAU); ctx.fill();
      ctx.restore();
    };
    return hz;
  }

  // ---- rack -----------------------------------------------------------------------------------------
  function makeRack(def) {
    const hz = base('rack', def);
    const ids = def.weapons || [];
    const R = H.rack;
    let maxLen = 1.2;
    for (const id of ids) maxLen = Math.max(maxLen, weaponById(id).length || 1);
    const w = def.w ?? Math.max(1.6, maxLen + 0.5);
    const tiers = Math.max(1, ids.length);
    const height = R.base + tiers * R.tier;
    const body = mkBody('static', def.x, def.y, hz);
    hz.weapons = [];
    for (let i = 0; i < tiers; i++) {
      const ty = R.base + i * R.tier;
      // racks never get in a fighter's way: shelves only collide with loose weapons/props (fighters walk through, can't grab)
      const shelf = { friction: 0.8, mask: ALL & ~CAT.PART };
      fixture(body, new pl.Box(w / 2, 0.03, V(0, ty), 0), hz, shelf);
      // lips so weapons don't skid off the shelf
      fixture(body, new pl.Box(0.04, 0.07, V(-w / 2 + 0.04, ty + 0.07), 0), hz, shelf);
      fixture(body, new pl.Box(0.04, 0.07, V(w / 2 - 0.04, ty + 0.07), 0), hz, shelf);
      if (ids[i]) {
        // alternate facing per tier; then shift so the weapon's centre of mass (not its grip) sits over the rack centre
        const wp = buildWeapon(physics, ids[i], { x: def.x, y: def.y + ty + 0.14 }, i % 2 ? Math.PI : 0);
        if (wp) {
          const c = wp.body.getWorldCenter(), dx = def.x - c.x;
          for (const b of [wp.body, ...wp.links, wp.head, ...wp.flapBodies]) if (b) { const p = b.getPosition(); b.setPosition(V(p.x + dx, p.y)); }
          hz.weapons.push(wp);
          // resting on the rack: fighters pass through it (weapons.js maskFor keeps this until it's picked up / knocked off)
          wp.onRack = true;
          for (const b of [wp.body, ...wp.links, wp.head, ...wp.flapBodies]) if (b) for (let f = b.getFixtureList(); f; f = f.getNext()) {
            f.setFilterData({ groupIndex: f.getFilterGroupIndex(), categoryBits: f.getFilterCategoryBits(), maskBits: ALL & ~CAT.PART });
          }
        }
      }
    }
    hz.draw = (ctx) => {
      ctx.save(); ctx.translate(def.x, def.y);
      ctx.fillStyle = COL.darker;
      ctx.fillRect(-w / 2 - 0.02, 0, 0.14, height); ctx.fillRect(w / 2 - 0.12, 0, 0.14, height);
      ctx.fillStyle = COL.dark; ctx.fillRect(-w / 2 - 0.02, height - 0.08, w + 0.04, 0.1);
      for (let i = 0; i < tiers; i++) {
        const ty = R.base + i * R.tier;
        ctx.fillStyle = COL.wood; ctx.fillRect(-w / 2, ty - 0.03, w, 0.06);
        ctx.fillStyle = COL.woodD; ctx.fillRect(-w / 2, ty - 0.03, w, 0.02);
        ctx.fillStyle = COL.steelD; ctx.fillRect(-w / 2, ty, 0.08, 0.14); ctx.fillRect(w / 2 - 0.08, ty, 0.08, 0.14);
      }
      ctx.restore();
    };
    return hz;
  }

  // ---- bag ------------------------------------------------------------------------------------------
  function makeBag(def) {
    const hz = base('bag', def);
    const B = H.bag, w = def.w ?? B.w, h = def.h ?? B.h, rope = Math.max(0.2, def.rope ?? 1.5), mass = def.mass ?? B.mass;
    const anchor = mkBody('static', def.x, def.y, hz);
    const bag = mkBody('dynamic', def.x, def.y - rope - h / 2, hz, { ld: 0.35, ad: 0.6 });
    fixture(bag, new pl.Box(w / 2, h / 2), hz, { density: mass / (w * h), friction: 0.6, restitution: 0.1, cat: CAT.PROP, grabbable: 'any' });
    joint(hz, world.createJoint(new pl.DistanceJoint({ frequencyHz: 0, dampingRatio: 0, length: rope, collideConnected: false }, anchor, bag, V(def.x, def.y), V(def.x, def.y - rope))));
    hz.body = bag;
    hz.draw = (ctx) => {
      const top = bag.getWorldPoint(V(0, h / 2));
      ctx.fillStyle = COL.darker; ctx.fillRect(def.x - 0.22, def.y - 0.05, 0.44, 0.14);
      ctx.strokeStyle = COL.rope; ctx.lineWidth = 0.045; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(def.x, def.y); ctx.lineTo(top.x, top.y); ctx.stroke();
      const p = bag.getPosition();
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(bag.getAngle());
      ctx.fillStyle = COL.red; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * 0.3); ctx.fill();
      ctx.fillStyle = COL.redD; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h * 0.22, w * 0.3); ctx.fill();
      ctx.fillStyle = COL.yellow; ctx.fillRect(-w / 2, -h * 0.08, w, h * 0.16);
      ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.roundRect(-w * 0.36, h / 2 - 0.1, w * 0.72, 0.12, 0.04); ctx.fill();
      ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.035; ctx.beginPath(); ctx.arc(0, h / 2 + 0.03, 0.06, 0, TAU); ctx.stroke();
      ctx.restore();
    };
    return hz;
  }

  // =================================================================================================
  // ---- §10 hazards: shared helpers ---------------------------------------------------------------
  // =================================================================================================
  const particles = [];                    // embers / sparkles / droplets / shards: { x, y, vx, vy, t, dur, c, r, g }
  function spawnP(p) { if (particles.length < MAX_PARTICLES) particles.push(p); }
  /** Seconds into the current cycle of `period` (phase in cycles). */
  const cycleT = (period, phase) => ((((physics.time / period) + (phase || 0)) % 1) + 1) % 1 * period;
  /** Every dynamic body whose centre is inside the axis-aligned rect (dedup'd): cb(body, fixtureUserData). */
  function forBodiesIn(x0, y0, x1, y1, cb) {
    const seen = new Set();
    world.queryAABB(new pl.AABB(V(x0, y0), V(x1, y1)), (fx) => {
      const b = fx.getBody();
      if (seen.has(b) || b.__dead || !b.isDynamic()) return true;
      seen.add(b);
      const c = b.getWorldCenter();
      if (c.x < x0 || c.x > x1 || c.y < y0 || c.y > y1) return true;
      cb(b, fx.getUserData() || {});
      return true;
    });
  }
  const liveFighters = () => [...physics.fighters].filter((f) => !f.dead && f.ragdoll);
  /** Attached ragdoll parts of `f` whose centre lies inside the rect (cheap bounding reject first). */
  function partsIn(f, x0, y0, x1, y1) {
    const R = 1.3 * (f.scale || 1);
    if (f.x < x0 - R || f.x > x1 + R || f.y < y0 - R || f.y > y1 + R + 0.6) return null;
    let out = null;
    for (const b of f.ragdoll.attachedParts()) {
      const c = b.getWorldCenter();
      if (c.x >= x0 && c.x <= x1 && c.y >= y0 && c.y <= y1) { (out || (out = [])).push(b); }
    }
    return out;
  }
  /**
   * Zone / timed damage (lava, firejet, lasergate, shock): a 'hazard' event with no attacker, per-fighter cooldown,
   * part multiplier + toughness like explosions, whole-body shove so ragdolls never tear. Returns true when it landed.
   */
  function hazardBurn(hz, f, o) {
    if (!f || f.dead) return false;
    const now = physics.time, cool = hz._cool || (hz._cool = new Map());
    const last = cool.get(f);
    if (last !== undefined && now - last < o.cooldown) return false;
    cool.set(f, now);
    const part = o.part || 'spine2';
    let dmg = o.damage * partMult(cfg, part);
    if (f.toughness) dmg /= f.toughness;
    const dir = o.dir || { x: 0, y: 1 }, dv = o.dv || 0;
    if (dv) f.ragdoll.addVelocity(dir.x * dv, dir.y * dv);
    if (dmg < (cfg.combat.minDamage ?? 1)) return true;
    const evt = {
      attacker: null, victim: f, part, point: o.point || { x: f.x, y: f.y }, normal: { x: dir.x, y: dir.y },
      speed: dv, impulse: 0, damage: dmg, isCrit: false, source: 'hazard', kind: 'hazard', hazardDamage: o.damage,
      weaponId: null, weapon: null, isBlade: false, hazard: hz,
      attackerVel: { x: dir.x * dv, y: dir.y * dv }, relVel: { x: dir.x * dv, y: dir.y * dv }, time: now,
    };
    f.applyHit(evt);
    if (hooks.onHit) hooks.onHit(evt);
    return true;
  }
  /** Fighter (alive, attached part) behind a fixture's userData, else null. */
  const fighterOf = (ud) => (ud && ud.kind === 'part' && ud.fighter && !ud.detached && !ud.fighter.dead ? ud.fighter : null);
  /** Touching contacts of `body`: cb(otherBody, otherFixtureUserData, contact). */
  function forTouching(body, cb) {
    for (let ce = body.getContactList(); ce; ce = ce.next) {
      const c = ce.contact;
      if (!c.isTouching()) continue;
      const fa = c.getFixtureA(), other = fa.getBody() === body ? c.getFixtureB() : fa;
      const ob = other.getBody();
      if (ob.__dead) continue;
      cb(ob, other.getUserData() || {}, c);
    }
  }
  const norm = (x, y) => { const L = Math.hypot(x, y) || 1; return { x: x / L, y: y / L }; };
  const isHeldWeapon = (ud) => ud.kind === 'weapon' && ud.weapon && (ud.weapon.holder || ud.weapon.returnTo);

  // ---- spikeball ------------------------------------------------------------------------------------
  function makeSpikeball(def) {
    const hz = base('spikeball', def);
    const r = def.r ?? 0.45, speed = def.speed ?? 4, damage = def.damage ?? 14, arm = def.arm ?? 0, orbit = def.orbit ?? speed;
    const a0 = def.angle ?? -Math.PI / 2;                 // orbiting balls start hanging below the pivot
    const posAt = (t) => arm > 0 ? { x: def.x + Math.cos(a0 + orbit * t) * arm, y: def.y + Math.sin(a0 + orbit * t) * arm } : { x: def.x, y: def.y };
    const p0 = posAt(0);
    const body = mkBody('kinematic', p0.x, p0.y, hz);
    fixture(body, new pl.Circle(r), hz, { friction: H.spikeball.friction, damaging: true, damage });
    hz.knock = def.knock ?? H.spikeball.knock;
    body.setAngularVelocity(speed);
    hz.update = (dt) => {
      body.setAngularVelocity(speed);
      if (arm > 0) { const p = posAt(physics.time + dt); driveTo(body, p.x, p.y, dt); } else body.setLinearVelocity(V(0, 0));
    };
    hz.danger = () => { const p = body.getPosition(); return { t: 'spikeball', x: p.x, y: p.y, half: r + 0.2, hop: false }; };
    const spikes = Math.max(8, Math.round(r * 22));
    hz.draw = (ctx) => {
      const p = body.getPosition();
      if (arm > 0) {
        // pivot plate + steel arm with a few chain rings
        ctx.fillStyle = COL.darker; ctx.beginPath(); ctx.arc(def.x, def.y, 0.22, 0, TAU); ctx.fill();
        ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.11; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(def.x, def.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        ctx.strokeStyle = COL.steel; ctx.lineWidth = 0.035;
        ctx.beginPath(); ctx.moveTo(def.x, def.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        const n = Math.max(2, Math.round(arm / 0.3));
        ctx.lineWidth = 0.03;
        for (let i = 1; i < n; i++) { const k = i / n; ctx.beginPath(); ctx.arc(def.x + (p.x - def.x) * k, def.y + (p.y - def.y) * k, 0.07, 0, TAU); ctx.stroke(); }
        ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(def.x, def.y, 0.12, 0, TAU); ctx.fill();
        ctx.strokeStyle = COL.yellow; ctx.lineWidth = 0.04; ctx.stroke();
      }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(body.getAngle());
      ctx.fillStyle = COL.steel; ctx.beginPath();
      for (let i = 0; i < spikes; i++) {
        const a = (i / spikes) * TAU, w = 0.18 / spikes * TAU;
        ctx.moveTo(Math.cos(a - w) * r * 0.82, Math.sin(a - w) * r * 0.82);
        ctx.lineTo(Math.cos(a) * (r + 0.16), Math.sin(a) * (r + 0.16));
        ctx.lineTo(Math.cos(a + w) * r * 0.82, Math.sin(a + w) * r * 0.82);
      }
      ctx.fill();
      ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(0, 0, r * 0.86, 0, TAU); ctx.fill();
      ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.05; ctx.stroke();
      ctx.fillStyle = COL.slab; ctx.beginPath(); ctx.arc(-r * 0.25, r * 0.25, r * 0.36, 0, TAU); ctx.fill();
      ctx.fillStyle = COL.steelD;
      for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + 0.4; ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, 0.05, 0, TAU); ctx.fill(); }
      ctx.fillStyle = COL.red; ctx.beginPath(); ctx.arc(0, 0, r * 0.14, 0, TAU); ctx.fill();
      ctx.restore();
    };
    return hz;
  }

  // ---- bouncer --------------------------------------------------------------------------------------
  function makeBouncer(def) {
    const hz = base('bouncer', def);
    const w = def.w ?? 1.2, power = def.power ?? 10, h = H.bouncer.height;
    const body = mkBody('static', def.x, def.y + h / 2, hz);
    fixture(body, new pl.Box(w / 2, h / 2), hz, { friction: H.bouncer.friction });
    hz.squash = 0; hz.launched = 0;
    const cool = new Map();
    hz.update = (dt) => {
      hz.squash = Math.max(0, hz.squash - dt);
      forTouching(body, (ob, ud) => {
        if (!ob.isDynamic() || isHeldWeapon(ud)) return;
        const c = ob.getWorldCenter();
        if (c.y < def.y + h * 0.5) return;                                 // side bumps don't launch
        const f = ud.kind === 'part' ? ud.fighter : null;
        if (ud.kind === 'part' && (!f || ud.detached)) return;
        const key = f || ob, last = cool.get(key);
        if (last !== undefined && physics.time - last < H.bouncer.cooldown) return;
        cool.set(key, physics.time);
        // fighters: deferred like the spike launch (Fighter.update fires it once the landing plunge has stopped, topping up to `power`)
        if (f) f._launch = { x: 0, y: power, t: 0.12 };
        else { const v = ob.getLinearVelocity(); ob.applyLinearImpulse(V(0, Math.max(0, power - v.y) * ob.getMass()), c, true); }
        hz.squash = 0.32; hz.launched++;
        if (hooks.onBounce) hooks.onBounce({ hazard: hz, point: { x: c.x, y: def.y }, fighter: f, power });
      });
      if (cool.size > 40) for (const [k, t] of cool) if (physics.time - t > 2) cool.delete(k);
    };
    hz.danger = () => null;
    hz.draw = (ctx) => {
      const s = hz.squash > 0 ? Math.sin(Math.min(1, hz.squash / 0.32) * Math.PI) : 0;
      ctx.save(); ctx.translate(def.x, def.y);
      // base plate + springs
      ctx.fillStyle = COL.darker; ctx.fillRect(-w / 2 - 0.06, -0.05, w + 0.12, 0.1);
      ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.04;
      const sh = h * (1 - s * 0.55);
      for (const sx of [-w * 0.3, w * 0.3]) {
        ctx.beginPath();
        for (let i = 0; i <= 6; i++) ctx.lineTo(sx + (i % 2 ? 0.08 : -0.08), 0.02 + (sh - 0.04) * i / 6);
        ctx.stroke();
      }
      // pad: green rubber, squashes wider when it fires
      ctx.scale(1 + s * 0.12, 1 - s * 0.45);
      ctx.fillStyle = COL.pad; ctx.beginPath(); ctx.roundRect(-w / 2, h * 0.35, w, h * 0.65, 0.08); ctx.fill();
      ctx.fillStyle = COL.padD; ctx.fillRect(-w / 2 + 0.06, h * 0.35, w - 0.12, 0.05);
      ctx.strokeStyle = COL.dark; ctx.lineWidth = 0.04; ctx.beginPath(); ctx.roundRect(-w / 2, h * 0.35, w, h * 0.65, 0.08); ctx.stroke();
      // up-chevrons
      ctx.fillStyle = COL.yellow;
      for (let i = 0; i < Math.max(1, Math.round(w / 0.5)); i++) {
        const cx = -w / 2 + (i + 0.5) * (w / Math.max(1, Math.round(w / 0.5)));
        ctx.beginPath(); ctx.moveTo(cx - 0.1, h * 0.55); ctx.lineTo(cx, h * 0.92); ctx.lineTo(cx + 0.1, h * 0.55); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    };
    return hz;
  }

  // ---- wind -------------------------------------------------------------------------------------------
  function makeWind(def) {
    const hz = base('wind', def);
    const w = def.w ?? 3, h = def.h ?? 3, fx = def.fx ?? 0, fy = def.fy ?? 0, period = def.period, duty = def.duty ?? H.wind.duty, warn = H.wind.warn;
    const x0 = def.x - w / 2, x1 = def.x + w / 2, y0 = def.y - h / 2, y1 = def.y + h / 2;
    const d = norm(fx, fy), horiz = Math.abs(fx) >= Math.abs(fy);
    const n = Math.min(40, Math.max(8, Math.round(w * h * 1.2)));
    const streaks = []; for (let i = 0; i < n; i++) streaks.push({ u: Math.random(), v: Math.random(), len: 0.35 + Math.random() * 0.5, sp: 0.7 + Math.random() * 0.6 });
    hz.state = period ? 'off' : 'on';
    const stateNow = () => {
      if (!period) return 'on';
      const t = cycleT(period, def.phase);
      return t < warn ? 'warn' : t < warn + duty * period ? 'on' : 'off';
    };
    hz.update = (dt) => {
      hz.state = stateNow();
      if (hz.state !== 'on') return;
      // impulses, not forces: planck clears forces after the first sub-step, an impulse covers the whole game step
      forBodiesIn(x0, y0, x1, y1, (b, ud) => {
        if (isHeldWeapon(ud)) return;
        const m = b.getMass() * dt;
        b.applyLinearImpulse(V(fx * m, fy * m), b.getWorldCenter(), true);
      });
    };
    hz.danger = () => null;
    hz.draw = (ctx) => {
      const st = hz.state, on = st === 'on', warnS = st === 'warn';
      ctx.save();
      ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip();
      ctx.fillStyle = on ? 'rgba(200,225,255,0.06)' : 'rgba(200,225,255,0.025)'; ctx.fillRect(x0, y0, w, h);
      ctx.strokeStyle = COL.foam; ctx.lineCap = 'round'; ctx.lineWidth = 0.05;
      const spd = Math.hypot(fx, fy) * (on ? 0.35 : warnS ? 0.08 : 0);
      ctx.globalAlpha = on ? 0.55 : warnS ? 0.25 : 0.08;
      const along = horiz ? w : h, sgn = horiz ? Math.sign(fx) || 1 : Math.sign(fy) || 1;
      for (const s of streaks) {
        const k = (((s.u + physics.time * spd * s.sp / along) % 1) + 1) % 1;
        const a = (sgn > 0 ? k : 1 - k) * along;
        const px = horiz ? x0 + a : x0 + s.v * w, py = horiz ? y0 + s.v * h : y0 + a;
        ctx.beginPath(); ctx.moveTo(px - d.x * s.len * 0.5, py - d.y * s.len * 0.5); ctx.lineTo(px + d.x * s.len * 0.5, py + d.y * s.len * 0.5); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
      // corner ticks so the zone reads even when idle
      ctx.strokeStyle = COL.foam; ctx.globalAlpha = 0.35; ctx.lineWidth = 0.04;
      for (const [cx, cy, sx, sy] of [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]]) {
        ctx.beginPath(); ctx.moveTo(cx, cy + sy * 0.3); ctx.lineTo(cx, cy); ctx.lineTo(cx + sx * 0.3, cy); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    return hz;
  }

  // ---- lowgrav -----------------------------------------------------------------------------------------
  function makeLowgrav(def) {
    const hz = base('lowgrav', def);
    const w = def.w ?? 3, h = def.h ?? 3, scale = def.scale ?? 0.35;
    const x0 = def.x - w / 2, x1 = def.x + w / 2, y0 = def.y - h / 2, y1 = def.y + h / 2;
    const lift = -(1 - scale) * cfg.gravity;                   // m/s^2 upward: gravity inside becomes scale * g
    const n = Math.min(30, Math.max(6, Math.round(w * h * 0.8)));
    const sparks = []; for (let i = 0; i < n; i++) sparks.push({ u: Math.random(), v: Math.random(), sp: 0.25 + Math.random() * 0.35, ph: Math.random() * TAU });
    hz.update = (dt) => {
      forBodiesIn(x0, y0, x1, y1, (b, ud) => { if (!isHeldWeapon(ud)) b.applyLinearImpulse(V(0, lift * b.getMass() * dt), b.getWorldCenter(), true); });
    };
    hz.danger = () => null;
    hz.draw = (ctx) => {
      ctx.fillStyle = 'rgba(150,120,255,0.09)'; ctx.fillRect(x0, y0, w, h);
      ctx.strokeStyle = 'rgba(190,170,255,0.35)'; ctx.lineWidth = 0.04; ctx.setLineDash([0.18, 0.14]); ctx.strokeRect(x0, y0, w, h); ctx.setLineDash([]);
      ctx.fillStyle = '#d9ccff';
      for (const s of sparks) {
        const k = (((s.v + physics.time * s.sp / h) % 1) + 1) % 1;
        const a = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(physics.time * 3 + s.ph));
        ctx.globalAlpha = a * Math.sin(k * Math.PI);
        const px = x0 + s.u * w + Math.sin(physics.time * 1.3 + s.ph) * 0.12, py = y0 + k * h;
        ctx.beginPath(); ctx.moveTo(px, py + 0.06); ctx.lineTo(px + 0.04, py); ctx.lineTo(px, py - 0.06); ctx.lineTo(px - 0.04, py); ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    return hz;
  }

  // ---- lava ----------------------------------------------------------------------------------------------
  function makeLava(def) {
    const hz = base('lava', def);
    const w = def.w ?? 3, damage = def.damage ?? 8, th = H.lava.thick;
    const body = mkBody('static', def.x, def.y - th / 2, hz);
    fixture(body, new pl.Box(w / 2, th / 2), hz, { friction: H.lava.friction });
    hz.emberT = 0; hz.burns = 0;
    hz.update = (dt) => {
      forTouching(body, (ob, ud, c) => {
        const f = fighterOf(ud);
        if (!f) return;
        const wm = c.getWorldManifold(null), p = wm && wm.points && wm.points.length ? wm.points[0] : ob.getWorldCenter();
        if (hazardBurn(hz, f, { damage, part: ud.name, point: { x: p.x, y: p.y }, dir: { x: 0, y: 1 }, dv: H.lava.pop, cooldown: H.lava.every })) {
          hz.burns++;
          for (let i = 0; i < 8; i++) spawnP({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 3, t: 0, dur: 0.5 + Math.random() * 0.3, c: i % 2 ? COL.fireY : COL.lava, r: 0.04, g: -6 });
        }
      });
      hz.emberT -= dt;
      if (hz.emberT <= 0) {
        hz.emberT = 0.12 / Math.max(1, w / 3);
        spawnP({ x: def.x + (Math.random() - 0.5) * w, y: def.y, vx: (Math.random() - 0.5) * 0.4, vy: 0.8 + Math.random() * 1.2, t: 0, dur: 0.9 + Math.random() * 0.5, c: Math.random() < 0.5 ? COL.fireY : COL.fire, r: 0.025 + Math.random() * 0.03, g: 0.6 });
      }
    };
    hz.danger = () => ({ t: 'lava', x: def.x, y: def.y, half: w / 2, hop: true });
    hz.draw = (ctx) => {
      const t = physics.time;
      ctx.save(); ctx.translate(def.x, def.y);
      // dark basalt lip, molten body, bright surface with slow blobs
      ctx.fillStyle = COL.darker; ctx.fillRect(-w / 2 - 0.08, -th - 0.06, w + 0.16, th + 0.06);
      ctx.fillStyle = COL.lavaD; ctx.fillRect(-w / 2, -th, w, th);
      ctx.fillStyle = COL.lava; ctx.fillRect(-w / 2, -th * 0.55, w, th * 0.55);
      ctx.fillStyle = COL.fireY;
      const nb = Math.max(2, Math.round(w / 0.7));
      for (let i = 0; i < nb; i++) {
        const bx = -w / 2 + (i + 0.5) * (w / nb) + Math.sin(t * 0.7 + i * 1.7) * 0.15, br = 0.1 + 0.06 * Math.sin(t * 1.9 + i * 2.3);
        ctx.beginPath(); ctx.ellipse(bx, -0.09, Math.abs(br) + 0.08, Math.abs(br) * 0.5 + 0.02, 0, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = COL.fireW; ctx.globalAlpha = 0.85; ctx.fillRect(-w / 2, -0.03, w, 0.03); ctx.globalAlpha = 1;
      // heat glow above (two flat translucent bands, no gradient)
      ctx.fillStyle = 'rgba(255,120,40,0.16)'; ctx.fillRect(-w / 2, 0, w, 0.35);
      ctx.fillStyle = 'rgba(255,120,40,0.07)'; ctx.fillRect(-w / 2, 0.35, w, 0.35);
      ctx.restore();
    };
    return hz;
  }

  // ---- firejet ---------------------------------------------------------------------------------------------
  function makeFirejet(def) {
    const hz = base('firejet', def);
    const d = DIRS[def.dir] || DIRS.up, len = def.len ?? 3, period = def.period ?? 3, duty = def.duty ?? 0.35, damage = def.damage ?? 10;
    const F = H.firejet, W = F.width;
    const body = mkBody('static', def.x - d.x * 0.15, def.y - d.y * 0.15, hz);
    fixture(body, new pl.Box(d.x ? 0.15 : 0.3, d.x ? 0.3 : 0.15), hz, { friction: 0.6 });
    const cx = def.x + d.x * len / 2, cy = def.y + d.y * len / 2, ax = d.x ? len / 2 : W / 2, ay = d.x ? W / 2 : len / 2;
    const x0 = cx - ax, x1 = cx + ax, y0 = cy - ay, y1 = cy + ay;
    hz.state = 'off'; hz.burns = 0;
    const stateNow = () => { const t = cycleT(period, def.phase); return t < F.sputter ? 'sputter' : t < F.sputter + duty * period ? 'on' : 'off'; };
    hz.update = (dt) => {
      hz.state = stateNow();
      if (hz.state !== 'on') return;
      const victims = new Map();
      forBodiesIn(x0, y0, x1, y1, (b, ud) => {
        if (isHeldWeapon(ud)) return;
        const m = b.getMass() * dt;
        b.applyLinearImpulse(V(d.x * F.push * m, d.y * F.push * m), b.getWorldCenter(), true);
        const f = fighterOf(ud);
        if (f && !victims.has(f)) victims.set(f, { part: ud.name, c: b.getWorldCenter() });
      });
      for (const [f, v] of victims) {
        if (hazardBurn(hz, f, { damage, part: v.part, point: { x: v.c.x, y: v.c.y }, dir: d, dv: F.pop, cooldown: F.every })) {
          hz.burns++;
          for (let i = 0; i < 6; i++) spawnP({ x: v.c.x, y: v.c.y, vx: (Math.random() - 0.5) * 3 + d.x * 2, vy: (Math.random() - 0.5) * 3 + d.y * 2 + 1, t: 0, dur: 0.4, c: i % 2 ? COL.fireY : COL.fire, r: 0.04, g: -4 });
        }
      }
    };
    hz.danger = () => hz.state === 'off' ? null : { t: 'firejet', x: cx, y: cy, half: ax + 0.2, hop: false };
    const ang = Math.atan2(d.y, d.x) - Math.PI / 2;          // local +y = flame direction
    hz.draw = (ctx) => {
      const t = physics.time, st = hz.state;
      ctx.save(); ctx.translate(def.x, def.y); ctx.rotate(ang);
      // nozzle block sunk into the surface behind the mouth
      ctx.fillStyle = COL.darker; ctx.fillRect(-0.36, -0.34, 0.72, 0.34);
      ctx.fillStyle = COL.dark; ctx.fillRect(-0.3, -0.3, 0.6, 0.3);
      stripes(ctx, -0.3, -0.3, 0.6, 0.09);
      ctx.fillStyle = COL.steelD; ctx.fillRect(-0.22, -0.06, 0.44, 0.08);
      ctx.fillStyle = COL.dark; ctx.fillRect(-0.16, -0.05, 0.32, 0.05);
      if (st === 'on') {
        const flick = 0.9 + 0.1 * Math.sin(t * 37) + 0.05 * Math.sin(t * 61);
        const L = len * flick, wob = Math.sin(t * 23) * 0.06;
        const flame = (hw, l, c) => {
          ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-hw, 0);
          ctx.quadraticCurveTo(-hw * 1.15 + wob, l * 0.45, wob * 2, l);
          ctx.quadraticCurveTo(hw * 1.15 + wob, l * 0.45, hw, 0); ctx.closePath(); ctx.fill();
        };
        flame(W / 2 + 0.05, L, 'rgba(255,90,30,0.55)');
        flame(W / 2 - 0.06, L * 0.9, COL.fire);
        flame(W / 2 - 0.16, L * 0.7, COL.fireY);
        flame(W / 2 - 0.24, L * 0.4, COL.fireW);
      } else if (st === 'sputter') {
        // coughing puffs at the mouth
        for (let i = 0; i < 3; i++) {
          const k = ((t * 3 + i * 0.33) % 1);
          ctx.globalAlpha = 0.7 * (1 - k);
          ctx.fillStyle = i % 2 ? COL.fireY : COL.fire; ctx.beginPath(); ctx.arc(Math.sin(t * 17 + i) * 0.1, 0.05 + k * 0.5, 0.05 + k * 0.1, 0, TAU); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      // pilot lamp
      ctx.fillStyle = st === 'off' ? COL.redD : COL.yellow; ctx.beginPath(); ctx.arc(0.24, -0.16, 0.04, 0, TAU); ctx.fill();
      ctx.restore();
    };
    return hz;
  }

  // ---- crumble ------------------------------------------------------------------------------------------------
  function makeCrumble(def) {
    const hz = base('crumble', def);
    const w = def.w ?? 2, h = def.h ?? 0.35, delay = def.delay ?? 0.6, respawn = def.respawn ?? 4, C = H.crumble;
    const cx = def.x, cy = def.y - h / 2;
    const body = mkBody('kinematic', cx, cy, hz);
    const fx = fixture(body, new pl.Box(w / 2, h / 2), hz, { friction: C.friction, grabbable: true });
    hz.state = 'idle'; hz.t = 0; hz.vy = 0; hz.alpha = 1; hz.falls = 0;
    const stoodOn = () => { let on = false; forTouching(body, (ob, ud) => { if (fighterOf(ud) && ob.getWorldCenter().y > def.y - 0.05) on = true; }); return on; };
    const clear = () => { let ok = true; forBodiesIn(cx - w / 2 - 0.2, cy - h / 2 - 0.2, cx + w / 2 + 0.2, cy + h / 2 + 0.6, () => { ok = false; }); return ok; };
    hz.update = (dt) => {
      hz.t += dt;
      switch (hz.state) {
        case 'idle': body.setLinearVelocity(V(0, 0)); if (stoodOn()) { hz.state = 'shake'; hz.t = 0; } break;
        case 'shake': body.setLinearVelocity(V(0, 0)); if (hz.t >= delay) { hz.state = 'fall'; hz.t = 0; hz.vy = 0; hz.falls++; fx.setSensor(true); } break;
        case 'fall':
          hz.vy += cfg.gravity * dt; body.setLinearVelocity(V(0, hz.vy)); hz.alpha = Math.max(0, 1 - hz.t / C.fallTime);
          if (hz.t >= C.fallTime) { hz.state = 'gone'; hz.t = 0; hz.alpha = 0; body.setLinearVelocity(V(0, 0)); body.setPosition(V(cx, cy)); }
          break;
        case 'gone': if (hz.t >= respawn - C.fade && clear()) { hz.state = 'respawn'; hz.t = 0; } break;
        case 'respawn': hz.alpha = Math.min(1, hz.t / C.fade); if (hz.t >= C.fade) { hz.state = 'idle'; hz.alpha = 1; fx.setSensor(false); } break;
      }
    };
    hz.danger = () => null;
    hz.draw = (ctx) => {
      if (hz.alpha <= 0) {
        // ghost outline while it's gone
        ctx.strokeStyle = COL.crumbleE; ctx.globalAlpha = 0.18; ctx.lineWidth = 0.03; ctx.setLineDash([0.12, 0.12]); ctx.strokeRect(cx - w / 2, cy - h / 2, w, h); ctx.setLineDash([]); ctx.globalAlpha = 1;
        return;
      }
      const p = body.getPosition();
      const sh = hz.state === 'shake' ? Math.sin(hz.t * 70) * 0.035 * (0.4 + hz.t / delay) : 0;
      ctx.save(); ctx.translate(p.x + sh, p.y + (hz.state === 'shake' ? Math.sin(hz.t * 53) * 0.015 : 0)); ctx.globalAlpha = hz.alpha;
      ctx.fillStyle = COL.crumble; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeStyle = COL.crumbleE; ctx.lineWidth = 0.05; ctx.lineJoin = 'round'; ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.strokeStyle = COL.darker; ctx.lineWidth = 0.035;
      // segment cracks (always) + spreading cracks while shaking
      const n = Math.max(2, Math.round(w / 0.6));
      for (let i = 1; i < n; i++) { const x = -w / 2 + i * w / n; ctx.beginPath(); ctx.moveTo(x, -h / 2); ctx.lineTo(x + 0.06, 0); ctx.lineTo(x - 0.04, h / 2); ctx.stroke(); }
      if (hz.state === 'shake' || hz.state === 'fall') {
        const k = hz.state === 'fall' ? 1 : Math.min(1, hz.t / delay);
        ctx.lineWidth = 0.045;
        for (let i = 0; i < n; i++) {
          const x = -w / 2 + (i + 0.5) * w / n;
          ctx.beginPath(); ctx.moveTo(x - 0.15 * k, h / 2); ctx.lineTo(x + 0.02, h / 2 - 0.15 * k); ctx.lineTo(x + 0.14 * k, h / 2 - 0.05 * k); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1; ctx.restore();
    };
    return hz;
  }

  // ---- swinger -------------------------------------------------------------------------------------------------
  function makeSwinger(def) {
    const hz = base('swinger', def);
    const chain = def.chain ?? 3, r = def.r ?? 0.5, amp = def.amp ?? 1.0, period = def.period ?? 3.2, damage = def.damage ?? 14, look = def.look || 'ball';
    const S = H.swinger;
    const angAt = (t) => amp * Math.sin(TAU * (t / period + (def.phase || 0)));
    const posAt = (t) => { const a = angAt(t); return { x: def.x + Math.sin(a) * chain, y: def.y - Math.cos(a) * chain, a }; };
    const p0 = posAt(0);
    const body = mkBody('kinematic', p0.x, p0.y, hz, { angle: p0.a });
    const shape = look === 'crate' ? new pl.Box(r, r) : look === 'hook' ? new pl.Box(r * 0.55, r * 0.95) : new pl.Circle(r);
    fixture(body, shape, hz, { friction: S.friction, damaging: true, damage });
    hz.minSpeed = def.minSpeed ?? S.minSpeed;
    hz.knock = def.knock ?? S.knock;
    hz.update = (dt) => {
      const p = posAt(physics.time + dt);
      driveTo(body, p.x, p.y, dt);
      body.setAngularVelocity((p.a - body.getAngle()) / dt);
    };
    hz.danger = () => { const p = body.getPosition(); return { t: 'swinger', x: p.x, y: p.y, half: r + 0.3, hop: false }; };
    hz.draw = (ctx) => {
      const p = body.getPosition(), a = body.getAngle();
      ctx.fillStyle = COL.darker; ctx.fillRect(def.x - 0.28, def.y - 0.06, 0.56, 0.16);
      ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(def.x, def.y, 0.1, 0, TAU); ctx.fill();
      // chain: stroke + rings
      const top = { x: p.x - Math.sin(a) * r * 0.9, y: p.y + Math.cos(a) * r * 0.9 };
      ctx.strokeStyle = look === 'crate' ? COL.rope : COL.steelD; ctx.lineWidth = look === 'crate' ? 0.05 : 0.07; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(def.x, def.y); ctx.lineTo(top.x, top.y); ctx.stroke();
      if (look !== 'crate') {
        ctx.strokeStyle = COL.steel; ctx.lineWidth = 0.03;
        const n = Math.max(2, Math.round(chain / 0.28));
        for (let i = 1; i < n; i++) { const k = i / n; ctx.beginPath(); ctx.arc(def.x + (top.x - def.x) * k, def.y + (top.y - def.y) * k, 0.06, 0, TAU); ctx.stroke(); }
      }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(a);
      if (look === 'crate') {
        ctx.fillStyle = COL.wood; ctx.fillRect(-r, -r, 2 * r, 2 * r);
        ctx.strokeStyle = COL.woodD; ctx.lineWidth = 0.05; ctx.lineJoin = 'round'; ctx.strokeRect(-r + 0.03, -r + 0.03, 2 * r - 0.06, 2 * r - 0.06);
        ctx.lineWidth = 0.06; ctx.beginPath(); ctx.moveTo(-r + 0.08, -r + 0.08); ctx.lineTo(r - 0.08, r - 0.08); ctx.moveTo(-r + 0.08, r - 0.08); ctx.lineTo(r - 0.08, -r + 0.08); ctx.stroke();
        ctx.strokeStyle = COL.rope; ctx.lineWidth = 0.05; ctx.beginPath(); ctx.moveTo(-r, -r * 0.3); ctx.lineTo(r, -r * 0.3); ctx.moveTo(-r, r * 0.3); ctx.lineTo(r, r * 0.3); ctx.stroke();
        ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(0, r, 0.07, 0, TAU); ctx.fill();
      } else if (look === 'hook') {
        // meat hook: shank down from the chain, curl to the side, sharp tip up
        ctx.strokeStyle = COL.steel; ctx.lineWidth = 0.13; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, r * 0.95); ctx.lineTo(0, -r * 0.2); ctx.arc(-r * 0.35, -r * 0.2, r * 0.35, 0, Math.PI, true); ctx.stroke();
        ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.04; ctx.beginPath(); ctx.moveTo(0.03, r * 0.9); ctx.lineTo(0.03, -r * 0.15); ctx.stroke();
        ctx.fillStyle = COL.steel; ctx.beginPath(); ctx.moveTo(-r * 0.7 - 0.07, -r * 0.2); ctx.lineTo(-r * 0.7 + 0.07, -r * 0.2); ctx.lineTo(-r * 0.7, r * 0.25); ctx.closePath(); ctx.fill();
        ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(0, r * 0.95, 0.09, 0, TAU); ctx.fill(); ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.03; ctx.stroke();
      } else {
        ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
        ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.06; ctx.stroke();
        ctx.fillStyle = COL.slab; ctx.beginPath(); ctx.arc(-r * 0.28, r * 0.28, r * 0.42, 0, TAU); ctx.fill();
        ctx.fillStyle = COL.steelD;
        for (let i = 0; i < 6; i++) { const q = i / 6 * TAU; ctx.beginPath(); ctx.arc(Math.cos(q) * r * 0.72, Math.sin(q) * r * 0.72, 0.045, 0, TAU); ctx.fill(); }
        ctx.fillStyle = COL.steel; ctx.beginPath(); ctx.arc(0, r * 0.92, 0.09, 0, TAU); ctx.fill();
      }
      ctx.restore();
    };
    return hz;
  }

  // ---- lasergate ---------------------------------------------------------------------------------------------------
  function makeLasergate(def) {
    const hz = base('lasergate', def);
    const y0 = Math.min(def.y0, def.y1), y1 = Math.max(def.y0, def.y1), period = def.period ?? 3, duty = def.duty ?? 0.5, damage = def.damage ?? 12;
    const L = H.lasergate, x = def.x;
    const body = mkBody('static', x, 0, hz);
    fixture(body, new pl.Box(0.2, 0.11, V(0, y0 - 0.11), 0), hz, { friction: 0.6 });
    fixture(body, new pl.Box(0.2, 0.11, V(0, y1 + 0.11), 0), hz, { friction: 0.6 });
    hz.state = 'off'; hz.zaps = 0;
    const stateNow = () => { const t = cycleT(period, def.phase); return t < L.flicker ? 'flicker' : t < L.flicker + duty * period ? 'on' : 'off'; };
    hz.update = () => {
      hz.state = stateNow();
      if (hz.state !== 'on') return;
      for (const f of liveFighters()) {
        const parts = partsIn(f, x - L.halfWidth, y0, x + L.halfWidth, y1);
        if (!parts) continue;
        const b = parts[0], c = b.getWorldCenter(), ud = b.getFixtureList().getUserData() || {};
        const sx = Math.sign(f.x - x) || (f.facing ? -f.facing : 1);
        if (hazardBurn(hz, f, { damage, part: ud.name, point: { x, y: c.y }, dir: norm(sx, 0.3), dv: L.knock, cooldown: L.every })) {
          hz.zaps++;
          for (let i = 0; i < 10; i++) spawnP({ x, y: c.y, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, t: 0, dur: 0.3, c: i % 3 ? COL.laserL : COL.fireW, r: 0.03, g: -8 });
        }
      }
    };
    hz.danger = () => hz.state === 'off' ? null : { t: 'lasergate', x, y: (y0 + y1) / 2, half: 0.3, hop: false };
    const emitter = (ctx, y, up) => {
      ctx.fillStyle = COL.dark; ctx.fillRect(x - 0.2, up ? y - 0.22 : y, 0.4, 0.22);
      ctx.strokeStyle = COL.edge; ctx.lineWidth = 0.03; ctx.strokeRect(x - 0.2, up ? y - 0.22 : y, 0.4, 0.22);
      ctx.fillStyle = hz.state === 'off' ? COL.redD : COL.laser; ctx.beginPath(); ctx.arc(x, up ? y - 0.05 : y + 0.05, 0.07, 0, TAU); ctx.fill();
    };
    hz.draw = (ctx) => {
      const st = hz.state, t = physics.time;
      emitter(ctx, y0, false); emitter(ctx, y1, true);
      ctx.lineCap = 'butt';
      if (st === 'off') {
        ctx.strokeStyle = COL.laser; ctx.globalAlpha = 0.14; ctx.lineWidth = 0.03; ctx.setLineDash([0.08, 0.16]);
        ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
        return;
      }
      const k = st === 'flicker' ? (Math.sin(t * 43) > 0.2 ? 0.5 : 0.12) : 1;
      ctx.globalAlpha = 0.35 * k; ctx.strokeStyle = COL.laser; ctx.lineWidth = 0.2;
      ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
      ctx.globalAlpha = 0.9 * k; ctx.lineWidth = 0.07; ctx.strokeStyle = COL.laserL; ctx.stroke();
      ctx.globalAlpha = k; ctx.lineWidth = 0.025; ctx.strokeStyle = COL.fireW; ctx.stroke();
      // travelling pulses
      if (st === 'on') {
        ctx.fillStyle = COL.fireW;
        for (let i = 0; i < 3; i++) { const u = ((t * 1.6 + i / 3) % 1); ctx.beginPath(); ctx.arc(x, y0 + (y1 - y0) * u, 0.05, 0, TAU); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
    };
    return hz;
  }

  // ---- bumper --------------------------------------------------------------------------------------------------------
  function makeBumper(def) {
    const hz = base('bumper', def);
    const r = def.r ?? 0.5, power = def.power ?? 9, B = H.bumper;
    const body = mkBody('static', def.x, def.y, hz);
    fixture(body, new pl.Circle(r), hz, { friction: 0.2, restitution: B.restitution });
    hz.flash = 0; hz.kicks = 0;
    const cool = new Map();
    hz.update = (dt) => {
      hz.flash = Math.max(0, hz.flash - dt);
      forTouching(body, (ob, ud) => {
        if (!ob.isDynamic() || isHeldWeapon(ud)) return;
        const f = ud.kind === 'part' ? ud.fighter : null;
        if (ud.kind === 'part' && (!f || ud.detached)) return;
        const key = f || ob, last = cool.get(key);
        if (last !== undefined && physics.time - last < B.cooldown) return;
        cool.set(key, physics.time);
        const c = f ? f.ragdoll.com() : ob.getWorldCenter();
        const d = norm(c.x - def.x, c.y - def.y);
        if (f) { const v = f.ragdoll.velocity(); f.ragdoll.addVelocity(d.x * Math.max(0, power - (v.x * d.x + v.y * d.y)) , d.y * Math.max(0, power - (v.x * d.x + v.y * d.y))); }
        else { const v = ob.getLinearVelocity(), dv = Math.max(0, power - (v.x * d.x + v.y * d.y)) * ob.getMass(); ob.applyLinearImpulse(V(d.x * dv, d.y * dv), ob.getWorldCenter(), true); }
        hz.flash = 0.28; hz.kicks++;
        if (hooks.onBounce) hooks.onBounce({ hazard: hz, point: { x: def.x + d.x * r, y: def.y + d.y * r }, fighter: f, power });
      });
      if (cool.size > 40) for (const [k, t] of cool) if (physics.time - t > 2) cool.delete(k);
    };
    hz.danger = () => null;
    hz.draw = (ctx) => {
      const k = hz.flash > 0 ? hz.flash / 0.28 : 0;
      ctx.save(); ctx.translate(def.x, def.y);
      ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(0, 0, r + 0.06 + k * 0.08, 0, TAU); ctx.fill();
      ctx.fillStyle = COL.neon; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
      ctx.fillStyle = COL.gum; ctx.beginPath(); ctx.arc(0, 0, r * 0.78, 0, TAU); ctx.fill();
      ctx.strokeStyle = COL.neonB; ctx.lineWidth = 0.05; ctx.beginPath(); ctx.arc(0, 0, r * 0.62, 0, TAU); ctx.stroke();
      ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(0, 0, r * 0.4, 0, TAU); ctx.fill();
      ctx.fillStyle = COL.yellow; ctx.font = `bold ${r * 0.5}px system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.save(); ctx.scale(1, -1); ctx.fillText(String(Math.round(power * 10)), 0, 0.01); ctx.restore();
      if (k > 0) { ctx.globalAlpha = k * 0.7; ctx.fillStyle = COL.fireW; ctx.beginPath(); ctx.arc(0, 0, r * (1 + 0.25 * (1 - k)), 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
      ctx.restore();
    };
    return hz;
  }

  // ---- seesaw ---------------------------------------------------------------------------------------------------------
  function makeSeesaw(def) {
    const hz = base('seesaw', def);
    const w = def.w ?? 4, h = def.h ?? 0.3, limit = def.limit ?? 0.45, S = H.seesaw, post = def.post ?? S.post;
    const pivot = mkBody('static', def.x, def.y, hz, { style: 'post' });
    fixture(pivot, new pl.Box(0.13, post / 2, V(0, -post / 2 - 0.02), 0), hz, { friction: 0.6 });
    const plank = mkBody('dynamic', def.x, def.y, hz, { ad: S.damping, angle: def.angle || 0 });
    fixture(plank, new pl.Box(w / 2, h / 2), hz, { density: S.mass / (w * h), friction: S.friction, grabbable: true });
    joint(hz, world.createJoint(new pl.RevoluteJoint({ enableLimit: true, lowerAngle: -limit, upperAngle: limit, collideConnected: false }, pivot, plank, V(def.x, def.y))));
    hz.body = plank;
    hz.danger = () => null;
    hz.draw = (ctx) => {
      // post with a foot
      ctx.fillStyle = COL.darker; ctx.fillRect(def.x - 0.13, def.y - post - 0.02, 0.26, post + 0.02);
      ctx.fillRect(def.x - 0.4, def.y - post - 0.02, 0.8, 0.12);
      ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.moveTo(def.x - 0.13, def.y - 0.5); ctx.lineTo(def.x - 0.34, def.y - post); ctx.lineTo(def.x - 0.13, def.y - post); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(def.x + 0.13, def.y - 0.5); ctx.lineTo(def.x + 0.34, def.y - post); ctx.lineTo(def.x + 0.13, def.y - post); ctx.closePath(); ctx.fill();
      const p = plank.getPosition();
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(plank.getAngle());
      ctx.fillStyle = COL.wood; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = COL.woodD; ctx.fillRect(-w / 2, -h / 2, w, h * 0.3);
      ctx.strokeStyle = COL.woodD; ctx.lineWidth = 0.03;
      for (let x = -w / 2 + 0.5; x < w / 2; x += 0.5) { ctx.beginPath(); ctx.moveTo(x, -h / 2); ctx.lineTo(x, h / 2); ctx.stroke(); }
      ctx.strokeStyle = COL.dark; ctx.lineWidth = 0.04; ctx.lineJoin = 'round'; ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = COL.yellow; ctx.fillRect(-w / 2, -h / 2, 0.14, h); ctx.fillRect(w / 2 - 0.14, -h / 2, 0.14, h);
      ctx.fillStyle = COL.steelD; ctx.beginPath(); ctx.arc(0, 0, 0.09, 0, TAU); ctx.fill();
      ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(0, 0, 0.04, 0, TAU); ctx.fill();
      ctx.restore();
    };
    return hz;
  }

  // ---- boat --------------------------------------------------------------------------------------------------------------
  function makeBoat(def) {
    const hz = base('boat', def);
    const w = def.w ?? 4, h = def.h ?? 0.5, amp = def.amp ?? 0.12, bob = def.bob ?? 0.15, period = def.period ?? 3.5, B = H.boat, D = B.hullDepth;
    const cy = def.y - h / 2;
    const poseAt = (t) => { const u = TAU * (t / period + (def.phase || 0)); return { a: amp * Math.sin(u), y: cy + bob * Math.sin(u * 0.5 + 1.1) }; };
    const p0 = poseAt(0);
    const body = mkBody('kinematic', def.x, p0.y, hz, { angle: p0.a });
    fixture(body, new pl.Box(w / 2, h / 2), hz, { friction: B.friction, grabbable: true });
    // low gunwales at both ends so cargo (and fighters) don't slide straight off
    fixture(body, new pl.Box(0.08, 0.12, V(-w / 2 + 0.08, h / 2 + 0.12), 0), hz, { friction: B.friction, grabbable: true });
    fixture(body, new pl.Box(0.08, 0.12, V(w / 2 - 0.08, h / 2 + 0.12), 0), hz, { friction: B.friction, grabbable: true });
    hz.body = body;
    hz.update = (dt) => {
      const p = poseAt(physics.time + dt);
      driveTo(body, def.x, p.y, dt);
      body.setAngularVelocity((p.a - body.getAngle()) / dt);
    };
    hz.danger = () => null;
    hz.draw = (ctx) => {
      const p = body.getPosition();
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(body.getAngle());
      // hull below the deck: tapered bow/stern, stripe, portholes
      ctx.fillStyle = COL.hull; ctx.beginPath();
      ctx.moveTo(-w / 2 - 0.25, h / 2); ctx.lineTo(w / 2 + 0.25, h / 2); ctx.lineTo(w / 2 - 0.35, -h / 2 - D); ctx.lineTo(-w / 2 + 0.35, -h / 2 - D); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = COL.hullD; ctx.lineWidth = 0.06; ctx.lineJoin = 'round'; ctx.stroke();
      ctx.fillStyle = COL.red; ctx.beginPath();
      ctx.moveTo(-w / 2 + 0.05, -h / 2 - D * 0.35); ctx.lineTo(w / 2 - 0.05, -h / 2 - D * 0.35); ctx.lineTo(w / 2 - 0.12, -h / 2 - D * 0.55); ctx.lineTo(-w / 2 + 0.12, -h / 2 - D * 0.55); ctx.closePath(); ctx.fill();
      ctx.fillStyle = COL.steelD;
      for (let i = 0; i < Math.max(1, Math.round(w / 1.3)); i++) {
        const px = -w / 2 + (i + 0.5) * (w / Math.max(1, Math.round(w / 1.3)));
        ctx.beginPath(); ctx.arc(px, -h / 2 - D * 0.15, 0.1, 0, TAU); ctx.fill();
        ctx.fillStyle = COL.iceD; ctx.beginPath(); ctx.arc(px, -h / 2 - D * 0.15, 0.06, 0, TAU); ctx.fill(); ctx.fillStyle = COL.steelD;
      }
      // deck
      ctx.fillStyle = COL.wood; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeStyle = COL.woodD; ctx.lineWidth = 0.03;
      for (let x = -w / 2 + 0.45; x < w / 2; x += 0.45) { ctx.beginPath(); ctx.moveTo(x, -h / 2); ctx.lineTo(x, h / 2); ctx.stroke(); }
      ctx.strokeStyle = COL.hullD; ctx.lineWidth = 0.05; ctx.strokeRect(-w / 2, -h / 2, w, h);
      // gunwales
      ctx.fillStyle = COL.hullD; ctx.fillRect(-w / 2, h / 2, 0.16, 0.24); ctx.fillRect(w / 2 - 0.16, h / 2, 0.16, 0.24);
      ctx.fillStyle = COL.rope; ctx.fillRect(-w / 2 + 0.03, h / 2 + 0.2, 0.1, 0.05); ctx.fillRect(w / 2 - 0.13, h / 2 + 0.2, 0.1, 0.05);
      ctx.restore();
    };
    return hz;
  }

  // ---- water ---------------------------------------------------------------------------------------------------------------
  function makeWater(def) {
    const hz = base('water', def);
    const x0 = Math.min(def.x0, def.x1), x1 = Math.max(def.x0, def.x1), y = def.y, depth = H.water.depth;
    const lastY = new Map();       // fighter | body -> last centre y
    const ripples = [];            // { x, t, dur, r }
    hz.splashes = 0;
    function splash(x, speed) {
      hz.splashes++;
      const n = Math.min(26, 8 + Math.round(speed * 1.5));
      for (let i = 0; i < n; i++) spawnP({ x: x + (Math.random() - 0.5) * 0.5, y, vx: (Math.random() - 0.5) * 4, vy: 1.5 + Math.random() * Math.min(7, 2 + speed * 0.5), t: 0, dur: 0.5 + Math.random() * 0.4, c: i % 3 ? COL.waterL : COL.foam, r: 0.03 + Math.random() * 0.04, g: 1 });
      ripples.push({ x, t: 0, dur: 0.9, r: 0.3 + Math.min(1.2, speed * 0.08) });
      if (hooks.onSplash) hooks.onSplash({ hazard: hz, point: { x, y }, speed });
    }
    const check = (key, c, vy) => {
      const prev = lastY.get(key);
      lastY.set(key, c.y);
      if (prev !== undefined && prev >= y && c.y < y && c.x >= x0 && c.x <= x1) splash(c.x, Math.abs(vy));
    };
    hz.update = (dt) => {
      for (const f of physics.fighters) { if (!f.ragdoll) continue; const c = f.ragdoll.com(); check(f, c, f.ragdoll.velocity().y); }
      for (const w of physics.weapons) { if (w.holder || w.destroyed || !w.body || w.body.__dead) continue; check(w, w.body.getWorldCenter(), w.body.getLinearVelocity().y); }
      for (const b of crates) if (!b.__dead) check(b, b.getWorldCenter(), b.getLinearVelocity().y);
      for (const hz2 of list) if (hz2.explosiveBodies && !hz2.exploded) { const b = hz2.explosiveBodies[0]; check(b, b.getWorldCenter(), b.getLinearVelocity().y); }
      for (let i = ripples.length - 1; i >= 0; i--) { ripples[i].t += dt; if (ripples[i].t >= ripples[i].dur) ripples.splice(i, 1); }
      if (lastY.size > 80) for (const [k, v] of lastY) if (v < y - depth || k.destroyed || k.__dead || k.dead) lastY.delete(k);
    };
    hz.danger = () => null;
    const wave = (ctx, t, lift) => {
      ctx.beginPath(); ctx.moveTo(x0, y - depth);
      ctx.lineTo(x0, y + Math.sin(t * 1.7 + x0 * 1.4) * 0.05 + lift);
      for (let x = x0; x < x1; x += 0.35) ctx.lineTo(x, y + Math.sin(t * 1.7 + x * 1.4) * 0.05 + Math.sin(t * 2.9 - x * 2.3) * 0.03 + lift);
      ctx.lineTo(x1, y + Math.sin(t * 1.7 + x1 * 1.4) * 0.05 + lift);
      ctx.lineTo(x1, y - depth); ctx.closePath();
    };
    hz.draw = (ctx) => {
      const t = physics.time;
      ctx.fillStyle = COL.water; wave(ctx, t, 0); ctx.fill();
      ctx.fillStyle = 'rgba(20,40,70,0.45)'; ctx.fillRect(x0, y - depth, x1 - x0, depth - 1.2);
    };
    hz.drawOver = (ctx) => {
      const t = physics.time;
      ctx.globalAlpha = 0.42; ctx.fillStyle = COL.waterL; wave(ctx, t, 0); ctx.fill();
      ctx.globalAlpha = 0.9; ctx.strokeStyle = COL.foam; ctx.lineWidth = 0.05; ctx.lineCap = 'round';
      ctx.beginPath();
      for (let x = x0; x <= x1; x += 0.35) { const yy = y + Math.sin(t * 1.7 + x * 1.4) * 0.05 + Math.sin(t * 2.9 - x * 2.3) * 0.03; if (x === x0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); }
      ctx.stroke();
      // sparkle dashes drifting on the surface
      ctx.globalAlpha = 0.5; ctx.lineWidth = 0.03;
      for (let i = 0; i < Math.min(24, (x1 - x0) / 0.8); i++) {
        const px = x0 + ((i * 0.83 + t * 0.25) % (x1 - x0)), py = y - 0.12 - (i % 3) * 0.1;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 0.2, py); ctx.stroke();
      }
      for (const r of ripples) {
        const k = r.t / r.dur; ctx.globalAlpha = (1 - k) * 0.8; ctx.lineWidth = 0.04;
        ctx.beginPath(); ctx.ellipse(r.x, y, r.r * (0.3 + k), 0.06 + k * 0.05, 0, 0, TAU); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    return hz;
  }

  // ---- shock -----------------------------------------------------------------------------------------------------------------
  function makeShock(def) {
    const hz = base('shock', def);
    const w = def.w ?? 3, period = def.period ?? 4, duty = def.duty ?? 0.4, damage = def.damage ?? 9, S = H.shock;
    const x0 = def.x - w / 2, x1 = def.x + w / 2;
    hz.state = 'off'; hz.zaps = 0;
    const stateNow = () => { const t = cycleT(period, def.phase); return t < S.warn ? 'warn' : t < S.warn + duty * period ? 'on' : 'off'; };
    hz.update = () => {
      hz.state = stateNow();
      if (hz.state !== 'on') return;
      for (const f of liveFighters()) {
        const parts = partsIn(f, x0, def.y - 0.15, x1, def.y + S.height);
        if (!parts) continue;
        const b = parts[0], c = b.getWorldCenter(), ud = b.getFixtureList().getUserData() || {};
        if (hazardBurn(hz, f, { damage, part: ud.name, point: { x: c.x, y: def.y + 0.05 }, dir: { x: 0, y: 1 }, dv: S.hop, cooldown: S.every })) {
          hz.zaps++;
          for (let i = 0; i < 8; i++) spawnP({ x: c.x, y: def.y + 0.05, vx: (Math.random() - 0.5) * 5, vy: 1 + Math.random() * 4, t: 0, dur: 0.3, c: i % 2 ? COL.bolt : COL.fireW, r: 0.03, g: -6 });
        }
      }
    };
    hz.danger = () => hz.state === 'off' ? null : { t: 'shock', x: def.x, y: def.y, half: w / 2, hop: true };
    const zig = (ctx, xa, xb, ya, amp) => {
      ctx.beginPath(); ctx.moveTo(xa, ya);
      const n = Math.max(3, Math.round((xb - xa) / 0.22));
      for (let i = 1; i <= n; i++) ctx.lineTo(xa + (xb - xa) * i / n, ya + (i === n ? 0 : (Math.random() - 0.5) * amp));
      ctx.stroke();
    };
    hz.draw = (ctx) => {
      const st = hz.state, t = physics.time;
      // flush metal plate with rails
      ctx.fillStyle = COL.dark; ctx.fillRect(x0, def.y - 0.08, w, 0.1);
      ctx.fillStyle = COL.steelD; ctx.fillRect(x0, def.y - 0.02, w, 0.04);
      ctx.fillStyle = COL.darker; for (let x = x0 + 0.2; x < x1 - 0.1; x += 0.4) ctx.fillRect(x, def.y - 0.06, 0.06, 0.06);
      stripes(ctx, x0 - 0.16, def.y - 0.08, 0.16, 0.1); stripes(ctx, x1, def.y - 0.08, 0.16, 0.1);
      ctx.lineCap = 'round';
      if (st === 'on') {
        ctx.globalAlpha = 0.25; ctx.fillStyle = COL.bolt; ctx.fillRect(x0, def.y, w, 0.25 + Math.sin(t * 40) * 0.04);
        ctx.globalAlpha = 0.9; ctx.strokeStyle = COL.bolt; ctx.lineWidth = 0.05; zig(ctx, x0, x1, def.y + 0.1, 0.22);
        ctx.strokeStyle = COL.fireW; ctx.lineWidth = 0.025; zig(ctx, x0, x1, def.y + 0.08, 0.16);
        ctx.globalAlpha = 1;
      } else if (st === 'warn') {
        ctx.strokeStyle = COL.bolt; ctx.lineWidth = 0.03; ctx.globalAlpha = 0.8;
        for (let i = 0; i < 4; i++) { const x = x0 + ((i * 0.37 + t * 3.1) % 1) * w; zig(ctx, x, x + 0.25, def.y + 0.03, 0.1); }
        ctx.globalAlpha = 1;
      }
      // status lamps at both ends
      ctx.fillStyle = st === 'on' ? COL.bolt : st === 'warn' ? COL.yellow : COL.redD;
      ctx.beginPath(); ctx.arc(x0 - 0.08, def.y + 0.06, 0.04, 0, TAU); ctx.arc(x1 + 0.08, def.y + 0.06, 0.04, 0, TAU); ctx.fill();
    };
    return hz;
  }

  // ---- icicle -------------------------------------------------------------------------------------------------------------------
  function makeIcicle(def) {
    const hz = base('icicle', def);
    const every = Math.max(1, def.every ?? 3.5), len = def.len ?? 0.7, damage = def.damage ?? 14, I = H.icicle, hw = I.halfWidth;
    hz.falling = []; hz.drops = 0; hz.knock = 1;
    hz.cooldown = 1.0;                                  // one hit per fighter per drop (an icicle touches head + shoulder in the same step otherwise)
    hz.cycle = Math.floor(physics.time / every + (def.phase || 0));
    const shard = () => new pl.Polygon([V(-hw, len / 2), V(hw, len / 2), V(0, -len / 2)]);
    function drop() {
      hz.drops++;
      const b = mkBody('dynamic', def.x, def.y - len / 2, hz, { bullet: true, ld: 0, ad: 0.5, style: 'icicle' });
      fixture(b, shard(), hz, { density: I.mass / (hw * len), friction: 0.3, cat: CAT.PROP, damaging: true, damage });
      b.setLinearVelocity(V(0, -1));
      hz.falling.push({ body: b, t: 0 });
    }
    function shatter(b) {
      const p = b.getWorldCenter();
      for (let i = 0; i < 9; i++) spawnP({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 5, vy: 1 + Math.random() * 4, t: 0, dur: 0.5 + Math.random() * 0.3, c: i % 2 ? COL.ice : COL.iceD, r: 0.03 + Math.random() * 0.04, g: 1 });
      physics.destroyBody(b);
      hz.bodies = hz.bodies.filter((x) => x !== b);
    }
    hz.update = (dt) => {
      const cyc = Math.floor(physics.time / every + (def.phase || 0));
      if (cyc !== hz.cycle) { hz.cycle = cyc; drop(); }
      for (let i = hz.falling.length - 1; i >= 0; i--) {
        const it = hz.falling[i], b = it.body;
        it.t += dt;
        let hit = false;
        if (it.t > 0.1) forTouching(b, () => { hit = true; });
        if (hit || it.t > 5 || b.getPosition().y < deathY - 2) { shatter(b); hz.falling.splice(i, 1); }
      }
    };
    hz.danger = () => null;
    hz.draw = (ctx) => {
      const t = cycleT(every, def.phase), grow = Math.min(1, t / Math.max(0.2, every - I.shake)), shaking = t > every - I.shake;
      // anchor: frosted ledge
      ctx.fillStyle = COL.ice; ctx.beginPath(); ctx.roundRect(def.x - 0.32, def.y - 0.04, 0.64, 0.14, 0.05); ctx.fill();
      ctx.fillStyle = COL.iceD; ctx.fillRect(def.x - 0.26, def.y - 0.04, 0.52, 0.03);
      const sx = shaking ? Math.sin(physics.time * 60) * 0.03 : 0, L = len * (0.15 + 0.85 * grow), ww = hw * (0.4 + 0.6 * grow);
      ctx.fillStyle = COL.ice; ctx.beginPath(); ctx.moveTo(def.x - ww, def.y); ctx.lineTo(def.x + ww, def.y); ctx.lineTo(def.x + sx, def.y - L); ctx.closePath(); ctx.fill();
      ctx.fillStyle = COL.iceD; ctx.beginPath(); ctx.moveTo(def.x, def.y); ctx.lineTo(def.x + ww, def.y); ctx.lineTo(def.x + sx, def.y - L); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = COL.iceE; ctx.lineWidth = 0.025; ctx.beginPath(); ctx.moveTo(def.x - ww, def.y); ctx.lineTo(def.x + sx, def.y - L); ctx.lineTo(def.x + ww, def.y); ctx.stroke();
      if (shaking) { ctx.fillStyle = COL.ice; for (let i = 0; i < 3; i++) { const k = (physics.time * 2 + i * 0.3) % 1; ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc(def.x + (i - 1) * 0.1, def.y - 0.05 - k * 0.4, 0.025, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; }
      for (const it of hz.falling) {
        const b = it.body; if (b.__dead) continue;
        const p = b.getPosition();
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(b.getAngle());
        ctx.fillStyle = COL.ice; ctx.beginPath(); ctx.moveTo(-hw, len / 2); ctx.lineTo(hw, len / 2); ctx.lineTo(0, -len / 2); ctx.closePath(); ctx.fill();
        ctx.fillStyle = COL.iceD; ctx.beginPath(); ctx.moveTo(0, len / 2); ctx.lineTo(hw, len / 2); ctx.lineTo(0, -len / 2); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = COL.iceE; ctx.lineWidth = 0.025; ctx.stroke();
        ctx.restore();
      }
    };
    return hz;
  }

  // =================================================================================================
  // ---- §11 hazards: original-level fidelity (block / wheel / spinner / track / pendulum / bridge) --
  // =================================================================================================
  /** Is one of `f`'s hands gripping `body`? (riders holding on are never knocked by what they hold) */
  function holdsBody(f, body) {
    for (const h of ['F', 'B']) { const j = f.grips && f.grips[h]; if (j && !j.__dead && (j.getBodyA() === body || j.getBodyB() === body)) return true; }
    return false;
  }
  /** Fallen out of the world? Destroy the body once (draw / update guard on hz.gone). */
  function dropDead(hz, body) {
    if (hz.gone || body.getPosition().y >= deathY - 2) return false;
    hz.gone = true; physics.destroyBody(body);
    return true;
  }
  /** Fixture point nearest to world point p (circles exact; polygons clamped to their local bounds). */
  function nearestOn(fx, p) {
    const sh = fx.getShape(), b = fx.getBody(), type = sh.getType ? sh.getType() : sh.m_type;
    if (type === 'circle') {
      const lc = sh.getCenter ? sh.getCenter() : sh.m_p, c = b.getWorldPoint(lc), r = sh.getRadius ? sh.getRadius() : sh.m_radius;
      const n = norm(p.x - c.x, p.y - c.y);
      return { x: c.x + n.x * r, y: c.y + n.y * r };
    }
    if (type === 'polygon' && sh.m_vertices) {
      const lp = b.getLocalPoint(V(p.x, p.y));
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const v of sh.m_vertices) { x0 = Math.min(x0, v.x); y0 = Math.min(y0, v.y); x1 = Math.max(x1, v.x); y1 = Math.max(y1, v.y); }
      const q = b.getWorldPoint(V(clamp(lp.x, x0, x1), clamp(lp.y, y0, y1)));
      return { x: q.x, y: q.y };
    }
    const c = b.getWorldCenter();
    return { x: c.x, y: c.y };
  }
  /**
   * Pin a fighter's free hands to the nearest grabbable surface (hazard with grabbable, or static) within `reach` m of each
   * hand — bots that spawn holding on to a pendulum / wheel / ledge (level entry `grabOnStart`). Same joints as
   * Fighter._tryGrabWorld, so the fighter's own grab/release logic takes over afterwards. Returns the number of hands latched.
   */
  function latch(f, o = {}) {
    if (!f || f.dead || !f.ragdoll || !f.grips) return 0;
    const reach = o.reach ?? 1.2, rd = f.ragdoll, G = cfg.grab || {};
    // static ground under the feet is never a hold (same rule as Fighter._tryGrabWorld): bots standing on plain floor
    // just don't latch (their AI then gives the hold up and fights)
    const pv = rd.pelvis.getPosition(), pa = rd.pelvis.getAngle();
    const underfoot = (q) => (q.x - pv.x) * -Math.sin(pa) + (q.y - pv.y) * Math.cos(pa) < -(G.floorHold ?? 0.45) * f.scale;
    let n = 0;
    for (const hand of ['F', 'B']) {
      if (f.grips[hand] || rd.detached['foreArm' + hand] || (f.weaponIn && f.weaponIn(hand))) continue;
      const hp = rd.handPoint(hand);
      let best = null;
      world.queryAABB(new pl.AABB(V(hp.x - reach, hp.y - reach), V(hp.x + reach, hp.y + reach)), (fx) => {
        const ud = fx.getUserData();
        if (!ud || fx.isSensor() || (ud.kind !== 'static' && !(ud.kind === 'hazard' && ud.grabbable))) return true;
        const b = fx.getBody();
        if (b.__dead) return true;
        const q = nearestOn(fx, hp), d = Math.hypot(q.x - hp.x, q.y - hp.y);
        if (ud.kind === 'static' && underfoot(q)) return true;
        if (d <= reach && (!best || d < best.d)) best = { b, q, d };
        return true;
      });
      if (!best) continue;
      const arm = rd.parts['foreArm' + hand];
      const j = world.createJoint(new pl.RevoluteJoint({ collideConnected: false, localAnchorA: best.b.getLocalPoint(V(best.q.x, best.q.y)), localAnchorB: arm.getLocalPoint(V(hp.x, hp.y)) }, best.b, arm));
      f.grips[hand] = j; f.gripKind[hand] = 'world';
      physics.addBreakable({ joint: j, maxForce: (G.worldBreakForce || 4000) * f.scale * f.scale, onBreak: () => { if (f.grips[hand] === j) { f.grips[hand] = null; f.gripKind[hand] = null; } } });
      n++;
    }
    if (n && rd.setPull) rd.setPull(true, { F: !!f.grips.F, B: !!f.grips.B });
    return n;
  }

  // ---- block: unanchored crate / plank / slab / metal box ------------------------------------------
  function makeBlock(def) {
    const hz = base('block', def);
    const B = H.block, w = def.w ?? 1, h = def.h ?? 1, style = def.style || 'crate';
    const mass = def.mass ?? clamp(w * h * B.density * (style === 'metal' ? B.metalMul : 1), B.minMass, B.maxMass);
    const body = mkBody('dynamic', def.x, def.y, hz, { angle: def.angle || 0, ld: B.damping, ad: B.damping, style });
    fixture(body, new pl.Box(w / 2, h / 2), hz, { density: mass / (w * h), friction: def.friction ?? B.friction, restitution: 0.02, cat: CAT.PROP, grabbable: true, style });
    hz.body = body; hz.gone = false; hz.w = w; hz.h = h;
    hz.update = () => { dropDead(hz, body); };
    hz.danger = () => null;
    hz.draw = (ctx) => {
      if (hz.gone) return;
      const p = body.getPosition();
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(body.getAngle());
      drawBlock(ctx, w, h, style);
      ctx.restore();
    };
    return hz;
  }
  function drawBlock(ctx, w, h, style) {
    if (style === 'plank') {
      ctx.fillStyle = COL.wood; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = COL.woodD; ctx.fillRect(-w / 2, -h / 2, w, h * 0.22);
      ctx.strokeStyle = COL.woodD; ctx.lineWidth = 0.025;
      const n = Math.max(1, Math.round(w / 0.55));
      for (let i = 1; i < n; i++) { const x = -w / 2 + i * w / n; ctx.beginPath(); ctx.moveTo(x, -h / 2); ctx.lineTo(x + 0.04, h / 2); ctx.stroke(); }
      ctx.strokeStyle = COL.dark; ctx.lineWidth = 0.04; ctx.lineJoin = 'round'; ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = COL.steelD;
      for (const sx of [-w / 2 + 0.12, w / 2 - 0.12]) { ctx.beginPath(); ctx.arc(sx, 0, Math.min(0.04, h * 0.2), 0, TAU); ctx.fill(); }
    } else if (style === 'slab') {
      slabBox(ctx, w, h);
      ctx.strokeStyle = COL.darker; ctx.lineWidth = 0.03;
      ctx.beginPath(); ctx.moveTo(-w * 0.3, h / 2); ctx.lineTo(-w * 0.22, h * 0.1); ctx.lineTo(-w * 0.32, -h * 0.25); ctx.stroke();
    } else if (style === 'metal') {
      ctx.fillStyle = COL.steelD; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = COL.steel; ctx.fillRect(-w / 2 + 0.05, -h / 2 + 0.05, w - 0.1, h - 0.1);
      ctx.strokeStyle = COL.dark; ctx.lineWidth = 0.04; ctx.lineJoin = 'round'; ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = COL.dark;
      const rx = Math.min(0.12, w * 0.2), ry = Math.min(0.12, h * 0.2);
      for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { ctx.beginPath(); ctx.arc(sx * (w / 2 - rx), sy * (h / 2 - ry), 0.035, 0, TAU); ctx.fill(); }
      stripes(ctx, -w / 2 + 0.08, -0.06, w - 0.16, Math.min(0.12, h * 0.3));
    } else {
      // crate
      ctx.fillStyle = COL.wood; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeStyle = COL.woodD; ctx.lineWidth = 0.05; ctx.lineJoin = 'round'; ctx.strokeRect(-w / 2 + 0.03, -h / 2 + 0.03, w - 0.06, h - 0.06);
      ctx.lineWidth = 0.06; ctx.beginPath(); ctx.moveTo(-w / 2 + 0.07, -h / 2 + 0.07); ctx.lineTo(w / 2 - 0.07, h / 2 - 0.07); ctx.moveTo(-w / 2 + 0.07, h / 2 - 0.07); ctx.lineTo(w / 2 - 0.07, -h / 2 + 0.07); ctx.stroke();
      ctx.strokeStyle = COL.dark; ctx.lineWidth = 0.035; ctx.strokeRect(-w / 2, -h / 2, w, h);
    }
  }

  // ---- wheel: motor (pinned, driven) / free (pinned) / loose (rolling) / roll (rolling, driven) --------
  const pinnedGroup = physics.newGroup();          // pinned wheels never collide with each other (overlapping gear trains)
  function makeWheel(def) {
    const hz = base('wheel', def);
    const Wd = H.wheel, r = def.r ?? 0.6, mode = def.mode || 'motor', speed = def.speed ?? 1.5, teeth = def.teeth | 0, friction = def.friction ?? Wd.friction;
    const mass = def.mass ?? Math.max(Wd.minMass, Math.PI * r * r * Wd.density);
    const pinned = mode === 'motor' || mode === 'free';
    const body = mkBody(mode === 'motor' ? 'kinematic' : 'dynamic', def.x, def.y, hz, { angle: def.angle || 0, ad: mode === 'free' ? Wd.freeDamping : 0.05, ld: pinned ? 0 : 0.02, style: teeth ? 'gear' : 'wheel' });
    fixture(body, new pl.Circle(r), hz, { density: mass / (Math.PI * r * r), friction, restitution: 0.02, cat: pinned ? CAT.STATIC : CAT.PROP, group: pinned ? pinnedGroup : 0, grabbable: true });
    let axle = null;
    if (mode === 'free') {
      const anchor = mkBody('static', def.x, def.y, hz, { style: 'axle' });
      joint(hz, world.createJoint(new pl.RevoluteJoint({ collideConnected: false }, anchor, body, V(def.x, def.y))));
    }
    if (mode === 'motor') body.setAngularVelocity(speed);
    hz.body = body; hz.mode = mode; hz.r = r; hz.gone = false; hz.speed = speed;
    const maxTorque = (def.torque ?? Wd.torque) * r;
    /** Cart: a block resting on this rolling wheel at build time becomes its chassis (axle joint with a motor). */
    hz.attachAxle = (block) => {
      if (axle || !block || pinned) return;
      axle = joint(hz, world.createJoint(new pl.RevoluteJoint({ collideConnected: false, enableMotor: mode === 'roll', motorSpeed: speed, maxMotorTorque: maxTorque }, block, body, V(def.x, def.y))));
      hz.cart = block;
      // a chassis is a trolley, not a loose plank: heavy enough that a fighter landing on one end can't flip it
      if (block.getMass() < Wd.cartMass) { const fx = block.getFixtureList(); fx.setDensity(fx.getDensity() * Wd.cartMass / block.getMass()); block.resetMassData(); }
      if (body.getMass() < Wd.cartMass * 0.4) { const fx = body.getFixtureList(); fx.setDensity(fx.getDensity() * Wd.cartMass * 0.4 / body.getMass()); body.resetMassData(); }
    };
    hz.update = () => {
      if (hz.gone) return;
      if (mode === 'motor') { body.setAngularVelocity(speed); body.setLinearVelocity(V(0, 0)); return; }
      if (mode === 'roll' && !axle) {
        const I = body.getInertia() || 1, wv = body.getAngularVelocity();
        body.applyTorque(clamp(I * (speed - wv) * Wd.gain, -maxTorque, maxTorque), true);
      }
      if (!pinned) dropDead(hz, body);
    };
    hz.danger = () => null;
    hz.draw = (ctx) => {
      if (hz.gone) return;
      const p = body.getPosition();
      ctx.save(); ctx.translate(p.x, p.y);
      if (pinned) { ctx.fillStyle = COL.darker; ctx.beginPath(); ctx.arc(0, 0, Math.min(r * 0.5, 0.28), 0, TAU); ctx.fill(); }
      ctx.rotate(body.getAngle());
      drawWheel(ctx, r, teeth);
      ctx.restore();
    };
    return hz;
  }
  function drawWheel(ctx, r, teeth) {
    if (teeth > 0) {
      // gear: tooth ring, plate, spokes
      const n = Math.max(6, teeth), R = r, ri = r - Math.min(0.16, r * 0.22);
      ctx.fillStyle = COL.steelD; ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * TAU, a1 = ((i + 0.25) / n) * TAU, a2 = ((i + 0.5) / n) * TAU, a3 = ((i + 0.75) / n) * TAU;
        if (i === 0) ctx.moveTo(Math.cos(a0) * ri, Math.sin(a0) * ri);
        ctx.lineTo(Math.cos(a1) * R, Math.sin(a1) * R); ctx.lineTo(Math.cos(a2) * R, Math.sin(a2) * R); ctx.lineTo(Math.cos(a3) * ri, Math.sin(a3) * ri);
        ctx.lineTo(Math.cos(((i + 1) / n) * TAU) * ri, Math.sin(((i + 1) / n) * TAU) * ri);
      }
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = COL.dark; ctx.lineWidth = 0.035; ctx.lineJoin = 'round'; ctx.stroke();
      ctx.fillStyle = COL.slab; ctx.beginPath(); ctx.arc(0, 0, ri * 0.82, 0, TAU); ctx.fill();
      ctx.strokeStyle = COL.edge; ctx.lineWidth = 0.05; ctx.stroke();
      ctx.fillStyle = COL.dark;
      const holes = r > 0.9 ? 6 : 4;
      for (let i = 0; i < holes; i++) { const a = (i / holes) * TAU; ctx.beginPath(); ctx.arc(Math.cos(a) * ri * 0.5, Math.sin(a) * ri * 0.5, ri * 0.16, 0, TAU); ctx.fill(); }
      ctx.fillStyle = COL.yellow; ctx.beginPath(); ctx.arc(0, 0, Math.min(0.12, ri * 0.18), 0, TAU); ctx.fill();
      ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(0, 0, Math.min(0.05, ri * 0.08), 0, TAU); ctx.fill();
      return;
    }
    // plain wheel: dark tyre, wooden rim, spokes
    ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = COL.darker; ctx.lineWidth = 0.04; ctx.stroke();
    ctx.fillStyle = COL.wood; ctx.beginPath(); ctx.arc(0, 0, r * 0.78, 0, TAU); ctx.fill();
    ctx.strokeStyle = COL.woodD; ctx.lineWidth = 0.05; ctx.stroke();
    ctx.fillStyle = COL.slab; ctx.beginPath(); ctx.arc(0, 0, r * 0.62, 0, TAU); ctx.fill();
    ctx.strokeStyle = COL.wood; ctx.lineWidth = Math.max(0.05, r * 0.11); ctx.lineCap = 'butt';
    for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 0.66, Math.sin(a) * r * 0.66); ctx.lineTo(-Math.cos(a) * r * 0.66, -Math.sin(a) * r * 0.66); ctx.stroke(); }
    ctx.fillStyle = COL.steelD; ctx.beginPath(); ctx.arc(0, 0, r * 0.16, 0, TAU); ctx.fill();
    ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(0, 0, r * 0.06, 0, TAU); ctx.fill();
  }

  // ---- spinner: rotating glove wheel. The gloves are SENSORS -> nothing rigid can ever pin or clip a fighter; -------
  //      a body inside a glove gets a velocity knock along the glove's motion (+ outward, + a little up) instead.
  function makeSpinner(def) {
    const hz = base('spinner', def);
    const S = H.spinner, arm = def.arm ?? 1.5, r = def.r ?? 0.3, count = Math.max(1, def.count | 0 || 4), speed = def.speed ?? 2, look = def.look || 'glove';
    const damage = def.damage ?? 0, knock = def.knock ?? 1;
    const hub = mkBody('kinematic', def.x, def.y, hz, { angle: def.phase || 0 });
    for (let i = 0; i < count; i++) {
      const a = (i / count) * TAU;
      fixture(hub, new pl.Circle(V(Math.cos(a) * arm, Math.sin(a) * arm), r), hz, { friction: 0 }).setSensor(true);
    }
    hub.setAngularVelocity(speed);
    hz.knocks = 0; hz.flash = new Array(count).fill(0);
    const cool = new Map();
    const gloveAt = (i) => { const a = hub.getAngle() + (i / count) * TAU; return { x: def.x + Math.cos(a) * arm, y: def.y + Math.sin(a) * arm }; };
    hz.update = (dt) => {
      hub.setAngularVelocity(speed); hub.setLinearVelocity(V(0, 0));
      for (let i = 0; i < count; i++) hz.flash[i] = Math.max(0, hz.flash[i] - dt);
      forTouching(hub, (ob, ud) => {
        if (!ob.isDynamic() || isHeldWeapon(ud)) return;
        const f = ud.kind === 'part' ? fighterOf(ud) : null;
        if (ud.kind === 'part' && !f) return;
        const key = f || ob, last = cool.get(key);
        if (last !== undefined && physics.time - last < S.cooldown) return;
        // the glove this body is inside (nearest glove centre)
        const c = ob.getWorldCenter();
        let gi = 0, gd = Infinity, g = null;
        for (let i = 0; i < count; i++) { const q = gloveAt(i), d = Math.hypot(c.x - q.x, c.y - q.y); if (d < gd) { gd = d; gi = i; g = q; } }
        cool.set(key, physics.time);
        const gv = hub.getLinearVelocityFromWorldPoint(V(g.x, g.y)), tip = Math.hypot(gv.x, gv.y);
        const rad = norm(g.x - def.x, g.y - def.y);
        const dir = tip > 0.05 ? norm(gv.x + rad.x * tip * S.radial, gv.y + rad.y * tip * S.radial + tip * S.up) : { x: rad.x, y: rad.y };
        const dv = clamp(knock * (S.base + S.perSpeed * tip), S.min, S.max);
        if (f) {
          f.ragdoll.addVelocity(dir.x * dv, dir.y * dv);
          ob.applyLinearImpulse(V(dir.x * dv * ob.getMass() * 0.5, dir.y * dv * ob.getMass() * 0.5), c, true);
          if (damage > 0) hazardBurn(hz, f, { damage, part: ud.name, point: { x: c.x, y: c.y }, dir, dv: 0, cooldown: S.cooldown });
        } else {
          ob.applyLinearImpulse(V(dir.x * dv * ob.getMass(), dir.y * dv * ob.getMass()), c, true);
        }
        hz.knocks++; hz.flash[gi] = 0.2;
        if (hooks.onHazardHit) hooks.onHazardHit({ hazard: hz, point: { x: c.x, y: c.y }, speed: dv });
      });
      if (cool.size > 40) for (const [k, t] of cool) if (physics.time - t > 2) cool.delete(k);
    };
    hz.danger = () => ({ t: 'spinner', x: def.x, y: def.y, half: arm + r + 0.15, hop: false });
    hz.draw = (ctx) => {
      const ang = hub.getAngle();
      ctx.save(); ctx.translate(def.x, def.y);
      // mount + arms
      ctx.fillStyle = COL.darker; ctx.beginPath(); ctx.arc(0, 0, 0.3, 0, TAU); ctx.fill();
      ctx.rotate(ang);
      ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.11; ctx.lineCap = 'round';
      for (let i = 0; i < count; i++) { const a = (i / count) * TAU; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * (arm - r * 0.6), Math.sin(a) * (arm - r * 0.6)); ctx.stroke(); }
      ctx.strokeStyle = COL.steel; ctx.lineWidth = 0.035;
      for (let i = 0; i < count; i++) { const a = (i / count) * TAU; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * (arm - r * 0.6), Math.sin(a) * (arm - r * 0.6)); ctx.stroke(); }
      for (let i = 0; i < count; i++) {
        const a = (i / count) * TAU;
        ctx.save(); ctx.translate(Math.cos(a) * arm, Math.sin(a) * arm); ctx.rotate(a);
        const k = hz.flash[i] > 0 ? hz.flash[i] / 0.2 : 0;
        if (look === 'ball') {
          ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
          ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.05; ctx.stroke();
          ctx.fillStyle = COL.slab; ctx.beginPath(); ctx.arc(-r * 0.28, r * 0.28, r * 0.4, 0, TAU); ctx.fill();
        } else {
          // boxing glove: cuff toward the arm, red mitt, thumb bump, lace line
          ctx.fillStyle = COL.dark; ctx.fillRect(-r * 1.15, -r * 0.55, r * 0.5, r * 1.1);
          ctx.fillStyle = COL.red; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
          ctx.beginPath(); ctx.arc(-r * 0.35, r * 0.7, r * 0.42, 0, TAU); ctx.fill();
          ctx.fillStyle = COL.redD; ctx.beginPath(); ctx.arc(r * 0.15, -r * 0.2, r * 0.75, -0.6, 1.3); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = COL.dark; ctx.lineWidth = 0.035; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
          ctx.strokeStyle = COL.fireW; ctx.lineWidth = 0.03; ctx.beginPath(); ctx.moveTo(-r * 0.6, -r * 0.3); ctx.lineTo(-r * 0.2, -r * 0.55); ctx.stroke();
        }
        if (k > 0) { ctx.globalAlpha = k * 0.7; ctx.fillStyle = COL.fireW; ctx.beginPath(); ctx.arc(0, 0, r * (1.1 + 0.4 * (1 - k)), 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
        ctx.restore();
      }
      ctx.restore();
      // hub cap (unrotated)
      ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(def.x, def.y, 0.2, 0, TAU); ctx.fill();
      ctx.strokeStyle = COL.yellow; ctx.lineWidth = 0.045; ctx.stroke();
      ctx.fillStyle = COL.steelD; ctx.beginPath(); ctx.arc(def.x, def.y, 0.06, 0, TAU); ctx.fill();
    };
    return hz;
  }

  // ---- track: tank tread. End gears are rotating kinematic circles (carry riders, ride-around when grabbed); ------
  //      the belt between them is a static box whose faces carry bodies at `speed` (top run +, bottom run − automatically).
  function makeTrack(def) {
    const hz = base('track', def);
    const T = H.track, length = Math.max(0.2, def.length ?? 4), r = def.r ?? 0.5, speed = def.speed ?? 1.4, gears = Math.max(2, def.gears | 0 || 2);
    const cy = def.y - r, x0 = def.x - length / 2, x1 = def.x + length / 2, omega = -speed / r;
    const belt = mkBody('static', def.x, cy, hz, { style: 'belt' });
    fixture(belt, new pl.Box(length / 2, r), hz, { friction: T.friction, conveyor: speed, grabbable: true });
    hz.gearBodies = [];
    for (const gx of [x0, x1]) {
      const g = mkBody('kinematic', gx, cy, hz, { style: 'gear' });
      fixture(g, new pl.Circle(r), hz, { friction: T.friction, grabbable: true });
      g.setAngularVelocity(omega);
      hz.gearBodies.push(g);
    }
    hz.danger = () => null;
    const perim = 2 * length + TAU * r, slat = T.slat, nSlat = Math.max(4, Math.round(perim / slat)), step = perim / nSlat;
    /** Point + tangent on the belt loop at arc length s (0 = left end of the top run, running clockwise). */
    const at = (s) => {
      s = ((s % perim) + perim) % perim;
      if (s < length) return { x: x0 + s, y: def.y, tx: 1, ty: 0 };
      s -= length;
      if (s < Math.PI * r) { const a = Math.PI / 2 - s / r; return { x: x1 + Math.cos(a) * r, y: cy + Math.sin(a) * r, tx: Math.sin(a), ty: -Math.cos(a) }; }
      s -= Math.PI * r;
      if (s < length) return { x: x1 - s, y: cy - r, tx: -1, ty: 0 };
      s -= length;
      const a = -Math.PI / 2 - s / r;
      return { x: x0 + Math.cos(a) * r, y: cy + Math.sin(a) * r, tx: Math.sin(a), ty: -Math.cos(a) };
    };
    /** Inverse of `at`: arc length of a world point on (or near) the loop. */
    const arcOf = (p) => {
      if (p.x > x1) return length + (Math.PI / 2 - Math.atan2(p.y - cy, p.x - x1)) * r;
      if (p.x < x0) { let t = -Math.PI / 2 - Math.atan2(p.y - cy, p.x - x0); if (t < 0) t += TAU; return 2 * length + Math.PI * r + t * r; }
      return p.y >= cy ? p.x - x0 : length + Math.PI * r + (x1 - p.x);
    };
    hz.update = (dt) => {
      for (const g of hz.gearBodies) { g.setAngularVelocity(omega); g.setLinearVelocity(V(0, 0)); }
      // riders holding the belt travel around the loop with it: the belt is a static box (its faces only carry what
      // rests on them), so a hand pinned to it is walked `speed*dt` along the loop each step instead of staying put
      const bp = belt.getPosition();
      for (const f of physics.fighters) {
        if (!f.grips || f.dead) continue;
        for (const h of ['F', 'B']) {
          const j = f.grips[h];
          if (!j || j.__dead || j.getBodyA() !== belt || !j.m_localAnchorA) continue;
          const q = at(arcOf(j.getAnchorA()) + speed * dt);
          j.m_localAnchorA.set(q.x - bp.x, q.y - bp.y);
        }
      }
    };
    const teeth = Math.max(8, Math.round(r * 16)), ri = r - 0.12;
    hz.draw = (ctx) => {
      const t = physics.time;
      // frame between the gears
      ctx.fillStyle = COL.darker; ctx.fillRect(x0, cy - r * 0.45, length, r * 0.9);
      // gears (end ones are bodies; extra ones visual, evenly spaced)
      for (let i = 0; i < gears; i++) {
        const gx = x0 + (length * i) / (gears - 1);
        const ang = i === 0 ? hz.gearBodies[0].getAngle() : i === gears - 1 ? hz.gearBodies[1].getAngle() : omega * t;
        ctx.save(); ctx.translate(gx, cy); ctx.rotate(ang);
        drawWheel(ctx, ri, teeth);
        ctx.restore();
      }
      // belt outline
      ctx.strokeStyle = COL.dark; ctx.lineWidth = 0.14; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.roundRect(x0 - r + 0.07, cy - r + 0.07, length + 2 * r - 0.14, 2 * r - 0.14, r - 0.07); ctx.stroke();
      // slats sliding along the loop
      const off = ((t * speed) % step + step) % step;
      ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.05; ctx.lineCap = 'butt';
      ctx.beginPath();
      for (let i = 0; i < nSlat; i++) {
        const q = at(i * step + off);
        const nx = -q.ty, ny = q.tx;   // outward normal (clockwise loop)
        ctx.moveTo(q.x - nx * 0.02, q.y - ny * 0.02); ctx.lineTo(q.x + nx * 0.1, q.y + ny * 0.1);
      }
      ctx.stroke();
      ctx.strokeStyle = COL.yellow; ctx.lineWidth = 0.03; ctx.globalAlpha = 0.8;
      ctx.beginPath();
      for (let i = 0; i < nSlat; i += 2) { const q = at(i * step + off); const nx = -q.ty, ny = q.tx; ctx.moveTo(q.x + nx * 0.06, q.y + ny * 0.06); ctx.lineTo(q.x + nx * 0.1, q.y + ny * 0.1); }
      ctx.stroke(); ctx.globalAlpha = 1;
    };
    return hz;
  }

  // ---- pendulum: free-swinging wrecking ball on a rod-stiff chain; grabbable / rideable ---------------------
  function makePendulum(def) {
    const hz = base('pendulum', def);
    const Pd = H.pendulum, chain = Math.max(0.3, def.chain ?? 3), r = def.r ?? 0.5, mass = def.mass ?? 30, amp = def.amp ?? 0, look = def.look || 'ball', damage = def.damage ?? 0;
    const anchor = mkBody('static', def.x, def.y, hz, { style: 'anchor' });
    const sx = Math.sin(amp), cx = -Math.cos(amp);
    const bx = def.x + sx * (chain + r), by = def.y + cx * (chain + r);          // ball centre; its local (0, r) is the shackle
    const ball = mkBody('dynamic', bx, by, hz, { angle: amp, ld: Pd.damping, ad: 0.3 });
    const shape = look === 'crate' ? new pl.Box(r, r) : new pl.Circle(r);
    const area = look === 'crate' ? 4 * r * r : Math.PI * r * r;
    fixture(ball, shape, hz, { density: mass / area, friction: Pd.friction, restitution: 0.05, cat: CAT.PROP, grabbable: true, damaging: damage > 0, damage });
    joint(hz, world.createJoint(new pl.DistanceJoint({ frequencyHz: 0, dampingRatio: 0, length: chain, collideConnected: false }, anchor, ball, V(def.x, def.y), V(def.x + sx * chain, def.y + cx * chain))));
    if (damage > 0) { hz.minSpeed = def.minSpeed ?? Pd.minSpeed; hz.knock = def.knock ?? Pd.damageKnock; }
    hz.body = ball; hz.knocks = 0; hz.speed = 0;
    const cool = new Map();
    hz.update = () => {
      const v = ball.getLinearVelocity(), sp = Math.hypot(v.x, v.y);
      hz.speed = sp;
      if (damage > 0 || sp < Pd.minSpeed) return;
      forTouching(ball, (ob, ud) => {
        const f = fighterOf(ud);
        if (!f || holdsBody(f, ball)) return;
        const fv = f.ragdoll.velocity(), rx = v.x - fv.x, ry = v.y - fv.y, rs = Math.hypot(rx, ry);
        if (rs < Pd.minSpeed) return;
        const last = cool.get(f);
        if (last !== undefined && physics.time - last < Pd.cooldown) return;
        cool.set(f, physics.time);
        const dir = norm(rx, ry + rs * 0.25), dv = Math.min(Pd.maxKnock, rs * Pd.knock);
        f.ragdoll.addVelocity(dir.x * dv, dir.y * dv);
        ob.applyLinearImpulse(V(dir.x * dv * ob.getMass(), dir.y * dv * ob.getMass()), ob.getWorldCenter(), true);
        hz.knocks++;
        if (hooks.onHazardHit) hooks.onHazardHit({ hazard: hz, point: ob.getWorldCenter(), speed: rs });
      });
      if (cool.size > 40) for (const [k, t] of cool) if (physics.time - t > 2) cool.delete(k);
    };
    hz.danger = () => { if (hz.speed < Pd.minSpeed) return null; const p = ball.getPosition(); return { t: 'pendulum', x: p.x, y: p.y, half: r + 0.3, hop: false }; };
    hz.draw = (ctx) => {
      const p = ball.getPosition(), top = ball.getWorldPoint(V(0, r));
      ctx.fillStyle = COL.darker; ctx.fillRect(def.x - 0.28, def.y - 0.06, 0.56, 0.16);
      ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(def.x, def.y, 0.1, 0, TAU); ctx.fill();
      ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.07; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(def.x, def.y); ctx.lineTo(top.x, top.y); ctx.stroke();
      ctx.strokeStyle = COL.steel; ctx.lineWidth = 0.03;
      const n = Math.max(2, Math.round(chain / 0.28));
      for (let i = 1; i < n; i++) { const k = i / n; ctx.beginPath(); ctx.arc(def.x + (top.x - def.x) * k, def.y + (top.y - def.y) * k, 0.06, 0, TAU); ctx.stroke(); }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(ball.getAngle());
      if (look === 'crate') drawBlock(ctx, 2 * r, 2 * r, 'crate');
      else {
        ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
        ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.06; ctx.stroke();
        ctx.fillStyle = COL.slab; ctx.beginPath(); ctx.arc(-r * 0.28, r * 0.28, r * 0.42, 0, TAU); ctx.fill();
        ctx.fillStyle = COL.steelD;
        for (let i = 0; i < 6; i++) { const q = (i / 6) * TAU; ctx.beginPath(); ctx.arc(Math.cos(q) * r * 0.72, Math.sin(q) * r * 0.72, 0.045, 0, TAU); ctx.fill(); }
      }
      ctx.fillStyle = COL.steel; ctx.beginPath(); ctx.arc(0, r * 0.92, 0.09, 0, TAU); ctx.fill();
      ctx.restore();
    };
    return hz;
  }

  // ---- bridge: chain of hinged planks between two anchors; sags, swings, walkable, grabbable ----------------
  function makeBridge(def) {
    const hz = base('bridge', def);
    const xa = Math.min(def.x0, def.x1), xb = Math.max(def.x0, def.x1), y = def.y, n = Math.max(2, def.segments | 0 || 12), ph = def.plankH ?? 0.15, sag = Math.max(0, def.sag ?? 0.25);
    const span = xb - xa, group = physics.newGroup();
    // joint points along a parabola sagging `sag` at the middle
    const pts = [];
    for (let k = 0; k <= n; k++) { const u = k / n; pts.push({ x: xa + span * u, y: y - sag * 4 * u * (1 - u) }); }
    let total = 0;
    for (let k = 0; k < n; k++) total += Math.hypot(pts[k + 1].x - pts[k].x, pts[k + 1].y - pts[k].y);
    const L = total / n, plankMass = Math.max(4, L * 0.35 * 30);   // heavy planks: the slack chain hangs instead of buckling up when loaded at one end
    const left = mkBody('static', xa, y, hz, { style: 'post' }), right = mkBody('static', xb, y, hz, { style: 'post' });
    hz.planks = [];
    let prev = left;
    for (let k = 0; k < n; k++) {
      const a = pts[k], b = pts[k + 1];
      const p = mkBody('dynamic', (a.x + b.x) / 2, (a.y + b.y) / 2, hz, { angle: Math.atan2(b.y - a.y, b.x - a.x), ld: 0.3, ad: 1.0, style: 'plank' });
      fixture(p, new pl.Box(L / 2, ph / 2), hz, { density: plankMass / (L * ph), friction: 0.8, group, grabbable: true, style: 'plank' });
      joint(hz, world.createJoint(new pl.RevoluteJoint({ collideConnected: false }, prev, p, V(a.x, a.y))));
      hz.planks.push(p); prev = p;
    }
    joint(hz, world.createJoint(new pl.RevoluteJoint({ collideConnected: false }, prev, right, V(xb, y))));
    hz.danger = () => null;
    hz.draw = (ctx) => {
      // posts
      for (const px of [xa, xb]) { ctx.fillStyle = COL.darker; ctx.fillRect(px - 0.12, y - 0.35, 0.24, 0.85); ctx.fillStyle = COL.dark; ctx.fillRect(px - 0.16, y + 0.42, 0.32, 0.1); }
      // planks
      for (const p of hz.planks) {
        const c = p.getPosition();
        ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(p.getAngle());
        ctx.fillStyle = COL.wood; ctx.fillRect(-L / 2, -ph / 2, L, ph);
        ctx.fillStyle = COL.woodD; ctx.fillRect(-L / 2, -ph / 2, L, ph * 0.3);
        ctx.strokeStyle = COL.dark; ctx.lineWidth = 0.03; ctx.strokeRect(-L / 2, -ph / 2, L, ph);
        ctx.restore();
      }
      // ropes through the plank ends (both hand rails drawn as one rope line above the deck + one at deck level)
      ctx.strokeStyle = COL.rope; ctx.lineWidth = 0.05; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const lift of [0.02, 0.55]) {
        ctx.beginPath(); ctx.moveTo(xa, y + lift);
        for (const p of hz.planks) { const q = p.getWorldPoint(V(0, ph / 2 + lift)); ctx.lineTo(q.x, q.y); }
        ctx.lineTo(xb, y + lift); ctx.stroke();
      }
      ctx.lineWidth = 0.03;
      for (const p of hz.planks) { const a = p.getWorldPoint(V(0, ph / 2)), b = p.getWorldPoint(V(0, ph / 2 + 0.55)); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    };
    return hz;
  }

  /** Carts: a block resting on a rolling wheel at build time becomes its chassis (axle joint), so wheels + plank move as one. */
  function attachCarts() {
    const wheels = list.filter((h) => h.type === 'wheel' && (h.mode === 'roll' || h.mode === 'loose') && h.def.axle !== false && (h.mode === 'roll' || h.def.axle));
    if (!wheels.length) return;
    const blocks = list.filter((h) => h.type === 'block');
    for (const wh of wheels) {
      const wp = wh.body.getPosition();
      let best = null;
      for (const bl of blocks) {
        const bp = bl.body.getPosition(), a = bl.body.getAngle();
        // wheel centre in the block's frame; resting on it when the wheel top touches the block's underside
        const lx = Math.cos(a) * (wp.x - bp.x) + Math.sin(a) * (wp.y - bp.y), ly = -Math.sin(a) * (wp.x - bp.x) + Math.cos(a) * (wp.y - bp.y);
        const gap = -bl.h / 2 - (ly + wh.r);
        if (Math.abs(lx) <= bl.w / 2 + wh.r * 0.5 && ly < 0 && gap > -wh.r * 0.6 && gap < 0.12 && (!best || Math.abs(gap) < best.gap)) best = { bl, gap: Math.abs(gap) };
      }
      if (best) wh.attachAxle(best.bl.body);
    }
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.t += dt;
      if (p.t >= p.dur) { particles[i] = particles[particles.length - 1]; particles.pop(); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += cfg.gravity * p.g * dt;
    }
  }
  function drawParticles(ctx) {
    for (const p of particles) {
      ctx.globalAlpha = Math.min(1, (1 - p.t / p.dur) * 1.6);
      ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ---- shared drawing bits ------------------------------------------------------------------------
  function drawBarrel(ctx, w, h, hz) {
    ctx.fillStyle = COL.red; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 0.08); ctx.fill();
    ctx.fillStyle = COL.redD; ctx.fillRect(-w / 2, -h / 2, w * 0.18, h);
    ctx.fillStyle = COL.yellow;
    ctx.fillRect(-w / 2, h * 0.24, w, 0.07); ctx.fillRect(-w / 2, -h * 0.31, w, 0.07);
    ctx.strokeStyle = COL.dark; ctx.lineWidth = 0.04; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 0.08); ctx.stroke();
    // warning triangle
    ctx.fillStyle = COL.yellow; ctx.beginPath(); ctx.moveTo(0, 0.17); ctx.lineTo(-0.15, -0.09); ctx.lineTo(0.15, -0.09); ctx.closePath(); ctx.fill();
    ctx.fillStyle = COL.dark; ctx.fillRect(-0.025, -0.055, 0.05, 0.14); ctx.fillRect(-0.025, -0.08, 0.05, 0.02);
    if (hz._fuse !== undefined) { ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 0.08); ctx.fill(); }
  }
  function drawJar(ctx, r, hz) {
    ctx.fillStyle = COL.clay; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
    ctx.fillStyle = COL.clayD; ctx.beginPath(); ctx.arc(0, 0, r, Math.PI * 0.6, Math.PI * 1.4); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = COL.red; ctx.fillRect(-r * 0.95, -r * 0.12, r * 1.9, r * 0.24);
    ctx.fillStyle = COL.dark; ctx.beginPath(); ctx.roundRect(-r * 0.4, r * 0.75, r * 0.8, r * 0.3, 0.03); ctx.fill();
    ctx.strokeStyle = COL.dark; ctx.lineWidth = 0.035; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
    // fuse spark
    const t = physics.time * 9;
    ctx.strokeStyle = COL.rope; ctx.lineWidth = 0.03; ctx.beginPath(); ctx.moveTo(0, r * 0.9); ctx.quadraticCurveTo(r * 0.3, r * 1.25, r * 0.15, r * 1.4); ctx.stroke();
    ctx.fillStyle = (t | 0) % 2 ? COL.yellow : '#ff8a2a'; ctx.beginPath(); ctx.arc(r * 0.15, r * 1.4, 0.04 + Math.sin(t) * 0.012, 0, TAU); ctx.fill();
    if (hz._fuse !== undefined) { ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); }
  }
  function slabBox(ctx, w, h) {
    ctx.fillStyle = COL.slab; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = COL.edge; ctx.lineWidth = 0.05; ctx.lineJoin = 'round'; ctx.strokeRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = COL.top; ctx.lineWidth = 0.07; ctx.beginPath(); ctx.moveTo(-w / 2 + 0.03, h / 2); ctx.lineTo(w / 2 - 0.03, h / 2); ctx.stroke();
  }
  /** Yellow band with dark diagonal stripes (axis-aligned rect in the current local frame). */
  function stripes(ctx, x, y, w, h) {
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = COL.yellow; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = COL.dark; ctx.lineCap = 'butt';
    const s = Math.min(w, h);
    ctx.lineWidth = s * 0.5;
    const step = s * 1.5, len = Math.max(w, h) + s * 2;
    for (let d = -len; d < len; d += step) { ctx.beginPath(); ctx.moveTo(x + d, y - s); ctx.lineTo(x + d + len, y - s + len); ctx.stroke(); }
    ctx.restore();
  }

  // ---- explosions ---------------------------------------------------------------------------------
  function explode(hz) {
    if (hz.exploded) return;
    hz.exploded = true; stats.exploded++;
    const c = hz.centre(), cx = c.x, cy = c.y;
    const power = hz.def.power ?? H.power, damage = hz.def.damage ?? H.damage, R = hz.def.radius ?? H.radius;
    for (const b of hz.explosiveBodies) physics.destroyBody(b);
    const seen = new Set(), victims = new Map();
    physics.queryCircle(cx, cy, R, (fx) => {
      const b = fx.getBody();
      if (seen.has(b) || b.__dead || !b.isDynamic()) return;
      seen.add(b);
      const ud = fx.getUserData() || {};
      const wc = b.getWorldCenter();
      let dx = wc.x - cx, dy = wc.y - cy;
      const d = Math.hypot(dx, dy);
      if (d > R) return;
      const fall = 1 - d / R;
      if (d < 0.05) { dx = 0; dy = 1; } else { dx /= d; dy /= d; }
      dy += H.upBias;
      const L = Math.hypot(dx, dy); dx /= L; dy /= L;
      const dv = power * (H.minPush + (1 - H.minPush) * fall);
      const m = b.getMass();
      b.applyLinearImpulse(V(dx * dv * m, dy * dv * m), wc, true);
      if (ud.kind === 'part' && ud.fighter && !ud.detached) {
        const f = ud.fighter, cur = victims.get(f);
        if (!cur || d < cur.d) victims.set(f, { d, part: ud.name, point: { x: wc.x, y: wc.y }, dir: { x: dx, y: dy }, dv });
      } else if (ud.kind === 'hazard' && ud.explosive && ud.hazard !== hz && !ud.hazard.exploded) {
        const other = ud.hazard, fuse = H.chainDelay * (0.5 + d / R);
        other._fuse = other._fuse === undefined ? fuse : Math.min(other._fuse, fuse);
      } else if (ud.kind === 'weapon' && ud.weapon && ud.weapon.holder) {
        // a held weapon's fixtures ride on the forearm; that part already got its impulse
      }
    });
    for (const [f, v] of victims) {
      const fall = 1 - v.d / R;
      let dmg = damage * (0.35 + 0.65 * fall) * partMult(cfg, v.part);
      if (f.toughness) dmg /= f.toughness;
      if (f.dead) dmg *= 0.25;
      if (dmg < (cfg.combat.minDamage ?? 1)) continue;
      const evt = {
        attacker: null, victim: f, part: v.part, point: v.point, normal: { x: v.dir.x, y: v.dir.y },
        speed: v.dv, impulse: 0, damage: dmg, isCrit: false, source: 'explosion', kind: 'explosion',
        weaponId: null, weapon: null, isBlade: false, hazard: hz,
        attackerVel: { x: v.dir.x * v.dv, y: v.dir.y * v.dv }, relVel: { x: v.dir.x * v.dv, y: v.dir.y * v.dv }, time: physics.time,
      };
      f.applyHit(evt);
      if (hooks.onHit) hooks.onHit(evt);
    }
    rings.push({ x: cx, y: cy, r: R, t: 0, dur: 0.5 });
    if (hooks.onExplosion) hooks.onExplosion({ x: cx, y: cy, power, radius: R, damage, hazard: hz });
  }

  // ---- contact listener: conveyor tangent speed, explosive triggers, prop hit feedback ------------
  function preSolve(contact) {
    const fa = contact.getFixtureA(), fb = contact.getFixtureB();
    const ua = fa.getUserData(), ub = fb.getUserData();
    if (!ua || !ub) return;
    const ha = ua.kind === 'hazard' ? ua : null, hb = ub.kind === 'hazard' ? ub : null;
    if (!ha && !hb) return;
    if (ha && ha.conveyor) contact.setTangentSpeed(ha.conveyor);
    else if (hb && hb.conveyor) contact.setTangentSpeed(hb.conveyor);   // same sign either way round (the solver's tangent already flips with the normal)
    const ea = ha && ha.explosive && !ha.hazard.exploded, eb = hb && hb.explosive && !hb.hazard.exploded;
    const pa = ha && !ea && fa.getBody().isDynamic(), pb = hb && !eb && fb.getBody().isDynamic();
    if (!ea && !eb && !pa && !pb) return;
    const wm = contact.getWorldManifold(null);
    if (!wm || !wm.points || !wm.points.length) return;
    const p = wm.points[0];
    const va = fa.getBody().getLinearVelocityFromWorldPoint(p), vb = fb.getBody().getLinearVelocityFromWorldPoint(p);
    const sp = Math.hypot(va.x - vb.x, va.y - vb.y);
    if ((ea || eb) && sp >= H.explodeSpeed) {
      const hz = ea ? ha.hazard : hb.hazard;
      if (!hz._trigger) hz._trigger = { x: p.x, y: p.y };
      return;
    }
    if ((pa || pb) && sp >= (cfg.combat.clashSpeed ?? 6)) {
      // a prop (bag, crate) struck by a fast weapon / limb: thud feedback
      const hz = pa ? ha.hazard : hb.hazard, other = pa ? ub : ua;
      if (other.kind !== 'weapon' && other.kind !== 'part') return;
      if (physics.time - (hz._thudT || -1) < 0.15) return;
      hz._thudT = physics.time;
      if (hooks.onHazardHit) hooks.onHazardHit({ hazard: hz, point: { x: p.x, y: p.y }, speed: sp });
    }
  }
  world.on('pre-solve', preSolve);

  // ---- build -------------------------------------------------------------------------------------
  const MAKERS = {
    piston: makePiston, mover: makeMover, rotor: makeRotor, conveyor: makeConveyor, blade: makeBlade, spikes: makeSpikes, barrel: makeBarrel, jar: makeJar, dropper: makeDropper, rack: makeRack, bag: makeBag,
    spikeball: makeSpikeball, bouncer: makeBouncer, wind: makeWind, lowgrav: makeLowgrav, lava: makeLava, firejet: makeFirejet, crumble: makeCrumble, swinger: makeSwinger,
    lasergate: makeLasergate, bumper: makeBumper, seesaw: makeSeesaw, boat: makeBoat, water: makeWater, shock: makeShock, icicle: makeIcicle,
    block: makeBlock, wheel: makeWheel, spinner: makeSpinner, track: makeTrack, pendulum: makePendulum, bridge: makeBridge,
  };
  for (const def of defs) {
    const mk = MAKERS[def.type];
    if (!mk) { console.warn('[hazards] unknown hazard type', def.type); continue; }
    list.push(mk(def));
  }
  attachCarts();

  // ---- per-step ------------------------------------------------------------------------------------
  function update(dt) {
    for (const hz of list) {
      if (hz.exploded) continue;
      if (hz._trigger) { hz._trigger = null; explode(hz); continue; }
      if (hz._fuse !== undefined) { hz._fuse -= dt; if (hz._fuse <= 0) { explode(hz); continue; } }
      if (hz.update) hz.update(dt);
      // explosives that fall out of the world just vanish
      if (hz.explosiveBodies && hz.centre().y < deathY - 3) { hz.exploded = true; for (const b of hz.explosiveBodies) physics.destroyBody(b); }
    }
    for (let i = crates.length - 1; i >= 0; i--) {
      const b = crates[i];
      if (b.__dead) { crates.splice(i, 1); continue; }
      if (b.getPosition().y < deathY - 3) { physics.destroyBody(b); crates.splice(i, 1); }
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].t += dt; if (rings[i].t >= rings[i].dur) rings.splice(i, 1); }
    if (particles.length) updateParticles(dt);
  }

  function draw(ctx) {
    for (const hz of list) if (hz.draw) hz.draw(ctx);
    drawCrates(ctx);
    if (particles.length) drawParticles(ctx);
    for (const g of rings) {
      const k = g.t / g.dur, e = 1 - (1 - k) * (1 - k);
      ctx.globalAlpha = (1 - k) * 0.55;
      ctx.fillStyle = '#ff8a2a'; ctx.beginPath(); ctx.arc(g.x, g.y, g.r * (0.25 + 0.45 * e), 0, TAU); ctx.fill();
      ctx.globalAlpha = 1 - k;
      ctx.strokeStyle = COL.yellow; ctx.lineWidth = 0.14 * (1 - k) + 0.03;
      ctx.beginPath(); ctx.arc(g.x, g.y, g.r * (0.3 + 0.7 * e), 0, TAU); ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  /** Water surface overlay: call after fighters/weapons are drawn (camera space). */
  function drawOver(ctx) {
    for (const hz of list) if (hz.drawOver) hz.drawOver(ctx);
  }

  function destroy() {
    world.off('pre-solve', preSolve);
    for (const hz of list) {
      for (const j of hz.joints) physics.destroyJoint(j);
      for (const b of hz.bodies) physics.destroyBody(b);
    }
    for (const b of crates) physics.destroyBody(b);
    crates.length = 0; rings.length = 0; list.length = 0; particles.length = 0;
  }

  function debug() {
    const ST = ['wind', 'firejet', 'crumble', 'lasergate', 'shock'];
    return {
      count: list.length, exploded: stats.exploded, dropped: stats.dropped, particles: particles.length,
      types: list.reduce((m, h) => { m[h.type] = (m[h.type] || 0) + 1; return m; }, {}),
      droppers: list.filter((h) => h.type === 'dropper').map((h) => ({ live: h.count(), timer: +h.timer.toFixed(2) })),
      states: list.filter((h) => ST.includes(h.type)).map((h) => h.type + ':' + h.state),
      hits: list.reduce((m, h) => { const n = h.burns ?? h.zaps ?? h.launched ?? h.kicks ?? h.splashes ?? h.drops ?? h.falls ?? h.knocks; if (n !== undefined) m[h.type] = (m[h.type] || 0) + n; return m; }, {}),
      pistons: list.filter((h) => h.type === 'piston' && h.def.trigger).map((h) => ({ state: h.state, fires: h.fires, launched: h.launched })),
      bodies: list.filter((h) => h.body && !h.gone).map((h) => { const p = h.body.getPosition(), v = h.body.getLinearVelocity(); return { t: h.type, x: +p.x.toFixed(2), y: +p.y.toFixed(2), vx: +v.x.toFixed(2), vy: +v.y.toFixed(2), w: +h.body.getAngularVelocity().toFixed(2) }; }),
    };
  }

  return { update, draw, drawOver, destroy, list, debug, explode, rings, stats, particles, latch };
}

function mergeCfg(a, b) {
  const out = { ...a };
  for (const k of Object.keys(b)) out[k] = b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) ? { ...(a[k] || {}), ...b[k] } : b[k];
  return out;
}

export default createHazards;
