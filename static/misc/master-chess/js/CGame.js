function CGame(oData){

    var _bStartGame;
    var _bCheck;
    
    var _iPlayerState;
    var _iCurPlayer;
    var _iBlackTime;
    var _iWhiteTime;
    var _iBlackScore;
    var _iWhiteScore;
    var _iHistoryID;

    var _aCell;

    var _oInterface;
    var _oEndPanel = null;
    var _oParent;
    var _oBoardContainer;
    var _oInfoPanelContainer;
    var _oPiecesContainer;
    var _oKnightContainer;
    var _oMessage;
    var _oThinking = null;
    var _oBoard;
    var _oCellActive;
    var _oAI;
    
    this._init = function(){

        PokiSDK.gameplayStart();

        _bStartGame=true;
        _bCheck = false;
        
        _iPlayerState = PLAYER_STATE_WAIT;
        _iCurPlayer = WHITE;
        _iHistoryID = 0;
        _iBlackTime = 0;
        _iWhiteTime = 0;
        _iBlackScore = START_SCORE;
        _iWhiteScore = START_SCORE;
        
        _oCellActive = null;
        _oMessage = null;
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg); //Draws on canvas
        
        var iScale = 1;

        _oBoardContainer = new createjs.Container();
        _oBoardContainer.x = CANVAS_WIDTH/2;
        _oBoardContainer.y = CANVAS_HEIGHT/2;
        _oBoardContainer.scaleX = _oBoardContainer.scaleY = iScale;
        s_oStage.addChild(_oBoardContainer);
        
        _oInfoPanelContainer = new createjs.Container();
        s_oStage.addChild(_oInfoPanelContainer);
        
        _oPiecesContainer = new createjs.Container();
        _oPiecesContainer.x = CANVAS_WIDTH/2;
        _oPiecesContainer.y = CANVAS_HEIGHT/2;
        _oPiecesContainer.scaleX = _oPiecesContainer.scaleY = iScale;
        s_oStage.addChild(_oPiecesContainer);
        
        _oKnightContainer = new createjs.Container();
        _oKnightContainer.x = CANVAS_WIDTH/2;
        _oKnightContainer.y = CANVAS_HEIGHT/2;
        _oKnightContainer.scaleX = _oKnightContainer.scaleY = iScale;
        s_oStage.addChild(_oKnightContainer);
        
        _oInterface = new CInterface(_oInfoPanelContainer);    
        
        var oSprite = s_oSpriteLibrary.getSprite('board8');
        _oBoard = new createBitmap(oSprite);
        _oBoard.regX = oSprite.width/2;
        _oBoard.regY = oSprite.height/2;
        _oBoardContainer.addChild(_oBoard);
        
        this._initBoard();        
        this.setPieceDepth();

        new CMovesController(_aCell);
        new CMovesControllerFaster(_aCell);
        new CBoardStateController();

        _oInterface.activePlayer(_iCurPlayer);
        
        _oAI = new CAI();
        
        this.refreshButtonPos();
    };

    this.refreshButtonPos = function(){
        var iBoardScale;
        if(s_bLandscape){
            iBoardScale = linearFunction(s_iOffsetY, 540, 0, 0.88, 2);

            _oBoardContainer.scaleX = _oBoardContainer.scaleY = iBoardScale;
            _oPiecesContainer.scaleX = _oPiecesContainer.scaleY = iBoardScale;
            _oKnightContainer.scaleX = _oKnightContainer.scaleY = iBoardScale;
            
        } else {
            iBoardScale = linearFunction(s_iOffsetX, 570, 0, 0.88, 2.15);
            
            if(iBoardScale > 1.85){
                iBoardScale = 1.85;
            }
            
            _oBoardContainer.scaleX = _oBoardContainer.scaleY = iBoardScale;
            _oPiecesContainer.scaleX = _oPiecesContainer.scaleY = iBoardScale;
            _oKnightContainer.scaleX = _oKnightContainer.scaleY = iBoardScale;
        }
        
        s_oInterface.refreshButtonPos(iBoardScale);
        
    };

    this._initBoard = function(){
      
        var iLength = BOARD_LENGTH;
        var iNumCell = NUM_CELL;
        var iGridStart = -iLength/2;
        var iCellLength = CELL_LENGTH;
        var iCellStartPos = iGridStart + iCellLength/2;
        
        //Init Cell Position
        _aCell = new Array();
        for(var i=0; i<iNumCell; i++){
            _aCell[i] = new Array();
            for(var j=0; j<iNumCell; j++){                
                var iX = iCellStartPos +j*iCellLength;
                var iY = iCellStartPos +i*iCellLength;
                _aCell[i][j] = new CCell(iX, iY, null, i, j, _oBoardContainer, _oPiecesContainer, _oKnightContainer);
            }
        }
        
        
        for(var i=0; i<iNumCell; i++){
            _aCell[1][i].createPiece(_iHistoryID, BLACK,PAWN);
        };
        for(var i=0; i<iNumCell; i++){
            _aCell[6][i].createPiece(_iHistoryID, WHITE,PAWN);
        };
        _aCell[0][0].createPiece(_iHistoryID, BLACK,ROOK);
        _aCell[0][7].createPiece(_iHistoryID, BLACK,ROOK);
        _aCell[7][0].createPiece(_iHistoryID, WHITE,ROOK);
        _aCell[7][7].createPiece(_iHistoryID, WHITE,ROOK);
        
        _aCell[0][1].createPiece(_iHistoryID, BLACK,KNIGHT);
        _aCell[0][6].createPiece(_iHistoryID, BLACK,KNIGHT);
        _aCell[7][1].createPiece(_iHistoryID, WHITE,KNIGHT);
        _aCell[7][6].createPiece(_iHistoryID, WHITE,KNIGHT);
        
        _aCell[0][2].createPiece(_iHistoryID, BLACK,BISHOP);
        _aCell[0][5].createPiece(_iHistoryID, BLACK,BISHOP);
        _aCell[7][2].createPiece(_iHistoryID, WHITE,BISHOP);
        _aCell[7][5].createPiece(_iHistoryID, WHITE,BISHOP);
        
        _aCell[0][3].createPiece(_iHistoryID, BLACK,QUEEN);
        _aCell[0][4].createPiece(_iHistoryID, BLACK,KING);
        _aCell[7][3].createPiece(_iHistoryID, WHITE,QUEEN);
        _aCell[7][4].createPiece(_iHistoryID, WHITE,KING);
       
    };
    
    this.changeTurn = function(){
        if(_oMessage !== null){
            _oMessage.removeAnimated();
        }
        _bCheck = false;
        _iPlayerState = PLAYER_STATE_WAIT;
        
        if(_iCurPlayer === WHITE){
            _iCurPlayer = BLACK;
            
            var bEndGame = this.checkGameState();
            
            if(s_iGameType === MODE_COMPUTER){
                this._playAI(bEndGame);
            }

        } else {
            _iCurPlayer = WHITE;
            
            this.checkGameState();
        }
        
        _oInterface.activePlayer(_iCurPlayer);
    };
    
    this._playAI = function(bEndGame){
        if(!bEndGame){
            
            _oThinking = new CThinking();
            _oThinking.update();
            var iTimeThink = MIN_AI_THINKING + Math.random()*(MAX_AI_THINKING - MIN_AI_THINKING);
            
            var oMove = _oAI.getMove();

            if(oMove !== null){
                setTimeout(function(){
                    _oThinking.unload();
                    _oThinking = null;
                    s_oGame.cellClicked(oMove.sourcerow, oMove.sourcecol);
                    s_oGame.cellClicked(oMove.destrow, oMove.destcol);
                }, iTimeThink);
            }
        }
    };
    
    this.cellClicked = function(iRow, iCol){

        switch(_iPlayerState){
            case PLAYER_STATE_WAIT:{
                    this._disableAllThreat();
                    if(_aCell[iRow][iCol].getColor() !== null && _aCell[iRow][iCol].getColor() !== _iCurPlayer){
                        return;
                    }
                    this._selectPiece(iRow, iCol);
                    
                    break;
            }
            case PLAYER_STATE_SELECTED:{
                    if( _oCellActive.getLogicPos().row === iRow &&  _oCellActive.getLogicPos().col === iCol ){
                        //////// DESELECT PIECE
                        this._deselectPiece();
                    } else if(_aCell[iRow][iCol].getColor() === _iCurPlayer) {
                        //////// SELECT ANOTHER PIECE
                        this._deselectPiece();
                        this._selectPiece(iRow, iCol);
                        
                    } else if(_aCell[iRow][iCol].isHighlight()){
                        /////// MOVE OR EAT PIECE
                        this._checkLegalMove(iRow, iCol);

                    } else {
                        //////// DESELECT PIECE
                        this._deselectPiece();
                    }
                    playSound("click",1,false);
                    break;
            }
            case PLAYER_STATE_MOVING:{
                    break;
            }
        }
    };    
    
    this._checkLegalMove = function(iRow, iCol){
        var aNextMovesBoard = s_oBoardStateController.copyBoard(_aCell);
        s_oBoardStateController.moveCopiedPiece(aNextMovesBoard, _oCellActive.getLogicPos().row, _oCellActive.getLogicPos().col, iRow, iCol);
        
        var aThreatList = s_oBoardStateController.findAllChecks(_iCurPlayer, aNextMovesBoard);
        
        if(aThreatList.length === 0){
            var iSpecialMoveType = s_oBoardStateController.getSpecialMoves(_oCellActive.getLogicPos().row, _oCellActive.getLogicPos().col, iRow, iCol, _aCell);
            switch(iSpecialMoveType){
                case BOARD_SPECIAL_CASTLING_RIGHT:{
                        var oRightRook = _aCell[_oCellActive.getLogicPos().row][7];
                        var oDestinationCell = _aCell[_oCellActive.getLogicPos().row][5];
                        
                        oRightRook.shift(oDestinationCell);
                        break;
                }
                case BOARD_SPECIAL_CASTLING_LEFT:{
                        var oLeftRook = _aCell[_oCellActive.getLogicPos().row][0];
                        var oDestinationCell = _aCell[_oCellActive.getLogicPos().row][3];
                        
                        oLeftRook.shift(oDestinationCell);
                        break;
                }
                case BOARD_SPECIAL_ENPASSANT:{
                        var oPawnToPass = _aCell[_oCellActive.getLogicPos().row][iCol];
                        
                        oPawnToPass.eatUp();
                        break;
                }
            }
            
            _oCellActive.setActive(false);
            this._movePiece(iRow, iCol);
            this._deselectPiece();
            _iPlayerState = PLAYER_STATE_MOVING;
        }else {
            this._disableAllThreat();
            for(var i=0; i<aThreatList.length; i++){
                _aCell[aThreatList[i].getLogicPos().row][aThreatList[i].getLogicPos().col].threat(true);
            }
        }
    };
    
    this._movePiece = function(iRow, iCol){
        var oDestinationCell = _aCell[iRow][iCol];
        _oCellActive.move(oDestinationCell);
        
        if(oDestinationCell.getColor() !== null){
            oDestinationCell.eatUp();
        };
    };
    
    this._selectPiece = function(iRow, iCol){
        _oCellActive = _aCell[iRow][iCol];
        _oCellActive.setActive(true);
        var aMovesList = s_oMovesController.getMovesList(iRow, iCol, _aCell);
        for(var i=0; i<aMovesList.length; i++){
            _aCell[aMovesList[i].row][aMovesList[i].col].highlight(true);
        }
        _iPlayerState = PLAYER_STATE_SELECTED;
        
        playSound("click",1,false);
    };
    
    this._deselectPiece = function(){
        this._disableAllHighlight();
        _oCellActive.setActive(false);
        _oCellActive = null;
        _iPlayerState = PLAYER_STATE_WAIT;
    };
    
    this.onFinishMove = function(){
        this.setPieceDepth();
        
        ///////// CHECK IF A PAWN IS IN PROMOTION
        var oPawnPos = s_oBoardStateController.checkPromotion(_aCell);
        
        if(oPawnPos === null){
            this.changeTurn();
        } else {
            /////SHOW PROMO PANEL;
            if(s_iGameType === MODE_HUMAN){
                new CPromoPanel(_iCurPlayer, oPawnPos);
            } else {
                if(_iCurPlayer === BLACK){
                    this.changePiece(QUEEN, oPawnPos);
                    this.changeTurn();
                } else {
                    new CPromoPanel(_iCurPlayer, oPawnPos);
                }
            }
        }
    };  
    
    this.checkGameState = function(){
        var iCheckState =  s_oBoardStateController.getState(_iCurPlayer, _aCell);
        var bEndGame = false;
        
        switch(iCheckState){
            case BOARD_STATE_STALEMATE:{
                    this.gameOver(DRAW);
                    _oMessage = new CMessage(_iCurPlayer, TEXT_STALEMATE);
                    bEndGame = true;
                    break;
            }
            case BOARD_STATE_CHECK:{
                    _bCheck = true;
                    var aThreatList = s_oBoardStateController.findAllChecks(_iCurPlayer, _aCell);
                    for(var i=0; i<aThreatList.length; i++){
                        _aCell[aThreatList[i].getLogicPos().row][aThreatList[i].getLogicPos().col].threat(true);
                    }
                    _oMessage = new CMessage(_iCurPlayer, TEXT_CHECK);
                    break;
            }
            case BOARD_STATE_CHECKMATE:{
                    var iWinner = s_oBoardStateController.getOtherOpponent(_iCurPlayer);
                    _oMessage = new CMessage(_iCurPlayer, TEXT_CHECKMATE);
                    this.gameOver(iWinner);
                    bEndGame = true;
                    break;
            }
        }
        
        return bEndGame;
    };        
    
    this.setPieceDepth = function(){
        var aPiecesList = new Array();
        for(var i=0; i<_oPiecesContainer.children.length; i++){
            var oPiece = _oPiecesContainer.children[i];
            aPiecesList.push({height:oPiece.y, piece:oPiece});
        };
        aPiecesList.sort(this.compareHeight);

        var iCurDepth = 0;
        for(var i=0; i<_oPiecesContainer.children.length; i++){
            _oPiecesContainer.setChildIndex(aPiecesList[i].piece, iCurDepth++);
        }
    };
        
    this.compareHeight = function(a,b) {
        if (a.height < b.height)
           return -1;
        if (a.height > b.height)
          return 1;
        return 0;
    };
    
    this.getCells = function(){
        return _aCell;
    };
                            
    this.restartGame = function () {
        s_oMain.pokiShowCommercial(s_oGame._restartAfterCommercial);
    };        
    
    this._restartAfterCommercial = function(){
        s_oGame.unload();
        s_oGame._init();
    };
    
    this.pauseGame = function(bVal){
        _bStartGame = !bVal;
    };
    
    this.unload = function(){
        _bStartGame = false;
        
        _oInterface.unload();
        if(_oEndPanel !== null){
            _oEndPanel.unload();
        }
        
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
        
        s_oGame = null;
    };
 
    this._disableAllHighlight = function(){
        if(_oCellActive !== null){
            _oCellActive.setActive(false);
        }
        
        for(var i = 0; i < NUM_CELL; i++) {
            for(var j = 0; j < NUM_CELL; j++) {
                _aCell[i][j].highlight(false);   
                _aCell[i][j].threat(false);
            }
        }
    };
    
    this._disableAllThreat = function(){
        for(var i = 0; i < NUM_CELL; i++) {
            for(var j = 0; j < NUM_CELL; j++) {   
                _aCell[i][j].threat(false);
            }
        }
    };
    
    this.setAllVisible = function(bVal){
        for(var i = 0; i < NUM_CELL; i++) {
            for(var j = 0; j < NUM_CELL; j++) {
                _aCell[i][j].setVisible(bVal);   
            }
        }      
    };
 
    this.isCheck = function(){
        return _bCheck;
    };
 
    this.onExitPromoPanel = function(){
        this.changeTurn();
    };
 
    this.changePiece = function(szPiece, oPawnPos){
        var oCell = _aCell[oPawnPos.row][oPawnPos.col];
        oCell.changePiece(_iCurPlayer, szPiece);
    };
 
    this.getNewHistoryID = function(){
        return ++_iHistoryID;
    };

    this.onExit = function(){
        s_oMain.pokiShowCommercial();
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
        
        s_oGame.unload();
        s_oMain.gotoMenu();
    };
    
    
    
    this._onExitHelp = function () {
         _bStartGame = true;
    };
    
    this.gameOver = function(iWinner){  
        _bStartGame = false;
        
        if(iWinner === WHITE){
            if(s_iGameType === MODE_COMPUTER){
                PokiSDK.happyTime(1);
            }
            
            _iBlackScore = 0;

        } else if(iWinner === BLACK) {
            _iWhiteScore = 0;

        } else if(iWinner === DRAW){
            if(s_iGameType === MODE_COMPUTER){
                PokiSDK.happyTime(0.5);
            }
            
            _iBlackScore = 0;
            _iWhiteScore = 0;
        }
        
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        
        setTimeout(function(){
            PokiSDK.gameplayStop();
            _oEndPanel.show(iWinner, _iBlackTime, _iWhiteTime, _iBlackScore, _iWhiteScore);
            _oInterface.setInfoVisible(false);
        }, 1000);
        
    };
    
    this.isGameEnd = function(){
        return !_bStartGame;
    };
    
    this.update = function(){
        
        if(_bStartGame){
            if(_oThinking !== null){
                _oThinking.update();
            }
            
            this.setPieceDepth();
            
            if(_iCurPlayer === WHITE){
                _iWhiteTime += s_iTimeElaps;
                _oInterface.refreshWhiteTime(_iWhiteTime);
                
                _iWhiteScore -= (SCORE_DECREASE_PER_SECOND * s_iTimeElaps)/1000;
                if(_iWhiteScore < 0){
                    _iWhiteScore = 0;
                }
                _oInterface.refreshWhiteScore(Math.floor(_iWhiteScore));
            } else {
                _iBlackTime += s_iTimeElaps;
                _oInterface.refreshBlackTime(_iBlackTime);
                
                _iBlackScore -= (SCORE_DECREASE_PER_SECOND * s_iTimeElaps)/1000 ;
                if(_iBlackScore < 0){
                    _iBlackScore = 0;
                }
                _oInterface.refreshBlackScore(Math.floor(_iBlackScore));
                
            }
        }
        
    };

    SHOW_SCORE = oData.show_score;
    START_SCORE = oData.start_score;
    SCORE_DECREASE_PER_SECOND = oData.score_decrease_per_second;
    
    s_oGame=this;
    
    
    _oParent=this;
    this._init();
}

var s_oGame;
