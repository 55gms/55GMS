function CScenarioStriker() {
    var _oWorld;
    var _oGroundMaterial;
    var _oBallMaterial;
    var _oWallMaterial;
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
    var _aGoalAreaBody;

    if (SHOW_3D_RENDER)
        var _oDemo = new CANNON.Demo();


    this.getDemo = function () {
        return _oDemo;
    };

    this._init = function () {

        if (SHOW_3D_RENDER) {
            _oWorld = _oDemo.getWorld();
        } else {
            _oWorld = new CANNON.World();
        }

        _aGoalAreaBody = new Array();

        _oWorld.gravity.set(0, 0, -9.81);
        _oWorld.broadphase = new CANNON.NaiveBroadphase();
        _oWorld.solver.iterations = 50;
        _oWorld.solver.tolerance = 0.00001;

        _oGroundMaterial = new CANNON.Material();
        _oBallMaterial = new CANNON.Material();
        _oWallMaterial = new CANNON.Material();

        var oWallBallCm = new CANNON.ContactMaterial(
                _oBallMaterial, _oWallMaterial, {
                    friction: 0.1,
                    restitution: 0.01
                });

        var oGroundBallCm = new CANNON.ContactMaterial(
                _oBallMaterial, _oGroundMaterial, {
                    friction: 0.2,
                    restitution: 0.3
                });


        _oWorld.addContactMaterial(oWallBallCm);
        _oWorld.addContactMaterial(oGroundBallCm);

        s_oScenario._createBallBody();
        s_oScenario._createFieldBody();
        s_oScenario._createGoal();
        s_oScenario.createBackGoalWall();

        if (SHOW_AREAS_GOAL) {
            s_oScenario.createAreasGoal();
        } else {
            s_oScenario.createAreaGoal(GOAL_LINE_POS, BACK_WALL_GOAL_SIZE, COLOR_AREA_GOAL[0], null);
        }

    };

    this.createAreasGoal = function () {
        var iID = 0;
        var fX = FIRST_AREA_GOAL_POS.x;
        var fZ = FIRST_AREA_GOAL_POS.z;
        for (var i = 0; i < NUM_AREA_GOAL.h; i++) {
            for (var j = 0; j < NUM_AREA_GOAL.w; j++) {
                s_oScenario.createAreaGoal({x: fX, y: FIRST_AREA_GOAL_POS.y, z: fZ}, AREA_GOAL_PROPERTIES, COLOR_AREA_GOAL[iID], AREAS_INFO[iID]);
                fX += AREA_GOAL_PROPERTIES.width * 2;
                iID++;
            }
            fX = FIRST_AREA_GOAL_POS.x;
            fZ -= AREA_GOAL_PROPERTIES.height * 2;
        }
    };

    this._createFieldBody = function () {
        _oFieldShape = new CANNON.Plane();
        _oFieldBody = new CANNON.Body({mass: 0, material: _oGroundMaterial});
        _oFieldBody.addShape(_oFieldShape);
        _oFieldBody.position.z = -9;

        _oFieldBody.addEventListener("collide", function (e) {
            s_oScenario.fieldCollision();
        });

        _oWorld.addBody(_oFieldBody);
        if (SHOW_3D_RENDER) {
            var oFieldMaterial = new THREE.MeshPhongMaterial({color: 0x588e30, specular: 0x111111, shininess: 10});//0x588e30
            _oDemo.addVisual(_oFieldBody, oFieldMaterial);
        }
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
        _oGoalBodyPoleLeftRight.position.set(BACK_WALL_GOAL_POSITION.x, BACK_WALL_GOAL_POSITION.y - UP_WALL_GOAL_SIZE.depth, BACK_WALL_GOAL_POSITION.z);

        _oGoalBodyPoleLeftRight.addEventListener("collide", function (e) {
            s_oScenario.poleCollision();
        });

        _oWorld.addBody(_oGoalBodyPoleLeftRight);
        if (SHOW_3D_RENDER) {
            var oGoalMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0x111111, shininess: 50});
            _oDemo.addVisual(_oGoalBodyPoleLeftRight, oGoalMaterial);
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

//        _oGoalBodyWall.addEventListener("collide", function (e) {
//            s_oScenario.goalCollision(e);
//        });

        _oGoalBodyWall.position.set(BACK_WALL_GOAL_POSITION.x, BACK_WALL_GOAL_POSITION.y, BACK_WALL_GOAL_POSITION.z);
        _oWorld.addBody(_oGoalBodyWall);

        if (SHOW_3D_RENDER) {
            _oDemo.addVisual(_oGoalBodyWall);
        }
    };

    this.createAreaGoal = function (oPos, oProperties, oColor, oInfo) {
        var oGoalShapeLine = new CANNON.Box(new CANNON.Vec3(oProperties.width, oProperties.depth, oProperties.height));

        var oGoalBodyLine = new CANNON.Body({mass: 0, userData: oInfo});
        oGoalBodyLine.addShape(oGoalShapeLine);
        oGoalBodyLine.position.set(oPos.x, oPos.y, oPos.z);
        oGoalBodyLine.collisionResponse = 0;

        oGoalBodyLine.addEventListener("collide", function (e) {
            s_oScenario.lineGoalCollision(e);
        });

        _oWorld.addBody(oGoalBodyLine);

        if (SHOW_3D_RENDER) {
            var oMaterial = new THREE.MeshPhongMaterial({color: oColor, specular: 0x111111, shininess: 70});
            _oDemo.addVisual(oGoalBodyLine, oMaterial);
        }

        return oGoalBodyLine;
    };

    this._createBallBody = function () {
        _oBallShape = new CANNON.Sphere(BALL_RADIUS);
        _oBallBody = new CANNON.Body({mass: BALL_MASS, material: _oBallMaterial, linearDamping: BALL_LINEAR_DAMPING,
            angularDamping: BALL_LINEAR_DAMPING * 2});

        var v3IniPos = new CANNON.Vec3(POSITION_BALL.x, POSITION_BALL.y, POSITION_BALL.z);
        _oBallBody.position.copy(v3IniPos);

        _oBallBody.addShape(_oBallShape);
        _oWorld.add(_oBallBody);
        if (SHOW_3D_RENDER) {
            var oBallMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0x111111, shininess: 70});
            _oBallMesh = _oDemo.addVisual(_oBallBody, oBallMaterial);
        }
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
        s_oGameStriker.fieldCollision();
        s_oGameStriker.ballFadeForReset();
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

    this.lineGoalCollision = function (e) {
        s_oGameStriker.areaGoal(e.contact.bj.userData);
    };

    this.update = function () {
        _oWorld.step(PHYSICS_STEP);
    };

    this.getGoalBody = function () {
        return _oGoalBodyPoleLeftRight;
    };

    this.poleCollision = function () {
        s_oGameStriker.poleCollide();
    };

    this.destroyWorld = function () {
        var aBodies = _oWorld.bodies;

        for (var i = 0; i < aBodies.length; i++) {
            _oWorld.remove(aBodies[i]);
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


