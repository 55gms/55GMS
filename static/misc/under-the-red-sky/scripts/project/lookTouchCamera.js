export {
  onLookTouchStart,
  updateTouchPosition,
  onLookTouchEnd,
  getCameraMovement,
  onPinchStart,
  updatePinch,
  onPinchEnd,
  consumePinch,
  isPinchActive,
  configureLookTouchCamera,
  resetLookTouchCamera,
};

// Turns raw look-touch positions into camera movement with speed-based gain
// (fast flicks rotate superlinearly more than slow drags) and momentum
// (the camera keeps coasting after release and decays smoothly).
// Owns all velocity tracking itself — Touch.SpeedForID is an instantaneous
// single-segment velocity that reads near-zero at finger lift, so release
// momentum is computed from a ~100ms window of our own samples instead.

// captured via runOnStartup so the module can read the canvas size itself;
// guarded so the module still imports outside Construct (e.g. node tests)
let c3Runtime = null;
runOnStartup((runtime) => {
  c3Runtime = runtime;
});

const config = {
  // divisor turning pixel deltas into "fraction of screen" units.
  // null = auto: read the canvas's SHORT side (min of canvasCssWidth/Height)
  // at each touch start — the short side doesn't swap when the device
  // rotates, so the same physical swipe rotates the same amount in portrait
  // and landscape. Assumes the wiring feeds CSS-pixel coords
  // (Touch.AbsoluteXForID). Set a number to override, e.g. if feeding
  // layout coordinates instead.
  referenceDimension: null,
  // per-axis output multipliers (yaw / pitch). Velocity here is in
  // screens/sec, not the pixels/sec of the old `Speed * 2 * dt` expression,
  // so the old `2` gets multiplied by a 1280px reference width to land in
  // the same output range. Applied last, after all thresholds, so tuning
  // these never requires retuning maxSpeed/minFlickSpeed/momentumCutoff
  sensitivityX: 640,
  sensitivityY: 320,
  // gain curve exponent; ~1.3–1.7 feels right, above ~2.0 aiming gets twitchy
  gainExponent: 1.5,
  // normalized speed (screens/sec) at which the gain curve is exactly 1:1;
  // ordinary drags sit around 0.3–1 screens/sec, so this keeps them near
  // 1:1 tracking while flicks past it get boosted superlinearly
  referenceSpeed: 1.5,
  // normalized speed clamp before the gain curve, so one tiny time gap
  // between samples can't produce a spike that lurches the camera
  maxSpeed: 8,
  // exponential smoothing factor for the live drag velocity (0 = off, 1 = raw)
  smoothing: 0.3,
  // per-axis momentum decay: fraction of momentum left after 1 second.
  // X (yaw) is unbounded so it coasts like a turntable; Y (pitch) is clamped
  // so coasting reads as a glitch — 0 kills it entirely
  decayX: 0.003,
  decayY: 0.001,
  // cap on seeded momentum magnitude (post-gain screens/sec). Bounds the
  // total coast: rotation ≈ sensitivity * min(momentum, cap) / ln(1/decayX),
  // so 2.5 here with decayX 0.01 tops out around one full turn
  maxMomentum: 6,
  // normalized speed below which a coasting momentum component snaps to zero
  momentumCutoff: 0.05,
  // normalized release speed below which no momentum is seeded (gentle
  // release / tap shouldn't drift)
  minFlickSpeed: 7.7,
  // a release also only seeds momentum if the touch travelled at least this
  // net distance (screens) within the last flickWindowDuration seconds — a
  // fast but tiny adjustment shouldn't coast no matter how quick it was
  minFlickDistance: 0.8,
  // lookback for the distance gate; longer than the velocity window so it
  // measures the sweep of the gesture, not just its final instant
  flickWindowDuration: 0.15,
  // a release only seeds momentum if the whole touch lasted at least this
  // many seconds — a blink-short graze shouldn't coast
  minFlickDuration: 0.084,
  // history window used for the release velocity, in seconds
  historyDuration: 0.1,
  // must cover flickWindowDuration at high refresh rates (120Hz ≈ 30 samples
  // in 0.15s), or the distance window silently shrinks
  maxHistorySamples: 32,
  // change in finger separation needed to register one pinch, normalized to
  // the reference dimension (i.e. a fraction of the short side, same units as
  // everything else here). Re-armed after each trigger and measured from the
  // gesture's turning point, so reversing direction without lifting fires the
  // opposite pinch as soon as the fingers travel this far back the other way
  pinchThreshold: 0.7,
  // TEMP: on-screen flick readout on every release — delete together with
  // the showFlickDebug section at the bottom when done tuning
  debug: false,
};

