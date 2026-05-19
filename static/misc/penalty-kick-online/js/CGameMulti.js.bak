var CGameMulti = function(oData, iLevel){

    CGameBase.call(this, oData, iLevel);
    
    this._init(iLevel);
    
    this._bUserAStart;
    this._iPlayerLeft;
};

CGameMulti.prototype = Object.create(CGameBase.prototype);

CGameMulti.prototype._init = function(iLevel){
    CGameBase.prototype._init(iLevel);
    this._startGame();
};

CGameMulti.prototype._startGame = function(){
    this._bUserAStart = true;
    this._iPlayerLeft = null;
    this._iTotScore = 0;
    
    //this._oInterface = new CInterface(this._iCurLevel,this._iTotScore,this._oContainer);
    this._oInterface.setPlayersLevels(s_oSocialManager.getLevelByExp(s_iCurExp),s_oNetworkManager.getOpponentLevel());
    this._oInterface.setPlayersInfo(s_oNetworkManager.getPlayerNickname(), s_oNetworkManager.getEnemyNickname());
    this._oInterface.hideFinalPanelScore();

    

    //console.log("Imuser:"+s_oNetworkManager.getPlayerOrderID())
    if(s_oNetworkManager.isUserA()){
        s_oGameStriker = this._oCurScenario = new CGameStrikerMulti(this._oContainerGame,this._iCurLevel,this._iPlayerLeft);   
    }else {
        s_iCurState = GOALKEEPER_MODE;
        refreshSettings(s_iCurState);

        if(this._iNumKicks > NUM_KICKS){
            this._bExtraPenalty = true;
            if(BALL_FORCE_Y[this._iCurLevel] < HIT_BALL_MAX_FORCE){
                BALL_FORCE_Y[this._iCurLevel] += 2;
            }
        }
        s_oGameKeeper = this._oCurScenario = new CGameGoalkeeperMulti(this._iCurLevel,BALL_FORCE_Y[this._iCurLevel-1],this._oContainerGame,this._iPlayerLeft);
    }
    
    this._oQuizPanel.addEventListener(ON_ANSWER, this._onAnswer, this);
    this._oQuizPanel.addEventListener(ON_QUIZ_TIMEOUT, this._onQuizTimeout, this);

    this._oInterface.showVsPanel(s_aMatches[this._iCurLevel-1],"");
    
    //s_oNetworkManager.addEventListener(ON_DISCONNECTION, this.playerDisconnectedFromGame);
    
    s_oNetworkManager.addEventListener(ON_STATUS_OFFLINE, this._onConnectionCrashed, this);
    //s_oNetworkManager.addEventListener(ON_PLAYER_TIMEOUT_FROM_LAST_MESSAGE, this.opponentTimeOut, this);

    this.refreshPos();
};

CGameMulti.prototype.onBeginShot = function () {
    this._oCurScenario.startCountDown();
    
    var bMatchPoint = s_oGame.checkMatchPoint();
    if(bMatchPoint){
        s_oInterface.showMatchPointText(TEXT_MATCHPOINT);
    }
};

CGameMulti.prototype.refreshPos = function () {
    this._oCurScenario.refreshPos();
};

