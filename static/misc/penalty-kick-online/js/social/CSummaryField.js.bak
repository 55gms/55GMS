function CSummaryField(iX, iY, oParentContainer, szLabel, iSize){
    var _iWidth;
    
    var _oContainer;
    var _oLabel;
    var _oScore;
    
    this._init = function(){
        _iWidth = 340;
        var iOffset = 10;
        //var iSize = 24;
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);
        
        var iWidth = _iWidth*0.65;
        var iHeight = iSize;
        var iTextX = -_iWidth/2-iOffset/2;
        var iTextY = 0;
        var oRect = new createjs.Rectangle( iTextX, iTextY-iHeight/2, iWidth, iHeight);
        _oLabel = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    iSize, "left", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    szLabel,
                                    true, true, false,
                                    false
                                );  
             
        
        var iWidthScore = _iWidth-iWidth;
        //var iHeight = 30;
        var iTextX = -_iWidth/2+iWidth+iOffset/2;
        //var iTextY = 0;
        var oRect = new createjs.Rectangle( iTextX, iTextY-iHeight/2, iWidthScore, iHeight);
        _oScore = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    iSize, "right", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    "0",
                                    true, true, false,
                                    false
                                );  
        
        
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oContainer);
    };
    
    this.setLabel = function(szLabel){
        _oLabel.refreshText(szLabel);
    };
    
    this.setScore = function(iScore){
        _oScore.refreshText(iScore);
    };
    
    this.setColor = function(szColor){
        _oLabel.setColor(szColor);
        _oScore.setColor(szColor);
    };
    
    this.setVisible = function(bVal){
        _oContainer.visible = bVal;
    };
    
    this._init();
    
}


