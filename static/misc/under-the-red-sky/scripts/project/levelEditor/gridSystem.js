// Grid System for Level Editor
// Handles grid drawing, snapping, and Z-axis positioning
import { hexToRgb } from "./objectTypeDefinitions.js";

export class GridSystem {
  constructor(runtime, gizmoManager) {
    this.runtime = runtime;
    this.gizmoManager = gizmoManager;

    // Grid state
    this.isEnabled = true;
    this.zPosition = 0; // Current Z position of the grid
    this.gridSize = { x: 64, y: 64, z: 64 }; // Grid snapping size
    this.levelSize = { width: 3000, height: 3000 }; // Level dimensions
    this.angleSnap = 15; // Angle snapping
    this.backgroundColor = "#1a1a1a"; // Background color
    this.gridColor = "#4d4d4d"; // Grid color

    // Grid gizmo ID
    this.gridGizmoId = null;
    this.gridPlaneGizmoId = null;

    // Event callbacks
    this.onGridSettingsChanged = null;
  }

  // Create the grid gizmo
  createGridGizmo() {
    if (this.gridGizmoId) {
      this.gizmoManager.deleteGizmo(this.gridGizmoId);
      if (this.gridPlaneGizmoId) {
        this.gizmoManager.deleteGizmo(this.gridPlaneGizmoId);
      }
    }

    // Parse grid color and convert to RGBA array
    const gridColorArray = hexToRgb(this.gridColor);

    this.gridGizmoId = this.gizmoManager.createGizmo(
      "grid2D",
      {
        startX: 0,
        startY: 0,
        width: this.levelSize.width,
        height: this.levelSize.height,
        spacingX: this.gridSize.x, // Separate X spacing
        spacingY: this.gridSize.y, // Separate Y spacing
        color: [...gridColorArray, 0.8], // Use configurable grid color
        lineWidth: 1,
        zPosition: this.zPosition, // Pass Z position to gizmo
      },
      ["grid"],
      false, // Not interactive
      "Grid"
    );

    // Apply background color to the layout
    this.applyBackgroundColor();

    // this.gridPlaneGizmoId = this.gizmoManager.createGizmo(
    //   "plane2D",
    //   {
    //     x: 0,
    //     y: 0,
    //     z: this.zPosition,
    //     width: this.levelSize.width,
    //     height: this.levelSize.height,
    //     filled: true,
    //     color: [0, 0, 0, 0.5],
    //   },
    //   ["grid"],
    //   false, // Not interactive
    //   "Grid"
    // );
  }

  // Update grid Z position
  setZPosition(z) {
    const newZPosition = Math.max(0, Math.min(1000, z));
    const zDelta = newZPosition - this.zPosition;

    // Move camera along with grid height change
    if (zDelta !== 0 && globalThis._editorScope?.cameraController) {
      const cameraController = globalThis._editorScope.cameraController;
      const currentPosition = cameraController.getPosition();
      const currentTarget = cameraController.getTarget();

      // Move both camera position and target by the same Z offset
      // This maintains the camera's viewing angle while following the grid
      cameraController.setPosition(
        currentPosition[0],
        currentPosition[1],
        currentPosition[2] + zDelta
      );
      cameraController.setTarget(
        currentTarget[0],
        currentTarget[1],
        currentTarget[2] + zDelta
      );
    }

    this.zPosition = newZPosition;
    this.updateGridGizmo();

    if (this.onGridSettingsChanged) {
      this.onGridSettingsChanged();
    }
  }

  // Get current Z position
  getZPosition() {
    return this.zPosition;
  }

  // Set grid size for snapping
  setGridSize(size) {
    this.gridSize = { ...size };
    this.updateGridGizmo();

    if (this.onGridSettingsChanged) {
      this.onGridSettingsChanged();
    }
  }

  // Get grid size
  getGridSize() {
    return { ...this.gridSize };
  }

  // Set level size (affects grid coverage)
  setLevelSize(size) {
    this.levelSize = { ...size };
    this.updateGridGizmo();
  }

  // Enable/disable grid snapping
  setSnapToGrid(enabled) {
    this.isEnabled = enabled;

    if (this.onGridSettingsChanged) {
      this.onGridSettingsChanged();
    }
  }

  setAngleSnap(angleSnap) {
    this.angleSnap = angleSnap;
  }

  getAngleSnap() {
    return this.angleSnap;
  }

  // Set background color
  setBackgroundColor(color) {
    this.backgroundColor = color;
    this.applyBackgroundColor();

    if (this.onGridSettingsChanged) {
      this.onGridSettingsChanged();
    }
  }

  // Get background color
  getBackgroundColor() {
    return this.backgroundColor;
  }

  // Set grid color
  setGridColor(color) {
    this.gridColor = color;
    this.updateGridGizmo();

    if (this.onGridSettingsChanged) {
      this.onGridSettingsChanged();
    }
  }

  // Get grid color
  getGridColor() {
    return this.gridColor;
  }

  // Apply background color to the layout
  applyBackgroundColor() {
    const layer = globalThis._editorScope?.runtime?.layout.getLayer(0);
    if (layer) {
      layer.backgroundColor = hexToRgb(this.backgroundColor);
    }
  }

  // Check if grid snapping is enabled
  isSnapToGridEnabled() {
    return this.isEnabled;
  }

