/**
 * triangulate.js — Convert Construct 3 instances into triangle lists.
 *
 * Each triangle is an array of three vertices: [v0, v1, v2]
 * Each vertex is { x, y, z } in world-space.
 *
 * Supports:
 *  - Flat sprites (no mesh, no zHeight)       → 2 tris (quad on XY plane at z)
 *  - Mesh-deformed sprites                     → grid of tris from mesh points
 *  - 3D shapes with zHeight (box, wedge, etc.) → full 3D hull
 *  - I3DObjectInstance (via SDK bounding box)   → axis-aligned box (12 tris)
 */

// ─── helpers ────────────────────────────────────────────────────────

function rotatePoint(x, y, angle, ox = 0, oy = 0) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const dx = x - ox;
  const dy = y - oy;
  return { x: dx * c - dy * s + ox, y: dx * s + dy * c + oy };
}

function meshPointToWorld(inst, mx, my) {
  const mp = inst.getMeshPoint(mx, my);
  const a = inst.angle;
  const w = inst.width;
  const h = inst.height;
  const tl = rotatePoint(
    inst.x - w * inst.originX,
    inst.y - h * inst.originY,
    a, inst.x, inst.y
  );
  return {
    x: tl.x + mp.x * w * Math.cos(a) - mp.y * h * Math.sin(a),
    y: tl.y + mp.x * w * Math.sin(a) + mp.y * h * Math.cos(a),
    z: mp.zElevation + inst.totalZElevation,
  };
}

// quad helper — push 2 tris from 4 verts
function pushQuad(out, a, b, c, d) {
  out.push([a, b, c]);
  out.push([a, c, d]);
}

// side-face helper (quad from 4 loose verts)
function pushSideFace(out, x1,y1,z1, x2,y2,z2, x3,y3,z3, x4,y4,z4) {
  const a = { x: x1, y: y1, z: z1 };
  const b = { x: x2, y: y2, z: z2 };
  const c = { x: x3, y: y3, z: z3 };
  const d = { x: x4, y: y4, z: z4 };
  out.push([a, b, c]);
  out.push([a, c, d]);
}

function pushTriFace(out, x1,y1,z1, x2,y2,z2, x3,y3,z3) {
  out.push([
    { x: x1, y: y1, z: z1 },
    { x: x2, y: y2, z: z2 },
    { x: x3, y: y3, z: z3 },
  ]);
}

// ─── flat sprite (no mesh, no zHeight) ──────────────────────────────

function flatSpriteToTris(inst) {
  const a = inst.angle ?? inst.zAngle ?? 0;
  const w = inst.width;
  const h = inst.height;
  const z = inst.totalZElevation;
  const tl = rotatePoint(inst.x - w * inst.originX, inst.y - h * inst.originY, a, inst.x, inst.y);
  const tr = rotatePoint(tl.x + w, tl.y, a, tl.x, tl.y);
  const bl = rotatePoint(tl.x, tl.y + h, a, tl.x, tl.y);
  const br = rotatePoint(tr.x, tr.y + h, a, tr.x, tr.y);
  const out = [];
  pushQuad(out,
    { x: tl.x, y: tl.y, z },
    { x: tr.x, y: tr.y, z },
    { x: br.x, y: br.y, z },
    { x: bl.x, y: bl.y, z },
  );
  return out;
}

// ─── mesh sprite ────────────────────────────────────────────────────

function meshSpriteToTris(inst) {
  const size = inst.getMeshSize();
  const out = [];
  for (let x = 0; x < size[0] - 1; x++) {
    for (let y = 0; y < size[1] - 1; y++) {
      const p1 = meshPointToWorld(inst, x, y);
      const p2 = meshPointToWorld(inst, x + 1, y);
      const p3 = meshPointToWorld(inst, x, y + 1);
      const p4 = meshPointToWorld(inst, x + 1, y + 1);
      out.push([p1, p3, p4]);
      out.push([p1, p2, p4]);
    }
  }
  return out;
}

