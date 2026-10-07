function CCell(iX, iY, iType, iRow, iCol, oParentContainer, oPieceContainer, oKnightContainer){

    var _iRow;
    var _iCol;
    
    var _oCellContainer;
    var _oParent;
    var _oPiece;
    var _oClickArea;
    var _oThreat;
    var _oHighlight;
    var _oListener
    
    this._init = function(iX, iY, iType, iRow, iCol, oParentContainer, oPieceContainer, oKnightContainer){
        
        _iRow = iRow;
        _iCol = iCol;
        
        _oCellContainer = new createjs.Container();
        _oCellContainer.x = iX;
        _oCellContainer.y = iY;
        oParentContainer.addChild(_oCellContainer);
        
        _oPiece = null;

        var oSprite = s_oSpriteLibrary.getSprite('highlight');
        _oHighlight = createBitmap(oSprite);
        _oHighlight.regX = oSprite.width/2;
        _oHighlight.regY = oSprite.height/2;
        _oHighlight.alpha = 0.8;
        _oHighlight.visible = false;
        _oCellContainer.addChild(_oHighlight);
        
        var oSprite = s_oSpriteLibrary.getSprite('threat');
        _oThreat = createBitmap(oSprite);
        _oThreat.regX = oSprite.width/2;
        _oThreat.regY = oSprite.height/2;
        _oThreat.visible = false;
        _oCellContainer.addChild(_oThreat);
        
        _oClickArea = new createjs.Shape();
        _oClickArea.graphics.beginFill("rgba(158,0,0,0.01)").drawRect(-CELL_LENGTH/2, -CELL_LENGTH/2, CELL_LENGTH, CELL_LENGTH);
        _oListener = _oClickArea.on("mousedown", this._onCellClick);
        _oCellContainer.addChild(_oClickArea);
        
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oCellContainer);
        _oClickArea.off("mousedown", _oListener);
    };  
    
    this.setClickableArea = function(bVal){  
        _oClickArea.visible = bVal;       
    }; 
    
    this.changePiece = function(szColor, szType){
        var aOldHistory = _oPiece.getHistory();
        _oPiece.unload();
        
        _oPiece = new CPiece(iX, iY, szColor, szType, oPieceContainer, oKnightContainer);
        _oPiece.setHistory(aOldHistory);
        
        _oPiece.setNewMoveInHistory(s_oGame.getNewHistoryID(), iRow, iCol, szType);
    };
    
    this.createPiece = function(iId, szColor, szType){
        _oPiece = new CPiece(iX, iY, szColor, szType, oPieceContainer, oKnightContainer);
        _oPiece.setNewMoveInHistory(iId, iRow, iCol, szType);
    };
    
    this.getPieceContainer = function(){
        return _oPiece.getContainer();
    };
    
    this.setPiece = function(oPiece){
        _oPiece = oPiece;
    };
    
    this.getType = function(){
        if(_oPiece !== null){
            return _oPiece.getType();
        } else{
            return null;
        }
    };
    
    this.getColor = function(){
        if(_oPiece !== null){
            return _oPiece.getColor();
        } else{
            return null;
        }
    };
    
    this.getPieceHistory = function(){
        if(_oPiece !== null){
            return _oPiece.getHistory();
        }else {
            return [];
        }
    };
    
    this.threat = function(bVal){
        _oThreat.visible = bVal;
    };
    
    this.highlight = function(bVal){
        _oHighlight.visible = bVal;
    };

    this.isHighlight = function(){
        return _oHighlight.visible;
    };

    this._onCellClick = function(){
        
        s_oGame.cellClicked(_iRow, _iCol);
    };
    
    this.setActive = function(bVal){
        if(_oPiece !== null){
            _oPiece.setActive(bVal);
        };
    };
    
    this.setVisible = function(bVal){
        _oCellContainer.visible = bVal;
    };
    
    this.getPos = function(){
        return {x: iX, y:iY};
    };

    this.getLogicPos = function(){
        return {row: iRow, col: iCol};
    };
    
    this.move = function(oDestCell){
        _oPiece.move(oDestCell);
        _oPiece = null;
    };
    
    this.shift = function(oDestCell){
        _oPiece.shift(oDestCell);
        _oPiece = null;
    };
    
    this.eatUp = function(){
        _oPiece.disappear();
    };
    
    _oParent = this;
    this._init(iX, iY, iType, iRow, iCol, oParentContainer, oPieceContainer, oKnightContainer);
}