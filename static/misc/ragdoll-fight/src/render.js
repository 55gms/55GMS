// Camera + world drawing (arena statics, fighters, weapons, debug). fx.js draws in the same camera space.
import { CONFIG } from './config.js';
import { drawWeapon } from './weapons.js';
import { skinById } from './catalog.js';
import { HATS_EXTRA, LOOKS_EXTRA, HAT_LOOK_EXTRA } from './art/characters.js';
import { BG_THEMES_EXTRA } from './art/themes.js';

const R = CONFIG.render;

// Accepts '#rrggbb' or 'rgb(r,g,b)' (mixColor returns the latter, and results get mixed again).
function hexToRgb(h) {
  if (h.charCodeAt(0) !== 35) {
    const m = h.match(/\d+/g);
    return m ? [+m[0], +m[1], +m[2]] : [0, 0, 0];
  }
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const rgbCache = new Map();
export function mixColor(a, b, t) {
  const key = a + b + (t * 64 | 0);
  let c = rgbCache.get(key);
  if (c) return c;
  const A = hexToRgb(a), B = hexToRgb(b);
  const r = Math.round(A[0] + (B[0] - A[0]) * t), g = Math.round(A[1] + (B[1] - A[1]) * t), bl = Math.round(A[2] + (B[2] - A[2]) * t);
  c = `rgb(${r},${g},${bl})`;
  if (rgbCache.size < 2000) rgbCache.set(key, c);
  return c;
}

/**
 * createCamera({minZoom, maxZoom, smooth}) -> camera
 * camera.x/y (world metres, y-up), camera.zoom (px per metre), camera.shakeX/shakeY (px, set by fx).
 * camera.follow(targets, view, dt) auto-frames [{x,y}] with smoothing. camera.toScreen(x,y) / toWorld(sx,sy) / apply(ctx).
 */
export function createCamera(o = {}) {
  const cam = {
    x: 0, y: 1.2, zoom: R.pxPerMeter, shakeX: 0, shakeY: 0,
    minZoom: o.minZoom ?? R.minZoom, maxZoom: o.maxZoom ?? R.maxZoom, smooth: o.smooth ?? R.camSmooth,
    padX: o.padX ?? R.padX, padY: o.padY ?? R.padY,
    view: { width: 800, height: 600, dpr: 1 },
    target: { x: 0, y: 1.2, zoom: R.pxPerMeter },
    bounds: o.bounds || null, // {minX, maxX, minY, maxY} optional world clamp
    setView(view) { cam.view = view; },
    frameTargets(targets) {
      if (!targets.length) return;
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const t of targets) {
        const px = t.x, py = t.y;
        x0 = Math.min(x0, px - cam.padX); x1 = Math.max(x1, px + cam.padX);
        y0 = Math.min(y0, py - cam.padY * 0.8); y1 = Math.max(y1, py + cam.padY);
      }
      if (cam.bounds) { x0 = Math.max(x0, cam.bounds.minX); x1 = Math.min(x1, cam.bounds.maxX); y0 = Math.max(y0, cam.bounds.minY); y1 = Math.min(y1, cam.bounds.maxY); }
      const w = Math.max(0.5, x1 - x0), h = Math.max(0.5, y1 - y0);
      // min/max zoom are tuned for a 1920x1080 view: scale them with the window so smaller or browser-zoomed
      // screens (e.g. 1366x768, 150%) frame the same amount of the world instead of cropping in
      const fit = Math.max(0.4, Math.min(cam.view.width / 1920, cam.view.height / 1080));
      const zoom = Math.max(cam.minZoom * fit, Math.min(cam.maxZoom * fit, Math.min(cam.view.width / w, cam.view.height / h)));
      cam.target.x = (x0 + x1) / 2; cam.target.y = (y0 + y1) / 2; cam.target.zoom = zoom;
    },
    follow(targets, view, dt) {
      if (view) cam.view = view;
      cam.frameTargets(targets);
      const k = 1 - Math.exp(-cam.smooth * dt);
      cam.x += (cam.target.x - cam.x) * k;
      cam.y += (cam.target.y - cam.y) * k;
      cam.zoom += (cam.target.zoom - cam.zoom) * k * 0.8;
    },
    snap(targets, view) { if (view) cam.view = view; cam.frameTargets(targets); cam.x = cam.target.x; cam.y = cam.target.y; cam.zoom = cam.target.zoom; },
    /** world -> CSS pixels: [sx, sy] (shake offset included) */
    toScreen(x, y) {
      return [cam.view.width / 2 + (x - cam.x) * cam.zoom + cam.shakeX, cam.view.height / 2 - (y - cam.y) * cam.zoom + cam.shakeY];
    },
    /** CSS pixels -> world: {x, y} */
    toWorld(sx, sy) {
      return { x: (sx - cam.shakeX - cam.view.width / 2) / cam.zoom + cam.x, y: -(sy - cam.shakeY - cam.view.height / 2) / cam.zoom + cam.y };
    },
    /** Compose the camera onto ctx's current transform (base). Pass base=null to use the current ctx transform. */
    apply(ctx, base) {
      const b = base || baseTransform(ctx, cam.view);
      ctx.setTransform(b);
      ctx.transform(cam.zoom, 0, 0, -cam.zoom, cam.view.width / 2 - cam.x * cam.zoom + cam.shakeX, cam.view.height / 2 + cam.y * cam.zoom + cam.shakeY);
    },
  };
  Object.defineProperty(cam, 'scale', { get: () => cam.zoom, set: (v) => { cam.zoom = v; } });
  return cam;
}

// If the caller left the ctx at identity, treat dpr as ours to apply; otherwise their transform (dpr, shake) is the base.
function baseTransform(ctx, view) {
  const t = ctx.getTransform();
  if (t.isIdentity && view.dpr && view.dpr !== 1) return new DOMMatrix([view.dpr, 0, 0, view.dpr, 0, 0]);
  return t;
}

// ---- statics ----------------------------------------------------------------------------------------
function fixturePath(ctx, body, f) {
  const sh = f.getShape(); const type = sh.getType();
  const xf = body.getTransform();
  const pl = window.planck;
  if (type === 'polygon') {
    ctx.beginPath();
    for (let i = 0; i < sh.m_count; i++) { const p = pl.Transform.mul(xf, sh.m_vertices[i]); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }
    ctx.closePath();
    return true;
  }
  if (type === 'circle') {
    const c = pl.Transform.mul(xf, sh.m_p);
    ctx.beginPath(); ctx.arc(c.x, c.y, sh.m_radius, 0, Math.PI * 2);
    return true;
  }
  if (type === 'edge') {
    const a = pl.Transform.mul(xf, sh.m_vertex1), b = pl.Transform.mul(xf, sh.m_vertex2);
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
    return false;
  }
  return false;
}

// Themed static materials (Backgrounds, DESIGN.md §10). Explicit styles ice/wood/metal/rock/neon/hull/cloud work in any
// theme; in the act 5–10 themes (+ boss_*) plain slab/pillar map to a themed material. Everything else (classic themes,
// slab/pillar/bumper/oven) falls through to the original look in drawStatics below. Details are clipped to the fixture.
const THEME_STATIC = {
  freezer: ['frost', 'frostPillar'], docks: ['wood', 'woodPost'], volcano: ['basalt', 'basaltPillar'],
  sky: ['marble', 'marblePillar'], neon: ['neonMetal', 'neonPillar'], space: ['hullDeck', 'hullPillar'],
};
for (const k of Object.keys(THEME_STATIC)) THEME_STATIC['boss_' + k] = THEME_STATIC[k];
function staticBounds(body, f) {
  const sh = f.getShape(), pl = window.planck, xf = body.getTransform();
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i < sh.m_count; i++) {
    const p = pl.Transform.mul(xf, sh.m_vertices[i]);
    if (p.x < x0) x0 = p.x; if (p.x > x1) x1 = p.x; if (p.y < y0) y0 = p.y; if (p.y > y1) y1 = p.y;
  }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}
