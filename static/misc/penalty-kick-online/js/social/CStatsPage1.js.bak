function CStatsPage1(){
    var _oContainer;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        
        var oStat1 = new CStatSimple(-280,-150,_oContainer, TEXT_STATS1_GOALSCORED);
        oStat1.setNum(s_iStrikerGoalScored);
        
        var oStat2 = new CStatSimple(-280,-46,_oContainer, TEXT_STATS1_PERFECTGAMES);
        oStat2.setNum(s_iPerfectGames);
        
        var iWidth = 190;
        var iHeight = 30;
        var iTextX = -280;
        var iTextY = 10;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        var oDesc = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    18, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    TEXT_STATS1_EVERYSHOTS,
                                    true, true, true,
                                    false
                                );  
        oDesc.setShadow("#000",1,1,2);
        
        
        var oPieChart = new CStatPieChart(200,-64, _oContainer);
        oPieChart.setScale(0.8);
        var iTotShots = s_iStrikerGoalScored + s_iStrikerGoalSaved + s_iStrikerGoalMissed;
        oPieChart.setTitle(sprintf(TEXT_STATS1_SHOTS_TAKEN, iTotShots))
        
        if(iTotShots === 0){
            oPieChart.setArea(TEXT_TBD, TEXT_COLOR_SOCIAL2, 100);
        }else {
            oPieChart.setArea(TEXT_STATS1_MISSES, "#5891ad", s_iStrikerGoalMissed/iTotShots*100);
            oPieChart.setArea(TEXT_STATS1_SAVES, "#134f5c", s_iStrikerGoalSaved/iTotShots*100);
            oPieChart.setArea(TEXT_STATS1_GOALS, "#ff6f31", s_iStrikerGoalScored/iTotShots*100);
        }
        
        var iScale = 0.6;
        var oHotZoneImage = new createjs.Container();
        oHotZoneImage.scale = iScale;

        var oSprite = s_oSpriteLibrary.getSprite("goal_0");
        var oArea = createBitmap(oSprite);
        oArea.regX = oSprite.width * 0.5;
        oArea.regY = oSprite.height * 0.5;
        oHotZoneImage.addChild(oArea);
        
        var oSprite = s_oSpriteLibrary.getSprite("gk_idle_0_0");
        var oGK = createBitmap(oSprite);
        oGK.regX = oSprite.width * 0.5;
        oGK.regY = oSprite.height;
        oGK.x = 17;
        oGK.y = 175;
        oHotZoneImage.addChild(oGK);
       
        
        var oHotZones = new CStatHotZones(0, 140, _oContainer);
        oHotZones.addContent(oHotZoneImage);
        oHotZones.setDesc(TEXT_STATS1_HOT_ZONES_DESC);
        
        var oRect = oHotZoneImage.getBounds();
        oRect.x = 0;
        oRect.y = 0;
        oRect.width *= iScale*0.96;
        oRect.height *= iScale*0.80;
        
        var aMatrix = s_oSocialManager.getHotZonesPercent(s_aStrikerHotZones, true);

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