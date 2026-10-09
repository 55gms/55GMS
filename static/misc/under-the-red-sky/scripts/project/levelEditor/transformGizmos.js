import { createDebugGizmoForInstanceTris } from "./debugGizmos.js";
import { refreshInspector } from "./inspectorUI.js";
import { getObjectBounds } from "./raycast.js";
import { getModelBaseSize } from "./model3DBaseSizes.js";
// Advanced Transform Gizmos for Rotation and Scale operations
// Supports different instance types: 2D objects, 3D shapes, and 3D objects
export class TransformGizmos {
  constructor(gizmoManager, selectionManager, runtime) {
    this.gizmoManager = gizmoManager;
    this.selectionManager = selectionManager;
    this.runtime = runtime;

    // Gizmo state
    this.isActive = false;
    this.currentMode = null; // 'rotation', 'scale', or 'boxScale'
    this.currentAxis = null; // 'x', 'y', 'z', 'xy', 'xz', 'yz', 'uniform'
    this.currentDraggingAxis = null; // Axis being dragged

    // Gizmo IDs storage
    this.rotationGizmoIds = {
      xRing: null,
      yRing: null,
      zRing: null,
      screenRing: null, // For screen-space rotation
    };

    this.scaleGizmoIds = {
      xHandle: null,
      yHandle: null,
      zHandle: null,
      xyPlane: null,
      xzPlane: null,
      yzPlane: null,
      uniformHandle: null, // Center cube for uniform scaling
    };

    this.boxScaleGizmoIds = {
      edges: [],
      edgeHandles: [],
      corners: [],
      faces: {},
    };
    this.boxScaleDragState = null;

    // Interaction state
    this.isDragging = false;
    this.dragStartMousePos = null;
    this.dragStartValues = new Map(); // instance -> initial values
    this.dragCenter = null;

    // Visual settings
    this.gizmoSize = 70;
    this.handleSize = 8;
    this.ringThickness = 3;
    this.planeSize = 22;

    // Colors
    this.xAxisColor = [1, 0, 0, 1]; // Red
    this.yAxisColor = [0, 1, 0, 1]; // Green
    this.zAxisColor = [0, 0, 1, 1]; // Blue
    this.uniformColor = [1, 1, 1, 1]; // White
    this.screenColor = [1, 1, 0, 1]; // Yellow for screen-space
    this.highlightColor = [1, 1, 0, 1]; // Yellow highlight

    // Box-scale palette — keep the familiar orange selection look instead of
    // turning the box white. Matches selectionManager's boundingBoxColor.
    this.boxScaleWireColor = [248 / 255, 94 / 255, 0, 0.85]; // Orange edges
    this.boxScaleCornerColor = [248 / 255, 94 / 255, 0, 1]; // Orange corners
    this.planeColors = {
      xy: [0, 0, 1, 1], // Blue
      xz: [0, 1, 0, 1], // Green
      yz: [1, 0, 0, 1], // Red
    };

    this.setupGizmoCallbacks();
  }

  setupGizmoCallbacks() {
    // Store original callbacks
    this.originalOnGizmoHover = this.gizmoManager.onGizmoHover;
    this.originalOnGizmoClick = this.gizmoManager.onGizmoClick;
    this.originalOnGizmoHoverEnd = this.gizmoManager.onGizmoHoverEnd;

    // Override callbacks to handle transform gizmo interactions
    this.gizmoManager.onGizmoHover = (id, gizmo) => {
      if (this.isTransformGizmo(id)) {
        this.handleTransformGizmoHover(id, gizmo);
      } else if (this.originalOnGizmoHover) {
        this.originalOnGizmoHover(id, gizmo);
      }
    };

    this.gizmoManager.onGizmoClick = (id, gizmo) => {
      if (this.isTransformGizmo(id)) {
        this.handleTransformGizmoClick(id, gizmo);
      } else if (this.originalOnGizmoClick) {
        this.originalOnGizmoClick(id, gizmo);
      }
    };

    this.gizmoManager.onGizmoHoverEnd = (id, gizmo) => {
      if (this.isTransformGizmo(id)) {
        this.handleTransformGizmoHoverEnd(id, gizmo);
      } else if (this.originalOnGizmoHoverEnd) {
        this.originalOnGizmoHoverEnd(id, gizmo);
      }
    };
  }

  // Instance type detection
  getInstanceType(instance) {
    // 3D Object (has model property)
    if (instance instanceof self.I3DObjectInstance) {
      return "object3d";
    }

    // 3D Shape (has zHeight property)
    if (instance.zHeight !== undefined) {
      return "shape3d";
    }

    // Object with mesh rotation capability (has MeshRotate behavior)
    if (instance.behaviors && instance.behaviors.MeshRotate) {
      return "meshRotation";
    }

    if (instance && instance._mesh3DRotation) {
      return "meshRotation2";
    }

    // 2D object with mesh (has getMeshSize method)
    if (instance.getMeshSize && instance.getMeshSize()[0] > 0) {
      return "mesh2d";
    }

    // Regular 2D object
    return "object2d";
  }

  // Get supported transform modes for instance type
  getSupportedModes(instanceType) {
    switch (instanceType) {
      case "object2d":
        return {
          rotation: ["z"], // Only Z-axis rotation
          scale: ["x", "y", "xy", "uniform"], // X, Y scaling
        };
      case "mesh2d":
        return {
          rotation: ["x", "y", "z"], // All axes (requires mesh manipulation)
          scale: ["x", "y", "z", "xy", "xz", "yz", "uniform"], // All axes
        };
      case "meshRotation":
        return {
          rotation: ["x", "y", "z"], // All axes via MeshRotate behavior (uses XYZ rotation order for gizmo display)
          scale: ["x", "y", "xy", "uniform"], // X, Y scaling only
        };
      case "meshRotation2":
        return {
          rotation: ["x", "y", "z"],
          scale: ["x", "y", "xy", "uniform"], // X, Y scaling only
        };
      case "shape3d":
        return {
          rotation: ["z"], // Only Z-axis rotation
          scale: ["x", "y", "z", "xy", "xz", "yz", "uniform"], // All axes
        };
      case "object3d":
        return {
          rotation: ["x", "y", "z"], // All axes (rotation affects scaling)
          scale: ["x", "y", "z", "xy", "xz", "yz", "uniform"], // All axes
        };
      default:
        return { rotation: [], scale: [] };
    }
  }

  // Determine common supported modes for multiple selected instances
  getCommonSupportedModes(instances) {
    if (instances.length === 0) return { rotation: [], scale: [] };

    let commonRotation = null;
    let commonScale = null;

    for (const instance of instances) {
      const instanceType = this.getInstanceType(instance);
      const supported = this.getSupportedModes(instanceType);

      if (commonRotation === null) {
        commonRotation = [...supported.rotation];
        commonScale = [...supported.scale];
      } else {
        // Find intersection
        commonRotation = commonRotation.filter((axis) =>
          supported.rotation.includes(axis),
        );
        commonScale = commonScale.filter((axis) =>
          supported.scale.includes(axis),
        );
      }
    }

    return {
      rotation: commonRotation || [],
      scale: commonScale || [],
    };
  }

  // Show rotation gizmo
  showRotationGizmo(camera = null) {
    this.hideGizmos();

    const selectedInstances = Array.from(this.selectionManager.getSelection());
    if (selectedInstances.length === 0) return;

    const supportedModes = this.getCommonSupportedModes(selectedInstances);
    if (supportedModes.rotation.length === 0) return;

    this.currentMode = "rotation";
    this.isActive = true;

    // Calculate gizmo position
    let centerX, centerY, centerZ;
    if (selectedInstances.length === 1) {
      // For single object, use its actual position
      const instance = selectedInstances[0];
      centerX = instance.x;
      centerY = instance.y;
      centerZ =
        instance.originalZElevation !== undefined
          ? instance.originalZElevation
          : instance.totalZElevation || 0;
    } else {
      // For multiple objects, use bounds center
      const bounds = this.selectionManager.calculateSelectionBounds();
      if (!bounds) return;
      centerX = bounds.centerX;
      centerY = bounds.centerY;
      centerZ = bounds.centerZ;
    }

    // Calculate base rotation matrix for scale gizmos (uses full rotation)
    const rotationMatrix = this.calculateGizmoRotationMatrix(selectedInstances);

    // Create rotation rings for each supported axis with proper gimbal lock orientation
    if (supportedModes.rotation.includes("x")) {
      // Get current rotation values for gizmo orientation
      const currentRotation =
        selectedInstances.length === 1
          ? this.getInstanceTransformValues(
              selectedInstances[0],
              this.getInstanceType(selectedInstances[0]),
            ).rotation
          : [0, 0, 0];

      // Get instance type for rotation order determination
      const instanceType =
        selectedInstances.length === 1
          ? this.getInstanceType(selectedInstances[0])
          : null;

      // X gizmo shows accumulated Z and Y rotations (applied last in ZYX order)
      // OR shows world-aligned for meshRotation (applied first in XYZ order)
      const xGizmoMatrix = this.createGizmoRotationMatrix(
        currentRotation,
        "x",
        instanceType,
      );
      const xNormal = this.transformVectorByMatrix([1, 0, 0], xGizmoMatrix);

      this.rotationGizmoIds.xRing = this.gizmoManager.createGizmo(
        "rotationRing",
        {
          x: centerX,
          y: centerY,
          z: centerZ,
          radius: this.gizmoSize,
          normal: xNormal,
          thickness: this.ringThickness,
          color: this.xAxisColor,
        },
        ["transform", "rotation", "x-rotation"],
        true,
        "GizmosAbove",
      );
    }

    if (supportedModes.rotation.includes("y")) {
      // Get current rotation values for gizmo orientation
      const currentRotation =
        selectedInstances.length === 1
          ? this.getInstanceTransformValues(
              selectedInstances[0],
              this.getInstanceType(selectedInstances[0]),
            ).rotation
          : [0, 0, 0];

      // Get instance type for rotation order determination
      const instanceType =
        selectedInstances.length === 1
          ? this.getInstanceType(selectedInstances[0])
          : null;

      // Y gizmo shows after X rotation for meshRotation (applied second in XYZ order) or after Z is applied (for others)
      const yGizmoMatrix = this.createGizmoRotationMatrix(
        currentRotation,
        "y",
        instanceType,
      );
      const yNormal = this.transformVectorByMatrix([0, 1, 0], yGizmoMatrix);

      this.rotationGizmoIds.yRing = this.gizmoManager.createGizmo(
        "rotationRing",
        {
          x: centerX,
          y: centerY,
          z: centerZ,
          radius: this.gizmoSize,
          normal: yNormal,
          thickness: this.ringThickness,
          color: this.yAxisColor,
        },
        ["transform", "rotation", "y-rotation"],
        true,
        "GizmosAbove",
      );
    }

    if (supportedModes.rotation.includes("z")) {
      // Get current rotation values for gizmo orientation
      const currentRotation =
        selectedInstances.length === 1
          ? this.getInstanceTransformValues(
              selectedInstances[0],
              this.getInstanceType(selectedInstances[0]),
            ).rotation
          : [0, 0, 0];

      // Get instance type for rotation order determination
      const instanceType =
        selectedInstances.length === 1
          ? this.getInstanceType(selectedInstances[0])
          : null;

      // Z gizmo shows rotation after X and Y are applied (for meshRotation) or world-aligned (for others)
      const zGizmoMatrix = this.createGizmoRotationMatrix(
        currentRotation,
        "z",
        instanceType,
      );
      const zNormal = this.transformVectorByMatrix([0, 0, 1], zGizmoMatrix);

      this.rotationGizmoIds.zRing = this.gizmoManager.createGizmo(
        "rotationRing",
        {
          x: centerX,
          y: centerY,
          z: centerZ,
          radius: this.gizmoSize,
          normal: zNormal,
          thickness: this.ringThickness,
          color: this.zAxisColor,
        },
        ["transform", "rotation", "z-rotation"],
        true,
        "GizmosAbove",
      );
    }

    // this.rotationGizmoIds.debugTriangles = createDebugGizmoForInstanceTris(
    //   this.gizmoManager.gizmos.get(this.rotationGizmoIds.zRing),
    //   "GizmosAbove"
    // );

    // Screen-space rotation ring - remove the extra yellow gizmo
    // We'll only show it when explicitly needed for specific use cases

    this._enableScalingOnGizmos(this.rotationGizmoIds);
  }

