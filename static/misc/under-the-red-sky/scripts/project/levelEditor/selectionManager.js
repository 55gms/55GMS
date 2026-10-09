import {
  createDebugGizmoForInstanceTris,
  deleteDebugGizmoIds,
} from "./debugGizmos.js";
import { instanceToTriList } from "./triangles.js";
import { getInstanceBounds } from "./raycast.js";
import {
  dot,
  subtract,
  normalize,
  add,
  scale,
  crossProduct,
  length,
} from "./vector.js";
import { selectableObjects } from "./objectTypeDefinitions.js";
import { TransformGizmos } from "./transformGizmos.js";
import { updateInspectorSelection, refreshInspector } from "./inspectorUI.js";
import {
  updateHierarchySelection,
  refreshHierarchyPanel,
} from "./hierarchyPanel/hierarchyPanel.js";

export class SelectionManager {
  constructor(gizmoManager, runtime) {
    this.gizmoManager = gizmoManager;
    this.runtime = runtime;
    this.selectedObjects = new Set(); // Set of selected instances
    this.selectionGizmoIds = new Map(); // instance -> array of gizmo IDs for triangles
    this.selectionBoundingBoxId = null;
    this.axisGizmoIds = {
      xArrow: null,
      yArrow: null,
      zArrow: null,
      center: null,
      // Plane gizmos for 2D movement
      xyPlane: null,
      xzPlane: null,
      yzPlane: null,
    };

    this.clipboard = [];

    // ---------------------------------------------------------------------
    // Pickwalk state ([ / ] hotkeys, Blender-style)
    // ---------------------------------------------------------------------
    // `lastAnchor` is the most recently "actively chosen" item. Sources:
    //   - viewport raycast click on an instance (set by editorMain).
    //   - hierarchy panel row click on either an instance or a group (set by
    //     hierarchyPanel).
    // It's the starting point for `[` (broaden to parent group) and survives
    // across selection mutations until the user actively picks something else.
    //
    // `pickwalkStack` records each successful `[` step so `]` can undo it
    // without us having to recompute "what was the selection before". Each
    // frame stores enough state to restore the prior anchor and the prior
    // selection contribution (the instances that the broadening replaced).
    // The stack is cleared whenever the selection is mutated by anything
    // other than pickwalk itself (see _markPickwalkInternal/_invalidatePickwalkStack).
    this.lastAnchor = null; // { kind: 'instance'|'group', id }
    this.pickwalkStack = []; // Array<{ anchor, addedInstances: Set, removedInstances: Set }>
    this._pickwalkInternal = false;

    // Initialize transform gizmos
    this.transformGizmos = new TransformGizmos(gizmoManager, this, runtime);

    // Selection state
    this.isDragging = false;
    this.dragAxis = null; // 'x', 'y', 'z', 'xy', 'xz', 'yz', 'center', or null
    this.dragStartPosition = null;
    this.dragStartMousePos = null;
    this.originalPositions = new Map(); // instance -> {x, y, z}
    this.gizmoInteractionActive = false; // Track if we're interacting with gizmos

    // Transform mode state
    this.currentTransformMode = "move"; // 'move', 'rotate', 'scale', 'boxScale'

    // 2D Selection Box state
    this.isSelectionBoxActive = false;
    this.selectionBoxStart = { x: 0, y: 0 };
    this.selectionBoxEnd = { x: 0, y: 0 };
    this.selectionBoxGizmoId = null;
    this.selectionBoxMinDragDistance = 5; // Minimum pixels to start box selection

    // Camera reference for arrow direction calculation
    this.camera = null;

    // Mouse tracking for drag operations
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    // Axis gizmo properties
    this.axisLength = 70;
    this.axisThickness = 3;
    this.arrowSize = 15;
    this.centerSize = 8;
    this.planeSize = 22; // Size for interaction planes

    // Colors
    this.selectionColor = [1, 1, 0, 1]; // Yellow
    this.boundingBoxColor = [248 / 255, 94 / 255, 0]; // Orange
    this.xAxisColor = [1, 0, 0, 1]; // Red
    this.yAxisColor = [0, 1, 0, 1]; // Green
    this.zAxisColor = [0, 0, 1, 1]; // Blue
    this.centerColor = [1, 1, 1, 1]; // White
    this.xyPlaneColor = [0, 0, 1, 1]; // Blue (perpendicular to Z)
    this.xzPlaneColor = [0, 1, 0, 1]; // Green (perpendicular to Y)
    this.yzPlaneColor = [1, 0, 0, 1]; // Red (perpendicular to X)
    this.highlightColor = [1, 1, 0, 1]; // Yellow highlight

    // Set up gizmo interaction callbacks
    this.setupGizmoCallbacks();
  }

  setupGizmoCallbacks() {
    // Store original callbacks
    this.originalOnGizmoHover = this.gizmoManager.onGizmoHover;
    this.originalOnGizmoClick = this.gizmoManager.onGizmoClick;
    this.originalOnGizmoHoverEnd = this.gizmoManager.onGizmoHoverEnd;

    // Override callbacks to handle both axis and transform gizmo interactions
    this.gizmoManager.onGizmoHover = (id, gizmo) => {
      if (this.isAxisGizmo(id)) {
        this.handleAxisGizmoHover(id, gizmo);
      } else if (this.isTransformGizmo(id)) {
        this.transformGizmos.handleTransformGizmoHover(id, gizmo);
        this.gizmoInteractionActive = true;
      } else if (this.originalOnGizmoHover) {
        this.originalOnGizmoHover(id, gizmo);
      }
    };

    this.gizmoManager.onGizmoClick = (id, gizmo) => {
      if (this.isAxisGizmo(id)) {
        this.handleAxisGizmoClick(id, gizmo);
      } else if (this.isTransformGizmo(id)) {
        this.transformGizmos.handleTransformGizmoClick(id, gizmo);
        this.gizmoInteractionActive = false; // Will be set to true when dragging starts
      } else if (this.originalOnGizmoClick) {
        this.originalOnGizmoClick(id, gizmo);
      }
    };

    this.gizmoManager.onGizmoHoverEnd = (id, gizmo) => {
      if (this.isAxisGizmo(id)) {
        this.handleAxisGizmoHoverEnd(id, gizmo);
      } else if (this.isTransformGizmo(id)) {
        this.transformGizmos.handleTransformGizmoHoverEnd(id, gizmo);
        this.gizmoInteractionActive = false;
      } else if (this.originalOnGizmoHoverEnd) {
        this.originalOnGizmoHoverEnd(id, gizmo);
      }
    };
  }

  // Selection management methods
  addToSelection(...instances) {
    const wasEmpty = this.selectedObjects.size === 0;
    let selectionChanged = false;

    for (const instance of instances) {
      if (this.selectedObjects.has(instance)) {
        continue; // Already selected, continue to next instance
      }

      this.selectedObjects.add(instance);
      this.createSelectionVisualization(instance);
      selectionChanged = true;
    }

    // Only update gizmos if selection actually changed
    if (selectionChanged) {
      this._invalidatePickwalkStack();
      this.updateSelectionBoundingBox();

      // Update transform gizmos if a transform mode is active
      this.updateTransformGizmos();

      // Re-apply the current transform mode now that there's a selection
      if (wasEmpty && this.selectedObjects.size > 0) {
        this.setTransformMode(this.currentTransformMode || "move", this.camera);
      }

      // Update inspector UI
      updateInspectorSelection(Array.from(this.selectedObjects));
      // Mirror selection into the hierarchy panel (if open).
      updateHierarchySelection();

      // Update toolbar tool visibility
      if (globalThis._editorScope?.toolbar) {
        globalThis._editorScope.toolbar.updateToolVisibility();
      }
    }
  }

