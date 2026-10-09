// Level Loader System
// Handles loading and managing level packs for gameplay
// Supports both single levels and level packs from .utrsproj files

import { PROJECT_VERSION, LEVEL_PROJECT_EXTENSION } from "../globalValues.js";
import { createInstanceFromData } from "./instanceCreator.js";
import { hexToRgb, END_ZONE_EXIT } from "../objectTypeDefinitions.js";
import { setCustomMaterialsRegistry } from "../materials/materialsManager.js";
import { ScriptRuntime } from "../scripting/scriptRuntime.js";
import { stashLabelData } from "../scripting/api/labelStore.js";
import { normalizeVarDefs } from "../labels/labelVarTypes.js";

/**
 * Enum for pack completion modes
 */
export const PackCompletionMode = {
  END_OF_ANY_LEVEL: "end_of_any_level", // Pack ends when any level is completed
  END_OF_LAST_LEVEL: "end_of_last_level", // Pack ends only when the last level is completed
};

/**
 * Main Level Loader class
 * Manages loading and playing levels from .utrsproj files
 */
export class LevelLoader {
  constructor(runtime) {
    this.loadedProject = null;
    this.currentLevelId = null;
    this.levelOrder = []; // Array of level IDs in pack order
    this.currentLevelIndex = 0;
    this.pendingTransition = null; // { index, id } awaiting layout restart
    this.returnDestination = null; // Where to go when pack is completed
    this.targetLayout = null; // Layout to load levels in
    this.packCompletionMode = PackCompletionMode.END_OF_LAST_LEVEL;
    this.startCheckpointId = null; // play-from-camera spawn checkpoint
    this.startCheckpointLevelId = null;
    this.recordGhosts = true; // false: editor discards this session's ghost runs
    this.isInitialized = false;
    this.runtime = runtime;

    // Event listeners
    this.listeners = new Map();

    // Temporary data storage for editor-to-play transfer (key-value pairs like localStorage)
    this.tempDataStorage = new Map();

    // label name -> created Construct instances, rebuilt each level load.
    // Consumed by the level script's level.find()/findAll().
    this.labelMap = new Map();
    // Runs the per-level global script during play (lazily created).
    this.scriptRuntime = null;

    console.log("[LevelLoader] Initialized");
  }

  /**
   * Load a .utrsproj file into memory
   * @param {string|File|Object} projectInput - Can be JSON string, File object, or parsed project data
   * @returns {Promise<boolean>} Success status
   */
  async loadProject(projectInput) {
    this.unloadProject();

    // Clear temp data storage when loading a new project
    this.clearTempData();

    this.scriptRuntime?.clearLevelSave();
    this.scriptRuntime?.clearPackSave();

    try {
      let projectData;

      // Handle different input types
      if (typeof projectInput === "string") {
        // JSON string
        projectData = JSON.parse(projectInput);
      } else if (projectInput instanceof File) {
        // File object
        const text = await projectInput.text();
        projectData = JSON.parse(text);
      } else if (typeof projectInput === "object") {
        // Already parsed object
        projectData = JSON.parse(JSON.stringify(projectInput)); // Deep copy to avoid mutations
      } else {
        throw new Error("Invalid project input type");
      }

      // Validate project structure
      if (!this.validateProjectStructure(projectData)) {
        throw new Error("Invalid project structure");
      }

      this.loadedProject = projectData;
      // Make this project's custom materials resolvable at runtime (no editor
      // scope / projectManager exists here) so applyMaterialDataToInstance and
      // the scripting createMaterial(...) can resolve CustomMaterials ids.
      setCustomMaterialsRegistry(projectData.sharedData?.customMaterials);
      this.levelOrder = Object.keys(projectData.levels);
      this.currentLevelIndex = 0;
      this.currentLevelId = null;
      this.isInitialized = true;

      // load in levelData json
      const levelDataInstance =
        this.runtime.objects.levelData.getFirstInstance();
      const levelDataJson = levelDataInstance.getJsonDataCopy();
      const curChapterData = {
        name: this.loadedProject.projectName,
        levels: [...this.levelOrder],
        playlist: this.loadedProject.sharedData.projectPlaylist ?? "default",
        difficulty: this.loadedProject.sharedData.projectDifficulty ?? 0,
        levelEditor: 1,
      };

      levelDataJson.chapters[this.loadedProject.projectId] = curChapterData;

      levelDataInstance.setJsonDataCopy(levelDataJson);

      console.log(
        `[LevelLoader] Loaded project: ${projectData.projectName} with ${this.levelOrder.length} levels`,
      );

      // Notify listeners
      this.notifyListeners("projectLoaded", {
        projectName: projectData.projectName,
        levelCount: this.levelOrder.length,
        levels: this.levelOrder,
      });

      return true;
    } catch (error) {
      console.error("[LevelLoader] Failed to load project:", error);
      this.notifyListeners("loadError", { error: error.message });
      return false;
    }
  }

