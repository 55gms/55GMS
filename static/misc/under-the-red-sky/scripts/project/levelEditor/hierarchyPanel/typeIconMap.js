// Maps a level-editor instance to an icon name from `iconList`.
//
// The mapping is derived once at module load from ObjectPresets so that any
// preset edits (icon swaps, new presets) automatically propagate to the
// hierarchy panel's row icons. There is intentionally no second hand-curated
// table to keep in sync.
//
// Lookup key:
//   - GenericShape          -> keyed by `instance.shape` (box, prism, ...)
//   - GenericScatterShape   -> keyed by `instance.shape` (treated like
//                              GenericShape; falls back to scatter preset
//                              icon if shape-specific entry missing).
//   - everything else       -> keyed by objectType name (e.g. "Cone").
//
// `getIconForInstance` returns the SVG markup string, or "" if no entry
// exists. `getIconNameForInstance` returns just the registry key — useful
// when the caller wants to handle missing icons themselves.

import { ObjectPresets } from "../objectPresets.js";
import * as iconList from "../iconList.js";

// Two-level table:
//   byObjectType[objectTypeName]            = iconName       (default)
//   byShape[shapeKey]                       = iconName       (GenericShape*)
const byObjectType = Object.create(null);
const byShape = Object.create(null);

(function buildMaps() {
  for (const list of Object.values(ObjectPresets)) {
    if (!Array.isArray(list)) continue;
    for (const preset of list) {
      if (!preset?.icon) continue;
      const objs = preset.objects;
      if (!Array.isArray(objs) || objs.length === 0) continue;

      // Use the FIRST object of the preset to attach the icon. Multi-object
      // structures get their icon attached at group level (see placement
      // system), not per-instance — so leaf instances inside structures still
      // get their own per-shape/per-objectType icon, which is what we want.
      const o = objs[0];
      const ot = o.objectType;
      if (!ot) continue;

      if (ot === "GenericShape" || ot === "GenericScatterShape") {
        const shape = o.parameters?.shape;
        if (shape && !byShape[shape]) byShape[shape] = preset.icon;
        // also record an objectType fallback (covers shape-less variants)
        if (!byObjectType[ot]) byObjectType[ot] = preset.icon;
      } else {
        if (!byObjectType[ot]) byObjectType[ot] = preset.icon;
      }
    }
  }
})();

/**
 * Resolve the icon NAME (key into `iconList`) for a runtime instance.
 * Returns "" when no mapping exists.
 *
 * @param {*} instance Level-editor instance (must expose `objectType.name`
 *                     and, for GenericShape/-Scatter, `.shape`).
 */
export function getIconNameForInstance(instance) {
  if (!instance) return "";
  const otName = instance.objectType?.name || "";
  if (otName === "GenericShape" || otName === "GenericScatterShape") {
    const shape = instance.shape;
    if (shape && byShape[shape]) return byShape[shape];
    return byObjectType[otName] || "";
  }
  return byObjectType[otName] || "";
}

/**
 * Resolve and return the SVG markup string for an instance's icon.
 * Returns "" if there is no mapping or the icon name isn't registered in
 * iconList.
 */
export function getIconForInstance(instance) {
  const name = getIconNameForInstance(instance);
  if (!name) return "";
  return iconList[name] || "";
}

/**
 * Look up an icon by name (used for groups whose icon comes from the source
 * preset). Returns "" when missing.
 */
export function getIconByName(name) {
  if (!name) return "";
  return iconList[name] || "";
}
