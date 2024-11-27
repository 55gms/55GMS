var CGameStrikerSingle = function(oParentContainer,iCurLevel){

    this._iBonusShotActive;
    this._iIDTimeout;

    CGameStrikerBase.call(this, oParentContainer,iCurLevel);
    
    this._init(oParentContainer,iCurLevel);
    
};

CGameStrikerSingle.prototype = Object.create(CGameStrikerBase.prototype);

CGameStrikerSingle.prototype._init = function(oParentContainer,iCurLevel){
    CGameStrikerBase.prototype._init(oParentContainer,iCurLevel);
    this._startGame();
    
    this._iBonusShotActive = false;
};

CGameStrikerSingle.prototype._startGame = function(){
    s_oInterface.showHelpText(TEXT_HELP);
    this.onExitHelp();
};

CGameStrikerSingle.prototype.unload = function () {
    this._oParentContainer.removeAllChildren();

    clearTimeout(this._iIDTimeout);

    if (!SHOW_3D_RENDER) {
        this._oHitArea.removeAllEventListeners();
    }
    this._oScene.destroyWorld();
    this._oScene = null;
};

CGameStrikerSingle.prototype.onExitHelp = function () {
    this.createControl();
    this.pause(false);
};

CGameStrikerSingle.prototype.createControl = function () {
    if (!SHOW_3D_RENDER) {
        this._oHitArea = new createjs.Shape();
        this._oHitArea.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this._oContainerGame.addChild(this._oHitArea);

        this._oHitArea.on('mousedown', this.onMouseDown, this);
        this._oHitArea.on('pressmove', this.onPressMove, this);
        this._oHitArea.on('pressup', this.onPressUp, this);
    } else {
        window.addEventListener('mousedown', this.onMouseDown, this);
        window.addEventListener('mousemove', this.onPressMove, this);
        window.addEventListener('mouseup', this.onPressUp, this);
    }
};

CGameStrikerSingle.prototype.onPressUp = function () {
    if (this._bLaunched) {
        return;
    }else if( (this._oClickPoint.y < this._oReleasePoint.y) || (this._oReleasePoint.x === 0 && this._oReleasePoint.y === 0) ){
        return;
    }
    var fDistance = Math.ceil(distanceV2(this._oClickPoint, this._oReleasePoint)) * FORCE_RATE;

    if (fDistance > FORCE_MAX) {
        fDistance = FORCE_MAX;
    }

    if (this._iTimePressDown > 1000) {
        this._iTimePressDown = 1000;
    }

    var vHitDir2D = new CVector2(this._oClickPoint.x - this._oReleasePoint.x,
            this._oClickPoint.y - this._oReleasePoint.y);

    vHitDir2D.scalarProduct(fDistance);

    
    /*
    var fLateral = 8;

    //this._vHitDir.set(-vHitDir2D.getX()*fLateral, 50, vHitDir2D.getY()*fLateral);

    this._vHitDir.set(-vHitDir2D.getX(), 1, vHitDir2D.getY());
    this._vHitDir.normalize();
    this._vHitDir.scale(30, this._vHitDir);
    */
            //this._vHitDir.scale(7, this._vHitDir);

            /*
            if ( this._vHitDir.x <= 0.04 && this._vHitDir.x >= -0.04 && 
                this._vHitDir.z >= 0.1 && this._vHitDir.z <= 0.14){
            
                    //PARATA CENTRALE 
                    if(this._vHitDir.x > 0.01  ){
                        this._vHitDir.x = 0.01;
                    }
            }
            */
    

    var fForceLength = vHitDir2D.length();

    if (fForceLength > HIT_BALL_MIN_FORCE) {
        if (fForceLength > HIT_BALL_MAX_FORCE) {
            vHitDir2D.normalize();
            vHitDir2D.scalarProduct(HIT_BALL_MAX_FORCE);
        }

        this._bAnimPlayer = true;
        this._oPlayer.setVisible(true);
        
        /*
        var fForceY = this._iTimePressDown / 10;
        if (fForceY > MAX_FORCE_Y) {
            fForceY = MAX_FORCE_Y;
        } else if (fForceY < MIN_FORCE_Y) {
            fForceY = MIN_FORCE_Y;
        }
        */
        var fForceY = 50;

        this._vHitDir.set(-vHitDir2D.getX() * FORCE_MULTIPLIER_AXIS.x, fForceY, vHitDir2D.getY() * FORCE_MULTIPLIER_AXIS.z);

        //GOAL LIMIT X: |0.178|, Z: [0, 0.17], POWER: 50
        
        //this._vHitDir = new CANNON.Vec3(-0.17,1,0.13);
        //this._vHitDir = new CANNON.Vec3(0.17,1,0.07);
        //this._vHitDir.scale(50, this._vHitDir);

        //this._vHitDir = new CANNON.Vec3(-0.05661054432013683,1,0.11177098632946654);
        //this._vHitDir.scale(50, this._vHitDir);

        console.log({x:this._vHitDir.x/this._vHitDir.y, y:this._vHitDir.y, z:this._vHitDir.z/this._vHitDir.y});

        this._bMakeGoal = this.goalProbability();
    } 

    this._oReleasePoint.x = 0;
    this._oReleasePoint.y = 0;
};

