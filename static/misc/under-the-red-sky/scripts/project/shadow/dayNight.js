/**
 * dayNight.js — Day/night cycle system.
 *
 * Drives sky color, instance tinting, and light direction based on
 * a time-of-day value (0–1).
 *
 * Usage:
 *   import { DayNightSystem } from "./shadow/dayNight.js";
 *
 *   const dayNight = new DayNightSystem();
 *   dayNight.setEnabled(true);
 *
 *   // Each frame:
 *   dayNight.update(runtime.dt, shadowSystem, mainLayer, tintableInstances);
 */

export class DayNightSystem {
  constructor() {
    this.enabled = false;
    this.timeOfDay = 0.5;   // 0 = midnight, 0.25 = sunrise, 0.5 = noon, 0.75 = sunset
    this.autoPlay = false;
    this.speed = 0.05;       // full cycles per second
  }

  setEnabled(v) { this.enabled = v; }
  setTime(v) { this.timeOfDay = v; }
  setAutoPlay(v) { this.autoPlay = v; }
  setSpeed(v) { this.speed = v; }

  /**
   * Advance the cycle and apply sky/tint/light.
   *
   * @param {number}       dt             Frame delta time (seconds)
   * @param {ShadowSystem} shadowSystem   Shadow system to update light direction
   * @param {object|null}  mainLayer      C3 layer to set background color on (or null)
   * @param {Array}        tintInstances  Instances to tint
   * @returns {{ lightDir: number[], timeOfDay: number } | null}
   *          Returns the computed values when enabled, null otherwise.
   */
  update(dt, shadowSystem, mainLayer, tintInstances) {
    if (!this.enabled) return null;

    // Auto-advance
    if (this.autoPlay) {
      this.timeOfDay = (this.timeOfDay + dt * this.speed) % 1;
    }

    const { sky, tint } = getDayNightColors(this.timeOfDay);

    // Light direction from sun arc
    const sunAngle = this.timeOfDay * Math.PI * 2;
    const sx = Math.sin(sunAngle);
    const sz = -Math.cos(sunAngle);
    const lightDir = [
      sx,
      sx * 0.3 + 0.35,
      Math.min(sz, -0.15),
    ];

    if (shadowSystem) {
      shadowSystem.setLight(lightDir);
    }

    // Sky background
    if (mainLayer) {
      mainLayer.isTransparent = false;
      mainLayer.backgroundColor = sky;
    }

    // Tint instances
    for (const inst of tintInstances) {
      inst.colorRgb = tint;
    }

    return { lightDir, timeOfDay: this.timeOfDay };
  }

  /**
   * Reset all tints to neutral and restore transparent background.
   */
  reset(mainLayer, tintInstances) {
    for (const inst of tintInstances) {
      inst.colorRgb = [1, 1, 1];
    }
    if (mainLayer) {
      mainLayer.isTransparent = true;
    }
  }
}

// ── Color stops ──────────────────────────────────────────────────────

function getDayNightColors(t) {
  const stops = [
    [0.0,  0.02, 0.02, 0.08,  0.15, 0.15, 0.25],
    [0.2,  0.05, 0.05, 0.15,  0.25, 0.2,  0.35],
    [0.25, 0.85, 0.5,  0.25,  0.95, 0.7,  0.5 ],
    [0.35, 0.55, 0.75, 0.95,  1.0,  0.95, 0.9 ],
    [0.5,  0.53, 0.81, 0.98,  1.0,  1.0,  1.0 ],
    [0.65, 0.55, 0.75, 0.95,  1.0,  0.95, 0.9 ],
    [0.75, 0.9,  0.4,  0.2,   0.95, 0.6,  0.4 ],
    [0.8,  0.15, 0.08, 0.2,   0.4,  0.25, 0.4 ],
    [1.0,  0.02, 0.02, 0.08,  0.15, 0.15, 0.25],
  ];

  t = ((t % 1) + 1) % 1;

  let a = stops[0], b = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i][0] && t <= stops[i + 1][0]) {
      a = stops[i];
      b = stops[i + 1];
      break;
    }
  }

  const range = b[0] - a[0];
  const f = range > 0 ? (t - a[0]) / range : 0;
  const lerp = (x, y, f) => x + (y - x) * f;

  return {
    sky:  [lerp(a[1], b[1], f), lerp(a[2], b[2], f), lerp(a[3], b[3], f)],
    tint: [lerp(a[4], b[4], f), lerp(a[5], b[5], f), lerp(a[6], b[6], f)],
  };
}
