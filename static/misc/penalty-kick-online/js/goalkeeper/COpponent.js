function COpponent(iXPos, iYPos, oSprite, oParentContainer) {

    var _oOpponent;
    var _oParentContainer;

    this._init = function (iXPos, iYPos, oSprite, oParentContainer) {

        _oParentContainer = oParentContainer;

        var iWidth = 2002;
        var iHeight = 1008;

        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: iWidth / 13, height: iHeight / 7, regX: (iWidth / 2) / 13, regY: (iHeight) / 7},
            animations: {
                start:0,
                shot: [0, 44, "stay", 30 / FPS],
                stay: [45, 79, "remain", 30 / FPS],
                remain: [79]
            }
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oOpponent = createSprite(oSpriteSheet, "start", (iWidth / 2) / 13, (iHeight) / 7, iWidth / 13, iHeight / 7);
        _oOpponent.scaleX = _oOpponent.scaleY = 0.9;
        _oOpponent.x = iXPos;
        _oOpponent.y = iYPos;
        _oParentContainer.addChild(_oOpponent);
    };

    this.getX = function () {
        return _oOpponent.x;
    };

    this.getY = function () {
        return _oOpponent.y;
    };

    this.setPosition = function (iXPos, iYPos) {
        if (iXPos === null) {

        } else {
            _oOpponent.x = iXPos;
        }
        if (iYPos === null) {

        } else {
            _oOpponent.y = iYPos;
        }
    };

    this.rotate = function (iValue) {
        _oOpponent.scaleX = iValue;
    };

    this.setVisible = function (bVal) {
        _oOpponent.visible = bVal;
    };

    this.changeState = function (szState) {
        _oOpponent.gotoAndPlay(szState);

    };

    this.stopAnimation = function () {
        _oOpponent.stop();
    };

    this.playAnimation = function () {
        _oOpponent.play();
    };

    this.onFinishAnimation = function () {

        _oOpponent.on("animationend", function () {
            s_oGameKeeper.addImpulseToBall();
            playSound("kick", 0.3, false);
            _oOpponent.removeAllEventListeners();
        });
    };

    this.onRemoteFinishAnimation = function(oDir){
        var oParent = this;
        _oOpponent.on("animationend", function () {
            s_oGameKeeper.addRemoteImpulseToBall(oDir);
            playSound("kick", 0.3, false);
            _oOpponent.removeAllEventListeners();
            //oParent.fadeAnimation(0);
        });
    };

    this.fadeAnimation = function (fVal) {
        createjs.Tween.get(_oOpponent).to({alpha: fVal}, 500);
    };

    this.removeTweens = function () {
        createjs.Tween.removeTweens(_oOpponent);
    };

    this._init(iXPos, iYPos, oSprite, oParentContainer);

    return this;
}

