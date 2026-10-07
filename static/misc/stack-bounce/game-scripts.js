var ObjectPool=pc.createScript("objectPool");ObjectPool.attributes.add("prefabs",{type:"entity",array:!0}),ObjectPool.pool={},ObjectPool.instantiate=function(o,t,e){var l=ObjectPool.pop(o);return e.addChild(l),l.setPosition(t),l.enabled=!0,l},ObjectPool.pop=function(o,t){var e,l=ObjectPool.pool[o];return l?(0===l.pool.length?e=l.entity.clone():(e=l.pool.pop()).enabled=!0,e):(console.log("ObjectPool.pop(): pool for this object doesn't exist - "+o),null)},ObjectPool.push=function(o){var t=ObjectPool.pool[o.name];t?t.entity!=o&&(t.pool.length<t.maxCount?(t.pool.push(o),o.enabled=!1,o.parent&&o.parent.removeChild(o)):o.destroy()):console.log("ObjectPool.push(): pool for this object doesn't exist - "+o.name)},ObjectPool.setMaxCount=function(o,t){var e=ObjectPool.pool[o];e?e.maxCount=t:console.log("ObjectPool.setMaxCount(): pool for this object doesn't exist - "+o)},ObjectPool.setPrefab=function(o,t){ObjectPool.pool[o].entity=t},ObjectPool.prototype.initialize=function(){for(var o,t,e=0;e<this.prefabs.length;e++)t=this.prefabs[e],(o={}).maxCount=10,o.entity=t,o.pool=[],ObjectPool.pool[t.name]=o,console.log("ObjectPool.initialize(): entity pooled - "+t.name)};var CameraScript=pc.createScript("cameraScript");CameraScript.attributes.add("ball",{type:"entity"}),CameraScript.threshold=12.5,CameraScript.shift=10,CameraScript.speed=1,CameraScript.Y1=13,CameraScript.Y2=17,CameraScript.flyFollow=!1,CameraScript.prototype.initialize=function(){this.follow=!1,this.xLock=!1,this.lerpSpeed=1,this.onlyMoveUp=!1,this.onlyMoveDown=!1,this.yDist=10,this.zDist=50,this.yThreshold=2,this.followPos=!1,this.targetPos=new pc.Vec3,this.currPos=new pc.Vec3,this.app.on("game:reset",this.onGameReset,this),this.app.on("ball:startmove",this.onStartMove,this),this.app.on("ball:startboost",this.onStartMoveBoost,this),this.app.on("ball:stopmove",this.onStopMove,this),this.app.on("game:levelcompleted",this.onStopMove,this),this.shakeTimeCurr=0,this.shakeTime=40,this.shaking=!1,this.shakesCount=1e3,this.shakeShiftTimer=0,this.shakeShiftCurr=new pc.Vec3(0,0,0),this.shakeShiftMax=new pc.Vec3(.3,.3,0),this.onGameReset()},CameraScript.prototype.shake=function(t,s,i){this.shakeTimeCurr=0,this.shakeTime=t,this.shaking=!0,this.shakesCount=s,this.shakeShiftTimer=0,this.shakeShiftMax.copy(i),this.shakeShiftCurr.set(pc.math.random(-this.shakeShiftMax.x,this.shakeShiftMax.x),pc.math.random(-this.shakeShiftMax.y,this.shakeShiftMax.y),pc.math.random(-this.shakeShiftMax.z,this.shakeShiftMax.z))},CameraScript.prototype.onStopMove=function(){this.followBall(!0,2.5,7,!1,1,!1,!1),this.followPos=!0,this.targetPos.x=0,this.targetPos.y=Game.instance.lastNonBrokenY+this.yDist,this.targetPos.z=this.zDist},CameraScript.prototype.onStartMove=function(){this.followBall(!0,2.5,7,!1,5,!1,!1),this.yThreshold=0},CameraScript.prototype.onStartMoveBoost=function(){this.followBall(!0,2.5,10,!1,5,!1,!1),this.yThreshold=0},CameraScript.prototype.onGameReset=function(){this.entity.setPosition(0,9.5,8),this.currPos.copy(new pc.Vec3(0,9.5,8)),this.followPos=!0,this.lerpSpeed=1,this.targetPos.x=0,this.targetPos.y=10,this.targetPos.z=10},CameraScript.prototype.onLevelCompl=function(){this.followBall(!1,10.5,-40,!1,5,0),this.followPos=!0,this.targetPos.copy(Game.instance.lastJumpedPlatform.getPosition()),this.targetPos.y+=this.yDist,this.targetPos.z+=this.zDist},CameraScript.prototype.followBall=function(t,s,i,h,o,e,a){this.targetPos.x=0,this.xLock=t,this.yDist=s,this.zDist=i,this.lerpSpeed=o,this.onlyMoveUp=e,this.onlyMoveDown=a,this.followPos=!1,this.follow=!0,h&&(this.currPos.copy(this.ball.getPosition()),this.currPos.y+=this.yDist,this.currPos.z+=this.zDist,this.entity.setPosition(this.currPos))},CameraScript.prototype.followPos=function(t){this.targetPos.copy(t),this.followPos=!0,this.follow=!0},CameraScript.prototype.update=function(t){if(this.follow){this.followPos||(this.targetPos.copy(this.ball.getPosition()),this.targetPos.y+=this.yDist,this.targetPos.z+=this.zDist,this.targetPos.x=pc.math.clamp(this.targetPos.x,-5,5));this.onlyMoveDown&&(this.currPos.y<=this.targetPos.y||this.targetPos.y>this.currPos.y-this.yThreshold)&&(this.targetPos.y=this.currPos.y),this.onlyMoveUp&&(this.currPos.y>=this.targetPos.y||this.targetPos.y<this.currPos.y+this.yThreshold)&&(this.targetPos.y=this.currPos.y),Math.abs(this.currPos.y-this.targetPos.y)<this.yThreshold&&(this.targetPos.y=this.currPos.y),this.shaking&&(this.shakeTimeCurr+=t,this.shakeShiftTimer+=t,this.shakeShiftTimer>this.shakeTime/this.shakesCount&&(this.shakeShiftTimer=0,this.shakeShiftCurr.set(pc.math.random(-this.shakeShiftMax.x,this.shakeShiftMax.x),pc.math.random(-this.shakeShiftMax.y,this.shakeShiftMax.y),pc.math.random(-this.shakeShiftMax.z,this.shakeShiftMax.z))),this.shakeTimeCurr>=this.shakeTime&&(this.shaking=!1,this.shakeShiftCurr.set(0,0,0)),this.targetPos.add(this.shakeShiftCurr)),this.currPos.lerp(this.currPos,this.targetPos,this.lerpSpeed*t),this.entity.setPosition(this.currPos)}};var GameBackground=pc.createScript("gameBackground");GameBackground.attributes.add("sprPrimary",{type:"entity"}),GameBackground.attributes.add("sprFade",{type:"entity"}),GameBackground.instance=null,GameBackground.prototype.initialize=function(){GameBackground.instance=this},GameBackground.prototype.changeColor=function(a,e){this.sprPrimary.element.color=a,this.sprFade.element.color=e};var MinaretController=pc.createScript("minaretController");MinaretController.attributes.add("top",{type:"entity"}),MinaretController.attributes.add("cyl",{type:"entity"}),MinaretController.attributes.add("podium",{type:"entity"}),MinaretController.attributes.add("cylpart",{type:"entity"}),MinaretController.prototype.initialize=function(){var t;this.cylSize=this.cyl.getLocalScale().y,this.partSizeY=4,this.partsCount=Math.floor(this.cylSize/this.partSizeY)+2,this.parts=[];for(var i=0;i<this.partsCount;i++)t=this.cylpart.clone(),this.entity.addChild(t),t.enabled=!0,this.parts[i]=t;this.app.on("game:stylechange",this.onStyleChange,this)},MinaretController.prototype.updateParts=function(t){for(var i,e=this.yMax-Math.floor(Math.abs(t-this.yMax)/this.partSizeY)*this.partSizeY,a=0;a<this.partsCount;a++)i=this.parts[a],e<this.yMin?i.enabled=!1:i.enabled=!0,i.setPosition(0,e,0),e-=this.partSizeY},MinaretController.prototype.configure=function(t,i){this.yMin=t-i,this.yMax=t,this.top.setPosition(0,t,0)},MinaretController.prototype.onStyleChange=function(){var t=Game.instance.minMaterials[Game.instance.styleID];EntityTools.setMaterial(this.top.children[0],t),EntityTools.setMaterial(this.cyl,t)},MinaretController.prototype.update=function(t){var i=pc.math.clamp(Game.instance.lastNonBrokenY,this.yMin+.5*this.cylSize,this.yMax-.5*this.cylSize);this.updateParts(i+.5*this.cylSize),this.entity.rotateLocal(0,-15*t*Game.instance.slomo,0),this.podium.rotateLocal(0,-5*t*Game.instance.slomo,0)};var FadeScreen=pc.createScript("fadeScreen");FadeScreen.attributes.add("fadeScreenImage",{type:"entity"}),FadeScreen.instance=null,FadeScreen.prototype.initialize=function(){FadeScreen.instance=this,this.fadeTime=1,this.delay=0,this.onlyFadeOut=!1,this.action=null,this.time=0,this.fading=!1,this.state=0,this.fadeScreenImage.element.opacity=0,FadeScreen.instance.show(.9,0,!0,null)},FadeScreen.prototype.start=function(){this.fadeScreenImage.enabled=!0,this.onlyFadeOut?(this.state=2,this.fadeScreenImage.element.opacity=1,this.action&&this.action()):(this.state=1,this.fadeScreenImage.element.opacity=0)},FadeScreen.prototype.update=function(e){if(this.fading){if(this.delay>0)return this.delay-=e,void(this.delay<=0&&this.start());var t;this.time+=e,(t=this.time/this.fadeTime)>=1?(this.time=0,1==this.state?(this.fadeScreenImage.element.opacity=1,this.state=2,this.action&&this.action()):2==this.state&&(this.fadeScreenImage.element.opacity=0,this.fadeScreenImage.enabled=!1,this.state=0,this.fading=!1)):1==this.state?this.fadeScreenImage.element.opacity=t:2==this.state&&(this.fadeScreenImage.element.opacity=1-t)}},FadeScreen.prototype.show=function(e,t,i,a){this.fadeTime=e,this.delay=t,this.onlyFadeOut=i,this.action=a,this.time=0,this.fading=!0,0===this.delay&&this.start()};var Uishop=pc.createScript("uishop");Uishop.attributes.add("popup",{type:"entity"}),Uishop.attributes.add("skinsEntity",{type:"entity"}),Uishop.attributes.add("progress",{type:"entity"}),Uishop.attributes.add("progressTextMission",{type:"entity"}),Uishop.attributes.add("progressTextCount",{type:"entity"}),Uishop.attributes.add("choose",{type:"entity"}),Uishop.attributes.add("mission",{type:"entity"}),Uishop.attributes.add("lockedMaterial",{type:"asset",assetType:"material"}),Uishop.attributes.add("lock",{type:"entity"}),Uishop.instance=null,Uishop.chosenSkinID=0,Uishop.shownSkinID=0,Uishop.prototype.initialize=function(){if(this.initialized)return 0;this.initialized=!0,this.skinsEntityLocPos=(new pc.Vec3).copy(this.skinsEntity.getLocalPosition()),this.skinsEntity.enabled=!1,Uishop.instance=this,this.skinsCount=this.skinsEntity.children.length,this.skins=[];for(var t=0;t<this.skinsCount;t++)this.skins[t]=this.skinsEntity.children[t],EntityTools.setMaterial(this.skins[t],this.lockedMaterial);this.app.on("game:stylechange",this.onStyleChange),this.onStyleChange(),this.onEnable(),this.on("enable",this.onEnable,this),this.chooseSkin(0),this.entity.enabled=!1,this.skinsEntity.enabled=!1,this.app.fire("shop:initialized")},Uishop.prototype.onStyleChange=function(){for(var t=0;t<this.skinsCount;t++)this.checkSkinUnlocked(t)&&EntityTools.setMaterial(this.skins[t],Game.instance.ballMaterials[Game.instance.styleID])},Uishop.prototype.chooseNextSkin=function(){Uishop.chosenSkinID++,Uishop.chosenSkinID>=this.skinsCount&&(Uishop.chosenSkinID=0),this.chooseSkin(Uishop.chosenSkinID)},Uishop.prototype.chooseSkin=function(t){if(!this.checkSkinUnlocked(t))return 1;Uishop.chosenSkinID=t,this.skinsEntity.setPosition(Game.instance.ball.getPosition());var e=this.skins[t].clone();this.skinsEntity.setLocalPosition(this.skinsEntityLocPos),e.setPosition(Game.instance.ball.getPosition()),e.translate(0,this.skins[t].script.skin.shiftY,0),Game.instance.ball.script.ball.modelEntity.destroy(),Game.instance.ball.script.ball.modelEntity=e,EntityTools.setLayers(e,"World");var s=Game.instance.ballMaterials[Game.instance.styleID];EntityTools.setMaterial(Game.instance.ball.script.ball.modelEntity,s),EntityTools.reparent(e,Game.instance.ball),e.enabled=!0},Uishop.prototype.showSkin=function(t){for(var e=0;e<this.skinsCount;e++)this.skins[e].enabled=t===e;this.checkSkinUnlocked(t)?(this.lock.enabled=!1,this.choose.enabled=!0,this.progress.enabled=!1,this.mission.enabled=!1):(this.lock.enabled=!0,this.choose.enabled=!1,this.progress.enabled=!0,this.mission.enabled=!0,this.setProgressText(this.progressTextMission,this.progressTextCount,t))},Uishop.prototype.setProgressText=function(t,e,s){var i=this.skins[s].script.skin;if(i.levelsCompleted>0&&(t.element.text="COMPLETE "+i.levelsCompleted.toString()+" LEVELS!",e.element.text=(Game.instance.levelCurrent-1).toString()+" / "+i.levelsCompleted.toString(),this.progress.script.progressBar.setProgress((Game.instance.levelCurrent-1)/i.levelsCompleted)),i.platformsBroken>0&&(t.element.text="BREAK "+i.platformsBroken.toString()+" PLATFORMS!",e.element.text=Game.instance.platformsBrokenTotal.toString()+" / "+i.platformsBroken.toString(),this.progress.script.progressBar.setProgress(Game.instance.platformsBrokenTotal/i.platformsBroken)),i.scoreReach>0){var n=Game.instance.currScore;Game.instance.bestScore>i.scoreReach&&(n=Game.instance.bestScore),t.element.text="SCORE "+i.scoreReach.toString()+"!",e.element.text=n.toString()+" / "+i.scoreReach.toString(),this.progress.script.progressBar.setProgress(n/i.scoreReach)}},Uishop.prototype.checkSkinUnlocked=function(t){var e=this.skins[t].script.skin;return e.levelsCompleted>0?e.levelsCompleted<=Game.instance.levelCurrent-1:e.platformsBroken>0?e.platformsBroken<=Game.instance.platformsBrokenTotal:!(e.scoreReach>0)||e.scoreReach<=Game.instance.bestScore},Uishop.prototype.onEnable=function(){this.onStyleChange(),this.skinsEntity.enabled=!0,this.skinsEntity.setLocalScale(0,0,0),this.skinsEntity.tween(this.skinsEntity.getLocalScale()).to(new pc.Vec3(.5,.5,.5),.45,pc.BackOut).loop(!1).yoyo(!1).start(),this.popup.setLocalScale(0,0,0),this.popup.tween(this.popup.getLocalScale()).to(new pc.Vec3(1,1,1),.45,pc.BackOut).loop(!1).yoyo(!1).start(),this.showSkin(Uishop.chosenSkinID)},Uishop.prototype.close=function(){this.lock.enabled=!1,this.skinsEntity.tween(this.skinsEntity.getLocalScale()).to(new pc.Vec3(0,0,0),.4,pc.BackIn).loop(!1).yoyo(!1).on("complete",function(){Uishop.instance.skinsEntity.enabled=!1}).start(),this.popup.tween(this.popup.getLocalScale()).to(new pc.Vec3(0,0,0),.4,pc.BackIn).loop(!1).yoyo(!1).on("complete",function(){Uishop.instance.entity.enabled=!1}).start(),Game.instance._state==Game.STATE_GAMEOVER?FadeScreen.instance.show(.5,.1,!1,function(){this.app.fire("game:makereset",!0)}):Game.instance._state==Game.STATE_LEVELCOMPLETED&&FadeScreen.instance.show(.5,.1,!1,function(){this.app.fire("game:makereset",!1)})},Uishop.prototype.update=function(t){};// Game.js
var Game = pc.createScript('game');