function staticTopEdge(body, f) {
  const sh = f.getShape(), pl = window.planck, xf = body.getTransform();
  let top = null;
  for (let i = 0; i < sh.m_count; i++) {
    const a = pl.Transform.mul(xf, sh.m_vertices[i]), b = pl.Transform.mul(xf, sh.m_vertices[(i + 1) % sh.m_count]);
    const midY = (a.y + b.y) / 2;
    if (!top || midY > top.y) top = { a, b, y: midY };
  }
  return top;
}
function rockCracks(ctx, b, s, col) {
  ctx.strokeStyle = col; ctx.lineWidth = 0.045; ctx.lineJoin = 'round'; ctx.beginPath();
  for (let x = Math.floor(b.x0 / 1.3) * 1.3, n = 0; x < b.x1 && n < 40; x += 1.3, n++) {
    const k = Math.round(x / 1.3); if (hash01(k, s) < 0.35) continue;
    let cx = x + hash01(k, s + 1), cy = b.y1; ctx.moveTo(cx, cy);
    const depth = Math.min(b.h, 0.5 + hash01(k, s + 2) * 0.9);
    for (let j = 1; j <= 3; j++) {
      cx += (hash01(k * 5 + j, s + 3) - 0.5) * 0.35; cy = b.y1 - (depth * j) / 3; ctx.lineTo(cx, cy);
      if (j === 2) { ctx.lineTo(cx + 0.25, cy - 0.12); ctx.moveTo(cx, cy); }
    }
  }
  ctx.stroke();
}
function hullDetail(ctx, b, t, s) {
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath();
  for (let x = Math.ceil(b.x0 / 1.2) * 1.2; x < b.x1; x += 1.2) ctx.rect(x - 0.02, b.y0, 0.04, b.h);
  if (b.h > 0.7) for (let y = b.y1 - 0.5, n = 0; y > b.y0 + 0.2 && n < 30; y -= 1, n++) ctx.rect(b.x0, y - 0.015, b.w, 0.03);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.beginPath();
  for (let x = Math.ceil(b.x0 / 1.2) * 1.2; x < b.x1; x += 1.2) { ctx.rect(x - 0.15, b.y1 - 0.15, 0.05, 0.05); ctx.rect(x + 0.1, b.y1 - 0.15, 0.05, 0.05); }
  ctx.fill();
  ctx.fillStyle = 'rgba(95,191,106,0.55)'; ctx.beginPath();
  for (let x = Math.ceil(b.x0 / 1.2) * 1.2; x < b.x1 - 0.6; x += 1.2) { const k = Math.round(x / 1.2); if (b.h > 0.5 && hash01(k, s) > 0.75 && Math.sin(t * 2.2 + k) > 0) ctx.rect(x + 0.45, b.y1 - 0.42, 0.1, 0.06); }
  ctx.fill();
}
const STATIC_MATS = {
  ice: { fill: '#5d8196', edge: '#8cb6cc', top: '#d2ecf7', topW: 0.08, detail(ctx, b) {
    const k = -0.7 * b.h;
    ctx.fillStyle = 'rgba(255,255,255,0.13)'; ctx.beginPath();
    for (let x = Math.floor(b.x0 / 1.7) * 1.7, n = 0; x < b.x1 - k && n < 60; x += 1.7, n++) {
      ctx.moveTo(x, b.y1); ctx.lineTo(x + 0.25, b.y1); ctx.lineTo(x + 0.25 + k, b.y0); ctx.lineTo(x + k, b.y0); ctx.closePath();
      ctx.moveTo(x + 0.4, b.y1); ctx.lineTo(x + 0.47, b.y1); ctx.lineTo(x + 0.47 + k, b.y0); ctx.lineTo(x + 0.4 + k, b.y0); ctx.closePath();
    }
    ctx.fill();
    ctx.fillStyle = 'rgba(210,240,255,0.16)'; ctx.fillRect(b.x0, b.y1 - 0.14, b.w, 0.14);
  } },
  frost: { fill: '#394656', edge: '#536375', top: '#b6d5e6', topW: 0.1, detail(ctx, b) {
    ctx.fillStyle = 'rgba(0,0,0,0.14)'; ctx.beginPath();
    for (let x = Math.ceil(b.x0 / 2) * 2; x < b.x1; x += 2) ctx.rect(x - 0.02, b.y0, 0.04, b.h);
    ctx.fill();
    ctx.fillStyle = 'rgba(190,225,255,0.12)'; ctx.fillRect(b.x0, b.y1 - 0.24, b.w, 0.24);
    ctx.fillStyle = 'rgba(215,238,255,0.4)'; ctx.beginPath();
    for (let x = Math.ceil(b.x0 / 0.45) * 0.45, n = 0; x < b.x1 && n < 120; x += 0.45, n++) {
      const l = 0.08 + hash01(Math.round(x / 0.45), 7) * 0.22;
      ctx.moveTo(x - 0.06, b.y1); ctx.lineTo(x, b.y1 - l); ctx.lineTo(x + 0.06, b.y1); ctx.closePath();
    }
    ctx.fill();
  } },
  frostPillar: { fill: '#303b48', edge: '#4a586a', top: '#b6d5e6', topW: 0.09, detail(ctx, b) {
    ctx.fillStyle = 'rgba(190,225,255,0.08)'; ctx.fillRect(b.x0, b.y0, Math.min(0.12, b.w * 0.3), b.h);
    ctx.fillStyle = 'rgba(0,0,0,0.14)'; ctx.fillRect(b.x1 - Math.min(0.1, b.w * 0.25), b.y0, 0.1, b.h);
  } },
  wood: { fill: '#4a3a2f', edge: '#5f4b3c', top: '#7b6350', topW: 0.07, detail(ctx, b) {
    const rows = Math.min(28, Math.ceil(b.h / 0.26));
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath();
    for (let r = 0; r < rows; r++) {
      const y = b.y1 - (r + 1) * 0.26, off = (r % 2) * 0.8;
      ctx.rect(b.x0, y - 0.015, b.w, 0.03);
      for (let x = Math.floor((b.x0 - off) / 1.6) * 1.6 + off; x < b.x1; x += 1.6) ctx.rect(x - 0.015, y, 0.03, 0.26);
    }
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath();
    for (let r = 0; r < rows; r++) {
      const y = b.y1 - (r + 0.5) * 0.26, off = (r % 2) * 0.8;
      for (let x = Math.floor((b.x0 - off) / 1.6) * 1.6 + off; x < b.x1; x += 1.6) { ctx.rect(x + 0.07, y - 0.02, 0.04, 0.04); ctx.rect(x - 0.11, y - 0.02, 0.04, 0.04); }
    }
    ctx.fill();
  } },
  woodPost: { fill: '#43352b', edge: '#58463a', top: '#6e5846', topW: 0.07, detail(ctx, b) {
    ctx.fillStyle = 'rgba(0,0,0,0.16)'; ctx.beginPath();
    for (let x = b.x0 + 0.1, n = 0; x < b.x1 && n < 60; x += 0.15, n++) ctx.rect(x, b.y0, 0.025, b.h);
    ctx.fill();
    ctx.fillStyle = '#6a5840'; ctx.beginPath();
    for (let k = 0; k < 3; k++) ctx.rect(b.x0, b.y1 - 0.45 - k * 0.07, b.w, 0.045);
    ctx.fill();
  } },
  metal: { fill: '#3c424d', edge: '#58606d', top: '#7b8494', topW: 0.06, detail(ctx, b) {
    ctx.fillStyle = 'rgba(255,255,255,0.045)'; ctx.beginPath();
    for (let y = b.y1 - 0.2, r = 0, n = 0; y > b.y0 && r < 30; y -= 0.3, r++) {
      for (let x = Math.floor(b.x0 / 0.4) * 0.4 + (r % 2) * 0.2; x < b.x1 && n < 900; x += 0.4, n++) { ctx.moveTo(x, y); ctx.lineTo(x + 0.02, y - 0.02); ctx.lineTo(x + 0.14, y + 0.04); ctx.lineTo(x + 0.12, y + 0.06); ctx.closePath(); }
    }
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath();
    for (let x = Math.ceil(b.x0 / 2.4) * 2.4; x < b.x1; x += 2.4) ctx.rect(x - 0.02, b.y0, 0.04, b.h);
    ctx.fill();
    ctx.fillStyle = '#626a78'; ctx.beginPath();
    for (let x = Math.floor(b.x0 / 0.6) * 0.6 + 0.3; x < b.x1; x += 0.6) { ctx.moveTo(x + 0.035, b.y1 - 0.12); ctx.arc(x, b.y1 - 0.12, 0.035, 0, TAU); }
    ctx.fill();
  } },
  rock: { fill: '#48403d', edge: '#5d524e', top: '#74655f', topW: 0.07, detail(ctx, b, t, s) { rockCracks(ctx, b, s, 'rgba(0,0,0,0.3)'); } },
  basalt: { fill: '#332b2a', edge: '#4a3e3b', top: '#5a4a44', topW: 0.07, detail(ctx, b, t, s) {
    rockCracks(ctx, b, s, `rgba(255,105,35,${(0.3 + 0.12 * Math.sin(t * 1.8 + s)).toFixed(3)})`);
    ctx.fillStyle = 'rgba(255,90,30,0.07)'; ctx.fillRect(b.x0, b.y0, b.w, Math.min(0.3, b.h * 0.4));
  } },
  basaltPillar: { fill: '#2d2625', edge: '#433836', top: '#524440', topW: 0.07, detail(ctx, b) {
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath();
    for (let x = b.x0 + 0.22, n = 0; x < b.x1 && n < 80; x += 0.26, n++) ctx.rect(x, b.y0, 0.04, b.h);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.beginPath();
    for (let x = b.x0 + 0.04, n = 0; x < b.x1 && n < 80; x += 0.26, n++) ctx.rect(x, b.y0, 0.06, b.h);
    ctx.fill();
  } },
  marble: { fill: '#555968', edge: '#6b7081', top: '#b4945e', topW: 0.06, detail(ctx, b, t, s) {
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.beginPath();
    for (let x = Math.ceil(b.x0 / 2.2) * 2.2; x < b.x1; x += 2.2) ctx.rect(x - 0.015, b.y0, 0.03, b.h - 0.2);
    ctx.fill();
    ctx.fillStyle = 'rgba(180,148,94,0.5)'; ctx.fillRect(b.x0, b.y1 - 0.2, b.w, 0.03);
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 0.03; ctx.beginPath();
    for (let x = Math.floor(b.x0 / 2.2) * 2.2, n = 0; x < b.x1 && n < 40; x += 2.2, n++) {
      const k = Math.round(x / 2.2);
      ctx.moveTo(x + 0.2, b.y1 - 0.3); ctx.quadraticCurveTo(x + 0.9 + hash01(k, s) * 0.6, b.y1 - 0.2 - b.h * 0.5, x + 1.9, b.y0 + 0.1);
    }
    ctx.stroke();
  } },
  marblePillar: { fill: '#4d5160', edge: '#666b7c', top: '#b4945e', topW: 0.07, detail(ctx, b) {
    ctx.fillStyle = 'rgba(0,0,0,0.14)'; ctx.beginPath();
    for (let x = b.x0 + 0.1, n = 0; x < b.x1 - 0.05 && n < 80; x += 0.13, n++) ctx.rect(x, b.y0 + 0.15, 0.035, b.h - 0.3);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(b.x0, b.y0, b.w, 0.12); ctx.fillRect(b.x0, b.y1 - 0.14, b.w, 0.14);
  } },
  cloud: { fill: '#5f687c', edge: null, puff: '#5f687c', puffHi: '#768095', detail(ctx, b) {
    ctx.fillStyle = 'rgba(40,45,60,0.14)'; ctx.fillRect(b.x0, b.y0, b.w, Math.min(0.25, b.h * 0.4));
  } },
  neonMetal: { fill: '#24222e', edge: '#35323f', top: '#7ae6ff', topW: 0.05, topGlow: 'rgba(70,220,255,0.2)', detail(ctx, b) {
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath();
    for (let x = Math.ceil(b.x0 / 1.5) * 1.5; x < b.x1; x += 1.5) ctx.rect(x - 0.02, b.y0, 0.04, b.h);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fillRect(b.x0, b.y1 - 0.3, b.w, 0.12);
  } },
  neon: { fill: '#211e2b', edge: '#ff6ad6', edgeW: 0.05, glow: 'rgba(255,70,200,0.22)', alt: ['#6fe3ff', 'rgba(70,220,255,0.22)'], detail(ctx, b) {
    ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.beginPath();
    for (let y = b.y1 - 0.18, n = 0; y > b.y0 + 0.05 && n < 40; y -= 0.18, n++) ctx.rect(b.x0, y, b.w, 0.03);
    ctx.fill();
  } },
  neonPillar: { fill: '#1f1c28', edge: '#6fe3ff', edgeW: 0.04, glow: 'rgba(70,220,255,0.16)' },
  hull: { fill: '#3a3f4b', edge: '#555c6b', top: '#6f7888', topW: 0.06, detail: hullDetail },
  hullDeck: { fill: '#383d49', edge: '#535a69', top: '#6f7888', topW: 0.06, detail(ctx, b, t, s) {
    hullDetail(ctx, b, t, s);
    if (b.h < 0.45) return;
    ctx.fillStyle = 'rgba(255,194,61,0.3)'; ctx.beginPath();
    for (let x = Math.floor(b.x0 / 0.36) * 0.36, n = 0; x < b.x1 && n < 150; x += 0.36, n++) { const y0 = b.y1 - 0.3, y1 = b.y1 - 0.2; ctx.moveTo(x, y0); ctx.lineTo(x + 0.18, y0); ctx.lineTo(x + 0.28, y1); ctx.lineTo(x + 0.1, y1); ctx.closePath(); }
    ctx.fill();
  } },
  hullPillar: { fill: '#323743', edge: '#4d5463', top: '#666f7f', topW: 0.06, detail(ctx, b, t, s) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(b.x0 + b.w / 2 - 0.02, b.y0, 0.04, b.h);
    if (Math.sin(t * 2 + s) > 0.3) { ctx.fillStyle = 'rgba(216,67,47,0.55)'; ctx.fillRect(b.x0 + b.w / 2 - 0.06, b.y1 - 0.3, 0.12, 0.08); }
  } },
};
function drawMaterialFixture(ctx, body, f, m, t) {
  const closed = fixturePath(ctx, body, f);
  if (!closed) { ctx.strokeStyle = m.edge || m.fill; ctx.lineWidth = 0.05; ctx.stroke(); return; }
  ctx.fillStyle = m.fill; ctx.fill();
  const isPoly = f.getShape().getType() === 'polygon';
  const p = body.getPosition(), seed = (Math.round(p.x * 5) * 131 + Math.round(p.y * 5) * 17) & 0xffff;
  if (isPoly && m.detail) { ctx.save(); ctx.clip(); m.detail(ctx, staticBounds(body, f), t, seed); ctx.restore(); fixturePath(ctx, body, f); }
  const alt = m.alt && hash01(seed, 5) > 0.5, edge = alt ? m.alt[0] : m.edge, glow = alt ? m.alt[1] : m.glow;
  ctx.lineJoin = 'round';
  if (glow) { ctx.strokeStyle = glow; ctx.lineWidth = 0.24 + 0.04 * Math.sin(t * 3 + seed); ctx.stroke(); }
  if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = m.edgeW || 0.05; ctx.stroke(); }
  if (!isPoly) return;
  const e = staticTopEdge(body, f);
  if (!e) return;
  if (m.topGlow) { ctx.strokeStyle = m.topGlow; ctx.lineWidth = 0.22; ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke(); }
  if (m.top) { ctx.strokeStyle = m.top; ctx.lineWidth = m.topW || 0.07; ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke(); }
  if (m.puff) {                        // fluffy cloud rim along the top edge and bottom
    const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y, len = Math.hypot(dx, dy), n = Math.min(90, Math.ceil(len / 0.34)), bb = staticBounds(body, f);
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass ? m.puffHi : m.puff; ctx.beginPath();
      for (let j = 0; j <= n; j++) {
        const u = j / n, r = (0.17 + hash01(j, seed) * 0.1) * (pass ? 0.55 : 1), px = e.a.x + dx * u - (pass ? 0.05 : 0), py = e.a.y + dy * u + (pass ? 0.06 : 0);
        ctx.moveTo(px + r, py); ctx.arc(px, py, r, 0, TAU);
        if (!pass && bb.h > 0.3) { ctx.moveTo(bb.x0 + (bb.w * j) / n + r * 0.8, bb.y0); ctx.arc(bb.x0 + (bb.w * j) / n, bb.y0, r * 0.8, 0, TAU); }
      }
      ctx.fill();
    }
  }
}

