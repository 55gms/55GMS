var ON_CONNECTION_ERROR = 0;
var ON_DISCONNECTION = 1;
var ON_DISCONNECTION_FROM_MATCH = 2;
var ON_LOGIN_SUCCESS = 3;
var ON_MATCHMAKING_CONNECTION_SUCCESS = 4;
var ON_GAMEROOM_CONNECTION_SUCCESS = 5;
var ON_USEROWNERROOM_CREATE_SUCCESS = 6;
var ON_USEROWNERROOM_JOIN_SUCCESS = 7;
var ON_ROOM_INFO_RETURNED = 8;
var ON_BACK_FROM_A_ROOM = 9;

var ERROR_CODE_UNKNOWNROOM = "UnknownRoom";

var ON_STATUS_ONLINE = "online";
var ON_STATUS_OFFLINE = "offline";

/////////////// ROOM TYPE
var ROOM_TYPE_MATCHMAKING = 'MatchmakingRoom';
var ROOM_TYPE_USEROWNER = 'UserOwnerRoom';
var ROOM_TYPE_GAME = "GameRoom";

var WAITING_PLAYERS_TIMEOUT = 10000;

function CNetworkManager(){
    
    var _aCbCompleted;
    var _aCbOwner;
    var _aAdjectives;
    var _aNouns;
    
    var _oCurConnection;
    var _oCurClient;
    var _oMessageForwarder;
    
    var _iPlayerOrderID;
    var _iRefreshLobbyListener;
    var _iOpponentLevel;
    
    var _szNickname;
    var _szEnemyNickname;
    var _szCurRoomID;
    var _szCurRoomPass;
    var _szBotName;
    
    this._init = function(){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();

        window.addEventListener('online',  this._onConnectionChangeStatusOnline);
        window.addEventListener('offline',  this._onConnectionChangeStatusOffline);
        
        _oMessageForwarder = new CNetworkMessageForwarder();
        
        _aAdjectives = [ 
            "Awesome","Formidable","Exalted","Colorful","Frantic","Majestic","Exuberant","Terrible","Impressive","Adorable","Alert","Amusing","Bored","Brave"
            ,"Calm","Carefree","Careless","Chilly","Clever","Clumsy","Cranky","Crazy","Excited","Fantastic","Foolish","Friendly","Fussy","Fuzzy","Generous"
            ,"Glowing","Great","Lumpy","Messy","Mighty","Peppy","Nimble","Blithering","Optimistic","Plump","Polite","Proud","Quick","Quiet","Rude","Rusty"
            ,"Shining","Silly","Sizzling","Sleepy","Slimy","Sloppy","Smooth","Sparkling","Speedy","Splendid","Starving","Steaming","Stinky","Strict","Sturdy"
            ,"Surprised","Tough","Tricky","Wild","Wise","Wonderful","Worried","Vigorous","Delightful","Haunted","Colossal","Vivacious","Infuriating","Rebellious"
            ,"Slippery","Vengeful","Fierce","Maniacal","Affluent","Decrepit","Glamorous","Opulent","Saucy","Calamitous","Egregious","Feckless","Insidious","Irksome"
            ,"Judicious","Nefarious","Pernicious","Petulant","Tenacious","Famous","Flabbergasted","Feral","Sinister","Fresh","Adventurous","Spoony","Noisy"
            ,"Whimsical","Amazing","Delicate","Hairless","Classy","Gangly","Disguised","Juicy","Ancient","Frosty","Savage","Fiery","Enraged","Surly","Dastardly"
            ,"Cantankerous","Freedom","Hazardous","Dramatic","Victory"
        ];

        _aNouns = [
            "Captain","Pilot","Commander","Squaddie","Scout","Turtle","Fox","Hawk","Falcon","Eagle","Jester","Joker","Potato","Sauce","Ace"
            ,"Flyer","Driver","Turkey","Chicken","Donkey","Goat","Llama","Antelope","Defender","Weasel","Hedgehog","Koala","Wolf","Groundhog"
            ,"Stranger","Wolverine","Honey Badger","Chameleon","Cook","Hippie","Boss","Goose","Crawdad","Ham Sandwich","Toaster","Jackhammer"
            ,"Grandma","Hot Dog","Spoon","Salt Shaker","Wizard","Waistcoat","Shovel","Unicorn","Pinecone","Ninja","Samurai","Cowboy","Buccaneer"
            ,"Vampire","Werewolf","Pirate","Ogre","Princess","Mentor","Fool","Cactus","Bigfoot","Farmer","Knight","Ghost","Towel","BLT","Sorceror"
            ,"Dinosaur","Disaster","Baby","Phoenix","Detective","Investigator","Eyeball","Hamster","Toad","Wombat","Worm","Hare","Zombie","Mutant"
            ,"Mime","Sheriff","Concoction","Toast","Lollipop","Pancake","Milkshake","Plumber","Chainsaw","Ice Cream","Penguin","Hammer","Criminal"
        ]
        
        
        //localStorage.clear();
    };

    this.unload = function(){
        s_oNetworkManager = null;
    };

    this.connectToSystem = function(){
        s_oNetworkManager.addEventListener(ON_LOGIN_SUCCESS, s_oNetworkManager.gotoLobby);
        //g_oCTLMultiplayer.showChooseNickName();
        
        s_oNetworkManager.login(g_oCTLMultiplayer.getNickname());
        
        /* INSTA MATCH IN GAME
        this.login("testnick"+Math.floor( Math.random()*1000 ));
        s_oNetworkManager.addEventListener(ON_LOGIN_SUCCESS, s_oNetworkManager.gotoMatchMakingRoom);
        */
        
    };

    this.login = function(szNickname){
        _szNickname = szNickname;
        
        var szIDNickname = this._setValidNick(szNickname);
        
        s_oNetworkManager.addEventListener(ON_CONNECTION_ERROR, this._onLoginFailed);
        
        PlayerIO.useSecureApiRequests = !MULTIPLAYER_TEST_LOCAL;	
        
        PlayerIO.authenticate(GAME_PLAYERIO_ID, "public", { userId: szIDNickname }, {}, function (client) {
            _oCurClient = client;
            _oCurClient.multiplayer.useSecureConnections = !MULTIPLAYER_TEST_LOCAL;
            //console.log("Authenticated to PlayerIO as: " + client.connectUserId);

            if(MULTIPLAYER_TEST_LOCAL){
                _oCurClient.multiplayer.developmentServer = 'localhost:8184';
                /*
                _oCurClient.multiplayer.createJoinRoom("fakeroom"+Math.random(), "fakeroom", false, null, null, function (connection) {
                    connection.addMessageCallback("*", _oMessageForwarder.messageHandler);
                    connection.addDisconnectCallback(s_oNetworkManager.callbackDisconnect);
                }, s_oNetworkManager.callbackError);
                */
            }
            
            if(_aCbCompleted[ON_LOGIN_SUCCESS]){
                _aCbCompleted[ON_LOGIN_SUCCESS].call(_aCbOwner[ON_LOGIN_SUCCESS]);
            }
            
        }, s_oNetworkManager.callbackError);
    };

    this._onLoginFailed = function(){
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showOfflineDialog( TEXT_SYS_NO_CONNECTION, "on_ctl_multiplayer_play_offline");
    };

    this._setValidNick = function(szNickname){
        var szValidNickname;
        var szCodeNumber = s_oNetworkManager._getRandomCodeNumber();
        
        ///EMPTY CASE
        if(szNickname === "" || szNickname === null || szNickname === undefined){
            szValidNickname = "guest-"+szCodeNumber;
            _szNickname = szValidNickname;
        } else {
            szValidNickname = szNickname +"-"+ szCodeNumber;
        }
        
        return szValidNickname; 
    };

    this._getRandomCodeNumber = function(){
        return Math.floor( Math.random()*1000);
    };

    /*
    this.generateRandomName = function(){
        var aListName = [
            "xmariox", "alex", "max", "mahuro", "biajus", "rob", "idah", "fabrix", "seth", "ikillyou", "commander", "admiral", "general", "seasalt", "emperorofthesea",
            "Aspect","Kraken","Dragon","Shiver","Dracula","Doom","Scar","Roadkill","Cobra","Psycho","Ranger","Ripley","Clink","Bruise","Bowser","Creep","Cannon","Daemon",
            "Steel","Tempest","Hurricane","Titanium","Tito", "Lightning", "IronHeart", "Sabotage" ,"Rex", "Hydra", "Terminator", "Agrippa", "Gash",
            "Blade","Katana","Gladius","Angon","Claymore","Pike","Hammer","Club","Heart","Gauntlet","Montante","Longbow","bow","Dagger"
        ];

        var iRandomIndex = Math.floor( Math.random()*aListName.length );
        var szRandomName = aListName[iRandomIndex];

        /////SET RANDOM NUMBER
        if(Math.random()> 0.5){
            var szRandomNumber = Math.floor( Math.random()*100 );
            /////ADD SPECIAL CHAR
            if(Math.random() > 0.5){
                var aSpecial = ["-", "_"];
                var iRandomIndex = Math.floor( Math.random()*aSpecial.length );
                var szSpecialChar = aSpecial[iRandomIndex];

                szRandomName += szSpecialChar;
            }
            szRandomName += szRandomNumber;
        }

        _szBotName = szRandomName;
        
        return szRandomName;
    };  
    */

    this._onConnectionChangeStatusOnline = function(){
        if(_aCbCompleted[ON_STATUS_ONLINE]){
            _aCbCompleted[ON_STATUS_ONLINE].call(_aCbOwner[ON_STATUS_ONLINE]);
        }
        
        if ( jQuery(".ctl-multiplayer-dlg-content").length > 0 ){
            s_oNetworkManager._onReconnection();
        }
    };

    this._onConnectionChangeStatusOffline = function(){
        if(_aCbCompleted[ON_STATUS_OFFLINE]){
            _aCbCompleted[ON_STATUS_OFFLINE].call(_aCbOwner[ON_STATUS_OFFLINE]);
        }
        
        if ( jQuery(".ctl-multiplayer-dlg-content").length > 0 ){
            g_oCTLMultiplayer.closeAllDialog();
            g_oCTLMultiplayer.showOfflineDialog( TEXT_SYS_NO_CONNECTION, "on_ctl_multiplayer_play_offline");
            
            s_oNetworkManager.disconnect();
        }
    };

    this._onReconnection = function(){
        
        if(_szNickname === null || _szNickname === undefined){
            g_oCTLMultiplayer.closeAllDialog();
            s_oNetworkManager.connectToSystem();
        }else {
            g_oCTLMultiplayer.closeAllDialog();
            s_oNetworkManager.gotoLobby();
        }
    };

    this.generateRandomName = function(){
        var iRandomAdjectiveIndex = Math.floor( Math.random()*_aAdjectives.length );
        var szRandomAdjective = _aAdjectives[iRandomAdjectiveIndex];
        
        var iRandomNounIndex = Math.floor( Math.random()*_aNouns.length );
        var szRandomNoun = _aNouns[iRandomNounIndex];
        
        var szFullName = szRandomAdjective + " " + szRandomNoun;
        
        return szFullName;
    };

    this.setBotName = function(szName){
        _szBotName = szName;
    };

    this.getBotName = function(){
        return _szBotName;
    };

    this.setOpponentLevel = function(iLevel){
        _iOpponentLevel = iLevel;
    };

    this.getOpponentLevel = function(){
        return _iOpponentLevel;
    };

    this.addEventListener = function(iEvent,cbCompleted, cbOwner){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    ///////////////////////////////// EVENT FUNCTIONS
    //Log all errors to console
    this.callbackError = function(error) {
            console.log("Error: " + error.code + " - " + error.message);
            if(_aCbCompleted[ON_CONNECTION_ERROR]){
                _aCbCompleted[ON_CONNECTION_ERROR].call(_aCbOwner[ON_CONNECTION_ERROR], error);
            }
    };
    
    //Log disconnection
    this.callbackDisconnect = function(error) {
            //console.log("disconnect: " + error.code + " - " + error.message);
            if(_aCbCompleted[ON_DISCONNECTION]){
                _aCbCompleted[ON_DISCONNECTION].call(_aCbOwner[ON_DISCONNECTION], error);
            }
    };
    
    //Log disconnection from match
    this.callbackDisconnectFromMatch = function(error){
        //console.log("Disconnected From Match");
        if(_aCbCompleted[ON_DISCONNECTION_FROM_MATCH]){
            _aCbCompleted[ON_DISCONNECTION_FROM_MATCH].call(_aCbOwner[ON_DISCONNECTION_FROM_MATCH], error);
        }
    };
    
    //////////////////// COMMUNICATION TO SERVER /////////
    this.sendMsg = function(szMessage, oParam){
        if(_oCurConnection){
            _oCurConnection.send(szMessage, oParam);
        }
    };
    //////////////////////////////////////////////////////

    this.disconnect = function(){
        if(_oCurConnection){
            _oCurConnection.disconnect();
            _oCurConnection = null;
        }
        
    };
    
    this.isUserA = function(){
        return parseInt(_iPlayerOrderID) === 0 ? true:false;
    };
    
    this.getPlayerOrderID = function(){
        return _iPlayerOrderID;
    };
    
    this.getPlayerNickname = function(){
        return _szNickname;
    };
    
    this.getEnemyNickname = function(){
        return _szEnemyNickname;
    };
    
    ////////////////////////////////////////////////////////////
    ///////////////////// ROOMS SYSTEM FUNCTIONS////////////////

    this.createRoom = function(szRoomID, szPass){
        s_oNetworkManager.addEventListener(ON_USEROWNERROOM_CREATE_SUCCESS, this._onRoomCreated);

        //Use local development server
        if(MULTIPLAYER_TEST_LOCAL){
            _oCurClient.multiplayer.developmentServer = 'localhost:8184';
        }
        
        //Join the room
        _oCurClient.multiplayer.createJoinRoom(szRoomID, ROOM_TYPE_USEROWNER, true, {id: szRoomID, pass: szPass}, {nickname:_szNickname, level:s_oSocialManager.getLevelByExp(s_iCurExp)}, function (connection) {

            //console.log("create owner room for user: " + _oCurClient.connectUserId);
            _oCurConnection = connection;
            connection.addMessageCallback("*", _oMessageForwarder.messageHandler);
            connection.addDisconnectCallback(s_oNetworkManager.callbackDisconnect);

            if(_aCbCompleted[ON_USEROWNERROOM_CREATE_SUCCESS]){
                _aCbCompleted[ON_USEROWNERROOM_CREATE_SUCCESS].call(_aCbOwner[ON_USEROWNERROOM_CREATE_SUCCESS]);
            }


        }, s_oNetworkManager.callbackError);
    };
    
    this.joinRoom = function(szRoomID){
        s_oNetworkManager.addEventListener(ON_CONNECTION_ERROR, this._onRoomJoinedFailed);
        //console.log("join room as: " + _oCurClient.connectUserId);

        //Use local development server
        if(MULTIPLAYER_TEST_LOCAL){
            _oCurClient.multiplayer.developmentServer = 'localhost:8184';
        }

        //Join the room
        _oCurClient.multiplayer.joinRoom(szRoomID, {nickname:_szNickname, level:s_oSocialManager.getLevelByExp(s_iCurExp)}, function (connection) {
            _oCurConnection = connection;
            connection.addMessageCallback("*", _oMessageForwarder.messageHandler);
            connection.addDisconnectCallback(s_oNetworkManager.callbackDisconnect);

            if(_aCbCompleted[ON_USEROWNERROOM_JOIN_SUCCESS]){
                _aCbCompleted[ON_USEROWNERROOM_JOIN_SUCCESS].call(_aCbOwner[ON_USEROWNERROOM_JOIN_SUCCESS]);
            }
        }, s_oNetworkManager.callbackError);
    };
    
    this.gotoGameRoom = function(oMessage){
        //Use local development server
        if(MULTIPLAYER_TEST_LOCAL){
            _oCurClient.multiplayer.developmentServer = 'localhost:8184';
        }

        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showLoading(TEXT_MATCH_FOUND.toUpperCase());

        var szRoomID = oMessage.getString(0);
        _iPlayerOrderID = oMessage.getInt(1);
        _szEnemyNickname = oMessage.getString(2);

        _iOpponentLevel = parseInt(oMessage.getString(4));

        var szMatchType = oMessage.getString(5);

        s_oNetworkManager.addEventListener(ON_CONNECTION_ERROR,  s_oNetworkManager.disconnect );

        //Join the room
        
        _oCurClient.multiplayer.createJoinRoom(szRoomID, ROOM_TYPE_GAME, false, null, null, function (connection) {
                //s_oNetworkManager.addEventListener(ON_DISCONNECTION_FROM_MATCH, function(){});
                s_oNetworkManager.sendMsg(MSG_MOVED_INTO_GAME, "");
                _oCurConnection.disconnect();
            
                _oCurConnection = connection;
                connection.addMessageCallback("*", _oMessageForwarder.messageHandler);
                connection.addDisconnectCallback(s_oNetworkManager.callbackDisconnectFromMatch);

                s_oNetworkManager.addEventListener(ON_CONNECTION_ERROR,  function(){} );

                //console.log("game found! move players to a private game room");

                //g_oCTLMultiplayer.closeAllDialog();

                //s_oNetworkManager.addEventListener(ON_DISCONNECTION, function(){console.log("sono in game e l'altro si è disconnesso")});

                if(_aCbCompleted[ON_GAMEROOM_CONNECTION_SUCCESS]){
                    _aCbCompleted[ON_GAMEROOM_CONNECTION_SUCCESS].call(_aCbOwner[ON_GAMEROOM_CONNECTION_SUCCESS], szMatchType);
                }


        }, s_oNetworkManager.callbackError);
    };
    
    this.gotoMatchMakingRoom = function(){
        //Use local development server
        if(MULTIPLAYER_TEST_LOCAL){
            _oCurClient.multiplayer.developmentServer = 'localhost:8184';
        }

        //Join the room
        _oCurClient.multiplayer.createJoinRoom('matchmakingroom1', ROOM_TYPE_MATCHMAKING, true, null, {nickname:_szNickname, level:s_oSocialManager.getLevelByExp(s_iCurExp)}, function (connection) {
                _oCurConnection = connection;
                connection.addMessageCallback("*", _oMessageForwarder.messageHandler);
                connection.addDisconnectCallback(s_oNetworkManager.callbackDisconnect);

                //console.log("Connected to matchmaking room");

                if(_aCbCompleted[ON_MATCHMAKING_CONNECTION_SUCCESS]){
                    _aCbCompleted[ON_MATCHMAKING_CONNECTION_SUCCESS].call(_aCbOwner[ON_MATCHMAKING_CONNECTION_SUCCESS]);
                }
                

        }, s_oNetworkManager.callbackError);
    };

    this.tryCreateUniqueRoom = function(szRoomID, szPass){
        _szCurRoomID = szRoomID;
        _szCurRoomPass = szPass;
        
        _oCurClient.multiplayer.listRooms(ROOM_TYPE_USEROWNER, {id: szRoomID}, 0,0,s_oNetworkManager._onUniqueListRoomSearch, s_oNetworkManager.callbackError);
    };
    
    this._onUniqueListRoomSearch = function(aRooms){
        if(aRooms.length > 0){
            ///ANOTHER ROOM WITH SAME NAME EXIST!
            _szCurRoomID += "-" + s_oNetworkManager._getRandomCodeNumber();
        }
        
        s_oCMGApi.showAd(()=>{
            s_oNetworkManager.createRoom(_szCurRoomID, _szCurRoomPass);
        });
    };

    this._onRoomCreated = function(){
        g_oCTLMultiplayer.closeAllDialog();
        
        g_oCTLMultiplayer.showLoading(TEXT_WAITING_FOR_OPPONENT_IN_ROOM.toUpperCase()+"<br><br>" +_szCurRoomID.toUpperCase(), "s_oNetworkManager._onDisconnectFromARoom");
    };
    
    this._onDisconnectFromARoom = function(){
        if(_aCbCompleted[ON_BACK_FROM_A_ROOM]){
            _aCbCompleted[ON_BACK_FROM_A_ROOM].call(_aCbOwner[ON_BACK_FROM_A_ROOM]);
        }
        
        s_oNetworkManager.disconnect();

        ///Seems there is some delay to listrooms when you delete a room. Even with a callback to disconnect function
        setTimeout(function(){
            s_oNetworkManager.gotoLobby();
        }, 250);
    };
    
    this._onRoomJoined = function(){
        
    };
    
    this._onRoomJoinedFailed = function(szError){
        s_oNetworkManager.addEventListener(ON_CONNECTION_ERROR, function(){});
        
        switch(szError.code){
            case ERROR_CODE_UNKNOWNROOM: {
                    g_oCTLMultiplayer.closeAllDialog();
                    g_oCTLMultiplayer.showGeneralDialog(TEXT_ROOM_DOESNT_EXIST, "s_oNetworkManager.gotoLobby");
                break;
            }
        }
    };
    
    this.gotoLobby = function(){
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showLoading(TEXT_CONNECT_TO_LOBBY);
        
        _oCurClient.multiplayer.listRooms(ROOM_TYPE_USEROWNER, null, 0,0,s_oNetworkManager._onListRoom, s_oNetworkManager.callbackError);
    };
    
    this._onListRoom = function(aRooms){
        var aRoomInfo = s_oNetworkManager._extractRoomInfo(aRooms);
        
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showRoomList(aRoomInfo);
        
        clearTimeout(_iRefreshLobbyListener);
        
        _iRefreshLobbyListener = setInterval(function(){
            
            if ( jQuery(".ctl-multiplayer-room-list").length > 0 ){
                _oCurClient.multiplayer.listRooms(ROOM_TYPE_USEROWNER, null, 0,0,s_oNetworkManager._onAutoRefreshRoom, s_oNetworkManager.callbackError);
            }else{
                clearTimeout(_iRefreshLobbyListener);
            }
            
        }, 10000);
    };
    
    this._onAutoRefreshRoom = function(aRooms){
        var aRoomInfo = s_oNetworkManager._extractRoomInfo(aRooms);

        g_oCTLMultiplayer.refreshRoomList(aRoomInfo);
    };
    
    this._extractRoomInfo = function(aRooms){
        var aRoomInfo = new Array();
        for(var i=0; i<aRooms.length; i++){
            
            var bPrivate = aRooms[i].roomData.pass.length === 0 ? false : true;
            
            aRoomInfo[i] = {name: aRooms[i].id, private:bPrivate};
        }
        
        return aRoomInfo;
    };
    
    this.joinQuickMatch = function(){
        g_oCTLMultiplayer.showLoading(TEXT_NETWORK_CONNECTING);
        
        s_oCMGApi.showAd(()=>{
            s_oNetworkManager.gotoMatchMakingRoom();
        });
    };

    this.tryJoinRoomWithPass = function(szRoomID, szPass){
        _szCurRoomID = szRoomID;
        _szCurRoomPass = szPass;
        
        s_oNetworkManager.addEventListener(ON_ROOM_INFO_RETURNED, s_oNetworkManager._checkUserPermissionToJoin);
        s_oNetworkManager.getRoomInfo(szRoomID, szPass);
    };
    
    this._checkUserPermissionToJoin = function(aRoomInfo){
        if(aRoomInfo.length > 0){
            //"PERMISSIONGRANTED"
            s_oNetworkManager.joinRoom(aRoomInfo[0].roomData.id, aRoomInfo[0].roomData.pass);
        }else {
            //"PERMISSIONREFUSED"
            g_oCTLMultiplayer.closeAllDialog();
            g_oCTLMultiplayer.showGeneralDialog(TEXT_WRONG_PASSWORD, "s_oNetworkManager._onPasswordFailed");
        }
    };
    
    this._onPasswordFailed = function(){
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showTypeRoomPassword(_szCurRoomID);
    };
    
    this.getRoomInfo = function(szRoomID, szPass){
        _oCurClient.multiplayer.listRooms(ROOM_TYPE_USEROWNER, {id: szRoomID, pass: szPass}, 0,0, s_oNetworkManager._onRoomInfoReturned, s_oNetworkManager.callbackError);
    };
    
    this._onRoomInfoReturned = function(aRoomInfo){
        if(_aCbCompleted[ON_ROOM_INFO_RETURNED]){
            _aCbCompleted[ON_ROOM_INFO_RETURNED].call(_aCbOwner[ON_ROOM_INFO_RETURNED], aRoomInfo);
        }
    };

    

    this._init();
}

