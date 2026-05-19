function CResultPanel(iLevel,oParentContainer){
    var _oListener;
    
    var _oFade;
    var _oResultText;
    var _oScoreText;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    var _oFlagPlayer;
    var _oFlagOpponent;
    
    this._init = function(iLevel){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oContainer.x = CANVAS_WIDTH_HALF;
        _oContainer.y = CANVAS_HEIGHT_HALF;
        _oContainer.regX = CANVAS_WIDTH_HALF;
        _oContainer.regY = CANVAS_HEIGHT_HALF;
        _oParentContainer.addChild(_oContainer);
        
        /*
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.01;
        _oListener = _oFade.on("click", function(){});
        _oContainer.addChild(_oFade);
        */
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box_narrow");
        var oMsgBox = createBitmap(oSpriteBg);
        oMsgBox.x = CANVAS_WIDTH_HALF;
        oMsgBox.y = CANVAS_HEIGHT_HALF;
        oMsgBox.regX = oSpriteBg.width/2;
        oMsgBox.regY = oSpriteBg.height/2;
        _oContainer.addChild(oMsgBox);
        
        _oResultText = new createjs.Text(TEXT_GOAL, "70px " + PRIMARY_FONT, "#fff");
        _oResultText.x = CANVAS_WIDTH_HALF;
        _oResultText.y = CANVAS_HEIGHT_HALF - 30;
        _oResultText.textAlign = "center";
        _oResultText.textBaseline = "alphabetic";
        _oContainer.addChild(_oResultText);
        
        var iOffset = 60;
        
        var oSpriteFlag = s_oSpriteLibrary.getSprite("flag_"+TEAM_LABEL[s_iTeamSelected]);
        _oFlagPlayer = createBitmap(oSpriteFlag);
        _oFlagPlayer.x = CANVAS_WIDTH_HALF - 140;
        _oFlagPlayer.y = _oResultText.y+iOffset;
        _oFlagPlayer.regX = oSpriteFlag.width/2;
        _oFlagPlayer.regY = oSpriteFlag.height/2;
        _oContainer.addChild(_oFlagPlayer);
        
        oSpriteFlag = s_oSpriteLibrary.getSprite("flag_"+TEAM_LABEL[s_aMatches[iLevel-1]]);
        _oFlagOpponent = createBitmap(oSpriteFlag);
        _oFlagOpponent.x = CANVAS_WIDTH_HALF + 140;
        _oFlagOpponent.y = _oResultText.y+iOffset;
        _oFlagOpponent.regX = oSpriteFlag.width/2;
        _oFlagOpponent.regY = oSpriteFlag.height/2;
        _oContainer.addChild(_oFlagOpponent);
        
        _oScoreText = new createjs.Text("3-3", "70px " + PRIMARY_FONT, "#fff");
        _oScoreText.x = CANVAS_WIDTH_HALF;
        _oScoreText.y = _oResultText.y+iOffset;
        _oScoreText.textAlign = "center";
        _oScoreText.textBaseline = "middle";
        _oContainer.addChild(_oScoreText);
        
        
        
    };
    
    this.show = function(szResult,iPlayerGoals,iCpuGoals){
        _oResultText.text = szResult;
        _oScoreText.text = iPlayerGoals +"-"+ iCpuGoals;
        
        _oContainer.alpha = 0;
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer).to({alpha: 1}, 500, createjs.Ease.quartOut);
        
        /*
        var oParent = this;
        setTimeout(function () {
            oParent.hide();
        }, 2500);
         * 
         */
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({alpha: 0}, 500, createjs.Ease.quartOut).call(function(){
            _oContainer.visible = false;/*s_oGame.changeScenario();*/
            _oContainer.y = CANVAS_HEIGHT_HALF;
        });
    };
    
    this.update = function(iLevel){
        var oSpriteFlag = s_oSpriteLibrary.getSprite("flag_"+TEAM_LABEL[s_aMatches[iLevel-1]]);
        
        trace(iLevel);
        trace(TEAM_LABEL[s_aMatches[iLevel-1]])
        _oFlagOpponent.image = oSpriteFlag;
    };
    
    this.reset = function(){
        _oScoreText.text = 0 +"-"+ 0;
    };
    
    this.animUp = function(){
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box_narrow");
        var iY = CANVAS_HEIGHT_HALF - oSpriteBg.height/2;
        createjs.Tween.get(_oContainer).to({y: iY}, 500, createjs.Ease.quartOut);
    };
    
    this._init(iLevel);
}