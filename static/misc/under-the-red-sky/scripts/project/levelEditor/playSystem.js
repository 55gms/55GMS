import { PackCompletionMode } from "./levelLoader/levelLoader.js";
import { validateAllLevels } from "./validation/projectValidator.js";

/**
 * Play modes for the level editor
 */
export const PlayMode = {
  PLAY_LEVEL: "play", // Play current level only
  PLAY_PROJECT_HERE: "play-project-here", // Play project starting from current level
  PLAY_PROJECT_START: "play-project-start", // Play project from first level
  // Play current level only, spawning at the editor camera position (via a
  // temporary hidden checkpoint injected into the play copy of the level).
  PLAY_FROM_CAMERA: "play-from-camera",
};

const PLAY_MODE_VALUES = new Set(Object.values(PlayMode));

// Single-level modes: validate/play only the current level, end at any end zone.
const SINGLE_LEVEL_MODES = new Set([
  PlayMode.PLAY_LEVEL,
  PlayMode.PLAY_FROM_CAMERA,
]);

/**
 * Play System class
 * Handles play tools interaction, validation, and project persistence
 */
export class PlaySystem {
  constructor() {
    // No longer using localStorage for project persistence
  }

  /**
   * Initialize the play system
   * @param {Object} options - Configuration options
   */
  init(options = {}) {
    // Try to restore last opened project
    this.tryRestoreLastProject();
  }

  /**
   * Handle play action from toolbar
   * @param {string} playMode - The play mode (PlayMode enum)
   * @returns {boolean} Success status
   */
  async handlePlay(playMode) {
    console.log(`[PlaySystem] Handling play action: ${playMode}`);

    // Check if we have a project loaded
    const projectManager = globalThis._editorScope?.projectManager;
    if (!projectManager || !projectManager.hasProjectLoaded()) {
      console.error("[PlaySystem] No project loaded");
      this.showError(
        "No project is currently loaded. Please create or open a project first.",
      );
      return false;
    }

    // Remember the mode per project (persisted by the save below) and make it
    // the split button's fast-access action.
    this.setPreferredPlayMode(playMode);

    // Validate the level first
    if (!this.validateLevel(playMode)) {
      // Validation failed, dialog will be shown automatically
      return false;
    }

    // Save project before playing
    if (!(await this.saveProject())) {
      console.error("[PlaySystem] Failed to save project before playing");
      this.showError(
        "Failed to save project before playing. Please try saving manually first.",
      );
      return false;
    }

    // Start playing based on mode
    return this.startPlay(playMode);
  }

  /**
   * Last-used play mode for the loaded project (stored in the project's
   * editorUI state). Defaults to PLAY_LEVEL.
   * @returns {string} A PlayMode value
   */
  getPreferredPlayMode() {
    const projectManager = globalThis._editorScope?.projectManager;
    const mode = projectManager?.getEditorUIState?.("play")?.lastMode;
    return PLAY_MODE_VALUES.has(mode) ? mode : PlayMode.PLAY_LEVEL;
  }

  setPreferredPlayMode(playMode) {
    if (!PLAY_MODE_VALUES.has(playMode)) return;
    const projectManager = globalThis._editorScope?.projectManager;
    if (projectManager?.getEditorUIState?.("play")?.lastMode !== playMode) {
      projectManager?.updateEditorUIState?.("play", { lastMode: playMode });
    }
    globalThis._editorScope?.toolbar?.setSplitMainTool?.("playSplit", playMode);
  }

  /**
   * Validate the current level for issues
   * @returns {boolean} True if level is valid, false if there are issues
   */
  validateLevel(playMode) {
    const validator = globalThis._editorScope?.levelValidator;
    if (!validator) {
      console.warn(
        "[PlaySystem] No level validator available, skipping validation",
      );
      return true; // Allow play if no validator
    }

    const validationDialog = globalThis._editorScope.validationDialog;

    if (SINGLE_LEVEL_MODES.has(playMode)) {
      // Single-level play: validate only the current level.
      const errors = validator.validate();
      if (errors.length > 0) {
        console.log(
          "[PlaySystem] Level validation failed, showing issues dialog",
        );
        if (validationDialog) validationDialog.show();
        return false;
      }
      return true;
    }

    const projectResult = validateAllLevels();
    if (projectResult.levelsWithErrors.length > 0) {
      console.log(
        `[PlaySystem] Project validation failed: ${projectResult.levelsWithErrors.length} level(s) with errors`,
      );
      // Open the issues tracker focused on the first level that has errors.
      if (validationDialog) {
        validationDialog.show(projectResult.levelsWithErrors[0], projectResult);
      }
      return false;
    }
    return true;
  }

