/**
 * shadowRenderer.js — Draws shadow triangles through the C3 WebGL renderer.
 *
 * The renderer is passed per-call (from the layer's afterdraw event)
 * so it always carries the correct camera / layer transform.
 *
 * This is the *only* file that talks to the Construct 3 renderer object.
 *
 * Z-fighting avoidance:
 *   Uses GPU-level depth bias via the renderer's SetDepthBiasEnabled()
 *   method (added by the override in main.js).
 *   - WebGL: uses glPolygonOffset(-1, -1) to push shadow fragments
 *     slightly toward the camera in the depth buffer.
 *   - WebGPU: uses a custom pipeline variant (e=5) with depthBias and
 *     depthBiasSlopeScale set on the GPUDepthStencilState.
 *   Both approaches keep depth testing ON, so shadows behind walls are
 *   correctly occluded — only the coplanar z-fighting is eliminated.
 */

export class ShadowRenderer {
  // ── public draw methods ───────────────────────────────────────────

  /**
   * Draw shadow triangles one-by-one (simple, fine for small counts).
   *
   * @param {object}   renderer    The C3 renderer from e.renderer
   * @param {Array}    shadowTris  [{x,y,z},{x,y,z},{x,y,z}] each
   * @param {number[]} color       [r, g, b] 0-1
   * @param {number}   opacity     0-1
   */
  drawShadows(renderer, shadowTris, color = [0, 0, 0], opacity = 0.5) {
    if (shadowTris.length === 0) return;

    const c3r = globalThis._c3Renderer;

    // Premultiplied alpha: multiply RGB by opacity
    const r = color[0] * opacity;
    const g = color[1] * opacity;
    const b = color[2] * opacity;

    renderer.setAlphaBlendMode();
    renderer.setColorFillMode();
    renderer.setColorRgba(r, g, b, opacity);

    // Enable depth bias so shadow fragments are pushed slightly toward
    // the camera, eliminating z-fighting with coplanar receiver surfaces.
    // Depth testing stays ON, so occluded shadows behind walls are hidden.
    if (c3r) {
      c3r.SetDepthBiasEnabled(true);
      c3r.SetDepthWriteEnabled(false);
    }

    for (const tri of shadowTris) {
      this._drawTri3D(renderer, tri[0], tri[1], tri[2]);
    }

    if (c3r) {
      c3r.SetDepthBiasEnabled(false);
      c3r.SetDepthWriteEnabled(true);
    }

    renderer.resetColor();
  }

  /**
   * Draw shadow triangles as a single batched mesh call (faster).
   *
   * @param {object}   renderer    The C3 renderer from e.renderer
   * @param {Array}    shadowTris  Array of triangles
   * @param {number[]} color       [r, g, b] 0-1
   * @param {number}   opacity     0-1
   */
  drawShadowsBatched(renderer, shadowTris, color = [0, 0, 0], opacity = 0.5) {
    if (shadowTris.length === 0) return;

    const count = shadowTris.length;

    renderer.setColorFillMode();
    renderer.setColorRgba(color[0], color[1], color[2], opacity);

    const posArr = new Float32Array(count * 9); // 3 verts × 3 coords
    const uvArr = new Float32Array(count * 6); // 3 verts × 2 UVs (zeroed)
    const idxArr = new Uint16Array(count * 3);

    for (let i = 0; i < count; i++) {
      const tri = shadowTris[i];
      const p = i * 9;
      const idx = i * 3;

      posArr[p] = tri[0].x;
      posArr[p + 1] = tri[0].y;
      posArr[p + 2] = tri[0].z;
      posArr[p + 3] = tri[1].x;
      posArr[p + 4] = tri[1].y;
      posArr[p + 5] = tri[1].z;
      posArr[p + 6] = tri[2].x;
      posArr[p + 7] = tri[2].y;
      posArr[p + 8] = tri[2].z;

      idxArr[idx] = idx;
      idxArr[idx + 1] = idx + 1;
      idxArr[idx + 2] = idx + 2;
    }

    renderer.drawMesh(posArr, uvArr, idxArr);
    renderer.resetColor();
  }

  // ── debug: draw triangle wireframes ────────────────────────────────

  /**
   * Draw wireframe outlines of triangles for debugging.
   * Each triangle is drawn as 3 lines.
   *
   * @param {object}   renderer   The C3 renderer from e.renderer
   * @param {Array}    tris       Array of [{x,y,z},{x,y,z},{x,y,z}]
   * @param {number[]} color      [r, g, b, a] — RGBA 0-1
   * @param {number}   lineWidth  Line width in pixels
   */
  drawDebugTriangles(renderer, tris, color = [1, 1, 1, 1], lineWidth = 1) {
    if (tris.length === 0) return;

    const premulR = color[0] * color[3];
    const premulG = color[1] * color[3];
    const premulB = color[2] * color[3];

    renderer.setAlphaBlendMode();
    renderer.setColorFillMode();
    renderer.setColorRgba(premulR, premulG, premulB, color[3]);
    renderer.pushLineWidth(lineWidth);

    for (const tri of tris) {
      const a = tri[0],
        b = tri[1],
        c = tri[2];
      // Draw each edge as a thin quad3D (line approximation)
      this._drawLine3D(renderer, a, b, lineWidth);
      this._drawLine3D(renderer, b, c, lineWidth);
      this._drawLine3D(renderer, c, a, lineWidth);
    }

    renderer.popLineWidth();
    renderer.resetColor();
  }

  // ── private ───────────────────────────────────────────────────────

  _drawTri3D(renderer, a, b, c) {
    renderer.quad3D(
      a.x,
      a.y,
      a.z,
      b.x,
      b.y,
      b.z,
      c.x,
      c.y,
      c.z,
      c.x,
      c.y,
      c.z, // degenerate 4th vertex = triangle
      { left: 0, top: 0, right: 0, bottom: 0 },
    );
  }

  /**
   * Draw a 3D line as a thin quad between two points.
   */
  _drawLine3D(renderer, a, b, thickness = 1) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dz = b.z - a.z;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (len === 0) return;

    const half = thickness * 0.5;

    // Find a perpendicular vector for thickness
    const nx = dx / len,
      ny = dy / len,
      nz = dz / len;
    let px, py, pz;
    if (Math.abs(nx) < 0.9) {
      px = 0;
      py = nz;
      pz = -ny;
    } else {
      px = nz;
      py = 0;
      pz = -nx;
    }
    const pl = Math.sqrt(px * px + py * py + pz * pz);
    px = (px / pl) * half;
    py = (py / pl) * half;
    pz = (pz / pl) * half;

    renderer.quad3D(
      a.x + px,
      a.y + py,
      a.z + pz,
      a.x - px,
      a.y - py,
      a.z - pz,
      b.x - px,
      b.y - py,
      b.z - pz,
      b.x + px,
      b.y + py,
      b.z + pz,
      { left: 0, top: 0, right: 0, bottom: 0 },
    );
  }
}
