/**
 * shadowSystem.js — Top-level orchestrator for the shadow pipeline.
 *
 * Usage:
 *
 *   import { ShadowSystem } from "./shadow/shadowSystem.js";
 *
 *   const shadows = new ShadowSystem();
 *
 *   // Configure what casts/receives (call again whenever the list changes):
 *   shadows.setCasters(casterInstances);
 *   shadows.setReceivers(receiverInstances);
 *   shadows.setLight([0.3, 0.3, -1]);
 *   shadows.setColor([0, 0, 0], 0.45);
 *
 *   // In your layer "afterdraw" handler:
 *   layer.addEventListener("afterdraw", (e) => {
 *     shadows.draw(e.renderer);
 *   });
 *
 * The system splits casters and receivers into static and dynamic groups
 * using the `casterStatic` / `receiverStatic` instance variables.
 *
 * Static caster shadows are built once and cached until the light
 * direction or instance lists change.  Only dynamic caster shadows
 * are rebuilt each frame (when movement is detected), and they are
 * projected against ALL receivers (static + dynamic).
 */

import { normalize } from "./vec3.js";
import { instanceToTriangles } from "./triangulate.js";
import {
  buildShadowMeshEx,
  buildShadowMeshWithPlanes,
  groupByPlane,
  collectUniqueVertices,
  buildBackfaceTris,
} from "./shadowMeshBuilder.js";
import { ShadowRenderer } from "./shadowRenderer.js";

export class ShadowSystem {
  constructor() {
    this._shadowRenderer = new ShadowRenderer();

    // Instance lists
    this._casters = [];
    this._receivers = [];

    // Light & appearance
    this._lightDir = [0, 0, -1];
    this._color = [0, 0, 0];
    this._opacity = 0.5;

    // Build options
    this._maxDist = 100000;
    this._backfaceCull = true;
    this._batched = true;

    // ── Static / dynamic split cache ──
    this._staticShadowTris = null; // static caster shadows onto static receivers only (for "static" mode)
    this._staticOnAllShadowTris = null; // static caster shadows onto all receivers (for "all" mode)
    this._dynamicShadowTris = []; // rebuilt when dynamic casters move
    this._allReceiverTris = null; // all receiver tris (static + dynamic)
    this._staticReceiverTris = []; // receiver tris from static + pure-dynamic receivers
    this._cachedPlaneGroups = null; // cached groupByPlane result (all receivers)
    this._staticPlaneGroups = null; // cached groupByPlane result (static receivers only)
    this._staticCasterGroups = null; // cached static caster vertex groups
    this._receiverSet = null; // Set of receiver UIDs (for caster+receiver detection)

    // Merged output for drawing
    this._shadowTris = [];
    this._backfaceTris = []; // backfaces from all receivers (for "all" mode)
    this._staticBackfaceTris = []; // backfaces from static receivers only (for "static" mode)
    this._casterTris = []; // kept for debug drawing
    this._receiverTris = []; // kept for debug drawing

    // Dirty flags
    this._fullDirty = true; // light/lists changed → rebuild everything
    this._dynamicDirty = true; // a dynamic caster moved → rebuild dynamic only

    // Snapshots for movement detection (dynamic instances only)
    this._snapshotDynCasters = null;
    this._snapshotDynReceivers = null;

    // Debug / toggles
    this._debug = false;
    this._backfaceEnabled = true;

    // ── Layout-based static shadow cache ──
    // Maps layout name → { staticShadowTris, staticPlaneGroups, staticReceiverTris, staticCasterGroups, backfaceTris, lightDir }
    this._layoutCache = new Map();
    this.curLayoutName = null;

    // Shadow config callback (returns "all", "static", or "none")
    this.getShadowConfig = () => "all";
  }
  // ─── configuration ──────────────────────────────────────────────

  /** Set the list of shadow-casting instances. Only marks dirty if the list changed. */
  setCasters(instances) {
    if (this._instanceListChanged(this._casters, instances)) {
      this._casters = instances;
      this._fullDirty = true;
    }
  }

  setShadowConfigCallback(callback) {
    this.getShadowConfig = callback;
  }

  setCurLayoutName(name) {
    if (this.curLayoutName !== name) {
      this.curLayoutName = name;
      // Check if we have cached static shadows for this layout
      this._tryRestoreFromCache();
    }
  }

