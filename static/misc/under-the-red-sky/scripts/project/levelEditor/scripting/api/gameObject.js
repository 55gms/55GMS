// api/gameObject.js — the per-instance GameObject facade (implementation).
//
// A facade's scripting API is its inspector properties (transforms exposed as
// nested objects) plus core members, plus any per-type extras from
// objectApiRegistry. Instances without an inspector definition (e.g. the player)
// get basic world accessors.
//
// Own-property constraint: the c3script host bridge (hostGet, Object.hasOwn)
// reads OWN properties only — every facade member is an own accessor/function.

import { ObjectTypeDefinitions } from "../../objectTypeDefinitions.js";
import {
  applyPropertyToInstance,
  applyMaterialDataToInstance,
} from "../../levelLoader/instanceCreator.js";
import { Enums } from "../c3script_enums.js";
import { toRGB as colorToRgb } from "./color.js";
import { getLabelData } from "./labelStore.js";
import {
  effectiveVarValue,
  normalizeVarValue,
  normalizeVarDefs,
  isValidIdentifier,
} from "../../labels/labelVarTypes.js";
import { getLabelsManager } from "../../labels/labelsManager.js";

// Built-in object events. Custom names work too (emit/on accept any string);
// these only seed autocomplete.
export const OBJECT_EVENTS = ["destroyed"];

// ── Editor-type stash (instance -> editor object-type, set by instanceCreator) ──
const editorTypeOf = new WeakMap();
export function stashEditorType(instance, editorType) {
  if (instance) editorTypeOf.set(instance, editorType);
}
export function getEditorType(instance) {
  return instance ? editorTypeOf.get(instance) : undefined;
}

// facade -> Construct instance, so APIs like Raycast can resolve a script's game
// object back to the underlying instance.
const instanceOfFacade = new WeakMap();
export function instanceOf(facade) {
  return facade ? instanceOfFacade.get(facade) : undefined;
}

// ── Per-type API override registry ──────────────────────────────────────────
// Add custom events / values / methods for a specific editor object-type here.
// A `props` entry may omit get OR set to inherit that side from the inspector.
//   { events: [...],
//     props:   { name: { get(self, instance, ctx), set(self, instance, v, ctx) } },
//     methods: { name(self, instance, ctx, ...args) {} },
//     extend(facade, instance, ctx) {} }   // ctx = { eventBus, runtime }; runs last
export const objectApiRegistry = {
  levelEditorDoor: {
    events: ["opened", "closed"],
    methods: {
      // direction defaults to 1.
      open: (self, instance, ctx, direction = 1) => {
        ctx.runtime.callFunction("c3Script_openDoor", instance.uid, direction);
      },
      close: (self, instance, ctx) => {
        ctx.runtime.callFunction("c3Script_closeDoor", instance.uid);
      },
    },
  },
  pressurePlate1: {
    events: ["pressed", "released"],
    methods: {
      // direction defaults to 1.
      press: (self, instance, ctx, direction = 1) => {
        ctx.runtime.callFunction("c3Script_pressPressurePlate", instance.uid);
      },
      release: (self, instance, ctx) => {
        ctx.runtime.callFunction("c3Script_releasePressurePlate", instance.uid);
      },
    },
  },
  levelEditorTrigger: {
    events: ["entered", "exited"],
  },
  levelEditorSoundSource: {
    methods: {
      playSound: (self, instance, ctx, sound, volume, loop) => {
        sound = sound ?? instance.instVars.soundName ?? "";
        volume = volume ?? instance.instVars.volume ?? 0;
        loop = loop ?? instance.instVars.loopSound ?? false;
        ctx.runtime.callFunction(
          "c3Script_soundSourcePlaySound",
          instance.uid,
          sound,
          volume,
          loop,
        );
      },
      stopSound: (self, instance, ctx) => {
        ctx.runtime.callFunction("c3Script_soundSourceStopSound", instance.uid);
      },
    },
  },
  // Material-bearing shapes share useCustomMaterial (see shapeMaterialApi below).
  GenericShape: shapeMaterialApi(),
  GenericScatterShape: shapeMaterialApi(),
  // Character Mannequin — play emotes by name (the ES side handles blend/loop).
  levelEditorCharacter: {
    methods: {
      // Play an emote; name is validated against the Emote enum.
      emote: (self, instance, ctx, name) => {
        if (!Enums.values.Emote.includes(name)) {
          console.warn(`[script] emote: unknown emote "${name}"`);
          return;
        }
        ctx.runtime.callFunction("c3Script_characterEmote", instance.uid, name);
      },
      // Stop/clear: return the mannequin to its base looping animation.
      stopEmote: (self, instance, ctx) => {
        const base = instance.instVars?.animation || "utrs_idle_120";
        ctx.runtime.callFunction(
          "setAnimationFunction",
          instance.uid,
          base,
          0.1,
        );
      },
    },
    docs: {
      emote:
        "obj.emote(name) — play an emote on this mannequin, e.g. obj.emote(Emote.wave). Names: wave, point, sit, warmup, drama, like, salute, joke.",
      stopEmote:
        "obj.stopEmote() — stop the current emote and return the mannequin to its base animation.",
    },
    __argEnums__: { emote: { 0: Enums.values.Emote } },
  },
};

