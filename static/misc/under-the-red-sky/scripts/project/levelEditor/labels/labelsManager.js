// LabelsManager — CRUD over `levelData.labelDictionary` (id-keyed).
//
// Schema (per master plan, id-based):
//   levelData.labelDictionary: { [id]: { id, name, color, vars? } }
//   instanceMeta.labels:       Array<id>
//   instanceMeta.labelVars:    { [labelId]: { [varKey]: value } }  (sparse overrides)
//
// Label variables (see labelVarTypes.js): `vars` is the per-label schema
// (`[{ key, type, default, ... }]`); every instance carrying the label has an
// effective value per var = its override ?? the def default. Scripts read/write
// them as obj[labelName][varKey].
//
// All mutation paths route through here so undo descriptions stay
// human-readable (the underlying levelSettings.updateLevelData call already
// pushes an undo state with a generic "Change labelDictionary" message; we
// follow it with a more descriptive pushUndoState that coalesces).
//
// Cascade semantics:
//   - deleteLabel strips the deleted id from every instanceMeta.labels and
//     emits a single undo entry for the whole operation.
//   - rename / recolor never touch instance meta.
//
// Color allocation:
//   - createLabel assigns the first PRESET_COLORS entry not already used by
//     another label. If all colors are used, cycles by modulo. User can
//     edit the color afterwards via the dictionary dialog.
//
// Public API is intentionally small; UI layers (inspector chips, hierarchy
// chips, dictionary dialog) read directly via `getDictionary()` / `getLabel()`.

import { getPresetColors } from "../paletteColors.js";
import {
  normalizeVarDefs,
  normalizeVarValue,
  isValidVarKey,
  getVarType,
  varDefault,
} from "./labelVarTypes.js";

let _idCounter = 0;
function makeLabelId() {
  // Time-based + counter is plenty unique for editor-local data.
  _idCounter = (_idCounter + 1) % 0xffff;
  return `lbl_${Date.now().toString(36)}_${_idCounter.toString(36)}`;
}

export class LabelsManager {
  // Convenience getters --------------------------------------------------

  _ls() {
    return globalThis._editorScope?.levelSettings;
  }
  _sm() {
    return globalThis._editorScope?.stateManager;
  }

  /** Snapshot of the dictionary (id -> {id, name, color}). Caller must not mutate. */
  getDictionary() {
    const ls = this._ls();
    if (!ls) return {};
    return ls.getLevelData()?.labelDictionary || {};
  }

  /**
   * Live (non-cloning) reference to the dictionary for hot read paths
   * (inspector/hierarchy renders). Never mutate the result.
   */
  getDictionaryRef() {
    const ls = this._ls();
    if (!ls) return {};
    return ls.getLevelDataRef?.()?.labelDictionary || {};
  }

  /** Lookup a single label by id. Returns null when missing. */
  getLabel(id) {
    if (!id) return null;
    return this.getDictionary()[id] || null;
  }

  /** Normalized var defs for a label (always an array, malformed entries dropped). */
  getVars(id) {
    const l = this.getDictionaryRef()[id];
    return l ? normalizeVarDefs(l.vars) : [];
  }

  /** Sorted list of {id, name, color}, ordered alphabetically by name. */
  listLabels() {
    const dict = this.getDictionary();
    return Object.values(dict).sort((a, b) =>
      String(a.name || "").localeCompare(String(b.name || ""))
    );
  }

  // Mutations ------------------------------------------------------------

  /**
   * Broadcast that something label-related changed. Inspector + hierarchy
   * panel both subscribe to keep their UIs in sync without each mutation
   * site needing to know all the listeners.
   */
  _emit() {
    document.dispatchEvent(new CustomEvent("editor:labels-changed"));
  }

  /**
   * Per-instance variable VALUE edits only. Deliberately a different event
   * from `editor:labels-changed`: the inspector rebuilds its var sections on
   * the latter (schema/membership), but must only refresh values in place on
   * this one so a drag on a number field isn't interrupted by a DOM rebuild.
   */
  _emitVars() {
    document.dispatchEvent(new CustomEvent("editor:label-vars-changed"));
  }

