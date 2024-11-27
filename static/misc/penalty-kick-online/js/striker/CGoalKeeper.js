function CGoalKeeper(iXPos, iYPos, iType,oParentContainer) {
    var _iType = iType;
    var _pStartPos;
    var _oContainer;
    var _aAnimContainer;
    var _oParentContainer;
    var _aAllAnim;
    var _fBuffer = 0;
    var _iAnimKeeper = 0;
    var _iAnimType = IDLE;

    this._init = function (iXPos, iYPos, oParentContainer) {

        _oParentContainer = oParentContainer;

        _pStartPos = {x: iXPos, y: iYPos};
        _oContainer = new createjs.Container();
        _oContainer.x = _pStartPos.x;
        _oContainer.y = _pStartPos.y;
        _oParentContainer.addChild(_oContainer);
        _oContainer.tickChildren = false;

        _aAllAnim = new Array();
        _aAnimContainer = new Array();

        var iWidthMax = 0;
        var iHeightMax = 0;

        for (var i = 0; i < NUM_SPRITE_GOALKEEPER.length; i++) {
            _aAnimContainer[i] = new createjs.Container();
            _aAnimContainer[i].regX = -OFFSET_CONTAINER_GOALKEEPER[i].x;
            _aAnimContainer[i].regY = -OFFSET_CONTAINER_GOALKEEPER[i].y;
            _aAllAnim.push(this.loadAnim(SPRITE_NAME_GOALKEEPER[i], NUM_SPRITE_GOALKEEPER[i], _aAnimContainer[i]));
            _oContainer.addChild(_aAnimContainer[i]);

            var oSprite = s_oSpriteLibrary.getSprite(SPRITE_NAME_GOALKEEPER[i] + "_" +_iType + "_0");
            if (oSprite.width > iWidthMax) {
                iWidthMax = oSprite.width;
            }

            if (oSprite.height > iHeightMax) {
                iHeightMax = oSprite.height;
            }
        }

        _oContainer.cache(-iWidthMax, -iHeightMax, iWidthMax * 2, iHeightMax * 2);

        _aAllAnim[IDLE][0].visible = true;
        //_aAllAnim[CENTER][0].visible = true;
    };

    this.getAnimType = function () {
        return _iAnimType;
    };

    this.getAnimArray = function () {
        return _aAllAnim[_iAnimType];
    };

    this.loadAnim = function (szSprite, iNum, oContainer) {
        var aAnim = new Array();
        for (var i = 0; i < iNum; i++) {
            aAnim.push(createBitmap(s_oSpriteLibrary.getSprite(szSprite + "_" +iType + "_" + i)));
            aAnim[i].visible = false;
            oContainer.addChild(aAnim[i]);
        }
        return aAnim;
    };

    this.getX = function () {
        return _oContainer.x;
    };

    this.getY = function () {
        return _oContainer.y;
    };

    this.disableAllAnim = function () {
        for (var i = 0; i < _aAnimContainer.length; i++) {
            _aAnimContainer[i].visible = false;
        }
    };

    this.setPosition = function (iXPos, iYPos) {
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
    };

    this.resetPosition = function(){
        _oContainer.x = _pStartPos.x;
        _oContainer.y = _pStartPos.y;
    };

    this.setVisible = function (bVal) {
        _oContainer.visible = bVal;
    };

    this.fadeAnimation = function (fVal) {
        createjs.Tween.get(_oContainer, {override: true}).to({alpha: fVal}, 500);
    };

    this.setAlpha = function (fVal) {
        _oContainer.alpha = fVal;
    };

    this.getObject = function () {
        return _oContainer;
    };

    this.getFrame = function () {
        return _iAnimKeeper;
    };

    this.viewFrame = function (aAnim, iFrame) {
        aAnim[iFrame].visible = true;
    };

    this.hideFrame = function (aAnim, iFrame) {
        aAnim[iFrame].visible = false;
    };

    this.getDepthPos = function () {
        return GOAL_KEEPER_DEPTH_Y;
    };

    this.animGoalKeeper = function (aAnim, iEndFrame) {
        _fBuffer += s_iTimeElaps;
        if (_fBuffer > BUFFER_ANIM_PLAYER) {
            this.hideFrame(aAnim, _iAnimKeeper);
            if (_iAnimKeeper + 1 < iEndFrame) {
                this.viewFrame(aAnim, _iAnimKeeper + 1);
                _iAnimKeeper++;

            } else {
                _iAnimKeeper = 0;
                _fBuffer = 0;
                this.viewFrame(aAnim, _iAnimKeeper);
                return false;
            }
            _fBuffer = 0;
            _oContainer.updateCache();
        }
        return true;
    };

    this.resetAnimation = function (iType) {
        this.resetAnimFrame(_aAllAnim[iType], NUM_SPRITE_GOALKEEPER[iType]);
    };

    this.resetAnimFrame = function (aAnim, iNum) {
        for (var i = 1; i < iNum; i++) {
            aAnim[i].visible = false;
        }
        aAnim[0].visible = true;
    };

    this.setVisibleContainer = function (iType, bVal) {
        _aAnimContainer[iType].visible = bVal;
    };

    this.runAnim = function (iVal) {
        this.disableAllAnim();
        this.resetAnimation(iVal);
        this.setVisibleContainer(iVal, true);
        _iAnimType = iVal;
        _iAnimKeeper = 0;
    };

    this.runAnimAndShift = function (iVal, pBallFinalPos) {
        this.disableAllAnim();
        this.resetAnimation(iVal);
        this.setVisibleContainer(iVal, true);
        _iAnimType = iVal;
        _iAnimKeeper = 0;
        
        
        var pOriginImpact = ORIGIN_POINT_IMPACT_ANIMATION[iVal];

        //console.log(pOriginImpact)
        
        
        
        var iX = (pBallFinalPos.x - pOriginImpact.x);
        if(pOriginImpact.x === null){
            iX = 0;
        }
        var iY = (pBallFinalPos.y - pOriginImpact.y);
        if(pOriginImpact.y === null){
            iY = 0;
        }
        
        var pCorrection = {x: iX, y:  iY};
        
        //console.log(pCorrection)
        
        
        createjs.Tween.get(_oContainer).to({x:_pStartPos.x + pCorrection.x, y:_pStartPos.y +pCorrection.y}, 600).call(function(){
            ///VARIABLE IF RETURN IN POSITION? GENERALLY, ALL THE JUMPING ANIM SHOULD RETURN IN POSITION;
            if(iY !== 0){
                createjs.Tween.get(_oContainer).to({x:_pStartPos.x, y:_pStartPos.y}, 300);
            }
        });
                
        
    };

    this.update = function () {
        return this.animGoalKeeper(_aAllAnim[_iAnimType], NUM_SPRITE_GOALKEEPER[_iAnimType]);
    };

    this._init(iXPos, iYPos, oParentContainer);

    return this;
}