////////////// STYLES //////////////
// 
Game.attributes.add('gameBG', {type: 'entity'});
Game.attributes.add("platMaterials", {type: "asset", assetType: "material", array: true, title: "Platform Materials"});
Game.attributes.add("ballMaterials", {type: "asset", assetType: "material", array: true, title: "Ball Materials"});
Game.attributes.add("minMaterials", {type: "asset", assetType: "material", array: true, title: "Minaret Materials"});
Game.attributes.add("deathMaterial", {type: "asset", assetType: "material"});
Game.attributes.add("boostMaterial", {type: "asset", assetType: "material"});
Game.attributes.add("failMaterial", {type: "asset", assetType: "material"});


Game.attributes.add('city1', {type: 'entity'});
Game.attributes.add('city2', {type: 'entity'});
//Game.attributes.add("boostСщдщк", {type: "asset", assetType: "material"});


Game.attributes.add("bgColors",
{
    type: 'rgba',
    array: true
});

Game.attributes.add("bgFadeColors",
{
    type: 'rgba',
    array: true
});

Game.attributes.add("platColors",
{
    type: 'rgba',
    array: true
});

Game.attributes.add("ballColors",
{
    type: 'rgba',
    array: true
});


/////////////////////////////////////


Game.prototype.getTextColor = function()
{
    return this.platColors[this.styleID];
};

Game.prototype.setStyle = function(_styleID)
{
    var mat;
    mat = this.platMaterials[_styleID];
    
    var ent     = this.app.root.findByTag('ringPartModel');      // platforms array
    for (var i = 0; i < ent.length; i++)
    {
        if (ent[i].model.meshInstances[0].material == this.deathMaterial.resource) continue;
        ent[i].model.meshInstances[0].material = mat.resource; 
        ent[i].model.meshInstances[0].material.update();
    }
    
    mat = this.ballMaterials[_styleID];
    
    
    
    EntityTools.setMaterial(this.ball.script.ball.modelEntity, mat);
    //this.ball.model.meshInstances[0].material = mat.resource; 
    //this.ball.model.meshInstances[0].material.update();
    
    this.gameBG.script.gameBackground.changeColor(this.bgColors[_styleID], this.bgFadeColors[_styleID]);
    
    
    this.styleID = _styleID;
    this.app.fire('game:stylechange');
};


Game.prototype.setRandomStyle = function()
{
    var _styleID = Math.floor(Math.random() * this.ballMaterials.length);
    if (this.styleID == _styleID)
    {
        _styleID++;
        if (_styleID >= this.ballMaterials.length)
        {
            _styleID = 0;
        }
    }
    this.setStyle(_styleID);
};

// GAME OBJECTS
Game.attributes.add('ring', {type: 'entity'});
Game.attributes.add('ringPart', {type: 'entity'});
Game.attributes.add('ball', {type: 'entity'});
Game.attributes.add('camera', {type: 'entity'});
Game.attributes.add('bg', {type: 'entity'});
Game.attributes.add('minaret', {type: 'entity'});
Game.attributes.add('finish', {type: 'entity'});

// UI
Game.attributes.add('whiteFrame', {type: 'entity'});
Game.attributes.add('uiInterface', {type: 'entity'});
Game.attributes.add('uiMainMenu', {type: 'entity'});
Game.attributes.add('uiTutorial', {type: 'entity'});
Game.attributes.add('uiScore', {type: 'entity'});
Game.attributes.add('uiShop', {type: 'entity'});
Game.attributes.add('uiBH5', {type: 'entity'});
Game.attributes.add('uiDemo', {type: 'entity'});
Game.attributes.add('uiBoost', {type: 'entity'});

Game.attributes.add('levelBoard', {type: 'entity'});

// TUTOR
Game.firstLaunch        = true;


Game.STATE_INTRO        = 'intro';
Game.STATE_INGAME       = 'ingame';
Game.STATE_GAMEOVER     = 'gameover';
Game.STATE_LEVELCOMPLETED     = 'levelcompleted';


Game.gameMsgs           = ["Cool!", "Nice!", "Perfect!", "Good!" , "Great!"];
Game.gameMsgs2          = ["Perfect!", "Fantastic!" , "Amazing!", "Incredible!", "Terrific!"];

Game.msgID              = 0;


// TEMP
Game.tempVec3           =  new pc.Vec3(0,0,0);



Game.prototype.levelCompleted = function()
{
    if (this._state == Game.STATE_LEVELCOMPLETED) return 1;
    this._state = Game.STATE_LEVELCOMPLETED;
    
    
    this.app.fire("game:levelcompleted", this.levelCurrent);
    console.log("game : level completed ", this.levelCurrent);
    
    GameAudio.play("levelcomplete");
    
    this.stopBoosting();
    
    FadeScreen.instance.show(0.3, 2, false, function(){
        
        Game.instance.uiScore.enabled        = true;
        Game.instance.uiInterface.enabled    = false;
        
    });
    
    setTimeout(function () {
        VibrationController.vibrate(500);
        GameAudio.play("cracker");
        var serpPos = Game.instance.finish.getPosition();
        for (var i = 0; i < 29; i++)
        {
            Serpantine.create(serpPos);
        }
    }, 500);
    
    /*Serpantine.create(this.entity.getPosition());
    Serpantine.create(this.entity.getPosition());
    Serpantine.create(this.entity.getPosition());
    Serpantine.create(this.entity.getPosition());*/
    
    
    Game.speed = this.level.endSpeed;
    
    this.ball.script.ball.tryBreak = false;
    
    this.levelCurrent++;
    
    //this.saveAll();
    // STYLE REFRESH?
    //if ((this.levelCurrent+1) % 2 === 0)
    
    
    {
        this.setNewStyleOnReset = true;
    }
    
};


// Call this to move from MENU to INGAME
Game.prototype.gameover = function (reason) {
    if (this._state == Game.STATE_GAMEOVER) return 1;
    this._state = Game.STATE_GAMEOVER;
    
    
    js_GS_gameOver();
    VibrationController.vibrate(1000);
    
    this.app.fire("game:gameover", reason);
    console.log("game : game over on level ", this.levelCurrent);

    //        this.app.fire("ball:stopmove");
    this.stopBoosting();
    
    //this.ball.enabled = false;
    
    this.ball.script.ball.break();
    this.camera.script.cameraScript.shake(0.5, 25, new pc.Vec3(0.65,0.65,0));
    
    FadeScreen.instance.show(0.3, 0, true, null);
    
    setTimeout(function(){
    
    FadeScreen.instance.show(0.3, 0, false, function(){
        
        Game.instance.uiInterface.enabled    = false;
        Game.instance.uiScore.enabled        = true;
        
    });
    
    }, 1000);
    
};

/// COINS
//
Game.prototype.addCoins = function(count) {
    this.coins += count;
    
    this.app.fire("stats:coinschanged", this.coins);
};

// returns true if succeed, false if failed
Game.prototype.wasteCoins = function(count) {
    
    if (this.coins >= count)
    {
        this.coins -= count;
        this.app.fire("stats:coinschanged", this.coins);
        return true;
    } else
    {
        return false;
    }
};

Game.prototype.configureLevel = function() {
    this.level.ringsCount = MathUtil.irr(120,200);
    
    if (this.levelCurrent % 3 === 0) this.level.ringsCount =MathUtil.irr(200,350);
    
    this.level.ringTypeID = MathUtil.choose(0, 1, 2, 3, 4,  5, 8, 6, 9, 10, 11, 12, 13, 14, 15); // 7 - не оч
    //console.log(this.level.ringTypeID);
    
        /*= {
        ringTypeID           : 2,
        ringsCount           : 150,
        ringScaling          : 0
    };*/
};


// initialize code called once per entity
Game.prototype.initialize = function() {
    Game.instance = this;
    this.startGameButtonEnabled = false;
    //this.BH5        = false;
    
    this._state = Game.STATE_INTRO;
    
    // debug
    this.slomo              = 0.1;
    this.rotatingKoef       = 1;
    
    this.whiteColor = new pc.Color().fromString('#FFFFFF');
    
    // is mobile
    this.isMobile = false;
    if (this.app.touch) {
        this.isMobile = true;
    }
    
    
    // stats
    this.levelCurrent       = 1;    // level number
    this.currScore          = 0;
    this.bestScore          = 0;
    this.platformsBrokenTotal = 0;
    //this.coins            = 2000;
    
    
    this.canvas = this.app.root.findByName('Canvas');
    this.setResolution();
    //window.addEventListener("resize", this.setResolution.bind(this));
    
    
    // level params
    this.level = {
        ringTypeID           : 2,
        ringsCount           : 80,
        ringScaling          : 0
    }; // 0..1 level progress
    
    
    // game events
    this.app.on("game:makereset", this.reset, this);
    
   
    this.DIST_BETW_RINGS    = 0.5;
    this.RING_SIZE_Y        = 0.5;
    this.ANG_BETW_RINGS     = -4 * Game.instance.rotatingKoef;
    
    
    
    // STYLE
    this.styleID                = 0;
    this.setNewStyleOnReset     = false;
    
    
    // Saving
    // SAVING/LOADING
    
    
    this.app.on("shop:initialized", this.onShopInit.bind(this));
    
};


Game.prototype.onShopInit = function ( ) {
    
    Savefile.addKey('levelCurrent', 1);
    Savefile.addKey('bestScore', 0);
    Savefile.addKey('styleID', 0);
    Savefile.addKey('chosenSkinId', 0);
    Savefile.addKey('platformsBrokenTotal', 0);
    
    Savefile.addKey('level.ringTypeID', 2);
    Savefile.addKey('level.ringsCount', 80);
    Savefile.addKey('level.ringScaling', 0);
    
    
    Savefile.load();
    
    var skID = Savefile.get('chosenSkinId');
    Uishop.instance.chooseSkin(skID);
    
    
    this.levelCurrent           =Savefile.get('levelCurrent');
    this.bestScore              =Savefile.get('bestScore');
    this.styleID                =Savefile.get('styleID');
    this.platformsBrokenTotal   = Savefile.get('platformsBrokenTotal');
    
    this.level.ringTypeID              =Savefile.get('level.ringTypeID');
    this.level.ringsCount              =Savefile.get('level.ringsCount');
    this.level.ringScaling              =Savefile.get('level.ringScaling');
    
    
    
    this.reset(true);
    
};


Game.prototype.saveAll = function ( ) {
    Savefile.set('levelCurrent', this.levelCurrent);
    Savefile.set('bestScore', this.bestScore);
    Savefile.set('styleID', this.styleID);
    Savefile.set('chosenSkinId', Uishop.chosenSkinID);
    Savefile.set('platformsBrokenTotal', this.platformsBrokenTotal);
    
    Savefile.set('level.ringTypeID', this.level.ringTypeID);
    Savefile.set('level.ringsCount', this.level.ringsCount);
    Savefile.set('level.ringScaling', this.level.ringScaling);
    
    Savefile.save();
};


/// resetScore = true when gameover, = false if continue to new level
Game.prototype.reset = function ( resetScore ) {
    
    Ball.delayToControl = 0.6;
    this._state = Game.STATE_INTRO;
    this.startGameButtonEnabled = true;
    
    if (this.levelCurrent % 2 !== 0)
    {
        this.city1.enabled = false;
        this.city2.enabled = true;
    } else
    {
        this.city1.enabled = true;
        this.city2.enabled = false;
    }
    
    
    
    var ent     = this.app.root.findByTag('ring');      // platforms array
    for (var i = 0; i < ent.length; i++)
    {
        if (ent[i] != this.ring)
        ent[i].destroy();
    }
                /*var material = this.deathMaterial;
                var colorD2     = new pc.Color().fromString("#27325C");
                var colorE2     = new pc.Color().fromString("#121212");

                    material.diffuse = colorD2;
                    material.emissive = colorE2;
                    material.resource.update();*/
    
    // set level basics
    if (!resetScore)
    {
        this.configureLevel();
    } else
    {
    }
    
    // gameplay
    // 
    // 
    this.ball.enabled = true;
    //this.ball.setLocalPosition(0, 2.5, 0);
    
    this.ringScript         = this.ring.script.ring;
    this.ballPos            = this.ball.getLocalPosition();
    
    // LEVEL CREATING ON FLY
    this.ringsCreatedCount  = 0;
    this.levelCreated       = false;
    
    this.brokenRings        = 0;
    
    this.lastRing           = this.ring.script.ring;
    this.lastRingY          = 5.5;
    this.lastRing.angle     = 0;
    
    this.lastNonBroken      = null;
    this.lastNonBrokenY     = this.lastRingY;
    
    this.configureRing(this.ring.script.ring, this.level.ringTypeID);
    this.lastRing           = null;
    
    
    // 0..1 level progress
    
    this.levelProgress      = 0; 
    Game.instance.app.fire("game:levelprogress", this.levelProgress);
    
    // boost
    this.boostInitTime      = 0;
    this.boostValue         = -0.25; // [0..1] - if >1 activate boost
    this.boosting           = false;
    this.boostingTime       = 0;
    this.uiBoost.enabled    = false;
        var bs = this.uiBoost.script.maskedBar;
        bs.setValue(this.boostValue, true);
    
    // streak
    this.streak         = 0;
    
    // graphics
    this.ringScaleCurr = 1;
    this.ringScaleTarg = pc.math.random(0.8,1.2);
    
    // set finish
    this.finish.setLocalPosition(0,this.lastRingY-(this.level.ringsCount-0.5) * this.RING_SIZE_Y-2,0);
    // set minaret
    this.minaret.script.minaretController.configure(this.lastRingY + 0.5, this.lastRingY + 0.5-this.finish.getPosition().y);
    
    
    //this.uiTutorial.enabled = true;
    this.uiScore.enabled    = false;
    this.uiInterface.enabled = true;
    this.slomo = 1;
    
    // SET STYLE
    // 
    
    //this.setStyle(0);
    
    if (this.setNewStyleOnReset)
    {
        this.setRandomStyle();
        this.setNewStyleOnReset = false;
    } else
    {
        this.setStyle(this.styleID);
    }
    
    // UI
    if (resetScore)
    {
        this.resetScore();
        // new game
        //this.currScore          = 0;
        this.uiMainMenu.enabled = true;
        this.uiTutorial.enabled = true;
    } else
    {
        // continue
        // 
        //this.uiMainMenu.enabled = false;
        this.uiMainMenu.enabled = true;
        this.uiTutorial.enabled = true;
    }
    
    
    this.saveAll();
    this.app.fire("game:reset");
    
    Game.firstLaunch = false;
};


Game.prototype.processLevelCreation = function()
{
    var minSizeCreatedY = 16;// created level min size y
    if (!this.levelCreated)
    {
        // process creation
        if (this.ballPos.y - minSizeCreatedY <= this.lastRingY)
        {
            this.createRings();
            // this.createRing();
        }
    }
};


// TRIES TO BREAK TOP RING
// return true if broke, false if smth happen
Game.prototype.tryBrokeRing = function()
{
    // BREAK
    if (this.lastNonBroken)
    {
        var pt = Game.instance.lastNonBroken.partUnderAngle(90);
        var ps = pt.script.ringPart;
        
        if (ps.death && !this.boosting)
        {
            
            // break ball, game over
            if (this.ball.getLocalPosition().y < this.lastNonBrokenY)
            {
                
                var material = pt.children[0].model.meshInstances[0].material;
                
                
                
                
                
                var colorD      = material.diffuse;
                var colorE      = material.emissive;
                var colorD2     = new pc.Color().fromString("#FF3355");
                var colorE2     = new pc.Color().fromString("#DC0000");
                //var material    = this.ballMaterial;
                EntityTools.setMaterial(pt.children[0], this.failMaterial);

                
                //material = this.failMaterial;
                material = pt.children[0].model.meshInstances[0].material;
                if (1){
                    material.diffuse = colorD;
                    material.emissive = colorE;
                    material.update();
                } {

                this.app
                .tween(colorD)
                .to(colorD2, 0.5, pc.Linear)
                .loop(true)
                .yoyo(true)
                .repeat(2)
                .on('update', function () {
                    material.diffuse = colorD;
                    //material.update();
                })
                .start();

                this.app
                .tween(colorE)
                .to(colorE2, 0.5, pc.Linear)
                .loop(true)
                .yoyo(true)
                .repeat(2)
                .on('update', function () {
                    material.emissive = colorE;
                    material.update();
                })
                .start();

                }
                
                
                
                
                
                
                //EntityTools.setMaterial(pt.children[0], this.failMaterial);
                /*                        
                var color = new pc.Color(0, 0, 0);
                var material = pt.children[0].model.material;
                
                    this.app
                    .tween(color)
                    .to(new pc.Color(1, 0, 0), 1.0, pc.Linear)
                    .loop(false)
                    .yoyo(true)
                    .on('update', function () {
                        material.emissive = color;
                        material.update();
                    })
                    .start();*/
                
                //console.log("2");
                this.gameover("hitblack");
                GameAudio.play("fail");
            }
            return false;
        } else
        {
            this.ball.script.ball.emitDrops(MathUtil.getRandomInt(2));
            
            // break ring
            var prevNB = this.lastNonBroken;
            this.lastNonBroken.breakRing();
            this.lastNonBroken = this.lastNonBroken.underRing;

            this.brokenRings++;
            this.levelProgress      =  this.brokenRings / this.level.ringsCount; 
            Game.instance.app.fire("game:levelprogress", this.levelProgress);

            var bpos = this.ball.getPosition();
            
            var sc = Math.max(Math.round(this.streak),1);
            this.streak+=1;
            
            //this.showText("+" + sc.toString(), bpos.x+1, bpos.y-0.5, this.whiteColor, 1);
            this.addScore(sc);
            
            
            GameAudio.playEx("break", 1+Math.floor(this.streak)/7);
            this.platformsBrokenTotal++;
            

            if (this.lastNonBroken)
            {
                // if next ring exists
                this.lastNonBrokenY = this.lastNonBroken.yPos;
                
                // calc boost
                if (!this.boosting && this.boostInitTime <= 0)
                {
                    this.boostValue += 0.03;
                    if (this.boostValue >= 1)
                    {
                        // INIT BOOST
                        this.slomo          = 0.1;
                        this.boostInitTime  = 1.6;
                        this.ball.script.ball.boostInitEffect.enabled = true;
                        
                        GameAudio.play("boostinit");
                        // BOOST!!!
                        //this.boost();
                    }
                    
                    
                }
                return true;
                
            } else
            {
                // level compl
                this.lastNonBrokenY = this.finish.getLocalPosition().y;// + 0.5 * this.DIST_BETW_RINGS;
                this.levelCompleted();
                
                return false;
            }
        }
        
        //ObjectPool.push(prevNB.entity);
    }
    
    
};


