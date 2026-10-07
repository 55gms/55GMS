// Weapons: catalog id -> physics shapes + flat-vector drawing.
// Weapon frame: grip at origin, length axis = +x. Held weapons become fixtures on the
// holder's forearm (rigid, no joint stretch); loose weapons get their own bullet body.
// Extras: chain links/heads (nunchaku, chain mace), loose handle flaps (butterfly knife),
// a scabbard prop for the katana, and a returning thunder hammer.
import { weaponById } from './catalog.js';
import { CONFIG } from './config.js';
import { CAT, ALL, V } from './physics.js';

const COL = {
  wood: '#b98a5a', woodD: '#8a6240', steel: '#d3d9e0', steelD: '#97a1ad', black: '#2a2d33',
  red: '#d8432f', yellow: '#ffc23d', gold: '#e0b04a', dark: '#1a1c21', wrap: '#7a4a3a', leather: '#5a4034',
  steelL: '#f1f4f7', woodL: '#cfa274', iron: '#6f7782', goldD: '#a8802e',
};

// prim helpers ---------------------------------------------------------------------------
const box = (x1, x2, h, fill, role, y = 0, extra = {}) => ({ t: 'box', x: (x1 + x2) / 2, y, w: x2 - x1, h, a: 0, fill, role, ...extra });
const circ = (x, y, r, fill, role, extra = {}) => ({ t: 'circle', x, y, r, fill, role, ...extra });
const poly = (pts, fill, role, extra = {}) => ({ t: 'poly', pts, fill, role, ...extra });
const line = (pts, stroke, lw) => ({ t: 'line', pts, stroke, lw, role: 'deco' });
const spikes = (x, y, r, n, len, fill) => ({ t: 'spikes', x, y, r, n, len, fill, role: 'deco' });
// a wrapped grip: dark band with light diagonal stripes
const wrapDeco = (x1, x2, h, n = 4) => { const out = [box(x1, x2, h, COL.black, 'deco', 0, { rounded: true })]; for (let i = 0; i < n; i++) { const x = x1 + ((i + 0.5) / n) * (x2 - x1); out.push(line([[x - h * 0.3, -h * 0.4], [x + h * 0.3, h * 0.4]], COL.wrap, h * 0.28)); } return out; };