export function drawStatics(ctx, physics, theme, variant = 0) {
  const tm = THEME_STATIC[theme], t = performance.now() / 1000;
  for (const body of physics.statics) {
    if (body.__removed) continue;
    for (let f = body.getFixtureList(); f; f = f.getNext()) {
      const ud = f.getUserData() || {};
      const style = ud.style || 'slab';
      const mat = STATIC_MATS[style] || (tm && (style === 'slab' || style === 'pillar') ? STATIC_MATS[tm[style === 'pillar' ? 1 : 0]] : null);
      if (mat) { drawMaterialFixture(ctx, body, f, mat, t); continue; }
      const fill = style === 'pillar' ? R.pillar : style === 'bumper' ? R.bumper : style === 'oven' ? '#4a3128' : R.slab;
      const closed = fixturePath(ctx, body, f);
      ctx.fillStyle = fill;
      if (closed) ctx.fill();
      ctx.strokeStyle = style === 'bumper' ? '#8ad993' : R.slabEdge; ctx.lineWidth = 0.05; ctx.lineJoin = 'round';
      ctx.stroke();
      // top highlight for slabs
      if (style === 'slab' && f.getShape().getType() === 'polygon') {
        const sh = f.getShape(), pl = window.planck, xf = body.getTransform();
        let top = null;
        for (let i = 0; i < sh.m_count; i++) {
          const a = pl.Transform.mul(xf, sh.m_vertices[i]), b = pl.Transform.mul(xf, sh.m_vertices[(i + 1) % sh.m_count]);
          const midY = (a.y + b.y) / 2;
          if (!top || midY > top.y) top = { a, b, y: midY };
        }
        if (top) { ctx.strokeStyle = '#5b6274'; ctx.lineWidth = 0.07; ctx.beginPath(); ctx.moveTo(top.a.x, top.a.y); ctx.lineTo(top.b.x, top.b.y); ctx.stroke(); }
      }
    }
  }
}

// ---- fighters --------------------------------------------------------------------------------------------
function limb(ctx, a, b, w) {
  ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
}

// ---- hats & helmets ---------------------------------------------------------------------------------------
// Each hat draws at the head centre, rotated with the head, y-up, +x = facing, r = head radius.
// Tops stay under ~2.7r (the health bar floats at 2.25r + 0.2 m). Flat fills only: no gradients / shadows.
// f (optional) = the wearer; null for flying helmets and the skins carousel.
const TAU = Math.PI * 2;
const INK = '#23262e';
function dot(ctx, x, y, rr) { ctx.moveTo(x + rr, y); ctx.arc(x, y, rr, 0, TAU); }
/** Part of the circle (radius R, centre 0,0) between the horizontal chords y1 < y2: a band that hugs the skull. */
function bandPath(ctx, R, y1, y2) {
  const cl = (v) => Math.max(-1, Math.min(1, v));
  const a1 = Math.asin(cl(y1 / R)), a2 = Math.asin(cl(y2 / R));
  ctx.beginPath(); ctx.arc(0, 0, R, a1, a2); ctx.arc(0, 0, R, Math.PI - a2, Math.PI - a1); ctx.closePath();
}
/** Dome = circle arc from angle -lip to PI+lip (closed along the chord). */
function domePath(ctx, R, cy, lip) { ctx.beginPath(); ctx.arc(0, cy, R, -lip, Math.PI + lip); ctx.closePath(); }
/** Two cloth tails streaming back (-x) from a knot at (x, y), gently fluttering. */
function clothTails(ctx, x, y, r, len, col) {
  const w = Math.sin(performance.now() / 260 + x) * 0.1 * r;
  ctx.fillStyle = col; ctx.beginPath();
  ctx.moveTo(x, y + r * 0.1); ctx.quadraticCurveTo(x - len * 0.5, y + r * 0.12 + w, x - len, y - r * 0.05 + w * 2);
  ctx.lineTo(x - len * 0.9, y - r * 0.28 + w * 2); ctx.quadraticCurveTo(x - len * 0.45, y - r * 0.05, x, y - r * 0.06);
  ctx.moveTo(x, y + r * 0.02); ctx.quadraticCurveTo(x - len * 0.4, y - r * 0.2 - w, x - len * 0.72, y - r * 0.5 - w * 2);
  ctx.lineTo(x - len * 0.55, y - r * 0.62 - w * 2); ctx.quadraticCurveTo(x - len * 0.3, y - r * 0.3, x, y - r * 0.12);
  ctx.fill();
  ctx.beginPath(); dot(ctx, x, y, r * 0.15); ctx.fill();
}

