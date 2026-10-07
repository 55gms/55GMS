// Level definitions. Index 0 = level 1. After the last level the list loops with tougher enemies.
//
// {
//   name, theme,       theme: 'kitchen' | 'cellar' | 'rooftop' | 'foundry' | 'hall'
//   tutorial,          'spin' | 'grab' | 'climb' | null
//   hpScale,           enemy HP multiplier for this level (loops multiply on top)
//   arena:   { deathY, boxes: [[cx, cy, w, h, style?, angle?]], polys: [{pts, style?}] }   (see arena.js)
//   player:  { x, facing? }
//   enemies: [{ type, x, y?, facing?, ...overrides }]   type = key of ENEMIES; enemies[0] is also P2's spawn in 2-player
//   loose:   [{ id, x, y?, angle? }]                    weapons lying in the arena
//   hazards: [{ type, ... }]                            see DESIGN.md §9 (src/hazards.js)
// }
//
// Physics budget (DESIGN.md §9, confirmed by sim probes): jumpable step ≤ 0.8 m, jumpable gap ≤ 1.2 m,
// walkable ramp ≤ 0.5 rise/run, climbable wall ≤ ~4 m, ledges ≥ 1.2 m wide, 2 m clear of hazards at spawns.
// Floors are top y = 0 unless noted. Non-boss levels double as 2-player arenas, so they are mirror-symmetric
// with enemies[0] standing where the player's mirror image would.

import { ENEMIES } from './enemies.js';
import { CLASSIC_LEVELS } from './levels-classic.js';   // original Ragdoll Hit levels, converted (generated file)
import { OUR_LEVELS } from './levels-ours.js';   // our own levels (moved out of this file)
import { NEW_LEVELS } from './levels-new.js';     // levels 181-250: 30 brand-new (placed by EXTRA_PLAN below)
import { REMIX_LEVELS, REMIX_BOSSES } from './levels-remix.js';   // levels 181-250: 33 remixes + 7 boss remixes

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


