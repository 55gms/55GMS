// api/saves.js — two in-memory key/value stores for level scripts.
//
//   LevelSave — persists across a level RESTART / player DEATH (same level id),
//               cleared when the level CHANGES.
//   PackSave  — persists between levels in the same PACK, cleared when the pack
//               changes (new pack started / pack ended).
//
// The backing objects live on ScriptRuntime (which outlives individual level
// loads) and are emptied in place by ScriptRuntime.load() when the level / pack
// id changes — see scriptRuntime.js. This module is just the script-facing API
// over a plain data object; it is storage-agnostic (in-memory only).

function makeStore(data, name) {
  return {
    get: (key) => (Object.hasOwn(data, key) ? data[key] : null),
    set: (key, value) => {
      data[String(key)] = value;
      return value;
    },
    has: (key) => Object.hasOwn(data, key),
    delete: (key) => {
      delete data[String(key)];
    },
    clear: () => {
      for (const k of Object.keys(data)) delete data[k];
    },
    keys: () => Object.keys(data),
    __docs__: {
      get: `${name}.get(key) — read a saved value (or null).`,
      set: `${name}.set(key, value) — store a value.`,
      has: `${name}.has(key) — true if a value is stored under key.`,
      delete: `${name}.delete(key) — remove a stored value.`,
      clear: `${name}.clear() — remove everything from this store.`,
      keys: `${name}.keys() — array of all stored keys.`,
    },
  };
}

// deps carries the persistent backing objects from ScriptRuntime.
export function buildLevelSave({ levelSaveData }) {
  return makeStore(levelSaveData, "LevelSave");
}
export function buildPackSave({ packSaveData }) {
  return makeStore(packSaveData, "PackSave");
}
