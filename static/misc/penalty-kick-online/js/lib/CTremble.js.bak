function CTremble(oElement, iDuration, iFrequency, iStrength){
    var _bTremble;
    var _bAlternateTremble;
    
    var _iIdInterval;
    var _iCurTrembleIndex;
    var _iLastTrembleIndex;
    
    var _oStartPos;
    var _oParent;
    
    this._init = function(oElement, iDuration, iFrequency, iStrength){
        _bTremble = false;
        _bAlternateTremble = false;
        _iCurTrembleIndex = 0;
        
        this._calculateDuration();
        
        _oStartPos = {x:oElement.x, y: oElement.y};
        
        if(!_bTremble){
            _bTremble = true;
            _iIdInterval = setInterval(function(){_oParent._tremble();},iFrequency);
        } 
    };
    
    this._tremble = function(){
        _bAlternateTremble = !_bAlternateTremble;
        
        if(_bAlternateTremble){
            var iSignX = Math.random();
            var iNumberX = iStrength;
            var iDirX;
            if(iSignX < 0.5){
                iDirX = - iNumberX;             
            } else {
                iDirX = iNumberX;
            }
            var iSignY = Math.random();
            var iNumberY = iStrength;
           
            var iDirY;
            if(iSignY < 0.5){
                iDirY = - iNumberY;             
            } else {
                iDirY = iNumberY;
            }
            
            oElement.x += iDirX;
            oElement.y += iDirY;

        } else {
            oElement.x = _oStartPos.x;
            oElement.y = _oStartPos.y;

        }
        
        
        _iCurTrembleIndex++;
        if(_iCurTrembleIndex > _iLastTrembleIndex){
            _iCurTrembleIndex = 0;
            _bTremble = false;
            
            oElement.x = _oStartPos.x;
            oElement.y = _oStartPos.y;
            
            if(iDuration === 0){
                _iIdInterval = setInterval(function(){_oParent._tremble();},iFrequency);
            }else {
                clearInterval(_iIdInterval);
            }   
        }
    };
    
    this._calculateDuration = function(){
        _iLastTrembleIndex = iDuration/iFrequency;
    };  
    
    this.stopTremble = function(){
        clearInterval(_iIdInterval);
    };
    
    _oParent = this;
    this._init(oElement, iDuration, iFrequency, iStrength);
}

