function CAchievementWidget(iX, iY, oParentContainer, szTitle, szDescr){
    var _oContainer;
    var _oBg;
    var _oIcon;
    var _oProgressBar;
    var _oTitle;
    var _oDescr;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oContainer.scale = 1;
        oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("achievement_off_panel");
        _oBg = createBitmap(oSprite);
        _oBg.regX = oSprite.width * 0.5;
        _oBg.regY = oSprite.height * 0.5;
        _oContainer.addChild(_oBg);
        
        var oSprite = s_oSpriteLibrary.getSprite("achi0_off");
        _oIcon = createBitmap(oSprite);
        _oIcon.x = -58;
        _oIcon.y = -6;
        _oIcon.regX = oSprite.width * 0.5;
        _oIcon.regY = oSprite.height * 0.5;
        _oContainer.addChild(_oIcon);

        var iInfoX = -30;

        _oProgressBar = new CProgressBar(iInfoX,20,_oContainer);
        _oProgressBar.setPercentage(0);
        _oProgressBar.setScale(0.4);
        _oProgressBar.scaleBarY(1.4);
        _oProgressBar.setFontSize(32);
        //_oProgressBar.setFont(PRIMARY_FONT);

        var iWidth = 120;
        var iHeight = 16;
        var iTextX = iInfoX + iWidth/2;
        var iTextY = -30;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        _oTitle = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    14, "left", TEXT_COLOR_SOCIAL_DISABLED, PRIMARY_FONT, 1,
                                    2,0,
                                    szTitle,
                                    true, true, false,
                                    false
                                );      
        _oTitle.setShadow("#000",1,1,2)
                        
        var iHeight = 36;
        var iTextX = iInfoX + iWidth/2;
        iTextY += 24;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        _oDescr = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    10, "left", TEXT_COLOR_SOCIAL_DISABLED, SECONDARY_FONT, 1,
                                    2,0,
                                    szDescr,
                                    true, true, true,
                                    false
                                );  
        _oDescr.setShadow("#000",1,1,2)
        
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oContainer);
    };
    
    this.setActive = function(){
        var oSprite = s_oSpriteLibrary.getSprite("achievement_on_panel");
        _oBg.image = oSprite;
        
        var oSprite = s_oSpriteLibrary.getSprite("achi0_on");
        _oIcon.image = oSprite;
        _oIcon.regX = oSprite.width * 0.5;
        _oIcon.regY = oSprite.height * 0.5;
        
        _oTitle.setColor("#fff");
        _oDescr.setColor("#fff");
        
        _oProgressBar.setVisible(false);
    };
    
    this.setToComplete = function(){
        var oSprite = s_oSpriteLibrary.getSprite("achievement_off_panel");
        _oBg.image = oSprite;
        
        var oSprite = s_oSpriteLibrary.getSprite("achi0_off");
        _oIcon.image = oSprite;
        _oIcon.regX = oSprite.width * 0.5;
        _oIcon.regY = oSprite.height * 0.5;
        
        _oTitle.setColor(TEXT_COLOR_SOCIAL_DISABLED);
        _oDescr.setColor(TEXT_COLOR_SOCIAL_DISABLED);
    };
    
    this.setProgress = function(iCur, iTarget){
        _oProgressBar.refreshText(iCur + " / " + iTarget);
        
        var iPerc = iCur/iTarget*100;
        _oProgressBar.setPercentage(iPerc);
        
        if(iCur >= iTarget){
            this.setActive();
        }/*else {
            this.set
        }*/
        
        if(iTarget === 1){
            _oProgressBar.setVisible(false);
        }
    };
    
    this.getContainer = function(){
        return _oContainer;
    };
    
    this.setScale = function(iScale){
        _oContainer.scale = iScale;
    };
    
    this._init();
}