// Apply a custom Material (from createMaterial()) to a shape instance. Shared by
// the two shape editor types; the material's __data is read off the by-reference
// facade and applied through the same path level-load uses.
function useCustomMaterial(self, instance, ctx, material) {
  const data = material && material.__data;
  if (!data) {
    console.warn(
      "[script] useCustomMaterial: pass a material from createMaterial()",
    );
    return;
  }
  applyMaterialDataToInstance(ctx.runtime, instance, data);
}
function shapeMaterialApi() {
  return {
    methods: { useCustomMaterial },
    docs: {
      useCustomMaterial:
        "obj.useCustomMaterial(material) — apply a custom material built with createMaterial() to this shape.",
    },
  };
}
export function getTypeApi(editorType) {
  return (editorType && objectApiRegistry[editorType]) || {};
}
export function objectEventsFor(editorType) {
  const extra = getTypeApi(editorType).events;
  return extra && extra.length ? [...OBJECT_EVENTS, ...extra] : OBJECT_EVENTS;
}

// ── Property mapping rules (shared by the facade + the schema) ──────────────
const STRUCTURED_TYPES = new Set(["position", "angle3d", "scale2d", "scale3d"]);
const HEAVY_KEYS = new Set([
  "sound",
  "loopSound",
  "volume",
  "secretType",
  "isPressed",
]); // TODO define which props should be read-only in the script runtime (e.g. material, color, etc.) and which should be writable. For now, we just mark these two as read-only to prevent accidental changes that could break the game.
const PROP_ALIASES = { size3D: "size", size2D: "size" };

// ── Scripting value overrides ───────────────────────────────────────────────
// A property's inspector form (what getValue/onChange speak) isn't always the
// nicest form for scripts. An override adapts the value at the script boundary:
//   toScript(value) — transform getValue()'s output before a script READS it.
//   toHost(value)   — transform a script-assigned value before it's WRITTEN
//                     (i.e. before applyPropertyToInstance / onChange sees it).
// Both hooks are optional. Look up by property key first (most specific), then by
// type. To add one, drop an entry in byKey/byType — no other code changes needed.
//
// Example below: color props store hex, but scripts read/write rgb {r,g,b} 0–1.
// (No toHost needed for color: onChange already coerces any color form.)
const PROP_OVERRIDES = {
  byKey: {},
  byType: {
    color: { toScript: (v) => colorToRgb(v) },
  },
};

function propOverride(propDef) {
  return (
    PROP_OVERRIDES.byKey[propDef.key] ||
    PROP_OVERRIDES.byType[propDef.type] ||
    null
  );
}

