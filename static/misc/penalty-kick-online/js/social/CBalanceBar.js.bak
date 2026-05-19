function CBalanceBar(iX, iY, oParentContainer, szLeftLabel, szRightLabel){
    var _iWidth;
    var _iHeight;
    
    var _oContainer;
    var _oBarFill;
    
    var _oLeftText;
    var _oRightText;

    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("experience_bar_bg");
        var oBarBg = createBitmap(oSprite);
        oBarBg.regY = oSprite.height/2;
        _oContainer.addChild(oBarBg);
        
        _oContainer.regX = oSprite.width/2;
        
        var oSprite = s_oSpriteLibrary.getSprite("experience_bar_fill");
        _oBarFill = createBitmap(oSprite);
        _oBarFill.regY = oSprite.height/2;
        _oContainer.addChild(_oBarFill);
        
        _iWidth = oSprite.width;
        _iHeight = oSprite.height;
        
        var oMask = new createjs.Shape();
        oMask.graphics.beginFill("rgba(0,0,0,1)").drawRoundRect(0, -_iHeight/2, _iWidth, _iHeight, 5);
        //_oContainer.addChild(oMask);
        
        _oBarFill.mask = oMask;
        
        var oSprite = s_oSpriteLibrary.getSprite("experience_bar_frame");
        var oBarFrame = createBitmap(oSprite);
        oBarFrame.regY = oSprite.height/2;
        _oContainer.addChild(oBarFrame);
        
        var iWidth = oSprite.width/2;
        var iOffset = 5;

        var iHeight = _iHeight;
        var iTextX = -iWidth/2-iOffset;
        var iTextY = 2;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        var oLeftLabel = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    24, "right", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    szLeftLabel,
                                    true, true, false,
                                    false
                                );  
        oLeftLabel.setShadow("#000",1,1,2);
        
        var iHeight = _iHeight;
        var iTextX = oSprite.width +iWidth/2+iOffset;
        var iTextY = 2;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        var oRightLabel = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    24, "left", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    szRightLabel,
                                    true, true, false,
                                    false
                                );  
        oRightLabel.setShadow("#000",1,1,2);
        
        var iWidth = oSprite.width/4;
        var iHeight = _iHeight;
        var iTextX = iWidth/2+iOffset;
        var iTextY = 2;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        _oLeftText = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    24, "left", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    "0",
                                    true, true, false,
                                    false
                                );  
        _oLeftText.setShadow("#000",1,1,2);
        
        var iHeight = _iHeight;
        var iTextX = oSprite.width -iWidth/2-iOffset;
        var iTextY = 2;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        _oRightText = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    24, "right", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    "0",
                                    true, true, false,
                                    false
                                );  
        _oRightText.setShadow("#000",1,1,2);
        
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oContainer);
    };
    
    this.setPercentage = function(iPerc){
        var iX = linearFunction(iPerc, 0, 100, -_iWidth, 0);
        _oBarFill.x = iX;
    };
    
    this.refreshText = function(szLxText, szRxText){
        _oLeftText.refreshText(szLxText);
        _oRightText.refreshText(szRxText);
    };  
    
    this.setFont = function(szFont){
        _oLeftText.setFont(szFont);
        _oRightText.setFont(szFont);
    };
    
    this.setScale = function(iScale){
        _oContainer.scale = iScale;
    };
    
    this.setVisible = function(bVal){
        _oContainer.visible = bVal;
    };
    
    
    
    this._init();
}




