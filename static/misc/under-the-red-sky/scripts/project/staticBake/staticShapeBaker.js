// staticShapeBaker.js
// Bakes static Shape3D instances into a few large textured meshes and draws
// them with renderer.DrawMesh from the source layer's "beforedraw" event.
//
// Why: each Shape3D instance costs per-frame JS (6 quads rebuilt + sorted) and
// a texture switch per face, i.e. a WebGL draw call per face in mixed-material
// levels. Baking collapses that to (textures x spatial chunks) draw calls with
// zero per-instance work.
//
// Contract (see staticIndex.js for the config):
//  - Runs ONCE per layout run, from bakeCurrentLayout(). Instances created
//    afterwards are never touched — they simply keep drawing themselves.
//  - Eligible = member of a configured source (family or object type), Shape3D
//    plugin, no parent, visible, opacity 1, normal blend, no active effect, not
//    on an excluded layer, not explicitly excluded (labels, see levelLoader).
//  - Baked instances are moved to a hidden runtime-created layer
//    ("<prefix><sourceLayer>") so C3 stops drawing them; nothing on the
//    instance itself is changed (visibility, opacity, collisions all intact).
//  - Destroying a baked instance drops its triangles (indices are collapsed to
//    a degenerate triangle in place; no reallocation).
//  - Buckets are chunked on a world grid and frustum-culled per frame against
//    the renderer's current projection * modelview.
//  - serialize()/applyPrebake() round-trip the baked buffers so a shipped build
//    can skip the bake later (validated by a signature over the eligible
//    instances; mismatch falls back to a live bake).
//
// Internal runtime access (globalThis.sdk_runtime, like imageHelper.js) is
// required: the public script API exposes neither face objects nor textures.

import { computeShapeFaces } from "./shape3dFaces.js";

const MAX_QUADS_PER_PART = 16383; // 65535-vertex DrawMesh limit / 4
const CULL_MODE = { none: 0, back: 1, front: 2 };
const FRONT_FACE = { cw: 0, ccw: 1 };
const PREBAKE_VERSION = 1;

export const DEFAULT_CONFIG = {
  enabled: true,
  // Families and/or object type names whose instances may be baked.
  sources: ["StaticBakeable"],
  // Layouts never baked (editing scenes: instances are live-edited there).
  excludeLayouts: ["levelEditor", "levelEditorBank", "levelBrowser"],
  // Layouts whose content is created by code after layout start; the creator
  // (levelLoader) calls bakeCurrentLayout() itself once everything exists.
  manualLayouts: ["levelEditorPreview"],
  // Instances on these layers stay dynamic (transparent materials rely on
  // per-instance ordering).
  excludeLayers: ["excludeFromIntermediatePost"],
  staticLayerPrefix: "static:",
  // "back" hides inner faces (Shape3D without its BFC option draws both sides).
  // Flip to "none" if a build ever shows missing faces.
  cullMode: "back",
  // Winding that counts as front-facing for the mesh (C3 default is "cw").
  frontFaceWinding: "cw",
  chunkSize: 2048,
  frustumCull: true,
  // C3 draws instances at the same Z through a stencil pass so coplanar
  // surfaces never z-fight. Baked faces lose that, so: (a) the mesh is drawn
  // with a small positive polygon offset (pushed a hair farther) so dynamic
  // instances lying on baked floors win the depth test; (b) baked faces that
  // overlap on the same horizontal plane are nudged along their normal by
  // z-order, later instance on top, like the stencil pass resolved them.
  depthBias: [1, 1], // gl.polygonOffset(factor, units); null disables
  coplanarNudge: 0.02, // world units per overlap level; 0 disables
  log: true,
};

export class StaticShapeBaker {
  constructor(runtime, config = {}) {
    this.runtime = runtime;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this._layerStates = new Map(); // ILayer -> { layer, handler, buckets }
    this._records = new Map(); // IWorldInstance -> record
    this._excluded = new WeakSet();
    this._baked = false;
    this._ending = false;
    this._warnedMissingSources = false;
    this._warnedNoInternal = false;
    this._prebakeProvider = null;
    this._lastCandidates = null;
    this._lastSignature = null;
    this.stats = null;
    this._planes = new Float32Array(24);
    this._clip = new Float32Array(16);
  }

