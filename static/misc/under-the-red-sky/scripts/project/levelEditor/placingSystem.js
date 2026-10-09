// Main Placing System for Level Editor
// Integrates inventory bar, preset dialog, and placement system

import { destroyInventoryBar, initializeInventoryBar } from "./inventoryBar.js";
import { destroyPresetDialog, initializePresetDialog } from "./presetDialog.js";
import {
  destroyPresetManager,
  initializePresetManager,
} from "./objectPresets.js";
import {
  destroyPlacementSystem,
  initializePlacementSystem,
} from "./placementSystem.js";

export class PlacingSystem {
  constructor(runtime, options = {}) {
    this.runtime = runtime;
    this.options = {
      slotCount: options.slotCount || 3,
      autoShow: options.autoShow !== false, // Default to true
      ...options,
    };

    // Component instances
    this.inventoryBar = null;
    this.presetDialog = null;
    this.presetManager = null;
    this.placementSystem = null;

    // State
    this.isEnabled = false;
    this.isVisible = false;

    // Event callbacks
    this.onPlacementConfirm = options.onPlacementConfirm || null;
    this.onPlacementCancel = options.onPlacementCancel || null;
    this.onPresetSelected = options.onPresetSelected || null;

    this.init();
  }

  init() {
    this.initializeComponents();
    this.setupEventHandlers();

    if (this.options.autoShow) {
      this.show();
      // Load default presets when system starts
      this.loadDefaultPresets();
    }
  }

  initializeComponents() {
    // Initialize preset manager first (required by other components)
    this.presetManager = initializePresetManager();

    // Initialize placement system
    this.placementSystem = initializePlacementSystem(this.runtime, {
      onPlacementConfirm: (preset, position, instance) => {
        this.handlePlacementConfirm(preset, position, instance);
      },
      onPlacementCancel: (preset) => {
        this.handlePlacementCancel(preset);
      },
    });

    // Initialize inventory bar
    this.inventoryBar = initializeInventoryBar(document.body, {
      slotCount: this.options.slotCount,
      onSlotSelect: (slotIndex, slot) => {},
      onSlotClick: (slotIndex, slot) => {
        this.handleSlotClick(slotIndex, slot);
      },
      onSlotsChange: (presetIds) => {
        this.handleInventorySlotsChange(presetIds);
      },
    });

    // Initialize preset dialog
    this.presetDialog = initializePresetDialog(document.body, {
      onPresetSelect: (preset) => {
        this.handlePresetSelect(preset);
      },
      onClose: () => {
        this.handleDialogClose();
      },
    });
  }

  setupEventHandlers() {
    // Handle number key shortcuts for slot selection (only when placing system is visible)
    this.boundKeyDown = (e) => {
      if (this.isVisible && !this.isInputFocused()) {
        // Number keys 1-9 for slot selection
        const keyNum = parseInt(e.key);
        if (keyNum >= 1 && keyNum <= this.options.slotCount) {
          e.preventDefault();
          this.inventoryBar.selectSlot(keyNum - 1);
        }
      }

      if (e.key === "Escape") {
        if (this.placementSystem.isPlacementActive()) {
          // Cancel active placement
          this.placementSystem.cancelPlacement();
        } else if (this.presetDialog.isVisible) {
          // Close preset dialog
          this.presetDialog.hide();
        }
      }
    };
    document.addEventListener("keydown", this.boundKeyDown);
  }

  // Handle inventory slot click (open preset dialog)
  handleSlotClick(slotIndex, slot) {
    console.log(`Clicked slot ${slotIndex + 1}`);

    // Get currently selected preset ID to highlight it
    const currentPresetId = slot.preset?.id || null;

    // Show preset dialog to select a preset for this slot
    this.currentSlotForDialog = slotIndex;
    this.presetDialog.show(currentPresetId);
  }