  /**
   * Create a new label. `name` must be non-empty; if the name already
   * exists, the existing label is returned (no duplicate).
   * @returns {{id, name, color} | null}
   */
  createLabel(name) {
    const trimmed = String(name || "").trim();
    if (!trimmed) return null;

    const ls = this._ls();
    const sm = this._sm();
    if (!ls) return null;

    // Reuse an existing label with the same name (case-insensitive) instead
    // of producing a duplicate the user has to clean up later.
    const existing = this.listLabels().find(
      (l) => l.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) return existing;

    const dict = { ...this.getDictionary() };
    const id = makeLabelId();
    const color = this._pickNextColor(dict);
    dict[id] = { id, name: trimmed, color };

    ls.updateLevelData("labelDictionary", dict);
    if (sm) sm.pushUndoState(`Create Label "${trimmed}"`);
    this._emit();
    return dict[id];
  }

  /** Rename an existing label. No-op when name unchanged or label missing. */
  renameLabel(id, newName) {
    const trimmed = String(newName || "").trim();
    if (!trimmed) return false;
    const dict = { ...this.getDictionary() };
    const cur = dict[id];
    if (!cur || cur.name === trimmed) return false;
    dict[id] = { ...cur, name: trimmed };
    const ls = this._ls();
    const sm = this._sm();
    if (!ls) return false;
    ls.updateLevelData("labelDictionary", dict);
    if (sm) sm.pushUndoState(`Rename Label → "${trimmed}"`);
    this._emit();
    return true;
  }

  /** Recolor an existing label. Pass any valid hex string. */
  setLabelColor(id, color) {
    if (!color) return false;
    const dict = { ...this.getDictionary() };
    const cur = dict[id];
    if (!cur || cur.color === color) return false;
    dict[id] = { ...cur, color };
    const ls = this._ls();
    const sm = this._sm();
    if (!ls) return false;
    ls.updateLevelData("labelDictionary", dict);
    if (sm) sm.pushUndoState(`Recolor Label "${cur.name}"`);
    this._emit();
    return true;
  }

  /**
   * Delete a label and cascade-strip it from every instance that referenced
   * it. All changes coalesce into a single undo entry.
   *
   * Returns the number of instances that were touched.
   */
  deleteLabel(id) {
    const dict = { ...this.getDictionary() };
    const cur = dict[id];
    if (!cur) return 0;
    delete dict[id];

    const ls = this._ls();
    const sm = this._sm();
    if (!ls) return 0;

    // Strip from every instance meta first so the dictionary edit + meta
    // edits land inside the same coalesce window — single undo entry.
    let touched = 0;
    if (sm) {
      // Iterate the live meta map; setInstanceMeta will drop empty entries.
      for (const [uid, meta] of sm.instanceMeta.entries()) {
        const hasLabel = meta?.labels?.includes(id);
        const hasVars = !!meta?.labelVars?.[id];
        if (!hasLabel && !hasVars) continue;
        const next = (meta.labels || []).filter((lid) => lid !== id);
        const labelVars = { ...(meta.labelVars || {}) };
        delete labelVars[id];
        sm.setInstanceMeta(uid, { ...meta, labels: next, labelVars });
        touched++;
      }
    }

    ls.updateLevelData("labelDictionary", dict);
    if (sm) sm.pushUndoState(`Delete Label "${cur.name}"`);
    this._emit();
    return touched;
  }

  // Per-instance label membership ---------------------------------------

  /**
   * Add a label id to a set of instances (idempotent per instance).
   * @param {Iterable<number|string>} uids
   * @param {string} labelId
   */
  addLabelToInstances(uids, labelId) {
    const dict = this.getDictionary();
    if (!dict[labelId]) return 0;
    const sm = this._sm();
    if (!sm) return 0;
    let touched = 0;
    for (const uid of uids) {
      const meta = sm.getInstanceMeta(uid);
      if (meta.labels.includes(labelId)) continue;
      sm.setInstanceMeta(uid, {
        ...meta,
        labels: [...meta.labels, labelId],
      });
      touched++;
    }
    if (touched > 0) {
      sm.pushUndoState(
        `Add Label "${dict[labelId].name}" to ${touched} object${touched === 1 ? "" : "s"}`
      );
      this._emit();
    }
    return touched;
  }

  /**
   * Remove a label id from a set of instances (no-op per instance lacking it).
   */
  removeLabelFromInstances(uids, labelId) {
    const dict = this.getDictionary();
    const sm = this._sm();
    if (!sm) return 0;
    let touched = 0;
    for (const uid of uids) {
      const meta = sm.getInstanceMeta(uid);
      if (!meta.labels.includes(labelId)) continue;
      const labelVars = { ...meta.labelVars };
      delete labelVars[labelId];
      sm.setInstanceMeta(uid, {
        ...meta,
        labels: meta.labels.filter((lid) => lid !== labelId),
        labelVars,
      });
      touched++;
    }
    if (touched > 0) {
      const name = dict[labelId]?.name || "label";
      sm.pushUndoState(
        `Remove Label "${name}" from ${touched} object${touched === 1 ? "" : "s"}`
      );
      this._emit();
    }
    return touched;
  }