  get internalRuntime() {
    return globalThis.sdk_runtime || null;
  }

  /** Mark an instance as dynamic before baking (e.g. it carries labels). */
  excludeInstance(inst) {
    if (inst) this._excluded.add(inst);
  }

  /**
   * (layoutName, reason) => prebake data | null. Consulted before a live bake.
   * Not wired to any file yet; see serialize().
   */
  setPrebakeProvider(fn) {
    this._prebakeProvider = typeof fn === "function" ? fn : null;
  }

  isManualLayout(name) {
    return this.config.manualLayouts.includes(name);
  }

  // ---------------------------------------------------------------- bake

  /**
   * Bake every eligible instance of the current layout. Calling it again
   * replaces the previous bake (instances are restored first).
   * @returns {object|null} stats
   */
  bakeCurrentLayout(reason = "manual") {
    const cfg = this.config;
    if (!cfg.enabled) return null;
    const layout = this.runtime.layout;
    if (!layout || cfg.excludeLayouts.includes(layout.name)) return null;
    const rt = this.internalRuntime;
    if (!rt || typeof rt._UnwrapScriptInterface !== "function") {
      if (!this._warnedNoInternal) {
        console.warn(
          "[staticBake] globalThis.sdk_runtime unavailable; baking disabled",
        );
        this._warnedNoInternal = true;
      }
      return null;
    }
    if (this._baked) this.clear({ restore: true });
    this._ending = false;

    const t0 = performance.now();
    const candidates = this._collectCandidates();
    this._lastCandidates = candidates;
    // Captured now: baking moves instances to hidden layers, and the layer
    // name is part of the signature.
    this._lastSignature = signatureOf(candidates);
    let stats = null;

    if (this._prebakeProvider) {
      let data = null;
      try {
        data = this._prebakeProvider(layout.name, reason);
      } catch (e) {
        console.warn("[staticBake] prebake provider threw", e);
      }
      if (data) stats = this._applyPrebake(data, candidates);
    }
    if (!stats) stats = this._bakeLive(candidates);

    stats.layout = layout.name;
    stats.reason = reason;
    stats.ms = Math.round((performance.now() - t0) * 10) / 10;
    stats.drawCallsTotal = 0;
    this.stats = stats;
    this._baked = true;
    if (cfg.log) {
      console.log(
        `[staticBake] ${layout.name} (${reason}): baked ${stats.baked}/${stats.candidates} ` +
          `instances, ${stats.faces} faces, ${stats.buckets} buckets/${stats.parts} parts ` +
          `on ${stats.layers} layer(s), skipped ${stats.skipped}, ${stats.ms} ms` +
          (stats.prebaked ? " (prebaked)" : ""),
      );
    }
    return stats;
  }

  /** Layout is ending: stop everything, don't bother restoring layers. */
  onLayoutEnd() {
    this._ending = true;
    this.clear({ restore: false });
  }

  /** Undo the bake: unhook draws, forget buffers, optionally move instances back. */
  clear({ restore = true } = {}) {
    for (const state of this._layerStates.values()) {
      try {
        state.layer.removeEventListener("beforedraw", state.handler);
      } catch (_) {
        /* layer may be gone */
      }
    }
    this._layerStates.clear();
    const back = new Map(); // "hidden->src" -> { from, to, insts }
    for (const rec of this._records.values()) {
      try {
        rec.inst.removeEventListener("destroy", rec.onDestroy);
        if (restore && rec.srcLayer) {
          const from = rec.inst.layer;
          const key = from.name + "->" + rec.srcLayer.name;
          let g = back.get(key);
          if (!g) {
            g = { from, to: rec.srcLayer, insts: [] };
            back.set(key, g);
          }
          g.insts.push(rec.inst);
        }
      } catch (_) {
        /* instance may be destroyed */
      }
    }
    for (const g of back.values()) this._batchMove(g.insts, g.from, g.to);
    this._records.clear();
    this._baked = false;
    this._lastCandidates = null;
  }

