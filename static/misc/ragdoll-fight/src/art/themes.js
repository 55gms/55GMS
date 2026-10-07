// Background themes for acts 5–10 and their boss arenas. Merged into render.js BG_THEMES.
// See DESIGN.md §10 for the contract:
//   { bg, glow: [r,g,b,a], sky?(ctx, view, camera, variant), layers: [{ k, tile, col, ground?, draw(ctx, x, i, L, variant) }] }
// Layer units are metres, y-up, y≈0 = arena floor; `sky` is screen px and drawn first. Act themes honour
// variant 0/1/2 (different prop mix + tint). Rules: dark and low-contrast so fighters pop, no shadowBlur,
// ≤ 1 gradient per layer per frame, per-tile deterministic hashing, subtle performance.now() animation.

const TAU = Math.PI * 2;
const clock = () => performance.now() / 1000;
const V = (v) => (((v | 0) % 3) + 3) % 3;

function hash01(i, s) {
  let h = Math.imul(i | 0, 374761393) ^ Math.imul((s | 0) + 1, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
/** px per metre of a parallax layer (matches render.js drawBgLayer) */
const layerZ = (cam, k) => Math.max(6, (70 + (cam.zoom - 70) * 0.5) * k);
/** screen-px position of a point on a layer with parallax factor k */
const layerSY = (view, cam, k, y) => view.height / 2 + (cam.y - y) * layerZ(cam, k);
const layerSX = (view, cam, k, x) => view.width / 2 + (x - cam.x) * layerZ(cam, k);

/** full-screen vertical gradient between screen y0..y1 */
function vGrad(ctx, view, stops, y0 = 0, y1 = view.height) {
  if (y1 - y0 < 1) y1 = y0 + 1;
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  for (const [p, c] of stops) g.addColorStop(p, c);
  ctx.fillStyle = g; ctx.fillRect(-64, -64, view.width + 128, view.height + 128);
}
/** Convex/concave polygon from flat [x0,y0,x1,y1,...], always added with positive winding so overlapping sub-paths union. */
function poly(ctx, p) {
  let a = 0; const n = p.length;
  for (let j = 0; j < n; j += 2) { const k = (j + 2) % n; a += p[j] * p[k + 1] - p[k] * p[j + 1]; }
  if (a >= 0) { ctx.moveTo(p[0], p[1]); for (let j = 2; j < n; j += 2) ctx.lineTo(p[j], p[j + 1]); }
  else { ctx.moveTo(p[n - 2], p[n - 1]); for (let j = n - 4; j >= 0; j -= 2) ctx.lineTo(p[j], p[j + 1]); }
  ctx.closePath();
}
const circ = (ctx, x, y, r) => { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); };

const STARS = Array.from({ length: 200 }, (_, n) => [hash01(n, 71), hash01(n, 72), hash01(n, 73)]);
/** screen-space starfield: `par` = px of drift per metre of camera travel; maxY = fraction of screen height used */
function drawStars(ctx, view, cam, count, alpha, par = 1.5, maxY = 1) {
  const t = clock(), W = view.width + 20, H = view.height * maxY + 20;
  for (let pass = 0; pass < 2; pass++) {
    ctx.fillStyle = pass ? `rgba(255,248,225,${alpha.toFixed(3)})` : `rgba(195,210,255,${(alpha * 0.55).toFixed(3)})`;
    ctx.beginPath();
    for (let n = 0; n < count; n++) {
      const s = STARS[n]; if ((s[2] > 0.72) !== (pass === 1)) continue;
      const d = 0.3 + s[2];
      let x = s[0] * W - cam.x * par * d; x = ((x % W) + W) % W - 10;
      let y = s[1] * H + cam.y * par * d; y = ((y % H) + H) % H - 10;
      const r = (0.7 + s[2] * 1.3) * (pass ? 0.7 + 0.3 * Math.sin(t * (1 + s[1] * 2) + n) : 1);
      ctx.rect(x - r / 2, y - r / 2, r, r);
    }
    ctx.fill();
  }
}
/** screen-space rain streaks */
function drawRain(ctx, view, n, color, slant, speed) {
  const t = clock(), W = view.width + 160, H = view.height + 80;
  ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.beginPath();
  for (let j = 0; j < n; j++) {
    const sp = speed * (0.75 + 0.5 * hash01(j, 83)), len = 12 + 16 * hash01(j, 84);
    const y = ((hash01(j, 82) * H + t * sp) % H) - 40;
    const x = ((((hash01(j, 81) * W + y * slant) % W) + W) % W) - 80;
    ctx.moveTo(x, y); ctx.lineTo(x + slant * len, y + len);
  }
  ctx.stroke();
}
/** lightning flash strength 0..1 for a period (double flicker), deterministic from the clock */
function flashAt(t, period) {
  const ph = t % period;
  if (ph < 0.12) return 1 - ph / 0.12;
  if (ph > 0.22 && ph < 0.42) return 0.55 * (1 - (ph - 0.22) / 0.2);
  return 0;
}
/** backdrop flash + one jagged bolt (screen px) */
function drawLightning(ctx, view, period, seed, tint) {
  const t = clock(), f = flashAt(t, period);
  if (f <= 0) return;
  const cyc = Math.floor(t / period);
  ctx.fillStyle = `rgba(${tint},${(0.1 * f).toFixed(3)})`; ctx.fillRect(-64, -64, view.width + 128, view.height + 128);
  ctx.strokeStyle = `rgba(230,236,255,${(0.4 * f).toFixed(3)})`; ctx.lineWidth = 2.2; ctx.lineJoin = 'round'; ctx.beginPath();
  let x = view.width * (0.12 + 0.76 * hash01(cyc, seed)), y = -10, bx = 0, by = 0;
  const endY = view.height * (0.3 + 0.25 * hash01(cyc, seed + 1));
  ctx.moveTo(x, y);
  for (let s = 1; s <= 9; s++) {
    x += (hash01(cyc * 13 + s, seed + 2) - 0.5) * 46; y = -10 + ((endY + 10) * s) / 9; ctx.lineTo(x, y);
    if (s === 4) { bx = x; by = y; }
  }
  ctx.moveTo(bx, by);
  for (let s = 1; s <= 4; s++) ctx.lineTo(bx + s * 14 * (hash01(cyc, seed + 3) > 0.5 ? 1 : -1) + (hash01(cyc + s, seed + 4) - 0.5) * 20, by + s * 18);
  ctx.stroke();
}
/** jagged skyline polygon for tile i spanning [x, x+tile], continuous across tiles (heights hashed on tile edges) */
function ridge(ctx, x, i, tile, base, hMin, hVar, seed, pts = 5, jag = 1.5) {
  const hA = hMin + hash01(i, seed) * hVar, hB = hMin + hash01(i + 1, seed) * hVar;
  ctx.moveTo(x - 0.03, base); ctx.lineTo(x + tile + 0.03, base); ctx.lineTo(x + tile + 0.03, hB);
  for (let j = pts - 1; j >= 1; j--) { const f = j / pts; ctx.lineTo(x + f * tile, hA + (hB - hA) * f + (hash01(i * 7 + j, seed + 1) - 0.4) * jag); }
  ctx.lineTo(x - 0.03, hA); ctx.closePath();
}
/** the top polyline of ridge() (for highlight strokes) */
function ridgeLine(ctx, x, i, tile, hMin, hVar, seed, pts = 5, jag = 1.5) {
  const hA = hMin + hash01(i, seed) * hVar, hB = hMin + hash01(i + 1, seed) * hVar;
  ctx.moveTo(x - 0.03, hA);
  for (let j = 1; j < pts; j++) { const f = j / pts; ctx.lineTo(x + f * tile, hA + (hB - hA) * f + (hash01(i * 7 + j, seed + 1) - 0.4) * jag); }
  ctx.lineTo(x + tile + 0.03, hB);
}

// =========================================================================================== FREEZER (act 5)
const FRZ = [
  // 0 walk-in freezer: steel shelving, fluorescent tubes, meat-hook rail
  { top: '#19202a', bot: '#26313d', far: '#232c37', farD: '#1b222b', mid: '#29333f', midD: '#1f2730', ground: '#20282f', ice: 'rgba(185,225,255,0.11)', lamp: 'rgba(205,235,255,0.12)' },
  // 1 ice caves: teal, crystal spires, frozen falls, stalactites
  { top: '#112027', bot: '#1d3439', far: '#1c2e34', farD: '#142329', mid: '#21373c', midD: '#17292d', ground: '#18292d', ice: 'rgba(150,240,230,0.11)', lamp: 'rgba(150,240,230,0.08)' },
  // 2 glacier cold-store yard at night: aurora, ice cliffs, crate gantries, warm lamps
  { top: '#111526', bot: '#1f2538', far: '#1f2537', farD: '#171b29', mid: '#262c3d', midD: '#1b2030', ground: '#1c2130', ice: 'rgba(205,215,255,0.11)', lamp: 'rgba(255,210,140,0.12)' },
];
function drawAurora(ctx, view, cam) {
  const t = clock(), w = view.width, h = view.height;
  for (let b = 0; b < 2; b++) {
    ctx.fillStyle = b ? 'rgba(150,120,255,0.05)' : 'rgba(90,230,180,0.06)';
    ctx.beginPath();
    const base = h * (0.12 + b * 0.09) + cam.y * 1.2, amp = h * 0.05;
    const wave = (s) => base + Math.sin(s * 0.5 + t * 0.22 + b * 2 - cam.x * 0.02) * amp + Math.sin(s * 1.7 + t * 0.4) * amp * 0.25;
    for (let s = 0; s <= 24; s++) { const X = (s / 24) * (w + 80) - 40; if (s) ctx.lineTo(X, wave(s)); else ctx.moveTo(X, wave(s)); }
    for (let s = 24; s >= 0; s--) ctx.lineTo((s / 24) * (w + 80) - 40, wave(s) + h * (0.05 + 0.03 * Math.sin(s * 1.1 + t * 0.5 + b)));
    ctx.closePath(); ctx.fill();
  }
}
/** hanging slab of frozen meat on a hook (added to path); returns nothing */
function meatHook(ctx, hx, top, len, sway) {
  const mx = hx + Math.sin(sway) * len, my = top - Math.cos(sway) * len;
  poly(ctx, [hx - 0.03, top, hx + 0.03, top, mx + 0.03, my, mx - 0.03, my]);
  ctx.moveTo(mx + 0.16, my); ctx.arc(mx, my, 0.16, 0, Math.PI);           // hook curl
  ctx.ellipse(mx, my - 1.05, 0.42, 0.85, sway, 0, TAU);
}

const freezer = {
  bg: '#1e2530', glow: [130, 195, 255, 0.11],
  sky(ctx, view, cam, v) {
    v = V(v); const P = FRZ[v];
    vGrad(ctx, view, [[0, P.top], [1, P.bot]]);
    if (v === 2) { drawStars(ctx, view, cam, 80, 0.4, 1.5, 0.6); drawAurora(ctx, view, cam); }
  },
  layers: [
    { k: 0.2, tile: 5.5, col: '#232c37', draw(ctx, x, i, L, v) {
      v = V(v); const P = FRZ[v];
      if (v === 0) {                     // wall panels + steel shelving racks full of frozen boxes
        const w = 3 + hash01(i, 1) * 1.2, ox = x + 0.4 + hash01(i, 2) * (L.tile - w - 0.8), h = 6.5 + hash01(i, 3) * 3;
        ctx.fillStyle = P.farD; ctx.fillRect(x, -8, 0.08, 22); ctx.fillRect(x - 0.05, 11.6, L.tile + 0.1, 0.55);
        ctx.fillStyle = P.far; ctx.beginPath();
        ctx.rect(ox, -8, 0.16, h + 8); ctx.rect(ox + w - 0.16, -8, 0.16, h + 8);
        for (let s = 0; s < 5; s++) {
          const yy = -1.2 + (s * (h + 1.2)) / 5;
          ctx.rect(ox - 0.05, yy, w + 0.1, 0.12);
          if (s < 4) for (let j = 0; j < 4; j++) if (hash01(i * 7 + s, j) > 0.35) ctx.rect(ox + 0.25 + (j * (w - 0.45)) / 4, yy + 0.12, 0.5 + hash01(i + s, j + 3) * 0.15, 0.3 + hash01(i + s, j + 9) * 0.55);
        }
        ctx.fill();
        ctx.fillStyle = P.ice; ctx.beginPath();
        for (let s = 0; s < 5; s++) ctx.rect(ox - 0.05, -1.2 + (s * (h + 1.2)) / 5 + 0.1, w + 0.1, 0.07);
        ctx.fill();
        ctx.fillStyle = P.lamp; ctx.fillRect(x + L.tile / 2 - 1.2, 11.3, 2.4, 0.2);   // fluorescent tube
      } else if (v === 1) {              // cave ceiling with stalactites, crystal spires, frozen waterfall
        ctx.fillStyle = P.far; ctx.beginPath();
        ctx.rect(x - 0.03, 12, L.tile + 0.06, 30);
        for (let j = 0; j < 4; j++) {
          const cx = x + ((j + hash01(i, j)) * L.tile) / 4, len = 1.2 + hash01(i, j + 10) * 4.5, hw = 0.25 + hash01(i, j + 20) * 0.45;
          poly(ctx, [cx - hw, 12.05, cx, 12 - len, cx + hw, 12.05]);
        }
        for (let j = 0; j < 3; j++) {
          const cx = x + 0.5 + hash01(i, j + 30) * (L.tile - 1), hh = 1.5 + hash01(i, j + 40) * 5, hw = 0.35 + hash01(i, j + 50) * 0.55;
          poly(ctx, [cx - hw, -8, cx + hw, -8, cx + hw, hh - hw * 1.6, cx, hh, cx - hw, hh - hw * 1.6]);
        }
        ctx.fill();
        ctx.fillStyle = P.ice; ctx.beginPath();
        for (let j = 0; j < 3; j++) {
          const cx = x + 0.5 + hash01(i, j + 30) * (L.tile - 1), hh = 1.5 + hash01(i, j + 40) * 5, hw = 0.35 + hash01(i, j + 50) * 0.55;
          poly(ctx, [cx + hw * 0.3, -8, cx + hw, -8, cx + hw, hh - hw * 1.6, cx, hh]);
        }
        if (hash01(i, 5) > 0.62) {       // frozen waterfall
          const fx = x + 1 + hash01(i, 6) * 3;
          ctx.moveTo(fx, 12); ctx.lineTo(fx + 1.1, 12);
          for (let s = 1; s <= 8; s++) ctx.lineTo(fx + 1.1 + Math.sin(s * 1.9 + i) * 0.18, 12 - s * 2.5);
          for (let s = 8; s >= 1; s--) ctx.lineTo(fx + Math.sin(s * 2.3 + i) * 0.18, 12 - s * 2.5);
          ctx.closePath();
        }
        ctx.fill();
      } else {                           // jagged glacier cliffs with snow-lit ridge
        ctx.fillStyle = P.far; ctx.beginPath(); ridge(ctx, x, i, L.tile, -10, 2.5, 6, 60, 5, 2.2); ctx.fill();
        ctx.strokeStyle = P.ice; ctx.lineWidth = 0.14; ctx.lineJoin = 'round'; ctx.beginPath(); ridgeLine(ctx, x, i, L.tile, 2.5, 6, 60, 5, 2.2); ctx.stroke();
        ctx.fillStyle = P.farD; ctx.beginPath();
        for (let j = 0; j < 2; j++) { const cx = x + 1 + hash01(i, j + 64) * 3.5, hh = 1 + hash01(i, j + 66) * 2; poly(ctx, [cx - 0.12, -10, cx + 0.12, -10, cx + 0.04, hh, cx - 0.04, hh]); }
        ctx.fill();
      }
    } },
    { k: 0.44, tile: 6.5, col: '#29333f', draw(ctx, x, i, L, v) {
      v = V(v); const P = FRZ[v], t = clock();
      ctx.fillStyle = P.ground; ctx.fillRect(x - 0.02, -20, L.tile + 0.04, 20.1);
      if (v === 0) {                     // hook rail with swinging frozen meat, icicles under the rail, frosted crates
        ctx.fillStyle = P.mid; ctx.beginPath();
        ctx.rect(x - 0.02, 7.2, L.tile + 0.04, 0.16); ctx.rect(x + L.tile / 2 - 0.06, 7.36, 0.12, 8);
        for (let j = 0; j < 2; j++) {
          const hx = x + 1.2 + j * 3.2 + hash01(i, j) * 0.8;
          if (hash01(i, j + 4) > 0.25) meatHook(ctx, hx, 7.2, 0.5 + hash01(i, j + 2) * 1.2, Math.sin(t * 0.7 + i * 1.7 + j * 2.3) * 0.05);
        }
        const n = (hash01(i, 8) * 3) | 0;
        for (let c = 0; c < n; c++) ctx.rect(x + 0.4 + c * 1.35, 0, 1.2, 1 + hash01(i, c + 11) * 0.6);
        if (n > 1 && hash01(i, 9) > 0.5) ctx.rect(x + 1.0, 1.6, 1.2, 0.9);
        ctx.fill();
        ctx.fillStyle = P.ice; ctx.beginPath();
        for (let j = 0; j < 9; j++) { const ix = x + 0.3 + j * 0.72, il = 0.15 + hash01(i * 3 + j, 20) * 0.55; poly(ctx, [ix - 0.07, 7.2, ix, 7.2 - il, ix + 0.07, 7.2]); }
        for (let c = 0; c < n; c++) ctx.rect(x + 0.4 + c * 1.35, 0.95 + hash01(i, c + 11) * 0.6, 1.2, 0.08);
        ctx.fill();
        ctx.fillStyle = P.midD; ctx.beginPath();
        for (let c = 0; c < n; c++) { ctx.rect(x + 0.55 + c * 1.35, 0.4, 0.9, 0.06); }
        ctx.fill();
      } else if (v === 1) {              // hanging icicle curtain + crystal clusters on a frozen pool
        ctx.fillStyle = P.mid; ctx.beginPath();
        ctx.rect(x - 0.02, 9.6, L.tile + 0.04, 20);
        for (let j = 0; j < 7; j++) { const ix = x + ((j + hash01(i, j)) * L.tile) / 7, il = 0.6 + hash01(i, j + 7) * 2.6, hw = 0.12 + hash01(i, j + 14) * 0.2; poly(ctx, [ix - hw, 9.65, ix, 9.6 - il, ix + hw, 9.65]); }
        const cx = x + 1.2 + hash01(i, 30) * 3.5;
        for (let j = 0; j < 5; j++) {
          const a = -0.7 + j * 0.35 + (hash01(i, j + 31) - 0.5) * 0.2, ln = 0.9 + hash01(i, j + 36) * 1.6 * (1 - Math.abs(j - 2) * 0.25), hw = 0.16 + hash01(i, j + 41) * 0.1;
          const dx = Math.sin(a), dy = Math.cos(a), px = -dy * hw, py = dx * hw;
          poly(ctx, [cx + px, py - 0.1, cx + dx * ln + px, dy * ln + py, cx + dx * (ln + hw * 1.8), dy * (ln + hw * 1.8), cx + dx * ln - px, dy * ln - py, cx - px, -py - 0.1]);
        }
        ctx.fill();
        ctx.fillStyle = P.ice; ctx.beginPath();
        ctx.rect(x - 0.02, -0.05, L.tile + 0.04, 0.05);
        for (let j = 0; j < 5; j++) {
          const a = -0.7 + j * 0.35 + (hash01(i, j + 31) - 0.5) * 0.2, ln = 0.9 + hash01(i, j + 36) * 1.6 * (1 - Math.abs(j - 2) * 0.25);
          poly(ctx, [cx, 0, cx + Math.sin(a) * ln, Math.cos(a) * ln, cx + Math.sin(a) * (ln + 0.3), Math.cos(a) * (ln + 0.3)]);
        }
        ctx.fill();
      } else {                           // hook gantry with a hanging frozen crate, snow-capped crate stacks, warm yard lamp
        const gx = x + 0.6;
        ctx.fillStyle = P.mid; ctx.beginPath();
        if ((i & 1) === 0) {
          poly(ctx, [gx, 0, gx + 0.2, 0, gx + 0.55, 6.2, gx + 0.35, 6.2]);
          poly(ctx, [gx + 5.1, 0, gx + 5.3, 0, gx + 4.95, 6.2, gx + 4.75, 6.2]);
          ctx.rect(gx + 0.2, 6.1, 4.9, 0.3);
          const sw = Math.sin(t * 0.6 + i) * 0.04, cx = gx + 2.6 + Math.sin(sw) * 2.4, cy = 6.1 - Math.cos(sw) * 2.4;
          poly(ctx, [gx + 2.57, 6.1, gx + 2.63, 6.1, cx + 0.03, cy, cx - 0.03, cy]);
          ctx.rect(cx - 0.6, cy - 1.1, 1.2, 1.1);
        } else {
          ctx.rect(x + 3.2, 0, 0.12, 4.2); ctx.rect(x + 3.0, 4.2, 0.6, 0.14);
          ctx.rect(x + 0.6, 0, 1.3, 1.2); ctx.rect(x + 1.9, 0, 1.1, 0.9); ctx.rect(x + 0.9, 1.2, 1.1, 1.0);
        }
        ctx.fill();
        ctx.fillStyle = P.ice; ctx.beginPath();
        if ((i & 1) === 0) { const sw = Math.sin(t * 0.6 + i) * 0.04, cx = gx + 2.6 + Math.sin(sw) * 2.4, cy = 6.1 - Math.cos(sw) * 2.4; ctx.rect(cx - 0.62, cy - 0.06, 1.24, 0.1); ctx.rect(gx + 0.2, 6.4, 4.9, 0.08); }
        else { ctx.rect(x + 0.6, 1.15, 1.3, 0.09); ctx.rect(x + 1.9, 0.85, 1.1, 0.09); ctx.rect(x + 0.9, 2.15, 1.1, 0.09); }
        ctx.fill();
        if ((i & 1) === 1) {
          ctx.fillStyle = 'rgba(255,210,140,0.035)'; ctx.beginPath(); poly(ctx, [x + 3.15, 4.1, x + 3.45, 4.1, x + 4.2, 0, x + 2.4, 0]); ctx.fill();
          ctx.fillStyle = P.lamp; ctx.fillRect(x + 3.08, 4.04, 0.44, 0.1);
        }
      }
    } },
  ],
};

// ============================================================================================ DOCKS (act 6)
const DCK = [
  // 0 dusk: striped low sun, warm glints, gulls, cranes + container stacks
  { top: '#1c1f30', mid: '#302838', hor: '#46333a', sun: '#6d4540', water: '#242534', swell: 'rgba(18,18,28,0.35)', glint: 'rgba(255,150,90,0.12)', far: '#2c2635', mid1: '#252230', near: '#1f1d28', lamp: 'rgba(255,190,110,0.16)', box: ['#382a2f', '#26323a', '#3a3329', '#2b2e40'], win: 'rgba(255,194,61,0.10)' },
  // 1 night: moon, stars, lit ship windows, lighthouse beams
  { top: '#10131d', mid: '#161a28', hor: '#1f2536', sun: '#353c4c', water: '#151923', swell: 'rgba(8,10,16,0.35)', glint: 'rgba(170,190,255,0.08)', far: '#1d2130', mid1: '#191c28', near: '#151822', lamp: 'rgba(255,194,100,0.22)', box: ['#2b2126', '#1c262d', '#2c2820', '#20232f'], win: 'rgba(255,194,61,0.2)' },
  // 2 foggy morning: pale disc, grey-teal haze, fishing boats
  { top: '#232830', mid: '#2d3238', hor: '#393e43', sun: '#404448', water: '#2a2f35', swell: 'rgba(20,24,28,0.25)', glint: 'rgba(220,230,240,0.06)', far: '#34393e', mid1: '#2c3136', near: '#23272d', lamp: 'rgba(255,220,170,0.12)', box: ['#3a3134', '#2e373b', '#3b3730', '#31343c'], win: 'rgba(255,220,160,0.08)' },
];
const DOCK_KINDS = [[0, 1, 2, 1], [2, 1, 2, 0], [0, 3, 1, 3]];   // per variant: 0 crane, 1 container pier, 2 cargo ship, 3 fishing boats

const docks = {
  bg: '#1f2230', glow: [255, 150, 90, 0.12],
  sky(ctx, view, cam, v) {
    v = V(v); const P = DCK[v], t = clock(), hy = layerSY(view, cam, 0.1, 0), W = view.width;
    vGrad(ctx, view, [[0, P.top], [0.55, P.mid], [1, P.hor]], 0, hy);
    if (v === 1) drawStars(ctx, view, cam, 90, 0.35, 0.6, 0.5);
    const sx = W * (v === 1 ? 0.72 : 0.3) - cam.x * 0.7, R = Math.min(W, view.height) * (v === 1 ? 0.045 : 0.085);
    const sunY = v === 1 ? hy - view.height * 0.36 : hy - R * 0.35;
    ctx.fillStyle = P.sun; ctx.beginPath(); ctx.arc(sx, sunY, R, 0, TAU); ctx.fill();
    if (v === 0) { ctx.fillStyle = P.hor; ctx.beginPath(); for (let s = 0; s < 4; s++) ctx.rect(sx - R, sunY + R * (0.05 + s * 0.2), R * 2, R * (0.03 + s * 0.025)); ctx.fill(); }
    ctx.fillStyle = P.water; ctx.fillRect(-64, hy, W + 128, view.height - hy + 64);
    ctx.fillStyle = P.swell; ctx.beginPath();
    for (let j = 1; j < 11; j++) ctx.rect(-64, hy + j * j * 5, W + 128, 1 + j * 0.5);
    ctx.fill();
    ctx.fillStyle = P.glint; ctx.beginPath();
    for (let j = 0; j < 30; j++) {
      const d = hash01(j, 91), yy = hy + 2 + d * d * Math.max(0, view.height - hy);
      const xx = sx + (hash01(j, 92) - 0.5) * (16 + (yy - hy) * 0.9) + Math.sin(t * 1.3 + j) * 4;
      const ww = (6 + hash01(j, 93) * 24) * (0.55 + 0.45 * Math.sin(t * 1.8 + j * 1.7));
      ctx.rect(xx - ww / 2, yy, ww, 1.5 + (yy - hy) * 0.01);
    }
    ctx.fill();
    if (v !== 1) {                     // gulls
      ctx.strokeStyle = P.far; ctx.lineWidth = 1.6; ctx.beginPath();
      for (let j = 0; j < 4; j++) {
        const gx = ((((hash01(j, 94) * (W + 200) + t * (10 + 8 * hash01(j, 95)) - cam.x * 3) % (W + 200)) + W + 200) % (W + 200)) - 100;
        const gy = view.height * (0.12 + hash01(j, 96) * 0.25) + Math.sin(t * 0.5 + j) * 6, fl = Math.sin(t * 5 + j * 2) * 3, s = 5 + hash01(j, 97) * 3;
        ctx.moveTo(gx - s, gy - 2 - fl); ctx.quadraticCurveTo(gx - s * 0.4, gy - 3 - fl, gx, gy); ctx.quadraticCurveTo(gx + s * 0.4, gy - 3 - fl, gx + s, gy - 2 - fl);
      }
      ctx.stroke();
    }
  },
  layers: [
    { k: 0.1, tile: 12, col: '#2c2635', draw(ctx, x, i, L, v) {        // far coast, lighthouse, tiny ships
      v = V(v); const P = DCK[v], t = clock();
      ctx.fillStyle = P.far; ctx.beginPath();
      ridge(ctx, x, i, L.tile, -0.3, 0.1, 1.4, 40, 4, 0.7);
      if (hash01(i, 3) > 0.45) for (let b = 0; b < 6; b++) ctx.rect(x + 2 + b * 0.75 + hash01(i, b + 10) * 0.3, 0, 0.6, 0.8 + hash01(i, b + 20) * 2.2);
      const light = hash01(i, 5) > 0.5, lx = x + 3 + hash01(i, 6) * 6;
      if (light) {
        poly(ctx, [lx - 1.2, -0.3, lx + 1.4, -0.3, lx + 0.6, 0.6, lx - 0.8, 0.5]);
        poly(ctx, [lx - 0.35, 0.4, lx + 0.35, 0.4, lx + 0.22, 4.4, lx - 0.22, 4.4]);
        ctx.rect(lx - 0.4, 4.4, 0.8, 0.14); ctx.rect(lx - 0.2, 4.54, 0.4, 0.4);
        poly(ctx, [lx - 0.3, 4.94, lx + 0.3, 4.94, lx, 5.35]);
      }
      if (hash01(i, 7) > 0.4) { const sx = x + 0.5 + hash01(i, 8) * 9; poly(ctx, [sx, -0.05, sx + 2.4, -0.05, sx + 2.7, 0.35, sx - 0.2, 0.35]); ctx.rect(sx + 0.3, 0.35, 0.6, 0.4); ctx.rect(sx + 1.3, 0.35, 0.18, 0.7); }
      ctx.fill();
      if (light) {
        const a = t * 0.7 + i, c = Math.cos(a), len = 26 * c;
        ctx.fillStyle = `rgba(255,220,150,${(0.03 * Math.abs(c) * (v === 1 ? 1.3 : 0.6)).toFixed(3)})`; ctx.beginPath();
        poly(ctx, [lx, 4.72, lx + len, 4.72 + 2.6 * Math.abs(c) + 0.3, lx + len, 4.72 - 2.6 * Math.abs(c) - 0.3]); ctx.fill();
        ctx.fillStyle = P.lamp; ctx.fillRect(lx - 0.16, 4.6, 0.32, 0.28);
      }
      if (v === 1 && hash01(i, 3) > 0.45) { ctx.fillStyle = P.win; ctx.beginPath(); for (let b = 0; b < 12; b++) if (hash01(i * 5 + b, 30) > 0.5) ctx.rect(x + 2.15 + hash01(i, b + 40) * 4.2, 0.3 + hash01(i, b + 50) * 1.6, 0.12, 0.12); ctx.fill(); }
    } },
    { k: 0.24, tile: 13, col: '#252230', draw(ctx, x, i, L, v) {       // cranes, container piers, cargo ships, fishing boats
      v = V(v); const P = DCK[v], t = clock(), kind = DOCK_KINDS[v][(hash01(i, 1) * 4) | 0];
      if (kind === 0 || kind === 1) {
        ctx.fillStyle = P.mid1; ctx.beginPath();
        ctx.rect(x + 0.4, -0.35, L.tile - 0.8, 0.35);
        for (let p = 0; p < 9; p++) ctx.rect(x + 0.6 + p * 1.45, -3.5, 0.2, 3.2);
        if (kind === 0) {
          const cx = x + 4 + hash01(i, 2) * 4, sway = Math.sin(t * 0.5 + i) * 0.03, tx = cx + 2.4 + Math.sin(t * 0.13 + i) * 1.5;
          poly(ctx, [cx - 1.7, 0, cx - 1.35, 0, cx - 1.0, 6.5, cx - 1.35, 6.5]);
          poly(ctx, [cx + 1.35, 0, cx + 1.7, 0, cx + 1.35, 6.5, cx + 1.0, 6.5]);
          ctx.rect(cx - 1.5, 3, 3, 0.25); ctx.rect(cx - 1.7, 6.5, 3.4, 0.6); ctx.rect(cx - 5, 6.95, 11.5, 0.35);
          poly(ctx, [cx - 1.0, 7.3, cx - 0.75, 7.3, cx - 0.05, 9.7, cx - 0.25, 9.7]);
          poly(ctx, [cx + 0.75, 7.3, cx + 1.0, 7.3, cx + 0.25, 9.7, cx + 0.05, 9.7]);
          const ly = 6.95 - 2.6, lx = tx + Math.sin(sway) * 2.6;
          ctx.rect(tx - 0.3, 6.75, 0.6, 0.2); poly(ctx, [tx - 0.02, 6.75, tx + 0.02, 6.75, lx + 0.02, ly, lx - 0.02, ly]);
          ctx.rect(lx - 1.2, ly - 1.05, 2.4, 1.05);
          ctx.fill();
          ctx.strokeStyle = P.mid1; ctx.lineWidth = 0.05; ctx.beginPath();
          ctx.moveTo(cx, 9.6); ctx.lineTo(cx - 5, 7.3); ctx.moveTo(cx, 9.6); ctx.lineTo(cx + 6.5, 7.3); ctx.moveTo(cx - 1.35, 0.2); ctx.lineTo(cx + 1.2, 3); ctx.moveTo(cx + 1.35, 0.2); ctx.lineTo(cx - 1.2, 3);
          ctx.stroke();
          const blink = Math.sin(t * 3 + i) > 0.3;
          if (blink) { ctx.fillStyle = v === 1 ? 'rgba(216,67,47,0.55)' : 'rgba(216,67,47,0.3)'; ctx.fillRect(cx - 0.1, 9.65, 0.2, 0.2); }
          for (let c = 0; c < 2; c++) {
            ctx.fillStyle = P.box[(c + i) & 3]; ctx.beginPath();
            ctx.rect(x + (c ? 9.8 : 0.8), 0, 2.4, 1); if (hash01(i, c + 5) > 0.4) ctx.rect(x + (c ? 9.8 : 0.8), 1.02, 2.4, 1);
            ctx.fill();
          }
        } else {
          ctx.fill();
          for (let col = 0; col < 4; col++) {
            ctx.fillStyle = P.box[col]; ctx.beginPath();
            for (let c = 0; c < 5; c++) {
              const hgt = 1 + ((hash01(i, c + 60) * 3.2) | 0);
              for (let lv = 0; lv < hgt; lv++) if ((((hash01(i * 9 + c, lv + 70)) * 4) | 0) === col) ctx.rect(x + 0.7 + c * 2.45, lv * 1.04, 2.4, 1);
            }
            ctx.fill();
          }
          ctx.fillStyle = 'rgba(0,0,0,0.14)'; ctx.beginPath();
          for (let c = 0; c < 5; c++) { const hgt = 1 + ((hash01(i, c + 60) * 3.2) | 0); for (let rb = 1; rb < 6; rb++) ctx.rect(x + 0.7 + c * 2.45 + rb * 0.4, 0, 0.05, hgt * 1.04 - 0.04); }
          ctx.fill();
        }
      } else if (kind === 2) {
        const bob = Math.sin(t * 0.6 + i) * 0.06, bx = x + 0.6;
        ctx.fillStyle = P.mid1; ctx.beginPath();
        poly(ctx, [bx + 0.5, -0.9 + bob, bx + 10.6, -0.9 + bob, bx + 12, 1.3 + bob, bx, 1.3 + bob]);
        ctx.rect(bx + 0.7, 1.3 + bob, 2, 2.6); ctx.rect(bx + 0.4, 3.6 + bob, 2.6, 0.3); ctx.rect(bx + 1.6, 3.9 + bob, 0.55, 1.1); ctx.rect(bx + 1.2, 3.9 + bob, 0.05, 1.8);
        ctx.fill();
        for (let col = 0; col < 4; col++) {
          ctx.fillStyle = P.box[col]; ctx.beginPath();
          for (let c = 0; c < 6; c++) { const hgt = 1 + ((hash01(i, c + 80) * 2.5) | 0); for (let lv = 0; lv < hgt; lv++) if (((hash01(i * 3 + c, lv + 90) * 4) | 0) === col) ctx.rect(bx + 3 + c * 1.25, 1.3 + bob + lv * 0.72, 1.2, 0.7); }
          ctx.fill();
        }
        ctx.fillStyle = P.win; ctx.beginPath();
        for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) if (hash01(i * 5 + r, c) > (v === 1 ? 0.35 : 0.7)) ctx.rect(bx + 0.85 + c * 0.45, 2.1 + r * 0.55 + bob, 0.22, 0.2);
        ctx.fill();
      } else {
        for (let b = 0; b < 2; b++) {
          const bob = Math.sin(t * 0.9 + i + b * 2.1) * 0.1, bx = x + 1.5 + b * 5.5 + hash01(i, b + 3) * 1.5, tilt = Math.sin(t * 0.7 + b + i) * 0.06;
          ctx.fillStyle = P.mid1; ctx.beginPath();
          poly(ctx, [bx, -0.5 + bob - tilt, bx + 3.4, -0.5 + bob + tilt, bx + 3.9, 0.5 + bob + tilt, bx - 0.3, 0.5 + bob - tilt]);
          ctx.rect(bx + 0.4, 0.45 + bob, 1.2, 0.9); ctx.rect(bx + 2.4, 0.45 + bob, 0.08, 3.2);
          ctx.fill();
          ctx.strokeStyle = P.mid1; ctx.lineWidth = 0.04; ctx.beginPath();
          ctx.moveTo(bx + 2.44, 3.6 + bob); ctx.lineTo(bx - 0.2, 0.55 + bob); ctx.moveTo(bx + 2.44, 3.6 + bob); ctx.lineTo(bx + 3.8, 0.55 + bob);
          ctx.stroke();
          ctx.fillStyle = P.win; ctx.fillRect(bx + 0.6, 0.85 + bob, 0.3, 0.25);
        }
      }
    } },
    { k: 0.5, tile: 5.5, col: '#1f1d28', draw(ctx, x, i, L, v) {       // foreground pier: pilings, ropes, lamp posts, string lights
      v = V(v); const P = DCK[v], t = clock();
      ctx.fillStyle = P.near; ctx.beginPath();
      ctx.rect(x - 0.02, -20, L.tile + 0.04, 16.8);
      ctx.rect(x - 0.02, -2.95, L.tile + 0.04, 0.38);
      for (const px of [0.3, 3.05]) { ctx.rect(x + px, -4, 0.34, 1.75); circ(ctx, x + px + 0.17, -2.25, 0.17); }
      const lamp = (i & 1) === 0;
      if (lamp) { ctx.rect(x + 4.3, -2.6, 0.12, 7.2); ctx.rect(x + 4.0, 4.5, 0.72, 0.08); ctx.rect(x + 3.98, 4.2, 0.16, 0.3); ctx.rect(x + 4.58, 4.2, 0.16, 0.3); }
      else {
        ctx.rect(x + 1.2, -2.57, 0.36, 0.45); ctx.rect(x + 1.1, -2.15, 0.56, 0.1);
        if (hash01(i, 2) > 0.4) { ctx.rect(x + 3.9, -2.57, 0.9, 0.8); ctx.rect(x + 4.1, -1.77, 0.7, 0.6); }
      }
      ctx.fill();
      ctx.strokeStyle = P.near; ctx.lineWidth = 0.05; ctx.beginPath();
      ctx.moveTo(x + 0.47, -2.3); ctx.quadraticCurveTo(x + 1.85, -2.85, x + 3.22, -2.3); ctx.moveTo(x + 3.22, -2.3); ctx.quadraticCurveTo(x + 4.6, -2.85, x + 5.97, -2.3);
      if (v !== 2) { ctx.moveTo(x + 4.36, 4.4); ctx.quadraticCurveTo(x + 1.6, 3.2, x - 1.14, 4.4); }
      ctx.stroke();
      ctx.fillStyle = P.lamp; ctx.beginPath();
      if (lamp) { ctx.rect(x + 4.0, 4.05, 0.2, 0.15); ctx.rect(x + 4.52, 4.05, 0.2, 0.15); }
      if (v !== 2) for (let b = 1; b < 6; b++) { const f = b / 6, bx = x + 4.36 - f * 5.5, by = 4.4 - 4 * f * (1 - f) * 0.6 - 0.12; if (Math.sin(t * 2 + b * 1.3 + i) > -0.6) ctx.rect(bx - 0.06, by - 0.06, 0.12, 0.12); }
      ctx.fill();
    } },
  ],
};