Game.prototype.updateBoosting = function(dt)
{
    if (this.boosting || this.boostInitTime > 0)
    {
        this.whiteFrame.enabled = true;
        if (this.whiteFrame.element.opacity < 1) this.whiteFrame.element.opacity += dt * 3; 
    } else
    {
        if (this.whiteFrame.element.opacity > 0) 
        {
            this.whiteFrame.element.opacity -= dt * 6; 
            if (this.whiteFrame.element.opacity < 0)
                this.whiteFrame.enabled = false;
        }
    }
    
    if (this._state != Game.STATE_INGAME) {this.uiBoost.enabled    = false; return 1;}
    
    if (this.boostInitTime > 0)
    {
        this.boostInitTime -= dt;
        if (this.boostInitTime <= 0)
        {
            this.boostInitTime = -1;
            this.boost();
            this.slomo = 1;
        } else
            return 1;
    }
    
    
    if (this.boosting)
    {
        this.boostValue -= dt * 0.6;
    } else
    {
        this.boostValue -= dt*0.15;
    }
        
    if (this.boostValue <= 0)
    {
        this.boostValue         = Math.max(this.boostValue, -0.3);
        //this.ui
        this.uiBoost.enabled    = false;
        if (this.boosting)
        {
            // STOP BOOSTING
            //this.boosting = false;
            this.stopBoosting();
        }
    } else
    {
        if (!this.uiBoost.enabled)
        if (this.boostValue > 0.1)
        this.uiBoost.enabled    = true;
        
        var bs = this.uiBoost.script.maskedBar;
        bs.setValue(this.boostValue, false);
    }
};

Game.prototype.stopBoosting = function()
{
    
    //FadeScreen.instance.show(0.3, 0, true, null);
    
    this.boosting           = false;
    this.boostValue         = -0.5;
    
    var bscr = this.ball.script.ball;        
    bscr.trail.sprite.color = Game.instance.ballColors[Game.instance.styleID];
    
    EntityTools.setMaterial(this.ball, this.ballMaterials[this.styleID]);
    
};

Game.prototype.boost = function()
{
    
    GameAudio.play("boost");
    this.app.fire("ball:startboost");
    this.boosting           = true;
    this.boostingTime       = 0;
    
    var bscr = this.ball.script.ball;        
    bscr.trail.sprite.color = Game.instance.whiteColor;
    bscr.boostInitEffect.enabled = false;
    
    EntityTools.setMaterial(this.ball, this.boostMaterial);
    
};


Game.prototype.configureRing = function(ringScript, ringTypeID){
    var rs = ringScript;//this.ring.script.ring;
    var rt = Ring.ringTypes[ringTypeID];
    
    rs.configure(rt.jsonModel, rt.partsCount, rt.distance);
};

    
Game.prototype.createRings = function()
{
    //if (!pc) return 1;
    //if (!pc.math) return 1;
    
    var r;
    var pc      = this.ring.script.ring.partsCount;
    var height;//pc.math.random(10, 40);
    
    var type    = MathUtil.choose(0, 1, 2, 3, 4, 5);
    //type = 5;
    var shift   = MathUtil.irr(0, pc-1);
    
    
    /// PREPARE FOR CREATION OF CHOSEN TYPE
    //
    switch(type)
    {
        // no death parts
        case 0:
            height = MathUtil.irr(3,10);
            break;
        
        // only 2 parts free (for pc >= 5)
        case 1:
            height = MathUtil.irr(5,10);
            break;
        
        // only 2 parts free, 1 death part between em (for pc >= 5)
        case 2:
            height = MathUtil.irr(10,20);
            break;
            
        // only 2 parts free, 1 against other (for pc >= 4, even count)
        case 3:
            height = MathUtil.irr(10,20);
            break;
            
        // mostly free, rare random blacks
        case 4:
            height = MathUtil.irr(10,20);
            break;
            
        // odd is black
        case 5:
            height = MathUtil.irr(10,20);
            break;
            
    }
    
    for (var i = 0; i < height; i++)
    {
        
        if (this.levelCreated) return 1;
        
        r = this.createRing();
        
        //setDeathParts(_startPart, _endPart, _chance)
        
        if (type === 0)
        {
            //r.setDeathParts(pc-1, 0, 0.5);
        }
        
        // SET DEATH PARTS
        switch(type)
        {
            // no death parts
            case 0:
                
                break;

            case 1:
                r.setDeathParts(1, pc-2, 1, 0);
                
                break;
                
            case 2:
                // 0, 2 - free, the rest is black
                r.setDeathParts(1+shift, 1, 1, 0);
                r.setDeathParts(3+shift, pc-3, 1, 0);
                
                break;
                
            case 3:
                var pcb = Math.round(pc/2)-1;
                r.setDeathParts(0+shift, pcb, 1, 0);
                r.setDeathParts(Math.round(pc/2)+shift, pcb, 1, 0);
                
                break;
                
            case 4:
                r.setDeathParts(shift, 1, 0.3, 1);
                
                break;
                
            case 5:
                for (var j = 0; j < pc; j += 2)
                r.setDeathParts(j+shift, 1, 0.9, 0);
                
                break;
        }
        
        
    }
    
};

Game.prototype.createRing = function( ){
    
    
    if (this.levelCreated) return 1;
    
    var upperRing   = this.lastRing;
    var startYAngle = 0;
    
    if (!this.lastRing)
    {
        // create first ring, set up everything
        this.lastRingY = 6;
        startYAngle = 0;
    } else
    {
        // get last created ring data
        var ea          = this.lastRing.angle;
        this.lastRingY -= this.DIST_BETW_RINGS;
        startYAngle     = ea + this.ANG_BETW_RINGS;
    }
    
    // INSTANTIATE WITH PARAMS
    //this.lastRing = ObjectPool.pop("Ring");
    this.lastRing = this.ring.clone();
    this.lastRing.setPosition(0,this.lastRingY,0);
    this.lastRing.setLocalEulerAngles(0, startYAngle, 0);
    var sc = Ring.ringTypes[this.level.ringTypeID].scale;
    
    if (this.level.ringScaling)
    {
        this.ringScaleCurr = pc.math.lerp(this.ringScaleCurr, this.ringScaleTarg, 0.2);
        if (Math.abs(this.ringScaleCurr - this.ringScaleTarg) < 0.05)
        if (this.ringScaleTarg < 1) this.ringScaleTarg = pc.math.random(1.2,1.2); else this.ringScaleTarg = pc.math.random(0.8,0.8);

        this.lastRing.setLocalScale(this.ringScaleCurr*sc, 0.75, this.ringScaleCurr*sc);
    } else
    
    this.lastRing.setLocalScale(sc, 0.75, sc);
    
    // SET LASTRING VARIABLE AS RING SCRIPT
    this.lastRing               = this.lastRing.script.ring;
    this.lastRing.yPos          = this.lastRingY;
    this.lastRing.ringTypeID    = this.level.ringTypeID;
    this.lastRing.angleShift    = Ring.ringTypes[this.level.ringTypeID].startAngle;
    //this.lastRing.initialize();
    this.lastRing.angle         = startYAngle;
    // re-set parts array after cloning 
    this.lastRing.parts         = [];
    this.lastRing.partsCount    = Ring.ringTypes[this.level.ringTypeID].partsCount;
    
    for (var i = 0; i < this.lastRing.partsCount; i++)
    {
        //console.log(this.lastRing.entity.children.length);
        this.lastRing.parts[i] = this.lastRing.entity.children[i];
        this.lastRing.parts[i].script.ringPart.localAngle = this.ringScript.entity.children[i].script.ringPart.localAngle;
        this.lastRing.parts[i].death = false;
    }
    
    /////////////////////////////////
    // CREATING LEVEL
                /*if  (this.ringsCreatedCount > 20){
                if (this.ringsCreatedCount < 40)
                this.lastRing.setDeathParts(0,1,1); 
                    else
                    {

                this.lastRing.setDeathParts(0,2,1);
                //rs.setDeathParts(5,7,1);
                    }
                }*/
    /////////////////////////////////
    
    this.lastRing.entity.enabled = true;
    this.lastRing.firstTouch = false;
    
    this.app.root.addChild(this.lastRing.entity);
    
    // set it to upper ring as under ring
    if (upperRing)
    {
        upperRing.underRing = this.lastRing;
    }
    
    // update last nonbroken ring if needed
    if (this.lastNonBroken === null)
    {
        this.lastNonBroken  = this.lastRing;
        this.lastNonBrokenY = this.lastRingY;
    }
    
    this.ringsCreatedCount++;
    if (this.ringsCreatedCount >= this.level.ringsCount)
    {
        this.levelCreated = true;
    }
    
    return this.lastRing;
};

Game.prototype.createCoin = function(x,y,par){
    var c = ObjectPool.pop("coin");
    c.setPosition(x,y,0);
    c.enabled = true;
    c.script.coin.pooling = true;
    par.addChild(c);
    return c;
};

Game.prototype.onCoinCollect = function(x, y)
{
    
    var sc  = Math.round(Game.pointsPerCoin); // score points
    var t   = "+"+sc.toString();
    this.showText(t, x, y + 1, this.coinTextColor, 2, 0.9);
        
    this.addScore(sc); 
    this.addCoins(1);
    
    GameAudio.play("coin");
};

Game.prototype.lerpColor = function(color, targetColor, k)
{
    var lerpColor = new pc.Color( );
    lerpColor.r = pc.math.lerp(color.r, targetColor.r, k);
    lerpColor.b = pc.math.lerp(color.g, targetColor.g, k);
    lerpColor.a = pc.math.lerp(color.b, targetColor.b, k);
    
    return lerpColor;
};



Game.prototype.getBall = function (){
    return this.ball;
};


/// SYSTEM

// screen scaling
Game.prototype.setResolution = function () 
{
    var w = window.innerWidth;
    var h = window.innerHeight;
    var asp = w/h;
    
    // if asp is portrait go fullscreen, fixed otherwise
    if (w < 640) {
        this.app.setCanvasResolution(pc.RESOLUTION_AUTO, w, h);
        this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    }
};



Game.prototype.showText = function (text, x, y, _color, animType, upScale=1) 
{
        var txt = ObjectPool.pop("MsgText", this.app.root);
        txt.setLocalScale(0,0,0);
        
        this.canvas.addChild(txt);
        txt.element.text    = text;
        txt.element.color   = _color;//new pc.Color().fromString(hexColor);
    
        txt.setPosition(x, y, 0);
    
        txt.script.gameText.animate(animType, upScale);
    
    //TextTranslator.translateFont(txt.element, "Seravek.ttf");
    
    return txt.script.gameText;
};

/////////// MAIN FUNCTIONS /////////////////



// Call this to move from MENU to INGAME
Game.prototype.start = function () {
    if (this._state == Game.STATE_INGAME) return 1;
    
    if (this.currScore === 0)
    js_GS_sendScore(0);
    
    this._state = Game.STATE_INGAME;
    this.app.fire("game:start");
    
    this.uiTutorial.enabled = false;
    //this.uiInterface.enabled = true;
    this.uiMainMenu.enabled = false;
    
};


// prepare level for playing
Game.prototype.prepareLevel = function(_platformsCount, _startGameSpeed, _endGameSpeed, _startMovingPlatformChance, 
                                       _endMovingPlatformChance, _maxDistanceBetwPlatfoms)
{
    this.level.platCount = _platformsCount;
    this.level.startSpeed = _startGameSpeed;
    this.level.endSpeed = _endGameSpeed;
    this.level.beginMovings = _startMovingPlatformChance;
    this.level.endMovings = _endMovingPlatformChance;
    this.level.platDist = _maxDistanceBetwPlatfoms;
    
    this.levPlatformsLeft      = this.level.platCount;   // total platforms in level
    this.levPlatformsTotal     = Game.instance.levPlatformsLeft;
};


Game.prototype.createLevel = function(levelID)
{
    //var levelID = 2;
    
    if (levelID == 1) this.prepareLevel(25, 1, 1, 0, 0.1, 1);
    if (levelID == 2) this.prepareLevel(40, 1, 1.1, 0, 0.2, 3);
    if (levelID == 3) this.prepareLevel(50, 1, 1.2, 0.2, 0, 4);
    if (levelID == 4) this.prepareLevel(40, 1, 1.2, 0.3, 0.4, 6);
    if (levelID == 5) this.prepareLevel(55, 1, 1, 0, 0.4, 7);
    if (levelID == 6) this.prepareLevel(45, 1, 1.3, 0, 0.25, 6);
    if (levelID == 7) this.prepareLevel(40, 1, 1.1, 0.2, 0.25, 3);
    if (levelID == 8) this.prepareLevel(50, 1, 1.1, 0.2, 0.1, 6);
    if (levelID == 9) this.prepareLevel(40, 1, 1.25, 0.5, 1, 4);
    if (levelID == 10) this.prepareLevel(60, 1, 1.2, 0, 0.3, 8);
    
    if (this.levelCurrent > 6)
    {
        if (this.BH5Demo)
        {
            this.uiBH5.enabled  = true;
            //this.BH5            = true;
        } else
        {
            this.uiDemo.enabled  = true;
            
        }
            
        this.startOnSwipe   = false;
    }
};




// update code called every frame
Game.prototype.update = function(dt) {
    
    window.scrollTo(0,10);
    this.setResolution();
    
    this.ballPos = this.ball.getLocalPosition();
    
    // streak
    if (this.streak > 0)
    {
        this.streak -= dt*10*this.slomo;
    }
    
    this.updateBoosting(dt);
    this.processLevelCreation();
   /* 
    if (this.app.keyboard.wasPressed(pc.KEY_SPACE))
    {
        this.styleID++;
        if (this.styleID >= 8) this.styleID = 0;
        this.setStyle(this.styleID);
    }
    if (this.app.keyboard.wasPressed(pc.KEY_S))
    {
      Uishop.instance.chooseNextSkin();
    }*/
};


////////////////// SCORING //////////////////

// return the current score
Game.prototype.getScore = function () {
    return this.currScore;
};

// add a value to the score
Game.prototype.addScore = function (v) {
    this.currScore += v;
    this.app.fire("game:scorechanged", this.currScore);
    
    if (this.bestScore < this.currScore){
        this.bestScore = this.currScore;
        this.app.fire("game:newbestscore", this.bestScore);        
    }
    
    js_GS_sendScore(this.currScore);
};

// reset the score
Game.prototype.resetScore = function () {
    this.currScore = 0;
    this.app.fire("game:scorechanged", this.currScore);
};  



