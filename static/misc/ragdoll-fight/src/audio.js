// Ragdoll Fight — synthesised sound effects (WebAudio, no audio files).
//
// API:
//   play(name, {volume = 1, pitch = 1} = {})   -> fire a one-shot SFX (ignored until unlocked / when muted)
//   unlock()                                     -> create/resume the AudioContext (auto-registered on first pointer/key)
//   setMuted(bool | null)                        -> force mute; null = follow save settings.sound
//   setMasterVolume(0..1)
//   isEnabled() -> bool
//   SOUND_NAMES
//
// Master mute follows save.get().settings.sound automatically.
// Mix: every voice -> master gain -> gentle high-shelf cut -> compressor (soft limiter) -> speakers.

import * as save from './save.js';

export const SOUND_NAMES = [
  'swing', 'hit_light', 'hit_heavy', 'hit_metal', 'hit_wood', 'crit', 'hitmarker', 'ko', 'gore', 'jump', 'kick',
  'grab', 'fire', 'coin', 'click', 'explosion', 'slice_award', 'win', 'lose',
  'throw', 'squish', 'slam', 'laser_charge', 'laser',
];

const MAX_VOICES = 16;
const MIN_REPEAT = 0.035; // seconds between two plays of the same sound
const MUSICAL = new Set(['coin', 'click', 'slice_award', 'win', 'lose', 'hitmarker']);

let ac = null;
let master = null;
let noiseBuf = null;
let voices = 0;
let forcedMute = null;
let masterVolume = 0.75;
const lastPlayed = Object.create(null);

function soundOn() {
  if (forcedMute !== null) return !forcedMute;
  try { return save.get().settings.sound !== false; } catch (e) { return true; }
}

function applyGain() {
  if (!master) return;
  const target = soundOn() ? masterVolume : 0;
  master.gain.setTargetAtTime(target, ac.currentTime, 0.02);
}

function ensure() {
  if (ac) return ac;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    ac = new AC();
  } catch (e) {
    return null;
  }
  // soft limiter so a pile of hits never distorts
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -20;
  comp.knee.value = 14;
  comp.ratio.value = 4;
  comp.attack.value = 0.004;
  comp.release.value = 0.2;
  // take the fizz off synthesized noise
  const shelf = ac.createBiquadFilter();
  shelf.type = 'highshelf';
  shelf.frequency.value = 7000;
  shelf.gain.value = -6;
  master = ac.createGain();
  master.gain.value = soundOn() ? masterVolume : 0;
  master.connect(shelf);
  shelf.connect(comp);
  comp.connect(ac.destination);

  const len = Math.floor(ac.sampleRate * 1.2);
  noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return ac;
}

export function unlock() {
  const c = ensure();
  if (c && c.state === 'suspended') c.resume().catch(() => {});
  if (c && c.state === 'running') removeUnlockListeners();
}

const UNLOCK_EVENTS = ['pointerdown', 'keydown', 'touchstart'];
function removeUnlockListeners() {
  for (const ev of UNLOCK_EVENTS) window.removeEventListener(ev, unlock, true);
}
if (typeof window !== 'undefined') {
  for (const ev of UNLOCK_EVENTS) window.addEventListener(ev, unlock, { capture: true, passive: true });
}

save.on('change', applyGain);

export function setMuted(v) {
  forcedMute = v === null || v === undefined ? null : !!v;
  applyGain();
}

export function setMasterVolume(v) {
  masterVolume = Math.max(0, Math.min(1, Number(v) || 0));
  applyGain();
}

export function isEnabled() {
  return soundOn();
}

// ---------- primitives ----------

// Oscillator with frequency glide f0 -> f1 and attack / exponential decay envelope.
function tone(out, { type = 'sine', f0, f1 = f0, t = 0, dur = 0.1, vol = 0.3, attack = 0.004 }) {
  const t0 = ac.currentTime + t;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(20, f0), t0);
  if (f1 !== f0) osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(out);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