  // ---------------------------------------------------------- candidates

  _collectCandidates() {
    const cfg = this.config;
    const seen = new Set();
    const out = [];
    let anySource = false;
    for (const name of cfg.sources) {
      const oc = this.runtime.objects[name];
      if (!oc) continue;
      anySource = true;
      for (const inst of oc.instances()) {
        if (seen.has(inst)) continue;
        seen.add(inst);
        if (this._isEligible(inst)) out.push(inst);
      }
    }
    if (!anySource && !this._warnedMissingSources) {
      console.warn(
        `[staticBake] none of the configured sources exist (${cfg.sources.join(", ")}); ` +
          "create the family in the editor to enable baking",
      );
      this._warnedMissingSources = true;
    }
    // Deterministic order (creation order) so prebake signatures are stable.
    out.sort((a, b) => a.uid - b.uid);
    return out;
  }

  _isEligible(inst) {
    if (this._excluded.has(inst)) return false;
    if (typeof inst.setFaceObject !== "function") return false; // not Shape3D
    if (inst.getParent()) return false;
    if (!inst.isVisible || inst.opacity < 1) return false;
    if (inst.blendMode !== "normal") return false;
    for (const fx of inst.effects) if (fx.isActive) return false;
    const layer = inst.layer;
    if (!layer) return false;
    if (layer.name.startsWith(this.config.staticLayerPrefix)) return false;
    if (this.config.excludeLayers.includes(layer.name)) return false;
    // 2D layers (UI) draw in z-order without depth; a baked copy would jump to
    // the front of the layer. Only 3D-rendered layers are worth baking anyway.
    const rt = this.internalRuntime;
    const internalLayer = rt && rt._UnwrapScriptInterface(layer);
    if (
      internalLayer &&
      typeof internalLayer.RendersIn3DMode === "function" &&
      !internalLayer.RendersIn3DMode()
    ) {
      return false;
    }
    return true;
  }

  // ------------------------------------------------------------ live bake

  _bakeLive(candidates) {
    const rt = this.internalRuntime;
    const chunk = this.config.chunkSize;
    const builders = new Map();
    const texIds = new Map();
    const texId = (tex) => {
      let id = texIds.get(tex);
      if (id === undefined) {
        id = texIds.size;
        texIds.set(tex, id);
      }
      return id;
    };
    const records = [];
    const allFaces = [];
    let faceCount = 0;
    let skipped = 0;

    for (let ci = 0; ci < candidates.length; ci++) {
      const inst = candidates[ci];
      const internal = rt._UnwrapScriptInterface(inst);
      if (!internal) {
        skipped++;
        continue;
      }
      let faces = null;
      try {
        faces = computeShapeFaces({
          sdk: internal.GetSdkInstance(),
          inst: internal,
          wi: internal.GetWorldInfo(),
          shapeTypeName: inst.objectType.name,
        });
      } catch (e) {
        console.warn("[staticBake] face computation failed, left dynamic", e);
      }
      if (!faces) {
        skipped++;
        continue;
      }
      const layer = inst.layer;
      const color = inst.colorRgb;
      const cx = Math.floor(inst.x / chunk);
      const cy = Math.floor(inst.y / chunk);
      const rec = {
        inst,
        srcLayer: layer,
        candidateIndex: ci,
        zIndex: inst.zIndex,
        ranges: [],
        onDestroy: null,
      };
      for (const face of faces) {
        const key = `${layer.name}|${texId(face.tex)}|${cx}|${cy}`;
        let b = builders.get(key);
        if (!b) {
          b = { layer, tex: face.tex, texKey: face.key, cx, cy, faces: [] };
          builders.set(key, b);
        }
        const f = { pos: face.pos, uv: face.uv, color, rec };
        b.faces.push(f);
        allFaces.push(f);
      }
      faceCount += faces.length;
      records.push(rec);
    }

    if (this.config.coplanarNudge > 0) resolveCoplanarFaces(allFaces, this.config.coplanarNudge);

    const buckets = [];
    let partCount = 0;
    for (const b of builders.values()) {
      const bucket = this._finalizeBucket(b);
      buckets.push(bucket);
      partCount += bucket.parts.length;
    }
    this._commit(records, buckets);
    return {
      candidates: candidates.length,
      baked: records.length,
      skipped,
      faces: faceCount,
      buckets: buckets.length,
      parts: partCount,
      layers: this._layerStates.size,
      prebaked: false,
    };
  }

