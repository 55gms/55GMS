function CRadialWipeWidget(iX, iY, oParentContainer){
    
    var _bHurryUPMode;
    var _iDoublePI;
    var _iTimeHurryUp;
    
    var _szMaskColor;
    
    var _oMask;
    var _oText;
    var _oContainer;
    
    this._init = function(iX, iY, oParentContainer){
        _bHurryUPMode = false;
        
        _iDoublePI = Math.PI*2;
        _iTimeHurryUp = 0;
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX; 
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);
        
        //_szMaskColor = createjs.Graphics.getRGB(Math.random()*0xFFFFFF)
        _szMaskColor = createjs.Graphics.getRGB(0xd08f3a);
        
        // Create the Shape
        _oMask = new createjs.Shape();//.set({x:CANVAS_WIDTH/2, y:CANVAS_HEIGHT/2});
        _oMask.rotation = -90;
        _oMask.alpha = 1;
        _oContainer.addChild(_oMask);

        _oText = new createjs.Text(""," 60px "+PRIMARY_FONT, "#ffffff");
        _oText.textAlign = "center";
        _oText.textBaseline = "alphabetic";
        _oText.y = 20;
        _oText.shadow = new createjs.Shadow("#000000", 5, 5, 10);
        _oContainer.addChild(_oText);
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oContainer);
    };
    
    this.setPos = function(iX, iY){
        _oContainer.x = iX;
        _oContainer.y = iY;
    };
    
    this.reset = function(){
        _oText.color = "#ffffff";
    };
    
    this.setVisible = function(bVal){
        _oContainer.visible = bVal;
    };
    
    this.setScale = function(iVal){
        _oContainer.scaleX = _oContainer.scaleY = iVal;
    };
    
    this.setHurryUpMode = function(iTimeWarning){
        _bHurryUPMode = true;
        _iTimeHurryUp = iTimeWarning;
    };
    
    this.removeHurryUpMode = function(){
        _bHurryUPMode = false;
    };
    
    this._showHurryUpWarning = function(){
        _oText.color = "#ff0000";
        playSound("hurryup", 1, false);
        
        var oTremble = new CTremble(_oContainer, 1000, 50, 4);
    };
    
    this._updateTimeText = function(iCurTime){
        var szTimeText = Math.ceil(iCurTime/1000);
        _oText.text = szTimeText;
    };
    
    this._updateRadialWipe = function(iCurTime, iStartTime){
        var iFinalDeg = linearFunction(iCurTime, iStartTime, 0, 0, 360);

        _oMask.graphics.clear();
        _oMask.graphics.f(_szMaskColor);
        _oMask.graphics.moveTo(0,0);
        _oMask.graphics.arc(0,0,50,0,degreesToRadians(iFinalDeg), true);
    };
    
    this.update = function(iCurTime, iStartTime){
        this._updateTimeText(iCurTime);
        this._updateRadialWipe(iCurTime, iStartTime);
        
        if(iCurTime === 0){
            _oText.text = "";
            _oMask.graphics.clear();
        }
        
        if(_bHurryUPMode){
            if(iCurTime < _iTimeHurryUp){
                _bHurryUPMode = false;
                this._showHurryUpWarning();
            }
        }
    };
    
    this._init(iX, iY, oParentContainer);
}


