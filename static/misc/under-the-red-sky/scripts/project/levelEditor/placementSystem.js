// Object Placement System for Level Editor
// Handles ray-casting based object placement with preview and grid collision

import {
  getFirstRayIntersection,
  screenToWorldRay,
  getRayIntersectionReflectAndNormal,
} from "./raycast.js";
import {
  selectableObjects,
  ObjectTypeDefinitions,
} from "./objectTypeDefinitions.js";
import { createInstanceFromPreset } from "./objectPresets.js";
import { PICK_MAX_DISTANCE } from "./globalValues.js";
import { getSelectedEffectivePreset } from "./inventoryBar.js";
import { RotationOrderConverter } from "./rotationUtils.js";
import { refreshHierarchyPanel } from "./hierarchyPanel/hierarchyPanel.js";

// Alt-drag rotation sensitivity: degrees per pixel of vertical movement.
const ALT_ROTATE_DEG_PER_PX = 1;

export class PlacementSystem {
  constructor(runtime, options = {}) {
    this.runtime = runtime;
    this.options = {
      maxRayDistance: options.maxRayDistance || PICK_MAX_DISTANCE,
      previewLayer: options.previewLayer || "Main_Preview",
      ...options,
    };

    // Placement state
    this.isPlacing = false;
    this.placementStartPos = { x: 0, y: 0 };
    this.lastPlacementPos = { x: 0, y: 0, z: 0 };
    this.lastPlacementNormal = { x: 0, y: 0, z: 1 };
    this.isRightMouseDown = false;
    this.isDragging = false;
    this.isShiftKeyDown = false;
    this.isAltKeyDown = false;
    this._altRotateAnchorY = 0;
    this._altRotateBaseRotation = 0;

    // Preview instances for multi-object presets
    this.previewInstances = [];
    this.placementRotation = 0; // in degrees

    // Event callbacks
    this.onPlacementStart = options.onPlacementStart || null;
    this.onPlacementUpdate = options.onPlacementUpdate || null;
    this.onPlacementConfirm = options.onPlacementConfirm || null;
    this.onPlacementCancel = options.onPlacementCancel || null;

    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Right mouse button down - start placement
    this.boundMouseDown = (e) => {
      if (e.button === 2 && !this.isPlacing) {
        // Right mouse button
        this.handleRightMouseDown(e);
      }
    };
    this.runtime.addEventListener("mousedown", this.boundMouseDown);

    // Mouse move - update placement preview
    this.boundMouseMove = (e) => {
      if (this.isPlacing) {
        this.handleMouseMove(e);
      }
    };
    this.runtime.addEventListener("mousemove", this.boundMouseMove);

    // Right mouse button up - confirm placement
    this.boundMouseUp = (e) => {
      if (e.button === 2 && this.isPlacing) {
        this.handleRightMouseUp(e);
      }
    };
    this.runtime.addEventListener("mouseup", this.boundMouseUp);

    // Mouse wheel - update placement rotation
    this.boundMouseWheel = (e) => {
      if (this.isPlacing) {
        this.handlePlacementWheel(e);
      }
    };
    this.runtime.addEventListener("wheel", this.boundMouseWheel);

    this.boundKeyDown = (e) => {
      if (e.key === "Shift") {
        this.isShiftKeyDown = true;
        if (this.isPlacing) {
          this.handleMouseMove(e);
        }
      } else if (e.key === "Alt") {
        // Baseline the rotation anchor so it doesn't jump when Alt is pressed
        // mid-drag (only the first keydown, before auto-repeat).
        if (this.isPlacing && !this.isAltKeyDown) {
          const [, mouseY] = globalThis._editorScope.getMousePosition();
          this._altRotateAnchorY = mouseY;
          this._altRotateBaseRotation = this.placementRotation || 0;
          if (e.preventDefault) e.preventDefault();
        }
        this.isAltKeyDown = true;
      }
    };
    this.runtime.addEventListener("keydown", this.boundKeyDown);

    this.boundKeyUp = (e) => {
      if (e.key === "Shift") {
        this.isShiftKeyDown = false;
        if (this.isPlacing) {
          //this.handleMouseMove(e);
        }
      } else if (e.key === "Alt") {
        this.isAltKeyDown = false;
      }
    };
    this.runtime.addEventListener("keyup", this.boundKeyUp);
  }