// ─── 3D object (SDK bounding box) ──────────────────────────────────

function objectInstanceToTris(inst) {
  const sdk = globalThis._editorScope.sdk_runtime
    .GetInstanceByUID(inst.uid)._sdkInst;
  const [mnX, mnY, mnZ] = sdk.xMinBB;
  const [mxX, mxY, mxZ] = sdk.xMaxBB;
  const v = (x, y, z) => ({ x, y, z });
  const out = [];
  // bottom / top
  pushQuad(out, v(mnX,mnY,mnZ), v(mxX,mnY,mnZ), v(mxX,mxY,mnZ), v(mnX,mxY,mnZ));
  pushQuad(out, v(mnX,mnY,mxZ), v(mxX,mnY,mxZ), v(mxX,mxY,mxZ), v(mnX,mxY,mxZ));
  // left / right
  pushQuad(out, v(mnX,mnY,mnZ), v(mnX,mnY,mxZ), v(mnX,mxY,mxZ), v(mnX,mxY,mnZ));
  pushQuad(out, v(mxX,mnY,mnZ), v(mxX,mnY,mxZ), v(mxX,mxY,mxZ), v(mxX,mxY,mnZ));
  // front / back
  pushQuad(out, v(mnX,mnY,mnZ), v(mxX,mnY,mnZ), v(mxX,mnY,mxZ), v(mnX,mnY,mxZ));
  pushQuad(out, v(mnX,mxY,mnZ), v(mxX,mxY,mnZ), v(mxX,mxY,mxZ), v(mnX,mxY,mxZ));
  return out;
}

// ─── 3D shapes with zHeight ─────────────────────────────────────────

