// Planck.js world wrapper: fixed sub-stepped simulation, collision groups,
// contact -> hit events, safe deferred destruction, breakable joints.
import { CONFIG } from './config.js';

export const CAT = { STATIC: 1, PART: 2, WEAPON: 4, PROP: 8, DEBRIS: 16 };
export const ALL = 0xffff;

export function planck() {
  const p = window.planck;
  if (!p) throw new Error('planck.js not loaded (window.planck missing)');
  return p;
}

export const V = (x, y) => new (planck().Vec2)(x, y);

export function wrapAngle(a) {
  return a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
}

let bodyUid = 1;

export function createPhysics(cfg = CONFIG) {
  const pl = planck();
  const world = new pl.World({ gravity: V(0, cfg.gravity) });
  // world.step advances continuous-collision too; bullets set per body.

  const P = {
    pl, world, cfg,
    time: 0,
    stepping: false,
    fighters: new Set(),
    weapons: new Set(),
    statics: [],
    _hit: [], _clash: [], _punts: [], _kicks: [],
    _events: [], _clashEvents: [],
    _pending: new Map(),
    _cool: new Map(),
    _destroy: [],
    _breakables: [],
    _group: 0,
    _lastH: cfg.step / cfg.subSteps,
  };

  // static, fixture-less anchor body used by balance MotorJoints
  P.ground = world.createBody({ type: 'static', position: V(0, 0) });
  P.ground.setUserData({ kind: 'ground' });

  // ---- groups & statics -----------------------------------------------------
  P.newGroup = () => --P._group;

  // 'ice' slabs are slippery (DESIGN.md §10); every other style is visual only
  // default ground material = the original's Bouncy.04 (friction 0.4, bounciness 0.4), see cfg.statics
  const styleFriction = (style) => (style === 'ice' ? (cfg.hazards && cfg.hazards.iceFriction) ?? 0.04 : (cfg.statics && cfg.statics.friction) ?? 0.75);
  const staticRestitution = () => (cfg.statics && cfg.statics.restitution) ?? 0;

  P.createStaticBox = (x, y, w, h, o = {}) => {
    const body = world.createBody({ type: 'static', position: V(x, y), angle: o.angle || 0 });
    body.createFixture(new pl.Box(w / 2, h / 2), {
      friction: o.friction ?? styleFriction(o.style), restitution: o.restitution ?? staticRestitution(),
      filterCategoryBits: CAT.STATIC, filterMaskBits: ALL,
      userData: { kind: 'static', style: o.style || 'slab', w, h },
    });
    body.setUserData({ kind: 'static', style: o.style || 'slab', uid: bodyUid++ });
    P.statics.push(body);
    return body;
  };

  P.createStaticPoly = (pts, o = {}) => {
    const body = world.createBody({ type: 'static', position: V(o.x || 0, o.y || 0), angle: o.angle || 0 });
    body.createFixture(new pl.Polygon(pts.map((p) => V(p[0], p[1]))), {
      friction: o.friction ?? styleFriction(o.style), restitution: o.restitution ?? staticRestitution(),
      filterCategoryBits: CAT.STATIC, filterMaskBits: ALL,
      userData: { kind: 'static', style: o.style || 'slab' },
    });
    body.setUserData({ kind: 'static', style: o.style || 'slab', uid: bodyUid++ });
    P.statics.push(body);
    return body;
  };

  // ---- queries ----------------------------------------------------------------
  P.queryCircle = (x, y, r, cb) => {
    const aabb = new pl.AABB(V(x - r, y - r), V(x + r, y + r));
    world.queryAABB(aabb, (fx) => { cb(fx); return true; });
  };

  // ---- destruction (deferred while stepping) -----------------------------------
  P.destroyBody = (b) => {
    if (!b || b.__dead) return;
    b.__dead = true;
    for (let je = b.getJointList(); je; je = je.next) je.joint.__dead = true;
    if (P.stepping) P._destroy.push(['body', b]); else if (!b.__removed) world.destroyBody(b);
  };
  P.destroyJoint = (j) => {
    if (!j || j.__dead) return;
    j.__dead = true;
    if (P.stepping) P._destroy.push(['joint', j]); else if (!j.__removed) world.destroyJoint(j);
  };
  P.destroyFixture = (body, f) => {
    if (!body || body.__dead || !f || f.__dead) return;
    f.__dead = true;
    if (P.stepping) P._destroy.push(['fixture', body, f]); else body.destroyFixture(f);
  };
  world.on('remove-joint', (j) => { j.__dead = true; j.__removed = true; });
  world.on('remove-body', (b) => { b.__dead = true; b.__removed = true; });

  // ---- breakable joints --------------------------------------------------------
  // { joint, maxForce, ttl, onBreak }
  P.addBreakable = (br) => {
    if (br.ttl) br.until = P.time + br.ttl;
    P._breakables.push(br);
    return br;
  };
  P.removeBreakable = (joint) => {
    P._breakables = P._breakables.filter((b) => b.joint !== joint);
  };

  // ---- hit listeners -------------------------------------------------------------
  P.onHit = (fn) => { P._hit.push(fn); return () => { P._hit = P._hit.filter((f) => f !== fn); }; };
  P.onClash = (fn) => { P._clash.push(fn); return () => { P._clash = P._clash.filter((f) => f !== fn); }; };

  // ---- contact classification ------------------------------------------------------
  const C = cfg.combat;

  function attackInfo(ud) {
    if (!ud) return null;
    if (ud.kind === 'weapon') {
      if (!ud.damaging) return null;
      const w = ud.weapon;
      if (w.destroyed || w.prop) return null;
      // a returning thunder hammer still counts as its owner's attack
      // a kicked ninja star counts as the kicker's attack for a moment (exception to "loose items never damage")
      const owner = w.holder || w.returnTo || (w.kickedBy && P.time < w.kickUntil ? w.kickedBy : null);
      return { source: owner ? 'weapon' : 'loose', owner, weapon: w, weaponId: w.id, isBlade: !!ud.blade };
    }
    if (ud.kind === 'part') {
      const f = ud.fighter;
      if (!f || ud.detached) return null;
      if (ud.limb === 'foreArm' && f.isSpinning) return { source: 'fist', owner: f, weapon: null, weaponId: null, isBlade: false };
      if (ud.limb === 'shin' && f.isKicking) return { source: 'foot', owner: f, weapon: null, weaponId: null, isBlade: false };
      return null;
    }
    if (ud.kind === 'hazard') {
      // blades / spikes: no owner, own damage value, lower speed floor, per-hazard cooldown, never crits
      if (!ud.damaging || !ud.hazard || ud.hazard.exploded) return null;
      const Hz = cfg.hazards || {};
      // a hazard may raise its own speed floor (swinging cargo only hurts when it's moving fast)
      return { source: 'hazard', owner: null, weapon: null, weaponId: null, isBlade: false, hazard: ud.hazard, damage: ud.damage, minSpeed: ud.hazard.minSpeed ?? Hz.minSpeed ?? 1.2, cooldown: ud.hazard.cooldown ?? Hz.cooldown ?? 0.45 };
    }
    return null;
  }
  function victimInfo(ud) {
    if (!ud || ud.kind !== 'part' || !ud.fighter || ud.detached) return null;
    return { fighter: ud.fighter, part: ud.name };
  }
  const speedOf = (fx) => { const v = fx.getBody().getLinearVelocity(); return v.x * v.x + v.y * v.y; };

  world.on('pre-solve', (contact) => {
    const fa = contact.getFixtureA(), fb = contact.getFixtureB();
    const ua = fa.getUserData(), ub = fb.getUserData();
    if (!ua || !ub) return;

    // A held weapon sweeping into a loose item never gets blocked: the contact is skipped and the item is punted.
    if (ua.kind === 'weapon' && ub.kind === 'weapon' && ua.weapon !== ub.weapon) {
      const wa = ua.weapon, wb = ub.weapon;
      const looseA = !wa.holder && !wa.returnTo, looseB = !wb.holder && !wb.returnTo;
      if ((wa.holder && looseB) || (wb.holder && looseA)) {
        contact.setEnabled(false);
        const heldFx = wa.holder ? fa : fb, looseFx = wa.holder ? fb : fa;
        const lb = looseFx.getBody();
        const wmP = contact.getWorldManifold(null);
        const p = wmP && wmP.points && wmP.points.length ? wmP.points[0] : lb.getWorldCenter();
        const hv = heldFx.getBody().getLinearVelocityFromWorldPoint(p), lv = lb.getLinearVelocityFromWorldPoint(p);
        const rvx = hv.x - lv.x, rvy = hv.y - lv.y, sp = Math.hypot(rvx, rvy);
        const key = 'k' + (heldFx.getBody().__uid || 0) + ':' + (lb.__uid || 0);
        const last = P._cool.get(key);
        if (sp > 1.5 && (last === undefined || P.time - last > 0.1)) {
          P._cool.set(key, P.time);
          P._punts.push({ body: lb, p: { x: p.x, y: p.y }, vx: rvx, vy: rvy, sp });
          if (sp >= C.clashSpeed) P._clashEvents.push({ point: { x: p.x, y: p.y }, speed: sp, a: attackInfo(wa.holder ? ua : ub), metal: true });
        }
        return;
      }
    }

    // Tools never collide with other tools (held vs held, loose vs loose). Held-vs-loose punts are handled above;
    // parts of the same weapon (chain links / head) still collide so chains keep their shape.
    if (ua.kind === 'weapon' && ub.kind === 'weapon' && ua.weapon !== ub.weapon) { contact.setEnabled(false); return; }

    // HELD tools (incl. links / head of a held chain weapon) only collide with the solid arena (kind 'static'), fighters
    // and other tools: they sweep straight through every hazard / prop body (blocks, barrels, wheels, gears, bridge planks,
    // track slats, pendulums + chains, spinners, movers + ropes, pistons, seesaws, boats, dropped crates) and debris.
    // Loose / thrown / kicked / returning tools (no holder) still collide, so they rest on bridges and platforms.
    // The hazards.js pre-solve still sees the contact (explosive triggers, thuds); hazard damage to fighters is untouched.
    {
      const heldTool = (ud) => ud.kind === 'weapon' && ud.weapon && !!ud.weapon.holder && !ud.weapon.destroyed;
      const propLike = (ud) => ud.kind === 'hazard' || ud.kind === 'debris' || (ud.kind === 'part' && ud.detached);
      if ((heldTool(ua) && propLike(ub)) || (heldTool(ub) && propLike(ua))) { contact.setEnabled(false); return; }
    }

    // Held weapons (incl. a returning thunder hammer) and hands never physically collide with ANOTHER fighter:
    // the contact is disabled, but the hit detection below still runs and combat still applies damage + knockback.
    const passOwner = (ud) => {
      if (ud.kind === 'weapon' && ud.weapon && !ud.weapon.destroyed) return ud.weapon.holder || ud.weapon.returnTo || null;
      if (ud.kind === 'part' && ud.limb === 'foreArm' && ud.fighter && !ud.detached) return ud.fighter;
      return null;
    };
    const otherBody = (owner, vu) => owner && vu.kind === 'part' && vu.fighter && !vu.detached && vu.fighter !== owner;
    if (otherBody(passOwner(ua), ub) || otherBody(passOwner(ub), ua)) contact.setEnabled(false);

    // kicking a loose ninja star launches it (applied between sub-steps, like punts)
    {
      const kickPair = (pu, wu) => pu.kind === 'part' && pu.limb === 'shin' && pu.fighter && pu.fighter.isKicking && !pu.detached
        && wu.kind === 'weapon' && wu.weapon && !wu.weapon.holder && wu.weapon.special === 'kick' && !wu.weapon.destroyed;
      const kp = kickPair(ua, ub) ? [ua, ub, fb] : kickPair(ub, ua) ? [ub, ua, fa] : null;
      if (kp) {
        const f = kp[0].fighter, w = kp[1].weapon;
        if (!(w.kickedBy === f && P.time < w.kickUntil - 1.0)) {
          w.kickedBy = f; w.kickUntil = P.time + 1.2;
          P._kicks.push({ body: kp[2].getBody(), vx: (f.facing || 1) * 18, vy: 1.2 });   // straight at whoever is in front
        }
        contact.setEnabled(false);
        return;
      }
    }

    const aA = attackInfo(ua), aB = attackInfo(ub);
    if (!aA && !aB) return;
    const vA = victimInfo(ua), vB = victimInfo(ub);
    let atk = null, vic = null, atkF = null, vicF = null;
    if (aA && vB && aA.owner !== vB.fighter) { atk = aA; vic = vB; atkF = fa; vicF = fb; }
    if (aB && vA && aB.owner !== vA.fighter && (!atk || speedOf(fb) > speedOf(fa))) { atk = aB; vic = vA; atkF = fb; vicF = fa; }

    const wm = contact.getWorldManifold(null);
    if (!wm || !wm.points || !wm.points.length) return;
    const p = wm.points[0];

    if (!atk) {
      // weapon vs weapon / weapon vs static -> clash (sparks), no damage
      const isStaticA = ua.kind === 'static', isStaticB = ub.kind === 'static';
      if (!((aA && aB) || (aA && isStaticB) || (aB && isStaticA))) return;
      const fx = aA ? fa : fb, other = aA ? fb : fa;
      const va = fx.getBody().getLinearVelocityFromWorldPoint(p);
      const vb = other.getBody().getLinearVelocityFromWorldPoint(p);
      const sp = Math.hypot(va.x - vb.x, va.y - vb.y);
      if (sp < C.clashSpeed) return;
      const key = 'c' + (fx.getBody().__uid || 0) + ':' + (other.getBody().__uid || 0);
      const last = P._cool.get(key);
      if (last !== undefined && P.time - last < C.cooldown) return;
      P._cool.set(key, P.time);
      P._clashEvents.push({ point: { x: p.x, y: p.y }, speed: sp, a: (aA || aB), metal: !!(aA && aB) || ua.kind === 'static' || ub.kind === 'static' });
      return;
    }

    const va = atkF.getBody().getLinearVelocityFromWorldPoint(p);
    const vb = vicF.getBody().getLinearVelocityFromWorldPoint(p);
    const rvx = va.x - vb.x, rvy = va.y - vb.y;
    const speed = Math.hypot(rvx, rvy);
    if (speed < (atk.minSpeed ?? C.minSpeed)) return;

    const atkKey = atk.owner ? 'f' + atk.owner.id : atk.hazard ? 'h' + atk.hazard.uid : 'w' + (atk.weapon ? atk.weapon.uid : 0);
    const keyAny = atkKey + '>' + vic.fighter.id;
    const key = keyAny + ':' + vic.part;
    const last = P._cool.get(key), lastAny = P._cool.get(keyAny);
    if (last !== undefined && P.time - last < (atk.cooldown ?? C.cooldown)) return;
    if (lastAny !== undefined && P.time - lastAny < (atk.cooldown ?? C.cooldownAny)) return;
    P._cool.set(key, P.time); P._cool.set(keyAny, P.time);

    const n = wm.normal;
    const evt = {
      attacker: atk.owner, victim: vic.fighter, part: vic.part,
      point: { x: p.x, y: p.y }, normal: { x: n.x, y: n.y },
      speed, impulse: 0,
      weaponId: atk.weaponId, weapon: atk.weapon, isBlade: atk.isBlade,
      source: atk.source,
      hazard: atk.hazard || null, hazardDamage: atk.damage || 0,
      isCrit: atk.source !== 'hazard' && speed >= C.critSpeed,
      attackerVel: { x: va.x, y: va.y }, relVel: { x: rvx, y: rvy },
      attackerBody: atkF.getBody(), victimBody: vicF.getBody(),
      time: P.time,
    };
    P._events.push(evt);
    P._pending.set(contact, evt);
  });

  world.on('post-solve', (contact, impulse) => {
    const evt = P._pending.get(contact);
    if (!evt) return;
    const arr = impulse && impulse.normalImpulses;
    if (arr) for (let i = 0; i < arr.length; i++) if (arr[i] > evt.impulse) evt.impulse = arr[i];
  });

  // Loose items struck by a held weapon take most of the hit's speed plus a little lift (applied between sub-steps).
  function applyPunts() {
    const W = cfg.weapons;
    for (const k of P._punts) {
      const b = k.body;
      if (b.__dead || b.__removed) continue;
      const m = b.getMass(), sp = Math.min(k.sp, W.puntMaxSpeed ?? 22), s = k.sp > 0 ? sp / k.sp : 0, f = W.puntFactor ?? 0.85;
      b.applyLinearImpulse(V(k.vx * s * f * m, (k.vy * s * f + Math.min(W.puntLift ?? 3, sp * 0.2)) * m), V(k.p.x, k.p.y), true);
    }
    P._punts.length = 0;
  }
  // Kicked ninja stars fly off spinning in the kicker's facing direction.
  function applyKicks() {
    for (const k of P._kicks) {
      const b = k.body;
      if (b.__dead || b.__removed) continue;
      b.setLinearVelocity(V(k.vx, k.vy));
      b.setAngularVelocity(-Math.sign(k.vx || 1) * 30);
      b.setAwake(true);
    }
    P._kicks.length = 0;
  }

  // ---- stepping ------------------------------------------------------------------------
  P.step = (dt = cfg.step) => {
    const n = Math.max(1, Math.round(dt / (cfg.step / cfg.subSteps)));
    const h = dt / n;
    P._lastH = h;
    P.stepping = true;
    for (let i = 0; i < n; i++) {
      world.step(h, cfg.velIters, cfg.posIters);
      P.time += h;
      if (P._punts.length) applyPunts();
      if (P._kicks.length) applyKicks();
    }
    P.stepping = false;
    P._pending.clear();

    // deferred destruction
    if (P._destroy.length) {
      const q = P._destroy; P._destroy = [];
      for (const d of q) {
        if (d[0] === 'body') { if (!d[1].__removed) world.destroyBody(d[1]); }
        else if (d[0] === 'joint') { if (!d[1].__removed) world.destroyJoint(d[1]); }
        else if (d[0] === 'fixture') { if (!d[1].__removed) d[1].destroyFixture(d[2]); }
      }
    }

    // breakables
    if (P._breakables.length) {
      const keep = [];
      for (const br of P._breakables) {
        const j = br.joint;
        if (j.__dead) { if (br.onBreak) br.onBreak('dead'); continue; }
        let broke = false;
        if (br.until && P.time > br.until) broke = true;
        else if (br.maxForce) {
          const f = j.getReactionForce(1 / h);
          if (Math.hypot(f.x, f.y) > br.maxForce) broke = true;
        }
        if (broke) { P.destroyJoint(j); if (br.onBreak) br.onBreak('force'); }
        else keep.push(br);
      }
      P._breakables = keep;
    }

    // dispatch hits
    if (P._events.length) {
      const evs = P._events; P._events = [];
      for (const e of evs) for (const fn of P._hit) fn(e);
    }
    if (P._clashEvents.length) {
      const evs = P._clashEvents; P._clashEvents = [];
      for (const e of evs) for (const fn of P._clash) fn(e);
    }

    // prune cooldown map occasionally
    if (P._cool.size > 400) {
      for (const [k, t] of P._cool) if (P.time - t > 1) P._cool.delete(k);
    }
  };

  P.tagBody = (b) => { b.__uid = bodyUid++; return b; };

  P.destroy = () => {
    for (let b = world.getBodyList(); b;) { const nx = b.getNext(); world.destroyBody(b); b = nx; }
    P.fighters.clear(); P.weapons.clear(); P.statics.length = 0;
  };

  return P;
}
