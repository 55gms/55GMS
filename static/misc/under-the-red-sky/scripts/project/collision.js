import Utils from "./utils.js";
import Vec3 from "./fedVector3.js";
import Vec2 from "./fedVector2.js";


function getZDataFromShape(inst, x, y) {

    let height = 0;
    let slopeRadians = 0;
    let slideAngle = 0;
    switch (inst.shape) {

        case "box":
            height = inst.totalZElevation + inst.zHeight;
            break;

        case "wedge":
            height = inst.totalZElevation + inst.zHeight * (Utils.unrotate(-inst.angle, inst.x, inst.y, x, y) + inst.width * 0.5) / inst.width;
            slopeRadians = Math.atan(inst.zHeight / inst.width);
            slideAngle = inst.angleDegrees - 180 * Math.sign(inst.width);
            break;

        case "prism":
            let f = (Utils.unrotate(-inst.angle + Utils.halfPI, inst.x, inst.y, x, y) + inst.height * 0.5) / inst.height;
            let angle = inst.angleDegrees + 90;
            if (f > 0.5) {
                f = 1 - f;
                angle += 180
            };
            height = inst.totalZElevation + inst.zHeight * f * 2;
            slideAngle = angle;
            slopeRadians = Math.atan(inst.zHeight / (inst.height * 0.5));
            break;

        case "pyramid":
            const unrotY = Utils.unrotate(-inst.angle + Utils.halfPI, inst.x, inst.y, x, y);
            const pyYF = (unrotY + inst.height * 0.5) / inst.height;
            const pyYFn = 1 - Math.abs(1 - 2 * (pyYF % 1))
            const unrotX = Utils.unrotate(-inst.angle, inst.x, inst.y, x, y);
            const pyXF = (unrotX + inst.width * 0.5) / inst.width;
            const pyXFn = 1 - Math.abs(1 - 2 * (pyXF % 1))
            if (pyXFn < pyYFn) {
                height = inst.totalZElevation + inst.zHeight * pyXFn;
                slideAngle = pyXF > 0.5 ? inst.angleDegrees : inst.angleDegrees + 180;
                slopeRadians = Math.atan(inst.zHeight / (inst.width * 0.5));
            }
            else {
                height = inst.totalZElevation + inst.zHeight * pyYFn;
                slideAngle = pyYF > 0.5 ? inst.angleDegrees - 90 : inst.angleDegrees + 90;
                slopeRadians = Math.atan(inst.zHeight / (inst.height * 0.5));
            }
            break;

        case "corner-in":
            const unrotatedY = Utils.unrotate(-inst.angle + Utils.halfPI, inst.x, inst.y, x, y);
            const yf = (unrotatedY + inst.height * 0.5) / inst.height;
            const unrotatedX = Utils.unrotate(-inst.angle, inst.x, inst.y, x, y);
            const xf = (unrotatedX + inst.width * 0.5) / inst.width;
            const addHeight = Math.min(inst.zHeight * (xf + yf), inst.zHeight);
            height = inst.totalZElevation + addHeight;
            slideAngle = Utils.toDegrees(Math.atan2(inst.height, inst.width)) + inst.angleDegrees + 90 * Math.sign(inst.height * inst.width);
            if (addHeight != inst.zHeight) {
                slopeRadians = Utils.halfPI - Math.acos((2 * inst.zHeight) / Math.sqrt(Math.pow(inst.width, 2) + Math.pow(inst.height, 2) + 4 * Math.pow(inst.zHeight, 2)));
            } else slopeRadians = 0;
            break;

        case "corner-out":
            const unrotatedY2 = (Utils.unrotate(-inst.angle + Utils.halfPI, inst.x, inst.y, x, y) + inst.height * 0.5) / inst.height;
            const unrotatedX2 = (Utils.unrotate(-inst.angle, inst.x, inst.y, x, y) + inst.width * 0.5) / inst.width;
            const addHeight2 = Math.min(inst.zHeight * unrotatedX2, inst.zHeight * unrotatedY2);
            height = inst.totalZElevation + addHeight2;

            if (unrotatedY2 < unrotatedX2) {
                slideAngle = inst.angleDegrees + 90;
                slopeRadians = Math.atan(inst.zHeight / inst.height);
            }
            else {
                slideAngle = inst.angleDegrees + 180;
                slopeRadians = Math.atan(inst.zHeight / inst.width);
            }
            break;

        default:
            height = inst.totalZElevation + inst?.zHeight
    };

    return {
        "height": height,
        "ZAngleRadians": slopeRadians,
        "XAngle": slideAngle
    }
}

