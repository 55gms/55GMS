// Levels 181-250, part 1: 30 brand-new levels in the original's style (DESIGN.md §14 patterns).
// Same level-def shape as src/levels-ours.js. Composed into LEVELS by src/levels.js (see EXTRA_* there):
// NEW_LEVELS[idx] fills the EXTRA_PLAN slot with kind 'new' and that idx (never hardcode level numbers here).
// idx 0-3 foundry · 4-7 freezer · 8-11 docks · 12-16 volcano · 17-20 sky · 21-24 neon · 25-29 space.
//
// Late game: every level combines 2-3 mechanisms and 2-3 late-act enemies; hpScale ramps 1.2 -> 1.5 across the 30
// (game.js still applies LATE_NERF, and in multi-enemy fights only the toughest bot keeps its weapon).
// Spawns on props / mechanisms use `yAbs` (exact feet height). Geometry stays mirror-symmetric (2P arenas).

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
  else if (typeof h.dir === 'number') m.dir = Math.PI - h.dir;
  for (const k of ['speed', 'orbit', 'fx', 'amp', 'angle']) if (typeof h[k] === 'number') m[k] = -h[k];
  if (typeof h.x0 === 'number') { m.x0 = -h.x1; m.x1 = -h.x0; }
  if (dPhase) m.phase = (h.phase || 0) + dPhase;
  return m;
};
/** a hazard and its mirror image */
const pairH = (h, dPhase) => [h, mirrorH(h, dPhase)];
/** a bot that spawns holding on to the mechanism it rides, until the player is close or 14 s pass */
const RIDE = { grabOnStart: true, grabTime: 14, grabRelease: 1.6 };
/** the original's arena ends: a floating pillar at each end with a trigger piston in front that punts fighters back in.
 *  xp = left piston centre (negative); floors should end around xp - 0.6. y = floor top under it. */
const edges = (xp, y = 0) => ({
  boxes: sym(box(xp - 1.37, xp - 0.33, y + 0.54, y + 1.58, 'pillar')),
  hazards: pairH({ type: 'piston', x: xp, y: y + 1.06, w: 0.64, h: 1.61, dir: 'right', stroke: 1.44, period: 3, trigger: true, launch: 11 }),
});
/** hpScale for NEW_LEVELS[idx]: 1.2 at the first new level -> 1.5 at the last */
const hp = (idx) => r2(1.2 + (idx * 0.3) / 29);