  // Show scale gizmo
  showScaleGizmo(camera = null) {
    this.hideGizmos();

    const selectedInstances = Array.from(this.selectionManager.getSelection());
    if (selectedInstances.length === 0) return;

    const supportedModes = this.getCommonSupportedModes(selectedInstances);
    if (supportedModes.scale.length === 0) return;

    this.currentMode = "scale";
    this.isActive = true;

    // Calculate gizmo position
    let centerX, centerY, centerZ;
    if (selectedInstances.length === 1) {
      // For single object, use its actual position
      const instance = selectedInstances[0];
      centerX = instance.x;
      centerY = instance.y;
      centerZ =
        instance.originalZElevation !== undefined
          ? instance.originalZElevation
          : instance.totalZElevation || 0;
    } else {
      // For multiple objects, use bounds center
      const bounds = this.selectionManager.calculateSelectionBounds();
      if (!bounds) return;
      centerX = bounds.centerX;
      centerY = bounds.centerY;
      centerZ = bounds.centerZ;
    }

    // Calculate rotation matrix based on selected instances using ZYX rotation order
    const rotationMatrix = this.calculateGizmoRotationMatrix(selectedInstances);

    // Calculate camera-facing directions in object space first, then transform
    let xDirection = 1; // Default to positive direction
    let yDirection = 1;
    let zDirection = 1;

    if (camera) {
      const cameraPos = camera.getCameraPosition();

      // Calculate direction from gizmo center to camera in world space
      const toCameraX = cameraPos[0] - centerX;
      const toCameraY = cameraPos[1] - centerY;
      const toCameraZ = cameraPos[2] - centerZ;

      // Transform camera direction to object space to determine which direction to face
      // Use the inverse (transpose) of the rotation matrix since it's orthonormal
      const toCameraObjectSpace = this.transformVectorByMatrix(
        [toCameraX, toCameraY, toCameraZ],
        this.transposeMatrix(rotationMatrix),
      );

      // Set handle direction to face towards camera in object space
      xDirection = toCameraObjectSpace[0] >= 0 ? 1 : -1;
      yDirection = toCameraObjectSpace[1] >= 0 ? 1 : -1;
      zDirection = toCameraObjectSpace[2] >= 0 ? 1 : -1;
    }

    // Transform axis directions from object space to world space
    const xAxis = this.transformVectorByMatrix(
      [xDirection, 0, 0],
      rotationMatrix,
    );
    const yAxis = this.transformVectorByMatrix(
      [0, yDirection, 0],
      rotationMatrix,
    );
    const zAxis = this.transformVectorByMatrix(
      [0, 0, zDirection],
      rotationMatrix,
    );

    // Create scale handles for each supported axis with proper orientation
    if (supportedModes.scale.includes("x")) {
      this.scaleGizmoIds.xHandle = this.gizmoManager.createGizmo(
        "scaleHandle",
        {
          x: centerX,
          y: centerY,
          z: centerZ,
          direction: xAxis,
          handleSize: this.handleSize,
          lineLength: this.gizmoSize,
          color: this.xAxisColor,
          thickness: this.ringThickness,
        },
        ["transform", "scale", "x-scale"],
        true,
        "GizmosAbove",
      );
    }

    if (supportedModes.scale.includes("y")) {
      this.scaleGizmoIds.yHandle = this.gizmoManager.createGizmo(
        "scaleHandle",
        {
          x: centerX,
          y: centerY,
          z: centerZ,
          direction: yAxis,
          handleSize: this.handleSize,
          lineLength: this.gizmoSize,
          color: this.yAxisColor,
          thickness: this.ringThickness,
        },
        ["transform", "scale", "y-scale"],
        true,
        "GizmosAbove",
      );
    }

    if (supportedModes.scale.includes("z")) {
      this.scaleGizmoIds.zHandle = this.gizmoManager.createGizmo(
        "scaleHandle",
        {
          x: centerX,
          y: centerY,
          z: centerZ,
          direction: zAxis,
          handleSize: this.handleSize,
          lineLength: this.gizmoSize,
          color: this.zAxisColor,
          thickness: this.ringThickness,
        },
        ["transform", "scale", "z-scale"],
        true,
        "GizmosAbove",
      );
    }

    // Compute distance-based scale for planes at creation time because the
    // scaling system can't move position offsets relative to the cluster center.
    let planeSf = 1;
    if (camera) {
      const cp = camera.getCameraPosition();
      const d = Math.sqrt(
        (cp[0] - centerX) ** 2 +
          (cp[1] - centerY) ** 2 +
          (cp[2] - centerZ) ** 2,
      );
      planeSf = d / 1000;
    }
    const scaledPlaneSize = this.planeSize * planeSf;

    // Create plane handles for 2D scaling with proper orientation using matrix composition
    if (supportedModes.scale.includes("xy")) {
      const planeOffset = scaledPlaneSize * 0.7;
      const offsetX = (xAxis[0] + yAxis[0]) * planeOffset;
      const offsetY = (xAxis[1] + yAxis[1]) * planeOffset;
      const offsetZ = (xAxis[2] + yAxis[2]) * planeOffset;

      // XY plane: the object's rotation matrix already represents XY plane orientation
      const xyPlaneAngles = this.extractEulerAnglesFromMatrix(rotationMatrix);

      this.scaleGizmoIds.xyPlane = this.gizmoManager.createGizmo(
        "plane3D",
        {
          x: centerX + offsetX,
          y: centerY + offsetY,
          z: centerZ + offsetZ,
          width: scaledPlaneSize,
          height: scaledPlaneSize,
          angleX: xyPlaneAngles[0],
          angleY: xyPlaneAngles[1],
          angleZ: xyPlaneAngles[2],
          filled: true,
          color: this.planeColors.xy,
        },
        ["transform", "scale", "xy-scale"],
        true,
        "GizmosAbove",
      );
    }

    if (supportedModes.scale.includes("xz")) {
      const planeOffset = scaledPlaneSize * 0.7;
      const offsetX = (xAxis[0] + zAxis[0]) * planeOffset;
      const offsetY = (xAxis[1] + zAxis[1]) * planeOffset;
      const offsetZ = (xAxis[2] + zAxis[2]) * planeOffset;

      // XZ plane: compose object rotation with -90° X rotation to go from XY to XZ plane
      const xzPlaneMatrix = this.createRotationMatrix([Math.PI / 2, 0, 0]);
      const combinedXZMatrix = this.multiplyMatrices(
        rotationMatrix,
        xzPlaneMatrix,
      );
      const xzPlaneAngles = this.extractEulerAnglesFromMatrix(combinedXZMatrix);

      this.scaleGizmoIds.xzPlane = this.gizmoManager.createGizmo(
        "plane3D",
        {
          x: centerX + offsetX,
          y: centerY + offsetY,
          z: centerZ + offsetZ,
          width: scaledPlaneSize,
          height: scaledPlaneSize,
          angleX: xzPlaneAngles[0],
          angleY: xzPlaneAngles[1],
          angleZ: xzPlaneAngles[2],
          filled: true,
          color: this.planeColors.xz,
        },
        ["transform", "scale", "xz-scale"],
        true,
        "GizmosAbove",
      );
    }

    if (supportedModes.scale.includes("yz")) {
      const planeOffset = scaledPlaneSize * 0.7;
      const offsetX = (yAxis[0] + zAxis[0]) * planeOffset;
      const offsetY = (yAxis[1] + zAxis[1]) * planeOffset;
      const offsetZ = (yAxis[2] + zAxis[2]) * planeOffset;

      // YZ plane: compose object rotation with 90° Y rotation to go from XY to YZ plane
      const yzPlaneMatrix = this.createRotationMatrix([0, Math.PI / 2, 0]);
      const combinedYZMatrix = this.multiplyMatrices(
        rotationMatrix,
        yzPlaneMatrix,
      );
      const yzPlaneAngles = this.extractEulerAnglesFromMatrix(combinedYZMatrix);

      this.scaleGizmoIds.yzPlane = this.gizmoManager.createGizmo(
        "plane3D",
        {
          x: centerX + offsetX,
          y: centerY + offsetY,
          z: centerZ + offsetZ,
          width: scaledPlaneSize,
          height: scaledPlaneSize,
          angleX: yzPlaneAngles[0],
          angleY: yzPlaneAngles[1],
          angleZ: yzPlaneAngles[2],
          filled: true,
          color: this.planeColors.yz,
        },
        ["transform", "scale", "yz-scale"],
        true,
        "GizmosAbove",
      );
    }

    // Uniform scale handle (center cube)
    if (supportedModes.scale.includes("uniform")) {
      this.scaleGizmoIds.uniformHandle = this.gizmoManager.createGizmo(
        "cornerScaleHandle",
        {
          x: centerX,
          y: centerY,
          z: centerZ,
          handleSize: this.handleSize * 1.5,
          color: this.uniformColor,
        },
        ["transform", "scale", "uniform-scale"],
        true,
        "GizmosAbove",
      );
    }

    this._enableScalingOnGizmos(this.scaleGizmoIds);
  }

  _enableScalingOnGizmos(idMap) {
    for (const [key, id] of Object.entries(idMap)) {
      if (id !== null && !key.endsWith("Plane")) {
        this.gizmoManager.enableGizmoScaling(id, 1.0, 1000);
      }
    }
  }

  // Hide all transform gizmos
  hideGizmos() {
    // Clear rotation gizmos
    Object.values(this.rotationGizmoIds).forEach((id) => {
      if (id !== null) {
        this.gizmoManager.deleteGizmo(id);
      }
    });
    this.rotationGizmoIds = {
      xRing: null,
      yRing: null,
      zRing: null,
      screenRing: null,
    };

    // Clear scale gizmos
    Object.values(this.scaleGizmoIds).forEach((id) => {
      if (id !== null) {
        this.gizmoManager.deleteGizmo(id);
      }
    });
    this.scaleGizmoIds = {
      xHandle: null,
      yHandle: null,
      zHandle: null,
      xyPlane: null,
      xzPlane: null,
      yzPlane: null,
      uniformHandle: null,
    };

    // Clear box scale gizmos
    this.boxScaleGizmoIds.edges.forEach((id) => {
      this.gizmoManager.deleteGizmo(id);
    });
    this.boxScaleGizmoIds.edgeHandles.forEach((id) => {
      this.gizmoManager.deleteGizmo(id);
    });
    this.boxScaleGizmoIds.corners.forEach((id) => {
      this.gizmoManager.deleteGizmo(id);
    });
    Object.values(this.boxScaleGizmoIds.faces).forEach((id) => {
      if (id !== null) this.gizmoManager.deleteGizmo(id);
    });
    this.boxScaleGizmoIds = {
      edges: [],
      edgeHandles: [],
      corners: [],
      faces: {},
    };
    this.boxScaleDragState = null;

    this.isActive = false;
    this.currentMode = null;
    this.currentAxis = null;
  }

  // Check if gizmo ID belongs to transform gizmos
  isTransformGizmo(gizmoId) {
    return (
      Object.values(this.rotationGizmoIds).includes(gizmoId) ||
      Object.values(this.scaleGizmoIds).includes(gizmoId) ||
      this.boxScaleGizmoIds.corners.includes(gizmoId) ||
      this.boxScaleGizmoIds.edgeHandles.includes(gizmoId) ||
      Object.values(this.boxScaleGizmoIds.faces).includes(gizmoId)
    );
  }

  // Get axis from transform gizmo ID
  getAxisFromTransformGizmoId(gizmoId) {
    // Check rotation gizmos
    for (const [axis, id] of Object.entries(this.rotationGizmoIds)) {
      if (id === gizmoId) {
        return axis.replace("Ring", ""); // xRing -> x
      }
    }

    // Check scale gizmos
    for (const [axis, id] of Object.entries(this.scaleGizmoIds)) {
      if (id === gizmoId) {
        return axis.replace("Handle", "").replace("Plane", ""); // xHandle -> x, xyPlane -> xy
      }
    }

    // Check box scale corner gizmos
    const cornerIdx = this.boxScaleGizmoIds.corners.indexOf(gizmoId);
    if (cornerIdx !== -1) {
      return `boxCorner_${cornerIdx}`;
    }

    // Check box scale edge gizmos (2-axis handles)
    const edgeIdx = this.boxScaleGizmoIds.edgeHandles.indexOf(gizmoId);
    if (edgeIdx !== -1) {
      return `boxEdge_${edgeIdx}`;
    }

    // Check box scale face gizmos
    for (const [key, id] of Object.entries(this.boxScaleGizmoIds.faces)) {
      if (id === gizmoId) {
        return `boxFace_${key}`;
      }
    }

    return null;
  }

  // Handle transform gizmo hover
  handleTransformGizmoHover(id, gizmo) {
    const axis = this.getAxisFromTransformGizmoId(id);
    if (axis) {
      this.highlightAxis(axis, true);
      this.currentAxis = axis;
    }
  }

  // Handle transform gizmo hover end
  handleTransformGizmoHoverEnd(id, gizmo) {
    const axis = this.getAxisFromTransformGizmoId(id);
    if (axis) {
      this.highlightAxis(axis, false);
      if (this.currentAxis === axis) {
        this.currentAxis = null;
      }
    }
  }

  // Handle transform gizmo click
  handleTransformGizmoClick(id, gizmo) {
    if (this.isDragging) return;

    const axis = this.getAxisFromTransformGizmoId(id);
    if (!axis) return;

    if (
      this.currentMode === "boxScale" &&
      (axis.startsWith("boxCorner_") ||
        axis.startsWith("boxFace_") ||
        axis.startsWith("boxEdge_"))
    ) {
      this.startBoxScaleDrag(axis);
    } else {
      this.startTransformDrag(axis);
    }
  }

  // Highlight axis
  highlightAxis(axis, highlight) {
    const color = highlight ? this.highlightColor : null;

    // Find and update the gizmo color
    const gizmoId = this.findGizmoIdForAxis(axis);
    if (gizmoId) {
      const gizmo = this.gizmoManager.gizmos.get(gizmoId);
      if (gizmo) {
        if (highlight) {
          gizmo.params.color = color;
        } else {
          // Restore original color
          gizmo.params.color = gizmo.originalColor || this.getAxisColor(axis);
        }
      }
    }
  }

