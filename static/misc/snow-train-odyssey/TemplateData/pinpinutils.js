
const gameStartedCallbacks = [];
const gameEndedCallbacks = [];

const getDataOverride = [];
const setDataOverride = [];
const removeDataOverride = [];

// START YAHOO SDK & GMO Hooks
function wkbGameStart(deviceType, callbackStart, callbackShowAd, callbackSendScore, callbackError, callbackStartLog) {
    gameEndedCallbacks.push((s) => {
        callbackSendScore({score: s});
    });
    gameStartedCallbacks.push(callbackStartLog);

    //If method window.wkbGetUserData exists, add it to getDataOverride, as well as window.wkbSetUserData and window.wkbRemoveUserData
    if (typeof window.wkbGetUserData === "function") {
        getDataOverride.push((key) => {
            return window.wkbGetUserData(key);
        });
    }
    if (typeof window.wkbSetUserData === "function") {
        setDataOverride.push((key, value) => {
            window.wkbSetUserData(key, value);
        });
    }
    if (typeof window.wkbRemoveUserData === "function") {
        removeDataOverride.push((key) => {
            window.wkbRemoveUserData(key);
        });
    }
}
// END YAHOO/GMO Hooks

// CUSTOM EVENTS
function onGameStarted() {
    gameStartedCallbacks.forEach(callback => {
        callback();
    });
}

function onGameEnded(score) {
    gameEndedCallbacks.forEach(callback => {
        callback(score);
    });
}
// END EVENTS

// CUSTOM SAVE
let GameData = {};

if (localStorage.getItem("GameData")) {
    GameData = JSON.parse(localStorage.getItem("GameData"));
}

function isBrowserStorageAvailable() {
    //return getDataOverride.length > 0 || setDataOverride.length > 0 || removeDataOverride.length > 0;
    return true;
}

function saveData(key, value) {
    if (setDataOverride.length > 0) {
        setDataOverride[0](key, value);
        return;
    }
    GameData[key] = value;
    localStorage.setItem("GameData", JSON.stringify(GameData));
}

function getData(key) {
    if (getDataOverride.length > 0) {
        return getDataOverride[0](key);
    }
    if (key in GameData) {
        return GameData[key];
    }
    return null;
}

function removeData(key) {
    if (removeDataOverride.length > 0) {
        removeDataOverride[0](key);
        return;
    }
    delete GameData[key];
    localStorage.setItem("GameData", JSON.stringify(GameData));
}
// END SAVE
