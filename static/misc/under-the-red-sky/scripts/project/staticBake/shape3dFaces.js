// shape3dFaces.js
// Port of C3's Shape3D per-instance draw path (r449: Shape3D Instance.Draw +
// _DrawFace + TiledBg.CalculateTextureCoordsFor3DFace) into a pure function
// that returns the textured quads a Shape3D instance would submit, so they can
// be baked into a static mesh instead of being rebuilt every frame.
//
// Everything here mirrors the runtime code 1:1 (same face order, same corner
// order, same UV tweaks per "face mode"), with two deliberate differences:
//  - z is absolute (layer + instance z elevation + face z) because drawMesh
//    doesn't add the renderer's base/current Z the way Quad3D2 does.
//  - each quad's corner order is normalised so its cross-product normal points
//    away from the shape, which makes GPU back-face culling safe regardless of
//    mirrored/negative sizes (Shape3D would draw both sides instead).
//
// Inputs are the INTERNAL runtime objects (sdk instance + world info), reached
// through globalThis.sdk_runtime like imageHelper.js already does. Public
// script interfaces don't expose face objects, textures or tex quads.

// Shape3D internal shape indices (SHAPE_NAMES order in the runtime).
export const SHAPE_INDEX = {
  box: 0,
  prism: 1,
  wedge: 2,
  pyramid: 3,
  "corner-out": 4,
  "corner-in": 5,
};

// distanceTo3D(x1,y1,z1, x2,y2,z2, zFactor): Z delta is scaled by the shape's
// z tiling factor before taking the length (runtime helper of the same name).
function distanceTo3D(x1, y1, z1, x2, y2, z2, zf) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = (z2 - z1) * zf;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Fill `out` (8 floats: tl,tr,br,bl) from a rect, optionally rotated by
// `angle` radians (C3 Quad.setFromRotatedRect semantics).
function quadFromRect(out, l, t, r, b, angle) {
  if (angle === 0) {
    out[0] = l;
    out[1] = t;
    out[2] = r;
    out[3] = t;
    out[4] = r;
    out[5] = b;
    out[6] = l;
    out[7] = b;
    return;
  }
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  const ls = l * s,
    ts = t * s,
    rs = r * s,
    bs = b * s;
  const lc = l * c,
    tc = t * c,
    rc = r * c,
    bc = b * c;
  out[0] = lc - ts;
  out[1] = tc + ls;
  out[2] = rc - ts;
  out[3] = tc + rs;
  out[4] = rc - bs;
  out[5] = bc + rs;
  out[6] = lc - bs;
  out[7] = bc + ls;
}

// C3 Quad.mirror(): swap tl<->tr and bl<->br.
function mirrorQuad(q) {
  let t = q[0];
  q[0] = q[2];
  q[2] = t;
  t = q[1];
  q[1] = q[3];
  q[3] = t;
  t = q[6];
  q[6] = q[4];
  q[4] = t;
  t = q[7];
  q[7] = q[5];
  q[5] = t;
}

function quadToArray(quad) {
  return [
    quad.getTlx(),
    quad.getTly(),
    quad.getTrx(),
    quad.getTry(),
    quad.getBrx(),
    quad.getBry(),
    quad.getBlx(),
    quad.getBly(),
  ];
}

const isSpriteSdk = (sdk) =>
  typeof sdk.GetTexQuad === "function" &&
  typeof sdk.GetTexture === "function" &&
  typeof sdk.CalculateTextureCoordsFor3DFace !== "function";
const isTiledBgSdk = (sdk) =>
  typeof sdk.CalculateTextureCoordsFor3DFace === "function";

/**
 * Resolve the texture + tex quad (8 floats) a face would be drawn with.
 * Returns:
 *   { tex, uv, key }  — drawable face
 *   null              — face is skipped by C3 too (no paired instance / no texture)
 *   false             — face uses a path we can't bake (NinePatch, tile
 *                       randomization); the whole instance must stay dynamic.
 *
 * `corners` = [tlx,tly,tlz, trx,try,trz, brx,bry,brz, blx,bly,blz] (absolute z),
 * `mode` = the 5th "shape" arg of _AddFaceToDraw (0..5).
 */