function getMaxZFromShape(inst, x, y) {
    switch (inst.shape) {

        case "box":
            return inst.totalZElevation + inst.zHeight;

        case "wedge":
            return inst.totalZElevation + inst.zHeight * (Utils.unrotate(-inst.angle, inst.x, inst.y, x, y) + inst.width * 0.5) / inst.width;

        case "prism":
            let f = (Utils.unrotate(-inst.angle + Utils.halfPI, inst.x, inst.y, x, y) + inst.height * 0.5) / inst.height;;
            if (f > 0.5) f = 1 - f;
            return inst.totalZElevation + inst.zHeight * f * 2;

        case "pyramid":
            const unrotY = Utils.unrotate(-inst.angle + Utils.halfPI, inst.x, inst.y, x, y);
            let pyYF = (unrotY + inst.height * 0.5) / inst.height;
            pyYF = 1 - Math.abs(1 - 2 * (pyYF % 1))
            const unrotX = Utils.unrotate(-inst.angle, inst.x, inst.y, x, y);
            let pyXF = (unrotX + inst.width * 0.5) / inst.width;
            pyXF = 1 - Math.abs(1 - 2 * (pyXF % 1))
            return inst.totalZElevation + inst.zHeight * Math.min(pyXF, pyYF);

        case "corner-in":
            const unrotatedY = Utils.unrotate(-inst.angle + Utils.halfPI, inst.x, inst.y, x, y);
            const yf = (unrotatedY + inst.height * 0.5) / inst.height;
            const unrotatedX = Utils.unrotate(-inst.angle, inst.x, inst.y, x, y);
            const xf = (unrotatedX + inst.width * 0.5) / inst.width;
            return inst.totalZElevation + Math.min(inst.zHeight * (xf + yf), inst.zHeight);

        case "corner-out":
            const unrotatedY2 = (Utils.unrotate(-inst.angle + Utils.halfPI, inst.x, inst.y, x, y) + inst.height * 0.5) / inst.height;
            const unrotatedX2 = (Utils.unrotate(-inst.angle, inst.x, inst.y, x, y) + inst.width * 0.5) / inst.width;
            return inst.totalZElevation + Math.min(inst.zHeight * unrotatedX2, inst.zHeight * unrotatedY2);

        default:
            return inst.totalZElevation + inst?.zHeight
    };
}

