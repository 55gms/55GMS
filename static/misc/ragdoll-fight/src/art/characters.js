// Character art for acts 5–10 (enemies + bosses). Merged into render.js HATS / LOOKS / HAT_LOOK.
// See DESIGN.md §10 for the contract.
// Frame: origin = head centre, y-up, +x = facing (mirroring done by the caller), r = head radius.
// f = the wearer or null (previews / flying helmets): guard f && f.dead. Flat fills, no shadowBlur.
// The base face (eyes at x 0.3r / 0.68r, y 0.18r) is drawn before the hat: keep y≈0.06–0.30r clear in front,
// or draw eyes/visor yourself when a mask covers the face.

const TAU = Math.PI * 2;
const INK = '#23262e';
const CREAM = '#f2eee6';
const RED = '#d8432f';
const CHEESE = '#ffc23d';

const T = () => performance.now() / 1000;
const alive = (f) => !(f && f.dead);
function dot(ctx, x, y, rr) { ctx.moveTo(x + rr, y); ctx.arc(x, y, rr, 0, TAU); }
/** Part of the circle (radius R, centre 0,cy) between the horizontal chords y1 < y2. */
function bandPath(ctx, R, y1, y2, cy = 0) {
  const cl = (v) => Math.max(-1, Math.min(1, v));
  const a1 = Math.asin(cl((y1 - cy) / R)), a2 = Math.asin(cl((y2 - cy) / R));
  ctx.beginPath(); ctx.arc(0, cy, R, a1, a2); ctx.arc(0, cy, R, Math.PI - a2, Math.PI - a1); ctx.closePath();
}
/** Dome = circle arc from angle -lip to PI+lip (closed along the chord). */
function domePath(ctx, R, cy, lip) { ctx.beginPath(); ctx.arc(0, cy, R, -lip, Math.PI + lip); ctx.closePath(); }
/** Eyes for masks that hide the base face: dots alive, X's dead. */
function faceEyes(ctx, r, f, col, rad = 0.12, y = 0.18, xs = [0.3, 0.68]) {
  if (f && f.dead) {
    ctx.strokeStyle = col; ctx.lineWidth = r * 0.11; ctx.beginPath();
    for (const ex of xs) { const x = ex * r, yy = y * r, s = r * 0.11; ctx.moveTo(x - s, yy - s); ctx.lineTo(x + s, yy + s); ctx.moveTo(x - s, yy + s); ctx.lineTo(x + s, yy - s); }
    ctx.stroke();
  } else { ctx.fillStyle = col; ctx.beginPath(); for (const ex of xs) dot(ctx, ex * r, y * r, rad * r); ctx.fill(); }
}
/** Flame tongue sub-path: base centre (x, y), half-width w, height h, tip sway s. */
function flame(ctx, x, y, w, h, s) {
  ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x - w * 0.9, y + h * 0.55, x + s, y + h);
  ctx.quadraticCurveTo(x + w * 0.9, y + h * 0.55, x + w, y); ctx.closePath();
}
/** Two cloth tails streaming back (-x) from a knot at (x, y). */
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
/** Polygon sub-path from [x, y] pairs in head-radius units. */
function poly(ctx, r, pts) {
  ctx.moveTo(pts[0][0] * r, pts[0][1] * r);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0] * r, pts[i][1] * r);
  ctx.closePath();
}

