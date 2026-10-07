var DIR_TOPRIGHT = "DIR_TOPRIGHT";
var DIR_RIGHT = "DIR_RIGHT";
var DIR_BOTRIGHT = "DIR_BOTRIGHT";
var DIR_TOPLEFT = "DIR_TOPLEFT";
var DIR_LEFT = "DIR_LEFT";
var DIR_BOTLEFT = "DIR_BOTLEFT";
var DIR_TOP = "DIR_TOP";
var DIR_BOT = "DIR_BOT";

function CMovesController(aMatrix){
    var _iRow;
    var _iCol;
    
    var _aMatrixMap;
    var _aRadiusMap;
    
    this._init = function(aMatrix){
        _iRow = aMatrix.length;
        _iCol = aMatrix[0].length;
        
        _aRadiusMap = new Array();
        
        _aMatrixMap = new Array();
        for(var i=0; i<_iRow; i++){
            _aMatrixMap[i] = new Array();
            for(var j=0; j<_iCol; j++){
                _aMatrixMap[i][j] = new Array();
            }
        }
        
        this._buildMap();
    };
    
    this._buildMap = function(){
        for(var i=0; i<_iRow; i++){
            for(var j=0; j<_iCol; j++){
                _aMatrixMap[i][j][DIR_TOPRIGHT] = this._setNeighbor(i,j,DIR_TOPRIGHT);
                _aMatrixMap[i][j][DIR_RIGHT] = this._setNeighbor(i,j,DIR_RIGHT);
                _aMatrixMap[i][j][DIR_BOTRIGHT] = this._setNeighbor(i,j,DIR_BOTRIGHT);
                _aMatrixMap[i][j][DIR_TOPLEFT] = this._setNeighbor(i,j,DIR_TOPLEFT);
                _aMatrixMap[i][j][DIR_LEFT] = this._setNeighbor(i,j,DIR_LEFT);
                _aMatrixMap[i][j][DIR_BOTLEFT] = this._setNeighbor(i,j,DIR_BOTLEFT);
                _aMatrixMap[i][j][DIR_TOP] = this._setNeighbor(i,j,DIR_TOP);
                _aMatrixMap[i][j][DIR_BOT] = this._setNeighbor(i,j,DIR_BOT);
            }
        }
    };
    
    this._setNeighbor = function(r, c, iDir){
        var oNextDir = null;
        
        switch(iDir){
            ////r%2 IS USED TO DETECT INDEX COLUMN FOR AN "ODD-ROW" HORIZONTAL LAYOUT HEX GRID. FOR EXAMPLE, IF ROW IS ODD, THE TOPRIGHT NEIGHBOR IS = COL+1. IF ROW IS EVEN, THE TOPRIGHT NEIGHBOR IS = COL. 
            case DIR_TOPRIGHT:{
                    if(r>0 && c<_iCol-1){
                        oNextDir = {row: r-1, col: c+1};
                    }
                    break;
            }
            case DIR_RIGHT:{
                    if(c<_iCol-1){
                        oNextDir = {row: r, col: c+1};
                    }
                    break;
            }
            case DIR_BOTRIGHT:{
                    if(r<_iRow-1 && c<_iCol-1){
                        oNextDir = {row: r+1, col: c+1};
                    }
                    break;
            }
            case DIR_TOPLEFT:{
                    if(r>0 && c > 0){
                        oNextDir = {row: r-1, col: c-1};
                    }
                    break;
            }
            case DIR_LEFT:{
                    if(c>0){
                        oNextDir = {row: r, col: c-1};
                    }
                    break;
            }
            case DIR_BOTLEFT:{
                    
                    if(r<_iRow-1 && c > 0){
                        oNextDir = {row: r+1, col: c-1};
                    }
                    break;
            }
            case DIR_TOP:{
                    if(r>0){
                        oNextDir = {row: r-1, col: c};
                    }
                    break;
            }
            case DIR_BOT:{
                    if(r<_iRow-1){
                        oNextDir = {row: r+1, col: c};
                    }
                    break;
            }
        }

        return oNextDir;
    };
    
    this._getNeighborByDir = function(iRow, iCol, iDir){
        return _aMatrixMap[iRow][iCol][iDir];
    };
    
    this._getAllNeighbor = function(iRow, iCol){
        var aNeighborList = new Array();
        
        for (var key in _aMatrixMap[iRow][iCol]) {
            if(_aMatrixMap[iRow][iCol][key]!== null){
                aNeighborList.push(_aMatrixMap[iRow][iCol][key]);
            }
        }
        
        return aNeighborList;
    };
    
    this._getMainDiagonal = function(iRow, iCol, aBoard){
        var aList = new Array();
        
        var szColor = aBoard[iRow][iCol].getColor();
        
        this._findInDirection(iRow, iCol, DIR_BOTRIGHT, aList, 99, szColor, aBoard);
        this._findInDirection(iRow, iCol, DIR_TOPLEFT, aList, 99, szColor, aBoard);
        
        return aList;
    };
    
    this._getSecondDiagonal = function(iRow, iCol, aBoard){
        var aList = new Array();
        
        var szColor = aBoard[iRow][iCol].getColor();
        
        this._findInDirection(iRow, iCol, DIR_BOTLEFT, aList, 99, szColor, aBoard);
        this._findInDirection(iRow, iCol, DIR_TOPRIGHT, aList, 99, szColor, aBoard);

        return aList;
    };
    
    this._getRow = function(iRow, iCol, aBoard){
        var aList = new Array();
        
        var szColor = aBoard[iRow][iCol].getColor();
        
        this._findInDirection(iRow, iCol, DIR_LEFT, aList, 99, szColor, aBoard);
        this._findInDirection(iRow, iCol, DIR_RIGHT, aList, 99, szColor, aBoard);
        
        return aList;
    };
    
    this._getCol = function(iRow, iCol, aBoard){
        var aList = new Array();
        
        var szColor = aBoard[iRow][iCol].getColor();
        
        this._findInDirection(iRow, iCol, DIR_TOP, aList, 99, szColor, aBoard);
        this._findInDirection(iRow, iCol, DIR_BOT, aList, 99, szColor, aBoard);
        
        return aList;
    };
    
    this._getStraightByDirAndRadius = function(iRow, iCol, szDir, iRadius, aBoard){
        var aList = new Array();
        _aRadiusMap = new Array();

        _aRadiusMap.push({radius:iRadius, direction: null});
        
        var szColor = aBoard[iRow][iCol].getColor();
        
        this._findInDirection(iRow, iCol, szDir, aList, iRadius, szColor, aBoard);

        
        return aList;
    };
    
    this._getStraightRowByRadius = function(iRow, iCol, iRadius){
        var aList = new Array();
        _aRadiusMap = new Array();
        
        _aRadiusMap.push({radius:iRadius, direction: null});
        
        this._findInDirection(iRow, iCol, DIR_LEFT, aList, iRadius);
        this._findInDirection(iRow, iCol, DIR_RIGHT, aList, iRadius);
        
        return aList;
    };
    
    this._getStraightColByRadius = function(iRow, iCol, iRadius){
        var aList = new Array();
        _aRadiusMap = new Array();
        
        _aRadiusMap.push({radius:iRadius, direction: null});
        
        this._findInDirection(iRow, iCol, DIR_TOP, aList, iRadius);
        this._findInDirection(iRow, iCol, DIR_BOT, aList, iRadius);
        
        
        return aList;
    };
    
    this._findInDirection = function(iRow, iCol, iDir, aList, iRadius, szColor, aBoard){

        var iCountRadius = iRadius-1;
        
        if(_aMatrixMap[iRow][iCol][iDir] !== null && iCountRadius>=0){
            var iNextRow = _aMatrixMap[iRow][iCol][iDir].row;
            var iNextCol = _aMatrixMap[iRow][iCol][iDir].col;

            if(szColor){
                var szNextColor = aBoard[iNextRow][iNextCol].getColor();
                if(szNextColor === szColor){
                    return;
                }else if (szNextColor === null){
                    aList.push({row: iNextRow, col: iNextCol});
                    _aRadiusMap.push({radius:iCountRadius, direction: iDir});

                    this._findInDirection(iNextRow, iNextCol, iDir, aList, iCountRadius, szColor, aBoard);
                } else {
                    aList.push({row: iNextRow, col: iNextCol});
                    _aRadiusMap.push({radius:iCountRadius, direction: iDir});
                }
            } else {
                aList.push({row: iNextRow, col: iNextCol});
                _aRadiusMap.push({radius:iCountRadius, direction: iDir});

                this._findInDirection(iNextRow, iNextCol, iDir, aList, iCountRadius, szColor, aBoard);
            }
        }
    };
    
    this._findTPos = function(iRow, iCol, iDir){
        var aPos = new Array();
        
        var oFirstStep = _aMatrixMap[iRow][iCol][iDir];
        if(oFirstStep !== null){
            var oSecondStep = _aMatrixMap[oFirstStep.row][oFirstStep.col][iDir];
            if(oSecondStep !== null){
                if(iDir === DIR_TOP || iDir === DIR_BOT){
                    aPos = this._getStraightRowByRadius(oSecondStep.row, oSecondStep.col, 1);
                } else {
                    aPos = this._getStraightColByRadius(oSecondStep.row, oSecondStep.col, 1);
                }
            };
        };
        
        return aPos;
    };
    
    this.getMovesList = function(iRow, iCol, aBoard){
        var szType = aBoard[iRow][iCol].getType();
        
        var aMovesList = new Array();
        
        switch(szType){
            case PAWN:{
                    aMovesList = this.getPawnMove(iRow, iCol, aBoard);
                    break;
            }
            case ROOK:{
                    aMovesList = this.getRookMove(iRow, iCol, aBoard);
                    break;
            }
            case KNIGHT:{
                    aMovesList = this.getKnightMove(iRow, iCol, aBoard);
                    break;
            }
            case BISHOP:{
                    aMovesList = this.getBishopMove(iRow, iCol, aBoard);
                    break;
            }
            case QUEEN:{
                    aMovesList = this.getQueenMove(iRow, iCol, aBoard);
                    break;
            }
            case KING:{
                    aMovesList = this.getKingMove(iRow, iCol, aBoard);
                    break;
            }
        }
        
        return aMovesList;
        
    };
    
    this.getPawnMove = function(iRow, iCol, aBoard){
        var szColor = aBoard[iRow][iCol].getColor();
               
        var aMoveList = new Array();
        var aEatList = new Array();
        if(szColor === WHITE){
            ////////// MOVE LIST
            if(iRow === 6){
                aMoveList = this._getStraightByDirAndRadius(iRow, iCol, DIR_TOP, 2, aBoard);
            } else {
                aMoveList = this._getStraightByDirAndRadius(iRow, iCol, DIR_TOP, 1, aBoard);
            }
            ////////// EAT LIST
            var oNeighbor = this._getNeighborByDir(iRow, iCol, DIR_TOPRIGHT);
            if(oNeighbor !== null){
                if(aBoard[oNeighbor.row][oNeighbor.col].getColor() === BLACK){
                    aEatList.push(oNeighbor);
                }    
            }
            var oNeighbor = this._getNeighborByDir(iRow, iCol, DIR_TOPLEFT);
            if(oNeighbor !== null){
                if(aBoard[oNeighbor.row][oNeighbor.col].getColor() === BLACK){
                    aEatList.push(oNeighbor);
                }    
            }
            ////////// CHECK EN-PASSANT
            if(iRow === 3){
                var aList = this._getEnPassant(WHITE, iRow, iCol, aBoard);
                for(var i=0; i<aList.length; i++){
                    aEatList.push(aList[i]);
                };
            }
            
            
        } else{
            ////////// MOVE LIST
            if(iRow === 1){
                aMoveList = this._getStraightByDirAndRadius(iRow, iCol, DIR_BOT, 2, aBoard);
            } else {
                aMoveList = this._getStraightByDirAndRadius(iRow, iCol, DIR_BOT, 1, aBoard);
            }
            ////////// EAT LIST
            var oNeighbor = this._getNeighborByDir(iRow, iCol, DIR_BOTRIGHT);
            if(oNeighbor !== null){
                if(aBoard[oNeighbor.row][oNeighbor.col].getColor() === WHITE){
                    aEatList.push(oNeighbor);
                }    
            }
            var oNeighbor = this._getNeighborByDir(iRow, iCol, DIR_BOTLEFT);
            if(oNeighbor !== null){
                if(aBoard[oNeighbor.row][oNeighbor.col].getColor() === WHITE){
                    aEatList.push(oNeighbor);
                }    
            }
            ////////// CHECK EN-PASSANT
            if(iRow === 4){
                var aList = this._getEnPassant(BLACK, iRow, iCol, aBoard);
                for(var i=0; i<aList.length; i++){
                    aEatList.push(aList[i]);
                };
            }
        }
        
        ///////////// REMOVE OCCUPIED CELLS BY ENEMY
        for(var i=aMoveList.length-1; i>=0; i--){
            if(aBoard[aMoveList[i].row][aMoveList[i].col].getColor() !== null && aBoard[aMoveList[i].row][aMoveList[i].col].getColor() !== szColor){
                aMoveList.splice(i,1);
            }
        };
        
        for(var i=0; i<aEatList.length; i++){
            aMoveList.push(aEatList[i]);
        };
        
        return aMoveList;
    };
    
    this.getRookMove = function(iRow, iCol, aBoard){
        var aRowList = this._getRow(iRow, iCol, aBoard);
        var aColList = this._getCol(iRow, iCol, aBoard);
        
        var aList = new Array();
        for(var i=0; i<aRowList.length; i++){
            aList.push(aRowList[i]);
        }
        for(var i=0; i<aColList.length; i++){
            aList.push(aColList[i]);
        }
        
        return aList;
    };
    
    this.getKnightMove = function(iRow, iCol, aBoard){
        var aList = new Array();
        aList.push( this._findTPos(iRow, iCol, DIR_TOP) );
        aList.push( this._findTPos(iRow, iCol, DIR_RIGHT) );
        aList.push( this._findTPos(iRow, iCol, DIR_BOT) );
        aList.push( this._findTPos(iRow, iCol, DIR_LEFT) );
        
        var aLList = new Array();
        for(var i=0; i<aList.length; i++){
            for(var j=0; j<aList[i].length; j++){
                aLList.push(aList[i][j]);
            }
        }
        
        //REMOVE ALLY POSITION FROM MOVES
        
        var szColor = aBoard[iRow][iCol].getColor();
        for(var i= aLList.length-1; i>=0; i--){
            if(aBoard[aLList[i].row][aLList[i].col].getColor() === szColor){
                aLList.splice(i,1);
            }
        }
        
        
        return aLList;
    };
    
    this.getBishopMove = function(iRow, iCol, aBoard){
        var aMainList = this._getMainDiagonal(iRow, iCol, aBoard);
        var aSecondList = this._getSecondDiagonal(iRow, iCol, aBoard);
        
        var aList = new Array();
        for(var i=0; i<aMainList.length; i++){
            aList.push(aMainList[i]);
        }
        for(var i=0; i<aSecondList.length; i++){
            aList.push(aSecondList[i]);
        }
        
        return aList;
    };
    
    this.getQueenMove = function(iRow, iCol, aBoard){
        var aStraightList = this.getRookMove(iRow, iCol, aBoard);
        var aDiagonalList = this.getBishopMove(iRow, iCol, aBoard);
        
        var aList = new Array();
        for(var i=0; i<aStraightList.length; i++){
            aList.push(aStraightList[i]);
        }
        for(var i=0; i<aDiagonalList.length; i++){
            aList.push(aDiagonalList[i]);
        }
        
        return aList;
    };
    
    this.getKingMove = function(iRow, iCol, aBoard){
        var aNeighborList = this._getAllNeighbor(iRow, iCol);

        ////////// CASTLING MOVES
        var oKing = aBoard[iRow][iCol];
        var aKingHistory = oKing.getPieceHistory();
        
        if(aKingHistory.length===1 && !s_oGame.isCheck()){
            var bCastlingRight = true;
            /////////CASTLE RIGHT AND LEFT
            var aRookRightHistory = aBoard[iRow][7].getPieceHistory();
            if(aRookRightHistory.length===1){
                if(aBoard[iRow][6].getColor() !== null){
                    bCastlingRight = false;
                }
                if(aBoard[iRow][5].getColor() !== null){
                    bCastlingRight = false;
                }
            }else {
                bCastlingRight = false;
            }
            if(bCastlingRight){
                aNeighborList.push({row: iRow, col:6});
            }
            
            var bCastlingLeft = true;
            var aRookLeftHistory = aBoard[iRow][0].getPieceHistory();
            if(aRookLeftHistory.length===1){
                if(aBoard[iRow][1].getColor() !== null){
                    bCastlingLeft = false;
                }
                if(aBoard[iRow][2].getColor() !== null){
                    bCastlingLeft = false;
                }
                if(aBoard[iRow][3].getColor() !== null){
                    bCastlingLeft = false;
                }
            }else {
                bCastlingLeft = false;
            }
            if(bCastlingLeft){
                aNeighborList.push({row: iRow, col:2});
            }
        }
        
        //REMOVE ALLY POSITION FROM MOVES
        var szColor = aBoard[iRow][iCol].getColor();
        for(var i= aNeighborList.length-1; i>=0; i--){
            if(aBoard[aNeighborList[i].row][aNeighborList[i].col].getColor() === szColor){
                aNeighborList.splice(i,1);
            }
        }
        
        return aNeighborList;
    };
    
    this._getEnPassant = function(szColor, iRow, iCol, aBoard){
        var aList = new Array();
        var szOpponentColor = s_oBoardStateController.getOtherOpponent(szColor);
        
        var oNeighbor = this._getNeighborByDir(iRow, iCol, DIR_RIGHT);
        if(oNeighbor !== null){
            var oPiece = aBoard[oNeighbor.row][oNeighbor.col];
            if(oPiece.getColor() === szOpponentColor && oPiece.getType() === PAWN){
                var aEnemyPawnHistory = oPiece.getPieceHistory();
                var aThisPieceHistory = aBoard[iRow][iCol].getPieceHistory();
                if(aEnemyPawnHistory.length === 2 && aThisPieceHistory[aThisPieceHistory.length-1].id < aEnemyPawnHistory[1].id){
                    if(szColor === WHITE){
                        aList.push(this._getNeighborByDir(iRow, iCol, DIR_TOPRIGHT));
                    } else {
                        aList.push(this._getNeighborByDir(iRow, iCol, DIR_BOTRIGHT));
                    }

                }
            }
        }
        
        var oNeighbor = this._getNeighborByDir(iRow, iCol, DIR_LEFT);
        if(oNeighbor !== null){
            var oPiece = aBoard[oNeighbor.row][oNeighbor.col];
            if(oPiece.getColor() === szOpponentColor && oPiece.getType() === PAWN){
                var aEnemyPawnHistory = oPiece.getPieceHistory();
                var aThisPieceHistory = aBoard[iRow][iCol].getPieceHistory();
                if(aEnemyPawnHistory.length === 2 && aThisPieceHistory[aThisPieceHistory.length-1].id < aEnemyPawnHistory[1].id){
                    if(szColor === WHITE){
                        aList.push(this._getNeighborByDir(iRow, iCol, DIR_TOPLEFT));
                    } else {
                        aList.push(this._getNeighborByDir(iRow, iCol, DIR_BOTLEFT));
                    }
                } 
            }
        }
        
        return aList;
    };
    
    this._init(aMatrix);
    
    s_oMovesController = this;
}

var s_oMovesController;
