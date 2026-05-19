///////MESSAGE TYPE ARE ONLY STRING
////MSG FROM SERVER
var MSG_ROOM_IS_FULL = "room_is_full";
var MSG_GAME_FOUND = "game_found";
var MSG_EXIT_FROM_MENU = "exit_from_menu";
var MSG_SET_WINNER = "set_winner";
var MSG_CHANGE_TURN = "change_turn";
var MSG_REMATCH_PANEL = "rematch_panel";
var MSG_REMATCH_ANSWER_RESULTS = "rematch_answer_results";
var MSG_STRIKER_KICKS_RESULTS = "striker_kicks_results";
var MSG_GOALKEEPER_SAVES_RESULTS = "goalkeeper_saves_results";
var MSG_NEXT_PLAYER_TO_PICK_TEAM = "next_player_to_pick_team";
var MSG_ALL_TEAM_SELECTED = "all_team_selected";

var MSG_PLAYER_DISCONNECTED_WHILE_ENTERING_IN_GAME = "player_disconnected_while_entering_in_game";
var MSG_START_THE_GAME = "start_the_game";
var MSG_RECEIVE_QUIZ = "receive_quiz";
var MSG_PLAYER_ANSWER = "player_answer";
var MSG_PLAYER_ACCEPTED_A_REMATCH_NOTIFY = "player_accepted_a_rematch_notify";

var MSG_UPDATE_OPPONENT_LEVEL = "update_opponent_level";

////MSG TO SERVER
var MSG_END_TURN = "end_turn";
var MSG_END_MATCH = "end_match";
var MSG_ACCEPT_REMATCH = "accept_rematch";
var MSG_DISCONNECTION = "disconnection";
var MSG_STRIKER_KICKS = "striker_kicks";
var MSG_GOALKEEPER_SAVES = "goalkeeper_saves"
var MSG_TEAM_SELECTED = "team_selected";

var MSG_MOVED_INTO_GAME = "moved_into_game";
var MSG_SEND_QUIZ = "send_quiz";
var MSG_SEND_TO_SERVER_ANSWER_CHOSEN = "send_to_server_answer_chosen";

var MSG_UPDATE_LEVEL = "update_level";

