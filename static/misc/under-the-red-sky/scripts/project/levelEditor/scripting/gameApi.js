// gameApi.js — the game API assembler (declaration / wiring).
//
// This file is intentionally THIN: it declares WHAT the runtime exposes and wires
// the pieces together. The HOW lives in ./api/*:
//   api/events.js     — EventBus + Scheduler (event/timing engine)
//   api/gameObject.js — the per-instance GameObject facade + per-type registry
//   api/modules.js    — level, Clock, Tween
//   api/player.js     — Player (custom wrapper over the player instance)
//   api/camera.js     — Camera (read position/orientation, frustum test)
//   api/raycastApi.js — Raycast (wraps the triangle raycaster; named to avoid a
//                       module-name collision with the editor's raycast.js)
//   api/saves.js      — LevelSave / PackSave (in-memory key/value stores)
//   api/input.js      — Input (read/inject/gate the player's inputs)
//
// Adding a member to a module: edit that module's builder (and its __docs__).
// Adding a whole module: write a buildX(deps) and add it to buildGameApi below.
// The editor autocomplete schema is DERIVED from the same builders (buildApiSchema),
// so there is no separate declaration to maintain.

import { EventBus, Scheduler } from "./api/events.js";
import {
  makeGameObject,
  getEditorType,
  stashEditorType,
  objectApiRegistry,
  OBJECT_EVENTS,
  buildObjectSchema,
} from "./api/gameObject.js";
import { buildLevel, buildClock, buildTween } from "./api/modules.js";
import { buildPlayer } from "./api/player.js";
import { buildCamera } from "./api/camera.js";
import { buildRaycast } from "./api/raycastApi.js";
import { buildLevelSave, buildPackSave } from "./api/saves.js";
import { buildAudio } from "./api/audio.js";
import { buildInput } from "./api/input.js";
import { buildColorModule } from "./api/color.js";
import { buildCreateMaterial, materialSchema } from "./api/material.js";
import { Enums, buildEnumMembers } from "./c3script_enums.js";
import { getCustomMaterialsMap } from "../materials/materialsManager.js";
import { getLabelsManager } from "../labels/labelsManager.js";
import { getPresetColorEntries } from "../paletteColors.js";

// Re-export the pieces other modules import from here (scriptRuntime,
// instanceCreator, the editor dialog) so their import paths don't change.
export {
  EventBus,
  Scheduler,
  makeGameObject,
  getEditorType,
  stashEditorType,
  objectApiRegistry,
  OBJECT_EVENTS,
};

// Built-in global/level event names (custom names also work). Drives the
// level.on("<here>") autocomplete.
export const GLOBAL_EVENTS = ["start", "tick"];

/**
 * Build the host globals injected into a running level script.
 * @param {object} deps { labelMap, levelMeta, allInstances, getPlayer, eventBus,
 *   scheduler, wrap, runtime, getPaused, invoke, logError, levelSaveData, packSaveData }
 */
export function buildGameApi(deps) {
  // Player first, so level.player can alias the same object.
  const Player = buildPlayer(deps);
  const d = { ...deps, playerApi: Player };
  return {
    // Constant enums first (Sound, Vocal, generated selector enums) so a real
    // API module below always wins any accidental name clash.
    ...Enums.modules,
    // Dynamic custom-material enum (separate from the static built-in Material).
    CustomMaterials: buildCustomMaterials(),
    // Dynamic palette enum (ColorPalette.<Name> = "<hex>"), keyed by the editable
    // color names from the Color Palette Manager.
    ColorPalette: buildColorPalette(),
    level: buildLevel(d),
    Clock: buildClock(d),
    Tween: buildTween(d),
    Camera: buildCamera(d),
    Raycast: buildRaycast(d),
    LevelSave: buildLevelSave(d),
    PackSave: buildPackSave(d),
    Audio: buildAudio(d),
    Input: buildInput(d),
    Color: buildColorModule(),
    createMaterial: buildCreateMaterial(d),
    Player,
  };
}

// Dynamic enum of this project's custom materials (CustomMaterials.<Name> =
// "<id>"). Built fresh on every buildGameApi call (runtime + per schema build),
// so newly created custom materials appear without restarting. Reads the custom
// map from whichever source is live (editor manager OR the runtime registry set
// by levelLoader) so the enum is populated IN-GAME too — otherwise
// CustomMaterials.X resolves to undefined and createMaterial falls back to base.
// Kept separate from the static built-in `Material` enum, which stays unpolluted.
function buildCustomMaterials() {
  const values = [];
  const keys = [];
  for (const m of Object.values(getCustomMaterialsMap())) {
    const value = m?.value;
    if (value == null) continue;
    values.push(value);
    keys.push(m.label ?? value);
  }
  return buildEnumMembers("CustomMaterials", values, keys);
}

// Dynamic enum of this project's palette colors (ColorPalette.<Name> = "<hex>").
// Built fresh on every buildGameApi call so palette edits appear without a
// restart. Keys are the editable color names from the Color Palette Manager
// (normalized to identifiers, e.g. "UTRS Blue" -> UTRSBlue); values are hex
// strings usable anywhere the API accepts a color (sky/fog setters, Tween.color,
// Color.toRGB, …).
function buildColorPalette() {
  const entries = getPresetColorEntries();
  const values = entries.map((e) => e.value);
  const keys = entries.map((e) => e.name);
  return buildEnumMembers("ColorPalette", values, keys);
}