  // Replace currentPreset with a getter
  get currentPreset() {
    return getSelectedEffectivePreset();
  }

  // Check if placement mode is active
  isPlacementActive() {
    return this.isPlacing;
  }

  // Handle right mouse down - start placement
  handleRightMouseDown(e) {
    if (!this.currentPreset) return;

    const [mouseX, mouseY] = globalThis._editorScope.getMousePosition();
    this.placementStartPos = { x: mouseX, y: mouseY };
    this.isRightMouseDown = true;

    // Cast ray to find initial placement position — uses the exact UI-layer
    // position so it stays correct when the canvas is resized.
    const [rayX, rayY] = globalThis._editorScope.getMousePosition("UI");
    const placementPos = this.castPlacementRay(rayX, rayY);
    if (placementPos) {
      this.startPlacement(placementPos);
    }
  }

  // Handle mouse move - update placement preview
  handleMouseMove() {
    if (!this.isPlacing || !this.isRightMouseDown) return;

    const [mouseX, mouseY] = globalThis._editorScope.getMousePosition();

    // Alt-drag: vertical movement scrubs rotation instead of moving position.
    if (this.isAltKeyDown) {
      this.isDragging = true;
      const dy = this._altRotateAnchorY - mouseY; // drag up = increase angle
      const gridSystem = globalThis._editorScope?.gridSystem;
      const angleSnap = gridSystem ? gridSystem.getAngleSnap() : 15;
      let newRotation =
        this._altRotateBaseRotation + dy * ALT_ROTATE_DEG_PER_PX;
      if (gridSystem) {
        newRotation = gridSystem.snapRotation(newRotation, angleSnap);
      }
      this.placementRotation = ((newRotation % 360) + 360) % 360;
      this.updatePlacementPreview({
        position: this.lastPlacementPos,
        normal: this.lastPlacementNormal,
      });
      return;
    }

    // Check if we've moved enough to start dragging
    if (!this.isDragging) {
      const deltaX = Math.abs(mouseX - this.placementStartPos.x);
      const deltaY = Math.abs(mouseY - this.placementStartPos.y);
      const totalDelta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (totalDelta > 3) {
        // Start dragging after 3 pixels of movement
        this.isDragging = true;
      }
    }

    if (this.isDragging) {
      // Cast ray to update placement position — exact UI-layer position.
      const [rayX, rayY] = globalThis._editorScope.getMousePosition("UI");
      const placementPos = this.castPlacementRay(rayX, rayY);
      if (placementPos) {
        this.updatePlacementPreview(placementPos);
      }
    }
  }

  // Handle right mouse up - confirm placement
  handleRightMouseUp(e) {
    this.isRightMouseDown = false;

    if (this.isPlacing) {
      this.confirmPlacement();
    }
  }

