import { selectableObjects, types } from "../objectTypeDefinitions.js";

// Serialized validation adapter.
//
// The validation rules in `levelValidator.js` are written against a live C3
// runtime: they iterate `selectableObjects`, call
// `runtime.objects[name].getAllInstances()`, and read live instance getters
// (`instance.x`, `instance.width`, `instance.xScale`, `instance.text`, ...).
//
// To run those *same* rules against a non-active level (which only exists as
// serialized JSON in `projectManager.currentProject.levels`), this module builds
// a fake runtime exposing the same shape, plus per-instance wrappers exposing the
// getters the rules read.
//
// Parity note: rather than re-deriving the property -> getter mapping by hand, we
// replay the real `types[key].onChange` handlers onto a plain object. That keeps
// us in lockstep with how the editor configures live instances (e.g. `scale`
// values pass through `invertScale`, so `xScale === 0` detection matches).

// Property keys whose onChange we replay to populate the getters the rules read:
//   position -> x, y, zElevation
//   size3D   -> width, height, zHeight
//   size2D   -> width, height
//   scale    -> xScale, yScale, zScale (via invertScale)
//   text     -> text
// Everything else (color, material, model, ...) is irrelevant to validation and
// often needs a live runtime, so we skip it.
const VALIDATION_PROP_KEYS = new Set([
  "position",
  "size2D",
  "size3D",
  "scale",
  "text",
]);

/**
 * Build a live-instance-shaped wrapper from a serialized instance, exposing only
 * the getters the validation rules read.
 * @param {Object} instanceData - serialized instance `{ objectType, properties, uid }`
 * @returns {Object} a plain object with `uid` plus the mapped getters
 */
export function wrapSerializedInstance(instanceData) {
  // `_source` keeps a live reference to the original serialized instance object.
  // When a level is loaded (e.g. switching to it), the editor reassigns uids in
  // place on that very object (`stateManager.createInstanceFromState`), so
  // `_source.uid` becomes the live uid afterwards — letting cross-level issue
  // links resolve to the real instance after a switch.
  const inst = { uid: instanceData?.uid, _source: instanceData };
  const properties = instanceData?.properties || {};

  for (const key of Object.keys(properties)) {
    if (!VALIDATION_PROP_KEYS.has(key)) continue;
    const handler = types[key];
    if (!handler || typeof handler.onChange !== "function") continue;
    try {
      // Mirror the call shape in `instanceCreator.applyPropertyToInstance`.
      handler.onChange(properties[key], inst, { isEditor: true, runtime: null });
    } catch (e) {
      // Handlers that touch a live runtime/visuals don't feed validation getters;
      // skip them quietly.
    }
  }

  return inst;
}

/**
 * Build a fake runtime over a serialized level so the existing `LevelValidator`
 * rules can run against it unchanged. Used by `LevelValidator.validateLevel()` for
 * every level — including the currently open one (serialized on the fly). The
 * returned `levelData` is what `LevelValidator.getLevelData()` reports during the
 * pass so the `levelTimes`/position-bounds rules target this level.
 *
 * @param {Object} levelStructure - `{ name, instances, levelData, metaData }`
 * @returns {{ objects: Object, levelData: Object|null }}
 */
export function createSerializedRuntime(levelStructure) {
  const instances = levelStructure?.instances || [];

  // Every selectable type must have an entry: the size/position rules iterate
  // `selectableObjects` and call getAllInstances() unconditionally.
  const byType = new Map();
  for (const name of selectableObjects) byType.set(name, []);

  for (const data of instances) {
    // Serialized `objectType` is the editor name, which is exactly the key the
    // rules (and live editor runtime) use — no game-load remapping here.
    const type = data?.objectType;
    if (!type) continue;
    if (!byType.has(type)) byType.set(type, []);
    byType.get(type).push(wrapSerializedInstance(data));
  }

  const objects = {};
  for (const [name, list] of byType) {
    objects[name] = { getAllInstances: () => list };
  }

  return {
    objects,
    levelData: levelStructure?.levelData || null,
  };
}
