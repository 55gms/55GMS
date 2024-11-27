var CGameBase = function(oData){
    this._bExtraPenalty;
    
    this._aCbCompleted;
    this._aCbOwner;
    
    this._iPlayerGoals;
    this._iOpponentGoals;
    this._iNumKicks;
    this._iCurLevel;
    this._iLevelScore;
    this._iTotScore;
    this._iMultiplier;
    this._iRemainingPlayerKicks;
    this._iRemainingOpponentKicks;
    this._aHistoryPlayer;
    this._aHistoryOpponent;
    this._aResults;
    
    this._oInterface;
    this._oCurScenario;
    this._oContainerGame;
    this._oContainer;
    
    this._oResultPanel;
    this._oQuizPanel;
    this._oQuestionGenerator;
    this._iCurStage;
    this._bBotLastAnswerWrong;
    this._szCurQuizOperation;
    this._iIDTimeout;
    
    this._bBonusShot;
};

CGameBase.prototype._init = function(iLevel){
    $(s_oMain).trigger("start_session");
    $(s_oMain).trigger("start_level", iLevel);

    this._aCbCompleted = new Array();
    this._aCbOwner = new Array();

    this._iCurLevel = iLevel;

    this.reset();

    this._aResults = new Array();

    if(s_bMobile){
        for (var i = 0; i < BALL_FORCE_Y.length; i++) {
            BALL_FORCE_Y[i] *= BALL_VELOCITY_MULTIPLIER;
            BALL_FORCE_Z[i].min /= (BALL_VELOCITY_MULTIPLIER + 0.1);
            BALL_FORCE_Z[i].max *= (BALL_VELOCITY_MULTIPLIER + 0.1);
            BALL_FORCE_X[i] *= BALL_VELOCITY_MULTIPLIER;
        }
    }


    this._oContainer = new createjs.Container();
    s_oStage.addChild(this._oContainer);

    var oFade = new createjs.Shape();
    oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this._oContainer.addChild(oFade);

    this._oContainerGame = new createjs.Container();
    this._oContainer.addChild(this._oContainerGame);

    this._oContainerFG = new createjs.Container();
    s_oStage.addChild(this._oContainerFG);

    this._oInterface = new CInterface(this._iCurLevel,this._iTotScore,this._oContainer, this._oContainerFG);

    this._oQuizPanel = new CQuizPanel(this._oContainer);

    this._oResultPanel = new CResultPanel(this._iCurLevel,this._oContainer);

    this._oQuestionGenerator = new CQuestionGenerator();
    
    //this.triggerEvent(ON_MATCH_STARTS, "");
};

CGameBase.prototype.reset = function(){
    if(s_bMultiplayer || this._iCurLevel === 1){
        this._iTotScore =  0;
    } else {
        this._iTotScore =  s_oLocalStorage.getScoreTillLevel(this._iCurLevel);
    }
    
    this._bBonusShot = false;
    console.log("this._bBonusShot:"+this._bBonusShot);
    this._iCurStage = 0;
    this._bExtraPenalty = false;
    s_iCurState = STRIKER_MODE;
    this._iPlayerGoals = 0;
    this._iLevelScore = 0;
    this._iOpponentGoals = 0;
    this._iNumKicks = 1;
    this._iMultiplier = 1;
    this._iRemainingPlayerKicks = NUM_KICKS/2;
    this._iRemainingOpponentKicks = NUM_KICKS/2;
    this._aHistoryPlayer = new Array();
    this._aHistoryOpponent = new Array();
    refreshSettings(s_iCurState);
    
    s_oSocialManager.resetMatchVar();

    //setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
    stopSound("soundtrack");
    playSound("crowd",CROWD_GENERAL_VOLUME,true);
};

CGameBase.prototype.unload = function(){
    this._oInterface.unload();
    s_oStage.removeChild(this._oContainer);
    
    this._oQuizPanel.unload();
    
    clearTimeout(this._iIDTimeout);
    
    
    s_oGame = null;
    this._oCurScenario.unload();
};

CGameBase.prototype.addEventListener = function (iEvent, cbCompleted, cbOwner) {
    this._aCbCompleted[iEvent] = cbCompleted;
    this._aCbOwner[iEvent] = cbOwner;
};

CGameBase.prototype.triggerEvent = function (iEvent, oData) {
    if (this._aCbCompleted[iEvent]) {
        this._aCbCompleted[iEvent].call(this._aCbOwner[iEvent], oData);
    }
};