let isActive = false;
// when the current gesture began, for the minFlickDuration gate
let touchStartTime = 0;
// normalization divisor sampled once per gesture, so a mid-drag canvas
// resize can't change units under the history buffer and fake a delta
let refDim = 1280;
// ring of {x, y, time} in normalized screen units / seconds
const history = [];
let lastX = 0;
let lastY = 0;
let lastTime = 0;
let smoothedVelX = 0;
let smoothedVelY = 0;
// smoothed live velocity after the gain curve, sampled each updateTouchPosition
let currentVelX = 0;
let currentVelY = 0;
let momentumX = 0;
let momentumY = 0;

// two-finger pinch: discrete open/close triggers that re-arm on reversal.
let pinchActive = false;
// running extremes of finger separation since the last trigger (or the
// gesture start), so a reversal is measured from the turning point rather
// than from wherever the last trigger happened to fire
let pinchPeak = 0;
let pinchTrough = 0;
// direction of the last fired trigger (+1 = spread/open, -1 = close). Latched
// so one continuous swing fires exactly once; only a reversal past the
// threshold clears it enough to fire again the other way
let pinchLastDir = 0;
// net triggers awaiting consumption: +1 per open (spread), -1 per close
let pinchNet = 0;
// continuous change in finger separation awaiting consumption (normalized),
// signed the same way: positive = spreading, negative = closing. Accumulates
// every tick regardless of the trigger threshold
let pinchDelta = 0;
// separation at the previous updatePinch, to derive each tick's increment
let pinchPrevSep = 0;
// two-finger centroid drag, independent of the pinch separation: the running
// change in the midpoint between the two fingers since the last consume,
// normalized by refDim like pinchDelta. Lets a two-finger pan/swipe be read
// alongside the spread/close, e.g. a vertical swipe driving photo-mode focus.
let dragX = 0;
let dragY = 0;
// midpoint at the previous updatePinch, to derive each tick's centroid shift
let prevMidX = 0;
let prevMidY = 0;

function configureLookTouchCamera(overrides) {
  Object.assign(config, overrides);
}

function resetLookTouchCamera() {
  isActive = false;
  history.length = 0;
  smoothedVelX = 0;
  smoothedVelY = 0;
  currentVelX = 0;
  currentVelY = 0;
  momentumX = 0;
  momentumY = 0;
  pinchActive = false;
  pinchLastDir = 0;
  pinchNet = 0;
  pinchDelta = 0;
  dragX = 0;
  dragY = 0;
}

// the normalization divisor: the canvas's short side (which doesn't swap on
// rotation) unless overridden. Sampled once per gesture so a mid-gesture
// resize can't shift units under the running history/pinch buffers
function sampleRefDim() {
  const platformInfo = c3Runtime?.platformInfo;
  return (
    config.referenceDimension ??
    (platformInfo
      ? Math.min(platformInfo.canvasCssWidth, platformInfo.canvasCssHeight)
      : refDim)
  );
}

// x/y are optional; if omitted the first updateTouchPosition seeds the history
function onLookTouchStart(x, y) {
  isActive = true;
  refDim = sampleRefDim();

  // grabbing the camera while it coasts must kill momentum on contact,
  // or it fights the finger
  momentumX = 0;
  momentumY = 0;

  history.length = 0;
  smoothedVelX = 0;
  smoothedVelY = 0;
  currentVelX = 0;
  currentVelY = 0;
  lastTime = performance.now() / 1000;
  touchStartTime = lastTime;

  if (x !== undefined && y !== undefined) {
    lastX = x / refDim;
    lastY = y / refDim;
    history.push({ x: lastX, y: lastY, time: lastTime });
  }
}

