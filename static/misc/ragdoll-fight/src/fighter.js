// Fighter = ragdoll + controller + weapon + health. Also: combat wiring (createCombat) and dummyAI.
import { CONFIG } from './config.js';
import { V } from './physics.js';
import { createRagdoll } from './ragdoll.js';
import { weaponById, skinById } from './catalog.js';
import { buildWeapon, attachWeapon, dropWeapon, destroyWeapon, regripWeapon, throwWeapon } from './weapons.js';

let nextId = 1;
const DETACHABLE = new Set(['head', 'upperArmF', 'foreArmF', 'upperArmB', 'foreArmB', 'thighF', 'shinF', 'thighB', 'shinB']);
const ARM_OF_HAND = { F: ['upperArmF', 'foreArmF'], B: ['upperArmB', 'foreArmB'] };

/**
 * Fist touch tracker (once per physics world): a windmilling fist brushes a wall for less than a frame, so polling
 * `isTouching()` misses most holds. begin-contact fires inside the sub-steps; the latest fist touch of each forearm
 * is kept on its userData ({fixture, x, y, t}) for _tryGrabWorld to use the same step.
 */
function installGrabTouch(physics) {
  if (physics.__grabTouch) return;
  physics.__grabTouch = true;
  physics.world.on('begin-contact', (c) => {
    const fa = c.getFixtureA(), fb = c.getFixtureB();
    const ua = fa.getUserData(), ub = fb.getUserData();
    for (const [other, ud, oud] of [[fb, ua, ub], [fa, ub, ua]]) {
      if (!ud || !oud || ud.kind !== 'part' || ud.detached || !ud.ragdoll || (ud.name !== 'foreArmF' && ud.name !== 'foreArmB')) continue;
      const ok = oud.kind === 'static' || (oud.kind === 'hazard' && oud.grabbable) || (oud.kind === 'part' && oud.fighter && oud.fighter !== ud.fighter && !oud.detached);
      if (!ok) continue;
      const wm = c.getWorldManifold(null);
      const p = wm && wm.points && wm.points.length ? wm.points[0] : null;
      if (!p) continue;
      const rd = ud.ragdoll, hp = rd.handPoint(ud.name === 'foreArmF' ? 'F' : 'B');
      if (Math.hypot(p.x - hp.x, p.y - hp.y) > (rd.dims.fist || 0.1 * rd.scale) * 1.8) continue;   // the fist, not the elbow end
      ud.touch = { fixture: other, x: p.x, y: p.y, t: physics.time };
    }
  });
}

export function partMult(cfg, part) {
  const m = cfg.combat.partMult;
  return m[part] ?? m.limb;
}

export class Fighter {
  /**
   * new Fighter(physics, {x, y, facing, side, hp, weaponId, helmet, skin, look, scale, hooks, deathY, name, armour})
   * x,y is the foot position.
   */
  constructor(physics, o = {}) {
    this.physics = physics;
    this.cfg = o.cfg || physics.cfg || CONFIG;
    this.id = nextId++;
    this.side = o.side || 'player';
    this.name = o.name || this.side;
    this.hooks = o.hooks || {};
    this.scale = o.scale || 1;
    this.spinMult = o.spinMult || 1;   // giants swing slower (keeps weapon tip speeds sane at scale)
    this.facing = o.facing || 1;
    this.maxHp = o.hp || 100;
    this.hp = this.maxHp;
    this.dead = false;
    this.deathCause = null;
    this.deathY = o.deathY ?? this.cfg.deathY;
    this.skin = skinById(o.skin || (o.look && o.look.skin) || 'classic');
    this.color = o.color || (o.look && o.look.body) || this.skin.body;
    this.hat = o.helmet !== undefined ? o.helmet : (o.look && o.look.hat) || this.skin.hat;
    this.armour = o.armour || {};   // part -> multiplier scale (e.g. {head:0.5})
    this.group = physics.newGroup();
    installGrabTouch(physics);
    this.ragdoll = createRagdoll(physics, { x: o.x || 0, y: o.y || 0, facing: this.facing, scale: this.scale, group: this.group, cfg: this.cfg });
    for (const b of this.ragdoll.partList) b.getUserData().fighter = this;

    this.partDamage = {};
    this.flash = 0;
    this.stagger = 0;
    this.balance = 1;
    this.spinDir = 0;
    this.spinSpeed = 0;
    this._swingAcc = 0;
    this.jumpCd = 0;
    this.kickCd = 0;
    this.kickTimer = 0;
    this.hopTimer = 0;
    this.grabTimer = 0;
    this.grabHeld = false;
    this.grips = { F: null, B: null };
    this.gripKind = { F: null, B: null };   // 'world' (ledge) | 'fighter' (holding someone)
    this.grabActive = false;                // grab held and ready (drawn as yellow rings on the fists)
    this.weapon = null;    // primary weapon (normally the front hand)
    this.weapon2 = null;   // dual wield: second weapon in the other hand
    this.weaponId = 'fists';
    this.airTime = 0;
    this.lastHit = null;
    this.hitCount = 0;
    physics.fighters.add(this);
    if (o.weaponId && o.weaponId !== 'fists') this.equip(o.weaponId);
  }