const HATS = {
  // ---------- player skins ----------
  chef_hat(ctx, r) {
    ctx.fillStyle = '#fbfaf6';
    ctx.beginPath(); dot(ctx, -r * 0.52, r * 1.42, r * 0.52); dot(ctx, r * 0.04, r * 1.7, r * 0.6); dot(ctx, r * 0.58, r * 1.4, r * 0.5);
    ctx.roundRect(-r * 0.9, r * 0.78, r * 1.8, r * 0.8, r * 0.3); ctx.fill();
    ctx.strokeStyle = '#dfdace'; ctx.lineWidth = r * 0.07;
    ctx.beginPath(); ctx.arc(-r * 0.52, r * 1.42, r * 0.34, 3.6, 4.6); ctx.arc(r * 0.58, r * 1.4, r * 0.32, 4.8, 5.8); ctx.stroke();
    ctx.fillStyle = '#e8e3d8'; ctx.beginPath(); ctx.roundRect(-r * 0.93, r * 0.42, r * 1.86, r * 0.48, r * 0.1); ctx.fill();
    ctx.strokeStyle = '#d2ccbf'; ctx.beginPath();
    for (const x of [-0.55, -0.2, 0.15, 0.5]) { ctx.moveTo(x * r, r * 0.52); ctx.lineTo(x * r, r * 0.8); }
    ctx.stroke();
  },
  cap_red(ctx, r) {
    ctx.fillStyle = '#d8432f'; domePath(ctx, r * 1.04, r * 0.2, 0.12); ctx.fill();
    ctx.fillStyle = '#b5352a';
    ctx.beginPath(); ctx.moveTo(r * 0.5, r * 0.3); ctx.quadraticCurveTo(r * 1.3, r * 0.42, r * 1.72, r * 0.16);
    ctx.lineTo(r * 1.62, r * 0.03); ctx.quadraticCurveTo(r * 1.1, r * 0.1, r * 0.45, r * 0.06); ctx.closePath(); ctx.fill();
    ctx.beginPath(); dot(ctx, 0, r * 1.24, r * 0.12); ctx.fill();
    ctx.fillStyle = '#f2eee6'; ctx.beginPath(); dot(ctx, r * 0.38, r * 0.72, r * 0.27); ctx.fill();
    ctx.fillStyle = '#ffc23d'; ctx.beginPath(); ctx.moveTo(r * 0.22, r * 0.58); ctx.lineTo(r * 0.58, r * 0.62); ctx.lineTo(r * 0.36, r * 0.92); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#d8432f'; ctx.beginPath(); dot(ctx, r * 0.38, r * 0.68, r * 0.05); ctx.fill();
  },
  bandana_green(ctx, r) {
    ctx.fillStyle = '#5fbf6a'; domePath(ctx, r * 1.05, r * 0.14, 0.04); ctx.fill();
    bandPath(ctx, r * 1.07, r * 0.06, r * 0.42); ctx.fill();
    clothTails(ctx, -r * 0.98, r * 0.24, r, r * 0.8, '#4ca657');
    ctx.fillStyle = '#e4f3de'; ctx.beginPath();
    for (const [x, y] of [[-0.5, 0.72], [0.05, 0.98], [0.55, 0.62], [-0.05, 0.5], [0.45, 1.0], [-0.72, 0.36]]) dot(ctx, x * r, y * r, r * 0.07);
    ctx.fill();
  },
  salami_helm(ctx, r) {
    ctx.fillStyle = '#a8382c'; domePath(ctx, r * 1.14, r * 0.1, 0.1); ctx.fill();
    ctx.strokeStyle = '#c24c3d'; ctx.lineWidth = r * 0.12; ctx.beginPath(); ctx.arc(0, r * 0.1, r * 0.82, 1.9, 2.7); ctx.stroke();
    ctx.fillStyle = '#ebbcad'; ctx.beginPath();
    for (const [x, y, s] of [[-0.5, 0.62, 0.15], [0.18, 0.88, 0.12], [0.62, 0.42, 0.13], [-0.12, 0.4, 0.09], [0.35, 1.08, 0.07], [-0.78, 0.3, 0.08]]) dot(ctx, x * r, y * r, s * r);
    ctx.fill();
    ctx.fillStyle = '#7e2a22'; ctx.beginPath(); ctx.roundRect(-r * 1.22, -r * 0.06, r * 2.44, r * 0.32, r * 0.16); ctx.fill();
    ctx.strokeStyle = '#e8d9b8'; ctx.lineWidth = r * 0.08; ctx.beginPath(); ctx.moveTo(0, r * 1.2); ctx.quadraticCurveTo(r * 0.1, r * 1.55, r * 0.35, r * 1.5); ctx.quadraticCurveTo(r * 0.4, r * 1.3, 0, r * 1.2); ctx.stroke();
  },
  crust_helm(ctx, r) {
    ctx.beginPath(); ctx.arc(0, r * 0.05, r * 1.13, Math.PI + 0.5, -0.5, true); ctx.closePath();
    ctx.fillStyle = '#d9b06e'; ctx.fill();
    ctx.strokeStyle = '#b8843f'; ctx.lineWidth = r * 0.16; ctx.stroke();
    ctx.strokeStyle = '#ecca8e'; ctx.lineWidth = r * 0.1; ctx.beginPath(); ctx.arc(0, r * 0.05, r * 0.78, 1.2, 2.3); ctx.stroke();
    ctx.strokeStyle = '#b8843f'; ctx.lineWidth = r * 0.08; ctx.beginPath();
    for (const x of [-0.45, 0, 0.45]) { ctx.moveTo(x * r - r * 0.12, r * 0.95 - Math.abs(x) * r * 0.3); ctx.lineTo(x * r + r * 0.12, r * 1.1 - Math.abs(x) * r * 0.3); }
    ctx.stroke();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.roundRect(r * 0.02, r * 0.07, r * 1.18, r * 0.22, r * 0.11);
    dot(ctx, r * 0.55, -r * 0.22, r * 0.05); dot(ctx, r * 0.75, -r * 0.2, r * 0.05); dot(ctx, r * 0.95, -r * 0.22, r * 0.05); ctx.fill();
  },
  cheese_crown(ctx, r) {
    ctx.fillStyle = '#ffc23d'; ctx.beginPath();
    ctx.moveTo(-r * 0.95, r * 0.5); ctx.lineTo(-r * 1.04, r * 1.55); ctx.lineTo(-r * 0.5, r * 1.08); ctx.lineTo(0, r * 1.78);
    ctx.lineTo(r * 0.5, r * 1.08); ctx.lineTo(r * 1.04, r * 1.55); ctx.lineTo(r * 0.95, r * 0.5); ctx.closePath();
    dot(ctx, -r * 1.04, r * 1.55, r * 0.13); dot(ctx, 0, r * 1.78, r * 0.15); dot(ctx, r * 1.04, r * 1.55, r * 0.13); ctx.fill();
    ctx.fillStyle = '#e8a92e'; ctx.beginPath();
    for (const [x, y, s] of [[-0.5, 1.0, 0.11], [0.4, 0.98, 0.1], [0.02, 1.32, 0.08], [0.7, 1.28, 0.06]]) dot(ctx, x * r, y * r, s * r);
    ctx.fill();
    ctx.fillStyle = '#e0a52c'; ctx.fillRect(-r * 0.97, r * 0.44, r * 1.94, r * 0.28);
    ctx.fillStyle = '#d8432f'; ctx.beginPath(); dot(ctx, 0, r * 0.58, r * 0.1); ctx.fill();
  },
  oven_helm(ctx, r) {
    ctx.fillStyle = '#8a4a36'; domePath(ctx, r * 1.18, 0, 0.1); ctx.fill();
    ctx.strokeStyle = '#5e3226'; ctx.lineWidth = r * 0.07; ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0.12, Math.PI - 0.12);
    for (const a of [0.5, 1.2, 1.9, 2.6]) { ctx.moveTo(Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8); ctx.lineTo(Math.cos(a) * r * 1.16, Math.sin(a) * r * 1.16); }
    for (const a of [0.85, 1.55, 2.25]) { ctx.moveTo(Math.cos(a) * r * 0.42, Math.sin(a) * r * 0.42); ctx.lineTo(Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8); }
    ctx.stroke();
    ctx.fillStyle = '#5e3226'; ctx.fillRect(-r * 1.22, -r * 0.14, r * 2.44, r * 0.24);
    ctx.fillStyle = '#2a1510'; ctx.beginPath(); ctx.moveTo(r * 0.22, r * 0.12); ctx.lineTo(r * 0.22, r * 0.5); ctx.arc(r * 0.6, r * 0.5, r * 0.38, Math.PI, 0, true); ctx.lineTo(r * 0.98, r * 0.12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = (performance.now() / 90 | 0) % 3 ? '#ff8a2a' : '#ffa13a';
    ctx.beginPath(); ctx.moveTo(r * 0.32, r * 0.12); ctx.quadraticCurveTo(r * 0.4, r * 0.5, r * 0.55, r * 0.34); ctx.quadraticCurveTo(r * 0.65, r * 0.72, r * 0.78, r * 0.36); ctx.quadraticCurveTo(r * 0.9, r * 0.45, r * 0.9, r * 0.12); ctx.closePath(); ctx.fill();
  },
  // ---------- enemy archetypes ----------
  rookie_band(ctx, r) {
    ctx.strokeStyle = '#6b5444'; ctx.lineWidth = r * 0.1; ctx.beginPath();
    ctx.moveTo(-r * 0.15, r * 0.95); ctx.quadraticCurveTo(-r * 0.1, r * 1.3, r * 0.2, r * 1.32);
    ctx.moveTo(r * 0.1, r * 0.97); ctx.quadraticCurveTo(r * 0.2, r * 1.2, r * 0.42, r * 1.18); ctx.stroke();
    ctx.fillStyle = '#7fb2d9'; bandPath(ctx, r * 1.06, r * 0.4, r * 0.68); ctx.fill();
    clothTails(ctx, -r * 0.98, r * 0.54, r, r * 0.55, '#6a9cc4');
  },
  mohawk(ctx, r) {
    ctx.fillStyle = '#f08a24'; ctx.beginPath();
    const n = 5, A0 = 0.6, SPAN = 1.8, R0 = r * 0.9;
    ctx.moveTo(Math.cos(A0) * R0, Math.sin(A0) * R0);
    for (let i = 0; i < n; i++) {
      const a1 = A0 + ((i + 1) / n) * SPAN, am = A0 + ((i + 0.5) / n) * SPAN + 0.28, L = r * (1.5 + 0.14 * Math.sin(i * 1.9 + 1));
      ctx.lineTo(Math.cos(am) * L, Math.sin(am) * L); ctx.lineTo(Math.cos(a1) * R0, Math.sin(a1) * R0);
    }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3b404b'; bandPath(ctx, r * 1.05, r * 0.36, r * 0.52); ctx.fill();
  },
  cook_cap(ctx, r) {
    ctx.fillStyle = '#fbfaf6'; ctx.beginPath();
    ctx.moveTo(-r * 0.88, r * 0.45); ctx.lineTo(-r * 1.0, r * 1.18); ctx.quadraticCurveTo(-r * 0.98, r * 1.42, -r * 0.62, r * 1.42);
    ctx.lineTo(r * 0.62, r * 1.42); ctx.quadraticCurveTo(r * 0.98, r * 1.42, r * 1.0, r * 1.18); ctx.lineTo(r * 0.88, r * 0.45); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#d9d3c7'; ctx.lineWidth = r * 0.07; ctx.beginPath();
    for (const x of [-0.55, -0.18, 0.2, 0.57]) { ctx.moveTo(x * r, r * 0.8); ctx.lineTo(x * r * 1.06, r * 1.3); }
    ctx.stroke();
    ctx.fillStyle = '#d8432f'; ctx.fillRect(-r * 0.9, r * 0.5, r * 1.8, r * 0.2);
  },
  moped_helmet(ctx, r) {
    const fx = Math.cos(0.42) * r * 1.14, fy = r * 0.05 + Math.sin(0.42) * r * 1.14;
    ctx.fillStyle = '#d8432f'; ctx.beginPath();
    ctx.arc(0, r * 0.05, r * 1.14, 0.42, Math.PI + 0.95);
    ctx.lineTo(-r * 0.25, -r * 0.6); ctx.quadraticCurveTo(-r * 0.02, r * 0.5, fx, fy); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#f2eee6'; ctx.lineWidth = r * 0.2; ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.arc(0, r * 0.05, r * 0.9, 0.95, 2.9); ctx.stroke(); ctx.lineCap = 'round';
    ctx.fillStyle = '#4d6275'; ctx.beginPath();
    ctx.moveTo(r * 0.92, r * 0.58); ctx.lineTo(r * 1.52, r * 0.46); ctx.lineTo(r * 1.46, r * 0.7); ctx.lineTo(r * 0.72, r * 0.98); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffc23d'; ctx.beginPath(); dot(ctx, -r * 0.62, r * 0.0, r * 0.13); ctx.fill();
  },
  bandit_kerchief(ctx, r) {
    ctx.fillStyle = '#8e3b46'; bandPath(ctx, r * 1.07, -r * 0.62, r * 0.03); ctx.fill();
    ctx.beginPath(); ctx.moveTo(r * 0.12, -r * 0.2); ctx.lineTo(r * 1.07, r * 0.03); ctx.lineTo(r * 0.64, -r * 1.02); ctx.closePath(); ctx.fill();
    clothTails(ctx, -r * 1.0, -r * 0.25, r, r * 0.6, '#7a3039');
    ctx.fillStyle = '#c77a84'; ctx.beginPath();
    for (const [x, y] of [[0.55, -0.35], [0.2, -0.45], [0.75, -0.7], [-0.3, -0.3], [0.9, -0.12]]) dot(ctx, x * r, y * r, r * 0.06);
    ctx.fill();
    ctx.fillStyle = '#6b4a36'; ctx.beginPath(); ctx.roundRect(-r * 0.72, r * 0.7, r * 1.42, r * 0.8, [r * 0.1, r * 0.1, r * 0.36, r * 0.36]); ctx.fill();
    ctx.fillStyle = '#5a3d2c'; ctx.beginPath(); ctx.roundRect(-r * 1.32, r * 0.6, r * 2.7, r * 0.2, r * 0.1); ctx.fill();
    ctx.fillStyle = '#2f2a28'; ctx.fillRect(-r * 0.72, r * 0.8, r * 1.42, r * 0.16);
  },
  knight_helm(ctx, r) {
    ctx.fillStyle = '#d8432f'; ctx.beginPath();
    ctx.moveTo(-r * 0.05, r * 1.12); ctx.quadraticCurveTo(r * 0.15, r * 2.05, -r * 0.6, r * 2.12);
    ctx.quadraticCurveTo(-r * 1.35, r * 2.05, -r * 1.6, r * 1.35); ctx.quadraticCurveTo(-r * 1.0, r * 1.7, -r * 0.55, r * 1.12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#b9c1cb'; ctx.beginPath(); ctx.roundRect(-r * 1.1, -r * 0.62, r * 2.22, r * 1.85, [r * 0.3, r * 0.3, r * 1.0, r * 1.0]); ctx.fill();
    ctx.fillStyle = '#939ca8'; ctx.fillRect(-r * 1.1, -r * 0.62, r * 2.22, r * 0.16);
    ctx.fillStyle = '#e2e7ec'; ctx.beginPath(); ctx.roundRect(r * 0.28, -r * 0.46, r * 0.14, r * 1.6, r * 0.07); ctx.fill();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.roundRect(r * 0.08, r * 0.1, r * 1.08, r * 0.19, r * 0.09);
    for (const [x, y] of [[0.68, -0.2], [0.88, -0.2], [0.68, -0.38], [0.88, -0.38]]) dot(ctx, x * r, y * r, r * 0.045);
    ctx.fill();
    ctx.fillStyle = '#939ca8'; ctx.beginPath(); for (const x of [-0.8, -0.35]) dot(ctx, x * r, -r * 0.3, r * 0.06); ctx.fill();
  },
  kabuto(ctx, r) {
    ctx.fillStyle = '#6e2622'; ctx.beginPath();
    ctx.moveTo(-r * 0.1, r * 0.6); ctx.lineTo(-r * 1.22, r * 0.36); ctx.lineTo(-r * 1.55, -r * 0.32); ctx.lineTo(-r * 1.05, -r * 0.44); ctx.lineTo(-r * 0.4, r * 0.08); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#e0b04a'; ctx.lineWidth = r * 0.06; ctx.beginPath();
    ctx.moveTo(-r * 1.33, r * 0.12); ctx.lineTo(-r * 0.3, r * 0.42); ctx.moveTo(-r * 1.45, -r * 0.12); ctx.lineTo(-r * 0.45, r * 0.2); ctx.stroke();
    ctx.fillStyle = '#8a2f2a'; domePath(ctx, r * 1.1, r * 0.42, 0.04); ctx.fill();
    ctx.strokeStyle = '#6e2622'; ctx.beginPath();
    for (const a of [0.55, 1.05, 1.57, 2.1, 2.6]) { ctx.moveTo(Math.cos(a) * r * 0.35, r * 0.42 + Math.sin(a) * r * 0.35); ctx.lineTo(Math.cos(a) * r * 1.05, r * 0.42 + Math.sin(a) * r * 1.05); }
    ctx.stroke();
    ctx.fillStyle = '#2f2a28'; ctx.beginPath(); ctx.moveTo(r * 0.3, r * 0.4); ctx.lineTo(r * 1.4, r * 0.32); ctx.lineTo(r * 1.3, r * 0.5); ctx.lineTo(r * 0.4, r * 0.62); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e0b04a'; ctx.fillRect(-r * 1.12, r * 0.34, r * 2.24, r * 0.11);
    ctx.strokeStyle = '#e0b04a'; ctx.lineWidth = r * 0.13; ctx.beginPath();
    ctx.moveTo(r * 0.45, r * 1.3); ctx.quadraticCurveTo(r * 0.95, r * 1.6, r * 1.15, r * 2.2);
    ctx.moveTo(r * 0.45, r * 1.3); ctx.quadraticCurveTo(-r * 0.05, r * 1.75, -r * 0.2, r * 2.35); ctx.stroke();
    ctx.beginPath(); dot(ctx, r * 0.45, r * 1.28, r * 0.16); ctx.fill();
  },
  horned_helm(ctx, r) {
    ctx.fillStyle = '#efe3c8';
    for (const s of [1, -1]) {
      ctx.beginPath(); ctx.moveTo(s * r * 0.55, r * 0.5); ctx.quadraticCurveTo(s * r * 1.6, r * 0.5, s * r * 1.5, r * 1.8);
      ctx.quadraticCurveTo(s * r * 1.2, r * 0.95, s * r * 0.45, r * 0.95); ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = '#c9b48e'; ctx.lineWidth = r * 0.07; ctx.beginPath();
    for (const s of [1, -1]) { ctx.moveTo(s * r * 1.05, r * 0.56); ctx.lineTo(s * r * 0.98, r * 0.93); ctx.moveTo(s * r * 1.3, r * 0.8); ctx.lineTo(s * r * 1.16, r * 1.05); }
    ctx.stroke();
    ctx.fillStyle = '#8d949c'; domePath(ctx, r * 1.1, r * 0.2, 0.08); ctx.fill();
    ctx.strokeStyle = '#aab1b9'; ctx.lineWidth = r * 0.1; ctx.beginPath(); ctx.arc(0, r * 0.2, r * 0.78, 1.75, 2.45); ctx.stroke();
    ctx.fillStyle = '#b88a3e'; ctx.beginPath();
    ctx.roundRect(-r * 1.16, r * 0.06, r * 2.32, r * 0.3, r * 0.08); ctx.roundRect(r * 0.84, -r * 0.34, r * 0.22, r * 0.62, r * 0.08);
    ctx.rect(-r * 0.1, r * 0.3, r * 0.2, r * 0.98); ctx.fill();
    ctx.fillStyle = '#ecc97a'; ctx.beginPath(); for (const x of [-0.9, -0.5, 0.35, 0.7]) dot(ctx, x * r, r * 0.21, r * 0.05); ctx.fill();
  },
  ninja_mask(ctx, r) {
    ctx.fillStyle = '#3a3f4b'; bandPath(ctx, r * 1.05, r * 0.32, r * 1.05); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-r * 0.2, r * 0.04); ctx.arc(0, 0, r * 1.05, 0.04, -1.05, true); ctx.lineTo(-r * 0.2, -r * 0.62); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#b0342a'; bandPath(ctx, r * 1.08, r * 0.34, r * 0.56); ctx.fill();
    clothTails(ctx, -r * 1.0, r * 0.45, r, r * 1.1, '#b0342a');
    ctx.fillStyle = '#b9c1cb'; ctx.beginPath(); ctx.roundRect(r * 0.42, r * 0.37, r * 0.5, r * 0.16, r * 0.05); ctx.fill();
  },
  gladiator_helm(ctx, r) {
    ctx.fillStyle = '#d8432f'; ctx.beginPath(); ctx.moveTo(-r * 1.0, r * 1.05); ctx.bezierCurveTo(-r * 1.05, r * 2.45, r * 0.75, r * 2.55, r * 0.85, r * 1.1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#a8322a'; ctx.lineWidth = r * 0.06; ctx.beginPath();
    for (const x of [-0.6, -0.25, 0.1, 0.45]) { ctx.moveTo(x * r, r * 1.2); ctx.lineTo(x * r, r * (2.05 - Math.abs(x + 0.08) * 0.55)); }
    ctx.stroke();
    ctx.fillStyle = '#c08f45'; domePath(ctx, r * 1.08, r * 0.42, 0.05); ctx.fill();
    ctx.fillStyle = '#9c7034'; ctx.beginPath();
    ctx.moveTo(-r * 1.62, -r * 0.02); ctx.quadraticCurveTo(-r * 1.25, r * 0.38, -r * 0.6, r * 0.44); ctx.lineTo(r * 1.42, r * 0.44);
    ctx.lineTo(r * 1.36, r * 0.28); ctx.lineTo(-r * 0.6, r * 0.27); ctx.quadraticCurveTo(-r * 1.1, r * 0.22, -r * 1.5, -r * 0.14); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#b5843d'; ctx.beginPath(); ctx.roundRect(r * 0.18, -r * 0.56, r * 0.95, r * 0.86, r * 0.2); ctx.fill();
    ctx.fillStyle = INK; ctx.beginPath();
    for (const x of [0.4, 0.64, 0.88]) for (const y of [-0.32, -0.08, 0.14]) dot(ctx, x * r, y * r, r * 0.065);
    ctx.fill();
  },
  // ---------- bosses (worn at 1.8-1.9x) ----------
  big_cheese(ctx, r) {
    ctx.fillStyle = '#e0b04a'; ctx.beginPath();
    ctx.moveTo(-r * 0.48, r * 1.6); ctx.lineTo(-r * 0.55, r * 2.22); ctx.lineTo(-r * 0.24, r * 1.92); ctx.lineTo(0, r * 2.38);
    ctx.lineTo(r * 0.24, r * 1.92); ctx.lineTo(r * 0.55, r * 2.22); ctx.lineTo(r * 0.48, r * 1.6); ctx.closePath();
    dot(ctx, -r * 0.55, r * 2.22, r * 0.09); dot(ctx, 0, r * 2.38, r * 0.1); dot(ctx, r * 0.55, r * 2.22, r * 0.09); ctx.fill();
    ctx.fillStyle = '#e39b2d'; ctx.beginPath(); ctx.roundRect(-r * 1.45, r * 0.36, r * 2.9, r * 1.36, r * 0.34); ctx.fill();
    ctx.fillStyle = '#ffd35a'; ctx.beginPath(); ctx.roundRect(-r * 1.45, r * 0.54, r * 2.9, r * 1.0, r * 0.18); ctx.fill();
    ctx.fillStyle = '#fff0b8'; ctx.beginPath(); ctx.moveTo(r * 0.3, r * 1.72); ctx.lineTo(r * 1.1, r * 1.72); ctx.lineTo(r * 1.45, r * 0.95); ctx.lineTo(r * 1.45, r * 1.4); ctx.lineTo(r * 1.1, r * 1.72); ctx.closePath();
    ctx.moveTo(r * 0.3, r * 1.72); ctx.lineTo(r * 1.45, r * 1.72); ctx.lineTo(r * 1.45, r * 0.95); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e8a92e'; ctx.beginPath();
    for (const [x, y, s] of [[-0.95, 1.1, 0.17], [-0.35, 0.82, 0.12], [0.15, 1.2, 0.15], [-0.55, 1.4, 0.09], [0.55, 0.78, 0.1], [-1.2, 0.72, 0.07]]) dot(ctx, x * r, y * r, s * r);
    dot(ctx, r * 1.12, r * 1.45, r * 0.09); ctx.fill();
    ctx.fillStyle = '#d8432f'; ctx.beginPath(); dot(ctx, 0, r * 1.78, r * 0.09); ctx.fill();
  },
  pepperoni_helm(ctx, r) {
    ctx.fillStyle = '#c23b2c'; ctx.beginPath(); dot(ctx, -r * 0.15, r * 1.75, r * 0.72); ctx.fill();
    ctx.strokeStyle = '#8a2a20'; ctx.lineWidth = r * 0.12; ctx.stroke();
    ctx.fillStyle = '#eeb1a0'; ctx.beginPath();
    for (const [x, y, s] of [[-0.42, 1.98, 0.13], [0.15, 1.62, 0.11], [-0.2, 1.42, 0.08], [0.12, 2.12, 0.09], [-0.58, 1.6, 0.07]]) dot(ctx, x * r, y * r, s * r);
    ctx.fill();
    ctx.fillStyle = '#9e3326'; ctx.beginPath(); ctx.roundRect(-r * 1.14, -r * 0.66, r * 2.3, r * 1.9, [r * 0.3, r * 0.3, r * 1.05, r * 1.05]); ctx.fill();
    ctx.fillStyle = '#e6b2a2'; ctx.beginPath();
    for (const [x, y, s] of [[-0.7, 0.8, 0.12], [-0.2, 1.0, 0.09], [-0.85, 0.1, 0.1], [-0.45, -0.35, 0.08], [0.55, 0.85, 0.08], [0.05, 0.62, 0.07]]) dot(ctx, x * r, y * r, s * r);
    ctx.fill();
    ctx.fillStyle = '#e0b04a'; ctx.beginPath(); ctx.roundRect(-r * 0.25, -r * 0.02, r * 1.47, r * 0.44, r * 0.12); ctx.rect(-r * 1.14, -r * 0.66, r * 2.3, r * 0.17); ctx.fill();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.roundRect(r * 0.08, r * 0.11, r * 1.1, r * 0.18, r * 0.09); ctx.fill();
    ctx.fillStyle = '#e8d9b8'; ctx.fillRect(-r * 0.32, r * 1.06, r * 0.34, r * 0.18);
  },
  oven_lord(ctx, r, f) {
    const now = performance.now() / 1000, ga = ctx.globalAlpha;
    ctx.fillStyle = '#3b3f47'; ctx.fillRect(-r * 0.88, r * 0.7, r * 0.4, r * 1.35); ctx.fillRect(-r * 0.98, r * 1.95, r * 0.6, r * 0.18);
    const s = (now * 0.7) % 1;
    ctx.globalAlpha = ga * 0.35 * (1 - s); ctx.fillStyle = '#9aa0a8';
    ctx.beginPath(); dot(ctx, -r * (0.68 + s * 0.45), r * (2.25 + s * 0.25), r * (0.14 + s * 0.2)); ctx.fill();
    ctx.globalAlpha = ga;
    ctx.fillStyle = '#8a4a36'; domePath(ctx, r * 1.3, -r * 0.15, 0.12); ctx.fill();
    ctx.strokeStyle = '#5e3226'; ctx.lineWidth = r * 0.07; ctx.beginPath();
    ctx.arc(0, -r * 0.15, r * 1.0, 0.1, Math.PI - 0.1);
    for (const a of [1.35, 1.9, 2.45]) { ctx.moveTo(Math.cos(a) * r, -r * 0.15 + Math.sin(a) * r); ctx.lineTo(Math.cos(a) * r * 1.28, -r * 0.15 + Math.sin(a) * r * 1.28); }
    for (const a of [1.62, 2.2, 2.75]) { ctx.moveTo(Math.cos(a) * r * 0.55, -r * 0.15 + Math.sin(a) * r * 0.55); ctx.lineTo(Math.cos(a) * r, -r * 0.15 + Math.sin(a) * r); }
    ctx.stroke();
    ctx.fillStyle = '#5e3226'; ctx.beginPath(); ctx.roundRect(-r * 1.42, -r * 0.48, r * 2.84, r * 0.3, r * 0.08); ctx.fill();
    ctx.fillStyle = '#2a1510'; ctx.beginPath(); ctx.moveTo(r * 0.02, -r * 0.3); ctx.lineTo(r * 0.02, r * 0.2); ctx.arc(r * 0.6, r * 0.2, r * 0.58, Math.PI, 0, true); ctx.lineTo(r * 1.18, -r * 0.3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#b0603f'; ctx.beginPath(); ctx.moveTo(r * 0.48, r * 0.76); ctx.lineTo(r * 0.72, r * 0.76); ctx.lineTo(r * 0.78, r * 1.0); ctx.lineTo(r * 0.42, r * 1.0); ctx.closePath(); ctx.fill();
    const fl = Math.sin(now * 17) * 0.06 * r;
    ctx.fillStyle = (now * 11 | 0) % 3 ? '#ff8a2a' : '#ffa13a'; ctx.beginPath();
    ctx.moveTo(r * 0.1, -r * 0.3); ctx.quadraticCurveTo(r * 0.2, r * 0.05 + fl, r * 0.35, -r * 0.05); ctx.quadraticCurveTo(r * 0.55, r * 0.35 - fl, r * 0.7, -r * 0.02);
    ctx.quadraticCurveTo(r * 0.9, r * 0.2 + fl, r * 1.1, -r * 0.3); ctx.closePath(); ctx.fill();
    if (f && !f.dead) { ctx.fillStyle = '#ffd35a'; ctx.beginPath(); dot(ctx, r * 0.32, r * 0.3, r * 0.1); dot(ctx, r * 0.74, r * 0.3, r * 0.1); ctx.fill(); }
  },
  mamma_tower(ctx, r) {
    ctx.fillStyle = '#c9c2b8'; ctx.beginPath(); dot(ctx, -r * 0.95, r * 0.35, r * 0.38); dot(ctx, -r * 1.22, -r * 0.02, r * 0.26); ctx.fill();
    ctx.fillStyle = '#fbfaf6'; ctx.beginPath();
    ctx.roundRect(-r * 0.95, r * 0.8, r * 1.9, r * 0.9, r * 0.3);
    dot(ctx, -r * 0.6, r * 1.55, r * 0.48); dot(ctx, 0, r * 1.72, r * 0.55); dot(ctx, r * 0.6, r * 1.5, r * 0.45);
    dot(ctx, -r * 0.3, r * 2.15, r * 0.4); dot(ctx, r * 0.3, r * 2.18, r * 0.36); dot(ctx, 0, r * 2.42, r * 0.28); ctx.fill();
    ctx.strokeStyle = '#dfdace'; ctx.lineWidth = r * 0.07; ctx.beginPath();
    ctx.moveTo(-r * 0.75, r * 1.95); ctx.quadraticCurveTo(0, r * 1.82, r * 0.75, r * 1.95);
    ctx.moveTo(r * 0.78, r * 1.38); ctx.arc(r * 0.6, r * 1.5, r * 0.3, 5.7, 4.8, true); ctx.stroke();
    ctx.fillStyle = '#fbfaf6'; ctx.fillRect(-r, r * 0.4, r * 2, r * 0.5);
    ctx.fillStyle = '#d8432f'; ctx.beginPath();
    for (let i = 0; i < 8; i++) for (let row = 0; row < 2; row++) if ((i + row) % 2 === 0) ctx.rect(-r + i * r * 0.25, r * 0.4 + row * r * 0.25, r * 0.25, r * 0.25);
    ctx.fill();
    ctx.fillStyle = '#5fbf6a'; ctx.beginPath(); ctx.ellipse(r * 0.78, r * 1.0, r * 0.3, r * 0.13, 0.7, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(r * 0.5, r * 1.08, r * 0.26, r * 0.12, -0.5, 0, TAU); ctx.fill();
  },
};

export function drawHat(ctx, hat, r, f = null) {
  const fn = hat && HATS[hat];
  if (!fn) return;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  fn(ctx, r, f);
}

// ---- body looks: thin belts / sashes / neckerchiefs, keyed by hat id (or an explicit f.look id) ----------------
// Bands only, so every torso segment's own damage red stays visible around them.
const LOOKS = {
  champ:     { belt: '#3b2f2a', buckle: '#ffc23d' },
  kerchief:  { neck: '#d8432f' },
  bandolier: { strap: '#6b4a36', stud: '#b9c1cb' },
  knight:    { belt: '#6b4a36', buckle: '#d3d9e0' },
  obi:       { belt: '#2f2a28', knot: '#8a2f2a' },
  viking:    { belt: '#5a4034', buckle: '#b88a3e' },
  ninja:     { belt: '#b0342a', knot: '#b0342a' },
  gladiator: { belt: '#9c7034', buckle: '#e0b86a', strap: '#9c7034' },
  cheese:    { belt: '#e39b2d', buckle: '#d8432f' },
  pepperoni: { strap: '#e0b04a', belt: '#8a2a20', buckle: '#e0b04a' },
  oven:      { belt: '#3b3f47', buckle: '#ff8a2a' },
  mamma:     { belt: '#d8432f', knot: '#d8432f' },
};
const HAT_LOOK = {
  mohawk: 'champ', cook_cap: 'kerchief', bandit_kerchief: 'bandolier', knight_helm: 'knight', kabuto: 'obi', horned_helm: 'viking',
  ninja_mask: 'ninja', gladiator_helm: 'gladiator', big_cheese: 'cheese', pepperoni_helm: 'pepperoni', oven_lord: 'oven', mamma_tower: 'mamma',
};
// acts 5–10 characters (src/art/characters.js)
Object.assign(HATS, HATS_EXTRA);
Object.assign(LOOKS, LOOKS_EXTRA);
Object.assign(HAT_LOOK, HAT_LOOK_EXTRA);
function lookOf(f) {
  if (f.look) return LOOKS[typeof f.look === 'string' ? f.look : f.look.deco] || null;
  // cache by hat so the belt stays on after the helmet has been knocked off
  if (f.hat && f.hat !== f._lookHat) { f._lookHat = f.hat; f._look = LOOKS[HAT_LOOK[f.hat]] || null; }
  return f._look || null;
}
function drawLook(ctx, f, look, rd, d) {
  const P = rd.parts, s = rd.scale, fx = f.facing || 1;
  const col = (c) => (f.dead ? mixColor(c, '#6d6a66', 0.3) : c);
  const seg = (n) => {
    const b = P[n]; if (!b || b.__removed) return null;
    const [t, bt] = rd.partEnds(n); const L = Math.hypot(t.x - bt.x, t.y - bt.y) || 1;
    const ux = (t.x - bt.x) / L, uy = (t.y - bt.y) / L;
    return { t, b: bt, ux, uy, nx: uy * fx, ny: -ux * fx };
  };
  ctx.lineCap = 'butt';
  if (look.strap) {
    const a = seg('spine4'), m = seg('spine2'), b = seg('spine1');
    if (a && m && b) {
      const wa = d.spineW[3] * 0.3, wb = d.spineW[0] * 0.3;
      ctx.strokeStyle = col(look.strap); ctx.lineWidth = 0.06 * s; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(a.t.x - a.nx * wa, a.t.y - a.ny * wa); ctx.lineTo(m.t.x, m.t.y); ctx.lineTo(b.b.x + b.nx * wb, b.b.y + b.ny * wb); ctx.stroke();
      if (look.stud) { ctx.fillStyle = col(look.stud); ctx.beginPath(); ctx.arc(m.t.x, m.t.y, 0.028 * s, 0, TAU); ctx.fill(); }
      ctx.lineCap = 'butt';
    }
  }
  if (look.belt) {
    const g = seg('spine1');
    if (g) {
      const w = d.spineW[0] * 1.08, h = 0.075 * s;
      const cx = g.b.x + (g.t.x - g.b.x) * 0.3, cy = g.b.y + (g.t.y - g.b.y) * 0.3;
      ctx.strokeStyle = col(look.belt); ctx.lineWidth = w; ctx.beginPath();
      ctx.moveTo(cx - g.ux * h / 2, cy - g.uy * h / 2); ctx.lineTo(cx + g.ux * h / 2, cy + g.uy * h / 2); ctx.stroke();
      if (look.buckle) { const bs = 0.055 * s, bx = cx + g.nx * w * 0.36, by = cy + g.ny * w * 0.36; ctx.fillStyle = col(look.buckle); ctx.fillRect(bx - bs / 2, by - bs / 2, bs, bs); }
      if (look.knot) {
        const kx = cx - g.nx * w * 0.42, ky = cy - g.ny * w * 0.42;
        ctx.strokeStyle = col(look.knot); ctx.lineWidth = 0.04 * s; ctx.lineCap = 'round'; ctx.beginPath();
        ctx.moveTo(kx, ky); ctx.lineTo(kx - (g.nx * 0.1 + g.ux * 0.17) * s, ky - (g.ny * 0.1 + g.uy * 0.17) * s);
        ctx.moveTo(kx, ky); ctx.lineTo(kx - (g.nx * 0.02 + g.ux * 0.21) * s, ky - (g.ny * 0.02 + g.uy * 0.21) * s); ctx.stroke();
      }
    }
  }
  if (look.neck) {
    const a = seg('spine4');
    if (a) {
      const w = d.spineW[3] * 0.5;
      ctx.fillStyle = col(look.neck); ctx.beginPath();
      ctx.moveTo(a.t.x - a.nx * w, a.t.y - a.ny * w); ctx.lineTo(a.t.x + a.nx * w * 1.05, a.t.y + a.ny * w * 1.05);
      ctx.lineTo(a.t.x + a.nx * w * 0.45 - a.ux * d.seg * 0.75, a.t.y + a.ny * w * 0.45 - a.uy * d.seg * 0.75); ctx.closePath(); ctx.fill();
    }
  }
  ctx.lineCap = 'round';
}

/** Draw one fighter. */
export function drawFighter(ctx, f, opts = {}) {
  const rd = f.ragdoll, P = rd.parts, d = rd.dims;
  const body = f.color || R.body;
  const partThr = f.cfg.combat.partRedDamage * (f.maxHp / 100);
  const flashT = f.flash > 0 ? Math.min(1, f.flash / 0.12) * 0.9 : 0;
  // Each part reddens by its own accumulated damage (and only the part just hit flashes).
  // Back limbs are shaded darker for depth.
  const colorOf = (name, shade) => {
    let c = mixColor(body, R.damage, Math.min(1, (f.partDamage[name] || 0) / partThr) * 0.85);
    if (flashT && f.flashPart === name) c = mixColor(c, '#ffffff', flashT);
    if (f.dead) c = mixColor(c, '#6d6a66', 0.3);
    return shade ? mixColor(c, R.backShade, R.backShadeAmt) : c;
  };
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  const ends = (n) => rd.partEnds(n);
  const drawPart = (name, col) => {
    const b = P[name]; if (!b || b.__removed) return;
    const ud = b.getUserData();
    ctx.strokeStyle = col;
    if (name === 'head') {
      const c = b.getPosition();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(c.x, c.y, d.head, 0, Math.PI * 2); ctx.fill();
      return;
    }
    const [a, e] = ends(name);
    limb(ctx, a, e, ud.w);
    if (rd.detached[name] && !rd.detached[parentOf(name)]) {
      // bloody end on the detached piece
      ctx.fillStyle = R.damage; ctx.beginPath(); ctx.arc(a.x, a.y, ud.w * 0.45, 0, Math.PI * 2); ctx.fill();
    }
  };
  const parentOf = (n) => ({ foreArmF: 'upperArmF', foreArmB: 'upperArmB', shinF: 'thighF', shinB: 'thighB' }[n] || null);
  const fistR = d.fist || d.faW * 0.6;
  const drawFist = (hand, col) => {
    const b = P['foreArm' + hand]; if (!b || b.__removed) return;
    const p = ends('foreArm' + hand)[1];
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p.x, p.y, fistR, 0, Math.PI * 2); ctx.fill();
  };

  // back limbs (normal colour); the back fist is drawn over any weapon it holds
  for (const n of ['upperArmB', 'foreArmB', 'thighB', 'shinB']) drawPart(n, colorOf(n));
  for (const w of [f.weapon, f.weapon2]) if (w && w.hand === 'B') drawWeapon(ctx, w);
  drawFist('B', colorOf('foreArmB'));
  // torso: one segment at a time so each can carry its own damage colour (round caps hide the seams)
  ['spine1', 'spine2', 'spine3', 'spine4'].forEach((n, i) => {
    const [top, bottom] = ends(n);
    ctx.strokeStyle = colorOf(n);
    limb(ctx, bottom, top, d.spineW[i]);
  });
  { const look = lookOf(f); if (look) drawLook(ctx, f, look, rd, d); }
  // stumps
  for (const [part, jointHost, local] of [['head', 'spine4', [0, d.seg / 2]], ['upperArmF', 'spine4', [0, d.seg / 2 - 0.03 * rd.scale]], ['upperArmB', 'spine4', [0, d.seg / 2 - 0.03 * rd.scale]], ['thighF', 'spine1', [0, -d.seg / 2]], ['thighB', 'spine1', [0, -d.seg / 2]]]) {
    if (rd.detached[part]) {
      const h = P[jointHost].getWorldPoint(new (window.planck.Vec2)(local[0], local[1]));
      ctx.fillStyle = R.damage; ctx.beginPath(); ctx.arc(h.x, h.y, (part === 'head' ? d.spineW[3] : d.uaW) * 0.5, 0, Math.PI * 2); ctx.fill();
    }
  }
  for (const [part, host] of [['foreArmF', 'upperArmF'], ['foreArmB', 'upperArmB'], ['shinF', 'thighF'], ['shinB', 'thighB']]) {
    if (rd.detached[part] && !rd.detached[host]) { const e = ends(host)[1]; ctx.fillStyle = R.damage; ctx.beginPath(); ctx.arc(e.x, e.y, d.uaW * 0.5, 0, Math.PI * 2); ctx.fill(); }
  }
  // head + face + hat
  drawPart('head', colorOf('head'));
  {
    const b = P.head; const c = b.getPosition();
    ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(b.getAngle());
    const fx = f.facing || 1;
    ctx.fillStyle = '#23262e';
    if (f.dead) {
      ctx.strokeStyle = '#23262e'; ctx.lineWidth = d.head * 0.14;
      for (const ex of [0.25, 0.62]) { const x = fx * ex * d.head, y = d.head * 0.15, s = d.head * 0.14; ctx.beginPath(); ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s); ctx.moveTo(x - s, y + s); ctx.lineTo(x + s, y - s); ctx.stroke(); }
    } else {
      ctx.beginPath(); ctx.arc(fx * 0.3 * d.head, d.head * 0.18, d.head * 0.12, 0, Math.PI * 2); ctx.arc(fx * 0.68 * d.head, d.head * 0.18, d.head * 0.12, 0, Math.PI * 2); ctx.fill();
    }
    if (f.hat) { if (fx < 0) ctx.scale(-1, 1); drawHat(ctx, f.hat, d.head, f); }
    ctx.restore();
  }
  // front limbs
  // front legs normal; the front (weapon) arm in the dark shade, its fist over the weapon grip
  for (const n of ['thighF', 'shinF']) drawPart(n, colorOf(n));
  for (const n of ['upperArmF', 'foreArmF']) drawPart(n, colorOf(n, true));
  for (const w of [f.weapon, f.weapon2]) if (w && w.hand === 'F') drawWeapon(ctx, w);
  drawFist('F', colorOf('foreArmF', true));

  // grab held: pulsing yellow rings around the fists
  if (f.grabActive && !f.dead) {
    const pulse = 1 + Math.sin(performance.now() / 110) * 0.08;
    for (const hand of ['F', 'B']) {
      if (rd.detached['foreArm' + hand]) continue;
      const p = ends('foreArm' + hand)[1];
      ctx.beginPath(); ctx.arc(p.x, p.y, (fistR + 0.11 * rd.scale) * pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,194,61,0.28)'; ctx.fill();
      ctx.strokeStyle = R.accent; ctx.lineWidth = 0.075 * rd.scale; ctx.stroke();
    }
  }
}

// ---- debug ---------------------------------------------------------------------------------------------------
export function drawDebug(ctx, physics) {
  const pl = window.planck;
  ctx.lineWidth = 0.015;
  for (let b = physics.world.getBodyList(); b; b = b.getNext()) {
    ctx.strokeStyle = b.isStatic() ? '#6fd3ff' : b.isAwake() ? '#ff6fd8' : '#888';
    for (let f = b.getFixtureList(); f; f = f.getNext()) {
      const closed = fixturePath(ctx, b, f);
      ctx.stroke();
      if (closed && f.getShape().getType() === 'circle') {
        const c = pl.Transform.mul(b.getTransform(), f.getShape().m_p); const a = b.getAngle();
        ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x + Math.cos(a) * f.getShape().m_radius, c.y + Math.sin(a) * f.getShape().m_radius); ctx.stroke();
      }
    }
  }
  ctx.fillStyle = '#ffc23d';
  for (let j = physics.world.getJointList(); j; j = j.getNext()) {
    const a = j.getAnchorA(); ctx.beginPath(); ctx.arc(a.x, a.y, 0.03, 0, Math.PI * 2); ctx.fill();
  }
}

// ---- background -------------------------------------------------------------------------------------------
// Act themes = dark, low-contrast silhouettes on two parallax layers. Layer units are metres, y-up, y=0 ~ arena floor;
// each layer repeats a `tile`-wide chunk varied by a deterministic hash. One radial gradient per frame, no shadows.
function hash01(i, s) {
  let h = Math.imul(i | 0, 374761393) ^ Math.imul((s | 0) + 1, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
/** Hanging pan (or ladle) silhouette added to the current path; top = hook height. */
function bgPan(ctx, x, top, len, rr, ladle) {
  ctx.rect(x - 0.025, top - len, 0.05, len);
  const hl = ladle ? 1.1 : 0.75, hw = ladle ? 0.1 : 0.14, br = ladle ? rr * 0.6 : rr;
  ctx.rect(x - hw / 2, top - len - hl, hw, hl);
  ctx.moveTo(x + br, top - len - hl - br * 0.8); ctx.arc(x, top - len - hl - br * 0.8, br, 0, TAU);
}
function bgArch(ctx, x0, x1, y0, y1) {
  const r = (x1 - x0) / 2;
  ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.arc(x0 + r, y1, r, Math.PI, 0, true); ctx.lineTo(x1, y0); ctx.closePath();
}
const BG_THEMES = {
  kitchen: {
    bg: '#25252b', glow: [255, 140, 60, 0.16],
    layers: [
      { k: 0.26, tile: 6.5, col: '#2a2a31', dark: '#232329', draw(ctx, x, i, L) {
        const w = 2.2 + hash01(i, 2) * 1.3, h = 5 + hash01(i, 1) * 3.5, ox = x + hash01(i, 3) * (L.tile - w - 2.2);
        ctx.fillStyle = L.col; ctx.fillRect(ox, -3, w, h + 3); ctx.fillRect(ox + w + 0.4, -3, 1.6, 4.2 + hash01(i, 4) * 1.5);
        ctx.fillStyle = L.dark; ctx.beginPath();
        for (let sh = 1; sh <= 3; sh++) {
          const sy = -3 + ((h + 3) * sh) / 4;
          ctx.rect(ox + 0.12, sy, w - 0.24, 0.1);
          for (let j = 0; j < 3; j++) if (hash01(i * 7 + sh, j) > 0.35) ctx.rect(ox + 0.3 + (j * (w - 0.5)) / 3, sy + 0.1, 0.36, 0.35 + hash01(i + sh, j + 9) * 0.45);
        }
        ctx.fill();
      } },
      { k: 0.5, tile: 5.2, col: '#2e2e36', ground: 0.4, draw(ctx, x, i, L) {
        ctx.fillStyle = L.col; ctx.beginPath(); ctx.rect(x, 6.3, L.tile, 0.09);
        const n = 1 + ((hash01(i, 5) * 2) | 0);
        for (let j = 0; j < n; j++) bgPan(ctx, x + 0.9 + j * 2.2 + hash01(i, j) * 0.6, 6.3, 0.2 + hash01(i, j + 3) * 0.9, 0.38 + hash01(i, j + 6) * 0.3, hash01(i, j + 8) > 0.6);
        ctx.fill();
        ctx.fillStyle = '#28282f'; ctx.fillRect(x, 0.28, L.tile, 0.12); ctx.fillRect(x + L.tile / 2 - 0.03, -4, 0.06, 4.3);
      } },
    ],
  },
  cellar: {
    bg: '#262127', glow: [255, 120, 60, 0.1],
    layers: [
      { k: 0.24, tile: 5, col: '#2c262d', dark: '#1d1a1f', draw(ctx, x, i, L) {
        ctx.fillStyle = L.dark; ctx.beginPath(); bgArch(ctx, x + 1, x + 4, -4, 3.3);
        for (let b = 0; b < 7; b++) ctx.rect(x + hash01(i, b + 20) * 4.3, (b < 4 ? 5.4 + b * 0.9 : -1 + b * 0.8) + (hash01(i, b) - 0.5) * 0.2, 0.7, 0.07);
        ctx.fill();
        ctx.fillStyle = L.col; ctx.fillRect(x + 2.3, 4.6, 0.4, 0.35);
      } },
      { k: 0.5, tile: 4.6, col: '#2f292d', dark: '#241f23', draw(ctx, x, i, L) {
        ctx.fillStyle = L.col; ctx.beginPath(); ctx.rect(x + L.tile - 0.45, -4, 0.35, 12); ctx.rect(x, 6.4, L.tile, 0.35);
        const three = hash01(i, 1) > 0.45, bx = x + 0.6 + hash01(i, 2) * 1.2;
        const spots = three ? [[bx + 0.65, -1], [bx + 1.95, -1], [bx + 1.3, 0.55]] : [[bx + 0.65, -1]];
        for (const [cx, by] of spots) ctx.roundRect(cx - 0.62, by, 1.24, 1.55, 0.45);
        ctx.fill();
        ctx.fillStyle = L.dark; ctx.beginPath();
        for (const [cx, by] of spots) { ctx.rect(cx - 0.6, by + 0.35, 1.2, 0.07); ctx.rect(cx - 0.6, by + 1.13, 1.2, 0.07); }
        ctx.fill();
      } },
    ],
  },
  rooftop: {
    bg: '#1f2331', glow: [120, 150, 255, 0.05], moon: true,
    layers: [
      { k: 0.14, tile: 3, col: '#252a39', draw(ctx, x, i, L) {
        const w = 1.5 + hash01(i, 1) * 1.3, h = 3 + hash01(i, 2) * 7, ox = x + hash01(i, 3) * (L.tile - w);
        ctx.fillStyle = L.col; ctx.fillRect(ox, -8, w, h + 8);
        if (hash01(i, 4) > 0.6) ctx.fillRect(ox + w * 0.5 - 0.04, h, 0.08, 1.2);
        ctx.fillStyle = 'rgba(255,194,61,0.1)'; ctx.beginPath();
        for (let row = 0; row < 8; row++) for (let c = 0; c < 3; c++) {
          const wy = h - 0.7 - row * 0.75;
          if (wy > -1 && hash01(i * 13 + row, c) > 0.8) ctx.rect(ox + 0.25 + (c * (w - 0.5)) / 3, wy, 0.22, 0.3);
        }
        ctx.fill();
      } },
      { k: 0.42, tile: 7, col: '#2a2f3e', dark: '#222634', ground: 0.3, draw(ctx, x, i, L) {
        const kind = (hash01(i, 1) * 3) | 0, ox = x + 1 + hash01(i, 2) * 3;
        ctx.fillStyle = L.col; ctx.beginPath();
        if (kind === 0) {        // water tank on stilts
          ctx.rect(ox, 2.4, 2.2, 2.3); ctx.moveTo(ox - 0.15, 4.7); ctx.lineTo(ox + 1.1, 5.6); ctx.lineTo(ox + 2.35, 4.7); ctx.closePath();
          for (const lx of [0.15, 1.03, 1.9]) ctx.rect(ox + lx, 0.3, 0.14, 2.2);
        } else if (kind === 1) { // chimney + antenna
          ctx.rect(ox, 0.3, 0.8, 2.2); ctx.rect(ox - 0.1, 2.4, 1.0, 0.25); ctx.rect(ox + 1.6, 0.3, 0.6, 1.5);
          ctx.rect(ox + 3, 0.3, 0.06, 4.5); ctx.rect(ox + 2.6, 3.8, 0.86, 0.05); ctx.rect(ox + 2.75, 4.3, 0.56, 0.05);
        } else {                 // rooftop units
          ctx.rect(ox, 0.3, 1.8, 1.1); ctx.rect(ox + 2.1, 0.3, 1.0, 0.7);
        }
        ctx.fill();
        ctx.fillStyle = L.dark; ctx.beginPath();
        if (kind === 0) { ctx.rect(ox, 3.1, 2.2, 0.07); ctx.rect(ox, 4.0, 2.2, 0.07); }
        else if (kind === 2) { ctx.moveTo(ox + 1.28, 0.85); ctx.arc(ox + 0.9, 0.85, 0.38, 0, TAU); }
        ctx.fill();
      } },
    ],
  },
  foundry: {
    bg: '#231f1e', glow: [255, 110, 40, 0.2],
    layers: [
      { k: 0.24, tile: 6, col: '#2a2524', draw(ctx, x, i, L) {
        const px = x + 0.6 + hash01(i, 1) * 3.5;
        ctx.fillStyle = L.col; ctx.beginPath();
        ctx.rect(px, -4, 0.9, 16); ctx.rect(x, 7.2 + hash01(i, 2) * 1.5, L.tile, 0.7);
        for (let fl = 0; fl < 3; fl++) ctx.rect(px - 0.12, 0.8 + fl * 3.2, 1.14, 0.3);
        if (hash01(i, 3) > 0.5) { ctx.rect(x + 4.6, -4, 1.1, 15); ctx.rect(x + 4.45, 11, 1.4, 0.4); }
        ctx.fill();
      } },
      { k: 0.5, tile: 8, col: '#2d2726', dark: '#1f1a19', ground: -0.2, draw(ctx, x, i, L) {
        const ox = x + 1 + hash01(i, 1) * 2.5, t = performance.now() / 1000;
        ctx.fillStyle = L.col; ctx.beginPath();
        ctx.rect(ox, -0.2, 3.4, 4.2); ctx.moveTo(ox - 0.2, 4); ctx.lineTo(ox + 3.6, 4); ctx.lineTo(ox + 2.3, 5.2); ctx.lineTo(ox + 1.1, 5.2); ctx.closePath();
        ctx.rect(ox + 1.3, 5.2, 0.8, 6); ctx.rect(x, 6.2, L.tile, 0.12);
        for (let p = 0; p < 4; p++) ctx.rect(x + p * 2 + 0.2, 5.2, 0.08, 1.0);
        ctx.fill();
        ctx.fillStyle = L.dark; ctx.beginPath(); bgArch(ctx, ox + 0.8, ox + 2.6, -0.2, 1.5); ctx.fill();
        const a = 0.16 + 0.05 * Math.sin(t * 7 + i * 2) + 0.03 * Math.sin(t * 13.3 + i);
        ctx.fillStyle = `rgba(255,120,40,${a.toFixed(2)})`; ctx.fill();
        ctx.fillStyle = 'rgba(255,190,80,0.12)'; ctx.fillRect(ox + 1.0, -0.2, 1.4, 0.9);
      } },
    ],
  },
  hall: {
    bg: '#24212b', glow: [255, 170, 80, 0.12],
    layers: [
      { k: 0.24, tile: 4.5, col: '#2b2733', dark: '#1c1a21', draw(ctx, x, i, L) {
        ctx.fillStyle = L.dark; ctx.beginPath(); bgArch(ctx, x + 1.6, x + 3.6, 2, 5.2); ctx.fill();
        ctx.fillStyle = L.col; ctx.beginPath();
        ctx.rect(x + 0.1, -4, 0.9, 14); ctx.rect(x - 0.1, 9.2, 1.3, 0.45); ctx.rect(x - 0.1, -1.2, 1.3, 0.4); ctx.rect(x + 1.5, 1.8, 2.2, 0.2);
        ctx.fill();
      } },
      { k: 0.46, tile: 6, col: '#2e2933', draw(ctx, x, i, L) {
        const red = (i & 1) === 0, bx = x + 0.8;
        ctx.fillStyle = red ? '#362629' : '#353025'; ctx.beginPath();
        ctx.moveTo(bx, 9); ctx.lineTo(bx + 1.2, 9); ctx.lineTo(bx + 1.2, 4.6); ctx.lineTo(bx + 0.6, 5.1); ctx.lineTo(bx, 4.6); ctx.closePath(); ctx.fill();
        ctx.fillStyle = red ? '#2a1f23' : '#2a261f'; ctx.beginPath(); ctx.moveTo(bx + 0.25, 7.8); ctx.lineTo(bx + 0.95, 7.8); ctx.lineTo(bx + 0.6, 6.2); ctx.closePath(); ctx.fill();
        ctx.fillStyle = L.col; ctx.beginPath(); ctx.rect(bx - 0.2, 9, 1.6, 0.1);
        bgPan(ctx, x + 3.6 + hash01(i, 1) * 1.2, 9, 1.4 + hash01(i, 2) * 1.2, 0.35 + hash01(i, 3) * 0.2, hash01(i, 4) > 0.5);
        ctx.fill();
      } },
    ],
  },
};
Object.assign(BG_THEMES, BG_THEMES_EXTRA);   // acts 5–10 + their boss arenas (src/art/themes.js)

function drawBgLayer(ctx, view, cam, base, L, variant = 0) {
  const z = Math.max(6, (70 + (cam.zoom - 70) * 0.5) * L.k);   // zooms (and scrolls) less than the arena
  ctx.setTransform(base);
  ctx.transform(z, 0, 0, -z, view.width / 2 - cam.x * z, view.height / 2 + cam.y * z);
  const half = view.width / 2 / z, x0 = cam.x - half, x1 = cam.x + half;
  if (L.ground !== undefined) {
    const yb = cam.y - view.height / 2 / z - 1;
    if (L.ground > yb) { ctx.fillStyle = L.col; ctx.fillRect(x0 - 1, yb, x1 - x0 + 2, L.ground - yb); }
  }
  for (let i = Math.floor(x0 / L.tile) - 1, n = Math.ceil(x1 / L.tile); i <= n; i++) L.draw(ctx, i * L.tile, i, L, variant);
}

/** variant: per-level look inside a theme (level def `bgVariant`); themes may add `sky(ctx, view, camera, variant)` (screen px, drawn first). */
export function drawBackground(ctx, view, camera, base, theme, variant = 0) {
  const b = base || baseTransform(ctx, view);
  const T = BG_THEMES[theme] || null;
  ctx.setTransform(b);
  ctx.fillStyle = T ? T.bg : R.bg; ctx.fillRect(-64, -64, view.width + 128, view.height + 128);
  if (T && T.sky) { T.sky(ctx, view, camera, variant | 0); ctx.setTransform(b); }
  if (T && T.moon) {
    const mr = Math.min(view.width, view.height) * 0.08, mx = view.width * 0.78 - camera.x * 2, my = view.height * 0.2 + camera.y * 1.5;
    ctx.fillStyle = '#2b3142'; ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU); ctx.fill();
    ctx.fillStyle = '#272c3c'; ctx.beginPath(); dot(ctx, mx - mr * 0.3, my + mr * 0.15, mr * 0.22); dot(ctx, mx + mr * 0.35, my - mr * 0.3, mr * 0.14); ctx.fill();
  }
  if (T) { for (const L of T.layers) drawBgLayer(ctx, view, camera, b, L, variant | 0); ctx.setTransform(b); }
  // pizza-oven glow (tinted per theme), anchored to the world so it parallaxes gently
  const [gx, gy] = camera.toScreen(camera.x * 0.7, -0.5);
  const grad = ctx.createRadialGradient(gx, gy + view.height * 0.15, 10, gx, gy + view.height * 0.15, Math.max(view.width, view.height) * 0.75);
  if (T) {
    const [cr, cg, cb, ca] = T.glow;
    grad.addColorStop(0, `rgba(${cr},${cg},${cb},${ca})`); grad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${(ca * 0.32).toFixed(3)})`); grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
  } else {
    grad.addColorStop(0, 'rgba(255,140,60,0.16)'); grad.addColorStop(0.5, 'rgba(255,120,50,0.05)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
  }
  ctx.fillStyle = grad; ctx.fillRect(-64, -64, view.width + 128, view.height + 128);
  drawMotes(ctx, view, camera);
}

// ---- ambient background motes: slow-drifting dust + a few warm embers, with depth parallax -------------
const MOTES = [];
function makeMote() {
  const ember = Math.random() < 0.17;
  const depth = 0.08 + Math.random() * 0.45;   // 0 = infinitely far (never moves with the camera)
  return {
    x: Math.random(), y: Math.random(), depth,
    r: (0.8 + Math.random() * 2.2) * (0.6 + depth),
    rise: 3 + Math.random() * 14,               // px/s upward drift
    sway: 3 + Math.random() * 10, swayF: 0.2 + Math.random() * 0.6,
    twF: 0.5 + Math.random() * 2, phase: Math.random() * Math.PI * 2,
    a: ember ? 0.35 + Math.random() * 0.35 : 0.12 + Math.random() * 0.3,
    color: ember ? (Math.random() < 0.5 ? R.accent : '#ff9a4a') : R.body,
  };
}
function drawMotes(ctx, view, camera) {
  const t = performance.now() / 1000;
  const want = Math.min(130, 25 + Math.round((70 * view.width * view.height) / (1280 * 720)));
  while (MOTES.length < want) MOTES.push(makeMote());
  const W = view.width + 40, H = view.height + 40;
  for (let i = 0; i < want; i++) {
    const m = MOTES[i];
    let x = m.x * W - camera.x * camera.zoom * m.depth + Math.sin(t * m.swayF + m.phase) * m.sway;
    let y = m.y * H + camera.y * camera.zoom * m.depth - t * m.rise;
    x = (((x % W) + W) % W) - 20;
    y = (((y % H) + H) % H) - 20;
    ctx.globalAlpha = m.a * (0.65 + 0.35 * Math.sin(t * m.twF + m.phase));
    ctx.fillStyle = m.color;
    ctx.beginPath(); ctx.arc(x, y, m.r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** Simple skin preview (head + shoulders with hat) for the skins carousel. ctx in pixels, y-down. */
export function drawSkinPreview(ctx, skinId, w, h, opts = {}) {
  const skin = skinById(skinId);
  const r = Math.min(w, h) * 0.22;
  ctx.save();
  ctx.translate(w / 2, h / 2 + r * 0.55);
  ctx.scale(1, -1); // y-up like the world drawing
  ctx.strokeStyle = skin.body; ctx.lineCap = 'round'; ctx.lineWidth = r * 1.3;
  ctx.beginPath(); ctx.moveTo(0, -r * 2.6); ctx.lineTo(0, -r * 1.25); ctx.stroke();
  ctx.fillStyle = skin.body; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#23262e'; ctx.beginPath(); ctx.arc(0.3 * r, 0.18 * r, 0.12 * r, 0, Math.PI * 2); ctx.arc(0.68 * r, 0.18 * r, 0.12 * r, 0, Math.PI * 2); ctx.fill();
  if (skin.hat) drawHat(ctx, opts.hat !== undefined ? opts.hat : skin.hat, r);
  ctx.restore();
}

/**
 * drawWorld(ctx, view, state): view = {width, height, dpr}; state = {physics, fighters, camera, debug, before?, after?}
 * Composes onto the ctx's current transform (so a caller-applied shake/dpr transform is kept); if the ctx is at
 * identity, view.dpr is applied here. `before(ctx)` / `after(ctx)` optional callbacks run in camera space (fx layers).
 */
export function drawWorld(ctx, view, state) {
  const cam = state.camera;
  cam.setView(view);
  const base = baseTransform(ctx, view);
  drawBackground(ctx, view, cam, base, state.theme, state.variant);
  cam.apply(ctx, base);
  drawStatics(ctx, state.physics, state.theme, state.variant);
  if (state.before) state.before(ctx);
  // loose weapons behind fighters
  for (const w of state.physics.weapons) if (!w.holder) drawWeapon(ctx, w);
  const fighters = state.fighters || [...state.physics.fighters];
  // dead fighters first so the living draw on top
  for (const f of fighters) if (f.dead) drawFighter(ctx, f);
  for (const f of fighters) if (!f.dead) drawFighter(ctx, f);
  drawHealthBars(ctx, fighters);
  drawPickupIcons(ctx, state.physics, fighters);
  if (state.after) state.after(ctx);
  if (state.debug) drawDebug(ctx, state.physics);
  ctx.setTransform(base);
}

// ---- pickup badges ---------------------------------------------------------------------------------------------
/**
 * Health bar floating just above each living fighter's head (stays level, follows the head).
 * Colour: fighter.barColor if set (2P: P1 blue / P2 red), else green for the player and red for everyone else.
 * A light "ghost" segment trails behind recent damage.
 */
function drawHealthBars(ctx, fighters) {
  for (const f of fighters) {
    if (f.dead) continue;
    const rd = f.ragdoll, head = rd.parts.head;
    if (!head || head.__removed || rd.detached.head) continue;
    const c = head.getPosition(), s = rd.scale, r = rd.dims.head;
    const w = 0.95 * s, h = 0.13 * s;
    const x = c.x - w / 2, y = c.y + r * (f.hat ? 2.25 : 1) + 0.2 * s;
    const ratio = Math.max(0, Math.min(1, f.hp / f.maxHp));
    if (f._barGhost === undefined || f._barGhost < ratio) f._barGhost = ratio;
    else f._barGhost += (ratio - f._barGhost) * 0.06;
    const col = f.barColor || (f.side === 'player' ? R.green : R.damage);
    const pad = 0.025 * s;
    ctx.fillStyle = 'rgba(29,32,39,0.85)';
    ctx.beginPath(); ctx.roundRect(x - pad, y - pad, w + pad * 2, h + pad * 2, (h + pad * 2) / 2); ctx.fill();
    if (f._barGhost > ratio) {
      ctx.fillStyle = 'rgba(242,238,230,0.75)';
      ctx.beginPath(); ctx.roundRect(x, y, w * f._barGhost, h, h / 2); ctx.fill();
    }
    if (ratio > 0) {
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.roundRect(x, y, Math.max(h, w * ratio), h, h / 2); ctx.fill();
    }
  }
}

/** Hand badge floating over every loose item that can be picked up; yellow when a player is within reach. */
function drawPickupIcons(ctx, physics, fighters) {
  const t = performance.now() / 1000;
  const reach = (physics.cfg || CONFIG).grab.pickupRadius;
  const players = fighters.filter((f) => !f.dead && f.side !== 'enemy');
  for (const w of physics.weapons) {
    if (w.holder || w.destroyed || w.prop || w.returnTo || !w.body || w.body.__removed) continue;
    const c = w.body.getWorldCenter();
    const hot = players.some((f) => {
      const s = f.ragdoll.parts.spine2.getWorldCenter();
      return Math.hypot(c.x - s.x, (c.y - s.y) * 0.8) < reach * f.scale;
    });
    drawHandBadge(ctx, c.x, c.y + 0.55 + Math.sin(t * 3 + c.x) * 0.04, 0.2, hot);
  }
}

/** Round badge with an open hand, in world units (y-up). s = badge radius in metres. */
function drawHandBadge(ctx, x, y, s, hot) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.fillStyle = hot ? R.accent : 'rgba(35,38,46,0.85)'; ctx.fill();
  ctx.lineWidth = 0.12; ctx.strokeStyle = hot ? '#23262e' : R.body; ctx.stroke();
  ctx.fillStyle = hot ? '#23262e' : R.body;
  ctx.beginPath(); ctx.roundRect(-0.4, -0.55, 0.76, 0.6, 0.22); ctx.fill();                       // palm
  for (const [fx, top] of [[-0.36, 0.5], [-0.14, 0.62], [0.08, 0.6], [0.28, 0.42]]) {              // fingers
    ctx.beginPath(); ctx.roundRect(fx - 0.04, -0.1, 0.17, top + 0.1, 0.085); ctx.fill();
  }
  ctx.save(); ctx.translate(-0.36, -0.28); ctx.rotate(0.75);                                          // thumb
  ctx.beginPath(); ctx.roundRect(-0.085, 0, 0.17, 0.42, 0.085); ctx.fill();
  ctx.restore();
  ctx.restore();
}
