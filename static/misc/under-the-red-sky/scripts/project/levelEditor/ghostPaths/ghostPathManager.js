// Ghost Path Manager for Level Editor
// Manages ghost path data storage, loading, and integration with level settings

import { computeLevelContentHash } from "../validation/levelContentHash.js";

/**
 * Default ghost path settings
 */
const DEFAULT_GHOST_SETTINGS = {
  globalEnabled: true,
  pathsVisible: true,
  playbackEnabled: false,
  autoSaveBest: true,
  autoSaveLast: true,
};

// --- Ghost obsolescence helpers (pure; usable for any level structure) ---

/** Flatten a ghostPaths data blob into a list of ghost records. */
export function collectGhostsFromData(ghostData) {
  if (!ghostData) return [];
  const out = [];
  if (ghostData.bestGhost) out.push(ghostData.bestGhost);
  if (ghostData.lastGhost) out.push(ghostData.lastGhost);
  if (Array.isArray(ghostData.customGhosts)) out.push(...ghostData.customGhosts);
  return out;
}

/**
 * A ghost is obsolete if it carries no content hash (legacy/never stamped) or its
 * hash no longer matches the level's current content hash.
 */
export function isGhostObsoleteForHash(ghost, contentHash) {
  return !ghost || ghost.hash == null || ghost.hash !== contentHash;
}

/**
 * Ghost obsolescence summary for an arbitrary (e.g. non-open) level structure.
 * Reads the level's stored ghost paths and compares against its content hash.
 * @param {Object} levelStructure - `{ instances, levelData, ... }`
 * @returns {{ contentHash:string, hasNonObsoleteGhost:boolean,
 *            fastestNonObsoleteTime:number|null }}
 */
export function getGhostStatusForLevel(levelStructure) {
  const contentHash = computeLevelContentHash(levelStructure);
  const ghostData = levelStructure?.levelData?.extraData?.ghostPaths;
  const nonObsolete = collectGhostsFromData(ghostData).filter(
    (g) => !isGhostObsoleteForHash(g, contentHash)
  );
  const times = nonObsolete
    .map((g) => g.time)
    .filter((t) => typeof t === "number");
  return {
    contentHash,
    hasNonObsoleteGhost: nonObsolete.length > 0,
    fastestNonObsoleteTime: times.length ? Math.min(...times) : null,
  };
}

/**
 * Main Ghost Path Manager class
 * Manages ghost path data using levelSettings extraData system
 */
export class GhostPathManager {
  constructor() {
    this.isEnabled = true;
    this.currentLevelGhosts = null;
    this.listeners = new Map();
    this.loadFromTempNextTime = false;

    // Default colors (RGB values as hex, opacity separate)
    this.defaultColors = {
      best: { color: "#16B0FE", opacity: 1.0 }, // UTRS Blue
      last: { color: "#9d9885", opacity: 0.8 }, // Dust/grey
      custom: { color: "#BA1EFF", opacity: 0.9 }, // Purple
    };

    console.log("[GhostPathManager] Initialized");
  }

  /**
   * Initialize ghost path manager and make it globally accessible
   */
  initialize() {
    // Make globally accessible
    if (typeof globalThis !== "undefined") {
      if (!globalThis._editorScope) {
        globalThis._editorScope = {};
      }
    }

    // Set up level change listeners
    this.setupLevelChangeListeners();

    console.log("[GhostPathManager] Initialized and made globally accessible");
    return this;
  }

  /**
   * Set up listeners for level changes to load ghost data
   */
  setupLevelChangeListeners() {
    // Listen for level loading events with multiple fallback methods
    const trySetupListeners = () => {
      const projectManager = globalThis._editorScope?.projectManager;
      if (
        projectManager &&
        typeof projectManager.addEventListener === "function"
      ) {
        projectManager.addEventListener("projectLoaded", () => {
          console.log("[GhostPathManager] Project loaded event received");
          this.loadCurrentLevelGhosts(this.loadFromTempNextTime);
          this.loadFromTempNextTime = false;
        });

        // Listen for level switching within a project
        projectManager.addEventListener("levelSwitched", () => {
          console.log("[GhostPathManager] Level switched event received");
          this.loadCurrentLevelGhosts();
        });

        // Listen for project closing to clear ghost data
        projectManager.addEventListener("projectClosed", () => {
          console.log("[GhostPathManager] Project closed event received");
          this.clearProjectGhosts();
        });
      }

    };

    // Try immediately
    trySetupListeners();
  }

