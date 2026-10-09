// api/labelStore.js — runtime per-instance label data (labels + variable
// overrides), stashed at level load and read by the GameObject facade.
//
// Populated by levelLoader.createLevelObjects from SERIALIZED data only
// (instanceData.labels / instanceData.labelVars + the level's labelDictionary),
// so it behaves identically in editor test-play and the shipped game. Values a
// script assigns through obj[labelName][varKey] live here for the duration of
// the level — they are never written back to the level file.

const labelDataOf = new WeakMap();

/**
 * @param {object} instance   Construct instance
 * @param {Array<{id:string,name:string,vars:Array}>} labels  resolved label records
 * @param {object} overrides  { [labelId]: { [key]: value } } (sparse)
 */
export function stashLabelData(instance, labels, overrides) {
  if (!instance) return;
  const o = {};
  if (overrides && typeof overrides === "object") {
    for (const [labelId, bucket] of Object.entries(overrides)) {
      if (bucket && typeof bucket === "object") o[labelId] = { ...bucket };
    }
  }
  labelDataOf.set(instance, {
    labels: Array.isArray(labels) ? labels : [],
    overrides: o,
  });
}

/** @returns {{labels:Array, overrides:object} | undefined} */
export function getLabelData(instance) {
  return instance ? labelDataOf.get(instance) : undefined;
}
