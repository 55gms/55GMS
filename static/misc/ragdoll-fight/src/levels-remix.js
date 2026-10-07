// Levels 181-250, part 2: 33 remixed levels + 7 remixed boss levels (190, 200, ... 250).
// Same level-def shape as src/levels-ours.js. Composed into LEVELS by src/levels.js (see EXTRA_* there).
//
// A remix takes a strong source layout (the original's levels, converted, or our levels 11-20 / 31-40 / 51-60),
// mirrors it left-right, swaps one mechanism (or moves spawns onto props), puts the late-act roster in it with weapons,
// and adds one twist (low gravity, giant, 3-bot brawl, dropper, lava / water floor, wind, crumbling ledges, lasers,
// kegs, spike floor with safe islands, wrecking ball, rope lift ...). Sources are spread so none repeats.
// No import from levels.js (it imports this file): the helpers + the classicDef tuning we need are copied here.
// Note (game.js): with several bots only the one with the highest base hp keeps its weapon, so the others get loose
// weapons / racks within reach.

import { CLASSIC_LEVELS } from './levels-classic.js';
import { OUR_LEVELS } from './levels-ours.js';

const r2 = (v) => Math.round(v * 100) / 100;
const box = (x0, x1, y0, y1, style) => [r2((x0 + x1) / 2), r2((y0 + y1) / 2), r2(x1 - x0), r2(y1 - y0), ...(style ? [style] : [])];
const slab = (x0, x1, top = 0, h = 1, style) => box(x0, x1, top - h, top, style);
const wall = (x, y0, y1, w = 0.5, style = 'pillar') => box(x - w / 2, x + w / 2, y0, y1, style);
const sym = (...bs) => bs.flatMap((b) => [b, [-b[0], b[1], b[2], b[3], b[4] || 'slab', ...(b[5] ? [-b[5]] : [])]]);
const RIDE = { grabOnStart: true, grabTime: 14, grabRelease: 1.6 };
const HOLD = { grabOnStart: true, grabTime: 60, grabRelease: 1.0 };
const SPEARS = { type: 'rack', x: -7.5, y: 0, weapons: ['yari', 'yari', 'yari', 'yari'] };

// ---- mirroring (x -> -x): geometry, spawns, and every hazard's position / direction / spin sign
const mx = (v) => r2(-v);
function mirrorHz(h) {
  const m = { ...h };
  if (typeof h.x === 'number') m.x = mx(h.x);
  if (typeof h.x0 === 'number' && typeof h.x1 === 'number') { m.x0 = mx(h.x1); m.x1 = mx(h.x0); }
  if (h.path) m.path = [mx(h.path[0]), h.path[1]];
  if (h.to) m.to = [mx(h.to[0]), h.to[1]];
  if (h.dir === 'left' || h.dir === 'right') m.dir = h.dir === 'left' ? 'right' : 'left';
  else if (typeof h.dir === 'number') m.dir = r2(Math.PI - h.dir);   // angled pistons: direction angle
  for (const k of ['speed', 'orbit', 'fx', 'amp', 'angle']) if (typeof h[k] === 'number') m[k] = -h[k];
  if (h.type === 'spinner' && typeof h.phase === 'number') m.phase = -h.phase;
  return m;
}
/** a hazard and its mirror image (for symmetric additions) */
const pairH = (h, dPhase = 0) => [h, { ...mirrorHz(h), ...(dPhase ? { phase: (h.phase || 0) + dPhase } : {}) }];
function mirrorLevel(d) {
  const b5 = (b) => (b.length > 4 ? [b[4] || 'slab', ...(b[5] ? [-b[5]] : [])] : []);
  return {
    arena: {
      ...d.arena,
      boxes: d.arena.boxes.map((b) => [mx(b[0]), b[1], b[2], b[3], ...b5(b)]),
      ...(d.arena.polys ? { polys: d.arena.polys.map((p) => ({ ...p, pts: p.pts.map(([x, y]) => [mx(x), y]).reverse() })) } : {}),
    },
    player: { ...d.player, x: mx(d.player.x), ...(d.player.facing ? { facing: -d.player.facing } : {}) },
    enemies: (d.enemies || []).map((e) => ({ ...e, x: mx(e.x), ...(e.facing ? { facing: -e.facing } : {}) })),
    loose: (d.loose || []).map((l) => ({ ...l, x: mx(l.x), ...(l.angle ? { angle: -l.angle } : {}) })),
    hazards: (d.hazards || []).map(mirrorHz),
  };
}

