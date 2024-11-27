function CGloves(iX, iY, oSprite, oPhysics, oParentContainer) {

    var _oGloves;
    var _oParentContainer;
    var _oPhysics;

    this._init = function (iX, iY, oSprite) {
        
        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: oSprite.width / 2, height: oSprite.height, regX: (oSprite.width / 2) / 2, regY: oSprite.height / 2},
            animations: {normal: [0], perfect: [1]}
        };


        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _oGloves = createSprite(oSpriteSheet, "normal", (oSprite.width / 2) / 2, oSprite.height / 2, oSprite.width / 2, oSprite.height);
        this.setPosition(iX, iY);

        _oParentContainer.addChild(_oGloves);
    };

    this.unload = function () {
        _oParentContainer.removeChild(_oGloves);
    };

    this.setPosition = function (iX, iY) {
        _oGloves.x = iX;
        _oGloves.y = iY;
    };

    this.getObject = function () {
        return _oGloves;
    };

    this.getDepthPos = function () {
        return _oPhysics.position.y;
    };

    this.getX = function () {
        return _oGloves.x;
    };

    this.getY = function () {
        return _oGloves.y;
    };

    this.changeState = function (szText) {
        _oGloves.gotoAndStop(szText);
    };

    this.getPhysics = function () {
        return _oPhysics;
    };

    this.setRotation = function (fValue) {
        _oGloves.rotation = fValue;
    };

    _oPhysics = oPhysics;
    _oParentContainer = oParentContainer;

    this._init(iX, iY, oSprite);

    return this;
}