var Background=pc.createScript("background");Background.attributes.add("camera",{type:"entity"}),Background.attributes.add("sprite1",{type:"entity"}),Background.attributes.add("sprite2",{type:"entity"}),Background.currID=0,Background.inited=!1,Background.prototype.initialize=function(){this.cam=this.camera.camera,this.spr1=this.sprite1.sprite,this.spr2=this.sprite2.sprite,this.spr1.stop(),this.spr2.stop(),this.changing=!1,this.dist=-1,this.bottomLeft=new pc.Vec3,this.topRight=new pc.Vec3,this.entity.setLocalPosition(0,0,this.dist),this.temp=new pc.Vec3,this.prevID=0,Background.currID=0,this.changeState=0,this.currTime=0,this.changeTime=.5,Background.inited=!0},Background.prototype.onMousePress=function(){var t=Background.currID;4==Background.currID?t=0:t++,this.change(t,1)},Background.prototype.change=function(t,i){Background.inited||this.initialize(),t!=Background.currID&&(this.changeTime=i,this.currTime=0,this.spr1.frame=Background.currID,this.spr1.opacity=1,this.spr2.enabled=!0,this.spr2.opacity=0,this.spr2.frame=t,this.prevID=Background.currID,Background.currID=t,this.changing=!0,this.app.fire("background:changestart",this.entity,Background.currID))},Background.prototype.update=function(t){var i=window.innerWidth,r=window.innerHeight;this.cam.screenToWorld(0,0,this.dist,this.topRight),this.cam.screenToWorld(i,r,this.dist,this.bottomLeft),this.temp.copy(this.bottomLeft),this.temp.sub(this.topRight),this.entity.setLocalScale(.55*this.temp.x,.55*this.temp.y,1),this.changing&&(this.currTime+=t,this.changeState=this.currTime/this.changeTime,this.currTime>=this.changeTime?(this.spr1.frame=Background.currID,this.spr1.opacity=1,this.spr2.opacity=0,this.spr2.enabled=!1,this.changing=!1,this.app.fire("background:changecomplete",this.entity,Background.currID)):this.spr2.opacity=this.changeState)};var Input=pc.createScript("input");Input.prevMouseX=0,Input.prevMouseY=0,Input.mouseDown=!1,Input.mouseDownPrev=!1,Input.mouseX=0,Input.mouseY=0,Input.mousePressed=!1,Input.prototype.postUpdate=function(u){Input.mousePressed=!1},Input.prototype.update=function(u){if(!1===Input.mouseDown&&!0===Input.mouseDownPrev&&(Input.mousePressed=!0,this.app.fire("input:mousepress")),!0===Input.mouseDown&&!0===Input.mouseDownPrev&&(Input.mouseX!=Input.prevMouseX||Input.mouseY!=Input.prevMouseY)){var o=Input.mouseX-Input.prevMouseX,t=Input.mouseY-Input.prevMouseY;this.app.fire("input:mouseswipe",o,t,u)}Input.prevMouseX=Input.mouseX,Input.prevMouseY=Input.mouseY,Input.mouseDownPrev=Input.mouseDown},Input.prototype.initialize=function(){this.app.touch&&(this.app.touch.on(pc.EVENT_TOUCHEND,this._onTouchEnd,this),this.app.touch.on(pc.EVENT_TOUCHSTART,this._onTouchStart,this),this.app.touch.on(pc.EVENT_TOUCHMOVE,this._onTouchMove,this)),this.app.mouse.on(pc.EVENT_MOUSEDOWN,this._onMouseDown,this),this.app.mouse.on(pc.EVENT_MOUSEUP,this._onMouseUp,this),this.app.mouse.on(pc.EVENT_MOUSEMOVE,this._onMouseMove,this)},Input.prototype._onTouchMove=function(u){var o=u.changedTouches[0];u.event.preventDefault(),Input.mouseX=o.x,Input.mouseY=o.y},Input.prototype._onTouchStart=function(u){var o=u.changedTouches[0];u.event.preventDefault(),Input.mouseX=o.x,Input.mouseY=o.y,Input.mouseDown=!0},Input.prototype._onTouchEnd=function(u){var o=u.changedTouches[0];u.event.preventDefault(),Input.mouseX=o.x,Input.mouseY=o.y,Input.mouseDown=!1},Input.prototype._onMouseMove=function(u){Input.mouseX=u.x,Input.mouseY=u.y},Input.prototype._onMouseDown=function(u){Input.mouseX=u.x,Input.mouseY=u.y,Input.mouseDown=!0},Input.prototype._onMouseUp=function(u){Input.mouseX=u.x,Input.mouseY=u.y,Input.mouseDown=!1};var ShopController=pc.createScript("shopController");ShopController.shopItems=[],ShopController.shopItemsCount=0,ShopController.createSkins=function(){ShopController.createSkin("skin2",0,"cube.json",new pc.Vec3(.9,.9,.9),new pc.Vec3(0,-.5,0)),ShopController.createSkin("skin1",100,"sphere.json",new pc.Vec3(.048,.048,.048),new pc.Vec3(0,0,0)),ShopController.createSkin("skin7",500,"figure2.json",new pc.Vec3(.1,.1,.1),new pc.Vec3(0,0,0)),ShopController.createSkin("skin4",500,"cross.json",new pc.Vec3(2,2,1.5),new pc.Vec3(0,0,0)),ShopController.createSkin("skin3",1e3,"cubewithhole.json",new pc.Vec3(1.7,1.7,1.7),new pc.Vec3(0,0,0)),ShopController.createSkin("skin5",1e3,"duck3.json",new pc.Vec3(.048,.048,.048),new pc.Vec3(0,0,0)),ShopController.createSkin("skin6",1e3,"figure1.json",new pc.Vec3(2,2,2),new pc.Vec3(0,0,0))},ShopController.applySkin=function(e,t){var o,n=ShopController.shopItems[t];"sphere"==n.jsonModel?e.model.type="sphere":e.model.asset=ShopController.instance.app.assets.find(n.jsonModel,"model"),e.setLocalScale(n.modelSize,n.modelSize,n.modelSize),o=n.unlocked?Game.instance.ballMaterials[Game.instance.styleID]:Game.instance.lockedMaterial,e.model.meshInstances[0].material=o.resource,e.model.meshInstances[0].material.update(),e.setLocalPosition(n.modelShift.x*n.modelSize.x,n.modelShift.y*n.modelSize.y,n.modelShift.z*n.modelSize.z)},ShopController.createSkin=function(e,t,o,n,s){var l={name:e,price:t,jsonModel:o,modelSize:n,modelShift:s,unlocked:!1};0===l.price&&(l.unlocked=!0),ShopController.shopItems.push(l),ShopController.shopItemsCount++},ShopController.attributes.add("unlock",{type:"entity"}),ShopController.attributes.add("choose",{type:"entity"}),ShopController.attributes.add("priceText",{type:"entity"}),ShopController.attributes.add("pricePanel",{type:"entity"}),ShopController.attributes.add("modelEntity",{type:"entity"}),ShopController.attributes.add("arrowLeft",{type:"entity"}),ShopController.attributes.add("arrowRight",{type:"entity"}),ShopController.instance=null,ShopController.prototype.initialize=function(){ShopController.instance=this,this.shownItemId=0,ShopController.applySkin(Game.instance.ballModel,Game.instance.chosenSkinId),this.entity.enabled=!1,this.on("enable",this.onEnable,this)},ShopController.prototype.placeDemostrator=function(){var e=Game.instance.camera.forward;e.scale(12),e.add(Game.instance.camera.getPosition()),e.y+=1;var t=ShopController.shopItems[this.shownItemId];e.add(new pc.Vec3(t.modelShift.x*t.modelSize.x,t.modelShift.y*t.modelSize.y,t.modelShift.z*t.modelSize.z)),this.modelEntity.setPosition(e)},ShopController.prototype.onEnable=function(){this.modelEntity.enabled=!0,this.showItem(Game.instance.chosenSkinId),Game.instance.startOnSwipe=!1},ShopController.prototype.showItem=function(e){this.shownItemId=e;var t=ShopController.shopItems[this.shownItemId];ShopController.applySkin(this.modelEntity,this.shownItemId),this.placeDemostrator(),!0===t.unlocked?(this.pricePanel.enabled=!1,this.choose.enabled=!0,this.unlock.enabled=!1):(this.priceText.element.text=t.price.toString(),this.pricePanel.enabled=!0,this.choose.enabled=!1,this.unlock.enabled=!0,Game.instance.coins>=t.price?this.unlock.button.active=!0:this.unlock.button.active=!1),this.updateArrows()},ShopController.prototype.itemsAvailable=function(){for(var e=0;e<ShopController.shopItems.length;e++)if(!ShopController.shopItems[e].unlocked&&ShopController.shopItems[e].price<=Game.instance.coins)return!0;return!1},ShopController.prototype.buyItem=function(e){var t,o=ShopController.shopItems[e];!0===o.unlocked||Game.instance.wasteCoins(o.price)&&(FadeScreen.instance.show(.3,0,!0,null),o.unlocked=!0,Game.instance.chosenSkinId=this.shownItemId,t=Game.instance.ballMaterials[Game.instance.styleID],this.modelEntity.model.meshInstances[0].material=t.resource,this.modelEntity.model.meshInstances[0].material.update(),Game.instance.chosenSkinId=e,this.onEnable(),console.log("shop : skin purchased ",o.name))},ShopController.prototype.closeShop=function(){this.modelEntity.enabled=!1,FadeScreen.instance.show(.5,0,!0,function(){Game.instance.uiShop.enabled=!1,Game.instance.startOnSwipe=!0,Game.instance._state==Game.STATE_LEVELCOMPLETED?this.app.fire("game:makereset",!1):this.app.fire("game:makereset",!0)})},ShopController.prototype.switchItem=function(e){this.shownItemId+=e,this.shownItemId>=ShopController.shopItemsCount-1?this.shownItemId=ShopController.shopItemsCount-1:this.shownItemId<0&&(this.shownItemId=0),this.showItem(this.shownItemId)},ShopController.prototype.updateArrows=function(e){this.arrowLeft.enabled=!0,this.arrowRight.enabled=!0,this.shownItemId>=ShopController.shopItemsCount-1&&(this.arrowRight.enabled=!1),this.shownItemId<=0&&(this.arrowLeft.enabled=!1)};var Ball=pc.createScript("ball");Ball.attributes.add("jumpForce",{type:"number",default:5}),Ball.attributes.add("ballSize",{type:"number",default:.8}),Ball.attributes.add("jumpSpeed",{type:"number",default:.8}),Ball.attributes.add("bounceKoef",{type:"number",default:.8}),Ball.attributes.add("trail",{type:"entity"}),Ball.attributes.add("boostInitEffect",{type:"entity"}),Ball.attributes.add("modelEntity",{type:"entity"}),Ball.attributes.add("moveDownSpeed",{type:"number",default:.5}),Ball.attributes.add("boostSpeed",{type:"number",default:.5}),Ball.tmp=new pc.Vec3,Ball.prototype.initialize=function(){this.jumpCD=.1,this.entity.setLocalScale(this.ballSize,this.ballSize,this.ballSize),this.scaleZ=1,this.scaleZVel=-1,this.gravity=-70,this._vel=new pc.Vec3(0,0,0),this._acc=new pc.Vec3(0,this.gravity,0),this.rotSpeed=new pc.Vec3(0,0,0),this.moveSpeedX=0,this.tryBreak=!1,this.app.on("game:stylechange",this.onStyleChange,this),this.onEnable(),this.on("enable",this.onEnable,this)},Ball.prototype.onStyleChange=function(){this.onEnable()},Ball.prototype.onEnable=function(){this.trailLeng=0,this.trail.sprite.color=Game.instance.ballColors[Game.instance.styleID]},Ball.prototype.postUpdate2=function(t){},Ball.delayToControl=1,Ball.prototype.postUpdate3=function(t){if((Input.mouseDown||Game.instance.boosting)&&Game.instance.boostInitTime<=0){if(Game.instance._state==Game.STATE_INGAME){if(Ball.delayToControl>0)return 0;this.tryBreak||Game.instance.boosting||this.app.fire("ball:startmove"),this.tryBreak=!0}else if(Game.instance._state==Game.STATE_INTRO){if(Ball.delayToControl>0)return 0;if(Game.instance.startGameButtonEnabled&&Input.mouseY/window.innerHeight>.4){if(Uishop.instance.enabled)return 1;Game.instance.start(),this.tryBreak||this.app.fire("ball:startmove")}}}else Game.instance._state==Game.STATE_INGAME&&this.tryBreak&&this.app.fire("ball:stopmove"),this.tryBreak=!1},Ball.prototype.update=function(t){Ball.delayToControl>0&&(Ball.delayToControl-=t),this.postUpdate3(t),this.scaleZVel+=(1-this.scaleZ)*t,this.scaleZVel+=.5*t,this.scaleZ+=this.scaleZVel,this.scaleZVel*=1-5*t,this.scaleZ=pc.math.clamp(this.scaleZ,.7,1.05);var e=1/this.scaleZ;e=pc.math.clamp(e,.6,1.4),this.entity.setLocalScale(this.ballSize*e,this.ballSize*this.scaleZ,this.ballSize*e);this.entity.getLocalPosition();this.jumpCD>0&&(this.jumpCD-=t);for(var a,i,s=1,l=t/s,n=Ball.tmp,o=!0;s>0;)if(s--,a=this.entity.getLocalPosition(),this.tryBreak&&Ball.delayToControl<=0){var r;for(r=Game.instance.boosting?-pc.math.lerp(.5*this.moveDownSpeed,this.boostSpeed,Game.instance.boostValue):-this.moveDownSpeed,this._vel.set(0,r,0),this._vel.scale(l*Game.instance.slomo),a.add(this._vel),this.entity.setLocalPosition(a);o&&a.y-.5*this.ballSize<Game.instance.lastNonBrokenY+.5*Game.instance.RING_SIZE_Y;)o=Game.instance.tryBrokeRing()}else{if(o=!1,n.copy(this._acc).scale(l*this.jumpSpeed*Game.instance.slomo),this._vel.add(n),n.copy(this._vel).scale(l*this.jumpSpeed*Game.instance.slomo),a.add(Ball.tmp),this.jumpCD<=0&&this._vel.y<0&&a.y-.5*this.ballSize<=Game.instance.lastNonBrokenY+.5*Game.instance.RING_SIZE_Y){if(Game.instance.lastNonBroken){var c=Game.instance.lastNonBroken.partUnderAngle(90).script.ringPart;if(!(i=Game.instance.lastNonBroken).firstTouch&&(i.firstTouch=!0,c.death)){var h=i.entity.getLocalScale();i.entity.tween(h).to(new pc.Vec3(1.2*h.x,1.2*h.y,1.2*h.z),.15,pc.CubicInOut).loop(!0).yoyo(!0).repeat(2).start()}}a.y=Game.instance.lastNonBrokenY+.5*Game.instance.RING_SIZE_Y+.5*this.ballSize,this.entity.setLocalPosition(a),this.jump();break}this.entity.setLocalPosition(a)}this.tryBreak?Game.instance.boosting?this.trailLeng=pc.math.lerp(1.75*this.trailLeng,.65,5*t):this.trailLeng=pc.math.lerp(this.trailLeng,.65,5*t):this.trailLeng=pc.math.lerp(this.trailLeng,-this._vel.y/30,10*t),this.trailLeng=pc.math.clamp(this.trailLeng,-1,1),this.trail.setLocalScale(this.trailLeng,.38,3),this.rotSpeed.scale(1-3*t),this.modelEntity.rotateLocal(this.rotSpeed.x*t,this.rotSpeed.y*t,this.rotSpeed.z*t)},Ball.prototype.break=function(){for(var t=this.entity.getPosition(),e=0;e<10;e++)Effect3ddrop.create(t,pc.math.random(.2,.45),new pc.Vec3(pc.math.random(-3,3),pc.math.random(4,10),pc.math.random(-3,3)));this.entity.enabled=!1,this.tryBreak=!1},Ball.prototype.jump=function(){this.jumpCD>0||(this._vel.set(0,this.jumpForce,0),this.jumpCD=.1,this.scaleZ=1,this.scaleZVel=-.1*this.bounceKoef,GameAudio.play("jump"),this.rotSpeed.set(pc.math.random(-600,600),pc.math.random(-600,600),pc.math.random(-600,600)))},Ball.prototype.emitDrops=function(t){if(t<=0)return 1;for(var e=this.entity.getPosition(),a=0;a<t;a++)Effect3ddrop.create(e,pc.math.random(.2,.35),new pc.Vec3(pc.math.random(-1,1),pc.math.random(2,4),pc.math.random(-1,1)))};var Platform=pc.createScript("platform");Platform.attributes.add("camera",{type:"entity"}),Platform.prototype.initialize=function(){this.game=this.app.root.findByName("Game").script.game,this.platformModel=this.entity.findByName("platformModel"),this.centerButton=this.entity.findByName("CenterButton"),this.centerButtonMat=this.centerButton.model.meshInstances[0].material,this.circleEffect=this.entity.findByName("CircleEff").script.circleEffect,this.finishPlatform=!1,this.affectSize=!0,this.centerButton.enabled=!0,this.entity.tweenMove&&this.entity.tweenMove.stop(),this.tweenScale&&this.tweenScale.stop(),this.left=0,this.right=0,this.top=0,this.bottom=0,this.x=0,this.y=0,this.ySize=.7,this.zSize=1,this.xSize=3,this.platformID=0,this.platformModel.setLocalScale(2*this.xSize,this.ySize,2*this.xSize),this.updateBorders(),this.destroyCd=1,this.lives=3,this.circleAnimState=0,this.entity!=this.game.platform&&Math.random()>.9&&(this.coin=this.game.createCoin(0,4.1,this.entity),this.coin.script.coin.platform=this)},Platform.prototype.updateEffects=function(t){},Platform.prototype.affect=function(){this.entity!=this.game.platform&&(this.centerButton.enabled=!1,this.affectSize&&(this.lives--,this.xSize=2*this.lives,this.tweenScale&&this.tweenScale.stop(),this.tweenScale=this.platformModel.tween(this.platformModel.getLocalScale()).to(new pc.Vec3(this.xSize,this.ySize,this.xSize),.5,pc.ElasticOut).loop(!1).yoyo(!1),this.tweenScale.start()))},Platform.prototype.updateBorders=function(){var t=this.platformModel.getPosition(),e=this.platformModel.getLocalScale();e.x<.05&&0===this.lives?this.cachePlatform():(this.x=t.x,this.y=t.y,this.left=t.x-(.5*e.x-.6),this.right=t.x+(.5*e.x-.6),this.top=t.y+.5*e.y,this.bottom=t.y-.5*e.y)},Platform.prototype.cachePlatform=function(){this.tweenScale&&this.tweenScale.stop(),this.entity.tweenMove&&this.entity.tweenMove.stop(),this.coin&&this.coin.script.coin.cacheCoin(),ObjectPool.push(this.entity)},Platform.prototype.update=function(t){this.updateBorders(),this.entity!=this.game.platform&&(this.updateEffects(t),this.destroyCd>0?this.destroyCd-=t:this.entity.getLocalPosition().y<this.camera.getLocalPosition().y-37&&this.cachePlatform())};pc.extend(pc,function(){var t=function(t){this._app=t,this._tweens=[],this._add=[]};t.prototype={add:function(t){return this._add.push(t),t},update:function(t){for(var i=0,e=this._tweens.length;i<e;)this._tweens[i].update(t)?i++:(this._tweens.splice(i,1),e--);this._add.length&&(this._tweens=this._tweens.concat(this._add),this._add.length=0)}};var i=function(t,i,e){pc.events.attach(this),this.manager=i,e&&(this.entity=null),this.time=0,this.complete=!1,this.playing=!1,this.stopped=!0,this.pending=!1,this.target=t,this.duration=0,this._currentDelay=0,this.timeScale=1,this._reverse=!1,this._delay=0,this._yoyo=!1,this._count=0,this._numRepeats=0,this._repeatDelay=0,this._from=!1,this._slerp=!1,this._fromQuat=new pc.Quat,this._toQuat=new pc.Quat,this._quat=new pc.Quat,this.easing=pc.EASE_LINEAR,this._sv={},this._ev={}},e=function(t){var i;return t instanceof pc.Vec2?i={x:t.x,y:t.y}:t instanceof pc.Vec3?i={x:t.x,y:t.y,z:t.z}:t instanceof pc.Vec4?i={x:t.x,y:t.y,z:t.z,w:t.w}:t instanceof pc.Quat?i={x:t.x,y:t.y,z:t.z,w:t.w}:t instanceof pc.Color?(i={r:t.r,g:t.g,b:t.b},void 0!==t.a&&(i.a=t.a)):i=t,i};i.prototype={to:function(t,i,n,s,r,h){return this._properties=e(t),this.duration=i,n&&(this.easing=n),s&&this.delay(s),r&&this.repeat(r),h&&this.yoyo(h),this},from:function(t,i,n,s,r,h){return this._properties=e(t),this.duration=i,n&&(this.easing=n),s&&this.delay(s),r&&this.repeat(r),h&&this.yoyo(h),this._from=!0,this},rotate:function(t,i,n,s,r,h){return this._properties=e(t),this.duration=i,n&&(this.easing=n),s&&this.delay(s),r&&this.repeat(r),h&&this.yoyo(h),this._slerp=!0,this},start:function(){var t,i,e,n;if(this.playing=!0,this.complete=!1,this.stopped=!1,this._count=0,this.pending=this._delay>0,this._reverse&&!this.pending?this.time=this.duration:this.time=0,this._from){for(t in this._properties)this._properties.hasOwnProperty(t)&&(this._sv[t]=this._properties[t],this._ev[t]=this.target[t]);this._slerp&&(this._toQuat.setFromEulerAngles(this.target.x,this.target.y,this.target.z),i=void 0!==this._properties.x?this._properties.x:this.target.x,e=void 0!==this._properties.y?this._properties.y:this.target.y,n=void 0!==this._properties.z?this._properties.z:this.target.z,this._fromQuat.setFromEulerAngles(i,e,n))}else{for(t in this._properties)this._properties.hasOwnProperty(t)&&(this._sv[t]=this.target[t],this._ev[t]=this._properties[t]);this._slerp&&(this._fromQuat.setFromEulerAngles(this.target.x,this.target.y,this.target.z),i=void 0!==this._properties.x?this._properties.x:this.target.x,e=void 0!==this._properties.y?this._properties.y:this.target.y,n=void 0!==this._properties.z?this._properties.z:this.target.z,this._toQuat.setFromEulerAngles(i,e,n))}return this._currentDelay=this._delay,this.manager.add(this),this},pause:function(){this.playing=!1},resume:function(){this.playing=!0},stop:function(){this.playing=!1,this.stopped=!0},delay:function(t){return this._delay=t,this.pending=!0,this},repeat:function(t,i){return this._count=0,this._numRepeats=t,this._repeatDelay=i||0,this},loop:function(t){return t?(this._count=0,this._numRepeats=1/0):this._numRepeats=0,this},yoyo:function(t){return this._yoyo=t,this},reverse:function(){return this._reverse=!this._reverse,this},chain:function(){for(var t=arguments.length;t--;)t>0?arguments[t-1]._chained=arguments[t]:this._chained=arguments[t];return this},update:function(t){if(this.stopped)return!1;if(!this.playing)return!0;if(!this._reverse||this.pending?this.time+=t*this.timeScale:this.time-=t*this.timeScale,this.pending){if(!(this.time>this._currentDelay))return!0;this._reverse?this.time=this.duration-(this.time-this._currentDelay):this.time=this.time-this._currentDelay,this.pending=!1}var i=0;(!this._reverse&&this.time>this.duration||this._reverse&&this.time<0)&&(this._count++,this.complete=!0,this.playing=!1,this._reverse?(i=this.duration-this.time,this.time=0):(i=this.time-this.duration,this.time=this.duration));var e,n,s=this.time/this.duration,r=this.easing(s);for(var h in this._properties)this._properties.hasOwnProperty(h)&&(e=this._sv[h],n=this._ev[h],this.target[h]=e+(n-e)*r);if(this._slerp&&this._quat.slerp(this._fromQuat,this._toQuat,r),this.entity&&(this.entity._dirtifyLocal(),this.element&&this.entity.element&&(this.entity.element[this.element]=this.target),this._slerp&&this.entity.setLocalRotation(this._quat)),this.fire("update",t),this.complete){var a=this._repeat(i);return a?this.fire("loop"):(this.fire("complete",i),this._chained&&this._chained.start()),a}return!0},_repeat:function(t){if(this._count<this._numRepeats){if(this._reverse?this.time=this.duration-t:this.time=t,this.complete=!1,this.playing=!0,this._currentDelay=this._repeatDelay,this.pending=!0,this._yoyo){for(var i in this._properties)tmp=this._sv[i],this._sv[i]=this._ev[i],this._ev[i]=tmp;this._slerp&&(this._quat.copy(this._fromQuat),this._fromQuat.copy(this._toQuat),this._toQuat.copy(this._quat))}return!0}return!1}};var n=function(t){return 1-s(1-t)},s=function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375};return{TweenManager:t,Tween:i,Linear:function(t){return t},QuadraticIn:function(t){return t*t},QuadraticOut:function(t){return t*(2-t)},QuadraticInOut:function(t){return(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1)},CubicIn:function(t){return t*t*t},CubicOut:function(t){return--t*t*t+1},CubicInOut:function(t){return(t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2)},QuarticIn:function(t){return t*t*t*t},QuarticOut:function(t){return 1- --t*t*t*t},QuarticInOut:function(t){return(t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2)},QuinticIn:function(t){return t*t*t*t*t},QuinticOut:function(t){return--t*t*t*t*t+1},QuinticInOut:function(t){return(t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)},SineIn:function(t){return 0===t?0:1===t?1:1-Math.cos(t*Math.PI/2)},SineOut:function(t){return 0===t?0:1===t?1:Math.sin(t*Math.PI/2)},SineInOut:function(t){return 0===t?0:1===t?1:.5*(1-Math.cos(Math.PI*t))},ExponentialIn:function(t){return 0===t?0:Math.pow(1024,t-1)},ExponentialOut:function(t){return 1===t?1:1-Math.pow(2,-10*t)},ExponentialInOut:function(t){return 0===t?0:1===t?1:(t*=2)<1?.5*Math.pow(1024,t-1):.5*(2-Math.pow(2,-10*(t-1)))},CircularIn:function(t){return 1-Math.sqrt(1-t*t)},CircularOut:function(t){return Math.sqrt(1- --t*t)},CircularInOut:function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},BackIn:function(t){return t*t*(2.70158*t-1.70158)},BackOut:function(t){return--t*t*(2.70158*t+1.70158)+1},BackInOut:function(t){var i=2.5949095;return(t*=2)<1?t*t*((i+1)*t-i)*.5:.5*((t-=2)*t*((i+1)*t+i)+2)},BounceIn:n,BounceOut:s,BounceInOut:function(t){return t<.5?.5*n(2*t):.5*s(2*t-1)+.5},ElasticIn:function(t){var i,e=.1;return 0===t?0:1===t?1:(!e||e<1?(e=1,i=.1):i=.4*Math.asin(1/e)/(2*Math.PI),-e*Math.pow(2,10*(t-=1))*Math.sin((t-i)*(2*Math.PI)/.4))},ElasticOut:function(t){var i,e=.1;return 0===t?0:1===t?1:(!e||e<1?(e=1,i=.1):i=.4*Math.asin(1/e)/(2*Math.PI),e*Math.pow(2,-10*t)*Math.sin((t-i)*(2*Math.PI)/.4)+1)},ElasticInOut:function(t){var i,e=.1;return 0===t?0:1===t?1:(!e||e<1?(e=1,i=.1):i=.4*Math.asin(1/e)/(2*Math.PI),(t*=2)<1?e*Math.pow(2,10*(t-=1))*Math.sin((t-i)*(2*Math.PI)/.4)*-.5:e*Math.pow(2,-10*(t-=1))*Math.sin((t-i)*(2*Math.PI)/.4)*.5+1)}}}()),function(){pc.Application.prototype.addTweenManager=function(){this._tweenManager=new pc.TweenManager(this),this.on("update",function(t){this._tweenManager.update(t)})},pc.Application.prototype.tween=function(t){return new pc.Tween(t,this._tweenManager)},pc.Entity.prototype.tween=function(t,i){var e=this._app.tween(t);return e.entity=this,this.on("destroy",function(){e.stop()}),i&&i.element&&(e.element=i.element),e};var t=pc.Application.getApplication();t&&t.addTweenManager()}();var CircleEffect=pc.createScript("circleEffect");CircleEffect.prototype.initialize=function(){this.circleAlphaState=0,this.s=this.entity.sprite,this.opacityPause=0},CircleEffect.prototype.update=function(t){this.opacityPause>0?this.opacityPause-=t:0!==this.circleAlphaState&&(this.s.opacity+=t*this.circleAlphaState*6,this.s.opacity>1&&this.circleAlphaState>0&&(this.opacityPause=.3,this.s.opacity=1,this.circleAlphaState=-1),this.s.opacity<.05&&this.circleAlphaState<0&&(this.s.opacity=0,this.circleAlphaState=0,this.entity.enabled=!1))},CircleEffect.prototype.play=function(t,i,e,c){var a=this.entity.clone();this.entity.parent.addChild(a);var s=(new pc.Vec3).copy(a.getLocalScale()).scale(i);1!=i&&a.tween(a.getLocalScale()).to(s,2,pc.SineOut).delay(c).loop(!1).yoyo(!1).start(),(a=a.script.circleEffect).s.opacity=t,a.circleAlphaState=e};var ScoreCounter=pc.createScript("scoreCounter");ScoreCounter.prototype.initialize=function(){this.nowScore=0,this.Score=0,this.text=this.entity.element,this.app.on("game:score",this.onScoreChange,this),this.app.on("game:reset",this.onScoreReset,this)},ScoreCounter.prototype.onScoreChange=function(t){this.Score=t},ScoreCounter.prototype.onScoreReset=function(){this.Score=0,this.nowScore=0,this.text.text=this.nowScore.toString()},ScoreCounter.prototype.update=function(t){this.nowScore<this.Score&&(this.nowScore=pc.math.lerp(this.nowScore,this.Score,5*t)),this.text.text=Math.round(this.nowScore).toString()};var FingerAnim=pc.createScript("fingerAnim");FingerAnim.prototype.initialize=function(){var t=(new pc.Vec3).copy(this.entity.getLocalPosition());t.x=130,this.entity.tweenMove=this.entity.tween(this.entity.getLocalPosition()).to(t,.7,pc.QuadraticInOut).loop(!0).yoyo(!0).start()},FingerAnim.prototype.update=function(t){};var Coin=pc.createScript("coin");Coin.prototype.initialize=function(){this.player=this.app.root.findByName("Player"),this.camera=this.app.root.findByName("Camera"),this.coinModel=this.entity.findByName("CoinModel"),this.Glow=this.entity.findByName("Glow"),this.pooling=!1,this.platform=null,this.onEnable(),this.on("enable",this.onEnable,this)},Coin.prototype.onEnable=function(){this.coinModel.setLocalEulerAngles(90,0,17)},Coin.prototype.cacheCoin=function(){this.platform&&(this.platform.coin=null,ObjectPool.push(this.entity))},Coin.prototype.update=function(i){if(!1!==this.entity.enabled){if(this.coinModel&&this.coinModel.rotate(0,180*i,0),this.pooling){var t=this.camera.getPosition();this.entity.getPosition().y<t.y-40&&this.cacheCoin()}var o=(new pc.Vec3).copy(this.player.getPosition());if(o.sub(this.coinModel.getPosition()),o.length()<2){var e=ObjectPool.pop("CoinEffect");this.app.root.addChild(e),e.setPosition((new pc.Vec3).copy(this.coinModel.getPosition())),e.script.collectEffect.play(),this.entity.enabled=!1,this.app.fire("game:coincollect",this.coinModel.getPosition().x,this.coinModel.getPosition().y),this.pooling&&this.cacheCoin()}}};var CollectEffect=pc.createScript("collectEffect");CollectEffect.prototype.initialize=function(){this.s=this.entity.sprite},CollectEffect.prototype.play=function(){this.s=this.entity.sprite,this.entity.enabled=!0,this.s.opacity=.7,this.entity.setLocalScale(0,0,0),this.entity.tween(this.entity.getLocalScale()).to(new pc.Vec3(2.1,2.1,2.1),.3,pc.Linear).loop(!1).yoyo(!1).start()},CollectEffect.prototype.update=function(t){this.s.opacity-=1.5*t,this.s.opacity<=0&&ObjectPool.push(this.entity)};// GameText.js
var GameText = pc.createScript('gameText');

