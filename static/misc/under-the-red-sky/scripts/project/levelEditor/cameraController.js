import {
  normalize,
  crossProduct,
  add,
  scale,
  subtract,
  dot,
} from "./vector.js";

const ELEVATION_LIMIT = Math.PI / 2 - 0.05;

export class CameraController {
  constructor(camera, runtime, selectionManager = null) {
    this.camera = camera; // Construct 3 3DCamera object
    this.runtime = runtime;
    this.selectionManager = selectionManager; // Reference to selection manager for 2D selection box

    this.canvas = document.querySelector("canvas");

    // Camera state
    this.position = [0, 0, 400];
    this.target = [100, 100, 0];
    this.up = [0, 0, 1];

    // Movement settings
    this.moveSpeed = 400; // units per second
    this.rotationSpeed = 1; // radians per pixel

    // Camera change callbacks
    this.onCameraChange = null; // Callback function for when camera moves/rotates

    // Input state
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      q: false, // camera-local down
      e: false, // camera-local up
      up: false,
      down: false,
      left: false,
      right: false, // Arrow keys
      shift: false,
      ctrl: false,
      cmd: false,
    };

    // Mouse state
    this.mouseDown = {
      left: false,
      middle: false,
      right: false,
    };
    this.lastMousePos = { x: 0, y: 0 }; // raw — for camera rotation/pan deltas
    this.mouseDelta = { x: 0, y: 0 };
    this.isPointerLocked = false;

    // Selection box state — kept in EXACT UI-layer coordinates (canvas-scale
    // independent), since the box is tested against screen-projected instances.
    this.lastMousePosUI = { x: 0, y: 0 };
    this.leftMouseDownPos = { x: 0, y: 0 }; // Position where left mouse was pressed
    this.selectionBoxMinDragDistance = 5; // Minimum pixels to start box selection

    // Camera rotation (spherical coordinates)
    this.azimuth = 0; // horizontal rotation
    this.elevation = 0; // vertical rotation
    this.distance = 100; // distance from target for orbit mode

    // Camera mode
    this.flyMode = false;
    // Set when fly mode was entered via middle-drag + movement (not Shift+F).
    this.flyEnteredViaDrag = false;
    // True while the visual nav gizmo is being drag-orbited (set by dragOrbit).
    this._gizmoOrbiting = false;
    this.isAxisAligned = false;
    this.middleClickMode = "orbit"; // "orbit": middle=orbit/shift=pan; "pan": reverse
    this.axisAlignedForcesPan = true;

    // Camera target gizmo
    this.showTargetGizmo = true;
    this.targetGizmoColor = "#4A90D9";
    this._targetGizmoIds = null;