  removeFromSelection(...instances) {
    let selectionChanged = false;

    for (const instance of instances) {
      if (!this.selectedObjects.has(instance)) {
        continue; // Not selected
      }

      this.selectedObjects.delete(instance);
      this.removeSelectionVisualization(instance);
      selectionChanged = true;
    }

    // Only update gizmos if selection actually changed
    if (selectionChanged) {
      this._invalidatePickwalkStack();
      this.updateSelectionBoundingBox();

      // Update transform gizmos if a transform mode is active
      this.updateTransformGizmos();

      // Update inspector UI
      updateInspectorSelection(Array.from(this.selectedObjects));
      // Mirror selection into the hierarchy panel (if open).
      updateHierarchySelection();

      // Update toolbar tool visibility
      if (globalThis._editorScope?.toolbar) {
        globalThis._editorScope.toolbar.updateToolVisibility();
      }
    }
  }

  update3DobjectsInSelection() {
    // go through all selected objects of type object3D
    this.selectedObjects.forEach((instance) => {
      if (!(instance instanceof self.I3DObjectInstance)) return;
      const sdkInst = globalThis._editorScope.sdk_runtime.GetInstanceByUID(
        instance.uid,
      )._sdkInst;
      if (!sdkInst || !sdkInst.loaded) return;
      sdkInst._updateBoundingBox(
        instance.x,
        instance.y,
        instance.totalZElevation,
        sdkInst.gpuSkinning,
      );
      const gizmoIds = this.selectionGizmoIds.get(instance);
      if (gizmoIds) {
        // Remove old triangles
        deleteDebugGizmoIds(gizmoIds);
        // Create new triangles at updated position
        this.createSelectionVisualization(instance);
      }
    });

    // Update selection bounding box after all objects are updated
    this.updateSelectionBoundingBox();
  }

  updateSelectionGizmos() {
    if (this.selectedObjects.size === 0) {
      this.clearSelectionBoundingBox();
      this.clearAxisGizmo();
      this.transformGizmos.hideGizmos();
      this.gizmoInteractionActive = false;
      return;
    }
    this.update3DobjectsInSelection();
    this.updateSelectionVisualizations();
    this.updateTransformGizmos();
  }

  updateTransformGizmos() {
    if (this.selectedObjects.size === 0) {
      return;
    }
    if (this.currentTransformMode && this.currentTransformMode !== "move") {
      this.transformGizmos.updateForSelection(this.camera);
    } else {
      this.updateAxisGizmo(this.camera);
    }
  }

  toggleSelection(instance) {
    if (this.selectedObjects.has(instance)) {
      this.removeFromSelection(instance);
    } else {
      this.addToSelection(instance);
    }
  }

  setSelection(...instances) {
    // Clear current selection, but skip its inspector/hierarchy/toolbar refresh:
    // addToSelection below immediately recomputes all three, so refreshing the
    // intermediate empty state does that (~ms each) panel work twice per click.
    this.clearSelection({ skipUiRefresh: true });
    // Add new instances to selection
    this.addToSelection(...instances);
    // If nothing was actually added (e.g. setSelection() with no args), the
    // deferred refresh never ran — do it now so the panels reflect empty.
    if (this.selectedObjects.size === 0) {
      updateInspectorSelection([]);
      updateHierarchySelection();
      if (globalThis._editorScope?.toolbar) {
        globalThis._editorScope.toolbar.updateToolVisibility();
      }
    }
  }

  clearSelection({ skipUiRefresh = false } = {}) {
    // Remove all visualizations
    this.selectedObjects.forEach((instance) => {
      this.removeSelectionVisualization(instance);
    });

    this.selectedObjects.clear();
    this.clearSelectionBoundingBox();
    this.clearAxisGizmo();
    this._invalidatePickwalkStack();

    // Hide transform gizmos when no objects are selected, but preserve the
    // active transform mode so it's restored on the next selection.
    this.transformGizmos.hideGizmos();
    this.gizmoInteractionActive = false;

    // Panel refresh — skipped when a caller (setSelection) will immediately
    // repopulate and refresh, to avoid doing this expensive work twice.
    if (!skipUiRefresh) {
      updateInspectorSelection([]);
      updateHierarchySelection();
      if (globalThis._editorScope?.toolbar) {
        globalThis._editorScope.toolbar.updateToolVisibility();
      }
    }
  }

  getSelection() {
    return Array.from(this.selectedObjects);
  }

  hasSelection() {
    return this.selectedObjects.size > 0;
  }

  isSelected(instance) {
    return this.selectedObjects.has(instance);
  }

  // -------------------------------------------------------------------------
  // Pickwalk ([ / ])
  // -------------------------------------------------------------------------

  /**
   * Set the active "pickwalk anchor". Callers:
   *   - viewport click handler: `setLastAnchor({kind:'instance', id: inst.uid})`
   *   - hierarchy panel row click: `setLastAnchor({kind:'instance'|'group', id})`
   *
   * Setting an anchor implicitly invalidates the pickwalk stack — the user
   * has chosen a new starting point so previous broadenings no longer apply.
   */
  setLastAnchor(anchor) {
    if (!anchor || !anchor.kind || anchor.id == null) {
      this.lastAnchor = null;
    } else {
      this.lastAnchor = { kind: anchor.kind, id: anchor.id };
    }
    this.pickwalkStack.length = 0;
  }

  /**
   * Internal guard: while a pickwalk operation is in flight, selection
   * mutations that pickwalk itself performs must NOT clear the stack.
   * Wrap the mutation in this helper so addToSelection/removeFromSelection
   * see the flag and skip invalidation.
   */
  _runPickwalkInternal(fn) {
    const prev = this._pickwalkInternal;
    this._pickwalkInternal = true;
    try {
      fn();
    } finally {
      this._pickwalkInternal = prev;
    }
  }

  _invalidatePickwalkStack() {
    if (this._pickwalkInternal) return;
    if (this.pickwalkStack.length > 0) this.pickwalkStack.length = 0;
  }

  /** Look up a live IInstance by uid via the runtime. Returns null if not found. */
  _findInstanceByUid(uid) {
    const runtime = globalThis._editorScope?.runtime;
    if (!runtime) return null;
    try {
      const inst = runtime.getInstanceByUid(uid);
      return inst || null;
    } catch {
      return null;
    }
  }

  /**
   * `[` — broaden the anchor to its parent group.
   *
   * Behavior:
   *   - If anchor is an instance, parent = instance's parentGroupId.
   *   - If anchor is a group, parent = that group's parentId.
   *   - If no parent (root), no-op.
   *   - The parent group's full descendant-instance set is ADDED to the
   *     selection. The original anchor's instances are kept selected
   *     (the broaden is purely additive, not replacing). Anchor advances
   *     to the parent group so successive `[` walks further up.
   *   - A frame is pushed onto pickwalkStack so `]` can undo this exact step.
   */
  pickwalkBroaden() {
    const gm = globalThis._editorScope?.groupManager;
    if (!gm || !this.lastAnchor) return false;

    let parentGroupId = null;
    if (this.lastAnchor.kind === "instance") {
      const inst = this._findInstanceByUid(this.lastAnchor.id);
      if (!inst) return false;
      parentGroupId = gm.getInstanceParent(inst) || null;
    } else {
      const groups = gm.getGroups();
      const g = groups[this.lastAnchor.id];
      if (!g) return false;
      parentGroupId = g.parentId || null;
    }

    if (!parentGroupId) return false; // already at root

    const parentDescendants = gm.getDescendantInstances(parentGroupId);
    if (!parentDescendants || parentDescendants.length === 0) return false;

    // Purely additive: only add things not already selected. Track exactly
    // what we added so `]` can remove the same set without touching the
    // pre-existing selection (including the original anchor).
    const added = new Set();
    for (const inst of parentDescendants) {
      if (!this.selectedObjects.has(inst)) added.add(inst);
    }

    // If nothing new would be added, the parent is already fully covered;
    // still advance the anchor so a subsequent `[` walks further up.
    this._runPickwalkInternal(() => {
      if (added.size > 0) this.addToSelection(...added);
    });

    this.pickwalkStack.push({
      anchor: this.lastAnchor,
      added,
    });
    this.lastAnchor = { kind: "group", id: parentGroupId };
    return true;
  }

