function CProgressBar(iX, iY, oParentContainer){
    var _iWidth;
    var _iHeight;
    
    var _oContainer;
    var _oBarContainer;
    var _oBarFill;
    
    var _oText;
    
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);
        
        _oBarContainer = new createjs.Container();
        _oContainer.addChild(_oBarContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("experience_bar_bg");
        var oBarBg = createBitmap(oSprite);
        oBarBg.regY = oSprite.height/2;
        _oBarContainer.addChild(oBarBg);

        var oSprite = s_oSpriteLibrary.getSprite("experience_bar_fill");
        _oBarFill = createBitmap(oSprite);
        _oBarFill.regY = oSprite.height/2;
        _oBarContainer.addChild(_oBarFill);
        
        _iWidth = oSprite.width;
        _iHeight = oSprite.height;
        
        var oMask = new createjs.Shape();
        oMask.graphics.beginFill("rgba(0,0,0,1)").drawRoundRect(0, -_iHeight/2, _iWidth, _iHeight, 5);
        //_oContainer.addChild(oMask);
        
        _oBarFill.mask = oMask;
        
        var oSprite = s_oSpriteLibrary.getSprite("experience_bar_frame");
        var oBarFrame = createBitmap(oSprite);
        oBarFrame.regY = oSprite.height/2;
        _oBarContainer.addChild(oBarFrame);
        
        var iWidth = _iWidth;
        var iHeight = _iHeight;
        var iTextX = _iWidth/2;
        var iTextY = 2;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        _oText = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    24, "right", TEXT_COLOR_SOCIAL, PRIMARY_FONT, 1,
                                    4,0,
                                    " ",
                                    true, true, false,
                                    false
                                );      
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oContainer);
    };
    
    this.setPercentage = function(iPerc){
        var iX = linearFunction(iPerc, 0, 100, -_iWidth, 0);
        _oBarFill.x = iX;
    };
    
    this.refreshText = function(szText){
        _oText.refreshText(szText);
    };  
    
    this.setScale = function(iScale){
        _oContainer.scale = iScale;
    };
    
    this.setVisible = function(bVal){
        _oContainer.visible = bVal;
    };
    
    this.setFont = function(szFont){
        _oText.setFont(szFont);
    };
    
    this.scaleBarX = function(iScale){
        _oBarContainer.scaleY = iScale;
    };
    
    this.scaleBarY = function(iScale){
        _oBarContainer.scaleY = iScale;
    };
    
    this.setFontSize = function(iSize){
        _oText.setHeight(iSize);
        _oText.setFontSize(iSize);
        _oText.setY(-12);
    };
    
    this._init();
}