  /**
   * Compute the intersection of label ids across a multi-selection, in
   * stable order (first instance's order wins). Returns [] for empty input.
   */
  intersectionOfLabels(uids) {
    const sm = this._sm();
    if (!sm) return [];
    const arr = Array.from(uids);
    if (arr.length === 0) return [];
    const first = sm.getInstanceMeta(arr[0]).labels.slice();
    if (arr.length === 1) return first;
    const sets = arr.slice(1).map((u) => new Set(sm.getInstanceMeta(u).labels));
    return first.filter((id) => sets.every((s) => s.has(id)));
  }

  // Label variables — schema ---------------------------------------------

  _writeVars(id, vars, undoMsg) {
    const dict = { ...this.getDictionary() };
    const cur = dict[id];
    if (!cur) return false;
    dict[id] = { ...cur, vars: normalizeVarDefs(vars) };
    const ls = this._ls();
    const sm = this._sm();
    if (!ls) return false;
    ls.updateLevelData("labelDictionary", dict);
    if (sm && undoMsg) sm.pushUndoState(undoMsg);
    this._emit();
    return true;
  }

  /**
   * Add a variable to a label's schema. `def` needs at least { key, type };
   * default/options fall back to the type defaults. Returns the normalized def
   * or null when the key is invalid / duplicate / type unknown.
   */
  addVar(id, def) {
    const cur = this.getDictionaryRef()[id];
    if (!cur) return null;
    const key = String(def?.key || "").trim();
    if (!isValidVarKey(key) || !getVarType(def?.type)) return null;
    const vars = this.getVars(id);
    if (vars.some((v) => v.key === key)) return null;
    const next = normalizeVarDefs([...vars, { ...def, key }]);
    const added = next.find((v) => v.key === key) || null;
    if (!added) return null;
    this._writeVars(id, next, `Add variable "${key}" to Label "${cur.name}"`);
    return added;
  }

  /**
   * Patch a variable def (rename via `patch.key`, retype, change default,
   * options, number bounds). Renaming moves per-instance overrides to the new
   * key; retyping drops them (their shape no longer matches).
   */
  updateVar(id, key, patch) {
    const cur = this.getDictionaryRef()[id];
    if (!cur) return false;
    const vars = this.getVars(id);
    const idx = vars.findIndex((v) => v.key === key);
    if (idx === -1) return false;
    const old = vars[idx];
    const merged = { ...old, ...patch };
    const newKey = String(merged.key || "").trim();
    if (!isValidVarKey(newKey) || !getVarType(merged.type)) return false;
    if (newKey !== key && vars.some((v) => v.key === newKey)) return false;
    merged.key = newKey;
    const retyped = merged.type !== old.type;
    if (retyped && patch.default === undefined) delete merged.default;
    const next = vars.slice();
    next[idx] = merged;

    const sm = this._sm();
    if (sm && (newKey !== key || retyped)) {
      for (const [uid, meta] of sm.instanceMeta.entries()) {
        const bucket = meta?.labelVars?.[id];
        if (!bucket || bucket[key] === undefined) continue;
        const nb = { ...bucket };
        const v = nb[key];
        delete nb[key];
        if (!retyped) nb[newKey] = v;
        const labelVars = { ...meta.labelVars, [id]: nb };
        if (Object.keys(nb).length === 0) delete labelVars[id];
        sm.setInstanceMeta(uid, { ...meta, labelVars });
      }
    }
    const what =
      newKey !== key
        ? `Rename variable "${key}" → "${newKey}"`
        : retyped
          ? `Change type of variable "${key}"`
          : `Edit variable "${key}"`;
    return this._writeVars(id, next, `${what} (Label "${cur.name}")`);
  }

  /** Remove a variable from a label's schema and strip its overrides everywhere. */
  removeVar(id, key) {
    const cur = this.getDictionaryRef()[id];
    if (!cur) return false;
    const vars = this.getVars(id);
    if (!vars.some((v) => v.key === key)) return false;
    const sm = this._sm();
    if (sm) {
      for (const [uid, meta] of sm.instanceMeta.entries()) {
        const bucket = meta?.labelVars?.[id];
        if (!bucket || bucket[key] === undefined) continue;
        const nb = { ...bucket };
        delete nb[key];
        const labelVars = { ...meta.labelVars, [id]: nb };
        if (Object.keys(nb).length === 0) delete labelVars[id];
        sm.setInstanceMeta(uid, { ...meta, labelVars });
      }
    }
    return this._writeVars(
      id,
      vars.filter((v) => v.key !== key),
      `Remove variable "${key}" from Label "${cur.name}"`,
    );
  }

