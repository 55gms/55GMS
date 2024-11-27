var CGameGoalkeeperBase = function(iLevel,iCurBallForceY,oParentContainer){
    
    this._oBg;
    this._oScene;
    this._oGloves;
    this._oBall;
    this._oOpponent;
    this._oGoal;
    this._oStageMouseMove;
    this._oListenerClickStage;
    this._oContainerGame;
    this._bBallStoppedAfterLaunch;
    this._bBallOut;
    this._bGoal;
    this._bKeeperSave;
    this._bPerfectSaved;
    this._bLaunched;
    this._bFieldCollide;
    this._iLevel;
    this._iBallSaved;
    this._iGoalOpponent;
    this._iPerfectBallSaved;
    this._iCurBallForceY;
    this._fTimeReset;
    this._aObjects;
    this._vHitDir;

    this._iGameState;
    this._oCamera;
    this._oFade;
    this._oParentContainer;
    this._oBonusText;
    
    this._bTurnEnded = false;
    
    this._oPrevBallPos;
};

CGameGoalkeeperBase.prototype._init = function (iLevel,iCurBallForceY,oParentContainer) {
    this._bGoal = false;
    this._bBallStoppedAfterLaunch = false;
    this._bBallOut = false;
    this._bKeeperSave = false;
    this._bPerfectSaved = false;
    this._bLaunched = false;
    this._bFieldCollide = false;
    this._bPostHit = false;

    this._iCurBallForceY = iCurBallForceY;
    this._iBallSaved = 0;
    this._iGoalOpponent = 0;
    this._iPerfectBallSaved = 0;
    this._iGameState = STATE_INIT;

    this._oParentContainer = oParentContainer;

    this._aObjects = new Array();

    this._iLevel = iLevel;

    this._oContainerGame = new createjs.Container();
    this._oParentContainer.addChild(this._oContainerGame);


    this._oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_game_gk"));
    this._oContainerGame.addChild(this._oBg);

    this._oScene = new CScenarioKeeper();

    if (SHOW_3D_RENDER) {
        this._oCamera = camera;
    } else {
        this._oCamera = createOrthoGraphicCamera();
    }

    var oSpriteOpponent = s_oSpriteLibrary.getSprite("opponent_"+ TEAM_INFO[s_aMatches[this._iLevel-1]].opponent);
    this._oOpponent = new COpponent(600, 340, oSpriteOpponent, this._oContainerGame);

    var oSprite = s_oSpriteLibrary.getSprite('bonus_shot');
    this._oBonusText = createBitmap(oSprite);
    this._oBonusText.x = CANVAS_WIDTH/2;
    this._oBonusText.y = STRIKER_START_BALL_POS.y+58;
    this._oBonusText.regX = oSprite.width/2;
    this._oBonusText.visible = false;
    this._oContainerGame.addChild(this._oBonusText);
    //oBonusText.alpha = 0.8;

    var oSpriteBall = s_oSpriteLibrary.getSprite("ball");
    this._oBall = new CBallKeeper(0, 0, oSpriteBall, this._oScene.ballBody(), this._oContainerGame);

    this._aObjects.push(this._oBall);

    this.ballPosition();

    resizeCanvas3D();
    
    var oBallBody = this._oScene.ballBody();

    var oSpriteGloves = s_oSpriteLibrary.getSprite("gloves");
    this._oGloves = new CGloves(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF, oSpriteGloves, this._oScene.getHandKeeperBody(), this._oContainerGame);

    this._aObjects.push(this._oGloves);

    var oSpriteGoal = s_oSpriteLibrary.getSprite("goal_1");
    this._oGoal = new CGoalGoalkeeper(0, 0, oSpriteGoal, this._oScene.getGoalBody(), this._oContainerGame);

    this._aObjects.push(this._oGoal);

    this._oFade = new createjs.Shape();
    this._oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this._oFade.alpha = 1;
    this._oParentContainer.addChild(this._oFade);
    createjs.Tween.get(this._oFade).to({alpha: 0}, 300, createjs.cubicOut);
};


