function CToggle(iXPos, iYPos, oSprite, bActive, oParentContainer) {
    var _bActive;
    var _aCbCompleted;
    var _aCbOwner;
    var _oButton;
    var _oParentContainer;
    var _oListenerMouseDown;
    var _oListenerMouseUp;

    this._init = function (iXPos, iYPos, oSprite, bActive, oParentContainer) {
        if (oParentContainer !== undefined) {
            _oParentContainer = oParentContainer;
        } else {
            _oParentContainer = s_oStage;
        }

        _aCbCompleted = new Array();
        _aCbOwner = new Array();

        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: oSprite.width / 2, height: oSprite.height, regX: (oSprite.width / 2) / 2, regY: oSprite.height / 2},
            animations: {state_true: [0], state_false: [1]}
        };


        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _bActive = bActive;

        _oButton = createSprite(oSpriteSheet, "state_" + _bActive, (oSprite.width / 2) / 2, oSprite.height / 2, oSprite.width / 2, oSprite.height);

        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.stop();

        if (!s_bMobile)
            _oButton.cursor = "pointer";

        _oParentContainer.addChild(_oButton);

        this._initListener();
    };

    this.unload = function () {
        _oButton.off("mousedown", _oListenerMouseDown);
        _oButton.off("pressup", _oListenerMouseUp);

        _oParentContainer.removeChild(_oButton);
    };

    this._initListener = function () {
        _oListenerMouseDown = _oButton.on("mousedown", this.buttonDown);
        _oListenerMouseUp = _oButton.on("pressup", this.buttonRelease);
    };

    this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this.setCursorType = function (szValue) {
        _oButton.cursor = szValue;
    };

    this.setActive = function (bActive) {
        _bActive = bActive;
        _oButton.gotoAndStop("state_" + _bActive);
    };

    this.buttonRelease = function () {
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;

        playSound("click", 1, false);

        _bActive = !_bActive;
        _oButton.gotoAndStop("state_" + _bActive);

        if (_aCbCompleted[ON_MOUSE_UP]) {
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP], _bActive);
        }
    };

    this.buttonDown = function () {
        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;

        if (_aCbCompleted[ON_MOUSE_DOWN]) {
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
        }
    };

    this.setPosition = function (iX, iY) {
        _oButton.x = iX;
        _oButton.y = iY;
    };

    this._init(iXPos, iYPos, oSprite, bActive, oParentContainer);
}