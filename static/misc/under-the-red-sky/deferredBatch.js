"use strict"
// @ts-check

/**
 * deferredBatch.js — lets 3DObject issue raw WebGL work *inside* C3's batch
 * command list instead of flushing the batch to get ahead of it.
 *
 * ── THE PROBLEM ───────────────────────────────────────────────────────────
 * C3's renderer does not submit draws immediately. `Quad3D2`, `SetTexture`,
 * `SetModelViewMatrix` and friends append entries to a command list
 * (`renderer._batch`), and nothing reaches the GL driver until `EndBatch()`
 * runs `_WriteBuffers()` + `_ExecuteBatch()`.
 *
 * 3DObject draws with its own VAOs and its own shader, via direct `gl.*` calls.
 * Those execute *immediately*, so they would land before every command C3 still
 * has queued — drawing out of order. The historical fix was to call
 * `renderer.EndBatch()` before and after each instance, forcing C3 to catch up.
 *
 * That is correct but very expensive. Each flush is four `bufferSubData`
 * uploads plus a walk of the command list, and it happens twice per instance.
 * Measured in a real project (Under The Red Sky, "Z-corp Museum", 209 visible
 * 3DObject instances): 420 flushes per frame costing ~5.6 ms — while the models
 * themselves contributed only 8 draw calls and zero vertices to C3's batch.
 * Worse, flushing mid-frame truncates everyone else's batches too, so sprites,
 * text and 3D shapes stop merging as well.
 *
 * ── THE FIX ───────────────────────────────────────────────────────────────
 * Append the raw GL work to the same command list as a callback job, so it runs
 * in sequence with C3's own commands at flush time. Ordering is preserved with
 * no flush at all: a whole frame's worth of models can share one batch.
 *
 * C3's `WebGLBatchJob.Run()` is a switch over `this._type` (0..30 in r449.5).
 * We patch `Run` once to recognise one extra type and invoke a stored callback.
 *
 * ── NOTES FOR THE CALLBACK ────────────────────────────────────────────────
 * Callbacks run at *flush* time, not at record time. That is usually more
 * correct rather than less — `renderer._batchState.currentShader` is only
 * accurate during execution, because `DoSetProgram` sets it as the list runs —
 * but it means a callback must not read state that will have changed by then.
 * Pass values through the `a`/`b`/`c` arguments (or snapshot into the job's
 * scratch matrix) rather than capturing mutable objects.
 *
 * A callback that changes GL state C3 relies on — bound VAO, attribute
 * pointers, active program — **must restore it before returning**, because
 * later jobs in the same list will assume C3's own state is intact.
 *
 * ── SAFETY VALVE ──────────────────────────────────────────────────────────
 * Set `globalThis.C3_3DOBJECT_DEFERRED = false` to fall back to the original
 * flush-based path at runtime, for A/B testing or if a driver misbehaves.
 * `install()` also returns false on any renderer that isn't WebGL (WebGPU has
 * no equivalent batch job), and callers must honour that by flushing instead.
 */

// C3 r449.5 uses batch job types 0..30 (see BATCH_* in lib/gfx/webgl/batchJob.js).
// Sit well clear of that range so a future engine addition doesn't collide.
const BATCH_CUSTOM_CALLBACK = 900

class DeferredBatchTop {
  /** Runtime kill-switch; defaults on. */
  static isEnabled() {
    return globalThis.C3_3DOBJECT_DEFERRED !== false && DeferredBatchTop._installed
  }

  /**
   * Patch WebGLBatchJob.Run once. Returns false if this renderer can't support
   * it, in which case the caller must keep using EndBatch().
   */
  static install(renderer) {
    if (DeferredBatchTop._installed) return true
    if (DeferredBatchTop._failed) return false

    const C3 = globalThis.C3
    const jobClass = C3 && C3.Gfx && C3.Gfx.WebGLBatchJob
    if (!jobClass || !renderer || !renderer.IsWebGL || !renderer.IsWebGL()) {
      DeferredBatchTop._failed = true
      return false
    }

    const proto = jobClass.prototype
    const origRun = proto.Run
    if (typeof origRun !== "function") {
      DeferredBatchTop._failed = true
      return false
    }

    proto.Run = function () {
      if (this._type === BATCH_CUSTOM_CALLBACK) {
        DeferredBatchTop.stats.executed++
        const fn = this._c3obj_fn
        const self = this._c3obj_self
        const a = this._c3obj_a
        const b = this._c3obj_b
        const c = this._c3obj_c
        const d = this._c3obj_d
        const e = this._c3obj_e
        const f = this._c3obj_f
        // Batch jobs are pooled and live for the lifetime of the renderer, so
        // anything left referenced here would never be collected. Clear before
        // invoking, so a throwing callback can't leak either.
        this._c3obj_fn = null
        this._c3obj_self = null
        this._c3obj_a = null
        this._c3obj_b = null
        this._c3obj_c = null
        this._c3obj_d = null
        this._c3obj_e = null
        this._c3obj_f = null
        if (fn) fn.call(self, a, b, c, d, e, f)
        return
      }
      return origRun.call(this)
    }

    DeferredBatchTop._origRun = origRun
    DeferredBatchTop._installed = true
    return true
  }