  /**
   * Try to restore static shadow data from the layout cache.
   * If found and light direction matches, reuses the cached static shadows.
   */
  _tryRestoreFromCache() {
    const cached = this._layoutCache.get(this.curLayoutName);
    if (!cached) return;

    // Only restore if light direction matches
    const ld = this._lightDir;
    const cld = cached.lightDir;
    if (ld[0] !== cld[0] || ld[1] !== cld[1] || ld[2] !== cld[2]) {
      // Light changed, cache is invalid for this layout
      this._layoutCache.delete(this.curLayoutName);
      return;
    }

    // Restore cached static data
    this._staticShadowTris = cached.staticShadowTris;
    this._staticOnAllShadowTris = cached.staticOnAllShadowTris;
    this._staticPlaneGroups = cached.staticPlaneGroups;
    this._staticReceiverTris = cached.staticReceiverTris;
    this._staticCasterGroups = cached.staticCasterGroups;
    this._staticBackfaceTris = cached.staticBackfaceTris;
    this._cachedStaticFromLayout = true; // Flag to skip static rebuild
  }

  /**
   * Save current static shadow data to the layout cache.
   */
  _saveToCache() {
    if (!this.curLayoutName) return;

    this._layoutCache.set(this.curLayoutName, {
      staticShadowTris: this._staticShadowTris,
      staticOnAllShadowTris: this._staticOnAllShadowTris,
      staticPlaneGroups: this._staticPlaneGroups,
      staticReceiverTris: this._staticReceiverTris,
      staticCasterGroups: this._staticCasterGroups,
      staticBackfaceTris: this._staticBackfaceTris,
      lightDir: [...this._lightDir],
    });
  }

  /** Set the list of shadow-receiving instances. Only marks dirty if the list changed. */
  setReceivers(instances) {
    if (this._instanceListChanged(this._receivers, instances)) {
      this._receivers = instances;
      this._fullDirty = true;
    }
  }

  /** Set light travel direction (will be normalised internally). Marks full dirty. */
  setLight(dir) {
    const n = normalize(dir);
    if (
      n[0] !== this._lightDir[0] ||
      n[1] !== this._lightDir[1] ||
      n[2] !== this._lightDir[2]
    ) {
      this._lightDir = n;
      this._fullDirty = true;
    }
  }

  /** Set shadow colour and opacity. Does NOT mark dirty (draw-only change). */
  setColor(rgb, opacity) {
    this._color = rgb;
    if (opacity !== undefined) this._opacity = opacity;
  }

  /** Tweak build options. Marks dirty so they take effect. */
  setOptions({ maxDist, bias, backfaceCull, batched } = {}) {
    if (maxDist !== undefined) this._maxDist = maxDist;
    if (bias !== undefined) this._bias = bias;
    if (backfaceCull !== undefined) this._backfaceCull = backfaceCull;
    if (batched !== undefined) this._batched = batched;
    this._fullDirty = true;
  }

  /** Force a full rebuild on the next draw(). */
  invalidate() {
    this._fullDirty = true;
  }

  /** Enable/disable debug wireframe overlay. */
  setDebug(enabled) {
    this._debug = enabled;
  }

  /** Enable/disable backface darkening. */
  setBackfaceEnabled(enabled) {
    this._backfaceEnabled = enabled;
    this._fullDirty = true;
  }

  // ─── per-frame entry point ──────────────────────────────────────

