var CGameStrikerBase = function(oParentContainer,iCurLevel){
    this._oBg;
    this._oScene;
    this._oBall;
    this._oStartBall;
    this._oGoalKeeper;
    this._oContainerGame;
    this._oClickPoint;
    this._oReleasePoint;
    this._oHitArea;
    this._oPlayer;
    this._oFieldCollision;
    this._oHandSwipeAnim;
    this._oGoal;
    this._bGoal;
    this._bLaunched;
    this._bBallOut;
    this._bFieldCollide;
    this._bAnimPlayer;
    this._bAnimGoalKeeper;
    this._bSaved;
    this._bMakeGoal;
    this._bPoleCollide;
    this._iLevel;
    this._iArea;

    this._iTimePressDown;
    this._fTimeReset;
    this._fTimePoleReset;
    this._fTimeSwipe;
    this._fMultiplier;
    this._aObjects;
    this._vHitDir;

    this._iGameState;
    this._oFade;
    this._oCamera;
    this._oParentContainer;
    this._pGoalSize;

    this._bTurnEnded = false;
    
    this._vPredictedPos;
};

CGameStrikerBase.prototype._init = function (oParentContainer,iCurLevel) {
    
    this.pause(true);

    this._bGoal = false;
    this._bLaunched = false;
    this._bBallOut = false;
    this._bFieldCollide = false;
    this._bAnimPlayer = false;
    this._bAnimGoalKeeper = false;
    this._bSaved = false;
    this._bMakeGoal = false;
    this._bPoleCollide = false;

    this._fMultiplier = 1;

    this._iTimePressDown = 0;
    this._iGameState = STATE_INIT;
    this._iLevel = iCurLevel;

    var iSidePostWidth = 15; 
    var iTopPostHeight = 15; 
    var oSprite = s_oSpriteLibrary.getSprite("goal_0");
    this._pGoalSize = {w: oSprite.width - iSidePostWidth, h: oSprite.height - iTopPostHeight/2};
    
    GOAL_AREA_SIZE_STRIKER = this._pGoalSize;

    this._oParentContainer = oParentContainer;

    this._aObjects = new Array();
    
    this._oContainerGame = new createjs.Container();
    this._oParentContainer.addChild(this._oContainerGame);

    this._oFGContainer = new createjs.Container();
    this._oParentContainer.addChild(this._oFGContainer);

    this._oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_game_striker"));
    this._oBg.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    this._oContainerGame.addChild(this._oBg);

    this._oScene = new CScenarioStriker(this._iLevel);

    if (SHOW_3D_RENDER) {
        this._oCamera = camera;
    } else {
        this._oCamera = createOrthoGraphicCamera();
    }
    
    var oSprite = s_oSpriteLibrary.getSprite("goal_0");

    this._oGoal = new CGoalStriker(251, 28, oSprite, this._oContainerGame);

    var oSprite = s_oSpriteLibrary.getSprite('bonus_shot');
    this._oBonusText = createBitmap(oSprite);
    this._oBonusText.x = CANVAS_WIDTH/2;
    this._oBonusText.y = STRIKER_START_BALL_POS.y+88;
    this._oBonusText.regX = oSprite.width/2;
    this._oBonusText.visible = false;
    this._oContainerGame.addChild(this._oBonusText);
    //oBonusText.alpha = 0.8;

    this._oGoalKeeper = new CGoalKeeper(CANVAS_WIDTH_HALF - 100, CANVAS_HEIGHT_HALF - 225, TEAM_INFO[s_aMatches[this._iLevel-1]].goalkeeper,this._oContainerGame);
    this._aObjects.push(this._oGoalKeeper);

    var oSpriteBall = s_oSpriteLibrary.getSprite("ball");
    this._oBall = new CBallStriker(0, 0, oSpriteBall, this._oScene.ballBody(), this._oContainerGame);
    this._aObjects.push(this._oBall);

    this.ballPosition();

    this._oBall.setVisible(false);

    this._fTimeSwipe = MS_TIME_SWIPE_START;

    this._oStartBall = new CStartBall(STRIKER_START_BALL_POS.x, STRIKER_START_BALL_POS.y, this._oFGContainer);

    this._oPlayer = new CPlayer(CANVAS_WIDTH_HALF - 150, CANVAS_HEIGHT_HALF - 320, this._oFGContainer);
    this._oPlayer.setVisible(false);

    var szImage = "cursor";
    if (s_bMobile) {
        szImage = "hand_touch";
    }
    
    this._oHandSwipeAnim = new CHandSwipeAnim(START_HAND_SWIPE_POS, END_HAND_SWIPE_POS, s_oSpriteLibrary.getSprite(szImage), this._oParentContainer);
    this._oHandSwipeAnim.animAllSwipe();

    this._oFade = new createjs.Shape();
    this._oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this._oFade.alpha = 1;
    this._oParentContainer.addChild(this._oFade);

    resizeCanvas3D();

    this._vHitDir = new CANNON.Vec3(0, 0, 0);

    

    createjs.Tween.get(this._oFade).to({alpha: 0}, 300, createjs.cubicOut);

};