  // Find gizmo ID for axis
  findGizmoIdForAxis(axis) {
    // Check rotation gizmos
    if (this.rotationGizmoIds[axis + "Ring"]) {
      return this.rotationGizmoIds[axis + "Ring"];
    }
    if (this.rotationGizmoIds[axis]) {
      return this.rotationGizmoIds[axis];
    }

    // Check scale gizmos
    if (this.scaleGizmoIds[axis + "Handle"]) {
      return this.scaleGizmoIds[axis + "Handle"];
    }
    if (this.scaleGizmoIds[axis + "Plane"]) {
      return this.scaleGizmoIds[axis + "Plane"];
    }
    if (this.scaleGizmoIds[axis]) {
      return this.scaleGizmoIds[axis];
    }

    // Check box scale gizmos
    if (axis.startsWith("boxCorner_")) {
      const idx = parseInt(axis.split("_")[1]);
      return this.boxScaleGizmoIds.corners[idx] || null;
    }
    if (axis.startsWith("boxEdge_")) {
      const idx = parseInt(axis.split("_")[1]);
      return this.boxScaleGizmoIds.edgeHandles[idx] || null;
    }
    if (axis.startsWith("boxFace_")) {
      const key = axis.split("_")[1];
      return this.boxScaleGizmoIds.faces[key] || null;
    }

    return null;
  }

  // Get axis color
  getAxisColor(axis) {
    switch (axis) {
      case "x":
        return this.xAxisColor;
      case "y":
        return this.yAxisColor;
      case "z":
        return this.zAxisColor;
      case "screen":
        return this.screenColor;
      case "uniform":
        return this.uniformColor;
      default:
        return this.uniformColor;
    }
  }

  // Start transform drag operation
  startTransformDrag(axis) {
    const selectedInstances = Array.from(this.selectionManager.getSelection());
    if (selectedInstances.length === 0) return;

    this.isDragging = true;
    this.currentDraggingAxis = axis;
    this.dragStartMousePos = {
      x: this.gizmoManager.mouseX,
      y: this.gizmoManager.mouseY,
    };

    // Calculate drag center using same logic as gizmo positioning
    if (selectedInstances.length === 1) {
      // For single object, use its actual position
      const instance = selectedInstances[0];
      this.dragCenter = [
        instance.x,
        instance.y,
        instance.originalZElevation !== undefined
          ? instance.originalZElevation
          : instance.totalZElevation || 0,
      ];
    } else {
      // For multiple objects, use bounds center
      const bounds = this.selectionManager.calculateSelectionBounds();
      this.dragCenter = bounds
        ? [bounds.centerX, bounds.centerY, bounds.centerZ]
        : [0, 0, 0];
    }

    // Store initial values for all selected instances
    this.dragStartValues.clear();
    selectedInstances.forEach((instance) => {
      const instanceType = this.getInstanceType(instance);
      const initialValues = this.getInstanceTransformValues(
        instance,
        instanceType,
      );
      this.dragStartValues.set(instance, initialValues);
    });
  }

  // Get instance transform values
  getInstanceTransformValues(instance, instanceType) {
    const values = {
      position: [
        instance.x,
        instance.y,
        instance.originalZElevation !== undefined
          ? instance.originalZElevation
          : instance.totalZElevation || 0,
      ],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      // Store original dimensions for scaling
      originalWidth: instance.width,
      originalHeight: instance.height,
      originalZHeight: Number.isFinite(instance.zHeight)
        ? instance.zHeight
        : 30,
    };

    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    switch (instanceType) {
      case "object2d":
        // For 2D objects, store current scale as [1,1,1] and dimensions
        values.scale = [1, 1, 1];
        values.rotation = [0, 0, instance.angle || instance.zAngle || 0];
        break;
      case "shape3d":
        // For 3D shapes, store current scale as [1,1,1] and dimensions
        values.scale = [1, 1, 1];
        values.rotation = [0, 0, instance.angle || 0];
        break;
      case "meshRotation":
        // For objects with MeshRotate behavior
        values.scale = [1, 1, 1];

        values.rotation = [
          toRadians(instance.meshAngleX || 0),
          toRadians(instance.meshAngleY || 0),
          toRadians(instance.meshAngleZ || 0),
        ];
        break;
      case "meshRotation2":
        values.scale = [1, 1, 1];
        let rotation = instance.getRotation3D();
        values.rotation = [
          toRadians(rotation.x || 0),
          toRadians(rotation.y || 0),
          toRadians(rotation.z || 0),
        ];
        break;
      case "object3d":
        // 3D objects use different scaling system
        values.scale = [instance.xScale, instance.yScale, instance.zScale];
        values.rotation = [
          toRadians(instance.xAngle) || 0,
          toRadians(instance.yAngle) || 0,
          toRadians(instance.zAngle) || 0,
        ];
        break;
      case "mesh2d":
        // For mesh objects, store current scale as [1,1,1] and dimensions
        values.scale = [1, 1, 1];
        values.rotation = [0, 0, instance.angle || 0];
        break;
    }

    return values;
  }

  // Update transform drag
  updateTransformDrag(mouseX, mouseY, camera = null) {
    if (!this.isDragging || !this.currentDraggingAxis) return;

    const deltaX = mouseX - this.dragStartMousePos.x;
    const deltaY = mouseY - this.dragStartMousePos.y;

    // Calculate transform delta based on mode and axis
    let transformDelta;
    if (this.currentMode === "rotation") {
      transformDelta = this.calculateRotationDelta(
        deltaX,
        deltaY,
        this.currentDraggingAxis,
        camera,
      );
    } else if (this.currentMode === "scale") {
      transformDelta = this.calculateScaleDelta(
        deltaX,
        deltaY,
        this.currentDraggingAxis,
        camera,
      );
    } else if (this.currentMode === "boxScale") {
      this.updateBoxScaleDrag(mouseX, mouseY, camera);
      return;
    }

    if (!transformDelta) return;

    // Apply transform to all selected instances
    const selectedInstances = Array.from(this.selectionManager.getSelection());
    if (this.currentMode === "rotation" && selectedInstances.length > 1) {
      // Group rotation: rotate positions around center
      const centerX = this.dragCenter[0];
      const centerY = this.dragCenter[1];
      // Only Z axis for now
      const angle = transformDelta.rotation[2]; // radians
      const cos = Math.cos(angle),
        sin = Math.sin(angle);
      selectedInstances.forEach((instance) => {
        const instanceType = this.getInstanceType(instance);
        const initialValues = this.dragStartValues.get(instance);
        if (initialValues) {
          // Offset from center
          const dx = initialValues.position[0] - centerX;
          const dy = initialValues.position[1] - centerY;
          // Rotate offset
          const rx = dx * cos - dy * sin;
          const ry = dx * sin + dy * cos;
          // New position
          instance.x = centerX + rx;
          instance.y = centerY + ry;
          // Now apply rotation delta as usual
          this.applyTransformToInstance(
            instance,
            instanceType,
            initialValues,
            transformDelta,
          );
        }
      });
    } else if (this.currentMode === "scale" && selectedInstances.length > 1) {
      // Group scaling: scale around center and adjust positions
      this.applyGroupScaling(selectedInstances, transformDelta);
    } else {
      // Single or non-group mode
      selectedInstances.forEach((instance) => {
        const instanceType = this.getInstanceType(instance);
        const initialValues = this.dragStartValues.get(instance);
        if (initialValues) {
          this.applyTransformToInstance(
            instance,
            instanceType,
            initialValues,
            transformDelta,
          );
        }
      });
    }

    // If rotating, update the gizmo orientations in real-time to show gimbal lock behavior
    if (this.currentMode === "rotation") {
      this.updateRotationGizmosRealTime(camera);
    }

    // Update selection visualizations (bounding box and triangle outlines)
    this.selectionManager.updateSelectionVisualizations();

    // Refresh inspector to show updated values in real-time
    refreshInspector();
  }

  // Update rotation gizmo orientations in real-time during rotation
  updateRotationGizmosRealTime(camera = null) {
    const selectedInstances = Array.from(this.selectionManager.getSelection());
    if (selectedInstances.length !== 1) return; // Only update for single selection

    const instance = selectedInstances[0];
    const instanceType = this.getInstanceType(instance);
    const currentTransformValues = this.getInstanceTransformValues(
      instance,
      instanceType,
    );
    const currentRotation = currentTransformValues.rotation;

    // Calculate gizmo position
    const centerX = instance.x;
    const centerY = instance.y;
    const centerZ =
      instance.originalZElevation !== undefined
        ? instance.originalZElevation
        : instance.totalZElevation || 0;

    // Update each gizmo ring with new orientation based on current rotation
    // Each ring shows the accumulated rotation up to that point in the rotation order
    if (this.rotationGizmoIds.xRing) {
      // X gizmo orientation depends on rotation order
      const xGizmoMatrix = this.createGizmoRotationMatrix(
        currentRotation,
        "x",
        instanceType,
      );
      const xNormal = this.transformVectorByMatrix([1, 0, 0], xGizmoMatrix);

      // Update the gizmo parameters and regenerate interaction triangles
      this.gizmoManager.updateGizmo(this.rotationGizmoIds.xRing, {
        normal: xNormal,
        x: centerX,
        y: centerY,
        z: centerZ,
      });
    }

    if (this.rotationGizmoIds.yRing) {
      // Y gizmo orientation depends on rotation order
      const yGizmoMatrix = this.createGizmoRotationMatrix(
        currentRotation,
        "y",
        instanceType,
      );
      const yNormal = this.transformVectorByMatrix([0, 1, 0], yGizmoMatrix);

      // Update the gizmo parameters and regenerate interaction triangles
      this.gizmoManager.updateGizmo(this.rotationGizmoIds.yRing, {
        normal: yNormal,
        x: centerX,
        y: centerY,
        z: centerZ,
      });
    }

    if (this.rotationGizmoIds.zRing) {
      // Z gizmo orientation depends on rotation order
      const zGizmoMatrix = this.createGizmoRotationMatrix(
        currentRotation,
        "z",
        instanceType,
      );
      const zNormal = this.transformVectorByMatrix([0, 0, 1], zGizmoMatrix);

      // Update the gizmo parameters and regenerate interaction triangles
      this.gizmoManager.updateGizmo(this.rotationGizmoIds.zRing, {
        normal: zNormal,
        x: centerX,
        y: centerY,
        z: centerZ,
      });
    }
  }

  // Calculate rotation delta using plane projection
  calculateRotationDelta(deltaX, deltaY, axis, camera) {
    if (!camera) return null;

    // Get current and start mouse positions
    const currentMouseX = this.dragStartMousePos.x + deltaX;
    const currentMouseY = this.dragStartMousePos.y + deltaY;
    const startMouseX = this.dragStartMousePos.x;
    const startMouseY = this.dragStartMousePos.y;

    // Get current rotation state of the selected instance for proper plane calculation
    const selectedInstances = Array.from(this.selectionManager.getSelection());
    let currentRotation = [0, 0, 0];

    if (selectedInstances.length === 1) {
      const instance = selectedInstances[0];
      const instanceType = this.getInstanceType(instance);
      const transformValues = this.getInstanceTransformValues(
        instance,
        instanceType,
      );
      currentRotation = transformValues.rotation;
    }

    // Get rotation plane normal based on axis and current rotation state (for gimbal lock behavior)
    // Each axis uses the correct gimbal matrix based on the rotation order (ZYX for most, XYZ for meshRotation)
    let planeNormal;

    // Determine rotation order based on instance type
    const isMeshRotation =
      selectedInstances.length === 1 &&
      this.getInstanceType(selectedInstances[0]) === "meshRotation";

    if (isMeshRotation) {
      // XYZ rotation order for meshRotation objects
      switch (axis) {
        case "x":
          // X rotation plane is always world-aligned in XYZ order (first rotation)
          planeNormal = [1, 0, 0];
          break;
        case "y":
          // Y rotation plane is transformed by current X rotation only
          const xMatrix = this.createGizmoRotationMatrix(
            currentRotation,
            "y",
            "meshRotation",
          );
          planeNormal = this.transformVectorByMatrix([0, 1, 0], xMatrix);
          break;
        case "z":
          // Z rotation plane is transformed by current X and Y rotations
          const xyMatrix = this.createGizmoRotationMatrix(
            currentRotation,
            "z",
            "meshRotation",
          );
          planeNormal = this.transformVectorByMatrix([0, 0, 1], xyMatrix);
          break;
        case "screen":
          // Use camera look vector as normal
          planeNormal = camera.getLookVector();
          break;
        default:
          return null;
      }
    } else {
      // ZYX rotation order for all other object types
      switch (axis) {
        case "z":
          // Z rotation plane is always world-aligned in ZYX order (first rotation)
          planeNormal = [0, 0, 1];
          break;
        case "y":
          // Y rotation plane is transformed by current Z rotation only
          const zMatrix = this.createGizmoRotationMatrix(currentRotation, "y");
          planeNormal = this.transformVectorByMatrix([0, 1, 0], zMatrix);
          break;
        case "x":
          // X rotation plane is transformed by current Z and Y rotations
          const zyMatrix = this.createGizmoRotationMatrix(currentRotation, "x");
          planeNormal = this.transformVectorByMatrix([1, 0, 0], zyMatrix);
          break;
        case "screen":
          // Use camera look vector as normal
          planeNormal = camera.getLookVector();
          break;
        default:
          return null;
      }
    }

    // Project mouse rays to rotation plane
    const startRay = globalThis._editorScope.getScreenRay(
      startMouseX,
      startMouseY,
    );
    const currentRay = globalThis._editorScope.getScreenRay(
      currentMouseX,
      currentMouseY,
    );

    if (!startRay || !currentRay) return null;

    // Intersect rays with plane at gizmo center
    const startPoint = this.intersectRayWithPlane(
      startRay,
      this.dragCenter,
      planeNormal,
    );
    const currentPoint = this.intersectRayWithPlane(
      currentRay,
      this.dragCenter,
      planeNormal,
    );

    if (!startPoint || !currentPoint) return null;

    // Calculate vectors from center to points
    const startVector = [
      startPoint[0] - this.dragCenter[0],
      startPoint[1] - this.dragCenter[1],
      startPoint[2] - this.dragCenter[2],
    ];
    const currentVector = [
      currentPoint[0] - this.dragCenter[0],
      currentPoint[1] - this.dragCenter[1],
      currentPoint[2] - this.dragCenter[2],
    ];

    // Calculate angle between vectors
    const angle = this.calculateAngleBetweenVectors(
      startVector,
      currentVector,
      planeNormal,
    );

    // Apply grid snapping to rotation if enabled
    const gridSystem = globalThis._editorScope?.gridSystem;
    let snappedAngle = angle;

    if (gridSystem) {
      const angleSnap = gridSystem.getAngleSnap();
      const toDegrees = (rad) => rad * (180 / Math.PI);
      const toRadians = (deg) => deg * (Math.PI / 180);

      const angleDegrees = toDegrees(angle);
      const snappedDegrees = gridSystem.snapRotation(angleDegrees, angleSnap);
      snappedAngle = toRadians(snappedDegrees);
    }

    switch (axis) {
      case "x":
        return { rotation: [snappedAngle, 0, 0] };
      case "y":
        return { rotation: [0, snappedAngle, 0] };
      case "z":
        return { rotation: [0, 0, snappedAngle] };
      case "screen":
        // For screen-space, apply to camera's look vector axis
        const forward = camera.getLookVector();
        return {
          rotation: [
            forward[0] * snappedAngle,
            forward[1] * snappedAngle,
            forward[2] * snappedAngle,
          ],
        };
      default:
        return null;
    }
  }