function scriptName(propDef) {
  return PROP_ALIASES[propDef.key] || propDef.key;
}
function axesForType(type) {
  return type === "scale2d" ? ["width", "height"] : ["x", "y", "z"];
}

function makeSubFacade(instance, def, propDef, runtime) {
  const key = propDef.key;
  const current = def.getValue(instance, key) || {};
  const sub = {};
  for (const axis of Object.keys(current)) {
    Object.defineProperty(sub, axis, {
      enumerable: true,
      configurable: true,
      get: () => {
        const v = def.getValue(instance, key);
        return v ? v[axis] : null;
      },
      // Apply through the level-loader helper (runtime overrides + game ctx),
      // keyed by originalKey since that is how typeOverrides/types are indexed.
      set: (val) =>
        applyPropertyToInstance(runtime, instance, {
          key: propDef.originalKey,
          value: { [axis]: val },
        }),
    });
  }
  return sub;
}

function defineInspectorMember(facade, instance, def, propDef, runtime) {
  if (propDef.type === "button") return; // editor-only action
  const key = propDef.key;
  const name = scriptName(propDef);
  const readOnly = HEAVY_KEYS.has(key);
  const override = propOverride(propDef);
  const baseGet = STRUCTURED_TYPES.has(propDef.type)
    ? () => makeSubFacade(instance, def, propDef, runtime)
    : () => def.getValue(instance, key);
  const getter = override?.toScript
    ? () => override.toScript(baseGet())
    : baseGet;
  const setter = readOnly
    ? () => console.warn(`[script] '${name}' is read-only`)
    : (v) =>
        applyPropertyToInstance(runtime, instance, {
          key: propDef.originalKey,
          value: override?.toHost ? override.toHost(v) : v,
        });
  Object.defineProperty(facade, name, {
    enumerable: true,
    configurable: true,
    get: getter,
    set: setter,
  });
}

// Basic world accessors for instances WITHOUT an inspector definition (player).// also give access to some of the player instance vars
function defineBasicMembers(facade, instance) {
  const direct = {
    x: "x",
    y: "y",
    z: "zElevation",
    angle: "angleDegrees",
    width: "width",
    height: "height",
    opacity: "opacity",
  };
  for (const [name, prop] of Object.entries(direct)) {
    Object.defineProperty(facade, name, {
      enumerable: true,
      configurable: true,
      get: () => instance[prop],
      set: (v) => {
        instance[prop] = v;
      },
    });
  }
  Object.defineProperty(facade, "visible", {
    enumerable: true,
    configurable: true,
    get: () => instance.isVisible,
    set: (v) => {
      instance.isVisible = v;
    },
  });
}

function defineCoreMembers(facade, instance, eventBus) {
  Object.defineProperty(facade, "uid", {
    enumerable: true,
    configurable: true,
    get: () => instance.uid,
  });
  facade.destroy = () => {
    if (eventBus) eventBus.dispatchObject(instance, "destroyed");
    instance.destroy();
    if (eventBus) eventBus.clearObject(instance);
  };
  facade.on = (event, cb) => {
    if (eventBus) eventBus.onObject(instance, event, cb);
  };
  facade.off = (event, cb) => {
    if (eventBus) eventBus.offObject(instance, event, cb);
  };
  facade.emit = (event, ...args) => {
    if (eventBus) eventBus.dispatchObject(instance, event, args);
  };
}

function applyTypeApi(facade, instance, editorType, ctx) {
  const entry = getTypeApi(editorType);
  if (entry.props) {
    for (const [name, d] of Object.entries(entry.props)) {
      // Preserve an inherited get/set (e.g. the inspector's) when the override
      // only supplies one side — so a type can override just the setter.
      const prev = Object.getOwnPropertyDescriptor(facade, name);
      Object.defineProperty(facade, name, {
        enumerable: true,
        configurable: true,
        get: d.get ? () => d.get(facade, instance, ctx) : prev && prev.get,
        set: d.set ? (v) => d.set(facade, instance, v, ctx) : prev && prev.set,
      });
    }
  }
  if (entry.methods) {
    for (const [name, fn] of Object.entries(entry.methods)) {
      facade[name] = (...args) => fn(facade, instance, ctx, ...args);
    }
  }
  if (entry.extend) entry.extend(facade, instance, ctx);
}

