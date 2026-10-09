// State Manager for Level Editor
// Provides functionality to export and import state data from all interactive instances in the layout

import {
  ObjectTypeDefinitions,
  createInstance,
  selectableObjects,
} from "./objectTypeDefinitions.js";
import { refreshInspector } from "./inspectorUI.js";
import { refreshHierarchyPanel } from "./hierarchyPanel/hierarchyPanel.js";

// Sidecar (editor-only) instance fields compared by calculateInstanceDiff so
// edits to them get their own undo entries. Group/name/order/hidden are left
// out on purpose (their managers decide when to push undo).
const INSTANCE_SIDECAR_DIFF_KEYS = ["labels", "labelVars"];

// Deep-copy a `{ [labelId]: { [key]: value } }` map, dropping empty buckets.
function cloneLabelVars(src) {
  const out = {};
  if (!src || typeof src !== "object") return out;
  for (const [labelId, bucket] of Object.entries(src)) {
    if (!bucket || typeof bucket !== "object") continue;
    const keys = Object.keys(bucket);
    if (keys.length === 0) continue;
    out[labelId] = JSON.parse(JSON.stringify(bucket));
  }
  return out;
}

export class StateManager {
  constructor(runtime) {
    this.runtime = runtime;
    this.exportableObjects = [...selectableObjects]; // Objects that can be interacted with

    // Undo/Redo system
    this.undoStack = [];
    this.redoStack = [];
    this.maxUndoSteps = 50; // Maximum number of undo steps to keep
    this.currentState = null; // Current state snapshot
    this.lastChangeTime = 0; // Timestamp of last change
    this.lastChangedProperties = new Set(); // Properties changed in last operation
    this.changeCoalesceTime = 1000; // 10 seconds to coalesce changes (in milliseconds)
    this.isApplyingUndoRedo = false; // Flag to prevent undo/redo loops

    // Editor-only per-instance metadata, keyed by instance uid.
    // Shape: Map<uid, { parentGroupId: string|null, labels: string[], name?: string }>
    // - parentGroupId: id of the containing group in levelData.groups, or null.
    // - labels: free-form label strings rendered in the hierarchy panel / inspector.
    // - name: optional display name overriding the default "<Type> #<uid>" label
    //         shown in the hierarchy panel. Undefined/empty means "use default".
    // Not part of the runtime instance properties; persisted via state save/load.
    this.instanceMeta = new Map();
  }

  destroy() {
    this.undoStack = [];
    this.redoStack = [];
    this.currentState = null;
    this.lastChangeTime = 0;
    this.lastChangedProperties = new Set();
    this.instanceMeta.clear();
  }

  /**
   * Get editor-only metadata for an instance uid (parentGroupId, labels,
   * labelVars, name, order, hidden).
   * Always returns an object with safe defaults; does not allocate storage.
   */
  getInstanceMeta(uid) {
    const meta = this.instanceMeta.get(uid);
    return {
      parentGroupId: meta?.parentGroupId ?? null,
      labels: meta?.labels ? [...meta.labels] : [],
      labelVars: cloneLabelVars(meta?.labelVars),
      name: meta?.name ?? "",
      order: typeof meta?.order === "number" ? meta.order : null,
      hidden: !!meta?.hidden,
    };
  }

  /**
   * Set editor-only metadata for an instance uid. Pass null to clear a field.
   * `labelVars` is `{ [labelId]: { [key]: value } }` (sparse per-label
   * variable overrides; empty buckets are dropped).
   */
  setInstanceMeta(
    uid,
    { parentGroupId, labels, labelVars, name, order, hidden } = {},
  ) {
    const existing = this.instanceMeta.get(uid) ?? {
      parentGroupId: null,
      labels: [],
      labelVars: {},
      name: "",
      order: null,
      hidden: false,
    };
    if (parentGroupId !== undefined) existing.parentGroupId = parentGroupId;
    if (labels !== undefined)
      existing.labels = Array.isArray(labels) ? [...labels] : [];
    if (labelVars !== undefined) existing.labelVars = cloneLabelVars(labelVars);
    if (!existing.labelVars) existing.labelVars = {};
    if (name !== undefined)
      existing.name = typeof name === "string" ? name : "";
    if (order !== undefined)
      existing.order =
        typeof order === "number" && Number.isFinite(order) ? order : null;
    if (hidden !== undefined) existing.hidden = !!hidden;
    // Drop entry if fully default to keep the map small.
    const labelsEmpty = !existing.labels || existing.labels.length === 0;
    const labelVarsEmpty = Object.keys(existing.labelVars).length === 0;
    const nameEmpty = !existing.name;
    const orderEmpty = existing.order === null;
    const hiddenEmpty = !existing.hidden;
    if (
      !existing.parentGroupId &&
      labelsEmpty &&
      labelVarsEmpty &&
      nameEmpty &&
      orderEmpty &&
      hiddenEmpty
    ) {
      this.instanceMeta.delete(uid);
    } else {
      this.instanceMeta.set(uid, existing);
    }
  }

