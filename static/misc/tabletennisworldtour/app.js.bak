var skipTitle = window.famobi.hasFeature("skip_title");
var skipTutorial = window.famobi.hasFeature("skip_tutorial");
var externalStart = window.famobi.hasFeature("external_start");
var externalMute = window.famobi.hasFeature("external_mute");
var externalPause = window.famobi.hasFeature("external_pause");

window.famobi.onRequest("changeVolume", function(vol) {
    masterVolume = vol;
    if(!muted) {
        sound._volume = masterVolume;
        if(gameState == "game") {
            music.volume(.1 * masterVolume);
        } else {
            music.volume(.5 * masterVolume);
        }
    }
});

window.famobi.started = false;
window.famobi_game = {
    start: null
}

window.famobi.onRequest("startGame", function(){
    window.famobi.started = true;
    window.famobi.paused = false;

    if(window.famobi_game.start) window.famobi_game.start();
});

window.famobi.onRequest("enableAudio", function() {
    //butEventHandler("enableAudio");
    /* Will not update button */
    if(muted) toggleMute();
});

window.famobi.onRequest("disableAudio", function() {
    //butEventHandler("disableAudio");
    /* Will not update button */
    if(!muted) toggleMute();
});

window.famobi.paused = false;

window.famobi.onRequest("pauseGameplay", function() {
    window.famobi.paused = true;
});

window.famobi.onRequest("resumeGameplay", function() {
    if(!window.famobi.started) return;

    window.famobi.paused = false;
});

window.famobi.onRequest("restartGame", function() {
    _initGame();
});

var masterVolume = window.famobi.getVolume();
var player_serve = true;
var player_hitType;
var enemy_hitType;


var forcedMode = window.famobi.hasFeature("forced_mode");
var forcedModeProperties = { state: {}, override: {} }

var won_matches_in_series_player = 0,
    won_matches_in_series_opponent = 0,
    points_in_series_player = 0,
    points_in_series_opponent = 0;