  // Calculate scale delta using plane projection
  calculateScaleDelta(deltaX, deltaY, axis, camera) {
    // Check if shift is pressed for uniform scaling

    if (!camera) {
      // Fallback to simple mouse delta
      const sensitivity = 0.01;
      const scaleDelta = deltaX * sensitivity;
      const scaleMultiplier = 1 + scaleDelta;

      switch (axis) {
        case "x":
          return { scale: [scaleMultiplier, 1, 1] };
        case "y":
          return { scale: [1, scaleMultiplier, 1] };
        case "z":
          return { scale: [1, 1, scaleMultiplier] };
        case "xy":
          return { scale: [scaleMultiplier, scaleMultiplier, 1] };
        case "xz":
          return { scale: [scaleMultiplier, 1, scaleMultiplier] };
        case "yz":
          return { scale: [1, scaleMultiplier, scaleMultiplier] };
        case "uniform":
          return { scale: [scaleMultiplier, scaleMultiplier, scaleMultiplier] };
        default:
          return null;
      }
    }

    // Get current and start mouse positions
    const currentMouseX = this.dragStartMousePos.x + deltaX;
    const currentMouseY = this.dragStartMousePos.y + deltaY;
    const startMouseX = this.dragStartMousePos.x;
    const startMouseY = this.dragStartMousePos.y;

    // Project mouse rays to determine scale factor
    const startRay = globalThis._editorScope.getScreenRay(
      startMouseX,
      startMouseY,
    );
    const currentRay = globalThis._editorScope.getScreenRay(
      currentMouseX,
      currentMouseY,
    );

    if (!startRay || !currentRay) {
      // Fallback to simple delta
      const sensitivity = 0.01;
      const scaleDelta = deltaX * sensitivity;
      const scaleMultiplier = 1 + scaleDelta;

      return this.getScaleMultiplierForAxis(
        axis,
        scaleMultiplier,
        deltaX,
        deltaY,
      );
    }

    // For scaling, we'll project to a plane perpendicular to the camera
    const cameraLookVector = camera.getLookVector();

    // Intersect rays with camera-facing plane at gizmo center
    const startPoint = this.intersectRayWithPlane(
      startRay,
      this.dragCenter,
      cameraLookVector,
    );
    const currentPoint = this.intersectRayWithPlane(
      currentRay,
      this.dragCenter,
      cameraLookVector,
    );

    if (!startPoint || !currentPoint) {
      // Fallback to simple delta
      const sensitivity = 0.01;
      const scaleDelta = deltaX * sensitivity;
      const scaleMultiplier = 1 + scaleDelta;

      return this.getScaleMultiplierForAxis(
        axis,
        scaleMultiplier,
        deltaX,
        deltaY,
      );
    }

    // Calculate distance from center for each point
    const startDistance = this.calculateDistance(startPoint, this.dragCenter);
    const currentDistance = this.calculateDistance(
      currentPoint,
      this.dragCenter,
    );

    // Calculate scale multiplier based on distance ratio
    const scaleMultiplier =
      startDistance > 0 ? currentDistance / startDistance : 1;

    return this.getScaleMultiplierForAxis(
      axis,
      scaleMultiplier,
      deltaX,
      deltaY,
    );
  }

  // Apply group scaling with position adjustments for multi-selection
  applyGroupScaling(selectedInstances, transformDelta) {
    const centerX = this.dragCenter[0];
    const centerY = this.dragCenter[1];
    const centerZ = this.dragCenter[2];

    selectedInstances.forEach((instance) => {
      const instanceType = this.getInstanceType(instance);
      const initialValues = this.dragStartValues.get(instance);
      if (!initialValues) return;

      // Calculate offset from center
      const offsetX = initialValues.position[0] - centerX;
      const offsetY = initialValues.position[1] - centerY;
      const offsetZ = initialValues.position[2] - centerZ;

      // Get instance rotation for rotation-aware scaling
      const rotation = initialValues.rotation;

      // Calculate rotation-aware scaling factors
      const rotationAwareScale = this.calculateRotationAwareScaling(
        transformDelta.scale,
        rotation,
        this.currentDraggingAxis,
      );

      // Apply scaling to position offset
      let scaledOffsetX, scaledOffsetY, scaledOffsetZ;

      // For non-rotated instances, apply scaling directly
      scaledOffsetX = offsetX * transformDelta.scale[0];
      scaledOffsetY = offsetY * transformDelta.scale[1];
      scaledOffsetZ = offsetZ * transformDelta.scale[2];

      // Update instance position
      instance.x = centerX + scaledOffsetX;
      instance.y = centerY + scaledOffsetY;

      if (instance.originalZElevation !== undefined) {
        instance.originalZElevation = centerZ + scaledOffsetZ;
      } else if (instance.zElevation !== undefined) {
        instance.zElevation = centerZ + scaledOffsetZ;
      }

      // Apply scaling to the instance itself using rotation-aware scaling
      const rotationAwareTransformDelta = {
        ...transformDelta,
        scale: rotationAwareScale,
      };

      this.applyTransformToInstance(
        instance,
        instanceType,
        initialValues,
        rotationAwareTransformDelta,
      );
    });
  }

  // Calculate rotation-aware scaling that distributes scaling across axes based on rotation
  calculateRotationAwareScaling(baseScale, rotation, dragAxis) {
    const [scaleX, scaleY, scaleZ] = baseScale;
    const [rotX, rotY, rotZ] = rotation;

    // If no significant rotation, use base scaling
    if (!this.hasSignificantRotation(rotation)) {
      return baseScale;
    }

    // For uniform scaling, always use the same scale on all axes
    if (dragAxis === "uniform") {
      return baseScale;
    }

    // Calculate the rotation matrix to understand how the local axes align with world axes
    const rotationMatrix = this.createRotationMatrix(rotation);

    // Get the world direction that the local axis is pointing to
    let localAxisVector;
    switch (dragAxis) {
      case "x":
        localAxisVector = [1, 0, 0];
        break;
      case "y":
        localAxisVector = [0, 1, 0];
        break;
      case "z":
        localAxisVector = [0, 0, 1];
        break;
      case "xy":
        // For plane scaling, we'll handle this differently
        return this.calculatePlaneRotationAwareScaling(baseScale, rotation, [
          "x",
          "y",
        ]);
      case "xz":
        return this.calculatePlaneRotationAwareScaling(baseScale, rotation, [
          "x",
          "z",
        ]);
      case "yz":
        return this.calculatePlaneRotationAwareScaling(baseScale, rotation, [
          "y",
          "z",
        ]);
      default:
        return baseScale;
    }

    // Transform the local axis to world space to see how it's oriented
    const worldAxisDirection = this.transformVectorByMatrix(
      localAxisVector,
      rotationMatrix,
    );

    // Calculate how much each world axis contributes to the rotated local axis
    const xContribution = Math.abs(worldAxisDirection[0]);
    const yContribution = Math.abs(worldAxisDirection[1]);
    const zContribution = Math.abs(worldAxisDirection[2]);

    // The scaling factor to apply
    const scaleFactor =
      dragAxis === "x" ? scaleX : dragAxis === "y" ? scaleY : scaleZ;

    // Distribute the scaling based on the axis contributions
    // Start with no scaling (1.0) and add the scaling effect proportionally
    const scaleEffect = scaleFactor - 1.0; // How much we're scaling beyond 1.0

    const distributedScaleX = 1.0 + scaleEffect * xContribution;
    const distributedScaleY = 1.0 + scaleEffect * yContribution;
    const distributedScaleZ = 1.0 + scaleEffect * zContribution;

    return [distributedScaleX, distributedScaleY, distributedScaleZ];
  }

  // Calculate rotation-aware scaling for plane handles (xy, xz, yz)
  calculatePlaneRotationAwareScaling(baseScale, rotation, planeAxes) {
    const [scaleX, scaleY, scaleZ] = baseScale;

    // For plane scaling, calculate rotation-aware scaling for each axis separately
    // and then combine them
    let resultScale = [1.0, 1.0, 1.0];

    planeAxes.forEach((axis) => {
      // Get the scale factor for this axis
      let axisScaleFactor;
      switch (axis) {
        case "x":
          axisScaleFactor = scaleX;
          break;
        case "y":
          axisScaleFactor = scaleY;
          break;
        case "z":
          axisScaleFactor = scaleZ;
          break;
        default:
          axisScaleFactor = 1.0;
      }

      // Calculate rotation-aware scaling for this individual axis
      const individualAxisScale = this.calculateRotationAwareScaling(
        axis === "x"
          ? [axisScaleFactor, 1.0, 1.0]
          : axis === "y"
            ? [1.0, axisScaleFactor, 1.0]
            : [1.0, 1.0, axisScaleFactor],
        rotation,
        axis,
      );

      // Combine the scaling effects (multiply the scaling factors)
      resultScale[0] *= individualAxisScale[0];
      resultScale[1] *= individualAxisScale[1];
      resultScale[2] *= individualAxisScale[2];
    });

    return resultScale;
  }

  // Check if an instance has significant rotation (> 0.1 degrees)
  hasSignificantRotation(rotation) {
    const threshold = (0.1 * Math.PI) / 180; // 0.1 degrees in radians
    return (
      Math.abs(rotation[0]) > threshold ||
      Math.abs(rotation[1]) > threshold ||
      Math.abs(rotation[2]) > threshold
    );
  }

  // Convert world coordinates to local coordinates based on rotation
  worldToLocalCoordinates(worldCoords, rotation) {
    const [wx, wy, wz] = worldCoords;
    const [rx, ry, rz] = rotation;

    // Create inverse rotation matrix (transpose of rotation matrix)
    const rotationMatrix = this.createRotationMatrix(rotation);
    const inverseMatrix = this.transposeMatrix(rotationMatrix);

    return this.transformVectorByMatrix([wx, wy, wz], inverseMatrix);
  }

  // Convert local coordinates to world coordinates based on rotation
  localToWorldCoordinates(localCoords, rotation) {
    const rotationMatrix = this.createRotationMatrix(rotation);
    return this.transformVectorByMatrix(localCoords, rotationMatrix);
  }

  // Helper method to check if shift key is pressed
  isShiftKeyPressed() {
    if (!globalThis._editorScope?.runtime?.keyboard) {
      return false;
    }

    return (
      globalThis._editorScope.runtime.keyboard.isKeyDown("ShiftLeft") ||
      globalThis._editorScope.runtime.keyboard.isKeyDown("ShiftRight") ||
      globalThis._editorScope.runtime.keyboard.isKeyDown("Shift")
    );
  }