  // ---- getters ---------------------------------------------------------------------
  get x() { return this.ragdoll.pelvis.getPosition().x; }
  get y() { return this.ragdoll.pelvis.getPosition().y; }
  get pos() { const p = this.ragdoll.pelvis.getPosition(); return { x: p.x, y: p.y }; }
  get damageRatio() { return Math.max(0, Math.min(1, 1 - this.hp / this.maxHp)); }
  get grounded() { return this.ragdoll.grounded; }
  get isSpinning() { return this.spinSpeed >= this.cfg.combat.fistSpinSpeed && !this.dead; }
  get isKicking() { return this.kickTimer > 0 && !this.dead; }
  get gripping() { return !!(this.grips.F || this.grips.B); }
  get hangingWorld() { return !!((this.grips.F && this.gripKind.F === 'world') || (this.grips.B && this.gripKind.B === 'world')); }
  /** Hanging from a world grip that is above the hips (a wall / ledge, not the floor). */
  get hangingHigh() {
    const py = this.ragdoll.pelvis.getPosition().y;
    for (const h of ['F', 'B']) {
      const j = this.grips[h];
      if (j && !j.__dead && this.gripKind[h] === 'world' && j.getAnchorA().y > py) return true;
    }
    return false;
  }
  get alive() { return !this.dead; }

  face(dir) {
    if (dir && Math.sign(dir) !== this.facing) {
      this.facing = Math.sign(dir);
      this.ragdoll.setFacing(this.facing);
      for (const w of [this.weapon, this.weapon2]) if (w) regripWeapon(w);
    }
  }
  _armRest() {
    const S = this.cfg.spin;
    for (const hand of ['F', 'B']) {
      if (this.weaponIn(hand) && !this.dead) this.ragdoll.setArmRest(hand, this.facing * S.weaponArmRest, S.weaponArmTorque);
      else this.ragdoll.setArmRest(hand, 0, 0);
    }
  }
  /** Weapon held in hand 'F' | 'B' (or null). */
  weaponIn(hand) {
    if (this.weapon && this.weapon.hand === hand) return this.weapon;
    if (this.weapon2 && this.weapon2.hand === hand) return this.weapon2;
    return null;
  }
  /** Forget weapons that left the hand (dropped / thrown / destroyed); the second weapon becomes primary if needed. */
  _syncWeapons() {
    const held = (w) => w && !w.destroyed && w.holder === this;
    if (!held(this.weapon)) this.weapon = null;
    if (!held(this.weapon2)) this.weapon2 = null;
    if (!this.weapon && this.weapon2) { this.weapon = this.weapon2; this.weapon2 = null; }
    this.weaponId = this.weapon ? this.weapon.id : 'fists';
  }

  // ---- weapons -----------------------------------------------------------------------
  /** Switching loadout: take the held weapon out of the world entirely (dropWeapon would leave a loose copy behind). */
  removeWeapon() {
    if (!this.weapon && !this.weapon2) return;
    for (const w of [this.weapon, this.weapon2]) if (w) destroyWeapon(w);
    this.weapon = null; this.weapon2 = null; this.weaponId = 'fists';
    this._armRest();
  }
  equip(weaponId) {
    this.removeWeapon();
    const def = weaponById(weaponId);
    this.weaponId = def.id;
    if (def.kind === 'fist') return null;
    // pose the arm forward-up first so a long weapon doesn't spawn inside the floor
    this.ragdoll.poseArm('F', this.facing * this.cfg.spin.weaponArmRest);
    const hp = this.ragdoll.handPoint('F');
    const w = buildWeapon(this.physics, def.id, { x: hp.x, y: hp.y + 0.5 }, 0);
    if (w && attachWeapon(w, this, 'F')) { this.weapon = w; this._armRest(); return w; }
    if (w) destroyWeapon(w);
    return null;
  }
  /** Put a loose weapon into a free hand (prefers `hand`). A second weapon = dual wield. */
  pickUp(weapon, hand = 'F') {
    if (weapon.holder) return false;
    const rd = this.ragdoll;
    const free = ['F', 'B'].filter((h) => !this.weaponIn(h) && !rd.detached['foreArm' + h]);
    if (!free.length) return false;
    const h = free.includes(hand) ? hand : free[0];
    // a two-handed pole in the other hand lets go with its support hand so both hands can hold something
    const other = this.weaponIn(h === 'F' ? 'B' : 'F');
    if (other && other.handJoint) { this.physics.destroyJoint(other.handJoint); other.handJoint = null; rd.setTwoHand(false); }
    if (!attachWeapon(weapon, this, h)) return false;
    if (!this.weapon) this.weapon = weapon; else this.weapon2 = weapon;
    this.weaponId = this.weapon.id;
    this._armRest();
    return true;
  }
  /** Drop everything held (both hands when dual wielding). */
  dropWeapon() {
    if (!this.weapon && !this.weapon2) return;
    for (const w of [this.weapon2, this.weapon]) if (w && w.holder === this) dropWeapon(w);
    this.weapon = null; this.weapon2 = null; this.weaponId = 'fists';
    this._armRest();
  }

