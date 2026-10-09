export {
  pushRemoteSnapshot,
  sampleRemotePosition,
  dropRemotePlayer,
  resetRemoteInterp,
  remoteInterpTuning,
};

const RING_CAP = 16;

const remoteInterpTuning = {
  PATCH_INTERVAL_MS: 100,
  MIN_RENDER_DELAY_MS: 180,
  MAX_RENDER_DELAY_MS: 700,
  RENDER_DELAY_CADENCE_MULT: 1.8,
  SNAP_DIST: 1200,
  IDLE_GAP_MULT: 3,
  MAX_RESUME_SPAN_MS: 250,
  CADENCE_SMOOTHING: 0.2,
};

const rings = new Map();

function makeRing() {
  return {
    t: new Float64Array(RING_CAP),
    x: new Float64Array(RING_CAP),
    y: new Float64Array(RING_CAP),
    z: new Float64Array(RING_CAP),
    head: 0,
    count: 0,
    cadence: remoteInterpTuning.PATCH_INTERVAL_MS,
  };
}

function write(ring, t, x, y, z) {
  const i = ring.head;
  ring.t[i] = t;
  ring.x[i] = x;
  ring.y[i] = y;
  ring.z[i] = z;
  ring.head = i + 1 >= RING_CAP ? 0 : i + 1;
  if (ring.count < RING_CAP) ring.count++;
}

function newestIndex(ring) {
  return ring.head === 0 ? RING_CAP - 1 : ring.head - 1;
}

function oldestIndex(ring) {
  return (ring.head - ring.count + RING_CAP) % RING_CAP;
}

function renderDelayFor(ring) {
  const tuning = remoteInterpTuning;
  const wanted = ring.cadence * tuning.RENDER_DELAY_CADENCE_MULT;
  if (wanted < tuning.MIN_RENDER_DELAY_MS) return tuning.MIN_RENDER_DELAY_MS;
  if (wanted > tuning.MAX_RENDER_DELAY_MS) return tuning.MAX_RENDER_DELAY_MS;
  return wanted;
}

function pushRemoteSnapshot(sessionId, x, y, z, t = performance.now()) {
  const tuning = remoteInterpTuning;
  let ring = rings.get(sessionId);
  if (ring === undefined) {
    ring = makeRing();
    rings.set(sessionId, ring);
  }

  if (ring.count > 0) {
    const n = newestIndex(ring);
    if (t <= ring.t[n]) return;

    const gap = t - ring.t[n];
    const dx = x - ring.x[n];
    const dy = y - ring.y[n];
    const dz = z - ring.z[n];
    const elapsed = gap / tuning.PATCH_INTERVAL_MS;
    const allowance = tuning.SNAP_DIST * (elapsed > 1 ? elapsed : 1);
    if (Math.sqrt(dx * dx + dy * dy + dz * dz) > allowance) {
      ring.head = 0;
      ring.count = 0;
      ring.cadence = tuning.PATCH_INTERVAL_MS;
      write(ring, t, x, y, z);
      return;
    }

    if (ring.count === 1) {
      ring.cadence = gap;
    } else if (gap > tuning.IDLE_GAP_MULT * ring.cadence) {
      const span =
        ring.cadence < tuning.MAX_RESUME_SPAN_MS
          ? ring.cadence
          : tuning.MAX_RESUME_SPAN_MS;
      write(ring, t - span, ring.x[n], ring.y[n], ring.z[n]);
    } else {
      ring.cadence += (gap - ring.cadence) * tuning.CADENCE_SMOOTHING;
    }
  }

  write(ring, t, x, y, z);
}

function sampleRemotePosition(sessionId, now = performance.now(), out) {
  const ring = rings.get(sessionId);
  if (ring === undefined || ring.count === 0) return null;

  const result = out === undefined ? { x: 0, y: 0, z: 0 } : out;
  const renderT = now - renderDelayFor(ring);
  const newest = newestIndex(ring);

  if (ring.count === 1 || renderT >= ring.t[newest]) {
    result.x = ring.x[newest];
    result.y = ring.y[newest];
    result.z = ring.z[newest];
    return result;
  }

  const oldest = oldestIndex(ring);
  if (renderT <= ring.t[oldest]) {
    result.x = ring.x[oldest];
    result.y = ring.y[oldest];
    result.z = ring.z[oldest];
    return result;
  }

  let b = newest;
  let a = b === 0 ? RING_CAP - 1 : b - 1;
  for (let steps = ring.count - 2; steps > 0 && ring.t[a] > renderT; steps--) {
    b = a;
    a = a === 0 ? RING_CAP - 1 : a - 1;
  }

  const span = ring.t[b] - ring.t[a];
  const k = span > 0 ? (renderT - ring.t[a]) / span : 0;
  result.x = ring.x[a] + (ring.x[b] - ring.x[a]) * k;
  result.y = ring.y[a] + (ring.y[b] - ring.y[a]) * k;
  result.z = ring.z[a] + (ring.z[b] - ring.z[a]) * k;
  return result;
}

function dropRemotePlayer(sessionId) {
  rings.delete(sessionId);
}

function resetRemoteInterp() {
  rings.clear();
}

globalThis.remoteInterpTuning = remoteInterpTuning;