CGameMulti.prototype.changeScenario = function(){
    this._bBonusShot = false;
    console.log("this._bBonusShot:"+this._bBonusShot);

    this.tryIncreaseStage();
    
    var bPlayerWins = this.checkPlayerWins();
    var bOpponentWins = this.checkOpponentWins();
    var bCanEnd = (bPlayerWins ||  bOpponentWins);
   
    this._iNumKicks++;

    if(bCanEnd){
        //GAME OVER
        this._aResults.push({player:this._iPlayerGoals,cpu:this._iOpponentGoals});

        var bGameOver = false;
        if( this._iPlayerGoals < this._iOpponentGoals){
            bGameOver = true;
        }

        s_oGame.triggerEvent(ON_MATCH_RESULT, {res: !bGameOver, playergoals: this._iPlayerGoals, opponentgoals: this._iOpponentGoals, level:0});

        var bLastMatch = true;
        

        //setVolume("soundtrack",1);
        stopSound("crowd");

        $(s_oMain).trigger("end_level", this._iCurLevel);

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

        this._oInterface.setFinalPanelMultiplayer();
        this._oInterface.showFinalPanel( this._iPlayerGoals, this._iOpponentGoals ,this._iTotScore,this._iLevelScore,bGameOver,bLastMatch);   
        this._oInterface.showFinalButtons();

        var bWinnerUserA = false;
        if(s_oNetworkManager.isUserA()){
            if(!bGameOver){
                bWinnerUserA = true;
            }
        } else {
            if(bGameOver){
                bWinnerUserA = true;
            }
        }
        var iLevel = s_oSocialManager.getLevelByExp(s_iCurExp);
        s_oNetworkManager.sendMsg(MSG_UPDATE_LEVEL, iLevel.toString());
        s_oNetworkManager.sendMsg(MSG_END_MATCH, bWinnerUserA);

        if(this._iPlayerLeft !== null){
            this.onOpponentRefuseRematch();
        }

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

            s_oGameKeeper = this._oCurScenario = new CGameGoalkeeperMulti(this._iCurLevel,BALL_FORCE_Y[this._iCurLevel-1],this._oContainerGame,this._iPlayerLeft);
        }else{
            s_iCurState = STRIKER_MODE;
            refreshSettings(s_iCurState);
            if(this._iNumKicks > NUM_KICKS){
                this._bExtraPenalty = true;
            }

            s_oGameStriker = this._oCurScenario = new CGameStrikerMulti(this._oContainerGame,this._iCurLevel,this._iPlayerLeft);
        }

        if( this._iRemainingPlayerKicks === 0 && this._iRemainingOpponentKicks === 0){
            this.setExtraPenalty();
        }
        
        this.onBeginShot();
        this._oCurScenario.refreshPos();
    }
};

CGameMulti.prototype.nextRound = function(){
    this._bUserAStart = !this._bUserAStart;
    
    this.reset();


    this._oInterface.reset(s_aMatches[this._iCurLevel-1]);
    this._oInterface.hideFinalPanel();
    console.log("MAQUI:"+s_oNetworkManager.getOpponentLevel())
    this._oInterface.setPlayersLevels(s_oSocialManager.getLevelByExp(s_iCurExp),s_oNetworkManager.getOpponentLevel());

    this._oResultPanel.reset();

    this._oCurScenario.unload();
    this._oCurScenario = null;

    if(s_oNetworkManager.isUserA()){
        if(this._bUserAStart){
            s_oGameStriker = this._oCurScenario = new CGameStrikerMulti(this._oContainerGame,this._iCurLevel,this._iPlayerLeft);   
        }else {
            s_iCurState = GOALKEEPER_MODE;
            refreshSettings(s_iCurState);

            s_oGameKeeper = this._oCurScenario = new CGameGoalkeeperMulti(this._iCurLevel,BALL_FORCE_Y[this._iCurLevel-1],this._oContainerGame,this._iPlayerLeft);
        }
    }else {
        if(!this._bUserAStart){
            s_oGameStriker = this._oCurScenario = new CGameStrikerMulti(this._oContainerGame,this._iCurLevel,this._iPlayerLeft);   
        }else {
            s_iCurState = GOALKEEPER_MODE;
            refreshSettings(s_iCurState);

            s_oGameKeeper = this._oCurScenario = new CGameGoalkeeperMulti(this._iCurLevel,BALL_FORCE_Y[this._iCurLevel-1],this._oContainerGame,this._iPlayerLeft);
        }
    }
    
    this.onBeginShot();
    this._oCurScenario.refreshPos();
    
};

CGameMulti.prototype.setBonusShotScenario = function(){
    this._oCurScenario.unload();
    this._oCurScenario = null;
    
    s_iCurState = STRIKER_MODE;
    refreshSettings(s_iCurState);
    if(this._iNumKicks > NUM_KICKS){
        this._bExtraPenalty = true;
    }

    s_oGameStriker = this._oCurScenario = new CGameStrikerMulti(this._oContainerGame,this._iCurLevel,this._iPlayerLeft);
    s_oGameStriker.setBonusShot();
    
    this.onBeginShot();
    this._oCurScenario.refreshPos();
};

