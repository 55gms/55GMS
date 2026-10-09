// Custom Structure Dialogs for Level Editor
// Manages creation and management of custom structures

import {
  CUSTOM_STRUCTURE_ICONS,
  Delete,
  Import,
  Export,
  SelectAll,
  Select,
} from "./iconList.js";
import { Theme } from "./inspectorUI.js";
import { ColorPicker, PRESET_COLORS } from "./colorPicker.js";
import { getInstanceBounds } from "./raycast.js";
import { showConfirmDialog } from "./confirmDialog.js";
import {
  getObjectTypeName,
  tagPlaceableObjectTypes,
  ObjectTypeDefinitions,
  types,
} from "./objectTypeDefinitions.js";

export class CustomStructureCreateDialog {
  constructor(container = document.body) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.dialog = null;
    this.overlay = null;
    this.nameInput = null;
    this.descriptionInput = null;
    this.iconPicker = null;
    this.selectedIcon = null;
    this.selectedColor = PRESET_COLORS[0].value;
    this.colorPicker = null;
    this.onConfirm = null; // Optional callback for confirm
    this.isVisible = false;
    this.selection = [];

    // Variable parameter settings
    this.enableVariableParam = false;
    this.selectedVariableParam = null;
    this.supportedParams = [];

    this.applyStyles();
  }

  show() {
    // Check if project is loaded
    const projectManager = globalThis._editorScope?.projectManager;
    if (!projectManager || !projectManager.hasProjectLoaded()) {
      alert(
        "Please create or open a project before creating custom structures.",
      );
      return;
    }

    if (this.overlay && this.dialog) {
      this.overlay.classList.add("visible");
      this.dialog.classList.add("visible");
      this.isVisible = true;
      return;
    }
    this.selection =
      globalThis._editorScope?.selectionManager?.getSelection() || [];
    this.selectionBounds =
      globalThis._editorScope?.selectionManager?.calculateSelectionBounds();
    this.selectedColor = PRESET_COLORS[0].value;

    // Analyze selection for variable parameter support
    this.analyzeSelectionForVariableParams();

    // Overlay
    this.overlay = document.createElement("div");
    this.overlay.className = "custom-structure-dialog-overlay";
    this.overlay.tabIndex = -1;
    this.overlay.addEventListener("mousedown", (e) => {
      if (e.target === this.overlay) this.hide();
    });

    // Dialog
    this.dialog = document.createElement("div");
    this.dialog.className = "custom-structure-dialog";

    // Close button (placed in header)
    const closeButton = document.createElement("button");
    closeButton.className = "custom-structure-dialog-close";
    closeButton.innerHTML = "✕";
    closeButton.addEventListener("click", () => this.hide());

    // Header
    const header = document.createElement("div");
    header.className = "custom-structure-dialog-header";
    const title = document.createElement("h3");
    title.className = "custom-structure-dialog-title";
    title.textContent = "Create Custom Structure";
    header.appendChild(title);
    header.appendChild(closeButton);
    this.dialog.appendChild(header);

    // Content area
    const content = document.createElement("div");
    content.className = "custom-structure-dialog-content";
    this.dialog.appendChild(content);

    // Two-column layout container
    const layoutContainer = document.createElement("div");
    layoutContainer.className = "custom-structure-layout-container";
    content.appendChild(layoutContainer);

    // Left column - Structure card (display only)
    const leftColumn = document.createElement("div");
    leftColumn.className = "custom-structure-left-column";
    const selectionInfo = this.createSelectionInfo();
    leftColumn.appendChild(selectionInfo);
    const structureCard = this.createStructureCard();
    leftColumn.appendChild(structureCard);

    layoutContainer.appendChild(leftColumn);

    // Right column - Editing controls
    const rightColumn = document.createElement("div");
    rightColumn.className = "custom-structure-right-column";
    const editingPanel = this.createEditingPanel();
    rightColumn.appendChild(editingPanel);
    layoutContainer.appendChild(rightColumn);

    // Button row
    const buttonRow = document.createElement("div");
    buttonRow.className = "dialog-footer";
    // Cancel
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "dialog-button dialog-button-secondary";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", () => this.hide());
    buttonRow.appendChild(cancelBtn);
    // Confirm
    const confirmBtn = document.createElement("button");
    confirmBtn.className = "dialog-button dialog-button-primary";
    confirmBtn.textContent = "Create";
    confirmBtn.addEventListener("click", () => {
      const name = this.nameInput?.value?.trim() || "Untitled Structure";
      const description = this.descriptionInput?.value?.trim() || "";
      const icon = this.selectedIcon || Object.keys(CUSTOM_STRUCTURE_ICONS)[0];
      const color = this.selectedColor;
      const selectedObjects = this.selection;

      if (selectedObjects.length === 0) {
        alert("Please select at least one object to create a structure.");
        return;
      }

      try {
        // Create the custom structure
        const structureData = this.createCustomStructure(
          name,
          description,
          icon,
          color,
          selectedObjects,
        );
        if (structureData) {
          // Save the structure
          this.saveCustomStructure(structureData);

          // Show success message
          console.log(
            "[CustomStructureCreateDialog] Structure created:",
            structureData,
          );

          // Hide dialog
          this.hide();

          // Call onConfirm callback if provided
          if (this.onConfirm) this.onConfirm(structureData);
        } else {
          alert("Failed to create structure. Please try again.");
        }
      } catch (error) {
        console.error(
          "[CustomStructureCreateDialog] Error creating structure:",
          error,
        );
        alert(
          "An error occurred while creating the structure. Please try again.",
        );
      }
    });
    buttonRow.appendChild(confirmBtn);
    this.dialog.appendChild(buttonRow);

    // Add dialog to overlay and container
    this.overlay.appendChild(this.dialog);
    this.container.appendChild(this.overlay);
    setTimeout(() => this.overlay.classList.add("visible"), 10);
    setTimeout(() => this.dialog.classList.add("visible"), 10);
    this.isVisible = true;

    // Block all events to the page
    const eventsToBlock = [
      "mousedown",
      "mouseup",
      "mousemove",
      "click",
      "contextmenu",
      "wheel",
      "keydown",
      //"keyup",
      "keypress",
      "touchstart",
      "touchend",
      "touchmove",
    ];
    eventsToBlock.forEach((eventType) => {
      this.dialog.addEventListener(
        eventType,
        (e) => {
          e.stopPropagation();
        },
        { passive: false },
      );
      this.overlay.addEventListener(
        eventType,
        (e) => {
          e.stopPropagation();
        },
        { passive: false },
      );
    });
  }

  createSelectionInfo() {
    const selectedObjects = this.selection;

    const infoContainer = document.createElement("div");
    infoContainer.className = "custom-structure-selection-info";

    // Selection count
    const countText = document.createElement("div");
    countText.className = "custom-structure-selection-count";
    countText.textContent = `${selectedObjects.length} object${
      selectedObjects.length !== 1 ? "s" : ""
    } selected`;
    infoContainer.appendChild(countText);

    return infoContainer;
  }

  hide() {
    if (this.overlay) this.overlay.classList.remove("visible");
    if (this.dialog) this.dialog.classList.remove("visible");
    this.isVisible = false;
    setTimeout(() => {
      if (this.overlay && this.overlay.parentNode)
        this.overlay.parentNode.removeChild(this.overlay);
      this.overlay = null;
      this.dialog = null;
      // Clean up color picker
      if (this.colorPicker) {
        this.colorPicker.destroy();
        this.colorPicker = null;
      }
    }, 200);
  }

  // Generate a UUID for the custom structure
  generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  // Calculate the center of the bottom face of the selection
  calculateSelectionCenter(selectedObjects) {
    if (selectedObjects.length === 0) return { x: 0, y: 0, z: 0 };
    if (selectedObjects.length === 1) {
      return {
        x: selectedObjects[0].x,
        y: selectedObjects[0].y,
        z: selectedObjects[0].zElevation || 0,
      };
    }

    let minX = Infinity,
      maxX = -Infinity;
    let minY = Infinity,
      maxY = -Infinity;
    let minZ = Infinity,
      maxZ = -Infinity;

    selectedObjects.forEach((obj) => {
      // Get individual object bounds
      const bounds = getInstanceBounds(obj) || {
        left: obj.x,
        right: obj.x,
        top: obj.y,
        bottom: obj.y,
        minZ: obj.zElevation || 0,
        maxZ: obj.zElevation || 0,
      };

      minX = Math.min(minX, bounds.left);
      maxX = Math.max(maxX, bounds.right);
      minY = Math.min(minY, bounds.top);
      maxY = Math.max(maxY, bounds.bottom);
      minZ = Math.min(minZ, bounds.minZ);
      maxZ = Math.max(maxZ, bounds.maxZ);
    });

    return {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      z: minZ, // Bottom face center
    };
  }

  // Create the custom structure data
  createCustomStructure(name, description, icon, color, selectedObjects) {
    const stateManager = globalThis._editorScope?.stateManager;
    if (!stateManager) {
      console.error("State manager not available");
      return null;
    }

    // Generate UUID
    const uuid = this.generateUUID();

    const center = {
      x: this.selectionBounds.centerX,
      y: this.selectionBounds.centerY,
      z: this.selectionBounds.minZ,
    };

    // Export instance data
    const objects = selectedObjects
      .map((obj) => {
        const instanceData = stateManager.exportInstanceState(obj);
        if (instanceData) {
          // Calculate offset from center
          // get the position from the object type definition

          const parameters = { ...instanceData.properties };
          const instancePosition = { ...parameters.position.value };
          const positionOffset = {
            x: instancePosition.x - center.x,
            y: instancePosition.y - center.y,
            z: instancePosition.z - center.z,
          };

          Object.keys(parameters).forEach((key) => {
            if (parameters[key].value) {
              parameters[key] = parameters[key].value;
            } else {
              delete parameters[key];
            }
          });

          const rotationOffset = {
            x: 0,
            y: 0,
            z: 0,
          };

          if (parameters.rotation) {
            rotationOffset.x = parameters.rotation.x;
            rotationOffset.y = parameters.rotation.y;
            rotationOffset.z = parameters.rotation.z;
            delete parameters.rotation;
          }
          if (parameters.angle) {
            rotationOffset.z = parameters.angle;
            delete parameters.angle;
          }
          if (parameters.meshRotation) {
            rotationOffset.x = parameters.meshRotation.x;
            rotationOffset.y = parameters.meshRotation.y;
            rotationOffset.z = parameters.meshRotation.z;
            delete parameters.meshRotation;
          }
          if (parameters.position) delete parameters.position;

          return {
            objectType: instanceData.objectType,
            parameters,
            positionOffset,
            rotationOffset,
          };
        }
        return null;
      })
      .filter(Boolean);

    // Check if this should place like a tag:
    // - Must have exactly one object
    // - That object must be a tag-placeable type
    let placeLikeTag = false;
    if (objects.length === 1) {
      placeLikeTag = tagPlaceableObjectTypes.includes(objects[0].objectType);
    }

    const structureData = {
      id: uuid,
      name,
      description,
      icon,
      color,
      objects,
      placeLikeTag,
    };

    // Add variable parameter if enabled
    if (this.enableVariableParam && this.selectedVariableParam) {
      structureData.variableParam = this.selectedVariableParam;
    }

    return structureData;
  }

  // Get object type counts for the structure
  getObjectTypeCounts(selectedObjects) {
    const counts = {};
    selectedObjects.forEach((obj) => {
      const objectType = obj.objectType?.name || "Unknown";
      counts[objectType] = (counts[objectType] || 0) + 1;
    });
    return counts;
  }

  // Save the custom structure
  saveCustomStructure(structureData) {
    const projectManager = globalThis._editorScope?.projectManager;

    if (projectManager && projectManager.hasProjectLoaded()) {
      // Use project data
      const sharedData = projectManager.getSharedData();
      const customStructures = [...(sharedData.customStructures || [])];

      // Add the new structure
      customStructures.push(structureData);

      // Update shared data
      projectManager.updateSharedData({ customStructures });

      console.log(
        `Custom structure "${structureData.name}" saved with ID: ${structureData.id}`,
      );

      // Notify
      globalThis._editorScope?.notifications?.success(
        `Created structure "${structureData.name}"`,
        { title: "Structure" },
      );
    } else {
      // No project loaded - cannot save custom structures
      console.warn("Cannot save custom structure: No project loaded");
      alert(
        "Please create or open a project before creating custom structures.",
      );
      return null;
    }

    return structureData;
  }

  applyStyles() {
    if (document.querySelector("#custom-structure-dialog-styles")) return;
    const style = document.createElement("style");
    style.id = "custom-structure-dialog-styles";
    style.textContent = `
      .custom-structure-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.7);
        z-index: 2100;
        opacity: 0;
        visibility: hidden;
        transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
        backdrop-filter: blur(4px);
      }
      .custom-structure-dialog-overlay.visible {
        opacity: 1;
        visibility: visible;
      }
      .custom-structure-dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.95);
        min-width: 600px;
        width: 700px;
        background: ${Theme.sidebarBackground};
        border: 1px solid ${Theme.borderPrimary};
        border-radius: 0px;
        transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1);
        display: flex;
        flex-direction: column;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        opacity: 0;
      }
      .custom-structure-dialog.visible {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
      .custom-structure-dialog-header {
        padding: 20px 24px;
        background: ${Theme.primary};
        color: ${Theme.textPrimary};
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
      }
      .custom-structure-dialog-title {
        margin: 0;
        color: ${Theme.textPrimary};
        font-size: 1.3rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .custom-structure-dialog-close {
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
      .custom-structure-dialog-close:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: scale(1.1);
      }
      .custom-structure-dialog-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 20px;
        max-height: 70vh;
        overflow-y: auto;
      }

      /* Manager actions toolbar (match projectDataDialog toolbar) */
      .custom-structure-dialog .manager-actions-toolbar {
        position: sticky;
        top: 0;
        z-index: 10;
        background: ${Theme.componentBackground};
        border-bottom: 1px solid ${Theme.borderSecondary};
        padding: 12px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .custom-structure-dialog .manager-actions-left,
      .custom-structure-dialog .manager-actions-right {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .custom-structure-dialog .toolbar-action-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 0px;
        color: ${Theme.textPrimary};
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.85rem;
        font-weight: 500;
      }

      .custom-structure-dialog .toolbar-action-button:hover:not(:disabled) {
        background: ${Theme.primary};
        color: ${Theme.textPrimary};
        border-color: ${Theme.primaryHover};
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      .custom-structure-dialog .toolbar-action-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .custom-structure-dialog .toolbar-action-button-danger {
        background: #dc3545;
        border-color: ${Theme.componentBackground};
        color: white;
      }

      .custom-structure-dialog .toolbar-action-button-danger:hover:not(:disabled) {
        background: #c82333;
        border-color: ${Theme.componentBackground};
        color: white;
      }

      .custom-structure-dialog .toolbar-action-button svg {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
      }

      /* Footer and buttons styled to match confirmDialog */
      .custom-structure-dialog .dialog-footer {
        padding: 20px 24px;
        background: ${Theme.componentBackground};
        border-top: 1px solid ${Theme.borderSecondary};
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }

      .custom-structure-dialog .dialog-button {
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

      .custom-structure-dialog .dialog-button-secondary {
        background: ${Theme.componentBackground};
        color: ${Theme.textSecondary};
        border: 1px solid ${Theme.borderSecondary};
      }

      .custom-structure-dialog .dialog-button-secondary:hover {
        background: ${Theme.componentHoverBackground};
        color: ${Theme.textPrimary};
        border-color: ${Theme.primary};
      }

      .custom-structure-dialog .dialog-button-primary {
        background: ${Theme.primary};
        color: ${Theme.textPrimary};
        border: 1px solid ${Theme.primary};
      }

      .custom-structure-dialog .dialog-button-primary:hover {
        background: ${Theme.primaryHover};
        border-color: ${Theme.primaryHover};
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .custom-structure-dialog .dialog-button:focus {
        outline: 2px solid ${Theme.borderFocus};
        outline-offset: 2px;
      }

      .custom-structure-layout-container {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 20px;
        align-items: start;
      }
      .custom-structure-dialog-content::-webkit-scrollbar {
        width: 14px;
      }
      .custom-structure-dialog-content::-webkit-scrollbar-track {
        background: ${Theme.scrollbarTrack};
      }
      .custom-structure-dialog-content::-webkit-scrollbar-thumb {
        background: ${Theme.scrollbarThumb};
        border-radius: 0px;
        border: 4px solid ${Theme.scrollbarTrack};
        background-clip: content-box;
      }
      .custom-structure-dialog-content::-webkit-scrollbar-thumb:hover {
        background: ${Theme.scrollbarThumbHover};
        border: 4px solid ${Theme.scrollbarTrack};
        background-clip: content-box;
      }
      .custom-structure-selection-info {
        text-align: center;
      }
      .custom-structure-selection-count {
        font-size: 1rem;
        font-weight: 600;
        color: ${Theme.textPrimary};
        margin: 0;
      }

      .custom-structure-dialog-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 12px;
      }
      .custom-structure-confirm {
        background: ${Theme.primary};
        color: ${Theme.textPrimary};
        border: none;
        border-radius: 2px;
        font-size: 0.9rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
        padding: 12px 16px;
      }
      .custom-structure-confirm:hover {
        background: ${Theme.primaryHover};
        transform: translateY(-1px);
      }
      .custom-structure-confirm:active {
        background: ${Theme.primaryDark};
        transform: translateY(0);
      }
      .custom-structure-cancel {
        background: ${Theme.componentBackground};
        color: ${Theme.textPrimary};
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 2px;
        font-size: 0.9rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
        padding: 12px 16px;
      }
      .custom-structure-cancel:hover {
        background: ${Theme.componentHoverBackground};
        border-color: ${Theme.borderFocus};
      }
      .custom-structure-cancel:active {
        background: ${Theme.primaryDark};
        border-color: ${Theme.primary};
      }

      /* Structure Card Styles (matching preset cards) */
      .custom-structure-card {
        width: 100%;
        background: ${Theme.componentBackground};
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 0px;
        transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
        box-sizing: border-box;
        display: flex;
        text-align: center;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px auto;
        position: relative;
      }

      .custom-structure-card-content {
        padding: 10px;
        display: flex;
        text-align: center;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 10px;
        flex: 1;
        width: calc(100% - 20px);
      }

      .custom-structure-card-icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0px;
        background: rgba(0,0,0,0.05);
        border: 1px solid var(--category-color, rgba(74, 158, 255, 0.3));
        color: var(--category-color, #4A9EFF);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .custom-structure-card-icon:hover {
        background: rgba(0,0,0,0.1);
        transform: scale(1.05);
      }

      .custom-structure-card-icon svg {
        width: 32px;
        height: 32px;
        fill: currentColor;
      }

      .custom-structure-card-info {
        flex: 1;
        padding: 0 2px;
      }

      .custom-structure-card-name {
        font-size: 1rem;
        font-weight: 600;
        color: ${Theme.textPrimary};
        margin-bottom: 6px;
        line-height: 1.2;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .custom-structure-card-name:hover {
        color: ${Theme.primary};
      }

      .custom-structure-card-description {
        font-size: 0.8rem;
        color: ${Theme.textSecondary};
        line-height: 1.3;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .custom-structure-card-description:hover {
        color: ${Theme.primary};
      }

      .custom-structure-card-tags {
        display: flex;
        flex-direction: row-reverse;
        gap: 4px;
        overflow-x: auto;
        max-width: 100%;
        width: 100%;
        box-sizing: border-box;
        background: ${Theme.componentDisabledBackground};
        border-top: 1px solid ${Theme.borderSecondary};
        padding: 4px;
        scrollbar-width: thin;
        scrollbar-color: ${Theme.scrollbarThumb} ${Theme.scrollbarTrack};
      }

      .custom-structure-card-tags::-webkit-scrollbar {
        height: 8px;
      }

      .custom-structure-card-tags::-webkit-scrollbar-track {
        background: ${Theme.scrollbarTrack};
      }

      .custom-structure-card-tags::-webkit-scrollbar-thumb {
        background: ${Theme.scrollbarThumb};
        border-radius: 0px;
        border: 2px solid ${Theme.scrollbarTrack};
        background-clip: content-box;
      }

      .custom-structure-card-tags::-webkit-scrollbar-thumb:hover {
        background: ${Theme.scrollbarThumbHover};
        border: 2px solid ${Theme.scrollbarTrack};
        background-clip: content-box;
      }

      .custom-structure-card-type {
        font-size: 0.65rem;
        font-weight: 600;
        color: var(--category-color, ${Theme.primary});
        background: rgba(0,0,0,0.1);
        padding: 3px 6px;
        border-radius: 0px;
        border: 1px solid var(--category-color, rgba(74, 158, 255, 0.3));
        display: inline-block;
        white-space: nowrap;
        flex-shrink: 0;
      }





      /* New styles for two-column layout */
      .custom-structure-layout-container {
        display: flex;
        gap: 20px;
        margin-top: 16px;
        align-items: center;
      }

      .custom-structure-left-column {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 0;
      }

      .custom-structure-right-column {
        flex: 2;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .custom-structure-editing-panel {
        display: flex;
        flex-direction: column;
      }

      .custom-structure-editing-section {
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }

      .custom-structure-editing-label {
        font-size: 0.9rem;
        font-weight: 600;
        color: ${Theme.textSecondary};
        min-width: 40px;
      }

      .custom-structure-icon-selector {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        justify-content: center;
        height: 136px;
        scroll-snap-type: y mandatory;
        scroll-behavior: smooth;
      }

      .custom-structure-icon-selector-btn {
        width: 40px;
        height: 40px;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        color: ${Theme.textPrimary};
        scroll-snap-align: center;
      }

      .custom-structure-icon-selector-btn:hover {
        border: 1px solid ${Theme.borderFocus};
        background: ${Theme.componentHoverBackground};
        transform: scale(1.05);
      }

      .custom-structure-icon-selector-btn.selected {
        border: 1px solid ${Theme.primary};
        background: ${Theme.componentHoverBackground};
        transform: scale(1.1);
      }

      .custom-structure-editing-input {
        flex: 1;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderFocus};
        border-radius: 2px;
        color: ${Theme.textPrimary};
        font-size: 0.9rem;
        font-family: inherit;
        padding: 2px 4px;
        box-sizing: border-box;
      }

      .custom-structure-editing-textarea {
        flex: 1;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderFocus};
        border-radius: 2px;
        color: ${Theme.textPrimary};
        font-size: 0.9rem;
        font-family: inherit;
        padding: 2px 4px;
        box-sizing: border-box;
      }

      /* New styles for editing tabs */
      .custom-structure-editing-tabs {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0px;
        padding: 0px;
        border-top: 1px solid ${Theme.borderSecondary};
      }

      .custom-structure-editing-tab {
        background: ${Theme.componentDisabledBackground};
        border: none;
        padding: 10px;
        font-size: 0.9rem;
        font-weight: 600;
        color: ${Theme.textSecondary};
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
        border: 1px solid ${Theme.borderSecondary};
        border-top: 3px solid transparent;
      }

      .custom-structure-editing-tab.active {
        color: ${Theme.textPrimary};
        background: ${Theme.componentBackground};
        border-top: 3px solid ${Theme.primary};
        border-bottom: 1px solid transparent;
      }

      .custom-structure-editing-tab:hover:not(.active) {
        color: ${Theme.textPrimary};
        background: ${Theme.componentHoverBackground};
      }

      .custom-structure-editing-content {
        display: flex;
        background: ${Theme.componentBackground};
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 0px;
        padding: 12px;
        gap: 12px;
        flex-direction: column;
        gap: 16px;
        height: 100%;
        border-top: none;
      }

      .custom-structure-editing-section {
        display: none;
        height: 100%;
      }

      .custom-structure-editing-section.active {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .custom-structure-editing-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: ${Theme.textSecondary};
        margin-bottom: -4px;
      }

      .custom-structure-icon-selector {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
        gap: 8px;
        padding: 2px;
        overflow-y: auto;
        background: ${Theme.componentBackground};
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 4px;
        width: calc(100% - 4px);
        height: 220px;
        scroll-snap-type: y mandatory;
        scroll-behavior: smooth;
      }

      .custom-structure-icon-selector::-webkit-scrollbar {
        width: 8px;
      }

      .custom-structure-icon-selector::-webkit-scrollbar-track {
        background: transparent;
      }

      .custom-structure-icon-selector::-webkit-scrollbar-thumb {
        background: ${Theme.scrollbarThumb};
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: padding-box;
      }

      .custom-structure-icon-selector::-webkit-scrollbar-thumb:hover {
        background: ${Theme.scrollbarThumbHover};
        border: 2px solid transparent;
        background-clip: padding-box;
      }

      .custom-structure-icon-selector-btn {
        width: 40px;
        height: 40px;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
        color: ${Theme.textPrimary};
        scroll-snap-align: center;
      }

      .custom-structure-icon-selector-btn:hover {
        border-color: ${Theme.borderFocus};
        background: ${Theme.componentHoverBackground};
        transform: translateY(-1px);
      }

      .custom-structure-icon-selector-btn.selected {
        border-color: ${Theme.primary};
        background: ${Theme.componentHoverBackground};
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        color: ${Theme.primary};
      }

      .custom-structure-editing-input {
        width: 100%;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 4px;
        color: ${Theme.textPrimary};
        font-size: 0.9rem;
        font-family: inherit;
        padding: 8px 10px;
        box-sizing: border-box;
        min-height: 40px;
        max-height: 40px;
      }

      .custom-structure-editing-input:focus {
        border-color: ${Theme.borderFocus};
        outline: none;
      }

      .custom-structure-editing-textarea {
        width: 100%;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 4px;
        color: ${Theme.textPrimary};
        font-size: 0.9rem;
        font-family: inherit;
        padding: 8px 10px;
        box-sizing: border-box;
        resize: none;
        min-height: 73px;
        max-height: 73px;
      }

      .custom-structure-editing-textarea:focus {
        border-color: ${Theme.borderFocus};
        outline: none;
      }

      /* New styles for color picker */
      .custom-structure-color-container {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 40px;
      }

      .custom-structure-color-label {
        font-size: 0.9rem;
        font-weight: 600;
        color: ${Theme.textSecondary};
        min-width: 40px;
      }

      /* Variable Parameter Styles */
      .custom-structure-variable-enable-container {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
      }

      .custom-structure-variable-checkbox {
        margin: 0;
        cursor: pointer;
      }

      .custom-structure-variable-checkbox-label {
        cursor: pointer;
        color: ${Theme.textSecondary};
        font-size: 0.9rem;
        user-select: none;
      }

      .custom-structure-editing-select {
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 0;
        padding: 8px 12px;
        color: ${Theme.textPrimary};
        font-size: 0.9rem;
        width: 100%;
        margin-bottom: 16px;
        transition: border-color 0.2s ease;
      }

      .custom-structure-editing-select:focus {
        outline: none;
        border-color: ${Theme.primary};
      }

      .custom-structure-editing-select:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  }

  createStructureCard() {
    const card = document.createElement("div");
    card.className = "custom-structure-card";

    const cardContent = document.createElement("div");
    cardContent.className = "custom-structure-card-content";
    card.appendChild(cardContent);

    // Icon container (display only)
    const iconContainer = document.createElement("div");
    iconContainer.className = "custom-structure-card-icon";
    iconContainer.style.color = this.selectedColor;
    iconContainer.style.borderColor = this.selectedColor + "4D"; // 30% opacity version of the color

    // Default icon
    const defaultIcon = Object.keys(CUSTOM_STRUCTURE_ICONS)[0];
    this.selectedIcon = defaultIcon;
    iconContainer.innerHTML = CUSTOM_STRUCTURE_ICONS[defaultIcon];

    // Make icon clickable to switch to icon tab
    iconContainer.addEventListener("click", () => {
      this.switchEditingMode("icon");
    });
    iconContainer.title = "Click to change icon";

    // Info container
    const info = document.createElement("div");
    info.className = "custom-structure-card-info";

    // Name (display only)
    const nameContainer = document.createElement("div");
    nameContainer.className = "custom-structure-card-name";
    nameContainer.textContent = "Untitled Structure";
    nameContainer.addEventListener("click", () => {
      this.switchEditingMode("text");
      this.nameInput?.focus();
    });
    nameContainer.title = "Click to edit name";
    this.nameInput = nameContainer;
    info.appendChild(nameContainer);

    // Description (display only)
    const descriptionContainer = document.createElement("div");
    descriptionContainer.className = "custom-structure-card-description";
    descriptionContainer.textContent = "Click to add description";
    descriptionContainer.addEventListener("click", () => {
      this.switchEditingMode("text");
      this.descriptionInput?.focus();
    });
    descriptionContainer.title = "Click to edit description";
    this.descriptionInput = descriptionContainer;
    info.appendChild(descriptionContainer);

    cardContent.appendChild(iconContainer);
    cardContent.appendChild(info);

    // Tags container (bottom, like preset dialog)
    const tagsContainer = document.createElement("div");
    tagsContainer.className = "custom-structure-card-tags";

    // Get object type counts for tags
    const selectedObjects =
      globalThis._editorScope?.selectionManager?.getSelection() || [];
    const objectTypeCounts = new Map();
    selectedObjects.forEach((obj) => {
      const objectType = obj.objectType?.name || "Unknown";
      objectTypeCounts.set(
        objectType,
        (objectTypeCounts.get(objectType) || 0) + 1,
      );
    });

    // Create tags
    objectTypeCounts.forEach((count, objectType) => {
      const tag = document.createElement("div");
      tag.className = "custom-structure-card-type";
      tag.textContent =
        count > 1
          ? `${getObjectTypeName(objectType)} (${count})`
          : getObjectTypeName(objectType);
      tag.style.background = "rgba(0,0,0,0.1)";
      tag.style.color = this.selectedColor;
      tag.style.borderColor = this.selectedColor + "4D";
      tagsContainer.appendChild(tag);
    });

    card.appendChild(tagsContainer);

    return card;
  }

  // Check if selection is eligible for variable parameters
  analyzeSelectionForVariableParams() {
    // Get all supported parameter types for variable params
    const supportedTypes = ["selector", "text", "color", "number"];
    this.supportedParams = [];

    const labelForKey = new Map();
    const paramsByKey = new Map(); // Store param info by key

    // Collect all params from all instances (union)
    for (const selectedObject of this.selection) {
      const objectType = selectedObject.objectType;

      // Check each parameter type to see if it applies to this object type
      ObjectTypeDefinitions[objectType.name].properties.forEach((paramDef) => {
        if (paramDef) {
          const paramKey = paramDef.key;
          const paramType = paramDef.type;

          // Check if this parameter type is supported
          if (supportedTypes.includes(paramType)) {
            const label = paramDef.label || paramKey;

            if (!labelForKey.has(paramKey)) {
              labelForKey.set(paramKey, new Set());
            }
            labelForKey.get(paramKey).add(label);

            // Store param info if not already present
            if (!paramsByKey.has(paramKey)) {
              paramsByKey.set(paramKey, { key: paramKey, type: paramType });
            }
          }
        }
      });
    }

    // Build final supportedParams from all collected keys
    for (const [key, paramInfo] of paramsByKey) {
      const labelSet = labelForKey.get(key);
      this.supportedParams.push({
        key: paramInfo.key,
        label: Array.from(labelSet).join(" / "),
        type: paramInfo.type,
      });
    }

    return this.supportedParams.length > 0;
  }

  createEditingPanel() {
    const panel = document.createElement("div");
    panel.className = "custom-structure-editing-panel";

    // Tab buttons to switch between editing modes
    const tabContainer = document.createElement("div");
    tabContainer.className = "custom-structure-editing-tabs";

    const iconTab = document.createElement("button");
    iconTab.className = "custom-structure-editing-tab active";
    iconTab.textContent = "Icon";
    iconTab.dataset.mode = "icon";
    iconTab.addEventListener("click", () => this.switchEditingMode("icon"));

    const textTab = document.createElement("button");
    textTab.className = "custom-structure-editing-tab";
    textTab.textContent = "Details";
    textTab.dataset.mode = "text";
    textTab.addEventListener("click", () => this.switchEditingMode("text"));

    tabContainer.appendChild(iconTab);
    tabContainer.appendChild(textTab);

    // Add variable parameter tab if supported
    if (this.supportedParams.length > 0) {
      const variableTab = document.createElement("button");
      variableTab.className = "custom-structure-editing-tab";
      variableTab.textContent = "Variable";
      variableTab.dataset.mode = "variable";
      variableTab.addEventListener("click", () =>
        this.switchEditingMode("variable"),
      );
      tabContainer.appendChild(variableTab);
    }

    tabContainer.style.gridTemplateColumns = `repeat(${tabContainer.children.length}, 1fr)`;

    panel.appendChild(tabContainer);

    // Content container for editing sections
    const contentContainer = document.createElement("div");
    contentContainer.className = "custom-structure-editing-content";
    panel.appendChild(contentContainer);

    // Icon selector section
    const iconSection = document.createElement("div");
    iconSection.className = "custom-structure-editing-section active";
    iconSection.dataset.mode = "icon";

    // (Color picker moved to Details tab)

    // Icon selector
    const iconLabel = document.createElement("label");
    iconLabel.className = "custom-structure-editing-label";
    iconLabel.textContent = "Select Icon";
    iconSection.appendChild(iconLabel);

    const iconSelector = document.createElement("div");
    iconSelector.className = "custom-structure-icon-selector";

    // Create icon buttons
    for (const iconName in CUSTOM_STRUCTURE_ICONS) {
      const iconSVG = CUSTOM_STRUCTURE_ICONS[iconName];
      const iconBtn = document.createElement("button");
      iconBtn.type = "button";
      iconBtn.className = "custom-structure-icon-selector-btn";
      iconBtn.innerHTML = iconSVG;
      iconBtn.title = iconName;

      if (iconName === this.selectedIcon) {
        iconBtn.classList.add("selected");
      }

      iconBtn.addEventListener("click", () => {
        // Update selected icon
        this.selectedIcon = iconName;

        // Update card icon
        const cardIcon = document.querySelector(".custom-structure-card-icon");
        if (cardIcon) {
          cardIcon.innerHTML = iconSVG;
        }

        // Update selected state
        iconSelector
          .querySelectorAll(".custom-structure-icon-selector-btn")
          .forEach((btn) => {
            btn.classList.remove("selected");
          });
        iconBtn.classList.add("selected");
      });

      iconSelector.appendChild(iconBtn);
    }

    iconSection.appendChild(iconSelector);
    contentContainer.appendChild(iconSection);

    // Text editing section (name + description)
    const textSection = document.createElement("div");
    textSection.className = "custom-structure-editing-section";
    textSection.dataset.mode = "text";

    // Color picker
    const colorLabel = document.createElement("label");
    colorLabel.className = "custom-structure-editing-label";
    colorLabel.textContent = "Color";
    textSection.appendChild(colorLabel);

    const colorContainer = document.createElement("div");
    colorContainer.className = "custom-structure-color-container";
    this.colorPicker = new ColorPicker({
      value: this.selectedColor,
      onChange: (color) => {
        this.selectedColor = color;
        // Update card icon color
        const cardIcon = document.querySelector(".custom-structure-card-icon");
        if (cardIcon) {
          cardIcon.style.color = color;
          cardIcon.style.borderColor = color + "4D"; // 30% opacity version of the color
        }
        // Update card tags color
        const cardTags = document.querySelectorAll(
          ".custom-structure-card-type",
        );
        cardTags.forEach((tag) => {
          tag.style.color = color;
          tag.style.borderColor = color + "4D";
        });
      },
    });
    this.colorPicker.mount(colorContainer);
    textSection.appendChild(colorContainer);

    // Name input
    const nameLabel = document.createElement("label");
    nameLabel.className = "custom-structure-editing-label";
    nameLabel.textContent = "Name";
    textSection.appendChild(nameLabel);

    this.nameInput = document.createElement("input");
    this.nameInput.type = "text";
    this.nameInput.className = "custom-structure-editing-input";
    this.nameInput.placeholder = "Enter structure name...";
    this.nameInput.value = "";
    this.nameInput.addEventListener("input", () => {
      // Update card name
      const cardName = document.querySelector(".custom-structure-card-name");
      if (cardName) {
        cardName.textContent = this.nameInput.value || "Untitled Structure";
      }
    });
    textSection.appendChild(this.nameInput);

    // Description input
    const descriptionLabel = document.createElement("label");
    descriptionLabel.className = "custom-structure-editing-label";
    descriptionLabel.textContent = "Description";
    textSection.appendChild(descriptionLabel);

    this.descriptionInput = document.createElement("textarea");
    this.descriptionInput.className = "custom-structure-editing-textarea";
    this.descriptionInput.placeholder = "Enter structure description...";
    this.descriptionInput.rows = 4;
    this.descriptionInput.addEventListener("input", () => {
      // Update card description
      const cardDescription = document.querySelector(
        ".custom-structure-card-description",
      );
      if (cardDescription) {
        cardDescription.textContent =
          this.descriptionInput.value || "Click to add description";
      }
    });
    textSection.appendChild(this.descriptionInput);
    contentContainer.appendChild(textSection);

    // Variable parameter section (only if supported)
    if (this.supportedParams.length > 0) {
      const variableSection = document.createElement("div");
      variableSection.className = "custom-structure-editing-section";
      variableSection.dataset.mode = "variable";

      // Enable checkbox
      const enableLabel = document.createElement("label");
      enableLabel.className = "custom-structure-editing-label";
      enableLabel.textContent = "Enable Variable Parameter";
      variableSection.appendChild(enableLabel);

      const enableContainer = document.createElement("div");
      enableContainer.className = "custom-structure-variable-enable-container";

      const enableCheckbox = document.createElement("input");
      enableCheckbox.type = "checkbox";
      enableCheckbox.className = "custom-structure-variable-checkbox";
      enableCheckbox.id = "enableVariableParam";
      enableCheckbox.checked = this.enableVariableParam;
      enableCheckbox.addEventListener("change", (e) => {
        this.enableVariableParam = e.target.checked;
        parameterSelect.disabled = !this.enableVariableParam;
        if (!this.enableVariableParam) {
          this.selectedVariableParam = null;
          parameterSelect.selectedIndex = 0;
        }
      });

      const enableCheckboxLabel = document.createElement("label");
      enableCheckboxLabel.htmlFor = "enableVariableParam";
      enableCheckboxLabel.className =
        "custom-structure-variable-checkbox-label";
      enableCheckboxLabel.textContent =
        "Allow a parameter to be customized in presets";

      enableContainer.appendChild(enableCheckbox);
      enableContainer.appendChild(enableCheckboxLabel);
      variableSection.appendChild(enableContainer);

      // Parameter dropdown
      const paramLabel = document.createElement("label");
      paramLabel.className = "custom-structure-editing-label";
      paramLabel.textContent = "Parameter";
      variableSection.appendChild(paramLabel);

      const parameterSelect = document.createElement("select");
      parameterSelect.className = "custom-structure-editing-select";
      parameterSelect.disabled = !this.enableVariableParam;

      // Add default option
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Select a parameter...";
      parameterSelect.appendChild(defaultOption);

      // Add supported parameters
      this.supportedParams.forEach((param) => {
        const option = document.createElement("option");
        option.value = param.key;
        option.textContent = `${param.label} (${param.type})`;
        parameterSelect.appendChild(option);
      });

      parameterSelect.addEventListener("change", (e) => {
        this.selectedVariableParam = e.target.value || null;
      });

      variableSection.appendChild(parameterSelect);
      contentContainer.appendChild(variableSection);
    }

    return panel;
  }

  switchEditingMode(mode) {
    // Update tab buttons based on data-mode
    const tabs = document.querySelectorAll(".custom-structure-editing-tab");
    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.mode === mode);
    });

    // Update content sections
    const sections = document.querySelectorAll(
      ".custom-structure-editing-section",
    );
    sections.forEach((section) => {
      section.classList.toggle("active", section.dataset.mode === mode);
    });
  }
}

export class CustomStructuresManagerDialog {
  constructor(container = document.body) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.dialog = null;
    this.overlay = null;
    this.isVisible = false;
    this.selectedStructures = new Set();
    this.applyStyles();
  }

  show() {
    // Check if project is loaded
    const projectManager = globalThis._editorScope?.projectManager;
    if (!projectManager || !projectManager.hasProjectLoaded()) {
      alert("Please create or open a project to manage custom structures.");
      return;
    }

    if (this.overlay && this.dialog) {
      this.overlay.classList.add("visible");
      this.dialog.classList.add("visible");
      this.isVisible = true;
      return;
    }

    // Overlay
    this.overlay = document.createElement("div");
    this.overlay.className = "custom-structure-dialog-overlay";
    this.overlay.tabIndex = -1;
    this.overlay.addEventListener("mousedown", (e) => {
      if (e.target === this.overlay) this.hide();
    });

    const eventsToBlock = [
      "mousedown",
      "mouseup",
      "mousemove",
      "click",
      "contextmenu",
      "wheel",
      "keydown",
      //"keyup",
      "keypress",
      "touchstart",
      "touchend",
      "touchmove",
    ];
    eventsToBlock.forEach((eventType) => {
      this.overlay.addEventListener(
        eventType,
        (e) => {
          e.stopPropagation();
        },
        { passive: false },
      );
    });

    // Dialog
    this.dialog = document.createElement("div");
    this.dialog.className = "custom-structure-dialog";

    // Close button (placed in header)
    const closeButton = document.createElement("button");
    closeButton.className = "custom-structure-dialog-close";
    closeButton.innerHTML = "✕";
    closeButton.addEventListener("click", () => this.hide());

    // Header
    const header = document.createElement("div");
    header.className = "custom-structure-dialog-header";
    const title = document.createElement("h3");
    title.className = "custom-structure-dialog-title";
    title.textContent = "Custom Structures";
    header.appendChild(title);
    header.appendChild(closeButton);
    this.dialog.appendChild(header);

    // Manager actions toolbar (outside of content)
    this.createManagerActionsToolbar();

    this.createContent();

    // Add dialog to overlay and container
    this.overlay.appendChild(this.dialog);
    this.container.appendChild(this.overlay);
    setTimeout(() => this.overlay.classList.add("visible"), 10);
    setTimeout(() => this.dialog.classList.add("visible"), 10);
    this.isVisible = true;
  }

  createContent() {
    const currentContent = this.dialog.querySelector(
      ".custom-structure-dialog-content",
    );
    if (currentContent) currentContent.remove();

    // Content area
    const content = document.createElement("div");
    content.className = "custom-structure-dialog-content";

    // Load and display structures
    const structures = this.loadStructures();
    if (structures.length === 0) {
      this.showEmptyState(content);
    } else {
      this.showStructuresList(content, structures);
    }

    this.dialog.appendChild(content);
  }
  createManagerActionsToolbar() {
    // Remove existing toolbar if any (when refreshing dialog)
    const existing = this.dialog?.querySelector(".manager-actions-toolbar");
    if (existing) existing.remove();

    const toolbar = document.createElement("div");
    toolbar.className = "manager-actions-toolbar";

    const left = document.createElement("div");
    left.className = "manager-actions-left";

    // Select all / clear selection toggle
    this.selectAllButton = document.createElement("button");
    this.selectAllButton.className = "toolbar-action-button";
    this.selectAllButton.innerHTML = `${SelectAll} Select All`;
    this.selectAllButton.addEventListener("click", () =>
      this.handleSelectAllToggle(),
    );

    const importButton = document.createElement("button");
    importButton.className = "toolbar-action-button";
    importButton.innerHTML = `${Import} Import`;
    importButton.addEventListener("click", () => this.importStructures());

    this.exportButton = document.createElement("button");
    this.exportButton.className = "toolbar-action-button";
    this.exportButton.innerHTML = `${Export} Export All`;
    this.exportButton.addEventListener("click", () => this.exportStructures());

    left.appendChild(this.selectAllButton);
    left.appendChild(importButton);
    left.appendChild(this.exportButton);

    const right = document.createElement("div");
    right.className = "manager-actions-right";

    const deleteButton = document.createElement("button");
    deleteButton.className =
      "toolbar-action-button toolbar-action-button-danger";
    deleteButton.innerHTML = `${Delete} Delete`;
    deleteButton.disabled = true;
    deleteButton.addEventListener("click", () =>
      this.deleteSelectedStructures(),
    );

    right.appendChild(deleteButton);

    toolbar.appendChild(left);
    toolbar.appendChild(right);
    this.dialog.appendChild(toolbar);

    // Initialize state
    this.updateActionButtons();
  }

  handleSelectAllToggle() {
    const structures = this.loadStructures();
    const total = structures.length;
    if (total === 0) return;

    const allSelected = this.selectedStructures.size === total;
    if (allSelected) {
      // Clear selection
      this.selectedStructures.clear();
      this.dialog
        .querySelectorAll(".custom-structure-manager-card.selected")
        .forEach((card) => card.classList.remove("selected"));
    } else {
      // Select all
      structures.forEach((s) => this.selectedStructures.add(s.id));
      this.dialog
        .querySelectorAll(".custom-structure-manager-card")
        .forEach((card) => card.classList.add("selected"));
    }
    this.updateActionButtons();
  }
  updateActionButtons() {
    const deleteButton = this.dialog?.querySelector(
      ".manager-actions-toolbar .toolbar-action-button-danger",
    );
    if (!deleteButton) return;

    const total = this.loadStructures().length;

    if (this.selectedStructures.size > 0) {
      deleteButton.disabled = false;
      this.exportButton.innerHTML = `${Export} Export Selected`;
    } else {
      deleteButton.disabled = true;
      this.exportButton.innerHTML = `${Export} Export All`;
    }

    if (this.selectAllButton) {
      if (total > 0 && this.selectedStructures.size === total) {
        this.selectAllButton.innerHTML = `${Select} Clear Selection`;
      } else {
        this.selectAllButton.innerHTML = `${SelectAll} Select All`;
      }
      this.selectAllButton.disabled = total === 0;
    }
  }

  toggleStructureSelection(id, card) {
    if (this.selectedStructures.has(id)) {
      this.selectedStructures.delete(id);
      card.classList.remove("selected");
    } else {
      this.selectedStructures.add(id);
      card.classList.add("selected");
    }
    this.updateActionButtons();
  }

  async deleteSelectedStructures() {
    if (this.selectedStructures.size === 0) return;

    const count = this.selectedStructures.size;
    const confirmed = await showConfirmDialog({
      title: "Delete Structures",
      message: `Are you sure you want to delete ${count} structure${
        count !== 1 ? "s" : ""
      }?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });

    if (!confirmed) return;

    const structures = this.loadStructures();
    const newStructures = structures.filter(
      (s) => !this.selectedStructures.has(s.id),
    );
    this.saveStructures(newStructures);

    // Remove from UI
    this.selectedStructures.forEach((id) => {
      const card = this.dialog.querySelector(`[data-structure-id="${id}"]`);
      if (card) card.remove();
    });

    // Clear selection
    this.selectedStructures.clear();
    this.updateActionButtons();

    // Show empty state if no structures left
    if (newStructures.length === 0) {
      const content = this.dialog.querySelector(
        ".custom-structure-dialog-content",
      );
      content.innerHTML = "";
      this.showEmptyState(content);
      this.exportButton.disabled = true;
    }

    // Notify
    globalThis._editorScope?.notifications?.warning(
      `Deleted ${count} structure${count !== 1 ? "s" : ""}`,
      { title: "Structure" },
    );

    // Clear any inventory bar slots that reference these deleted structures
    if (globalThis._editorScope?.placingSystem?.inventoryBar) {
      globalThis._editorScope.placingSystem.inventoryBar.clearInvalidCustomStructureSlots();
    }
  }

  showEmptyState(container) {
    const emptyState = document.createElement("div");
    emptyState.className = "custom-structure-empty-state";

    const message = document.createElement("div");
    message.className = "custom-structure-empty-message";
    message.textContent = "No custom structures yet";

    const description = document.createElement("div");
    description.className = "custom-structure-empty-description";
    description.textContent =
      "Select objects and use the 'Create Custom Structure' button to save your first structure, or import them from a file.";

    const importButton = document.createElement("button");
    importButton.className = "custom-structure-action-button";
    importButton.textContent = "Import Structures";
    importButton.addEventListener("click", () => this.importStructures());

    emptyState.appendChild(message);
    emptyState.appendChild(description);
    emptyState.appendChild(importButton);
    container.appendChild(emptyState);
  }

  showStructuresList(container, structures) {
    const list = document.createElement("div");
    list.className = "custom-structure-list";

    structures.forEach((structure) => {
      const card = this.createStructureCard(structure);
      list.appendChild(card);
    });

    container.appendChild(list);
  }

  createStructureCard(structure) {
    const card = document.createElement("div");
    card.className = "custom-structure-manager-card";
    card.dataset.structureId = structure.id;

    // Make entire card selectable
    card.addEventListener("click", () => {
      this.toggleStructureSelection(structure.id, card);
    });

    // Card content
    const content = document.createElement("div");
    content.className = "custom-structure-manager-card-content";

    // Checkbox
    const checkbox = document.createElement("div");
    checkbox.className = "custom-structure-manager-card-checkbox";
    checkbox.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path class="checkbox-bg" d="M3 3h18v18H3z"/>
        <path class="checkbox-check" d="M7 13l3 3 7-7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    content.appendChild(checkbox);

    // Icon
    const iconContainer = document.createElement("div");
    iconContainer.className = "custom-structure-manager-card-icon";
    iconContainer.style.color = structure.color;
    iconContainer.style.borderColor = structure.color + "4D";
    iconContainer.innerHTML = CUSTOM_STRUCTURE_ICONS[structure.icon];
    content.appendChild(iconContainer);

    // Info
    const info = document.createElement("div");
    info.className = "custom-structure-manager-card-info";

    const name = document.createElement("div");
    name.className = "custom-structure-manager-card-name";
    name.textContent = structure.name;
    info.appendChild(name);

    if (structure.description) {
      const description = document.createElement("div");
      description.className = "custom-structure-manager-card-description";
      description.textContent = structure.description;
      info.appendChild(description);
    }

    content.appendChild(info);

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.className = "custom-structure-manager-card-delete";
    deleteButton.innerHTML = "×";
    deleteButton.title = "Delete structure";
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Don't trigger card selection
      this.deleteStructure(structure.id);
    });
    content.appendChild(deleteButton);

    card.appendChild(content);

    // Object type tags
    const tagsContainer = document.createElement("div");
    tagsContainer.className = "custom-structure-manager-card-tags";

    const objectTypes = new Map();
    structure.objects.forEach((obj) => {
      const type = obj.objectType;
      objectTypes.set(type, (objectTypes.get(type) || 0) + 1);
    });

    objectTypes.forEach((count, type) => {
      const tag = document.createElement("div");
      tag.className = "custom-structure-manager-card-tag";
      tag.textContent =
        count > 1
          ? `${getObjectTypeName(type)} (${count})`
          : getObjectTypeName(type);
      tag.style.color = structure.color;
      tag.style.borderColor = structure.color + "4D";
      tagsContainer.appendChild(tag);
    });

    card.appendChild(tagsContainer);

    return card;
  }

  loadStructures() {
    const projectManager = globalThis._editorScope?.projectManager;

    if (projectManager && projectManager.hasProjectLoaded()) {
      // Use project data
      const sharedData = projectManager.getSharedData();
      return sharedData.customStructures || [];
    } else {
      // No project loaded - return empty array
      return [];
    }
  }

  saveStructures(structures) {
    const projectManager = globalThis._editorScope?.projectManager;

    if (projectManager && projectManager.hasProjectLoaded()) {
      // Use project data
      try {
        projectManager.updateSharedData({ customStructures: structures });
      } catch (e) {
        console.error("Failed to save custom structures to project:", e);
        alert("Failed to save changes. Please try again.");
      }
    } else {
      // No project loaded - cannot save
      console.warn("Cannot save custom structures: No project loaded");
      alert(
        "Please create or open a project before modifying custom structures.",
      );
    }
  }

  async deleteStructure(id) {
    const confirmed = await showConfirmDialog({
      title: "Delete Structure",
      message: "Are you sure you want to delete this structure?",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });

    if (!confirmed) return;

    const structures = this.loadStructures();
    const newStructures = structures.filter((s) => s.id !== id);
    this.saveStructures(newStructures);

    // Remove from UI
    const card = this.dialog.querySelector(`[data-structure-id="${id}"]`);
    if (card) {
      card.remove();
      // Show empty state if no structures left
      if (newStructures.length === 0) {
        const content = this.dialog.querySelector(
          ".custom-structure-dialog-content",
        );
        content.innerHTML = "";
        this.showEmptyState(content);
      }
    }

    // Clear any inventory bar slots that reference this deleted structure
    if (globalThis._editorScope?.placingSystem?.inventoryBar) {
      globalThis._editorScope.placingSystem.inventoryBar.clearInvalidCustomStructureSlots();
    }

    // Notify
    globalThis._editorScope?.notifications?.warning(`Structure deleted`, {
      title: "Structure",
    });
  }

  importStructures() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const imported = JSON.parse(text);

        if (!Array.isArray(imported)) {
          throw new Error("Invalid file format");
        }

        // Merge with existing structures, avoiding duplicates by ID
        const existing = this.loadStructures();
        const existingIds = new Set(existing.map((s) => s.id));
        const importedCount = Array.isArray(imported) ? imported.length : 0;
        const duplicatesCount = Array.isArray(imported)
          ? imported.filter((s) => existingIds.has(s.id)).length
          : 0;
        const newStructures = [
          ...existing,
          ...imported.filter((s) => !existingIds.has(s.id)),
        ];

        this.saveStructures(newStructures);

        // Refresh the dialog
        this.createContent();

        // Notify, including duplicates as requested
        globalThis._editorScope?.notifications?.success(
          `Imported ${importedCount} structure${
            importedCount !== 1 ? "s" : ""
          } (${duplicatesCount} duplicate${duplicatesCount !== 1 ? "s" : ""})`,
          { title: "Structure" },
        );
      } catch (error) {
        console.error("Failed to import structures:", error);
        alert(
          "Failed to import structures. Please check the file format and try again.",
        );
      }
    });
    input.click();
  }

  exportStructures() {
    let structures = this.loadStructures();

    // If structures are selected, only export those
    if (this.selectedStructures.size > 0) {
      structures = structures.filter((s) => this.selectedStructures.has(s.id));
    }

    if (structures.length === 0) {
      alert("No structures to export.");
      return;
    }

    const blob = new Blob([JSON.stringify(structures, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "custom-structures.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Notify
    const count = structures.length;
    globalThis._editorScope?.notifications?.info(
      `Exported ${count} structure${count !== 1 ? "s" : ""}`,
      { title: "Structure" },
    );
  }

  hide() {
    if (this.overlay) this.overlay.classList.remove("visible");
    if (this.dialog) this.dialog.classList.remove("visible");
    this.isVisible = false;
    setTimeout(() => {
      if (this.overlay && this.overlay.parentNode)
        this.overlay.parentNode.removeChild(this.overlay);
      this.overlay = null;
      this.dialog = null;
    }, 200);
  }

  applyStyles() {
    if (document.querySelector("#custom-structure-manager-styles")) return;

    const style = document.createElement("style");
    style.id = "custom-structure-manager-styles";
    style.textContent = `
      .custom-structure-empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        text-align: center;
        color: ${Theme.textMuted};
      }

      .custom-structure-empty-message {
        font-size: 1.2rem;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .custom-structure-empty-description {
        font-size: 0.9rem;
        max-width: 300px;
        line-height: 1.4;
        margin-bottom: 24px;
      }

      .custom-structure-action-buttons {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
      }

      .custom-structure-action-buttons-left {
        display: flex;
        gap: 8px;
      }

      .custom-structure-action-button {
        background: ${Theme.componentBackground};
        border: 1px solid ${Theme.borderSecondary};
        color: ${Theme.textPrimary};
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .custom-structure-action-button:hover:not(:disabled) {
        border-color: ${Theme.borderFocus};
        background: ${Theme.componentHoverBackground};
      }

      .custom-structure-action-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .custom-structure-action-button-danger {
        border-color: ${Theme.danger};
        color: ${Theme.danger};
      }

      .custom-structure-action-button-danger:hover:not(:disabled) {
        background: ${Theme.danger} !important;
        color: white !important;
      }

      .custom-structure-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .custom-structure-manager-card {
        background: ${Theme.componentBackground};
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 0px;
        overflow: hidden;
        cursor: pointer;
        user-select: none;
      }

      .custom-structure-manager-card:hover {
        border-color: ${Theme.borderFocus};
        background: ${Theme.componentHoverBackground};
      }

      .custom-structure-manager-card.selected {
        border-color: ${Theme.primary};
        background: ${Theme.componentHoverBackground};
      }

      .custom-structure-manager-card-content {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        position: relative;
      }

      .custom-structure-manager-card-checkbox {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        color: ${Theme.textMuted};
      }

      .custom-structure-manager-card-checkbox svg {
        width: 100%;
        height: 100%;
      }

      .custom-structure-manager-card-checkbox .checkbox-bg {
        fill: none;
      }

      .custom-structure-manager-card-checkbox .checkbox-check {
        opacity: 0;
        transform: scale(0.8);
        transform-origin: center;
        transition: all 0.2s ease;
      }

      .custom-structure-manager-card.selected .custom-structure-manager-card-checkbox {
        color: ${Theme.primary};
      }

      .custom-structure-manager-card.selected .custom-structure-manager-card-checkbox .checkbox-bg {
        fill: currentColor;
      }

      .custom-structure-manager-card.selected .custom-structure-manager-card-checkbox .checkbox-check {
        opacity: 1;
        transform: scale(1);
        stroke: white;
      }

      .custom-structure-manager-card-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        background: rgba(0,0,0,0.05);
        border: 1px solid;
        flex-shrink: 0;
      }

      .custom-structure-manager-card-icon svg {
        width: 24px;
        height: 24px;
        fill: currentColor;
      }

      .custom-structure-manager-card-info {
        flex: 1;
        min-width: 0;
      }

      .custom-structure-manager-card-name {
        font-size: 1rem;
        font-weight: 600;
        color: ${Theme.textPrimary};
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .custom-structure-manager-card-description {
        font-size: 0.85rem;
        color: ${Theme.textSecondary};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .custom-structure-manager-card-delete {
        width: 24px;
        height: 24px;
        background: transparent;
        border: none;
        color: ${Theme.textMuted};
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;
        flex-shrink: 0;
        z-index: 1;
      }

      .custom-structure-manager-card-delete:hover {
        background: ${Theme.danger};
        color: white;
      }

      .custom-structure-manager-card-tags {
        display: flex;
        flex-wrap: nowrap;
        gap: 4px;
        padding: 8px 12px;
        background: ${Theme.componentDisabledBackground};
        border-top: 1px solid ${Theme.borderSecondary};
        overflow-x: auto;
        max-width: 100%;
        scrollbar-width: thin;
        scrollbar-color: ${Theme.scrollbarThumb} ${Theme.scrollbarTrack};
      }

      .custom-structure-manager-card-tags::-webkit-scrollbar {
        height: 6px;
      }

      .custom-structure-manager-card-tags::-webkit-scrollbar-track {
        background: ${Theme.scrollbarTrack};
      }

      .custom-structure-manager-card-tags::-webkit-scrollbar-thumb {
        background: ${Theme.scrollbarThumb};
        border-radius: 0px;
        border: 1px solid ${Theme.scrollbarTrack};
        background-clip: content-box;
      }

      .custom-structure-manager-card-tags::-webkit-scrollbar-thumb:hover {
        background: ${Theme.scrollbarThumbHover};
        border: 1px solid ${Theme.scrollbarTrack};
        background-clip: content-box;
      }

      .custom-structure-manager-card-tag {
        font-size: 0.65rem;
        font-weight: 600;
        background: rgba(0,0,0,0.1);
        padding: 2px 6px;
        border-radius: 0px;
        border: 1px solid;
        display: inline-block;
        white-space: nowrap;
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(style);
  }
}
