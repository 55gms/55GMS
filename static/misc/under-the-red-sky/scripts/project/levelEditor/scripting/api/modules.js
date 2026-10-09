// api/modules.js — the runtime-bound host modules exposed to scripts: level,
// Clock, Tween (implementation). Each builder takes the runtime `deps` bundle
// and returns a live host object carrying its own __docs__ (the single source of
// truth for both runtime and autocomplete — gameApi.js derives the schema from
// these, so there's no separate declaration to keep in sync).
//
// To add a member: add it to the relevant builder and to its __docs__ — that's it.
// To add a whole module: write a buildX(deps) here (or a new file) and register
// it in gameApi.js's MODULE_BUILDERS.

import { wrapScriptCb, HANDLER_MAX_STEPS } from "./events.js";
import { toRGB, rgbToHsl, hslToRgb } from "./color.js";

// ── level ───────────────────────────────────────────────────────────────────
export function buildLevel({
  labelMap,
  levelMeta,
  allInstances,
  playerApi,
  wrap,
  eventBus,
  scheduler,
  runtime,
}) {
  labelMap = labelMap || new Map();
  levelMeta = levelMeta || {};
  const matchAll = (names) => {
    const flat = names.flat();
    if (flat.length === 0) return [];
    const buckets = flat.map((n) => labelMap.get(n) || []);
    if (buckets.some((b) => b.length === 0)) return [];
    const [first, ...rest] = buckets;
    const sets = rest.map((b) => new Set(b));
    return first.filter((inst) => sets.every((s) => s.has(inst)));
  };
  const level = {
    name: levelMeta.name ?? "",
    width: levelMeta.width ?? 0,
    height: levelMeta.height ?? 0,
    find: (...names) => {
      const m = matchAll(names);
      return m.length ? wrap(m[0]) : null;
    },
    findAll: (...names) => matchAll(names).map((i) => wrap(i)),
    triggerScatterShapeSequence: (triggerId) => {
      runtime.callFunction("triggerScatterShapeSequence", triggerId);
    },
    // Environment setters (set-only — see __docs__). setSkybox recreates the sky
    // and resets fog/sky to that skybox's defaults, so set it FIRST, then apply
    // any custom fog/sky color or density. Colors accept hex / {r,g,b} / {h,s,l}.
    setSkybox: (type) => {
      runtime.callFunction("setSkyboxType", type);
      if (type === "desert") {
        const instance = runtime.objects.sandDune.createInstance(
          "environmentHigher",
          levelMeta.width / 2,
          levelMeta.height / 2,
          false,
          "default",
        );
        instance.zElevation = -1000;
      }
    },
    setFogColor: (color) => {
      const c = toRGB(color);
      runtime.callFunction("setFogColorRgb", c.r, c.g, c.b);
    },
    setFogDensity: (density) =>
      runtime.callFunction("setFogDensity", Number(density) || 0),
    setSkyColor: (color) => {
      const c = toRGB(color);
      runtime.callFunction("setSkyColorRgb", c.r, c.g, c.b);
    },
    // Global/level events live here (no separate top-level on/off/emit).
    on: (event, cb) => eventBus.onGlobal(event, cb),
    off: (event, cb) => eventBus.offGlobal(event, cb),
    emit: (event, ...args) =>
      eventBus.dispatchGlobal(event, args, HANDLER_MAX_STEPS),
    __docs__: {
      name: "level.name — the level's name (string).",
      width: "level.width — level width in pixels (number).",
      height: "level.height — level height in pixels (number).",
      find: 'level.find(...labels) — first placed object carrying ALL the given labels, or null. e.g. level.find("door", "locked").',
      findAll:
        "level.findAll(...labels) — array of every placed object carrying ALL the given labels.",
      triggerScatterShapeSequence:
        "level.triggerScatterShapeSequence(triggerId) — trigger a scatter shape sequence (see the ScatterShapeSequence object).",
      objects: "level.objects — array of every placed object in the level.",
      player: "level.player — the player object (or null).",
      time: "level.time — seconds elapsed since the level started (game time).",
      on: 'level.on(event, handler) — run handler when a level event fires.\n"start" fires once on load; "tick" fires every frame (handler gets dt). Custom event names work too, fire them with level.emit(event, ...).',
      off: "level.off(event, handler) — remove a handler registered with level.on().",
      emit: "level.emit(event, ...args) — fire a (usually custom) level event; every level.on(event) handler runs with args.",
      setSkybox:
        "level.setSkybox(type) — set the skybox (a Skybox enum value, e.g. Skybox.Desert). NOTE: this recreates the sky and resets fog + sky color to the skybox's defaults, so call it before setFogColor/setSkyColor/setFogDensity.",
      setFogColor:
        'level.setFogColor(color) — set the fog color. color is any form: hex "#rrggbb", {r,g,b}, or {h,s,l} (0–1). Animate with Tween.color.',
      setFogDensity:
        "level.setFogDensity(density) — set the fog density (0 = none; ~0.1 default).",
      setSkyColor:
        "level.setSkyColor(color) — set the sky tint color (hex, {r,g,b}, or {h,s,l}, 0–1). Animate with Tween.color.",
    },
  };
  Object.defineProperty(level, "objects", {
    enumerable: true,
    get: () => (allInstances || []).map((i) => wrap(i)),
  });
  // level.player aliases the Player module (the custom player wrapper).
  Object.defineProperty(level, "player", {
    enumerable: true,
    get: () => playerApi,
  });
  Object.defineProperty(level, "time", {
    enumerable: true,
    get: () => scheduler.levelTime,
  });
  return level;
}

