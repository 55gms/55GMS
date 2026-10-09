/**
 * rendererOverrides.js — Patches C3 renderers for shadow rendering.
 *
 * Call `installDepthBiasOverrides()` once at startup (before any rendering).
 *
 * Adds to both WebGL and WebGPU renderers:
 *   - SetDepthBiasEnabled(bool)   — polygon offset to fix z-fighting
 *   - SetDepthWriteEnabled(bool)  — disable depth writes so shadows
 *                                   don't occlude other geometry
 *
 * No project-specific code — safe to drop into any Construct 3 project.
 */

export function installDepthBiasOverrides() {
  // ── WebGL ──────────────────────────────────────────────────────────
  C3.Gfx.WebGLRenderer = class extends C3.Gfx.WebGLRenderer {
    constructor(canvas, options) {
      super(canvas, options);
      globalThis._gl = this._gl;
      globalThis._c3Renderer = this;
      this._depthBiasEnabled = false;
      this._depthWriteDisabled = false;
    }

    SetDepthBiasEnabled(enabled) {
      enabled = !!enabled;
      if (this._depthBiasEnabled === enabled) return;
      this._depthBiasEnabled = enabled;
      this.EndBatch();

      const gl = this._gl;
      if (enabled) {
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(-1, -1);
      } else {
        gl.disable(gl.POLYGON_OFFSET_FILL);
      }
    }

    SetDepthWriteEnabled(enabled) {
      enabled = !!enabled;
      const disabled = !enabled;
      if (this._depthWriteDisabled === disabled) return;
      this._depthWriteDisabled = disabled;
      this.EndBatch();
      this._gl.depthMask(enabled);
    }
  };

  // ── WebGPU ─────────────────────────────────────────────────────────
  if (!C3.Gfx.WebGPURenderer) return;

  const _OrigShaderProgram = C3.Gfx.WebGPUShaderProgram;
  C3.Gfx.WebGPUShaderProgram = class extends _OrigShaderProgram {
    _GetRenderPipelineDescriptor(t, e, n, r, a) {
      // Variant 5: depth test ON + depth bias (z-fighting fix)
      if (e === 5) {
        const desc = super._GetRenderPipelineDescriptor(t, 1, n, r, a);
        if (desc.depthStencil) {
          desc.depthStencil.depthBias = -4;
          desc.depthStencil.depthBiasSlopeScale = -2;
          desc.depthStencil.depthBiasClamp = -0.01;
        }
        return desc;
      }
      // Variant 6: depth test ON + bias + no depth write
      if (e === 6) {
        const desc = super._GetRenderPipelineDescriptor(t, 1, n, r, a);
        if (desc.depthStencil) {
          desc.depthStencil.depthWriteEnabled = false;
          desc.depthStencil.depthBias = -4;
          desc.depthStencil.depthBiasSlopeScale = -2;
          desc.depthStencil.depthBiasClamp = -0.01;
        }
        return desc;
      }
      return super._GetRenderPipelineDescriptor(t, e, n, r, a);
    }
  };

  C3.Gfx.WebGPURenderer = class extends C3.Gfx.WebGPURenderer {
    constructor(options) {
      super(options);
      globalThis._gl = null;
      globalThis._c3Renderer = this;
      this._depthBiasEnabled = false;
      this._depthWriteDisabled = false;
    }

    SetDepthBiasEnabled(enabled) {
      enabled = !!enabled;
      if (this._depthBiasEnabled === enabled) return;
      this._MaybeEndDrawBatch();
      this._depthBiasEnabled = enabled;
      this._flags |= 32; // FLAG_PIPELINE_CHANGED
    }

    SetDepthWriteEnabled(enabled) {
      enabled = !!enabled;
      const disabled = !enabled;
      if (this._depthWriteDisabled === disabled) return;
      this._MaybeEndDrawBatch();
      this._depthWriteDisabled = disabled;
      this._flags |= 32; // FLAG_PIPELINE_CHANGED
    }

    _MaybeEndDrawBatch() {
      const needsCustomPipeline =
        (this._depthBiasEnabled || this._depthWriteDisabled) &&
        this._flags & 1 &&
        this._flags & 32;

      if (needsCustomPipeline) {
        const prog = this._currentProgram;
        if (prog) {
          const depthWriteOff = this._depthWriteDisabled;
          const biasOn = this._depthBiasEnabled;
          const origFn = prog.GetRenderPipelineForState;
          prog.GetRenderPipelineForState = function (
            blend,
            variant,
            cull,
            winding,
            ms,
          ) {
            if (variant === 1) {
              // Both bias + no write → variant 6
              // Bias only → variant 5
              // No write only → variant 6 (has both, bias is harmless)
              variant = biasOn || depthWriteOff ? (depthWriteOff ? 6 : 5) : 1;
            }
            return origFn.call(this, blend, variant, cull, winding, ms);
          };
          super._MaybeEndDrawBatch();
          prog.GetRenderPipelineForState = origFn;
          return;
        }
      }
      super._MaybeEndDrawBatch();
    }
  };
}