// ---- sources. Classic defs get the same tuning levels.js classicDef applies (hazard tuning + the per-level overrides
// that change geometry, hazards or rider spawns), copied from CLASSIC_OVERRIDES for the files used here.
const tuneHazards = (list) => (list || []).map((h) => {
  if (h.type === 'piston' && h.dir === 'up' && h.launch > 8) return { ...h, launch: 8 };
  if (h.type === 'wheel' && h.teeth) return { ...h, r: +(h.r * 0.85).toFixed(2) };
  return h;
});
const FIX = {
  4: (d) => ({ enemies: d.enemies.map(({ grabOnStart, ...e }) => e) }),
  6: (d) => {
    const g = d.hazards.find((h) => h.type === 'wheel'), gears = [];
    for (const [y, speed] of [[1.0, -1.3], [3.8, 1.3]]) for (const x of [-2.0, 0, 2.0]) gears.push({ ...g, x, y, r: 0.95, speed });
    return { hazards: [...gears, ...tuneHazards(d.hazards.filter((h) => h.type !== 'wheel'))], enemies: [{ type: d.enemies[0].type, weapon: d.enemies[0].weapon, x: -d.player.x, yAbs: 0.02, facing: -1 }] };
  },
  12: (d) => ({ hazards: tuneHazards(d.hazards).map((h) => (h.type === 'piston' ? { ...h, launch: 10 } : h)) }),
  18: (d) => {
    const p = { ...d.hazards.find((h) => h.type === 'pendulum') }, L = (p.chain += 0.35) + p.r;
    return {
      hazards: tuneHazards(d.hazards).map((h) => (h.type === 'pendulum' ? p : h)),
      enemies: d.enemies.map((e, k) => (k === 0 ? { ...e, ...HOLD, x: +(p.x + Math.sin(p.amp) * L).toFixed(2), yAbs: +(p.y - Math.cos(p.amp) * L - 0.9).toFixed(2) } : e)),
    };
  },
  22: (d) => {
    const t = d.hazards.find((h) => h.type === 'track');
    return { enemies: d.enemies.map((e, k) => (k === 0 ? { ...e, ...HOLD, x: +(t.x + t.length * 0.35).toFixed(2), yAbs: +(t.y + 0.02).toFixed(2) } : e)) };
  },
  23: (d) => ({
    arena: { ...d.arena, boxes: [...d.arena.boxes, [-4.45, -1.3, 0.25, 0.4, 'pillar'], [4.45, -1.3, 0.25, 0.4, 'pillar']] },
    hazards: tuneHazards(d.hazards).map((h) => (h.type === 'wheel' ? { ...h, mode: 'loose', axle: true, speed: 0 } : h.type === 'block' ? { ...h, mass: 60 } : h)),
  }),
  28: (d) => {
    const g = d.hazards.filter((h) => h.type === 'wheel').sort((a, b) => b.x - a.x)[0];
    return { enemies: d.enemies.map((e, k) => (k === 0 ? { ...e, ...HOLD, x: g.x, yAbs: +(g.y + g.r * 0.85 + 0.02).toFixed(2) } : e)) };
  },
  53: (d) => ({ hazards: tuneHazards(d.hazards).map((h) => (h.type === 'mover' ? { ...h, w: 1.54, h: 0.5, rope: 2.9 } : h)) }),
  58: (d) => ({
    arena: { ...d.arena, boxes: [...d.arena.boxes, [-6.25, -1.2, 1.3, 1.7, 'pillar'], [6.25, -1.2, 1.3, 1.7, 'pillar'], [-2.19, -1.5, 0.9, 1.4, 'pillar'], [2.19, -1.5, 0.9, 1.4, 'pillar']] },
    hazards: tuneHazards(d.hazards).map((h) => (h.type === 'wheel' ? { ...h, speed: -0.6 } : h)),
  }),
};
const JSONCOPY = (o) => JSON.parse(JSON.stringify(o));
/** original level file i (0-based), tuned like classicDef, then mirrored */
const C = (i) => { const s = JSONCOPY(CLASSIC_LEVELS[i]); return mirrorLevel({ ...s, hazards: tuneHazards(s.hazards), ...(FIX[i] ? FIX[i](s) : {}) }); };
/** one of our levels by name, mirrored */
const O = (name) => { const s = OUR_LEVELS.find((d) => d.name === name); if (!s) throw new Error('levels-remix: no source ' + name); return mirrorLevel(JSONCOPY(s)); };
const drop = (list, ...types) => list.filter((h) => !types.includes(h.type));
const lava = (x, y, w, damage = 10) => ({ type: 'lava', x, y, w, damage });
const barrel = (x, y) => ({ type: 'barrel', x, y, power: 11, damage: 24 });

