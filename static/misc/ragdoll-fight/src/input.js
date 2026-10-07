// Keyboard + touch -> intents. Listens on window so synthetic KeyboardEvents work too.
// createInput({mode:'1p'|'2p'}) -> { p1, p2, consume(), setMode(), destroy() }
// intent = {spin:-1|0|1, jump:bool(edge), kick:bool(edge), grab:bool(held)}

const KEYS_1P = {
  left: ['KeyA', 'ArrowLeft'], right: ['KeyD', 'ArrowRight'], jump: ['KeyW', 'ArrowUp'], kick: ['KeyS', 'ArrowDown'], grab: ['Space'],
};
const KEYS_P1 = { left: ['KeyA'], right: ['KeyD'], jump: ['KeyW'], kick: ['KeyS'], grab: ['ShiftLeft', 'Space'] };
const KEYS_P2 = { left: ['ArrowLeft'], right: ['ArrowRight'], jump: ['ArrowUp'], kick: ['ArrowDown'], grab: ['ShiftRight', 'Enter', 'NumpadEnter'] };

const GAME_CODES = new Set(['KeyA', 'KeyD', 'KeyW', 'KeyS', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'ShiftLeft', 'ShiftRight', 'Enter']);

// grab = held, grabPress = edge (pick up / drop)
function mkIntent() { return { spin: 0, jump: false, kick: false, grab: false, grabPress: false }; }

