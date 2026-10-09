/**
 * shadowMeshBuilder.js — Projects caster silhouettes onto receiver surfaces.
 *
 * Algorithm (directional light, plane-projection + polygon clipping):
 *
 *   1. Accept per-caster vertex groups (one group per caster instance).
 *   2. Group receiver triangles by coplanar plane (same normal & distance).
 *   3. For each receiver plane, for each caster group:
 *      a. Project the caster's vertices onto the plane along lightDir.
 *      b. Build the 2D convex hull of the projected points.
 *      c. For each receiver triangle in the plane group, clip the hull
 *         against the triangle (Sutherland-Hodgman).
 *      d. Fan-triangulate the clipped polygon and emit shadow triangles.
 *
 * Each caster produces its own independent shadow — they are never merged
 * into a single hull, which would create an incorrect giant shadow.
 *
 * Performance notes:
 *   - Hot inner loops use pre-allocated Float64Array scratch buffers
 *     (ping-pong for clipping, flat arrays for projected/hull vertices)
 *     to minimise GC pressure.
 *   - 2D AABB overlap tests cull impossible caster/receiver pairs before
 *     running the expensive Sutherland-Hodgman clip.
 *   - CCW winding for receiver triangles is precomputed once per plane
 *     group, not per clip call.
 *   - vec3 math (dot, sub, cross) is inlined in tight loops.
 */

// ═══════════════════════════════════════════════════════════════════
// Pre-allocated scratch buffers (module-level, reused every frame)
// ═══════════════════════════════════════════════════════════════════

// Max vertices a clipped polygon can have (hull verts + triangle edges
// can produce at most hull.length + 3 verts per clip pass; 128 is generous)
const MAX_CLIP_VERTS = 128;

// Ping-pong buffers for Sutherland-Hodgman (flat x,y pairs)
const _clipA = new Float64Array(MAX_CLIP_VERTS * 2);
const _clipB = new Float64Array(MAX_CLIP_VERTS * 2);

// Scratch for convex hull: sorted indices + hull output
const _hullBuf = new Float64Array(MAX_CLIP_VERTS * 2); // hull result (x,y pairs)

// Scratch for projected 3D vertices (flat x,y,z triples)
// 512 verts should cover any reasonable caster
const MAX_PROJECTED = 512;
const _proj3D = new Float64Array(MAX_PROJECTED * 3);

// Scratch for projected 2D vertices (flat x,y pairs)
const _proj2D = new Float64Array(MAX_PROJECTED * 2);

// Scratch for convex hull: sortable copy of 2D coords (flat x,y pairs)
// Sorted in-place so hull building uses direct offsets instead of index indirection
const _sortBuf = new Float64Array(MAX_PROJECTED * 2);

// ═══════════════════════════════════════════════════════════════════
// Main API
// ═══════════════════════════════════════════════════════════════════

/**
 * Build shadow mesh by projecting caster vertices onto receivers.
 *
 * @param {Array<Array<{x,y,z}>>} casterGroups  Per-caster unique vertex arrays
 * @param {Array}    receiverTris  All receiver triangles [{x,y,z},...][]
 * @param {number[]} lightDir      Normalised light travel direction
 * @returns {Array}  shadow triangles [{x,y,z},{x,y,z},{x,y,z}][] (unbiased)
 *
 * Note: returned vertices are NOT bias-offset.  Bias is applied at draw time
 * by the ShadowSystem so the camera position can change without a rebuild.
 */
/**
 * Pre-compute receiver plane groups.  The result can be cached and
 * passed to buildShadowMeshWithPlanes() to avoid re-grouping every frame.
 */
export { groupByPlane };

export function buildShadowMeshEx(casterGroups, receiverTris, lightDir) {
  if (casterGroups.length === 0 || receiverTris.length === 0) return [];
  const planeGroups = groupByPlane(receiverTris);
  return buildShadowMeshWithPlanes(casterGroups, planeGroups, lightDir);
}

/**
 * Build shadow mesh using pre-computed plane groups (from groupByPlane).
 * This is the fast path: skips the expensive plane grouping step.
 */