  // Cast ray from screen coordinates to find placement position
  castPlacementRay(screenX, screenY) {
    const camera = globalThis._editorScope.cameraType;
    const viewport = globalThis._editorScope.uiViewport();

    const cameraPos = camera.getCameraPosition();
    const rayDirection = screenToWorldRay(
      screenX,
      screenY,
      viewport.width,
      viewport.height,
      camera.getLookVector(),
      camera.getUpVector(),
      camera.fieldOfView,
    );

    // Get all selectable objects for ray casting
    const candidates = [];
    for (const objectTypeName of selectableObjects) {
      const objectType = this.runtime.objects[objectTypeName];
      if (objectType) {
        candidates.push(
          ...objectType
            .getAllInstances()
            .filter(
              (instance) =>
                instance.isVisible &&
                !this.previewInstances.some((p) => p.instance === instance),
            ),
        );
      }
    }

    // Cast ray against objects first
    const objectIntersection = getFirstRayIntersection(
      candidates,
      cameraPos,
      rayDirection,
      this.options.maxRayDistance,
    );

    // Cast against grid plane
    const gridIntersection = this.intersectRayWithGrid(cameraPos, rayDirection);

    let finalPoint = null;
    let finalNormal = null;

    // Find the closest point between object and grid intersections
    if (
      objectIntersection &&
      objectIntersection.point &&
      gridIntersection &&
      gridIntersection.point
    ) {
      const objectPoint = objectIntersection.point;
      const objectPos = {
        x: objectPoint[0],
        y: objectPoint[1],
        z: objectPoint[2],
      };

      // Calculate distances from camera to each intersection
      const objectDistance = Math.sqrt(
        Math.pow(objectPos.x - cameraPos[0], 2) +
          Math.pow(objectPos.y - cameraPos[1], 2) +
          Math.pow(objectPos.z - cameraPos[2], 2),
      );

      const gridDistance = Math.sqrt(
        Math.pow(gridIntersection.point.x - cameraPos[0], 2) +
          Math.pow(gridIntersection.point.y - cameraPos[1], 2) +
          Math.pow(gridIntersection.point.z - cameraPos[2], 2),
      );

      // Use the closer intersection
      if (objectDistance < gridDistance) {
        finalPoint = objectPos;
        finalNormal = getRayIntersectionReflectAndNormal(
          objectIntersection.triangle,
          rayDirection,
        ).normal;
      } else {
        finalPoint = gridIntersection.point;
        finalNormal = gridIntersection.normal;
      }
    }

    // If only object intersection exists
    else if (objectIntersection && objectIntersection.point) {
      finalPoint = objectIntersection.point;
      finalNormal = getRayIntersectionReflectAndNormal(
        objectIntersection.triangle,
        rayDirection,
      ).normal;
    }

    // If only grid intersection exists
    else if (gridIntersection) {
      finalPoint = gridIntersection.point;
      finalNormal = gridIntersection.normal;
    }

    if (finalPoint) {
      if (finalPoint instanceof Array) {
        finalPoint = {
          x: finalPoint[0],
          y: finalPoint[1],
          z: finalPoint[2],
        };
      }
      // move point ever so slightly in the direction of the normal so the snapping is more accurate
      if (this.shouldSnapToGrid()) {
        finalPoint = this.add(
          [finalPoint.x, finalPoint.y, finalPoint.z],
          this.scale(finalNormal, 0.0001),
        );
        finalPoint = this.snapToGrid(
          {
            x: finalPoint[0],
            y: finalPoint[1],
            z: finalPoint[2],
          },
          {
            // ignoreZ: true,
          },
        );
      }
      return {
        position: finalPoint,
        normal: finalNormal,
      };
    }

    return null;
  }

  // Intersect ray with grid plane
  intersectRayWithGrid(rayOrigin, rayDirection) {
    const gridSystem = globalThis._editorScope?.gridSystem;
    if (!gridSystem) {
      return null;
    }

    const gridPlane = gridSystem.getGridPlane();
    const planePoint = gridPlane.point;
    const planeNormal = gridPlane.normal;

    // if camera is under the grid plane, invert normal
    if (rayOrigin[2] < planePoint[2]) {
      planeNormal[2] = -planeNormal[2];
    }

    // Calculate intersection using plane equation
    const denom = this.dot(rayDirection, planeNormal);
    if (Math.abs(denom) < 1e-6) {
      // Ray is parallel to plane
      return null;
    }

    const rayToPlane = this.subtract(planePoint, rayOrigin);
    const t = this.dot(rayToPlane, planeNormal) / denom;

    if (t < 0) {
      // Intersection is behind ray origin
      return null;
    }

    const intersectionPoint = this.add(rayOrigin, this.scale(rayDirection, t));
    return {
      point: {
        x: intersectionPoint[0],
        y: intersectionPoint[1],
        z: intersectionPoint[2],
      },
      normal: planeNormal,
    };
  }

  // Snap position to grid if enabled
  snapToGrid(position, options = {}) {
    const gridSystem = globalThis._editorScope?.gridSystem;
    if (!gridSystem) {
      return position;
    }
    return gridSystem.snapToGrid(position, options);
  }

  shouldSnapToGrid() {
    const gridSystem = globalThis._editorScope?.gridSystem;
    if (!gridSystem) {
      return false;
    }
    return gridSystem.shouldSnapToGrid();
  }

