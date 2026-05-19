function CStatsPage2(){
    var _oContainer;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        
        var oStat1 = new CStatSimple(-280,-150,_oContainer, TEXT_STATS2_SHOTSSAVED);
        oStat1.setNum(s_iKeeperShotsSaved);
        
        var oStat2 = new CStatSimple(0,-150,_oContainer, TEXT_STATS2_SHUTOUTS);
        oStat2.setNum(s_iShutOuts);

        var oStat3 = new CStatSimple(280,-150,_oContainer, TEXT_STATS2_SAVEPERCENTAGE);
        var iTotShots = s_iKeeperShotsSaved + s_iKeeperShotsGoal;
        var iPercentSaved = s_iKeeperShotsSaved/iTotShots*100;
        if(isNaN(iPercentSaved)){
            iPercentSaved = 0;
        }
        oStat3.setNum(formatValue(iPercentSaved));
        
        var iScale = 0.45;
        var oHotZoneImage = new createjs.Container();
        oHotZoneImage.scale = iScale;

        var oSprite = s_oSpriteLibrary.getSprite("goal_1");
        var oArea = createBitmap(oSprite);
        oArea.regX = oSprite.width * 0.5;
        oArea.regY = oSprite.height * 0.5;
        oHotZoneImage.addChild(oArea);
        
        var oSprite = s_oSpriteLibrary.getSprite("gloves");
        var oGloves = createBitmap(oSprite);
        oGloves.sourceRect = new createjs.Rectangle(0,0,oSprite.width/2, oSprite.height);
        oGloves.regX = oSprite.width * 0.5;
        oGloves.regY = oSprite.height * 0.5;
        oGloves.x = 40;
        oGloves.y = 20;
        oGloves.rotation = 30;
        oHotZoneImage.addChild(oGloves);
        
        var oHotZones = new CStatHotZones(0, 110, _oContainer);
        oHotZones.addContent(oHotZoneImage);
        oHotZones.setTitleY(-160);
        oHotZones.setDesc(TEXT_STATS2_HOT_ZONES_DESC);
        oHotZones.setDescY(126);
        
        var oRect = oHotZoneImage.getBounds();
        oRect.x = 0;
        oRect.y = 10;
        oRect.width *= iScale*0.74;
        oRect.height *= iScale*0.60;
        
        var aMatrix = s_oSocialManager.getHotZonesPercent(s_aKeeperHotZones, false);

        oHotZones.setZones(oRect, aMatrix);
    };

    this.unload = function(){
        _oContainer.removeAllChildren();
    };
    
    this.getContent = function(){
        return _oContainer;
    };

    this._init();
}