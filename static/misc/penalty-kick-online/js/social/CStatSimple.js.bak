function CStatSimple(iX, iY, oParentContainer, szTitle){
    var _oContainer;
    var _oNum;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("stat_simple_bg");
        var oBg = createBitmap(oSprite);
        oBg.regX = oSprite.width * 0.5;
        oBg.regY = oSprite.height * 0.5;
        _oContainer.addChild(oBg);
        
        var iWidth = oSprite.width - 20;
        var iHeight = 30;
        var iTextX = 0;
        var iTextY = -20;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        var oTitle = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    24, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    szTitle,
                                    true, true, false,
                                    false
                                );  
        oTitle.setShadow("#000",1,1,2);
        
        
        var iHeight = 40;
        var iTextX = 0;
        var iTextY = 16;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        _oNum = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    36, "center", TEXT_COLOR, SECONDARY_FONT, 1,
                                    4,0,
                                    "0",
                                    true, true, false,
                                    false
                                );  
        _oNum.setShadow("#000",1,1,2);
    };
    
    this.unload = function(){
        oParentContainer.addChild(_oContainer);
    };
    
    this.setNum = function(szNum){
        _oNum.refreshText(szNum);
    };
    
    this._init();
}


