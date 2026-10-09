import { DEFAULT_LEVEL_DATA } from "./defaultLevelData.js";

export class LevelSettings {
  constructor() {
    this.levelData = { ...DEFAULT_LEVEL_DATA };
    this._listeners = {};
  }

  addEventListener(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
  }

  removeEventListener(event, callback) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter((cb) => cb !== callback);
  }

  _dispatch(event) {
    if (this._listeners[event]) {
      for (const cb of this._listeners[event]) cb();
    }
  }

  updateLevelData(key, value) {
    if (key.includes(".")) {
      const keys = key.split(".");
      let current = this.levelData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    } else {
      this.levelData[key] = value;
    }

    this.syncSettings();
    if (globalThis._editorScope?.stateManager) {
      globalThis._editorScope.stateManager.pushUndoState(`Change ${key}`);
    }
  }

  setLevelExtraData(key, data) {
    if (!this.levelData.extraData) {
      this.levelData.extraData = {};
    }
    this.updateLevelData(`extraData.${key}`, data);
    this.levelData.extraData[key] = data;
    this.syncSettings();
    if (globalThis._editorScope?.stateManager) {
      globalThis._editorScope.stateManager.pushUndoState(
        `Set extra data ${key}`
      );
    }
  }

  getLevelExtraData(key) {
    if (!this.levelData.extraData) {
      return undefined;
    }
    return this.levelData.extraData[key];
  }

  updateLevelExtraData(key, updates) {
    const currentData = this.getLevelExtraData(key) || {};
    this.setLevelExtraData(key, { ...currentData, ...updates });
  }

  removeLevelExtraData(key) {
    if (!this.levelData.extraData || !(key in this.levelData.extraData)) {
      return false;
    }
    delete this.levelData.extraData[key];
    this.syncSettings();
    if (globalThis._editorScope?.stateManager) {
      globalThis._editorScope.stateManager.pushUndoState(
        `Remove extra data ${key}`
      );
    }
    return true;
  }

  getLevelDataValue(key) {
    if (key.includes(".")) {
      const keys = key.split(".");
      let current = this.levelData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          return undefined;
        }
        current = current[keys[i]];
      }
      return current[keys[keys.length - 1]];
    }
    return this.levelData[key];
  }

  getLevelData() {
    return JSON.parse(JSON.stringify(this.levelData));
  }

  /**
   * Live, NON-cloning reference to the internal level data. getLevelData()
   * deep-clones the entire level (JSON round-trip) on every call as a defensive
   * copy — fine for occasional callers, catastrophic for hot read paths that
   * call it hundreds of times (e.g. groupManager.getGroups(), invoked per
   * instance during selection). Use this ONLY for read-only access, or for the
   * established immutable-update pattern where callers shallow-copy and replace
   * entries with new objects before persisting via updateLevelData(). Never
   * mutate the returned object (or its nested objects) in place.
   */
  getLevelDataRef() {
    return this.levelData;
  }

  setLevelData(data) {
    this.levelData = { ...DEFAULT_LEVEL_DATA, ...data };
    const dict = this.levelData.labelDictionary;
    if (dict && typeof dict === "object") {
      const keys = Object.keys(dict);
      const hasLegacy = keys.some((k) => {
        const v = dict[k];
        return !v || typeof v !== "object" || typeof v.id !== "string";
      });
      if (hasLegacy) this.levelData.labelDictionary = {};
    }
    this.syncSettings();
  }

  syncCameraSettings() {
    if (globalThis._editorScope?.cameraController) {
      const moveSpeed =
        this.levelData.cameraSettings?.moveSpeed ||
        DEFAULT_LEVEL_DATA.cameraSettings.moveSpeed;
      if (typeof moveSpeed === "number" && moveSpeed > 0) {
        globalThis._editorScope.cameraController.setMoveSpeed(moveSpeed);
      }

      const rotationSpeed =
        this.levelData.cameraSettings?.rotationSpeed ||
        DEFAULT_LEVEL_DATA.cameraSettings.rotationSpeed;
      if (typeof rotationSpeed === "number" && rotationSpeed > 0) {
        globalThis._editorScope.cameraController.setRotationSpeed(
          rotationSpeed
        );
      }

      const showTarget = this.levelData.cameraSettings?.showTargetGizmo ??
        DEFAULT_LEVEL_DATA.cameraSettings.showTargetGizmo;
      globalThis._editorScope.cameraController.showTargetGizmo = showTarget;

      const gizmoColor = this.levelData.cameraSettings?.targetGizmoColor ??
        DEFAULT_LEVEL_DATA.cameraSettings.targetGizmoColor;
      globalThis._editorScope.cameraController.targetGizmoColor = gizmoColor;

      globalThis._editorScope.cameraController._updateTargetGizmo();

      const isUndoRedo = globalThis._editorScope?.stateManager?.isApplyingUndoRedo;
      if (!isUndoRedo) {
        const savedTarget = this.levelData.cameraSettings?.targetPosition;
        if (savedTarget && Array.isArray(savedTarget) && savedTarget.length === 3) {
          globalThis._editorScope.cameraController.target = [...savedTarget];
        }
      }
    }
  }

  syncGridSettings() {
    const gridSystem = globalThis._editorScope?.gridSystem;
    if (gridSystem) {
      if (this.levelData.gridSettings) {
        const { size, snapToGrid, angleSnap, backgroundColor, gridColor } =
          this.levelData.gridSettings;

        if (size) {
          const gridSize = {
            x: size.x || size,
            y: size.y || size,
            z: size.z || size,
          };
          gridSystem.setGridSize(gridSize);
        }

        if (snapToGrid !== undefined) {
          gridSystem.setSnapToGrid(snapToGrid);
        }

        if (angleSnap !== undefined) {
          gridSystem.setAngleSnap(angleSnap);
        }

        if (backgroundColor !== undefined) {
          gridSystem.setBackgroundColor(backgroundColor);
        }

        if (gridColor !== undefined) {
          gridSystem.setGridColor(gridColor);
        }
      }
      if (this.levelData.levelSize) {
        gridSystem.setLevelSize(this.levelData.levelSize);
      }
    }
  }

  syncLevelName() {
    const levelName = this.levelData.levelName;
    const projectManager = globalThis._editorScope?.projectManager;
    if (projectManager) {
      const currentLevelId = projectManager?.currentProject?.currentLevelId;
      if (currentLevelId) {
        projectManager.currentProject.levels[
          currentLevelId
        ].levelData.levelName = levelName;
        const projectDataDialog = globalThis._editorScope?.projectDataDialog;
        if (projectDataDialog) {
          projectDataDialog.refreshLevelName(currentLevelId);
        }
      }
    }
  }

  syncSettings() {
    this.syncGridSettings();
    this.syncCameraSettings();
    this.syncLevelName();
  }

  destroy() {}
}

let levelSettingsInstance = null;

export function initializeLevelSettings() {
  if (!levelSettingsInstance) {
    levelSettingsInstance = new LevelSettings();
    globalThis._editorScope.levelSettings = levelSettingsInstance;
    setTimeout(() => {
      levelSettingsInstance.syncCameraSettings();
    }, 100);
  }
  return levelSettingsInstance;
}

export function getLevelSettings() {
  return levelSettingsInstance;
}

export function destroyLevelSettings() {
  if (levelSettingsInstance) {
    levelSettingsInstance.destroy();
    levelSettingsInstance = null;
  }
}
