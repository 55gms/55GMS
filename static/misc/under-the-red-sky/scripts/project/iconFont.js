// iconFont.js — Kenney Input Prompts glyph tables (fonts/kinput_*.ttf).
//
// Maps the game's input codes to codepoints in the three Kenney icon fonts
// (registered in C3 as kinput_kbm / kinput_gamepad / kinput_touch). Emitted
// as inline BBCode font runs — unlike the sprite icons, font glyphs inherit
// the surrounding text's COLOR and size, which is the whole point.
//
// Each entry is [solid, outline] codepoints (outline null where Kenney ships
// no outline variant — outline style falls back to solid).
//
// Source: kenney_input-prompts_1.5 (CC0). Regenerate the tables from the
// pack's *_map.txt files if the fonts are ever updated.
//
// kinput_gamepad.ttf is a merge of the pack's Xbox Series font (original
// codepoints, 0xE0xx) plus PS (0xE100+), Switch (0xE200+) and Steam Deck
// (0xE300+) button glyphs, each normalized like the rest of the font
// (per-glyph uniform scale to bbox height 1740, lsb 60, advance width+120).

// KeyboardEvent.code (plus numeric mouse buttons "0"-"4" and the pseudo-codes
// mouseMove / scroll) -> glyph in KInputKBM.
export const KBM_GLYPHS = {
  "KeyA": [0xE015, 0xE016],
  "KeyB": [0xE036, 0xE037],
  "KeyC": [0xE046, 0xE047],
  "KeyD": [0xE056, 0xE057],
  "KeyE": [0xE05A, 0xE05B],
  "KeyF": [0xE066, 0xE07F],
  "KeyG": [0xE082, 0xE083],
  "KeyH": [0xE084, 0xE085],
  "KeyI": [0xE088, 0xE089],
  "KeyJ": [0xE08C, 0xE08D],
  "KeyK": [0xE08E, 0xE08F],
  "KeyL": [0xE090, 0xE091],
  "KeyM": [0xE092, 0xE093],
  "KeyN": [0xE096, 0xE097],
  "KeyO": [0xE09E, 0xE09F],
  "KeyP": [0xE0A3, 0xE0A4],
  "KeyQ": [0xE0B3, 0xE0B4],
  "KeyR": [0xE0B9, 0xE0BA],
  "KeyS": [0xE0BD, 0xE0BE],
  "KeyT": [0xE0CF, 0xE0D0],
  "KeyU": [0xE0D9, 0xE0DA],
  "KeyV": [0xE0DD, 0xE0DE],
  "KeyW": [0xE0DF, 0xE0E0],
  "KeyX": [0xE0E3, 0xE0E4],
  "KeyY": [0xE0E5, 0xE0E6],
  "KeyZ": [0xE0E7, 0xE0E8],
  "Digit0": [0xE001, 0xE002],
  "Digit1": [0xE003, 0xE004],
  "Digit2": [0xE005, 0xE006],
  "Digit3": [0xE007, 0xE008],
  "Digit4": [0xE009, 0xE00A],
  "Digit5": [0xE00B, 0xE00C],
  "Digit6": [0xE00D, 0xE00E],
  "Digit7": [0xE00F, 0xE010],
  "Digit8": [0xE011, 0xE012],
  "Digit9": [0xE013, 0xE014],
  "F1": [0xE067, 0xE06E],
  "F2": [0xE06F, 0xE070],
  "F3": [0xE071, 0xE072],
  "F4": [0xE073, 0xE074],
  "F5": [0xE075, 0xE076],
  "F6": [0xE077, 0xE078],
  "F7": [0xE079, 0xE07A],
  "F8": [0xE07B, 0xE07C],
  "F9": [0xE07D, 0xE07E],
  "F10": [0xE068, 0xE069],
  "F11": [0xE06A, 0xE06B],
  "F12": [0xE06C, 0xE06D],
  "ArrowUp": [0xE023, 0xE024],
  "ArrowDown": [0xE01D, 0xE01E],
  "ArrowLeft": [0xE01F, 0xE020],
  "ArrowRight": [0xE021, 0xE022],
  "Space": [0xE0CB, 0xE0CE],
  "Enter": [0xE05E, 0xE05F],
  "NumpadEnter": [0xE09A, 0xE09B],
  "Escape": [0xE062, 0xE063],
  "Tab": [0xE0D1, 0xE0D6],
  "Backspace": [0xE038, 0xE03D],
  "Delete": [0xE058, 0xE059],
  "Insert": [0xE08A, 0xE08B],
  "Home": [0xE086, 0xE087],
  "End": [0xE05C, 0xE05D],
  "PageUp": [0xE0A7, 0xE0A8],
  "PageDown": [0xE0A5, 0xE0A6],
  "CapsLock": [0xE048, 0xE04B],
  "ShiftLeft": [0xE0C3, 0xE0C6],
  "ShiftRight": [0xE0C3, 0xE0C6],
  "ControlLeft": [0xE054, 0xE055],
  "ControlRight": [0xE054, 0xE055],
  "AltLeft": [0xE017, 0xE018],
  "AltRight": [0xE017, 0xE018],
  "MetaLeft": [0xE0E1, 0xE0E2],
  "MetaRight": [0xE0E1, 0xE0E2],
  "Semicolon": [0xE0C1, 0xE0C2],
  "Quote": [0xE01B, 0xE01C],
  "Comma": [0xE050, 0xE051],
  "Period": [0xE0AD, 0xE0AE],
  "Slash": [0xE0C9, 0xE0CA],
  "Backslash": [0xE0C7, 0xE0C8],
  "BracketLeft": [0xE044, 0xE045],
  "BracketRight": [0xE03E, 0xE03F],
  "Minus": [0xE094, 0xE095],
  "Equal": [0xE060, 0xE061],
  "Backquote": [0xE0D7, 0xE0D8],
  "NumLock": [0xE098, 0xE099],
  "PrintScreen": [0xE0B1, 0xE0B2],
  "ScrollLock": [0xE0BF, 0xE0C0],
  "Pause": [0xE0AA, 0xE0AB],
  "NumpadAdd": [0xE09C, 0xE09D],
  "NumpadMultiply": [0xE034, 0xE035],
  // Mouse buttons use the OUTLINE glyphs in both slots: Kenney's filled mouse
  // glyphs distinguish the pressed button only by colour, which a monochrome
  // font drops, so left/middle/right/side all collapse to one silhouette. The
  // outline variants encode the button as geometry and stay distinct.
  "0": [0xE0EC, 0xE0EC],
  "1": [0xE0F4, 0xE0F4],
  "2": [0xE0F0, 0xE0F0],
  "3": [0xE0FB, 0xE0FB],
  "4": [0xE0FD, 0xE0FD],
  "mouseMove": [0xE0ED, null],
  "scroll": [0xE0F8, 0xE0F8], // mouse_scroll_vertical_outline (both directions)
  // Bindable scroll directions (release-less wheel input, see inputs.js). Use the
  // OUTLINE up/down scroll glyphs in both slots, matching the mouse-button
  // convention above (the filled variants collapse in a monochrome font).
  "WheelUp": [0xE0F6, 0xE0F6], // mouse_scroll_up_outline
  "WheelDown": [0xE0F3, 0xE0F3], // mouse_scroll_down_outline
};

