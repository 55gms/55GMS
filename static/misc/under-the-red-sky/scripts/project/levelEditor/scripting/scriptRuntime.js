// ScriptRuntime — runs a level's global c3script during play.
//
// Lifecycle (driven by LevelLoader):
//   1. createLevelObjects builds labelMap + the full instance list
//   2. loadCurrentLevel calls scriptRuntime.load(source, labelMap, levelMeta, allInstances)
//        - installs stdlib modules (Math/Easing/console) + the game host API
//          (level [find/objects/player/on/off/emit], Clock, Tween)
//        - compiles + runs the script top level (registers handlers via on(...))
//        - dispatches "start", then drives the scheduler + "tick" every frame
//   3. dispose() tears everything down on reload / restart / leaving preview.
//
// This module is orchestration only: the language lives in c3script.js, the pure
// stdlib in stdlib.js, and the whole game API (events, level, Clock, Tween, and
// the inspector-driven GameObject facade) in gameApi.js.
//
// Firing events from gameplay: scriptRuntime.fireGlobal(event, ...args) or
// scriptRuntime.fireObject(instance, event, ...args). Pause state for Clock/Tween:
// scriptRuntime.setPaused(true/false).

import { Interpreter, LangError } from "./c3script.js";
import { STDLIB_MODULES } from "./stdlib.js";
import {
  EventBus,
  Scheduler,
  buildGameApi,
  makeGameObject,
  getEditorType,
} from "./gameApi.js";

// Per-call step budgets. "start" runs once so it can afford the default ceiling;
// "tick" runs every frame, so cap it lower to keep a runaway loop from hanging
// the frame (it surfaces as a "step limit exceeded" LangError instead).
const START_MAX_STEPS = 1_000_000;
const EVENT_MAX_STEPS = 500_000;
const SHORT_EVENT_MAX_STEPS = 200_000;

// Cap on distinct runtime errors captured per run, so a script that throws every
// tick can't grow the buffer unbounded (errors are deduped by message+line too).
const MAX_RUNTIME_ERRORS = 50;

// Temp-data key prefix for handing captured runtime errors back to the editor on
// return from play. Mirrors the ghost-data round-trip; consumed by the editor's
// runtimeErrorStore.js. Kept in sync there (string is duplicated to avoid pulling
// editor-only code into scriptRuntime, which also runs in the shipped game).
const SCRIPT_ERRORS_TEMP_PREFIX = "scriptErrors:";

// Empty an object in place (keep the same reference, since the save modules close
// over it).
function emptyInPlace(obj) {
  for (const k of Object.keys(obj)) delete obj[k];
}

export class ScriptRuntime {
  constructor(runtime) {
    this.runtime = runtime;
    this.program = null;
    this.eventBus = null;
    this.scheduler = null;
    this._tickListener = null;
    this._wrapCache = null; // Map<Construct instance, facade>
    // Module-registered hooks (see buildGameApi deps addPreTick/addCleanup):
    // pre-tick runs before the scheduler/tick dispatch every frame; cleanup
    // runs in dispose() so modules can restore global state they touched
    // (e.g. Input's plugin listener, holds, overrides, enable flags).
    this._preTickHooks = [];
    this._disposeHooks = [];
    // In-memory save stores. They outlive individual level loads (this object is
    // reused) and are emptied in place by load() on a level / pack change.
    this.levelSaveData = {};
    this.packSaveData = {};
    this._lastLevelId = undefined;
    this._lastPackId = undefined;
    // Runtime-error capture for the current run (handed back to the editor via
    // the temp-data bridge on return from play; see _recordError / _stashErrors).
    this._levelId = undefined;
    this._runtimeErrors = [];
    this._runtimeErrorKeys = new Set();
  }

  get paused() {
    return this.runtime.globalVars.inputFocus !== "game";
  }

  /**
   * Compile + run a level script, fire "start", then drive scheduler + "tick".
   * @param {string} source       c3script source (blank = no-op)
   * @param {Map<string, object[]>} labelMap  labelName -> Construct instances
   * @param {{name?:string,width?:number,height?:number}} levelMeta
   * @param {object[]} allInstances  every placed instance (for level.objects)
   */
  load(source, labelMap, levelMeta = {}, allInstances = []) {
    this.dispose();

    // LevelSave survives a restart/death (same level id) but clears on a level
    // CHANGE; PackSave clears when the pack changes. Tracked across loads since
    // load()/dispose() run on both restart and change.
    const { levelId, packId } = levelMeta;
    if (levelId !== this._lastLevelId) emptyInPlace(this.levelSaveData);
    if (packId !== this._lastPackId) emptyInPlace(this.packSaveData);
    this._lastLevelId = levelId;
    this._lastPackId = packId;

    // Reset runtime-error capture for this run and write an empty marker to temp
    // data (replace-on-run): a clean playthrough hands back an empty list so the
    // editor clears any stale persisted errors for this level on return.
    this._levelId = levelId;
    this._runtimeErrors = [];
    this._runtimeErrorKeys = new Set();
    this._stashErrors();

    if (!source || !String(source).trim()) return;

    this._wrapCache = new Map();
    this.scheduler = new Scheduler({ logError: (e) => this._logError(e) });
    this.eventBus = new EventBus({
      invoke: (fn, args, opts) => this.program.invoke(fn, args, opts),
      logError: (e) => this._logError(e),
      wrap: (inst) => this._wrap(inst),
      objectMaxSteps: SHORT_EVENT_MAX_STEPS,
    });

    const vm = new Interpreter({
      print: (msg) => console.log("[script]", msg),
      modules: STDLIB_MODULES,
    });
    vm.defineGlobals(
      buildGameApi({
        labelMap: labelMap || new Map(),
        levelMeta,
        allInstances: allInstances || [],
        getPlayer: () => this._getPlayer(),
        eventBus: this.eventBus,
        scheduler: this.scheduler,
        wrap: (inst) => this._wrap(inst),
        runtime: this.runtime,
        getPaused: () => this.paused,
        invoke: (fn, args, opts) => this.program.invoke(fn, args, opts),
        logError: (e) => this._logError(e),
        levelSaveData: this.levelSaveData,
        packSaveData: this.packSaveData,
        addPreTick: (fn) => this._preTickHooks.push(fn),
        addCleanup: (fn) => this._disposeHooks.push(fn),
      }),
    );

    try {
      this.program = vm.compile(String(source));
      this.program.run({ maxSteps: START_MAX_STEPS });
    } catch (e) {
      this._logError(e);
      this.program = null;
      this.eventBus = null;
      this.scheduler = null;
      return;
    }

    //this.eventBus.dispatchGlobal("start", [], START_MAX_STEPS);

    // Always tick: the scheduler (Clock waits/intervals, Tweens) needs it, and
    // tick handlers are dispatched here too. When paused, no game time elapses.
    this._tickListener = () => {
      // Pre-tick hooks run even while paused (dt=0) — e.g. Input's edge-buffer
      // swap must still clear stale pressed()/released() flags.
      for (const fn of this._preTickHooks) {
        try {
          fn();
        } catch (e) {
          this._logError(e);
        }
      }
      const dt = this.paused
        ? 0
        : (this.runtime.objects.player.getFirstInstance()?.dt ??
          this.runtime.dt);
      this.scheduler.advance(dt);
      this.eventBus.dispatchGlobal("tick", [dt], SHORT_EVENT_MAX_STEPS);
    };
    this.runtime.addEventListener("tick", this._tickListener);
  }

