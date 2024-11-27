class C {
  static Function(name, params) {
    return c2_callFunction(name, params);
  }
  static get Runtime() {
    return this._runtime || (this._runtime = cr_getC2Runtime());
  }

  static get LayoutScale() {
    return this.Runtime.running_layout ? this.Runtime.running_layout.scale : 0;
  }
  static set LayoutScale(val) {
    C.CallAction(
      cr.system_object.prototype.acts.SetLayoutScale,
      self.runtime.system,
      val
    );
  }

  static LayerToCanvasX(layerparam, x, y) {
    var layer = this.Runtime.getLayer(layerparam);
    return layer ? layer.layerToCanvas(x, y, true) : 0;
  }

  static LayerToCanvasY(layerparam, x, y) {
    var layer = this.Runtime.getLayer(layerparam);
    return layer ? layer.layerToCanvas(x, y, false) : 0;
  }

  static CanvasToLayerX(layerparam, x, y) {
    var layer = this.Runtime.getLayer(layerparam);
    return layer ? layer.canvasToLayer(x, y, true) : 0;
  }

  static CanvasToLayerY(layerparam, x, y) {
    var layer = this.Runtime.getLayer(layerparam);
    return layer ? layer.canvasToLayer(x, y, false) : 0;
  }

  static LayerToLayerX(layer1, layer2, x, y) {
    return C.CanvasToLayerX(
      layer2,
      C.LayerToCanvasX(layer1, x, y),
      C.LayerToCanvasY(layer1, x, y)
    );
  }

  static LayerToLayerY(layer1, layer2, x, y) {
    return C.CanvasToLayerY(
      layer2,
      C.LayerToCanvasX(layer1, x, y),
      C.LayerToCanvasY(layer1, x, y)
    );
  }

  static Trigger(proto, inst) {
    this.Runtime.trigger(proto, inst);
  }

  static CallAction(proto, inst, ...params) {
    proto.apply(inst, params);
  }

  static CallCondition(proto, inst, ...params) {
    return proto.apply(inst, params);
  }

  static CallExpression(proto, inst, ...params) {
    let value = null;
    let ret = {
      set_int(val) {
        value = val;
      },
      set_float(val) {
        value = val;
      },
      set_string(val) {
        value = val;
      },
      set_any(val) {
        value = val;
      },
    };
    params.unshift(ret);
    proto.apply(inst, params);
    return value;
  }
}

let noiseArray = [];
for (let i = 0; i < 1000; i++) {
  noiseArray.push(Math.random() * 2 - 1);
}

