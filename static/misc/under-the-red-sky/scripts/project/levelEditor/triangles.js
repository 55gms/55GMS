import { getModelBaseSize } from "./model3DBaseSizes.js";

// ZYX rotation matrix (Rz·Ry·Rx), matching transformGizmos.createRotationMatrix
// so a 3D model's outline aligns exactly with its box-scale gizmo.
function model3DRotationMatrix(rx, ry, rz) {
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const cz = Math.cos(rz), sz = Math.sin(rz);
  return [
    [cz * cy, cz * sy * sx - sz * cx, cz * sy * cx + sz * sx],
    [sz * cy, sz * sy * sx + cz * cx, sz * sy * cx - cz * sx],
    [-sy, cy * sx, cy * cx],
  ];
}

function applyMat3(m, v) {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}

export function meshPointToWorldPoint(instance, meshX, meshY) {
  const meshPoint = instance.getMeshPoint(meshX, meshY);
  //   const angle = instance.angle - Math.PI / 2;
  const angle = instance.angle;
  const width = instance.width;
  const height = instance.height;
  const rotatedPoint = rotatePoint(
    instance.x - width * instance.originX,
    instance.y - height * instance.originY,
    angle, // Adjust angle to match mesh orientation
    instance.x,
    instance.y
  );
  const tlX = rotatedPoint.x;
  const tlY = rotatedPoint.y;
  // lerp x/y coordinates based on bbox
  const x =
    tlX +
    meshPoint.x * width * Math.cos(angle) -
    meshPoint.y * height * Math.sin(angle);
  const y =
    tlY +
    meshPoint.x * width * Math.sin(angle) +
    meshPoint.y * height * Math.cos(angle);
  const z = meshPoint.zElevation + instance.totalZElevation;
  return { x, y, zElevation: z };
}

export function rotatePoint(x, y, angle, originX = 0, originY = 0) {
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  const translatedX = x - originX;
  const translatedY = y - originY;
  const rotatedX = translatedX * cosAngle - translatedY * sinAngle + originX;
  const rotatedY = translatedX * sinAngle + translatedY * cosAngle + originY;
  return { x: rotatedX, y: rotatedY };
}