  clearLevelSave() {
    emptyInPlace(this.levelSaveData);
  }

  clearPackSave() {
    emptyInPlace(this.packSaveData);
  }

  /** Remove the tick listener and clear all per-level state. Safe to repeat. */
  dispose() {
    if (this._tickListener) {
      this.runtime.removeEventListener("tick", this._tickListener);
      this._tickListener = null;
    }
    if (this.eventBus) {
      this.eventBus.dispatchGlobal("unload", [], SHORT_EVENT_MAX_STEPS);
      this.eventBus.clear();
    }
    // Module cleanup after "unload" handlers, so scripts can still use the API
    // inside them; each hook is isolated so one failure can't skip the rest.
    for (const fn of this._disposeHooks) {
      try {
        fn();
      } catch (e) {
        this._logError(e);
      }
    }
    this._disposeHooks = [];
    this._preTickHooks = [];
    if (this.scheduler) this.scheduler.clear();
    this.program = null;
    this.eventBus = null;
    this.scheduler = null;
    this._wrapCache = null;
  }

  // ── Host-facing hooks (called by gameplay code) ─────────────────────────

  /** Fire a global event into the script (built-in or custom). */
  fireGlobal(event, ...args) {
    if (this.eventBus)
      this.eventBus.dispatchGlobal(event, args, EVENT_MAX_STEPS);
  }

  /** Fire an event at one instance's handlers (handler gets (gameObject, ...args)). */
  fireObject(instance, event, ...args) {
    if (this.eventBus) this.eventBus.dispatchObject(instance, event, args);
  }

  fireForPickedObjects(instanceName, event, ...args) {
    if (!this.eventBus) return;
    const instances = this.runtime.objects[instanceName]?.getPickedInstances();
    if (!instances || !instances.length) return;
    for (const inst of instances) {
      this.eventBus.dispatchObject(inst, event, args);
    }
  }

  // ── internals ───────────────────────────────────────────────────────────

  _getPlayer() {
    return this.runtime.objects.player.getFirstInstance() ?? null;
  }

  /** Wrap a Construct instance in a stable GameObject facade (cached). */
  _wrap(inst) {
    if (!inst) return null;
    if (!this._wrapCache) this._wrapCache = new Map();
    let facade = this._wrapCache.get(inst);
    if (!facade) {
      facade = makeGameObject(inst, {
        editorType: getEditorType(inst),
        eventBus: this.eventBus,
        runtime: this.runtime,
      });
      this._wrapCache.set(inst, facade);
    }
    return facade;
  }

  _logError(e) {
    console.error(e instanceof LangError ? "c3script: " + e.format() : e);
    this._recordError(e);
  }

  // Capture a runtime error for hand-back to the editor. Deduped by message+line
  // (tick handlers can throw every frame) and capped at MAX_RUNTIME_ERRORS.
  _recordError(e) {
    if (!this._levelId) return;
    if (this._runtimeErrors.length >= MAX_RUNTIME_ERRORS) return;
    const isLang = e instanceof LangError;
    const rec = {
      message: isLang ? e.format() : (e?.message ?? String(e)),
      line: e?.line ?? null,
      column: e?.column ?? null,
      phase: e?.phase ?? null,
      timestamp: Date.now(),
    };
    const key = rec.message + "@" + rec.line;
    if (this._runtimeErrorKeys.has(key)) return;
    this._runtimeErrorKeys.add(key);
    this._runtimeErrors.push(rec);
    this._stashErrors();
  }

  // Write the current run's error buffer into the temp-data bridge, keyed by
  // level id. The editor imports these on return from play (runtimeErrorStore.js).
  _stashErrors() {
    const ll = globalThis.levelLoader;
    if (!ll || !this._levelId || typeof ll.setTempData !== "function") return;
    ll.setTempData(SCRIPT_ERRORS_TEMP_PREFIX + this._levelId, [
      ...this._runtimeErrors,
    ]);
  }
}