  /**
   * Draw the shadows.  Call this inside a layer's `afterdraw` handler.
   *
   * @param {object} renderer  The renderer from the layer afterdraw event
   */
  draw(renderer) {
    // ── Check shadow config at runtime ──
    const shadowConfig = this.getShadowConfig();

    // "none" = shadows completely disabled (no calculation, no drawing)
    if (shadowConfig === "none") {
      return;
    }

    const staticOnly = shadowConfig === "static";

    // ── Decide what needs rebuilding ──
    if (this._fullDirty) {
      this._rebuildAll();
      this._fullDirty = false;
      this._dynamicDirty = false;
    } else if (!staticOnly) {
      // Only check for dynamic updates in "all" mode
      if (this._hasDynamicReceiversMoved()) {
        this._rebuildAll();
        this._dynamicDirty = false;
      } else if (this._hasDynamicCastersMoved()) {
        this._rebuildDynamic();
        this._dynamicDirty = false;
      }
    }

    // Draw backface darkening (if enabled)
    // In "static" mode, only draw backfaces from static receivers
    if (this._backfaceEnabled) {
      const backfaceTris = staticOnly ? this._staticBackfaceTris : this._backfaceTris;
      if (backfaceTris && backfaceTris.length > 0) {
        this._shadowRenderer.drawShadows(
          renderer,
          backfaceTris,
          this._color,
          this._opacity,
        );
      }
    }

    // Draw cast shadows
    // In "static" mode, only draw _staticShadowTris (excludes dynamic caster shadows)
    if (staticOnly) {
      if (this._staticShadowTris && this._staticShadowTris.length > 0) {
        this._shadowRenderer.drawShadows(
          renderer,
          this._staticShadowTris,
          this._color,
          this._opacity,
        );
      }
    } else {
      if (this._shadowTris.length > 0) {
        this._shadowRenderer.drawShadows(
          renderer,
          this._shadowTris,
          this._color,
          this._opacity,
        );
      }
    }
  }

  /**
   * Draw debug wireframes on a separate layer.
   */
  drawDebug(renderer) {
    if (!this._debug) return;

    this._shadowRenderer.drawDebugTriangles(
      renderer,
      this._casterTris,
      [1, 0, 0, 0.6],
      1,
    );
    this._shadowRenderer.drawDebugTriangles(
      renderer,
      this._receiverTris,
      [0, 1, 0, 0.6],
      1,
    );
    this._shadowRenderer.drawDebugTriangles(
      renderer,
      this._shadowTris,
      [1, 1, 0, 1],
      2,
    );
  }

  // ─── read-only accessors ────────────────────────────────────────

  get triangleCount() {
    return this._shadowTris.length;
  }

  get shadowTriangles() {
    return this._shadowTris;
  }

  get isDirty() {
    return this._fullDirty;
  }

  clear() {
    this._shadowTris = [];
    this._backfaceTris = [];
    this._staticBackfaceTris = [];
    this._staticShadowTris = null;
    this._staticOnAllShadowTris = null;
    this._dynamicShadowTris = [];
    this._allReceiverTris = null;
    this._cachedPlaneGroups = null;
    this._staticPlaneGroups = null;
    this._staticCasterGroups = null;
    this._receiverSet = null;
    this._snapshotDynCasters = null;
    this._snapshotDynReceivers = null;
    this._casters = [];
    this._receivers = [];
    this._casterTris = [];
    this._receiverTris = [];
    this._fullDirty = true;
    this._cachedStaticFromLayout = false;
  }

  /**
   * Clear the layout cache for all layouts or a specific layout.
   * @param {string} [layoutName]  If provided, only clear that layout's cache
   */
  clearLayoutCache(layoutName) {
    if (layoutName) {
      this._layoutCache.delete(layoutName);
    } else {
      this._layoutCache.clear();
    }
  }

  // ─── internals ──────────────────────────────────────────────────

