// Color Palette Manager for Level Editor
// Manages preset colors and recent colors settings for the color picker

import { Theme } from "./inspectorUI.js";
import { PRESET_COLORS } from "./colorPicker.js";

const DEFAULT_RECENT_COLORS_LIMIT = 12;

// Preset colors are stored as { name, value } so the name is editable and acts
// as the key (scripting's ColorPalette.<Name> reads these). Legacy entries are
// bare hex strings — fall back to the hex as the name so they remain addressable.
function normalizeColorEntry(color) {
  if (typeof color === "string") return { name: color, value: color };
  return { name: color.name ?? color.value, value: color.value };
}

export class ColorPaletteManager {
  constructor(container = document.body) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.dialog = null;
    this.backdrop = null;
    this.isVisible = false;
    this.currentPresetColors = [...PRESET_COLORS];
    this.currentRecentColorsLimit = DEFAULT_RECENT_COLORS_LIMIT;
    this.projectManager = null;

    this.applyStyles();
  }

  show() {
    if (this.isVisible) {
      return;
    }

    this.projectManager = globalThis._editorScope?.projectManager;
    this.loadCurrentSettings();
    this.createDialog();
    this.isVisible = true;

    // Hide tooltip if toolbar is available
    if (globalThis._editorScope?.toolbar) {
      globalThis._editorScope.toolbar.hideTooltip();
    }
  }

  hide() {
    if (!this.isVisible) {
      return;
    }

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

  loadCurrentSettings() {
    // Always load from project data, fallback to defaults
    if (this.projectManager && this.projectManager.hasProjectLoaded()) {
      const sharedData = this.projectManager.getSharedData();
      const savedColors =
        sharedData.colorPaletteSettings?.presetColors || PRESET_COLORS;
      this.currentPresetColors = savedColors.map(normalizeColorEntry);
      this.currentRecentColorsLimit =
        sharedData.colorPaletteSettings?.recentColorsLimit ||
        DEFAULT_RECENT_COLORS_LIMIT;
    } else {
      this.currentPresetColors = PRESET_COLORS.map(normalizeColorEntry);
      this.currentRecentColorsLimit = DEFAULT_RECENT_COLORS_LIMIT;
    }
  }

  saveSettings() {
    const settings = {
      presetColors: this.currentPresetColors,
      recentColorsLimit: this.currentRecentColorsLimit,
    };

    // Always save to project data if available
    if (this.projectManager && this.projectManager.hasProjectLoaded()) {
      const sharedData = this.projectManager.getSharedData();
      sharedData.colorPaletteSettings = settings;
      this.projectManager.updateSharedData(sharedData);
      console.log("[ColorPaletteManager] Settings saved to project:", settings);
    } else {
      console.warn(
        "[ColorPaletteManager] No project loaded, settings cannot be saved",
      );
    }
  }

  createDialog() {
    // Create backdrop
    this.backdrop = document.createElement("div");
    this.backdrop.className = "color-palette-manager-backdrop";
    this.backdrop.addEventListener("click", (e) => {
      if (e.target === this.backdrop) {
        this.hide();
      }
    });
    // Block events on backdrop so they don't reach the editor underneath
    [
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
    ].forEach((eventType) => {
      this.backdrop.addEventListener(
        eventType,
        (e) => {
          e.stopPropagation();
        },
        { passive: false },
      );
    });

    // Create main dialog
    this.dialog = document.createElement("div");
    this.dialog.className = "color-palette-manager";

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
    title.textContent = "Color Palette Manager";

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

    // Preset colors section
    this.createPresetColorsSection(content);

    // Recent colors settings section
    this.createRecentColorsSection(content);

    this.dialog.appendChild(content);
  }

  createPresetColorsSection(parent) {
    const section = document.createElement("div");
    section.className = "palette-section";

    const header = document.createElement("div");
    header.className = "section-header";

    const title = document.createElement("h3");
    title.className = "section-title";
    title.textContent = "Preset Colors";

    const addButton = document.createElement("button");
    addButton.className = "add-color-button";
    addButton.innerHTML = "+ Add Color";
    addButton.addEventListener("click", () => this.addNewColor());

    const resetButton = document.createElement("button");
    resetButton.className = "reset-colors-button";
    resetButton.innerHTML = "Reset to Default";
    resetButton.addEventListener("click", () => this.resetToDefault());

    header.appendChild(title);
    header.appendChild(addButton);
    header.appendChild(resetButton);

    const content = document.createElement("div");
    content.className = "preset-colors-content";

    const colorsGrid = document.createElement("div");
    colorsGrid.className = "preset-colors-grid";
    colorsGrid.id = "presetColorsGrid";

    const editPanel = document.createElement("div");
    editPanel.className = "color-edit-panel";
    editPanel.innerHTML = `
      <div class="edit-panel-title">Edit Selected Color</div>
      <div class="edit-panel-controls">
        <input type="text" class="edit-color-name" id="editColorName" placeholder="Color name" />
        <div class="edit-color-row">
          <input type="color" class="edit-color-input" id="editColorInput" />
          <input type="text" class="edit-color-text" id="editColorText" placeholder="#FFFFFF" />
        </div>
        <button class="delete-color-button" id="deleteColorButton">Delete</button>
      </div>
      <div class="edit-panel-hint">Select a color from the grid to edit</div>
    `;

    this.populatePresetColors(colorsGrid);
    this.setupEditPanel(editPanel);

    content.appendChild(colorsGrid);
    content.appendChild(editPanel);

    section.appendChild(header);
    section.appendChild(content);
    parent.appendChild(section);
  }

  populatePresetColors(container) {
    container.innerHTML = "";

    this.currentPresetColors.forEach((color, index) => {
      const colorSquare = this.createColorSquare(color, index);
      container.appendChild(colorSquare);
    });
  }

  createColorSquare(color, index) {
    const square = document.createElement("div");
    square.className = "color-square";
    square.style.backgroundColor = color.value;
    square.title = `${color.name} (${color.value.toUpperCase()})`;
    square.dataset.index = index;
    square.dataset.color = color.value;

    square.addEventListener("click", () => {
      this.selectColor(index, color);
    });

    return square;
  }

  createRecentColorSquare(color, index) {
    const square = document.createElement("div");
    square.className = "recent-color-square";
    square.style.backgroundColor = color;
    square.title = `${color.toUpperCase()} - Click to remove`;
    square.dataset.index = index;
    square.dataset.color = color;

    const deleteButton = document.createElement("button");
    deleteButton.className = "recent-color-delete";
    deleteButton.innerHTML = "×";
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.deleteRecentColor(index);
    });

    square.appendChild(deleteButton);
    return square;
  }

  selectColor(index, color) {
    // Remove previous selection
    const grid = this.dialog.querySelector("#presetColorsGrid");
    grid
      .querySelectorAll(".color-square")
      .forEach((s) => s.classList.remove("selected"));

    // Add selection to clicked square
    const square = grid.querySelector(`[data-index="${index}"]`);
    if (square) {
      square.classList.add("selected");
    }

    // Update edit panel
    const nameInput = this.dialog.querySelector("#editColorName");
    const colorInput = this.dialog.querySelector("#editColorInput");
    const textInput = this.dialog.querySelector("#editColorText");
    const deleteButton = this.dialog.querySelector("#deleteColorButton");
    const hint = this.dialog.querySelector(".edit-panel-hint");

    if (nameInput && colorInput && textInput && deleteButton && hint) {
      nameInput.value = color.name;
      colorInput.value = color.value;
      textInput.value = color.value.toUpperCase();
      deleteButton.style.display = "block";
      hint.style.display = "none";

      this.selectedColorIndex = index;
    }
  }

  setupEditPanel(editPanel) {
    const nameInput = editPanel.querySelector("#editColorName");
    const colorInput = editPanel.querySelector("#editColorInput");
    const textInput = editPanel.querySelector("#editColorText");
    const deleteButton = editPanel.querySelector("#deleteColorButton");

    if (nameInput) {
      // Update name (the key) when the name input changes.
      nameInput.addEventListener("input", () => {
        this.updateSelectedName(nameInput.value);
      });
    }

    if (colorInput && textInput && deleteButton) {
      // Update color when color input changes
      colorInput.addEventListener("input", () => {
        const newColor = colorInput.value;
        textInput.value = newColor.toUpperCase();
        this.updateSelectedColor(newColor);
      });

      // Update color when text input changes
      textInput.addEventListener("input", () => {
        const newColor = textInput.value;
        if (/^#[0-9A-F]{6}$/i.test(newColor)) {
          colorInput.value = newColor;
          this.updateSelectedColor(newColor);
        }
      });

      // Delete selected color
      deleteButton.addEventListener("click", () => {
        if (this.selectedColorIndex !== undefined) {
          this.deletePresetColor(this.selectedColorIndex);
        }
      });

      // Initially hide delete button and show hint
      deleteButton.style.display = "none";
    }
  }

  updateSelectedColor(newColor) {
    if (this.selectedColorIndex !== undefined) {
      const entry = this.currentPresetColors[this.selectedColorIndex];
      entry.value = newColor;

      // Update the grid square
      const grid = this.dialog.querySelector("#presetColorsGrid");
      const square = grid.querySelector(
        `[data-index="${this.selectedColorIndex}"]`,
      );
      if (square) {
        square.style.backgroundColor = newColor;
        square.title = `${entry.name} (${newColor.toUpperCase()})`;
        square.dataset.color = newColor;
      }
    }
  }

  updateSelectedName(newName) {
    if (this.selectedColorIndex !== undefined) {
      const entry = this.currentPresetColors[this.selectedColorIndex];
      entry.name = newName;

      // Refresh the square tooltip so the new name shows on hover.
      const grid = this.dialog.querySelector("#presetColorsGrid");
      const square = grid.querySelector(
        `[data-index="${this.selectedColorIndex}"]`,
      );
      if (square) {
        square.title = `${newName} (${entry.value.toUpperCase()})`;
      }
    }
  }

  createRecentColorsSection(parent) {
    const section = document.createElement("div");
    section.className = "palette-section";

    const title = document.createElement("h3");
    title.className = "section-title";
    title.textContent = "Recent Colors Settings";

    // Recent colors limit setting
    const limitSection = document.createElement("div");
    limitSection.className = "setting-group";

    const limitLabel = document.createElement("label");
    limitLabel.className = "setting-label";
    limitLabel.textContent = "Number of Recent Colors to Remember";

    const limitInput = document.createElement("input");
    limitInput.type = "number";
    limitInput.className = "setting-input";
    limitInput.value = this.currentRecentColorsLimit;
    limitInput.min = "1";
    limitInput.max = "50";
    limitInput.addEventListener("input", () => {
      this.currentRecentColorsLimit = parseInt(limitInput.value);
    });

    limitSection.appendChild(limitLabel);
    limitSection.appendChild(limitInput);

    // Current recent colors display
    const recentTitle = document.createElement("h4");
    recentTitle.className = "subsection-title";
    recentTitle.textContent = "Current Recent Colors";

    const recentColorsGrid = document.createElement("div");
    recentColorsGrid.className = "recent-colors-grid";
    recentColorsGrid.id = "recentColorsGrid";

    this.populateRecentColors(recentColorsGrid);

    section.appendChild(title);
    section.appendChild(limitSection);
    section.appendChild(recentTitle);
    section.appendChild(recentColorsGrid);
    parent.appendChild(section);
  }

  populateRecentColors(container) {
    container.innerHTML = "";

    // Get recent colors from project data only
    let recentColors = [];
    try {
      if (this.projectManager && this.projectManager.hasProjectLoaded()) {
        const sharedData = this.projectManager.getSharedData();
        recentColors = sharedData.recentColors || [];
      }
    } catch (e) {
      console.warn("[ColorPaletteManager] Failed to load recent colors:", e);
    }

    if (recentColors.length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.className = "empty-message";
      emptyMessage.textContent =
        this.projectManager && this.projectManager.hasProjectLoaded()
          ? "No recent colors yet. Use the color picker to add some!"
          : "No project loaded. Recent colors are only available with an open project.";
      container.appendChild(emptyMessage);
      container.style.display = "block";
      return;
    }

    recentColors.forEach((color, index) => {
      const colorSquare = this.createRecentColorSquare(color, index);
      container.appendChild(colorSquare);
    });
  }

  createFooter() {
    const footer = document.createElement("div");
    footer.className = "dialog-footer";

    const cancelButton = document.createElement("button");
    cancelButton.className = "dialog-button dialog-button-secondary";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", () => this.hide());

    const saveButton = document.createElement("button");
    saveButton.className = "dialog-button dialog-button-primary";
    saveButton.textContent = "Save Changes";
    saveButton.addEventListener("click", () => this.saveChanges());

    footer.appendChild(cancelButton);
    footer.appendChild(saveButton);
    this.dialog.appendChild(footer);
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

  addNewColor() {
    const newColor = { name: "New Color", value: "#ff0000" };
    this.currentPresetColors.push(newColor);
    const grid = this.dialog.querySelector("#presetColorsGrid");
    if (grid) {
      this.populatePresetColors(grid);
      // Auto-select the new color
      const newIndex = this.currentPresetColors.length - 1;
      this.selectColor(newIndex, newColor);
    }
  }

  resetToDefault() {
    const confirmDialog = globalThis._editorScope?.confirmDialog;
    if (confirmDialog) {
      confirmDialog.show({
        title: "Reset Color Palette",
        message:
          "Are you sure you want to reset the preset colors to the default palette? This action cannot be undone.",
        confirmText: "Reset",
        cancelText: "Cancel",
        type: "warning",
        onConfirm: () => {
          this.currentPresetColors = PRESET_COLORS.map(normalizeColorEntry);
          const grid = this.dialog.querySelector("#presetColorsGrid");
          if (grid) {
            this.populatePresetColors(grid);
            this.clearSelection();
          }
        },
      });
    }
  }

  deletePresetColor(index) {
    const confirmDialog = globalThis._editorScope?.confirmDialog;
    if (confirmDialog) {
      confirmDialog.show({
        title: "Delete Color",
        message: "Are you sure you want to delete this preset color?",
        confirmText: "Delete",
        cancelText: "Cancel",
        type: "danger",
        onConfirm: () => {
          this.currentPresetColors.splice(index, 1);
          const grid = this.dialog.querySelector("#presetColorsGrid");
          if (grid) {
            this.populatePresetColors(grid);
            // Clear selection if deleted color was selected
            if (this.selectedColorIndex === index) {
              this.clearSelection();
            } else if (this.selectedColorIndex > index) {
              // Adjust selected index if it was after the deleted color
              this.selectedColorIndex--;
            }
          }
        },
      });
    }
  }

  clearSelection() {
    this.selectedColorIndex = undefined;
    const nameInput = this.dialog.querySelector("#editColorName");
    const deleteButton = this.dialog.querySelector("#deleteColorButton");
    const hint = this.dialog.querySelector(".edit-panel-hint");

    if (nameInput) nameInput.value = "";
    if (deleteButton && hint) {
      deleteButton.style.display = "none";
      hint.style.display = "block";
    }
  }

  deleteRecentColor(index) {
    const confirmDialog = globalThis._editorScope?.confirmDialog;
    if (confirmDialog) {
      confirmDialog.show({
        title: "Delete Recent Color",
        message: "Are you sure you want to delete this recent color?",
        confirmText: "Delete",
        cancelText: "Cancel",
        type: "danger",
        onConfirm: () => {
          // Only work with project data
          try {
            if (this.projectManager && this.projectManager.hasProjectLoaded()) {
              const sharedData = this.projectManager.getSharedData();
              const recentColors = [...(sharedData.recentColors || [])];

              // Remove the color
              recentColors.splice(index, 1);

              // Save back to project
              this.projectManager.updateSharedData({ recentColors });

              // Refresh display
              const grid = this.dialog.querySelector("#recentColorsGrid");
              if (grid) {
                this.populateRecentColors(grid);
              }
            } else {
              alert("No project loaded. Cannot delete recent colors.");
            }
          } catch (e) {
            console.warn(
              "[ColorPaletteManager] Failed to delete recent color:",
              e,
            );
            alert("Failed to delete recent color. Please try again.");
          }
        },
      });
    }
  }

  saveChanges() {
    this.saveSettings();
    this.hide();

    // Notify that settings have changed
    if (globalThis._editorScope?.colorPicker) {
      // If there's a way to refresh color pickers, do it here
      console.log("[ColorPaletteManager] Color palette settings updated");
    }
  }

  applyStyles() {
    if (!document.querySelector("#color-palette-manager-styles")) {
      const style = document.createElement("style");
      style.id = "color-palette-manager-styles";
      style.textContent = `
        /* Color Palette Manager Styles */
        .color-palette-manager-backdrop {
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

        .color-palette-manager-backdrop.visible {
          opacity: 1;
          visibility: visible;
        }

        .color-palette-manager {
          background: ${Theme.sidebarBackground};
          border: 1px solid ${Theme.borderPrimary};
          border-radius: 0px;
          width: 600px;
          max-width: 90vw;
          max-height: 85vh;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          transform: scale(0.9) translateY(-20px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .color-palette-manager.visible {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        .color-palette-manager .dialog-header {
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 0px 0px 0 0;
        }

        .color-palette-manager .dialog-title {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: ${Theme.textPrimary};
        }

        .color-palette-manager .dialog-close {
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

        .color-palette-manager .dialog-close:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        .color-palette-manager .dialog-content {
          padding: 24px;
          overflow-y: auto;
          max-height: calc(85vh - 160px);
        }

        .color-palette-manager .dialog-content::-webkit-scrollbar {
          width: 14px;
        }

        .color-palette-manager .dialog-content::-webkit-scrollbar-track {
          background: ${Theme.scrollbarTrack};
        }

        .color-palette-manager .dialog-content::-webkit-scrollbar-thumb {
          background: ${Theme.scrollbarThumb};
          border-radius: 0px;
          border: 4px solid ${Theme.scrollbarTrack};
          background-clip: content-box;
        }

        .color-palette-manager .dialog-content::-webkit-scrollbar-thumb:hover {
          background: ${Theme.scrollbarThumbHover};
          border: 4px solid ${Theme.scrollbarTrack};
          background-clip: content-box;
        }

        .color-palette-manager .palette-section {
          margin-bottom: 32px;
        }

        .color-palette-manager .palette-section:last-child {
          margin-bottom: 0;
        }

        .color-palette-manager .section-title {
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

        .color-palette-manager .section-title::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 40px;
          height: 2px;
          background: ${Theme.primaryHover};
        }

        .color-palette-manager .subsection-title {
          margin: 20px 0 12px 0;
          color: ${Theme.textSecondary};
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .color-palette-manager .section-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .color-palette-manager .add-color-button {
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
        }

        .color-palette-manager .add-color-button:hover {
          background: ${Theme.primaryHover};
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .color-palette-manager .reset-colors-button {
          background: ${Theme.componentBackground};
          color: ${Theme.textSecondary};
          border: 1px solid ${Theme.borderSecondary};
          padding: 8px 16px;
          border-radius: 0px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .color-palette-manager .reset-colors-button:hover {
          background: ${Theme.componentHoverBackground};
          color: ${Theme.textPrimary};
          border-color: #ffc107;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(255, 193, 7, 0.2);
        }

        .color-palette-manager .preset-colors-content {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .color-palette-manager .preset-colors-grid {
          display: grid;
          grid-template-columns: repeat(6, 40px);
          gap: 8px;
        }

        .color-palette-manager .recent-colors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, 40px);
          gap: 8px;
          max-height: 200px;
          overflow-y: auto;
          padding: 8px 4px;
        }

        .color-palette-manager .color-square {
          width: 40px;
          height: 40px;
          border: 2px solid ${Theme.borderSecondary};
          border-radius: 0;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          box-sizing: border-box;
        }

        .color-palette-manager .color-square:hover {
          border-color: ${Theme.primary};
          transform: scale(1.1);
        }

        .color-palette-manager .color-square.selected {
          border-color: ${Theme.primary};
          border-width: 3px;
          transform: scale(1.05);
          box-shadow: 0 0 8px rgba(0, 122, 204, 0.3);
        }

        .color-palette-manager .recent-color-square {
          width: 40px;
          height: 40px;
          border: 2px solid ${Theme.borderSecondary};
          border-radius: 0;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          box-sizing: border-box;
        }

        .color-palette-manager .recent-color-square:hover {
          border-color: ${Theme.primary};
          transform: scale(1.1);
        }

        .color-palette-manager .recent-color-delete {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 16px;
          height: 16px;
          background: #ff4444;
          color: white;
          border: none;
          border-radius: 0;
          font-size: 10px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .color-palette-manager .recent-color-square:hover .recent-color-delete {
          opacity: 1;
        }

        .color-palette-manager .color-edit-panel {
          width: 200px;
          padding: 16px;
          background: ${Theme.componentBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0;
        }

        .color-palette-manager .edit-panel-title {
          font-weight: 600;
          color: ${Theme.textPrimary};
          margin-bottom: 12px;
          font-size: 0.9rem;
        }

        .color-palette-manager .edit-panel-controls {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .color-palette-manager .edit-color-name {
          width: 100%;
          box-sizing: border-box;
          padding: 8px;
          background: ${Theme.inputBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0;
          color: ${Theme.textPrimary};
          font-family: inherit;
        }

        .color-palette-manager .edit-color-name:focus {
          outline: none;
          border-color: ${Theme.borderFocus};
        }

        /* Swatch + hex field share one row to keep the panel compact. */
        .color-palette-manager .edit-color-row {
          display: flex;
          gap: 8px;
          align-items: stretch;
        }

        .color-palette-manager .edit-color-input {
          flex: 0 0 40px;
          width: 40px;
          height: 36px;
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0;
          cursor: pointer;
          background: ${Theme.inputBackground};
          padding: 0;
        }

        .color-palette-manager .edit-color-input::-webkit-color-swatch-wrapper {
          padding: 0;
        }

        .color-palette-manager .edit-color-input::-webkit-color-swatch {
          border: none;
          border-radius: 0;
        }

        .color-palette-manager .edit-color-text {
          flex: 1;
          min-width: 0;
          box-sizing: border-box;
          padding: 8px;
          background: ${Theme.inputBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0;
          color: ${Theme.textPrimary};
          font-family: monospace;
          text-transform: uppercase;
        }

        .color-palette-manager .edit-color-text:focus {
          outline: none;
          border-color: ${Theme.borderFocus};
        }

        .color-palette-manager .delete-color-button {
          background: #ff4444;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 0;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s ease;
        }

        .color-palette-manager .delete-color-button:hover {
          background: #cc2222;
        }

        .color-palette-manager .edit-panel-hint {
          color: ${Theme.textMuted};
          font-size: 0.8rem;
          font-style: italic;
          text-align: center;
          margin-top: 8px;
        }



        .color-palette-manager .setting-group {
          margin-bottom: 20px;
        }

        .color-palette-manager .setting-label {
          display: block;
          font-weight: 600;
          color: ${Theme.textSecondary};
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .color-palette-manager .setting-input {
          width: 100px;
          padding: 8px 12px;
          background: ${Theme.inputBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0px;
          color: ${Theme.textPrimary};
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .color-palette-manager .setting-input:focus {
          outline: none;
          border-color: ${Theme.borderFocus};
          background: ${Theme.inputFocusBackground};
        }

        .color-palette-manager .empty-message {
          padding: 40px 20px;
          text-align: center;
          color: ${Theme.textMuted};
          font-style: italic;
          background: ${Theme.componentBackground};
          border-radius: 0px;
          border: 1px solid ${Theme.borderSecondary};
        }

        .color-palette-manager .dialog-footer {
          padding: 20px 24px;
          background: ${Theme.componentBackground};
          border-top: 1px solid ${Theme.borderSecondary};
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .color-palette-manager .dialog-button {
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

        .color-palette-manager .dialog-button-secondary {
          background: ${Theme.componentBackground};
          color: ${Theme.textSecondary};
          border: 1px solid ${Theme.borderSecondary};
        }

        .color-palette-manager .dialog-button-secondary:hover {
          background: ${Theme.componentHoverBackground};
          color: ${Theme.textPrimary};
          border-color: ${Theme.primary};
        }

        .color-palette-manager .dialog-button-primary {
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
          border: 1px solid ${Theme.primary};
        }

        .color-palette-manager .dialog-button-primary:hover {
          background: ${Theme.primaryHover};
          border-color: ${Theme.primaryHover};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .color-palette-manager {
            width: 95vw;
            max-height: 90vh;
          }
          
          .color-palette-manager .colors-grid {
            grid-template-columns: 1fr;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  destroy() {
    this.hide();

    const styles = document.querySelector("#color-palette-manager-styles");
    if (styles) {
      styles.remove();
    }
  }
}

// Singleton for easier access
let colorPaletteManagerInstance = null;

export function initializeColorPaletteManager() {
  if (!colorPaletteManagerInstance) {
    colorPaletteManagerInstance = new ColorPaletteManager();
  }
  return colorPaletteManagerInstance;
}

export function getColorPaletteManager() {
  return colorPaletteManagerInstance;
}

export function destroyColorPaletteManager() {
  if (colorPaletteManagerInstance) {
    colorPaletteManagerInstance.destroy();
    colorPaletteManagerInstance = null;
  }
}
