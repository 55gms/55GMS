// Ragdoll Fight — visual effects: particles, sauce splats + floor decals, fountains,
// screen shake, hitstop, slow-mo, pop texts, screen flash.
//
// World space is metres, y-up. A camera must provide:
//   camera.toScreen(x, y) -> [sx, sy]   (CSS pixels)
//   camera.scale                         (px per metre)
//
// createFx({ getSettings, maxParticles, maxDecals, gravity }) -> fx
//   fx.sparks(x, y, {count, color, speed, dir:[dx,dy], spread})
//   fx.splat(x, y, {size, color, dir:[vx,vy]})        color: css colour or 'sauce'|'cheese'|'pesto'|'blue'|'white'
//   fx.fountain(getPos, {duration, rate, speed, color, dir}) -> {stop()}   getPos() -> [x,y] | {x,y} | null
//   fx.shake(amountPx)   fx.hitstop(ms)   fx.slowmo(scale, ms)   fx.flash(color, ms)
//   fx.popText(x, y, text, {color, size, life, screen})   (world coords unless screen:true)
//   fx.update(realDt, speedMult = 1)
//   fx.timeScale()   -> 0..1 (hitstop × slowmo) for the main loop
//   fx.drawWorld(ctx, camera)   = drawDecals + drawParticles
//   fx.drawDecals(ctx, camera)  fx.drawParticles(ctx, camera)
//   fx.drawScreen(ctx, camera)  (pop texts + flash; call without shake transform)
//   fx.shakeOffset() -> [dx, dy]
//   fx.setFloor(numberY | fn(x, y) -> surfaceY | null | null)   where blobs stick (default y = 0)
//   fx.clear()   fx.clearDecals()   fx.stats()

import * as saveMod from './save.js';

export const SPLAT_COLORS = {
  sauce: '#d8432f',
  cheese: '#ffc23d',
  pesto: '#5fbf6a',
  blue: '#3f86e0',
  white: '#f2eee6',
};

const FONT = '"Lilita One", "Baloo 2", "Arial Rounded MT Bold", "Trebuchet MS", system-ui, sans-serif';

const rand = (a, b) => a + Math.random() * (b - a);

