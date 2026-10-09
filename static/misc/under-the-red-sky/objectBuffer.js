"use strict"
// @ts-check

// @ts-ignore
class ObjectBufferTop {
  constructor(renderer, mesh, primitiveIndex, gpuSkinning) {
    this.gl = renderer._gl
    const gl = this.gl
    this.vao = null
    this.nodeXform = new Float32Array(16)
    // Set by acquire() when this buffer is shared between instances. Unshared
    // buffers keep refs === 1 and free their GL objects on the first release().
    this._shared = false
    this._refs = 1
    this._shareKey = null
    this.maxJointIndexUsed = mesh.maxJointIndexUsed ?? -1; // Store max index used by this mesh primitive
    this.gpuSkinning = gpuSkinning
    // Whether THIS primitive is skinned, which is not the same as the instance
    // being on the GPU path - every instance is now. A static prop inside an
    // otherwise skinned model has no joints or weights.
    this.isSkinned = false

    let vertexData, texcoordData, indexData, colorData, normalData, weightsData, jointsData
    // Prefer the untransformed source positions. The node transform then rides
    // on the uNodeXform uniform instead of being baked into the vertices, which
    // is what lets every node and every instance share one buffer.
    if (mesh.drawVertsOrig && mesh.drawVertsOrig[primitiveIndex]) {
      vertexData = mesh.drawVertsOrig[primitiveIndex]
      this.usesSourcePositions = true
    } else {
      vertexData = mesh.drawVerts[primitiveIndex]
      this.usesSourcePositions = false
    }
    texcoordData = mesh.drawUVs[primitiveIndex]
    if (!texcoordData || texcoordData.length == 0) {
      // Texcoords are 2 floats per vertex (positions are 3)
      texcoordData = this.createDefaultTexcoordData((vertexData.length / 3) * 2)
    }
    indexData = mesh.drawIndices[primitiveIndex]
    colorData = mesh.drawColors[primitiveIndex]
    normalData = mesh.drawNormals ? mesh.drawNormals[primitiveIndex] : null
    weightsData = mesh.drawWeights ? mesh.drawWeights[primitiveIndex] : null
    jointsData = mesh.drawJoints ? mesh.drawJoints[primitiveIndex] : null
    // Morph deltas are shared model data; weights arrive per instance at draw time.
    this.morphTargets = mesh.morphTargets ? mesh.morphTargets[primitiveIndex] : null
    this.morphVertexCount = vertexData ? vertexData.length / 3 : 0
    this.instanceBuffer = null
    this.canInstance = false
    // Instanced-draw groups. See addInstance().
    this._openGroup = null
    this._groupPool = []
    this.isSkinned = !!(weightsData && jointsData)
    this.indexDataLength = indexData.length
    this.vertexData = vertexData
    this.texcoordData = texcoordData
    this.indexData = indexData
    this.colorData = colorData
    this.normalData = normalData
    this.weightsData = weightsData
    // Change jointsData to float32ARRAY FROM UINT16ARRAY
    // C3 Shader uniforms must be cast as float instead of int, unknown why
    // If non C3 shader program is used, it will not be required
    if (jointsData) {
      this.jointsData = new Float32Array(jointsData.length)
      this.jointsData.set(jointsData)
    }

    this.vertexBuffer = gl.createBuffer()
    this.texcoordBuffer = gl.createBuffer()
    this.indexBuffer = gl.createBuffer()
    if (colorData != null) {
      this.colorBuffer = gl.createBuffer()
    }
    if (normalData != null) {
      this.normalBuffer = gl.createBuffer()
    }
    if (weightsData != null) {
      this.weightsBuffer = gl.createBuffer()
    }
    if (jointsData != null) {
      this.jointsBuffer = gl.createBuffer()
    }
    // Fill all buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.texcoordData, gl.STATIC_DRAW)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW)

    if (colorData != null) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, this.colorData, gl.STATIC_DRAW)
    }
    if (normalData != null) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, this.normalData, gl.STATIC_DRAW)
    }
    if (weightsData != null) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.weightsBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, this.weightsData, gl.STATIC_DRAW)
    }
    if (jointsData != null) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.jointsBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, this.jointsData, gl.STATIC_DRAW)
    }

    // vao created at draw time to insure the correct shader is used
    // Color uniform locations for 3DObject compatibility
    this.locUseUniformColor = null;
    this.locObjectColor = null;
  }

  /**
   * Get a buffer for `mesh.primitives[primitiveIndex]`, sharing the GL objects
   * between instances of the same model where that is provably safe.
   *
   * ── WHY ───────────────────────────────────────────────────────────────────
   * Every ObjectBuffer allocates seven GL buffers (vertex, texcoord, index,
   * colour, normal, weights, joints). One per primitive *per instance* is what
   * puts a crowd of characters into an out-of-memory crash — 150 skinned models
   * of a few primitives each is over a thousand buffers holding a thousand
   * copies of identical bytes.
   *
   * ── WHEN IT IS SAFE ───────────────────────────────────────────────────────
   * Only when the vertex data itself is shared, and nothing per-instance lives
   * on the buffer.
   *
   * 1. **The data must be shared.** With GPU skinning the buffer is filled from
   *    `mesh.drawVertsOrig`, which `sharedOrCopy()` in gltfModel hands out as the
   *    *same* Float32Array for every instance (the parsed glTF lives on the
   *    sdkType). Bones deform it in the vertex shader, so it is never rewritten
   *    — note that `updateVertexData()` is only ever called on the `!gpuSkinning`
   *    path. With CPU skinning the buffer is filled from `mesh.drawVerts`, which
   *    is a per-instance array that gets re-uploaded every frame.
   *
   *    Keying the cache on the identity of the vertex array makes this
   *    self-enforcing rather than assumed: a per-instance array is a distinct
   *    key, so it simply gets its own buffer.
   *
   * 2. **`this.nodeXform` must be unused.** It is the one genuinely per-instance
   *    field, and sharing would let one instance clobber another's — invisibly,
   *    since draws are deferred to flush time, so *every* sharer would end up
   *    using whichever value was written last. `_drawNow` only reads it on the
   *    non-skinning path, so sharing is restricted to primitives that actually
   *    carry JOINTS/WEIGHTS. `setNodeXform` is a no-op on a shared buffer, and
   *    `uploadNodeXformUniforms` warns if one ever reaches it anyway.
   *
   * Anything not meeting both conditions falls through to a plain per-instance
   * buffer, i.e. exactly the previous behaviour.
   *
   * Per-instance state that is *not* on the buffer and so needs nothing here:
   * bone matrices (per-instance BoneBuffer UBO), instance tint (an argument to
   * `draw()`), and mesh visibility (`drawMeshes[j].disabled`, checked by the
   * caller). Different instances can therefore share geometry while still
   * playing different animations, wearing different skins and showing different
   * sub-meshes.
   */
  static acquire(renderer, mesh, primitiveIndex, gpuSkinning, hasAnimations) {
    if (
      !ObjectBufferTop.isSharingEnabled() ||
      !ObjectBufferTop._isShareable(mesh, primitiveIndex, gpuSkinning, hasAnimations)
    ) {
      ObjectBufferTop.stats.unshared++
      return new ObjectBufferTop(renderer, mesh, primitiveIndex, gpuSkinning)
    }

    const vertexData = mesh.drawVertsOrig[primitiveIndex]
    const indexData = mesh.drawIndices[primitiveIndex]

    // Outer key is weak so a model unloading drops its whole cache line with it.
    // Inner key distinguishes primitives that happen to share a POSITION accessor.
    let byIndexData = ObjectBufferTop._cache.get(vertexData)
    if (!byIndexData) {
      byIndexData = new Map()
      ObjectBufferTop._cache.set(vertexData, byIndexData)
    }

    let buffer = byIndexData.get(indexData)
    if (buffer) {
      buffer._refs++
      ObjectBufferTop.stats.reused++
      return buffer
    }

    buffer = new ObjectBufferTop(renderer, mesh, primitiveIndex, gpuSkinning)
    buffer._shared = true
    buffer._refs = 1
    buffer._shareKey = { vertexData, indexData }
    byIndexData.set(indexData, buffer)
    ObjectBufferTop.stats.created++
    return buffer
  }

  /** Runtime kill-switch, for A/B testing against per-instance allocation. */
  static isSharingEnabled() {
    return globalThis.C3_3DOBJECT_SHARE_BUFFERS !== false
  }

  static _isShareable(mesh, primitiveIndex, gpuSkinning, hasAnimations) {
    // The buffer has to be built from the shared source accessors, not from an
    // instance's transformed copy.
    if (!mesh.drawVertsOrig || !mesh.drawVertsOrig[primitiveIndex]) return false
    if (!mesh.drawIndices || !mesh.drawIndices[primitiveIndex]) return false

    // Skinned: deformation is bone uniforms, the base mesh never changes.
    const skinned = !!(
      mesh.drawWeights && mesh.drawWeights[primitiveIndex] && mesh.drawJoints && mesh.drawJoints[primitiveIndex]
    )
    if (skinned) return true

    // Unskinned: shareable exactly when nothing rewrites the vertices per frame.
    return !hasAnimations
  }

  _ExecuteBatch(renderer) {
    if (renderer._batchPtr === 0) {
      return
    }
    if (renderer.IsContextLost()) return
    // renderer._WriteBuffers()
    renderer._ExecuteBatch()
    renderer._batchPtr = 0
    renderer._vertexPtr = 0
    renderer._texPtr = 0
    renderer._pointPtr = 0
    renderer._topOfBatch = 0
  }

  createVao(renderer) {
    const gl = renderer._gl
    const batchState = renderer._batchState
    const shaderProgram = batchState.currentShader._shaderProgram
    this.locAPos = globalThis.uniformCache.getAttributeLocation(gl, shaderProgram, "aPos")
    this.locATex = globalThis.uniformCache.getAttributeLocation(gl, shaderProgram, "aTex")
    this.locAColor = globalThis.uniformCache.getAttributeLocation(gl, shaderProgram, "aColor")
    this.locANormal = globalThis.uniformCache.getAttributeLocation(gl, shaderProgram, "aNormal")
    this.locAWeights = globalThis.uniformCache.getAttributeLocation(gl, shaderProgram, "aWeights")
    this.locAJoints = globalThis.uniformCache.getAttributeLocation(gl, shaderProgram, "aJoints")
    this.locHasVertexColors = globalThis.uniformCache.getLocation(gl, shaderProgram, "uHasVertexColors")
    
    // Get color uniform locations for 3DObject compatibility
    this.locUseUniformColor = globalThis.uniformCache.getLocation(gl, shaderProgram, "uUseUniformColor")
    this.locObjectColor = globalThis.uniformCache.getLocation(gl, shaderProgram, "uObjectColor")
    
    // Debug logging for uniform availability
    if (this.locUseUniformColor === null) {
      console.warn("[3DObject] uUseUniformColor uniform not found in shader")
    }
    if (this.locObjectColor === null) {
      console.warn("[3DObject] uObjectColor uniform not found in shader")
    }

    const locAPos = this.locAPos
    const locATex = this.locATex
    const locAColor = this.locAColor
    const locANormal = this.locANormal
    const locAWeights = this.locAWeights
    const locAJoints = this.locAJoints
    const vB = this.vertexBuffer
    const tB = this.texcoordBuffer
    const cB = this.colorBuffer
    const nB = this.normalBuffer
    const jB = this.jointsBuffer
    const wB = this.weightsBuffer

    if (locAJoints == -1) {
      console.error("locAJoints == -1")
    }

    if (locAWeights == -1) {
      console.error("locAWeights == -1")
    }
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    gl.bindBuffer(gl.ARRAY_BUFFER, vB)
    gl.vertexAttribPointer(locAPos, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(locAPos)
    gl.bindBuffer(gl.ARRAY_BUFFER, tB)
    gl.vertexAttribPointer(locATex, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(locATex)
    // Store whether this object has vertex colors for use in draw()
    this.hasVertexColors = (cB != null && locAColor != -1)
    
    if (this.hasVertexColors) {
      gl.bindBuffer(gl.ARRAY_BUFFER, cB)
      gl.vertexAttribPointer(locAColor, 3, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(locAColor)
    }
    if (nB != null && locANormal != -1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, nB)
      gl.vertexAttribPointer(locANormal, 3, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(locANormal)
    }
    if (wB != null && locAWeights != -1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, wB)
      gl.vertexAttribPointer(locAWeights, 4, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(locAWeights)
    }
    if (jB != null && locAJoints != -1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, jB)
      gl.vertexAttribPointer(locAJoints, 4, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(locAJoints)
    }

    // Per-instance attributes: mat4 model matrix as four vec4s, then the tint.
    // Divisor 1 means they advance once per instance rather than per vertex.
    const locIModel = globalThis.uniformCache.getAttributeLocation(gl, shaderProgram, "aIModel")
    const locIColor = globalThis.uniformCache.getAttributeLocation(gl, shaderProgram, "aIColor")
    this.canInstance = locIModel !== -1 && locIColor !== -1 && !this.isSkinned
    if (this.canInstance) {
      if (!this.instanceBuffer) this.instanceBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer)
      const stride = ObjectBufferTop.INSTANCE_FLOATS * 4
      for (let i = 0; i < 4; i++) {
        gl.vertexAttribPointer(locIModel + i, 4, gl.FLOAT, false, stride, i * 16)
        gl.enableVertexAttribArray(locIModel + i)
        gl.vertexAttribDivisor(locIModel + i, 1)
      }
      gl.vertexAttribPointer(locIColor, 4, gl.FLOAT, false, stride, 64)
      gl.enableVertexAttribArray(locIColor)
      gl.vertexAttribDivisor(locIColor, 1)
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)

    gl.bindVertexArray(null)

    return vao
  }

  uploadNodeXformUniforms(renderer) {
    // Reaching here on a shared buffer means acquire()'s second precondition is
    // wrong for this model, and every sharer is about to draw with a stale
    // transform. Say so rather than shipping a subtle misplacement.
    if (this._shared && !ObjectBufferTop._warnedSharedNodeXform) {
      ObjectBufferTop._warnedSharedNodeXform = true
      console.warn(
        "3DObject: a shared ObjectBuffer reached uploadNodeXformUniforms; " +
          "its nodeXform is not per-instance. Set globalThis.C3_3DOBJECT_SHARE_BUFFERS = false to fall back."
      )
    }

    const gl = renderer._gl
    const shaderProgram = renderer._batchState.currentShader._shaderProgram
    const locUNodeXform = globalThis.uniformCache.getLocation(gl, shaderProgram, "uNodeXform")
    gl.uniformMatrix4fv(locUNodeXform, false, this.nodeXform)

    const locUNodeXformEnable = globalThis.uniformCache.getLocation(gl, shaderProgram, "uNodeXformEnable")
    gl.uniform1f(locUNodeXformEnable, 1.0)
    // Raw writes: tell the value cache so the next cached set is not skipped.
    globalThis.uniformCache.invalidate(shaderProgram, "uNodeXform")
    globalThis.uniformCache.invalidate(shaderProgram, "uNodeXformEnable")
  }

  /**
   * Draw this primitive.
   *
   * Prefers queueing the GL work into C3's batch command list (see
   * deferredBatch.js) so the batch never has to be flushed. Flushing here is
   * the fallback for WebGPU or when the deferral is switched off, and it is
   * expensive: it costs four bufferSubData uploads plus a command-list walk,
   * per primitive, per instance, and it truncates every other object's batch
   * as a side effect.
   */
  draw(renderer, instanceBoneBuffer, modelGltfData, instanceColor = null, morphWeights = null, nodeXform = null) {
    const DeferredBatch = globalThis.DeferredBatch

    if (DeferredBatch && DeferredBatch.install(renderer) && DeferredBatch.isEnabled()) {
      const job = DeferredBatch.push(
        renderer,
        ObjectBufferTop.prototype._drawNow,
        this,
        renderer,
        instanceBoneBuffer,
        modelGltfData
      )
      // instanceColor is a scratch array the caller rewrites per mesh, so it
      // has to be copied rather than referenced. Same for the morph weights,
      // which the animation update rewrites in place every frame.
      job._c3obj_d = instanceColor ? DeferredBatch.scratch(job, 1, 4, instanceColor) : null
      job._c3obj_e =
        morphWeights && morphWeights.length
          ? DeferredBatch.scratch(job, 2, morphWeights.length, morphWeights)
          : null
      // The scene-graph matrix is rewritten in place by the next getPolygons(),
      // so it has to be snapshotted like the colour and the weights.
      job._c3obj_f = nodeXform ? DeferredBatch.scratch(job, 3, 16, nodeXform) : null
      return
    }

    this._ExecuteBatch(renderer) // Flushes any pending C3 draw calls
    this._drawNow(renderer, instanceBoneBuffer, modelGltfData, instanceColor, morphWeights, nodeXform)
  }

  /**
   * The actual GL work. Runs at flush time when deferred, which is also when
   * `renderer._batchState.currentShader` is accurate — `DoSetProgram` sets it
   * as the command list executes, so reading it here is correct where reading
   * it at record time would not be.
   */
  _drawNow(renderer, instanceBoneBuffer, modelGltfData, instanceColor = null, morphWeights = null, nodeXform = null) {
    const gl = renderer._gl;

    if (this.vao === null) {
      this.vao = this.createVao(renderer); // also resolves the color uniform locations
    }
    // Set color uniforms for 3DObject compatibility
    const shaderProgram = renderer._batchState.currentShader._shaderProgram;
    // A group of instanced draws may have run just before this one.
    globalThis.uniformCache.setFloat(gl, shaderProgram, "uInstancedEnable", 0.0);
    this._setColorUniforms(gl, instanceColor, shaderProgram);
    this._uploadMorphUniforms(renderer, morphWeights);
    gl.bindVertexArray(this.vao);

    if (instanceBoneBuffer && instanceBoneBuffer.skinAnimation) {
        // --- Skinning Path --- 
        const sharedModelUbo = modelGltfData ? modelGltfData.getOrCreateModelBoneUbo(renderer) : null;
        // instanceBoneBuffer.uploadUniforms handles UBO, skin flags, rootNodeXform, and dummy fallback
        instanceBoneBuffer.uploadUniforms(sharedModelUbo);
        // Note: NodeXform from ObjectBuffer is not used in the skinning path; uRootNodeXform from BoneBuffer is used.

    } else {
        // --- Non-Skinning Path (or no specific instanceBoneBuffer for skinning) ---
        let nodeXformUploadedByBoneBuffer = false;
        if (instanceBoneBuffer) { // E.g., a BoneBuffer present but skinAnimation is false
            instanceBoneBuffer.uploadUniformsNonSkin(renderer);
            // uploadUniformsNonSkin handles dummy UBO, skin disable, UV xform, and also uploads BoneBuffer.nodeXform if present.
            if (instanceBoneBuffer.nodeXform) {
                 nodeXformUploadedByBoneBuffer = true; // Assume BoneBuffer handled nodeXform if it has one
            }
        } else {
            // No BoneBuffer instance provided at all.
            // ObjectBuffer must handle UV transforms and potentially dummy UBO for "Bones" block.
            this._disableGPUSkinning(renderer);

            // Manually handle dummy UBO binding if shader expects "Bones" and no BoneBuffer did it.
            const shaderProgram = renderer._batchState.currentShader._shaderProgram;
            // Check if globalThis.BoneBuffer (the class) exists before accessing its static members
            if (globalThis.BoneBuffer) { // Check if BoneBuffer class is available
                const blockIndex = globalThis.uniformCache.getUniformBlockIndex(gl, shaderProgram, "Bones");
                if (blockIndex !== gl.INVALID_INDEX && blockIndex !== -1) { // Shader expects the Bones UBO
                    // uniformBlockBinding is permanent program state, so this
                    // only needs doing once per program, not once per instance
                    // per frame. uSkinEnable was already set by
                    // _disableGPUSkinning immediately above.
                    if (!ObjectBufferTop._boundBonesBlock.has(shaderProgram)) {
                        gl.uniformBlockBinding(shaderProgram, blockIndex, globalThis.BoneBuffer.BONE_UBO_BINDING_POINT);
                        ObjectBufferTop._boundBonesBlock.add(shaderProgram);
                    }
                    const dummyUBO = globalThis.BoneBuffer._getOrCreateDummyUBO(gl);
                    if (dummyUBO) {
                        gl.bindBufferBase(gl.UNIFORM_BUFFER, globalThis.BoneBuffer.BONE_UBO_BINDING_POINT, dummyUBO);
                    }
                } else {
                    // Shader does not expect "Bones" block, do nothing for UBO.
                }
            } else {
                 // BoneBuffer class not globally available, cannot manage dummy UBO here.
                 // Check if shader expects it and warn if so, as it might lead to issues.
                 const blockIndex = globalThis.uniformCache.getUniformBlockIndex(gl, shaderProgram, "Bones");
                 if (blockIndex !== gl.INVALID_INDEX && blockIndex !== -1) {
                    console.warn("ObjectBuffer: globalThis.BoneBuffer not found, cannot bind dummy UBO even though shader expects 'Bones' block.");
                 }
            }
        }

        // Upload node transform if not handled by a BoneBuffer instance (non-skinned path)
        if (!nodeXformUploadedByBoneBuffer) {
            if (this.isSkinned) {
              this.uploadNodeXformUniforms(renderer);
            } else if (nodeXform) {
              this._uploadNodeXform(renderer, nodeXform);
            }
        }
    }

    // --- Draw Call (Common for all paths) ---
    gl.drawElements(gl.TRIANGLES, this.indexDataLength, gl.UNSIGNED_SHORT, 0);

    // Unbind VAO once after all drawing paths
    gl.bindVertexArray(null);
    // Note: UBO unbinding from the binding point (BoneBufferTop.BONE_UBO_BINDING_POINT)
    // is implicitly handled by the next bindBufferBase or if nothing else binds to it.
    // No explicit unbind is strictly necessary here for bindBufferBase.
  }

  _disableGPUSkinning(renderer) {
    const gl = renderer._gl;
    const shaderProgram = renderer._batchState.currentShader._shaderProgram;
    globalThis.uniformCache.setFloat(gl, shaderProgram, "uSkinEnable", 0.0);
    globalThis.uniformCache.setFloat(gl, shaderProgram, "uNodeXformEnable", 0.0);
  }

  // Helper method for setting color uniforms for 3DObject instance tinting
  _setColorUniforms(gl, instanceColor, shaderProgram) {
    const uc = globalThis.uniformCache
    uc.setFloat(gl, shaderProgram, "uUseUniformColor", 1.0)
    uc.setFloat(gl, shaderProgram, "uHasVertexColors", this.hasVertexColors ? 1.0 : 0.0)
    if (instanceColor && instanceColor.length >= 4) {
      uc.setVec4(gl, shaderProgram, "uObjectColor", instanceColor[0], instanceColor[1], instanceColor[2], instanceColor[3])
    } else {
      uc.setVec4(gl, shaderProgram, "uObjectColor", 1.0, 1.0, 1.0, 1.0)
    }
  }


  createDefaultTexcoordData(length) {
    const texcoordData = new Float32Array(length)
    for (let i = 0; i < length; i++) {
      texcoordData[i] = 0.5
    }
    return texcoordData
  }

  /**
   * Build (once per model) the float texture holding this primitive's morph
   * target deltas, and cache it on the targets array itself so every instance
   * of the model shares one upload.
   *
   * Deltas are model data; only the weights are per-instance, so morphing on
   * the GPU stays compatible with buffer sharing in a way CPU morphing never
   * could - CPU morphs bake into per-instance vertices by definition.
   *
   * Layout matches applyMorph() in the vertex shader: two texels per vertex per
   * target, position delta then normal delta, index = (t*count + v)*2 + channel.
   */
  static _getMorphTexture(gl, targets, vertexCount) {
    let entry = ObjectBufferTop._morphCache.get(targets)
    if (entry) return entry

    const texelCount = targets.length * vertexCount * 2
    const maxSize = gl.getParameter(gl.MAX_TEXTURE_SIZE)
    const width = Math.min(texelCount, maxSize)
    const height = Math.ceil(texelCount / width)
    if (height > maxSize) {
      console.warn("[3DObject] morph targets exceed max texture size; morphing disabled for this mesh")
      entry = { texture: null, width: 0, vertexCount: 0, count: 0 }
      ObjectBufferTop._morphCache.set(targets, entry)
      return entry
    }

    const data = new Float32Array(width * height * 4)
    for (let t = 0; t < targets.length; t++) {
      const pos = targets[t].POSITION ? targets[t].POSITION.data : null
      const nrm = targets[t].NORMAL ? targets[t].NORMAL.data : null
      for (let v = 0; v < vertexCount; v++) {
        const base = ((t * vertexCount + v) * 2) * 4
        if (pos) {
          data[base] = pos[v * 3]
          data[base + 1] = pos[v * 3 + 1]
          data[base + 2] = pos[v * 3 + 2]
        }
        if (nrm) {
          data[base + 4] = nrm[v * 3]
          data[base + 5] = nrm[v * 3 + 1]
          data[base + 6] = nrm[v * 3 + 2]
        }
      }
    }

    const texture = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0 + ObjectBufferTop.MORPH_TEXTURE_UNIT)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    // texelFetch only, so no filtering or mips are needed or wanted.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, width, height, 0, gl.RGBA, gl.FLOAT, data)
    gl.activeTexture(gl.TEXTURE0)

    entry = { texture, width, vertexCount, count: targets.length }
    ObjectBufferTop._morphCache.set(targets, entry)
    return entry
  }

  /** Upload this instance's morph weights, or switch morphing off. */
  _uploadMorphUniforms(renderer, morphWeights) {
    const gl = renderer._gl
    const shaderProgram = renderer._batchState.currentShader._shaderProgram
    const locCount = globalThis.uniformCache.getLocation(gl, shaderProgram, "uMorphCount")
    if (!locCount) return

    const targets = this.morphTargets
    if (!targets || !targets.length || !morphWeights || !morphWeights.length) {
      gl.uniform1i(locCount, 0)
      return
    }

    const morph = ObjectBufferTop._getMorphTexture(gl, targets, this.morphVertexCount)
    if (!morph.texture) {
      gl.uniform1i(locCount, 0)
      return
    }

    const count = Math.min(morph.count, morphWeights.length, ObjectBufferTop.MAX_MORPH)
    gl.uniform1i(locCount, count)
    gl.uniform1i(globalThis.uniformCache.getLocation(gl, shaderProgram, "uMorphTexWidth"), morph.width)
    gl.uniform1i(globalThis.uniformCache.getLocation(gl, shaderProgram, "uMorphVertexCount"), morph.vertexCount)

    if (!this._morphWeightScratch || this._morphWeightScratch.length !== ObjectBufferTop.MAX_MORPH) {
      this._morphWeightScratch = new Float32Array(ObjectBufferTop.MAX_MORPH)
    }
    const w = this._morphWeightScratch
    w.fill(0)
    for (let i = 0; i < count; i++) w[i] = morphWeights[i]
    gl.uniform1fv(globalThis.uniformCache.getLocation(gl, shaderProgram, "uMorphWeights"), w)

    gl.activeTexture(gl.TEXTURE0 + ObjectBufferTop.MORPH_TEXTURE_UNIT)
    gl.bindTexture(gl.TEXTURE_2D, morph.texture)
    gl.uniform1i(
      globalThis.uniformCache.getLocation(gl, shaderProgram, "uMorphTex"),
      ObjectBufferTop.MORPH_TEXTURE_UNIT
    )
    gl.activeTexture(gl.TEXTURE0)
  }

  setNodeXform(nodeXform) {
    // A shared buffer has no single owner to hold this for. Unskinned meshes now
    // pass the node transform to draw() as an argument instead, so it stays
    // per-draw rather than becoming buffer state - see acquire().
    if (this._shared) return
    this.nodeXform = nodeXform
  }

  /**
   * Queue one instance of this mesh for an instanced draw.
   *
   * The per-instance model matrix (with the node transform already folded in)
   * and tint are appended to the open GROUP. The first instance of a group
   * queues the single deferred job that draws the whole group, so the group
   * renders at that point in C3's command list.
   *
   * ── WHY GROUPS HAVE TO SPLIT ─────────────────────────────────────────────
   * The job executes at the position where the group was OPENED, under the GL
   * state C3 had queued up to that point. Anything C3 changes positionally
   * between two instances - and does not know we deferred past - is therefore
   * applied to the whole group. Three cases bit in a real project:
   *
   *   1. C3's coplanar z-fighting pass draws the first instance of a same-Z run
   *      inside a STENCIL pass with colorMask(false). A group opened there
   *      writes depth for every later instance but never any colour, and which
   *      instance is "first" changes with the camera.
   *   2. An instance with a depth-using effect (e.g. a fresnel) is pre-drawn
   *      into a temp surface with a scissor rect around its own bbox. Later
   *      instances land in that temp surface, clipped away.
   *   3. The same mesh on two layers with different cameras or render targets.
   *
   * So a group stays open only while the renderer's positional state matches
   * what it was opened under; otherwise a new group (and a new job) starts. A
   * mid-frame EndBatch runs the job, which closes the group, so the next
   * instance starts a fresh one. That is why this needs no frame hook.
   */
  addInstance(renderer, modelMatrix, instanceColor) {
    const FLOATS = ObjectBufferTop.INSTANCE_FLOATS
    let g = this._openGroup
    if (g && !this._isGroupOpen(renderer, g)) g = null
    if (!g) {
      g = this._groupPool.pop() || ObjectBufferTop._newGroup()
      g.count = 0
      ObjectBufferTop._captureBatchState(renderer, g)
      g.job = globalThis.DeferredBatch.push(renderer, ObjectBufferTop.prototype._drawInstancedNow, this, renderer, g)
      g.jobIndex = renderer._batchPtr - 1
      if (this._openGroup) ObjectBufferTop.stats.groupsSplit++
      this._openGroup = g
    }

    let data = g.data
    const need = (g.count + 1) * FLOATS
    if (data.length < need) {
      const grown = new Float32Array(Math.max(need, data.length * 2))
      grown.set(data)
      data = g.data = grown
    }
    const at = g.count * FLOATS
    data.set(modelMatrix, at)
    if (instanceColor && instanceColor.length >= 4) {
      data[at + 16] = instanceColor[0]
      data[at + 17] = instanceColor[1]
      data[at + 18] = instanceColor[2]
      data[at + 19] = instanceColor[3]
    } else {
      data[at + 16] = data[at + 17] = data[at + 18] = data[at + 19] = 1
    }
    g.count++
  }

  /**
   * True when `g` can still take instances: its job is pending in the current
   * batch and the renderer's positional state still matches. A job that was
   * dropped (batch reset without executing) can never run, so its group is
   * recycled here rather than left open forever - which is what "this mesh
   * stopped drawing for the rest of the session" looked like.
   */
  _isGroupOpen(renderer, g) {
    const job = g.job
    const pending =
      job &&
      job._c3obj_b === g &&
      renderer._batchPtr > g.jobIndex &&
      renderer._batch[g.jobIndex] === job
    if (!pending) {
      g.job = null
      g.count = 0
      this._groupPool.push(g)
      this._openGroup = null
      return false
    }
    return ObjectBufferTop._batchStateMatches(renderer, g)
  }

  static _newGroup() {
    return {
      data: new Float32Array(64 * ObjectBufferTop.INSTANCE_FLOATS),
      count: 0,
      job: null,
      jobIndex: -1,
      // Positional renderer state the group was opened under.
      rt: null,
      tex: null,
      blendA: 0,
      blendB: 0,
      cull: 0,
      winding: 0,
      coplanar: 0,
      depth: false,
      depthSampling: false,
      // scissor(4) | viewport(4) | matP(16) | matMV(16)
      nums: new Float64Array(40),
    }
  }

  /**
   * Snapshot every piece of renderer state that C3 records into the batch
   * positionally and that affects where or whether our draw lands. All of it
   * is updated by the renderer at RECORD time (SetRenderTarget, SetScissorRect,
   * SetDepthEnabled, Coplanar*, SetBlendMode, SetTexture, SetProjectionMatrix,
   * SetModelViewMatrix...), so reading it here reflects what the job will run
   * under. Blend is `_lastBlendMode` from r496 and the src/dest pair before.
   */
  static _captureBatchState(renderer, g) {
    g.rt = renderer._currentRenderTarget
    g.tex = renderer._lastTexture0
    g.coplanar = renderer._coplanarMode
    g.depth = renderer._isDepthEnabled
    g.depthSampling = renderer._isDepthSamplingEnabled
    g.blendA = renderer._lastBlendMode !== undefined ? renderer._lastBlendMode : renderer._lastSrcBlend
    g.blendB = renderer._lastDestBlend
    g.cull = renderer._lastCullFace
    g.winding = renderer._lastFrontFaceWinding
    const n = g.nums
    const sc = renderer._lastScissorRect
    if (sc && typeof sc.getLeft === "function") {
      n[0] = sc.getLeft()
      n[1] = sc.getTop()
      n[2] = sc.getRight()
      n[3] = sc.getBottom()
    }
    const vp = renderer._viewport
    if (vp) {
      n[4] = vp[0]
      n[5] = vp[1]
      n[6] = vp[2]
      n[7] = vp[3]
    }
    const matP = renderer._matP
    const matMV = renderer._matMV
    for (let i = 0; i < 16; i++) {
      n[8 + i] = matP[i]
      n[24 + i] = matMV[i]
    }
  }

  static _batchStateMatches(renderer, g) {
    if (g.rt !== renderer._currentRenderTarget) return false
    if (g.tex !== renderer._lastTexture0) return false
    if (g.coplanar !== renderer._coplanarMode) return false
    if (g.depth !== renderer._isDepthEnabled) return false
    if (g.depthSampling !== renderer._isDepthSamplingEnabled) return false
    const blendA = renderer._lastBlendMode !== undefined ? renderer._lastBlendMode : renderer._lastSrcBlend
    if (g.blendA !== blendA || g.blendB !== renderer._lastDestBlend) return false
    if (g.cull !== renderer._lastCullFace || g.winding !== renderer._lastFrontFaceWinding) return false
    const n = g.nums
    const sc = renderer._lastScissorRect
    if (sc && typeof sc.getLeft === "function") {
      if (n[0] !== sc.getLeft() || n[1] !== sc.getTop() || n[2] !== sc.getRight() || n[3] !== sc.getBottom())
        return false
    }
    const vp = renderer._viewport
    if (vp && (n[4] !== vp[0] || n[5] !== vp[1] || n[6] !== vp[2] || n[7] !== vp[3])) return false
    const matP = renderer._matP
    const matMV = renderer._matMV
    for (let i = 0; i < 16; i++) {
      if (n[8 + i] !== matP[i] || n[24 + i] !== matMV[i]) return false
    }
    return true
  }

  /** Upload one group's instances and draw them all in one call. */
  _drawInstancedNow(renderer, g) {
    if (this._openGroup === g) this._openGroup = null
    const count = g.count
    g.count = 0
    g.job = null
    this._groupPool.push(g)
    if (count === 0) return
    // Released between record and flush (the owning instance was destroyed
    // after it drew). Nothing to draw with.
    if (!this.gl || !this.vertexBuffer) return

    const gl = renderer._gl
    if (this.vao === null) this.vao = this.createVao(renderer)

    const shaderProgram = renderer._batchState.currentShader._shaderProgram
    const uc = globalThis.uniformCache
    uc.setFloat(gl, shaderProgram, "uInstancedEnable", 1.0)
    uc.setFloat(gl, shaderProgram, "uSkinEnable", 0.0)
    uc.setFloat(gl, shaderProgram, "uNodeXformEnable", 0.0)
    uc.setFloat(gl, shaderProgram, "uModelRotateEnable", 0.0)
    uc.setFloat(gl, shaderProgram, "uHasVertexColors", this.hasVertexColors ? 1.0 : 0.0)

    gl.bindVertexArray(this.vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, g.data.subarray(0, count * ObjectBufferTop.INSTANCE_FLOATS), gl.DYNAMIC_DRAW)
    gl.drawElementsInstanced(gl.TRIANGLES, this.indexDataLength, gl.UNSIGNED_SHORT, 0, count)
    gl.bindVertexArray(null)

    // Leave the flag off so the non-instanced paths are unaffected.
    uc.setFloat(gl, shaderProgram, "uInstancedEnable", 0.0)
  }

  /** Node transform for an unskinned mesh drawn from untransformed positions. */
  _uploadNodeXform(renderer, nodeXform) {
    const gl = renderer._gl
    const shaderProgram = renderer._batchState.currentShader._shaderProgram
    globalThis.uniformCache.setMatrix4(gl, shaderProgram, "uNodeXform", nodeXform)
    globalThis.uniformCache.setFloat(gl, shaderProgram, "uNodeXformEnable", 1.0)
  }

  updateVertexData(renderer, mesh, primitiveIndex) {
    // Built from the immutable accessor: there is nothing to refresh, and
    // overwriting it with this instance's transformed verts would corrupt the
    // buffer for every other instance sharing it.
    if (this.usesSourcePositions) return
    const gl = renderer._gl
    const vertexData = mesh.drawVerts[primitiveIndex]

    // Fill only vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW)
  }

  release() {
    // Shared buffers outlive the instance that happened to release first.
    if (--this._refs > 0) return
    if (this._shareKey) {
      const byIndexData = ObjectBufferTop._cache.get(this._shareKey.vertexData)
      if (byIndexData) byIndexData.delete(this._shareKey.indexData)
      this._shareKey = null
      this._shared = false
    }

    const gl = this.gl
    if (this.vertexBuffer) {
      gl.deleteBuffer(this.vertexBuffer)
      this.vertexBuffer = null
    }
    if (this.texcoordBuffer) {
      gl.deleteBuffer(this.texcoordBuffer)
      this.texcoordBuffer = null
    }
    if (this.indexBuffer) {
      gl.deleteBuffer(this.indexBuffer)
      this.indexBuffer = null
    }
    if (this.vao) {
      gl.deleteVertexArray(this.vao)
      this.vao = null
    }
    if (this.instanceBuffer) {
      gl.deleteBuffer(this.instanceBuffer)
      this.instanceBuffer = null
    }
    // A pending group job finds gl === null and draws nothing.
    this._openGroup = null
    this._groupPool.length = 0
    if (this.colorBuffer) {
      gl.deleteBuffer(this.colorBuffer)
      this.colorBuffer = null
    }
    if (this.normalBuffer) {
      gl.deleteBuffer(this.normalBuffer)
      this.normalBuffer = null
    }
    if (this.weightsBuffer) {
      gl.deleteBuffer(this.weightsBuffer)
      this.weightsBuffer = null
    }
    if (this.jointsBuffer) {
      gl.deleteBuffer(this.jointsBuffer)
      this.jointsBuffer = null
    }
    this.gl = null
    this.vertexData = null
    this.texcoordData = null
    this.indexData = null
    this.colorData = null
    this.normalData = null
    this.weightsData = null
    this.jointsData = null
    this.locAPos = null
    this.locATex = null
    this.locAColor = null
    this.locANormal = null
    this.locAWeights = null
    this.locAJoints = null
    this.nodeXform = null
    this.vao = null
  }
}

