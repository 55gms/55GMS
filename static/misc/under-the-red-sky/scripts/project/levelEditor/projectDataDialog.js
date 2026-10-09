// Project Data Dialog for Level Editor
// Manages project data, levels, and provides level switching functionality

import { Theme } from "./inspectorUI.js";

// Events that must never reach the editor scene from dialog chrome. Shared by
// the backdrop and the level card menu (which lives on document.body, outside
// the backdrop).
const SCENE_EVENTS = [
  "mousedown",
  "mouseup",
  "mousemove",
  "click",
  "contextmenu",
  "wheel",
  "keydown",
  "keypress",
  "touchstart",
  "touchend",
  "touchmove",
];
function blockSceneEvents(element) {
  for (const eventType of SCENE_EVENTS) {
    element.addEventListener(eventType, (e) => e.stopPropagation(), {
      passive: false,
    });
  }
}

// Template role icons (gear = level settings, cube = objects). Shared by the
// card footer marking and the ⋯ menu so both always show the same glyphs.
const TEMPLATE_ICONS = { settings: Settings, objects: Cube };
import {
  Save,
  NewProject,
  Open,
  SaveAs,
  ManageCustomStructure,
  Shapes,
  Box,
  SteamLogo,
  Door,
  Close,
  DotsVertical,
  Pencil,
  Duplicate,
  Delete,
  Settings,
  Cube,
  Home,
  GlobeOff,
  Bug,
} from "./iconList.js";
import { validateAllLevels } from "./validation/projectValidator.js";
import { showMaterialsDialog } from "./materials/materialsDialog.js";
import { showConfirmDialog } from "./confirmDialog.js";
import { showSaveChangesDialog } from "./saveChangesDialog.js";
import { MANUAL_URL } from "./globalValues.js";
import { PROJECT_DIFFICULTIES, PROJECT_PLAYLISTS } from "./defaultLevelData.js";
import {
  createDifficultySelector,
  applyDifficultySelectorStyles,
} from "./difficultySelector.js";

export class ProjectDataDialog {
  constructor(container = document.body) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.dialog = null;
    this.backdrop = null;
    this.isVisible = false;
    this.projectManager = null;
    this.currentProject = null;