  /**
   * Full rebuild: recompute everything.
   * Called when light, instance lists, or receiver geometry changes.
   */
  _rebuildAll() {
    // ── Check if we can reuse cached static shadows from layout cache ──
    const canUseCachedStatic = this._cachedStaticFromLayout && this._staticShadowTris;
    this._cachedStaticFromLayout = false; // Reset flag

    // ── Split casters into static / dynamic ──
    const staticCasterGroups = [];
    const dynamicCasterGroups = [];
    const allCasterTris = [];
    const dynamicCasters = [];

    for (const inst of this._casters) {
      const tris = instanceToTriangles(inst);
      for (const t of tris) allCasterTris.push(t);
      const verts = collectUniqueVertices(tris);

      if (inst.instVars && inst.instVars.casterStatic) {
        staticCasterGroups.push(verts);
      } else {
        dynamicCasterGroups.push(verts);
        dynamicCasters.push(inst);
      }
    }

    // ── Build all receiver tris (static + dynamic combined) ──
    // "Dynamic receivers" are receivers that can move independently
    // (not static, and not already tracked as a dynamic caster).
    // Instances that are both dynamic caster + receiver are handled
    // by _rebuildDynamic which updates plane groups for them.
    const allReceiverTris = [];
    const staticReceiverTris = [];
    const dynamicReceivers = [];
    const dynamicCasterUids = new Set(dynamicCasters.map((c) => c.uid));
    for (const inst of this._receivers) {
      const tris = instanceToTriangles(inst);
      for (const t of tris) allReceiverTris.push(t);

      if (inst.instVars && inst.instVars.receiverStatic) {
        // Static receiver: tris never change
        for (const t of tris) staticReceiverTris.push(t);
      } else if (dynamicCasterUids.has(inst.uid)) {
        // Dynamic caster+receiver: tris cached separately, updated in _rebuildDynamic
        // (not added to staticReceiverTris — will be merged at rebuild time)
      } else {
        // Pure dynamic receiver (not a caster): track for movement
        dynamicReceivers.push(inst);
        for (const t of tris) staticReceiverTris.push(t); // treat as quasi-static until it moves
      }
    }

    this._receiverSet = new Set(this._receivers.map((r) => r.uid));
    this._allReceiverTris = allReceiverTris;
    this._casterTris = allCasterTris;
    this._receiverTris = allReceiverTris;

    // ── Build static shadows (or reuse from cache) ──
    if (canUseCachedStatic) {
      // Reuse cached static data — already restored in _tryRestoreFromCache
      // Just need to rebuild plane groups for all receivers (includes dynamic)
      this._cachedPlaneGroups = groupByPlane(allReceiverTris);
    } else {
      // Full static rebuild
      this._staticReceiverTris = staticReceiverTris;
      this._staticCasterGroups = staticCasterGroups;

      // ── Pre-compute plane groups ──
      // Cache static receiver plane groups separately (never change until full rebuild)
      this._staticPlaneGroups = groupByPlane(staticReceiverTris);
      this._cachedPlaneGroups = groupByPlane(allReceiverTris);

      // ── Build static caster shadows onto static receivers only (for "static" mode) ──
      if (staticCasterGroups.length > 0) {
        this._staticShadowTris = buildShadowMeshWithPlanes(
          staticCasterGroups,
          this._staticPlaneGroups,
          this._lightDir,
        );
        // ── Build static caster shadows onto all receivers (for "all" mode) ──
        this._staticOnAllShadowTris = buildShadowMeshWithPlanes(
          staticCasterGroups,
          this._cachedPlaneGroups,
          this._lightDir,
        );
      } else {
        this._staticShadowTris = [];
        this._staticOnAllShadowTris = [];
      }

      // ── Backface darkening for static receivers only (for "static" mode) ──
      this._staticBackfaceTris = buildBackfaceTris(staticReceiverTris, [
        -this._lightDir[0],
        -this._lightDir[1],
        -this._lightDir[2],
      ]);

      // ── Save static data to layout cache ──
      this._saveToCache();
    }

    // ── Build dynamic caster shadows ──
    if (dynamicCasterGroups.length > 0) {
      this._dynamicShadowTris = buildShadowMeshWithPlanes(
        dynamicCasterGroups,
        this._cachedPlaneGroups,
        this._lightDir,
      );
    } else {
      this._dynamicShadowTris = [];
    }

    // ── Merge static (on all receivers) + dynamic for "all" mode ──
    this._shadowTris = (this._staticOnAllShadowTris || []).concat(this._dynamicShadowTris);

    // ── Backface darkening for all receivers (for "all" mode) ──
    this._backfaceTris = buildBackfaceTris(allReceiverTris, [
      -this._lightDir[0],
      -this._lightDir[1],
      -this._lightDir[2],
    ]);

    // ── Snapshot dynamic instances for movement detection ──
    this._snapshotDynCasters = this._takeSnapshot(dynamicCasters);
    this._snapshotDynReceivers = this._takeSnapshot(dynamicReceivers);
    this._dynamicCasters = dynamicCasters;
    this._dynamicReceivers = dynamicReceivers;
  }