  // Helper method to get scale multiplier for specific axis
  getScaleMultiplierForAxis(axis, scaleMultiplier, deltaX = 0, deltaY = 0) {
    // Check if shift is pressed for uniform scaling on planes
    const isShiftPressed = this.isShiftKeyPressed();

    switch (axis) {
      case "x":
        return { scale: [scaleMultiplier, 1, 1] };
      case "y":
        return { scale: [1, scaleMultiplier, 1] };
      case "z":
        return { scale: [1, 1, scaleMultiplier] };
      case "xy":
        return this.calculatePlaneScaling(
          scaleMultiplier,
          deltaX,
          deltaY,
          ["x", "y"],
          isShiftPressed,
        );
      case "xz":
        return this.calculatePlaneScaling(
          scaleMultiplier,
          deltaX,
          deltaY,
          ["x", "z"],
          isShiftPressed,
        );
      case "yz":
        return this.calculatePlaneScaling(
          scaleMultiplier,
          deltaX,
          deltaY,
          ["y", "z"],
          isShiftPressed,
        );
      case "uniform":
        return { scale: [scaleMultiplier, scaleMultiplier, scaleMultiplier] };
      default:
        return null;
    }
  }

  // Calculate directional scaling for plane handles based on mouse movement
  calculatePlaneScaling(
    baseScaleMultiplier,
    deltaX,
    deltaY,
    planeAxes,
    isShiftPressed,
  ) {
    // If shift is pressed, scale uniformly on both plane axes
    if (isShiftPressed) {
      const result = { scale: [1, 1, 1] };
      planeAxes.forEach((axis) => {
        if (axis === "x") result.scale[0] = baseScaleMultiplier;
        if (axis === "y") result.scale[1] = baseScaleMultiplier;
        if (axis === "z") result.scale[2] = baseScaleMultiplier;
      });
      return result;
    }

    // Calculate the total mouse movement
    const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // If no movement, return no scaling
    if (totalMovement < 0.1) {
      return { scale: [1, 1, 1] };
    }

    // Calculate horizontal and vertical movement ratios
    const horizontalRatio = Math.abs(deltaX) / totalMovement;
    const verticalRatio = Math.abs(deltaY) / totalMovement;

    // Determine which axes correspond to horizontal and vertical movement
    // This is a simplified mapping - could be enhanced based on camera orientation
    let horizontalAxis, verticalAxis;

    if (planeAxes.includes("x") && planeAxes.includes("y")) {
      // XY plane: X is horizontal, Y is vertical
      horizontalAxis = "x";
      verticalAxis = "y";
    } else if (planeAxes.includes("x") && planeAxes.includes("z")) {
      // XZ plane: X is horizontal, Z is vertical
      horizontalAxis = "x";
      verticalAxis = "z";
    } else if (planeAxes.includes("y") && planeAxes.includes("z")) {
      // YZ plane: Y is horizontal, Z is vertical
      horizontalAxis = "y";
      verticalAxis = "z";
    }

    // Calculate scale factors based on movement direction
    const scaleEffect = baseScaleMultiplier - 1.0; // How much we're scaling beyond 1.0

    const horizontalScale = 1.0 + scaleEffect * horizontalRatio;
    const verticalScale = 1.0 + scaleEffect * verticalRatio;

    // Build the result scale array
    const result = { scale: [1, 1, 1] };

    if (horizontalAxis === "x") result.scale[0] = horizontalScale;
    else if (horizontalAxis === "y") result.scale[1] = horizontalScale;
    else if (horizontalAxis === "z") result.scale[2] = horizontalScale;

    if (verticalAxis === "x") result.scale[0] = verticalScale;
    else if (verticalAxis === "y") result.scale[1] = verticalScale;
    else if (verticalAxis === "z") result.scale[2] = verticalScale;

    return result;
  }

  // Apply transform to instance
  applyTransformToInstance(
    instance,
    instanceType,
    initialValues,
    transformDelta,
  ) {
    switch (instanceType) {
      case "object2d":
        this.applyTransformTo2DObject(instance, initialValues, transformDelta);
        break;
      case "shape3d":
        this.applyTransformTo3DShape(instance, initialValues, transformDelta);
        break;
      case "meshRotation":
        this.applyTransformToMeshRotation(
          instance,
          initialValues,
          transformDelta,
        );
        break;
      case "meshRotation2":
        this.applyTransformToMeshRotation2(
          instance,
          initialValues,
          transformDelta,
        );
        break;
      case "object3d":
        this.applyTransformTo3DObject(instance, initialValues, transformDelta);
        break;
      case "mesh2d":
        this.applyTransformTo2DMesh(instance, initialValues, transformDelta);
        break;
    }
  }

  // Apply transform to 2D object
  applyTransformTo2DObject(instance, initialValues, transformDelta) {
    if (transformDelta.rotation) {
      // Only Z-axis rotation supported
      instance.angle = initialValues.rotation[2] + transformDelta.rotation[2];
    }

    if (transformDelta.scale) {
      // Only X and Y scaling supported
      // Apply scale delta to original dimensions
      instance.width = initialValues.originalWidth * transformDelta.scale[0];
      instance.height = initialValues.originalHeight * transformDelta.scale[1];
    }
  }

  // Apply transform to 3D shape
  applyTransformTo3DShape(instance, initialValues, transformDelta) {
    if (transformDelta.rotation) {
      // Only Z-axis rotation supported
      instance.angle = initialValues.rotation[2] + transformDelta.rotation[2];
    }

    if (transformDelta.scale) {
      // All axis scaling supported
      // Apply scale delta to original dimensions
      instance.width = initialValues.originalWidth * transformDelta.scale[0];
      instance.height = initialValues.originalHeight * transformDelta.scale[1];
      instance.zHeight =
        initialValues.originalZHeight * transformDelta.scale[2];
    }
  }

  // Apply transform to mesh rotation object
  applyTransformToMeshRotation(instance, initialValues, transformDelta) {
    const toDegrees = (rad) => rad * (180 / Math.PI);

    if (transformDelta.rotation) {
      // All axis rotation supported via MeshRotate behavior
      const newRotationX = toDegrees(
        initialValues.rotation[0] + transformDelta.rotation[0],
      );
      const newRotationY = toDegrees(
        initialValues.rotation[1] + transformDelta.rotation[1],
      );
      const newRotationZ = toDegrees(
        initialValues.rotation[2] + transformDelta.rotation[2],
      );

      // Normalize angles to 0-360 range
      instance.meshAngleX = ((newRotationX % 360) + 360) % 360;
      instance.meshAngleY = ((newRotationY % 360) + 360) % 360;
      instance.meshAngleZ = ((newRotationZ % 360) + 360) % 360;
    }

    if (transformDelta.scale) {
      // Only X and Y scaling supported for mesh rotation objects
      // Apply scale delta to original dimensions
      instance.width = initialValues.originalWidth * transformDelta.scale[0];
      instance.height = initialValues.originalHeight * transformDelta.scale[1];
    }

    // Apply the rotation using the MeshRotate behavior
    if (instance.behaviors && instance.behaviors.MeshRotate) {
      instance.behaviors.MeshRotate.SetRotation(
        -instance.meshAngleX || 0,
        -instance.meshAngleY || 0,
        -instance.meshAngleZ || 0,
      );
    }

    // Refresh the inspector to show updated values
    refreshInspector();
  }

  applyTransformToMeshRotation2(instance, initialValues, transformDelta) {
    const toDegrees = (rad) => rad * (180 / Math.PI);

    if (transformDelta.scale) {
      // Only X and Y scaling supported for mesh rotation objects
      // Apply scale delta to original dimensions
      instance.width = initialValues.originalWidth * transformDelta.scale[0];
      instance.height = initialValues.originalHeight * transformDelta.scale[1];
    }
    if (transformDelta.rotation) {
      instance.setRotation3D(
        toDegrees(initialValues.rotation[0] + transformDelta.rotation[0]),
        toDegrees(initialValues.rotation[1] + transformDelta.rotation[1]),
        toDegrees(initialValues.rotation[2] + transformDelta.rotation[2]),
      );
    }

    // Refresh the inspector to show updated values
    refreshInspector();
  }

  // Apply transform to 3D object
  applyTransformTo3DObject(instance, initialValues, transformDelta) {
    const sdkInst = globalThis._editorScope.sdk_runtime.GetInstanceByUID(
      instance.uid,
    )._sdkInst;
    if (!sdkInst) return;

    const toDegrees = (rad) => rad * (180 / Math.PI);

    if (transformDelta.rotation) {
      // All axis rotation supported, but affects scaling axes
      if (sdkInst.xAngle !== undefined) {
        sdkInst.xAngle = toDegrees(
          initialValues.rotation[0] + transformDelta.rotation[0],
        );
        sdkInst.yAngle = toDegrees(
          initialValues.rotation[1] + transformDelta.rotation[1],
        );
        sdkInst.zAngle = toDegrees(
          initialValues.rotation[2] + transformDelta.rotation[2],
        );
      }
    }

    if (transformDelta.scale) {
      // All axis scaling supported, aligned with rotation
      if (sdkInst.xScale !== undefined) {
        sdkInst.xScale = initialValues.scale[0] / transformDelta.scale[0];
        sdkInst.yScale = initialValues.scale[1] / transformDelta.scale[1];
        sdkInst.zScale = initialValues.scale[2] / transformDelta.scale[2];
      }
    }
  }

  // Apply transform to 2D mesh
  applyTransformTo2DMesh(instance, initialValues, transformDelta) {
    // For 2D mesh, we'd need to manipulate individual mesh points
    // This is more complex and would require storing and modifying mesh data
    // For now, fall back to 2D object behavior
    this.applyTransformTo2DObject(instance, initialValues, transformDelta);

    // TODO: Implement proper mesh point manipulation for full 3D rotation/scale
  }

  // End transform drag
  endTransformDrag() {
    // Record undo state at the end of transform operation
    if (this.isDragging && globalThis._editorScope?.stateManager) {
      const operationName =
        this.currentMode === "rotation"
          ? "Rotate Objects"
          : this.currentMode === "scale"
            ? "Scale Objects"
            : this.currentMode === "boxScale"
              ? "Box Scale Objects"
              : "Transform Objects";
      globalThis._editorScope.stateManager.pushUndoState(operationName);
    }

    this.isDragging = false;
    this.currentDraggingAxis = null;
    this.dragStartMousePos = null;
    this.dragStartValues.clear();
    this.dragCenter = null;

    // Refresh gizmos to final positions
    if (this.currentMode === "rotation") {
      const selectedInstances = Array.from(
        this.selectionManager.getSelection(),
      );
      if (selectedInstances.length > 0) {
        this.showRotationGizmo();
      }
    } else if (this.currentMode === "boxScale") {
      this.boxScaleDragState = null;
      this.showBoxScaleGizmo();
    }

    // Final update of visualizations when drag ends
    this.selectionManager.updateSelectionVisualizations();

    // Final inspector refresh
    refreshInspector();
  }

  // Handle mouse move for dragging
  handleMouseMove(mouseX, mouseY, camera = null) {
    if (this.isDragging) {
      this.updateTransformDrag(mouseX, mouseY, camera);
    }
  }

  // Handle mouse up for ending drag
  handleMouseUp() {
    if (this.isDragging) {
      this.endTransformDrag();
    }
  }

  // Update transform gizmos when selection changes
  updateForSelection(camera = null) {
    if (!this.isActive) return;

    // Refresh gizmos to reflect current rotation state (important for rotation gizmos)
    if (this.currentMode === "rotation") {
      this.showRotationGizmo(camera);
    } else if (this.currentMode === "scale") {
      this.showScaleGizmo(camera);
    } else if (this.currentMode === "boxScale") {
      this.showBoxScaleGizmo(camera);
    }
  }

  // Update camera-facing elements when camera moves
  updateCameraFacing(camera) {
    if (!this.isActive) return;

    // Only update scale/boxScale gizmos as they need camera-facing directions
    if (this.currentMode === "scale") {
      this.showScaleGizmo(camera);
    } else if (this.currentMode === "boxScale") {
      this.showBoxScaleGizmo(camera);
    }
  }

  // Toggle between rotation and scale modes
  toggleMode(camera = null) {
    if (this.currentMode === "rotation") {
      this.showScaleGizmo(camera);
    } else {
      this.showRotationGizmo(camera);
    }
  }

  // Set specific mode
  setMode(mode, camera = null) {
    if (mode === "rotation") {
      this.showRotationGizmo(camera);
    } else if (mode === "scale") {
      this.showScaleGizmo(camera);
    } else if (mode === "boxScale") {
      this.showBoxScaleGizmo(camera);
    } else {
      this.hideGizmos();
    }
  }

  // Helper methods for plane projection and calculations

  // Intersect ray with plane
  intersectRayWithPlane(ray, planePoint, planeNormal) {
    const rayOrigin = ray.origin;
    const rayDirection = ray.direction;

    // Calculate dot product of ray direction and plane normal
    const denominator =
      rayDirection[0] * planeNormal[0] +
      rayDirection[1] * planeNormal[1] +
      rayDirection[2] * planeNormal[2];

    // Check if ray is parallel to plane
    if (Math.abs(denominator) < 0.0001) {
      return null; // Ray is parallel to plane
    }

    // Calculate vector from ray origin to plane point
    const originToPlane = [
      planePoint[0] - rayOrigin[0],
      planePoint[1] - rayOrigin[1],
      planePoint[2] - rayOrigin[2],
    ];

    // Calculate dot product
    const numerator =
      originToPlane[0] * planeNormal[0] +
      originToPlane[1] * planeNormal[1] +
      originToPlane[2] * planeNormal[2];

    // Calculate parameter t for intersection point
    const t = numerator / denominator;

    // Calculate intersection point
    return [
      rayOrigin[0] + t * rayDirection[0],
      rayOrigin[1] + t * rayDirection[1],
      rayOrigin[2] + t * rayDirection[2],
    ];
  }