CGameStrikerBase.prototype.sortDepth = function (oObj1, oObj2) {
    if (oObj1.getDepthPos() > oObj2.getDepthPos()) {
        if (this._oContainerGame.getChildIndex(oObj1.getObject()) > this._oContainerGame.getChildIndex(oObj2.getObject())) {
            this._oContainerGame.swapChildren(oObj1.getObject(), oObj2.getObject());
        }
    } else if (oObj1.getDepthPos() < oObj2.getDepthPos()) {
        if (this._oContainerGame.getChildIndex(oObj2.getObject()) > this._oContainerGame.getChildIndex(oObj1.getObject())) {
            this._oContainerGame.swapChildren(oObj2.getObject(), oObj1.getObject());
        }
    }
};

CGameStrikerBase.prototype.poleCollide = function () {
    this._fTimePoleReset = TIME_POLE_COLLISION_RESET;
    this._bPoleCollide = true;
    playSound("pole", 0.4, false);
};

CGameStrikerBase.prototype.fieldCollision = function () {
    if (!this._oFieldCollision && this._bLaunched) {
        this._oFieldCollision = playSound("drop_bounce_grass", 0.3, false);
        this._oFieldCollision.on("end", function () {
            this._oFieldCollision = null;
        });
    }
};

CGameStrikerBase.prototype.ballPosition = function () {
    var oBallBody = this._oScene.ballBody();

    var oPos2DBall = this.convert3dPosTo2dScreen(oBallBody.position, this._oCamera);

    var fScaleDistance = oPos2DBall.z * (BALL_SCALE_FACTOR - this._oBall.getStartScale()) + this._oBall.getStartScale();

    this._oBall.setPosition(oPos2DBall.x, oPos2DBall.y);
    this._oBall.scale(fScaleDistance);

    this.refreshShadowCast(this._oBall, oBallBody, fScaleDistance);
};

CGameStrikerBase.prototype.onMouseDown = function (e) {
    if (this._bLaunched) {
        return;
    }
    this._fTimeSwipe = MS_TIME_SWIPE_START;
    this._oHandSwipeAnim.removeTweens();
    this._oHandSwipeAnim.setVisible(false);
    this._oClickPoint = {x: s_oStage.mouseX, y: s_oStage.mouseY};
    this._oReleasePoint = {x: s_oStage.mouseX, y: s_oStage.mouseY};
};

CGameStrikerBase.prototype.onPressMove = function () {
    this._oReleasePoint = {x: s_oStage.mouseX, y: s_oStage.mouseY};
    this._iTimePressDown += s_iTimeElaps;
};



CGameStrikerBase.prototype.refreshShadowCast = function (oObject, oBody, fScaleDistance) {
    var oFieldBody = this._oScene.getFieldBody();

    if (oBody.position.z < oFieldBody.position.z) {
        oObject.scaleShadow(0);
        return;
    }

    var oPosShadow = {x: oBody.position.x, y: oBody.position.y, z: oFieldBody.position.z};

    var oPos2dShadow = this.convert3dPosTo2dScreen(oPosShadow, this._oCamera);

    var fDistance = (oBody.position.z - BALL_RADIUS) * ((oFieldBody.position.z - SHADOWN_FACTOR) - oFieldBody.position.z) + oFieldBody.position.z;

    var fScaleHeight = fDistance * fScaleDistance;

    oObject.scaleShadow(fScaleHeight);

    if (fScaleHeight < 0) {
        return;
    }

    oObject.setAlphaByHeight(fDistance);

    oObject.setPositionShadow(oPos2dShadow.x, oPos2dShadow.y);
};