CGameGoalkeeperBase.prototype.sortDepth = function (oObj1, oObj2) {
    if (oObj1 === null || oObj2 === null) {
        return;
    }
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

/*
CGameGoalkeeperBase.prototype.activeEventListeners = function () {
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
*/

CGameGoalkeeperBase.prototype.clickStage = function(){
    this._oContainerGame.off("click",this._oListenerClickStage);
    this.startOpponentShot();
};

CGameGoalkeeperBase.prototype.deactiveEventListeners = function () {
    if (SHOW_3D_RENDER) {
        window.removeEventListener("mousedown", this.addImpulseToBall);
        window.removeEventListener("mousemove", this.onHandKeeper);
    } else {
        s_oStage.off("stagemousemove", this._oStageMouseMove);
        this._oStageMouseMove = null;
    }
};

CGameGoalkeeperBase.prototype.getBallCoordsInGoalArea = function(){
    var oPos = this._oBall.getPosition();

    /*
    var oShape = new createjs.Shape();
    oShape.graphics.beginFill("red").drawCircle(oPos.x, oPos.y, 5);
    s_oStage.addChild(oShape);
    
    var oShape = new createjs.Shape();
    var iWidth = GOAL_AREA_SIZE_KEEPER.w;
    var iHeight = GOAL_AREA_SIZE_KEEPER.h;
    oShape.graphics.beginFill("blue").drawRect(iX - iWidth/2, iY - iHeight/2 , iWidth, iHeight);
    oShape.alpha = 0.5;
    s_oStage.addChild(oShape);
    */
   
    oPos.x -= GOAL_AREA_SIZE_KEEPER.x;
    oPos.y -= GOAL_AREA_SIZE_KEEPER.y;
   
    return oPos;
};

CGameGoalkeeperBase.prototype.ballPosition = function () {
    var oBallBody = this._oScene.ballBody();

    var oPos2DBall = this.convert3dPosTo2dScreen(oBallBody.position, this._oCamera);

    var fScaleDistance = oPos2DBall.z * (BALL_SCALE_FACTOR - this._oBall.getStartScale()) + this._oBall.getStartScale();

    this.shadowBall(oBallBody, fScaleDistance);

    this._oBall.scale(fScaleDistance);
    this._oBall.setPosition(oPos2DBall.x, oPos2DBall.y);

};

CGameGoalkeeperBase.prototype.shadowBall = function (oBallBody, fScaleDistance) {
    var oFieldBody = this._oScene.getFieldBody();

    var oPosShadow = {x: oBallBody.position.x, y: oBallBody.position.y, z: oFieldBody.position.z};

    var oPos2dShadow = this.convert3dPosTo2dScreen(oPosShadow, this._oCamera);

    var fDistance = oBallBody.position.z - oFieldBody.position.z;

    var fScaleHeight = fScaleDistance / fDistance;
    this._oBall.scaleShadow(fScaleHeight);

    var fDistanceShadow = (-(oBallBody.position.z) - oFieldBody.position.z * 0.1) * 0.1;
    this._oBall.setAlphaByHeight(fDistanceShadow);

    this._oBall.setPositionShadow(oPos2dShadow.x, oPos2dShadow.y);
};

CGameGoalkeeperBase.prototype.resetValues = function () {
    this._iGoalOpponent = 0;
    this._iBallSaved = 0;
    this._iPerfectBallSaved = 0;
};

CGameGoalkeeperBase.prototype.wallSoundCollision = function () {

};
/*
CGameGoalkeeperBase.prototype.onExit = function () {
    this.unload();

    playSound("soundtrack", SOUNDTRACK_GENERAL_VOLUME, true);
    stopSound("crowd");

    s_oMain.changeCanvasSize(1360,640);
    s_oMain.gotoMenu();
};
*/
CGameGoalkeeperBase.prototype.restartLevel = function () {
    this.resetValues();
    this.resetScene();
    this.activeEventListeners();
    this._iGameState = STATE_PLAY;
    this.startOpponentShot();
};

CGameGoalkeeperBase.prototype.resetBallPosition = function () {
    var oBallBody = this._oScene.ballBody();

    oBallBody.position.set(POSITION_BALL.x, POSITION_BALL.y, POSITION_BALL.z);
    this._oScene.setElementVelocity(oBallBody, {x: 0, y: 0, z: 0});
    this._oScene.setElementAngularVelocity(oBallBody, {x: 0, y: 0, z: 0});
};

CGameGoalkeeperBase.prototype.ballFadeForReset = function () {
    if (this._bGoal || this._bKeeperSave) {
        var iWait = 1000;
        if (this._bGoal) {
            iWait = 100;
        }
        if (!this._bFieldCollide) {
            this._oBall.fadeAnimation(0, 300, iWait);
            this._bFieldCollide = true;
        }
    }
    if(this._bBallOut){
        this._oBall.setVisible(false);
    }
};

CGameGoalkeeperBase.prototype._updateInit = function () {
    this._oScene.update();
    this._updateBall2DPosition();
    this._iGameState = STATE_PLAY;
};

CGameGoalkeeperBase.prototype.onHandKeeper = function (e) {
    var oHandKeeperBody = this._oScene.getHandKeeperBody();

    if (!SHOW_3D_RENDER) {
        var oPosMouse = {x: e.stageX / s_fInverseScaling, y: e.stageY / s_fInverseScaling};
    } else {
        var oPosMouse = {x: e.clientX - s_iCanvasOffsetWidth, y: e.clientY - s_iCanvasOffsetHeight};
    }

    if (s_bMobile) {
        oPosMouse.y += MOBILE_OFFSET_GLOVES_Y;
    }else {
        oPosMouse.y += DESKTOP_OFFSET_GLOVES_Y;
    }

    var oMouse3D = this.convert2dScreenPosTo3d(oPosMouse, oHandKeeperBody);

    if (oMouse3D.x < LIMIT_HAND_RANGE_POS.x && oMouse3D.x > -LIMIT_HAND_RANGE_POS.x) {
        oHandKeeperBody.position.x = oMouse3D.x;
    } else {
        if (oMouse3D.x < LIMIT_HAND_RANGE_POS.x) {
            oHandKeeperBody.position.x = -LIMIT_HAND_RANGE_POS.x;
        } else {
            oHandKeeperBody.position.x = LIMIT_HAND_RANGE_POS.x;
        }
    }

    if (oMouse3D.z > LIMIT_HAND_RANGE_POS.zMin && oMouse3D.z < LIMIT_HAND_RANGE_POS.zMax) {
        oHandKeeperBody.position.z = oMouse3D.z;
    } else {
        if (oMouse3D.z > LIMIT_HAND_RANGE_POS.zMin) {
            oHandKeeperBody.position.z = LIMIT_HAND_RANGE_POS.zMax;
        } else {
            oHandKeeperBody.position.z = LIMIT_HAND_RANGE_POS.zMin;
        }
    }

    var oPos2D = this.convert3dPosTo2dScreen(oHandKeeperBody.position, this._oCamera);

    this._oGloves.setPosition(oPos2D.x, oPos2D.y);

    if (this._bPerfectSaved) {
        this.ballInHand(oHandKeeperBody.position);
    }
};

CGameGoalkeeperBase.prototype.ballInHand = function (oPos) {
    var oBallBody = this._oScene.ballBody();

    oBallBody.position.x = oPos.x;
    oBallBody.position.y = oPos.y + BALL_RADIUS * 0.7;
    oBallBody.position.z = oPos.z;

    var oPos2DBall = this.convert3dPosTo2dScreen(oBallBody.position, this._oCamera);

    var fScaleDistance = this._oBall.getStartScale() - oPos2DBall.z;

    this.shadowBall(oBallBody, fScaleDistance);

    this._oBall.setPosition(oPos2DBall.x, oPos2DBall.y);
};

CGameGoalkeeperBase.prototype.convert2dScreenPosTo3d = function (oPos2d) {
    var iWidth = (s_iCanvasResizeWidth);
    var iHeight = (s_iCanvasResizeHeight);

    var mouse3D = new THREE.Vector3((oPos2d.x / iWidth) * 2 - 1, //x
            -(oPos2d.y / iHeight) * 2 + 1, //y
            -1);                                            //z
    mouse3D.unproject(this._oCamera);
    mouse3D.sub(this._oCamera.position);
    mouse3D.normalize();

    var fFactor = 34.0;

    mouse3D.multiply(new THREE.Vector3(fFactor, 1, fFactor));

    return mouse3D;
};

CGameGoalkeeperBase.prototype.convert3dPosTo2dScreen = function (pos, oCamera) {
    var v3 = new THREE.Vector3(pos.x, pos.y, pos.z);
    var vector = v3.project(oCamera);
    var widthHalf = Math.floor(s_iCanvasResizeWidth) * 0.5;
    var heightHalf = Math.floor(s_iCanvasResizeHeight) * 0.5;

    vector.x = ((vector.x * widthHalf) + widthHalf) * s_fInverseScaling;
    vector.y = (-(vector.y * heightHalf) + heightHalf) * s_fInverseScaling;

    return vector;
};

CGameGoalkeeperBase.prototype.timeReset = function () {
    if (this._fTimeReset > 0) {
        //console.log(this._fTimeReset)
        this._fTimeReset -= FPS_TIME;
    } else {
        if(this._bTurnEnded === true){
            return;
        }
        this._bTurnEnded = true;
        
        if (this._bGoal) {
            this._iGoalOpponent++;
            s_oGame.triggerEvent(ON_KEEPER_RESULT, {res: RES_GOAL, pos:this._oPrevBallPos});
        } else {
            this._iBallSaved++;
            s_oGame.triggerEvent(ON_KEEPER_RESULT, {res: RES_SAVED, pos:this._oPrevBallPos});
        }

        this.checkEndTurn();
        //s_oGame.endShotOpponent(this._bGoal,this._bKeeperSave);
        //this.resetScene();

        this._bLaunched = false;
    }
};


CGameGoalkeeperBase.prototype.goalAnimation = function (fForce) {
    if (fForce > 500 && fForce < 1000) {
        this.displayShock(INTENSITY_DISPLAY_SHOCK[0].time, INTENSITY_DISPLAY_SHOCK[0].x, INTENSITY_DISPLAY_SHOCK[0].y);
    } else if (fForce > 999 && fForce < 2000) {
        this.displayShock(INTENSITY_DISPLAY_SHOCK[1].time, INTENSITY_DISPLAY_SHOCK[1].x, INTENSITY_DISPLAY_SHOCK[1].y);
    } else if (fForce > 1999 && fForce < 3000) {
        this.displayShock(INTENSITY_DISPLAY_SHOCK[2].time, INTENSITY_DISPLAY_SHOCK[2].x, INTENSITY_DISPLAY_SHOCK[2].y);
    } else if (fForce > 2999) {
        this.displayShock(INTENSITY_DISPLAY_SHOCK[3].time, INTENSITY_DISPLAY_SHOCK[3].x, INTENSITY_DISPLAY_SHOCK[3].y);
    }
};

CGameGoalkeeperBase.prototype.displayShock = function (iTime, iXIntensity, iYIntensity) {
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

CGameGoalkeeperBase.prototype.resetScene = function () {
    this._bBallStoppedAfterLaunch = false;
    this._bGoal = false;
    this._bBallOut = false;
    this._bKeeperSave = false;
    this.resetBallPosition();
};

CGameGoalkeeperBase.prototype._onEnd = function () {
    this.onExit();
};

CGameGoalkeeperBase.prototype.swapChildrenIndex = function () {
    if(!this._bLaunched){
        return;
    }
    
    for (var i = 0; i < this._aObjects.length - 1; i++) {
        for (var j = i + 1; j < this._aObjects.length; j++) {
            this.sortDepth(this._aObjects[i], this._aObjects[j]);
        }
    }
};

CGameGoalkeeperBase.prototype.rotateGuantes = function () {
    var fDistanceX = (this._oGloves.getX() - CANVAS_WIDTH_HALF) * HAND_KEEPER_ANGLE_RATE;

    this._oGloves.setRotation(fDistanceX);
};

CGameGoalkeeperBase.prototype._updateBall2DPosition = function () {
    if (!this._bPerfectSaved) {
        this.ballPosition();
        this._oBall.rolls();
    }
    
    if(this._bBallOut){
        this._oBall.setVisible(false);
    }

    this._oCamera.updateProjectionMatrix();
    this._oCamera.updateMatrixWorld();
};

CGameGoalkeeperBase.prototype.setBonusShot = function () {
    this._iBonusShotActive = true;
    //s_oInterface.showHelpText(TEXT_BONUS_SHOT);

    this._oBonusText.visible = true;
};