// api/audio.js — the Audio module: fire-and-forget sound playback for scripts.
//
// Thin wrappers over the Construct c3Script_* audio functions (defined in
// eventSheets/misc/scriptingAPI.json), invoked via runtime.callFunction. Sound
// names are the sounds/ folder base names; use the Sound / Vocal enums (enums.js)
// for autocomplete-friendly, typo-proof values.
//
// The underlying c3 signatures are:
//   c3Script_playSound(audioName, volume, minRate, maxRate)
//   c3Script_playSoundAtPlayer(audioName, volume, minRate, maxRate)
//   c3Script_playSoundAtPosition(audioName, volume, x, y, z, minRate, maxRate)
//   c3Script_playerVocalize(audioName)
// volume is in dB (0 = unchanged); minRate/maxRate randomize playback pitch.

import { Enums } from "../c3script_enums.js";

// Accept a position as {x,y,z} or [x,y,z] (matches Raycast's convention).
const arr = (v) => (Array.isArray(v) ? v : [v?.x ?? 0, v?.y ?? 0, v?.z ?? 0]);

export function buildAudio({ runtime }) {
  return {
    playSound: (name, volume = 1, minRate = 1, maxRate = 1) =>
      runtime.callFunction(
        "c3Script_playSound",
        name,
        volume,
        minRate,
        maxRate,
      ),
    playSoundAtPlayer: (name, volume = 1, minRate = 1, maxRate = 1) =>
      runtime.callFunction(
        "c3Script_playSoundAtPlayer",
        name,
        volume,
        minRate,
        maxRate,
      ),
    playSoundAtPosition: (
      name,
      position,
      volume = 1,
      minRate = 1,
      maxRate = 1,
    ) => {
      const [x, y, z] = arr(position);
      return runtime.callFunction(
        "c3Script_playSoundAtPosition",
        name,
        volume,
        x,
        y,
        z,
        minRate,
        maxRate,
      );
    },
    playerVocalize: (type) =>
      runtime.callFunction("c3Script_playerVocalize", type),

    __docs__: {
      playSound:
        "Audio.playSound(name, volume=0, minRate=1, maxRate=1) — play a sound (2D, no spatialization). name is a Sound enum value; volume in dB; min/maxRate randomize pitch.",
      playSoundAtPlayer:
        "Audio.playSoundAtPlayer(name, volume=0, minRate=1, maxRate=1) — play a sound positioned at the player. name is a Sound enum value; volume in dB.",
      playSoundAtPosition:
        "Audio.playSoundAtPosition(name, position, volume=0, minRate=1, maxRate=1) — play a sound at a world position ({x,y,z} or [x,y,z]). name is a Sound enum value; volume in dB.",
      playerVocalize:
        "Audio.playerVocalize(type) — play a player vocalization; type is a Vocal enum value (landed, jump, gasp, ouch, huh).",
    },
    __argEnums__: {
      playSound: { 0: Enums.values.Sound },
      playSoundAtPlayer: { 0: Enums.values.Sound },
      playSoundAtPosition: { 0: Enums.values.Sound },
      playerVocalize: { 0: Enums.values.Vocal },
    },
  };
}