function shapesFor(def) {
  const id = def.id;
  const P = [];
  let chain = null, sheath = null, flaps = null;
  switch (id) {
    case 'bat':
      P.push(circ(-0.12, 0, 0.035, COL.woodD, 'grip'));
      P.push(box(-0.1, 0.32, 0.05, COL.wood, 'grip'));
      P.push(poly([[0.32, -0.025], [0.8, -0.045], [0.9, -0.045], [0.95, -0.02], [0.95, 0.02], [0.9, 0.045], [0.8, 0.045], [0.32, 0.025]], COL.wood, 'head'));
      P.push(line([[0.36, 0.012], [0.8, 0.024], [0.9, 0.024]], COL.woodL, 0.014));
      P.push(line([[0.935, -0.028], [0.935, 0.028]], COL.woodD, 0.012));
      P.push(...wrapDeco(-0.08, 0.14, 0.055, 3));
      break;
    case 'staff':
      P.push(box(-0.65, 1.05, 0.055, COL.wood, 'head', 0, { rounded: true }));
      P.push(line([[-0.5, 0.012], [0.9, 0.012]], COL.woodL, 0.012));
      P.push(box(-0.65, -0.5, 0.066, COL.iron, 'deco'));
      P.push(box(0.9, 1.05, 0.066, COL.iron, 'deco'));
      P.push(line([[-0.62, 0.018], [-0.53, 0.018]], COL.steel, 0.01), line([[0.93, 0.018], [1.02, 0.018]], COL.steel, 0.01));
      P.push(...wrapDeco(-0.1, 0.1, 0.06, 3));
      break;
    case 'kanabo':
      P.push(box(-0.15, 0.3, 0.05, COL.woodD, 'grip', 0, { rounded: true }));
      P.push(poly([[0.3, -0.035], [0.95, -0.06], [1.08, -0.05], [1.1, 0], [1.08, 0.05], [0.95, 0.06], [0.3, 0.035]], '#6e5444', 'head'));
      P.push(line([[0.36, 0.014], [1.0, 0.028]], '#8c6d58', 0.014));
      P.push(box(0.27, 0.35, 0.082, COL.iron, 'deco'));
      P.push(box(1.03, 1.08, 0.1, COL.iron, 'deco'));
      for (let i = 0; i < 6; i++) { const x = 0.42 + i * 0.11; P.push(circ(x, 0.045 + i * 0.003, 0.015, COL.steel, 'deco')); P.push(circ(x + 0.05, -0.045 - i * 0.003, 0.015, COL.steel, 'deco')); }
      P.push(box(-0.15, -0.08, 0.055, COL.black, 'deco'));
      P.push(...wrapDeco(-0.06, 0.25, 0.052, 4));
      break;
    case 'nunchaku':
      P.push(box(-0.05, 0.38, 0.05, COL.woodD, 'grip', 0, { rounded: true }));
      P.push(line([[0.0, 0.012], [0.3, 0.012]], COL.wood, 0.012));
      P.push(box(0.3, 0.38, 0.055, COL.steelD, 'deco'));
      chain = { start: [0.38, 0], links: 2, headMass: 0.45, linksMass: 0.1,
        head: [box(0, 0.42, 0.05, COL.woodD, 'head', 0, { rounded: true }), line([[0.1, 0.012], [0.4, 0.012]], COL.wood, 0.012), box(0, 0.08, 0.055, COL.steelD, 'deco')] };
      break;
    case 'butterfly_knife':
      P.push(circ(0.02, 0, 0.03, COL.steelD, 'grip'));
      P.push(poly([[0.04, -0.028], [0.42, -0.03], [0.55, 0], [0.42, 0.03], [0.04, 0.028]], COL.steel, 'blade'));
      P.push(line([[0.06, -0.017], [0.42, -0.019], [0.51, -0.002]], COL.steelL, 0.009));
      P.push(line([[0.06, 0.012], [0.4, 0.014]], COL.steelD, 0.006));
      // two handle halves pivot at the blade root and swing loosely (drawn as separate bodies)
      flaps = { pivot: [0.02, 0], massEach: 0.12, lo: -0.55, hi: 0.55,
        parts: [{ rest: Math.PI + 0.18, prims: [box(0.02, 0.32, 0.026, COL.steelD, 'flap', 0.012, { rounded: true }), circ(0.31, 0.012, 0.014, COL.black, 'deco'), line([[0.08, 0.012], [0.25, 0.012]], COL.black, 0.009)] },
                { rest: Math.PI - 0.18, prims: [box(0.02, 0.32, 0.026, COL.steelD, 'flap', -0.012, { rounded: true }), circ(0.31, -0.012, 0.014, COL.black, 'deco'), line([[0.08, -0.012], [0.25, -0.012]], COL.black, 0.009)] }] };
      break;
    case 'cleaver':
      P.push(box(-0.1, 0.16, 0.05, COL.wood, 'grip', 0, { rounded: true }));
      P.push(box(0.16, 0.65, 0.22, COL.steel, 'blade', 0.04));
      P.push(box(0.16, 0.65, 0.035, COL.steelD, 'deco', 0.1325));
      P.push(box(0.16, 0.65, 0.028, COL.steelL, 'deco', -0.056));
      P.push(circ(0.57, 0.1, 0.025, COL.dark, 'deco'));
      P.push(box(0.14, 0.17, 0.07, COL.steelD, 'deco'));
      P.push(circ(-0.04, 0, 0.011, COL.steelD, 'deco'), circ(0.07, 0, 0.011, COL.steelD, 'deco'));
      break;
    case 'machete':
      P.push(box(-0.1, 0.15, 0.05, COL.black, 'grip', 0, { rounded: true }));
      P.push(poly([[0.15, -0.04], [0.72, -0.05], [0.86, -0.045], [0.9, 0.0], [0.8, 0.055], [0.15, 0.04]], COL.steel, 'blade'));
      P.push(line([[0.17, -0.034], [0.84, -0.04]], COL.steelD, 0.012));
      P.push(line([[0.18, 0.028], [0.78, 0.04], [0.87, 0.008]], COL.steelL, 0.012));
      P.push(box(0.13, 0.17, 0.11, COL.steelD, 'deco'));
      P.push(circ(-0.03, 0, 0.011, COL.steel, 'deco'), circ(0.07, 0, 0.011, COL.steel, 'deco'));
      break;
    case 'katana':
      P.push(...wrapDeco(-0.18, 0.1, 0.045, 5));
      P.push(box(-0.18, 0.1, 0.045, COL.black, 'grip', 0, { rounded: true, drawHidden: true }));
      P.push(circ(0.11, 0, 0.045, COL.gold, 'grip'));
      P.push(poly([[0.12, -0.025], [1.0, -0.03], [1.15, 0.01], [1.0, 0.03], [0.12, 0.025]], COL.steel, 'blade'));
      P.push(line([[0.15, -0.013], [0.32, -0.006], [0.5, -0.014], [0.68, -0.006], [0.86, -0.015], [1.06, -0.004]], COL.steelL, 0.011));
      P.push(line([[0.14, 0.017], [1.0, 0.02]], COL.steelD, 0.007));
      P.push(circ(0.11, 0, 0.033, COL.goldD, 'deco', { hollow: true, lw: 0.009 }));
      // scabbard drawn over the blade until the first swing; then it flies off as a prop
      sheath = { mass: 0.35, prims: [box(0.13, 1.18, 0.075, COL.black, 'deco', 0, { rounded: true }), box(0.15, 0.3, 0.08, COL.leather, 'deco'), box(1.05, 1.18, 0.08, COL.leather, 'deco'), line([[0.32, 0.017], [1.02, 0.017]], '#3a3e46', 0.012), box(0.5, 0.56, 0.082, COL.red, 'deco')],
        solid: [box(0.13, 1.18, 0.075, COL.black, 'grip')] };
      break;
    case 'mace':
      P.push(box(-0.15, 0.3, 0.045, COL.steelD, 'grip', 0, { rounded: true }));
      P.push(...wrapDeco(-0.13, 0.2, 0.052, 4));
      P.push(box(0.3, 0.74, 0.045, COL.steelD, 'head', 0, { rounded: true }));
      P.push(box(0.22, 0.27, 0.07, COL.iron, 'deco'));
      P.push(spikes(0.86, 0, 0.13, 8, 0.07, COL.steelD));
      P.push(circ(0.86, 0, 0.14, COL.steel, 'head'));
      P.push(circ(0.86, 0, 0.085, COL.steelD, 'deco', { hollow: true, lw: 0.018 }));
      P.push(circ(0.815, 0.05, 0.034, COL.steelL, 'deco'));
      P.push(box(0.7, 0.75, 0.085, COL.iron, 'deco'));
      break;
    case 'thunder_hammer':
      P.push(...wrapDeco(-0.14, 0.12, 0.055, 4));
      P.push(box(-0.14, 0.36, 0.055, COL.woodD, 'grip', 0, { rounded: true, drawHidden: true }));
      P.push(box(0.12, 0.36, 0.055, COL.woodD, 'grip', 0, { rounded: true }));
      P.push(box(0.36, 0.7, 0.3, COL.steelD, 'head'));
      P.push(box(0.36, 0.44, 0.24, COL.steel, 'deco'));
      P.push(box(0.62, 0.7, 0.24, COL.steel, 'deco'));
      P.push(box(0.44, 0.62, 0.025, '#b3bcc7', 'deco', 0.1375));
      P.push(poly([[0.555, 0.12], [0.47, 0.015], [0.525, 0.015], [0.48, -0.12], [0.585, 0.03], [0.53, 0.03]], COL.yellow, 'deco'));
      break;
    case 'chain_mace':
      P.push(box(-0.1, 0.42, 0.05, COL.woodD, 'grip', 0, { rounded: true }));
      P.push(...wrapDeco(-0.08, 0.2, 0.055, 3));
      P.push(box(0.36, 0.42, 0.055, COL.steelD, 'deco'));
      chain = { start: [0.42, 0], links: 3, headMass: 0.6, linksMass: 0.1,
        head: [spikes(0.16, 0, 0.14, 9, 0.07, COL.steelD), circ(0.16, 0, 0.15, COL.steel, 'head'),
          circ(0.16, 0, 0.09, COL.steelD, 'deco', { hollow: true, lw: 0.018 }), circ(0.115, 0.05, 0.036, COL.steelL, 'deco')] };
      break;
    case 'sword':
      P.push(circ(-0.22, 0, 0.035, COL.gold, 'grip'));
      P.push(box(-0.2, 0.0, 0.045, COL.black, 'grip', 0, { rounded: true }));
      P.push({ t: 'box', x: 0.02, y: 0, w: 0.05, h: 0.24, a: 0, fill: COL.gold, role: 'grip' });
      P.push(poly([[0.05, -0.04], [1.02, -0.035], [1.2, 0], [1.02, 0.035], [0.05, 0.04]], COL.steel, 'blade'));
      P.push(line([[0.1, 0.0], [0.92, 0.0]], COL.steelD, 0.012));
      P.push(line([[0.09, -0.026], [1.02, -0.021], [1.15, -0.004]], COL.steelL, 0.009));
      P.push(line([[-0.18, -0.012], [-0.14, 0.012], [-0.1, -0.012], [-0.06, 0.012], [-0.02, -0.012]], COL.leather, 0.012));
      P.push(circ(0.02, 0.12, 0.028, COL.gold, 'deco'), circ(0.02, -0.12, 0.028, COL.gold, 'deco'));
      break;
    case 'double_sword':
      P.push(...wrapDeco(-0.18, 0.18, 0.045, 5));
      P.push(box(-0.2, 0.2, 0.045, COL.black, 'grip', 0, { rounded: true, drawHidden: true }));
      P.push({ t: 'box', x: 0.21, y: 0, w: 0.04, h: 0.2, a: 0, fill: COL.gold, role: 'grip' });
      P.push({ t: 'box', x: -0.21, y: 0, w: 0.04, h: 0.2, a: 0, fill: COL.gold, role: 'grip' });
      P.push(poly([[0.23, -0.038], [0.75, -0.032], [0.9, 0], [0.75, 0.032], [0.23, 0.038]], COL.steel, 'blade'));
      P.push(poly([[-0.23, -0.038], [-0.75, -0.032], [-0.9, 0], [-0.75, 0.032], [-0.23, 0.038]], COL.steel, 'blade'));
      P.push(line([[0.28, 0], [0.72, 0]], COL.steelD, 0.01));
      P.push(line([[-0.28, 0], [-0.72, 0]], COL.steelD, 0.01));
      P.push(line([[0.26, -0.025], [0.76, -0.019], [0.86, -0.003]], COL.steelL, 0.008), line([[-0.26, 0.025], [-0.76, 0.019], [-0.86, 0.003]], COL.steelL, 0.008));
      for (const gx of [0.21, -0.21]) P.push(circ(gx, 0.1, 0.024, COL.gold, 'deco'), circ(gx, -0.1, 0.024, COL.gold, 'deco'));
      break;
    case 'yari':
      P.push(box(-0.55, 1.22, 0.04, COL.woodD, 'head', 0, { rounded: true }));
      P.push(...wrapDeco(-0.08, 0.08, 0.05, 2));
      P.push(poly([[1.2, -0.045], [1.5, -0.035], [1.65, 0], [1.5, 0.035], [1.2, 0.045]], COL.steel, 'blade'));
      P.push(line([[1.22, 0], [1.6, 0]], COL.steelD, 0.01));
      P.push(line([[1.24, 0.028], [1.5, 0.022], [1.62, 0.004]], COL.steelL, 0.007));
      P.push(line([[1.16, 0.02], [1.02, 0.09]], COL.red, 0.022), line([[1.16, 0], [0.99, 0]], COL.red, 0.022), line([[1.16, -0.02], [1.02, -0.085]], COL.red, 0.022));
      P.push(box(1.13, 1.21, 0.07, COL.black, 'deco'));
      P.push(circ(1.17, 0.045, 0.03, COL.red, 'deco'));
      P.push(circ(1.15, -0.04, 0.025, COL.red, 'deco'));
      break;
    case 'hammer':
      P.push(box(-0.2, 0.3, 0.06, COL.wood, 'grip', 0, { rounded: true }));
      P.push(box(0.3, 1.18, 0.06, COL.wood, 'head', 0, { rounded: true }));
      P.push(box(1.15, 1.5, 0.36, COL.steelD, 'head'));
      P.push(box(1.42, 1.5, 0.3, COL.steel, 'deco'));
      P.push(box(1.15, 1.23, 0.3, COL.steel, 'deco'));
      P.push(box(1.23, 1.42, 0.035, '#b3bcc7', 'deco', 0.1625));
      P.push(box(1.3, 1.35, 0.36, COL.iron, 'deco'));
      P.push(box(1.0, 1.15, 0.078, COL.iron, 'deco'));
      P.push(line([[-0.12, 0.016], [1.0, 0.016]], COL.woodL, 0.012));
      P.push(...wrapDeco(-0.18, 0.22, 0.066, 5));
      break;
    case 'dragon_blade': {   // 10k: obsidian greatsword with a flame-wave edge (special 'fire': ignites what it hits)
      const EMB = '#6e1a12', FIRE = '#ff7a2a', GLOW = '#ffc23d';
      P.push(circ(-0.27, 0, 0.05, COL.gold, 'grip'));
      P.push(box(-0.25, 0.04, 0.05, '#1c1616', 'grip', 0, { rounded: true }));
      P.push(...wrapDeco(-0.23, 0.02, 0.056, 4));
      P.push(box(0.04, 0.13, 0.3, COL.gold, 'grip'));
      P.push(poly([[0.04, 0.15], [0.22, 0.24], [0.13, 0.1]], COL.goldD, 'deco'), poly([[0.04, -0.15], [0.22, -0.24], [0.13, -0.1]], COL.goldD, 'deco'));   // claw guard
      P.push(poly([[0.13, -0.07], [1.32, -0.06], [1.62, 0], [1.32, 0.08], [0.13, 0.085]], EMB, 'blade'));
      P.push(poly([[0.18, 0.08], [0.32, 0.15], [0.42, 0.08], [0.58, 0.16], [0.7, 0.08], [0.86, 0.16], [0.98, 0.08], [1.14, 0.15], [1.26, 0.075], [1.42, 0.1], [1.58, 0.01], [1.32, 0.05]], FIRE, 'deco'));
      P.push(line([[0.18, 0.005], [1.48, 0.005]], GLOW, 0.022));
      P.push(line([[0.16, -0.045], [1.3, -0.04]], '#2a0d09', 0.014));
      P.push(circ(0.085, 0, 0.045, '#ff4a2a', 'deco'));
      break;
    }
    case 'void_maul':   // 15k: rune-carved shaft with a caged black-hole head (special 'void': pulls foes in, implodes on big hits)
      P.push(box(-0.3, 0.3, 0.06, '#1c1826', 'grip', 0, { rounded: true }));
      P.push(...wrapDeco(-0.26, 0.26, 0.066, 5));
      P.push(box(0.3, 1.36, 0.065, '#2b2440', 'head', 0, { rounded: true }));
      P.push(line([[0.4, 0.018], [1.28, 0.018]], '#8f6bff', 0.012));
      for (const x of [0.55, 0.8, 1.05]) P.push(box(x, x + 0.05, 0.1, '#8f6bff', 'deco'));
      P.push(circ(1.62, 0, 0.3, '#120c1c', 'head'));
      P.push(box(1.3, 1.37, 0.4, COL.iron, 'deco'), box(1.87, 1.94, 0.4, COL.iron, 'deco'));
      P.push(line([[1.34, 0.19], [1.62, 0.3], [1.9, 0.19]], COL.iron, 0.035), line([[1.34, -0.19], [1.62, -0.3], [1.9, -0.19]], COL.iron, 0.035));
      P.push(circ(1.62, 0, 0.3, '#b48cff', 'deco', { hollow: true, lw: 0.03 }));
      P.push(circ(1.62, 0, 0.13, '#05030a', 'deco'));
      break;
    case 'storm_glaive': {   // 20k: steel-blue pole, huge glowing crescent blade + tesla coils (special 'storm': crackling arcs, chain lightning)
      const CY = '#7fe7ff', CYD = '#2aa7d6', WH = '#f4fdff';
      P.push(box(-0.7, 1.5, 0.05, '#34506b', 'head', 0, { rounded: true }));
      P.push(...wrapDeco(-0.15, 0.15, 0.058, 3));
      P.push(box(-0.8, -0.66, 0.085, COL.gold, 'deco'));
      for (const x of [0.5, 0.9, 1.3]) P.push(box(x, x + 0.07, 0.11, COL.gold, 'deco'), box(x + 0.02, x + 0.05, 0.14, '#b07a1e', 'deco'));
      P.push(box(1.44, 1.56, 0.15, COL.gold, 'deco'));
      P.push(poly([[1.52, -0.08], [1.95, -0.1], [2.3, 0.02], [2.05, 0.18], [1.56, 0.12]], CYD, 'blade'));
      P.push(poly([[1.56, 0.12], [2.05, 0.18], [2.3, 0.02], [2.24, 0.3], [1.98, 0.46], [1.72, 0.36], [1.85, 0.26]], CY, 'deco'));
      P.push(poly([[1.52, -0.08], [1.95, -0.1], [2.3, 0.02], [2.02, -0.2], [1.74, -0.28]], CY, 'deco'));
      P.push(line([[1.62, 0.02], [2.18, 0.04]], WH, 0.024), line([[1.8, 0.3], [2.14, 0.22]], WH, 0.014));
      break;
    }
    // ---- insane tier (abilities in src/specials.js; glow / spinning / charge overlays are drawn there) ----
    case 'buzz_saw': {   // 3.5k: gunmetal pike with a motor housing and a big pizza-cutter saw disc (special 'saw': grinds + ricochet sparks)
      const Y = '#ffc23d', R = '#d8432f';
      P.push(box(-0.55, 1.36, 0.05, '#3b4048', 'head', 0, { rounded: true }));
      P.push(...wrapDeco(-0.12, 0.12, 0.058, 3));
      P.push(box(-0.62, -0.5, 0.075, R, 'deco'));
      P.push(line([[-0.4, 0.013], [0.95, 0.013]], '#5d6570', 0.012));
      P.push(box(0.98, 1.34, 0.16, '#4a505a', 'deco'));   // motor housing
      P.push(box(1.02, 1.3, 0.035, Y, 'deco', 0.055), line([[1.06, -0.03], [1.26, -0.03]], COL.black, 0.014));
      P.push(box(1.32, 1.62, 0.05, COL.black, 'deco'));   // axle arm
      P.push(spikes(1.62, 0, 0.3, 18, 0.07, COL.steelD));
      P.push(circ(1.62, 0, 0.31, COL.steel, 'head'));
      P.push(circ(1.62, 0, 0.24, COL.steelL, 'deco', { hollow: true, lw: 0.02 }));
      P.push(circ(1.62, 0, 0.1, R, 'deco'), circ(1.62, 0, 0.04, Y, 'deco'));
      break;
    }
    case 'frost_scythe': {   // 7k: frosted steel-blue shaft with a huge ice-crystal blade (special 'frost': chill, freeze solid, shatter)
      const ICE = '#9fe3ff', ICED = '#4aa8d8', ICEL = '#eaf9ff';
      P.push(box(-0.55, 1.25, 0.05, '#2c4a66', 'head', 0, { rounded: true }));
      P.push(...wrapDeco(-0.1, 0.1, 0.058, 3));
      P.push(line([[-0.45, 0.014], [1.15, 0.014]], '#5d86a8', 0.012));
      for (const x of [0.35, 0.75]) P.push(box(x, x + 0.05, 0.085, ICEL, 'deco'));
      P.push(poly([[1.1, -0.05], [1.3, -0.03], [1.36, 0.3], [1.28, 0.62], [1.14, 0.88], [1.06, 0.5], [1.1, 0.06]], ICE, 'blade'));
      P.push(poly([[1.12, -0.03], [1.3, -0.03], [1.22, -0.27]], ICED, 'blade'));   // lower spur
      P.push(line([[1.34, 0.3], [1.26, 0.62], [1.15, 0.84]], ICED, 0.02));
      P.push(line([[1.12, 0.1], [1.09, 0.48], [1.15, 0.8]], ICEL, 0.018));
      P.push(poly([[1.3, 0.16], [1.47, 0.25], [1.33, 0.3]], ICEL, 'deco'), poly([[1.29, 0.42], [1.45, 0.57], [1.28, 0.53]], ICEL, 'deco'));   // crystals on the spine
      P.push(box(1.03, 1.2, 0.1, '#dfe8ef', 'deco'));
      P.push(circ(1.115, 0, 0.042, '#5fd0ff', 'deco'));
      break;
    }
    case 'gravity_mace': {   // 12.5k: dark alloy haft holding a caged gravity orb (special 'gravity': launch skyward, then slam)
      const IND = '#2a2350', TEAL = '#5ff2d8', MAG = '#c86bff', CAGE = '#8a93a0';
      P.push(box(-0.18, 0.3, 0.055, '#1b1a24', 'grip', 0, { rounded: true }));
      P.push(...wrapDeco(-0.16, 0.22, 0.06, 4));
      P.push(box(0.3, 1.02, 0.065, '#3a3f52', 'head', 0, { rounded: true }));
      P.push(line([[0.36, 0.016], [0.98, 0.016]], TEAL, 0.012));
      P.push(box(0.97, 1.06, 0.2, COL.iron, 'deco'));
      P.push(line([[1.02, 0.1], [1.12, 0.27], [1.3, 0.31], [1.47, 0.2]], CAGE, 0.03), line([[1.02, -0.1], [1.12, -0.27], [1.3, -0.31], [1.47, -0.2]], CAGE, 0.03));
      P.push(circ(1.28, 0, 0.24, IND, 'head'));
      P.push(circ(1.28, 0, 0.24, MAG, 'deco', { hollow: true, lw: 0.025 }));
      P.push(circ(1.28, 0, 0.13, TEAL, 'deco'));
      P.push(circ(1.24, 0.045, 0.05, '#e8fffb', 'deco'));
      break;
    }
    case 'meteor_staff': {   // 17.5k: basalt staff with lava veins, a claw gripping a molten meteor (special 'meteor': meteor volley)
      const LAVA = '#ff7a2a', GLOW = '#ffc23d', ROCK = '#3a2f2c';
      P.push(box(-0.6, 1.62, 0.055, '#4a3a33', 'head', 0, { rounded: true }));
      P.push(...wrapDeco(-0.12, 0.12, 0.062, 3));
      P.push(line([[-0.5, 0.013], [1.5, 0.013]], '#6a5448', 0.012));
      P.push(line([[0.3, -0.018], [0.5, 0.014], [0.72, -0.016], [0.95, 0.015], [1.2, -0.014]], LAVA, 0.013));
      P.push(box(-0.68, -0.56, 0.085, ROCK, 'deco'));
      P.push(poly([[1.55, 0.03], [1.7, 0.23], [1.93, 0.31], [1.78, 0.14]], ROCK, 'deco'), poly([[1.55, -0.03], [1.7, -0.23], [1.93, -0.31], [1.78, -0.14]], ROCK, 'deco'));
      P.push(circ(1.9, 0, 0.22, '#5a3a2a', 'head'));
      P.push(line([[1.76, 0.06], [1.87, -0.02], [1.99, 0.09]], LAVA, 0.03), line([[1.83, -0.13], [1.95, -0.05], [2.03, -0.11]], GLOW, 0.024));
      P.push(circ(1.87, 0.08, 0.05, GLOW, 'deco'));
      break;
    }
    case 'sun_hammer': {   // 30k: gilded war hammer with a blazing sun emblem head (special 'sun': swings charge a supernova)
      const GOLD = '#f5c04a', GOLDD = '#b47a1e', SUN = '#ffe27a', FL = '#ff8a2a';
      P.push(box(-0.22, 0.32, 0.06, '#5a2e1a', 'grip', 0, { rounded: true }));
      P.push(...wrapDeco(-0.2, 0.26, 0.066, 5));
      P.push(circ(-0.25, 0, 0.05, GOLD, 'grip'));
      P.push(box(0.32, 1.2, 0.07, GOLDD, 'head', 0, { rounded: true }));
      P.push(line([[0.38, 0.018], [1.15, 0.018]], GOLD, 0.014));
      for (const x of [0.55, 0.85]) P.push(box(x, x + 0.06, 0.11, GOLD, 'deco'));
      P.push(box(1.18, 1.72, 0.48, GOLDD, 'head'));
      P.push(box(1.21, 1.69, 0.4, GOLD, 'deco'));
      P.push(spikes(1.45, 0, 0.19, 12, 0.1, FL));
      P.push(circ(1.45, 0, 0.19, SUN, 'deco'));
      P.push(circ(1.45, 0, 0.1, '#fff6d0', 'deco'));
      break;
    }
    case 'plasma_katana': {   // 50k: black hilt + chrome emitter and a magenta plasma blade (special 'plasma': beam extends while spinning, echo slashes)
      P.push(...wrapDeco(-0.24, 0.05, 0.05, 5));
      P.push(box(-0.24, 0.05, 0.05, COL.black, 'grip', 0, { rounded: true, drawHidden: true }));
      P.push(circ(-0.26, 0, 0.036, '#c9d1da', 'grip'));
      P.push(box(0.04, 0.17, 0.08, '#c9d1da', 'grip'));
      P.push(box(0.07, 0.14, 0.03, COL.black, 'deco', 0.022));
      P.push(poly([[0.17, -0.036], [1.18, -0.03], [1.3, 0], [1.18, 0.03], [0.17, 0.036]], '#ff3fd0', 'blade'));
      P.push(line([[0.19, 0], [1.2, 0]], '#ffe0f7', 0.026));
      break;
    }
    case 'shuriken': {   // ninja star: four-point steel star with a dark centre hole, held by its middle
      const pts = [];
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2, rr = i % 2 ? 0.1 : 0.3; pts.push([0.24 + Math.cos(a) * rr, Math.sin(a) * rr]); }
      P.push(box(-0.02, 0.08, 0.06, COL.black, 'grip', 0, { rounded: true, drawHidden: true }));
      P.push(poly(pts, COL.steel, 'blade'));
      P.push(line([[0.24, 0], [0.5, 0]], COL.steelL, 0.016), line([[0.24, 0], [0.24, 0.26]], COL.steelD, 0.016));
      P.push(circ(0.24, 0, 0.05, COL.dark, 'deco'));
      break;
    }
    case 'giant_hammer':   // Sir Pepperoni's boss-only sledge: long banded shaft, huge head with a pepperoni emblem
      P.push(box(-0.3, 0.35, 0.085, COL.woodD, 'grip', 0, { rounded: true }));
      P.push(...wrapDeco(-0.26, 0.3, 0.095, 6));
      P.push(box(0.35, 1.75, 0.085, COL.wood, 'head', 0, { rounded: true }));
      P.push(line([[0.4, 0.022], [1.7, 0.022]], COL.woodL, 0.016));
      P.push(box(0.9, 1.0, 0.11, COL.iron, 'deco'), box(1.5, 1.62, 0.11, COL.iron, 'deco'));
      P.push(box(1.62, 2.3, 0.78, COL.steelD, 'head'));
      P.push(box(1.62, 1.72, 0.86, COL.iron, 'deco'), box(2.2, 2.3, 0.86, COL.iron, 'deco'));
      P.push(box(1.78, 2.14, 0.06, COL.steelL, 'deco', 0.28));
      P.push(circ(1.96, 0, 0.2, '#c23b2c', 'deco'), circ(1.9, 0.06, 0.04, '#eeb1a0', 'deco'), circ(2.02, -0.05, 0.035, '#eeb1a0', 'deco'), circ(1.99, 0.09, 0.03, '#eeb1a0', 'deco'));
      break;
    case 'poleaxe':
      P.push(box(-0.55, 1.3, 0.045, COL.woodD, 'head', 0, { rounded: true }));
      P.push(...wrapDeco(-0.08, 0.08, 0.05, 2));
      P.push(poly([[1.02, -0.06], [1.1, -0.27], [1.3, -0.25], [1.3, 0.05]], COL.steel, 'blade'));
      P.push(poly([[1.05, 0.05], [1.25, 0.05], [1.2, 0.16]], COL.steelD, 'blade'));
      P.push(poly([[1.28, -0.035], [1.45, 0], [1.28, 0.035]], COL.steel, 'blade'));
      P.push(line([[1.12, -0.252], [1.29, -0.242]], COL.steelL, 0.018));
      P.push(line([[1.08, -0.04], [1.28, -0.02]], COL.steelD, 0.012));
      P.push(box(0.98, 1.08, 0.075, COL.iron, 'deco'));
      P.push(circ(1.2, -0.12, 0.018, COL.steelD, 'deco'));
      break;
    case 'executioner':
      P.push(...wrapDeco(-0.15, 0.2, 0.05, 4));
      P.push(box(-0.15, 0.2, 0.05, COL.black, 'grip', 0, { rounded: true, drawHidden: true }));
      P.push(circ(-0.16, 0, 0.04, COL.red, 'grip'));
      P.push(poly([[0.2, -0.05], [1.0, -0.09], [1.32, -0.03], [1.38, 0.09], [1.18, 0.26], [0.7, 0.28], [0.2, 0.12]], COL.steel, 'blade'));
      P.push(line([[0.25, -0.035], [1.3, -0.025]], COL.steelD, 0.02));
      P.push(line([[0.26, 0.105], [0.7, 0.262], [1.17, 0.242], [1.34, 0.09]], COL.steelL, 0.02));
      P.push(circ(1.05, 0.14, 0.035, COL.dark, 'deco'));
      P.push(box(0.18, 0.24, 0.2, COL.iron, 'deco', 0.03));
      break;
    case 'scythe':
      P.push(box(-0.5, 1.2, 0.05, COL.woodD, 'head', 0, { rounded: true }));
      P.push(...wrapDeco(-0.08, 0.08, 0.055, 2));
      P.push(box(0.5, 0.58, 0.1, COL.woodD, 'deco'));
      P.push(poly([[1.12, -0.04], [1.28, -0.02], [1.32, 0.3], [1.22, 0.72], [1.12, 0.74], [1.1, 0.4], [1.14, 0.05]], COL.steel, 'blade'));
      P.push(line([[1.3, 0.3], [1.2, 0.7]], COL.steelD, 0.012));
      P.push(line([[1.135, 0.07], [1.115, 0.4], [1.13, 0.71]], COL.steelL, 0.014));
      P.push(line([[-0.42, 0.014], [0.45, 0.014]], COL.wood, 0.012), line([[0.65, 0.014], [1.05, 0.014]], COL.wood, 0.012));
      P.push(box(1.06, 1.18, 0.085, COL.iron, 'deco'));
      break;
    case 'great_axe':
      P.push(box(-0.25, 1.35, 0.055, COL.woodD, 'head', 0, { rounded: true }));
      P.push(...wrapDeco(-0.2, 0.1, 0.06, 3));
      P.push(line([[0.15, 0.016], [1.0, 0.016]], COL.wood, 0.012));
      P.push(poly([[1.05, 0.03], [1.12, 0.36], [1.32, 0.43], [1.5, 0.3], [1.52, 0.03]], COL.steel, 'blade'));
      P.push(poly([[1.05, -0.03], [1.52, -0.03], [1.5, -0.3], [1.32, -0.43], [1.12, -0.36]], COL.steel, 'blade'));
      P.push(line([[1.14, 0.35], [1.32, 0.42], [1.49, 0.29]], COL.steelL, 0.02), line([[1.14, -0.35], [1.32, -0.42], [1.49, -0.29]], COL.steelL, 0.02));
      P.push(box(1.0, 1.55, 0.09, COL.iron, 'deco'));
      P.push(circ(1.28, 0, 0.035, COL.dark, 'deco'));
      break;
    case 'morning_star':
      P.push(box(-0.15, 0.35, 0.05, COL.woodD, 'grip', 0, { rounded: true }));
      P.push(...wrapDeco(-0.13, 0.25, 0.056, 4));
      P.push(box(0.35, 0.92, 0.07, COL.wood, 'head', 0, { rounded: true }));
      P.push(line([[0.4, 0.018], [0.9, 0.018]], COL.woodL, 0.012));
      P.push(box(0.88, 0.96, 0.1, COL.iron, 'deco'));
      P.push(spikes(1.1, 0, 0.18, 10, 0.1, COL.steelD));
      P.push(circ(1.1, 0, 0.19, COL.iron, 'head'));
      P.push(circ(1.1, 0, 0.11, COL.steelD, 'deco', { hollow: true, lw: 0.02 }));
      P.push(circ(1.05, 0.07, 0.045, COL.steelL, 'deco'));
      break;
    case 'halberd':
      P.push(box(-0.6, 1.55, 0.045, COL.woodD, 'head', 0, { rounded: true }));
      P.push(...wrapDeco(-0.1, 0.1, 0.052, 2), ...wrapDeco(0.7, 0.9, 0.052, 2));
      P.push(poly([[1.25, 0.03], [1.3, 0.34], [1.5, 0.37], [1.55, 0.03]], COL.steel, 'blade'));
      P.push(poly([[1.3, -0.03], [1.5, -0.03], [1.42, -0.19]], COL.steelD, 'blade'));
      P.push(poly([[1.55, -0.045], [1.95, 0], [1.55, 0.045]], COL.steel, 'blade'));
      P.push(line([[1.32, 0.34], [1.49, 0.36]], COL.steelL, 0.018), line([[1.58, 0.02], [1.9, 0.004]], COL.steelL, 0.008));
      P.push(box(1.2, 1.3, 0.08, COL.gold, 'deco'));
      P.push(line([[1.2, 0.03], [1.08, 0.12]], COL.red, 0.02), line([[1.2, -0.03], [1.08, -0.12]], COL.red, 0.02));
      break;
    case 'meteor_flail':
      P.push(box(-0.12, 0.45, 0.055, COL.black, 'grip', 0, { rounded: true }));
      P.push(...wrapDeco(-0.1, 0.25, 0.06, 4));
      P.push(box(0.4, 0.47, 0.07, COL.gold, 'deco'));
      chain = { start: [0.47, 0], links: 4, headMass: 0.6, linksMass: 0.16,
        head: [spikes(0.24, 0, 0.2, 11, 0.1, COL.iron), circ(0.24, 0, 0.22, '#3a3d44', 'head'),
          line([[0.12, 0.08], [0.2, 0.02], [0.3, 0.09]], '#ff8a2a', 0.022), line([[0.18, -0.1], [0.26, -0.03], [0.34, -0.11]], COL.yellow, 0.018),
          circ(0.17, 0.09, 0.045, '#5a5e66', 'deco')] };
      break;
    case 'dual_scythe': {
      // the top weapon: dark shaft held in the middle, a red scythe blade at each end (rotationally mirrored) + 2 end spikes
      const RED = '#c8322a', REDD = '#8e1f19', REDL = '#ff6b55';
      P.push(box(-1.05, 1.05, 0.05, '#2a2020', 'head', 0, { rounded: true }));
      P.push(...wrapDeco(-0.14, 0.14, 0.058, 3));
      P.push(box(-0.2, -0.15, 0.08, COL.gold, 'deco'), box(0.15, 0.2, 0.08, COL.gold, 'deco'));
      const blade = [[0.9, -0.03], [1.04, -0.02], [1.08, 0.3], [0.98, 0.7], [0.86, 0.74], [0.88, 0.38], [0.92, 0.05]];
      P.push(poly(blade, RED, 'blade'), poly(blade.map(([x, y]) => [-x, -y]), RED, 'blade'));
      P.push(line([[1.06, 0.3], [0.97, 0.69]], REDD, 0.016), line([[-1.06, -0.3], [-0.97, -0.69]], REDD, 0.016));
      P.push(line([[0.915, 0.07], [0.895, 0.38], [0.88, 0.7]], REDL, 0.014), line([[-0.915, -0.07], [-0.895, -0.38], [-0.88, -0.7]], REDL, 0.014));
      P.push(poly([[1.04, -0.045], [1.32, 0], [1.04, 0.045]], COL.steel, 'blade'), poly([[-1.04, 0.045], [-1.32, 0], [-1.04, -0.045]], COL.steel, 'blade'));
      P.push(box(0.84, 0.96, 0.085, COL.black, 'deco'), box(-0.96, -0.84, 0.085, COL.black, 'deco'));
      break;
    }
    default:
      return { prims: [], chain: null, sheath: null, flaps: null };
  }
  return { prims: P, chain, sheath, flaps };
}