  /**
   * `]` — undo the most recent pickwalkBroaden().
   *
   * Per spec, `]` cannot narrow past a group anchor (i.e., we don't pick
   * an arbitrary first child); the only meaningful narrow is reversing the
   * last broaden. If the stack is empty, no-op. Removes only the instances
   * that this broaden step actually added — the original anchor and any
   * pre-existing selection survive.
   */
  pickwalkNarrow() {
    if (this.pickwalkStack.length === 0) return false;
    const frame = this.pickwalkStack.pop();
    this._runPickwalkInternal(() => {
      if (frame.added.size > 0) this.removeFromSelection(...frame.added);
    });
    this.lastAnchor = frame.anchor;
    return true;
  }

  // Visualization methods
  createSelectionVisualization(instance) {
    const gizmoIds = createDebugGizmoForInstanceTris(
      instance,
      "GizmosSelector",
    );

    // Update gizmo colors to selection color
    gizmoIds.forEach((id) => {
      const gizmo = this.gizmoManager.getGizmo(id);
      if (gizmo) {
        this.gizmoManager.updateGizmo(id, { color: this.selectionColor });
      }
    });

    this.selectionGizmoIds.set(instance, gizmoIds);
  }

  removeSelectionVisualization(instance) {
    const gizmoIds = this.selectionGizmoIds.get(instance);
    if (gizmoIds) {
      deleteDebugGizmoIds(gizmoIds);
      this.selectionGizmoIds.delete(instance);
    }
  }

  updateSelectionBoundingBox() {
    this.clearSelectionBoundingBox();
    if (this.selectedObjects.size === 0) {
      return;
    }
    if (this.currentTransformMode === "boxScale") return;

    const bounds = this.calculateSelectionBounds();
    if (!bounds) return;

    // Create wireframe bounding box with scaling config for just line thickness
    this.selectionBoundingBoxId = this.gizmoManager.createGizmo(
      "box3D",
      {
        x: bounds.centerX,
        y: bounds.centerY,
        z: bounds.centerZ,
        width: bounds.width + 5,
        height: bounds.height + 5,
        depth: bounds.depth + 5,
        filled: false,
        lineWidth: 0.7, // Fixed line width
        color: this.boundingBoxColor,
      },
      ["selection", "boundingBox"],
      false,
      "Gizmos",
      this.gizmoManager.constructor.SCALING_CONFIGS.SELECTION_BOX, // Only scale line thickness
    );
  }

  clearSelectionBoundingBox() {
    if (this.selectionBoundingBoxId) {
      this.gizmoManager.deleteGizmo(this.selectionBoundingBoxId);
      this.selectionBoundingBoxId = null;
    }
  }

  updateAxisGizmo(camera = null) {
    this.clearAxisGizmo();
    if (this.selectedObjects.size === 0) {
      return;
    }

    let centerX, centerY, centerZ;
    if (this.selectedObjects.size === 1) {
      // For single selection, use instance position directly
      const instance = this.selectedObjects.values().next().value;
      centerX = instance.x;
      centerY = instance.y;
      if (instance.originalZElevation !== undefined) {
        centerZ = instance.originalZElevation;
      } else {
        centerZ = instance.zElevation || 0; // Use zElevation if available
      }
    } else {
      const bounds = this.calculateSelectionBounds();
      if (!bounds) return;
      centerX = bounds.centerX;
      centerY = bounds.centerY;
      centerZ = bounds.centerZ;
    }

    let xDirection = 1;
    let yDirection = 1;
    let zDirection = 1;
    let sf = 1;

    if (camera) {
      const cameraPos = camera.getCameraPosition();
      const toCameraX = cameraPos[0] - centerX;
      const toCameraY = cameraPos[1] - centerY;
      const toCameraZ = cameraPos[2] - centerZ;
      const dist = Math.sqrt(
        toCameraX * toCameraX + toCameraY * toCameraY + toCameraZ * toCameraZ,
      );
      sf = dist / 1000;
      xDirection = toCameraX >= 0 ? 1 : -1;
      yDirection = toCameraY >= 0 ? 1 : -1;
      zDirection = toCameraZ >= 0 ? 1 : -1;
    }

    const axisLength = this.axisLength;
    const axisThickness = this.axisThickness;
    // Planes/center are scaled at creation time because the scaling system
    // can't move the plane's position offset relative to the cluster center.
    const centerSize = this.centerSize * sf;
    const planeSize = this.planeSize * sf;

    const SC = this.gizmoManager.constructor.SCALING_CONFIGS;

    // Create axis gizmos with interaction enabled
    this.axisGizmoIds.xArrow = this.gizmoManager.createGizmo(
      "arrow3D",
      {
        x1: centerX,
        y1: centerY,
        z1: centerZ,
        x2: centerX + axisLength * xDirection,
        y2: centerY,
        z2: centerZ,
        thickness: axisThickness,
        color: this.xAxisColor,
        headSize: 0.3,
      },
      ["axis", "x-axis"],
      true,
      "GizmosAbove",
      SC.AXIS_ARROW,
    );

    this.axisGizmoIds.yArrow = this.gizmoManager.createGizmo(
      "arrow3D",
      {
        x1: centerX,
        y1: centerY,
        z1: centerZ,
        x2: centerX,
        y2: centerY + axisLength * yDirection,
        z2: centerZ,
        thickness: axisThickness,
        color: this.yAxisColor,
        headSize: 0.3,
      },
      ["axis", "y-axis"],
      true,
      "GizmosAbove",
      SC.AXIS_ARROW,
    );

    this.axisGizmoIds.zArrow = this.gizmoManager.createGizmo(
      "arrow3D",
      {
        x1: centerX,
        y1: centerY,
        z1: centerZ,
        x2: centerX,
        y2: centerY,
        z2: centerZ + axisLength * zDirection,
        thickness: axisThickness,
        color: this.zAxisColor,
        headSize: 0.3,
      },
      ["axis", "z-axis"],
      true,
      "GizmosAbove",
      SC.AXIS_ARROW,
    );

    // Plane gizmos for 2D movement (small squares at axis intersections)
    const planeOffset = planeSize * 0.7; // Offset from center

    // XY plane (red-green, moves in Z direction)
    this.axisGizmoIds.xyPlane = this.gizmoManager.createGizmo(
      "plane3D",
      {
        x: centerX + planeOffset * xDirection,
        y: centerY + planeOffset * yDirection,
        z: centerZ,
        width: planeSize,
        height: planeSize,
        normal: [0, 0, 1],
        filled: true,
        color: this.xyPlaneColor,
        angleX: 0,
        angleY: 0,
        angleZ: Math.PI / 2,
      },
      ["axis", "xy-plane"],
      true,
      "GizmosAbove",
    );

    // XZ plane (red-blue, moves in Y direction)
    this.axisGizmoIds.xzPlane = this.gizmoManager.createGizmo(
      "plane3D",
      {
        x: centerX + planeOffset * xDirection,
        y: centerY,
        z: centerZ + planeOffset * zDirection,
        width: planeSize,
        height: planeSize,
        normal: [0, 1, 0],
        filled: true,
        color: this.xzPlaneColor,
        angleX: Math.PI / 2,
        angleY: 0,
        angleZ: 0,
      },
      ["axis", "xz-plane"],
      true,
      "GizmosAbove",
    );

    // YZ plane (green-blue, moves in X direction)
    this.axisGizmoIds.yzPlane = this.gizmoManager.createGizmo(
      "plane3D",
      {
        x: centerX,
        y: centerY + planeOffset * yDirection,
        z: centerZ + planeOffset * zDirection,
        width: planeSize,
        height: planeSize,
        normal: [1, 0, 0],
        filled: true,
        color: this.yzPlaneColor,
        angleX: 0,
        angleY: Math.PI / 2,
        angleZ: 0,
      },
      ["axis", "yz-plane"],
      true,
      "GizmosAbove",
    );

    // Center point
    this.axisGizmoIds.center = this.gizmoManager.createGizmo(
      "box3D",
      {
        x: centerX,
        y: centerY,
        z: centerZ,
        width: centerSize,
        height: centerSize,
        depth: centerSize,
        filled: true,
        color: this.centerColor,
      },
      ["axis", "center"],
      true,
      "GizmosAbove",
    );

    // draw gizmo triangles for each axis
    // this.interactionTrianglesIds = this.gizmoManager.drawGizmoTriangles([
    //   this.axisGizmoIds.xArrow,
    //   this.axisGizmoIds.yArrow,
    //   this.axisGizmoIds.zArrow,
    //   this.axisGizmoIds.xyPlane,
    //   this.axisGizmoIds.xzPlane,
    //   this.axisGizmoIds.yzPlane,
    //   this.axisGizmoIds.center,
    // ]);
  }