  // Handle preset selection from dialog
  handlePresetSelect(preset) {
    console.log(`Selected preset: ${preset.name}`);

    // Set preset to the current slot
    if (this.currentSlotForDialog !== undefined) {
      this.inventoryBar.setSlotPreset(this.currentSlotForDialog, preset);

      // Auto-select this slot
      this.inventoryBar.selectSlot(this.currentSlotForDialog);

      // Clear dialog slot reference
      this.currentSlotForDialog = undefined;

      // Trigger callback
      if (this.onPresetSelected) {
        this.onPresetSelected(preset, this.currentSlotForDialog);
      }
    }
  }

  // Persist inventory bar slot changes to project shared data
  handleInventorySlotsChange(presetIds) {
    const projectManager = globalThis._editorScope?.projectManager;
    if (!projectManager || !projectManager.hasProjectLoaded()) return;
    try {
      projectManager.updateSharedData({ inventorySlots: presetIds });
    } catch (e) {
      console.error("[PlacingSystem] Failed to persist inventory slots:", e);
    }
  }

  // Handle dialog close
  handleDialogClose() {
    this.currentSlotForDialog = undefined;
  }

  // Handle placement confirmation
  handlePlacementConfirm(preset, position, instance) {
    console.log(`Placed ${preset.name} at`, position);

    // Trigger callback
    if (this.onPlacementConfirm) {
      this.onPlacementConfirm(preset, position, instance);
    }
  }

  // Handle placement cancellation
  handlePlacementCancel(preset) {
    console.log(`Cancelled placement of ${preset?.name || "unknown"}`);

    // Trigger callback
    if (this.onPlacementCancel) {
      this.onPlacementCancel(preset);
    }
  }

