// api/player.js — the Player module: a custom wrapper over the `player` instance.
//
// Members read/write the LIVE player instance (via deps.getPlayer). Property names
// are verified against objectTypes/player/player.json + collision.js + the
// E_player/E_camera sheets.
//
// `position` and `velocity` are live NESTED vectors (like the inspector's
// structured props): write the whole object OR a single axis, and partial writes
// leave other axes untouched. Most other members are instance variables / tuning
// values; a few (isGrounded, is3rdPerson, enter/exit3rdPerson) call Construct
// runtime functions via runtime.callFunction.

function defineProps(obj, defs) {
  for (const [name, d] of Object.entries(defs)) {
    Object.defineProperty(obj, name, {
      enumerable: true,
      configurable: true,
      get: d.get,
      set: d.set,
    });
  }
}

// A live nested vector property (like the inspector's structured props). Reading
// returns a sub-object whose axes read/write through to the backing accessors;
// writing the whole property applies each axis the value provides (partial
// objects allowed — unlisted axes are left untouched). So both
//   Player.position = { x: 1, y: 2, z: 3 }   and   Player.position.x = 1
// work, as does a partial   Player.position = { z: 5 }.
function defineVector(obj, name, axes) {
  Object.defineProperty(obj, name, {
    enumerable: true,
    configurable: true,
    get: () => {
      const sub = {};
      for (const [axis, a] of Object.entries(axes)) {
        Object.defineProperty(sub, axis, {
          enumerable: true,
          configurable: true,
          get: a.get,
          set: a.set,
        });
      }
      return sub;
    },
    set: (v) => {
      if (!v) return;
      for (const axis of Object.keys(axes)) {
        if (v[axis] !== undefined) axes[axis].set(v[axis]);
      }
    },
  });
}