// initialize code called once per entity
GameText.prototype.initialize = function() {
    this.hideDelay      = 1;
    this.fadeOpacity    = false;
};

GameText.prototype.animate = function(_hideAnimType, upScale=1)
{
    this.hideAnimType   = _hideAnimType; // hiding animation : 1 - scale to zero; 2 - fade opacity
    
    this.showTime               = 0.15; // сколько будет виден чистый текст
    this.appearTime             = 0.2;  // время появления
    this.hideTime               = 0.2;  // время скрытия
    
    this.hideDelay              = this.appearTime + this.showTime; // задержка до сокрытия
    this.fadeOpacity            = false;
    this.entity.element.opacity = 1;
    
    //this.rotTarg = pc.math.random(-200,200);
    
    //this.entity.setLocalScale(1,1,1);
    //
    if (this.hideAnimType == 3)
    this.entity
        .tween(this.entity.getLocalRotation())
        .to(new pc.Vec3(0, 0, pc.math.random(-0.1, 0.1)), this.appearTime, pc.BackOut)
        .loop(false)
        .yoyo(false)
        .start(); else
    this.entity.setLocalRotation(0,0,0,1);

    this.entity
        .tween(this.entity.getLocalScale())
        .to(new pc.Vec3(1*upScale, 1*upScale, 1*upScale), this.appearTime, pc.BackOut)
        .loop(false)
        .yoyo(false).start();
        
    //if (_hideAnimType === 1)

};

