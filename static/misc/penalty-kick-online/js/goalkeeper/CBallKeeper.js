function CBallKeeper(iXPos, iYPos, oSprite, oPhysics, oParentContainer) {

    var _oBall;
    var _oParentContainer;
    var _oPhysics;
    var _oShadow;
    var _oContainer;
    var _fStartShadowPos = null;
    var _fScale = 0.66;
    var _fScaleShadow = 0.6;
    var _iBufferTime = 0;
    var _iFrame = 0;
    var _oTween = null;
    var _fAlpha;

    this._init = function (iXPos, iYPos, oSprite) {
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);

        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: oSprite.width / 7, height: oSprite.height, regX: (oSprite.width / 2) / 7, regY: oSprite.height / 2}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oBall = createSprite(oSpriteSheet, 0, (oSprite.width / 2) / 7, oSprite.height / 2, oSprite.width / 7, oSprite.height / 2);
        _oBall.stop();
        this.scale(_fScale);

        var oSpriteShadow = s_oSpriteLibrary.getSprite("ball_shadow");
        _oShadow = createBitmap(oSpriteShadow);
        _oShadow.x = iXPos;
        _oShadow.y = iYPos;
        _oShadow.regX = oSpriteShadow.width * 0.5;
        _oShadow.regY = oSpriteShadow.height * 0.5;

        this.scaleShadow(_fScaleShadow);

        _oContainer.addChild(_oShadow, _oBall);
    };

    this.rolls = function () {
        var iForceX = _oPhysics.velocity.x * 0.15;

        var fAngle = Math.sin(iForceX);

        _oBall.rotation = Math.degrees(fAngle);

        var iForceY = Math.abs(_oPhysics.angularVelocity.x);

        var oFuncRot = this._goToPrevFrame;

        if (_oPhysics.angularVelocity.x < 0) {
            oFuncRot = this._goToNextFrame;
        }

        if (iForceY > 7) {
            oFuncRot();
        } else if (iForceY > 3) {
            _iBufferTime++;
            if (_iBufferTime > 2 / ROLL_BALL_RATE) {
                oFuncRot();
                _iBufferTime = 0;
            }
        } else if (iForceY > 1) {
            _iBufferTime++;
            if (_iBufferTime > 3 / ROLL_BALL_RATE) {
                oFuncRot();
                _iBufferTime = 0;
            }
        } else if (iForceY > MIN_BALL_VEL_ROTATION) {
            _iBufferTime++;
            if (_iBufferTime > 4 / ROLL_BALL_RATE) {
                oFuncRot();
                _iBufferTime = 0;
            }
        }
    };

    this._goToPrevFrame = function () {
        if (_iFrame === 0) {
            _iFrame = 6;
            _oBall.gotoAndStop(_iFrame);
        } else {
            _iFrame--;
            _oBall.gotoAndStop(_iFrame);
        }
    };

    this._goToNextFrame = function () {
        if (_iFrame === 7) {
            _iFrame = 1;
            _oBall.gotoAndStop(_iFrame);
        } else {
            _iFrame++;
            _oBall.gotoAndStop(_iFrame);
        }
    };

    this.unload = function () {
        _oBall.removeAllEventListeners();
        _oParentContainer.removeChild(_oBall);
    };

    this.setVisible = function (bVisible) {
        _oBall.visible = bVisible;
    };

    this.startPosShadowY = function (fYPos) {
        _fStartShadowPos = fYPos;
    };

    this.getStartShadowYPos = function () {
        return _fStartShadowPos;
    };

    this.fadeAnimation = function (fVal, iTime, iWait) {
        if (fVal !== _fAlpha) {
            if (_oTween === null) {
                this.tweenFade(fVal, iTime, iWait);
            } else {
                createjs.Tween.removeTweens(_oContainer);
                this.tweenFade(fVal, iTime, iWait);
            }
            _fAlpha = fVal;
        }
    };

    this.tweenFade = function (fVal, iTime, iWait) {
        _oTween = createjs.Tween.get(_oContainer).wait(iWait).to({alpha: fVal}, iTime).call(function () {
            _oTween = null;
        });
    };

    this.setPositionShadow = function (iX, iY) {
        _oShadow.x = iX;
        _oShadow.y = iY;
    };

    this.setPosition = function (iXPos, iYPos) {
        _oBall.x = iXPos;
        _oBall.y = iYPos;
    };

    this.getPosition = function(){
        return {x: _oBall.x, y: _oBall.y}
    };

    this.getPhysics = function () {
        return _oPhysics;
    };

    this.setAngle = function (iAngle) {
        _oBall.rotation = iAngle;
    };

    this.getX = function () {
        return _oBall.x;
    };

    this.getY = function () {
        return _oBall.y;
    };

    this.getStartScale = function () {
        return _fScale;
    };

    this.scale = function (fValue) {
        _oBall.scaleX = fValue;
        _oBall.scaleY = fValue;
    };

    this.scaleShadow = function (fScale) {
        if (fScale > 0.08) {
            _oShadow.scaleX = fScale;
            _oShadow.scaleY = fScale;
        } else {
            _oShadow.scaleX = 0.08;
            _oShadow.scaleY = 0.08;
        }
    };

    this.setAlphaByHeight = function (fHeight) {
        _oShadow.alpha = fHeight;
    };

    this.getScale = function () {
        return _oBall.scaleX;
    };

    this.getObject = function () {
        return _oContainer;
    };

    this.getDepthPos = function () {
        return _oPhysics.position.y;
    };

    this.setVisible = function(bVal){
        _oContainer.visible = bVal;
    };

    _oPhysics = oPhysics;
    _oParentContainer = oParentContainer;

    this._init(iXPos, iYPos, oSprite);

    return this;
}
