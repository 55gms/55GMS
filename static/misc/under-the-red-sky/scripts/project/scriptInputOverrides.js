// scriptInputOverrides.js — registry of analog inputs currently overridden by a
// level script (written by levelEditor/scripting/api/input.js).
//
// E_inputs writes the device joystick state into the Inputs plugin every tick,
// so a script-set stick value would be stomped within a frame. The analog write
// blocks in E_inputs are guarded by the isInputOverridden() event function,
// which reads this registry: while a stick is overridden, the device stops
// driving it and the script's value persists until cleared.

const overridden = new Set();

export function setScriptInputOverride(name, active) {
  if (active) overridden.add(name);
  else overridden.delete(name);
}

export function clearScriptInputOverrides() {
  overridden.clear();
}

export function isScriptInputOverridden(name) {
  return overridden.has(name);
}