CGameBase.prototype.endShotPlayer = function(bGoal,bSaved,bBonusActive){
    if(bGoal){
        this._aHistoryPlayer.push(1);
        this._iPlayerGoals++;

        if(!this._bExtraPenalty){
            //this.increaseScore(GOAL_SCORED*this._iMultiplier);
            //this._increaseMultiplier();
        }
    }else{
        this._iMultiplier = 1;
        if(!this._bExtraPenalty){
            //this.increaseScore(GOAL_MISSED);
        }

        this._aHistoryPlayer.push(0);
    }

    if(bBonusActive){
        if(bGoal){
            this._oInterface.setBonusGoal(PLAYER);
        } 
    }else {
        if(!bGoal){
            this._iRemainingPlayerKicks--;
        }
        this._oInterface.refreshKicks(PLAYER, this._aHistoryPlayer);
    }
    
    this._iRemainingPlayerKicks--;
    if(this._iRemainingPlayerKicks < 0){
        this._iRemainingPlayerKicks = 0;
    }

    this._showResult(bGoal,bSaved);

    //console.log("_iRemainingPlayerKicks:"+this._iRemainingPlayerKicks + " _iPlayerGoals:"+this._iPlayerGoals);
};

CGameBase.prototype.endShotOpponent = function(bGoal,bSaved,bBonusActive){
    if(bGoal){
        this._aHistoryOpponent.push(1);
        this._iOpponentGoals++;
        this._iMultiplier = 1;
        if(!this._bExtraPenalty){
            //this.increaseScore(GOAL_SUFFERED);
        }
    }else{
        this._aHistoryOpponent.push(0);
        if(!this._bExtraPenalty){
            //this.increaseScore(GOAL_SAVED*this._iMultiplier);
            //this._increaseMultiplier();
        }
    }

    if(bBonusActive){
        if(bGoal){
            this._oInterface.setBonusGoal(OPPONENT);
        } 
    }else {
        if(!bGoal){
            this._iRemainingOpponentKicks--;
        }
        this._oInterface.refreshKicks(OPPONENT, this._aHistoryOpponent);
    }
    
    this._iRemainingOpponentKicks--;
    if(this._iRemainingOpponentKicks < 0){
        this._iRemainingOpponentKicks = 0;
    }

    //this._oInterface.refreshKicks(OPPONENT, this._aHistoryOpponent);

    this._showResult(bGoal,bSaved);
    
    //console.log("_iRemainingOpponentKicks:"+this._iRemainingOpponentKicks + " _iOpponentGoals:"+this._iOpponentGoals);
};

CGameBase.prototype._showResult = function(bGoal,bSaved){
    //SEND CORRECT RESULT TEXT
    var szResult = TEXT_MISSED;
    if(bGoal){
        szResult = TEXT_GOAL;
    }else if(bSaved){
        szResult = TEXT_SAVED;
    }

    this._oInterface.refreshScoreBoard(szResult,this._iPlayerGoals,this._iOpponentGoals);
    
    this._oResultPanel.show(szResult,this._iPlayerGoals,this._iOpponentGoals);

};

CGameBase.prototype.hideResult = function(){
    this._oQuizPanel.hide();
    this._oResultPanel.hide();
};

CGameBase.prototype.generateTheQuizFromCurOperation = function(){
    //console.log("generateTheQuizFromCurOperation");
    var oData;
    
    if(this._szCurQuizOperation){
        oData = this._oQuestionGenerator.getNewMathQuestionFromOperation(this._szCurQuizOperation);
    }else {
        oData = this.generateTheQuiz();
    }
     
    //console.log(oData);
    
    return oData;
};

CGameBase.prototype.generateTheQuiz = function(){
    //console.log("generateTheQuiz");
    var oData = this._oQuestionGenerator.getNewMathQuestion();
    this.setCurQuizOperation(oData.operation);
    //console.log(oData);
    
    return oData;
};

CGameBase.prototype.showTheQuiz = function(oData){
    var iTime = this.getQuizTime();
    this._oQuizPanel.show(oData["cypher"], oData["operation"], oData["correctanswer"], oData["answers"], iTime);

    this._oResultPanel.animUp();
    this._oQuizPanel.animDown();
};