  /**
   * Partial rebuild: only recompute dynamic caster shadows.
   * Static shadows are reused from cache.
   * Called when only dynamic casters or dynamic receivers move.
   */
  _rebuildDynamic() {
    // ── Re-triangulate dynamic casters ──
    const dynamicCasterGroups = [];
    const dynamicReceiverTris = []; // receiver tris from caster+receiver instances

    for (const inst of this._dynamicCasters) {
      const tris = instanceToTriangles(inst);
      dynamicCasterGroups.push(collectUniqueVertices(tris));

      // If this caster is also a receiver, collect its updated receiver tris
      if (this._receiverSet && this._receiverSet.has(inst.uid)) {
        for (const t of tris) dynamicReceiverTris.push(t);
      }
    }

    // ── Rebuild plane groups: reuse static groups, only regroup dynamic tris ──
    const dynPlaneGroups =
      dynamicReceiverTris.length > 0 ? groupByPlane(dynamicReceiverTris) : [];
    this._cachedPlaneGroups = this._staticPlaneGroups.concat(dynPlaneGroups);

    // Merge receiver tris for backface darkening
    const allReceiverTris =
      this._staticReceiverTris.concat(dynamicReceiverTris);

    // ── Rebuild static caster shadows onto all receivers (plane groups changed) ──
    if (this._staticCasterGroups && this._staticCasterGroups.length > 0) {
      this._staticOnAllShadowTris = buildShadowMeshWithPlanes(
        this._staticCasterGroups,
        this._cachedPlaneGroups,
        this._lightDir,
      );
    }

    // ── Build dynamic caster shadows ──
    if (dynamicCasterGroups.length > 0) {
      this._dynamicShadowTris = buildShadowMeshWithPlanes(
        dynamicCasterGroups,
        this._cachedPlaneGroups,
        this._lightDir,
      );
    } else {
      this._dynamicShadowTris = [];
    }

    // ── Merge static (on all) + dynamic ──
    this._shadowTris = (this._staticOnAllShadowTris || []).concat(this._dynamicShadowTris);

    // ── Backface darkening (receiver geometry changed) ──
    this._backfaceTris = buildBackfaceTris(allReceiverTris, [
      -this._lightDir[0],
      -this._lightDir[1],
      -this._lightDir[2],
    ]);

    // ── Update dynamic caster snapshots ──
    this._snapshotDynCasters = this._takeSnapshot(this._dynamicCasters);
  }

  // ─── movement detection ────────────────────────────────────────

  _hasDynamicCastersMoved() {
    if (!this._snapshotDynCasters || !this._dynamicCasters) return true;
    if (this._dynamicCasters.length === 0) return false; // no dynamic casters → nothing can move
    if (this._dynamicCasters.length !== this._snapshotDynCasters.length)
      return true;
    return this._listDiffers(this._dynamicCasters, this._snapshotDynCasters);
  }

  _hasDynamicReceiversMoved() {
    if (!this._snapshotDynReceivers || !this._dynamicReceivers) return true;
    if (this._dynamicReceivers.length === 0) return false; // no dynamic receivers → nothing can move
    if (this._dynamicReceivers.length !== this._snapshotDynReceivers.length)
      return true;
    return this._listDiffers(
      this._dynamicReceivers,
      this._snapshotDynReceivers,
    );
  }

  // ─── snapshot helpers ──────────────────────────────────────────

  _takeSnapshot(instances) {
    return instances.map((inst) => ({
      uid: inst.uid,
      x: inst.x,
      y: inst.y,
      z: inst.totalZElevation,
      w: inst.width,
      h: inst.height,
      a: inst.angle ?? inst.zAngle ?? 0,
      zh: inst.zHeight ?? 0,
    }));
  }

  /** Compare two instance arrays by UID to see if the list composition changed. */
  _instanceListChanged(oldList, newList) {
    if (oldList.length !== newList.length) return true;
    for (let i = 0; i < oldList.length; i++) {
      if (oldList[i].uid !== newList[i].uid) return true;
    }
    return false;
  }

  _listDiffers(instances, snapshot) {
    for (let i = 0; i < instances.length; i++) {
      const inst = instances[i];
      const snap = snapshot[i];
      if (
        inst.uid !== snap.uid ||
        inst.x !== snap.x ||
        inst.y !== snap.y ||
        inst.totalZElevation !== snap.z ||
        inst.width !== snap.w ||
        inst.height !== snap.h ||
        (inst.angle ?? inst.zAngle ?? 0) !== snap.a ||
        (inst.zHeight ?? 0) !== snap.zh
      ) {
        return true;
      }
    }
    return false;
  }
}