CGameStrikerBase.prototype.getLevel = function () {
    return this._iLevel;
};

CGameStrikerBase.prototype.resetValues = function () {
    this._fMultiplier = 1;
};

CGameStrikerBase.prototype.wallSoundCollision = function () {

};

CGameStrikerBase.prototype.areaGoal = function () {
    if (!this._bGoal && !this._bSaved) {
        if (this._bMakeGoal) {
            this._bGoal = true;
            this._fTimeReset = TIME_RESET_AFTER_GOAL;

            playSound("goal_striker", 1, false);

            s_oGame.triggerEvent(ON_STRIKER_RESULT, {res: RES_GOAL, pos:this._vPredictedPos});
            
        } else {
            this.goalKeeperSave();

            s_oGame.triggerEvent(ON_STRIKER_RESULT, {res: RES_SAVED, pos:this._vPredictedPos});
        }
    }
};

CGameStrikerBase.prototype.goalKeeperSave = function () {
    this._bSaved = true;
    this._fTimeReset = TIME_RESET_AFTER_SAVE;

    playSound("ball_saved", 1, false);
    this.rejectBall();
    this._fMultiplier = 1;

};

CGameStrikerBase.prototype.rejectBall = function () {
    this._oBall.getPhysics().velocity.negate(this._oBall.getPhysics().velocity);
    switch (this._iArea) {
        case 12:
            this._oBall.getPhysics().velocity = this._oBall.getPhysics().velocity.vadd(new CANNON.Vec3(this._oBall.getPhysics().velocity.x * 0.4,
                    this._oBall.getPhysics().velocity.y * 0.4, this._oBall.getPhysics().velocity.z * 0.4));
            break;

        default:
            this._oBall.getPhysics().velocity.vsub(new CANNON.Vec3(0, 50, 0));
    }
};

CGameStrikerBase.prototype.predictBallGoalPos = function (pDirection) {
    var iNormalizedX = pDirection.x / pDirection.y;
    var iNormalizedY = pDirection.z / pDirection.y;
    
    var iFinalX = linearFunction(iNormalizedX, STRIKER_GOAL_SHOOTAREA.lx, STRIKER_GOAL_SHOOTAREA.rx, -this._pGoalSize.w/2, this._pGoalSize.w/2);
    /// PARABOLIC FUNCTION. THE Y TEND TO GO BOTTOM TO THE GOAL WINDOW FOR THE GRAVITY. SO THE MORE Z POWER, AND MORE HIGHER IS THE TRAJECTORY
    var iFinalY = (-this._pGoalSize.h/Math.pow(STRIKER_GOAL_SHOOTAREA.zmax,2))*iNormalizedY*iNormalizedY +this._pGoalSize.h/2;
    
    return {x: iFinalX, y: iFinalY};
};

CGameStrikerBase.prototype.calculateAreaGoal = function (pDirection) {
    this._iArea = -1;
    
    var oPos = this.predictBallGoalPos(pDirection);
    
    this._vPredictedPos = oPos;

    var iStartX = -this._pGoalSize.w/2;
    var iStartY = -this._pGoalSize.h/2;
    

    var iCol = linearFunction(oPos.x, iStartX, iStartX+this._pGoalSize.w, 0, NUM_AREA_GOAL.w);
    iCol = Math.floor(iCol);
    if(iCol > NUM_AREA_GOAL.w-1){
        iCol = NUM_AREA_GOAL.w-1;
    }else if(iCol < 0) {
        iCol = 0;
    }

    var iRow = linearFunction(oPos.y, iStartY, iStartY+this._pGoalSize.h, 0, NUM_AREA_GOAL.h);
    iRow = Math.floor(iRow);
    if(iRow > NUM_AREA_GOAL.h-1){
        iRow = NUM_AREA_GOAL.h-1;
    }else if(iRow < 0) {
        iRow = 0;
    }

    //iRow = 1

    this._iArea = iRow*NUM_AREA_GOAL.w + iCol;

    console.log("iCol:"+ iCol, "iRow:"+iRow);
    console.log(oPos);

    return this._iArea;
};

