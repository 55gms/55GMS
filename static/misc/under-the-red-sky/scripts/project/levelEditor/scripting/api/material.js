// api/material.js — the createMaterial(...) factory + the mutable Material facade.
//
// A script builds a custom material by forking a preset (or another custom
// material, or the default), mutating its properties, then applying it to a shape:
//
//   let m = createMaterial(Material.Concrete)   // Material.* = the preset-id enum
//   m.setAllFaces(Texture.BrickTexture)
//   m.top = Texture.GlassTexture                // faces use Z-up names (see below)
//   m.groundType = GroundType.Bounce
//   obj.useCustomMaterial(m)
//
// Transparency is DERIVED from the textures used (any face on a transparent
// texture → transparent), so there is no `transparent` flag on the facade.
//
// The facade is a plain JS object with getters/setters over an internal data
// object shaped exactly like a `materials` entry. It is returned from native
// code, so passing it into useCustomMaterial() unwraps to the SAME object by
// reference (accessors + the hidden __data survive). The apply logic itself lives
// in instanceCreator.applyMaterialDataToInstance, read off __data.

import {
  materials,
  FACE_USER_TO_STORAGE,
  USER_FACES,
} from "../../objectTypeDefinitions.js";
import { resolveMaterial } from "../../materials/materialsManager.js";

// Storage-order faces (C3's own -Y-up names) for whole-material operations.
// Scripts address faces by USER-FACING (Z-up) names instead — see the accessor
// loop below, which maps each user name to its storage face.
const STORAGE_FACES = ["front", "back", "left", "right", "top", "bottom"];

// Material data is pure JSON (strings/numbers/booleans/nested objects) — a
// round-trip is a safe deep clone and severs all shared references to `materials`.
function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

// Resolve the factory argument to a fresh data object (always a clone, never a
// reference into `materials` or another facade).
function resolveData(arg) {
  if (arg == null) return cloneData(materials.default);
  if (typeof arg === "string") {
    // Built-in preset (Material.*) or custom id (CustomMaterials.*). resolveMaterial
    // checks built-ins + editor manager + runtime registry, so this works in-game.
    const preset = resolveMaterial(arg);
    if (!preset) {
      console.warn(
        `[script] createMaterial: unknown material "${arg}", using default`,
      );
      return cloneData(materials.default);
    }
    return cloneData(preset);
  }
  // A Material facade (forking an existing custom material).
  if (arg.__data) return cloneData(arg.__data);
  console.warn("[script] createMaterial: invalid argument, using default");
  return cloneData(materials.default);
}

function defineScalar(facade, name, get, set) {
  Object.defineProperty(facade, name, {
    enumerable: true,
    configurable: true,
    get,
    set,
  });
}

function makeMaterialFacade(data) {
  const facade = {};

  defineScalar(
    facade,
    "zTilingFactor",
    () => data.zTilingFactor ?? 1,
    (v) => {
      data.zTilingFactor = v;
    },
  );
  defineScalar(
    facade,
    "label",
    () => data.label ?? "",
    (v) => {
      data.label = v;
    },
  );

  // meta-backed scalars
  data.meta = data.meta || {};
  for (const key of [
    "groundType",
    "soundType",
    "isWallrunable",
    "isWallClimbable",
  ]) {
    defineScalar(
      facade,
      key,
      () => data.meta[key],
      (v) => {
        data.meta[key] = v;
      },
    );
  }

  // Faces are exposed by USER-FACING (Z-up) names; each maps to the C3 storage
  // face. So `material.top` reads/writes the stored `front` face, etc. — the
  // names a UTRS author expects, without touching the stored data shape.
  for (const face of USER_FACES) {
    const storage = FACE_USER_TO_STORAGE[face];
    defineScalar(
      facade,
      face,
      () => data[storage]?.objectType ?? data[storage]?.image ?? null,
      (v) => {
        data[storage] = { objectType: v };
      },
    );
  }

  facade.setAllFaces = (objectType) => {
    for (const face of STORAGE_FACES) data[face] = { objectType };
    return facade;
  };

  // Hidden data handle for useCustomMaterial (skipped by autocomplete).
  Object.defineProperty(facade, "__data", {
    enumerable: false,
    get: () => data,
  });

  facade.__docs__ = {
    zTilingFactor: "material.zTilingFactor — texture tiling factor (number).",
    label: "material.label — display name (string).",
    groundType:
      "material.groundType — ground physics type; a GroundType enum value.",
    soundType:
      "material.soundType — footstep sound type; a SoundType enum value.",
    isWallrunable: "material.isWallrunable — can be wall-run on (boolean).",
    isWallClimbable:
      "material.isWallClimbable — can be wall-climbed (boolean).",
    front: "material.front — front-face texture; a Texture enum value.",
    back: "material.back — back-face texture; a Texture enum value.",
    left: "material.left — left-face texture; a Texture enum value.",
    right: "material.right — right-face texture; a Texture enum value.",
    top: "material.top — top-face texture; a Texture enum value.",
    bottom: "material.bottom — bottom-face texture; a Texture enum value.",
    setAllFaces:
      "material.setAllFaces(texture) — set all six faces to one Texture; returns the material.",
  };

  return facade;
}

// createMaterial(idOrMaterialObject?) — fork a preset id, another custom material,
// or (no arg) the default; returns a mutable Material facade.
export function buildCreateMaterial() {
  return (arg) => makeMaterialFacade(resolveData(arg));
}

// A representative facade for editor autocomplete (createMaterial(...).<member>).
export function materialSchema() {
  return makeMaterialFacade(cloneData(materials.default));
}
