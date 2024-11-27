var CGameGoalkeeperMulti = function(iLevel,iCurBallForceY,oParentContainer,iPlayerLeft){

    CGameGoalkeeperBase.call(this, iLevel,iCurBallForceY,oParentContainer);
    
    this._iShootState = SHOOT_STATE_WAITING;
    this._iPlayerLeft = iPlayerLeft;
    
    this._init(iLevel,iCurBallForceY,oParentContainer);
    
    
    
    this._oCurData;
    
};

CGameGoalkeeperMulti.prototype = Object.create(CGameGoalkeeperBase.prototype);

CGameGoalkeeperMulti.prototype._init = function(iLevel,iCurBallForceY,oParentContainer){
    CGameGoalkeeperBase.prototype._init(iLevel,iCurBallForceY,oParentContainer);
    this._startGame();
    
    this._oMoveTimeController = new CMoveTimeController(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, this._oContainerGame);    
};

CGameGoalkeeperMulti.prototype._startGame = function(){
    s_oInterface.showGoalkeeperWaiting();

    this.pause(false);

    if(this._iPlayerLeft !== null){
        this._setCPUTakeOver();
    }
};

CGameGoalkeeperMulti.prototype.unload = function () {
    this._iGameState = -1;
    this._oParentContainer.removeAllChildren();

    clearTimeout(this._iIDTimeout);

    this._oScene.destroyWorld();
    this._oScene = null;

    this.deactiveEventListeners();

};

CGameGoalkeeperMulti.prototype.startCountDown = function(){
    this._oMoveTimeController.startTimer();
    this._oMoveTimeController.setSpectatorMode();
};

CGameGoalkeeperMulti.prototype.stopCountDown = function(){
    this._oMoveTimeController.stopTimer();
};

CGameGoalkeeperMulti.prototype.refreshPos = function(){
    this._oMoveTimeController.setPos(CANVAS_WIDTH - 60 - s_iOffsetX, CANVAS_HEIGHT - 60 - s_iOffsetY);
};

CGameGoalkeeperMulti.prototype.pause = function (bVal) {
    if (bVal) {
        this._iGameState = STATE_PAUSE;
        if (this._oOpponent)
            this._oOpponent.stopAnimation();
        this.deactiveEventListeners();
    } else {
        this._iGameState = STATE_PLAY;
        if (this._oOpponent)
            this._oOpponent.playAnimation();
        this.activeEventListeners();
    }
    createjs.Ticker.paused = bVal;
};

CGameGoalkeeperMulti.prototype.activeEventListeners = function () {
    if (SHOW_3D_RENDER) {
        window.addEventListener("mousedown", this.addImpulseToBall, this);
        window.addEventListener("mousemove", this.onHandKeeper, this);
    } else {
        if (!this._oStageMouseMove) {
            this._oStageMouseMove = s_oStage.on("stagemousemove", this.onHandKeeper, this);
        }
    }
};

CGameGoalkeeperMulti.prototype.addImpulseToBall = function () {
    if (this._bLaunched || this._iGameState !== STATE_PLAY) {
        return;
    }
    
    var iDifficultyAngle = 7;

    var fX = (Math.random() * (BALL_FORCE_X[iDifficultyAngle] + BALL_FORCE_X[iDifficultyAngle])) - BALL_FORCE_X[iDifficultyAngle];
    var fZ = (Math.random() * (BALL_FORCE_Z[iDifficultyAngle].max - BALL_FORCE_Z[iDifficultyAngle].min)) + BALL_FORCE_Z[iDifficultyAngle].min;

    var iDifficultyPower = 3;
    //var iDifficultyPower = 0;

    this._iCurBallForceY = BALL_FORCE_Y[iDifficultyPower]

    var oDir = {x: fX, y: -this._iCurBallForceY, z: fZ};

    var oBall = this._oScene.ballBody();
    this._oScene.addImpulse(oBall, oDir);
    this._oScene.setElementAngularVelocity(oBall, {x: 0, y: 0, z: 0});
    this._bLaunched = true;
};

CGameGoalkeeperMulti.prototype.remoteStartOpponentShot = function (oStrikerDir) {
    this._iShootState = SHOOT_STATE_ANIM;
    
    s_oInterface.hideGoalkeeperWaiting();
    
    this._oMoveTimeController.stopTimer();
    
    this._oOpponent.changeState("shot");
    this._oOpponent.fadeAnimation(1);
    
    var oDir = this._getAdjustedStrikerLaunch(oStrikerDir);
    this._oOpponent.onRemoteFinishAnimation(oDir);

    s_oInterface.hideHelpText();
    s_oInterface.hideMatchPointText();
};

CGameGoalkeeperMulti.prototype.addRemoteImpulseToBall = function (oDir) {
    if (this._bLaunched || this._iGameState !== STATE_PLAY) {
        return;
    }

    //var oDir = {x: -12, y: -50, z: 10};

    this._vHitDir = oDir;

    var oBall = this._oScene.ballBody();
    this._oScene.addImpulse(oBall, oDir);
    this._oScene.setElementAngularVelocity(oBall, {x: 0, y: 0, z: 0});
    this._bLaunched = true;
};