  // Start placement mode
  startPlacement({ position, normal }) {
    this.isPlacing = true;
    this.isDragging = false;
    this.lastPlacementPos = position;
    this.placementRotation = 0; // Reset rotation
    // Baseline in case Alt is already held when this placement begins.
    this._altRotateAnchorY = this.placementStartPos.y;
    this._altRotateBaseRotation = 0;
    this.previewInstances = []; // Clear previous preview instances

    const presetObjects = this.currentPreset?.objects || null;
    if (presetObjects) {
      for (const objDef of presetObjects) {
        const instance = createInstanceFromPreset(objDef, position);
        if (instance) {
          this.previewInstances.push({ instance, objDef });
          this.makeInstanceSemiTransparent(instance);
        }
      }
    }
    this.updatePlacementPreview({ position, normal }, true);

    // Trigger callback
    if (this.onPlacementStart) {
      this.onPlacementStart(
        this.currentPreset,
        position,
        this.previewInstances.map((p) => p.instance),
      );
    }
  }

  // Update placement preview position
  updatePlacementPreview({ position, normal }, noEvent = false) {
    this.lastPlacementPos = position;
    this.lastPlacementNormal = normal;
    if (!this.previewInstances.length) return;
    const isTag = this.currentPreset?.placeLikeTag === true;
    for (const { instance, objDef } of this.previewInstances) {
      // Compute rotated offset
      let offset = objDef.positionOffset || { x: 0, y: 0, z: 0 };
      let rot = ((this.placementRotation || 0) * Math.PI) / 180;
      let x = offset.x,
        y = offset.y;
      if (rot && (x !== 0 || y !== 0)) {
        const cos = Math.cos(rot),
          sin = Math.sin(rot);
        const rx = x * cos - y * sin;
        const ry = x * sin + y * cos;
        x = rx;
        y = ry;
      }

      // Set rotation
      const baseRot = this.placementRotation || 0;
      const rotOffset = (objDef.rotationOffset && objDef.rotationOffset) || {
        x: 0,
        y: 0,
        z: 0,
      };

      const objectDefinition = ObjectTypeDefinitions[instance.objectType?.name];
      if (objectDefinition) {
        objectDefinition.onChange(
          {
            value: {
              x: position.x + x,
              y: position.y + y,
              z: position.z + (offset.z || 0),
            },
          },
          instance,
          "position",
        );

        if (isTag) {
          instance.setRotationFromVectors3D(0, 0, 1, ...normal);
        }

        // find correct angle property
        const validProperties = [
          "angle",
          "rotation",
          "meshRotation",
          "meshRotation2",
        ];
        const property = objectDefinition.properties.find((p) =>
          validProperties.includes(p.key),
        );
        if (property) {
          // Default: ZYX order, scroll rotates Z last
          if (property.key === "angle" || isTag) {
            objectDefinition.onChange(
              {
                value:
                  baseRot +
                  rotOffset.z +
                  (isTag ? instance.getRotationZExtra3D() : 0),
              },
              instance,
              "angle",
            );
          } else {
            objectDefinition.onChange(
              {
                value: {
                  x: rotOffset.x,
                  y: rotOffset.y,
                  z: baseRot + rotOffset.z,
                },
              },
              instance,
              property.key,
            );
          }
        }
      }
    }
    if (this.onPlacementUpdate && !noEvent) {
      this.onPlacementUpdate(
        position,
        this.previewInstances.map((p) => p.instance),
      );
    }
  }

  calculateNormalRotation(normalArray) {
    const normal = {
      x: normalArray[0],
      y: normalArray[1],
      z: normalArray[2],
    };
    // Calculate rotation to align object's up vector (0,0,1) with the surface normal
    const up = { x: 0, y: 0, z: 1 };

    // If normal is already pointing up, no rotation needed
    if (
      Math.abs(normal.x - up.x) < 1e-6 &&
      Math.abs(normal.y - up.y) < 1e-6 &&
      Math.abs(normal.z - up.z) < 1e-6
    ) {
      return { x: 0, y: 0, z: 0 };
    }

    // Calculate rotation angles to align with normal
    // First rotate around Y axis to face the normal direction
    const yRotation = -(Math.atan2(normal.x, normal.z) * 180) / Math.PI;

    // Then rotate around X axis to align with the normal
    const xRotation =
      -(
        Math.atan2(
          -normal.y,
          Math.sqrt(normal.x * normal.x + normal.z * normal.z),
        ) * 180
      ) / Math.PI;

    return { x: xRotation, y: yRotation, z: 0 };
  }