// Some synthetic KeyboardEvents (e.g. browser automation) arrive with an empty `code`; derive it from `key`.
const KEY_TO_CODE = { a: 'KeyA', d: 'KeyD', w: 'KeyW', s: 'KeyS', ' ': 'Space', spacebar: 'Space', arrowleft: 'ArrowLeft', arrowright: 'ArrowRight', arrowup: 'ArrowUp', arrowdown: 'ArrowDown', enter: 'Enter', left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown' };
export function codeOf(e) {
  if (e.code) return e.code;
  const k = (e.key || '').toLowerCase();
  if (k === 'shift') return e.location === 2 ? 'ShiftRight' : 'ShiftLeft';
  return KEY_TO_CODE[k] || e.key || '';
}

export function createInput(o = {}) {
  let mode = o.mode || '1p';
  const target = o.target || window;
  const down = new Set();
  const p1 = mkIntent(), p2 = mkIntent();
  const touch = { p1: mkIntent(), p2: mkIntent() };
  const edges = { p1: { jump: false, kick: false, grab: false }, p2: { jump: false, kick: false, grab: false } };
  let touchUI = null;

  const anyDown = (codes) => codes.some((c) => down.has(c));
  const keysFor = (who) => (mode === '2p' ? (who === 'p1' ? KEYS_P1 : KEYS_P2) : (who === 'p1' ? KEYS_1P : null));

  function refresh() {
    for (const who of ['p1', 'p2']) {
      const it = who === 'p1' ? p1 : p2, k = keysFor(who), t = touch[who];
      let spin = 0, grab = false;
      if (k) { spin = (anyDown(k.right) ? 1 : 0) - (anyDown(k.left) ? 1 : 0); grab = anyDown(k.grab); }
      if (t.spin) spin = t.spin;
      it.spin = spin;
      it.grab = grab || t.grab;
      it.jump = edges[who].jump || t.jump;
      it.kick = edges[who].kick || t.kick;
      it.grabPress = edges[who].grab || t.grabPress;
    }
  }

  function onKeyDown(e) {
    const c = codeOf(e);
    if (GAME_CODES.has(c) && !e.ctrlKey && !e.metaKey && !e.altKey) e.preventDefault();
    if (e.repeat || down.has(c)) return;
    down.add(c);
    for (const who of ['p1', 'p2']) {
      const k = keysFor(who); if (!k) continue;
      if (k.jump.includes(c)) edges[who].jump = true;
      if (k.kick.includes(c)) edges[who].kick = true;
      if (k.grab.includes(c)) edges[who].grab = true;
    }
    refresh();
  }
  function onKeyUp(e) { down.delete(codeOf(e)); refresh(); }
  function onBlur() { down.clear(); refresh(); }

  target.addEventListener('keydown', onKeyDown);
  target.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);

  // ---- touch overlay (created lazily on first touch) ---------------------------------
  function buildTouchUI() {
    if (touchUI) return;
    const root = document.createElement('div');
    root.id = 'rf-touch';
    Object.assign(root.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '50', touchAction: 'none', fontFamily: 'system-ui, sans-serif', userSelect: 'none' });
    const mkStick = () => {
      const base = document.createElement('div');
      Object.assign(base.style, { position: 'fixed', width: '110px', height: '110px', borderRadius: '50%', border: '2px solid rgba(242,238,230,0.35)', background: 'rgba(242,238,230,0.08)', display: 'none', transform: 'translate(-50%,-50%)', pointerEvents: 'none' });
      const knob = document.createElement('div');
      Object.assign(knob.style, { position: 'absolute', left: '50%', top: '50%', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,194,61,0.8)', transform: 'translate(-50%,-50%)' });
      base.appendChild(knob);
      root.appendChild(base);
      return { base, knob };
    };
    const mkGrab = (right) => {
      const b = document.createElement('div');
      b.textContent = 'GRAB';
      Object.assign(b.style, { position: 'fixed', bottom: '9%', width: '92px', height: '92px', borderRadius: '50%', border: '3px solid rgba(95,191,106,0.9)', background: 'rgba(95,191,106,0.22)', color: '#f2eee6', font: 'bold 16px system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', touchAction: 'none' });
      if (right) b.style.right = '7%'; else b.style.left = '7%';
      root.appendChild(b);
      return b;
    };
    touchUI = { root, sticks: { p1: mkStick(), p2: mkStick() }, grabs: { p1: mkGrab(true), p2: null }, active: {} };
    if (mode === '2p') { touchUI.grabs.p1.style.right = ''; touchUI.grabs.p1.style.left = '36%'; touchUI.grabs.p2 = mkGrab(true); }
    document.body.appendChild(root);
    for (const who of ['p1', 'p2']) {
      const g = touchUI.grabs[who]; if (!g) continue;
      g.addEventListener('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); touch[who].grab = true; touch[who].grabPress = true; g.style.background = 'rgba(95,191,106,0.5)'; refresh(); }, { passive: false });
      const off = (e) => { e.preventDefault(); touch[who].grab = false; g.style.background = 'rgba(95,191,106,0.22)'; refresh(); };
      g.addEventListener('touchend', off, { passive: false }); g.addEventListener('touchcancel', off, { passive: false });
    }
  }

  function zoneFor(x) {
    const W = window.innerWidth;
    if (mode === '2p') return x < W * 0.28 ? 'p1' : (x > W * 0.52 && x < W * 0.8 ? 'p2' : null);
    return x < W * 0.5 ? 'p1' : null;
  }

  function onTouchStart(e) {
    if (!touchUI) buildTouchUI();
    for (const t of e.changedTouches) {
      const who = zoneFor(t.clientX);
      if (!who || touchUI.active[who]) continue;
      if (e.target instanceof Node && e.target !== document.body && touchUI.root.contains(e.target)) continue;
      touchUI.active[who] = { id: t.identifier, x0: t.clientX, y0: t.clientY, t0: performance.now(), flicked: false };
      const st = touchUI.sticks[who];
      st.base.style.display = 'block'; st.base.style.left = t.clientX + 'px'; st.base.style.top = t.clientY + 'px';
      st.knob.style.transform = 'translate(-50%,-50%)';
      e.preventDefault();
    }
  }
  function onTouchMove(e) {
    if (!touchUI) return;
    for (const t of e.changedTouches) {
      for (const who of ['p1', 'p2']) {
        const a = touchUI.active[who]; if (!a || a.id !== t.identifier) continue;
        const dx = t.clientX - a.x0, dy = t.clientY - a.y0;
        const lim = 44, len = Math.hypot(dx, dy), k = len > lim ? lim / len : 1;
        touchUI.sticks[who].knob.style.transform = `translate(calc(-50% + ${dx * k}px), calc(-50% + ${dy * k}px))`;
        touch[who].spin = dx > 16 ? 1 : dx < -16 ? -1 : 0;
        if (!a.flicked && performance.now() - a.t0 < 320) {
          if (dy < -34) { touch[who].jump = true; a.flicked = true; }
          else if (dy > 34) { touch[who].kick = true; a.flicked = true; }
        }
        e.preventDefault();
      }
    }
    refresh();
  }
  function onTouchEnd(e) {
    if (!touchUI) return;
    for (const t of e.changedTouches) {
      for (const who of ['p1', 'p2']) {
        const a = touchUI.active[who]; if (!a || a.id !== t.identifier) continue;
        // quick tap without movement = jump
        if (!a.flicked && performance.now() - a.t0 < 180 && Math.hypot(t.clientX - a.x0, t.clientY - a.y0) < 12) touch[who].jump = true;
        touchUI.active[who] = null; touch[who].spin = 0;
        touchUI.sticks[who].base.style.display = 'none';
      }
    }
    refresh();
  }
  // touch: true forces the overlay logic on (testing); false disables; default = auto-detect
  const touchEnabled = o.touch === true || (o.touch !== false && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
  if (touchEnabled) {
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: false });
    window.addEventListener('touchcancel', onTouchEnd, { passive: false });
  }

  const api = {
    p1, p2,
    get mode() { return mode; },
    setMode(m) { mode = m; if (touchUI) { touchUI.root.remove(); touchUI = null; } refresh(); },
    /** Snapshot intents and clear jump/kick edges. Call once per game step. */
    consume() {
      refresh();
      const out = { p1: { ...p1 }, p2: { ...p2 } };
      edges.p1.jump = edges.p1.kick = edges.p1.grab = edges.p2.jump = edges.p2.kick = edges.p2.grab = false;
      touch.p1.jump = touch.p1.kick = touch.p1.grabPress = touch.p2.jump = touch.p2.kick = touch.p2.grabPress = false;
      refresh();
      return out;
    },
    update() { return api.consume(); },
    isDown(code) { return down.has(code); },
    _debug() { return { touch, active: touchUI ? touchUI.active : null, touchEnabled }; },
    destroy() {
      target.removeEventListener('keydown', onKeyDown); target.removeEventListener('keyup', onKeyUp); window.removeEventListener('blur', onBlur);
      window.removeEventListener('touchstart', onTouchStart); window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd); window.removeEventListener('touchcancel', onTouchEnd);
      if (touchUI) { touchUI.root.remove(); touchUI = null; }
    },
  };
  return api;
}