  /**
   * Load project from file picker
   * @returns {Promise<boolean>} Success status
   */
  async loadProjectFromFile() {
    try {
      // Check if File System API is supported
      if ("showOpenFilePicker" in window) {
        const [fileHandle] = await window.showOpenFilePicker({
          types: [
            {
              description: "Level Editor Project files",
              accept: {
                "application/json": [LEVEL_PROJECT_EXTENSION],
              },
            },
          ],
          multiple: false,
        });

        const file = await fileHandle.getFile();
        return await this.loadProject(file);
      } else {
        // Fallback to file input
        return await this.loadProjectFromFileInput();
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("[LevelLoader] File selection cancelled");
        return false;
      }
      console.error("[LevelLoader] Failed to load project from file:", error);
      return false;
    }
  }

  /**
   * Fallback file loading method
   * @returns {Promise<boolean>} Success status
   */
  loadProjectFromFileInput() {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = LEVEL_PROJECT_EXTENSION + ", .json";
      input.style.display = "none";

      input.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          const success = await this.loadProject(file);
          resolve(success);
        } else {
          resolve(false);
        }
      });

      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    });
  }

  /**
   * Configure the level pack for playing
   * @param {Object} config - Configuration object
   * @param {string} config.startLevelId - Specific level ID to start from (optional)
   * @param {string} config.returnDestination - Where to go when pack is completed
   * @param {string} config.targetLayout - Which layout to load levels in
   * @param {PackCompletionMode} config.packCompletionMode - When the pack is considered complete
   */
  configure(config) {
    if (!this.isInitialized || !this.loadedProject) {
      console.error("[LevelLoader] No project loaded");
      return false;
    }

    const {
      startLevelId,
      returnDestination,
      targetLayout,
      packCompletionMode = PackCompletionMode.END_OF_LAST_LEVEL,
      startCheckpointId = null,
      recordGhosts = true,
    } = config;

    this.returnDestination = returnDestination;
    this.targetLayout = targetLayout;
    this.packCompletionMode = packCompletionMode;
    // "Play from camera": spawn at this checkpoint id in the start level.
    this.startCheckpointId = startCheckpointId;
    this.startCheckpointLevelId = startCheckpointId ? startLevelId : null;
    // false → the editor discards ghost runs recorded during this session.
    this.recordGhosts = recordGhosts !== false;

    // Set starting level
    if (startLevelId) {
      const levelIndex = this.levelOrder.indexOf(startLevelId);
      if (levelIndex === -1) {
        console.error("[LevelLoader] Invalid start level ID:", startLevelId);
        return false;
      }
      this.currentLevelIndex = levelIndex;
    } else {
      this.currentLevelIndex = 0;
    }

    this.currentLevelId = this.levelOrder[this.currentLevelIndex];
    this.pendingTransition = null;

    console.log(
      `[LevelLoader] Configured: starting at level ${
        this.currentLevelIndex + 1
      }/${
        this.levelOrder.length
      }, return to ${returnDestination}, completion mode: ${packCompletionMode}`,
    );

    this.notifyListeners("configured", {
      startLevelId: this.currentLevelId,
      startLevelIndex: this.currentLevelIndex,
      totalLevels: this.levelOrder.length,
      returnDestination,
      targetLayout,
      packCompletionMode,
      startCheckpointId: this.startCheckpointId,
      recordGhosts: this.recordGhosts,
    });

    return true;
  }

  /**
   * Start the level pack and load the target layout
   * @returns {boolean} Success status
   */
  start() {
    if (!this.isInitialized || !this.loadedProject || !this.targetLayout) {
      console.error("[LevelLoader] Not properly configured");
      return false;
    }

    // Load the target layout
    this.loadLayout(this.targetLayout);

    console.log(`[LevelLoader] Started in layout: ${this.targetLayout}`);
    return true;
  }

  /**
   * Load the current level into the game
   * @returns {boolean} Success status
   */
  loadCurrentLevel() {
    if (!this.isInitialized || !this.loadedProject) {
      console.error("[LevelLoader] No project loaded");
      return false;
    }

    if (this.currentLevelIndex >= this.levelOrder.length) {
      console.error(
        "[LevelLoader] Invalid level index:",
        this.currentLevelIndex,
      );
      return false;
    }

    // A level change decided by onLevelComplete is only committed here, when
    // the layout actually (re)starts for it. A restart in between (which
    // reloads the same layout) cancels it via cancelPendingTransition(), so
    // "restart after finishing" replays the level just finished.
    if (this.pendingTransition) {
      const p = this.pendingTransition;
      this.pendingTransition = null;
      this.currentLevelIndex = p.index;
      this.currentLevelId = p.id;
    }

    const levelId = this.levelOrder[this.currentLevelIndex];
    const levelData = this.loadedProject.levels[levelId];

    if (!levelData) {
      console.error("[LevelLoader] Level data not found:", levelId);
      return false;
    }

    try {
      // Update current level ID
      this.currentLevelId = levelId;
      // Create all objects from the level data
      this.createLevelObjects(levelData);

      // Bake the static shapes now that every level object exists (labelled
      // ones were excluded during creation). Anything created from here on,
      // including by the level script, stays dynamic.
      globalThis.staticBake?.bakeCurrentLayout("levelLoader");

      // Apply level settings (fog, skybox, etc.)
      this.applyLevelSettings(levelData.levelData);

      const manager = this.runtime.objects.globalManager.getFirstInstance();
      manager.instVars.curLayoutId = this.currentLevelId;
      manager.instVars.curLayoutName = levelData.levelData.levelName;

      // Spawn at an injected checkpoint (play-from-camera). We run on
      // beforelayoutstart, ahead of every on-start-of-layout, so E_player's
      // spawn sees the id. Its first-entry branch (previousLayout !=
      // curLayoutId) clears the checkpoint and only the else-branch honours
      // it, hence previousLayout is set to look like a restart. Side effect:
      // the per-level failAmount / fallsSameLevel resets are skipped.
      if (
        this.startCheckpointId &&
        this.currentLevelId === this.startCheckpointLevelId
      ) {
        this.runtime.globalVars.checkpointID = this.startCheckpointId;
        manager.instVars.previousLayout = this.currentLevelId;
      }

      // Run the level's global script (registers handlers, fires "start",
      // wires "tick"). Covers editor test-play and the shipped game alike.
      this.runLevelScript(levelData.levelData);

      console.log(
        `[LevelLoader] Loaded level: ${levelData.levelData.levelName} (${
          this.currentLevelIndex + 1
        }/${this.levelOrder.length})`,
      );

      this.notifyListeners("levelLoaded", {
        levelId,
        levelName: levelData.levelData.levelName,
        levelIndex: this.currentLevelIndex,
        totalLevels: this.levelOrder.length,
        isLastLevel: this.currentLevelIndex >= this.levelOrder.length - 1,
      });

      return true;
    } catch (error) {
      console.error("[LevelLoader] Failed to load level:", error);
      this.notifyListeners("levelLoadError", { levelId, error: error.message });
      return false;
    }
  }

  /**
   * Handle level completion - decides whether to continue or end the pack
   * @param {object|number} [endZone] the end zone instance that was reached
   *   (a uid is resolved too). Its `override` instance variable (inspector
   *   "Next Level") may name a level of the pack to load next regardless of
   *   pack order / completion mode, or END_ZONE_EXIT to leave the pack.
   * @returns {string} Action taken: 'nextLevel', 'packComplete', or 'error'
   */
  onLevelComplete(endZone) {
    if (typeof endZone === "number")
      endZone = this.runtime?.getInstanceByUid?.(endZone) ?? null;
    if (!this.isInitialized || !this.loadedProject) {
      console.error("[LevelLoader] No project loaded");
      return "error";
    }

    this.scriptRuntime?.clearLevelSave();

    const levelId = this.currentLevelId;
    const isLastLevel = this.currentLevelIndex >= this.levelOrder.length - 1;

    console.log(
      `[LevelLoader] Level completed: ${levelId} (${
        this.currentLevelIndex + 1
      }/${this.levelOrder.length})`,
    );

    this.notifyListeners("levelCompleted", {
      levelId,
      levelIndex: this.currentLevelIndex,
      isLastLevel,
    });

    // Single-level play ("Play Level": END_OF_ANY_LEVEL) always returns to the
    // editor — an end zone's "Next Level" override only applies to pack runs.
    if (this.packCompletionMode === PackCompletionMode.END_OF_ANY_LEVEL) {
      this.endPack();
      return "packComplete";
    }

    const goTo = (index) => {
      // Not applied yet — see loadCurrentLevel / cancelPendingTransition.
      this.pendingTransition = { index, id: this.levelOrder[index] };
      return "nextLevel";
    };

    // Per-endzone override (inspector "Next Level"). Missing/unknown target →
    // warn and fall through to the regular sequencing below.
    const overrideId = endZone?.instVars?.override || "";
    if (overrideId === END_ZONE_EXIT) {
      console.log("[LevelLoader] End zone override → exit pack");
      this.endPack();
      return "packComplete";
    }
    if (overrideId) {
      const idx = this.levelOrder.indexOf(overrideId);
      if (idx !== -1) {
        console.log(`[LevelLoader] End zone override → ${overrideId}`);
        return goTo(idx);
      }
      console.warn(
        `[LevelLoader] End zone points to unknown level "${overrideId}"; using pack order`,
      );
    }

    if (isLastLevel) {
      // Default end zone on the last level: the pack is done.
      this.endPack();
      return "packComplete";
    }
    return goTo(this.currentLevelIndex + 1);
  }

  /**
   * Drop a level change decided by onLevelComplete that hasn't been committed
   * yet (the layout hasn't restarted for it). Called by the game's restart
   * path so restarting during the end-of-level transition replays the level
   * that was just finished instead of loading the next one.
   */
  cancelPendingTransition() {
    if (!this.pendingTransition) return false;
    console.log("[LevelLoader] Pending level change cancelled (restart)");
    this.pendingTransition = null;
    return true;
  }

  /**
   * End the pack and return to the specified destination
   */
  endPack() {
    console.log(
      `[LevelLoader] Pack completed, returning to: ${this.returnDestination}`,
    );

    this.scriptRuntime?.clearPackSave();

    this.notifyListeners("packCompleted", {
      totalLevels: this.levelOrder.length,
      completedLevels: this.currentLevelIndex + 1,
      returnDestination: this.returnDestination,
    });
  }

  /**
   * Load a specific level from the current project
   * @param {string} levelId - ID of the level to load
   * @returns {boolean} Success status
   */
  loadSpecificLevel(levelId) {
    if (!this.isInitialized || !this.loadedProject) {
      console.error("[LevelLoader] No project loaded");
      return false;
    }

    const levelIndex = this.levelOrder.indexOf(levelId);
    if (levelIndex === -1) {
      console.error("[LevelLoader] Level not found in project:", levelId);
      return false;
    }

    this.currentLevelIndex = levelIndex;
    this.currentLevelId = levelId;
    this.restartLevelLayout();
    return true;
  }

  /**
   * Go to next level in the pack
   * @returns {boolean} Success status
   */
  goToNextLevel() {
    if (this.currentLevelIndex >= this.levelOrder.length - 1) {
      console.warn("[LevelLoader] Already on last level");
      return false;
    }

    this.currentLevelIndex++;
    this.restartLevelLayout();
  }

  /**
   * Go to previous level in the pack
   * @returns {boolean} Success status
   */
  goToPreviousLevel() {
    if (this.currentLevelIndex <= 0) {
      console.warn("[LevelLoader] Already on first level");
      return false;
    }

    this.currentLevelIndex--;
    this.restartLevelLayout();
  }

  /**
   * Restart current level
   * @returns {boolean} Success status
   */
  restartLevelLayout() {
    this.loadLayout(this.targetLayout);
  }

  /**
   * Create objects from level data
   * @param {Object} levelData - Level data containing instances
   */
  createLevelObjects(levelData) {
    // Reset the label -> instance map for this level. The script API's
    // level.find(name) / findAll(name) read from here; level.all() reads the
    // full list below.
    this.labelMap = new Map();
    this.allInstances = [];

    // Hub mode: the layout gets an isHubSprite marker, which the game reads as
    // "this is a hub, not a timed level" (no timer/stars, hub transitions,
    // no ghost recording, no fail pity).
    if (levelData.levelData?.isHub) {
      try {
        const hub = this.runtime.objects.isHubSprite.createInstance(
          "environmentHigher",
          0,
          0,
        );
        hub.isVisible = false;
      } catch (error) {
        console.warn("[LevelLoader] Could not create hub marker:", error);
      }
    }

    // Offline level: the noOnlineSprite marker tells the game to keep this
    // level out of online play (defaults to online when unset).
    if (levelData.levelData?.isOnline === false) {
      try {
        const marker = this.runtime.objects.noOnlineSprite.createInstance(
          "environmentHigher",
          0,
          0,
        );
        marker.isVisible = false;
      } catch (error) {
        console.warn("[LevelLoader] Could not create no-online marker:", error);
      }
    }

    if (!levelData.instances || !Array.isArray(levelData.instances)) {
      console.warn("[LevelLoader] No instances data in level");
      return;
    }

    // Labels resolve purely from SERIALIZED level data — no editor state. Each
    // instance carries its label IDs in instanceData.labels; the level's
    // labelDictionary maps ID -> { id, name, color }. This works identically in
    // the editor test-play and the shipped game.
    const dict = levelData.levelData?.labelDictionary || {};

    let labelledInstances = 0;
    for (const instanceData of levelData.instances) {
      try {
        const instance = createInstanceFromData(this.runtime, instanceData);
        if (!instance) continue;
        this.allInstances.push(instance);
        const labelIds = instanceData.labels;
        if (!Array.isArray(labelIds) || labelIds.length === 0) continue;
        labelledInstances++;
        // Labelled objects are script-reachable, hence dynamic: keep them out
        // of the static mesh bake that follows object creation.
        globalThis.staticBake?.excludeInstance(instance);
        const resolved = [];
        for (const labelId of labelIds) {
          const rec = dict[labelId];
          const name = rec?.name;
          if (!name) continue;
          resolved.push({
            id: labelId,
            name,
            vars: normalizeVarDefs(rec.vars),
          });
          let bucket = this.labelMap.get(name);
          if (!bucket) {
            bucket = [];
            this.labelMap.set(name, bucket);
          }
          bucket.push(instance);
        }
        // Label variables: the facade reads obj[labelName][varKey] from here.
        stashLabelData(instance, resolved, instanceData.labelVars);
      } catch (error) {
        console.warn(
          `[LevelLoader] Failed to create instance:`,
          error,
          instanceData,
        );
      }
    }

    console.log(
      `[LevelLoader] Created ${levelData.instances.length} objects; ` +
        `${labelledInstances} carry labels, ${Object.keys(dict).length} labels in dictionary ` +
        `-> ${this.labelMap.size} resolvable label name(s)`,
    );
  }

  /**
   * Compile + run the current level's global script.
   * @param {Object} levelSettings - the level's levelData block
   */
  runLevelScript(levelSettings) {
    if (!this.scriptRuntime) {
      this.scriptRuntime = new ScriptRuntime(this.runtime);
    }
    const ld = levelSettings || {};
    this.scriptRuntime.load(
      ld.script || "",
      this.labelMap,
      {
        name: ld.levelName,
        width: ld.levelSize?.width,
        height: ld.levelSize?.height,
        // Save lifecycle keys: LevelSave clears when levelId changes (level
        // change) but survives a restart (same id); PackSave clears when packId
        // (the loaded project) changes.
        levelId: this.currentLevelId,
        packId: this.loadedProject?.projectId,
      },
      this.allInstances || [],
    );
  }

  /** Tear down the running level script (removes its tick listener). */
  disposeLevelScript() {
    if (this.scriptRuntime) {
      this.scriptRuntime.dispose();
    }
  }

  /**
   * Apply level settings (fog, skybox, etc.)
   * @param {Object} levelSettings - Level settings data
   */
  applyLevelSettings(levelSettings) {
    if (!levelSettings) return;

    // update level Data
    const levelDataInstance = this.runtime.objects.levelData.getFirstInstance();
    const levelDataJson = levelDataInstance.getJsonDataCopy();

    const isHub = !!levelSettings.isHub;
    const curLevelData = {
      name: levelSettings.levelName,
      sky: levelSettings.skyboxType,
    };
    // Hubs are untimed: no star entries at all (the game shows the timer only
    // when a level has a 1Star time and no hub marker).
    if (!isHub) {
      curLevelData["1Star"] = levelSettings?.levelTimes?.star1 ?? 0;
      curLevelData["2Star"] = levelSettings?.levelTimes?.star2 ?? 0;
      curLevelData["3Star"] = levelSettings?.levelTimes?.star3 ?? 0;
      curLevelData["4Star"] = levelSettings?.levelTimes?.star4 ?? 0;
    }
    const playlist = levelSettings.levelPlaylist ?? "auto";
    if (playlist !== "auto") {
      curLevelData.playlist = playlist;
    }

    levelDataJson[this.currentLevelId] = curLevelData;

    levelDataInstance.setJsonDataCopy(levelDataJson);

    try {
      // Apply skybox
      if (levelSettings.skyboxType) {
        this.runtime.callFunction("setSkyboxType", levelSettings.skyboxType);

        if (levelSettings.skyboxType === "desert") {
          const instance = this.runtime.objects.sandDune.createInstance(
            "environmentHigher",
            levelSettings.levelSize.width / 2,
            levelSettings.levelSize.height / 2,
            false,
            "default",
          );
          instance.zElevation = -1000;
        }
      }
      // Apply fog settings
      if (levelSettings.overrideFogColor && levelSettings.fogColor) {
        // Set fog color - this would depend on your rendering system
        const color = hexToRgb(levelSettings.fogColor);
        this.runtime.callFunction("setFogColorRgb", ...color);
      }

      if (levelSettings.overrideSkyTint && levelSettings.skyColor) {
        const color = hexToRgb(levelSettings.skyColor);
        this.runtime.callFunction("setSkyColorRgb", ...color);
      }

      if (
        levelSettings.overrideFogDensity &&
        levelSettings.fogDensity !== undefined
      ) {
        // Set fog density
        this.runtime.callFunction("setFogDensity", levelSettings.fogDensity);
      }
    } catch (error) {
      console.warn("[LevelLoader] Failed to apply level settings:", error);
    }
  }

  /**
   * Load a specific layout
   * @param {string} layoutName - Name of the layout to load
   */
  loadLayout(layoutName) {
    try {
      this.runtime.goToLayout(layoutName);
      console.log(`[LevelLoader] Loaded layout: ${layoutName}`);
    } catch (error) {
      console.error(
        `[LevelLoader] Failed to load layout ${layoutName}:`,
        error,
      );
    }
  }

  /**
   * Validate project structure
   * @param {Object} projectData - Project data to validate
   * @returns {boolean} Is valid
   */
  validateProjectStructure(projectData) {
    if (!projectData || typeof projectData !== "object") {
      return false;
    }

    const required = ["version", "projectName", "levels"];
    for (const prop of required) {
      if (!(prop in projectData)) {
        console.warn(`[LevelLoader] Missing required property: ${prop}`);
        return false;
      }
    }

    if (!projectData.levels || typeof projectData.levels !== "object") {
      console.warn("[LevelLoader] Invalid levels object");
      return false;
    }

    // Check that we have at least one level
    if (Object.keys(projectData.levels).length === 0) {
      console.warn("[LevelLoader] Project has no levels");
      return false;
    }

    return true;
  }

  /**
   * Get current level information
   * @returns {Object|null} Current level info
   */
  getCurrentLevelInfo() {
    if (!this.isInitialized || !this.loadedProject || !this.currentLevelId) {
      return null;
    }

    const levelData = this.loadedProject.levels[this.currentLevelId];

    return {
      levelId: this.currentLevelId,
      levelName: levelData?.levelData?.levelName || "Unknown",
      levelIndex: this.currentLevelIndex,
      totalLevels: this.levelOrder.length,
      isLastLevel: this.currentLevelIndex >= this.levelOrder.length - 1,
      isFirstLevel: this.currentLevelIndex === 0,
    };
  }

  /**
   * Get pack information
   * @returns {Object|null} Pack information
   */
  getPackInfo() {
    if (!this.isInitialized || !this.loadedProject) {
      return null;
    }

    return {
      projectName: this.loadedProject.projectName,
      totalLevels: this.levelOrder.length,
      currentLevelIndex: this.currentLevelIndex,
      currentLevelId: this.currentLevelId,
      packCompletionMode: this.packCompletionMode,
      returnDestination: this.returnDestination,
      targetLayout: this.targetLayout,
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
            `[LevelLoader] Error in event listener for ${event}:`,
            error,
          );
        }
      });
    }
  }

  /**
   * Set temporary data for editor-to-play transfer (localStorage-like interface)
   * @param {string} key - The key to store data under
   * @param {*} data - Data to store temporarily
   */
  setTempData(key, data) {
    if (typeof key !== "string") {
      console.warn("[LevelLoader] Temp data key must be a string");
      return;
    }

    const dataWithTimestamp = {
      value: data,
      timestamp: Date.now(),
    };

    this.tempDataStorage.set(key, dataWithTimestamp);
    console.log(`[LevelLoader] Stored temp data for key: ${key}`);
  }

  /**
   * Get temporary data for editor-to-play transfer (localStorage-like interface)
   * @param {string} key - The key to retrieve data for
   * @returns {*} Stored data or null if not found
   */
  getTempData(key) {
    if (typeof key !== "string") {
      console.warn("[LevelLoader] Temp data key must be a string");
      return null;
    }

    const stored = this.tempDataStorage.get(key);
    return stored ? stored.value : null;
  }

  /**
   * Remove temporary data for a specific key
   * @param {string} key - The key to remove
   * @returns {boolean} True if key existed and was removed
   */
  removeTempData(key) {
    if (typeof key !== "string") {
      console.warn("[LevelLoader] Temp data key must be a string");
      return false;
    }

    const existed = this.tempDataStorage.has(key);
    if (existed) {
      this.tempDataStorage.delete(key);
      console.log(`[LevelLoader] Removed temp data for key: ${key}`);
    }
    return existed;
  }

  /**
   * Get all temporary data keys
   * @returns {string[]} Array of all keys in temp storage
   */
  getTempDataKeys() {
    return Array.from(this.tempDataStorage.keys());
  }

  /**
   * Clear all temporary data storage
   */
  clearTempData() {
    this.tempDataStorage.clear();
  }

  unloadProject() {
    if (!this.isInitialized || !this.loadedProject) {
      return;
    }

    // Notify listeners about project unload
    this.notifyListeners("beforeunload", { projectId: this.loadedProject.id });

    // Stop any running level script before clearing project state.
    this.disposeLevelScript();
    this.labelMap = new Map();

    // Clean up loaded project
    setCustomMaterialsRegistry(null);
    this.loadedProject = null;
    this.currentLevelId = null;
    this.currentLevelIndex = 0;
    this.levelOrder = [];
    this.returnDestination = null;
    this.targetLayout = null;
    this.packCompletionMode = PackCompletionMode.END_OF_LAST_LEVEL;
    this.startCheckpointId = null;
    this.startCheckpointLevelId = null;
    this.recordGhosts = true;
    this.listeners.clear();
    this.isInitialized = false;

    console.log("[LevelLoader] Unloaded project");
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.disposeLevelScript();
    this.scriptRuntime = null;
    this.labelMap = new Map();
    this.loadedProject = null;
    this.currentLevelId = null;
    this.currentLevelIndex = 0;
    this.levelOrder = [];
    this.returnDestination = null;
    this.targetLayout = null;
    this.packCompletionMode = PackCompletionMode.END_OF_LAST_LEVEL;
    this.startCheckpointId = null;
    this.startCheckpointLevelId = null;
    this.recordGhosts = true;
    this.listeners.clear();
    this.isInitialized = false;

    console.log("[LevelLoader] Destroyed");
  }
}

