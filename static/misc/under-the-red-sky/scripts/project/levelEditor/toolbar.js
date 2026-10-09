// Toolbar UI System for Level Editor
// Provides a top toolbar with tool icons and tooltips

import { Theme, refreshInspector } from "./inspectorUI.js";
import * as iconList from "./iconList.js";
import {
  CustomStructureCreateDialog,
  CustomStructuresManagerDialog,
} from "./customStructureDialogs.js";
import { showGhostPathDialog } from "./ghostPaths/ghostPathDialog.js";
import { openScriptEditor } from "./scripting/scriptEditorDialog.js";
import { validateProject } from "./validation/projectValidator.js";

export class Toolbar {
  constructor(container = document.body) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.toolbar = null;
    this.isVisible = true;
    this.selectionManager = null;
    this.isInspectorOpen = false;
    this.tooltip = null; // Reusable tooltip element
    this.tooltipHideTimeout = null; // For delayed hiding
    // Split buttons by config.id → { mainButton, menuItems }, so the main
    // action can be swapped at runtime (see setSplitMainTool).
    this.splitButtons = new Map();

    this.customStructureCreateDialog = new CustomStructureCreateDialog();
    this.customStructuresManagerDialog = new CustomStructuresManagerDialog();

    // Make custom structures manager globally accessible
    globalThis._editorScope = globalThis._editorScope || {};
    globalThis._editorScope.customStructuresManagerDialog =
      this.customStructuresManagerDialog;

    this.boundEvents = new Map();