CGameMulti.prototype.setBonusKeeperScenario = function(){
    this._oCurScenario.unload();
    this._oCurScenario = null;
    
    s_iCurState = GOALKEEPER_MODE;
    refreshSettings(s_iCurState);

    if(this._iNumKicks > NUM_KICKS){
        this._bExtraPenalty = true;
        if(BALL_FORCE_Y[this._iCurLevel] < HIT_BALL_MAX_FORCE){
            BALL_FORCE_Y[this._iCurLevel] += 2;
        }
    }

    s_oGameKeeper = this._oCurScenario = new CGameGoalkeeperMulti(this._iCurLevel,BALL_FORCE_Y[this._iCurLevel-1],this._oContainerGame,this._iPlayerLeft);
    s_oGameKeeper.setBonusShot();
    
    this.onBeginShot();
    this._oCurScenario.refreshPos();
};

///////////////////////////////// QUIZ
CGameMulti.prototype._onAnswer = function(iAnswerIndex){
    //trace("iAnswerIndex:"+iAnswerIndex);
    this._oCurScenario.setShootState(SHOOT_STATE_CHANGING_TURN);

    var oJSONData = {};
    oJSONData = {answerindex: iAnswerIndex};
    s_oNetworkManager.sendMsg(MSG_SEND_TO_SERVER_ANSWER_CHOSEN, JSON.stringify(oJSONData));
};

CGameMulti.prototype.chooseQuizAnswer = function(iAnswerIndex){
    this._oQuizPanel.setAnswer(iAnswerIndex);
    
    this._oCurScenario.setShootState(SHOOT_STATE_CHANGING_TURN);
};

CGameMulti.prototype._onQuizTimeout = function(){
    
    var oJSONData = {};
    oJSONData = {answerindex: -1};
    s_oNetworkManager.sendMsg(MSG_SEND_TO_SERVER_ANSWER_CHOSEN, JSON.stringify(oJSONData));
};

/*
CGameMulti.prototype.setQuizTimeoutPanel = function(){
    console.log("setQuizTimeoutPanel");

};


CGameMulti.prototype._onWrongAnswer = function(){
    console.log("_onWrongAnswer");
    playSound("ball_saved", 1, false);
    this._oQuizPanel.changeMessage(TEXT_WRONG_ANSWER, "#F00");
    //this._oQuizPanel.setExplMessage(TEXT_LOSE_DART);

    //this._aWrongAnswerInLastTurn[this._iCurTurn] = !bCorrect;
    //this._resetShot(!bCorrect);

    if(s_iCurState === STRIKER_MODE){
        this._iRemainingPlayerKicks--;
        if(this._iRemainingPlayerKicks < 0){
            this._iRemainingPlayerKicks = 0;
        }
    }else {
        this._iRemainingOpponentKicks--;
        if(this._iRemainingOpponentKicks < 0){
            this._iRemainingOpponentKicks = 0;
        }
    }

    var oParent = this;
    setTimeout(function(){
        oParent.hideResult();

        oParent.changeScenario();

    }, TIME_SHOW_ANSWER);
};


CGameMulti.prototype.onQuizEnd = function(bCorrect){
    if(bCorrect){
        playSound("goal_striker", 1, false);
        this._oQuizPanel.changeMessage(TEXT_CORRECT_ANSWER, "#68d617");

        var oParent = this;
        setTimeout(function(){
            oParent.hideResult();
            
            if(s_iCurState === STRIKER_MODE){
                oParent.setBonusShotScenario();
            }else {
                oParent.setBonusKeeperScenario();
            }

        }, TIME_SHOW_ANSWER);

    }else {
        this._onWrongAnswer();
    }
};
*/
////////////////////////////

