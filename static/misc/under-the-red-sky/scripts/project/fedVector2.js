//fedVectors: vector 2 class with c3 specific methods. Written by Federico Calchera v0.3, MIT License
export default class Vec2 {

    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    static fromInst(inst) {
        return new Vec2(inst.x, inst.y)
    }

    static fromArray(arr) {
        return new Vec2(arr[0], arr[1])
    }

    static fromInst(inst) {
        return new Vec2(inst.x, inst.y)
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    distance(vec2) {
        const tempVec2 = this.duplicate().subtract(vec2);
        return Math.sqrt(tempVec2.x * tempVec2.x + tempVec2.y * tempVec2.y);
    }

    distanceSquared(vec2) {
        const tempVec2 = this.duplicate().subtract(vec2);
        return tempVec2.x * tempVec2.x + tempVec2.y * tempVec2.y;
    }

    angle(vec2) {
        return Math.atan2(vec2.y - this.y, vec2.x - this.x);
    }

    normalize() {
        const mag = this.magnitude;
        this.x /= mag;
        this.y /= mag;
        return this
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this
    }

    setFromArray(arr) {
        this.x = arr[0];
        this.y = arr[1];
        return this
    }

    divide(vec2) {
        this.x /= vec2.x;
        this.y /= vec2.y;
        return this;
    }

    multiply(vec2) {
        this.x *= vec2.x;
        this.y *= vec2.y;
        return this;
    }

    add(vec2) {
        this.x += vec2.x;
        this.y += vec2.y;
        return this;
    }

    subtract(vec2) {
        this.x -= vec2.x;
        this.y -= vec2.y;
        return this;
    }
    duplicate() {
        return new Vec2(this.x, this.y)
    }

    dot(vec2) {
        return this.x * vec2.x + this.y * vec2.y
    }
}