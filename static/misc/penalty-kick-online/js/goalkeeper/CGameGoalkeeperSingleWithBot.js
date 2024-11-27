var CGameGoalkeeperSingleWithBot = function(iLevel,iCurBallForceY,oParentContainer){

    CGameGoalkeeperSingle.call(this, iLevel,iCurBallForceY,oParentContainer);
};

CGameGoalkeeperSingleWithBot.prototype = Object.create(CGameGoalkeeperSingle.prototype);

CGameGoalkeeperSingleWithBot.prototype._startGame = function(){
    s_oInterface.showGoalkeeperWaiting();
    
    this.pause(false);
    
    setTimeout(function(){
        s_oGameKeeper.startOpponentShot();
    }, 2000 + Math.random()*2000);
};

CGameGoalkeeperSingleWithBot.prototype.activeEventListeners = function () {
    if (SHOW_3D_RENDER) {
        window.addEventListener("mousedown", this.addImpulseToBall);
        window.addEventListener("mousemove", this.onHandKeeper);
    } else {
        if (!this._oStageMouseMove) {
            this._oStageMouseMove = s_oStage.on("stagemousemove", this.onHandKeeper);
        }
    }
};

CGameGoalkeeperSingleWithBot.prototype.startOpponentShot = function () {
    s_oGameKeeper._oOpponent.changeState("shot");
    s_oGameKeeper._oOpponent.fadeAnimation(1);
    s_oGameKeeper._oOpponent.onFinishAnimation();

    s_oInterface.hideGoalkeeperWaiting();
};

CGameGoalkeeperSingleWithBot.prototype.goal = function () {
    if (!this._bGoal) {
        this._bGoal = true;
        this._fTimeReset = TIME_RESET_AFTER_GOAL*4;
        playSound("goal_keeper", 1, false);
    }
};

CGameGoalkeeperSingleWithBot.prototype.keeperSave = function (oContactPoint) {
    if (this._bGoal) {
        return;
    }
    if (!this._bKeeperSave) {
        if (oContactPoint.x > -BALL_SAVED_POINT.x && oContactPoint.x < BALL_SAVED_POINT.x && oContactPoint.z > -BALL_SAVED_POINT.z
                                                                                                && oContactPoint.z < BALL_SAVED_POINT.z) {
            this._bPerfectSaved = true;
            this._oBall.getPhysics().mass = 0;
            this._fTimeReset = TIME_RESET_AFTER_PERFECT_KEEPER_SAVED*2;
            this._iPerfectBallSaved++;
            this._oGloves.changeState("perfect");
            createjs.Tween.get(this._oContainerGame).wait(TIME_BALL_IN_HAND).call(function () {
                s_oGameKeeper._bPerfectSaved = false;
                s_oGameKeeper._oBall.getPhysics().mass = BALL_MASS;
                s_oGameKeeper._oGloves.changeState("normal");
            });
        } else {
            this._bPerfectSaved = false;
            this._fTimeReset = TIME_RESET_AFTER_KEEPER_SAVED*3;
        }


        this._bKeeperSave = true;
        playSound("kick", 0.65, false);
        playSound("keep_ball", 1, false);
    }
};

CGameGoalkeeperSingleWithBot.prototype._updatePlay = function () {
    for (var i = 0; i < PHYSICS_ACCURACY; i++) {
        this._oScene.update();
    }

    this._updateBall2DPosition();

    
    if (this._bKeeperSave || this._bGoal || this._bBallOut || this._bBallStoppedAfterLaunch) {
        this.timeReset();
    }
    

    this.rotateGuantes();

    this.swapChildrenIndex();
    
    this._checkBallState();
};

CGameGoalkeeperSingleWithBot.prototype.update = function () {
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