function resolveFaceTexture(ctx, faceIndex, corners, mode) {
  const { sdk, inst, zTiling, shapeTypeName } = ctx;
  const faceObjectClass = sdk._faceObjects[faceIndex];
  let tex = null;
  let uv = null;
  let key = null;
  let tiled = false;

  if (faceObjectClass) {
    const paired = faceObjectClass.GetPairedInstance(inst);
    if (!paired) return null;
    const psdk = paired.GetSdkInstance();
    if (isSpriteSdk(psdk)) {
      tex = psdk.GetTexture();
      if (!tex) return null;
      uv = quadToArray(psdk.GetTexQuad());
      key = "obj:" + faceObjectClass.GetName();
    } else if (isTiledBgSdk(psdk)) {
      if (
        typeof psdk._IsTileRandomizationEnabled === "function" &&
        psdk._IsTileRandomizationEnabled()
      ) {
        return false; // needs the tile-randomization shader
      }
      const [tlx, tly, tlz, trx, try_, trz, brx, bry, brz, blx, bly, blz] =
        corners;
      let tw = 0;
      let th = 0;
      switch (mode) {
        case 0:
        case 5:
        case 1:
          tw = distanceTo3D(tlx, tly, tlz, trx, try_, trz, zTiling);
          th = distanceTo3D(trx, try_, trz, brx, bry, brz, zTiling);
          break;
        case 2:
          tw = distanceTo3D(blx, bly, blz, brx, bry, brz, zTiling);
          th = distanceTo3D(tlx, tly, tlz, blx, bly, blz, zTiling);
          break;
        case 3:
          tw = distanceTo3D(blx, bly, blz, brx, bry, brz, zTiling);
          th = distanceTo3D(trx, try_, trz, brx, bry, brz, zTiling);
          break;
        case 4:
          tw = distanceTo3D(blx, bly, blz, brx, bry, brz, zTiling);
          th = distanceTo3D(
            tlx,
            tly,
            tlz,
            (blx + brx) / 2,
            (bly + bry) / 2,
            (blz + brz) / 2,
            zTiling,
          );
          break;
      }
      tex = psdk.GetTexture();
      if (!tex) return null;
      // TiledBg.CalculateTextureCoordsFor3DFace(tw, th, quad)
      const info = psdk.GetCurrentImageInfo();
      const iw = info.GetWidth();
      const ih = info.GetHeight();
      const offX = (psdk._imageOffsetX || 0) / iw;
      const offY = (psdk._imageOffsetY || 0) / ih;
      const scX = psdk._imageScaleX ?? 1;
      const scY = psdk._imageScaleY ?? 1;
      const ang = psdk._imageAngle || 0;
      const l = 0 - offX;
      const t = 0 - offY;
      const r = tw / (iw * scX) - offX;
      const b = th / (ih * scY) - offY;
      uv = new Array(8);
      quadFromRect(uv, l, t, r, b, -ang);
      tiled = true;
      key = "obj:" + faceObjectClass.GetName();
    } else {
      // NinePatch (drawn via callback) or an unsupported plugin.
      return false;
    }
  } else {
    const frameIndex = sdk._faceImages[faceIndex];
    const info = sdk._animation.GetFrameAt(frameIndex).GetImageInfo();
    tex = info.GetTexture();
    if (!tex) return null;
    uv = quadToArray(info.GetTexQuad());
    key = "own:" + shapeTypeName + ":" + frameIndex;
  }

  // _DrawFace tail: for modes >= 3, or any tiled face, C3 adjusts the quad.
  if (mode >= 3 || tiled) {
    if (mode === 3) {
      uv[0] = uv[2]; // tl.x = tr.x (tl.y unchanged)
    } else if (mode === 4) {
      uv[0] = (uv[0] + uv[2]) / 2;
      uv[1] = (uv[1] + uv[3]) / 2;
    } else if (mode === 5) {
      mirrorQuad(uv);
    }
  }
  return { tex, uv, key };
}

