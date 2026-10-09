"use strict"

class UniformLocationCacheClass {
  constructor() {
    this.cache = new WeakMap()
  }

  getLocation(gl, shaderProgram, uniformName) {
    let programCache = this.cache.get(shaderProgram)
    if (!programCache) {
      programCache = new Map()
      this.cache.set(shaderProgram, programCache)
    }

    let location = programCache.get(uniformName)
    if (location === undefined) {
      location = gl.getUniformLocation(shaderProgram, uniformName)
      programCache.set(uniformName, location)
    }
    return location
  }

  /**
   * Upload a float only when it actually changed.
   *
   * Uniform values are program state and survive C3 switching programs away and
   * back, and this addon's dedicated program is written by nobody else, so the
   * last value we sent is still there. Most of these are per-instance resets of
   * flags every static prop sets identically (uSkinEnable, uNodeXformEnable,
   * uPhongEnable, uUseUniformColor, uHasVertexColors) - 840 ms of uniform1f in
   * a 10 s profile, nearly all of it re-sending the same number.
   */
  setFloat(gl, shaderProgram, uniformName, value) {
    const loc = this.getLocation(gl, shaderProgram, uniformName)
    if (!loc) return
    const key = "__v_" + uniformName
    let programCache = this.cache.get(shaderProgram)
    if (programCache.get(key) === value) return
    programCache.set(key, value)
    gl.uniform1f(loc, value)
  }

  /** Upload a mat4 only when it actually changed. */
  setMatrix4(gl, shaderProgram, uniformName, value) {
    const loc = this.getLocation(gl, shaderProgram, uniformName)
    if (!loc) return
    const key = "__m_" + uniformName
    const programCache = this.cache.get(shaderProgram)
    let last = programCache.get(key)
    if (last) {
      let same = true
      for (let i = 0; i < 16; i++) {
        if (last[i] !== value[i]) {
          same = false
          break
        }
      }
      if (same) return
    } else {
      last = new Float32Array(16)
      programCache.set(key, last)
    }
    last.set(value)
    gl.uniformMatrix4fv(loc, false, value)
  }

  /** Upload a vec4 only when it actually changed. */
  setVec4(gl, shaderProgram, uniformName, a, b, c, d) {
    const loc = this.getLocation(gl, shaderProgram, uniformName)
    if (!loc) return
    const key = "__v4_" + uniformName
    const programCache = this.cache.get(shaderProgram)
    let last = programCache.get(key)
    if (last && last[0] === a && last[1] === b && last[2] === c && last[3] === d) return
    if (!last) {
      last = new Float32Array(4)
      programCache.set(key, last)
    }
    last[0] = a
    last[1] = b
    last[2] = c
    last[3] = d
    gl.uniform4f(loc, a, b, c, d)
  }

  /**
   * Forget the remembered value of a uniform.
   *
   * For code that writes a uniform with a raw gl call: the cache would
   * otherwise still believe the previous value and skip the next cached write
   * of it, leaving whatever the raw write set.
   */
  invalidate(shaderProgram, uniformName) {
    const programCache = this.cache.get(shaderProgram)
    if (!programCache) return
    programCache.delete("__v_" + uniformName)
    programCache.delete("__m_" + uniformName)
    programCache.delete("__v4_" + uniformName)
  }

  clearProgram(shaderProgram) {
    this.cache.delete(shaderProgram)
  }

  getAttributeLocation(gl, shaderProgram, attributeName) {
    let programCache = this.cache.get(shaderProgram)
    if (!programCache) {
      programCache = new Map()
      this.cache.set(shaderProgram, programCache)
    }

    const attrKey = `__attr_${attributeName}`
    let location = programCache.get(attrKey)
    if (location === undefined) {
      location = gl.getAttribLocation(shaderProgram, attributeName)
      programCache.set(attrKey, location)
    }
    return location
  }

  getUniformBlockIndex(gl, shaderProgram, blockName) {
    let programCache = this.cache.get(shaderProgram)
    if (!programCache) {
      programCache = new Map()
      this.cache.set(shaderProgram, programCache)
    }

    const blockKey = `__block_${blockName}`
    let index = programCache.get(blockKey)
    if (index === undefined) {
      index = gl.getUniformBlockIndex(shaderProgram, blockName)
      programCache.set(blockKey, index)
    }
    return index
  }
}

if (!globalThis.UniformLocationCache) {
  globalThis.UniformLocationCache = UniformLocationCacheClass
  globalThis.uniformCache = new UniformLocationCacheClass()
}