  _finalizeBucket(b) {
    const faces = b.faces;
    const bucket = {
      layer: b.layer,
      tex: b.tex,
      texKey: b.texKey,
      cx: b.cx,
      cy: b.cy,
      parts: [],
      bbox: [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity],
      live: 0,
    };
    const bb = bucket.bbox;
    for (let start = 0; start < faces.length; start += MAX_QUADS_PER_PART) {
      const n = Math.min(MAX_QUADS_PER_PART, faces.length - start);
      const pos = new Float32Array(n * 12);
      const uv = new Float32Array(n * 8);
      const idx = new Uint16Array(n * 6);
      let col = null;
      let allWhite = true;
      for (let i = 0; i < n; i++) {
        const c = faces[start + i].color;
        if (c[0] !== 1 || c[1] !== 1 || c[2] !== 1) {
          allWhite = false;
          break;
        }
      }
      if (!allWhite) col = new Float32Array(n * 16);
      const part = { bucket, pos, uv, idx, col, quads: n, live: n };
      let lastRange = null;
      for (let i = 0; i < n; i++) {
        const face = faces[start + i];
        pos.set(face.pos, i * 12);
        uv.set(face.uv, i * 8);
        const p = face.pos;
        for (let k = 0; k < 12; k += 3) {
          if (p[k] < bb[0]) bb[0] = p[k];
          if (p[k + 1] < bb[1]) bb[1] = p[k + 1];
          if (p[k + 2] < bb[2]) bb[2] = p[k + 2];
          if (p[k] > bb[3]) bb[3] = p[k];
          if (p[k + 1] > bb[4]) bb[4] = p[k + 1];
          if (p[k + 2] > bb[5]) bb[5] = p[k + 2];
        }
        if (col) {
          const c = face.color;
          let o = i * 16;
          for (let v = 0; v < 4; v++) {
            col[o++] = c[0];
            col[o++] = c[1];
            col[o++] = c[2];
            col[o++] = 1;
          }
        }
        const v0 = i * 4;
        const io = i * 6;
        idx[io] = v0;
        idx[io + 1] = v0 + 1;
        idx[io + 2] = v0 + 2;
        idx[io + 3] = v0;
        idx[io + 4] = v0 + 2;
        idx[io + 5] = v0 + 3;
        // Instance -> index ranges (merged while consecutive).
        if (lastRange && lastRange.rec === face.rec && lastRange.part === part) {
          lastRange.count += 6;
        } else {
          lastRange = { rec: face.rec, part, from: io, count: 6 };
          face.rec.ranges.push(lastRange);
        }
      }
      bucket.parts.push(part);
      bucket.live += n;
    }
    return bucket;
  }

  // Shared tail of live + prebaked paths: hide instances, hook destroys, hook draws.
  _commit(records, buckets) {
    const bySource = new Map(); // src ILayer -> [inst]
    for (const rec of records) {
      let list = bySource.get(rec.srcLayer);
      if (!list) {
        list = [];
        bySource.set(rec.srcLayer, list);
      }
      list.push(rec.inst);
    }
    for (const [src, insts] of bySource) {
      this._batchMove(insts, src, this._getStaticLayer(src));
    }
    for (const rec of records) {
      rec.onDestroy = () => {
        if (this._ending) return;
        this._dropRecord(rec);
      };
      rec.inst.addEventListener("destroy", rec.onDestroy);
      this._records.set(rec.inst, rec);
    }
    for (const bucket of buckets) {
      let state = this._layerStates.get(bucket.layer);
      if (!state) {
        state = { layer: bucket.layer, buckets: [], handler: null };
        state.handler = () => this._drawLayer(state);
        bucket.layer.addEventListener("beforedraw", state.handler);
        this._layerStates.set(bucket.layer, state);
      }
      state.buckets.push(bucket);
    }
  }

