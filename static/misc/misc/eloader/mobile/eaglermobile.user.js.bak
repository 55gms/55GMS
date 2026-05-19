// ==UserScript==
// @name            Eagler Mobile
// @description     Allows eaglercraft to run on mobile, adds touch controls, and fixes a few mobile-related crashes
// @author          FlamedDogo99
// @namespace       http://github.com/FlamedDogo99
// @downloadURL     https://raw.githubusercontent.com/FlamedDogo99/EaglerMobile/main/eaglermobile.user.js
// @license         Apache License 2.0 - http://www.apache.org/licenses/
// @match           https://eaglercraft.com/mc/*
// @version         3.0.5b
// @updateURL       https://raw.githubusercontent.com/FlamedDogo99/EaglerMobile/main/eaglermobile.user.js
// @run-at          document-start
// @grant           none
// ==/UserScript==

// Removed brainless unsafeWindow 
console.log("Eagler Mobile v3.0.5b")
// TODO: remove the mobile check is implement the dynamic enabling and disabling of individual features
function isMobile() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}
if(!isMobile()) {
    alert("WARNING: This script was created for mobile, and may break functionality in non-mobile browsers!");
}
// TODO: consolidate all of these into a single object?
window.crouchLock = false; // Used for crouch mobile control
window.sprintLock = false; // Used for sprint mobile control
window.keyboardFix = false; // keyboardFix ? "Standard Keyboard" : "Compatibility Mode"
window.inputFix = false; // If true, Duplicate Mode
window.blockNextInput = false; // Used for Duplicate Mode 
window.hiddenInputFocused = false; // Used for keyboard display on mobile
window.canvasTouchMode = 0; // Used for canvas touch handling
/*
    0   Idle
    1   Touch initiated
    2   Primary touch
    3   Secondary touch
    4   Scroll
    5   Finished
*/
window.canvasTouchStartX = null;
window.canvasTouchStartY = null;
window.canvasTouchPreviousX = null;
window.canvasTouchPreviousY = null;
window.canvasPrimaryID = null;
window.buttonTouchStartX = null;

// charCodeAt is designed for unicode characters, and doesn't match the behavior of the keyCodes used by KeyboardEvents, thus necessitating this function
String.prototype.toKeyCode = function() {
        const keyCodeList = {"0": 48, "1": 49, "2": 50, "3": 51, "4": 52, "5": 53, "6": 54, "7": 55, "8": 56, "9": 57, "backspace": 8, "tab": 9, "enter": 13, "shift": 16, "ctrl": 17, "alt": 18, "pause_break": 19, "caps_lock": 20, "escape": 27, " ": 32, "page_up": 33, "page_down": 34, "end": 35, "home": 36, "left_arrow": 37, "up_arrow": 38, "right_arrow": 39, "down_arrow": 40, "insert": 45, "delete": 46, "a": 65, "b": 66, "c": 67, "d": 68, "e": 69, "f": 70, "g": 71, "h": 72, "i": 73, "j": 74, "k": 75, "l": 76, "m": 77, "n": 78, "o": 79, "p": 80, "q": 81, "r": 82, "s": 83, "t": 84, "u": 85, "v": 86, "w": 87, "x": 88, "y": 89, "z": 90, "left_window_key": 91, "right_window_key": 92, "select_key": 93, "numpad_0": 96, "numpad_1": 97, "numpad_2": 98, "numpad_3": 99, "numpad_4": 100, "numpad_5": 101, "numpad_6": 102, "numpad_7": 103, "numpad_8": 104, "numpad_9": 105, "*": 106, "+": 107, "-": 109, ".": 110, "/": 111, "f1": 112, "f2": 113, "f3": 114, "f4": 115, "f5": 116, "f6": 117, "f7": 118, "f8": 119, "f9": 120, "f10": 121, "f11": 122, "f12": 123, "num_lock": 144, "scroll_lock": 145, ";": 186, "=": 187, ",": 188, "-": 189, ".": 190, "/": 191, "\u0060": 192, "[": 219, "\u005C": 220, "]": 221, "\u0022": 222};
    return keyCodeList[this];
}
// Overrides the addEventListener behavior to all code injection on keydown event listeners. This function has thrown TypeErrors on some Android devices because fn is not recognized as a function
// This is used by Compatibility Mode to block invalid keyEvents
const _addEventListener = EventTarget.prototype.addEventListener;
Object.defineProperty(EventTarget.prototype, "addEventListener", {
    value: function (type, fn, ...rest) {
        if(type == 'keydown') { // Check if a keydown event is being added
            _addEventListener.call(this, type, function(...args) {
                if(args[0].isTrusted && window.keyboardFix) { // When we are in compatibility mode, we ignore all trusted keyboard events
                    return;
                }
                return fn.apply(this, args); // Appends the rest of the function specified by addEventListener
            }, ...rest);
        } else { // If it's not a keydown event, behave like normal (hopefully)
            _addEventListener.call(this, type, fn, ...rest);
        }
    }
});
// Overrides preventDefault, because on some (Android) devices you couldn't type into hiddenInput
const _preventDefault = Event.prototype.preventDefault;
Event.prototype.preventDefault = function(shouldBypass) {
  if(document.activeElement.id != "hiddenInput" || shouldBypass) { // activeElement is what element is currently focused
      this._preventDefault =  _preventDefault;
      this._preventDefault();
  }
}
// Key and mouse events
// Note: the client must have the key, keyCode, and which parameters defined or it will crash
// Note: for text inputs, the client only reads from the "key" paramater
//     * an exception to this appears to be the shift and backspace key
// Note: for inGame inputs, the client only reads from the "keyCode character"
function keyEvent(name, state) {
    const charCode = name.toKeyCode();
    let evt = new KeyboardEvent(state, {
        "key": name,
        "keyCode": charCode,
        "which": charCode
    });
    window.dispatchEvent(evt);
}
function mouseEvent(number, state, element, event = {"clientX": 0, "clientY" : 0, "screenX": 0, "screenY": 0}) {
    element.dispatchEvent(new PointerEvent(state, {
        "button": number,
        "buttons": number,
        "clientX": event.clientX,
        "clientY" : event.clientY,
        "screenX": event.screenX,
        "screenY": event.screenY
    }));
}
function wheelEvent(element, delta) {
    element.dispatchEvent(new WheelEvent("wheel", {
        "wheelDeltaY": delta
  }));
}
function setButtonVisibility(pointerLocked) {
    let inGameStyle = document.getElementById('inGameStyle');
    let inMenuStyle = document.getElementById('inMenuStyle');
    inGameStyle.disabled = pointerLocked;
    inMenuStyle.disabled = !pointerLocked;  
}
// POINTERLOCK
// When requestpointerlock is called, this dispatches an event, saves the requested element to window.fakelock, and unhides the touch controls
window.fakelock = null;

Object.defineProperty(Element.prototype, "requestPointerLock", {
    value: function() {
        window.fakelock = this
        document.dispatchEvent(new Event('pointerlockchange'));
        setButtonVisibility(true);
        return true
    }
});


// Makes pointerLockElement return window.fakelock
Object.defineProperty(Document.prototype, "pointerLockElement", {
    get: function() {
        return window.fakelock;
    }
});
// When exitPointerLock is called, this dispatches an event, clears the
Object.defineProperty(Document.prototype, "exitPointerLock", {
    value: function() {
        window.fakelock = null
        document.dispatchEvent(new Event('pointerlockchange'));
        setButtonVisibility(false);
        return true
    }
});

// FULLSCREEN
window.fakefull = null;
// Stops the client from crashing when fullscreen is requested
Object.defineProperty(Element.prototype, "requestFullscreen", {
    value: function() {
        window.fakefull = this
        document.dispatchEvent(new Event('fullscreenchange'));
        return true
    }
});
Object.defineProperty(document, "fullscreenElement", {
    get: function() {
        return window.fakefull;
    }
});
Object.defineProperty(Document.prototype, "exitFullscreen", {
    value: function() {
        window.fakefull = null
        document.dispatchEvent(new Event('fullscreenchange'));
        return true
    }
});

// FILE UPLOADING
// Safari doesn't recognize the element.click() used to display the file uploader as an action performed by the user, so it ignores it.
// This hijacks the element.createElement() function to add the file upload to the DOM, so the user can manually press the button again.
const _createElement = document.createElement;
document.createElement = function(type, ignore) {
    this._createElement = _createElement;
    var element = this._createElement(type);
    if(type == "input" && !ignore) { // We set the ingore flag to true when we create the hiddenInput
        document.querySelectorAll('#fileUpload').forEach(e => e.parentNode.removeChild(e)); // Get rid of any left over fileUpload inputs
        element.id = "fileUpload";
        element.addEventListener('change', function(e) {
            element.hidden = true;
            element.style.display = "none";
        }, {passive: false, once: true});
        window.addEventListener('focus', function(e) {
            setTimeout(() => {
                element.hidden = true;
                element.style.display = "none";
            }, 300)
        }, { once: true })
        document.body.appendChild(element);
    }
    return element;
}

// Lazy way to hide touch controls through CSS.
let inGameStyle = document.createElement("style");
inGameStyle.id = "inGameStyle";
inGameStyle.textContent = `
    .inGame {
        display: none;
    }`;
document.documentElement.appendChild(inGameStyle);

let inMenuStyle = document.createElement("style");
inMenuStyle.id = "inMenuStyle";
inMenuStyle.textContent = `
    .inMenu {
        display: none;
    }`;
document.documentElement.appendChild(inMenuStyle);


// The canvas is created by the client after it finishes unzipping and loading. When the canvas is created, this applies any necessary event listeners and creates buttons
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });
}
function createTouchButton(buttonClass, buttonDisplay, elementName) {
    var touchButton = document.createElement(elementName ?? 'button', true);
    touchButton.classList.add(buttonClass);
    touchButton.classList.add(buttonDisplay);
    touchButton.classList.add("mobileControl");
    touchButton.addEventListener("touchmove", function(e){e.preventDefault()}, false);
    touchButton.addEventListener("contextmenu", function(e){e.preventDefault()});
    return touchButton;
}


