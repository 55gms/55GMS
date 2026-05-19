var CGameStrikerMulti = function(oParentContainer,iCurLevel,iPlayerLeft){
    CGameStrikerBase.call(this, oParentContainer,iCurLevel);
    
    this._init(oParentContainer,iCurLevel);
    
    this._iShootState = SHOOT_STATE_WAITING;
    this._iPlayerLeft = iPlayerLeft;
    
    this._bMultiplayerGoal = false;
    this._bMultiplayerBallSaved = false;
    this._bMultiplayerBallOut = false;
    this._bMultiplayerBallPost = false;
    
    this._iIDTimeout;
    
    this._oTrajectory;
    
};

CGameStrikerMulti.prototype = Object.create(CGameStrikerBase.prototype);

CGameStrikerMulti.prototype._init = function(oParentContainer,iCurLevel){
    CGameStrikerBase.prototype._init(oParentContainer,iCurLevel);
    this._startGame();
    
    this._oMoveTimeController = new CMoveTimeController(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, this._oContainerGame);
    this._oMoveTimeController.addEventListener(ON_TIMER_END, this._onTimerEnd, this);

    
};

CGameStrikerMulti.prototype._startGame = function(){
    s_oInterface.showHelpText(TEXT_HELP);

    this.onExitHelp();

    this._oTrajectory = new CTrajectory(this._oContainerGame);
};

CGameStrikerMulti.prototype.unload = function () {
    this._oParentContainer.removeAllChildren();
    this._oMoveTimeController.unload();

    clearTimeout(this._iIDTimeout);

    if (!SHOW_3D_RENDER) {
        this._oHitArea.removeAllEventListeners();
    }
    this._oScene.destroyWorld();
    this._oScene = null;
};

CGameStrikerMulti.prototype.startCountDown = function(){
    this._oMoveTimeController.startTimer();
};

CGameStrikerMulti.prototype.stopCountDown = function(){
    this._oMoveTimeController.stopTimer();
};

CGameStrikerMulti.prototype._onTimerEnd = function(){
    var iRange = 700;
    
    var iX = -iRange/2 + Math.random()*iRange;
    var iXAbs = Math.abs(iX);

    var iY = linearFunction(iXAbs, 0, iRange/2, 350, iRange*2);

    this._oClickPoint = {x: 0, y: 0};
    this._oReleasePoint = {x: iX, y: -iY};
    
    this.onPressUp();
};

CGameStrikerMulti.prototype.refreshPos = function(){
    this._oMoveTimeController.setPos(CANVAS_WIDTH - 60 - s_iOffsetX, CANVAS_HEIGHT - 60 - s_iOffsetY);
};



CGameStrikerMulti.prototype.onExitHelp = function () {
    this.createControl();
    this.pause(false);
};

CGameStrikerMulti.prototype.createControl = function () {
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

CGameStrikerMulti.prototype.onPressUp = function () {
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

    var fForceLength = vHitDir2D.length();

    if (fForceLength > HIT_BALL_MIN_FORCE) {
        if (fForceLength > HIT_BALL_MAX_FORCE) {
            vHitDir2D.normalize();
            vHitDir2D.scalarProduct(HIT_BALL_MAX_FORCE);
        }

        /*
        var fForceY = this._iTimePressDown / 10;
        if (fForceY > MAX_FORCE_Y) {
            fForceY = MAX_FORCE_Y;
        } else if (fForceY < MIN_FORCE_Y) {
            fForceY = MIN_FORCE_Y;
        }
        */
        var fForceY = MIN_FORCE_Y;

        this._vHitDir.set(-vHitDir2D.getX() * FORCE_MULTIPLIER_AXIS.x, fForceY, vHitDir2D.getY() * FORCE_MULTIPLIER_AXIS.z);

        //GOAL LIMIT X: |0.1765|, Z: [0, 0.186], POWER: 50
        
        /////// TEST SHOOT - POST HIT
        //this._vHitDir = new CANNON.Vec3(0.2,1,0.14);
        //this._vHitDir.scale(50, this._vHitDir);

        //this._vHitDir = new CANNON.Vec3(0.18,1,0.14);
        //this._vHitDir.scale(50, this._vHitDir);

        //this._vHitDir = new CANNON.Vec3(0.19,1,0.1055);//TIRO BUGGATO
        //this._vHitDir = new CANNON.Vec3(-0.18,1,0.12);//TIRO BUGGATO
        //this._vHitDir.scale(50, this._vHitDir);

        var aDirToSend = this._vHitDir.toArray();

        this._oTrajectory.setTrajectory(this._vHitDir);
        
        s_oInterface.hideHelpText();
        s_oInterface.hideMatchPointText();
        s_oInterface.showStrikerWaiting();
        
        if(this._oHandSwipeAnim){
            this._oHandSwipeAnim.unload();
        }

        this._oMoveTimeController.stopTimer();

        this._iShootState = SHOOT_STATE_SELECTED;

        if(this._iPlayerLeft === null){
            var oShotDir = {x: aDirToSend[0], y: aDirToSend[1], z:aDirToSend[2]};
            var oJSONData = {};
            oJSONData[MSG_STRIKER_KICKS] = oShotDir;
            s_oNetworkManager.sendMsg(MSG_STRIKER_KICKS, JSON.stringify(oJSONData));
        }else {
            this._setCPUTakeOver();
        }
        
    } 
};

CGameStrikerMulti.prototype.animPlayer = function () {
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
        
        s_oInterface.hideStrikerWaiting();
        this._oTrajectory.hide();
    }
};