CGameBase.prototype.cpuQuizAnswer = function(iCorrectAnswer, aAnswers, aCurScores){
    this._oQuizPanel.setSpectatorMode();
    
    var iAnswerIndex = null;
    var iCorrectIndex;
    for(var i=0; i<aAnswers.length; i++){
        if(aAnswers[i] === iCorrectAnswer){
            iCorrectIndex = i;
        }
    }
    
    //IN ORDER TO SEEMS TRUE, THE ANSWER CHOSEN WILL FOLLOW SOME BASIC RULE
    //1-LITTLE NUMBER IS EASY TO CALCULATE
    if(iCorrectAnswer < 20){
        //trace("LITTLE NUMBER");
        iAnswerIndex = iCorrectIndex;
        this._bBotLastAnswerWrong = false;
    }      
    
    //2-ZEROES OR TENS ARE EASY TO CALCULATE
    if(iAnswerIndex === null){
        var iEasyNumbersCount = 0;
        for(var i=0; i<aCurScores.length; i++){
            if(aCurScores[i]%10 === 0){
                iEasyNumbersCount++;
            }
        }
        
        if(iCorrectAnswer % 10 === 0 ){
            iEasyNumbersCount++;
        }
        
        if(iEasyNumbersCount>1){
            //trace("ZEROES OR TENS");
            iAnswerIndex = iCorrectIndex;
            this._bBotLastAnswerWrong = false;
        }
    }
    
    
    ////DECIDE IF AI SHOULD TAKE RIGHT ANSWER
    if(iAnswerIndex === null){
        if( Math.random() < 0.4 && !this._bBotLastAnswerWrong){
            ///TAKE WRONG ANSWER
            console.log("TAKE WRONG ANSWER")
            var iWrongIndex;
            do{
                iWrongIndex = Math.floor( Math.random()*aAnswers.length );
            }while(iWrongIndex === iCorrectIndex);

            iAnswerIndex = iWrongIndex;

            this._bBotLastAnswerWrong = true;

        } else {
            this._bBotLastAnswerWrong = false;
            iAnswerIndex = iCorrectIndex;
        }
    }
    

    var iTime = QUIZ_SHOW_COUNTDOWN + 1000 + Math.random()*1000;
    var oParent = this;
    this._iIDTimeout = setTimeout(function(){
        oParent._oQuizPanel.setAnswer(iAnswerIndex);
    }, iTime);

    
};

///////////////////////////////// QUIZ
/*
CGameBase.prototype._onAnswer = function(iAnswerIndex){
    this._oQuizPanel.setAnswer(iAnswerIndex);
};

CGameBase.prototype._onQuizTimeout = function(){
    this._oQuizPanel.setAnswer(-1);
};
*/

CGameBase.prototype.setCurQuizOperation = function(szCurQuizOp){
    this._szCurQuizOperation = szCurQuizOp;
};

CGameBase.prototype._onWrongAnswer = function(){
    playSound("ball_saved", 1, false);
    this._oQuizPanel.changeMessage(TEXT_WRONG_ANSWER, "#F00");
    //this._oQuizPanel.setExplMessage(TEXT_LOSE_DART);

    s_oGame.triggerEvent(ON_QUIZ_RESULT, {res: false, type:this._szCurQuizOperation, isPlayer:s_iCurState === STRIKER_MODE});

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
    this._iIDTimeout = setTimeout(function(){
        oParent.hideResult();

        oParent.changeScenario();

    }, TIME_SHOW_ANSWER);
};

CGameBase.prototype.setQuizTimeoutPanel = function(){
    //trace("quiztimeout");

    this._onWrongAnswer();
    
    this._oQuizPanel.changeMessage(TEXT_QUIZ_TIMEOUT, "#FFF");
    //this._oQuizPanel.setExplMessage(TEXT_LOSE_DART);
    
    //var bExtendTime = true;
    //this._resetShot(bExtendTime);
};