    this.init();
  }

  init() {
    this.createToolbar();
    this.createTooltip(); // Create the reusable tooltip element
    this.applyStyles();
    this.setupEventListeners();
    this.setupEventBlocking();
    this.updateValidatorButtonState();
    // Validation also depends on the PROJECT's level list (end zone "Next
    // Level" targets), which changes without touching this level's state —
    // drop the state cache and re-validate on add/delete/rename.
    this._onProjectLevelsChanged = () => {
      this._lastValidatedState = null;
      this.updateValidatorButtonState();
    };
    for (const ev of ["levelAdded", "levelDeleted", "levelRenamed"]) {
      document.addEventListener(
        `editor:project-${ev}`,
        this._onProjectLevelsChanged,
      );
    }
    // Same for the custom material library (project shared data, not level
    // state): deleting a material can leave dangling references.
    document.addEventListener(
      "editor:materials-changed",
      this._onProjectLevelsChanged,
    );
  }

  setSelectionManager(selectionManager) {
    this.selectionManager = selectionManager;
    this.updateToolVisibility();
  }

  setInspectorState(isOpen) {
    this.isInspectorOpen = isOpen;
    this.updateLayout();
  }

  /**
   * Update save button to reflect unsaved changes state
   * @param {boolean} hasUnsavedChanges - Whether there are unsaved changes
   */
  updateSaveButton(hasUnsavedChanges) {
    const saveButton = document.getElementById("toolbar-saveProject");
    if (saveButton) {
      // Update tooltip to reflect state
      if (hasUnsavedChanges) {
        saveButton.dataset.tooltip = "Save Project (Ctrl+S) - Unsaved changes";
        saveButton.classList.remove("disabled");
      } else {
        saveButton.dataset.tooltip = "Save Project (Ctrl+S)";
        saveButton.classList.add("disabled");
      }
    }
  }

  createToolbar() {
    this.toolbar = document.createElement("div");
    this.toolbar.className = "editor-toolbar";

    // Create toolbar sections
    const leftSection = document.createElement("div");
    leftSection.className = "toolbar-section";

    const rightSection = document.createElement("div");
    rightSection.className = "toolbar-section toolbar-section-right";

    // Project tools (far left)
    this.createToolGroup(leftSection, [
      {
        id: "projectManager",
        icon: "ProjectManager",
        tooltip: "Project",
        enabled: true,
      },
      {
        id: "steamWorkshop",
        icon: "SteamLogo",
        tooltip: "Steam Workshop",
        enabled: true,
      },
      {
        id: "saveProject",
        icon: "Save",
        tooltip: "Save Project",
        enabled: true,
      },
    ]);

    this.createDivider(leftSection);

    // Left section tools
    this.createToolGroup(leftSection, [
      { id: "undo", icon: "Undo", tooltip: "Undo (Ctrl+Z)", enabled: false },
      { id: "redo", icon: "Redo", tooltip: "Redo (Ctrl+Y)", enabled: false },
    ]);

    this.createDivider(leftSection);

    this.createToolGroup(leftSection, [
      {
        id: "move",
        icon: "Move",
        tooltip: "Move Tool (Tab)",
        enabled: false,
        selectionRequired: false,
        transformTool: true,
      },
      {
        id: "rotate",
        icon: "Rotate",
        tooltip: "Rotate Tool (Tab)",
        enabled: false,
        selectionRequired: false,
        transformTool: true,
      },
      {
        id: "scale",
        icon: "Scale",
        tooltip: "Scale Tool (Tab)",
        enabled: false,
        selectionRequired: false,
        transformTool: true,
      },
      {
        id: "boxScale",
        icon: "BoxScale",
        tooltip: "Box Scale Tool (Tab)",
        enabled: false,
        selectionRequired: false,
        transformTool: true,
      },
    ]);

    this.createDivider(leftSection);

    this.createToolGroup(leftSection, [
      {
        id: "copy",
        icon: "Copy",
        tooltip: "Copy (Ctrl+C)",
        enabled: false,
        selectionRequired: true,
      },
      {
        id: "paste",
        icon: "Paste",
        tooltip: "Paste (Ctrl+V)",
        enabled: false,
        selectionRequired: false,
      },
      {
        id: "cut",
        icon: "Cut",
        tooltip: "Cut (Ctrl+X)",
        enabled: false,
        selectionRequired: true,
      },
      {
        id: "duplicate",
        icon: "Duplicate",
        tooltip: "Duplicate (Ctrl+D)",
        enabled: false,
        selectionRequired: true,
      },
      // Group / Ungroup toggle. Single button that adapts to the selection:
      //   - Disabled when nothing is selected.
      //   - Normal/enabled when the selection would be grouped (Ctrl+G). Click = group.
      //   - Active/blue when the selection exactly matches a single group's
      //     descendant set (Ctrl+Shift+G). Click = ungroup.
      // Lives in the same toolGroup as the clipboard ops because it's the
      // same conceptual category (acting on the current selection) and a
      // dedicated section was wasting toolbar real estate.
      {
        id: "groupToggle",
        icon: "SelectGroup",
        tooltip: "Group / Ungroup selection (Ctrl+G / Ctrl+Shift+G)",
        enabled: false,
        selectionRequired: true,
      },
    ]);

    this.createDivider(leftSection);

    this.createToolGroup(leftSection, [
      {
        id: "delete",
        icon: "Delete",
        tooltip: "Delete (Del)",
        enabled: false,
        selectionRequired: true,
      },
    ]);

    this.createDivider(leftSection);

    this.createToolGroup(leftSection, [
      {
        id: "createCustomStructure",
        icon: "CreateCustomStructure",
        tooltip: "Create Custom Structure",
        enabled: true,
      },
    ]);

    this.createDivider(leftSection);

    // Ghost Paths split button moved to the right section (next to grid) so
    // viewport/render-toggle widgets all live together on the right and the
    // left section stays focused on selection-acting tools.

    // Right section tools

    // Grid button
    this.createToolGroup(rightSection, [
      {
        id: "grid",
        icon: "Grid",
        tooltip: "Toggle Grid Snapping",
        enabled: true,
      },
    ]);

    // Ghost Paths split button (right side, next to grid).
    this.createSplitButton(rightSection, {
      id: "ghostPathsSplit",
      main: {
        toolId: "ghostVisibilityToggle",
        icon: "GhostPathsOff",
        tooltip: "Toggle Ghost Visibility",
        enabled: true,
      },
      menuTooltip: "Ghost path options",
      menuItems: [
        {
          toolId: "ghostVisibilityToggle",
          label: "Toggle Ghost Visibility",
          icon: "GhostPathsOff",
        },
        {
          toolId: "playAllVisibleGhosts",
          label: "Play All Visible Ghosts",
          icon: "Play",
        },
        {
          toolId: "stopAllGhosts",
          label: "Stop All Ghosts",
          icon: "BasicSprite",
        },
        {
          toolId: "ghostPaths",
          label: "Open Ghost Paths Manager",
          icon: "Settings",
        },
      ],
    });

    // Level script button
    this.createToolGroup(rightSection, [
      {
        id: "editScript",
        icon: "Code",
        tooltip: "Edit Level Script",
        enabled: true,
      },
    ]);

    // Validator button
    this.createToolGroup(rightSection, [
      {
        id: "validator",
        icon: "BugOutline",
        tooltip: "Validate Level",
        enabled: true,
      },
    ]);

    // Play split button with dropdown (generalized)
    this.createSplitButton(rightSection, {
      id: "playSplit",
      main: { toolId: "play", icon: "Play", tooltip: "Play", enabled: true },
      menuTooltip: "Play options",
      menuItems: [
        { toolId: "play", label: "Play Level", icon: "Play" },
        {
          toolId: "play-project-here",
          label: "Play Project from here",
          icon: "PlayProject",
        },
        {
          toolId: "play-project-start",
          label: "Play Project from start",
          icon: "PlayProjectFromStart",
        },
        {
          toolId: "play-from-camera",
          label: "Play Level from camera",
          icon: "PlayFromCamera",
        },
      ],
    });

    this.toolbar.appendChild(leftSection);
    this.toolbar.appendChild(rightSection);
    this.container.appendChild(this.toolbar);
  }

  createTooltip() {
    // Create the reusable tooltip element
    this.tooltip = document.createElement("div");
    this.tooltip.className = "toolbar-tooltip";
    this.tooltip.innerHTML = `
      <div class="tooltip-arrow"></div>
      <div class="tooltip-content"></div>
    `;

    // Add to body but keep it hidden initially
    document.body.appendChild(this.tooltip);
  }

  createToolGroup(parent, tools) {
    const group = document.createElement("div");
    group.className = "toolbar-group";

    tools.forEach((tool) => {
      const button = document.createElement("button");
      button.className = `toolbar-button ${tool.enabled ? "" : "disabled"}`;
      button.id = `toolbar-${tool.id}`;
      button.innerHTML = iconList[tool.icon];
      button.dataset.tooltip = tool.tooltip; // Store tooltip text for custom system
      button.dataset.tool = tool.id;

      if (tool.selectionRequired) {
        button.dataset.selectionRequired = "true";
      }

      if (tool.transformTool) {
        button.dataset.transformTool = "true";
      }

      // Add click handler
      button.addEventListener("click", (e) => this.handleToolClick(tool.id, e));

      // Add custom tooltip handlers
      this.setupTooltipHandlers(button);

      group.appendChild(button);
    });

    parent.appendChild(group);
  }

  /**
   * Make one of a split button's menu items its main (fast-access) action.
   * @param {string} splitId - config.id of the split button (e.g. "playSplit")
   * @param {string} toolId - toolId of the menu item to promote
   */
  setSplitMainTool(splitId, toolId) {
    const split = this.splitButtons.get(splitId);
    if (!split) return;
    const item = split.menuItems.find((m) => m.toolId === toolId);
    if (!item) return;
    const { mainButton } = split;
    mainButton.dataset.tool = toolId;
    mainButton.id = `toolbar-${toolId}`;
    if (item.icon && iconList[item.icon]) mainButton.innerHTML = iconList[item.icon];
    if (item.label) mainButton.dataset.tooltip = item.label;
  }

  createDivider(parent) {
    const divider = document.createElement("div");
    divider.className = "toolbar-divider";
    divider.innerHTML = iconList.Divider;
    parent.appendChild(divider);
  }

  createSplitButton(parent, config) {
    const container = document.createElement("div");
    container.className = "toolbar-split-button";
    if (config.id) container.id = `toolbar-${config.id}`;

    // Main button
    const mainButton = document.createElement("button");
    mainButton.className = `toolbar-button split-main ${
      config.main?.enabled === false ? "disabled" : ""
    }`;
    if (config.main?.toolId) mainButton.id = `toolbar-${config.main.toolId}`;
    const mainIconName = config.main?.icon;
    if (mainIconName && iconList[mainIconName]) {
      mainButton.innerHTML = iconList[mainIconName];
    }
    if (config.main?.tooltip) mainButton.dataset.tooltip = config.main.tooltip;
    if (config.main?.toolId) mainButton.dataset.tool = config.main.toolId;
    if (config.main?.toolId) {
      // Read the tool id at click time: setSplitMainTool may swap it.
      mainButton.addEventListener("click", (e) =>
        this.handleToolClick(mainButton.dataset.tool, e)
      );
    }
    this.setupTooltipHandlers(mainButton);
    if (config.id) {
      this.splitButtons.set(config.id, {
        mainButton,
        menuItems: config.menuItems || [],
      });
    }

    // Arrow button to toggle dropdown
    const arrowButton = document.createElement("button");
    arrowButton.className = "toolbar-button split-arrow";
    arrowButton.id = config.id
      ? `toolbar-${config.id}-menu`
      : "toolbar-split-menu";
    arrowButton.dataset.tooltip = config.menuTooltip || "Options";
    arrowButton.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 10l5 5 5-5H7z"/></svg>';
    this.setupTooltipHandlers(arrowButton);

    // Dropdown menu
    const menu = document.createElement("div");
    menu.className = "toolbar-dropdown-menu";

    (config.menuItems || []).forEach((item) => {
      const btn = document.createElement("button");
      btn.className = "toolbar-dropdown-item";
      if (item.toolId) btn.id = `toolbar-${item.toolId}`;
      const iconMarkup =
        item.icon && iconList[item.icon] ? iconList[item.icon] : "";
      btn.innerHTML = `${iconMarkup}<span class=\"label\">${
        item.label || ""
      }</span>`;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (item.toolId) this.handleToolClick(item.toolId, e);
        container.classList.remove("open");
      });
      menu.appendChild(btn);
    });

    // Toggle menu — close any other open split dropdown first
    arrowButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.hideTooltip();
      const wasOpen = container.classList.contains("open");
      this.toolbar
        ?.querySelectorAll(".toolbar-split-button.open")
        .forEach((el) => el.classList.remove("open"));
      if (!wasOpen) container.classList.add("open");
    });

    // Close on outside click
    const clickEvent = (e) => {
      if (!container.contains(e.target)) {
        container.classList.remove("open");
      }
    };
    document.addEventListener("click", clickEvent);
    this.boundEvents.set("click", [
      ...(this.boundEvents.get("click") ?? []),
      clickEvent,
    ]);

    // Also close when clicking elsewhere inside the toolbar but outside this split container
    if (this.toolbar) {
      this.toolbar.addEventListener("click", (e) => {
        if (!container.contains(e.target)) {
          container.classList.remove("open");
        }
      });
    }

    // Close on Escape
    const keydownEvent = (e) => {
      if (e.key === "Escape") {
        container.classList.remove("open");
      }
    };
    document.addEventListener("keydown", keydownEvent);
    this.boundEvents.set("keydown", [
      ...(this.boundEvents.get("keydown") ?? []),
      keydownEvent,
    ]);

    container.appendChild(mainButton);
    container.appendChild(arrowButton);
    container.appendChild(menu);

    parent.appendChild(container);
  }

  handleToolClick(toolId, event) {
    const button = event.currentTarget;

    if (button.classList.contains("disabled")) {
      return;
    }

    // Handle tool actions
    switch (toolId) {
      case "undo":
        if (globalThis._editorScope?.stateManager) {
          globalThis._editorScope.stateManager.undo();
        }
        break;

      case "redo":
        if (globalThis._editorScope?.stateManager) {
          globalThis._editorScope.stateManager.redo();
        }
        break;

      case "move":
        if (this.selectionManager) {
          this.selectionManager.setTransformMode(
            "move",
            this.selectionManager.camera
          );
          this.updateTransformToolState("move");
        }
        break;

      case "rotate":
        if (this.selectionManager) {
          this.selectionManager.setTransformMode(
            "rotate",
            this.selectionManager.camera
          );
          this.updateTransformToolState("rotate");
        }
        break;

      case "scale":
        if (this.selectionManager) {
          this.selectionManager.setTransformMode(
            "scale",
            this.selectionManager.camera
          );
          this.updateTransformToolState("scale");
        }
        break;

      case "boxScale":
        if (this.selectionManager) {
          this.selectionManager.setTransformMode(
            "boxScale",
            this.selectionManager.camera
          );
          this.updateTransformToolState("boxScale");
        }
        break;

      case "copy":
        if (this.selectionManager) {
          this.selectionManager.copySelected();
          this.updateToolVisibility();
        }
        break;

      case "paste":
        if (this.selectionManager) {
          this.selectionManager.pasteFromClipboard();
        }
        break;

      case "cut":
        if (this.selectionManager) {
          this.selectionManager.cutSelected();
          this.updateToolVisibility();
        }
        break;

      case "duplicate":
        if (this.selectionManager) {
          this.selectionManager.duplicateSelected();
        }
        break;

      case "delete":
        if (this.selectionManager) {
          this.selectionManager.deleteSelected();
        }
        break;

      case "groupToggle": {
        // The button's current visual state tells us which operation to run.
        // This mirrors the Ctrl+G / Ctrl+Shift+G hotkeys but in a single
        // affordance: when the button is "active" the selection is already a
        // coherent group and clicking ungroups it; otherwise clicking groups
        // whatever is selected.
        const gm = globalThis._editorScope?.groupManager;
        if (!gm) break;
        if (button.classList.contains("active")) {
          gm.ungroupSelected();
        } else {
          gm.groupSelected();
        }
        this.updateToolVisibility();
        break;
      }

      case "grid":
        // Toggle grid snapping
        if (globalThis._editorScope?.gridSystem) {
          const currentState =
            globalThis._editorScope.gridSystem.isSnapToGridEnabled();
          globalThis._editorScope.gridSystem.setSnapToGrid(!currentState);

          // Update button appearance
          button.classList.toggle("active", !currentState);

          // Sync with level settings
          if (globalThis._editorScope?.levelSettings) {
            globalThis._editorScope.levelSettings.updateLevelData(
              "gridSettings.snapToGrid",
              !currentState
            );
          }
          refreshInspector();
        }
        break;

      case "play":
      case "play-project-here":
      case "play-project-start":
      case "play-from-camera":
        // Handle play through play system
        const playSystem = globalThis._editorScope?.playSystem;
        if (playSystem) {
          playSystem.handlePlay(toolId);
        } else {
          console.error("Play system not available");
        }
        break;

      case "editScript":
        // Open the level script editor
        openScriptEditor();
        break;

      case "validator":
        // Show validation dialog
        if (globalThis._editorScope?.levelValidator) {
          globalThis._editorScope.levelValidator.validate();
          globalThis._editorScope.validationDialog.show();
        } else {
          console.warn("Level validator not available");
        }
        break;

      case "createCustomStructure":
        // Show custom structure creation dialog
        this.customStructureCreateDialog.show();
        break;
      case "ghostPaths":
        // Show ghost path manager dialog
        showGhostPathDialog();
        break;

      case "ghostVisibilityToggle":
        // Toggle ghost visibility
        if (globalThis._editorScope?.ghostPathSystem?.renderer) {
          globalThis._editorScope.ghostPathSystem.renderer.toggleVisible();
        }
        break;

      case "playAllVisibleGhosts":
        // Play all visible ghosts
        if (globalThis._editorScope?.ghostPathSystem?.renderer) {
          globalThis._editorScope.ghostPathSystem.renderer.startAllVisibleAnimations();
        }
        break;

      case "stopAllGhosts":
        // Stop all ghosts
        if (globalThis._editorScope?.ghostPathSystem?.renderer) {
          globalThis._editorScope.ghostPathSystem.renderer.stopAllAnimations();
        }
        break;
      case "manageCustomStructures":
        // Show custom structures manager dialog
        this.customStructuresManagerDialog.show();
        break;

      case "saveProject":
        // Save current project
        if (globalThis._editorScope?.projectManager) {
          globalThis._editorScope.projectManager.saveProjectToFile();
        }
        break;

      case "projectManager":
        // Show project manager dialog
        if (globalThis._editorScope?.projectDataDialog) {
          globalThis._editorScope.projectDataDialog.show();
        }
        break;

      case "steamWorkshop":
        // Show Steam Workshop dialog
        if (globalThis._editorScope?.steamWorkshopDialog) {
          globalThis._editorScope.steamWorkshopDialog.show();
        }
        break;
    }
  }

  updateTransformToolState(activeTool) {
    // Update transform tool visual states. A disabled button (no selection)
    // must never appear active simultaneously.
    const hasSelection = this.selectionManager?.hasSelection?.() ?? true;
    const transformButtons = this.toolbar.querySelectorAll(
      '[data-transform-tool="true"]'
    );
    transformButtons.forEach((button) => {
      button.classList.remove("active");
      if (
        hasSelection &&
        activeTool &&
        button.dataset.tool === activeTool
      ) {
        button.classList.add("active");
      }
    });
  }

  // Resolve a toolbar button element by its data-tool name, caching the
  // reference. updateToolVisibility runs on every selection change and used to
  // re-querySelector a dozen buttons each time; the toolbar DOM is static, so
  // we look each one up once. Re-queries if a cached node was detached (e.g.
  // the toolbar was rebuilt).
  _toolButton(name) {
    if (!this._toolButtonCache) this._toolButtonCache = new Map();
    let el = this._toolButtonCache.get(name);
    if (el && el.isConnected) return el;
    el = this.toolbar?.querySelector(`[data-tool="${name}"]`) || null;
    if (el) this._toolButtonCache.set(name, el);
    return el;
  }

  updateToolVisibility() {
    if (!this.selectionManager) return;

    const hasSelection = this.selectionManager.hasSelection();
    const hasClipboard = this.selectionManager.clipboard.length > 0;

    // Update transform tools
    const transformTools = ["move", "rotate", "scale", "boxScale"];
    transformTools.forEach((tool) => {
      const button = this._toolButton(tool);
      if (button) {
        button.classList.toggle("disabled", !hasSelection);
        // Don't show a transform tool as both active and disabled — strip the
        // active highlight whenever the button is disabled (no selection).
        if (!hasSelection) {
          button.classList.remove("active");
        }
      }
    });

    // Update clipboard-dependent tools
    const clipboardTools = ["paste"];
    clipboardTools.forEach((tool) => {
      const button = this._toolButton(tool);
      if (button) {
        button.classList.toggle("disabled", !hasClipboard);
      }
    });

    // Update selection-dependent tools
    const selectionTools = [
      "copy",
      "cut",
      "duplicate",
      "delete",
      "createCustomStructure",
    ];
    selectionTools.forEach((tool) => {
      const button = this._toolButton(tool);
      if (button) {
        button.classList.toggle("disabled", !hasSelection);
      }
    });

    // Group/Ungroup toggle.
    // Three states on one button:
    //   no selection         → disabled, not active
    //   groupable selection  → enabled, not active (Group on click)
    //   ungroupable selection → enabled, active/blue (Ungroup on click)
    const groupButton = this._toolButton("groupToggle");
    if (groupButton) {
      const gm = globalThis._editorScope?.groupManager;
      const ungroupable = !!(hasSelection && gm && gm.isSelectionUngroupable());
      groupButton.classList.toggle("disabled", !hasSelection);
      groupButton.classList.toggle("active", ungroupable);
      groupButton.title = ungroupable
        ? "Ungroup selection (Ctrl+Shift+G)"
        : "Group selection (Ctrl+G)";
    }

    // update undo/redo buttons. Read the stack lengths directly rather than
    // getUndoRedoInfo(), which copies the entire undo AND redo stacks into new
    // description objects (meant for the history panel) just to derive two
    // booleans.
    const sm = globalThis._editorScope?.stateManager;
    const undoButton = this._toolButton("undo");
    const redoButton = this._toolButton("redo");
    if (undoButton) {
      undoButton.classList.toggle("disabled", !(sm?.undoStack?.length > 0));
    }
    if (redoButton) {
      redoButton.classList.toggle("disabled", !(sm?.redoStack?.length > 0));
    }

    this.updateSaveButton(
      globalThis._editorScope?.projectManager?.getHasUnsavedChanges()
    );

    this.updateValidatorButtonState();
  }

  updateGridButtonState() {
    const gridButton = this.toolbar.querySelector('[data-tool="grid"]');
    if (gridButton && globalThis._editorScope?.gridSystem) {
      const isEnabled =
        globalThis._editorScope.gridSystem.isSnapToGridEnabled();
      gridButton.classList.toggle("active", isEnabled);
    }
  }

  /**
   * Update the validator button state based on validation status
   */
  updateValidatorButtonState() {
    const validatorButton = this._toolButton("validator");
    const validator = globalThis._editorScope?.levelValidator;
    if (validatorButton && validator) {
      // Validation depends only on level *content*, not on selection.
      // stateManager replaces `currentState` with a new object reference on
      // every content change (edit / undo / redo / load) and never on
      // selection — so if it hasn't changed since the last validation, skip
      // re-running validate(), which serializes the whole level and runs every
      // rule over all instances. The button already reflects the result.
      const sm = globalThis._editorScope?.stateManager;
      const stateRef = sm?.currentState ?? null;
      if (stateRef && stateRef === this._lastValidatedState) return;
      this._lastValidatedState = stateRef;

      // Run validation: the open level plus the project-wide rules (pack
      // completable, …) — the badge shows the worst of the two.
      const errors = validator.validate().slice();
      const warnings = validator.getWarnings().slice();
      const pm = globalThis._editorScope?.projectManager;
      if (pm?.isProjectLoaded) {
        try {
          const project = validateProject(
            pm.getAllLevels(),
            pm.currentProject?.currentLevelId || null,
          );
          errors.push(...project.errors);
          warnings.push(...project.warnings);
        } catch (e) {
          console.warn("[Toolbar] project validation failed", e);
        }
      }
      const hasErrors = errors.length > 0;
      const hasWarnings = warnings.length > 0;

      // Update button icon and color
      if (!hasErrors && !hasWarnings) {
        validatorButton.innerHTML = iconList.BugOutline;
        validatorButton.classList.remove("error", "warning");
        validatorButton.dataset.tooltip = "No issues found";
      } else if (hasErrors) {
        validatorButton.innerHTML = iconList.Bug;
        validatorButton.classList.add("error");
        validatorButton.classList.remove("warning");

        // Build tooltip text
        let tooltipText = `${errors.length} ${
          errors.length === 1 ? "error" : "errors"
        }`;
        if (hasWarnings) {
          tooltipText += `, ${warnings.length} ${
            warnings.length === 1 ? "warning" : "warnings"
          }`;
        }
        tooltipText += " found";
        validatorButton.dataset.tooltip = tooltipText;
      } else if (hasWarnings) {
        validatorButton.innerHTML = iconList.BugOutline;
        validatorButton.classList.add("warning");
        validatorButton.classList.remove("error");
        validatorButton.dataset.tooltip = `${warnings.length} ${
          warnings.length === 1 ? "warning" : "warnings"
        } found`;
      }
    }
  }

  updateLayout() {
    if (!this.toolbar) return;

    // Scale down toolbar when inspector is open
    if (this.isInspectorOpen) {
      this.toolbar.classList.add("inspector-open");
    } else {
      this.toolbar.classList.remove("inspector-open");
    }
  }

  setupEventListeners() {
    // Listen for ghost visibility changes to update the split button icon
    if (globalThis._editorScope?.ghostPathSystem?.manager) {
      globalThis._editorScope.ghostPathSystem.manager.addEventListener(
        "ghostPathsVisibilityChanged",
        (event) => {
          this.updateGhostVisibilityButton();
        }
      );

      // Initialize button state based on current visibility
      globalThis._editorScope.ghostPathSystem.manager.addEventListener(
        "ghostDataLoaded",
        (ghostData) => {
          this.updateGhostVisibilityButton();
        }
      );
    }
  }

  /**
   * Update the ghost visibility button icon based on current state
   * @param {boolean} isVisible - Whether ghosts are currently visible
   */
  updateGhostVisibilityButton() {
    const isVisible =
      globalThis._editorScope.ghostPathSystem.renderer.getVisible();
    const ghostButton = document.querySelector(
      "#toolbar-ghostVisibilityToggle"
    );
    if (ghostButton) {
      if (isVisible) {
        ghostButton.classList.add("active");
        ghostButton.innerHTML = iconList.GhostPaths;
      } else {
        ghostButton.classList.remove("active");
        ghostButton.innerHTML = iconList.GhostPathsOff;
      }
    }
  }

  setupEventBlocking() {
    // Block the same events that the inspector blocks to prevent interference with scene
    ["mousedown", "click", "contextmenu"].forEach((eventType) => {
      this.toolbar.addEventListener(eventType, (e) => {
        e.stopPropagation();
      });
    });

    const clickEvent = (e) => {
      if (!this.toolbar.contains(e.target)) {
        this.hideTooltip();
      }
    };

    // Hide tooltips when clicking outside the toolbar
    document.addEventListener("click", clickEvent);

    this.boundEvents.set("click", [
      ...(this.boundEvents.get("click") ?? []),
      clickEvent,
    ]);

    // Hide tooltips on escape key
    const keydownEvent = (e) => {
      if (e.key === "Escape") {
        this.hideTooltip();
      }
      if (e.key === "Tab") {
        if (this.selectionManager) {
          const focusedButton = document.activeElement;
          if (
            focusedButton &&
            focusedButton.attributes.getNamedItem("data-transform-tool") &&
            focusedButton.classList.contains("toolbar-button")
          ) {
            focusedButton.blur();
          } else if (focusedButton.classList.contains("toolbar-button")) {
            e.stopPropagation();
          }
        }
      }
    };
    document.addEventListener("keydown", keydownEvent);
    this.boundEvents.set("keydown", [
      ...(this.boundEvents.get("keydown") ?? []),
      keydownEvent,
    ]);
  }

  setupTooltipHandlers(button) {
    button.addEventListener("mouseenter", (e) => {
      if (!button.classList.contains("disabled")) {
        // Cancel any pending hide timeout
        if (this.tooltipHideTimeout) {
          clearTimeout(this.tooltipHideTimeout);
          this.tooltipHideTimeout = null;
        }
        this.showTooltip(button, button.dataset.tooltip);
      }
    });

    button.addEventListener("mouseleave", () => {
      this.hideTooltipDelayed();
    });

    // Hide tooltip on click
    button.addEventListener("click", () => {
      this.hideTooltip();
    });
  }

  showTooltip(button, text) {
    // Cancel any pending hide timeout
    if (this.tooltipHideTimeout) {
      clearTimeout(this.tooltipHideTimeout);
      this.tooltipHideTimeout = null;
    }

    if (!this.tooltip) return; // Safety check

    // Update tooltip content
    const contentElement = this.tooltip.querySelector(".tooltip-content");
    contentElement.textContent = text;

    // Position tooltip under the button
    const buttonRect = button.getBoundingClientRect();

    // Show tooltip temporarily to get its dimensions
    this.tooltip.style.visibility = "hidden";
    this.tooltip.style.opacity = "1";
    const tooltipRect = this.tooltip.getBoundingClientRect();
    this.tooltip.style.visibility = "visible";
    this.tooltip.style.opacity = "";

    // Calculate horizontal position (centered under button)
    let left = buttonRect.left + buttonRect.width / 2 - tooltipRect.width / 2;

    // Ensure tooltip doesn't go off screen
    const padding = 8;
    const maxLeft = window.innerWidth - tooltipRect.width - padding;
    const minLeft = padding;
    left = Math.max(minLeft, Math.min(left, maxLeft));

    // Calculate arrow offset if tooltip had to be repositioned
    const arrowOffset =
      buttonRect.left + buttonRect.width / 2 - (left + tooltipRect.width / 2);
    const arrow = this.tooltip.querySelector(".tooltip-arrow");
    if (Math.abs(arrowOffset) > 10) {
      arrow.style.left = `${50 + (arrowOffset / tooltipRect.width) * 100}%`;
    } else {
      arrow.style.left = "50%"; // Reset to center
    }

    const top = buttonRect.bottom + 8;

    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;

    // Show with animation
    this.tooltip.classList.add("show");
  }

  hideTooltipDelayed() {
    // Add a small delay before hiding to prevent flicker when moving between buttons
    this.tooltipHideTimeout = setTimeout(() => {
      this.hideTooltip();
      this.tooltipHideTimeout = null;
    }, 50);
  }

  hideTooltip() {
    // Cancel any pending hide timeout
    if (this.tooltipHideTimeout) {
      clearTimeout(this.tooltipHideTimeout);
      this.tooltipHideTimeout = null;
    }

    if (this.tooltip) {
      this.tooltip.classList.remove("show");
    }
  }

  show() {
    this.isVisible = true;
    if (this.toolbar) {
      this.toolbar.classList.remove("hidden");
    }
  }

  hide() {
    this.isVisible = false;
    this.hideTooltip(); // Hide any active tooltip when toolbar is hidden
    if (this.toolbar) {
      this.toolbar.classList.add("hidden");
    }
  }

  applyStyles() {
    if (!document.querySelector("#toolbar-styles")) {
      const style = document.createElement("style");
      style.id = "toolbar-styles";
      style.textContent = `
        .editor-toolbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 48px;
          background: ${Theme.sidebarBackground};
          border-bottom: 1px solid ${Theme.borderPrimary};
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          z-index: 1001;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          transition: all 0.3s ease;
          user-select: none;
        }

        .editor-toolbar.inspector-open {
          right: 0;
        }

        .editor-toolbar.hidden {
          transform: translateY(-100%);
        }

        .toolbar-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .toolbar-section-right {
          margin-left: auto;
        }

        .toolbar-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .toolbar-button {
          width: 32px;
          height: 32px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 4px;
          color: ${Theme.textSecondary};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          position: relative;
          padding: 0;
        }

        .toolbar-button svg {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }

        .toolbar-button:hover:not(.disabled) {
          background: ${Theme.componentHoverBackground};
          border-color: ${Theme.borderSecondary};
          color: ${Theme.textPrimary};
          transform: translateY(-1px);
        }

        .toolbar-button.active {
          background: ${Theme.primary};
          border-color: ${Theme.primary};
          color: ${Theme.textPrimary};
        }

        .toolbar-button.active:hover {
          background: ${Theme.primaryHover};
          border-color: ${Theme.primaryHover};
        }

        .toolbar-button.disabled {
          color: ${Theme.textMuted};
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        .toolbar-button.error {
          color: #ff6b6b;
        }
        
        .toolbar-button.error:hover {
          color: #ff8787;
        }

        .toolbar-button.warning {
          color: #ffa500;
        }
        
        .toolbar-button.warning:hover {
          color: #ffb347;
        }

        .toolbar-button.disabled:hover {
          background: transparent;
          border-color: transparent;
          transform: none;
        }

        .toolbar-button.unsaved-changes {
          border-color: ${Theme.warning};
          background: rgba(255, 165, 0, 0.1);
        }

        .toolbar-button.unsaved-changes:hover {
          border-color: ${Theme.warning};
          background: rgba(255, 165, 0, 0.2);
        }

        .toolbar-divider {
          width: 1px;
          height: 24px;
          margin: 0 8px;
          opacity: 0.3;
        }

        .toolbar-divider svg {
          width: 1px;
          height: 24px;
          fill: ${Theme.borderSecondary};
        }

        /* Split button for Play */
        .toolbar-split-button {
          position: relative;
          display: inline-flex;
          align-items: stretch;
          height: 32px;
        }

        .toolbar-split-button .toolbar-button.split-main {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-right-color: ${Theme.borderDisabled};
          width: 24px;
        }

        .toolbar-split-button .toolbar-button.split-main:hover {
          border-right-color: ${Theme.borderSecondary};
        }

        .toolbar-split-button .toolbar-button.split-arrow {
          width: 17px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }

        .toolbar-split-button .toolbar-button.split-arrow svg {
          width: 16px;
          height: 16px;
        }

        .toolbar-split-button .toolbar-button:hover:not(.disabled) {
          z-index: 1; /* ensure hover border sits above the neighbor */
        }

        .toolbar-dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          background: ${Theme.sidebarBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 6px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.35);
          padding: 6px;
          display: none;
          min-width: 220px;
          z-index: 1102;
        }

        .toolbar-split-button.open .toolbar-dropdown-menu {
          display: block;
        }

        .toolbar-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          background: transparent;
          border: none;
          color: ${Theme.textSecondary};
          padding: 8px 10px;
          cursor: pointer;
          border-radius: 4px;
          text-align: left;
        }

        .toolbar-dropdown-item:hover {
          background: ${Theme.componentHoverBackground};
          color: ${Theme.textPrimary};
        }

        .toolbar-dropdown-item svg {
          width: 18px;
          height: 18px;
        }

        .toolbar-dropdown-item .label {
          flex: 1;
          font-size: 13px;
        }

        /* Custom tooltip system */
        .toolbar-tooltip {
          position: absolute;
          background: ${Theme.tooltipBackground};
          color: ${Theme.textPrimary};
          border-radius: 4px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-4px);
          transition: all 0.2s ease;
          pointer-events: none;
          z-index: 3500;
          border: 1px solid ${Theme.borderSecondary};
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          overflow: visible;
        }

        .toolbar-tooltip.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .tooltip-arrow {
          position: absolute;
          top: -7px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid ${Theme.borderSecondary};
          transition: left 0.2s ease;
        }

        .tooltip-arrow::before {
          content: '';
          position: absolute;
          top: 1px;
          left: -6px;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid ${Theme.tooltipBackground};
        }

        .tooltip-content {
          padding: 8px 12px;
        }

        /* Remove old tooltip styles */
        .toolbar-button::after {
          display: none;
        }

        /* Focus styles for accessibility */
        .toolbar-button:focus:not(.disabled) {
          outline: 1px solid ${Theme.primary};
          outline-offset: 1px;
        }

        /* Animation for state changes */
        .toolbar-button {
          animation: none;
        }

        .toolbar-button.active {
          animation: toolActivated 0.3s ease;
        }

        @keyframes toolActivated {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        /* Responsive design for smaller screens */
        @media (max-width: 768px) {
          .editor-toolbar {
            padding: 0 8px;
          }
          
          .toolbar-group {
            gap: 2px;
          }
          
          .toolbar-button {
            width: 28px;
            height: 28px;
          }
          
          .toolbar-button svg {
            width: 16px;
            height: 16px;
          }

          .toolbar-split-button {
            height: 28px;
          }
          .toolbar-split-button .toolbar-button.split-arrow {
            width: 24px;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .toolbar-button {
            border-color: ${Theme.borderSecondary};
          }
          
          .toolbar-button:hover:not(.disabled) {
            border-color: ${Theme.textPrimary};
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .toolbar-button,
          .editor-toolbar {
            transition: none;
          }
          
          .toolbar-button:hover:not(.disabled) {
            transform: none;
          }
          
          .toolbar-button::after {
            transition: none;
          }
          
          .toolbar-button.active {
            animation: none;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  destroy() {
    this.boundEvents.forEach((events, eventType) => {
      events.forEach((event) => {
        document.removeEventListener(eventType, event);
      });
    });
    this.boundEvents.clear();

    // Clean up any active tooltip and timeout
    if (this.tooltipHideTimeout) {
      clearTimeout(this.tooltipHideTimeout);
      this.tooltipHideTimeout = null;
    }

    // Remove the reusable tooltip element
    if (this.tooltip && this.tooltip.parentNode) {
      this.tooltip.parentNode.removeChild(this.tooltip);
      this.tooltip = null;
    }

    if (this.toolbar) {
      this.toolbar.remove();
    }

    const styles = document.querySelector("#toolbar-styles");
    if (styles) {
      styles.remove();
    }
  }
}

// Singleton instance
let toolbarInstance = null;

export function initializeToolbar(container = document.body) {
  if (!toolbarInstance) {
    toolbarInstance = new Toolbar(container);
  }
  return toolbarInstance;
}

export function getToolbar() {
  return toolbarInstance;
}

export function destroyToolbar() {
  if (toolbarInstance) {
    toolbarInstance.destroy();
    toolbarInstance = null;
  }
}