  /**
   * Determine if a given time is a new best time
   * @param {number} newTime - New completion time in seconds
   * @returns {boolean} Whether this is a new best time
   */
  isNewBestTime(newTime) {
    // First check if we have existing level data
    const existingData = this.loadFromLevelSettings();
    const best = existingData?.bestGhost;

    if (!best) {
      // No existing best time, so this is automatically the best
      return true;
    }

    // An obsolete best (level changed since it was recorded) no longer counts —
    // the next saved run overwrites it regardless of time.
    if (this.isGhostObsolete(best)) {
      return true;
    }

    // Lower time is better (faster completion)
    return newTime < best.time;
  }

  /**
   * Content hash of the currently open level (from the live editor snapshot).
   * @returns {string}
   */
  getCurrentContentHash() {
    const stateManager = globalThis._editorScope?.stateManager;
    const structure = stateManager
      ? stateManager.currentState || stateManager.exportState()
      : null;
    return computeLevelContentHash(structure);
  }

  /** @returns {boolean} whether a ghost is obsolete for the current open level. */
  isGhostObsolete(ghost) {
    return isGhostObsoleteForHash(ghost, this.getCurrentContentHash());
  }

  /** @returns {boolean} whether the open level has at least one non-obsolete ghost. */
  hasNonObsoleteGhost() {
    const hash = this.getCurrentContentHash();
    const ghosts = [
      this.getBestGhost(),
      this.getLastGhost(),
      ...this.getCustomGhosts(),
    ];
    return ghosts.some((g) => g && !isGhostObsoleteForHash(g, hash));
  }

  /**
   * Fastest time among the open level's non-obsolete ghosts.
   * @returns {number|null}
   */
  getFastestNonObsoleteGhostTime() {
    const hash = this.getCurrentContentHash();
    const times = [
      this.getBestGhost(),
      this.getLastGhost(),
      ...this.getCustomGhosts(),
    ]
      .filter((g) => g && !isGhostObsoleteForHash(g, hash))
      .map((g) => g.time)
      .filter((t) => typeof t === "number");
    return times.length ? Math.min(...times) : null;
  }

  /**
   * Load ghost data from tempData when level loads
   */
  loadGhostDataFromTemp() {
    const levelLoader = globalThis?.levelLoader;
    if (!levelLoader) {
      console.warn("[GhostPathManager] Level loader not available");
      return null;
    }

    // Get current level ID
    const currentLevelId = this.getCurrentLevelId();
    if (!currentLevelId) {
      console.warn("[GhostPathManager] No current level ID available");
      return null;
    }

    // Get temp data for this level
    const tempData = levelLoader.getTempData(currentLevelId);
    if (tempData) {
      console.log(
        `[GhostPathManager] Found temp data for level ${currentLevelId}:`,
        tempData
      );
      return this.convertTempDataToGhostFormat(tempData);
    }

    return null;
  }

  /**
   * Convert temp data format to internal ghost format
   * @param {Object} tempData - Raw temp data from level loader: {time, ghostData}
   * @returns {Object} Converted ghost data
   */
  convertTempDataToGhostFormat(tempData) {
    const ghostData = {
      settings: { ...DEFAULT_GHOST_SETTINGS },
      customGhosts: [],
    };

    // Convert temp data if available
    if (
      tempData.time &&
      tempData.ghostData &&
      Array.isArray(tempData.ghostData)
    ) {
      // When no existing data, first run is always the best
      ghostData.bestGhost = {
        time: tempData.time,
        data: tempData.ghostData,
        color: this.defaultColors.best.color,
        opacity: this.defaultColors.best.opacity,
        name: "Best Time",
        created: Date.now(),
        hash: this.getCurrentContentHash(),
      };

      // No last ghost since this is the first/best run
      ghostData.lastGhost = null;
    }

    return ghostData;
  }