  /** Remove all editor metadata for an instance uid. */
  clearInstanceMeta(uid) {
    this.instanceMeta.delete(uid);
  }

  /**
   * Export state data from all interactive instances in the layout
   * @returns {Object} State data containing all instance information
   */
  exportState(instances = null) {
    const stateData = {
      version: "1.0.0",
      instances: [],
      levelData: {},
      metaData: {
        timestamp: new Date().toISOString(),
        cameraTransform: {},
        lastUsedTemplate: {},
      },
    };

    if (globalThis._editorScope.levelSettings) {
      stateData.levelData =
        globalThis._editorScope.levelSettings.getLevelData();
    }

    if (globalThis._editorScope.cameraController) {
      stateData.metaData.cameraTransform =
        globalThis._editorScope.cameraController.getCameraTransform();
    }

    // Get all interactive instances from the layout
    if (instances === null) {
      instances = this.getAllInteractiveInstances();
    }

    // Process each instance
    for (const instance of instances) {
      const instanceData = this.exportInstanceState(instance);
      if (instanceData) {
        stateData.instances.push(instanceData);
      }
    }
    return stateData;
  }

  /**
   * Export state data for a specific instance
   * @param {Object} instance - The instance to export
   * @returns {Object|null} Instance state data or null if export failed
   */
  exportInstanceState(instance) {
    try {
      const objectTypeName = instance.objectType?.name;
      if (!objectTypeName) {
        console.warn("Instance has no object type name:", instance);
        return null;
      }

      const definition = ObjectTypeDefinitions[objectTypeName];
      if (!definition) {
        console.warn(`No object type definition found for: ${objectTypeName}`);
        return null;
      }

      const instanceData = {
        objectType: objectTypeName,
        properties: {},
        uid: instance.uid,
      };

      // Attach editor-only metadata (group membership, labels, custom name,
      // sibling order) as sidecar fields so they round-trip through save/load
      // without polluting the runtime `properties` bag.
      const meta = this.instanceMeta.get(instance.uid);
      if (meta) {
        if (meta.parentGroupId) instanceData.parentGroupId = meta.parentGroupId;
        if (meta.labels && meta.labels.length > 0) {
          // Strip the legacy "__hidden" sentinel — replaced by `editorHidden`.
          const cleaned = meta.labels.filter((l) => l !== "__hidden");
          if (cleaned.length > 0) instanceData.labels = cleaned;
        }
        const labelVars = cloneLabelVars(meta.labelVars);
        if (Object.keys(labelVars).length > 0) instanceData.labelVars = labelVars;
        if (meta.name) instanceData.editorName = meta.name;
        if (typeof meta.order === "number" && Number.isFinite(meta.order)) {
          instanceData.editorOrder = meta.order;
        }
        if (meta.hidden) instanceData.editorHidden = true;
      }

      // Export all properties defined in the object type definition
      if (definition.properties) {
        for (const propertyDef of definition.properties) {
          try {
            const value = definition.getValue(instance, propertyDef.key);
            if (value !== null && value !== undefined) {
              instanceData.properties[propertyDef.key] = {
                value: value,
                type: propertyDef.type,
                label: propertyDef.label,
                key: propertyDef.originalKey,
              };
            }
          } catch (error) {
            console.warn(
              `Failed to get property ${propertyDef.key} for instance ${instance.uid}:`,
              error,
            );
          }
        }
      }
      return instanceData;
    } catch (error) {
      console.error(
        `Failed to export instance state for ${instance.uid}:`,
        error,
      );
      return null;
    }
  }

  /**
   * Get all interactive instances from the layout
   * @returns {Array} Array of all interactive instances
   */
  getAllInteractiveInstances() {
    const instances = [];

    for (const objectTypeName of this.exportableObjects) {
      const objectType = this.runtime.objects[objectTypeName];
      if (objectType) {
        const typeInstances = objectType.getAllInstances();
        instances.push(...typeInstances);
      }
    }

    return instances;
  }

  /**
   * Export state data as JSON string
   * @param {Object} options - Export options
   * @returns {string} JSON string of state data
   */
  exportAsJSON(options = {}) {
    const { indent = 2, selection = null } = options;

    let stateData = this.exportState(selection);

    return JSON.stringify(stateData, null, indent);
  }

  /**
   * Save state data to file (browser download)
   * @param {Object} options - Save options
   */
  saveToFile(options = {}) {
    const { filename = `layout_state_${Date.now()}.json`, selection = null } =
      options;

    try {
      const jsonData = this.exportAsJSON({ selection });
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      console.log(`State data saved to file: ${filename}`);
    } catch (error) {
      console.error("Failed to save state data to file:", error);
      throw error;
    }
  }

  /**
   * Copy state data to clipboard
   * @param {Object} options - Copy options
   */
  async copyToClipboard(options = {}) {
    const { selection = null } = options;

    try {
      const jsonData = this.exportAsJSON({ selection });
      await navigator.clipboard.writeText(jsonData);
      console.log("State data copied to clipboard");
      return true;
    } catch (error) {
      console.error("Failed to copy state data to clipboard:", error);
      return false;
    }
  }

