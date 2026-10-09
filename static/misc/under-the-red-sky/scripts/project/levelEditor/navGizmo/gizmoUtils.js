// Shared math + camera-basis helpers used by every nav gizmo implementation.
// Keeping these out of the impls keeps the impls focused on rendering +
// interaction; all of them project the same world axes through the same
// camera basis.

// Project a unit world vector into the gizmo's local 2D screen space.
// Returns { sx, sy, depth }:
//   sx, sy   in caller-supplied "radius" units (positive sx = right,
//            positive sy = down — SVG/canvas convention)
//   depth    dot(axis, forward); positive = pointing away from camera,
//            negative = pointing toward camera
export function projectAxis(vec, basis, radius) {
  const { right, up, fwd } = basis;
  const sx =
    -(vec[0] * right[0] + vec[1] * right[1] + vec[2] * right[2]) * radius;
  const sy = -(vec[0] * up[0] + vec[1] * up[1] + vec[2] * up[2]) * radius;
  const depth = vec[0] * fwd[0] + vec[1] * fwd[1] + vec[2] * fwd[2];
  return { sx, sy, depth };
}

// Pull the orthonormal basis off a CameraController. Returns null if the
// controller hasn't been initialised yet.
export function getCameraBasis(cc) {
  if (!cc) return null;
  return {
    fwd: cc.getForwardVector(),
    right: cc.getRightVector(),
    up: cc.getUpVector(),
  };
}

// Standard 6-axis definition reused by every impl. `key` is what we hand
// to cameraController.setView.
export const AXIS_DEFS = [
  { key: "+x", vec: [1, 0, 0], axisChar: "x", label: "X", positive: true },
  { key: "-x", vec: [-1, 0, 0], axisChar: "x", label: "-X", positive: false },
  { key: "+y", vec: [0, 1, 0], axisChar: "y", label: "Y", positive: true },
  { key: "-y", vec: [0, -1, 0], axisChar: "y", label: "-Y", positive: false },
  { key: "+z", vec: [0, 0, 1], axisChar: "z", label: "Z", positive: true },
  { key: "-z", vec: [0, 0, -1], axisChar: "z", label: "-Z", positive: false },
];

// Hash camera basis into a short string so impls can short-circuit when
// nothing changed (cheap idle path).
export function hashBasis(basis) {
  const { fwd, right } = basis;
  return (
    fwd[0].toFixed(3) +
    "," +
    fwd[1].toFixed(3) +
    "," +
    fwd[2].toFixed(3) +
    "|" +
    right[0].toFixed(3) +
    "," +
    right[1].toFixed(3) +
    "," +
    right[2].toFixed(3)
  );
}