// Filtered white noise with a filter sweep f0 -> f1.
function noise(out, { t = 0, dur = 0.1, vol = 0.3, filter = 'lowpass', f0 = 2000, f1 = f0, q = 1, attack = 0.003 }) {
  const t0 = ac.currentTime + t;
  const src = ac.createBufferSource();
  src.buffer = noiseBuf;
  src.playbackRate.value = 0.9 + Math.random() * 0.2;
  const flt = ac.createBiquadFilter();
  flt.type = filter;
  flt.Q.value = q;
  flt.frequency.setValueAtTime(Math.max(20, f0), t0);
  if (f1 !== f0) flt.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(flt);
  flt.connect(g);
  g.connect(out);
  const offset = Math.random() * Math.max(0, noiseBuf.duration - dur - 0.08);
  src.start(t0, offset, dur + 0.05);
}

function notes(out, freqs, { type = 'triangle', step = 0.1, dur = 0.14, last = 0.4, vol = 0.2, p = 1 }) {
  freqs.forEach((f, i) => {
    const isLast = i === freqs.length - 1;
    tone(out, { type, f0: f * p, t: i * step, dur: isLast ? last : dur, vol });
    tone(out, { type: 'sine', f0: f * p * 2, t: i * step, dur: (isLast ? last : dur) * 0.8, vol: vol * 0.2 });
  });
}

// ---------- sound designs: (out, p = pitch mult, v = volume mult) -> duration ----------