CGameGoalkeeperMulti.prototype._getAdjustedStrikerLaunch = function (oDir) {
    var iX = -oDir.x;
    var iZ = oDir.z;
    
    //GOALKEEPER LIMITS
    //LIMIT X: |0.233|, Z: [0, 0.23], POWER: -50 higher shoots; -60 lower shoots
    
    //STRIKER LIMITS
    //LIMIT X: |0.1765|, Z: [0, 0.186], POWER: 50
    
    /*
    var iY = -linearFunction(iZ, 0, STRIKER_GOAL_SHOOTAREA.zmax*oDir.y, GOALKEEPER_SHOOTPOWER_LIMITS.min, GOALKEEPER_SHOOTPOWER_LIMITS.min);
    iX = linearFunction(iX, STRIKER_GOAL_SHOOTAREA.lx, STRIKER_GOAL_SHOOTAREA.rx, -GOALKEEPER_GOAL_SHOOTAREA.x, GOALKEEPER_GOAL_SHOOTAREA.x);
    iZ = linearFunction(iZ, 0, STRIKER_GOAL_SHOOTAREA.zmax, 0, GOALKEEPER_GOAL_SHOOTAREA.z);
    */
   
    var iY = -linearFunction(iZ, 0, STRIKER_GOAL_SHOOTAREA.zmax*oDir.y, GOALKEEPER_SHOOTPOWER_LIMITS.min, GOALKEEPER_SHOOTPOWER_LIMITS.min);//-50;
    var iX = linearFunction(iX, STRIKER_GOAL_SHOOTAREA.lx, STRIKER_GOAL_SHOOTAREA.rx, GOALKEEPER_GOAL_SHOOTAREA.lx, GOALKEEPER_GOAL_SHOOTAREA.rx);
    var iZ = linearFunction(iZ, 0, STRIKER_GOAL_SHOOTAREA.zmax, 0, GOALKEEPER_GOAL_SHOOTAREA.z);
   
    var oNewDir = {x: iX, y: iY, z:iZ};

    //console.log(oNewDir);

    /* TEST SHOOT
    s_oGameStriker._vHitDir = new CANNON.Vec3(0,1,0.17);
    s_oGameStriker._vHitDir.scale(50, s_oGameStriker._vHitDir);
    */

    return oNewDir;
};



CGameGoalkeeperMulti.prototype.goal = function () {
    if (!this._bGoal) {
        this._bGoal = true;
        this._fTimeReset = TIME_RESET_AFTER_GOAL;

        playSound("goal_keeper", 1, false);
        
        this._oPrevBallPos = this.getBallCoordsInGoalArea();
        
        var oParent = this;
        this._iIDTimeout = setTimeout(function(){
            oParent._setResult();
        }, 1000)
    }
    
};

CGameGoalkeeperMulti.prototype.keeperSave = function (oContactPoint) {
    if (this._bGoal) {
        return;
    }

    if (!this._bKeeperSave) {
        if (oContactPoint.x > -BALL_SAVED_POINT.x && oContactPoint.x < BALL_SAVED_POINT.x && oContactPoint.z > -BALL_SAVED_POINT.z
                                                                                                && oContactPoint.z < BALL_SAVED_POINT.z) {
            this._bPerfectSaved = true;
            this._oBall.getPhysics().mass = 0;
            this._fTimeReset = TIME_RESET_AFTER_PERFECT_KEEPER_SAVED;
            this._iPerfectBallSaved++;
            this._oGloves.changeState("perfect");
            
            var oParent = this;
            createjs.Tween.get(this._oContainerGame).wait(TIME_BALL_IN_HAND).call(function () {
                oParent._bPerfectSaved = false;
                oParent._oBall.getPhysics().mass = BALL_MASS;
                oParent._oGloves.changeState("normal");
            });
        } else {
            this._bPerfectSaved = false;
            this._fTimeReset = TIME_RESET_AFTER_KEEPER_SAVED;
        }

        this._oPrevBallPos = this.getBallCoordsInGoalArea();

        this._bKeeperSave = true;
        playSound("kick", 0.65, false);
        playSound("keep_ball", 1, false);
    }

};

CGameGoalkeeperMulti.prototype._ballStopped = function(){
    ////WHEN BALL STOP PROBABLY WITH A POST HIT
    this._bBallStoppedAfterLaunch = true;

    this._setResult();
    
    var oPos = this.getBallCoordsInGoalArea();
    s_oGame.triggerEvent(ON_KEEPER_RESULT, {res: RES_OUT, pos:oPos});
    
};

CGameGoalkeeperMulti.prototype._ballOut = function(){
    this._bBallOut = true;

    this._setResult();
    
    var oPos = this.getBallCoordsInGoalArea();
    s_oGame.triggerEvent(ON_KEEPER_RESULT, {res: RES_OUT, pos:oPos});
};