  clearAxisGizmo() {
    Object.values(this.axisGizmoIds).forEach((id) => {
      if (id) {
        this.gizmoManager.deleteGizmo(id);
      }
    });
    // if (this.interactionTrianglesIds) {
    //   this.interactionTrianglesIds.forEach((id) => {
    //     this.gizmoManager.deleteGizmo(id);
    //   });
    // }
    // this.interactionTrianglesIds = [];

    this.axisGizmoIds = {
      xArrow: null,
      yArrow: null,
      zArrow: null,
      center: null,
      xyPlane: null,
      xzPlane: null,
      yzPlane: null,
    };
  }

  // Utility methods
  calculateSelectionBounds() {
    if (this.selectedObjects.size === 0) {
      return null;
    }

    let minX = Infinity,
      maxX = -Infinity;
    let minY = Infinity,
      maxY = -Infinity;
    let minZ = Infinity,
      maxZ = -Infinity;

    this.selectedObjects.forEach((instance) => {
      const bounds = getInstanceBounds(instance);
      if (!bounds) return;
      if (bounds.left < minX) minX = bounds.left;
      if (bounds.right > maxX) maxX = bounds.right;
      if (bounds.top < minY) minY = bounds.top;
      if (bounds.bottom > maxY) maxY = bounds.bottom;
      if (bounds.minZ < minZ) minZ = bounds.minZ;
      if (bounds.maxZ > maxZ) maxZ = bounds.maxZ;
    });

    return {
      minX,
      maxX,
      minY,
      maxY,
      minZ,
      maxZ,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      centerZ: (minZ + maxZ) / 2,
      width: maxX - minX,
      height: maxY - minY,
      depth: maxZ - minZ,
    };
  }

  isAxisGizmo(gizmoId) {
    return Object.values(this.axisGizmoIds).includes(gizmoId);
  }

  // Check if gizmo belongs to transform system
  isTransformGizmo(gizmoId) {
    return this.transformGizmos.isTransformGizmo(gizmoId);
  }

  // Check if any gizmo interaction is happening (for preventing selection updates)
  isGizmoInteractionActive() {
    return (
      this.gizmoInteractionActive ||
      this.isDragging ||
      this.transformGizmos.isDragging
    );
  }

  // Transform mode management
  setTransformMode(mode, camera = null) {
    // Always remember the chosen mode, even if there's no current selection,
    // so it gets applied as soon as the user selects something.
    if (mode) {
      this.currentTransformMode = mode;
    }

    if (this.selectedObjects.size === 0) {
      this.transformGizmos.hideGizmos();

      // Update toolbar tool state to reflect the (still-remembered) mode
      if (globalThis._editorScope?.toolbar) {
        globalThis._editorScope.toolbar.updateTransformToolState(
          this.currentTransformMode,
        );
      }
      return;
    }

    this.transformGizmos.endTransformDrag();

    switch (mode) {
      case "move":
        this.transformGizmos.hideGizmos();
        this.updateAxisGizmo(camera);
        break;
      case "rotate":
        this.clearAxisGizmo();
        this.transformGizmos.showRotationGizmo(camera);
        break;
      case "scale":
        this.clearAxisGizmo();
        this.transformGizmos.showScaleGizmo(camera);
        break;
      case "boxScale":
        this.clearAxisGizmo();
        this.transformGizmos.showBoxScaleGizmo(camera);
        break;
      default:
        this.transformGizmos.hideGizmos();
        this.clearAxisGizmo();
        break;
    }

    // Update toolbar tool state
    if (globalThis._editorScope?.toolbar) {
      globalThis._editorScope.toolbar.updateTransformToolState(mode);
    }
  }

  // Toggle transform modes (G for move, R for rotate, S for scale)
  toggleTransformMode() {
    if (this.selectedObjects.size === 0) return;
    const camera = globalThis._editorScope.cameraType;

    switch (this.currentTransformMode) {
      case "move":
        this.setTransformMode("rotate", camera);
        break;
      case "rotate":
        this.setTransformMode("scale", camera);
        break;
      case "scale":
        this.setTransformMode("boxScale", camera);
        break;
      case "boxScale":
        this.setTransformMode("move", camera);
        break;
      default:
        this.setTransformMode("move", camera);
        break;
    }
  }

  // Handle keyboard shortcuts for transform modes
  handleKeyboardInput(keyCode) {
    if (this.selectedObjects.size === 0) return false;

    switch (keyCode) {
      // case "KeyG": // Move/Grab mode
      //   this.setTransformMode("move", camera);
      //   return true;
      // case "KeyR": // Rotate mode
      //   this.setTransformMode("rotate", camera);
      //   return true;
      // case "KeyS": // Scale mode
      //   this.setTransformMode("scale", camera);
      //   return true;
      case "Tab": // Toggle between modes
        this.toggleTransformMode();
        return true;
      // case "Escape": // Clear transform mode
      //   this.setTransformMode(null, camera);
      //   return true;
      default:
        return false;
    }
  }

  getAxisFromGizmoId(gizmoId) {
    if (gizmoId === this.axisGizmoIds.xArrow) {
      return "x";
    } else if (gizmoId === this.axisGizmoIds.yArrow) {
      return "y";
    } else if (gizmoId === this.axisGizmoIds.zArrow) {
      return "z";
    } else if (gizmoId === this.axisGizmoIds.xyPlane) {
      return "xy";
    } else if (gizmoId === this.axisGizmoIds.xzPlane) {
      return "xz";
    } else if (gizmoId === this.axisGizmoIds.yzPlane) {
      return "yz";
    } else if (gizmoId === this.axisGizmoIds.center) {
      return "center";
    }
    return null;
  }

  // Gizmo interaction handlers
  handleAxisGizmoHover(id, gizmo) {
    // Highlight the hovered axis or plane
    const axis = this.getAxisFromGizmoId(id);
    if (axis) {
      this.highlightAxis(axis, true);
    }
    this.gizmoInteractionActive = true;
  }