CGameStrikerMulti.prototype.chooseDirectionGoalKeeper = function () {
    console.log(this._bMakeGoal)
    console.log(this._iArea)
    
    var pBallFinalPos = this.predictBallGoalPos(this._vHitDir);
    //this._oTrajectory = new CTrajectory(this._oContainerGame);
    //this._oTrajectory.setTrajectory(this._vHitDir);
    
    if(this._bMakeGoal){
        //PLAYER GOAL! PLAY A WRONG DIRECTION GOALKEEPER
        this.chooseWrongDirGK();
    }else if(this._bMultiplayerBallOut || this._bMultiplayerBallPost) {
        this._randomAreaAnimation();
        this._oGoalKeeper.runAnim(this._iArea);
    } else {
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

/*
CGameStrikerMulti.prototype._findGoalkeeperAreaAnimation = function () {  
    this._iArea = -1;
    for (var i = 0; i < CALCULATE_PROBABILITY.length; i++) {
        if (this._vHitDir.z < CALCULATE_PROBABILITY[i].zMax && this._vHitDir.z > CALCULATE_PROBABILITY[i].zMin) {
            if (this._vHitDir.x < CALCULATE_PROBABILITY[i].xMax && this._vHitDir.x > CALCULATE_PROBABILITY[i].xMin) {
                this._iArea = i;
            }
        }
    }
};
*/

CGameStrikerMulti.prototype._randomAreaAnimation = function () {  
    this._iArea = Math.floor( Math.random()*AREA_GOALS_ANIM.length );
};

CGameStrikerMulti.prototype._goalAnimation = function () { 
    ////////TIGHT SHOOT RANGE
    this._bMakeGoal = true;
    this._bMultiplayerGoal = true;
    this._bMultiplayerBallSaved = false;
    this._bMultiplayerBallOut = false;
    this._bMultiplayerBallPost = false;
    
    this._setBallDirToGoal();
    
    //this._findGoalkeeperAreaAnimation();
    //this.chooseDirectionGoalKeeper();
    
};

CGameStrikerMulti.prototype._saveAnimation = function () { 
    ////////TIGHTEN SHOOT RANGE
    this._bMakeGoal = false;
    this._bMultiplayerGoal = false;
    this._bMultiplayerBallSaved = true;
    this._bMultiplayerBallOut = false;
    this._bMultiplayerBallPost = false;
    
    this._setBallDirToGoal();
    
    //this._findGoalkeeperAreaAnimation();
    //this.chooseDirectionGoalKeeper();
    
};

CGameStrikerMulti.prototype._ballOutAnimation = function () { 
    ////////WIDEN SHOOT RANGE
    this._bMakeGoal = false;
    this._bMultiplayerGoal = false;
    this._bMultiplayerBallSaved = false;
    this._bMultiplayerBallOut = true;
    this._bMultiplayerBallPost = false;
    
    this._setBallDirToOut();
    
    //this._randomAreaAnimation();
};

CGameStrikerMulti.prototype._postHitAnimation = function () { 
    ////////FIND EXACT POST SHOOT DIRECTION
    this._bMakeGoal = false;
    this._bMultiplayerGoal = false;
    this._bMultiplayerBallSaved = false;
    this._bMultiplayerBallOut = false;
    this._bMultiplayerBallPost = true;

    this._setBallDirToPost();

    //this._randomAreaAnimation();
};

CGameStrikerMulti.prototype._setBallDirToGoal = function(){
    var iPower = MIN_FORCE_Y;
    this._vHitDir.scale(1/iPower, this._vHitDir);
    
    this.limitXDir();
    this.limitZDir();
    
    var iTolerance = 0.015;
    var bConditioZ = this._vHitDir.z > STRIKER_GOAL_SHOOTAREA.zmax - iTolerance;
    var bConditioLX = this._vHitDir.x > STRIKER_GOAL_SHOOTAREA.lx && this._vHitDir.x <= STRIKER_GOAL_SHOOTAREA.lx + iTolerance;
    var bConditioRX = this._vHitDir.x < STRIKER_GOAL_SHOOTAREA.rx && this._vHitDir.x >= STRIKER_GOAL_SHOOTAREA.rx - iTolerance;
    
    //console.log("bConditioZ"+bConditioZ);
    //console.log("bConditioLX"+bConditioLX);
    //console.log("bConditioRX"+bConditioRX);
    
    if(bConditioZ || bConditioLX || bConditioRX){
        //TIGHT THE GOAL AREA
        //console.log("TIGHT THE GOAL AREA")
        var iOffset = 0.015;
        //this._vHitDir.x -= 0.01;
        //console.log(this._vHitDir.x)

        this._vHitDir.x = linearFunction(this._vHitDir.x, STRIKER_GOAL_SHOOTAREA.lx, STRIKER_GOAL_SHOOTAREA.rx, STRIKER_GOAL_SHOOTAREA.lx + iOffset, STRIKER_GOAL_SHOOTAREA.rx - iOffset);
        this._vHitDir.z = linearFunction(this._vHitDir.z, STRIKER_GOAL_SHOOTAREA.zmin, STRIKER_GOAL_SHOOTAREA.zmax, STRIKER_GOAL_SHOOTAREA.zmin, STRIKER_GOAL_SHOOTAREA.zmax-iOffset);  

    }

    //console.log(this._vHitDir.x)
    
    this._vHitDir.scale(iPower, this._vHitDir);        
};

CGameStrikerMulti.prototype._setBallDirToOut = function(){
    var iPower = MIN_FORCE_Y;
    this._vHitDir.scale(1/iPower, this._vHitDir);
    
    console.log(this._vHitDir)
    
    //TIGHT THE GOAL AREA
    var iOffset = 0.015;
    //this._vHitDir.x -= 0.01;
    //console.log(this._vHitDir.x)
    
    this._vHitDir.x = linearFunction(this._vHitDir.x, STRIKER_GOAL_SHOOTAREA.lx, STRIKER_GOAL_SHOOTAREA.rx, STRIKER_GOAL_SHOOTAREA.lx - iOffset, STRIKER_GOAL_SHOOTAREA.rx + iOffset);
    this._vHitDir.z = linearFunction(this._vHitDir.z, STRIKER_GOAL_SHOOTAREA.zmin, STRIKER_GOAL_SHOOTAREA.zmax, STRIKER_GOAL_SHOOTAREA.zmin, STRIKER_GOAL_SHOOTAREA.zmax + iOffset);  
    
    console.log(this._vHitDir)
    
    this._vHitDir.scale(iPower, this._vHitDir);    
};  

CGameStrikerMulti.prototype._setBallDirToPost = function(){
    var iPower = MIN_FORCE_Y;
    this._vHitDir.scale(1/iPower, this._vHitDir);

    
    var iTolerance = 0.01;
    
    if(this._vHitDir.z < STRIKER_GOAL_SHOOTAREA.zmax + iTolerance && this._vHitDir.z > STRIKER_GOAL_SHOOTAREA.zmax - iTolerance){
        this._vHitDir.z = STRIKER_GOAL_SHOOTAREA.zmax;

        //this._vHitDir.x should be limited to [STRIKER_GOAL_SHOOTAREA.lx, STRIKER_GOAL_SHOOTAREA.rx];
        this.limitXDir();
        
    }else {
        //this._vHitDir.z should be limited to [STRIKER_GOAL_SHOOTAREA.zmin, STRIKER_GOAL_SHOOTAREA.zmax];
        this.limitZDir();
        
        //set this._vHitDir.x
        if(this._vHitDir.x > 0){
            this._vHitDir.x = STRIKER_GOAL_SHOOTAREA.rx;
        }else {
            this._vHitDir.x = STRIKER_GOAL_SHOOTAREA.lx;
        }
    }
    
    //this._vHitDir = new CANNON.Vec3(0.195,1,0.1865);//LIMITS TOP-LEFT
    //this._vHitDir = new CANNON.Vec3(0.195,1,0.07);//LIMITS BOT-LEFT
    //this._vHitDir = new CANNON.Vec3(-0.2,1,0.1865);//LIMITS TOP-RIGHT
    //this._vHitDir = new CANNON.Vec3(-0.2,1,0.07);//LIMITS BOT-RIGHT
    this._vHitDir.scale(iPower, this._vHitDir);
};

CGameStrikerMulti.prototype.limitZDir = function(){
    if(this._vHitDir.z < STRIKER_GOAL_SHOOTAREA.zmin){
        this._vHitDir.z = STRIKER_GOAL_SHOOTAREA.zmin;
    }else if(this._vHitDir.z > STRIKER_GOAL_SHOOTAREA.zmax){
        this._vHitDir.z = STRIKER_GOAL_SHOOTAREA.zmax;
    }
};

CGameStrikerMulti.prototype.limitXDir = function(){
    if(this._vHitDir.x > STRIKER_GOAL_SHOOTAREA.rx){
        this._vHitDir.x = STRIKER_GOAL_SHOOTAREA.rx;
    }else if(this._vHitDir.x < STRIKER_GOAL_SHOOTAREA.lx){
        this._vHitDir.x = STRIKER_GOAL_SHOOTAREA.lx;
    }
};

CGameStrikerMulti.prototype.onRemoteGoalkeeperResults = function (oData) {  
    this._iShootState = SHOOT_STATE_ANIM;
    
    //console.trace("AWEAWE")
    //this._vHitDir.y = -oData.dir.y;

    //this._vHitDir.z += 10;

    this._bAnimPlayer = true;
    this._oPlayer.setVisible(true);
    
    this._oReleasePoint.x = 0;
    this._oReleasePoint.y = 0;
    
    this.calculateAreaGoal(this._vHitDir);
    
    switch(oData.result){
        case GOALKEEPER_RESULTS_GOAL:{
                this._goalAnimation();
                break;
        }
        case GOALKEEPER_RESULTS_SAVED:{
                this._saveAnimation();
                break;
        }
        case GOALKEEPER_RESULTS_BALLOUT:{
                this._ballOutAnimation();
                break;
        }
        case GOALKEEPER_RESULTS_POSTHIT:{
                this._postHitAnimation();
                break;
        }
    }
    
    
};

CGameStrikerMulti.prototype._updatePlay = function () {
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
    
    this._oTrajectory.update();
    
};

CGameStrikerMulti.prototype.update = function () {
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

CGameStrikerMulti.prototype.checkEndTurn = function () {
    //console.log("INMULTI");

    /*
    s_oGame.endShotPlayer(this._bMultiplayerGoal,this._bMultiplayerBallSaved);
    this.resetScene();
    
    s_oNetworkManager.sendMsg(MSG_END_TURN, "");
    */   
    s_oGame.endShotPlayer(this._bGoal,this._bSaved, this._iBonusShotActive);
    
    var bPlayerWins = s_oGame.checkPlayerWins();

   // setTimeout(function(){
        if(this._bGoal && !this._iBonusShotActive && !bPlayerWins){
            
            var oData;
            if(s_oGame.isStartingUser()){
                oData = s_oGame.generateTheQuiz();
            }else {
                oData = s_oGame.generateTheQuizFromCurOperation();
            }
            
            
            //console.log("MSG_SEND_QUIZ");
            s_oNetworkManager.sendMsg(MSG_SEND_QUIZ, JSON.stringify(oData));
            
        }else {
            //oParent._oResultPanel.hide();
            //console.log("MSG_END_TURN");
            //oParent.endTurn();
            s_oNetworkManager.sendMsg(MSG_END_TURN, "");
        }
    //},1000);
    
    //s_oGame.endShotPlayer(this._bGoal,this._bSaved, this._iBonusShotActive);
    //this.resetScene();
     
};

CGameStrikerMulti.prototype.onQuizReceived = function (oData) {
    //s_oGame.endShotPlayer(this._bGoal,this._bSaved, this._iBonusShotActive);
    this.resetScene();
    
    this._iIDTimeout = setTimeout(function(){
        this._iShootState = SHOOT_STATE_END;
        
        s_oGame.showTheQuiz(oData);
    },1000);    
};

CGameStrikerMulti.prototype.endTurn = function () {
    ////POSSO METTERE TUTTO IN BASE???
    //s_oGame.endShotPlayer(this._bGoal,this._bSaved, this._iBonusShotActive);
    this.resetScene();
    
    this._iIDTimeout = setTimeout(function(){
        s_oGame.changeScenario();
        s_oGame.hideResult();
    },1000);
    
};

CGameStrikerMulti.prototype.checkCPUMoves = function (iPlayerLeft) {
    this._iPlayerLeft = iPlayerLeft;
    
    switch(this._iShootState){
        case SHOOT_STATE_SELECTED:{
                this._setCPUTakeOver();
                break;
        }
    }
};

CGameStrikerMulti.prototype._setCPUTakeOver = function () {
    var oParent = this;
    var iTime = 2000 + Math.random()*2000;
    this._iIDTimeout = setTimeout(function(){
        oParent._bAnimPlayer = true;
        oParent._oPlayer.setVisible(true);

        oParent._oReleasePoint.x = 0;
        oParent._oReleasePoint.y = 0;

        oParent._bMakeGoal = oParent.goalProbability();
    }, iTime);
};

CGameStrikerMulti.prototype.setShootState = function (iState) {
    this._iShootState = iState;
};