// ========================================================================================== VOLCANO (act 7)
const VOL = [
  // 0 lava grill cavern: orange lava falls, hanging giant grill grates over fire pits
  { top: '#151112', bot: '#2e1c17', far: '#251c1b', farD: '#1b1515', mid: '#2b201e', ground: '#211918', lava: '255,110,40', hot: '255,190,90', falls: 0.55, smoke: '70,58,56' },
  // 1 magma forge: deep red, many lava falls, glowing grate walls
  { top: '#160c0e', bot: '#3a1614', far: '#28191a', farD: '#1d1213', mid: '#2e1c1c', ground: '#231515', lava: '255,70,30', hot: '255,160,80', falls: 0.3, smoke: '60,40,40' },
  // 2 ashen vents: smoky purple-grey, steam plumes, rock arches, falling ash
  { top: '#19171c', bot: '#2c2427', far: '#262125', farD: '#1d1a1d', mid: '#2c2629', ground: '#221e21', lava: '255,120,50', hot: '255,200,120', falls: 0.85, smoke: '95,88,92' },
];
const volcano = {
  bg: '#211a1a', glow: [255, 95, 35, 0.19],
  sky(ctx, view, cam, v) {
    v = V(v); const P = VOL[v];
    vGrad(ctx, view, [[0, P.top], [1, P.bot]]);
    if (v === 2) {                     // slow falling ash
      const t = clock(), W = view.width + 20, H = view.height + 20;
      ctx.fillStyle = 'rgba(160,150,150,0.16)'; ctx.beginPath();
      for (let j = 0; j < 60; j++) {
        let ax = hash01(j, 101) * W + Math.sin(t * 0.4 + j) * 14 - cam.x * 2; ax = ((ax % W) + W) % W - 10;
        const ay = ((hash01(j, 102) * H + t * (12 + 16 * hash01(j, 103))) % H) - 10, r = 1 + hash01(j, 104) * 1.6;
        ctx.rect(ax, ay, r, r);
      }
      ctx.fill();
    }
  },
  layers: [
    { k: 0.18, tile: 7, col: '#251c1b', draw(ctx, x, i, L, v) {        // cavern roof, basalt column clusters, lava falls
      v = V(v); const P = VOL[v], t = clock();
      ctx.fillStyle = P.far; ctx.beginPath();
      ctx.rect(x - 0.03, 11, L.tile + 0.06, 30);
      for (let j = 0; j < 4; j++) { const cx = x + ((j + hash01(i, j)) * L.tile) / 4, len = 1 + hash01(i, j + 10) * 3.5, hw = 0.3 + hash01(i, j + 20) * 0.5; poly(ctx, [cx - hw, 11.05, cx, 11 - len, cx + hw, 11.05]); }
      const gx = x + 0.4 + hash01(i, 30) * 2.5, n = 4 + ((hash01(i, 31) * 4) | 0);
      for (let c = 0; c < n; c++) {
        const hh = 1.5 + hash01(i, c + 32) * 5 * (1 - Math.abs(c - n / 2) / n), tilt = (hash01(i, c + 42) - 0.5) * 0.35;
        poly(ctx, [gx + c * 0.56, -10, gx + c * 0.56 + 0.52, -10, gx + c * 0.56 + 0.52, hh + tilt, gx + c * 0.56, hh - tilt]);
      }
      ctx.fill();
      ctx.fillStyle = P.farD; ctx.beginPath();
      for (let c = 0; c < n; c++) ctx.rect(gx + c * 0.56 + 0.4, -10, 0.12, 11 + hash01(i, c + 32) * 4 * (1 - Math.abs(c - n / 2) / n));
      ctx.fill();
      if (hash01(i, 5) > P.falls) {
        const fx = x + 4.6 + hash01(i, 6) * 1.6, fl = 0.1 + 0.02 * Math.sin(t * 5 + i);
        ctx.fillStyle = `rgba(${P.lava},${fl.toFixed(3)})`; ctx.beginPath();
        ctx.rect(fx - 0.45, -10, 0.9, 21); ctx.ellipse(fx, -1.2, 1.8, 0.5, 0, 0, TAU);
        ctx.fill();
        ctx.fillStyle = `rgba(${P.hot},0.13)`; ctx.beginPath();
        ctx.rect(fx - 0.12, -10, 0.24, 21);
        for (let s = 0; s < 5; s++) { const yy = 11 - (((t * 3 + s * 4.4 + i * 1.3) % 22)); ctx.rect(fx - 0.3, yy, 0.6, 0.9 + (s % 2) * 0.6); }
        ctx.fill();
      }
    } },
    { k: 0.42, tile: 7.5, col: '#2b201e', draw(ctx, x, i, L, v) {       // grill grates, fire pits, smoke, lava-cracked ground
      v = V(v); const P = VOL[v], t = clock(), even = (i & 1) === 0;
      ctx.fillStyle = P.ground; ctx.beginPath();
      poly(ctx, [x - 0.03, -20, x + L.tile + 0.03, -20, x + L.tile + 0.03, 0.1 + hash01(i + 1, 7) * 0.4, x + L.tile * 0.5, 0.25 + hash01(i, 8) * 0.5, x - 0.03, 0.1 + hash01(i, 7) * 0.4]);
      ctx.fill();
      const pulse = 0.14 + 0.06 * Math.sin(t * 1.7 + i * 0.9);
      ctx.strokeStyle = `rgba(${P.lava},${pulse.toFixed(3)})`; ctx.lineWidth = 0.07; ctx.lineJoin = 'round'; ctx.beginPath();
      const cx0 = x + hash01(i, 9) * L.tile;
      ctx.moveTo(cx0, 0.1); ctx.lineTo(cx0 + 0.4, -0.6); ctx.lineTo(cx0 + 0.1, -1.3); ctx.lineTo(cx0 + 0.7, -2.4); ctx.moveTo(cx0 + 0.4, -0.6); ctx.lineTo(cx0 + 1.2, -1.0);
      ctx.stroke();
      if (v === 0 || (v === 1 && !even)) {
        // hanging grill grate on chains over a fire pit
        const gx = x + 1.2 + hash01(i, 12) * 1.5, gw = 4.2, gy = 4.4 + hash01(i, 13) * 1.2, sw = Math.sin(t * 0.5 + i) * 0.05;
        const fire = 0.12 + 0.05 * Math.sin(t * 9 + i) + 0.03 * Math.sin(t * 15.7 + i * 2);
        ctx.fillStyle = `rgba(${P.lava},${fire.toFixed(3)})`; ctx.beginPath();
        for (let f = 0; f < 6; f++) { const fx = gx + 0.4 + f * 0.7, fh = 0.5 + 0.6 * (0.5 + 0.5 * Math.sin(t * (6 + f) + f * 1.9 + i)); poly(ctx, [fx - 0.3, 0.25, fx + 0.3, 0.25, fx + 0.05, 0.25 + fh]); }
        ctx.fill();
        ctx.fillStyle = P.mid; ctx.beginPath();
        ctx.rect(gx - 0.3, 0, gw + 0.6, 0.35);
        const ox = sw * 3;
        ctx.rect(gx + ox, gy, gw, 0.14); ctx.rect(gx + ox, gy + 2.2, gw, 0.14); ctx.rect(gx + ox, gy, 0.14, 2.34); ctx.rect(gx + gw - 0.14 + ox, gy, 0.14, 2.34);
        for (let b = 1; b < 11; b++) ctx.rect(gx + ox + (b * gw) / 11 - 0.04, gy, 0.08, 2.3);
        for (let c = 0; c < 2; c++) { const chx = gx + (c ? gw - 0.4 : 0.4); for (let k = 0; k < 9; k++) ctx.rect(chx + (ox * (9 - k)) / 9 - 0.05, gy + 2.4 + k * 0.7, 0.1, 0.45); }
        ctx.fill();
      } else if (v === 1) {
        // standing grate wall with lava glowing through the bars
        const gx = x + 1.5, gw = 4.5, gh = 5.5;
        const a = 0.12 + 0.04 * Math.sin(t * 2.3 + i);
        ctx.fillStyle = `rgba(${P.lava},${a.toFixed(3)})`; ctx.fillRect(gx, 0.2, gw, gh);
        ctx.fillStyle = P.mid; ctx.beginPath();
        ctx.rect(gx - 0.2, 0, 0.3, gh + 0.6); ctx.rect(gx + gw - 0.1, 0, 0.3, gh + 0.6); ctx.rect(gx - 0.3, gh + 0.2, gw + 0.6, 0.3);
        for (let b = 1; b < 9; b++) ctx.rect(gx + (b * gw) / 9 - 0.07, 0.2, 0.14, gh);
        for (let b = 1; b < 4; b++) ctx.rect(gx, (b * gh) / 4, gw, 0.1);
        ctx.fill();
      } else {
        // rock arch + steam vent
        ctx.fillStyle = P.mid; ctx.beginPath();
        if (even) { const ax = x + 1 + hash01(i, 14) * 1.5; ctx.moveTo(ax, 0); ctx.lineTo(ax + 1, 0); ctx.lineTo(ax + 1, 3); ctx.quadraticCurveTo(ax + 2.5, 5, ax + 4, 3); ctx.lineTo(ax + 4, 0); ctx.lineTo(ax + 5, 0); ctx.lineTo(ax + 5, 3.2); ctx.quadraticCurveTo(ax + 2.5, 7.2, ax, 3.2); ctx.closePath(); }
        else { poly(ctx, [x + 2.6, 0, x + 4.6, 0, x + 3.9, 0.9, x + 3.3, 0.9]); }
        ctx.fill();
      }
      // smoke / steam puffs
      const vx = even ? x + 3.3 + (v === 2 ? 0 : 0.2) : x + 3.6, vy = v === 2 && !even ? 0.9 : 7.2, puffs = v === 2 ? 6 : 4;
      for (let s = 0; s < puffs; s++) {
        const ph = (t * 0.18 + s / puffs + hash01(i, 15)) % 1;
        ctx.fillStyle = `rgba(${P.smoke},${((v === 2 ? 0.1 : 0.14) * (1 - ph) * Math.min(1, ph * 6)).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(vx + Math.sin(ph * 5 + i) * 0.5 + ph * 1.2, vy + ph * 7, 0.35 + ph * 1.3, 0, TAU); ctx.fill();
      }
    } },
  ],
};

// ========================================================================================= SKY TEMPLE (act 8)
const SKYP = [
  // 0 muted day: pale sun, prayer flags, waterfalls off the islands
  { top: '#27304a', bot: '#444a5a', sun: '#565b6a', halo: 'rgba(255,240,210,0.05)', cloudFar: '#3c4254', cloudNear: '#474c5d', island: '#30354a', temple: '#2b2f41', rim: 'rgba(210,225,255,0.10)', rope: '#343a4c', flags: ['rgba(216,67,47,0.34)', 'rgba(255,194,61,0.28)', 'rgba(120,190,200,0.26)'], lamp: 'rgba(255,220,160,0.12)', kinds: [0, 1, 2, 0] },
  // 1 sunset: warm low sun, rim-lit islands, many pagodas
  { top: '#272238', bot: '#533a3d', sun: '#77504a', halo: 'rgba(255,170,110,0.06)', cloudFar: '#47373f', cloudNear: '#553f44', island: '#2e2531', temple: '#29212c', rim: 'rgba(255,170,110,0.16)', rope: '#3a2d36', flags: ['rgba(216,67,47,0.38)', 'rgba(255,194,61,0.32)', 'rgba(242,238,230,0.16)'], lamp: 'rgba(255,190,110,0.16)', kinds: [0, 0, 3, 1] },
  // 2 night: moon, stars, glowing lanterns and temple windows
  { top: '#111526', bot: '#252a3f', sun: '#394056', halo: 'rgba(190,210,255,0.04)', cloudFar: '#252b3f', cloudNear: '#2d3348', island: '#1c2030', temple: '#191c2a', rim: 'rgba(190,210,255,0.08)', rope: '#262b3b', flags: ['rgba(255,194,61,0.3)', 'rgba(255,150,80,0.28)', 'rgba(255,194,61,0.3)'], lamp: 'rgba(255,194,100,0.3)', kinds: [2, 0, 1, 3] },
];
/** pagoda silhouette: tiers of flared roofs (added to path); base centre (cx, y), width w, tier height th */
function pagoda(ctx, cx, y, w, tiers, th) {
  let yy = y, ww = w;
  ctx.rect(cx - ww * 0.5, yy, ww, th * 0.25); yy += th * 0.25;
  for (let k = 0; k < tiers; k++) {
    const bw = ww * 0.6, ry = yy + th * 0.62, rw = ww * 0.5, fl = th * 0.3;
    ctx.rect(cx - bw / 2, yy, bw, th * 0.7);
    poly(ctx, [cx - rw - fl, ry + fl * 0.55, cx - rw, ry, cx + rw, ry, cx + rw + fl, ry + fl * 0.55, cx + rw * 0.4, ry + th * 0.42, cx - rw * 0.4, ry + th * 0.42]);
    yy = ry + th * 0.38; ww *= 0.78;
  }
  ctx.rect(cx - 0.03 * w, yy, 0.06 * w, th * 0.9);
}
function torii(ctx, cx, y, w, h) {
  ctx.rect(cx - w * 0.38, y, w * 0.09, h); ctx.rect(cx + w * 0.29, y, w * 0.09, h);
  ctx.rect(cx - w * 0.46, y + h * 0.7, w * 0.92, h * 0.07);
  poly(ctx, [cx - w * 0.62, y + h * 1.06, cx - w * 0.5, y + h * 0.9, cx + w * 0.5, y + h * 0.9, cx + w * 0.62, y + h * 1.06, cx, y + h * 1.0]);
}
/** floating island: flat top at y, jagged rocky underside (added to path) */
function island(ctx, cx, y, w, i, seed) {
  const pts = [cx - w / 2 - 0.2, y + 0.12, cx + w / 2 + 0.2, y + 0.12];
  for (let j = 5; j >= 1; j--) { const f = j / 6; pts.push(cx - w / 2 + f * w + (hash01(i * 3 + j, seed + 1) - 0.5) * 0.3, y - Math.sin(f * Math.PI) * w * 0.5 * (0.65 + 0.55 * hash01(i * 3 + j, seed))); }
  poly(ctx, pts);
}
/** temple building of `kind` (0 pagoda, 1 torii, 2 ruined columns, 3 stupa shrine) standing at (cx, y) */
function templeProp(ctx, kind, cx, y, s, i) {
  if (kind === 0) pagoda(ctx, cx, y, 2.2 * s, 3 + ((hash01(i, 40) * 2) | 0), 0.95 * s);
  else if (kind === 1) torii(ctx, cx, y, 2.4 * s, 2.3 * s);
  else if (kind === 2) {
    for (let c = 0; c < 4; c++) { const hh = (1.2 + hash01(i, c + 41) * 1.6) * s; ctx.rect(cx - 1.5 * s + c * 0.95 * s, y, 0.3 * s, hh); ctx.rect(cx - 1.58 * s + c * 0.95 * s, y + hh - 0.02, 0.46 * s, 0.14 * s); }
    poly(ctx, [cx - 1.7 * s, y + 2.5 * s, cx + 0.2 * s, y + 2.8 * s, cx + 0.2 * s, y + 3.0 * s, cx - 1.7 * s, y + 2.7 * s]);
  } else {
    ctx.rect(cx - 1.2 * s, y, 2.4 * s, 0.35 * s); ctx.rect(cx - 0.8 * s, y + 0.35 * s, 1.6 * s, 0.9 * s);
    ctx.moveTo(cx + 0.85 * s, y + 1.25 * s); ctx.arc(cx, y + 1.25 * s, 0.85 * s, 0, Math.PI); ctx.closePath();
    ctx.rect(cx - 0.05 * s, y + 2.0 * s, 0.1 * s, 1.1 * s); ctx.rect(cx - 0.25 * s, y + 2.4 * s, 0.5 * s, 0.1 * s);
  }
}
const sky = {
  bg: '#2a2e3b', glow: [255, 225, 180, 0.09],
  sky(ctx, view, cam, v) {
    v = V(v); const P = SKYP[v], W = view.width, H = view.height;
    vGrad(ctx, view, [[0, P.top], [1, P.bot]]);
    if (v === 2) drawStars(ctx, view, cam, 110, 0.4, 0.8, 0.7);
    const sx = W * 0.7 - cam.x * 0.5, sy = H * (v === 1 ? 0.5 : 0.24) + cam.y * 0.5, R = Math.min(W, H) * (v === 1 ? 0.1 : 0.07);
    ctx.fillStyle = P.halo; ctx.beginPath(); ctx.arc(sx, sy, R * 2.2, 0, TAU); ctx.arc(sx, sy, R * 1.5, 0, TAU); ctx.fill();
    ctx.fillStyle = P.sun; ctx.beginPath(); ctx.arc(sx, sy, R, 0, TAU); ctx.fill();
  },
  layers: [
    { k: 0.08, tile: 14, col: '#3c4254', draw(ctx, x, i, L, v) {        // distant cloud bank + tiny floating islands
      v = V(v); const P = SKYP[v], t = clock();
      ctx.fillStyle = P.cloudFar; ctx.beginPath();
      ctx.rect(x - 0.03, -60, L.tile + 0.06, 58.6);
      for (let j = 0; j < 8; j++) circ(ctx, x + (j + 0.5) * (L.tile / 8), -1.6 + hash01(i, j) * 0.8, 1 + hash01(i, j + 8) * 1.4);
      ctx.fill();
      ctx.fillStyle = P.island; ctx.beginPath();
      for (let k = 0; k < 2; k++) {
        if (hash01(i, k + 20) < 0.35) continue;
        const cx = x + 2 + k * 6 + hash01(i, k + 22) * 4, y = 6 + hash01(i, k + 24) * 12 + Math.sin(t * 0.25 + i + k) * 0.3, w = 2.5 + hash01(i, k + 26) * 2.5;
        island(ctx, cx, y, w, i * 5 + k, 30); templeProp(ctx, (i + k) % 4, cx, y + 0.1, 0.45, i + k);
      }
      ctx.fill();
    } },
    { k: 0.22, tile: 11, col: '#30354a', draw(ctx, x, i, L, v) {        // floating islands carrying temples
      v = V(v); const P = SKYP[v], t = clock();
      const w = 4.2 + hash01(i, 2) * 2.5, cx = x + L.tile / 2 + (hash01(i, 3) - 0.5) * 3, y = 3 + hash01(i, 4) * 6 + Math.sin(t * 0.35 + i * 2.1) * 0.25;
      const kind = P.kinds[(hash01(i, 1) * 4) | 0];
      ctx.fillStyle = P.island; ctx.beginPath();
      island(ctx, cx, y, w, i, 5);
      for (let r = 0; r < 4; r++) { const rx = cx - w * 0.32 + r * w * 0.2, len = 0.6 + hash01(i, r + 20) * 1.8; ctx.rect(rx, y - w * 0.3 - len, 0.05, len + 0.3); }
      const rk = x + 1 + hash01(i, 9) * 2, ry = y - 3 - hash01(i, 10) * 2 + Math.sin(t * 0.5 + i) * 0.15;
      poly(ctx, [rk - 0.5, ry, rk + 0.5, ry, rk + 0.2, ry - 0.6]);
      ctx.fill();
      ctx.fillStyle = P.temple; ctx.beginPath(); templeProp(ctx, kind, cx + (hash01(i, 11) - 0.5) * w * 0.3, y + 0.1, 1, i); ctx.fill();
      ctx.strokeStyle = P.rim; ctx.lineWidth = 0.08; ctx.beginPath(); ctx.moveTo(cx - w / 2 - 0.2, y + 0.12); ctx.lineTo(cx + w / 2 + 0.2, y + 0.12); ctx.stroke();
      if (v === 0 && hash01(i, 12) > 0.4) { ctx.fillStyle = 'rgba(230,240,255,0.06)'; ctx.fillRect(cx + w / 2 - 0.5, y - 9, 0.35, 9.1); }
      if (v === 2) {
        ctx.fillStyle = P.lamp; ctx.beginPath();
        const lx = cx + (hash01(i, 11) - 0.5) * w * 0.3;
        if (kind === 0) for (let k = 0; k < 3; k++) ctx.rect(lx - 0.12, y + 0.55 + k * 0.72, 0.24, 0.22);
        else { ctx.rect(lx - 1.4, y + 0.1, 0.18, 0.28); ctx.rect(lx + 1.2, y + 0.1, 0.18, 0.28); }
        ctx.fill();
      }
    } },
    { k: 0.5, tile: 6.5, col: '#474c5d', draw(ctx, x, i, L, v) {        // cloud sea below the arena + prayer flags / lanterns
      v = V(v); const P = SKYP[v], t = clock();
      ctx.fillStyle = P.cloudNear; ctx.beginPath();
      ctx.rect(x - 0.03, -40, L.tile + 0.06, 39);
      for (let j = 0; j < 6; j++) {
        const r = 0.55 + hash01(i, j) * 0.7;
        circ(ctx, x + ((j + 0.5) * L.tile) / 6 + Math.sin(t * 0.3 + j + i) * 0.15, -1.1 + r * 0.4 + Math.sin(t * 0.4 + j * 1.3 + i) * 0.05, r);
      }
      ctx.fill();
      const y0 = 8.2, sag = 0.7;
      ctx.strokeStyle = P.rope; ctx.lineWidth = 0.04; ctx.beginPath(); ctx.moveTo(x, y0); ctx.quadraticCurveTo(x + L.tile / 2, y0 - 2 * sag, x + L.tile, y0); ctx.stroke();
      for (let c = 0; c < 3; c++) {
        ctx.fillStyle = v === 2 ? P.lamp : P.flags[c]; ctx.beginPath();
        for (let j = 1; j < 8; j++) {
          if ((j + i) % 3 !== c) continue;
          const f = j / 8, px = x + f * L.tile, py = y0 - 4 * sag * f * (1 - f);
          if (v === 2) { if (j % 2) ctx.rect(px - 0.13, py - 0.5, 0.26, 0.36); }
          else { const fl = Math.sin(t * 2.2 + j + i) * 0.1; poly(ctx, [px - 0.2, py, px + 0.2, py, px + fl, py - 0.5]); }
        }
        ctx.fill();
      }
    } },
  ],
};

// ======================================================================================= NEON ARCADE CITY (act 9)
const NEO = [
  // 0 purple night: magenta / cyan / cheese signs, arcade cabinet row
  { top: '#0f0d19', bot: '#231a31', far: '#1b1827', mid: '#201b2c', near: '#17141f', ground: '#141119', neon: ['255,70,200', '70,220,255', '255,194,61'], win: 'rgba(255,120,220,0.09)' },
  // 1 teal rain: cyan / lime / pink, rain streaks, puddle reflections
  { top: '#0c141f', bot: '#172835', far: '#16212e', mid: '#1a2633', near: '#121b24', ground: '#10171e', neon: ['70,230,220', '150,255,120', '255,90,160'], win: 'rgba(120,230,230,0.08)' },
  // 2 red downtown smog: red / yellow / pink, vending + claw machines
  { top: '#160d12', bot: '#2e1a20', far: '#23171f', mid: '#291b23', near: '#1c1318', ground: '#170f13', neon: ['255,80,60', '255,194,61', '255,120,200'], win: 'rgba(255,150,90,0.08)' },
];
const WORDS = ['PIZZA', 'ARCADE', '24H', 'HI-SCORE', 'OPEN', 'SLICE', 'GAME ON', 'PLAY'];
/** 0..1 brightness of a neon sign: steady, with short glitchy flicker bursts */
function neonOn(t, id) {
  if (hash01(id + Math.floor(t * 0.6), 9) < 0.82) return 1;
  return hash01(Math.floor(t * 14), id + 3) > 0.45 ? 1 : 0.25;
}
function worldText(ctx, str, x, y, size, stroke) {
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 20, -size / 20);
  ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (stroke) { ctx.lineWidth = 7; ctx.strokeText(str, 0, 0); }
  ctx.fillText(str, 0, 0); ctx.restore();
}
const neon = {
  bg: '#16141d', glow: [210, 80, 255, 0.09],
  sky(ctx, view, cam, v) {
    v = V(v);
    vGrad(ctx, view, [[0, NEO[v].top], [1, NEO[v].bot]]);
    if (v === 0) drawStars(ctx, view, cam, 40, 0.25, 0.6, 0.4);
    if (v === 1) drawRain(ctx, view, 90, 'rgba(160,210,255,0.09)', 0.18, 700);
  },
  layers: [
    { k: 0.12, tile: 3.2, col: '#1b1827', draw(ctx, x, i, L, v) {       // skyscraper wall with lit floors + blinking beacons
      v = V(v); const P = NEO[v], t = clock();
      const w = 1.6 + hash01(i, 1) * 1.3, h = 4 + hash01(i, 2) * 13, ox = x + hash01(i, 3) * (L.tile - w), ant = hash01(i, 4) > 0.55;
      ctx.fillStyle = P.far; ctx.beginPath();
      ctx.rect(ox, -40, w, h + 40); if (hash01(i, 5) > 0.5) ctx.rect(ox + 0.25, h, w - 0.5, 0.9);
      if (ant) ctx.rect(ox + w / 2 - 0.05, h, 0.1, 2.6);
      ctx.fill();
      ctx.fillStyle = P.win; ctx.beginPath();
      for (let r = 0; r < 18; r++) { const wy = h - 0.6 - r * 0.62; if (wy < -8) break; if (hash01(i * 13 + r, 6) > 0.62) ctx.rect(ox + 0.15, wy, w - 0.3, 0.16); }
      ctx.fill();
      if (ant && Math.sin(t * 2.2 + i * 1.7) > 0.4) { ctx.fillStyle = 'rgba(255,70,60,0.5)'; ctx.fillRect(ox + w / 2 - 0.12, h + 2.55, 0.24, 0.24); }
    } },
    { k: 0.3, tile: 9, col: '#201b2c', draw(ctx, x, i, L, v) {          // mid-rises with flickering neon signs
      v = V(v); const P = NEO[v], t = clock();
      const bw = 4 + hash01(i, 1) * 2.5, bh = 5 + hash01(i, 2) * 6, bx = x + 0.5 + hash01(i, 3) * (L.tile - bw - 1);
      ctx.fillStyle = P.mid; ctx.beginPath();
      ctx.rect(bx, -30, bw, bh + 30); ctx.rect(bx + 0.5, bh, 1.1, 0.7); ctx.rect(bx + bw - 1.3, bh, 0.5, 1.3);
      ctx.rect(bx + bw + 0.3, -30, L.tile - bw - 0.6, 3.5 + hash01(i, 8) * 3 + 30);
      ctx.fill();
      ctx.fillStyle = P.win; ctx.beginPath();
      for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) if (hash01(i * 7 + r, c + 20) > 0.72) ctx.rect(bx + 0.4 + (c * (bw - 0.8)) / 4, bh - 3.2 - r * 1.0, 0.5, 0.45);
      ctx.fill();
      const kind = (hash01(i, 4) * 5) | 0, rgb = P.neon[(hash01(i, 5) * 3) | 0], a = 0.6 * neonOn(t, i * 31 + v);
      const sx = bx + bw / 2, sy = bh - 1.6;
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath();
      if (kind === 0 || kind === 2) ctx.roundRect(sx - 1.7, sy - 0.55, 3.4, 1.1, 0.25);
      else if (kind === 1) {            // pizza slice
        ctx.moveTo(sx - 0.9, sy + 0.6); ctx.lineTo(sx, sy - 1.0); ctx.lineTo(sx + 0.9, sy + 0.6); ctx.quadraticCurveTo(sx, sy + 0.95, sx - 0.9, sy + 0.6);
        circ(ctx, sx - 0.25, sy + 0.2, 0.15); circ(ctx, sx + 0.25, sy + 0.15, 0.13); circ(ctx, sx, sy - 0.35, 0.12);
      } else if (kind === 3) {          // arrow
        poly(ctx, [sx - 1.6, sy - 0.25, sx + 0.6, sy - 0.25, sx + 0.6, sy - 0.6, sx + 1.5, sy, sx + 0.6, sy + 0.6, sx + 0.6, sy + 0.25, sx - 1.6, sy + 0.25]);
      } else {                          // game controller
        ctx.roundRect(sx - 1.2, sy - 0.5, 2.4, 1.0, 0.45); circ(ctx, sx + 0.55, sy + 0.1, 0.13); circ(ctx, sx + 0.8, sy - 0.15, 0.13);
        ctx.moveTo(sx - 0.8, sy); ctx.lineTo(sx - 0.35, sy); ctx.moveTo(sx - 0.575, sy - 0.22); ctx.lineTo(sx - 0.575, sy + 0.22);
      }
      ctx.strokeStyle = `rgba(${rgb},${(a * 0.2).toFixed(3)})`; ctx.lineWidth = 0.34; ctx.stroke();
      ctx.strokeStyle = `rgba(${rgb},${a.toFixed(3)})`; ctx.lineWidth = 0.08; ctx.stroke();
      if (kind === 0 || kind === 2) {
        ctx.fillStyle = `rgba(${rgb},${(a * 0.85).toFixed(3)})`; ctx.strokeStyle = `rgba(${rgb},${(a * 0.18).toFixed(3)})`;
        worldText(ctx, WORDS[(hash01(i, 6) * WORDS.length) | 0], sx, sy - 0.02, 0.62, true);
      }
      if (kind === 3) {                 // chasing bulbs on the arrow
        ctx.fillStyle = `rgba(255,220,150,${(a * 0.7).toFixed(3)})`; ctx.beginPath();
        const ph = Math.floor(t * 6);
        for (let b = 0; b < 6; b++) if ((b + ph) % 3 === 0) circ(ctx, sx - 1.4 + b * 0.36, sy, 0.06);
        ctx.fill();
      }
      if (hash01(i, 7) > 0.45) {        // vertical blade sign on the side street building
        const vx = bx + bw + 0.9, vy = 1.2 + hash01(i, 8) * 2, rgb2 = P.neon[(((hash01(i, 5) * 3) | 0) + 1) % 3], a2 = 0.5 * neonOn(t, i * 17 + 5);
        ctx.fillStyle = P.near; ctx.fillRect(vx - 0.35, vy - 2.3, 0.7, 2.6);
        ctx.strokeStyle = `rgba(${rgb2},${a2.toFixed(3)})`; ctx.lineWidth = 0.06; ctx.strokeRect(vx - 0.3, vy - 2.25, 0.6, 2.5);
        ctx.fillStyle = `rgba(${rgb2},${(a2 * 0.9).toFixed(3)})`;
        const word = (i & 1) ? 'BAR' : 'FUN';
        for (let c = 0; c < 3; c++) worldText(ctx, word[c], vx, vy - 0.25 - c * 0.78, 0.55, false);
      }
    } },
    { k: 0.55, tile: 5.5, col: '#17141f', draw(ctx, x, i, L, v) {       // street level: arcade cabinets / vending + claw machines
      v = V(v); const P = NEO[v], t = clock();
      ctx.fillStyle = P.ground; ctx.fillRect(x - 0.02, -30, L.tile + 0.04, 29.7);
      const chase = ((i + Math.floor(t * 4)) & 3) === 0;
      ctx.fillStyle = `rgba(${P.neon[1]},${chase ? 0.3 : 0.14})`; ctx.fillRect(x - 0.02, -0.34, L.tile + 0.04, 0.05);
      const n = 3;
      for (let j = 0; j < n; j++) {
        const cx = x + 0.9 + j * 1.75, rgb = P.neon[(i + j) % 3], machine = v === 2 ? (hash01(i, j) > 0.5 ? 2 : 1) : (hash01(i, j + 9) > 0.85 ? 1 : 0);
        ctx.fillStyle = P.near; ctx.beginPath();
        if (machine === 0) {            // arcade cabinet
          ctx.rect(cx - 0.45, -0.3, 0.9, 1.35); ctx.rect(cx - 0.55, 0.95, 1.1, 0.18); ctx.rect(cx - 0.45, 1.13, 0.9, 1.0); ctx.rect(cx - 0.5, 2.13, 1.0, 0.36);
        } else if (machine === 1) {     // vending machine
          ctx.rect(cx - 0.6, -0.3, 1.2, 2.6);
        } else {                        // claw machine
          ctx.rect(cx - 0.6, -0.3, 1.2, 1.0); ctx.rect(cx - 0.6, 0.7, 0.08, 1.4); ctx.rect(cx + 0.52, 0.7, 0.08, 1.4); ctx.rect(cx - 0.65, 2.1, 1.3, 0.35);
        }
        ctx.fill();
        const flick = neonOn(t, i * 7 + j * 13 + 2);
        ctx.fillStyle = `rgba(${rgb},${(0.2 * flick).toFixed(3)})`; ctx.beginPath();
        if (machine === 0) { ctx.rect(cx - 0.32, 1.25, 0.64, 0.75); ctx.rect(cx - 0.42, 2.2, 0.84, 0.22); }
        else if (machine === 1) { for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) ctx.rect(cx - 0.45 + c * 0.3, 0.55 + r * 0.38, 0.22, 0.26); }
        else { ctx.rect(cx - 0.52, 0.72, 1.04, 1.38); ctx.rect(cx - 0.55, 2.15, 1.1, 0.25); }
        ctx.fill();
        ctx.fillStyle = `rgba(${rgb},${(0.12 * flick).toFixed(3)})`; ctx.beginPath();
        if (machine === 0) ctx.rect(cx - 0.32, 1.25 + ((t * 0.6 + j * 0.37 + i * 0.21) % 1) * 0.68, 0.64, 0.07);
        else if (machine === 2) { const clx = cx + Math.sin(t * 0.7 + i + j) * 0.3; ctx.rect(clx - 0.02, 1.5, 0.04, 0.6); poly(ctx, [clx - 0.15, 1.35, clx + 0.15, 1.35, clx + 0.05, 1.5, clx - 0.05, 1.5]); }
        if (v === 1) { const wob = Math.sin(t * 1.5 + j + i) * 0.08; ctx.rect(cx - 0.3 - wob, -0.7, 0.6 + wob * 2, 0.05); ctx.rect(cx - 0.2 + wob, -1.0, 0.4 - wob * 2, 0.04); }
        ctx.fill();
      }
    } },
  ],
};

// ======================================================================================= SPACE STATION (act 10)
const SPC = [
  // 0 teal planet: bulkhead with big viewports, rotating habitat ring
  { planet: '#1f3340', lit: '#2b4a58', shade: '#172430', band: 'rgba(160,220,230,0.06)', ring: null, far: '#1d2130', mid: '#20242f', near: '#1a1d26', panel: '#161921', light: 'rgba(120,220,255,0.28)', solar: '#1f2940' },
  // 1 ringed gas giant: warm bands, solar arrays, hazard stripes
  { planet: '#3a2b27', lit: '#4f3930', shade: '#2a1f1d', band: 'rgba(255,190,130,0.07)', ring: 'rgba(210,170,130,0.16)', far: '#211f28', mid: '#24222b', near: '#1c1a22', panel: '#17161c', light: 'rgba(255,194,61,0.3)', solar: '#2a2a3a' },
  // 2 nebula: violet haze, small moon, open exterior trusses
  { planet: '#2a2638', lit: '#3a3450', shade: '#1d1a28', band: 'rgba(200,170,255,0.05)', ring: null, far: '#1e1c2b', mid: '#22202f', near: '#1a1824', panel: '#15141d', light: 'rgba(200,140,255,0.3)', solar: '#262640' },
];
/** planet disc with a terminator shadow and bands, clipped (screen px) */
function drawPlanet(ctx, x, y, r, P, bands = 5) {
  if (P.ring) { ctx.strokeStyle = P.ring; ctx.lineWidth = r * 0.07; ctx.beginPath(); ctx.ellipse(x, y, r * 1.75, r * 0.38, -0.25, Math.PI, TAU); ctx.stroke(); }
  ctx.fillStyle = P.lit; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.save(); ctx.clip();
  ctx.fillStyle = P.band; ctx.beginPath();
  for (let b = 0; b < bands; b++) ctx.rect(x - r, y - r + (b + 0.3) * ((2 * r) / bands), 2 * r, r * (0.08 + 0.1 * hash01(b, 110)));
  ctx.fill();
  ctx.fillStyle = P.shade; ctx.beginPath(); ctx.arc(x + r * 0.45, y + r * 0.3, r * 1.05, 0, TAU); ctx.fill();
  ctx.restore();
  if (P.ring) { ctx.strokeStyle = P.ring; ctx.lineWidth = r * 0.07; ctx.beginPath(); ctx.ellipse(x, y, r * 1.75, r * 0.38, -0.25, 0, Math.PI); ctx.stroke(); }
}
const space = {
  bg: '#101219', glow: [110, 150, 255, 0.08],
  sky(ctx, view, cam, v) {
    v = V(v); const P = SPC[v], W = view.width, H = view.height;
    if (v === 2) {
      const nx = W * 0.35 - cam.x * 0.4, ny = H * 0.3, g = ctx.createRadialGradient(nx, ny, 0, nx, ny, Math.max(W, H) * 0.55);
      g.addColorStop(0, 'rgba(120,70,170,0.22)'); g.addColorStop(0.5, 'rgba(70,50,130,0.1)'); g.addColorStop(1, 'rgba(20,20,40,0)');
      ctx.fillStyle = g; ctx.fillRect(-64, -64, W + 128, H + 128);
    }
    drawStars(ctx, view, cam, 170, 0.55, 0.8, 1);
    const R = Math.min(W, H) * (v === 1 ? 0.2 : v === 2 ? 0.07 : 0.26);
    drawPlanet(ctx, W * (v === 2 ? 0.78 : 0.72) - cam.x * 0.8, H * (v === 2 ? 0.22 : 0.34) + cam.y * 0.6, R, P, v === 2 ? 2 : 6);
  },
  layers: [
    { k: 0.1, tile: 16, col: '#1d2130', draw(ctx, x, i, L, v) {       // distant rotating habitat ring / docking spire
      v = V(v); const P = SPC[v], t = clock();
      if (hash01(i, 1) < 0.4) return;
      const cx = x + 8, cy = 12 + hash01(i, 2) * 6, R = 4.5 + hash01(i, 3) * 1.5, ry = R * 0.32, rot = t * 0.12 + i;
      if (hash01(i, 4) > 0.5 || v === 2) {
        ctx.strokeStyle = P.far; ctx.lineWidth = 0.55; ctx.beginPath(); ctx.ellipse(cx, cy, R, ry, 0, 0, TAU);
        for (let s = 0; s < 6; s++) { const a = rot + (s * TAU) / 6; ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * ry); }
        ctx.moveTo(cx, cy + 2.5); ctx.lineTo(cx, cy - 2.5);
        ctx.stroke();
        ctx.fillStyle = P.far; ctx.beginPath(); ctx.ellipse(cx, cy, 0.8, 0.5, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = P.light; ctx.beginPath();
        for (let s = 0; s < 12; s++) { const a = rot * 1 + (s * TAU) / 12; if (Math.sin(a) < 0) circ(ctx, cx + Math.cos(a) * R, cy + Math.sin(a) * ry, 0.1); }
        ctx.fill();
      } else {
        ctx.fillStyle = P.far; ctx.beginPath();
        ctx.rect(cx - 0.25, cy - 8, 0.5, 14); ctx.rect(cx - 1.4, cy + 3, 2.8, 1.1); ctx.rect(cx - 2.5, cy - 1, 5, 0.3); ctx.rect(cx - 0.9, cy - 5, 1.8, 2);
        ctx.fill();
        if (Math.sin(t * 2 + i) > 0.6) { ctx.fillStyle = 'rgba(255,90,70,0.5)'; ctx.fillRect(cx - 0.15, cy + 6, 0.3, 0.3); }
      }
    } },
    { k: 0.3, tile: 8, col: '#20242f', draw(ctx, x, i, L, v) {          // station truss with modules, solar arrays, beacons
      v = V(v); const P = SPC[v], t = clock(), ty = 7.5 + (v === 2 ? -3 : 0);
      ctx.fillStyle = P.mid; ctx.beginPath();
      ctx.rect(x - 0.02, ty, L.tile + 0.04, 0.12); ctx.rect(x - 0.02, ty + 0.9, L.tile + 0.04, 0.12);
      ctx.fill();
      ctx.strokeStyle = P.mid; ctx.lineWidth = 0.08; ctx.beginPath();
      for (let s = 0; s < 8; s++) { ctx.moveTo(x + s, ty + 0.06); ctx.lineTo(x + s + 0.5, ty + 0.96); ctx.lineTo(x + s + 1, ty + 0.06); }
      ctx.stroke();
      const kind = (hash01(i, 1) * 3) | 0, mx = x + 1.5 + hash01(i, 2) * 3;
      ctx.fillStyle = P.mid; ctx.beginPath();
      if (kind === 0) { ctx.roundRect(mx, ty - 2.2, 3.6, 1.6, 0.7); ctx.rect(mx + 1.6, ty - 0.6, 0.4, 0.6); ctx.rect(mx - 0.4, ty - 1.7, 0.4, 0.6); }
      else if (kind === 1) { ctx.rect(mx + 1.5, ty + 1, 0.15, 2.4); ctx.rect(mx + 1.5, ty - 2, 0.15, 2); }
      else { ctx.roundRect(mx, ty + 1.2, 2.4, 1.3, 0.6); ctx.rect(mx + 1.0, ty + 1.0, 0.4, 0.3); ctx.rect(mx + 2.4, ty + 1.65, 0.8, 0.4); }
      ctx.fill();
      if (kind === 1) {
        ctx.fillStyle = P.solar; ctx.beginPath();
        for (const oy of [ty + 3.4, ty - 2.8]) for (let c = 0; c < 4; c++) ctx.rect(mx + c * 0.82, oy, 0.76, 1.2);
        ctx.fill();
        ctx.fillStyle = 'rgba(150,180,255,0.05)'; ctx.beginPath(); for (let c = 0; c < 4; c++) { ctx.rect(mx + c * 0.82, ty + 3.9, 0.76, 0.04); ctx.rect(mx + c * 0.82, ty - 2.3, 0.76, 0.04); } ctx.fill();
      } else {
        ctx.fillStyle = P.light; ctx.beginPath();
        const wy = kind === 0 ? ty - 1.5 : ty + 1.75;
        for (let w = 0; w < 4; w++) if (hash01(i * 3 + w, 5) > 0.3) ctx.rect(mx + 0.55 + w * 0.6, wy, 0.22, 0.18);
        ctx.fill();
      }
      if (Math.sin(t * 2.6 + i * 2) > 0.7) { ctx.fillStyle = (i & 1) ? 'rgba(95,191,106,0.6)' : 'rgba(216,67,47,0.6)'; ctx.fillRect(x + 0.1, ty + 1.02, 0.18, 0.18); }
    } },
    { k: 0.55, tile: 6, col: '#1a1d26', draw(ctx, x, i, L, v) {         // bulkhead with viewports (0/1) or open catwalk exterior (2)
      v = V(v); const P = SPC[v], t = clock();
      if (v !== 2) {
        ctx.fillStyle = P.near; ctx.beginPath();
        ctx.rect(x - 0.02, -30, L.tile + 0.04, 31.2);   // lower wall to y = 1.2
        ctx.rect(x - 0.02, 9.6, L.tile + 0.04, 30);     // ceiling
        ctx.rect(x - 0.3, 1.2, 0.6, 8.4);               // window strut
        poly(ctx, [x + 0.3, 1.2, x + 1.2, 1.2, x + 0.3, 2.1]); poly(ctx, [x - 0.3, 1.2, x - 1.2, 1.2, x - 0.3, 2.1]);
        poly(ctx, [x + 0.3, 9.6, x + 0.3, 8.7, x + 1.2, 9.6]); poly(ctx, [x - 0.3, 9.6, x - 1.2, 9.6, x - 0.3, 8.7]);
        ctx.fill();
        ctx.fillStyle = P.panel; ctx.beginPath();
        ctx.rect(x + 0.5, -0.1, L.tile - 1, 0.06); ctx.rect(x + L.tile / 2 - 0.03, -3, 0.06, 4.1); ctx.rect(x + 0.5, 10.2, L.tile - 1, 0.06);
        ctx.fill();
        if (v === 1) { ctx.fillStyle = 'rgba(255,194,61,0.12)'; ctx.beginPath(); for (let s = 0; s < 12; s++) poly(ctx, [x + s * 0.5, 9.6, x + s * 0.5 + 0.25, 9.6, x + s * 0.5 + 0.5, 9.9, x + s * 0.5 + 0.25, 9.9]); ctx.fill(); }
        ctx.fillStyle = P.light; ctx.beginPath();
        for (let b = 0; b < 5; b++) if (Math.sin(t * (1.5 + b * 0.7) + i * 3 + b) > 0.2) ctx.rect(x + 1 + b * 0.35, 0.6, 0.16, 0.12);
        ctx.rect(x - 0.08, 9.3, 0.16, 0.1);
        ctx.fill();
      } else {
        ctx.fillStyle = P.near; ctx.beginPath();
        ctx.rect(x - 0.02, -30, L.tile + 0.04, 29.4);
        ctx.rect(x - 0.02, 0.8, L.tile + 0.04, 0.1); ctx.rect(x - 0.02, 0.2, L.tile + 0.04, 0.06);
        for (let p = 0; p < 4; p++) ctx.rect(x + p * 1.5, -0.6, 0.08, 1.5);
        ctx.rect(x + 2.9, -0.6, 0.35, 11); ctx.rect(x + 2.3, 9.2, 1.55, 0.35);
        ctx.fill();
        ctx.strokeStyle = P.near; ctx.lineWidth = 0.08; ctx.beginPath();
        ctx.moveTo(x + 3.07, 8.8); ctx.lineTo(x + 5.5, 4.5); ctx.moveTo(x + 3.07, 8.8); ctx.lineTo(x + 0.6, 4.5);
        ctx.stroke();
        if (Math.sin(t * 3 + i) > 0.5) { ctx.fillStyle = P.light; ctx.fillRect(x + 2.95, 9.55, 0.25, 0.2); }
      }
    } },
  ],
};

// ================================================================================ BOSS ARENAS (x0 levels of acts 5–10)
/** gothic pointed arch (added to path) */
function gothic(ctx, x0, x1, y0, y1) {
  const w = x1 - x0, cx = (x0 + x1) / 2;
  ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y1);
  ctx.quadraticCurveTo(x1, y1 + w * 0.7, cx, y1 + w * 1.05); ctx.quadraticCurveTo(x0, y1 + w * 0.7, x0, y1); ctx.closePath();
}

// ---- boss_freezer: the Ice Cathedral — lancet + rose windows, crystal pillars, icicle chandeliers, frozen banners
const boss_freezer = {
  bg: '#19202e', glow: [150, 200, 255, 0.13],
  sky(ctx, view, cam) {
    const t = clock(), W = view.width, H = view.height;
    vGrad(ctx, view, [[0, '#0f1625'], [0.6, '#192435'], [1, '#233143']]);
  },
  layers: [
    { k: 0.16, tile: 10, col: '#1b2332', draw(ctx, x, i, L) {           // nave wall: lancet windows + rose window
      const t = clock(), shim = 0.085 + 0.02 * Math.sin(t * 0.5 + i * 1.3);
      ctx.fillStyle = '#1b2332'; ctx.fillRect(x - 0.03, -30, L.tile + 0.06, 70);
      ctx.fillStyle = `rgba(140,195,245,${shim.toFixed(3)})`; ctx.beginPath();
      gothic(ctx, x + 1.3, x + 3.1, 0.5, 8.5); gothic(ctx, x + 6.9, x + 8.7, 0.5, 8.5);
      circ(ctx, x + 5, 13.2, 2.3);
      ctx.fill();
      ctx.fillStyle = '#1b2332'; ctx.beginPath();
      for (const wx of [2.2, 7.8]) { ctx.rect(x + wx - 0.06, 0.5, 0.12, 9.6); for (let b = 1; b < 6; b++) ctx.rect(x + wx - 0.9, 0.5 + b * 1.45, 1.8, 0.1); }
      ctx.fill();
      ctx.strokeStyle = '#1b2332'; ctx.lineWidth = 0.16; ctx.beginPath();
      ctx.moveTo(x + 5 + 1.4, 13.2); ctx.arc(x + 5, 13.2, 1.4, 0, TAU); ctx.moveTo(x + 5.55, 13.2); ctx.arc(x + 5, 13.2, 0.55, 0, TAU);
      for (let s = 0; s < 8; s++) { const a = (s * TAU) / 8 + t * 0.02; ctx.moveTo(x + 5 + Math.cos(a) * 0.55, 13.2 + Math.sin(a) * 0.55); ctx.lineTo(x + 5 + Math.cos(a) * 2.3, 13.2 + Math.sin(a) * 2.3); }
      ctx.stroke();
      ctx.fillStyle = '#212a3b'; ctx.beginPath();
      ctx.rect(x - 0.45, -30, 0.9, 50); ctx.rect(x - 0.7, 9.8, 1.4, 0.35); ctx.rect(x - 0.7, 16.5, 1.4, 0.35);
      ctx.fill();
      ctx.fillStyle = 'rgba(170,215,255,0.025)'; ctx.beginPath();    // light shafts through the lancets
      for (const wx of [2.2, 7.8]) poly(ctx, [x + wx - 0.9, 9, x + wx + 0.9, 9, x + wx + 3.9, -2, x + wx + 1.6, -2]);
      ctx.fill();
    } },
    { k: 0.38, tile: 6.5, col: '#222c3c', draw(ctx, x, i, L) {          // crystal pillars, icicle chandeliers, ice organ pipes
      const t = clock(), even = (i & 1) === 0;
      ctx.fillStyle = '#1a2230'; ctx.fillRect(x - 0.02, -30, L.tile + 0.04, 29.8);
      const sw = Math.sin(t * 0.4 + i) * 0.025, cx = x + 3.8 + Math.sin(sw) * 5.5, cy = 13 - Math.cos(sw) * 5.5;
      ctx.fillStyle = '#232d3e'; ctx.beginPath();
      ctx.rect(x + 0.2, -0.2, 0.9, 11); ctx.rect(x - 0.05, -0.2, 1.4, 0.5); ctx.rect(x - 0.05, 10.5, 1.4, 0.45);
      poly(ctx, [x - 0.1, 10.95, x + 1.4, 10.95, x + 1.05, 12.1, x + 0.65, 12.9, x + 0.25, 12.1]);
      if (even) {
        poly(ctx, [x + 3.77, 13, x + 3.83, 13, cx + 0.03, cy, cx - 0.03, cy]);
        ctx.ellipse(cx, cy, 1.7, 0.28, 0, 0, TAU);
        for (let j = 0; j < 7; j++) { const ix = cx - 1.5 + j * 0.5, il = 0.45 + (3 - Math.abs(j - 3)) * 0.35 + hash01(i, j) * 0.3; poly(ctx, [ix - 0.1, cy, ix, cy - il, ix + 0.1, cy]); }
      } else {
        for (let p = 0; p < 7; p++) { const ph = 1.8 + (3 - Math.abs(p - 3)) * 0.95; ctx.rect(x + 2.1 + p * 0.56, 0.3, 0.42, ph); poly(ctx, [x + 2.1 + p * 0.56, ph + 0.3, x + 2.52 + p * 0.56, ph + 0.3, x + 2.31 + p * 0.56, ph + 0.62]); }
        ctx.rect(x + 1.9, -0.2, 4.3, 0.5);
      }
      ctx.fill();
      ctx.fillStyle = 'rgba(190,230,255,0.1)'; ctx.beginPath();
      ctx.rect(x + 0.2, -0.2, 0.14, 11);
      if (even) for (let j = 0; j < 7; j++) { const ix = cx - 1.5 + j * 0.5, il = 0.45 + (3 - Math.abs(j - 3)) * 0.35 + hash01(i, j) * 0.3; poly(ctx, [ix, cy, ix, cy - il, ix + 0.1, cy]); }
      else for (let p = 0; p < 7; p++) ctx.rect(x + 2.1 + p * 0.56, 0.3, 0.1, 1.8 + (3 - Math.abs(p - 3)) * 0.95);
      ctx.fill();
      if (even) {
        ctx.fillStyle = 'rgba(200,235,255,0.05)'; ctx.beginPath(); ctx.arc(cx, cy - 0.3, 1.9, 0, TAU); ctx.fill();
        ctx.fillStyle = 'rgba(220,242,255,0.3)'; ctx.beginPath();
        for (let j = 0; j < 5; j++) if (Math.sin(t * 1.3 + j * 2 + i) > -0.5) ctx.rect(cx - 1.2 + j * 0.6 - 0.05, cy + 0.2, 0.1, 0.18);
        ctx.fill();
      }
    } },
    { k: 0.6, tile: 9, col: '#1a202c', draw(ctx, x, i, L) {             // frozen banners above, snow drifts below
      const t = clock();
      ctx.fillStyle = '#1c2330'; ctx.beginPath();
      ctx.rect(x - 0.02, -30, L.tile + 0.04, 29.3);
      for (let j = 0; j < 7; j++) circ(ctx, x + (j + 0.5) * (L.tile / 7), -0.75, 0.5 + hash01(i, j) * 0.5);
      ctx.fill();
      const bx = x + 3 + hash01(i, 3) * 3, flap = Math.sin(t * 0.6 + i) * 0.05;
      ctx.fillStyle = '#26304a'; ctx.beginPath();
      ctx.rect(bx - 1.1, 10.6, 2.2, 0.14);
      poly(ctx, [bx - 0.8, 10.6, bx + 0.8, 10.6, bx + 0.8 + flap, 7.4, bx + flap, 7.9, bx - 0.8 + flap, 7.4]);
      ctx.fill();
      ctx.strokeStyle = 'rgba(200,230,255,0.16)'; ctx.lineWidth = 0.06; ctx.beginPath();
      const ex = bx + flap * 0.5, ey = 9.3;
      for (let s = 0; s < 3; s++) { const a = (s * Math.PI) / 3; ctx.moveTo(ex - Math.cos(a) * 0.45, ey - Math.sin(a) * 0.45); ctx.lineTo(ex + Math.cos(a) * 0.45, ey + Math.sin(a) * 0.45); }
      ctx.stroke();
      ctx.fillStyle = 'rgba(200,230,255,0.22)'; ctx.beginPath();
      for (let j = 0; j < 4; j++) { const ix = bx - 0.7 + j * 0.46 + flap; poly(ctx, [ix - 0.05, 7.6 + (j % 3 === 0 ? -0.2 : 0.2), ix + 0.05, 7.6 + (j % 3 === 0 ? -0.2 : 0.2), ix, 7.2 + (j % 3 === 0 ? -0.2 : 0.2) - hash01(i, j + 9) * 0.3]); }
      ctx.fill();
    } },
  ],
};

// ---- boss_docks: Storm Harbour — lightning, rain, heaving swells, a listing wreck and giant tentacles
/** giant tentacle rising from (bx, by), swaying (added to path) */
function tentacle(ctx, bx, by, len, wid, ph, t) {
  const L = [], R = []; let x = bx, y = by, a = 0;
  for (let k = 0; k <= 12; k++) {
    const s = k / 12, w = wid * (1 - s * 0.92);
    a = Math.sin(t * 0.7 + ph + s * 2.6) * 0.55 * s + (s > 0.8 ? (s - 0.8) * 4 * Math.sin(ph) : 0);
    const nx = Math.cos(a), ny = -Math.sin(a);
    L.push(x - nx * w, y - ny * w); R.push(x + nx * w, y + ny * w);
    x += Math.sin(a) * (len / 12); y += Math.cos(a) * (len / 12);
  }
  const pts = L;
  for (let k = R.length - 2; k >= 0; k -= 2) pts.push(R[k], R[k + 1]);
  poly(ctx, pts);
}
const boss_docks = {
  bg: '#151a1f', glow: [140, 180, 200, 0.07],
  sky(ctx, view, cam) {
    const t = clock(), W = view.width, H = view.height, hy = layerSY(view, cam, 0.1, 0);
    vGrad(ctx, view, [[0, '#0c1115'], [0.6, '#172024'], [1, '#243034']], 0, hy);
    drawLightning(ctx, view, 6.3, 120, '200,225,255');
    ctx.fillStyle = '#0e1317'; ctx.beginPath();
    for (let j = 0; j < 14; j++) { const r = 50 + hash01(j, 121) * 60, cx = ((((j / 14) * (W + 300) + t * 8 - cam.x * 2) % (W + 300)) + W + 300) % (W + 300) - 150; circ(ctx, cx, H * 0.02 + hash01(j, 122) * 40, r); }
    ctx.rect(-64, -64, W + 128, 70);
    ctx.fill();
    ctx.fillStyle = '#151c21'; ctx.fillRect(-64, hy, W + 128, H - hy + 64);
    ctx.fillStyle = 'rgba(8,12,15,0.4)'; ctx.beginPath();
    for (let j = 1; j < 11; j++) ctx.rect(-64, hy + j * j * 5 + Math.sin(t + j) * 2, W + 128, 1.5 + j * 0.6);
    ctx.fill();
    ctx.fillStyle = 'rgba(210,230,240,0.07)'; ctx.beginPath();
    for (let j = 0; j < 26; j++) { const d = hash01(j, 123), yy = hy + 4 + d * d * Math.max(0, H - hy), xx = ((((hash01(j, 124) * (W + 100) - t * 30 * (0.5 + d)) % (W + 100)) + W + 100) % (W + 100)) - 50; ctx.rect(xx, yy, 10 + 30 * d, 1.5 + d * 2); }
    ctx.fill();
    drawRain(ctx, view, 110, 'rgba(170,200,220,0.1)', -0.35, 900);
  },
  layers: [
    { k: 0.1, tile: 13, col: '#1a2227', draw(ctx, x, i, L) {             // heaving swells + storm lighthouse
      const t = clock();
      ctx.fillStyle = '#1a2227'; ctx.beginPath();
      ctx.moveTo(x - 0.03, -4);
      ctx.lineTo(x + L.tile + 0.03, -4);
      for (let j = 13; j >= 0; j--) { const wx = x + (j * L.tile) / 13; ctx.lineTo(wx, 0.2 + Math.sin(wx * 0.9 + t * 1.2) * 0.35 + Math.sin(wx * 2.3 - t * 0.8) * 0.12); }
      ctx.closePath(); ctx.fill();
      if (hash01(i, 1) > 0.5) {
        const lx = x + 4 + hash01(i, 2) * 5;
        ctx.fillStyle = '#161d22'; ctx.beginPath();
        poly(ctx, [lx - 1.6, -0.5, lx + 1.8, -0.5, lx + 0.7, 1.0, lx - 1.0, 0.8]);
        poly(ctx, [lx - 0.4, 0.8, lx + 0.4, 0.8, lx + 0.26, 5.6, lx - 0.26, 5.6]);
        ctx.rect(lx - 0.45, 5.6, 0.9, 0.14); ctx.rect(lx - 0.22, 5.74, 0.44, 0.45); poly(ctx, [lx - 0.32, 6.19, lx + 0.32, 6.19, lx, 6.6]);
        ctx.fill();
        const c = Math.cos(t * 0.9 + i), len = 30 * c;
        ctx.fillStyle = `rgba(255,230,170,${(0.05 * Math.abs(c)).toFixed(3)})`; ctx.beginPath();
        poly(ctx, [lx, 5.95, lx + len, 5.95 + 3 * Math.abs(c) + 0.3, lx + len, 5.95 - 3 * Math.abs(c) - 0.3]); ctx.fill();
        ctx.fillStyle = 'rgba(255,220,150,0.35)'; ctx.fillRect(lx - 0.15, 5.8, 0.3, 0.3);
      }
    } },
    { k: 0.26, tile: 16, col: '#171d22', draw(ctx, x, i, L) {            // listing wreck / giant tentacles
      const t = clock(), f = flashAt(t, 6.3);
      if ((i & 1) === 0) {
        ctx.save(); ctx.translate(x + 8, -0.4); ctx.rotate(-0.13 + Math.sin(t * 0.4 + i) * 0.015);
        ctx.fillStyle = '#161c21'; ctx.beginPath();
        poly(ctx, [-5.5, -1.5, 4.5, -1.5, 6.2, 1.3, 1.5, 1.2, -3.8, 1.3, -5.8, 2.6, -6.4, 1.2]);
        ctx.rect(-5.6, 1.2, 2.4, 1.1);
        ctx.rect(-2.5, 1.2, 0.22, 6.5); ctx.rect(1.6, 1.2, 0.22, 4.2); ctx.rect(-3.8, 5.8, 2.9, 0.12);
        poly(ctx, [-3.5, 5.7, -0.9, 5.7, -1.2, 3.4, -2.1, 3.9, -3.0, 2.6]);
        poly(ctx, [0.6, 5.0, 3.0, 5.0, 2.6, 3.0, 1.9, 3.5, 1.3, 2.7]);
        poly(ctx, [4.6, 1.3, 6.2, 1.3, 8.4, 2.4]);
        ctx.fill();
        ctx.strokeStyle = '#161c21'; ctx.lineWidth = 0.05; ctx.beginPath();
        ctx.moveTo(-2.4, 7.6); ctx.lineTo(-5.8, 2.4); ctx.moveTo(-2.4, 7.6); ctx.lineTo(1.7, 5.4); ctx.moveTo(1.7, 5.4); ctx.lineTo(8.3, 2.4);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,190,90,0.14)'; ctx.beginPath(); for (let w = 0; w < 5; w++) if (hash01(i + w, 125) > 0.4) ctx.rect(-4.6 + w * 1.8, 0.2, 0.3, 0.3); ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = '#1b1a23'; ctx.beginPath();
        tentacle(ctx, x + 4, -2, 8.5, 0.75, i * 1.7, t);
        tentacle(ctx, x + 9.5, -2, 6.5, 0.6, i * 1.7 + 2.4, t);
        if (hash01(i, 3) > 0.4) tentacle(ctx, x + 13, -2, 4.8, 0.45, i + 4.1, t);
        ctx.fill();
        if (f > 0) { ctx.fillStyle = `rgba(190,210,230,${(0.08 * f).toFixed(3)})`; ctx.beginPath(); tentacle(ctx, x + 4, -2, 8.5, 0.75, i * 1.7, t); ctx.fill(); }
      }
      ctx.fillStyle = '#151c21'; ctx.beginPath();
      for (let j = 0; j <= 16; j += 2) { const wx = x + j; poly(ctx, [wx - 1.2, -3, wx + 1.2, -3, wx + 0.9, -1.2 + Math.sin(wx * 0.8 + t * 1.5) * 0.3, wx - 0.4, -0.9 + Math.sin(wx * 0.8 + t * 1.5 + 0.6) * 0.35]); }
      ctx.fill();
    } },
    { k: 0.5, tile: 7, col: '#13181c', draw(ctx, x, i, L) {              // battered quay: broken posts, swinging storm lamp
      const t = clock();
      ctx.fillStyle = '#13181c'; ctx.beginPath();
      ctx.rect(x - 0.02, -20, L.tile + 0.04, 16.8);
      for (let p = 0; p < 3; p++) { const px = x + 0.4 + p * 2.3, ph = -2.3 + hash01(i, p) * 1.6; poly(ctx, [px, -3.3, px + 0.36, -3.3, px + 0.36, ph + 0.15, px, ph - 0.1]); }
      const lamp = (i & 1) === 0;
      if (lamp) {
        ctx.rect(x + 5.2, -3.3, 0.14, 7.5); poly(ctx, [x + 5.2, 4.1, x + 5.34, 4.2, x + 4.4, 4.9, x + 4.3, 4.78]);
        const sw = Math.sin(t * 1.6 + i) * 0.35, lx = x + 4.35 + Math.sin(sw) * 1.1, ly = 4.8 - Math.cos(sw) * 1.1;
        poly(ctx, [x + 4.33, 4.8, x + 4.37, 4.8, lx + 0.02, ly, lx - 0.02, ly]);
        ctx.rect(lx - 0.16, ly - 0.36, 0.32, 0.36);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,200,110,0.35)'; ctx.fillRect(lx - 0.1, ly - 0.3, 0.2, 0.22);
        ctx.fillStyle = 'rgba(255,200,110,0.035)'; ctx.beginPath(); poly(ctx, [lx - 0.1, ly - 0.3, lx + 0.1, ly - 0.3, lx + 1.4 + sw * 3, -3.2, lx - 1.4 + sw * 3, -3.2]); ctx.fill();
      } else {
        ctx.rect(x + 3.8, -3.3, 1.1, 0.9); poly(ctx, [x + 5.0, -3.3, x + 5.9, -3.3, x + 6.1, -2.5, x + 5.2, -2.3]);
        ctx.fill();
      }
    } },
  ],
};

// ---- boss_volcano: Erupting Caldera — a huge erupting cone, lava bombs, rim cliffs with lava falls, lava river below
const boss_volcano = {
  bg: '#1f1414', glow: [255, 80, 20, 0.21],
  sky(ctx, view, cam) {
    const t = clock(), W = view.width, H = view.height;
    vGrad(ctx, view, [[0, '#100a0c'], [0.55, '#261110'], [1, '#43180f']]);
    ctx.fillStyle = '#150d0e'; ctx.beginPath();
    for (let j = 0; j < 12; j++) { const r = 60 + hash01(j, 131) * 70, cx = ((((j / 12) * (W + 300) + t * 5 - cam.x * 1.5) % (W + 300)) + W + 300) % (W + 300) - 150; circ(ctx, cx, hash01(j, 132) * 50, r); }
    ctx.fill();
    ctx.fillStyle = 'rgba(255,140,60,0.4)'; ctx.beginPath();
    for (let j = 0; j < 40; j++) {
      const sp = 40 + hash01(j, 133) * 60, yy = H + 20 - ((hash01(j, 134) * (H + 40) + t * sp) % (H + 40));
      const xx = ((((hash01(j, 135) * W + Math.sin(t * 0.8 + j) * 20 - cam.x * 3) % W) + W) % W), r = 1.2 + hash01(j, 136) * 1.5;
      ctx.rect(xx, yy, r, r);
    }
    ctx.fill();
  },
  layers: [
    { k: 0.07, tile: 110, col: '#1d1314', draw(ctx, x, i, L) {          // the volcano (centre one erupts)
      const t = clock(), erupt = ((i % 3) + 3) % 3 === 0;
      ctx.fillStyle = '#1d1314'; ctx.beginPath();
      poly(ctx, [x - 48, -12, x + 48, -12, x + 7, 34, x + 3.5, 32.5, x, 33.4, x - 3.5, 32.3, x - 7, 34]);
      ctx.fill();
      ctx.strokeStyle = `rgba(255,100,30,${(erupt ? 0.26 : 0.12).toFixed(2)})`; ctx.lineWidth = 0.7; ctx.lineJoin = 'round'; ctx.beginPath();
      for (let s = 0; s < 4; s++) {
        const dir = s < 2 ? -1 : 1; let sx = x + dir * (2 + s % 2 * 3), sy = 33;
        ctx.moveTo(sx, sy);
        for (let k = 1; k < 7; k++) { sy -= 5.5; sx += dir * (4.2 + Math.sin(k * 2.1 + s) * 1.5); ctx.lineTo(sx, sy); }
      }
      ctx.stroke();
      ctx.fillStyle = `rgba(255,120,40,${(erupt ? 0.3 + 0.08 * Math.sin(t * 3) : 0.12).toFixed(3)})`; ctx.beginPath(); ctx.ellipse(x, 33.5, 8, 2.5, 0, 0, TAU); ctx.fill();
      for (let s = 0; s < (erupt ? 6 : 3); s++) {
        const ph = (t * 0.07 + s / (erupt ? 6 : 3)) % 1;
        ctx.fillStyle = `rgba(38,24,24,${((erupt ? 0.55 : 0.3) * (1 - ph) * Math.min(1, ph * 8)).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(x + Math.sin(ph * 4 + s) * 3 + ph * 10, 36 + ph * 34, 3 + ph * 11, 0, TAU); ctx.fill();
      }
      if (erupt) {
        ctx.fillStyle = 'rgba(255,150,60,0.55)'; ctx.beginPath();
        for (let p = 0; p < 18; p++) {
          const ph = (t * 0.35 + hash01(p, 137)) % 1, T = ph * 3.2, vx = (hash01(p, 138) - 0.5) * 9, vy = 13 + hash01(p, 139) * 7;
          const px = x + vx * T, py = 34 + vy * T - 4.9 * T * T;
          if (py > -12) ctx.rect(px - 0.5, py - 0.5, 1, 1);
        }
        ctx.fill();
      }
    } },
    { k: 0.22, tile: 9, col: '#231616', draw(ctx, x, i, L) {             // caldera rim cliffs with lava falls + vents
      const t = clock();
      ctx.fillStyle = '#231616'; ctx.beginPath(); ridge(ctx, x, i, L.tile, -20, 1.5, 6, 140, 6, 2.5); ctx.fill();
      if (hash01(i, 1) > 0.45) {
        const fx = x + L.tile / 2, top = 1.5 + ((hash01(i, 140) + hash01(i + 1, 140)) / 2) * 6 - 0.5;
        ctx.fillStyle = `rgba(255,90,30,${(0.2 + 0.05 * Math.sin(t * 4 + i)).toFixed(3)})`; ctx.beginPath();
        poly(ctx, [fx - 0.5, -20, fx + 0.7, -20, fx + 0.4, top, fx - 0.3, top]); ctx.fill();
        ctx.fillStyle = 'rgba(255,190,90,0.18)'; ctx.beginPath();
        for (let s = 0; s < 4; s++) { const yy = top - ((t * 4 + s * 3.7 + i) % (top + 20)); ctx.rect(fx - 0.15, yy - 1, 0.35, 1); }
        ctx.fill();
      }
      ctx.strokeStyle = 'rgba(255,110,40,0.12)'; ctx.lineWidth = 0.12; ctx.beginPath(); ridgeLine(ctx, x, i, L.tile, 1.5, 6, 140, 6, 2.5); ctx.stroke();
    } },
    { k: 0.5, tile: 6.5, col: '#1a1111', draw(ctx, x, i, L) {             // lava river + obsidian spikes + braziers
      const t = clock();
      ctx.fillStyle = `rgba(255,90,30,${(0.35 + 0.07 * Math.sin(t * 1.5 + i)).toFixed(3)})`; ctx.fillRect(x - 0.02, -3.9, L.tile + 0.04, 0.75);
      ctx.fillStyle = 'rgba(255,200,100,0.22)'; ctx.beginPath();
      for (let s = 0; s < 5; s++) { const rx = x + ((hash01(i, s) * L.tile + t * (0.4 + s * 0.1)) % L.tile); ctx.rect(rx, -3.3, 0.5 + hash01(i, s + 5) * 0.8, 0.06); }
      ctx.fill();
      ctx.fillStyle = '#1a1111'; ctx.fillRect(x - 0.02, -30, L.tile + 0.04, 26.1);
      ctx.fillStyle = '#130b0b'; ctx.beginPath();
      const sx = x + 1 + hash01(i, 10) * 1.5, sh = 1 + hash01(i, 11) * 3.5;
      poly(ctx, [sx - 0.6, -3.3, sx + 0.7, -3.3, sx + 0.1, sh]); poly(ctx, [sx + 0.4, -3.3, sx + 1.3, -3.3, sx + 0.9, sh * 0.5]);
      const brazier = (i & 1) === 0, bx = x + 4.6;
      if (brazier) { ctx.rect(bx - 0.14, -3.3, 0.28, 5.6); poly(ctx, [bx - 0.5, 2.3, bx + 0.5, 2.3, bx + 0.8, 2.8, bx - 0.8, 2.8]); ctx.rect(bx - 0.45, -3.3, 0.9, 0.3); }
      ctx.fill();
      if (brazier) {
        ctx.fillStyle = `rgba(255,120,40,${(0.35 + 0.08 * Math.sin(t * 11 + i)).toFixed(3)})`; ctx.beginPath();
        for (let f = 0; f < 4; f++) { const fx = bx - 0.45 + f * 0.3, fh = 0.5 + 0.45 * (0.5 + 0.5 * Math.sin(t * (7 + f * 1.3) + f * 2 + i)); poly(ctx, [fx - 0.17, 2.75, fx + 0.17, 2.75, fx + Math.sin(t * 5 + f) * 0.06, 2.75 + fh]); }
        ctx.fill();
        ctx.fillStyle = 'rgba(255,120,40,0.05)'; ctx.beginPath(); ctx.arc(bx, 3.2, 1.6, 0, TAU); ctx.fill();
      }
    } },
  ],
};

// ---- boss_sky: Thunder Temple — a grand pagoda on a giant floating island, storm flashes, thunder-drum rings
const boss_sky = {
  bg: '#1a1b2a', glow: [170, 170, 255, 0.1],
  sky(ctx, view, cam) {
    const t = clock(), W = view.width, H = view.height;
    vGrad(ctx, view, [[0, '#0e0e1c'], [0.55, '#1c1b2f'], [1, '#2c2a42']]);
    drawLightning(ctx, view, 4.7, 150, '190,190,255');
    ctx.fillStyle = '#121221'; ctx.beginPath();
    for (let j = 0; j < 13; j++) { const r = 55 + hash01(j, 151) * 65, cx = ((((j / 13) * (W + 300) - t * 6 - cam.x * 1.5) % (W + 300)) + W + 300) % (W + 300) - 150; circ(ctx, cx, hash01(j, 152) * 45, r); }
    ctx.rect(-64, -64, W + 128, 60);
    ctx.fill();
  },
  layers: [
    { k: 0.07, tile: 120, col: '#18182a', draw(ctx, x, i, L) {           // grand temple on a giant floating island
      const t = clock(), f = flashAt(t, 4.7), bob = Math.sin(t * 0.2 + i) * 0.4;
      ctx.fillStyle = '#18182a'; ctx.beginPath();
      island(ctx, x, 4 + bob, 64, i, 160);
      for (let c = 0; c < 6; c++) ctx.rect(x - 22 + c * 9, -40 + bob, 0.35, 34 + hash01(i, c + 161) * 6);
      ctx.fill();
      ctx.fillStyle = '#141425'; ctx.beginPath();
      pagoda(ctx, x, 4.1 + bob, 24, 5, 5.2);
      pagoda(ctx, x - 20, 4.1 + bob, 9, 3, 3.2); pagoda(ctx, x + 20, 4.1 + bob, 9, 3, 3.2);
      ctx.fill();
      const gy = 4.1 + bob + 5.2 * 0.25 + 5.2 * 0.3;
      ctx.fillStyle = `rgba(170,180,255,${(0.1 + 0.3 * f).toFixed(3)})`; ctx.beginPath();
      circ(ctx, x, gy + 1.8, 1.9);
      for (let k = 0; k < 5; k++) { const ky = 4.1 + bob + 5.2 * 0.25 + k * 5.2 + 1.2; ctx.rect(x - 1.8, ky, 0.7, 1); ctx.rect(x + 1.1, ky, 0.7, 1); }
      ctx.fill();
      if (f > 0.3) {
        ctx.strokeStyle = `rgba(220,225,255,${(0.5 * f).toFixed(3)})`; ctx.lineWidth = 0.4; ctx.beginPath();
        const top = 4.1 + bob + 5.2 * 5.3;
        ctx.moveTo(x, top + 4); ctx.lineTo(x - 1.5, top + 8); ctx.lineTo(x + 0.8, top + 10); ctx.lineTo(x - 0.5, top + 16);
        ctx.stroke();
      }
    } },
    { k: 0.22, tile: 12, col: '#1d1d31', draw(ctx, x, i, L) {           // rotating thunder-drum rings / floating rune pillars
      const t = clock(), f = flashAt(t, 4.7), cx = x + 6, cy = 6.5 + Math.sin(t * 0.4 + i) * 0.3;
      if ((i & 1) === 0) {
        ctx.strokeStyle = '#1d1d31'; ctx.lineWidth = 0.35; ctx.beginPath(); ctx.arc(cx, cy, 3.3, 0, TAU); ctx.stroke();
        ctx.fillStyle = '#1d1d31'; ctx.beginPath();
        for (let d = 0; d < 8; d++) { const a = t * 0.15 + (d * TAU) / 8; circ(ctx, cx + Math.cos(a) * 3.3, cy + Math.sin(a) * 3.3, 0.75); }
        circ(ctx, cx, cy, 0.5);
        ctx.fill();
        ctx.fillStyle = `rgba(170,180,255,${(0.08 + 0.25 * f).toFixed(3)})`; ctx.beginPath();
        for (let d = 0; d < 8; d++) { const a = t * 0.15 + (d * TAU) / 8; circ(ctx, cx + Math.cos(a) * 3.3, cy + Math.sin(a) * 3.3, 0.38); }
        ctx.fill();
        ctx.fillStyle = '#1d1d31'; ctx.beginPath();
        for (let d = 0; d < 8; d++) { const a = t * 0.15 + (d * TAU) / 8; circ(ctx, cx + Math.cos(a) * 3.3, cy + Math.sin(a) * 3.3, 0.22); }
        ctx.fill();
      } else {
        const px = x + 4 + hash01(i, 1) * 4, py = 3 + hash01(i, 2) * 4 + Math.sin(t * 0.5 + i) * 0.35;
        ctx.fillStyle = '#1d1d31'; ctx.beginPath();
        ctx.rect(px - 0.55, py, 1.1, 5.5); ctx.rect(px - 0.8, py + 5.5, 1.6, 0.35); ctx.rect(px - 0.8, py - 0.3, 1.6, 0.35);
        poly(ctx, [px - 1.2, py - 0.3, px + 1.2, py - 0.3, px + 0.3, py - 2.2, px - 0.5, py - 1.5]);
        ctx.fill();
        const on = 0.12 + 0.35 * f + 0.05 * Math.sin(t * 2 + i);
        ctx.fillStyle = `rgba(170,180,255,${on.toFixed(3)})`; ctx.beginPath();
        for (let r = 0; r < 4; r++) { const ry = py + 0.7 + r * 1.2; ctx.rect(px - 0.2, ry, 0.4, 0.08); ctx.rect(px - 0.04, ry - 0.2, 0.08, 0.45); }
        ctx.fill();
      }
    } },
    { k: 0.5, tile: 7, col: '#232338', draw(ctx, x, i, L) {              // dark storm cloud sea + stone lanterns
      const t = clock();
      ctx.fillStyle = '#232338'; ctx.beginPath();
      ctx.rect(x - 0.03, -40, L.tile + 0.06, 39);
      for (let j = 0; j < 6; j++) { const r = 0.55 + hash01(i, j) * 0.75; circ(ctx, x + ((j + 0.5) * L.tile) / 6 + Math.sin(t * 0.3 + j + i) * 0.15, -1.1 + r * 0.4, r); }
      ctx.fill();
      if ((i & 1) === 0) {
        const lx = x + 3.5;
        ctx.fillStyle = '#19192a'; ctx.beginPath();
        ctx.rect(lx - 0.5, -1, 1, 0.3); ctx.rect(lx - 0.15, -0.7, 0.3, 2.4); ctx.rect(lx - 0.45, 1.7, 0.9, 0.2); ctx.rect(lx - 0.35, 1.9, 0.7, 0.7);
        poly(ctx, [lx - 0.75, 2.6, lx + 0.75, 2.6, lx + 0.15, 3.2, lx - 0.15, 3.2]);
        ctx.fill();
        ctx.fillStyle = `rgba(190,170,255,${(0.28 + 0.06 * Math.sin(t * 6 + i)).toFixed(3)})`; ctx.fillRect(lx - 0.2, 2.0, 0.4, 0.45);
      }
    } },
  ],
};

// ---- boss_neon: Mega Arcade — giant marquee screen with marching pixel invaders, spotlights, cabinet towers, crowd
const INVADER = [[0b01110, 0b10101, 0b11111, 0b01010], [0b01110, 0b10101, 0b11111, 0b10001]];
const boss_neon = {
  bg: '#140f1c', glow: [255, 60, 200, 0.11],
  sky(ctx, view, cam) {
    const t = clock(), W = view.width, H = view.height;
    vGrad(ctx, view, [[0, '#0b0814'], [0.6, '#191128'], [1, '#261a38']]);
    const cols = ['rgba(255,80,220,0.04)', 'rgba(80,220,255,0.04)', 'rgba(255,194,61,0.035)'];
    for (let j = 0; j < 3; j++) {
      const ox = W * (0.18 + 0.32 * j) - cam.x * 2, oy = H + 20, a = -Math.PI / 2 + Math.sin(t * 0.45 + j * 2.1) * 0.55, len = H * 1.4;
      const dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx;
      ctx.fillStyle = cols[j]; ctx.beginPath();
      poly(ctx, [ox + nx * 8, oy + ny * 8, ox + dx * len + nx * 110, oy + dy * len + ny * 110, ox + dx * len - nx * 110, oy + dy * len - ny * 110, ox - nx * 8, oy - ny * 8]);
      ctx.fill();
    }
  },
  layers: [
    { k: 0.14, tile: 30, col: '#16111f', draw(ctx, x, i, L) {           // giant marquee screen
      const t = clock(), sx = x + 15, W2 = 10, y0 = 3, y1 = 14;
      ctx.fillStyle = '#16111f'; ctx.fillRect(x - 0.03, -40, L.tile + 0.06, 40 + y0 - 1);
      ctx.fillStyle = '#211a2e'; ctx.beginPath(); ctx.rect(sx - W2 - 0.8, y0 - 0.8, 2 * W2 + 1.6, y1 - y0 + 1.6); ctx.rect(sx - 0.6, -40, 1.2, 42.3); ctx.fill();
      ctx.fillStyle = '#17132a'; ctx.fillRect(sx - W2, y0, 2 * W2, y1 - y0);
      const rgb = ['255,80,220', '80,220,255', '255,194,61'][((i % 3) + 3) % 3], fr = Math.floor(t * 2) & 1, ox = Math.sin(t * 0.6 + i) * 2.2, px = 0.36;
      ctx.fillStyle = `rgba(${rgb},0.34)`; ctx.beginPath();
      for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) {
        const bx = sx - 7.8 + c * 2.35 + ox, by = y1 - 1.6 - r * 1.9 - ((Math.floor(t * 0.5) % 3) * 0.3);
        const spr = INVADER[fr];
        for (let row = 0; row < 4; row++) for (let bit = 0; bit < 5; bit++) if (spr[row] & (1 << (4 - bit))) ctx.rect(bx + bit * px, by - row * px, px * 0.9, px * 0.9);
      }
      const shipX = sx + Math.sin(t * 0.9 + i * 2) * 7;
      poly(ctx, [shipX - 0.6, y0 + 0.5, shipX + 0.6, y0 + 0.5, shipX, y0 + 1.5]);
      if ((t * 1.5) % 1 < 0.6) ctx.rect(shipX - 0.05, y0 + 1.7 + ((t * 1.5) % 1) * 8, 0.1, 0.5);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.035)'; ctx.fillRect(sx - W2, y1 - ((t * 0.3) % 1) * (y1 - y0) - 0.6, 2 * W2, 0.6);
      const ph = Math.floor(t * 6), n = 30;
      for (let pass = 0; pass < 2; pass++) {
        ctx.fillStyle = pass ? 'rgba(255,194,61,0.55)' : 'rgba(255,194,61,0.12)'; ctx.beginPath();
        for (let k = 0; k < n; k++) {
          if (((k + ph) % 3 === 0) !== (pass === 1)) continue;
          const u = k / n, per = 2 * (2 * W2 + 1.2) + 2 * (y1 - y0 + 1.2); let d = u * per, bx, by;
          const w = 2 * W2 + 1.2, h = y1 - y0 + 1.2;
          if (d < w) { bx = sx - W2 - 0.6 + d; by = y1 + 0.6; } else if ((d -= w) < h) { bx = sx + W2 + 0.6; by = y1 + 0.6 - d; } else if ((d -= h) < w) { bx = sx + W2 + 0.6 - d; by = y0 - 0.6; } else { d -= w; bx = sx - W2 - 0.6; by = y0 - 0.6 + d; }
          circ(ctx, bx, by, 0.16);
        }
        ctx.fill();
      }
      ctx.fillStyle = 'rgba(80,220,255,0.3)'; ctx.strokeStyle = 'rgba(80,220,255,0.06)';
      worldText(ctx, 'HI ' + String(Math.floor(t * 37 + i * 1000) % 100000).padStart(5, '0'), x + 2.5, 12.5, 1.1, true);
    } },
    { k: 0.35, tile: 8, col: '#1b1526', draw(ctx, x, i, L) {             // cabinet pyramids + giant joystick statue
      const t = clock();
      ctx.fillStyle = '#1b1526'; ctx.beginPath();
      if ((i & 1) === 0) {
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3 - r; c++) ctx.rect(x + 1 + r * 0.7 + c * 1.45, r * 2.3, 1.3, 2.2);
      } else {
        const jx = x + 4, lean = Math.sin(t * 0.8 + i) * 0.15;
        ctx.rect(jx - 1.8, 0, 3.6, 1.4); ctx.rect(jx - 2.1, 1.4, 4.2, 0.3);
        poly(ctx, [jx - 0.18, 1.7, jx + 0.18, 1.7, jx + 0.18 + lean * 4, 5.2, jx - 0.18 + lean * 4, 5.2]);
        circ(ctx, jx + lean * 4.2, 5.7, 0.85);
        circ(ctx, jx + 1.2, 1.9, 0.35); circ(ctx, jx - 1.2, 1.9, 0.35);
      }
      ctx.fill();
      if ((i & 1) === 0) {
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3 - r; c++) {
          const rgb = ['255,80,220', '80,220,255', '255,194,61'][(r + c + i) % 3];
          ctx.fillStyle = `rgba(${rgb},${(0.18 * neonOn(t, i * 11 + r * 5 + c)).toFixed(3)})`;
          ctx.fillRect(x + 1.2 + r * 0.7 + c * 1.45, r * 2.3 + 1.0, 0.9, 0.8);
        }
      } else {
        const jx = x + 4, lean = Math.sin(t * 0.8 + i) * 0.15;
        ctx.fillStyle = 'rgba(255,90,70,0.2)'; ctx.beginPath(); circ(ctx, jx + lean * 4.2, 5.7, 0.6); ctx.fill();
      }
    } },
    { k: 0.6, tile: 4, col: '#0f0b16', draw(ctx, x, i, L) {              // cheering crowd + light-up floor strip
      const t = clock();
      ctx.fillStyle = '#0f0b16'; ctx.beginPath();
      ctx.rect(x - 0.02, -30, L.tile + 0.04, 29.2);
      for (let p = 0; p < 5; p++) {
        const px = x + 0.4 + p * 0.8 + (hash01(i, p) - 0.5) * 0.3, hop = Math.abs(Math.sin(t * (3.2 + hash01(i, p + 5)) + p * 1.7 + i)) * 0.15, hy = -0.4 + hash01(i, p + 10) * 0.35 + hop;
        ctx.roundRect(px - 0.3, -1, 0.6, hy + 0.6, 0.2); circ(ctx, px, hy + 0.8, 0.22);
      }
      ctx.fill();
      ctx.fillStyle = 'rgba(255,194,61,0.3)'; ctx.beginPath();
      for (let p = 0; p < 5; p++) if (hash01(i * 3 + p, Math.floor(t * 1.2)) > 0.7) {
        const px = x + 0.4 + p * 0.8 + (hash01(i, p) - 0.5) * 0.3, hy = -0.4 + hash01(i, p + 10) * 0.35 + Math.abs(Math.sin(t * (3.2 + hash01(i, p + 5)) + p * 1.7 + i)) * 0.15, sw = Math.sin(t * 6 + p) * 0.2;
        poly(ctx, [px + 0.2, hy + 0.5, px + 0.26, hy + 0.5, px + 0.33 + sw, hy + 1.3, px + 0.27 + sw, hy + 1.3]);
      }
      ctx.fill();
      const lit = (i + Math.floor(t * 5)) % 3;
      ctx.fillStyle = `rgba(${['255,80,220', '80,220,255', '255,194,61'][lit]},0.22)`; ctx.fillRect(x + 0.05, -0.95, L.tile - 0.1, 0.07);
    } },
  ],
};

