function CStatHistogram(iX, iY, oParentContainer){
    var _iMaxHeight;
    var _iBarWidth;
    var _iSpaceOffset;
    var _iNumSectionAdded;
    
    var _oContainer;
    var _oTitle;
    var _oChartContainer;
    
    this._init = function(){
        _iMaxHeight = 260;
        _iBarWidth = 100;
        _iSpaceOffset = 26;
        _iNumSectionAdded = 0;
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);
        
        var iWidth = 200;
        var iHeight = 30;
        var iTextX = 0;
        var iTextY = -160;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        _oTitle = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    24, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    TEXT_STATS3_ACCURACY,
                                    true, true, false,
                                    false
                                );  
        _oTitle.setShadow("#000",1,1,2);
        
        _oChartContainer = new createjs.Container();
        _oChartContainer.y = 200;
        _oContainer.addChild(_oChartContainer);
        
    };
    
    this.unload = function(){
        oParentContainer.addChild(_oContainer);
    };
    
    this.addValue = function(szLabel, szColor, iPercent){
        var iSectionWidth = _iBarWidth+2*_iSpaceOffset;
        
        var oSectionContainer = new createjs.Container();
        oSectionContainer.x = _iNumSectionAdded*iSectionWidth;
        _oChartContainer.addChild(oSectionContainer);

        var iWidth = iSectionWidth;
        var iHeight = 24;
        var iTextX = 0;
        var iTextY = 4;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        var oLabel = new CTLText(     oSectionContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    iHeight, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                                    2,0,
                                    szLabel,
                                    true, true, false,
                                    false
                                );  
        oLabel.setShadow("#000",1,1,2);
        
        var oSeparator = new createjs.Shape();
        oSeparator.y = -12;
        oSeparator.graphics.beginStroke("#fff");
        oSeparator.graphics.setStrokeStyle(2);
        oSeparator.graphics.moveTo(-iSectionWidth/2, 5);
        oSeparator.graphics.lineTo(-iSectionWidth/2, 0);
        oSeparator.graphics.lineTo(iSectionWidth/2, 0);
        oSeparator.graphics.lineTo(iSectionWidth/2, 5);
        oSectionContainer.addChild(oSeparator);
        
        var iBarHeight = linearFunction(iPercent, 0,100, 0, _iMaxHeight);
        
        var oBar = new createjs.Shape();
        oBar.graphics.beginFill(szColor).drawRect(-_iBarWidth/2,-iHeight,_iBarWidth, -iBarHeight);
        oSectionContainer.addChild(oBar);
        
        var iWidth = _iBarWidth;
        var iHeight = 26;
        var iTextX = 0;
        var iTextY = -iBarHeight-38;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        var oLabel = new CTLText(     oSectionContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    iHeight, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                                    2,0,
                                    formatValue(iPercent),
                                    true, true, false,
                                    false
                                );  
        oLabel.setShadow("#000",1,1,2);
        
        _oChartContainer.x = -(_iNumSectionAdded*iSectionWidth/2);
        
        _iNumSectionAdded++;
        
        
    };
    
    this._init();
}