CGameStrikerSingle.prototype.animPlayer = function () {
    if (!this._bAnimPlayer) {
        this._oPlayer.setVisible(false);
        return;
    }

    this._bAnimPlayer = this._oPlayer.animPlayer();

    if (this._oPlayer.getFrame() === SHOOT_FRAME) {
        this.addImpulseToBall({x: this._vHitDir.x,
            y: this._vHitDir.y, z: this._vHitDir.z});
        this._iTimePressDown = 0;
        this.goalAnimation(this._vHitDir.y);
        s_oInterface.hideHelpText();
        s_oInterface.hideMatchPointText();
    }
};

CGameStrikerSingle.prototype.chooseDirectionGoalKeeper = function () {
    console.log(this._bMakeGoal)
    console.log(this._iArea)
    
    var pBallFinalPos = this.predictBallGoalPos(this._vHitDir);
    //this._oTrajectory = new CTrajectory(this._oContainerGame);
    //this._oTrajectory.setTrajectory(this._vHitDir);
    
    if(this._bMakeGoal){
        //PLAYER GOAL! PLAY A WRONG DIRECTION GOALKEEPER
        this.chooseWrongDirGK();
    }else {
        var iAnimIndex = this._iArea;

        if(pBallFinalPos.y < 75){
            if(this._iArea === 14){
                iAnimIndex = 9;
            }
            if(this._iArea === 10){
                iAnimIndex = 5;
            }
        }
        this._oGoalKeeper.runAnimAndShift(AREA_GOALS_ANIM[iAnimIndex], pBallFinalPos);
    }

    this._bAnimGoalKeeper = true;
};

CGameStrikerSingle.prototype._updatePlay = function () {
    for (var i = 0; i < PHYSICS_ACCURACY; i++) {
        this._oScene.update();
    }
    

    this.ballOut();

    if (this._bGoal || this._bBallOut || this._bSaved) {
        this.timeReset();
    } else if (this._bPoleCollide) {
        this.resetPoleCollision();
    }

    this.animGoalKeeper();

    this.animPlayer();

    this._updateBall2DPosition();

    this.handSwipeAnim();

    this.swapChildrenIndex();

    this.swapGoal();
    
};

CGameStrikerSingle.prototype.update = function () {
    switch (this._iGameState) {
        case STATE_INIT:
            this._updateInit();
            break;
        case STATE_PLAY:
            this._updatePlay();
            break;
        case STATE_FINISH:

            break;
        case STATE_PAUSE:

            break;
    }
};

CGameStrikerSingle.prototype.checkEndTurn = function () {
    var oParent = this;
    var bGoal = this._bGoal;
    var bSave = this._bSaved;
    
    s_oGame.endShotPlayer(this._bGoal,this._bSaved, this._iBonusShotActive);
    
    var bPlayerWins = s_oGame.checkPlayerWins();
    
    this._iIDTimeout = setTimeout(function(){
        if(bGoal && !oParent._iBonusShotActive && !bPlayerWins){
            var oData = s_oGame.generateTheQuiz();
            s_oGame.showTheQuiz(oData);
        }else {
            //oParent._oResultPanel.hide();
            
            oParent.endTurn();
        }
    },1000);
    
    
    this.resetScene();
};

CGameStrikerSingle.prototype.endTurn = function () {
    //this.resetScene();
    s_oGame.changeScenario();
    s_oGame.hideResult();
};