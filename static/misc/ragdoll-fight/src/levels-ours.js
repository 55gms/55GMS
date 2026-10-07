// Our own levels (DESIGN.md §10 / §14). levels.js interleaves them with the original levels: OUR_LEVELS[0..9] are final
// levels 11–20, [10..19] are 31–40, [20..29] are 51–60, and so on.
//
// Level def format: see the top of levels.js. Units: metres, y-up, floor top y = 0 unless noted.
// Spawns on props / mechanisms (crates, bridges, carts, treads, pendulums) use `yAbs` (exact feet height): groundY only sees statics.
// Design rules (§14): one memorable physical gimmick per level, verticality in the spawns, environmental kills, grabbable /
// rideable mechanisms, loose physics props; nothing may threaten a spawn before the fight starts (hazards already run then).

const r2 = (v) => Math.round(v * 100) / 100;
/** static box from edges: x0..x1, y0..y1 */
const box = (x0, x1, y0, y1, style) => [r2((x0 + x1) / 2), r2((y0 + y1) / 2), r2(x1 - x0), r2(y1 - y0), ...(style ? [style] : [])];
/** floor slab x0..x1 whose top is at `top` */
const slab = (x0, x1, top = 0, h = 1, style) => box(x0, x1, top - h, top, style);
/** thin pillar wall centred on x */
const wall = (x, y0, y1, w = 0.5, style = 'pillar') => box(x - w / 2, x + w / 2, y0, y1, style);
/** boxes plus their mirror images across x = 0 (angle flips too) */
const sym = (...bs) => bs.flatMap((b) => [b, [-b[0], b[1], b[2], b[3], b[4] || 'slab', ...(b[5] ? [-b[5]] : [])]]);
/** polygon plus its mirror image across x = 0 */
const symPoly = (pts, style) => [{ pts, style }, { pts: pts.map(([x, y]) => [-x, y]).reverse(), style }];
/** hazard mirrored across x = 0: position, path/to, push direction, spin/flow/swing sign; dPhase shifts its cycle */
const mirrorH = (h, dPhase = 0) => {
  const m = { ...h, x: -h.x };
  if (h.path) m.path = [-h.path[0], h.path[1]];
  if (h.to) m.to = [-h.to[0], h.to[1]];
  if (h.dir === 'left' || h.dir === 'right') m.dir = h.dir === 'left' ? 'right' : 'left';
  for (const k of ['speed', 'orbit', 'fx', 'amp', 'angle']) if (typeof h[k] === 'number') m[k] = -h[k];
  if (dPhase) m.phase = (h.phase || 0) + dPhase;
  return m;
};
/** a hazard and its mirror image */
const pairH = (h, dPhase) => [h, mirrorH(h, dPhase)];
const SPEARS = { type: 'rack', x: -7.5, y: 0, weapons: ['yari', 'yari', 'yari', 'yari'] };   // boss levels: spear rack behind the player
/** mirrored pair helper: f(sign) for sign = -1 and +1 */
const both = (f) => [f(-1), f(1)];
/** boss hall: long floor, benches at both ends, tall walls so nobody is thrown out */
const hall = (half, wallH) => ({
  deathY: -6,
  boxes: [slab(-half, half), box(-half + 0.3, -half + 1.8, 0, 0.6, 'pillar'), box(half - 1.8, half - 0.3, 0, 0.6, 'pillar'), wall(-half - 0.25, 0, wallH), wall(half + 0.25, 0, wallH)],
});
/** a bot that spawns holding on to the mechanism it rides, until the player is close or 14 s pass */
const RIDE = { grabOnStart: true, grabTime: 14, grabRelease: 1.6 };
/** the original's arena ends: a floating pillar at each end with a trigger piston in front that punts fighters back in.
 *  xp = left piston centre (negative); floors should end around xp - 0.4. y = floor top under it. */
const edges = (xp, y = 0) => ({
  boxes: sym(box(xp - 1.37, xp - 0.33, y + 0.54, y + 1.58, 'pillar')),
  hazards: pairH({ type: 'piston', x: xp, y: y + 1.06, w: 0.64, h: 1.61, dir: 'right', stroke: 1.44, period: 3, trigger: true, launch: 11 }),
});