// ── Label variables: obj.labels[labelName][varKey] ─────────────────────────
// `labels` is a dedicated namespace (so label names can never collide with
// object members). Each label the instance carries becomes an own accessor on
// it returning a stable sub-facade (cached per instance+label) whose own
// accessors read the per-instance override (else the var's default) and write
// the override in the runtime label store. Pure data: no C3 side effects.
const labelFacadeCache = new WeakMap(); // instance -> Map(labelId -> sub)

function makeLabelSubFacade(instance, label, data) {
  let byLabel = labelFacadeCache.get(instance);
  if (!byLabel) {
    byLabel = new Map();
    labelFacadeCache.set(instance, byLabel);
  }
  let sub = byLabel.get(label.id);
  if (sub) return sub;
  sub = {};
  for (const def of label.vars) {
    Object.defineProperty(sub, def.key, {
      enumerable: true,
      configurable: true,
      get: () => effectiveVarValue(def, data.overrides[label.id]),
      set: (v) => {
        const bucket = data.overrides[label.id] || (data.overrides[label.id] = {});
        bucket[def.key] = normalizeVarValue(def, v);
      },
    });
  }
  byLabel.set(label.id, sub);
  return sub;
}

function defineLabelMembers(facade, instance) {
  const labels = {};
  const data = getLabelData(instance);
  if (data) {
    for (const label of data.labels) {
      if (!label.vars || label.vars.length === 0) continue;
      Object.defineProperty(labels, label.name, {
        enumerable: true,
        configurable: true,
        get: () => makeLabelSubFacade(instance, label, data),
        set: () =>
          console.warn(
            `[script] labels.${label.name} is a label; set its variables instead`,
          ),
      });
    }
  }
  Object.defineProperty(facade, "labels", {
    enumerable: true,
    configurable: true,
    get: () => labels,
  });
}

/**
 * Build a stable facade over a live Construct instance. With an inspector
 * definition its API is the inspector properties; without one (e.g. player) it
 * gets basic world accessors. Core members and per-type extras are added on top.
 */
export function makeGameObject(
  instance,
  { editorType, eventBus, runtime } = {},
) {
  const facade = {};
  const def = editorType ? ObjectTypeDefinitions[editorType] : null;
  if (def) {
    for (const propDef of def.properties)
      defineInspectorMember(facade, instance, def, propDef, runtime);
  } else {
    defineBasicMembers(facade, instance);
  }
  defineCoreMembers(facade, instance, eventBus); // core wins on name collision
  applyTypeApi(facade, instance, editorType, { eventBus, runtime });
  defineLabelMembers(facade, instance); // obj.labels namespace
  instanceOfFacade.set(facade, instance);
  return facade;
}

// ── Editor schema for the object facade (derived from the SAME rules) ───────
const OBJECT_DOCS = {
  uid: "uid — the object's unique id (read-only).",
  destroy:
    'destroy() — remove this object from the level (fires its "destroyed" event).',
  on: 'on(event, handler) — run handler when an event fires on this object, e.g. obj.on("destroyed", o => {…}). Custom events work too.',
  off: "off(event, handler) — remove a handler registered with on().",
  emit: "emit(event, ...args) — fire a (usually custom) event on this object; handlers run with (obj, ...args).",
  labels:
    "labels — this object's label variables, by label name: obj.labels.<label>.<var> (read/write, runtime only).",
};

function scalarPlaceholder(type) {
  if (type === "checkbox") return false;
  if (type === "number" || type === "angle1d") return 0;
  return "";
}