export function createFx(opts = {}) {
  const getSettings = opts.getSettings || (() => {
    try { return saveMod.get().settings || {}; } catch (e) { return {}; }
  });
  const MAX_PARTICLES = opts.maxParticles || 360;
  const MAX_DECALS = opts.maxDecals || 150;
  const GRAVITY = opts.gravity ?? 16;

  let particles = [];
  let decals = [];
  let emitters = [];
  let texts = [];
  let floor = 0;

  let shakeAmp = 0;
  let shakeX = 0;
  let shakeY = 0;
  let hitstopT = 0;
  let slowScale = 1;
  let slowT = 0;
  let slowDur = 0;
  let flashColor = '#fff';
  let flashT = 0;
  let flashDur = 0;

  function resolveColor(c) {
    if (!c) {
      const key = getSettings().splatColor || 'sauce';
      return SPLAT_COLORS[key] || key;
    }
    return SPLAT_COLORS[c] || c;
  }

  function floorAt(x, y) {
    if (floor === null || floor === undefined) return null;
    if (typeof floor === 'number') return floor;
    try { return floor(x, y); } catch (e) { return null; }
  }

  function pushParticle(p) {
    if (particles.length >= MAX_PARTICLES) particles.shift();
    particles.push(p);
  }

  function addDecal(x, y, r, color) {
    if (decals.length >= MAX_DECALS) decals.shift();
    decals.push({
      x, y, color,
      rx: r * rand(1.4, 2.2),
      ry: r * rand(0.3, 0.5),
      ox: rand(-0.4, 0.4),
      a: rand(0.75, 0.95),
    });
  }

  function spawnBlob(x, y, vx, vy, r, color, life = 2.5) {
    pushParticle({ type: 'blob', x, y, vx, vy, r, color, life, maxLife: life, grav: 1, drag: 0.4 });
  }

  // ---------- emitters ----------

  function sparks(x, y, o = {}) {
    const count = Math.min(60, o.count ?? 10);
    const color = o.color || '#ffc23d';
    const speed = o.speed ?? 6;
    const dir = o.dir;
    const spread = o.spread ?? Math.PI;
    const baseAng = dir ? Math.atan2(dir[1], dir[0]) : 0;
    for (let i = 0; i < count; i++) {
      const ang = dir ? baseAng + rand(-spread / 2, spread / 2) : rand(0, Math.PI * 2);
      const sp = speed * rand(0.35, 1);
      const life = rand(0.18, 0.45);
      pushParticle({
        type: 'spark', x, y,
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        size: rand(1.5, 3.2), color, life, maxLife: life, grav: 0.35, drag: 3,
      });
    }
  }

  function splat(x, y, o = {}) {
    const st = getSettings();
    if (st.gore === false) return;
    const size = Math.max(0.2, Math.min(4, o.size ?? 1));
    const color = resolveColor(o.color);
    const count = Math.round(5 + 6 * size);
    const dvx = o.dir ? o.dir[0] : 0;
    const dvy = o.dir ? o.dir[1] : 0;
    for (let i = 0; i < count; i++) {
      spawnBlob(
        x + rand(-0.05, 0.05), y + rand(-0.05, 0.05),
        dvx + rand(-2.6, 2.6) * size, dvy + rand(0.5, 4.2) * Math.sqrt(size),
        rand(0.025, 0.07) * Math.sqrt(size), color,
      );
    }
  }

  function fountain(getPos, o = {}) {
    const em = {
      getPos,
      duration: o.duration ?? 1.6,
      t: 0,
      rate: o.rate ?? 70,
      speed: o.speed ?? 5,
      color: o.color,
      dir: o.dir,
      acc: 0,
      dead: false,
    };
    emitters.push(em);
    return { stop() { em.dead = true; } };
  }

  function shake(amount) {
    shakeAmp = Math.min(32, Math.max(shakeAmp, Number(amount) || 0));
  }

  function hitstop(ms) {
    hitstopT = Math.max(hitstopT, Math.min(250, ms || 0) / 1000);
  }

  function slowmo(scale, ms) {
    slowScale = Math.max(0.02, Math.min(1, scale ?? 0.35));
    slowDur = Math.max(0, (ms ?? 800) / 1000);
    slowT = slowDur;
  }

  function flash(color = '#fff', ms = 120) {
    flashColor = color;
    flashDur = ms / 1000;
    flashT = flashDur;
  }

  // ---------- hitmarkers: a crisp X at the hit point (crit = bigger, yellow) ----------
  let marks = [];
  function hitmarker(x, y, o = {}) {
    if (marks.length > 16) marks.shift();
    marks.push({ x, y, t: 0, life: o.life || 0.3, crit: !!o.crit });
  }

  function popText(x, y, text, o = {}) {
    if (texts.length > 24) texts.shift();
    texts.push({
      x, y, text: String(text),
      color: o.color || '#ffc23d',
      size: o.size || 30,
      life: o.life || 0.9,
      screen: !!o.screen,
      t: 0,
      rot: rand(-0.12, 0.12),
    });
  }

  function timeScale() {
    if (hitstopT > 0) return 0;
    if (slowT > 0) {
      const tail = slowDur * 0.3;
      const k = tail > 0 ? Math.min(1, slowT / tail) : 1;
      return slowScale + (1 - slowScale) * (1 - k);
    }
    return 1;
  }

  // ---------- update ----------

  function update(realDt, speedMult = 1) {
    const rdt = Math.max(0, Math.min(0.25, realDt || 0));
    const dt = rdt * timeScale() * speedMult;

    hitstopT = Math.max(0, hitstopT - rdt);
    slowT = Math.max(0, slowT - rdt);
    flashT = Math.max(0, flashT - rdt);

    shakeAmp *= Math.exp(-rdt * 9);
    if (shakeAmp < 0.2) shakeAmp = 0;
    shakeX = (Math.random() * 2 - 1) * shakeAmp;
    shakeY = (Math.random() * 2 - 1) * shakeAmp;

    for (const t of texts) t.t += rdt;
    texts = texts.filter((t) => t.t < t.life);
    for (const m of marks) m.t += rdt;
    marks = marks.filter((m) => m.t < m.life);

    const st = getSettings();

    // fountains
    for (const em of emitters) {
      if (em.dead) continue;
      em.t += dt;
      if (em.t >= em.duration || st.gore === false) { em.dead = true; continue; }
      let pos = null;
      try { pos = em.getPos(); } catch (e) { pos = null; }
      if (!pos) { em.dead = true; continue; }
      const px = Array.isArray(pos) ? pos[0] : pos.x;
      const py = Array.isArray(pos) ? pos[1] : pos.y;
      const fade = 1 - em.t / em.duration;
      em.acc += dt * em.rate * (0.35 + 0.65 * fade);
      let d = typeof em.dir === 'function' ? em.dir() : em.dir;
      if (!d) d = [0, 1];
      const len = Math.hypot(d[0], d[1]) || 1;
      const color = resolveColor(em.color);
      while (em.acc >= 1) {
        em.acc -= 1;
        const sp = em.speed * rand(0.55, 1) * (0.5 + 0.5 * fade);
        spawnBlob(
          px, py,
          (d[0] / len) * sp + rand(-1.3, 1.3),
          (d[1] / len) * sp + rand(-0.6, 0.6),
          rand(0.02, 0.05), color, 2.2,
        );
      }
    }
    emitters = emitters.filter((e) => !e.dead);

    if (dt <= 0) return;

    const decalsOn = st.decals !== false;
    let write = 0;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.life -= dt;
      p.vy -= GRAVITY * p.grav * dt;
      const damp = Math.max(0, 1 - p.drag * dt);
      p.vx *= damp;
      if (p.type === 'spark') p.vy *= damp;
      const prevY = p.y;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      let alive = p.life > 0;
      if (alive && p.type === 'blob' && p.vy < 0) {
        const fy = floorAt(p.x, prevY);
        if (fy !== null && fy !== undefined && prevY >= fy && p.y <= fy) {
          if (decalsOn) addDecal(p.x, fy, p.r, p.color);
          alive = false;
        }
      }
      if (alive && p.y < -60) alive = false;
      if (alive) particles[write++] = p;
    }
    particles.length = write;
  }

  // ---------- drawing ----------

  function drawDecals(ctx, cam) {
    if (!decals.length || !cam) return;
    const s = cam.scale;
    ctx.save();
    for (const d of decals) {
      const [sx, sy] = cam.toScreen(d.x, d.y);
      ctx.globalAlpha = d.a;
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.ellipse(sx + d.ox * d.rx * s, sy + d.ry * s * 0.35, d.rx * s, Math.max(1, d.ry * s), 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawParticles(ctx, cam) {
    if (!particles.length || !cam) return;
    const s = cam.scale;
    ctx.save();
    ctx.lineCap = 'round';
    for (const p of particles) {
      const [sx, sy] = cam.toScreen(p.x, p.y);
      const k = Math.max(0, p.life / p.maxLife);
      if (p.type === 'spark') {
        ctx.globalAlpha = Math.min(1, k * 1.6);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - p.vx * s * 0.022, sy + p.vy * s * 0.022);
        ctx.stroke();
      } else {
        ctx.globalAlpha = Math.min(1, k * 4);
        ctx.fillStyle = p.color;
        const r = Math.max(1.2, p.r * s);
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawWorld(ctx, cam) {
    drawDecals(ctx, cam);
    drawParticles(ctx, cam);
  }

  function drawScreen(ctx, cam) {
    if (flashT > 0 && flashDur > 0) {
      const c = ctx.canvas;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 0.55 * (flashT / flashDur);
      ctx.fillStyle = flashColor;
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.restore();
    }
    for (const m of marks) {
      const [sx, sy] = cam ? cam.toScreen(m.x, m.y) : [m.x, m.y];
      const u = m.t / m.life;
      const pop = m.t < 0.05 ? 1.5 - (m.t / 0.05) * 0.5 : 1;
      const size = (m.crit ? 15 : 11) * pop, gap = (m.crit ? 5 : 4) * pop;
      ctx.save();
      ctx.globalAlpha = u > 0.5 ? Math.max(0, 1 - (u - 0.5) / 0.5) : 1;
      ctx.translate(sx, sy);
      ctx.lineCap = 'round';
      for (const [w, col] of [[m.crit ? 6.5 : 5, '#23262e'], [m.crit ? 3.2 : 2.6, m.crit ? '#ffc23d' : '#ffffff']]) {
        ctx.strokeStyle = col; ctx.lineWidth = w;
        ctx.beginPath();
        for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { ctx.moveTo(dx * gap, dy * gap); ctx.lineTo(dx * size, dy * size); }
        ctx.stroke();
      }
      ctx.restore();
    }
    if (!texts.length) return;
    for (const t of texts) {
      let sx = t.x;
      let sy = t.y;
      if (!t.screen && cam) [sx, sy] = cam.toScreen(t.x, t.y);
      const u = t.t / t.life;
      const pop = t.t < 0.1 ? 0.3 + (t.t / 0.1) * 1.0 : t.t < 0.2 ? 1.3 - ((t.t - 0.1) / 0.1) * 0.3 : 1;
      const alpha = u > 0.65 ? 1 - (u - 0.65) / 0.35 : 1;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.translate(sx, sy - t.t * 55);
      ctx.rotate(t.rot);
      ctx.scale(pop, pop);
      ctx.font = `${t.size}px ${FONT}`;
      ctx.lineWidth = Math.max(3, t.size * 0.2);
      ctx.strokeStyle = '#23262e';
      ctx.strokeText(t.text, 0, 0);
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, 0, 0);
      ctx.restore();
    }
  }

  function shakeOffset() {
    if (getSettings().shake === false) return [0, 0];
    return [shakeX, shakeY];
  }

  function setFloor(f) {
    floor = f;
  }

  function clearDecals() {
    decals = [];
  }

  function clear() {
    particles = [];
    decals = [];
    emitters = [];
    texts = [];
    marks = [];
    shakeAmp = 0;
    shakeX = 0;
    shakeY = 0;
    hitstopT = 0;
    slowT = 0;
    slowScale = 1;
    flashT = 0;
  }

  /** Drop pop texts + hitmarkers (e.g. so a "CRIT!" doesn't sit on top of the finishing-shot title). */
  function clearTexts() {
    texts = [];
    marks = [];
  }

  function stats() {
    return { particles: particles.length, decals: decals.length, emitters: emitters.length, texts: texts.length, marks: marks.length };
  }

  return {
    sparks, splat, fountain, shake, hitstop, slowmo, flash, popText, hitmarker,
    update, timeScale,
    drawWorld, drawDecals, drawParticles, drawScreen,
    shakeOffset, setFloor, clear, clearDecals, clearTexts, stats,
  };
}

export default createFx;
