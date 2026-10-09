// api/input.js — the Input module: the player's abstract inputs for scripts.
//
// Wraps the Better Input Manager plugin object `Inputs` (single-global,
// runtime.objects.Inputs), always for player 0 / control scheme "" (the only
// player+scheme the game writes — see E_inputs). Only the hand-curated
// allowlist in c3script_enums.js (INPUT_ACTIONS / INPUT_STICKS) is visible to
// scripts — everything else (menu/pause, reset, takePhoto, …) is deliberately
// unreachable: unknown to every method, dropped before listeners/pressed(),
// absent from lastInput.
//
// How injection survives E_inputs (the device→plugin bridge, which re-writes
// input state every tick):
//  - hold(): the plugin's addInputListener fires synchronously inside
//    SetUpInput AFTER state is cleared but BEFORE the OnUp triggers, so the
//    listener re-asserts the held state and stops propagation — one OnDown at
//    hold() time, continuous IsDown for the event sheets, no trigger spam.
//  - setJoystick(): analog writes never dispatch listener events, so the stick
//    is registered in scripts/scriptInputOverrides.js instead; E_inputs' stick
//    writes are guarded by the isInputOverridden() event function and skip the
//    device while overridden.
//  - simulateDown/Up(): fire the plugin's triggers once without touching
//    stored state — the right tool for trigger-driven actions (interact, jump
//    start); useless for state readers (held-jump height, movement).
//
// pressed()/released() note: plugin events fire mid-event-sheet (during
// E_inputs), i.e. AFTER that frame's script tick, so they read true on the
// NEXT script tick — one tick after the game's own triggers saw the edge.
// TODO game: verify the script "tick" listener really runs before the event
// sheets with a log-ordering probe (standard C3 behavior, unconfirmed here).

import {
  INPUT_ACTIONS,
  INPUT_STICKS,
  CONTROL_SCHEMES,
} from "../c3script_enums.js";
import { runHandler, HANDLER_MAX_STEPS } from "./events.js";
import { getBindingIcon } from "../../../inputBindingDisplay.js";
import {
  setScriptInputOverride,
  clearScriptInputOverrides,
} from "../../../scriptInputOverrides.js";

const PLAYER = 0;
const SCHEME = ""; // the control scheme every game input is written to

const DIGITAL_SET = new Set(INPUT_ACTIONS);
const STICK_SET = new Set(INPUT_STICKS);

const unknown = (method, name, values) =>
  new Error(
    `[script] Input.${method}: unknown input "${name}" — one of ${values.join(", ")}`,
  );

