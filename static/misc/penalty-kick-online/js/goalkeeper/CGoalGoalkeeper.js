function CGoalGoalkeeper(iX, iY, oSprite, oPhysics, oParentContainer) {

    var _oGoal;
    var _oPhysics;
    var _oParentContainer;

    this._init = function (iX, iY, oSprite) {

        _oGoal = createBitmap(oSprite);
        this.setPosition(iX, iY);

        _oParentContainer.addChild(_oGoal);
    };

    this.unload = function () {
        _oParentContainer.removeChild(_oGoal);
    };

    this.setPosition = function (iX, iY) {
        _oGoal.x = iX;
        _oGoal.y = iY;
    };

    this.getObject = function () {
        return _oGoal;
    };

    this.getDepthPos = function () {
        return _oPhysics.position.y;
    };

    this.getPhysics = function () {
        return _oPhysics;
    };

    this.getX = function () {
        return _oGoal.x;
    };

    this.getY = function () {
        return _oGoal.y;
    };

    _oPhysics = oPhysics;
    _oParentContainer = oParentContainer;

    this._init(iX, iY, oSprite);

    return this;
}


