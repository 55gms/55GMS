// Content hash for a level — used to detect when a level has changed enough that
// recorded ghost paths should be considered obsolete.
//
// Per design: a ghost is obsolete when
// "any instance, the script, or any level data that isn't an editor value / star
// time / playlist" changes. We implement that by EXCLUSION:
//   - instances: hashed by `objectType` + `properties` only (NOT `uid`, which is
//     reassigned on every load, and NOT editor sidecar fields).
//   - levelData: everything EXCEPT the keys below.
//
// `extraData` MUST be excluded: it holds the ghost paths themselves, so including
// it would change the hash every time a ghost is saved — instantly obsoleting all
// ghosts.

const EXCLUDED_LEVELDATA_KEYS = new Set([
  "levelTimes", // star times
  "levelPlaylist", // playlist
  "gridSettings", // editor value
  "cameraSettings", // editor value
  "groups", // editor value
  "labelDictionary", // editor value
  "extraData", // ghosts (+ other sidecar) live here — would self-invalidate
]);

// Deterministic stringify: object keys sorted recursively so key-order differences
// don't change the hash.
function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value) ?? "null";
  }
  if (Array.isArray(value)) {
    return "[" + value.map(stableStringify).join(",") + "]";
  }
  const keys = Object.keys(value).sort();
  return (
    "{" +
    keys
      .map((k) => JSON.stringify(k) + ":" + stableStringify(value[k]))
      .join(",") +
    "}"
  );
}

// FNV-1a 32-bit string hash → hex. No crypto needed; we only need change detection.
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

// Only the gameplay-relevant identity of an instance (no uid, no editor sidecar).
// Label VARIABLE overrides are gameplay data (scripts read them), so they are
// included when present; plain label membership stays excluded as before.
function hashableInstance(inst) {
  const out = { objectType: inst?.objectType, properties: inst?.properties ?? {} };
  const lv = inst?.labelVars;
  if (lv && typeof lv === "object" && Object.keys(lv).length > 0) out.labelVars = lv;
  return out;
}

// The label dictionary is an editor value EXCEPT its variable schemas (their
// defaults feed scripts). Project only labels that define vars, by name, so a
// level with no label variables hashes exactly as before.
function hashableLabelVars(dict) {
  const out = [];
  for (const l of Object.values(dict || {})) {
    if (!l || !Array.isArray(l.vars) || l.vars.length === 0) continue;
    out.push({ name: l.name, vars: l.vars });
  }
  out.sort((a, b) => String(a.name).localeCompare(String(b.name)));
  return out;
}

/**
 * Compute a stable content hash for a level structure.
 * @param {Object} levelStructure - `{ instances, levelData, ... }` (a stored level
 *   or `stateManager.currentState` for the open level).
 * @returns {string} hash hex string ("0" for an empty/missing level).
 */
export function computeLevelContentHash(levelStructure) {
  if (!levelStructure) return "0";

  // Sort per-instance canonical strings so instance ordering never affects the
  // hash (load order can differ from save order).
  const instanceStrings = (levelStructure.instances || [])
    .map((inst) => stableStringify(hashableInstance(inst)))
    .sort();

  const rawLevelData = levelStructure.levelData || {};
  const levelData = {};
  for (const key of Object.keys(rawLevelData)) {
    if (!EXCLUDED_LEVELDATA_KEYS.has(key)) levelData[key] = rawLevelData[key];
  }

  const labelVars = hashableLabelVars(rawLevelData.labelDictionary);
  const payload = { i: instanceStrings, d: levelData };
  if (labelVars.length > 0) payload.lv = labelVars;
  return fnv1a(stableStringify(payload));
}
