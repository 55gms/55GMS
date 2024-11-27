function CGoalStriker(iX, iY, oSprite, oParentContainer) {

    var _oGoal;
    var _oParentContainer;

    this._init = function (iX, iY, oSprite) {

        _oGoal = createBitmap(oSprite);
        this.setPosition(iX, iY);
        _oGoal.cache(0, 0, oSprite.width, oSprite.height);

        _oParentContainer.addChild(_oGoal);
    };

    this.unload = function () {
        _oParentContainer.removeChild(_oGoal);
    };

    this.setPosition = function (iX, iY) {
        _oGoal.x = iX;
        _oGoal.y = iY;
    };

    this.getDepthPos = function () {
        return GOAL_SPRITE_SWAP_Y;
    };

    this.getObject = function () {
        return _oGoal;
    };
    
    _oParentContainer = oParentContainer;

    this._init(iX, iY, oSprite);

    return this;
}


