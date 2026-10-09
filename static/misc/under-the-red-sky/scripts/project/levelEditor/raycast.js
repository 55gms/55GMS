import { crossProduct, normalize, dot, subtract } from "./vector.js";
import { instanceToTriList } from "./triangles.js";
import { PICK_MAX_DISTANCE } from "./globalValues.js";

export function screenToWorldDirect(
  screenX,
  screenY,
  screenWidth,
  screenHeight,
  cameraPos,
  forward,
  correctedUp,
  fovRadians,
  distance
) {
  const normalizedRay = screenToWorldRay(
    screenX,
    screenY,
    screenWidth,
    screenHeight,
    forward,
    correctedUp,
    fovRadians
  );

  return [
    cameraPos[0] + normalizedRay[0] * distance,
    cameraPos[1] + normalizedRay[1] * distance,
    cameraPos[2] + normalizedRay[2] * distance,
  ];
}

export function worldToScreenDirect(
  worldX,
  worldY,
  worldZ,
  cameraPos,
  forward,
  correctedUp,
  fovRadians,
  screenWidth,
  screenHeight
) {
  // Step 1: Transform world point to camera space
  const worldPoint = [worldX, worldY, worldZ];
  const relativePoint = [
    worldPoint[0] - cameraPos[0],
    worldPoint[1] - cameraPos[1],
    worldPoint[2] - cameraPos[2],
  ];

  // Create camera coordinate system
  // Normalize the input vectors to ensure they're unit vectors
  const forwardNorm = normalize(forward);
  const upNorm = normalize(correctedUp);

  // Calculate right vector (cross product of forward and up)
  const right = normalize(crossProduct(forwardNorm, upNorm));

  // Transform point to camera space
  // Camera space: right=X, up=Y, forward=Z
  const cameraX = dot(relativePoint, right);
  const cameraY = dot(relativePoint, upNorm);
  const cameraZ = dot(relativePoint, forwardNorm);

  // Step 2: Check if point is behind camera
  if (cameraZ <= 0) {
    // Point is behind the camera, cannot project
    return null;
  }

  // Step 3: Apply perspective projection
  const aspectRatio = screenWidth / screenHeight;
  const tanHalfFov = Math.tan(fovRadians / 2);

  // Project to normalized device coordinates (-1 to 1)
  const ndcX = cameraX / (cameraZ * tanHalfFov * aspectRatio);
  const ndcY = cameraY / (cameraZ * tanHalfFov);

  // Step 4: Convert to screen coordinates (0 to width/height)
  const screenX = (1 - ndcX) * 0.5 * screenWidth;
  const screenY = (1 - ndcY) * 0.5 * screenHeight; // Flip Y axis for screen coordinates

  return {
    x: screenX,
    y: screenY,
    depth: cameraZ,
  };
}

export function screenToWorldRay(
  screenX,
  screenY,
  screenWidth,
  screenHeight,
  forward,
  correctedUp,
  fovRadians
) {
  // Calculate the right vector (cross product)
  forward = normalize(forward);
  correctedUp = normalize(correctedUp);
  const right = normalize(crossProduct(forward, correctedUp));

  // Convert screen coordinates to normalized coordinates (-1 to 1)
  const normalizedX = 1.0 - (screenX / screenWidth) * 2.0;
  const normalizedY = 1.0 - (screenY / screenHeight) * 2.0;

  // Calculate the FOV scaling
  const aspect = screenWidth / screenHeight;
  const halfHeight = Math.tan(fovRadians / 2.0);
  const halfWidth = halfHeight * aspect;

  // Scale the normalized coordinates by the FOV
  const worldX = normalizedX * halfWidth;
  const worldY = normalizedY * halfHeight;

  // Build the ray direction in world space
  const rayDirection = [
    right[0] * worldX + correctedUp[0] * worldY + forward[0],
    right[1] * worldX + correctedUp[1] * worldY + forward[1],
    right[2] * worldX + correctedUp[2] * worldY + forward[2],
  ];

  // Normalize the ray direction
  return normalize(rayDirection);
}

