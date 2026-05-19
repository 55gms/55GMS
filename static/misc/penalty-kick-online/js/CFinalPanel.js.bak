function CFinalPanel(iLevel,oParentContainer){
    var _aCbCompleted;
    var _aCbOwner;
    
    var _iEventToLaunch;
    
    var _oListener;
    var _oButNext;
    var _oButPlayAgain;
    var _oButHome;
    var _oResultText;
    var _oTextWinLose;
    var _oFlagPlayer;
    var _oFlagOpponent;
    var _oMsg;
    var _oLeaveMsg;
    var _oMsgAgain;
    
    var _oFade;
    var _oContainer;
    var _oSummaryPanel;
    var _oControlPanelContainer;
    var _oParentContainer = oParentContainer;
    
    var _oThis = this;
    
    
    this._init = function(iLevel){
        _aCbCompleted = new Array();
        _aCbOwner = new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oListener = _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.5;
        _oFade.on("click", function () {});
        _oContainer.addChild(_oFade);
        
        _oSummaryPanel = new CSummaryPanel(CANVAS_WIDTH/2+296, CANVAS_HEIGHT/2, _oContainer);
        
        _oControlPanelContainer = new createjs.Container();
        _oControlPanelContainer.x = CANVAS_WIDTH/2-190;
        _oControlPanelContainer.y = CANVAS_HEIGHT/2;
        _oContainer.addChild(_oControlPanelContainer);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("end_panel");
        var oBg = createBitmap(oSpriteBg);
        oBg.regX = oSpriteBg.width/2;
        oBg.regY = oSpriteBg.height/2;
        _oControlPanelContainer.addChild(oBg);

        var iWidth = oSpriteBg.width-40;
        var iHeight = 130;
        var iTextX = 0;
        var iTextY = -170;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        _oTextWinLose = new CTLText(     _oControlPanelContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    130, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    TEXT_WIN,
                                    true, true, false,
                                    false
                                );  
                       
        var iWidth = 130;
        var iHeight = 80;
        var iTextX = 0;
        var iTextY = -30;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        _oResultText = new CTLText(     _oControlPanelContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    80, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    "YOU 3-2 CPU",
                                    true, true, false,
                                    false
                                );  
       
        var oSpriteFlag = s_oSpriteLibrary.getSprite("flag_"+TEAM_LABEL[s_iTeamSelected]);
        _oFlagPlayer = createBitmap(oSpriteFlag);
        _oFlagPlayer.x = -120;
        _oFlagPlayer.y = _oResultText.getY()+40;
        _oFlagPlayer.regX = oSpriteFlag.width/2;
        _oFlagPlayer.regY = oSpriteFlag.height/2;
        _oControlPanelContainer.addChild(_oFlagPlayer);

        oSpriteFlag = s_oSpriteLibrary.getSprite("flag_"+TEAM_LABEL[s_aMatches[iLevel-1]]);
        _oFlagOpponent = createBitmap(oSpriteFlag);
        _oFlagOpponent.x = 120;
        _oFlagOpponent.y = _oResultText.getY()+40;
        _oFlagOpponent.regX = oSpriteFlag.width/2;
        _oFlagOpponent.regY = oSpriteFlag.height/2;
        _oControlPanelContainer.addChild(_oFlagOpponent);
        
        var iWidth = oSpriteBg.width-40;
        var iHeight = 60;
        var iTextX = 0;
        var iTextY = 180;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        _oMsg = new CTLText(     _oControlPanelContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    58, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    " ",
                                    true, true, false,
                                    false
                                );  

        var iWidth = 150;
        var iHeight = 100;
        var iTextX = 90;
        var iTextY = 180;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        _oLeaveMsg = new CTLText(     _oControlPanelContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    40, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    TEXT_OPPONENT_LEFT,
                                    true, true, true,
                                    false
                                );  
        

        var iWidth = oSpriteBg.width-40;
        var iHeight = 40;
        var iTextX = 0;
        var iTextY = 76;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        _oMsgAgain = new CTLText(     _oControlPanelContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    40, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    TEXT_OPPONENT_WANT_TO_PLAY_AGAIN,
                                    true, true, false,
                                    false
                                );  

        _oButHome = new CGfxButton(-130,190,s_oSpriteLibrary.getSprite("but_home"),_oControlPanelContainer);
        _oButHome.addEventListener(ON_MOUSE_UP,this._onHome,this);
        
        _oButPlayAgain = new CGfxButton(0,190,s_oSpriteLibrary.getSprite("but_restart"),_oControlPanelContainer);
        _oButPlayAgain.addEventListener(ON_MOUSE_UP,this._onRetry,this);
        
        _oButNext = new CGfxButton(130,190,s_oSpriteLibrary.getSprite("but_next"),_oControlPanelContainer);
        _oButNext.addEventListener(ON_MOUSE_UP,this._onNext,this);
        
        this.showAgainMsg(false);
        this.showLeaveMsg(false);
    };
    
    this.unload = function(){
        _oButNext.unload();
        _oButHome.unload();
        _oButPlayAgain.unload();
        _oFade.off("click",_oListener);
        
        _oParentContainer.removeChild(_oContainer);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.show = function(iPlayerGoals,iOpponentGoals,iTotScore,iLevelScore,bLose,bLastLevel){
        //setVolume("soundtrack",1);
        this.setSummary(iPlayerGoals,iOpponentGoals);
        
        playSound("soundtrack", SOUNDTRACK_GENERAL_VOLUME, true);
        _oResultText.refreshText( iPlayerGoals + " - " + iOpponentGoals );
        
        var oSpriteFlag = s_oSpriteLibrary.getSprite("flag_"+TEAM_LABEL[s_aMatches[s_oGame.getCurLevel()-1]]);
        _oFlagOpponent.image = oSpriteFlag;
        
        _oMsg.refreshText(" ");
        
        if(bLose){
            playSound("goal_keeper", 1, false);
            
            _oTextWinLose.refreshText( TEXT_LOSE );
            _oButNext.setVisible(false);
            
            _oButHome.setX(-100);
            _oButPlayAgain.setX(100);
        }else{
            playSound("goal_striker", 1.25, false);
            
            _oTextWinLose.refreshText( TEXT_WIN );
            _oButNext.setVisible(true);
            if(bLastLevel){
                _oButNext.setVisible(false);
                _oButHome.setX(-80);
                _oButPlayAgain.setX(80);
            }else{
                _oButHome.setX(-130);
                _oButPlayAgain.setX(0);
                _oButNext.setX(130);
            }
        }

        _oContainer.alpha = 0;
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer).to({alpha: 1}, 500, createjs.Ease.quartOut);
        
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("save_score", iTotScore);
        $(s_oMain).trigger("share_event", iTotScore);
        
        
        //this.changeMessage(TEXT_OPPONENT_LEFT);
    };
    
    this.setSummary = function(iPlayerGoals,iOpponentGoals){
        var iTotExpGained = 0;
        
        if(iPlayerGoals>iOpponentGoals){
            var iExp = EXP_FROM_WIN;
            _oSummaryPanel.setWinField(TEXT_SUMMARY_WON, iExp);
        }else {
            var iExp = EXP_FROM_LOSS;
            _oSummaryPanel.setWinField(TEXT_SUMMARY_LOSS, iExp);
        }
        iTotExpGained += iExp;
        
        var iExp = iPlayerGoals*EXP_FROM_GOALS_MULT;
        iTotExpGained += iExp;
        _oSummaryPanel.setGoalsField(iExp);
        
        var iExp = s_oSocialManager.getShotsSavedInThisMatch()*EXP_FROM_SAVED_MULT;
        iTotExpGained += iExp;
        _oSummaryPanel.setSavedField(iExp);
        
        if(iOpponentGoals === 0){
            _oSummaryPanel.setShutOutVisible(true);
            var iExp = EXP_FROM_SHUTOUT;
            iTotExpGained += iExp;
            _oSummaryPanel.setShutOutField(iExp);
        }else {
            _oSummaryPanel.setShutOutVisible(false);
        }
        
        s_oSocialManager.addExp(iTotExpGained);
        
        var aTrophies = s_oSocialManager.getTrophiesGainedInThisMatch();
        if(aTrophies.length === 0){
            _oSummaryPanel.setTrophiesVisible(false);
        }else {
            _oSummaryPanel.setTrophiesVisible(true);
            
            var iTotTrophyExp = 0;
            for(var i=0; i<aTrophies.length; i++){
                var iTrophyIndex = aTrophies[i];
                iTotTrophyExp += ACHIEVEMENT_EXP[iTrophyIndex]
            }
            
            iTotExpGained += iTotTrophyExp;
            
            _oSummaryPanel.setTrophiesField(iTotTrophyExp);
        }
        
        ///WE HAVE ALREADY UPDATED EXP
        var iCurExp = s_iCurExp - iTotExpGained;
        var iTotalNextExp = iCurExp + iTotExpGained;
        
        _oSummaryPanel.animateXPGain(iCurExp, iTotalNextExp);        
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({alpha: 0}, 500, createjs.Ease.quartOut).call(function(){
                                                                                _oContainer.visible = false;
                                                                            });
    };
    
    this.hideLevelScore = function(){
        //_oLevelScoreText.visible = false;
    };
    
    this.changeMessage = function(szMsg){
        _oMsg.refreshText(szMsg);
    };
    
    this.showLeaveMsg = function(bVal){
        _oLeaveMsg.setVisible( bVal );
    };
    
    this.showAgainMsg = function(bVal){
        _oMsgAgain.setVisible( bVal );
    };
    
    this.showRestart = function(bVal){
        _oButPlayAgain.setVisible(bVal);
    };
    
    this.hideButtons = function(){
        _oButPlayAgain.setVisible(false);
        _oButHome.setVisible(false);
    };
    
    this.showButtons = function(){
        _oButHome.setX(-100);
        _oButPlayAgain.setX(100);
        
        _oButPlayAgain.setVisible(true);
        _oButHome.setVisible(true);
    };

    this.centerHomeButton = function(){
        _oButPlayAgain.setVisible(false);
        _oButHome.setX(0);
    };

    this._onNext = function(){
        _iEventToLaunch = ON_NEXT;
        if(_aCbCompleted[_iEventToLaunch]){
            _aCbCompleted[_iEventToLaunch].call(_aCbOwner[_iEventToLaunch]);
        }
    };
    
    this._onRetry = function(){
        _iEventToLaunch = ON_RESTART;
        if(_aCbCompleted[_iEventToLaunch]){
            _aCbCompleted[_iEventToLaunch].call(_aCbOwner[_iEventToLaunch]);
        }
    };

    this._onHome = function(){
        _iEventToLaunch = ON_BACK_MENU;
        if(_aCbCompleted[_iEventToLaunch]){
            _aCbCompleted[_iEventToLaunch].call(_aCbOwner[_iEventToLaunch]);
        }
    };

    
    this._init(iLevel);
}