  /**
   * Save the current project
   * @returns {Promise<boolean>} Success status
   */
  async saveProject() {
    const projectManager = globalThis._editorScope?.projectManager;
    if (!projectManager) {
      return false;
    }

    // Save current level state
    projectManager.saveCurrentLevelState();
    await projectManager.saveProjectToFile(false); // false = don't force "Save As"

    return true;
  }

  /**
   * Start playing the level/project
   * @param {string} playMode - The play mode
   * @returns {boolean} Success status
   */
  startPlay(playMode) {
    try {
      // Get the level loader
      const levelLoader = globalThis.levelLoader;
      if (!levelLoader) {
        console.error("[PlaySystem] Level loader not available");
        this.showError(
          "Level loader system not available. Cannot start play mode.",
        );
        return false;
      }

      const projectManager = globalThis._editorScope?.projectManager;
      // NOTE: exportProject(false) returns the LIVE project object.
      let projectData = projectManager.exportProject(false);
      let startCheckpointId = null;

      if (playMode === PlayMode.PLAY_FROM_CAMERA) {
        // Play a throwaway copy with a hidden 0x0 checkpoint at the camera;
        // the editor's project (and the saved file) never see it.
        projectData = structuredClone(projectData);
        startCheckpointId = this.injectCameraCheckpoint(
          projectData.levels[projectData.currentLevelId],
        );
        if (!startCheckpointId) {
          this.showError("Could not read the editor camera position.");
          return false;
        }
      }

      // Load project into level loader
      levelLoader
        .loadProject(projectData)
        .then((success) => {
          if (!success) {
            this.showError("Failed to load project for playing");
            return;
          }

          // Configure based on play mode
          const config = this.getPlayConfiguration(playMode, projectData);
          if (startCheckpointId) {
            config.startCheckpointId = startCheckpointId;
            config.recordGhosts = false;
          }

          if (!levelLoader.configure(config)) {
            this.showError("Failed to configure play session");
            return;
          }

          // Store the project path for persistence (after configure: the
          // payload records the session's recordGhosts flag).
          this.storeLastOpenedProject();

          // Start playing
          levelLoader.start();

          console.log(`[PlaySystem] Started playing in mode: ${playMode}`);
        })
        .catch((error) => {
          console.error("[PlaySystem] Error starting play:", error);
          this.showError("Error starting play mode: " + error.message);
        });

      return true;
    } catch (error) {
      console.error("[PlaySystem] Error in startPlay:", error);
      this.showError("Unexpected error starting play mode");
      return false;
    }
  }

  /**
   * Get play configuration based on play mode
   * @param {string} playMode - The play mode
   * @param {Object} projectData - Project data
   * @returns {Object} Configuration for level loader
   */
  getPlayConfiguration(playMode, projectData) {
    switch (playMode) {
      case PlayMode.PLAY_LEVEL:
      case PlayMode.PLAY_FROM_CAMERA:
        return {
          startLevelId: projectData.currentLevelId,
          returnDestination: "levelEditor",
          targetLayout: "levelEditorPreview",
          packCompletionMode:
            PackCompletionMode?.END_OF_ANY_LEVEL || "end_of_any_level",
        };

      case PlayMode.PLAY_PROJECT_HERE:
        return {
          startLevelId: projectData.currentLevelId,
          returnDestination: "levelEditor",
          targetLayout: "levelEditorPreview",
          packCompletionMode:
            PackCompletionMode?.END_OF_LAST_LEVEL || "end_of_last_level",
        };

      case PlayMode.PLAY_PROJECT_START:
        // Find first level in the project
        const levelIds = Object.keys(projectData.levels);
        const firstLevelId =
          levelIds.length > 0 ? levelIds[0] : projectData.currentLevelId;

        return {
          startLevelId: firstLevelId,
          returnDestination: "levelEditor",
          targetLayout: "levelEditorPreview",
          packCompletionMode:
            PackCompletionMode?.END_OF_LAST_LEVEL || "end_of_last_level",
        };

      default:
        console.warn(`[PlaySystem] Unknown play mode: ${playMode}`);
        return this.getPlayConfiguration(PlayMode.PLAY_LEVEL, projectData);
    }
  }

