// api/color.js — color conversion helpers for level scripts.
//
// Color is a HELPER, not a value type. Every channel is 0..1 (Construct's native
// range, including HSL). A "color" anywhere in the script API accepts any of:
//   - a hex string:        "#87CEEB"
//   - an rgb object:       { r: 0.5, g: 0.8, b: 0.9 }   (0..1)
//   - an hsl object:       { h: 0.55, s: 0.6, l: 0.7 }  (0..1)
// and you convert between them with Color.toRGB / Color.toHex / Color.toHSL.
//
// toRGB is the generic entry point used internally (fog/sky setters, Tween.color),
// so passing a hex, rgb, or hsl all work the same way.

const clamp01 = (n) => Math.max(0, Math.min(1, Number(n) || 0));

// ── primitive conversions (all 0..1) ───────────────────────────────────────
export function hexToRgb(hex) {
  const h = String(hex ?? "").replace("#", "");
  return {
    r: clamp01(parseInt(h.substring(0, 2), 16) / 255),
    g: clamp01(parseInt(h.substring(2, 4), 16) / 255),
    b: clamp01(parseInt(h.substring(4, 6), 16) / 255),
  };
}

export function rgbToHex({ r, g, b }) {
  const h2 = (n) =>
    Math.round(clamp01(n) * 255)
      .toString(16)
      .padStart(2, "0");
  return "#" + h2(r) + h2(g) + h2(b);
}

export function rgbToHsl({ r, g, b }) {
  r = clamp01(r);
  g = clamp01(g);
  b = clamp01(b);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: h / 6, s, l };
}

export function hslToRgb({ h, s, l }) {
  h = (((Number(h) || 0) % 1) + 1) % 1;
  s = clamp01(s);
  l = clamp01(l);
  if (s === 0) return { r: l, g: l, b: l };
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: hue2rgb(p, q, h + 1 / 3),
    g: hue2rgb(p, q, h),
    b: hue2rgb(p, q, h - 1 / 3),
  };
}

// ── generic coercion ────────────────────────────────────────────────────────
// Normalize any color-ish value to rgb 0..1. Accepts a hex string, an rgb object
// {r,g,b}, an hsl object {h,s,l}, or an [r,g,b] array (the engine's colorRgb form).
export function toRGB(value) {
  if (value == null) return { r: 0, g: 0, b: 0 };
  if (typeof value === "string") return hexToRgb(value);
  if (Array.isArray(value)) {
    return { r: clamp01(value[0]), g: clamp01(value[1]), b: clamp01(value[2]) };
  }
  if (typeof value === "object") {
    if ("h" in value || "s" in value || "l" in value) {
      return hslToRgb({ h: value.h, s: value.s, l: value.l });
    }
    return { r: clamp01(value.r), g: clamp01(value.g), b: clamp01(value.b) };
  }
  return { r: 0, g: 0, b: 0 };
}

export function toRGBArray(value) {
  const c = toRGB(value);
  return [c.r, c.g, c.b];
}

export function toHex(value) {
  return rgbToHex(toRGB(value));
}

export function toHSL(value) {
  return rgbToHsl(toRGB(value));
}

// The script-facing Color helper module.
export function buildColorModule() {
  return {
    // Shape builders — just return a correctly-shaped color object.
    rgb: (r, g, b) => ({ r, g, b }),
    hsl: (h, s, l) => ({ h, s, l }),
    // Converters — accept any color form, channels 0–1.
    toRGB: (v) => toRGB(v),
    toHex: (v) => toHex(v),
    toHSL: (v) => toHSL(v),
    __docs__: {
      rgb: "Color.rgb(r, g, b) — make an {r,g,b} color object (channels 0–1).",
      hsl: "Color.hsl(h, s, l) — make an {h,s,l} color object (channels 0–1).",
      toRGB:
        'Color.toRGB(color) — convert any color (hex "#rrggbb", {r,g,b}, or {h,s,l}) to an {r,g,b} object, channels 0–1.',
      toHex:
        'Color.toHex(color) — convert any color to a "#rrggbb" hex string.',
      toHSL:
        "Color.toHSL(color) — convert any color to an {h,s,l} object, channels 0–1.",
    },
  };
}