  shouldSnapToGrid(options = {}) {
    let shouldSnap = this.isEnabled;
    let shiftPressed = false;
    if (typeof options.shiftPressed === "boolean") {
      shiftPressed = options.shiftPressed;
    } else if (globalThis._editorScope?.runtime?.keyboard) {
      const keyboard = globalThis._editorScope.runtime.keyboard;
      shiftPressed =
        keyboard.isKeyDown("ShiftLeft") ||
        keyboard.isKeyDown("ShiftRight") ||
        keyboard.isKeyDown("Shift");
    }
    // Invert snapping if shift is pressed
    if (shiftPressed) {
      shouldSnap = !this.isEnabled;
    }
    return shouldSnap;
  }

  // Snap position to grid with axis-specific options
  snapToGrid(position, options = {}) {
    if (!this.shouldSnapToGrid(options)) {
      return { ...position };
    }
    const { ignoreX = false, ignoreY = false, ignoreZ = false } = options;
    return {
      x: ignoreX
        ? position.x
        : Math.round(position.x / this.gridSize.x) * this.gridSize.x,
      y: ignoreY
        ? position.y
        : Math.round(position.y / this.gridSize.y) * this.gridSize.y,
      z: ignoreZ
        ? position.z
        : Math.round(position.z / this.gridSize.z) * this.gridSize.z,
    };
  }

  // Snap rotation to angle increments
  snapRotation(angle, snapAngle = 15, options = {}) {
    // Handle shift-invert logic centrally
    let shouldSnap = this.isEnabled && !!snapAngle;
    let shiftPressed = false;
    if (typeof options.shiftPressed === "boolean") {
      shiftPressed = options.shiftPressed;
    } else if (globalThis._editorScope?.runtime?.keyboard) {
      const keyboard = globalThis._editorScope.runtime.keyboard;
      shiftPressed =
        keyboard.isKeyDown("ShiftLeft") ||
        keyboard.isKeyDown("ShiftRight") ||
        keyboard.isKeyDown("Shift");
    }
    if (shiftPressed) {
      shouldSnap = !(this.isEnabled && !!snapAngle);
    }
    if (!shouldSnap) {
      return angle;
    }
    return Math.round(angle / snapAngle) * snapAngle;
  }

  // Snap 3D rotation to angle increments
  snapRotation3D(rotation, snapAngle = 15) {
    if (!this.isEnabled || !snapAngle) {
      return { ...rotation };
    }

    return {
      x: this.snapRotation(rotation.x, snapAngle),
      y: this.snapRotation(rotation.y, snapAngle),
      z: this.snapRotation(rotation.z, snapAngle),
    };
  }

  // Update grid gizmo with current settings
  updateGridGizmo() {
    if (!this.gridGizmoId) return;

    // Parse grid color and convert to RGBA array
    const gridColorArray = hexToRgb(this.gridColor);

    this.gizmoManager.updateGizmo(this.gridGizmoId, {
      startX: 0,
      startY: 0,
      width: this.levelSize.width,
      height: this.levelSize.height,
      spacingX: this.gridSize.x,
      spacingY: this.gridSize.y,
      color: [...gridColorArray, 0.8], // Use configurable grid color
      lineWidth: 1,
      zPosition: this.zPosition,
    });
    if (this.gridPlaneGizmoId) {
      this.gizmoManager.updateGizmo(this.gridPlaneGizmoId, {
        x: 0,
        y: 0,
        z: this.zPosition - 0.01,
        width: this.levelSize.width,
        height: this.levelSize.height,
        filled: true,
        color: [0, 0, 0, 0.5],
      });
    }
  }

  // Get grid plane for ray casting
  getGridPlane() {
    return {
      point: [0, 0, this.zPosition],
      normal: [0, 0, 1], // Grid faces up (Z direction)
    };
  }

  // Get grid settings for external systems
  getGridSettings() {
    return {
      zPosition: this.zPosition,
      gridSize: { ...this.gridSize },
      levelSize: { ...this.levelSize },
      snapToGrid: this.isEnabled,
      angleSnap: this.angleSnap,
      backgroundColor: this.backgroundColor,
      gridColor: this.gridColor,
    };
  }

  // Set grid settings from external systems
  setGridSettings(settings) {
    if (settings.zPosition !== undefined) {
      this.setZPosition(settings.zPosition);
    }
    if (settings.gridSize) {
      this.setGridSize(settings.gridSize);
    }
    if (settings.levelSize) {
      this.setLevelSize(settings.levelSize);
    }
    if (settings.snapToGrid !== undefined) {
      this.setSnapToGrid(settings.snapToGrid);
    }
    if (settings.backgroundColor !== undefined) {
      this.setBackgroundColor(settings.backgroundColor);
    }
    if (settings.gridColor !== undefined) {
      this.setGridColor(settings.gridColor);
    }
  }

  // Destroy the grid system
  destroy() {
    if (this.gridGizmoId) {
      this.gizmoManager.deleteGizmo(this.gridGizmoId);
      if (this.gridPlaneGizmoId) {
        this.gizmoManager.deleteGizmo(this.gridPlaneGizmoId);
      }
      this.gridGizmoId = null;
    }
  }
}

// Global grid system instance
let gridSystem = null;

// Initialize grid system
export function initializeGridSystem(runtime, gizmoManager) {
  if (gridSystem) {
    gridSystem.destroy();
  }

  gridSystem = new GridSystem(runtime, gizmoManager);
  return gridSystem;
}

// Get grid system instance
export function getGridSystem() {
  return gridSystem;
}

// Destroy grid system
export function destroyGridSystem() {
  if (gridSystem) {
    gridSystem.destroy();
    gridSystem = null;
  }
}