function updateTouchPosition(x, y) {
  if (!isActive) return;

  const time = performance.now() / 1000;
  const nx = x / refDim;
  const ny = y / refDim;

  // no history yet means onLookTouchStart was called without a position
  if (history.length === 0) {
    lastX = nx;
    lastY = ny;
    lastTime = time;
    history.push({ x: nx, y: ny, time });
    return;
  }

  const deltaTime = time - lastTime;
  // two samples in the same timestamp can't produce a velocity; keep the
  // previous one rather than dividing by ~0
  if (deltaTime > 0) {
    const rawVelX = (nx - lastX) / deltaTime;
    const rawVelY = (ny - lastY) / deltaTime;
    smoothedVelX = smoothedVelX + (rawVelX - smoothedVelX) * config.smoothing;
    smoothedVelY = smoothedVelY + (rawVelY - smoothedVelY) * config.smoothing;
    [currentVelX, currentVelY] = applyGain(smoothedVelX, smoothedVelY);
  }

  lastX = nx;
  lastY = ny;
  lastTime = time;
  history.push({ x: nx, y: ny, time });
  trimHistory(time);
}

function onLookTouchEnd() {
  isActive = false;
  currentVelX = 0;
  currentVelY = 0;

  // a look-touch lifting mid-pinch must not seed a throw: the pinch owns the
  // camera and has already killed momentum, and this finger's motion was part
  // of the pinch, not a flick
  if (pinchActive) {
    momentumX = 0;
    momentumY = 0;
    return;
  }

  // release velocity comes from the oldest/newest pair of the ~100ms window,
  // not the final segment — the finger decelerating off the glass would
  // otherwise zero out the throw
  if (history.length < 2) {
    if (config.debug) showFlickDebug(null);
    return;
  }

  const newest = history[history.length - 1];
  const oldest = history[0];

  // all three gates are evaluated together (no early returns) so the debug
  // readout can report every one, not just the first that failed

  // duration: a blink-short graze shouldn't coast however fast it was
  const duration = newest.time - touchStartTime;

  // distance: the buffer spans flickWindowDuration, so its head is the
  // gesture's position up to that long ago — a fast but tiny adjustment has
  // high speed yet barely any net travel, and shouldn't coast
  const travelled = Math.hypot(newest.x - oldest.x, newest.y - oldest.y);

  // speed: anchored on the oldest sample still inside the (shorter)
  // velocity window, so the reading stays a ~100ms average
  let velAnchor = oldest;
  for (const sample of history) {
    if (newest.time - sample.time <= config.historyDuration) {
      velAnchor = sample;
      break;
    }
  }
  const windowTime = newest.time - velAnchor.time;
  const velX = windowTime > 0 ? (newest.x - velAnchor.x) / windowTime : 0;
  const velY = windowTime > 0 ? (newest.y - velAnchor.y) / windowTime : 0;
  const speed = Math.hypot(velX, velY);

  const durationOk = duration >= config.minFlickDuration;
  const travelledOk = travelled >= config.minFlickDistance;
  const speedOk = windowTime > 0 && speed >= config.minFlickSpeed;
  const seeded = durationOk && travelledOk && speedOk;

  if (seeded) {
    // same gain curve as dragging, so a hard flick's boosted strength
    // carries into the spin
    [momentumX, momentumY] = applyGain(velX, velY);

    // the gain curve is unbounded upward, so cap the seed or the hardest
    // flicks coast for multiple full rotations
    const momentumMag = Math.hypot(momentumX, momentumY);
    if (momentumMag > config.maxMomentum) {
      const capScale = config.maxMomentum / momentumMag;
      momentumX *= capScale;
      momentumY *= capScale;
    }
  }

  if (config.debug) {
    showFlickDebug({
      duration,
      travelled,
      speed,
      durationOk,
      travelledOk,
      speedOk,
      seeded,
    });
  }
}

