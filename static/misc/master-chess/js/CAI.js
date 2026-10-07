function CAI(){
    
    var _iNodeCounter;
    var _iScore;
    
    var _aCurBoard;
    var _aPieces;
    
    var _oDecisionTree;
    
    this._init = function(){
        
    };
    
    this.getMove = function(){
        
        var iBestValue = this._buildTree();

        var iChildOfRoot = 1;
        var aBestNodeList = _oDecisionTree.getNode(iBestValue, iChildOfRoot);
        
        var oAIMoves = this._getBestNode(aBestNodeList);

        return oAIMoves;
        
    };
    
    this._getBestNode = function(aNodeList){
        if(aNodeList.length > 0){
            for(var i=0; i<aNodeList.length; i++){
                var oMove = aNodeList[i].model.moves;
                this._makeMove(oMove);
                
                var bState = s_oMovesControllerFaster.getState(WHITE, _aCurBoard);
                
                if(bState === BOARD_STATE_CHECKMATE){
                    //// ENCOURAGE CHECKS
                    aNodeList[i].model.rating += 0.5;
                } else if(bState === BOARD_STATE_STALEMATE) {
                    ////DISCOURAGE STALEMATE
                    aNodeList[i].model.rating -= 0.5;
                }
                      
                this._unMakeMove(oMove);
                
            };
            
            var iMax = aNodeList[0].model.rating;
            for(var i=1; i<aNodeList.length; i++){
                if(aNodeList[i].model.rating > iMax){
                    iMax = aNodeList[i].model.rating;
                }
            };
            
            var aBestNodeList = new Array();
            for(var i=0; i<aNodeList.length; i++){
                if(aNodeList[i].model.rating === iMax){
                    aBestNodeList.push(aNodeList[i]);
                }
            }
            
            var show = aBestNodeList[Math.floor( Math.random()*aBestNodeList.length)];
            var oAIMoves = show.model.moves;
            
        } else {
            oAIMoves = null;
        }
        
        return oAIMoves;
    };
    
    this._buildTree = function(){
        _iNodeCounter = 0;
        var iStartingDepth = 0;
        _oDecisionTree = new CTreeDecision({rating: 0, moves: [], depth:iStartingDepth});
        
        _aCurBoard = this._copyBoard(s_oGame.getCells());

        ///////////////GET CALCULATION TIME HERE////////////////
        var iTime = new Date().getTime();

        _iScore = this._maxi(0);
        iTime = new Date().getTime() - iTime;

        ///////////////GET CALCULATION TIME HERE////////////////
        
        return _iScore;
        
    };

    
    this._alphaBetaMax = function(alpha, beta, iParentDepth ) {
        _iNodeCounter++;
        if ( iParentDepth === SEARCH_DEPTH ) {
            return this._evaluateBoard();
        }

        var oMoves = this._findAllMoves(BLACK);
        var aAllMoves = oMoves.moves;
        var aOpponentPieceList = oMoves.opponentlist;
        for (var i=aAllMoves.length-1; i>=0; i--) {
            
            this._makeMove(aAllMoves[i]);
            
            var bCheck = s_oMovesControllerFaster.isInCheck(BLACK, _aCurBoard, aOpponentPieceList);
            if(bCheck){
                this._unMakeMove(aAllMoves[i]);
                aAllMoves.splice(i,1);
                continue;
            }
            
            var iChildDepth = iParentDepth+1;
            _oDecisionTree.initNewNode(iChildDepth);
            var score = this._alphaBetaMin( alpha, beta, iChildDepth );

            _oDecisionTree.addNode(iParentDepth, score, aAllMoves[i]);
            
            this._unMakeMove(aAllMoves[i]);
            
            if( score >= beta )
               return beta;   // fail hard beta-cutoff
            if( score > alpha )
               alpha = score; // alpha acts like max in MiniMax
        }
        return alpha;
    };
    
    this._alphaBetaMin = function(alpha, beta, iParentDepth ) {
        _iNodeCounter++;
        if ( iParentDepth === SEARCH_DEPTH ) {
            return this._evaluateBoard();
        }
        
        var oMoves = this._findAllMoves(WHITE);
        var aAllMoves = oMoves.moves;
        var aOpponentPieceList = oMoves.opponentlist;
        for (var i=aAllMoves.length-1; i>=0; i--) {
            
            this._makeMove(aAllMoves[i]);
            var bCheck = s_oMovesControllerFaster.isInCheck(WHITE, _aCurBoard, aOpponentPieceList);
            if(bCheck){
                this._unMakeMove(aAllMoves[i]);
                aAllMoves.splice(i,1);
                continue;
            }
            
            var iChildDepth = iParentDepth+1;
            _oDecisionTree.initNewNode(iChildDepth);
            var score = this._alphaBetaMax( alpha, beta, iChildDepth );

            _oDecisionTree.addNode(iParentDepth, score, aAllMoves[i]);
            
            this._unMakeMove(aAllMoves[i]);
            
            if( score <= alpha )
               return alpha;   // fail hard alpha-cutoff
            if( score < beta )
               beta = score; // beta acts like min in MiniMax
        }
        return beta;
    };
    
    this._evaluateBoard = function(){
       ///////// CLOUD SHANNON EVALUATION FUNCTION
       /*
       f(p) = 200(K-K')
       + 9(Q-Q')
       + 5(R-R')
       + 3(B-B' + N-N')
       + 1(P-P')
       - 0.5(D-D' + S-S' + I-I')
       + 0.1(M-M') + ...
 
        KQRBNP = number of kings, queens, rooks, bishops, knights and pawns
        D,S,I = doubled, blocked and isolated pawns
        M = Mobility (the number of legal moves)
        */

        var iRate = 200*(_aPieces[BLACK][KING] - _aPieces[WHITE][KING])
                    + 9*(_aPieces[BLACK][QUEEN] - _aPieces[WHITE][QUEEN])
                    + 5*(_aPieces[BLACK][ROOK] - _aPieces[WHITE][ROOK])
                    + 3*(_aPieces[BLACK][BISHOP] - _aPieces[WHITE][BISHOP] + _aPieces[BLACK][KNIGHT] - _aPieces[WHITE][KNIGHT])
                    + (_aPieces[BLACK][PAWN] - _aPieces[WHITE][PAWN]);

                    

        return iRate;
    };
    
    this._findAllMoves = function(szEvalPlayerColor){
        var aAllMovesList = new Array();
        var aOpponentList = new Array();
        for(var i=0; i<NUM_CELL; i++){
            for(var j=0; j<NUM_CELL; j++){
                if(_aCurBoard[i][j].type !== null){
                    if(_aCurBoard[i][j].color === szEvalPlayerColor){
                        var aSinglePieceMoveList = s_oMovesControllerFaster.getMovesList(i,j,_aCurBoard);
                        for(var k=0; k<aSinglePieceMoveList.length; k++){
                            var iDestRow = aSinglePieceMoveList[k].row;
                            var iDestCol = aSinglePieceMoveList[k].col;
                            aAllMovesList.push( {   sourcerow:i, sourcecol:j, destrow:iDestRow, destcol:iDestCol, 
                                                    sourcetype:_aCurBoard[i][j].type, sourcecolor:_aCurBoard[i][j].color, sourcehistory:_aCurBoard[i][j].history,
                                                    desttype:_aCurBoard[iDestRow][iDestCol].type, destcolor:_aCurBoard[iDestRow][iDestCol].color, desthistory:_aCurBoard[iDestRow][iDestCol].history
                            });
                        } 
                    } else {
                        aOpponentList.push({row:i, col:j});
                    }
                    
                }
            }
        }
        return {moves: aAllMovesList, opponentlist:aOpponentList};
    };
    
   
    this._makeMove = function(oMove){    
        
        if(oMove.destcolor !== null){
            _aPieces[oMove.destcolor][oMove.desttype]--;
        }

        _aCurBoard[oMove.destrow][oMove.destcol] = {color: oMove.sourcecolor, type: oMove.sourcetype, history: oMove.sourcehistory};
        _aCurBoard[oMove.sourcerow][oMove.sourcecol] = {color: null, type: null, history: []};
        
        if((oMove.destrow === 0 || oMove.destrow === 7) && oMove.sourcetype === PAWN){
            _aCurBoard[oMove.destrow][oMove.destcol] = {color: oMove.sourcecolor, type: QUEEN, history: oMove.sourcehistory};
            _aPieces[oMove.sourcecolor][PAWN]--;
            _aPieces[oMove.sourcecolor][QUEEN]++;
        }
        
    };
    
    this._unMakeMove = function(oMove){     
        if(oMove.destcolor !== null){
            _aPieces[oMove.destcolor][oMove.desttype]++;
        }
        
        _aCurBoard[oMove.sourcerow][oMove.sourcecol] = {color: oMove.sourcecolor, type: oMove.sourcetype, history: oMove.sourcehistory};
        _aCurBoard[oMove.destrow][oMove.destcol] = {color: oMove.destcolor, type: oMove.desttype, history: oMove.desthistory};
        
        if((oMove.destrow === 0 || oMove.destrow === 7) && oMove.sourcetype === PAWN){
            _aPieces[oMove.sourcecolor][PAWN]++;
            _aPieces[oMove.sourcecolor][QUEEN]--;
        }
    };
    
    this.debugBoard = function(aBoard){
        var aNewBoard = new Array();
        for(var i=0; i<NUM_CELL; i++){
            aNewBoard[i] = new Array();
            for(var j=0; j<NUM_CELL; j++){
                aNewBoard[i][j] = aBoard[i][j].getType() + "_" +aBoard[i][j].getColor();
            }
        }
    };
    
    this._copyBoard = function(aBoard){
        
        _aPieces = new Array(BLACK, WHITE);
        _aPieces[BLACK] = new Array();
        _aPieces[WHITE] = new Array();
        
        _aPieces[BLACK][KING] = 0;
        _aPieces[BLACK][QUEEN] = 0;
        _aPieces[BLACK][ROOK] = 0;
        _aPieces[BLACK][BISHOP] = 0;
        _aPieces[BLACK][KNIGHT] = 0;
        _aPieces[BLACK][PAWN] = 0;
        
        _aPieces[WHITE][KING] = 0;
        _aPieces[WHITE][QUEEN] = 0;
        _aPieces[WHITE][ROOK] = 0;
        _aPieces[WHITE][BISHOP] = 0;
        _aPieces[WHITE][KNIGHT] = 0;
        _aPieces[WHITE][PAWN] = 0;
        
        var aNewBoard = new Array();
        for(var i=0; i<NUM_CELL; i++){
            aNewBoard[i] = new Array();
            for(var j=0; j<NUM_CELL; j++){
                aNewBoard[i][j] = {color: aBoard[i][j].getColor(), type: aBoard[i][j].getType(), history:aBoard[i][j].getPieceHistory()};
                if(aBoard[i][j].getColor() !== null){
                    _aPieces[aNewBoard[i][j].color][aNewBoard[i][j].type]++;
                }
            }
        }
        
        return aNewBoard;
    };
    
    
    this._maxi = function(depth) {
        if ( depth === SEARCH_DEPTH ) {
            return this._evaluateBoard();
        }
        var  max = -INFINITE;

        var oMoves = this._findAllMoves(BLACK);
        var aAllMoves = oMoves.moves;
        var aOpponentPieceList = oMoves.opponentlist;
        var iChildDepth = depth+1;
        for (var i=aAllMoves.length-1; i>=0; i--) {
            
            this._makeMove(aAllMoves[i]);
            
            var bCheck = s_oMovesControllerFaster.isInCheck(BLACK, _aCurBoard, aOpponentPieceList);
            if(bCheck){
                this._unMakeMove(aAllMoves[i]);
                aAllMoves.splice(i,1);
                continue;
            }

            _oDecisionTree.initNewNode(iChildDepth);

            var score = this._mini( iChildDepth );
            
            _oDecisionTree.addNode(depth, score, aAllMoves[i]);
            
            this._unMakeMove(aAllMoves[i]);
            
            if( score > max )
                max = score;
        }
        return max;
    };
 
    this._mini= function(depth) {
        if ( depth === SEARCH_DEPTH ){
            return this._evaluateBoard();
        }
        var min = INFINITE;

        var oMoves = this._findAllMoves(WHITE);
        var aAllMoves = oMoves.moves;
        var aOpponentPieceList = oMoves.opponentlist;
        var iChildDepth = depth+1;
        for (var i=aAllMoves.length-1; i>=0; i--) {
            
            this._makeMove(aAllMoves[i]);
            
            var bCheck = s_oMovesControllerFaster.isInCheck(WHITE, _aCurBoard, aOpponentPieceList);
            if(bCheck){
                this._unMakeMove(aAllMoves[i]);
                aAllMoves.splice(i,1);
                continue;
            }

            _oDecisionTree.initNewNode(iChildDepth);
            
            var score = this._maxi( iChildDepth );
            
            _oDecisionTree.addNode(depth, score, aAllMoves[i]);
            
            this._unMakeMove(aAllMoves[i]);
            
            if( score < min )
                min = score;
        }
        return min;
    };
    
    this._init();
}