CGameMulti.prototype.isStartingUser = function(){
    if(s_oNetworkManager.isUserA() ){
        if(this._bUserAStart){
            return true;
        }else{
            return false;
        }
    }else {
        if(this._bUserAStart){
            return false;
        }else{
            return true;
        }
    }
};

CGameMulti.prototype.retryLevel = function(){
    this.nextRound();
    
    this._oInterface.hideFinalPanel();

    $(s_oMain).trigger("restart_level", this._iCurLevel);
};

CGameMulti.prototype.onExit = function () {
    this.unload();

    $(s_oMain).trigger("show_interlevel_ad");
    $(s_oMain).trigger("end_session");
    if(!isPlaying("soundtrack")){
        playSound("soundtrack", SOUNDTRACK_GENERAL_VOLUME, true);
    }
    stopSound("crowd");
    s_oMain.gotoMenu();
    
    s_oNetworkManager.disconnect();
};

CGameMulti.prototype.showRematchQuestion = function(){ 

};

CGameMulti.prototype.notifyAcceptedRematch = function(){ 
    this._oInterface.showAgainMsg(true);
};

CGameMulti.prototype.onConfirmRematch = function(){ 
    $(s_oMain).trigger("show_interlevel_ad");
    
    this._oInterface.changeFinalMessage(TEXT_WAIT_OPPONENT);
    this._oInterface.hideFinalButtons();
    
    s_oNetworkManager.sendMsg(MSG_ACCEPT_REMATCH, "");
};

CGameMulti.prototype.onOpponentRefuseRematch = function(){ 
    
    this._oInterface.changeFinalMessage("");
    this._oInterface.showFinalButtons();
    this._oInterface.showFinalRestartBut(false);
    //this._oInterface.centerFinalHomeButton();
    this._oInterface.showLeaveMsg(true);
    
};

CGameMulti.prototype.onOpponentAcceptRematch = function(){     
    this._oInterface.showAgainMsg(false);
    
    this.retryLevel();
};
/*
CGameMulti.prototype.playerDisconnectedFromGame = function(){

    s_oGame._oInterface.setFinalPanelMultiplayer();
    s_oGame._oInterface.showFinalPanel( this._iPlayerGoals + "-" + this._iOpponentGoals ,this._iTotScore,this._iLevelScore,false,true);  
    s_oGame._oInterface.changeFinalMessage(TEXT_OPPONENT_LEFT);
    s_oGame._oInterface.showFinalButtons();
    s_oGame._oInterface.centerFinalHomeButton();

    
    s_oNetworkManager.sendMsg(MSG_DISCONNECTION, "");
};
*/

CGameMulti.prototype.opponentTimeOut = function(){
    s_oNetworkManager.disconnect();
    s_oNetworkManager.setReceiveMsg(false);
    s_oGame.opponentLeftTheGame();
};

CGameMulti.prototype.opponentLeftTheGame = function(){
    console.log("opponentLeftTheGame")
    /*
    this._oInterface.setFinalPanelMultiplayer();
    this._oInterface.showFinalPanel( this._iPlayerGoals + "-" + this._iOpponentGoals ,this._iTotScore,this._iLevelScore,false,true);  
    this._oInterface.changeFinalMessage(TEXT_OPPONENT_LEFT);
    this._oInterface.showFinalButtons();
    this._oInterface.centerFinalHomeButton();
    
    this._oCurScenario.stopCountDown();
    */
   
    if( s_oNetworkManager.isUserA() ){
        this._iPlayerLeft = 1;
    }else {
        this._iPlayerLeft = 0;
    }
   
    /*
    if(s_iCurState === STRIKER_MODE){
        s_oGameStriker.checkCPUMoves(this._iPlayerLeft);
    }else {
        
    }
    */
   
    this._oCurScenario.checkCPUMoves(this._iPlayerLeft);
};

CGameMulti.prototype._onConnectionCrashed = function(){
    if(this._iPlayerLeft !== null){
        this.onOpponentRefuseRematch();
    }
    
    s_oNetworkManager.disconnect();
    
    this.unload();
    
    s_oMain.gotoOfflineMenu();
    
};