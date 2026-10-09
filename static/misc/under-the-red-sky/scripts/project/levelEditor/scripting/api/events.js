// api/events.js — the event + timing engine (implementation).
//
// EventBus   : global + per-object event registration and dispatch.
// Scheduler  : drives Clock waits/intervals + Tweens each frame.
// These are pure machinery — no API-surface declarations live here (see gameApi.js).

// Per-call step budget for handlers fired off the main run (events, timers, tweens).
export const HANDLER_MAX_STEPS = 200_000;

// Run one script handler with error isolation + async-rejection capture.
export function runHandler(invoke, logError, cb, args, maxSteps) {
  try {
    const r = invoke(cb, args, { maxSteps });
    if (r && typeof r.then === "function") r.catch((e) => logError(e));
  } catch (e) {
    logError(e);
  }
}

// Wrap a script callback as a plain JS function the scheduler can call directly.
export function wrapScriptCb(
  invoke,
  logError,
  cb,
  maxSteps = HANDLER_MAX_STEPS,
) {
  if (cb == null) return null;
  return (...args) => runHandler(invoke, logError, cb, args, maxSteps);
}

function removeFrom(arr, cb) {
  if (!arr) return;
  const i = arr.indexOf(cb);
  if (i >= 0) arr.splice(i, 1);
}

export class EventBus {
  // deps: { invoke(fn, args, opts), logError(e), wrap(instance) }
  constructor({ invoke, logError, wrap, objectMaxSteps = HANDLER_MAX_STEPS }) {
    this._invoke = invoke;
    this._logError = logError || (() => {});
    this._wrap = wrap || ((i) => i);
    this._objectMaxSteps = objectMaxSteps;
    this.globalHandlers = new Map(); // event -> cb[]
    this.objectHandlers = new WeakMap(); // instance -> Map<event, cb[]>
  }

  onGlobal(event, cb) {
    if (cb == null) return;
    let arr = this.globalHandlers.get(event);
    if (!arr) this.globalHandlers.set(event, (arr = []));
    arr.push(cb);
  }
  offGlobal(event, cb) {
    removeFrom(this.globalHandlers.get(event), cb);
  }
  hasGlobal(event) {
    const h = this.globalHandlers.get(event);
    return !!(h && h.length);
  }
  dispatchGlobal(event, args, maxSteps) {
    this._invokeAll(this.globalHandlers.get(event), args || [], maxSteps);
  }

  onObject(instance, event, cb) {
    if (cb == null) return;
    let map = this.objectHandlers.get(instance);
    if (!map) this.objectHandlers.set(instance, (map = new Map()));
    let arr = map.get(event);
    if (!arr) map.set(event, (arr = []));
    arr.push(cb);
  }
  offObject(instance, event, cb) {
    const map = this.objectHandlers.get(instance);
    if (map) removeFrom(map.get(event), cb);
  }
  // Fires handlers with (gameObject, ...extraArgs).
  dispatchObject(instance, event, extraArgs, maxSteps) {
    const map = this.objectHandlers.get(instance);
    if (!map) return;
    const handlers = map.get(event);
    if (!handlers || !handlers.length) return;
    const args = [this._wrap(instance), ...(extraArgs || [])];
    this._invokeAll(handlers, args, maxSteps ?? this._objectMaxSteps);
  }
  clearObject(instance) {
    this.objectHandlers.delete(instance);
  }
  clear() {
    this.globalHandlers.clear();
    this.objectHandlers = new WeakMap();
  }

  _invokeAll(handlers, args, maxSteps) {
    if (!handlers || !handlers.length) return;
    for (const cb of handlers.slice()) {
      runHandler(
        this._invoke,
        this._logError,
        cb,
        args,
        maxSteps ?? this._objectMaxSteps,
      );
    }
  }
}

// Callbacks here are PLAIN JS functions (script callbacks are pre-wrapped via
// wrapScriptCb), so the scheduler never touches the interpreter directly.
export class Scheduler {
  constructor({ logError } = {}) {
    this.timers = new Set();
    this.tweens = new Set();
    this.levelTime = 0;
    this._logError = logError || (() => {});
  }
  addTimer(intervalSec, onFire, repeat) {
    const t = {
      interval: Math.max(0, intervalSec || 0),
      elapsed: 0,
      onFire,
      repeat: !!repeat,
    };
    this.timers.add(t);
    return { cancel: () => this.timers.delete(t) };
  }
  addTween({ duration, onUpdate, onComplete, easing }) {
    let resolveDone;
    const done = new Promise((r) => (resolveDone = r));
    const tw = {
      duration: Math.max(0, duration || 0),
      elapsed: 0,
      onUpdate,
      onComplete,
      easing: typeof easing === "function" ? easing : (t) => t,
      _resolve: resolveDone,
    };
    this.tweens.add(tw);
    return {
      done,
      cancel: () => {
        if (this.tweens.delete(tw)) resolveDone(null);
      },
    };
  }
  advance(dt) {
    if (!(dt > 0)) return; // paused / no time elapsed
    this.levelTime += dt;
    for (const t of this.timers) {
      t.elapsed += dt;
      if (t.elapsed < t.interval) continue;
      this._safe(t.onFire);
      if (t.repeat) t.elapsed -= t.interval;
      else this.timers.delete(t);
    }
    for (const tw of this.tweens) {
      tw.elapsed += dt;
      const raw = tw.duration <= 0 ? 1 : Math.min(tw.elapsed / tw.duration, 1);
      let eased = raw;
      try {
        eased = tw.easing(raw);
      } catch (e) {
        this._logError(e);
      }
      this._safe(() => tw.onUpdate && tw.onUpdate(eased, raw));
      if (raw >= 1) {
        this.tweens.delete(tw);
        this._safe(() => tw.onComplete && tw.onComplete());
        tw._resolve(null);
      }
    }
  }
  _safe(fn) {
    try {
      fn();
    } catch (e) {
      this._logError(e);
    }
  }
  clear() {
    this.timers.clear();
    this.tweens.clear();
    this.levelTime = 0;
  }
}