  handleAxisGizmoHoverEnd(id, gizmo) {
    // Remove highlight from the axis or plane
    const axis = this.getAxisFromGizmoId(id);
    if (axis) {
      this.highlightAxis(axis, false);
    }
    this.gizmoInteractionActive = false;
  }

  handleAxisGizmoClick(id, gizmo) {
    const axis = this.getAxisFromGizmoId(id);
    if (axis) {
      // Start drag with current mouse position from gizmo manager
      this.gizmoInteractionActive = false;
      this.startDragOperation(
        axis,
        this.gizmoManager.mouseX,
        this.gizmoManager.mouseY,
      );
    }
  }

  highlightAxis(axis, highlight) {
    const color = highlight ? this.highlightColor : this.getAxisColor(axis);

    if (axis === "x") {
      if (this.axisGizmoIds.xArrow) {
        this.gizmoManager.updateGizmo(this.axisGizmoIds.xArrow, { color });
      }
    } else if (axis === "y") {
      if (this.axisGizmoIds.yArrow) {
        this.gizmoManager.updateGizmo(this.axisGizmoIds.yArrow, { color });
      }
    } else if (axis === "z") {
      if (this.axisGizmoIds.zArrow) {
        this.gizmoManager.updateGizmo(this.axisGizmoIds.zArrow, { color });
      }
    } else if (axis === "xy") {
      if (this.axisGizmoIds.xyPlane) {
        const planeColor = highlight ? this.highlightColor : this.xyPlaneColor;
        this.gizmoManager.updateGizmo(this.axisGizmoIds.xyPlane, {
          color: planeColor,
        });
      }
    } else if (axis === "xz") {
      if (this.axisGizmoIds.xzPlane) {
        const planeColor = highlight ? this.highlightColor : this.xzPlaneColor;
        this.gizmoManager.updateGizmo(this.axisGizmoIds.xzPlane, {
          color: planeColor,
        });
      }
    } else if (axis === "yz") {
      if (this.axisGizmoIds.yzPlane) {
        const planeColor = highlight ? this.highlightColor : this.yzPlaneColor;
        this.gizmoManager.updateGizmo(this.axisGizmoIds.yzPlane, {
          color: planeColor,
        });
      }
    } else if (axis === "center") {
      if (this.axisGizmoIds.center) {
        const centerColor = highlight ? this.highlightColor : this.centerColor;
        this.gizmoManager.updateGizmo(this.axisGizmoIds.center, {
          color: centerColor,
        });
      }
    }
  }

  getAxisColor(axis) {
    switch (axis) {
      case "x":
        return this.xAxisColor;
      case "y":
        return this.yAxisColor;
      case "z":
        return this.zAxisColor;
      default:
        return this.centerColor;
    }
  } // Drag operation methods
  startDragOperation(axis, mouseX = 0, mouseY = 0) {
    if (this.selectedObjects.size === 0) return;

    this.isDragging = true;
    this.dragAxis = axis;
    this.dragStartMousePos = { x: mouseX, y: mouseY };
    this.lastMouseX = mouseX;
    this.lastMouseY = mouseY;

    // Store original positions
    this.originalPositions.clear();
    this.selectedObjects.forEach((instance) => {
      this.originalPositions.set(instance, {
        x: instance.x,
        y: instance.y,
        z:
          instance.originalZElevation !== undefined
            ? instance.originalZElevation
            : instance.zElevation || 0,
      });
    });
  }

  updateMouseDrag(mouseX, mouseY, camera = null) {
    if (!this.isDragging || !camera) return;

    // Get selection bounds to determine the center point for movement calculations
    const bounds = this.calculateSelectionBounds();
    if (!bounds) return;

    const selectionCenterX = bounds.centerX;
    const selectionCenterY = bounds.centerY;
    const selectionCenterZ = bounds.centerZ;

    // Get current mouse ray for projection-based dragging
    const currentRay = globalThis._editorScope.getScreenRay(mouseX, mouseY);
    const startRay = globalThis._editorScope.getScreenRay(
      this.dragStartMousePos.x,
      this.dragStartMousePos.y,
    );

    // Calculate constraint-aware movement based on drag axis
    let constrainedDeltaX = 0;
    let constrainedDeltaY = 0;
    let constrainedDeltaZ = 0;

    // Helper function to calculate deltas from plane intersections
    const calculatePlaneDeltas = (planeNormal) => {
      const currentIntersection = this.intersectRayWithPlane(
        currentRay,
        [selectionCenterX, selectionCenterY, selectionCenterZ],
        planeNormal,
      );
      const startIntersection = this.intersectRayWithPlane(
        startRay,
        [selectionCenterX, selectionCenterY, selectionCenterZ],
        planeNormal,
      );

      if (currentIntersection && startIntersection) {
        return {
          deltaX: currentIntersection[0] - startIntersection[0],
          deltaY: currentIntersection[1] - startIntersection[1],
          deltaZ: currentIntersection[2] - startIntersection[2],
        };
      }
      return null;
    };

    // Helper function to select the best plane for single-axis dragging
    const selectBestPlaneForAxis = (axis) => {
      const forward = normalize(camera.getLookVector());
      let candidatePlanes = [];

      if (axis === "x") {
        candidatePlanes = [
          { normal: [0, 0, 1], name: "XY" }, // XY plane
          { normal: [0, 1, 0], name: "XZ" }, // XZ plane
        ];
      } else if (axis === "y") {
        candidatePlanes = [
          { normal: [0, 0, 1], name: "XY" }, // XY plane
          { normal: [1, 0, 0], name: "YZ" }, // YZ plane
        ];
      } else if (axis === "z") {
        candidatePlanes = [
          { normal: [0, 1, 0], name: "XZ" }, // XZ plane
          { normal: [1, 0, 0], name: "YZ" }, // YZ plane
        ];
      }

      // Find the plane that faces the camera most (smallest absolute dot product)
      let bestPlane = candidatePlanes[0];
      let smallestDot = Math.abs(
        forward[0] * bestPlane.normal[0] +
          forward[1] * bestPlane.normal[1] +
          forward[2] * bestPlane.normal[2],
      );

      for (let i = 1; i < candidatePlanes.length; i++) {
        const plane = candidatePlanes[i];
        const dot = Math.abs(
          forward[0] * plane.normal[0] +
            forward[1] * plane.normal[1] +
            forward[2] * plane.normal[2],
        );

        if (dot > smallestDot) {
          smallestDot = dot;
          bestPlane = plane;
        }
      }

      return bestPlane.normal;
    };

    // Apply constraints based on drag axis
    if (this.dragAxis === "x") {
      // For X-axis dragging: pick best plane between XY and XZ
      const planeNormal = selectBestPlaneForAxis("x");
      const deltas = calculatePlaneDeltas(planeNormal);

      if (deltas) {
        // Project delta onto X-axis only
        constrainedDeltaX = deltas.deltaX;
        constrainedDeltaY = 0;
        constrainedDeltaZ = 0;
      }
    } else if (this.dragAxis === "y") {
      // For Y-axis dragging: pick best plane between XY and YZ
      const planeNormal = selectBestPlaneForAxis("y");
      const deltas = calculatePlaneDeltas(planeNormal);

      if (deltas) {
        // Project delta onto Y-axis only
        constrainedDeltaX = 0;
        constrainedDeltaY = deltas.deltaY;
        constrainedDeltaZ = 0;
      }
    } else if (this.dragAxis === "z") {
      // For Z-axis dragging: pick best plane between XZ and YZ
      const planeNormal = selectBestPlaneForAxis("z");
      const deltas = calculatePlaneDeltas(planeNormal);

      if (deltas) {
        // Project delta onto Z-axis only
        constrainedDeltaX = 0;
        constrainedDeltaY = 0;
        constrainedDeltaZ = deltas.deltaZ;
      }
    } else if (this.dragAxis === "xy") {
      // For XY plane dragging: intersect mouse ray with XY plane at selection center Z
      const deltas = calculatePlaneDeltas([0, 0, 1]);

      if (deltas) {
        constrainedDeltaX = deltas.deltaX;
        constrainedDeltaY = deltas.deltaY;
        constrainedDeltaZ = 0;
      }
    } else if (this.dragAxis === "xz") {
      // For XZ plane dragging: intersect mouse ray with XZ plane at selection center Y
      const deltas = calculatePlaneDeltas([0, 1, 0]);

      if (deltas) {
        constrainedDeltaX = deltas.deltaX;
        constrainedDeltaY = 0;
        constrainedDeltaZ = deltas.deltaZ;
      }
    } else if (this.dragAxis === "yz") {
      // For YZ plane dragging: intersect mouse ray with YZ plane at selection center X
      const deltas = calculatePlaneDeltas([1, 0, 0]);

      if (deltas) {
        constrainedDeltaX = 0;
        constrainedDeltaY = deltas.deltaY;
        constrainedDeltaZ = deltas.deltaZ;
      }
    } else if (this.dragAxis === "center") {
      // For center dragging: intersect mouse ray with camera-facing plane at selection center
      const forward = normalize(camera.getLookVector());
      const deltas = calculatePlaneDeltas(forward);

      if (deltas) {
        constrainedDeltaX = deltas.deltaX;
        constrainedDeltaY = deltas.deltaY;
        constrainedDeltaZ = deltas.deltaZ;
      }
    }

    // Apply grid snapping
    const gridSystem = globalThis._editorScope?.gridSystem;
    let finalDeltaX = constrainedDeltaX;
    let finalDeltaY = constrainedDeltaY;
    let finalDeltaZ = constrainedDeltaZ;

    if (gridSystem) {
      // Only snap on axes that are being changed
      const snapOptions = {
        ignoreX:
          this.dragAxis === "y" ||
          this.dragAxis === "z" ||
          this.dragAxis === "yz",
        ignoreY:
          this.dragAxis === "x" ||
          this.dragAxis === "z" ||
          this.dragAxis === "xz",
        ignoreZ:
          this.dragAxis === "x" ||
          this.dragAxis === "y" ||
          this.dragAxis === "xy",
      };

      const isSingleSelection = this.selectedObjects.size === 1;

      if (isSingleSelection) {
        // Snap the final absolute position for the single selected object
        const instance = this.selectedObjects.values().next().value;
        const originalPos = this.originalPositions.get(instance);
        if (originalPos) {
          const snappedPos = gridSystem.snapToGrid(
            {
              x: originalPos.x + constrainedDeltaX,
              y: originalPos.y + constrainedDeltaY,
              z: originalPos.z + constrainedDeltaZ,
            },
            snapOptions,
          );
          finalDeltaX = snappedPos.x - originalPos.x;
          finalDeltaY = snappedPos.y - originalPos.y;
          finalDeltaZ = snappedPos.z - originalPos.z;
        }
      } else {
        // Snap the delta once and apply consistently to all objects
        const snappedDelta = gridSystem.snapToGrid(
          { x: constrainedDeltaX, y: constrainedDeltaY, z: constrainedDeltaZ },
          snapOptions,
        );
        finalDeltaX = snappedDelta.x;
        finalDeltaY = snappedDelta.y;
        finalDeltaZ = snappedDelta.z;
      }
    }

    // Apply movement to all selected objects using the same snapped delta
    this.selectedObjects.forEach((instance) => {
      const originalPos = this.originalPositions.get(instance);
      if (!originalPos) return;

      const finalX = originalPos.x + finalDeltaX;
      const finalY = originalPos.y + finalDeltaY;
      const finalZ = originalPos.z + finalDeltaZ;

      // Update instance position
      instance.x = finalX;
      instance.y = finalY;
      if (instance.originalZElevation !== undefined) {
        instance.originalZElevation = finalZ;
      } else if (instance.zElevation !== undefined) {
        instance.zElevation = finalZ;
      }
    });

    this.lastMouseX = mouseX;
    this.lastMouseY = mouseY;

    // Update visualizations
    this.updateSelectionVisualizations();
    this.updateAxisGizmo(camera);
  }

