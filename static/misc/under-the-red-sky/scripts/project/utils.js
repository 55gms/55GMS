import Vec3 from "./fedVector3.js";

//Utils class written by Federico Calchera, MIT License

export default class Utils {

    static get halfPI() {
        return 1.57079632679
    };

    static get TAU() {
        return 6.28318530718
    };

    //math
    static lerp(a, b, alpha) {
        return a + alpha * (b - a)
    };

    static angleClamp(angle, minimum, maximum) {
        //degrees
        const start = (minimum + maximum) * 0.5 - 180;
        const floored = Math.floor((angle - start) / 360) * 360;
        return Utils.clamp(angle, minimum + floored, maximum + floored)
    }

    static angleLerp(a, b, x) {
        const diff = Utils.angleDiff(a, b);
        if (Utils.angleClockwise(b, a))
            return Utils.clampAngle(a + diff * x);
        else
            return Utils.clampAngle(a - diff * x)
    };

    static angleDiff(a1, a2) {
        if (a1 === a2)
            return 0;
        let s1 = Math.sin(a1);
        let c1 = Math.cos(a1);
        let s2 = Math.sin(a2);
        let c2 = Math.cos(a2);
        let n = s1 * s2 + c1 * c2;
        if (n >= 1)
            return 0;
        if (n <= -1)
            return Math.PI;
        return Math.acos(n)
    };

    static angleClockwise(a1, a2) {
        let s1 = Math.sin(a1);
        let c1 = Math.cos(a1);
        let s2 = Math.sin(a2);
        let c2 = Math.cos(a2);
        return c1 * s2 - s1 * c2 <= 0
    };

    static clampAngle(a) {
        a %= Utils.TAU;
        if (a < 0)
            a += Utils.TAU;
        return a
    };

    static unlerp(min, max, value) {
        return (value - min) / (max - min);
    };

    static expDecay(a, b, decay, dt) {
        //decay 1 - 25, from slow to fast
        return b + (a - b) * Math.exp(-decay * dt)
    }

    static remap(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    };

    static wrap0(value, max) {
        return (value % max + max) % max;
    };

    static wrap(value, min, max) {
        const diff = max - min;
        if (diff === 0)
            return max;
        if (value < min) {
            const r = max - (min - value) % diff;
            return r === max ? 0 : r
        } else
            return min + (value - min) % diff
    }

    static clamp(number, min, max) {
        return Math.max(min, Math.min(number, max));
    };

    static unrotate(angle, instX, instY, x, y) {
        return Math.cos(angle) * (x - instX) - Math.sin(angle) * (y - instY)
    };

    static snap(value, step) {
        return Math.floor(value / step) * step;
    };

    static toGrid(value, step) {
        return Math.floor(value / step);
    };

    static flipAngleHorizontally(angle) {
        return 180 - angle
    }
    static flipAngleVertically(angle) {
        return 360 - angle
    }

    static wrapDegrees(degrees) {
        (degrees % 360 + 360) % 360
    }

    static angleDiff(a1, a2) {
        if (a1 === a2)
            return 0;
        const s1 = Math.sin(a1);
        const c1 = Math.cos(a1);
        const s2 = Math.sin(a2);
        const c2 = Math.cos(a2);
        const n = s1 * s2 + c1 * c2;
        if (n >= 1)
            return 0;
        if (n <= -1)
            return Math.PI;
        return Math.acos(n)
    }

    //conversion
    static toRadians(degrees) {
        return degrees * 0.017453292519943295
    };

    static toDegrees(radians) {
        return radians * 57.29577951308232
    };

    static pixelToMeter(pixel) {
        return pixel * 0.0125
    };

    static meterToPixel(meter) {
        return meter / 0.0125
    };

    //data
    static deduplicateArray(arr) {
        return Array.from(new Set(arr))
    };

    //misc
    static worldPosToHudPos(runtime, camPos, lookVector, x, y, z, clamped = false, margin = 100) {

        let value = { x: 0, y: 0, isOffscreen: false };
        const envLayer = runtime.layout.getLayer("environment");
        const vp = envLayer.getViewport();
        const vpCenter = [vp.left + vp.width * 0.5, vp.top + vp.height * 0.5];
        const halfMargin = margin * 0.5;

        const canvasPos = envLayer.layerToCssPx(x, y, z);
        [value.x, value.y] = runtime.layout.getLayer("hud").cssPxToLayer(canvasPos[0], canvasPos[1]);

        if (lookVector.dot(Vec3.normalBetween(camPos, new Vec3(x, y, z))) < 0) {
            if (!clamped) { return false }
            else {
                const ret = Utils.lineIntersectionOnRect(-vp.width + margin, -vp.height + margin, vpCenter[0], vpCenter[1], value.x, value.y);
                value.x = ret.x;
                value.y = ret.y;
                value.isOffscreen = true;
            }
        }

        else if (clamped && (value.x < vp.left + halfMargin || value.x > vp.right - halfMargin || value.y < vp.top + halfMargin || value.y > vp.bottom - halfMargin)) {
            const ret = Utils.lineIntersectionOnRect(vp.width - margin, vp.height - margin, vpCenter[0], vpCenter[1], value.x, value.y);
            value.x = ret.x;
            value.y = ret.y;
            value.isOffscreen = true;
        }

        return value
    }

    static lineIntersectionOnRect(width, height, rectCenterX, rectCenterY, pointX, pointY) {

        const w = width / 2;
        const h = height / 2;

        const dx = pointX - rectCenterX;
        const dy = pointY - rectCenterY;

        let xI = 0;
        let yI = 0;

        //if A=B return B itself
        if (dx == 0 && dy == 0) return {
            x: rectCenterX,
            y: rectCenterY
        };

        const tan_phi = h / w;
        const tan_theta = Math.abs(dy / dx);

        //tell me in which quadrant the A point is
        const qx = Math.sign(dx);
        const qy = Math.sign(dy);


        if (tan_theta > tan_phi) {
            xI = rectCenterX + (h / tan_theta) * qx;
            yI = rectCenterY + h * qy;
        } else {
            xI = rectCenterX + w * qx;
            yI = rectCenterY + w * tan_theta * qy;
        }

        return {
            x: xI,
            y: yI
        };
    }
}