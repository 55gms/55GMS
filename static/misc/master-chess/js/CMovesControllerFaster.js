var DIR_TOPRIGHT = "DIR_TOPRIGHT";
var DIR_RIGHT = "DIR_RIGHT";
var DIR_BOTRIGHT = "DIR_BOTRIGHT";
var DIR_TOPLEFT = "DIR_TOPLEFT";
var DIR_LEFT = "DIR_LEFT";
var DIR_BOTLEFT = "DIR_BOTLEFT";
var DIR_TOP = "DIR_TOP";
var DIR_BOT = "DIR_BOT";

function CMovesControllerFaster(aMatrix){
    var _iRow;
    var _iCol;
    
    var _aMatrixMap;
    
    this._init = function(aMatrix){
        _iRow = aMatrix.length;
        _iCol = aMatrix[0].length;
        
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
        
        /*
        if(oNextDir !== null){
            if(aGrid[oNextDir.row][oNextDir.col].item === CELL_TYPE_NULL || aGrid[oNextDir.row][oNextDir.col]===undefined){
                oNextDir = null;
            }
        }
        */

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

        var szColor = aBoard[iRow][iCol].color;
        
        this._findInDirection(iRow, iCol, DIR_BOTRIGHT, aList, 99, szColor, aBoard);
        this._findInDirection(iRow, iCol, DIR_TOPLEFT, aList, 99, szColor, aBoard);

        
        return aList;
    };
    
    this._getSecondDiagonal = function(iRow, iCol, aBoard){
        var aList = new Array();

        var szColor = aBoard[iRow][iCol].color;
        
        this._findInDirection(iRow, iCol, DIR_BOTLEFT, aList, 99, szColor, aBoard);
        this._findInDirection(iRow, iCol, DIR_TOPRIGHT, aList, 99, szColor, aBoard);

        
        return aList;
    };
    
    this._getRow = function(iRow, iCol, aBoard){
        var aList = new Array();
        
        var szColor = aBoard[iRow][iCol].color;
        
        this._findInDirection(iRow, iCol, DIR_LEFT, aList, 99, szColor, aBoard);
        this._findInDirection(iRow, iCol, DIR_RIGHT, aList, 99, szColor, aBoard);
        
        return aList;
    };
    
    this._getCol = function(iRow, iCol, aBoard){
        var aList = new Array();
        
        var szColor = aBoard[iRow][iCol].color;
        
        this._findInDirection(iRow, iCol, DIR_TOP, aList, 99, szColor, aBoard);
        this._findInDirection(iRow, iCol, DIR_BOT, aList, 99, szColor, aBoard);

        
        return aList;
    };
    
    this._getStraightByDirAndRadius = function(iRow, iCol, szDir, iRadius, aBoard){
        var aList = new Array();
        
        var szColor = aBoard[iRow][iCol].color;
        
        this._findInDirection(iRow, iCol, szDir, aList, iRadius, szColor, aBoard);

        
        return aList;
    };
    
    this._getStraightRowByRadius = function(iRow, iCol, iRadius){
        var aList = new Array();
        
        this._findInDirection(iRow, iCol, DIR_LEFT, aList, iRadius);
        this._findInDirection(iRow, iCol, DIR_RIGHT, aList, iRadius);
        
        return aList;
    };
    
    this._getStraightColByRadius = function(iRow, iCol, iRadius){
        var aList = new Array();
        
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
                var szNextColor = aBoard[iNextRow][iNextCol].color;
                if(szNextColor === szColor){
                    return;
                }else if (szNextColor === null){
                    aList.push({row: iNextRow, col: iNextCol});

                    this._findInDirection(iNextRow, iNextCol, iDir, aList, iCountRadius, szColor, aBoard);
                } else {
                    aList.push({row: iNextRow, col: iNextCol});
                }
            } else {
                aList.push({row: iNextRow, col: iNextCol});
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
        var szType = aBoard[iRow][iCol].type;
        
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
        var szColor = aBoard[iRow][iCol].color;
               
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
                if(aBoard[oNeighbor.row][oNeighbor.col].color === BLACK){
                    aEatList.push(oNeighbor);
                }    
            }
            var oNeighbor = this._getNeighborByDir(iRow, iCol, DIR_TOPLEFT);
            if(oNeighbor !== null){
                if(aBoard[oNeighbor.row][oNeighbor.col].color === BLACK){
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
                if(aBoard[oNeighbor.row][oNeighbor.col].color === WHITE){
                    aEatList.push(oNeighbor);
                }    
            }
            var oNeighbor = this._getNeighborByDir(iRow, iCol, DIR_BOTLEFT);
            if(oNeighbor !== null){
                if(aBoard[oNeighbor.row][oNeighbor.col].color === WHITE){
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
            if(aBoard[aMoveList[i].row][aMoveList[i].col].color !== null && aBoard[aMoveList[i].row][aMoveList[i].col].color !== szColor){
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
        
        var szColor = aBoard[iRow][iCol].color;
        for(var i= aLList.length-1; i>=0; i--){
            if(aBoard[aLList[i].row][aLList[i].col].color === szColor){
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
        var aKingHistory = oKing.history;
        
        if(aKingHistory.length===1 && !s_oGame.isCheck()){
            var bCastlingRight = true;
            /////////FARE IL CHECK DEI CASTLING A DESTRA E A SINISTRA
            var aRookRightHistory = aBoard[iRow][7].history;
            if(aRookRightHistory.length===1){
                if(aBoard[iRow][6].color !== null){
                    bCastlingRight = false;
                }
                if(aBoard[iRow][5].color !== null){
                    bCastlingRight = false;
                }
            }else {
                bCastlingRight = false;
            }
            if(bCastlingRight){
                aNeighborList.push({row: iRow, col:6});
            }
            
            var bCastlingLeft = true;
            var aRookLeftHistory = aBoard[iRow][0].history;
            if(aRookLeftHistory.length===1){
                if(aBoard[iRow][1].color !== null){
                    bCastlingLeft = false;
                }
                if(aBoard[iRow][2].color !== null){
                    bCastlingLeft = false;
                }
                if(aBoard[iRow][3].color !== null){
                    bCastlingLeft = false;
                }
            }else {
                bCastlingLeft = false;
            }
            if(bCastlingLeft){
                aNeighborList.push({row: iRow, col:2});
            }
        }
        
        //REMOVE ALLY POSITION FROM MOVES AND NOT LEGAL MOVES
        var szColor = aBoard[iRow][iCol].color;
        for(var i= aNeighborList.length-1; i>=0; i--){
            if(aBoard[aNeighborList[i].row][aNeighborList[i].col].color === szColor){
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
            if(oPiece.color === szOpponentColor && oPiece.type === PAWN){
                var aEnemyPawnHistory = oPiece.history;
                if(aEnemyPawnHistory.length === 2){
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
            if(oPiece.color === szOpponentColor && oPiece.type === PAWN){
                var aEnemyPawnHistory = oPiece.history;
                if(aEnemyPawnHistory.length === 2){
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

    this.getState = function(szCurPlayer, aBoard){
        /////////// STARTS ALL KIND OF VERIFICATIONS
        var aThreatList = this.findAllChecks(szCurPlayer, aBoard);

        if(aThreatList.length !== 0){
            /// FIND CHECKMATE
            var bCheckMate = this.findCheckMate(szCurPlayer, aBoard);
            if(bCheckMate){
                return BOARD_STATE_CHECKMATE;
            } else {
                return BOARD_STATE_CHECK;
            }
        }
        
        /// FIND STALEMATE
        var bStaleMate = this.findStaleMate(szCurPlayer, aBoard);
        if(bStaleMate){
            return BOARD_STATE_STALEMATE;
        }
    };

    this.findCheckMate = function(szCurPlayer, aBoard){
        /////ONE CAN AVOID CHECKMATE ONLY BY: a) MOVING THE KING AWAY; b)EAT THREATENING PIECE; c) SHIELDING THE KING; WE CAN FIND ALL THESE CONDITIONS SEPARATELY
        ////OR WE COULD BE CHECK ITERATIVELY ALL PLAYER MOVES AND FIND JUST 1 MOVE THAT SAVE THE KING
        var bCheckMate = false;
        
        var aCurPlayerPieces = new Array();
        for(var i=0; i<aBoard.length; i++){
            for(var j=0; j<aBoard[i].length; j++){
                if(aBoard[i][j].color === szCurPlayer){
                    aCurPlayerPieces.push({row: i, col:j});
                }
            }
        }
        
        ///FIND ALLIN SOLUTION
        for(var i=0; i<aCurPlayerPieces.length; i++){
            var iSourceRow = aCurPlayerPieces[i].row;
            var iSourceCol = aCurPlayerPieces[i].col;
            var aCurPieceMoveList = s_oMovesControllerFaster.getMovesList(iSourceRow, iSourceCol, aBoard);
            for(var j=0; j<aCurPieceMoveList.length; j++){
                
                var iDestRow = aCurPieceMoveList[j].row;
                var iDestCol = aCurPieceMoveList[j].col;
                var oMove = {   sourcerow:iSourceRow, sourcecol:iSourceCol, destrow:iDestRow, destcol:iDestCol, 
                                        sourcetype:aBoard[iSourceRow][iSourceCol].type, sourcecolor:aBoard[iSourceRow][iSourceCol].color, sourcehistory:aBoard[iSourceRow][iSourceCol].history,
                                        desttype:aBoard[iDestRow][iDestCol].type, destcolor:aBoard[iDestRow][iDestCol].color, desthistory:aBoard[iDestRow][iDestCol].history
                };
                
                this._makeMove(aBoard, oMove);

                var aList = this.findAllChecks(szCurPlayer, aBoard);
                if(aList.length === 0){
                    return bCheckMate;
                }
                
                this._unMakeMove(aBoard, oMove);
            }
        }
        
        bCheckMate = true;

        return bCheckMate;
    };

    this._makeMove = function(aBoard, oMove){    

        aBoard[oMove.destrow][oMove.destcol] = {color: oMove.sourcecolor, type: oMove.sourcetype, history: oMove.sourcehistory};
        aBoard[oMove.sourcerow][oMove.sourcecol] = {color: null, type: null, history: []};
        
        if((oMove.destrow === 0 || oMove.destrow === 7) && oMove.sourcetype === PAWN){
            aBoard[oMove.destrow][oMove.destcol] = {color: oMove.sourcecolor, type: QUEEN, history: oMove.sourcehistory};
        }
        
    };
    
    this._unMakeMove = function(aBoard, oMove){     
        aBoard[oMove.sourcerow][oMove.sourcecol] = {color: oMove.sourcecolor, type: oMove.sourcetype, history: oMove.sourcehistory};
        aBoard[oMove.destrow][oMove.destcol] = {color: oMove.destcolor, type: oMove.desttype, history: oMove.desthistory};
    };

    this.findStaleMate = function(szCurPlayer, aBoard){
        var bStaleMate = this.findCheckMate(szCurPlayer, aBoard);

        ////CHECK IF YOU HAVE ENOUGH PIECES TO CONTINUE THE GAME
        if(!bStaleMate){
            var aBlackPieces = new Array();
            var aWhitePieces = new Array();
            for(var i=0; i<aBoard.length; i++){
                for(var j=0; j<aBoard[i].length; j++){
                    if(aBoard[i][j].color === WHITE){
                        aWhitePieces.push(aBoard[i][j].type);
                    }
                    if(aBoard[i][j].color === BLACK){
                        aBlackPieces.push(aBoard[i][j].type);
                    }
                }
            }
            
            /// ONLY KINGS REMAINS
            if(aBlackPieces.length === 1 && aWhitePieces.length === 1){
                bStaleMate = true;
                return bStaleMate;
            }
            /// ONLY KING AND BISHOP VS KING //////// ONLY KING AND BISHOP VS KING
            if( (aBlackPieces.length === 1 && aWhitePieces.length === 2) || (aBlackPieces.length === 2 && aWhitePieces.length === 1) ){
                var iBishop = aWhitePieces.indexOf(BISHOP)&&aBlackPieces.indexOf(BISHOP);
                var iKnight = aWhitePieces.indexOf(KNIGHT)&&aBlackPieces.indexOf(KNIGHT);
                
                if(iBishop >= 0 || iKnight >= 0){
                    bStaleMate = true;
                    return bStaleMate;
                }
            }
            /// ONLY KING AND BISHOP VS KING AND BISHOP
            if( (aBlackPieces.length === 2 && aWhitePieces.length === 2) ){
                var iBishop = aWhitePieces.indexOf(BISHOP)||aBlackPieces.indexOf(BISHOP);
                if(iBishop >= 0){
                    var aBishopBoardColor = new Array;
                    for(var i=0; i<aBoard.length; i++){
                        for(var j=0; j<aBoard[i].length; j++){
                            if(aBoard[i][j].type===BISHOP){
                                var iBoardColor = (i+j)%2;
                                aBishopBoardColor.push(iBoardColor);
                            }
                        }
                    }
                    if(aBishopBoardColor[0] === aBishopBoardColor[1]){
                        bStaleMate = true;
                        return bStaleMate;
                    }
                }
            }
        }
        
        return bStaleMate;
    };

    this.isInCheck = function(szPlayerColor, aBoard, aOpponentPieces){
        var aMoves;
        for(var i=0; i<aOpponentPieces.length; i++){
            aMoves = s_oMovesControllerFaster.getMovesList(aOpponentPieces[i].row, aOpponentPieces[i].col, aBoard);
            for(var j=0; j<aMoves.length; j++){
                var oLogicPos = aMoves[j];
                if(aBoard[oLogicPos.row][oLogicPos.col].color===szPlayerColor && aBoard[oLogicPos.row][oLogicPos.col].type === KING){
                    return true;
                }
            };
        }
        
        
        
        return false;
    };
    
    this.findAllChecks = function(szPlayerColor, aBoard){
        var szOpponentColor = s_oBoardStateController.getOtherOpponent(szPlayerColor);
        var aOpponentPieces = new Array();
        for(var i=0; i<aBoard.length; i++){
            for(var j=0; j<aBoard[i].length; j++){
                if(aBoard[i][j].color === szOpponentColor){
                    aOpponentPieces.push({row: i, col:j});
                }
            }
        }
        
        var aMoves = new Array();
        for(var i=0; i<aOpponentPieces.length; i++){
            var oLogicPos = aOpponentPieces[i];
            aMoves[i] = {list: s_oMovesControllerFaster.getMovesList(oLogicPos.row, oLogicPos.col, aBoard), piece: aOpponentPieces[i]};
        }

        
        var aCheckPieceList = new Array();
        for(var i=0; i<aMoves.length; i++){
            for(var j=0; j<aMoves[i].list.length; j++){
                var oLogicPos = aMoves[i].list[j];
                if(aBoard[oLogicPos.row][oLogicPos.col].color===szPlayerColor && aBoard[oLogicPos.row][oLogicPos.col].type === KING){
                    aCheckPieceList.push(aMoves[i].piece);
                }
            };
        };
        
        return aCheckPieceList;
    };

    this._init(aMatrix);
    
    s_oMovesControllerFaster = this;
}

var s_oMovesControllerFaster;