function generateHeightMap(
  faces,
  face_size,
  noise_scale,
  color,
  color_scale,
  color_max,
  alpha_scale,
  z_multiplier
) {
  const noise = (x, y) => {
    x = x / noise_scale;
    y = y / noise_scale;
    const width = noiseArray.length;
    const int = (x) => Math.floor(x);
    const cosp = cr.cosp;
    x = x + width / 2 + 0.171;
    y = y + width / 2 + 0.12334;
    let i0 = (int(x) * 14197 + int(y) * 524287) % width;
    let i1 = (int(x + 1) * 14197 + int(y) * 524287) % width;
    let i2 = (int(x) * 14197 + int(y + 1) * 524287) % width;
    let i3 = (int(x + 1) * 14197 + int(y + 1) * 524287) % width;
    return cosp(
      cosp(noiseArray[i0], noiseArray[i1], x - int(x)),
      cosp(noiseArray[i2], noiseArray[i3], x - int(x)),
      y - int(y)
    );
  };
  const random = (a, b) => {
    if (b === undefined) {
      return Math.random() * a;
    } else {
      return Math.random() * (b - a) + a;
    }
  };
  let rojo3d = C.Runtime.types_by_index.find(
    (x) => x.plugin instanceof cr.plugins_.rojo3d && x.instvar_sids.length > 0
  ).instances[0];
  let fnInst = C.Runtime.types_by_index.find(
    (x) => x.plugin instanceof cr.plugins_.Function
  ).instances[0];
  const callRojoAction = (action, ...params) => {
    C.CallAction(
      Object.getPrototypeOf(rojo3d.type.plugin).acts[action],
      rojo3d,
      ...params
    );
  };
  const callRojoExpression = (action, ...params) => {
    return C.CallExpression(
      Object.getPrototypeOf(rojo3d.type.plugin).exps[action],
      rojo3d,
      ...params
    );
  };
  const fnParam = (id) =>
    C.CallExpression(
      Object.getPrototypeOf(fnInst.type.plugin).exps.Param,
      fnInst,
      id
    );

  const setVertexColor = (r, g, b, a) => {
    callRojoAction("setVColor", r, g, b, a);
  };
  const addVertex = (x, y, z, rel, u, v) => {
    callRojoAction("addVertex", x, y, z, rel, u, v);
  };
  const createObject = (tag, copyFrom) => {
    callRojoAction("createObject", tag, copyFrom);
  };
  const setScale = (tag, x, y, z) => {
    callRojoAction("setScale", tag, x, y, z);
  };
  const setMesh = (tag, mesh) => {
    callRojoAction("setMesh", tag, mesh);
  };
  const setColor = (tag, r, g, b, a) => {
    // debugger;
    callRojoAction("setColor", tag, r, g, b, a);
  };
  const setTexture = (tag, texture) => {
    // debugger;
    callRojoAction("setTexture", tag, texture);
  };
  const setPosition = (tag, x, y, z, rel) => {
    callRojoAction("setPosition", tag, x, y, z, rel);
  };
  const setOrientationEuler = (tag, x, y, z, rel) => {
    callRojoAction("setOrientationEuler", tag, x, y, z, rel);
  };
  const setObjSettings = (tag, shadow, shading, fog, transparent, culling) => {
    callRojoAction(
      "setObjSettings",
      tag,
      shadow,
      shading,
      fog,
      transparent,
      culling
    );
  };
  const posX = (tag) => {
    return callRojoExpression("posX", tag);
  };
  const posY = (tag) => {
    return callRojoExpression("posY", tag);
  };
  const posZ = (tag) => {
    return callRojoExpression("posZ", tag);
  };
  const clamp = (x, min, max) => {
    return Math.min(Math.max(x, min), max);
  };
  const float = (x) => {
    return parseFloat(x);
  };
  const int = (x) => {
    return parseInt(x);
  };
  const str = (x) => {
    return x.toString();
  };
  const choose = (...args) => {
    return args[Math.floor(Math.random() * args.length)];
  };

  let rnd;
  let colorA = color.split(",");

  const loopChunk = (x, y, u, v) => {
    rnd = noise(x, y);
    setVertexColor(
      clamp(
        float(colorA[0]) / 255 - noise(x, y) * color_scale,
        0,
        (float(colorA[0]) / 255) * color_max
      ),
      clamp(
        float(colorA[1]) / 255 - noise(x, y) * color_scale,
        0,
        (float(colorA[1]) / 255) * color_max
      ),
      clamp(
        float(colorA[2]) / 255 - noise(x, y) * color_scale,
        0,
        (float(colorA[2]) / 255) * color_max
      ),
      alpha_scale
    );
    addVertex(
      x * face_size,
      noise(x, y) * z_multiplier,
      y * face_size,
      "",
      u,
      v
    );
  };
  let param5 = fnParam(5);
  let param5A = str(param5).split(",");
  let param3 = fnParam(3);
  let param3A = str(param3).split(";");
  let param0 = fnParam(0);
  let [cX = 0, cY = 0, cZ = 0] = str(param0).split(",");
  [cX, cY, cZ] = [float(cX), float(cY), float(cZ)];
  // debugger;

  createObjLoop = (
    tag,
    x,
    y,
    scaleFn,
    mesh,
    texture,
    useColor,
    angleX,
    posZFn
  ) => {
    // debugger;
    createObject(tag, "");
    scaleFn(tag);
    setMesh(tag, mesh);
    if (useColor) {
      setColor(
        tag,
        clamp(
          float(colorA[0]) / 255 - noise(x, y) * color_scale,
          0,
          (float(colorA[0]) / 255) * color_max
        ),
        clamp(
          float(colorA[1]) / 255 - noise(x, y) * color_scale,
          0,
          (float(colorA[1]) / 255) * color_max
        ),
        clamp(
          float(colorA[2]) / 255 - noise(x, y) * color_scale,
          0,
          (float(colorA[2]) / 255) * color_max
        ),
        1
      );
    } else {
      setTexture(tag, texture);
    }
    setPosition(
      tag,
      x * face_size,
      noise(x, y) * z_multiplier,
      y * face_size + posZFn(),
      ""
    );
    setOrientationEuler(tag, angleX, random(360), 0, "");
    setObjSettings(tag, 1, 1, 1, 0, 0);
    setPosition(tag, posX(tag) + cX, posY(tag) + cY, posZ(tag) + cZ, "");
  };

  for (let x = -(faces / face_size) / 2; x <= faces / face_size / 2; x++) {
    for (let y = -(faces / face_size) / 2; y <= faces / face_size / 2; y++) {
      loopChunk(x, y, 1, 0);
      loopChunk(x + 1, y, 1, 1);
      loopChunk(x + 1, y + 1, 0, 1);
      loopChunk(x, y, 1, 0); // ???
      loopChunk(x + 1, y + 1, 0, 1);
      loopChunk(x, y + 1, 0, 0);
      if (y < -1) {
        if (
          param5A[0].toLowerCase() === "rocks" &&
          int(random(float(param5A[1]))) === 0
        ) {
          // debugger;
          rnd = random(0.75, 5);
          createObjLoop(
            "rock" + x + "," + y,
            x,
            y,
            (tag) => {
              setScale(tag, 64 * rnd, 64 * rnd * random(0.75, 1.15), 64 * rnd);
            },
            "asteroid" + str(choose(1, 2, 3)) + "Mesh",
            null,
            true,
            0,
            () => {
              return random(4, 16);
            }
          );
        }
        if (
          param5A[0].toLowerCase() === "alien" &&
          int(random(float(param5A[1]))) === 0
        ) {
          // debugger;
          rnd = random(0.75, 3);
          createObjLoop(
            "alien_plant" + x + "," + y,
            x,
            y,
            (tag) => {
              setScale(tag, 32 * rnd, 32 * rnd * random(0.75, 1.15), 32 * rnd);
            },
            "plant_alienMesh",
            null,
            true,
            0,
            () => {
              return random(4, 16);
            }
          );
        }
        rnd = noise(x, y);
        if (
          param5A[0].toLowerCase() === "trees" &&
          int(random(float(param5A[1]))) === 0 &&
          rnd >= (param3A[2] === "mountains" ? 0 : rnd)
        ) {
          // debugger;
          createObjLoop(
            "tree" + x + "," + y,
            x,
            y,
            (tag) => {
              setScale(tag, 0.3, 0.3 * random(0.75, 1), 0.3);
            },
            "treeMesh",
            "tree",
            false,
            180,
            () => {
              return 0;
            }
          );
        }
      }
    }
  }
}