  // ---- grips -----------------------------------------------------------------------------
  releaseGrips() {
    for (const h of ['F', 'B']) {
      const j = this.grips[h];
      if (j) { this.physics.removeBreakable(j); this.physics.destroyJoint(j); this.grips[h] = null; }
      this.gripKind[h] = null;
    }
    this.ragdoll.setPull(false);
  }
  /** Grab press: pick up the nearest loose item within reach of the body. */
  _pickUpNearest() {
    const rd = this.ragdoll;
    const hand = !rd.detached.foreArmF ? 'F' : (!rd.detached.foreArmB ? 'B' : null);
    if (!hand) return false;
    const c = rd.parts.spine2.getWorldCenter();
    const reach = this.cfg.grab.pickupRadius * this.scale;
    let best = null, bestD = Infinity;
    for (const w of this.physics.weapons) {
      if (w.holder || w.destroyed || !w.body || w.body.__removed || w.prop || w.returnTo) continue;
      const p = w.body.getWorldCenter();
      const d = Math.hypot(p.x - c.x, (p.y - c.y) * 0.8);
      if (d < reach && d < bestD) { bestD = d; best = w; }
    }
    if (!best) return false;
    if (!this.pickUp(best, hand)) return false;
    if (this.hooks.onGrab) this.hooks.onGrab(this, best);
    return true;
  }

  /** Hanging with the hips up near the highest wall grip? Vault forward over the ledge. Returns true if it vaulted. */
  _tryMantle() {
    const rd = this.ragdoll, G = this.cfg.grab;
    let gy = -Infinity;
    for (const h of ['F', 'B']) if (this.grips[h] && this.gripKind[h] === 'world') gy = Math.max(gy, this.grips[h].getAnchorA().y);
    if (gy === -Infinity || rd.pelvis.getPosition().y < gy - G.mantleReach * this.scale) return false;
    const v = rd.velocity();
    this.releaseGrips();
    this._regrabT = 0.45;   // don't grab the ledge again straight away
    rd.addVelocity(this.facing * G.mantleVx - v.x, Math.max(0, G.mantleVy - Math.max(0, v.y)));
    if (this.hooks.onJump) this.hooks.onJump(this);
    return true;
  }

  /** Let one hand go (world or fighter grip); it may not grip again for `delay` s (hand-over-hand climbing). */
  releaseGrip(hand, delay = 0) {
    const j = this.grips[hand];
    if (j) { this.physics.removeBreakable(j); this.physics.destroyJoint(j); this.grips[hand] = null; }
    this.gripKind[hand] = null;
    if (delay > 0) (this._handRegrab || (this._handRegrab = { F: 0, B: 0 }))[hand] = delay;
  }
  /** How far along the climb a world hold is: up, and ahead in the movement direction (the crank carries the body over the hand). */
  _holdScore(x, y, dir) { return y + 0.5 * x * dir; }

