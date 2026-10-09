// enums.js — constant value sets ("enums") exposed to level scripts.
//
// Pure data, no runtime/game-state dependency (like stdlib.js). Each enum maps a
// readable, dot-accessible KEY to the EXACT string the engine expects, so scripts
// can write
//   Audio.playSound(Sound.boing)   /   shape.material = Material.Concrete
// instead of a raw, typo-prone string literal. Member keys are normalized to valid
// identifiers (from the human label where available); the value is left untouched.
//
// Some enums are hand-written (MANUAL_DEFS), others are generated from the
// inspector "selector" property descriptors (every selector is a fixed value
// set). Both are just { name, docs, values } entries fed to prepareEnums().
//
// Data-driven: every enum is one def ({ name, docs, values }) from
// buildEnumDefs(). prepareEnums() turns that list into:
//   modules — { Sound: { boing: "boing", … }, … }  (spread into script globals)
//   docs    — { Sound: "Sound — …", … }            (top-level autocomplete docs)
//   values  — { Sound: ["boing", …], … }           (raw arrays, for __argEnums__)
// Because it's just data, enums can also be generated programmatically — e.g.
// from inspector property types that have a fixed value set — by adding more
// defs in buildEnumDefs before preparing.

import {
  types,
  materials,
  GROUND_TYPES,
  SOUND_TYPES,
} from "../objectTypeDefinitions.js";
import { TEXTURES } from "../textureList.js";
import { SKYBOX_OPTIONS } from "../defaultLevelData.js";
import {
  KBM_GLYPHS,
  KBM_GLYPHS_MAC,
  GAMEPAD_GLYPHS,
  TOUCH_GLYPHS,
  fontTag,
} from "../../iconFont.js";
// Auto-generated from tools/svg-icons/svg/*.svg by tools/svg-icons/build.py.
import { GAME_ICONS } from "../../gameIconsGenerated.js";

// Hand-curated input allowlist for the scripting Input module (api/input.js).
// Deliberately NOT generated from keybinds.json / E_inputs: inputs are exposed
// to level scripts one by one. menu (pause), reset, toggleTPM, openCamera,
// takePhoto, zoom and the directionY axis are intentionally absent so a level
// script can never watch or interfere with them — an excluded input is
// indistinguishable from a nonexistent one.
export const INPUT_ACTIONS = [
  "up",
  "down",
  "left",
  "right",
  "jump",
  "emote",
  "interact",
];
export const INPUT_STICKS = ["movement"];
// Values of the E_inputs root var curInputType (read as Input.controlScheme).
export const CONTROL_SCHEMES = ["KBM", "gamepad", "touch"];