  /**
   * Get current level ID from the editor
   * @returns {string|null} Current level ID
   */
  getCurrentLevelId() {
    // Fallback to project manager
    const projectManager = globalThis._editorScope?.projectManager;
    if (projectManager.isProjectLoaded) {
      return projectManager.currentProject.currentLevelId;
    }

    return null;
  }

  /**
   * Load current level's ghost data
   * @param {boolean} allowTempDataLoad - Whether to load from temp data if available
   */
  loadCurrentLevelGhosts(allowTempDataLoad = false) {
    console.log(
      `[GhostPathManager] Loading ghost data for current level (temp allowed: ${allowTempDataLoad})`
    );
    // First try to load from levelSettings
    let ghostData = this.loadFromLevelSettings();

    if (allowTempDataLoad) {
      // Only check temp data if explicitly allowed (e.g., returning from play)
      if (!ghostData || Object.keys(ghostData).length === 0) {
        const tempGhostData = this.loadGhostDataFromTemp();
        if (tempGhostData) {
          ghostData = tempGhostData;
          // Save to level settings for persistence
          this.saveToLevelSettings(ghostData);
        }
      } else {
        // We have existing data, but check if we should update with new temp data
        const tempData = this.loadGhostDataFromTemp();
        this.updateGhostDataWithTemp(tempData, ghostData);
      }
    }

    // If still no data, create default structure
    if (!ghostData) {
      ghostData = {
        settings: { ...DEFAULT_GHOST_SETTINGS },
        customGhosts: [],
      };
      // Save the default structure
      this.saveToLevelSettings(ghostData);
    }
    this.currentLevelGhosts = ghostData;
    this.notifyListeners("ghostDataLoaded", ghostData);

    // Returning from play: also persist ghost runs recorded for other levels in a
    // multi-level session (the current level was just handled above).
    if (allowTempDataLoad) {
      this.importOtherLevelTempGhosts();
    }

    console.log(`[GhostPathManager] Successfully loaded ghost data:`, {
      hasBest: !!ghostData.bestGhost,
      hasLast: !!ghostData.lastGhost,
      customCount: ghostData.customGhosts?.length || 0,
      settings: ghostData.settings,
    });
  }

  allowLoadingFromTempData() {
    this.loadFromTempNextTime = true;
  }
  /**
   * Update existing ghost data with new temp data
   * @param {Object} tempData - New temp data: {time, ghostData}
   * @param {Object} existingData - Existing ghost data to update
   */
  updateGhostDataWithTemp(tempData, existingData) {
    if (tempData.bestGhost) {
      tempData = tempData.bestGhost;
    }
    const isNewBest = this.isNewBestTime(tempData.time);

    if (isNewBest) {
      // This is a new best time
      console.log(
        "[GhostPathManager] New best time detected, updating best ghost"
      );

      // Set new best ghost
      existingData.bestGhost = {
        time: tempData.time,
        data: tempData.data,
        color: this.defaultColors.best.color,
        opacity: this.defaultColors.best.opacity,
        name: "Best Time",
        created: Date.now(),
        hash: this.getCurrentContentHash(),
      };

      // Remove last ghost since it would be the same as the new best
      existingData.lastGhost = null;
    } else {
      // This is not a best time, just update the last ghost
      console.log("[GhostPathManager] Updating last ghost with new run");

      existingData.lastGhost = {
        time: tempData.time,
        data: tempData.data,
        color: this.defaultColors.last.color,
        opacity: this.defaultColors.last.opacity,
        name: "Last Run",
        created: Date.now(),
        hash: this.getCurrentContentHash(),
      };
    }

    console.log("[GhostPathManager] Updated ghost data with temp data");

    // Ensure data is saved after update
    this.saveToLevelSettings(existingData);
  }

