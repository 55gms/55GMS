// Base geometry of each 3D object type at rotation (0,0,0) and scale (1,1,1),
// harvested once from the editor via a read-only scan of unrotated instances.
//
// Keyed by `instance.objectType.name`. All values are in world units:
//   w / h / d     — full local size along the object's local X / Y / Z axes
//   ox / oy / oz  — the bounding-box center relative to the instance origin
//                   (instance.x, instance.y, instance.totalZElevation)
//
// 3D models only expose an axis-aligned WORLD AABB at runtime, which loses all
// aspect information once the model is rotated (it's rotationally symmetric at
// 45°). This table lets the box-scale gizmo build a correct oriented box from
// known local geometry instead: at a given scale the local extents are
// base / scale (scale is stored reciprocally), the center is the origin offset
// scaled the same way and rotated by the model's rotation. Exact at any angle.
//
// To regenerate (e.g. after adding/resizing models), re-run the harvester
// snippet against a level containing one unrotated instance of each type.
export const MODEL_BASE_SIZES = {
  cctvCamera: {
    w: 74.879,
    h: 49.487,
    d: 45.123,
    ox: 37.105,
    oy: -7.23,
    oz: 16.959,
  },
  Cone: { w: 55.943, h: 55.943, d: 72.029, ox: 0, oy: 0, oz: 36.275 },
  Pipe: { w: 47.165, h: 23.297, d: 459.766, ox: 11.934, oy: 0, oz: 229.433 },
  cable: { w: 662.931, h: 3.283, d: 61.496, ox: 1.016, oy: 0, oz: 35.603 },
  edgeTarp: {
    w: 272.254,
    h: 162.523,
    d: 125.219,
    ox: 128.598,
    oy: -74.866,
    oz: 63.556,
  },
  cornerTarp: {
    w: 320.374,
    h: 376.689,
    d: 74.723,
    ox: -160.368,
    oy: -26.022,
    oz: 36.999,
  },
  pole: { w: 11.867, h: 11.867, d: 385.324, ox: 0, oy: 0, oz: 193.168 },
  snowman: {
    w: 111.057,
    h: 115.187,
    d: 190.767,
    ox: -0.399,
    oy: -3.405,
    oz: 96.392,
  },
  railing: { w: 528.555, h: 6.526, d: 113.139, ox: 0, oy: 0, oz: 56.603 },
  brokenConcretePillar: {
    w: 51.589,
    h: 51.589,
    d: 134.353,
    ox: 0,
    oy: 0,
    oz: 67.267,
  },
  wireMesh: {
    w: 302.265,
    h: 7.212,
    d: 276.369,
    ox: 0.153,
    oy: -0.188,
    oz: 137.704,
  },
  trash: {
    w: 139.692,
    h: 112.006,
    d: 41.883,
    ox: 6.398,
    oy: 12.559,
    oz: 15.129,
  },
  trashBag: {
    w: 76.149,
    h: 79.414,
    d: 81.786,
    ox: 3.481,
    oy: -3.071,
    oz: 36.266,
  },
  rocks: { w: 95.461, h: 71.385, d: 48.508, ox: 2.299, oy: -2.701, oz: 15.213 },
  cardboardBoxProp: {
    w: 85.739,
    h: 83.913,
    d: 40.742,
    ox: 0.845,
    oy: -0.181,
    oz: 20.541,
  },
  grass: { w: 95.079, h: 71.633, d: 67.042, ox: 0.99, oy: -5.584, oz: 21.539 },
  levelEditorCharacter: {
    w: 66.34,
    h: 52.869,
    d: 150.243,
    ox: 6.126,
    oy: 4.02,
    oz: 74.808,
  },
};