  /** Grab held while empty-handed: free hands latch onto another fighter's body (preferred) or static geometry (hang / climb). */
  _tryGrabWorld(spinIn = 0, dt = 1 / 60) {
    const G = this.cfg.grab, rd = this.ragdoll, ph = this.physics;
    const hr = this._handRegrab || (this._handRegrab = { F: 0, B: 0 });
    for (const hand of ['F', 'B']) {
      if (this.grips[hand] || rd.detached['foreArm' + hand] || hr[hand] > 0) continue;
      if (this.weaponIn(hand)) continue;
      let hp = rd.handPoint(hand);
      // Only grab what the FIST is actually touching right now (real physics contacts at the hand end of the forearm),
      // never something merely nearby.
      const arm = rd.parts['foreArm' + hand];
      const touchR = (rd.dims.fist || 0.1 * this.scale) * 1.8;
      let staticFx = null, partFx = null, at = null;
      for (let ce = arm.getContactList(); ce; ce = ce.next) {
        const c = ce.contact;
        if (!c.isTouching()) continue;
        const other = c.getFixtureA().getBody() === arm ? c.getFixtureB() : c.getFixtureA();
        const ud = other.getUserData();
        if (!ud) continue;
        const wm = c.getWorldManifold(null);
        const p = wm && wm.points && wm.points.length ? wm.points[0] : null;
        if (!p || Math.hypot(p.x - hp.x, p.y - hp.y) > touchR) continue;   // touching with the fist, not the elbow end
        if (ud.kind === 'part' && ud.fighter && ud.fighter !== this && !ud.detached) { if (!partFx) partFx = other; }
        else if ((ud.kind === 'static' || (ud.kind === 'hazard' && ud.grabbable)) && !staticFx) staticFx = other;
      }
      // a fist that only brushed something inside this step (sub-frame contact, see installGrabTouch) still caught it:
      // the hand is pinned just off the surface at the point it touched
      const tch = arm.getUserData().touch;
      if (!partFx && !staticFx && tch && ph.time - tch.t <= dt + 1e-6 && !tch.fixture.getBody().__dead && !tch.fixture.__dead) {
        const oud = tch.fixture.getUserData();
        if (oud && oud.kind === 'part') { if (oud.fighter && oud.fighter !== this && !oud.detached) partFx = tch.fixture; }
        else staticFx = tch.fixture;
        if (partFx || staticFx) {
          const dx = hp.x - tch.x, dy = hp.y - tch.y, dd = Math.hypot(dx, dy) || 1, off = (rd.dims.fist || 0.1 * this.scale) * 0.9;
          if (dd > off) at = { x: tch.x + dx / dd * off, y: tch.y + dy / dd * off };
        }
      }
      arm.getUserData().touch = null;
      const target = partFx || staticFx;
      if (!target) continue;
      const kind = partFx ? 'fighter' : 'world';
      const pin = at || hp;
      // the ground under the feet is never a hold (nothing to climb or hang from; the crank would only cartwheel the
      // body over its own fist): a fist that brushes the floor while grab is held keeps sweeping. Measured in the
      // body's own frame (below the hips on the feet side), so an inverted climber cranking over a ledge still re-grips.
      // Hazards (blocks, wheels, treads, wrecking balls) stay grabbable at any height.
      if (kind === 'world' && (target.getUserData() || {}).kind === 'static') {
        const pv = rd.pelvis.getPosition(), pa = rd.pelvis.getAngle();
        if ((pin.x - pv.x) * -Math.sin(pa) + (pin.y - pv.y) * Math.cos(pa) < -(G.floorHold ?? 0.45) * this.scale) continue;
      }
      // hand-over-hand while cranking: the other hand already holds the world -> this hold is only worth taking if it
      // is further along the climb (higher / ahead); then the old hand lets go so the lever never locks into a loop
      // (two hands pinned to one wall can't be cranked). Without A/D both hands may hold on (a steady two-hand hang).
      if (kind === 'world' && spinIn) {
        const o = hand === 'F' ? 'B' : 'F';
        const oj = this.grips[o];
        if (oj && this.gripKind[o] === 'world') {
          const a = oj.getAnchorA();
          if (this._holdScore(pin.x, pin.y, spinIn) < this._holdScore(a.x, a.y, spinIn) + (G.handLead ?? 0.12) * this.scale) continue;
          this.releaseGrip(o, G.handRegrab ?? 0.18);
        }
      }
      const pl = window.planck;
      const tb = target.getBody();
      // fist centre (local anchor on the forearm) pinned to the hold point on the target (the solver snaps a brushed
      // fist back onto the surface it touched)
      const j = ph.world.createJoint(new pl.RevoluteJoint({ collideConnected: false, localAnchorA: tb.getLocalPoint(V(pin.x, pin.y)), localAnchorB: arm.getLocalPoint(V(hp.x, hp.y)) }, tb, arm));
      this.grips[hand] = j;
      this.gripKind[hand] = kind;
      const maxForce = (kind === 'fighter' ? G.fighterBreakForce : G.worldBreakForce) * this.scale * this.scale;
      ph.addBreakable({ joint: j, maxForce, onBreak: () => { if (this.grips[hand] === j) { this.grips[hand] = null; this.gripKind[hand] = null; } } });
      if (this.hooks.onGrab) this.hooks.onGrab(this, kind === 'fighter' ? partFx.getUserData().fighter : 'world');
    }
    this.ragdoll.setPull(this.hangingWorld, { F: !!this.grips.F, B: !!this.grips.B });
  }

