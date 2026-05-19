var CGameSingleWithBot = function(oData, iLevel){

    CGameSingle.call(this, oData, iLevel);

    this._bUserAStart;

};

CGameSingleWithBot.prototype = Object.create(CGameSingle.prototype);

CGameSingleWithBot.prototype._startGame = function(){
    this._bUserAStart = true;
    this._iTotScore = 0;
    this._oInterface = new CInterface(this._iCurLevel,this._iTotScore,this._oContainer);
    this._oInterface.setPlayersInfo(s_oNetworkManager.getPlayerNickname(), s_oNetworkManager.getBotName());
    this._oInterface.hideFinalPanelScore();
    
    s_oGameStriker = this._oCurScenario = new CGameStrikerSingleWithBot(this._oContainerGame,this._iCurLevel);   
    
    this._oInterface.showVsPanel(s_aMatches[this._iCurLevel-1],"");
};

CGameSingleWithBot.prototype.changeScenario = function(){
    var bPlayerWins = (this._iPlayerGoals - this._iOpponentGoals) > this._iRemainingOpponentKicks;
    var bOpponentWins = (this._iOpponentGoals - this._iPlayerGoals) > this._iRemainingPlayerKicks;
    var bCanEnd = (bPlayerWins ||  bOpponentWins);
   
    this._iNumKicks++;
    
    if(bCanEnd){
        //GAME OVER
        this._aResults.push({player:this._iPlayerGoals,cpu:this._iOpponentGoals});

        var bGameOver = false;
        if( this._iPlayerGoals < this._iOpponentGoals){
            bGameOver = true;
        }

        var bLastMatch = true;

        if(!isPlaying("soundtrack")){
            playSound("soundtrack", SOUNDTRACK_GENERAL_VOLUME, true);
        }
        stopSound("crowd");

        if(bPlayerWins){
            if(this._iNumKicks-1 === NUM_KICKS){
            ///REGULAR
                this._iLevelScore = SCORE_NORMAL;
            }else if(this._iNumKicks-1 < NUM_KICKS){
                /// BONUS
                this._iLevelScore = SCORE_BONUS;
            } else {
                /// EXTRA NO BONUS
                this._iLevelScore = SCORE_NOBONUS;
            }
        }
        
        this._iTotScore += this._iLevelScore;

        $(s_oMain).trigger("end_level", this._iCurLevel);
        this._oInterface.setFinalPanelMultiplayer();
        this._oInterface.showFinalPanel( this._iPlayerGoals, this._iOpponentGoals ,this._iTotScore,this._iLevelScore,bGameOver,bLastMatch);   
        s_oGame._oInterface.showFinalButtons();

    }else{
        this._oCurScenario.unload();
        this._oCurScenario = null;
        if(s_iCurState === STRIKER_MODE){
            s_iCurState = GOALKEEPER_MODE;
            refreshSettings(s_iCurState);

            if(this._iNumKicks > NUM_KICKS){
                this._bExtraPenalty = true;
                if(BALL_FORCE_Y[this._iCurLevel] < HIT_BALL_MAX_FORCE){
                    BALL_FORCE_Y[this._iCurLevel] += 2;
                }
            }
            s_oGameKeeper = this._oCurScenario = new CGameGoalkeeperSingleWithBot(this._iCurLevel,BALL_FORCE_Y[this._iCurLevel-1],this._oContainerGame);
        }else{
            s_iCurState = STRIKER_MODE;
            refreshSettings(s_iCurState);
            if(this._iNumKicks > NUM_KICKS){
                this._bExtraPenalty = true;
            }

            s_oGameStriker = this._oCurScenario = new CGameStrikerSingleWithBot(this._oContainerGame,this._iCurLevel);
        }
        if( this._iRemainingPlayerKicks === 0 && this._iRemainingOpponentKicks === 0){
            s_oGame.setExtraPenalty();
        }
    }
};

CGameSingleWithBot.prototype.onConfirmRematch = function(){   
    $(s_oMain).trigger("show_interlevel_ad");
    
    this._oInterface.changeFinalMessage(TEXT_WAIT_OPPONENT);
    this._oInterface.hideFinalButtons();
    

    var iTime = randomFloatBetween(200, 2000);
    
    //////DECIDE IF BOT WANT REMATCH GAME. IT SETS THAT ACCEPT MORE FREQUENTLY THEN REFUSE
    var bRematchAcceptedFromBot = Math.random() > 0.33 ? true : false;
    
    //////SIMULATE THINKING
    if(bRematchAcceptedFromBot){
        if(Math.random()> 0.4){
            setTimeout(function(){
                s_oGame._rematch();
            }, iTime);
        } else {
            s_oGame._rematch();
        }
    }else {
        if(Math.random()> 0.4){
            setTimeout(function(){
                s_oGame.onBotRefuseRematch();
            }, iTime);
        } else {
            s_oGame.onBotRefuseRematch();
        }
    }
};

CGameSingleWithBot.prototype.onBotRefuseRematch = function(){ 
    this._oInterface.changeFinalMessage(TEXT_OPPONENT_LEFT);
    this._oInterface.showFinalButtons();
    this._oInterface.centerFinalHomeButton();
};

CGameSingleWithBot.prototype._rematch = function(){
    s_oGame.retryLevel();
};

CGameSingleWithBot.prototype.nextRound = function(){
    this._bUserAStart = !this._bUserAStart;
    
    this.reset();


    this._oInterface.reset(s_aMatches[this._iCurLevel-1]);
    this._oInterface.hideFinalPanel();

    this._oCurScenario.unload();
    this._oCurScenario = null;

    if(this._bUserAStart){
        s_iCurState = STRIKER_MODE;
        refreshSettings(s_iCurState);

        s_oGameStriker = this._oCurScenario = new CGameStrikerSingleWithBot(s_oGame._oContainerGame,this._iCurLevel);
    } else {
        s_iCurState = GOALKEEPER_MODE;
        refreshSettings(s_iCurState);
            
        s_oGameKeeper = this._oCurScenario = new CGameGoalkeeperSingleWithBot(this._iCurLevel,BALL_FORCE_Y[this._iCurLevel-1],this._oContainerGame);
    }    
};

CGameSingleWithBot.prototype.retryLevel = function(){
    this.nextRound();

    this._oInterface.hideFinalPanel();

    $(s_oMain).trigger("restart_level", this._iCurLevel);
};