function CNetworkMessageForwarder(){
    
    var _oThis;
    
    this._init = function(){
        
    };
      
    //////////////////// COMMUNICATION FROM SERVER /////////
    this.messageHandler = function(message){
        switch (message.type) {
            case MSG_ROOM_IS_FULL: _oThis._onFullRoom(message); break;
            case MSG_GAME_FOUND: _oThis._onGameFound(message); break;
            case MSG_EXIT_FROM_MENU: _oThis._onExitFromMenu(message); break;
            case MSG_SET_WINNER: _oThis._onSetWinner(message); break;
            case MSG_CHANGE_TURN: _oThis._onChangeTurn(message); break;
            case MSG_REMATCH_PANEL: _oThis._onRematchPanel(message); break;
            
            case MSG_PLAYER_DISCONNECTED_WHILE_ENTERING_IN_GAME: _oThis._onPlayerDisconnectionWhileEnteringInGame(message); break;
            case MSG_START_THE_GAME: _oThis._onGameStart(message); break;
            
            case MSG_REMATCH_ANSWER_RESULTS: _oThis._onRematchResults(message); break;
            case MSG_STRIKER_KICKS_RESULTS: _oThis._onStrikerKicksResults(message); break;
            case MSG_GOALKEEPER_SAVES_RESULTS: _oThis._onGoalkeeperSavesResults(message); break;
            case MSG_NEXT_PLAYER_TO_PICK_TEAM: _oThis._onNextPlayerToPickTeam(message); break;
            case MSG_ALL_TEAM_SELECTED: _oThis._onAllTeamSelected(message); break;
            case MSG_RECEIVE_QUIZ: _oThis._onQuizReceived(message); break;
            case MSG_PLAYER_ANSWER: _oThis._onPlayerAnswerChosen(message); break; 
            case MSG_PLAYER_ACCEPTED_A_REMATCH_NOTIFY: _oThis._onNotifyPlayerAcceptedRematch(message); break;
            
            case MSG_UPDATE_OPPONENT_LEVEL: _oThis._onUpdateOpponentLevel(message); break;
        }
    };
    
    this._onFullRoom = function(){
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showGeneralDialog(TEXT_ROOM_IS_FULL, "s_oNetworkManager.gotoLobby");
    };
    
    this._onGameFound = function(szMessage){
        s_oNetworkManager.gotoGameRoom(szMessage);
    };
    
    this._onPlayerDisconnectionWhileEnteringInGame = function(szMessage){
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showGeneralDialog(TEXT_OPPONENT_LEFT, "s_oNetworkManager.gotoLobby");
    };
    
    this._onGameStart = function(szMessage){
        if(s_oMenu){
            s_oMenu.onRemoteGameStart();
        }
    };
    
    this._onExitFromMenu = function(szMessage){
        if(s_oSelectMenu){
            s_oSelectMenu.opponentLeaveTheGame();
        }
    };
    
    this._onSetWinner = function(szMessage){
        if(s_oGame){
            s_oGame.opponentLeftTheGame();
        }
    };
    
    this._onChangeTurn = function(){
        if(s_iCurState === STRIKER_MODE){
            if(s_oGameStriker){
                s_oGameStriker.endTurn();            
            }
        }else {
            if(s_oGameKeeper){
                s_oGameKeeper.endTurn();            
            }
        }
    };
    
    this._onRematchPanel = function(){
        if(s_oGame){
            s_oGame.showRematchQuestion(); 
        }
    };

    this._onRematchResults = function(szMessage){
        if(s_oGame){
            var bAccepted = szMessage.getBoolean(0);
            if(bAccepted){
                s_oGame.onOpponentAcceptRematch();
            }else {
                s_oGame.onOpponentRefuseRematch();
            }
        }
    };

    this._onNextPlayerToPickTeam = function(szMessage){
        if(s_oSelectMenu){
            var szInfo = szMessage.getString(0);
            var oData = JSON.parse(szInfo);

            if(parseInt(oData.nextplayertopick) === s_oNetworkManager.getPlayerOrderID()){
                s_oSelectMenu.gotoTeamSelect(oData.teamspicked);
            };
        }
    };

    this._onAllTeamSelected = function(szMessage){        
        if(s_oSelectMenu){
            var szInfo = szMessage.getString(0);
            var oData = JSON.parse(szInfo);
            
            s_oSelectMenu.onGameStart(oData);
        }
    };

    this._onStrikerKicksResults = function(szMessage){
        if(s_oGameKeeper){
            var szInfoMoves = szMessage.getString(0);
            var oData = JSON.parse(szInfoMoves);

            s_oGameKeeper.remoteStartOpponentShot(oData[MSG_STRIKER_KICKS]);
        }
    };

    this._onGoalkeeperSavesResults = function(szMessage){
        if(s_oGameStriker){
            var szInfoMoves = szMessage.getString(0);
            var oData = JSON.parse(szInfoMoves);

            s_oGameStriker.onRemoteGoalkeeperResults(oData[MSG_GOALKEEPER_SAVES]);
        }
    };
    
    this._onQuizReceived = function(szMessage){
        var szQuizData = szMessage.getString(0);
        var oData = JSON.parse(szQuizData);
            
        if(s_iCurState === STRIKER_MODE){
            if(s_oGameStriker){
                s_oGameStriker.onQuizReceived(oData);
            }
        }else {
            if(s_oGameKeeper){
                s_oGameKeeper.onQuizReceived(oData);            
            }
        }
    };
    
    this._onPlayerAnswerChosen = function(szMessage){
        var szInfo = szMessage.getString(0);
        var oData = JSON.parse(szInfo);
        
        if(s_oGame){
            s_oGame.chooseQuizAnswer(oData.answerindex);
        }
    };
    
    this._onNotifyPlayerAcceptedRematch = function(szMessage){
        if(s_oGame){
            s_oGame.notifyAcceptedRematch();
        }
    };
    
    this._onUpdateOpponentLevel = function(szMessage){
        var szInfo = szMessage.getString(0);
        var iLevel = JSON.parse(szInfo);
        
        iLevel = parseInt(iLevel);
        
        console.log(iLevel)
        
        s_oNetworkManager.setOpponentLevel(iLevel);
    };
    
    _oThis = this;
    this._init();
};