// ---------------------------------------------------------------------------- final order (user request)
// 10 original Ragdoll Hit levels, then 10 of ours, repeating ("10, 10, 10, 10 …"); whatever is left over is appended.
// Original levels get a background per block of ten (boss levels use the hall), the tutorials move onto them,
// and their enemies ramp gently with position.
const CLASSIC_THEMES = ['rooftop', 'cellar', 'foundry', 'freezer', 'docks', 'volcano', 'sky', 'neon'];
const CLASSIC_TUTORIALS = { 0: 'spin', 1: 'grab', 11: 'climb' };
const hasBoss = (def) => (def.enemies || []).some((e) => ENEMIES[e.type] && ENEMIES[e.type].boss);
// converted hazards, tuned: upward (trampoline) pistons capped (launch 11 threw ~5 m high); gears a little smaller
const tuneHazards = (list) => (list || []).map((h) => {
  if (h.type === 'piston' && h.dir === 'up' && h.launch > 8) return { ...h, launch: 8 };
  if (h.type === 'wheel' && h.teeth) return { ...h, r: +(h.r * 0.85).toFixed(2) };
  return h;
});
const HOLD = { grabOnStart: true, grabTime: 60, grabRelease: 1.0 };   // hang on / ride until the player is right there
// hand-tuned tweaks on top of the converted data (user playtest); key = original level file index
const CLASSIC_OVERRIDES = {
  // level 2: two ninja stars right in front of the player, easy to kick straight into the front bot
  1: (d) => ({ loose: [{ id: 'shuriken', x: +(d.player.x + 0.75).toFixed(2), y: 0.25 }, { id: 'shuriken', x: +(d.player.x + 1.35).toFixed(2), y: 0.25 }] }),
  // level 4: the original's "bridge" was a rope connecting the two players, which we don't have — no bridge. The bot keeps
  // its grabOnStart: on plain ground that now means "wait on the far slab until the player lands nearby" (no floor grabbing)
  3: (d) => ({ hazards: tuneHazards(d.hazards).filter((h) => h.type !== 'bridge') }),
  // level 5: the bot beside the big wheel just fights (its grabOnStart would pin a hand to the wheel's down-moving rim)
  4: (d) => ({ enemies: d.enemies.map(({ grabOnStart, ...e }) => e) }),
  // level 7: six gears in two rows with a body-sized gap between them; every gear pushes toward the far side (top row
  // counter-clockwise, bottom row clockwise), so grabbing / being carried takes you through the middle to the enemy
  6: (d) => {
    const g = d.hazards.find((h) => h.type === 'wheel'), gears = [];
    for (const [y, speed] of [[1.0, -1.3], [3.8, 1.3]]) for (const x of [-2.0, 0, 2.0]) gears.push({ ...g, x, y, r: 0.95, speed });   // columns nearly touch: nothing wedges between them
    return { hazards: [...gears, ...tuneHazards(d.hazards.filter((h) => h.type !== 'wheel'))], enemies: [{ type: d.enemies[0].type, weapon: d.enemies[0].weapon, x: -d.player.x, yAbs: 0.02, facing: -1 }] };
  },
  // level 44: the carts are heavy planks on free-rolling wheels (driven wheels fought each other and flipped bots under
  // them); curbs at the slab ends keep the carts from rolling off into the saws
  23: (d) => ({
    arena: { ...d.arena, boxes: [...d.arena.boxes, [-4.45, -1.3, 0.25, 0.4, 'pillar'], [4.45, -1.3, 0.25, 0.4, 'pillar']] },
    hazards: tuneHazards(d.hazards).map((h) => (h.type === 'wheel' ? { ...h, mode: 'loose', axle: true, speed: 0 } : h.type === 'block' ? { ...h, mass: 60 } : h)),
  }),
  // level 104: the moving platform is the original's chain platform — a chain hangs under it to jump up to and swing on
  53: (d) => ({ hazards: tuneHazards(d.hazards).map((h) => (h.type === 'mover' ? { ...h, w: 1.54, h: 0.5, rope: 2.9 } : h)) }),
  // level 109: three big wheels are the floor. All turn clockwise, slowly: the player is carried toward the bots and every
  // crack's far face lifts him up the next wheel; bots can't be crushed in a crack (no crack pulls both ways down and the
  // deep V between wheels is filled with a post, so nobody wedges in it). Ledges fill the gaps beside the end pillars
  58: (d) => ({
    arena: { ...d.arena, boxes: [...d.arena.boxes, [-6.25, -1.2, 1.3, 1.7, 'pillar'], [6.25, -1.2, 1.3, 1.7, 'pillar'], [-2.19, -1.5, 0.9, 1.4, 'pillar'], [2.19, -1.5, 0.9, 1.4, 'pillar']] },
    hazards: tuneHazards(d.hazards).map((h) => (h.type === 'wheel' ? { ...h, speed: -0.6 } : h)),
  }),
  // level 23: the diagonal pistons shove you up the slope onto the middle platform, not clean over the whole level
  12: (d) => ({ hazards: tuneHazards(d.hazards).map((h) => (h.type === 'piston' ? { ...h, launch: 10 } : h)) }),
  // level 29: the bot rides the wrecking ball; the chain is a little longer so the ball passes low enough (underside
  // ~1.5 m) to jump up and grab from the floor
  18: (d) => {
    const p = { ...d.hazards.find((h) => h.type === 'pendulum') }, L = (p.chain += 0.35) + p.r;
    return {
      hazards: tuneHazards(d.hazards).map((h) => (h.type === 'pendulum' ? p : h)),
      enemies: d.enemies.map((e, k) => (k === 0 ? { ...e, ...HOLD, x: +(p.x + Math.sin(p.amp) * L).toFixed(2), yAbs: +(p.y - Math.cos(p.amp) * L - 0.9).toFixed(2) } : e)),
    };
  },
  // level 43: one bot holds on to the tank tread and rides around it
  22: (d) => {
    const t = d.hazards.find((h) => h.type === 'track');
    return { enemies: d.enemies.map((e, k) => (k === 0 ? { ...e, ...HOLD, x: +(t.x + t.length * 0.35).toFixed(2), yAbs: +(t.y + 0.02).toFixed(2) } : e)) };
  },
  // level 49: the right bot rides the right gear
  28: (d) => {
    const g = d.hazards.filter((h) => h.type === 'wheel').sort((a, b) => b.x - a.x)[0];
    return { enemies: d.enemies.map((e, k) => (k === 0 ? { ...e, ...HOLD, x: g.x, yAbs: +(g.y + g.r * 0.85 + 0.02).toFixed(2) } : e)) };
  },
  // level 69: the planks are a hanging bridge, not loose boards that drop into the abyss
  38: (d) => {
    const planks = d.hazards.filter((h) => h.type === 'block');
    const x0 = Math.min(...planks.map((b) => b.x - b.w / 2)), x1 = Math.max(...planks.map((b) => b.x + b.w / 2));
    return { hazards: [...tuneHazards(d.hazards.filter((h) => h.type !== 'block')), { type: 'bridge', x0: +(x0 - 0.1).toFixed(2), x1: +(x1 + 0.1).toFixed(2), y: -0.08, segments: 12 }] };
  },
};
const classicDef = (src, i) => ({
  ...src,
  hazards: tuneHazards(src.hazards),
  theme: hasBoss(src) ? 'hall' : CLASSIC_THEMES[Math.floor(i / 10) % CLASSIC_THEMES.length],
  bgVariant: i % 3,
  tutorial: CLASSIC_TUTORIALS[i] || null,
  hpScale: 1 + Math.min(0.2, i * 0.0025),
  ...(CLASSIC_OVERRIDES[i] ? CLASSIC_OVERRIDES[i](src) : {}),
});

