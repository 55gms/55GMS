let keybinds = {};
let defaultKeybinds = {};

// The KBM action currently being rebound, set by listenToKBM. The DOM key/mouse
// listeners read it so a captured code is only rejected when it duplicates a
// key the SAME action already holds — duplicates across other actions are now
// accepted (and surfaced as conflicts in the keybinds menu instead).
let listeningKbmAction = null;

const gamepadButtonNames =
    ["A",
        "B",
        "X",
        "Y",
        "L-SHOULDER",
        "R-SHOULDER",
        "L-TRIGGER",
        "R-TRIGGER",
        "SELECT",
        "MENU",
        "L-STICK Press",
        "R-STICK Press",
        "D-PAD UP",
        "D-PAD DOWN",
        "D-PAD LEFT",
        "D-PAD RIGHT"];

const mouseButtonNames = ["LEFT-CLICK", "MIDDLE-CLICK", "RIGHT-CLICK", "MOUSE 3", "MOUSE 4", "MOUSE 5"];

// Scroll wheel as a bindable, release-less input. The wheel emits discrete
// events with no key-up, so it can't be polled like a held key. Instead a wheel
// event sets wheelPulse to its direction and isBindDown reports the matching
// WheelUp/WheelDown bind as "down" for the ONE tick after the event, then it
// expires. The per-tick input poll (isKeybindDown -> SetDownInput/SetUpInput)
// then fires OnDown on the scrolling tick and OnUp once scrolling stops; holding
// a scroll (continuous events) re-sets the pulse every tick, "spamming" the input.
//
// The pulse is NOT consumed on read — every action bound to that direction sees
// it (bind the wheel to two actions and both fire). Instead it's aged by tick:
// the first isBindDown that observes a live pulse stamps the current gameTime,
// and any read on a LATER tick (gameTime moved on) expires it. gameTime is
// constant within a tick, so all pollers in the same tick agree.
export const WHEEL_UP = "WheelUp";     // scroll up   (deltaY < 0)
export const WHEEL_DOWN = "WheelDown"; // scroll down (deltaY > 0)
// -1 = up, +1 = down, 0 = none
let wheelPulse = 0;
// gameTime of the tick that first observed the current pulse; -1 = fresh/unseen
let wheelPulseTick = -1;
// guards initScrollCapture against double-registering the persistent listener
let scrollCaptureRuntime = null;


export class Inputs {

    static _setDefaultKeybinds(o) {
        defaultKeybinds = o
    }

    //returns true if anything was added or removed (caller should persist)
    static combineKeybindsWithDefault() {
        //no custom keybinds exist
        if (!keybinds) {
            this.resetKeybindsToDefault();
            return false
        }

        let changed = false
        for (const input of ["kbm", "gamepad"]) {
            if (keybinds?.[input] === undefined) {
                keybinds[input] = {}
                changed = true
            }
            //add missing default actions and keybinds to the custom keybinds
            for (const bind of Object.keys(defaultKeybinds[input])) {
                if (!(bind in keybinds[input])) {
                    keybinds[input][bind] = defaultKeybinds[input][bind];
                    changed = true
                }
            }
            //drop stale actions that no longer exist in the defaults
            //(e.g. the shoot -> interact rename), so they don't linger as
            //blank rows in the keybinds dialog / phantom "already bound" keys
            for (const bind of Object.keys(keybinds[input])) {
                if (!(bind in defaultKeybinds[input])) {
                    delete keybinds[input][bind]
                    changed = true
                }
            }
        }

        //one-time value remaps for the gamepad reshuffle when photo-mode focus
        //(and TPM zoom) took the LB/RB shoulders: emote moved off LB to X, and
        //takePhoto/interact dropped the RB shoulder for RT only. Only rewrite a
        //bind still sitting on its OLD shipped default so a player's own
        //customization survives. Same spirit as the shoot->interact drop above.
        changed = this._remapStaleGamepadDefault("emote", [4], [2]) || changed
        changed = this._remapStaleGamepadDefault("takePhoto", [5, 7], [7]) || changed
        changed = this._remapStaleGamepadDefault("interact", [5, 7], [7]) || changed

        return changed
    }