CGameStrikerBase.prototype.goalProbability = function () {
    this._iArea = -1;

    this.calculateAreaGoal(this._vHitDir);

    if (this._iArea === -1) {
        return false;
    }

    var aProb = new Array();

    for (var i = 0; i < MAX_PERCENT_PROBABILITY; i++) {
        aProb.push(false);
        //aProb.push(true)
    }

    for (var i = 0; i < AREAS_INFO[this._iArea].probability; i++) {
        aProb[i] = true;
        //aProb[i] = false;
    }

    var iRandResult = Math.floor(Math.random() * aProb.length);
    return aProb[iRandResult];
};

CGameStrikerBase.prototype.addImpulseToBall = function (oDir) {
    if (this._bLaunched || this._iGameState !== STATE_PLAY) {
        return;
    }
    var oBall = this._oScene.ballBody();
    this._oScene.addImpulse(oBall, oDir);

    this._oScene.setElementAngularVelocity(oBall, {x: 0, y: 0, z: 0});
    this._bLaunched = true;
    this._oBall.setVisible(true);
    this._oStartBall.setVisible(false);
    var oParent = this;
    setTimeout(function(){oParent.chooseDirectionGoalKeeper();},100);
    playSound("kick", 1, false);
};



CGameStrikerBase.prototype.chooseWrongDirGK = function () {
    var aExclusionList = ANIM_GOAL_KEEPER_FAIL_EXCLUSION_LIST[this._iArea];
    
    var aAnim = new Array();
    for(var i=1; i<=AREA_GOALS_ANIM.length;i++){
        if(aExclusionList.indexOf(i) === -1){
            aAnim.push(i);
        }
    }
    
    //console.log(aAnim)
    
    var iRandAnim = Math.floor(Math.random() * aAnim.length);

    this._oGoalKeeper.runAnim(aAnim[iRandAnim]);
};

CGameStrikerBase.prototype.pause = function (bVal) {
    if (bVal) {
        this._iGameState = STATE_PAUSE;
    } else {
        this._iGameState = STATE_PLAY;
    }
    createjs.Ticker.paused = bVal;
};
/*
CGameStrikerBase.prototype.onExit = function () {
    this.unload();

    playSound("soundtrack", SOUNDTRACK_GENERAL_VOLUME, true);
    stopSound("crowd");
    s_oMain.gotoMenu();
};
*/
CGameStrikerBase.prototype.restartLevel = function () {
    this.resetValues();
    this.resetScene();

    this._iGameState = STATE_PLAY;
    this.startOpponentShot();
};

CGameStrikerBase.prototype.resetBallPosition = function () {
    var oBallBody = this._oScene.ballBody();

    oBallBody.position.set(POSITION_BALL.x, POSITION_BALL.y, POSITION_BALL.z);
    this._oScene.setElementVelocity(oBallBody, {x: 0, y: 0, z: 0});
    this._oScene.setElementAngularVelocity(oBallBody, {x: 0, y: 0, z: 0});

    this._oBall.fadeAnimation(1, 500, 0);
    this._oBall.setVisible(false);

    this._oStartBall.setVisible(true);
    this._oStartBall.setAlpha(0);
    this._oStartBall.fadeAnim(1, 500, 0);
};

CGameStrikerBase.prototype.ballFadeForReset = function () {
    if (!this._bSaved || !this._bGoal || !this._bBallOut) {
        return;
    }
    if (!this._bFieldCollide) {
        this._oBall.fadeAnimation(0, 300, 10);
        this._bFieldCollide = true;
    }
};

CGameStrikerBase.prototype._updateInit = function () {
    this._oScene.update();
    this._updateBall2DPosition();
    this._iGameState = STATE_PLAY;
};

