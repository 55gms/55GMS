FullScreenMario.FullScreenMario.settings.ui = {
    "globalName": "FSM",
    "styleSheet": {
        ".FullScreenMario": {
            "color": "white"
        },
        "@font-face": {
            "font-family": "'Press Start'",
            "src": "url('Fonts/pressstart2p-webfont.eot')",
            "src": [
                    "url('Fonts/pressstart2p-webfont.eot?#iefix') format('embedded-opentype')",
                    "url('Fonts/pressstart2p-webfont.woff') format('woff')",
                    "url('Fonts/pressstart2p-webfont.ttf') format('truetype')",
                    "url('Fonts/pressstart2p-webfont.svg') format('svg')"
            ].join(", "),
            "font-weight": "normal",
            "font-style": "normal"
        }
    },
    "helpSettings": {
        "globalNameAlias": "{%%%%GAME%%%%}",
        "openings": [
            "Hi, thanks for playing FullScreenMario! It looks like you're using the console.",
            "There's not really any way to stop you from messing around so if you'd like to know the common cheats, enter `{%%%%GAME%%%%}.UserWrapper.displayHelpOptions()` here.",
            "If you'd like, go ahead and look around the source code. There are a few surprises you might have fun with... ;)",
            "http://www.github.com/FullScreenShenanigans/FullScreenMario"
        ],
        "options": {
            "Map": [{
                "title": "{%%%%GAME%%%%}.MapsHandler.setMap",
                "description": "Go to a specified map and location.",
                "usage": "{%%%%GAME%%%%}.MapsHandler.setMap(<map>[, <location>]);",
                "examples": [{
                    "code": "{%%%%GAME%%%%}.MapsHandler.setMap('1-1');",
                    "comment": "Starts map 1-1."
                }, {
                    "code": "{%%%%GAME%%%%}.MapsHandler.setMap('1-2', 1);",
                    "comment": "Starts map 1-2, at the second location."
                }, {
                    "code": "{%%%%GAME%%%%}.MapsHandler.setMap('Random');",
                    "comment": "Starts the random map."
                }, {
                    "code": "{%%%%GAME%%%%}.MapsHandler.setMap('Random', 'Underworld');",
                    "comment": "Starts the random map in the Underworld."
                }]
            }],
            "Things": [{
                "title": "{%%%%GAME%%%%}.addThing",
                "description": "Adds a new Thing to the game.",
                "usage": "{%%%%GAME%%%%}.addThing(<thing>, left, top);",
                "examples": [{
                    "code": "{%%%%GAME%%%%}.addThing('Goomba', 256, 384);",
                    "comment": "Adds a Goomba to the game."
                }, {
                    "code": "{%%%%GAME%%%%}.addThing('Mushroom', {%%%%GAME%%%%}.player.right + 80, {%%%%GAME%%%%}.player.top);",
                    "comment": "Adds a Mushroom to the right of the player."
                }, {
                    "code": "{%%%%GAME%%%%}.addThing(['Koopa', { 'smart': true }], 256, 368);",
                    "comment": "Adds a smart Koopa to the game."
                }, {
                    "code": "{%%%%GAME%%%%}.addThing({%%%%GAME%%%%}.ObjectMaker.make('Koopa', { 'smart': true, 'jumping': true }), 256, 368);",
                    "comment": "Adds a smart, jumping Koopa to the game."
                }]
            }, {
                "title": "{%%%%GAME%%%%}.ObjectMaker.getProperties",
                "description": "Retrieves the defaults for different types of objects.",
                "usage": "{%%%%GAME%%%%}.ObjectMaker.getProperties();"
            }, {
                "title": "{%%%%GAME%%%%}.GroupHolder.get*******Group",
                "description": "Retrieves the appropriate group of Things being manipulated. Choices are 'Text', 'Character', 'Solid', and 'Scenery'.",
                "usage": "{%%%%GAME%%%%}.get*******Group();",
                "examples": [{
                    "code": "{%%%%GAME%%%%}.GroupHolder.getCharacterGroup();",
                    "comment": "Retrieves the currently playing Characters."
                }]
            }, {
                "title": "{%%%%GAME%%%%}.GroupHolder.get*******",
                "description": "Retrieves the numbered Thing from its group.",
                "usage": "{%%%%GAME%%%%}.GroupHolder.get*******(<index>);",
                "examples": [{
                    "code": "{%%%%GAME%%%%}.GroupHolder.getCharacter(0);",
                    "comment": "Retrieves the first playing Character."
                }, {
                    "code": "{%%%%GAME%%%%}.GroupHolder.getCharacter({%%%%GAME%%%%}.GroupHolder.getCharacterGroup().length - 1);",
                    "comment": "Retrieves the last playing Character."
                }]
            }],
            "Physics": [{
                "title": "{%%%%GAME%%%%}.shiftBoth",
                "description": "Shifts a Thing horizontally and/or vertically.",
                "usage": "{%%%%GAME%%%%}.shiftBoth(<thing>, <dx>[, <dy>]);",
                "examples": [{
                    "code": "{%%%%GAME%%%%}.shiftBoth({%%%%GAME%%%%}.player, 700);",
                    "comment": "Shifts the player 700 spaces to the right"
                }, {
                    "code": "{%%%%GAME%%%%}.shiftBoth({%%%%GAME%%%%}.player, 0, -{%%%%GAME%%%%}.MapScreener.height);",
                    "comment": "Shifts the player to the top of the screen."
                }]
            }, {
                "title": "{%%%%GAME%%%%}.killNormal",
                "description": "Kills a specified Character with animation.",
                "usage": "{%%%%GAME%%%%}.killNormal(<thing>)",
                "examples": [{
                    "code": "{%%%%GAME%%%%}.killNormal({%%%%GAME%%%%}.GroupHolder.getCharacter(0)",
                    "comment": "Kills the first playing Character."
                }, {
                    "code": "{%%%%GAME%%%%}.GroupHolder.getSceneryGroup().forEach({%%%%GAME%%%%}.killNormal)",
                    "comment": "Kills all playing Scenery."
                }]
            }, {
                "title": "{%%%%GAME%%%%}.player.gravity",
                "description": "Sets the current Player's gravity.",
                "usage": "{%%%%GAME%%%%}.player.gravity = <number>;",
                "examples": [{
                    "code": "{%%%%GAME%%%%}.player.gravity = {%%%%GAME%%%%}.MapScreener.gravity / 2;",
                    "comment": "Sets the player's gravity to half the default."
                }]
            }],
            "Powerups": [{
                "title": "{%%%%GAME%%%%}.playerShroom",
                "description": "Simulates the player hitting a Mushroom.",
                "usage": "{%%%%GAME%%%%}.playerShroom({%%%%GAME%%%%}.player)"
            }, {
                "title": "{%%%%GAME%%%%}.playerStar",
                "description": "Simulates the player hitting a Star.",
                "usage": "{%%%%GAME%%%%}.playerStar({%%%%GAME%%%%}.player)"
            }],
            "Statistics": [{
                "title": "{%%%%GAME%%%%}.StatsHolder.set('coins')",
                "description": "Sets the number of coins you have.",
                "usage": "{%%%%GAME%%%%}.StatsHolder.set('coins', <number>);",
                "examples": [{
                    "code": "{%%%%GAME%%%%}.StatsHolder.set('coins', 7);",
                    "comment": "Sets your number of coins to seven."
                }]
            }, {
                "title": "{%%%%GAME%%%%}.StatsHolder.set('lives')",
                "description": "Sets the number of lives you have left.",
                "usage": "{%%%%GAME%%%%}.StatsHolder.set('lives', <number>);",
                "examples": [{
                    "code": "{%%%%GAME%%%%}.StatsHolder.set('lives', 7);",
                    "comment": "Sets your number of lives to seven."
                }, {
                    "code": "{%%%%GAME%%%%}.StatsHolder.set('lives', Infinity);",
                    "comment": "Sets your number of lives to Infinity and beyond."
                }]
            }, {
                "title": "{%%%%GAME%%%%}.StatsHolder.set('time')",
                "description": "Sets the amount of time left in the map.",
                "usage": "{%%%%GAME%%%%}.StatsHolder.set('time', <number>)",
                "examples": [{
                    "code": "{%%%%GAME%%%%}.StatsHolder.set('time', 700);",
                    "comment": "Sets your amount of lifes to seven hundred."
                }, {
                    "code": "{%%%%GAME%%%%}.StatsHolder.set('time', Infinity);",
                    "comment": "Sets your amount of time left to Infinity and beyond."
                }]
            }]
        }
    },
    "sizeDefault": "Wide",
    "sizes": {
        "NES": {
            "width": 512,
            "height": 464,
            "full": false
        },
        "Wide": {
            "width": Infinity,
            "height": 464,
            "full": false
        },
        "Large": {
            "width": Infinity,
            "height": Infinity,
            "full": false
        },
        "Full!": {
            "width": Infinity,
            "height": Infinity,
            "full": true
        }
    },
    "schemas": [
        {
            "title": "Options",
            "generator": "OptionsTable",
            "options": [
                {
                    "title": "Volume",
                    "type": "Number",
                    "minimum": 0,
                    "maximum": 100,
                    "source": function (GameStarter) {
                        return Math.round(GameStarter.AudioPlayer.getVolume() * 100);
                    },
                    "update": function (GameStarter, value) {
                        GameStarter.AudioPlayer.setVolume(value / 100);
                    }
                },
                {
                    "title": "Mute",
                    "type": "Boolean",
                    "source": function (GameStarter) {
                        return GameStarter.AudioPlayer.getMuted();
                    },
                    "enable": function (GameStarter) {
                        GameStarter.AudioPlayer.setMutedOn();
                    },
                    "disable": function (GameStarter) {
                        GameStarter.AudioPlayer.setMutedOff();
                    }
                },
                {
                    "title": "Speed",
                    "type": "Select",
                    "options": function (GameStarter) {
                        return [".25x", ".5x", "1x", "2x", "5x"];
                    },
                    "source": function (GameStarter) {
                        return "1x";
                    },
                    "update": function (GameStarter, value) {
                        GameStarter.GamesRunner.setSpeed(
                            Number(value.replace('x', ''))
                        );
                    },
                    "storeLocally": true
                },
                {
                    "title": "View Mode",
                    "type": "ScreenSize"
                },
                {
                    "title": "Framerate",
                    "type": "Select",
                    "options": function (GameStarter) {
                        return ["60fps", "30fps"];
                    },
                    "source": function (GameStarter) {
                        return (1 / GameStarter.PixelDrawer.getFramerateSkip() * 60) + "fps";
                    },
                    "update": function (GameStarter, value) {
                        var numeric = Number(value.replace("fps", ""));
                        GameStarter.PixelDrawer.setFramerateSkip(1 / numeric * 60);
                    },
                    "storeLocally": true
                },
                {
                    "title": "Touch Controls",
                    "type": "Boolean",
                    "storeLocally": true,
                    "source": function (GameStarter) {
                        return false;
                    },
                    "enable": function (GameStarter) {
                        setTimeout(function () {
                            GameStarter.TouchPasser.enable();
                        });
                    },
                    "disable": function (GameStarter) {
                        setTimeout(function () {
                            GameStarter.TouchPasser.disable();
                        });
                    }
                },
                {
                    "title": "Tilt Controls",
                    "type": "Boolean",
                    "storeLocally": true,
                    "source": function (GameStarter) {
                        return false;
                    },
                    "enable": function (GameStarter) {
                        window.ondevicemotion = GameStarter.InputWriter.makePipe("ondevicemotion", "type");
                    },
                    "disable": function (GameStarter) {
                        window.ondevicemotion = undefined;
                    }
                }
            ],
            "actions": [
                {
                    "title": "Screenshot",
                    "action": function (GameStarter) {
                        GameStarter.takeScreenshot("FullScreenMario " + new Date().getTime());
                    }
                }
            ]
        }, {
            "title": "Controls",
            "generator": "OptionsTable",
            "options": (function (controls) {
                return controls.map(function (title) {
                    return {
                        "title": title[0].toUpperCase() + title.substr(1),
                        "type": "Keys",
                        "storeLocally": true,
                        "source": function (GameStarter) {
                            return GameStarter.InputWriter
                                .getAliasAsKeyStrings(title)
                                .map(function (string) {
                                    return string.toLowerCase();
                                });
                        },
                        "callback": function (GameStarter, valueOld, valueNew) {
                            GameStarter.InputWriter.switchAliasValues(
                                title,
                                [GameStarter.InputWriter.convertKeyStringToAlias(valueOld)],
                                [GameStarter.InputWriter.convertKeyStringToAlias(valueNew)]
                            );
                        }
                    };
                });
            })(["left", "right", "up", "down", "sprint", "pause"])
        }, {
            "title": "Mods!",
            "generator": "OptionsButtons",
            "keyActive": "enabled",
            "assumeInactive": true,
            "options": function (GameStarter) {
                var mods = GameStarter.ModAttacher.getMods(),
                    output = {},
                    mod, i;

                for (i in mods) {
                    if (mods.hasOwnProperty(i)) {
                        mod = mods[i];

                        output[i] = {
                            "title": mod.name,
                            "source": function () {
                                return mod.enabled;
                            },
                            "keyActive": "enabled",
                            "storeLocally": true,
                            "type": "text"
                        };
                    }
                }

                return output;
            },
            "callback": function (GameStarter, schema, button) {
                var name = button.textContent,
                    key = button.getAttribute("localStorageKey"),
                    mod = GameStarter.ModAttacher.getMod(name);

                GameStarter.ModAttacher.toggleMod(name);
                GameStarter.ItemsHolder.setItem(key, mod.enabled);
                GameStarter.ItemsHolder.saveItem(key);
            }
        }, {
            "title": "Editor",
            "generator": "LevelEditor",
            "maps": {
                "rangeX": [1, 4],
                "rangeY": [1, 8],
                "callback": function (GameStarter, schema, button, event) {
                    GameStarter.LevelEditor.enable();
                    GameStarter.LevelEditor.setCurrentJSON(
                        JSON.stringify(GameStarter.MapsCreator.getMapRaw(button.textContent)));
                    GameStarter.LevelEditor.startBuilding();
                }
            }
        }, {
            "title": "Maps",
            "generator": "MapsGrid",
            "rangeX": [1, 4],
            "rangeY": [1, 8],
            "extras": {
                "Map Generator!": (function () {
                    var shuffle = function (string) {
                        return string
                            .split('')
                            // Same function used in browserchoice.eu :)
                            .sort(function () {
                                return 0.5 - Math.random()
                            })
                            .reverse()
                            .join('');
                    };

                    var getNewSeed = function () {
                        return shuffle(String(new Date().getTime()));
                    };

                    return {
                        "title": "Map Generator!",
                        "callback": function (GameStarter, schema, button, event) {
                            var parent = event.target.parentNode,
                                randomizer = parent.querySelector(".randomInput");

                            randomizer.value = randomizer.value.replace(/[^\d]/g, '');
                            if (!randomizer.value) {
                                randomizer.value = getNewSeed();
                            }

                            GameStarter.LevelEditor.disable();
                            GameStarter.NumberMaker.resetFromSeed(randomizer.value);
                            GameStarter.setMap("Random");

                            if (!randomizer.getAttribute("custom")) {
                                randomizer.value = getNewSeed();
                            }
                        },
                        "extraElements": [
                            [
                                "input", {
                                    "className": "randomInput maps-grid-input",
                                    "type": "text",
                                    "value": getNewSeed(),
                                    "onchange": function (event) {
                                        event.target.setAttribute("custom", true)
                                    }
                                }
                            ]
                        ]
                    };
                })()
            },
            "callback": function (GameStarter, schema, button, event) {
                GameStarter.LevelEditor.disable();
                GameStarter.setMap(button.getAttribute("value") || button.textContent);
            }
        }
    ]
};