CGameGoalkeeperMulti.prototype._setResult = function(){
    //console.trace("_setResult");
    
    var iResult;
    if(this._bGoal){
        iResult = GOALKEEPER_RESULTS_GOAL;
    } else {
        if(this._bBallOut){
            iResult = GOALKEEPER_RESULTS_BALLOUT;
        }else if(this._bKeeperSave) {
            iResult = GOALKEEPER_RESULTS_SAVED;
        } else {
            iResult = GOALKEEPER_RESULTS_POSTHIT;
        }
    }
    
    if(this._iPlayerLeft === null){
        var oShotResult = {result: iResult, dir: this._vHitDir};
        var oJSONData = {};
        oJSONData[MSG_GOALKEEPER_SAVES] = oShotResult;
        s_oNetworkManager.sendMsg(MSG_GOALKEEPER_SAVES, JSON.stringify(oJSONData));
    }else {
        if(this._bGoal && !this._iBonusShotActive){
            this._iShootState = SHOOT_STATE_CHANGING_TURN;
            
            var oData;
            if(s_oGame.isStartingUser()){
                oData = s_oGame.generateTheQuizFromCurOperation();
            }else {
                oData = s_oGame.generateTheQuiz();
            }
            
            this.onQuizReceived(oData);
            s_oGame.cpuQuizAnswer(oData.correctanswer, oData.answers, oData.cypher);
        }else {
            this.endTurn();
        }
    }
    
    
    if (this._bGoal) {
        this._iGoalOpponent++;
    } else {
        this._iBallSaved++;
    }
};

CGameGoalkeeperMulti.prototype._checkBallState = function(){
    var oBallBody = this._oScene.ballBody();

    if(oBallBody.position.y < GOAL_LINE_POS.y){
        if(!this._bGoal && !this._bBallOut){
            this._ballOut();
            return;
        }
    }
    if(oBallBody.velocity.lengthSquared() < 0.3){
        if(this._bLaunched && !this._bBallStoppedAfterLaunch && !this._bBallOut && !this._bGoal){
            this._ballStopped();
            return;
        }
    }
};

CGameGoalkeeperMulti.prototype._updatePlay = function () {
    for (var i = 0; i < PHYSICS_ACCURACY; i++) {
        this._oScene.update();
    }

    this._updateBall2DPosition();

    this.rotateGuantes();

    this.swapChildrenIndex();
    
    this._checkBallState();
};

CGameGoalkeeperMulti.prototype.update = function () {
    switch (this._iGameState) {
        case STATE_INIT:{
                this._updateInit();
            }
            break;
        case STATE_PLAY:{
                this._updatePlay();
            }
            break;
        case STATE_FINISH:

            break;
        case STATE_PAUSE:

            break;
    }
};

CGameGoalkeeperMulti.prototype.checkEndTurn = function () {
    
    //console.log("MULTICHECKENDTURN")

   
};

CGameGoalkeeperMulti.prototype.onQuizReceived = function (oData) {
    s_oGame.endShotOpponent(this._bGoal,this._bKeeperSave, this._iBonusShotActive);
    s_oGame.setCurQuizOperation(oData.operation);
    //this.resetScene();
    var oParent = this;
    this._iIDTimeout = setTimeout(function(){
        
        oParent._iShootState = SHOOT_STATE_END;
        oParent._oCurData = oData;
        
        s_oGame.showTheQuiz(oData);
        s_oGame.setQuizSpectatorMode();
    },1000);
};

CGameGoalkeeperMulti.prototype.endTurn = function(){
    ////POSSO METTERE TUTTO IN BASE???
    
    s_oGame.endShotOpponent(this._bGoal,this._bKeeperSave, this._iBonusShotActive);
    //this.resetScene();
    
    this._iIDTimeout = setTimeout(function(){
        s_oGame.changeScenario();
        s_oGame.hideResult();
    },1000);
    
    //s_oGame.increaseStage(); //??
};

CGameGoalkeeperMulti.prototype.checkCPUMoves = function (iPlayerLeft) {
    this._iPlayerLeft = iPlayerLeft;
    
    switch(this._iShootState){
        case SHOOT_STATE_WAITING:{
                this._setCPUTakeOver();
                break;
        }
        case SHOOT_STATE_END:{
                this._setCPUQuestionAnswer();
                break;
        }
    }
};

CGameGoalkeeperMulti.prototype._setCPUTakeOver = function () {
    var oParent = this;
    var iTime = 3000 + Math.random()*2000;
    this._iIDTimeout = setTimeout(function(){

        oParent._iShootState = SHOOT_STATE_ANIM;
    
        s_oInterface.hideGoalkeeperWaiting();

        oParent._oMoveTimeController.stopTimer();

        oParent._oOpponent.changeState("shot");
        oParent._oOpponent.fadeAnimation(1);

        oParent._oOpponent.onFinishAnimation();

        s_oInterface.hideHelpText();
        s_oInterface.hideMatchPointText();
    }, iTime);
};

CGameGoalkeeperMulti.prototype._setCPUQuestionAnswer = function () {
    this._iShootState = SHOOT_STATE_CHANGING_TURN;
    var oData = this._oCurData;
    s_oGame.cpuQuizAnswer(oData.correctanswer, oData.answers, oData.cypher);
};

CGameGoalkeeperMulti.prototype.setShootState = function (iState) {
    this._iShootState = iState;
};
