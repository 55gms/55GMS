function CStatHotZones(iX, iY, oParentContainer){
    var _oContainer;
    var _oTitle;
    var _oContentContainer;
    var _oDesc;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);
        
        var iWidth = 200;
        var iHeight = 30;
        var iTextX = 0;
        var iTextY = -100;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        _oTitle = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    24, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    TEXT_HOT_ZONES,
                                    true, true, false,
                                    false
                                );  
        _oTitle.setShadow("#000",1,1,2);
        
        _oContentContainer = new createjs.Container();
        _oContainer.addChild(_oContentContainer);
        

        var iWidth = 540;
        var iHeight = 30;
        var iTextX = 0;
        var iTextY = 95;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        _oDesc = new CTLText(     _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    18, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    " ",
                                    true, true, true,
                                    false
                                );  
        _oDesc.setShadow("#000",1,1,2);
        
    };
    
    this.unload = function(){
        oParentContainer.addChild(_oContainer);
    };
    
    this.addContent = function(oImage){
        _oContentContainer.addChild(oImage);
    };
    
    this.setTitleY = function(iY){
        _oTitle.setY(iY);
    };
    
    this.setDesc = function(szDesc){
        _oDesc.refreshText(szDesc);
    };
    
    this.setDescY = function(iY){
        _oDesc.setY(iY);
    };
    
    this.setZones = function(oRect, aMatrix){
        var oGridContainer = new createjs.Container();
        oGridContainer.x = oRect.x;
        oGridContainer.y = oRect.y;
        _oContentContainer.addChild(oGridContainer);
        
        

        var szColor = TEXT_COLOR_SOCIAL2;
        //var szColor = "#ff6f31";
        var iStrokeSize = 3;
       
        var oShape = new createjs.Shape();
        oShape.graphics.setStrokeStyle(iStrokeSize);
        oGridContainer.addChild(oShape);
       
        ///SET BORDER
        this._setBorder(oShape, oRect, szColor);
        
        ///SET LINES
        var iRows = aMatrix.length;
        var iCols = aMatrix[0].length;

        this._setHorizontalLine(oShape, oRect, szColor, iRows);
        this._setVerticalLine(oShape, oRect, szColor, iCols);
        
        ///SET PERCENT
        this._setPercent(oRect, aMatrix, oGridContainer);
        
    };
    
    this._setBorder = function(oShape, oRect, szColor){
        oShape.graphics.beginStroke(szColor);
        oShape.graphics.moveTo(-oRect.width/2, -oRect.height/2);
        oShape.graphics.lineTo(oRect.width/2, -oRect.height/2);
        oShape.graphics.lineTo(oRect.width/2, oRect.height/2);
        oShape.graphics.lineTo(-oRect.width/2, oRect.height/2);
        oShape.graphics.lineTo(-oRect.width/2, -oRect.height/2);
        
        oShape.graphics.closePath();
        oShape.graphics.endStroke();
    };
    
    this._setHorizontalLine = function(oShape, oRect, szColor, iRows){
        var iNumHorizontalLine = iRows-1;
        
        var iRowHeight = oRect.height/iRows;
        var iY = -oRect.height/2 + iRowHeight;
        oShape.graphics.beginStroke(szColor);
        for(var i=0; i<iNumHorizontalLine; i++){
            oShape.graphics.moveTo(-oRect.width/2, iY);
            oShape.graphics.lineTo(oRect.width/2, iY);
            iY+= iRowHeight;
        }
        oShape.graphics.endStroke();
    };
    
    this._setVerticalLine= function(oShape, oRect, szColor, iCols){
        var iNumVerticalLine = iCols-1;
        
        var iColWidth = oRect.width/iCols;
        var iX = -oRect.width/2 + iColWidth;
        oShape.graphics.beginStroke(szColor);
        for(var i=0; i<iNumVerticalLine; i++){
            oShape.graphics.moveTo(iX, -oRect.height/2);
            oShape.graphics.lineTo(iX, oRect.height/2);
            iX+= iColWidth;
        }
        oShape.graphics.endStroke();
    };
    
    this._setPercent = function(oRect, aMatrix, oContainer){
        var base = new KolorWheel("#00ff00");
        var aColorRange = base.abs("#ff0000",101);

        var iRows = aMatrix.length;
        var iCols = aMatrix[0].length;

        var iCurCol = 0;
        var iCurRow = 0;
        
        var iTextWidth = oRect.width/iCols;
        var iTextHeight = oRect.height/iRows;
        var iWidth = oRect.width - iTextWidth;
        var iHeight = oRect.height - iTextHeight;
        
        var aText = new Array();
        for(var i=0; i<aMatrix.length; i++){
            aText[i] = new Array();
            for(var j=0; j<aMatrix[i].length; j++){
                var iX = -iWidth/2 + iCurCol*(iWidth/(iCols-1));
                var iY = -iHeight/2 + iCurRow*(iHeight/(iRows-1));
                
                if(aMatrix[i][j] === null){
                    var szColor = "white";
                    var szText = TEXT_NO_SHOTS;
                }else {
                    var iColorIndex = Math.floor(aMatrix[i][j]);
                    var szColor = aColorRange.get(iColorIndex).getHex();
                    var szText = formatValue( aMatrix[i][j] );
                }
                

                var oTextRect = new createjs.Rectangle( iX- iTextWidth/2, iY-iTextHeight/2, iTextWidth, iTextHeight);
                aText[i][j] = new CTLText(     oContainer, 
                                            oTextRect.x, oTextRect.y, oTextRect.width, oTextRect.height, 
                                            40, "center", szColor, PRIMARY_FONT, 1,
                                            20,0,
                                            szText,
                                            true, true, false,
                                            false
                                        );      
                aText[i][j].setShadow("#000",1,1,2);
                
                iCurCol++;
                if(iCurCol === iCols){  
                    iCurCol = 0;
                    iCurRow++;
                }
            }
        }
    };
    
    this._init();
}