  /**
   * Append a hidden 0x0 checkpoint at the editor camera to a level's instance
   * list (play-copy only) and return its fresh, unused checkpoint id.
   * @param {Object} level - a project level entry ({ instances, levelData, … })
   * @returns {string|null} the checkpoint id, or null if the camera is unavailable
   */
  injectCameraCheckpoint(level) {
    const cameraController = globalThis._editorScope?.cameraController;
    const transform = cameraController?.getCameraTransform?.();
    if (!level || !transform?.position) return null;

    const [x, y, z] = transform.position;
    // Face the camera's look direction (Z-up: yaw = atan2(dy, dx), like C3 angles).
    const [tx, ty] = transform.target || [x + 1, y];
    const yaw = (Math.atan2(ty - y, tx - x) * 180) / Math.PI;

    if (!Array.isArray(level.instances)) level.instances = [];
    const usedIds = new Set(
      level.instances
        .filter((i) => i.objectType === "checkpoint")
        .map((i) => String(i.properties?.checkpointID?.value ?? "")),
    );
    let id;
    do {
      id = `cam-${Math.random().toString(36).slice(2, 8)}`;
    } while (usedIds.has(id));

    // Same shape as StateManager.exportInstanceState → createInstanceFromData.
    level.instances.push({
      objectType: "checkpoint",
      properties: {
        position: { key: "position", type: "position", value: { x, y, z } },
        size3D: { key: "size3D", type: "scale3d", value: { x: 0, y: 0, z: 0 } },
        angle: { key: "angle", type: "angle1d", value: yaw },
        isVisible: { key: "isVisible", type: "checkbox", value: false },
        checkpointID: { key: "checkpointID", type: "text", value: id },
      },
    });
    return id;
  }

  /**
   * Store the last opened project for persistence
   */
  storeLastOpenedProject() {
    const projectManager = globalThis._editorScope?.projectManager;
    const stateManager = globalThis._editorScope?.stateManager;
    const levelLoader = globalThis.levelLoader;

    if (!projectManager || !levelLoader) return;

    try {
      const fileHandle = projectManager.getCurrentFileHandle();
      const projectInfo = projectManager.getProjectInfo();
      const projectId = projectManager.getCurrentProjectId();

      if (fileHandle && projectInfo && projectId) {
        const projectData = {
          projectId: projectId,
          projectName: projectInfo.projectName, // Keep name as fallback
          hasFileHandle: true,
          timestamp: Date.now(),
          // false → on return, drop any ghost runs this session recorded.
          recordGhosts: levelLoader.recordGhosts !== false,
        };

        // Store project data
        levelLoader.setTempData("lastProject", projectData);

        console.log(
          "[PlaySystem] Stored project data in temp storage with ID:",
          projectId,
        );
      }
    } catch (error) {
      console.warn("[PlaySystem] Could not store project data:", error);
    }
  }

