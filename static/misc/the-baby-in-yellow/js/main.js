var action_manager = {
    day: 1,
    action: 1,
    place1_1: null,
    place1_2: null,
    place1_3: null,
    place1_4: null,
    place1_5: null,
    place1_6: null,
    place1_7: null,
    place1_8: null,
    place1_9: null,
    place1_10: null,
    place1_11: null,
    place1_12: null,
    place1_13: null,
    place1_14: null,
    door_visible: null,
    timer: 0,
    black_screen_animation: function (duration, start, end) {
        var anim = new BABYLON.Animation("myAnimation", "alpha", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys = [];
        keys.push({
            frame: 0,
            value: start
        });
        keys.push({
            frame: duration,
            value: end
        });
        anim.setKeys(keys);
        gui.panel_black.animations = [];
        gui.panel_black.animations.push(anim);
        var anim_ = scene.beginAnimation(gui.panel_black, 0, duration, false);
        return anim_;
    },
    rotate_player: function (position, z_, y_, duration) {
        var anim = BABYLON.Animation.CreateAndStartAnimation("", game.player, "position", 60, duration, game.player.position.clone(), position, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null);
        BABYLON.Animation.CreateAndStartAnimation("", game.camera_vertical_angle, "rotation.z", 60, duration, game.camera_vertical_angle.rotation.z, z_, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null);
        //cc(y_ + " " + game.camera_parent.rotation.y)
        game.camera_parent.rotation.y = (game.camera_parent.rotation.y) % (3.1415 * 2);
        if (game.camera_parent.rotation.y < 0) {
            (game.camera_parent.rotation.y) += (3.1415 * 2);
        }
        y_ = (y_) % (3.1415 * 2);
        //cc(y_ + " " + game.camera_parent.rotation.y)
        BABYLON.Animation.CreateAndStartAnimation("", game.camera_parent, "rotation.y", 60, duration, game.camera_parent.rotation.y, y_, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null);
        return anim;
    },
    load: function () {
        action_manager.timer = 0;
        action_manager.place1_1 = scene.getMeshByName("place1_1");
        action_manager.place1_2 = scene.getMeshByName("place1_2");
        action_manager.place1_3 = scene.getMeshByName("place1_3");
        action_manager.place1_4 = scene.getMeshByName("place1_4");
        action_manager.place1_5 = scene.getMeshByName("place1_5");
        action_manager.place1_6 = scene.getMeshByName("place1_6");
        action_manager.place1_7 = scene.getMeshByName("place1_7");
        action_manager.place1_8 = scene.getMeshByName("place1_8");
        action_manager.place1_9 = scene.getMeshByName("place1_9");
        action_manager.place1_10 = scene.getMeshByName("place1_10");
        action_manager.place1_11 = scene.getMeshByName("place1_11");
        action_manager.place1_12 = scene.getMeshByName("place1_12");
        action_manager.place1_13 = scene.getMeshByName("place1_13");
        action_manager.place1_14 = scene.getMeshByName("place1_14");
        action_manager.door_visible = scene.getMeshByName("door_visible");
    },
    tick: function () {
        var dt = engine.getDeltaTime();
        game.check_position.forEach(function (e) {
            e.visibility = 0;
        });
        var baby_in_chair = 0, baby_in_board = 0, baby_in_cradle = 0;
        var baby_bottle = 0, baby_diaper = 0;
        //chair
        if (game.baby_.intersectsMesh(action_manager.place1_1, true)) {
            baby_in_chair = 1;
        }
        //board
        if (game.baby_.intersectsMesh(action_manager.place1_2, true)) {
            baby_in_board = 1;
        }
        //cradle
        if (game.baby_.intersectsMesh(action_manager.place1_3, true)) {
            baby_in_cradle = 1;
        }
        //bottle
        if (game.baby_.intersectsMesh(game.bottle, true, true)) {
            baby_bottle = 1;
        } //diaper
        if (game.baby_.intersectsMesh(game.diaper, true, true)) {
            baby_diaper = 1;
        }
        if (action_manager.day == 1) {
            //get bottle
            if (action_manager.action == 1) {
                if (baby_in_chair) {
                    gui.text.text = "bring the bottle to the baby";
                    game.baby.rotation.y = 0;
                    if (baby_bottle) {
                        game.sounds.baby_happy1.play();
                        action_manager.timer = 0;
                        game.TAKING = 0;
                        game.bottle.position.x = -99999;
                        action_manager.action = 2;
                        game.set_baby("happy");
                    }
                }
                else {
                    action_manager.place1_1.getChildMeshes()[0].visibility = 1;
                    gui.text.text = "put baby in the chair";
                }
            }
            //get diaper
            else if (action_manager.action == 2) {
              //console.log("action 2 start");
                if (action_manager.timer < 1500) {
                    action_manager.timer += dt;
                    if (action_manager.timer >= 1500) {
                        game.set_baby("sad");
                        game.part.emitRate = 10;
                    }
                }
                if (baby_in_board == 1) {
                    game.diaper.isPickable = true;
                    gui.text.text = "get diaper";
                    if (baby_diaper) {
                        game.sounds.baby_happy2.play();
                        action_manager.action = 3;
                        game.set_baby("happy");
                        game.part.emitRate = 0;
                        game.diaper.position.x = 99999;
                        game.TAKING_OBJ = null;
                        game.TAKING = 0;
                        action_manager.timer = 0;
                    }
                }
                else {
                    action_manager.place1_2.getChildMeshes()[0].visibility = 1;
                    gui.text.text = "";
                    if (action_manager.timer > 1500) {
                        gui.text.text = "put baby in the board";
                    }
                }
            } //end action 2
            else if (action_manager.action == 3) {
              //console.log("action 3 start");
                if (action_manager.timer < 1500) {
                    action_manager.timer += dt;
                    if (action_manager.timer >= 1500) {
                        game.set_baby("sad");
                    }
                }
                if (baby_in_cradle == 1) {
                    game.baby.rotation.y = -Math.PI / 2;
                    if (scene.lights[0].intensity > 90) {
                        gui.text.text = "off lights";
                    }
                    else {
                        if (action_manager.door_visible.metadata.physics.absolutePosition.y > -5) {
                            gui.text.text = "wait the parents";
                            if (game.player.intersectsMesh(action_manager.place1_5, true)) {
                                action_manager.action = 5;
                                controls.enabled = false;
                                game.player.physicsImpostor.sleep();
                                var anim__ = action_manager.rotate_player(new BABYLON.Vector3(24.637935802619353, -1.4999997233666873, 4.607471856807008), -0.06000000000000022, -1.6145981633974484, 60);
                                var anim_ = action_manager.black_screen_animation(120, 0, 1);
                                anim_.onAnimationEnd = function () {
                                    game.day_complete();
                                };
                            }
                            else {
                                action_manager.place1_5.getChildMeshes()[0].visibility = 1;
                            }
                        }
                        else {
                            gui.text.text = "close the door";
                        }
                    }
                }
                else {
                    action_manager.place1_3.getChildMeshes()[0].visibility = 1;
                    gui.text.text = "bring baby to the cradle";
                }
            }
        } //end day 1
        else if (action_manager.day == 2) {
            //get bottle
            if (action_manager.action == 1) {
                if (baby_in_chair) {
                    gui.text.text = "bring the bottle to the baby";
                    game.baby.rotation.y = 0;
                    if (baby_bottle) {
                        game.sounds.baby_happy1.play();
                        action_manager.timer = 0;
                        game.TAKING = 0;
                        game.bottle.position.x = -99999;
                        action_manager.action = 2;
                        game.set_baby("happy");
                    }
                }
                else {
                    action_manager.place1_1.getChildMeshes()[0].visibility = 1;
                    gui.text.text = "put baby in the chair";
                }
            }
            //get diaper
            else if (action_manager.action == 2) {
                if (action_manager.timer < 1500) {
                    action_manager.timer += dt;
                    if (action_manager.timer >= 1500) {
                        game.set_baby("sad");
                        game.part.emitRate = 10;
                    }
                }
                if (baby_in_board == 1) {
                    game.diaper.isPickable = true;
                    gui.text.text = "get diaper";
                    if (game.TAKING == 1 && game.TAKING_OBJ.name == "diaper") {
                        controls.enabled = false;
                        action_manager.action = 15;
                        var anim = action_manager.rotate_player(new BABYLON.Vector3(9.53893473972782, -1.4999998452379204, -5.076542229966369), 0, 0, 30);
                        game.sounds.horror1.play();
                        anim.onAnimationEnd = function () {
                            controls.enabled = true;
                            action_manager.action = 4;
                        };
                        game.baby_physics.position = action_manager.place1_6.position.clone();
                        action_manager.action = 4;
                    }
                }
                else {
                    action_manager.place1_2.getChildMeshes()[0].visibility = 1;
                    gui.text.text = "";
                    if (action_manager.timer > 1500) {
                        gui.text.text = "put baby in the board";
                    }
                }
            } //end action 2
            else if (action_manager.action == 4) {
                if (baby_diaper) {
                    game.sounds.baby_happy2.play();
                    action_manager.action = 3;
                    game.set_baby("happy");
                    game.part.emitRate = 0;
                    game.diaper.position.x = 99999;
                    game.TAKING_OBJ = null;
                    game.TAKING = 0;
                    action_manager.timer = 0;
                }
            }
            else if (action_manager.action == 3) {
                if (action_manager.timer < 1500) {
                    action_manager.timer += dt;
                    if (action_manager.timer >= 1500) {
                        game.set_baby("sad");
                    }
                }
                if (baby_in_cradle == 1) {
                    game.baby.rotation.y = -Math.PI / 2;
                    if (scene.lights[0].intensity > 90) {
                        gui.text.text = "off lights";
                    }
                    else {
                        if (action_manager.door_visible.metadata.physics.absolutePosition.y > -5) {
                            gui.text.text = "wait the parents";
                            if (game.player.intersectsMesh(action_manager.place1_5, true)) {
                                action_manager.action = 15;
                                controls.enabled = false;
                                game.player.physicsImpostor.sleep();
                                BABYLON.Animation.CreateAndStartAnimation("", game.player, "position", 60, 60, game.player.position.clone(), { _isDirty: false, _x: 24.637935802619353, _y: -1.4999997233666873, _z: 4.607471856807008 }, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null);
                                BABYLON.Animation.CreateAndStartAnimation("", game.camera_vertical_angle, "rotation.z", 60, 60, game.camera_vertical_angle.rotation.z, -0.06000000000000022, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null);
                                game.camera_parent.rotation.y = (game.camera_parent.rotation.y) % (3.1415);
                                BABYLON.Animation.CreateAndStartAnimation("", game.camera_parent, "rotation.y", 60, 60, game.camera_parent.rotation.y, -1.6145981633974484, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null);
                                var anim_ = action_manager.black_screen_animation(120, 0, 1);
                                anim_.onAnimationEnd = function () {
                                    var anim2_ = action_manager.black_screen_animation(60, 1, 0);
                                    action_manager.action = 5;
                                    game.sounds.baby_crying.loop = true;
                                    game.sounds.baby_crying.play();
                                    controls.enabled = true;
                                };
                            }
                            else {
                                action_manager.place1_5.getChildMeshes()[0].visibility = 1;
                            }
                        }
                        else {
                            gui.text.text = "close the door";
                        }
                    }
                }
                else {
                    action_manager.place1_3.getChildMeshes()[0].visibility = 1;
                    gui.text.text = "put baby to the cradle";
                }
            } //end action 3
            else if (action_manager.action == 5) {
                gui.text.text = "soothe baby";
                if (action_manager.place1_7.intersectsMesh(game.player, true, true)) {
                    action_manager.action = 6;
                    game.baby.rotation.y = 0;
                    game.baby_physics.position = action_manager.place1_1.position.clone();
                    game.set_baby("cry");
                }
            } //end action 5
            else if (action_manager.action == 6) {
                gui.text.text = "soothe baby";
                if (game.TAKING == 1 && game.TAKING_OBJ.name == "baby_physics") {
                    game.sounds.baby_crying.stop();
                    game.sounds.baby_happy1.play();
                    game.set_baby("happy");
                    action_manager.action = 7;
                    action_manager.timer = 0;
                }
            } //end action 6
            else if (action_manager.action == 7) {
                if (action_manager.timer < 1500) {
                    action_manager.timer += dt;
                    if (action_manager.timer >= 1500) {
                        game.set_baby("sad");
                    }
                }
                if (baby_in_cradle == 1) {
                    game.baby.rotation.y = -Math.PI / 2;
                    if (scene.lights[0].intensity > 90) {
                        gui.text.text = "off lights";
                    }
                    else {
                        if (action_manager.door_visible.metadata.physics.absolutePosition.y > -5) {
                            gui.text.text = "wait the parents";
                            if (game.player.intersectsMesh(action_manager.place1_5, true)) {
                                action_manager.action = 15;
                                controls.enabled = false;
                                game.player.physicsImpostor.sleep();
                                BABYLON.Animation.CreateAndStartAnimation("", game.player, "position", 60, 60, game.player.position.clone(), { _isDirty: false, _x: 24.637935802619353, _y: -1.4999997233666873, _z: 4.607471856807008 }, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null);
                                BABYLON.Animation.CreateAndStartAnimation("", game.camera_vertical_angle, "rotation.z", 60, 60, game.camera_vertical_angle.rotation.z, -0.06000000000000022, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null);
                                game.camera_parent.rotation.y = (game.camera_parent.rotation.y) % (3.1415);
                                BABYLON.Animation.CreateAndStartAnimation("", game.camera_parent, "rotation.y", 60, 60, game.camera_parent.rotation.y, -1.6145981633974484, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null);
                                var anim_ = action_manager.black_screen_animation(120, 0, 1);
                                anim_.onAnimationEnd = function () {
                                    game.day_complete();
                                };
                            }
                            else {
                                action_manager.place1_5.getChildMeshes()[0].visibility = 1;
                            }
                        }
                        else {
                            gui.text.text = "close the door";
                        }
                    }
                }
                else {
                    action_manager.place1_3.getChildMeshes()[0].visibility = 1;
                    gui.text.text = "put baby to the cradle";
                }
            } //end action 7
        }
        else if (action_manager.day == 3) {
            if (action_manager.action == 1) {
                if (baby_in_chair) {
                    gui.text.text = "bring the bottle to the baby";
                    game.baby.rotation.y = 0;
                    if (baby_bottle) {
                        game.sounds.baby_happy1.play();
                        action_manager.timer = 0;
                        game.TAKING = 0;
                        game.bottle.position.x = -99999;
                        action_manager.action = 2;
                        game.set_baby("happy");
                    }
                }
                else {
                    action_manager.place1_1.getChildMeshes()[0].visibility = 1;
                    gui.text.text = "put baby in the chair";
                }
            } //end action 1
            else if (action_manager.action == 2) {
                if (action_manager.timer < 1500) {
                    action_manager.timer += dt;
                    if (action_manager.timer >= 1500) {
                        game.set_baby("sad");
                        game.part.emitRate = 10;
                    }
                }
                if (baby_in_board == 1) {
                    game.diaper.isPickable = true;
                    gui.text.text = "get diaper";
                    if (game.TAKING == 1 && game.TAKING_OBJ.name == "diaper") {
                        game.sounds.horror2.play();
                        action_manager.action = 3;
                        game.part2.emitter = game.diaper;
                        game.part2.manualEmitCount = 25;
                        game.part2.start();
                        game.TAKING = 0;
                        game.TAKING_OBJ = null;
                        game.diaper.isPickable = false;
                        game.diaper.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
                        game.diaper.physicsImpostor.mass = 0;
                        var anim = BABYLON.Animation.CreateAndStartAnimation("", game.diaper, "position", 60, 180, game.diaper.position.clone(), new BABYLON.Vector3(39.5702746704519, 0, -3.326997805112226), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null);
                        anim.onAnimationEnd = function () {
                            game.diaper.isPickable = true;
                            game.diaper.physicsImpostor.mass = 1;
                        };
                    }
                }
                else {
                    action_manager.place1_2.getChildMeshes()[0].visibility = 1;
                    gui.text.text = "";
                    if (action_manager.timer > 1500) {
                        gui.text.text = "put baby in the board";
                    }
                }
            } //end action 2
            if (action_manager.action == 3) {
                gui.text.text = "get diaper";
                if (baby_diaper) {
                    game.sounds.baby_happy2.play();
                    action_manager.action = 4;
                    game.set_baby("happy");
                    game.part.emitRate = 0;
                    game.diaper.position.x = 99999;
                    game.TAKING_OBJ = null;
                    game.TAKING = 0;
                    action_manager.timer = 0;
                }
            } //end action 3
            else if (action_manager.action == 4) {
                if (action_manager.timer < 1500) {
                    action_manager.timer += dt;
                    if (action_manager.timer >= 1500) {
                        game.set_baby("sad");
                    }
                }
                gui.text.text = "put baby to the cradle";
                if (game.TAKING == 1 && game.TAKING_OBJ.name == "baby_physics" && action_manager.place1_9.intersectsMesh(game.player)) {
                    action_manager.action = 100;
                    var anim = action_manager.black_screen_animation(10, 0, 1);
                    anim.onAnimationEnd = function () {
                        game.sounds.horror3.play();
                        var anim2 = action_manager.black_screen_animation(10, 1, 0);
                        anim2.onAnimationEnd = function () {
                            var anim3 = action_manager.black_screen_animation(20, 0, 0);
                            anim3.onAnimationEnd = function () {
                                var anim4 = action_manager.black_screen_animation(20, 0, 1);
                                anim4.onAnimationEnd = function () {
                                    game.sounds.horror3.play();
                                    game.baby_physics.position = action_manager.place1_10.position.clone();
                                    game.TAKING = 0;
                                    game.TAKING_OBJ = null;
                                    game.baby.rotation.y = Math.PI / 2;
                                    var anim5 = action_manager.black_screen_animation(20, 1, 0);
                                    anim5.onAnimationEnd = function () {
                                        action_manager.action = 5;
                                    };
                                };
                            };
                        };
                    };
                }
            } //end action 4
            else if (action_manager.action == 5) {
                if (baby_in_cradle == 1) {
                    game.baby.rotation.y = -Math.PI / 2;
                    if (scene.lights[0].intensity > 90) {
                        gui.text.text = "off lights";
                    }
                    else {
                        if (action_manager.door_visible.metadata.physics.absolutePosition.y > -5) {
                            gui.text.text = "wait the parents";
                            if (game.player.intersectsMesh(action_manager.place1_5, true)) {
                                action_manager.action = 100;
                                controls.enabled = false;
                                game.player.physicsImpostor.sleep();
                                var anim__ = action_manager.rotate_player(new BABYLON.Vector3(24.637935802619353, -1.4999997233666873, 4.607471856807008), -0.06000000000000022, -1.6145981633974484, 60);
                                var anim_ = action_manager.black_screen_animation(120, 0, 1);
                                anim_.onAnimationEnd = function () {
                                    game.day_complete();
                                };
                            }
                            else {
                                action_manager.place1_5.getChildMeshes()[0].visibility = 1;
                            }
                        }
                        else {
                            gui.text.text = "close the door";
                        }
                    }
                }
                else {
                    action_manager.place1_3.getChildMeshes()[0].visibility = 1;
                    gui.text.text = "put baby to the cradle";
                }
            }
        } //end day 3
        else if (action_manager.day == 4) {
            if (action_manager.action == 1) {
                game.bottle.isPickable = false;
                if (baby_in_cradle == 1) {
                    game.baby.rotation.y = -Math.PI / 2;
                    if (scene.lights[0].intensity > 90) {
                        gui.text.text = "off lights";
                    }
                    else {
                        if (action_manager.door_visible.metadata.physics.absolutePosition.y > -5) {
                            gui.text.text = "wait the parents";
                            if (game.player.intersectsMesh(action_manager.place1_5, true)) {
                                game.sounds.baby_crying.loop = true;
                                game.sounds.baby_crying.play();
                                game.set_baby("cry");
                                action_manager.action = 2;
                            }
                            else {
                                action_manager.place1_5.getChildMeshes()[0].visibility = 1;
                            }
                        }
                        else {
                            gui.text.text = "close the door";
                        }
                    }
                }
                else {
                    action_manager.place1_3.getChildMeshes()[0].visibility = 1;
                    gui.text.text = "put baby to the cradle";
                }
            }
            else if (action_manager.action == 2) {
                gui.text.text = "soothe baby";
                if (game.TAKING == 1 && game.TAKING_OBJ.name == "baby_physics") {
                    game.sounds.baby_crying.stop();
                    game.sounds.baby_happy2.play();
                    action_manager.action = 3;
                    game.set_baby("happy");
                    action_manager.timer = 0;
                }
            }
            else if (action_manager.action == 3) {
                if (action_manager.timer < 1500) {
                    action_manager.timer += dt;
                    if (action_manager.timer >= 1500) {
                        game.set_baby("sad");
                    }
                }
                if (baby_in_cradle == 1) {
                    game.baby.rotation.y = -Math.PI / 2;
                    if (scene.lights[0].intensity > 90) {
                        gui.text.text = "off lights";
                    }
                    else {
                        if (action_manager.door_visible.metadata.physics.absolutePosition.y > -5) {
                            gui.text.text = "wait the parents";
                            if (game.player.intersectsMesh(action_manager.place1_11)) {
                                game.baby_physics.position.x = -111111;
                                scene.getMeshByName("feedme").visibility = 0.71;
                                controls.enabled = false;
                                action_manager.action = 4;
                                game.aim.visibility = 0;
                                gui.text.text = "";
                                var anim = action_manager.rotate_player(new BABYLON.Vector3(45.64090768412133, -1.4999997868612254, 24.67882817828709), -0.1, 15.71206850326929, 60);
                                anim.onAnimationEnd = function () {
                                    game.sounds.horror1.play();
                                    controls.enabled = true;
                                    game.aim.isVisible = true;
                                    game.aim.visibility = 100;
                                    gui.text.text = "feed the baby";
                                    game.bottle.isPickable = true;
                                };
                            }
                        }
                        else {
                            gui.text.text = "close the door";
                        }
                    }
                }
                else {
                    action_manager.place1_3.getChildMeshes()[0].visibility = 1;
                    gui.text.text = "put baby to the cradle";
                }
            }
            else if (action_manager.action == 4) {
                if (game.bottle.isPickable == false) {
                    game.bottle.isPickable = true;
                }
                if (game.baby_pickable.isPickable == true) {
                    game.baby_pickable.isPickable = false;
                }
                if (game.TAKING == 1 && game.TAKING_OBJ.name == "bottle" &&
                    game.player.intersectsMesh(action_manager.place1_8)) {
                    controls.enabled = false;
                    action_manager.action = 5;
                    game.aim.visibility = 0;
                    gui.text.text = "";
                    var anim = action_manager.rotate_player(new BABYLON.Vector3(35.96702521211402, -1.5000000827738509, 12.711482258749173), -0.05, 3.17871, 30);
                    anim.onAnimationEnd = function () {
                        game.sounds.horror4.play();
                        game.aim.visibility = 100;
                        controls.enabled = true;
                        gui.text.text = "feed the baby";
                    };
                    game.baby.rotation.y = Math.PI;
                    game.set_baby("angry");
                    game.baby_pickable.isPickable = false;
                    game.baby_physics.physicsImpostor.mass = 0;
                    game.baby_physics.position = action_manager.place1_12.position.clone();
                    game.baby_physics.position.y -= 0.3;
                }
            }
            else if (action_manager.action == 5) {
                if (baby_bottle) {
                    game.sounds.baby_happy1.play();
                    game.baby_physics.physicsImpostor.mass = 1;
                    game.set_baby("happy");
                    game.baby_pickable.isPickable = true;
                    action_manager.timer = 0;
                    action_manager.action = 6;
                    game.TAKING = 0;
                    game.TAKING_OBJ = null;
                    game.bottle.position.x = -100000;
                }
            }
            else if (action_manager.action == 6) {
                if (action_manager.timer < 1500) {
                    action_manager.timer += dt;
                    if (action_manager.timer >= 1500) {
                        game.set_baby("sad");
                        game.part.emitRate = 10;
                        game.part.start();
                    }
                }
                if (baby_in_board == 1) {
                    game.diaper.isPickable = true;
                    gui.text.text = "get diaper";
                    if (game.TAKING == 1 && game.TAKING_OBJ.name == "diaper") {
                        game.set_baby("angry");
                        gui.text.text = "";
                        game.baby_pickable.isPickable = false;
                        game.baby_physics.physicsImpostor.mass = 0;
                        game.baby_physics.position.x -= 1;
                        game.baby.rotation.y = 0;
                        controls.enabled = false;
                        action_manager.action = 7;
                        game.part.emitRate = 0;
                        var anim = action_manager.rotate_player(new BABYLON.Vector3(10.078036479063577, -1.5000001422030764, -3.9787259595444397), 0, 0, 45);
                        anim.onAnimationEnd = function () {
                            var anim_ = action_manager.black_screen_animation(50, 0, 0);
                            anim_.onAnimationEnd = function () {
                                var anim__ = action_manager.black_screen_animation(30, 0, 1);
                                game.sounds.horror3.play();
                                anim__.onAnimationEnd = function () {
                                    scene.lights.forEach(function (e) {
                                        e.diffuse = new BABYLON.Color3(1, 0.6, 0.6);
                                    });
                                    game.baby_physics.position = action_manager.place1_13.position;
                                    game.baby.rotation.y = Math.PI / 2;
                                    var anim___ = action_manager.black_screen_animation(30, 1, 0);
                                    anim___.onAnimationEnd = function () {
                                        controls.enabled = true;
                                        gui.text.text = "soothe baby";
                                    };
                                };
                            };
                        };
                    }
                }
                else {
                    game.diaper.isPickable = false;
                    action_manager.place1_2.getChildMeshes()[0].visibility = 1;
                    gui.text.text = "";
                    if (action_manager.timer > 1500) {
                        gui.text.text = "put baby in the board";
                    }
                }
            }
            else if (action_manager.action == 7) {
                game.set_baby("angry");
                game.baby_physics.physicsImpostor.mass = 0;
                if (game.player.intersectsMesh(action_manager.place1_9)) {
                    action_manager.action = 8;
                    controls.enabled = false;
                    var anim__ = action_manager.black_screen_animation(30, 0, 1);
                    game.sounds.horror3.play();
                    anim__.onAnimationEnd = function () {
                        scene.lights.forEach(function (e) {
                            e.diffuse = new BABYLON.Color3(1, 0.45, 0.45);
                        });
                        game.baby_physics.position = action_manager.place1_11.position;
                        game.baby.rotation.y = 0;
                        var anim___ = action_manager.black_screen_animation(30, 1, 0);
                        anim___.onAnimationEnd = function () {
                            controls.enabled = true;
                        };
                    };
                }
            }
            /*
            52.14164698461259, _y: -1.4999988689363732, _z: 24.13023010634379
            3.08666666666667
            */
            else if (action_manager.action == 8) {
                if (game.player.intersectsMesh(action_manager.place1_11)) {
                    action_manager.action = 9;
                    controls.enabled = false;
                    game.sounds.horror3.play();
                    var anim__ = action_manager.black_screen_animation(30, 0, 1);
                    anim__.onAnimationEnd = function () {
                        game.baby_physics.position = action_manager.place1_14.position;
                        game.baby.rotation.y = Math.PI;
                        var mat = scene.getMaterialByName("eye_");
                        mat.albedoColor = BABYLON.Color3.Red();
                        mat.emissiveColor = BABYLON.Color3.Red();
                        var anim___ = action_manager.black_screen_animation(30, 1, 0);
                        anim___.onAnimationEnd = function () {
                            controls.enabled = true;
                        };
                    };
                }
            }
            else if (action_manager.action == 9) {
                if (game.player.intersectsMesh(action_manager.place1_7)) {
                    game.aim.visibility = 0;
                    action_manager.action = 10;
                    controls.enabled = false;
                    var anim = action_manager.rotate_player(new BABYLON.Vector3(52.3809, -1.4999988689363732, 24.1302301063437), 0, 3.08666666666667, 60);
                    anim.onAnimationEnd = function () {
                        var anim_ = action_manager.black_screen_animation(30, 0, 0);
                        anim_.onAnimationEnd = function () {
                            game.sounds.horror5.play();
                            var anim__ = BABYLON.Animation.CreateAndStartAnimation("", game.baby_physics, "position", 60, 30, game.baby_physics.position, game.baby_physics.position.add(new BABYLON.Vector3(0, 0, 3)), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null);
                            anim__.onAnimationEnd = function () {
                                gui.panel_black.alpha = 1;
                                var anim___ = action_manager.black_screen_animation(60, 1, 1);
                                anim___.onAnimationEnd = function () {
                                    game.day_complete();
                                };
                            };
                        };
                    };
                }
            }
        }
    }
};
var controls = {
    vertical: 0, horizontal: 0,
    w: 0, s: 0, d: 0, a: 0,
    up: 0, down: 0, right: 0, left: 0,
    shot1: 0, shot2: 0,
    rotation: 0,
    vertical_rotation: 0,
    //y_left: null as BABYLON.VirtualJoystick,
    enabled: true,
    mouse_btn: function (e, v) {
        if (e != undefined) {
            if (e.button == 0) {
                controls.shot2 = 1;
            }
            if (e.button == 2) {
                controls.shot1 = 1;
            }
        }
        else if (v != undefined) {
            if (v.button == 0) {
                controls.shot2 = 1;
            }
            if (v.button == 2) {
                controls.shot1 = 1;
            }
        }
    },
    keydown: function (e) {
        if (game.WIN == 0) {
            if (e.code == "Space") {
                /*scene.getMeshByName("feedme").visibility = 0.71;

                controls.enabled = false;
                action_manager.action = 40;
                game.aim.visibility = 0;
                gui.text.text = "";
                var anim = action_manager.rotate_player(
                    new BABYLON.Vector3(45.64090768412133,  -1.4999997868612254,  24.67882817828709),
                    -0.05,
                    15.71206850326929,60
                );

                anim.onAnimationEnd=()=>{
                    game.aim.visibility = 100;
                    controls.enabled = true;
                    gui.text.text = "feed the baby";
                }*/
                //cc(game.player.position);
                //cc(game.camera_vertical_angle.rotation);
                //cc(game.camera_parent.rotation.y)
            }
            if (e.code == "KeyW" || e.code == "ArrowUp") {
                controls.w = 1;
            }
            if (e.code == "KeyS" || e.code == "ArrowDown") {
                controls.s = 1;
            }
            if (e.code == "KeyA" || e.code == "ArrowLeft") {
                controls.a = 1;
            }
            if (e.code == "KeyD" || e.code == "ArrowRight") {
                controls.d = 1;
            }
        }
    },
    keyup: function (e) {
        if (game.WIN == 0) {
            if (e.code == "KeyW" || e.code == "ArrowUp") {
                controls.w = 0;
            }
            if (e.code == "KeyS" || e.code == "ArrowDown") {
                controls.s = 0;
            }
            if (e.code == "KeyA" || e.code == "ArrowLeft") {
                controls.a = 0;
            }
            if (e.code == "KeyD" || e.code == "ArrowRight") {
                controls.d = 0;
            }
        }
    },
    blur: function () {
    },
    mousedown: function (e) {
        if (game.WIN == 0) {
            controls.mouse_btn(e, undefined);
        }
    },
    mousemove: function (e) {
        if (game.WIN == 0) {
            var movementX = e.movementX ||
                e.mozMovementX ||
                e.webkitMovementX ||
                0;
            var movementY = e.movementY ||
                e.mozMovementY ||
                e.webkitMovementY ||
                0;
            controls.rotation = movementX / 150;
            controls.vertical_rotation = movementY / 150;
        }
    },
    init: function () {
        controls.enabled = false;
        controls.vertical = 0;
        controls.horizontal = 0;
        controls.w = 0;
        controls.s = 0;
        controls.d = 0;
        controls.a = 0;
        controls.up = 0;
        controls.down = 0;
        controls.right = 0;
        controls.left = 0;
        controls.shot1 = 0;
        controls.shot2 = 0;
        controls.rotation = 0;
        controls.vertical_rotation = 0;
        document.addEventListener("mousemove", controls.mousemove, false);
        scene.onPointerDown = function (e, v) {
            if (e.pointerType == "mouse" && game.WIN == 0 && controls.enabled) {
                try {
                    document.body.requestPointerLock = document.body.requestPointerLock ||
                        document.body.mozRequestPointerLock ||
                        document.body.webkitRequestPointerLock;
                    document.body.requestPointerLock();
                }
                catch (error) {
                }
                controls.mouse_btn(undefined, e);
            }
            if (e.pointerType == "touch") {
                if (game.WIN == 0) {
                    game.t_x = scene.pointerX;
                    game.t_y = scene.pointerY;
                    var picked = scene.pick(game.t_x, game.t_y);
                    if (picked.hit) {
                        if (picked.pickedMesh.name == "control1") {
                            game.point1.setParent(null);
                            game.point1.position = picked.pickedPoint.clone();
                            game.point1.setParent(scene.getMeshByName("control1"));
                        }
                    }
                }
            }
        };
        scene.onPointerUp = function (e, v) {
            game.t_x = scene.pointerX;
            game.t_y = scene.pointerY;
            var picked = scene.pick(game.t_x, game.t_y);
            if (e.pointerType == "touch") {
            }
            else if (e.pointerType == "mouse") {
            }
        };
        scene.onPointerMove = function (e, v) {
            if (e.pointerType == "mouse") {
                if (gui.touch_controls.parent != null) {
                    gui.avd.removeControl(gui.touch_controls);
                    //document.body.addEventListener("mousemove", controls.mousemove)
                }
            }
            if (e.pointerType == "touch") {
                if (gui.touch_controls.parent == null) {
                    gui.avd.addControl(gui.touch_controls);
                    document.body.removeEventListener("mousemove", controls.mousemove);
                }
                game.t_x = scene.pointerX;
                game.t_y = scene.pointerY;
                var picked = scene.pick(game.t_x, game.t_y);
                if (picked.hit) {
                    if (picked.pickedMesh.name == "control1") {
                        var x_ = game.point1.position.x;
                        var y_ = game.point1.position.z;
                        // game.point1.visibility = 0.5;
                        game.point1.setParent(null);
                        game.point1.position = picked.pickedPoint.clone();
                        game.point1.setParent(scene.getMeshByName("control1"));
                        controls.rotation += (game.point1.position.x - x_) * 25;
                        controls.vertical_rotation -= (game.point1.position.z - y_) * 5;
                        gui.text.text = game.point1.position.z + "\n" + y_;
                        var max_rotation = 0.065;
                        if (controls.rotation < -max_rotation) {
                            controls.rotation = -max_rotation;
                        }
                        if (controls.rotation > max_rotation) {
                            controls.rotation = max_rotation;
                        }
                    }
                }
            }
            ;
            document.addEventListener("keydown", controls.keydown);
            document.addEventListener("keyup", controls.keyup);
            document.addEventListener("blur", controls.blur);
            document.addEventListener("mousedown", controls.mousedown, false);
            var elem;
            var havePointerLock = 'pointerLockElement' in document ||
                'mozPointerLockElement' in document ||
                'webkitPointerLockElement' in document;
        };
    }
};
function game_load() {
    BABYLON.SceneLoader.Load("3d/", "root_game_.babylon", engine, function (sc) {
        game.files_count = 2;
        game.files_loaded = 0;
        scene = sc;
        scene.onReadyObservable.add(function () {
            engine.runRenderLoop(game.tick);
        });
        if (game.sounds.door == null) {
            game.sounds.door = new BABYLON.Sound("", "sounds/door.wav", scene2);
            game.sounds.switch = new BABYLON.Sound("", "sounds/switch.wav", scene2);
            game.sounds.baby_happy1 = new BABYLON.Sound("", "sounds/baby_happy1.wav", scene2);
            game.sounds.baby_happy2 = new BABYLON.Sound("", "sounds/baby_happy2.wav", scene2);
            game.sounds.baby_crying = new BABYLON.Sound("", "sounds/baby_crying.wav", scene2);
            game.sounds.horror1 = new BABYLON.Sound("", "sounds/horror1.wav", scene2);
            game.sounds.horror2 = new BABYLON.Sound("", "sounds/horror2.wav", scene2);
            game.sounds.horror3 = new BABYLON.Sound("", "sounds/horror3.wav", scene2);
            game.sounds.horror4 = new BABYLON.Sound("", "sounds/horror4.wav", scene2);
            game.sounds.horror5 = new BABYLON.Sound("", "sounds/horror5.wav", scene2);
        }
        scene.getMaterialByName("lights_").emissiveColor = new BABYLON.Color3(1, 1, 1);
        //asset loader
        var assetsManager = new BABYLON.AssetsManager(scene);
        var task1 = assetsManager.addHDRCubeTextureTask("hrd1", "3d/env_min.hdr", 128);
        task1.onSuccess = function (e) {
            game.envtext = e.texture;
        };
        var task2 = assetsManager.addMeshTask("baby", ["babys", "baby", "sad", "angry", "happy", "cry"], "3d/", "baby.babylon");
        task2.onSuccess = function (e) { };
        assetsManager.load();
        assetsManager.onFinish = function () {
            game_file_loaded();
        };
        game.file_loaded();
    });
}
function game_file_loaded() {
    game.files_loaded++;
    if (game.files_count == game.files_loaded) {
        action_manager.action = 1;
        action_manager.load();
        var gravityVector = new BABYLON.Vector3(0, -10, 0);
        var physicsPlugin = new BABYLON.AmmoJSPlugin();
        scene.enablePhysics(gravityVector, physicsPlugin);
        gui.load();
        controls.init();
        game.LAST_ANGLE = 0;
        game.WIN = 0;
        game.LEVEL = 1;
        game.TAKING = 0;
        scene.getMeshesByTags("level").forEach(function (e) {
            if (e.name == "level" + game.LEVEL) {
            }
            else {
                e.dispose();
            }
        });
        scene.getMeshByName("control1").visibility = 0;
        scene.getMeshesByTags("move_helper").forEach(function (e) { e.isVisible = false; });
        game.camera_parent = scene.getMeshByName("camera_parent");
        game.camera_vertical_angle = scene.getMeshByName("camera_vertical_angle");
        scene.cameras[0].parent.setParent(game.camera_vertical_angle);
        game.point1 = scene.getMeshByName("point1");
        var howdo = scene.getMeshesByTags("howdo")[0];
        if (howdo != null) {
            howdo.isVisible = true;
        }
        scene.getMeshesByTags("block").forEach(function (e) {
            e.getChildMeshes().forEach(function (ee) { ee.isVisible = false; });
        });
        scene.getMeshesByTags("block_visible").forEach(function (e) {
        });
        scene.getMeshesByTags("visible").forEach(function (e) {
            e.isVisible = true;
            e.visibility = 1;
        });
        game.diaper = scene.getMeshByName("diaper");
        game.check_position = scene.getMeshesByTags("check_position");
        game.bottle = scene.getMeshByName("bottle");
        game.player_hand = scene.getMeshByName("player_hand");
        game.player_hand.visibility = 1;
        game.baby = scene.getMeshByName("babys");
        game.baby_pickable = scene.getMeshByName("baby");
        game.baby_ = scene.getMeshByName("baby_");
        game.baby.setParent(game.baby_);
        game.baby.position = new BABYLON.Vector3(0, 0, 0);
        game.baby.position.y += -0.6;
        game.baby_physics = scene.getMeshByName("baby_physics");
        game.baby_physics.physicsImpostor = new BABYLON.PhysicsImpostor(game.baby_physics, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 1,
            positionIterations: 0,
            velocityIterations: 0,
            friction: 1
        }, scene);
        game.baby_physics.physicsImpostor.executeNativeFunction(function (w, b) {
            b.setFriction(20);
            //b.setAngularFactor(new Ammo.btVector3(0, 0, 0))
        });
        scene.getMeshesByTags("door_root").forEach(function (e) {
            var childs = e.getChildMeshes();
            var visible;
            var physics;
            childs.forEach(function (ee) {
                if (BABYLON.Tags.MatchesQuery(ee, "door_physics")) {
                    physics = ee;
                    ee.setParent(null);
                }
                if (BABYLON.Tags.MatchesQuery(ee, "door_visible")) {
                    visible = ee;
                }
            });
            visible.metadata = {
                rotation: -Math.PI / 2,
                is_open: true,
                root: e,
                physics: physics
            };
            if (e.name == "door_.003") {
                visible.metadata.rotation *= -1;
            }
        });
        scene.getMeshesByTags("physics").forEach(function (e) {
            e.physicsImpostor = new BABYLON.PhysicsImpostor(e, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
        });
        scene.getMeshesByTags("novisible || invisible").forEach(function (e) {
            e.visibility = 0;
        });
        scene.getMeshesByTags("visible").forEach(function (e) {
            e.visibility = 1;
            e.isVisible = true;
        });
        game.aim = scene.getMeshByName("aim");
        game.aim.visibility = 1;
        game.aim.isVisible = true;
        scene.getMaterialByName("aim_").emissiveColor = new BABYLON.Color3(1, 1, 1);
        game.player = scene.getMeshByName("player");
        game.player.visibility = 0;
        game.player.physicsImpostor = new BABYLON.PhysicsImpostor(game.player, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, }, scene);
        game.ground = scene.getMeshByName("ground");
        game.ground.physicsImpostor = new BABYLON.PhysicsImpostor(game.ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
        document.getElementById("lock_loader").style.visibility = "hidden";
        // Fog
        /*  var color_ = "#000000";
          scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
          scene.fogColor = BABYLON.Color3.FromHexString(color_);
          scene.fogDensity = 150;
          scene.fogStart = 2.0;
          scene.fogEnd =30.0;*/
        //scene.environmentTexture = game.envtext;
        scene.environmentIntensity = 0;
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
        scene.onAfterPhysicsObservable.add(after_physics);
        //game.light.dispose();
        //game.physics_light.dispose();
        var shadow_caster = scene.getMeshesByTags("shadow_caster");
        scene.lights.forEach(function (e) {
            var shadows = new BABYLON.ShadowGenerator(256, e);
            //shadows.useContactHardeningShadow = true;
            shadows.getShadowMap().refreshRate
                = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
            shadows.bias = 0.0001;
            shadows.darkness = 0.45;
            shadow_caster.forEach(function (ee) {
                shadows.addShadowCaster(ee);
                if (ee.name == "wall") {
                }
            });
        });
        game.diaper.physicsImpostor.mass = 1;
        game.bottle.physicsImpostor.mass = 1;
        scene.getMaterialByName("check_position").emissiveColor =
            BABYLON.Color3.Green();
        scene.getMaterialByName("tv").emissiveColor =
            BABYLON.Color3.White();
        game.player.position = scene.getMeshByName("start").position.clone();
        game.camera_parent.rotation.y -= (Math.PI / 4);
        game.baby.rotation.y = (Math.PI / 2);
        // Create a particle system
        var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
        particleSystem.particleTexture = new BABYLON.Texture("images/particle.png", scene);
        particleSystem.color1 = BABYLON.Color4.FromHexString("#694d00ff");
        particleSystem.color2 = BABYLON.Color4.FromHexString("#694d00ff");
        particleSystem.emitter = game.baby_;
        particleSystem.blendMode = 1;
        particleSystem.emitRate = 0;
        particleSystem.colorDead = BABYLON.Color4.FromHexString("#694d00ff");
        particleSystem.minSize = 0.05;
        particleSystem.maxSize = 0.25;
        particleSystem.start();
        game.part = particleSystem;
        // Create a particle system
        particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
        particleSystem.particleTexture = new BABYLON.Texture("images/particle.png", scene);
        particleSystem.color1 = BABYLON.Color4.FromHexString("#ffffffff");
        particleSystem.color2 = BABYLON.Color4.FromHexString("#ffffffff");
        particleSystem.direction1 = new BABYLON.Vector3(10, 10, 10);
        particleSystem.direction2 = new BABYLON.Vector3(-10, 10, -10);
        particleSystem.blendMode = 1;
        particleSystem.emitRate = 0;
        particleSystem.colorDead = BABYLON.Color4.FromHexString("#ffffffff");
        particleSystem.minSize = 0.05;
        particleSystem.maxSize = 0.25;
        particleSystem.start();
        game.part2 = particleSystem;
        //var from_ = scene.skeletons[0].getAnimationRange("baby").from;
        //var to_ = scene.skeletons[0].getAnimationRange("baby").to;
        //baby.visibility = 1;
        //scene.beginAnimation(scene.skeletons[0],from_,to_,true,1);
        game.baby_position_at_start = game.baby_physics.position.clone();
        game.diaper_position_at_start = game.diaper.position.clone();
        game.bottle_position_at_start = game.bottle.position.clone();
        scene.getMaterialByName("feedme").emissiveColor =
            BABYLON.Color3.Red();
        game.baby_physics.visibility = 0;
        game.baby_.visibility = 0;
        game.baby.visibility = 0;
        game.set_baby("baby");
    }
}
function game_tick() {
    time_playing = ((new Date().getTime() / 1000) - time_start);
    ;
    on_game_tick(time_playing);
    if (!controls.enabled) {
        controls.shot1 = 0;
        controls.shot2 = 0;
        controls.a = 0;
        controls.d = 0;
        controls.w = 0;
        controls.s = 0;
        controls.vertical_rotation = 0;
        controls.rotation = 0;
    }
    var dt = engine.getDeltaTime();
    if (canvas.width > canvas.height) {
        gui.avd.idealHeight = 1000;
        gui.avd.idealWidth = 0;
    }
    else {
        gui.avd.idealHeight = 0;
        gui.avd.idealWidth = 1000;
    }
    var tag_connector = "";
    var tag_segment = "";
    var respective_hand_visible;
    //raycast
    if (controls.shot2 == 1) {
        if (game.TAKING == 1) {
            game.TAKING = 0;
            game.TAKING_OBJ.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
        }
        else {
            var origin = scene.cameras[0].parent.absolutePosition;
            var direction = BABYLON.Vector3.Normalize(game.aim.absolutePosition.subtract(scene.cameras[0].parent.absolutePosition));
            var length = 5;
            var ray = new BABYLON.Ray(origin, direction, length);
            var hit = scene.pickWithRay(ray);
            var aim_correct = false;
            if (hit.pickedMesh) {
                if (hit.pickedMesh.name == "diaper") {
                    game.TAKING = 1;
                    game.TAKING_OBJ = game.diaper;
                }
                if (hit.pickedMesh.name == "bottle") {
                    game.TAKING = 1;
                    game.TAKING_OBJ = game.bottle;
                }
                if (game.TAKING == 0 && BABYLON.Tags.MatchesQuery(hit.pickedMesh, "door_visible")) {
                    //open/close door
                    var root = hit.pickedMesh.metadata.root;
                    var door = hit.pickedMesh;
                    var physics = hit.pickedMesh.metadata.physics;
                    hit.pickedMesh.isPickable = false;
                    var angle_move = door.metadata.rotation;
                    var is_open_at_end = true;
                    var physics_displace = 10;
                    if (door.metadata.is_open) {
                        var angle_move = -door.metadata.rotation;
                        var is_open_at_end = false;
                        var physics_displace = -10;
                    }
                    else {
                    }
                    door.metadata.is_open = is_open_at_end;
                    physics.position.y += physics_displace;
                    game.sounds.door.play();
                    var animation = BABYLON.Animation.CreateAndStartAnimation("", root, "rotation.y", 60, 10, root.rotation.y, root.rotation.y + angle_move, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                    animation.onAnimationEnd = function () {
                        door.isPickable = true;
                    };
                }
                if (game.TAKING == 0 && hit.pickedMesh.name == "baby") {
                    game.TAKING = 1;
                    game.TAKING_OBJ = game.baby_physics;
                }
                if (game.TAKING == 0 && BABYLON.Tags.MatchesQuery(hit.pickedMesh, "light_switcher")) {
                    var switch_ = 20;
                    var angle_switcher = 1;
                    game.sounds.switch.play();
                    if (scene.lights[0].intensity < 90) {
                        switch_ = 100;
                        angle_switcher = -1;
                    }
                    scene.lights.forEach(function (e) {
                        e.intensity = switch_;
                        hit.pickedMesh.getChildMeshes()[0].scaling.y = angle_switcher;
                    });
                }
            }
            else {
            }
        }
    }
    if (game.TAKING == 1) {
        //baby move
        var distance_to_player = BABYLON.Vector3.Distance(game.player_hand.absolutePosition, game.TAKING_OBJ.absolutePosition);
        var angle_direction = game.player_hand.absolutePosition.subtract(game.TAKING_OBJ.absolutePosition);
        game.TAKING_OBJ.physicsImpostor.setLinearVelocity(angle_direction.scale(15));
    }
    game.baby_.position = game.baby_physics.position.clone();
    var baby_visible_position = game.baby_.absolutePosition.clone();
    var player_position = game.player.absolutePosition.clone();
    controls.shot1 = 0;
    controls.shot2 = 0;
    var move_target;
    var name_move = "p";
    if (controls.w == 1 || controls.up == 1) {
        name_move += "_front";
    }
    if (controls.s == 1 || controls.down == 1) {
        name_move += "_back";
    }
    if (controls.a == 1 || controls.left == 1) {
        name_move += "_left";
    }
    if (controls.d == 1 || controls.right == 1) {
        name_move += "_right";
    }
    move_target = scene.getMeshByName(name_move);
    if (move_target != null) {
        var move = move_target.absolutePosition.clone().subtract(game.camera_parent.absolutePosition.clone()).
            scale(3);
        game.player.physicsImpostor.setLinearVelocity(move);
    }
    else {
        game.player.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
    }
    /*
    var corrects = 0;
    var lights_count = 0; var lights_ready = 0;
    scene.getMeshesByTags("light_", (e) => {
      lights_count++;
      if (e.metadata.correct > 0 && e.metadata.incorrect == 0) {
        corrects++; lights_ready++;
      } else {
        all_lights_complete = 0;

      }
      loopindex++;
    });
    gui.lights_ready.text = lights_count + "/" + lights_ready
    gui.load_checker.rotation += 0.01 * dt;
    */
    action_manager.tick();
    try {
        scene.render();
    }
    catch (error) {
    }
}
;
function after_physics() {
    var dt = engine.getDeltaTime();
    game.camera_parent.position = game.player.position.clone().add(new BABYLON.Vector3(0, 2, 0));
    game.camera_parent.rotation.y += controls.rotation;
    controls.rotation = 0;
    game.camera_vertical_angle.rotation.z -= controls.vertical_rotation;
    game.camera_vertical_angle.rotation.z =
        Math.min(0.4, Math.max(game.camera_vertical_angle.rotation.z, -1.1));
    controls.vertical_rotation = 0;
    game.camera_parent.computeWorldMatrix();
    if (controls.enabled) {
        game.baby_physics.physicsImpostor.wakeUp();
    }
    game.bottle.physicsImpostor.wakeUp();
    game.diaper.physicsImpostor.wakeUp();
}
var game = {
    load: null,
    tick: null,
    file_loaded: null,
    files_count: 2,
    files_loaded: 0,
    envtext: null,
    engine: null,
    sounds: {
        door: null,
        switch: null,
        baby_happy1: null,
        baby_happy2: null,
        baby_crying: null,
        horror1: null,
        horror2: null,
        horror3: null,
        horror4: null,
        horror5: null,
        enabled: true
    },
    t_x: null,
    t_y: null,
    box_: null,
    aim: null,
    baby_position_at_start: null,
    diaper_position_at_start: null,
    bottle_position_at_start: null,
    point1: null,
    //point2: null as BABYLON.Mesh | BABYLON.AbstractMesh,
    //segment_: null as BABYLON.Mesh | BABYLON.AbstractMesh,
    //segment1: null as BABYLON.Mesh | BABYLON.AbstractMesh,
    //segment2: null as BABYLON.Mesh | BABYLON.AbstractMesh,
    //segment_vertex: null as BABYLON.Mesh | BABYLON.AbstractMesh,
    part: null,
    part2: null,
    player: null,
    diaper: null,
    bottle: null,
    baby: null,
    baby_pickable: null,
    baby_: null,
    baby_physics: null,
    player_hand: null,
    //hand_2_color2: null as BABYLON.PBRMaterial,
    //hand_1_color2: null as BABYLON.PBRMaterial,
    ground: null,
    check_position: null,
    camera_parent: null,
    camera_vertical_angle: null,
    //COUNTER_TO_COMPLETE: 0,
    LAST_ANGLE: 0,
    WIN: 0,
    LEVEL: 1,
    TAKING: 0,
    TAKING_OBJ: null,
    dispose: function () {
        engine.stopRenderLoop(game.tick);
        scene.stopAllAnimations();
        scene.dispose();
    },
    angle_dif: function (a, b) {
        var d = a - b;
        if (d < -180) {
            d = 360 + d;
        }
        if (d > 180) {
            d = -360 + d;
        }
        return d;
    },
    day_complete: function () {
        if (action_manager.day != 4) {
            if (gui.day_panel.parent == null) {
                document.exitPointerLock = document.exitPointerLock ||
                    document.mozExitPointerLock ||
                    document.webkitExitPointerLock;
                document.exitPointerLock();
                action_manager.day += 1;
                game.dispose();
                game.load();

                var ach=false;
                var ach_numb=[];
                if(action_manager.day==1){
                  ach=true;
                  ach_numb.push("baby_inyellow_xwtek001");
                }
                if(action_manager.day==2){
                  ach=true;
                  ach_numb.push("baby_inyellow_xwtek002");
                }
                if(action_manager.day==3){
                  ach=true;
                  ach_numb.push("baby_inyellow_xwtek003");
                }
                if(ach){
                LaggedAPI.Achievements.save(ach_numb, function(response) {
                if(response.success) {
                console.log('achievement saved')
                }else {
                console.log(response.errormsg);
                }
                });
                }

                LaggedAPI.APIAds.show(function() {

                  //
                  // ad is finished, unpause game/music
                  //

                console.log("ad completed");

              });

            }
        }
        else {
            document.exitPointerLock = document.exitPointerLock ||
                document.mozExitPointerLock ||
                document.webkitExitPointerLock;
            document.exitPointerLock();
            action_manager.day += 1;
            gui.avd.addControl(gui.day_panel);
            gui.day_panel.getChildByName("textday").text = "Good Evening";
        }
    },
    set_baby: function (name) {
        game.baby.getChildMeshes().forEach(function (e) {
            e.visibility = 0;
            if (e.name == name) {
                e.visibility = 1;
            }
        });
    }
};
var gui = {
    avd: null,
    text: null,
    touch_controls: null,
    panel_win: null,
    panel_black: null,
    howdo: null,
    lights_ready: null,
    day_panel: null,
    load: function () {
        gui.avd = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        gui.avd.idealHeight = 1024;
        gui.avd.idealWidth = 0;
        var rect = new BABYLON.GUI.Rectangle();
        gui.avd.addControl(rect);
        rect.background = "black";
        rect.alpha = 0;
        gui.panel_black = rect;
        var txt = new BABYLON.GUI.TextBlock("", "font");
        txt.fontFamily = font_name;
        txt.fontSize = "48px";
        txt.topInPixels = 48;
        txt.color = "white";
        txt.outlineColor = "black";
        txt.outlineWidth = 4;
        txt.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        gui.avd.addControl(txt);
        gui.text = txt;
        //gui.create_icon_light();
        gui.create_touch_controls();
        //gui.create_panel_win();
        //button
        var button = BABYLON.GUI.Button.CreateImageOnlyButton("but", "images/btn_exit.png");
        button.widthInPixels = 128;
        button.heightInPixels = 128;
        button.color = "transparent";
        button.thickness = 0;
        button.background = "transparent";
        button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        button.left = 32;
        button.top = 32;
        button.onPointerDownObservable.add(function () {
            game.dispose();
            title.load();
        });
        gui.avd.addControl(button);
    },
    create_touch_controls: function () {
        var touch_controls = new BABYLON.GUI.Rectangle("");
        touch_controls.background = "#FFFFFF00";
        touch_controls.thickness = 0;
        gui.avd.addControl(touch_controls);
        gui.touch_controls = touch_controls;
        var grid_parent = new BABYLON.GUI.Rectangle("");
        grid_parent.cornerRadius = 200;
        grid_parent.thickness = 0;
        grid_parent.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        grid_parent.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        grid_parent.width = "400px";
        grid_parent.height = "400px";
        grid_parent.background = "#FFFFFF55";
        gui.touch_controls.addControl(grid_parent);
        var grid = new BABYLON.GUI.Grid("");
        grid.addColumnDefinition(0.5);
        grid.addColumnDefinition(0.5);
        grid.addColumnDefinition(0.5);
        grid.addRowDefinition(0.5);
        grid.addRowDefinition(0.5);
        grid.addRowDefinition(0.5);
        grid_parent.addControl(grid);
        var btn;
        var create_btn = function (btn, left, right, down, up) {
            btn.onPointerDownObservable.add(function (e, v) {
                controls.left = left;
                controls.right = right;
                controls.up = up;
                controls.down = down;
            });
            btn.onPointerMoveObservable.add(function (e, v) {
                controls.left = left;
                controls.right = right;
                controls.up = up;
                controls.down = down;
            });
            btn.onPointerUpObservable.add(function (e, v) {
                controls.left = 0;
                controls.right = 0;
                controls.up = 0;
                controls.down = 0;
            });
            btn.onPointerEnterObservable.add(function (e, v) {
                controls.left = left;
                controls.right = right;
                controls.up = up;
                controls.down = down;
            });
            btn.onPointerOutObservable.add(function (e, v) {
                controls.left = 0;
                controls.right = 0;
                controls.up = 0;
                controls.down = 0;
            });
            btn.thickness = 0;
        };
        btn = BABYLON.GUI.Button.CreateImageOnlyButton("", "images/arrow1.png");
        grid.addControl(btn, 1, 0);
        create_btn(btn, 1, 0, 0, 0);
        btn.rotation = Math.PI;
        btn.alpha = 0.5;
        btn = BABYLON.GUI.Button.CreateImageOnlyButton("", "images/arrow1.png");
        grid.addControl(btn, 1, 2);
        create_btn(btn, 0, 1, 0, 0);
        btn.rotation = 0;
        btn.alpha = 0.5;
        btn = BABYLON.GUI.Button.CreateImageOnlyButton("", "images/arrow1.png");
        grid.addControl(btn, 0, 1);
        create_btn(btn, 0, 0, 0, 1);
        btn.rotation = -(Math.PI / 2);
        btn.alpha = 0.5;
        btn = BABYLON.GUI.Button.CreateImageOnlyButton("", "images/arrow1.png");
        grid.addControl(btn, 2, 1);
        create_btn(btn, 0, 0, 1, 0);
        btn.rotation = Math.PI / 2;
        btn.alpha = 0.5;
        btn = BABYLON.GUI.Button.CreateImageOnlyButton("", "images/arrow2.png");
        grid.addControl(btn, 0, 0);
        create_btn(btn, 1, 0, 0, 1);
        btn.rotation = (Math.PI / 2) * 3;
        btn.alpha = 0.5;
        btn = BABYLON.GUI.Button.CreateImageOnlyButton("", "images/arrow2.png");
        grid.addControl(btn, 2, 0);
        create_btn(btn, 1, 0, 1, 0);
        btn.rotation = (Math.PI / 2) * 2;
        btn.alpha = 0.5;
        btn = BABYLON.GUI.Button.CreateImageOnlyButton("", "images/arrow2.png");
        grid.addControl(btn, 0, 2);
        create_btn(btn, 0, 1, 0, 1);
        btn.rotation = (Math.PI / 2) * 0;
        btn.alpha = 0.5;
        btn = BABYLON.GUI.Button.CreateImageOnlyButton("", "images/arrow2.png");
        grid.addControl(btn, 2, 2);
        create_btn(btn, 0, 1, 1, 0);
        btn.rotation = (Math.PI / 2) * 1;
        btn.alpha = 0.5;
        var bts_size = 128;
        var btn1 = BABYLON.GUI.Button.CreateImageOnlyButton("", "images/btn_hand_2.png");
        btn1.leftInPixels = bts_size * 0.2;
        btn1.topInPixels = -520;
        touch_controls.addControl(btn1);
        btn1.widthInPixels = bts_size;
        btn1.heightInPixels = bts_size;
        btn1.thickness = 0;
        btn1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        btn1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        btn1.onPointerDownObservable.add(function () { controls.shot2 = 1; });
        var image3 = new BABYLON.GUI.Rectangle("");
        image3.width = "50%";
        image3.height = "400px";
        image3.background = "#FFFFFF44";
        image3.alpha = 0.75;
        image3.thickness = 0;
        image3.cornerRadius = 25;
        image3.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        image3.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        gui.touch_controls.addControl(image3);
        gui.create_day_panel();
    },
    create_day_panel: function () {
        var rect = new BABYLON.GUI.Rectangle("");
        rect.background = "black";
        gui.avd.addControl(rect);
        gui.day_panel = rect;
        var btn = BABYLON.GUI.Button.CreateSimpleButton("", "[continue]");
        rect.addControl(btn);
        btn.thickness = 0;
        btn.heightInPixels = 200;
        btn.widthInPixels = 500;
        btn.topInPixels = 150;
        btn.textBlock.color = "#ffd42aff";
        btn.textBlock.fontFamily = font_name;
        btn.textBlock.fontSize = 50;
        btn.onPointerClickObservable.add(function () {

          LaggedAPI.APIAds.show(function() {

            //
            // ad is finished, unpause game/music
            //

          console.log("ad completed");

        });

            if (action_manager.day != 5) {
                if (gui.day_panel.parent != null) {
                    controls.enabled = true;
                    gui.avd.removeControl(gui.day_panel);
                    gui.panel_black.alpha = 0;
                }
            }
            else {
                game.dispose();
                title.load();
            }
        });
        var text = new BABYLON.GUI.TextBlock("textday", "night " + action_manager.day);
        rect.addControl(text);
        text.fontFamily = font_name;
        text.color = "white";
        //text.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        //text.topInPixels = 50;
        text.fontSize = 75;
        text.zIndex = -10;
        rect.metadata = { text: text };
    } //end create panel day
};
var engine;
var canvas;
var scene;
var scene2;
var font_name = "selectric";
var canvas2;
canvas2 = document.createElement("canvas");
var c2d = canvas2.getContext("2d");
var SAVE_NAME = "POPPYPLAYTIME_GRABPACK_CONNECTOR_DS_3_2022_5";
var DS = BABYLON.DataStorage;
var cc = console.log;
var time_start = 0;
window.addEventListener("DOMContentLoaded", function () {
    c2d.font = "30px " + font_name;
    c2d.strokeText("text", 0, 0);
    if (window.Ammo !== undefined) {
        Ammo().then(function () {
            init();
            on_window_load();
            time_playing = (new Date().getTime() / 1000);
            ;
            time_start = (new Date().getTime() / 1000);
            ;
        });
    }
    else {
        init();
    }
});
function init() {
    canvas = document.getElementById("canvas");
    engine = new BABYLON.Engine(canvas);
    engine.displayLoadingUI = function () { };
    scene2 = new BABYLON.Scene(engine);
    window.addEventListener("resize", function () {
        engine.resize();
    });
    game.load = game_load;
    game.file_loaded = game_file_loaded;
    game.tick = game_tick;
    //game.load();
    title.load();
}
/*

var rope = {
    while_loop: function (SEGMENT: BABYLON.Mesh | BABYLON.AbstractMesh,
        TARGET: BABYLON.Mesh | BABYLON.AbstractMesh, TARGET_: BABYLON.Mesh | BABYLON.AbstractMesh) {

        TARGET_.computeWorldMatrix();
        TARGET.metadata.position = TARGET_.absolutePosition.clone();
        var distance = BABYLON.Vector3.Distance(TARGET.absolutePosition, TARGET.metadata.position);
        while (distance > 0) {
            var move_d = 0.1;
            if (distance < 0.1) { move_d = distance }
            TARGET.lookAt(TARGET.metadata.position);
            TARGET.movePOV(0, 0, -move_d);
            TARGET.computeWorldMatrix();
            SEGMENT = rope.logic(SEGMENT, TARGET);

            var distance = BABYLON.Vector3.Distance(TARGET.position, TARGET.metadata.position);


        }
        return SEGMENT;
    },

    logic: function (SEGMENT: BABYLON.Mesh | BABYLON.AbstractMesh, TARGET: BABYLON.Mesh | BABYLON.AbstractMesh) {

        //set current segment
        SEGMENT.lookAt(TARGET.position.clone());
        var dis = BABYLON.Vector3.Distance(SEGMENT.position.clone(),

            TARGET.position.clone());
        SEGMENT.scaling.z = dis / 2;
        SEGMENT.getChildMeshes()[0].scaling.z = 1 / (dis / 2);

        //save angle to pointer
        var angle_to_ball = BABYLON.Angle.BetweenTwoPoints(
            new BABYLON.Vector2(SEGMENT.position.x, SEGMENT.position.z),
            new BABYLON.Vector2(TARGET.position.x, TARGET.position.z)
        ).degrees() % 360;



        //for each block
        var new_segment = 0;
        scene.getMeshesByTags("block").forEach((e) => {
            //when intersect a block
            SEGMENT.computeWorldMatrix(true)
            if (SEGMENT.intersectsMesh(e, true)) {

                //save angle to block
                var angle_to_block = BABYLON.Angle.BetweenTwoPoints(
                    new BABYLON.Vector2(SEGMENT.position.x, SEGMENT.position.z),
                    new BABYLON.Vector2(e.position.x, e.position.z)
                ).degrees() % 360;

                var max_ = { metadata: { angle: 0 } };
                var min_ = { metadata: { angle: 0 } };

                //for each block corner
                e.getChildMeshes().forEach((ee) => {
                    //angle to corner
                    var angle_to_child = (BABYLON.Angle.BetweenTwoPoints(
                        new BABYLON.Vector2(SEGMENT.position.x, SEGMENT.position.z),
                        new BABYLON.Vector2(ee.absolutePosition.x, ee.absolutePosition.z)
                    ).degrees() + 720) % 360;

                    //save angle dif in block view position
                    ee.metadata = { angle: game.angle_dif(angle_to_block, angle_to_child) };
                    //save distance
                    var dist = BABYLON.Vector3.Distance(SEGMENT.position.clone(),
                        ee.absolutePosition.clone()
                    );

                    if (dist > 0.1) {
                        // calculate if is nimor/major max in block view
                        if (min_.metadata.angle >= ee.metadata.angle) {
                            min_ = ee;
                        }
                        if (max_.metadata.angle <= ee.metadata.angle) {
                            max_ = ee;
                        }
                    }


                })






                var target: BABYLON.Mesh | BABYLON.AbstractMesh;
                if (Math.abs(game.angle_dif(game.angle_dif(angle_to_ball, angle_to_block), min_.metadata.angle)) >
                    Math.abs(game.angle_dif(game.angle_dif(angle_to_ball, angle_to_block), max_.metadata.angle))
                ) {
                    target = min_ as BABYLON.Mesh | BABYLON.AbstractMesh;
                } else {
                    target = max_ as BABYLON.Mesh | BABYLON.AbstractMesh;;
                }
                //set current segment to border  and save segment data
                var dis = BABYLON.Vector3.Distance(SEGMENT.absolutePosition.clone(),
                    target.absolutePosition.clone());
                SEGMENT.scaling.z = dis / 2;
                SEGMENT.getChildMeshes()[0].scaling.z = 1 / (dis / 2);
                SEGMENT.metadata.angle_sign = target.metadata.angle / Math.abs(target.metadata.angle);
                SEGMENT.lookAt(target.absolutePosition.clone());
                SEGMENT.metadata.angle = BABYLON.Angle.BetweenTwoPoints(
                    new BABYLON.Vector2(SEGMENT.position.x, SEGMENT.position.z),
                    new BABYLON.Vector2(TARGET.position.x, TARGET.position.z)
                ).degrees() % 360;


                //add new segment

                new_segment = 1;
                var segment = SEGMENT.clone("newsegment", null);
                segment.getChildMeshes()[0].material = segment.material;
                segment.metadata = {}
                segment.metadata.color = SEGMENT.metadata.color;
                try {

                    var light_ = e.metadata.light;
                    var block = e ;
                    var segment =segment;
                    if (block.metadata.color == "white") {

                        block.metadata.correct++;
                    } else if (segment.metadata.color == block.metadata.color) {
                        block.metadata.correct++;
                    } else if (segment.metadata.color != block.metadata.color) {
                        block.metadata.incorrect++;
                    }



                    if (block.metadata.incorrect == 0 &&
                        block.metadata.correct > 0) {
                        segment.metadata.light = block;
                        if(block.metadata.correct == 1){

                            game.sounds.on.play();

                        }

                        ((light_.material as BABYLON.MultiMaterial)
                            .subMaterials[2] as BABYLON.PBRMaterial)
                            .emissiveColor = BABYLON.Color3.FromHexString(block.metadata.hexa);
                    } else

                        if (block.metadata.incorrect > 0) {

                            ((light_.material as BABYLON.MultiMaterial)
                                .subMaterials[2] as BABYLON.PBRMaterial)
                                .emissiveColor = new BABYLON.Color3(0, 0, 0);
                        }





                } catch (error) {

                }
                segment.position = target.absolutePosition.clone();
                segment.metadata.last = SEGMENT;

                SEGMENT = segment;
                SEGMENT.metadata.light = e ;
                segment.lookAt(TARGET.position.clone());
                BABYLON.Tags.GetTags(SEGMENT, true);


                var dis = BABYLON.Vector3.Distance(SEGMENT.position.clone(),
                    TARGET.position.clone());
                SEGMENT.scaling.z = dis / 2;
                SEGMENT.getChildMeshes()[0].scaling.z = 1 / (dis / 2);
            }


        });
        //when no add a segment
        if (new_segment == 0) {

            var last_segment = SEGMENT.metadata.last as BABYLON.Mesh | BABYLON.AbstractMesh;



            //when is not the  last segment
            if (last_segment != null) {

                var last_angle = last_segment.metadata.angle;
                var last_sign = last_segment.metadata.angle_sign;
                var angle_dif = game.angle_dif(angle_to_ball, last_angle)


                //when current segment dispose
                if (last_sign < 0 && angle_dif > 0 || last_sign > 0 && angle_dif < 0) {
                    var current_segment = SEGMENT;

                    SEGMENT = last_segment;
                    SEGMENT.lookAt(TARGET.position.clone());
                    var dis = BABYLON.Vector3.Distance(SEGMENT.position.clone(),

                        TARGET.position.clone());
                    SEGMENT.scaling.z = dis / 2;
                    SEGMENT.getChildMeshes()[0].scaling.z = 1 / (dis / 2);
                    current_segment.dispose();
                    try {
                        var segment =current_segment;
                        var light_ = segment.metadata.light.metadata.light;
                        var block = segment.metadata.light ;



                        if (block.metadata.color == "white") {
                            block.metadata.correct--
                        } else if (segment.metadata.color == block.metadata.color) {
                            block.metadata.correct--;
                        } else if (segment.metadata.color != block.metadata.color) {
                            block.metadata.incorrect--;
                        }

                        if (block.metadata.incorrect == 0 &&
                            block.metadata.correct > 0) {

                            segment.metadata.light = block.metadata.light;
                            ((block.metadata.light.material as BABYLON.MultiMaterial)
                                .subMaterials[2] as BABYLON.PBRMaterial)
                                .emissiveColor = BABYLON.Color3.FromHexString(block.metadata.hexa);

                        } else{

                            if (block.metadata.incorrect > 0 || block.metadata.correct == 0) {

                                ((light_.material as BABYLON.MultiMaterial)
                                    .subMaterials[2] as BABYLON.PBRMaterial)
                                    .emissiveColor = new BABYLON.Color3(0, 0, 0);
                            }
                        }

                    } catch (error) {

                    }
                } else {


                }

            }

        } else {




        }


        return SEGMENT;

    }




}

*/
var title = {
    scene: null,
    load: function () {
        title.scene = new BABYLON.Scene(engine);
        title.scene.onReadyObservable.add(function () {
            document.getElementById("lock_loader").style.visibility = "hidden";
        });
        title.scene.clearColor = new BABYLON.Color4(0.61, 0.61, 0.61, 1);
        var adv = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        adv.idealHeight = 1024;
        DS.WriteNumber(SAVE_NAME + "LEVEL1", 1);
        var text = new BABYLON.GUI.TextBlock("", "text");
        adv.addControl(text);
        var img = new BABYLON.GUI.Image("", "images/title.png");
        img.widthInPixels = 512 * 1.7;
        img.heightInPixels = 261 * 1.7;
        adv.addControl(img);
        img.topInPixels = 100;
        img.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        var btn = BABYLON.GUI.Button.CreateImageOnlyButton("", "images/play.png");
        btn.widthInPixels = 456;
        btn.heightInPixels = 264;
        btn.thickness = 0;
        btn.topInPixels = 175;
        adv.addControl(btn);
        btn.onPointerClickObservable.add(function () {
            btn.alpha = 0.5;
            title.scene.render();
            engine.stopRenderLoop(title.loop);
            title.scene.stopAllAnimations();
            title.scene.dispose();
            action_manager.day = 1;
            game.load();

            LaggedAPI.APIAds.show(function() {

  //
  // ad is finished, unpause game/music
  //

console.log("ad completed");

});

        });
        title.scene.createDefaultCamera();
        engine.runRenderLoop(title.loop);
        var box = BABYLON.Mesh.CreateBox("", 1, title.scene, false, 1);
    },
    dispose: function () {
        title.scene.dispose();
    },
    loop: function () {
        title.scene.render();
    }
};
//# sourceMappingURL=main.js.map