/** vertex data array → (index data array → shared ObjectBuffer). See acquire(). */
ObjectBufferTop._cache = new WeakMap()
ObjectBufferTop._warnedSharedNodeXform = false

/**
 * How buffer sharing is doing.
 *
 *   ObjectBuffer.stats   // { created, reused, unshared }
 *
 * `created` is the number of distinct shared primitives, `reused` the number of
 * allocations avoided, `unshared` the primitives that fell back to a buffer of
 * their own (all CPU-skinned and all non-skinned ones). With a crowd of one
 * character model, `reused` should be roughly instances × primitives and
 * `created` should stay in the single digits.
 */
// C3 uses texture units 0 and 1, so sit clear of both.
// mat4 model matrix (16) + rgba tint (4) per instance.
ObjectBufferTop.INSTANCE_FLOATS = 20
ObjectBufferTop.MORPH_TEXTURE_UNIT = 4
// Must match MAX_MORPH in the vertex shader (plugin.js).
ObjectBufferTop.MAX_MORPH = 32
ObjectBufferTop._morphCache = new WeakMap()
// Programs whose Bones block has already been bound to the UBO binding point.
ObjectBufferTop._boundBonesBlock = new WeakSet()

// groupsSplit: instanced groups that had to be closed early because C3's
// positional render state changed under them (see addInstance). Nonzero is
// normal in any scene with instance effects or the coplanar pass; it is not a
// problem indicator, only a way to see the split logic is doing something.
ObjectBufferTop.stats = { created: 0, reused: 0, unshared: 0, groupsSplit: 0 }
ObjectBufferTop.resetStats = function () {
  ObjectBufferTop.stats.created = 0
  ObjectBufferTop.stats.reused = 0
  ObjectBufferTop.stats.unshared = 0
  ObjectBufferTop.stats.groupsSplit = 0
}

// @ts-ignore
if (!globalThis.ObjectBuffer) {
  globalThis.ObjectBuffer = ObjectBufferTop
}
