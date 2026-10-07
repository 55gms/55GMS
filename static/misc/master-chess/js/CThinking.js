function CThinking(){
    var _bStart;
    
    var _iTimeElaps;
    
    var _oGroup;
    var _oText;
    var _oTextDots;
    var _oRect;
    var _oListener;
    
    this._init = function(){
        _bStart = true;
      
        _iTimeElaps=0;
      
        _oGroup = new createjs.Container();
        
        var graphics = new createjs.Graphics().beginFill("rgba(0,0,0,0.3)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oRect = new createjs.Shape(graphics);
        _oListener = _oRect.on("click", function(){});
  
        _oText = new createjs.Text(TEXT_THINKING,"bold 60px "+PRIMARY_FONT, "#ffffff");
        _oText.x = CANVAS_WIDTH*0.5;
        _oText.y = CANVAS_HEIGHT*0.5 -100;
        _oText.textAlign = "center";
        _oText.textBaseline = "alphabetic";
        _oText.lineWidth = 800;          
 
        _oTextDots = new createjs.Text("","bold 180px "+PRIMARY_FONT, "#ffffff");
        _oTextDots.x = CANVAS_WIDTH*0.5 - 76;
        _oTextDots.y = CANVAS_HEIGHT*0.5 -50;
        _oTextDots.textAlign = "left";
        _oTextDots.textBaseline = "alphabetic";
        _oTextDots.lineWidth = 800;     
        
        _oGroup.addChild(_oRect, _oText, _oTextDots);
        
        s_oStage.addChild(_oGroup);
    };
    
    this.unload = function(){
        _bStart =false;
        _oRect.off("click", _oListener);
        s_oStage.removeChild(_oGroup);
    };
    
    this.update = function(){
        if(_bStart){
            _iTimeElaps += s_iTimeElaps;
        
            if(_iTimeElaps >= 0 && _iTimeElaps < TIME_LOOP_WAIT/4){
                _oTextDots.text = "";
            } else if (_iTimeElaps >= TIME_LOOP_WAIT/4 && _iTimeElaps < TIME_LOOP_WAIT*2/4){
                _oTextDots.text = ".";
            } else if (_iTimeElaps >= TIME_LOOP_WAIT*2/4 && _iTimeElaps < TIME_LOOP_WAIT*3/4){
                _oTextDots.text = "..";
            } else if (_iTimeElaps >= TIME_LOOP_WAIT*3/4 && _iTimeElaps < TIME_LOOP_WAIT){
                 _oTextDots.text = "...";
            } else {
                _iTimeElaps = 0;
            }
                
        }
        
        
    };
    
    this._init();
    
}; 