  // ---- main update (call once per fixed step, before physics.step) ---------------------------
  update(intent, dt) {
    intent = intent || {};
    const cfg = this.cfg, rd = this.ragdoll;
    if (this.flash > 0) this.flash -= dt;
    if (this.dead) {
      if (this.y < this.deathY - 30) { /* fell out of the world: nothing more to do */ }
      return;
    }
    if (this.y < this.deathY) { this.die('fall'); return; }
    if (rd.detached.head) { this.die('decapitated'); return; }

    this.jumpCd -= dt; this.kickCd -= dt; this.grabTimer -= dt;
    if (this.kickTimer > 0) this.kickTimer -= dt;

    // ---- spin ramp
    const S = cfg.spin;
    const spinIn = intent.spin | 0;
    // on fire (game.js igniteFists): the hands whirl much faster on a stronger shoulder motor; the grip crank keeps its caps
    const boost = this.spinBoost || 1;
    const sMin = S.armSpeedMin * this.spinMult, sMax = S.armSpeedMax * this.spinMult * boost;
    rd.ctrl.spinTorqueMult = boost > 1 ? (S.fireTorqueMult ?? 2.5) : 1;
    if (spinIn) {
      if (this.spinDir !== spinIn) this.spinSpeed = Math.min(this.spinSpeed, sMin);
      this.spinDir = spinIn;
      this.spinSpeed = Math.min(sMax, Math.max(this.spinSpeed, sMin) + S.armAccel * this.spinMult * boost * dt);
      this.face(spinIn);
    } else {
      this.spinSpeed = Math.max(0, this.spinSpeed - S.armDecay * dt);
      if (this.spinSpeed <= 0) this.spinDir = 0;
    }
    rd.setSpin(this.spinDir, this.spinSpeed);
    if (this.spinSpeed > 0) {
      this._swingAcc += this.spinSpeed * dt;
      if (this._swingAcc >= S.swingHookEvery) { this._swingAcc -= S.swingHookEvery; if (this.hooks.onSwing && this.isSpinning) this.hooks.onSwing(this, this.spinSpeed); }
    }

    // ---- grounded / air
    const g = rd.grounded;
    this.airTime = g ? 0 : this.airTime + dt;

    // ---- movement while spinning
    const M = cfg.move;
    if (spinIn && !this.hangingWorld) {
      // speed gate on the pelvis: the centre of mass carries the whirling arms (+-2 m/s at scale 1, more for giants),
      // which would let the push keep firing well past maxSpeed
      const v = rd.pelvis.getLinearVelocity();
      // drive the body (not the planted feet) so the stance leg vaults it over a foot that stays put; ramps off near maxSpeed
      const room = M.maxSpeed - v.x * spinIn;
      // the drive grows with the arm spin ramp, but a fresh spin already moves (spinFloor share) so it never feels stuck
      const floor = M.spinFloor ?? 0.5;
      const spinFrac = floor + (1 - floor) * Math.min(1, this.spinSpeed / Math.max(0.01, sMax));
      // stalled on the ground while pushing (a slope, a step, a body in the way): a little lift so the push can climb it
      const stalled = g && Math.abs(v.x) < (M.stallSpeed ?? 0.6);
      if (room > 0) rd.propel(spinIn * (g ? M.accel : M.airAccel) * spinFrac * Math.min(1, room / (M.accelRamp ?? 0.5)), stalled ? (M.stallLift ?? 0) : 0);
      // stepping gait on (ragdoll.js): the legs alternate, feet lift instead of dragging. Not while climbing
      // (grab held and airborne for longer than a walking hop): stepping legs in the air fight the hands' hops up a
      // wall. A hop's short flight keeps the gait going, so walking with Space held is not slower than without.
      const stepping = g || !this.grabHeld || this.airTime < 0.25;
      rd.setStep(stepping ? spinIn : 0, stepping ? 1 : 0);
      this.hopTimer -= dt;
      if (g && this.hopTimer <= 0 && this.balance > 0.3) {
        rd.hop(spinIn * Math.max(0, Math.min(M.hopVx * spinFrac, room)), M.hopVy);   // forward kick only up to maxSpeed (planted feet no longer brake)
        this.hopTimer = M.hopInterval;
        rd.pulseStep(spinIn);   // push-off: the trailing leg starts its swing (keeps the gait in step with the hops)
      }
      // walking leans back against the spin; reaching for holds (grab held, nothing gripped yet) leans INTO it so the
      // whirling fists sweep the slope / wall ahead instead of the air above it
      rd.setLean(spinIn * (this.grabHeld && !this._grabLock && !this.weapon ? (cfg.grab.reachLean ?? 0.3) : cfg.balance.lean));
    } else {
      this.hopTimer = Math.min(this.hopTimer, 0.12);
      rd.setLean(0);
      rd.setStep(0, 0);
    }

    // ---- balance / stagger
    const B = cfg.balance;
    if (this.stagger > 0) { this.stagger -= dt; this.balance = Math.min(this.balance, this.staggerFloor ?? 0); }
    else this.balance = Math.min(1, this.balance + B.recoverRate * dt);
    let eff = this.balance * (g ? 1 : B.airFactor);
    // cranking (grab + A/D around a hold): the torso is HELD upright (like the original's rigid stickman) so the
    // shoulder motor's turn has to go into the arm swinging the body up around the hand; with a floppy torso the
    // motor just pinwheels the torso about its own shoulder and the body never rises
    if (this.hangingWorld && spinIn) eff *= cfg.grab.crankFactor ?? 1;
    else if (this.hangingHigh) eff *= B.gripFactor;   // floppy only while hanging still from above; gripping the floor keeps balance
    rd.setBalance(eff);

    // ---- jump
    if (intent.jump && this.jumpCd <= 0 && (g || this.hangingWorld)) {
      const wasGripping = this.hangingWorld;
      if (wasGripping) {
        if (!(cfg.grab.climbAssist && this._tryMantle())) {
          // climb hop: spring up the wall; while grab is still held the hands re-grip higher
          this.releaseGrips();
          this._regrabT = cfg.grab.regrabDelay;
          const cv = rd.velocity();   // top up to the target speed so stacked hops/pulls can't launch you over the top
          rd.jump((spinIn || this.facing) * cfg.grab.climbHopVx, Math.max(0, cfg.grab.climbHopVy - Math.max(0, cv.y)));
        }
      } else {
        rd.jump(this.spinDir * cfg.jump.vx, cfg.jump.vy);
      }
      this.jumpCd = wasGripping ? 0.25 : cfg.jump.cooldown;
      this.hopTimer = M.hopInterval;
      if (this.hooks.onJump) this.hooks.onJump(this);
    }

    // ---- kick
    if (intent.kick && this.kickCd <= 0) {
      this.kickTimer = cfg.kick.duration; this.kickCd = cfg.kick.cooldown;
      rd.kick(this.facing);
      if (this.hooks.onKick) this.hooks.onKick(this);
    }

    // ---- grab: press = pick up a nearby item, or drop the held one.
    //      Keep holding while empty-handed (and nothing was picked up) = hang onto ledges.
    //      With one weapon and a free hand, a press near another loose weapon picks it up too (dual wield).
    if (intent.grabPress) {
      const handFree = ['F', 'B'].some((h) => !this.weaponIn(h) && !rd.detached['foreArm' + h]);
      if (this.weapon && handFree && this._pickUpNearest()) this._grabLock = true;
      else if (this.weapon) { this.dropWeapon(); this._grabLock = true; if (this.hooks.onDrop) this.hooks.onDrop(this); }
      else this._grabLock = this._pickUpNearest();
    }
    // enemies may climb while armed (free hand grabs the wall); players climb empty-handed
    const climbArmed = this.side === 'enemy';
    const hr = this._handRegrab || (this._handRegrab = { F: 0, B: 0 });
    hr.F -= dt; hr.B -= dt;
    if (intent.grab && !this._grabLock && (!this.weapon || climbArmed)) {
      this._regrabT = (this._regrabT || 0) - dt;
      // cranking with both hands on the wall (A/D pressed while hanging two-handed): the trailing hand lets go
      if (spinIn && this.grips.F && this.grips.B && this.gripKind.F === 'world' && this.gripKind.B === 'world') {
        const aF = this.grips.F.getAnchorA(), aB = this.grips.B.getAnchorA();
        this.releaseGrip(this._holdScore(aF.x, aF.y, spinIn) < this._holdScore(aB.x, aB.y, spinIn) ? 'F' : 'B', cfg.grab.handRegrab ?? 0.18);
      }
      // a hold the lever can't turn around (fist on the floor at the foot of a wall, body wedged in a corner) slips
      // after a moment instead of jamming the motor into the geometry; the hand is free to catch something better
      // (progress over a window, not instantaneous speed: a jammed joint still jitters at a few rad/s)
      const st = this._stall || (this._stall = { F: null, B: null });
      for (const h of ['F', 'B']) {
        const j = this.grips[h], sh = rd.joints['shoulder' + h];
        if (!spinIn || !j || this.gripKind[h] !== 'world' || !sh || sh.__dead) { st[h] = null; continue; }
        const a = sh.getJointAngle();
        if (!st[h]) { st[h] = { t: 0, a0: a }; continue; }
        st[h].t += dt;
        const win = cfg.grab.stallTime ?? 0.35;
        if (st[h].t >= win) {
          const want = Math.min(this.spinSpeed, cfg.grab.gripSpinSpeed ?? 8) * win;
          if (Math.abs(a - st[h].a0) < 0.3 * want) { this.releaseGrip(h, cfg.grab.handRegrab ?? 0.18); st[h] = null; }
          else st[h] = { t: 0, a0: a };
        }
      }
      if (this.grabTimer <= 0 && this._regrabT <= 0) { this._tryGrabWorld(spinIn, dt); this.grabTimer = cfg.grab.pollInterval; }
    } else if (this.gripping) {
      this.releaseGrips();
    }
    if (!intent.grab) this._grabLock = false;
    this.grabHeld = !!intent.grab;
    this.grabActive = this.grabHeld && !this._grabLock && !this.weapon;
    for (const h of ['F', 'B']) if (this.grips[h] && this.grips[h].__dead) { this.grips[h] = null; this.gripKind[h] = null; }

    // ---- hand-over-hand climbing: hanging + grab + A/D -> boost up; with two holds the lower hand lets go and re-grips higher
    this._climbT = (this._climbT || 0) - dt;
    if (cfg.grab.climbAssist && this.hangingWorld && intent.grab && spinIn && this._climbT <= 0 && this._tryMantle()) {
      this._climbT = cfg.grab.climbInterval;
    } else if (cfg.grab.climbAssist && this.hangingWorld && intent.grab && spinIn && this._climbT <= 0) {
      const held = ['F', 'B'].filter((h) => this.grips[h] && this.gripKind[h] === 'world');
      if (held.length === 2) {
        const low = rd.handPoint('F').y < rd.handPoint('B').y ? 'F' : 'B';
        const j = this.grips[low];
        this.physics.removeBreakable(j); this.physics.destroyJoint(j);
        this.grips[low] = null; this.gripKind[low] = null;
      }
      const cv = rd.velocity();
      rd.addVelocity(spinIn * 0.5, Math.max(0, cfg.grab.climbPullVy - Math.max(0, cv.y)));
      this._climbT = cfg.grab.climbInterval;
      this.grabTimer = Math.min(this.grabTimer, 0.04);
    }
    rd.setPull(this.hangingWorld, { F: !!this.grips.F, B: !!this.grips.B });
    rd.setReach((this.grabActive || (climbArmed && this.grabHeld && !this._grabLock)) && !this.gripping);
    if ((this.weapon && this.weapon.holder !== this) || (this.weapon2 && this.weapon2.holder !== this)) { this._syncWeapons(); this._armRest(); }

    // pending hazard launch (spikes): fire once the body has stopped plunging, or after a short timeout
    if (this._launch) {
      const L = this._launch, v = rd.velocity();
      L.t -= dt;
      if (v.y > -0.8 || L.t <= 0) { rd.addVelocity(L.x, Math.max(0, L.y - Math.max(0, v.y))); this._launch = null; }
    }

    rd.step(dt);
  }

