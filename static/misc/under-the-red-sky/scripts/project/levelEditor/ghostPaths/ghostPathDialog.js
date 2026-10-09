// Ghost Path Dialog for Level Editor
// Manages ghost path settings, viewing, and management

import {
  Play,
  BasicSprite as Stop,
  Eye,
  EyeOff,
  Delete,
  Pencil,
  Save,
} from "../iconList.js";
import { showConfirmDialog } from "../confirmDialog.js";
import { getGhostPathManager } from "./ghostPathManager.js";
import { getGhostPathRenderer } from "./ghostPathRenderer.js";
import { Theme } from "../inspectorUI.js";
import { ColorPicker } from "../colorPicker.js";

/**
 * Ghost Path Management Dialog
 */
export class GhostPathDialog {
  constructor(container = document.body) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;

    this.dialog = null;
    this.overlay = null;
    this.isVisible = false;

    // Managers
    this.ghostPathManager = getGhostPathManager();
    this.ghostPathRenderer = getGhostPathRenderer();

    // Current state
    this.currentGhostData = null;
    this.currentPlaybackSpeed = 1.0;

    this.applyStyles();
  }

  /**
   * Show the ghost path dialog
   */
  show() {
    const projectManager = globalThis._editorScope?.projectManager;
    if (!projectManager || !projectManager.hasProjectLoaded()) {
      alert("Please create or open a project before managing ghost paths.");
      return;
    }

    if (this.overlay && this.dialog) {
      this.overlay.classList.add("visible");
      this.dialog.classList.add("visible");
      this.isVisible = true;
      this.refreshContent();
      return;
    }

    this.createDialog();
    this.refreshContent();
  }

  /**
   * Create the dialog structure
   */
  createDialog() {
    // Overlay
    this.overlay = document.createElement("div");
    this.overlay.className = "ghost-path-dialog-overlay";
    this.overlay.tabIndex = -1;
    this.overlay.addEventListener("mousedown", (e) => {
      if (e.target === this.overlay) this.hide();
    });

    // Dialog
    this.dialog = document.createElement("div");
    this.dialog.className = "ghost-path-dialog";

    // Close button
    const closeButton = document.createElement("button");
    closeButton.className = "ghost-path-dialog-close";
    closeButton.innerHTML = "✕";
    closeButton.addEventListener("click", () => this.hide());

    // Header
    const header = document.createElement("div");
    header.className = "ghost-path-dialog-header";
    const title = document.createElement("h3");
    title.className = "ghost-path-dialog-title";
    title.textContent = "Ghost Paths";

    header.appendChild(title);
    header.appendChild(closeButton);
    this.dialog.appendChild(header);

    // Toolbar
    this.createToolbar();

    // Content
    const content = document.createElement("div");
    content.className = "ghost-path-dialog-content";
    this.contentArea = content;
    this.dialog.appendChild(content);

    // Ghost list
    this.createGhostList(content);

    // Add to DOM
    this.overlay.appendChild(this.dialog);
    this.container.appendChild(this.overlay);

    // Show with animation
    setTimeout(() => this.overlay.classList.add("visible"), 10);
    setTimeout(() => this.dialog.classList.add("visible"), 10);
    this.isVisible = true;

    this.blockEvents();
  }

  /**
   * Create toolbar with actions
   */
  createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "ghost-path-toolbar";

    const leftActions = document.createElement("div");
    leftActions.className = "ghost-path-toolbar-left";

    // Play all button
    const playAllBtn = document.createElement("button");
    playAllBtn.className = "ghost-path-toolbar-btn";
    playAllBtn.innerHTML = `${Play} Play All`;
    playAllBtn.addEventListener("click", () => {
      this.ghostPathRenderer.startAllVisibleAnimations(
        this.currentPlaybackSpeed,
      );
      setTimeout(() => this.refreshGhostList(), 100);
    });
    leftActions.appendChild(playAllBtn);

    // Stop all button
    const stopAllBtn = document.createElement("button");
    stopAllBtn.className = "ghost-path-toolbar-btn";
    stopAllBtn.innerHTML = `${Stop} Stop All`;
    stopAllBtn.addEventListener("click", () => {
      this.ghostPathRenderer.stopAllAnimations();
      setTimeout(() => this.refreshGhostList(), 100);
    });
    leftActions.appendChild(stopAllBtn);

    toolbar.appendChild(leftActions);

    // Right side: Speed + visibility
    const rightActions = document.createElement("div");
    rightActions.className = "ghost-path-toolbar-right";

    // Speed control
    const speedControl = document.createElement("div");
    speedControl.className = "ghost-path-speed-control";

    const speedLabel = document.createElement("span");
    speedLabel.className = "ghost-path-speed-label";
    speedLabel.textContent = "Speed:";
    speedControl.appendChild(speedLabel);

    const speedSlider = document.createElement("input");
    speedSlider.type = "range";
    speedSlider.min = "0.25";
    speedSlider.max = "4";
    speedSlider.step = "0.25";
    speedSlider.value = this.currentPlaybackSpeed.toString();
    speedSlider.className = "ghost-path-speed-slider";
    speedControl.appendChild(speedSlider);

    // Speed value display (clickable to edit)
    const speedValueContainer = document.createElement("div");
    speedValueContainer.className = "ghost-path-speed-value-container";

    const speedValue = document.createElement("span");
    speedValue.className = "ghost-path-speed-value";
    speedValue.textContent = `${this.currentPlaybackSpeed.toFixed(2)}×`;
    speedValue.title = "Click to edit";
    speedValueContainer.appendChild(speedValue);

    const speedInput = document.createElement("input");
    speedInput.type = "number";
    speedInput.className = "ghost-path-speed-input";
    speedInput.min = "0.25";
    speedInput.max = "4";
    speedInput.step = "0.25";
    speedInput.value = this.currentPlaybackSpeed.toString();
    speedValueContainer.appendChild(speedInput);

    speedControl.appendChild(speedValueContainer);

    // Update speed from slider
    speedSlider.addEventListener("input", (e) => {
      const speed = parseFloat(e.target.value);
      this.currentPlaybackSpeed = speed;
      speedValue.textContent = `${speed.toFixed(2)}×`;
      speedInput.value = speed.toString();
      this.ghostPathRenderer.setActiveAnimationsPlaybackSpeed(speed);
    });

    // Click on value to show input
    speedValue.addEventListener("click", (e) => {
      e.stopPropagation();
      speedValueContainer.classList.add("editing");
      speedInput.value = this.currentPlaybackSpeed.toString();
      speedInput.focus();
      speedInput.select();
    });

    // Handle input changes
    const applySpeedInput = () => {
      let speed = parseFloat(speedInput.value);
      if (isNaN(speed)) speed = 1;
      speed = Math.max(0.25, Math.min(4, speed));
      this.currentPlaybackSpeed = speed;
      speedSlider.value = speed.toString();
      speedValue.textContent = `${speed.toFixed(2)}×`;
      speedInput.value = speed.toString();
      this.ghostPathRenderer.setActiveAnimationsPlaybackSpeed(speed);
      speedValueContainer.classList.remove("editing");
    };

    speedInput.addEventListener("blur", applySpeedInput);
    speedInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applySpeedInput();
      } else if (e.key === "Escape") {
        speedInput.value = this.currentPlaybackSpeed.toString();
        speedValueContainer.classList.remove("editing");
      }
    });

    rightActions.appendChild(speedControl);

    // Visibility toggle
    const visToggle = document.createElement("label");
    visToggle.className = "ghost-path-visibility-toggle";

    const visCheckbox = document.createElement("input");
    visCheckbox.type = "checkbox";
    visCheckbox.checked = this.ghostPathRenderer.getVisible();
    visCheckbox.addEventListener("change", (e) => {
      this.ghostPathRenderer.setVisible(e.target.checked);
    });
    this.visibilityCheckbox = visCheckbox; // Store reference for updates

    const visLabel = document.createElement("span");
    visLabel.textContent = "Show Paths";

    visToggle.appendChild(visCheckbox);
    visToggle.appendChild(visLabel);
    rightActions.appendChild(visToggle);

    toolbar.appendChild(rightActions);
    this.dialog.appendChild(toolbar);
  }

  /**
   * Create ghost list section
   */
  createGhostList(container) {
    this.ghostListContainer = document.createElement("div");
    this.ghostListContainer.className = "ghost-path-list";
    container.appendChild(this.ghostListContainer);
  }

  /**
   * Refresh the dialog content
   */
  refreshContent() {
    this.currentGhostData = this.ghostPathManager.getCurrentLevelGhosts();
    this.refreshGhostList();

    // Sync visibility checkbox with renderer state
    if (this.visibilityCheckbox) {
      this.visibilityCheckbox.checked = this.ghostPathRenderer.getVisible();
    }
  }

  /**
   * Refresh the ghost list
   */
  refreshGhostList() {
    if (!this.ghostListContainer) return;
    this.ghostListContainer.innerHTML = "";

    if (!this.currentGhostData) {
      this.renderEmptyState();
      return;
    }

    const hasAnyGhost =
      this.currentGhostData.bestGhost ||
      this.currentGhostData.lastGhost ||
      this.currentGhostData.customGhosts?.length > 0;

    if (!hasAnyGhost) {
      this.renderEmptyState();
      return;
    }

    // Auto ghosts section
    if (this.currentGhostData.bestGhost || this.currentGhostData.lastGhost) {
      const autoSection = document.createElement("div");
      autoSection.className = "ghost-path-section";

      const autoTitle = document.createElement("div");
      autoTitle.className = "ghost-path-section-title";
      autoTitle.textContent = "Auto Ghosts";
      autoSection.appendChild(autoTitle);

      if (this.currentGhostData.bestGhost) {
        this.createGhostItem(
          "best",
          this.currentGhostData.bestGhost,
          autoSection,
          true,
        );
      }
      if (this.currentGhostData.lastGhost) {
        this.createGhostItem(
          "last",
          this.currentGhostData.lastGhost,
          autoSection,
          true,
        );
      }

      this.ghostListContainer.appendChild(autoSection);
    }

    // Custom ghosts section
    if (this.currentGhostData.customGhosts?.length > 0) {
      const customSection = document.createElement("div");
      customSection.className = "ghost-path-section";

      const customTitle = document.createElement("div");
      customTitle.className = "ghost-path-section-title";
      customTitle.textContent = "Custom Ghosts";
      customSection.appendChild(customTitle);

      this.currentGhostData.customGhosts.forEach((ghost) => {
        this.createGhostItem(ghost.id, ghost, customSection, false);
      });

      this.ghostListContainer.appendChild(customSection);
    }
  }

  /**
   * Render empty state
   */
  renderEmptyState() {
    const empty = document.createElement("div");
    empty.className = "ghost-path-empty";
    empty.innerHTML = `
      <div class="ghost-path-empty-message">No ghost data available</div>
      <div class="ghost-path-empty-description">Complete a run in play mode to record your first ghost path.</div>
    `;
    this.ghostListContainer.appendChild(empty);
  }

  /**
   * Create a ghost list item
   * @param {string} ghostId - Ghost identifier
   * @param {Object} ghostData - Ghost data
   * @param {HTMLElement} container - Container to append the item to
   * @param {boolean} isAutoGhost - Whether this is an auto ghost (best/last)
   */
  /**
   * Hover tooltip reusing the toolbar's shared tooltip (matching styling/font).
   * Falls back to the native `title` if the toolbar isn't available.
   */
  attachTooltip(el, text) {
    const toolbar = globalThis._editorScope?.toolbar;
    if (!toolbar || typeof toolbar.showTooltip !== "function") {
      el.title = text;
      return;
    }
    el.addEventListener("mouseenter", () => toolbar.showTooltip(el, text));
    el.addEventListener("mouseleave", () => {
      if (typeof toolbar.hideTooltipDelayed === "function") {
        toolbar.hideTooltipDelayed();
      } else {
        toolbar.hideTooltip();
      }
    });
  }

  createGhostItem(ghostId, ghostData, container, isAutoGhost = false) {
    const item = document.createElement("div");
    item.className = "ghost-path-item";
    item.dataset.ghostId = ghostId;

    const isVisible = this.ghostPathRenderer.isGhostVisible(ghostId);
    const isPlaying = this.ghostPathRenderer.isGhostAnimating(ghostId);

    // Color indicator
    const colorIndicator = document.createElement("div");
    colorIndicator.className = "ghost-path-item-color";
    colorIndicator.style.backgroundColor = ghostData.color || "#4A9EFF";
    item.appendChild(colorIndicator);

    // Info section
    const info = document.createElement("div");
    info.className = "ghost-path-item-info";

    // Name with badge (only for auto ghosts)
    const nameRow = document.createElement("div");
    nameRow.className = "ghost-path-item-name-row";

    const name = document.createElement("span");
    name.className = "ghost-path-item-name";
    name.textContent =
      ghostData.name ||
      (ghostId === "best"
        ? "Best Time"
        : ghostId === "last"
          ? "Last Run"
          : ghostId);
    nameRow.appendChild(name);

    // Only show badge for auto ghosts
    if (isAutoGhost) {
      const badge = document.createElement("span");
      badge.className = `ghost-path-badge ghost-path-badge-${
        ghostId === "best" ? "best" : "last"
      }`;
      badge.textContent = ghostId === "best" ? "BEST" : "LAST";
      nameRow.appendChild(badge);
    }

    // Obsolete badge: the level changed since this run was recorded (or the path
    // predates obsolescence tracking, in which case it counts as obsolete).
    if (this.ghostPathManager.isGhostObsolete(ghostData)) {
      const obsolete = document.createElement("span");
      obsolete.className = "ghost-path-badge ghost-path-badge-obsolete";
      obsolete.textContent = "OBSOLETE";
      this.attachTooltip(
        obsolete,
        "The level changed since this run was recorded. Replay the level to record a fresh path.",
      );
      nameRow.appendChild(obsolete);
    }

    info.appendChild(nameRow);

    // Time
    const time = document.createElement("div");
    time.className = "ghost-path-item-time";
    time.textContent = this.formatTime(ghostData.time);
    info.appendChild(time);

    // Points count
    const points = document.createElement("div");
    points.className = "ghost-path-item-points";
    points.textContent = `${ghostData.data?.length || 0} points`;
    info.appendChild(points);

    item.appendChild(info);

    // Actions
    const actions = document.createElement("div");
    actions.className = "ghost-path-item-actions";

    // Visibility toggle
    const visBtn = document.createElement("button");
    visBtn.className = `ghost-path-action-btn ${isVisible ? "active" : ""}`;
    visBtn.innerHTML = isVisible ? Eye : EyeOff;
    visBtn.title = isVisible ? "Hide ghost" : "Show ghost";
    visBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.ghostPathRenderer.toggleGhostVisibility(ghostId);
      this.refreshGhostList();
    });
    actions.appendChild(visBtn);

    // Play/Stop toggle
    const playBtn = document.createElement("button");
    playBtn.className = `ghost-path-action-btn ${isPlaying ? "playing" : ""}`;
    playBtn.innerHTML = isPlaying ? Stop : Play;
    playBtn.title = isPlaying
      ? "Stop animation"
      : isVisible
        ? "Play animation"
        : "Ghost must be visible to play";
    playBtn.disabled = !isVisible && !isPlaying;
    if (!isVisible && !isPlaying) {
      playBtn.classList.add("disabled");
    }
    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (playBtn.disabled) return;
      if (isPlaying) {
        this.ghostPathRenderer.stopAnimation(ghostId);
      } else {
        this.ghostPathRenderer.startAnimation(
          ghostId,
          this.currentPlaybackSpeed,
        );
      }
      this.refreshGhostList();
    });
    actions.appendChild(playBtn);

    // Save as custom (for best/last only)
    if (ghostId === "best" || ghostId === "last") {
      const saveBtn = document.createElement("button");
      saveBtn.className = "ghost-path-action-btn";
      saveBtn.innerHTML = Save;
      saveBtn.title = "Save as custom ghost";
      saveBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (ghostId === "best") {
          this.addCustomGhostFromBest();
        } else {
          this.addCustomGhostFromLast();
        }
      });
      actions.appendChild(saveBtn);
    }

    // Edit (for custom only)
    if (ghostId !== "best" && ghostId !== "last") {
      const editBtn = document.createElement("button");
      editBtn.className = "ghost-path-action-btn";
      editBtn.innerHTML = Pencil;
      editBtn.title = "Edit ghost";
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.editGhost(ghostId);
      });
      actions.appendChild(editBtn);
    }

    // Delete
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "ghost-path-action-btn ghost-path-action-btn-danger";
    deleteBtn.innerHTML = Delete;
    deleteBtn.title = "Delete ghost";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.deleteGhost(ghostId);
    });
    actions.appendChild(deleteBtn);

    item.appendChild(actions);
    container.appendChild(item);
  }

  /**
   * Format time to display string
   */
  formatTime(time) {
    if (!time) return "Unknown";

    const totalSeconds = Math.floor(time);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((time % 1) * 100);

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, "0")}.${ms
        .toString()
        .padStart(2, "0")}`;
    }
    return `${seconds}.${ms.toString().padStart(2, "0")}s`;
  }

  /**
   * Edit a custom ghost
   */
  editGhost(ghostId) {
    const ghost = this.currentGhostData.customGhosts?.find(
      (g) => g.id === ghostId,
    );
    if (!ghost) return;

    this.showGhostEditDialog({
      title: "Edit Custom Ghost",
      name: ghost.name,
      color: ghost.color,
      onSave: (name, color) => {
        this.ghostPathManager.updateCustomGhost(ghostId, { name, color });
        this.refreshContent();
      },
    });
  }

  /**
   * Delete a ghost
   */
  deleteGhost(ghostId) {
    const titles = {
      best: "Delete Best Ghost",
      last: "Delete Last Ghost",
    };
    const title = titles[ghostId] || "Delete Ghost";

    showConfirmDialog({
      title,
      message:
        "Are you sure you want to delete this ghost? This cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    }).then((confirmed) => {
      if (confirmed) {
        this.ghostPathManager.removeGhost(ghostId);
        this.refreshContent();
      }
    });
  }

  /**
   * Add custom ghost from last (transfers the ghost)
   */
  addCustomGhostFromLast() {
    const lastGhost = this.ghostPathManager.getLastGhost();
    if (!lastGhost) {
      alert("No last run data available.");
      return;
    }

    // Check if the ghost was playing before we save it
    const wasPlaying = this.ghostPathRenderer.isGhostAnimating("last");

    this.showGhostEditDialog({
      title: "Save as Custom Ghost",
      name: lastGhost.name || "Last Run",
      color:
        lastGhost.color || this.ghostPathManager.defaultColors.custom.color,
      onSave: (name, color) => {
        // Add the custom ghost
        const newGhostId = this.ghostPathManager.addCustomGhost(
          name,
          lastGhost.time,
          lastGhost.data,
          color,
          lastGhost.opacity ||
            this.ghostPathManager.defaultColors.custom.opacity,
        );

        // Remove the original last ghost
        this.ghostPathManager.removeLastGhost();

        // Refresh content first to update the data
        this.refreshContent();

        // If the ghost was playing, start playing the new one
        if (wasPlaying && newGhostId) {
          this.ghostPathRenderer.startAnimation(
            newGhostId,
            this.currentPlaybackSpeed,
          );
          // Refresh again to show the playing state
          this.refreshGhostList();
        }
      },
    });
  }

  /**
   * Add custom ghost from best (transfers the ghost)
   */
  addCustomGhostFromBest() {
    const bestGhost = this.ghostPathManager.getBestGhost();
    if (!bestGhost) {
      alert("No best time data available.");
      return;
    }

    // Check if the ghost was playing before we save it
    const wasPlaying = this.ghostPathRenderer.isGhostAnimating("best");

    this.showGhostEditDialog({
      title: "Save as Custom Ghost",
      name: bestGhost.name || "Best Time",
      color:
        bestGhost.color || this.ghostPathManager.defaultColors.custom.color,
      onSave: (name, color) => {
        // Add the custom ghost
        const newGhostId = this.ghostPathManager.addCustomGhost(
          name,
          bestGhost.time,
          bestGhost.data,
          color,
          bestGhost.opacity ||
            this.ghostPathManager.defaultColors.custom.opacity,
        );

        // Remove the original best ghost
        this.ghostPathManager.removeBestGhost();

        // Refresh content first to update the data
        this.refreshContent();

        // If the ghost was playing, start playing the new one
        if (wasPlaying && newGhostId) {
          this.ghostPathRenderer.startAnimation(
            newGhostId,
            this.currentPlaybackSpeed,
          );
          // Refresh again to show the playing state
          this.refreshGhostList();
        }
      },
    });
  }

  /**
   * Show ghost edit/create dialog
   */
  showGhostEditDialog(options) {
    const { title, name, color, onSave } = options;

    const overlay = document.createElement("div");
    overlay.className = "ghost-edit-dialog-overlay";
    document.body.appendChild(overlay);

    const dialog = document.createElement("div");
    dialog.className = "ghost-edit-dialog";

    // Header
    const header = document.createElement("div");
    header.className = "ghost-edit-dialog-header";

    const titleEl = document.createElement("h3");
    titleEl.className = "ghost-edit-dialog-title";
    titleEl.textContent = title;
    header.appendChild(titleEl);

    const closeBtn = document.createElement("button");
    closeBtn.className = "ghost-edit-dialog-close";
    closeBtn.innerHTML = "✕";
    closeBtn.addEventListener("click", closeDialog);
    header.appendChild(closeBtn);

    dialog.appendChild(header);

    // Content
    const content = document.createElement("div");
    content.className = "ghost-edit-dialog-content";

    // Name field
    const nameField = document.createElement("div");
    nameField.className = "ghost-edit-field";

    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Name";
    nameField.appendChild(nameLabel);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "ghost-edit-input";
    nameInput.value = name;
    nameInput.placeholder = "Enter ghost name...";
    nameField.appendChild(nameInput);

    content.appendChild(nameField);

    // Color field
    const colorField = document.createElement("div");
    colorField.className = "ghost-edit-field";

    const colorLabel = document.createElement("label");
    colorLabel.textContent = "Color";
    colorField.appendChild(colorLabel);

    const colorContainer = document.createElement("div");
    colorContainer.className = "ghost-edit-color-container";
    colorField.appendChild(colorContainer);

    const colorPicker = new ColorPicker({
      value: color,
      showHexInput: true,
      onChange: () => {},
    });
    colorPicker.mount(colorContainer);

    content.appendChild(colorField);
    dialog.appendChild(content);

    // Footer
    const footer = document.createElement("div");
    footer.className = "ghost-edit-dialog-footer";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "dialog-button dialog-button-secondary";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", closeDialog);
    footer.appendChild(cancelBtn);

    const saveBtn = document.createElement("button");
    saveBtn.className = "dialog-button dialog-button-primary";
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", () => {
      const finalName = nameInput.value.trim();
      if (!finalName) {
        nameInput.style.borderColor = Theme.error;
        nameInput.focus();
        setTimeout(() => (nameInput.style.borderColor = ""), 2000);
        return;
      }
      onSave(finalName, colorPicker.value);
      closeDialog();
    });
    footer.appendChild(saveBtn);

    dialog.appendChild(footer);
    overlay.appendChild(dialog);

    // Block events
    const eventsToBlock = [
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
    eventsToBlock.forEach((eventType) => {
      dialog.addEventListener(eventType, (e) => e.stopPropagation(), {
        passive: false,
      });
      overlay.addEventListener(eventType, (e) => e.stopPropagation(), {
        passive: false,
      });
    });

    function closeDialog() {
      overlay.classList.remove("visible");
      dialog.classList.remove("visible");
      setTimeout(() => {
        colorPicker.destroy();
        overlay.remove();
      }, 200);
    }

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeDialog();
    });

    // Show with animation
    setTimeout(() => {
      overlay.classList.add("visible");
      dialog.classList.add("visible");
      nameInput.focus();
      nameInput.select();
    }, 10);

    // Escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeDialog();
        document.removeEventListener("keydown", handleEscape);
      } else if (e.key === "Enter" && e.target === nameInput) {
        saveBtn.click();
      }
    };
    document.addEventListener("keydown", handleEscape);
  }

  /**
   * Block events from propagating
   */
  blockEvents() {
    const eventsToBlock = [
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

    eventsToBlock.forEach((eventType) => {
      this.dialog.addEventListener(eventType, (e) => e.stopPropagation(), {
        passive: false,
      });
      this.overlay.addEventListener(eventType, (e) => e.stopPropagation(), {
        passive: false,
      });
    });

    this.dialog.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        this.hide();
      }
    });
  }

  /**
   * Hide the dialog
   */
  hide() {
    if (this.overlay) this.overlay.classList.remove("visible");
    if (this.dialog) this.dialog.classList.remove("visible");
    this.isVisible = false;

    setTimeout(() => {
      if (this.overlay?.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
      this.overlay = null;
      this.dialog = null;
      this.ghostListContainer = null;
      this.contentArea = null;
    }, 200);
  }

  /**
   * Apply CSS styles
   */
  applyStyles() {
    if (document.querySelector("#ghost-path-dialog-styles")) return;

    const style = document.createElement("style");
    style.id = "ghost-path-dialog-styles";
    style.textContent = `
      /* Ghost Path Dialog - Matches existing dialog styles */
      .ghost-path-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.7);
        z-index: 2100;
        opacity: 0;
        visibility: hidden;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(4px);
      }

      .ghost-path-dialog-overlay.visible {
        opacity: 1;
        visibility: visible;
      }

      .ghost-path-dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.95);
        min-width: 500px;
        width: 600px;
        max-width: 90vw;
        max-height: 80vh;
        background: ${Theme.sidebarBackground};
        border: 1px solid ${Theme.borderPrimary};
        border-radius: 0px;
        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
          opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        opacity: 0;
      }

      .ghost-path-dialog.visible {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }

      .ghost-path-dialog-header {
        padding: 20px 24px;
        background: ${Theme.primary};
        color: ${Theme.textPrimary};
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
      }

      .ghost-path-dialog-title {
        margin: 0;
        color: ${Theme.textPrimary};
        font-size: 1.3rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .ghost-path-dialog-close {
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

      .ghost-path-dialog-close:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: scale(1.1);
      }

      /* Toolbar */
      .ghost-path-toolbar {
        background: ${Theme.componentBackground};
        border-bottom: 1px solid ${Theme.borderSecondary};
        padding: 12px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-shrink: 0;
      }

      .ghost-path-toolbar-left,
      .ghost-path-toolbar-right {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ghost-path-toolbar-btn {
        background: ${Theme.componentBackground};
        border: 1px solid ${Theme.borderSecondary};
        color: ${Theme.textPrimary};
        padding: 8px 12px;
        border-radius: 0px;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 6px;
        font-family: inherit;
      }

      .ghost-path-toolbar-btn svg {
        width: 14px;
        height: 14px;
      }

      .ghost-path-toolbar-btn:hover {
        border-color: ${Theme.borderFocus};
        background: ${Theme.componentHoverBackground};
      }

      /* Speed control */
      .ghost-path-speed-control {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ghost-path-speed-label {
        font-size: 0.85rem;
        color: ${Theme.textSecondary};
      }

      .ghost-path-speed-slider {
        width: 100px;
        height: 4px;
        -webkit-appearance: none;
        appearance: none;
        background: ${Theme.borderSecondary};
        border-radius: 2px;
        cursor: pointer;
      }

      .ghost-path-speed-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 14px;
        height: 14px;
        background: ${Theme.primary};
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .ghost-path-speed-slider::-webkit-slider-thumb:hover {
        background: ${Theme.primaryHover};
        transform: scale(1.1);
      }

      .ghost-path-speed-value-container {
        position: relative;
        width: 48px;
        height: 24px;
      }

      .ghost-path-speed-value {
        font-size: 0.85rem;
        font-weight: 600;
        color: ${Theme.textPrimary};
        width: 48px;
        text-align: right;
        cursor: pointer;
        display: block;
        line-height: 24px;
        transition: color 0.2s ease;
      }

      .ghost-path-speed-value:hover {
        color: ${Theme.primary};
      }

      .ghost-path-speed-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 48px;
        height: 24px;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderFocus};
        border-radius: 0px;
        color: ${Theme.textPrimary};
        font-family: inherit;
        font-size: 0.85rem;
        font-weight: 600;
        text-align: right;
        padding: 0 4px;
        box-sizing: border-box;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.15s ease;
      }

      .ghost-path-speed-input:focus {
        outline: none;
      }

      /* Hide spinner buttons */
      .ghost-path-speed-input::-webkit-outer-spin-button,
      .ghost-path-speed-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      .ghost-path-speed-input[type=number] {
        -moz-appearance: textfield;
      }

      .ghost-path-speed-value-container.editing .ghost-path-speed-value {
        opacity: 0;
        pointer-events: none;
      }

      .ghost-path-speed-value-container.editing .ghost-path-speed-input {
        opacity: 1;
        pointer-events: auto;
      }

      /* Visibility toggle */
      .ghost-path-visibility-toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        font-size: 0.85rem;
        color: ${Theme.textSecondary};
      }

      .ghost-path-visibility-toggle input {
        accent-color: ${Theme.primary};
        cursor: pointer;
      }

      /* Content */
      .ghost-path-dialog-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px 24px;
      }

      .ghost-path-dialog-content::-webkit-scrollbar {
        width: 12px;
      }

      .ghost-path-dialog-content::-webkit-scrollbar-track {
        background: ${Theme.scrollbarTrack};
      }

      .ghost-path-dialog-content::-webkit-scrollbar-thumb {
        background: ${Theme.scrollbarThumb};
        border: 2px solid ${Theme.scrollbarTrack};
        border-radius: 0px;
      }

      .ghost-path-dialog-content::-webkit-scrollbar-thumb:hover {
        background: ${Theme.scrollbarThumbHover};
      }

      /* Ghost list */
      .ghost-path-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .ghost-path-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .ghost-path-section-title {
        font-size: 0.75rem;
        font-weight: 600;
        color: ${Theme.textSecondary};
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding-bottom: 4px;
        border-bottom: 1px solid ${Theme.borderSecondary};
      }

      /* Ghost item */
      .ghost-path-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: ${Theme.componentBackground};
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 0px;
        transition: all 0.2s ease;
      }

      .ghost-path-item:hover {
        border-color: ${Theme.borderFocus};
        background: ${Theme.componentHoverBackground};
      }

      .ghost-path-item-color {
        width: 4px;
        height: 48px;
        border-radius: 2px;
        flex-shrink: 0;
      }

      .ghost-path-item-info {
        flex: 1;
        min-width: 0;
      }

      .ghost-path-item-name-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }

      .ghost-path-item-name {
        font-size: 0.95rem;
        font-weight: 600;
        color: ${Theme.textPrimary};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .ghost-path-badge {
        font-size: 0.6rem;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 2px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        flex-shrink: 0;
      }

      .ghost-path-badge-best {
        background: #ffd700;
        color: #000;
      }

      .ghost-path-badge-last {
        background: #ff6b35;
        color: #fff;
      }

      .ghost-path-badge-obsolete {
        background: #6b6b6b;
        color: #fff;
      }

      .ghost-path-info {
        cursor: help;
        margin-left: 8px;
        opacity: 0.7;
        font-size: 1rem;
        user-select: none;
      }

      .ghost-path-info:hover {
        opacity: 1;
      }

      .ghost-path-item-time {
        font-size: 1.1rem;
        font-weight: 700;
        color: ${Theme.textPrimary};
        margin-bottom: 2px;
      }

      .ghost-path-item-points {
        font-size: 0.75rem;
        color: ${Theme.textMuted};
      }

      /* Actions */
      .ghost-path-item-actions {
        display: flex;
        gap: 4px;
        flex-shrink: 0;
      }

      .ghost-path-action-btn {
        width: 32px;
        height: 32px;
        background: transparent;
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 0px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        color: ${Theme.textSecondary};
      }

      .ghost-path-action-btn svg {
        width: 16px;
        height: 16px;
      }

      .ghost-path-action-btn:hover {
        border-color: ${Theme.borderFocus};
        background: ${Theme.componentHoverBackground};
        color: ${Theme.textPrimary};
      }

      .ghost-path-action-btn.active {
        border-color: ${Theme.primary};
        color: ${Theme.primary};
      }

      .ghost-path-action-btn.playing {
        border-color: ${Theme.success};
        color: ${Theme.success};
      }

      .ghost-path-action-btn.disabled,
      .ghost-path-action-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        pointer-events: none;
      }

      .ghost-path-action-btn-danger:hover {
        border-color: ${Theme.error};
        background: rgba(255, 68, 68, 0.1);
        color: ${Theme.error};
      }

      /* Empty state */
      .ghost-path-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 20px;
        text-align: center;
      }

      .ghost-path-empty-message {
        font-size: 1.1rem;
        font-weight: 500;
        color: ${Theme.textSecondary};
        margin-bottom: 8px;
      }

      .ghost-path-empty-description {
        font-size: 0.9rem;
        color: ${Theme.textMuted};
        max-width: 300px;
        line-height: 1.4;
      }

      /* Edit dialog */
      .ghost-edit-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.7);
        z-index: 2200;
        opacity: 0;
        visibility: hidden;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(4px);
      }

      .ghost-edit-dialog-overlay.visible {
        opacity: 1;
        visibility: visible;
      }

      .ghost-edit-dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.95);
        width: 400px;
        max-width: 90vw;
        background: ${Theme.sidebarBackground};
        border: 1px solid ${Theme.borderPrimary};
        border-radius: 0px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        opacity: 0;
        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
          opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }

      .ghost-edit-dialog.visible {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }

      .ghost-edit-dialog-header {
        padding: 16px 20px;
        background: ${Theme.primary};
        color: ${Theme.textPrimary};
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .ghost-edit-dialog-title {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .ghost-edit-dialog-close {
        background: transparent;
        border: none;
        color: ${Theme.textPrimary};
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .ghost-edit-dialog-close:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .ghost-edit-dialog-content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .ghost-edit-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .ghost-edit-field label {
        font-size: 0.8rem;
        font-weight: 600;
        color: ${Theme.textSecondary};
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .ghost-edit-input {
        width: 100%;
        height: 40px;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 0px;
        color: ${Theme.textPrimary};
        font-family: inherit;
        font-size: 0.95rem;
        padding: 0 12px;
        transition: border-color 0.2s ease;
        box-sizing: border-box;
      }

      .ghost-edit-input:focus {
        border-color: ${Theme.borderFocus};
        outline: none;
      }

      .ghost-edit-input::placeholder {
        color: ${Theme.textMuted};
      }

      .ghost-edit-color-container {
        display: flex;
        align-items: center;
      }

      .ghost-edit-dialog-footer {
        padding: 16px 20px;
        background: ${Theme.componentBackground};
        border-top: 1px solid ${Theme.borderSecondary};
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }

      /* Dialog buttons */
      .ghost-edit-dialog-footer .dialog-button {
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

      .ghost-edit-dialog-footer .dialog-button-secondary {
        background: ${Theme.componentBackground};
        color: ${Theme.textSecondary};
        border: 1px solid ${Theme.borderSecondary};
      }

      .ghost-edit-dialog-footer .dialog-button-secondary:hover {
        background: ${Theme.componentHoverBackground};
        color: ${Theme.textPrimary};
        border-color: ${Theme.primary};
      }

      .ghost-edit-dialog-footer .dialog-button-primary {
        background: ${Theme.primary};
        color: ${Theme.textPrimary};
        border: 1px solid ${Theme.primary};
      }

      .ghost-edit-dialog-footer .dialog-button-primary:hover {
        background: ${Theme.primaryHover};
        border-color: ${Theme.primaryHover};
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
    `;

    document.head.appendChild(style);
  }

  destroy() {
    this.hide();
    this.ghostPathManager = null;
    this.ghostPathRenderer = null;
    document.querySelector("#ghost-path-dialog-styles")?.remove();
  }
}

// Singleton instance
let ghostPathDialogInstance = null;

/**
 * Get or create the singleton ghost path dialog instance
 */
export function getGhostPathDialog() {
  if (!ghostPathDialogInstance) {
    ghostPathDialogInstance = new GhostPathDialog();
  }
  return ghostPathDialogInstance;
}

/**
 * Show the ghost path dialog
 */
export function showGhostPathDialog() {
  const dialog = getGhostPathDialog();
  dialog.show();
}

export function destroyGhostPathDialog() {
  if (ghostPathDialogInstance) {
    ghostPathDialogInstance.destroy();
    ghostPathDialogInstance = null;
  }
}