// ── Clock ─────────────────────────────────────────────────────────────────
export function buildClock({
  runtime,
  scheduler,
  getPaused,
  invoke,
  logError,
}) {
  runtime = runtime || {};
  const clock = {
    wait: (seconds) =>
      new Promise((resolve) =>
        scheduler.addTimer(seconds, () => resolve(null), false),
      ),
    timeout: (seconds, handler) =>
      scheduler.addTimer(
        seconds,
        wrapScriptCb(invoke, logError, handler),
        false,
      ),
    interval: (seconds, handler) =>
      scheduler.addTimer(
        seconds,
        wrapScriptCb(invoke, logError, handler),
        true,
      ),
    __docs__: {
      dt: "Clock.dt — game delta time for this frame, in seconds (scaled by time scale).",
      realDt:
        "Clock.realDt — real (wall-clock) delta time this frame, in seconds.",
      gameTime: "Clock.gameTime — total elapsed game time, in seconds.",
      wallTime: "Clock.wallTime — total elapsed real time, in seconds.",
      levelTime:
        "Clock.levelTime — seconds since the current level started (game time).",
      timeScale: "Clock.timeScale — the current game time scale (1 = normal).",
      paused: "Clock.paused — true when the game is paused.",
      wait: "Clock.wait(seconds) — await this to pause a handler for N seconds of game time. e.g. await Clock.wait(1).",
      timeout:
        "Clock.timeout(seconds, handler) — run handler once after N seconds. Returns { cancel() }.",
      interval:
        "Clock.interval(seconds, handler) — run handler every N seconds. Returns { cancel() }.",
    },
  };
  Object.defineProperties(clock, {
    dt: {
      enumerable: true,
      get: () => runtime.objects.player.getFirstInstance()?.dt ?? runtime.dt,
    },
    realDt: {
      enumerable: true,
      get: () => runtime.dtRaw,
    },
    gameTime: {
      enumerable: true,
      get: () => runtime.gameTime,
    },
    wallTime: {
      enumerable: true,
      get: () => runtime.wallTime,
    },
    levelTime: { enumerable: true, get: () => scheduler.levelTime },
    timeScale: {
      enumerable: true,
      get: () =>
        runtime.objects.player.getFirstInstance()?.timeScale ??
        runtime.timeScale ??
        1,
    },
    paused: {
      enumerable: true,
      get: () => runtime.globalVars.inputFocus !== "game",
    },
  });
  return clock;
}