export function buildShadowMeshWithPlanes(casterGroups, planeGroups, lightDir) {
  if (casterGroups.length === 0 || planeGroups.length === 0) return [];

  const ldx = lightDir[0],
    ldy = lightDir[1],
    ldz = lightDir[2];

  // ── Precompute caster 3D AABBs ─────────────────────────────────
  const numCasters = casterGroups.length;
  // Flat: [minX, minY, minZ, maxX, maxY, maxZ] per caster
  const casterAABBs = new Float64Array(numCasters * 6);
  for (let ci = 0; ci < numCasters; ci++) {
    const verts = casterGroups[ci];
    if (verts.length === 0) continue;
    let mnx = verts[0].x,
      mny = verts[0].y,
      mnz = verts[0].z;
    let mxx = mnx,
      mxy = mny,
      mxz = mnz;
    for (let vi = 1; vi < verts.length; vi++) {
      const v = verts[vi];
      if (v.x < mnx) mnx = v.x;
      else if (v.x > mxx) mxx = v.x;
      if (v.y < mny) mny = v.y;
      else if (v.y > mxy) mxy = v.y;
      if (v.z < mnz) mnz = v.z;
      else if (v.z > mxz) mxz = v.z;
    }
    const off = ci * 6;
    casterAABBs[off] = mnx;
    casterAABBs[off + 1] = mny;
    casterAABBs[off + 2] = mnz;
    casterAABBs[off + 3] = mxx;
    casterAABBs[off + 4] = mxy;
    casterAABBs[off + 5] = mxz;
  }

  // ── For each plane × each caster, project + clip + triangulate ─
  const shadowTris = [];

  for (let gi = 0; gi < planeGroups.length; gi++) {
    const group = planeGroups[gi];
    const rawNx = group.rawNormal0,
      rawNy = group.rawNormal1,
      rawNz = group.rawNormal2;
    const rawD = group.rawD;
    const basisOx = group.basisOx,
      basisOy = group.basisOy,
      basisOz = group.basisOz;
    const basisUx = group.basisUx,
      basisUy = group.basisUy,
      basisUz = group.basisUz;
    const basisVx = group.basisVx,
      basisVy = group.basisVy,
      basisVz = group.basisVz;
    const tris = group.tris;
    const triVerts2D = group.triVerts2D; // precomputed CCW 2D verts (flat)

    // Plane group 3D AABB
    const gMinX = group.aabbMinX,
      gMinY = group.aabbMinY,
      gMinZ = group.aabbMinZ;
    const gMaxX = group.aabbMaxX,
      gMaxY = group.aabbMaxY,
      gMaxZ = group.aabbMaxZ;

    // denom = dot(lightDir, rawNormal)
    // If denom > 0, the plane faces away from the light → no shadows land here
    // If denom ≈ 0, light is parallel to the plane → skip
    // If denom < 0, the plane faces the light → shadows can land here
    let denom = ldx * rawNx + ldy * rawNy + ldz * rawNz;
    if (denom < -1e-8) continue; // plane faces away from light or parallel

    // Flip so denom > 0 for the projection math (t > 0 = forward along lightDir)
    let planeNx = -rawNx,
      planeNy = -rawNy,
      planeNz = -rawNz;
    let planeD = -rawD;
    denom = -denom;
    const invDenom = 1.0 / denom;

    // Process each caster independently
    for (let ci = 0; ci < numCasters; ci++) {
      const casterVerts = casterGroups[ci];
      const numVerts = casterVerts.length;
      if (numVerts < 3) continue;

      // ── 3D AABB cull: project caster AABB along light onto plane ──
      // Expand caster AABB in the light direction by a generous t range,
      // then check if it overlaps the plane group's AABB.
      const cOff = ci * 6;
      let sMinX = casterAABBs[cOff],
        sMinY = casterAABBs[cOff + 1],
        sMinZ = casterAABBs[cOff + 2];
      let sMaxX = casterAABBs[cOff + 3],
        sMaxY = casterAABBs[cOff + 4],
        sMaxZ = casterAABBs[cOff + 5];

      // Project the caster AABB corners along lightDir by a max reasonable t.
      // Use the furthest distance any caster vertex could project (plane distance).
      // A safe upper bound for t: project the AABB center onto the plane.
      const cx = (sMinX + sMaxX) * 0.5,
        cy = (sMinY + sMaxY) * 0.5,
        cz = (sMinZ + sMaxZ) * 0.5;
      const tCenter =
        -(cx * planeNx + cy * planeNy + cz * planeNz + planeD) * invDenom;
      // Use max(0, tCenter) * 1.5 as the projection extent (with generous margin)
      const tMax = Math.max(tCenter, 0) * 1.5 + 1.0;

      // Expand AABB by light direction * tMax
      if (ldx > 0) sMaxX += ldx * tMax;
      else sMinX += ldx * tMax;
      if (ldy > 0) sMaxY += ldy * tMax;
      else sMinY += ldy * tMax;
      if (ldz > 0) sMaxZ += ldz * tMax;
      else sMinZ += ldz * tMax;

      // Check overlap with plane group AABB
      if (
        sMaxX < gMinX ||
        sMinX > gMaxX ||
        sMaxY < gMinY ||
        sMinY > gMaxY ||
        sMaxZ < gMinZ ||
        sMinZ > gMaxZ
      ) {
        continue; // caster shadow can't reach this plane group
      }

      // ── Project caster vertices onto the plane (flat buffer) ──
      let projCount = 0;
      let hasForward = false;

      for (let vi = 0; vi < numVerts; vi++) {
        const v = casterVerts[vi];
        const vx = v.x,
          vy = v.y,
          vz = v.z;

        // Inline: t = -(dot(origin, planeN) + planeD) / denom
        let t =
          -(vx * planeNx + vy * planeNy + vz * planeNz + planeD) * invDenom;
        if (t > 0.001) hasForward = true;
        if (t < 0) t = 0;

        const px = vx + ldx * t;
        const py = vy + ldy * t;
        const pz = vz + ldz * t;

        // Dedup inline: check against existing projected points
        let isDupe = false;
        for (let di = 0; di < projCount; di++) {
          const off = di * 3;
          const dx = px - _proj3D[off];
          const dy = py - _proj3D[off + 1];
          const dz = pz - _proj3D[off + 2];
          if (dx * dx + dy * dy + dz * dz < 0.0001) {
            isDupe = true;
            break;
          }
        }
        if (!isDupe && projCount < MAX_PROJECTED) {
          const off = projCount * 3;
          _proj3D[off] = px;
          _proj3D[off + 1] = py;
          _proj3D[off + 2] = pz;
          projCount++;
        }
      }

      if (!hasForward || projCount < 3) continue;

      // ── Project to 2D (inline to2D) ──
      for (let pi = 0; pi < projCount; pi++) {
        const off3 = pi * 3;
        const dx = _proj3D[off3] - basisOx;
        const dy = _proj3D[off3 + 1] - basisOy;
        const dz = _proj3D[off3 + 2] - basisOz;
        const off2 = pi * 2;
        _proj2D[off2] = dx * basisUx + dy * basisUy + dz * basisUz;
        _proj2D[off2 + 1] = dx * basisVx + dy * basisVy + dz * basisVz;
      }

      // ── Convex hull (flat, in-place) ──
      const hullLen = convexHull2DFlat(_proj2D, projCount, _hullBuf);
      if (hullLen < 3) continue;

      // ── Compute hull AABB for early rejection ──
      let hMinX = _hullBuf[0],
        hMaxX = _hullBuf[0];
      let hMinY = _hullBuf[1],
        hMaxY = _hullBuf[1];
      for (let hi = 1; hi < hullLen; hi++) {
        const hx = _hullBuf[hi * 2];
        const hy = _hullBuf[hi * 2 + 1];
        if (hx < hMinX) hMinX = hx;
        else if (hx > hMaxX) hMaxX = hx;
        if (hy < hMinY) hMinY = hy;
        else if (hy > hMaxY) hMaxY = hy;
      }

      // ── Clip against each receiver triangle in this plane group ──
      const numTris = tris.length;
      for (let ti = 0; ti < numTris; ti++) {
        // Receiver tri 2D verts (precomputed, CCW, flat x,y x 3)
        const tvOff = ti * 6;
        const t0x = triVerts2D[tvOff],
          t0y = triVerts2D[tvOff + 1];
        const t1x = triVerts2D[tvOff + 2],
          t1y = triVerts2D[tvOff + 3];
        const t2x = triVerts2D[tvOff + 4],
          t2y = triVerts2D[tvOff + 5];

        // ── AABB overlap test (early exit) ──
        let tMinX = t0x,
          tMaxX = t0x;
        let tMinY = t0y,
          tMaxY = t0y;
        if (t1x < tMinX) tMinX = t1x;
        else if (t1x > tMaxX) tMaxX = t1x;
        if (t2x < tMinX) tMinX = t2x;
        else if (t2x > tMaxX) tMaxX = t2x;
        if (t1y < tMinY) tMinY = t1y;
        else if (t1y > tMaxY) tMaxY = t1y;
        if (t2y < tMinY) tMinY = t2y;
        else if (t2y > tMaxY) tMaxY = t2y;

        if (hMaxX < tMinX || hMinX > tMaxX || hMaxY < tMinY || hMinY > tMaxY) {
          continue; // no overlap — skip expensive clip
        }

        // ── Sutherland-Hodgman clip (flat buffers) ──
        const clippedLen = clipPolygonFlat(
          _hullBuf,
          hullLen,
          t0x,
          t0y,
          t1x,
          t1y,
          t2x,
          t2y,
          _clipA,
          _clipB,
        );
        if (clippedLen < 3) continue;

        // The result sits in _clipA (guaranteed by clipPolygonFlat)
        // ── Fan-triangulate + convert back to 3D {x,y,z} objects ──
        // First vertex (fan pivot) — inline to3D
        const p0u = _clipA[0],
          p0v = _clipA[1];
        const v0x = basisOx + p0u * basisUx + p0v * basisVx;
        const v0y = basisOy + p0u * basisUy + p0v * basisVy;
        const v0z = basisOz + p0u * basisUz + p0v * basisVz;

        for (let fi = 1; fi < clippedLen - 1; fi++) {
          const off1 = fi * 2;
          const off2 = (fi + 1) * 2;
          const p1u = _clipA[off1],
            p1v = _clipA[off1 + 1];
          const p2u = _clipA[off2],
            p2v = _clipA[off2 + 1];

          shadowTris.push([
            { x: v0x, y: v0y, z: v0z },
            {
              x: basisOx + p1u * basisUx + p1v * basisVx,
              y: basisOy + p1u * basisUy + p1v * basisVy,
              z: basisOz + p1u * basisUz + p1v * basisVz,
            },
            {
              x: basisOx + p2u * basisUx + p2v * basisVx,
              y: basisOy + p2u * basisUy + p2v * basisVy,
              z: basisOz + p2u * basisUz + p2v * basisVz,
            },
          ]);
        }
      }
    }
  }

  return shadowTris;
}