export function buildInput({
  runtime,
  invoke,
  logError,
  getPaused,
  addCleanup,
  addPreTick,
}) {
  const inst = () => {
    const i = runtime.objects.Inputs?.getFirstInstance();
    if (!i) throw new Error("[script] Input: input system not available");
    return i;
  };

  const assertAction = (method, name) => {
    if (!DIGITAL_SET.has(name)) throw unknown(method, name, INPUT_ACTIONS);
  };
  const assertStick = (method, name) => {
    if (!STICK_SET.has(name)) throw unknown(method, name, INPUT_STICKS);
  };
  const assertAny = (method, name) => {
    if (!DIGITAL_SET.has(name) && !STICK_SET.has(name))
      throw unknown(method, name, [...INPUT_ACTIONS, ...INPUT_STICKS]);
  };

  // Edge buffers. Events accumulate mid-frame (during E_inputs) and swap into
  // the readable set on the next pre-tick, so pressed()/released() hold for
  // exactly one script tick. Swapped even while paused (dt=0 ticks), so a
  // stale edge can't survive a pause.
  let curPressed = new Set();
  let curReleased = new Set();
  let accumPressed = new Set();
  let accumReleased = new Set();

  const handlers = { down: new Map(), up: new Map() }; // name -> script cb[]
  const held = new Set(); // inputs held down by hold()
  const overriddenSticks = new Set(); // sticks overridden by setJoystick()
  const scriptDisabled = new Set(); // inputs disabled via setEnabled(false)
  let lastInput = "";

  const listener = (evt) => {
    if (evt.player !== PLAYER) return;
    const name = evt.input;
    if (!DIGITAL_SET.has(name)) return; // excluded inputs stay invisible
    if (evt.type === "up" && held.has(name) && !evt.simulated) {
      // E_inputs stomped a held input: silently re-assert the down state
      // (engine method — no dispatch, no auto-switch) and swallow the OnUp.
      inst().SetDigitalInputState(name, PLAYER, evt.controlScheme, true, true);
      evt.stopPropagation();
      return;
    }
    if (getPaused()) return; // don't feed menu navigation to scripts
    lastInput = name;
    (evt.type === "down" ? accumPressed : accumReleased).add(name);
    const cbs = handlers[evt.type].get(name);
    if (!cbs || !cbs.length) return;
    const facade = {
      input: name,
      simulated: !!evt.simulated,
      // stopPropagation() suppresses the plugin's event-sheet triggers
      // (OnDown/OnUp/OnAnyDown/OnAnyUp) — it does NOT hide held state.
      preventDefault: () => evt.stopPropagation(),
    };
    for (const cb of cbs.slice())
      runHandler(invoke, logError, cb, [facade], HANDLER_MAX_STEPS);
  };

  // The plugin object is a global whose state outlives level loads, so
  // everything the script changed is restored on unload — a workshop level can
  // never leave the player without controls (or stuck walking) past its
  // lifetime.
  const cleanup = () => {
    const i = runtime.objects.Inputs.getFirstInstance();
    if (!i) return;
    i.removeInputListener(listener);
    for (const name of held)
      i.SetDigitalInputState(name, PLAYER, SCHEME, false, true);
    held.clear();
    for (const name of overriddenSticks)
      i.SetJoystickInputState(name, PLAYER, SCHEME, 0, 0, true);
    overriddenSticks.clear();
    clearScriptInputOverrides();
    for (const name of scriptDisabled) i.SetInputEnabled(name, PLAYER, true);
    scriptDisabled.clear();
  };

  // Wire up eagerly when the real plugin exists (play time); the autocomplete
  // schema build passes stub deps with no Inputs object and skips all of this.
  if (runtime.objects.Inputs.getFirstInstance()) {
    inst().addInputListener(listener);
    addPreTick(() => {
      [curPressed, accumPressed] = [accumPressed, curPressed];
      accumPressed.clear();
      [curReleased, accumReleased] = [accumReleased, curReleased];
      accumReleased.clear();
    });
    addCleanup(cleanup);
  }

  const on = (type, method, name, cb) => {
    assertAction(method, name);
    if (cb == null) return;
    let arr = handlers[type].get(name);
    if (!arr) handlers[type].set(name, (arr = []));
    arr.push(cb);
  };
  const off = (type, method, name, cb) => {
    assertAction(method, name);
    const arr = handlers[type].get(name);
    if (!arr) return;
    const i = arr.indexOf(cb);
    if (i >= 0) arr.splice(i, 1);
  };

  const input = {
    // ── reading ──────────────────────────────────────────────────────────
    isDown: (name) => {
      assertAction("isDown", name);
      return !!inst().GetDigitalInputState(name, PLAYER, SCHEME);
    },
    pressed: (name) => {
      assertAction("pressed", name);
      return curPressed.has(name);
    },
    released: (name) => {
      assertAction("released", name);
      return curReleased.has(name);
    },
    joystick: (name) => {
      assertStick("joystick", name);
      const i = inst();
      return {
        x: i.GetJoystickX(name, PLAYER),
        y: i.GetJoystickY(name, PLAYER),
        angle: i.GetJoystickAngle(name, PLAYER),
        magnitude: i.GetJoystickMagnitude(name, PLAYER),
      };
    },
    rawJoystick: (name) => {
      assertStick("rawJoystick", name);
      const i = inst();
      return {
        x: i.GetRawJoystickX(name, PLAYER),
        y: i.GetRawJoystickY(name, PLAYER),
        magnitude: i.GetRawJoystickMagnitude(name, PLAYER),
      };
    },

    // ── edge callbacks ───────────────────────────────────────────────────
    onPressed: (name, cb) => on("down", "onPressed", name, cb),
    onReleased: (name, cb) => on("up", "onReleased", name, cb),
    offPressed: (name, cb) => off("down", "offPressed", name, cb),
    offReleased: (name, cb) => off("up", "offReleased", name, cb),

    // ── injection ────────────────────────────────────────────────────────
    simulateDown: (name) => {
      assertAction("simulateDown", name);
      inst().SimulateDownInput(name, PLAYER);
    },
    simulateUp: (name) => {
      assertAction("simulateUp", name);
      inst().SimulateUpInput(name, PLAYER);
    },
    hold: (name) => {
      assertAction("hold", name);
      if (held.has(name)) return;
      held.add(name);
      inst().SetDownInput(name, PLAYER, SCHEME, true);
    },
    release: (name) => {
      assertAction("release", name);
      if (!held.delete(name)) return;
      inst().SetUpInput(name, PLAYER, SCHEME);
    },
    isHeld: (name) => {
      assertAction("isHeld", name);
      return held.has(name);
    },
    setJoystick: (name, x, y) => {
      assertStick("setJoystick", name);
      let vx = Number(x) || 0;
      let vy = Number(y) || 0;
      // Devices never produce a magnitude above 1 — keep scripts to the same
      // envelope so movement speed can't exceed a fully pushed stick.
      const mag = Math.hypot(vx, vy);
      if (mag > 1) {
        vx /= mag;
        vy /= mag;
      }
      overriddenSticks.add(name);
      setScriptInputOverride(name, true);
      inst().SetJoystickInputState(name, PLAYER, SCHEME, vx, vy, true);
    },
    clearJoystick: (name) => {
      assertStick("clearJoystick", name);
      if (!overriddenSticks.delete(name)) return;
      setScriptInputOverride(name, false);
      inst().SetJoystickInputState(name, PLAYER, SCHEME, 0, 0, true);
    },

    // ── enable / disable ─────────────────────────────────────────────────
    setEnabled: (name, enabled) => {
      assertAny("setEnabled", name);
      inst().SetInputEnabled(name, PLAYER, !!enabled);
      if (enabled) scriptDisabled.delete(name);
      else scriptDisabled.add(name);
    },
    setAllEnabled: (enabled) => {
      // Per-input over the allowlist, NOT the plugin's master toggle: the
      // master would also kill excluded inputs (menu!) and pause must always
      // stay reachable.
      for (const name of [...INPUT_ACTIONS, ...INPUT_STICKS])
        input.setEnabled(name, enabled);
    },
    isEnabled: (name) => {
      assertAny("isEnabled", name);
      return !!inst().GetInputEnabled(name, PLAYER);
    },

    // ── bindings ─────────────────────────────────────────────────────────
    // Whitelisted wrapper over the game-wide lookup (scripts/
    // inputBindingDisplay.js): the game can resolve ANY action's binding icon;
    // scripts only the allowlist — enforced here, at the script boundary.
    bindingFor: (name, index = 0) => {
      assertAny("bindingFor", name);
      return getBindingIcon(runtime, name, index);
    },

    __docs__: {
      isDown:
        "Input.isDown(name) — true while the input is held down. name is an InputAction value. Note: interact is trigger-only in this game and never reads down — use onPressed/pressed for it.",
      pressed:
        'Input.pressed(name) — true for exactly one tick after the input went down (poll in level.on("tick")); fires one tick after the game itself saw the press.',
      released:
        "Input.released(name) — true for exactly one tick after the input went up.",
      joystick:
        "Input.joystick(name) — the stick's current value {x, y, angle, magnitude} with the deadzone applied. name is an InputStick value; angle in degrees.",
      rawJoystick:
        "Input.rawJoystick(name) — the stick's value {x, y, magnitude} ignoring the deadzone.",
      controlScheme:
        "Input.controlScheme — the active input device: ControlScheme.KBM, ControlScheme.gamepad or ControlScheme.touch (read-only). Use to branch button prompts.",
      lastInput:
        'Input.lastInput — the name of the most recent input press/release visible to scripts (read-only; "" before any input).',
      onPressed:
        "Input.onPressed(name, handler) — call handler(event) the instant the input goes down. event = { input, simulated, preventDefault() }; preventDefault() blocks the game's own press reaction (jump start, interact, …) but does NOT hide held state (held-jump, movement).",
      onReleased:
        "Input.onReleased(name, handler) — call handler(event) the instant the input goes up (same event shape as onPressed).",
      offPressed:
        "Input.offPressed(name, handler) — remove a handler added with onPressed.",
      offReleased:
        "Input.offReleased(name, handler) — remove a handler added with onReleased.",
      simulateDown:
        "Input.simulateDown(name) — fire the input's press once without holding it down. Drives press-reactions (interact, jump start); for held effects use hold().",
      simulateUp:
        "Input.simulateUp(name) — fire the input's release once without changing its state.",
      hold: "Input.hold(name) — press the input and keep it down (survives the device saying otherwise) until release(). Drives held effects: full-height jump, crouch, …",
      release:
        "Input.release(name) — stop holding an input held with hold(); if the player is physically pressing it, the device takes over again next tick.",
      isHeld:
        "Input.isHeld(name) — true if the input is currently held by hold().",
      setJoystick:
        "Input.setJoystick(name, x, y) — override a stick with a fixed value until clearJoystick(); the device stops driving it meanwhile. Magnitude is capped at 1. E.g. Input.setJoystick(InputStick.movement, 1, 0) auto-runs.",
      clearJoystick:
        "Input.clearJoystick(name) — remove a setJoystick override and give the stick back to the device.",
      setEnabled:
        "Input.setEnabled(name, enabled) — enable/disable one input (action or stick). Disabled inputs read 0/false and fire nothing. Restored automatically when the level unloads.",
      setAllEnabled:
        "Input.setAllEnabled(enabled) — enable/disable every script-visible input at once (the pause menu always keeps working). Restored automatically when the level unloads.",
      isEnabled:
        "Input.isEnabled(name) — true if the input is currently enabled.",
      bindingFor:
        'Input.bindingFor(name, index = 0) — the bound key/button as an inline color-inheriting font glyph run ("[font=kinput_kbm]…[/font]") for use in any text; falls back to the plain key name when no glyph exists. For InputStick.movement: left-stick glyph on gamepad, the four direction-key glyphs on keyboard, stick glyph on touch. On touch only jump (tap icon) and movement exist — everything else returns null, as does any unbound index. index picks among multiple bindings.',
    },
    __argEnums__: {
      isDown: { 0: INPUT_ACTIONS },
      pressed: { 0: INPUT_ACTIONS },
      released: { 0: INPUT_ACTIONS },
      joystick: { 0: INPUT_STICKS },
      rawJoystick: { 0: INPUT_STICKS },
      onPressed: { 0: INPUT_ACTIONS },
      onReleased: { 0: INPUT_ACTIONS },
      offPressed: { 0: INPUT_ACTIONS },
      offReleased: { 0: INPUT_ACTIONS },
      simulateDown: { 0: INPUT_ACTIONS },
      simulateUp: { 0: INPUT_ACTIONS },
      hold: { 0: INPUT_ACTIONS },
      release: { 0: INPUT_ACTIONS },
      isHeld: { 0: INPUT_ACTIONS },
      setJoystick: { 0: INPUT_STICKS },
      clearJoystick: { 0: INPUT_STICKS },
      setEnabled: { 0: [...INPUT_ACTIONS, ...INPUT_STICKS] },
      isEnabled: { 0: [...INPUT_ACTIONS, ...INPUT_STICKS] },
      bindingFor: { 0: [...INPUT_ACTIONS, ...INPUT_STICKS] },
    },
  };

  Object.defineProperties(input, {
    controlScheme: {
      enumerable: true,
      get: () => runtime.globalVars.curInputType ?? CONTROL_SCHEMES[0],
    },
    lastInput: { enumerable: true, get: () => lastInput },
  });

  return input;
}