const shapeCache = new Map();
export function weaponShapes(id) {
  if (!shapeCache.has(id)) shapeCache.set(id, shapesFor(weaponById(id)));
  return shapeCache.get(id);
}

// geometry ---------------------------------------------------------------------------------
function primArea(p) {
  if (p.t === 'box') return p.w * p.h;
  if (p.t === 'circle') return Math.PI * p.r * p.r;
  if (p.t === 'poly') { let a = 0; const n = p.pts.length; for (let i = 0; i < n; i++) { const [x1, y1] = p.pts[i], [x2, y2] = p.pts[(i + 1) % n]; a += x1 * y2 - x2 * y1; } return Math.abs(a) / 2; }
  return 0;
}
const isSolid = (p) => p.role !== 'deco' && (p.t === 'box' || p.t === 'circle' || p.t === 'poly');
const roleWeight = (r) => (r === 'grip' ? 0.6 : 1.4);

function xform(T, x, y) {
  const c = Math.cos(T.angle), s = Math.sin(T.angle);
  return V(T.x + c * x - s * y, T.y + s * x + c * y);
}
function primShape(pl, p, T) {
  if (p.t === 'box') return new pl.Box(p.w / 2, p.h / 2, xform(T, p.x, p.y), p.a + T.angle);
  if (p.t === 'circle') return new pl.Circle(xform(T, p.x, p.y), p.r);
  if (p.t === 'poly') return new pl.Polygon(p.pts.map(([x, y]) => xform(T, x, y)));
  return null;
}