  updateInstanceFromState(instance, stateData) {
    try {
      const objectTypeName = instance.objectType?.name;
      if (!objectTypeName) {
        console.warn("Instance has no object type name:", instance);
        return false;
      }

      const definition = ObjectTypeDefinitions[objectTypeName];
      if (!definition) {
        console.warn(`No object type definition found for: ${objectTypeName}`);
        return false;
      }

      // Update properties from state data
      const entries = Object.entries(stateData.properties || {});
      for (let i = entries.length - 1; i >= 0; i--) {
        const [key, propData] = entries[i];
        definition.onChange(propData, instance, key);
      }

      // Sync editor-only metadata (group/labels/name/order/hidden) for this instance uid.
      // Migration: if legacy data carries the "__hidden" label sentinel, fold
      // it into the proper `hidden` flag and strip the sentinel.
      const rawLabels = Array.isArray(stateData.labels) ? stateData.labels : [];
      const hadHiddenSentinel = rawLabels.includes("__hidden");
      const cleanedLabels = rawLabels.filter((l) => l !== "__hidden");
      this.setInstanceMeta(instance.uid, {
        parentGroupId: stateData.parentGroupId ?? null,
        labels: cleanedLabels,
        labelVars: stateData.labelVars ?? {},
        name:
          typeof stateData.editorName === "string" ? stateData.editorName : "",
        order:
          typeof stateData.editorOrder === "number" &&
          Number.isFinite(stateData.editorOrder)
            ? stateData.editorOrder
            : null,
        hidden: !!stateData.editorHidden || hadHiddenSentinel,
      });
      return true;
    } catch (error) {
      console.error(
        `Failed to update instance ${instance.uid} from state data:`,
        error,
      );
      return false;
    }
  }

  createInstanceFromState(stateData) {
    try {
      const objectTypeName = stateData.objectType;
      if (!objectTypeName) {
        console.warn("State data has no object type name:", stateData);
        return null;
      }

      const definition = ObjectTypeDefinitions[objectTypeName];
      if (!definition) {
        console.warn(`No object type definition found for: ${objectTypeName}`);
        return null;
      }

      // Create a new instance of the object type
      const newInstance = createInstance(objectTypeName);

      // Update the new instance with properties from state data
      this.updateInstanceFromState(newInstance, stateData);
      stateData.uid = newInstance.uid; // Assign the new UID

      return newInstance;
    } catch (error) {
      console.error(
        `Failed to create instance from state data for ${stateData.objectType}:`,
        error,
      );
      return null;
    }
  }