  // Check if an input is focused (to avoid keyboard shortcut conflicts)
  isInputFocused() {
    const activeElement = document.activeElement;
    return (
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.contentEditable === "true")
    );
  }

  // Show the placing system
  show() {
    if (this.isVisible) return;

    this.isVisible = true;
    this.isEnabled = true;

    // Show inventory bar
    this.inventoryBar.show();

    console.log("Placing system enabled");
  }

  // Hide the placing system
  hide() {
    if (!this.isVisible) return;

    this.isVisible = false;
    this.isEnabled = false;

    // Cancel any active placement
    if (this.placementSystem.isPlacementActive()) {
      this.placementSystem.cancelPlacement();
    }

    // Hide components
    this.inventoryBar.hide();
    this.presetDialog.hide();

    console.log("Placing system disabled");
  }

  // Toggle the placing system
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  // Check if placing system is visible
  isVisible() {
    return this.isVisible;
  }

  // Check if placing system is enabled
  isEnabled() {
    return this.isEnabled;
  }

  // Get current status
  getStatus() {
    return {
      isVisible: this.isVisible,
      isEnabled: this.isEnabled,
      isPlacementActive: this.placementSystem?.isPlacementActive() || false,
      selectedSlot: this.inventoryBar?.selectedSlotIndex,
      selectedPreset: this.inventoryBar?.getSelectedPreset()?.name || null,
      placementStats: this.placementSystem?.getStats() || {},
    };
  }

  // Preset slot management
  setSlotPreset(slotIndex, preset) {
    this.inventoryBar.setSlotPreset(slotIndex, preset);
  }

  clearSlot(slotIndex) {
    this.inventoryBar.clearSlot(slotIndex);
  }

  clearAllSlots() {
    this.inventoryBar.clearAllSlots();
  }

  // Slot count management
  setSlotCount(newCount) {
    this.options.slotCount = newCount;
    this.inventoryBar.setSlotCount(newCount);
  }

  getSlotCount() {
    return this.options.slotCount;
  }

  // Placement settings
  setGridSize(size) {
    this.placementSystem.setGridSize(size);
  }

  setSnapToGrid(enabled) {
    this.placementSystem.setSnapToGrid(enabled);
  }

  setGridHeight(height) {
    this.placementSystem.setGridHeight(height);
  }

  // Quick preset loading (for testing or convenience)
  loadDefaultPresets() {
    // Try to load from project sharedData first
    const projectManager = globalThis._editorScope?.projectManager;
    const presets = this.presetManager.getAllPresets();
    const presetById = new Map(presets.map((p) => [p.id, p]));

    let loadedFromProject = false;
    if (projectManager && projectManager.hasProjectLoaded()) {
      const shared = projectManager.getSharedData();
      const slotData = Array.isArray(shared.inventorySlots)
        ? shared.inventorySlots
        : [];
      if (slotData.length > 0) {
        // Augment map with custom structures from shared data
        const customStructures = Array.isArray(shared.customStructures)
          ? shared.customStructures
          : [];
        for (const cs of customStructures) {
          if (cs && cs.id && !presetById.has(cs.id)) presetById.set(cs.id, cs);
        }
        // Suppress change events during programmatic sync
        this.inventoryBar.setSuppressChangeEvents(true);
        // Fill slots according to saved slot data
        for (let i = 0; i < this.options.slotCount; i++) {
          const slot = slotData[i] || null;
          let preset = null;

          if (slot) {
            // Handle both old format (just ID string) and new format (object with id and overrides)
            const presetId = typeof slot === "string" ? slot : slot.id;
            preset = presetId ? presetById.get(presetId) || null : null;
          }

          this.setSlotPreset(i, preset);

          // Apply parameter overrides if they exist
          if (slot && typeof slot === "object" && slot.parameterOverrides) {
            const inventorySlot = this.inventoryBar.slots[i];
            if (inventorySlot) {
              inventorySlot.parameterOverrides = { ...slot.parameterOverrides };
              this.inventoryBar.updateSlotValueDisplay(i);
              this.inventoryBar.updateSlotVisualIndicator(i);
            }
          }
        }
        this.inventoryBar.setSuppressChangeEvents(false);
        loadedFromProject = true;
      }
    }

    if (!loadedFromProject) {
      // Fallback: load first few presets into slots
      const slotsToFill = Math.min(this.options.slotCount, presets.length);
      for (let i = 0; i < slotsToFill; i++) {
        this.setSlotPreset(i, presets[i]);
      }
      console.log(`Loaded ${slotsToFill} default presets into inventory slots`);
    }

    // Select first slot if available
    if (this.options.slotCount > 0) {
      this.inventoryBar.selectSlot(0);
    }
  }

  // Refresh all components
  refresh() {
    this.presetDialog.refresh();
    this.inventoryBar.updateDisplay();
  }

  // Destroy the placing system
  destroy() {
    if (this.boundKeyDown) {
      document.removeEventListener("keydown", this.boundKeyDown);
    }
    this.boundKeyDown = null;

    // Cancel any active placement
    if (this.placementSystem?.isPlacementActive()) {
      this.placementSystem.cancelPlacement();
    }

    // Destroy components
    if (this.inventoryBar) {
      destroyInventoryBar();
      this.inventoryBar = null;
    }
    if (this.presetDialog) {
      destroyPresetDialog();
      this.presetDialog = null;
    }
    if (this.placementSystem) {
      destroyPlacementSystem();
      this.placementSystem = null;
    }

    if (this.presetManager) {
      destroyPresetManager();
      this.presetManager = null;
    }

    this.isVisible = false;
    this.isEnabled = false;
  }
}

// Global placing system instance
export let placingSystem = null;

// Initialize placing system
export function initializePlacingSystem(runtime, options = {}) {
  if (!placingSystem) {
    placingSystem = new PlacingSystem(runtime, options);
  }
  return placingSystem;
}

export function destroyPlacingSystem() {
  if (placingSystem) {
    placingSystem.destroy();
    placingSystem = null;
  }
}

// Helper functions for easy access
export function showPlacingSystem() {
  if (placingSystem) {
    placingSystem.show();
  }
}

export function hidePlacingSystem() {
  if (placingSystem) {
    placingSystem.hide();
  }
}

export function togglePlacingSystem() {
  if (placingSystem) {
    placingSystem.toggle();
  }
}

export function loadDefaultPresets() {
  if (placingSystem) {
    placingSystem.loadDefaultPresets();
  }
}

export function isPlacingSystemVisible() {
  return placingSystem ? placingSystem.isVisible : false;
}

export function getPlacingSystemStatus() {
  return placingSystem ? placingSystem.getStatus() : null;
}
