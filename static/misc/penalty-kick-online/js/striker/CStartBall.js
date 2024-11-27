function CStartBall(iX, iY, oParetContainer) {

    var _oParentContainer = oParetContainer;
    var _oStartBall;

    this._init = function () {
        var oSpriteStartBall = s_oSpriteLibrary.getSprite("start_ball");

        _oStartBall = createBitmap(oSpriteStartBall);
        _oStartBall.regX = oSpriteStartBall.width * 0.5;
        _oStartBall.regY = oSpriteStartBall.height * 0.5;

        this.setPosition(iX, iY);

        _oParentContainer.addChild(_oStartBall);
    };

    this.setPosition = function (iX, iY) {
        _oStartBall.x = iX;
        _oStartBall.y = iY;
    };

    this.fadeAnim = function (fVal, iTime, iWait) {
        createjs.Tween.get(_oStartBall, {override: true}).wait(iWait).to({alpha: fVal}, iTime);
    };

    this.setAlpha = function (fVal) {
        _oStartBall.alpha = fVal;
    };

    this.setVisible = function (bVal) {
        _oStartBall.visible = bVal;
    };

    this._init();
    return this;
}