    // Track orbit state for smooth transitions
    this.lastOrbitedAroundSelection = false;
    this._orbitPivot = null;
    this.clearEventListeners = null;
    this.setupEventListeners();
    //this.updateCameraFromState();
  }

  resetCamera() {
    this.position = [0, 0, 400];
    this.target = [100, 100, 100];
    this.up = [0, 0, 1];
    this.updateCameraFromState();
  }

  getCameraTransform() {
    return {
      position: [...this.position],
      target: [...this.target],
      up: [...this.up],
      azimuth: this.azimuth,
      elevation: this.elevation,
      distance: this.distance,
      flyMode: this.flyMode,
      isAxisAligned: this.isAxisAligned,
    };
  }

  setCameraTransform(transform) {
    this.position = transform.position || this.position;
    this.target = transform.target || this.target;
    this.up = transform.up || this.up;
    this.azimuth = transform.azimuth || this.azimuth;
    this.elevation = transform.elevation || this.elevation;
    this.distance = transform.distance || this.distance;
    if (transform.flyMode !== undefined) this.flyMode = transform.flyMode;
    if (transform.isAxisAligned !== undefined)
      this.isAxisAligned = transform.isAxisAligned;
    this.updateCameraFromState();
  }

  initCamera() {
    // if up vector is set to Y up, we need to adjust the initial position
    let upVector = this.camera.getUpVector();
    if (upVector[1] === 1) {
      this.resetCamera();
    }
    this.position = this.camera.getCameraPosition();
    this.target = this.camera.getLookPosition();
    this.up = [0, 0, 1];

    this.azimuth = Math.atan2(
      this.target[1] - this.position[1],
      this.target[0] - this.position[0],
    );

    this.elevation = Math.asin(
      (this.target[2] - this.position[2]) /
        Math.sqrt(
          Math.pow(this.target[0] - this.position[0], 2) +
            Math.pow(this.target[1] - this.position[1], 2) +
            Math.pow(this.target[2] - this.position[2], 2),
        ),
    );

    this.distance = Math.sqrt(
      Math.pow(this.target[0] - this.position[0], 2) +
        Math.pow(this.target[1] - this.position[1], 2) +
        Math.pow(this.target[2] - this.position[2], 2),
    );

    this.updateCameraFromState();
    // Gizmos created during init may not render until the first frame
    // completes. Force a re-creation after the first tick.
    requestAnimationFrame(() => {
      if (this._targetGizmoIds) {
        const gm = globalThis._editorScope?.gizmoManager;
        if (gm) gm.clearByTag("camera_target_gizmo");
        this._targetGizmoIds = null;
      }
      this._updateTargetGizmo();
    });
  }

  setupEventListeners() {
    if (this.clearEventListeners) {
      this.clearEventListeners();
    }

    // Store bound functions for cleanup
    this.boundKeyDown = (e) => this.onKeyDown(e);
    this.boundKeyUp = (e) => this.onKeyUp(e);
    this.boundMouseDown = (e) => this.onMouseDown(e);
    this.boundMouseUp = (e) => this.onMouseUp(e);
    this.boundMouseMove = (e) => this.onMouseMove(e);
    this.boundWheel = (e) => this.onWheel(e);
    this.boundPointerLockChange = () => this.onPointerLockChange();
    this.boundPointerLockError = () => this.onPointerLockError();
    this.boundUpdate = () => this.update();
    this.boundWindowBlur = () => this.onWindowBlur();
    this.boundWindowFocus = () => this.onWindowFocus();

    // Keyboard events
    document.addEventListener("keydown", this.boundKeyDown);
    document.addEventListener("keyup", this.boundKeyUp);

    // Mouse events
    document.addEventListener("mousedown", this.boundMouseDown);
    document.addEventListener("mouseup", this.boundMouseUp);
    document.addEventListener("mousemove", this.boundMouseMove);
    document.addEventListener("wheel", this.boundWheel);

    // Window events to handle focus issues
    window.addEventListener("blur", this.boundWindowBlur);
    window.addEventListener("focus", this.boundWindowFocus);

    // Pointer lock events
    document.addEventListener("pointerlockchange", this.boundPointerLockChange);
    document.addEventListener("pointerlockerror", this.boundPointerLockError);

    // Update loop
    this.runtime.addEventListener("tick", this.boundUpdate);

    this.clearEventListeners = () => {
      document.removeEventListener("keydown", this.boundKeyDown);
      document.removeEventListener("keyup", this.boundKeyUp);
      document.removeEventListener("mousedown", this.boundMouseDown);
      document.removeEventListener("mouseup", this.boundMouseUp);
      document.removeEventListener("mousemove", this.boundMouseMove);
      document.removeEventListener("wheel", this.boundWheel);
      document.removeEventListener(
        "pointerlockchange",
        this.boundPointerLockChange,
      );
      document.removeEventListener(
        "pointerlockerror",
        this.boundPointerLockError,
      );
      this.runtime.removeEventListener("tick", this.boundUpdate);
      window.removeEventListener("blur", this.boundWindowBlur);
      window.removeEventListener("focus", this.boundWindowFocus);
    };
  }

  onKeyDown(e) {
    if (!e.metaKey) {
      this.keys.cmd = false; // Treat CMD as pressed if meta key is down
    }
    if (!e.ctrlKey) {
      this.keys.ctrl = false; // Treat CTRL as pressed if control key is down
    }
    if (!e.shiftKey) {
      this.keys.shift = false; // Treat SHIFT as pressed if shift key is down
    }
    switch (e.code) {
      case "KeyW":
        this.keys.w = true;
        break;
      case "KeyA":
        this.keys.a = true;
        break;
      case "KeyS":
        this.keys.s = true;
        break;
      case "KeyD":
        this.keys.d = true;
        break;
      case "KeyQ":
        this.keys.q = true;
        break;
      case "KeyE":
        this.keys.e = true;
        break;
      case "ArrowUp":
        this.keys.up = true;
        break;
      case "ArrowDown":
        this.keys.down = true;
        break;
      case "ArrowLeft":
        this.keys.left = true;
        break;
      case "ArrowRight":
        this.keys.right = true;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        this.keys.shift = true;
        break;
      case "ControlLeft":
      case "ControlRight":
        this.keys.ctrl = true;
        break;
      case "MetaLeft":
      case "MetaRight":
        this.keys.cmd = true;
        break;
      default:
        // Ignore other keys
        return;
    }
  }

  onKeyUp(e) {
    if (!e.metaKey) {
      this.keys.cmd = false; // Treat CMD as pressed if meta key is down
    }
    if (!e.ctrlKey) {
      this.keys.ctrl = false; // Treat CTRL as pressed if control key is down
    }
    if (!e.shiftKey) {
      this.keys.shift = false; // Treat SHIFT as pressed if shift key is down
    }
    switch (e.code) {
      case "KeyW":
        this.keys.w = false;
        break;
      case "KeyA":
        this.keys.a = false;
        break;
      case "KeyS":
        this.keys.s = false;
        break;
      case "KeyD":
        this.keys.d = false;
        break;
      case "KeyQ":
        this.keys.q = false;
        break;
      case "KeyE":
        this.keys.e = false;
        break;
      case "ArrowUp":
        this.keys.up = false;
        break;
      case "ArrowDown":
        this.keys.down = false;
        break;
      case "ArrowLeft":
        this.keys.left = false;
        break;
      case "ArrowRight":
        this.keys.right = false;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        this.keys.shift = false;
        break;
      case "ControlLeft":
      case "ControlRight":
        this.keys.ctrl = false;
        break;
      case "MetaLeft":
      case "MetaRight":
        this.keys.cmd = false;
        // Reset all other keys when CMD is released to prevent stuck keys
        this.resetMovementKeys();
        break;
      default:
        // Ignore other keys
        return;
    }
  }

  // Reset movement keys to prevent stuck keys when modifier keys interfere
  resetMovementKeys() {
    this.keys.w = false;
    this.keys.a = false;
    this.keys.s = false;
    this.keys.d = false;
    this.keys.q = false;
    this.keys.e = false;
    this.keys.up = false;
    this.keys.down = false;
    this.keys.left = false;
    this.keys.right = false;
    this.keys.shift = false;
    this.keys.ctrl = false;
  }

  shouldLockPointer() {
    if (this.flyMode) return true;
    return this.mouseDown.middle;
  }

  onMouseDown(e) {
    if (!this.runtime.layout) return;

    if (this.flyMode) {
      this.exitFlyMode();
      e.preventDefault();
      return;
    }

    const [mouseX, mouseY] = globalThis._editorScope.getMousePosition();
    this.lastMousePos = { x: mouseX, y: mouseY };
    const [uiX, uiY] = globalThis._editorScope.getMousePosition("UI");
    this.lastMousePosUI = { x: uiX, y: uiY };

    switch (e.button) {
      case 0:
        this.mouseDown.left = true;
        this.leftMouseDownPos = { x: uiX, y: uiY };
        break;
      case 1:
        this.mouseDown.middle = true;
        e.preventDefault();
        break;
      case 2:
        this.mouseDown.right = true;
        break;
    }
  }

  onMouseUp(e) {
    if (!this.runtime.layout) return;
    switch (e.button) {
      case 0:
        this.mouseDown.left = false;
        // Handle potential selection box end
        this.handleLeftMouseUp();
        break;
      case 1: // Middle mouse button
        this.mouseDown.middle = false;
        this._orbitPivot = null;
        // Only exit fly if it was entered via middle-drag (not a Shift+F session).
        if (this.flyEnteredViaDrag) {
          this.exitFlyMode();
        }
        e.preventDefault();
        break;
      case 2:
        this.mouseDown.right = false;
        break;
    }
  }

  onMouseMove(e) {
    if (!this.runtime.layout) return;
    const [mouseX, mouseY] = globalThis._editorScope.getMousePosition();

    if (this.isPointerLocked) {
      // Use movement deltas when pointer is locked
      this.mouseDelta.x = e.movementX || 0;
      this.mouseDelta.y = e.movementY || 0;
    } else {
      // Calculate delta from last position
      this.mouseDelta.x = mouseX - this.lastMousePos.x;
      this.mouseDelta.y = mouseY - this.lastMousePos.y;
    }

    this.lastMousePos = { x: mouseX, y: mouseY };

    // Handle selection box updates if left mouse is down and selection manager
    // exists. The box works in EXACT UI-layer coordinates (not the raw deltas
    // used for the camera above), so it stays correct when the canvas is resized.
    if (this.mouseDown.left && this.selectionManager) {
      const [uiX, uiY] = globalThis._editorScope.getMousePosition("UI");
      this.lastMousePosUI = { x: uiX, y: uiY };
      this.handleSelectionBoxUpdate(uiX, uiY);
    }

    // Fly mode: mouse directly steers camera (pointer locked, reversed)
    if (this.flyMode && this.isPointerLocked) {
      this.rotateCamera(-this.mouseDelta.x, -this.mouseDelta.y);
      return;
    }

    // Default mode: middle-click orbit/pan
    if (this.mouseDown.middle) {
      let wantOrbit = false;
      let wantPan = false;

      const modifierHeld = this.keys.cmd || this.keys.ctrl;
      wantOrbit = !modifierHeld;
      wantPan = modifierHeld;

      if (wantOrbit) {
        this.orbitCamera(this.mouseDelta.x, this.mouseDelta.y);
      } else if (wantPan) {
        this.panCamera(this.mouseDelta.x, this.mouseDelta.y);
      }
    }
  }

  onWheel(e) {
    if (this.flyMode) return;

    // While placing, the wheel rotates the object — don't zoom/pan the camera.
    if (globalThis._editorScope?.placingSystem?.placementSystem?.isPlacing) {
      e.preventDefault();
      return;
    }

    if (e.metaKey || e.ctrlKey) {
      this.panCamera(-e.deltaX * 0.5, -e.deltaY * 0.5);
      e.preventDefault();
      return;
    }

    if (e.shiftKey) {
      this.orbitCamera(e.deltaX * 0.5, e.deltaY * 0.5);
      this._orbitPivot = null;
      e.preventDefault();
      return;
    }

    const dx = this.position[0] - this.target[0];
    const dy = this.position[1] - this.target[1];
    const dz = this.position[2] - this.target[2];
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const zoomAmount = -e.deltaY * dist * 0.001;
    const newDist = Math.max(dist - zoomAmount, 1);
    const dirNorm = normalize(subtract(this.position, this.target));
    this.position = add(this.target, scale(dirNorm, newDist));
    this.distance = newDist;

    this.updateCameraFromState();
    e.preventDefault();
  }

  requestPointerLock() {
    if (this.canvas && this.canvas.requestPointerLock) {
      this.canvas.requestPointerLock();
    }
  }

  exitPointerLock() {
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
  }

  onPointerLockChange() {
    this.isPointerLocked = document.pointerLockElement === this.canvas;
    // During a gizmo drag the lock is on the gizmo host, not the canvas, so a
    // non-canvas lock is expected — don't treat it as fly-mode loss.
    if (!this.isPointerLocked && this.flyMode && !this._gizmoOrbiting) {
      this.exitFlyMode();
    }
  }

  onPointerLockError() {
    console.warn("Pointer lock failed");
    this.isPointerLocked = false;
    if (this.flyMode && !this._gizmoOrbiting) {
      this.exitFlyMode();
    }
  }

  enterFlyMode() {
    if (this.flyMode) return;
    this.flyMode = true;

    const offset = subtract(this.target, this.position);
    const fwd = this.getForwardVector();
    const right = this.getRightVector();
    const up = this.getUpVector();
    this._flyEntryTargetLocal = [
      dot(offset, fwd),
      dot(offset, right),
      dot(offset, up),
    ];

    this._flyEntryGizmoVisible = this.showTargetGizmo;
    if (this.showTargetGizmo) {
      this.showTargetGizmo = false;
      this._updateTargetGizmo();
    }

    // The gizmo drag already holds the pointer lock; don't request our own (the
    // canvas) or we'd steal it and double-drive the camera.
    if (!this._gizmoOrbiting) {
      this.requestPointerLock();
    }
    this._showFlyModeIndicator();
  }

  exitFlyMode() {
    if (!this.flyMode) return;
    this.flyMode = false;
    this.flyEnteredViaDrag = false;

    if (this._flyEntryTargetLocal) {
      const [f, r, u] = this._flyEntryTargetLocal;
      const fwd = this.getForwardVector();
      const right = this.getRightVector();
      const up = this.getUpVector();
      this.target = [
        this.position[0] + f * fwd[0] + r * right[0] + u * up[0],
        this.position[1] + f * fwd[1] + r * right[1] + u * up[1],
        this.position[2] + f * fwd[2] + r * right[2] + u * up[2],
      ];
      this._flyEntryTargetLocal = null;
      this._updateTargetGizmo();
    }

    if (this._flyEntryGizmoVisible) {
      this.showTargetGizmo = true;
      this._flyEntryGizmoVisible = null;
      this._updateTargetGizmo();
    }

    if (this.isPointerLocked) {
      this.exitPointerLock();
    }
    this._hideFlyModeIndicator();
  }

  _showFlyModeIndicator() {
    if (this._flyIndicator) return;
    const el = document.createElement("div");
    el.id = "fly-mode-indicator";
    el.textContent = "FLY";
    el.style.cssText = `
      position: fixed;
      top: 48px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 165, 0, 0.9);
      color: #fff;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 13px;
      font-weight: 700;
      padding: 4px 16px;
      border-radius: 0 0 6px 6px;
      z-index: 950;
      pointer-events: none;
      letter-spacing: 2px;
    `;
    document.body.appendChild(el);
    this._flyIndicator = el;
  }

  _hideFlyModeIndicator() {
    if (this._flyIndicator) {
      this._flyIndicator.remove();
      this._flyIndicator = null;
    }
  }

  onWindowBlur() {
    // Reset all keys when window loses focus to prevent stuck keys
    this.resetAllKeys();
  }

  onWindowFocus() {
    // Optional: Could add logic here if needed when window regains focus
  }

  // Reset all input keys to prevent stuck keys
  resetAllKeys() {
    Object.keys(this.keys).forEach((key) => {
      this.keys[key] = false;
    });

    // Also reset mouse states for completeness
    this.mouseDown.left = false;
    this.mouseDown.middle = false;
    this.mouseDown.right = false;
    this._gizmoOrbiting = false;

    if (this.flyMode) {
      this.exitFlyMode();
    } else if (this.isPointerLocked) {
      this.exitPointerLock();
    }
  }

  rotateCamera(deltaX, deltaY) {
    this.isAxisAligned = false;

    const uiViewport = globalThis._editorScope.uiViewport();
    const speedMultiplier = 1.0;

    this.azimuth -=
      (deltaX * this.rotationSpeed * 9 * speedMultiplier) / uiViewport.width;
    this.elevation +=
      (deltaY * this.rotationSpeed * 9 * speedMultiplier) / uiViewport.height;

    this.elevation = Math.max(
      -ELEVATION_LIMIT,
      Math.min(ELEVATION_LIMIT, this.elevation),
    );

    const forward = this.getForwardVector();
    this.target = add(this.position, scale(forward, 100));

    this.updateCameraFromState();
  }

  orbitCamera(deltaX, deltaY) {
    this.isAxisAligned = false;
    this.up = [0, 0, 1];

    // Reuse the pivot cached at the start of this drag so the orbit center
    // doesn't drift frame-to-frame when nothing is selected.
    if (!this._orbitPivot) {
      let pivot;
      try {
        if (this.selectionManager && this.selectionManager.hasSelection()) {
          const bounds = this.selectionManager.calculateSelectionBounds();
          if (bounds && Number.isFinite(bounds.centerX)) {
            pivot = [bounds.centerX, bounds.centerY, bounds.centerZ];
          }
        }
      } catch (_) {
        /* fall through */
      }
      if (!pivot) {
        pivot = [...this.target];
      }
      this._orbitPivot = pivot;
    }
    const pivot = this._orbitPivot;

    const fromCamera = subtract(this.position, pivot);
    const distance = Math.sqrt(
      fromCamera[0] * fromCamera[0] +
        fromCamera[1] * fromCamera[1] +
        fromCamera[2] * fromCamera[2],
    );

    let azimuth = Math.atan2(fromCamera[1], fromCamera[0]);
    let elevation = Math.asin(fromCamera[2] / distance);

    const sensitivity = 0.005;
    azimuth -= deltaX * sensitivity;
    elevation += deltaY * sensitivity;

    elevation = Math.max(
      -ELEVATION_LIMIT,
      Math.min(ELEVATION_LIMIT, elevation),
    );

    const cosElevation = Math.cos(elevation);
    this.position = [
      pivot[0] + distance * Math.cos(azimuth) * cosElevation,
      pivot[1] + distance * Math.sin(azimuth) * cosElevation,
      pivot[2] + distance * Math.sin(elevation),
    ];
    this.target = pivot;
    this._syncAzimuthElevationFromLook();

    this.lastOrbitedAroundSelection = true;
    this.updateCameraFromState();
  }

  panCamera(dx, dy) {
    const right = this.getRightVector();
    const up = this.getUpVector();
    const dist = Math.max(this.distance, 1);
    const panScale = dist * 0.002;
    const offset = add(scale(right, dx * panScale), scale(up, dy * panScale));
    this.position = add(this.position, offset);
    this.target = add(this.target, offset);
    this._orbitPivot = null;
    this.updateCameraFromState();
  }

  update() {
    const dt = this.runtime.dt;

    // Periodic check for stuck keys (every 60 frames / ~1 second)
    if (!this.keyCheckCounter) this.keyCheckCounter = 0;
    this.keyCheckCounter++;
    if (this.keyCheckCounter >= 60) {
      this.keyCheckCounter = 0;
      this.checkForStuckKeys();
    }

    // While a gizmo drag owns the pointer lock (on its host), leave lock
    // management to dragOrbit — otherwise we'd steal the lock onto the canvas,
    // which routes rotation through the slow fly-look path and breaks the
    // gizmo's pointerup (so fly never exits on release).
    if (!this._gizmoOrbiting) {
      if (this.shouldLockPointer()) {
        if (!this.isPointerLocked) {
          this.requestPointerLock();
        }
      } else if (this.isPointerLocked) {
        this.exitPointerLock();
      }
    }
    this.handleMovement(dt);
  }

  // Check for stuck keys by validating against actual keyboard state
  checkForStuckKeys() {
    // On macOS, when CMD is held and other keys are pressed,
    // keyup events might not fire. This is a safeguard.
    if (this.keys.cmd && this.hasMovementInput()) {
      // If CMD is down and movement keys are "pressed",
      // but we're not actually getting movement input consistently,
      // reset movement keys as they're likely stuck
      this.resetMovementKeys();
    }
  }

  handleMovement(dt) {
    if (!this.hasMovementInput() || this.keys.cmd) return;

    // Orbit-drag + movement -> transient fly mode (released on drag end).
    // Triggers for both middle-mouse orbit and visual nav-gizmo drag.
    if ((this.mouseDown.middle || this._gizmoOrbiting) && !this.flyMode) {
      this.flyEnteredViaDrag = true;
      this.enterFlyMode();
    }

    if (this.lastOrbitedAroundSelection) {
      this.syncCameraState();
      this.lastOrbitedAroundSelection = false;
    }

    let speed = this.moveSpeed * dt;
    if (this.keys.shift) speed *= 3;

    const forward = this.getForwardVector();
    let right = normalize(crossProduct(forward, this.up));
    let up = normalize(crossProduct(right, forward));

    // In Z-axis aligned views (top/bottom), the up vector swap to [0,1,0]
    // causes right/up to point opposite to screen-space expectations.
    if (this.isAxisAligned && Math.abs(forward[2]) > 0.9) {
      right = scale(right, -1);
      up = scale(up, -1);
    }

    let movement = [0, 0, 0];

    if (this.keys.w || this.keys.up)
      movement = add(movement, scale(forward, speed));
    if (this.keys.s || this.keys.down)
      movement = add(movement, scale(forward, -speed));
    if (this.keys.a || this.keys.left)
      movement = add(movement, scale(right, speed));
    if (this.keys.d || this.keys.right)
      movement = add(movement, scale(right, -speed));
    if (this.keys.q) movement = add(movement, scale(up, -speed));
    if (this.keys.e) movement = add(movement, scale(up, speed));

    if (movement[0] !== 0 || movement[1] !== 0 || movement[2] !== 0) {
      this.position = add(this.position, movement);
      this.target = add(this.target, movement);
      this.updateCameraFromState();
    }
  }

  hasMovementInput() {
    return (
      this.keys.w ||
      this.keys.a ||
      this.keys.s ||
      this.keys.d ||
      this.keys.q ||
      this.keys.e ||
      this.keys.up ||
      this.keys.down ||
      this.keys.left ||
      this.keys.right
    );
  }

  getForwardVector() {
    // Calculate forward vector from spherical coordinates
    const cosElevation = Math.cos(this.elevation);
    return normalize([
      Math.cos(this.azimuth) * cosElevation,
      Math.sin(this.azimuth) * cosElevation,
      Math.sin(this.elevation),
    ]);
  }

  getRightVector() {
    const forward = this.getForwardVector();
    return normalize(crossProduct(forward, this.up));
  }

  getUpVector() {
    const forward = this.getForwardVector();
    const right = this.getRightVector();
    return normalize(crossProduct(right, forward));
  }

  sphericalToCartesian(radius, azimuth, elevation) {
    const cosElevation = Math.cos(elevation);
    return [
      radius * Math.cos(azimuth) * cosElevation,
      radius * Math.sin(azimuth) * cosElevation,
      radius * Math.sin(elevation),
    ];
  }

  updateCameraFromState() {
    this.camera.lookAtPosition(
      this.position[0],
      this.position[1],
      this.position[2],
      this.target[0],
      this.target[1],
      this.target[2],
      this.up[0],
      this.up[1],
      this.up[2],
    );

    this._updateTargetGizmo();
    this._persistTargetPosition();

    if (this.onCameraChange) {
      this.onCameraChange(this.camera);
    }
  }

  _persistTargetPosition() {
    const ls = globalThis._editorScope?.levelSettings;
    if (!ls?.levelData?.cameraSettings) return;
    ls.levelData.cameraSettings.targetPosition = [...this.target];
  }

  _updateTargetGizmo() {
    const gm = globalThis._editorScope?.gizmoManager;
    if (!gm) return;

    if (!this.showTargetGizmo) {
      if (this._targetGizmoIds) {
        gm.clearByTag("camera_target_gizmo");
        this._targetGizmoIds = null;
      }
      return;
    }

    if (
      this._targetGizmoColor !== this.targetGizmoColor &&
      this._targetGizmoIds
    ) {
      gm.clearByTag("camera_target_gizmo");
      this._targetGizmoIds = null;
    }
    this._targetGizmoColor = this.targetGizmoColor;

    const [tx, ty, tz] = this.target;
    const s = 25;
    const cs = 5;
    const hex = this.targetGizmoColor || "#4A90D9";
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const armColor = [r, g, b, 0.6];
    const white = [1, 1, 1, 0.8];
    const thickness = 1;
    const scaling = {
      enabled: true,
      baseScale: 1.0,
      referenceDistance: 500,
      scaleProperties: { thickness: true },
    };
    const tag = ["camera_target_gizmo"];
    const makeLine = (x2, y2, z2, color, thickMul = 1) => ({
      x1: tx,
      y1: ty,
      z1: tz,
      x2,
      y2,
      z2,
      color,
      thickness: thickness * thickMul,
    });

    if (!this._targetGizmoIds) {
      this._targetGizmoIds = [
        gm.createGizmo(
          "line3D",
          makeLine(tx + s, ty, tz, armColor),
          tag,
          false,
          "Gizmos",
          scaling,
        ),
        gm.createGizmo(
          "line3D",
          makeLine(tx - s, ty, tz, armColor),
          tag,
          false,
          "Gizmos",
          scaling,
        ),
        gm.createGizmo(
          "line3D",
          makeLine(tx, ty + s, tz, armColor),
          tag,
          false,
          "Gizmos",
          scaling,
        ),
        gm.createGizmo(
          "line3D",
          makeLine(tx, ty - s, tz, armColor),
          tag,
          false,
          "Gizmos",
          scaling,
        ),
        gm.createGizmo(
          "line3D",
          makeLine(tx, ty, tz + s, armColor),
          tag,
          false,
          "Gizmos",
          scaling,
        ),
        gm.createGizmo(
          "line3D",
          makeLine(tx, ty, tz - s, armColor),
          tag,
          false,
          "Gizmos",
          scaling,
        ),
        gm.createGizmo(
          "line3D",
          makeLine(tx + cs, ty, tz, white, 2),
          tag,
          false,
          "Gizmos",
          scaling,
        ),
        gm.createGizmo(
          "line3D",
          makeLine(tx - cs, ty, tz, white, 2),
          tag,
          false,
          "Gizmos",
          scaling,
        ),
        gm.createGizmo(
          "line3D",
          makeLine(tx, ty + cs, tz, white, 2),
          tag,
          false,
          "Gizmos",
          scaling,
        ),
        gm.createGizmo(
          "line3D",
          makeLine(tx, ty - cs, tz, white, 2),
          tag,
          false,
          "Gizmos",
          scaling,
        ),
        gm.createGizmo(
          "line3D",
          makeLine(tx, ty, tz + cs, white, 2),
          tag,
          false,
          "Gizmos",
          scaling,
        ),
        gm.createGizmo(
          "line3D",
          makeLine(tx, ty, tz - cs, white, 2),
          tag,
          false,
          "Gizmos",
          scaling,
        ),
      ];
    } else {
      const ends = [
        [tx + s, ty, tz, armColor],
        [tx - s, ty, tz, armColor],
        [tx, ty + s, tz, armColor],
        [tx, ty - s, tz, armColor],
        [tx, ty, tz + s, armColor],
        [tx, ty, tz - s, armColor],
        [tx + cs, ty, tz, white, 2],
        [tx - cs, ty, tz, white, 2],
        [tx, ty + cs, tz, white, 2],
        [tx, ty - cs, tz, white, 2],
        [tx, ty, tz + cs, white, 2],
        [tx, ty, tz - cs, white, 2],
      ];
      for (let i = 0; i < ends.length; i++) {
        gm.updateGizmo(this._targetGizmoIds[i], makeLine(...ends[i]));
      }
    }
  }

  // Synchronize internal camera state with current position and target
  syncCameraState() {
    const direction = subtract(this.target, this.position);
    const distance = Math.sqrt(
      direction[0] * direction[0] +
        direction[1] * direction[1] +
        direction[2] * direction[2],
    );

    if (distance > 0.001) {
      this.azimuth = Math.atan2(direction[1], direction[0]);
      this.elevation = Math.asin(direction[2] / distance);
      this.distance = distance;
    }
  }

  // Set callback for camera changes
  setCameraChangeCallback(callback) {
    this.onCameraChange = callback;
  }

  setTarget(x, y, z) {
    this.target = [x, y, z];
    this.updateCameraFromState();
  }

  setPosition(x, y, z) {
    this.position = [x, y, z];
    const forward = this.getForwardVector();
    this.target = add(this.position, scale(forward, 100));
    this.updateCameraFromState();
  }

  setMoveSpeed(speed) {
    this.moveSpeed = speed;
  }

  setRotationSpeed(speed) {
    this.rotationSpeed = speed;
  }

  // ------------------------------------------------------------------
  // setView(axis, opts)
  // ------------------------------------------------------------------
  // Blender-style axis snapping. `axis` is one of:
  //   "+x" / "-x"  → look along the X axis (left/right side view)
  //   "+y" / "-y"  → look along the Y axis (front/back view)
  //   "+z" / "-z"  → look along the Z axis (top/bottom view)
  //
  // The framing target is the selection center (if any selection exists),
  // otherwise the current `this.target`. The framing distance reuses the
  // current camera-to-target distance so repeated taps don't zoom in/out.
  //
  // Switches camera to "fly" mode after the move so WASD continues to work
  // naturally from the new vantage. Pass `{animate: true}` for a short
  // ease-out tween (~250ms) driven off the runtime tick listener.
  //
  // World is Z-up: top view places camera above target with up = +Y so the
  // user sees a conventional plan view (Y points away on screen).
  setView(axis, opts = {}) {
    const animate = opts.animate !== false; // default true
    const duration = typeof opts.duration === "number" ? opts.duration : 0.25; // seconds

    // Resolve framing target: selection center if available, else current target.
    let framingTarget = [...this.target];
    if (this.selectionManager && this.selectionManager.hasSelection()) {
      const bounds = this.selectionManager.calculateSelectionBounds();
      if (bounds) {
        framingTarget = [bounds.centerX, bounds.centerY, bounds.centerZ];
      }
    }

    // Reuse current distance so the user doesn't lose their zoom level.
    // Measure from the current camera position to the framing target
    // (selection center if any, else current target). Using the old
    // target distance would cause the camera to drift toward/away from
    // the selection on each axis snap.
    const currentDist = Math.sqrt(
      Math.pow(this.position[0] - framingTarget[0], 2) +
        Math.pow(this.position[1] - framingTarget[1], 2) +
        Math.pow(this.position[2] - framingTarget[2], 2),
    );
    const dist = Math.max(currentDist, 1);

    // Map axis → (offset direction from target, up vector).
    // The camera sits at target + (dir * dist) and looks back at target,
    // so `dir` points FROM target TO camera (i.e. the "look-from" side).
    let dir, up;
    switch (axis) {
      case "+x":
        dir = [1, 0, 0];
        up = [0, 0, 1];
        break; // looking toward -X
      case "-x":
        dir = [-1, 0, 0];
        up = [0, 0, 1];
        break;
      case "+y":
        dir = [0, 1, 0];
        up = [0, 0, 1];
        break; // looking toward -Y (front)
      case "-y":
        dir = [0, -1, 0];
        up = [0, 0, 1];
        break;
      case "+z":
        dir = [0, 0, 1];
        up = [0, 1, 0];
        break; // top view: Y points "up" on screen
      case "-z":
        dir = [0, 0, -1];
        up = [0, 1, 0];
        break; // bottom view
      default:
        console.warn("[CameraController] setView: unknown axis", axis);
        return;
    }

    const targetPos = [
      framingTarget[0] + dir[0] * dist,
      framingTarget[1] + dir[1] * dist,
      framingTarget[2] + dir[2] * dist,
    ];

    this.isAxisAligned = true;

    // Cancel any in-flight setView animation.
    if (this._setViewAnim) {
      this.runtime.removeEventListener("tick", this._setViewAnim);
      this._setViewAnim = null;
    }

    if (!animate) {
      this.position = targetPos;
      this.target = [...framingTarget];
      this.up = [...up];
      this._syncAzimuthElevationFromLook();
      this.syncCameraState();
      this.updateCameraFromState();
      return;
    }

    // Animate position + target with ease-out cubic. Up vector snaps
    // immediately because interpolating across non-collinear ups produces
    // unstable lookAt results (and the visual jolt is negligible mid-tween).
    const startPos = [...this.position];
    const startTarget = [...this.target];
    this.up = [...up];

    let elapsed = 0;
    const tickFn = () => {
      elapsed += this.runtime.dt;
      let t = Math.min(1, elapsed / duration);
      // Ease-out cubic.
      const e = 1 - Math.pow(1 - t, 3);
      this.position = [
        startPos[0] + (targetPos[0] - startPos[0]) * e,
        startPos[1] + (targetPos[1] - startPos[1]) * e,
        startPos[2] + (targetPos[2] - startPos[2]) * e,
      ];
      this.target = [
        startTarget[0] + (framingTarget[0] - startTarget[0]) * e,
        startTarget[1] + (framingTarget[1] - startTarget[1]) * e,
        startTarget[2] + (framingTarget[2] - startTarget[2]) * e,
      ];
      // Keep azimuth/elevation in sync with the actual look direction.
      // Without this, getForwardVector/Right/Up return stale values based
      // on the pre-snap spherical state, so anything reading them (e.g.
      // the nav gizmo's projection, subsequent fly-mode WASD movement)
      // breaks until the next manual orbit. Doing it inside the tween
      // keeps the gizmo continuously animated alongside the camera.
      this._syncAzimuthElevationFromLook();
      this.updateCameraFromState();
      if (t >= 1) {
        this.runtime.removeEventListener("tick", tickFn);
        this._setViewAnim = null;
        this.syncCameraState();
      }
    };
    this._setViewAnim = tickFn;
    this.runtime.addEventListener("tick", tickFn);
  }

  focusOnSelection() {
    if (!this.selectionManager || !this.selectionManager.hasSelection()) return;

    const bounds = this.selectionManager.calculateSelectionBounds();
    if (!bounds) return;

    const center = [bounds.centerX, bounds.centerY, bounds.centerZ];
    const rx = bounds.width / 2;
    const ry = bounds.height / 2;
    const rz = bounds.depth / 2;
    const radius = Math.sqrt(rx * rx + ry * ry + rz * rz);

    const fov = this.camera.fieldOfView || Math.PI / 3;
    const frameDist = Math.max((radius / Math.tan(fov / 2)) * 1.2, 10);

    const forward = this.getForwardVector();
    const targetPos = [
      center[0] - forward[0] * frameDist,
      center[1] - forward[1] * frameDist,
      center[2] - forward[2] * frameDist,
    ];

    if (this._setViewAnim) {
      this.runtime.removeEventListener("tick", this._setViewAnim);
      this._setViewAnim = null;
    }

    const duration = 0.25;
    const startPos = [...this.position];
    const startTarget = [...this.target];

    let elapsed = 0;
    const tickFn = () => {
      elapsed += this.runtime.dt;
      let t = Math.min(1, elapsed / duration);
      const e = 1 - Math.pow(1 - t, 3);
      this.position = [
        startPos[0] + (targetPos[0] - startPos[0]) * e,
        startPos[1] + (targetPos[1] - startPos[1]) * e,
        startPos[2] + (targetPos[2] - startPos[2]) * e,
      ];
      this.target = [
        startTarget[0] + (center[0] - startTarget[0]) * e,
        startTarget[1] + (center[1] - startTarget[1]) * e,
        startTarget[2] + (center[2] - startTarget[2]) * e,
      ];
      this._syncAzimuthElevationFromLook();
      this.updateCameraFromState();
      if (t >= 1) {
        this.runtime.removeEventListener("tick", tickFn);
        this._setViewAnim = null;
        this.syncCameraState();
      }
    };
    this._setViewAnim = tickFn;
    this.runtime.addEventListener("tick", tickFn);
  }

  // Recompute spherical (azimuth/elevation) from the current
  // position→target look direction. Used after setView snaps the camera
  // by writing position/target directly (which leaves azimuth/elevation
  // out of sync). Z-up convention: azimuth is rotation around Z,
  // elevation is the look pitch.
  _syncAzimuthElevationFromLook() {
    const fx = this.target[0] - this.position[0];
    const fy = this.target[1] - this.position[1];
    const fz = this.target[2] - this.position[2];
    const len = Math.sqrt(fx * fx + fy * fy + fz * fz);
    if (len < 1e-6) return;
    const ux = fx / len;
    const uy = fy / len;
    const uz = fz / len;
    this.azimuth = Math.atan2(uy, ux);
    // Clamp to the same range rotateCamera uses to avoid pole-flip on
    // straight-up / straight-down views.
    this.elevation = Math.max(
      -ELEVATION_LIMIT,
      Math.min(ELEVATION_LIMIT, Math.asin(uz)),
    );
  }

  // Get current camera state
  getPosition() {
    return [...this.position];
  }

  getTarget() {
    return [...this.target];
  }

  getUp() {
    return [...this.up];
  }

  // Selection box handling methods
  handleLeftMouseUp() {
    if (!this.selectionManager) return;

    // Both corners are in UI-layer space (leftMouseDownPos + lastMousePosUI).
    const currentMousePos = this.lastMousePosUI;
    const dragDistance = Math.sqrt(
      Math.pow(currentMousePos.x - this.leftMouseDownPos.x, 2) +
        Math.pow(currentMousePos.y - this.leftMouseDownPos.y, 2),
    );

    // Check if this was a selection box drag (dragged more than minimum distance)
    if (dragDistance > this.selectionBoxMinDragDistance) {
      // Selection box was already handled in handleSelectionBoxUpdate
      // Just ensure it ends properly
      this.selectionManager.endSelectionBox(this.camera);
    } else {
      // This was a click, not a drag - handle normal click selection
      // Only if not over a gizmo and selection manager supports it
      if (!this.selectionManager.isGizmoInteractionActive()) {
        // You can add click selection logic here if needed
        // For now, just end any active selection box
        if (this.selectionManager.isSelectionBoxActive) {
          this.selectionManager.endSelectionBox(this.camera);
        }
      }
    }
  }

  handleSelectionBoxUpdate(mouseX, mouseY) {
    if (!this.selectionManager) return;

    const dragDistance = Math.sqrt(
      Math.pow(mouseX - this.leftMouseDownPos.x, 2) +
        Math.pow(mouseY - this.leftMouseDownPos.y, 2),
    );

    // Start selection box if we've dragged enough and it's not already active
    if (
      dragDistance > this.selectionBoxMinDragDistance &&
      !this.selectionManager.isSelectionBoxActive &&
      !this.selectionManager.isGizmoInteractionActive()
    ) {
      this.selectionManager.startSelectionBox(
        this.leftMouseDownPos.x,
        this.leftMouseDownPos.y,
      );
    }

    // Update selection box if it's active
    if (this.selectionManager.isSelectionBoxActive) {
      this.selectionManager.updateSelectionBox(
        mouseX,
        mouseY,
        this.mouseDown.left,
        this.camera,
      );
    }
  }

  // Cleanup
  destroy() {
    this._hideFlyModeIndicator();
    if (this._targetGizmoIds) {
      const gm = globalThis._editorScope?.gizmoManager;
      if (gm) gm.clearByTag("camera_target_gizmo");
      this._targetGizmoIds = null;
    }
    if (this.isPointerLocked) {
      this.exitPointerLock();
    }
    if (this._setViewAnim) {
      this.runtime.removeEventListener("tick", this._setViewAnim);
      this._setViewAnim = null;
    }
    // Clear all event listeners
    if (this.clearEventListeners) {
      this.clearEventListeners();
    }
    this.clearEventListeners = null;
  }
}