  /**
   * Apply a completed run to a ghost data blob: replaces the best ghost if it's a
   * new best (or the existing best is obsolete), otherwise updates the last ghost.
   * Stamps the run with the given content hash. Mutates and returns `ghostData`.
   * @param {Object} ghostData - { settings, bestGhost, lastGhost, customGhosts }
   * @param {{time:number, data:Array}} run
   * @param {string} contentHash
   */
  applyRunToGhostData(ghostData, run, contentHash) {
    const best = ghostData.bestGhost;
    const bestObsolete = !best || best.hash == null || best.hash !== contentHash;
    const isNewBest = bestObsolete || run.time < best.time;

    if (isNewBest) {
      ghostData.bestGhost = {
        time: run.time,
        data: run.data,
        color: this.defaultColors.best.color,
        opacity: this.defaultColors.best.opacity,
        name: "Best Time",
        created: Date.now(),
        hash: contentHash,
      };
      ghostData.lastGhost = null;
    } else {
      ghostData.lastGhost = {
        time: run.time,
        data: run.data,
        color: this.defaultColors.last.color,
        opacity: this.defaultColors.last.opacity,
        name: "Last Run",
        created: Date.now(),
        hash: contentHash,
      };
    }
    return ghostData;
  }

  /**
   * Import ghost runs that were recorded for OTHER levels during a multi-level
   * play session. The game writes per-level temp data keyed by level id
   * (eventSheet: `setTempData(curLayoutId, {time, ghostData})`); the current level
   * is handled by `loadCurrentLevelGhosts`, so here we persist every *other*
   * level's run into its stored `levelData.extraData.ghostPaths`.
   */
  importOtherLevelTempGhosts() {
    const levelLoader = globalThis?.levelLoader;
    const projectManager = globalThis._editorScope?.projectManager;
    if (!levelLoader || !projectManager?.isProjectLoaded) return;
    if (typeof levelLoader.getTempDataKeys !== "function") return;

    const levels = projectManager.currentProject.levels;
    const currentLevelId = projectManager.currentProject.currentLevelId;
    let changed = false;

    for (const key of levelLoader.getTempDataKeys()) {
      if (key === currentLevelId) continue; // handled live by loadCurrentLevelGhosts
      const level = levels[key];
      if (!level) continue; // not a level id (e.g. "lastProject")

      const temp = levelLoader.getTempData(key);
      if (!temp || !temp.time || !Array.isArray(temp.ghostData)) continue;

      if (!level.levelData) level.levelData = {};
      if (!level.levelData.extraData) level.levelData.extraData = {};
      const ghostData = level.levelData.extraData.ghostPaths || {
        settings: { ...DEFAULT_GHOST_SETTINGS },
        customGhosts: [],
      };

      this.applyRunToGhostData(
        ghostData,
        { time: temp.time, data: temp.ghostData },
        computeLevelContentHash(level)
      );
      level.levelData.extraData.ghostPaths = ghostData;
      levelLoader.removeTempData(key);
      changed = true;
      console.log(
        `[GhostPathManager] Imported ghost run for level ${key} from temp data`
      );
    }

    if (changed && typeof projectManager.markAsUnsaved === "function") {
      projectManager.markAsUnsaved();
    }
  }