// On macOS show the Cmd glyph for Meta (instead of the Windows key) and the
// Option glyph for Alt. Display-only override — binding codes are unchanged.
export const IS_MAC = /Mac/.test(navigator.platform);
export const KBM_GLYPHS_MAC = {
  "MetaLeft": [0xE052, 0xE053],   // keyboard_command
  "MetaRight": [0xE052, 0xE053],
  "AltLeft": [0xE0A0, 0xE0A1],    // keyboard_option
  "AltRight": [0xE0A0, 0xE0A1],
};

// Gamepad button index -> glyph in KInputGamepad (+ stickL/stickR for the
// movement/look sticks), one table per controller brand. All tables use the
// standard-mapping button indices, so "0" is the bottom face button on every
// brand (A on Xbox, cross on PS, B on Switch). Brands with a missing entry
// (e.g. PS has no home/guide glyph) fall back to the xbox table in fontIcon.
// PS range 0xE100+, Switch 0xE200+, Deck 0xE300+ (see the regen note above).
export const GAMEPAD_GLYPHS = {
  xbox: {
    "0": [0xE004, 0xE005],
    "1": [0xE006, 0xE007],
    "2": [0xE01E, 0xE01F],
    "3": [0xE020, 0xE021],
    "4": [0xE043, 0xE044],
    "5": [0xE049, 0xE04A],
    "6": [0xE047, 0xE048],
    "7": [0xE04D, 0xE04E],
    "8": [0xE01C, 0xE01D],
    "9": [0xE014, 0xE015],
    "10": [0xE053, null],
    "11": [0xE05B, null],
    "12": [0xE035, 0xE036],
    "13": [0xE024, 0xE025],
    "14": [0xE028, 0xE029],
    "15": [0xE02B, 0xE02C],
    "16": [0xE041, 0xE042],
    "stickL": [0xE04F, null],
    "stickR": [0xE057, null],
  },
  ps: {
    "0": [0xE100, 0xE101],
    "1": [0xE102, 0xE103],
    "2": [0xE104, 0xE105],
    "3": [0xE106, 0xE107],
    "4": [0xE108, 0xE109],
    "5": [0xE10A, 0xE10B],
    "6": [0xE10C, 0xE10D],
    "7": [0xE10E, 0xE10F],
    "8": [0xE110, 0xE111],
    "9": [0xE112, 0xE113],
    "10": [0xE114, 0xE115],
    "11": [0xE116, 0xE117],
    "12": [0xE118, 0xE119],
    "13": [0xE11A, 0xE11B],
    "14": [0xE11C, 0xE11D],
    "15": [0xE11E, 0xE11F],
    "stickL": [0xE120, null],
    "stickR": [0xE121, null],
  },
  switch: {
    "0": [0xE200, 0xE201],
    "1": [0xE202, 0xE203],
    "2": [0xE204, 0xE205],
    "3": [0xE206, 0xE207],
    "4": [0xE208, 0xE209],
    "5": [0xE20A, 0xE20B],
    "6": [0xE20C, 0xE20D],
    "7": [0xE20E, 0xE20F],
    "8": [0xE210, 0xE211],
    "9": [0xE212, 0xE213],
    "10": [0xE214, null],
    "11": [0xE215, null],
    "12": [0xE216, 0xE217],
    "13": [0xE218, 0xE219],
    "14": [0xE21A, 0xE21B],
    "15": [0xE21C, 0xE21D],
    "16": [0xE21E, 0xE21F],
    "stickL": [0xE220, null],
    "stickR": [0xE221, null],
  },
  deck: {
    "0": [0xE300, 0xE301],
    "1": [0xE302, 0xE303],
    "2": [0xE304, 0xE305],
    "3": [0xE306, 0xE307],
    "4": [0xE308, 0xE309],
    "5": [0xE30A, 0xE30B],
    "6": [0xE30C, 0xE30D],
    "7": [0xE30E, 0xE30F],
    "8": [0xE310, 0xE311],
    "9": [0xE312, 0xE313],
    "10": [0xE314, null],
    "11": [0xE315, null],
    "12": [0xE316, 0xE317],
    "13": [0xE318, 0xE319],
    "14": [0xE31A, 0xE31B],
    "15": [0xE31C, 0xE31D],
    "16": [0xE31E, 0xE31F],
    "stickL": [0xE320, null],
    "stickR": [0xE321, null],
  },
};