/**
 * Compute every face quad a Shape3D instance draws.
 *
 * @param {object} ctx
 *   sdk            internal Shape3D SDK instance
 *   inst           internal C3 instance (for GetPairedInstance)
 *   wi             internal world info
 *   shapeTypeName  object type name (texture key for own-image faces)
 * @returns {Array<{tex, key, pos:number[12], uv:number[8]}>|null}
 *   null when the instance can't be baked faithfully.
 */
export function computeShapeFaces(ctx) {
  const { sdk, wi } = ctx;
  const vis = sdk._faceVisibility;
  let s = vis[0],
    a = vis[1],
    n = vis[2],
    r = vis[3],
    c = vis[4],
    o = vis[5];
  if (!(s || a || n || r || c || o)) return [];

  const q = wi.GetBoundingQuad();
  const h = q.getTlx(),
    g = q.getTly(),
    u = q.getTrx(),
    _ = q.getTry(),
    d = q.getBrx(),
    m = q.getBry(),
    F = q.getBlx(),
    f = q.getBly();
  const T = sdk._shape;
  const z0 = wi.GetTotalZElevation();
  const b = z0 + sdk._zHeight;
  const zero = z0;
  ctx.zTiling = sdk._zTilingFactor;

  const faces = [];
  let unbakeable = false;
  // add(faceIndex, tl..., tr..., br..., bl..., mode) — same arg order as
  // Shape3D._AddFaceToDraw. `zero`/`b` are already absolute.
  const add = (
    i,
    tlx,
    tly,
    tlz,
    trx,
    try_,
    trz,
    brx,
    bry,
    brz,
    blx,
    bly,
    blz,
    mode,
  ) => {
    if (unbakeable) return;
    const pos = [tlx, tly, tlz, trx, try_, trz, brx, bry, brz, blx, bly, blz];
    const res = resolveFaceTexture(ctx, i, pos, mode);
    if (res === false) {
      unbakeable = true;
      return;
    }
    if (!res) return;
    faces.push({ tex: res.tex, key: res.key, pos, uv: res.uv });
  };

  if (s) add(0, u, _, zero, h, g, zero, F, f, zero, d, m, zero, 5);
  if (T === 0) {
    if (n) add(2, h, g, b, F, f, b, F, f, zero, h, g, zero, 0);
    if (r) add(3, d, m, b, u, _, b, u, _, zero, d, m, zero, 0);
    if (c) add(4, u, _, b, h, g, b, h, g, zero, u, _, zero, 0);
    if (o) add(5, F, f, b, d, m, b, d, m, zero, F, f, zero, 0);
    if (a) add(1, h, g, b, u, _, b, d, m, b, F, f, b, 0);
  } else if (T === 1) {
    const e = (h + F) / 2,
      t = (g + f) / 2,
      i = (u + d) / 2,
      s2 = (_ + m) / 2;
    if (n) add(2, e, t, b, e, t, b, F, f, zero, h, g, zero, 4);
    if (r) add(3, i, s2, b, i, s2, b, u, _, zero, d, m, zero, 4);
    if (c) add(4, i, s2, b, e, t, b, h, g, zero, u, _, zero, 0);
    if (o) add(5, e, t, b, i, s2, b, d, m, zero, F, f, zero, 0);
  } else if (T === 2) {
    if (n) add(2, u, _, b, d, m, b, F, f, zero, h, g, zero, 0);
    if (r) add(3, d, m, b, u, _, b, u, _, zero, d, m, zero, 0);
    if (c) add(4, u, _, b, u, _, b, h, g, zero, u, _, zero, 2);
    if (o) add(5, d, m, b, d, m, b, d, m, zero, F, f, zero, 3);
  } else if (T === 3) {
    const e = q.midX(),
      t = q.midY();
    if (n) add(2, e, t, b, e, t, b, F, f, zero, h, g, zero, 4);
    if (r) add(3, e, t, b, e, t, b, u, _, zero, d, m, zero, 4);
    if (c) add(4, e, t, b, e, t, b, h, g, zero, u, _, zero, 4);
    if (o) add(5, e, t, b, e, t, b, d, m, zero, F, f, zero, 4);
  } else if (T === 4) {
    if (n) add(2, u, _, b, u, _, b, F, f, zero, h, g, zero, 2);
    if (r) add(3, u, _, b, u, _, b, u, _, zero, d, m, zero, 3);
    if (c) add(4, u, _, b, u, _, b, h, g, zero, u, _, zero, 2);
    if (o) add(5, u, _, b, u, _, b, d, m, zero, F, f, zero, 3);
  } else if (T === 5) {
    if (n) add(2, h, g, b, h, g, b, F, f, zero, h, g, zero, 2);
    if (r) add(3, d, m, b, u, _, b, u, _, zero, d, m, zero, 0);
    if (c) add(4, u, _, b, h, g, b, h, g, zero, u, _, zero, 0);
    if (o) add(5, d, m, b, d, m, b, d, m, zero, F, f, zero, 3);
    if (a) add(1, h, g, b, u, _, b, d, m, b, F, f, zero, 1);
  }
  if (unbakeable) return null;

  // Normalise winding: make each quad's normal point away from the shape's
  // interior so cull-mode "back" hides inner faces. C3's own corner order
  // already does this for un-mirrored shapes; this makes it hold always.
  // The interior point is the mean of all face corners: strictly inside the
  // convex hull for every shape. (The bounding-box centre is NOT usable: a
  // wedge's slope passes exactly through it.)
  let cx = 0,
    cy = 0,
    cz = 0,
    cornerCount = 0;
  for (const face of faces) {
    const p = face.pos;
    for (let k = 0; k < 12; k += 3) {
      cx += p[k];
      cy += p[k + 1];
      cz += p[k + 2];
      cornerCount++;
    }
  }
  if (cornerCount > 0) {
    cx /= cornerCount;
    cy /= cornerCount;
    cz /= cornerCount;
    for (const face of faces) orientOutward(face, cx, cy, cz);
  }
  return faces;
}

