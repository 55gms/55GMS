function CStatPieChart(iX, iY, oParentContainer){
    var _iCurAngle;
    
    var _vRefPos;
    
    var _oContainer;
    var _oChartContainer;
    var _oLabelContainer;
    
    var _oTitle;

    this._init = function(){
        _iCurAngle = 0;
        
        _vRefPos = new CVector2(1,0);
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);
      
        var iWidth = PIECHART_RADIUS*2;
        var iHeight = 30;
        var iTextX = 0;
        var iTextY = -PIECHART_RADIUS - 35;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        _oTitle = new CTLText(     
                                    _oContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    24, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                                    4,0,
                                    sprintf(TEXT_STATS1_SHOTS_TAKEN, formatValue(0)),
                                    true, true, false,
                                    false
                                );  
        _oTitle.setShadow("#000",1,1,2);
      
        _oChartContainer = new createjs.Container();
        _oContainer.addChild(_oChartContainer);
      
        _oLabelContainer = new createjs.Container();
        _oContainer.addChild(_oLabelContainer);
    };

    this.unload = function(){
        oParentContainer.addChild(_oContainer);
    };

    this.setTitle = function(szTitle){
        _oTitle.refreshText(szTitle)
    };

    this.setArea = function(szLabel, szColor, iPercent){
        if(iPercent===0){
            return;
        }
        var iAngle = 360*iPercent/100;
        
        var oPiece = this._buildPiePiece(iAngle, szColor);
        oPiece.rotation = _iCurAngle;
        
        var vText = new CVector2(_vRefPos.getX(),_vRefPos.getY());
        vText.scalarProduct(PIECHART_RADIUS*0.95);
        var iMidAngle = (iAngle)/2 +_iCurAngle;
        var iAngleRad = degreesToRadians(iMidAngle);
        vText.rotate(iAngleRad);
        
        this._writeLabel(vText, szLabel, iPercent);
        
        _iCurAngle += iAngle;
    };

    this._buildPiePiece = function(iDeg, szColor){
        ///TO DRAW A PIECE OF PIE, WE FIRST DRAW THE ARC, AND THEN THE SUBTENDED TRIANGLE 
        ///IN CASE OF ANGLES >=180 THE TRIANGLE WILL AUTOMATIC SUBRACT FROM THE ARC
        
        var oPiece = new createjs.Shape();        
        oPiece.graphics.beginFill(szColor); 
        _oChartContainer.addChild(oPiece);
        
        ///DRAW ARC
        var iAngleRad = degreesToRadians(iDeg);
        oPiece.graphics.arc(0, 0, PIECHART_RADIUS, 0, iAngleRad, false);
        
        ///DRAW TRIANGLE
        ///ref vector
        var v1 = new CVector2(_vRefPos.getX(),_vRefPos.getY());
        v1.scalarProduct(PIECHART_RADIUS);
        
        ///first vertex
        oPiece.graphics.moveTo(0, 0);
        oPiece.graphics.lineTo(v1.getX(), v1.getY());
        
        ///second vertex
        v1.rotate(iAngleRad);
        oPiece.graphics.lineTo(v1.getX(), v1.getY());
        oPiece.graphics.lineTo(0, 0);

        return oPiece;
    };

    this._writeLabel = function(vPos, szLabel, iPercent){
        var oLine = new createjs.Shape();        
        oLine.graphics.beginStroke("#fff"); 
        _oLabelContainer.addChild(oLine);

        var szAlign;
        var iEndX;
        var iTextX;
        var iWidth = PIECHART_LABEL_LINE_LENGTH*0.8;
        if(vPos.getX()>0){
            szAlign = "right"
            iEndX = vPos.getX()+PIECHART_LABEL_LINE_LENGTH;
            iTextX = iEndX-iWidth/2;
        }else {
            szAlign = "left"
            iEndX = vPos.getX()-PIECHART_LABEL_LINE_LENGTH;
            iTextX = iEndX+iWidth/2;
        }
        
        oLine.graphics.moveTo(vPos.getX(), vPos.getY());
        oLine.graphics.lineTo(iEndX, vPos.getY());
        
        
        
        var iHeight = 26;
        var iYOffset = 14;
        
        var iTextY = vPos.getY() - iYOffset;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        var oLabel = new CTLText(     _oLabelContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    iHeight, szAlign, TEXT_COLOR, PRIMARY_FONT, 1,
                                    0,0,
                                    szLabel,
                                    true, true, false,
                                    false
                                );  
        oLabel.setShadow("#000",1,1,2);
        
        
        var iTextY = vPos.getY() + iYOffset;
        var oRect = new createjs.Rectangle( iTextX- iWidth/2, iTextY-iHeight/2, iWidth, iHeight);
        var oPercent = new CTLText(     _oLabelContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    20, szAlign, TEXT_COLOR, SECONDARY_FONT, 1,
                                    0,0,
                                    formatValue(iPercent),
                                    true, true, false,
                                    false
                                );  
        oPercent.setShadow("#000",1,1,2);
        
    };

    this.setScale = function(iScale){
        _oContainer.scale = iScale;
    };

    /*
    this.animExample = function(){
        var oPiece = new createjs.Shape();     
        var oParam = {angle:0}
        var oParent = this;
        createjs.Tween.get(oParam).to({angle:45}, 1000).on("change", function(){
            oPiece.graphics.clear();
            oPiece = oParent._buildPiePiece(oParam.angle, "#5891ad");
        });  
    };
    */
   
    this._init();
}