  _getStaticLayer(srcLayer) {
    const layout = this.runtime.layout;
    const name = this.config.staticLayerPrefix + srcLayer.name;
    let layer = layout.getLayer(name);
    if (!layer) {
      const roots = layout.getAllLayers().filter((l) => !l.parentLayer);
      const top = roots[roots.length - 1];
      layout.addLayer(name, top, "above"); // topmost: no existing index shifts
      layer = layout.getLayer(name);
    }
    layer.isVisible = false;
    layer.zElevation = srcLayer.zElevation; // keep totalZElevation identical
    return layer;
  }

  /**
   * Move many instances between two layers in O(n). C3's per-instance
   * moveToLayer does indexOf + splice on the source layer's array, which made
   * the bake O(n²) (444 of 525 ms on a 32k-instance layout). This mirrors
   * WorldInfo.ZOrderMoveToLayer / Layer._RemoveInstance / Layer._AddInstance
   * but rebuilds the source array once. Falls back to moveToLayer if the
   * internals don't look like r449.
   */
  _batchMove(insts, fromILayer, toILayer) {
    if (fromILayer === toILayer || insts.length === 0) return;
    const rt = this.internalRuntime;
    const from = rt && rt._UnwrapScriptInterface(fromILayer);
    const to = rt && rt._UnwrapScriptInterface(toILayer);
    const ok =
      from &&
      to &&
      Array.isArray(from._instances) &&
      typeof to._AddInstance === "function" &&
      typeof from.SetZIndicesChanged === "function";
    if (!ok) {
      for (const inst of insts) inst.moveToLayer(toILayer);
      return;
    }
    const moving = new Set();
    for (const inst of insts) {
      const internal = rt._UnwrapScriptInterface(inst);
      if (internal && internal.GetWorldInfo().GetLayer() === from) moving.add(internal);
    }
    if (moving.size === 0) return;
    const useCells = typeof from.UsesRenderCells === "function" && from.UsesRenderCells();
    // Rebuild the source list in place (other code may hold the array).
    const arr = from._instances;
    let w = 0;
    const removed = [];
    for (let i = 0; i < arr.length; i++) {
      const inst = arr[i];
      if (moving.has(inst)) removed.push(inst);
      else arr[w++] = inst;
    }
    arr.length = w;
    for (const inst of removed) {
      const wi = inst.GetWorldInfo();
      if (useCells) wi._RemoveFromRenderCells();
      wi._SetLayer(to);
      to._AddInstance(inst, true);
    }
    from.SetZIndicesChanged();
    if (typeof from._MaybeResetAnyInstanceZElevatedFlag === "function") {
      from._MaybeResetAnyInstanceZElevatedFlag();
    }
    to.SetZIndicesChanged();
    if (typeof rt.UpdateRender === "function") rt.UpdateRender();
  }

  _dropRecord(rec) {
    for (const range of rec.ranges) {
      const idx = range.part.idx;
      const v = idx[range.from];
      idx.fill(v, range.from, range.from + range.count); // degenerate tris
      const quads = range.count / 6;
      range.part.live -= quads;
      range.part.bucket.live -= quads;
    }
    rec.ranges.length = 0;
    this._records.delete(rec.inst);
  }

  // ------------------------------------------------------------------ draw

