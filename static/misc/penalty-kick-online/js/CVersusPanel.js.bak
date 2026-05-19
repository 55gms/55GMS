function CVersusPanel(oParentContainer){
    var _oListener;
    
    var _oFade;
    var _oFlagPlayer;
    var _oFlagOpponent;
    var _oVsText;
    var _oMatchText;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    var _oThis = this;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.5;
        _oListener = _oFade.on("click", function () {});
        _oContainer.addChild(_oFade);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box_small");
        var oBg = createBitmap(oSpriteBg);
        oBg.x = CANVAS_WIDTH_HALF;
        oBg.y = CANVAS_HEIGHT_HALF;
        oBg.regX = oSpriteBg.width/2;
        oBg.regY = oSpriteBg.height/2;
        _oContainer.addChild(oBg);
        
        
        var oSprite = s_oSpriteLibrary.getSprite("flag_"+s_iTeamSelected);
        _oFlagPlayer = createBitmap(oSprite);
        _oFlagPlayer.y = CANVAS_HEIGHT_HALF+6;
        _oContainer.addChild(_oFlagPlayer);
        
        oSprite = s_oSpriteLibrary.getSprite("flag_0");
        _oFlagOpponent = createBitmap(oSprite);
        _oFlagOpponent.y = CANVAS_HEIGHT_HALF+6;
        _oContainer.addChild(_oFlagOpponent);
        
        /*
        _oVsText = new createjs.Text(TEXT_VS, "82px " + PRIMARY_FONT, "#fff");
        _oVsText.x = CANVAS_WIDTH_HALF;
        _oVsText.y = CANVAS_HEIGHT_HALF+40;
        _oVsText.textAlign = "center";
        _oVsText.textBaseline = "middle";
        _oContainer.addChild(_oVsText);
        */
        
        var iWidth = 140;
        var iHeight = 100;
        var iX = CANVAS_WIDTH / 2;
        var iY = CANVAS_HEIGHT_HALF +46;
        var oRect = new createjs.Rectangle( iX- iWidth/2, iY-iHeight/2, iWidth, iHeight);
        _oVsText = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    80, "center", "#ffffff", PRIMARY_FONT, 1,
                                    0,0,
                                    TEXT_VS,
                                    true, true, true,
                                    false
                                );
       
        _oMatchText = new createjs.Text(TEXT_MATCH, "82px " + PRIMARY_FONT, "#fff");
        _oMatchText.x = CANVAS_WIDTH_HALF;
        _oMatchText.y = 230;
        _oMatchText.textAlign = "center";
        _oMatchText.textBaseline = "alphabetic";
        _oContainer.addChild(_oMatchText);
    };
    
    this.unload = function(){
        _oFade.off("click",_oListener);
    };
    
    this.show = function(iOpponent,iLevel){
        _oMatchText.text = TEXT_MATCH + " " + iLevel;
        _oFlagOpponent.image = s_oSpriteLibrary.getSprite("flag_"+iOpponent);
        
        _oFlagPlayer.x = -200;
        _oFlagOpponent.x = CANVAS_WIDTH+200;
        
        //_oVsText.scaleX = _oVsText.scaleY = 3;
        _oVsText.setScale(3);
        _oVsText.setAlpha(0);
        
        _oContainer.alpha = 0;
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer).to({alpha: 1}, 500, createjs.Ease.cubicOut).call(function(){
            _oThis.playAnims();
        });
    };
    
    this.hide = function(){
        s_oInterface.onExitVersusPanel();
        
        createjs.Tween.get(_oContainer).to({alpha: 0}, 500, createjs.Ease.quartOut).call(function(){
                                                                                _oContainer.visible = false;
                                                                                
                                                                            });
    };
    
    this.playAnims = function(){
        var iTime = 300;
        createjs.Tween.get(_oFlagPlayer).to({x: CANVAS_WIDTH_HALF - 176}, iTime, createjs.Ease.cubicOut);
        createjs.Tween.get(_oFlagOpponent).to({x: CANVAS_WIDTH_HALF + 80}, iTime, createjs.Ease.cubicOut);
        createjs.Tween.get(_oVsText.getText()).wait(iTime).to({scaleX:1,scaleY:1,alpha:1}, 200, createjs.Ease.cubicOut).call(function(){
                                                                                                                setTimeout(function(){
                                                                                                                    _oThis.hide();
                                                                                                                },2500);
                                                                        });
    };
    
    this._init();
}