  // Make instance semi-transparent
  makeInstanceSemiTransparent(instance) {
    try {
      // Set opacity if available
      instance.__originalLayerName = instance.layer.name;
      instance.moveToLayer(
        this.runtime.layout.getLayer(this.options.previewLayer),
      );
    } catch (error) {
      console.warn("Failed to make instance semi-transparent:", error);
    }
  }

  // Restore instance to full opacity and enable physics
  makeInstanceFinal(instance) {
    try {
      if (instance.__originalLayerName) {
        instance.moveToLayer(
          this.runtime.layout.getLayer(instance.__originalLayerName),
        );
      }
    } catch (error) {
      console.warn("Failed to finalize instance:", error);
    }
  }

  // Confirm placement
  confirmPlacement() {
    if (!this.previewInstances.length) return;

    // Make instance final (full opacity, enable physics)
    for (const { instance } of this.previewInstances) {
      this.makeInstanceFinal(instance);
      // Add to runtime/scene as needed
    }

    // Add to selection if selection manager exists
    if (globalThis._editorScope?.selectionManager) {
      globalThis._editorScope.selectionManager.setSelection(
        ...this.previewInstances.map((p) => p.instance),
      );
    }

    // Auto-group for multi-instance structures:
    // When a preset defines more than one object we wrap the freshly placed
    // instances in a new group named after the preset. This keeps the
    // hierarchy tidy for composite props (e.g. a "Well" made of 5 parts) and
    // matches the expectation that structures arrive as a single unit in the
    // tree, not as a flat pile of siblings at the root.
    //
    // Single-object presets are left alone to avoid producing a group for
    // every single placed prop.
    const placedInstances = this.previewInstances.map((p) => p.instance);
    const gm = globalThis._editorScope?.groupManager;
    let didAutoGroup = false;
    if (placedInstances.length > 1 && gm) {
      const presetName =
        this.currentPreset?.name ||
        this.currentPreset?.label ||
        this.currentPreset?.id ||
        "Group";
      // Parent group = deepest common ancestor of the new instances. Freshly
      // created instances come in ungrouped (parentGroupId == null) so this
      // resolves to null (root) — which is what we want for a structure that
      // was dropped directly into the world.
      const parentId = gm.getCommonAncestorGroupId(placedInstances);
      gm.createGroup({
        name: presetName,
        parentId,
        // If the preset declares a color (the same one shown on its inventory
        // slot/category swatch), seed the new group with it so the hierarchy
        // chip matches the user's mental model of "this came from that
        // preset". User can override or clear via the chip.
        color: this.currentPreset?.color || undefined,
        // Same idea for the icon: copy the originating preset's icon so the
        // structure shows up in the hierarchy with its source-level glyph
        // (Stairs / Gate / etc.) rather than a generic folder.
        iconName: this.currentPreset?.icon || undefined,
        memberInstances: placedInstances,
        description: `Place "${presetName}"`,
      });
      didAutoGroup = true;
    }

    // Reset placement state
    this.resetPlacementState();

    // Record undo state.
    // When we auto-grouped above, createGroup already pushed a meaningful
    // "Place \"X\"" undo entry (via _commitGroups) that captures both the new
    // instances AND the new group in one snapshot. Pushing another generic
    // "Place Object" entry on top would just inflate history with a duplicate.
    if (!didAutoGroup && globalThis._editorScope?.stateManager) {
      globalThis._editorScope.stateManager.pushUndoState("Place Object");
    }

    // Refresh the hierarchy panel now that new instances (and possibly a new
    // group) exist.
    refreshHierarchyPanel();

    // Trigger callback
    if (this.onPlacementConfirm) {
      this.onPlacementConfirm(
        this.currentPreset,
        this.lastPlacementPos,
        this.previewInstances.map((p) => p.instance),
      );
    }

    console.log(`Placed ${this.currentPreset?.name} at`, this.lastPlacementPos);
  }

