function CSummaryPanel(iX, iY, oParentContainer){
    var _oContainer;
    
    var _oTotXPField;
    var _oExperiencePanel;
    var _oTween;
    
    var _oWinField;
    var _oGoalsField;
    var _oSavedField;
    var _oShutOutField;
    var _oTrophiesField;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("end_summary_panel");
        var oBg = createBitmap(oSpriteBg);
        oBg.regX = oSpriteBg.width/2;
        oBg.regY = oSpriteBg.height/2;
        _oContainer.addChild(oBg);
        
        var iWidth = 330;
        var iHeight = 40;
        var iTextX = 0;
        var iTextY = -180;
        var oRect = new createjs.Rectangle( iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        var oTitle = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    iHeight, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    TEXT_SUMMARY_TITLE,
                                    true, true, false,
                                    false
                                );  

        var iStartY = -120;
        var iFieldX = 5;
        
       
        _oWinField = new CSummaryField(iFieldX,iStartY,_oContainer, TEXT_SUMMARY_WON, 28);
        _oGoalsField = new CSummaryField(iFieldX,iStartY+40,_oContainer, TEXT_SUMMARY_GOALS_SCORED, 28);
        _oSavedField = new CSummaryField(iFieldX,iStartY+80,_oContainer, TEXT_SUMMARY_GOALS_SAVED, 28);
        _oShutOutField = new CSummaryField(iFieldX,iStartY+120,_oContainer, TEXT_SUMMARY_SHUTOUT, 28);
        _oTrophiesField = new CSummaryField(iFieldX,iStartY+160,_oContainer, TEXT_SUMMARY_TROPHIES, 28);

        _oExperiencePanel = new CExperiencePanel(-142, 172, _oContainer);
        _oExperiencePanel.setScale(1.1);
        _oExperiencePanel.setLabelScale(1.5);

        _oTotXPField = new CSummaryField(iFieldX,120,_oContainer, TEXT_SUMMARY_TOTAL, 34); 
        _oTotXPField.setColor(TEXT_COLOR_SOCIAL2);
        _oTotXPField.setScore(0);

        /*
        var iCurExp = 15;
        var iTotalExpGained = 40;
        var iTotalExp = iCurExp + iTotalExpGained;
        
        this.animateXPGain(iCurExp, iTotalExp);
        */
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oContainer);
    };
    
    this.setWinField = function(szTitle, szScore){
        _oWinField.setLabel(szTitle);
        _oWinField.setScore(szScore);
    };
    
    this.setGoalsField = function(iScore){
        _oGoalsField.setScore(iScore);
    };
    
    this.setSavedField = function(iScore){
        _oSavedField.setScore(iScore);
    };
    
    this.setShutOutField = function(iScore){
        _oShutOutField.setScore(iScore);
    };
    
    this.setTrophiesField = function(iScore){
        _oTrophiesField.setScore(iScore);
    };
    
    this.setShutOutVisible = function(bVal){
        _oShutOutField.setVisible(bVal);
    };
    
    this.setTrophiesVisible = function(bVal){
        _oTrophiesField.setVisible(bVal);
    };
    
    this.setExpBar = function(oInfo){
        var iCurExp = oInfo.partialexp;
        var iNextLevelExp = oInfo.totlevelexp;
        var iCurLevel = oInfo.curlevel;
        
        _oExperiencePanel.setBar(iCurExp, iNextLevelExp);
        _oExperiencePanel.setLevel(iCurLevel);
    };
    
    this.animateXPGain = function(iCurExp, iTotalExp){
        //SICCOME GLI EXP LI AVRO' GIA' AGGIUNTI DAI TROFEI, PER FARE L'ANIMAZIONE
        //DEVO PRIMA CALCOLARE L'EXP TOTALE CHE HO, E POI SOTTRARGLI QUELLA CHE HO GUADAGNATO 
        
        playSound("totalwinning", 1, false);
        
        var oInfo = s_oSocialManager.getLevelInfoByExp(iCurExp);
        
        var iCurLevel = oInfo.curlevel;
        
        var oParam = {xp: iCurExp};
        var oThis = this;
        _oTween = createjs.Tween.get(oParam).to({xp:iTotalExp}, 5000, createjs.Ease.cubicOut);
        _oTween.on("change", function(){
            var oInfo = s_oSocialManager.getLevelInfoByExp(oParam.xp);
            
            if(iCurLevel !== oInfo.curlevel){
                iCurLevel = oInfo.curlevel;
                playSound("level_up", 1, false);
            }
            
            var iScoreGained = oParam.xp - iCurExp;
            _oTotXPField.setScore( Math.round(iScoreGained) );
            oThis.setExpBar(oInfo);
        });
        
        _oTween.call(function(){
            stopSound("totalwinning");
        });
    };
    
    this._init();
    
}