    //Rewrite keybinds.gamepad[action] to newDef ONLY if it currently holds the
    //exact oldDef array (an untouched former default). Returns whether it changed.
    static _remapStaleGamepadDefault(action, oldDef, newDef) {
        const cur = keybinds.gamepad?.[action]
        if (cur && JSON.stringify(cur) === JSON.stringify(oldDef)) {
            keybinds.gamepad[action] = newDef.slice()
            return true
        }
        return false
    }


    static setKeybinds(o) {
        keybinds = o
    }

    static getKeybinds() {
        return keybinds
    }

    static getKeybindJSONString(inputType, action) {
        return JSON.stringify(keybinds[inputType][action])
    }

    static setKeybind(inputType, bindName, index, code) {
        if (keybinds[inputType][bindName]?.[index] === undefined) {
            keybinds[inputType][bindName].push(code)
        }
        else (
            keybinds[inputType][bindName][index] = code
        )
    }

    static getKeybind(inputType, action, index) {
        if (keybinds[inputType][action]?.[index] !== undefined) {
            return keybinds[inputType][action][index]
        }
        return false
    }

    static clearKeybind(inputType, bindName, index) {
        const binds = keybinds[inputType]?.[bindName]
        if (!binds || binds[index] === undefined) return
        binds.splice(index, 1)
    }

    static resetKeybindsToDefault() {
        keybinds = defaultKeybinds
    }


    static isBindDown(runtime, bind) {
        //check keyboard and mouse

        for (const code of keybinds.kbm[bind]) {

            if (code === WHEEL_UP || code === WHEEL_DOWN) {
                // release-less scroll: age the pulse by tick (see wheelPulse
                // notes above) — NOT consumed, so every action bound to this
                // direction sees it in the same tick
                if (wheelPulse !== 0) {
                    const now = runtime.gameTime
                    if (wheelPulseTick === -1) {
                        wheelPulseTick = now          // first sighting this tick
                    } else if (now !== wheelPulseTick) {
                        wheelPulse = 0                // a later tick: pulse expired
                        wheelPulseTick = -1
                    }
                }
                if ((code === WHEEL_UP && wheelPulse < 0) ||
                    (code === WHEEL_DOWN && wheelPulse > 0)) {
                    return 1
                }

            } else if (typeof code === 'number') {
                if (runtime.mouse.isMouseButtonDown(code)) {
                    return 1
                }

            } else if (runtime.keyboard.isKeyDown(code)) {

                return 1
            }
        }
        //check gamepad, there is no scripting interface for it yet, so going through an event sheet function
        for (const code of keybinds.gamepad[bind]) {

            if (runtime.callFunction("isGamepadButtonDown", code)) {

                return 1

            }
        }
        return 0
    }

    static getActionKeyName(inputType, action, index = 0) {
        if (inputType === "kbm") {
            const code = keybinds[inputType][action][index];
            if (code === WHEEL_UP) return "SCROLL UP"
            if (code === WHEEL_DOWN) return "SCROLL DOWN"
            if (typeof code === 'number') {
                return mouseButtonNames[code]
            }
            else {
                return code
            }
        }
        else {
            return gamepadButtonNames[keybinds[inputType][action][index]]
        }
    }

    //input listening, gamepad is handled in events
    static listenToKBM(runtime, action) {
        listeningKbmAction = action
        runtime.addEventListener(
            "keydown", _keyboardKeyPressed
        );
        runtime.addEventListener(
            "mousedown", _mouseButtonPressed
        );
    }


    // True if `code` is already in this specific action's binds. Used to reject
    // rebinding a key onto an action that already holds it (same-action repeat).
    static isCodeBoundToAction(inputType, action, code) {
        return keybinds[inputType]?.[action]?.includes(code) ?? false
    }

    // Conflict tier for the code sitting in keybinds[inputType][action][index]:
    //   0 = none    — not shared with any other action
    //   1 = allowed — shared, but the code is THIS action's shipped default
    //                 (an intentional duplicate, e.g. interact/takePhoto)
    //   2 = conflict — shared with another action and NOT a default here
    //                 (a likely-accidental overlap the player may want to fix)
    static getSlotConflictStatus(inputType, action, index) {
        const binds = keybinds[inputType]?.[action]
        if (!binds || binds[index] === undefined) return 0
        const code = binds[index]

        let shared = false
        for (const other of Object.keys(keybinds[inputType])) {
            if (other === action) continue
            if (keybinds[inputType][other]?.includes(code)) {
                shared = true
                break
            }
        }
        if (!shared) return 0

        const isDefaultHere =
            defaultKeybinds[inputType]?.[action]?.includes(code) ?? false
        return isDefaultHere ? 1 : 2
    }