/**
 * Return receiver triangles whose faces point away from the light.
 * These faces are entirely in self-shadow and should be darkened.
 *
 * This is completely independent from cast shadow projection.
 *
 * @param {Array}    receiverTris  All receiver triangles [{x,y,z},...][]
 * @param {number[]} lightDir      Normalised light travel direction
 * @returns {Array}  triangles [{x,y,z},{x,y,z},{x,y,z}][]
 */
export function buildBackfaceTris(receiverTris, lightDir) {
  const result = [];
  const lx = lightDir[0],
    ly = lightDir[1],
    lz = lightDir[2];

  for (let i = 0; i < receiverTris.length; i++) {
    const tri = receiverTris[i];
    const ax = tri[0].x,
      ay = tri[0].y,
      az = tri[0].z;
    const bx = tri[1].x,
      by = tri[1].y,
      bz = tri[1].z;
    const cx = tri[2].x,
      cy = tri[2].y,
      cz = tri[2].z;

    // Inline: e1 = sub(v1, v0), e2 = sub(v2, v0)
    const e1x = bx - ax,
      e1y = by - ay,
      e1z = bz - az;
    const e2x = cx - ax,
      e2y = cy - ay,
      e2z = cz - az;

    // Inline: n = cross(e1, e2)
    const nx = e1y * e2z - e1z * e2y;
    const ny = e1z * e2x - e1x * e2z;
    const nz = e1x * e2y - e1y * e2x;

    const len = nx * nx + ny * ny + nz * nz; // squared length
    if (len < 1e-20) continue;

    // Inline: d = dot(lightDir, n)
    // lightDir here is already negated by the caller (points FROM surface
    // TOWARD light).  dot > 0 means the face normal agrees with the light
    // direction → face looks toward the light → NOT a backface → skip it.
    const d = lx * nx + ly * ny + lz * nz;
    if (d <= 0) continue;

    result.push([
      { x: ax, y: ay, z: az },
      { x: bx, y: by, z: bz },
      { x: cx, y: cy, z: cz },
    ]);
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════════
// helpers
// ═══════════════════════════════════════════════════════════════════

/**
 * Collect unique vertices from a list of triangles.
 */
export function collectUniqueVertices(tris) {
  const seen = new Set();
  const result = [];
  const precision = 100;

  for (const tri of tris) {
    for (const v of tri) {
      const key = `${Math.round(v.x * precision)},${Math.round(v.y * precision)},${Math.round(v.z * precision)}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(v);
      }
    }
  }
  return result;
}

// ─── plane grouping ──────────────────────────────────────────────

/**
 * Group receiver triangles by coplanar plane.
 *
 * Returns array of flat-struct groups with precomputed basis components
 * and CCW 2D triangle vertices (flat Float64Array, 6 floats per tri).
 */
function groupByPlane(receiverTris) {
  const groups = [];
  const EPS = 0.1;

  for (let idx = 0; idx < receiverTris.length; idx++) {
    const tri = receiverTris[idx];
    const v0x = tri[0].x,
      v0y = tri[0].y,
      v0z = tri[0].z;
    const v1x = tri[1].x,
      v1y = tri[1].y,
      v1z = tri[1].z;
    const v2x = tri[2].x,
      v2y = tri[2].y,
      v2z = tri[2].z;

    // Inline: edge1 = sub(v1, v0), edge2 = sub(v2, v0)
    const e1x = v1x - v0x,
      e1y = v1y - v0y,
      e1z = v1z - v0z;
    const e2x = v2x - v0x,
      e2y = v2y - v0y,
      e2z = v2z - v0z;

    // Inline: n = cross(e1, e2)
    let nx = e1y * e2z - e1z * e2y;
    let ny = e1z * e2x - e1x * e2z;
    let nz = e1x * e2y - e1y * e2x;

    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (len < 1e-10) continue;
    const invLen = 1.0 / len;
    nx *= invLen;
    ny *= invLen;
    nz *= invLen;

    const rawNx = nx,
      rawNy = ny,
      rawNz = nz;
    const rawD = -(rawNx * v0x + rawNy * v0y + rawNz * v0z);

    // Canonicalize for grouping
    const ax = Math.abs(nx),
      ay = Math.abs(ny),
      az = Math.abs(nz);
    let flip = false;
    if (az >= ax && az >= ay) flip = nz < 0;
    else if (ay >= ax) flip = ny < 0;
    else flip = nx < 0;
    if (flip) {
      nx = -nx;
      ny = -ny;
      nz = -nz;
    }

    const d = -(nx * v0x + ny * v0y + nz * v0z);

    let found = false;
    for (let gi = 0; gi < groups.length; gi++) {
      const g = groups[gi];
      const nd = Math.abs(g.canonNx * nx + g.canonNy * ny + g.canonNz * nz);
      if (nd > 1 - 1e-4 && Math.abs(g.canonD - d) < EPS) {
        g.tris.push(tri);
        // Expand 3D AABB
        if (v0x < g.aabbMinX) g.aabbMinX = v0x;
        if (v1x < g.aabbMinX) g.aabbMinX = v1x;
        if (v2x < g.aabbMinX) g.aabbMinX = v2x;
        if (v0x > g.aabbMaxX) g.aabbMaxX = v0x;
        if (v1x > g.aabbMaxX) g.aabbMaxX = v1x;
        if (v2x > g.aabbMaxX) g.aabbMaxX = v2x;
        if (v0y < g.aabbMinY) g.aabbMinY = v0y;
        if (v1y < g.aabbMinY) g.aabbMinY = v1y;
        if (v2y < g.aabbMinY) g.aabbMinY = v2y;
        if (v0y > g.aabbMaxY) g.aabbMaxY = v0y;
        if (v1y > g.aabbMaxY) g.aabbMaxY = v1y;
        if (v2y > g.aabbMaxY) g.aabbMaxY = v2y;
        if (v0z < g.aabbMinZ) g.aabbMinZ = v0z;
        if (v1z < g.aabbMinZ) g.aabbMinZ = v1z;
        if (v2z < g.aabbMinZ) g.aabbMinZ = v2z;
        if (v0z > g.aabbMaxZ) g.aabbMaxZ = v0z;
        if (v1z > g.aabbMaxZ) g.aabbMaxZ = v1z;
        if (v2z > g.aabbMaxZ) g.aabbMaxZ = v2z;
        // Append precomputed CCW 2D verts for this triangle
        _appendTriVerts2D(g, tri);
        found = true;
        break;
      }
    }

    if (!found) {
      // Build plane basis (inlined)
      let upx = 0,
        upy = 0,
        upz = 1;
      const dotNU = nx * upx + ny * upy + nz * upz;
      if (dotNU > 0.9 || dotNU < -0.9) {
        upx = 0;
        upy = 1;
        upz = 0;
      }

      // u = cross(up, normal)
      let ux = upy * nz - upz * ny;
      let uy = upz * nx - upx * nz;
      let uz = upx * ny - upy * nx;
      const uLen = Math.sqrt(ux * ux + uy * uy + uz * uz);
      const invULen = 1.0 / uLen;
      ux *= invULen;
      uy *= invULen;
      uz *= invULen;

      // v = cross(normal, u)
      const vx = ny * uz - nz * uy;
      const vy = nz * ux - nx * uz;
      const vz = nx * uy - ny * ux;

      // Initial 3D AABB from first triangle's 3 verts
      const iMinX = Math.min(v0x, v1x, v2x),
        iMaxX = Math.max(v0x, v1x, v2x);
      const iMinY = Math.min(v0y, v1y, v2y),
        iMaxY = Math.max(v0y, v1y, v2y);
      const iMinZ = Math.min(v0z, v1z, v2z),
        iMaxZ = Math.max(v0z, v1z, v2z);

      const g = {
        canonNx: nx,
        canonNy: ny,
        canonNz: nz,
        canonD: d,
        rawNormal0: rawNx,
        rawNormal1: rawNy,
        rawNormal2: rawNz,
        rawD,
        basisOx: v0x,
        basisOy: v0y,
        basisOz: v0z,
        basisUx: ux,
        basisUy: uy,
        basisUz: uz,
        basisVx: vx,
        basisVy: vy,
        basisVz: vz,
        tris: [tri],
        triVerts2D: new Float64Array(64 * 6), // grows if needed
        triVerts2DCount: 0,
        triVerts2DCap: 64,
        aabbMinX: iMinX,
        aabbMinY: iMinY,
        aabbMinZ: iMinZ,
        aabbMaxX: iMaxX,
        aabbMaxY: iMaxY,
        aabbMaxZ: iMaxZ,
      };
      _appendTriVerts2D(g, tri);
      groups.push(g);
    }
  }

  return groups;
}

/**
 * Append a receiver triangle's 2D CCW vertices to a plane group's flat array.
 * Ensures CCW winding so clipPolygonFlat doesn't need to re-check.
 */
function _appendTriVerts2D(group, tri) {
  const ox = group.basisOx,
    oy = group.basisOy,
    oz = group.basisOz;
  const ux = group.basisUx,
    uy = group.basisUy,
    uz = group.basisUz;
  const vx = group.basisVx,
    vy = group.basisVy,
    vz = group.basisVz;

  // Inline to2D for all 3 verts
  let dx, dy, dz;
  dx = tri[0].x - ox;
  dy = tri[0].y - oy;
  dz = tri[0].z - oz;
  const p0x = dx * ux + dy * uy + dz * uz;
  const p0y = dx * vx + dy * vy + dz * vz;

  dx = tri[1].x - ox;
  dy = tri[1].y - oy;
  dz = tri[1].z - oz;
  const p1x = dx * ux + dy * uy + dz * uz;
  const p1y = dx * vx + dy * vy + dz * vz;

  dx = tri[2].x - ox;
  dy = tri[2].y - oy;
  dz = tri[2].z - oz;
  const p2x = dx * ux + dy * uy + dz * uz;
  const p2y = dx * vx + dy * vy + dz * vz;

  // Ensure CCW winding (signed area test)
  // area = (p1x - p0x)*(p1y + p0y) + (p2x - p1x)*(p2y + p1y) + (p0x - p2x)*(p0y + p2y)
  const area =
    (p1x - p0x) * (p1y + p0y) +
    (p2x - p1x) * (p2y + p1y) +
    (p0x - p2x) * (p0y + p2y);

  // Grow buffer if needed
  if (group.triVerts2DCount >= group.triVerts2DCap) {
    const newCap = group.triVerts2DCap * 2;
    const newBuf = new Float64Array(newCap * 6);
    newBuf.set(group.triVerts2D);
    group.triVerts2D = newBuf;
    group.triVerts2DCap = newCap;
  }

  const off = group.triVerts2DCount * 6;
  if (area > 0) {
    // CW → reverse to CCW: swap v1 and v2
    group.triVerts2D[off] = p0x;
    group.triVerts2D[off + 1] = p0y;
    group.triVerts2D[off + 2] = p2x;
    group.triVerts2D[off + 3] = p2y;
    group.triVerts2D[off + 4] = p1x;
    group.triVerts2D[off + 5] = p1y;
  } else {
    group.triVerts2D[off] = p0x;
    group.triVerts2D[off + 1] = p0y;
    group.triVerts2D[off + 2] = p1x;
    group.triVerts2D[off + 3] = p1y;
    group.triVerts2D[off + 4] = p2x;
    group.triVerts2D[off + 5] = p2y;
  }
  group.triVerts2DCount++;
}

// ─── convex hull (flat, direct sort) ─────────────────────────────

/**
 * 2D convex hull (Andrew's monotone chain) operating on a flat
 * Float64Array of (x,y) pairs.
 *
 * Sorts a copy of the points directly (no index indirection) for
 * better cache locality and fewer memory lookups per comparison.
 *
 * @param {Float64Array} pts     Flat array of x,y pairs
 * @param {number}       count   Number of points
 * @param {Float64Array} out     Output buffer for hull x,y pairs
 * @returns {number}             Number of hull vertices written to `out`
 */
function convexHull2DFlat(pts, count, out) {
  if (count < 3) {
    for (let i = 0; i < count * 2; i++) out[i] = pts[i];
    return count;
  }

  // Copy into sortable scratch buffer (direct x,y pairs)
  const n2 = count * 2;
  for (let i = 0; i < n2; i++) _sortBuf[i] = pts[i];

  // Insertion sort on x,y pairs (stride 2) — fast for small n, no indirection
  for (let i = 1; i < count; i++) {
    const kx = _sortBuf[i * 2],
      ky = _sortBuf[i * 2 + 1];
    let j = i - 1;
    while (j >= 0) {
      const jx = _sortBuf[j * 2];
      if (jx < kx || (jx === kx && _sortBuf[j * 2 + 1] <= ky)) break;
      // Shift pair right
      _sortBuf[(j + 1) * 2] = _sortBuf[j * 2];
      _sortBuf[(j + 1) * 2 + 1] = _sortBuf[j * 2 + 1];
      j--;
    }
    _sortBuf[(j + 1) * 2] = kx;
    _sortBuf[(j + 1) * 2 + 1] = ky;
  }

  // Build lower hull into `out`
  let lowerLen = 0;
  for (let i = 0; i < count; i++) {
    const px = _sortBuf[i * 2],
      py = _sortBuf[i * 2 + 1];
    while (lowerLen >= 2) {
      const o2 = (lowerLen - 2) * 2,
        o1 = (lowerLen - 1) * 2;
      if (
        (out[o1] - out[o2]) * (py - out[o2 + 1]) -
          (out[o1 + 1] - out[o2 + 1]) * (px - out[o2]) >
        0
      )
        break;
      lowerLen--;
    }
    out[lowerLen * 2] = px;
    out[lowerLen * 2 + 1] = py;
    lowerLen++;
  }

  // Build upper hull into _clipB (safe — not in use yet)
  let upperLen = 0;
  for (let i = count - 1; i >= 0; i--) {
    const px = _sortBuf[i * 2],
      py = _sortBuf[i * 2 + 1];
    while (upperLen >= 2) {
      const o2 = (upperLen - 2) * 2,
        o1 = (upperLen - 1) * 2;
      if (
        (_clipB[o1] - _clipB[o2]) * (py - _clipB[o2 + 1]) -
          (_clipB[o1 + 1] - _clipB[o2 + 1]) * (px - _clipB[o2]) >
        0
      )
        break;
      upperLen--;
    }
    _clipB[upperLen * 2] = px;
    _clipB[upperLen * 2 + 1] = py;
    upperLen++;
  }

  // Merge: lower (skip last) + upper (skip last) = hull
  const totalLen = lowerLen - 1 + (upperLen - 1);
  const upperStart = (lowerLen - 1) * 2;
  for (let i = 0; i < upperLen - 1; i++) {
    out[upperStart + i * 2] = _clipB[i * 2];
    out[upperStart + i * 2 + 1] = _clipB[i * 2 + 1];
  }

  return totalLen;
}

// ─── polygon clipping (Sutherland-Hodgman, flat buffers) ─────────

/**
 * Clip a convex polygon against a CCW triangle using Sutherland-Hodgman.
 * All coordinates are flat (x,y) pairs in pre-allocated buffers.
 *
 * @param {Float64Array} polyBuf  Input polygon (x,y pairs)
 * @param {number}       polyLen  Number of vertices in polygon
 * @param {number} t0x,t0y,t1x,t1y,t2x,t2y  Triangle vertices (already CCW)
 * @param {Float64Array} bufA     Scratch buffer A (also used for output)
 * @param {Float64Array} bufB     Scratch buffer B
 * @returns {number}              Number of clipped vertices (result in bufA)
 */
function clipPolygonFlat(
  polyBuf,
  polyLen,
  t0x,
  t0y,
  t1x,
  t1y,
  t2x,
  t2y,
  bufA,
  bufB,
) {
  // Copy input polygon into bufA
  for (let i = 0; i < polyLen * 2; i++) {
    bufA[i] = polyBuf[i];
  }
  let inBuf = bufA,
    outBuf = bufB;
  let inLen = polyLen;

  // 3 edges of the triangle
  const edgesX = [t0x, t1x, t2x];
  const edgesY = [t0y, t1y, t2y];

  for (let ei = 0; ei < 3; ei++) {
    if (inLen === 0) return 0;

    const esx = edgesX[ei],
      esy = edgesY[ei];
    const eex = edgesX[(ei + 1) % 3],
      eey = edgesY[(ei + 1) % 3];

    // Edge direction
    const edx = eex - esx,
      edy = eey - esy;

    let outLen = 0;

    // Last point (wrapping)
    let prevOff = (inLen - 1) * 2;
    let prevX = inBuf[prevOff],
      prevY = inBuf[prevOff + 1];
    let prevSide = edx * (prevY - esy) - edy * (prevX - esx);
    let prevInside = prevSide >= -1e-6;

    for (let j = 0; j < inLen; j++) {
      const curOff = j * 2;
      const curX = inBuf[curOff],
        curY = inBuf[curOff + 1];
      const curSide = edx * (curY - esy) - edy * (curX - esx);
      const curInside = curSide >= -1e-6;

      if (curInside) {
        if (!prevInside) {
          // Compute intersection prev→cur with edge
          const dx1 = curX - prevX,
            dy1 = curY - prevY;
          const denom = dx1 * edy - dy1 * edx;
          if (Math.abs(denom) > 1e-10) {
            const t = ((esx - prevX) * edy - (esy - prevY) * edx) / denom;
            const oOff = outLen * 2;
            outBuf[oOff] = prevX + t * dx1;
            outBuf[oOff + 1] = prevY + t * dy1;
            outLen++;
          }
        }
        const oOff = outLen * 2;
        outBuf[oOff] = curX;
        outBuf[oOff + 1] = curY;
        outLen++;
      } else if (prevInside) {
        const dx1 = curX - prevX,
          dy1 = curY - prevY;
        const denom = dx1 * edy - dy1 * edx;
        if (Math.abs(denom) > 1e-10) {
          const t = ((esx - prevX) * edy - (esy - prevY) * edx) / denom;
          const oOff = outLen * 2;
          outBuf[oOff] = prevX + t * dx1;
          outBuf[oOff + 1] = prevY + t * dy1;
          outLen++;
        }
      }

      prevX = curX;
      prevY = curY;
      prevSide = curSide;
      prevInside = curInside;
    }

    // Swap buffers
    const tmp = inBuf;
    inBuf = outBuf;
    outBuf = tmp;
    inLen = outLen;
  }

  // Result is in inBuf. If inBuf !== bufA, copy to bufA.
  if (inBuf !== bufA) {
    for (let i = 0; i < inLen * 2; i++) {
      bufA[i] = inBuf[i];
    }
  }

  return inLen;
}
