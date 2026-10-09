// MaterialsManager — CRUD over per-project custom materials.
//
// Storage:
//   sharedData.customMaterials: { [id]: <material data> }
//
// A "material data" object uses the SAME shape as the built-in `materials`
// entries in objectTypeDefinitions.js:
//   { value, label, zTilingFactor, transparent,
//     meta: { groundType, soundType, isWallrunable, isWallClimbable },
//     back/front/left/right/top/bottom: { objectType } | { image },
//     cubeHeightRatio?, cubeDepthRatio?, cubeTopVisibility? }
//
// Unlike LabelsManager (which lives in per-level levelData and rides the undo
// stack), custom materials live in per-project sharedData, which is OUTSIDE the
// per-level undo stack — exactly like customStructures. Material create/update/
// delete are therefore NOT undoable; deletion is gated behind a confirm dialog
// (see materialsDialog.js). The per-instance reassignment that happens on delete
// goes through the normal instance properties (which ARE serialized), but we do
// not push an undo state for it to keep the whole operation consistent (the
// material it pointed at is gone for good).
//
// UI layers (inspector selector, dialog) read directly via listMaterials() /
// getMaterial() and refresh on the "editor:materials-changed" DOM event.

import { materials, applyMaterialToInstance } from "../objectTypeDefinitions.js";

let _idCounter = 0;
function makeMaterialId() {
  _idCounter = (_idCounter + 1) % 0xffff;
  return `mat_${Date.now().toString(36)}_${_idCounter.toString(36)}`;
}

/**
 * Build a fresh default material data object (a clone of the built-in "default"
 * material) carrying the given id + label. Used as the starting point for a new
 * custom material the user then edits.
 */
export function makeDefaultMaterialData(id, label) {
  const base = JSON.parse(JSON.stringify(materials.default));
  base.value = id;
  base.label = label;
  return base;
}

export class MaterialsManager {
  // Convenience getters --------------------------------------------------

  _pm() {
    return globalThis._editorScope?.projectManager;
  }
  _sm() {
    return globalThis._editorScope?.stateManager;
  }

  /** Snapshot of the custom-material map (id -> data). Caller must not mutate. */
  getCustomMaterials() {
    const pm = this._pm();
    if (!pm || !pm.hasProjectLoaded?.()) return {};
    return pm.getSharedData()?.customMaterials || {};
  }

  /** Lookup a single CUSTOM material by id. Returns null when missing. */
  getMaterial(id) {
    if (!id) return null;
    return this.getCustomMaterials()[id] || null;
  }

  hasMaterial(id) {
    return !!this.getMaterial(id);
  }

  /** Sorted list of custom material data objects, ordered by label. */
  listMaterials() {
    return Object.values(this.getCustomMaterials()).sort((a, b) =>
      String(a.label || "").localeCompare(String(b.label || "")),
    );
  }

  /**
   * Resolve an id against the MERGED set (built-ins + custom). This is the
   * single lookup both apply paths use so custom ids flow through the existing
   * apply logic. Returns null when the id matches neither.
   */
  getMaterialById(id) {
    if (!id) return null;
    return materials[id] || this.getCustomMaterials()[id] || null;
  }

  // Mutations ------------------------------------------------------------

  _emit() {
    document.dispatchEvent(new CustomEvent("editor:materials-changed"));
  }

  _persist(map) {
    const pm = this._pm();
    if (!pm || !pm.hasProjectLoaded?.()) return false;
    pm.updateSharedData({ customMaterials: map });
    return true;
  }

  /**
   * Create a new custom material. Pass an optional partial `data` to seed it;
   * anything missing is filled from the default material shape.
   * @returns {object|null} the created material data, or null if no project.
   */
  createMaterial(label, data = null) {
    const pm = this._pm();
    if (!pm || !pm.hasProjectLoaded?.()) return null;
    const name = String(label || "").trim() || "New Material";
    const id = makeMaterialId();
    const material = data
      ? { ...makeDefaultMaterialData(id, name), ...data, value: id, label: name }
      : makeDefaultMaterialData(id, name);
    const map = { ...this.getCustomMaterials(), [id]: material };
    this._persist(map);
    this._emit();
    return material;
  }

  /**
   * Shallow-merge `patch` into an existing custom material. The id (`value`) is
   * never changed. No-op when the material does not exist.
   * @returns {object|null} the updated material, or null.
   */
  updateMaterial(id, patch) {
    const cur = this.getMaterial(id);
    if (!cur) return null;
    const next = { ...cur, ...patch, value: id };
    const map = { ...this.getCustomMaterials(), [id]: next };
    this._persist(map);
    // Re-apply to every live instance in the open level using this material so
    // edits (faces, transparency) show up immediately without re-selecting.
    this._refreshOpenInstances(id);
    this._emit();
    return next;
  }

  /** Re-apply material `id` to all open-level instances currently using it. */
  _refreshOpenInstances(id) {
    const sm = this._sm();
    if (!sm?.getAllInteractiveInstances) return;
    for (const inst of sm.getAllInteractiveInstances()) {
      if ((inst._materialId || materials.default.value) === id) {
        applyMaterialToInstance(inst, id);
      }
    }
  }

