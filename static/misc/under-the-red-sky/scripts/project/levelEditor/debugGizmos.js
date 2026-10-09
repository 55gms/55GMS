import { instanceToTriList } from "./triangles.js";
import { getRayIntersectionReflectAndNormal } from "./raycast.js";
// Create a temporary debug line
export function createDebugLine(
  x1,
  y1,
  z1,
  x2,
  y2,
  z2,
  layer = null,
  color = [1, 1, 1, 1],
  fadeIn = 0,
  stay = 100,
  fadeOut = 200,
  thickness = 6,
) {
  const lineId = globalThis._editorScope.gizmoManager.createGizmo(
    "line3D",
    {
      x1,
      y1,
      z1,
      x2,
      y2,
      z2,
      color,
      thickness,
    },
    ["debug", "temporary"],
    false,
    layer
  );

  // Handle fade animations
  const totalDuration = fadeIn + stay + fadeOut;
  const startTime = Date.now();

  const animateOpacity = () => {
    const elapsed = Date.now() - startTime;
    
    if (elapsed >= totalDuration) {
      // Animation complete, remove the line
      globalThis._editorScope.gizmoManager.deleteGizmo(lineId);
      return;
    }

    let opacity = 1;

    if (elapsed < fadeIn) {
      // Fade in phase
      opacity = elapsed / fadeIn;
    } else if (elapsed < fadeIn + stay) {
      // Stay phase
      opacity = 1;
    } else {
      // Fade out phase
      const fadeOutElapsed = elapsed - (fadeIn + stay);
      opacity = 1 - (fadeOutElapsed / fadeOut);
    }

    // Update the gizmo's color with new opacity
    globalThis._editorScope.gizmoManager.updateGizmo(lineId, {
      color: [color[0], color[1], color[2], 1],
      thickness: opacity * thickness
    });

    requestAnimationFrame(animateOpacity);
  };

  // Start animation if there's any duration specified
  if (totalDuration > 0) {
    requestAnimationFrame(animateOpacity);
  }

  return lineId;
}

// Create a persistent arrow pointing from one object to another
export function createArrowBetween(
  x1,
  y1,
  z1,
  x2,
  y2,
  z2,
  color = [0, 1, 0, 1],
  tags = ["arrow"],
  layer = null
) {
  return globalThis._editorScope.gizmoManager.createGizmo(
    "arrow3D",
    {
      x1,
      y1,
      z1,
      x2,
      y2,
      z2,
      color,
    },
    tags,
    false,
    layer
  );
}

// Create a 3D box at world position
export function create3DBox(
  x,
  y,
  z,
  size = 50,
  filled = true,
  color = [1, 1, 1, 1],
  tags = ["3d"],
  layer = null
) {
  return globalThis._editorScope.gizmoManager.createGizmo(
    "box3D",
    {
      x,
      y,
      z,
      width: size,
      height: size,
      depth: size,
      filled,
      color,
    },
    tags,
    false,
    layer
  );
}

// Clear all debug gizmos
export function clearDebugGizmos() {
  globalThis._editorScope.gizmoManager.clearByTag("debug");
}

// Toggle visibility of a tag group
export function toggleGizmosByTag(tag) {
  const gizmos = globalThis._editorScope.gizmoManager.getGizmosByTag(tag);
  gizmos.forEach((gizmo) => {
    globalThis._editorScope.gizmoManager.setGizmoVisible(
      gizmo.id,
      !gizmo.visible
    );
  });
}

// Toggle visibility of gizmos by layer
export function toggleGizmosByLayer(layerName) {
  const gizmos =
    globalThis._editorScope.gizmoManager.getGizmosByLayer(layerName);
  gizmos.forEach((gizmo) => {
    globalThis._editorScope.gizmoManager.setGizmoVisible(
      gizmo.id,
      !gizmo.visible
    );
  });
}

// Clear gizmos by layer
export function clearGizmosByLayer(layerName) {
  globalThis._editorScope.gizmoManager.clearByLayer(layerName);
}

export function deleteDebugGizmoIds(gizmoIds) {
  gizmoIds.forEach((id) => {
    globalThis._editorScope.gizmoManager.deleteGizmo(id);
  });
}

export function updateDebugGizmoForInstanceTris(instance, gizmoIds) {
  const triangles = instanceToTriList(instance);
  triangles.forEach((triangle, index) => {
    const [p1, p2, p3] = triangle.map((p) => ({
      x: p.x,
      y: p.y,
      z: p.zElevation,
    }));
    globalThis._editorScope.gizmoManager.updateGizmo(gizmoIds[index], {
      x1: p1.x,
      y1: p1.y,
      z1: p1.z,
      x2: p2.x,
      y2: p2.y,
      z2: p2.z,
      x3: p3.x,
      y3: p3.y,
      z3: p3.z,
    });
  });
}

export function createDebugGizmoForInstanceTris(instance, layer = null) {
  const triangles = instanceToTriList(instance);
  const gizmoIds = [];
  triangles.forEach((triangle) => {
    const [p1, p2, p3] = triangle.map((p) => ({
      x: p.x,
      y: p.y,
      z: p.zElevation,
    }));
    const gizmoId = globalThis._editorScope.gizmoManager.createGizmo(
      "triangle3D",
      {
        x1: p1.x,
        y1: p1.y,
        z1: p1.z,
        x2: p2.x,
        y2: p2.y,
        z2: p2.z,
        x3: p3.x,
        y3: p3.y,
        z3: p3.z,
        lineWidth: 0.7,
        color: [0, 0, 1, 1],
        filled: false,
      },
      ["debug"],
      false,
      layer
    );
    gizmoIds.push(gizmoId);
  });
  return gizmoIds;
}

export function drawDebugRayIntersection(
  intersection,
  rayOrigin,
  rayDirection
) {
  if (!intersection) return;

  // draw intersection points, normals and reflected rays
  const gizmoIds = [];
  intersection.points.forEach((point, index) => {
    const intersectionPoint = point;
    const triangle = intersection.triangles[index];

    // Draw intersection point
    gizmoIds.push(
      create3DBox(
        intersectionPoint[0],
        intersectionPoint[1],
        intersectionPoint[2],
        5,
        true,
        [0, 0, 0, 1],
        ["intersection"]
      )
    );

    // Get normal and reflected ray
    const { normal, reflectedDirection } = getRayIntersectionReflectAndNormal(
      triangle,
      rayDirection
    );

    // Draw normal vector
    gizmoIds.push(
      createArrowBetween(
        intersectionPoint[0],
        intersectionPoint[1],
        intersectionPoint[2],
        intersectionPoint[0] + normal[0] * 20,
        intersectionPoint[1] + normal[1] * 20,
        intersectionPoint[2] + normal[2] * 20,
        [0, 1, 1, 1]
      )
    );
    // // Draw reflected ray
    gizmoIds.push(
      createArrowBetween(
        intersectionPoint[0],
        intersectionPoint[1],
        intersectionPoint[2],
        intersectionPoint[0] + reflectedDirection[0] * 20,
        intersectionPoint[1] + reflectedDirection[1] * 20,
        intersectionPoint[2] + reflectedDirection[2] * 20,
        [0, 0.5, 1, 1]
      )
    );
  });

  return gizmoIds;
}
