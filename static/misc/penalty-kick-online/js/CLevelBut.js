function CLevelBut(iXPos, iYPos, iOpponent, aResult,iLevel,oSprite, bActive, oParentContainer) {
    var _bActive;
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams = [];

    var _oLevelText;
    var _oScorePlayer;
    var _oScoreOpponent;
    var _oButton;
    var _oLocked;
    var _oContainer;
    var _oParentContainer;
    var _oEventMouseDown;
    var _oEventPressUp;

    this._init = function (iXPos, iYPos, iOpponent, aResult,iLevel,oSprite, bActive) {
        _aCbCompleted = new Array();
        _aCbOwner = new Array();

        _oContainer = new createjs.Container();
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
        _oParentContainer.addChild(_oContainer);

        _bActive = bActive;
        _oButton = createBitmap(oSprite);
        _oButton.mouseEnabled = bActive;
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;
        _oContainer.addChild(_oButton);

        
        var oSpriteFlag = s_oSpriteLibrary.getSprite("flag_"+s_iTeamSelected);
        var oMyFlag = createBitmap(oSpriteFlag);
        oMyFlag.y = -26;
        oMyFlag.regX = oSpriteFlag.width/2;
        oMyFlag.regY = oSpriteFlag.height/2;
        oMyFlag.scaleX = oMyFlag.scaleY = 0.5;
        _oContainer.addChild(oMyFlag);

        var oSpriteFlag = s_oSpriteLibrary.getSprite("flag_"+iOpponent);

        var oOpponentFlag = createBitmap(oSpriteFlag);
        oOpponentFlag.y =  26;
        oOpponentFlag.regX = oSpriteFlag.width/2;
        oOpponentFlag.regY = oSpriteFlag.height/2;
        oOpponentFlag.scaleX = oOpponentFlag.scaleY = 0.5;
        _oContainer.addChild(oOpponentFlag);
        
        var oVsText = new createjs.Text(TEXT_VS, "20px " + PRIMARY_FONT, TEXT_COLOR);
        oVsText.y = 8;
        oVsText.textAlign = "center";
        oVsText.textBaseline = "alphabetic";
        oVsText.shadow = new createjs.Shadow("#000000", 2, 2, 4);
        _oContainer.addChild(oVsText);
        
        _oScorePlayer = new createjs.Text(aResult[0], "30px " + PRIMARY_FONT, TEXT_COLOR);
        _oScorePlayer.x = 40;
        _oScorePlayer.y = -14;
        _oScorePlayer.textAlign = "center";
        _oScorePlayer.textBaseline = "alphabetic";
        _oContainer.addChild(_oScorePlayer);
        
        
        _oScoreOpponent = new createjs.Text(aResult[1], "30px " + PRIMARY_FONT, TEXT_COLOR);
        _oScoreOpponent.x = 40;
        _oScoreOpponent.y = 38;
        _oScoreOpponent.textAlign = "center";
        _oScoreOpponent.textBaseline = "alphabetic";
        _oContainer.addChild(_oScoreOpponent);
        
        
        var oSpriteLocked = s_oSpriteLibrary.getSprite("but_level_locked");
        _oLocked = createBitmap(oSpriteLocked);
        _oLocked.regX = oSpriteLocked.width/2;
        _oLocked.regY = oSpriteLocked.height/2;
        _oContainer.addChild(_oLocked);
        
        
        _oLevelText = new createjs.Text(TEXT_MATCH + " "+iLevel, "24px " + PRIMARY_FONT, TEXT_COLOR);
        _oLevelText.x = 2;
        _oLevelText.y = -66;
        _oLevelText.textAlign = "center";
        _oLevelText.textBaseline = "alphabetic";
        _oLevelText.lineWidth = 200;
        _oContainer.addChild(_oLevelText);
        
        if (!bActive) {
            _oLevelText.color = "#b4b4b4";
            _oContainer.cursor = "default";
        }else{
            _oContainer.cursor = "pointer";
            _oLocked.visible = false;
        }

        this._initListener();
    };

    this.unload = function () {
        _oContainer.off("mousedown", _oEventMouseDown);
        _oContainer.off("pressup", _oEventPressUp);

        _oContainer.removeChild(_oButton);
    };

    this._initListener = function () {
        _oEventMouseDown = _oContainer.on("mousedown", this.buttonDown);
        _oEventPressUp = _oContainer.on("pressup", this.buttonRelease);
    };

    this.viewBut = function (oButton) {
        _oContainer.addChild(oButton);
    };

    this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this.addEventListenerWithParams = function (iEvent, cbCompleted, cbOwner, aParams) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };

    this.ifClickable = function () {
        if (_oContainer.mouseEnabled === true) {
            return 1;
        }
        return 0;
    };

    this.setActive = function ( bActive) {
        _bActive = bActive;
        
        _oButton.mouseEnabled = true;

        if (_bActive) {
            _oLocked.visible = false;
            _oLevelText.color = "#69b8d5";
        } else {
            _oLocked.visible = true;
            _oLevelText.color = "#b4b4b4";
        }

    };
    
    this.setScore = function(iPlayerScore,iOpponentScore){
        _oScorePlayer.text = iPlayerScore;
        _oScoreOpponent.text = iOpponentScore;
    };

    this.buttonRelease = function () {
        if (!_bActive) {
            return;
        }

        if (_aCbCompleted[ON_MOUSE_UP]) {
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP], _aParams);
        }
    };

    this.buttonDown = function () {
        if (_aCbCompleted[ON_MOUSE_DOWN]) {
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN], _aParams);
        }
    };

    this.setPosition = function (iXPos, iYPos) {
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
    };

    this.setVisible = function (bVisible) {
        _oContainer.visible = bVisible;
    };

    _oParentContainer = oParentContainer;
    this._init(iXPos, iYPos, iOpponent, aResult,iLevel,oSprite, bActive, oParentContainer);
}