  endDragOperation() {
    if (this.isDragging && globalThis._editorScope?.stateManager) {
      globalThis._editorScope.stateManager.pushUndoState("Move Objects");
    }

    this.isDragging = false;
    this.gizmoInteractionActive = false;
    this.dragAxis = null;
    this.originalPositions.clear();
  }

  updateSelectionVisualizations() {
    // Update triangle visualizations
    this.selectedObjects.forEach((instance) => {
      const gizmoIds = this.selectionGizmoIds.get(instance);
      if (gizmoIds) {
        // Remove old triangles
        deleteDebugGizmoIds(gizmoIds);
        // Create new triangles at updated position
        this.createSelectionVisualization(instance);
      }
    });

    // Update bounding box and axis gizmo
    this.updateSelectionBoundingBox();

    // Refresh inspector to show updated values
    refreshInspector();
  }

  // Update camera-facing elements when camera moves
  updateCameraFacing(camera) {
    // Only update if we have selected objects
    if (this.selectedObjects.size === 0) return;
    // trigger a mouse update
    this.gizmoManager.updateMouse(
      this.gizmoManager.mouseX,
      this.gizmoManager.mouseY,
    );
    // Update transform gizmos camera-facing elements
    if (this.transformGizmos && this.transformGizmos.isActive) {
      this.transformGizmos.updateCameraFacing(camera);
    } else {
      this.updateAxisGizmo(camera);
    }
  }

  // Public utility methods
  destroy() {
    this.clearSelection();

    // Restore original callbacks
    this.gizmoManager.onGizmoHover = this.originalOnGizmoHover;
    this.gizmoManager.onGizmoClick = this.originalOnGizmoClick;
    this.gizmoManager.onGizmoHoverEnd = this.originalOnGizmoHoverEnd;
  }

  // Debug methods
  getSelectionInfo() {
    return {
      selectedCount: this.selectedObjects.size,
      selectedObjects: Array.from(this.selectedObjects).map(
        (obj) => obj.uid || obj.toString(),
      ),
      isDragging: this.isDragging,
      dragAxis: this.dragAxis,
      bounds: this.calculateSelectionBounds(),
    };
  }

  // Update method to be called from main mouse tracking
  updateMouseTracking(mouseX, mouseY, isClicked, camera) {
    // Store camera reference for axis gizmo direction calculation
    this.camera = camera;

    // Track mouse for drag operations
    if (this.isDragging) {
      this.updateMouseDrag(mouseX, mouseY, camera);
    }

    // Handle transform gizmo mouse movement
    if (this.transformGizmos.isDragging) {
      this.transformGizmos.handleMouseMove(mouseX, mouseY, camera);
    }

    // Handle 2D selection box
    this.updateSelectionBox(mouseX, mouseY, isClicked, camera);

    // End drag on mouse release
    if (this.isDragging && !isClicked) {
      this.endDragOperation();
    }

    // End transform drag on mouse release
    if (this.transformGizmos.isDragging && !isClicked) {
      this.transformGizmos.handleMouseUp();
    }

    this.update3DobjectsInSelection();
  }

  // 2D Selection Box Methods
  startSelectionBox(mouseX, mouseY) {
    if (this.gizmoInteractionActive || this.isDragging) {
      return false; // Don't start selection box if gizmo interaction is active
    }

    this.isSelectionBoxActive = true;
    this.selectionBoxStart = { x: mouseX, y: mouseY };
    this.selectionBoxEnd = { x: mouseX, y: mouseY };
    return true;
  }