export function lineIntersectsBox(
  x1,
  y1,
  z1,
  x2,
  y2,
  z2,
  boxLeft,
  boxTop,
  boxBottom,
  boxRight,
  boxMinZ,
  boxMaxZ
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;

  let tMin = 0;
  let tMax = 1;

  // Check X axis
  if (Math.abs(dx) < 1e-10) {
    // Line is parallel to YZ plane
    if (x1 < boxLeft || x1 > boxRight) return false;
  } else {
    const t1 = (boxLeft - x1) / dx;
    const t2 = (boxRight - x1) / dx;
    tMin = Math.max(tMin, Math.min(t1, t2));
    tMax = Math.min(tMax, Math.max(t1, t2));
  }

  // Check Y axis
  if (Math.abs(dy) < 1e-10) {
    // Line is parallel to XZ plane
    if (y1 < boxTop || y1 > boxBottom) return false;
  } else {
    const t1 = (boxTop - y1) / dy;
    const t2 = (boxBottom - y1) / dy;
    tMin = Math.max(tMin, Math.min(t1, t2));
    tMax = Math.min(tMax, Math.max(t1, t2));
  }

  // Check Z axis
  if (Math.abs(dz) < 1e-10) {
    // Line is parallel to XY plane
    if (z1 < boxMinZ || z1 > boxMaxZ) return false;
  } else {
    const t1 = (boxMinZ - z1) / dz;
    const t2 = (boxMaxZ - z1) / dz;
    tMin = Math.max(tMin, Math.min(t1, t2));
    tMax = Math.min(tMax, Math.max(t1, t2));
  }

  return tMin <= tMax;
}

export function getTrianglesBoundingBox(triangles) {
  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;

  triangles.forEach((triangle) => {
    triangle.forEach((point) => {
      if (point.x < minX) minX = point.x;
      if (point.y < minY) minY = point.y;
      if (point.zElevation < minZ) minZ = point.zElevation;
      if (point.x > maxX) maxX = point.x;
      if (point.y > maxY) maxY = point.y;
      if (point.zElevation > maxZ) maxZ = point.zElevation;
    });
  });

  return {
    left: minX,
    top: minY,
    bottom: maxY,
    right: maxX,
    minZ: minZ,
    maxZ: maxZ,
  };
}

export function getObjectBounds(instance) {
  // globalThis.sdk_runtime (not _editorScope, which is cleared at play time) so
  // this works both in the editor and during play. editorMain.js sets
  // _editorScope.sdk_runtime = globalThis.sdk_runtime, so they're identical.
  const sdkInst = globalThis.sdk_runtime.GetInstanceByUID(instance.uid)._sdkInst;
  const [minX, minY, minZ] = sdkInst.xMinBB;
  const [maxX, maxY, maxZ] = sdkInst.xMaxBB;
  return {
    left: minX,
    top: minY,
    bottom: maxY,
    right: maxX,
    minZ: minZ,
    maxZ: maxZ,
  };
}

export function getInstanceBounds(instance) {
  if (!instance.getBoundingBox) {
    return getTrianglesBoundingBox(instanceToTriList(instance));
  }
  // fix for mesh bounding box that is broken for some reason
  if (instance.getMeshSize && instance.getMeshSize()[0] !== 0) {
    return getTrianglesBoundingBox(instanceToTriList(instance));
  }
  if (instance instanceof self.I3DObjectInstance) {
    return getObjectBounds(instance);
  }
  const instanceBBox = instance.getBoundingBox();
  const instanceMinZ = instance.totalZElevation;
  let instanceMaxZ = instanceMinZ;
  if (instance.zHeight) {
    instanceMaxZ += instance.zHeight;
  } else if (instance.getMeshSize) {
    const meshSize = instance.getMeshSize();
    if (meshSize[0] > 0 && meshSize[1] > 0) {
      let maxZ = 0;
      for (let x = 0; x < meshSize[0]; x++) {
        for (let y = 0; y < meshSize[1]; y++) {
          const vertexZ = instance.getMeshPoint(x, y).zElevation;
          if (vertexZ > maxZ) {
            maxZ = vertexZ;
          }
        }
      }
      instanceMaxZ += maxZ;
    }
  }

  return {
    left: instanceBBox.left,
    top: instanceBBox.top,
    bottom: instanceBBox.bottom,
    right: instanceBBox.right,
    minZ: instanceMinZ,
    maxZ: instanceMaxZ,
  };
}

export function isInstanceBoxInRay(instance, x1, y1, z1, x2, y2, z2) {
  const bounds = getInstanceBounds(instance);

  // Check if the instance's bounding box intersects with the ray bounds
  return lineIntersectsBox(
    x1,
    y1,
    z1,
    x2,
    y2,
    z2,
    bounds.left,
    bounds.top,
    bounds.bottom,
    bounds.right,
    bounds.minZ,
    bounds.maxZ
  );
}

