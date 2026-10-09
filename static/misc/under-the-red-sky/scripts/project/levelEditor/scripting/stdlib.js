// c3script standard library — namespaced PURE modules exposed to level scripts.
//
// "Pure" = no dependency on c3script.js and no game-runtime state, so the
// language core stays stdlib-agnostic and there is no import cycle. Runtime-bound
// APIs (Clock, Tween, level, events) live in gameApi.js instead.
//
// When registered via Interpreter.installModules / defineGlobals, each module
// becomes a lazy by-reference HostObject; its function members are auto-wrapped
// as NativeFns (args marshalled host-ward, correct here since members operate on
// plain numbers/strings/objects).
//
// Each module carries a `__docs__` map (member -> one-line doc). It is the SINGLE
// source of truth for runtime + editor autocomplete/hover (describeObject /
// docFor read it directly), so there is no second symbol list to drift.

export const MathModule = {
  PI: Math.PI,
  E: Math.E,
  abs: (x) => Math.abs(x),
  floor: (x) => Math.floor(x),
  ceil: (x) => Math.ceil(x),
  round: (x) => Math.round(x),
  sign: (x) => Math.sign(x),
  sqrt: (x) => Math.sqrt(x),
  pow: (a, b) => Math.pow(a, b),
  min: (...a) => Math.min(...a),
  max: (...a) => Math.max(...a),
  sin: (x) => Math.sin(x),
  cos: (x) => Math.cos(x),
  tan: (x) => Math.tan(x),
  atan2: (y, x) => Math.atan2(y, x),
  hypot: (...a) => Math.hypot(...a),
  random: () => Math.random(),
  randomRange: (lo, hi) => lo + Math.random() * (hi - lo),
  clamp: (x, lo, hi) => Math.min(Math.max(x, lo), hi),
  lerp: (a, b, t) => a + (b - a) * t,
  angleLerp: (a, b, t) => {
    const delta = ((b - a + 180) % 360) - 180;
    return a + delta * t;
  },
  // Degrees <-> radians (the engine's angle props are in degrees).
  rad: (deg) => (deg * Math.PI) / 180,
  deg: (rad) => (rad * 180) / Math.PI,
  __docs__: {
    PI: "Math.PI — ratio of a circle's circumference to its diameter (~3.14159).",
    E: "Math.E — Euler's number (~2.71828).",
    abs: "Math.abs(x) — absolute value of x.",
    floor: "Math.floor(x) — largest integer <= x.",
    ceil: "Math.ceil(x) — smallest integer >= x.",
    round: "Math.round(x) — x rounded to the nearest integer.",
    sign: "Math.sign(x) — -1, 0, or 1 matching the sign of x.",
    sqrt: "Math.sqrt(x) — square root of x.",
    pow: "Math.pow(a, b) — a raised to the power b.",
    min: "Math.min(...values) — the smallest of the given numbers.",
    max: "Math.max(...values) — the largest of the given numbers.",
    sin: "Math.sin(radians) — sine of an angle in radians.",
    cos: "Math.cos(radians) — cosine of an angle in radians.",
    tan: "Math.tan(radians) — tangent of an angle in radians.",
    atan2: "Math.atan2(y, x) — angle (radians) of the vector (x, y).",
    hypot:
      "Math.hypot(...values) — sqrt of the sum of squares (vector length).",
    random: "Math.random() — a random number in [0, 1).",
    randomRange: "Math.randomRange(lo, hi) — a random number in [lo, hi).",
    clamp: "Math.clamp(x, lo, hi) — constrain x to the range [lo, hi].",
    lerp: "Math.lerp(a, b, t) — linear interpolation from a to b; t in [0, 1].",
    rad: "Math.rad(degrees) — convert degrees to radians.",
    deg: "Math.deg(radians) — convert radians to degrees.",
  },
};

// Easing curves: each maps progress t in [0, 1] to an eased value in [0, 1].
// Pass one to a Tween (Tween.run(..., { easing: Easing.easeInOut })) or use with
// Math.lerp directly: Math.lerp(a, b, Easing.easeOut(t)).
export const EasingModule = {
  linear: (t) => t,
  easeIn: (t) => t * t,
  easeOut: (t) => t * (2 - t),
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => 1 + --t * t * t,
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : 1 + (t - 1) * (2 * (t - 1)) * (2 * (t - 1)),
  smoothstep: (t) => t * t * (3 - 2 * t),
  bounceOut: (t) => {
    const n = 7.5625,
      d = 2.75;
    if (t < 1 / d) return n * t * t;
    if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
    if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
    return n * (t -= 2.625 / d) * t + 0.984375;
  },
  __docs__: {
    linear: "Easing.linear(t) — no easing; returns t unchanged.",
    easeIn: "Easing.easeIn(t) — quadratic ease-in (slow start).",
    easeOut: "Easing.easeOut(t) — quadratic ease-out (slow end).",
    easeInOut: "Easing.easeInOut(t) — quadratic ease-in-out.",
    easeInCubic: "Easing.easeInCubic(t) — cubic ease-in.",
    easeOutCubic: "Easing.easeOutCubic(t) — cubic ease-out.",
    easeInOutCubic: "Easing.easeInOutCubic(t) — cubic ease-in-out.",
    smoothstep: "Easing.smoothstep(t) — Hermite smoothstep easing.",
    bounceOut: "Easing.bounceOut(t) — bouncing ease-out.",
  },
};

// console — structured logging, mirroring the browser console (prefixed so
// script output is easy to spot). Pass plain values; objects/arrays come across
// as real JS objects, so console.table works as expected.
const TAG = "[script]";
export const ConsoleModule = {
  log: (...a) => console.log(TAG, ...a),
  info: (...a) => console.info(TAG, ...a),
  warn: (...a) => console.warn(TAG, ...a),
  error: (...a) => console.error(TAG, ...a),
  debug: (...a) => console.debug(TAG, ...a),
  table: (data, columns) =>
    columns == null ? console.table(data) : console.table(data, columns),
  group: (...a) => console.group(TAG, ...a),
  groupEnd: () => console.groupEnd(),
  dir: (value) => console.dir(value),
  count: (label) => console.count(label == null ? TAG : label),
  time: (label) => console.time(label == null ? TAG : label),
  timeEnd: (label) => console.timeEnd(label == null ? TAG : label),
  assert: (cond, ...a) => console.assert(cond, TAG, ...a),
  __docs__: {
    log: "console.log(...values) — log values to the browser console.",
    info: "console.info(...values) — log at info level.",
    warn: "console.warn(...values) — log a warning.",
    error: "console.error(...values) — log an error.",
    debug: "console.debug(...values) — log at debug level.",
    table: "console.table(data, columns?) — render an array/object as a table.",
    group: "console.group(...label) — start a collapsible log group.",
    groupEnd: "console.groupEnd() — end the current log group.",
    dir: "console.dir(value) — log an inspectable view of a value.",
    count: "console.count(label?) — count how many times this line ran.",
    time: "console.time(label?) — start a named timer.",
    timeEnd:
      "console.timeEnd(label?) — stop a named timer and log the elapsed time.",
    assert:
      "console.assert(condition, ...values) — log only if condition is falsy.",
  },
};

// The PURE module set a host installs (e.g. Interpreter({ modules: STDLIB_MODULES })).
// Runtime-bound modules (Clock, Tween, level, events) are added separately by
// the script runtime via gameApi.js.
export const STDLIB_MODULES = {
  Math: MathModule,
  Easing: EasingModule,
  console: ConsoleModule,
};