// ── Editor autocomplete schema (derived from the live modules) ──────────────
// Built with neutral stub deps so introspection (describeObject reads member
// names + __docs__) is safe; names + docs come from the same builders the runtime
// uses — one source, no drift.
function stubDeps() {
  const noop = () => {};
  const stubPlayer = {
    x: 0,
    y: 0,
    zElevation: 0,
    totalZElevation: 0,
    angleDegrees: 0,
    instVars: { lookAngle: 0, state: "", vectorZ: 0, realVX: 0, realVY: 0 },
    behaviors: { Movement: { vectorX: 0, vectorY: 0 } },
  };
  const stubCam = {
    getCameraPosition: () => [0, 0, 0],
    getLookVector: () => [1, 0, 0],
    getUpVector: () => [0, 0, 1],
    fieldOfView: Math.PI / 3,
  };
  const stubInputs = {
    addInputListener: () => null,
  };
  return {
    labelMap: new Map(),
    levelMeta: {},
    allInstances: [],
    levelSaveData: {},
    packSaveData: {},
    getPlayer: () => stubPlayer,
    wrap: () => null,
    eventBus: {
      onGlobal: noop,
      offGlobal: noop,
      dispatchGlobal: noop,
      onObject: noop,
      offObject: noop,
      dispatchObject: noop,
    },
    scheduler: {
      levelTime: 0,
      addTimer: () => ({ cancel: noop }),
      addTween: () => ({ cancel: noop, done: Promise.resolve() }),
    },
    runtime: {
      globalVars: { inputFocus: "game", curInputType: "KBM" },
      callFunction: () => null,
      objects: {
        // camera.js reads runtime.objects.camera directly (single-global inst).
        camera: stubCam,
        player: { getFirstInstance: () => stubPlayer },
        Inputs: { getFirstInstance: () => stubInputs },
        // No Inputs stub: input.js only wires itself up when a real plugin
        // instance exists, so the schema build stays inert.
      },
    },
    getPaused: () => false,
    invoke: noop,
    logError: noop,
    addPreTick: noop,
    addCleanup: noop,
  };
}

// Top-level module summaries (the "what modules exist" declaration). Includes the
// PURE stdlib modules the editor merges in (Math/Easing/console).
const MODULE_SUMMARIES = {
  CustomMaterials:
    'CustomMaterials — this project\'s custom materials (CustomMaterials.<Name> = "<id>"); pass the id to createMaterial() / obj.useCustomMaterial().',
  ColorPalette:
    'ColorPalette — this project\'s palette colors keyed by name (ColorPalette.<Name> = "#rrggbb"); pass anywhere a color is accepted (sky/fog, Tween.color, Color.toRGB).',
  level:
    "level — the current level (name, size, find/findAll/objects, player, on/off/emit, time).",
  Clock:
    "Clock — time and scheduling (dt, gameTime, levelTime, paused, wait, interval, timeout).",
  Tween: "Tween — tick-driven, callback-based animation (run, value, to).",
  Camera:
    "Camera — read the camera's position/orientation and test if a point is in view.",
  Raycast:
    "Raycast — cast a ray and get the first object hit (point, normal, distance).",
  Player:
    "Player — the player (position, velocity, state, actions, camera control).",
  LevelSave:
    "LevelSave — key/value store that survives a level restart but clears on level change.",
  PackSave:
    "PackSave — key/value store that persists across levels in a pack, clears on pack change.",
  Audio:
    "Audio — play sounds (playSound, playSoundAtPlayer, playSoundAtPosition, playerVocalize).",
  Input:
    "Input — the player's inputs (isDown/pressed/joystick reads, onPressed with preventDefault, hold/simulate injection, enable/disable, binding names).",
  Color:
    "Color — convert colors between hex / rgb / hsl (Color.toRGB, Color.toHex, Color.toHSL); channels 0–1.",
  createMaterial:
    "createMaterial(idOrMaterial?) — build a custom material (fork a Material.* preset, another material, or the default) to pass to obj.useCustomMaterial().",
  Math: "Math — numeric helpers (floor, clamp, lerp, sin, randomRange, …).",
  Easing: "Easing — easing curves for Tweens (easeInOut, bounceOut, …).",
  console: "console — structured logging (log, warn, error, table, group, …).",
};

export function buildApiSchema() {
  const api = buildGameApi(stubDeps());
  const objectSchema = buildObjectSchema();
  // Object-returning members resolve to the union object schema; level.on("…")
  // completes the global event names via enumValuesFor's special case.
  api.level.find = () => objectSchema;
  api.level.findAll = () => [objectSchema];
  // createMaterial(...) returns a material facade; expose its shape for autocomplete.
  api.createMaterial = () => materialSchema();
  api.level.__events__ = GLOBAL_EVENTS;
  // find/findAll take label names (string or array of strings, any arity). A
  // BARE ARRAY value means "applies to every arg index / array element" — see
  // enumValuesFor. on/off stay index-keyed objects so their completion is
  // unchanged. Built live from the current level's labels; omitted when empty.
  const lm = getLabelsManager();
  const labelNames =
    lm && lm.listLabels ? lm.listLabels().map((l) => l.name) : [];
  api.level.__argEnums__ = {
    on: { 0: GLOBAL_EVENTS },
    off: { 0: GLOBAL_EVENTS },
    setSkybox: { 0: Enums.values.Skybox },
    ...(labelNames.length ? { find: labelNames, findAll: labelNames } : {}),
  };
  // Enum docs are read here (not baked into MODULE_SUMMARIES at module load)
  // because runtime-populated selector enums like Tag don't exist yet when this
  // module is imported. Enum docs first, so an API module summary wins any
  // accidental name clash.
  api.__docs__ = { ...Enums.docs, ...MODULE_SUMMARIES };
  return api;
}