  /**
   * Try to restore the last opened project on level editor startup
   */
  tryRestoreLastProject() {
    // Only try restore if no project is currently loaded
    const projectManager = globalThis._editorScope?.projectManager;
    const stateManager = globalThis._editorScope?.stateManager;
    const levelLoader = globalThis.levelLoader;

    if (!projectManager || projectManager.hasProjectLoaded() || !levelLoader) {
      return;
    }

    try {
      const projectData = levelLoader.getTempData("lastProject");
      if (!projectData) {
        console.log("[PlaySystem] No temp project data found");
        return;
      }

      // Use project ID if available, fallback to project name for backwards compatibility
      const identifier = projectData.projectId || projectData.projectName;
      const useId = !!projectData.projectId;

      console.log(
        `[PlaySystem] Found recent project: ${projectData.projectName} (${
          useId ? "ID: " + identifier : "Name: " + identifier
        })`,
      );

      // Try to restore from recent projects
      const restored = this.tryRestoreFromRecentProjects(identifier, useId);

      if (restored) {
        if (projectData.recordGhosts === false) {
          // Play-from-camera run: discard the recorded ghost(s) instead of
          // importing them. Runs are stored in temp data keyed by level id.
          this.discardTempGhostRuns();
        } else {
          const ghostPathManager =
            globalThis._editorScope?.ghostPathSystem?.manager;
          if (ghostPathManager) {
            // Allow loading from temp data since we're returning from play
            ghostPathManager.allowLoadingFromTempData();
          }
        }
      }
      // Clear temp data after use
      levelLoader.removeTempData("lastProject");
      levelLoader.removeTempData("undoRedoState");
    } catch (error) {
      console.warn("[PlaySystem] Error trying to restore last project:", error);
      // Clear invalid data
      if (levelLoader) {
        levelLoader.removeTempData("lastProject");
        levelLoader.removeTempData("undoRedoState");
      }
    }
  }

  /**
   * Remove every per-level ghost run the game left in temp data. The editor
   * project is still being (re)opened asynchronously here, so level ids come
   * from the loader's copy of the project that was just played.
   */
  discardTempGhostRuns() {
    const levelLoader = globalThis.levelLoader;
    if (!levelLoader?.getTempDataKeys) return;
    const levels =
      levelLoader.loadedProject?.levels ||
      globalThis._editorScope?.projectManager?.currentProject?.levels ||
      {};
    for (const key of levelLoader.getTempDataKeys()) {
      if (levels[key]) levelLoader.removeTempData(key);
    }
  }

  /**
   * Try to restore project from recent projects list
   * @param {string} identifier - Project ID or name to restore
   * @param {boolean} useId - Whether to search by ID (true) or name (false)
   * @returns {boolean} True if project was found and restored
   */
  tryRestoreFromRecentProjects(identifier, useId = true) {
    const welcomeDialog = globalThis._editorScope?.welcomeDialog;
    if (!welcomeDialog) return false;

    // Get recent projects
    const recentProjects = welcomeDialog.getRecentProjects();

    // Find matching project by ID or name
    const matchingProject = recentProjects.find((project) => {
      if (useId) {
        return project.id === identifier;
      } else {
        return project.name === identifier;
      }
    });

    if (matchingProject) {
      console.log(
        `[PlaySystem] Found matching project by ${
          useId ? "ID" : "name"
        }: ${identifier}`,
      );

      // Load the project using the welcome dialog's method
      welcomeDialog.handleOpenRecentProject(matchingProject);
      return true;
    } else {
      console.log(
        `[PlaySystem] Could not find matching project in recent projects (${
          useId ? "ID" : "name"
        }: ${identifier})`,
      );
      return false;
    }
  }

  /**
   * Show error message to user
   * @param {string} message - Error message to display
   */
  showError(message) {
    console.error(`[PlaySystem] ${message}`);

    // Use the notification system if available
    const notifications = globalThis._editorScope?.notifications;
    if (notifications) {
      notifications.error(message, { title: "Play Error" });
    }
  }

  /**
   * Clean up resources
   */
  destroy() {}
}

// Singleton instance
let playSystemInstance = null;

/**
 * Initialize the play system
 * @returns {PlaySystem} The play system instance
 */
export function initializePlaySystem() {
  if (!playSystemInstance) {
    playSystemInstance = new PlaySystem();
    // Initialize
    playSystemInstance.init();
  }
  return playSystemInstance;
}

/**
 * Get the play system instance
 * @returns {PlaySystem|null} The play system instance
 */
export function getPlaySystem() {
  return playSystemInstance;
}

/**
 * Destroy the play system
 */
export function destroyPlaySystem() {
  if (playSystemInstance) {
    playSystemInstance.destroy();
    playSystemInstance = null;
  }
}