    this.applyStyles();
  }

  show() {
    if (this.isVisible) {
      return;
    }

    this.projectManager = globalThis._editorScope?.projectManager;
    if (!this.projectManager || !this.projectManager.hasProjectLoaded()) {
      console.warn("[ProjectDataDialog] No project loaded");
      return;
    }

    this.currentProject = this.projectManager.currentProject;
    this.createDialog();
    this.isVisible = true;
    // Layout is only measurable once the dialog is in the DOM.
    requestAnimationFrame(() => this.scrollLevelIntoView(null, false));

    // Hide tooltip if toolbar is available
    if (globalThis._editorScope?.toolbar) {
      globalThis._editorScope.toolbar.hideTooltip();
    }
  }

  hide() {
    if (!this.isVisible) {
      return;
    }

    this.closeLevelMenu();
    if (this.backdrop) {
      this.backdrop.classList.remove("visible");
    }
    if (this.dialog) {
      this.dialog.classList.remove("visible");
    }

    // Remove elements after animation
    setTimeout(() => {
      if (this.backdrop && this.backdrop.parentNode) {
        this.backdrop.parentNode.removeChild(this.backdrop);
      }
      this.backdrop = null;
      this.dialog = null;
    }, 300);

    this.isVisible = false;
  }

  createDialog() {
    // Create backdrop
    this.backdrop = document.createElement("div");
    this.backdrop.className = "project-data-dialog-backdrop";
    this.backdrop.addEventListener("click", (e) => {
      if (e.target === this.backdrop) {
        this.hide();
      }
    });
    // Block events on backdrop so they don't reach the editor underneath
    blockSceneEvents(this.backdrop);

    // Create main dialog
    this.dialog = document.createElement("div");
    this.dialog.className = "project-data-dialog";

    // Create header
    this.createHeader();

    // Create content
    this.createContent();

    // Create footer
    this.createFooter();

    // Add to backdrop and container
    this.backdrop.appendChild(this.dialog);
    this.container.appendChild(this.backdrop);

    // Setup event handlers
    this.setupEventHandlers();

    // Animate in
    setTimeout(() => {
      this.backdrop.classList.add("visible");
      this.dialog.classList.add("visible");
    }, 10);
  }

  createHeader() {
    const header = document.createElement("div");
    header.className = "dialog-header";

    const title = document.createElement("h2");
    title.className = "dialog-title";
    title.textContent = "Project";

    const closeButton = document.createElement("button");
    closeButton.className = "dialog-close";
    closeButton.innerHTML = "✕";
    closeButton.addEventListener("click", () => this.hide());

    header.appendChild(title);
    header.appendChild(closeButton);
    this.dialog.appendChild(header);
  }

  createContent() {
    const content = document.createElement("div");
    content.className = "dialog-content";

    // Project actions toolbar
    this.createProjectActionsToolbar(content);

    // Project info section
    this.createProjectInfoSection(content);

    // Levels management section
    this.createLevelsSection(content);

    this.dialog.appendChild(content);
  }

  createProjectActionsToolbar(parent) {
    const toolbar = document.createElement("div");
    toolbar.className = "project-actions-toolbar";

    // New project button
    const newButton = document.createElement("button");
    newButton.className = "toolbar-action-button";
    newButton.innerHTML = `${NewProject} New Project`;
    newButton.addEventListener("click", () => this.createNewProject());

    // Open project button
    const openButton = document.createElement("button");
    openButton.className = "toolbar-action-button";
    openButton.innerHTML = `${Open} Open`;
    openButton.addEventListener("click", () => this.openProject());

    // Save project button
    const saveButton = document.createElement("button");
    saveButton.className = "toolbar-action-button";
    saveButton.innerHTML = `${Save} Save`;
    saveButton.addEventListener("click", () => this.exportProject(false));

    // Save as button
    const saveAsButton = document.createElement("button");
    saveAsButton.className = "toolbar-action-button";
    saveAsButton.innerHTML = `${SaveAs} Save As`;
    saveAsButton.addEventListener("click", () => this.exportProject(true));

    const spacer = document.createElement("div");
    spacer.style.flex = "1";

    // Close project button
    const closeButton = document.createElement("button");
    closeButton.className =
      "toolbar-action-button toolbar-action-button-danger";
    closeButton.innerHTML = `${Close} Close Project`;
    closeButton.addEventListener("click", () => this.closeProject());

    // Close editor button
    const closeEditorButton = document.createElement("button");
    closeEditorButton.className =
      "toolbar-action-button toolbar-action-button-danger";
    closeEditorButton.innerHTML = `${Door} Exit Editor`;
    closeEditorButton.addEventListener("click", () => this.closeEditor());

    toolbar.appendChild(newButton);
    toolbar.appendChild(openButton);
    toolbar.appendChild(saveButton);
    toolbar.appendChild(saveAsButton);
    toolbar.appendChild(spacer);
    toolbar.appendChild(closeButton);
    toolbar.appendChild(closeEditorButton);
    parent.appendChild(toolbar);
  }

  createProjectInfoSection(parent) {
    const section = document.createElement("div");
    section.className = "project-section";

    const header = document.createElement("div");
    header.className = "section-header";

    const title = document.createElement("h3");
    title.className = "section-title";
    title.textContent = "Project Information";

    const workshopButton = document.createElement("button");
    workshopButton.className = "add-level-button";
    workshopButton.innerHTML = `${SteamLogo} Workshop`;
    workshopButton.addEventListener("click", () => this.openSteamWorkshop());

    header.appendChild(title);
    header.appendChild(workshopButton);

    const infoGrid = document.createElement("div");
    infoGrid.className = "project-info-grid";

    // Left column: Project settings
    const leftColumn = document.createElement("div");
    leftColumn.className = "info-column";

    // Project name
    const nameGroup = document.createElement("div");
    nameGroup.className = "info-group";

    const nameLabel = document.createElement("label");
    nameLabel.className = "info-label";
    nameLabel.textContent = "Name";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "info-input";
    nameInput.value = this.currentProject.projectName;
    nameInput.addEventListener("input", () => {
      this.currentProject.projectName = nameInput.value;
      this.projectManager.updateLastModified();
    });

    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);

    // Project difficulty selection using component
    const currentDifficulty =
      this.currentProject.sharedData?.projectDifficulty !== undefined
        ? this.currentProject.sharedData.projectDifficulty
        : 5;

    const difficultySelector = createDifficultySelector({
      currentValue: currentDifficulty,
      onChange: (value) => {
        if (!this.currentProject.sharedData) {
          this.currentProject.sharedData = {};
        }
        this.currentProject.sharedData.projectDifficulty = value;
        this.projectManager.updateLastModified();
        this.projectManager.markAsUnsaved();
      },
      disabled: false,
    });

    // Project playlist selection
    const playlistGroup = document.createElement("div");
    playlistGroup.className = "info-group-flat";

    const playlistLabel = document.createElement("label");
    playlistLabel.className = "info-label";
    playlistLabel.textContent = "Playlist";

    const playlistSelect = document.createElement("select");
    playlistSelect.className = "info-select";

    PROJECT_PLAYLISTS.forEach((playlist) => {
      const option = document.createElement("option");
      option.value = playlist.key;
      option.textContent = playlist.label;
      playlistSelect.appendChild(option);
    });

    // Set current value or default
    const currentPlaylist =
      this.currentProject.sharedData?.projectPlaylist ||
      PROJECT_PLAYLISTS[0].key;
    playlistSelect.value = currentPlaylist;

    playlistSelect.addEventListener("change", () => {
      if (!this.currentProject.sharedData) {
        this.currentProject.sharedData = {};
      }
      this.currentProject.sharedData.projectPlaylist = playlistSelect.value;
      this.projectManager.updateLastModified();
      this.projectManager.markAsUnsaved();
    });

    playlistGroup.appendChild(playlistLabel);
    playlistGroup.appendChild(playlistSelect);

    // Add all left column elements
    leftColumn.appendChild(nameGroup);
    leftColumn.appendChild(difficultySelector);
    leftColumn.appendChild(playlistGroup);

    // Right column: Resources
    const rightColumn = document.createElement("div");
    rightColumn.className = "info-column";

    // Project resources
    const resourcesGroup = document.createElement("div");
    resourcesGroup.className = "info-group resources-group";

    const resourcesLabel = document.createElement("label");
    resourcesLabel.className = "info-label";
    resourcesLabel.textContent = "Resources";

    const resourcesContainer = document.createElement("div");
    resourcesContainer.className = "resources-container";

    // Custom structures button
    const structuresButton = document.createElement("button");
    structuresButton.className = "resource-mini-button";
    structuresButton.innerHTML = `${ManageCustomStructure} Structures`;
    structuresButton.title = "Manage custom structures";
    structuresButton.addEventListener("click", () =>
      this.openCustomStructures()
    );

    // Color palette button
    const colorPaletteButton = document.createElement("button");
    colorPaletteButton.className = "resource-mini-button";
    colorPaletteButton.innerHTML = `${Shapes} Colors`;
    colorPaletteButton.title = "Manage color palette";
    colorPaletteButton.addEventListener("click", () => this.openColorPalette());

    // Materials sits where the manual used to be; the manual will find a new
    // home later.
    const materialsButton = document.createElement("button");
    materialsButton.className = "resource-mini-button";
    materialsButton.innerHTML = `${Box} Materials`;
    materialsButton.title = "Manage custom materials";
    materialsButton.addEventListener("click", () => this.openMaterials());

    resourcesContainer.appendChild(structuresButton);
    resourcesContainer.appendChild(colorPaletteButton);
    resourcesContainer.appendChild(materialsButton);

    resourcesGroup.appendChild(resourcesLabel);
    resourcesGroup.appendChild(resourcesContainer);

    // Add resources to right column
    rightColumn.appendChild(resourcesGroup);

    // Add columns to grid
    infoGrid.appendChild(leftColumn);
    infoGrid.appendChild(rightColumn);

    section.appendChild(header);
    section.appendChild(infoGrid);
    parent.appendChild(section);
  }

  createLevelsSection(parent) {
    const section = document.createElement("div");
    section.className = "project-section";

    const header = document.createElement("div");
    header.className = "section-header";

    const title = document.createElement("h3");
    title.className = "section-title";
    title.textContent = "Levels";

    const addButton = document.createElement("button");
    addButton.className = "add-level-button";
    addButton.innerHTML = "+ Add Level";
    addButton.addEventListener("click", () => this.showAddLevelDialog());

    header.appendChild(title);
    header.appendChild(addButton);

    const levelsList = document.createElement("div");
    levelsList.className = "levels-list";
    levelsList.id = "levelsList";

    this.populateLevelsList(levelsList);

    section.appendChild(header);
    section.appendChild(levelsList);
    parent.appendChild(section);
  }

  populateLevelsList(container) {
    container.innerHTML = "";

    // Add drag and drop events to container
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      // Handle dropping in empty space (move to end)
      if (this.draggedElement && e.target === container) {
        // Move dragged element to the end
        //container.appendChild(this.draggedElement);
      }
    });

    container.addEventListener("drop", (e) => {
      e.preventDefault();

      // Handle drop on container (empty space)
      if (this.draggedElement) {
        // Finalize the position - update the project data to match current DOM order
        this.finalizeCardOrder();
      }
    });

    const levels = this.currentProject.levels;
    const currentLevelId = this.currentProject.currentLevelId;

    // One validation pass for the whole list (the issue badge on each card).
    let validation = null;
    try {
      validation = validateAllLevels();
    } catch (error) {
      console.warn("[ProjectDataDialog] Validation for level cards failed:", error);
    }

    Object.entries(levels).forEach(([levelId, levelData], index) => {
      const levelItem = this.createLevelItem(
        levelId,
        levelData,
        levelId === currentLevelId,
        index + 1,
        validation
      );
      container.appendChild(levelItem);
    });
  }

  createLevelItem(levelId, levelData, isCurrent, orderNumber = 0, validation = null) {
    const card = document.createElement("div");
    card.className = `level-card ${isCurrent ? "current" : ""}`;
    card.dataset.levelId = levelId;
    card.draggable = true;

    // ---- Top bar: reorder hardware left; status glyphs + menu (⋯) right ----
    const bar = document.createElement("div");
    bar.className = "level-card-bar";

    const reorder = document.createElement("div");
    reorder.className = "level-tile-group";

    const dragHandle = document.createElement("div");
    dragHandle.className = "level-tile level-drag-handle";
    dragHandle.title = "Drag to reorder";
    dragHandle.textContent = "⋮⋮";
    reorder.appendChild(dragHandle);

    const leftArrow = document.createElement("button");
    leftArrow.className = "level-tile level-arrow-button";
    leftArrow.innerHTML = "‹";
    leftArrow.title = "Move left";
    leftArrow.addEventListener("click", (e) => {
      e.stopPropagation();
      this.moveLevelLeft(levelId);
    });
    reorder.appendChild(leftArrow);

    const rightArrow = document.createElement("button");
    rightArrow.className = "level-tile level-arrow-button";
    rightArrow.innerHTML = "›";
    rightArrow.title = "Move right";
    rightArrow.addEventListener("click", (e) => {
      e.stopPropagation();
      this.moveLevelRight(levelId);
    });
    reorder.appendChild(rightArrow);
    bar.appendChild(reorder);

    const barRight = document.createElement("div");
    barRight.className = "level-card-bar-right";

    // Status glyphs (hub / offline) then template roles; each names itself
    // through a native tooltip.
    const glyphs = [];
    const addGlyph = (markup, title) => {
      const span = document.createElement("span");
      span.className = "level-glyph";
      span.title = title;
      span.innerHTML = markup;
      glyphs.push(span);
    };
    if (levelData.levelData?.isHub) addGlyph(Home, "Hub level");
    if (levelData.levelData?.isOnline === false) addGlyph(GlobeOff, "Offline only");
    const roles = this.projectManager.getLevelTemplateRoles(levelId);
    if (roles.settings) addGlyph(TEMPLATE_ICONS.settings, "Template: level settings");
    if (roles.objects) addGlyph(TEMPLATE_ICONS.objects, "Template: objects");
    if (glyphs.length) {
      const glyphRow = document.createElement("span");
      glyphRow.className = "level-glyphs";
      glyphs.forEach((g) => glyphRow.appendChild(g));
      barRight.appendChild(glyphRow);
    }

    // Card menu (⋯): Rename / Duplicate / Template / Delete
    const menuButton = document.createElement("button");
    menuButton.className = "level-menu-button";
    menuButton.title = "Level actions";
    menuButton.innerHTML = DotsVertical;
    menuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.levelMenu?.anchor === menuButton) {
        this.closeLevelMenu();
        return;
      }
      this.openLevelMenu(levelId, levelData, menuButton);
    });
    barRight.appendChild(menuButton);
    bar.appendChild(barRight);
    card.appendChild(bar);
    card.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.openLevelMenu(levelId, levelData, menuButton, e);
    });

    // Pack-order number as a watermark (out of flow, very dim).
    const number = document.createElement("span");
    number.className = "level-card-number";
    number.textContent = String(orderNumber).padStart(2, "0");
    number.setAttribute("aria-hidden", "true");
    card.appendChild(number);

    // ---- Body ----
    const content = document.createElement("div");
    content.className = "level-card-content";

    // Editable name container
    const nameContainer = document.createElement("div");
    nameContainer.className = "level-name-container";

    const name = document.createElement("div");
    name.className = "level-name";
    name.textContent = levelData.levelData?.levelName;

    const editButton = document.createElement("button");
    editButton.className = "level-edit-button";
    editButton.innerHTML = "✎";
    editButton.style.display = "none";
    editButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.startLevelNameEdit(levelId, nameContainer);
    });

    nameContainer.appendChild(name);
    nameContainer.appendChild(editButton);

    // Show edit button on hover (not while the name is being edited)
    nameContainer.addEventListener("mouseenter", () => {
      if (!nameContainer.classList.contains("editing")) {
        editButton.style.display = "flex";
      }
    });
    nameContainer.addEventListener("mouseleave", () => {
      if (!nameContainer.classList.contains("editing")) {
        editButton.style.display = "none";
      }
    });

    // Add double-click to edit functionality
    nameContainer.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      this.startLevelNameEdit(levelId, nameContainer);
    });

    // Object count, then size (muted)
    const meta = document.createElement("div");
    meta.className = "level-meta";
    meta.textContent = `${levelData.instances?.length || 0} objects`;

    const size = document.createElement("div");
    size.className = "level-size";
    const ls = levelData.levelData?.levelSize;
    size.textContent =
      ls && Number.isFinite(ls.width) && Number.isFinite(ls.height)
        ? `${Math.round(ls.width)} × ${Math.round(ls.height)}`
        : "";

    // Open / Current, with the validator's result fused on as a segment:
    // warning count on yellow, error (blocks Play) as the bug alone on red.
    const actionGroup = document.createElement("div");
    actionGroup.className = "level-action-group";

    if (isCurrent) {
      const currentIndicator = document.createElement("div");
      currentIndicator.className = "current-indicator";
      currentIndicator.textContent = "Current";
      actionGroup.appendChild(currentIndicator);
    } else {
      const switchButton = document.createElement("button");
      switchButton.className = "level-switch-button";
      switchButton.textContent = "Open";
      switchButton.addEventListener("click", (e) => {
        e.stopPropagation();
        this.switchToLevel(levelId);
      });
      actionGroup.appendChild(switchButton);
    }

    const levelValidation = validation?.levels?.[levelId];
    const errorCount = levelValidation?.errors?.length || 0;
    const warningCount = levelValidation?.warnings?.length || 0;
    if (errorCount > 0 || warningCount > 0) {
      const segment = document.createElement("button");
      segment.className =
        "level-issue-segment" + (errorCount > 0 ? " error" : "");
      const parts = [];
      if (errorCount) parts.push(`${errorCount} error${errorCount > 1 ? "s" : ""}`);
      if (warningCount) parts.push(`${warningCount} warning${warningCount > 1 ? "s" : ""}`);
      segment.title = parts.join(", ") + (errorCount ? " — fix before playing" : "");
      segment.innerHTML = Bug + (errorCount > 0 ? "" : `<span>${warningCount}</span>`);
      segment.addEventListener("click", (e) => {
        e.stopPropagation();
        const dialog = globalThis._editorScope?.validationDialog;
        if (dialog) dialog.show(levelId, validation);
      });
      actionGroup.appendChild(segment);
    }

    content.appendChild(nameContainer);
    content.appendChild(meta);
    if (size.textContent) content.appendChild(size);
    content.appendChild(actionGroup);
    card.appendChild(content);

    // Drag and drop event handlers
    this.setupDragAndDrop(card, levelId);

    return card;
  }

  finalizeCardOrder() {
    // Get current DOM order and update project data to match
    const container = document.getElementById("levelsList");
    const cards = Array.from(container.querySelectorAll(".level-card"));
    const newOrder = cards.map((card) => card.dataset.levelId);

    // Update project data to match the new order
    const newLevels = {};
    newOrder.forEach((levelId) => {
      newLevels[levelId] = this.currentProject.levels[levelId];
    });

    this.currentProject.levels = newLevels;
    this.projectManager.markAsUnsaved();

    // Drag reorder moves the existing cards instead of re-rendering, so the
    // pack-order watermarks have to be renumbered by hand.
    this.renumberCards(container);

    console.log("[ProjectDataDialog] Finalized card order:", newOrder);
  }

  /** Rewrite each card's pack-order number to match its position in the list. */
  renumberCards(container = this.dialog?.querySelector("#levelsList")) {
    if (!container) return;
    container.querySelectorAll(".level-card").forEach((card, index) => {
      const number = card.querySelector(".level-card-number");
      if (number) number.textContent = String(index + 1).padStart(2, "0");
    });
  }

  refreshLevelName(levelId) {
    const levelItem = document.querySelector(`[data-level-id="${levelId}"]`);
    if (levelItem) {
      const nameElement = levelItem.querySelector(".level-name");
      if (nameElement) {
        nameElement.textContent =
          this.currentProject.levels[levelId].levelData.levelName;
      }
    }
  }

  setupDragAndDrop(card, levelId) {
    this.draggedElement = null;

    card.addEventListener("dragstart", (e) => {
      this.draggedElement = card;
      card.classList.add("dragging");

      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", card.outerHTML);

      // Add visual feedback - keep card visible but tilted
      requestAnimationFrame(() => {
        card.style.opacity = "0.8";
      });
    });

    card.addEventListener("dragend", (e) => {
      card.classList.remove("dragging");
      card.style.opacity = "";

      // dragover already moved the card in the DOM; a release that lands on
      // the dragged card itself or outside the list fires no "drop", so sync
      // the project order + watermark numbers here too (idempotent).
      if (this.draggedElement) this.finalizeCardOrder();

      this.draggedElement = null;
      this.cleanupDragClasses();
    });

    card.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      if (this.draggedElement && this.draggedElement !== card) {
        const container = card.parentNode;
        const rect = card.getBoundingClientRect();
        const midpoint = rect.left + rect.width / 2;

        let targetPosition = null;

        if (e.clientX < midpoint) {
          // Insert before this card
          targetPosition = card;
        } else {
          // Insert after this card
          targetPosition = card.nextSibling;
        }

        // Check if this would place the dragged element in the same position
        const draggedCurrentPosition = this.draggedElement.nextSibling;
        const wouldBeSamePosition =
          targetPosition === this.draggedElement ||
          targetPosition === draggedCurrentPosition;

        // Don't move if it would be the same position
        if (!wouldBeSamePosition) {
          // Move the dragged card to the target position immediately
          if (targetPosition) {
            container.insertBefore(this.draggedElement, targetPosition);
          } else {
            container.appendChild(this.draggedElement);
          }
        }
      }
    });

    card.addEventListener("drop", (e) => {
      e.preventDefault();

      if (this.draggedElement && this.draggedElement !== card) {
        // Finalize the position - update the project data to match current DOM order
        this.finalizeCardOrder();
      }
    });
  }

  getDragAfterElement(container, x) {
    const draggableElements = [
      ...container.querySelectorAll(".level-card:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  cleanupDragClasses() {
    const container = document.getElementById("levelsList");
    if (container) {
      container.querySelectorAll(".level-card").forEach((card) => {
        card.classList.remove("drag-over");
      });
    }
  }

  moveLevelLeft(levelId) {
    const levels = Object.keys(this.currentProject.levels);
    const currentIndex = levels.indexOf(levelId);

    if (currentIndex > 0) {
      const newOrder = [...levels];
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [
        newOrder[currentIndex - 1],
        newOrder[currentIndex],
      ];
      this.applyLevelOrderWithAnimation(newOrder);
    }
  }

  moveLevelRight(levelId) {
    const levels = Object.keys(this.currentProject.levels);
    const currentIndex = levels.indexOf(levelId);

    if (currentIndex < levels.length - 1) {
      const newOrder = [...levels];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [
        newOrder[currentIndex + 1],
        newOrder[currentIndex],
      ];
      this.applyLevelOrderWithAnimation(newOrder);
    }
  }

  reorderLevel(draggedLevelId, targetLevelId, insertAfter) {
    const levels = Object.keys(this.currentProject.levels);
    const draggedIndex = levels.indexOf(draggedLevelId);
    const targetIndex = levels.indexOf(targetLevelId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrder = [...levels];
    newOrder.splice(draggedIndex, 1);

    const newTargetIndex = newOrder.indexOf(targetLevelId);
    const insertIndex = insertAfter ? newTargetIndex + 1 : newTargetIndex;

    newOrder.splice(insertIndex, 0, draggedLevelId);
    this.applyLevelOrder(newOrder);
  }

  applyLevelOrder(newOrder) {
    // Reorder the levels object
    const newLevels = {};
    newOrder.forEach((levelId) => {
      newLevels[levelId] = this.currentProject.levels[levelId];
    });

    this.currentProject.levels = newLevels;
    this.projectManager.markAsUnsaved();
    this.refreshDialog();
  }

  applyLevelOrderWithAnimation(newOrder) {
    // Store current positions
    const container = document.getElementById("levelsList");
    const cards = Array.from(container.querySelectorAll(".level-card"));
    const positions = new Map();

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      positions.set(card.dataset.levelId, rect.left);
    });

    // Apply new order
    this.applyLevelOrder(newOrder);

    // Animate to new positions
    requestAnimationFrame(() => {
      const newCards = Array.from(container.querySelectorAll(".level-card"));

      newCards.forEach((card) => {
        const oldLeft = positions.get(card.dataset.levelId);
        const newLeft = card.getBoundingClientRect().left;
        const deltaX = oldLeft - newLeft;

        if (deltaX !== 0) {
          card.style.transform = `translateX(${deltaX}px)`;
          card.style.transition = "none";

          requestAnimationFrame(() => {
            card.style.transition = "transform 0.2s ease";
            card.style.transform = "";
          });
        }
      });
    });
  }

  createFooter() {
    // Footer removed - close button is no longer needed in dialog actions section
    // Users can close via the X button in the header or by clicking outside
  }

  setupEventHandlers() {
    // Prevent event bubbling
    this.dialog.addEventListener("click", (e) => e.stopPropagation());
    this.dialog.addEventListener("keydown", (e) => e.stopPropagation());

    // Handle Escape key
    this.dialog.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        this.hide();
      }
    });
  }

  switchToLevel(levelId) {
    if (this.projectManager.switchToLevel(levelId)) {
      this.refreshDialog();
      // Close the dialog after switching levels
      setTimeout(() => {
        this.hide();
      }, 100);
    }
  }

  /**
   * Open the per-level actions menu anchored to the card's ⋯ button (or at
   * the pointer for a right-click). Only one menu is open at a time.
   */
  openLevelMenu(levelId, levelData, anchor, pointerEvent = null) {
    this.closeLevelMenu();
    const levelName = levelData.levelData?.levelName;
    const canDelete = Object.keys(this.currentProject.levels).length > 1;

    const menu = document.createElement("div");
    menu.className = "level-card-menu";
    blockSceneEvents(menu);

    const addItem = (label, iconMarkup, onClick, opts = {}) => {
      const btn = document.createElement("button");
      btn.className = "level-card-menu-item" + (opts.danger ? " danger" : "");
      btn.innerHTML = `${iconMarkup}<span>${label}</span>`;
      if (opts.disabled) {
        btn.disabled = true;
        btn.title = opts.disabledReason || "";
      }
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.closeLevelMenu();
        onClick();
      });
      menu.appendChild(btn);
    };
    const addSeparator = () => {
      const sep = document.createElement("div");
      sep.className = "level-card-menu-separator";
      menu.appendChild(sep);
    };

    addItem(
      "Rename",
      Pencil,
      () => {
        const card = anchor.closest(".level-card");
        const nameContainer = card?.querySelector(".level-name-container");
        if (nameContainer) this.startLevelNameEdit(levelId, nameContainer);
      }
    );
    addItem("Duplicate", Duplicate, () => this.duplicateLevel(levelId));
    addSeparator();

    // Template slots: each is held by at most one level; ticking here moves it.
    // Check items keep the menu open; their state is re-read after each toggle.
    const checkItems = [];
    const addCheckItem = (label, iconMarkup, isChecked, onToggle) => {
      const btn = document.createElement("button");
      btn.className = "level-card-menu-item";
      btn.setAttribute("role", "menuitemcheckbox");
      btn.innerHTML = `${iconMarkup}<span>${label}</span><span class="level-card-menu-check"></span>`;
      const box = btn.querySelector(".level-card-menu-check");
      const sync = () => {
        const on = isChecked();
        btn.setAttribute("aria-checked", on ? "true" : "false");
        box.classList.toggle("checked", on);
      };
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        onToggle(!isChecked());
      });
      checkItems.push(sync);
      sync();
      menu.appendChild(btn);
    };
    const sub = document.createElement("div");
    sub.className = "level-card-menu-label";
    sub.textContent = "Template";
    menu.appendChild(sub);
    addCheckItem(
      "Level settings",
      TEMPLATE_ICONS.settings,
      () => this.projectManager.getLevelTemplateRoles(levelId).settings,
      (on) => this.setTemplateSlot("settings", levelId, on, levelName)
    );
    addCheckItem(
      "Objects",
      TEMPLATE_ICONS.objects,
      () => this.projectManager.getLevelTemplateRoles(levelId).objects,
      (on) => this.setTemplateSlot("objects", levelId, on, levelName)
    );
    addSeparator();
    addItem(
      "Delete…",
      Delete,
      () => this.showDeleteLevelDialog(levelId, levelName),
      {
        danger: true,
        disabled: !canDelete,
        disabledReason: "A project needs at least one level",
      }
    );

    // Position: below the ⋯ button, right-aligned; at the pointer on right-click.
    // Fixed positioning so the list's horizontal scroll can't clip it.
    const rect = anchor.getBoundingClientRect();
    menu.style.position = "fixed";
    menu.style.visibility = "hidden";
    document.body.appendChild(menu);
    const mw = menu.offsetWidth;
    const mh = menu.offsetHeight;
    let left = pointerEvent ? pointerEvent.clientX : rect.right - mw;
    let top = pointerEvent ? pointerEvent.clientY : rect.bottom + 2;
    left = Math.max(4, Math.min(left, window.innerWidth - mw - 4));
    if (top + mh > window.innerHeight - 4) top = Math.max(4, rect.top - mh - 2);
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.style.visibility = "";
    anchor.classList.add("open");

    const close = () => this.closeLevelMenu();
    const onPointerDown = (e) => {
      // A press on the ⋯ button is left to its click handler (which toggles).
      if (menu.contains(e.target) || this.levelMenu?.anchor?.contains(e.target)) return;
      close();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener("mousedown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("resize", close);
    this.levelMenu = {
      element: menu,
      anchor,
      levelId,
      syncChecks: () => checkItems.forEach((fn) => fn()),
      dispose: () => {
        document.removeEventListener("mousedown", onPointerDown, true);
        document.removeEventListener("keydown", onKeyDown, true);
        window.removeEventListener("resize", close);
      },
    };
  }

  setTemplateSlot(slot, levelId, on, levelName) {
    const previous = this.projectManager.setTemplateSlot(
      slot,
      on ? levelId : null
    );
    this.refreshDialog({ keepMenu: true });
    const what = slot === "objects" ? "objects" : "settings";
    const notify = globalThis._editorScope?.notifications;
    if (!notify) return;
    if (on) {
      const prevName =
        previous && previous !== levelId
          ? this.currentProject.levels[previous]?.levelData?.levelName
          : null;
      notify.info(
        `${levelName} is now the ${what} template` +
          (prevName ? ` (was ${prevName})` : ""),
        { title: "Template" }
      );
    } else {
      notify.info(`${levelName} is no longer the ${what} template`, {
        title: "Template",
      });
    }
  }

  closeLevelMenu() {
    const m = this.levelMenu;
    if (!m) return;
    m.dispose();
    m.element.remove();
    m.anchor.classList.remove("open");
    this.levelMenu = null;
  }

  /** Horizontally scroll the levels list so a level's card (default: the current level) is centered. */
  scrollLevelIntoView(levelId = null, smooth = false) {
    const container = this.dialog?.querySelector("#levelsList");
    const card = levelId
      ? container?.querySelector(`.level-card[data-level-id="${levelId}"]`)
      : container?.querySelector(".level-card.current");
    if (!container || !card) return;
    const target =
      card.offsetLeft - (container.clientWidth - card.offsetWidth) / 2;
    container.scrollTo({
      left: Math.max(0, target),
      behavior: smooth ? "smooth" : "auto",
    });
  }

  showAddLevelDialog() {
    // Generate automatic level name
    const existingLevels = Object.keys(this.currentProject.levels);
    const levelCount = existingLevels.length;
    const defaultName = `Level ${levelCount + 1}`;

    // Create new level with auto-generated name
    const newLevelId = this.projectManager.addLevel(defaultName);
    if (newLevelId) {
      this.refreshDialog();
      this.focusLevelNameEdit(newLevelId, true);
    }
  }

  duplicateLevel(levelId) {
    const newLevelId = this.projectManager.duplicateLevel(levelId);
    if (!newLevelId) return;
    this.refreshDialog();
    // Not a "new" level: escaping/blanking the rename keeps the copy.
    this.focusLevelNameEdit(newLevelId, false);
  }

  // Open the inline name editor on a freshly created card (after the list
  // re-rendered). Cards carry their level id, so no name matching is needed.
  focusLevelNameEdit(levelId, isNewLevel) {
    setTimeout(() => {
      const card = this.dialog.querySelector(
        `.level-card[data-level-id="${levelId}"]`
      );
      const nameContainer = card?.querySelector(".level-name-container");
      if (nameContainer) {
        this.scrollLevelIntoView(levelId, true);
        this.startLevelNameEdit(levelId, nameContainer, isNewLevel);
      }
    }, 100);
  }

  startLevelNameEdit(levelId, nameContainer, isNewLevel = false) {
    const nameElement = nameContainer.querySelector(".level-name");
    const editButton = nameContainer.querySelector(".level-edit-button");
    const currentName = nameElement.textContent;

    // Create input element
    const input = document.createElement("input");
    input.type = "text";
    input.className = "level-name-input";
    input.value = currentName;
    input.placeholder = isNewLevel ? "Enter level name" : "";

    // Replace name element with input
    nameContainer.replaceChild(input, nameElement);
    nameContainer.classList.add("editing");
    editButton.style.display = "none";

    // Focus and select text
    input.focus();
    if (!isNewLevel) {
      input.select();
    }

    const finishEdit = (save = true) => {
      const newName = input.value.trim();

      if (save && newName && newName !== currentName) {
        if (this.projectManager.renameLevel(levelId, newName)) {
          nameElement.textContent = newName;
        }
      } else if (isNewLevel && (!newName || !save)) {
        // Delete the level if it's new and no name provided
        this.projectManager.deleteLevel(levelId);
        this.refreshDialog();
        return;
      }

      // Restore original element
      nameElement.textContent = newName || currentName || "Untitled Level";
      nameContainer.replaceChild(nameElement, input);
      nameContainer.classList.remove("editing");
    };

    // Handle input events
    input.addEventListener("blur", () => finishEdit(true));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        finishEdit(true);
      } else if (e.key === "Escape") {
        e.preventDefault();
        finishEdit(false);
      }
      e.stopPropagation();
    });
  }

  async showDeleteLevelDialog(levelId, levelName) {
    const confirmed = await showConfirmDialog({
      title: "Delete Level",
      message: `Are you sure you want to delete the level "${levelName}"?\n\nThis action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });

    if (confirmed) {
      if (this.projectManager.deleteLevel(levelId)) {
        this.refreshDialog();
      }
    }
  }

  exportProject(saveAs = false) {
    this.projectManager.saveProjectToFile(saveAs);
    this.hide();
  }

  async openProject() {
    // Check for unsaved changes
    if (this.projectManager.getHasUnsavedChanges()) {
      const result = await showSaveChangesDialog({
        title: "Unsaved Changes",
        message: "You have unsaved changes to the current project.",
        actionDescription: "opening a new project",
      });

      if (result === "cancel") {
        return; // User cancelled
      } else if (result === "save") {
        // Save current project first
        const saved = await this.projectManager.saveProjectToFile();
        if (!saved) {
          return; // Save failed or was cancelled
        }
      }
      // If 'dontSave', continue without saving
    }

    const success = await this.projectManager.openProjectFile();
    if (success) {
      this.hide();
    } else {
      // Don't show error if user cancelled
    }
  }

  openCustomStructures() {
    const customStructuresDialog =
      globalThis._editorScope?.customStructuresManagerDialog;
    if (customStructuresDialog) {
      customStructuresDialog.show();
    }
  }

  openColorPalette() {
    const colorPaletteManager = globalThis._editorScope?.colorPaletteManager;
    if (colorPaletteManager) {
      colorPaletteManager.show();
    }
  }

  openMaterials() {
    showMaterialsDialog();
  }

  async createNewProject() {
    // Check for unsaved changes
    if (this.projectManager.getHasUnsavedChanges()) {
      const result = await showSaveChangesDialog({
        title: "Unsaved Changes",
        message: "You have unsaved changes to the current project.",
        actionDescription: "creating a new project",
      });

      if (result === "cancel") {
        return; // User cancelled
      } else if (result === "save") {
        // Save current project first
        const saved = await this.projectManager.saveProjectToFile();
        if (!saved) {
          return; // Save failed or was cancelled
        }
      }
      // If 'dontSave', continue without saving
    }

    const newProjectDialog = globalThis._editorScope?.newProjectDialog;
    if (newProjectDialog) {
      this.hide();
      newProjectDialog.show();
    }
  }

  async closeProject() {
    // Check for unsaved changes
    if (this.projectManager.getHasUnsavedChanges()) {
      const result = await showSaveChangesDialog({
        title: "Unsaved Changes",
        message: "You have unsaved changes to the current project.",
        actionDescription: "closing the project",
      });

      if (result === "cancel") {
        return; // User cancelled
      } else if (result === "save") {
        // Save current project first
        const saved = await this.projectManager.saveProjectToFile();
        if (!saved) {
          return; // Save failed or was cancelled
        }
      }
      // If 'dontSave', continue without saving
    }

    // Close the project
    this.projectManager.closeProject();

    // Hide this dialog
    this.hide();

    // Show welcome dialog
    const welcomeDialog = globalThis._editorScope?.welcomeDialog;
    if (welcomeDialog) {
      welcomeDialog.show();
    }
  }

  async closeEditor() {
    // Check for unsaved changes
    if (this.projectManager.getHasUnsavedChanges()) {
      const result = await showSaveChangesDialog({
        title: "Unsaved Changes",
        message: "You have unsaved changes to the current project.",
        actionDescription: "exiting the editor",
      });

      if (result === "cancel") {
        return; // User cancelled
      } else if (result === "save") {
        // Save current project first
        const saved = await this.projectManager.saveProjectToFile();
        if (!saved) {
          return; // Save failed or was cancelled
        }
      }
      // If 'dontSave', continue without saving
    }

    // Close the project
    this.projectManager.closeProject();

    // Hide this dialog
    this.hide();

    // Close the editor
    globalThis._editorScope.runtime.callFunction("closeEditor");
  }

  openManual() {
    window.open(MANUAL_URL, "_blank");
  }

  openSteamWorkshop() {
    const steamWorkshopDialog = globalThis._editorScope?.steamWorkshopDialog;
    if (steamWorkshopDialog) {
      // Close this dialog before opening workshop dialog
      this.hide();
      steamWorkshopDialog.show();
    }
  }

  refreshDialog({ keepMenu = false } = {}) {
    if (!this.isVisible) {
      return;
    }

    // Update current project reference
    this.currentProject = this.projectManager.currentProject;

    if (!keepMenu) this.closeLevelMenu();

    // Update levels list
    const levelsList = this.dialog.querySelector("#levelsList");
    if (levelsList) {
      this.populateLevelsList(levelsList);
    }

    // The cards were rebuilt: re-anchor an open menu to the new ⋯ button
    // (it stays where it was on screen) and refresh its check states.
    if (keepMenu && this.levelMenu) {
      const newAnchor = levelsList?.querySelector(
        `.level-card[data-level-id="${this.levelMenu.levelId}"] .level-menu-button`
      );
      if (newAnchor) {
        this.levelMenu.anchor = newAnchor;
        newAnchor.classList.add("open");
        this.levelMenu.syncChecks();
      } else {
        this.closeLevelMenu();
      }
    }

    // Update project info
    const nameInput = this.dialog.querySelector(".info-input");
    if (nameInput) {
      nameInput.value = this.currentProject.projectName;
    }

    // Update difficulty selector
    const difficultySelector = this.dialog.querySelector(
      ".difficulty-selector-container"
    );
    if (difficultySelector && difficultySelector.updateValue) {
      const currentDifficulty =
        this.currentProject.sharedData?.projectDifficulty !== undefined
          ? this.currentProject.sharedData.projectDifficulty
          : 5;
      difficultySelector.updateValue(currentDifficulty);
    }

    // Update playlist select (second select element)
    const selectElements = this.dialog.querySelectorAll(".info-select");
    if (selectElements.length >= 2) {
      const playlistSelect = selectElements[1];
      const currentPlaylist =
        this.currentProject.sharedData?.projectPlaylist ||
        PROJECT_PLAYLISTS[0].key;
      playlistSelect.value = currentPlaylist;
    }
  }

  applyStyles() {
    // Apply difficulty selector styles
    applyDifficultySelectorStyles();

    if (!document.querySelector("#project-data-dialog-styles")) {
      const style = document.createElement("style");
      style.id = "project-data-dialog-styles";
      style.textContent = `
        /* Project Data Dialog Styles */
        .project-data-dialog-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 1001; /* == editor toolbar (1001); appended later, so it paints above it */
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .project-data-dialog-backdrop.visible {
          opacity: 1;
          visibility: visible;
        }

        .level-card-menu {
          z-index: 10001;
          min-width: 150px;
          padding: 4px;
          background: ${Theme.sidebarBackground};
          border: 1px solid ${Theme.borderSecondary};
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .level-card-menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 6px 8px;
          background: transparent;
          border: none;
          color: ${Theme.textPrimary};
          font-size: 12px;
          text-align: left;
          cursor: pointer;
        }

        .level-card-menu-item svg {
          width: 13px;
          height: 13px;
          flex: none;
          color: ${Theme.textSecondary};
          fill: currentColor;
        }

        .level-card-menu-item:hover:not(:disabled),
        .level-card-menu-item:focus-visible {
          background: ${Theme.componentHoverBackground};
          outline: none;
        }

        .level-card-menu-item:disabled {
          color: ${Theme.textMuted};
          cursor: default;
        }

        .level-card-menu-item.danger,
        .level-card-menu-item.danger svg {
          color: #ff6b76;
        }

        .level-card-menu-item.danger:disabled,
        .level-card-menu-item.danger:disabled svg {
          color: ${Theme.textMuted};
        }

        .level-card-menu-label {
          padding: 6px 8px 2px;
          color: ${Theme.textSecondary};
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .level-card-menu-check {
          margin-left: auto;
          width: 12px;
          height: 12px;
          flex: none;
          border: 1px solid ${Theme.borderSecondary};
          background: ${Theme.sidebarBackground};
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .level-card-menu-check.checked {
          background: ${Theme.textPrimary};
          border-color: ${Theme.textPrimary};
        }

        .level-card-menu-check.checked::after {
          content: "";
          width: 6px;
          height: 3px;
          border-left: 2px solid #111;
          border-bottom: 2px solid #111;
          transform: translateY(-1px) rotate(-45deg);
        }

        .level-card-menu-separator {
          height: 1px;
          margin: 3px 4px;
          background: ${Theme.borderSecondary};
        }

        .project-data-dialog {
          background: ${Theme.sidebarBackground};
          border: 1px solid ${Theme.borderPrimary};
          border-radius: 0px;
          width: 700px;
          max-width: 90vw;
          max-height: 85vh;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          transform: scale(0.9) translateY(-20px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .project-data-dialog.visible {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        .project-data-dialog .dialog-header {
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 0px 0px 0 0;
        }

        .project-data-dialog .dialog-title {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: ${Theme.textPrimary};
        }

        .project-data-dialog .dialog-close {
          background: transparent;
          border: none;
          color: ${Theme.textPrimary};
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 0px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .project-data-dialog .dialog-close:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        .project-data-dialog .dialog-content {
          padding: 0;
          overflow-y: auto;
          max-height: calc(85vh - 160px);
        }

        .project-data-dialog .dialog-content::-webkit-scrollbar {
          width: 14px;
        }

        .project-data-dialog .dialog-content::-webkit-scrollbar-track {
          background: ${Theme.scrollbarTrack};
        }

        .project-data-dialog .dialog-content::-webkit-scrollbar-thumb {
          background: ${Theme.scrollbarThumb};
          border-radius: 0px;
          border: 4px solid ${Theme.scrollbarTrack};
          background-clip: content-box;
        }

        .project-data-dialog .dialog-content::-webkit-scrollbar-thumb:hover {
          background: ${Theme.scrollbarThumbHover};
          border: 4px solid ${Theme.scrollbarTrack};
          background-clip: content-box;
        }

        /* Project Actions Toolbar */
        .project-data-dialog .project-actions-toolbar {
          position: sticky;
          top: 0;
          z-index: 10;
          background: ${Theme.componentBackground};
          border-bottom: 1px solid ${Theme.borderSecondary};
          padding: 12px 24px;
          display: flex;
          gap: 8px;
        }

        .project-data-dialog .toolbar-action-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 8px;
          background: ${Theme.inputBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0px;
          color: ${Theme.textPrimary};
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .project-data-dialog .toolbar-action-button:hover {
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
          border-color: ${Theme.primaryHover};
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .project-data-dialog .toolbar-action-button-danger {
          background: #dc3545;
          border-color: ${Theme.componentBackground};
          color: white;
        }

        .project-data-dialog .toolbar-action-button-danger:hover {
          background: #c82333;
          border-color: ${Theme.componentBackground};
          color: white;
        }

        .project-data-dialog .toolbar-action-button svg {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
        }

        /* Main content padding */
        .project-data-dialog .project-section {
          margin: 24px;
          margin-bottom: 32px;
        }

        .project-data-dialog .project-section:last-child {
          margin-bottom: 24px;
        }

        .project-data-dialog .section-title {
          margin: 0 0 16px 0;
          color: ${Theme.textPrimary};
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding-bottom: 8px;
          border-bottom: 2px solid ${Theme.primary};
          position: relative;
          flex: 1;
        }

        .project-data-dialog .section-title::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 40px;
          height: 2px;
          background: ${Theme.primaryHover};
        }

        .project-data-dialog .section-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .project-data-dialog .add-level-button {
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
          border: none;
          padding: 8px 16px;
          border-radius: 0px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .project-data-dialog .add-level-button:hover {
          background: ${Theme.primaryHover};
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .project-data-dialog .add-level-button svg {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          margin: -4px 0px -4px -8px;
        }

        .project-data-dialog .project-info-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          align-items: start;
        }

        .project-data-dialog .info-column {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .project-data-dialog .info-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }


        .project-data-dialog .info-group-flat {
          display: flex;
          flex-direction: row;
          gap: 6px;
          align-items: center;
        }

        .project-data-dialog .info-label {
          font-weight: 600;
          color: ${Theme.textSecondary};
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          flex: 1;
        }

        .project-data-dialog .info-input {
          padding: 0px 12px;
          background: ${Theme.inputBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0px;
          color: ${Theme.textPrimary};
          font-size: 0.9rem;
          transition: all 0.2s ease;
          height: 32px;
        }

        .project-data-dialog .info-input:focus {
          outline: none;
          border-color: ${Theme.borderFocus};
          background: ${Theme.inputFocusBackground};
        }

        .project-data-dialog .info-select {
          padding: 0px 8px;
          background: ${Theme.inputBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0px;
          color: ${Theme.textPrimary};
          font-size: 0.9rem;
          transition: all 0.2s ease;
          cursor: pointer;
          height: 34px;
          flex: 3;
        }

        .project-data-dialog .info-select:focus {
          outline: none;
          border-color: ${Theme.borderFocus};
          background: ${Theme.inputFocusBackground};
        }

        .project-data-dialog .info-value {
          padding: 10px 12px;
          background: ${Theme.componentBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0px;
          color: ${Theme.textPrimary};
          font-size: 0.9rem;
        }

        .project-data-dialog .levels-list {
          display: flex;
          flex-direction: row;
          gap: 12px;
          max-height: 200px;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 8px;
          border: 1px solid ${Theme.borderSecondary};
        }

        .project-data-dialog .level-card {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          width: 160px;
          min-width: 160px;
          height: 160px;
          background: ${Theme.componentBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0px;
          transition: all 0.3s ease;
          cursor: pointer;
          user-select: none;
        }

        .project-data-dialog .level-card:hover {
          background: ${Theme.componentHoverBackground};
          border-color: ${Theme.primary};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .project-data-dialog .level-card.current {
          background: ${Theme.primary};
          border-color: ${Theme.primaryHover};
          color: ${Theme.textPrimary};
        }

        .project-data-dialog .level-card.current:hover {
          background: ${Theme.primaryHover};
        }

        .project-data-dialog .level-card.dragging {
          opacity: 0.5;
          transform: rotate(5deg);
          z-index: 1000;
        }

        /* ---- top bar: reorder hardware left, status glyphs + menu right ---- */
        .project-data-dialog .level-card-bar {
          flex: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 28px;
          padding: 0 4px;
          background: ${Theme.sidebarBackground};
          border-bottom: 1px solid ${Theme.borderSecondary};
        }

        .project-data-dialog .level-card.current .level-card-bar {
          border-bottom-color: ${Theme.primaryHover};
        }

        .project-data-dialog .level-card-bar-right {
          display: inline-flex;
          align-items: center;
        }

        /* Flush square tiles on the bar (grip, ‹ ›). */
        .project-data-dialog .level-tile-group {
          display: inline-flex;
        }

        .project-data-dialog .level-tile {
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 20px;
          min-width: 20px;
          padding: 0 4px;
          margin: 0;
          font: inherit;
          background: ${Theme.componentBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0;
          color: ${Theme.textSecondary};
          font-size: 0.8rem;
          line-height: 1;
          transition: all 0.15s ease;
        }

        .project-data-dialog .level-tile + .level-tile {
          margin-left: -1px;
        }

        .project-data-dialog .level-tile:hover {
          border-color: ${Theme.primary};
          color: ${Theme.textPrimary};
          position: relative;
          z-index: 1;
        }

        .project-data-dialog .level-drag-handle {
          cursor: grab;
          letter-spacing: -1px;
          user-select: none;
        }

        .project-data-dialog .level-drag-handle:active {
          cursor: grabbing;
        }

        .project-data-dialog .level-arrow-button {
          cursor: pointer;
          font-size: 0.85rem;
          line-height: 1;
          padding: 0 5px 1px;
        }

        .project-data-dialog .level-glyphs {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 0 4px;
          color: ${Theme.textSecondary};
        }

        .project-data-dialog .level-glyph {
          display: inline-flex;
        }

        .project-data-dialog .level-glyph svg {
          width: 12px;
          height: 12px;
          fill: currentColor;
        }

        .project-data-dialog .level-menu-button {
          width: 18px;
          height: 20px;
          padding: 0;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 0;
          color: ${Theme.textSecondary};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .project-data-dialog .level-menu-button svg {
          width: 15px;
          height: 15px;
        }

        .project-data-dialog .level-menu-button:hover,
        .project-data-dialog .level-menu-button.open {
          color: ${Theme.textPrimary};
          border-color: ${Theme.borderSecondary};
          background: rgba(255, 255, 255, 0.06);
        }

        /* ---- watermark pack-order number ---- */
        .project-data-dialog .level-card-number {
          position: absolute;
          right: 8px;
          bottom: 2px;
          font-family: "ProtestStrike-Regular", "Arial Black", Impact, sans-serif;
          font-size: 72px;
          line-height: 1;
          color: rgba(255, 255, 255, 0.06);
          pointer-events: none;
          user-select: none;
        }

        .project-data-dialog .level-card.current .level-card-number {
          color: rgba(0, 0, 0, 0.14);
        }

        /* ---- body ---- */
        .project-data-dialog .level-card-content {
          position: relative;
          z-index: 1;
          flex: 1;
          min-height: 0;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 3px;
          justify-content: center;
          align-items: flex-start;
        }

        .project-data-dialog .level-name-container {
          display: flex;
          align-items: center;
          gap: 4px;
          max-width: 100%;
        }

        .project-data-dialog .level-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: ${Theme.textPrimary};
          text-align: left;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .project-data-dialog .level-meta {
          font-size: 0.72rem;
          color: ${Theme.textSecondary};
          text-align: left;
        }

        .project-data-dialog .level-card.current .level-meta {
          color: rgba(255, 255, 255, 0.85);
        }

        .project-data-dialog .level-size {
          font-size: 0.66rem;
          color: ${Theme.textMuted};
          font-variant-numeric: tabular-nums;
        }

        .project-data-dialog .level-card.current .level-size {
          color: rgba(255, 255, 255, 0.7);
        }

        .project-data-dialog .level-edit-button {
          background: transparent;
          border-radius: 0;
          border: 1px solid transparent;
          color: ${Theme.textPrimary};
          cursor: pointer;
          padding: 2px;
          font-size: 1rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
        }

        .project-data-dialog .level-edit-button:hover {
          color: ${Theme.textPrimary};
          border: 1px solid ${Theme.textPrimary};
        }

        /* Open / Current with the issues segment fused on. */
        .project-data-dialog .level-action-group {
          display: inline-flex;
          align-items: stretch;
          margin-top: 6px;
        }

        .project-data-dialog .current-indicator {
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 4px 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid ${Theme.textPrimary}CC;
        }

        .project-data-dialog .level-switch-button {
          background: ${Theme.primary};
          border: none;
          color: ${Theme.textPrimary};
          font-size: 0.7rem;
          font-weight: 600;
          padding: 4px 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .project-data-dialog .level-switch-button:hover {
          background: ${Theme.primaryHover};
        }

        .project-data-dialog .level-issue-segment {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 0 6px;
          border: none;
          font-size: 10px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          background: ${Theme.warning};
          color: #2a2200;
          cursor: pointer;
        }

        .project-data-dialog .level-issue-segment svg {
          width: 11px;
          height: 11px;
          fill: currentColor;
        }

        .project-data-dialog .level-issue-segment.error {
          background: ${Theme.error};
          color: ${Theme.textPrimary};
        }

        .project-data-dialog .current-indicator + .level-issue-segment {
          border: 1px solid ${Theme.warning};
          border-left: 0;
          background: transparent;
          color: #ffe0a3;
        }

        .project-data-dialog .current-indicator + .level-issue-segment.error {
          border-color: #ffd0d0;
          color: #ffd0d0;
        }

        .project-data-dialog .level-name-input {
          width: 100%;
          max-width: 120px;
          padding: 2px 4px;
          background: ${Theme.inputBackground};
          border: 1px solid ${Theme.borderFocus};
          border-radius: 0px;
          color: ${Theme.textPrimary};
          font-size: 0.8rem;
          font-weight: 600;
          font-family: inherit;
          text-align: center;
          box-sizing: border-box;
        }

        .project-data-dialog .level-name-input:focus {
          outline: none;
          border-color: ${Theme.primary};
          box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
        }

        /* Old level styles removed - using card layout now */

        .project-data-dialog .switch-button {
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
        }

        .project-data-dialog .switch-button:hover {
          background: ${Theme.primaryHover};
          transform: scale(1.05);
        }

        .project-data-dialog .rename-button {
          background: ${Theme.componentBackground};
          color: ${Theme.textSecondary};
          border: 1px solid ${Theme.borderSecondary};
        }

        .project-data-dialog .rename-button:hover {
          background: ${Theme.componentHoverBackground};
          color: ${Theme.textPrimary};
          border-color: ${Theme.primary};
        }

        .project-data-dialog .delete-button {
          background: #ff4444;
          color: white;
        }

        .project-data-dialog .delete-button:hover {
          background: #cc2222;
          transform: scale(1.05);
        }

        .project-data-dialog .current-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: ${Theme.textPrimary};
          text-transform: uppercase;
          letter-spacing: 0.3px;
          background: rgba(255, 255, 255, 0.2);
          padding: 6px 12px;
          border-radius: 0px;
        }

        .project-data-dialog .resources-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .project-data-dialog .resource-mini-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: ${Theme.componentBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          font-size: 0.85rem;
          color: ${Theme.textPrimary};
        }

        .project-data-dialog .resource-mini-button:hover {
          background: ${Theme.componentHoverBackground};
          border-color: ${Theme.primary};
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .project-data-dialog .resource-mini-button svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .project-data-dialog .dialog-footer {
          padding: 20px 24px;
          background: ${Theme.componentBackground};
          border-top: 1px solid ${Theme.borderSecondary};
          display: flex;
          justify-content: flex-end;
        }

        .project-data-dialog .dialog-button {
          padding: 10px 20px;
          border: none;
          border-radius: 0px;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 100px;
          font-family: inherit;
        }

        .project-data-dialog .dialog-button-primary {
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
          border: 1px solid ${Theme.primary};
        }

        .project-data-dialog .dialog-button-primary:hover {
          background: ${Theme.primaryHover};
          border-color: ${Theme.primaryHover};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .project-data-dialog {
            width: 95vw;
            max-height: 90vh;
          }
          
          .project-data-dialog .project-info-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .project-data-dialog .resources-grid {
            grid-template-columns: 1fr;
          }
          
          .project-data-dialog .level-card {
            min-width: 140px;
            width: 140px;
            height: 140px;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  destroy() {
    this.hide();

    const styles = document.querySelector("#project-data-dialog-styles");
    if (styles) {
      styles.remove();
    }
  }
}

// Singleton for easier access
let projectDataDialogInstance = null;

export function initializeProjectDataDialog() {
  if (!projectDataDialogInstance) {
    projectDataDialogInstance = new ProjectDataDialog();
  }
  return projectDataDialogInstance;
}

export function getProjectDataDialog() {
  return projectDataDialogInstance;
}

export function destroyProjectDataDialog() {
  if (projectDataDialogInstance) {
    projectDataDialogInstance.destroy();
    projectDataDialogInstance = null;
  }
}
