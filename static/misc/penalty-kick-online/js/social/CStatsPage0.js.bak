function CStatsPage0(){
    var _oContainer;
    var _oBalanceBar;
    var _oFlag;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        
        var oContainer0 = new createjs.Container();
        oContainer0.alpha = 0;
        _oContainer.addChild(oContainer0);
        
        var iWidth = 300;
        var iHeight = 50;
        var iTextX = 0;
        var iTextY = -150;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        var oGamesTitle = new CTLText(     oContainer0, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    40, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    TEXT_STATS0_GAMESLABEL,
                                    true, true, false,
                                    false
                                );  
        oGamesTitle.setShadow("#000",1,1,2);
        
        _oBalanceBar = new CBalanceBar(0,-100,oContainer0, TEXT_STATS0_LABELLX, TEXT_STATS0_LABELRX);
        
        var iWon = s_iMatchWon;
        var iLost = s_iMatchLost;
        _oBalanceBar.refreshText(iWon,iLost);

        var iSum = iWon + iLost;
        var iPerc = 100*iWon / iSum; 
        if(iSum === 0){
            iPerc = 50;
        };
        _oBalanceBar.setPercentage(iPerc);
        
        
        
        var oContainer1 = new createjs.Container();
        oContainer1.alpha = 0;
        _oContainer.addChild(oContainer1);
        
        var iTextX = 0;
        var iTextY = 50;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        var oFavTitle = new CTLText(     oContainer1, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    40, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    TEXT_STATS0_FAVCOUNTRYLABEL,
                                    true, true, false,
                                    false
                                );  
        oFavTitle.setShadow("#000",1,1,2);
        
        var iFavouriteTeam = s_oSocialManager.getFavouriteCountry();
        var szTag = "empty_flag";
        var oSprite = s_oSpriteLibrary.getSprite(szTag);
        _oFlag = createBitmap(oSprite);
  
        if(iFavouriteTeam !== null){
            szTag = "flag_"+iFavouriteTeam;
            _oFlag.image = s_oSpriteLibrary.getSprite(szTag)
        }else{
            _oFlag.visible = false;
            oFavTitle.refreshText(" ");
        }

        _oFlag.y = iTextY+70;
        _oFlag.regX = oSprite.width/2;
        _oFlag.regY = oSprite.height/2;
        oContainer1.addChild(_oFlag);

        var iStartTime = 500;
        createjs.Tween.get(oContainer0).wait(iStartTime).to({alpha:1}, 500);
        createjs.Tween.get(oContainer1).wait(iStartTime+250).to({alpha:1}, 500);
       
    };

    this.unload = function(){
        _oContainer.removeAllChildren();
    };
    
    this.getContent = function(){
        return _oContainer;
    };

    this._init();
}

