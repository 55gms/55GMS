function CExperiencePanel(iX, iY, oParentContainer){
    var _oContainer;
    var _oProgressBar;
    var _oLevel;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);
        
        _oProgressBar = new CProgressBar(0,0, _oContainer);  

        
        var oSprite = s_oSpriteLibrary.getSprite("label_cur_level");
        _oLevel = new CTextLabel(0,0, oSprite, _oContainer);
        
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oContainer);
    };
    
    this.setLevel = function(szLevel){
        _oLevel.refreshText(szLevel);
    };
    
    this.setFillByPercentage = function(iPerc){
        if(isNaN(iPerc)){
            iPerc = 100;
        }
        _oProgressBar.setPercentage(iPerc);
    };
    
    this.setBar = function(iCurExp, iNextLevel){
        sprintf(TEXT_XP, 0, 0);
        
        var iPercentage = iCurExp/iNextLevel*100;
        this.setFillByPercentage(iPercentage);
        
        if(iNextLevel === 0){
            _oProgressBar.refreshText(TEXT_XP_MAX);
        }else {
            _oProgressBar.refreshText(sprintf(TEXT_XP, Math.round(iCurExp), iNextLevel));
        }
    };  
    
    this.setScale = function(iScale){
        _oContainer.scale = iScale;
    };
    
    this.setLabelScale = function(iScale){
        _oLevel.setScale(iScale);
    };
    
    this._init();
    
}


