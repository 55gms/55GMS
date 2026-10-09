// gizmoMeshBatcher.js
// Deferred, per-color mesh batcher for the gizmo renderer.
//
// It wraps the raw C3 renderer as a transparent proxy: `drawMesh` and `quad3D`
// are accumulated into per-color buffers and submitted in batches at
// `flushBatch()` time (one drawMesh per color, chunked at the Uint16 vertex
// limit). Every other call — 2D primitives (line/rect2/lineRect/convexPoly),
// line width, fill mode — forwards to the real renderer immediately. This lets
// the existing GizmoRenderer draw methods run unchanged; only `this.renderer`
// becomes this proxy.
//
// Batching is scoped per begin/flush. GizmoManager.renderAll brackets one
// begin/flush around each layer's gizmos, so each layer flushes independently
// (no cross-layer geometry merging) and draw-call count collapses to roughly
// (distinct colors) per layer.
//
// Caveats the caller relies on:
//  - 2D primitives draw immediately, so within a layer all batched 3D geometry
//    is submitted at flush (end of that layer) AFTER any 2D draws of the layer.
//  - Reordering geometry by color is correct for opaque, depth-tested gizmos.
//    Translucent gizmos that overlap and rely on submission order may blend
//    differently; per-primitive alpha animation also fragments color buckets.

const MAX_VERTS = 65535; // Uint16 index ceiling for a single drawMesh

class Batcher {
  constructor(real, opts = {}) {
    this.real = real;
    this._cur = [1, 1, 1, 1]; // current color
    this._buckets = new Map(); // colorKey -> bucket

    // Future hook: if the C3 build ever exposes a per-vertex-color mesh API, a
    // single batch could hold mixed colors (no per-color bucketing). Assumed
    // unavailable for now; warn loudly rather than silently degrade if asked.
    this.useVertexColor = !!opts.useVertexColor;
    if (this.useVertexColor && typeof real.drawMeshColored !== "function") {
      console.warn(
        "[gizmoMeshBatcher] useVertexColor requested but renderer.drawMeshColored " +
          "is unavailable, falling back to per-color batching.",
      );
      this.useVertexColor = false;
    }
  }

  // Color taps: remember the current color for batching AND forward so any
  // immediate (2D) draws still get the right color.
  setColorRgba(r, g, b, a) {
    this._cur = [r, g, b, a];
    this.real.setColorRgba(r, g, b, a);
  }
  resetColor() {
    this._cur = [1, 1, 1, 1];
    this.real.resetColor();
  }

  drawMesh(pos, uv, idx) {
    const nv = pos.length / 3;
    const bucket = this._bucket(this._cur);
    if (bucket.vCount + nv > MAX_VERTS) this._emit(bucket);
    this._ensure(bucket, nv, idx.length);
    bucket.pos.set(pos, bucket.vCount * 3);
    bucket.uv.set(uv, bucket.vCount * 2);
    const base = bucket.vCount;
    const io = bucket.iCount;
    for (let k = 0; k < idx.length; k++) bucket.idx[io + k] = idx[k] + base;
    bucket.iCount += idx.length;
    bucket.vCount += nv;
  }

  // quad3D(...12 coords, rect) -> 2 triangles. Gizmos are untextured fills, so
  // UVs are irrelevant (written as zeros) and the rect argument is ignored.
  quad3D(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz) {
    const bucket = this._bucket(this._cur);
    if (bucket.vCount + 4 > MAX_VERTS) this._emit(bucket);
    this._ensure(bucket, 4, 6);
    const o = bucket.vCount * 3;
    const p = bucket.pos;
    p[o] = ax;
    p[o + 1] = ay;
    p[o + 2] = az;
    p[o + 3] = bx;
    p[o + 4] = by;
    p[o + 5] = bz;
    p[o + 6] = cx;
    p[o + 7] = cy;
    p[o + 8] = cz;
    p[o + 9] = dx;
    p[o + 10] = dy;
    p[o + 11] = dz;
    const uo = bucket.vCount * 2;
    const u = bucket.uv;
    u[uo] = 0;
    u[uo + 1] = 0;
    u[uo + 2] = 1;
    u[uo + 3] = 0;
    u[uo + 4] = 1;
    u[uo + 5] = 1;
    u[uo + 6] = 0;
    u[uo + 7] = 1;
    const base = bucket.vCount;
    const q = bucket.idx;
    const io = bucket.iCount;
    q[io] = base;
    q[io + 1] = base + 1;
    q[io + 2] = base + 2;
    q[io + 3] = base;
    q[io + 4] = base + 2;
    q[io + 5] = base + 3;
    bucket.iCount += 6;
    bucket.vCount += 4;
  }

  // Lifecycle: reset buffers at the start of a layer, flush at the end.
  beginBatch() {
    for (const b of this._buckets.values()) {
      b.vCount = 0;
      b.iCount = 0;
    }
  }
  flushBatch() {
    for (const b of this._buckets.values()) this._emit(b);
  }

  _bucket(color) {
    const key = color[0] + "," + color[1] + "," + color[2] + "," + color[3];
    let b = this._buckets.get(key);
    if (!b) {
      b = {
        color: [color[0], color[1], color[2], color[3]],
        pos: new Float32Array(256 * 3),
        uv: new Float32Array(256 * 2),
        idx: new Uint16Array(256 * 3),
        vCount: 0,
        iCount: 0,
      };
      this._buckets.set(key, b);
    }
    return b;
  }

  _ensure(bucket, addV, addI) {
    const needV = (bucket.vCount + addV) * 3;
    if (bucket.pos.length < needV) {
      let cap = bucket.pos.length;
      while (cap < needV) cap *= 2;
      bucket.pos = growF32(bucket.pos, cap);
      bucket.uv = growF32(bucket.uv, (cap / 3) * 2);
    }
    const needI = bucket.iCount + addI;
    if (bucket.idx.length < needI) {
      let cap = bucket.idx.length;
      while (cap < needI) cap *= 2;
      bucket.idx = growU16(bucket.idx, cap);
    }
  }

  _emit(bucket) {
    if (bucket.vCount === 0) return;
    const c = bucket.color;
    this.real.setColorRgba(c[0], c[1], c[2], c[3]);
    this.real.setColorFillMode();
    this.real.drawMesh(
      bucket.pos.subarray(0, bucket.vCount * 3),
      bucket.uv.subarray(0, bucket.vCount * 2),
      bucket.idx.subarray(0, bucket.iCount),
    );
    bucket.vCount = 0;
    bucket.iCount = 0;
  }
}

function growF32(arr, newLen) {
  const next = new Float32Array(newLen);
  next.set(arr);
  return next;
}
function growU16(arr, newLen) {
  const next = new Uint16Array(newLen);
  next.set(arr);
  return next;
}

// Wrap a real renderer. Methods on the Batcher are used; everything else
// forwards to the real renderer. Bound functions are cached so the hot path
// allocates nothing per call.
export function createGizmoMeshBatcher(real, opts) {
  const batcher = new Batcher(real, opts);
  const boundCache = new Map();
  return new Proxy(batcher, {
    get(target, prop) {
      let f = boundCache.get(prop);
      if (f) return f;
      if (prop in target) {
        const v = target[prop];
        if (typeof v !== "function") return v;
        f = v.bind(target);
      } else {
        const rv = real[prop];
        if (typeof rv !== "function") return rv;
        f = rv.bind(real);
      }
      boundCache.set(prop, f);
      return f;
    },
    set(target, prop, value) {
      if (prop in target) target[prop] = value;
      else real[prop] = value;
      return true;
    },
  });
}
