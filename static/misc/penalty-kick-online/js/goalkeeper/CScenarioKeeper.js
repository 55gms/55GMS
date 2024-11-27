function CScenarioKeeper() {
    var _oWorld;
    var _oGroundMaterial;
    var _oBallMaterial;
    var _oWallMaterial;
    var _oHandKeeper;
    var _oBallShape;
    var _oBallBody;
    var _oBallMesh;
    var _oFieldShape;
    var _oFieldBody;
    var _oPoleGoalShapeLeftRight;
    var _oPoleGoalShapeUp;
    var _oGoalBodyPoleLeftRight;
    var _oGoalShapeBackWall;
    var _oGoalShapeLeftRightWall;
    var _oGoalShapeUpWall;
    var _oGoalBodyWall;
    var _oGoalShapeLine;
    var _oGoalBodyLine;
    var _oHandShapeKeeper;
    var _oHandBodyKeeper;
    var _oHandMeshKeeper;
    var _oDemo;
    
    if (SHOW_3D_RENDER)
        _oDemo = new CANNON.Demo();


    this.getDemo = function () {
        return _oDemo;
    };

    this._init = function () {

        if (SHOW_3D_RENDER) {
            _oWorld = _oDemo.getWorld();
        } else {
            _oWorld = new CANNON.World();
        }

        _oWorld.gravity.set(0, 0, -9.81);
        _oWorld.broadphase = new CANNON.NaiveBroadphase();
        _oWorld.solver.iterations = 50;
        _oWorld.solver.tolerance = 0.00001;

        _oGroundMaterial = new CANNON.Material();
        _oBallMaterial = new CANNON.Material();
        _oWallMaterial = new CANNON.Material();
        _oHandKeeper = new CANNON.Material();

        var oWallBallCm = new CANNON.ContactMaterial(
                _oBallMaterial, _oWallMaterial, {
                    friction: 0.1,
                    restitution: 0.5
                });

        var oGroundBallCm = new CANNON.ContactMaterial(
                _oBallMaterial, _oGroundMaterial, {
                    friction: 0.2,
                    restitution: 0.3
                });

        var oHandBallCm = new CANNON.ContactMaterial(
                _oBallMaterial, _oHandKeeper, {
                    friction: 0.5,
                    restitution: 0.1
                });

        _oWorld.addContactMaterial(oWallBallCm);
        _oWorld.addContactMaterial(oGroundBallCm);
        _oWorld.addContactMaterial(oHandBallCm);

        
        s_oScenario._createBallBody();
        s_oScenario._createFieldBody();
        s_oScenario._createGoal();
        s_oScenario.createBackGoalWall();
        s_oScenario.createLineOfGoal();
        s_oScenario.createHandGoalKeeper();
        
    };

    this._createFieldBody = function () {
        _oFieldShape = new CANNON.Plane();
        _oFieldBody = new CANNON.Body({mass: 0, material: _oGroundMaterial});
        _oFieldBody.addShape(_oFieldShape);
        _oFieldBody.position.z = -10;

        _oFieldBody.addEventListener("collide", function (e) {
            s_oScenario.fieldCollision();
        });

        _oWorld.addBody(_oFieldBody);
        if (SHOW_3D_RENDER)
            _oDemo.addVisual(_oFieldBody);
    };

    this._createGoal = function () {
        _oPoleGoalShapeLeftRight = new CANNON.Cylinder(POLE_RIGHT_LEFT_SIZE.radius_top, POLE_RIGHT_LEFT_SIZE.radius_bottom,
                                                                            POLE_RIGHT_LEFT_SIZE.height, POLE_RIGHT_LEFT_SIZE.segments);
        _oGoalBodyPoleLeftRight = new CANNON.Body({mass: 0});
        _oPoleGoalShapeUp = new CANNON.Cylinder(POLE_UP_SIZE.radius_top, POLE_UP_SIZE.radius_bottom,
                POLE_UP_SIZE.height, POLE_UP_SIZE.segments);
        var qRotation = new CANNON.Quaternion();
        qRotation.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
        _oPoleGoalShapeUp.transformAllPoints(new CANNON.Vec3(), qRotation);

        _oGoalBodyPoleLeftRight.addShape(_oPoleGoalShapeLeftRight, new CANNON.Vec3(POLE_UP_SIZE.height * 0.5, 0, 0));
        _oGoalBodyPoleLeftRight.addShape(_oPoleGoalShapeLeftRight, new CANNON.Vec3(-POLE_UP_SIZE.height * 0.5, 0, 0));
        _oGoalBodyPoleLeftRight.addShape(_oPoleGoalShapeUp, new CANNON.Vec3(0, 0, POLE_RIGHT_LEFT_SIZE.height * 0.5));
        _oGoalBodyPoleLeftRight.position.set(GOAL_POSITION.x, GOAL_POSITION.y, GOAL_POSITION.z);

        _oGoalBodyPoleLeftRight.addEventListener("collide", function (e) {
            s_oScenario.poleCollision();
        });

        _oWorld.addBody(_oGoalBodyPoleLeftRight);
        if (SHOW_3D_RENDER) {
            _oDemo.addVisual(_oGoalBodyPoleLeftRight);
        }
    };

    this.createBackGoalWall = function () {
        _oGoalShapeBackWall = new CANNON.Box(new CANNON.Vec3(BACK_WALL_GOAL_SIZE.width, BACK_WALL_GOAL_SIZE.depth, BACK_WALL_GOAL_SIZE.height));
        _oGoalShapeLeftRightWall = new CANNON.Box(new CANNON.Vec3(LEFT_RIGHT_WALL_GOAL_SIZE.width, LEFT_RIGHT_WALL_GOAL_SIZE.depth,
                LEFT_RIGHT_WALL_GOAL_SIZE.height));
        _oGoalShapeUpWall = new CANNON.Box(new CANNON.Vec3(UP_WALL_GOAL_SIZE.width, UP_WALL_GOAL_SIZE.depth,
                UP_WALL_GOAL_SIZE.height));

        _oGoalBodyWall = new CANNON.Body({mass: 0, material: _oWallMaterial});
        _oGoalBodyWall.addShape(_oGoalShapeBackWall);
        _oGoalBodyWall.addShape(_oGoalShapeLeftRightWall, new CANNON.Vec3(BACK_WALL_GOAL_SIZE.width, 0, 0));
        _oGoalBodyWall.addShape(_oGoalShapeLeftRightWall, new CANNON.Vec3(-BACK_WALL_GOAL_SIZE.width, 0, 0));
        _oGoalBodyWall.addShape(_oGoalShapeUpWall, new CANNON.Vec3(0, 0, BACK_WALL_GOAL_SIZE.height));

        _oGoalBodyWall.addEventListener("collide", function (e) {
            s_oScenario.goalCollision(e);
        });

        _oGoalBodyWall.position.set(BACK_WALL_GOAL_POSITION.x, BACK_WALL_GOAL_POSITION.y, BACK_WALL_GOAL_POSITION.z);
        _oWorld.addBody(_oGoalBodyWall);

        //if (SHOW_3D_RENDER)
            //_oDemo.addVisual(_oGoalBodyWall);
    };

    this.createLineOfGoal = function () {
        _oGoalShapeLine = new CANNON.Box(new CANNON.Vec3(BACK_WALL_GOAL_SIZE.width, BACK_WALL_GOAL_SIZE.depth, BACK_WALL_GOAL_SIZE.height));

        _oGoalBodyLine = new CANNON.Body({mass: 0});
        _oGoalBodyLine.addShape(_oGoalShapeLine);
        _oGoalBodyLine.position.set(GOAL_LINE_POS.x, GOAL_LINE_POS.y, GOAL_LINE_POS.z);
        _oGoalBodyLine.collisionResponse = 0;

        _oGoalBodyLine.addEventListener("collide", function (e) {
            s_oScenario.lineGoalCollision();
        });

        _oWorld.addBody(_oGoalBodyLine);

        //if (SHOW_3D_RENDER)
            //_oDemo.addVisual(_oGoalBodyLine);
    };

    this.createHandGoalKeeper = function () {
        _oHandShapeKeeper = new CANNON.Box(new CANNON.Vec3(HAND_KEEPER_SIZE.width, HAND_KEEPER_SIZE.depth, HAND_KEEPER_SIZE.height));

        _oHandBodyKeeper = new CANNON.Body({mass: 0, material: _oHandKeeper});
        _oHandBodyKeeper.addShape(_oHandShapeKeeper);
        _oHandBodyKeeper.position.set(HAND_KEEPER_POSITION.x, HAND_KEEPER_POSITION.y, HAND_KEEPER_POSITION.z);

        _oHandBodyKeeper.addEventListener("collide", function (e) {
            s_oScenario.handCollision(e);
        });

        _oWorld.addBody(_oHandBodyKeeper);

        if (SHOW_3D_RENDER)
            _oHandMeshKeeper = _oDemo.addVisual(_oHandBodyKeeper);
    };


    this._createBallBody = function () {
        _oBallShape = new CANNON.Sphere(BALL_RADIUS);
        _oBallBody = new CANNON.Body({mass: BALL_MASS, material: _oBallMaterial, linearDamping: BALL_LINEAR_DAMPING,
                                                                                    angularDamping: BALL_LINEAR_DAMPING * 2});

        var v3IniPos = new CANNON.Vec3(POSITION_BALL.x, POSITION_BALL.y, POSITION_BALL.z);
        _oBallBody.position.copy(v3IniPos);

        _oBallBody.addShape(_oBallShape);
        _oWorld.add(_oBallBody);
        if (SHOW_3D_RENDER)
            _oBallMesh = _oDemo.addVisual(_oBallBody);
    };

    this.addImpulse = function (oBody, oVec3) {
        var v3WorldPoint = new CANNON.Vec3(0, 0, BALL_RADIUS);
        var v3Impulse = new CANNON.Vec3(oVec3.x, oVec3.y, oVec3.z);
        oBody.applyImpulse(v3Impulse, v3WorldPoint);
    };

    this.addForce = function (oBody, oVec3) {
        var v3WorldPoint = new CANNON.Vec3(0, 0, 0);
        var v3Force = new CANNON.Vec3(oVec3.x, oVec3.y, oVec3.z);
        oBody.applyForce(v3Force, v3WorldPoint);
    };

    this.getBodyVelocity = function (oBody) {
        return oBody.velocity;
    };

    this.ballBody = function () {
        return _oBallBody;
    };

    this.ballMesh = function () {
        return _oBallMesh;
    };

    this.getCamera = function () {
        return _oDemo.camera();
    };

    this.fieldCollision = function () {
        s_oGameKeeper.ballFadeForReset();
        if(s_oInterface.isHelpTextVisible() === false){
            playSound("drop_bounce_grass", 1, false);
        }
    };

    this.collisionWithBall = function () {
        s_oGameKeeper.lineGoalCollision();
    };

    this.setElementAngularVelocity = function (oElement, oVec3) {
        oElement.angularVelocity.set(oVec3.x, oVec3.y, oVec3.z);
    };

    this.setElementVelocity = function (oElement, oVec3) {
        var v3 = new CANNON.Vec3(oVec3.x, oVec3.y, oVec3.z);
        oElement.velocity = v3;
    };

    this.setElementLinearDamping = function (oElement, fValue) {
        oElement.linearDamping = fValue;
    };

    this.getFieldBody = function () {
        return _oFieldBody;
    };

    this.lineGoalCollision = function () {
        s_oGameKeeper.goal();
    };

    this.handCollision = function (e) {
        s_oGameKeeper.keeperSave(e.contact.rj);
    };

    this.update = function () {
        _oWorld.step(PHYSICS_STEP);
    };

    this.getHandKeeperBody = function () {
        return _oHandBodyKeeper;
    };

    this.getHandKeeperMesh = function () {
        return _oHandMeshKeeper;
    };

    this.getGoalBody = function () {
        return _oGoalBodyPoleLeftRight;
    };

    this.goalCollision = function (e) {
        var fForceTot = (e.body.velocity.x * e.body.velocity.x) + (e.body.velocity.y * e.body.velocity.y);
        s_oGameKeeper.goalAnimation(fForceTot);
    };

    this.poleCollision = function () {
        playSound("kick", 1, false);
    };

    this.destroyWorld = function () {
        var aBodies = _oWorld.bodies;
        
        var aTmpBodies = new Array();
        for(var j=0;j<aBodies.length;j++){
            aTmpBodies[j] = aBodies[j];
        }
        
        var iLen = aBodies.length;
        for (var i = 0; i < iLen; i++) {
            _oWorld.removeBody(aTmpBodies[i]);
        }
        _oWorld = null;
    };

    s_oScenario = this;

    if (SHOW_3D_RENDER) {
        _oDemo.addScene("Test", this._init);
        _oDemo.start();
    } else {
        this._init();
    }

}

var s_oScenario;


