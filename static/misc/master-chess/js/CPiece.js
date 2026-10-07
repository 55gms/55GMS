function CPiece(iX, iY, szColor, szType, oParentContainer, oKnightContainer){
    var _szColor;
    var _szType;
    
    var _aMovesHistory;
    
    var _oParent;
    var _oPiece;
    
    this._init = function(iX, iY, szColor, szType, oParentContainer, oKnightContainer){
        _szColor = szColor;
        _szType = szType;
        
        _aMovesHistory = new Array();

        var szSpriteName = this._getSpriteName();
        
        var oSprite = s_oSpriteLibrary.getSprite(szSpriteName);

        var iWidth = oSprite.width/2;
        var iHeight = oSprite.height;
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: iHeight, regX: iWidth/2, regY: iHeight-40}, 
                        animations: {idle:[0], lit:[1]}
                   };

        var oSpriteSheet = new createjs.SpriteSheet(oData);        
        _oPiece = createSprite(oSpriteSheet,"idle",0,0,0,0);        
        _oPiece.x = iX;
        _oPiece.y = iY;       
        oParentContainer.addChild(_oPiece);
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oPiece);
    };
    
    this._getSpriteName = function(){
        var szSpriteColor;
        if(szColor === WHITE){
            szSpriteColor = "white";
        }else {
            szSpriteColor = "black";
        }
        
        var szSpriteType;
        switch(szType){
            case PAWN:{
                    szSpriteType = "pawn";
                    break;
            }
            case ROOK:{
                    szSpriteType = "rook";
                    break;
            }
            case KNIGHT:{
                    szSpriteType = "knight";
                    break;
            }
            case BISHOP:{
                    szSpriteType = "bishop";
                    break;
            }
            case QUEEN:{
                    szSpriteType = "queen";
                    break;
            }
            case KING:{
                    szSpriteType = "king";
                    break;
            }
        }
        
        return szSpriteColor +"_"+szSpriteType;
        
    };
    
    this.getContainer = function(){
        return _oPiece;
    };
    
    this.getType = function(){
        return _szType;
    };
    
    this.getColor = function(){
        return _szColor;
    };
    
    this.setPos = function(iX, iY){
        _oPiece.x = iX;
        _oPiece.y = iY;
    };
    
    this.getPos = function(){
        return {x:_oPiece.x, y:_oPiece.y};
    };
    
    this.setNewMoveInHistory = function(iId, iRow, iCol, szPieceType){
        _aMovesHistory.push({id:iId, row:iRow, col:iCol, piece:szPieceType});
    };
    
    this.setHistory = function(aHistory){
        _aMovesHistory = new Array();
        for(var i=0; i<aHistory.length; i++){
            _aMovesHistory[i] = aHistory[i];
        }
    };
    
    this.getHistory = function(){
        return _aMovesHistory;
    };
    
    this.setActive = function(bVal){
        if(bVal){
            _oPiece.gotoAndStop("lit");
        } else {
            _oPiece.gotoAndStop("idle");
        }
    };
    
    this.move = function(oDestinationCell){
        var oPos = oDestinationCell.getPos();
        if(_szType === KNIGHT){
            oKnightContainer.addChild(_oPiece);
            new createjs.Tween.get(_oPiece).to({scaleX:1.3, scaleY:1.3}, TIME_MOVE*0.4, createjs.Ease.cubicOut).to({scaleX:1, scaleY:1}, 600);
        } else if(_szType === PAWN){
            s_oBoardStateController.resetStall();
        }
        new createjs.Tween.get(_oPiece).to({x:oPos.x, y:oPos.y}, TIME_MOVE, createjs.Ease.cubicOut).call(function(){
            s_oBoardStateController.increaseStallCount();
            if(_szType === KNIGHT){
                oParentContainer.addChild(_oPiece);
            }
            oDestinationCell.setPiece(_oParent);
            s_oGame.onFinishMove();
            _oParent.setNewMoveInHistory(s_oGame.getNewHistoryID(), oDestinationCell.getLogicPos().row, oDestinationCell.getLogicPos().col, _szType);
        });
    };
    
    this.shift = function(oDestinationCell){
        var oPos = oDestinationCell.getPos();
        
        new createjs.Tween.get(_oPiece).to({x:oPos.x, y:oPos.y}, 1000, createjs.Ease.cubicOut).call(function(){
            oDestinationCell.setPiece(_oParent);
            _oParent.setNewMoveInHistory(s_oGame.getNewHistoryID(), oDestinationCell.getLogicPos().row, oDestinationCell.getLogicPos().col, _szType);
        });
    };
    
    this.disappear = function(){
        new createjs.Tween.get(_oPiece).to({alpha:0}, 1000).call(function(){
            s_oBoardStateController.resetStall();
            _oParent.unload();
        });
    };
    
    _oParent =  this;
    this._init(iX, iY, szColor, szType, oParentContainer, oKnightContainer);
}


