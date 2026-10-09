// Project Manager for Level Editor
// Handles project state, multiple levels, and shared data

import { Theme } from "./inspectorUI.js";
import {
  createEmptyLevel,
  createLevelFromExisting,
  createLevelFromTemplate,
  PROJECT_DIFFICULTIES,
  PROJECT_PLAYLISTS,
} from "./defaultLevelData.js";
import { PROJECT_VERSION, LEVEL_PROJECT_EXTENSION } from "./globalValues.js";
import { tagPlaceableObjectTypes } from "./objectTypeDefinitions.js";

// Default project structure
const DEFAULT_PROJECT_DATA = {
  version: PROJECT_VERSION,
  projectId: null, // Will be set when project is created/loaded
  projectName: "Untitled Project",
  currentLevelId: null,
  levels: {},
  // Template sources for new levels: one level id per slot (or null). Both
  // slots may point at the same level.
  template: { settingsLevelId: null, objectsLevelId: null },
  sharedData: {
    customStructures: [],
    // Custom materials, keyed by id (shape mirrors the built-in `materials`).
    customMaterials: {},
    recentColors: [],
    // IDs of presets in the inventory bar, in slot order
    inventorySlots: [],
    // Project-level settings
    projectDifficulty: PROJECT_DIFFICULTIES[0].key, // Default to "Very Easy"
    projectPlaylist: PROJECT_PLAYLISTS[0].key, // Default to "Default"
  },
  workshop: {
    itemId: null, // Steam Workshop item ID
    description: "",
    previewImage: null, // Base64 encoded image
    visibility: 0, // 0=Public, 1=FriendsOnly, 2=Private, 3=Unlisted
  },
  // Editor-only UI state persisted alongside the project. This is NOT per-level
  // and NOT used by the runtime game; it only affects the level editor chrome.
  // Consumers should defensively default when fields are missing so older
  // project files continue to load.
  editorUI: {
    hierarchyPanel: {
      minimized: true, // First-run default: collapsed to a small toggle button.
    },
  },
  metaData: {
    created: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  },
};

export class ProjectManager {
  constructor() {
    this.currentProject = null;
    this.isProjectLoaded = false;
    this.listeners = new Map(); // Event listeners for project changes
    this.currentFileHandle = null; // File System API handle for current project file
    this.hasUnsavedChanges = false; // Track unsaved changes
    this.lastSavedState = null; // JSON string of last saved state

    this.init();
  }

  init() {
    // Initialize with no project loaded
    this.currentProject = null;
    this.isProjectLoaded = false;
  }

  /**
   * Create a new project with default settings
   * @param {string} projectName - Name of the new project
   * @param {string} firstLevelName - Name of the first level
   * @returns {Object} The created project data
   */
  createNewProject(
    projectName = "Untitled Project",
    firstLevelName = "Main Level",
  ) {
    const projectData = {
      ...DEFAULT_PROJECT_DATA,
      projectId: this.generateProjectId(projectName),
      projectName,
      // Deep-clone editorUI so new projects don't share the same reference as
      // DEFAULT_PROJECT_DATA (which would leak UI state between projects
      // created in the same session).
      editorUI: JSON.parse(JSON.stringify(DEFAULT_PROJECT_DATA.editorUI)),
      template: { settingsLevelId: null, objectsLevelId: null },
      metaData: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
    };

    globalThis._editorScope?.cameraController.resetCamera();

    // Create the first level
    const firstLevelId = this.generateLevelId();
    const firstLevel = this.createEmptyLevel(firstLevelName);

    projectData.levels[firstLevelId] = firstLevel;

    // Note: Project data is now the primary storage, no migration needed

    this.currentProject = projectData;
    this.isProjectLoaded = true;
    this.switchToLevel(firstLevelId);

    this.updateLastModified();
    this.markAsUnsaved();

    // Clear undo/redo history and initialize with current state
    const stateManager = globalThis._editorScope?.stateManager;
    if (stateManager) {
      stateManager.clearUndoRedoHistory();
      stateManager.pushUndoState("Project created");
    }

    // Note: Not adding to recent projects until project is saved with a file handle

    this.notifyListeners("projectCreated", projectData);
    this.notifyListeners("projectChanged", projectData);

    console.log(`[ProjectManager] Created new project: ${projectName}`);

    globalThis._editorScope?.cameraController.setTarget(
      projectData.levels[firstLevelId].levelData.levelSize.width / 2,
      projectData.levels[firstLevelId].levelData.levelSize.height / 2,
      0,
    );
    globalThis._editorScope?.cameraController.initCamera();
    return projectData;
  }