  _drawLayer(state) {
    if (!this._baked || this._ending) return;
    const rt = this.internalRuntime;
    const r = rt && rt.GetRenderer();
    if (!r) return;
    // When C3 merges sibling 3D layers into one depth-sorted pass
    // (Layout._Draw3DLayers) it fires "beforedraw" for every layer BEFORE it
    // sets any layer transform, so the renderer still holds the previous
    // (possibly 2D) camera. Apply this layer's transform ourselves; C3 tracks
    // prepared layers separately and re-applies its own before drawing.
    const internalLayer = rt._UnwrapScriptInterface(state.layer);
    if (internalLayer && typeof internalLayer.PrepareForDraw === "function") {
      internalLayer.PrepareForDraw(r);
    }
    const planes = this.config.frustumCull ? this._computeFrustum(r) : null;
    r.SetTextureFillMode();
    r.SetAlphaBlend();
    r.ResetColor();
    r.SetCullFaceMode(CULL_MODE[this.config.cullMode] ?? 0);
    r.SetFrontFaceWinding(FRONT_FACE[this.config.frontFaceWinding] ?? 0);
    // Polygon offset is raw GL state, so the batch must be flushed around it.
    const bias = this.config.depthBias;
    const gl = bias && typeof r.EndBatch === "function" ? r._gl : null;
    if (gl) {
      r.EndBatch();
      gl.enable(gl.POLYGON_OFFSET_FILL);
      gl.polygonOffset(bias[0], bias[1]);
    }
    let drawn = 0;
    for (const bucket of state.buckets) {
      if (bucket.live <= 0) continue;
      if (planes && !aabbInFrustum(planes, bucket.bbox)) continue;
      r.SetTexture(bucket.tex);
      for (const part of bucket.parts) {
        if (part.live <= 0) continue;
        r.DrawMesh(part.pos, part.uv, part.idx, part.col || undefined);
        drawn++;
      }
    }
    if (gl) {
      r.EndBatch();
      gl.disable(gl.POLYGON_OFFSET_FILL);
    }
    r.SetCullFaceMode(0);
    if (this.stats) this.stats.drawCallsTotal += drawn;
  }

  // Frustum planes (Gribb/Hartmann) from the renderer's current P * MV.
  _computeFrustum(r) {
    const P = r._matP;
    const MV = r._matMV;
    if (!P || !MV || P.length !== 16 || MV.length !== 16) return null;
    const M = this._clip;
    for (let c = 0; c < 4; c++) {
      for (let row = 0; row < 4; row++) {
        M[c * 4 + row] =
          P[row] * MV[c * 4] +
          P[4 + row] * MV[c * 4 + 1] +
          P[8 + row] * MV[c * 4 + 2] +
          P[12 + row] * MV[c * 4 + 3];
      }
    }
    const pl = this._planes;
    // rows of M: r_i = (M[i], M[4+i], M[8+i], M[12+i])
    const set = (o, s0, s1) => {
      // plane = r3 + s*r_i  (s0 = ±1 on row index s1)
      pl[o] = M[3] + s0 * M[s1];
      pl[o + 1] = M[7] + s0 * M[4 + s1];
      pl[o + 2] = M[11] + s0 * M[8 + s1];
      pl[o + 3] = M[15] + s0 * M[12 + s1];
    };
    set(0, 1, 0); // left
    set(4, -1, 0); // right
    set(8, 1, 1); // bottom
    set(12, -1, 1); // top
    set(16, 1, 2); // near
    set(20, -1, 2); // far
    return pl;
  }

  // ---------------------------------------------------------- prebake I/O

  /**
   * Snapshot the current bake as plain JSON (typed arrays base64-encoded).
   * Validity is tied to the eligible-instance signature of the layout.
   */
  serialize() {
    if (!this._baked || !this._lastCandidates) return null;
    const recIndex = new Map();
    for (const rec of this._records.values()) recIndex.set(rec, rec.candidateIndex);
    const buckets = [];
    for (const state of this._layerStates.values()) {
      for (const bucket of state.buckets) {
        buckets.push({
          layer: bucket.layer.name,
          texKey: bucket.texKey,
          chunk: [bucket.cx, bucket.cy],
          bbox: bucket.bbox.slice(),
          parts: bucket.parts.map((part) => ({
            quads: part.quads,
            pos: b64(part.pos),
            uv: b64(part.uv),
            col: part.col ? b64(part.col) : null,
            idx: b64(part.idx),
            ranges: collectRanges(part, this._records, recIndex),
          })),
        });
      }
    }
    return {
      version: PREBAKE_VERSION,
      layout: this.runtime.layout.name,
      candidates: this._lastCandidates.length,
      signature: this._lastSignature,
      bakedCandidates: [...this._records.values()]
        .map((r) => r.candidateIndex)
        .sort((a, b) => a - b),
      buckets,
    };
  }