function shapeInstanceToTris(inst) {
  const a = inst.angle;
  const w = inst.width;
  const h = inst.height;
  const zH = inst.zHeight || 0;
  const shape = inst.shape || "box";
  const baseZ = inst.totalZElevation;
  const topZ = baseZ + zH;

  const tl = rotatePoint(inst.x - w * inst.originX, inst.y - h * inst.originY, a, inst.x, inst.y);
  const tlX = tl.x, tlY = tl.y;
  const trX = tlX + w * Math.cos(a), trY = tlY + w * Math.sin(a);
  const blX = tlX - h * Math.sin(a), blY = tlY + h * Math.cos(a);
  const brX = trX - h * Math.sin(a), brY = trY + h * Math.cos(a);

  const out = [];

  // Bottom face (always)
  pushSideFace(out, tlX,tlY,baseZ, trX,trY,baseZ, brX,brY,baseZ, blX,blY,baseZ);

  if (shape === "box") {
    pushSideFace(out, tlX,tlY,topZ, blX,blY,topZ, brX,brY,topZ, trX,trY,topZ);
    pushSideFace(out, tlX,tlY,baseZ, blX,blY,baseZ, blX,blY,topZ, tlX,tlY,topZ);
    pushSideFace(out, brX,brY,baseZ, trX,trY,baseZ, trX,trY,topZ, brX,brY,topZ);
    pushSideFace(out, trX,trY,baseZ, tlX,tlY,baseZ, tlX,tlY,topZ, trX,trY,topZ);
    pushSideFace(out, blX,blY,baseZ, brX,brY,baseZ, brX,brY,topZ, blX,blY,topZ);
  } else if (shape === "prism") {
    const m1X = (tlX+blX)/2, m1Y = (tlY+blY)/2;
    const m2X = (trX+brX)/2, m2Y = (trY+brY)/2;
    pushTriFace(out, m1X,m1Y,topZ, blX,blY,baseZ, tlX,tlY,baseZ);
    pushTriFace(out, m2X,m2Y,topZ, trX,trY,baseZ, brX,brY,baseZ);
    pushSideFace(out, m2X,m2Y,topZ, m1X,m1Y,topZ, tlX,tlY,baseZ, trX,trY,baseZ);
    pushSideFace(out, m1X,m1Y,topZ, m2X,m2Y,topZ, brX,brY,baseZ, blX,blY,baseZ);
  } else if (shape === "wedge") {
    pushSideFace(out, trX,trY,topZ, brX,brY,topZ, blX,blY,baseZ, tlX,tlY,baseZ);
    pushSideFace(out, brX,brY,baseZ, trX,trY,baseZ, trX,trY,topZ, brX,brY,topZ);
    pushTriFace(out, trX,trY,topZ, tlX,tlY,baseZ, trX,trY,baseZ);
    pushTriFace(out, brX,brY,topZ, brX,brY,baseZ, blX,blY,baseZ);
  } else if (shape === "pyramid") {
    const cx = (tlX+trX+blX+brX)/4, cy = (tlY+trY+blY+brY)/4;
    pushTriFace(out, cx,cy,topZ, blX,blY,baseZ, tlX,tlY,baseZ);
    pushTriFace(out, cx,cy,topZ, trX,trY,baseZ, brX,brY,baseZ);
    pushTriFace(out, cx,cy,topZ, tlX,tlY,baseZ, trX,trY,baseZ);
    pushTriFace(out, cx,cy,topZ, brX,brY,baseZ, blX,blY,baseZ);
  } else if (shape === "corner-out") {
    pushTriFace(out, trX,trY,topZ, tlX,tlY,baseZ, blX,blY,baseZ);
    pushTriFace(out, trX,trY,topZ, brX,brY,baseZ, trX,trY,baseZ);
    pushTriFace(out, trX,trY,topZ, blX,blY,baseZ, brX,brY,baseZ);
    pushTriFace(out, trX,trY,topZ, trX,trY,baseZ, tlX,tlY,baseZ);
  } else if (shape === "corner-in") {
    pushSideFace(out, brX,brY,baseZ, trX,trY,baseZ, trX,trY,topZ, brX,brY,topZ);
    pushSideFace(out, trX,trY,baseZ, tlX,tlY,baseZ, tlX,tlY,topZ, trX,trY,topZ);
    pushTriFace(out, brX,brY,topZ, tlX,tlY,topZ, trX,trY,topZ);
    pushTriFace(out, brX,brY,topZ, tlX,tlY,topZ, blX,blY,baseZ);
    pushTriFace(out, tlX,tlY,topZ, tlX,tlY,baseZ, blX,blY,baseZ);
    pushTriFace(out, brX,brY,topZ, brX,brY,baseZ, blX,blY,baseZ);
  }

  return out;
}

// ─── public API ─────────────────────────────────────────────────────

/**
 * Convert a Construct 3 instance into a list of world-space triangles.
 *
 * If the instance already carries a `.triangles` array (or
 * `.interactionTriangles`), those are returned directly.
 *
 * @param {object} inst  A C3 instance (sprite, 3DShape, 3DObject …)
 * @returns {Array<[{x,y,z},{x,y,z},{x,y,z}]>}
 */
export function instanceToTriangles(inst) {
  // Pre-computed triangles stored on the instance
  if (inst.interactionTriangles) return inst.interactionTriangles;
  if (inst.triangles) return inst.triangles;

  // 3D shapes (box, wedge, prism, pyramid …)
  if (inst.zHeight !== undefined) return shapeInstanceToTris(inst);

  // Native 3D object (I3DObjectInstance)
  if (inst instanceof self.I3DObjectInstance) return objectInstanceToTris(inst);

  // Mesh-deformed sprite
  if (inst.getMeshSize) {
    const sz = inst.getMeshSize();
    if (sz[0] > 0 && sz[1] > 0) return meshSpriteToTris(inst);
  }

  // Plain flat sprite
  return flatSpriteToTris(inst);
}