var Utils;
(function (Utils) {
    var AssetLoader = (function () {
        function AssetLoader(_lang, _aFileData, _ctx, _canvasWidth, _canvasHeight, _showBar) {
            if (typeof _showBar === "undefined") { _showBar = true; }
            this.oAssetData = {
            };
            this.assetsLoaded = 0;
            this.textData = {
            };
            this.spinnerRot = 0;
            this.totalAssets = _aFileData.length;
            this.showBar = _showBar;
            for(var i = 0; i < _aFileData.length; i++) {
                if(_aFileData[i].file.indexOf(".json") != -1) {
                    this.loadJSON(_aFileData[i]);
                } else {
                    this.loadImage(_aFileData[i]);
                }
            }
            if(_showBar) {
                this.oLoaderImgData = preAssetLib.getData("loader");
                this.oLoadSpinnerImgData = preAssetLib.getData("loadSpinner");
            }
        }
        AssetLoader.prototype.render = function () {
            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 + 20, (300 / this.totalAssets) * this.assetsLoaded, 30);
            ctx.drawImage(this.oLoaderImgData.img, canvas.width / 2 - this.oLoaderImgData.img.width / 2, canvas.height / 2 - this.oLoaderImgData.img.height / 2);
            this.spinnerRot += delta * 3;
            ctx.save();
            ctx.translate(canvas.width / 2 - 33, canvas.height / 2 - 20);
            ctx.rotate(this.spinnerRot);
            ctx.drawImage(this.oLoadSpinnerImgData.img, -this.oLoadSpinnerImgData.img.width / 2, -this.oLoadSpinnerImgData.img.height / 2);
            ctx.restore();
            this.displayNumbers();
        };
        AssetLoader.prototype.displayNumbers = function () {
            ctx.textAlign = "left";
            ctx.font = "bold 40px arial";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(Math.round((this.assetsLoaded / this.totalAssets) * 100) + "%", canvas.width / 2 + 0, canvas.height / 2 - 6);
        };
        AssetLoader.prototype.loadExtraAssets = function (_callback, _aFileData) {
            this.showBar = false;
            this.totalAssets = _aFileData.length;
            this.assetsLoaded = 0;
            this.loadedCallback = _callback;
            for(var i = 0; i < _aFileData.length; i++) {
                if(_aFileData[i].file.indexOf(".json") != -1) {
                    this.loadJSON(_aFileData[i]);
                } else {
                    this.loadImage(_aFileData[i]);
                }
            }
        };
        AssetLoader.prototype.loadJSON = function (_oData) {
            var _this = this;
            var xobj = new XMLHttpRequest();
            xobj.open('GET', _oData.file, true);
            xobj.onreadystatechange = function () {
                if(xobj.readyState == 4 && xobj.status == 200) {
                    _this.textData[_oData.id] = JSON.parse(xobj.responseText);
                    ++_this.assetsLoaded;
                    _this.checkLoadComplete();
                }
            };
            xobj.send(null);
        };
        AssetLoader.prototype.loadImage = function (_oData) {
            var _this = this;
            var img = new Image();
            img.onload = function () {
                _this.oAssetData[_oData.id] = {
                };
                _this.oAssetData[_oData.id].img = img;
                _this.oAssetData[_oData.id].oData = {
                };
                var aSpriteSize = _this.getSpriteSize(_oData.file);
                if(aSpriteSize[0] != 0) {
                    _this.oAssetData[_oData.id].oData.spriteWidth = aSpriteSize[0];
                    _this.oAssetData[_oData.id].oData.spriteHeight = aSpriteSize[1];
                } else {
                    _this.oAssetData[_oData.id].oData.spriteWidth = _this.oAssetData[_oData.id].img.width;
                    _this.oAssetData[_oData.id].oData.spriteHeight = _this.oAssetData[_oData.id].img.height;
                }
                if(_oData.oAnims) {
                    _this.oAssetData[_oData.id].oData.oAnims = _oData.oAnims;
                }
                if(_oData.oAtlasData) {
                    _this.oAssetData[_oData.id].oData.oAtlasData = _oData.oAtlasData;
                } else {
                    _this.oAssetData[_oData.id].oData.oAtlasData = {
                        none: {
                            x: 0,
                            y: 0,
                            width: _this.oAssetData[_oData.id].oData.spriteWidth,
                            height: _this.oAssetData[_oData.id].oData.spriteHeight
                        }
                    };
                }
                ++_this.assetsLoaded;
                _this.checkLoadComplete();
            };
            img.src = _oData.file;
        };
        AssetLoader.prototype.getSpriteSize = function (_file) {
            var aNew = new Array();
            var sizeY = "";
            var sizeX = "";
            var stage = 0;
            var inc = _file.lastIndexOf(".");
            var canCont = true;
            while(canCont) {
                inc--;
                if(stage == 0 && this.isNumber(_file.charAt(inc))) {
                    sizeY = _file.charAt(inc) + sizeY;
                } else if(stage == 0 && sizeY.length > 0 && _file.charAt(inc) == "x") {
                    inc--;
                    stage = 1;
                    sizeX = _file.charAt(inc) + sizeX;
                } else if(stage == 1 && this.isNumber(_file.charAt(inc))) {
                    sizeX = _file.charAt(inc) + sizeX;
                } else if(stage == 1 && sizeX.length > 0 && _file.charAt(inc) == "_") {
                    canCont = false;
                    aNew = [
                        parseInt(sizeX),
                        parseInt(sizeY)
                    ];
                } else {
                    canCont = false;
                    aNew = [
                        0,
                        0
                    ];
                }
            }
            return aNew;
        };
        AssetLoader.prototype.isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        AssetLoader.prototype.checkLoadComplete = function () {

            if(this.totalAssets > 10) {
                window.famobi.setPreloadProgress(Math.round((this.assetsLoaded / this.totalAssets) * 100));
            }

            if(this.assetsLoaded == this.totalAssets) {
                this.loadedCallback();
            }
        };
        AssetLoader.prototype.onReady = function (_func) {
            this.loadedCallback = _func;
        };
        AssetLoader.prototype.getImg = function (_id) {
            return this.oAssetData[_id].img;
        };
        AssetLoader.prototype.getData = function (_id) {
            return this.oAssetData[_id];
        };
        return AssetLoader;
    })();
    Utils.AssetLoader = AssetLoader;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var AnimSprite = (function () {
        function AnimSprite(_oImgData, _fps, _radius, _animId) {
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.radius = 10;
            this.removeMe = false;
            this.frameInc = 0;
            this.animType = "loop";
            this.offsetX = 0;
            this.offsetY = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.alpha = 1;
            this.oImgData = _oImgData;
            this.oAnims = this.oImgData.oData.oAnims;
            this.fps = _fps;
            this.radius = _radius;
            this.animId = _animId;
            this.centreX = Math.round(this.oImgData.oData.spriteWidth / 2);
            this.centreY = Math.round(this.oImgData.oData.spriteHeight / 2);
        }
        AnimSprite.prototype.updateAnimation = function (_delta) {
            this.frameInc += this.fps * _delta;
        };
        AnimSprite.prototype.changeImgData = function (_newImgData, _animId) {
            this.oImgData = _newImgData;
            this.oAnims = this.oImgData.oData.oAnims;
            this.animId = _animId;
            this.centreX = Math.round(this.oImgData.oData.spriteWidth / 2);
            this.centreY = Math.round(this.oImgData.oData.spriteHeight / 2);
            this.resetAnim();
        };
        AnimSprite.prototype.resetAnim = function () {
            this.frameInc = 0;
        };
        AnimSprite.prototype.setFrame = function (_frameNum) {
            this.fixedFrame = _frameNum;
        };
        AnimSprite.prototype.setAnimType = function (_type, _animId, _reset) {
            if (typeof _reset === "undefined") { _reset = true; }
            this.animId = _animId;
            this.animType = _type;
            if(_reset) {
                this.resetAnim();
            }
            switch(_type) {
                case "loop":
                    break;
                case "once":
                    this.maxIdx = this.oAnims[this.animId].length - 1;
                    break;
            }
        };
        AnimSprite.prototype.render = function (_ctx) {
            _ctx.save();
            _ctx.translate(this.x, this.y);
            _ctx.rotate(this.rotation);
            _ctx.scale(this.scaleX, this.scaleY);
            _ctx.globalAlpha = this.alpha;
            if(this.animId != null) {
                var max = this.oAnims[this.animId].length;
                var idx = Math.floor(this.frameInc);
                this.curFrame = this.oAnims[this.animId][idx % max];
                var imgX = (this.curFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.curFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                if(this.animType == "once") {
                    if(idx > this.maxIdx) {
                        this.fixedFrame = this.oAnims[this.animId][max - 1];
                        this.animId = null;
                        if(this.animEndedFunc != null) {
                            this.animEndedFunc();
                        }
                        var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                        var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                    }
                }
            } else {
                var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            }
            _ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.centreX + this.offsetX, -this.centreY + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
            _ctx.restore();
        };
        AnimSprite.prototype.renderSimple = function (_ctx) {
            if(this.animId != null) {
                var max = this.oAnims[this.animId].length;
                var idx = Math.floor(this.frameInc);
                this.curFrame = this.oAnims[this.animId][idx % max];
                var imgX = (this.curFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.curFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                if(this.animType == "once") {
                    if(idx > this.maxIdx) {
                        this.fixedFrame = this.oAnims[this.animId][max - 1];
                        this.animId = null;
                        if(this.animEndedFunc != null) {
                            this.animEndedFunc();
                        }
                        var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                        var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                    }
                }
            } else {
                var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            }
            _ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, this.x - (this.centreX - this.offsetX) * this.scaleX, this.y - (this.centreY - this.offsetY) * this.scaleY, this.oImgData.oData.spriteWidth * this.scaleX, this.oImgData.oData.spriteHeight * this.scaleY);
        };
        return AnimSprite;
    })();
    Utils.AnimSprite = AnimSprite;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var BasicSprite = (function () {
        function BasicSprite(_oImgData, _radius, _frame) {
            if (typeof _frame === "undefined") { _frame = 0; }
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.radius = 10;
            this.removeMe = false;
            this.offsetX = 0;
            this.offsetY = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.oImgData = _oImgData;
            this.radius = _radius;
            this.setFrame(_frame);
        }
        BasicSprite.prototype.setFrame = function (_frameNum) {
            this.frameNum = _frameNum;
        };
        BasicSprite.prototype.render = function (_ctx) {
            _ctx.save();
            _ctx.translate(this.x, this.y);
            _ctx.rotate(this.rotation);
            _ctx.scale(this.scaleX, this.scaleY);
            var imgX = (this.frameNum * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
            var imgY = Math.floor(this.frameNum / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            _ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.oImgData.oData.spriteWidth / 2 + this.offsetX, -this.oImgData.oData.spriteHeight / 2 + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
            _ctx.restore();
        };
        return BasicSprite;
    })();
    Utils.BasicSprite = BasicSprite;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var UserInput = (function () {
        function UserInput(_canvas, _isBugBrowser) {
            var _this = this;
            this.prevHitTime = 0;
            this.pauseIsOn = false;
            this.isDown = false;
            this.isBugBrowser = _isBugBrowser;
            this.keyDownEvtFunc = function (e) {
                _this.keyDown(e);
            };
            this.keyUpEvtFunc = function (e) {
                _this.keyUp(e);
            };
            _canvas.addEventListener("touchstart", function (e) {
                for(var i = 0; i < e.changedTouches.length; i++) {
                    _this.hitDown(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                }
            }, false);
            _canvas.addEventListener("touchend", function (e) {
                for(var i = 0; i < e.changedTouches.length; i++) {
                    _this.hitUp(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                }
            }, false);
            _canvas.addEventListener("touchcancel", function (e) {
                for(var i = 0; i < e.changedTouches.length; i++) {
                    _this.hitCancel(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                }
            }, false);
            _canvas.addEventListener("touchmove", function (e) {
                for(var i = 0; i < e.changedTouches.length; i++) {
                    _this.move(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier, true);
                }
            }, false);
            _canvas.addEventListener("mousedown", function (e) {
                _this.isDown = true;
                _this.hitDown(e, e.pageX, e.pageY, 1);
            }, false);
            _canvas.addEventListener("mouseup", function (e) {
                _this.isDown = false;
                _this.hitUp(e, e.pageX, e.pageY, 1);
            }, false);
            _canvas.addEventListener("mousemove", function (e) {
                _this.move(e, e.pageX, e.pageY, 1, _this.isDown);
            }, false);
            _canvas.addEventListener("mouseout", function (e) {
                _this.isDown = false;
                _this.hitUp(e, Math.abs(e.pageX), Math.abs(e.pageY), 1);
            }, false);
            this.aHitAreas = new Array();
            this.aKeys = new Array();
        }
        UserInput.prototype.hitDown = function (e, _posX, _posY, _identifer) {
            e.preventDefault();
            e.stopPropagation();
            if(!hasFocus) {
                visibleResume();
            }
            if(this.pauseIsOn || window.famobi.paused) {
                return;
            }
            var curHitTime = new Date().getTime();
            _posX *= canvasScale;
            _posY *= canvasScale;
            for(var i = 0; i < this.aHitAreas.length; i++) {
                if(this.aHitAreas[i].rect) {
                    var aX = canvas.width * this.aHitAreas[i].align[0];
                    var aY = canvas.height * this.aHitAreas[i].align[1];
                    if(_posX > aX + this.aHitAreas[i].area[0] && _posY > aY + this.aHitAreas[i].area[1] && _posX < aX + this.aHitAreas[i].area[2] && _posY < aY + this.aHitAreas[i].area[3]) {
                        this.aHitAreas[i].aTouchIdentifiers.push(_identifer);
                        this.aHitAreas[i].oData.hasLeft = false;
                        if(!this.aHitAreas[i].oData.isDown) {
                            this.aHitAreas[i].oData.isDown = true;
                            this.aHitAreas[i].oData.x = _posX;
                            this.aHitAreas[i].oData.y = _posY;
                            if((curHitTime - this.prevHitTime < 500 && (gameState != "game" || this.aHitAreas[i].id == "pause")) && isBugBrowser) {
                                return;
                            }
                            this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                        }
                        break;
                    }
                } else {
                }
            }
            this.prevHitTime = curHitTime;
        };
        UserInput.prototype.hitUp = function (e, _posX, _posY, _identifer) {
            if(!ios9FirstTouch) {
                playSound("silence");
                ios9FirstTouch = true;
            }
            if(this.pauseIsOn || window.famobi.paused) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            _posX *= canvasScale;
            _posY *= canvasScale;
            for(var i = 0; i < this.aHitAreas.length; i++) {
                if(this.aHitAreas[i].rect) {
                    var aX = canvas.width * this.aHitAreas[i].align[0];
                    var aY = canvas.height * this.aHitAreas[i].align[1];
                    if(_posX > aX + this.aHitAreas[i].area[0] && _posY > aY + this.aHitAreas[i].area[1] && _posX < aX + this.aHitAreas[i].area[2] && _posY < aY + this.aHitAreas[i].area[3]) {
                        for(var j = 0; j < this.aHitAreas[i].aTouchIdentifiers.length; j++) {
                            if(this.aHitAreas[i].aTouchIdentifiers[j] == _identifer) {
                                this.aHitAreas[i].aTouchIdentifiers.splice(j, 1);
                                j -= 1;
                            }
                        }
                        if(this.aHitAreas[i].aTouchIdentifiers.length == 0) {
                            this.aHitAreas[i].oData.isDown = false;
                            if(this.aHitAreas[i].oData.multiTouch) {
                                this.aHitAreas[i].oData.x = _posX;
                                this.aHitAreas[i].oData.y = _posY;
                                this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                            }
                        }
                        break;
                    }
                } else {
                }
            }
        };
        UserInput.prototype.hitCancel = function (e, _posX, _posY, _identifer) {
            e.preventDefault();
            e.stopPropagation();
            _posX *= canvasScale;
            _posY *= canvasScale;
            for(var i = 0; i < this.aHitAreas.length; i++) {
                if(this.aHitAreas[i].oData.isDown) {
                    this.aHitAreas[i].oData.isDown = false;
                    this.aHitAreas[i].aTouchIdentifiers = new Array();
                    if(this.aHitAreas[i].oData.multiTouch) {
                        this.aHitAreas[i].oData.x = _posX;
                        this.aHitAreas[i].oData.y = _posY;
                        this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                    }
                }
            }
        };
        UserInput.prototype.userExitLock = function (e) {
          if(document.pointerLockElement !== canvas && document.mozPointerLockElement !== canvas)
          {
            //User Pressed ESC
            butEventHandler("pause");
          }
        };
        UserInput.prototype.lockPointer = function (elem) {
          // console.log("Locking pointer");
          if (!elem) elem = canvas;
          if (elem.requestPointerLock) {
            elem.requestPointerLock();
          } else if (elem.webkitRequestPointerLock) {
            elem.webkitRequestPointerLock();
          } else if (elem.mozRequestPointerLock) {
            elem.mozRequestPointerLock();
          } else {
            console.warn("Pointer locking not supported");
          }
          if ("onpointerlockchange" in document) {
            document.addEventListener('pointerlockchange', this.userExitLock, false);
          } else if ("onmozpointerlockchange" in document) {
            document.addEventListener('mozpointerlockchange', this.userExitLock, false);
          }
        };
        UserInput.prototype.unlockPointer = function () {
          // console.log("Trying to unlock pointer");
          if (document.exitPointerLock) {
            document.exitPointerLock();
          } else if (document.webkitExitPointerLock) {
            document.webkitExitPointerLock();
          } else if (document.mozExitPointerLock) {
            document.mozExitPointerLock();
          } else {
            console.warn("Pointer unlocking not supported");
          }
          if ("onpointerlockchange" in document) {
            document.removeEventListener('pointerlockchange', this.userExitLock, false);
          } else if ("onmozpointerlockchange" in document) {
            document.removeEventListener('mozpointerlockchange', this.userExitLock, false);
          }
        };
        UserInput.prototype.move = function (e, _posX, _posY, _identifer, _isDown) {
            if(this.pauseIsOn || window.famobi.paused) {
                return;
            }
            if(!isMobile && userBat != undefined && !firstRun) {
                if(document.pointerLockElement === canvas || document.mozPointerLockElement === canvas)
                {
                  //pointerLocked
                  const {
                    movementX,
                    movementY
                  } = e;
                  if(window.famobi.pointerLockHelper)
                  {
                    if((window.famobi.pointerLockHelper.mousePos.x+movementX) < fenster.innerWidth && (window.famobi.pointerLockHelper.mousePos.x+movementX) > 0)
                      window.famobi.pointerLockHelper.mousePos.x += movementX;
                    if((window.famobi.pointerLockHelper.mousePos.y+movementY) < fenster.innerHeight && (window.famobi.pointerLockHelper.mousePos.y+movementY) > 0)
                      window.famobi.pointerLockHelper.mousePos.y += movementY;
                  }
                  userBat.targX = window.famobi.pointerLockHelper.mousePos.x * canvasScale;
                  userBat.targY = window.famobi.pointerLockHelper.mousePos.y * canvasScale;
                }
                else {
                  //pointerUnlocked
                  userBat.targX = _posX * canvasScale;
                  userBat.targY = _posY * canvasScale;
                  if(window.famobi.pointerLockHelper) window.famobi.pointerLockHelper.mousePos = {x: _posX, y: _posY};
                }
            }
            if(_isDown) {
                _posX *= canvasScale;
                _posY *= canvasScale;
                for(var i = 0; i < this.aHitAreas.length; i++) {
                    if(this.aHitAreas[i].rect) {
                        var aX = canvas.width * this.aHitAreas[i].align[0];
                        var aY = canvas.height * this.aHitAreas[i].align[1];
                        if(_posX > aX + this.aHitAreas[i].area[0] && _posY > aY + this.aHitAreas[i].area[1] && _posX < aX + this.aHitAreas[i].area[2] && _posY < aY + this.aHitAreas[i].area[3]) {
                            this.aHitAreas[i].oData.hasLeft = false;
                            if(this.aHitAreas[i].oData.isDraggable && !this.aHitAreas[i].oData.isDown) {
                                this.aHitAreas[i].oData.isDown = true;
                                this.aHitAreas[i].oData.x = _posX;
                                this.aHitAreas[i].oData.y = _posY;
                                this.aHitAreas[i].aTouchIdentifiers.push(_identifer);
                                if(this.aHitAreas[i].oData.multiTouch) {
                                    this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                }
                            }
                            if(this.aHitAreas[i].oData.isDraggable) {
                                this.aHitAreas[i].oData.isBeingDragged = true;
                                this.aHitAreas[i].oData.x = _posX;
                                this.aHitAreas[i].oData.y = _posY;
                                this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                if(this.aHitAreas[i]) {
                                    this.aHitAreas[i].oData.isBeingDragged = false;
                                }
                            }
                        } else if(this.aHitAreas[i].oData.isDown && !this.aHitAreas[i].oData.hasLeft) {
                            for(var j = 0; j < this.aHitAreas[i].aTouchIdentifiers.length; j++) {
                                if(this.aHitAreas[i].aTouchIdentifiers[j] == _identifer) {
                                    this.aHitAreas[i].aTouchIdentifiers.splice(j, 1);
                                    j -= 1;
                                }
                            }
                            if(this.aHitAreas[i].aTouchIdentifiers.length == 0) {
                                this.aHitAreas[i].oData.hasLeft = true;
                                if(!this.aHitAreas[i].oData.isBeingDragged) {
                                    this.aHitAreas[i].oData.isDown = false;
                                }
                                if(this.aHitAreas[i].oData.multiTouch) {
                                    this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                }
                            }
                        }
                    }
                }
            }
        };
        UserInput.prototype.keyDown = function (e) {
            for(var i = 0; i < this.aKeys.length; i++) {
                if(e.keyCode == this.aKeys[i].keyCode) {
                    e.preventDefault();
                    this.aKeys[i].oData.isDown = true;
                    this.aKeys[i].callback(this.aKeys[i].id, this.aKeys[i].oData);
                }
            }
        };
        UserInput.prototype.keyUp = function (e) {
            for(var i = 0; i < this.aKeys.length; i++) {
                if(e.keyCode == this.aKeys[i].keyCode) {
                    e.preventDefault();
                    this.aKeys[i].oData.isDown = false;
                    this.aKeys[i].callback(this.aKeys[i].id, this.aKeys[i].oData);
                }
            }
        };
        UserInput.prototype.checkKeyFocus = function () {
            window.focus();
            if(this.aKeys.length > 0) {
                window.removeEventListener('keydown', this.keyDownEvtFunc, false);
                window.removeEventListener('keyup', this.keyUpEvtFunc, false);
                window.addEventListener('keydown', this.keyDownEvtFunc, false);
                window.addEventListener('keyup', this.keyUpEvtFunc, false);
            }
        };
        UserInput.prototype.addKey = function (_id, _callback, _oCallbackData, _keyCode) {
            if(_oCallbackData == null) {
                _oCallbackData = new Object();
            }
            this.aKeys.push({
                id: _id,
                callback: _callback,
                oData: _oCallbackData,
                keyCode: _keyCode
            });
            this.checkKeyFocus();
        };
        UserInput.prototype.removeKey = function (_id) {
            for(var i = 0; i < this.aKeys.length; i++) {
                if(this.aKeys[i].id == _id) {
                    this.aKeys.splice(i, 1);
                    i -= 1;
                }
            }
        };
        UserInput.prototype.addHitArea = function (_id, _callback, _oCallbackData, _type, _oAreaData, _isUnique) {
            if (typeof _isUnique === "undefined") { _isUnique = false; }
            if(_oCallbackData == null) {
                _oCallbackData = new Object();
            }
            if(_isUnique) {
                this.removeHitArea(_id);
            }
            if(!_oAreaData.scale) {
                _oAreaData.scale = 1;
            }
            if(!_oAreaData.align) {
                _oAreaData.align = [
                    0,
                    0
                ];
            }
            var aTouchIdentifiers = new Array();
            switch(_type) {
                case "image":
                    var aRect;
                    aRect = new Array(_oAreaData.aPos[0] - (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].width / 2) * _oAreaData.scale, _oAreaData.aPos[1] - (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].height / 2) * _oAreaData.scale, _oAreaData.aPos[0] + (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].width / 2) * _oAreaData.scale, _oAreaData.aPos[1] + (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].height / 2) * _oAreaData.scale);
                    this.aHitAreas.push({
                        id: _id,
                        aTouchIdentifiers: aTouchIdentifiers,
                        callback: _callback,
                        oData: _oCallbackData,
                        rect: true,
                        area: aRect,
                        align: _oAreaData.align
                    });
                    break;
                case "rect":
                    this.aHitAreas.push({
                        id: _id,
                        aTouchIdentifiers: aTouchIdentifiers,
                        callback: _callback,
                        oData: _oCallbackData,
                        rect: true,
                        area: _oAreaData.aRect,
                        align: _oAreaData.align
                    });
                    break;
            }
        };
        UserInput.prototype.removeHitArea = function (_id) {
            for(var i = 0; i < this.aHitAreas.length; i++) {
                if(this.aHitAreas[i].id == _id) {
                    this.aHitAreas.splice(i, 1);
                    i -= 1;
                }
            }
        };
        UserInput.prototype.resetAll = function () {
            for(var i = 0; i < this.aHitAreas.length; i++) {
                this.aHitAreas[i].oData.isDown = false;
                this.aHitAreas[i].oData.isBeingDragged = false;
                this.aHitAreas[i].aTouchIdentifiers = new Array();
            }
            this.isDown = false;
        };
        return UserInput;
    })();
    Utils.UserInput = UserInput;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var FpsMeter = (function () {
        function FpsMeter(_canvasHeight) {
            this.updateFreq = 10;
            this.updateInc = 0;
            this.frameAverage = 0;
            this.display = 1;
            this.log = "";
            this.render = function (_ctx) {
                this.frameAverage += this.delta / this.updateFreq;
                if(++this.updateInc >= this.updateFreq) {
                    this.updateInc = 0;
                    this.display = this.frameAverage;
                    this.frameAverage = 0;
                }
                _ctx.textAlign = "left";
                ctx.font = "10px Helvetica";
                _ctx.fillStyle = "#333333";
                _ctx.beginPath();
                _ctx.rect(0, this.canvasHeight - 15, 40, 15);
                _ctx.closePath();
                _ctx.fill();
                _ctx.fillStyle = "#ffffff";
                _ctx.fillText(Math.round(1000 / (this.display * 1000)) + " fps " + this.log, 5, this.canvasHeight - 5);
            };
            this.canvasHeight = _canvasHeight;
        }
        FpsMeter.prototype.update = function (_delta) {
            this.delta = _delta;
        };
        return FpsMeter;
    })();
    Utils.FpsMeter = FpsMeter;
})(Utils || (Utils = {}));
var Elements;
(function (Elements) {
    var Background = (function () {
        function Background() {
            this.x = 0;
            this.y = 0;
            this.targY = 0;
            this.incY = 0;
            this.renderState = null;
            this.wallId = 0;
            this.oImgData = assetLib.getData("background");
            this.oGameElementsImgData = assetLib.getData("gameElements");

            forcedModeProperties = window.famobi.getFeatureProperties("forced_mode");
            forcedModeProperties.state = forcedModeProperties.state || {};
            forcedModeProperties.override = forcedModeProperties.override || {};

            this.wallId = parseInt(forcedModeProperties.state.wall_id || oGameData.cupId % 5);
        }
        Background.prototype.renderGame = function () {
            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableBgBottom].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableBgBottom].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableBgBottom].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableBgBottom].height;
            var tempTop = canvas.height / 4 - 220 + 193 + tableTop.offsetY * 25;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, 0, tempTop, canvas.width, (canvas.height - tempTop) * (1 + tableTop.offsetY / 3) * 1.1);
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["tableBg" + this.wallId]].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["tableBg" + this.wallId]].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["tableBg" + this.wallId]].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["tableBg" + this.wallId]].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 4 - 220 + tableTop.offsetY * 25, canvas.width, bHeight);
        };
        Background.prototype.renderMenu = function () {
            ctx.drawImage(this.oImgData.img, 0, 0, this.oImgData.img.width, this.oImgData.img.height, 0, 0, canvas.width, canvas.height);
        };
        return Background;
    })();
    Elements.Background = Background;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Panel = (function () {
        function Panel(_panelType, _aButs) {
            this.timer = .3;
            this.endTime = 0;
            this.posY = 0;
            this.largeNumberSpace = 68;
            this.smallNumberSpace = 17;
            this.scoreNumberSpace = 15;
            this.incY = 0;
            this.flareRot = 0;
            this.cupFlipInc = 0;
            this.userCardScale = 1;
            this.enemyCardScale = 1;
            this.userBatX = 0;
            this.userBatY = 0;
            this.enemyBatX = 0;
            this.enemyBatY = 0;
            this.ballX = 0;
            this.ballY = 0;
            this.ballHeight = 0;
            this.oSplashLogoImgData = assetLib.getData("splashLogo");
            this.oCountryFlagsImgData = assetLib.getData("countryFlags");
            this.oUiElementsImgData = assetLib.getData("uiElements");
            this.oLargeNumbersImgData = assetLib.getData("largeNumbers");
            this.oSmallNumbersImgData = assetLib.getData("smallNumbers");
            this.oScoreNumbersImgData = assetLib.getData("scoreNumbers");
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.panelType = _panelType;
            this.aButs = _aButs;
            this.cupFlipInc = 0;
        }
        Panel.prototype.update = function () {
            this.incY += 10 * delta;
        };
        Panel.prototype.startTween1 = function () {
            this.posY = 500;
            TweenLite.to(this, .5, {
                posY: 0,
                ease: "Cubic.easeOut"
            });
        };
        Panel.prototype.startTut = function () {
            var _this = this;
            this.userBatX = -50;
            this.userBatY = 85;
            this.enemyBatX = 0;
            this.enemyBatY = -130;
            this.ballX = 0;
            this.ballY = 19;
            TweenLite.to(this, .55, {
                delay: .35,
                userBatX: 50,
                userBatY: -60,
                ease: "Back.easeOut",
                onComplete: function () {
                    _this.movePlayerBat(0);
                }
            });
            TweenLite.to(this, .5, {
                delay: .8,
                enemyBatX: 50,
                ease: "Back.easeOut",
                onComplete: function () {
                }
            });
            this.ballHeight = 30;
            TweenLite.to(this, .55, {
                delay: .5,
                ballX: 30,
                ballY: -100,
                ease: "Linear.easeNone",
                onComplete: function () {
                }
            });
            TweenLite.to(this, .6, {
                delay: .6,
                ballHeight: -30,
                ease: "Quad.easeIn",
                onComplete: function () {
                }
            });
        };
        Panel.prototype.movePlayerBat = function (_id) {
            var _this = this;
            switch(_id) {
                case 0:
                    TweenLite.to(this, .5, {
                        userBatX: 130,
                        userBatY: 85,
                        ease: "Quad.easeInOut",
                        onComplete: function () {
                            _this.movePlayerBat(1);
                        }
                    });
                    TweenLite.to(this, .65, {
                        delay: .25,
                        ballX: 75,
                        ballY: 50,
                        ease: "Quad.easeIn",
                        onComplete: function () {
                            TweenLite.to(_this, .65, {
                                ballX: -20,
                                ballY: -100,
                                ease: "Quad.easeOut",
                                onComplete: function () {
                                }
                            });
                        }
                    });
                    TweenLite.to(this, .65, {
                        delay: .25,
                        ballHeight: 40,
                        ease: "Quad.easeIn",
                        onComplete: function () {
                            TweenLite.to(_this, .65, {
                                ballHeight: -30,
                                ease: "Quad.easeIn",
                                onComplete: function () {
                                }
                            });
                        }
                    });
                    break;
                case 1:
                    TweenLite.to(this, .5, {
                        delay: .3,
                        userBatX: -30,
                        userBatY: -60,
                        ease: "Back.easeOut",
                        onComplete: function () {
                            _this.movePlayerBat(2);
                        }
                    });
                    TweenLite.to(this, .5, {
                        delay: .8,
                        enemyBatX: -30,
                        ease: "Back.easeOut",
                        onComplete: function () {
                        }
                    });
                    break;
                case 2:
                    TweenLite.to(this, .5, {
                        userBatX: -130,
                        userBatY: 85,
                        ease: "Quad.easeInOut",
                        onComplete: function () {
                            _this.movePlayerBat(3);
                        }
                    });
                    TweenLite.to(this, .65, {
                        delay: .25,
                        ballX: -75,
                        ballY: 50,
                        ease: "Quad.easeIn",
                        onComplete: function () {
                            TweenLite.to(_this, .65, {
                                ballX: 20,
                                ballY: -100,
                                ease: "Quad.easeOut",
                                onComplete: function () {
                                }
                            });
                        }
                    });
                    TweenLite.to(this, .65, {
                        delay: .25,
                        ballHeight: 40,
                        ease: "Quad.easeIn",
                        onComplete: function () {
                            TweenLite.to(_this, .65, {
                                ballHeight: -30,
                                ease: "Quad.easeIn",
                                onComplete: function () {
                                }
                            });
                        }
                    });
                    break;
                case 3:
                    TweenLite.to(this, .5, {
                        delay: .3,
                        userBatX: 30,
                        userBatY: -60,
                        ease: "Back.easeOut",
                        onComplete: function () {
                            _this.movePlayerBat(0);
                        }
                    });
                    TweenLite.to(this, .5, {
                        delay: .8,
                        enemyBatX: 30,
                        ease: "Back.easeOut",
                        onComplete: function () {
                        }
                    });
                    break;
            }
        };
        Panel.prototype.cardTween = function (_player) {
            if(_player == "user") {
                this.userCardScale = .25;
                TweenLite.to(this, .5, {
                    userCardScale: 1,
                    ease: "Bounce.easeOut"
                });
            } else {
                this.enemyCardScale = .25;
                TweenLite.to(this, .5, {
                    enemyCardScale: 1,
                    ease: "Bounce.easeOut"
                });
            }
        };
        Panel.prototype.switchBut = function (_id0, _id1) {
            for(var i = 0; i < this.aButs.length; i++) {
                if(this.aButs[i].id == _id0) {
                    this.aButs[i].id = _id1;
                    break;
                }
            }
        };
        Panel.prototype.render = function (_butsOnTop) {
            if (typeof _butsOnTop === "undefined") { _butsOnTop = true; }
            if(!_butsOnTop) {
                this.addButs(ctx);
            }
            switch(this.panelType) {
                case "splash":
                    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(this.oSplashLogoImgData.img, canvas.width / 2 - this.oSplashLogoImgData.img.width / 2, canvas.height / 2 - this.oSplashLogoImgData.img.height / 2 - this.posY);
                    break;
                case "start":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleFadeBar].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleFadeBar].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleFadeBar].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleFadeBar].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height * .57 - bHeight / 2 + this.posY / 2, canvas.width, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBats].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBats].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBats].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBats].height;
                    var tempScale = Math.min((canvas.height / 3) / bHeight, 1);
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * tempScale, canvas.height * .57 - (bHeight / 2) * tempScale - this.posY / 4, bWidth * tempScale, bHeight * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBall].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBall].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBall].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBall].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2 + 50) * tempScale, canvas.height * .57 - (bHeight / 2 + 50) * tempScale - this.posY / 3, bWidth * tempScale, bHeight * tempScale);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.globeLogo].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.globeLogo].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.globeLogo].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.globeLogo].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height * .2 - bHeight / 2 + 80 - this.posY / 2, bWidth, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleLogo].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleLogo].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleLogo].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleLogo].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height * .2 - bHeight / 2 - this.posY, bWidth, bHeight);
                    break;
                case "credits":
                    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(this.oSplashLogoImgData.img, canvas.width / 2 - this.oSplashLogoImgData.img.width / 2, canvas.height * .45 - this.oSplashLogoImgData.img.height / 2 - this.posY);
                    break;
                case "chooseCountry":
                    for(var i = 0; i < countryFlags.aIds.length / 2; i++) {
                        var tempI = i + flagPage * (countryFlags.aIds.length / 2);
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.countryBut].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.countryBut].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.countryBut].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.countryBut].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + ((i % 4) - 2) * 120 + 60, canvas.height / 2 - bHeight / 2 - (this.posY * 5) / (i + 1) + (Math.floor(i / 4) - 2.5) * 90 + 45, bWidth, bHeight);
                        var bData = countryFlags.getBData(countryFlags.aIds[tempI]);
                        ctx.drawImage(this.oCountryFlagsImgData.img, bData.bX, bData.bY, bData.bWidth, bData.bHeight, canvas.width / 2 - bData.bWidth / 2 + ((i % 4) - 2) * 120 + 60, canvas.height / 2 - bData.bHeight / 2 - (this.posY * 5) / (i + 1) + (Math.floor(i / 4) - 2.5) * 90 + 45, bData.bWidth, bData.bHeight);
                    }
                    var id = flagPage + 1;
                    var tempPosX = canvas.width / 2 - 20;
                    var tempPosY = canvas.height - 28;
                    var tempScale = .75;
                    var imgX = (id * this.oSmallNumbersImgData.oData.spriteWidth) % this.oSmallNumbersImgData.img.width;
                    var imgY = Math.floor(id / (this.oSmallNumbersImgData.img.width / this.oSmallNumbersImgData.oData.spriteWidth)) * this.oSmallNumbersImgData.oData.spriteHeight;
                    ctx.drawImage(this.oSmallNumbersImgData.img, imgX, imgY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight, tempPosX, tempPosY - this.posY / 2, this.oSmallNumbersImgData.oData.spriteWidth * tempScale, this.oSmallNumbersImgData.oData.spriteHeight * tempScale);
                    var id = 10;
                    var imgX = (id * this.oSmallNumbersImgData.oData.spriteWidth) % this.oSmallNumbersImgData.img.width;
                    var imgY = Math.floor(id / (this.oSmallNumbersImgData.img.width / this.oSmallNumbersImgData.oData.spriteWidth)) * this.oSmallNumbersImgData.oData.spriteHeight;
                    ctx.drawImage(this.oSmallNumbersImgData.img, imgX, imgY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight, tempPosX + this.smallNumberSpace * tempScale, tempPosY - this.posY / 2, this.oSmallNumbersImgData.oData.spriteWidth * tempScale, this.oSmallNumbersImgData.oData.spriteHeight * tempScale);
                    var id = 2;
                    var imgX = (id * this.oSmallNumbersImgData.oData.spriteWidth) % this.oSmallNumbersImgData.img.width;
                    var imgY = Math.floor(id / (this.oSmallNumbersImgData.img.width / this.oSmallNumbersImgData.oData.spriteWidth)) * this.oSmallNumbersImgData.oData.spriteHeight;
                    ctx.drawImage(this.oSmallNumbersImgData.img, imgX, imgY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight, tempPosX + (this.smallNumberSpace * 2) * tempScale, tempPosY - this.posY / 2, this.oSmallNumbersImgData.oData.spriteWidth * tempScale, this.oSmallNumbersImgData.oData.spriteHeight * tempScale);
                    break;
                case "map":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleFadeBar].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleFadeBar].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleFadeBar].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleFadeBar].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height * .5 - bHeight / 2 + this.posY / 2, canvas.width, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.map].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.map].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.map].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.map].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height * .45 - bHeight / 2 - this.posY / 2, bWidth, bHeight);
                    for(var i = 0; i < aMapMarkerPos.length; i++) {
                        var tempX = canvas.width / 2 + aMapMarkerPos[i][0];
                        var tempY = canvas.height * .45 + aMapMarkerPos[i][1] - this.posY * (1 + i / 2);
                        var temp = 0;
                        if(i < oGameData.cupId) {
                            temp = 2;
                        } else if(i == oGameData.cupId) {
                            temp = 1;
                            this.flare(tempX, tempY, .5);
                        }
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["mapMarker" + temp]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["mapMarker" + temp]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["mapMarker" + temp]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["mapMarker" + temp]].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, tempX - bWidth / 2, tempY - bHeight / 2, bWidth, bHeight);
                        var tempNum = (i + 1).toString();
                        for(var j = 0; j < tempNum.length; j++) {
                            var tempScale = .23;
                            var id = parseFloat(tempNum.charAt(j));
                            var imgX = (id * this.oLargeNumbersImgData.oData.spriteWidth) % this.oLargeNumbersImgData.img.width;
                            var imgY = Math.floor(id / (this.oLargeNumbersImgData.img.width / this.oLargeNumbersImgData.oData.spriteWidth)) * this.oLargeNumbersImgData.oData.spriteHeight;
                            ctx.drawImage(this.oLargeNumbersImgData.img, imgX, imgY, this.oLargeNumbersImgData.oData.spriteWidth, this.oLargeNumbersImgData.oData.spriteHeight, tempX + (j * this.largeNumberSpace - (tempNum.length * this.largeNumberSpace) / 2) * tempScale - 2, tempY - (this.oLargeNumbersImgData.oData.spriteHeight / 2) * tempScale, this.oLargeNumbersImgData.oData.spriteWidth * tempScale, this.oLargeNumbersImgData.oData.spriteHeight * tempScale);
                        }
                        var tempScale = .5;
                        if(temp == 2) {
                            var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup3].x;
                            var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup3].y;
                            var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup3].width;
                            var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup3].height;
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, tempX - (bWidth / 2) * tempScale + 26, tempY - (bHeight / 2) * tempScale - 12, bWidth * tempScale, bHeight * tempScale);
                        } else if(temp == 1) {
                            var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup2].x;
                            var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup2].y;
                            var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup2].width;
                            var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup2].height;
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, tempX - (bWidth / 2) * tempScale + 26, tempY - (bHeight / 2) * tempScale - 12, bWidth * tempScale, bHeight * tempScale);
                            var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup3].x;
                            var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup3].y;
                            var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup3].width;
                            var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup3].height;
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY + bHeight - (oGameData.gameId / 6) * bHeight, bWidth, Math.max((oGameData.gameId / 6) * bHeight, .1), tempX - (bWidth / 2) * tempScale + 26, tempY - (bHeight / 2) * tempScale - 12 + (bHeight - (oGameData.gameId / 6) * bHeight) * tempScale - this.posY / 2, bWidth * tempScale, Math.max((oGameData.gameId / 6) * bHeight, .1) * tempScale);
                        }
                    }
                    break;
                case "gameIntro":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleFadeBar].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleFadeBar].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleFadeBar].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleFadeBar].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height * .6 - bHeight / 2 + this.posY / 2, canvas.width, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBats].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBats].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBats].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBats].height;
                    var tempScale = Math.min((canvas.height / 3) / bHeight, 1);
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * tempScale, canvas.height * .3 - (bHeight / 2) * tempScale - this.posY / 2, bWidth * tempScale, bHeight * tempScale);
                    var id = oGameData.gameId + 1;
                    var tempPosX = 22;
                    var tempPosY = 120;
                    var imgX = (id * this.oSmallNumbersImgData.oData.spriteWidth) % this.oSmallNumbersImgData.img.width;
                    var imgY = Math.floor(id / (this.oSmallNumbersImgData.img.width / this.oSmallNumbersImgData.oData.spriteWidth)) * this.oSmallNumbersImgData.oData.spriteHeight;
                    ctx.drawImage(this.oSmallNumbersImgData.img, imgX, imgY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight, tempPosX, tempPosY - this.posY / 2, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight);
                    var id = 10;
                    var imgX = (id * this.oSmallNumbersImgData.oData.spriteWidth) % this.oSmallNumbersImgData.img.width;
                    var imgY = Math.floor(id / (this.oSmallNumbersImgData.img.width / this.oSmallNumbersImgData.oData.spriteWidth)) * this.oSmallNumbersImgData.oData.spriteHeight;
                    ctx.drawImage(this.oSmallNumbersImgData.img, imgX, imgY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight, tempPosX + this.smallNumberSpace, tempPosY - this.posY / 2, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight);
                    var id = 6;
                    var imgX = (id * this.oSmallNumbersImgData.oData.spriteWidth) % this.oSmallNumbersImgData.img.width;
                    var imgY = Math.floor(id / (this.oSmallNumbersImgData.img.width / this.oSmallNumbersImgData.oData.spriteWidth)) * this.oSmallNumbersImgData.oData.spriteHeight;
                    ctx.drawImage(this.oSmallNumbersImgData.img, imgX, imgY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight, tempPosX + this.smallNumberSpace * 2, tempPosY - this.posY / 2, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight);
                    var tempScale = .8;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup0].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup0].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup0].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup0].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 5, 5 - this.posY / 2, bWidth * tempScale, bHeight * tempScale);
                    this.cupFlipInc += delta * 4;
                    if(Math.floor(this.cupFlipInc) % 2 == 0) {
                        var tempCup = 2;
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + tempCup]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + tempCup]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + tempCup]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + tempCup]].height;
                        var tempGameId = oGameData.gameId + 1;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY + bHeight - (tempGameId / 6) * bHeight, bWidth, Math.max((1 / 6) * bHeight, .1), 5, 5 + (bHeight - (tempGameId / 6) * bHeight) * tempScale - this.posY / 2, bWidth * tempScale, Math.max((1 / 6) * bHeight, .1) * tempScale);
                    }
                    var tempCup = 3;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + tempCup]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + tempCup]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + tempCup]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + tempCup]].height;
                    var tempGameId = oGameData.gameId;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY + bHeight - (tempGameId / 6) * bHeight, bWidth, Math.max((tempGameId / 6) * bHeight, .1), 5, 5 + (bHeight - (tempGameId / 6) * bHeight) * tempScale - this.posY / 2, bWidth * tempScale, Math.max((tempGameId / 6) * bHeight, .1) * tempScale);
                    var id = 10;
                    var imgX = (id * this.oLargeNumbersImgData.oData.spriteWidth) % this.oLargeNumbersImgData.img.width;
                    var imgY = Math.floor(id / (this.oLargeNumbersImgData.img.width / this.oLargeNumbersImgData.oData.spriteWidth)) * this.oLargeNumbersImgData.oData.spriteHeight;
                    ctx.drawImage(this.oLargeNumbersImgData.img, imgX, imgY, this.oLargeNumbersImgData.oData.spriteWidth, this.oLargeNumbersImgData.oData.spriteHeight, canvas.width / 2 - this.oLargeNumbersImgData.oData.spriteWidth / 2 - this.largeNumberSpace / 2, canvas.height * .2 - this.oLargeNumbersImgData.oData.spriteHeight / 2 - this.posY, this.oLargeNumbersImgData.oData.spriteWidth, this.oLargeNumbersImgData.oData.spriteHeight);
                    var id = oGameData.gameId + 1;
                    var imgX = (id * this.oLargeNumbersImgData.oData.spriteWidth) % this.oLargeNumbersImgData.img.width;
                    var imgY = Math.floor(id / (this.oLargeNumbersImgData.img.width / this.oLargeNumbersImgData.oData.spriteWidth)) * this.oLargeNumbersImgData.oData.spriteHeight;
                    ctx.drawImage(this.oLargeNumbersImgData.img, imgX, imgY, this.oLargeNumbersImgData.oData.spriteWidth, this.oLargeNumbersImgData.oData.spriteHeight, canvas.width / 2 - this.oLargeNumbersImgData.oData.spriteWidth / 2 + this.largeNumberSpace / 2, canvas.height * .2 - this.oLargeNumbersImgData.oData.spriteHeight / 2 - this.posY, this.oLargeNumbersImgData.oData.spriteWidth, this.oLargeNumbersImgData.oData.spriteHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.vsText].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.vsText].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.vsText].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.vsText].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height * .6 - bHeight / 2 - this.posY / 4, bWidth, bHeight);
                    var bData = countryFlags.getBData(oGameData.userId);
                    var tempScale = 1.2;
                    ctx.drawImage(this.oCountryFlagsImgData.img, bData.bX, bData.bY, bData.bWidth, bData.bHeight, canvas.width / 2 - (bData.bWidth / 2) * tempScale - 120, canvas.height * .6 - (bData.bHeight / 2) * tempScale - this.posY / 4, bData.bWidth * tempScale, bData.bHeight * tempScale);
                    var bData = countryFlags.getBData(oGameData.enemyId);
                    ctx.drawImage(this.oCountryFlagsImgData.img, bData.bX, bData.bY, bData.bWidth, bData.bHeight, canvas.width / 2 - (bData.bWidth / 2) * tempScale + 120, canvas.height * .6 - (bData.bHeight / 2) * tempScale - this.posY / 4, bData.bWidth * tempScale, bData.bHeight * tempScale);
                    break;
                case "game":
                    let show_score = true;
                    let show_flags = true;
                    if(forcedModeProperties != null && forcedModeProperties.override != null && Array.isArray(forcedModeProperties.override.hide_ui)) {
                        show_score = !forcedModeProperties.override.hide_ui.includes("score");
                        show_flags = !forcedModeProperties.override.hide_ui.includes("flags");
                    }
                    if(show_score){
                        var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.scoreCard].x;
                        var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.scoreCard].y;
                        var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.scoreCard].width;
                        var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.scoreCard].height;
                        ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 - 22, 0 - this.posY / 2, bWidth, bHeight * this.userCardScale);
                        var tempScore = oGameData.userScore.toString();
                        for(var i = 0; i < tempScore.length; i++) {
                            var id = parseFloat(tempScore.charAt(i));
                            var imgX = (id * this.oScoreNumbersImgData.oData.spriteWidth) % this.oScoreNumbersImgData.img.width;
                            var imgY = Math.floor(id / (this.oScoreNumbersImgData.img.width / this.oScoreNumbersImgData.oData.spriteWidth)) * this.oScoreNumbersImgData.oData.spriteHeight;
                            ctx.drawImage(this.oScoreNumbersImgData.img, imgX, imgY, this.oScoreNumbersImgData.oData.spriteWidth, this.oScoreNumbersImgData.oData.spriteHeight, canvas.width / 2 - 24 + i * this.scoreNumberSpace - (tempScore.length * this.scoreNumberSpace) / 2, 15 - this.posY / 2, this.oScoreNumbersImgData.oData.spriteWidth, this.oScoreNumbersImgData.oData.spriteHeight * this.userCardScale);
                        }
                        var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.scoreCard].x;
                        var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.scoreCard].y;
                        var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.scoreCard].width;
                        var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.scoreCard].height;
                        ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + 22, 0 - this.posY / 2, bWidth, bHeight * this.enemyCardScale);
                        var tempScore = oGameData.enemyScore.toString();
                        for(var i = 0; i < tempScore.length; i++) {
                            var id = parseFloat(tempScore.charAt(i));
                            var imgX = (id * this.oScoreNumbersImgData.oData.spriteWidth) % this.oScoreNumbersImgData.img.width;
                            var imgY = Math.floor(id / (this.oScoreNumbersImgData.img.width / this.oScoreNumbersImgData.oData.spriteWidth)) * this.oScoreNumbersImgData.oData.spriteHeight;
                            ctx.drawImage(this.oScoreNumbersImgData.img, imgX, imgY, this.oScoreNumbersImgData.oData.spriteWidth, this.oScoreNumbersImgData.oData.spriteHeight, canvas.width / 2 + 19 + i * this.scoreNumberSpace - (tempScore.length * this.scoreNumberSpace) / 2, 15 - this.posY / 2, this.oScoreNumbersImgData.oData.spriteWidth, this.oScoreNumbersImgData.oData.spriteHeight * this.enemyCardScale);
                        }
                    }
                    if(show_flags){
                        var bData = countryFlags.getBData(oGameData.userId);
                        var tempScale = .7;
                        ctx.drawImage(this.oCountryFlagsImgData.img, bData.bX, bData.bY, bData.bWidth, bData.bHeight, canvas.width / 2 - (bData.bWidth / 2) * tempScale - 80, 10 - this.posY, bData.bWidth * tempScale, bData.bHeight * tempScale);
                        var bData = countryFlags.getBData(oGameData.enemyId);
                        ctx.drawImage(this.oCountryFlagsImgData.img, bData.bX, bData.bY, bData.bWidth, bData.bHeight, canvas.width / 2 - (bData.bWidth / 2) * tempScale + 80, 10 - this.posY, bData.bWidth * tempScale, bData.bHeight * tempScale);
                    }

                    if(firstRun) {
                        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.tutScreen].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.tutScreen].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.tutScreen].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.tutScreen].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height / 2 - bHeight / 2 - this.posY / 2, bWidth, bHeight);
                        var tempId = 0;
                        var tempScale = .2;
                        ctx.save();
                        ctx.translate(canvas.width / 2 + this.enemyBatX, canvas.height / 2 + this.enemyBatY - this.posY / 2);
                        ctx.rotate(this.enemyBatX / 100);
                        ctx.scale(tempScale, tempScale);
                        var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["enemyBat" + tempId]].x;
                        var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["enemyBat" + tempId]].y;
                        var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["enemyBat" + tempId]].width;
                        var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["enemyBat" + tempId]].height;
                        ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 3, bWidth, bHeight);
                        ctx.restore();
                        tempScale = .4;
                        if(this.ballY < 20) {
                            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ballShadow].x;
                            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ballShadow].y;
                            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ballShadow].width;
                            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ballShadow].height;
                            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 + this.ballX - (bWidth / 2) * tempScale, canvas.height / 2 + this.ballY - (bHeight / 2) * tempScale - this.posY / 2, bWidth * tempScale, bHeight * tempScale);
                        }
                        tempScale = .4;
                        var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ball].x;
                        var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ball].y;
                        var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ball].width;
                        var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ball].height;
                        ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 + this.ballX - (bWidth / 2) * tempScale, canvas.height / 2 + this.ballY - (bHeight) * tempScale - this.posY / 2 - Math.abs(this.ballHeight), bWidth * tempScale, bHeight * tempScale);
                        var tempId = 4;
                        var tempScale = .45;
                        ctx.save();
                        ctx.translate(canvas.width / 2 + this.userBatX, canvas.height / 2 + this.userBatY - this.posY / 2);
                        ctx.rotate(this.userBatX / 100);
                        ctx.scale(tempScale, tempScale);
                        var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["enemyBat" + tempId]].x;
                        var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["enemyBat" + tempId]].y;
                        var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["enemyBat" + tempId]].width;
                        var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["enemyBat" + tempId]].height;
                        ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 2, bWidth, bHeight);
                        ctx.restore();
                        tempScale = .4;
                        var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.finger].x;
                        var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.finger].y;
                        var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.finger].width;
                        var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.finger].height;
                        ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 + this.userBatX, canvas.height / 2 + this.userBatY - this.posY / 2, bWidth, bHeight);
                    }
                    break;
                case "gameComplete":
                    if(oGameData.userScore > oGameData.enemyScore) {
                        this.flare(canvas.width / 2, canvas.height * .2 - 10 - this.posY);
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleFadeBar].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleFadeBar].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleFadeBar].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleFadeBar].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height * .55 - bHeight / 2 + this.posY / 2, canvas.width, bHeight);

                    if(!justWonCup) {
                        if(!forcedMode){
                            var tempScale = .8;
                            var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup0].x;
                            var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup0].y;
                            var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup0].width;
                            var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup0].height;
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 5, 5 - this.posY / 2, bWidth * tempScale, bHeight * tempScale);
                            var tempCup = 3;
                            var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + tempCup]].x;
                            var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + tempCup]].y;
                            var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + tempCup]].width;
                            var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["cup" + tempCup]].height;
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY + bHeight - (oGameData.gameId / 6) * bHeight, bWidth, Math.max((oGameData.gameId / 6) * bHeight, .1), 5, 5 + (bHeight - (oGameData.gameId / 6) * bHeight) * tempScale - this.posY / 2, bWidth * tempScale, Math.max((oGameData.gameId / 6) * bHeight, .1) * tempScale);
                            var id = oGameData.gameId;
                            var tempPosX = 22;
                            var tempPosY = 120;
                            var imgX = (id * this.oSmallNumbersImgData.oData.spriteWidth) % this.oSmallNumbersImgData.img.width;
                            var imgY = Math.floor(id / (this.oSmallNumbersImgData.img.width / this.oSmallNumbersImgData.oData.spriteWidth)) * this.oSmallNumbersImgData.oData.spriteHeight;
                            ctx.drawImage(this.oSmallNumbersImgData.img, imgX, imgY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight, tempPosX, tempPosY - this.posY / 2, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight);
                            var id = 10;
                            var imgX = (id * this.oSmallNumbersImgData.oData.spriteWidth) % this.oSmallNumbersImgData.img.width;
                            var imgY = Math.floor(id / (this.oSmallNumbersImgData.img.width / this.oSmallNumbersImgData.oData.spriteWidth)) * this.oSmallNumbersImgData.oData.spriteHeight;
                            ctx.drawImage(this.oSmallNumbersImgData.img, imgX, imgY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight, tempPosX + this.smallNumberSpace, tempPosY - this.posY / 2, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight);
                            var id = 6;
                            var imgX = (id * this.oSmallNumbersImgData.oData.spriteWidth) % this.oSmallNumbersImgData.img.width;
                            var imgY = Math.floor(id / (this.oSmallNumbersImgData.img.width / this.oSmallNumbersImgData.oData.spriteWidth)) * this.oSmallNumbersImgData.oData.spriteHeight;
                            ctx.drawImage(this.oSmallNumbersImgData.img, imgX, imgY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight, tempPosX + this.smallNumberSpace * 2, tempPosY - this.posY / 2, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight);
                        }
                        var tempIcon = oImageIds.winIcon;
                        if(oGameData.userScore < oGameData.enemyScore) {
                            tempIcon = oImageIds.loseIcon;
                        }
                        var bX = this.oUiElementsImgData.oData.oAtlasData[tempIcon].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[tempIcon].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[tempIcon].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[tempIcon].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height * .2 - bHeight / 2 - this.posY, bWidth, bHeight);
                    } else if(!forcedMode){
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup3].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup3].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup3].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cup3].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height * .2 - bHeight / 2 - this.posY, bWidth, bHeight);
                    }

                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.globeLogo].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.globeLogo].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.globeLogo].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.globeLogo].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height * .55 - bHeight / 2 + 80 - this.posY / 4, bWidth, bHeight);
                    var tempScore = oGameData.userScore.toString();
                    for(var i = 0; i < tempScore.length; i++) {
                        var id = parseFloat(tempScore.charAt(i));
                        var imgX = (id * this.oLargeNumbersImgData.oData.spriteWidth) % this.oLargeNumbersImgData.img.width;
                        var imgY = Math.floor(id / (this.oLargeNumbersImgData.img.width / this.oLargeNumbersImgData.oData.spriteWidth)) * this.oLargeNumbersImgData.oData.spriteHeight;
                        ctx.drawImage(this.oLargeNumbersImgData.img, imgX, imgY, this.oLargeNumbersImgData.oData.spriteWidth, this.oLargeNumbersImgData.oData.spriteHeight, canvas.width / 2 - 120 + i * this.largeNumberSpace - (tempScore.length * this.largeNumberSpace) / 2, canvas.height * .55 - 10 - bHeight / 2 - this.posY / 3, this.oLargeNumbersImgData.oData.spriteWidth, this.oLargeNumbersImgData.oData.spriteHeight);
                    }
                    var id = 12;
                    var imgX = (id * this.oLargeNumbersImgData.oData.spriteWidth) % this.oLargeNumbersImgData.img.width;
                    var imgY = Math.floor(id / (this.oLargeNumbersImgData.img.width / this.oLargeNumbersImgData.oData.spriteWidth)) * this.oLargeNumbersImgData.oData.spriteHeight;
                    ctx.drawImage(this.oLargeNumbersImgData.img, imgX, imgY, this.oLargeNumbersImgData.oData.spriteWidth, this.oLargeNumbersImgData.oData.spriteHeight, canvas.width / 2 - this.oLargeNumbersImgData.oData.spriteWidth / 3, canvas.height * .55 - 10 - this.oLargeNumbersImgData.oData.spriteHeight / 2 - this.posY / 2, this.oLargeNumbersImgData.oData.spriteWidth, this.oLargeNumbersImgData.oData.spriteHeight);
                    var tempScore = oGameData.enemyScore.toString();
                    for(var i = 0; i < tempScore.length; i++) {
                        var id = parseFloat(tempScore.charAt(i));
                        var imgX = (id * this.oLargeNumbersImgData.oData.spriteWidth) % this.oLargeNumbersImgData.img.width;
                        var imgY = Math.floor(id / (this.oLargeNumbersImgData.img.width / this.oLargeNumbersImgData.oData.spriteWidth)) * this.oLargeNumbersImgData.oData.spriteHeight;
                        ctx.drawImage(this.oLargeNumbersImgData.img, imgX, imgY, this.oLargeNumbersImgData.oData.spriteWidth, this.oLargeNumbersImgData.oData.spriteHeight, canvas.width / 2 + 120 + i * this.largeNumberSpace - (tempScore.length * this.largeNumberSpace) / 2, canvas.height * .55 - 10 - bHeight / 2 - this.posY / 3, this.oLargeNumbersImgData.oData.spriteWidth, this.oLargeNumbersImgData.oData.spriteHeight);
                    }
                    var bData = countryFlags.getBData(oGameData.userId);
                    var tempScale = 1.2;
                    ctx.drawImage(this.oCountryFlagsImgData.img, bData.bX, bData.bY, bData.bWidth, bData.bHeight, canvas.width / 2 - (bData.bWidth / 2) * tempScale - 120, canvas.height * .55 - 110 - (bData.bHeight / 2) * tempScale - this.posY / 2, bData.bWidth * tempScale, bData.bHeight * tempScale);
                    var bData = countryFlags.getBData(oGameData.enemyId);
                    ctx.drawImage(this.oCountryFlagsImgData.img, bData.bX, bData.bY, bData.bWidth, bData.bHeight, canvas.width / 2 - (bData.bWidth / 2) * tempScale + 120, canvas.height * .55 - 110 - (bData.bHeight / 2) * tempScale - this.posY / 2, bData.bWidth * tempScale, bData.bHeight * tempScale);
                    break;
                case "pause":
                    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    break;
            }
            if(_butsOnTop) {
                this.addButs(ctx);
            }
        };
        Panel.prototype.flare = function (_x, _y, _scale) {
            if (typeof _scale === "undefined") { _scale = 1; }
            this.flareRot += delta;
            var tempScale = (Math.sin(this.flareRot * 1) / 2) / 3;
            ctx.save();
            ctx.translate(_x, _y);
            ctx.rotate(this.flareRot);
            ctx.scale(_scale * (1 + tempScale), _scale * (1 - tempScale));
            var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flare].x;
            var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flare].y;
            var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flare].width;
            var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flare].height;
            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 2, bWidth, bHeight);
            ctx.scale(1 * (1 - tempScale), 1 * (1 + tempScale));
            ctx.scale(1 * (1 - tempScale), 1 * (1 + tempScale));
            ctx.rotate(-this.flareRot * 2);
            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 2, bWidth, bHeight);
            ctx.restore();
        };
        Panel.prototype.addButs = function (ctx) {
            for(var i = 0; i < this.aButs.length; i++) {
                var offsetPosY = this.posY;
                var floatY = 0;
                if(this.incY != 0 && !this.aButs[i].noMove) {
                    floatY = Math.sin(this.incY + i * 45) * 3;
                }
                if(i % 2 == 0) {
                }
                if(!this.aButs[i].scale) {
                    this.aButs[i].scale = 1;
                }
                var bX = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].x;
                var bY = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].y;
                var bWidth = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].width;
                var bHeight = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].height;
                var aX = canvas.width * this.aButs[i].align[0];
                var aY = canvas.height * this.aButs[i].align[1];
                ctx.drawImage(this.aButs[i].oImgData.img, bX, bY, bWidth, bHeight, aX + this.aButs[i].aPos[0] - (bWidth / 2) * (this.aButs[i].scale) + offsetPosY - floatY / 2, aY + this.aButs[i].aPos[1] - (bHeight / 2) * (this.aButs[i].scale) + floatY / 2, bWidth * (this.aButs[i].scale) + floatY, bHeight * (this.aButs[i].scale) - floatY);
            }
        };
        return Panel;
    })();
    Elements.Panel = Panel;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var UserBat = (function () {
        function UserBat() {
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.scale = 1;
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.targX = canvas.width / 2;
            this.targY = canvas.height - 150;
        }
        UserBat.prototype.update = function () {
            this.maxY = canvas.height / 4 + ((this.oGameElementsImgData.oData.oAtlasData[oImageIds.table0].height / tableTop.segs) * (.28 * tableTop.segs)) * (1 + tableTop.offsetY / 3) + tableTop.offsetY * 50;
            this.prevX = this.x;
            this.prevY = this.y;
            this.x = this.targX;
            this.y = Math.max(this.targY, this.maxY);
            this.rotation = Math.max(Math.min((this.x - canvas.width / 2) / 200, 90 * radian), -90 * radian);
            this.scale = (.47 + (this.y - this.maxY) / 500);
        };
        UserBat.prototype.getHitData = function (_tablePosX, _tablePosY) {
            _tablePosX = Math.min(Math.max(_tablePosX, -1), 1);
            var tempX = Math.max(Math.min((this.x - this.prevX) / delta, 3500), -3500) / 3500;
            var tempY = Math.max(Math.min((this.prevY - this.y) / delta, 4500) / 4500, 0);
            var tempSpin = 0;
            if(tempY < .5) {
                if(tempX > .5) {
                    tempSpin = -((tempX - .5) * 2) * (1 - (tempY * 2));
                } else if(tempX < -.5) {
                    tempSpin = -((tempX + .5) * 2) * (1 - (tempY * 2));
                }
            }
            if(_tablePosX < 0) {
                if(tempX > 0) {
                    tempX *= (1 - _tablePosX / 1);
                } else {
                    tempX *= 1.2;
                }
            } else {
                if(tempX < 0) {
                    tempX *= (1 + _tablePosX / 1);
                } else {
                    tempX *= 1.2;
                }
            }
            if(ball.servingState == 0) {
                tempX *= .5;
            }
            this.hitX = tempX + _tablePosX * .8;
            this.hitY = (1 - tempY) * .4;
            if(forcedModeProperties != null && forcedModeProperties.override != null) {
                if(forcedModeProperties.override.curve_mode) {
                    let curve_strength = .5;
                    if(typeof(forcedModeProperties.override.curve_strength) == "number") {
                        curve_strength = forcedModeProperties.override.curve_strength;
                    }
                    tempSpin = -((tempX + (curve_strength * (tempX > 0 ? 1 : -1))) * 2) * (1 - (tempY * 2))
                }
            }
            let tempSpeed = ((.3 + (.3 / .4) * (.4 - this.hitY)));
            if(forcedModeProperties.override.powerhit_mode && !player_serve){
                tempSpeed = 0.6
            }
            return {
                x: this.hitX,
                y: this.hitY,
                speed: tempSpeed,
                spin: tempSpin
            };
        };
        UserBat.prototype.render = function () {
            ctx.save();
            ctx.translate(this.x, this.y - 20 * this.scale);
            ctx.scale(this.scale, this.scale * Math.min(1 - ((this.y - canvas.height * .5) / (canvas.height * .5)) * .3, 1));
            ctx.rotate(this.rotation);
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.userBatCentre].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.userBatCentre].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.userBatCentre].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.userBatCentre].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 3, bWidth, bHeight);
            ctx.rotate(-this.rotation);
            ctx.translate(0, Math.min(7 * Math.max(((this.y - canvas.height * .5) / (canvas.height * .5)), 0), 7));
            ctx.rotate(this.rotation);
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.userBatEdge].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.userBatEdge].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.userBatEdge].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.userBatEdge].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 3 - 23, bWidth, bHeight);
            ctx.restore();
        };
        return UserBat;
    })();
    Elements.UserBat = UserBat;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var EnemyBat = (function () {
        function EnemyBat() {
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.scale = 1;
            this.speedX = 3000;
            this.maxAcc = 500;
            this.skillLevel = 0;
            this.id = 0;
            this.aEases = new Array("Quad.easeInOut", "Back.easeOut", "Cubic.easeOut", "Back.easeInOut");
            this.trackBall = false;
            this.slideInc = 0;
            this.flailInc = 0;
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.x = canvas.width / 2;
            this.targX = 0;
            this.targY = 0;
            this.accX = 0;
            this.id = (oGameData.cupId * 6 + oGameData.gameId) % 7;
            if(forcedMode) {
                if(forcedModeProperties != null && forcedModeProperties.override != null &&
                    typeof(forcedModeProperties.override.enemy_difficulty) == "string") {
                    switch(forcedModeProperties.override.enemy_difficulty) {
                        case "easy": this.skillLevel = 0.1; break;
                        case "medium": this.skillLevel = 0.5; break;
                        case "hard": this.skillLevel = 1; break;
                        case "broken": this.skillLevel = 2; break;
                        default: this.skillLevel = 0.5; break;
                    }
                    console.log("Difficulty: " + forcedModeProperties.override.enemy_difficulty + " => " + this.skillLevel);
                }
            } else {
                if(oGameData.cupId == 0) {
                    this.skillLevel = ((oGameData.gameId + 1) * (2.5 / 6)) / 10;
                } else {
                    this.skillLevel = (2.5 + (7.5 / 9) * (oGameData.cupId - 1) + (oGameData.gameId + 1) * ((7.5 / 9) / 6)) / 10;
                }
            }
        }
        EnemyBat.prototype.resetToCentre = function () {
            this.trackBall = false;
            if(this.moveTween) {
                this.moveTween.kill();
            }
            this.targX = this.x - canvas.width / 2;
            this.moveTween = TweenLite.to(this, 1, {
                targX: 0,
                targY: 0,
                ease: "Quad.easeInOut",
                onComplete: function () {
                    if(ball.lastHit == "enemy") {
                        ball.enemyServe();
                    }
                }
            });
        };
        EnemyBat.prototype.flail = function () {
            var _this = this;
            this.flailInc = 0;
            var flailTarg = 1;
            if(ball.x < this.x) {
                flailTarg = -1;
            }
            TweenLite.to(this, .5, {
                flailInc: flailTarg,
                ease: "Quad.easeInOut",
                onComplete: function () {
                    TweenLite.to(_this, .5, {
                        flailInc: 0,
                        ease: "Quad.easeInOut"
                    });
                }
            });
        };
        EnemyBat.prototype.setBouncePos = function (_targBounceX, _targBounceY, _spin) {
            var _this = this;
            if(this.moveTween) {
                this.moveTween.kill();
            }
            var tableImgHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.table0].height;
            if((_spin == 0 || Math.random() * 1 < .25) && ball.servingState != 1) {
                this.trackBall = false;
                var badAim = 0;
                if(Math.random() * 1 > .75 + this.skillLevel * .20) {
                    badAim = Math.random() * 100 - 50;
                }
                var tempY = (((_targBounceY * _targBounceY) * 235) * (1 + tableTop.offsetY / 2)) / 2;
                var tempX = ((tempY) * (tableTop.offsetX + _targBounceX * .6)) * 1.28 * (1 + tableTop.offsetY / 2) + (_targBounceX * 233) / 2 + _spin * 100;
                this.moveTween = TweenLite.to(this, (Math.random() * .35 + .3) * (1 + (1 - this.skillLevel) * .75), {
                    delay: (Math.random() * .2),
                    targX: tempX + badAim,
                    targY: tempY,
                    ease: this.aEases[Math.floor(Math.random() * this.aEases.length)],
                    onComplete: function () {
                        if(ball.lastHit == "enemy") {
                            _this.moveTween = TweenLite.to(_this, (Math.random() * .35 + .3) * (1 + (1 - _this.skillLevel) * .5), {
                                delay: (Math.random() * .3) * (1 + (1 - _this.skillLevel) * .5),
                                targX: Math.random() * 200 - 100,
                                targY: 0,
                                ease: "Quad.easeInOut"
                            });
                        }
                    }
                });
            } else {
                this.trackBall = true;
                this.slideInc = 0;
                this.moveTween = TweenLite.to(this, (Math.random() * .35 + .3) * (1 + (1 - this.skillLevel) * .5), {
                    targY: 0,
                    ease: "Quad.easeInOut"
                });
            }
        };
        EnemyBat.prototype.update = function () {
            if(window.famobi.paused) return;

            this.y = this.targY + canvas.height / 4 + tableTop.offsetY * 50 - 45;
            if(!this.trackBall) {
                this.x = this.targX + canvas.width / 2;
            } else {
                if(this.x > ball.x + 15) {
                    this.slideInc = Math.max(this.slideInc - 1000 * delta, -50 + (-50 * this.skillLevel));
                } else if(this.x < ball.x - 15) {
                    this.slideInc = Math.min(this.slideInc + 1000 * delta, 50 + (50 * this.skillLevel));
                }
                this.x += (this.slideInc * 4) * delta;
                if(ball.lastHit == "enemy") {
                    this.targX = this.x - canvas.width / 2;
                    this.moveTween = TweenLite.to(this, (Math.random() * .35 + .3) * (1 + (1 - this.skillLevel) * .5), {
                        delay: (Math.random() * .3) * (1 + (1 - this.skillLevel) * .5),
                        targX: Math.random() * 200 - 100,
                        targY: 0,
                        ease: "Quad.easeInOut"
                    });
                    this.trackBall = false;
                }
            }
            this.rotation = (this.x - canvas.width / 2) / 200;
            this.scale = .4 + (this.y - canvas.height / 4) / 300;
            this.x = Math.min(Math.max(this.x, canvas.width / 2 - 250), canvas.width / 2 + 250);
        };
        EnemyBat.prototype.getHitData = function (_tablePosX, _tablePosY) {
            if(ball.servingState == 0) {
                this.hitX = (Math.random() * 2 - 1);
                this.hitY = Math.random() * .2 + .65;
            } else {
                this.hitX = (Math.random() * 2 - 1) * (1 + (1 - this.skillLevel) * .25);
                this.hitY = Math.random() * .4 + .65;
            }
            var tempSpin = 0;
            if(this.hitY < .8) {
                if(this.hitX > .1) {
                    tempSpin = (Math.random() * -1) * (.75 + this.skillLevel * .25);
                } else if(this.hitX < -.1) {
                    tempSpin = (Math.random() * 1) * (.75 + this.skillLevel * .25);
                }
            }
            if(forcedModeProperties != null && forcedModeProperties.override != null) {
                if(forcedModeProperties.override.curve_mode) {
                    let curve_strength = 1;
                    if(typeof(forcedModeProperties.override.curve_strength) == "number") {
                        curve_strength = forcedModeProperties.override.curve_strength;
                    }
                    tempSpin = (((Math.random() * 2) - 1) * (.75 + this.skillLevel * .25)) * curve_strength;
                }
            }
            var tempSpeed = .3 + ((.3 / .4) * (this.hitY - .6)) * (.25 + this.skillLevel * .75);
            if(forcedModeProperties.override.powerhit_mode){
                tempSpeed = 0.6;
            }
            return {
                x: this.hitX,
                y: this.hitY,
                speed: tempSpeed,
                spin: tempSpin
            };
        };
        EnemyBat.prototype._getHitData = function (_tablePosX, _tablePosY) {
            if(ball.servingState == 0) {
                this.hitX = (Math.random() * 2 - 1);
                this.hitY = Math.random() * .2 + .65;
            } else {
                this.hitX = (Math.random() * 2 - 1) * (1 + (1 - this.skillLevel) * .25);
                this.hitY = Math.random() * .4 + .65;
            }
            var tempSpin = 0;
            if(this.hitY < .8) {
                if(this.hitX > .1) {
                    tempSpin = (Math.random() * -1) * (.75 + this.skillLevel * .25);
                } else if(this.hitX < -.1) {
                    tempSpin = (Math.random() * 1) * (.75 + this.skillLevel * .25);
                }
            }
            if(forcedModeProperties != null && forcedModeProperties.override != null) {
                if(forcedModeProperties.override.curve_mode) {
                    let curve_strength = 1;
                    if(typeof(forcedModeProperties.override.curve_strength) == "number") {
                        curve_strength = forcedModeProperties.override.curve_strength;
                    }
                    tempSpin = (((Math.random() * 2) - 1) * (.75 + this.skillLevel * .25)) * curve_strength;
                }
            }
            var tempSpeed = .3 + ((.3 / .4) * (this.hitY - .6)) * (.25 + this.skillLevel * .75);
            return {
                x: this.hitX,
                y: this.hitY,
                speed: tempSpeed,
                spin: tempSpin
            };
        };
        EnemyBat.prototype.render = function () {
            ctx.save();
            ctx.translate(this.x + (tableTop.offsetX + .8 * this.flailInc) * tableTop.sideMultiplier, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(this.scale, this.scale);
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["enemyBat" + this.id]].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["enemyBat" + this.id]].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["enemyBat" + this.id]].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["enemyBat" + this.id]].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 3, bWidth, bHeight);
            ctx.restore();
        };
        return EnemyBat;
    })();
    Elements.EnemyBat = EnemyBat;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Ball = (function () {
        function Ball() {
            this.x = 0;
            this.y = 0;
            this.height = 0;
            this.tablePosY = .5;
            this.tablePosX = 0;
            this.scale = 0;
            this.lastHit = "user";
            this.speed = .45;
            this.offTable = false;
            this.pause = false;
            this.spin = 0;
            this.spinInc = 0;
            this.servingState = 0;
            this.canHit = false;
            this.serveFlip = true;
            this.offSide = false;
            this.bounceX = 0;
            this.bounceY = 0;
            this.ballShortState = 0;
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.resetServe("user");
        }
        Ball.prototype.resetServe = function (_toServe) {
            var _this = this;
            this.servingState = 0;
            this.canHit = false;
            enemyBat.resetToCentre();
            tableTop.tweenToPos(0, 1, this.speed, this.lastHit, this.spin);
            this.lastHit = _toServe;
            rallyHits = 0;
            this.x = -100;
            this.bounceNum = 0;
            this.ballShortState = 0;
            this.offTable = false;
            this.offSide = false;
            if(this.lastHit == "user") {
                this.tablePosX = 0;
                this.tablePosY = .9;
                this.height = 25;
                this.heightInc = 0;
                this.aTrailPoints = new Array();
                this.tableVX = 0;
                this.tableVY = 0;
                player_serve = true;
            } else {
                this.tablePosX = 0;
                this.tablePosY = .2;
                this.height = 15;
                this.heightInc = 0;
                this.aTrailPoints = new Array();
            }
            this.servePosInc = 0;
            this.servePrepTween = TweenLite.to(this, .5, {
                servePosInc: 1,
                ease: "Quad.easeOut",
                onComplete: function () {
                    _this.canHit = true;
                }
            });
        };
        Ball.prototype.enemyServe = function () {
            this.setBouncePoint(enemyBat._getHitData(this.tablePosX, this.tablePosY));
        };
        Ball.prototype.setBouncePoint = function (_oTargBouncePoints) {
            this.spin = _oTargBouncePoints.spin;
            this.spinInc = 0;
            if(this.lastHit == "enemy") {
                this.targBounceX = _oTargBouncePoints.x;
                this.targBounceY = _oTargBouncePoints.y;
                this.speed = _oTargBouncePoints.speed;
                tableTop.tweenToPos(this.targBounceX, this.targBounceY, this.speed, this.lastHit, this.spin);
                if(this.servingState == 0) {
                    this.servingState = 1;
                    this.heightInc = -(-2400 + this.height * 6) * (.8 - this.speed) * 1.2;
                    this.speed = (this.speed - .3) / 4 + .3;
                } else {
                    this.heightInc = (-2400 + this.height * 6) * (.8 - this.speed);
                }
            } else {
                this.targBounceX = _oTargBouncePoints.x;
                this.targBounceY = _oTargBouncePoints.y;
                this.speed = _oTargBouncePoints.speed;
                if(this.servingState == 0) {
                    this.servingState = 1;
                    player_serve = false;
                    this.heightInc = -(-2400 + this.height * 6) * (.8 - this.speed) * 1.2;
                    this.speed = (this.speed - .3) / 6 + .3;
                } else {
                    this.heightInc = (-2400 + this.height * 6) * (.8 - this.speed);
                }
                tableTop.tweenToPos(0, 1, this.speed, this.lastHit, this.spin);
                enemyBat.setBouncePos(this.targBounceX, this.targBounceY, this.spin);
            }
            this.tableVX = (this.targBounceX - this.tablePosX) / ((1 - this.speed) * 1.1);
            this.tableVY = (this.targBounceY - this.tablePosY) / ((1 - this.speed) * 1.1);
        };
        Ball.prototype.update = function () {
            if(window.famobi.paused) return;
            
            if(this.servingState == 0) {
                if(this.lastHit == "user") {
                    this.y = (canvas.height / 4) + tableTop.offsetY * 50 + ((this.tablePosY * this.tablePosY) * 235) * (1 + tableTop.offsetY / 2) + (1 - this.servePosInc) * 100;
                    this.tablePosX = Math.min(Math.max((userBat.x - canvas.width / 2) / 300, -.95), .95);
                    this.x = canvas.width / 2 + (((this.y - (canvas.height / 4)) * (tableTop.offsetX + this.tablePosX * .6)) * 1.28 * (1 + tableTop.offsetY / 2) + (this.tablePosX * 233) / 2 + tableTop.offsetX * tableTop.sideMultiplier) + (1 - this.servePosInc) * -500;
                    this.scale = .27 + (this.y - (canvas.height / 4)) / 600;
                    if(this.canHit && userBat.getHitData(this.tablePosX, this.tablePosY).y < .4) {
                        if(userBat.x > this.x - 80 * userBat.scale && userBat.x < this.x + 80 * userBat.scale && userBat.y > this.y - this.height * (this.scale * 3) - 16 - 80 * userBat.scale && userBat.y < this.y - this.height * (this.scale * 3) - 16 + 80 * userBat.scale) {
                            this.bounceNum = 0;
                            this.lastHit = "user";
                            this.setBouncePoint(userBat.getHitData(this.tablePosX, this.tablePosY));
                        }
                    }
                } else {
                    this.y = (canvas.height / 4) + tableTop.offsetY * 50 + ((this.tablePosY * this.tablePosY) * 235) * (1 + tableTop.offsetY / 2) + (1 - this.servePosInc) * 100;
                    this.tablePosX = 0;
                    this.x = canvas.width / 2 + (((this.y - (canvas.height / 4)) * (tableTop.offsetX + this.tablePosX * .6)) * 1.28 * (1 + tableTop.offsetY / 2) + (this.tablePosX * 233) / 2 + tableTop.offsetX * tableTop.sideMultiplier) + (1 - this.servePosInc) * -500;
                    this.scale = .27 + (this.y - (canvas.height / 4)) / 600;
                }
            } else {
                if(!this.offTable) {
                    if(this.lastHit == "user") {
                        this.spinInc = Math.min(Math.max(this.spinInc + (Math.pow(this.spin * 2.5, 3) * delta) * (1 - this.tablePosY), -3), 3);
                    } else {
                        this.spinInc = Math.min(Math.max(this.spinInc + (Math.pow(this.spin * 2, 3) * delta) * this.tablePosY, -2), 2);
                    }
                    this.tablePosX += (this.tableVX + this.spinInc) * delta;
                    this.tablePosY += this.tableVY * delta;
                }
                if(!this.offTable && this.lastHit == "user" && this.tablePosY < 0) {
                    this.offTable = true;
                    this.offTableVX = (this.x - this.aTrailPoints[0].x) * 10;
                    this.offTableVY = (this.y - this.aTrailPoints[0].y) * 10;
                    if(this.offTableTween) {
                        this.offTableTween.kill();
                    }
                    this.offTableTween = TweenLite.to(this, 2, {
                        offTableVX: 0,
                        offTableVY: 0,
                        ease: "Quad.easeOut"
                    });
                    enemyBat.flail();
                }
                this.heightInc += 3800 * delta;
                this.height -= (this.heightInc * this.speed) * delta;
                if(this.ballShortState == 1 && this.tablePosY <= .5) {
                    playSound("hitNet");
                    this.tableVY *= -.5;
                    this.tableVX *= .5;
                    this.ballShortState = 2;
                    this.heightInc *= .2;
                }
                if(this.tablePosX > -1 && this.tablePosX < 1 && this.tablePosY > 0 && this.tablePosY < 1 && this.height <= 0 && !this.offSide) {
                    this.height = 0;
                    this.heightInc *= -.85;
                    if(this.ballShortState == 0) {
                        var n = Math.floor(Math.random() * 6);
                        playSound("bounce" + n);
                    } else {
                        this.height = -3;
                    }
                    this.bounceNum++;
                    this.bounceX = this.tablePosX;
                    this.bounceY = this.tablePosY;
                    tableTop.bounce();
                    if(this.lastHit == "user" && this.tablePosY > .5 && this.servingState > 1) {
                        this.spin = 0;
                        this.ballShortState = 1;
                    }
                } else if((this.tablePosX < -1 || this.tablePosX > 1) && !this.offTable && this.tablePosY < 1 && this.height <= 0) {
                    this.offSide = true;
                }
                if((this.offTable || this.offSide) && this.height <= -200) {
                    if(this.lastHit == "user") {
                        if(this.bounceNum == 0) {
                            updateScore("enemy");
                        } else {
                            updateScore("user");
                        }
                    } else {
                        if(this.bounceNum == 0) {
                            updateScore("user");
                        } else {
                            updateScore("enemy");
                        }
                    }
                    if((oGameData.userScore + oGameData.enemyScore) % 2 == 0 || (oGameData.userScore >= 10 && oGameData.enemyScore >= 10)) {
                        this.serveFlip = !this.serveFlip;
                    }
                    if(!this.serveFlip) {
                        this.resetServe("enemy");
                    } else {
                        this.resetServe("user");
                    }
                    return;
                }
                var tableImgHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.table0].height;
                if(!this.offTable) {
                    this.y = (canvas.height / 4) + tableTop.offsetY * 50 + ((this.tablePosY * this.tablePosY) * 235) * (1 + tableTop.offsetY / 2);
                    this.x = canvas.width / 2 + ((this.y - (canvas.height / 4)) * (tableTop.offsetX + this.tablePosX * .6)) * 1.28 * (1 + tableTop.offsetY / 2) + (this.tablePosX * 233) / 2 + tableTop.offsetX * tableTop.sideMultiplier;
                } else {
                    this.x += this.offTableVX * delta;
                    this.y += this.offTableVY * delta;
                }
                this.scale = .27 + (this.y - (canvas.height / 4)) / 600;
                this.aTrailPoints.push({
                    x: this.x,
                    y: this.y,
                    height: this.height,
                    scale: this.scale
                });
                if(this.aTrailPoints.length > 5) {
                    this.aTrailPoints.shift();
                }
                if(this.y > canvas.height) {
                    if(this.bounceNum > 0 || this.ballShortState > 0) {
                        updateScore("enemy");
                    } else {
                        updateScore("user");
                    }
                    if((oGameData.userScore + oGameData.enemyScore) % 2 == 0 || (oGameData.userScore >= 10 && oGameData.enemyScore >= 10)) {
                        this.serveFlip = !this.serveFlip;
                    }
                    if(!this.serveFlip) {
                        this.resetServe("enemy");
                    } else {
                        this.resetServe("user");
                    }
                    return;
                }
                if(this.lastHit == "enemy" && ((this.servingState == 2 && this.bounceNum == 1) || (this.servingState == 1 && this.bounceNum == 2)) && !(this.height < 0 && this.bounceNum == 0) && this.tablePosY > .5 && userBat.x > this.x - 82 * userBat.scale && userBat.x < this.x + 82 * userBat.scale && userBat.y > this.y - this.height * (this.scale * 3) - 16 - 82 * userBat.scale && userBat.y < this.y - this.height * (this.scale * 3) - 16 + 82 * userBat.scale) {
                    playSound("hit" + Math.floor(Math.random() * 6));
                    rallyHits++;
                    this.servingState = 2;
                    this.bounceNum = 0;
                    this.lastHit = "user";
                    this.setBouncePoint(userBat.getHitData(this.tablePosX, this.tablePosY));
                    if(userBat.getHitData(this.tablePosX, this.tablePosY).spin != 0){
                        window.famobi_analytics.trackStats("ball_hit",{hit_type: "curvedBall"})
                        player_hitType = "curvedBall";
                    }
                    else if(userBat.getHitData(this.tablePosX, this.tablePosY).speed >=0.5){
                        window.famobi_analytics.trackStats("ball_hit",{hit_type: "powerBall"});
                        player_hitType = "powerBall";
                    }
                    else{
                        window.famobi_analytics.trackStats("ball_hit");
                        player_hitType = "";
                    }
                }
                if(this.lastHit == "user" && ((this.servingState == 2 && this.bounceNum == 1) || (this.servingState == 1 && this.bounceNum == 2)) && this.tablePosY < .5 && this.tablePosY > 0 && enemyBat.x > this.x - 70 * enemyBat.scale && enemyBat.x < this.x + 70 * enemyBat.scale && enemyBat.y > this.y - this.height * (this.scale * 3) - 16 - 70 * enemyBat.scale && enemyBat.y < this.y - this.height * (this.scale * 3) - 16 + 70 * enemyBat.scale) {
                    playSound("hit" + Math.floor(Math.random() * 6));
                    rallyHits++;
                    this.servingState = 2;
                    this.bounceNum = 0;
                    this.lastHit = "enemy";
                    this.setBouncePoint(enemyBat.getHitData(this.tablePosX, this.tablePosY));
                    if(enemyBat.getHitData(this.tablePosX, this.tablePosY).spin != 0){
                        enemy_hitType = "curvedBall";
                    }
                    else if(enemyBat.getHitData(this.tablePosX, this.tablePosY).speed >=0.5){
                        enemy_hitType = "powerBall";
                    }
                    else{
                        enemy_hitType = "";
                    }
                }
            }
        };
        Ball.prototype.render = function () {
            if(this.tablePosX > -1 && this.tablePosX < 1 && this.tablePosY > 0 && this.tablePosY < 1) {
                var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ballShadow].x;
                var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ballShadow].y;
                var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ballShadow].width;
                var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ballShadow].height;
                ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.x - (bWidth / 2) * this.scale, this.y - (bHeight / 2) * this.scale, bWidth * this.scale, bHeight * this.scale);
            } else {
            }
            if(this.lastHit == "enemy" && this.ballShortState == 0) {
                this.renderTrail();
            }
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ball].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ball].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ball].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ball].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.x - (bWidth / 2) * this.scale, this.y - (bHeight / 2) * this.scale - this.height * (this.scale * 3) - 16, bWidth * this.scale, bHeight * this.scale);
            if(this.lastHit == "user" && this.ballShortState == 0) {
                this.renderTrail();
            }
        };
        Ball.prototype.renderTrail = function () {
            var tempTrailNum = Math.floor((this.aTrailPoints.length / .3) * (Math.max(Math.min(this.speed, .6), .3) - .3));
            for(var i = 0; i < tempTrailNum; i++) {
                var temp = ((this.aTrailPoints.length - tempTrailNum) + i);
                if(temp < 0 || temp > this.aTrailPoints.length - 1) {
                    console.log(temp, tempTrailNum, this.speed);
                }
                var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["ballTrail" + temp]].x;
                var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["ballTrail" + temp]].y;
                var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["ballTrail" + temp]].width;
                var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["ballTrail" + temp]].height;
                ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.aTrailPoints[temp].x - (bWidth / 2) * this.aTrailPoints[temp].scale, this.aTrailPoints[temp].y - (bHeight / 2) * this.aTrailPoints[temp].scale - this.aTrailPoints[temp].height * (this.aTrailPoints[temp].scale * 3) - 16, bWidth * this.aTrailPoints[temp].scale, bHeight * this.aTrailPoints[temp].scale);
            }
        };
        return Ball;
    })();
    Elements.Ball = Ball;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var TableTop = (function () {
        function TableTop() {
            this.segs = 75;
            this.offsetX = 0;
            this.offsetY = 0;
            this.netY = 0;
            this.netHeight = 0;
            this.id = 0;
            this.sideMultiplier = 100;
            this.bounceMarkScale = 0;
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.oShadowImgData = assetLib.getData("shadow");
            this.id = (oGameData.cupId * 6 + oGameData.gameId) % 4;
            if(!isMobile) {
                this.segs = 150;
            }
        }
        TableTop.prototype.bounce = function () {
            this.bounceMarkScale = 1;
            TweenLite.to(this, .3, {
                bounceMarkScale: 0,
                ease: "Quad.easeIn"
            });
        };
        TableTop.prototype.tweenToPos = function (_x, _y, _speed, _hitBy, _spin) {
            if(this.offsetTween) {
                this.offsetTween.kill();
            }
            var tempX = 0;
            var tempY = 0;
            if(_x > .3 || _x < -.3) {
                tempX = -_x / 1.75 - _spin / 2;
            }
            var tempTime = .5;
            if(_hitBy == "enemy") {
                tempTime = .5;
                tempY = (1 - (_y - .5) * 2) * (.3 - (_speed - .3)) / .3;
            }
            this.offsetTween = TweenLite.to(this, tempTime, {
                offsetX: tempX,
                offsetY: tempY,
                ease: "Quad.easeOut"
            });
        };
        TableTop.prototype.render = function () {
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.net].height;
            this.netY = canvas.height / 4 - bHeight + ((this.oGameElementsImgData.oData.oAtlasData[oImageIds.table0].height / this.segs) * (.282 * this.segs)) * (1 + this.offsetY / 3) + this.offsetY * 50;
            this.netHeight = bHeight * (1 + this.offsetY / 3);
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableClip].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableClip].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableClip].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableClip].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * (1 + this.offsetY / 3) + ((this.offsetX * (.282 * this.segs)) * 3) * (1 + this.offsetY / 3) + this.offsetX * this.sideMultiplier, this.netY + this.netHeight - 3 * (1 + this.offsetY / 3), bWidth * (1 + this.offsetY / 3), bHeight * (1 + this.offsetY / 3));
            ctx.drawImage(this.oShadowImgData.img, 0, 0, this.oShadowImgData.img.width, this.oShadowImgData.img.height, canvas.width / 2 - (this.oShadowImgData.img.width / 2) * (1 + this.offsetY / 3) + ((this.offsetX * 100) * 2.3) * (1 + this.offsetY / 3) + this.offsetX * this.sideMultiplier, canvas.height / 4 + (this.oGameElementsImgData.oData.oAtlasData[oImageIds.table0].height) * (1 + this.offsetY / 3.5) + this.offsetY * 50 - 80, this.oShadowImgData.img.width * (1 + this.offsetY / 3), this.oShadowImgData.img.height * (1 + this.offsetY / 3));
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableLegs].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableLegs].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableLegs].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableLegs].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * (1 + this.offsetY / 3) + ((this.offsetX * 100) * 2.3) * (1 + this.offsetY / 3) + this.offsetX * this.sideMultiplier, canvas.height / 4 + (this.oGameElementsImgData.oData.oAtlasData[oImageIds.table0].height) * (1 + this.offsetY / 3.5) + this.offsetY * 50 + 25, bWidth * (1 + this.offsetY / 3), bHeight * (1 + this.offsetY / 3));
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["table" + this.id]].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["table" + this.id]].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["table" + this.id]].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["table" + this.id]].height;
            for(var i = 0; i < this.segs; i++) {
                ctx.drawImage(this.oGameElementsImgData.img, bX, bY + (bHeight / this.segs) * i, bWidth, (bHeight / this.segs), canvas.width / 2 - (bWidth / 2) * (1 + this.offsetY / 3) + ((this.offsetX * (i * (100 / this.segs))) * 3) * (1 + this.offsetY / 3) + this.offsetX * this.sideMultiplier, canvas.height / 4 + ((bHeight / this.segs) * i) * (1 + this.offsetY / 2) + this.offsetY * 50, bWidth * (1 + this.offsetY / 3), (bHeight / this.segs) * (1 + this.offsetY / 2));
            }
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableEdge].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableEdge].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableEdge].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableEdge].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * (1 + this.offsetY / 3) + ((this.offsetX * 100) * 3) * (1 + this.offsetY / 3) + this.offsetX * this.sideMultiplier, canvas.height / 4 + (this.oGameElementsImgData.oData.oAtlasData[oImageIds.table0].height) * (1 + this.offsetY / 2) + this.offsetY * 50, bWidth * (1 + this.offsetY / 3), bHeight * (1 + this.offsetY / 3));
            if(this.bounceMarkScale > 0) {
                var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.bounceMark].x;
                var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.bounceMark].y;
                var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.bounceMark].width;
                var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.bounceMark].height;
                var tempY = (canvas.height / 4) + this.offsetY * 50 + ((ball.bounceY * ball.bounceY) * 235) * (1 + this.offsetY / 2);
                var tempX = canvas.width / 2 + ((tempY - (canvas.height / 4)) * (this.offsetX + ball.bounceX * .6)) * 1.28 * (1 + this.offsetY / 2) + (ball.bounceX * 233) / 2 + this.offsetX * this.sideMultiplier;
                var tempScale = .27 + (tempY - (canvas.height / 4)) / 600;
                ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, tempX - (bWidth / 2) * (tempScale * this.bounceMarkScale), tempY - (bHeight / 2) * (tempScale * this.bounceMarkScale), bWidth * (tempScale * this.bounceMarkScale), bHeight * (tempScale * this.bounceMarkScale));
            }
        };
        TableTop.prototype.renderNet = function () {
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.net].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.net].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.net].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.net].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * (1 + this.offsetY / 3) + ((this.offsetX * (.282 * this.segs)) * 3) * (1 + this.offsetY / 3) + this.offsetX * this.sideMultiplier, this.netY, bWidth * (1 + this.offsetY / 3), this.netHeight);
        };
        return TableTop;
    })();
    Elements.TableTop = TableTop;
})(Elements || (Elements = {}));
var Utils;
(function (Utils) {
    var TextDisplay = (function () {
        function TextDisplay() {
            this.oTextData = {
            };
            this.inc = 0;
            this.createTextObjects();
        }
        TextDisplay.prototype.createTextObjects = function () {
            var cnt = 0;
            for(var i in assetLib.textData.langText.text[curLang]) {
                this.oTextData[i] = {
                };
                this.oTextData[i].aLineData = this.getCharData(assetLib.textData.langText.text[curLang][i]["@text"], assetLib.textData.langText.text[curLang][i]["@fontId"]);
                this.oTextData[i].aLineWidths = this.getLineWidths(this.oTextData[i].aLineData);
                this.oTextData[i].blockWidth = this.getBlockWidth(this.oTextData[i].aLineData);
                this.oTextData[i].blockHeight = this.getBlockHeight(this.oTextData[i].aLineData, assetLib.textData.langText.text[curLang][i]["@fontId"]);
                this.oTextData[i].lineHeight = parseInt(assetLib.textData["fontData" + assetLib.textData.langText.text[curLang][i]["@fontId"]].text.common["@lineHeight"]);
                this.oTextData[i].oFontImgData = assetLib.getData("font" + assetLib.textData.langText.text[curLang][i]["@fontId"]);
            }
        };
        TextDisplay.prototype.getLineWidths = function (_aCharData) {
            var lineLength;
            var aLineWidths = new Array();
            for(var i = 0; i < _aCharData.length; i++) {
                lineLength = 0;
                for(var j = 0; j < _aCharData[i].length; j++) {
                    lineLength += parseInt(_aCharData[i][j]["@xadvance"]);
                    if(j == 0) {
                        lineLength -= parseInt(_aCharData[i][j]["@xoffset"]);
                    } else if(j == _aCharData[i].length - 1) {
                        lineLength += parseInt(_aCharData[i][j]["@xoffset"]);
                    }
                }
                aLineWidths.push(lineLength);
            }
            return aLineWidths;
        };
        TextDisplay.prototype.getBlockWidth = function (_aCharData) {
            var lineLength;
            var longestLineLength = 0;
            for(var i = 0; i < _aCharData.length; i++) {
                lineLength = 0;
                for(var j = 0; j < _aCharData[i].length; j++) {
                    lineLength += parseInt(_aCharData[i][j]["@xadvance"]);
                    if(j == 0) {
                        lineLength -= parseInt(_aCharData[i][j]["@xoffset"]);
                    } else if(j == _aCharData[i].length - 1) {
                        lineLength += parseInt(_aCharData[i][j]["@xoffset"]);
                    }
                }
                if(lineLength > longestLineLength) {
                    longestLineLength = lineLength;
                }
            }
            return longestLineLength;
        };
        TextDisplay.prototype.getBlockHeight = function (_aCharData, _fontId) {
            return _aCharData.length * parseInt(assetLib.textData["fontData" + _fontId].text.common["@lineHeight"]);
        };
        TextDisplay.prototype.getCharData = function (_aLines, _fontId) {
            var aCharData = new Array();
            for(var k = 0; k < _aLines.length; k++) {
                aCharData[k] = new Array();
                for(var i = 0; i < _aLines[k].length; i++) {
                    for(var j = 0; j < assetLib.textData["fontData" + _fontId].text.chars.char.length; j++) {
                        if(_aLines[k][i].charCodeAt() == assetLib.textData["fontData" + _fontId].text.chars.char[j]["@id"]) {
                            aCharData[k].push(assetLib.textData["fontData" + _fontId].text.chars.char[j]);
                        }
                    }
                }
            }
            return aCharData;
        };
        TextDisplay.prototype.renderText = function (_oTextDisplayData) {
            var aLinesToRender = this.oTextData[_oTextDisplayData.text].aLineData;
            var oFontImgData = this.oTextData[_oTextDisplayData.text].oFontImgData;
            var shiftX;
            var offsetX = 0;
            var offsetY = 0;
            var lineOffsetY = 0;
            var manualScale = 1;
            var animY = 0;
            if(_oTextDisplayData.lineOffsetY) {
                lineOffsetY = _oTextDisplayData.lineOffsetY;
            }
            if(_oTextDisplayData.scale) {
                manualScale = _oTextDisplayData.scale;
            }
            var textScale = 1 * manualScale;
            if(_oTextDisplayData.maxWidth && this.oTextData[_oTextDisplayData.text].blockWidth * manualScale > _oTextDisplayData.maxWidth) {
                textScale = _oTextDisplayData.maxWidth / this.oTextData[_oTextDisplayData.text].blockWidth;
            }
            if(_oTextDisplayData.anim) {
                this.inc += delta * 7;
            }
            for(var i = 0; i < aLinesToRender.length; i++) {
                shiftX = 0;
                if(_oTextDisplayData.alignX == "centre") {
                    offsetX = this.oTextData[_oTextDisplayData.text].aLineWidths[i] / 2;
                }
                if(_oTextDisplayData.alignY == "centre") {
                    offsetY = this.oTextData[_oTextDisplayData.text].blockHeight / 2 + (lineOffsetY * (aLinesToRender.length - 1)) / 2;
                }
                for(var j = 0; j < aLinesToRender[i].length; j++) {
                    var bX = aLinesToRender[i][j]["@x"];
                    var bY = aLinesToRender[i][j]["@y"];
                    var bWidth = aLinesToRender[i][j]["@width"];
                    var bHeight = aLinesToRender[i][j]["@height"];
                    if(_oTextDisplayData.anim) {
                        animY = Math.sin(this.inc + j / 2) * ((bHeight / 15) * textScale);
                    }
                    ctx.drawImage(oFontImgData.img, bX, bY, bWidth, bHeight, _oTextDisplayData.x + (shiftX + parseInt(aLinesToRender[i][j]["@xoffset"]) - offsetX) * textScale, _oTextDisplayData.y + (parseInt(aLinesToRender[i][j]["@yoffset"]) + (i * this.oTextData[_oTextDisplayData.text].lineHeight) + (i * lineOffsetY) - offsetY) * textScale + animY, bWidth * textScale, bHeight * textScale);
                    shiftX += parseInt(aLinesToRender[i][j]["@xadvance"]);
                }
            }
        };
        return TextDisplay;
    })();
    Utils.TextDisplay = TextDisplay;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var CountryFlags = (function () {
        function CountryFlags(_aSelectedCountries, _randomise) {
            if (typeof _randomise === "undefined") { _randomise = false; }
            this.aAllCountryCodes = {
                0: "ES",
                1: "AU",
                2: "AT",
                3: "AG",
                4: "AR",
                5: "AM",
                6: "BO",
                7: "BQ",
                8: "BA",
                9: "TL",
                10: "VN",
                11: "GA",
                12: "PT",
                13: "AZ",
                14: "MX",
                15: "AW",
                16: "BS",
                17: "BD",
                18: "BW",
                19: "BR",
                20: "BN",
                21: "HW",
                22: "GY",
                23: "GM",
                24: "AX",
                25: "AL",
                26: "DZ",
                27: "BB",
                28: "BH",
                29: "BY",
                30: "BF",
                31: "BI",
                32: "VU",
                33: "GH",
                34: "GP",
                35: "GN",
                36: "AI",
                37: "AO",
                38: "AD",
                39: "BE",
                40: "BJ",
                41: "BG",
                42: "GB",
                43: "HU",
                44: "VE",
                45: "GN",
                46: "GW",
                47: "DE",
                48: "ZW",
                49: "IL",
                50: "IN",
                51: "KZ",
                52: "CM",
                53: "CA",
                54: "CO",
                55: "KM",
                56: "CD",
                57: "CW",
                58: "LA",
                59: "LV",
                60: "ID",
                61: "JO",
                62: "IQ",
                63: "QA",
                64: "KE",
                65: "CY",
                66: "CG",
                67: "KP",
                68: "KR",
                69: "LS",
                70: "LR",
                71: "LB",
                72: "IR",
                73: "IE",
                74: "IS",
                75: "EG",
                76: "KG",
                77: "KI",
                78: "TW",
                79: "CR",
                80: "CI",
                81: "LY",
                82: "LT",
                83: "LI",
                84: "IT",
                85: "YE",
                86: "",
                87: "CN",
                88: "",
                89: "CC",
                90: "CU",
                91: "KW",
                92: "CK",
                93: "LU",
                94: "MU",
                95: "MR",
                96: "MH",
                97: "FM",
                98: "MZ",
                99: "IM",
                100: "",
                101: "NA",
                102: "NR",
                103: "NE",
                104: "NG",
                105: "NL",
                106: "NU",
                107: "NZ",
                108: "",
                109: "PR",
                110: "CX",
                111: "SC",
                112: "SN",
                113: "MF",
                114: "SB",
                115: "SO",
                116: "SD",
                117: "TV",
                118: "TN",
                119: "TR",
                120: "RU",
                121: "RW",
                122: "RO",
                123: "VC",
                124: "KN",
                125: "LC",
                126: "SR",
                127: "SL",
                128: "TJ",
                129: "UZ",
                130: "UA",
                131: "UY",
                132: "",
                133: "WS",
                134: "ST",
                135: "MN",
                136: "",
                137: "SY",
                138: "TH",
                139: "TZ",
                140: "TG",
                141: "FO",
                142: "PH",
                143: "FI",
                144: "SA",
                145: "",
                146: "SZ",
                147: "SK",
                148: "SI",
                149: "US",
                150: "TK",
                151: "TO",
                152: "TT",
                153: "FR",
                154: "CF",
                155: "TD",
                156: "GG",
                157: "GI",
                158: "HN",
                159: "CZ",
                160: "CL",
                161: "CH",
                162: "MG",
                163: "MO",
                164: "MK",
                165: "MM",
                166: "MC",
                167: "",
                168: "HK",
                169: "GD",
                170: "GL",
                171: "SE",
                172: "ER",
                173: "EE",
                174: "MW",
                175: "MY",
                176: "ML",
                177: "NC",
                178: "NO",
                179: "NF",
                180: "GR",
                181: "GE",
                182: "DK",
                183: "ET",
                184: "",
                185: "ZA",
                186: "MV",
                187: "MT",
                188: "MA",
                189: "AE",
                190: "PK",
                191: "PW",
                192: "",
                193: "DM",
                194: "ZM",
                195: "SS",
                196: "JM",
                197: "JP",
                198: "PE",
                199: "PF",
                200: "PL",
                201: "PS",
                202: "GU",
                203: "PG"
            };
            this.aIds = new Array();
            for(var i = 0; i < _aSelectedCountries.length; i++) {
                this.aIds.push(this.getIdFromISO(_aSelectedCountries[i]));
            }
            if(_randomise) {
                this.aIds = this.randomise(this.aIds);
            }
        }
        CountryFlags.prototype.getIdFromISO = function (_ISO) {
            var n = 0;
            for(var i in this.aAllCountryCodes) {
                if(this.aAllCountryCodes[i] == _ISO) {
                    n;
                    break;
                }
                n++;
            }
            return n;
        };
        CountryFlags.prototype.getBData = function (_id) {
            var oBData = {
                bX: (_id % 12) * 124 + 30.5,
                bY: Math.floor(_id / 12) * 85.5 + 14,
                bWidth: 85.5,
                bHeight: 59
            };
            return oBData;
        };
        CountryFlags.prototype.randomise = function (_aTemp) {
            for(var i = _aTemp.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = _aTemp[i];
                _aTemp[i] = _aTemp[j];
                _aTemp[j] = temp;
            }
            return _aTemp;
        };
        return CountryFlags;
    })();
    Utils.CountryFlags = CountryFlags;
})(Utils || (Utils = {}));
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Elements;
(function (Elements) {
    var Firework = (function (_super) {
        __extends(Firework, _super);
        function Firework() {
                _super.call(this, assetLib.getData("firework"), 30, 30, "explode");
            this.vy = 0;
            this.setAnimType("once", "explode");
            this.animEndedFunc = function () {
                this.removeMe = true;
            };
            TweenLite.to(this, 1, {
                scaleX: 2,
                scaleY: 2,
                ease: "Quad.easeOut"
            });
        }
        Firework.prototype.update = function (_trackX, _trackY) {
            this.vy += 150 * delta;
            this.y += this.vy * delta;
            _super.prototype.updateAnimation.call(this, delta);
        };
        Firework.prototype.render = function () {
            _super.prototype.renderSimple.call(this, ctx);
        };
        return Firework;
    })(Utils.AnimSprite);
    Elements.Firework = Firework;
})(Elements || (Elements = {}));
var Utils;
(function (Utils) {
    var SaveDataHandler = (function () {
        function SaveDataHandler(_saveDataId) {
            this.dataGroupNum = 2;
            this.saveDataId = _saveDataId;
            (window).famobi = (window).famobi ? (window).famobi : {
            };
            (window).famobi.localStorage = (window).famobi.localStorage ? (window).famobi.localStorage : (window).localStorage;
            (window).famobi.sessionStorage = (window).famobi.sessionStorage ? (window).famobi.sessionStorage : (window).sessionStorage;
            this.clearData();
            this.setInitialData();
        }
        SaveDataHandler.prototype.clearData = function () {
            this.aLevelStore = new Array();
            this.aLevelStore.push(1);
            for(var i = 0; i < 9; i++) {
                this.aLevelStore.push(0);
            }
            this.aLevelStore.push(1234);
            this.aLevelStore.push(0);
        };
        SaveDataHandler.prototype.resetData = function () {
            this.clearData();
            this.saveData();
        };
        SaveDataHandler.prototype.setInitialData = function () {
            if((window).famobi.localStorage.getItem(this.saveDataId) != null && (window).famobi.localStorage.getItem(this.saveDataId) != "") {
                this.aLevelStore = (window).famobi.localStorage.getItem(this.saveDataId).split(",");
                for(var a in this.aLevelStore) {
                    this.aLevelStore[a] = parseInt(this.aLevelStore[a]);
                }
            } else {
                this.saveData();
            }
        };
        SaveDataHandler.prototype.getUserId = function () {
            return this.aLevelStore[this.aLevelStore.length - 2];
        };
        SaveDataHandler.prototype.getControlState = function () {
            return this.aLevelStore[this.aLevelStore.length - 1];
        };
        SaveDataHandler.prototype.setUserId = function (_id) {
            this.aLevelStore[this.aLevelStore.length - 2] = _id;
        };
        SaveDataHandler.prototype.setControlState = function (_id) {
            return this.aLevelStore[this.aLevelStore.length - 1] = _id;
        };
        SaveDataHandler.prototype.getCurCupId = function () {
            var n = 0;
            for(var i = 0; i < 10; i++) {
                if(this.aLevelStore[i] == 7) {
                    n++;
                }
            }
            return n;
        };
        SaveDataHandler.prototype.getCurGameId = function () {
            var n = 0;
            for(var i = 0; i < 10; i++) {
                if(this.aLevelStore[i] != 0) {
                    n = this.aLevelStore[i] - 1;
                }
            }
            return n;
        };
        SaveDataHandler.prototype.setGameData = function (_oGameData) {
            for(var i = 0; i < 10; i++) {
                if(i < _oGameData.cupId) {
                    this.aLevelStore[i] = 7;
                } else if(i == _oGameData.cupId) {
                    this.aLevelStore[i] = _oGameData.gameId + 1;
                } else {
                    this.aLevelStore[i] = 0;
                }
            }
        };
        SaveDataHandler.prototype.saveData = function () {
            var str = "";
            for(var i = 0; i < this.aLevelStore.length; i++) {
                str += this.aLevelStore[i];
                if(i < this.aLevelStore.length - 1) {
                    str += ",";
                }
            }
            (window).famobi.localStorage.setItem(this.saveDataId, str);
        };
        return SaveDataHandler;
    })();
    Utils.SaveDataHandler = SaveDataHandler;
})(Utils || (Utils = {}));
var requestAnimFrame = (function () {
    return window.requestAnimationFrame || (window).webkitRequestAnimationFrame || (window).mozRequestAnimationFrame || (window).oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60, new Date().getTime());
    };
})();
var previousTime;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var minSquareSize = 500;
var maxSquareSize = 700;
var canvasX;
var canvasY;
var canvasScale;
var div = document.getElementById('canvas-wrapper');
var sound;
var music;
var audioType = 0;
var muted = false;
var splashTimer = 0;
var assetLib;
var preAssetLib;
var isMobile = false;
var gameState = "loading";
var aLangs = new Array("EN");
var curLang = "";
var isBugBrowser = false;
var isIE10 = false;
var delta;
var radian = Math.PI / 180;
var ios9FirstTouch = false;
var saveDataHandler = new Utils.SaveDataHandler("tabletennisv3");
var hasFocus = true;
if(navigator.userAgent.match(/MSIE\s([\d]+)/)) {
    isIE10 = true;
}
var deviceAgent = navigator.userAgent.toLowerCase();
if(deviceAgent.match(/(iphone|ipod|ipad)/) || deviceAgent.match(/(android)/) || deviceAgent.match(/(iemobile)/) || deviceAgent.match(/iphone/i) || deviceAgent.match(/ipad/i) || deviceAgent.match(/ipod/i) || deviceAgent.match(/blackberry/i) || deviceAgent.match(/bada/i)) {
    isMobile = true;
    if(deviceAgent.match(/(android)/) && !/Chrome/.test(navigator.userAgent)) {
        isBugBrowser = true;
    }
}
var userInput = new Utils.UserInput(canvas, isBugBrowser);
resizeCanvas();
window.onresize = function () {
    setTimeout(function () {
        resizeCanvas();
    }, 1);
};
function visibleResume() {
    if(famobiPauseActive) {
        return;
    }
    if(!hasFocus) {
        if(userInput) {
            userInput.checkKeyFocus();
        }
        if(!muted && gameState != "pause" && gameState != "splash" && gameState != "loading") {
            Howler.mute(false);
            playMusic();
        }
    }
    hasFocus = true;
}
function visiblePause() {
    if(famobiPauseActive) {
        return;
    }
    hasFocus = false;
    Howler.mute(true);
    music.pause();
}
(window).onpageshow = function () {
    if(famobiPauseActive) {
        return;
    }
    if(!hasFocus) {
        if(userInput) {
            userInput.checkKeyFocus();
        }
        if(!muted && gameState != "pause" && gameState != "splash" && gameState != "loading") {
            Howler.mute(false);
            playMusic();
        }
    }
    hasFocus = true;
};
(window).onpagehide = function () {
    if(famobiPauseActive) {
        return;
    }
    hasFocus = false;
    Howler.mute(true);
    music.pause();
};
function playMusic() {
    if(!music.playing()) {
        music.play();
    }
}
window.addEventListener("load", function () {
    setTimeout(function () {
        resizeCanvas();
    }, 0);
    window.addEventListener("orientationchange", function () {
        setTimeout(function () {
            resizeCanvas();
        }, 500);
        setTimeout(function () {
            resizeCanvas();
        }, 2000);
    }, false);
});
function isStock() {
    var matches = window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
    return matches && parseFloat(matches[1]) < 537;
}
var ua = navigator.userAgent;
var isSharpStock = ((/SHL24|SH-01F/i).test(ua)) && isStock();
var isXperiaAStock = ((/SO-04E/i).test(ua)) && isStock();
var isFujitsuStock = ((/F-01F/i).test(ua)) && isStock();
if(!isIE10 && !isSharpStock && !isXperiaAStock && !isFujitsuStock && (typeof (window).AudioContext !== 'undefined' || typeof (window).webkitAudioContext !== 'undefined' || navigator.userAgent.indexOf('Android') == -1)) {
    audioType = 1;
    sound = new Howl({
        src: [
            'audio/sound.ogg',
            'audio/sound.m4a'
        ],
        sprite: {
            bounce0: [
                0,
                400
            ],
            bounce1: [
                500,
                400
            ],
            bounce2: [
                1000,
                400
            ],
            bounce3: [
                1500,
                400
            ],
            bounce4: [
                2000,
                400
            ],
            bounce5: [
                2500,
                400
            ],
            hit0: [
                3000,
                400
            ],
            hit1: [
                3500,
                400
            ],
            hit2: [
                4000,
                400
            ],
            hit3: [
                4500,
                400
            ],
            hit4: [
                5000,
                400
            ],
            hit5: [
                5500,
                400
            ],
            hitNet: [
                6000,
                1300
            ],
            userPoint: [
                7500,
                700
            ],
            enemyPoint: [
                8500,
                700
            ],
            loseGame: [
                9500,
                1400
            ],
            gameStart: [
                11000,
                900
            ],
            cheer2: [
                12000,
                3500
            ],
            winGame: [
                16000,
                6600
            ],
            cheer4: [
                23000,
                5000
            ],
            cheer3: [
                28500,
                4500
            ],
            cheer0: [
                33500,
                3300
            ],
            cheer1: [
                37500,
                4500
            ],
            firework: [
                42500,
                1500
            ]
        }
    });
    music = new Howl({
        src: [
            'audio/music.ogg',
            'audio/music.m4a'
        ],
        volume: 0,
        loop: true
    });
} else {
    audioType = 0;
}
var panel;
var background;
var totalScore = 0;
var levelScore = 0;
var levelNum = 0;
var aLevelUps;
var levelBonusScore;
var bonusScore;
var aTutorials = new Array();
var panelFrame;
var oLogoData = {
};
var oLogoBut;
var oImageIds = {
};
var tableTop;
var userBat;
var enemyBat;
var ball;
var swipeState = 0;
var countryFlags = new Utils.CountryFlags([
    "CA",
    "CN",
    "BR",
    "KG",
    "DE",
    "FR",
    "HK",
    "KZ",
    "IE",
    "IT",
    "JP",
    "NL",
    "PL",
    "PT",
    "KR",
    "ES",
    "RU",
    "TR",
    "GB",
    "US",
    "CZ",
    "AR",
    "UA",
    "IN",
    "MX",
    "EG",
    "ID",
    "IQ",
    "IR",
    "CL",
    "DK",
    "CO",
    "TH",
    "TW",
    "AM",
    "UZ",
    "SK",
    "BY",
    "UY",
    "IL"
], false);
var aEnemyCountries = new Array([
    "IS",
    "GL",
    "HW",
    "CU",
    "CA",
    "US"
], [
    "VE",
    "CK",
    "WS",
    "CO",
    "GY",
    "CR"
], [
    "PE",
    "AR",
    "UY",
    "BO",
    "CL",
    "BR"
], [
    "DZ",
    "LY",
    "ET",
    "ZW",
    "KE",
    "ZA"
], [
    "FR",
    "NO",
    "PT",
    "IT",
    "DE",
    "GB"
], [
    "AT",
    "CZ",
    "PL",
    "TR",
    "HU",
    "GR"
], [
    "IR",
    "BD",
    "MG",
    "IN",
    "PK",
    "AE"
], [
    "PG",
    "NZ",
    "AU",
    "PH",
    "ID",
    "MY"
], [
    "LA",
    "VN",
    "HK",
    "JP",
    "KR",
    "CN"
], [
    "LV",
    "EE",
    "LT",
    "FI",
    "UZ",
    "RU"
]);
var spareEnemyCountry = "CH";
var oGameData = {
    cupId: 0,
    gameId: 0,
    userId: null,
    enemyId: null,
    userScore: 0,
    enemyScore: 0
};
var firstRun = true;
var aMapMarkerPos = new Array([
    -203,
    -115
], [
    -150,
    -31
], [
    -136,
    98
], [
    20,
    57
], [
    -36,
    -109
], [
    50,
    -72
], [
    101,
    -16
], [
    170,
    82
], [
    192,
    -51
], [
    143,
    -121
]);
var justWonCup = false;
var controlState = 0;
var startTouchY;
var aEffects;
var rallyHits = 0;
var famobiPauseActive = false;
var flagPage = 0;
function extGameLoad() {
    loadPreAssets();
}
function initSplash() {
    (window).famobi_onPauseRequested = function () {
        Howler.mute(true);
        music.pause();
        famobiPauseActive = true;
    };
    (window).famobi_onResumeRequested = function () {
        console.log(muted, gameState);
        if(!muted) {
            Howler.mute(false);
            music.play();
        }
        famobiPauseActive = false;
    };
    oGameData.cupId = saveDataHandler.getCurCupId();
    oGameData.gameId = saveDataHandler.getCurGameId();
    var tempUserId = saveDataHandler.getUserId();
    if(tempUserId == 1234) {
        firstRun = true;
    } else {
        firstRun = false;
        oGameData.userId = tempUserId;
    }
    controlState = saveDataHandler.getControlState();

    if(!!window.famobi.localStorage.getItem("muted")) {
        muted = false;
        toggleMute(true);
    }

    if(forcedMode) {
        console.log("[FORCEDMODE]: Init...");
        firstRun = false;
        let temp = famobi.getFeatureProperties("forced_mode");
        if(temp != null && temp.state != null) {
            forcedModeProperties = temp;
            forcedModeProperties.state = forcedModeProperties.state || {};
            forcedModeProperties.override = forcedModeProperties.override || {};
        }
        /* :: STATE :: */
        let player_country = forcedModeProperties.state.player_country;
        if(player_country != null && typeof(player_country) == "number") {
            oGameData.userId = Math.min(Math.max(player_country, 0), 203);
        } else {
            oGameData.userId = 0;
        }
        let enemy_country = forcedModeProperties.state.enemy_country;
        if(enemy_country != null && typeof(enemy_country) == "number") {
            oGameData.enemyId = Math.min(Math.max(enemy_country, 0), 203);
        } else {
            oGameData.enemyId = 0;
        }
        /* :: OVERRIDE :: */
    }
    if(audioType == 1 && !muted) {
        playMusic();
        if(!hasFocus) {
            music.pause();
        }
    }
    initStartScreen();
}
function initStartScreen() {

    background = new Elements.Background();

    if(forcedMode){
        initGameIntro();
        userInput.removeHitArea("backFromGameIntro");
        userInput.removeHitArea("playFromGameIntro");
        initGame();
        return;
    }

    if(skipTitle) {
        if(firstRun) {
            initChooseCountry();
        } else {
            initGameIntro();
        }
        return;
    }

    gameState = "start";
    flagPage = 0;
    try  {
        (window).famobi_analytics.trackScreen(famobi_analytics.SCREEN_HOME);
    } catch (e) {
    }
    ;
    if(audioType == 1) {
        music.fade(music.volume(), .5 * masterVolume, 500);
    }
    userInput.removeHitArea("moreGames");
    if(audioType == 1) {
    }

    var oPlayBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            0,
            0
        ],
        align: [
            .5,
            .85
        ],
        id: oImageIds.playBut
    };
    var oMoreGamesBut = {
        oImgData: assetLib.getData("moreGamesBut"),
        aPos: [
            85,
            -40
        ],
        align: [
            0,
            1
        ],
        id: "none",
        scale: .25,
        noMove: true
    };
    var oCreditsBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -90,
            32
        ],
        align: [
            1,
            0
        ],
        id: oImageIds.infoBut,
        noMove: true
    };
    userInput.addHitArea("playFromStart", butEventHandler, null, "image", oPlayBut);
    userInput.addHitArea("moreGames", butEventHandler, null, "image", oMoreGamesBut);
    userInput.addHitArea("credits", butEventHandler, null, "image", oCreditsBut);
    var aButs = new Array(oMoreGamesBut, oCreditsBut, oPlayBut);
    if(!firstRun) {
        var oChangeCountryBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                -55,
                -140
            ],
            align: [
                1,
                1
            ],
            id: oImageIds.changeCountryBut,
            noMove: true
        };
        userInput.addHitArea("changeCountryFromStart", butEventHandler, null, "image", oChangeCountryBut);
        var oCupsBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                -54,
                -54
            ],
            align: [
                1,
                1
            ],
            id: oImageIds.cupsBut,
            noMove: true
        };
        userInput.addHitArea("cupsFromStart", butEventHandler, null, "image", oCupsBut);
        aButs.push(oChangeCountryBut, oCupsBut);
    }
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateStartScreenEvent();

    window.famobi.gameReady();
}
function addMuteBut(_aButs) {

    if(externalMute) return;

    if(audioType == 1) {
        var mb = oImageIds.muteBut0;
        if(muted) {
            mb = oImageIds.muteBut1;
        }
        var oMuteBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                -30,
                32
            ],
            align: [
                1,
                0
            ],
            id: mb,
            noMove: true
        };
        userInput.addHitArea("mute", butEventHandler, null, "image", oMuteBut);
        _aButs.push(oMuteBut);
    }
}
function initCreditsScreen() {
    gameState = "credits";
    try  {
        (window).famobi_analytics.trackScreen(famobi_analytics.SCREEN_CREDITS);
    } catch (e) {
    }
    ;
    var oBackBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            30,
            -32
        ],
        align: [
            0,
            1
        ],
        id: oImageIds.backBut,
        noMove: true
    };
    var oResetBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -30,
            -30
        ],
        align: [
            1,
            1
        ],
        id: oImageIds.resetBut,
        noMove: true
    };
    userInput.addHitArea("backFromCredits", butEventHandler, null, "image", oBackBut);
    userInput.addHitArea("resetData", butEventHandler, null, "image", oResetBut);
    var aButs = new Array(oBackBut, oResetBut);
    if(isMobile) {
        var oControl0But;
        var oControl1But;
        if(controlState == 0) {
            oControl0But = {
                oImgData: assetLib.getData("uiButs"),
                aPos: [
                    -50,
                    -52
                ],
                align: [
                    .5,
                    1
                ],
                id: oImageIds.control0OnBut,
                noMove: true
            };
            oControl1But = {
                oImgData: assetLib.getData("uiButs"),
                aPos: [
                    50,
                    -52
                ],
                align: [
                    .5,
                    1
                ],
                id: oImageIds.control1OffBut,
                noMove: true
            };
        } else {
            oControl0But = {
                oImgData: assetLib.getData("uiButs"),
                aPos: [
                    -50,
                    -52
                ],
                align: [
                    .5,
                    1
                ],
                id: oImageIds.control0OffBut,
                noMove: true
            };
            oControl1But = {
                oImgData: assetLib.getData("uiButs"),
                aPos: [
                    50,
                    -52
                ],
                align: [
                    .5,
                    1
                ],
                id: oImageIds.control1OnBut,
                noMove: true
            };
        }
        userInput.addHitArea("control0FromCredits", butEventHandler, null, "image", oControl0But);
        userInput.addHitArea("control1FromCredits", butEventHandler, null, "image", oControl1But);
        aButs.push(oControl0But, oControl1But);
    }
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateCreditsScreenEvent();
}
function initChooseCountry() {
    gameState = "chooseCountry";

    if(typeof background == "undefined") {
        background = new Elements.Background();
    }

    var oBackBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            30,
            -32
        ],
        align: [
            0,
            1
        ],
        id: oImageIds.backBut,
        noMove: true
    };

    var aButs = new Array();

    if(!(flagPage == 0 && skipTitle)) {
        aButs = new Array(oBackBut);
        userInput.addHitArea("backFromChooseCountry", butEventHandler, null, "image", oBackBut);
    }

    if(flagPage == 0) {
        var oMoreBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                -30,
                -32
            ],
            align: [
                1,
                1
            ],
            id: oImageIds.moreBut,
            noMove: true
        };
        userInput.addHitArea("moreFromChooseCountry", butEventHandler, null, "image", oMoreBut);
        aButs.push(oMoreBut);
    }
    var oUiElementsImgData = assetLib.getData("uiElements");
    var bWidth = oUiElementsImgData.oData.oAtlasData[oImageIds.countryBut].width;
    var bHeight = oUiElementsImgData.oData.oAtlasData[oImageIds.countryBut].height;
    for(var i = 0; i < countryFlags.aIds.length / 2; i++) {
        var tempI = i + flagPage * (countryFlags.aIds.length / 2);
        var tempX = canvas.width / 2 - bWidth / 2 + ((i % 4) - 2) * 120 + 60;
        var tempY = canvas.height / 2 - bHeight / 2 + (Math.floor(i / 4) - 2.5) * 90 + 45;
        userInput.addHitArea("countryChoice", butEventHandler, {
            id: tempI
        }, "rect", {
            aRect: [
                tempX,
                tempY,
                tempX + bWidth,
                tempY + bHeight
            ]
        }, false);
    }
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateChooseCountryScreenEvent();

    window.famobi.gameReady();
}
function initMapScreen() {
    gameState = "map";
    for(var i = 0; i < aMapMarkerPos.length; i++) {
        if(i == oGameData.cupId) {
            var tempX = canvas.width / 2 + aMapMarkerPos[i][0];
            var tempY = canvas.height * .45 + aMapMarkerPos[i][1];
            userInput.addHitArea("playFromMap", butEventHandler, null, "rect", {
                aRect: [
                    tempX - 40,
                    tempY - 40,
                    tempX + 40,
                    tempY + 40
                ]
            }, true);
        }
    }
    var oBackBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            30,
            -32
        ],
        align: [
            0,
            1
        ],
        id: oImageIds.backBut,
        noMove: true
    };
    var oPlayBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            0,
            0
        ],
        align: [
            .5,
            .85
        ],
        id: oImageIds.playBut
    };
    userInput.addHitArea("backFromMap", butEventHandler, null, "image", oBackBut);
    userInput.addHitArea("playFromMap", butEventHandler, null, "image", oPlayBut);
    var aButs = new Array(oBackBut, oPlayBut);
    if(oGameData.cupId == 10 && oGameData.gameId == 6) {
        var oResetBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                -30,
                -30
            ],
            align: [
                1,
                1
            ],
            id: oImageIds.resetBut,
            noMove: true
        };
        userInput.addHitArea("resetDataFromMap", butEventHandler, null, "image", oResetBut);
        aButs.push(oResetBut);
    }
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateMapScreenEvent();
}
function initGameIntro() {
    gameState = "gameIntro";
    try  {
        (window).famobi_analytics.trackScreen(famobi_analytics.SCREEN_LEVELINTRO);
    } catch (e) {
    }
    ;
    if(oGameData.cupId == 10 && oGameData.gameId == 6) {
        oGameData.cupId = 9;
        oGameData.gameId = 5;
    }
    if(!forcedMode){
        oGameData.enemyId = countryFlags.getIdFromISO(aEnemyCountries[oGameData.cupId][oGameData.gameId]);
        if(oGameData.enemyId == oGameData.userId) {
            oGameData.enemyId = countryFlags.getIdFromISO(spareEnemyCountry);
        }
    }
    var oBackBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            30,
            -32
        ],
        align: [
            0,
            1
        ],
        id: oImageIds.backBut,
        noMove: true
    };
    var oPlayBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            0,
            0
        ],
        align: [
            .5,
            .85
        ],
        id: oImageIds.playBut
    };
    userInput.addHitArea("backFromGameIntro", butEventHandler, null, "image", oBackBut);
    userInput.addHitArea("playFromGameIntro", butEventHandler, null, "image", oPlayBut);
    var aButs = new Array(oBackBut, oPlayBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateGameIntroScreenEvent();
}
function initGame(_restart) {
    window.famobi_analytics.trackEvent(_restart ? window.famobi_analytics.EVENT_LEVELRESTART : window.famobi_analytics.EVENT_LEVELSTART, {levelName: "" + (oGameData.cupId * 6 + (oGameData.gameId + 1))}).then(_initGame, _initGame);
}