  // Calculate angle between two vectors in a plane
  calculateAngleBetweenVectors(vector1, vector2, planeNormal) {
    // Normalize vectors
    const v1Length = Math.sqrt(
      vector1[0] * vector1[0] +
        vector1[1] * vector1[1] +
        vector1[2] * vector1[2],
    );
    const v2Length = Math.sqrt(
      vector2[0] * vector2[0] +
        vector2[1] * vector2[1] +
        vector2[2] * vector2[2],
    );

    if (v1Length < 0.0001 || v2Length < 0.0001) {
      return 0; // One of the vectors is too small
    }

    const v1Normalized = [
      vector1[0] / v1Length,
      vector1[1] / v1Length,
      vector1[2] / v1Length,
    ];
    const v2Normalized = [
      vector2[0] / v2Length,
      vector2[1] / v2Length,
      vector2[2] / v2Length,
    ];

    // Calculate dot product
    const dotProduct =
      v1Normalized[0] * v2Normalized[0] +
      v1Normalized[1] * v2Normalized[1] +
      v1Normalized[2] * v2Normalized[2];

    // Clamp dot product to prevent NaN from acos
    const clampedDot = Math.max(-1, Math.min(1, dotProduct));

    // Calculate cross product to determine rotation direction
    const crossProduct = [
      v1Normalized[1] * v2Normalized[2] - v1Normalized[2] * v2Normalized[1],
      v1Normalized[2] * v2Normalized[0] - v1Normalized[0] * v2Normalized[2],
      v1Normalized[0] * v2Normalized[1] - v1Normalized[1] * v2Normalized[0],
    ];

    // Calculate sign based on cross product alignment with plane normal
    const sign =
      crossProduct[0] * planeNormal[0] +
        crossProduct[1] * planeNormal[1] +
        crossProduct[2] * planeNormal[2] >=
      0
        ? 1
        : -1;

    return sign * Math.acos(clampedDot);
  }

  // Calculate distance between two points
  calculateDistance(point1, point2) {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    const dz = point1[2] - point2[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // ─── Box Scale Gizmo ───

  // Corner sign table: [x, y, z] signs for each of 8 corners
  static BOX_CORNER_SIGNS = [
    [-1, -1, -1], // 0
    [+1, -1, -1], // 1
    [+1, +1, -1], // 2
    [-1, +1, -1], // 3
    [-1, -1, +1], // 4
    [+1, -1, +1], // 5
    [+1, +1, +1], // 6
    [-1, +1, +1], // 7
  ];
  static BOX_CORNER_OPPOSITES = [6, 7, 4, 5, 2, 3, 0, 1];
  static BOX_EDGES = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];
  static BOX_FACE_DEFS = {
    xPos: { axis: 0, sign: +1, opposite: "xNeg" },
    xNeg: { axis: 0, sign: -1, opposite: "xPos" },
    yPos: { axis: 1, sign: +1, opposite: "yNeg" },
    yNeg: { axis: 1, sign: -1, opposite: "yPos" },
    zPos: { axis: 2, sign: +1, opposite: "zNeg" },
    zNeg: { axis: 2, sign: -1, opposite: "zPos" },
  };
  // 12 edge-midpoint handles, one per BOX_EDGES entry (same order/index).
  // `signs` is the midpoint sign vector (0 along the edge's free axis);
  // `freeAxis` is the edge direction (unscaled); `scaledAxes` are the two
  // axes the handle scales together. The anchor is the opposite edge midpoint
  // (negate the scaled-axis signs), so dragging pins the far edge in place.
  static BOX_EDGE_HANDLE_DEFS = [
    { signs: [0, -1, -1], freeAxis: 0, scaledAxes: [1, 2] }, // [0,1]
    { signs: [+1, 0, -1], freeAxis: 1, scaledAxes: [0, 2] }, // [1,2]
    { signs: [0, +1, -1], freeAxis: 0, scaledAxes: [1, 2] }, // [2,3]
    { signs: [-1, 0, -1], freeAxis: 1, scaledAxes: [0, 2] }, // [3,0]
    { signs: [0, -1, +1], freeAxis: 0, scaledAxes: [1, 2] }, // [4,5]
    { signs: [+1, 0, +1], freeAxis: 1, scaledAxes: [0, 2] }, // [5,6]
    { signs: [0, +1, +1], freeAxis: 0, scaledAxes: [1, 2] }, // [6,7]
    { signs: [-1, 0, +1], freeAxis: 1, scaledAxes: [0, 2] }, // [7,4]
    { signs: [-1, -1, 0], freeAxis: 2, scaledAxes: [0, 1] }, // [0,4]
    { signs: [+1, -1, 0], freeAxis: 2, scaledAxes: [0, 1] }, // [1,5]
    { signs: [+1, +1, 0], freeAxis: 2, scaledAxes: [0, 1] }, // [2,6]
    { signs: [-1, +1, 0], freeAxis: 2, scaledAxes: [0, 1] }, // [3,7]
  ];

  _boxLocalToWorld(localPos, center, rotMatrix) {
    const w = this.transformVectorByMatrix(localPos, rotMatrix);
    return [center[0] + w[0], center[1] + w[1], center[2] + w[2]];
  }

  _computeBoxScaleBounds(selectedInstances) {
    if (selectedInstances.length === 1) {
      const inst = selectedInstances[0];
      const instType = this.getInstanceType(inst);
      const tv = this.getInstanceTransformValues(inst, instType);
      const rotMatrix = this.createRotationMatrix(tv.rotation);
      const invRotMatrix = this.transposeMatrix(rotMatrix);

      // 3D models: the engine only exposes an axis-aligned world AABB, which is
      // rotationally symmetric at 45° and so can't drive an oriented box. Use
      // the model's known LOCAL geometry (MODEL_BASE_SIZES, captured at scale 1 /
      // rotation 0) instead: local extents are base / scale (scale is stored
      // reciprocally), the box center is the origin→center offset scaled the
      // same way and rotated by the model's rotation. Exact at every angle.
      if (instType === "object3d") {
        const base = getModelBaseSize(inst.objectType?.name);
        if (base) {
          const sx = inst.xScale || 1;
          const sy = inst.yScale || 1;
          const sz = inst.zScale || 1;
          const offLocal = [base.ox / sx, base.oy / sy, base.oz / sz];
          const off = this.transformVectorByMatrix(offLocal, rotMatrix);
          const pivotZ = inst.totalZElevation || 0;
          return {
            center: [inst.x + off[0], inst.y + off[1], pivotZ + off[2]],
            halfExtents: [base.w / sx / 2, base.h / sy / 2, base.d / sz / 2],
            rotationMatrix: rotMatrix,
            inverseRotation: invRotMatrix,
            isOBB: true,
          };
        }
        // Fallback for any uncaptured model type: axis-aligned world AABB.
        let fb = null;
        try {
          fb = getObjectBounds(inst);
        } catch (e) {
          fb = null;
        }
        if (fb) {
          return {
            center: [
              (fb.left + fb.right) / 2,
              (fb.top + fb.bottom) / 2,
              (fb.minZ + fb.maxZ) / 2,
            ],
            halfExtents: [
              (fb.right - fb.left) / 2,
              (fb.bottom - fb.top) / 2,
              (fb.maxZ - fb.minZ) / 2,
            ],
            rotationMatrix: this.createIdentityMatrix(),
            inverseRotation: this.createIdentityMatrix(),
            isOBB: false,
          };
        }
      }

      const zElev =
        inst.originalZElevation !== undefined
          ? inst.originalZElevation
          : inst.totalZElevation || 0;

      let halfW = inst.width / 2;
      let halfH = inst.height / 2;
      let halfD = 0;
      let centerZ = zElev;

      if (instType === "shape3d") {
        halfD = (inst.zHeight || 0) / 2;
        centerZ = zElev + halfD;
      }

      const originX = inst.originX !== undefined ? inst.originX : 0.5;
      const originY = inst.originY !== undefined ? inst.originY : 0.5;
      const originOffset = this.transformVectorByMatrix(
        [(0.5 - originX) * inst.width, (0.5 - originY) * inst.height, 0],
        rotMatrix,
      );

      return {
        center: [
          inst.x + originOffset[0],
          inst.y + originOffset[1],
          centerZ + originOffset[2],
        ],
        halfExtents: [halfW, halfH, halfD],
        rotationMatrix: rotMatrix,
        inverseRotation: invRotMatrix,
        isOBB: true,
      };
    }

    // Multi-selection: axis-aligned
    const bounds = this.selectionManager.calculateSelectionBounds();
    if (!bounds) return null;

    return {
      center: [bounds.centerX, bounds.centerY, bounds.centerZ],
      halfExtents: [bounds.width / 2, bounds.height / 2, bounds.depth / 2],
      rotationMatrix: this.createIdentityMatrix(),
      inverseRotation: this.createIdentityMatrix(),
      isOBB: false,
    };
  }

  showBoxScaleGizmo(camera = null) {
    this.hideGizmos();

    const selectedInstances = Array.from(this.selectionManager.getSelection());
    if (selectedInstances.length === 0) return;

    const supportedModes = this.getCommonSupportedModes(selectedInstances);
    if (supportedModes.scale.length === 0) return;

    this.currentMode = "boxScale";
    this.isActive = true;

    const boxData = this._computeBoxScaleBounds(selectedInstances);
    if (!boxData) return;

    const { center, halfExtents, rotationMatrix } = boxData;
    const is2D = !supportedModes.scale.includes("z") || halfExtents[2] < 0.01;

    // Compute the 8 corner positions in world space
    const cornerSigns = TransformGizmos.BOX_CORNER_SIGNS;
    const corners = cornerSigns.map((s) =>
      this._boxLocalToWorld(
        [s[0] * halfExtents[0], s[1] * halfExtents[1], s[2] * halfExtents[2]],
        center,
        rotationMatrix,
      ),
    );

    // Create wireframe edges
    const wireColor = this.boxScaleWireColor;
    const edges = is2D
      ? TransformGizmos.BOX_EDGES.slice(0, 4) // bottom ring only
      : TransformGizmos.BOX_EDGES;

    edges.forEach(([a, b]) => {
      const id = this.gizmoManager.createGizmo(
        "line3D",
        {
          x1: corners[a][0],
          y1: corners[a][1],
          z1: corners[a][2],
          x2: corners[b][0],
          y2: corners[b][1],
          z2: corners[b][2],
          color: wireColor,
          thickness: 1.5,
        },
        ["transform", "boxScale", "edge"],
        false,
        "Gizmos",
      );
      this.boxScaleGizmoIds.edges.push(id);
    });

    // Create corner handles
    const cornerIndices = is2D ? [0, 1, 2, 3] : [0, 1, 2, 3, 4, 5, 6, 7];
    cornerIndices.forEach((ci) => {
      const id = this.gizmoManager.createGizmo(
        "cornerScaleHandle",
        {
          x: corners[ci][0],
          y: corners[ci][1],
          z: corners[ci][2],
          handleSize: this.handleSize,
          color: [...this.boxScaleCornerColor],
        },
        ["transform", "boxScale", "corner"],
        true,
        "GizmosAbove",
      );
      this.boxScaleGizmoIds.corners.push(id);
    });

    // Create edge handles (scale 2 axes at once). Only meaningful in 3D —
    // in 2D an edge would scale one real axis + the absent Z, i.e. a face.
    const axisColors = [this.xAxisColor, this.yAxisColor, this.zAxisColor];
    if (!is2D) {
      TransformGizmos.BOX_EDGE_HANDLE_DEFS.forEach((def, ei) => {
        const [a0, a1] = def.scaledAxes;
        const an0 = ["x", "y", "z"][a0];
        const an1 = ["x", "y", "z"][a1];
        // Skip if either scaled axis isn't supported by the selection
        if (
          !supportedModes.scale.includes(an0) ||
          !supportedModes.scale.includes(an1)
        ) {
          this.boxScaleGizmoIds.edgeHandles.push(null);
          return;
        }
        const localPos = [
          def.signs[0] * halfExtents[0],
          def.signs[1] * halfExtents[1],
          def.signs[2] * halfExtents[2],
        ];
        const worldPos = this._boxLocalToWorld(
          localPos,
          center,
          rotationMatrix,
        );
        // Color = blend of the two axes this handle scales
        const c0 = axisColors[a0];
        const c1 = axisColors[a1];
        const blended = [
          (c0[0] + c1[0]) / 2,
          (c0[1] + c1[1]) / 2,
          (c0[2] + c1[2]) / 2,
          1,
        ];
        const id = this.gizmoManager.createGizmo(
          "cornerScaleHandle",
          {
            x: worldPos[0],
            y: worldPos[1],
            z: worldPos[2],
            handleSize: this.handleSize * 0.75,
            color: blended,
          },
          ["transform", "boxScale", "edge"],
          true,
          "GizmosAbove",
        );
        this.boxScaleGizmoIds.edgeHandles.push(id);
      });
    }

    // Create face center handles
    const faceColors = {
      xPos: this.xAxisColor,
      xNeg: this.xAxisColor,
      yPos: this.yAxisColor,
      yNeg: this.yAxisColor,
      zPos: this.zAxisColor,
      zNeg: this.zAxisColor,
    };

    for (const [key, def] of Object.entries(TransformGizmos.BOX_FACE_DEFS)) {
      // Skip Z faces for 2D objects
      if (is2D && def.axis === 2) continue;
      // Skip axes not supported
      const axisName = ["x", "y", "z"][def.axis];
      if (!supportedModes.scale.includes(axisName)) continue;

      const localPos = [0, 0, 0];
      localPos[def.axis] = def.sign * halfExtents[def.axis];
      const worldPos = this._boxLocalToWorld(localPos, center, rotationMatrix);

      const id = this.gizmoManager.createGizmo(
        "cornerScaleHandle",
        {
          x: worldPos[0],
          y: worldPos[1],
          z: worldPos[2],
          handleSize: this.handleSize * 0.8,
          color: [...faceColors[key]],
        },
        ["transform", "boxScale", "face"],
        true,
        "GizmosAbove",
      );
      this.boxScaleGizmoIds.faces[key] = id;
    }

    // Enable camera-distance scaling on interactive handles
    this.boxScaleGizmoIds.corners.forEach((id) => {
      this.gizmoManager.enableGizmoScaling(id, 1.0, 1000);
    });
    this.boxScaleGizmoIds.edgeHandles.forEach((id) => {
      if (id) this.gizmoManager.enableGizmoScaling(id, 1.0, 1000);
    });
    Object.values(this.boxScaleGizmoIds.faces).forEach((id) => {
      if (id) this.gizmoManager.enableGizmoScaling(id, 1.0, 1000);
    });
  }

  startBoxScaleDrag(axis) {
    const selectedInstances = Array.from(this.selectionManager.getSelection());
    if (selectedInstances.length === 0) return;

    const boxData = this._computeBoxScaleBounds(selectedInstances);
    if (!boxData) return;

    const supportedModes = this.getCommonSupportedModes(selectedInstances);
    const is2D =
      !supportedModes.scale.includes("z") || boxData.halfExtents[2] < 0.01;

    const { center, halfExtents, rotationMatrix, inverseRotation, isOBB } =
      boxData;

    let handleType, handleLocal, anchorLocal, scaledAxes;

    if (axis.startsWith("boxCorner_")) {
      handleType = "corner";
      const cornerArrayIdx = parseInt(axis.split("_")[1]);
      // Map array index to actual corner index (may differ for 2D)
      const cornerIndices = is2D ? [0, 1, 2, 3] : [0, 1, 2, 3, 4, 5, 6, 7];
      const ci = cornerIndices[cornerArrayIdx];
      const oppCI = TransformGizmos.BOX_CORNER_OPPOSITES[ci];

      const signs = TransformGizmos.BOX_CORNER_SIGNS[ci];
      handleLocal = [
        signs[0] * halfExtents[0],
        signs[1] * halfExtents[1],
        signs[2] * halfExtents[2],
      ];

      const oppSigns = TransformGizmos.BOX_CORNER_SIGNS[oppCI];
      anchorLocal = [
        oppSigns[0] * halfExtents[0],
        oppSigns[1] * halfExtents[1],
        oppSigns[2] * halfExtents[2],
      ];
      if (is2D) {
        handleLocal[2] = 0;
        anchorLocal[2] = 0;
      }
      scaledAxes = is2D ? [0, 1] : [0, 1, 2];
    } else if (axis.startsWith("boxEdge_")) {
      handleType = "edge";
      const edgeIdx = parseInt(axis.split("_")[1]);
      const def = TransformGizmos.BOX_EDGE_HANDLE_DEFS[edgeIdx];
      handleLocal = [
        def.signs[0] * halfExtents[0],
        def.signs[1] * halfExtents[1],
        def.signs[2] * halfExtents[2],
      ];
      // Anchor = opposite edge midpoint (negate the scaled-axis signs; the
      // free-axis sign is already 0, so negating the whole vector is fine)
      anchorLocal = [-handleLocal[0], -handleLocal[1], -handleLocal[2]];
      scaledAxes = [...def.scaledAxes];
    } else {
      handleType = "face";
      const faceKey = axis.split("_")[1];
      const def = TransformGizmos.BOX_FACE_DEFS[faceKey];
      const oppDef = TransformGizmos.BOX_FACE_DEFS[def.opposite];

      handleLocal = [0, 0, 0];
      handleLocal[def.axis] = def.sign * halfExtents[def.axis];

      anchorLocal = [0, 0, 0];
      anchorLocal[oppDef.axis] = oppDef.sign * halfExtents[oppDef.axis];
      scaledAxes = [def.axis];
    }

    // Compute drag plane
    const camera = globalThis._editorScope?.cameraType;
    let dragPlaneNormal, dragPlanePoint;
    const handleWorld = this._boxLocalToWorld(
      handleLocal,
      center,
      rotationMatrix,
    );
    dragPlanePoint = handleWorld;

    if (handleType === "face") {
      const faceKey = axis.split("_")[1];
      const def = TransformGizmos.BOX_FACE_DEFS[faceKey];
      const localDir = [0, 0, 0];
      localDir[def.axis] = 1;
      const worldDir = this.transformVectorByMatrix(localDir, rotationMatrix);

      if (camera) {
        const cameraLook = camera.getLookVector();
        const cross1 = this._cross(worldDir, cameraLook);
        const crossLen = Math.sqrt(
          cross1[0] ** 2 + cross1[1] ** 2 + cross1[2] ** 2,
        );
        if (crossLen > 0.001) {
          const n = this._cross(cross1, worldDir);
          const nLen = Math.sqrt(n[0] ** 2 + n[1] ** 2 + n[2] ** 2);
          dragPlaneNormal = [n[0] / nLen, n[1] / nLen, n[2] / nLen];
        } else {
          dragPlaneNormal = [...cameraLook];
        }
      } else {
        dragPlaneNormal = [0, 0, 1];
      }
    } else {
      // Corner: camera-facing plane
      dragPlaneNormal = camera ? camera.getLookVector() : [0, 0, 1];
    }

    // Intersect initial mouse ray
    const startRay = globalThis._editorScope.getScreenRay(
      this.gizmoManager.mouseX,
      this.gizmoManager.mouseY,
    );
    const initialMouseWorld = this.intersectRayWithPlane(
      startRay,
      dragPlanePoint,
      dragPlaneNormal,
    );

    this.isDragging = true;
    this.currentDraggingAxis = axis;
    this.dragStartMousePos = {
      x: this.gizmoManager.mouseX,
      y: this.gizmoManager.mouseY,
    };

    // Store initial values for all instances
    this.dragStartValues.clear();
    selectedInstances.forEach((inst) => {
      const instType = this.getInstanceType(inst);
      this.dragStartValues.set(
        inst,
        this.getInstanceTransformValues(inst, instType),
      );
    });

    this.boxScaleDragState = {
      handleType,
      handleKey: axis,
      anchorLocal,
      handleLocal,
      scaledAxes,
      boxCenter: center,
      halfExtents: [...halfExtents],
      rotationMatrix,
      inverseRotation,
      isOBB,
      is2D,
      initialMouseWorld,
      dragPlaneNormal,
      dragPlanePoint,
    };
  }

  _cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  }

