// Builds a level's static geometry and answers "where is the floor under x?".
//
// arena def:
//   deathY: number                                  fall below this = dead
//   boxes:  [[cx, cy, w, h, style?, angle?], ...]   style: 'slab' | 'pillar' | 'bumper' | 'oven'
//   polys:  [{pts: [[x, y], ...], style?}, ...]     convex, world coords, max 8 points (ramps, wedges)

const STEP = 0.2;

export function buildArena(physics, a = {}) {
  const deathY = a.deathY ?? -6;
  let minX = Infinity, maxX = -Infinity, maxY = -Infinity;
  const grow = (x, y) => { minX = Math.min(minX, x); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); };

  for (const [x, y, w, h, style = 'slab', angle = 0] of a.boxes || []) {
    physics.createStaticBox(x, y, w, h, { style, angle });
    const r = Math.hypot(w, h) / 2;
    grow(x - (angle ? r : w / 2), y + (angle ? r : h / 2));
    grow(x + (angle ? r : w / 2), y + (angle ? r : h / 2));
  }
  for (const p of a.polys || []) {
    physics.createStaticPoly(p.pts, { style: p.style || 'slab' });
    for (const [x, y] of p.pts) grow(x, y);
  }
  if (!Number.isFinite(minX)) { minX = -8; maxX = 8; maxY = 0; }

  // height map: top-most static surface per column
  const pl = window.planck;
  const x0 = Math.floor(minX) - 1;
  const n = Math.ceil((maxX + 1 - x0) / STEP) + 1;
  const heights = new Float32Array(n).fill(NaN);
  for (let i = 0; i < n; i++) {
    const x = x0 + i * STEP;
    let best = null;
    physics.world.rayCast(pl.Vec2(x, maxY + 5), pl.Vec2(x, deathY - 1), (fx, point, normal, fraction) => {
      const ud = fx.getUserData();
      if (!ud || ud.kind !== 'static') return -1;
      best = point.y;
      return fraction;
    });
    if (best !== null) heights[i] = best;
  }

  function floorAt(x) {
    const i = Math.round((x - x0) / STEP);
    if (i < 0 || i >= n) return null;
    const v = heights[i];
    return Number.isNaN(v) ? null : v;
  }

  return { deathY, floorAt, bounds: { minX, maxX, minY: deathY, maxY } };
}