// ── Tween ─────────────────────────────────────────────────────────────────
export function buildTween({ scheduler, invoke, logError }) {
  const easingOf = (o) =>
    typeof o.easing === "function" ? o.easing : undefined;
  return {
    run: (seconds, onUpdate, options) => {
      const o = options || {};
      return scheduler.addTween({
        duration: seconds,
        easing: easingOf(o),
        onUpdate: wrapScriptCb(invoke, logError, onUpdate),
        onComplete: wrapScriptCb(invoke, logError, o.onComplete),
      });
    },
    value: (from, to, seconds, onUpdate, options) => {
      const o = options || {};
      const cb = wrapScriptCb(invoke, logError, onUpdate);
      return scheduler.addTween({
        duration: seconds,
        easing: easingOf(o),
        onUpdate: cb ? (e) => cb(from + (to - from) * e) : undefined,
        onComplete: wrapScriptCb(invoke, logError, o.onComplete),
      });
    },
    // Like value(), but interpolates between two COLORS. from/to are any color
    // form (hex / {r,g,b} / {h,s,l}); onUpdate receives an {r,g,b} object (0–1)
    // you can hand straight to level.setFogColor etc. options.space "rgb"
    // (default) lerps channels; "hsl" interpolates hue/sat/lightness (hue takes
    // the shortest way around the wheel).
    color: (from, to, seconds, onUpdate, options) => {
      const o = options || {};
      const cb = wrapScriptCb(invoke, logError, onUpdate);
      const base = {
        duration: seconds,
        easing: easingOf(o),
        onComplete: wrapScriptCb(invoke, logError, o.onComplete),
      };
      if (o.space === "hsl") {
        const a = rgbToHsl(toRGB(from));
        const b = rgbToHsl(toRGB(to));
        let dh = b.h - a.h; // shortest path around the hue wheel
        if (dh > 0.5) dh -= 1;
        else if (dh < -0.5) dh += 1;
        return scheduler.addTween({
          ...base,
          onUpdate: cb
            ? (e) =>
                cb(
                  hslToRgb({
                    h: a.h + dh * e,
                    s: a.s + (b.s - a.s) * e,
                    l: a.l + (b.l - a.l) * e,
                  }),
                )
            : undefined,
        });
      }
      const a = toRGB(from);
      const b = toRGB(to);
      return scheduler.addTween({
        ...base,
        onUpdate: cb
          ? (e) =>
              cb({
                r: a.r + (b.r - a.r) * e,
                g: a.g + (b.g - a.g) * e,
                b: a.b + (b.b - a.b) * e,
              })
          : undefined,
      });
    },
    // obj arrives unwrapped (the raw facade); props is a plain object. Supports
    // one level of nesting (e.g. { position: { x: 100 }, angle: 90 }).
    to: (obj, props, seconds, options) => {
      const o = options || {};
      props = props || {};
      const start = {};
      for (const k of Object.keys(props)) {
        const target = props[k];
        if (target && typeof target === "object") {
          start[k] = {};
          for (const a of Object.keys(target))
            start[k][a] = (obj[k] || {})[a] ?? 0;
        } else {
          start[k] = obj[k] ?? 0;
        }
      }
      return scheduler.addTween({
        duration: seconds,
        easing: easingOf(o),
        onUpdate: (e) => {
          for (const k of Object.keys(props)) {
            const target = props[k];
            if (target && typeof target === "object") {
              const patch = {};
              for (const a of Object.keys(target))
                patch[a] = start[k][a] + (target[a] - start[k][a]) * e;
              obj[k] = patch;
            } else {
              obj[k] = start[k] + (target - start[k]) * e;
            }
          }
        },
        onComplete: wrapScriptCb(invoke, logError, o.onComplete),
      });
    },
    __docs__: {
      run: "Tween.run(seconds, onUpdate, options?) — onUpdate(t) every frame with eased t in [0,1]. options: { easing, onComplete }. Returns { cancel(), done }.",
      value:
        "Tween.value(from, to, seconds, onUpdate, options?) — onUpdate(value) interpolates from→to over time. Returns { cancel(), done }.",
      color:
        'Tween.color(from, to, seconds, onUpdate, options?) — interpolate between two colors (hex / {r,g,b} / {h,s,l}); onUpdate gets an {r,g,b} (0–1) for e.g. level.setFogColor. options.space: "rgb" (default) or "hsl". Returns { cancel(), done }.',
      to: "Tween.to(obj, props, seconds, options?) — animate obj's numeric props (nested ok, e.g. { position: { x: 100 }, angle: 90 }). Returns { cancel(), done }.",
    },
  };
}