// One member schema covering every scriptable member across all object types
// (labels are untyped, so find/findAll/objects/player return this union).
export function buildObjectSchema() {
  const obj = {};
  const docs = {};
  const events = new Set(OBJECT_EVENTS);
  const argEnums = {};
  for (const def of Object.values(ObjectTypeDefinitions)) {
    for (const propDef of def.properties) {
      if (propDef.type === "button") continue;
      const name = scriptName(propDef);
      if (name in obj) continue;
      if (STRUCTURED_TYPES.has(propDef.type)) {
        const axisObj = {};
        for (const a of axesForType(propDef.type)) axisObj[a] = 0;
        obj[name] = axisObj;
      } else {
        obj[name] = scalarPlaceholder(propDef.type);
      }
      const ro = HEAVY_KEYS.has(propDef.key) ? " (read-only)" : "";
      docs[name] = `${name} — ${propDef.label}${ro}.`;
    }
  }
  for (const [type, entry] of Object.entries(objectApiRegistry)) {
    if (entry.events) for (const e of entry.events) events.add(e);
    if (entry.methods)
      for (const m of Object.keys(entry.methods)) {
        if (!(m in obj)) obj[m] = () => {};
        docs[m] =
          (entry.docs && entry.docs[m]) ||
          docs[m] ||
          `${m}() — ${type} method.`;
      }
    if (entry.__argEnums__)
      for (const [m, byArg] of Object.entries(entry.__argEnums__))
        if (!(m in argEnums)) argEnums[m] = byArg;
    if (entry.props)
      for (const p of Object.keys(entry.props)) {
        if (!(p in obj)) obj[p] = 0;
        docs[p] = docs[p] || `${p} — ${type} value.`;
      }
  }
  for (const k of [
    "x",
    "y",
    "z",
    "angle",
    "width",
    "height",
    "opacity",
    "visible",
  ])
    if (!(k in obj)) obj[k] = 0;
  Object.assign(obj, {
    uid: 0,
    destroy: () => {},
    on: (event, handler) => {},
    off: (event, handler) => {},
    emit: (event, ...args) => {},
  });
  Object.assign(docs, OBJECT_DOCS);
  // Label variables of the open level: obj.labels.<label>.<var>. Only labels
  // that define a schema show up.
  const labelsSchema = {};
  const labelsDocs = {};
  for (const label of currentLabelsWithVars()) {
    const sub = {};
    const subDocs = {};
    for (const def of label.vars) {
      sub[def.key] = varPlaceholder(def.type);
      subDocs[def.key] =
        `labels.${label.name}.${def.key} — label variable (${def.type}); per-object value, default ${JSON.stringify(def.default)}.`;
    }
    sub.__docs__ = subDocs;
    labelsSchema[label.name] = sub;
    labelsDocs[label.name] =
      `labels.${label.name} — variables of the "${label.name}" label: ${label.vars.map((v) => v.key).join(", ")}.`;
  }
  labelsSchema.__docs__ = labelsDocs;
  obj.labels = labelsSchema;
  obj.__docs__ = docs;
  obj.__events__ = [...events];
  obj.__argEnums__ = argEnums;
  return obj;
}

// Labels of the currently open level that define variables (editor only; the
// runtime never builds the schema). Names must be identifiers to be dot-
// accessible; others are still reachable as obj["my label"].
export function currentLabelsWithVars() {
  const lm = getLabelsManager?.();
  if (!lm || !lm.listLabels) return [];
  const out = [];
  for (const l of lm.listLabels()) {
    const vars = normalizeVarDefs(l.vars);
    if (vars.length === 0) continue;
    out.push({ id: l.id, name: l.name, vars, isIdentifier: isValidIdentifier(l.name) });
  }
  return out;
}

function varPlaceholder(type) {
  switch (type) {
    case "number":
    case "angle1d":
      return 0;
    case "checkbox":
      return false;
    case "position":
    case "angle3d":
    case "scale3d":
      return { x: 0, y: 0, z: 0 };
    case "scale2d":
      return { width: 0, height: 0 };
    default:
      return "";
  }
}