export function instanceObjectToTriList(instance) {
  // Preferred: build the model's true ORIENTED box from its known local geometry
  // (rotation-independent), so the outline rotates with the model. The runtime
  // only exposes an axis-aligned AABB, which can't do this.
  const base = getModelBaseSize(instance.objectType?.name);
  if (base) {
    const sx = instance.xScale || 1;
    const sy = instance.yScale || 1;
    const sz = instance.zScale || 1;
    const hw = base.w / sx / 2;
    const hh = base.h / sy / 2;
    const hd = base.d / sz / 2;
    const m = model3DRotationMatrix(
      ((instance.xAngle || 0) * Math.PI) / 180,
      ((instance.yAngle || 0) * Math.PI) / 180,
      ((instance.zAngle || 0) * Math.PI) / 180
    );
    const off = applyMat3(m, [base.ox / sx, base.oy / sy, base.oz / sz]);
    const cx = instance.x + off[0];
    const cy = instance.y + off[1];
    const cz = (instance.totalZElevation || 0) + off[2];
    const corner = (a, b, c) => {
      const w = applyMat3(m, [a * hw, b * hh, c * hd]);
      return { x: cx + w[0], y: cy + w[1], zElevation: cz + w[2] };
    };
    const c000 = corner(-1, -1, -1), c100 = corner(1, -1, -1);
    const c010 = corner(-1, 1, -1), c110 = corner(1, 1, -1);
    const c001 = corner(-1, -1, 1), c101 = corner(1, -1, 1);
    const c011 = corner(-1, 1, 1), c111 = corner(1, 1, 1);
    const out = [];
    const quad = (a, b, c, d) => {
      out.push([a, b, c]);
      out.push([a, c, d]);
    };
    quad(c000, c100, c110, c010); // bottom (z-)
    quad(c001, c101, c111, c011); // top (z+)
    quad(c000, c100, c101, c001); // y-
    quad(c010, c110, c111, c011); // y+
    quad(c000, c010, c011, c001); // x-
    quad(c100, c110, c111, c101); // x+
    return out;
  }

  // Fallback for uncaptured model types: axis-aligned world AABB.
  // globalThis.sdk_runtime (not _editorScope, which is cleared at play time) so
  // this works both in the editor and during play (they are the same object).
  const sdkInst = globalThis.sdk_runtime.GetInstanceByUID(instance.uid)._sdkInst;
  const [minX, minY, minZ] = sdkInst.xMinBB;
  const [maxX, maxY, maxZ] = sdkInst.xMaxBB;
  const triangles = [];
  // return unrotated bounding box triangles
  triangles.push([
    { x: minX, y: minY, zElevation: minZ },
    { x: maxX, y: minY, zElevation: minZ },
    { x: minX, y: maxY, zElevation: minZ },
  ]);
  triangles.push([
    { x: maxX, y: minY, zElevation: minZ },
    { x: maxX, y: maxY, zElevation: minZ },
    { x: minX, y: maxY, zElevation: minZ },
  ]);
  triangles.push([
    { x: minX, y: minY, zElevation: maxZ },
    { x: maxX, y: minY, zElevation: maxZ },
    { x: minX, y: maxY, zElevation: maxZ },
  ]);
  triangles.push([
    { x: maxX, y: minY, zElevation: maxZ },
    { x: maxX, y: maxY, zElevation: maxZ },
    { x: minX, y: maxY, zElevation: maxZ },
  ]);
  triangles.push([
    { x: minX, y: minY, zElevation: minZ },
    { x: minX, y: minY, zElevation: maxZ },
    { x: minX, y: maxY, zElevation: minZ },
  ]);
  triangles.push([
    { x: minX, y: minY, zElevation: maxZ },
    { x: minX, y: maxY, zElevation: maxZ },
    { x: minX, y: maxY, zElevation: minZ },
  ]);
  triangles.push([
    { x: maxX, y: minY, zElevation: minZ },
    { x: maxX, y: minY, zElevation: maxZ },
    { x: maxX, y: maxY, zElevation: minZ },
  ]);
  triangles.push([
    { x: maxX, y: minY, zElevation: maxZ },
    { x: maxX, y: maxY, zElevation: maxZ },
    { x: maxX, y: maxY, zElevation: minZ },
  ]);
  triangles.push([
    { x: minX, y: minY, zElevation: minZ },
    { x: maxX, y: minY, zElevation: minZ },
    { x: minX, y: minY, zElevation: maxZ },
  ]);
  triangles.push([
    { x: maxX, y: minY, zElevation: minZ },
    { x: maxX, y: minY, zElevation: maxZ },
    { x: minX, y: minY, zElevation: maxZ },
  ]);
  triangles.push([
    { x: minX, y: maxY, zElevation: minZ },
    { x: maxX, y: maxY, zElevation: minZ },
    { x: minX, y: maxY, zElevation: maxZ },
  ]);
  triangles.push([
    { x: maxX, y: maxY, zElevation: minZ },
    { x: maxX, y: maxY, zElevation: maxZ },
    { x: minX, y: maxY, zElevation: maxZ },
  ]);
  return triangles;
}

export function instanceNoMeshToTriList(instance) {
  const triangles = [];
  // use x, y, originX, originY and angle to create triangles
  let angle = instance.angle;
  if (angle === undefined) {
    angle = instance.zAngle; // Default angle if not defined
  }
  const width = instance.width;
  const height = instance.height;
  const rotatedPoint = rotatePoint(
    instance.x - width * instance.originX,
    instance.y - height * instance.originY,
    angle,
    instance.x,
    instance.y
  );
  const tlX = rotatedPoint.x;
  const tlY = rotatedPoint.y;
  const tr = rotatePoint(tlX + width, tlY, angle, tlX, tlY);
  const trX = tr.x;
  const trY = tr.y;
  const bl = rotatePoint(tlX, tlY + height, angle, tlX, tlY);
  const blX = bl.x;
  const blY = bl.y;
  const br = rotatePoint(trX, trY + height, angle, trX, trY);
  const brX = br.x;
  const brY = br.y;

  triangles.push([
    { x: tlX, y: tlY, zElevation: instance.totalZElevation },
    { x: trX, y: trY, zElevation: instance.totalZElevation },
    { x: blX, y: blY, zElevation: instance.totalZElevation },
  ]);

  triangles.push([
    { x: trX, y: trY, zElevation: instance.totalZElevation },
    { x: brX, y: brY, zElevation: instance.totalZElevation },
    { x: blX, y: blY, zElevation: instance.totalZElevation },
  ]);

  return triangles;
}