function _initGame() {

    //window.famobi_analytics.trackStats("country_player", countryFlags.aAllCountryCodes[oGameData.userId]);
    //window.famobi_analytics.trackStats("country_opponent", countryFlags.aAllCountryCodes[oGameData.enemyId]);
    if(skipTutorial){
        firstRun = false;
    }
    gameState = "game";
    if(window.famobi.hasFeature('lockPointer'))
    {
      if(!window.famobi.pointerLockHelper)window.famobi.pointerLockHelper = {};
      window.famobi.pointerLockHelper.mousePos = {x: fenster.innerWidth/2, y:fenster.innerHeight/2};
      userInput.lockPointer();
    }
    
    try  {
        (window).famobi_analytics.trackScreen(famobi_analytics.SCREEN_LEVEL);
    } catch (e) {
    }

    forcedModeProperties = window.famobi.getFeatureProperties("forced_mode");
    forcedModeProperties.state = forcedModeProperties.state || {};
    forcedModeProperties.override = forcedModeProperties.override || {};

    oGameData.userScore = parseInt(forcedModeProperties.state.user_score || 0);
    oGameData.enemyScore = parseInt(forcedModeProperties.state.enemy_score || 0);

    justWonCup = false;
    background = new Elements.Background();
    var aButs = new Array();
    if(!firstRun) {
        if(isMobile) {
            userInput.addHitArea("gameTouch", butEventHandler, {
                isDraggable: true,
                multiTouch: true
            }, "rect", {
                aRect: [
                    0,
                    50,
                    canvas.width,
                    canvas.height
                ]
            }, true);
        }
        var oPauseBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                -90,
                32
            ],
            align: [
                1,
                0
            ],
            id: oImageIds.pauseBut,
            noMove: true
        };
        if(!externalPause && !window.famobi.pointerLockHelper) {
          userInput.addHitArea("pause", butEventHandler, null, "image", oPauseBut);
          aButs.push(oPauseBut);
        }
    } else {
        var oTickBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                0,
                202
            ],
            align: [
                .5,
                .5
            ],
            id: oImageIds.tickBut,
            noMove: true
        };
        userInput.addHitArea("tickFromTut", butEventHandler, null, "image", oTickBut);
        aButs.push(oTickBut);
    }
    if(!window.famobi.pointerLockHelper) {
      addMuteBut(aButs);
    }
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    if(firstRun && !window.famobi.pointerLockHelper) {
        panel.startTut();
    }
    tableTop = new Elements.TableTop();
    userBat = new Elements.UserBat();
    enemyBat = new Elements.EnemyBat();
    ball = new Elements.Ball();
    previousTime = new Date().getTime();
    updateGameEvent();

    window.famobi_game.start = function() {
        playSound("gameStart");
        playSound("cheer" + Math.floor(Math.random() * 4));
        if(audioType == 1) {
            music.fade(music.volume(), .1 * masterVolume, 1000);
        }
    }

    window.famobi.paused = true;
    if(!window.externalStart || window.famobi.started) {
        window.famobi.paused = false;
        window.famobi_game.start();
    }

    window.famobi.gameReady();

    window.famobi.playerReady();
}
function initPause() {
    gameState = "pause";
    try  {
        (window).famobi_analytics.trackScreen(famobi_analytics.SCREEN_PAUSE);
    } catch (e) {
    }
    ;
    var oPlayBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            0,
            -100
        ],
        align: [
            .5,
            .5
        ],
        id: oImageIds.playBut
    };
    var oRestartBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            0,
            0
        ],
        align: [
            .5,
            .5
        ],
        id: oImageIds.restartBut
    };
    var oQuitBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            0,
            100
        ],
        align: [
            .5,
            .5
        ],
        id: oImageIds.quitBut
    };
    userInput.addHitArea("playFromPause", butEventHandler, null, "image", oPlayBut);
    userInput.addHitArea("restartFromPause", butEventHandler, null, "image", oRestartBut);
    userInput.addHitArea("quitFromPause", butEventHandler, null, "image", oQuitBut);
    var aButs = new Array(oPlayBut, oRestartBut, oQuitBut);
    if(isMobile) {
        var oControl0But;
        var oControl1But;
        if(controlState == 0) {
            oControl0But = {
                oImgData: assetLib.getData("uiButs"),
                aPos: [
                    -50,
                    -52
                ],
                align: [
                    .5,
                    1
                ],
                id: oImageIds.control0OnBut,
                noMove: true
            };
            oControl1But = {
                oImgData: assetLib.getData("uiButs"),
                aPos: [
                    50,
                    -52
                ],
                align: [
                    .5,
                    1
                ],
                id: oImageIds.control1OffBut,
                noMove: true
            };
        } else {
            oControl0But = {
                oImgData: assetLib.getData("uiButs"),
                aPos: [
                    -50,
                    -52
                ],
                align: [
                    .5,
                    1
                ],
                id: oImageIds.control0OffBut,
                noMove: true
            };
            oControl1But = {
                oImgData: assetLib.getData("uiButs"),
                aPos: [
                    50,
                    -52
                ],
                align: [
                    .5,
                    1
                ],
                id: oImageIds.control1OnBut,
                noMove: true
            };
        }
        userInput.addHitArea("control0FromPause", butEventHandler, null, "image", oControl0But);
        userInput.addHitArea("control1FromPause", butEventHandler, null, "image", oControl1But);
        aButs.push(oControl0But, oControl1But);
    }
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    background = new Elements.Background();
    updatePauseEvent();
}
function resumeGame() {
    gameState = "game";
    background = new Elements.Background();
    if(isMobile) {
        userInput.addHitArea("gameTouch", butEventHandler, {
            isDraggable: true,
            multiTouch: true
        }, "rect", {
            aRect: [
                0,
                50,
                canvas.width,
                canvas.height
            ]
        }, true);
    }
    var oPauseBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -90,
            32
        ],
        align: [
            1,
            0
        ],
        id: oImageIds.pauseBut,
        noMove: true
    };

    var aButs = new Array();

    if(!externalPause) {
        userInput.addHitArea("pause", butEventHandler, null, "image", oPauseBut);
        aButs = new Array(oPauseBut);
    }

    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateGameEvent();
}
function butEventHandler(_id, _oData) {
    if(window.famobi.paused) return;
    switch(_id) {
        case "langSelect":
            curLang = _oData.lang;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            userInput.removeHitArea("langSelect");
            preAssetLib = new Utils.AssetLoader(curLang, [
                {
                    id: "preloadImage",
                    file: "images/preloadImage.jpg"
                }
            ], ctx, canvas.width, canvas.height, false);
            preAssetLib.onReady(initLoadAssets);
            break;
        case "credits":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("playFromStart");
            userInput.removeHitArea("moreGames");
            userInput.removeHitArea("credits");
            userInput.removeHitArea("cupsFromStart");
            initCreditsScreen();
            break;
        case "backFromCredits":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromCredits");
            userInput.removeHitArea("resetData");
            userInput.removeHitArea("mute");
            userInput.removeHitArea("control0FromCredits");
            userInput.removeHitArea("control1FromCredits");
            initStartScreen();
            break;
        case "control0FromPause":
        case "control0FromCredits":
            playSound("hit" + Math.floor(Math.random() * 6));
            controlState = 0;
            saveDataHandler.setControlState(controlState);
            saveDataHandler.saveData();
            panel.switchBut(oImageIds.control0OffBut, oImageIds.control0OnBut);
            panel.switchBut(oImageIds.control1OnBut, oImageIds.control1OffBut);
            break;
        case "control1FromPause":
        case "control1FromCredits":
            playSound("hit" + Math.floor(Math.random() * 6));
            controlState = 1;
            saveDataHandler.setControlState(controlState);
            saveDataHandler.saveData();
            console;
            panel.switchBut(oImageIds.control0OnBut, oImageIds.control0OffBut);
            panel.switchBut(oImageIds.control1OffBut, oImageIds.control1OnBut);
            break;
        case "moreGames":
        case "moreGamesPause":
            playSound("hit" + Math.floor(Math.random() * 6));
            try  {
                (window).famobi.moreGamesLink();
            } catch (e) {
            }
            break;
        case "resetData":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromCredits");
            userInput.removeHitArea("resetData");
            userInput.removeHitArea("mute");
            userInput.removeHitArea("control0FromCredits");
            userInput.removeHitArea("control1FromCredits");
            saveDataHandler.resetData();
            oGameData.cupId = saveDataHandler.getCurCupId();
            oGameData.gameId = saveDataHandler.getCurGameId();
            var tempUserId = saveDataHandler.getUserId();
            if(tempUserId == 1234) {
                firstRun = true;
            } else {
                firstRun = false;
                oGameData.userId = tempUserId;
            }
            controlState = saveDataHandler.getControlState();
            initStartScreen();
            break;
        case "resetDataFromMap":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("resetDataFromMap");
            userInput.removeHitArea("backFromMap");
            userInput.removeHitArea("playFromMap");
            saveDataHandler.resetData();
            oGameData.cupId = saveDataHandler.getCurCupId();
            oGameData.gameId = saveDataHandler.getCurGameId();
            var tempUserId = saveDataHandler.getUserId();
            if(tempUserId == 1234) {
                firstRun = true;
            } else {
                firstRun = false;
                oGameData.userId = tempUserId;
            }
            controlState = saveDataHandler.getControlState();
            initMapScreen();
            break;
        case "changeCountryFromStart":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("playFromStart");
            userInput.removeHitArea("moreGames");
            userInput.removeHitArea("credits");
            userInput.removeHitArea("cupsFromStart");
            userInput.removeHitArea("changeCountryFromStart");
            initChooseCountry();
            break;
        case "cupsFromStart":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("playFromStart");
            userInput.removeHitArea("moreGames");
            userInput.removeHitArea("credits");
            userInput.removeHitArea("cupsFromStart");
            userInput.removeHitArea("changeCountryFromStart");
            initMapScreen();
            break;
        case "playFromStart":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("playFromStart");
            userInput.removeHitArea("moreGames");
            userInput.removeHitArea("credits");
            userInput.removeHitArea("cupsFromStart");
            userInput.removeHitArea("changeCountryFromStart");
            if(firstRun) {
                initChooseCountry();
            } else {
                initGameIntro();
            }
            break;
        case "countryChoice":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromChooseCountry");
            userInput.removeHitArea("moreFromChooseCountry");
            userInput.removeHitArea("countryChoice");
            oGameData.userId = countryFlags.aIds[_oData.id];
            //window.famobi_analytics.trackStats("country_changed", countryFlags.aAllCountryCodes[oGameData.userId]);
            saveDataHandler.setUserId(oGameData.userId);
            saveDataHandler.saveData();
            if(firstRun) {
                initMapScreen();
            } else {
                initGameIntro();
            }
            break;
        case "backFromChooseCountry":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromChooseCountry");
            userInput.removeHitArea("moreFromChooseCountry");
            userInput.removeHitArea("countryChoice");
            if(flagPage == 1) {
                flagPage = 0;
                initChooseCountry();
            } else {
                initStartScreen();
            }
            break;
        case "moreFromChooseCountry":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromChooseCountry");
            userInput.removeHitArea("moreFromChooseCountry");
            userInput.removeHitArea("countryChoice");
            if(flagPage == 0) {
                flagPage = 1;
            } else {
                flagPage = 0;
            }
            initChooseCountry();
            break;
        case "backFromMap":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("resetDataFromMap");
            userInput.removeHitArea("backFromMap");
            userInput.removeHitArea("playFromMap");
            if(firstRun) {
                initChooseCountry();
            } else {
                initStartScreen();
            }
            break;
        case "playFromMap":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("resetDataFromMap");
            userInput.removeHitArea("backFromMap");
            userInput.removeHitArea("playFromMap");
            initGameIntro();
            break;
        case "backFromGameIntro":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromGameIntro");
            userInput.removeHitArea("playFromGameIntro");
            if(firstRun) {
                initMapScreen();
            } else {
                initStartScreen();
            }
            break;
        case "playFromGameIntro":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromGameIntro");
            userInput.removeHitArea("playFromGameIntro");
            if(!window.externalStart) initGame();
            break;
        case "tickFromTut":
            playSound("hit" + Math.floor(Math.random() * 6));
            window.famobi_analytics.trackEvent(famobi_analytics.EVENT_TUTORIALCOMPLETED);
            window.famobi.playerReady();
            userInput.removeHitArea("tickFromTut");
            panel.aButs = new Array();
            userInput.addHitArea("gameTouch", butEventHandler, {
                isDraggable: true,
                multiTouch: true
            }, "rect", {
                aRect: [
                    0,
                    50,
                    canvas.width,
                    canvas.height
                ]
            }, true);
            var oPauseBut = {
                oImgData: assetLib.getData("uiButs"),
                aPos: [
                    -90,
                    32
                ],
                align: [
                    1,
                    0
                ],
                id: oImageIds.pauseBut,
                noMove: true
            };

            if(!externalPause) {
                userInput.addHitArea("pause", butEventHandler, null, "image", oPauseBut);
                panel.aButs.push(oPauseBut);
            }

            firstRun = false;
            break;
        case "gameTouch":
            if(_oData.isDown && !_oData.isBeingDragged) {
                swipeState = 1;
                startTouchY = _oData.y - userBat.targY;
            } else if(swipeState == 1 && _oData.isBeingDragged) {
                userBat.targX = _oData.x;
                if(controlState == 0) {
                    userBat.targY = _oData.y;
                } else {
                    userBat.targY = _oData.y - startTouchY;
                }
            } else {
                if(swipeState == 1) {
                    swipeState = 0;
                }
            }
            break;
        case "backFromGameComplete":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromGameComplete");
            userInput.removeHitArea("nextFromGameComplete");
            initStartScreen();
            break;
        case "nextFromGameComplete":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromGameComplete");
            userInput.removeHitArea("nextFromGameComplete");
            if(oGameData.cupId == 10 && oGameData.gameId == 6) {
                initMapScreen();
            } else if(oGameData.userScore > oGameData.enemyScore) {
                if(oGameData.gameId == 0) {
                    initMapScreen();
                } else {
                    initGameIntro();
                }
            } else {
                initGame(true);
            }
            break;
        case "mute":
            playSound("hit" + Math.floor(Math.random() * 6));
            toggleMute();
            if(muted) {
                panel.switchBut(oImageIds.muteBut0, oImageIds.muteBut1);
            } else {
                panel.switchBut(oImageIds.muteBut1, oImageIds.muteBut0);
            }
            break;
        case "enableAudio":
            if(muted) {
                toggleMute(true);
                if(muted) {
                    panel.switchBut(oImageIds.muteBut0, oImageIds.muteBut1);
                } else {
                    panel.switchBut(oImageIds.muteBut1, oImageIds.muteBut0);
                }
            }
            break;
        case "disableAudio":
            if(!muted) {
                toggleMute(true);
                if(muted) {
                    panel.switchBut(oImageIds.muteBut0, oImageIds.muteBut1);
                } else {
                    panel.switchBut(oImageIds.muteBut1, oImageIds.muteBut0);
                }
            }
            break;
        case "pause":
            if(_oData !== true) {
                playSound("hit" + Math.floor(Math.random() * 6));
            }
            if(audioType == 1) {
                Howler.mute(true);
                music.pause()
            } else if(audioType == 2) {
                music.pause()
            }
            userInput.removeHitArea("pause");
            userInput.removeHitArea("gameTouch");
            userInput.removeHitArea("mute");
            initPause();
            break;
        case "playFromPause":
            if(window.famobi.pointerLockHelper)userInput.lockPointer();
            if(_oData !== true) {
                playSound("hit" + Math.floor(Math.random() * 6));
            }
            if(audioType == 1) {
                if(!muted) {
                    Howler.mute(false);
                    playMusic();
                }
            } else if(audioType == 2) {
                if(!muted) {
                    playMusic();
                }
            }
            userInput.removeHitArea("quitFromPause");
            userInput.removeHitArea("playFromPause");
            userInput.removeHitArea("restartFromPause");
            userInput.removeHitArea("control0FromPause");
            userInput.removeHitArea("control1FromPause");
            userInput.removeHitArea("mute");
            resumeGame();
            break;
        case "restartFromPause":
            playSound("hit" + Math.floor(Math.random() * 6));
            try  {
                (window).famobi_analytics.trackEvent(famobi_analytics.EVENT_LEVELFAIL, {
                    levelName: (oGameData.cupId * 6 + (oGameData.gameId+1)).toString(),
                    reason: "draw"
                });
            } catch (e) {
            }
            if(audioType == 1) {
                if(!muted) {
                    Howler.mute(false);
                    playMusic();
                }
            } else if(audioType == 2) {
                if(!muted) {
                    playMusic();
                }
            }
            userInput.removeHitArea("quitFromPause");
            userInput.removeHitArea("playFromPause");
            userInput.removeHitArea("restartFromPause");
            userInput.removeHitArea("control0FromPause");
            userInput.removeHitArea("control1FromPause");
            userInput.removeHitArea("mute");
            initGame(true);
            break;
        case "quitFromPause":
            playSound("hit" + Math.floor(Math.random() * 6));
            try  {
                (window).famobi_analytics.trackEvent(famobi_analytics.EVENT_LEVELFAIL, {
                    levelName: (oGameData.cupId * 6 + (oGameData.gameId + 1)).toString(),
                    reason: "quit"
                });
            } catch (e) {
            }
            if(audioType == 1) {
                if(!muted) {
                    Howler.mute(false);
                    playMusic();
                }
                music.fade(music.volume(), .5 * masterVolume, 500);
            } else if(audioType == 2) {
                if(!muted) {
                    playMusic();
                }
            }
            userInput.removeHitArea("quitFromPause");
            userInput.removeHitArea("playFromPause");
            userInput.removeHitArea("restartFromPause");
            userInput.removeHitArea("control0FromPause");
            userInput.removeHitArea("control1FromPause");
            userInput.removeHitArea("mute");
            initStartScreen();
            break;
    }
}
function updateScore(_player,_cause) {
    panel.cardTween(_player);
    if(rallyHits <= 4 && Math.random() > .5) {
        playSound("cheer" + Math.floor(Math.random() * 2));
    } else if(rallyHits > 4 && rallyHits <= 7) {
        playSound("cheer" + (1 + Math.floor(Math.random() * 2)));
    } else if(rallyHits > 7 && rallyHits <= 10) {
        playSound("cheer" + (2 + Math.floor(Math.random() * 2)));
    } else if(rallyHits > 10) {
        playSound("cheer" + (3 + Math.floor(Math.random() * 2)));
    }
    let max_score = 11;
    if(forcedModeProperties != null && forcedModeProperties.override != null
        && typeof(forcedModeProperties.override.max_score) == "number") {
        max_score = forcedModeProperties.override.max_score;
    }
    if(_player == "user") {
        oGameData.userScore++;
        //window.famobi_analytics.trackStats("current_score_player", oGameData.userScore);
        //window.famobi_analytics.trackStats("score_player");
        window.famobi_analytics.trackStats("point_scored",{score_gained_by: "player",cause: _cause, hit_type: player_hitType});

        points_in_series_player++;
        points_in_series_opponent = 0;
        //if(points_in_series_player > 1) {
        //    window.famobi_analytics.trackStats("points_in_series_player", points_in_series_player);
        //}
        playSound("userPoint");
        if((oGameData.userScore >= max_score && ((max_score < 2) || oGameData.enemyScore <= oGameData.userScore - 2)) || oGameData.userScore == 99) {
            initGameComplete();
        }
    } else {
        oGameData.enemyScore++;
       //window.famobi_analytics.trackStats("current_score_opponent", oGameData.enemyScore);
       //window.famobi_analytics.trackStats("score_opponent");
        window.famobi_analytics.trackStats("point_scored",{score_gained_by: "enemy",cause: _cause, hit_type: enemy_hitType});
        points_in_series_opponent++;
        points_in_series_player = 0;
        //if(points_in_series_opponent > 1) {
        //    window.famobi_analytics.trackStats("points_in_series_opponent", points_in_series_opponent);
        //}
        playSound("enemyPoint");
        if((oGameData.enemyScore >= max_score && ((max_score < 2) || oGameData.userScore <= oGameData.enemyScore - 2)) || oGameData.enemyScore == 99) {
            initGameComplete();
        }
    }
}
function initGameComplete() {

    if (oGameData.userScore > oGameData.enemyScore) {
        //window.famobi_analytics.trackStats("match_won");
        won_matches_in_series_opponent = 0;
        won_matches_in_series_player++;
        //if(won_matches_in_series_player > 1) {
        //    window.famobi_analytics.trackStats("won_matches_in_series_player", won_matches_in_series_player);
        //}

        //if(oGameData.enemyScore == 0) {
        //    window.famobi_analytics.trackStats("flawless_victory");
        //}

        //if((oGameData.gameId+1) >= 6) {
        //    window.famobi_analytics.trackStats("cup_won");
        //}

    } else {
        //window.famobi_analytics.trackStats("match_lost");

        won_matches_in_series_player = 0;
        won_matches_in_series_opponent++;
        //if(won_matches_in_series_opponent > 1) {
        //    window.famobi_analytics.trackStats("won_matches_in_series_opponent", won_matches_in_series_opponent);
        //}

        //if(oGameData.userScore == 0) {
        //    window.famobi_analytics.trackStats("flawless_defeat");
        //}
    }

    let result = oGameData.userScore > oGameData.enemyScore ? "success" : "fail";

    if(oGameData.userScore == oGameData.enemyScore) result = "draw";

    window.famobi_analytics.trackEvent("EVENT_CUSTOM", {
        eventName: "LEVELEND",
        result: result,
        score: oGameData.userScore
    }).then(
        function() {
            window.famobi_analytics.trackEvent("EVENT_CUSTOM", oGameData.userScore > oGameData.enemyScore ? {event: "EVENT_LEVELSUCCESS", levelName: (oGameData.cupId * 6 + (oGameData.gameId+1)).toString()} : {event: "EVENT_LEVELFAIL", levelName: (oGameData.cupId * 6 + (oGameData.gameId+1)).toString(), reason: "dead"}).then(_initGameComplete, _initGameComplete);
        },
        function() {
            gameState = "pause";
        }
    );
}

