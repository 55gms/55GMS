// inputBindingDisplay.js — one binding→icon-markup lookup for EVERY input.
//
// Returns the game's inline font-icon markup ("[font=kinput_kbm]…[/font]")
// for whatever is bound to an action on the ACTIVE device (curInputType),
// falling back to the plain code as text when no glyph exists.
//
// This is the game-wide, unrestricted lookup: pause menu, tutorials, and the
// localized help text can use it for any action (menu, reset, openCamera…).
// The level-scripting API wraps it with its allowlist in
// levelEditor/scripting/api/input.js — the whitelist is enforced there, at the
// script boundary, not here.
//
// Pure JS, deliberately NOT via event functions: those live in the
// "keybinding" group, and C3 functions return "" while their group is
// deactivated (the Poki SDK deactivates the whole "inputs" group during ads,
// which is exactly when level restarts create their texts).
//
// Event sheets: call through Functions.getBindingIcon(action, index) /
// Functions.resolveIconTokens(text) (function blocks in E_inputs).

import { Inputs as Keybinds } from "./inputs.js";
import { fontIcon } from "./iconFont.js";
import { gameIconTag } from "./gameIconsGenerated.js";

// "font" = Kenney icon-font runs ([font=kinput_kbm]…) that inherit the text's
// color and size; "fontOutline" picks each glyph's outline variant.
const ICON_STYLE = "font";

// Sticks have no keybinds.json entry, so they're described per device. On
// keyboard, movement is the four direction actions (composed at the given
// binding index) and look is the mouse. Values are kinput font glyph names.
const STICK_GAMEPAD_ICON = { movement: "stickL", look: "stickR" };
const STICK_KBM_ACTIONS = { movement: ["up", "left", "down", "right"] };
const STICK_KBM_ICON = { look: "mouseMove" };

// ---------------------------------------------------------------------------
// TOUCH DISPLAY TABLE — the one place to edit what touch players see for each
// action (touch bypasses rebinding entirely, so this is authored, not bound).
//
// Each entry is a small markup template, emitted verbatim except for
// {gesture} placeholders, which render as kinput_touch font glyphs. The button
// affordances (jump/joystick/interact + reused UI icons) are color-inheriting
// gameicons font runs via gameIconTag(name), so touch prompts tint/scale with
// the text like every other binding glyph.
// Gestures: {tap} {doubleTap} {hold} {pan} {swipe} {twoFingerSwipe} {zoomIn}
// {zoomOut} {touch}.
// gameIconTag(name) returns "" for an unknown name (needs fonts/gameicons.ttf
// imported in C3). Missing/absent entry -> no touch affordance.
const TOUCH_DISPLAY = {
  jump: gameIconTag("jumpTouchBtn") + "{tap}",
  // generic touch glyph, not {pan}: next to the joystick icon the pan-arrows
  // read as "swipe the screen" when the actual gesture is holding the stick
  movement: gameIconTag("touchJoystick") + "{touch}",
  look: "{pan}",
  emote: gameIconTag("emote") + "{tap}",
  reset: gameIconTag("reset") + "{tap}",
  menu: gameIconTag("pause") + "{tap}",
  toggleTPM: gameIconTag("eye") + "{tap}/{zoomIn}{zoomOut}",
  openCamera: gameIconTag("camera") + "{tap}",
  interact: gameIconTag("interactTouchBtn") + "{tap}",
  // takePhoto: "",
  // Composite focus/camZoom axis (see AXIS_COMPOSITE): the touch half. On touch
  // the two share nothing — focus is a two-finger vertical swipe, camZoom (TPM
  // camera distance) is a pinch — so each names its own gesture. On kbm/gamepad
  // both resolve to the same focusFar/focusNear axis glyph instead (handled in
  // getBindingIcon). `zoom` itself is a real held action (FOV zoom, KeyQ / L3)
  // with no touch button yet, so it deliberately has no entry here.
  focus: "{twoFingerSwipe}",
  camZoom: "{zoomIn}{zoomOut}",
};

// {placeholder} -> canonical gesture tag (kinput_touch glyph in TOUCH_GLYPHS).
const TOUCH_GESTURE_TAG = {
  tap: "touchTap",
  doubleTap: "touchDoubleTap",
  hold: "touchHold",
  pan: "touchPan",
  swipe: "touchSwipe",
  twoFingerSwipe: "touchTwoFingerSwipe",
  zoomIn: "touchZoomIn",
  zoomOut: "touchZoomOut",
  touch: "touch",
};

const STICKS = new Set([
  ...Object.keys(STICK_GAMEPAD_ICON),
  ...Object.keys(STICK_KBM_ACTIONS),
  ...Object.keys(STICK_KBM_ICON),
]);