  _dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  _vecLength(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }

  _normalize(v) {
    const len = this._vecLength(v);
    if (len < 1e-8) return [0, 0, 0];
    return [v[0] / len, v[1] / len, v[2] / len];
  }

  isAltKeyPressed() {
    if (!globalThis._editorScope?.runtime?.keyboard) return false;
    const kb = globalThis._editorScope.runtime.keyboard;
    return (
      kb.isKeyDown("AltLeft") || kb.isKeyDown("AltRight") || kb.isKeyDown("Alt")
    );
  }

  isCtrlOrCmdPressed() {
    if (!globalThis._editorScope?.runtime?.keyboard) return false;
    const kb = globalThis._editorScope.runtime.keyboard;
    return (
      kb.isKeyDown("ControlLeft") ||
      kb.isKeyDown("ControlRight") ||
      kb.isKeyDown("Control") ||
      kb.isKeyDown("MetaLeft") ||
      kb.isKeyDown("MetaRight") ||
      kb.isKeyDown("Meta")
    );
  }

  updateBoxScaleDrag(mouseX, mouseY, camera) {
    const state = this.boxScaleDragState;
    if (!state) return;

    const currentRay = globalThis._editorScope.getScreenRay(mouseX, mouseY);
    if (!currentRay) return;

    const currentWorld = this.intersectRayWithPlane(
      currentRay,
      state.dragPlanePoint,
      state.dragPlaneNormal,
    );
    if (!currentWorld) return;

    // Determine anchor based on Alt key
    const useCenter = this.isAltKeyPressed();
    const anchorLocal = useCenter ? [0, 0, 0] : state.anchorLocal;
    const anchorWorld = this._boxLocalToWorld(
      anchorLocal,
      state.boxCenter,
      state.rotationMatrix,
    );

    const scaleFactors = [1, 1, 1];

    if (state.handleType === "face") {
      const faceKey = state.handleKey.split("_")[1];
      const def = TransformGizmos.BOX_FACE_DEFS[faceKey];
      const axisIdx = def.axis;

      // Drag axis in world space — must point from anchor toward handle
      const localDir = [0, 0, 0];
      localDir[axisIdx] = def.sign;
      const worldDir = this.transformVectorByMatrix(
        localDir,
        state.rotationMatrix,
      );

      // Project displacement onto axis
      const anchorToMouse = [
        currentWorld[0] - anchorWorld[0],
        currentWorld[1] - anchorWorld[1],
        currentWorld[2] - anchorWorld[2],
      ];
      const projectedDist = this._dot(anchorToMouse, worldDir);
      const originalDist = state.halfExtents[axisIdx] * (useCenter ? 1 : 2);

      if (Math.abs(originalDist) > 0.001) {
        scaleFactors[axisIdx] = Math.max(0.01, projectedDist / originalDist);
      }
    } else {
      // Corner (3-axis) or edge (2-axis) handle. `scaledAxes` is [0,1,2]/[0,1]
      // for corners and the two perpendicular axes for edges.
      const anchorToMouse = [
        currentWorld[0] - anchorWorld[0],
        currentWorld[1] - anchorWorld[1],
        currentWorld[2] - anchorWorld[2],
      ];

      if (this.isCtrlOrCmdPressed()) {
        // Uniform: scale every spanned axis equally along the box diagonal.
        // The diagonal lies in the scaled sub-space because the free-axis
        // component of handleLocal-anchorLocal is 0.
        const anchorToCorner = [
          state.handleLocal[0] - anchorLocal[0],
          state.handleLocal[1] - anchorLocal[1],
          state.handleLocal[2] - anchorLocal[2],
        ];
        const anchorToCornerWorld = this.transformVectorByMatrix(
          anchorToCorner,
          state.rotationMatrix,
        );
        const diagonalDir = this._normalize(anchorToCornerWorld);
        const originalDist = this._vecLength(anchorToCornerWorld);
        const projectedDist = this._dot(anchorToMouse, diagonalDir);
        if (originalDist > 0.001) {
          const sf = Math.max(0.01, projectedDist / originalDist);
          for (const ax of state.scaledAxes) scaleFactors[ax] = sf;
        }
      } else {
        // Default: independent per-axis scaling from the mouse's actual
        // position in the box's local frame. Project the anchor→mouse vector
        // onto each scaled local axis separately.
        for (const ax of state.scaledAxes) {
          const localDir = [0, 0, 0];
          localDir[ax] = 1;
          const worldDir = this.transformVectorByMatrix(
            localDir,
            state.rotationMatrix,
          );
          const projectedDist = this._dot(anchorToMouse, worldDir);
          // Signed original extent along this axis (carries the handle's side)
          const originalDist = state.handleLocal[ax] - anchorLocal[ax];
          if (Math.abs(originalDist) > 0.001) {
            scaleFactors[ax] = Math.max(0.01, projectedDist / originalDist);
          }
        }
      }
    }

    // Grid snapping
    const gridSystem = globalThis._editorScope?.gridSystem;
    if (gridSystem && gridSystem.shouldSnapToGrid()) {
      const gs = gridSystem.getGridSize();
      const gridSizes = [gs.x, gs.y, gs.z];

      if (state.handleType === "face") {
        const faceKey = state.handleKey.split("_")[1];
        const axisIdx = TransformGizmos.BOX_FACE_DEFS[faceKey].axis;
        const rawDim = state.halfExtents[axisIdx] * 2 * scaleFactors[axisIdx];
        const snapped = Math.max(
          gridSizes[axisIdx],
          Math.round(rawDim / gridSizes[axisIdx]) * gridSizes[axisIdx],
        );
        scaleFactors[axisIdx] = snapped / (state.halfExtents[axisIdx] * 2);
      } else {
        // Corner/edge with grid: snap each scaled axis independently
        for (const i of state.scaledAxes) {
          if (state.is2D && i === 2) continue;
          if (state.halfExtents[i] < 0.01) continue;
          const rawDim = state.halfExtents[i] * 2 * scaleFactors[i];
          const snapped = Math.max(
            gridSizes[i],
            Math.round(rawDim / gridSizes[i]) * gridSizes[i],
          );
          scaleFactors[i] = snapped / (state.halfExtents[i] * 2);
        }
      }
    }

    // Apply transforms to all selected instances
    const selectedInstances = Array.from(this.selectionManager.getSelection());
    selectedInstances.forEach((inst) => {
      const instType = this.getInstanceType(inst);
      const initialValues = this.dragStartValues.get(inst);
      if (!initialValues) return;

      // Position adjustment: keep anchor fixed
      const relPos = [
        initialValues.position[0] - anchorWorld[0],
        initialValues.position[1] - anchorWorld[1],
        initialValues.position[2] - anchorWorld[2],
      ];

      let scaledRelPos;
      if (state.isOBB) {
        const localRel = this.transformVectorByMatrix(
          relPos,
          state.inverseRotation,
        );
        const scaledLocal = [
          localRel[0] * scaleFactors[0],
          localRel[1] * scaleFactors[1],
          localRel[2] * scaleFactors[2],
        ];
        scaledRelPos = this.transformVectorByMatrix(
          scaledLocal,
          state.rotationMatrix,
        );
      } else {
        scaledRelPos = [
          relPos[0] * scaleFactors[0],
          relPos[1] * scaleFactors[1],
          relPos[2] * scaleFactors[2],
        ];
      }

      inst.x = anchorWorld[0] + scaledRelPos[0];
      inst.y = anchorWorld[1] + scaledRelPos[1];

      const newZ = anchorWorld[2] + scaledRelPos[2];
      if (inst.originalZElevation !== undefined) {
        inst.originalZElevation = newZ;
      } else if (inst.zElevation !== undefined) {
        inst.zElevation = newZ;
      }

      // Apply dimension scaling
      this.applyTransformToInstance(inst, instType, initialValues, {
        scale: scaleFactors,
      });
    });

    // Update visual gizmos
    this._updateBoxScaleGizmosRealTime();
    this.selectionManager.updateSelectionVisualizations();
    refreshInspector();
  }

