/**
 * debugUI.js — Optional debug panel for the shadow & day/night systems.
 *
 * Creates an HTML overlay with sliders for light direction, toggles for
 * debug wireframes and backface darkening, and day/night cycle controls.
 *
 * To remove debug UI from a project, simply don't import or call this.
 *
 * Usage:
 *   import { createShadowDebugUI } from "./shadow/debugUI.js";
 *   createShadowDebugUI(shadowSystem, dayNightSystem);
 */

/**
 * @param {ShadowSystem}   shadowSystem
 * @param {DayNightSystem} dayNight
 * @param {{ lightX?: number, lightY?: number, lightZ?: number }} [initialLight]
 * @returns {{ updateLight(x,y,z): void, updateTime(t): void }}
 */
export function createShadowDebugUI(shadowSystem, dayNight, initialLight = {}) {
  let lightX = initialLight.lightX ?? 0.3;
  let lightY = initialLight.lightY ?? 0.3;
  let lightZ = initialLight.lightZ ?? -1;

  const panel = document.createElement("div");
  panel.id = "shadow-debug";
  panel.style.cssText = `
    position: fixed; top: 8px; left: 8px; z-index: 99999;
    background: rgba(0,0,0,0.8); color: #fff; font: 12px monospace;
    padding: 10px 14px; border-radius: 6px; user-select: none;
    display: flex; flex-direction: column; gap: 6px; min-width: 220px;
  `;

  // ── Helpers ──

  function makeSlider(label, min, max, step, value, onChange) {
    const row = document.createElement("div");
    row.style.cssText = "display:flex; align-items:center; gap:6px;";
    const lbl = document.createElement("span");
    lbl.style.cssText = "width:24px; text-align:right;";
    lbl.textContent = label;
    const input = document.createElement("input");
    input.type = "range"; input.min = min; input.max = max;
    input.step = step; input.value = value;
    input.style.cssText = "flex:1;";
    const val = document.createElement("span");
    val.style.cssText = "width:42px; text-align:left;";
    val.textContent = Number(value).toFixed(2);
    input.addEventListener("input", () => {
      val.textContent = Number(input.value).toFixed(2);
      onChange(Number(input.value));
    });
    row.append(lbl, input, val);
    return { row, input, val };
  }

  function makeCheckbox(label, checked, onChange) {
    const row = document.createElement("label");
    row.style.cssText = "display:flex; align-items:center; gap:6px; cursor:pointer;";
    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.checked = checked;
    cb.addEventListener("change", () => onChange(cb.checked));
    row.append(cb, label);
    return row;
  }

  // ── Light direction ──

  panel.appendChild(Object.assign(document.createElement("div"), {
    textContent: "Shadow Light Dir",
    style: "font-weight:bold; margin-bottom:2px;",
  }));

  const xSlider = makeSlider("X", -1, 1, 0.01, lightX, (v) => {
    lightX = v; shadowSystem.setLight([lightX, lightY, lightZ]);
  });
  const ySlider = makeSlider("Y", -1, 1, 0.01, lightY, (v) => {
    lightY = v; shadowSystem.setLight([lightX, lightY, lightZ]);
  });
  const zSlider = makeSlider("Z", -1, 1, 0.01, lightZ, (v) => {
    lightZ = v; shadowSystem.setLight([lightX, lightY, lightZ]);
  });
  panel.append(xSlider.row, ySlider.row, zSlider.row);

  // ── Toggles ──

  panel.appendChild(makeCheckbox("Show wireframes", false, (v) => shadowSystem.setDebug(v)));
  panel.appendChild(makeCheckbox("Backface darkening", true, (v) => shadowSystem.setBackfaceEnabled(v)));

  const legend = document.createElement("div");
  legend.style.cssText = "font-size:10px; color:#aaa; padding-left:22px;";
  legend.innerHTML =
    "<span style='color:#f44'>red</span>=casters  <span style='color:#4f4'>green</span>=receivers  <span style='color:#ff0'>yellow</span>=shadows";
  panel.appendChild(legend);

  // ── Day/Night controls ──

  if (dayNight) {
    panel.appendChild(Object.assign(document.createElement("div"), {
      textContent: "Day / Night",
      style: "font-weight:bold; margin-top:6px;",
    }));

    panel.appendChild(makeCheckbox("Enable day/night", dayNight.enabled, (v) => {
      dayNight.setEnabled(v);
    }));

    const timeSlider = makeSlider("T", 0, 1, 0.01, dayNight.timeOfDay, (v) => {
      dayNight.setTime(v);
    });
    panel.appendChild(timeSlider.row);

    panel.appendChild(makeCheckbox("Auto-play", dayNight.autoPlay, (v) => {
      dayNight.setAutoPlay(v);
    }));

    const speedSlider = makeSlider("Spd", 0.01, 0.5, 0.01, dayNight.speed, (v) => {
      dayNight.setSpeed(v);
    });
    panel.appendChild(speedSlider.row);

    // Expose update methods for syncing sliders from outside
    panel._timeSlider = timeSlider;
    panel._lightSliders = { x: xSlider, y: ySlider, z: zSlider };
  }

  // ── Block events from reaching the game canvas ──

  const stopEvents = [
    "pointerdown", "pointerup", "pointermove", "pointercancel",
    "mousedown", "mouseup", "mousemove", "click", "dblclick",
    "touchstart", "touchmove", "touchend", "touchcancel",
    "wheel", "contextmenu",
  ];
  for (const evt of stopEvents) {
    panel.addEventListener(evt, (e) => e.stopPropagation(), true);
  }

  document.body.appendChild(panel);

  // ── Return API to sync sliders from day/night auto-play ──

  return {
    /** Update light direction sliders (e.g. when day/night changes them). */
    updateLight(x, y, z) {
      lightX = x; lightY = y; lightZ = z;
      xSlider.input.value = x; xSlider.val.textContent = x.toFixed(2);
      ySlider.input.value = y; ySlider.val.textContent = y.toFixed(2);
      zSlider.input.value = z; zSlider.val.textContent = z.toFixed(2);
    },
    /** Update time slider (e.g. during auto-play). */
    updateTime(t) {
      if (dayNight && panel._timeSlider) {
        panel._timeSlider.input.value = t;
        panel._timeSlider.val.textContent = t.toFixed(2);
      }
    },
  };
}