CGameStrikerBase.prototype.convert2dScreenPosTo3d = function (oPos2d) {
    var iWidth = (s_iCanvasResizeWidth);
    var iHeight = (s_iCanvasResizeHeight);

    var mouse3D = new THREE.Vector3((oPos2d.x / iWidth) * 2 - 1, //x
            -(oPos2d.y / iHeight) * 2 + 1, //y
            -1);                                            //z
    mouse3D.unproject(this._oCamera);
    mouse3D.sub(this._oCamera.position);
    mouse3D.normalize();

    var fFactor = 0;//object.y

    mouse3D.multiply(new THREE.Vector3(fFactor, 1, fFactor));

    return mouse3D;
};

CGameStrikerBase.prototype.convert3dPosTo2dScreen = function (pos, oCamera) {
    var v3 = new THREE.Vector3(pos.x, pos.y, pos.z);
    var vector = v3.project(oCamera);

    var widthHalf = Math.floor(s_iCanvasResizeWidth) * 0.5;
    var heightHalf = Math.floor(s_iCanvasResizeHeight) * 0.5;


    vector.x = ((vector.x * widthHalf) + widthHalf) * s_fInverseScaling;
    vector.y = (-(vector.y * heightHalf) + heightHalf) * s_fInverseScaling;

    return vector;
};

CGameStrikerBase.prototype.timeReset = function () {

    if (this._fTimeReset > 0) {
        this._fTimeReset -= s_iTimeElaps;
    } else {
        if(this._bTurnEnded === true){
            return;
        }
        this._bTurnEnded = true;
        this.checkEndTurn();
    }
};

CGameStrikerBase.prototype.restartGame = function () {
    this.resetValues();
    this.resetScene();
    this._iGameState = STATE_PLAY;
    this._bLaunched = false;
};


CGameStrikerBase.prototype.goalAnimation = function (fForce) {
    if (fForce > FORCE_BALL_DISPLAY_SHOCK[0].min && fForce < FORCE_BALL_DISPLAY_SHOCK[0].max) {
        this.displayShock(INTENSITY_DISPLAY_SHOCK[0].time, INTENSITY_DISPLAY_SHOCK[0].x, INTENSITY_DISPLAY_SHOCK[0].y);
    } else if (fForce > FORCE_BALL_DISPLAY_SHOCK[1].min && fForce < FORCE_BALL_DISPLAY_SHOCK[1].max) {
        this.displayShock(INTENSITY_DISPLAY_SHOCK[1].time, INTENSITY_DISPLAY_SHOCK[1].x, INTENSITY_DISPLAY_SHOCK[1].y);
    } else if (fForce > FORCE_BALL_DISPLAY_SHOCK[2].min && fForce < FORCE_BALL_DISPLAY_SHOCK[2].max) {
        this.displayShock(INTENSITY_DISPLAY_SHOCK[2].time, INTENSITY_DISPLAY_SHOCK[2].x, INTENSITY_DISPLAY_SHOCK[2].y);
    } else if (fForce > FORCE_BALL_DISPLAY_SHOCK[3].min) {
        this.displayShock(INTENSITY_DISPLAY_SHOCK[3].time, INTENSITY_DISPLAY_SHOCK[3].x, INTENSITY_DISPLAY_SHOCK[3].y);
    }
};

CGameStrikerBase.prototype.displayShock = function (iTime, iXIntensity, iYIntensity) {
    var xShifting = iXIntensity;
    var yShifting = iYIntensity;

    var oParent = this;

    createjs.Tween.get(oParent._oContainerGame).to({x: Math.round(Math.random() * xShifting), y: Math.round(Math.random() * yShifting)}, iTime).call(function () {
        createjs.Tween.get(oParent._oContainerGame).to({x: Math.round(Math.random() * xShifting * 0.8), y: -Math.round(Math.random() * yShifting * 0.8)}, iTime).call(function () {
            createjs.Tween.get(oParent._oContainerGame).to({x: Math.round(Math.random() * xShifting * 0.6), y: Math.round(Math.random() * yShifting * 0.6)}, iTime).call(function () {
                createjs.Tween.get(oParent._oContainerGame).to({x: Math.round(Math.random() * xShifting * 0.4), y: -Math.round(Math.random() * yShifting * 0.4)}, iTime).call(function () {
                    createjs.Tween.get(oParent._oContainerGame).to({x: Math.round(Math.random() * xShifting * 0.2), y: Math.round(Math.random() * yShifting * 0.2)}, iTime).call(function () {
                        createjs.Tween.get(oParent._oContainerGame).to({y: 0, x: 0}, iTime).call(function () {
                        });
                    });
                });
            });
        });
    });
};