// Switch 2 shares every Switch 1 glyph except the ZL/ZR triggers (button codes
// 6/7), which Kenney draws differently for the new console. Spread Switch 1 and
// override just those two so an unrecognised code still resolves.
GAMEPAD_GLYPHS.switch2 = {
  ...GAMEPAD_GLYPHS.switch,
  "6": [0xE322, 0xE323], // switch2_button_zl / _outline
  "7": [0xE324, 0xE325], // switch2_button_zr / _outline
};

// Touch gesture tag (same names as the icons sprite frames) -> glyph in
// KInputTouch.
export const TOUCH_GLYPHS = {
  "touchTap": [0xE014, null],
  "touchHold": [0xE016, null],
  "touchPan": [0xE009, null],
  "touchSwipe": [0xE007, null],
  "touchZoomIn": [0xE01A, null],
  "touchZoomOut": [0xE01B, null],
  "touch": [0xE000, null],
  "touchDoubleTap": [0xE015, null],
  "touchTwoFingerSwipe": [0xE011, null], // touch_swipe_two_vertical
};

// Family names as registered by the C3 editor on import (file basenames).
const FAMILY = { kbm: "kinput_kbm", gamepad: "kinput_gamepad", touch: "kinput_touch" };

/**
 * Inline BBCode font run for an input glyph, or null when the device table
 * has no glyph for the code. device: "kbm" | "gamepad" | "touch".
 * brand only applies to gamepad ("xbox" | "ps" | "switch" | "deck"); unknown
 * brands and entries a brand table lacks fall back to xbox.
 */
/**
 * Font tag for a specific codepoint — used to build the static InputIcons
 * scripting enum directly from the glyph tables above (every brand / Mac /
 * outline variant). Returns null for a null/absent codepoint. Unlike
 * fontIcon(), it applies no IS_MAC remap or per-brand fallback — the caller
 * picks the exact table entry, so the emitted string is deterministic.
 */
export function fontTag(device, cp) {
  if (cp == null) return null;
  return "[font=" + FAMILY[device] + "]" + String.fromCharCode(cp) + "[/font]";
}

export function fontIcon(device, code, outline = false, brand = "xbox") {
  let entry;
  if (device === "gamepad") {
    const table = GAMEPAD_GLYPHS[brand] ?? GAMEPAD_GLYPHS.xbox;
    entry = table[String(code)] ?? GAMEPAD_GLYPHS.xbox[String(code)];
  } else if (device === "kbm") {
    entry = (IS_MAC && KBM_GLYPHS_MAC[String(code)]) || KBM_GLYPHS[String(code)];
  } else {
    entry = TOUCH_GLYPHS[String(code)];
  }
  if (!entry) return null;
  const cp = (outline && entry[1]) || entry[0];
  return "[font=" + FAMILY[device] + "]" + String.fromCharCode(cp) + "[/font]";
}