// InputIcons enum members — EVERY input glyph in the fonts (iconFont.js tables),
// the successor to the sprite input frames being removed from the icons sprite.
// Exhaustive: keyboard/mouse, all four gamepad brands (Xbox/PS/Switch/Deck),
// the macOS Cmd/Option key variants (…Mac), and every outline variant (…Outline).
// Values are deterministic literals (fontTag on the exact table codepoint) so the
// enum string is identical everywhere — for the player's LIVE binding on the
// active device use Input.bindingFor() instead.
//
// KBM member key = the KeyboardEvent.code (already an identifier), except the
// mouse pseudo-codes remapped below. Gamepad member key = brand prefix + the
// brand's own button label (indices are the W3C standard-mapping order).
const KBM_ICON_KEY = {
  "0": "Mouse0",
  "1": "Mouse1",
  "2": "Mouse2",
  "3": "Mouse3",
  "4": "Mouse4",
  mouseMove: "MouseMove",
  scroll: "Scroll",
};
const GAMEPAD_PREFIX = { xbox: "Xbox", ps: "PS", switch: "Switch", deck: "Deck", switch2: "Switch2" };
const GAMEPAD_LABELS = {
  xbox: { "0": "A", "1": "B", "2": "X", "3": "Y", "4": "LB", "5": "RB", "6": "LT", "7": "RT", "8": "View", "9": "Menu", "10": "LStickPress", "11": "RStickPress", "12": "DpadUp", "13": "DpadDown", "14": "DpadLeft", "15": "DpadRight", "16": "Guide", stickL: "LStick", stickR: "RStick" },
  ps: { "0": "Cross", "1": "Circle", "2": "Square", "3": "Triangle", "4": "L1", "5": "R1", "6": "L2", "7": "R2", "8": "Create", "9": "Options", "10": "L3", "11": "R3", "12": "DpadUp", "13": "DpadDown", "14": "DpadLeft", "15": "DpadRight", "16": "Home", stickL: "LStick", stickR: "RStick" },
  switch: { "0": "B", "1": "A", "2": "Y", "3": "X", "4": "L", "5": "R", "6": "ZL", "7": "ZR", "8": "Minus", "9": "Plus", "10": "LStickPress", "11": "RStickPress", "12": "DpadUp", "13": "DpadDown", "14": "DpadLeft", "15": "DpadRight", "16": "Home", stickL: "LStick", stickR: "RStick" },
  deck: { "0": "A", "1": "B", "2": "X", "3": "Y", "4": "L1", "5": "R1", "6": "L2", "7": "R2", "8": "View", "9": "Menu", "10": "LStickPress", "11": "RStickPress", "12": "DpadUp", "13": "DpadDown", "14": "DpadLeft", "15": "DpadRight", "16": "Steam", stickL: "LStick", stickR: "RStick" },
  // Switch 2 shares Switch 1's button labels (only the ZL/ZR glyphs differ, via
  // GAMEPAD_GLYPHS.switch2), giving a full Switch2* enum set.
  switch2: { "0": "B", "1": "A", "2": "Y", "3": "X", "4": "L", "5": "R", "6": "ZL", "7": "ZR", "8": "Minus", "9": "Plus", "10": "LStickPress", "11": "RStickPress", "12": "DpadUp", "13": "DpadDown", "14": "DpadLeft", "15": "DpadRight", "16": "Home", stickL: "LStick", stickR: "RStick" },
};
function inputIconDefs() {
  const keys = [];
  const values = [];
  const add = (key, device, cp) => {
    const tag = fontTag(device, cp);
    if (tag) {
      keys.push(key);
      values.push(tag);
    }
  };
  // Each table entry is [solid, outline]; emit both (outline only when present).
  const addPair = (base, device, entry) => {
    add(base, device, entry[0]);
    add(base + "Outline", device, entry[1]);
  };
  for (const [code, entry] of Object.entries(KBM_GLYPHS))
    addPair(KBM_ICON_KEY[code] ?? code, "kbm", entry);
  for (const [code, entry] of Object.entries(KBM_GLYPHS_MAC))
    addPair((KBM_ICON_KEY[code] ?? code) + "Mac", "kbm", entry);
  for (const [brand, table] of Object.entries(GAMEPAD_GLYPHS)) {
    const labels = GAMEPAD_LABELS[brand];
    if (!labels) continue; // unknown brand → skip (no enum members)
    for (const [code, entry] of Object.entries(table)) {
      const label = labels[code];
      if (label === undefined) continue; // brand may expose only some codes
      addPair(GAMEPAD_PREFIX[brand] + label, "gamepad", entry);
    }
  }
  for (const [code, entry] of Object.entries(TOUCH_GLYPHS))
    addPair(code.charAt(0).toUpperCase() + code.slice(1), "touch", entry);
  return { keys, values };
}
const INPUT_ICON_DEFS = inputIconDefs();