let uid = 1;

/** Create a loose weapon in the world. Returns Weapon (null for fists). */
export function buildWeapon(physicsOrWorld, id, pos = { x: 0, y: 0 }, angle = 0, opts = {}) {
  const physics = physicsOrWorld.world ? physicsOrWorld : null;
  const world = physics ? physics.world : physicsOrWorld;
  const def = weaponById(id);
  if (def.kind === 'fist') return null;
  const cfg = opts.cfg || (physics && physics.cfg) || CONFIG;
  const shapes = weaponShapes(def.id);
  const w = {
    uid: uid++, id: def.id, def, kind: def.kind, special: def.special || null, shapes, cfg, physics, world,
    holder: null, hand: null, body: null, fixtures: [], links: [], head: null, chainJoints: [], handJoint: null,
    flapBodies: [], flapJoints: [],
    grip: { x: 0, y: 0, angle: 0 }, group: 0, noSelfCollideUntil: 0, stuck: null, destroyed: false,
    isBlade: def.kind === 'blade', prop: false,
    sheathed: !!shapes.sheath,
    returnTo: null, returnAt: 0,
  };
  createLooseBody(w, pos, angle, opts.velocity, opts.angularVelocity || 0);
  if (shapes.chain) buildChain(w);
  if (shapes.flaps) buildFlaps(w);
  if (physics) physics.weapons.add(w);
  return w;
}