// Controller brand ("xbox" | "ps" | "switch" | "switch2" | "deck") for glyph
// selection, sniffed from the active pad's id string. Vendor ids (054c Sony,
// 057e Nintendo) are the reliable signal; the name patterns catch browsers that
// omit them (Safari's DualShock is literally "Wireless Controller").
// Unrecognized pads read as xbox, which is also what Steam Input emulates.
const BRAND_BY_ID = new Map();

// Nintendo Switch 2 controllers (vendor 057e). Product ids from public HID
// reports: Joy-Con 2 L 2066 / R 2067, Pro Controller 2 2069, GameCube 2073.
// Browsers format the id differently — Chrome ".. Vendor: 057e Product: 2069",
// Firefox "057e-2069-..". TODO(verify): confirm against a real Switch 2 pad's
// getGamepadRawId; anything unmatched falls through to Switch 1 glyphs, which is
// harmless since only the ZL/ZR glyphs differ.
const SWITCH2_ID = /(?:057e|product)[-:\s]*(?:206[679]|2073)\b/i;

function isSwitch2Id(id) {
  return /switch\s*2|switch2/i.test(id) || SWITCH2_ID.test(id);
}

function sniffGamepadBrand(id) {
  if (
    /sony|playstation|dualshock|dualsense|054c|^wireless controller/i.test(id)
  )
    return "ps";
  // 8BitDo (vendor 2dc8) pads are Nintendo-layout (A/B and X/Y swapped vs
  // Xbox), so they get Switch glyphs — Chromium's device list has 22 of them.
  if (/nintendo|switch|joy-?con|057e|8bitdo|2dc8/i.test(id))
    return isSwitch2Id(id) ? "switch2" : "switch";
  return "xbox";
}

// Steam Deck can't be sniffed from the pad id — Steam Input masks every pad
// as an Xbox 360 one — so read Pipelab's cached flag (fetched async at
// startup; false until then, which only means xbox glyphs for a moment).
// Gated on _isInitialized so uninitialized Pipelab (web/Poki builds) can
// never report deck. Reaches into addon internals (same fields as the
// IsInitialized condition / SteamIsRunningOnSteamDeck expression) — recheck
// on Pipelab updates.
function isOnSteamDeck(runtime) {
  try {
    const p = runtime.objects.Pipelab?.getFirstInstance();
    return !!(p?._isInitialized && p?._steam_IsRunningOnSteamDeck);
  } catch (e) {
    return false;
  }
}

export function getGamepadBrand(runtime) {
  if (isOnSteamDeck(runtime)) return "deck";
  let id = "";
  try {
    // Ask the Gamepad PLUGIN for the id (event function in E_inputs):
    // curGamepad is the plugin's own pad index, so indexing
    // navigator.getGamepads() with it could read the wrong slot.
    id = String(runtime.callFunction("getGamepadRawId") ?? "");
  } catch (e) {} // function not (re)implemented yet -> "" -> xbox
  if (!BRAND_BY_ID.has(id)) BRAND_BY_ID.set(id, sniffGamepadBrand(id));
  return BRAND_BY_ID.get(id);
}

// {if:cond}A{elif:cond}B{else}C{/if} device-conditional segments inside
// localized strings, resolved BEFORE the {icon:}/{key:}/{keybind:} expansions so
// a branch may contain those tokens. Flat grammar — NO nesting. cond = comma-separated terms
// (comma = OR); a leading ! negates a term (e.g. {if:touch,mobile}, {if:!deck}).
// Curated predicate keywords: touch / kbm / gamepad (match curInputType,
// case-insensitively), mobile (phone or tablet), tablet, desktop, deck.
// {elif}/{else} are optional; an {if} with no true branch and no {else} → "".
// Robustness: an unknown keyword just evaluates false; a structurally malformed
// group (e.g. an {if:…} with no matching {/if}) is left verbatim and never
// throws — this text comes from editable i18n files.
const IF_GROUP = /\{if:([^}]*)\}(.*?)\{\/if\}/gs;

function devicePredicates(runtime) {
  const scheme = String(runtime.globalVars?.curInputType ?? "").toLowerCase();
  let cat = "desktop";
  try {
    cat = globalThis.getDeviceCategory?.() ?? "desktop";
  } catch (e) {}
  return {
    touch: scheme === "touch",
    kbm: scheme === "kbm",
    gamepad: scheme === "gamepad",
    mobile: cat === "mobile" || cat === "tablet",
    tablet: cat === "tablet",
    desktop: cat === "desktop",
    deck: isOnSteamDeck(runtime),
  };
}

