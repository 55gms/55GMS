var CGameGoalkeeperSingle = function(iLevel,iCurBallForceY,oParentContainer){

    this._iBonusShotActive;
    this._iIDTimeout;

    CGameGoalkeeperBase.call(this, iLevel,iCurBallForceY,oParentContainer);
    
    this._init(iLevel,iCurBallForceY,oParentContainer);
    
};

CGameGoalkeeperSingle.prototype = Object.create(CGameGoalkeeperBase.prototype);

CGameGoalkeeperSingle.prototype._init = function(iLevel,iCurBallForceY,oParentContainer){
    CGameGoalkeeperBase.prototype._init(iLevel,iCurBallForceY,oParentContainer);
    this._startGame();
    
    this._iBonusShotActive = false;
};

CGameGoalkeeperSingle.prototype._startGame = function(){
    s_oInterface.showHelpText(TEXT_HELP_KEEPER);
    this.pause(false);
};

CGameGoalkeeperSingle.prototype.unload = function () {
    this._iGameState = -1;
    this._oParentContainer.removeAllChildren();

    clearTimeout(this._iIDTimeout);

    this._oScene.destroyWorld();
    this._oScene = null;

    this.deactiveEventListeners();

};

CGameGoalkeeperSingle.prototype.pause = function (bVal) {
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

CGameGoalkeeperSingle.prototype.activeEventListeners = function () {
    if (SHOW_3D_RENDER) {
        window.addEventListener("mousedown", this.addImpulseToBall, this);
        window.addEventListener("mousemove", this.onHandKeeper, this);
    } else {
        if (!this._oStageMouseMove) {
            this._oStageMouseMove = s_oStage.on("stagemousemove", this.onHandKeeper, this);
        }
        this._oListenerClickStage = this._oContainerGame.on("click", this.clickStage, this);
    }
};

CGameGoalkeeperSingle.prototype.addImpulseToBall = function () {
    if (this._bLaunched || this._iGameState !== STATE_PLAY) {
        return;
    }

    var fX = (Math.random() * (BALL_FORCE_X[this._iLevel-1] + BALL_FORCE_X[this._iLevel-1])) - BALL_FORCE_X[this._iLevel-1];
    var fZ = (Math.random() * (BALL_FORCE_Z[this._iLevel-1].max - BALL_FORCE_Z[this._iLevel-1].min)) + BALL_FORCE_Z[this._iLevel-1].min;

    var oDir = {x: fX, y: -this._iCurBallForceY, z: fZ};

    //SHOT ON THE LEFT POST
    //var oDir = {x: -12, y: -50, z: 10};

    var oBall = this._oScene.ballBody();
    this._oScene.addImpulse(oBall, oDir);
    this._oScene.setElementAngularVelocity(oBall, {x: 0, y: 0, z: 0});
    this._bLaunched = true;
};

CGameGoalkeeperSingle.prototype.startOpponentShot = function () {
    this._oOpponent.changeState("shot");
    this._oOpponent.fadeAnimation(1);
    this._oOpponent.onFinishAnimation();

    s_oInterface.hideHelpText();
    s_oInterface.hideMatchPointText();
};

CGameGoalkeeperSingle.prototype.goal = function () {
    if (!this._bGoal) {
        this._bGoal = true;
        this._fTimeReset = TIME_RESET_AFTER_GOAL;
        playSound("goal_keeper", 1, false);
        
        this._oPrevBallPos = this.getBallCoordsInGoalArea();
        
    }
};

CGameGoalkeeperSingle.prototype.keeperSave = function (oContactPoint) {
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

CGameGoalkeeperSingle.prototype._goalMiss = function(){
    ////WHEN BALL STOP PROBABLY WITH A POST HIT
    this._bBallStoppedAfterLaunch = true;
    this._bPostHit = true;
    
    var oPos = this.getBallCoordsInGoalArea();
    s_oGame.triggerEvent(ON_KEEPER_RESULT, {res: RES_OUT, pos:oPos});
};

CGameGoalkeeperSingle.prototype._ballOut = function(){
    this._bBallOut = true;
    
    var oPos = this.getBallCoordsInGoalArea();
    s_oGame.triggerEvent(ON_KEEPER_RESULT, {res: RES_OUT, pos:oPos});
};

CGameGoalkeeperSingle.prototype._checkBallState = function(){
    var oBallBody = this._oScene.ballBody();
    //console.log(oBallBody.velocity.lengthSquared());
    if(oBallBody.position.y < GOAL_LINE_POS.y){
        if(!this._bGoal && !this._bBallOut){
            this._ballOut();
            return;
        }
    }
    
    if(oBallBody.velocity.lengthSquared() < 0.01){
        //console.log("this._bLaunched:"+ this._bLaunched + "this._bBallStoppedAfterLaunch:"+this._bBallStoppedAfterLaunch + "this._bBallOut:"+this._bBallOut + "this._bGoal:"+this._bGoal)
        if(this._bLaunched && !this._bBallStoppedAfterLaunch && !this._bBallOut && !this._bGoal){
            this._goalMiss();
        }
        return;
    }
};

CGameGoalkeeperSingle.prototype._updatePlay = function () {
    for (var i = 0; i < PHYSICS_ACCURACY; i++) {
        this._oScene.update();
    }

    this._updateBall2DPosition();

    if (this._bKeeperSave || this._bGoal || this._bBallOut || this._bPostHit) {
        this.timeReset();
    }

    this.rotateGuantes();

    this.swapChildrenIndex();
    
    this._checkBallState();
};

CGameGoalkeeperSingle.prototype.update = function () {
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

CGameGoalkeeperSingle.prototype.checkEndTurn = function () {
    var oParent = this;
    var bGoal = this._bGoal;
    var bSave = this._bKeeperSave;

    s_oGame.endShotOpponent(this._bGoal,this._bKeeperSave, this._iBonusShotActive);

    var bOpponentWins = s_oGame.checkOpponentWins();

    this._iIDTimeout = setTimeout(function(){
        if(bGoal && !oParent._iBonusShotActive && !bOpponentWins){
            var oData = s_oGame.generateTheQuizFromCurOperation();
            s_oGame.showTheQuiz(oData);
            s_oGame.cpuQuizAnswer(oData.correctanswer, oData.answers, oData.cypher);
        }else {
            //oParent._oResultPanel.hide();
            
            oParent.endTurn();
        }
    },1000);    
    
    
    this.resetScene();
};

CGameGoalkeeperSingle.prototype.endTurn = function () {
    //this.resetScene();
    s_oGame.changeScenario();
    s_oGame.hideResult();
    
    //s_oGame.increaseStage();
};