/** A cosmetic physics prop (e.g. a discarded scabbard): looks like a weapon, never damages, can't be picked up. */
export function buildProp(physicsOrWorld, prims, mass, pos, angle = 0, opts = {}) {
  const physics = physicsOrWorld.world ? physicsOrWorld : null;
  const world = physics ? physics.world : physicsOrWorld;
  const cfg = opts.cfg || (physics && physics.cfg) || CONFIG;
  const w = {
    uid: uid++, id: opts.id || 'prop', def: { id: opts.id || 'prop', kind: 'prop', damage: 0, mass, length: 0.5, crit: 0 }, kind: 'prop', special: null,
    // prims are drawn; `solid` (or the solid prims among them) become fixtures
    shapes: { prims, solid: opts.solid || null, chain: null, sheath: null, flaps: null }, cfg, physics, world,
    holder: null, hand: null, body: null, fixtures: [], links: [], head: null, chainJoints: [], handJoint: null, flapBodies: [], flapJoints: [],
    grip: { x: 0, y: 0, angle: 0 }, group: opts.group || 0, noSelfCollideUntil: (physics ? physics.time : 0) + 0.4, stuck: null, destroyed: false,
    isBlade: false, prop: true, sheathed: false, returnTo: null, returnAt: 0, ttl: opts.ttl || 0,
  };
  createLooseBody(w, pos, angle, opts.velocity, opts.angularVelocity || 0);
  if (physics) physics.weapons.add(w);
  return w;
}

// Held weapons pass through floors/walls (still hit bodies and other weapons); loose ones rest on the ground.
// Weapons resting on a rack don't collide with fighters either (so a full rack never blocks anyone).
const maskFor = (w) => (w.holder ? ALL & ~CAT.STATIC : w.onRack ? ALL & ~CAT.PART : ALL);

function addFixtures(w, body, group, prims, massTotal, opts = {}) {
  const pl = window.planck;
  let wsum = 0;
  for (const p of prims) if (isSolid(p)) wsum += primArea(p) * roleWeight(p.role);
  const out = [];
  for (const p of prims) {
    if (!isSolid(p)) continue;
    const density = wsum > 0 ? (massTotal * roleWeight(p.role)) / wsum : 1;
    const shape = primShape(pl, p, opts.frame || w.grip);
    const damaging = !w.prop && p.role !== 'grip' && p.role !== 'flap' && !(w.sheathed && p.role === 'blade');
    const f = body.createFixture(shape, {
      density, friction: w.cfg.weapons.friction ?? 0.2, restitution: w.cfg.weapons.restitution ?? 0.1,
      filterGroupIndex: group, filterCategoryBits: CAT.WEAPON, filterMaskBits: maskFor(w),
      userData: { kind: 'weapon', weapon: w, damaging, blade: p.role === 'blade', role: p.role },
    });
    out.push(f);
  }
  return out;
}

function handleMass(w) {
  const c = w.shapes.chain;
  let m = c ? w.def.mass * (1 - c.headMass - c.linksMass) : w.def.mass;
  if (w.shapes.flaps) m -= w.shapes.flaps.massEach * w.shapes.flaps.parts.length;
  return Math.max(0.1, m);
}