export const LEVELS = [];
for (let b = 0; b * 10 < Math.max(CLASSIC_LEVELS.length, OUR_LEVELS.length); b++) {
  CLASSIC_LEVELS.slice(b * 10, b * 10 + 10).forEach((d, j) => LEVELS.push(classicDef(d, b * 10 + j)));
  OUR_LEVELS.slice(b * 10, b * 10 + 10).forEach((d) => LEVELS.push({ ...d, tutorial: null }));
}

// ---- levels 181-250: 7 blocks of 10 = 9 regular slots + a boss at 190, 200, ... 250.
// The 63 regular slots take 30 brand-new levels (src/levels-new.js) spread evenly between 33 remixes
// (src/levels-remix.js). Every slot's number / kind / theme is fixed in EXTRA_PLAN so both files can be
// filled independently. Unfilled slots fall back to a copy of one of our levels, so numbering never shifts.
export const EXTRA_THEMES = ['foundry', 'freezer', 'docks', 'volcano', 'sky', 'neon', 'space'];   // one per block (181-190 foundry ...)
export const EXTRA_BOSS_THEMES = ['hall', 'boss_freezer', 'boss_docks', 'boss_volcano', 'boss_sky', 'boss_neon', 'boss_space'];
export const EXTRA_PLAN = [];   // [{ n, kind: 'new' | 'remix' | 'boss', idx, theme }]
{
  const first = LEVELS.length + 1;   // 181
  let newIdx = 0, remixIdx = 0;
  for (let b = 0; b < EXTRA_THEMES.length; b++) {
    for (let j = 0; j < 9; j++) {
      const k = b * 9 + j;
      const isNew = Math.floor(((k + 1) * 30) / 63) > Math.floor((k * 30) / 63);
      EXTRA_PLAN.push({ n: first + b * 10 + j, kind: isNew ? 'new' : 'remix', idx: isNew ? newIdx++ : remixIdx++, theme: EXTRA_THEMES[b] });
    }
    EXTRA_PLAN.push({ n: first + b * 10 + 9, kind: 'boss', idx: b, theme: EXTRA_BOSS_THEMES[b] });
  }
  const ourBosses = OUR_LEVELS.filter(hasBoss);
  for (const p of EXTRA_PLAN) {
    const src = p.kind === 'new' ? NEW_LEVELS[p.idx] : p.kind === 'remix' ? REMIX_LEVELS[p.idx] : REMIX_BOSSES[p.idx];
    const fallback = p.kind === 'boss' ? ourBosses[p.idx % ourBosses.length] : OUR_LEVELS[(p.n * 7) % OUR_LEVELS.length];
    LEVELS.push(src ? { theme: p.theme, ...src, tutorial: null } : { ...fallback, tutorial: null, placeholder: true });
  }
}
/** 1-based numbers of every level without a boss (2-player arenas). */
export const ARENA_LEVELS = LEVELS.map((d, i) => (hasBoss(d) ? 0 : i + 1)).filter(Boolean);

/** Level n (1-based) as a fresh copy, looping with +15% enemy HP and damage per loop. */
export function getLevel(n) {
  const count = LEVELS.length;
  const idx = (Math.max(1, n) - 1) % count;
  const loop = Math.floor((Math.max(1, n) - 1) / count);
  const def = JSON.parse(JSON.stringify(LEVELS[idx]));
  const boost = 1 + loop * 0.15;
  def.number = n;
  def.tutorial = loop === 0 ? def.tutorial || null : null;
  def.hpScale = (def.hpScale || 1) * boost;
  if (loop > 0) {
    for (const e of def.enemies || []) {
      const base = ENEMIES[e.type] || ENEMIES.rookie;
      e.dmgMult = (e.dmgMult ?? base.dmgMult ?? 1) * boost;
    }
  }
  return def;
}

export const LEVEL_COUNT = () => LEVELS.length;