const MANUAL_DEFS = [
  {
    name: "InputAction",
    docs: "InputAction — digital input name constants for the Input module (e.g. Input.isDown(InputAction.jump)).",
    values: INPUT_ACTIONS,
  },
  {
    name: "InputStick",
    docs: "InputStick — stick name constants for Input.joystick / Input.setJoystick.",
    values: INPUT_STICKS,
  },
  {
    name: "ControlScheme",
    docs: "ControlScheme — input device constants for Input.controlScheme (KBM, gamepad, touch).",
    values: CONTROL_SCHEMES,
  },
  {
    name: "InputIcons",
    docs: 'InputIcons — key/button glyphs as color-inheriting FONT runs, e.g. InputIcons.Space = "[font=kinput_kbm]…[/font]", so "Press " + InputIcons.Space renders the glyph in any game text (inherits the text color/size). Exhaustive: keyboard/mouse, all four gamepad brands (prefixes Xbox/PS/Switch/Deck, e.g. InputIcons.XboxA / InputIcons.PSCross), the macOS key variants (…Mac, e.g. InputIcons.MetaLeftMac), and every outline variant (…Outline). For the glyph of the player\'s CURRENT binding on the active device use Input.bindingFor(action) instead.',
    values: INPUT_ICON_DEFS.values,
    keys: INPUT_ICON_DEFS.keys,
  },
  {
    name: "GameIcons",
    docs: 'GameIcons — custom project icons as color-inheriting FONT runs, generated from tools/svg-icons/svg/*.svg (drop an SVG, run tools/svg-icons/build.py). e.g. GameIcons.Heart = "[font=gameicons]…[/font]", so "Got " + GameIcons.Coin renders the icon in any game text, tintable and sized to match the text (and the input glyphs). In localized/UI text you can instead write the token {icon:heart}.',
    values: GAME_ICONS.map((i) => i.tag),
    keys: GAME_ICONS.map((i) => i.key),
  },
  {
    name: "Skybox",
    docs: "Skybox — skybox type constants for level.skybox (e.g. Skybox.Desert).",
    values: SKYBOX_OPTIONS.map((o) => o.key),
    keys: SKYBOX_OPTIONS.map((o) => o.label),
  },
  // {
  //   name: "Sound",
  //   docs: "Sound — sound-effect name constants for the Audio.play* methods.",
  //   values: SOUNDS,
  // },
  {
    name: "Vocal",
    docs: "Vocal — player vocalization type constants for Audio.playerVocalize.",
    values: ["landed", "jump", "gasp", "ouch", "huh"],
  },
  {
    name: "Emote",
    docs: "Emote — mannequin emote constants for mannequin.emote().",
    // Mirrors the emote enum in scripts/enums.js (minus the empty "" entry) and
    // the keys in files/jsons/emoteData.json.
    values: [
      "wave",
      "point",
      "sit",
      "warmup",
      "drama",
      "like",
      "salute",
      "joke",
      "anger",
    ],
  },
  {
    name: "Material",
    docs: "Material — built-in material id constants (e.g. Material.Concrete) for shape.material / createMaterial(). This project's custom materials live in CustomMaterials.",
    // Built from the built-in map directly, NOT the material selector's options:
    // the selector merges in per-project custom materials, and this manual def
    // (manual wins the name clash) keeps the static Material enum unpolluted —
    // customs are exposed via the dynamic CustomMaterials enum in gameApi.js.
    values: Object.values(materials).map((m) => m.value),
    keys: Object.values(materials).map((m) => m.label),
  },
  {
    name: "Texture",
    docs: "Texture — cube-face texture name constants for custom materials.",
    values: TEXTURES,
  },
  {
    name: "GroundType",
    docs: "GroundType — ground physics type constants for a material's groundType.",
    values: Object.values(GROUND_TYPES).map((g) => g.value),
    keys: Object.values(GROUND_TYPES).map((g) => g.label),
  },
  {
    name: "SoundType",
    docs: "SoundType — footstep sound type constants for a material's soundType.",
    values: Object.values(SOUND_TYPES).map((s) => s.value),
    keys: Object.values(SOUND_TYPES).map((s) => s.label),
  },
];

// PascalCase a property key for use as an enum name ("characterSkin" -> "CharacterSkin").
function enumName(key) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