  /**
   * Create an empty level with default settings
   * @param {string} levelName - Name of the level
   * @returns {Object} The level data
   */
  createEmptyLevel(levelName = "Untitled Level") {
    // Use the standardized empty level creation
    const level = createEmptyLevel(levelName);

    // Add cameraTransform to metaData for compatibility
    level.metaData.cameraTransform = {};

    return level;
  }

  /**
   * Create a new level by copying an existing level's data
   * @param {string} existingLevelId - ID of the level to copy from
   * @param {string} newLevelName - Name for the new level
   * @returns {string|null} The ID of the created level, or null if failed
   */
  createLevelFromExisting(existingLevelId, newLevelName = "Copy of Level") {
    if (!this.isProjectLoaded) {
      console.warn("[ProjectManager] No project loaded");
      return null;
    }

    const existingLevel = this.currentProject.levels[existingLevelId];
    if (!existingLevel) {
      console.warn(
        "[ProjectManager] Existing level not found:",
        existingLevelId,
      );
      return null;
    }

    // Copying the level being edited: flush the live editor state into the
    // project first so the copy reflects unsaved edits.
    if (existingLevelId === this.currentProject.currentLevelId) {
      this.saveCurrentLevelState();
    }

    // Create new level with copied data
    const newLevel = createLevelFromExisting(existingLevel, newLevelName);

    const levelId = this.generateLevelId();
    this.currentProject.levels[levelId] = newLevel;

    this.updateLastModified();
    this.markAsUnsaved();

    this.notifyListeners("levelAdded", { levelId, levelData: newLevel });
    this.notifyListeners("projectChanged", this.currentProject);

    console.log(
      `[ProjectManager] Created level from existing: ${newLevelName} (ID: ${levelId})`,
    );
    return levelId;
  }

  // ---- Template slots ----------------------------------------------------

  /** @returns {{settingsLevelId: string|null, objectsLevelId: string|null}} */
  getTemplate() {
    if (!this.currentProject) {
      return { settingsLevelId: null, objectsLevelId: null };
    }
    if (!this.currentProject.template) {
      this.currentProject.template = { settingsLevelId: null, objectsLevelId: null };
    }
    return this.currentProject.template;
  }

  /** Which template slots a level holds. */
  getLevelTemplateRoles(levelId) {
    const t = this.getTemplate();
    return {
      settings: !!levelId && t.settingsLevelId === levelId,
      objects: !!levelId && t.objectsLevelId === levelId,
    };
  }

  /**
   * Point a template slot at a level (or clear it with null). Each slot holds
   * one level; assigning moves the slot away from its previous holder.
   * @param {"settings"|"objects"} slot
   * @param {string|null} levelId
   * @returns {string|null} the previous holder's id
   */
  setTemplateSlot(slot, levelId) {
    if (!this.isProjectLoaded) return null;
    const key = slot === "objects" ? "objectsLevelId" : "settingsLevelId";
    if (levelId && !this.currentProject.levels[levelId]) return null;
    const template = this.getTemplate();
    const previous = template[key];
    if (previous === (levelId || null)) return previous;
    template[key] = levelId || null;
    this.updateLastModified();
    this.markAsUnsaved();
    this.notifyListeners("templateChanged", { slot, levelId, previous });
    this.notifyListeners("projectChanged", this.currentProject);
    return previous;
  }

  /**
   * Duplicate a level ("<name> (copy)").
   * @param {string} levelId - ID of the level to duplicate
   * @returns {string|null} The ID of the created level, or null if failed
   */
  duplicateLevel(levelId) {
    const level = this.currentProject?.levels?.[levelId];
    if (!level) return null;
    const baseName = level.levelData?.levelName || level.name || "Level";
    return this.createLevelFromExisting(levelId, `${baseName} (copy)`);
  }