function createLooseBody(w, pos, angle, vel, angVel) {
  const body = w.world.createBody({
    type: 'dynamic', position: V(pos.x, pos.y), angle, bullet: true,
    linearDamping: 0.05, angularDamping: 0.15,
    linearVelocity: vel ? V(vel.x, vel.y) : V(0, 0), angularVelocity: angVel || 0,
  });
  w.grip = { x: 0, y: 0, angle: 0 };
  w.body = body;
  w.fixtures = addFixtures(w, body, w.group, w.shapes.solid || w.shapes.prims, handleMass(w));
  if (w.sheathed && w.shapes.sheath.solid) w.fixtures.push(...addFixtures(w, body, w.group, w.shapes.sheath.solid, w.shapes.sheath.mass));
  body.setUserData({ kind: 'weapon', weapon: w });
  if (w.physics) w.physics.tagBody(body);
  return body;
}

// ---- chain links (nunchaku / chain mace) ---------------------------------------------------
function buildChain(w) {
  const pl = window.planck, C = w.shapes.chain, cfg = w.cfg.weapons;
  const fr = frameOf(w);
  const dx = Math.cos(fr.angle), dy = Math.sin(fr.angle);
  const sx = fr.x + dx * C.start[0] - dy * C.start[1], sy = fr.y + dy * C.start[0] + dx * C.start[1];
  const n = C.links, L = cfg.chainLinkLen, r = cfg.chainLinkR;
  const linkArea = Math.PI * r * r;
  const linkDensity = (w.def.mass * C.linksMass) / (n * linkArea);
  for (let i = 0; i < n; i++) {
    const cx = sx + dx * L * (i + 0.5), cy = sy + dy * L * (i + 0.5);
    const b = w.world.createBody({ type: 'dynamic', position: V(cx, cy), angle: fr.angle, bullet: true, linearDamping: 0.1, angularDamping: 0.3 });
    b.createFixture(new pl.Circle(r), { density: linkDensity, friction: 0.4, filterGroupIndex: w.group, filterCategoryBits: CAT.WEAPON, filterMaskBits: maskFor(w),
      userData: { kind: 'weapon', weapon: w, damaging: false, blade: false, role: 'link' } });
    b.setUserData({ kind: 'weapon', weapon: w, link: i });
    if (w.physics) w.physics.tagBody(b);
    w.links.push(b);
  }
  const hx = sx + dx * L * n, hy = sy + dy * L * n;
  const head = w.world.createBody({ type: 'dynamic', position: V(hx, hy), angle: fr.angle, bullet: true, linearDamping: 0.05, angularDamping: 0.2 });
  w.headFixtures = addFixtures(w, head, w.group, C.head, w.def.mass * C.headMass, { frame: { x: 0, y: 0, angle: 0 } });
  head.setUserData({ kind: 'weapon', weapon: w, head: true });
  if (w.physics) w.physics.tagBody(head);
  w.head = head;
  linkChain(w);
}

function linkChain(w) {
  const pl = window.planck, C = w.shapes.chain, L = w.cfg.weapons.chainLinkLen;
  for (const j of w.chainJoints) if (!j.__dead) (w.physics ? w.physics.destroyJoint(j) : w.world.destroyJoint(j));
  w.chainJoints = [];
  const start = worldFromFrame(w, C.start[0], C.start[1]);
  let prev = w.body, anchor = start;
  for (let i = 0; i < w.links.length; i++) {
    const b = w.links[i];
    const j = w.world.createJoint(new pl.RevoluteJoint({ collideConnected: false }, prev, b, anchor));
    w.chainJoints.push(j);
    const c = b.getPosition(); const a = b.getAngle();
    anchor = V(c.x + Math.cos(a) * L / 2, c.y + Math.sin(a) * L / 2);
    prev = b;
  }
  if (w.head) {
    w.chainJoints.push(w.world.createJoint(new pl.RevoluteJoint({ collideConnected: false }, prev, w.head, w.head.getPosition())));
    // a heavy head on light links makes the joint chain stretch (meteor flail sank metres through the floor):
    // cap the handle -> head distance with a rope so the chain can never grow longer than its links
    w.chainJoints.push(w.world.createJoint(new pl.RopeJoint({
      collideConnected: false, maxLength: L * w.links.length + 0.03, localAnchorA: w.body.getLocalPoint(start), localAnchorB: V(0, 0),
    }, w.body, w.head)));
  }
}

function placeChain(w) {
  // teleport links/head to hang off the handle so re-attaching doesn't yank
  const C = w.shapes.chain; if (!C) return;
  const fr = frameOf(w), L = w.cfg.weapons.chainLinkLen;
  const dx = Math.cos(fr.angle), dy = Math.sin(fr.angle);
  const s = worldFromFrame(w, C.start[0], C.start[1]);
  const vel = w.body.getLinearVelocityFromWorldPoint(s);
  w.links.forEach((b, i) => {
    b.setPosition(V(s.x + dx * L * (i + 0.5), s.y + dy * L * (i + 0.5))); b.setAngle(fr.angle);
    b.setLinearVelocity(vel); b.setAngularVelocity(0);
  });
  if (w.head) { w.head.setPosition(V(s.x + dx * L * w.links.length, s.y + dy * L * w.links.length)); w.head.setAngle(fr.angle); w.head.setLinearVelocity(vel); w.head.setAngularVelocity(0); }
}

// ---- loose handle flaps (butterfly knife) ------------------------------------------------
function buildFlaps(w) {
  const F = w.shapes.flaps;
  const fr = frameOf(w);
  const pv = worldFromFrame(w, F.pivot[0], F.pivot[1]);
  for (const part of F.parts) {
    const b = w.world.createBody({ type: 'dynamic', position: V(pv.x, pv.y), angle: fr.angle + part.rest, bullet: true, linearDamping: 0.1, angularDamping: 0.6 });
    b.__flapPrims = part.prims; b.__rest = part.rest;
    addFixtures(w, b, w.group, part.prims, F.massEach, { frame: { x: 0, y: 0, angle: 0 } });
    b.setUserData({ kind: 'weapon', weapon: w, flap: true });
    if (w.physics) w.physics.tagBody(b);
    w.flapBodies.push(b);
  }
  linkFlaps(w);
}
function linkFlaps(w) {
  const pl = window.planck, F = w.shapes.flaps;
  for (const j of w.flapJoints) if (!j.__dead) (w.physics ? w.physics.destroyJoint(j) : w.world.destroyJoint(j));
  w.flapJoints = [];
  const fr = frameOf(w);
  const pv = worldFromFrame(w, F.pivot[0], F.pivot[1]);
  for (const b of w.flapBodies) {
    b.setPosition(V(pv.x, pv.y)); b.setAngle(fr.angle + b.__rest);
    b.setLinearVelocity(w.body.getLinearVelocityFromWorldPoint(pv)); b.setAngularVelocity(w.body.getAngularVelocity());
    w.flapJoints.push(w.world.createJoint(new pl.RevoluteJoint({ collideConnected: false, enableLimit: true, lowerAngle: F.lo, upperAngle: F.hi }, w.body, b, pv)));
  }
}

export function frameOf(w) {
  const b = w.body;
  const p = b.getWorldPoint(V(w.grip.x, w.grip.y));
  return { x: p.x, y: p.y, angle: b.getAngle() + w.grip.angle };
}
export function worldFromFrame(w, x, y) {
  const fr = frameOf(w);
  const c = Math.cos(fr.angle), s = Math.sin(fr.angle);
  return V(fr.x + c * x - s * y, fr.y + s * x + c * y);
}
export function weaponTip(w) {
  return worldFromFrame(w, w.def.length * 0.7, 0);
}

function extraBodies(w) { return [...w.links, w.head, ...w.flapBodies].filter(Boolean); }

function setGroup(w, group) {
  w.group = group;
  const all = [w.body, ...extraBodies(w)];
  for (const b of all) for (let f = b.getFixtureList(); f; f = f.getNext()) f.setFilterData({ groupIndex: group, categoryBits: CAT.WEAPON, maskBits: maskFor(w) });
}
/** A held weapon lives on the forearm body, so setGroup also re-filtered the hand's own fixtures (pass through statics);
 *  give them back their body-part filter when the weapon leaves the hand, or that fist could never touch / grab a wall again. */
function restoreHand(arm, group) {
  if (!arm || arm.__removed) return;
  for (let f = arm.getFixtureList(); f; f = f.getNext()) {
    const ud = f.getUserData();
    if (ud && ud.kind === 'part') f.setFilterData({ groupIndex: group, categoryBits: ud.detached ? CAT.DEBRIS : CAT.PART, maskBits: ALL });
  }
}

function gripFor(w, fighter) {
  const rd = fighter.ragdoll;
  return { x: 0, y: -rd.dims.fa / 2, angle: -Math.PI / 2 + (w.cfg.weapons.gripTilt || 0) * (fighter.facing || 1) };
}

function rebuildExtras(w) {
  if (w.shapes.chain) { placeChain(w); linkChain(w); }
  if (w.shapes.flaps) linkFlaps(w);
}

/** Rebuild the held fixtures with the grip mirrored for the holder's current facing. */
export function regripWeapon(w) {
  if (w.destroyed || !w.holder) return;
  const physics = w.physics, arm = w.body, rd = w.holder.ragdoll;
  const g = gripFor(w, w.holder);
  if (Math.abs(g.angle - w.grip.angle) < 1e-6) return;
  for (const f of w.fixtures) { if (physics) physics.destroyFixture(arm, f); else arm.destroyFixture(f); }
  w.grip = g;
  w.fixtures = addFixtures(w, arm, rd.group, w.shapes.prims, handleMass(w));
  if (w.sheathed && w.shapes.sheath.solid) w.fixtures.push(...addFixtures(w, arm, rd.group, w.shapes.sheath.solid, w.shapes.sheath.mass));
  rebuildExtras(w);
}

