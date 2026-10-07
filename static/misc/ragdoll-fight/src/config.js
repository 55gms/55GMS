// All physics / feel tunables in one place. Units: metres, kg, seconds, radians.
// Scale notes: for a fighter of scale s, masses scale ~s^2, forces ~s^2, torques ~s^4.

export const CONFIG = {
  // Physics 1:1 (DESIGN.md §12): the original runs Unity Physics2D at -9.81 units/s^2; levels convert at 1.2 m per
  // Unity unit -> -11.77 m/s^2.
  gravity: -11.77,
  step: 1 / 60,        // fixed game step
  subSteps: 2,         // physics substeps per game step (fast weapons -> no tunnelling)
  velIters: 8,
  posIters: 3,
  deathY: -6,          // default; levels override

  ragdoll: {
    // reference proportions (height H): head ~0.31 H, torso ~0.33 H, legs ~0.36 H, limbs ~0.08 H thick
    head:     { r: 0.27, density: 28, neckGap: 0.03 },
    spine:    { segLen: 0.145, widths: [0.28, 0.26, 0.26, 0.28], density: 165 },
    upperArm: { len: 0.38, w: 0.14, density: 60 },
    foreArm:  { len: 0.36, w: 0.13, density: 60 },
    fist:     { r: 0.14, density: 35 },  // big round fist on the hand end of each forearm (~2x arm thickness)
    thigh:    { len: 0.32, w: 0.15, density: 110 },
    shin:     { len: 0.31, w: 0.14, density: 100 },
    // 1:1 mass distribution (DESIGN.md §12): the original's Rigidbody2D masses are head 0.5, chest 1, torso 2, 3,
    // pelvis 4, upper arm 1, forearm 1, thigh 3, shin 3 (26.5 units); scaled to a 70 kg fighter (x2.64 kg/unit).
    // Part masses in kg at scale 1 (giants: x scale^2); the densities above are only the fallback.
    mass: { head: 1.3, spine1: 10.6, spine2: 7.9, spine3: 5.3, spine4: 2.6, upperArm: 2.6, foreArm: 2.6, thigh: 7.9, shin: 7.9 },
    friction: 0.4,       // original: no PhysicsMaterial2D on the body = Unity default 0.4
    footFriction: 1.6,   // NOT 1:1: the original's rigid legs skate on 0.4; our stepping gait needs the planted foot to hold (mixed with the 0.4 floor -> 0.8)
    restitution: 0,      // body 0, floor 0.4 (Bouncy.04): Box2D takes the max -> 0.4 against the floor, 0 body-to-body
    linearDamping: 0,    // Rigidbody2D linearDrag 0
    angularDamping: 0.05,// Rigidbody2D angularDrag 0.05
    // neck / spine hinges are locked (0..0) in the original: the torso + head is one rigid stick. Elbows fold one way
    // only: -150 deg (elbowFold, toward the back of the hand) .. +5 deg (elbowBack), mirrored by facing.
    limits: { neck: 0, spine: 0, elbow: 1.7, elbowFold: 2.62, elbowBack: 0.087, hip: 1.35, kneeBend: 2.2 },
    // back arm runs slightly slower so both arms don't overlap perfectly while spinning
    backArmSpeedFactor: 0.88,
  },

  spin: {
    // 1:1 (DESIGN.md §12, measured in the original): ~1.7 rev/s over the first turn, ~2.5 rev/s after ~1 s
    // playtest: the 1:1 ramp (5 -> 16 over ~1 s) felt sluggish -> quicker start, full speed in ~0.5 s
    armSpeedMin: 8,        // rad/s when spin first held
    armSpeedMax: 17,       // rad/s after ramp (~2.7 rev/s)
    armAccel: 20,          // rad/s^2 ramp while held (~0.45 s to full speed)
    // "on fire" fists (game.js FIRE_*): 3 fist hits in a row, or fireSpinTime s of full-speed empty-handed spinning
    fireSpeedMult: 1.9,    // arm speed x while on fire (16 -> 30 rad/s, ~4.8 rev/s)
    fireTorqueMult: 2.5,   // shoulder motor x while on fire
    fireSpinTime: 3,       // s of continuous full-speed spin that ignites the fists
    armDecay: 45,          // rad/s^2 decay on release
    // original: HingeJoint2D maxMotorTorque 10000 on a 26.5-unit body -> x2.64 kg/unit x 1.2^2 m/unit = 38000 N*m,
    // i.e. the arm is driven near-kinematically. We use the same value the grip crank was calibrated to against the
    // original's climb (grab.gripSpinTorque): still ~100x what a free swing needs (the arm holds its commanded speed and
    // the body takes the reaction: hops, lean), but a fist jammed against a wall can't fling the body off the map.
    shoulderTorque: 3600,  // N*m motor while spinning (true 1:1 = 38000, see DESIGN.md §12)
    // playtest: "the weapon is all momentum" -> arms (and the weapon in hand) settle much faster once spin is released
    idleShoulderTorque: 90,// N*m motor pulling arms to rest
    idleShoulderGain: 6,   // P gain (motor speed per rad error)
    weaponArmRest: 0,      // rad: arms hang at rest like the reference (held weapons pass through the floor)
    weaponArmTorque: 110,  // N*m extra hold torque on the weapon arm
    elbowIdleTorque: 5,
    elbowIdleGain: 5,
    elbowSpinTorque: 0.6,  // tiny damping so elbows stay loose but not chaotic
    swingHookEvery: Math.PI, // radians of shoulder rotation between onSwing hooks
  },

  move: {
    // reference: spinning carries the fighter at ~1 m/s with a stepping / light hopping gait
    // propulsion drives the BODY (every part but the planted feet: rd.propel / rd.hop) so the stance leg vaults it
    // over a foot that stays put; feet pushed directly would just skid along the floor
    // 1:1 (DESIGN.md §12): the original barely creeps for the first ~0.5 s of a spin and cruises at ~1.25 m/s after ~1 s;
    // the push (and the hop's forward kick) is scaled by the arm spin ramp (spinSpeed / armSpeedMax) in fighter.js
    // playtest: the 1:1 values (accel 6, maxSpeed 1.35, hop 0.5/0.55) made moving, jumping and hills a slog -> snappier
    accel: 10,           // m/s^2 at full spin while grounded
    airAccel: 4,
    maxSpeed: 2.0,       // stop pushing beyond this horizontal speed
    accelRamp: 0.5,      // m/s below maxSpeed over which the push ramps down (no bang-bang shoving at cruise)
    spinFloor: 0.5,      // share of the push available the moment spin is pressed (rest grows with the arm spin ramp)
    stallLift: 5,        // m/s^2 upward help while pushing but barely moving on the ground (slopes, steps, bodies)
    stallSpeed: 0.6,     // m/s: below this (while pushing) counts as stalled
    hopInterval: 0.5,    // s between steps / mini-hops while moving
    hopVy: 0.8,          // m/s vertical hop
    hopVx: 0.8,          // m/s forward kick per hop (x spin ramp)
    // stepping gait while moving (ragdoll.js): legs alternate; the swing foot follows a world-space arc to a landing
    // point fixed in the world (arrives with ~zero ground speed), the stance leg holds its foot where it touched down
    // (two-link IK + feed-forward) while the body is driven over it.
    gait: {
      cycle: 0.5,        // s per full cycle (both legs step once); each hop re-syncs it -> keep = hopInterval
      swingDuty: 0.42,   // fraction of the cycle a leg spends in the air (rest = planted; < 0.5 leaves a double-support moment)
      clearance: 0.15,   // m (x scale) the swing foot lifts at mid-swing
      landLead: 0.8,     // fraction of the body's travel during the swing the landing point is placed ahead by (under-predict: landing short is safe, over-striding stubs)
      minSweep: 0.12,    // rad: shortest step (marching in place / pushing against something)
      maxFront: 0.35,    // rad: furthest ahead of the hip a foot is put down (the push-off behind may trail to maxSweep)
      reachFrac: 0.98,   // leg IK never straightens past this fraction of full length (~0.4 rad knee bend kept: a dead-straight loaded knee can't start folding)
      maxSweep: 0.85,    // rad: hip angle the planted leg may trail to before the foot is let go (past the floor reach it lifts off by itself)
      trailKnee: 0.5,    // rad of knee bend for a leg that has trailed out of reach (foot tucked clear of the floor)
      landFrac: 0.8,     // swing progress after which a floor touch ends the swing (foot planted)
      probeDown: 2.5,    // m/s (x scale) a stance foot that isn't touching feels downwards for the floor (no hovering)
      probeDepth: 0.25,  // m (x scale) below the anchor it may feel before giving up (steps, ledges)
      airPose: 0.45,     // s airborne before the legs drop the gait for the idle pose (jumps, falls); hop flights are shorter
    },
  },

  balance: {
    // world-frame upright drive per spine segment (pelvis -> chest), via solver MotorJoints:
    // max torque (N*m) and correction factor (fraction of angle error removed per substep)
    uprightTorque: [780, 360, 280, 270],
    uprightCorrection: 0.18,
    spineJointTorque: 120, spineJointGain: 14,
    neckTorque: 14, neckGain: 8,
    hipTorque: 170, hipGain: 5,
    kneeTorque: 90, kneeGain: 4,
    legMaxSpeed: 3.5,    // rad/s cap on leg motors: legs ease into poses instead of snapping (no twitching)
    stanceAngle: 0.14,   // rad: front leg forward / back leg back
    // stepping gait (only while moving): firmer, quicker leg motors so the swing foot lifts and the planted knee holds
    gaitHipTorque: 400, gaitKneeTorque: 600, gaitGain: 9, gaitMaxSpeed: 22,   // knee must hold a hop landing (~3x weight) without buckling; swing knee folds fast
    gaitStanceSpeed: 8,    // rad/s cap on the planted leg's hip motor
    gaitStanceKneeSpeed: 5, // rad/s cap on the planted knee's extension (holds a landing hard, props back up without a catapult)
    gaitPushFactor: 1.3,    // x body weight the planted knee may push with while extending (net 0.3 g rise, never a launch)
    gaitKneePushMin: 40,    // N*m floor on that push (near-straight knee has almost no lever arm)
    gaitStandFactor: 0.88, // hip height (x leg length) the planted leg holds the body at while stepping (a straight leg reaches the floor at +-0.49 rad)
    assistK: 2200,       // N/m upward pelvis assist when grounded
    assistD: 330,        // N*s/m
    assistMax: 1500,     // N
    standFactor: 0.94,   // fraction of leg length the pelvis is held at
    lean: -0.22,         // rad; negative = lean back against the spin like the reference
    airFactor: 0.45,     // balance strength while airborne
    gripFactor: 0.15,    // balance strength while hanging from a world grip
    staggerDamage: 20,   // hits above half this stagger
    staggerTime: 0.4,    // s of stagger per staggerDamage
    staggerMax: 0.7,
    staggerFloor: 0.35,  // balance is only weakened to this by a normal stagger (wobble, stay up)
    knockdownDamage: 28, // a single hit this big drops balance to 0 (knocked flat)
    recoverRate: 2.4,    // balance -> 1 per second after stagger
  },

  jump: { vy: 5.3, vx: 1.3, cooldown: 0.6 },   // playtest: 4.47 (apex ~0.85 m) felt weak -> apex ~1.2 m at g 11.77

  kick: {
    duration: 0.32, cooldown: 0.8,
    hipAngle: 1.55,          // rad target of front hip during kick
    torque: 900,             // N*m hip motor during kick
    gain: 30,
    angularImpulse: 26,      // instant snap on thigh
    shinImpulse: 14,
    bodyVx: 0.6,             // small forward push
  },

  grab: {
    pickupRadius: 1.6,       // m from body centre: press grab within this to pick up a loose item
    radius: 0.42,
    pollInterval: 0,         // s between contact checks while grab is held (0 = every step: a windmilling fist only brushes a wall for a frame or two)
    worldBreakForce: 40000,  // N before a hand lets go of the world (very firm grip)
    fighterBreakForce: 16000,// N before a hand lets go of a grabbed fighter
    // gripping works like a pivot: while a hand holds on, A/D turn the arm around the grip (levering the body),
    // otherwise the arm locks where it is; elbows stay straight so the arm acts as a lever.
    // Reference: the original's shoulder motor (10000 units of torque on a 26-unit body) is a near-kinematic crank:
    // spinning while gripping cartwheels the whole body over the hand. Lifting our 70 kg over a 0.88 m arm needs
    // ~800 N*m at the worst point, so the crank gets ~4x that (motorTo scales it by s^4 for giants).
    gripSpinTorque: 3600,    // N*m shoulder motor while gripping and holding A/D
    gripSpinSpeed: 8,        // rad/s max arm turn speed while gripping (controlled swing)
    gripHoldTorque: 900,     // N*m shoulder lock while gripping without A/D
    gripHoldGain: 10,
    gripElbowTorque: 450,    // N*m keeps the gripping arm straight (the lever)
    // hand-over-hand: while cranking (grab + A/D) only one hand holds on; a new hold is taken only if it is further
    // along the climb (higher / ahead) by handLead m, and the old hand lets go and may not re-grip for handRegrab s
    handLead: 0.12,
    handRegrab: 0.18,
    crankFactor: 1.0,        // balance strength while cranking: the torso is held upright so the crank lifts the body (a loose torso just pinwheels)
    stallTime: 0.35,         // s a cranking hand may sit jammed (arm not turning) before it slips off the hold
    climbAssist: false,      // scripted hand-over-hand boosts + auto-vault (off: climbing is pure grip physics)
    worldRadius: 0.62,       // m: hands catch walls/ledges from this far (bigger = easier climbing)
    floorHold: 0.45,         // m (x scale) below the hips on the feet side: static ground there is never a hold (no grabbing the floor you stand on)
    reachAngle: 2.5,         // rad: arms lift up-forward while grab is held empty-handed (reaching for walls)
    reachLean: 0.3,          // rad: lean INTO the spin while grab is held and spinning with no hold yet (fists sweep the slope ahead)
    reachTorque: 70, reachGain: 7,
    climbHopVy: 5.2,         // m/s: W while hanging springs up the wall; hands re-grip higher while grab is held
    climbHopVx: 0.6,
    climbInterval: 0.32,     // s between hand-over-hand pulls while holding A/D toward the wall
    climbPullVy: 3.2,        // m/s boost per hand-over-hand pull (topped up, never stacked)
    mantleReach: 0.45,       // m: hips within this of the highest wall grip = at the ledge -> W or A/D vaults over
    mantleVx: 2.0,           // m/s forward over the ledge
    mantleVy: 3.4,           // m/s up while vaulting
    regrabDelay: 0.14,       // s after a climb hop before the hands may grip again
    pullTorque: 260,         // N*m shoulder motor while hanging (climb)
    pullGain: 8,
  },

  combat: {
    minSpeed: 4,             // m/s below which contacts do nothing
    refSpeed: 12,            // damage factor = (speed-min)/ref
    maxFactor: 1.6,
    minDamage: 1,
    cooldown: 0.25,          // s per attacker -> victim part
    cooldownAny: 0.12,       // s per attacker -> victim (any part): one swing = one hit
    critSpeed: 33,           // m/s hard crit threshold (long weapons at full whip; raised for the longer arms)
    critMult: 1.6,
    footDamage: 7,
    looseFactor: 0.8,        // damage of un-held flying weapons
    fistSpinSpeed: 6,        // arm rad/s before fists count as attacking
    partMult: { head: 1.8, spine4: 1.0, spine3: 1.0, spine2: 1.0, spine1: 0.9, limb: 0.55 },
    knockback: { fist: 0.8, blunt: 1.25, blade: 0.8, pole: 1.0, chain: 1.15, foot: 1.1 },
    knockbackPerDamage: 3.0, // N*s per damage point applied at the hit part
    bodyKnock: 0.09,         // m/s of whole-body velocity per damage point
    critKnock: 1.7,          // crits launch bodies (reference: a crit sends the victim flying 2-3 body heights)
    returnHitSpeed: 9,       // thunder hammer flies off when it lands a hit at least this fast
    hitFlash: 0.12,
    partRedDamage: 30,       // damage on one body part (per 100 max HP) for that part to be fully red
    dismember: {
      threshold: { head: 70, limb: 45 },  // per 100 max HP; guaranteed at 2x
      chance: { head: 0.3, limb: 0.4 },
    },
    stick: { speed: 12, chance: 0.5, breakForce: 2600, ttl: 1.6 },
    clashSpeed: 6,
  },

  weapons: {
    gripTilt: 0.45,          // rad: 0 = weapon continues the forearm line; >0 tilts it toward the facing side
    returnDelay: 0.4,        // s the thunder hammer flies free before homing back
    returnSpeed: 13,         // m/s homing speed
    returnCatch: 0.55,       // m from the hand to snap back into it
    friction: 0.4,           // original weapons carry no material: Unity default 0.4 (floor 0.4 -> mixed 0.4)
    restitution: 0,          // the floor's 0.4 bounciness wins (Box2D takes the max)
    chainLinkR: 0.035,
    chainLinkLen: 0.075,
    poleHandsFreq: 5,
    dropSelfCollideDelay: 0.45,
    puntFactor: 0.85,        // held weapon hitting a loose item: the item takes this share of the hit speed...
    puntLift: 3,             // ...plus up to this much upward speed (m/s); the swing itself is never blocked
    puntMaxSpeed: 22,
  },

  statics: {
    friction: 0.4,           // original floor material Bouncy.04: friction 0.4, bounciness 0.4 (every ground collider)
    restitution: 0.4,
  },

  hazards: {
    // contact damage from blades / spikes: dmg = damage * partMult * clamp(speed / refSpeed, minFactor, maxFactor); never crits
    minSpeed: 1.2,           // m/s relative speed below which a blade/spike contact does nothing (resting on spikes = safe)
    refSpeed: 8,
    minFactor: 0.7, maxFactor: 1.5,
    cooldown: 0.45,          // s per hazard -> victim between hits
    knockback: 1.0,          // knockback multiplier (uses combat.knockbackPerDamage / bodyKnock)
    // explosives (barrel / jar): blow up when anything touches them at >= explodeSpeed (weapon swing, kick, fall, blast debris)
    explodeSpeed: 5.5,
    power: 9,                // default m/s given to bodies at the centre (falls off to minPush * power at the edge)
    damage: 30,              // default damage at the centre (falls off to 35% at the edge; x part multiplier)
    radius: 2.6,             // default blast radius (m); per-hazard `radius` overrides
    upBias: 0.45, minPush: 0.25,
    chainDelay: 0.14,        // s before a neighbouring explosive goes off (scaled by distance)
    piston: { out: 0.16, hold: 0.18, back: 0.3, friction: 0.6 },   // fractions of `period`: slam out, hold, ease back, rest (peak speed = 1.5*stroke/(out*period))
    mover: { friction: 0.85 }, rotor: { friction: 0.7 }, conveyor: { friction: 0.9 },
    blade: { friction: 0.3, teeth: 22, knock: 1 },                          // knock: knockback multiplier (def.knock overrides)
    spikes: { height: 0.32, friction: 0.2, knock: 1.5, launch: 3.5 },      // launch: whole-body m/s upward per hit (bounce off the strip)
    barrel: { w: 0.62, h: 0.82, mass: 9 }, jar: { r: 0.27, mass: 3, linkLen: 0.2, linkMass: 0.12 },
    crate: { size: 0.55, mass: 3 }, bag: { w: 0.5, h: 1.0, mass: 18 }, rack: { tier: 0.42, base: 0.35 },
    // ---- content-expansion hazards (DESIGN.md §10); per-entry fields/defaults live in hazards.js, these are the tuning knobs
    iceFriction: 0.04,                                                      // static boxes/polys with style 'ice'
    spikeball: { friction: 0.3, knock: 1.2 },
    bouncer: { height: 0.22, cooldown: 0.4, friction: 0.9 },              // cooldown: s per body between launches
    wind: { warn: 0.5, duty: 0.5 },                                         // warn: s of streak warning before a timed gust
    lava: { thick: 0.5, every: 0.5, pop: 3.5, friction: 0.5 },             // every: s between burns per fighter; pop: m/s upward per burn
    firejet: { width: 0.7, sputter: 0.6, push: 22, pop: 2.5, every: 0.5 }, // push: m/s^2 along the flame; pop: m/s per burn
    crumble: { fallTime: 1.0, fade: 0.4, friction: 0.85 },                 // fallTime: s the slab drops before vanishing
    swinger: { minSpeed: 3, knock: 1.6, friction: 0.5 },                    // minSpeed: m/s relative speed before the bob hurts
    lasergate: { flicker: 0.4, every: 0.5, knock: 5, halfWidth: 0.14 },    // knock: m/s shove away from the beam per zap
    bumper: { cooldown: 0.3, restitution: 0.3 },
    seesaw: { mass: 25, damping: 0.8, friction: 0.85, post: 1.0 },          // post: visual/static pivot post height below the pivot
    boat: { friction: 0.85, hullDepth: 0.9 },
    water: { depth: 14 },
    shock: { warn: 0.5, every: 0.5, hop: 3, height: 0.4 },                  // height: zone above the plate that gets zapped
    icicle: { shake: 0.6, mass: 2.5, halfWidth: 0.13 },
    // ---- original-level fidelity hazards (DESIGN.md §11)
    pistonLift: 0.25,                                                       // horizontal trigger pistons add launch*lift m/s upward so victims fly, not skid
    block: { density: 9, metalMul: 1.8, minMass: 2, maxMass: 60, friction: 0.7, damping: 0.05 },   // auto mass = w*h*density (kg)
    wheel: { friction: 0.9, density: 10, minMass: 3, torque: 320, gain: 6, freeDamping: 0.25, cartMass: 25 },  // torque: max drive N*m per metre of radius (roll mode); cartMass: min kg of a block that rides on rolling wheels
    spinner: { cooldown: 0.3, base: 2.5, perSpeed: 0.6, min: 2, max: 9, radial: 0.6, up: 0.25 }, // knock m/s = knock*(base + perSpeed*tipSpeed), clamped
    track: { friction: 0.9, slat: 0.32 },
    pendulum: { friction: 0.6, minSpeed: 2.5, knock: 1.1, maxKnock: 9, cooldown: 0.5, damping: 0.03, damageKnock: 1.6 },
  },

  render: {
    pxPerMeter: 70, minZoom: 34, maxZoom: 105, camSmooth: 4.5, padX: 1.8, padY: 1.6,
    bg: '#23262e', body: '#f2eee6', damage: '#d8432f', accent: '#ffc23d', green: '#5fbf6a',
    slab: '#3b404b', slabEdge: '#4d5363', pillar: '#31353f', bumper: '#5fbf6a',
    backShade: '#1d2027', backShadeAmt: 0.68,   // back arm/leg drawn this much darker for depth
  },
};

export default CONFIG;