  /**
   * Add a new level to the current project
   * @param {string} levelName - Name of the new level
   * @returns {string|null} The new level ID or null if no project loaded
   */
  addLevel(levelName = "New Level") {
    if (!this.isProjectLoaded) {
      console.warn("[ProjectManager] Cannot add level: No project loaded");
      return null;
    }

    // Keep the sources current if one of them is the level being edited.
    this.saveCurrentLevelState();

    const levelId = this.generateLevelId();
    const template = this.getTemplate();
    const levelData = createLevelFromTemplate(levelName, {
      settingsSource: this.currentProject.levels[template.settingsLevelId] || null,
      objectsSource: this.currentProject.levels[template.objectsLevelId] || null,
    });

    this.currentProject.levels[levelId] = levelData;
    this.updateLastModified();
    this.markAsUnsaved();

    this.notifyListeners("levelAdded", { levelId, levelData });
    this.notifyListeners("projectChanged", this.currentProject);

    console.log(
      `[ProjectManager] Added new level: ${levelName} (ID: ${levelId})`,
    );
    return levelId;
  }

  /**
   * Switch to a different level in the current project
   * @param {string} levelId - ID of the level to switch to
   * @returns {boolean} Success status
   */
  switchToLevel(levelId) {
    if (!this.isProjectLoaded) {
      console.warn("[ProjectManager] Cannot switch level: No project loaded");
      return false;
    }

    if (!this.currentProject.levels[levelId]) {
      console.warn(`[ProjectManager] Level not found: ${levelId}`);
      return false;
    }

    // Save current level state before switching
    if (this.currentProject.currentLevelId) {
      this.saveCurrentLevelState();
    }

    // Switch to new level
    this.currentProject.currentLevelId = levelId;
    this.updateLastModified();
    this.markAsUnsaved();

    // Load the new level
    this.loadLevelState(levelId);

    this.notifyListeners("levelSwitched", {
      levelId,
      levelData: this.currentProject.levels[levelId],
    });
    this.notifyListeners("projectChanged", this.currentProject);

    console.log(
      `[ProjectManager] Switched to level: ${this.currentProject.levels[levelId]?.levelData.levelName} (ID: ${levelId})`,
    );
    return true;
  }

  /**
   * Save the current level state from the editor
   */
  saveCurrentLevelState() {
    if (!this.isProjectLoaded || !this.currentProject.currentLevelId) {
      return;
    }

    const levelId = this.currentProject.currentLevelId;
    const currentLevel = this.currentProject.levels[levelId];

    if (!currentLevel) {
      return;
    }

    // Export current state from state manager
    const stateManager = globalThis._editorScope?.stateManager;
    if (stateManager) {
      const currentState = stateManager.exportState();
      currentLevel.instances = currentState.instances || [];
      currentLevel.metaData = currentState.metaData || {};
    }

    // Export current level settings
    const levelSettings = globalThis._editorScope?.levelSettings;
    if (levelSettings) {
      currentLevel.levelData = levelSettings.getLevelData();
    }

    currentLevel.metaData.lastModified = new Date().toISOString();
    this.updateLastModified();

    console.log(
      `[ProjectManager] Saved state for level: ${currentLevel.levelData.levelName}`,
    );
  }

  /**
   * Load a level state into the editor
   * @param {string} levelId - ID of the level to load
   */
  loadLevelState(levelId) {
    const level = this.currentProject.levels[levelId];
    if (!level) {
      console.warn(`[ProjectManager] Cannot load level: ${levelId} not found`);
      return;
    }

    const stateManager = globalThis._editorScope?.stateManager;
    const levelSettings = globalThis._editorScope?.levelSettings;

    // Load level data into levelSettings
    if (levelSettings) {
      levelSettings.setLevelData(level.levelData);
    }

    // Load instances into state manager (destructive load)
    if (stateManager) {
      const stateData = {
        version: PROJECT_VERSION,
        instances: level.instances || [],
        levelData: level.levelData,
        metaData: level.metaData || {},
      };

      stateManager.loadFromState(stateData, {
        destructive: true,
        recordUndo: false, // Don't record undo for level switches
      });

      // Clear undo/redo history and initialize with current state
      stateManager.clearUndoRedoHistory();
      stateManager.pushUndoState("Level loaded");
    }

    console.log(
      `[ProjectManager] Loaded level state: ${level.levelData.levelName}`,
    );
  }

  /**
   * Get the current level data
   * @returns {Object|null} Current level data or null
   */
  getCurrentLevel() {
    if (!this.isProjectLoaded || !this.currentProject.currentLevelId) {
      return null;
    }

    return this.currentProject.levels[this.currentProject.currentLevelId];
  }

  /**
   * Get all levels in the current project
   * @returns {Object} Object with level IDs as keys and level data as values
   */
  getAllLevels() {
    if (!this.isProjectLoaded) {
      return {};
    }

    return this.currentProject.levels;
  }