  /** Delete a custom material (pure — does not touch instances). */
  deleteMaterial(id) {
    const map = { ...this.getCustomMaterials() };
    if (!map[id]) return false;
    delete map[id];
    this._persist(map);
    this._emit();
    return true;
  }

  // Usage tracking -------------------------------------------------------

  /**
   * Find everywhere a material id is used, across the WHOLE project.
   *   - Open level: live instances (authoritative; cached level data is stale).
   *   - Other levels: serialized instances (properties.material.value).
   * Instances with no explicit material resolve to "default" (matching the
   * inspector getValue fallback), so querying "default" includes them.
   * @returns {{ open: object[], otherLevels: {levelId, name, count}[], total: number }}
   */
  findUsage(id) {
    const isDefault = id === materials.default.value;
    const result = { open: [], otherLevels: [], total: 0 };

    // Open level — live instances.
    const sm = this._sm();
    if (sm?.getAllInteractiveInstances) {
      for (const inst of sm.getAllInteractiveInstances()) {
        const matId = inst._materialId || materials.default.value;
        if (matId === id) result.open.push(inst);
      }
    }
    result.total += result.open.length;

    // Other levels — serialized instances.
    const pm = this._pm();
    if (pm?.getAllLevels) {
      const currentId = pm.currentProject?.currentLevelId;
      const levels = pm.getAllLevels();
      for (const [levelId, level] of Object.entries(levels)) {
        if (levelId === currentId) continue; // open level handled live above
        let count = 0;
        for (const inst of level?.instances || []) {
          const matProp = inst?.properties?.material;
          const matId =
            matProp?.value ?? (isDefault ? materials.default.value : null);
          if (matId === id) count++;
        }
        if (count > 0) {
          result.otherLevels.push({
            levelId,
            name: level?.name || level?.levelName || levelId,
            count,
          });
          result.total += count;
        }
      }
    }

    return result;
  }

  /**
   * Reassign every instance using `fromId` to `toId`, across the whole project.
   *   - Open level: re-apply live (updates visuals + _materialId).
   *   - Other levels: rewrite serialized properties.material.value in place.
   * Marks the project unsaved via the serialized rewrites / shared mutations.
   * Does NOT push an undo state (the source material is being deleted).
   * @returns {number} total instances reassigned.
   */
  reassignInstances(fromId, toId) {
    let touched = 0;
    const usage = this.findUsage(fromId);

    for (const inst of usage.open) {
      applyMaterialToInstance(inst, toId);
      touched++;
    }

    const pm = this._pm();
    if (pm?.getAllLevels && usage.otherLevels.length > 0) {
      const currentId = pm.currentProject?.currentLevelId;
      const levels = pm.getAllLevels();
      for (const { levelId } of usage.otherLevels) {
        if (levelId === currentId) continue;
        const level = levels[levelId];
        for (const inst of level?.instances || []) {
          const matProp = inst?.properties?.material;
          if (matProp && matProp.value === fromId) {
            matProp.value = toId;
            touched++;
          }
        }
      }
      pm.markAsUnsaved?.();
    }

    return touched;
  }
}

// Runtime custom-material registry. The editor reads custom materials through
// the manager singleton (backed by projectManager), but the RUNTIME game has no
// editor scope / projectManager — it loads a project via levelLoader. So at
// runtime, levelLoader registers the loaded project's custom materials here and
// resolveMaterial falls back to it. Null/empty when nothing is registered.
let _runtimeRegistry = null;
export function setCustomMaterialsRegistry(map) {
  _runtimeRegistry = map && typeof map === "object" ? map : null;
}

// The custom-materials map (id -> data), MERGED from both live sources: the
// editor manager (projectManager-backed) and the runtime registry set by
// levelLoader. Merging (rather than preferring one) means the CustomMaterials
// enum is populated whichever source has the data — critical in-game, where the
// manager may exist but read empty while the registry holds the loaded project's
// materials. Manager entries win on overlap (they reflect live editor edits).
export function getCustomMaterialsMap() {
  const fromManager = _instance ? _instance.getCustomMaterials() : null;
  return { ...(_runtimeRegistry || {}), ...(fromManager || {}) };
}

// Module-level resolver so apply paths don't each need the singleton handle.
// Order: built-ins → editor manager (if present) → runtime registry.
export function resolveMaterial(id) {
  if (!id) return null;
  if (materials[id]) return materials[id];
  if (_instance) {
    const m = _instance.getMaterial(id);
    if (m) return m;
  }
  if (_runtimeRegistry && _runtimeRegistry[id]) return _runtimeRegistry[id];
  return null;
}

// Singleton wiring (same pattern as labelsManager / groupManager).
let _instance = null;
export function initializeMaterialsManager() {
  if (!_instance) _instance = new MaterialsManager();
  if (globalThis._editorScope)
    globalThis._editorScope.materialsManager = _instance;
  return _instance;
}
export function getMaterialsManager() {
  return _instance;
}