/** Put a loose weapon into a fighter's hand ('F' front, 'B' back). */
export function attachWeapon(w, fighter, hand = 'F') {
  if (w.destroyed || w.holder || w.prop) return false;
  const rd = fighter.ragdoll, physics = w.physics;
  const arm = rd.parts['foreArm' + hand];
  if (!arm || rd.detached['foreArm' + hand]) return false;
  if (w.body && w.body !== arm) { if (physics) physics.destroyBody(w.body); else w.world.destroyBody(w.body); }
  w.returnTo = null;
  w.onRack = false;
  w.grip = gripFor(w, fighter);
  w.body = arm; w.holder = fighter; w.hand = hand;
  w.fixtures = addFixtures(w, arm, rd.group, w.shapes.prims, handleMass(w));
  if (w.sheathed && w.shapes.sheath.solid) w.fixtures.push(...addFixtures(w, arm, rd.group, w.shapes.sheath.solid, w.shapes.sheath.mass));
  arm.setBullet(true);
  setGroup(w, rd.group);
  w.noSelfCollideUntil = 0;
  rebuildExtras(w);
  if (w.kind === 'pole') {
    const other = rd.parts['foreArm' + (hand === 'F' ? 'B' : 'F')];
    // two-handed grip only when the other hand is empty (dual wield keeps poles one-handed)
    const otherBusy = fighter.weaponIn ? fighter.weaponIn(hand === 'F' ? 'B' : 'F') : null;
    if (other && !rd.detached['foreArm' + (hand === 'F' ? 'B' : 'F')] && !otherBusy) {
      const pl = window.planck;
      const a = rd.handPoint(hand), b = rd.handPoint(hand === 'F' ? 'B' : 'F');
      w.handJoint = w.world.createJoint(new pl.DistanceJoint({ frequencyHz: w.cfg.weapons.poleHandsFreq, dampingRatio: 0.7, length: 0.03, collideConnected: false }, arm, other, a, b));
      rd.setTwoHand(true);
    }
  }
  return true;
}

/** Release a held weapon into the world at the hand's current pose/velocity. opts.velocity overrides. */
export function dropWeapon(w, opts = {}) {
  if (w.destroyed || !w.holder) return false;
  const physics = w.physics, arm = w.body, rd = w.holder.ragdoll;
  const fr = frameOf(w);
  const gp = V(fr.x, fr.y);
  const vel = opts.velocity || (arm.__removed ? V(0, 0) : arm.getLinearVelocityFromWorldPoint(gp));
  const av = opts.angularVelocity ?? (arm.__removed ? 0 : arm.getAngularVelocity());
  for (const f of w.fixtures) { if (physics) physics.destroyFixture(arm, f); else arm.destroyFixture(f); }
  w.fixtures = [];
  restoreHand(arm, rd.group);
  if (w.stuck) { (physics ? physics.destroyJoint(w.stuck) : w.world.destroyJoint(w.stuck)); w.stuck = null; }
  if (w.handJoint) { (physics ? physics.destroyJoint(w.handJoint) : w.world.destroyJoint(w.handJoint)); w.handJoint = null; rd.setTwoHand(false); }
  w.holder = null; w.hand = null;
  w.group = rd.group;
  w.noSelfCollideUntil = (physics ? physics.time : 0) + w.cfg.weapons.dropSelfCollideDelay;
  createLooseBody(w, fr, fr.angle, vel, av);
  rebuildExtras(w);
  setGroup(w, w.group); // refresh masks now so chain links/head collide with the floor again
  return true;
}

/** Thunder hammer: fly off along the hit direction, then come back to the owner. */
export function throwWeapon(w, owner, vel) {
  if (!w.holder || w.destroyed) return false;
  dropWeapon(w, { velocity: V(vel.x, vel.y), angularVelocity: 18 * (vel.x < 0 ? 1 : -1) });
  w.returnTo = owner;
  w.returnAt = (w.physics ? w.physics.time : 0) + (w.cfg.weapons.returnDelay ?? 0.4);
  return true;
}

/** Katana: the scabbard flies off on the first swing; blade fixtures become live. */
export function unsheathe(w) {
  if (!w.sheathed || w.destroyed) return;
  const S = w.shapes.sheath;
  w.sheathed = false;
  for (const f of w.fixtures) {
    const ud = f.getUserData();
    if (ud.role === 'blade') ud.damaging = !w.prop;
  }
  // rebuild so the scabbard's solid fixtures go away
  if (w.holder) {
    const arm = w.body, physics = w.physics, rd = w.holder.ragdoll;
    for (const f of w.fixtures) { if (physics) physics.destroyFixture(arm, f); else arm.destroyFixture(f); }
    w.fixtures = addFixtures(w, arm, rd.group, w.shapes.prims, handleMass(w));
  }
  // spawn the scabbard at the hand (the blade tip may be inside the floor) and fling it forward/up
  const fr = frameOf(w);
  const base = w.body.getLinearVelocityFromWorldPoint(V(fr.x, fr.y));
  const fx = w.holder ? w.holder.facing : 1;
  buildProp(w.physics || w.world, S.prims, S.mass, { x: fr.x, y: fr.y + 0.1 }, fr.angle,
    { id: 'scabbard', solid: S.solid, velocity: { x: base.x * 0.5 + fx * 3, y: Math.max(2.5, base.y * 0.5 + 3) }, angularVelocity: (Math.random() - 0.5) * 12, group: w.group, ttl: 10 });
}

export function destroyWeapon(w) {
  if (w.destroyed) return;
  w.destroyed = true;
  const physics = w.physics;
  const kill = (b) => { if (b && !b.__dead) (physics ? physics.destroyBody(b) : w.world.destroyBody(b)); };
  if (w.holder) { for (const f of w.fixtures) (physics ? physics.destroyFixture(w.body, f) : w.body.destroyFixture(f)); restoreHand(w.body, w.holder.ragdoll.group); if (w.handJoint) physics.destroyJoint(w.handJoint); w.holder.ragdoll.setTwoHand(false); }
  else kill(w.body);
  for (const b of extraBodies(w)) kill(b);
  w.holder = null; w.fixtures = []; w.links = []; w.head = null; w.flapBodies = [];
  if (physics) physics.weapons.delete(w);
}

/** World position of a point given in the weapon's own frame (grip at origin, +x along the weapon). */
export function weaponPoint(w, lx, ly = 0) {
  return worldFromFrame(w, lx, ly);
}

/** Per-step maintenance for all weapons: self-collision timers, specials, out-of-world cleanup. */
export function updateWeapons(physics, dt, deathY = physics.cfg.deathY) {
  const cfg = physics.cfg.weapons;
  for (const w of physics.weapons) {
    if (w.destroyed) continue;
    // katana leaves its scabbard on the first real swing
    if (w.sheathed && w.holder && w.holder.isSpinning) unsheathe(w);
    if (!w.holder) {
      // knocked off its rack: behave like a normal loose weapon again
      if (w.onRack && w.body && w.body.getLinearVelocity().lengthSquared() > 9) { w.onRack = false; setGroup(w, w.group); }
      if (w.group !== 0 && physics.time > w.noSelfCollideUntil) setGroup(w, 0);
      if (w.ttl) { w.ttl -= dt; if (w.ttl <= 0) { destroyWeapon(w); continue; } }
      if (w.body.getPosition().y < deathY - 4) { destroyWeapon(w); continue; }
      // returning hammer
      if (w.returnTo) {
        const o = w.returnTo;
        if (o.dead || o.weapon || o.ragdoll.detached.foreArmF) { w.returnTo = null; w.body.setGravityScale(1); continue; }
        if (physics.time >= w.returnAt) {
          const hp = o.ragdoll.handPoint('F');
          const p = w.body.getWorldCenter();
          const dx = hp.x - p.x, dy = hp.y - p.y, d = Math.hypot(dx, dy);
          if (d < (cfg.returnCatch ?? 0.55)) {
            w.body.setGravityScale(1);
            if (o.pickUp(w, 'F')) { if (o.hooks && o.hooks.onGrab) o.hooks.onGrab(o, w); }
            continue;
          }
          const sp = cfg.returnSpeed ?? 13;
          w.body.setGravityScale(0);
          w.body.setLinearVelocity(V((dx / d) * sp, (dy / d) * sp));
          w.body.setAngularVelocity(20);
        }
      }
    } else if (w.head && !w.head.__dead) {
      supportChain(physics, w);
    }
  }
}

// Held chain weapons pass through statics like every held tool, but a link / head that ends up below a floor the
// hand is over gets put back on top of that surface (it rests and skids on the floor instead of sinking through
// the map, and can never get trapped underneath a slab).
function supportChain(physics, w) {
  const rd = w.holder.ragdoll;
  if (rd.detached['foreArm' + (w.hand || 'F')]) return;
  const hp = rd.handPoint(w.hand || 'F');
  for (const b of [...w.links, w.head]) {
    if (!b || b.__dead) continue;
    const p = b.getPosition();
    if (p.y >= hp.y) continue;
    let top = null;
    physics.world.rayCast(V(p.x, hp.y), V(p.x, p.y - 0.5), (fx, point, normal, fraction) => {
      const ud = fx.getUserData();
      if (!ud || ud.kind !== 'static' || normal.y < 0.5) return -1;
      top = point.y;
      return fraction;
    });
    if (top === null) continue;
    let r = w.cfg.weapons.chainLinkR || 0.05;
    if (b === w.head) for (let f = b.getFixtureList(); f; f = f.getNext()) { const bb = f.getAABB(0); r = Math.max(r, p.y - bb.lowerBound.y); }
    if (p.y - r >= top) continue;
    b.setPosition(V(p.x, top + r));
    const v = b.getLinearVelocity();
    if (v.y < 0) b.setLinearVelocity(V(v.x * 0.9, 0));
  }
}