  /**
   * Rename a level
   * @param {string} levelId - ID of the level to rename
   * @param {string} newName - New name for the level
   * @returns {boolean} Success status
   */
  renameLevel(levelId, newName) {
    if (!this.isProjectLoaded || !this.currentProject.levels[levelId]) {
      return false;
    }

    this.currentProject.levels[levelId].levelData.levelName = newName;
    if (this.currentProject.currentLevelId === levelId) {
      const levelSettings = globalThis._editorScope?.levelSettings;
      if (levelSettings) {
        levelSettings.updateLevelData("levelName", newName);
      }
    }
    this.updateLastModified();
    this.markAsUnsaved();

    this.notifyListeners("levelRenamed", { levelId, newName });
    this.notifyListeners("projectChanged", this.currentProject);

    return true;
  }

  /**
   * Delete a level from the project
   * @param {string} levelId - ID of the level to delete
   * @returns {boolean} Success status
   */
  deleteLevel(levelId) {
    if (!this.isProjectLoaded || !this.currentProject.levels[levelId]) {
      return false;
    }

    // Prevent deleting the last level
    const levelIds = Object.keys(this.currentProject.levels);
    if (levelIds.length <= 1) {
      console.warn(
        "[ProjectManager] Cannot delete the last level in the project",
      );
      return false;
    }

    delete this.currentProject.levels[levelId];

    // A deleted level can't stay a template source.
    const template = this.getTemplate();
    if (template.settingsLevelId === levelId) template.settingsLevelId = null;
    if (template.objectsLevelId === levelId) template.objectsLevelId = null;

    // If we deleted the current level, switch to another one
    if (this.currentProject.currentLevelId === levelId) {
      const remainingLevels = Object.keys(this.currentProject.levels);
      this.switchToLevel(remainingLevels[0]);
    }

    this.updateLastModified();
    this.markAsUnsaved();
    this.notifyListeners("levelDeleted", { levelId });
    this.notifyListeners("projectChanged", this.currentProject);

    return true;
  }

  /**
   * Get shared data (custom structures and recent colors)
   * @returns {Object} Shared data object
   */
  getSharedData() {
    if (!this.isProjectLoaded) {
      return {
        customStructures: [],
        recentColors: [],
        inventorySlots: [],
        projectDifficulty: PROJECT_DIFFICULTIES[0].key,
        projectPlaylist: PROJECT_PLAYLISTS[0].key,
      };
    }

    return this.currentProject.sharedData;
  }

  /**
   * Update shared data
   * @param {Object} sharedData - New shared data
   */
  updateSharedData(sharedData) {
    if (!this.isProjectLoaded) {
      return;
    }

    this.currentProject.sharedData = {
      ...this.currentProject.sharedData,
      ...sharedData,
    };
    this.updateLastModified();
    this.markAsUnsaved();
    this.notifyListeners("sharedDataChanged", this.currentProject.sharedData);
    this.notifyListeners("projectChanged", this.currentProject);
  }

  /**
   * Read a slice of the project's editorUI state. This is UI-only data not
   * consumed by the runtime. Returns an empty object when no project is loaded
   * or the requested path is missing so callers can spread defaults over it.
   * @param {string} [path] - Optional dot-path (e.g. "hierarchyPanel").
   */
  getEditorUIState(path) {
    if (!this.isProjectLoaded || !this.currentProject) return {};
    const root = this.currentProject.editorUI;
    if (!root || typeof root !== "object") return {};
    if (!path) return root;
    const parts = path.split(".");
    let cursor = root;
    for (const p of parts) {
      if (!cursor || typeof cursor !== "object") return {};
      cursor = cursor[p];
    }
    return cursor && typeof cursor === "object" ? cursor : {};
  }