export const NEW_LEVELS = [
  // ------------------------------------------------------------------ foundry block (idx 0-3)
  {
    // two slag buckets run along an overhead rail across the slag pit, chains hanging under them; one carries a bot.
    // Ride a chain over, or climb out of the slag onto the middle island where the halberd lies
    name: 'Slag Ferry', theme: 'foundry', bgVariant: 0, hpScale: hp(0),
    arena: {
      deathY: -6,
      boxes: [...sym(slab(-8.2, -3.2, 0, 2, 'metal')), box(-3.2, 3.2, -2.4, -2), box(-0.7, 0.7, -2, 0.3, 'metal'), ...edges(-7.6).boxes],
    },
    player: { x: -6.2 },   // spawns stay >= 1.4 m in front of an edges() piston: its trigger zone punts anyone standing in it
    enemies: [{ type: 'grill_master', x: 6.2 }, { type: 'robo_waiter', x: 4.9, yAbs: 3.57, ...RIDE }],
    loose: [{ id: 'halberd', x: 0, y: 0.6 }, { id: 'katana', x: -5.8 }, { id: 'katana', x: 5.8 }],
    hazards: [
      { type: 'lava', x: 0, y: -1.5, w: 6.4, damage: 9 },
      ...pairH({ type: 'mover', x: -4.9, y: 3.4, w: 1.5, h: 0.3, to: [-1.3, 3.4], period: 8, rope: 1.9 }),
      ...pairH({ type: 'barrel', x: -3.7, y: 0.45, power: 10, damage: 22 }),
      ...edges(-7.6).hazards,
    ],
  },
  {
    // a heavy free-spinning flywheel is the only bridge: step on one side and it rolls you toward the cracks beside it
    name: 'Flywheel', theme: 'foundry', bgVariant: 1, hpScale: hp(1),
    // 0.8 m cracks down to a spiked floor you can climb out of (narrower cracks wedged bodies and flung them; a bottomless
    // pit made the bots fall to their deaths on their own)
    arena: { deathY: -6, boxes: [...sym(box(-8, -2.15, -3.3, 0, 'metal')), box(-2.15, 2.15, -3.3, -2.7, 'metal'), ...edges(-7.4).boxes] },
    player: { x: -6 },
    enemies: [{ type: 'magma_brute', x: 6 }, { type: 'grill_master', x: 0, yAbs: 1.02 }],
    loose: [{ id: 'sword', x: -4.8 }, { id: 'sword', x: 4.8 }],
    hazards: [
      { type: 'wheel', x: 0, y: -0.35, r: 1.35, mode: 'free', teeth: 18, mass: 300 },
      ...pairH({ type: 'spikes', x: -1.75, y: -2.7, w: 0.8, damage: 7 }),   // low: a 0.8 m crack keeps re-launching you onto them
      ...pairH({ type: 'block', x: -3.0, y: 0.35, w: 0.7, h: 0.7, style: 'metal' }),
      ...pairH({ type: 'barrel', x: -4.1, y: 0.45, power: 10, damage: 22 }),
      ...edges(-7.4).hazards,
    ],
  },
  {
    // the end walls are compactor rams: every 9 s they slam everything toward the middle, where a saw trench hides
    // under one loose plank. Scrap blocks (one with a bot on it) and kegs get shoved along too
    name: 'Scrap Compactor', theme: 'foundry', bgVariant: 2, hpScale: hp(2),
    arena: {
      deathY: -6,
      boxes: [...sym(box(-7.2, -0.9, -2.6, 0, 'metal'), box(-7.8, -7.2, 0, 3.4, 'metal')), box(-0.9, 0.9, -2.6, -2.0, 'metal')],
    },
    player: { x: -3.4 },
    enemies: [{ type: 'viking', x: 3.6 }, { type: 'robo_waiter', x: 2.0, yAbs: 0.82 }],
    loose: [{ id: 'executioner', x: -4.8 }, { id: 'executioner', x: 4.8 }],
    hazards: [
      { type: 'blade', x: 0, y: -1.25, r: 0.6, speed: 14, damage: 14 },
      { type: 'spikes', x: 0, y: -2.0, w: 1.8, damage: 12 },
      { type: 'block', x: 0, y: 0.1, w: 2.6, h: 0.2, style: 'plank', mass: 12 },
      ...pairH({ type: 'block', x: -2.0, y: 0.4, w: 0.8, h: 0.8, style: 'metal' }),
      ...pairH({ type: 'barrel', x: -5.6, y: 0.45, power: 10, damage: 22 }),
      ...pairH({ type: 'piston', x: -6.8, y: 1.0, w: 0.8, h: 2.0, dir: 'right', stroke: 2.0, period: 9, phase: 0.66 }),
    ],
  },
  {
    // a blast furnace: treads on its roof run outward and dump riders off the edges, right into the fire jets at its feet
    name: 'Blast Furnace', theme: 'foundry', bgVariant: 0, hpScale: hp(3),
    arena: {
      deathY: -6,
      boxes: [slab(-8, 8, 0, 1, 'metal'), box(-1.95, 1.95, 0, 1.6, 'metal'), box(-0.35, 0.35, 1.6, 2.25, 'metal'), ...edges(-7.4).boxes],
    },
    player: { x: -5.6 },
    enemies: [{ type: 'cyborg_chef', x: 5.6 }, { type: 'grill_master', x: 0, yAbs: 2.27 }],
    loose: [{ id: 'scythe', x: -4.8 }, { id: 'scythe', x: 4.8 }],
    hazards: [
      ...pairH({ type: 'track', x: -1.15, y: 2.2, length: 1.0, r: 0.3, speed: -0.8 }),
      ...pairH({ type: 'firejet', x: -2.6, y: 0, dir: 'up', len: 2.6, period: 4.5, duty: 0.3, phase: 0.5, damage: 10 }),
      ...pairH({ type: 'barrel', x: -4.0, y: 0.45, power: 10, damage: 22 }),
      ...edges(-7.4).hazards,
    ],
  },

  // ------------------------------------------------------------------ freezer block (idx 4-7)
  {
    // an ice rink with a spiked hole in the middle: slide the heavy stones in to bridge it, or slide the bots in.
    // Bumpers at the boards send everything back
    name: 'Curling Rink', theme: 'freezer', bgVariant: 1, hpScale: hp(4),
    arena: {
      deathY: -6,
      // the hole is 2.4 m wide with spikes only in its middle: a 1.3 m all-spike hole juggled fighters to death
      boxes: [...sym(slab(-7, -1.2, 0, 1.2, 'ice'), wall(-7.25, 0, 3, 0.5, 'metal')), box(-1.2, 1.2, -1.7, -1.2, 'metal'), box(-2.4, 2.4, 5.5, 5.8, 'metal')],
    },
    player: { x: -4.6 },
    enemies: [{ type: 'ice_brute', x: 4.6 }, { type: 'penguin_waiter', x: 2.6, yAbs: 0.62 }],
    loose: [{ id: 'frost_scythe', x: -3.6 }, { id: 'frost_scythe', x: 3.6 }],
    hazards: [
      { type: 'spikes', x: 0, y: -1.2, w: 0.8, damage: 10 },
      ...pairH({ type: 'block', x: -2.6, y: 0.3, w: 0.8, h: 0.6, style: 'metal', mass: 30, friction: 0.05 }),
      ...pairH({ type: 'bumper', x: -6.4, y: 0.6, r: 0.45, power: 9 }),
      ...pairH({ type: 'icicle', x: -1.2, y: 5.5, every: 4, damage: 14 }, 0.5),
    ],
  },
  {
    // snow cannons: angled trigger pistons on both banks fire you over the crevasse onto the ice mesa, under the icicles
    name: 'Snow Cannons', theme: 'freezer', bgVariant: 2, hpScale: hp(5),
    arena: {
      deathY: -7,
      boxes: [...sym(box(-8, -3, -3, 0, 'rock'), wall(-8.25, 0, 3, 0.5, 'metal')), box(-1.6, 1.6, -3, 1.0, 'ice'), box(-3, 3, -3.4, -3), box(-1.8, 1.8, 6.5, 6.8, 'ice')],
    },
    player: { x: -6.4 },
    enemies: [{ type: 'frost_cook', x: 6.4 }, { type: 'ice_brute', x: 0, yAbs: 1.02 }],
    loose: [{ id: 'morning_star', x: -7.3 }, { id: 'morning_star', x: 7.3 }, { id: 'halberd', x: -1.0, y: 1.3 }, { id: 'halberd', x: 1.0, y: 1.3 }],
    hazards: [
      ...pairH({ type: 'piston', x: -4.3, y: 0.35, w: 0.9, h: 0.5, dir: 0.9, angle: 0.9, stroke: 0.8, period: 3, trigger: true, launch: 9 }),
      ...pairH({ type: 'spikes', x: -2.3, y: -3, w: 1.3, damage: 12 }),
      ...pairH({ type: 'icicle', x: -1.0, y: 6.5, every: 3.6, damage: 14 }, 0.5),
    ],
  },
  {
    // the middle floor is two ice hatches that crack under you; below them bounce pads fling you back up (miss them and
    // it's the spikes). Icicles keep falling on the hatches
    name: 'Ice Hatch', theme: 'freezer', bgVariant: 0, hpScale: hp(6),
    arena: {
      deathY: -6,
      boxes: [...sym(box(-7.6, -4.2, -3, 0, 'ice')), box(-4.2, 4.2, -3, -2.4, 'metal'), box(-0.75, 0.75, -2.4, 0, 'ice'), box(-3.6, 3.6, 6, 6.3, 'metal'), ...edges(-7.0).boxes],
    },
    player: { x: -5.6 },
    enemies: [{ type: 'penguin_waiter', x: 5.6 }, { type: 'ice_brute', x: 0, yAbs: 0.02 }],
    loose: [{ id: 'buzz_saw', x: -4.8 }, { id: 'buzz_saw', x: 4.8 }],
    hazards: [
      ...pairH({ type: 'crumble', x: -2.475, y: 0, w: 3.45, h: 0.35, delay: 0.7, respawn: 4 }),
      ...pairH({ type: 'bouncer', x: -2.475, y: -2.4, w: 1.8, power: 11 }),
      ...pairH({ type: 'spikes', x: -3.8, y: -2.4, w: 0.7, damage: 12 }),
      ...pairH({ type: 'spikes', x: -1.15, y: -2.4, w: 0.7, damage: 12 }),
      ...pairH({ type: 'icicle', x: -2.5, y: 6, every: 4.2, damage: 14 }, 0.5),
      ...edges(-7.0).hazards,
    ],
  },
  {
    // two snowplough blades back to back in the middle of the rink push outward, sweeping everything on the ice into the
    // gaps in front of the end ledges. Jump the blade, or ride it (both carry a bot)
    name: 'Snowplough', theme: 'freezer', bgVariant: 1, hpScale: hp(7),
    arena: {
      deathY: -6,
      boxes: [slab(-5.6, 5.6, 0, 1, 'ice'), ...sym(slab(-7.8, -6.5, 0, 1, 'metal'), wall(-8.05, 0, 3, 0.5, 'metal'))],
    },
    player: { x: -7.15 },
    enemies: [{ type: 'ice_brute', x: 7.15 }, { type: 'frost_cook', x: 0.72, yAbs: 1.04, ...RIDE }, { type: 'penguin_waiter', x: -0.72, yAbs: 1.04, ...RIDE }],
    loose: [{ id: 'gravity_mace', x: -2.6 }, { id: 'gravity_mace', x: 2.6 }],
    hazards: [
      ...pairH({ type: 'mover', x: -0.72, y: 0.52, w: 1.2, h: 1.0, to: [-4.4, 0.52], period: 8 }),
    ],
  },

  // ------------------------------------------------------------------ docks block (idx 8-11)
  {
    // two paddle wheels churn between the piers and a moored boat; their tops roll you toward the boat and their inner
    // sides pull you under
    name: 'Paddle Steamer', theme: 'docks', bgVariant: 2, hpScale: hp(8),
    arena: {
      deathY: -2.4,
      boxes: [...sym(slab(-8, -5, 0, 0.6, 'wood'), box(-6.65, -6.35, -3, -0.6, 'wood'), wall(-8.25, 0, 3, 0.5, 'wood'))],
    },
    player: { x: -6.4 },
    enemies: [{ type: 'deckhand', x: 6.4 }, { type: 'diver', x: 0, yAbs: 0.1 }],
    loose: [{ id: 'meteor_flail', x: -5.6 }, { id: 'meteor_flail', x: 5.6 }],
    hazards: [
      { type: 'water', x0: -14, x1: 14, y: -1.2 },
      ...pairH({ type: 'wheel', x: -3.5, y: -0.6, r: 1.2, mode: 'motor', speed: -0.9, teeth: 10 }),
      { type: 'boat', x: 0, y: 0, w: 4.2, h: 0.5, amp: 0.05, bob: 0.1, period: 3.8 },
      ...pairH({ type: 'barrel', x: -1.3, y: 0.5, power: 10, damage: 22 }),
    ],
  },
  {
    // bounce-pad buoys are the only way from the piers to the lighthouse rock; a cargo crate swings across the bounce arcs
    name: 'Buoy Bounce', theme: 'docks', bgVariant: 0, hpScale: hp(9),
    arena: {
      deathY: -2.4,
      boxes: [box(-0.9, 0.9, -3, 0.4, 'rock'), ...sym(slab(-8, -4.4, 0, 0.6, 'wood'), box(-6.65, -6.35, -3, -0.6, 'wood'), box(-3.3, -2.1, -3, -0.6, 'metal'), wall(-8.25, 0, 3.5, 0.5, 'wood'))],
    },
    player: { x: -6.4 },
    enemies: [{ type: 'pirate_chef', x: 6.4 }, { type: 'diver', x: 0 }],
    loose: [{ id: 'double_sword', x: -5.7 }, { id: 'double_sword', x: 5.7 }],
    hazards: [
      { type: 'water', x0: -14, x1: 14, y: -1.2 },
      ...pairH({ type: 'bouncer', x: -2.7, y: -0.6, w: 1.2, power: 9 }),
      { type: 'swinger', x: 0, y: 6.9, chain: 3.6, r: 0.5, amp: 0.7, period: 3.8, damage: 12, look: 'crate' },
    ],
  },
  {
    // two anchors swing from the bows of facing ships and crash together over the rocking boat between them; a bot
    // rides one. Anchors are grabbable: swing across on them
    name: 'Anchors Aweigh', theme: 'docks', bgVariant: 1, hpScale: hp(10),
    arena: {
      deathY: -2.4,
      boxes: [...sym(box(-8, -3.6, -3, 1.4, 'hull'), wall(-8.25, 1.4, 4.4, 0.5, 'wood'))],
    },
    player: { x: -7.3 },   // behind the anchors' reach: their return swing sweeps the deck edge at head height
    enemies: [{ type: 'pirate_chef', x: 7.3 }, { type: 'deckhand', x: 6.34, yAbs: 3.44, ...RIDE }, { type: 'diver', x: 0, yAbs: 0.1 }],
    loose: [{ id: 'dual_scythe', x: -7.4, y: 1.65 }, { id: 'dual_scythe', x: 7.4, y: 1.65 }],
    hazards: [
      { type: 'water', x0: -14, x1: 14, y: -1.2 },
      { type: 'boat', x: 0, y: 0, w: 5.6, h: 0.5, amp: 0.05, bob: 0.12, period: 3.4 },
      // anchors bottom out 2.6 m above the boat deck: lower, they pinched fighters against the kinematic boat and flung them
      ...pairH({ type: 'pendulum', x: -3.4, y: 7.2, chain: 3.6, r: 0.5, mass: 35, amp: -0.8 }),
    ],
  },
  {
    // two powder rafts loaded with kegs rock beside a piling; kegs hang from the crane beam above. One good hit
    // sets off the lot
    name: 'Powder Barge', theme: 'docks', bgVariant: 2, hpScale: hp(11),
    arena: {
      deathY: -2.4,
      boxes: [box(-0.6, 0.6, -3, 0.1, 'wood'), box(-3, 3, 6.3, 6.6, 'metal'), ...sym(slab(-8, -5, 0, 0.6, 'wood'), box(-6.65, -6.35, -3, -0.6, 'wood'), wall(-8.25, 0, 3, 0.5, 'wood'))],
    },
    player: { x: -6.4 },
    enemies: [{ type: 'deckhand', x: 6.4 }, { type: 'pirate_chef', x: 0, yAbs: 0.12 }, { type: 'diver', x: 1.4, yAbs: 0.1 }],
    loose: [{ id: 'great_axe', x: -5.6 }, { id: 'great_axe', x: 5.6 }],
    hazards: [
      { type: 'water', x0: -14, x1: 14, y: -1.2 },
      ...pairH({ type: 'boat', x: -2.3, y: 0, w: 3.0, h: 0.45, amp: 0.07, bob: 0.12, period: 3.2 }, 0.5),
      ...pairH({ type: 'barrel', x: -2.5, y: 0.5, power: 10, damage: 20 }),
      ...pairH({ type: 'barrel', x: -3.3, y: 0.5, power: 10, damage: 20 }),
      ...pairH({ type: 'jar', x: -1.4, y: 6.3, chain: 2.8, power: 9, damage: 18 }),
    ],
  },

  // ------------------------------------------------------------------ volcano block (idx 12-16)
  {
    // basalt rafts bob on a lava lake between the ledges and a rock pillar; fire spouts up through the gaps you jump
    name: 'Lava Rafts', theme: 'volcano', bgVariant: 0, hpScale: hp(12),
    arena: {
      deathY: -6,
      boxes: [box(-0.6, 0.6, -1.3, 0.5, 'rock'), ...sym(slab(-8, -4.5, 0, 2, 'rock'), wall(-8.25, 0, 3, 0.5, 'rock'))],
    },
    player: { x: -6.2 },
    enemies: [{ type: 'fire_dancer', x: 6.2 }, { type: 'grill_master', x: 2.3, yAbs: 0.1 }],
    loose: [{ id: 'dragon_blade', x: 0, y: 0.8 }, { id: 'chain_mace', x: -7.2 }, { id: 'chain_mace', x: 7.2 }],
    hazards: [
      { type: 'lava', x: 0, y: -0.8, w: 9, damage: 9 },
      ...pairH({ type: 'boat', x: -2.3, y: 0, w: 2.6, h: 0.4, amp: 0.08, bob: 0.18, period: 3 }, 0.5),
      ...pairH({ type: 'firejet', x: -4.05, y: -0.8, dir: 'up', len: 3, period: 4, duty: 0.3, phase: 0.2, damage: 10 }, 0.5),
    ],
  },
  {
    // geysers: shelves of rock high over a floor of lava pools; steam vents between the shelves blow you up to them
    name: 'Geyser Field', theme: 'volcano', bgVariant: 1, hpScale: hp(13),
    arena: {
      deathY: -6,
      boxes: [slab(-7.5, 7.5, 0, 1, 'rock'), box(-2, 2, 3.4, 3.8, 'rock'), ...sym(box(-7.5, -4.4, 3.4, 3.8, 'rock'), wall(-7.75, 0, 5.5, 0.5, 'rock'))],
    },
    player: { x: -6 },
    enemies: [{ type: 'grill_master', x: 6 }, { type: 'fire_dancer', x: 0 }],
    loose: [{ id: 'meteor_flail', x: -1.2 }, { id: 'meteor_flail', x: 1.2 }],
    hazards: [
      ...pairH({ type: 'lava', x: -5.9, y: 0.05, w: 2.2, damage: 8 }),
      { type: 'lava', x: 0, y: 0.05, w: 1.6, damage: 8 },
      ...pairH({ type: 'wind', x: -3.2, y: 3.1, w: 1.6, h: 6.2, fx: 0, fy: 18, period: 5, duty: 0.35, phase: 0 }, 0.5),
    ],
  },
  {
    // a rope bridge over a lava pit with fire jets roaring up through it in a wave; kegs wait on both banks
    name: 'Firewalk Bridge', theme: 'volcano', bgVariant: 2, hpScale: hp(14),
    arena: {
      deathY: -6,
      boxes: [...sym(slab(-8, -3.6, 0, 3.2, 'rock'), wall(-8.25, 0, 3, 0.5, 'rock'))],
    },
    player: { x: -6 },
    enemies: [{ type: 'magma_brute', x: 6 }, { type: 'fire_dancer', x: 1.0, yAbs: -0.3 }],
    loose: [{ id: 'dragon_blade', x: -5 }, { id: 'dragon_blade', x: 5 }],
    hazards: [
      { type: 'lava', x: 0, y: -2.6, w: 7.2, damage: 9 },
      { type: 'bridge', x0: -3.6, x1: 3.6, y: -0.08, segments: 16, sag: 0.35 },
      ...pairH({ type: 'firejet', x: -1.8, y: -2.6, dir: 'up', len: 3.4, period: 4, duty: 0.3, phase: 0.25, damage: 10 }),
      { type: 'firejet', x: 0, y: -2.6, dir: 'up', len: 3.4, period: 4, duty: 0.3, phase: 0.15, damage: 10 },
      ...pairH({ type: 'barrel', x: -4.3, y: 0.45, power: 10, damage: 22 }),
    ],
  },
  {
    // hot air over the lava lake: gravity is weak, so you float between crumbling pumice stones and the rock in the middle;
    // a spiked censer orbits above anyone who floats too high
    name: 'Pumice Float', theme: 'volcano', bgVariant: 0, hpScale: hp(15),
    arena: {
      deathY: -6,
      boxes: [box(-0.65, 0.65, 1.0, 1.4, 'rock'), ...sym(slab(-8, -4, 0, 3, 'rock'), wall(-8.25, 0, 3, 0.5, 'rock'))],
    },
    player: { x: -6 },
    enemies: [{ type: 'fire_dancer', x: 6 }, { type: 'magma_brute', x: 0 }, { type: 'grill_master', x: 5 }],
    loose: [{ id: 'gravity_mace', x: -4.8 }, { id: 'gravity_mace', x: 4.8 }],
    hazards: [
      { type: 'lava', x: 0, y: -2.2, w: 8, damage: 9 },
      { type: 'lowgrav', x: 0, y: 1.6, w: 8, h: 7.6, scale: 0.35 },
      ...pairH({ type: 'crumble', x: -2.2, y: 0.6, w: 1.3, delay: 0.9, respawn: 3.5 }),
      { type: 'spikeball', x: 0, y: 5.4, r: 0.4, speed: 4, damage: 12, arm: 1.2, orbit: 1.1 },
    ],
  },
  {
    // the stage belts run outward into lava moats; springboard pistons in the moats flick whoever falls in back onto
    // the stage (singed). Kegs ride the belts toward the moats
    name: 'Conveyor Caldera', theme: 'volcano', bgVariant: 1, hpScale: hp(16),
    arena: {
      deathY: -6,
      boxes: [slab(-5.6, 5.6, 0, 3, 'rock'), ...sym(slab(-8, -6.8, 0, 3, 'rock'), wall(-8.25, 0, 3.5, 0.5, 'rock'))],
    },
    player: { x: -7.4 },
    enemies: [{ type: 'magma_brute', x: 7.4 }, { type: 'grill_master', x: 0.6 }, { type: 'fire_dancer', x: -0.6 }],
    loose: [{ id: 'meteor_staff', x: -0.3, y: 0.4 }, { id: 'meteor_staff', x: 0.3, y: 0.4 }],
    hazards: [
      ...pairH({ type: 'conveyor', x: -3.3, y: 0.12, w: 4.4, h: 0.24, speed: -1.0 }),
      ...pairH({ type: 'lava', x: -6.2, y: -1.6, w: 1.2, damage: 9 }),
      ...pairH({ type: 'piston', x: -6.2, y: -1.95, w: 0.9, h: 0.7, dir: 1.2, stroke: 1.0, period: 3, trigger: true, launch: 9 }),
      ...pairH({ type: 'barrel', x: -4.4, y: 0.7, power: 10, damage: 20 }),
    ],
  },

  // ------------------------------------------------------------------ sky block (idx 17-20)
  {
    // wind chimes: a heavy chime hangs over each gap and the gusts swing them. Grab one and ride the gust across,
    // or get clobbered by it mid-jump
    name: 'Wind Chimes', theme: 'sky', bgVariant: 0, hpScale: hp(17),
    arena: {
      deathY: -7,
      // 1.2 m gaps with catch basins 2.4 m down (open void gaps made the bots blow themselves off the islands)
      boxes: [slab(-1.2, 1.2, 0, 3.4, 'cloud'), ...sym(slab(-8, -2.4, 0, 3.4, 'cloud'), box(-2.4, -1.2, -3.4, -2.4, 'cloud'), wall(-8.25, 0, 3, 0.5, 'cloud'))],
    },
    player: { x: -6 },
    enemies: [{ type: 'wind_knight', x: 6 }, { type: 'sky_monk', x: 0 }],
    loose: [{ id: 'halberd', x: -5 }, { id: 'halberd', x: 5 }],
    hazards: [
      ...pairH({ type: 'pendulum', x: -1.8, y: 6.2, chain: 3.6, r: 0.4, mass: 20, amp: 0 }),
      ...pairH({ type: 'wind', x: -1.8, y: 2.6, w: 2.4, h: 5.2, fx: 6, fy: 0, period: 5, duty: 0.3, phase: 0 }),
      ...pairH({ type: 'wind', x: -1.8, y: 2.6, w: 2.4, h: 5.2, fx: -6, fy: 0, period: 5, duty: 0.3, phase: 0.5 }),
    ],
  },
  {
    // a feather-light gravity field fills the void between the islands: leap across in slow motion while two glove
    // wheels turn in the middle of the jump arc
    name: 'Featherweight', theme: 'sky', bgVariant: 1, hpScale: hp(18),
    arena: {
      deathY: -7,
      // a cloud floor 3 m down catches fallers (still in the light field, so you can leap back out), spikes in its middle
      boxes: [box(-0.9, 0.9, 1.5, 1.9, 'cloud'), box(-4.6, 4.6, -3.6, -3, 'cloud'), ...sym(slab(-8, -4.6, 0, 3.6, 'cloud')), ...edges(-7.4).boxes],
    },
    player: { x: -6 },
    enemies: [{ type: 'cloud_ninja', x: 6 }, { type: 'wind_knight', x: 0 }],
    loose: [{ id: 'katana', x: -5.2 }, { id: 'katana', x: 5.2 }],
    hazards: [
      { type: 'lowgrav', x: 0, y: 1.5, w: 9.2, h: 10, scale: 0.3 },
      { type: 'spikes', x: 0, y: -3, w: 2.4, damage: 10 },
      ...pairH({ type: 'spinner', x: -2.6, y: 3.2, arm: 1.0, r: 0.35, count: 3, speed: 1.6, look: 'glove', knock: 1.2 }),
      ...edges(-7.4).hazards,
    ],
  },
  {
    // storm clouds ferry fighters over the void to the middle island, straight through lightning gates
    name: 'Storm Clouds', theme: 'sky', bgVariant: 2, hpScale: hp(19),
    arena: {
      deathY: -7,
      boxes: [slab(-1, 1, 0, 1, 'cloud'), ...sym(slab(-8, -5, 0, 1, 'cloud'), wall(-8.25, 0, 3, 0.5, 'cloud'))],
    },
    player: { x: -6.5 },
    enemies: [{ type: 'sky_monk', x: 6.5 }, { type: 'cloud_ninja', x: 0 }, { type: 'wind_knight', x: 7.4 }],
    loose: [{ id: 'poleaxe', x: -0.6 }, { id: 'poleaxe', x: 0.6 }],
    hazards: [
      ...pairH({ type: 'mover', x: -4.2, y: -0.15, w: 1.4, h: 0.3, to: [-1.8, -0.15], period: 6 }),
      ...pairH({ type: 'lasergate', x: -3.0, y0: -0.3, y1: 2.6, period: 3, duty: 0.4, phase: 0.5, damage: 12 }),
    ],
  },
  {
    // a crumbling cloud stair climbs to the summit; a spiked censer circles it, sweeping the upper step and the spike
    // bed under the summit
    name: 'Crumbling Spire', theme: 'sky', bgVariant: 0, hpScale: hp(20),
    arena: {
      deathY: -7,
      boxes: [slab(-7.5, 7.5, 0, 1, 'cloud'), box(-1, 1, 3.2, 3.6, 'cloud'), ...sym(wall(-7.75, 0, 4, 0.5, 'cloud'))],
    },
    player: { x: -6 },
    enemies: [{ type: 'cloud_ninja', x: 6 }, { type: 'wind_knight', x: 0 }, { type: 'sky_monk', x: 5 }],
    loose: [{ id: 'frost_scythe', x: -4.8 }, { id: 'frost_scythe', x: 4.8 }],
    hazards: [
      ...pairH({ type: 'crumble', x: -3.8, y: 1.2, w: 1.4, delay: 0.6, respawn: 3 }),
      ...pairH({ type: 'crumble', x: -2.2, y: 2.4, w: 1.4, delay: 0.6, respawn: 3 }),
      { type: 'spikes', x: 0, y: 0, w: 2, damage: 12 },
      { type: 'spikeball', x: 0, y: 3.4, r: 0.4, speed: 4, damage: 12, arm: 2.6, orbit: 0.9 },
    ],
  },

  // ------------------------------------------------------------------ neon block (idx 21-24)
  {
    // escalators: two flights of treads carry you up toward the stage, but each step's belt runs you into the next riser.
    // Laser gates flicker at the top of both flights
    name: 'Escalator', theme: 'neon', bgVariant: 0, hpScale: hp(21),
    arena: {
      deathY: -6,
      boxes: [slab(-8, 8, 0, 1, 'neon'), box(-1.8, 1.8, 0, 2.4, 'neon'), ...sym(box(-4.0, -1.8, 0, 0.8, 'metal'), wall(-8.25, 0, 4.5, 0.5, 'neon'))],
    },
    player: { x: -6.9 },
    enemies: [{ type: 'neon_punk', x: 6.9 }, { type: 'robo_waiter', x: 0 }, { type: 'arcade_champ', x: 7.6 }],
    loose: [{ id: 'buzz_saw', x: -7.4 }, { id: 'buzz_saw', x: 7.4, y: 0.3 }],
    hazards: [
      ...pairH({ type: 'track', x: -5.2, y: 0.8, length: 1.6, r: 0.4, speed: 0.9 }),
      ...pairH({ type: 'track', x: -3.0, y: 1.6, length: 1.6, r: 0.4, speed: 0.9 }),
      ...pairH({ type: 'lasergate', x: -1.6, y0: 2.4, y1: 4.6, period: 3.5, duty: 0.35, phase: 0.5, damage: 10 }),
      ...pairH({ type: 'barrel', x: -1.0, y: 2.85, power: 10, damage: 20 }),
    ],
  },
  {
    // a dance floor of piston keys pumping to the beat over a live trench: ride the launches, or slip between the keys
    name: 'Beat Drop', theme: 'neon', bgVariant: 1, hpScale: hp(22),
    arena: {
      deathY: -6,
      boxes: [box(-4.2, 4.2, -2.4, -1.6, 'metal'), box(-0.55, 0.55, -1.6, 0, 'neon'), ...sym(slab(-8, -4.2, 0, 2.4, 'neon'), wall(-8.25, 0, 6.5, 0.5, 'neon'))],
    },
    player: { x: -6.2 },
    enemies: [{ type: 'arcade_champ', x: 6.2 }, { type: 'neon_punk', x: 0 }, { type: 'robo_waiter', x: 7.2 }],
    loose: [{ id: 'double_sword', x: -5.2 }, { id: 'double_sword', x: 5.2 }],
    hazards: [
      { type: 'shock', x: 0, y: -1.6, w: 8.4, period: 3, duty: 0.5, damage: 9 },
      ...pairH({ type: 'piston', x: -1.6, y: -0.385, w: 1.1, h: 0.77, dir: 'up', stroke: 0.9, period: 2.4, phase: 0, launch: 7 }),
      ...pairH({ type: 'piston', x: -3.2, y: -0.385, w: 1.1, h: 0.77, dir: 'up', stroke: 0.9, period: 2.4, phase: 0.5, launch: 7 }),
    ],
  },
  {
    // a wrecking ball in a pinball cabinet: bumpers kick it back every swing, a bot rides it, and the floor under it sparks
    name: 'Wrecking Pinball', theme: 'neon', bgVariant: 2, hpScale: hp(23),
    arena: {
      deathY: -6,
      boxes: [slab(-7.5, 7.5, 0, 1, 'neon'), box(-0.3, 0.3, 6.6, 6.9, 'metal'), ...sym(wall(-7.75, 0, 5, 0.5, 'neon'))],
    },
    player: { x: -5.8 },
    enemies: [{ type: 'robo_waiter', x: 5.8 }, { type: 'arcade_champ', x: 2.11, yAbs: 1.84, ...RIDE }, { type: 'neon_punk', x: 4.4 }],
    loose: [{ id: 'thunder_hammer', x: -4 }, { id: 'thunder_hammer', x: 4 }],
    hazards: [
      { type: 'pendulum', x: 0, y: 6.6, chain: 3.8, r: 0.6, mass: 40, amp: 0.5 },
      ...pairH({ type: 'bumper', x: -3.3, y: 3.7, r: 0.5, power: 9 }),
      { type: 'shock', x: 0, y: 0, w: 3, period: 4, duty: 0.35, phase: 0.5, damage: 9 },
    ],
  },
  {
    // a subway car shuttles between the platforms over a live track bed; signal lamps swing low over the car
    name: 'Subway Surf', theme: 'neon', bgVariant: 0, hpScale: hp(24),
    arena: {
      deathY: -6,
      boxes: [box(-4.6, 4.6, -2.2, -1.2, 'metal'), ...sym(slab(-8, -4.6, 0, 2.2, 'neon'), wall(-8.25, 0, 4, 0.5, 'neon'))],
    },
    player: { x: -6.4 },
    enemies: [{ type: 'neon_punk', x: 6.4 }, { type: 'robo_waiter', x: 3.05, yAbs: 0.02, ...RIDE }, { type: 'arcade_champ', x: 5.4 }],
    loose: [{ id: 'great_axe', x: -5.4 }, { id: 'great_axe', x: 5.4, y: 0.3 }],
    hazards: [
      { type: 'shock', x: 0, y: -1.2, w: 9.2, period: 3, duty: 0.5, damage: 9 },
      { type: 'mover', x: -3.05, y: -0.25, w: 3, h: 0.5, to: [3.05, -0.25], period: 7, phase: 0.5 },
      ...pairH({ type: 'swinger', x: -1.6, y: 6.4, chain: 3.7, r: 0.45, amp: 0.8, period: 3.2, damage: 12, look: 'ball' }),
    ],
  },

  // ------------------------------------------------------------------ space block (idx 25-29)
  {
    // hull breach: a hole in the deck under a loose plate. Every few seconds the leak sucks everything on the deck toward
    // it (hold on to the stanchions), and the breach itself drags whatever floats over it out into space
    name: 'Hull Breach', theme: 'space', bgVariant: 0, hpScale: hp(25),
    arena: {
      deathY: -7,
      boxes: [...sym(slab(-7.5, -0.6, 0, 1, 'hull'), box(-3.4, -3.1, 0, 1.4, 'metal'), wall(-7.75, 0, 4, 0.5, 'hull'))],
    },
    player: { x: -5.6 },
    enemies: [{ type: 'alien_grunt', x: 5.6 }, { type: 'astro_cook', x: 2.2 }],
    loose: [{ id: 'dragon_blade', x: -5.0 }, { id: 'dragon_blade', x: 5.0 }],
    hazards: [
      { type: 'block', x: 0, y: 0.1, w: 2.2, h: 0.2, style: 'metal', mass: 15 },
      ...pairH({ type: 'wind', x: -4.05, y: 1.5, w: 6.9, h: 3, fx: 7, fy: 0, period: 6, duty: 0.3, phase: 0.5 }),
      { type: 'wind', x: 0, y: -2, w: 1.2, h: 5, fx: 0, fy: -12 },
    ],
  },
  {
    // the cutting deck: saw blades run back and forth in slots in the floor; slow rotor arms overhead are the way over
    // them, and the low-gravity bubble in the middle floats you up to the command block
    name: 'Cutting Deck', theme: 'space', bgVariant: 1, hpScale: hp(26),
    arena: {
      deathY: -6,
      boxes: [slab(-7.5, 7.5, 0, 1, 'hull'), box(-0.8, 0.8, 0, 0.5, 'metal'), ...sym(wall(-7.75, 0, 4.5, 0.5, 'hull'))],
    },
    player: { x: -6.6 },
    enemies: [{ type: 'cyborg_chef', x: 6.6 }, { type: 'astro_cook', x: 0 }, { type: 'alien_grunt', x: 5.6 }],
    loose: [{ id: 'gravity_mace', x: -5.6 }, { id: 'gravity_mace', x: 5.0, y: 0.3 }],
    hazards: [
      ...pairH({ type: 'blade', x: -4.4, y: -0.15, r: 0.5, speed: 14, damage: 14, path: [-1.3, -0.15], period: 5 }),
      ...pairH({ type: 'rotor', x: -2.7, y: 2.4, w: 2.8, h: 0.25, speed: 0.5 }),
      { type: 'lowgrav', x: 0, y: 3, w: 2.4, h: 6, scale: 0.4 },
    ],
  },
  {
    // mini-boss: Glitch haunts the relay room. Laser gates cut the room in three and low-gravity bubbles at both ends
    // turn every blink into a float; spears behind the player
    name: 'Signal Lost', theme: 'space', bgVariant: 2, hpScale: hp(27),
    arena: {
      deathY: -6,
      boxes: [slab(-8, 8, 0, 1, 'hull'), ...sym(wall(-8.25, 0, 6, 0.5, 'hull'))],
    },
    player: { x: -5.5 },
    enemies: [{ type: 'glitch', x: 5, hp: 650 }, { type: 'alien_grunt', x: 6.8 }],
    hazards: [
      { type: 'rack', x: -7.3, y: 0, weapons: ['yari', 'yari', 'yari', 'yari'] },
      ...pairH({ type: 'lasergate', x: -2.6, y0: 0, y1: 2.8, period: 4, duty: 0.3, phase: 0.5, damage: 10 }),
      ...pairH({ type: 'lowgrav', x: -6.4, y: 3, w: 3.2, h: 6, scale: 0.45 }),
    ],
  },
  {
    // bounce pads launch you through a low-gravity column up to the orbital platform where the prize rack waits;
    // overshoot outward and the spiked satellites get you
    name: 'Orbital Launch', theme: 'space', bgVariant: 0, hpScale: hp(28),
    arena: {
      deathY: -6,
      boxes: [slab(-7.5, 7.5, 0, 1, 'hull'), box(-2.2, 2.2, 4.6, 5.0, 'metal'), ...sym(wall(-7.75, 0, 7, 0.5, 'hull'))],
    },
    player: { x: -6 },
    enemies: [{ type: 'alien_grunt', x: 6 }, { type: 'cyborg_chef', x: 1.3 }, { type: 'astro_cook', x: -1.3 }],
    loose: [{ id: 'morning_star', x: -5 }, { id: 'morning_star', x: 5 }],
    hazards: [
      ...pairH({ type: 'bouncer', x: -3.4, y: 0, w: 1.4, power: 7.8 }),   // apex ~5.7 m in the field: just over the platform
      { type: 'lowgrav', x: 0, y: 3.5, w: 9, h: 7, scale: 0.45 },
      ...pairH({ type: 'spikeball', x: -5.2, y: 5.2, r: 0.4, speed: 4, damage: 12, arm: 0.8, orbit: 1.2 }),
      { type: 'rack', x: 0, y: 5, weapons: ['sun_hammer', 'plasma_katana'] },
    ],
  },
  {
    // finale: one seesaw in low gravity. Jump on the high end and the far rider goes flying into the spiked orbits above;
    // weapons and crates keep dropping in, and the landing strips at both ends are live
    name: 'Gravity Seesaw', theme: 'space', bgVariant: 1, hpScale: hp(29),
    arena: {
      deathY: -6,
      boxes: [slab(-7.5, 7.5, 0, 1, 'hull'), ...sym(wall(-7.75, 0, 7, 0.5, 'hull'))],
    },
    player: { x: -6.3 },
    enemies: [{ type: 'cyborg_chef', x: 6.3 }, { type: 'alien_grunt', x: 2.2, yAbs: 0.8 }, { type: 'astro_cook', x: 5.2 }],
    hazards: [
      { type: 'seesaw', x: 0, y: 0.6, w: 6, h: 0.3, limit: 0.35, post: 1.2 },
      { type: 'lowgrav', x: 0, y: 3.5, w: 7, h: 7, scale: 0.4 },
      ...pairH({ type: 'spikeball', x: -2.4, y: 5.2, r: 0.4, speed: 4, damage: 14, arm: 0.9, orbit: 1.3 }),
      ...pairH({ type: 'shock', x: -4.0, y: 0, w: 1.2, period: 4, duty: 0.35, phase: 0.5, damage: 9 }),
      { type: 'dropper', x: 0, y: 9, every: 7, items: ['crate', 'meteor_flail', 'crate', 'dual_scythe'], max: 3 },
    ],
  },
];