waitForElm('canvas').then(() => {insertCanvasElements()});
function insertCanvasElements() {    
    // Translates touchmove events to mousemove events when inGame, and touchmove events to wheele events when inMenu
    var canvas = document.querySelector('canvas');
    canvas.addEventListener("touchstart", function(e) {
        if(window.canvasTouchMode < 2) { // If a touch is initiated but not assigned
            if(window.canvasPrimaryID == null) {
                window.canvasTouchMode = 1;
                const primaryTouch = e.changedTouches[0];
                window.canvasPrimaryID = primaryTouch.identifier
                canvasTouchStartX = primaryTouch.clientX;
                canvasTouchStartY = primaryTouch.clientY;
                canvasTouchPreviousX = canvasTouchStartX
                canvasTouchPreviousY = canvasTouchStartY

                window.touchTimer = setTimeout(function(e) {
                    // If our touch is still set to initiaited, set it to secondary touch
                    if(window.canvasTouchMode == 1) {
                        window.canvasTouchMode = 3;
                        mouseEvent(2, "mousedown", canvas, primaryTouch)
                        if(window.fakelock) { // We only dispatch mouseup inGame because we want to be able to click + drag items in GUI's
                            mouseEvent(2, "mouseup", canvas, primaryTouch)
                        }
                    }
                }, 300);
            } else if(window.canvasTouchMode == 1 && !window.fakelock) { // If we already have a primary touch, it means we're using two fingers
                window.canvasTouchMode = 4;
                clearTimeout(window.crouchTimer); // TODO: Find out why this isn't redudnant
            }
        }
    }, false);

    canvas.addEventListener("touchmove", function(e) {
        e.preventDefault() // Prevents window zoom when using two fingers
        var primaryTouch;
        for (let touchIndex = 0; touchIndex < e.targetTouches.length; touchIndex++) { // Iterate through our touches to find a touch event matching the primary touch ID
            if(e.targetTouches[touchIndex].identifier == window.canvasPrimaryID) {
                primaryTouch = e.targetTouches[touchIndex];
                break;
            }
        }
        if(primaryTouch) {
            primaryTouch.distanceX = primaryTouch.clientX - canvasTouchStartX;
            primaryTouch.distanceY = primaryTouch.clientY - canvasTouchStartY;
            primaryTouch.squaredNorm = (primaryTouch.distanceX * primaryTouch.distanceX) + (primaryTouch.distanceY * primaryTouch.distanceY);
            primaryTouch.movementX = primaryTouch.clientX - canvasTouchPreviousX;
            primaryTouch.movementY = primaryTouch.clientY - canvasTouchPreviousY;
            if(window.canvasTouchMode == 1) { // If the primary touch is still only initiated
                if (primaryTouch.squaredNorm > 25) { // If our touch becomes a touch + drag
                    clearTimeout(window.crouchTimer);
                    window.canvasTouchMode = 2;
                    if(!window.fakelock) { // When we're inGame, we don't want to be placing blocks when we are moving the camera around
                        mouseEvent(1, "mousedown", canvas, primaryTouch);
                    }
                }
            } else { // If our touch is primary, secondary, scroll or finished
                if(window.canvasTouchMode == 4) { // If our touch is scrolling
                    wheelEvent(canvas, primaryTouch.movementY)
                } else {
                    canvas.dispatchEvent(new MouseEvent("mousemove", {
                        "clientX": primaryTouch.clientX,
                        "clientY": primaryTouch.clientY,
                        "screenX": primaryTouch.screenX,
                        "screenY": primaryTouch.screenY, // The top four are used for item position when in GUI's, the bottom two are for moving the camera inGame
                        "movementX": primaryTouch.movementX,
                        "movementY": primaryTouch.movementY
                    }));
                }
            }
            canvasTouchPreviousX = primaryTouch.clientX
            canvasTouchPreviousY = primaryTouch.clientY
        }
    }, false);

    function canvasTouchEnd(e) {
        for(let touchIndex = 0; touchIndex < e.changedTouches.length; touchIndex++) { // Iterate through changed touches to find primary touch
            if(e.changedTouches[touchIndex].identifier == window.canvasPrimaryID) {
                let primaryTouch = e.changedTouches[touchIndex]
                // When any of the controlling fingers go away, we want to wait until we aren't receiving any other touch events
                if(window.canvasTouchMode == 2) {
                    mouseEvent(1, "mouseup", canvas, primaryTouch)
                } else if (window.canvasTouchMode == 3) {
                    e.preventDefault(); // This prevents some mobile devices from dispatching a mousedown + mouseup event after a touch is ended
                    mouseEvent(2, "mouseup", canvas, primaryTouch)
                }
                window.canvasTouchMode = 5;
            }
        }
        if(e.targetTouches.length == 0) { // We want to wait until all fingers are off the canvas before we reset for the next cycle
            window.canvasTouchMode = 0;
            window.canvasPrimaryID = null;
        }
    }

    canvas.addEventListener("touchend", canvasTouchEnd, false); 
    canvas.addEventListener("touchcancel", canvasTouchEnd, false); // TODO: Find out why this is different than touchend
    setButtonVisibility(window.fakelock != null); //Updates our mobile controls when the canvas finally loads
    // All of the touch buttons
    let strafeRightButton = createTouchButton("strafeRightButton", "inGame", "div");
    strafeRightButton.style.cssText = "left:20vh;bottom:20vh;"
    document.body.appendChild(strafeRightButton);
    let strafeLeftButton = createTouchButton("strafeLeftButton", "inGame", "div");
    strafeLeftButton.style.cssText = "left:0vh;bottom:20vh;"
    document.body.appendChild(strafeLeftButton);
  
    let forwardButton = createTouchButton("forwardButton", "inGame", "div"); // We use a div here so can use the targetTouches property of touchmove events. If we didn't it would require me to make an actual touch handler and I don't want to
    forwardButton.style.cssText = "left:10vh;bottom:20vh;"
    forwardButton.addEventListener("touchstart", function(e){
        keyEvent("w", "keydown");
        strafeRightButton.classList.remove("hide");
        strafeLeftButton.classList.remove("hide");
        forwardButton.classList.add("active");
    }, false);
    forwardButton.addEventListener("touchmove", function(e) {
        e.preventDefault();
        const touch = e.targetTouches[0]; // We are just hoping that the user will only ever use one finger on the forward button

        if (!buttonTouchStartX) { // TODO: move this to a touchstart event handler
            buttonTouchStartX = touch.pageX;
        }
        let movementX = touch.pageX - buttonTouchStartX;
        if((movementX * 10) > window.innerHeight) {
            strafeRightButton.classList.add("active");
            strafeLeftButton.classList.remove("active");
            keyEvent("d", "keydown");
            keyEvent("a", "keyup");
            
        } else if ((movementX * 10) < (0 - window.innerHeight)) {
            strafeLeftButton.classList.add("active");
            strafeRightButton.classList.remove("active");
            keyEvent("a", "keydown");
            keyEvent("d", "keyup");
        } else {
            strafeRightButton.classList.remove("active");
            strafeLeftButton.classList.remove("active");
            
        }
    }, false);
    forwardButton.addEventListener("touchend", function(e) {
        keyEvent("w", "keyup"); // Luckily, it doesn't seem like eagler cares if we dispatch extra keyup events, so we can get away with just dispatching all of them here
        keyEvent("d", "keyup");
        keyEvent("a", "keyup");
        strafeRightButton.classList.remove("active");
        strafeLeftButton.classList.remove("active");
        strafeRightButton.classList.add("hide");
        strafeLeftButton.classList.add("hide");
        forwardButton.classList.remove("active");

        buttonTouchStartX = null;
    }, false);
    strafeRightButton.classList.add("hide");
    strafeLeftButton.classList.add("hide");
    document.body.appendChild(forwardButton);
    
    
    let rightButton = createTouchButton("rightButton", "inGame");
    rightButton.style.cssText = "left:20vh;bottom:10vh;"
    rightButton.addEventListener("touchstart", function(e){keyEvent("d", "keydown")}, false);
    rightButton.addEventListener("touchend", function(e){keyEvent("d", "keyup")}, false);
    document.body.appendChild(rightButton);
    let leftButton = createTouchButton("leftButton", "inGame");
    leftButton.style.cssText = "left: 0vh; bottom:10vh;"
    leftButton.addEventListener("touchstart", function(e){keyEvent("a", "keydown")}, false);
    leftButton.addEventListener("touchend", function(e){keyEvent("a", "keyup")}, false);
    document.body.appendChild(leftButton);
    let backButton = createTouchButton("backButton", "inGame");
    backButton.style.cssText = "left:10vh;bottom:0vh;"
    backButton.addEventListener("touchstart", function(e){keyEvent("s", "keydown")}, false);
    backButton.addEventListener("touchend", function(e){keyEvent("s", "keyup")}, false);
    document.body.appendChild(backButton);
    let jumpButton = createTouchButton("jumpButton", "inGame");
    jumpButton.style.cssText = "right:10vh;bottom:10vh;"
    jumpButton.addEventListener("touchstart", function(e){keyEvent(" ", "keydown")}, false);
    jumpButton.addEventListener("touchend", function(e){keyEvent(" ", "keyup")}, false);
    document.body.appendChild(jumpButton);
    
    let crouchButton = createTouchButton("crouchButton", "inGame");
    crouchButton.style.cssText = "left:10vh;bottom:10vh;"
    crouchButton.addEventListener("touchstart", function(e){
        keyEvent("shift", "keydown")
        window.crouchLock = window.crouchLock ? null : false
        window.crouchTimer = setTimeout(function(e) { // Allows us to lock the button after a long press
            window.crouchLock = (window.crouchLock != null);
            crouchButton.classList.toggle('active');
        }, 1000);
    }, false);

    crouchButton.addEventListener("touchend", function(e) {
        if(!window.crouchLock) {
            keyEvent("shift", "keyup")
            crouchButton.classList.remove('active');
            window.crouchLock = false
        }
        clearTimeout(window.crouchTimer);
    }, false);
    document.body.appendChild(crouchButton);
    let inventoryButton = createTouchButton("inventoryButton", "inGame");
    inventoryButton.style.cssText = "right:0vh;bottom:30vh;"
    inventoryButton.addEventListener("touchstart", function(e) {
        keyEvent("e", "keydown");
    }, false);
    inventoryButton.addEventListener("touchend", function(e){
        keyEvent("shift", "keydown"); // Sometimes shift gets stuck on, which interferes with item manipulation in GUI's
        keyEvent("shift", "keyup"); // Sometimes shift gets stuck on, which interferes with item manipulation in GUI's
        keyEvent("e", "keyup");
    }, false);
    document.body.appendChild(inventoryButton);
    let exitButton = createTouchButton("exitButton", "inMenu");
    exitButton.style.cssText = "top: 0vh; margin: auto; left: 0vh; right:8vh; width: 8vh; height: 8vh;"
    exitButton.addEventListener("touchstart", function(e){keyEvent("`", "keydown")}, false);
    exitButton.addEventListener("touchend", function(e){keyEvent("`", "keyup")}, false);
    document.body.appendChild(exitButton);
    // ---Input Handling---
    // This code is a mess, specifically because Android is so so SO inconsistent with how it handles the keyboard
    // Some keyboards dispatch key events, some directly append text, and none of them meet the most basic standards supported by most other devices
    // This mess is my attempt at dealing with that, and it will most likely only ever be triggered by Android
    // 
    // It has three main modes.
    // 1) Standard keyboard mode:
    // This mode keeps the hiddenInput empty, saves the last key press, and on every keypress checks if it the keys are being pressed incorrectly.
    // If there is a problem, it switches to compatibility mode, using beforeinput and input events instead of keydown and keyup
    // 2) Compatibility mode:
    // This most is most likely going to be used by Android, because Android only every dispatches keyCode 229 for any keypress
    // When we enter this mode, we grab the last known key press and redispatch it, and programatically dispatch key events by reading e.inputType and e.data from beforeinput
    // Unfortunately, Android is weird with this as well. Sometimes it only dispatches insertCompositionText events, and sometimes it gives the correct inputTypes as well
    // Additionally, programmatically setting the input's text contents (BECAUSE ANDROID IGNORES PREVENTDEFAULT AGHHHHH) dispatches a repeat of the previous event
    // Luckily, we can check if this happens when we first create the input, which necessitates the third mode:
    // 3) Duplicate mode:
    // If we are getting duplicate inputs, this mode ignores every other input if it matches the state saved in window.previousKey
    // If users make it to this mode and still are having issues, it may be best just to remove support for their device
    // ---Input Handling--- 
    let hiddenInput = document.createElement('input', true);
    hiddenInput.id = "hiddenInput"
    hiddenInput.classList.add("inMenu")
    hiddenInput.style.cssText = "position:absolute;top: 0vh; margin: auto; left: 8vh; right:0vh; width: 8vh; height: 8vh;font-size:20px;z-index: -10;color: transparent;text-shadow: 0 0 0 black;"; // We hide the input behind a key because display: none and opacity:0 causes issues
    hiddenInput.addEventListener("beforeinput", function(e) { // For some reason beforeinput doesn't have the same deletion problems that input has on Android
        e.stopImmediatePropagation(); // Android ignores this and the prevent default, so this will probably be removed in the future
        e.preventDefault(true); // We pass a value because we've hijacked the prevent default function to have a "should bypass" boolean value
        let inputData = (e.inputType == "insertLineBreak") ? "return" : (e.data == null ? "delete" : e.data.slice(-1)); // Saves the last key press. 
        if(!window.lastKey) { // When we first set hiddenInput's text contents to " " we can use this to check if Duplicate Mode is needed
            window.console.warn("Enabling blocking duplicate key events. Some functionality may be lost.")
            window.inputFix = true;
        }
        if(window.keyboardFix) {
            if(e.inputType == "insertLineBreak") { // Detects return key press
                keyEvent("enter", "keydown");
                keyEvent("enter", "keyup");
            } else {
                const sliceInputType = e.inputType.slice(0,1); // Android doesn't constiently dispatch the correct inputType, but most of them either start with i for insert or d for delete, so this dumb solution should be good enough.
                if(sliceInputType== 'i' && e.data) { // Android sometimes always dispatches insertCompositionText inputTypes, so checking that e.data isn't null is necessary
                    const isDuplicate = (window.lastKey == inputData) && window.blockNextInput && window.inputFix;
                    if(isDuplicate) { // If our key press matches the last unblocked key press and we are in duplicaye mode, ignore the input
                        window.blockNextInput = false;
                    } else {
                        let isShift = (inputData.toLowerCase() != inputData);
                        if(isShift) { // The Eaglerclient only uses e.key, e.keyCode and e.which, so we have to dispatch the shift key event separately  
                            keyEvent("shift", "keydown");
                            keyEvent(inputData, "keydown");
                            keyEvent(inputData, "keyup");
                            keyEvent("shift", "keyup");
                        } else {
                            keyEvent(inputData, "keydown");
                            keyEvent(inputData, "keyup");
                        }
                        window.blockNextInput = true;
                    }
                } else if (sliceInputType == 'd' || !e.data) {
                    keyEvent("backspace", "keydown");
                    keyEvent("backspace", "keyup");
                    window.blockNextInput = false; // If we delete a character, there couldn't be a duplicate of the previous key press
                }
            }
        }
        window.lastKey = inputData // Saves the last key pressed
        hiddenInput.value = " " //This previously allowed us to have a character to delete, but beforeinput doesn't require this. This does allow us to check wether Duplicate Mode is necessary though


    }, false);
    hiddenInput.addEventListener("input", function(e) { // Since we are using beforeInput for input detection, setting the text contents of hiddenInput causes weird behavior, so we use input instead
        if (hiddenInput.value != " ") { // Avoid updating it if not needed so Duplicate Mode doesn't throw a fit
            hiddenInput.value = " ";
        }
    }, false);
    hiddenInput.addEventListener("keydown", function(e) { // Enables Compatibility Mode if we receive an invalid key press event
        if((e.keyCode == 229 || e.which == 229) && !window.keyboardFix) {
            window.console.warn("Switching from keydown to input events due to invalid KeyboardEvent. Some functionality will be lost.")
            window.keyboardFix = true;
            if(window.lastKey) { // Resend the last saved key press (which is being tracked by the beforeinput event listener) so the transition to Compatibility Mode isn't noticeable
                keyEvent(window.lastKey, "keydown");
                keyEvent(window.lastKey, "keyup");
            }
        }
    }, false);
    hiddenInput.addEventListener("blur", function(e) { // Updates window.hiddenInputFocused to reflect the actual state of the focus 
        window.hiddenInputFocused = false;
    });
    document.body.appendChild(hiddenInput);
    let keyboardButton = createTouchButton("keyboardButton", "inMenu");
    keyboardButton.style.cssText = "top: 0vh; margin: auto; left: 8vh; right:0vh; width: 8vh; height: 8vh;"
    keyboardButton.addEventListener("touchstart", function(e){
        e.preventDefault();
    }, false);
    keyboardButton.addEventListener("touchend", function(e){
        e.preventDefault();
        if(window.hiddenInputFocused) {
            hiddenInput.blur()
        } else {
            hiddenInput.select()
            window.hiddenInputFocused = true;
        }
    }, false);
    document.body.appendChild(keyboardButton);
    let placeButton = createTouchButton("placeButton", "inGame");
    placeButton.style.cssText = "right:0vh;bottom:20vh;"
    placeButton.addEventListener("touchstart", function(e){mouseEvent(2, "mousedown", canvas)}, false);
    placeButton.addEventListener("touchend", function(e){mouseEvent(2, "mouseup", canvas)}, false);
    document.body.appendChild(placeButton);
    let breakButton = createTouchButton("breakButton", "inGame");
    breakButton.style.cssText = "right:10vh;bottom:20vh;"
    breakButton.addEventListener("touchstart", function(e){mouseEvent(0, "mousedown", canvas)}, false);
    breakButton.addEventListener("touchend", function(e){mouseEvent(0, "mouseup", canvas)}, false);
    document.body.appendChild(breakButton);
    let selectButton = createTouchButton("selectButton", "inGame");
    selectButton.style.cssText = "right:20vh;bottom:20vh;"
    selectButton.addEventListener("touchstart", function(e){mouseEvent(1, "mousedown", canvas)}, false);
    selectButton.addEventListener("touchend", function(e){mouseEvent(1, "mouseup", canvas)}, false);
    document.body.appendChild(selectButton);
    let scrollUpButton = createTouchButton("scrollUpButton", "inGame");
    scrollUpButton.style.cssText = "right:0vh;bottom:0vh;"
    scrollUpButton.addEventListener("touchstart", function(e){wheelEvent(canvas, -10)}, false);
    document.body.appendChild(scrollUpButton);
    let scrollDownButton = createTouchButton("scrollDownButton", "inGame");
    scrollDownButton.style.cssText = "right:10vh;bottom:0vh;"
    scrollDownButton.addEventListener("touchstart", function(e){wheelEvent(canvas, 10)}, false);
    document.body.appendChild(scrollDownButton);
    let throwButton = createTouchButton("throwButton", "inGame");
    throwButton.style.cssText = "right:10vh;bottom:30vh;"
    throwButton.addEventListener("touchstart", function(e){keyEvent("q", "keydown")}, false);
    throwButton.addEventListener("touchend", function(e){keyEvent("q", "keyup")}, false);
    document.body.appendChild(throwButton);
    let sprintButton = createTouchButton("sprintButton", "inGame");
    sprintButton.style.cssText = "right:0vh;bottom:10vh;"
    sprintButton.addEventListener("touchstart", function(e) {
        keyEvent("r", "keydown");
        window.sprintLock = window.sprintLock ? null : false
        window.sprintTimer = setTimeout(function(e) {
            window.sprintLock = (window.sprintLock != null);
            sprintButton.classList.toggle('active');
        }, 1000);
    }, false);

    sprintButton.addEventListener("touchend", function(e) {
        if(!window.sprintLock) {
            keyEvent("r", "keyup");
            sprintButton.classList.remove('active');
            window.sprintLock = false
        }
        clearTimeout(window.sprintTimer);
    }, false);
    document.body.appendChild(sprintButton);
    let pauseButton = createTouchButton("pauseButton", "inGame");
    pauseButton.style.cssText = "top: 0vh; margin: auto; left: 0vh; right: 32vh; width: 8vh; height: 8vh;"
    pauseButton.addEventListener("touchstart", function(e){keyEvent("`", "keydown")}, false);
    pauseButton.addEventListener("touchend", function(e){keyEvent("`", "keyup")}, false);
    document.body.appendChild(pauseButton);
    let chatButton = createTouchButton("chatButton", "inGame");
    chatButton.style.cssText = "top: 0vh; margin: auto; left: 0vh; right: 16vh; width: 8vh; height: 8vh;"
    chatButton.addEventListener("touchstart", function(e){keyEvent("t", "keydown")}, false); // For some reason dispatching a keyup event for this closes the chat, which is really weird
    document.body.appendChild(chatButton);
    let perspectiveButton = createTouchButton("perspectiveButton", "inGame");
    perspectiveButton.style.cssText = "top: 0vh; margin: auto; left: 0vh; right: 0vh; width: 8vh; height: 8vh;"
    perspectiveButton.addEventListener("touchstart", function(e) {
        keyEvent("f", "keydown");
        keyEvent("5", "keydown");
    }, false);
    perspectiveButton.addEventListener("touchend", function(e) {
        keyEvent("f", "keyup");
        keyEvent("5", "keyup");
    }, false);
    document.body.appendChild(perspectiveButton);
    let screenshotButton = createTouchButton("screenshotButton", "inGame");
    screenshotButton.style.cssText = "top: 0vh; margin: auto; left: 16vh; right: 0vh; width: 8vh; height: 8vh;"
    screenshotButton.addEventListener("touchstart", function(e) {
        keyEvent("f", "keydown");
        keyEvent("2", "keydown");
    }, false);
    screenshotButton.addEventListener("touchend", function(e) {
        keyEvent("f", "keyup");
        keyEvent("2", "keyup");
    }, false);
    document.body.appendChild(screenshotButton);
    let coordinatesButton = createTouchButton("coordinatesButton", "inGame");
    coordinatesButton.style.cssText = "top: 0vh; margin: auto; left: 32vh; right: 0vh; width: 8vh; height: 8vh;"
    coordinatesButton.addEventListener("touchstart", function(e) {
        keyEvent("f", "keydown");
        keyEvent("3", "keydown");
    }, false);
    coordinatesButton.addEventListener("touchend", function(e) {
        keyEvent("f", "keyup");
        keyEvent("3", "keyup");
    }, false);
    document.body.appendChild(coordinatesButton);
}
// CSS for touch screen buttons, along with fixing iOS's issues with 100vh ignoring the naviagtion bar, and actually disabling zoom because safari ignores user-scalable=no :(
let customStyle = document.createElement("style");
customStyle.textContent = `
    .mobileControl, .mobileControl:active, .mobileControl.active{
        position: absolute; 
        width: 10vh;
        height: 10vh;
        font-size: 4vh;
        line-height: 0px;
        padding: 0px;
        background-color: transparent;
        box-sizing: content-box;
        image-rendering: pixelated;
        background-size: cover;
        box-shadow: none;
        border: none;
        touch-action: pan-x pan-y;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        outline: none;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    }
    .mobileControl:active, .mobileControl.active {
        position: absolute; 
        width: 10vh;
        height: 10vh;
        font-size: 4vh;
        line-height: 0px;
        padding: 0px;
        background-color: transparent;
        box-sizing: content-box;
        image-rendering: pixelated;
        background-size: cover;
        box-shadow: none;
        border: none;
        touch-action: pan-x pan-y;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        outline: none;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    }
    html, body, canvas {
        height: 100svh !important;
        height: -webkit-fill-available !important;
        touch-action: pan-x pan-y;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        outline: none;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    }
    .hide {
        display: none;
    }
    #fileUpload {
        position: absolute;
        left: 0;
        right: 100vw;
        top: 0; 
        bottom: 100vh;
        width: 100vw;
        height: 100vh;
        background-color:rgba(255,255,255,0.5);
    }
    .strafeRightButton {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAUGVYSWZNTQAqAAAACAACARIAAwAAAAEAAQAAh2kABAAAAAEAAAAmAAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAAWoAMABAAAAAEAAAAWAAAAAA78HUQAAAIwaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4yMjwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4yMjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KhDb0tQAAANRJREFUOBHVlMENwyAMRWnVHcqIjMEYzJAemlUidQh6aFZIApIt20FgUC/JxTb8/2wRgTFX+25i4E3UvSXyMDkIGeqc64VlfQgBfJnJwAC11oJIFWOMFJ6Zd+nshSZ/yXMCy0aj9aPH6L1HOc1xkSQqcAtCeJhWwSNAIA+dsaZhFawBwIQyVsFJLOGylkCom+ASHMy1WP151KidFDynieF6gkATSx42cYzf43o+TUnYajBNLyZh4LSzLB8mGC3YUczze5Rj1vXHvPTZTBt/e+hZl0sUO9qPMTJ6UlWFAAAAAElFTkSuQmCC");
    }
    .strafeRightButton.active, .strafeRightButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAEsWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjIyIgogICBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjIiCiAgIGV4aWY6Q29sb3JTcGFjZT0iMSIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMjIiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjcyLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjcyLzEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMDg6NTQ6MzYtMDU6MDAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDUtMzFUMDg6NTQ6MzYtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQwODo1NDozNi0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+QDppmQAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAKlJREFUOI3t1E0OgyAQBeBn08NwHLtyTsBCT2PiihNwJC5Rr6AbMfzYOjO1iyZ9K0jgYzIBgH+2NMV8ucpL4QUAvPcqkYgyM4MjGkIQocaYFG8A4FYukqKv9lTwVblLFltr97Fz7nM4Bbl5C2vAGFWPz9pwCnMAFXyEcw9jtUJTOfu6SfGq4vg8JTnak/0VbfsAUSeGAaDvB8zzczerVozjpILLfO0//r2skH4sFj3RStwAAAAASUVORK5CYII=");
    }
    .strafeLeftButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAUGVYSWZNTQAqAAAACAACARIAAwAAAAEAAQAAh2kABAAAAAEAAAAmAAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAAWoAMABAAAAAEAAAAWAAAAAA78HUQAAAIwaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4yMjwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4yMjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KhDb0tQAAAVtJREFUOBHVVTtug0AQHT5CRklqOCAFB0CiAYkC7oA4glPGF7GUQ5AqVpyCAtjsW2tWGAjeOJVHGmYY3ns7DCwQPbI9y+a/HMcRcNu2lVuWJWTd1KGhzOJERuG6LkVRNCmZp3VdA/wt/QXJlXAcx6hREAQkO1X5/CAEmr8YY9q2VYWmaWgcR0W0GcRxSxQYiLEzJwxDlU4XXQgz+L/RvSVQlqWC7HY7SpLkFlxfN+646zoqioKqqtLkefKnUfR9T3AY3hqQsQB8yxYd85NmEguwOOpYwPd9hqzGhfAaSm6YRTlN00VtWjASzvOcPM9TPIwiyzKdT8WmuZEwCOga48AiJuYyaD5brnNcu/Utju6YQbw9WdAkrnF0xxBo2w8Kw0DGy943EWXMfv/KqYpamDs+Ht+vAPee6FEMw3A+HN7u1aHT6fNX7pO8YvpBF/IO9c8APwXJPUuHxoPaD5BueyY3ULuKAAAAAElFTkSuQmCC");
    }
    .strafeLeftButton.active, .strafeLeftButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAEsWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjIyIgogICBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjIiCiAgIGV4aWY6Q29sb3JTcGFjZT0iMSIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMjIiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjcyLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjcyLzEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMDg6NTY6MDgtMDU6MDAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDUtMzFUMDg6NTY6MDgtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQwODo1NjowOC0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IdwDtgAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAKtJREFUOI3t1LENwyAQBdDvKMMwjlPlJrjCmcZSKiZgJJaIV7AbYxlIBB+RIlJ+ZSR4dyAD8M+eIRmvvbwzvAKAc65JFJHIjOCAeu8p1BhzxgcAuKSTWPTTmgzulWtpgqoe39baapjqWFWjQt1gpkARZrZPwa0Fq+AUqdkF3XHt0RR/NxYMyToO15PJuzXRWzGON4jcaRgApumBZXkdZnYU8/xsgtN87T3+vWwtZC52/2ikAQAAAABJRU5ErkJggg==");
    }
    .forwardButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAACiSURBVHjazNXLCcMwDAbgX8JDeESPoTE8Q3JIVgl0CPXQrKBek1DwS4b6Zix9CCFkMjMQkcHxmBkRAAOAlJILmnMGALAnerXC8yHG2AWq6u3OHuivXMakUw2LCETEF76CtTi3oC04t6K1OPcmlmK4Fy3FThu3MFrx8Bz/J/xcJCNLKJQChipWfbu1YFnWe8XH8fLv8b5vbuB5fgAANOsz/Q4AuOQ/2az67j0AAAAASUVORK5CYII=");
    }
    .forwardButton.active, .forwardButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAADASURBVHjazNXdCYMwEMDxf9IM44MLCB3ECfJgl+gcTpBBCi5gwQmygi+W60NLsSKo8Sw9COTj7kcejsSICEeEAzDGqOoiYgwgACEEFbQsSwCsJjq23PSg67okMMuyr7XVQOdqLQfFath7j/deFx6Da3G7Bd2C263oWtymFi7l2FR0KfewdnNzm3Vd/66P/xOePiR7HiG3lJAaJ+A6DA/a9k6e57vBqrrQ9z2fH6Qozio3bZrbaxJj5I2rjRgjzwEApPZQpLqg/4wAAAAASUVORK5CYII=");
    }
    .rightButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAACpSURBVHjazJXLDQMhDETHFkVQImW4DGrYHLKtrJQivIdsC841y4VPbCm+IeBpZGYMmRmIyOBYZkYEwACglOICrbUCANgT+s1K7UbOeQmoqrc196AiAhHpgtu7PKpoBL4EnoXzbC9H4bzyUCNwXrVVD84Iqv9SHNLjEFeE+Hg2eakdJG3mR4HtEEq9Az/ZTfV08++2Pe6Kj+PlH5B9f7oBr+sNAKCoz/QzAEIyQCEEVZuQAAAAAElFTkSuQmCC");
    }
    .rightButton.active, .rightButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAADCSURBVHjatNXBCcMwDAXQHzXD6JAFAh3EE+iQLtE5MkEGKWSBFDyBV8glRb0U2qYlthVH4IOx/RC2kSpVxSERQgAALTlUFdVrgmEYiiTqnAMAUEn006rXC957E8jMX3NKQUUEIrIJr89STlYx3Azn4GS5zxScrK8fw2nP19rCCQfFLrjv+/LwFmqGY6gJTkGz4VT0pwgx8996kQKui1Ad22CNE4DrsjwwTXc0TbMb7LoL5nl+d5C2PRfJdBxvx/a85wDd42waukdj3wAAAABJRU5ErkJggg==");
    }
    .leftButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAClSURBVHja1NWxDcMgEIXh/xBDMCJj3BjM4BTxKpYyBCniFS5tjGJhCBShQ6BPJ3gcYmaIiDFwmJkIYAAxxiFoSgkANxL9tHy5EELoAnPOh7lrRVUVVaVWkGup6ht4NtwM9DLcil6Ce9Aq3Is2X95/VDzljKemYmqOe3BfNpJavzjDyybkaxt+SkXOz2H5XZbbseJte4x/IOt6Hwbu+wsAmfWZvgcArjJAIdYPiecAAAAASUVORK5CYII=");
    }
    .leftButton.active, .leftButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAADDSURBVHjatNXBDYMwDEDR7zTDcGABpA7CBDnQJToHEzBIJRagEhOwAhcq91a1UYEQEt+iJE+WLdmiquQICyAiSfVpmkQABei6Lgla1zUAJiX6bVn/YhzHKLAoip+zOYI653DO/b3z/5rQjNbAtTA50CA4Bt2FY9FN+Ax6qHnJ4LZt82V8Bt8tRSweVOMYPLh5R3HrD5KtebGF+0PI7j2IjQtwX5YXw/CkLMvTYNPcmOeZzwapqmuSTPv+AYCoapad9x4A2K1DUGTs/EYAAAAASUVORK5CYII=");
    }
    .backButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAACnSURBVHjavJXLEcMgDERXGoqgRMqgDGqwD3ErnkkR8sFuQbnGHhLzEdYNkB7LMghSVRCRwjBUlQiAAkAIwQSaUgIAsCX0m+WuC977JqCInMZsAc3VMgbFMLDLTcYYqyC5/GetqFH8K5drC0pzuLXwbmNuUVVyGq71sdR/13tJjz8Q/tdIepqQu0voUiyymVkwTfNZ8bq+7T1elpcZ8Dh2AACN+kw/AwCfbD/bsCZGlgAAAABJRU5ErkJggg==");
    }
    .backButton.active, .backButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAADESURBVHjavJXNDYMwDEaf3QzDgQWQOggTcGiX6BxMwCCVWIBKTJAVuFC5l0r9EYIQApZySGK/fHEUW8yMXcx7D2Aph/ceeU9omiaJ0LIsAdCU0G+W+9/o+z4KmGXZz1xTQKdilZ1sN7CbWqyqahWkruvjFGuogjVqZxWHwOd8NDZw6WCNURVyG12bx9D8u62PdPgH0blCsqUIuSWHWDsBt3F80nUP8jzfDLxcrgzD8OkgRXFOorRt7wCImSEiSTuqmclrANDkWlTK1XudAAAAAElFTkSuQmCC");
    }
    .jumpButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAUGVYSWZNTQAqAAAACAACARIAAwAAAAEAAQAAh2kABAAAAAEAAAAmAAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAAWoAMABAAAAAEAAAAWAAAAAA78HUQAAAIwaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4yMjwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4yMjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KhDb0tQAAASFJREFUOBHVlEGOgzAMRV1ggcQByuW4C8dgz66zKFdBmkNkFtMdUooEmZhiTxo8mWRVNRKyY38/DJIN8G7n5Dac57kpy9INRftaa1iWhXkFVSLUJqBpGgol2a7rYGdscH5DVVWGoHVdJ0GVUpu+73uYpmljZj4Boeu6+uE/76iVGjmAkZBlx3DbtoCPfyQtao4Ev9LeXaDrC1IO/QuWQFKMibsTBIcAoRyyg2C/i5R7EBzqKpSL6lgCSDH/a4Idk9gFuT7lJcsjLSXdWCyQag4d03iSIMZKNdyxMQaU+rLjebb2MfsxUNJcLh9Pq4DBtB/G8ZO0yVbrO9fwr5jnGYbhyolU53b7BmN+lxevTQTZhWKKgj8iiY2N2fPESwK8XPwDqnFjUQw2agIAAAAASUVORK5CYII=");
    }
    .jumpButton.active, .jumpButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAEsWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjIyIgogICBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjIiCiAgIGV4aWY6Q29sb3JTcGFjZT0iMSIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMjIiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjcyLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjcyLzEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMDk6MzM6MTYtMDU6MDAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDUtMzFUMDk6MzM6MTYtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQwOTozMzoxNi0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+k8/VfAAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAK9JREFUOI3t1M0NwyAMBeCXqsMwTnqqJ/AhnSZST0zASCzRrJBeSsVPABu1h0p9N4T9gSwB8M8rU7beP+XF8A4AzrkhkYgSM4ED6r1XocaYGJ8A4JQXadFaTwHXwsxgZvFhIjgGpXgXPoIkeBNuAT1cPGNtmrC1dmivC9eAHiqCc0iCAsBZVKUAQ4obh+epyVFP8lfM8wVEVzUMAMtyw7Y93mYxinW9D8F5vvYf/16eolUyCllQ87sAAAAASUVORK5CYII=");
    }
    .crouchButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAFPmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjIiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMiIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIyMiIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iOTYvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iOTYvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0zMVQwOTo0NjozMy0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMDk6NDY6MzMtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwODozNTo0MC0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQwOTo0NjozMy0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+MJmZ/gAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAANNJREFUOI3V1LENwyAQBdDvKDuEhuloGIMx3LCAU8SrWMoGNBekeAQ7lS1DwD5QUvhXcMATQgBwtjRRf/6Vt4VnANBaV4lt2wZmAC+oEKIIJaIt3gDAJZ6UQ40xMMYkx1JrvuAcmmrv5RBeIKUUlFJsfBfeolJKSCnZeBaO0SVcnHXGNTncsbUWzrm17pyDtTaYUwSncC56CMc4F2XBMcS9x9e4QETJl5QDp2mC934fJnpBiNv69kvSdfc8DADD8CxGUwnOuO8f1dA4voP+3z768+UDWxNf9NcgELQAAAAASUVORK5CYII=");
    }
    .crouchButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAFPmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjIiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMiIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIyMiIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0zMVQwOTo1MTo0My0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMDk6NTE6NDMtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwOTozMzoxNi0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQwOTo1MTo0My0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+m4M75AAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAM9JREFUOI3t1M8NgyAUx/GfTYdhCmawpzIBBzuNSU9MwBxM8ZaoK9hDi4En6JO0hyb9nvyDnxBFgH/vOnY+f8pL4RkAvPdNojEmMzM4okR0CFVKpXgHACc+qIZaa2GtLd4rPbOCa2jpeKtdOEIhBIQQxPgmnKJEBCIS41WYozEpLnrHLVVh5xwAQGu9LCfgtbS01tmYQ3AJl6K7MMelqAjmkAQFgDO/oJQq/klbYPoNYtle0fcXGHMVzYg3DDdM02MxVzMex3sTzPvafvx7PQF551iSZuKOLwAAAABJRU5ErkJggg==");
    }
    .crouchButton.active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAFy2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjIiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMiIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIyMiIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0zMVQwOTo1OToxNC0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMDk6NTk6MTQtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwODozNjoxMC0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwOTo1Njo0My0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQwOTo1OToxNC0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+dlsxWgAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAPFJREFUOI3V1NENgyAQBuC/hglsGlcgbmDSQRyiiSMQt/GtDtHEDZzGYF965IRDqG0f+j9hkM/zRIB/y8m7Xr/lcXgFgKa5HhKn6bExFZ8syzO67nYIrqoLxvHurjcVD8MAAJjnGUVRZKNaawBA27bODFbnotZaWGvdGj+BEEONMTDGJO+LwjFUGu/hSZigvu/dmOPZMPXNR6lCGqcqj1bsozwSng1/mmTFUlX+2/D2RWHeLwnnqARSVGyCHkC7geMpVKxYCv+AfIfs7eOgYq21+0X5Qr+fSiksywIAqOs6gINjkw6id/M6gJz5s4P+//IEHI9j+ArWcs0AAAAASUVORK5CYII=");
    }
    .inventoryButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAFPmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjIiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMiIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIyMiIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0zMVQxMDozNjoyOC0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMTA6MzY6MjgtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwODozNjoxMC0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQxMDozNjoyOC0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IX6oygAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAM9JREFUOI3dlTEOgjAUhr82jk4mJAxcwHO4eAVHt17DW/QMOMhVSEx0NE44yMTGgAPWYJEo8Fz4t/7t+/Infa9V1KqQlVIOaowRIVprAdCS0CZr5m+EYTgImGXZ21pLQD/V6o5zozURcBlElEE0yOsEl0HEzmzZrFec8qKX9zXx+XId7DkpoHJN7VrGJVgu5q+Dv3iul6217QHxi/t6ThNpN3Gw/5D0kV/burwx8KZ0DbuJwADieA80EqfpUQwOz8RJchAD5vkdqCcP/vCZPgBXBlJB5rsPrwAAAABJRU5ErkJggg==");
    }
    .inventoryButton.active, .inventoryButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAFPmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjIiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMiIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIyMiIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iOTYvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iOTYvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0zMVQxMDozNzoyNC0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMTA6Mzc6MjQtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwODozNTo0MC0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQxMDozNzoyNC0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+Ek/8IQAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAMBJREFUOI1jYKARYITS/6ltLiPM0BUrVlDFxIiICAYGBgYGJmoaimwWC7rEjRs3yDJQQ0MDhc9EDUOx6WXCoY5iMEwM/i0qw/BbVIYsMZwG/xaVYWjMSGSI9HBmuP7uC0liBF1848EjssVggJGBgeE/LFHDkgzMBZpCPHCFxIjB0nJERARmBkHXTKoYDAyT5EZ1g9ELElIAul6MyKPEcGQALY9XUsUwBgZEQc/CwMDAsGHDeoaXL19TzXAGBhrWeQBnYU1GknvkpwAAAABJRU5ErkJggg==");
    }
    .chatButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAEsWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjE4IgogICBleGlmOlBpeGVsWURpbWVuc2lvbj0iMTgiCiAgIGV4aWY6Q29sb3JTcGFjZT0iMSIKICAgdGlmZjpJbWFnZVdpZHRoPSIxOCIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMTgiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjcyLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjcyLzEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMDg6NDQ6MTEtMDU6MDAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDUtMzFUMDg6NDQ6MTEtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQwODo0NDoxMS0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+OsVW9wAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAN1JREFUOI2t1MERgyAQBdCvYw+hnKUD04Vd7NCFNZhDLMEWnEkRXKQFczAQQCSG5J8YYN4uKlbYsuK3VJVFuq4rEvq+3yQAq0WEEF8hWmuHNXbSIsx8ClFKQQjhsMZftIhSKoswM5g52FenKp3pJs4O8ivmxqegkiQhIgIRZcdxmngibl1KuRunjhdARIRpmoK3d/RMiCgoEkBSSte6D6aO4yM7KLUhrnwUB2mtgytiu8gh9qsGXnetba8Q4vKxairDcIMxy7ujeX4UQTY1AIzjvRgwZgGwHQ34w4/tCcPEV3iQ5pTDAAAAAElFTkSuQmCC");
    }
    .chatButton.active, .chatButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAFy2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMTgiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxOCIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIxOCIKICAgdGlmZjpJbWFnZVdpZHRoPSIxOCIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNi0wMVQxMDoyNzo0NS0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDYtMDFUMTA6Mjc6NDUtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwOTozMzoxNi0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwOTo1MTo0My0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNi0wMVQxMDoyNzo0NS0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+/Oo+0wAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZvyK0SgWFhaThpWRHzWxUUZCSRqjDDYz1/xQM+P13pNkq2wVJTZ+LfgL2CprpYiUrGdNbJie8+ZNjWTO7Z77ud97zunec8EVyaisUd0L2Zyph8dDvvnogq8uTy1VuKnHH1OGNjIzM0VF+3yUWLH7gF2rcty/1ricMBRU1QsPK003hSeEp9ZNzeY94VaVji0LXwh363JB4Qdbjzuctznl8LfNeiQ8Cq5mYV/qF8d/sUrrWWF5Of5sZk2V7mO/xJPIzc3K2iGzHYMw44TwMckYowTpY0h8kAD99MiOCvm9xfxpViVXidfYQGeFFGlMukVdk+oJWZOiJ2Rk2LD7/7evRnKg36nuCUHNq2W9d0LdLhR2LOvrxLIKp+B+getcOX/1GAY/RN8pa/4j8G7B5U1Zi+/D1Ta0PWsxPVaU3DJdySS8nUNTFFruoGHR6VnpnLMniGzKV93CwSF0Sbx36QfytWex+zpwggAAAAlwSFlzAAALEwAACxMBAJqcGAAAANFJREFUOI2t1MsRgyAQBuA1QzGUsXRgTqEGU8QOJThjEZZBGTQRWzAXl/CSEOJeZJD59kdFgItqOK77v87AyLquXYLW2ifaGXHO/YRIKT0meJIRImpCjDHgnPOYCG8yYoypIkQERBStu5U6taRJK4PCjrVxE9RTRQgRARGr47REOpFGV0pl49L2IggRwVobvb2zZ4KIUZMIUkr56CFY2k6IZFBpQdr5rDwkpYyOCKeoIfxVAxxnbRzvoPXja9dSTdMTtu31STTPSxcUJgK44H/0BuaQUd766ZZEAAAAAElFTkSuQmCC");
    }
    .pauseButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAUGVYSWZNTQAqAAAACAACARIAAwAAAAEAAQAAh2kABAAAAAEAAAAmAAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAASoAMABAAAAAEAAAASAAAAAIh0nEsAAAIwaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xODwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xODwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KINZMMgAAAPhJREFUOBGdUsENwjAMTBA70HX6Bok1+kRCTIGQeHaG8qCrVGKI8KArQGxj16lcSpOPHZ/vck7iHa33N+YG7yMTRaqqyhKp6xp5KMQiRVEsEgshYD+IrZi5VAR4mrNmIR1Px4Nsz5cr5lZNmmJiCjkHE4+XXOcYwP2EELzA+CFh74066codpceQiE+ckcu0NrBMR3T20AQZOLQG5q4JRwCnY5ATqNnrh1BKoDsDV7Yvc7Ttbi8qZVlibtWkKSamEJN1o1XTuIzG312Dc7nmoKMQnvG7b5wG5kQYb5obpjJa1z0Yy4o4Wtves8hA6vsXcvktp77Hvwf4DxqOPQw2kc6BAAAAAElFTkSuQmCC");
    }
    .pauseButton.active, .pauseButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAFy2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMTgiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxOCIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIxOCIKICAgdGlmZjpJbWFnZVdpZHRoPSIxOCIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNi0wMVQxMDoyNTozOC0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDYtMDFUMTA6MjU6MzgtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwOTozMzoxNi0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwOTo1MTo0My0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNi0wMVQxMDoyNTozOC0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+RuelNgAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZvyK0SgWFhaThpWRHzWxUUZCSRqjDDYz1/xQM+P13pNkq2wVJTZ+LfgL2CprpYiUrGdNbJie8+ZNjWTO7Z77ud97zunec8EVyaisUd0L2Zyph8dDvvnogq8uTy1VuKnHH1OGNjIzM0VF+3yUWLH7gF2rcty/1ricMBRU1QsPK003hSeEp9ZNzeY94VaVji0LXwh363JB4Qdbjzuctznl8LfNeiQ8Cq5mYV/qF8d/sUrrWWF5Of5sZk2V7mO/xJPIzc3K2iGzHYMw44TwMckYowTpY0h8kAD99MiOCvm9xfxpViVXidfYQGeFFGlMukVdk+oJWZOiJ2Rk2LD7/7evRnKg36nuCUHNq2W9d0LdLhR2LOvrxLIKp+B+getcOX/1GAY/RN8pa/4j8G7B5U1Zi+/D1Ta0PWsxPVaU3DJdySS8nUNTFFruoGHR6VnpnLMniGzKV93CwSF0Sbx36QfytWex+zpwggAAAAlwSFlzAAALEwAACxMBAJqcGAAAAJZJREFUOI1jYKASYITS/yk1hxFmyIoVK8gyISIiAu6i/zBDbty4QZIhGhoacMOYYIKkGoKuhwWbgtLiQji7u7cfpxgyYMIQIROMGkRHg7BGv5ePH5zt6OiIU4ygQdgUYhNDBnCvwZI7KQBZDyMDA8P/gIBAhoiIcJINYmBgYMjKymZ49+4twmsTJ04hyyBkFzEwUKE8AgBQeiatdxIg3QAAAABJRU5ErkJggg==");
    }
    .exitButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAEsWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjE4IgogICBleGlmOlBpeGVsWURpbWVuc2lvbj0iMTgiCiAgIGV4aWY6Q29sb3JTcGFjZT0iMSIKICAgdGlmZjpJbWFnZVdpZHRoPSIxOCIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMTgiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjcyLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjcyLzEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzBUMTQ6MjA6NTktMDc6MDAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDUtMzBUMTQ6MjA6NTktMDc6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMFQxNDoyMDo1OS0wNzowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+nCkcagAAAYFpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/M2MiRhTKQpqELIYYNbFRZhJKmsYovzYzb36p+fF6byZNtsp2ihIbvxb8BWyVtVJEStbWxAY9581TI5lzO/d87vfec7r3XLCH00pGrxmETDavhSb97oXFJXftM046aaOGvoiiq+PB4AxV7f0Omxlv+s1a1c/9aw2xuK6ArU54TFG1vPCU8MxaXjV5W7hVSUViwqfCHk0uKHxr6lGLn01OWvxpshYOBcDeLOxO/uLoL1ZSWkZYXk53Jl1Qfu5jvsQVz87PSewS70AnxCR+3EwzQQAfQ4zK7KMfLwOyokr+YDl/lpzkKjKrFNFYJUmKPB5RC1I9LjEhelxGmqLZ/7991RPDXqu6yw/OJ8N47YHaLfgqGcbHoWF8HYHjES6ylfzcAYy8iV6qaN370LQBZ5cVLboD55vQ/qBGtEhZcojbEwl4OYHGRWi5hvplq2c/+xzfQ3hdvuoKdvegV843rXwDWHhn38f3IFcAAAAJcEhZcwAACxMAAAsTAQCanBgAAAC8SURBVDiNrdTBDcIgFAbgH9IdZB3OmrgGxybtMMxQD9ZEB2niEM+DXaEeGggUqID+xwd8eRCAYc2C38KYQZRSVYLWepUALAYRQhQhRGQxboqlyHYNT03quxZ912aPRaEUsJcAqkEAoPmG5MLJMyqN19HxdMbjfsO2loqUMg5JKQPMnbyXYGsGK00TK7pYbkcWIiLvpuYA5olYiOgFIQ7eQG6G4eJ3NE3PYsQNB4BxvFYD8/wGsH4jwB8+tg+lWzs5jAClVwAAAABJRU5ErkJggg==");
    }
    .exitButton.active, .exitButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAFy2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMTgiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxOCIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIxOCIKICAgdGlmZjpJbWFnZVdpZHRoPSIxOCIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNi0wMVQxMDoyOTozMC0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDYtMDFUMTA6Mjk6MzAtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwOTozMzoxNi0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwOTo1MTo0My0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNi0wMVQxMDoyOTozMC0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8++Tr22gAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZvyK0SgWFhaThpWRHzWxUUZCSRqjDDYz1/xQM+P13pNkq2wVJTZ+LfgL2CprpYiUrGdNbJie8+ZNjWTO7Z77ud97zunec8EVyaisUd0L2Zyph8dDvvnogq8uTy1VuKnHH1OGNjIzM0VF+3yUWLH7gF2rcty/1ricMBRU1QsPK003hSeEp9ZNzeY94VaVji0LXwh363JB4Qdbjzuctznl8LfNeiQ8Cq5mYV/qF8d/sUrrWWF5Of5sZk2V7mO/xJPIzc3K2iGzHYMw44TwMckYowTpY0h8kAD99MiOCvm9xfxpViVXidfYQGeFFGlMukVdk+oJWZOiJ2Rk2LD7/7evRnKg36nuCUHNq2W9d0LdLhR2LOvrxLIKp+B+getcOX/1GAY/RN8pa/4j8G7B5U1Zi+/D1Ta0PWsxPVaU3DJdySS8nUNTFFruoGHR6VnpnLMniGzKV93CwSF0Sbx36QfytWex+zpwggAAAAlwSFlzAAALEwAACxMBAJqcGAAAALhJREFUOI2t1L0NgzAQBeAHYphb4+pECqniGUiDBIsgZQi3kZJdvERYgTTYGP8Qm/AapMN8PBAGOCjFfJz+dQqNSCl3CUII02jSiFIqCyEig5V6mIu415SxRX3Xou/a5HNBKAZsxYP2IABQ/UJS4eg7ys2q0el8wfv1hDuLhZnDEDN7mL14K96jaSw3VWhoY6mNDEREqy81BdBbBJj3Wl1fIcQt6c5umuaOcfwsjYbhsQuyGwEH/I++B+Q3JPhRaVIAAAAASUVORK5CYII=");
    }
    .keyboardButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAFPmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjIiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMiIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIyMiIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0zMVQxMDozMDoxMy0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMTA6MzA6MTMtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwODozNjoxMC0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQxMDozMDoxMy0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+ZKXV9AAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAONJREFUOI3FlT8KgzAUhz9DD+EhCh28QsFV8BJOdRc6FdztlDNYpK5CLyH0EHaoV7CDWOKfQm2i/S2JyXtffsT31KJVg1lZVgcNgsAIUUoJgDAJVVmb4YZt2z8Bq6rqPQsT0Klc8SFOW4uBe3dcFDct2G63fc9Hjn3fAyCOT1+PXY4qC2i6EinLuxHHUsppx3Ncq/GrOB41iHq64zgkyZkwPPRi1LUoOuL7HlmW/8Gx6+61wGpbr9N5ww/JHA1zRy9PB65KtLCHERhAml4AxbFuRQwlAPL8agxY10+grWNY4Gf6Aux0Xojq759HAAAAAElFTkSuQmCC")
    }
    .keyboardButton.active, .keyboardButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAFPmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjIiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMiIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIyMiIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iOTYvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iOTYvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0zMVQxMDozMjozNy0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMTA6MzI6MzctMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwODozNTo0MC0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQxMDozMjozNy0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+CffUegAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAANBJREFUOI3Flc0NgzAMRh+IYZiCDbhHGYAFMgcLMACipyKxAVMgNkAdgl6gNT+VSmPod0kg9uMTiR04ScE0jtrcYIZWVaVCNMYAEGpCJStaL3Rd9xMwjuPFc6gB3csNP8R56zTw4h9nWeYFa9v2Nd84ds4BkKbp1+OcIxUA43xEkiRRcWyM2Xd8xLWMv8TxpkDk1/u+pyxLrLWLGPmuaRqcc+R5/gfHRVF4gWVZX1N560ZyROvczeb5wKWmfnxTgcG70UcAdX1nGB5qcDjxznsC/OhXI+h9hhMAAAAASUVORK5CYII=")
    }
    .placeButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAEsWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMjIiCiAgIHRpZmY6SW1hZ2VXaWR0aD0iMjIiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjcyLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjcyLzEiCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIyMiIKICAgZXhpZjpQaXhlbFlEaW1lbnNpb249IjIyIgogICBleGlmOkNvbG9yU3BhY2U9IjEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMjI6MDg6NDgtMDU6MDAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDUtMzFUMjI6MDg6NDgtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQyMjowODo0OC0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+gByU7gAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZvyK0SgWFhaThpWRHzWxUUZCSRqjDDYz1/xQM+P13pNkq2wVJTZ+LfgL2CprpYiUrGdNbJie8+ZNjWTO7Z77ud97zunec8EVyaisUd0L2Zyph8dDvvnogq8uTy1VuKnHH1OGNjIzM0VF+3yUWLH7gF2rcty/1ricMBRU1QsPK003hSeEp9ZNzeY94VaVji0LXwh363JB4Qdbjzuctznl8LfNeiQ8Cq5mYV/qF8d/sUrrWWF5Of5sZk2V7mO/xJPIzc3K2iGzHYMw44TwMckYowTpY0h8kAD99MiOCvm9xfxpViVXidfYQGeFFGlMukVdk+oJWZOiJ2Rk2LD7/7evRnKg36nuCUHNq2W9d0LdLhR2LOvrxLIKp+B+getcOX/1GAY/RN8pa/4j8G7B5U1Zi+/D1Ta0PWsxPVaU3DJdySS8nUNTFFruoGHR6VnpnLMniGzKV93CwSF0Sbx36QfytWex+zpwggAAAAlwSFlzAAALEwAACxMBAJqcGAAAAKxJREFUOI3VlcENwyAMRR+oQzAiY3gMZkgPzSqROoR7aFZoD0mlhIiGUKtS/s3CPJlvyzgmvbCVcx9ojNGEmFICwFtCl6xLfhBCaAKq6ir2tVARQUSK5/ldX8j7WecDb5pX0jd/q8E55GgM/7Zi79k1tlRXvDfHzeCjOh941TxVLe6LPX/zJbSZijyhVX6CPUxgAF13BRYVD8PdDA5zxX1/MwOO4xMAN8fmn+kbxKMyrUK2UxQAAAAASUVORK5CYII=");
    }
    .placeButton.active, .placeButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACmSURBVEhL3ZXtCYAgEIYzGsYVggZxAodygmuPoBXcprjrLtLo+/zTA/ZK0YPUi1alMJwTpxYGxSQFAIzPOOcoa7xoSRFx0Yq34hgjz55hreXZsmpasXAm9d7TOCJ/NxFr8mNxCIHGXRrOhPwn5cKr50ixT5H0+G2HBenyrsdnXPU458d1e0qxTWgn1mBtBUBPNzSQjX49Qdq2w/jMOA6UKEaUz7zKzGMSPYSsKtaQAAAAAElFTkSuQmCC");
    }
    .breakButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADVSURBVEhLvZXRDYMgEIa5TsFYdgvHYAxmsA91m8YNIE1dgfa/SqOIFpD2e/Dw4n380QTJOSeIyImKvJxEqLhp2xblMFprridcakmBd3HiuVhKOa2+o5SaVstwSM2JPaVSEM4uxKmE0hjZ4pg01ssSp0pBVIyHw4EcKdhN7AdzpWAzsadECqp8vBib4tKknv+JMTwXhLJU+e479pJwsxQWYmPMtIqzt0E4uzrdavA53Yyx3KhB1124cuKmOQtr79w4yjDcxDg+3on7/srNGkAKfvQzdfQETtBmHYKdHW8AAAAASUVORK5CYIJFTkSuQmCCnd8aY0jyr65+cLRujrL+fJOPAaJMN46HP07L/I9c3n9ESitLhsbMMowoH/3cozJTep8My+2KiwA8gRAju39mJaqaAEeXWxfxIbJZCwbFGkMgYDWx692ANTNbFaEbegDqusY5t5Rc2yvHCLx/nlERinw1OT3GyxoDMRmWr+w0pjpOimoCGftl0CmX/eBQEYzowsBjm873/ZmqqubYiCxTv1kLyNz4Mbw+htmcKGzvMo6fcVI1mdK2LSFAvrJzL2Pgv1Pq7TgxaWEkpuHSkvyi4nw+471Py+E6UwnUYUTZrJOTY7CNKLkJ+BhQETbrq7WVZdR1fZvDfnBzHi9OXme0yIvbVXOZ5bZtbwHHOR5dve4ZQNd3vP+I028AJKKaoDKA7XbL4+Pj999t46qqcM5N6+54PHJ/f0/XdYQQZsCu6zgcDpNTY9CtTSY55xabelwmRVHw+vq6eKj87ZfU/8fHSrLxG7/VAAAAAElFTkSuQmCC");
    }
    .breakButton.active, .breakButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADZSURBVEhLtZXRDYMgEIa9TsMKJh3ECXywGzkBXYM0cQW3of2vYBEPC4rfg/9Jcp8XTICstc0VsJiIqto/TiIkXrTWiNN0Xcd5w6OWFHgXTxyK53l21X/6vndV0xhjXPWdmif2HJWCuHclziWWShSLJek4jq76USTOlQJRDEEsKZGC3Ym9rFQKRHHYdEQKin9ejhQkxZIgVwqSYmkLpLUUGzGaQ0E8Za58d4+9FFmyDWAlVkq5SmbvA3Hv5nSrwXK6af3khRoMw4NzuUHa9o44zTS9OC+68yy9Abg0YUFOFw2OAAAAAElFTkSuQmCCQmCCnd8aY0jyr65+cLRujrL+fJOPAaJMN46HP07L/I9c3n9ESitLhsbMMowoH/3cozJTep8My+2KiwA8gRAju39mJaqaAEeXWxfxIbJZCwbFGkMgYDWx692ANTNbFaEbegDqusY5t5Rc2yvHCLx/nlERinw1OT3GyxoDMRmWr+w0pjpOimoCGftl0CmX/eBQEYzowsBjm873/ZmqqubYiCxTv1kLyNz4Mbw+htmcKGzvMo6fcVI1mdK2LSFAvrJzL2Pgv1Pq7TgxaWEkpuHSkvyi4nw+471Py+E6UwnUYUTZrJOTY7CNKLkJ+BhQETbrq7WVZdR1fZvDfnBzHi9OXme0yIvbVXOZ5bZtbwHHOR5dve4ZQNd3vP+I028AJKKaoDKA7XbL4+Pj999t46qqcM5N6+54PHJ/f0/XdYQQZsCu6zgcDpNTY9CtTSY55xabelwmRVHw+vq6eKj87ZfU/8fHSrLxG7/VAAAAAElFTkSuQmCC");
    }
    .selectButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAEqGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjIyIgogICBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjIiCiAgIGV4aWY6Q29sb3JTcGFjZT0iMSIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMjIiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjcyLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjcyLzEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzBUMTQ6MTQtMDc6MDAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDUtMzBUMTQ6MTQtMDc6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMFQxNDoxNC0wNzowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+ndR9ZQAAAYFpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/M2MiRhTKQpqELIYYNbFRZhJKmsYovzYzb36p+fF6byZNtsp2ihIbvxb8BWyVtVJEStbWxAY9581TI5lzO/d87vfec7r3XLCH00pGrxmETDavhSb97oXFJXftM046aaOGvoiiq+PB4AxV7f0Omxlv+s1a1c/9aw2xuK6ArU54TFG1vPCU8MxaXjV5W7hVSUViwqfCHk0uKHxr6lGLn01OWvxpshYOBcDeLOxO/uLoL1ZSWkZYXk53Jl1Qfu5jvsQVz87PSewS70AnxCR+3EwzQQAfQ4zK7KMfLwOyokr+YDl/lpzkKjKrFNFYJUmKPB5RC1I9LjEhelxGmqLZ/7991RPDXqu6yw/OJ8N47YHaLfgqGcbHoWF8HYHjES6ylfzcAYy8iV6qaN370LQBZ5cVLboD55vQ/qBGtEhZcojbEwl4OYHGRWi5hvplq2c/+xzfQ3hdvuoKdvegV843rXwDWHhn38f3IFcAAAAJcEhZcwAACxMAAAsTAQCanBgAAADASURBVDiNrdXdDYMgEAfwP6RDMCJjOAYz2Ie6ikmHwIe6Qvugl+DxUTzuEhMR+XkBPAyO+EI3jCHUe68ihhAAAFYTTa0H73DOdQHTNF3uY4yXfitF6aI2H2sL45oYf1aLbphjLfQW3IJKfcNTUftgF1wDhuaYr/4/kCLbx72oePGkmTbhUbQI819VghZhgkbQDKZCIkF5Ecp2RVpC+ct3wh7AJgZ4zPMTQJLxur7VcODMeFleauC+fwAA5myrH6Y/P01lF42FgH8AAAAASUVORK5CYII=");
    }
    .selectButton.active, .selectButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAEsWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMjIiCiAgIHRpZmY6SW1hZ2VXaWR0aD0iMjIiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249Ijk2LzEiCiAgIHRpZmY6WVJlc29sdXRpb249Ijk2LzEiCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIyMiIKICAgZXhpZjpQaXhlbFlEaW1lbnNpb249IjIyIgogICBleGlmOkNvbG9yU3BhY2U9IjEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMDk6MzU6MzktMDU6MDAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDUtMzFUMDk6MzU6MzktMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQwOTozNTozOS0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+c0BT1gAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAMtJREFUOI211dENgyAQBuBf0mFYwaSDOAEPdqObgK5BmriC29iHeoSegIB4L4rIl/MkB3BTDPt16+0OjFpru4jTNAEAVE80tB5yYl3XIsAY4++JCFrrv3nVihIRiMiP5VoVW5jCwixl1jKKYYnl0CqYP7t0rqoUEgjr3ATHUH6eilM4RBnKlYXjsI9L0TM8mXFrpln4KhqFwx/SikZhhq6gB5gbSQsqm9BhVzjnki/XxN6P382AjHl+AfgdTRsAjOOzC7wsHw8DN5x5X3p5YEMtOwViAAAAAElFTkSuQmCC");
    }
    .scrollUpButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAFPmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjIiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMiIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIyMiIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0zMVQwOTo0MTozNS0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMDk6NDE6MzUtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwODozNjoxMC0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQwOTo0MTozNS0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+qh8mWAAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAL1JREFUOI21lcsNwyAQRB8oRVCiL3Ex+EINziFuxVKKIIe4heRgW8IY/GMztxWzj2GRQDHqi6yUmqFVVYkQnXMAaEloyLrFC8aYS0Dv/aLWEtBUr874krK2wdrmkPcUONzgL+Aj8NXlHWkKfXV9T65dTrwXohicUzE4N4rkjHPm+Ng5HxQk3oJeBu9BITOKEuCsReL4ITmjuHeVuAQeSo+wtwgMoG0fQJC4719icJgSd91TDDgMHwDUVIt/pj9lYzcah66GagAAAABJRU5ErkJggg==");
    }
    .scrollUpButton.active, .scrollUpButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAFPmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjIiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMiIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIyMiIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iOTYvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iOTYvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0zMVQwOTo0Mjo1MS0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMDk6NDI6NTEtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwODozNTo0MC0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQwOTo0Mjo1MS0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+nGTdYQAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAK9JREFUOI21ldERhCAMRFeGYiiJClIUFXBfZzm04FwR+qMjIjmRhP1xmGyea5wJwCBN+3PV5k4HNMaoQvTeAwCMJjRn2bKQUuoCOucuZ6MBrfUaxlcVEYGImryvwPkLhoBb4Lef19KU+0II1Vp34qcQYjAnMZgbRXXGnLn8bM4HCBL/g3aDn6AAMwoJ8NAlcblI3qjsvSWWwHPt+/ijAgPORW8BYJ6/WJafGhwYeOdt2u4xmobYNrAAAAAASUVORK5CYII=");
    }
    .scrollDownButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAFPmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjIiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMiIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIyMiIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0zMVQwOTozOTo0Ny0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMDk6Mzk6NDctMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwODozNjoxMC0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQwOTozOTo0Ny0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+cF/fZAAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAALEwAACxMBAJqcGAAAALFJREFUOI21lcENwyAMRR+oQzAiYzAGM6SHZpVIHSI9NCu0h6QSUKAlmH8z4OcvY4Fi1wtZKfWBWmtFiN57ALQkNGRd0g1jzCnguq5RrCWguVxdOBfJOYdzrqnQT3Ar8C/wWShkLq8GLRXKrWcd9zitgiU0zHG1x2mBloLDpmLYHBdb0QuPHKcPSYvS3C/HPfBQeoc9RGAA03QFAsfLcheDw+F4nm9iwG17AqCOWPwzfQNXBzbjhlGh5wAAAABJRU5ErkJggg==");
    }
    .scrollDownButton.active, .scrollDownButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAFPmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjIiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMiIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIyMiIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iOTYvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iOTYvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0zMVQwOTo0MDozNS0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMDk6NDA6MzUtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwODozNTo0MC0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQwOTo0MDozNS0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8++KGu/QAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAALBJREFUOI21ldENwyAMRC8owzASE3goT0C/mnFYIeoQ7U+qBjCkBud+EAGeL4dkgJu0HOPbmrt8oTFGE2IIAQDgLKFn1loupJSGgN77bO4soNJZ19iXiYhARKpCl2At8C/wKBQQLq8HbRVi5uqb6HjGaRdsIREs/ZpWzYyZuYpEU7AbxYzzy4xH4c0oZuGZ47KRaFSerRzPwM86+vHDBAb8Gv0KANv2xL6/zODAjW/eB0CEMZpx89CdAAAAAElFTkSuQmCC");
    }
    .throwButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAFPmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjIiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMiIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIyMiIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0zMVQxMDoxODowNi0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMTA6MTg6MDYtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwODozNjoxMC0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQxMDoxODowNi0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+WtcK9wAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAQ1JREFUOI2tlcERwiAQRX8yFpEuQgXbhdaQixazXFKDHrQGKoAZi8CDtqAHJZNsANHh38Luvv1ZSGjw1hN11TQBOgxDFeI4jgCAtiZ0ztrIQNd10QJmjcNhv1iz1kGpHgDgvV/E2n+hzHqCxmoX4JRiULkmlQUzazDrbCNr3e9gACCiZAM5jrlWmzcvCs6U6mGtm+BhPTeOJFhKqX5yJxvEFB0FswYRJYtysSw4OEzJGPP7qfjmNnUKvoKDo5RK3AKRzQtFYYOIKDuWYnCsgTEGRFTsdgX23q++efkGKcmf0MqxTAja7bbZuFT7Tr4VJZfoeDwBmDl27loNDnwcXy7nasDH4w4AaD7P1S/TF7dhcsyyU4psAAAAAElFTkSuQmCC");
    }
    .throwButton.active, .throwButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAFPmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjIiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMiIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIyMiIKICAgdGlmZjpJbWFnZVdpZHRoPSIyMiIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iOTYvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iOTYvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0zMVQxMDoxOTo0OS0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMTA6MTk6NDktMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwODozNTo0MC0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQxMDoxOTo0OS0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+7MGLFgAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAO9JREFUOI21lb0NhDAMhR+IYdJ7GSbwUEzAVccM9O5ZAd0Qdw1GwfnlFF6DlODPL3YwwEPqjue3NbdT6DzPTYjjOAIA+pZQnzXYjW3bogHMjGmaLmtEBBEBADjnLnv9v1BmPqGx2As4pRjUrlllwcwMZs4mIqL7YAAQkWQCWw5fQfP8IHUmIiCiE67ruXIkwTHn6s4miClaitwRNUlJyRrngono/q0ouU3dgiK4FFzjFog0T4O0QX7T7ih5K/wEOhNq3QZg51zwzdsTpGSHUODYvqBa1zW7b3XM41fVyzXSQT8AwLK8se+fZnDgwX/eDxNAdxmhDNuAAAAAAElFTkSuQmCC");
    }
    .sprintButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADOSURBVEhLvZXtDYMgEIa5pkMwlt3CMRyDGeyPuk3jBhBTV6C9E1r50KicfX54xyU8eYNBwVorAMAKRj5OAKy4qOsaSzFKKaoXfHBJEe+ixHOxlNJ1+9Bau25KTYk9R6VIvDcQc3J1NaFpGtf9+txsiU2Jc5LD4ngjrnOzJVYTl8hPe3n/T1wiRTYdRU6wJkWCK11y8xB/rZMrzUkgnn9I9hLvTb5uHHyPQmtDAw7a9k6VElfVTRgz0KCUvn+KcXxNibvuQUMOUIqc9DO18AZc1WQdjvTPDgAAAABJRU5ErkJggq5CYIIY9LrovOfskvxtnd8aY0jyr65+cLRujrL+fJOPAaJMN46HP07L/I9c3n9ESitLhsbMMowoH/3cozJTep8My+2KiwA8gRAju39mJaqaAEeXWxfxIbJZCwbFGkMgYDWx692ANTNbFaEbegDqusY5t5Rc2yvHCLx/nlERinw1OT3GyxoDMRmWr+w0pjpOimoCGftl0CmX/eBQEYzowsBjm873/ZmqqubYiCxTv1kLyNz4Mbw+htmcKGzvMo6fcVI1mdK2LSFAvrJzL2Pgv1Pq7TgxaWEkpuHSkvyi4nw+471Py+E6UwnUYUTZrJOTY7CNKLkJ+BhQETbrq7WVZdR1fZvDfnBzHi9OXme0yIvbVXOZ5bZtbwHHOR5dve4ZQNd3vP+I028AJKKaoDKA7XbL4+Pj999t46qqcM5N6+54PHJ/f0/XdYQQZsCu6zgcDpNTY9CtTSY55xabelwmRVHw+vq6eKj87ZfU/8fHSrLxG7/VAAAAAElFTkSuQmCC");
    }
    .sprintButton.active, .sprintButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADOSURBVEhLtZXbDcMgDEVx1WFYIVIHyQR8pBsxAd2jUlZgG1q7EPEwKClwPmJiKUdXRAZwzokZkBgAhtq/TgCs+GKMwdLNuq5Ub/gYJUWCixLHYmutX11DSulXv9SUOPCvFMm/TcQjuftaoJTyKyG01lS5Xo1TiWNhgOvFVMV5IhRxvRrNxD3yaT+vKc7TYFqux1EV90iRU1vBCVpSJBnpnslDwlgXIz2SRBwfJFfJvy1OtxEcW2HMixoj2LYn1eMGWZYHlm72/U110p3n4APUi1xBJ/2pfQAAAABJRU5ErkJggmCCAAAAAElFTkSuQmCCnd8aY0jyr65+cLRujrL+fJOPAaJMN46HP07L/I9c3n9ESitLhsbMMowoH/3cozJTep8My+2KiwA8gRAju39mJaqaAEeXWxfxIbJZCwbFGkMgYDWx692ANTNbFaEbegDqusY5t5Rc2yvHCLx/nlERinw1OT3GyxoDMRmWr+w0pjpOimoCGftl0CmX/eBQEYzowsBjm873/ZmqqubYiCxTv1kLyNz4Mbw+htmcKGzvMo6fcVI1mdK2LSFAvrJzL2Pgv1Pq7TgxaWEkpuHSkvyi4nw+471Py+E6UwnUYUTZrJOTY7CNKLkJ+BhQETbrq7WVZdR1fZvDfnBzHi9OXme0yIvbVXOZ5bZtbwHHOR5dve4ZQNd3vP+I028AJKKaoDKA7XbL4+Pj999t46qqcM5N6+54PHJ/f0/XdYQQZsCu6zgcDpNTY9CtTSY55xabelwmRVHw+vq6eKj87ZfU/8fHSrLxG7/VAAAAAElFTkSuQmCC");
    }
    .perspectiveButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAEsWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjE4IgogICBleGlmOlBpeGVsWURpbWVuc2lvbj0iMTgiCiAgIGV4aWY6Q29sb3JTcGFjZT0iMSIKICAgdGlmZjpJbWFnZVdpZHRoPSIxOCIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMTgiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjcyLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjcyLzEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDUtMzFUMTU6NTg6NDUtMDU6MDAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDUtMzFUMTU6NTg6NDUtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0zMVQxNTo1ODo0NS0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+GlXzLwAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZogwjWJhoUzCamhQk9koIw0laYwy2Mw882bU/Hi99yTZKltFiY1fC/4CtspaKSIl61kTG6bnvHlqJHNu557P/d57TveeC65YVskZtQHI5U09Ggn75uMLvvoidXTioYtQQjG00ZmZKaraxwM1drzrs2tVP/evNS2nDAVqGoRHFE03hSeEp9ZMzeZd4TYlk1gWPhf263JB4XtbTzpctDnt8JfNeiw6Bq4WYV/6Fyd/sZLRc8Lycrpz2VXl5z72S5pT+blZiV3iHRhEiRDGxyTjjBFkgJDMQfoYpF9WVMkPlPOnKUiuIrPGOjorpMlg4hd1VaqnJKqip2RkWbf7/7evhjo06FRvDkPdi2W99UD9DpS2Levz2LJKJ+B+hqt8Jb9wBMPvom9XtO5D8G7CxXVFS+7B5Ra0P2kJPVGW3OIuVYXXM/DEofUWGhednv3sc/oIsQ35qhvYP4BeOe9d+gawQmgHbIPcOQAAAAlwSFlzAAALEwAACxMBAJqcGAAAASBJREFUOI2tlLFxhDAQRR/MpcQWFdCAcqkBCqADutDQBTWcA18JKCe5GSdUgBzctXAOGGkQAo/v7B9pV7tv/koaZSx68DdlmYe0bfsSoe/7hQQ8PEQI8RTEORdgJ5/cgxhjorjruigWQgTYiR15wLbxKA+Q70GGYQjFSimUUgEwDEPiNHHkIdZaAJqmoSgKyrIEwFob9owxkbP8CAJQFAUA8zxTVVXIW2sTZwEkpURrHcYAmKZpd62UQmuNlDIdra5rpJSM45iM4eMtpK7r/Vtbw7TWdF0XwfwoHrJWcv0eBgR36/F9zVa778gXrs/gCJCAnHPJ6/6p0fdEIOe+EOIt2vitzuf32NH1+vk0ZK0c4HL5eBlwv9+A5RuBf/jYvgH4yIZeQnyS2QAAAABJRU5ErkJggg==");
    }
    .perspectiveButton.active, .perspectiveButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAFy2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMTgiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxOCIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIxOCIKICAgdGlmZjpJbWFnZVdpZHRoPSIxOCIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNi0wMVQxMDozNDo0MC0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDYtMDFUMTA6MzQ6NDAtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwOTozMzoxNi0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwOTo1MTo0My0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNi0wMVQxMDozNDo0MC0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+JwuWpAAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZvyK0SgWFhaThpWRHzWxUUZCSRqjDDYz1/xQM+P13pNkq2wVJTZ+LfgL2CprpYiUrGdNbJie8+ZNjWTO7Z77ud97zunec8EVyaisUd0L2Zyph8dDvvnogq8uTy1VuKnHH1OGNjIzM0VF+3yUWLH7gF2rcty/1ricMBRU1QsPK003hSeEp9ZNzeY94VaVji0LXwh363JB4Qdbjzuctznl8LfNeiQ8Cq5mYV/qF8d/sUrrWWF5Of5sZk2V7mO/xJPIzc3K2iGzHYMw44TwMckYowTpY0h8kAD99MiOCvm9xfxpViVXidfYQGeFFGlMukVdk+oJWZOiJ2Rk2LD7/7evRnKg36nuCUHNq2W9d0LdLhR2LOvrxLIKp+B+getcOX/1GAY/RN8pa/4j8G7B5U1Zi+/D1Ta0PWsxPVaU3DJdySS8nUNTFFruoGHR6VnpnLMniGzKV93CwSF0Sbx36QfytWex+zpwggAAAAlwSFlzAAALEwAACxMBAJqcGAAAARdJREFUOI2tlMFthDAQRR+rvVIAFeACfLcbQNqcAi1sirBcwkopgjLsOwVABZyyLZBL7AA2K2Wz/wIzzDz9b1nAi1T8PJf/cooA6fv+KULbttHREiDjOP4JIoSIsHNo5iDGmE1trd3U4zhG2JmMAmC/eNQHOOUgzrk4rJRCKRUBzrnEaeIoQLz3AHRdR1mWVFUFgPc+fjPGbJydjiAAZVkCMM8zdV3Hvvc+cRZBUkq01jEGwDRN2XelFFprpJRptKZpkFIyDEMSI9R7SNM0+TNaw7TWWGs3sBBlD0lAaxgQ3a3jh5m9svcoDK7P4AiQgIQQye1+tBh2ggpguVzeaNv3h0tHul4/uN+/fh3dbp9PgdaO4AX/o28EZ31RG7EATQAAAABJRU5ErkJggg==");
    }
    .screenshotButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAFPmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMTgiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxOCIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIxOCIKICAgdGlmZjpJbWFnZVdpZHRoPSIxOCIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNi0wMVQxOToxNDo0MS0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDYtMDFUMTk6MTQ6NDEtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQxNTo1ODo0NS0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNi0wMVQxOToxNDo0MS0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+gsym2gAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZvyK0SgWFhaThpWRHzWxUUZCSRqjDDYz1/xQM+P13pNkq2wVJTZ+LfgL2CprpYiUrGdNbJie8+ZNjWTO7Z77ud97zunec8EVyaisUd0L2Zyph8dDvvnogq8uTy1VuKnHH1OGNjIzM0VF+3yUWLH7gF2rcty/1ricMBRU1QsPK003hSeEp9ZNzeY94VaVji0LXwh363JB4Qdbjzuctznl8LfNeiQ8Cq5mYV/qF8d/sUrrWWF5Of5sZk2V7mO/xJPIzc3K2iGzHYMw44TwMckYowTpY0h8kAD99MiOCvm9xfxpViVXidfYQGeFFGlMukVdk+oJWZOiJ2Rk2LD7/7evRnKg36nuCUHNq2W9d0LdLhR2LOvrxLIKp+B+getcOX/1GAY/RN8pa/4j8G7B5U1Zi+/D1Ta0PWsxPVaU3DJdySS8nUNTFFruoGHR6VnpnLMniGzKV93CwSF0Sbx36QfytWex+zpwggAAAAlwSFlzAAALEwAACxMBAJqcGAAAANlJREFUOI2t1EEKgzAQBdCveIfOdbIV8RxuRTyFiFvPYBeVUnoPoYeYLuoVdCGRJEab2P6dZuZlDJIASyb8liCQSJZlp4S2bRcJwCQRIvJCmHnFIvlSRcoiR1U3KItca6zqRnsmohWLYEQ2S8y2ZkMjs9As2JvIrA13u5QG8xNtOYTkrrbz8oJ8sjlsNeokR2f3FXIBrFCcpHg+7k6NcZJCCGGHhBCIk9QJUhENYmYQ0abgKPKvXiHmN4gu2oJruu6qTzQML29ETQgAfX87DYzjB8ByjQB/uNhm16JRDHvEtZMAAAAASUVORK5CYII=");
    }
    .screenshotButton.active, .screenshotButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAFy2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMTgiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxOCIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIxOCIKICAgdGlmZjpJbWFnZVdpZHRoPSIxOCIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNi0wMVQxOToxNTowNS0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDYtMDFUMTk6MTU6MDUtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwOTozMzoxNi0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwOTo1MTo0My0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNi0wMVQxOToxNTowNS0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+ViGmhwAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZvyK0SgWFhaThpWRHzWxUUZCSRqjDDYz1/xQM+P13pNkq2wVJTZ+LfgL2CprpYiUrGdNbJie8+ZNjWTO7Z77ud97zunec8EVyaisUd0L2Zyph8dDvvnogq8uTy1VuKnHH1OGNjIzM0VF+3yUWLH7gF2rcty/1ricMBRU1QsPK003hSeEp9ZNzeY94VaVji0LXwh363JB4Qdbjzuctznl8LfNeiQ8Cq5mYV/qF8d/sUrrWWF5Of5sZk2V7mO/xJPIzc3K2iGzHYMw44TwMckYowTpY0h8kAD99MiOCvm9xfxpViVXidfYQGeFFGlMukVdk+oJWZOiJ2Rk2LD7/7evRnKg36nuCUHNq2W9d0LdLhR2LOvrxLIKp+B+getcOX/1GAY/RN8pa/4j8G7B5U1Zi+/D1Ta0PWsxPVaU3DJdySS8nUNTFFruoGHR6VnpnLMniGzKV93CwSF0Sbx36QfytWex+zpwggAAAAlwSFlzAAALEwAACxMBAJqcGAAAANNJREFUOI2t1EEOQ0AUBuBf4zBzjdmKiK46Z9CViFOIiKSHsG6anuVdoq6gG0+fMXRo/43gvW+eCYA/JRiPw69OwEjXdYcEY8w00cAIEe1ClFITFvJFiZRFjqpuUBb5rLGqm9k5EU1YCCvczJjrngsN7UK7YG0iu/a02iUa7Ed0ZRPiVV37tQvak8Vmy8hJtvbuK+QDOKEoTvB83L0aoziB1toNaa0RxYkXJJEZpJQCES0KtsJvNTB+a2l6hjEXb0Amy67o+9dnora9HYLkRMAf/kdvmR9KtwpEL4QAAAAASUVORK5CYII=");
    }
    .coordinatesButton {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAFPmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMTgiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxOCIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIxOCIKICAgdGlmZjpJbWFnZVdpZHRoPSIxOCIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNi0wMVQxOTo0NjoxMS0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDYtMDFUMTk6NDY6MTEtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQxNTo1ODo0NS0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNi0wMVQxOTo0NjoxMS0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+7f9PrQAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZvyK0SgWFhaThpWRHzWxUUZCSRqjDDYz1/xQM+P13pNkq2wVJTZ+LfgL2CprpYiUrGdNbJie8+ZNjWTO7Z77ud97zunec8EVyaisUd0L2Zyph8dDvvnogq8uTy1VuKnHH1OGNjIzM0VF+3yUWLH7gF2rcty/1ricMBRU1QsPK003hSeEp9ZNzeY94VaVji0LXwh363JB4Qdbjzuctznl8LfNeiQ8Cq5mYV/qF8d/sUrrWWF5Of5sZk2V7mO/xJPIzc3K2iGzHYMw44TwMckYowTpY0h8kAD99MiOCvm9xfxpViVXidfYQGeFFGlMukVdk+oJWZOiJ2Rk2LD7/7evRnKg36nuCUHNq2W9d0LdLhR2LOvrxLIKp+B+getcOX/1GAY/RN8pa/4j8G7B5U1Zi+/D1Ta0PWsxPVaU3DJdySS8nUNTFFruoGHR6VnpnLMniGzKV93CwSF0Sbx36QfytWex+zpwggAAAAlwSFlzAAALEwAACxMBAJqcGAAAANVJREFUOI2t1MENgjAUxvE/hB3sOlyNcQFj4pGrMc4CIyAeJDHGIyu0iUPgQRgBD6QICoWq3/G1/eW9pqlDnYrf4jgaCYLgKyGKoloCKo0IIayQPM8bzNVFW+T9jGvY15v9bkuWZR91zwYAmC+W+L5vD2kA4Hy5Du4zjial6iBhGPZ2MwoBrNYbYyc6g6O1u4njA2VZDHZjhHTKsgAwIoOQlGoyYITGxuhLc9n6udt00T7j1YU7Qsw6C1OTJMcXBKDUzRppxwVI09PXQFE8gPobgT98bE9BU0xrk+bdqAAAAABJRU5ErkJggg==");
    }
    .coordinatesButton.active, .coordinatesButton:active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAFy2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMTgiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxOCIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB0aWZmOkltYWdlTGVuZ3RoPSIxOCIKICAgdGlmZjpJbWFnZVdpZHRoPSIxOCIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIvMSIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNi0wMVQxOTo0Njo0NS0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDYtMDFUMTk6NDY6NDUtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwOTozMzoxNi0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgeG1wTU06YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgeG1wTU06c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgeG1wTU06d2hlbj0iMjAyNC0wNS0zMVQwOTo1MTo0My0wNTowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjUuMSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNi0wMVQxOTo0Njo0NS0wNTowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+3ivAWwAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/ZvyK0SgWFhaThpWRHzWxUUZCSRqjDDYz1/xQM+P13pNkq2wVJTZ+LfgL2CprpYiUrGdNbJie8+ZNjWTO7Z77ud97zunec8EVyaisUd0L2Zyph8dDvvnogq8uTy1VuKnHH1OGNjIzM0VF+3yUWLH7gF2rcty/1ricMBRU1QsPK003hSeEp9ZNzeY94VaVji0LXwh363JB4Qdbjzuctznl8LfNeiQ8Cq5mYV/qF8d/sUrrWWF5Of5sZk2V7mO/xJPIzc3K2iGzHYMw44TwMckYowTpY0h8kAD99MiOCvm9xfxpViVXidfYQGeFFGlMukVdk+oJWZOiJ2Rk2LD7/7evRnKg36nuCUHNq2W9d0LdLhR2LOvrxLIKp+B+getcOX/1GAY/RN8pa/4j8G7B5U1Zi+/D1Ta0PWsxPVaU3DJdySS8nUNTFFruoGHR6VnpnLMniGzKV93CwSF0Sbx36QfytWex+zpwggAAAAlwSFlzAAALEwAACxMBAJqcGAAAAM9JREFUOI2t1DEKwjAYhuG34mF6ja4iUicDIjjXScSDFIReIc4ijr1Cu/USJkeoi6lVm9TUfksgJA/fX0pgpATPtf7XCQwipRwkCCGaRrVBqqryQsIwbLCJ2fRFPu9MHOc6czzsyfP8a3/qAwDM5guiKPKHDABwud6s55yjFUX5hmRZ1tmmFwJYb7bOJibW0dptpDyjtbK2cUImWisAJ2KFiqL8GXBCfWN0pfnY5nf3adG+EwB1HC8RYuXVwCRJdih1f42WpqdBULsRjPAePQBKokYW6r1DQwAAAABJRU5ErkJggg==");
    }
    `;
document.documentElement.appendChild(customStyle);