// labelVarTypes.js — the registry of value types a label variable can have.
//
// A label's schema is `label.vars: Array<VarDef>` with
//   VarDef = { key, type, default, options?, min?, max?, step?, precision? }
// Per-instance values are sparse overrides in
//   instanceMeta.labelVars[labelId][key]   (serialized as instanceData.labelVars)
// and the effective value is `override ?? varDef.default ?? type default`.
//
// Every type maps onto an existing inspector component (inspectorUI.js
// ComponentFactory) so the dictionary dialog (default editor) and the inspector
// (per-instance editor) render the same widgets object properties use. Values
// are stored in the component's native shape:
//   number/angle1d → number, text → string, checkbox → boolean,
//   color → "#rrggbb", position/angle3d/scale3d → {x,y,z}, scale2d → {width,height},
//   dropdown/material/tag/font/texture → the option's value string.
//
// Selector flavours reuse the option lists object properties already use
// (material/tag/font read `types.*.properties.options` through getters so the
// runtime and custom-material manager are ready by the time a picker renders).
//
// `button` and the override components are deliberately absent: they have no
// runtime value.

import { TEXTURES, textureLabel } from "../textureList.js";
import { getImageFromObject } from "../imageHelper.js";
import { types, GROUND_TYPES } from "../objectTypeDefinitions.js";
import { SKYBOX_OPTIONS } from "../defaultLevelData.js";
import { Enums } from "../scripting/c3script_enums.js";

const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
export function isValidVarKey(key) {
  return typeof key === "string" && IDENT_RE.test(key);
}
export function isValidIdentifier(name) {
  return isValidVarKey(name);
}

function num(v, fallback = 0) {
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}
function vec3(v, fallback = { x: 0, y: 0, z: 0 }) {
  if (!v || typeof v !== "object") return { ...fallback };
  return {
    x: num(v.x, fallback.x),
    y: num(v.y, fallback.y),
    z: num(v.z, fallback.z),
  };
}
function size2(v, fallback = { width: 1, height: 1 }) {
  if (!v || typeof v !== "object") return { ...fallback };
  return {
    width: num(v.width, fallback.width),
    height: num(v.height, fallback.height),
  };
}
function hex(v, fallback = "#ffffff") {
  if (typeof v !== "string") return fallback;
  const s = v.trim();
  return /^#[0-9a-fA-F]{6}$/.test(s) ? s.toLowerCase() : fallback;
}
function str(v, fallback = "") {
  return v === null || v === undefined ? fallback : String(v);
}

function numberConfig(def) {
  const cfg = {};
  if (typeof def.min === "number") cfg.min = def.min;
  if (typeof def.max === "number") cfg.max = def.max;
  if (typeof def.step === "number") cfg.step = def.step;
  if (typeof def.precision === "number") cfg.precision = def.precision;
  return cfg;
}

function optionsFromTypes(key) {
  const opts = types?.[key]?.properties?.options;
  return Array.isArray(opts) ? opts : [];
}

// Fixed lists that have no inspector propDef to borrow from.
const groundTypeOptions = Object.values(GROUND_TYPES).map((g) => ({
  value: g.value,
  label: g.label,
}));
const skyboxOptions = SKYBOX_OPTIONS.map((o) => ({ value: o.key, label: o.label }));
const emoteOptions = (Enums?.values?.Emote || []).map((e) => ({
  value: e,
  label: e.charAt(0).toUpperCase() + e.slice(1),
}));

// A selector-flavoured type whose options come from an existing inspector
// propDef (so the picker matches what the object inspector shows).
function fromInspector(label, key, columnsPerRow, fallback = "") {
  return {
    label,
    componentType: "selector",
    defaultValue: () => optionsFromTypes(key)[0]?.value ?? fallback,
    config: () => ({
      get options() {
        return optionsFromTypes(key);
      },
      columnsPerRow,
    }),
    normalize: (v, def) => str(v, str(def?.default, fallback)),
  };
}

// A selector-flavoured type over a fixed option list.
function fromList(label, options, columnsPerRow) {
  const values = options.map((o) => o.value);
  return {
    label,
    componentType: "selector",
    defaultValue: () => values[0] ?? "",
    config: () => ({ options, columnsPerRow }),
    normalize: (v, def) => {
      const s = str(v, "");
      if (values.includes(s)) return s;
      return values.includes(def?.default) ? def.default : values[0] ?? "";
    },
  };
}

const textureOptions = TEXTURES.map((t) => ({
  value: t,
  label: textureLabel(t),
  image: () => getImageFromObject(t),
}));