// OR over comma-separated terms; leading ! negates. Unknown keyword → false.
function evalCond(condStr, preds) {
  return String(condStr)
    .split(",")
    .some((rawTerm) => {
      let term = rawTerm.trim();
      let negate = false;
      while (term.startsWith("!")) {
        negate = !negate;
        term = term.slice(1).trim();
      }
      const val = preds[term.toLowerCase()] === true;
      return negate ? !val : val;
    });
}

function resolveDeviceConditionals(runtime, text) {
  const preds = devicePredicates(runtime);
  return text.replace(IF_GROUP, (whole, firstCond, body) => {
    try {
      // Split the body into ordered (cond, segment) branches. The first branch
      // uses firstCond; each {elif:cond}/{else} starts the next. cond === null
      // marks the {else} branch (always taken if reached).
      const branchSplit = /\{(?:elif:([^}]*)|else)\}/g;
      const branches = [];
      let cond = firstCond;
      let lastIndex = 0;
      let m;
      while ((m = branchSplit.exec(body)) !== null) {
        branches.push({ cond, segment: body.slice(lastIndex, m.index) });
        cond = m[1] !== undefined ? m[1] : null; // {else} → null
        lastIndex = branchSplit.lastIndex;
      }
      branches.push({ cond, segment: body.slice(lastIndex) });
      for (const b of branches) {
        if (b.cond === null || evalCond(b.cond, preds)) return b.segment;
      }
      return "";
    } catch (e) {
      console.error("[resolveDeviceConditionals]", whole, e);
      return whole;
    }
  });
}

// {keybind:action} / {keybind:action:N} tokens inside localized strings,
// resolved at display time so help/tutorial text always shows the live binding
// on the active device. Doesn't collide with the i18n plugin's numeric {0}
// params (actions are alphabetic) nor with [icon=…] BBCode.
const KEYBIND_TOKEN = /\{keybind:([A-Za-z]+)(?::(\d+))?\}/g;

// {icon:name} — static custom game icon (tools/svg-icons/svg/<name>.svg),
// resolved to its color-inheriting [font=gameicons] run. Unknown name → "".
// Distinct namespace from {keybind:} (live input bindings) and {key:} (static
// input-font glyphs) so they never collide.
const GAME_ICON_TOKEN = /\{icon:([A-Za-z0-9_-]+)\}/g;

// {key:code} / {key:device:code} — a STATIC input-font glyph named directly (not
// resolved through a binding). device is kbm | gamepad | touch, defaulting to
// kbm; gamepad uses the live controller brand. code is the glyph key in that
// device's table (iconFont.js): kbm = KeyboardEvent.code (Space, KeyE), gamepad
// = standard button index or stickL/stickR (0-16), touch = gesture tag
// (touchTap…). Unknown device/code → "". Examples: {key:Space}, {key:gamepad:0},
// {key:gamepad:stickL}, {key:touch:touchTap}.
const KEY_TOKEN = /\{key:(?:(kbm|gamepad|touch):)?([A-Za-z0-9_]+)\}/g;

/**
 * Resolve {if:...} device conditionals first, then the static {icon:name} custom
 * game icons and {key:[device:]code} static input-font glyphs, then replace every
 * {keybind:action[:index]} token with the binding's icon tag for the active
 * device. Unbound / no affordance / unknown → token collapses to "". A failing
 * token never nukes the whole text — it is kept verbatim.
 */
export function resolveIconTokens(runtime, text) {
  let resolved = resolveDeviceConditionals(runtime, String(text ?? ""));
  resolved = resolved.replace(GAME_ICON_TOKEN, (token, name) => gameIconTag(name));
  resolved = resolved.replace(KEY_TOKEN, (token, device, code) => {
    try {
      const dev = device || "kbm";
      const brand = dev === "gamepad" ? getGamepadBrand(runtime) : "xbox";
      return fontIcon(dev, code, false, brand) ?? "";
    } catch (e) {
      console.error("[resolveIconTokens]", token, e);
      return token;
    }
  });
  return resolved.replace(KEYBIND_TOKEN, (token, action, index) => {
    try {
      return getBindingIcon(runtime, action, index ? Number(index) : 0) ?? "";
    } catch (e) {
      console.error("[resolveIconTokens]", token, e);
      return token;
    }
  });
}

// Composite "axis" display actions (like the movement stick): a named
// positive+negative pair shown as ONE control. `focus` and `camZoom` both resolve
// to the same focusFar/focusNear axis on kbm/gamepad; on touch they diverge
// (focus = two-finger swipe, camZoom = pinch — see TOUCH_DISPLAY), because touch
// has no shared binding. Lets i18n announce intent ({keybind:focus} vs
// {keybind:camZoom}) and have it resolved appropriately per device. Not to be
// confused with the plain `zoom` action (held FOV zoom), which is a normal
// keybinds.json entry.
const AXIS_COMPOSITE = {
  focus: { pos: "focusFar", neg: "focusNear" },
  camZoom: { pos: "focusFar", neg: "focusNear" },
};

