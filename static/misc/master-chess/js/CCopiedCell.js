function CCopiedCell(oCell){
    

    var _szColor;
    var _szType;
    var _aHistory;
    var _iRow;
    var _iCol;
    
    this._init = function(oCell){
        _szColor = oCell.getColor();
        _szType = oCell.getType();
        
        _iRow = oCell.getLogicPos().row;
        _iCol = oCell.getLogicPos().col;
        
        var aHistList = oCell.getPieceHistory();
        _aHistory = new Array();
        for(var i=0; i<aHistList.length; i++){
            _aHistory[i] = aHistList[i];
        }
    };
    
    this.setCell = function(szColor, szType, iRow, iCol, aHistory){
        _szColor = szColor;
        _szType = szType;
        _iRow = iRow;
        _iCol = iCol;
        
        
        for(var i=0; i<aHistory.length; i++){
            _aHistory[i] = aHistory[i];
        }
        
    };
    
    this.setColor = function(szValue){
        _szColor = szValue;
    };
    
    this.setType = function(szValue){
        _szType = szValue;
    };
    
    this.getColor = function(){
        return _szColor;
    };
    
    this.getType = function(){
        return _szType;
    };
    
    this.getLogicPos = function(){
        return {row:_iRow, col:_iCol};
    };
    
    this.getPieceHistory = function(){
        return _aHistory;
    };
    
    this._init(oCell);
}