// finger separation, normalized to the reference dimension so the threshold
// means the same physical spread regardless of resolution or orientation
function pinchSeparation(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1) / refDim;
}

function onPinchStart(x1, y1, x2, y2) {
  pinchActive = true;
  refDim = sampleRefDim();

  const d = pinchSeparation(x1, y1, x2, y2);
  pinchPeak = d;
  pinchTrough = d;
  pinchPrevSep = d;
  pinchLastDir = 0;

  // seed the centroid so the first updatePinch measures from the fingers'
  // starting midpoint (no spurious jump), and clear any pending drag
  prevMidX = (x1 + x2) / 2;
  prevMidY = (y1 + y2) / 2;
  dragX = 0;
  dragY = 0;

  // a pinch overrides the look-drag: freeze the camera and kill any coast so
  // the two-finger gesture doesn't also swing the view
  momentumX = 0;
  momentumY = 0;
  currentVelX = 0;
  currentVelY = 0;
  smoothedVelX = 0;
  smoothedVelY = 0;
}

function updatePinch(x1, y1, x2, y2) {
  if (!pinchActive) return;

  const d = pinchSeparation(x1, y1, x2, y2);

  // continuous readout: this tick's change in separation, threshold-free
  pinchDelta += d - pinchPrevSep;
  pinchPrevSep = d;

  // centroid drag: this tick's shift of the two-finger midpoint, normalized
  // like the separation so a pan reads in the same units regardless of
  // resolution/orientation. Independent of pinchDelta — a vertical two-finger
  // swipe keeps separation ~constant (delta ~0) while dragY accumulates
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  dragX += (mx - prevMidX) / refDim;
  dragY += (my - prevMidY) / refDim;
  prevMidX = mx;
  prevMidY = my;

  // extend the extremes so the turning point of a swing is always remembered,
  // even before/between triggers
  if (d > pinchPeak) pinchPeak = d;
  if (d < pinchTrough) pinchTrough = d;

  // spread past the threshold, measured from the lowest point of the swing.
  // The latch blocks a second open on the same swing — only a reversal
  // (which fires a close) re-arms it
  if (d - pinchTrough >= config.pinchThreshold && pinchLastDir !== 1) {
    pinchNet += 1;
    pinchLastDir = 1;
    pinchPeak = d;
    pinchTrough = d;
  } else if (pinchPeak - d >= config.pinchThreshold && pinchLastDir !== -1) {
    // closed past the threshold, measured from the highest point of the swing
    pinchNet -= 1;
    pinchLastDir = -1;
    pinchPeak = d;
    pinchTrough = d;
  }
}

function onPinchEnd() {
  pinchActive = false;
}

// pinch state since the last call, then clears the accumulators. Poll once
// per tick like getCameraMovement. Both fields are signed the same way:
// positive = fingers spread apart (zoom in), negative = pinched together
// (zoom out).
//   trigger: discrete notches — 0 until the fingers travel pinchThreshold,
//            then ±1 per swing (re-armed by reversal). In practice -1, 0, or
//            +1 per tick.
//   delta:   the raw change in normalized separation this tick, with no
//            threshold — non-zero as soon as the fingers move at all
//   dragX/Y: the raw change in the two-finger centroid this tick (normalized),
//            independent of delta — a two-finger pan/swipe. +dragY = fingers
//            moved down the screen.
function consumePinch() {
  const result = { trigger: pinchNet, delta: pinchDelta, dragX, dragY };
  pinchNet = 0;
  pinchDelta = 0;
  dragX = 0;
  dragY = 0;
  return result;
}

function isPinchActive() {
  return pinchActive;
}