export function getFirstRayIntersection(
  instances,
  rayOrigin,
  rayDirection,
  distance = PICK_MAX_DISTANCE
) {
  const intersections = castRay(instances, rayOrigin, rayDirection, distance);
  if (intersections.length === 0) {
    return null;
  }
  if (intersections.length === 1) {
    const intersection = intersections[0];
    const closestPoint = intersection.points.reduce((closest, point, index) => {
      const dx = point[0] - rayOrigin[0];
      const dy = point[1] - rayOrigin[1];
      const dz = point[2] - rayOrigin[2];
      const distanceSquared = dx * dx + dy * dy + dz * dz;
      return !closest || distanceSquared < closest.distance
        ? {
            point,
            distance: distanceSquared,
            triangle: intersection.triangles[index],
          }
        : closest;
    }, null);
    return {
      instance: intersection.instance,
      point: closestPoint.point,
      triangle: closestPoint.triangle,
    };
  }
  // Go through intersections and find the closest one
  const firstIntersection = intersections.reduce((closest, current) => {
    let currentDistance = Infinity;
    let currentPoint = null;
    let currentTriangle = null;
    current.points.forEach((point, index) => {
      const dx = point[0] - rayOrigin[0];
      const dy = point[1] - rayOrigin[1];
      const dz = point[2] - rayOrigin[2];
      const distanceSquared = dx * dx + dy * dy + dz * dz;
      if (distanceSquared < currentDistance) {
        currentDistance = distanceSquared;
        currentPoint = point;
        currentTriangle = current.triangles[index];
      }
    });

    return !closest || currentDistance < closest.distance
      ? {
          inst: current,
          distance: currentDistance,
          point: currentPoint,
          triangle: currentTriangle,
        }
      : closest;
  }, null);

  return {
    instance: firstIntersection.inst.instance,
    point: firstIntersection.point,
    triangle: firstIntersection.triangle,
  };
}

export function castRay(
  instances,
  rayOrigin,
  rayDirection,
  distance = PICK_MAX_DISTANCE
) {
  const intersections = [];
  instances.forEach((instance) => {
    if (
      !isInstanceBoxInRay(
        instance,
        rayOrigin[0],
        rayOrigin[1],
        rayOrigin[2],
        rayOrigin[0] + rayDirection[0] * distance,
        rayOrigin[1] + rayDirection[1] * distance,
        rayOrigin[2] + rayDirection[2] * distance
      )
    ) {
      return;
    }
    const triangles = instanceToTriList(instance);
    const instanceIntersections = [];
    triangles.forEach((triangle) => {
      const intersection = rayIntersectsTriangle(
        rayOrigin,
        rayDirection,
        distance,
        triangle
      );
      if (intersection) {
        instanceIntersections.push({
          instance,
          point: intersection,
          triangle,
        });
      }
    });
    if (instanceIntersections.length > 0) {
      intersections.push({
        instance,
        points: instanceIntersections.map((i) => i.point),
        triangles: instanceIntersections.map((i) => i.triangle),
      });
    }
  });
  return intersections;
}

export function getRayIntersectionReflectAndNormal(triangle, rayDirection) {
  // Calculate the normal of the triangle
  const [v0, v1, v2] = triangle.map((p) => [p.x, p.y, p.zElevation]);
  const edge1 = subtract(v1, v0);
  const edge2 = subtract(v2, v0);
  let normal = normalize(crossProduct(edge1, edge2));

  // Ensure normal faces away from ray direction
  const dotProduct = dot(rayDirection, normal);
  if (dotProduct > 0) {
    normal = normal.map((n) => -n);
  }

  // Reflect the ray direction using the corrected normal
  const reflectedDirection = subtract(
    rayDirection,
    normal.map((n) => n * 2 * dot(rayDirection, normal))
  );

  return {
    normal,
    reflectedDirection,
  };
}

export function rayIntersectsTriangle(
  rayOrigin,
  rayDirection,
  distance,
  triangle
) {
  const [v0, v1, v2] = triangle.map((p) => [p.x, p.y, p.zElevation]);
  const edge1 = subtract(v1, v0);
  const edge2 = subtract(v2, v0);
  const h = crossProduct(rayDirection, edge2);
  const a = dot(edge1, h);

  if (a > -Number.EPSILON && a < Number.EPSILON) return null; // Ray is parallel to triangle

  const f = 1 / a;
  const s = subtract(rayOrigin, v0);
  const u = f * dot(s, h);

  if (u < 0 || u > 1) return null;

  const q = crossProduct(s, edge1);
  const v = f * dot(rayDirection, q);

  if (v < 0 || u + v > 1) return null;

  // Calculate intersection point
  const t = f * dot(edge2, q);
  if (t > Number.EPSILON && t < distance) {
    return [
      rayOrigin[0] + rayDirection[0] * t,
      rayOrigin[1] + rayDirection[1] * t,
      rayOrigin[2] + rayDirection[2] * t,
    ];
  }

  return null;
}