export function buildPlayer({ getPlayer, runtime }) {
  let cachedPlayer = null;
  const P = () => {
    if (cachedPlayer) return cachedPlayer;
    const p = getPlayer();
    if (!p)
      throw new Error("[script] Player: no player instance in this level");
    cachedPlayer = p;
    return p;
  };

  const player = {
    enter3rdPerson: () => {
      runtime.callFunction("enter3rdPerson");
    },
    exit3rdPerson: () => {
      runtime.callFunction("exit3rdPerson");
    },

    __docs__: {
      position:
        "Player.position — world position {x, y, z} (feet Z). Set the whole object or a single axis: Player.position = {x,y,z} or Player.position.x = …",
      velocity:
        "Player.velocity — velocity {x, y, z} (x/y from the Movement behavior, z = vectorZ). Set the whole object or a single axis.",
      angle: "Player.angle — facing angle in degrees (read/write).",
      lookAngle:
        "Player.lookAngle — aim/look angle in degrees, driven by the camera (read-only).",
      state:
        'Player.state — the player state machine string ("idle", "run", "jump", "wallRunLeft", …) (read-only).',
      jumpStrength: "Player.jumpStrength — jump impulse strength (read/write).",
      gravityModifier:
        "Player.gravityModifier — gravity multiplier (read/write).",
      momentum: "Player.momentum — current momentum (read/write).",
      groundSpeed: "Player.groundSpeed — max ground move speed (read/write).",
      groundFriction: "Player.groundFriction — ground friction (read/write).",
      maxGroundAccel:
        "Player.maxGroundAccel — max ground acceleration (read/write).",
      airSpeed: "Player.airSpeed — max air move speed (read/write).",
      airFriction: "Player.airFriction — air friction (read/write).",
      maxAirAccel: "Player.maxAirAccel — max air acceleration (read/write).",
      standHeight: "Player.standHeight — full standing height (read/write).",
      isSliding: "Player.isSliding — true while sliding (read-only).",
      slideAngle: "Player.slideAngle — slide direction angle (read-only).",
      floorAngle:
        "Player.floorAngle — angle of the floor under the player (read-only).",
      curGroundType: "Player.curGroundType — current ground type (read-only).",
      isGrounded:
        "Player.isGrounded — true when the player is on the ground (read-only).",
      isWallRunning:
        "Player.isWallRunning — true while wall-running (read-only).",
      wallRunSide:
        "Player.wallRunSide — 0 none, 1 right wall, -1 left wall (read-only).",
      isWallClimbing:
        "Player.isWallClimbing — true while wall-climbing (read-only).",
      wallrunNormalAngle:
        "Player.wallrunNormalAngle — wall normal angle while wall-running (read-only).",
      is3rdPerson:
        "Player.is3rdPerson — true when the camera is in third person (read-only).",
      enter3rdPerson:
        "Player.enter3rdPerson() — switch the camera to third person.",
      exit3rdPerson:
        "Player.exit3rdPerson() — switch the camera back to first person.",
    },
  };

  defineProps(player, {
    angle: { get: () => P().angleDegrees, set: (v) => (P().angleDegrees = v) },
    lookAngle: { get: () => P().instVars.lookAngle },
    state: { get: () => P().instVars.state },
    jumpStrength: {
      get: () => P().instVars.jumpStrength,
      set: (v) => (P().instVars.jumpStrength = v),
    },
    gravityModifier: {
      get: () => P().instVars.levelEditorGravityModifier,
      set: (v) => (P().instVars.levelEditorGravityModifier = v),
    },
    isSliding: { get: () => P().instVars.isSliding },
    slideAngle: { get: () => P().instVars.slideAngle },
    floorAngle: { get: () => P().instVars.floorAngle },
    isGrounded: { get: () => !!runtime.callFunction("playerIsGrounded") },
    momentum: {
      get: () => P().instVars.momentum,
      set: (v) => (P().instVars.momentum = v),
    },
    groundSpeed: {
      get: () => P().instVars.groundSpeed,
      set: (v) => (P().instVars.groundSpeed = v),
    },
    groundFriction: {
      get: () => P().instVars.groundFriction,
      set: (v) => (P().instVars.groundFriction = v),
    },
    maxGroundAccel: {
      get: () => P().instVars.maxGroundAccel,
      set: (v) => (P().instVars.maxGroundAccel = v),
    },
    airSpeed: {
      get: () => P().instVars.airSpeed,
      set: (v) => (P().instVars.airSpeed = v),
    },
    airFriction: {
      get: () => P().instVars.airFriction,
      set: (v) => (P().instVars.airFriction = v),
    },
    maxAirAccel: {
      get: () => P().instVars.maxAirAccel,
      set: (v) => (P().instVars.maxAirAccel = v),
    },
    standHeight: {
      get: () => P().instVars.standHeight,
      set: (v) => (P().instVars.standHeight = v),
    },
    curGroundType: {
      get: () => P().instVars.curGroundType,
    },
    isWallRunning: {
      get: () => {
        const isWallRunning = P().instVars.isWallrunning;
        return !!isWallRunning && isWallRunning !== 99;
      },
    },
    wallRunSide: {
      get: () => {
        const isWallRunning = P().instVars.isWallrunning;
        return isWallRunning === 99 ? 0 : isWallRunning; // 0 = not wall running, 1 = right wall, -1 = left wall
      },
    },
    isWallClimbing: {
      get: () => P().instVars.isWallrunning === 99,
    },
    wallrunNormalAngle: {
      get: () => P().instVars.wallRunWallNormalAngle,
    },
    is3rdPerson: {
      get: () => !!runtime.callFunction("is3rdPerson"),
    },
  });

  // Position and velocity as live nested vectors — whole-object or per-axis writes.
  defineVector(player, "position", {
    x: { get: () => P().x, set: (v) => (P().x = v) },
    y: { get: () => P().y, set: (v) => (P().y = v) },
    z: { get: () => P().zElevation, set: (v) => (P().zElevation = v) },
  });
  defineVector(player, "velocity", {
    x: {
      get: () => P().behaviors.Movement.vectorX,
      set: (v) => (P().behaviors.Movement.vectorX = v),
    },
    y: {
      get: () => P().behaviors.Movement.vectorY,
      set: (v) => (P().behaviors.Movement.vectorY = v),
    },
    z: {
      get: () => P().instVars.vectorZ,
      set: (v) => (P().instVars.vectorZ = v),
    },
  });

  return player;
}