function getCameraMovement(dt) {
  // a pinch freezes the camera entirely and keeps momentum dead, so a
  // two-finger gesture never doubles as a look-drag or leaves a coast behind
  if (pinchActive) {
    momentumX = 0;
    momentumY = 0;
    return { moveX: 0, moveY: 0 };
  }

  if (isActive) {
    return {
      moveX: currentVelX * config.sensitivityX * dt,
      moveY: currentVelY * config.sensitivityY * dt,
    };
  }

  const moveX = momentumX * config.sensitivityX * dt;
  const moveY = momentumY * config.sensitivityY * dt;

  // pow(decay, dt) makes the decay rate framerate-independent
  momentumX *= Math.pow(config.decayX, dt);
  momentumY *= Math.pow(config.decayY, dt);
  if (Math.abs(momentumX) < config.momentumCutoff) momentumX = 0;
  if (Math.abs(momentumY) < config.momentumCutoff) momentumY = 0;

  return { moveX, moveY };
}

// reshape the velocity's magnitude with a power curve, keeping its direction:
// below referenceSpeed stays near 1:1 tracking, above accelerates superlinearly
function applyGain(velX, velY) {
  const mag = Math.hypot(velX, velY);
  if (mag === 0) return [0, 0];

  const clamped = Math.min(mag, config.maxSpeed);
  const gained =
    config.referenceSpeed *
    Math.pow(clamped / config.referenceSpeed, config.gainExponent);
  const scale = gained / mag;
  return [velX * scale, velY * scale];
}

function trimHistory(now) {
  // keep enough to serve both lookbacks: velocity uses historyDuration,
  // the flick distance gate uses flickWindowDuration
  const span = Math.max(config.historyDuration, config.flickWindowDuration);
  while (
    history.length > config.maxHistorySamples ||
    (history.length > 2 && now - history[0].time > span)
  ) {
    history.shift();
  }
}

// ─── TEMP flick debug overlay — delete this whole section (and config.debug)
//     when done tuning ───────────────────────────────────────────────────────

let debugPanel = null;
let debugFlickCount = 0;

function showFlickDebug(stats) {
  debugFlickCount++;
  const lines = [];

  if (!stats) {
    lines.push(
      `flick #${debugFlickCount}  <b style="color:#f66">NO MOMENTUM</b>` +
        ` <span style="color:#f66">(released before any movement was sampled)</span>`,
    );
  } else {
    const gate = (label, value, need, ok) =>
      `<span style="color:${ok ? "#6f6" : "#f66"}">${ok ? "✓" : "✗"} ` +
      `${label}: ${value} (need ≥ ${need})</span>`;

    lines.push(
      `flick #${debugFlickCount}  ` +
        (stats.seeded
          ? `<b style="color:#6f6">MOMENTUM ${Math.hypot(momentumX, momentumY).toFixed(2)} scr/s</b>` +
            ` (X ${momentumX.toFixed(2)}, Y ${momentumY.toFixed(2)})`
          : `<b style="color:#f66">NO MOMENTUM</b>`),
      gate(
        "duration ",
        stats.duration.toFixed(3) + "s",
        config.minFlickDuration + "s",
        stats.durationOk,
      ),
      gate(
        "distance ",
        stats.travelled.toFixed(3) + " scr",
        config.minFlickDistance + " scr",
        stats.travelledOk,
      ),
      gate(
        "end speed",
        stats.speed.toFixed(2) + " scr/s",
        config.minFlickSpeed + " scr/s",
        stats.speedOk,
      ),
    );
  }

  // worker mode has no DOM — fall back to the console
  if (typeof document === "undefined") {
    console.log(lines.join("\n").replace(/<[^>]*>/g, ""));
    return;
  }

  if (!debugPanel) {
    debugPanel = document.createElement("div");
    debugPanel.style.cssText =
      "position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:99999;" +
      "background:rgba(0,0,0,0.75);color:#fff;font:14px/1.5 monospace;" +
      "padding:8px 12px;border-radius:6px;pointer-events:none;white-space:pre;";
    document.body.appendChild(debugPanel);
  }
  debugPanel.innerHTML = lines.join("<br>");
}