const SOUNDS = {
  // soft airy whoosh of a swinging arm / weapon
  swing(o, p, v) {
    noise(o, { dur: 0.2, vol: 0.14 * v, filter: 'bandpass', f0: 480 * p, f1: 1500 * p, q: 0.9, attack: 0.05 });
    return 0.22;
  },
  // body punch: round low thump + a short muffled slap
  hit_light(o, p, v) {
    tone(o, { f0: 170 * p, f1: 70 * p, dur: 0.1, vol: 0.5 * v, attack: 0.002 });
    noise(o, { dur: 0.045, vol: 0.2 * v, f0: 1400 * p, f1: 600 * p });
    return 0.12;
  },
  // heavy hit: deeper thump with body, no buzz
  hit_heavy(o, p, v) {
    tone(o, { f0: 125 * p, f1: 44 * p, dur: 0.22, vol: 0.7 * v, attack: 0.002 });
    tone(o, { type: 'triangle', f0: 240 * p, f1: 110 * p, dur: 0.07, vol: 0.14 * v, attack: 0.002 });
    noise(o, { dur: 0.13, vol: 0.28 * v, f0: 1000 * p, f1: 220 * p });
    return 0.24;
  },
  // light metallic clank (hazards, helmets)
  hit_metal(o, p, v) {
    const base = 820 * p;
    [1, 1.52, 2.37].forEach((r, i) => {
      tone(o, { type: i ? 'sine' : 'triangle', f0: base * r, dur: 0.24 - i * 0.05, vol: (0.1 - i * 0.025) * v, attack: 0.001 });
    });
    noise(o, { dur: 0.025, vol: 0.12 * v, filter: 'highpass', f0: 3500 });
    return 0.26;
  },
  // wooden knock (bats, staffs, clubs)
  hit_wood(o, p, v) {
    noise(o, { dur: 0.06, vol: 0.4 * v, filter: 'bandpass', f0: 760 * p, q: 3.5 });
    tone(o, { type: 'triangle', f0: 330 * p, f1: 230 * p, dur: 0.07, vol: 0.2 * v, attack: 0.002 });
    tone(o, { f0: 120 * p, f1: 70 * p, dur: 0.08, vol: 0.3 * v, attack: 0.002 });
    return 0.09;
  },
  // critical: bright rising ping layered on top of the hit sound
  crit(o, p, v) {
    tone(o, { type: 'triangle', f0: 1100 * p, f1: 1650 * p, dur: 0.09, vol: 0.12 * v, attack: 0.002 });
    tone(o, { f0: 2200 * p, t: 0.05, dur: 0.22, vol: 0.08 * v });
    return 0.28;
  },
  // clean hitmarker tick: two short bright partials + a tiny click transient
  hitmarker(o, p, v) {
    tone(o, { type: 'triangle', f0: 2300 * p, dur: 0.035, vol: 0.16 * v, attack: 0.001 });
    tone(o, { f0: 3450 * p, t: 0.003, dur: 0.028, vol: 0.07 * v, attack: 0.001 });
    noise(o, { dur: 0.012, vol: 0.05 * v, filter: 'highpass', f0: 5500 });
    return 0.05;
  },
  // knock-out: soft body drop + low falling tone
  ko(o, p, v) {
    tone(o, { f0: 95 * p, f1: 36 * p, dur: 0.38, vol: 0.6 * v, attack: 0.003 });
    noise(o, { dur: 0.3, vol: 0.22 * v, f0: 700 * p, f1: 110 });
    tone(o, { type: 'triangle', f0: 330 * p, f1: 110 * p, t: 0.03, dur: 0.42, vol: 0.1 * v });
    return 0.46;
  },
  // wet squelch (dismember / big blade hits)
  gore(o, p, v) {
    noise(o, { dur: 0.2, vol: 0.3 * v, filter: 'bandpass', f0: 1100 * p, f1: 320 * p, q: 3 });
    tone(o, { f0: 150 * p, f1: 60 * p, dur: 0.14, vol: 0.28 * v });
    return 0.22;
  },
  jump(o, p, v) {
    tone(o, { f0: 280 * p, f1: 520 * p, dur: 0.1, vol: 0.14 * v });
    noise(o, { dur: 0.06, vol: 0.05 * v, filter: 'bandpass', f0: 900 * p, q: 1 });
    return 0.12;
  },
  kick(o, p, v) {
    tone(o, { f0: 150 * p, f1: 60 * p, dur: 0.12, vol: 0.42 * v, attack: 0.002 });
    noise(o, { dur: 0.05, vol: 0.14 * v, f0: 900 * p });
    return 0.13;
  },
  // soft grip click
  grab(o, p, v) {
    tone(o, { type: 'triangle', f0: 720 * p, dur: 0.03, vol: 0.12 * v, attack: 0.001 });
    tone(o, { type: 'triangle', f0: 1080 * p, t: 0.035, dur: 0.035, vol: 0.08 * v, attack: 0.001 });
    return 0.08;
  },
  // fists catching fire: rising breathy whoosh
  fire(o, p, v) {
    noise(o, { dur: 0.45, vol: 0.22 * v, filter: 'bandpass', f0: 300 * p, f1: 1800 * p, q: 0.8, attack: 0.06 });
    tone(o, { f0: 90 * p, f1: 160 * p, dur: 0.3, vol: 0.12 * v });
    return 0.48;
  },
  // bell-like coin chime
  coin(o, p, v) {
    tone(o, { f0: 1318 * p, dur: 0.18, vol: 0.12 * v, attack: 0.002 });
    tone(o, { f0: 1760 * p, t: 0.07, dur: 0.32, vol: 0.12 * v, attack: 0.002 });
    tone(o, { f0: 3520 * p, t: 0.07, dur: 0.15, vol: 0.03 * v });
    return 0.4;
  },
  click(o, p, v) {
    tone(o, { f0: 900 * p, f1: 700 * p, dur: 0.04, vol: 0.14 * v, attack: 0.001 });
    return 0.05;
  },
  // deep, rounded boom
  explosion(o, p, v) {
    noise(o, { dur: 0.85, vol: 0.55 * v, f0: 1500 * p, f1: 60, attack: 0.004 });
    noise(o, { dur: 0.22, vol: 0.18 * v, filter: 'bandpass', f0: 320 * p, q: 1.2 });
    tone(o, { f0: 68 * p, f1: 30 * p, dur: 0.7, vol: 0.7 * v, attack: 0.003 });
    return 0.9;
  },
  // boss lobs something: short upward whoosh
  throw(o, p, v) {
    noise(o, { dur: 0.22, vol: 0.2 * v, filter: 'bandpass', f0: 350 * p, f1: 1300 * p, q: 1.1, attack: 0.03 });
    tone(o, { type: 'triangle', f0: 180 * p, f1: 320 * p, dur: 0.12, vol: 0.1 * v });
    return 0.24;
  },
  // soft cheesy splat / bounce
  squish(o, p, v) {
    noise(o, { dur: 0.14, vol: 0.3 * v, filter: 'bandpass', f0: 900 * p, f1: 260 * p, q: 2.2 });
    tone(o, { f0: 210 * p, f1: 90 * p, dur: 0.1, vol: 0.25 * v, attack: 0.002 });
    return 0.16;
  },
  // giant hammer hitting the floor: sub boom + crunchy debris
  slam(o, p, v) {
    tone(o, { f0: 60 * p, f1: 26 * p, dur: 0.8, vol: 0.85 * v, attack: 0.002 });
    tone(o, { type: 'triangle', f0: 130 * p, f1: 50 * p, dur: 0.25, vol: 0.3 * v, attack: 0.002 });
    noise(o, { dur: 0.6, vol: 0.5 * v, f0: 900 * p, f1: 70, attack: 0.002 });
    noise(o, { t: 0.04, dur: 0.3, vol: 0.14 * v, filter: 'bandpass', f0: 2400 * p, f1: 900 * p, q: 1.5 });
    return 0.85;
  },
  // laser eyes charging: rising hum
  laser_charge(o, p, v) {
    tone(o, { type: 'sawtooth', f0: 110 * p, f1: 440 * p, dur: 0.95, vol: 0.05 * v, attack: 0.4 });
    tone(o, { f0: 330 * p, f1: 1500 * p, dur: 0.95, vol: 0.07 * v, attack: 0.5 });
    return 1;
  },
  // laser pulse: bright falling zap
  laser(o, p, v) {
    tone(o, { type: 'square', f0: 1900 * p, f1: 240 * p, dur: 0.16, vol: 0.07 * v, attack: 0.002 });
    tone(o, { f0: 950 * p, f1: 180 * p, dur: 0.2, vol: 0.14 * v, attack: 0.002 });
    noise(o, { dur: 0.08, vol: 0.1 * v, filter: 'highpass', f0: 3000 });
    return 0.22;
  },
  // crown earned on the results screen: soft bell
  slice_award(o, p, v) {
    tone(o, { f0: 880 * p, dur: 0.45, vol: 0.13 * v, attack: 0.003 });
    tone(o, { f0: 1320 * p, t: 0.02, dur: 0.4, vol: 0.07 * v, attack: 0.003 });
    tone(o, { f0: 1760 * p, t: 0.04, dur: 0.3, vol: 0.04 * v });
    return 0.5;
  },
  win(o, p, v) {
    notes(o, [523.25, 659.25, 783.99, 1046.5], { step: 0.11, dur: 0.14, last: 0.5, vol: 0.16 * v, p });
    return 0.9;
  },
  lose(o, p, v) {
    notes(o, [392, 329.63, 261.63, 196], { step: 0.17, dur: 0.2, last: 0.6, vol: 0.15 * v, p });
    tone(o, { f0: 98 * p, t: 0.51, dur: 0.55, vol: 0.14 * v });
    return 1.15;
  },
};