export const HATS_EXTRA = {
  // ================= Act 5 · freezer =================
  frost_beanie(ctx, r) {
    const bob = Math.sin(T() * 3) * 0.03 * r;
    ctx.fillStyle = '#eef6fa'; ctx.beginPath(); dot(ctx, -r * 0.1, r * 1.42 + bob, r * 0.3); ctx.fill();
    ctx.fillStyle = '#cfe6f1'; ctx.beginPath(); dot(ctx, -r * 0.22, r * 1.33 + bob, r * 0.12); dot(ctx, r * 0.06, r * 1.52 + bob, r * 0.09); ctx.fill();
    ctx.fillStyle = '#6fb3d6'; domePath(ctx, r * 1.04, r * 0.28, 0.02); ctx.fill();
    ctx.fillStyle = CREAM; bandPath(ctx, r * 1.04, r * 0.8, r * 0.98, r * 0.28); ctx.fill();
    ctx.fillStyle = '#6fb3d6'; ctx.beginPath();
    for (const x of [-0.6, -0.2, 0.2, 0.6]) { const cx = x * r, cy = r * 0.89, s = r * 0.07; ctx.moveTo(cx, cy - s); ctx.lineTo(cx + s, cy); ctx.lineTo(cx, cy + s); ctx.lineTo(cx - s, cy); ctx.closePath(); }
    ctx.fill();
    ctx.fillStyle = '#4f93b8'; bandPath(ctx, r * 1.1, r * 0.36, r * 0.76); ctx.fill();
    ctx.strokeStyle = '#3f7ea3'; ctx.lineWidth = r * 0.06; ctx.beginPath();
    for (let x = -0.8; x < 0.25; x += 0.2) { ctx.moveTo(x * r, r * 0.45); ctx.lineTo(x * r, r * 0.67); }
    ctx.stroke();
    ctx.strokeStyle = '#eef6fa'; ctx.lineWidth = r * 0.055; ctx.beginPath();
    for (let i = 0; i < 3; i++) { const a = Math.PI / 2 + i * Math.PI / 3, cx = r * 0.6, cy = r * 0.56, L = r * 0.15; ctx.moveTo(cx - Math.cos(a) * L, cy - Math.sin(a) * L); ctx.lineTo(cx + Math.cos(a) * L, cy + Math.sin(a) * L); }
    ctx.stroke();
  },
  ice_hood(ctx, r) {
    // ice shards poking out of the crown
    const shards = [[-0.75, 0.95, 0.24, 0.7, -0.25], [-0.25, 1.15, 0.28, 0.88, -0.08], [0.3, 1.1, 0.22, 0.62, 0.15]];
    ctx.fillStyle = '#7fbfdd'; ctx.beginPath();
    for (const [x, y, w, h, l] of shards) poly(ctx, r, [[x - w, y], [x + l, y + h], [x + w, y]]);
    ctx.fill();
    ctx.fillStyle = '#c4e6f4'; ctx.beginPath();
    for (const [x, y, w, h, l] of shards) poly(ctx, r, [[x - w, y], [x + l, y + h], [x, y]]);
    ctx.fill();
    // fur hood shell with the face opening cut out
    ctx.fillStyle = '#a9c4d3'; ctx.beginPath(); ctx.arc(-r * 0.12, r * 0.1, r * 1.32, 0, TAU);
    ctx.moveTo(r * 1.04, 0); ctx.arc(r * 0.14, 0, r * 0.9, 0, TAU); ctx.fill('evenodd');
    ctx.strokeStyle = '#8eadbf'; ctx.lineWidth = r * 0.07; ctx.beginPath();
    for (const [x, y] of [[-1.05, 0.55], [-1.15, 0.05], [-0.95, -0.5], [-0.7, 1.05]]) { ctx.moveTo(x * r, y * r); ctx.lineTo((x - 0.1) * r, (y - 0.14) * r); }
    ctx.stroke();
    // fluffy trim
    ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = r * 0.24; ctx.beginPath(); ctx.arc(r * 0.14, 0, r * 0.93, 0, TAU); ctx.stroke();
    ctx.fillStyle = '#f4f1ea'; ctx.beginPath();
    for (let a = 0; a < TAU - 0.1; a += 0.42) dot(ctx, r * (0.14 + Math.cos(a) * 0.93), r * Math.sin(a) * 0.93, r * 0.16);
    ctx.fill();
    // icicles on the brow
    ctx.fillStyle = '#a9d8ee'; ctx.beginPath();
    for (const [x, y, l] of [[0.59, 0.66, 0.27], [0.31, 0.78, 0.32], [0.02, 0.8, 0.26]]) poly(ctx, r, [[x - 0.09, y], [x + 0.09, y], [x, y - l]]);
    ctx.fill();
    ctx.fillStyle = '#e6f5fb'; ctx.beginPath();
    for (const [x, y, l] of [[0.59, 0.66, 0.27], [0.31, 0.78, 0.32], [0.02, 0.8, 0.26]]) poly(ctx, r, [[x - 0.09, y], [x, y], [x, y - l]]);
    ctx.fill();
  },
  penguin_hood(ctx, r, f) {
    ctx.fillStyle = '#4a5261'; ctx.beginPath(); dot(ctx, -r * 0.06, r * 0.04, r * 1.1);
    ctx.moveTo(-r * 0.25, r * 1.02); ctx.quadraticCurveTo(-r * 0.15, r * 1.52, r * 0.28, r * 1.46); ctx.quadraticCurveTo(r * 0.02, r * 1.3, r * 0.2, r * 1.06); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#6a7384'; ctx.lineWidth = r * 0.1; ctx.beginPath(); ctx.arc(-r * 0.06, r * 0.04, r * 0.92, 1.75, 2.75); ctx.stroke();
    // cream face patch (two lobes + chin)
    ctx.fillStyle = CREAM; ctx.beginPath();
    ctx.ellipse(r * 0.45, -r * 0.1, r * 0.52, r * 0.52, 0, 0, TAU); dot(ctx, r * 0.26, r * 0.28, r * 0.36); dot(ctx, r * 0.7, r * 0.26, r * 0.28);
    ctx.fill();
    faceEyes(ctx, r, f, INK, 0.11);
    // rosy cheek
    ctx.fillStyle = '#f0b9aa'; ctx.beginPath(); dot(ctx, r * 0.62, -r * 0.12, r * 0.09); ctx.fill();
    // beak visor
    ctx.fillStyle = '#ffa53a'; ctx.beginPath();
    ctx.moveTo(r * 0.3, r * 0.68); ctx.quadraticCurveTo(r * 0.95, r * 0.76, r * 1.52, r * 0.52); ctx.quadraticCurveTo(r * 1.0, r * 0.44, r * 0.4, r * 0.47); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e0842a'; ctx.beginPath();
    ctx.moveTo(r * 0.4, r * 0.47); ctx.quadraticCurveTo(r * 1.0, r * 0.44, r * 1.52, r * 0.52); ctx.quadraticCurveTo(r * 1.0, r * 0.36, r * 0.45, r * 0.4); ctx.closePath(); ctx.fill();
    // bow tie under the chin
    const bx = r * 0.12, by = -r * 1.2;
    ctx.fillStyle = RED; ctx.beginPath();
    ctx.moveTo(bx, by); ctx.lineTo(bx - r * 0.3, by + r * 0.15); ctx.lineTo(bx - r * 0.3, by - r * 0.15); ctx.closePath();
    ctx.moveTo(bx, by); ctx.lineTo(bx + r * 0.3, by + r * 0.15); ctx.lineTo(bx + r * 0.3, by - r * 0.15); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#a8322a'; ctx.beginPath(); dot(ctx, bx, by, r * 0.08); ctx.fill();
  },

  // ================= Act 6 · docks =================
  deck_beanie(ctx, r) {
    ctx.fillStyle = '#c8503a'; ctx.beginPath(); ctx.ellipse(0, r * 0.72, r * 0.96, r * 0.56, 0, 0, Math.PI); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#ad4231'; ctx.lineWidth = r * 0.06; ctx.beginPath();
    for (const x of [-0.6, -0.3, 0, 0.3, 0.6]) { ctx.moveTo(x * r, r * 0.85); ctx.lineTo(x * r * 0.9, r * (1.12 - Math.abs(x) * 0.25)); }
    ctx.stroke();
    ctx.fillStyle = '#a63f2e'; bandPath(ctx, r * 1.08, r * 0.4, r * 0.84); ctx.fill();
    ctx.strokeStyle = '#8f3528'; ctx.lineWidth = r * 0.05; ctx.beginPath(); ctx.moveTo(-r * 0.98, r * 0.62); ctx.lineTo(r * 0.3, r * 0.62); ctx.stroke();
    ctx.fillStyle = CREAM; ctx.beginPath(); ctx.roundRect(r * 0.38, r * 0.5, r * 0.42, r * 0.24, r * 0.04); ctx.fill();
    ctx.strokeStyle = '#2f4a6b'; ctx.lineWidth = r * 0.045; ctx.beginPath();
    ctx.moveTo(r * 0.59, r * 0.7); ctx.lineTo(r * 0.59, r * 0.55); ctx.moveTo(r * 0.5, r * 0.58); ctx.quadraticCurveTo(r * 0.59, r * 0.5, r * 0.68, r * 0.58);
    ctx.moveTo(r * 0.53, r * 0.66); ctx.lineTo(r * 0.65, r * 0.66); ctx.stroke();
  },
  tricorn(ctx, r) {
    // chef's toque puffing out of the crown
    ctx.fillStyle = '#fbfaf6'; ctx.beginPath(); dot(ctx, -r * 0.32, r * 1.42, r * 0.36); dot(ctx, r * 0.06, r * 1.62, r * 0.42); dot(ctx, r * 0.42, r * 1.4, r * 0.32); ctx.fill();
    ctx.strokeStyle = '#dfdace'; ctx.lineWidth = r * 0.06; ctx.beginPath(); ctx.arc(r * 0.06, r * 1.62, r * 0.26, 2.3, 3.2); ctx.stroke();
    ctx.fillStyle = '#2f2a28'; domePath(ctx, r * 0.88, r * 0.55, 0); ctx.fill();
    // crossed spoons emblem
    ctx.strokeStyle = CREAM; ctx.lineWidth = r * 0.07; ctx.beginPath();
    ctx.moveTo(-r * 0.2, r * 0.9); ctx.lineTo(r * 0.2, r * 1.22); ctx.moveTo(r * 0.24, r * 0.9); ctx.lineTo(-r * 0.16, r * 1.22); ctx.stroke();
    ctx.fillStyle = CREAM; ctx.beginPath(); dot(ctx, r * 0.24, r * 1.26, r * 0.08); dot(ctx, -r * 0.2, r * 1.26, r * 0.08); ctx.fill();
    // three-cornered brim
    ctx.fillStyle = '#3a3330'; ctx.beginPath();
    ctx.moveTo(-r * 1.5, r * 1.12); ctx.quadraticCurveTo(-r * 1.05, r * 0.3, 0, r * 0.4); ctx.quadraticCurveTo(r * 1.1, r * 0.3, r * 1.62, r * 1.0);
    ctx.quadraticCurveTo(r * 1.0, r * 0.66, 0, r * 0.74); ctx.quadraticCurveTo(-r * 0.95, r * 0.66, -r * 1.5, r * 1.12); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#e0b04a'; ctx.lineWidth = r * 0.08; ctx.beginPath();
    ctx.moveTo(r * 1.62, r * 1.0); ctx.quadraticCurveTo(r * 1.0, r * 0.66, 0, r * 0.74); ctx.quadraticCurveTo(-r * 0.95, r * 0.66, -r * 1.5, r * 1.12); ctx.stroke();
    ctx.fillStyle = RED; ctx.beginPath(); dot(ctx, r * 0.02, r * 0.74, r * 0.09); ctx.fill();
  },
  dive_helmet(ctx, r, f) {
    const B = '#c8913f', BD = '#9c6c2c', BL = '#e3b565', ga = ctx.globalAlpha;
    ctx.fillStyle = BD; ctx.beginPath();
    ctx.roundRect(-r * 1.62, -r * 0.24, r * 0.46, r * 0.32, r * 0.08); ctx.roundRect(-r * 0.18, r * 1.2, r * 0.36, r * 0.36, r * 0.06);
    ctx.roundRect(-r * 1.25, -r * 1.5, r * 2.5, r * 0.44, r * 0.18); ctx.fill();
    ctx.fillStyle = B; ctx.beginPath(); ctx.roundRect(-r * 0.3, r * 1.52, r * 0.6, r * 0.14, r * 0.07); ctx.fill();
    // brass shell with the front port cut out (the face shows through)
    const px = r * 0.42, py = r * 0.12, pr = r * 0.53;
    ctx.fillStyle = B; ctx.beginPath(); ctx.arc(-r * 0.04, r * 0.06, r * 1.3, 0, TAU); ctx.moveTo(px + pr, py); ctx.arc(px, py, pr, 0, TAU); ctx.fill('evenodd');
    ctx.strokeStyle = BL; ctx.lineWidth = r * 0.12; ctx.beginPath(); ctx.arc(-r * 0.04, r * 0.06, r * 1.08, 1.85, 2.65); ctx.stroke();
    ctx.strokeStyle = BD; ctx.lineWidth = r * 0.15; ctx.beginPath(); ctx.arc(px, py, pr + r * 0.07, 0, TAU); ctx.stroke();
    ctx.fillStyle = BL; ctx.beginPath();
    for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + 0.5; dot(ctx, px + Math.cos(a) * (pr + r * 0.07), py + Math.sin(a) * (pr + r * 0.07), r * 0.045); }
    for (const x of [-0.9, -0.45, 0, 0.45, 0.9]) dot(ctx, x * r, -r * 1.36, r * 0.06);
    ctx.fill();
    // small dark top port
    ctx.fillStyle = BD; ctx.beginPath(); dot(ctx, -r * 0.55, r * 0.72, r * 0.3); ctx.fill();
    ctx.fillStyle = '#2f5763'; ctx.beginPath(); dot(ctx, -r * 0.55, r * 0.72, r * 0.2); ctx.fill();
    // glass tint + glint
    ctx.globalAlpha = ga * 0.26; ctx.fillStyle = '#4fa3b8'; ctx.beginPath(); dot(ctx, px, py, pr); ctx.fill();
    ctx.globalAlpha = ga * 0.75; ctx.strokeStyle = '#eaf6f8'; ctx.lineWidth = r * 0.07; ctx.beginPath(); ctx.arc(px, py, pr * 0.72, 1.95, 2.7); ctx.stroke();
    ctx.beginPath(); ctx.arc(-r * 0.55, r * 0.72, r * 0.12, 2.0, 2.9); ctx.stroke();
    ctx.globalAlpha = ga;
  },

  // ================= Act 7 · volcano =================
  grill_mask(ctx, r, f) {
    ctx.fillStyle = '#3b3f47'; domePath(ctx, r * 1.06, r * 0.28, 0.05); ctx.fill();
    clothTails(ctx, -r * 1.0, r * 0.72, r, r * 0.6, '#b5352a');
    ctx.fillStyle = RED; bandPath(ctx, r * 1.08, r * 0.62, r * 0.82); ctx.fill();
    // steel mask swung down over the face
    ctx.fillStyle = '#5a6069'; ctx.beginPath(); ctx.roundRect(-r * 0.05, -r * 0.84, r * 1.24, r * 1.52, [r * 0.15, r * 0.5, r * 0.45, r * 0.15]); ctx.fill();
    ctx.strokeStyle = '#464b53'; ctx.lineWidth = r * 0.08; ctx.beginPath();
    for (const y of [-0.22, -0.42, -0.62]) { ctx.moveTo(r * 0.12, y * r); ctx.lineTo(r * (1.02 - Math.abs(y + 0.2) * 0.35), y * r); }
    ctx.stroke();
    ctx.fillStyle = '#1c1e24'; ctx.beginPath(); ctx.roundRect(r * 0.12, r * 0.01, r * 0.94, r * 0.35, r * 0.08); ctx.fill();
    if (alive(f)) { ctx.fillStyle = '#ff8a2a'; ctx.beginPath(); dot(ctx, r * 0.3, r * 0.18, r * 0.1); dot(ctx, r * 0.68, r * 0.18, r * 0.1); ctx.fill(); }
    else faceEyes(ctx, r, f, '#7a818b', 0.1);
    ctx.fillStyle = '#7a818b'; ctx.beginPath(); for (const x of [0.49, 0.87]) ctx.rect(x * r - r * 0.03, r * 0.01, r * 0.06, r * 0.35); ctx.fill();
    ctx.fillStyle = CHEESE; ctx.beginPath(); dot(ctx, r * 0.02, r * 0.5, r * 0.1); ctx.fill();
  },
  flame_crown(ctx, r, f) {
    const t = T(), ga = ctx.globalAlpha;
    const tongues = [[-0.72, 0.6, 0.22, 0.75], [-0.36, 0.76, 0.24, 1.02], [0.02, 0.8, 0.26, 1.25], [0.4, 0.76, 0.24, 1.0], [0.74, 0.6, 0.2, 0.72]];
    if (alive(f)) {
      for (const [col, k] of [[RED, 1], ['#ff8a2a', 0.7], [CHEESE, 0.4]]) {
        ctx.fillStyle = col; ctx.beginPath();
        tongues.forEach(([x, y, w, h], i) => {
          const fl = 1 + 0.14 * Math.sin(t * 9 + i * 1.9), sw = Math.sin(t * 6 + i * 2.3) * 0.12 - 0.1;
          flame(ctx, x * r, y * r, w * r * k, h * r * (0.3 + 0.7 * k) * fl, sw * r * k);
        });
        ctx.fill();
      }
      ctx.fillStyle = CHEESE;
      for (let i = 0; i < 3; i++) {
        const p = (t * 0.8 + i / 3) % 1;
        ctx.globalAlpha = ga * (1 - p); ctx.beginPath();
        dot(ctx, (-0.4 + i * 0.4 + Math.sin(t * 3 + i) * 0.12) * r, (1.4 + p * 0.9) * r, r * 0.06); ctx.fill();
      }
      ctx.globalAlpha = ga;
    } else {
      ctx.fillStyle = '#8a8f98';
      for (let i = 0; i < 3; i++) {
        const p = (t * 0.4 + i / 3) % 1;
        ctx.globalAlpha = ga * 0.4 * (1 - p); ctx.beginPath(); dot(ctx, (-0.35 + i * 0.35) * r, (0.9 + p * 0.9) * r, r * (0.14 + p * 0.14)); ctx.fill();
      }
      ctx.globalAlpha = ga;
    }
    ctx.fillStyle = '#7a2a22'; bandPath(ctx, r * 1.08, r * 0.42, r * 0.7); ctx.fill();
    ctx.fillStyle = '#e0b04a'; ctx.beginPath(); for (const x of [-0.75, -0.3, 0.15]) dot(ctx, x * r, r * 0.56, r * 0.06); ctx.fill();
    ctx.fillStyle = CHEESE; ctx.beginPath(); poly(ctx, r, [[0.62, 0.42], [0.8, 0.56], [0.62, 0.72], [0.44, 0.56]]); ctx.fill();
  },
  magma_rock(ctx, r, f) {
    const t = T(), on = alive(f);
    const glow = on ? ((t * 5 | 0) % 3 ? '#ff8a2a' : '#ffb03a') : '#6b4a3e';
    ctx.fillStyle = '#4a3c38'; ctx.beginPath();
    poly(ctx, r, [[-1.08, 0.18], [-1.22, 0.72], [-0.95, 1.12], [-0.62, 1.62], [-0.28, 1.38], [0.05, 1.86], [0.38, 1.42], [0.72, 1.5], [0.9, 1.02], [1.2, 0.72], [1.14, 0.4], [0.62, 0.46], [0.15, 0.4], [-0.3, 0.22], [-0.7, 0.02]]);
    ctx.fill();
    ctx.fillStyle = '#65534b'; ctx.beginPath();
    poly(ctx, r, [[-0.95, 1.12], [-0.62, 1.62], [-0.28, 1.38], [-0.45, 1.0]]);
    poly(ctx, r, [[0.05, 1.86], [0.38, 1.42], [0.1, 1.1]]);
    poly(ctx, r, [[0.72, 1.5], [0.9, 1.02], [1.2, 0.72], [0.7, 0.9]]);
    ctx.fill();
    ctx.fillStyle = '#3a2e2a'; ctx.beginPath(); poly(ctx, r, [[1.2, 0.72], [1.14, 0.4], [0.62, 0.46], [0.15, 0.4], [0.1, 0.58], [0.7, 0.66]]); ctx.fill();
    ctx.strokeStyle = glow; ctx.lineWidth = r * 0.07; ctx.beginPath();
    ctx.moveTo(-r * 0.9, r * 0.4); ctx.lineTo(-r * 0.6, r * 0.7); ctx.lineTo(-r * 0.7, r * 1.02);
    ctx.moveTo(-r * 0.35, r * 0.55); ctx.lineTo(-r * 0.05, r * 0.95); ctx.lineTo(r * 0.05, r * 1.45);
    ctx.moveTo(-r * 0.05, r * 0.95); ctx.lineTo(r * 0.45, r * 1.05); ctx.lineTo(r * 0.62, r * 1.3);
    ctx.moveTo(r * 0.35, r * 0.62); ctx.lineTo(r * 0.8, r * 0.86);
    ctx.stroke();
    if (on) {
      ctx.fillStyle = CHEESE; ctx.beginPath(); dot(ctx, r * 0.3, r * 0.18, r * 0.11); dot(ctx, r * 0.68, r * 0.18, r * 0.11); ctx.fill();
      const p = (t * 0.7) % 1;
      ctx.fillStyle = glow; ctx.beginPath(); dot(ctx, -r * 0.9, r * (0.3 - p * 0.9), r * 0.07 * (1 - p * 0.5)); ctx.fill();
    }
  },

  // ================= Act 8 · sky =================
  monk_hat(ctx, r) {
    const t = T();
    ctx.fillStyle = '#eef3fa'; ctx.beginPath();
    for (const s of [1, -1]) {
      const b = Math.sin(t * 1.6 + s) * 0.05 * r;
      dot(ctx, s * r * 1.62, r * 0.48 + b, r * 0.2); dot(ctx, s * r * 1.36, r * 0.42 + b, r * 0.15); dot(ctx, s * r * 1.86, r * 0.42 + b, r * 0.13);
    }
    ctx.fill();
    ctx.fillStyle = '#e3c27a'; ctx.beginPath();
    ctx.moveTo(-r * 1.8, r * 0.55); ctx.quadraticCurveTo(-r * 0.6, r * 0.95, 0, r * 1.45); ctx.quadraticCurveTo(r * 0.6, r * 0.95, r * 1.8, r * 0.55);
    ctx.quadraticCurveTo(0, r * 0.4, -r * 1.8, r * 0.55); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#c9a45c'; ctx.lineWidth = r * 0.05; ctx.beginPath();
    for (const x of [-1.2, -0.6, 0, 0.6, 1.2]) { ctx.moveTo(0, r * 1.38); ctx.lineTo(x * r, r * (0.49 + Math.abs(x) * 0.03)); }
    ctx.stroke();
    ctx.strokeStyle = '#b8964f'; ctx.lineWidth = r * 0.06; ctx.beginPath(); ctx.moveTo(r * 1.8, r * 0.55); ctx.quadraticCurveTo(0, r * 0.4, -r * 1.8, r * 0.55); ctx.stroke();
    ctx.fillStyle = '#6fa8dc'; ctx.beginPath();
    ctx.moveTo(-r * 0.74, r * 0.72); ctx.quadraticCurveTo(0, r * 0.84, r * 0.74, r * 0.72); ctx.lineTo(r * 0.62, r * 0.9); ctx.quadraticCurveTo(0, r * 1.0, -r * 0.62, r * 0.9); ctx.closePath(); ctx.fill();
    ctx.fillStyle = RED; ctx.beginPath(); dot(ctx, 0, r * 1.46, r * 0.08); ctx.fill();
  },
  winged_helm(ctx, r) {
    const flap = Math.sin(T() * 2.4) * 0.07;
    const wing = (bx, by, k, da, fill, line) => {
      const feathers = [[2.0, 1.05], [2.45, 1.2], [2.9, 0.98]];
      ctx.fillStyle = fill; ctx.beginPath();
      for (const [a0, L0] of feathers) { const a = a0 + da + flap, L = L0 * k * r; ctx.ellipse(bx * r + Math.cos(a) * L * 0.5, by * r + Math.sin(a) * L * 0.5, L * 0.5, r * 0.17 * k, a, 0, TAU); }
      ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = r * 0.04; ctx.beginPath();
      for (const [a0, L0] of feathers) { const a = a0 + da + flap, L = L0 * k * r; ctx.moveTo(bx * r + Math.cos(a) * L * 0.15, by * r + Math.sin(a) * L * 0.15); ctx.lineTo(bx * r + Math.cos(a) * L * 0.85, by * r + Math.sin(a) * L * 0.85); }
      ctx.stroke();
    };
    wing(0.1, 0.95, 0.8, -0.35, '#b7c2cf', '#98a4b2');
    ctx.fillStyle = '#c3ccd6'; ctx.beginPath();
    ctx.arc(0, 0, r * 1.1, 0.34, Math.PI + 1.1); ctx.lineTo(-r * 0.15, -r * 0.35); ctx.lineTo(-r * 0.05, r * 0.36); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#8e98a4'; bandPath(ctx, r * 1.12, r * 0.34, r * 0.5); ctx.fill();
    ctx.beginPath(); ctx.roundRect(r * 0.44, -r * 0.28, r * 0.1, r * 0.7, r * 0.05); ctx.fill();
    ctx.fillStyle = '#e2e7ec'; ctx.beginPath(); for (const x of [-0.7, -0.3, 0.1]) dot(ctx, x * r, r * 0.42, r * 0.05); ctx.fill();
    ctx.strokeStyle = '#6fa8dc'; ctx.lineWidth = r * 0.1; ctx.beginPath(); ctx.arc(0, 0, r * 0.92, 1.2, 2.3); ctx.stroke();
    wing(-0.3, 0.72, 1.0, 0, '#f2eee6', '#c9d3de');
    ctx.fillStyle = '#6fa8dc'; ctx.beginPath(); dot(ctx, r * 0.88, r * 0.42, r * 0.08); ctx.fill();
  },
  cloud_mask(ctx, r) {
    const t = T();
    ctx.fillStyle = '#eef3fa'; ctx.beginPath();
    for (const [dx, dy, s, k] of [[-1.28, 0.5, 0.22, 0], [-1.6, 0.36, 0.17, 1], [-1.9, 0.46, 0.12, 2], [-1.52, 0.72, 0.14, 3]]) dot(ctx, dx * r, (dy + Math.sin(t * 2.5 + k * 1.3) * 0.05) * r, s * r);
    ctx.fill();
    ctx.fillStyle = '#6d7fa6'; bandPath(ctx, r * 1.05, r * 0.36, r * 1.05); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, r * 1.05, Math.PI * 0.5, Math.PI * 1.45); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3f4d6e'; bandPath(ctx, r * 1.08, r * 0.36, r * 0.54); ctx.fill();
    ctx.strokeStyle = '#eef3fa'; ctx.lineWidth = r * 0.045; ctx.beginPath(); ctx.arc(r * 0.72, r * 0.45, r * 0.07, 0, 4.6); ctx.stroke();
    // cloud puffs over the lower face
    const puffs = [[0.22, -0.15, 0.17], [0.55, -0.16, 0.19], [0.9, -0.22, 0.17], [1.02, -0.48, 0.16], [0.75, -0.74, 0.2], [0.3, -0.8, 0.2], [-0.02, -0.55, 0.2]];
    ctx.fillStyle = '#b3c0d8'; ctx.beginPath(); for (const [x, y, s] of puffs) dot(ctx, x * r, (y - 0.06) * r, s * r); ctx.fill();
    ctx.fillStyle = '#eef3fa'; ctx.beginPath();
    ctx.moveTo(-r * 0.05, r * 0.0); ctx.arc(0, 0, r * 1.02, -0.02, -1.2, true); ctx.lineTo(-r * 0.05, -r * 0.7); ctx.closePath();
    for (const [x, y, s] of puffs) dot(ctx, x * r, y * r, s * r);
    ctx.fill();
  },

  // ================= Act 9 · neon =================
  neon_mohawk(ctx, r, f) {
    const t = T(), on = alive(f), ga = ctx.globalAlpha;
    const swap = on && (t * 1.5 | 0) % 2;
    const cols = on ? (swap ? ['#39e6ff', '#ff4fa8'] : ['#ff4fa8', '#39e6ff']) : ['#7a6a74', '#5d7680'];
    const n = 6, A0 = 0.62, SPAN = 2.0, R0 = r * 0.9;
    const spikes = (odd, k) => {
      ctx.beginPath();
      for (let i = odd; i < n; i += 2) {
        const a0 = A0 + (i / n) * SPAN, a1 = A0 + ((i + 1) / n) * SPAN, am = (a0 + a1) / 2 + 0.22;
        const L = r * (1.0 + k * (0.75 + 0.12 * Math.sin(i * 2.1 + 1)));
        ctx.moveTo(Math.cos(a0) * R0, Math.sin(a0) * R0); ctx.lineTo(Math.cos(am) * L, Math.sin(am) * L); ctx.lineTo(Math.cos(a1) * R0, Math.sin(a1) * R0); ctx.closePath();
      }
    };
    for (const odd of [0, 1]) {
      spikes(odd, 1);
      if (on) { ctx.globalAlpha = ga * (0.22 + 0.1 * Math.sin(t * 7 + odd)); ctx.strokeStyle = cols[odd]; ctx.lineWidth = r * 0.28; ctx.stroke(); ctx.globalAlpha = ga; }
      ctx.fillStyle = cols[odd]; ctx.fill();
      if (on) { spikes(odd, 0.45); ctx.fillStyle = '#fff1f8'; ctx.globalAlpha = ga * 0.7; ctx.fill(); ctx.globalAlpha = ga; }
    }
    ctx.fillStyle = '#3b404b'; bandPath(ctx, r * 1.04, r * 0.4, r * 0.54); ctx.fill();
    ctx.strokeStyle = on ? '#39e6ff' : '#5d7680'; ctx.lineWidth = r * 0.06; ctx.beginPath();
    ctx.moveTo(-r * 0.78, r * 0.12); ctx.lineTo(-r * 0.5, r * 0.34); ctx.lineTo(-r * 0.6, r * 0.12); ctx.lineTo(-r * 0.3, r * 0.3); ctx.stroke();
    ctx.fillStyle = on ? '#ff4fa8' : '#7a6a74'; ctx.beginPath(); dot(ctx, -r * 0.2, -r * 0.2, r * 0.07); ctx.fill();
  },
  robo_head(ctx, r, f) {
    const t = T(), on = alive(f);
    ctx.strokeStyle = '#6b7480'; ctx.lineWidth = r * 0.09; ctx.beginPath(); ctx.moveTo(-r * 0.15, r * 0.95); ctx.lineTo(-r * 0.15, r * 1.55); ctx.stroke();
    ctx.fillStyle = '#dfe6ee'; domePath(ctx, r * 0.3, r * 1.6, 0); ctx.fill();
    ctx.fillStyle = '#9aa6b2'; ctx.beginPath(); ctx.roundRect(-r * 0.52, r * 1.54, r * 0.74, r * 0.08, r * 0.04); ctx.fill();
    ctx.fillStyle = on && (t * 2 | 0) % 2 ? RED : '#9aa6b2'; ctx.beginPath(); dot(ctx, -r * 0.15, r * 1.95, r * 0.07); ctx.fill();
    // boxy shell
    ctx.fillStyle = '#9aa6b2'; ctx.beginPath(); ctx.roundRect(-r * 1.12, -r * 0.98, r * 2.26, r * 2.02, r * 0.32); ctx.fill();
    ctx.fillStyle = '#bcc6d0'; ctx.beginPath(); ctx.roundRect(-r * 0.95, r * 0.74, r * 1.9, r * 0.16, r * 0.08); ctx.fill();
    ctx.fillStyle = '#6b7480'; ctx.beginPath(); dot(ctx, -r * 0.55, -r * 0.05, r * 0.28); ctx.fill();
    ctx.fillStyle = '#bcc6d0'; ctx.beginPath(); dot(ctx, -r * 0.55, -r * 0.05, r * 0.13); ctx.fill();
    ctx.fillStyle = '#7d8793'; ctx.beginPath(); for (const [x, y] of [[-0.95, 0.55], [-0.95, -0.8], [0.95, -0.8]]) dot(ctx, x * r, y * r, r * 0.05); ctx.fill();
    // face screen
    ctx.fillStyle = INK; ctx.beginPath(); ctx.roundRect(r * 0.06, -r * 0.52, r * 1.0, r * 1.0, r * 0.18); ctx.fill();
    if (on) {
      const blink = (t % 3.2) < 0.12;
      ctx.fillStyle = '#5ff0ff'; ctx.beginPath();
      for (const x of [0.33, 0.78]) ctx.roundRect((x - 0.11) * r, (blink ? 0.16 : 0.08) * r, r * 0.22, (blink ? 0.04 : 0.2) * r, r * 0.04);
      for (let i = 0; i < 4; i++) ctx.rect(r * (0.3 + i * 0.14), -r * 0.26 + ((t * 6 + i) % 2 < 1 ? 0 : r * 0.04), r * 0.1, r * 0.06);
      ctx.fill();
    } else {
      faceEyes(ctx, r, f, '#6b7480', 0.1, 0.18, [0.33, 0.78]);
      ctx.fillStyle = '#6b7480'; ctx.fillRect(r * 0.3, -r * 0.24, r * 0.52, r * 0.05);
    }
  },
  vr_visor(ctx, r, f) {
    const t = T(), on = alive(f), ga = ctx.globalAlpha;
    ctx.fillStyle = '#3b2f2a'; ctx.beginPath();
    poly(ctx, r, [[-0.9, 0.45], [-0.98, 1.1], [-0.6, 0.98], [-0.42, 1.36], [-0.12, 1.08], [0.18, 1.34], [0.32, 1.02], [0.78, 1.04], [0.95, 0.45]]);
    ctx.fill();
    ctx.fillStyle = '#2d2f3a'; bandPath(ctx, r * 1.06, r * 0.0, r * 0.36); ctx.fill();
    // headphones
    ctx.strokeStyle = '#2d2f3a'; ctx.lineWidth = r * 0.16; ctx.beginPath(); ctx.ellipse(-r * 0.22, r * 0.12, r * 0.3, r * 1.12, 0, 0.05, Math.PI - 0.05); ctx.stroke();
    ctx.fillStyle = RED; ctx.beginPath(); dot(ctx, -r * 0.22, -r * 0.02, r * 0.44); ctx.fill();
    ctx.fillStyle = CHEESE; ctx.beginPath(); dot(ctx, -r * 0.22, -r * 0.02, r * 0.3); ctx.fill();
    ctx.fillStyle = '#2d2f3a'; ctx.beginPath(); dot(ctx, -r * 0.22, -r * 0.02, r * 0.17); ctx.fill();
    // visor
    ctx.fillStyle = '#3a3d4a'; ctx.beginPath(); ctx.roundRect(r * 0.15, -r * 0.14, r * 1.14, r * 0.64, r * 0.14); ctx.fill();
    ctx.fillStyle = RED; ctx.fillRect(r * 0.3, r * 0.42, r * 0.84, r * 0.05);
    ctx.fillStyle = on ? '#123a44' : '#2a2d33'; ctx.beginPath(); ctx.roundRect(r * 0.28, -r * 0.03, r * 0.9, r * 0.42, r * 0.08); ctx.fill();
    if (on) {
      ctx.fillStyle = '#39e6ff'; ctx.beginPath(); ctx.rect(r * 0.43, r * 0.1, r * 0.15, r * 0.16); ctx.rect(r * 0.86, r * 0.1, r * 0.15, r * 0.16); ctx.fill();
      ctx.globalAlpha = ga * 0.45; ctx.fillRect(r * 0.28, -r * 0.03 + ((t * 0.9) % 1) * r * 0.39, r * 0.9, r * 0.035); ctx.globalAlpha = ga;
    } else faceEyes(ctx, r, f, '#ff4fa8', 0.1, 0.18, [0.5, 0.93]);
  },

  // ================= Act 10 · space =================
  space_helmet(ctx, r, f) {
    const t = T(), ga = ctx.globalAlpha, cy = r * 0.2, R = r * 1.45;
    ctx.fillStyle = '#fbfaf6'; ctx.beginPath();
    ctx.roundRect(-r * 0.6, r * 0.58, r * 1.2, r * 0.34, r * 0.08); dot(ctx, -r * 0.32, r * 1.04, r * 0.3); dot(ctx, r * 0.04, r * 1.14, r * 0.33); dot(ctx, r * 0.38, r * 1.02, r * 0.28);
    ctx.fill();
    ctx.strokeStyle = '#dfdace'; ctx.lineWidth = r * 0.05; ctx.beginPath(); for (const x of [-0.3, 0.05, 0.4]) { ctx.moveTo(x * r, r * 0.64); ctx.lineTo(x * r, r * 0.86); } ctx.stroke();
    ctx.globalAlpha = ga * 0.2; ctx.fillStyle = '#8fd0f0'; ctx.beginPath(); dot(ctx, 0, cy, R); ctx.fill();
    ctx.globalAlpha = ga; ctx.strokeStyle = '#dfe6ee'; ctx.lineWidth = r * 0.09; ctx.beginPath(); ctx.arc(0, cy, R, 0, TAU); ctx.stroke();
    ctx.globalAlpha = ga * 0.8; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = r * 0.1; ctx.beginPath(); ctx.arc(0, cy, R * 0.8, 1.95, 2.6); ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); dot(ctx, -r * 1.02, r * 0.55, r * 0.06); ctx.fill();
    ctx.globalAlpha = ga;
    ctx.fillStyle = '#dfe6ee'; ctx.beginPath(); ctx.roundRect(-r * 1.08, -r * 1.52, r * 2.16, r * 0.42, r * 0.16); ctx.fill();
    ctx.fillStyle = RED; ctx.fillRect(-r * 1.08, -r * 1.38, r * 2.16, r * 0.1);
    ctx.fillStyle = alive(f) ? ((t * 1.5 | 0) % 2 ? '#5fd46a' : '#2f7a3a') : '#6d6a66'; ctx.beginPath(); dot(ctx, r * 0.72, -r * 1.24, r * 0.07); ctx.fill();
  },
  alien_antennae(ctx, r, f) {
    const t = T(), dead = f && f.dead;
    // bony crest fins along the skull
    ctx.fillStyle = '#5e9e66'; ctx.beginPath();
    for (const [a, s] of [[1.72, 0.4], [2.2, 0.33], [2.65, 0.25]]) { const x = Math.cos(a) * r * 0.9, y = Math.sin(a) * r * 0.9; ctx.ellipse(x + Math.cos(a) * s * r * 0.45, y + Math.sin(a) * s * r * 0.45, s * r * 0.55, r * 0.13, a - 0.35, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = '#7fbf7a'; ctx.beginPath(); for (const [x, y, s] of [[-0.55, 0.3, 0.09], [-0.78, -0.08, 0.07], [-0.35, 0.58, 0.06], [-0.5, -0.45, 0.06]]) dot(ctx, x * r, y * r, s * r); ctx.fill();
    // angry brow ridges
    ctx.strokeStyle = '#5e9e66'; ctx.lineWidth = r * 0.08; ctx.beginPath();
    ctx.moveTo(r * 0.16, r * 0.44); ctx.lineTo(r * 0.44, r * 0.36); ctx.moveTo(r * 0.56, r * 0.36); ctx.lineTo(r * 0.86, r * 0.46); ctx.stroke();
    const stalk = (bx, by, tx, ty, ph, stem, bulb) => {
      const ex = dead ? tx - 0.7 : tx + Math.sin(t * 3 + ph) * 0.12, ey = dead ? by + 0.25 : ty + Math.cos(t * 3 + ph) * 0.05;
      ctx.strokeStyle = stem; ctx.lineWidth = r * 0.08; ctx.beginPath();
      ctx.moveTo(bx * r, by * r); ctx.quadraticCurveTo((bx + (ex - bx) * 0.15) * r, (by + (ey - by) * 0.9) * r, ex * r, ey * r); ctx.stroke();
      ctx.fillStyle = dead ? '#8a7f88' : bulb; ctx.beginPath(); dot(ctx, ex * r, ey * r, r * 0.15); ctx.fill();
      if (!dead) { ctx.fillStyle = '#ffd0f6'; ctx.beginPath(); dot(ctx, (ex - 0.04) * r, (ey + 0.04) * r, r * 0.05); ctx.fill(); }
    };
    stalk(-0.25, 0.92, -0.62, 1.9, 1.7, '#4f8a58', '#b547ad');
    stalk(0.25, 0.94, 0.72, 1.82, 0, '#6fae6a', '#e05ad8');
  },
  cyborg_eye(ctx, r, f) {
    const t = T(), on = alive(f);
    ctx.fillStyle = '#fbfaf6'; domePath(ctx, r * 1.06, r * 0.36, 0.02); ctx.fill();
    ctx.strokeStyle = '#d9d3c7'; ctx.lineWidth = r * 0.06; ctx.beginPath(); for (const x of [-0.65, -0.3, 0.05]) { ctx.moveTo(x * r, r * 0.66); ctx.lineTo(x * r * 1.05, r * 1.2); } ctx.stroke();
    ctx.fillStyle = RED; ctx.fillRect(-r * 1.04, r * 0.4, r * 2.08, r * 0.17);
    // cable tucked below the eyes
    ctx.strokeStyle = '#4a4f58'; ctx.lineWidth = r * 0.07; ctx.beginPath(); ctx.moveTo(r * 0.52, -r * 0.08); ctx.quadraticCurveTo(r * 0.1, -r * 0.55, -r * 0.55, -r * 0.4); ctx.stroke();
    // metal plate over the front eye
    ctx.fillStyle = '#8e98a4'; ctx.beginPath();
    ctx.moveTo(r * 0.47, r * 0.9); ctx.arc(0, 0, r * 1.07, 1.12, -0.45, true); ctx.lineTo(r * 0.62, -r * 0.3); ctx.lineTo(r * 0.47, -r * 0.1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#6b7480'; ctx.lineWidth = r * 0.05; ctx.stroke();
    ctx.fillStyle = '#c3ccd6'; ctx.beginPath(); for (const [x, y] of [[0.58, 0.74], [0.86, 0.5], [0.62, -0.1], [0.88, -0.22]]) dot(ctx, x * r, y * r, r * 0.045); ctx.fill();
    ctx.fillStyle = INK; ctx.beginPath(); dot(ctx, r * 0.72, r * 0.2, r * 0.21); ctx.fill();
    ctx.fillStyle = on ? ((t * 3 | 0) % 4 ? '#ff3b2f' : '#ff7a5a') : '#4a2a2a'; ctx.beginPath(); dot(ctx, r * 0.72, r * 0.2, r * 0.13); ctx.fill();
    if (on) { ctx.fillStyle = '#ffe0d8'; ctx.beginPath(); dot(ctx, r * 0.68, r * 0.25, r * 0.04); ctx.fill(); }
  },

  // ================= bosses (worn at 1.45–2.1×) =================
  snowball_sam(ctx, r) {
    const t = T(), SN = '#f7fbfd', SH = '#d3e3ec';
    // twig arms on the top snowball
    ctx.strokeStyle = '#6b4a36'; ctx.lineWidth = r * 0.08; ctx.beginPath();
    ctx.moveTo(-r * 0.45, r * 1.7); ctx.lineTo(-r * 1.0, r * 2.2); ctx.moveTo(-r * 0.78, r * 1.95); ctx.lineTo(-r * 0.8, r * 2.3);
    ctx.moveTo(r * 0.25, r * 1.78); ctx.lineTo(r * 0.72, r * 2.22); ctx.moveTo(r * 0.52, r * 2.03); ctx.lineTo(r * 0.82, r * 2.05);
    ctx.stroke();
    ctx.fillStyle = SN; ctx.beginPath(); dot(ctx, -r * 0.1, r * 1.55, r * 0.58); ctx.fill();
    ctx.strokeStyle = SH; ctx.lineWidth = r * 0.12; ctx.beginPath(); ctx.arc(-r * 0.1, r * 1.55, r * 0.44, 3.6, 5.2); ctx.stroke();
    // packed-snow helmet with a face hole
    ctx.fillStyle = SN; ctx.beginPath(); ctx.arc(-r * 0.08, r * 0.12, r * 1.36, 0, TAU);
    ctx.moveTo(r * 1.0, r * 0.04); ctx.arc(r * 0.34, r * 0.04, r * 0.66, 0, TAU); ctx.fill('evenodd');
    ctx.beginPath(); for (const [a, s] of [[1.25, 0.28], [2.2, 0.3], [3.2, 0.26], [4.3, 0.24], [0.5, 0.2]]) dot(ctx, -r * 0.08 + Math.cos(a) * r * 1.3, r * 0.12 + Math.sin(a) * r * 1.3, s * r); ctx.fill();
    ctx.strokeStyle = SH; ctx.lineWidth = r * 0.16; ctx.beginPath(); ctx.arc(-r * 0.08, r * 0.12, r * 1.15, 3.4, 4.9); ctx.stroke();
    ctx.lineWidth = r * 0.1; ctx.beginPath(); ctx.arc(r * 0.34, r * 0.04, r * 0.74, 0.35, 2.6); ctx.stroke();
    // coal brows + mouth, carrot nose
    ctx.fillStyle = INK; ctx.beginPath();
    poly(ctx, r, [[0.12, 0.5], [0.45, 0.42], [0.46, 0.52], [0.14, 0.6]]); poly(ctx, r, [[0.56, 0.42], [0.9, 0.46], [0.88, 0.56], [0.55, 0.52]]);
    for (const [x, y] of [[0.22, -0.4], [0.42, -0.47], [0.62, -0.44], [0.8, -0.3]]) dot(ctx, x * r, y * r, r * 0.065);
    ctx.fill();
    ctx.fillStyle = '#ff8a2a'; ctx.beginPath(); poly(ctx, r, [[0.8, 0.04], [1.66, -0.1], [0.82, -0.22]]); ctx.fill();
    ctx.strokeStyle = '#d96a1a'; ctx.lineWidth = r * 0.04; ctx.beginPath(); ctx.moveTo(r * 1.05, -r * 0.02); ctx.lineTo(r * 1.1, -r * 0.14); ctx.moveTo(r * 1.3, -r * 0.05); ctx.lineTo(r * 1.34, -r * 0.13); ctx.stroke();
    // striped scarf with a flapping tail
    const w = Math.sin(t * 4) * 0.08;
    ctx.fillStyle = RED; ctx.beginPath();
    ctx.moveTo(-r * 0.6, -r * 1.1); ctx.quadraticCurveTo(-r * 1.2, -r * (1.3 + w), -r * 1.55, -r * (1.95 - w * 2)); ctx.lineTo(-r * 1.2, -r * (2.05 - w * 2)); ctx.quadraticCurveTo(-r * 0.9, -r * 1.5, -r * 0.3, -r * 1.3); ctx.closePath();
    ctx.roundRect(-r * 1.05, -r * 1.44, r * 2.1, r * 0.4, r * 0.2); ctx.fill();
    ctx.fillStyle = CREAM; ctx.beginPath(); for (const x of [-0.55, 0.05, 0.62]) ctx.rect(x * r, -r * 1.44, r * 0.16, r * 0.4); ctx.fill();
  },
  brain_freeze(ctx, r, f) {
    const t = T(), ga = ctx.globalAlpha, on = alive(f);
    // ice spikes behind the scoop
    const spikes = [[-1.05, 0.95, -0.25], [-0.62, 1.25, -0.1], [0.68, 1.2, 0.1], [1.08, 0.9, 0.25]];
    ctx.fillStyle = '#8cc7e3'; ctx.beginPath(); for (const [x, h, l] of spikes) poly(ctx, r, [[x - 0.2, 1.0], [x + l, 1.0 + h], [x + 0.2, 1.0]]); ctx.fill();
    ctx.fillStyle = '#d4f0fa'; ctx.beginPath(); for (const [x, h, l] of spikes) poly(ctx, r, [[x, 1.0], [x + l, 1.0 + h], [x + 0.2, 1.0]]); ctx.fill();
    // upside-down waffle cone
    ctx.fillStyle = '#d9a45a'; ctx.beginPath(); poly(ctx, r, [[-0.6, 1.4], [-0.1, 2.5], [0.5, 1.4]]); ctx.fill();
    ctx.strokeStyle = '#b8843f'; ctx.lineWidth = r * 0.06; ctx.beginPath();
    for (const k of [0.2, 0.45, 0.7]) {
      const bx = (-0.6 + 1.1 * k) * r, by = r * 1.4;
      ctx.moveTo(bx, by); ctx.lineTo((0.5 - 0.6 * (1 - k)) * r, (1.4 + 1.1 * (1 - k)) * r);
      ctx.moveTo(bx, by); ctx.lineTo((-0.6 + 0.5 * k) * r, (1.4 + 1.1 * k) * r);
    }
    ctx.stroke();
    // the scoop, dripping over the brow
    const SC = '#f4b6c8', SD = '#e38fab';
    ctx.fillStyle = SC; ctx.beginPath();
    dot(ctx, -r * 0.55, r * 1.1, r * 0.62); dot(ctx, r * 0.2, r * 1.2, r * 0.68); dot(ctx, r * 0.8, r * 0.88, r * 0.46); dot(ctx, -r * 1.0, r * 0.66, r * 0.42);
    ctx.fill();
    domePath(ctx, r * 1.12, r * 0.42, 0.05); ctx.fill();
    const grow = 0.08 * Math.sin(t * 1.3);
    ctx.beginPath(); ctx.moveTo(-r * 1.12, r * 0.48);
    for (const [x, y] of [[-0.8, 0.0], [-0.35, -0.3 - grow], [0.05, 0.3], [0.95, 0.05 + grow]]) {
      ctx.lineTo((x - 0.12) * r, r * 0.45); ctx.quadraticCurveTo((x - 0.13) * r, y * r, x * r, y * r); ctx.quadraticCurveTo((x + 0.13) * r, y * r, (x + 0.12) * r, r * 0.45);
    }
    ctx.lineTo(r * 1.12, r * 0.48); ctx.lineTo(r * 1.12, r * 0.8); ctx.lineTo(-r * 1.12, r * 0.8); ctx.closePath(); ctx.fill();
    const p = (t * 0.6) % 1;
    ctx.globalAlpha = ga * (1 - p); ctx.beginPath(); dot(ctx, -r * 0.35, -r * (0.45 + p * 1.1), r * 0.08); ctx.fill(); ctx.globalAlpha = ga;
    ctx.strokeStyle = SD; ctx.lineWidth = r * 0.1; ctx.beginPath(); ctx.arc(r * 0.2, r * 1.2, r * 0.5, 3.6, 4.5); ctx.moveTo(-r * 0.9, r * 1.1); ctx.arc(-r * 0.55, r * 1.1, r * 0.35, Math.PI, 3.9); ctx.stroke();
    // sprinkles
    ctx.lineWidth = r * 0.07;
    for (const [col, pts] of [[CHEESE, [[-0.6, 1.3, 0.5], [0.45, 1.05, -0.8]]], ['#39a0ff', [[0.05, 1.5, -0.3], [-0.9, 0.8, 1.0]]], [RED, [[0.35, 1.45, 1.2], [-0.2, 0.95, 0.2]]]]) {
      ctx.strokeStyle = col; ctx.beginPath();
      for (const [x, y, a] of pts) { ctx.moveTo((x - Math.cos(a) * 0.08) * r, (y - Math.sin(a) * 0.08) * r); ctx.lineTo((x + Math.cos(a) * 0.08) * r, (y + Math.sin(a) * 0.08) * r); }
      ctx.stroke();
    }
    // frosty glints in the eyes + twinkle
    if (on) {
      ctx.fillStyle = '#bff4ff'; ctx.beginPath(); dot(ctx, r * 0.33, r * 0.22, r * 0.045); dot(ctx, r * 0.71, r * 0.22, r * 0.045); ctx.fill();
      const tw = Math.max(0, Math.sin(t * 3)) * 0.14 * r;
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(r * 0.6, r * 1.62 + tw); ctx.lineTo(r * 0.63, r * 1.62); ctx.lineTo(r * 0.6, r * 1.62 - tw); ctx.lineTo(r * 0.57, r * 1.62); ctx.closePath(); ctx.fill();
    }
  },
  captain_anchovy(ctx, r) {
    // salt-and-pepper beard (sideburns tuck under the cap)
    ctx.fillStyle = '#b9b3aa'; ctx.beginPath();
    ctx.moveTo(r * 0.08, r * 0.5); ctx.lineTo(-r * 0.4, r * 0.45); ctx.quadraticCurveTo(-r * 1.0, -r * 0.45, -r * 0.2, -r * 1.08);
    ctx.quadraticCurveTo(r * 0.2, -r * 1.55, r * 0.45, -r * 1.3); ctx.quadraticCurveTo(r * 0.95, -r * 1.25, r * 1.08, -r * 0.55);
    ctx.quadraticCurveTo(r * 1.1, -r * 0.2, r * 0.85, -r * 0.28); ctx.lineTo(r * 0.3, -r * 0.2); ctx.quadraticCurveTo(r * 0.06, -r * 0.05, r * 0.08, r * 0.5); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#9a948b'; ctx.lineWidth = r * 0.06; ctx.beginPath();
    ctx.moveTo(-r * 0.3, -r * 0.1); ctx.quadraticCurveTo(-r * 0.35, -r * 0.7, 0, -r * 1.0);
    ctx.moveTo(r * 0.25, -r * 0.5); ctx.quadraticCurveTo(r * 0.3, -r * 0.95, r * 0.42, -r * 1.15);
    ctx.moveTo(r * 0.75, -r * 0.5); ctx.quadraticCurveTo(r * 0.8, -r * 0.85, r * 0.65, -r * 1.05); ctx.stroke();
    ctx.fillStyle = '#8c867d'; ctx.beginPath();
    ctx.ellipse(r * 0.6, -r * 0.22, r * 0.32, r * 0.12, -0.15, 0, TAU); ctx.ellipse(r * 1.0, -r * 0.18, r * 0.16, r * 0.09, 0.7, 0, TAU); ctx.fill();
    // captain's cap
    ctx.fillStyle = '#2f4a6b'; ctx.beginPath(); poly(ctx, r, [[-1.02, 0.5], [-1.22, 1.2], [1.12, 1.26], [0.98, 0.5]]); ctx.fill();
    ctx.fillStyle = CREAM; ctx.beginPath(); ctx.ellipse(-r * 0.05, r * 1.3, r * 1.3, r * 0.2, 0.03, 0, TAU); ctx.fill();
    ctx.fillStyle = '#23304a'; ctx.fillRect(-r * 1.03, r * 0.5, r * 2.02, r * 0.22);
    ctx.strokeStyle = '#e0b04a'; ctx.lineWidth = r * 0.06; ctx.beginPath(); ctx.moveTo(-r * 1.0, r * 0.61); ctx.lineTo(r * 0.98, r * 0.61); ctx.stroke();
    // emblem: gold wreath around a silver anchovy
    ctx.lineWidth = r * 0.07; ctx.beginPath(); ctx.arc(r * 0.2, r * 0.92, r * 0.22, 2.3, 4.2); ctx.moveTo(r * 0.2 + Math.cos(5.2) * r * 0.22, r * 0.92 + Math.sin(5.2) * r * 0.22); ctx.arc(r * 0.2, r * 0.92, r * 0.22, 5.2, 7.1); ctx.stroke();
    ctx.fillStyle = '#c9d6e2'; ctx.beginPath(); ctx.ellipse(r * 0.24, r * 0.92, r * 0.18, r * 0.07, 0, 0, TAU); poly(ctx, r, [[0.07, 0.92], [-0.04, 1.02], [-0.04, 0.82]]); ctx.fill();
    ctx.fillStyle = INK; ctx.beginPath(); dot(ctx, r * 0.35, r * 0.94, r * 0.025); ctx.fill();
    // glossy visor
    ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(r * 0.25, r * 0.62); ctx.quadraticCurveTo(r * 1.1, r * 0.66, r * 1.62, r * 0.4); ctx.quadraticCurveTo(r * 1.0, r * 0.36, r * 0.2, r * 0.46); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#4a5068'; ctx.lineWidth = r * 0.05; ctx.beginPath(); ctx.moveTo(r * 0.6, r * 0.58); ctx.quadraticCurveTo(r * 1.05, r * 0.58, r * 1.35, r * 0.46); ctx.stroke();
  },
  calamari_king(ctx, r, f) {
    const t = T(), dead = f && f.dead, M = '#b2497f', ML = '#e28ab8', MD = '#8e3666';
    const tent = (x0, y0, a0, len, curl, w, ph, col) => {
      const N = 14, step = len * r / N, sway = dead ? 0 : Math.sin(t * 1.8 + ph) * 0.5, c = dead ? curl * 0.3 : curl;
      let x = x0 * r, y = y0 * r, a = a0; const suck = [];
      ctx.fillStyle = col; ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const s = i / N, rad = w * r * (1 - s * 0.75);
        dot(ctx, x, y, rad); if (i % 3 === 1) suck.push([x, y, rad]);
        a += (c * (0.3 + 1.7 * s) + sway) / N; x += Math.cos(a) * step; y += Math.sin(a) * step;
      }
      ctx.fill();
      ctx.fillStyle = ML; ctx.beginPath(); for (const [sx, sy, sr] of suck) dot(ctx, sx, sy, sr * 0.3); ctx.fill();
    };
    tent(-0.8, 0.2, -2.0, 2.0, -3.2, 0.2, 0, MD);
    tent(-0.95, 0.7, 2.4, 1.6, 3.0, 0.17, 1.3, MD);
    tent(-0.3, 0.45, -1.75, 1.7, -2.6, 0.17, 0.7, M);
    // mantle crown with arrowhead fins
    ctx.fillStyle = M; ctx.beginPath();
    ctx.moveTo(-r * 1.0, r * 0.55); ctx.quadraticCurveTo(-r * 0.95, r * 1.8, -r * 0.2, r * 2.5); ctx.quadraticCurveTo(r * 0.75, r * 1.8, r * 0.98, r * 0.55); ctx.closePath();
    poly(ctx, r, [[-0.81, 1.56], [-1.3, 1.98], [-0.47, 2.2]]); poly(ctx, r, [[0.15, 2.2], [1.02, 1.98], [0.63, 1.56]]);
    ctx.fill();
    ctx.fillStyle = MD; ctx.beginPath(); poly(ctx, r, [[-0.81, 1.56], [-1.3, 1.98], [-0.7, 1.78]]); poly(ctx, r, [[0.63, 1.56], [1.02, 1.98], [0.45, 1.8]]); ctx.fill();
    ctx.fillStyle = ML; ctx.beginPath();
    for (const [x, y, s] of [[-0.5, 1.2, 0.12], [0.1, 1.0, 0.1], [0.4, 1.35, 0.09], [-0.2, 1.7, 0.1], [-0.35, 0.95, 0.07], [0.02, 2.1, 0.06]]) dot(ctx, x * r, y * r, s * r);
    ctx.fill();
    // gold crown ring
    ctx.fillStyle = '#e0b04a'; bandPath(ctx, r * 1.1, r * 0.42, r * 0.74); ctx.fill();
    ctx.beginPath(); for (const x of [-0.7, -0.35, 0, 0.35, 0.7]) poly(ctx, r, [[x - 0.13, 0.7], [x, 0.98], [x + 0.13, 0.7]]); ctx.fill();
    ctx.fillStyle = '#f4f1ea'; ctx.beginPath(); for (const x of [-0.7, -0.35, 0, 0.35, 0.7]) dot(ctx, x * r, r * 0.58, r * 0.065); ctx.fill();
    // front curl like a crown volute
    tent(0.82, 0.62, 0.9, 1.1, 3.6, 0.15, 2.1, M);
  },
  hot_sauce(ctx, r, f) {
    const t = T(), on = alive(f), ga = ctx.globalAlpha, BR = '#c7301f', BD = '#9e2418';
    if (on) {
      for (const [col, k] of [[RED, 1], ['#ff8a2a', 0.7], [CHEESE, 0.4]]) {
        ctx.fillStyle = col; ctx.beginPath();
        [[-0.78, 0.8, 0.26, 0.8], [-0.45, 0.95, 0.2, 0.55], [0.72, 0.85, 0.24, 0.7]].forEach(([x, y, w, h], i) => {
          flame(ctx, x * r, y * r, w * r * k, h * r * (0.35 + 0.65 * k) * (1 + 0.15 * Math.sin(t * 10 + i * 2)), (Math.sin(t * 7 + i) * 0.1 - 0.08) * r * k);
        });
        ctx.fill();
      }
    }
    ctx.fillStyle = BD; ctx.beginPath(); ctx.roundRect(-r * 0.34, r * 0.9, r * 0.68, r * 0.8, r * 0.1); ctx.fill();
    ctx.fillStyle = '#3f8a4a'; ctx.beginPath(); ctx.roundRect(-r * 0.44, r * 1.62, r * 0.88, r * 0.42, r * 0.1); ctx.fill();
    ctx.strokeStyle = '#2f6a38'; ctx.lineWidth = r * 0.05; ctx.beginPath(); for (const x of [-0.25, -0.08, 0.09, 0.26]) { ctx.moveTo(x * r, r * 1.7); ctx.lineTo(x * r, r * 1.96); } ctx.stroke();
    // bottle body with a window for the face
    ctx.fillStyle = BR; ctx.beginPath(); ctx.roundRect(-r * 1.12, -r * 1.0, r * 2.24, r * 2.1, r * 0.55); ctx.roundRect(r * 0.1, -r * 0.36, r * 0.86, r * 0.8, r * 0.3); ctx.fill('evenodd');
    ctx.strokeStyle = BD; ctx.lineWidth = r * 0.08; ctx.beginPath(); ctx.roundRect(r * 0.06, -r * 0.4, r * 0.94, r * 0.88, r * 0.33); ctx.stroke();
    ctx.globalAlpha = ga * 0.35; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = r * 0.12; ctx.beginPath(); ctx.moveTo(-r * 0.85, -r * 0.55); ctx.lineTo(-r * 0.85, r * 0.3); ctx.stroke(); ctx.globalAlpha = ga;
    // label
    ctx.fillStyle = CREAM; ctx.beginPath(); ctx.roundRect(-r * 1.12, r * 0.52, r * 2.24, r * 0.36, r * 0.06); ctx.fill();
    ctx.fillStyle = BR; ctx.beginPath(); ctx.ellipse(-r * 0.5, r * 0.7, r * 0.26, r * 0.09, -0.35, 0, TAU);
    for (const x of [0.2, 0.45, 0.7]) flame(ctx, x * r, r * 0.6, r * 0.07, r * 0.2, 0);
    ctx.fill();
    ctx.fillStyle = '#3f8a4a'; ctx.beginPath(); dot(ctx, -r * 0.24, r * 0.8, r * 0.06); ctx.fill();
    // angry brows inside the window
    ctx.strokeStyle = INK; ctx.lineWidth = r * 0.09; ctx.beginPath(); ctx.moveTo(r * 0.16, r * 0.4); ctx.lineTo(r * 0.43, r * 0.33); ctx.moveTo(r * 0.56, r * 0.33); ctx.lineTo(r * 0.86, r * 0.39); ctx.stroke();
    // sauce drip down the back
    const p = (t * 0.5) % 1;
    ctx.fillStyle = BD; ctx.beginPath(); ctx.roundRect(-r * 1.14, r * 0.2 - r * (0.3 + p * 0.5), r * 0.16, r * (0.4 + p * 0.5), r * 0.08); ctx.fill();
    ctx.globalAlpha = ga * (1 - p); ctx.fillStyle = BR; ctx.beginPath(); dot(ctx, -r * 0.6, -r * (1.1 + p * 0.8), r * 0.09); ctx.fill(); ctx.globalAlpha = ga;
  },
  chili_colossus(ctx, r, f) {
    const t = T(), on = alive(f), ga = ctx.globalAlpha, CR = '#c7301f', CD = '#9e2418', CL = '#ef6a50';
    // curly stem at the back
    ctx.strokeStyle = '#2f6a38'; ctx.lineWidth = r * 0.2; ctx.beginPath();
    ctx.moveTo(-r * 1.1, r * 0.35); ctx.quadraticCurveTo(-r * 1.7, r * 0.5, -r * 1.75, r * 1.1); ctx.quadraticCurveTo(-r * 1.75, r * 1.55, -r * 1.4, r * 1.5); ctx.stroke();
    // pepper body sweeping up into a horn
    ctx.fillStyle = CR; ctx.beginPath();
    ctx.moveTo(-r * 1.15, -r * 0.7); ctx.quadraticCurveTo(-r * 1.45, r * 0.9, -r * 0.4, r * 1.35);
    ctx.bezierCurveTo(r * 0.45, r * 1.7, r * 1.05, r * 1.8, r * 1.5, r * 2.45);
    ctx.bezierCurveTo(r * 1.4, r * 1.55, r * 1.3, r * 1.0, r * 1.22, r * 0.3);
    ctx.lineTo(r * 1.12, -r * 0.75); ctx.quadraticCurveTo(0, -r * 1.3, -r * 1.15, -r * 0.7); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = CL; ctx.lineWidth = r * 0.14; ctx.beginPath(); ctx.moveTo(-r * 0.95, r * 0.4); ctx.quadraticCurveTo(-r * 0.9, r * 1.1, -r * 0.2, r * 1.3);
    ctx.moveTo(r * 0.6, r * 1.72); ctx.quadraticCurveTo(r * 1.0, r * 1.85, r * 1.3, r * 2.15); ctx.stroke();
    ctx.strokeStyle = CD; ctx.lineWidth = r * 0.06; ctx.beginPath(); ctx.moveTo(-r * 0.5, -r * 0.9); ctx.quadraticCurveTo(-r * 0.95, r * 0.2, -r * 0.55, r * 0.95); ctx.stroke();
    // leafy calyx
    ctx.fillStyle = '#3f8a4a'; ctx.beginPath();
    poly(ctx, r, [[-1.2, 0.78], [-0.5, 0.98], [-0.8, 0.5]]); poly(ctx, r, [[-1.25, 0.15], [-0.5, 0.32], [-0.85, -0.08]]); poly(ctx, r, [[-1.22, -0.3], [-0.7, -0.55], [-1.02, -0.62]]);
    ctx.fill();
    // visor + vents
    ctx.fillStyle = INK; ctx.beginPath(); ctx.roundRect(0, -r * 0.06, r * 1.34, r * 0.46, r * 0.16); ctx.fill();
    if (on) { ctx.fillStyle = (t * 9 | 0) % 3 ? '#ffb03a' : CHEESE; ctx.beginPath(); dot(ctx, r * 0.3, r * 0.18, r * 0.11); dot(ctx, r * 0.68, r * 0.18, r * 0.11); ctx.fill(); }
    else faceEyes(ctx, r, f, '#6b4a3e', 0.1);
    ctx.fillStyle = '#5e1a12'; ctx.beginPath(); for (const y of [-0.42, -0.62]) ctx.roundRect(r * 0.35, y * r, r * 0.72, r * 0.09, r * 0.045); ctx.fill();
    // steam
    if (on) {
      ctx.fillStyle = '#e8e4dc';
      for (let i = 0; i < 4; i++) {
        const p = (t * 0.55 + i / 4) % 1, tip = i % 2 === 1;
        ctx.globalAlpha = ga * 0.5 * (1 - p); ctx.beginPath();
        dot(ctx, ((tip ? 1.45 : -0.6) - p * 0.5 + Math.sin(t * 2 + i) * 0.1) * r, ((tip ? 2.3 : 1.3) + p * (tip ? 0.35 : 0.7)) * r, (0.12 + p * 0.22) * r); ctx.fill();
      }
      ctx.globalAlpha = ga;
    }
  },
  windbag(ctx, r, f) {
    const t = T(), on = alive(f), ga = ctx.globalAlpha;
    // striped windsock streaming back
    for (let i = 0; i < 5; i++) {
      const P = (s) => [-0.5 - s * 1.8, 1.25 + s * 0.2 + Math.sin(t * 5 - s * 4) * 0.18 * s, 0.32 * (1 - s * 0.55)];
      const [x0, y0, w0] = P(i / 5), [x1, y1, w1] = P((i + 1) / 5);
      ctx.fillStyle = i % 2 ? CREAM : RED; ctx.beginPath(); poly(ctx, r, [[x0, y0 + w0], [x1, y1 + w1], [x1, y1 - w1], [x0, y0 - w0]]); ctx.fill();
    }
    // cloud hood
    const puffs = [[-0.95, 0.3, 0.5], [-0.75, 0.95, 0.55], [-0.1, 1.25, 0.6], [0.55, 1.05, 0.5], [1.0, 0.7, 0.34], [-1.2, -0.3, 0.4], [-0.9, -0.85, 0.34], [0.1, 0.82, 0.44]];
    ctx.fillStyle = '#b4c2d1'; ctx.beginPath(); for (const [x, y, s] of puffs) dot(ctx, x * r, (y - 0.08) * r, s * r); ctx.fill();
    ctx.fillStyle = '#dfe7ef'; ctx.beginPath(); for (const [x, y, s] of puffs) dot(ctx, x * r, y * r, s * r); ctx.fill();
    ctx.strokeStyle = '#8fa3b8'; ctx.lineWidth = r * 0.07; ctx.beginPath();
    ctx.moveTo(-r * 0.15, r * 0.9); ctx.arc(-r * 0.4, r * 0.9, r * 0.25, 0, 4.5); ctx.moveTo(r * 0.63, r * 1.15); ctx.arc(r * 0.45, r * 1.15, r * 0.18, 0, 4.5); ctx.stroke();
    // puffed cheeks + pursed lips
    ctx.fillStyle = '#f2c4c4'; ctx.beginPath(); dot(ctx, r * 0.6, -r * 0.32, r * 0.34); ctx.fill();
    ctx.fillStyle = '#f9dede'; ctx.beginPath(); dot(ctx, r * 0.52, -r * 0.22, r * 0.12); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = r * 0.07; ctx.beginPath(); ctx.arc(r * 0.98, -r * 0.3, r * 0.09, 0, TAU);
    ctx.moveTo(r * 0.15, r * 0.42); ctx.lineTo(r * 0.45, r * 0.36); ctx.moveTo(r * 0.55, r * 0.36); ctx.lineTo(r * 0.85, r * 0.43); ctx.stroke();
    if (on) {
      ctx.strokeStyle = '#dfe7ef'; ctx.lineWidth = r * 0.06;
      for (let i = 0; i < 3; i++) {
        const p = (t * 1.5 + i / 3) % 1, x = r * (1.15 + p * 1.1), y = r * (-0.3 + (i - 1) * 0.22 * p);
        ctx.globalAlpha = ga * (1 - p); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + r * 0.35, y); ctx.stroke();
      }
      ctx.globalAlpha = ga;
    }
  },
  thunder_crust(ctx, r, f) {
    const t = T(), on = alive(f), tick = (t * 8) | 0, flash = on && hash(tick) > 0.72;
    ctx.fillStyle = '#4f586b'; ctx.beginPath();
    for (const [x, y, s] of [[-1.1, 1.0, 0.45], [-0.6, 1.45, 0.5], [0.1, 1.6, 0.45], [0.75, 1.35, 0.4], [-1.35, 0.45, 0.36]]) dot(ctx, x * r, y * r, s * r);
    ctx.fill();
    // lightning bolts as crown spikes
    const bolt = (x, s, l) => poly(ctx, r, [[x - 0.14 * s, 0.8], [x + 0.22 * s + l * 0.3, 0.8 + 0.7 * s], [x + 0.06 * s + l * 0.3, 0.8 + 0.68 * s], [x + 0.18 * s + l, 0.8 + 1.5 * s], [x - 0.26 * s + l * 0.4, 0.8 + 0.58 * s], [x - 0.08 * s + l * 0.4, 0.8 + 0.6 * s], [x - 0.3 * s, 0.8]]);
    ctx.fillStyle = flash ? '#fffbe6' : CHEESE; ctx.beginPath(); bolt(-0.62, 0.62, -0.15); bolt(0.02, 1.0, 0.05); bolt(0.64, 0.62, 0.15); ctx.fill();
    // crust band
    ctx.fillStyle = '#d9a85a'; bandPath(ctx, r * 1.12, r * 0.4, r * 0.9); ctx.fill();
    ctx.beginPath(); for (const x of [-0.72, -0.36, 0, 0.36, 0.72]) dot(ctx, x * r, r * 0.9, r * 0.2); ctx.fill();
    ctx.fillStyle = '#b8843f'; ctx.beginPath();
    for (const [x, y, s] of [[-0.6, 0.6, 0.08], [-0.2, 0.75, 0.06], [0.25, 0.55, 0.07], [-0.9, 0.5, 0.05], [0.4, 0.95, 0.05], [-0.45, 1.0, 0.05]]) dot(ctx, x * r, y * r, s * r);
    ctx.fill();
    ctx.fillStyle = '#6fa8dc'; ctx.beginPath(); poly(ctx, r, [[0.66, 0.5], [0.8, 0.65], [0.66, 0.8], [0.52, 0.65]]); ctx.fill();
    if (on) {
      // crackle sparks
      ctx.strokeStyle = flash ? '#ffffff' : CHEESE; ctx.lineWidth = r * 0.05; ctx.beginPath();
      for (let k = 0; k < 3; k++) {
        if (hash(tick * 3 + k * 7) < 0.45) continue;
        const a = hash(tick + k * 13) * Math.PI + 0.1, cx = Math.cos(a) * 1.45, cy = 0.6 + Math.sin(a) * 1.3;
        ctx.moveTo(cx * r, cy * r); ctx.lineTo((cx + 0.15) * r, (cy + 0.12) * r); ctx.lineTo((cx + 0.05) * r, (cy + 0.2) * r); ctx.lineTo((cx + 0.22) * r, (cy + 0.34) * r);
      }
      ctx.stroke();
      if (flash) { ctx.fillStyle = '#fff6c8'; ctx.beginPath(); dot(ctx, r * 0.3, r * 0.18, r * 0.07); dot(ctx, r * 0.68, r * 0.18, r * 0.07); ctx.fill(); }
    }
  },
  glitch(ctx, r, f) {
    const t = T(), on = alive(f), ga = ctx.globalAlpha;
    const tick = (t * 12) | 0, h1 = hash(tick), h2 = hash(tick + 17), big = on && hash((t * 3) | 0) > 0.75;
    const ox = big ? (h1 - 0.5) * 0.35 : 0;
    const cube = [[-1.1, -0.8], [-0.9, -0.8], [-0.9, -1.0], [0.9, -1.0], [0.9, -0.8], [1.1, -0.8], [1.1, 0.7], [0.9, 0.7], [0.9, 1.1], [0.3, 1.1], [0.3, 1.3], [0.1, 1.3], [0.1, 1.1], [-0.5, 1.1], [-0.5, 0.9], [-0.9, 0.9], [-0.9, 0.7], [-1.1, 0.7]];
    const at = (dx, pts) => pts.map(([x, y]) => [x + dx, y]);
    if (on && (big || h1 > 0.6)) {
      ctx.globalAlpha = ga * 0.6;
      ctx.fillStyle = '#ff4fa8'; ctx.beginPath(); poly(ctx, r, at(ox - 0.12, cube)); ctx.fill();
      ctx.fillStyle = '#39e6ff'; ctx.beginPath(); poly(ctx, r, at(ox + 0.12, cube)); ctx.fill();
      ctx.globalAlpha = ga;
    }
    ctx.fillStyle = '#3a3552'; ctx.beginPath(); poly(ctx, r, at(ox, cube)); ctx.fill();
    ctx.fillStyle = '#5a5280'; ctx.beginPath(); ctx.rect((ox + 0.1) * r, r * 0.9, r * 0.8, r * 0.2); ctx.rect((ox - 0.9) * r, r * 0.7, r * 0.4, r * 0.2); ctx.rect((ox - 1.1) * r, -r * 0.8, r * 0.2, r * 1.5); ctx.fill();
    ctx.fillStyle = '#15131f'; ctx.beginPath(); ctx.rect((ox + 0.05) * r, -r * 0.5, r * 1.0, r * 0.9); ctx.fill();
    if (on) {
      const mad = h2 > 0.85;
      ctx.fillStyle = mad ? '#ff4fa8' : '#39e6ff'; ctx.beginPath();
      for (const x of [0.3, 0.7]) ctx.rect((ox + x - 0.09) * r, r * (mad ? 0.1 : 0.09), r * 0.18, r * (mad ? 0.1 : 0.18));
      for (const [x, y] of [[0.3, -0.22], [0.42, -0.3], [0.54, -0.3], [0.66, -0.3], [0.78, -0.22]]) ctx.rect((ox + x - 0.06) * r, y * r, r * 0.12, r * 0.08);
      ctx.fill();
      // colour slices
      if (h1 > 0.45) {
        ctx.globalAlpha = ga * 0.65;
        ctx.fillStyle = '#39e6ff'; ctx.fillRect((ox - 1.1 + (h2 - 0.5) * 0.6) * r, (-0.9 + h2 * 1.9) * r, r * 2.2, r * 0.12);
        ctx.fillStyle = '#ff4fa8'; ctx.fillRect((ox - 1.1 - (h1 - 0.5) * 0.6) * r, (-0.9 + h1 * 1.9) * r, r * 2.2, r * 0.09);
        ctx.globalAlpha = ga;
      }
      // pixels drifting off
      for (let i = 0; i < 4; i++) {
        const p = (t * 0.7 + i / 4) % 1, s = 0.14 * (1 - p * 0.5);
        ctx.globalAlpha = ga * (1 - p); ctx.fillStyle = i % 2 ? '#39e6ff' : '#ff4fa8';
        ctx.fillRect((-0.8 + i * 0.5 + hash(i) * 0.2) * r, (1.2 + p * 1.1) * r, s * r, s * r);
      }
      ctx.globalAlpha = ga;
    } else faceEyes(ctx, r, f, '#5a5280', 0.1, 0.18, [0.3, 0.7]);
  },
  mecha_mozza(ctx, r, f) {
    const t = T(), on = alive(f), S = '#8e98a4', SD = '#6b7480', SL = '#b9c3cd', MOZZ = '#fbf3d6';
    ctx.fillStyle = SD; ctx.beginPath();
    poly(ctx, r, [[-0.7, 1.2], [-1.35, 2.05], [-1.05, 2.12], [-0.25, 1.35]]); poly(ctx, r, [[-0.1, 1.35], [-0.35, 2.3], [-0.05, 2.32], [0.42, 1.4]]);
    ctx.roundRect(-r * 1.85, -r * 0.15, r * 0.65, r * 0.95, r * 0.12); ctx.fill();
    ctx.fillStyle = INK; ctx.beginPath(); for (const y of [0.6, 0.32, 0.04]) dot(ctx, -r * 1.52, y * r, r * 0.11); ctx.fill();
    ctx.fillStyle = RED; ctx.beginPath(); for (const y of [0.6, 0.32, 0.04]) dot(ctx, -r * 1.52, y * r, r * 0.07); ctx.fill();
    // armoured shell
    ctx.fillStyle = S; ctx.beginPath(); poly(ctx, r, [[-1.2, -0.95], [-1.32, 0.6], [-0.95, 1.3], [0.4, 1.48], [1.15, 1.05], [1.42, 0.5], [1.38, -0.4], [1.0, -1.0]]); ctx.fill();
    ctx.fillStyle = SL; ctx.beginPath(); poly(ctx, r, [[-0.95, 1.3], [0.4, 1.48], [1.15, 1.05], [0.3, 1.14], [-0.8, 1.04]]); ctx.fill();
    ctx.fillStyle = SD; ctx.beginPath(); poly(ctx, r, [[-1.2, -0.95], [1.0, -1.0], [1.12, -0.7], [-1.16, -0.62]]); ctx.fill();
    ctx.beginPath(); dot(ctx, -r * 0.55, r * 0.1, r * 0.36); ctx.fill();
    ctx.fillStyle = SL; ctx.beginPath(); dot(ctx, -r * 0.55, r * 0.1, r * 0.2); ctx.fill();
    ctx.fillStyle = on && (t * 2 | 0) % 2 ? RED : '#4a4f58'; ctx.beginPath(); dot(ctx, -r * 0.55, r * 0.1, r * 0.1); ctx.fill();
    ctx.fillStyle = SL; ctx.beginPath(); for (const [x, y] of [[-1.05, -0.4], [-1.05, 0.95], [1.18, -0.3], [0.2, -0.82], [-0.5, -0.82]]) dot(ctx, x * r, y * r, r * 0.05); ctx.fill();
    // cheese-yellow cockpit visor
    ctx.fillStyle = CHEESE; ctx.beginPath(); poly(ctx, r, [[0.02, 0.58], [1.2, 0.62], [1.45, 0.12], [1.25, -0.18], [0.06, -0.12]]); ctx.fill();
    ctx.fillStyle = '#e0a52c'; ctx.beginPath(); poly(ctx, r, [[0.02, 0.58], [1.2, 0.62], [1.28, 0.46], [0.03, 0.44]]); ctx.fill();
    ctx.fillStyle = '#fff0b8'; ctx.beginPath(); poly(ctx, r, [[0.98, 0.44], [1.14, 0.44], [0.9, -0.1], [0.74, -0.1]]); ctx.fill();
    faceEyes(ctx, r, f, INK, 0.12);
    if (!on) { ctx.strokeStyle = '#a8741c'; ctx.lineWidth = r * 0.04; ctx.beginPath(); ctx.moveTo(r * 1.1, r * 0.5); ctx.lineTo(r * 0.9, r * 0.2); ctx.lineTo(r * 1.05, r * 0.0); ctx.lineTo(r * 0.85, -r * 0.12); ctx.stroke(); }
    ctx.strokeStyle = SD; ctx.lineWidth = r * 0.08; ctx.beginPath(); for (const y of [-0.42, -0.6]) { ctx.moveTo(r * 0.35, y * r); ctx.lineTo(r * 1.15, y * r); } ctx.stroke();
    // melted mozzarella on top and dripping from the chin
    ctx.fillStyle = MOZZ; ctx.beginPath();
    ctx.moveTo(-r * 0.95, r * 1.3); ctx.lineTo(r * 0.4, r * 1.48); ctx.lineTo(r * 1.15, r * 1.05); ctx.lineTo(r * 0.95, r * 1.05);
    for (const [x, l] of [[0.8, 0.22], [0.1, 0.3], [-0.6, 0.26]]) { const y = x > 0.4 ? 1.1 : 1.2; ctx.lineTo((x + 0.09) * r, y * r); ctx.lineTo((x + 0.09) * r, (y - l) * r); ctx.arc(x * r, (y - l) * r, r * 0.09, 0, Math.PI, true); ctx.lineTo((x - 0.09) * r, y * r); }
    ctx.lineTo(-r * 0.88, r * 1.12); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    [[0.2, 0], [0.62, 1.7], [0.95, 3.1]].forEach(([x, ph]) => { const l = 0.25 + 0.15 * Math.sin(t * 1.5 + ph); ctx.roundRect((x - 0.07) * r, -r * (0.95 + l), r * 0.14, r * (l + 0.05), r * 0.07); dot(ctx, x * r, -r * (0.95 + l), r * 0.1); });
    ctx.fill();
  },
  zero_g(ctx, r, f) {
    const t = T(), on = alive(f), dead = !on;
    const RY = r * 0.42, RX = r * 1.8, CY = r * 0.3, ROT = -0.22, cR = Math.cos(ROT), sR = Math.sin(ROT);
    const ring = (a0, a1) => {
      ctx.strokeStyle = CHEESE; ctx.lineWidth = r * 0.13; ctx.beginPath(); ctx.ellipse(0, CY, RX, RY, ROT, a0, a1); ctx.stroke();
      ctx.strokeStyle = '#e0a52c'; ctx.lineWidth = r * 0.05; ctx.beginPath(); ctx.ellipse(0, CY, RX * 0.88, RY * 0.78, ROT, a0, a1); ctx.stroke();
    };
    const bits = (front) => {
      for (let i = 0; i < 4; i++) {
        const a = (dead ? 0.4 : t * 0.9) + i * TAU / 4, s = Math.sin(a);
        if ((s < 0) !== front) continue;
        const ex = Math.cos(a) * RX * 1.02, ey = s * RY * 1.02, x = ex * cR - ey * sR, y = CY + ex * sR + ey * cR + Math.sin(t * 2 + i) * r * 0.05, k = r * 0.17;
        ctx.beginPath();
        if (i === 0) { ctx.fillStyle = '#8a8f98'; ctx.moveTo(x - k, y); ctx.lineTo(x - k * 0.3, y + k * 0.9); ctx.lineTo(x + k, y + k * 0.4); ctx.lineTo(x + k * 0.6, y - k * 0.8); ctx.closePath(); }
        else if (i === 1) { ctx.fillStyle = '#b9c3cd'; for (let j = 0; j < 6; j++) { const aa = j * TAU / 6 + t; if (j) ctx.lineTo(x + Math.cos(aa) * k, y + Math.sin(aa) * k); else ctx.moveTo(x + Math.cos(aa) * k, y + Math.sin(aa) * k); } ctx.closePath(); }
        else if (i === 2) { ctx.fillStyle = CHEESE; ctx.moveTo(x - k, y - k * 0.7); ctx.lineTo(x + k, y - k * 0.7); ctx.lineTo(x, y + k * 1.1); ctx.closePath(); }
        else { ctx.fillStyle = '#6b7078'; dot(ctx, x, y, k * 0.6); }
        ctx.fill();
        if (i === 2) { ctx.fillStyle = RED; ctx.beginPath(); dot(ctx, x, y - k * 0.2, k * 0.25); ctx.fill(); }
      }
    };
    ring(0, Math.PI); bits(false);
    // helmet shell + starry visor
    ctx.fillStyle = '#f7f9fc'; ctx.beginPath(); dot(ctx, 0, r * 0.05, r * 1.18); ctx.fill();
    ctx.strokeStyle = RED; ctx.lineWidth = r * 0.14; ctx.beginPath(); ctx.arc(0, r * 0.05, r * 1.0, 1.7, 3.5); ctx.stroke();
    ctx.fillStyle = on && (t * 1.5 | 0) % 2 ? '#5fd46a' : '#9aa6b2'; ctx.beginPath(); dot(ctx, -r * 0.75, -r * 0.55, r * 0.09); ctx.fill();
    ctx.fillStyle = '#2b2f5a'; ctx.beginPath(); ctx.ellipse(r * 0.42, r * 0.12, r * 0.7, r * 0.6, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = CREAM; ctx.beginPath(); for (const [x, y] of [[0.2, 0.48], [0.8, 0.5], [0.98, -0.12], [0.12, -0.25], [0.55, -0.35]]) dot(ctx, x * r, y * r, r * 0.028); ctx.fill();
    ctx.strokeStyle = '#6a74b8'; ctx.lineWidth = r * 0.06; ctx.beginPath(); ctx.arc(r * 0.42, r * 0.12, r * 0.5, 1.9, 2.6); ctx.stroke();
    if (on) { ctx.fillStyle = '#7ff0ff'; ctx.beginPath(); dot(ctx, r * 0.3, r * 0.18, r * 0.1); dot(ctx, r * 0.68, r * 0.18, r * 0.1); ctx.fill(); }
    else faceEyes(ctx, r, f, '#6a74b8', 0.1);
    ring(Math.PI, TAU); bits(true);
  },
  emperor_crust(ctx, r, f) {
    const t = T(), on = alive(f), RED2 = '#9e2230', GOLD = '#e0b04a', CR = '#d9a85a', CRD = '#b8843f', ERM = '#fbf6ea';
    const gemCols = [[RED, '#ff9a8a'], ['#39c6ff', '#b8f6ff'], ['#5fd46a', '#c4f5c8']];
    const gems = (front) => {
      for (let i = 0; i < 3; i++) {
        const a = (on ? t * 1.1 : 0.5) + i * TAU / 3, s = Math.sin(a);
        if ((s < 0) !== front) continue;
        const x = Math.cos(a) * 1.7 * r, y = (1.45 + s * 0.3 + Math.sin(t * 2.2 + i) * 0.04) * r, k = r * (front ? 1.05 : 0.8);
        ctx.fillStyle = gemCols[i][0]; ctx.beginPath(); ctx.moveTo(x, y + 0.22 * k); ctx.lineTo(x + 0.15 * k, y); ctx.lineTo(x, y - 0.22 * k); ctx.lineTo(x - 0.15 * k, y); ctx.closePath(); ctx.fill();
        ctx.fillStyle = gemCols[i][1]; ctx.beginPath(); ctx.moveTo(x, y + 0.22 * k); ctx.lineTo(x + 0.15 * k, y); ctx.lineTo(x, y); ctx.closePath(); ctx.fill();
      }
    };
    // tall imperial collar behind the head
    ctx.fillStyle = RED2; ctx.beginPath();
    ctx.moveTo(-r * 0.2, -r * 1.35); ctx.quadraticCurveTo(-r * 2.0, -r * 1.2, -r * 1.95, r * 0.85); ctx.lineTo(-r * 1.5, r * 0.6); ctx.quadraticCurveTo(-r * 1.2, -r * 0.55, -r * 0.1, -r * 1.0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = GOLD; ctx.lineWidth = r * 0.07; ctx.beginPath(); ctx.moveTo(-r * 1.5, r * 0.6); ctx.quadraticCurveTo(-r * 1.2, -r * 0.55, -r * 0.1, -r * 1.0); ctx.stroke();
    ctx.strokeStyle = ERM; ctx.lineWidth = r * 0.18; ctx.beginPath(); ctx.moveTo(-r * 0.2, -r * 1.35); ctx.quadraticCurveTo(-r * 2.0, -r * 1.2, -r * 1.95, r * 0.85); ctx.stroke();
    ctx.fillStyle = INK; ctx.beginPath(); for (const [x, y] of [[-1.11, -1.09], [-1.69, -0.49], [-1.92, 0.28]]) dot(ctx, x * r, y * r, r * 0.05); ctx.fill();
    gems(false);
    // pizza-slice crown points
    const slices = [[-0.8, 0.95], [0.8, 0.95], [-0.4, 1.2], [0.4, 1.2], [0, 1.5]];
    for (const [cx, h] of slices) {
      ctx.fillStyle = CHEESE; ctx.beginPath(); poly(ctx, r, [[cx - 0.26, 0.9], [cx * 1.2, 0.9 + h], [cx + 0.26, 0.9]]); ctx.fill();
      ctx.strokeStyle = '#e0a52c'; ctx.lineWidth = r * 0.04; ctx.stroke();
      ctx.fillStyle = '#c23b2c'; ctx.beginPath(); dot(ctx, cx * 1.06 * r, (0.9 + h * 0.3) * r, r * 0.08); if (h > 1) dot(ctx, (cx * 1.13 - 0.04) * r, (0.9 + h * 0.58) * r, r * 0.055); ctx.fill();
    }
    ctx.fillStyle = GOLD; ctx.beginPath(); dot(ctx, 0, r * 2.43, r * 0.1); ctx.fill();
    // crust band with set gems
    ctx.fillStyle = CR; ctx.beginPath(); ctx.roundRect(-r * 1.14, r * 0.38, r * 2.28, r * 0.62, r * 0.3);
    for (let x = -0.9; x < 0.95; x += 0.3) dot(ctx, x * r, r * 0.98, r * 0.14);
    ctx.fill();
    ctx.fillStyle = CRD; ctx.beginPath(); for (const [x, y, s] of [[-0.85, 0.55, 0.06], [-0.3, 0.84, 0.05], [0.2, 0.5, 0.05], [0.95, 0.8, 0.05], [-0.55, 0.9, 0.04]]) dot(ctx, x * r, y * r, s * r); ctx.fill();
    for (const [x, i] of [[0.58, 0], [-0.02, 1], [-0.62, 2]]) {
      ctx.fillStyle = GOLD; ctx.beginPath(); dot(ctx, x * r, r * 0.69, r * 0.17); ctx.fill();
      ctx.fillStyle = gemCols[i][0]; ctx.beginPath(); poly(ctx, r, [[x, 0.84], [x + 0.11, 0.69], [x, 0.54], [x - 0.11, 0.69]]); ctx.fill();
    }
    // curled crust moustache
    ctx.fillStyle = CR; ctx.beginPath();
    ctx.moveTo(r * 0.5, -r * 0.18); ctx.quadraticCurveTo(r * 0.8, -r * 0.05, r * 1.05, -r * 0.2); ctx.quadraticCurveTo(r * 1.28, -r * 0.34, r * 1.2, -r * 0.02);
    ctx.quadraticCurveTo(r * 1.12, -r * 0.52, r * 0.75, -r * 0.42); ctx.quadraticCurveTo(r * 0.55, -r * 0.38, r * 0.5, -r * 0.18);
    ctx.moveTo(r * 0.5, -r * 0.18); ctx.quadraticCurveTo(r * 0.25, -r * 0.08, r * 0.08, -r * 0.22); ctx.quadraticCurveTo(r * 0.3, -r * 0.45, r * 0.52, -r * 0.36); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = CRD; ctx.beginPath(); dot(ctx, r * 0.8, -r * 0.25, r * 0.04); dot(ctx, r * 0.3, -r * 0.24, r * 0.035); ctx.fill();
    // front lapel with a gold clasp
    ctx.fillStyle = RED2; ctx.beginPath();
    ctx.moveTo(r * 0.05, -r * 1.35); ctx.quadraticCurveTo(r * 1.15, -r * 1.4, r * 1.45, -r * 0.85); ctx.lineTo(r * 1.05, -r * 0.98); ctx.quadraticCurveTo(r * 0.6, -r * 1.1, r * 0.05, -r * 1.08); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = ERM; ctx.lineWidth = r * 0.12; ctx.beginPath(); ctx.moveTo(r * 0.05, -r * 1.35); ctx.quadraticCurveTo(r * 1.15, -r * 1.4, r * 1.45, -r * 0.85); ctx.stroke();
    ctx.fillStyle = GOLD; ctx.beginPath(); dot(ctx, r * 0.08, -r * 1.22, r * 0.14); ctx.fill();
    ctx.fillStyle = RED; ctx.beginPath(); dot(ctx, r * 0.08, -r * 1.22, r * 0.07); ctx.fill();
    gems(true);
  },
};

/** Cheap deterministic 0..1 noise for glitch / crackle timing. */
function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }

export const LOOKS_EXTRA = {
  frost:      { neck: '#6fb3d6' },
  fur:        { strap: '#8a6a52', stud: '#bfe3f2', belt: '#5a4a40', buckle: '#bfe3f2' },
  penguin:    { belt: '#f2eee6', buckle: '#d8432f' },
  deck:       { neck: '#2f4a6b', belt: '#6b4a36', buckle: '#c9b48e' },
  pirate:     { strap: '#5a3d2c', stud: '#e0b04a', belt: '#d8432f', knot: '#d8432f' },
  diver:      { belt: '#8a6128', buckle: '#e3b565', strap: '#5a6570' },
  grill:      { neck: '#b5352a', belt: '#3b3f47', buckle: '#ff8a2a' },
  fire:       { belt: '#d8432f', knot: '#ffc23d' },
  magma:      { belt: '#3a2e2a', buckle: '#ff8a2a' },
  monk:       { belt: '#e0a73a', knot: '#e0a73a' },
  windknight: { strap: '#6fa8dc', stud: '#e2e7ec', belt: '#6b4a36', buckle: '#d3d9e0' },
  cloudninja: { belt: '#3f4d6e', knot: '#eef3fa' },
  punk:       { strap: '#2a2d33', stud: '#39e6ff', belt: '#2a2d33', buckle: '#ff4fa8' },
  robo:       { neck: '#d8432f', belt: '#6b7480', buckle: '#5ff0ff' },
  arcade:     { neck: '#d8432f', belt: '#2d2f3a', buckle: '#39e6ff' },
  astro:      { strap: '#9aa6b2', stud: '#5fd46a', belt: '#d8432f', buckle: '#dfe6ee' },
  alien:      { strap: '#4a5a4e', stud: '#e05ad8', belt: '#4a5a4e', buckle: '#ffc23d' },
  cyborg:     { neck: '#d8432f', belt: '#6b7480', buckle: '#ff3b2f' },
  // bosses
  snowsam:    { neck: '#d8432f', belt: '#3b3f47', buckle: '#ff8a2a' },
  brainfreeze:{ strap: '#f4b6c8', stud: '#ffc23d', belt: '#d9a45a', buckle: '#9fd3ea' },
  anchovy:    { strap: '#e0b04a', stud: '#c9d6e2', belt: '#2f4a6b', buckle: '#e0b04a' },
  calamari:   { strap: '#e0b04a', stud: '#f4f1ea', belt: '#b2497f', knot: '#e28ab8' },
  hotsauce:   { neck: '#c7301f', belt: '#3f8a4a', buckle: '#ffc23d' },
  chili:      { strap: '#3f8a4a', stud: '#ffc23d', belt: '#9e2418', buckle: '#ff8a2a' },
  windbag:    { neck: '#d8432f', belt: '#8fa3b8', knot: '#f2eee6' },
  thunder:    { strap: '#4f586b', stud: '#ffc23d', belt: '#b8843f', buckle: '#ffc23d' },
  glitch:     { strap: '#ff4fa8', stud: '#39e6ff', belt: '#3a3552', buckle: '#39e6ff' },
  mecha:      { strap: '#6b7480', stud: '#ffc23d', belt: '#4a4f58', buckle: '#ffc23d' },
  zerog:      { strap: '#d8432f', stud: '#7ff0ff', belt: '#2b2f5a', buckle: '#ffc23d' },
  emperor:    { neck: '#9e2230', strap: '#e0b04a', stud: '#d8432f', belt: '#9e2230', buckle: '#ffc23d' },
};

export const HAT_LOOK_EXTRA = {
  frost_beanie: 'frost', ice_hood: 'fur', penguin_hood: 'penguin',
  deck_beanie: 'deck', tricorn: 'pirate', dive_helmet: 'diver',
  grill_mask: 'grill', flame_crown: 'fire', magma_rock: 'magma',
  monk_hat: 'monk', winged_helm: 'windknight', cloud_mask: 'cloudninja',
  neon_mohawk: 'punk', robo_head: 'robo', vr_visor: 'arcade',
  space_helmet: 'astro', alien_antennae: 'alien', cyborg_eye: 'cyborg',
  snowball_sam: 'snowsam', brain_freeze: 'brainfreeze', captain_anchovy: 'anchovy', calamari_king: 'calamari',
  hot_sauce: 'hotsauce', chili_colossus: 'chili', windbag: 'windbag', thunder_crust: 'thunder',
  glitch: 'glitch', mecha_mozza: 'mecha', zero_g: 'zerog', emperor_crust: 'emperor',
};
