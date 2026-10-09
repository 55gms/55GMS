// api/camera.js — the Camera module (read-only + frustum test).
//
// Reads the live Camera3D plugin object `camera` (runtime.objects.camera). The
// in-game camera is positioned via the player (see Player), so this module does
// not set position — it only reads position/orientation and tests visibility.

import { normalize, crossProduct, dot, subtract } from "../../vector.js";

const vec = (a) => ({ x: a[0], y: a[1], z: a[2] });
const arr = (v) => (Array.isArray(v) ? v : [v.x, v.y, v.z]);
const DEG = 180 / Math.PI;

export function buildCamera({ runtime }) {
  const cam = () => runtime.objects.camera;

  const camera = {
    // Is a world point inside the camera's view frustum (in front + within FOV)?
    isPointVisible: (point) => {
      const c = cam();
      const pos = c.getCameraPosition();
      const fwd = normalize(c.getLookVector());
      const right = normalize(crossProduct(fwd, normalize(c.getUpVector())));
      const up = crossProduct(right, fwd); // re-orthonormalize
      const rel = subtract(arr(point), pos);
      const camZ = dot(rel, fwd);
      if (camZ <= 0) return false; // behind the camera
      const halfV = Math.tan(c.fieldOfView / 2);
      let uiViewport = runtime.layout.getLayer("UI").getViewport();
      const aspect = uiViewport.width / uiViewport.height;
      const halfH = halfV * aspect;
      const camX = dot(rel, right);
      const camY = dot(rel, up);
      return Math.abs(camX) <= camZ * halfH && Math.abs(camY) <= camZ * halfV;
    },
    __docs__: {
      position:
        "Camera.position — the camera's world position {x, y, z} (read-only).",
      forward:
        "Camera.forward — the camera's look/forward unit vector {x, y, z} (read-only).",
      up: "Camera.up — the camera's up unit vector {x, y, z} (read-only).",
      yaw: "Camera.yaw — horizontal look angle in degrees (read-only).",
      pitch: "Camera.pitch — vertical look angle in degrees (read-only).",
      fov: "Camera.fov — vertical field of view in radians (read-only).",
      isPointVisible:
        "Camera.isPointVisible(point) — true if the world point {x,y,z} is inside the view frustum.",
    },
  };

  Object.defineProperties(camera, {
    position: { enumerable: true, get: () => vec(cam().getCameraPosition()) },
    forward: { enumerable: true, get: () => vec(cam().getLookVector()) },
    up: { enumerable: true, get: () => vec(cam().getUpVector()) },
    fov: { enumerable: true, get: () => cam().fieldOfView },
    yaw: {
      enumerable: true,
      get: () => {
        const f = cam().getLookVector();
        return Math.atan2(f[1], f[0]) * DEG;
      },
    },
    pitch: {
      enumerable: true,
      get: () => {
        const f = normalize(cam().getLookVector());
        return Math.asin(Math.max(-1, Math.min(1, f[2]))) * DEG;
      },
    },
  });

  return camera;
}