  // ---- damage --------------------------------------------------------------------------------
  /** applyHit({part, damage, impulse, point, normal, speed, isCrit, source, attacker}) */
  applyHit(h) {
    if (this.dead) return;
    const cfg = this.cfg, C = cfg.combat;
    const dmg = h.damage || 0;
    this.flash = C.hitFlash;
    this.hp -= dmg;
    this.hitCount++;
    this.lastHit = h;
    this.partDamage[h.part] = (this.partDamage[h.part] || 0) + dmg;
    this.flashPart = h.part;
    const B = cfg.balance;
    if (dmg >= B.staggerDamage * 0.5) {
      const t = Math.min(B.staggerMax, B.staggerTime * (dmg / B.staggerDamage));
      this.stagger = Math.max(this.stagger, t);
      this.staggerFloor = dmg >= B.knockdownDamage ? 0 : B.staggerFloor;
      this.balance = Math.min(this.balance, this.staggerFloor);
    }
    // dismember?
    if (DETACHABLE.has(h.part) && !this.ragdoll.detached[h.part]) {
      const isHead = h.part === 'head';
      const thr = (isHead ? C.dismember.threshold.head : C.dismember.threshold.limb) * (this.maxHp / 100);
      const chance = isHead ? C.dismember.chance.head : C.dismember.chance.limb;
      if (this.partDamage[h.part] >= thr && (Math.random() < chance || this.partDamage[h.part] >= thr * 2)) {
        this.detachPart(h.part, h.point);
      }
    }
    if (this.hp <= 0) this.die('ko');
  }

