function COfflineMenu(){
    var _iStartY;
    var _oListener;
    var _oButHome;
    var _oFade;
    var _oPanelContainer;
    var _oContainer;
    
    this._init = function(){

        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 1;
        _oListener =_oFade.on("click", function () {});
        _oContainer.addChild(_oFade);
        
        _oPanelContainer = new createjs.Container();   
        _oContainer.addChild(_oPanelContainer);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box');
        var oBg = createBitmap(oSpriteBg);
        oBg.regX = oSpriteBg.width * 0.5;
        oBg.regY = oSpriteBg.height * 0.5;
        _oPanelContainer.addChild(oBg);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = _iStartY = CANVAS_HEIGHT/2;    

        
        var iWidth = oSpriteBg.width -100;
        var iHeight = 300;
        var oRect = new createjs.Rectangle( - iWidth/2, -80-iHeight/2, iWidth, iHeight);
        var oMsg = new CTLText(   _oPanelContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    50, "center", "#ffffff", PRIMARY_FONT, 1,
                                    0,0,
                                    TEXT_NETWORK_OFFLINE +"\n\n"+TEXT_RETURN_TO_HOME,
                                    true, true, true,
                                    false
                                );
       

        _oButHome = new CGfxButton(0, 160, s_oSpriteLibrary.getSprite('but_home'), _oPanelContainer);
        _oButHome.addEventListener(ON_MOUSE_UP, this._onHome, this);
        
        //createjs.Tween.get(_oPanelContainer).to({y: CANVAS_HEIGHT/2}, 1000, createjs.Ease.cubicOut);
        
        
        
        /*
        this._oGameOver.show(this._iCurTurn,this._aPlayerNames[this._iCurTurn],this._aPlayerNames,this._aShotsPerPlayer,this._aPlayerScore);
        this._oGameOver.changeMessage(TEXT_NETWORK_OFFLINE);
        this._oGameOver.setExplMessage(TEXT_RETURN_TO_HOME);
        this._oGameOver.centerHomeButton();
        this._oGameOver.hideRestartButton();


        this._oMoveTimeController.stopTimer();

        this._oAlertText.hide();

        if(this._iPlayerLeft !== null){
            this.onOpponentRefuseRematch();
        }
        */

    };
    
    this.unload = function(){
        _oButHome.unload();
        _oFade.off("click",_oListener);
        
        s_oStage.removeChild(_oContainer);
    };
    
    this._onHome = function(){
        stopSound("crowd");
        if(!isPlaying("soundtrack")){
            playSound("soundtrack", SOUNDTRACK_GENERAL_VOLUME, true);
        }
        
        this.unload();
        s_oMain.gotoMenu();
    };
    
    this._init();
    
}


