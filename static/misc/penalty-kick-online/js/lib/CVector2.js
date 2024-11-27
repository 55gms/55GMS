function CVector2(iX, iY) {

    var x;
    var y;

    this._init = function (iX, iY) {
        x = iX;
        y = iY;
    };
    this.add = function (vx, vy) {
        x += vx;
        y += vy;
    };
    this.addV = function (v) {
        x += v.getX();
        y += v.getY();
    };
    this.scalarDivision = function (n) {
        x /= n;
        y /= n;
    };
    this.subtract = function (v) {
        x -= v.getX();
        y -= v.getY();
    };
    this.scalarProduct = function (n) {
        x *= n;
        y *= n;
    };
    this.invert = function () {
        x *= -1;
        y *= -1;
    };
    this.dotProduct = function (v) {
        return (x * v.getX() + y * v.getY());
    };
    this.set = function (fx, fy) {
        x = fx;
        y = fy;
    };
    this.setV = function (v) {
        x = v.getX();
        y = v.getY();
    };
    this.length = function () {
        return Math.sqrt(x * x + y * y);
    };
    this.length2 = function () {
        return x * x + y * y;
    };
    this.normalize = function () {
        var len = this.length();
        if (len > 0) {
            x /= len;
            y /= len;
        }
    };

    this.angleBetweenVectors = function (v2) {
        var iAngle = Math.acos(this.dotProduct(v2) / (this.length() * v2.length()));
        if (isNaN(iAngle) === true) {
            return 0;
        } else {
            return iAngle;
        }
    };

    this.getNormalize = function (outV) {
        var len = this.length();
        outV.set(x, y);
        outV.normalize();
    };
    this.rot90CCW = function () {
        var a = x;
        x = -y;
        y = a;
    };
    this.rot90CW = function () {
        var a = x;
        x = y;
        y = -a;
    };
    this.getRotCCW = function (outV) {
        outV.set(x, y);
        outV.rot90CCW();
    };
    this.getRotCW = function (outV) {
        outV.set(x, y);
        outV.rot90CW();
    };
    this.ceil = function () {
        x = Math.ceil(x);
        y = Math.ceil(y);
    };
    this.round = function () {
        x = Math.round(x);
        y = Math.round(y);
    };
    this.toString = function () {
        return "Vector2: " + x + ", " + y;
    };
    this.print = function () {
        trace("Vector2: " + x + ", " + y + "");
    };
    this.getX = function () {
        return x;
    };
    this.getY = function () {
        return y;
    };

    this.rotate = function (iAngle) {
        var fNewX = x;
        var fNewY = y;

        x = fNewX * Math.cos(iAngle) - fNewY * Math.sin(iAngle);
        y = fNewX * Math.sin(iAngle) + fNewY * Math.cos(iAngle);
    };

    this._init(iX, iY);
}