  detachPart(part, point) {
    const rd = this.ragdoll;
    if (!rd.detach(part)) return false;
    for (const hand of ['F', 'B']) {
      if (ARM_OF_HAND[hand].includes(part)) {
        const hw = this.weaponIn(hand);
        if (hw) { dropWeapon(hw); this._syncWeapons(); this._armRest(); }
        if (this.grips[hand]) { this.physics.removeBreakable(this.grips[hand]); this.physics.destroyJoint(this.grips[hand]); this.grips[hand] = null; }
        for (const w of [this.weapon, this.weapon2]) if (w && w.handJoint) { this.physics.destroyJoint(w.handJoint); w.handJoint = null; rd.setTwoHand(false); }
      }
    }
    const p = point || (() => { const c = rd.parts[part].getWorldCenter(); return { x: c.x, y: c.y }; })();
    if (this.hooks.onDismember) this.hooks.onDismember({ fighter: this, part, point: p });
    if (part === 'head') { this.hp = Math.min(this.hp, 0); this.die('decapitated'); }
    return true;
  }

  die(cause = 'ko') {
    if (this.dead) return;
    this.dead = true; this.deathCause = cause; this.hp = Math.min(this.hp, 0);
    this.spinDir = 0; this.spinSpeed = 0; this.kickTimer = 0;
    this.releaseGrips();
    this.ragdoll.setSpin(0, 0);
    this.ragdoll.limp();
    if (this.hooks.onKO) this.hooks.onKO(this, cause);
  }

  heal() { this.hp = this.maxHp; this.partDamage = {}; this.stagger = 0; this.balance = 1; }

  destroy() {
    for (const w of [this.weapon, this.weapon2]) if (w) destroyWeapon(w);
    this.weapon = null; this.weapon2 = null;
    this.releaseGrips();
    this.ragdoll.destroy();
    this.physics.fighters.delete(this);
  }
}

/**
 * Wire physics hit events -> damage/knockback/sticking/hooks.
 * hooks: onHit(evt), onKO(f, cause), onDismember({fighter, part, point}), onStick({weapon, fighter, part}), onClash(evt)
 */