export function instanceToTriList(instance) {
  if (instance.interactionTriangles) return instance.interactionTriangles;
  if (instance.triangles) return instance.triangles;
  if (instance.zHeight !== undefined) return instanceShapeToTriList(instance);
  if (instance instanceof self.I3DObjectInstance)
    return instanceObjectToTriList(instance);
  const triangles = [];
  const meshSize = instance.getMeshSize();
  if (meshSize[0] > 0 && meshSize[1] > 0) {
    for (let x = 0; x < meshSize[0] - 1; x++) {
      for (let y = 0; y < meshSize[1] - 1; y++) {
        const p1 = meshPointToWorldPoint(instance, x, y);
        const p2 = meshPointToWorldPoint(instance, x + 1, y);
        const p3 = meshPointToWorldPoint(instance, x, y + 1);
        const p4 = meshPointToWorldPoint(instance, x + 1, y + 1);

        triangles.push([p1, p3, p4]);
        triangles.push([p1, p2, p4]);
      }
    }
    return triangles;
  }
  return instanceNoMeshToTriList(instance);
}

export function instanceShapeToTriList(instance) {
  const triangles = [];
  const angle = instance.angle;
  const width = instance.width;
  const height = instance.height;
  const zHeight = instance.zHeight || 0;
  const shape = instance.shape || 0; // 0=block, 1=wedge, 2=corner, 3=pyramid, 4=prism, 5=roof

  // Calculate corner positions (bottom face)
  const rotatedPoint = rotatePoint(
    instance.x - width * instance.originX,
    instance.y - height * instance.originY,
    angle,
    instance.x,
    instance.y
  );
  const tlX = rotatedPoint.x;
  const tlY = rotatedPoint.y;
  const trX = tlX + width * Math.cos(angle);
  const trY = tlY + width * Math.sin(angle);
  const blX = tlX - height * Math.sin(angle);
  const blY = tlY + height * Math.cos(angle);
  const brX = trX - height * Math.sin(angle);
  const brY = trY + height * Math.cos(angle);

  const baseZ = instance.totalZElevation;
  const topZ = baseZ + zHeight;

  // Bottom face (always present)
  triangles.push([
    { x: tlX, y: tlY, zElevation: baseZ },
    { x: trX, y: trY, zElevation: baseZ },
    { x: blX, y: blY, zElevation: baseZ },
  ]);
  triangles.push([
    { x: trX, y: trY, zElevation: baseZ },
    { x: brX, y: brY, zElevation: baseZ },
    { x: blX, y: blY, zElevation: baseZ },
  ]);
  // "box", "prism", "wedge", "pyramid", "corner-out" and "corner-in"
  if (shape === "box") {
    // Block
    // Top face
    triangles.push([
      { x: tlX, y: tlY, zElevation: topZ },
      { x: blX, y: blY, zElevation: topZ },
      { x: trX, y: trY, zElevation: topZ },
    ]);
    triangles.push([
      { x: trX, y: trY, zElevation: topZ },
      { x: blX, y: blY, zElevation: topZ },
      { x: brX, y: brY, zElevation: topZ },
    ]);

    // Side faces
    addSideFace(
      triangles,
      tlX,
      tlY,
      baseZ,
      blX,
      blY,
      baseZ,
      blX,
      blY,
      topZ,
      tlX,
      tlY,
      topZ
    );
    addSideFace(
      triangles,
      brX,
      brY,
      baseZ,
      trX,
      trY,
      baseZ,
      trX,
      trY,
      topZ,
      brX,
      brY,
      topZ
    );
    addSideFace(
      triangles,
      trX,
      trY,
      baseZ,
      tlX,
      tlY,
      baseZ,
      tlX,
      tlY,
      topZ,
      trX,
      trY,
      topZ
    );
    addSideFace(
      triangles,
      blX,
      blY,
      baseZ,
      brX,
      brY,
      baseZ,
      brX,
      brY,
      topZ,
      blX,
      blY,
      topZ
    );
  } else if (shape === "prism") {
    // Wedge
    const midX1 = (tlX + blX) / 2;
    const midY1 = (tlY + blY) / 2;
    const midX2 = (trX + brX) / 2;
    const midY2 = (trY + brY) / 2;

    // Side faces
    addTriangleFace(
      triangles,
      midX1,
      midY1,
      topZ,
      blX,
      blY,
      baseZ,
      tlX,
      tlY,
      baseZ
    );
    addTriangleFace(
      triangles,
      midX2,
      midY2,
      topZ,
      trX,
      trY,
      baseZ,
      brX,
      brY,
      baseZ
    );
    addSideFace(
      triangles,
      midX2,
      midY2,
      topZ,
      midX1,
      midY1,
      topZ,
      tlX,
      tlY,
      baseZ,
      trX,
      trY,
      baseZ
    );
    addSideFace(
      triangles,
      midX1,
      midY1,
      topZ,
      midX2,
      midY2,
      topZ,
      brX,
      brY,
      baseZ,
      blX,
      blY,
      baseZ
    );
  } else if (shape === "wedge") {
    // Corner
    // Side faces with corner shape
    addSideFace(
      triangles,
      trX,
      trY,
      topZ,
      brX,
      brY,
      topZ,
      blX,
      blY,
      baseZ,
      tlX,
      tlY,
      baseZ
    );
    addSideFace(
      triangles,
      brX,
      brY,
      baseZ,
      trX,
      trY,
      baseZ,
      trX,
      trY,
      topZ,
      brX,
      brY,
      topZ
    );
    addTriangleFace(
      triangles,
      trX,
      trY,
      topZ,
      tlX,
      tlY,
      baseZ,
      trX,
      trY,
      baseZ
    );
    addTriangleFace(
      triangles,
      brX,
      brY,
      topZ,
      brX,
      brY,
      baseZ,
      blX,
      blY,
      baseZ
    );
  } else if (shape === "pyramid") {
    // Pyramid
    const midX = (tlX + trX + blX + brX) / 4;
    const midY = (tlY + trY + blY + brY) / 4;

    // Four triangular faces to apex
    addTriangleFace(
      triangles,
      midX,
      midY,
      topZ,
      blX,
      blY,
      baseZ,
      tlX,
      tlY,
      baseZ
    );
    addTriangleFace(
      triangles,
      midX,
      midY,
      topZ,
      trX,
      trY,
      baseZ,
      brX,
      brY,
      baseZ
    );
    addTriangleFace(
      triangles,
      midX,
      midY,
      topZ,
      tlX,
      tlY,
      baseZ,
      trX,
      trY,
      baseZ
    );
    addTriangleFace(
      triangles,
      midX,
      midY,
      topZ,
      brX,
      brY,
      baseZ,
      blX,
      blY,
      baseZ
    );
  } else if (shape === "corner-out") {
    // Prism
    // Side faces for prism shape
    addTriangleFace(
      triangles,
      trX,
      trY,
      topZ,
      tlX,
      tlY,
      baseZ,
      blX,
      blY,
      baseZ
    );
    addTriangleFace(
      triangles,
      trX,
      trY,
      topZ,
      brX,
      brY,
      baseZ,
      trX,
      trY,
      baseZ
    );
    addTriangleFace(
      triangles,
      trX,
      trY,
      topZ,
      blX,
      blY,
      baseZ,
      brX,
      brY,
      baseZ
    );
    addTriangleFace(
      triangles,
      trX,
      trY,
      topZ,
      trX,
      trY,
      baseZ,
      tlX,
      tlY,
      baseZ
    );
  } else if (shape === "corner-in") {
    addSideFace(
      triangles,
      brX,
      brY,
      baseZ,
      trX,
      trY,
      baseZ,
      trX,
      trY,
      topZ,
      brX,
      brY,
      topZ
    );
    addSideFace(
      triangles,
      trX,
      trY,
      baseZ,
      tlX,
      tlY,
      baseZ,
      tlX,
      tlY,
      topZ,
      trX,
      trY,
      topZ
    );
    addTriangleFace(triangles, brX, brY, topZ, tlX, tlY, topZ, trX, trY, topZ);
    addTriangleFace(triangles, brX, brY, topZ, tlX, tlY, topZ, blX, blY, baseZ);
    addTriangleFace(
      triangles,
      tlX,
      tlY,
      topZ,
      tlX,
      tlY,
      baseZ,
      blX,
      blY,
      baseZ
    );
    addTriangleFace(
      triangles,
      brX,
      brY,
      topZ,
      brX,
      brY,
      baseZ,
      blX,
      blY,
      baseZ
    );
  }

  return triangles;
}

export function addSideFace(
  triangles,
  x1,
  y1,
  z1,
  x2,
  y2,
  z2,
  x3,
  y3,
  z3,
  x4,
  y4,
  z4
) {
  triangles.push([
    { x: x1, y: y1, zElevation: z1 },
    { x: x2, y: y2, zElevation: z2 },
    { x: x3, y: y3, zElevation: z3 },
  ]);
  triangles.push([
    { x: x1, y: y1, zElevation: z1 },
    { x: x3, y: y3, zElevation: z3 },
    { x: x4, y: y4, zElevation: z4 },
  ]);
}

export function addTriangleFace(triangles, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
  triangles.push([
    { x: x1, y: y1, zElevation: z1 },
    { x: x2, y: y2, zElevation: z2 },
    { x: x3, y: y3, zElevation: z3 },
  ]);
}
