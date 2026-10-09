// dragOrbit
// ----------
// Shared pointer-drag → camera-orbit binding used by every nav gizmo impl.
// Attach to any DOM element (typically the gizmo's host div). On
// pointerdown it captures the pointer and translates subsequent
// pointermoves into changes to cameraController.azimuth/elevation. The
// orbit pivots around `cameraController.target` so the framing stays put
// while the camera arcs around it (Blender-style).
//
// Why a separate helper: each impl renders differently (SVG / canvas /
// CSS-3D), but they all benefit from the exact same orbit behaviour. Keeping
// it here means the impls focus on rendering only.
//
// Behaviour notes:
//  - We capture the pointer on the host so quick moves outside the gizmo
//    keep dragging until release.
//  - A small dead-zone (3px) prevents accidental orbits when the user
//    actually meant to click an axis. Below the dead-zone the eventual
//    pointerup is treated as a click and bubbles through.
//  - Stops propagation on the events we own so the cameraController's
//    document-level handlers don't double-rotate.
//  - Works in both `fly` and `orbit` camera modes by computing the new
//    position from spherical coords around `target` and writing both
//    `position` and `target` back, mirroring orbitAroundSelection.

const DRAG_DEADZONE_PX = 3;

export function attachDragOrbit(host, getCameraController) {
  let pointerId = null;
  let downX = 0;
  let downY = 0;
  let lastX = 0;
  let lastY = 0;
  let dragStarted = false;

  function onPointerDown(e) {
    // Left button only; let middle/right pass through to the editor.
    if (e.button !== 0) return;
    pointerId = e.pointerId;
    downX = lastX = e.clientX;
    downY = lastY = e.clientY;
    dragStarted = false;
    // Don't stopPropagation here — child click handlers (axis caps, cube
    // faces) need the pointerdown→pointerup→click sequence to dispatch
    // cleanly to the deepest target. The wrapper's root-level
    // mousedown/pointerdown listeners handle blocking propagation
    // upward to the editor's document-level handlers; that runs LAST in
    // bubble order so it doesn't interfere with child handlers.
    //
    // Pointer capture and pointer lock are also deferred until the
    // dead-zone is crossed (see onPointerMove): both would re-route the
    // synthesised click to the host element, hiding it from the cap.
  }

  function onPointerMove(e) {
    if (pointerId === null || e.pointerId !== pointerId) return;

    if (!dragStarted) {
      const totalDx = e.clientX - downX;
      const totalDy = e.clientY - downY;
      if (
        totalDx * totalDx + totalDy * totalDy <
        DRAG_DEADZONE_PX * DRAG_DEADZONE_PX
      ) {
        // Below dead-zone — don't swallow yet so a tap still works.
        return;
      }
      dragStarted = true;
      host.style.cursor = "grabbing";
      const cc = getCameraController();
      if (cc) cc._gizmoOrbiting = true;
      try {
        host.setPointerCapture(pointerId);
      } catch (_) {}
      try {
        host.requestPointerLock();
      } catch (_) {}
    }

    const dx =
      typeof e.movementX === "number" ? e.movementX : e.clientX - lastX;
    const dy =
      typeof e.movementY === "number" ? e.movementY : e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    const cc = getCameraController();
    if (!cc) return;
    // In fly mode the gizmo drag steers free-look like the rest of fly mode;
    // otherwise it orbits around the target.
    if (cc.flyMode) {
      cc.rotateCamera(-dx, -dy);
    } else {
      cc.orbitCamera(-dx * 2, dy * 2);
    }
    e.stopPropagation();
    e.preventDefault();
  }

  function onPointerUp(e) {
    if (pointerId === null || e.pointerId !== pointerId) return;
    if (dragStarted) {
      try {
        host.releasePointerCapture(pointerId);
      } catch (_) {}
      // Release pointer lock if we acquired it. exitPointerLock is on
      // document, not the element. Guard in case lock was never granted.
      try {
        if (document.pointerLockElement === host) document.exitPointerLock();
      } catch (_) {}
    }
    pointerId = null;
    const cc = getCameraController();
    if (cc) {
      cc._orbitPivot = null;
      cc._gizmoOrbiting = false;
      // End a fly session that this drag started (mirrors middle-button release).
      if (cc.flyEnteredViaDrag) cc.exitFlyMode();
    }
    host.style.cursor = "";
    e.stopPropagation();
    if (dragStarted) {
      // Swallow the click that would otherwise fire after pointerup so the
      // axis under the cursor doesn't snap-to-view at the end of a drag.
      // We use { once: true, capture: true } so we catch the click before
      // any axis listeners do, then drop the listener.
      const swallowClick = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
      host.addEventListener("click", swallowClick, {
        once: true,
        capture: true,
      });
      setTimeout(
        () =>
          host.removeEventListener("click", swallowClick, { capture: true }),
        200,
      );
    }
    dragStarted = false;
  }

  function onPointerCancel(e) {
    if (pointerId === null || e.pointerId !== pointerId) return;
    if (dragStarted) {
      try {
        host.releasePointerCapture(pointerId);
      } catch (_) {}
      try {
        if (document.pointerLockElement === host) document.exitPointerLock();
      } catch (_) {}
    }
    pointerId = null;
    dragStarted = false;
    const cc = getCameraController();
    if (cc) {
      cc._gizmoOrbiting = false;
      if (cc.flyEnteredViaDrag) cc.exitFlyMode();
    }
    host.style.cursor = "";
  }

  host.addEventListener("pointerdown", onPointerDown);
  // Listen on host (capture is automatic with setPointerCapture).
  host.addEventListener("pointermove", onPointerMove);
  host.addEventListener("pointerup", onPointerUp);
  host.addEventListener("pointercancel", onPointerCancel);

  // Return a teardown so impls can call this in destroy().
  return function detach() {
    host.removeEventListener("pointerdown", onPointerDown);
    host.removeEventListener("pointermove", onPointerMove);
    host.removeEventListener("pointerup", onPointerUp);
    host.removeEventListener("pointercancel", onPointerCancel);
  };
}