export function play(name, opts = {}) {
  if (!ac || !noiseBuf) return false;
  if (ac.state !== 'running') return false;
  if (!soundOn()) return false;
  const fn = SOUNDS[name];
  if (!fn) return false;
  if (voices >= MAX_VOICES) return false;
  const now = ac.currentTime;
  if (lastPlayed[name] !== undefined && now - lastPlayed[name] < MIN_REPEAT) return false;
  lastPlayed[name] = now;

  const spread = MUSICAL.has(name) ? 0.02 : 0.1;
  const p = (opts.pitch ?? 1) * (1 + (Math.random() - 0.5) * spread);
  const v = Math.max(0, Math.min(1.5, (opts.volume ?? 1) * (0.92 + Math.random() * 0.16)));

  const out = ac.createGain();
  out.gain.value = 1;
  out.connect(master);
  let dur = 0.3;
  try {
    dur = fn(out, p, v) || 0.3;
  } catch (e) {
    console.warn('[audio] failed', name, e);
  }
  voices++;
  setTimeout(() => {
    voices = Math.max(0, voices - 1);
    try { out.disconnect(); } catch (e) { /* ignore */ }
  }, (dur + 0.1) * 1000);
  return true;
}

export default { play, unlock, setMuted, setMasterVolume, isEnabled, SOUND_NAMES };