  _applyPrebake(data, candidates) {
    if (!data || data.version !== PREBAKE_VERSION) return null;
    if (data.layout !== this.runtime.layout.name) return null;
    if (data.candidates !== candidates.length) return null;
    if (data.signature !== signatureOf(candidates)) return null;
    const rt = this.internalRuntime;
    const layout = this.runtime.layout;

    const records = new Map(); // candidateIndex -> rec
    for (const ci of data.bakedCandidates) {
      const inst = candidates[ci];
      if (!inst) return null;
      records.set(ci, {
        inst,
        srcLayer: inst.layer,
        candidateIndex: ci,
        ranges: [],
        onDestroy: null,
      });
    }
    const texCache = new Map();
    const resolveTex = (key) => {
      if (texCache.has(key)) return texCache.get(key);
      const tex = resolveTextureByKey(rt, key, candidates);
      texCache.set(key, tex);
      return tex;
    };
    const buckets = [];
    let parts = 0;
    let faces = 0;
    for (const bd of data.buckets) {
      const layer = layout.getLayer(bd.layer);
      const tex = resolveTex(bd.texKey);
      if (!layer || !tex) return null;
      const bucket = {
        layer,
        tex,
        texKey: bd.texKey,
        cx: bd.chunk[0],
        cy: bd.chunk[1],
        parts: [],
        bbox: bd.bbox.slice(),
        live: 0,
      };
      for (const pd of bd.parts) {
        const part = {
          bucket,
          pos: fromB64(pd.pos, Float32Array),
          uv: fromB64(pd.uv, Float32Array),
          col: pd.col ? fromB64(pd.col, Float32Array) : null,
          idx: fromB64(pd.idx, Uint16Array),
          quads: pd.quads,
          live: pd.quads,
        };
        for (const [ci, from, count] of pd.ranges) {
          const rec = records.get(ci);
          if (!rec) return null;
          rec.ranges.push({ rec, part, from, count });
        }
        bucket.parts.push(part);
        bucket.live += pd.quads;
        faces += pd.quads;
        parts++;
      }
      buckets.push(bucket);
    }
    this._commit([...records.values()], buckets);
    return {
      candidates: candidates.length,
      baked: records.size,
      skipped: candidates.length - records.size,
      faces,
      buckets: buckets.length,
      parts,
      layers: this._layerStates.size,
      prebaked: true,
    };
  }
}

// ------------------------------------------------------------------ helpers

/**
 * Horizontal faces (all four corners at one Z) that overlap other horizontal
 * faces on the same plane are nudged along their outward normal by
 * `eps × level`, where level = 1 + max level of the overlapped faces that
 * precede them in z-order. Render-only: instance data is untouched. Spatial
 * hashing keeps it O(n) per plane in practice.
 */