CGameStrikerBase.prototype.resetScene = function () {
    this._bGoal = false;
    this._bBallOut = false;
    this._bSaved = false;
    this._bMakeGoal = false;
    this._bPoleCollide = false;
    this._bFieldCollide = false;

    this._oGoalKeeper.fadeAnimation(1);

    this.resetBallPosition();
    this.sortDepth(this._oBall, this._oGoal);
};

CGameStrikerBase.prototype._onEnd = function () {
    this.onExit();
};

CGameStrikerBase.prototype.swapChildrenIndex = function () {
    for (var i = 0; i < this._aObjects.length - 1; i++) {
        for (var j = i + 1; j < this._aObjects.length; j++) {
            if (this._aObjects[i].getObject().visible && this._aObjects[j].getObject().visible)
                this.sortDepth(this._aObjects[i], this._aObjects[j]);
        }
    }
};

CGameStrikerBase.prototype.ballOut = function () {
    if (!this._bBallOut && !this._bGoal && !this._bSaved) {
        var oPos = this._oBall.getPhysics().position;
        if (oPos.y > BALL_OUT_Y || oPos.x > BACK_WALL_GOAL_SIZE.width || oPos.x < -BACK_WALL_GOAL_SIZE.width) {
            
            s_oGame.triggerEvent(ON_STRIKER_RESULT, {res: RES_OUT, pos:this._vPredictedPos});
            
            this._bBallOut = true;
            this._fTimeReset = TIME_RESET_AFTER_BALL_OUT;

            playSound("ball_saved", 1, false);
            this._fMultiplier = 1;
        }
    }
};

CGameStrikerBase.prototype.animGoalKeeper = function () {
    if (this._bLaunched) {
        if (this._bAnimGoalKeeper) {
            this._bAnimGoalKeeper = this._oGoalKeeper.update();
            if (!this._bAnimGoalKeeper) {
                this._oGoalKeeper.viewFrame(this._oGoalKeeper.getAnimArray(), this._oGoalKeeper.getAnimArray().length - 1);
                this._oGoalKeeper.hideFrame(this._oGoalKeeper.getAnimArray(), 0);
            }
        }
    } else {
        this._oGoalKeeper.update();
    }
};

CGameStrikerBase.prototype.resetPoleCollision = function () {
    if (this._fTimePoleReset > 0) {
        this._fTimePoleReset -= s_iTimeElaps;
    } else {
        if (!this._bGoal || !this._bSaved) {
            this._fMultiplier = 1;

            playSound("ball_saved", 1, false);
            this.checkEndTurn();
            this._fTimePoleReset = TIME_POLE_COLLISION_RESET;
            
            s_oGame.triggerEvent(ON_STRIKER_RESULT, {res: RES_OUT, pos:this._vPredictedPos});
        }
    }
};

CGameStrikerBase.prototype.handSwipeAnim = function () {
    if (!this._oHandSwipeAnim || this._oHandSwipeAnim.isAnimate() || this._bLaunched) {
        return;
    }
    if (this._fTimeSwipe > 0) {
        this._fTimeSwipe -= s_iTimeElaps;
    } else {
        
        this._oHandSwipeAnim.animAllSwipe();
        this._oHandSwipeAnim.setVisible(true);
        this._fTimeSwipe = MS_TIME_SWIPE_START;
    }
};

CGameStrikerBase.prototype.swapGoal = function () {
    if (this._oBall.getPhysics().position.z > GOAL_SPRITE_SWAP_Z) {
        this.sortDepth(this._oBall, this._oGoal);
    }
};

CGameStrikerBase.prototype._updateBall2DPosition = function () {

    this.ballPosition();
    this._oBall.rolls();


    this._oCamera.updateProjectionMatrix();
    this._oCamera.updateMatrixWorld();
};

CGameStrikerBase.prototype.setBonusShot = function () {
    this._iBonusShotActive = true;
    //s_oInterface.showHelpText(TEXT_BONUS_SHOT);

    this._oBonusText.visible = true;
};