// Read-only console snippet that regenerates the table above. Kept here so the
// failsafe can print it verbatim when a model type is missing.
export const MODEL_BASE_SIZES_HARVESTER = `(() => {
  const rt = globalThis._editorScope.runtime;
  const sdkrt = globalThis._editorScope.sdk_runtime;
  const table = {}, rotatedOnly = new Set();
  for (const name in rt.objects) {
    let insts; try { insts = rt.objects[name].getAllInstances(); } catch (e) { continue; }
    if (!insts || !insts.length) continue;
    if (!(insts[0] instanceof self.I3DObjectInstance)) continue;
    for (const inst of insts) {
      const rotOK = Math.abs(inst.xAngle||0)<0.01 && Math.abs(inst.yAngle||0)<0.01 && Math.abs(inst.zAngle||0)<0.01;
      if (!rotOK) { rotatedOnly.add(name); continue; }
      try {
        const sdk = sdkrt.GetInstanceByUID(inst.uid)._sdkInst;
        if (!sdk || !sdk.loaded) continue;
        sdk._updateBoundingBox(inst.x, inst.y, inst.totalZElevation, sdk.gpuSkinning);
        const mn = sdk.xMinBB, mx = sdk.xMaxBB;
        const sx = inst.xScale||1, sy = inst.yScale||1, sz = inst.zScale||1;
        const cx = (mn[0]+mx[0])/2, cy = (mn[1]+mx[1])/2, cz = (mn[2]+mx[2])/2;
        table[name] = {
          w: +((mx[0]-mn[0]) * sx).toFixed(3), h: +((mx[1]-mn[1]) * sy).toFixed(3), d: +((mx[2]-mn[2]) * sz).toFixed(3),
          ox: +((cx - inst.x) * sx).toFixed(3), oy: +((cy - inst.y) * sy).toFixed(3), oz: +((cz - inst.totalZElevation) * sz).toFixed(3),
        };
        rotatedOnly.delete(name); break;
      } catch (e) {}
    }
  }
  console.log("MODEL_BASE_SIZES = " + JSON.stringify(table, null, 2));
  if (rotatedOnly.size) console.log("only-rotated (need one unrotated instance):", [...rotatedOnly]);
  console.log("captured", Object.keys(table).length, "types");
})();`;

const _warnedMissingModelTypes = new Set();

// Look up a model's base geometry by `instance.objectType.name`. If the type is
// missing from the table, return null and (once per type) warn in the console
// and alert the user with the steps + snippet needed to capture it. Callers
// should treat null as "fall back to the axis-aligned world AABB".
export function getModelBaseSize(objectTypeName) {
  if (objectTypeName && MODEL_BASE_SIZES[objectTypeName]) {
    return MODEL_BASE_SIZES[objectTypeName];
  }
  const key = objectTypeName || "<unknown>";
  if (!_warnedMissingModelTypes.has(key)) {
    _warnedMissingModelTypes.add(key);
    console.warn(
      `[MODEL_BASE_SIZES] 3D model "${key}" is missing from the base-size table ` +
        `its box-scale gizmo and selection outline fall back to a loose axis-aligned box.\n` +
        `To fix: open a level with an UNROTATED instance of "${key}", open the devtools ` +
        `console, run the snippet below, then add its "${key}" entry to ` +
        `scripts/levelEditor/model3DBaseSizes.js:\n\n` +
        MODEL_BASE_SIZES_HARVESTER,
    );
    try {
      alert(
        `3D model "${key}" is missing from MODEL_BASE_SIZES.\n\n` +
          `Its box-scale gizmo / outline will use a loose axis-aligned box until it's added.\n\n` +
          `To capture it:\n` +
          `1. Open a level containing an UNROTATED instance of "${key}".\n` +
          `2. Open the browser devtools console (F12).\n` +
          `3. Run the harvester snippet (printed in the console with this warning).\n` +
          `4. Add the "${key}" entry from its output to scripts/levelEditor/model3DBaseSizes.js.`,
      );
    } catch (e) {
      // alert may be unavailable (headless) — the console.warn still fired.
    }
  }
  return null;
}
