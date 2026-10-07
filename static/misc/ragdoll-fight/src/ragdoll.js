// Active stickman ragdoll: bodies + revolute joints + low-level pose/balance controller.
import { CONFIG } from './config.js';
import { CAT, ALL, V } from './physics.js';

export const PART_NAMES = ['spine1', 'spine2', 'spine3', 'spine4', 'head',
  'upperArmB', 'foreArmB', 'thighB', 'shinB', 'thighF', 'shinF', 'upperArmF', 'foreArmF'];

// which joint attaches a part to its parent, and which parts hang off it
const PARENT_JOINT = {
  head: 'neck',
  upperArmF: 'shoulderF', foreArmF: 'elbowF', upperArmB: 'shoulderB', foreArmB: 'elbowB',
  thighF: 'hipF', shinF: 'kneeF', thighB: 'hipB', shinB: 'kneeB',
};
const CHILDREN = { upperArmF: ['foreArmF'], upperArmB: ['foreArmB'], thighF: ['shinF'], thighB: ['shinB'] };

/**
 * createRagdoll(worldOrPhysics, {x, y, facing, scale, group, cfg, densityScale})
 * x,y = foot level position. Returns Ragdoll.
 */
export function createRagdoll(worldOrPhysics, opts = {}) {
  const physics = worldOrPhysics.world ? worldOrPhysics : null;
  const world = physics ? physics.world : worldOrPhysics;
  const pl = window.planck;
  const cfg = opts.cfg || CONFIG;
  const R = cfg.ragdoll, B = cfg.balance, S = cfg.spin;
  const s = opts.scale || 1;
  const group = opts.group ?? -1;
  const x0 = opts.x || 0, y0 = opts.y || 0;
  let facing = opts.facing || 1;
  const fs = s * s, ts = s * s * s * s; // force / torque scaling with size

  const rd = {
    parts: {}, joints: {}, detached: {}, partList: [], facing, scale: s, group, cfg,
    isLimp: false, dead: false,
    ctrl: { balance: 1, spinDir: 0, spinSpeed: 0, lean: 0, kickTimer: 0, kickDir: 1, pull: false, twoHand: false, armRest: { F: 0, B: 0 }, armTorque: { F: 0, B: 0 }, step: 0, stepAmp: 0, reach: false, gripHands: { F: false, B: false }, holdAng: { F: null, B: null } },
    grounded: false,
  };

  const d = rd.dims = {
    head: R.head.r * s, neckGap: R.head.neckGap * s, seg: R.spine.segLen * s,
    ua: R.upperArm.len * s, fa: R.foreArm.len * s, thigh: R.thigh.len * s, shin: R.shin.len * s,
    uaW: R.upperArm.w * s, faW: R.foreArm.w * s, thighW: R.thigh.w * s, shinW: R.shin.w * s,
    fist: (R.fist ? R.fist.r : R.foreArm.w * 0.6) * s,
    spineW: R.spine.widths.map((w) => w * s),
  };
  d.hipY = d.thigh + d.shin;
  d.neckY = d.hipY + 4 * d.seg;
  d.shoulderY = d.neckY - 0.03 * s;
  d.legLen = d.hipY;
  d.height = d.neckY + d.neckGap + 2 * d.head;

  function capsule(len, w) {
    const r = w / 2, h = Math.max(len / 2, r + 0.005);
    const pts = [];
    for (let i = 0; i <= 3; i++) { const a = (i / 3) * Math.PI; pts.push(V(r * Math.cos(a), (h - r) + r * Math.sin(a))); }
    for (let i = 0; i <= 3; i++) { const a = Math.PI + (i / 3) * Math.PI; pts.push(V(r * Math.cos(a), -(h - r) + r * Math.sin(a))); }
    return new pl.Polygon(pts);
  }

  function mk(name, x, y, shape, density, o = {}) {
    const body = world.createBody({
      type: 'dynamic', position: V(x0 + x, y0 + y), angle: 0, bullet: !!o.bullet,
      linearDamping: R.linearDamping, angularDamping: R.angularDamping, allowSleep: false,
    });
    const ud = { kind: 'part', name, limb: o.limb || name, ragdoll: rd, fighter: null, detached: false, len: o.len || 0, w: o.w || 0 };
    body.createFixture(shape, {
      density: density * (opts.densityScale || 1), friction: o.friction ?? R.friction, restitution: R.restitution,
      filterGroupIndex: group, filterCategoryBits: CAT.PART, filterMaskBits: ALL, userData: ud,
    });
    body.setUserData(ud);
    if (physics) physics.tagBody(body);
    rd.parts[name] = body; rd.partList.push(body);
    setMass(body, name, ud.limb);
    return body;
  }
  /** 1:1 part masses (cfg.ragdoll.mass, kg at scale 1, x s^2 for giants): rescale the fixtures' densities to hit them. */
  function setMass(body, name, limb) {
    const M = R.mass; if (!M) return;
    const target = M[name] ?? M[limb]; if (!target) return;
    const m = body.getMass(); if (!(m > 0)) return;
    const k = target * fs * (opts.densityScale || 1) / m;
    for (let f = body.getFixtureList(); f; f = f.getNext()) f.setDensity(f.getDensity() * k);
    body.resetMassData();
  }

  // ---- bodies (creation order irrelevant to draw order) ----------------------------
  const off = 0.02 * s;
  for (let i = 0; i < 4; i++) {
    mk('spine' + (i + 1), 0, d.hipY + d.seg * (i + 0.5), capsule(d.seg + 0.04 * s, d.spineW[i]), R.spine.density, { len: d.seg, w: d.spineW[i], limb: 'spine' });
  }
  mk('head', 0, d.neckY + d.neckGap + d.head, new pl.Circle(d.head), R.head.density, { bullet: true, w: d.head * 2, limb: 'head' });
  const armY1 = d.shoulderY - d.ua / 2, armY2 = d.shoulderY - d.ua - d.fa / 2;
  mk('upperArmB', -off * facing, armY1, capsule(d.ua, d.uaW), R.upperArm.density, { len: d.ua, w: d.uaW, limb: 'upperArm' });
  mk('foreArmB', -off * facing, armY2, capsule(d.fa, d.faW), R.foreArm.density, { len: d.fa, w: d.faW, limb: 'foreArm', bullet: true });
  mk('upperArmF', off * facing, armY1, capsule(d.ua, d.uaW), R.upperArm.density, { len: d.ua, w: d.uaW, limb: 'upperArm' });
  mk('foreArmF', off * facing, armY2, capsule(d.fa, d.faW), R.foreArm.density, { len: d.fa, w: d.faW, limb: 'foreArm', bullet: true });
  // big round fists on the hand end of each forearm (same part -> hits count as fist hits)
  for (const n of ['foreArmB', 'foreArmF']) {
    const b = rd.parts[n];
    b.createFixture(new pl.Circle(V(0, -d.fa / 2), d.fist), {
      density: (R.fist ? R.fist.density : R.foreArm.density) * (opts.densityScale || 1), friction: R.friction, restitution: R.restitution,
      filterGroupIndex: group, filterCategoryBits: CAT.PART, filterMaskBits: ALL, userData: b.getUserData(),
    });
    setMass(b, n, 'foreArm');   // forearm + fist together weigh the original's forearm
  }
  mk('thighB', -off * facing, d.hipY - d.thigh / 2, capsule(d.thigh, d.thighW), R.thigh.density, { len: d.thigh, w: d.thighW, limb: 'thigh' });
  mk('shinB', -off * facing, d.shin / 2, capsule(d.shin, d.shinW), R.shin.density, { len: d.shin, w: d.shinW, limb: 'shin', friction: R.footFriction });
  mk('thighF', off * facing, d.hipY - d.thigh / 2, capsule(d.thigh, d.thighW), R.thigh.density, { len: d.thigh, w: d.thighW, limb: 'thigh' });
  mk('shinF', off * facing, d.shin / 2, capsule(d.shin, d.shinW), R.shin.density, { len: d.shin, w: d.shinW, limb: 'shin', friction: R.footFriction });

  // ---- joints ---------------------------------------------------------------------
  function rev(name, a, b, ax, ay, o = {}) {
    const j = world.createJoint(new pl.RevoluteJoint({
      lowerAngle: o.lo ?? 0, upperAngle: o.hi ?? 0, enableLimit: o.lo !== undefined,
      enableMotor: o.motor !== false, maxMotorTorque: (o.torque || 0) * ts, motorSpeed: 0, collideConnected: false,
    }, a, b, V(x0 + ax, y0 + ay)));
    j.__name = name;
    rd.joints[name] = j;
    return j;
  }
  const P = rd.parts, L = R.limits;
  rev('spineJ1', P.spine1, P.spine2, 0, d.hipY + d.seg, { lo: -L.spine, hi: L.spine, torque: B.spineJointTorque });
  rev('spineJ2', P.spine2, P.spine3, 0, d.hipY + 2 * d.seg, { lo: -L.spine, hi: L.spine, torque: B.spineJointTorque });
  rev('spineJ3', P.spine3, P.spine4, 0, d.hipY + 3 * d.seg, { lo: -L.spine, hi: L.spine, torque: B.spineJointTorque });
  rev('neck', P.spine4, P.head, 0, d.neckY + d.neckGap * 0.5, { lo: -L.neck, hi: L.neck, torque: B.neckTorque });
  rev('shoulderB', P.spine4, P.upperArmB, -off * facing, d.shoulderY, { torque: S.idleShoulderTorque });
  rev('elbowB', P.upperArmB, P.foreArmB, -off * facing, d.shoulderY - d.ua, { lo: -L.elbow, hi: L.elbow, torque: S.elbowIdleTorque });
  rev('shoulderF', P.spine4, P.upperArmF, off * facing, d.shoulderY, { torque: S.idleShoulderTorque });
  rev('elbowF', P.upperArmF, P.foreArmF, off * facing, d.shoulderY - d.ua, { lo: -L.elbow, hi: L.elbow, torque: S.elbowIdleTorque });
  rev('hipB', P.spine1, P.thighB, -off * facing, d.hipY, { lo: -L.hip, hi: L.hip, torque: B.hipTorque });
  rev('kneeB', P.thighB, P.shinB, -off * facing, d.shin, { lo: -1, hi: 1, torque: B.kneeTorque });
  rev('hipF', P.spine1, P.thighF, off * facing, d.hipY, { lo: -L.hip, hi: L.hip, torque: B.hipTorque });
  rev('kneeF', P.thighF, P.shinF, off * facing, d.shin, { lo: -1, hi: 1, torque: B.kneeTorque });

  // upright drive: angular-only MotorJoints to a static ground body (solver-stable at any strength)
  rd.balanceJoints = [];
  {
    const ground = physics ? physics.ground : world.createBody({ type: 'static' });
    for (let i = 0; i < 4; i++) {
      const j = world.createJoint(new pl.MotorJoint({ maxForce: 0, maxTorque: 0, correctionFactor: B.uprightCorrection, angularOffset: 0, collideConnected: false }, ground, P['spine' + (i + 1)]));
      j.__name = 'upright' + (i + 1);
      rd.balanceJoints.push(j);
    }
  }

  rd.setFacing = (dir) => {
    facing = rd.facing = dir >= 0 ? 1 : -1;
    // knee bends backwards: shin +angle moves the foot to +x, so backwards = -facing
    for (const k of ['kneeF', 'kneeB']) {
      const j = rd.joints[k]; if (!j || j.__dead) continue;
      if (facing > 0) j.setLimits(-L.kneeBend, 0.05); else j.setLimits(-0.05, L.kneeBend);
    }
    // elbows fold one way only, like the original's (-150..+5 deg): clockwise for a fighter facing right
    if (L.elbowFold !== undefined) {
      for (const k of ['elbowF', 'elbowB']) {
        const j = rd.joints[k]; if (!j || j.__dead) continue;
        const back = L.elbowBack ?? 0.087;
        if (facing > 0) j.setLimits(-L.elbowFold, back); else j.setLimits(-back, L.elbowFold);
      }
    }
  };
  rd.setFacing(facing);

  // ---- helpers ---------------------------------------------------------------------
  rd.pelvis = P.spine1; rd.chest = P.spine4;
  rd.isDetached = (name) => !!rd.detached[name];
  rd.attachedParts = () => rd.partList.filter((b) => !rd.detached[b.getUserData().name]);
  rd.totalMass = () => rd.attachedParts().reduce((m, b) => m + b.getMass(), 0);
  rd.handPoint = (hand = 'F') => { const b = P['foreArm' + hand]; return b.getWorldPoint(V(0, -d.fa / 2)); };
  rd.footPoint = (side = 'F') => { const b = P['shin' + side]; return b.getWorldPoint(V(0, -d.shin / 2)); };
  rd.partEnds = (name) => {
    const b = P[name]; const ud = b.getUserData(); const h = ud.len / 2;
    return [b.getWorldPoint(V(0, h)), b.getWorldPoint(V(0, -h))];
  };
  rd.lowestFootY = () => {
    let y = Infinity;
    for (const side of ['F', 'B']) if (!rd.detached['shin' + side]) y = Math.min(y, rd.footPoint(side).y);
    if (y === Infinity) y = P.spine1.getPosition().y - d.seg;
    return y;
  };
  rd.com = () => {
    let mx = 0, my = 0, m = 0;
    for (const b of rd.attachedParts()) { const c = b.getWorldCenter(), bm = b.getMass(); mx += c.x * bm; my += c.y * bm; m += bm; }
    return m ? { x: mx / m, y: my / m } : { x: 0, y: 0 };
  };
  rd.velocity = () => {
    let vx = 0, vy = 0, m = 0;
    for (const b of rd.attachedParts()) { const v = b.getLinearVelocity(), bm = b.getMass(); vx += v.x * bm; vy += v.y * bm; m += bm; }
    return m ? { x: vx / m, y: vy / m } : { x: 0, y: 0 };
  };
  rd.addVelocity = (dx, dy) => {
    for (const b of rd.attachedParts()) b.applyLinearImpulse(V(dx * b.getMass(), dy * b.getMass()), b.getWorldCenter(), true);
  };
  rd.applyAccel = (ax, ay) => {
    for (const b of rd.attachedParts()) b.applyForceToCenter(V(ax * b.getMass(), ay * b.getMass()), true);
  };
  /** True while this shin's foot rests on something outside the ragdoll (floor, ledge, mover, another fighter). */
  rd.footPlanted = (side) => !rd.detached['shin' + side] && touchingGround(P['shin' + side]);
  const plantedShins = () => { const set = new Set(); for (const side of ['F', 'B']) if (rd.footPlanted(side)) set.add(P['shin' + side]); return set; };
  /**
   * Movement drive: a force on every part EXCEPT planted feet. The body is pushed over its feet and the planted leg's
   * friction holds the foot still; pushing the foot itself (addVelocity / applyAccel) just skids it along the floor.
   */
  rd.propel = (ax, ay) => {
    const skip = plantedShins();
    for (const b of rd.attachedParts()) { if (skip.has(b)) continue; b.applyForceToCenter(V(ax * b.getMass(), ay * b.getMass()), true); }
  };
  /** Push-off hop while walking: velocity added to everything but the planted feet (the stance leg vaults the body over its foot). */
  rd.hop = (dx, dy) => {
    const skip = plantedShins();
    for (const b of rd.attachedParts()) { if (skip.has(b)) continue; b.applyLinearImpulse(V(dx * b.getMass(), dy * b.getMass()), b.getWorldCenter(), true); }
  };

  function touchingGround(b) {
    for (let ce = b.getContactList(); ce; ce = ce.next) {
      if (!ce.contact.isTouching()) continue;
      const o = ce.other.getUserData();
      if (o && o.kind === 'part' && o.ragdoll === rd) continue;
      return true;
    }
    return false;
  }
  rd.updateGrounded = () => {
    let g = false;
    for (const n of ['shinF', 'shinB', 'thighF', 'thighB']) if (!rd.detached[n] && touchingGround(P[n])) { g = true; break; }
    rd.grounded = g;
    return g;
  };
  rd.isGrounded = () => rd.grounded;

  // ---- controller inputs -----------------------------------------------------------
  rd.setSpin = (dir, speed) => { rd.ctrl.spinDir = dir; rd.ctrl.spinSpeed = speed; };
  rd.setBalance = (k) => { rd.ctrl.balance = Math.max(0, Math.min(1, k)); };
  rd.setLean = (rad) => { rd.ctrl.lean = rad; };
  /** Hanging from world grips: gripping hands pull the body up, free hands keep reaching (hands = {F, B} gripping flags). */
  rd.setPull = (on, hands) => { rd.ctrl.pull = !!on; rd.ctrl.gripHands = hands || { F: true, B: true }; };
  /** Lift both arms up-forward (grab held empty-handed) so the hands can catch walls and ledges. */
  rd.setReach = (on) => { rd.ctrl.reach = !!on; };
  /** Walking gait: dir = movement direction (+1/-1, 0 = idle stance); amp > 0 = stepping on. */
  rd.setStep = (dir, amp = 0) => {
    const was = rd.ctrl.stepAmp > 0 && rd.ctrl.step !== 0;
    rd.ctrl.step = dir || 0; rd.ctrl.stepAmp = amp;
    const now = amp > 0 && rd.ctrl.step !== 0;
    if (now !== was) resetGait();
  };
  /** Movement hop / push-off: the trailing leg starts its swing now (re-syncs the gait to the hop rhythm). */
  rd.pulseStep = (dir) => {
    dir = dir >= 0 ? 1 : -1;
    // never cut a swing short (an aborted swing leg never plants and the body loses its support): the other leg
    // takes off as soon as this one lands
    if (GT.swing) { GT.next = 0; return; }
    startSwing(nextLeg(dir), dir);
  };

  // ---- stepping gait state -------------------------------------------------------------
  const GT = rd.gait = { swing: null, last: null, u: 0, aFront: 0, next: 0, airT: 0, sw: null, swingPrev: null, anchor: { F: null, B: null }, prev: { F: null, B: null }, was: { F: false, B: false } };
  function resetGait() { GT.swing = null; GT.last = null; GT.u = 0; GT.next = gaitCycle() * 0.5; GT.anchor.F = GT.anchor.B = null; GT.prev.F = GT.prev.B = null; GT.was.F = GT.was.B = false; }
  function gaitCycle() { const MG = cfg.move.gait || {}; return MG.cycle || cfg.move.hopInterval || 0.5; }
  /** Stance anchor = where the foot is now; `floor` = how far below that the leg may feel for the ground. */
  function setAnchor(side) {
    const fp = rd.footPoint(side), MG = cfg.move.gait || {};
    GT.anchor[side] = { x: fp.x, y: fp.y, floor: fp.y - (MG.probeDepth ?? 0.25) * s };
    GT.prev[side] = null;
  }
  /** Leg to swing next: strictly alternate; the first step lifts the leg that trails in the movement direction. */
  function nextLeg(dir) {
    const okF = !rd.detached.thighF && !rd.joints.hipF.__dead, okB = !rd.detached.thighB && !rd.joints.hipB.__dead;
    if (!okF) return okB ? 'B' : null;
    if (!okB) return 'F';
    if (GT.last) return GT.last === 'F' ? 'B' : 'F';
    return rd.joints.hipF.getJointAngle() * dir <= rd.joints.hipB.getJointAngle() * dir ? 'F' : 'B';
  }
  /** Hip angle a straight leg can reach the floor at while the pelvis is held at the walking stand height. */
  function gaitReach() { return Math.acos(Math.min(1, B.gaitStandFactor ?? B.standFactor)) - 0.03; }
  function startSwing(side, dir) {
    const MG = cfg.move.gait || {};
    GT.next = gaitCycle() * 0.5;
    if (!side) return;
    const cycle = gaitCycle(), stanceT = cycle * (1 - (MG.swingDuty ?? 0.5));
    // land the foot ahead by half of what the planted leg will sweep at the current speed (symmetric stance), capped
    // by maxFront and the floor reach of the leg. Pelvis speed, not the centre of mass (which carries the whirling arms).
    const vx = P.spine1.getLinearVelocity().x, v = Math.max(0, vx * dir);
    const half = Math.min(0.95, v * stanceT * 0.5 / d.legLen);
    // land close under the body: over-striding stubs the foot in (leg rigid at full reach) and kills the speed
    GT.aFront = Math.max(MG.minSweep ?? 0.12, Math.min(MG.maxFront ?? 0.35, gaitReach(), Math.asin(half)));
    GT.swing = side; GT.last = side; GT.u = 0; GT.swingPrev = null;
    GT.anchor[side] = null; GT.prev[side] = null;
    // world-space swing path: from where the foot is now to a landing point fixed in the WORLD (where the hip will be
    // at touchdown plus the step-ahead reach). Aiming at a fixed point means the foot arrives with ~zero ground speed
    // and plants instead of skating on at body speed. Floor height = the other foot's plant, else this foot's own.
    const fp = rd.footPoint(side), hp = rd.joints['hip' + side].getAnchorA();
    const o = side === 'F' ? 'B' : 'F';
    const yl = (GT.anchor[o] && GT.was[o]) ? GT.anchor[o].y : fp.y;
    const swingT = cycle * (MG.swingDuty ?? 0.5);
    const xl = hp.x + vx * swingT * (MG.landLead ?? 1) + dir * Math.sin(GT.aFront) * d.legLen;
    GT.sw = { x0: fp.x, y0: fp.y, xl, yl, lift: (MG.clearance ?? 0.15) * s };
  }
  /**
   * Two-link leg IK: hip and knee joint angles that put the foot of `side` on world point (ax, ay) (knee bends backwards)
   * with the hip held at least `standH` above it: when the pelvis sags below that the leg is asked to be longer than the
   * gap, so the planted leg pushes the body back up (a supporting strut) instead of just folding along with it.
   */
  function ikLeg(side, ax, ay, standH = 0) {
    const hp = rd.joints['hip' + side].getAnchorA();
    const dx = ax - hp.x, h = Math.max(hp.y - ay, standH);
    const Lt = d.thigh, Ls = d.shin;
    // never fully straight (98% reach = ~0.4 rad of bend): a dead-straight loaded knee is a singular pose the motor
    // can't fold from, so the next swing would scrape the foot along the floor instead of lifting it
    const D = Math.max(Math.abs(Lt - Ls) + 0.01 * s, Math.min((Lt + Ls) * (cfg.move.gait?.reachFrac ?? 0.98), Math.hypot(dx, h)));
    const interior = Math.acos(Math.max(-1, Math.min(1, (Lt * Lt + Ls * Ls - D * D) / (2 * Lt * Ls))));
    const knee = -facing * Math.min(L.kneeBend, Math.PI - interior);
    const bend = Math.atan2(Ls * Math.sin(knee), Lt + Ls * Math.cos(knee));
    const alpha = Math.atan2(dx, h);            // world angle of the hip->foot line (0 = down, + = toward +x)
    let hip = alpha - bend - P.spine1.getAngle();
    hip -= Math.PI * 2 * Math.round(hip / (Math.PI * 2));
    return { hip, knee };
  }
  /** Rest pose of a hand's shoulder joint (rad, + = CCW) and extra hold torque (N*m). */
  rd.setArmRest = (hand, angle, torque = 0) => { rd.ctrl.armRest[hand] = angle; rd.ctrl.armTorque[hand] = torque; };
  /** Teleport an arm rigidly to a shoulder joint angle (used before equipping so weapons don't spawn in the floor). */
  rd.poseArm = (hand, jointAngle) => {
    const ua = P['upperArm' + hand], fa = P['foreArm' + hand];
    if (!ua || rd.detached['upperArm' + hand]) return;
    const sh = rd.joints['shoulder' + hand]; if (!sh || sh.__dead) return;
    const s = sh.getAnchorA();
    const ang = P.spine4.getAngle() + jointAngle;
    const dx = Math.sin(ang), dy = -Math.cos(ang); // direction the arm points (down when ang=0)
    ua.setPosition(V(s.x + dx * d.ua / 2, s.y + dy * d.ua / 2)); ua.setAngle(ang); ua.setLinearVelocity(V(0, 0)); ua.setAngularVelocity(0);
    if (!rd.detached['foreArm' + hand]) { fa.setPosition(V(s.x + dx * (d.ua + d.fa / 2), s.y + dy * (d.ua + d.fa / 2))); fa.setAngle(ang); fa.setLinearVelocity(V(0, 0)); fa.setAngularVelocity(0); }
  };
  rd.setTwoHand = (on) => { rd.ctrl.twoHand = !!on; };
  rd.kick = (dir = facing) => {
    if (rd.isLimp) return false;
    const K = cfg.kick;
    rd.ctrl.kickTimer = K.duration; rd.ctrl.kickDir = dir >= 0 ? 1 : -1;
    const sgn = rd.ctrl.kickDir;
    if (!rd.detached.thighF) P.thighF.applyAngularImpulse(sgn * K.angularImpulse * ts, true);
    if (!rd.detached.shinF) P.shinF.applyAngularImpulse(sgn * K.shinImpulse * ts, true);
    rd.addVelocity(sgn * K.bodyVx, 0);
    return true;
  };
  rd.jump = (vx, vy) => {
    if (rd.isLimp) return false;
    rd.addVelocity(vx, vy);
    return true;
  };

  function motorTo(j, target, gain, torque, maxSpeed = 30) {
    if (!j || j.__dead) return;
    const err = target - j.getJointAngle();
    let sp = err * gain;
    if (sp > maxSpeed) sp = maxSpeed; else if (sp < -maxSpeed) sp = -maxSpeed;
    j.enableMotor(true);
    j.setMaxMotorTorque(torque * ts);
    j.setMotorSpeed(sp);
  }
  // position motor with a feed-forward rate (rad/s the target itself is moving at): tracks moving targets without lag
  function motorRate(j, target, rate, gain, torque, maxSpeed = 30) {
    if (!j || j.__dead) return;
    let sp = rate + (target - j.getJointAngle()) * gain;
    if (sp > maxSpeed) sp = maxSpeed; else if (sp < -maxSpeed) sp = -maxSpeed;
    j.enableMotor(true);
    j.setMaxMotorTorque(torque * ts);
    j.setMotorSpeed(sp);
  }
  // same, but along the shortest way round (shoulders can be several turns wound up after spinning)
  function motorToWrap(j, target, gain, torque, maxSpeed = 30) {
    if (!j || j.__dead) return;
    let err = target - j.getJointAngle();
    err -= Math.PI * 2 * Math.round(err / (Math.PI * 2));
    const sp = Math.max(-maxSpeed, Math.min(maxSpeed, err * gain));
    j.enableMotor(true);
    j.setMaxMotorTorque(torque * ts);
    j.setMotorSpeed(sp);
  }

  // ---- per-step controller ---------------------------------------------------------
  rd.step = (dt) => {
    if (rd.isLimp) return;
    const c = rd.ctrl;
    const bal = c.balance;
    const g = rd.updateGrounded();

    // upright drive on spine segments (world frame) through the balance MotorJoints
    const spines = [P.spine1, P.spine2, P.spine3, P.spine4];
    const leanT = -c.lean;
    // rigid spine (1:1 with the original's locked torso hinges): the four segments are one stick, so only the pelvis
    // joint drives it with the summed torque; four correction passes on one body would over-correct and rock it
    const rigidSpine = L.spine === 0;
    const sumTq = rigidSpine ? B.uprightTorque.reduce((a, b) => a + b, 0) : 0;
    for (let i = 0; i < 4; i++) {
      const j = rd.balanceJoints[i]; if (j.__dead) continue;
      const target = rigidSpine ? leanT : leanT * (0.5 + i * 0.25);
      const ang = spines[i].getAngle();
      // pick the equivalent target nearest the current angle so full flips don't unwind
      j.setAngularOffset(target + Math.PI * 2 * Math.round((ang - target) / (Math.PI * 2)));
      j.setMaxTorque((rigidSpine ? (i === 0 ? sumTq : 0) : B.uprightTorque[i]) * bal * ts);
    }
    // keep spine chain straight, head up
    motorTo(rd.joints.spineJ1, 0, B.spineJointGain, B.spineJointTorque * bal + 2);
    motorTo(rd.joints.spineJ2, 0, B.spineJointGain, B.spineJointTorque * bal + 2);
    motorTo(rd.joints.spineJ3, 0, B.spineJointGain, B.spineJointTorque * bal + 2);
    motorTo(rd.joints.neck, 0, B.neckGain, B.neckTorque * (0.3 + 0.7 * bal));

    // legs: relaxed idle stance, the stepping gait while moving, or a kick on the front leg
    const K = cfg.kick, legSp = B.legMaxSpeed ?? 30, legTq = 0.15 + 0.85 * bal;
    const MG = cfg.move.gait || {};
    GT.airT = g ? 0 : GT.airT + dt;
    const kicking = c.kickTimer > 0;
    if (kicking) {
      c.kickTimer -= dt;
      motorTo(rd.joints.hipF, c.kickDir * K.hipAngle, K.gain, K.torque, 40);
      motorTo(rd.joints.kneeF, 0, K.gain, K.torque, 40);
      if (GT.swing === 'F') GT.swing = null;
      GT.anchor.F = null; GT.prev.F = null;
    }
    const walking = c.stepAmp > 0 && c.step !== 0 && GT.airT <= (MG.airPose ?? 0.3);
    if (walking) {
      const dir = c.step > 0 ? 1 : -1;
      const cycle = gaitCycle(), swingT = Math.max(0.05, cycle * (MG.swingDuty ?? 0.5));
      const gain = B.gaitGain ?? 9, sp = B.gaitMaxSpeed ?? 14;
      // gait torques scale with s^3 (motorTo applies s^4): foot friction only grows with the mass (s^2), so a giant's
      // s^4 legs would overpower its own feet and skate; s^3 keeps leg force / friction in proportion
      const hipTq = (B.gaitHipTorque ?? B.hipTorque) * legTq / s, kneeTq = (B.gaitKneeTorque ?? B.kneeTorque) * legTq / s;
      // free-running rhythm (movement hops re-sync it through pulseStep); a leg only takes off once the other has landed
      GT.next -= dt;
      if (GT.next <= 0 && !GT.swing) startSwing(nextLeg(dir), dir);
      for (const side of ['F', 'B']) {
        if (rd.detached['thigh' + side] || (side === 'F' && kicking)) continue;
        const hj = rd.joints['hip' + side], kj = rd.joints['knee' + side];
        const touching = !rd.detached['shin' + side] && touchingGround(P['shin' + side]);
        if (GT.swing === side) {
          // swing: the foot follows a world-space arc from lift-off to a landing point fixed in the world (set in
          // startSwing): the lift comes first, the forward travel is a smoothstep (starts and ends at rest in the
          // world, so the foot neither scuffs off nor skates on); hip + knee track it through the two-link IK.
          GT.u += dt / swingT;
          const u = Math.min(1, GT.u), W = GT.sw;
          const ex = u * u * (3 - 2 * u);
          const tx = W.x0 + (W.xl - W.x0) * ex;
          const ty = W.y0 + (W.yl - W.y0) * ex + W.lift * Math.sin(Math.PI * u);
          const ik = ikLeg(side, tx, ty, 0), pv = GT.swingPrev;
          motorRate(hj, ik.hip, pv ? Math.max(-sp, Math.min(sp, (ik.hip - pv.h) / dt)) : 0, gain, hipTq, sp);
          motorRate(kj, ik.knee, pv ? Math.max(-sp, Math.min(sp, (ik.knee - pv.k) / dt)) : 0, gain, kneeTq, sp);
          GT.swingPrev = { h: ik.hip, k: ik.knee };
          if (GT.u >= 1 || (u >= (MG.landFrac ?? 0.8) && touching)) {
            // planted (or, still in the air, held at this world point so the leg sweeps back with the body until it lands)
            GT.swing = null; setAnchor(side); GT.was[side] = touching;
          }
          continue;
        }
        // stance: keep the foot where it touched down (two-link IK on hip + knee, with feed-forward rates), so the leg
        // follows the body's motion instead of the motors dragging the foot or the leg acting as a rigid strut.
        // The anchor is taken at touchdown only: refreshing it while the foot skids would let the motors go along with the slip.
        if (touching && (!GT.anchor[side] || !GT.was[side])) setAnchor(side);
        GT.was[side] = touching;
        const a = GT.anchor[side];
        const maxSweep = MG.maxSweep ?? 0.85;
        if (a) {
          // not on the floor (swing ended just above it, hop lifted it): feel downwards for the floor instead of hovering
          if (!touching) a.y = Math.max(a.floor, a.y - (MG.probeDown ?? 2.5) * s * dt);
          // a hold point ahead of the body but out of the leg's reach (landed from a flight, body still descending) is
          // pulled back to the reach limit: the leg keeps retracting toward a fixed world point instead of going
          // rigid-straight and stubbing the foot in with the body's speed
          {
            const hp = hj.getAnchorA(), hh = hp.y - a.y, R = Math.sqrt(Math.max(0, d.legLen * d.legLen * 0.94 - hh * hh));
            if ((a.x - hp.x) * dir > R) a.x = hp.x + dir * R;
          }
          const ik = ikLeg(side, a.x, a.y, d.legLen * (B.gaitStandFactor ?? B.standFactor)), pv = GT.prev[side];
          if (ik.hip * dir < -maxSweep) { GT.anchor[side] = null; GT.prev[side] = null; }   // trailed as far as it goes: let the foot go
          else {
            // slower motor caps than the swing. The knee is a prop, not a spring: full torque while static or being
            // compressed (holds a landing of several times the body weight), but while extending it may only push
            // with ~gaitPushFactor x body weight (through its actual moment arm), so the body rises back to height
            // quickly yet the work absorbed on landing is never given straight back as a catapult hop.
            // (caps in rad/s divided by the scale: a giant's longer leg turns the same rad/s into more m/s of rise)
            const ssp = (B.gaitStanceSpeed ?? 8) / s, ksp = (B.gaitStanceKneeSpeed ?? 5) / s;
            // straightening = |knee| decreasing (the leg pushing the body up); bending under load keeps full torque
            const ka = kj.getJointAngle(), straightening = kj.getJointSpeed() * (Math.sign(ka) || -facing) < -0.05;
            let kTq = kneeTq;
            if (straightening) {
              const Dk = Math.max(0.05 * s, Math.sqrt(Math.max(0, d.thigh * d.thigh + d.shin * d.shin + 2 * d.thigh * d.shin * Math.cos(ka))));
              const arm = d.thigh * d.shin * Math.abs(Math.sin(ka)) / Dk;   // ground-force lever about the knee
              const push = rd.totalMass() * Math.abs(cfg.gravity) * arm * (B.gaitPushFactor ?? 1.3) / ts;
              kTq = Math.min(kneeTq, Math.max(B.gaitKneePushMin ?? 40, push));
            }
            motorRate(hj, ik.hip, pv ? Math.max(-ssp, Math.min(ssp, (ik.hip - pv.h) / dt)) : 0, gain, hipTq, ssp);
            motorRate(kj, ik.knee, pv ? Math.max(-ksp, Math.min(ksp, (ik.knee - pv.k) / dt)) : 0, gain, kTq, ksp);
            GT.prev[side] = { h: ik.hip, k: ik.knee };
            continue;
          }
        }
        // nothing to hold (trailed out of reach, or landed in mid-air): trail behind with the foot tucked up a little
        motorTo(hj, -dir * maxSweep - P.spine1.getAngle(), gain, hipTq, sp);
        motorTo(kj, -facing * (MG.trailKnee ?? 0.5), gain, kneeTq, sp);
      }
    } else {
      if (GT.swing || GT.anchor.F || GT.anchor.B) resetGait();
      if (!kicking) {
        motorTo(rd.joints.hipF, facing * B.stanceAngle, B.hipGain, B.hipTorque * legTq, legSp);
        motorTo(rd.joints.kneeF, 0, B.kneeGain, B.kneeTorque * legTq, legSp);
      }
      motorTo(rd.joints.hipB, -facing * B.stanceAngle, B.hipGain, B.hipTorque * legTq, legSp);
      motorTo(rd.joints.kneeB, 0, B.kneeGain, B.kneeTorque * legTq, legSp);
    }

    // arms
    const shF = rd.joints.shoulderF, shB = rd.joints.shoulderB, elF = rd.joints.elbowF, elB = rd.joints.elbowB;
    const G = cfg.grab;
    const reachArm = (sh, el) => {
      motorToWrap(sh, facing * (G.reachAngle ?? 2.5), G.reachGain ?? 7, G.reachTorque ?? 70, 12);
      motorTo(el, 0, S.elbowIdleGain, S.elbowIdleTorque * 3);
    };
    if (!c.pull) { c.holdAng.F = null; c.holdAng.B = null; }
    if (c.pull) {
      // gripping the world: the hand is a pivot. A/D turn the arm around it (levering the whole body over),
      // no input locks the arm where it is; the free hand keeps reaching for a hold
      const spinning = c.spinDir !== 0 && c.spinSpeed > 0.01;
      for (const [h, sh, el] of [['F', shF, elF], ['B', shB, elB]]) {
        if (!c.gripHands[h]) {
          c.holdAng[h] = null;
          if (spinning && sh && !sh.__dead) {
            // the free hand keeps windmilling with A/D (and can catch a new hold as it swings past)
            sh.enableMotor(true); sh.setMaxMotorTorque(S.shoulderTorque * ts);
            sh.setMotorSpeed(-c.spinDir * c.spinSpeed * (h === 'B' ? R.backArmSpeedFactor : 1));
            if (el && !el.__dead) { el.enableMotor(true); el.setMaxMotorTorque(S.elbowSpinTorque * ts); el.setMotorSpeed(0); }
          } else {
            reachArm(sh, el);
          }
          continue;
        }
        if (!sh || sh.__dead) continue;
        if (spinning) {
          c.holdAng[h] = null;
          sh.enableMotor(true); sh.setMaxMotorTorque((G.gripSpinTorque ?? 1100) * ts);
          sh.setMotorSpeed(-c.spinDir * Math.min(c.spinSpeed, G.gripSpinSpeed ?? 6));
        } else {
          if (c.holdAng[h] === null) c.holdAng[h] = sh.getJointAngle();
          motorTo(sh, c.holdAng[h], G.gripHoldGain ?? 10, G.gripHoldTorque ?? 700, 8);
        }
        motorTo(el, 0, 12, G.gripElbowTorque ?? 250, 12);
      }
    } else if (c.reach && !(c.spinDir !== 0 && c.spinSpeed > 0.01)) {
      reachArm(shF, elF);
      reachArm(shB, elB);
    } else if (c.spinDir !== 0 && c.spinSpeed > 0.01) {
      const sp = -c.spinDir * c.spinSpeed; // clockwise for +1
      const backF = c.twoHand ? 1 : R.backArmSpeedFactor;
      for (const [j, k] of [[shF, 1], [shB, backF]]) {
        if (!j || j.__dead) continue;
        j.enableMotor(true); j.setMaxMotorTorque(S.shoulderTorque * (c.spinTorqueMult || 1) * ts); j.setMotorSpeed(sp * k);
      }
      for (const j of [elF, elB]) {
        if (!j || j.__dead) continue;
        j.enableMotor(true); j.setMaxMotorTorque(S.elbowSpinTorque * ts); j.setMotorSpeed(0);
      }
    } else {
      // arms hang at rest (weapon arm is held forward-up)
      // shortest way to the rest angle: after spinning the shoulder joint angle has wound up several turns,
      // and a plain motorTo would unwind every one of them (arms spinning backwards, boss throw poses never reached)
      motorToWrap(shF, c.armRest.F, S.idleShoulderGain, S.idleShoulderTorque + c.armTorque.F, 10);
      motorToWrap(shB, c.armRest.B, S.idleShoulderGain, S.idleShoulderTorque + c.armTorque.B, 10);
      motorTo(elF, 0, S.elbowIdleGain, S.elbowIdleTorque, 10);
      motorTo(elB, 0, S.elbowIdleGain, S.elbowIdleTorque, 10);
    }

    // upward assist at the pelvis when feet touch something
    if (g && bal > 0) {
      const footY = rd.lowestFootY();
      const pel = P.spine1.getPosition(), pv = P.spine1.getLinearVelocity();
      const targetY = footY + d.legLen * (walking ? (B.gaitStandFactor ?? B.standFactor) : B.standFactor) + d.seg * 0.5;
      const err = targetY - pel.y;
      let F = (B.assistK * err - B.assistD * pv.y) * fs;
      if (F < 0) F = 0; else if (F > B.assistMax * fs) F = B.assistMax * fs;
      F *= bal;
      P.spine1.applyForceToCenter(V(0, F * 0.65), true);
      P.spine3.applyForceToCenter(V(0, F * 0.35), true);
    }
  };

  // ---- dismember / limp / destroy ----------------------------------------------------
  rd.detach = (name) => {
    const jn = PARENT_JOINT[name];
    if (!jn || rd.detached[name]) return false;
    const j = rd.joints[jn];
    if (!j || j.__dead) return false;
    if (physics) physics.destroyJoint(j); else world.destroyJoint(j);
    const mark = (n) => {
      rd.detached[n] = true;
      const b = P[n]; const ud = b.getUserData(); ud.detached = true;
      b.setAngularDamping(0.5);
      // keep the group (no self collision -> no pop-out) but mark the category as debris
      for (let f = b.getFixtureList(); f; f = f.getNext()) f.setFilterData({ groupIndex: group, categoryBits: CAT.DEBRIS, maskBits: ALL });
      if (CHILDREN[n]) for (const c of CHILDREN[n]) if (!rd.detached[c]) mark(c);
    };
    mark(name);
    // stop motoring the joints that hang off the detached part
    for (const jj of Object.values(rd.joints)) {
      if (jj.__dead) continue;
      const a = jj.getBodyA().getUserData().name, b = jj.getBodyB().getUserData().name;
      if (rd.detached[a] || rd.detached[b]) jj.enableMotor(false);
    }
    return true;
  };

  rd.limp = () => {
    rd.isLimp = true; rd.dead = true;
    for (const j of Object.values(rd.joints)) { if (!j.__dead) { j.enableMotor(false); } }
    for (const j of rd.balanceJoints) { if (!j.__dead) j.setMaxTorque(0); }
    for (const b of rd.partList) b.setAngularDamping(0.3);
  };

  rd.destroy = () => {
    for (const b of rd.partList) { if (physics) physics.destroyBody(b); else world.destroyBody(b); }
    rd.partList.length = 0;
  };

  return rd;
}