export function resolveCoplanarFaces(faces, eps) {
  const planes = new Map(); // "z" -> [face]
  for (const f of faces) {
    const p = f.pos;
    if (p[2] !== p[5] || p[2] !== p[8] || p[2] !== p[11]) continue;
    const key = p[2].toFixed(3);
    let list = planes.get(key);
    if (!list) planes.set(key, (list = []));
    list.push(f);
  }
  const CELL = 256;
  let nudged = 0;
  for (const list of planes.values()) {
    if (list.length < 2) continue;
    list.sort((a, b) => (a.rec.zIndex || 0) - (b.rec.zIndex || 0));
    const grid = new Map();
    for (const f of list) {
      const p = f.pos;
      const minX = Math.min(p[0], p[3], p[6], p[9]),
        maxX = Math.max(p[0], p[3], p[6], p[9]),
        minY = Math.min(p[1], p[4], p[7], p[10]),
        maxY = Math.max(p[1], p[4], p[7], p[10]);
      f._bb = [minX, minY, maxX, maxY];
      let level = 0;
      const cx0 = Math.floor(minX / CELL),
        cx1 = Math.floor(maxX / CELL),
        cy0 = Math.floor(minY / CELL),
        cy1 = Math.floor(maxY / CELL);
      for (let cx = cx0; cx <= cx1; cx++) {
        for (let cy = cy0; cy <= cy1; cy++) {
          const cell = grid.get(cx + "," + cy);
          if (!cell) continue;
          for (const o of cell) {
            const ob = o._bb;
            // strict overlap: shared edges don't count
            if (ob[0] < maxX && ob[2] > minX && ob[1] < maxY && ob[3] > minY) {
              if (o._level + 1 > level) level = o._level + 1;
            }
          }
        }
      }
      f._level = level;
      for (let cx = cx0; cx <= cx1; cx++) {
        for (let cy = cy0; cy <= cy1; cy++) {
          const k = cx + "," + cy;
          let cell = grid.get(k);
          if (!cell) grid.set(k, (cell = []));
          cell.push(f);
        }
      }
      if (level > 0) {
        // outward normal z sign from the diagonals (matches orientOutward)
        const d1x = p[6] - p[0],
          d1y = p[7] - p[1],
          d2x = p[9] - p[3],
          d2y = p[10] - p[4];
        const nz = d1x * d2y - d1y * d2x;
        const dz = (nz >= 0 ? 1 : -1) * eps * level;
        p[2] += dz;
        p[5] += dz;
        p[8] += dz;
        p[11] += dz;
        nudged++;
      }
    }
    for (const f of list) {
      delete f._bb;
      delete f._level;
    }
  }
  return nudged;
}

function aabbInFrustum(pl, bb) {
  for (let i = 0; i < 24; i += 4) {
    const a = pl[i],
      b = pl[i + 1],
      c = pl[i + 2],
      d = pl[i + 3];
    const px = a >= 0 ? bb[3] : bb[0];
    const py = b >= 0 ? bb[4] : bb[1];
    const pz = c >= 0 ? bb[5] : bb[2];
    if (a * px + b * py + c * pz + d < 0) return false;
  }
  return true;
}

function collectRanges(part, records, recIndex) {
  const out = [];
  for (const rec of records.values()) {
    for (const range of rec.ranges) {
      if (range.part === part) out.push([recIndex.get(rec), range.from, range.count]);
    }
  }
  out.sort((x, y) => x[1] - y[1]);
  return out;
}

// FNV-1a over the transform/shape of each candidate, in candidate order.
function signatureOf(candidates) {
  let h = 0x811c9dc5;
  const mix = (str) => {
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
  };
  for (const inst of candidates) {
    mix(
      `${inst.objectType.name}|${r3(inst.x)}|${r3(inst.y)}|${r3(inst.zElevation)}|` +
        `${r3(inst.width)}|${r3(inst.height)}|${r3(inst.zHeight)}|${r3(inst.angle)}|` +
        `${inst.shape}|${inst.layer.name};`,
    );
  }
  return h.toString(16);
}
const r3 = (v) => Math.round(v * 1000) / 1000;

function resolveTextureByKey(rt, key, candidates) {
  const [kind, name, frame] = key.split(":");
  if (kind === "obj") {
    const oc = rt._objectClassesByName?.get(name.toLowerCase());
    const inst = oc?.GetFirstInstance?.() || oc?.GetInstances?.()[0];
    const sdk = inst?.GetSdkInstance?.();
    return sdk?.GetTexture?.() || null;
  }
  if (kind === "own") {
    const anyInst = candidates.find((c) => c.objectType.name === name);
    const internal = anyInst && rt._UnwrapScriptInterface(anyInst);
    const sdk = internal?.GetSdkInstance?.();
    return sdk?._animation?.GetFrameAt(Number(frame))?.GetImageInfo()?.GetTexture() || null;
  }
  return null;
}

function b64(typed) {
  const bytes = new Uint8Array(typed.buffer, typed.byteOffset, typed.byteLength);
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(s);
}

function fromB64(str, Type) {
  const bin = atob(str);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Type(bytes.buffer);
}