// update code called every frame
GameText.prototype.update = function(dt) {
    //this.entity.rotateLocal(0,0,60*dt);
    //console.log(this.entity.getLocalRotation().z);
    //var pz = pc.math.lerp( this.entity.getRotation().z, this.rotTarg, dt*5);
    //this.entity.setLocalRotation(new pc.Vec3(0,0,0));
    
    // HIDING
    if (this.fadeOpacity){
        this.entity.element.opacity -= dt/this.hideTime;
        if (this.entity.element.opacity <= 0) ObjectPool.push(this.entity);
        this.entity.translate(0, dt * 5, 0);
    }
    
    if (this.hideDelay > 0) {
        this.hideDelay -= dt;
        if (this.hideDelay <= 0){
            // hide text animation
            if (this.hideAnimType == 1 || this.hideAnimType == 3)
            {
                // 1 -- SCALE TO ZERO
                var t = this.entity
                    .tween(this.entity.getLocalScale())
                    .to(new pc.Vec3(0, 0, 0), this.hideTime, pc.BackIn)
                    .loop(false)
                    .yoyo(false).on('complete', function () {
                    ObjectPool.push(this.entity);
                });
                
    if (this.hideAnimType === 3)
            this.entity
                .tween(this.entity.getLocalRotation())
                .to(new pc.Vec3(0, 0, 0), this.hideTime, pc.BackIn)
                .loop(false)
                .yoyo(false)
                .start();
                
                
                t.start();
            } else
            if (this.hideAnimType == 2)
            {
                this.fadeOpacity = true;
            }
                
        }
    }
};