// Merged glyph for a composite axis on a SPECIFIC device: one scroll glyph when
// the two directions are scroll up + down (either order), else the two glyphs
// back to back tagged with their sign (positive "+", negative "-"). null when
// neither direction is bound on this device.
function axisGlyphForDevice(runtime, device, comp, index, style) {
  const outline = style === "fontOutline";
  const brand = device === "gamepad" ? getGamepadBrand(runtime) : "xbox";
  const cpos = Keybinds.getKeybind(device, comp.pos, index);
  const cneg = Keybinds.getKeybind(device, comp.neg, index);
  if (cpos === false && cneg === false) return null;

  const isWheel = (c) => c === "WheelUp" || c === "WheelDown";
  if (isWheel(cpos) && isWheel(cneg) && cpos !== cneg) {
    return fontIcon(device, "scroll", outline, brand) || "scroll";
  }
  const glyph = (c) => (c === false ? "" : fontIcon(device, c, outline, brand) || String(c));
  const g = glyph(cpos);
  const n = glyph(cneg);
  return (g ? g + "+" : "") + (n ? n + "-" : "");
}

/**
 * Icon markup for the action's binding on the active device, or null when
 * unbound / no affordance on this device. style: "font" | "fontOutline"
 * (default ICON_STYLE); falls back to the plain code/tag as text when no
 * glyph exists.
 */
export function getBindingIcon(runtime, action, index = 0, style = ICON_STYLE) {
  const outline = style === "fontOutline";
  const scheme = runtime.globalVars.curInputType;

  if (scheme === "touch") {
    const tpl = TOUCH_DISPLAY[action];
    if (!tpl) return null;
    // Expand {gesture} placeholders; everything else (font runs, text) passes
    // through verbatim. Unknown placeholders stay visible so typos are seen.
    return tpl.replace(/\{(\w+)\}/g, (m, name) => {
      const tag = TOUCH_GESTURE_TAG[name];
      if (!tag) return m;
      return fontIcon("touch", tag, outline) || tag;
    });
  }
  const type = scheme === "gamepad" ? "gamepad" : "kbm";
  const brand = type === "gamepad" ? getGamepadBrand(runtime) : "xbox";

  // composite focus/zoom axis -> merged glyph of its focusFar/focusNear pair
  const comp = AXIS_COMPOSITE[action];
  if (comp) return axisGlyphForDevice(runtime, type, comp, index, style);

  const icon = (a) => {
    const code = Keybinds.getKeybind(type, a, index);
    if (code === false) return null;
    return fontIcon(type, code, outline, brand) || String(code);
  };

  if (STICKS.has(action)) {
    if (type === "gamepad") {
      const stick = STICK_GAMEPAD_ICON[action];
      if (!stick) return null;
      return fontIcon("gamepad", stick, outline, brand) || stick;
    }
    const mouse = STICK_KBM_ICON[action];
    if (mouse) return fontIcon("kbm", mouse, outline) || mouse;
    // Cluster of the four direction-key icons. Font glyphs carry their own
    // side bearings, so they join tightly like a keyboard row.
    const parts = (STICK_KBM_ACTIONS[action] ?? []).map(icon).filter(Boolean);
    return parts.length ? parts.join("") : null;
  }
  return icon(action);
}

/**
 * Font icon for a SPECIFIC device's binding code — for UI that shows the kbm AND
 * gamepad rows at once (the rebind menu, the bind-success toast), independent of
 * the active device. getBindingIcon() only covers the ACTIVE device, so these
 * callers pass an explicit device. Falls back to the plain code as text when
 * no font glyph exists. device: "kbm" | "gamepad".
 *
 * Replaces the event-sheet getInputIconOrFallback* helpers (which drove the
 * `icons` Sprite and returned "[icon=…]"); see TODO/tasks/keybinds-to-fonts.md.
 */
export function inputFontIconForCode(runtime, device, code, style = ICON_STYLE) {
  const outline = style === "fontOutline";
  const brand = device === "gamepad" ? getGamepadBrand(runtime) : "xbox";
  return fontIcon(device, code, outline, brand) || String(code);
}

// As above but resolving the bound code from (device, action, bindIndex) first —
// what the rebind menu rows need. Empty string when the slot is unbound.
export function inputFontIconForBinding(runtime, device, action, index = 0, style = ICON_STYLE) {
  // composite focus/zoom axis: merged glyph of its underlying pair
  const comp = AXIS_COMPOSITE[action];
  if (comp) return axisGlyphForDevice(runtime, device, comp, index, style) ?? "";
  const code = Keybinds.getKeybind(device, action, index);
  if (code === false) return "";
  return inputFontIconForCode(runtime, device, code, style);
}
