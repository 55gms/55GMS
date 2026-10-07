function CCreditsPanel(){
    
    var _oBg;
    var _oButLogo;
    var _oButExit;
    var _oMsgText;
    var _oFade;
    var _oListener;
    var _oHitArea;
    
    var _oLink;
    
    var _pStartPosExit;
    
    var _oContainer;
    
    this._init = function(){
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        s_oStage.addChild(_oFade);
        new createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        var oSpriteMsgBox = s_oSpriteLibrary.getSprite('msg_box');
        _oContainer = new createjs.Container();
        _oContainer.y = CANVAS_HEIGHT + oSpriteMsgBox.height/2; 
        s_oStage.addChild(_oContainer);

        
        _oBg = createBitmap(oSpriteMsgBox);
        _oBg.regX = oSpriteMsgBox.width/2;
        _oBg.regY = oSpriteMsgBox.height/2;
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        _oContainer.addChild(_oBg);
        
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        //_oListener = _oHitArea.on("click", this._onLogoButRelease);
        _oContainer.addChild(_oHitArea);
                
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: 1000 , y: 610};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);

        _oMsgText = new createjs.Text(TEXT_CREDITS_DEVELOPED, "80px " + PRIMARY_FONT, "#402604");
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
	_oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = CANVAS_HEIGHT/2 - 100;
	_oContainer.addChild(_oMsgText);
		
        oSprite = s_oSpriteLibrary.getSprite('logo_ctl');
        _oButLogo = createBitmap(oSprite);
        _oButLogo.regX = oSprite.width/2;
        _oButLogo.regY = oSprite.height/2;
        _oButLogo.x = CANVAS_WIDTH/2;
        _oButLogo.y = CANVAS_HEIGHT/2;
        _oContainer.addChild(_oButLogo);

        _oLink = new createjs.Text("www.codethislab.com", "68px " + PRIMARY_FONT, "#402604");
        _oLink.textAlign = "center";
        _oLink.textBaseline = "alphabetic";
	_oLink.x = CANVAS_WIDTH/2;
        _oLink.y = CANVAS_HEIGHT/2 + 130;
        _oContainer.addChild(_oLink);
        
	new createjs.Tween.get(_oContainer).to({y:0},1000, createjs.Ease.backOut);	
    };
    
    this.unload = function(){
        _oHitArea.off("click", _oListener);
        
        _oButExit.unload(); 
        _oButExit = null;
        
        s_oStage.removeChild(_oFade);
        s_oStage.removeChild(_oContainer);
    };
    
    this._onLogoButRelease = function(){
        window.open("http://www.codethislab.com/index.php?&l=en","_blank");
    };
    
    this._init();
    
    
};


