function CWaitingPanel(oParentContainer){
    var _iTimeElaps;
    var _iIdInterval;
    
    var _oContainer;
    var _oRect;
    var _oTextStroke;
    var _oText;
    var _oExplTextStroke;
    var _oExplText;
    var _oListener;
    
    this._init = function(oParentContainer){
        
        _oContainer = new createjs.Container();
        oParentContainer.addChild(_oContainer);
        
        var graphics = new createjs.Graphics().beginFill("rgba(0,0,0,0.5)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oRect = new createjs.Shape(graphics);
        _oListener = _oRect.on("click", function(){});
        _oContainer.addChild(_oRect);

        _oText = new createjs.Text(TEXT_WAIT_STRIKER, "42px " + PRIMARY_FONT, TEXT_COLOR);
        _oText.x = CANVAS_WIDTH*0.5 - _oText.getBounds().width/2;
        _oText.y = CANVAS_HEIGHT*0.5 +100;
        _oText.textAlign = "left";
        _oText.lineWidth = 800;         
        _oContainer.addChild(_oText);
        
        _oTextStroke = new createjs.Text(TEXT_WAIT_STRIKER, "42px " + PRIMARY_FONT, "#003470");
        _oTextStroke.x = _oText.x;
        _oTextStroke.y = _oText.y;
        _oTextStroke.textAlign = "left";
        _oTextStroke.lineWidth = 800;   
        _oTextStroke.outline = OUTLINE_WIDTH;
        _oContainer.addChild(_oTextStroke);
        
        _oExplText = new createjs.Text(TEXT_GET_READY, "42px " + PRIMARY_FONT, TEXT_COLOR);
        _oExplText.x = CANVAS_WIDTH*0.5;
        _oExplText.y = CANVAS_HEIGHT*0.5 +150;
        _oExplText.textAlign = "center";
        _oExplText.lineWidth = 800;         
        _oContainer.addChild(_oExplText);
        
        _oExplTextStroke = new createjs.Text(TEXT_GET_READY, "42px " + PRIMARY_FONT, "#003470");
        _oExplTextStroke.x = _oExplText.x;
        _oExplTextStroke.y = _oExplText.y;
        _oExplTextStroke.textAlign = "center";
        _oExplTextStroke.lineWidth = 800;   
        _oExplTextStroke.outline = OUTLINE_WIDTH;
        _oContainer.addChild(_oExplTextStroke);
        
        _oContainer.alpha = 0;
    };
    
    this.hide = function(){
        _oContainer.alpha = 0;
    };
    
    this.show = function(){
        _oContainer.alpha = 1;
    };
    
    this.hideGoalkeeperWaiting = function(){
        createjs.Tween.get(_oContainer).to({alpha:0}, 1000).call(function(){
            clearInterval(_iIdInterval);
        });
    };
    
    this.showGoalkeeperWaiting = function(){
        this.show();
        _iTimeElaps = 0;
        _oExplText.visible = true;
        _oExplTextStroke.visible = true;
        
        _oText.text = TEXT_WAIT_STRIKER;
        _oTextStroke.text = TEXT_WAIT_STRIKER;
        
        _oText.x = CANVAS_WIDTH*0.5 - _oText.getBounds().width/2;
        _oTextStroke.x = _oText.x;

        var oThis = this;
        _iIdInterval = setInterval(function(){
            oThis._updateGoalkeeperWaitingText();
        }, FPS);
    };
    
    this._updateGoalkeeperWaitingText = function(){
        _iTimeElaps += s_iTimeElaps;
        
        if(_iTimeElaps >= 0 && _iTimeElaps < TIME_LOOP_WAIT/4){
            _oText.text = TEXT_WAIT_STRIKER;
        } else if (_iTimeElaps >= TIME_LOOP_WAIT/4 && _iTimeElaps < TIME_LOOP_WAIT*2/4){
            _oText.text = TEXT_WAIT_STRIKER + ".";
        } else if (_iTimeElaps >= TIME_LOOP_WAIT*2/4 && _iTimeElaps < TIME_LOOP_WAIT*3/4){
            _oText.text = TEXT_WAIT_STRIKER + "..";
        } else if (_iTimeElaps >= TIME_LOOP_WAIT*3/4 && _iTimeElaps < TIME_LOOP_WAIT){
             _oText.text = TEXT_WAIT_STRIKER + "...";
        } else {
            _iTimeElaps = 0;
        }
        _oTextStroke.text = _oText.text;
    };
    
    this.showStrikerWaiting = function(){
        _oExplText.visible = false;
        _oExplTextStroke.visible = false;
        
        _oText.text = TEXT_WAIT_GOALKEEPER;
        _oTextStroke.text = TEXT_WAIT_GOALKEEPER;
        
        _oText.x = CANVAS_WIDTH*0.5 - _oText.getBounds().width/2;
        _oTextStroke.x = _oText.x;
        
        createjs.Tween.get(_oContainer).to({alpha:1}, 1000);
    };
    
    this.hideStrikerWaiting = function(){
        createjs.Tween.get(_oContainer).to({alpha:0}, 1000).call(function(){
            clearInterval(_iIdInterval);
        });
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oContainer);
        _oRect.off("click", _oListener);
    };
    
    this._init(oParentContainer);
    
};