  // Cancel placement
  cancelPlacement() {
    if (!this.isPlacing) return;

    // Destroy preview instances
    for (const { instance } of this.previewInstances) {
      try {
        instance.destroy();
      } catch (error) {
        console.warn("Failed to destroy preview instance:", error);
      }
    }
    this.previewInstances = []; // Clear the array

    // Reset placement state
    this.resetPlacementState();

    // Trigger callback
    if (this.onPlacementCancel) {
      this.onPlacementCancel(this.currentPreset);
    }

    console.log("Placement cancelled");
  }

  // Reset all placement state
  resetPlacementState() {
    this.isPlacing = false;
    this.isDragging = false;
    this.isRightMouseDown = false;
    this.placementStartPos = { x: 0, y: 0 };
    this.lastPlacementPos = { x: 0, y: 0, z: 0 };
    this.placementRotation = 0; // Reset rotation
    this.previewInstances = []; // Clear preview instances
  }

  // Get placement statistics
  getStats() {
    const gridSystem = globalThis._editorScope?.gridSystem;
    const gridSettings = gridSystem ? gridSystem.getGridSettings() : {};

    return {
      isPlacing: this.isPlacing,
      isDragging: this.isDragging,
      currentPreset: this.currentPreset?.name || null,
      gridSize: gridSettings.gridSize || { x: 64, y: 64, z: 64 },
      snapToGrid: gridSettings.snapToGrid || false,
      gridHeight: gridSettings.zPosition || 0,
    };
  }

  // Vector math utilities
  dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  subtract(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  add(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  }

  scale(vector, scalar) {
    return [vector[0] * scalar, vector[1] * scalar, vector[2] * scalar];
  }

  // Clean up and destroy
  destroy() {
    if (this.isPlacing) {
      this.cancelPlacement();
    }
    if (this.boundMouseDown) {
      this.runtime.removeEventListener("mousedown", this.boundMouseDown);
      this.boundMouseDown = null;
    }
    if (this.boundMouseMove) {
      this.runtime.removeEventListener("mousemove", this.boundMouseMove);
      this.boundMouseMove = null;
    }
    if (this.boundMouseUp) {
      this.runtime.removeEventListener("mouseup", this.boundMouseUp);
      this.boundMouseUp = null;
    }
    if (this.boundMouseWheel) {
      this.runtime.removeEventListener("wheel", this.boundMouseWheel);
      this.boundMouseWheel = null;
    }
    if (this.boundKeyDown) {
      this.runtime.removeEventListener("keydown", this.boundKeyDown);
      this.boundKeyDown = null;
    }
    if (this.boundKeyUp) {
      this.runtime.removeEventListener("keyup", this.boundKeyUp);
      this.boundKeyUp = null;
    }
  }

  handlePlacementWheel(e) {
    if (!this.isPlacing) return;
    const delta = (this.isShiftKeyDown ? -e.deltaX : e.deltaY) > 0 ? 1 : -1;
    const gridSystem = globalThis._editorScope?.gridSystem;
    const angleSnap = gridSystem ? gridSystem.getAngleSnap() : 15;
    let newRotation = (this.placementRotation || 0) + delta * angleSnap;
    newRotation = gridSystem.snapRotation(newRotation, angleSnap);

    this.placementRotation = (newRotation + 360) % 360;
    this.updatePlacementPreview({
      position: this.lastPlacementPos,
      normal: this.lastPlacementNormal,
    });
  }
}

// Global placement system instance
export let placementSystem = null;

// Initialize placement system
export function initializePlacementSystem(runtime, options = {}) {
  if (!placementSystem) {
    placementSystem = new PlacementSystem(runtime, options);
  }
  return placementSystem;
}

export function destroyPlacementSystem() {
  if (placementSystem) {
    placementSystem.destroy();
    placementSystem = null;
  }
}

// Helper functions for easy access
export function cancelPlacement() {
  if (placementSystem) {
    placementSystem.cancelPlacement();
  }
}

export function isPlacementActive() {
  return placementSystem ? placementSystem.isPlacementActive() : false;
}

export function setPlacementGridSize(size) {
  const gridSystem = globalThis._editorScope?.gridSystem;
  if (gridSystem) {
    gridSystem.setGridSize(size);
  }
}

export function setPlacementSnapToGrid(enabled) {
  const gridSystem = globalThis._editorScope?.gridSystem;
  if (gridSystem) {
    gridSystem.setSnapToGrid(enabled);
  }
}