  _updateBoxScaleGizmosRealTime() {
    const selectedInstances = Array.from(this.selectionManager.getSelection());
    if (selectedInstances.length === 0) return;

    const boxData = this._computeBoxScaleBounds(selectedInstances);
    if (!boxData) return;

    const { center, halfExtents, rotationMatrix } = boxData;
    const supportedModes = this.getCommonSupportedModes(selectedInstances);
    const is2D = !supportedModes.scale.includes("z") || halfExtents[2] < 0.01;

    // Recompute corners
    const cornerSigns = TransformGizmos.BOX_CORNER_SIGNS;
    const corners = cornerSigns.map((s) =>
      this._boxLocalToWorld(
        [s[0] * halfExtents[0], s[1] * halfExtents[1], s[2] * halfExtents[2]],
        center,
        rotationMatrix,
      ),
    );

    // Update edges
    const edgeDefs = is2D
      ? TransformGizmos.BOX_EDGES.slice(0, 4)
      : TransformGizmos.BOX_EDGES;

    edgeDefs.forEach(([a, b], i) => {
      if (i < this.boxScaleGizmoIds.edges.length) {
        this.gizmoManager.updateGizmo(this.boxScaleGizmoIds.edges[i], {
          x1: corners[a][0],
          y1: corners[a][1],
          z1: corners[a][2],
          x2: corners[b][0],
          y2: corners[b][1],
          z2: corners[b][2],
        });
      }
    });

    // Update corner handles
    const cornerIndices = is2D ? [0, 1, 2, 3] : [0, 1, 2, 3, 4, 5, 6, 7];
    cornerIndices.forEach((ci, i) => {
      if (i < this.boxScaleGizmoIds.corners.length) {
        this.gizmoManager.updateGizmo(this.boxScaleGizmoIds.corners[i], {
          x: corners[ci][0],
          y: corners[ci][1],
          z: corners[ci][2],
        });
      }
    });

    // Update edge handles (2-axis)
    if (!is2D) {
      TransformGizmos.BOX_EDGE_HANDLE_DEFS.forEach((def, ei) => {
        const id = this.boxScaleGizmoIds.edgeHandles[ei];
        if (!id) return;
        const localPos = [
          def.signs[0] * halfExtents[0],
          def.signs[1] * halfExtents[1],
          def.signs[2] * halfExtents[2],
        ];
        const worldPos = this._boxLocalToWorld(
          localPos,
          center,
          rotationMatrix,
        );
        this.gizmoManager.updateGizmo(id, {
          x: worldPos[0],
          y: worldPos[1],
          z: worldPos[2],
        });
      });
    }

    // Update face handles
    for (const [key, def] of Object.entries(TransformGizmos.BOX_FACE_DEFS)) {
      const id = this.boxScaleGizmoIds.faces[key];
      if (!id) continue;

      const localPos = [0, 0, 0];
      localPos[def.axis] = def.sign * halfExtents[def.axis];
      const worldPos = this._boxLocalToWorld(localPos, center, rotationMatrix);

      this.gizmoManager.updateGizmo(id, {
        x: worldPos[0],
        y: worldPos[1],
        z: worldPos[2],
      });
    }
  }

  // Helper methods for gizmo orientation

  // Calculate rotation matrix based on selected instances
  calculateGizmoRotationMatrix(selectedInstances) {
    if (selectedInstances.length === 0) {
      return this.createIdentityMatrix();
    }

    // For single selection, use the instance's rotation
    if (selectedInstances.length === 1) {
      const instance = selectedInstances[0];
      const instanceType = this.getInstanceType(instance);
      const transformValues = this.getInstanceTransformValues(
        instance,
        instanceType,
      );
      return this.createRotationMatrix(transformValues.rotation);
    }

    // For multiple selections, use identity matrix (no rotation)
    // Could be enhanced to calculate average rotation or common rotation in the future
    return this.createIdentityMatrix();
  }

  // Create 3x3 identity matrix
  createIdentityMatrix() {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  }

  // Create rotation matrix from Euler angles [x, y, z] in radians
  // Using ZYX rotation order (Z first, then Y, then X) - this produces gimbal lock
  // Note: meshRotation objects use XYZ order in gizmo display
  createRotationMatrix(rotation) {
    const [rx, ry, rz] = rotation;

    // Create rotation matrices for each axis
    const cosX = Math.cos(rx),
      sinX = Math.sin(rx);
    const cosY = Math.cos(ry),
      sinY = Math.sin(ry);
    const cosZ = Math.cos(rz),
      sinZ = Math.sin(rz);

    // Rotation matrix for X axis
    const Rx = [
      [1, 0, 0],
      [0, cosX, -sinX],
      [0, sinX, cosX],
    ];

    // Rotation matrix for Y axis
    const Ry = [
      [cosY, 0, sinY],
      [0, 1, 0],
      [-sinY, 0, cosY],
    ];

    // Rotation matrix for Z axis
    const Rz = [
      [cosZ, -sinZ, 0],
      [sinZ, cosZ, 0],
      [0, 0, 1],
    ];

    // Combine rotations: ZYX order - Rz * Ry * Rx (right to left application)
    // This order produces gimbal lock behavior when Y rotation approaches ±90°
    return this.multiplyMatrices(this.multiplyMatrices(Rz, Ry), Rx);
  }

  // Create rotation matrix for individual axis gizmo orientation
  // This considers the rotation order and gimbal lock for proper gizmo display
  // In ZYX order: Z rotates first, then Y in the rotated space, then X in the doubly-rotated space
  // For meshRotation objects: XYZ order (X first, then Y, then Z)
  createGizmoRotationMatrix(currentRotation, axis, instanceType = null) {
    const [rx, ry, rz] = currentRotation;

    // For meshRotation objects, use XYZ rotation order
    if (instanceType === "meshRotation") {
      // XYZ rotation order: X rotates first, then Y in the rotated space, then Z in the doubly-rotated space
      switch (axis) {
        case "x":
          // X gizmo always shows in world space (applied first in XYZ order)
          // The X ring stays aligned to world X axis regardless of current rotation
          return this.createIdentityMatrix();

        case "y":
          // Y gizmo shows after X rotation is applied
          // At this point, only the X rotation has been applied, so Y axis is rotated by X
          const cosX = Math.cos(rx),
            sinX = Math.sin(rx);
          return [
            [1, 0, 0],
            [0, cosX, -sinX],
            [0, sinX, cosX],
          ];

        case "z":
          // Z gizmo shows after X and Y rotations are applied
          // In XYZ order, the Z axis should show the combined effect of X and Y rotations
          // This is where gimbal lock becomes most apparent in XYZ order - when Y = ±90°, X and Z become aligned
          const cosX2 = Math.cos(rx),
            sinX2 = Math.sin(rx);
          const cosY2 = Math.cos(ry),
            sinY2 = Math.sin(ry);

          const Rx = [
            [1, 0, 0],
            [0, cosX2, -sinX2],
            [0, sinX2, cosX2],
          ];

          const Ry = [
            [cosY2, 0, sinY2],
            [0, 1, 0],
            [-sinY2, 0, cosY2],
          ];

          // For Z axis gizmo orientation, we need the combined transformation matrix Ry * Rx
          // This shows how the Z axis is oriented after both X and Y rotations
          return this.multiplyMatrices(Ry, Rx);

        default:
          return this.createIdentityMatrix();
      }
    } else {
      // For all other object types, use ZYX rotation order
      // ZYX rotation order: Z rotates first, then Y in the rotated space, then X in the doubly-rotated space
      switch (axis) {
        case "z":
          // Z gizmo always shows in world space (applied first in ZYX order)
          // The Z ring stays aligned to world Z axis regardless of current rotation
          return this.createIdentityMatrix();

        case "y":
          // Y gizmo shows after Z rotation is applied
          // At this point, only the Z rotation has been applied, so Y axis is rotated by Z
          const cosZ = Math.cos(rz),
            sinZ = Math.sin(rz);
          return [
            [cosZ, -sinZ, 0],
            [sinZ, cosZ, 0],
            [0, 0, 1],
          ];

        case "x":
          // X gizmo shows after Z and Y rotations are applied
          // This is where gimbal lock becomes most apparent - when Y = ±90°, X and Z become aligned
          const cosZ2 = Math.cos(rz),
            sinZ2 = Math.sin(rz);
          const cosY2 = Math.cos(ry),
            sinY2 = Math.sin(ry);

          const Rz = [
            [cosZ2, -sinZ2, 0],
            [sinZ2, cosZ2, 0],
            [0, 0, 1],
          ];

          const Ry = [
            [cosY2, 0, sinY2],
            [0, 1, 0],
            [-sinY2, 0, cosY2],
          ];

          // Apply Y rotation after Z rotation: Ry * Rz
          return this.multiplyMatrices(Ry, Rz);

        default:
          return this.createIdentityMatrix();
      }
    }
  }

  // Multiply two 3x3 matrices
  multiplyMatrices(a, b) {
    const result = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        result[i][j] =
          a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j];
      }
    }

    return result;
  }

  // Transform a vector by a rotation matrix
  transformVectorByMatrix(vector, matrix) {
    const [x, y, z] = vector;
    return [
      matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z,
      matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z,
      matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z,
    ];
  }

  // Transpose a 3x3 matrix (for inverse of orthonormal matrices)
  transposeMatrix(matrix) {
    return [
      [matrix[0][0], matrix[1][0], matrix[2][0]],
      [matrix[0][1], matrix[1][1], matrix[2][1]],
      [matrix[0][2], matrix[1][2], matrix[2][2]],
    ];
  }

  // Extract Euler angles from rotation matrix (ZYX order)
  extractEulerAnglesFromMatrix(matrix) {
    // Extract Euler angles from 3x3 rotation matrix using ZYX order
    // Matrix is assumed to be: R = Rz * Ry * Rx

    // Extract angles from rotation matrix elements
    let angleX, angleY, angleZ;

    // Check for gimbal lock
    const sinY = -matrix[2][0];
    // Normal case
    angleY = Math.asin(Math.max(-1, Math.min(1, sinY)));
    angleZ = Math.atan2(matrix[1][0], matrix[0][0]);
    angleX = Math.atan2(matrix[2][1], matrix[2][2]);

    return [angleX, angleY, angleZ];
  }

  // Convert a normal vector to Euler angles for ZYX rotation order
  // This ensures plane gizmos are properly oriented according to the normal vector
  normalToEulerAnglesZYX(normal) {
    const [nx, ny, nz] = normal;

    // Normalize the normal vector
    const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (length < 1e-6) {
      return [0, 0, 0]; // Default orientation for zero vector
    }

    const normX = nx / length;
    const normY = ny / length;
    const normZ = nz / length;

    // Handle special cases
    if (Math.abs(normZ) > 0.9999) {
      // Normal is very close to +Z or -Z axis
      if (normZ > 0) {
        return [0, 0, 0]; // Already aligned with +Z
      } else {
        return [Math.PI, 0, 0]; // Flip around X axis to face -Z
      }
    }

    // Calculate rotation to align [0,0,1] with the normal vector
    // Using the approach to find the rotation that transforms the default plane normal (0,0,1) to our desired normal

    // For ZYX Euler order, we need to find angles that when applied in sequence give us the desired normal
    // We'll use the approach where we first rotate around Y, then around X

    // Project the normal onto the XZ plane to find Y rotation
    const projXZ = Math.sqrt(normX * normX + normZ * normZ);

    // Y rotation: rotate around Y to align the XZ projection with Z axis
    const ry = Math.atan2(normX, normZ);

    // X rotation: tilt to reach the final normal
    const rx = Math.atan2(-normY, projXZ);

    // Z rotation is typically 0 for plane orientation
    const rz = 0;

    return [rx, ry, rz];
  }
}
