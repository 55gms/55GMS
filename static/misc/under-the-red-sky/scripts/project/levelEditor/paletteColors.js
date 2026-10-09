// Shared, read-only accessor for the project color palette.
//
// Before this module, the "read the palette from project shared data, fall back
// to PRESET_COLORS, normalize {value,name}|string entries to hex strings" logic
// was copy-pasted across colorPicker.js, colorPaletteManager.js,
// labels/labelsManager.js and ghostPaths/ghostPathManager.js. This module is the
// single source of truth for those reads; the ColorPaletteManager dialog remains
// the writer.

// Canonical default palette. Lives here (not colorPicker.js) so this accessor has
// no circular dependency on its consumers. colorPicker.js re-exports it for
// backward compatibility with existing `import { PRESET_COLORS } from "./colorPicker.js"`.
export const PRESET_COLORS = [
  { name: "UTRS Blue", value: "#16B0FE" },
  { name: "City yellow", value: "#FFD642" },
  { name: "Purple", value: "#BA1EFF" },
  { name: "Lime green (light)", value: "#CEFF1F" },
  { name: "Dust", value: "#9d9885" },
  { name: "White", value: "#FFFFFF" },
  { name: "UTRS Red", value: "#FD3030" },
  { name: "Cyan", value: "#1EFFC8" },
  { name: "Pink", value: "#FF1E96" },
  { name: "Lime green (dark)", value: "#15E55A" },
  { name: "City grey", value: "#c9c9c9" },
  { name: "Black", value: "#000000" },
];

// Default cap on stored recent colors when the project doesn't override it.
export const DEFAULT_RECENT_COLORS_LIMIT = 12;

function getSharedData() {
  const pm = globalThis._editorScope?.projectManager;
  if (pm && pm.hasProjectLoaded?.()) {
    return pm.getSharedData?.() || null;
  }
  return null;
}

// Normalize a palette entry (string or {value,name}) to a {name, value} pair.
// Legacy entries are bare hex strings (names were stripped before names became
// editable); for those the name falls back to the hex value itself.
function toColorEntry(color) {
  if (typeof color === "string") return { name: color, value: color };
  return { name: color.name ?? color.value, value: color.value };
}

/**
 * Preset palette colors as {name, value} pairs. Reads the project's
 * colorPaletteSettings.presetColors, falling back to the default PRESET_COLORS
 * when no project is loaded or no override is set.
 * @returns {{name: string, value: string}[]}
 */
export function getPresetColorEntries() {
  const shared = getSharedData();
  const presetColors =
    shared?.colorPaletteSettings?.presetColors || PRESET_COLORS;
  return presetColors.map(toColorEntry);
}

/**
 * Preset palette colors as hex strings (names dropped). Convenience over
 * getPresetColorEntries() for consumers that only need the swatches.
 * @returns {string[]}
 */
export function getPresetColors() {
  return getPresetColorEntries().map((e) => e.value);
}

/**
 * Recently used colors as stored on the project. Empty when no project is loaded.
 * @returns {string[]}
 */
export function getRecentColors() {
  const shared = getSharedData();
  return shared?.recentColors || [];
}

/**
 * Project-configured cap on recent colors, or the supplied/default fallback.
 * @param {number} [fallback]
 * @returns {number}
 */
export function getRecentColorsLimit(fallback = DEFAULT_RECENT_COLORS_LIMIT) {
  const shared = getSharedData();
  return shared?.colorPaletteSettings?.recentColorsLimit || fallback;
}
