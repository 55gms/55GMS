export {
    pushGhostPosition,
    saveGhostData,
    getGhostDataCopy,
    startGhostPlayback,
    interpolateGhostPosition,
    clearGhostData,
    getGhostDataJSON,
    loadGhostData
}

import Utils from "./utils.js";
import Vec3 from "./fedVector3.js";

const ghostData = []

function clearGhostData() {
    ghostData.length = 0;
}

function pushGhostPosition(inst, time) {
    const objectToPush = {};
    objectToPush.position = [Math.round(inst.x), Math.round(inst.y), Math.round(inst.totalZElevation)]
    objectToPush.time = time;
    ghostData.push(objectToPush)
}

function saveGhostData(inst) {
    inst.setJsonDataCopy(ghostData)
}

function getGhostDataJSON() {
    return JSON.stringify(ghostData);
}

function loadGhostData(ghostDataJson) {
    let newGhostData = JSON.parse(ghostDataJson);
    clearGhostData()
    ghostData.push(...newGhostData);
}

function getGhostDataCopy() {
    return JSON.parse(JSON.stringify(ghostData));
}
let playbackData = [];
let curIndex = 0;

function startGhostPlayback(o) {
    playbackData.length = 0;
    playbackData = o;
    curIndex = 0;
}

function interpolateGhostPosition(ghost, time) {

    if ((curIndex + 2) > playbackData.length) return;

    let unlerpedTime = Utils.unlerp(playbackData[curIndex].time, playbackData[curIndex + 1].time, time);

    Vec3.lerp(Vec3.fromArray(playbackData[curIndex].position), Vec3.fromArray(playbackData[curIndex + 1].position), unlerpedTime).toInst(ghost);

    if (unlerpedTime >= 1) curIndex++;
}