export function castRay(runtime, from, to, objectTypes, stepSize = 12) {
    //prepare stuff
    const cur = from.duplicate();
    const stepVector = Vec3.normalBetween(from, to);
    stepVector.multiply(new Vec3(stepSize, stepSize, stepSize))
    const distance = from.distance(to);
    let rayCastData = runtime.objects.rayCastData.getFirstInstance();
    if (!rayCastData) {
        rayCastData = runtime.objects.rayCastData.createInstance("environment", 0, 0);
    }
    rayCastData.setPosition(from.x, from.y);
    rayCastData.angle = new Vec2(from.x, from.y).angle(new Vec2(to.x, to.y));
    rayCastData.width = new Vec2(from.x, from.y).distance(new Vec2(to.x, to.y));
    rayCastData.instVars.lastCastHit = false;
    //gather candidates once over the ray's whole 2D bounding box.
    //(the old per-collision-cell refresh sampled a zero-size rect where the ray
    //entered each cell and could miss solids reached mid-cell)
    const minZ = Math.min(from.z, to.z);
    const maxZ = Math.max(from.z, to.z);
    const rect = new DOMRect(Math.min(from.x, to.x), Math.min(from.y, to.y), Math.abs(to.x - from.x), Math.abs(to.y - from.y));
    const candidates = [];
    for (const inst of new Set(runtime.collisions.getCollisionCandidates(objectTypes, rect))) {
        if (inst.totalZElevation + inst.zHeight >= minZ && inst.totalZElevation <= maxZ && rayCastData.testOverlap(inst)) {
            candidates.push(inst);
        }
    }
    if (candidates.length === 0) return true //nothing in the way
    //step ray
    const stepAmount = Math.ceil(distance / stepSize)
    for (let i = 0; i < stepAmount; i++) {
        for (const inst of candidates) {
            if (inst.totalZElevation <= cur.z && inst.containsPoint(cur.x, cur.y) && getMaxZFromShape(inst, cur.x, cur.y) > cur.z) {
                //set hit data to instance so it's accesible in the event sheet
                rayCastData.instVars.hitUID = inst.uid;
                rayCastData.instVars.lastCastHit = true;
                rayCastData.instVars.hitX = cur.x;
                rayCastData.instVars.hitY = cur.y;
                rayCastData.instVars.hitZ = cur.z;
                rayCastData.instVars.hitDistance = cur.distance(from);
                return false //hit obstacle
            }
        }
        cur.x += stepVector.x;
        cur.y += stepVector.y;
        cur.z += stepVector.z;
    }
    return true //didn't hit obsatacle
}

export function updateCollisionSpace(runtime) {
    const player = runtime.objects.player.getFirstInstance();
    const playerStepZ = player.totalZElevation + player.instVars.zStep;
    const playerHeight = player.totalZElevation + player.instVars.standHeight;
    let floorUID = -1;

    const candidates = new Set(runtime.collisions.getCollisionCandidates(runtime.objects.solid, new DOMRect(player.x - 300, player.y - 300, 600, 600)));

    let floor = -99999;
    let ceiling = 99999;
    for (const inst of candidates) {
        inst.behaviors.Solid.isEnabled = false;

        if (!inst.isCollisionEnabled) continue;

        const isOverlapping = player.testOverlap(inst);

        if (inst.totalZElevation >= playerHeight) {

            if (isOverlapping && inst.totalZElevation < ceiling) ceiling = inst.totalZElevation;

        } else if (inst.totalZElevation + inst.zHeight > floor) {

            const height = getMaxZFromShape(inst, player.x, player.y);

            if (isOverlapping && height < playerStepZ && height > floor) {
                floor = height;
                floorUID = inst.uid;
            }
            if (playerStepZ <= height && playerHeight > inst.totalZElevation) inst.behaviors.Solid.isEnabled = true;
        }
    }

    if (floorUID != -1) {
        //get more data of floor
        player.instVars.floorUID = floorUID;
        const inst = runtime.getInstanceByUid(floorUID);
        const {
            ZAngleRadians: slopeAngleRadians,
            XAngle: slideAngle
        } = getZDataFromShape(inst, player.x, player.y);

        player.instVars.floorAngle = Utils.toDegrees(slopeAngleRadians);
        //player.instVars.slopePushForce = Math.cos(slopeAngleRadians) * player.instVars.gravity * 2;
        player.instVars.slideAngle = slideAngle;
        player.instVars.shouldBePushed = Math.abs(player.instVars.floorAngle) > player.instVars.slopePushAngleThreshold && Math.abs(player.instVars.floorAngle) < 89;
        player.instVars.curGroundType = inst.instVars.groundType;
        player.instVars.curGroundSoundType = inst.instVars.groundSoundType;
    };
    player.instVars.zCeiling = ceiling;
    player.instVars.zFloor = floor;
}