export const LABEL_VAR_TYPES = {
  number: {
    label: "Number",
    componentType: "number",
    defaultValue: () => 0,
    config: (def) => ({ ...numberConfig(def), dragSpeed: 0.1 }),
    normalize: (v, def) => num(v, num(def?.default, 0)),
  },
  text: {
    label: "Text",
    componentType: "text",
    defaultValue: () => "",
    config: () => ({}),
    normalize: (v, def) => str(v, str(def?.default, "")),
  },
  checkbox: {
    label: "Checkbox",
    componentType: "checkbox",
    defaultValue: () => false,
    config: () => ({ checkboxLabel: "" }),
    normalize: (v) => !!v,
  },
  color: {
    label: "Color",
    componentType: "color",
    defaultValue: () => "#ffffff",
    config: () => ({}),
    normalize: (v, def) => hex(v, hex(def?.default)),
  },
  position: {
    label: "3D Position",
    componentType: "position",
    defaultValue: () => ({ x: 0, y: 0, z: 0 }),
    config: () => ({ step: 1, precision: 2 }),
    normalize: (v, def) => vec3(v, vec3(def?.default)),
  },
  angle1d: {
    label: "Angle",
    componentType: "angle1d",
    defaultValue: () => 0,
    config: () => ({}),
    normalize: (v, def) => num(v, num(def?.default, 0)),
  },
  angle3d: {
    label: "3D Angle",
    componentType: "angle3d",
    defaultValue: () => ({ x: 0, y: 0, z: 0 }),
    config: () => ({ step: 1 }),
    normalize: (v, def) => vec3(v, vec3(def?.default)),
  },
  scale2d: {
    label: "2D Size",
    componentType: "scale2d",
    defaultValue: () => ({ width: 1, height: 1 }),
    config: () => ({}),
    normalize: (v, def) => size2(v, size2(def?.default)),
  },
  scale3d: {
    label: "3D Size",
    componentType: "scale3d",
    defaultValue: () => ({ x: 1, y: 1, z: 1 }),
    config: () => ({}),
    normalize: (v, def) =>
      vec3(v, vec3(def?.default, { x: 1, y: 1, z: 1 })),
  },
  dropdown: {
    label: "Dropdown",
    componentType: "selector",
    hasOptions: true,
    defaultValue: (def) => str(def?.options?.[0], ""),
    config: (def) => ({
      options: (def.options || []).map((o) => ({ value: o, label: o })),
      columnsPerRow: 1,
    }),
    normalize: (v, def) => {
      const opts = def?.options || [];
      const s = str(v, "");
      if (opts.includes(s)) return s;
      return opts.includes(def?.default) ? def.default : str(opts[0], "");
    },
  },
  material: {
    label: "Material",
    componentType: "selector",
    defaultValue: () => "default",
    config: () => ({
      get options() {
        return optionsFromTypes("material");
      },
      columnsPerRow: 2,
    }),
    normalize: (v, def) => str(v, str(def?.default, "default")),
  },
  tag: {
    label: "Tag",
    componentType: "selector",
    defaultValue: () => optionsFromTypes("tag")[0]?.value ?? "",
    config: () => ({
      get options() {
        return optionsFromTypes("tag");
      },
      columnsPerRow: 2,
    }),
    normalize: (v, def) => str(v, str(def?.default, "")),
  },
  font: {
    label: "Font",
    componentType: "selector",
    defaultValue: () => optionsFromTypes("fontFace")[0]?.value ?? "serif",
    config: () => ({
      get options() {
        return optionsFromTypes("fontFace");
      },
      columnsPerRow: 1,
    }),
    normalize: (v, def) => str(v, str(def?.default, "serif")),
  },
  sound: fromInspector("Sound", "sound", 2),
  shape: fromInspector("Shape", "shape", 3),
  animation: fromInspector("Character animation", "characterAnimation", 2),
  skin: fromInspector("Character skin", "characterSkin", 2),
  behavior: fromInspector("Character behavior", "characterBehavior", 1),
  emote: fromList("Emote", emoteOptions, 3),
  skybox: fromList("Skybox", skyboxOptions, 2),
  groundType: fromList("Ground type", groundTypeOptions, 1),
  texture: {
    label: "Texture",
    componentType: "selector",
    defaultValue: () => TEXTURES[0],
    config: () => ({
      options: textureOptions,
      columnsPerRow: 4,
      compactItems: true,
    }),
    normalize: (v, def) => {
      const s = str(v, "");
      if (TEXTURES.includes(s)) return s;
      return TEXTURES.includes(def?.default) ? def.default : TEXTURES[0];
    },
  },
};

export const LABEL_VAR_TYPE_IDS = Object.keys(LABEL_VAR_TYPES);

export function getVarType(type) {
  return LABEL_VAR_TYPES[type] || null;
}

/** Default value for a var def (its stored default, else the type default). */
export function varDefault(def) {
  const t = getVarType(def?.type);
  if (!t) return null;
  if (def.default !== undefined && def.default !== null)
    return t.normalize(def.default, { ...def, default: undefined });
  return t.defaultValue(def);
}

/** Coerce any value into the def's native shape. */
export function normalizeVarValue(def, value) {
  const t = getVarType(def?.type);
  if (!t) return value;
  return t.normalize(value, def);
}

/**
 * Drop malformed entries and fill in defaults so every consumer can rely on
 * `{ key, type, default }` being present. Duplicate keys keep the first.
 */
export function normalizeVarDefs(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const out = [];
  for (const d of raw) {
    if (!d || typeof d !== "object") continue;
    if (!isValidVarKey(d.key) || !getVarType(d.type)) continue;
    if (seen.has(d.key)) continue;
    seen.add(d.key);
    const def = { ...d };
    if (def.type === "dropdown") {
      def.options = Array.isArray(def.options)
        ? def.options.map((o) => str(o)).filter((o) => o !== "")
        : [];
    } else {
      delete def.options;
    }
    def.default = varDefault(def);
    out.push(def);
  }
  return out;
}

/** Build the inspector component config for a var def. */
export function varComponentConfig(def, extra = {}) {
  const t = getVarType(def.type);
  if (!t) return null;
  return {
    key: def.key,
    label: def.label || def.key,
    type: t.componentType,
    ...t.config(def),
    ...extra,
  };
}

/**
 * Effective value for one var on one instance: override if present, else the
 * def default.
 */
export function effectiveVarValue(def, overrides) {
  const o = overrides && overrides[def.key];
  if (o !== undefined) return normalizeVarValue(def, o);
  return varDefault(def);
}