// ---- the 33 remixes, in slot order (REMIX_LEVELS[idx]); the block theme of every slot comes from the same formula
// as levels.js EXTRA_PLAN, so `theme` here always equals the plan's p.theme (checked in the browser).
const DEFS = [
  // ============ foundry block (181-190)
  () => { const m = C(18); return {   // src: original 19 (wrecking-ball rider). blade -> fire jet; twist: powder kegs
    name: 'Crucible Swing', src: 'classic 19', twist: 'explosive kegs',
    ...m,
    enemies: [{ ...m.enemies[0], type: 'grill_master', weapon: 'cleaver' }, { ...m.enemies[1], type: 'magma_brute', weapon: 'hammer' }],
    hazards: [...drop(m.hazards, 'blade'), { type: 'firejet', x: -4.8, y: 0, dir: 'up', len: 2.6, period: 3.4, duty: 0.3, phase: 1.2, damage: 10 },
      barrel(-3.6, 0.45), barrel(3.8, 0.45), barrel(-0.2, 8.62)],   // clear of the rider's feet: ends of the arc + on the beam
  }; },
  () => { const m = O('Dough Roller'); return {   // src: our 12. + hanging powder jars; twist: lava in the trench (walled)
    name: 'Slag Roller', src: 'ours 12 Dough Roller', twist: 'lava floor',
    ...m,
    arena: { ...m.arena, boxes: [...m.arena.boxes, ...sym(box(-1.55, -1.3, -2.8, -1))] },
    enemies: [{ type: 'magma_brute', x: -4.3, weapon: 'hammer' }, { type: 'fire_dancer', x: -2.5, weapon: 'staff' }],
    loose: [...m.loose, { id: 'staff', x: -3.3 }],
    hazards: [...m.hazards, lava(0, -2.3, 2.6), ...pairH({ type: 'jar', x: -2.3, y: 4.4, chain: 2.6, power: 9, damage: 20 })],
  }; },
  () => { const m = C(22); return {   // src: original 23 (tread rider + kegs). + bounce pad under the tread; twist: giant
    name: 'Belt Bombers', src: 'classic 23', twist: 'giant enemy',
    ...m,
    enemies: [{ ...m.enemies[0], type: 'fire_dancer', weapon: 'staff' }, { type: 'cyborg_chef', x: -3.0, yAbs: 0.02, facing: 1, weapon: 'meteor_flail', scale: 1.35 }],
    hazards: [...m.hazards, { type: 'bouncer', x: 0.3, y: 0, w: 1.0, power: 9.5 }],
  }; },
  () => { const m = O('Piston Gauntlet'); return {   // src: our 34. ceiling crushers -> swinging hooks; twist: low-gravity column
    name: 'Stamping Press', src: 'ours 34 Piston Gauntlet', twist: 'low gravity zone',
    ...m,
    enemies: [{ ...m.enemies[0], type: 'robo_waiter', weapon: 'great_axe' }, { ...m.enemies[1], type: 'grill_master', weapon: 'cleaver' }],
    loose: [{ id: 'cleaver', x: -2.8 }],
    hazards: [...m.hazards.filter((h) => !(h.type === 'piston' && h.dir === 'down')),
      ...pairH({ type: 'swinger', x: -1.9, y: 5.6, chain: 2.6, r: 0.45, amp: 0.8, period: 3.0, damage: 12, look: 'hook' }, 0.5),
      { type: 'lowgrav', x: 0, y: 2.6, w: 2.2, h: 5.2, scale: 0.45 }],
  }; },
  () => { const m = C(37); return {   // src: original 38 (spike pit gears). + powder jars over the pit; twist: 3-bot brawl
    name: 'Gear Grinder', src: 'classic 38', twist: '3-enemy brawl',
    ...m,
    enemies: [{ type: 'grill_master', x: -3.4, yAbs: 0.02, facing: 1 }, { type: 'fire_dancer', x: -4.5, yAbs: 0.02, facing: 1 }, { type: 'magma_brute', x: -5.7, yAbs: 0.02, facing: 1, weapon: 'hammer' }],
    loose: [{ id: 'cleaver', x: -4.0 }, { id: 'staff', x: -5.1 }],
    hazards: [...m.hazards, ...pairH({ type: 'jar', x: -1.9, y: 2.16, chain: 1.2, power: 9, damage: 20 })],
  }; },

  // ============ freezer block (191-200)
  () => { const m = O('Rope Swing'); return {   // src: our 52. + crumbling ice floe in the gap; twist: icy floors
    name: 'Frostbite Swing', src: 'ours 52 Rope Swing', twist: 'ice floors',
    ...m,
    arena: { ...m.arena, boxes: m.arena.boxes.map((b) => (b[3] === 3 && Math.abs(b[0]) > 5 ? [b[0], b[1], b[2], b[3], 'ice'] : b)) },
    enemies: [{ type: 'penguin_waiter', x: -5.5, weapon: 'nunchaku' }, { type: 'ice_brute', x: -7.0, weapon: 'mace' }],
    loose: [{ id: 'nunchaku', x: -4.3 }],
    hazards: [...m.hazards, { type: 'crumble', x: 0, y: -1.3, w: 1.3, delay: 0.7, respawn: 4 }],
  }; },
  () => { const m = C(4); return {   // src: original 5 (big wheel). + meat hooks; twist: wind gusts
    name: 'Blizzard Wheel', src: 'classic 5', twist: 'wind gusts',
    ...m,
    arena: { ...m.arena, boxes: [...m.arena.boxes, ...sym(box(-5.0, -3.8, 6.5, 6.8, 'metal'))] },
    enemies: [{ type: 'frost_cook', x: -3.1, yAbs: 0.02, facing: 1, weapon: 'machete' }, { type: 'ice_brute', x: -5.2, yAbs: 0.02, facing: 1, weapon: 'mace' }],
    loose: [{ id: 'machete', x: -2.3 }],
    hazards: [...m.hazards, ...pairH({ type: 'swinger', x: -4.4, y: 6.5, chain: 3.6, r: 0.45, amp: 0.7, period: 3.6, damage: 10, look: 'hook' }, 0.5),
      { type: 'wind', x: 0, y: 2.6, w: 4.0, h: 5, fx: -8, period: 7, duty: 0.3, phase: 2.7 }],   // gusts over the wheel only, never at spawns
  }; },
  () => { const m = O('Crate Forts'); return {   // src: our 36. dropper -> icicles from a ceiling beam; twist: giant brute
    name: 'Igloo Forts', src: 'ours 36 Crate Forts', twist: 'giant enemy',
    ...m,
    arena: { ...m.arena, boxes: [...m.arena.boxes, box(-2.2, 2.2, 6.2, 6.5, 'metal')] },
    enemies: [{ type: 'ice_brute', x: -7.4, weapon: 'mace', scale: 1.45 }, { ...m.enemies[1], type: 'penguin_waiter', weapon: 'nunchaku' }],
    hazards: [...drop(m.hazards, 'dropper'), ...[-1.4, 0, 1.4].map((x, i) => ({ type: 'icicle', x, y: 6.2, every: 3.4, phase: i * 1.1, len: 0.7, damage: 12 }))],
  }; },
  () => { const m = C(28); return {   // src: original 29 (gear rider). + item dropper; twist: crumbling ledges
    name: 'Cog Freeze', src: 'classic 29', twist: 'crumbling platforms',
    ...m,
    enemies: [{ ...m.enemies[0], type: 'frost_cook', weapon: 'machete' }, { type: 'penguin_waiter', x: -1.0, yAbs: 0.02, facing: 1 }],
    loose: [{ id: 'nunchaku', x: -0.3 }],
    hazards: [...m.hazards, { type: 'dropper', x: 0.2, y: 8, every: 6, items: ['crate', 'sword', 'crate'], max: 2 },
      { type: 'crumble', x: -4.0, y: 1.9, w: 1.1, delay: 0.6, respawn: 4 }, { type: 'crumble', x: 3.8, y: 1.9, w: 1.1, delay: 0.6, respawn: 4 }],
  }; },
  () => { const m = O('Spike Trench'); return {   // src: our 14. rope bridge -> bobbing ice floe; twist: freezing water instead of spikes
    name: 'Frozen Moat', src: 'ours 14 Spike Trench', twist: 'water floor',
    ...m,
    arena: { ...m.arena, deathY: -2.4, boxes: m.arena.boxes.filter((b) => !(b[0] === 0 && b[2] === 3.2)) },
    enemies: [{ type: 'ice_brute', x: -4.4, weapon: 'mace' }, { type: 'frost_cook', x: 0, yAbs: -0.33 }],
    loose: [...m.loose, { id: 'machete', x: -2.9 }],
    hazards: [...drop(m.hazards, 'bridge', 'spikes'), { type: 'water', x0: -14, x1: 14, y: -1.3 }, { type: 'boat', x: 0, y: -0.35, w: 1.8, h: 0.5, amp: 0.06, bob: 0.08, period: 3.8 }],
  }; },

  // ============ docks block (201-210)
  () => { const m = C(23); return {   // src: original 24 (carts). saw blades -> spiked balls; twist: wrecking ball overhead
    name: 'Runaway Carts', src: 'classic 24', twist: 'rideable wrecking ball',
    ...m,
    arena: { ...m.arena, boxes: [...m.arena.boxes, box(-0.4, 0.4, 6.3, 6.6, 'pillar')] },
    enemies: [{ type: 'pirate_chef', x: -2.0, yAbs: 0.02, facing: 1, weapon: 'sword' }, { type: 'deckhand', x: -3.5, yAbs: 0.02, facing: 1 }],
    loose: [{ id: 'bat', x: -1.0, y: 0.3 }],
    hazards: [...drop(m.hazards, 'blade'), ...pairH({ type: 'spikeball', x: -5.4, y: -0.44, r: 0.55, speed: 5, damage: 12 }),
      { type: 'pendulum', x: 0, y: 6.3, chain: 3.6, r: 0.5, mass: 30, amp: 0.6 }, { type: 'water', x0: -14, x1: 14, y: -2.8 }],
  }; },
  () => { const m = O('Wrecking Hump'); return {   // src: our 38. + cargo crates on the hump for the ball to bowl; twist: 3-bot brawl
    name: 'Anchor Hump', src: 'ours 38 Wrecking Hump', twist: '3-enemy brawl',
    ...m,
    enemies: [{ ...m.enemies[1], type: 'deckhand' }, { type: 'pirate_chef', x: -7.4 }, { type: 'diver', x: -8.6, weapon: 'yari' }],
    loose: [{ id: 'sword', x: -6.4 }],
    hazards: [...m.hazards, ...pairH({ type: 'block', x: -1.2, y: 2.46, w: 0.9, h: 0.9, mass: 14 })],
  }; },
  () => { const m = C(53); return {   // src: original 54 (rope lift). + bobbing boat to fall onto; twist: harbour water
    name: 'Crane Crossing', src: 'classic 54', twist: 'water floor',
    ...m,
    enemies: [{ ...m.enemies[0], type: 'diver', weapon: 'yari' }, { type: 'deckhand', x: -4.3, yAbs: 0.02, facing: 1 }],
    loose: [{ id: 'bat', x: -7.0 }],
    hazards: [...m.hazards, { type: 'water', x0: -16, x1: 16, y: -1.0 }, { type: 'boat', x: 0, y: -0.5, w: 2.6, h: 0.5, amp: 0.1, bob: 0.12, period: 3.5 }],
  }; },
  () => { const m = O('Loose Planks'); return {   // src: our 55. crate droppers -> swinging cargo; twist: sea-breeze gusts
    name: 'Plank Walk', src: 'ours 55 Loose Planks', twist: 'wind gusts',
    ...m,
    arena: { ...m.arena, boxes: [...m.arena.boxes, ...sym(box(-2.6, -1.6, 6.5, 6.8, 'wood'))] },
    enemies: [{ ...m.enemies[0], type: 'pirate_chef', weapon: 'sword' }, { ...m.enemies[1], type: 'deckhand' }],
    loose: [{ id: 'bat', x: -0.9, y: 0.3 }],
    hazards: [...drop(m.hazards, 'dropper'), ...pairH({ type: 'swinger', x: -2.1, y: 6.5, chain: 3.2, r: 0.5, amp: 0.7, period: 3.6, damage: 12, look: 'crate' }, 0.5),
      ...pairH({ type: 'wind', x: -2.1, y: 1.5, w: 1.6, h: 3, fx: -6, period: 6, duty: 0.35, phase: 2.7 })],   // gusts over the planks, blowing outward
  }; },
  () => { const m = C(74); return {   // src: original 75 (swinging crates, centre wall). + bounce pads to vault the wall; twist: giant
    name: 'Cargo Swing', src: 'classic 75', twist: 'giant enemy',
    ...m,
    enemies: [{ type: 'diver', x: -2.3, yAbs: 0.02, facing: 1, weapon: 'yari', scale: 1.35 }, { type: 'deckhand', x: -3.15, yAbs: 0.02, facing: 1 }],   // clear of the end piston's trigger zone
    loose: [{ id: 'bat', x: -1.5 }],
    hazards: [...m.hazards, ...pairH({ type: 'bouncer', x: -0.75, y: 0, w: 0.7, power: 10 })],
  }; },

  // ============ volcano block (211-220)
  () => { const m = O('Gear Steps'); return {   // src: our 19. spawns moved onto the gears (two riders); twist: lava pit under them
    name: 'Magma Cogs', src: 'ours 19 Gear Steps', twist: 'lava floor',
    ...m,
    // lava deep enough that riders hanging under a gear keep their feet out of it; a jump from the lava reaches the gears
    arena: { ...m.arena, boxes: [...m.arena.boxes, ...sym(box(-3.5, -3.25, -3.9, -1))] },
    enemies: [{ ...m.enemies[0], type: 'magma_brute', weapon: 'hammer' }, { ...m.enemies[1], type: 'fire_dancer' }, { type: 'grill_master', x: -2.2, yAbs: 0.63, ...RIDE }],
    hazards: [...m.hazards, lava(0, -3.3, 6.5)],
  }; },
  () => { const m = C(56); return {   // src: original 57 (lifting blocks + keg). + fire jets through the gaps; twist: 3-bot brawl
    name: 'Piston Grill', src: 'classic 57', twist: '3-enemy brawl',
    ...m,
    enemies: [{ type: 'fire_dancer', x: -4.7, yAbs: 0.02, facing: 1 }, { type: 'grill_master', x: -5.5, yAbs: 0.02, facing: 1 }, { type: 'magma_brute', x: -6.3, yAbs: 0.02, facing: 1, weapon: 'hammer' }],
    loose: [{ id: 'cleaver', x: -5.1 }],
    hazards: [...m.hazards, ...pairH({ type: 'firejet', x: -1.8, y: -1.2, dir: 'up', len: 3.4, period: 3.6, duty: 0.3, phase: 0.6, damage: 10 }, 1.8)],
  }; },
  () => { const m = O('Millstone Chute'); return {   // src: our 33. rolling wheels -> powder kegs on the shelves; twist: crate dropper
    name: 'Cinder Chute', src: 'ours 33 Millstone Chute', twist: 'falling crates',
    ...m,
    enemies: [{ ...m.enemies[0], type: 'grill_master' }, { ...m.enemies[1], type: 'magma_brute', weapon: 'hammer' }],
    loose: [{ id: 'cleaver', x: -8.9, y: 2.8 }],
    hazards: [...drop(m.hazards, 'wheel'), m.hazards.find((h) => h.type === 'wheel' && h.mode === 'motor'), ...pairH(barrel(-6.9, 2.93)),
      { type: 'dropper', x: 0, y: 7, every: 5, items: ['crate', 'crate', 'hammer'], max: 3 }],
  }; },
  () => { const m = C(48); return {   // src: original 49 (blades under a tread). blades -> fire jets; twist: crumbling stepping stones
    name: 'Ember Tread', src: 'classic 49', twist: 'crumbling platforms',
    ...m,
    enemies: [{ type: 'fire_dancer', x: -3.9, yAbs: 0.02, facing: 1 }, { type: 'grill_master', x: -5.0, yAbs: 0.02, facing: 1, weapon: 'cleaver' }],
    loose: [{ id: 'staff', x: -6.3 }],
    hazards: [...drop(m.hazards, 'blade'), ...[-1.7, 0, 1.7].map((x) => ({ type: 'crumble', x, y: 0, w: 1.3, delay: 0.6, respawn: 4 })),
      ...pairH({ type: 'firejet', x: -0.85, y: -2.2, dir: 'up', len: 3.2, period: 3.2, duty: 0.3, phase: 0.8, damage: 10 }, 1.6)],
  }; },

  // ============ sky block (221-230)
  () => { const m = O('Saw Seesaw'); return {   // src: our 56. saws -> orbiting spiked balls; twist: wind gusts
    name: 'Cloud Seesaw', src: 'ours 56 Saw Seesaw', twist: 'wind gusts',
    ...m,
    enemies: [{ type: 'wind_knight', x: -5.4, weapon: 'halberd' }, { type: 'cloud_ninja', x: -4.2 }],
    loose: [{ id: 'katana', x: -6.2 }],
    hazards: [...drop(m.hazards, 'blade'), ...pairH({ type: 'spikeball', x: -1.7, y: -1.7, r: 0.42, speed: 5, damage: 12, arm: 0.5, orbit: 1.6 }),
      { type: 'wind', x: 0, y: 2.5, w: 6.2, h: 5, fx: 6, period: 7, duty: 0.3, phase: 2.7 }],   // over the seesaw only
  }; },
  () => { const m = C(12); return {   // src: original 13 (slopes + angled pistons). bot moved onto the summit; twist: low gravity summit
    name: 'Sky Slopes', src: 'classic 13', twist: 'low gravity zone',
    ...m,
    enemies: [{ ...m.enemies[0], type: 'sky_monk', weapon: 'staff' }, { type: 'cloud_ninja', x: -0.8, yAbs: 3.78, facing: 1 }],
    loose: [{ id: 'katana', x: 0.9, y: 4.0 }],
    hazards: [...m.hazards, { type: 'lowgrav', x: 0, y: 5.6, w: 5, h: 4, scale: 0.4 }],
  }; },
  () => { const m = O('Stepping Lifts'); return {   // src: our 57. ropes hang under the outer lifts; twist: updraft in the pit
    name: 'Lantern Wave', src: 'ours 57 Stepping Lifts', twist: 'wind updraft',
    ...m,
    enemies: [{ ...m.enemies[0], type: 'wind_knight', weapon: 'halberd' }, { ...m.enemies[1], type: 'cloud_ninja' }],
    loose: [{ id: 'katana', x: -5.4 }],
    hazards: [...m.hazards.map((h) => (h.type === 'mover' && Math.abs(h.x) > 2 ? { ...h, rope: 1.4 } : h)),
      { type: 'wind', x: 0, y: -1.5, w: 8.6, h: 2.6, fx: 0, fy: 9, period: 5, duty: 0.4, phase: 2.6 }],
  }; },
  () => { const m = C(43); return {   // src: original 44 (glove slope). gloves -> bumpers; twist: rope lift up to the ledge
    name: 'Glove Ascent', src: 'classic 44', twist: 'mover with a rope',
    ...m,
    enemies: [{ ...m.enemies[0], type: 'wind_knight', weapon: 'halberd' }, { type: 'sky_monk', x: -2.6, yAbs: 3.31, facing: 1 }],
    loose: [{ id: 'staff', x: -4.6, y: 3.6 }],
    hazards: [...drop(m.hazards, 'spinner'), ...m.hazards.filter((h) => h.type === 'spinner').map((h) => ({ type: 'bumper', x: h.x, y: h.y, r: 0.45, power: 9 })),
      { type: 'mover', x: 2.4, y: 5.6, w: 1.4, h: 0.3, to: [-2.4, 5.6], period: 6, rope: 2.4 }],
  }; },
  () => { const m = O('Powder Hill'); return {   // src: our 31. piston walls restored at the ends; twist: wrecking ball over the plateau
    name: 'Temple Hill', src: 'ours 31 Powder Hill', twist: 'rideable wrecking ball',
    ...m,
    arena: { ...m.arena, boxes: [...m.arena.boxes, box(-0.4, 0.4, 7.8, 8.1, 'pillar')] },
    enemies: [{ ...m.enemies[0], type: 'sky_monk', weapon: 'staff' }, { type: 'cloud_ninja', x: -6.0 }],
    hazards: [...m.hazards, ...pairH({ type: 'piston', x: -7.4, y: 1.06, w: 0.64, h: 1.61, dir: 'right', stroke: 1.44, period: 3, trigger: true, launch: 11 }),
      { type: 'pendulum', x: 0, y: 7.8, chain: 3.0, r: 0.55, mass: 30, amp: 0.8 }],
  }; },

  // ============ neon block (231-240)
  () => { const m = C(34); return {   // src: original 35 (rising blocks, 3 bots). bots regrouped on the far side; twist: laser gate
    name: 'Equalizer', src: 'classic 35', twist: 'neon laser gate',
    ...m,
    enemies: [{ type: 'neon_punk', x: -0.9, yAbs: 0.02, facing: 1 }, { type: 'arcade_champ', x: -2.1, yAbs: 0.02, facing: 1 }, { type: 'robo_waiter', x: -4.4, yAbs: 0.02, facing: 1, weapon: 'great_axe' }],
    loose: [{ id: 'chain_mace', x: -5.2 }, { id: 'double_sword', x: -6.0 }],
    hazards: [...m.hazards, { type: 'lasergate', x: 0, y0: -0.6, y1: 2.8, period: 3.2, duty: 0.45, phase: 1.6, damage: 12 }],
  }; },
  () => { const m = O('Glove Wheels'); return {   // src: our 53. + pinball bumper over the vent; twist: the only safe stop is a shock pad
    name: 'Pinball Wheels', src: 'ours 53 Glove Wheels', twist: 'electrified safe stop (shock pad)',
    ...m,
    enemies: [{ type: 'arcade_champ', x: -5.3, weapon: 'double_sword' }, { type: 'neon_punk', x: -6.3 }],
    loose: [{ id: 'chain_mace', x: 0, y: 1.2 }],
    hazards: [...m.hazards, { type: 'bumper', x: 0, y: 2.5, r: 0.45, power: 9 }, { type: 'shock', x: 0, y: 0.9, w: 1.6, period: 4, duty: 0.35, damage: 8 }],
  }; },
  () => { const m = C(58); return {   // src: original 59 (wheel floor). end pistons -> pinball bumpers; twist: giant robot
    name: 'Spin Cycle', src: 'classic 59', twist: 'giant enemy',
    ...m,
    enemies: [{ type: 'neon_punk', x: 0, yAbs: 0.02, facing: 1 }, { type: 'robo_waiter', x: -4.4, yAbs: 0.02, facing: 1, weapon: 'great_axe', scale: 1.3 }],
    loose: [{ id: 'chain_mace', x: -1.2 }],
    hazards: [...drop(m.hazards, 'piston'), ...pairH({ type: 'bumper', x: -6.5, y: 0.9, r: 0.5, power: 10 })],
  }; },
  () => { const m = O('Windmill'); return {   // src: our 58. centre spikes -> shock pad; twist: spike strips with safe islands
    name: 'Neon Rotor', src: 'ours 58 Windmill', twist: 'spike floor with safe islands',
    ...m,
    enemies: [{ ...m.enemies[0], type: 'robo_waiter', weapon: 'great_axe' }, { ...m.enemies[1], type: 'arcade_champ', weapon: 'double_sword' }],
    loose: [{ id: 'double_sword', x: -5.0 }],
    hazards: [...drop(m.hazards, 'spikes'), { type: 'shock', x: 0, y: 0, w: 1.6, period: 3, duty: 0.5, damage: 8 }, ...pairH({ type: 'spikes', x: -3.6, y: 0, w: 1.6, damage: 10 })],
  }; },
  () => { const m = C(75); return {   // src: original 76 (two-level drop, 3 bots). swinging crate -> laser gate; twist: dropper
    name: 'Arcade Drop', src: 'classic 76', twist: 'falling crates',
    ...m,
    enemies: [{ ...m.enemies[0], type: 'neon_punk' }, { ...m.enemies[1], type: 'robo_waiter', weapon: 'great_axe' }, { ...m.enemies[2], type: 'arcade_champ' }],
    loose: [{ id: 'double_sword', x: -1.8, y: -3.3 }],
    hazards: [...drop(m.hazards, 'swinger'), { type: 'lasergate', x: 0.4, y0: -3.6, y1: 2.0, period: 3.4, duty: 0.4, phase: 1.7, damage: 12 },
      { type: 'dropper', x: -3.4, y: 4.2, every: 5, items: ['crate', 'crate', 'nunchaku'], max: 3 }],
  }; },

  // ============ space block (241-250)
  () => { const m = O('Pastry Tread'); return {   // src: our 18. + bounce pads under the tread ends; twist: low gravity around the tread
    name: 'Orbital Tread', src: 'ours 18 Pastry Tread', twist: 'low gravity zone',
    ...m,
    enemies: [{ ...m.enemies[0], type: 'cyborg_chef', weapon: 'meteor_flail' }, { ...m.enemies[1], type: 'astro_cook' }],
    loose: [{ id: 'morning_star', x: 4.6 }],
    hazards: [...m.hazards, ...pairH({ type: 'bouncer', x: -2.6, y: 0, w: 1.0, power: 9 }), { type: 'lowgrav', x: 0, y: 2.6, w: 7.4, h: 5.2, scale: 0.4 }],
  }; },
  () => { const m = C(6); return {   // src: original 7 (two rows of gears). end pistons -> bumpers; twist: 3-bot brawl
    name: 'Gear Station', src: 'classic 7', twist: '3-enemy brawl',
    ...m,
    enemies: [{ type: 'astro_cook', x: -3.3, yAbs: 0.02, facing: 1 }, { type: 'alien_grunt', x: -4.5, yAbs: 0.02, facing: 1 }, { type: 'cyborg_chef', x: -5.7, yAbs: 0.02, facing: 1, weapon: 'meteor_flail' }],
    loose: [{ id: 'halberd', x: -4.0 }, { id: 'morning_star', x: -5.2 }],
    hazards: [...drop(m.hazards, 'piston'), ...pairH({ type: 'bumper', x: -7.05, y: 1.1, r: 0.5, power: 10 })],
  }; },
  () => { const m = O('Tread Towers'); return {   // src: our 54. dropper -> rope lift between the towers; twist: airlock gusts
    name: 'Airlock Towers', src: 'ours 54 Tread Towers', twist: 'wind gusts',
    ...m,
    enemies: [{ ...m.enemies[0], type: 'alien_grunt', weapon: 'halberd' }, { ...m.enemies[1], type: 'astro_cook' }],
    loose: [{ id: 'morning_star', x: -1.4 }],
    hazards: [...drop(m.hazards, 'dropper'), { type: 'mover', x: -1.6, y: 5.2, w: 1.5, h: 0.3, to: [1.6, 5.2], period: 5, rope: 2.2 },
      { type: 'wind', x: 0, y: 1.5, w: 11, h: 3, fx: -8, period: 6, duty: 0.35, phase: 2.7 }],
  }; },
  () => { const m = O('Mace Clock'); return {   // src: our 37. + low-gravity bubble over the centre; twist: powder kegs
    name: 'Asteroid Clock', src: 'ours 37 Mace Clock', twist: 'explosive kegs',
    ...m,
    enemies: [{ ...m.enemies[0], type: 'cyborg_chef', weapon: 'meteor_flail' }, { type: 'alien_grunt', x: -7.8 }],
    loose: [{ id: 'halberd', x: -6.0 }],
    hazards: [...m.hazards, { type: 'lowgrav', x: 0, y: 2.6, w: 2.8, h: 5.2, scale: 0.4 }, barrel(-1.35, 0.45), barrel(1.35, 0.45), barrel(0, 1.15)],
  }; },
];

