function CAreYouSurePanel(oParentContainer) {
    var _aCbCompleted;
    var _aCbOwner;
    
    var _oBg;
    var _oMsg;
    var _oButYes;
    var _oButNo;
    var _oContainer;
    var _oParentContainer;
    var _oFade;
    
    var _oThis = this;

    this._init = function () {
        _aCbCompleted = new Array();
        _aCbOwner = new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.5;
        _oFade.on("click", function () {});

        _oContainer.addChild(_oFade);

        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box_small');
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;

        _oContainer.addChild(_oBg);

        /*
        _oMsg = new createjs.Text(TEXT_ARE_SURE, "60px " + PRIMARY_FONT, "#ffffff");
        _oMsg.x = CANVAS_WIDTH / 2;
        _oMsg.y = CANVAS_HEIGHT_HALF - 100;
        _oMsg.textAlign = "center";
        _oMsg.textBaseline = "middle";
        _oMsg.lineWidth = oSpriteBg.width - 100;
        _oContainer.addChild(_oMsg);
        */
        
        
        var iWidth = oSpriteBg.width -100;
        var iHeight = 200;
        var iX = CANVAS_WIDTH / 2;
        var iY = CANVAS_HEIGHT_HALF - 50;
        var oRect = new createjs.Rectangle( iX- iWidth/2, iY-iHeight/2, iWidth, iHeight);
        _oMsg = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    60, "center", "#ffffff", PRIMARY_FONT, 1,
                                    0,0,
                                    TEXT_ARE_SURE,
                                    true, true, true,
                                    false
                                );
        

        _oButYes = new CGfxButton(CANVAS_WIDTH / 2 + 180, CANVAS_HEIGHT * 0.5 + 100, s_oSpriteLibrary.getSprite('but_yes'), _oContainer);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);

        _oButNo = new CGfxButton(CANVAS_WIDTH / 2 - 180, CANVAS_HEIGHT * 0.5 + 100, s_oSpriteLibrary.getSprite('but_no'), _oContainer);
        _oButNo.addEventListener(ON_MOUSE_UP, this._onButNo, this);
    };
    
    this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };
    
    this.show = function (szMsg) {
        _oMsg.refreshText( szMsg );
        
        _oContainer.alpha = 0;
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer).to({alpha: 1}, 300, createjs.Ease.quartOut)//.call(function(){s_oMain.stopUpdateNoBlock();});
    };
    
    this.hide = function(){
        //s_oMain.startUpdateNoBlock();
        createjs.Tween.get(_oContainer).to({alpha: 0}, 500, createjs.Ease.quartOut).call(function(){_oContainer.visible = false;});
    };

    this.unload = function () {
        _oButNo.unload();
        _oButYes.unload();
    };

    this._onButYes = function () {
        _oThis.hide();
        
        if (_aCbCompleted[ON_BUT_YES_DOWN]) {
            _aCbCompleted[ON_BUT_YES_DOWN].call(_aCbOwner[ON_BUT_YES_DOWN]);
        }
    };

    this._onButNo = function () {
        
        _oThis.hide();
    };

    _oParentContainer = oParentContainer;

    this._init();
}