var TrailCircle=pc.createScript("trailCircle");TrailCircle.prototype.initialize=function(){this.hideTime=.25,this.size=.4},TrailCircle.prototype.play=function(){this.entity.sprite.opacity=1,this.size=.4,this.entity.setLocalScale(this.size,this.size,this.size)},TrailCircle.prototype.update=function(i){this.size>=0&&(this.size-=i/this.hideTime*.5,this.size<=0)?ObjectPool.push(this.entity):(this.entity.setLocalScale(this.size,this.size,this.size),this.entity.sprite.opacity-=i/this.hideTime,this.entity.sprite.opacity<=0&&ObjectPool.push(this.entity))};var StarEffect=pc.createScript("starEffect");StarEffect.tmp=new pc.Vec3(0,0,0),StarEffect.prototype.initialize=function(){this._vel=new pc.Vec3(0,0,0),this._acc=new pc.Vec3(0,-40,0),this.rotSpeed=0},StarEffect.prototype.play=function(t,e,i,c){this.size=1,this._vel.x=i,this._vel.y=c,this.entity.setPosition(t,e,0),this.entity.setLocalScale(this.size,this.size,this.size),this.entity.tween(this.entity.getLocalScale()).to(new pc.Vec3(0,0,0),1.2,pc.SineOut).loop(!1).yoyo(!1).on("complete",function(){ObjectPool.push(this.entity)}).start(),this.rotSpeed=pc.math.random(-90,90)},StarEffect.prototype.update=function(t){var e;this.entity.rotateLocal(0,0,t*this.rotSpeed),e=this.entity.getPosition(),StarEffect.tmp.copy(this._acc).scale(t),this._vel.add(StarEffect.tmp),StarEffect.tmp.copy(this._vel).scale(t),e.add(StarEffect.tmp),this.entity.setPosition(e)};var FlyBonus=pc.createScript("flyBonus");FlyBonus.prototype.initialize=function(){this.player=this.app.root.findByName("Player"),this.camera=this.app.root.findByName("Camera"),this.s=this.entity.sprite},FlyBonus.prototype.update=function(t){var i=this.camera.getPosition();if(this.entity.getPosition().y<i.y-30)ObjectPool.push(this.entity);else if(Game.instance._state==Game.STATE_INGAME){var e=(new pc.Vec3).copy(this.player.getPosition());e.sub(this.entity.getPosition()),e.length()<2&&(this.entity.destroy(),Game.flyBonus=!0,this.app.fire("game:flybonus"),GameAudio.play("flybonus"))}};var InterfaceController=pc.createScript("interfaceController");InterfaceController.attributes.add("scoreField",{type:"entity"}),InterfaceController.attributes.add("levelBar",{type:"entity"}),InterfaceController.prototype.initialize=function(){this.targScore=0,this.showScore=0,this.app.on("game:scorechanged",this.onScoreUpdate,this),this.app.on("game:stylechange",this.onStyleChange,this),this.onEnable(),this.on("enable",this.onEnable,this)},InterfaceController.prototype.onStyleChange=function(){},InterfaceController.prototype.onEnable=function(){this.targScore=Game.instance.currScore,this.showScore=this.targScore,this.scoreField.element.text=this.showScore.toString(),this.onStyleChange()},InterfaceController.prototype.onScoreUpdate=function(t){this.targScore=t,0===this.targScore&&(this.showScore=0,this.scoreField.element.text=t.toString())},InterfaceController.prototype.update=function(t){this.targScore>this.showScore&&(this.showScore=pc.math.lerp(this.showScore,this.targScore,.5),this.showScore=Math.round(this.showScore),this.scoreField.element.text=this.showScore.toString())};var LevelBar=pc.createScript("levelBar");LevelBar.attributes.add("Dimension",{type:"number",enum:[{Up:1}],default:1}),LevelBar.attributes.add("levelCurr",{type:"entity"}),LevelBar.attributes.add("levelNext",{type:"entity"}),LevelBar.attributes.add("barMask",{type:"entity"}),LevelBar.attributes.add("barImage",{type:"entity"}),LevelBar.attributes.add("barBg",{type:"entity"}),LevelBar.prototype.initialize=function(){this.currText=this.levelCurr.findByName("Text").element,this.nextText=this.levelNext.findByName("Text").element,this.sizeX=336,this.sizeY=93,this.barColor=(new pc.Color).fromString("#FF5922"),this.currProgress=0,this.progress=0,this.app.on("game:levelprogress",this.setProgress,this),this.app.on("game:stylechange",this.onStyleChange,this),this.onEnable(),this.on("enable",this.onEnable,this)},LevelBar.prototype.onStyleChange=function(){this.onEnable()},LevelBar.prototype.onEnable=function(){this.setLevel(Game.instance.levelCurrent,Game.instance.platColors[Game.instance.styleID]),this.currProgress=0,this.progress=0},LevelBar.prototype.update=function(e){this.currProgress<this.progress?this.currProgress+=.4*e:this.currProgress>this.progress&&(this.currProgress-=.4*e),this.updateBarSize()},LevelBar.prototype.setProgress=function(e){this.progress=e},LevelBar.prototype.updateBarSize=function(){var e=this.barBg.getPosition();if(this.currProgress<=0)this.barMask.element.width=0;else{var t=Math.round(this.sizeY+(this.sizeX-this.sizeY)*this.currProgress);t>this.barMask.element.width&&(this.barMask.element.width=t)}this.barImage.setPosition(e)},LevelBar.prototype.setLevel=function(e,t){this.currText.text=e.toString(),this.nextText.text=(e+1).toString(),this.barImage.element.color=t,this.levelCurr.element.color=this.barImage.element.color};var FullscreenImage=pc.createScript("fullscreenImage");FullscreenImage.getScreenComponentIteration=0,FullscreenImage.getScreenComponent=function(e){return FullscreenImage.getScreenComponentIteration++,FullscreenImage.getScreenComponentIteration>10?null:e.screen?e.screen:FullscreenImage.getScreenComponent(e.parent)},FullscreenImage.prototype.initialize=function(){FullscreenImage.getScreenComponentIteration=0,this.screenComponent=FullscreenImage.getScreenComponent(this.entity),this.updateSize(),window.addEventListener("resize",this.updateSize.bind(this))},FullscreenImage.prototype.updateSize=function(){var e=this.screenComponent.referenceResolution,n=this.screenComponent.scaleBlend,t=window.innerWidth,r=window.innerHeight;this.entity.element.width=pc.math.lerp(e.x,t/r*e.y,n),this.entity.element.height=pc.math.lerp(e.x*r/t,e.y,n)},FullscreenImage.prototype.update=function(e){};var MyButton=pc.createScript("myButton");MyButton.justPressed=!1,MyButton.attributes.add("startScale",{type:"number",default:1}),MyButton.attributes.add("animScaleKoef",{type:"number",default:.2}),MyButton.attributes.add("actionName",{type:"string",default:"type name of action"}),MyButton.setClickable=function(e,t){for(var n,a=0;a<e.children.length;a++)(n=e.children[a]).script&&n.script.myButton&&(n.script.myButton.clickable=t),MyButton.setClickable(n,t)},MyButton.prototype.onClick=function(){switch(this.actionName){case"firstAudio":GameAudio.play("button"),this.entity.enabled=!1;break;case"openTutor":MyButton.setClickable(Game.instance.uiScore,!1),Game.instance.startGameButtonEnabled=!1,MyButton.setClickable(Game.instance.uiMainMenu,!1),Uipopup.open("Tutorial",!0);break;case"closeTutor":MyButton.setClickable(Game.instance.uiScore,!0),Game.instance.startGameButtonEnabled=!0,MyButton.setClickable(Game.instance.uiMainMenu,!0),Uipopup.close("Tutorial");break;case"openSettings":MyButton.setClickable(Game.instance.uiScore,!1),Game.instance.startGameButtonEnabled=!1,MyButton.setClickable(Game.instance.uiMainMenu,!1),Uipopup.open("Settings",!0);break;case"closeSettings":MyButton.setClickable(Game.instance.uiScore,!0),Game.instance.startGameButtonEnabled=!0,MyButton.setClickable(Game.instance.uiMainMenu,!0),Uipopup.close("Settings");break;case"buyhtml5Contact":window.open("mailto:contact@buyhtml5.com");break;case"shopLeft":Uishop.shownSkinID--,Uishop.shownSkinID<0&&(Uishop.shownSkinID=Uishop.instance.skinsCount-1),Uishop.instance.showSkin(Uishop.shownSkinID);break;case"shopRight":Uishop.shownSkinID++,Uishop.shownSkinID>=Uishop.instance.skinsCount&&(Uishop.shownSkinID=0),Uishop.instance.showSkin(Uishop.shownSkinID);break;case"shopExit":MyButton.setClickable(Game.instance.uiScore,!0),Game.instance.startGameButtonEnabled=!0,MyButton.setClickable(Game.instance.uiMainMenu,!0),Uishop.instance.close();break;case"shopChoose":MyButton.setClickable(Game.instance.uiScore,!0),Game.instance.startGameButtonEnabled=!0,MyButton.setClickable(Game.instance.uiMainMenu,!0),Uishop.instance.chooseSkin(Uishop.shownSkinID),Uishop.instance.close();break;case"shopButton":Game.instance.startGameButtonEnabled=!1,MyButton.setClickable(Game.instance.uiMainMenu,!1),Game.instance.uiShop.enabled=!0;break;case"shopButtonInMainMenu":Game.instance.startOnSwipe=!1,FadeScreen.instance.show(.3,.1,!1,function(){Game.instance.uiShop.enabled=!0,Game.instance.uiMainMenu.enabled=!1,Game.instance.uiTutorial.enabled=!1});break;case"vibButton":VibrationController.switch(!VibrationController.enabled);break;case"soundButton":console.log(GameAudio.mute),GameAudio.switch(!GameAudio.mute);break;case"backButtonInShop":ShopController.applySkin(Game.instance.ballModel,Game.instance.chosenSkinId),Game.instance.startGameButtonEnabled=!0,MyButton.setClickable(Game.instance.uiMainMenu,!0),ShopController.instance.closeShop();break;case"leftButtonInShop":ShopController.instance.switchItem(-1);break;case"rightButtonInShop":ShopController.instance.switchItem(1);break;case"chooseButtonInShop":Game.instance.chosenSkinId=ShopController.instance.shownItemId,ShopController.applySkin(Game.instance.ballModel,Game.instance.chosenSkinId),Game.instance.startGameButtonEnabled=!0,MyButton.setClickable(Game.instance.uiMainMenu,!0),ShopController.instance.closeShop();break;case"unlockButtonInShop":GameAudio.play("buyitem"),ShopController.instance.buyItem(ShopController.instance.shownItemId);break;case"continueButtonInScore":Ball.delayToControl=2,FadeScreen.instance.show(.5,.1,!1,function(){this.app.fire("game:makereset",!1)});break;case"shopButtonInScore":Game.instance.uiShop.enabled=!0,Game.instance.uiScore.enabled=!1;break;case"restartButtonInScore":Ball.delayToControl=2,FadeScreen.instance.show(.5,.1,!1,function(){this.app.fire("game:makereset",!0)});break;default:return 0}},MyButton.prototype.initialize=function(){this.button=this.entity.button,this.clickable=!0,this.animScaling=!0,this.mouseDown=!1,this.pressScaleX=1,this.pressScaleY=1,this.pressScaleXVel=0,this.entity.element.on("mousedown",this.onMouseDown,this),this.entity.element.on("mouseleave",this.onMouseLeave,this),this.entity.element.on("mouseup",this.onMouseUp,this),this.entity.element.on("touchstart",this.onMouseDown,this),this.entity.element.on("touchend",this.onMouseLeave,this)},MyButton.prototype.onMouseUp=function(){this.mouseDown=!1},MyButton.prototype.onMouseDown=function(){this.button.active&&1!=FadeScreen.instance.state&&(Game.instance.BH5&&"buyhtml5Contact"!=this.actionName||this.clickable&&(GameAudio.play("button"),MyButton.justPressed=!0,this.onClick(),this.mouseDown=!0))},MyButton.prototype.onMouseLeave=function(){this.mouseDown=!1},MyButton.prototype.postUpdate=function(e){MyButton.justPressed=!1},MyButton.prototype.update=function(e){this.animScaling?(this.mouseDown&&this.button.active?(this.pressScaleX>1-this.animScaleKoef&&(this.pressScaleX=pc.math.lerp(this.pressScaleX,1-this.animScaleKoef,.5)),this.pressScaleY=this.pressScaleX):(this.pressScaleXVel+=20*(1-this.pressScaleX),this.pressScaleXVel*=.7,this.pressScaleX+=this.pressScaleXVel*e,this.pressScaleY=this.pressScaleX),this.entity.setLocalScale(this.pressScaleX*this.startScale,this.pressScaleY*this.startScale,1)):this.entity.setLocalScale(this.startScale,this.startScale,this.startScale)};var ScoreController=pc.createScript("scoreController");ScoreController.attributes.add("continue",{type:"entity"}),ScoreController.attributes.add("restart",{type:"entity"}),ScoreController.attributes.add("title",{type:"entity"}),ScoreController.attributes.add("score",{type:"entity"}),ScoreController.attributes.add("best",{type:"entity"}),ScoreController.attributes.add("scoreTitle",{type:"entity"}),ScoreController.attributes.add("bestTitle",{type:"entity"}),ScoreController.prototype.initialize=function(){this.onEnable(),this.on("enable",this.onEnable,this)},ScoreController.prototype.onEnable=function(){this.score.element.text=Game.instance.currScore.toString(),this.best.element.text=Game.instance.bestScore.toString(),Game.instance._state==Game.STATE_LEVELCOMPLETED?(this.title.element.text=TextTranslator.translate("LEVEL "+(Game.instance.levelCurrent-1).toString()+" \nCOMPLETED!"),this.continue.enabled=!0,this.restart.enabled=!1):(this.title.element.text=TextTranslator.translate("GAME OVER"),this.continue.enabled=!1,this.restart.enabled=!0)},ScoreController.prototype.update=function(t){};var CoinsText=pc.createScript("coinsText");CoinsText.prototype.initialize=function(){this.counter=this.entity.script.counterText,this.onEnable(),this.on("enable",this.onEnable,this),this.app.on("stats:coinschanged",this.onCoinsChanged,this)},CoinsText.prototype.onCoinsChanged=function(t){this.counter.setValue(this.counter.shownValue,t,500)},CoinsText.prototype.onEnable=function(){this.counter.setValue(Game.instance.coins,Game.instance.coins,500)};var CounterText=pc.createScript("counterText");CounterText.attributes.add("targetValue",{type:"number",default:0}),CounterText.attributes.add("shownValue",{type:"number",default:0}),CounterText.attributes.add("changingSpeed",{type:"number",default:10}),CounterText.prototype.initialize=function(){this.currValue=this.shownValue,this.entity.element.text=this.shownValue.toString()},CounterText.prototype.setValue=function(t,e,u){this.shownValue=t,this.targetValue=e,this.changingSpeed=u,this.entity.element.text=this.shownValue.toString()},CounterText.prototype.update=function(t){this.shownValue!=this.targetValue&&(this.currValue<this.targetValue?(this.currValue+=this.changingSpeed*t,this.currValue>=this.targetValue&&(this.currValue=this.targetValue),this.shownValue=Math.round(this.currValue)):(this.currValue-=this.changingSpeed*t,this.currValue<=this.targetValue&&(this.currValue=this.targetValue),this.shownValue=Math.round(this.currValue)),this.entity.element.text=this.shownValue.toString())};var ProgressBar=pc.createScript("progressBar");ProgressBar.attributes.add("percentText",{type:"entity"}),ProgressBar.attributes.add("progressImage",{type:"entity"}),ProgressBar.attributes.add("progressImageMaxWidth",{type:"number"}),ProgressBar.prototype.initialize=function(){this.setProgress(0),this.targValue=0},ProgressBar.prototype.setProgress=function(e){e=pc.math.clamp(e,0,1),this.targValue=e,this.progress=0;var r=pc.math.lerp(0,this.progressImageMaxWidth,e);this.progressImage.element.width=r,this.progressImage.element.rect.z=e,this.progressImage.element.rect=this.progressImage.element.rect},ProgressBar.prototype.showProgress=function(){var e=pc.math.lerp(0,this.progressImageMaxWidth,this.progress);this.progressImage.element.width=e,this.progressImage.element.rect.z=this.progress,this.progressImage.element.rect=this.progressImage.element.rect},ProgressBar.prototype.update=function(e){this.progress<=this.targValue&&(this.progress+=e,this.progress>this.targValue&&(this.progress=this.targValue),this.showProgress()),this.percentText&&(this.percentText.element.text=Math.round(100*this.progress).toString()+"%")};var MathUtil=pc.createScript("mathUtil");MathUtil.DEG_TO_RAD=Math.PI/180,MathUtil.RAD_TO_DEG=180/Math.PI,MathUtil.irr=function(t,a){return Math.floor(Math.random(a-t+1)+t)},MathUtil.getRandomInt=function(t){return Math.floor(Math.random()*t)},MathUtil.chance=function(t){return Math.random()<=t},MathUtil.choose=function(){for(var t=[],a=0;a<arguments.length;a++)t.push(arguments[a]);return t[Math.round(pc.math.random(0,arguments.length-1))]},MathUtil.prototype.dot=function(t,a){return t.x*a.x+t.y*a.y+t.z*a.z+t.w*a.w},MathUtil.prototype.quatAngle=function(t,a){var n=this.dot(t,a);return t.equals(a)?0:2*Math.acos(Math.min(Math.abs(n),1))*MathUtil.RAD_TO_DEG},MathUtil.prototype.rotateTowards=function(t,a,n){return 0===this.quatAngle(t,a)?a:(new pc.Quat).slerp(t,a,n)};var Effect3ddrop=pc.createScript("effect3ddrop");Effect3ddrop.grav=new pc.Vec3(0,-16,0),Effect3ddrop.temp=new pc.Vec3(0,0,0),Effect3ddrop.create=function(t,e,i){var s=ObjectPool.instantiate("Effect3DDrop",t,Game.instance.app.root),a=s.script.effect3ddrop;return a.initialized||a.initialize(),a.vel.copy(i),a.size=e,s},Effect3ddrop.prototype.initialize=function(){this.initialized=!0,this.vel=new pc.Vec3(0,0,0),this.damping=.01,this.size=1,this.material=this.entity.model.meshInstances[0].material,this.onEnable(),this.on("enable",this.onEnable,this)},Effect3ddrop.prototype.onEnable=function(){EntityTools.setMaterial(this.entity,Game.instance.ballMaterials[Game.instance.styleID])},Effect3ddrop.prototype.update=function(t){Effect3ddrop.temp.copy(Effect3ddrop.grav),Effect3ddrop.temp.scale(t),this.vel.add(Effect3ddrop.temp),this.vel.scale(1-this.damping*t),Effect3ddrop.temp.copy(this.vel),Effect3ddrop.temp.scale(t),this.entity.translate(Effect3ddrop.temp);var e=this.entity.getPosition();if(e.add(this.vel),this.entity.lookAt(e),this.size-=.4*t,this.size<=0)ObjectPool.push(this.entity);else{var i=pc.math.clamp(this.vel.length()/10,1,4);this.entity.setLocalScale(this.size,this.size,this.size*i)}};var SplatEffect=pc.createScript("splatEffect");SplatEffect.color=new pc.Color,SplatEffect.create=function(t,e,i,o,a){var p=ObjectPool.instantiate("EffectSplat",t,a);p.sprite.color=e;var n=new pc.Vec3(i,i,i);return p.setLocalScale(n),p.sprite.frame=Math.floor(3*Math.random()),p.setEulerAngles(o,0,0),p},SplatEffect.prototype.initialize=function(){this.entity.sprite.stop(),this.time=0,this.onEnable(),this.on("enable",this.onEnable,this)},SplatEffect.prototype.onEnable=function(){this.entity.sprite.opacity=1,this.time=0},SplatEffect.prototype.update=function(t){this.time+=t,this.time>.5&&(this.entity.sprite.opacity-=1*t),this.entity.sprite.opacity<=0&&ObjectPool.push(this.entity)};var FlagController=pc.createScript("flagController");FlagController.prototype.initialize=function(){},FlagController.prototype.update=function(o){};var GameAudio=pc.createScript("gameAudio");GameAudio.instance=null,GameAudio.mute=!1,GameAudio.gsMute=!1,GameAudio.loopStep=0,GameAudio.appBlurred=!1,GameAudio.prototype.update=function(e){document.hasFocus(),GameAudio.loopStep>0&&(GameAudio.loopStep+=1,js_isMobileOrTablet()?GameAudio.loopStep>=10&&(GameAudio.loopStep=-1,GameAudio.instance.snd2.play("loopSound")):(GameAudio.loopStep=-1,GameAudio.instance.snd2.play("loopSound")));var o=!1;o!=GameAudio.gsMute&&(GameAudio.gsMute=o,GameAudio.switch(GameAudio.gsMute))},GameAudio.prototype.initialize=function(){GameAudio.instance=this,this.snd2=this.entity.children[0].sound,this.snd=this.entity.sound,GameAudio.gsMute=!1,GameAudio.mute=GameAudio.gsMute,GameAudio.switch(GameAudio.mute),this.snd2.slot("loopSound").volume=2e-5,this.app.on("input:mousepress",this.onMousePress)},GameAudio.prototype.onMousePress=function(){0===GameAudio.loopStep&&(GameAudio.loopStep=1)},GameAudio.switch=function(e){GameAudio.mute=e,GameAudio.instance.snd.enabled=!GameAudio.mute},GameAudio.play=function(e){(1&&!0,GameAudio.instance)&&(GameAudio.instance.snd.slot(e).pitch=1,GameAudio.instance.snd.play(e))},GameAudio.playEx=function(e,o){(1&&!0,GameAudio.instance)&&(GameAudio.instance.snd.slot(e).pitch=o,GameAudio.instance.snd.play(e))};var MainMenuController=pc.createScript("mainMenuController");MainMenuController.attributes.add("gameTitle",{type:"entity"}),MainMenuController.attributes.add("hintFinger",{type:"entity"}),MainMenuController.firstLaunch=!0,MainMenuController.shopFingerShown=!1,MainMenuController.prototype.initialize=function(){this.onEnable(),this.on("enable",this.onEnable,this),this.app.on("game:stylechange",this.updateStuff,this)},MainMenuController.prototype.onEnable=function(){MainMenuController.firstLaunch=!1};var SoundButton=pc.createScript("soundButton");SoundButton.attributes.add("noSound",{type:"entity"}),SoundButton.prototype.initialize=function(){this.app.on("app:soundchanged",this.onSoundChange,this),this.onEnable(),this.on("enable",this.onEnable,this)},SoundButton.prototype.onSoundChange=function(n){this.noSound.enabled=n},SoundButton.prototype.update=function(n){this.noSound.enabled=GameAudio.mute},SoundButton.prototype.onEnable=function(){this.onSoundChange(GameAudio.mute)};var LevelBoard=pc.createScript("levelBoard");LevelBoard.attributes.add("circle",{type:"entity"}),LevelBoard.attributes.add("title",{type:"entity"}),LevelBoard.attributes.add("level",{type:"entity"}),LevelBoard.attributes.add("contour",{type:"entity"}),LevelBoard.attributes.add("check",{type:"entity"}),LevelBoard.prototype.initialize=function(){this.zpos=this.circle.getPosition().z,this.app.on("game:stylechange",this.onStyleChange,this)},LevelBoard.prototype.update=function(e){this.contour.rotateLocal(0,0,8*e)},LevelBoard.prototype.onStyleChange=function(){this.circle.element.color=Game.instance.getTextColor(),this.contour.element.color=Game.instance.getTextColor()},LevelBoard.prototype.setup=function(e,t,o,i,l){this.circle.element.color=o,this.contour.element.color=o,this.level.element.text=i.toString(),this.contour.enabled=l,this.check.enabled=l,this.level.enabled=!l,this.circle.element.opacity=!0===l?0:.3;var r=e.getPosition();r.z=2,r.y+=t,this.circle.setPosition(r)};var FingerAnim2=pc.createScript("fingerAnim2");FingerAnim2.prototype.initialize=function(){var t=(new pc.Vec3).copy(this.entity.getLocalPosition());t.x-=50,this.entity.tweenMove=this.entity.tween(this.entity.getLocalPosition()).to(t,.5,pc.QuadraticInOut).loop(!0).yoyo(!0).start()},FingerAnim2.prototype.update=function(t){};var TextTranslator=pc.createScript("textTranslator");TextTranslator.attributes.add("textInEnglish",{type:"string",default:"type text here"}),TextTranslator.languageID=0,TextTranslator.languagesCount=1,TextTranslator.languages=[],TextTranslator.languages[0]={},TextTranslator.languageNames=[],TextTranslator.languageNames[0]="English",TextTranslator.languageShortnames=[],TextTranslator.languageShortnames[0]="EN",TextTranslator.prototype.initialize=function(){this.textEnglish=this.entity.element.text;var t=pc.Application.getApplication();this.textEnglishFontName=t.assets.get(this.entity.element.fontAsset).name,this.onEnable(),this.on("enable",this.onEnable,this),this.app.on("language:changed",this.onEnable,this)},TextTranslator.prototype.onEnable=function(){this.entity.element&&(TextTranslator.translateFont(this.entity.element,this.textEnglishFontName),this.entity.element.text=TextTranslator.translate(this.textInEnglish))},TextTranslator.addLanguage=function(t,a,e){TextTranslator.languageNames[TextTranslator.languagesCount]=t,TextTranslator.languageShortnames[TextTranslator.languagesCount]=a,TextTranslator.languages[TextTranslator.languagesCount]=e,TextTranslator.languagesCount++},TextTranslator.chooseLanguageByID=function(t){TextTranslator.languageID=t,pc.Application.getApplication().fire("language:changed",TextTranslator.languageID)},TextTranslator.getLanguageName=function(){return TextTranslator.languageNames[TextTranslator.languageID]},TextTranslator.getLanguageShortname=function(){return TextTranslator.languageShortnames[TextTranslator.languageID]},TextTranslator.translateFont=function(t,a){var e=pc.Application.getApplication(),n=TextTranslator.translateFontName(a);return t.fontAsset=e.assets.find(n,"font"),n},TextTranslator.translateFontName=function(t){pc.Application.getApplication();var a=t;return"RU"==TextTranslator.getLanguageShortname()&&("Seravek.ttf"==t&&(a="OpenSans-Semibold.ttf"),"Seravek-Bold.ttf"==t&&(a="OpenSans-Semibold.ttf")),a},Game.gameMsgs=["Cool!","Nice!","Perfect!","Good!","Great!"],Game.gameMsgs2=["Perfect!","Fantastic!","Amazing!","Incredible!","Terrific!"],TextTranslator.createLanguages=function(){var t={"SWIPE TO START":"ДВИГАЙ ПАЛЬЦЕМ","Best result":"Рекорд",SKINS:"СКИНЫ",UNLOCK:"КУПИТЬ",CHOOSE:"ВЫБРАТЬ",BACK:"НАЗАД",SCORE:"СЧЕТ",BEST:"РЕКОРД","GAME OVER":"ИГРА ОКОНЧЕНА","LEVEL COMPLETED!":"Уровень пройден!","Cool!":"Клево!","Nice!":"Хорошо!","Perfect!":"Идеально!","Great!":"Круто!","Good!":"Хорошо!","Fantastic!":"Фантастика!","Amazing!":"Чудесно!","Incredible!":"Невероятно!","Terrific!":"Офигенно!",CONTINUE:"ПРОДОЛЖИТЬ"};TextTranslator.addLanguage("Русский","RU",t)},TextTranslator.translate=function(t){if(0===TextTranslator.languageID)return t;var a=TextTranslator.languages[TextTranslator.languageID];return t in a?a[t]:t},TextTranslator.createLanguages(),TextTranslator.chooseLanguageByID(0);var StackBounce=pc.createScript("stackBounce");StackBounce.prototype.initialize=function(){},StackBounce.prototype.update=function(t){};var Ring=pc.createScript("ring");Ring.ringTypes=[],Ring.ringTypesCount=0,Ring.createRingTypes=function(){Ring.createRingType("ring8_6parts.json",6,0,new pc.Vec3(-.17,0,-.97),-8,1.1),Ring.createRingType("ring6_6parts.json",6,0,new pc.Vec3(.4,0,-.8),30,1.2),Ring.createRingType("ring10_6parts.json",6,0,new pc.Vec3(0,0,-.8),0,1.4),Ring.createRingType("ring9_3parts.json",3,0,new pc.Vec3(.2,0,-.77),10,1.3),Ring.createRingType("ring7_3parts.json",3,1.65,new pc.Vec3(2.7,0,0),90,1.1),Ring.createRingType("ring5_4parts.json",4,0,new pc.Vec3(0,0,-1.1),0,1),Ring.createRingType("ring4_8parts.json",8,0,new pc.Vec3(.43,0,-1.25),21,1),Ring.createRingType("ring2_4parts.json",4,0,new pc.Vec3(-.76,0,-1),-45,1),Ring.createRingType("ring1_4parts.json",4,.05,new pc.Vec3(1.24,0,-.46),68,1),Ring.createRingType("ring3_8parts.json",8,0,new pc.Vec3(0,0,-1.37),0,1),Ring.createRingType("ring16_5parts.json",5,0,new pc.Vec3(.44,0,-1.38),19,.9),Ring.createRingType("ring15_2parts.json",2,0,new pc.Vec3(0,0,1.3),180,1),Ring.createRingType("ring14_4parts.json",4,0,new pc.Vec3(-1.52,0,0),-90,.9),Ring.createRingType("ring13_5parts.json",5,0,new pc.Vec3(1.25,0,0),90,1),Ring.createRingType("ring12_3parts.json",3,0,new pc.Vec3(1.04,0,-.8),50,1),Ring.createRingType("ring11_4parts.json",4,0,new pc.Vec3(0,0,1),180,1)},Ring.createRingType=function(t,n,e,i,a,r){var s={jsonModel:t,partsCount:n,distance:e,shift:i,startAngle:a,scale:r};Ring.ringTypes.push(s),Ring.ringTypesCount++},Ring.createRingTypes(),Ring.prototype.initialize=function(){this.underRing=null,this.firstTouch=!1},Ring.prototype.breakRing=function(){for(var t,n,e=0;e<this.partsCount;e++)t=this.parts[e],EntityTools.reparent(t,this.app.root),t.script.modelShifter.setShift(Ring.ringTypes[Game.instance.level.ringTypeID].shift),(n=t.script.ringPart).throw(pc.math.random(7,18),this.angle),n.death},Ring.prototype.setDeathParts=function(t,n,e,i){if(!MathUtil.chance(e))return 1;var a,r,s,p=0;i&&(p=Math.floor(Math.random(this.partsCount)));for(var c=t+p;c<=t+n-1+p;c++)s=c%this.partsCount,(a=this.parts[s]).script.ringPart.death=!0,r=a.children[0].model,mat=Game.instance.deathMaterial,r.meshInstances[0].material=mat.resource,r.meshInstances[0].material.update()},Ring.prototype.partUnderAngle=function(t){this.partsCount;var n,e=-1,i=-1,a=0,r=this.angle-this.angleShift;(r%=360)<0&&(r+=360);for(var s=0;s<this.partsCount;s++)n=this.parts[s],((a=Math.min(Math.abs(n.script.ringPart.localAngle-r),Math.abs(n.script.ringPart.localAngle+360-r)))<e||e<0)&&(e=a,i=n);return i},Ring.prototype.configure=function(t,n,e){var i,a;for(i=0;i<this.partsCount;i++)this.parts[i].destroy();this.partsCount=0,this.parts=[],this.partsCount=n;var r,s,p,c=this.entity.getPosition(),g=2*Math.PI/n,o=0;for(i=0;i<this.partsCount;i++)(s=(a=ObjectPool.pop("RingPart")).script.ringPart).initialize(),(p=s.pModel).asset=Game.instance.app.assets.find(t,"model"),a.setPosition(c.x+Math.cos(o)*e,c.y,c.z+Math.sin(o)*e),a.setLocalEulerAngles(0,-360/this.partsCount*i,0),s.localAngle=o*MathUtil.RAD_TO_DEG,r=Game.instance.platMaterials[Game.instance.styleID],p.meshInstances[0].material=r.resource,p.meshInstances[0].material.update(),o+=g,this.parts.push(a),this.entity.addChild(a)},Ring.prototype.update=function(t){this.angle+=80.5*t*Game.instance.slomo*Game.instance.rotatingKoef,this.entity.setLocalEulerAngles(0,this.angle,0)};var RingPart=pc.createScript("ringPart");RingPart.tmp=new pc.Vec3,RingPart.prototype.initialize=function(){this.gravity=-30,this._vel=new pc.Vec3(0,0,0),this._acc=new pc.Vec3(0,this.gravity,0),this.rotSpeed=new pc.Vec3(0,0,0),this.falling=!1,this.timeFall=0,this.pModel=this.entity.children[0].model},RingPart.prototype.throw=function(t,i){RingPart.tmp.copy(this.entity.getLocalPosition()),RingPart.tmp.y=0,RingPart.tmp.normalize(),RingPart.tmp.z<-.75?this.entity.destroy():(RingPart.tmp.z>.75&&(RingPart.tmp.x<0?RingPart.tmp.x=-.8:RingPart.tmp.x=.8,RingPart.tmp.z=.2),RingPart.tmp.scale(t),RingPart.tmp.y=pc.math.random(3,10),this._vel.copy(RingPart.tmp),this.rotSpeed.set(pc.math.random(-300,300),pc.math.random(-300,300),pc.math.random(-300,300)),this.falling=!0)},RingPart.prototype.update=function(t){if(this.falling){var i=this.entity.getLocalPosition();RingPart.tmp.copy(this._acc).scale(t*Game.instance.slomo),this._vel.add(RingPart.tmp),RingPart.tmp.copy(this._vel).scale(t*Game.instance.slomo),i.add(RingPart.tmp),this.entity.setLocalPosition(i),this.entity.rotateLocal(this.rotSpeed.x*t*Game.instance.slomo,this.rotSpeed.y*t*Game.instance.slomo,this.rotSpeed.z*t*Game.instance.slomo),this.timeFall+=t,this.timeFall>.6&&this.entity.destroy()}};var ModelShifter=pc.createScript("modelShifter");ModelShifter.prototype.initialize=function(){this.posShift=new pc.Vec3(0,0,0)},ModelShifter.prototype.setShift=function(t){var e=t.clone();e.sub(this.posShift),this.entity.children[0].translateLocal(e),e.scale(-1),this.entity.translateLocal(e)};var EntityTools=pc.createScript("entityTools");EntityTools.reparent=function(t,e){var n=t.getPosition().clone(),o=t.getRotation().clone(),a=t.getScale().clone();t.reparent(e),t.setPosition(n),t.setRotation(o),t.setLocalScale(a)},EntityTools.createParentAtPoint=function(t,e,n){var o=new pc.Entity;return n.addChild(o),o.setPosition(e),EntityTools.reparent(t,o),o},EntityTools.setTexture=function(t,e){for(var n=e.resource,o=t.model.meshInstances,a=0;a<o.length;++a){var r=o[a];r.material.diffuseMap=n,r.material.update()}},EntityTools.setMaterial=function(t,e){for(var n=e.resource,o=t.model.meshInstances,a=0;a<o.length;++a){var r=o[a];r.material=n,r.material.update()}},EntityTools.setLayers=function(t,e){for(var n=[],o=1;o<arguments.length;o++)n.push(Game.instance.app.scene.layers.getLayerByName(arguments[o]).id);t.model.layers=n};var Minaret=pc.createScript("minaret");Minaret.attributes.add("top",{type:"entity"}),Minaret.attributes.add("cyl",{type:"entity"}),Minaret.prototype.initialize=function(){this.cylSize=this.cyl.getLocalScale().y,this._levelStartY=0,this._levelSizeY=0,this.cylYMax=10,this.cylYMin=0},Minaret.prototype.configure=function(t,i){this.top.setLocalPosition(new pc.Vec3(0,t,0)),this.cyl.setLocalPosition(new pc.Vec3(0,t-.5*this.cylSize,0)),this.cylYMax=t,this.cylYMin=t-i},Minaret.prototype.update=function(t){};var TutorialController=pc.createScript("tutorialController");TutorialController.attributes.add("finger",{type:"entity"}),TutorialController.attributes.add("text",{type:"entity"}),TutorialController.prototype.initialize=function(){this.finger.tween(this.finger.getLocalScale()).to(new pc.Vec3(1.4,1.4,1.4),.5,pc.SineInOut).loop(!0).yoyo(!0).start()},TutorialController.prototype.update=function(t){};var BackgroundCity=pc.createScript("backgroundCity");BackgroundCity.prototype.initialize=function(){},BackgroundCity.prototype.update=function(t){};var BackgroundCity2=pc.createScript("backgroundCity2");BackgroundCity2.prototype.initialize=function(){this.scale=this.entity.getLocalScale()},BackgroundCity2.prototype.update=function(t){var i=window.innerWidth,a=window.innerHeight;this.scale.x=Math.max(1.5,i/a*1.1),this.scale.y=this.scale.x,this.entity.setLocalScale(this.scale)};var MaskedBar=pc.createScript("maskedBar");MaskedBar.attributes.add("barDirection",{type:"number",default:1,enum:[{up:1},{right:2}]}),MaskedBar.attributes.add("barMask",{type:"entity"}),MaskedBar.attributes.add("barImage",{type:"entity"}),MaskedBar.attributes.add("barBg",{type:"entity"}),MaskedBar.attributes.add("textPercent",{type:"entity"}),MaskedBar.attributes.add("barLerpSpeed",{type:"number",default:1}),MaskedBar.prototype.initialize=function(){this.sizeX=this.barImage.element.width,this.sizeY=this.barImage.element.height,this.lerpSpeed=1,this.targValue=0,this.currValue=0,this.showPercent=!0},MaskedBar.prototype.update=function(t){this.currValue=pc.math.lerp(this.currValue,this.targValue,t*this.barLerpSpeed),this.currValue=pc.math.clamp(this.currValue,0,1),this.targValue>=1&&(this.targValue=0),this.updateBarSize(),this.textPercent&&this.showPercent&&(this.textPercent.element.text=Math.round(100*this.currValue).toString()+" %")},MaskedBar.prototype.updateBarSize=function(){var t=this.barImage.getPosition();if(1===this.barDirection){var e=this.currValue*this.sizeY;this.barMask.element.height=e}else if(2===this.barDirection){var a=this.currValue*this.sizeX;this.barMask.element.width=a}this.barImage.setPosition(t)},MaskedBar.prototype.setValue=function(t,e){this.targValue=t,e&&(this.currValue=this.targValue)},MaskedBar.prototype.setOpacity=function(t){this.barMask.element.opacity=t,this.barImage.element.opacity=t,this.barBg.element.opacity=t};var Spawner=pc.createScript("spawner");Spawner.attributes.add("spawnEntity",{type:"entity"}),Spawner.attributes.add("spawnTime",{type:"number",default:1}),Spawner.prototype.initialize=function(){this.active=!0,this.time=0},Spawner.prototype.update=function(t){if(this.time+=t,this.time>=this.spawnTime){if(this.spawnEntity){var i=this.spawnEntity.clone();i.setPosition(this.entity.getPosition()),i.enabled=!0}this.time=0}};var GravityObject=pc.createScript("gravityObject");GravityObject.attributes.add("damping",{type:"vec3"}),GravityObject.tmp=new pc.Vec3,GravityObject.prototype.initialize=function(){if(this.initialized)return 1;this.gravity=-12,this._vel=new pc.Vec3(0,0,0),this._acc=new pc.Vec3(0,this.gravity,0),this.rotSpeed=new pc.Vec3(0,0,0),this.falling=!0,this.delay=0,this.dampingMul=new pc.Vec3,this.initialized=!0},GravityObject.prototype.impulseRadial=function(t,i,e){var a=t*MathUtil.DEG_TO_RAD;this._vel.x=Math.cos(a)*i,this._vel.y=Math.sin(a)*i,this._vel.z=0,this.rotSpeed.set(pc.math.random(-e,e),pc.math.random(-e,e),pc.math.random(-e,e))},GravityObject.prototype.impulse=function(t,i,e,a){this.initialize(),this._vel.x=t,this._vel.y=i,this._vel.z=e,this.rotSpeed.set(pc.math.random(-a,a),pc.math.random(-a,a),pc.math.random(-a,a))},GravityObject.prototype.update=function(t){if(this.falling){if(this.delay>0)return this.delay-=t,0;this._acc.y=this.gravity;var i=this.entity.getLocalPosition();GravityObject.tmp.copy(this._acc).scale(t*Game.instance.slomo),this._vel.add(GravityObject.tmp),this.dampingMul.set(1-this.damping.x,1-this.damping.y,1-this.damping.z),this._vel.mul(this.dampingMul),GravityObject.tmp.copy(this._vel).scale(t*Game.instance.slomo),i.add(GravityObject.tmp),this.entity.rotateLocal(this.rotSpeed.x*t*Game.instance.slomo,this.rotSpeed.y*t*Game.instance.slomo,this.rotSpeed.z*t*Game.instance.slomo)}};var Serpantine=pc.createScript("serpantine");Serpantine.attributes.add("serpColors",{type:"rgba",array:!0}),Serpantine.create=function(t){var i=ObjectPool.instantiate("Serp",t,Game.instance.app.root),e=i.script.serpantine;return e.initialized||e.initialize(),i},Serpantine.prototype.onEnable=function(){this.time=0,this.gos.impulse(pc.math.random(-40,40),pc.math.random(20,40),pc.math.random(-40,40),250),this.entity.sprite.color=this.serpColors[MathUtil.getRandomInt(this.serpColors.length)]},Serpantine.prototype.initialize=function(){if(this.initialized)return 1;this.initialized=!0,this.gos=this.entity.script.gravityObject,this.onEnable(),this.on("enable",this.onEnable,this)},Serpantine.prototype.update=function(t){this.time+=t,this.time>5&&ObjectPool.push(this.entity)};function js_GS_sendScore(o){/*GAMESNACKS.sendScore(o),*/console.log("GAMESNACKS : score sent "+o.toString())}function js_GS_gameOver(){/*GAMESNACKS.gameOver(),*/console.log("GAMESNACKS : game over")}var audioEnabled=!1;function js_GS_isAudioEnabled(){return audioEnabled}function js_isIE(){var o=window.navigator.userAgent;return/MSIE|Trident/.test(o)}function js_isMobileOrTablet(){var o,i=!1;o=navigator.userAgent||navigator.vendor||window.opera,(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(o)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(o.substr(0,4)))&&(i=!0);var e=navigator.maxTouchPoints||"ontouchstart"in document.documentElement,a=void 0!==window.orientation;return i||(e||a)}var StarCreator=pc.createScript("starCreator");StarCreator.prototype.initialize=function(){setInterval(this.createStar(),1e3)},StarCreator.prototype.update=function(t){},StarCreator.prototype.createStar=function(){};var VibrationButton=pc.createScript("vibrationButton");VibrationButton.attributes.add("noVib",{type:"entity"}),VibrationButton.prototype.initialize=function(){this.app.on("app:soundchanged",this.onSoundChange,this),this.onEnable(),this.on("enable",this.onEnable,this)},VibrationButton.prototype.onEnable=function(){VibrationController.available&&js_isMobileOrTablet()||this.entity.destroy()},VibrationButton.prototype.update=function(t){this.entity.enabled=VibrationController.available,this.noVib.enabled=!VibrationController.enabled};var VibrationController=pc.createScript("vibrationController");VibrationController.available=!1,VibrationController.enabled=!0,window.navigator&&window.navigator.vibrate?(VibrationController.available=!0,console.log("Vibration available")):(VibrationController.available=!1,console.log("Vibration not available")),VibrationController.prototype.initialize=function(){},VibrationController.switch=function(o){VibrationController.enabled=o},VibrationController.vibrate=function(o){VibrationController.available&&VibrationController.enabled&&window.navigator.vibrate(o)};var Skin=pc.createScript("skin");Skin.attributes.add("levelsCompleted",{type:"number",default:0}),Skin.attributes.add("platformsBroken",{type:"number",default:0}),Skin.attributes.add("shiftY",{type:"number",default:0}),Skin.attributes.add("scoreReach",{type:"number",default:0}),Skin.prototype.initialize=function(){},Skin.prototype.update=function(t){};var Savefile=pc.createScript("savefile");Savefile.resetOnLoad=!1,Savefile.name="GameSave",Savefile.autoSave=!0,Savefile.data={},Savefile.defData={},Savefile.addKey=function(e,a){Savefile.data[e]=a,Savefile.defData[e]=a},Savefile.reset=function(){for(var e in Savefile.data)Savefile.data[e]=Savefile.defData[e];Savefile.autoSave&&Savefile.save()},Savefile.load=function(){if(Savefile.resetOnLoad)Savefile.reset();else for(var e in Savefile.data)Savefile.data[e]=Savefile.cookieLoad(Savefile.name+e,Savefile.defData[e])},Savefile.save=function(){for(var e in Savefile.data)Savefile.cookieSave(Savefile.name+e,Savefile.data[e])},Savefile.get=function(e){if(e in Savefile.data)return Savefile.data[e];console.log("Savefile.get() - keyname doesn't exist: '"+e+"'")},Savefile.set=function(e,a){e in Savefile.data?Savefile.data[e]=a:(Savefile.addKey(e,a),console.log("Savefile.set() - keyname doesn't exist, new keyname added '"+e+"'")),Savefile.autoSave&&Savefile.cookieSave(Savefile.name+e,a)},Savefile.cookieSave=function(e,a){Savefile.setCookie(e,a.toString(),100)},Savefile.cookieLoad=function(e,a){var i=Savefile.getCookie(e);return i?Number(i):a},Savefile.setCookie=function(e,a,i){var f="";if(i){var t=new Date;t.setTime(t.getTime()+24*i*60*60*1e3),f="; expires="+t.toUTCString()}document.cookie=e+"="+(a||"")+f+"; path=/"},Savefile.getCookie=function(e){for(var a=e+"=",i=document.cookie.split(";"),f=0;f<i.length;f++){for(var t=i[f];" "==t.charAt(0);)t=t.substring(1,t.length);if(0===t.indexOf(a))return t.substring(a.length,t.length)}return null},Savefile.eraseCookie=function(e){document.cookie=e+"=; Max-Age=-99999999;"};var Uipopup=pc.createScript("uipopup");Uipopup.attributes.add("fader",{type:"entity"}),Uipopup.attributes.add("name",{type:"string",default:"Popup Name"}),Uipopup.popups=[],Uipopup.STATE_OPENING=1,Uipopup.STATE_OPENED=2,Uipopup.STATE_CLOSING=3,Uipopup.STATE_CLOSED=4,Uipopup.prototype.initialize=function(){Uipopup.popups.push(this),this.entity.enabled=!1,this.state=Uipopup.STATE_CLOSED},Uipopup.open=function(p,t){for(var i,e=0;e<Uipopup.popups.length;e++)(i=Uipopup.popups[e]).name==p?i.open():t&&i.close()},Uipopup.close=function(p){for(var t,i=0;i<Uipopup.popups.length;i++)(t=Uipopup.popups[i]).name==p&&t.close()},Uipopup.prototype.open=function(){this.state==Uipopup.STATE_CLOSED&&(this.fader&&(this.fader.enabled=!0),this.state=Uipopup.STATE_OPENING,this.entity.setLocalScale(0,0,0),this.entity.enabled=!0,this.entity.tween(this.entity.getLocalScale()).to(new pc.Vec3(1,1,1),.45,pc.BackOut).loop(!1).yoyo(!1).on("complete",function(){this.state=Uipopup.STATE_OPENED}.bind(this)).start())},Uipopup.prototype.close=function(){this.state!=Uipopup.STATE_OPENED&&this.state!=Uipopup.STATE_OPENING||(this.state=Uipopup.STATE_CLOSING,this.entity.tween(this.entity.getLocalScale()).to(new pc.Vec3(0,0,0),.4,pc.BackIn).loop(!1).yoyo(!1).on("complete",function(){if(this.fader){for(var p,t=!1,i=0;i<Uipopup.popups.length;i++)(p=Uipopup.popups[i]).state!=Uipopup.STATE_OPENED&&p.state!=Uipopup.STATE_OPENING||p.fader==this.fader&&(t=!0);t||(this.fader.enabled=!1)}this.state=Uipopup.STATE_CLOSED,this.entity.enabled=!1}.bind(this)).start())},Uipopup.prototype.update=function(p){this.state!=Uipopup.STATE_OPENED&&this.state!=Uipopup.STATE_OPENING||this.fader&&(this.fader.enabled=!0)};