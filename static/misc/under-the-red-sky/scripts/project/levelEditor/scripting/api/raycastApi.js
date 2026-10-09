// api/raycast.js — the Raycast module.
//
// Wraps the editor's triangle raycaster (../../raycast.js), which works at play
// time too (its geometry helpers use globalThis.sdk_runtime, not _editorScope).
//
//   Raycast.cast(origin, direction, options?) -> hit | null
//     origin/direction: {x,y,z} or [x,y,z]   (direction need not be normalized)
//     options: {
//       objects:     array of game objects to test (default: all level objects)
//       solidOnly:   only test solid/collidable objects (default: true)
//       maxDistance: max ray length (default: 10000)
//     }
//     hit: { object, point:{x,y,z}, normal:{x,y,z}, distance }

import {
  getFirstRayIntersection,
  getRayIntersectionReflectAndNormal,
} from "../../raycast.js";
import { length, subtract, normalize } from "../../vector.js";
import { PICK_MAX_DISTANCE } from "../../globalValues.js";
import { instanceOf } from "./gameObject.js";

const arr = (v) => (Array.isArray(v) ? v : [v.x, v.y, v.z]);

const isSolid = (inst) => inst.isCollisionEnabled && inst.instVars?.isEnabled;

export function buildRaycast({ allInstances, wrap }) {
  return {
    cast: (origin, direction, options = {}) => {
      const {
        objects,
        solidOnly = true,
        maxDistance = PICK_MAX_DISTANCE,
      } = options;
      // Resolve the candidate instance list.
      let instances = objects
        ? objects.map((o) => instanceOf(o)).filter(Boolean)
        : allInstances || [];
      if (solidOnly) instances = instances.filter(isSolid);

      const o = arr(origin);
      const d = normalize(arr(direction));
      const hit = getFirstRayIntersection(instances, o, d, maxDistance);
      if (!hit) return null;

      const { normal } = getRayIntersectionReflectAndNormal(hit.triangle, d);
      return {
        object: wrap(hit.instance),
        point: { x: hit.point[0], y: hit.point[1], z: hit.point[2] },
        normal: { x: normal[0], y: normal[1], z: normal[2] },
        distance: length(subtract(hit.point, o)),
      };
    },
    __docs__: {
      cast: "Raycast.cast(origin, direction, options?) — cast a ray; returns { object, point, normal, distance } of the nearest hit, or null. options: { objects, solidOnly=true, maxDistance defaults to the project pick distance }.",
    },
  };
}