// ---- boss_space: Command Deck — a huge planet filling the lower sky, fleet silhouettes, slanted viewport ribs, holo-globe
const boss_space = {
  bg: '#0d0f16', glow: [120, 170, 255, 0.1],
  sky(ctx, view, cam) {
    const t = clock(), W = view.width, H = view.height;
    drawStars(ctx, view, cam, 170, 0.55, 0.6, 0.8);
    const R = Math.max(W * 0.75, H * 1.2), px = W * 0.5 - cam.x * 0.8, py = H * 0.3 + R + cam.y * 1.0;
    ctx.fillStyle = '#1b2a3a'; ctx.beginPath(); ctx.arc(px, py, R, 0, TAU); ctx.fill();
    ctx.save(); ctx.clip();
    ctx.fillStyle = 'rgba(150,200,235,0.06)'; ctx.beginPath();
    for (let b = 0; b < 7; b++) ctx.ellipse(px - R * 0.6 + b * R * 0.22 + Math.sin(t * 0.02 + b) * 20, py - R * (0.9 - hash01(b, 170) * 0.12), R * 0.18, R * 0.025, 0.08, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#121c28'; ctx.beginPath(); ctx.arc(px + R * 0.55, py - R * 0.25, R * 1.02, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,194,61,0.22)'; ctx.beginPath();
    for (let c = 0; c < 40; c++) { const cx = px + R * (0.05 + hash01(c, 171) * 0.8), cy = py - R * (0.86 + hash01(c, 172) * 0.13); ctx.rect(cx, cy, 1.5, 1.5); }
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = 'rgba(110,180,255,0.1)'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(px, py, R + 4, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(160,215,255,0.2)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(px, py, R, 0, TAU); ctx.stroke();
    const mx = W * 0.15 - cam.x * 0.5, my = H * 0.18, mr = Math.min(W, H) * 0.04;
    ctx.fillStyle = '#2b3140'; ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU); ctx.fill();
    ctx.fillStyle = '#1c2029'; ctx.beginPath(); ctx.arc(mx + mr * 0.4, my - mr * 0.2, mr * 0.9, 0, TAU); ctx.fill();
  },
  layers: [
    { k: 0.1, tile: 24, col: '#161a24', draw(ctx, x, i, L) {             // drifting fleet silhouettes
      const t = clock();
      for (let s = 0; s < 2; s++) {
        if (hash01(i, s + 1) < 0.35) continue;
        const sc = 0.7 + hash01(i, s + 3) * 1.2, sx = x + 3 + s * 11 + hash01(i, s + 5) * 5 + Math.sin(t * 0.05 + i + s) * 2, sy = 10 + hash01(i, s + 7) * 12;
        ctx.fillStyle = '#161a24'; ctx.beginPath();
        poly(ctx, [sx, sy, sx + 6 * sc, sy + 0.5 * sc, sx + 8 * sc, sy + 0.15 * sc, sx + 6 * sc, sy - 0.8 * sc, sx + 0.5 * sc, sy - 0.6 * sc]);
        ctx.rect(sx + 2 * sc, sy + 0.2 * sc, 1.6 * sc, 0.7 * sc);
        ctx.fill();
        ctx.fillStyle = `rgba(110,190,255,${(0.35 + 0.15 * Math.sin(t * 4 + i + s)).toFixed(3)})`; ctx.beginPath();
        circ(ctx, sx - 0.15 * sc, sy - 0.05 * sc, 0.2 * sc); circ(ctx, sx + 0.1 * sc, sy - 0.4 * sc, 0.14 * sc);
        ctx.fill();
      }
    } },
    { k: 0.3, tile: 11, col: '#141821', draw(ctx, x, i, L) {             // deck: slanted viewport ribs, ceiling, holo-globe
      const t = clock();
      ctx.fillStyle = '#141821'; ctx.beginPath();
      ctx.rect(x - 0.03, -30, L.tile + 0.06, 30.6); ctx.rect(x - 0.03, 11.5, L.tile + 0.06, 30);
      poly(ctx, [x - 0.4, 0.6, x + 0.4, 0.6, x + 1.9, 11.5, x + 1.1, 11.5]);
      poly(ctx, [x + 0.4, 0.6, x + 2.2, 0.6, x + 0.4, 2.2]); poly(ctx, [x + 1.1, 11.5, x + 3.4, 11.5, x + 1.7, 10]);
      poly(ctx, [x - 0.03, 11.5, x + L.tile + 0.03, 11.5, x + L.tile + 0.03, 11.0, x - 0.03, 11.0]);
      const even = (i & 1) === 0, hx = x + 6;
      if (even) { ctx.rect(hx - 0.9, 0.6, 1.8, 1.0); ctx.rect(hx - 0.4, 1.6, 0.8, 0.3); }
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); for (let s = 0; s < 6; s++) ctx.rect(x + 1 + s * 1.6, 11.05, 0.8, 0.1); ctx.fill();
      if (even) {
        const gy = 4.2, r = 1.7;
        ctx.fillStyle = 'rgba(80,220,255,0.05)'; ctx.beginPath(); poly(ctx, [hx - 0.35, 1.9, hx + 0.35, 1.9, hx + r, gy, hx - r, gy]); ctx.fill();
        ctx.strokeStyle = 'rgba(80,220,255,0.28)'; ctx.lineWidth = 0.05; ctx.beginPath();
        ctx.moveTo(hx + r, gy); ctx.arc(hx, gy, r, 0, TAU);
        for (let m = 0; m < 3; m++) { const rx = Math.abs(Math.cos(t * 0.5 + (m * Math.PI) / 3)) * r; ctx.moveTo(hx + rx, gy); ctx.ellipse(hx, gy, Math.max(0.01, rx), r, 0, 0, TAU); }
        ctx.moveTo(hx + r, gy); ctx.ellipse(hx, gy, r, r * 0.3, 0, 0, TAU);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,194,61,0.4)'; ctx.fillRect(hx + Math.cos(t * 0.5) * r * 0.6 - 0.07, gy + 0.5 - 0.07, 0.14, 0.14);
      }
    } },
    { k: 0.6, tile: 5, col: '#10131a', draw(ctx, x, i, L) {              // bridge consoles + command chair
      const t = clock();
      ctx.fillStyle = '#10131a'; ctx.beginPath();
      ctx.rect(x - 0.02, -30, L.tile + 0.04, 29.6);
      poly(ctx, [x + 0.3, -0.5, x + 3.0, -0.5, x + 3.0, 0.4, x + 2.6, 1.0, x + 0.7, 1.0, x + 0.3, 0.4]);
      if (hash01(i, 1) > 0.6) { const cx = x + 4.2; ctx.rect(cx - 0.1, -0.5, 0.2, 0.9); ctx.rect(cx - 0.45, 0.4, 0.9, 0.18); poly(ctx, [cx - 0.35, 0.58, cx + 0.35, 0.58, cx + 0.3, 1.9, cx - 0.3, 1.9]); }
      ctx.fill();
      ctx.fillStyle = 'rgba(80,220,255,0.18)'; ctx.fillRect(x + 0.9, 0.55, 1.5, 0.35);
      ctx.fillStyle = 'rgba(255,194,61,0.45)'; ctx.beginPath();
      for (let b = 0; b < 6; b++) if (Math.sin(t * (1.3 + b * 0.6) + i * 2 + b) > 0.1) ctx.rect(x + 0.9 + b * 0.26, 0.2, 0.12, 0.08);
      ctx.fill();
      ctx.fillStyle = 'rgba(216,67,47,0.5)'; ctx.fillRect(x + 2.65, 0.5, 0.12, 0.1);
    } },
  ],
};

export const BG_THEMES_EXTRA = { freezer, docks, volcano, sky, neon, space, boss_freezer, boss_docks, boss_volcano, boss_sky, boss_neon, boss_space };