export function createCombat(physics, hooks = {}, cfg = physics.cfg || CONFIG) {
  const C = cfg.combat;
  const off1 = physics.onHit((evt) => {
    const victim = evt.victim;
    if (!victim || victim.dead && evt.source === 'foot') return;
    if (evt.source === 'loose') return;   // dropped / flying items never hurt anyone
    if (evt.attacker && evt.attacker.side === 'enemy' && victim.side === 'enemy') return;   // enemies never hurt each other
    let base = 0, kind = 'fist', def = null;
    if (evt.source === 'weapon' || evt.source === 'loose') {
      def = weaponById(evt.weaponId); base = def.damage * (evt.source === 'loose' ? C.looseFactor : 1); kind = def.kind;
    } else if (evt.source === 'fist') { def = weaponById('fists'); base = def.damage; kind = 'fist'; }
    else if (evt.source === 'foot') { base = C.footDamage; kind = 'foot'; }
    else if (evt.source === 'hazard') { base = evt.hazardDamage || 0; kind = 'hazard'; }   // blades / spikes
    const Hz = cfg.hazards || {}, isHazard = evt.source === 'hazard';

    let mult = partMult(cfg, evt.part);
    if (victim.armour && victim.armour[evt.part] !== undefined) mult *= victim.armour[evt.part];
    const factor = isHazard
      ? Math.max(Hz.minFactor ?? 0.7, Math.min(Hz.maxFactor ?? 1.5, evt.speed / (Hz.refSpeed ?? 8)))
      : Math.max(0, Math.min(C.maxFactor, (evt.speed - C.minSpeed) / C.refSpeed));
    let dmg = base * mult * factor;
    if (evt.attacker && evt.attacker.dmgMult) dmg *= evt.attacker.dmgMult;   // tougher enemy types hit harder
    if (victim.toughness) dmg /= victim.toughness;                         // bosses soak more
    let isCrit = !isHazard && (evt.isCrit || (def && evt.speed > C.critSpeed * 0.6 && Math.random() < def.crit));
    if (isCrit) dmg *= C.critMult;
    if (dmg < C.minDamage) return;
    if (victim.dead) dmg *= 0.25;

    // knockback: along attacker velocity at the contact point
    const av = evt.attackerVel;
    let len = Math.hypot(av.x, av.y);
    let dx, dy;
    if (isHazard && evt.hazard && evt.hazard.knockDir) { const kd = evt.hazard.knockDir(evt); dx = kd.x; dy = kd.y; }   // e.g. spikes knock up
    else if (len > 0.5) { dx = av.x / len; dy = av.y / len; }
    else { const n = evt.normal; dx = n.x; dy = n.y; }
    let kb = isHazard ? (Hz.knockback ?? 1) * ((evt.hazard && evt.hazard.knock) || 1) : (C.knockback[kind] ?? 1) * (def && def.knock ? def.knock : 1);
    if (isCrit) kb *= C.critKnock ?? 1;
    const sc = victim.scale * victim.scale;
    const part = victim.ragdoll.parts[evt.part];
    if (part && !part.__dead) {
      const J = dmg * C.knockbackPerDamage * kb * sc;
      part.applyLinearImpulse(V(dx * J, dy * J + J * 0.25), V(evt.point.x, evt.point.y), true);
      const dv = dmg * C.bodyKnock * kb;
      victim.ragdoll.addVelocity(dx * dv, Math.max(0, dy) * dv * 0.5 + dv * 0.25);
      // spikes: bounce the whole body off the strip. Deferred (see Fighter.update): at dispatch time the victim is
      // still plunging into the contact, so an instant impulse would just be swallowed by the landing.
      if (isHazard && evt.hazard && evt.hazard.launch && !victim.dead) victim._launch = { x: dx * evt.hazard.launch * 0.3, y: dy * evt.hazard.launch, t: 0.12 };
    }

    const hit = { ...evt, damage: dmg, isCrit, kind, wasDead: victim.dead };   // wasDead: hitting a body that was already down
    victim.applyHit(hit);
    if (hooks.onHit) hooks.onHit(hit);

    // thunder hammer: a hard hit sends it flying on, then it homes back to the owner's hand
    if (evt.weapon && evt.weapon.special === 'return' && evt.attacker && evt.weapon.holder === evt.attacker && evt.speed >= (C.returnHitSpeed ?? 9)) {
      const owner = evt.attacker;
      if (throwWeapon(evt.weapon, owner, { x: dx * 9 + owner.facing * 2, y: Math.max(3, dy * 9 + 4) })) {
        owner._syncWeapons(); owner._armRest();
        if (hooks.onThrow) hooks.onThrow(owner, evt.weapon);
      }
    }

    // blades stick into torso/head on strong hits
    if (evt.isBlade && evt.weapon && evt.attacker && !evt.weapon.stuck && evt.speed >= C.stick.speed && Math.random() < C.stick.chance
        && (evt.part === 'head' || evt.part.startsWith('spine')) && !evt.attackerBody.__dead && !evt.victimBody.__dead) {
      const pl = window.planck;
      const j = physics.world.createJoint(new pl.WeldJoint({ frequencyHz: 0, dampingRatio: 0 }, evt.attackerBody, evt.victimBody, V(evt.point.x, evt.point.y)));
      const w = evt.weapon; w.stuck = j;
      physics.addBreakable({ joint: j, maxForce: C.stick.breakForce, ttl: C.stick.ttl, onBreak: () => { if (w.stuck === j) w.stuck = null; } });
      if (hooks.onStick) hooks.onStick({ weapon: w, fighter: victim, part: evt.part, point: evt.point });
    }
  });
  const off2 = physics.onClash((evt) => { if (hooks.onClash) hooks.onClash(evt); });
  return { destroy() { off1(); off2(); } };
}

/** Tiny stand-in AI: spin toward foe, hop/kick sometimes. Returns an intent. */
export function dummyAI(self, foe, dt = 1 / 60) {
  const st = self._ai || (self._ai = { t: 0, spin: 0, grab: false, jump: false, kick: false, think: 0 });
  st.jump = false; st.kick = false;
  if (self.dead) return { spin: 0, jump: false, kick: false, grab: false };
  st.t -= dt;
  if (st.t <= 0) {
    st.t = 0.25 + Math.random() * 0.45;
    if (!foe || foe.dead) { st.spin = Math.random() < 0.3 ? (Math.random() < 0.5 ? 1 : -1) : 0; st.grab = false; return { spin: st.spin, jump: false, kick: false, grab: false }; }
    const dx = foe.x - self.x, dy = foe.y - self.y, adx = Math.abs(dx);
    const dir = Math.sign(dx) || 1;
    const r = Math.random();
    if (adx > 1.2) st.spin = r < 0.88 ? dir : (r < 0.94 ? 0 : -dir);
    else st.spin = r < 0.75 ? dir : (r < 0.9 ? -dir : 0);
    st.jump = (dy > 0.8 && Math.random() < 0.5) || (adx < 2.2 && Math.random() < 0.12);
    st.kick = adx < 1.6 && Math.random() < 0.3;
    st.grab = !self.weapon && Math.random() < 0.6;
    if (self.gripping) st.grab = Math.random() < 0.3;
  }
  return { spin: st.spin, jump: st.jump, kick: st.kick, grab: st.grab };
}