// Singleton instance
let levelLoaderInstance = null;

/**
 * Get or create the singleton level loader instance
 * @returns {LevelLoader} The level loader instance
 */
export function getLevelLoader(runtime) {
  if (!levelLoaderInstance) {
    levelLoaderInstance = new LevelLoader(runtime);
  }
  return levelLoaderInstance;
}

/**
 * Initialize level loader and make it globally accessible
 * @returns {LevelLoader} The level loader instance
 */
export function initializeLevelLoader(runtime) {
  const loader = getLevelLoader(runtime);
  return loader;
}

/**
 * Destroy the level loader instance
 */
export function destroyLevelLoader() {
  if (levelLoaderInstance) {
    levelLoaderInstance.destroy();
    levelLoaderInstance = null;
  }
}

/**
 * Store temporary data for editor-to-play transfer
 * @param {string} key - The key to store data under
 * @param {*} data - Data to store temporarily
 * @returns {boolean} Success status
 */
export function setTempData(key, data) {
  const loader = getLevelLoader();
  if (loader) {
    loader.setTempData(key, data);
    return true;
  }
  return false;
}

/**
 * Get temporary data for editor-to-play transfer
 * @param {string} key - The key to retrieve data for
 * @returns {*} Stored data or null if not found
 */
export function getTempData(key) {
  const loader = getLevelLoader();
  return loader ? loader.getTempData(key) : null;
}

/**
 * Remove temporary data for a specific key
 * @param {string} key - The key to remove
 * @returns {boolean} True if key existed and was removed
 */
export function removeTempData(key) {
  const loader = getLevelLoader();
  return loader ? loader.removeTempData(key) : false;
}

/**
 * Get all temporary data keys
 * @returns {string[]} Array of all keys in temp storage
 */
export function getTempDataKeys() {
  const loader = getLevelLoader();
  return loader ? loader.getTempDataKeys() : [];
}

/**
 * Clear temporary data storage
 * @returns {boolean} Success status
 */
export function clearTempData() {
  const loader = getLevelLoader();
  if (loader) {
    loader.clearTempData();
    return true;
  }
  return false;
}
