function CTextLabel(iX, iY, oSprite, oParentContainer){
    var _oContainer;
    var _oText;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);
        
        var oBg = createBitmap(oSprite);
        oBg.regX = oSprite.width/2;
        oBg.regY = oSprite.height/2;
        _oContainer.addChild(oBg);
        
        var iWidth = oSprite.width;
        var iHeight = oSprite.height;
        var iTextX = 0;
        var iTextY = 2;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        _oText = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    30, "center", TEXT_COLOR_SOCIAL, PRIMARY_FONT, 1,
                                    4,0,
                                    "",
                                    true, true, false,
                                    false
                                );
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oContainer);
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
    
    this._init();
}