  updateOrCreateInstanceFromState(stateData) {
    try {
      const existingInstance = this.runtime.getInstanceByUid(stateData.uid);
      if (existingInstance) {
        // Update existing instance
        this.updateInstanceFromState(existingInstance, stateData);
        return existingInstance;
      } else {
        // Create new instance
        return this.createInstanceFromState(stateData);
      }
    } catch (error) {
      console.error(
        `Failed to update or create instance from state data for ${stateData.objectType}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Load state data from JSON string or object
   * @param {string|Object} stateInput - JSON string or state object to load
   * @param {Object} options - Load options
   * @param {boolean} options.destructive - If true, destroy all instances and recreate. If false, update existing and destroy unmatched
   * @param {boolean} options.recordUndo - If true, record this as an undo state (default: true)
   * @returns {boolean} Success status
   */
  loadFromState(stateInput, options = {}) {
    const {
      destructive = false,
      recordUndo = true,
      preventUnsavedChanges = false,
    } = options;

    try {
      // Parse state data if it's a string
      let stateData;
      if (typeof stateInput === "string") {
        stateData = JSON.parse(stateInput);
      } else {
        stateData = stateInput;
      }

      // Validate state data structure
      if (
        !stateData ||
        !stateData.instances ||
        !Array.isArray(stateData.instances)
      ) {
        console.error("Invalid state data: missing or invalid instances array");
        return false;
      }

      console.log(
        `Loading state with ${stateData.instances.length} instances (${
          destructive ? "destructive" : "non-destructive"
        } mode)`,
      );

      if (destructive) {
        this.loadDestructive(stateData);
      } else {
        this.loadNonDestructive(stateData);
      }

      // Load level data if present
      if (stateData.levelData && globalThis._editorScope.levelSettings) {
        globalThis._editorScope.levelSettings.setLevelData(stateData.levelData);
      }

      // Load camera transform if present (only for destructive loads)
      if (
        destructive &&
        stateData.metaData?.cameraTransform &&
        globalThis._editorScope.cameraController
      ) {
        globalThis._editorScope.cameraController.setCameraTransform(
          stateData.metaData.cameraTransform,
        );
      }

      console.log("State loaded successfully");

      // Update current state tracking (unless this is an undo/redo operation)
      if (!this.isApplyingUndoRedo) {
        this.currentState = this.exportState();
      }

      if (recordUndo && !this.isApplyingUndoRedo) {
        this.pushUndoState(
          `Load State (${destructive ? "destructive" : "non-destructive"})`,
        );
      }

      if (globalThis._editorScope?.projectManager && !preventUnsavedChanges) {
        globalThis._editorScope.projectManager.markAsUnsaved();
      }

      if (globalThis._editorScope?.toolbar) {
        globalThis._editorScope.toolbar.updateToolVisibility();
      }

      return true;
    } catch (error) {
      console.error("Failed to load state data:", error);
      return false;
    }
  }

  /**
   * Destructive load: destroy all interactive instances and recreate from state
   * @param {Object} stateData - The state data to load
   */
  loadDestructive(stateData) {
    // Get all current interactive instances
    const allInstances = this.getAllInteractiveInstances();

    // Remove any instances in selection before destroying them
    if (globalThis._editorScope.selectionManager) {
      globalThis._editorScope.selectionManager.clearSelection();
    }

    // Destroy all existing interactive instances
    allInstances.forEach((instance) => {
      try {
        instance.destroy();
      } catch (error) {
        console.warn(`Failed to destroy instance ${instance.uid}:`, error);
      }
    });

    // Reset editor-only metadata; it will be re-populated as instances are created.
    this.instanceMeta.clear();

    // Create all instances from state
    const createdInstances = [];
    stateData.instances.forEach((instanceState) => {
      const newInstance = this.createInstanceFromState(instanceState);
      if (newInstance) {
        createdInstances.push(newInstance);
      }
    });

    console.log(
      `Destructive load completed: destroyed ${allInstances.length} instances, created ${createdInstances.length} instances`,
    );
    // Refresh hierarchy and apply derived visibility now that the new scene
    // is fully populated (meta is already written during createInstanceFromState).
    refreshHierarchyPanel();
  }

  /**
   * Non-destructive load: update existing instances, create missing ones, destroy unmatched ones
   * @param {Object} stateData - The state data to load
   */
  loadNonDestructive(stateData) {
    // Get all current interactive instances
    const allInstances = this.getAllInteractiveInstances();
    const currentInstancesByUid = new Map();
    allInstances.forEach((instance) => {
      currentInstancesByUid.set(instance.uid, instance);
    });

    // Track which instances from state we've processed
    const stateInstanceUids = new Set();
    const processedInstances = [];

    // Process each instance from state
    stateData.instances.forEach((instanceState) => {
      stateInstanceUids.add(instanceState.uid);

      const existingInstance = currentInstancesByUid.get(instanceState.uid);
      if (existingInstance) {
        // Update existing instance
        if (this.updateInstanceFromState(existingInstance, instanceState)) {
          processedInstances.push(existingInstance);
        }
      } else {
        // Create new instance (this will assign a new UID)
        const newInstance = this.createInstanceFromState(instanceState);
        if (newInstance) {
          processedInstances.push(newInstance);
        }
      }
    });

    // Find instances that exist but are not in the state data - these need to be destroyed
    const instancesToDestroy = [];
    currentInstancesByUid.forEach((instance, uid) => {
      if (!stateInstanceUids.has(uid)) {
        instancesToDestroy.push(instance);
      }
    });

    // Remove instances from selection before destroying them
    if (
      instancesToDestroy.length > 0 &&
      globalThis._editorScope.selectionManager
    ) {
      instancesToDestroy.forEach((instance) => {
        globalThis._editorScope.selectionManager.removeFromSelection(instance);
      });
    }

    // Destroy instances that aren't in the state
    instancesToDestroy.forEach((instance) => {
      try {
        this.clearInstanceMeta(instance.uid);
        instance.destroy();
      } catch (error) {
        console.warn(`Failed to destroy instance ${instance.uid}:`, error);
      }
    });

    console.log(
      `Non-destructive load completed: updated/created ${processedInstances.length} instances, destroyed ${instancesToDestroy.length} instances`,
    );
    // Refresh hierarchy and apply derived visibility after the in-place merge.
    refreshHierarchyPanel();
  }

  /**
   * Load state from file input
   * @param {File} file - File object containing state data
   * @param {Object} options - Load options
   * @returns {Promise<boolean>} Success status
   */
  async loadFromFile(file, options = {}) {
    try {
      const text = await file.text();
      return this.loadFromState(text, options);
    } catch (error) {
      console.error("Failed to load state from file:", error);
      return false;
    }
  }

  /**
   * Load state from clipboard
   * @param {Object} options - Load options
   * @returns {Promise<boolean>} Success status
   */
  async loadFromClipboard(options = {}) {
    try {
      const text = await navigator.clipboard.readText();
      return this.loadFromState(text, options);
    } catch (error) {
      console.error("Failed to load state from clipboard:", error);
      return false;
    }
  }

  /**
   * Calculate diff between two state objects
   * @param {Object} oldState - Previous state
   * @param {Object} newState - Current state
   * @returns {Object} Diff object containing changes
   */
  calculateStateDiff(oldState, newState) {
    const diff = {
      instancesAdded: [],
      instancesRemoved: [],
      instancesModified: [],
      levelDataChanged: false,
      changedProperties: new Set(), // Track all changed properties
    };

    // Skip metadata comparison as requested
    const oldInstances = new Map();
    const newInstances = new Map();

    // Build maps by UID for efficient comparison
    if (oldState && oldState.instances) {
      oldState.instances.forEach((instance) => {
        oldInstances.set(instance.uid, instance);
      });
    }

    if (newState && newState.instances) {
      newState.instances.forEach((instance) => {
        newInstances.set(instance.uid, instance);
      });
    }

    // Find added instances
    newInstances.forEach((instance, uid) => {
      if (!oldInstances.has(uid)) {
        diff.instancesAdded.push(instance);
        diff.changedProperties.add(`instance:${uid}:created`);
      }
    });

    // Find removed instances
    oldInstances.forEach((instance, uid) => {
      if (!newInstances.has(uid)) {
        diff.instancesRemoved.push(instance);
        diff.changedProperties.add(`instance:${uid}:deleted`);
      }
    });

    // Find modified instances
    oldInstances.forEach((oldInstance, uid) => {
      const newInstance = newInstances.get(uid);
      if (newInstance) {
        const instanceDiff = this.calculateInstanceDiff(
          oldInstance,
          newInstance,
        );
        if (instanceDiff.hasChanges) {
          diff.instancesModified.push({
            uid: uid,
            objectType: newInstance.objectType,
            changes: instanceDiff.changes,
          });
          // Add specific property changes to the set
          instanceDiff.changedPropertyKeys.forEach((propKey) => {
            diff.changedProperties.add(`instance:${uid}:${propKey}`);
          });
        }
      }
    });

    // Check level data changes (if both states have level data)
    if (oldState?.levelData && newState?.levelData) {
      const levelDataDiff = this.calculateObjectDiff(
        oldState.levelData,
        newState.levelData,
      );
      if (levelDataDiff.hasChanges) {
        diff.levelDataChanged = true;
        diff.levelDataChanges = levelDataDiff.changes; // Store the actual changes
        levelDataDiff.changedKeys.forEach((key) => {
          diff.changedProperties.add(`levelData:${key}`);
        });
      }
    } else if (
      (!oldState?.levelData && newState?.levelData) ||
      (oldState?.levelData && !newState?.levelData)
    ) {
      diff.levelDataChanged = true;
      diff.changedProperties.add("levelData:structure");
    }

    return diff;
  }

  /**
   * Calculate diff between two instances
   * @param {Object} oldInstance - Previous instance state
   * @param {Object} newInstance - Current instance state
   * @returns {Object} Instance diff with changes
   */
  calculateInstanceDiff(oldInstance, newInstance) {
    const diff = {
      hasChanges: false,
      changes: {},
      changedPropertyKeys: [],
    };

    const oldProps = oldInstance.properties || {};
    const newProps = newInstance.properties || {};

    // Get all property keys from both instances
    const allPropertyKeys = new Set([
      ...Object.keys(oldProps),
      ...Object.keys(newProps),
    ]);

    allPropertyKeys.forEach((key) => {
      const oldValue = oldProps[key]?.value;
      const newValue = newProps[key]?.value;

      if (!this.deepEqual(oldValue, newValue)) {
        diff.hasChanges = true;
        diff.changes[key] = {
          oldValue: oldValue,
          newValue: newValue,
          type: newProps[key]?.type || oldProps[key]?.type,
        };
        diff.changedPropertyKeys.push(key);
      }
    });

    // Editor sidecar fields that must be undoable on their own (a label or
    // label-variable edit changes no runtime property, so without this the
    // change would silently fold into the next unrelated undo entry).
    for (const key of INSTANCE_SIDECAR_DIFF_KEYS) {
      const oldValue = oldInstance[key];
      const newValue = newInstance[key];
      if (!this.deepEqual(oldValue, newValue)) {
        diff.hasChanges = true;
        diff.changes[key] = { oldValue, newValue, type: "sidecar" };
        diff.changedPropertyKeys.push(key);
      }
    }

    return diff;
  }

  /**
   * Calculate diff between two objects
   * @param {Object} oldObj - Previous object
   * @param {Object} newObj - Current object
   * @returns {Object} Object diff with changes
   */
  calculateObjectDiff(oldObj, newObj) {
    const diff = {
      hasChanges: false,
      changes: {},
      changedKeys: [],
    };

    const allKeys = new Set([
      ...Object.keys(oldObj || {}),
      ...Object.keys(newObj || {}),
    ]);

    allKeys.forEach((key) => {
      const oldValue = oldObj?.[key];
      const newValue = newObj?.[key];

      if (!this.deepEqual(oldValue, newValue)) {
        diff.hasChanges = true;
        diff.changes[key] = {
          oldValue: oldValue,
          newValue: newValue,
        };
        diff.changedKeys.push(key);
      }
    });

    return diff;
  }

  /**
   * Deep equality check for values
   * @param {*} a - First value
   * @param {*} b - Second value
   * @returns {boolean} True if values are deeply equal
   */
  deepEqual(a, b) {
    if (a === b) return true;

    if (a == null || b == null) return a === b;

    if (typeof a !== typeof b) return false;

    if (typeof a === "object") {
      if (Array.isArray(a) !== Array.isArray(b)) return false;

      if (Array.isArray(a)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
          if (!this.deepEqual(a[i], b[i])) return false;
        }
        return true;
      }

      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;

      for (const key of keysA) {
        if (!keysB.includes(key)) return false;
        if (!this.deepEqual(a[key], b[key])) return false;
      }
      return true;
    }

    return false;
  }

  /**
   * Check if two sets of changed properties overlap
   * @param {Set} set1 - First set of properties
   * @param {Set} set2 - Second set of properties
   * @returns {boolean} True if sets have common elements
   */
  propertySetsOverlap(set1, set2) {
    for (const prop of set1) {
      if (set2.has(prop)) return true;
    }
    return false;
  }

  /**
   * Push a new state change to the undo stack
   * @param {string} description - Description of the change
   * @param {Object} options - Options for the push operation
   */
  pushUndoState(description = "State Change", options = {}) {
    if (this.isApplyingUndoRedo) return; // Don't record undo states when applying undo/redo

    const currentTime = Date.now();
    const newState = this.exportState();

    // If no current state exists, set it to current state and don't create undo entry
    if (!this.currentState) {
      this.currentState = newState;
      this.lastChangeTime = currentTime;
      this.lastChangedProperties = new Set();
      console.log(
        "Initialized undo system with current state - nothing to undo yet",
      );
      return;
    }

    // Calculate diff with the previous state
    const diff = this.calculateStateDiff(this.currentState, newState);
    const changedProperties = diff.changedProperties;

    // If no changes detected, don't push to undo stack
    if (changedProperties.size === 0) {
      return;
    }

    // Check if we should coalesce with the last undo entry
    const timeSinceLastChange = currentTime - this.lastChangeTime;
    const shouldCoalesce =
      timeSinceLastChange < this.changeCoalesceTime &&
      this.undoStack.length > 0 &&
      this.redoStack.length === 0 &&
      this.propertySetsOverlap(changedProperties, this.lastChangedProperties);

    if (shouldCoalesce) {
      // Update the existing undo entry instead of creating a new one
      const lastUndo = this.undoStack[this.undoStack.length - 1];
      lastUndo.afterState = newState;
      lastUndo.timestamp = currentTime;
      // Optionally update the description, but not required
      // lastUndo.description = `${lastUndo.description} (continued)`;

      // Merge changed properties
      changedProperties.forEach((prop) => lastUndo.changedProperties.add(prop));

      // Update the diff: preserve oldValue but update newValue for coalesced changes

      // Update instancesModified changes
      if (diff.instancesModified && diff.instancesModified.length > 0) {
        // Create a map of existing modified instances for quick lookup
        const existingModified = new Map();
        if (lastUndo.diff.instancesModified) {
          lastUndo.diff.instancesModified.forEach((instance) => {
            existingModified.set(instance.uid, instance);
          });
        } else {
          lastUndo.diff.instancesModified = [];
        }

        // Process each modified instance in the new diff
        diff.instancesModified.forEach((newInstanceMod) => {
          const existing = existingModified.get(newInstanceMod.uid);
          if (existing) {
            // Update existing: preserve oldValue, update newValue
            for (const [propKey, change] of Object.entries(
              newInstanceMod.changes,
            )) {
              if (existing.changes[propKey]) {
                existing.changes[propKey].newValue = change.newValue;
                existing.changes[propKey].type = change.type;
              } else {
                existing.changes[propKey] = change;
              }
            }
          } else {
            // Add new modified instance
            lastUndo.diff.instancesModified.push(newInstanceMod);
            existingModified.set(newInstanceMod.uid, newInstanceMod);
          }
        });
      }

      // Update levelDataChanges
      if (diff.levelDataChanges) {
        if (!lastUndo.diff.levelDataChanges) {
          lastUndo.diff.levelDataChanges = {};
        }

        for (const [key, change] of Object.entries(diff.levelDataChanges)) {
          if (lastUndo.diff.levelDataChanges[key]) {
            // Update existing: preserve oldValue, update newValue
            lastUndo.diff.levelDataChanges[key].newValue = change.newValue;
          } else {
            // Add new levelData change
            lastUndo.diff.levelDataChanges[key] = change;
          }
        }
        lastUndo.diff.levelDataChanged = true;
      }

      // Update other diff properties
      if (diff.instancesAdded && diff.instancesAdded.length > 0) {
        if (!lastUndo.diff.instancesAdded) lastUndo.diff.instancesAdded = [];
        lastUndo.diff.instancesAdded.push(...diff.instancesAdded);
      }

      if (diff.instancesRemoved && diff.instancesRemoved.length > 0) {
        if (!lastUndo.diff.instancesRemoved)
          lastUndo.diff.instancesRemoved = [];
        lastUndo.diff.instancesRemoved.push(...diff.instancesRemoved);
      }

      console.log(`Coalesced undo state: ${lastUndo.description}`);
      console.log({ ...lastUndo });
    } else {
      // Create new undo entry
      const undoEntry = {
        description: description,
        beforeState: this.currentState,
        afterState: newState,
        timestamp: currentTime,
        changedProperties: new Set(changedProperties),
        diff: diff,
      };

      this.undoStack.push(undoEntry);

      // Limit undo stack size
      if (this.undoStack.length > this.maxUndoSteps) {
        this.undoStack.shift();
      }

      console.log(
        `Pushed undo state: ${description} (${changedProperties.size} properties changed)`,
      );
    }

    // Clear redo stack when new change is made
    this.redoStack = [];

    // Update tracking variables
    this.currentState = newState;
    this.lastChangeTime = currentTime;
    this.lastChangedProperties = changedProperties;

    if (globalThis._editorScope?.projectManager) {
      globalThis._editorScope.projectManager.markAsUnsaved();
    }
    // Update toolbar undo/redo button states
    if (globalThis._editorScope?.toolbar) {
      globalThis._editorScope.toolbar.updateToolVisibility();
    }
  }

  /**
   * Undo the last change
   * @returns {boolean} True if undo was successful
   */
  undo() {
    if (this.undoStack.length === 0) {
      console.log("Nothing to undo");
      return false;
    }

    const undoEntry = this.undoStack.pop();

    // Store current state for redo
    this.redoStack.push({
      description: undoEntry.description,
      beforeState: undoEntry.beforeState, // Where we're going back to (for undo)
      afterState: undoEntry.afterState, // Where we want to go forward to (for redo)
      timestamp: Date.now(),
      changedProperties: undoEntry.changedProperties,
      diff: undoEntry.diff,
    });

    // Apply the before state
    this.isApplyingUndoRedo = true;
    try {
      if (undoEntry.beforeState) {
        this.loadFromState(undoEntry.beforeState, { destructive: false });
        this.currentState = undoEntry.beforeState;
      } else {
        // First state - clear everything
        this.loadDestructive({ instances: [], levelData: {}, metaData: {} });
        this.currentState = { instances: [], levelData: {}, metaData: {} };
      }

      console.log(`Undid: ${undoEntry.description}`);

      // Notify
      globalThis._editorScope?.notifications?.info(undoEntry.description, {
        title: "Undo",
      });

      if (globalThis._editorScope?.projectManager) {
        globalThis._editorScope.projectManager.markAsUnsaved();
      }
      // Update toolbar undo/redo button states
      if (globalThis._editorScope?.toolbar) {
        globalThis._editorScope.toolbar.updateToolVisibility();
      }

      // Refresh inspector to show updated values
      refreshInspector();
      refreshHierarchyPanel();
      globalThis._editorScope?.selectionManager?.updateSelectionGizmos();
      // Label dictionary / membership / variable schema may have changed —
      // the label dialogs and inspector sections listen for this.
      document.dispatchEvent(new CustomEvent("editor:labels-changed"));

      return true;
    } catch (error) {
      console.error("Failed to undo:", error);
      return false;
    } finally {
      this.isApplyingUndoRedo = false;
    }
  }

  /**
   * Redo the last undone change
   * @returns {boolean} True if redo was successful
   */
  redo() {
    if (this.redoStack.length === 0) {
      console.log("Nothing to redo");
      return false;
    }

    const redoEntry = this.redoStack.pop();

    // Store current state back to undo stack
    this.undoStack.push({
      description: redoEntry.description,
      beforeState: redoEntry.beforeState,
      afterState: redoEntry.afterState,
      timestamp: redoEntry.timestamp,
      changedProperties: redoEntry.changedProperties,
      diff: redoEntry.diff,
    });

    // Apply the after state (moving forward)
    this.isApplyingUndoRedo = true;
    try {
      this.loadFromState(redoEntry.afterState, { destructive: false });
      this.currentState = redoEntry.afterState;

      console.log(`Redid: ${redoEntry.description}`);

      // Notify
      globalThis._editorScope?.notifications?.info(redoEntry.description, {
        title: "Redo",
      });

      if (globalThis._editorScope?.projectManager) {
        globalThis._editorScope.projectManager.markAsUnsaved();
      }
      // Update toolbar undo/redo button states
      if (globalThis._editorScope?.toolbar) {
        globalThis._editorScope.toolbar.updateToolVisibility();
      }

      // Refresh inspector to show updated values
      refreshInspector();
      refreshHierarchyPanel();
      globalThis._editorScope?.selectionManager?.updateSelectionGizmos();
      // Label dictionary / membership / variable schema may have changed —
      // the label dialogs and inspector sections listen for this.
      document.dispatchEvent(new CustomEvent("editor:labels-changed"));

      return true;
    } catch (error) {
      console.error("Failed to redo:", error);
      return false;
    } finally {
      this.isApplyingUndoRedo = false;
    }
  }

  /**
   * Clear the undo/redo stacks
   */
  clearUndoRedoHistory({ preventUnsavedChanges = false } = {}) {
    this.undoStack = [];
    this.redoStack = [];
    this.currentState = null;
    this.lastChangeTime = 0;
    this.lastChangedProperties = new Set();
    console.log("Cleared undo/redo history");

    if (globalThis._editorScope?.projectManager && !preventUnsavedChanges) {
      globalThis._editorScope.projectManager.markAsUnsaved();
    }

    // Update toolbar undo/redo button states
    if (globalThis._editorScope?.toolbar) {
      globalThis._editorScope.toolbar.updateToolVisibility();
    }
  }

  /**
   * Get undo/redo stack information
   * @returns {Object} Information about undo/redo stacks
   */
  getUndoRedoInfo() {
    return {
      undoCount: this.undoStack.length,
      redoCount: this.redoStack.length,
      canUndo: this.undoStack.length > 0,
      canRedo: this.redoStack.length > 0,
      undoStack: this.undoStack.map((entry) => ({
        description: entry.description,
        timestamp: entry.timestamp,
        changedPropertyCount: entry.changedProperties.size,
      })),
      redoStack: this.redoStack.map((entry) => ({
        description: entry.description,
        timestamp: entry.timestamp,
        changedPropertyCount: entry.changedProperties.size,
      })),
    };
  }

  /**
   * Initialize the undo system with current state
   */
  initializeUndoSystem() {
    this.currentState = this.exportState();
    this.clearUndoRedoHistory({ preventUnsavedChanges: true });
    console.log("Initialized undo/redo system");
  }
}

// Global helper functions for easy access
let stateManagerInstance = null;

/**
 * Initialize the state manager with the runtime
 * @param {Object} runtime - The Construct 3 runtime
 * @returns {StateManager} The state manager instance
 */
export function initializeStateManager(runtime) {
  stateManagerInstance = new StateManager(runtime);

  // Make it globally accessible
  globalThis._editorScope.stateManager = stateManagerInstance;

  // Initialize the undo system after a short delay to let the scene load
  setTimeout(() => {
    stateManagerInstance.initializeUndoSystem();
  }, 20);

  return stateManagerInstance;
}

/**
 * Get the current state manager instance
 * @returns {StateManager|null} The state manager instance
 */
export function getStateManager() {
  return stateManagerInstance;
}

/**
 * Quick save current state to clipboard
 * @param {Object} options - Export options
 * @returns {Promise<boolean>} Success status
 */
export async function quickSaveToClipboard(options = {}) {
  if (!stateManagerInstance) {
    console.error("State manager not initialized");
    return false;
  }
  return await stateManagerInstance.copyToClipboard(options);
}

/**
 * Quick load state from clipboard (non-destructive by default)
 * @param {Object} options - Load options
 * @returns {Promise<boolean>} Success status
 */
export async function quickLoadFromClipboard(options = {}) {
  if (!stateManagerInstance) {
    console.error("State manager not initialized");
    return false;
  }
  return await stateManagerInstance.loadFromClipboard(options);
}

/**
 * Quick save current state to file
 * @param {Object} options - Export options
 * @returns {boolean} Success status
 */
export function quickSaveToFile(options = {}) {
  if (!stateManagerInstance) {
    console.error("State manager not initialized");
    return false;
  }
  stateManagerInstance.saveToFile(options);
  return true;
}

/**
 * Push an undo state with automatic change detection
 * @param {string} description - Description of the change
 * @returns {boolean} Success status
 */
export function pushUndo(description = "State Change") {
  if (!stateManagerInstance) {
    console.error("State manager not initialized");
    return false;
  }
  stateManagerInstance.pushUndoState(description);
  return true;
}

/**
 * Undo the last change
 * @returns {boolean} Success status
 */
export function undo() {
  if (!stateManagerInstance) {
    console.error("State manager not initialized");
    return false;
  }
  return stateManagerInstance.undo();
}

/**
 * Redo the last undone change
 * @returns {boolean} Success status
 */
export function redo() {
  if (!stateManagerInstance) {
    console.error("State manager not initialized");
    return false;
  }
  return stateManagerInstance.redo();
}

/**
 * Get undo/redo information
 * @returns {Object|null} Undo/redo info or null if not initialized
 */
export function getUndoRedoInfo() {
  if (!stateManagerInstance) {
    console.error("State manager not initialized");
    return null;
  }
  return stateManagerInstance.getUndoRedoInfo();
}

/**
 * Clear undo/redo history
 * @returns {boolean} Success status
 */
export function clearUndoHistory() {
  if (!stateManagerInstance) {
    console.error("State manager not initialized");
    return false;
  }
  stateManagerInstance.clearUndoRedoHistory();
  return true;
}

export function destroyStateManager() {
  if (stateManagerInstance) {
    stateManagerInstance.destroy();
    stateManagerInstance = null;
  }
}