function _initGameComplete() {
  if(window.famobi.pointerLockHelper) userInput.unlockPointer();
    gameState = "gameComplete";
    if(audioType == 1) {
        music.fade(music.volume(), .5 * masterVolume, 500);
    }
    userInput.removeHitArea("pause");
    userInput.removeHitArea("gameTouch");
    try  {
        (window).famobi_analytics.trackScreen(famobi_analytics.SCREEN_LEVELRESULT);
    } catch (e) {
    }
    ;
    var oBackBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            30,
            -32
        ],
        align: [
            0,
            1
        ],
        id: oImageIds.backBut,
        noMove: true,
        scale: 0.0001
    };

    var oNextBut;

    var showButtons = function() {
        oNextBut.scale = 1;
        oBackBut.scale = 1;
        userInput.addHitArea("nextFromGameComplete", butEventHandler, null, "image", oNextBut);
        userInput.addHitArea("backFromGameComplete", butEventHandler, null, "image", oBackBut);
        
    }

    if (oGameData.userScore > oGameData.enemyScore) {


        playSound("winGame");
        oGameData.gameId++;
        if(oGameData.gameId >= 6) {
            oGameData.cupId++;
            justWonCup = true;

            if(oGameData.cupId > 9) {
                oGameData.cupId = 10;
                oGameData.gameId = 6;
            } else {
                oGameData.gameId = 0;
            }
        }
        
        saveDataHandler.setGameData(oGameData);
        saveDataHandler.saveData();

        oNextBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                0,
                0
            ],
            align: [
                .5,
                .85
            ],
            id: oImageIds.playBut,
            scale: 0.0001
        };

        setTimeout(function() {
            window.famobi_analytics.trackEvent(famobi_analytics.EVENT_LEVELSUCCESS, {
                levelName: (oGameData.cupId * 6 + oGameData.gameId).toString()
            }).then(showButtons, showButtons);
        }.bind(this), 1500);
    } else {
        playSound("loseGame");
        oNextBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                0,
                0
            ],
            align: [
                .5,
                .85
            ],
            id: oImageIds.restartBut,
            scale: 0.0001
        };

        setTimeout(function() {
            window.famobi_analytics.trackEvent(famobi_analytics.EVENT_LEVELFAIL, {
                levelName: (oGameData.cupId * 6 + oGameData.gameId).toString(),
                reason: "dead"
            }).then(showButtons, showButtons);
        }.bind(this), 1500);
    }
    userInput.addHitArea("nextFromGameComplete", butEventHandler, null, "image", oNextBut);
    var aButs = new Array(oBackBut, oNextBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    aEffects = new Array();
    previousTime = new Date().getTime();
    updateGameComplete();
}
function addFirework(_x, _y, _scale) {
    if (typeof _scale === "undefined") { _scale = 1; }
    if(aEffects.length > 10) {
        return;
    }
    var firework = new Elements.Firework();
    firework.x = _x;
    firework.y = _y;
    firework.scaleX = firework.scaleY = _scale;
    aEffects.push(firework);
}
function updateGameEvent() {
    if(gameState != "game") {
        return;
    }
    delta = getDelta();
    background.renderGame();
    ball.update();
    enemyBat.update();
    if((ball.offTable || ball.offSide) || (ball.height < 0 && ball.tablePosY < .5 && (ball.tablePosX < -1 || ball.tablePosX > 1))) {
        ball.render();
        tableTop.render();
        enemyBat.render();
        tableTop.renderNet();
    } else if(ball.tablePosY > .5) {
        tableTop.render();
        enemyBat.render();
        tableTop.renderNet();
        ball.render();
    } else if(ball.tablePosY < .5) {
        tableTop.render();
        enemyBat.render();
        ball.render();
        tableTop.renderNet();
    }
    userBat.update();
    userBat.render();
    panel.render();
    requestAnimFrame(updateGameEvent);
}
function updateCreditsScreenEvent() {
    if(gameState != "credits") {
        return;
    }
    delta = getDelta();
    background.renderMenu();
    panel.update();
    panel.render();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "15px Helvetica";
    ctx.fillText("v1.0.2", canvas.width / 2, 20);
    requestAnimFrame(updateCreditsScreenEvent);
}
function updateChooseCountryScreenEvent() {
    if(gameState != "chooseCountry") {
        return;
    }
    delta = getDelta();
    background.renderMenu();
    panel.update();
    panel.render();
    requestAnimFrame(updateChooseCountryScreenEvent);
}
function updateGameComplete() {
    if(gameState != "gameComplete") {
        return;
    }
    delta = getDelta();
    background.renderMenu();
    panel.render();
    if(justWonCup && Math.random() < .1) {
        playSound("firework");
        addFirework(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1 + 2);
    }
    for(var i = 0; i < aEffects.length; i++) {
        aEffects[i].update();
        aEffects[i].render(ctx);
        if(aEffects[i].removeMe) {
            aEffects.splice(i, 1);
            i -= 1;
        }
    }
    requestAnimFrame(updateGameComplete);
}
function updateSplashScreenEvent() {
    if(gameState != "splash") {
        return;
    }
    delta = getDelta();
    splashTimer += delta;
    if(splashTimer > 2.5) {
        if(audioType == 1 && !muted) {
            playMusic();
            if(!hasFocus) {
                music.pause();
            }
        }
        initStartScreen();
        return;
    }
    background.renderMenu();
    panel.update();
    panel.render();
    requestAnimFrame(updateSplashScreenEvent);
}
function updateStartScreenEvent() {
    if(gameState != "start") {
        return;
    }
    delta = getDelta();
    background.renderMenu();
    panel.update();
    panel.render();
    requestAnimFrame(updateStartScreenEvent);
}
function updateGameIntroScreenEvent() {
    if(gameState != "gameIntro") {
        return;
    }
    delta = getDelta();
    background.renderMenu();
    panel.update();
    panel.render();
    requestAnimFrame(updateGameIntroScreenEvent);
}
function updateMapScreenEvent() {
    if(gameState != "map") {
        return;
    }
    delta = getDelta();
    background.renderMenu();
    panel.update();
    panel.render();
    requestAnimFrame(updateMapScreenEvent);
}
function updateLoaderEvent() {
    if(gameState != "load") {
        return;
    }
    delta = getDelta();
    assetLib.render();
    requestAnimFrame(updateLoaderEvent);
}
function updatePauseEvent() {
    if(gameState != "pause") {
        return;
    }
    delta = getDelta();
    background.renderMenu();
    panel.render();
    requestAnimFrame(updatePauseEvent);
}
function getDelta() {
    var currentTime = new Date().getTime();
    var deltaTemp = (currentTime - previousTime) / 1000;
    previousTime = currentTime;
    if(deltaTemp > .5) {
        deltaTemp = 0;
    }
    return deltaTemp;
}
function checkSpriteCollision(_s1, _s2) {
    var s1XOffset = _s1.x;
    var s1YOffset = _s1.y;
    var s2XOffset = _s2.x;
    var s2YOffset = _s2.y;
    var distance_squared = (((s1XOffset - s2XOffset) * (s1XOffset - s2XOffset)) + ((s1YOffset - s2YOffset) * (s1YOffset - s2YOffset)));
    var radii_squared = (_s1.radius) * (_s2.radius);
    if(distance_squared < radii_squared) {
        return true;
    } else {
        return false;
    }
}
function getScaleImageToMax(_oImgData, _aLimit) {
    var newScale;
    if(_oImgData.isSpriteSheet) {
        if(_aLimit[0] / _oImgData.oData.spriteWidth < _aLimit[1] / _oImgData.oData.spriteHeight) {
            newScale = Math.min(_aLimit[0] / _oImgData.oData.spriteWidth, 1);
        } else {
            newScale = Math.min(_aLimit[1] / _oImgData.oData.spriteHeight, 1);
        }
    } else {
        if(_aLimit[0] / _oImgData.img.width < _aLimit[1] / _oImgData.img.height) {
            newScale = Math.min(_aLimit[0] / _oImgData.img.width, 1);
        } else {
            newScale = Math.min(_aLimit[1] / _oImgData.img.height, 1);
        }
    }
    return newScale;
}
function getCentreFromTopLeft(_aTopLeft, _oImgData, _imgScale) {
    var aCentre = new Array();
    aCentre.push(_aTopLeft[0] + (_oImgData.oData.spriteWidth / 2) * _imgScale);
    aCentre.push(_aTopLeft[1] + (_oImgData.oData.spriteHeight / 2) * _imgScale);
    return aCentre;
}
function loadPreAssets() {
    if(aLangs.length > 1) {
        var aLangLoadData = new Array();
        for(var i = 0; i < aLangs.length; i++) {
            aLangLoadData.push({
                id: "lang" + aLangs[i],
                file: "images/lang" + aLangs[i] + ".png"
            });
        }
        preAssetLib = new Utils.AssetLoader(curLang, aLangLoadData, ctx, canvas.width, canvas.height, false);
        preAssetLib.onReady(initLangSelect);
    } else {
        curLang = aLangs[0];
        preAssetLib = new Utils.AssetLoader(curLang, [
            {
                id: "loader",
                file: "images/loader.png"
            },
            {
                id: "loadSpinner",
                file: "images/loadSpinner.png"
            }
        ], ctx, canvas.width, canvas.height, false);
        preAssetLib.onReady(initLoadAssets);
    }
}
function initLangSelect() {
    var oImgData;
    var j;
    var k;
    var gap = 10;
    var tileWidthNum = 0;
    var tileHeightNum = 0;
    var butScale = 1;
    for(var i = 0; i < aLangs.length; i++) {
        oImgData = preAssetLib.getData("lang" + aLangs[i]);
        if((i + 1) * (oImgData.img.width * butScale) + (i + 2) * gap < canvas.width) {
            tileWidthNum++;
        } else {
            break;
        }
    }
    tileHeightNum = Math.ceil(aLangs.length / tileWidthNum);
    for(var i = 0; i < aLangs.length; i++) {
        oImgData = preAssetLib.getData("lang" + aLangs[i]);
        j = canvas.width / 2 - (tileWidthNum / 2) * (oImgData.img.width * butScale) - ((tileWidthNum - 1) / 2) * gap;
        j += (i % tileWidthNum) * ((oImgData.img.width * butScale) + gap);
        k = canvas.height / 2 - (tileHeightNum / 2) * (oImgData.img.height * butScale) - ((tileHeightNum - 1) / 2) * gap;
        k += (Math.floor(i / tileWidthNum) % tileHeightNum) * ((oImgData.img.height * butScale) + gap);
        ctx.drawImage(oImgData.img, 0, 0, oImgData.img.width, oImgData.img.height, j, k, (oImgData.img.width * butScale), (oImgData.img.height * butScale));
        var oBut = {
            oImgData: oImgData,
            aPos: [
                j + (oImgData.img.width * butScale) / 2,
                k + (oImgData.img.height * butScale) / 2
            ],
            scale: butScale,
            id: "none",
            noMove: true
        };
        userInput.addHitArea("langSelect", butEventHandler, {
            lang: aLangs[i]
        }, "image", oBut);
    }
}
function initLoadAssets() {
    loadAssets();
}
function loadAssets() {
    var mg;
    try  {
        mg = (window).famobi.getBrandingButtonImage();
    } catch (e) {
        mg = "images/BrandingPlaceholderButton.png";
    }
    assetLib = new Utils.AssetLoader(curLang, [
        {
            id: "background",
            file: "images/bgMain.jpg"
        },
        {
            id: "splashLogo",
            file: "images/splashLogo.png"
        },
        {
            id: "countryFlags",
            file: "images/countryFlags.jpg"
        },
        {
            id: "largeNumbers",
            file: "images/largeNumbers_75x132.png"
        },
        {
            id: "smallNumbers",
            file: "images/smallNumbers_23x34.png"
        },
        {
            id: "scoreNumbers",
            file: "images/scoreNumbers_20x37.png"
        },
        {
            id: "uiButs",
            file: "images/uiButs.png",
            oAtlasData: {
                id0: {
                    x: 0,
                    y: 204,
                    width: 197,
                    height: 101
                },
                id1: {
                    x: 384,
                    y: 373,
                    width: 57,
                    height: 64
                },
                id10: {
                    x: 298,
                    y: 100,
                    width: 75,
                    height: 54
                },
                id11: {
                    x: 298,
                    y: 0,
                    width: 97,
                    height: 98
                },
                id12: {
                    x: 217,
                    y: 300,
                    width: 97,
                    height: 98
                },
                id13: {
                    x: 0,
                    y: 104,
                    width: 197,
                    height: 98
                },
                id14: {
                    x: 199,
                    y: 200,
                    width: 97,
                    height: 98
                },
                id15: {
                    x: 199,
                    y: 0,
                    width: 97,
                    height: 98
                },
                id16: {
                    x: 117,
                    y: 307,
                    width: 98,
                    height: 98
                },
                id17: {
                    x: 316,
                    y: 373,
                    width: 66,
                    height: 57
                },
                id2: {
                    x: 369,
                    y: 156,
                    width: 65,
                    height: 66
                },
                id3: {
                    x: 369,
                    y: 224,
                    width: 64,
                    height: 65
                },
                id4: {
                    x: 298,
                    y: 156,
                    width: 69,
                    height: 67
                },
                id5: {
                    x: 199,
                    y: 100,
                    width: 97,
                    height: 98
                },
                id6: {
                    x: 0,
                    y: 0,
                    width: 197,
                    height: 102
                },
                id7: {
                    x: 0,
                    y: 307,
                    width: 115,
                    height: 98
                },
                id8: {
                    x: 298,
                    y: 225,
                    width: 69,
                    height: 72
                },
                id9: {
                    x: 316,
                    y: 299,
                    width: 68,
                    height: 72
                }
            }
        },
        {
            id: "gameElements",
            file: "images/gameElements.png",
            oAtlasData: {
                id0: {
                    x: 637,
                    y: 1128,
                    width: 590,
                    height: 234
                },
                id1: {
                    x: 0,
                    y: 1527,
                    width: 414,
                    height: 41
                },
                id10: {
                    x: 466,
                    y: 1527,
                    width: 44,
                    height: 44
                },
                id11: {
                    x: 1274,
                    y: 188,
                    width: 113,
                    height: 186
                },
                id12: {
                    x: 1344,
                    y: 1034,
                    width: 109,
                    height: 110
                },
                id13: {
                    x: 0,
                    y: 1570,
                    width: 404,
                    height: 9
                },
                id14: {
                    x: 0,
                    y: 1600,
                    width: 589,
                    height: 28
                },
                id15: {
                    x: 0,
                    y: 0,
                    width: 635,
                    height: 372
                },
                id16: {
                    x: 1229,
                    y: 656,
                    width: 432,
                    height: 188
                },
                id17: {
                    x: 637,
                    y: 892,
                    width: 590,
                    height: 234
                },
                id18: {
                    x: 637,
                    y: 1364,
                    width: 590,
                    height: 234
                },
                id19: {
                    x: 1229,
                    y: 846,
                    width: 113,
                    height: 186
                },
                id2: {
                    x: 632,
                    y: 1616,
                    width: 39,
                    height: 39
                },
                id20: {
                    x: 1274,
                    y: 376,
                    width: 113,
                    height: 186
                },
                id21: {
                    x: 1229,
                    y: 1034,
                    width: 113,
                    height: 186
                },
                id22: {
                    x: 1229,
                    y: 1410,
                    width: 113,
                    height: 186
                },
                id23: {
                    x: 1229,
                    y: 1222,
                    width: 113,
                    height: 186
                },
                id24: {
                    x: 1274,
                    y: 0,
                    width: 113,
                    height: 186
                },
                id25: {
                    x: 0,
                    y: 374,
                    width: 635,
                    height: 500
                },
                id26: {
                    x: 416,
                    y: 1527,
                    width: 48,
                    height: 60
                },
                id27: {
                    x: 637,
                    y: 656,
                    width: 590,
                    height: 234
                },
                id28: {
                    x: 0,
                    y: 876,
                    width: 635,
                    height: 274
                },
                id29: {
                    x: 637,
                    y: 0,
                    width: 635,
                    height: 373
                },
                id3: {
                    x: 168,
                    y: 1630,
                    width: 37,
                    height: 21
                },
                id30: {
                    x: 0,
                    y: 1152,
                    width: 635,
                    height: 373
                },
                id31: {
                    x: 637,
                    y: 375,
                    width: 635,
                    height: 279
                },
                id32: {
                    x: 1274,
                    y: 564,
                    width: 85,
                    height: 85
                },
                id33: {
                    x: 129,
                    y: 1630,
                    width: 37,
                    height: 21
                },
                id4: {
                    x: 1344,
                    y: 846,
                    width: 113,
                    height: 186
                },
                id5: {
                    x: 0,
                    y: 1630,
                    width: 127,
                    height: 24
                },
                id6: {
                    x: 591,
                    y: 1616,
                    width: 39,
                    height: 40
                },
                id7: {
                    x: 591,
                    y: 1572,
                    width: 41,
                    height: 42
                },
                id8: {
                    x: 557,
                    y: 1527,
                    width: 43,
                    height: 43
                },
                id9: {
                    x: 512,
                    y: 1527,
                    width: 43,
                    height: 44
                }
            }
        },
        {
            id: "uiElements",
            file: "images/uiElements.png",
            oAtlasData: {
                id0: {
                    x: 499,
                    y: 823,
                    width: 441,
                    height: 106
                },
                id1: {
                    x: 499,
                    y: 545,
                    width: 452,
                    height: 276
                },
                id10: {
                    x: 942,
                    y: 823,
                    width: 112,
                    height: 137
                },
                id11: {
                    x: 891,
                    y: 322,
                    width: 112,
                    height: 137
                },
                id12: {
                    x: 953,
                    y: 461,
                    width: 112,
                    height: 136
                },
                id13: {
                    x: 621,
                    y: 465,
                    width: 59,
                    height: 59
                },
                id14: {
                    x: 0,
                    y: 156,
                    width: 619,
                    height: 387
                },
                id15: {
                    x: 682,
                    y: 465,
                    width: 57,
                    height: 56
                },
                id16: {
                    x: 741,
                    y: 465,
                    width: 57,
                    height: 56
                },
                id17: {
                    x: 702,
                    y: 84,
                    width: 57,
                    height: 56
                },
                id18: {
                    x: 0,
                    y: 545,
                    width: 497,
                    height: 498
                },
                id2: {
                    x: 0,
                    y: 0,
                    width: 700,
                    height: 154
                },
                id3: {
                    x: 702,
                    y: 0,
                    width: 113,
                    height: 82
                },
                id4: {
                    x: 741,
                    y: 962,
                    width: 84,
                    height: 80
                },
                id5: {
                    x: 621,
                    y: 156,
                    width: 268,
                    height: 307
                },
                id6: {
                    x: 891,
                    y: 0,
                    width: 119,
                    height: 159
                },
                id7: {
                    x: 891,
                    y: 161,
                    width: 119,
                    height: 159
                },
                id8: {
                    x: 499,
                    y: 931,
                    width: 240,
                    height: 118
                },
                id9: {
                    x: 953,
                    y: 599,
                    width: 112,
                    height: 137
                }
            }
        },
        {
            id: "firework",
            file: "images/firework_175x175.png",
            oAnims: {
                explode: [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16,
                    17,
                    18,
                    19,
                    20,
                    21,
                    22,
                    23,
                    24,
                    25,
                    26,
                    27,
                    28,
                    29
                ]
            }
        },
        {
            id: "shadow",
            file: "images/shadow.png"
        },
        {
            id: "moreGamesBut",
            file: mg
        }
    ], ctx, canvas.width, canvas.height);
    oImageIds.table0 = "id0";
    oImageIds.net = "id1";
    oImageIds.ball = "id2";
    oImageIds.ballShadow = "id3";
    oImageIds.userBatCentre = "id4";
    oImageIds.batShadow = "id5";
    oImageIds.ballTrail4 = "id6";
    oImageIds.ballTrail3 = "id7";
    oImageIds.ballTrail2 = "id8";
    oImageIds.ballTrail1 = "id9";
    oImageIds.ballTrail0 = "id10";
    oImageIds.enemyBat0 = "id11";
    oImageIds.userBatEdge = "id12";
    oImageIds.tableClip = "id13";
    oImageIds.tableEdge = "id14";
    oImageIds.tableBg0 = "id15";
    oImageIds.tableLegs = "id16";
    oImageIds.table1 = "id17";
    oImageIds.table2 = "id18";
    oImageIds.enemyBat1 = "id19";
    oImageIds.enemyBat2 = "id20";
    oImageIds.enemyBat3 = "id21";
    oImageIds.enemyBat4 = "id22";
    oImageIds.enemyBat5 = "id23";
    oImageIds.enemyBat6 = "id24";
    oImageIds.tableBgBottom = "id25";
    oImageIds.scoreCard = "id26";
    oImageIds.table3 = "id27";
    oImageIds.tableBg1 = "id28";
    oImageIds.tableBg2 = "id29";
    oImageIds.tableBg3 = "id30";
    oImageIds.tableBg4 = "id31";
    oImageIds.finger = "id32";
    oImageIds.bounceMark = "id33";
    oImageIds.playBut = "id0";
    oImageIds.infoBut = "id1";
    oImageIds.muteBut1 = "id2";
    oImageIds.muteBut0 = "id3";
    oImageIds.backBut = "id4";
    oImageIds.cupsBut = "id5";
    oImageIds.restartBut = "id6";
    oImageIds.moreGamesBut = "id7";
    oImageIds.pauseBut = "id8";
    oImageIds.resetBut = "id9";
    oImageIds.changeCountryBut = "id10";
    oImageIds.control0OnBut = "id11";
    oImageIds.control1OnBut = "id12";
    oImageIds.quitBut = "id13";
    oImageIds.control0OffBut = "id14";
    oImageIds.control1OffBut = "id15";
    oImageIds.tickBut = "id16";
    oImageIds.moreBut = "id17";
    oImageIds.titleLogo = "id0";
    oImageIds.titleBats = "id1";
    oImageIds.titleFadeBar = "id2";
    oImageIds.countryBut = "id3";
    oImageIds.vsText = "id4";
    oImageIds.flare = "id5";
    oImageIds.winIcon = "id6";
    oImageIds.loseIcon = "id7";
    oImageIds.globeLogo = "id8";
    oImageIds.cup1 = "id9";
    oImageIds.cup2 = "id10";
    oImageIds.cup3 = "id11";
    oImageIds.cup0 = "id12";
    oImageIds.titleBall = "id13";
    oImageIds.map = "id14";
    oImageIds.mapMarker2 = "id15";
    oImageIds.mapMarker1 = "id16";
    oImageIds.mapMarker0 = "id17";
    oImageIds.tutScreen = "id18";
    assetLib.onReady(initSplash);
    gameState = "load";
    previousTime = new Date().getTime();
    updateLoaderEvent();
}
function resizeCanvas() {
    var tempInnerWidth = fenster.innerWidth;
    var tempInnerHeight = fenster.innerHeight;
    canvas.height = tempInnerHeight;
    canvas.width = tempInnerWidth;
    canvas.style.width = tempInnerWidth + "px";
    canvas.style.height = tempInnerHeight + "px";
    if(tempInnerWidth > tempInnerHeight) {
        if(canvas.height < minSquareSize) {
            canvas.height = minSquareSize;
            canvas.width = minSquareSize * (tempInnerWidth / tempInnerHeight);
            canvasScale = minSquareSize / tempInnerHeight;
        } else if(canvas.height > maxSquareSize) {
            canvas.height = maxSquareSize;
            canvas.width = maxSquareSize * (tempInnerWidth / tempInnerHeight);
            canvasScale = maxSquareSize / tempInnerHeight;
        } else {
            canvasScale = 1;
        }
    } else {
        if(canvas.width < minSquareSize) {
            canvas.width = minSquareSize;
            canvas.height = minSquareSize * (tempInnerHeight / tempInnerWidth);
            canvasScale = minSquareSize / tempInnerWidth;
        } else if(canvas.width > maxSquareSize) {
            canvas.width = maxSquareSize;
            canvas.height = maxSquareSize * (tempInnerHeight / tempInnerWidth);
            canvasScale = maxSquareSize / tempInnerWidth;
        } else {
            canvasScale = 1;
        }
    }
    if(gameState == "game") {
        if(isMobile) {
            userInput.addHitArea("gameTouch", butEventHandler, {
                isDraggable: true,
                multiTouch: true
            }, "rect", {
                aRect: [
                    0,
                    50,
                    canvas.width,
                    canvas.height
                ]
            }, true);
        }
    }
    window.scrollTo(0, 0);
}
function playSound(_id) {
    if(audioType == 1) {
        sound.play(_id);
    }
}
function toggleMute(skipTrackEvent) {
    muted = !muted;
    if(audioType == 1) {
        if(muted) {
            Howler.mute(true);
            music.pause();

            if(!skipTrackEvent) {
                window.famobi_analytics.trackEvent("EVENT_VOLUMECHANGE", {
                    bgmVolume: 0,
                    sfxVolume: 0
                });
                window.famobi.localStorage.setItem("muted", "1");
            }
        } else {
            Howler.mute(false);
            playMusic();
            sound._volume = masterVolume;
            if(gameState == "game") {
                music.volume(.1 * masterVolume);
            } else {
                music.volume(.5 * masterVolume);
            }
            if(!skipTrackEvent) {
                window.famobi_analytics.trackEvent("EVENT_VOLUMECHANGE", {
                    bgmVolume: 1 * masterVolume,
                    sfxVolume: 1 * masterVolume
                });
                window.famobi.localStorage.removeItem("muted");
            }
        }
    } else if(audioType == 2) {
        if(muted) {
            music.pause();
        } else {
            playMusic();
        }
    }
}