  /**
   * Shallow-merge a patch into a section of the project's editorUI state and
   * mark the project as unsaved. The section is specified by dot-path; missing
   * intermediate keys are created. Use this for persisting editor chrome
   * preferences such as panel minimize state.
   *
   * Example: updateEditorUIState("hierarchyPanel", { minimized: false })
   */
  updateEditorUIState(path, patch) {
    if (!this.isProjectLoaded || !this.currentProject) return;
    if (!patch || typeof patch !== "object") return;
    if (!this.currentProject.editorUI) this.currentProject.editorUI = {};
    const parts = path.split(".");
    let cursor = this.currentProject.editorUI;
    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      if (!cursor[key] || typeof cursor[key] !== "object") cursor[key] = {};
      cursor = cursor[key];
    }
    const leafKey = parts[parts.length - 1];
    cursor[leafKey] = { ...(cursor[leafKey] || {}), ...patch };
    this.updateLastModified();
    this.markAsUnsaved();
    this.notifyListeners("editorUIChanged", {
      path,
      state: this.getEditorUIState(path),
    });
  }

  /**
   * Export project to JSON string
   * @returns {string} JSON representation of the project
   */
  exportProject(stringify = true) {
    if (!this.isProjectLoaded) {
      console.warn("[ProjectManager] Cannot export: No project loaded");
      return null;
    }

    // Save current level state before exporting
    this.saveCurrentLevelState();

    return stringify
      ? JSON.stringify(this.currentProject, null, 2)
      : this.currentProject;
  }

  /**
   * Save project to file using File System API or fallback
   * @param {boolean} saveAs - Force "Save As" dialog
   */
  async saveProjectToFile(saveAs = false) {
    const projectJson = this.exportProject();
    if (!projectJson) {
      return false;
    }

    try {
      // Check if File System API is supported
      if ("showSaveFilePicker" in window) {
        // If we don't have a file handle or user wants "Save As"
        if (!this.currentFileHandle || saveAs) {
          const defaultFilename = `${this.currentProject.projectName.replace(
            /[^a-z0-9]/gi,
            "_",
          )}${LEVEL_PROJECT_EXTENSION}`;

          this.currentFileHandle = await window.showSaveFilePicker({
            suggestedName: defaultFilename,
            types: [
              {
                description: "Level Editor Project files",
                accept: {
                  "application/json": [LEVEL_PROJECT_EXTENSION],
                },
              },
            ],
          });
        }

        // Write to the file handle
        const writable = await this.currentFileHandle.createWritable();
        await writable.write(projectJson);
        await writable.close();

        this.markAsSaved();
        this.notifyListeners("projectSaved", {
          filename: this.currentFileHandle.name,
          fileHandle: this.currentFileHandle,
        });

        // Add to recent projects when saving with a file handle
        await this.addToRecentProjects(this.currentProject);

        console.log(
          `[ProjectManager] Project saved to file: ${this.currentFileHandle.name}`,
        );
        return true;
      } else {
        // Fallback to download link
        return this.saveProjectToFileDownload();
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("[ProjectManager] Save operation cancelled by user");
        return false;
      }
      console.error("[ProjectManager] Failed to save project:", error);
      // Fallback to download link
      return this.saveProjectToFileDownload();
    } finally {
      globalThis._editorScope?.toolbar.updateToolVisibility();
    }
  }

  /**
   * Fallback save method using download link
   */
  saveProjectToFileDownload() {
    const projectJson = this.exportProject();
    if (!projectJson) {
      return false;
    }

    const defaultFilename = `${this.currentProject.projectName.replace(
      /[^a-z0-9]/gi,
      "_",
    )}${LEVEL_PROJECT_EXTENSION}`;

    const blob = new Blob([projectJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = defaultFilename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    this.markAsSaved();
    this.notifyListeners("projectSaved", { filename: defaultFilename });
    console.log(`[ProjectManager] Project saved to file: ${defaultFilename}`);
    return true;
  }

  /**
   * Load project from JSON string
   * @param {string} projectJson - JSON string containing project data
   * @returns {boolean} Success status
   */
  loadProject(projectJson) {
    try {
      const projectData = JSON.parse(projectJson);

      // Validate project structure
      if (!this.validateProjectStructure(projectData)) {
        console.error("[ProjectManager] Invalid project structure");
        return false;
      }

      // Ensure project has an ID (for older projects that don't have one)
      if (!projectData.projectId) {
        projectData.projectId = this.generateProjectId(
          projectData.projectName || "project",
        );
        console.log(
          `[ProjectManager] Generated project ID for existing project: ${projectData.projectId}`,
        );
      }

      // Ensure shared data has the new fields (backward compatibility)
      if (!projectData.sharedData) {
        projectData.sharedData = {};
      }
      if (projectData.sharedData.projectDifficulty === undefined) {
        projectData.sharedData.projectDifficulty = PROJECT_DIFFICULTIES[0].key;
      }
      if (projectData.sharedData.projectPlaylist === undefined) {
        projectData.sharedData.projectPlaylist = PROJECT_PLAYLISTS[0].key;
      }
      if (
        !projectData.sharedData.customMaterials ||
        typeof projectData.sharedData.customMaterials !== "object"
      ) {
        projectData.sharedData.customMaterials = {};
      }

      // Ensure template slots exist (backward compatibility)
      if (!projectData.template || typeof projectData.template !== "object") {
        projectData.template = { settingsLevelId: null, objectsLevelId: null };
      }

      // Ensure workshop data exists (backward compatibility)
      if (!projectData.workshop) {
        projectData.workshop = {
          itemId: null,
          description: "",
          previewImage: null,
          visibility: 0,
        };
      }

      // Ensure editorUI state exists (backward compatibility for old projects).
      // All consumers must still default internally in case individual
      // sub-fields are missing on very old saves that had a partial editorUI.
      if (!projectData.editorUI || typeof projectData.editorUI !== "object") {
        projectData.editorUI = {};
      }
      if (
        !projectData.editorUI.hierarchyPanel ||
        typeof projectData.editorUI.hierarchyPanel !== "object"
      ) {
        projectData.editorUI.hierarchyPanel = { minimized: true };
      }
      if (typeof projectData.editorUI.hierarchyPanel.minimized !== "boolean") {
        projectData.editorUI.hierarchyPanel.minimized = true;
      }

      // Save current project if needed
      if (this.isProjectLoaded) {
        this.saveCurrentLevelState();
      }

      this.currentProject = projectData;
      this.isProjectLoaded = true;

      // Load the current level or default to first level
      const levelIds = Object.keys(projectData.levels);
      if (levelIds.length === 0) {
        console.error("[ProjectManager] Project has no levels");
        return false;
      }

      const currentLevelId = projectData.currentLevelId || levelIds[0];
      this.currentProject.currentLevelId = currentLevelId;

      // Apply shared data to systems
      this.applySharedDataToSystems();

      // Load the current level
      this.loadLevelState(currentLevelId);

      this.markAsSaved(); // Loading a project marks it as saved

      this.notifyListeners("projectLoaded", this.currentProject);
      this.notifyListeners("projectChanged", this.currentProject);

      console.log(
        `[ProjectManager] Loaded project: ${projectData.projectName}`,
      );

      return true;
    } catch (error) {
      console.error("[ProjectManager] Failed to load project:", error);
      return false;
    }
  }

  /**
   * Open project file using File System API or file input
   * @returns {Promise<boolean>} Success status
   */
  async openProjectFile() {
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
        const text = await file.text();
        const success = this.loadProject(text);

        if (success) {
          // Store the file handle for future saves
          this.currentFileHandle = fileHandle;

          // Add to recent projects with the file handle
          await this.addToRecentProjects(this.currentProject);
        }

        return success;
      } else {
        // Fallback to file input
        return this.openProjectFileInput();
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("[ProjectManager] Open operation cancelled by user");

        // If no project is loaded and operation was cancelled, show welcome screen
        if (!this.hasProjectLoaded()) {
          const welcomeDialog = globalThis._editorScope?.welcomeDialog;
          if (welcomeDialog) {
            welcomeDialog.show();
          }
        }

        return false;
      }
      console.error("[ProjectManager] Failed to open project file:", error);
      return false;
    }
  }

  /**
   * Fallback method using file input
   * @returns {Promise<boolean>} Success status
   */
  openProjectFileInput() {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = LEVEL_PROJECT_EXTENSION + ", .json";
      input.style.display = "none";

      input.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          const success = await this.loadProjectFromFile(file);
          // Note: Not adding to recent projects for fallback method since no file handle is available
          resolve(success);
        } else {
          // If no file selected and no project loaded, show welcome screen
          if (!this.hasProjectLoaded()) {
            const welcomeDialog = globalThis._editorScope?.welcomeDialog;
            if (welcomeDialog) {
              welcomeDialog.show();
            }
          }
          resolve(false);
        }
      });

      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    });
  }

  /**
   * Load project from file
   * @param {File} file - File object containing project data
   * @returns {Promise<boolean>} Success status
   */
  async loadProjectFromFile(file) {
    try {
      const text = await file.text();
      return this.loadProject(text);
    } catch (error) {
      console.error(
        "[ProjectManager] Failed to load project from file:",
        error,
      );
      return false;
    }
  }

  /**
   * Validate project data structure
   * @param {Object} projectData - Project data to validate
   * @returns {boolean} Is valid
   */
  validateProjectStructure(projectData) {
    if (!projectData || typeof projectData !== "object") {
      return false;
    }

    const required = [
      "version",
      "projectName",
      "levels",
      "sharedData",
      "metaData",
    ];
    for (const prop of required) {
      if (!(prop in projectData)) {
        console.warn(`[ProjectManager] Missing required property: ${prop}`);
        return false;
      }
    }

    if (!projectData.levels || typeof projectData.levels !== "object") {
      console.warn("[ProjectManager] Invalid levels object");
      return false;
    }

    return true;
  }

  /**
   * Apply shared data to various systems
   */
  applySharedDataToSystems() {
    if (!this.isProjectLoaded) {
      return;
    }

    // Sync inventory bar from saved shared data if available
    try {
      const placingSystem = globalThis._editorScope?.placingSystem;
      const inventoryBar =
        placingSystem?.inventoryBar || globalThis._editorScope?.inventoryBar;
      const presetManager = placingSystem?.presetManager;
      const shared = this.currentProject.sharedData || {};

      if (inventoryBar) {
        const allPresets = presetManager?.getAllPresets?.() || [];
        const presetById = new Map(allPresets.map((p) => [p.id, p]));
        // Include custom structures from shared data in lookup
        const customStructures = Array.isArray(shared.customStructures)
          ? shared.customStructures
          : [];
        for (const cs of customStructures) {
          if (cs && cs.id && !presetById.has(cs.id)) {
            // Migration: Add placeLikeTag property to existing custom structures
            // Only if they have one object AND that object is tag-placeable
            if (
              cs.placeLikeTag === undefined &&
              cs.objects &&
              cs.objects.length === 1
            ) {
              cs.placeLikeTag = tagPlaceableObjectTypes.includes(
                cs.objects[0].objectType,
              );
            }
            presetById.set(cs.id, cs);
          }
        }

        const slots = Array.isArray(shared.inventorySlots)
          ? shared.inventorySlots
          : [];

        // Suppress change events during sync to avoid writing back immediately
        if (inventoryBar.setSuppressChangeEvents)
          inventoryBar.setSuppressChangeEvents(true);

        // Fill from project data if present
        let assignedCount = 0;
        for (let i = 0; i < inventoryBar.options.slotCount; i++) {
          const slotData = slots[i] || null;
          let preset = null;

          if (slotData) {
            // Handle both old format (just ID string) and new format (object with id and overrides)
            const presetId =
              typeof slotData === "string" ? slotData : slotData.id;
            preset = presetId ? presetById.get(presetId) || null : null;
          }

          if (preset) assignedCount++;
          inventoryBar.setSlotPreset(i, preset);

          // Apply parameter overrides if they exist
          if (
            slotData &&
            typeof slotData === "object" &&
            slotData.parameterOverrides
          ) {
            const inventorySlot = inventoryBar.slots[i];
            if (inventorySlot) {
              inventorySlot.parameterOverrides = {
                ...slotData.parameterOverrides,
              };
              inventoryBar.updateSlotValueDisplay(i);
              inventoryBar.updateSlotVisualIndicator(i);
              // Update gear icon tooltip with current parameter values
              if (inventoryBar.updateSlotVariableTooltip) {
                inventoryBar.updateSlotVariableTooltip(i);
              }
            }
          }
        }

        // Fallback: if no presets assigned in project data, use first 3 presets
        if (assignedCount === 0 && allPresets.length > 0) {
          const defaultCount = Math.min(3, inventoryBar.options.slotCount);
          for (let i = 0; i < defaultCount; i++) {
            inventoryBar.setSlotPreset(i, allPresets[i]);
          }
        }

        if (inventoryBar.setSuppressChangeEvents)
          inventoryBar.setSuppressChangeEvents(false);
        inventoryBar.updateDisplay?.();
      }
    } catch (e) {
      console.warn(
        "[ProjectManager] Failed to apply shared inventory data:",
        e,
      );
    }

    console.log(
      "[ProjectManager] Shared data loaded:",
      this.currentProject.sharedData,
    );
  }

  /**
   * Generate a unique level ID
   * @returns {string} Unique level ID
   */
  generateLevelId() {
    return `level-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a unique project ID
   * @param {string} projectName - Name of the project (used as prefix)
   * @returns {string} Unique project ID
   */
  generateProjectId(projectName) {
    const cleanName = projectName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const prefix = cleanName || "project";
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update the last modified timestamp
   */
  updateLastModified() {
    if (this.currentProject) {
      this.currentProject.metaData.lastModified = new Date().toISOString();
    }
  }

  /**
   * Mark project as having unsaved changes
   */
  markAsUnsaved() {
    this.hasUnsavedChanges = true;
    this.notifyListeners("unsavedChanges", true);
  }

  /**
   * Mark project as saved
   */
  markAsSaved() {
    this.hasUnsavedChanges = false;
    this.lastSavedState = this.exportProject();
    this.notifyListeners("unsavedChanges", false);
  }

  /**
   * Check if project has unsaved changes
   * @returns {boolean}
   */
  getHasUnsavedChanges() {
    return this.isProjectLoaded && this.hasUnsavedChanges;
  }

  /**
   * Add event listener for project changes
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
   * Notify all listeners of an event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  notifyListeners(event, data) {
    // Mirror as a DOM event ("editor:project-<event>") so UI modules created
    // before the project manager (e.g. the inspector) can subscribe without
    // an init-order dependency.
    try {
      document.dispatchEvent(
        new CustomEvent(`editor:project-${event}`, { detail: data }),
      );
    } catch (_) {
      /* non-DOM context */
    }
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(
            `[ProjectManager] Error in event listener for ${event}:`,
            error,
          );
        }
      });
    }
  }

  /**
   * Get project info
   * @returns {Object|null} Project information or null if no project loaded
   */
  getProjectInfo() {
    if (!this.isProjectLoaded) {
      return null;
    }

    const levelCount = Object.keys(this.currentProject.levels).length;
    const currentLevel = this.getCurrentLevel();

    return {
      projectName: this.currentProject.projectName,
      currentLevelId: this.currentProject.currentLevelId,
      currentLevelName: currentLevel?.levelData.levelName || "Unknown",
      levelCount,
      created: this.currentProject.metaData.created,
      lastModified: this.currentProject.metaData.lastModified,
    };
  }

  /**
   * Get the current project ID
   * @returns {string|null} Current project ID or null if no project loaded
   */
  getCurrentProjectId() {
    if (!this.isProjectLoaded || !this.currentProject) {
      return null;
    }
    return this.currentProject.projectId;
  }

  /**
   * Check if a project is currently loaded
   * @returns {boolean} Is project loaded
   */
  hasProjectLoaded() {
    return this.isProjectLoaded && this.currentProject !== null;
  }

  /**
   * Close the current project
   */
  closeProject() {
    if (this.isProjectLoaded) {
      this.saveCurrentLevelState();
      this.notifyListeners("projectClosed", this.currentProject);
    }

    this.currentProject = null;
    this.isProjectLoaded = false;
    this.currentFileHandle = null; // Clear file handle
    this.hasUnsavedChanges = false; // Reset unsaved changes
    this.lastSavedState = null; // Reset last saved state

    console.log("[ProjectManager] Project closed");
  }

  /**
   * Get the current file handle
   * @returns {FileSystemFileHandle|null} Current file handle
   */
  getCurrentFileHandle() {
    return this.currentFileHandle;
  }

  /**
   * Check if the project has an associated file
   * @returns {boolean} True if project has a file handle
   */
  hasAssociatedFile() {
    return this.currentFileHandle !== null;
  }

  /**
   * Add project to recent projects list
   * @param {Object} projectData - Project data
   */
  async addToRecentProjects(projectData) {
    // Only add to recent projects if we have a file handle
    if (!this.currentFileHandle) {
      console.log(
        "[ProjectManager] Not adding to recent projects - no file handle",
      );
      return;
    }

    const welcomeDialog = globalThis._editorScope?.welcomeDialog;
    if (welcomeDialog) {
      await welcomeDialog.addRecentProject({
        name: projectData.projectName,
        fileHandle: this.currentFileHandle,
        levelCount: Object.keys(projectData.levels).length,
        id: projectData.projectId,
      });
    }
  }
}

// Singleton instance
let projectManagerInstance = null;

export function initializeProjectManager() {
  if (!projectManagerInstance) {
    projectManagerInstance = new ProjectManager();
    globalThis._editorScope.projectManager = projectManagerInstance;
  }
  return projectManagerInstance;
}

export function getProjectManager() {
  return projectManagerInstance;
}

export function destroyProjectManager() {
  if (projectManagerInstance) {
    projectManagerInstance.closeProject();
    projectManagerInstance = null;
  }
}