    // Deprecated: the global "is this code used by ANY action" scan. The KBM
    // listeners below now use the same-action-only isCodeBoundToAction; the last
    // remaining caller is the gamepad GamepadInputListenResolve script in
    // E_inputs.json — delete this once that event-sheet call is migrated to
    // isCodeBoundToAction.
    static isCodeAlreadyBound(inputType, testCode) {
        for (const binds of Object.keys(keybinds[inputType])) {
            for (const code of keybinds[inputType][binds]) {
                if (code === testCode) {
                    return true
                }
            }
        }

        return false
    }

    // Cancel an in-progress KBM rebind without binding anything. The on-screen
    // cancel button closes the listen dialog without a key/mouse press, so the
    // listeners added by listenToKBM (which otherwise self-remove only on a
    // captured key/mouse event) would leak — remove them here. The persistent
    // wheel listener stays put; nulling listeningKbmAction stops it capturing.
    static cancelKBMListen(runtime) {
        listeningKbmAction = null
        runtime.removeEventListener("mousedown", _mouseButtonPressed)
        runtime.removeEventListener("keydown", _keyboardKeyPressed)
    }

    // Register the ALWAYS-ON wheel listener once at startup. Unlike keys/mouse
    // buttons (polled live via runtime.keyboard/mouse), the wheel only surfaces
    // as discrete events, so we latch each one into wheelPulse for isBindDown to
    // read. The same handler doubles as the rebind capture path while a listen
    // is active. Idempotent.
    static initScrollCapture(runtime) {
        if (scrollCaptureRuntime === runtime) return
        scrollCaptureRuntime = runtime
        runtime.addEventListener("wheel", _wheelScrolled)
    }
}

// Persistent wheel handler (registered by initScrollCapture). Latches the
// scroll direction into wheelPulse for isBindDown, and — while a KBM rebind is
// listening — captures the scroll as the new bind. e is a copy of a WheelEvent;
// deltaY < 0 = scroll up.
function _wheelScrolled(e) {
    const runtime = e.runtime
    if (e.deltaY < 0) wheelPulse = -1
    else if (e.deltaY > 0) wheelPulse = 1
    else return
    wheelPulseTick = -1 // re-arm: let the next poll tick observe this fresh pulse

    if (listeningKbmAction === null) return
    const code = e.deltaY < 0 ? WHEEL_UP : WHEEL_DOWN
    if (Inputs.isCodeBoundToAction("kbm", listeningKbmAction, code)) {
        runtime.callFunction("inputListenFail")
    } else {
        runtime.callFunction("kbmInputListenSuccess", code, 0)
    }
    // end the listen: drop the key/mouse capture listeners too
    listeningKbmAction = null
    runtime.removeEventListener("mousedown", _mouseButtonPressed)
    runtime.removeEventListener("keydown", _keyboardKeyPressed)
}

// NOTE: both handlers below MUST null listeningKbmAction when they resolve the
// listen. The wheel handler above is persistent and treats a non-null
// listeningKbmAction as "a rebind is still open" — leaving it set after a
// key/mouse capture made the NEXT scroll (possibly minutes later, with the
// dialog long closed and its local vars cleared) call kbmInputListenSuccess
// again with an empty input type -> "Cannot read properties of undefined".
function _keyboardKeyPressed(e) {
    const action = listeningKbmAction
    listeningKbmAction = null
    if (Inputs.isCodeBoundToAction("kbm", action, e.code)) {
        e.runtime.callFunction("inputListenFail")
    }
    else {
        e.runtime.callFunction("kbmInputListenSuccess", e.code, 0)
    }

    e.runtime.removeEventListener("mousedown", _mouseButtonPressed)
    e.runtime.removeEventListener("keydown", _keyboardKeyPressed)
}

function _mouseButtonPressed(e) {
    const action = listeningKbmAction
    listeningKbmAction = null
    if (Inputs.isCodeBoundToAction("kbm", action, e.button)) {
        e.runtime.callFunction("inputListenFail")
    }
    else {
        e.runtime.callFunction("kbmInputListenSuccess", e.button, 1)
    }

    e.runtime.removeEventListener("mousedown", _mouseButtonPressed)
    e.runtime.removeEventListener("keydown", _keyboardKeyPressed)
}