  /** Reorder: move var `key` to index `toIndex`. */
  moveVar(id, key, toIndex) {
    const cur = this.getDictionaryRef()[id];
    if (!cur) return false;
    const vars = this.getVars(id);
    const from = vars.findIndex((v) => v.key === key);
    if (from === -1) return false;
    const to = Math.max(0, Math.min(vars.length - 1, toIndex));
    if (from === to) return false;
    const next = vars.slice();
    const [d] = next.splice(from, 1);
    next.splice(to, 0, d);
    return this._writeVars(id, next, `Reorder variables (Label "${cur.name}")`);
  }

  // Label variables — per-instance values ---------------------------------

  /** Effective value of `key` for one instance (override ?? default). */
  getInstanceVarValue(uid, labelId, key) {
    const def = this.getVars(labelId).find((v) => v.key === key);
    if (!def) return undefined;
    const sm = this._sm();
    const o = sm?.getInstanceMeta(uid).labelVars?.[labelId]?.[key];
    return o === undefined ? varDefault(def) : normalizeVarValue(def, o);
  }

  /**
   * Set a per-instance override for `key` on every uid. Instances that don't
   * carry the label are skipped (no orphan data). `value` may be a function
   * `(uid, currentEffectiveValue) => newValue` for per-instance edits (e.g. a
   * single axis of a vector while the other axes vary).
   */
  setInstanceLabelVar(uids, labelId, key, value) {
    const def = this.getVars(labelId).find((v) => v.key === key);
    const sm = this._sm();
    if (!def || !sm) return 0;
    let touched = 0;
    for (const uid of uids) {
      const meta = sm.getInstanceMeta(uid);
      if (!meta.labels.includes(labelId)) continue;
      const raw =
        typeof value === "function"
          ? value(uid, this.getInstanceVarValue(uid, labelId, key))
          : value;
      const v = normalizeVarValue(def, raw);
      const bucket = { ...(meta.labelVars[labelId] || {}), [key]: v };
      sm.setInstanceMeta(uid, {
        ...meta,
        labelVars: { ...meta.labelVars, [labelId]: bucket },
      });
      touched++;
    }
    if (touched > 0) {
      const name = this.getDictionaryRef()[labelId]?.name || "label";
      sm.pushUndoState(`Change ${name}.${key}`);
      this._emitVars();
    }
    return touched;
  }

  /** Remove the override for `key` (value falls back to the def default). */
  clearInstanceLabelVar(uids, labelId, key) {
    const sm = this._sm();
    if (!sm) return 0;
    let touched = 0;
    for (const uid of uids) {
      const meta = sm.getInstanceMeta(uid);
      const bucket = meta.labelVars[labelId];
      if (!bucket || bucket[key] === undefined) continue;
      const nb = { ...bucket };
      delete nb[key];
      const labelVars = { ...meta.labelVars, [labelId]: nb };
      if (Object.keys(nb).length === 0) delete labelVars[labelId];
      sm.setInstanceMeta(uid, { ...meta, labelVars });
      touched++;
    }
    if (touched > 0) {
      const name = this.getDictionaryRef()[labelId]?.name || "label";
      sm.pushUndoState(`Reset ${name}.${key}`);
      this._emitVars();
    }
    return touched;
  }

  // Internal -------------------------------------------------------------

  /** Pick the next palette color not yet used in `dict`. Cycles when full. */
  _pickNextColor(dict) {
    const palette = getPresetColors();
    if (palette.length === 0) return "#888888";
    const used = new Set(Object.values(dict).map((l) => (l.color || "").toLowerCase()));
    for (const c of palette) {
      if (!used.has(c.toLowerCase())) return c;
    }
    // All used — cycle by count.
    const idx = Object.keys(dict).length % palette.length;
    return palette[idx];
  }
}

// Singleton wiring (same pattern as groupManager).
let _instance = null;
export function initializeLabelsManager() {
  if (!_instance) _instance = new LabelsManager();
  if (globalThis._editorScope) globalThis._editorScope.labelsManager = _instance;
  return _instance;
}
export function getLabelsManager() {
  return _instance;
}