// block themes per slot, same formula as levels.js EXTRA_PLAN (7 blocks x 9 regular slots, 30 of the 63 are 'new')
const EXTRA_THEMES = ['foundry', 'freezer', 'docks', 'volcano', 'sky', 'neon', 'space'];
const SLOTS = [];
for (let b = 0; b < EXTRA_THEMES.length; b++) {
  let j2 = 0;
  for (let j = 0; j < 9; j++) {
    const k = b * 9 + j;
    if (Math.floor(((k + 1) * 30) / 63) <= Math.floor((k * 30) / 63)) SLOTS.push({ theme: EXTRA_THEMES[b], b, j: j2++ });
  }
}

export const REMIX_LEVELS = DEFS.map((f, i) => {
  const d = f(), s = SLOTS[i];
  const { src, twist, ...def } = d;
  return {
    ...def, theme: s.theme, bgVariant: i % 3,
    hpScale: r2(Math.min(1.3, 1.12 + s.b * 0.025 + s.j * 0.01)),   // late game: 1.12 at 181 -> 1.3 by the space block
    remixOf: src, twist,
  };
});

// ---- 7 boss levels. Same fair boss arena as our act bosses (>= 22 m solid floor, player -5.5, boss 5, 4-spear rack
// behind the player) plus one mechanism twist each. Walls are 11 m (not 7.5): the combined specials + twist launchers
// threw the player over 7.5 m walls in ~1 of 5 measured fights.
const WALL_H = 11;
const bossArena = (style, wallStyle, extra = []) => ({
  deathY: -6,
  boxes: [slab(-12, 12, 0, 1, style), wall(-12.3, 0, WALL_H, 0.6, wallStyle), wall(12.3, 0, WALL_H, 0.6, wallStyle), ...extra],
});
export const REMIX_BOSSES = [
  {   // 190: remix of Sir Pepperoni (Oven Lord's hat): slams, laser eyes, quake slams. Twist: fire jets in the floor
    name: 'Forge Tyrant', theme: 'hall', bgVariant: 1,
    arena: { deathY: -6, boxes: [slab(-11, 11), box(-10.7, -9.2, 0, 0.6, 'pillar'), box(9.2, 10.7, 0, 0.6, 'pillar'), wall(-11.25, 0, 9), wall(11.25, 0, 9)] },
    player: { x: -5.5 },
    enemies: [{ type: 'forge_tyrant', x: 5 }],
    hazards: [SPEARS, ...pairH({ type: 'firejet', x: -1.8, y: 0, dir: 'up', len: 2.4, period: 5, duty: 0.22, phase: 2.5, damage: 9 }, 2.5)],
  },
  {   // 200: remix of Brain Freeze (Snowball Sam's hat): icicles + freezing snowballs in combos. Twist: ice patch mid-floor
    name: 'Permafrost', theme: 'boss_freezer', bgVariant: 1,
    arena: { deathY: -6, boxes: [slab(-12, -2.5), slab(-2.5, 2.5, 0, 1, 'ice'), slab(2.5, 12), wall(-12.3, 0, WALL_H, 0.6, 'metal'), wall(12.3, 0, WALL_H, 0.6, 'metal')] },
    player: { x: -5.5 },
    enemies: [{ type: 'permafrost', x: 5 }],
    hazards: [SPEARS],
  },
  {   // 210: remix of Calamari King (Captain Anchovy's hat): anchor yank straight into tentacles. Twist: swinging cargo crate
    name: 'Kraken Admiral', theme: 'boss_docks', bgVariant: 1,
    arena: bossArena('wood', 'hull', [box(-0.5, 0.5, 8, 8.3, 'wood')]),
    player: { x: -5.5 },
    enemies: [{ type: 'kraken_admiral', x: 5 }],
    hazards: [SPEARS, { type: 'swinger', x: 0, y: 8, chain: 4, r: 0.55, amp: 0.9, period: 4, damage: 12, look: 'crate' }],
  },
  {   // 220: remix of Chili Colossus (Hot Sauce's hat): meteors + fire breath + quake slams. Twist: lava by the walls
    name: 'Magma Maestro', theme: 'boss_volcano', bgVariant: 1,
    arena: { deathY: -6, boxes: [slab(-10.2, 10.2, 0, 1, 'rock'), ...sym(box(-12.1, -10.2, -1, -0.65, 'rock')), wall(-12.3, -1, WALL_H, 0.6, 'rock'), wall(12.3, -1, WALL_H, 0.6, 'rock')] },
    player: { x: -5.5 },
    enemies: [{ type: 'magma_maestro', x: 5 }],
    hazards: [SPEARS, ...pairH(lava(-11.15, -0.15, 1.9, 8))],
  },
  {   // 230: remix of Thunder Crust (Windbag's hat): gust into the wall, then lightning. Twist: hanging weights near the walls
    // to grab and hold on to through the gusts (bounce pads there threw players over the wall in sims)
    name: 'Tempest King', theme: 'boss_sky', bgVariant: 1,
    arena: bossArena('cloud', 'cloud', sym(box(-9.9, -8.9, 8, 8.3, 'cloud'))),
    player: { x: -5.5 },
    enemies: [{ type: 'tempest_king', x: 5 }],
    hazards: [SPEARS, ...pairH({ type: 'pendulum', x: -9.4, y: 8, chain: 5.0, r: 0.45, mass: 25, amp: 0 })],
  },
  {   // 240: remix of Mecha Mozzarella (Glitch's hat): rockets, blink-strikes, laser. Twist: overhead laser gate
    name: 'Overclock', theme: 'boss_neon', bgVariant: 1,
    arena: bossArena('neon', 'metal', [box(-0.6, 0.6, 7, 7.3, 'neon')]),
    player: { x: -5.5 },
    enemies: [{ type: 'overclock', x: 5 }],
    hazards: [SPEARS, { type: 'lasergate', x: 0, y0: 2.9, y1: 7, period: 4, duty: 0.4, phase: 2, damage: 10 }],
  },
  {   // 250: remix of Emperor Crust (Zero-G's hat): discs, rings, gravity slam into rings, rockets, quakes. Twist: shock
    // strips along the walls (a low-g bubble flung players out of the arena in sims)
    name: 'Void Emperor', theme: 'boss_space', bgVariant: 1,
    arena: bossArena('hull', 'hull', sym(box(-12, -8.6, 7.5, 7.8, 'metal'))),
    player: { x: -5.5 },
    enemies: [{ type: 'void_emperor', x: 5 }],
    hazards: [SPEARS, ...pairH({ type: 'shock', x: -10.6, y: 0, w: 2.4, period: 5, duty: 0.3, damage: 8 }, 2.5)],
  },
];