CGameBase.prototype.onQuizEnd = function(bCorrect){
    /*
    //trace("onQuizEnd, correct answer:"+bCorrect);
    if(this._iGameState === GAME_STATE_QUIZ_SECOND){
        if(parent.cmgGameEvent){
            parent.cmgGameEvent("start");
        }
    }
    */
   
    if(bCorrect){
        s_oGame.triggerEvent(ON_QUIZ_RESULT, {res: true, type:this._szCurQuizOperation, isPlayer:s_iCurState === STRIKER_MODE});
        
        playSound("goal_striker", 1, false);
        this._oQuizPanel.changeMessage(TEXT_CORRECT_ANSWER, "#68d617");

        //if(this._iGameState === GAME_STATE_QUIZ){
        //this._iGameState = GAME_STATE_QUIZ_SECOND;

        var oParent = this;
        this._iIDTimeout = setTimeout(function(){
            //oParent._prepareSecondQuizQuestion();
            //s_oGame.changeScenario();
            oParent.hideResult();
            
            
            oParent._bBonusShot = true;
            //console.log("this._bBonusShot:"+this._bBonusShot);
            
            if(s_iCurState === STRIKER_MODE){
                oParent.setBonusShotScenario();
            }else {
                oParent.setBonusKeeperScenario();
            }

        }, TIME_SHOW_ANSWER);
        /*
        }else if(this._iGameState === GAME_STATE_QUIZ_SECOND){
            this._aWrongAnswerInLastTurn[this._iCurTurn] = !bCorrect;
            this._resetShot(!bCorrect);

            this._oQuizPanel.setExplMessage(TEXT_KEEP_ALL_YOUR_DARTS);
        }
        */
    }else {
        this._onWrongAnswer();
    }
    
    //this._oResultPanel.hide();
    
};
///////////////////////////////////

CGameBase.prototype.setExtraPenalty = function(){
    this._iRemainingPlayerKicks = 2;
    this._iRemainingOpponentKicks = 2;
    this._oInterface.setExtraScore();
};

CGameBase.prototype.getCurLevel = function(){
    return this._iCurLevel;
};

CGameBase.prototype.tryIncreaseStage = function(){
    if(this._iRemainingOpponentKicks === this._iRemainingPlayerKicks){
        this._iCurStage++;
        this._szCurQuizOperation = null;
        //console.log("newstage:"+this._iCurStage);
    }
};

CGameBase.prototype.getQuizTime = function(){
    var iTimeLevel = this._iCurStage;
    if(this._iCurStage >= TIME_PER_QUIZ.length){
        iTimeLevel = TIME_PER_QUIZ.length;
    }
    //console.log(TIME_PER_QUIZ[iTimeLevel])
    return TIME_PER_QUIZ[iTimeLevel];
};

CGameBase.prototype.setQuizSpectatorMode = function(){
    this._oQuizPanel.setSpectatorMode();
};

CGameBase.prototype.checkPlayerWins = function(){
    return (this._iPlayerGoals - this._iOpponentGoals) > this._iRemainingOpponentKicks;
};

CGameBase.prototype.checkOpponentWins = function(){
    return (this._iOpponentGoals - this._iPlayerGoals) > this._iRemainingPlayerKicks;
};

CGameBase.prototype.checkMatchPoint = function(){
    var iShotsToReduce = 2;
    if(this._bBonusShot){
        iShotsToReduce = 1;
    }
    console.log("this._bBonusShot:"+this._bBonusShot);
   
    if(s_iCurState === STRIKER_MODE){
        ////if i'm the striker check if my goal win the match
        var bPlayerMatchPoint = (this._iPlayerGoals+1 - this._iOpponentGoals) > this._iRemainingOpponentKicks;
        ////if i'm the striker, the opponent win with my wrong shot.
        var bOpponentMatchPoint = (this._iOpponentGoals - this._iPlayerGoals) > this._iRemainingPlayerKicks-iShotsToReduce; 
        /*
        console.log("this._iOpponentGoals:"+this._iOpponentGoals);
        console.log("this._iPlayerGoals:"+this._iPlayerGoals);
        console.log("this._iRemainingPlayerKicks:"+this._iRemainingPlayerKicks);
        console.log("iShotsToReduce:"+iShotsToReduce);
         * 
         */
        
    }else {
        ////if i'm the keeper i need to check if i can win with my save.
        var bPlayerMatchPoint = (this._iPlayerGoals - this._iOpponentGoals) > this._iRemainingOpponentKicks -iShotsToReduce;
        ////if i'm the keeper check if opponent score and win the match.
        var bOpponentMatchPoint = (this._iOpponentGoals+1 - this._iPlayerGoals) > this._iRemainingPlayerKicks; 
    }
   
    console.log("bPlayerMatchPoint:"+bPlayerMatchPoint)
    console.log("bOpponentMatchPoint:"+bOpponentMatchPoint)
   
    return bPlayerMatchPoint || bOpponentMatchPoint;
};

CGameBase.prototype.checkAnyWins = function(){
    var bPlayerWins = this.checkPlayerWins();
    var bOpponentWins = this.checkOpponentWins();
    
    return bPlayerWins || bOpponentWins;
};

CGameBase.prototype.update = function(){
    if(this._oCurScenario){
        this._oCurScenario.update();
    }
};


var s_iCurState;
var s_oGameKeeper;
var s_oGameStriker;