// drawing -------------------------------------------------------------------------------------
function drawPrims(ctx, prims) {
  for (const p of prims) {
    if (p.drawHidden) continue;
    if (p.t === 'box') {
      if (p.rounded) {
        ctx.strokeStyle = p.fill; ctx.lineWidth = p.h; ctx.lineCap = 'round';
        const c = Math.cos(p.a), s = Math.sin(p.a), hw = Math.max(0.001, p.w / 2 - p.h / 2);
        ctx.beginPath(); ctx.moveTo(p.x - c * hw, p.y - s * hw); ctx.lineTo(p.x + c * hw, p.y + s * hw); ctx.stroke();
      } else {
        ctx.fillStyle = p.fill;
        if (p.a) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); }
        else ctx.fillRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h);
      }
    } else if (p.t === 'circle') {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      if (p.hollow) { ctx.strokeStyle = p.stroke || p.fill; ctx.lineWidth = p.lw || 0.01; ctx.stroke(); }
      else { ctx.fillStyle = p.fill; ctx.fill(); }
    } else if (p.t === 'poly') {
      ctx.fillStyle = p.fill; ctx.beginPath();
      p.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath(); ctx.fill();
    } else if (p.t === 'line') {
      ctx.strokeStyle = p.stroke; ctx.lineWidth = p.lw; ctx.lineCap = 'round'; ctx.beginPath();
      p.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
    } else if (p.t === 'spikes') {
      ctx.fillStyle = p.fill; ctx.beginPath();
      for (let i = 0; i < p.n; i++) {
        const a = (i / p.n) * Math.PI * 2, a1 = a - 0.18, a2 = a + 0.18;
        ctx.moveTo(p.x + Math.cos(a1) * p.r, p.y + Math.sin(a1) * p.r);
        ctx.lineTo(p.x + Math.cos(a) * (p.r + p.len), p.y + Math.sin(a) * (p.r + p.len));
        ctx.lineTo(p.x + Math.cos(a2) * p.r, p.y + Math.sin(a2) * p.r);
      }
      ctx.fill();
    }
  }
}

/** Draw a weapon (held or loose) in world space; ctx must already be in camera transform. */
export function drawWeapon(ctx, w) {
  if (w.destroyed || !w.body || w.body.__removed) return;
  const fr = frameOf(w);
  const C = w.shapes.chain;
  if (C) {
    // chain line first (under everything)
    const s = worldFromFrame(w, C.start[0], C.start[1]);
    ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.035; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(s.x, s.y);
    for (const l of w.links) { const p = l.getPosition(); ctx.lineTo(p.x, p.y); }
    if (w.head) { const p = w.head.getPosition(); ctx.lineTo(p.x, p.y); }
    ctx.stroke();
    const lr = w.cfg.weapons.chainLinkR;
    ctx.fillStyle = COL.steel; ctx.beginPath();
    for (const l of w.links) { const p = l.getPosition(); ctx.moveTo(p.x + lr, p.y); ctx.arc(p.x, p.y, lr, 0, Math.PI * 2); }
    ctx.fill();
    ctx.fillStyle = COL.steelD; ctx.beginPath();
    for (const l of w.links) { const p = l.getPosition(); ctx.moveTo(p.x + lr * 0.45, p.y); ctx.arc(p.x, p.y, lr * 0.45, 0, Math.PI * 2); }
    ctx.fill();
    if (w.head) {
      const p = w.head.getPosition();
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(w.head.getAngle()); drawPrims(ctx, C.head); ctx.restore();
    }
  }
  for (const b of w.flapBodies) {
    if (b.__removed) continue;
    const p = b.getPosition();
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(b.getAngle()); drawPrims(ctx, b.__flapPrims); ctx.restore();
  }
  ctx.save(); ctx.translate(fr.x, fr.y); ctx.rotate(fr.angle);
  drawPrims(ctx, w.shapes.prims);
  if (w.sheathed && w.shapes.sheath) drawPrims(ctx, w.shapes.sheath.prims);
  ctx.restore();
}

function primBounds(prims, b) {
  for (const p of prims) {
    if (p.t === 'box') { const hw = Math.abs(Math.cos(p.a)) * p.w / 2 + Math.abs(Math.sin(p.a)) * p.h / 2, hh = Math.abs(Math.sin(p.a)) * p.w / 2 + Math.abs(Math.cos(p.a)) * p.h / 2; b.x0 = Math.min(b.x0, p.x - hw); b.x1 = Math.max(b.x1, p.x + hw); b.y0 = Math.min(b.y0, p.y - hh); b.y1 = Math.max(b.y1, p.y + hh); }
    else if (p.t === 'circle') { b.x0 = Math.min(b.x0, p.x - p.r); b.x1 = Math.max(b.x1, p.x + p.r); b.y0 = Math.min(b.y0, p.y - p.r); b.y1 = Math.max(b.y1, p.y + p.r); }
    else if (p.t === 'spikes') { const R = p.r + p.len; b.x0 = Math.min(b.x0, p.x - R); b.x1 = Math.max(b.x1, p.x + R); b.y0 = Math.min(b.y0, p.y - R); b.y1 = Math.max(b.y1, p.y + R); }
    else if (p.pts) for (const [x, y] of p.pts) { b.x0 = Math.min(b.x0, x); b.x1 = Math.max(b.x1, x); b.y0 = Math.min(b.y0, y); b.y1 = Math.max(b.y1, y); }
  }
  return b;
}

/** Draw a shop icon for a weapon id into a w x h box (ctx in pixels, y-down). */
export function drawWeaponIcon(ctx, id, w, h, opts = {}) {
  const def = weaponById(id);
  const cfg = opts.cfg || CONFIG;
  ctx.save();
  ctx.translate(w / 2, h / 2);
  if (def.kind === 'fist') {
    // a simple round fist
    const r = Math.min(w, h) * 0.28;
    ctx.fillStyle = opts.body || '#f2eee6';
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#c9bfae'; ctx.lineWidth = Math.max(1, r * 0.12);
    for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(-r * 0.55, i * r * 0.38); ctx.lineTo(r * 0.55, i * r * 0.38); ctx.stroke(); }
    ctx.restore();
    return;
  }
  const shapes = weaponShapes(id);
  const b = primBounds(shapes.prims, { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity });
  const C = shapes.chain, F = shapes.flaps;
  let chainLen = 0;
  if (C) { chainLen = C.links * cfg.weapons.chainLinkLen; const hb = primBounds(C.head, { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity }); b.x1 = Math.max(b.x1, C.start[0] + chainLen + hb.x1); b.y0 = Math.min(b.y0, hb.y0); b.y1 = Math.max(b.y1, hb.y1); }
  if (F) { for (const part of F.parts) { const fb = primBounds(part.prims, { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity }); b.x0 = Math.min(b.x0, F.pivot[0] - fb.x1); } }
  const ang = opts.angle ?? -Math.PI / 4;
  const len = b.x1 - b.x0, thick = b.y1 - b.y0;
  const pad = opts.pad ?? 0.12;
  // rotated bounding box size
  const rw = Math.abs(Math.cos(ang)) * len + Math.abs(Math.sin(ang)) * thick;
  const rh = Math.abs(Math.sin(ang)) * len + Math.abs(Math.cos(ang)) * thick;
  const sc = Math.min((w * (1 - pad * 2)) / rw, (h * (1 - pad * 2)) / rh);
  ctx.scale(sc, sc);
  ctx.rotate(ang);
  ctx.translate(-(b.x0 + b.x1) / 2, -(b.y0 + b.y1) / 2);
  if (F) {
    for (const part of F.parts) { ctx.save(); ctx.translate(F.pivot[0], F.pivot[1]); ctx.rotate(part.rest); drawPrims(ctx, part.prims); ctx.restore(); }
  }
  drawPrims(ctx, shapes.prims);
  if (shapes.sheath && opts.sheathed) drawPrims(ctx, shapes.sheath.prims);
  if (C) {
    ctx.strokeStyle = COL.steelD; ctx.lineWidth = 0.035; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(C.start[0], C.start[1]); ctx.lineTo(C.start[0] + chainLen, C.start[1]); ctx.stroke();
    const lr = cfg.weapons.chainLinkR;
    for (let i = 0; i < C.links; i++) {
      const lx = C.start[0] + cfg.weapons.chainLinkLen * (i + 0.5);
      ctx.fillStyle = COL.steel; ctx.beginPath(); ctx.arc(lx, C.start[1], lr, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = COL.steelD; ctx.beginPath(); ctx.arc(lx, C.start[1], lr * 0.45, 0, Math.PI * 2); ctx.fill();
    }
    ctx.save(); ctx.translate(C.start[0] + chainLen, C.start[1]); drawPrims(ctx, C.head); ctx.restore();
  }
  ctx.restore();
}

export { COL as WEAPON_COLORS };