// One enum def per inspector "selector" property (the only fixed-value-set type).
// Each selector stores its choices in properties.options as [{ value, label }];
// the enum VALUE is the stored option value, and its member KEY is derived from
// the human label (e.g. label "Corner Out" -> Shape.CornerOut = "corner-out").
// Some selectors populate their options lazily from the C3 runtime (e.g. Tag
// mirrors the TagSprite animation list) and read empty before the runtime is
// up, so `pending` reports how many selectors were skipped for having no
// options yet — the caller uses it to know the def set isn't final.
function selectorEnumDefs() {
  const defs = [];
  let pending = 0;
  for (const descriptor of Object.values(types)) {
    const p = descriptor && descriptor.properties;
    if (!p || p.type !== "selector" || !Array.isArray(p.options)) continue;
    const opts = p.options.filter(
      (o) => o && o.value !== undefined && o.value !== null,
    );
    if (!opts.length) {
      pending++;
      continue;
    }
    const name = enumName(p.originalKey || p.key);
    defs.push({
      name,
      docs: `${name} — value constants for the "${p.label}" property.`,
      values: opts.map((o) => o.value),
      keys: opts.map((o) => o.label ?? o.value), // key source (parallel to values)
    });
  }
  return { defs, pending };
}

// Manual enums first; generated selector enums fill in the rest. A manual entry
// always wins a name clash (generated dupes are dropped).
const manualNames = new Set(MANUAL_DEFS.map((d) => d.name));

function buildEnumDefs() {
  const { defs, pending } = selectorEnumDefs();
  return {
    defs: [...MANUAL_DEFS, ...defs.filter((d) => !manualNames.has(d.name))],
    pending,
  };
}

// Turn an arbitrary source string into a valid JS identifier for member access:
// split on non-alphanumeric runs and camel-join, so "Corner Out" -> "CornerOut",
// "top-left" -> "topLeft", "Death-2" -> "Death2". First-letter case follows the
// source; a leading digit is prefixed with "_". Returns "" if nothing usable.
function normalizeKey(source) {
  const parts = String(source ?? "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
  if (!parts.length) return "";
  let key = parts[0];
  for (let i = 1; i < parts.length; i++) {
    key += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
  }
  return /^[0-9]/.test(key) ? "_" + key : key;
}

// Build the member object for one enum: { Key: "value", ..., __docs__ }.
// Pure — reuses normalizeKey + collision disambiguation. Exported so dynamic
// enums (e.g. CustomMaterials, built from per-project sharedData at schema-build
// time) can be assembled with the exact same key/doc conventions.
export function buildEnumMembers(name, values, keys) {
  const members = {};
  const memberDocs = {};
  values.forEach((value, i) => {
    const source = keys && keys[i] != null ? keys[i] : value;
    const base = normalizeKey(source) || normalizeKey(value) || `value${i}`;
    // Disambiguate collisions (two labels normalizing to the same identifier).
    let key = base;
    for (let n = 2; Object.prototype.hasOwnProperty.call(members, key); n++) {
      key = base + n;
    }
    members[key] = value;
    memberDocs[key] = `${name}.${key} = "${value}"`;
  });
  members.__docs__ = memberDocs;
  return members;
}

function prepareEnums(defs) {
  const modules = {};
  const docs = {};
  const values = {};
  for (const def of defs) {
    modules[def.name] = buildEnumMembers(def.name, def.values, def.keys);
    docs[def.name] = def.docs;
    values[def.name] = def.values; // raw values, for __argEnums__
  }
  return { modules, docs, values };
}

// The bundle can't be snapshotted at module load: lazily-populated selectors
// (Tag) read empty until the C3 runtime is up, and a snapshot taken then would
// silently drop them. Rebuild on access until every selector has produced its
// options, then cache the complete result. Rebuilds are cheap (a few dozen
// small option arrays), and accesses happen at schema-build / script-start
// time, not per frame.
let prepared = null;
let prepareComplete = false;

function getEnums() {
  if (prepareComplete) return prepared;
  const { defs, pending } = buildEnumDefs();
  prepared = prepareEnums(defs);
  prepareComplete = pending === 0;
  return prepared;
}

// The single prepared enum bundle. Import once: `import { Enums } from "./enums.js"`.
// Getters, so every access re-resolves via getEnums() — see above.
export const Enums = {
  get modules() {
    return getEnums().modules;
  },
  get docs() {
    return getEnums().docs;
  },
  get values() {
    return getEnums().values;
  },
};