export const OUR_LEVELS = [
  // ------------------------------------------------------------------ Act 1 · kitchen (final 11–20): props, carts, bridges, riders
  {
    // a bot on top of a crate tower: knock the tower out from under him. End pistons punt everyone back into the ring
    name: 'Crate Tower', theme: 'kitchen', hpScale: 1.15,
    arena: { deathY: -6, boxes: [slab(-5.8, 5.8), ...edges(-5.2).boxes] },
    player: { x: -3.2 },
    enemies: [{ type: 'brawler', x: 2.6, yAbs: 2.43, weapon: 'bat' }],
    hazards: [
      { type: 'block', x: 2.6, y: 0.6, w: 1.4, h: 1.2, mass: 30 },
      { type: 'block', x: 2.6, y: 1.81, w: 1.2, h: 1.2, mass: 22 },
      { type: 'block', x: -0.9, y: 0.36, w: 0.7, h: 0.7 },
      ...edges(-5.2).hazards,
    ],
  },
  {
    // a giant rolling pin turns in the trench between the counters, carrying whoever climbs on it toward the far side
    name: 'Dough Roller', theme: 'kitchen', hpScale: 1.15,
    arena: { deathY: -6, boxes: [slab(-6.6, -1.3), slab(1.3, 6.6), ...edges(-6).boxes] },
    player: { x: -3.9 },
    enemies: [{ type: 'delivery', x: 3.9 }],
    loose: [{ id: 'bat', x: -2.5 }],
    hazards: [{ type: 'wheel', x: 0, y: -0.4, r: 1.5, mode: 'motor', speed: -0.5 }, ...edges(-6).hazards],
  },
  {
    // a heavy baker's cart rolls free on the long counter with the line cook riding it: shove the cart, or him off it
    name: 'Bakery Cart', theme: 'kitchen', hpScale: 1.15,
    arena: { deathY: -6, boxes: [slab(-7.4, 7.4), ...edges(-6.8).boxes] },
    player: { x: -4.6 },
    enemies: [{ type: 'brawler', x: 4.8, weapon: 'kanabo' }, { type: 'line_cook', x: 1.2, yAbs: 1.07 }],
    loose: [{ id: 'staff', x: -2.8 }],
    hazards: [
      { type: 'block', x: 1.2, y: 0.925, w: 3.0, h: 0.25, style: 'plank' },
      { type: 'wheel', x: 0.2, y: 0.4, r: 0.4, mode: 'loose', axle: true, speed: 0 },
      { type: 'wheel', x: 2.2, y: 0.4, r: 0.4, mode: 'loose', axle: true, speed: 0 },
      ...edges(-6.8).hazards,
    ],
  },
  {
    // a rope bridge over a spike trench; the brawler waits on the bridge, the bandit beyond it. Swing them off
    name: 'Spike Trench', theme: 'kitchen', hpScale: 1.15,
    arena: { deathY: -6, boxes: [...sym(box(-7.6, -1.6, -2.2, 0)), box(-1.6, 1.6, -2.2, -1.8), ...edges(-7).boxes] },
    player: { x: -4.4 },
    enemies: [{ type: 'bandit', x: 4.4 }, { type: 'brawler', x: 0.4, yAbs: -0.17 }],
    loose: [{ id: 'bat', x: -2.7 }],
    hazards: [
      { type: 'bridge', x0: -1.6, x1: 1.6, y: -0.08, segments: 10, sag: 0.2 },
      { type: 'spikes', x: 0, y: -1.8, w: 3.2, damage: 10 },
      ...edges(-7).hazards,
    ],
  },
  {
    // a wide drop between the counters: a lift shuttles across it with a chain hanging underneath to jump up and swing on
    name: 'Chain Lift', theme: 'kitchen', hpScale: 1.18,
    arena: { deathY: -6, boxes: [slab(-8, -1.8), slab(1.8, 8), ...edges(-7.4).boxes] },
    player: { x: -4.8 },
    enemies: [{ type: 'delivery', x: 4.8 }, { type: 'brawler', x: 6.3 }],
    loose: [{ id: 'bat', x: -3.2 }],
    hazards: [
      { type: 'mover', x: -1.0, y: -0.15, w: 1.5, h: 0.3, to: [1.0, -0.15], period: 5, rope: 2.2 },
      ...pairH({ type: 'block', x: -2.5, y: 0.36, w: 0.7, h: 0.7 }),
      ...edges(-7.4).hazards,
    ],
  },
  {
    // the bandit holds the high counter; springboard pistons set in the floor launch you up beside it (or climb it)
    name: 'Springboard Counter', theme: 'kitchen', hpScale: 1.2,
    arena: {
      deathY: -6,
      boxes: [...sym(slab(-7.2, -3.35), box(-3.35, -1.95, -1.4, -1.2)), box(-1.95, 1.95, -1.2, 2.6), ...edges(-6.6).boxes],
    },
    player: { x: -5.2 },
    enemies: [{ type: 'bandit', x: 0.7 }],
    loose: [{ id: 'bat', x: -0.8, y: 2.9 }],
    hazards: [
      ...pairH({ type: 'piston', x: -2.65, y: -0.39, w: 1.3, h: 0.77, dir: 'up', stroke: 1.2, period: 3, trigger: true, launch: 8 }),
      ...edges(-6.6).hazards,
    ],
  },
  {
    // two drops either side of a pillar island; heavy pans swing across both gaps. Time the jump, or knock them in
    name: 'Swinging Pans', theme: 'kitchen', hpScale: 1.2,
    arena: {
      deathY: -6,
      boxes: [...sym(slab(-8.4, -1.8, 0, 2), box(-1.65, -0.85, 5.6, 5.9, 'pillar')), box(-0.7, 0.7, -2.5, 0), ...edges(-7.8).boxes],
    },
    player: { x: -5.6 },
    enemies: [{ type: 'bandit', x: 5.6, weapon: 'cleaver' }, { type: 'brawler', x: 3.9 }],
    loose: [{ id: 'staff', x: -3.9 }],
    hazards: [
      ...pairH({ type: 'swinger', x: -1.25, y: 5.6, chain: 3.9, r: 0.45, amp: 0.7, period: 3.4, damage: 10, look: 'hook' }, 0.5),
      ...edges(-7.8).hazards,
    ],
  },
  {
    // a tank tread runs overhead between the two trays with the line cook clinging on; jump up and grab a ride
    name: 'Pastry Tread', theme: 'kitchen', hpScale: 1.2,
    arena: { deathY: -6, boxes: [slab(-9, 9), ...sym(box(-9, -6, 0, 0.8)), ...edges(-8.3, 0.8).boxes] },
    player: { x: -7.2 },
    enemies: [{ type: 'knight', x: 7.2 }, { type: 'line_cook', x: 1.8, yAbs: 2.92, ...RIDE }],
    loose: [{ id: 'bat', x: -4.6 }],
    hazards: [{ type: 'track', x: 0, y: 2.9, length: 5, r: 0.45, speed: -1.0 }, ...edges(-8.3, 0.8).hazards],
  },
  {
    // three big gears are the only way over the drop; the bandit clings to the middle one as it turns
    name: 'Gear Steps', theme: 'kitchen', hpScale: 1.22,
    arena: { deathY: -6, boxes: [slab(-8.6, -3.25), slab(3.25, 8.6), ...sym(box(-1.23, -0.97, -1.3, -0.4, 'pillar')), ...edges(-8).boxes] },
    player: { x: -6.2 },
    enemies: [{ type: 'knight', x: 6.2 }, { type: 'bandit', x: 0, yAbs: 0.63, ...RIDE }],
    loose: [{ id: 'bat', x: -4.4 }],
    hazards: [
      { type: 'wheel', x: -2.2, y: -0.2, r: 0.95, mode: 'motor', speed: -0.8, teeth: 12 },
      { type: 'wheel', x: 0, y: -0.2, r: 0.95, mode: 'motor', speed: -0.8, teeth: 12 },
      { type: 'wheel', x: 2.2, y: -0.2, r: 0.95, mode: 'motor', speed: -0.8, teeth: 12 },
      ...edges(-8).hazards,
    ],
  },
  {
    name: 'The Big Cheese', theme: 'hall',
    arena: { ...hall(10.5, 5), boxes: [...hall(10.5, 5).boxes, box(-0.5, 0.5, 7.3, 7.6, 'pillar')] },
    player: { x: -5 },
    enemies: [{ type: 'big_cheese', x: 4.5 }],
    loose: [{ id: 'bat', x: -7.5 }],
    hazards: [
      { type: 'rack', x: -7.2, y: 0, weapons: ['yari', 'yari', 'yari', 'yari'] },   // spear rack behind the player: grab two to dual wield
      // twist: a wrecking ball swings over the middle, above your head but low enough to clobber the giant (jump up to grab it)
      { type: 'pendulum', x: 0, y: 7.3, chain: 4.1, r: 0.6, mass: 40, amp: 0.5 },
    ],
  },

  // ------------------------------------------------------------------ Act 2 · cellar (final 31–40): shafts, springboards, explosives, treads
  {
    // ramps up to a plateau with powder kegs and a weapon rack; the delivery man guards the top
    name: 'Powder Hill', theme: 'cellar',
    arena: { deathY: -6, boxes: [slab(-8, 8), box(-2, 2, 0, 1.8), ...edges(-7.4).boxes], polys: symPoly([[-5.6, 0], [-2, 1.8], [-2, 0]]) },
    player: { x: -6 },
    enemies: [{ type: 'delivery', x: -0.3 }],
    hazards: [
      { type: 'rack', x: 0.5, y: 1.8, weapons: ['cleaver', 'staff'] },
      { type: 'barrel', x: 1.6, y: 2.25, power: 10, damage: 18 },   // behind him: knock him into it      ...edges(-7.4).hazards,
    ],
  },
  {
    // drop into the old well: the delivery man waits at the bottom beside a springboard piston and a powder keg
    name: 'The Well', theme: 'cellar',
    arena: {
      deathY: -9,
      boxes: [...sym(box(-7, -2.5, -5, 0), box(-2.5, -1.9, -2.7, -2.4)), box(-2.5, 2.5, -6, -5), ...edges(-6.4).boxes],
    },
    player: { x: -4.5 },
    enemies: [{ type: 'delivery', x: 1.4, weapon: 'cleaver' }],
    loose: [{ id: 'machete', x: -1.8 }],
    hazards: [
      { type: 'piston', x: 0, y: -4.61, w: 1.8, h: 0.77, dir: 'up', stroke: 1.4, period: 3, trigger: true, launch: 8 },
      { type: 'barrel', x: 2.1, y: -4.55, power: 10, damage: 22 },
      ...edges(-6.4).hazards,
    ],
  },
  {
    // slides from both cellar shelves dump into a spinning millstone; kegs on the shelves roll down onto whoever is below
    name: 'Millstone Chute', theme: 'cellar', hpScale: 1.02,
    arena: {
      deathY: -6,
      boxes: [slab(-10, 10), ...sym(box(-10, -6.5, 0, 2.5)), wall(-9.75, 2.5, 4.1), wall(9.75, 2.5, 4.1)],
      polys: symPoly([[-6.5, 2.5], [-1.5, 0], [-6.5, 0]]),
    },
    player: { x: -8.1 },
    enemies: [{ type: 'delivery', x: 8.1 }, { type: 'brawler', x: 1.8, weapon: 'kanabo' }],
    hazards: [
      { type: 'wheel', x: 0, y: -0.55, r: 1.2, mode: 'motor', speed: 1.2, teeth: 14 },
      ...pairH({ type: 'wheel', x: -7.0, y: 2.95, r: 0.45, mode: 'loose' }),
    ],
  },
  {
    // springboard pistons set in the floor, crushers slamming from the ceiling; the bandit's balcony is reached by getting launched
    name: 'Piston Gauntlet', theme: 'cellar', hpScale: 1.03,
    arena: {
      deathY: -6,
      boxes: [slab(-9, -4.45), slab(-3.15, -0.65), slab(0.65, 3.15), slab(4.45, 9), wall(-8.75, 0, 5.6), wall(8.75, 0, 5.6),
        ...sym(box(-8.5, -5.6, 2.6, 3.0)), box(-4.6, 4.6, 5.6, 6.2, 'pillar')],
    },
    player: { x: -7, y: 0.02 },
    enemies: [{ type: 'bandit', x: 7, yAbs: 3.02 }, { type: 'line_cook', x: 1.9, yAbs: 0.02, weapon: 'kanabo' }],
    hazards: [
      ...[-3.8, 0, 3.8].map((x) => ({ type: 'piston', x, y: -0.39, w: 1.3, h: 0.77, dir: 'up', stroke: 1.2, period: 3, trigger: true, launch: 8 })),
      ...pairH({ type: 'piston', x: -1.9, y: 4.8, w: 1.1, h: 1.4, dir: 'down', stroke: 2.2, period: 2.8 }, 0.5),
    ],
  },
  {
    // a sagging rope bridge over the cellar drop with powder jars dangling beside it; the delivery man waits halfway across
    name: 'Powder Bridge', theme: 'cellar', hpScale: 1.04,
    arena: { deathY: -6, boxes: [...sym(slab(-9, -3, 0, 2), box(-2.2, -1.4, 4.2, 4.5, 'pillar')), ...edges(-8.4).boxes] },
    player: { x: -5.8 },
    enemies: [{ type: 'brawler', x: 5.8, weapon: 'cleaver' }, { type: 'delivery', x: 0.6, yAbs: -0.27 }],
    hazards: [
      { type: 'bridge', x0: -3, x1: 3, y: -0.08, segments: 14, sag: 0.3 },
      ...pairH({ type: 'jar', x: -1.8, y: 4.2, chain: 3.0, power: 9, damage: 20 }),
      ...edges(-8.4).hazards,
    ],
  },
  {
    // both sides get a crate fort with a weapon rack behind it; the bandit stands guard on top of his. Smash the walls in
    name: 'Crate Forts', theme: 'cellar', hpScale: 1.05,
    arena: { deathY: -6, boxes: [slab(-9.5, 9.5), wall(-9.25, 0, 2.6), wall(9.25, 0, 2.6)] },
    player: { x: -7.6 },
    enemies: [{ type: 'brawler', x: 7.6 }, { type: 'bandit', x: 3.2, yAbs: 1.83 }],
    hazards: [
      ...pairH({ type: 'block', x: -2.74, y: 0.45, w: 0.9, h: 0.9 }),
      ...pairH({ type: 'block', x: -3.66, y: 0.45, w: 0.9, h: 0.9 }),
      ...pairH({ type: 'block', x: -3.2, y: 1.36, w: 0.9, h: 0.9, mass: 12 }),
      ...pairH({ type: 'rack', x: -6.2, y: 0, weapons: ['machete', 'staff'] }),
      { type: 'dropper', x: 0, y: 8, every: 7, items: ['crate', 'nunchaku', 'crate'], max: 3 },
    ],
  },
  {
    // two spiked maces orbit low over the corridor like clock hands; loose crates make handy shields
    name: 'Mace Clock', theme: 'cellar', hpScale: 1.06,
    arena: { deathY: -6, boxes: [slab(-9, 9), box(-0.9, 0.9, 0, 0.7), wall(-8.75, 0, 2.6), wall(8.75, 0, 2.6)] },
    player: { x: -6.8 },
    enemies: [{ type: 'bandit', x: 6.8 }],
    hazards: [
      ...pairH({ type: 'spikeball', x: -3.2, y: 1.7, r: 0.42, speed: 5, damage: 12, arm: 1.35, orbit: 1.5 }),
      ...pairH({ type: 'block', x: -5.4, y: 0.4, w: 0.8, h: 0.8 }),
    ],
  },
  {
    // a wrecking ball swings over the hump with the brawler riding it; ride it yourself or get bowled off the top
    name: 'Wrecking Hump', theme: 'cellar', hpScale: 1.07,
    arena: {
      deathY: -6,
      boxes: [slab(-10, 10), box(-2, 2, 0, 2), wall(-9.75, 0, 2.6), wall(9.75, 0, 2.6), box(-0.5, 0.5, 7.2, 7.5, 'pillar')],
      polys: symPoly([[-6, 0], [-2, 2], [-2, 0]]),
    },
    player: { x: -7.5 },
    enemies: [{ type: 'bandit', x: 7.5, weapon: 'katana' }, { type: 'brawler', x: 3.02, yAbs: 3.91, ...RIDE }],
    hazards: [{ type: 'pendulum', x: 0, y: 7.2, chain: 3.3, r: 0.55, mass: 30, amp: 0.9 }],
  },
  {
    // the floor is two tank treads running outward, toward spike slots under the end ledges; the samurai waits up top
    name: 'Tread Mill', theme: 'cellar', hpScale: 1.08,
    arena: {
      deathY: -6,
      boxes: [box(-1.4, 1.4, -1, 0), ...sym(box(-10, -7.4, -2.2, 0.6), box(-7.4, -6.6, -2.2, -1.6)), wall(-9.75, 0.6, 3.2), wall(9.75, 0.6, 3.2)],
    },
    player: { x: -8.6 },
    enemies: [{ type: 'samurai', x: 8.6 }, { type: 'delivery', x: 0.7, weapon: 'machete' }],
    loose: [{ id: 'machete', x: -0.7 }],
    hazards: [
      ...pairH({ type: 'track', x: -4.1, y: 0, length: 4.4, r: 0.5, speed: -0.9 }),
      ...pairH({ type: 'spikes', x: -7.0, y: -1.6, w: 0.8, damage: 10 }),
    ],
  },
  {
    name: 'Sir Pepperoni', theme: 'hall',
    arena: { ...hall(11, 5), boxes: [...hall(11, 5).boxes, ...sym(box(-4.4, -3.6, 6.4, 6.7, 'pillar'))] },
    player: { x: -5.5 },
    enemies: [{ type: 'sir_pepperoni', x: 5 }],
    hazards: [
      { type: 'bag', x: -7.6, y: 4.6, rope: 1.6 }, { type: 'bag', x: 7.6, y: 4.6, rope: 1.6 },
      { type: 'rack', x: -7.5, y: 0, weapons: ['yari', 'yari', 'yari', 'yari'] },   // spear rack behind the player: grab two to dual wield
      // twist: two wrecking balls swing over the hall at giant-head height; his hammer sends them flying
      ...pairH({ type: 'pendulum', x: -4, y: 6.4, chain: 2.9, r: 0.45, mass: 25, amp: 0.45 }),
    ],
  },

  // ------------------------------------------------------------------ Act 3 · rooftop (final 51–60): gaps, swings, gloves, lifts, rotors
  {
    // three roofs over the street; the bandit holds the chimney in the middle. Loose crates to kick off the edges
    name: 'Chimney Hop', theme: 'rooftop',
    arena: { deathY: -6, boxes: [slab(-8, -4.2), slab(-3, 3), slab(4.2, 8), box(-0.6, 0.6, 0, 2.2, 'pillar'), ...edges(-7.4).boxes] },
    player: { x: -6 },
    enemies: [{ type: 'bandit', x: 0 }],
    hazards: [...pairH({ type: 'block', x: -2.1, y: 0.36, w: 0.7, h: 0.7 }), ...edges(-7.4).hazards],
  },
  {
    // a gap too wide to jump: grab the swinging wrecking ball and ride it across (miss, and climb out of the light well)
    name: 'Rope Swing', theme: 'rooftop', hpScale: 1.01,
    arena: { deathY: -7, boxes: [...sym(box(-9, -2.3, -3, 0)), box(-2.3, 2.3, -3.6, -3), box(-0.4, 0.4, 6, 6.3, 'pillar'), ...edges(-8.4).boxes] },
    player: { x: -5.5 },
    enemies: [{ type: 'ninja', x: 5.5 }],
    hazards: [{ type: 'pendulum', x: 0, y: 6, chain: 4.3, r: 0.45, mass: 30, amp: 0.75 }, ...edges(-8.4).hazards],
  },
  {
    // two rooftop glove wheels punch anyone who walks through; a vent block in the middle is the only safe stop
    name: 'Glove Wheels', theme: 'rooftop', hpScale: 1.02,
    arena: { deathY: -6, boxes: [slab(-8.2, 8.2), box(-0.8, 0.8, 0, 0.9, 'pillar'), ...edges(-7.6).boxes] },
    player: { x: -5.7 },
    enemies: [{ type: 'samurai', x: 5.7 }],
    loose: [{ id: 'staff', x: 0, y: 1.2 }],
    hazards: [...pairH({ type: 'spinner', x: -2.9, y: 1.45, arm: 1.3, r: 0.35, count: 4, speed: 2.2, look: 'glove' }), ...edges(-7.6).hazards],
  },
  {
    // two tall towers whose tank-tread gangways carry you out over the courtyard and drop you in; the dropper rains weapons
    name: 'Tread Towers', theme: 'rooftop', hpScale: 1.03,
    arena: { deathY: -6, boxes: [slab(-5.6, 5.6), ...sym(box(-9, -5.6, 0, 2.2)), wall(-8.75, 2.2, 3.4), wall(8.75, 2.2, 3.4)] },
    player: { x: -7.4 },
    enemies: [{ type: 'bandit', x: 7.4 }, { type: 'delivery', x: 0.4, weapon: 'machete' }],
    hazards: [
      ...pairH({ type: 'track', x: -3.2, y: 2.2, length: 3.0, r: 0.45, speed: 1.0 }),
      { type: 'dropper', x: 0, y: 8, every: 6, items: ['machete', 'crate', 'bat'], max: 3 },
    ],
  },
  {
    // loose planks are the only bridges between the roofs: kick them away under somebody. Crates rain down on both sides
    name: 'Loose Planks', theme: 'rooftop', hpScale: 1.04,
    arena: { deathY: -6, boxes: [...sym(slab(-9, -2.8, 0, 2.5), box(-2.8, -1.4, -3.1, -2.5)), slab(-1.4, 1.4, 0, 2.5), ...edges(-8.4).boxes] },
    player: { x: -6.5 },
    enemies: [{ type: 'ninja', x: 6.5 }, { type: 'bandit', x: 0.4, weapon: 'cleaver' }],
    hazards: [
      ...pairH({ type: 'block', x: -2.1, y: 0.1, w: 2.3, h: 0.2, style: 'plank', mass: 10 }),
      ...pairH({ type: 'dropper', x: -5, y: 8, every: 7, items: ['crate', 'crate', 'cleaver'], max: 2 }),
      ...edges(-8.4).hazards,
    ],
  },
  {
    // one long seesaw plank over a pit of saws: whoever steps on first tips it
    name: 'Saw Seesaw', theme: 'rooftop', hpScale: 1.05,
    arena: { deathY: -6, boxes: [...sym(slab(-8, -3.2, 0, 2)), ...edges(-7.4).boxes] },
    player: { x: -5.4 },
    enemies: [{ type: 'samurai', x: 5.4 }],
    hazards: [
      { type: 'seesaw', x: 0, y: 0.3, w: 6.6, h: 0.3, limit: 0.2, post: 1.4 },
      ...pairH({ type: 'blade', x: -1.7, y: -1.9, r: 0.6, speed: 14, damage: 14 }),
      ...edges(-7.4).hazards,
    ],
  },
  {
    // four lifts rise and fall in a wave across the street; the bandit rides one of them
    name: 'Stepping Lifts', theme: 'rooftop', hpScale: 1.06,
    arena: { deathY: -7, boxes: [...sym(box(-9, -4.4, -2.8, 0)), box(-4.4, 4.4, -3.4, -2.8), ...edges(-8.4).boxes] },
    player: { x: -6.6 },
    enemies: [{ type: 'ninja', x: 6.6 }, { type: 'bandit', x: 1.0, yAbs: 1.17 }],
    hazards: [
      ...[-3, -1, 1, 3].map((x, i) => ({ type: 'mover', x, y: -0.15, w: 1.3, h: 0.3, to: [x, 1.0], period: 4, phase: i * 0.25 })),
      ...edges(-8.4).hazards,
    ],
  },
  {
    // a slow windmill cross turns over a spike grate; the ninja hangs on to one of its sails
    name: 'Windmill', theme: 'rooftop', hpScale: 1.07,
    arena: { deathY: -6, boxes: [slab(-8.4, 8.4), ...edges(-7.8).boxes] },
    player: { x: -6.2 },
    enemies: [{ type: 'samurai', x: 6.2 }, { type: 'ninja', x: 1.6, yAbs: 2.97, weapon: 'butterfly_knife', ...RIDE }],
    hazards: [
      { type: 'rotor', x: 0, y: 2.8, w: 4.8, h: 0.3, speed: 0.55 },
      { type: 'rotor', x: 0, y: 2.8, w: 4.8, h: 0.3, speed: 0.55, angle: 1.5708 },
      { type: 'spikes', x: 0, y: 0, w: 1.4, damage: 10 },
      ...edges(-7.8).hazards,
    ],
  },
  {
    // building site: ride the lift up to the girder where the samurai waits, while a crane swings a crate (and a bandit) over it
    name: 'Crane Hook', theme: 'rooftop', hpScale: 1.08,
    arena: { deathY: -6, boxes: [slab(-8.4, 8.4), box(0.4, 7.2, 2.5, 2.8, 'pillar'), box(2.6, 3.4, 7.8, 8.1, 'pillar'), ...edges(-7.8).boxes] },
    player: { x: -6 },
    enemies: [{ type: 'samurai', x: 5.6, yAbs: 2.82 }, { type: 'bandit', x: 5.22, yAbs: 4.74, weapon: 'sword', ...RIDE }],
    hazards: [
      { type: 'mover', x: -0.5, y: -0.15, w: 1.6, h: 0.3, to: [-0.5, 2.65], period: 7 },
      { type: 'pendulum', x: 3, y: 7.8, chain: 2.6, r: 0.5, mass: 30, amp: 0.8, look: 'crate' },
      { type: 'barrel', x: 1.4, y: 3.25, power: 10, damage: 22 },
      ...edges(-7.8).hazards,
    ],
  },
  {
    name: 'Oven Lord', theme: 'hall',
    arena: hall(11, 5.5),
    player: { x: -5.5 },
    enemies: [{ type: 'oven_lord', x: 5 }],
    hazards: [
      { type: 'rack', x: -7.5, y: 0, weapons: ['yari', 'yari', 'yari', 'yari'] },   // spear rack behind the player: grab two to dual wield
      ...pairH({ type: 'block', x: -2.6, y: 0.6, w: 0.9, h: 1.2, style: 'metal' }),   // twist: pushable steel crates to duck behind
    ],
  },

  // ------------------------------------------------------------------ Act 4 · foundry (final 71–80): armour, barrels, 3-enemy mixes
  // (restored: this block was dropped when our levels moved out of levels.js)
  {
    name: 'Iron Welcome', theme: 'foundry', hpScale: 1.05,
    arena: { deathY: -6, boxes: [slab(-9.5, 9.5), box(-0.8, 0.8, 0, 0.6, 'pillar'), wall(-9.25, 0, 2.6), wall(9.25, 0, 2.6)] },
    player: { x: -6.8 },
    enemies: [{ type: 'knight', x: 6.8 }],
    hazards: [{ type: 'barrel', x: -3.4, y: 0.45, power: 11, damage: 25 }, { type: 'barrel', x: 3.4, y: 0.45, power: 11, damage: 25 }],
  },
  {
    name: 'Forge Steps', theme: 'foundry', hpScale: 1.05,
    arena: { deathY: -6, boxes: [slab(-10, 10), box(-6, 6, 0, 0.6), box(-3, 3, 0.6, 1.2), wall(-9.75, 0, 2.6), wall(9.75, 0, 2.6)] },
    player: { x: -8 },
    enemies: [{ type: 'knight', x: 8 }, { type: 'delivery', x: 4.5 }],
    hazards: [{ type: 'barrel', x: 0, y: 1.65, power: 11, damage: 25 }],
  },
  {
    name: 'Crucible Pit', theme: 'foundry', hpScale: 1.06,
    arena: { deathY: -6, boxes: [box(-9.5, -2, -2.5, 0), box(2, 9.5, -2.5, 0), box(-2, 2, -2.5, -1.6), wall(-9.25, 0, 2.6), wall(9.25, 0, 2.6)] },
    player: { x: -6 },
    enemies: [{ type: 'viking', x: 6 }],
    hazards: [
      { type: 'spikes', x: 0, y: -1.6, w: 3, damage: 12 },
      { type: 'jar', x: 0, y: 5, chain: 2.6, power: 9, damage: 20 },
    ],
  },
  {
    name: 'Assembly Line', theme: 'foundry', hpScale: 1.05,
    arena: { deathY: -6, boxes: [slab(-10.5, 10.5), wall(-10.25, 0, 3), wall(10.25, 0, 3)] },
    player: { x: -7.8 },
    enemies: [{ type: 'knight', x: 7.8 }, { type: 'bandit', x: 6.3, weapon: 'machete' }, { type: 'brawler', x: 9.4, weapon: 'mace' }],
    hazards: [
      { type: 'conveyor', x: -3.8, y: 0.12, w: 3.4, h: 0.24, speed: 1.3 },
      { type: 'conveyor', x: 3.8, y: 0.12, w: 3.4, h: 0.24, speed: -1.3 },
      { type: 'piston', x: 0, y: -0.5, w: 1.2, h: 1, dir: 'up', stroke: 1.0, period: 3.0 },
    ],
  },
  {
    name: 'Hammer Press', theme: 'foundry',
    arena: { deathY: -6, boxes: [slab(-10, 10), wall(-9.75, 0, 3), wall(9.75, 0, 3), ...both((s) => box(s * 3 - 1, s * 3 + 1, 5.2, 5.8, 'pillar'))] },
    player: { x: -7.6 },
    enemies: [{ type: 'gladiator', x: 7.6 }],
    hazards: [
      { type: 'piston', x: -3, y: 4.4, w: 1.4, h: 1.6, dir: 'down', stroke: 2.6, period: 2.4 },
      { type: 'piston', x: 3, y: 4.4, w: 1.4, h: 1.6, dir: 'down', stroke: 2.6, period: 2.4, phase: 0.5 },
      { type: 'barrel', x: -5, y: 0.45, power: 11, damage: 25 },
      { type: 'barrel', x: 5, y: 0.45, power: 11, damage: 25 },
    ],
  },
  {
    name: 'Chain Jars', theme: 'foundry', hpScale: 1.07,
    arena: { deathY: -6, boxes: [slab(-10, 10), box(-6.5, -3.5, 0, 2.2), box(3.5, 6.5, 0, 2.2), wall(-9.75, 0, 2.6), wall(9.75, 0, 2.6), ...both((s) => box(s * 1.6 - 0.4, s * 1.6 + 0.4, 5.2, 5.6, 'pillar'))] },
    player: { x: -5 },
    enemies: [{ type: 'knight', x: 5 }, { type: 'viking', x: 8.3 }],
    hazards: [
      { type: 'jar', x: -1.6, y: 5.2, chain: 2.6, power: 9, damage: 20 },
      { type: 'jar', x: 1.6, y: 5.2, chain: 2.6, power: 9, damage: 20 },
    ],
  },
  {
    name: 'Slag Bridge', theme: 'foundry', hpScale: 1.05,
    arena: { deathY: -6, boxes: [slab(-10.5, -5.5), slab(-4.4, 4.4), slab(5.5, 10.5), wall(-10.25, 0, 2.6), wall(10.25, 0, 2.6)] },
    player: { x: -8 },
    enemies: [{ type: 'samurai', x: 8 }, { type: 'ninja', x: 2.2, weapon: 'butterfly_knife' }, { type: 'knight', x: 0 }],
    hazards: [
      { type: 'blade', x: -4.95, y: -1.2, r: 0.5, speed: 14, damage: 14, path: [-4.95, 0.3], period: 3.2 },
      { type: 'blade', x: 4.95, y: -1.2, r: 0.5, speed: -14, damage: 14, path: [4.95, 0.3], period: 3.2, phase: 0.5 },
    ],
  },
  {
    name: 'Molten Stairs', theme: 'foundry', hpScale: 1.1,
    arena: { deathY: -6, boxes: [slab(-10, 10), box(-5.2, 5.2, 0, 1), box(-4, 4, 1, 2), wall(-9.75, 0, 2.6), wall(9.75, 0, 2.6)] },
    player: { x: -8.2 },
    enemies: [{ type: 'gladiator', x: 8.2 }, { type: 'viking', x: 3.2 }],
    hazards: [
      { type: 'rotor', x: 0, y: 4, w: 2.6, h: 0.3, speed: 2.2 },
      { type: 'barrel', x: -5.7, y: 0.45, power: 11, damage: 25 },
      { type: 'barrel', x: 5.7, y: 0.45, power: 11, damage: 25 },
    ],
  },
  {
    name: 'Final Shift', theme: 'foundry', hpScale: 1.1,
    arena: { deathY: -6, boxes: [slab(-10.5, 10.5), box(-1.2, 1.2, 0, 0.6), wall(-10.25, 0, 3.2), wall(10.25, 0, 3.2), ...both((s) => box(s * 2.6 - 0.9, s * 2.6 + 0.9, 5.4, 6, 'pillar'))] },
    player: { x: -7.6 },
    enemies: [{ type: 'gladiator', x: 7.6 }, { type: 'viking', x: 0 }, { type: 'knight', x: 9.4 }],
    hazards: [
      { type: 'piston', x: -2.6, y: 4.6, w: 1.3, h: 1.6, dir: 'down', stroke: 2.6, period: 2.6 },
      { type: 'piston', x: 2.6, y: 4.6, w: 1.3, h: 1.6, dir: 'down', stroke: 2.6, period: 2.6, phase: 0.5 },
      { type: 'barrel', x: -5, y: 0.45, power: 11, damage: 25 },
      { type: 'barrel', x: 5, y: 0.45, power: 11, damage: 25 },
      { type: 'dropper', x: 0, y: 8, every: 6, items: ['crate', 'hammer', 'crate', 'scythe'], max: 3 },
    ],
  },
  {
    name: 'Mamma Mia', theme: 'hall',
    arena: hall(11, 5.5),
    player: { x: -5.5 },
    enemies: [{ type: 'mamma_mia', x: 5 }],
    hazards: [
      { type: 'rack', x: -7.5, y: 0, weapons: ['yari', 'yari', 'yari', 'yari'] },   // spear rack behind the player: grab two to dual wield
      // spinning spike balls guarding both ends of the hall
      { type: 'spikeball', x: -9.9, y: 1.6, r: 0.45, speed: 5, damage: 14, arm: 1.0, orbit: 2.4 },
      { type: 'spikeball', x: 9.9, y: 1.6, r: 0.45, speed: -5, damage: 14, arm: 1.0, orbit: -2.4 },
    ],
  },

  // ------------------------------------------------------------------ Act 5 · freezer: ice floors, icicles, meat hooks, frozen shelves
  {
    // flat walk-in with a slick ice rink in the middle and two meat hooks swinging over it
    name: 'Cold Open', theme: 'freezer', bgVariant: 0, hpScale: 1.0,
    arena: {
      deathY: -6,
      boxes: [slab(-9, -2.5), slab(-2.5, 2.5, 0, 1, 'ice'), slab(2.5, 9), wall(-8.75, 0, 3, 0.5, 'metal'), wall(8.75, 0, 3, 0.5, 'metal'), ...sym(box(-4.2, -3.4, 5.6, 5.9, 'metal'))],
    },
    player: { x: -6.5 },
    enemies: [{ type: 'frost_cook', x: 6.5 }],
    loose: [{ id: 'cleaver', x: 0 }],
    hazards: [...pairH({ type: 'swinger', x: -3.8, y: 5.6, chain: 3.2, r: 0.45, amp: 0.8, period: 3.4, damage: 12, look: 'hook' })],
  },
  {
    // V-shaped valley: spawn on high ledges, ice slides dump both fighters into the pit where icicles fall
    name: 'Sundae Slide', theme: 'freezer', bgVariant: 1, hpScale: 1.02,
    arena: {
      deathY: -6,
      boxes: [slab(-7, -2), slab(-2, 2, 0, 1, 'ice'), slab(2, 7), ...sym(box(-10, -7, -1, 2.5, 'rock')), wall(-9.75, 2.5, 4.5, 0.5, 'metal'), wall(9.75, 2.5, 4.5, 0.5, 'metal'), ...sym(box(-3.1, -2.1, 7.6, 7.9, 'ice'))],
      polys: symPoly([[-7, 2.5], [-2, 0], [-7, 0]], 'ice'),
    },
    player: { x: -8.5 },
    enemies: [{ type: 'penguin_waiter', x: 8.5 }, { type: 'frost_cook', x: 0 }],
    loose: [{ id: 'katana', x: -7.6 }, { id: 'katana', x: 7.6 }],
    hazards: [...pairH({ type: 'icicle', x: -2.6, y: 7.6, every: 3.4, len: 0.7, damage: 12 }, 0.5)],
  },
  {
    // butcher's aisle: three meat hooks on a ceiling rail, two chopping blocks to hide behind
    name: 'Meat Locker', theme: 'freezer', bgVariant: 2, hpScale: 1.04,
    arena: {
      deathY: -6,
      boxes: [slab(-10, 10), wall(-9.75, 0, 3, 0.5, 'metal'), wall(9.75, 0, 3, 0.5, 'metal'), ...sym(box(-3.4, -2.2, 0, 0.7, 'wood'), box(-5.4, -4.6, 5.5, 5.8, 'metal')), box(-0.4, 0.4, 5.5, 5.8, 'metal')],
    },
    player: { x: -7.5 },
    enemies: [{ type: 'ice_brute', x: 7.5 }, { type: 'frost_cook', x: 2.8 }],
    loose: [{ id: 'sword', x: -1.3 }, { id: 'sword', x: 1.3 }],
    hazards: [
      { type: 'swinger', x: 0, y: 5.5, chain: 3.3, r: 0.45, amp: 0.9, period: 3.0, damage: 12, look: 'hook' },
      ...pairH({ type: 'swinger', x: -5, y: 5.5, chain: 3.1, r: 0.45, amp: 0.7, period: 3.6, damage: 12, look: 'hook' }),
    ],
  },
  {
    // tall freezer shelving: spawn on the top shelves, drop down the tiers to the icy aisle (or climb back up)
    name: 'Shelf Life', theme: 'freezer', bgVariant: 0, hpScale: 1.07,
    arena: {
      deathY: -6,
      boxes: [slab(-9.5, -2.4), slab(-2.4, 2.4, 0, 1, 'ice'), slab(2.4, 9.5), wall(-9.25, 0, 5, 0.5, 'metal'), wall(9.25, 0, 5, 0.5, 'metal'),
        ...sym(box(-9, -6, 2.7, 3.0, 'metal'), box(-6.6, -3.6, 1.2, 1.5, 'metal')), box(-2.5, 2.5, 6.5, 6.8, 'ice')],
    },
    player: { x: -7.5 },
    enemies: [{ type: 'penguin_waiter', x: 7.5 }, { type: 'frost_cook', x: 5.1 }],
    hazards: [
      { type: 'rack', x: -4.3, y: 1.5, weapons: ['katana', 'mace'] },
      { type: 'rack', x: 4.3, y: 1.5, weapons: ['katana', 'mace'] },
      ...pairH({ type: 'icicle', x: -1.4, y: 6.5, every: 3.8, len: 0.7, damage: 12 }, 0.5),
    ],
  },
  {
    name: "Sam's Snow Globe", theme: 'freezer', bgVariant: 2,
    arena: {
      deathY: -6,
      boxes: [slab(-11, 11), ...sym(box(-11, -8.8, 0, 0.7, 'ice')), wall(-11.25, 0, 6.5, 0.5, 'ice'), wall(11.25, 0, 6.5, 0.5, 'ice')],
    },
    player: { x: -5.5 },
    enemies: [{ type: 'snowball_sam', x: 5 }],
    hazards: [SPEARS, ...pairH({ type: 'icicle', x: -9.9, y: 8, every: 4.5, len: 0.8, damage: 12 }, 0.5)],
  },
  {
    // a spike pit bridged only by three ice floes that crack and fall when stood on
    name: 'Thin Ice', theme: 'freezer', bgVariant: 1, hpScale: 1.1,
    arena: {
      deathY: -6,
      boxes: [slab(-10, -3.4, 0, 2.6), slab(3.4, 10, 0, 2.6), box(-3.4, 3.4, -2.6, -1.4, 'rock'), wall(-9.75, 0, 3, 0.5, 'metal'), wall(9.75, 0, 3, 0.5, 'metal')],
    },
    player: { x: -7 },
    enemies: [{ type: 'penguin_waiter', x: 7 }, { type: 'frost_cook', x: 5.2 }],
    loose: [{ id: 'katana', x: -8.8 }, { id: 'katana', x: 8.8 }],
    hazards: [
      { type: 'spikes', x: 0, y: -1.4, w: 4, damage: 9 },
      { type: 'crumble', x: -2.25, y: 0, w: 1.5, delay: 0.6, respawn: 4 },
      { type: 'crumble', x: 0, y: 0, w: 1.5, delay: 0.6, respawn: 4 },
      { type: 'crumble', x: 2.25, y: 0, w: 1.5, delay: 0.6, respawn: 4 },
    ],
  },
  {
    // ice-cube production line: belts carry everyone toward the spiked grinder turning in the middle
    name: 'Ice Cube Line', theme: 'freezer', bgVariant: 2, hpScale: 1.12,
    arena: {
      deathY: -6,
      boxes: [slab(-10, 10), ...sym(box(-10, -7, 0, 0.7, 'metal')), wall(-9.75, 0.7, 3.5, 0.5, 'metal'), wall(9.75, 0.7, 3.5, 0.5, 'metal')],
    },
    player: { x: -8.5 },
    enemies: [{ type: 'ice_brute', x: 8.5 }, { type: 'penguin_waiter', x: 7.5 }],
    hazards: [
      ...pairH({ type: 'conveyor', x: -4.2, y: 0.12, w: 5.4, h: 0.24, speed: 1.1 }),
      { type: 'spikeball', x: 0, y: 2.1, r: 0.45, speed: 5, damage: 12, arm: 1.3, orbit: 1.8 },
      ...pairH({ type: 'dropper', x: -4.2, y: 8, every: 7, items: ['crate', 'bat', 'crate'], max: 2 }),
    ],
  },
  {
    // three floors over the void; the freezer fans kick in and blow everyone toward the slick centre rink
    name: 'Cold Draft', theme: 'freezer', bgVariant: 0, hpScale: 1.15,
    arena: {
      deathY: -6,
      boxes: [slab(-9.5, -4.6), slab(-3.6, 3.6, 0, 1, 'ice'), slab(4.6, 9.5), wall(-9.25, 0, 3, 0.5, 'metal'), wall(9.25, 0, 3, 0.5, 'metal')],
    },
    player: { x: -6.8 },
    enemies: [{ type: 'penguin_waiter', x: 6.8 }, { type: 'ice_brute', x: 0 }],
    loose: [{ id: 'hammer', x: -2.4 }, { id: 'hammer', x: 2.4 }],
    hazards: [...pairH({ type: 'wind', x: -4.75, y: 1.6, w: 9.5, h: 3.2, fx: 4, fy: 0, period: 6, duty: 0.4 })],
  },
  {
    // ice vault: a rock hill under a vaulted ceiling of icicles and a swinging ice-ball chandelier
    name: 'Icicle Cathedral', theme: 'freezer', bgVariant: 1, hpScale: 1.18,
    arena: {
      deathY: -6,
      boxes: [slab(-10, 10), wall(-9.75, 0, 5, 0.5, 'rock'), wall(9.75, 0, 5, 0.5, 'rock'), box(-7, 7, 7.2, 7.8, 'rock')],
      polys: [{ pts: [[-5, 0], [-1.5, 1.4], [1.5, 1.4], [5, 0]], style: 'rock' }],
    },
    player: { x: -8 },
    enemies: [{ type: 'ice_brute', x: 8 }, { type: 'frost_cook', x: 8.9 }],
    loose: [{ id: 'poleaxe', x: 0, y: 1.7 }],
    hazards: [
      { type: 'swinger', x: 0, y: 7.2, chain: 3.9, r: 0.5, amp: 0.75, period: 3.8, damage: 13, look: 'ball' },
      ...pairH({ type: 'icicle', x: -1.1, y: 7.2, every: 3.2, len: 0.7, damage: 12 }, 0.5),
      ...pairH({ type: 'icicle', x: -3.4, y: 7.2, every: 4.1, len: 0.8, damage: 12, phase: 0.25 }, 0.5),
    ],
  },
  {
    name: 'Brain Freeze', theme: 'boss_freezer', bgVariant: 0,
    arena: {
      deathY: -6,
      boxes: [slab(-12, 12), ...sym(box(-12, -9.6, 0, 0.7, 'metal')), wall(-12.25, 0, 7.5, 0.5, 'ice'), wall(12.25, 0, 7.5, 0.5, 'ice')],
    },
    player: { x: -5.5 },
    enemies: [{ type: 'brain_freeze', x: 5 }],
    hazards: [SPEARS, ...pairH({ type: 'swinger', x: -10.8, y: 7.5, chain: 3.4, r: 0.45, amp: 0.5, period: 4, damage: 10, look: 'hook' })],
  },

  // ------------------------------------------------------------------ Act 6 · docks: water below, boats, gapped piers, cargo, gangplanks
  {
    // a gapped pier over the harbour with a cargo crate swinging low over the middle section
    name: 'Pier Pressure', theme: 'docks', bgVariant: 0, hpScale: 1.0,
    arena: {
      deathY: -2.4,
      boxes: [slab(-3.6, 3.6, 0, 0.6, 'wood'), box(-1.4, 1.4, 6.2, 6.5, 'metal'),
        ...sym(slab(-10, -4.6, 0, 0.6, 'wood'), box(-7.45, -7.15, -3, -0.6, 'wood'), box(-2.35, -2.05, -3, -0.6, 'wood'), wall(-9.75, 0, 3, 0.5, 'metal'))],
    },
    player: { x: -7 },
    enemies: [{ type: 'deckhand', x: 7 }],
    loose: [{ id: 'bat', x: -2 }, { id: 'bat', x: 2 }],
    hazards: [
      { type: 'water', x0: -14, x1: 14, y: -1.2 },
      { type: 'swinger', x: 0, y: 6.2, chain: 3.9, r: 0.5, amp: 0.75, period: 3.6, damage: 12, look: 'crate' },
    ],
  },
  {
    // two jetties with a rocking fishing boat moored between them
    name: 'Rock the Boat', theme: 'docks', bgVariant: 1, hpScale: 1.02,
    arena: {
      deathY: -2.4,
      boxes: [...sym(slab(-10, -3.6, 0, 0.6, 'wood'), box(-6.95, -6.65, -3, -0.6, 'wood'), box(-4.25, -3.95, -3, -0.6, 'wood'), wall(-9.75, 0, 3, 0.5, 'wood'))],
    },
    player: { x: -7 },
    enemies: [{ type: 'pirate_chef', x: 7 }, { type: 'deckhand', x: 5.2 }],
    loose: [{ id: 'cleaver', x: 0, y: 0.6 }],
    hazards: [
      { type: 'water', x0: -14, x1: 14, y: -1.2 },
      { type: 'boat', x: 0, y: 0, w: 5.2, h: 0.5, amp: 0.07, bob: 0.12, period: 3.6 },
    ],
  },
  {
    // two tall ships with seesaw gangplanks tipping down to a little pier in the middle
    name: 'Gangplank Gamble', theme: 'docks', bgVariant: 2, hpScale: 1.04,
    arena: {
      deathY: -2.4,
      boxes: [slab(-2.5, 2.5, 0, 0.5, 'wood'), box(-0.2, 0.2, -3, -0.5, 'wood'), ...sym(box(-10, -6.3, -3, 1.6, 'hull'), wall(-9.8, 1.6, 4.6, 0.4, 'wood'))],
    },
    player: { x: -8 },
    enemies: [{ type: 'diver', x: 8 }, { type: 'deckhand', x: 0 }],
    loose: [{ id: 'machete', x: -7.2 }, { id: 'machete', x: 7.2 }],
    hazards: [
      { type: 'water', x0: -14, x1: 14, y: -1.2 },
      ...pairH({ type: 'seesaw', x: -4.4, y: 0.6, w: 3.6, h: 0.3, limit: 0.42 }),
    ],
  },
  {
    // shipping containers stacked two high on the quay; a crane swings cargo over the yard and drops crates
    name: 'Container Yard', theme: 'docks', bgVariant: 0, hpScale: 1.07,
    arena: {
      deathY: -6,
      boxes: [slab(-10, 10), box(-1.2, 1.2, 6.8, 7.1, 'metal'), ...sym(box(-6.2, -3.2, 0, 1.3, 'metal'), box(-6.2, -4.2, 1.3, 2.6, 'metal'), wall(-9.75, 0, 3.5, 0.5, 'metal'))],
    },
    player: { x: -5.2 },
    enemies: [{ type: 'deckhand', x: 5.2 }, { type: 'pirate_chef', x: 8 }],
    hazards: [
      { type: 'swinger', x: 0, y: 6.8, chain: 4.4, r: 0.55, amp: 0.95, period: 4.2, damage: 14, look: 'crate' },
      ...pairH({ type: 'dropper', x: -1.8, y: 9, every: 6.5, items: ['crate', 'machete', 'crate'], max: 3 }, 0.5),
    ],
  },
  {
    name: 'Anchovy Wharf', theme: 'docks', bgVariant: 2,
    arena: {
      deathY: -2.6,
      boxes: [slab(-11, 11, 0, 0.6, 'wood'), wall(-11.25, 0, 5.5, 0.5, 'wood'), wall(11.25, 0, 5.5, 0.5, 'wood'),
        ...sym(box(-11, -9.3, 0, 0.9, 'wood'), box(-8.15, -7.85, -3.5, -0.6, 'wood'), box(-3.15, -2.85, -3.5, -0.6, 'wood'), box(-10.5, -9.7, 6.2, 6.5, 'metal'))],
    },
    player: { x: -5.5 },
    enemies: [{ type: 'captain_anchovy', x: 5 }],
    hazards: [
      SPEARS,
      { type: 'water', x0: -15, x1: 15, y: -1.4 },
      ...pairH({ type: 'jar', x: -10.1, y: 6.2, chain: 2.6, power: 9, damage: 18 }),
    ],
  },
  {
    // island hopping: jetties, two bobbing skiffs and a rock in the middle of the bay
    name: 'Skiff Hop', theme: 'docks', bgVariant: 1, hpScale: 1.1,
    arena: {
      deathY: -2.5,
      boxes: [box(-2, 2, -3, 0.2, 'rock'), ...sym(slab(-10, -6, 0, 0.6, 'wood'), box(-8.15, -7.85, -3, -0.6, 'wood'), wall(-9.75, 0, 3, 0.5, 'wood'))],
    },
    player: { x: -8 },
    enemies: [{ type: 'diver', x: 8 }, { type: 'pirate_chef', x: 0 }],
    loose: [{ id: 'kanabo', x: -6.8 }, { id: 'kanabo', x: 6.8 }],
    hazards: [
      { type: 'water', x0: -14, x1: 14, y: -1.3 },
      ...pairH({ type: 'boat', x: -4.2, y: 0, w: 2.4, h: 0.4, amp: 0.1, bob: 0.18, period: 3 }),
    ],
  },
  {
    // a drawbridge whose two halves keep rising, leaving the canal wide open; powder barrels on both banks
    name: 'Drawbridge', theme: 'docks', bgVariant: 2, hpScale: 1.12,
    arena: {
      deathY: -2.4,
      boxes: [...sym(slab(-10, -1.6, 0, 0.6, 'wood'), box(-6.15, -5.85, -3, -0.6, 'wood'), box(-3.15, -2.85, -3, -0.6, 'wood'), wall(-9.75, 0, 3, 0.5, 'metal'))],
    },
    player: { x: -7 },
    enemies: [{ type: 'pirate_chef', x: 7 }, { type: 'deckhand', x: 9 }],
    hazards: [
      { type: 'water', x0: -14, x1: 14, y: -1.2 },
      ...pairH({ type: 'mover', x: -0.82, y: -0.15, w: 1.56, h: 0.3, to: [-0.82, 2.2], period: 7 }),
      ...pairH({ type: 'barrel', x: -4.5, y: 0.45, power: 11, damage: 22 }),
    ],
  },
  {
    // boarding action: two ships rocking side by side, powder kegs dangling from the rigging
    name: 'Ship to Ship', theme: 'docks', bgVariant: 0, hpScale: 1.15,
    arena: {
      deathY: -2.4,
      boxes: [...sym(box(-10, -7.4, -3, 0.4, 'rock'), wall(-9.75, 0.4, 3.4, 0.5, 'rock'), box(-2.6, -1.8, 6.2, 6.5, 'hull'))],
    },
    player: { x: -4 },
    enemies: [{ type: 'pirate_chef', x: 4 }, { type: 'diver', x: 8.6 }],
    loose: [{ id: 'sword', x: -8.7 }, { id: 'sword', x: 8.7 }],
    hazards: [
      { type: 'water', x0: -14, x1: 14, y: -1.2 },
      ...pairH({ type: 'boat', x: -3.6, y: 0, w: 6.2, h: 0.5, amp: 0.06, bob: 0.12, period: 4.2 }),
      ...pairH({ type: 'jar', x: -2.2, y: 6.2, chain: 2.4, power: 9, damage: 18 }),
    ],
  },
  {
    // two-storey boardwalk: rotten planks give way and drop you to the lower deck (climb back up at the solid bits)
    name: 'Rotten Boardwalk', theme: 'docks', bgVariant: 1, hpScale: 1.18,
    arena: {
      deathY: -5,
      boxes: [slab(-10, 10, -2.6, 0.5, 'wood'),
        ...sym(slab(-10, -6.2, 0, 0.4, 'wood'), slab(-4.4, -2.6, 0, 0.4, 'wood'), wall(-9.75, -2.6, 3, 0.5, 'wood'), box(-5.15, -4.85, -5.5, -3.1, 'wood'))],
    },
    player: { x: -8.2 },
    enemies: [{ type: 'deckhand', x: 8.2 }, { type: 'pirate_chef', x: 3.5 }, { type: 'diver', x: 9 }],
    hazards: [
      { type: 'water', x0: -14, x1: 14, y: -3.8 },
      ...pairH({ type: 'crumble', x: -5.3, y: 0, w: 1.8, h: 0.35, delay: 0.8, respawn: 3.5 }),
      ...pairH({ type: 'crumble', x: -1.3, y: 0, w: 2.6, h: 0.35, delay: 0.8, respawn: 3.5 }),
    ],
  },
  {
    name: 'Calamari King', theme: 'boss_docks', bgVariant: 0,
    arena: {
      deathY: -3,
      boxes: [slab(-12, 12, 0, 0.8, 'wood'), wall(-12.3, 0, 7, 0.6, 'hull'), wall(12.3, 0, 7, 0.6, 'hull'),
        ...sym(box(-9.15, -8.85, -4, -0.8, 'wood'), box(-5.15, -4.85, -4, -0.8, 'wood'), box(-1.15, -0.85, -4, -0.8, 'wood'), box(-11.1, -9.9, 7, 7.3, 'metal'))],
    },
    player: { x: -5.5 },
    enemies: [{ type: 'calamari_king', x: 5 }],
    hazards: [
      SPEARS,
      { type: 'water', x0: -18, x1: 18, y: -1.6 },
      ...pairH({ type: 'boat', x: -14.6, y: -0.9, w: 3, h: 0.45, amp: 0.08, bob: 0.15, period: 4 }),   // moored outside the pier walls (scenery)
      ...pairH({ type: 'swinger', x: -10.5, y: 7, chain: 3.2, r: 0.5, amp: 0.4, period: 4.4, damage: 12, look: 'crate' }),
    ],
  },

  // ------------------------------------------------------------------ Act 7 · volcano: lava strips, fire jets, crumbling basalt, slopes
  {
    // flat basalt griddle with two glowing lava seams to hop over
    name: 'Hot Plate', theme: 'volcano', bgVariant: 0, hpScale: 1.0,
    arena: {
      deathY: -6,
      boxes: [slab(-1.7, 1.7, 0, 1, 'rock'), ...sym(slab(-9, -2.7, 0, 1, 'rock'), wall(-8.75, 0, 3, 0.5, 'rock'))],
    },
    player: { x: -6 },
    enemies: [{ type: 'grill_master', x: 6 }],
    loose: [{ id: 'cleaver', x: 0 }],
    hazards: [...pairH({ type: 'lava', x: -2.2, y: -0.2, w: 1.0, damage: 8 })],
  },
  {
    // king of the hill: a steep ridge with a fire jet on the summit and lava moats at its feet
    name: 'Magma Ridge', theme: 'volcano', bgVariant: 1, hpScale: 1.02,
    arena: {
      deathY: -6,
      boxes: [slab(-6.3, 6.3, 0, 1, 'rock'), ...sym(slab(-10, -7.3, 0, 1, 'rock'), wall(-9.75, 0, 3, 0.5, 'rock'))],
      polys: [{ pts: [[-6.3, 0], [-1, 2.6], [1, 2.6], [6.3, 0]], style: 'rock' }],
    },
    player: { x: -8.6 },
    enemies: [{ type: 'fire_dancer', x: 8.6 }, { type: 'grill_master', x: 9.1 }],
    loose: [{ id: 'mace', x: -3.5 }, { id: 'mace', x: 3.5 }],
    hazards: [
      ...pairH({ type: 'lava', x: -6.8, y: -0.2, w: 1.0, damage: 8 }),
      { type: 'firejet', x: 0, y: 2.6, dir: 'up', len: 2.8, period: 4, duty: 0.3, damage: 10 },
    ],
  },
  {
    // a basalt cone reached by stairs of crumbling ledges; the prize axe waits on top, lava by the walls
    name: 'Cinder Cone', theme: 'volcano', bgVariant: 2, hpScale: 1.04,
    arena: {
      deathY: -6,
      boxes: [slab(-8.4, 8.4, 0, 1, 'rock'), box(-2.2, 2.2, 0, 2.4, 'rock'), ...sym(wall(-9.75, -1, 3.5, 0.5, 'rock'))],
    },
    player: { x: -6.8 },
    enemies: [{ type: 'magma_brute', x: 6.8 }, { type: 'fire_dancer', x: 0 }],
    loose: [{ id: 'executioner', x: 0.8, y: 2.7 }],
    hazards: [
      ...pairH({ type: 'lava', x: -8.95, y: -0.2, w: 1.1, damage: 8 }),
      ...pairH({ type: 'crumble', x: -4.3, y: 0.8, w: 1.4, h: 0.35, delay: 0.7, respawn: 4 }),
      ...pairH({ type: 'crumble', x: -2.9, y: 1.6, w: 1.4, h: 0.35, delay: 0.7, respawn: 4 }),
    ],
  },
  {
    // a giant grill: rows of burners flare up through the grate in a wave from the middle outward
    name: 'Grill Grates', theme: 'volcano', bgVariant: 0, hpScale: 1.07,
    arena: {
      deathY: -6,
      boxes: [slab(-10, 10, 0, 1, 'metal'), ...sym(wall(-9.75, 0, 3, 0.5, 'rock'))],
    },
    player: { x: -8 },
    enemies: [{ type: 'grill_master', x: 8 }, { type: 'fire_dancer', x: 9.1 }],
    loose: [{ id: 'katana', x: -2.6 }, { id: 'katana', x: 2.6 }],
    hazards: [
      ...pairH({ type: 'firejet', x: -1.6, y: 0, dir: 'up', len: 2.4, period: 3.6, duty: 0.3, phase: 0, damage: 9 }),
      ...pairH({ type: 'firejet', x: -3.6, y: 0, dir: 'up', len: 2.4, period: 3.6, duty: 0.3, phase: 0.2, damage: 9 }),
      ...pairH({ type: 'firejet', x: -5.6, y: 0, dir: 'up', len: 2.4, period: 3.6, duty: 0.3, phase: 0.4, damage: 9 }),
    ],
  },
  {
    name: 'Scoville Summit', theme: 'volcano', bgVariant: 2,
    arena: {
      deathY: -6,
      boxes: [slab(-11, 11, 0, 1, 'rock'), wall(-11.25, 0, 6, 0.5, 'rock'), wall(11.25, 0, 6, 0.5, 'rock')],
      polys: symPoly([[-11, 0], [-8.5, 0], [-11, 1.2]], 'rock'),
    },
    player: { x: -5.5 },
    enemies: [{ type: 'hot_sauce', x: 5 }],
    hazards: [SPEARS, ...pairH({ type: 'firejet', x: -10.4, y: 0.91, dir: 'up', len: 3, period: 5, duty: 0.3, damage: 10 })],
  },
  {
    // high basalt shelves on both sides, lava moats below, stone elevators ferrying fighters up and down
    name: 'Basalt Elevators', theme: 'volcano', bgVariant: 1, hpScale: 1.1,
    arena: {
      deathY: -6,
      boxes: [slab(-3, 3, 0, 1, 'rock'), ...sym(box(-10, -6.5, -1, 3, 'rock'), wall(-9.75, 3, 5, 0.5, 'rock'))],
    },
    player: { x: -8.2 },
    enemies: [{ type: 'fire_dancer', x: 8.2 }, { type: 'magma_brute', x: 0 }],
    loose: [{ id: 'chain_mace', x: -1.8 }, { id: 'chain_mace', x: 1.8 }],
    hazards: [
      ...pairH({ type: 'lava', x: -4.75, y: -0.3, w: 3.5, damage: 8 }),
      ...pairH({ type: 'mover', x: -4.75, y: 0.2, w: 1.4, h: 0.3, to: [-4.75, 2.85], period: 6 }),
    ],
  },
  {
    // hop across a row of basalt columns standing in a lava lake; fire spouts between the middle columns
    name: 'Basalt Pillars', theme: 'volcano', bgVariant: 2, hpScale: 1.12,
    arena: {
      deathY: -6,
      boxes: [box(-0.7, 0.7, -1.5, 1.2, 'rock'),
        ...sym(box(-3.1, -1.7, -1.5, 1.2, 'rock'), box(-5.5, -4.1, -1.5, 1.2, 'rock'), box(-10, -6.5, -1.5, 1.2, 'rock'), wall(-9.75, 1.2, 4, 0.5, 'rock'))],
    },
    player: { x: -8 },
    enemies: [{ type: 'magma_brute', x: 8 }, { type: 'fire_dancer', x: 4.8 }],
    hazards: [
      { type: 'lava', x: 0, y: -0.4, w: 13, damage: 8 },
      ...pairH({ type: 'firejet', x: -1.2, y: -0.4, dir: 'up', len: 3.2, period: 4.5, duty: 0.25, damage: 10 }),
    ],
  },
  {
    // two slow spinning spits turn over a lava pit: ride the skewers across or get roasted
    name: 'Rotisserie', theme: 'volcano', bgVariant: 0, hpScale: 1.15,
    arena: {
      deathY: -6,
      boxes: [...sym(slab(-10, -3.6, 0, 1.5, 'rock'), wall(-9.75, 0, 3, 0.5, 'rock'))],
    },
    player: { x: -7 },
    enemies: [{ type: 'grill_master', x: 7 }, { type: 'fire_dancer', x: 8.8 }],
    loose: [{ id: 'sword', x: -5 }, { id: 'sword', x: 5 }],
    hazards: [
      { type: 'lava', x: 0, y: -1.0, w: 7.2, damage: 8 },
      ...pairH({ type: 'rotor', x: -1.8, y: 0.3, w: 3.2, h: 0.3, speed: 0.7 }),
    ],
  },
  {
    // two lava craters hidden under crumbling crusts; a fire altar in the middle scorches both lids
    name: 'Twin Craters', theme: 'volcano', bgVariant: 1, hpScale: 1.18,
    arena: {
      deathY: -6,
      boxes: [slab(-2.8, 2.8, 0, 2, 'rock'), box(-1, 1, 0, 0.6, 'rock'), ...sym(slab(-10, -5.2, 0, 2, 'rock'), wall(-9.75, 0, 3, 0.5, 'rock'))],
    },
    player: { x: -7.5 },
    enemies: [{ type: 'magma_brute', x: 7.5 }, { type: 'grill_master', x: 0 }, { type: 'fire_dancer', x: 9.1 }],
    hazards: [
      ...pairH({ type: 'lava', x: -4, y: -1.3, w: 2.4, damage: 8 }),
      ...pairH({ type: 'crumble', x: -4, y: 0, w: 2.4, h: 0.35, delay: 0.5, respawn: 5 }),
      ...pairH({ type: 'firejet', x: -1, y: 0.35, dir: 'left', len: 2.2, period: 4, duty: 0.3, damage: 9 }),
    ],
  },
  {
    name: 'Chili Colossus', theme: 'boss_volcano', bgVariant: 0,
    arena: {
      deathY: -6,
      boxes: [slab(-12, 12, 0, 1, 'rock'), wall(-12.3, 0, 6.5, 0.6, 'rock'), wall(12.3, 0, 6.5, 0.6, 'rock'), ...sym(box(-12, -10.4, 0, 0.8, 'rock'), box(-18, -15.5, -1.5, 1.2, 'rock'))],
    },
    player: { x: -5.5 },
    enemies: [{ type: 'chili_colossus', x: 5 }],
    hazards: [
      SPEARS,
      ...pairH({ type: 'lava', x: -14.05, y: -0.6, w: 2.9, damage: 8 }),   // caldera moats outside the walls
      ...pairH({ type: 'firejet', x: -11.2, y: 0.8, dir: 'up', len: 3.2, period: 6, duty: 0.25, damage: 10 }),
    ],
  },

  // ------------------------------------------------------------------ Act 8 · sky: bounce pads, wind, floating/moving platforms, seesaws, gaps
  {
    // three cloud islands over the void, two bounce pads on the middle one
    name: 'Cloud Nine', theme: 'sky', bgVariant: 0, hpScale: 1.0,
    arena: {
      deathY: -7,
      boxes: [slab(-2.8, 2.8, 0, 1, 'cloud'), ...sym(slab(-9, -3.8, 0, 1, 'cloud'), wall(-8.75, 0, 3, 0.5, 'cloud'))],
    },
    player: { x: -6.5 },
    enemies: [{ type: 'sky_monk', x: 6.5 }],
    loose: [{ id: 'staff', x: 0 }],
    hazards: [...pairH({ type: 'bouncer', x: -1.6, y: 0, w: 1.2, power: 9 })],
  },
  {
    // a sunken courtyard with a trampoline at the bottom that flings you back out toward two floating ledges
    name: 'Trampoline Temple', theme: 'sky', bgVariant: 1, hpScale: 1.02,
    arena: {
      deathY: -7,
      boxes: [box(-2, 2, -3, -2, 'cloud'), ...sym(slab(-10, -2, 0, 3, 'cloud'), box(-4.4, -2.2, 2.3, 2.6, 'cloud'), wall(-9.75, 0, 3, 0.5, 'cloud'))],
    },
    player: { x: -7 },
    enemies: [{ type: 'cloud_ninja', x: 7 }, { type: 'sky_monk', x: 3.3 }],
    loose: [{ id: 'katana', x: -5.5 }, { id: 'katana', x: 5.5 }],
    hazards: [{ type: 'bouncer', x: 0, y: -2, w: 2, power: 10 }],
  },
  {
    // one giant seesaw plank balanced on a sky pillar between two islands: whoever is heavier tips the fight
    name: 'Balance Beam', theme: 'sky', bgVariant: 2, hpScale: 1.04,
    arena: {
      deathY: -7,
      boxes: [box(-3.9, 3.9, -3.4, -2.4, 'cloud'), ...sym(slab(-10, -3.9, 0, 3.4, 'cloud'), wall(-9.75, 0, 3, 0.5, 'cloud'))],   // catch basin under the plank: climb back out
    },
    player: { x: -7 },
    enemies: [{ type: 'wind_knight', x: 7 }, { type: 'sky_monk', x: 8.8 }],
    loose: [{ id: 'nunchaku', x: -5.5 }, { id: 'nunchaku', x: 5.5 }],
    hazards: [{ type: 'seesaw', x: 0, y: 0.5, w: 7, h: 0.35, limit: 0.3, post: 2.5 }],
  },
  {
    // a closed tower: ledges up both walls and a pulsing updraft in the middle that floats fighters to the top
    name: 'Wind Tunnel', theme: 'sky', bgVariant: 0, hpScale: 1.07,
    arena: {
      deathY: -6,
      boxes: [slab(-6, 6, 0, 1, 'cloud'), ...sym(box(-6, -3.4, 2.2, 2.5, 'cloud'), box(-6, -3.4, 4.6, 4.9, 'cloud'), wall(-6.25, 0, 8, 0.5, 'cloud'))],
    },
    player: { x: -4.7 },
    enemies: [{ type: 'wind_knight', x: 4.7 }, { type: 'cloud_ninja', x: 0 }],
    hazards: [{ type: 'wind', x: 0, y: 3.2, w: 3.2, h: 6.4, fx: 0, fy: 15, period: 5, duty: 0.5 }],
  },
  {
    name: 'Windbag Terrace', theme: 'sky', bgVariant: 2,
    arena: {
      deathY: -6,
      boxes: [slab(-11, 11, 0, 1, 'cloud'), wall(-11.25, 0, 7, 0.5, 'cloud'), wall(11.25, 0, 7, 0.5, 'cloud'), ...sym(box(-11, -9.2, 0, 1.2, 'cloud'), box(-10.5, -9.7, 7.2, 7.5, 'cloud'))],
    },
    player: { x: -5.5 },
    enemies: [{ type: 'windbag', x: 5 }],
    hazards: [SPEARS, ...pairH({ type: 'swinger', x: -10.1, y: 7.2, chain: 3.4, r: 0.5, amp: 0.5, period: 4.2, damage: 12, look: 'ball' })],
  },
  {
    // diagonal lantern lifts carry fighters from the outer islands up to a floating shrine in the middle
    name: 'Lantern Lifts', theme: 'sky', bgVariant: 1, hpScale: 1.1,
    arena: {
      deathY: -7,
      boxes: [box(-1.5, 1.5, 2.8, 3.2, 'cloud'), ...sym(slab(-10, -4.8, 0, 1, 'cloud'), wall(-9.75, 0, 3, 0.5, 'cloud'))],
    },
    player: { x: -7 },
    enemies: [{ type: 'cloud_ninja', x: 7 }, { type: 'sky_monk', x: 0 }],
    loose: [{ id: 'double_sword', x: 0.8, y: 3.5 }],
    hazards: [...pairH({ type: 'mover', x: -3.95, y: -0.15, w: 1.4, h: 0.3, to: [-2.2, 3.05], period: 6 })],
  },
  {
    // stepping pagodas with bounce pads; bounce too high and the spiked censers orbiting above get you
    name: 'Bounce Pagodas', theme: 'sky', bgVariant: 2, hpScale: 1.12,
    arena: {
      deathY: -7,
      boxes: [slab(-2, 2, 0, 1, 'cloud'), ...sym(slab(-10, -6.2, 0, 1, 'cloud'), slab(-5, -3.2, 0, 1, 'cloud'), wall(-9.75, 0, 3, 0.5, 'cloud'))],
    },
    player: { x: -8 },
    enemies: [{ type: 'cloud_ninja', x: 8 }, { type: 'wind_knight', x: 0 }],
    hazards: [
      ...pairH({ type: 'bouncer', x: -4.1, y: 0, w: 1.2, power: 10 }),
      ...pairH({ type: 'spikeball', x: -4.1, y: 4.2, r: 0.4, speed: 4, damage: 12, arm: 1.0, orbit: 1.5 }),
    ],
  },
  {
    // gusts swirl back and forth across both gaps while a windmill turns over the middle island
    name: 'Tornado Alley', theme: 'sky', bgVariant: 0, hpScale: 1.15,
    arena: {
      deathY: -7,
      boxes: [slab(-3.9, 3.9, 0, 1, 'cloud'), ...sym(slab(-10, -5, 0, 1, 'cloud'), wall(-9.75, 0, 3, 0.5, 'cloud'))],
    },
    player: { x: -7.5 },
    enemies: [{ type: 'wind_knight', x: 7.5 }, { type: 'cloud_ninja', x: 9 }],
    loose: [{ id: 'poleaxe', x: -1.8 }, { id: 'poleaxe', x: 1.8 }],
    hazards: [
      ...pairH({ type: 'wind', x: -4.45, y: 1.3, w: 4.2, h: 2.6, fx: 6, fy: 0, period: 4, duty: 0.35, phase: 0 }),
      ...pairH({ type: 'wind', x: -4.45, y: 1.3, w: 4.2, h: 2.6, fx: -6, fy: 0, period: 4, duty: 0.35, phase: 0.5 }),
      { type: 'rotor', x: 0, y: 2.9, w: 3.6, h: 0.25, speed: 1.3 },
    ],
  },
  {
    // a bottomless pit with a jet stream roaring up out of it: fall in and get spat back out under the temple bell
    name: 'Jet Stream Pit', theme: 'sky', bgVariant: 1, hpScale: 1.18,
    arena: {
      deathY: -9,
      boxes: [box(-0.6, 0.6, 6.8, 7.1, 'cloud'), ...sym(slab(-10, -2.5, 0, 1.5, 'cloud'), box(-6.5, -5, 0, 0.7, 'cloud'), wall(-9.75, 0, 3.5, 0.5, 'cloud'))],
    },
    player: { x: -7.5 },
    enemies: [{ type: 'wind_knight', x: 7.5 }, { type: 'cloud_ninja', x: 5.75 }, { type: 'sky_monk', x: 9 }],
    hazards: [
      { type: 'wind', x: 0, y: -3.5, w: 5, h: 7, fx: 0, fy: 22 },   // gravity is -13: net lift ~9 m/s² catches anyone falling in
      { type: 'swinger', x: 0, y: 6.8, chain: 4.8, r: 0.6, amp: 0.8, period: 4.4, damage: 13, look: 'ball' },
    ],
  },
  {
    name: 'Thunder Crust', theme: 'boss_sky', bgVariant: 0,
    arena: {
      deathY: -8,
      boxes: [slab(-12, 12, 0, 1.2, 'cloud'), wall(-12.3, 0, 7, 0.6, 'cloud'), wall(12.3, 0, 7, 0.6, 'cloud'), ...sym(box(-17.5, -14.5, -2.2, -1.6, 'cloud'))],
      polys: [{ pts: [[-12, -1.2], [12, -1.2], [6, -4.2], [-6, -4.2]], style: 'rock' }],   // floating temple foundation
    },
    player: { x: -5.5 },
    enemies: [{ type: 'thunder_crust', x: 5 }],
    hazards: [SPEARS, ...pairH({ type: 'bouncer', x: -11, y: 0, w: 1.2, power: 10 })],
  },

  // ------------------------------------------------------------------ Act 9 · neon: laser gates, pinball bumpers, conveyors, elevators, shock floors
  {
    // a flat neon stage: the middle tile sparks now and then, bumpers guard the ends
    name: 'Insert Coin', theme: 'neon', bgVariant: 0, hpScale: 1.0,
    arena: {
      deathY: -6,
      boxes: [slab(-9, 9, 0, 1, 'neon'), ...sym(wall(-8.75, 0, 3, 0.5, 'neon'))],
    },
    player: { x: -6 },
    enemies: [{ type: 'neon_punk', x: 6 }],
    loose: [{ id: 'machete', x: -3 }, { id: 'machete', x: 3 }],
    hazards: [
      { type: 'shock', x: 0, y: 0, w: 3, period: 4, duty: 0.35, damage: 8 },
      ...pairH({ type: 'bumper', x: -8.0, y: 0.9, r: 0.5, power: 9 }),
    ],
  },
  {
    // raised stages at both ends, a corridor of laser gates that flicker in alternating beats
    name: 'Laser Tag', theme: 'neon', bgVariant: 1, hpScale: 1.02,
    arena: {
      deathY: -6,
      boxes: [slab(-9.5, 9.5, 0, 1, 'neon'), ...sym(box(-9.5, -6.5, 0, 0.7, 'metal'), wall(-9.25, 0.7, 3.2, 0.5, 'neon'))],
    },
    player: { x: -8 },
    enemies: [{ type: 'arcade_champ', x: 8 }, { type: 'neon_punk', x: 5 }],
    hazards: [
      { type: 'lasergate', x: 0, y0: 0, y1: 2.4, period: 3, duty: 0.45, phase: 0, damage: 10 },
      ...pairH({ type: 'lasergate', x: -2.8, y0: 0, y1: 2.4, period: 3, duty: 0.45, phase: 0.5, damage: 10 }),
    ],
  },
  {
    // two glass elevators ride up to a mezzanine; the lobby floor under it is live
    name: 'Elevator Pitch', theme: 'neon', bgVariant: 2, hpScale: 1.04,
    arena: {
      deathY: -6,
      boxes: [slab(-9, 9, 0, 1, 'metal'), box(-4, 4, 3.2, 3.5, 'neon'), ...sym(wall(-8.75, 0, 5, 0.5, 'neon'))],
    },
    player: { x: -7 },
    enemies: [{ type: 'robo_waiter', x: 7 }, { type: 'arcade_champ', x: 0 }],
    loose: [{ id: 'sword', x: -2 }, { id: 'sword', x: 2 }],
    hazards: [
      { type: 'shock', x: 0, y: 0, w: 3.5, period: 5, duty: 0.35, damage: 8 },
      ...pairH({ type: 'mover', x: -5, y: -0.15, w: 1.6, h: 0.3, to: [-5, 3.35], period: 6 }),
    ],
  },
  {
    // a pinball table: ramps slope toward the centre drain, bumpers overhead and a kicker bumper in the drain
    name: 'Pinball Table', theme: 'neon', bgVariant: 0, hpScale: 1.07,
    arena: {
      deathY: -6,
      boxes: [...sym(slab(-10, -0.6, 0, 1, 'neon'), wall(-9.75, 1.6, 4, 0.5, 'neon'))],
      polys: symPoly([[-9.5, 1.6], [-4, 0], [-9.5, 0]], 'neon'),
    },
    player: { x: -2.6 },   // spawns on the flat part: standing on the ramps slid fighters ~0.6 m at the start
    enemies: [{ type: 'arcade_champ', x: 2.6 }, { type: 'neon_punk', x: 3.6 }],
    loose: [{ id: 'nunchaku', x: -1.4 }, { id: 'nunchaku', x: 1.4 }],
    hazards: [
      { type: 'bumper', x: 0, y: 0.4, r: 0.45, power: 10 },
      ...pairH({ type: 'bumper', x: -3, y: 2.6, r: 0.5, power: 9 }),
      ...pairH({ type: 'bumper', x: -6, y: 3.6, r: 0.45, power: 9 }),
    ],
  },
  {
    name: 'Glitch in the Grid', theme: 'neon', bgVariant: 2,
    arena: {
      deathY: -6,
      boxes: [slab(-11, 11, 0, 1, 'neon'), wall(-11.25, 0, 6.5, 0.5, 'neon'), wall(11.25, 0, 6.5, 0.5, 'neon'), ...sym(box(-11, -10.2, 0, 2.2, 'metal'))],
    },
    player: { x: -5.5 },
    enemies: [{ type: 'glitch', x: 5 }],
    hazards: [SPEARS, ...pairH({ type: 'lasergate', x: -9.6, y0: 0, y1: 2.8, period: 4, duty: 0.3, damage: 10 })],
  },
  {
    // claw machine: belts on the floor run inward, belts on the shelves run outward, the claw drops prizes in the middle
    name: 'Prize Belt', theme: 'neon', bgVariant: 1, hpScale: 1.1,
    arena: {
      deathY: -6,
      boxes: [slab(-9.5, 9.5, 0, 1, 'metal'), ...sym(box(-7.5, -2.5, 2.4, 2.7, 'neon'), wall(-9.25, 0, 5, 0.5, 'neon'))],
    },
    player: { x: -8.3 },
    enemies: [{ type: 'robo_waiter', x: 8.3 }, { type: 'neon_punk', x: 7.9 }],
    hazards: [
      ...pairH({ type: 'conveyor', x: -4.5, y: 0.12, w: 5, h: 0.24, speed: 1.2 }),
      ...pairH({ type: 'conveyor', x: -5, y: 2.82, w: 5, h: 0.24, speed: -1.2 }),
      { type: 'dropper', x: 0, y: 8, every: 5, items: ['katana', 'crate', 'mace', 'crate', 'double_sword'], max: 3 },
    ],
  },
  {
    // dance floor: shock tiles light up in a rolling pattern under a spinning spiked disco ball
    name: 'Electric Slide', theme: 'neon', bgVariant: 2, hpScale: 1.12,
    arena: {
      deathY: -6,
      boxes: [slab(-10, 10, 0, 1, 'neon'), box(-0.5, 0.5, 6, 6.3, 'metal'), ...sym(box(-10, -8.8, 0, 0.8, 'metal'), wall(-9.75, 0.8, 3.5, 0.5, 'neon'))],
    },
    player: { x: -8 },
    enemies: [{ type: 'arcade_champ', x: 8 }, { type: 'neon_punk', x: 9.2 }],
    hazards: [
      { type: 'shock', x: 0, y: 0, w: 2.2, period: 4, duty: 0.25, phase: 0, damage: 8 },
      ...pairH({ type: 'shock', x: -2.4, y: 0, w: 2.2, period: 4, duty: 0.25, phase: 0.33, damage: 8 }),
      ...pairH({ type: 'shock', x: -4.8, y: 0, w: 2.2, period: 4, duty: 0.25, phase: 0.66, damage: 8 }),
      { type: 'spikeball', x: 0, y: 4.2, r: 0.5, speed: 3, damage: 12, arm: 1.6, orbit: 1.2 },
    ],
  },
  {
    // rooftops over the city: elevators rise out of the alleys to a lasered billboard roof in the middle
    name: 'Billboard Jump', theme: 'neon', bgVariant: 0, hpScale: 1.15,
    arena: {
      deathY: -7,
      boxes: [slab(-2.6, 2.6, 1.2, 5.2, 'neon'), ...sym(slab(-10, -5.8, 0, 4, 'metal'), box(-5.8, -2.6, -3.2, -2.2, 'metal'), wall(-9.75, 0, 3, 0.5, 'neon'))],   // alley floors: fall in, ride back up
    },
    player: { x: -7.5 },
    enemies: [{ type: 'neon_punk', x: 7.5 }, { type: 'arcade_champ', x: 9 }],
    loose: [{ id: 'thunder_hammer', x: -1.6, y: 1.5 }, { id: 'thunder_hammer', x: 1.6, y: 1.5 }],
    hazards: [
      { type: 'lasergate', x: 0, y0: 1.2, y1: 3.6, period: 3.5, duty: 0.4, damage: 10 },
      ...pairH({ type: 'mover', x: -4.2, y: -2.35, w: 1.6, h: 0.3, to: [-4.2, 1.05], period: 6 }),
    ],
  },
  {
    // TILT: one long seesaw stage over electrified floor, lasers at the edges of the player booths
    name: 'Tilt!', theme: 'neon', bgVariant: 1, hpScale: 1.18,
    arena: {
      deathY: -6,
      boxes: [slab(-10, 10, 0, 1, 'metal'), ...sym(box(-10, -6.2, 0, 1.0, 'neon'), wall(-9.75, 1.0, 3.5, 0.5, 'neon'))],
    },
    player: { x: -8.6 },
    enemies: [{ type: 'robo_waiter', x: 8.6 }, { type: 'neon_punk', x: 9.2 }],
    loose: [{ id: 'chain_mace', x: -7.2 }, { id: 'chain_mace', x: 7.2 }],
    hazards: [
      { type: 'seesaw', x: 0, y: 1.3, w: 10.4, h: 0.35, limit: 0.22, post: 1.3 },
      ...pairH({ type: 'shock', x: -3.6, y: 0, w: 4, period: 4, duty: 0.4, damage: 8 }),
      ...pairH({ type: 'lasergate', x: -6.5, y0: 1.0, y1: 3.2, period: 4, duty: 0.3, damage: 10 }),
    ],
  },
  {
    name: 'Mecha Mozzarella', theme: 'boss_neon', bgVariant: 0,
    arena: {
      deathY: -6,
      boxes: [slab(-12, 12, 0, 1, 'neon'), wall(-12.3, 0, 7, 0.6, 'metal'), wall(12.3, 0, 7, 0.6, 'metal'), ...sym(box(-11.5, -9.5, 6.4, 6.7, 'neon'))],
    },
    player: { x: -5.5 },
    enemies: [{ type: 'mecha_mozza', x: 5 }],
    hazards: [
      SPEARS,
      ...pairH({ type: 'bumper', x: -11.3, y: 1.2, r: 0.6, power: 10 }),
      ...pairH({ type: 'bumper', x: -10.6, y: 3.4, r: 0.5, power: 9 }),
      ...pairH({ type: 'shock', x: -10.9, y: 0, w: 2.2, period: 5, duty: 0.3, damage: 8 }),
    ],
  },

  // ------------------------------------------------------------------ Act 10 · space: low gravity, rotors, airlock pistons, shock floors, bumpers
  {
    // station lounge with a low-gravity bubble in the middle: jumps there float
    name: 'Moon Bounce', theme: 'space', bgVariant: 0, hpScale: 1.0,
    arena: {
      deathY: -6,
      boxes: [slab(-9, 9, 0, 1, 'hull'), ...sym(wall(-8.75, 0, 3.5, 0.5, 'hull'))],
    },
    player: { x: -6 },
    enemies: [{ type: 'astro_cook', x: 6 }],
    loose: [{ id: 'mace', x: -3 }, { id: 'mace', x: 3 }],
    hazards: [{ type: 'lowgrav', x: 0, y: 3, w: 4, h: 6, scale: 0.35 }],
  },
  {
    // the floor hatch slides open every few seconds, dropping whoever stands on it into a live airlock chamber;
    // wall pistons shove everyone toward it
    name: 'Airlock', theme: 'space', bgVariant: 1, hpScale: 1.02,
    arena: {
      deathY: -7,
      boxes: [box(-1.2, 1.2, -3.4, -2.4, 'metal'), ...sym(slab(-9, -1.2, 0, 3.4, 'hull'), wall(-8.75, 0, 3.5, 0.5, 'hull'))],
    },
    player: { x: -4.2 },
    enemies: [{ type: 'alien_grunt', x: 4.2 }],
    loose: [{ id: 'kanabo', x: -6.5 }, { id: 'kanabo', x: 6.5 }],
    hazards: [
      { type: 'shock', x: 0, y: -2.4, w: 2.2, period: 3, duty: 0.5, damage: 8 },
      ...pairH({ type: 'mover', x: -0.6, y: -0.15, w: 1.2, h: 0.3, to: [-1.8, -0.15], period: 8 }),
      ...pairH({ type: 'piston', x: -8.0, y: 0.9, w: 1.0, h: 1.2, dir: 'right', stroke: 1.8, period: 3.4 }),
    ],
  },
  {
    // a cross of spinning girders turns over a pit whose floor is electrified: ride the arms across
    name: 'Centrifuge', theme: 'space', bgVariant: 2, hpScale: 1.04,
    arena: {
      deathY: -6,
      boxes: [box(-3.4, 3.4, -3, -2, 'metal'), ...sym(slab(-10, -3.4, 0, 3, 'hull'), wall(-9.75, 0, 3.5, 0.5, 'hull'))],
    },
    player: { x: -7 },
    enemies: [{ type: 'cyborg_chef', x: 7 }, { type: 'astro_cook', x: 9 }],
    hazards: [
      { type: 'shock', x: 0, y: -2, w: 6.6, period: 3, duty: 0.5, damage: 8 },
      { type: 'rotor', x: 0, y: -0.2, w: 6.4, h: 0.3, speed: 0.6 },
      { type: 'rotor', x: 0, y: -0.2, w: 6.4, h: 0.3, speed: 0.6, angle: 1.5708 },
    ],
  },
  {
    // a tall maintenance shaft in low gravity: float up past bumpers to the ledges where the prize flails wait
    name: 'Low-G Shaft', theme: 'space', bgVariant: 0, hpScale: 1.07,
    arena: {
      deathY: -6,
      boxes: [slab(-6.5, 6.5, 0, 1, 'hull'), box(-1.2, 1.2, 5.8, 6.1, 'metal'),
        ...sym(box(-6.5, -4.6, 3.0, 3.3, 'metal'), box(-6.5, -4.6, 8.3, 8.6, 'metal'), wall(-6.75, 0, 11, 0.5, 'hull'))],
    },
    player: { x: -3.8 },
    enemies: [{ type: 'alien_grunt', x: 3.8 }, { type: 'cyborg_chef', x: 0 }],
    loose: [{ id: 'morning_star', x: -5.5, y: 8.9 }, { id: 'morning_star', x: 5.5, y: 8.9 }],
    hazards: [
      { type: 'lowgrav', x: 0, y: 5.5, w: 13, h: 11, scale: 0.4 },
      ...pairH({ type: 'bumper', x: -2.8, y: 4.5, r: 0.45, power: 8 }),
    ],
  },
  {
    name: 'Gravity Well', theme: 'space', bgVariant: 2,
    arena: {
      deathY: -6,
      boxes: [slab(-11, 11, 0, 1, 'metal'), wall(-11.25, 0, 7, 0.5, 'hull'), wall(11.25, 0, 7, 0.5, 'hull'), ...sym(box(-11, -9.6, 0, 0.6, 'metal'))],
    },
    player: { x: -5.5 },
    enemies: [{ type: 'zero_g', x: 5 }],
    hazards: [SPEARS, ...pairH({ type: 'rotor', x: -10.2, y: 3.8, w: 1.8, h: 0.2, speed: 4 })],   // vent fans high on the walls
  },
  {
    // two station modules with open space between them; the gap is a low-gravity field with a slow solar panel turning in it
    name: 'Space Walk', theme: 'space', bgVariant: 1, hpScale: 1.1,
    arena: {
      deathY: -8,
      boxes: [box(-1.6, 1.6, -4.5, -3.5, 'metal'), ...sym(slab(-10, -1.6, 0, 4.5, 'hull'), wall(-9.75, 0, 3.5, 0.5, 'hull'))],   // safety net under the gap
    },
    player: { x: -6.5 },
    enemies: [{ type: 'astro_cook', x: 6.5 }, { type: 'alien_grunt', x: 3.4 }],
    loose: [{ id: 'sword', x: -4.5 }, { id: 'sword', x: 4.5 }],
    hazards: [
      { type: 'lowgrav', x: 0, y: 1.5, w: 6, h: 10, scale: 0.3 },
      { type: 'rotor', x: 0, y: 1.6, w: 2.6, h: 0.25, speed: 1 },
    ],
  },
  {
    // reactor core: two counter-rotating arms sweep around a glowing core, live floor panels either side
    name: 'Reactor Core', theme: 'space', bgVariant: 2, hpScale: 1.12,
    arena: {
      deathY: -6,
      boxes: [slab(-10, 10, 0, 1, 'metal'), box(-1, 1, 0, 1.2, 'neon'), ...sym(box(-6.8, -4.2, 2.6, 2.9, 'metal'), wall(-9.75, 0, 3.5, 0.5, 'hull'))],
    },
    player: { x: -8.2 },
    enemies: [{ type: 'cyborg_chef', x: 8.2 }, { type: 'alien_grunt', x: 5.5 }],
    loose: [{ id: 'great_axe', x: -4.6, y: 3.2 }, { id: 'great_axe', x: 4.6, y: 3.2 }],
    hazards: [
      { type: 'rotor', x: 0, y: 2.2, w: 5, h: 0.3, speed: 1.1 },
      { type: 'rotor', x: 0, y: 4.6, w: 5, h: 0.3, speed: -0.9 },
      ...pairH({ type: 'shock', x: -2.3, y: 0, w: 2.4, period: 3.5, duty: 0.4, damage: 8 }),
    ],
  },
  {
    // a low-gravity cargo hold full of floating bumper asteroids; the loader keeps dumping crates into the middle
    name: 'Asteroid Belt', theme: 'space', bgVariant: 0, hpScale: 1.15,
    arena: {
      deathY: -6,
      boxes: [slab(-9.5, 9.5, 0, 1, 'hull'), ...sym(wall(-9.25, 0, 6, 0.5, 'hull'))],
    },
    player: { x: -7 },
    enemies: [{ type: 'astro_cook', x: 7 }, { type: 'alien_grunt', x: 8.8 }],
    hazards: [
      { type: 'lowgrav', x: 0, y: 4, w: 18.5, h: 8, scale: 0.45 },
      { type: 'bumper', x: 0, y: 3.8, r: 0.6, power: 8 },
      ...pairH({ type: 'bumper', x: -3.6, y: 2.6, r: 0.5, power: 8 }),
      ...pairH({ type: 'bumper', x: -5.8, y: 5, r: 0.5, power: 8 }),
      { type: 'dropper', x: 0, y: 9, every: 4.5, items: ['crate', 'crate', 'morning_star', 'crate'], max: 4 },
    ],
  },
  {
    // docking clamps shuttle between the outer modules and a live centre hub over open space; airlock rams at the walls
    name: 'Docking Clamps', theme: 'space', bgVariant: 1, hpScale: 1.18,
    arena: {
      deathY: -8,
      boxes: [slab(-1.4, 1.4, 0, 3.6, 'hull'), ...sym(slab(-10, -5, 0, 3.6, 'hull'), box(-5, -1.4, -3.6, -2.6, 'metal'), wall(-9.75, 0, 3.5, 0.5, 'hull'))],   // service decks under the clamp gaps
    },
    player: { x: -6.2 },
    enemies: [{ type: 'cyborg_chef', x: 6.2 }, { type: 'alien_grunt', x: 5.6 }],
    hazards: [
      ...pairH({ type: 'mover', x: -4.2, y: -0.15, w: 1.6, h: 0.3, to: [-2.2, -0.15], period: 5 }),
      { type: 'shock', x: 0, y: 0, w: 2.6, period: 4.5, duty: 0.3, damage: 8 },
      ...pairH({ type: 'shock', x: -3.2, y: -2.6, w: 3.4, period: 3.5, duty: 0.4, damage: 8 }),
      ...pairH({ type: 'piston', x: -9.0, y: 0.9, w: 1.0, h: 1.2, dir: 'right', stroke: 1.6, period: 3.2 }),
    ],
  },
  {
    name: 'Emperor Crust', theme: 'boss_space', bgVariant: 0,
    arena: {
      deathY: -6,
      boxes: [slab(-12, 12, 0, 1, 'hull'), wall(-12.3, 0, 7.5, 0.6, 'hull'), wall(12.3, 0, 7.5, 0.6, 'hull'), ...sym(box(-12, -8.6, 7.5, 7.8, 'metal'))],
    },
    player: { x: -5.5 },
    enemies: [{ type: 'emperor_crust', x: 5 }],
    hazards: [
      SPEARS,
      ...pairH({ type: 'lowgrav', x: -10.3, y: 3.5, w: 3.4, h: 7, scale: 0.4 }),   // low-gravity side pockets
      ...pairH({ type: 'bumper', x: -11.4, y: 4.4, r: 0.5, power: 9 }),
    ],
  },
];