  /** Restore the engine's original Run. Mainly for debugging. */
  static uninstall() {
    if (!DeferredBatchTop._installed) return
    const C3 = globalThis.C3
    C3.Gfx.WebGLBatchJob.prototype.Run = DeferredBatchTop._origRun
    DeferredBatchTop._installed = false
  }

  /**
   * Queue `fn.call(self, a, b, c, d, e, f)` to run in sequence at flush time.
   *
   * Arguments are passed through rather than captured in a closure so that a
   * scene with hundreds of models doesn't allocate hundreds of closures every
   * frame.
   */
  static push(renderer, fn, self, a, b, c, d, e, f) {
    DeferredBatchTop.stats.pushed++
    const job = renderer.PushBatch()
    job._type = BATCH_CUSTOM_CALLBACK
    job._c3obj_fn = fn
    job._c3obj_self = self
    job._c3obj_a = a === undefined ? null : a
    job._c3obj_b = b === undefined ? null : b
    job._c3obj_c = c === undefined ? null : c
    job._c3obj_d = d === undefined ? null : d
    job._c3obj_e = e === undefined ? null : e
    job._c3obj_f = f === undefined ? null : f
    // A callback may do anything, so the next quad must start a fresh draw job
    // rather than merging into whichever one preceded this.
    renderer._topOfBatch = 0
    return job
  }

  /**
   * Copy `src` into scratch storage owned by the pooled job and return it.
   *
   * Anything the callback reads must be snapshotted if the caller will mutate
   * it before the flush — matrices and colours here are reused between meshes
   * and between instances, and C3's coplanar z-fighting pass can even draw one
   * instance twice in a frame, overwriting the value before the first job runs.
   *
   * Jobs are pooled for the renderer's lifetime, so each slot allocates its
   * scratch once and this is allocation-free in the steady state.
   *
   * @param {number} slot distinct index per value snapshotted in the same job
   */
  static scratch(job, slot, length, src) {
    const key = "_c3obj_s" + slot
    let arr = job[key]
    if (!arr || arr.length !== length) {
      arr = new Float32Array(length)
      job[key] = arr
    }
    arr.set(src)
    return arr
  }

  /** push() with `a` set to a snapshot of a 16-float matrix. */
  static pushWithMatrix(renderer, fn, self, mat, b, c, d) {
    const job = DeferredBatchTop.push(renderer, fn, self, null, b, c, d)
    job._c3obj_a = DeferredBatchTop.scratch(job, 0, 16, mat)
    return job
  }
}

/**
 * Pushed vs executed callbacks.
 *
 * These must match. If `pushed` exceeds `executed`, queued draws are being
 * discarded rather than run — which is exactly what "a run of models renders
 * and then cuts off partway" looks like from the outside. `_ExecuteBatch`
 * captures `_batchPtr` before iterating and `EndBatch` zeroes it afterwards, so
 * anything queued *during* execution is silently dropped; that is the first
 * thing this counter is meant to catch.
 *
 *   DeferredBatch.resetStats()   // then move the camera for a second
 *   DeferredBatch.stats          // pushed should equal executed
 */
DeferredBatchTop.stats = { pushed: 0, executed: 0 }
DeferredBatchTop.resetStats = function () {
  DeferredBatchTop.stats.pushed = 0
  DeferredBatchTop.stats.executed = 0
}

DeferredBatchTop._installed = false
DeferredBatchTop._failed = false
DeferredBatchTop._origRun = null

// @ts-ignore
if (!globalThis.DeferredBatch) {
  globalThis.DeferredBatch = DeferredBatchTop
}