  /**
   * Format time in seconds to readable string
   * @param {number} time - Time in seconds
   * @returns {string} Formatted time string
   */
  formatTime(time) {
    if (!time) return "Unknown";

    const totalSeconds = Math.floor(time);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const milliseconds = (time % 1) * 1000; // Get fractional seconds as milliseconds

    if (minutes > 0) {
      return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}.${Math.floor(milliseconds / 10)
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${remainingSeconds}.${Math.floor(milliseconds / 10)
        .toString()
        .padStart(2, "0")}s`;
    }
  }

  /**
   * Save current ghost data to levelSettings
   * @param {Object} ghostData - Ghost data to save
   */
  saveToLevelSettings(ghostData = null) {
    const levelSettings = globalThis._editorScope?.levelSettings;
    if (!levelSettings) {
      console.warn(
        "[GhostPathManager] Level settings not available - saving will be skipped"
      );
      return false;
    }

    const dataToSave = ghostData || this.currentLevelGhosts;
    if (!dataToSave) {
      console.warn("[GhostPathManager] No ghost data to save");
      return false;
    }

    try {
      levelSettings.setLevelExtraData("ghostPaths", dataToSave);
      console.log(
        "[GhostPathManager] Successfully saved ghost data to level settings"
      );
      return true;
    } catch (error) {
      console.error(
        "[GhostPathManager] Failed to save ghost data to level settings:",
        error
      );
      return false;
    }
  }

  /**
   * Load ghost data from levelSettings
   * @returns {Object|null} Ghost data or null if not found
   */
  loadFromLevelSettings() {
    const levelSettings = globalThis._editorScope?.levelSettings;
    if (!levelSettings) {
      console.warn(
        "[GhostPathManager] Level settings not available - loading will be skipped"
      );
      return null;
    }

    try {
      const data = levelSettings.getLevelExtraData("ghostPaths");
      if (data) {
        console.log(
          "[GhostPathManager] Successfully loaded ghost data from level settings"
        );
      } else {
        console.log("[GhostPathManager] No ghost data found in level settings");
      }
      return data;
    } catch (error) {
      console.error(
        "[GhostPathManager] Failed to load ghost data from level settings:",
        error
      );
      return null;
    }
  }

  /**
   * Get all ghost data for current level
   * @returns {Object|null} Current level's ghost data
   */
  getCurrentLevelGhosts() {
    return this.currentLevelGhosts;
  }

  /**
   * Get best ghost for current level
   * @returns {Object|null} Best ghost data
   */
  getBestGhost() {
    return this.currentLevelGhosts?.bestGhost || null;
  }

  /**
   * Get last ghost for current level
   * @returns {Object|null} Last ghost data
   */
  getLastGhost() {
    return this.currentLevelGhosts?.lastGhost || null;
  }

  /**
   * Get custom ghosts for current level
   * @returns {Array} Array of custom ghost data
   */
  getCustomGhosts() {
    return this.currentLevelGhosts?.customGhosts || [];
  }

  /**
   * Get ghost settings for current level
   * @returns {Object} Ghost settings
   */
  getGhostSettings() {
    return this.currentLevelGhosts?.settings || { ...DEFAULT_GHOST_SETTINGS };
  }

  /**
   * Add a new custom ghost from the last ghost
   * @param {string} name - Name for the ghost
   * @returns {boolean} Success status
   */
  addCustomGhostFromLast(name) {
    if (!this.currentLevelGhosts) {
      this.loadCurrentLevelGhosts();
    }

    const lastGhost = this.getLastGhost();
    if (!lastGhost) {
      return false;
    }

    this.addCustomGhost(
      name,
      lastGhost.time,
      lastGhost.data,
      lastGhost.color,
      lastGhost.opacity,
      lastGhost.hash
    );
    return true;
  }

  /**
   * Add a new custom ghost from the best ghost
   * @param {string} name - Name for the ghost
   * @returns {boolean} Success status
   */
  addCustomGhostFromBest(name) {
    if (!this.currentLevelGhosts) {
      this.loadCurrentLevelGhosts();
    }

    const bestGhost = this.getBestGhost();
    if (!bestGhost) {
      return false;
    }

    this.addCustomGhost(
      name,
      bestGhost.time,
      bestGhost.data,
      bestGhost.color,
      bestGhost.opacity,
      bestGhost.hash
    );
    return true;
  }

  /**
   * Check if the last ghost is available for saving as custom
   * @returns {boolean} Whether last ghost can be saved as custom
   */
  canSaveLastGhostAsCustom() {
    return this.getLastGhost() !== null;
  }

  /**
   * Check if the best ghost is available for saving as custom
   * @returns {boolean} Whether best ghost can be saved as custom
   */
  canSaveBestGhostAsCustom() {
    return this.getBestGhost() !== null;
  }

  /**
   * Add a new custom ghost
   * @param {string} name - Name for the ghost
   * @param {number} time - Completion time
   * @param {Array} data - Ghost path data
   * @param {string} color - Hex color string
   * @param {number} opacity - Opacity value (0-1)
   * @returns {string} Generated ghost ID
   */
  addCustomGhost(name, time, data, color = null, opacity = 0.9, hash = null) {
    if (!this.currentLevelGhosts) {
      this.loadCurrentLevelGhosts();
    }

    const ghostId = this.generateGhostId();
    const customGhost = {
      id: ghostId,
      name: name || `Custom Ghost ${this.getCustomGhosts().length + 1}`,
      time,
      data,
      color: color || this.defaultColors.custom.color,
      opacity,
      created: Date.now(),
      // Inherit the source run's hash when provided (so a custom saved from an
      // obsolete best stays obsolete); otherwise stamp the current level.
      hash: hash != null ? hash : this.getCurrentContentHash(),
    };

    if (!this.currentLevelGhosts.customGhosts) {
      this.currentLevelGhosts.customGhosts = [];
    }

    this.currentLevelGhosts.customGhosts.push(customGhost);
    this.saveToLevelSettings();

    this.notifyListeners("customGhostAdded", customGhost);
    console.log("[GhostPathManager] Added custom ghost:", customGhost);

    return ghostId;
  }

  /**
   * Remove a custom ghost
   * @param {string} ghostId - ID of ghost to remove
   * @returns {boolean} Success status
   */
  removeCustomGhost(ghostId) {
    if (!this.currentLevelGhosts?.customGhosts) {
      return false;
    }

    const index = this.currentLevelGhosts.customGhosts.findIndex(
      (ghost) => ghost.id === ghostId
    );

    if (index === -1) {
      return false;
    }

    const removedGhost = this.currentLevelGhosts.customGhosts.splice(
      index,
      1
    )[0];
    this.saveToLevelSettings();

    this.notifyListeners("customGhostRemoved", removedGhost);
    console.log("[GhostPathManager] Removed custom ghost:", removedGhost);

    return true;
  }

  /**
   * Remove the best ghost
   * @returns {boolean} Success status
   */
  removeBestGhost() {
    if (!this.currentLevelGhosts?.bestGhost) {
      return false;
    }

    const removedGhost = this.currentLevelGhosts.bestGhost;
    this.currentLevelGhosts.bestGhost = null;
    this.saveToLevelSettings();

    this.notifyListeners("bestGhostRemoved", removedGhost);
    console.log("[GhostPathManager] Removed best ghost:", removedGhost);

    return true;
  }

  /**
   * Remove the last ghost
   * @returns {boolean} Success status
   */
  removeLastGhost() {
    if (!this.currentLevelGhosts?.lastGhost) {
      return false;
    }

    const removedGhost = this.currentLevelGhosts.lastGhost;
    this.currentLevelGhosts.lastGhost = null;
    this.saveToLevelSettings();

    this.notifyListeners("lastGhostRemoved", removedGhost);
    console.log("[GhostPathManager] Removed last ghost:", removedGhost);

    return true;
  }

  /**
   * Remove any ghost by ID (best, last, or custom)
   * @param {string} ghostId - ID of ghost to remove
   * @returns {boolean} Success status
   */
  removeGhost(ghostId) {
    if (ghostId === "best") {
      return this.removeBestGhost();
    } else if (ghostId === "last") {
      return this.removeLastGhost();
    } else {
      return this.removeCustomGhost(ghostId);
    }
  }

  /**
   * Update a custom ghost
   * @param {string} ghostId - ID of ghost to update
   * @param {Object} updates - Updates to apply
   * @returns {boolean} Success status
   */
  updateCustomGhost(ghostId, updates) {
    if (!this.currentLevelGhosts?.customGhosts) {
      return false;
    }

    const ghost = this.currentLevelGhosts.customGhosts.find(
      (g) => g.id === ghostId
    );

    if (!ghost) {
      return false;
    }

    Object.assign(ghost, updates);
    this.saveToLevelSettings();

    this.notifyListeners("customGhostUpdated", ghost);
    console.log("[GhostPathManager] Updated custom ghost:", ghost);

    return true;
  }

  /**
   * Update ghost settings
   * @param {Object} settings - Settings to update
   */
  updateGhostSettings(settings) {
    if (!this.currentLevelGhosts) {
      this.loadCurrentLevelGhosts();
    }

    if (!this.currentLevelGhosts.settings) {
      this.currentLevelGhosts.settings = { ...DEFAULT_GHOST_SETTINGS };
    }

    Object.assign(this.currentLevelGhosts.settings, settings);
    this.saveToLevelSettings();

    this.notifyListeners(
      "ghostSettingsUpdated",
      this.currentLevelGhosts.settings
    );
    console.log("[GhostPathManager] Updated ghost settings:", settings);
  }

  /**
   * Set global enabled state
   * @param {boolean} enabled - Whether ghost paths are enabled
   */
  setGlobalEnabled(enabled) {
    this.isEnabled = enabled;
    this.updateGhostSettings({ globalEnabled: enabled });
  }

  /**
   * Get global enabled state
   * @returns {boolean} Whether ghost paths are enabled
   */
  getGlobalEnabled() {
    return this.getGhostSettings().globalEnabled && this.isEnabled;
  }

  /**
   * Clear all ghost data for current level
   */
  clearAllGhosts() {
    if (!this.currentLevelGhosts) {
      // Even if no current level ghosts, still notify to clear any rendered paths
      this.notifyListeners("allGhostsCleared");
      return;
    }

    this.currentLevelGhosts.bestGhost = null;
    this.currentLevelGhosts.lastGhost = null;
    this.currentLevelGhosts.customGhosts = [];
    this.saveToLevelSettings();

    this.notifyListeners("allGhostsCleared");
    console.log("[GhostPathManager] Cleared all ghosts for current level");
  }

  /**
   * Clear all ghost data when project is closed
   */
  clearProjectGhosts() {
    // Clear the current level ghosts reference
    this.currentLevelGhosts = null;

    // Notify listeners to clear rendered paths
    this.notifyListeners("allGhostsCleared");
    console.log("[GhostPathManager] Cleared all ghost data for closed project");
  }

  /**
   * Generate a unique ghost ID
   * @returns {string} Generated ID
   */
  generateGhostId() {
    return `ghost_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Convert RGB hex color and opacity to RGBA array
   * @param {string} hexColor - Hex color string (e.g., "#16B0FE")
   * @param {number} opacity - Opacity value (0-1)
   * @returns {Array} RGBA array [r, g, b, a] with values 0-1
   */
  colorToRGBA(hexColor, opacity = 1.0) {
    // Remove # if present
    const hex = hexColor.replace("#", "");

    // Parse RGB values
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    return [r, g, b, opacity];
  }

  /**
   * Convert RGBA array to hex color and opacity
   * @param {Array} rgbaArray - RGBA array [r, g, b, a] with values 0-1
   * @returns {Object} Object with color (hex) and opacity
   */
  rgbaToColor(rgbaArray) {
    const [r, g, b, a] = rgbaArray;

    // Convert to hex
    const toHex = (n) =>
      Math.round(n * 255)
        .toString(16)
        .padStart(2, "0");
    const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

    return {
      color: hexColor.toUpperCase(),
      opacity: a,
    };
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Notify listeners of an event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(
            `[GhostPathManager] Error in event listener for ${event}:`,
            error
          );
        }
      });
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.currentLevelGhosts = null;
    this.listeners.clear();
    this.isEnabled = false;

    console.log("[GhostPathManager] Destroyed");
  }
}

// Singleton instance
let ghostPathManagerInstance = null;

/**
 * Get or create the singleton ghost path manager instance
 * @returns {GhostPathManager} The ghost path manager instance
 */
export function getGhostPathManager() {
  if (!ghostPathManagerInstance) {
    ghostPathManagerInstance = new GhostPathManager();
  }
  return ghostPathManagerInstance;
}

/**
 * Initialize ghost path manager
 * @returns {GhostPathManager} The ghost path manager instance
 */
export function initializeGhostPathManager() {
  const manager = getGhostPathManager();
  return manager.initialize();
}

/**
 * Destroy the ghost path manager instance
 */
export function destroyGhostPathManager() {
  if (ghostPathManagerInstance) {
    ghostPathManagerInstance.destroy();
    ghostPathManagerInstance = null;
  }
}