  updateSelectionBox(mouseX, mouseY, isClicked, camera) {
    if (!this.isSelectionBoxActive) return;

    // Update the end position
    this.selectionBoxEnd = { x: mouseX, y: mouseY };

    // Calculate box dimensions
    const startX = Math.min(this.selectionBoxStart.x, this.selectionBoxEnd.x);
    const startY = Math.min(this.selectionBoxStart.y, this.selectionBoxEnd.y);
    const width = Math.abs(this.selectionBoxEnd.x - this.selectionBoxStart.x);
    const height = Math.abs(this.selectionBoxEnd.y - this.selectionBoxStart.y);

    // Only show the selection box if we've dragged a minimum distance
    if (
      width > this.selectionBoxMinDragDistance ||
      height > this.selectionBoxMinDragDistance
    ) {
      this.createOrUpdateSelectionBoxGizmo(startX, startY, width, height);
    }

    // End selection box on mouse release
    if (!isClicked) {
      this.endSelectionBox(camera);
    }
  }

  destroyInstance(instance) {
    // Clean up editor-only metadata (group membership, labels) tied to this uid.
    globalThis._editorScope?.stateManager?.clearInstanceMeta?.(instance.uid);
    instance.destroy();
    this.removeFromSelection(instance);
  }

  createOrUpdateSelectionBoxGizmo(x, y, width, height) {
    // Remove existing selection box gizmo
    if (this.selectionBoxGizmoId) {
      this.gizmoManager.deleteGizmo(this.selectionBoxGizmoId);
      this.selectionBoxGizmoId = null;
    }

    // get UI viewport
    const uiViewport = globalThis._editorScope.uiViewport();
    if (uiViewport) {
      x += uiViewport.left;
      y += uiViewport.top;
    }

    // Create new selection box gizmo
    this.selectionBoxGizmoId = this.gizmoManager.createGizmo(
      "box2D",
      {
        x: x,
        y: y,
        width: width,
        height: height,
        filled: false,
        color: [0, 0.7, 1, 0.8], // Light blue
        lineWidth: 1,
      },
      ["selection-box", "ui"],
      false, // Not interactive
      "UI", // UI layer for screen-space rendering
    );
  }

  endSelectionBox(camera) {
    if (!this.isSelectionBoxActive) return;

    // Calculate final box dimensions
    const startX = Math.min(this.selectionBoxStart.x, this.selectionBoxEnd.x);
    const startY = Math.min(this.selectionBoxStart.y, this.selectionBoxEnd.y);
    const endX = Math.max(this.selectionBoxStart.x, this.selectionBoxEnd.x);
    const endY = Math.max(this.selectionBoxStart.y, this.selectionBoxEnd.y);
    const width = endX - startX;
    const height = endY - startY;

    // Only perform selection if we've dragged a minimum distance
    if (
      width > this.selectionBoxMinDragDistance ||
      height > this.selectionBoxMinDragDistance
    ) {
      this.performBoxSelection(startX, startY, endX, endY, camera);
    }

    // Clean up
    this.isSelectionBoxActive = false;
    if (this.selectionBoxGizmoId) {
      this.gizmoManager.deleteGizmo(this.selectionBoxGizmoId);
      this.selectionBoxGizmoId = null;
    }
  }

  performBoxSelection(startX, startY, endX, endY, camera) {
    if (!camera) return;

    // Get all selectable objects
    const candidates = [];
    for (const objectTypeName of selectableObjects) {
      const objectType =
        globalThis._editorScope.runtime.objects[objectTypeName];
      if (objectType) {
        candidates.push(
          ...objectType
            .getAllInstances()
            .filter((instance) => instance.isVisible),
        );
      }
    }

    // Find objects that fall within the selection box
    const selectedInstances = [];

    for (const instance of candidates) {
      if (
        this.isInstanceInSelectionBox(
          instance,
          startX,
          startY,
          endX,
          endY,
          camera,
        )
      ) {
        selectedInstances.push(instance);
      }
    }

    // Apply selection
    if (selectedInstances.length > 0) {
      // Check if shift is held to add to selection instead of replacing
      const shiftPressed =
        globalThis._editorScope.runtime.keyboard.isKeyDown("ShiftLeft") ||
        globalThis._editorScope.runtime.keyboard.isKeyDown("ShiftRight") ||
        globalThis._editorScope.runtime.keyboard.isKeyDown("Shift");

      if (shiftPressed) {
        // Add to existing selection
        selectedInstances.forEach((instance) => {
          this.addToSelection(instance);
        });
      } else {
        // Replace selection
        this.setSelection(...selectedInstances);
      }
    } else {
      // Clear selection if no objects found and shift not held
      const shiftPressed =
        globalThis._editorScope.runtime.keyboard.isKeyDown("ShiftLeft") ||
        globalThis._editorScope.runtime.keyboard.isKeyDown("ShiftRight") ||
        globalThis._editorScope.runtime.keyboard.isKeyDown("Shift");

      if (!shiftPressed) {
        this.clearSelection();
      }
    }
  }

  isInstanceInSelectionBox(instance, startX, startY, endX, endY, camera) {
    // Get instance triangles and check if any are within the selection box
    const triangles = instanceToTriList(instance);

    for (const triangle of triangles) {
      if (
        this.triangleIntersectsSelectionBox(
          triangle,
          startX,
          startY,
          endX,
          endY,
          camera,
        )
      ) {
        return true;
      }
    }

    return false;
  }

  triangleIntersectsSelectionBox(triangle, startX, startY, endX, endY, camera) {
    // Check if any vertex is inside the selection box
    for (const vertex of triangle) {
      if (
        this.isPosInSelectionBox(
          [vertex.x, vertex.y, vertex.zElevation],
          startX,
          startY,
          endX,
          endY,
          camera,
        )
      ) {
        return true;
      }
    }

    // Check if any edge intersects the selection box
    for (let i = 0; i < triangle.length; i++) {
      const edge = [triangle[i], triangle[(i + 1) % triangle.length]];
      if (this.edgeIntersectsSelectionBox(edge, startX, startY, endX, endY)) {
        return true;
      }
    }

    return false;
  }

  edgeIntersectsSelectionBox(edge, startX, startY, endX, endY) {
    // Project edge endpoints to screen space and check line intersections with selection box
    const screenPos1 = globalThis._editorScope.worldToScreen(
      edge[0].x,
      edge[0].y,
      edge[0].zElevation,
    );
    const screenPos2 = globalThis._editorScope.worldToScreen(
      edge[1].x,
      edge[1].y,
      edge[1].zElevation,
    );

    if (!screenPos1 || !screenPos2) return false;

    // Check if line intersects with any of the four selection box edges
    return (
      this.lineIntersectsLine(
        screenPos1.x,
        screenPos1.y,
        screenPos2.x,
        screenPos2.y,
        startX,
        startY,
        endX,
        startY,
      ) ||
      this.lineIntersectsLine(
        screenPos1.x,
        screenPos1.y,
        screenPos2.x,
        screenPos2.y,
        endX,
        startY,
        endX,
        endY,
      ) ||
      this.lineIntersectsLine(
        screenPos1.x,
        screenPos1.y,
        screenPos2.x,
        screenPos2.y,
        endX,
        endY,
        startX,
        endY,
      ) ||
      this.lineIntersectsLine(
        screenPos1.x,
        screenPos1.y,
        screenPos2.x,
        screenPos2.y,
        startX,
        endY,
        startX,
        startY,
      )
    );
  }

  lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) return false; // Lines are parallel

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
  }

  isPosInSelectionBox(worldPos, startX, startY, endX, endY, camera) {
    // Use the global screen projection function
    const screenPos = globalThis._editorScope.worldToScreen(
      worldPos[0],
      worldPos[1],
      worldPos[2],
    );

    if (!screenPos) return false;

    const screenX = screenPos.x;
    const screenY = screenPos.y;

    // Check if the screen position is within the selection box
    return (
      screenX >= startX &&
      screenX <= endX &&
      screenY >= startY &&
      screenY <= endY
    );
  }

  // Ray projection utility methods for gizmo dragging

  /**
   * Project a ray onto an axis line passing through a point
   * @param {Object} ray - The ray object with origin and direction
   * @param {number} linePointX - X coordinate of a point on the line
   * @param {number} linePointY - Y coordinate of a point on the line
   * @param {number} linePointZ - Z coordinate of a point on the line
   * @param {Array} lineDirection - Direction vector of the line [x, y, z]
   * @returns {Array|null} - Closest point on the line to the ray, or null if invalid
   */
  projectRayOntoAxisLine(
    ray,
    linePointX,
    linePointY,
    linePointZ,
    lineDirection,
  ) {
    // Vector from line point to ray origin
    const toRayX = ray.origin[0] - linePointX;
    const toRayY = ray.origin[1] - linePointY;
    const toRayZ = ray.origin[2] - linePointZ;

    // Normalize line direction
    const lineLength = Math.sqrt(
      lineDirection[0] ** 2 + lineDirection[1] ** 2 + lineDirection[2] ** 2,
    );
    if (lineLength === 0) return null;

    const lineDirX = lineDirection[0] / lineLength;
    const lineDirY = lineDirection[1] / lineLength;
    const lineDirZ = lineDirection[2] / lineLength;

    // Calculate cross products for closest point calculation
    const rayDirCrossLine = [
      ray.direction[1] * lineDirZ - ray.direction[2] * lineDirY,
      ray.direction[2] * lineDirX - ray.direction[0] * lineDirZ,
      ray.direction[0] * lineDirY - ray.direction[1] * lineDirX,
    ];

    const rayDirCrossLineLength = Math.sqrt(
      rayDirCrossLine[0] ** 2 +
        rayDirCrossLine[1] ** 2 +
        rayDirCrossLine[2] ** 2,
    );

    if (rayDirCrossLineLength === 0) {
      // Ray and line are parallel
      return [linePointX, linePointY, linePointZ];
    }

    const toRayCrossRayDir = [
      toRayZ * ray.direction[1] - toRayY * ray.direction[2],
      toRayX * ray.direction[2] - toRayZ * ray.direction[0],
      toRayY * ray.direction[0] - toRayX * ray.direction[1],
    ];

    const rayDirCrossLine2 = [
      toRayZ * ray.direction[0] - toRayX * ray.direction[2],
      toRayX * ray.direction[1] - toRayY * ray.direction[0],
    ];

    const t =
      (toRayCrossRayDir[0] * rayDirCrossLine[0] +
        toRayCrossRayDir[1] * rayDirCrossLine[1] +
        toRayCrossRayDir[2] * rayDirCrossLine[2]) /
      rayDirCrossLineLength ** 2;

    const closestPointX = linePointX + t * lineDirX;
    const closestPointY = linePointY + t * lineDirY;
    const closestPointZ = linePointZ + t * lineDirZ;

    return [closestPointX, closestPointY, closestPointZ];
  }

  /**
   * Intersect a ray with a plane
   * @param {Object} ray - Ray with origin and direction
   * @param {Array} planePoint - Point on the plane [x, y, z]
   * @param {Array} planeNormal - Normal vector of the plane [x, y, z]
   * @returns {Array|null} - Intersection point or null if no intersection
   */
  intersectRayWithPlane(ray, planePoint, planeNormal) {
    const denom = dot(ray.direction, planeNormal);
    if (Math.abs(denom) < 1e-6) {
      // Ray is parallel to plane
      return null;
    }

    const rayToPlane = subtract(planePoint, ray.origin);
    const t = dot(rayToPlane, planeNormal) / denom;

    if (t < 0) {
      // Intersection is behind ray origin
      return null;
    }

    return add(ray.origin, scale(ray.direction, t));
  }

  copySelected() {
    if (this.selectedObjects.size === 0) return;

    // Clear clipboard and copy selected objects
    this.clipboard = Array.from(this.selectedObjects).map((instance) =>
      globalThis._editorScope.stateManager.exportInstanceState(instance),
    );

    // Update toolbar to reflect clipboard state
    if (globalThis._editorScope?.toolbar) {
      globalThis._editorScope.toolbar.updateToolVisibility();
    }
  }
  pasteFromClipboard() {
    if (this.clipboard.length === 0) return;

    // Paste all objects from clipboard
    this.clearSelection(); // Clear current selection before pasting
    this.clipboard.forEach((state) => {
      const newInstance =
        globalThis._editorScope.stateManager.createInstanceFromState(state);
      if (newInstance) {
        this.addToSelection(newInstance);
      }
    });

    if (globalThis._editorScope?.stateManager) {
      globalThis._editorScope.stateManager.pushUndoState("Paste Objects");
    }
    refreshHierarchyPanel();
  }
  cutSelected() {
    if (this.selectedObjects.size === 0) return;

    // Copy to clipboard first
    this.copySelected();

    // Delete selected objects directly to avoid nested undo recording
    this.selectedObjects.forEach((instance) => {
      this.destroyInstance(instance);
    });

    // Clear selection after deletion
    this.clearSelection();

    // Update toolbar to reflect clipboard and selection state
    if (globalThis._editorScope?.toolbar) {
      globalThis._editorScope.toolbar.updateToolVisibility();
    }

    // Same group-pruning rationale as deleteSelected: cut destroys instances,
    // so groups left fully empty by the cut should disappear too.
    const gm = globalThis._editorScope?.groupManager;
    if (gm) gm.pruneEmptyGroups();

    if (globalThis._editorScope?.stateManager) {
      globalThis._editorScope.stateManager.pushUndoState("Cut Objects");
    }
    refreshHierarchyPanel();
  }
  duplicateSelected() {
    if (this.selectedObjects.size === 0) return;

    const tempClipboard = this.clipboard;
    this.copySelected(); // Copy current selection to clipboard

    // Paste objects manually to avoid nested undo recording
    this.clearSelection(); // Clear current selection before pasting
    this.clipboard.forEach((state) => {
      const newInstance =
        globalThis._editorScope.stateManager.createInstanceFromState(state);
      if (newInstance) {
        this.addToSelection(newInstance);
      }
    });

    this.clipboard = tempClipboard; // Restore original clipboard state

    if (globalThis._editorScope?.stateManager) {
      globalThis._editorScope.stateManager.pushUndoState("Duplicate Objects");
    }
    refreshHierarchyPanel();
  }
  deleteSelected() {
    if (this.selectedObjects.size === 0) return;

    // Delete all selected objects
    this.selectedObjects.forEach((instance) => {
      this.destroyInstance(instance);
    });

    // Clear selection after deletion
    this.clearSelection();

    // After the destroys, any group whose entire descendant-instance set was
    // in the selection is now empty. Prune those groups (and their newly-
    // emptied ancestors) so the user doesn't have to clean up by hand. This
    // mutates the groups map silently — the single pushUndoState below
    // captures both the destroyed instances and the removed groups in one
    // history entry.
    const gm = globalThis._editorScope?.groupManager;
    if (gm) gm.pruneEmptyGroups();

    if (globalThis._editorScope?.stateManager) {
      globalThis._editorScope.stateManager.pushUndoState("Delete Objects");
    }
    // Rebuild the hierarchy tree now that instances and possibly groups are gone.
    refreshHierarchyPanel();
  }
}