// Cross the quad's diagonals (robust when one edge is degenerate, e.g. the
// triangular faces of prisms/pyramids) and flip the corner order if the normal
// points towards the interior point.
function orientOutward(face, ix, iy, iz) {
  const p = face.pos;
  const d1x = p[6] - p[0],
    d1y = p[7] - p[1],
    d1z = p[8] - p[2]; // br - tl
  const d2x = p[9] - p[3],
    d2y = p[10] - p[4],
    d2z = p[11] - p[5]; // bl - tr
  const nx = d1y * d2z - d1z * d2y;
  const ny = d1z * d2x - d1x * d2z;
  const nz = d1x * d2y - d1y * d2x;
  const fx = (p[0] + p[3] + p[6] + p[9]) / 4 - ix;
  const fy = (p[1] + p[4] + p[7] + p[10]) / 4 - iy;
  const fz = (p[2] + p[5] + p[8] + p[11]) / 4 - iz;
  const dot = nx * fx + ny * fy + nz * fz;
  const scale = Math.hypot(nx, ny, nz) * Math.hypot(fx, fy, fz);
  if (dot < 0 && -dot > scale * 1e-6) {
    // reverse to bl, br, tr, tl (same cycle, opposite direction)
    face.pos = [
      p[9],
      p[10],
      p[11],
      p[6],
      p[7],
      p[8],
      p[3],
      p[4],
      p[5],
      p[0],
      p[1],
      p[2],
    ];
    const u = face.uv;
    face.uv = [u[6], u[7], u[4], u[5], u[2], u[3], u[0], u[1]];
  }
}
