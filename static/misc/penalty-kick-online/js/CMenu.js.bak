function CMenu() {
    var _pStartPosAudio;
    var _pStartPosLocal;
    var _pStartPosMulti;
    var _pStartPosInfo;
    var _pStartPosFullscreen;
    var _pStartPosDelete;
    
    var _iIdTimeout;
    
    var _oBg;
    var _oButLocal;
    var _oButMultiplayer;
    var _oButInfo;
    var _oButDeleteSavings;
    var _oAreYouSurePanel;
    var _oFade;
    var _oAudioToggle;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    
    var _oMenuInfoPanel;
    var _oButAchievements;
    var _oButStats;
    var _pStartInfoPos;
    var _pStartAchievementsPos;
    var _pStartStatsPos;
    
    var _oAchievementsPanel;
    var _oStatsPanel;

    this._init = function () {
        //console.clear();

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);

        _pStartPosLocal = {x: (CANVAS_WIDTH/2) - 100, y: CANVAS_HEIGHT -100};
        var oSprite = s_oSpriteLibrary.getSprite('but_local');
        _oButLocal = new CGfxButton(_pStartPosLocal.x,_pStartPosLocal.y,oSprite, s_oStage);
        _oButLocal.addEventListener(ON_MOUSE_UP, this._onButLocalRelease, this);
        
        _pStartPosMulti = {x: (CANVAS_WIDTH/2) + 100, y: CANVAS_HEIGHT -100};
        var oSprite = s_oSpriteLibrary.getSprite('but_multiplayer');
        _oButMultiplayer = new CGfxButton(_pStartPosMulti.x,_pStartPosMulti.y,oSprite, s_oStage);
        _oButMultiplayer.addEventListener(ON_MOUSE_UP, this._onButMultiplayerRelease, this);


        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height / 2) - 10, y: CANVAS_HEIGHT - (oSprite.height / 2) - 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        var oSpriteInfo = s_oSpriteLibrary.getSprite("but_info");
        _pStartPosInfo = {x: (oSpriteInfo.height / 2) + 10, y: (oSpriteInfo.height / 2) + 10};
        _oButInfo = new CGfxButton(_pStartPosInfo.x, _pStartPosInfo.y, oSpriteInfo, s_oStage);
        _oButInfo.addEventListener(ON_MOUSE_UP, this._onButInfoRelease, this);
        _oButInfo.setVisible(false);
        
        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:_pStartPosInfo.x + oSprite.width/2 + 10,y:oSprite.height/2 + 10};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        var oSprite = s_oSpriteLibrary.getSprite("but_delete_savings");
        _pStartPosDelete = {x:oSprite.width/2 + 10,y:CANVAS_HEIGHT-oSprite.height/2 - 10};
        _oButDeleteSavings = new CGfxButton(_pStartPosDelete.x,_pStartPosDelete.y,oSprite,s_oStage);
        _oButDeleteSavings.addEventListener(ON_MOUSE_UP,this._onDeleteSavings,this);
        if(s_oLocalStorage.getStoredTeamSelected() === null && s_oSocialManager.getFavouriteCountry() === null){
            _oButDeleteSavings.setVisible(false);
        };
        
        var oSprite = s_oSpriteLibrary.getSprite("logo");
        var oLogo = createBitmap(oSprite);
        oLogo.regX = oSprite.width/2;
        oLogo.regY = oSprite.height/2;
        oLogo.x = CANVAS_WIDTH/2;
        oLogo.y = CANVAS_HEIGHT/2 - 110;
        oLogo.scale = 0.8;
        s_oStage.addChild(oLogo);
        
        var oSprite = s_oSpriteLibrary.getSprite("menu_info_panel_small");
        _pStartInfoPos = {x: CANVAS_WIDTH/2-80, y: oSprite.height/2 + 10};
        _oMenuInfoPanel = new CMenuInfoPanel(_pStartInfoPos.x, _pStartInfoPos.y, s_oStage);
        _oMenuInfoPanel.addEventListener(ON_REFRESH, this._generateNewName, this);
        var szNickName = g_oCTLMultiplayer.getNickname();
        if(szNickName === "" || szNickName === null || szNickName === undefined){
            this._generateNewName();
        }else {
            _oMenuInfoPanel.setName(szNickName);
        }

        var oInfo = s_oSocialManager.getLevelInfoByExp(s_iCurExp);
        _oMenuInfoPanel.setExpBar(oInfo);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_achievements');
        _pStartAchievementsPos = {x: _pStartInfoPos.x+386, y: _pStartInfoPos.y};
        _oButAchievements = new CGfxButton(_pStartAchievementsPos.x,_pStartAchievementsPos.y,oSprite, s_oStage);
        _oButAchievements.addEventListener(ON_MOUSE_UP, this._onButAchievements, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_stats');
        _pStartStatsPos = {x: _pStartAchievementsPos.x +oSprite.width+10, y: _pStartInfoPos.y};
        _oButStats = new CGfxButton(_pStartStatsPos.x,_pStartStatsPos.y,oSprite, s_oStage);
        _oButStats.addEventListener(ON_MOUSE_UP, this._onButStats, this);

        _oAreYouSurePanel = new CAreYouSurePanel(s_oStage);
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN,this._onConfirmDelete,this);
        
        _oAchievementsPanel = new CAchievementsPanel(s_oStage);
        //_oAchievementsPanel.show();
        
        _oStatsPanel = new CStatsPanel(s_oStage);
        //_oStatsPanel.show();

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            _oFade.visible = false;
        });

        if(!s_oLocalStorage.isAvailable()){
            new CMsgBox(TEXT_ERR_LS,s_oStage);
        }

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
        
        //localStorage.clear();
    };

    this.refreshButtonPos = function (iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,  _pStartPosAudio.y - iNewY);
        }
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX,_pStartPosFullscreen.y + iNewY);
        }
        _oButInfo.setPosition(_pStartPosInfo.x + iNewX, _pStartPosInfo.y + iNewY);
        _oButDeleteSavings.setPosition(_pStartPosDelete.x + iNewX, _pStartPosDelete.y - iNewY);
        
        _oButLocal.setPosition(_pStartPosLocal.x, _pStartPosLocal.y - iNewY);
        _oButMultiplayer.setPosition(_pStartPosMulti.x, _pStartPosMulti.y - iNewY);

        _oMenuInfoPanel.setPos(_pStartInfoPos.x, _pStartInfoPos.y + iNewY);
        _oButAchievements.setPosition(_pStartAchievementsPos.x, _pStartAchievementsPos.y + iNewY);
        _oButStats.setPosition(_pStartStatsPos.x, _pStartStatsPos.y + iNewY);
        
        _oAchievementsPanel.refreshButtonPos();
        _oStatsPanel.refreshButtonPos();
    };

    this.unload = function () {
        _oButLocal.unload(); 
        _oButLocal = null;
        _oButMultiplayer.unload(); 
        _oButMultiplayer = null;

        _oButAchievements.unload();
        _oButStats.unload();
        _oAchievementsPanel.unload();
        _oStatsPanel.unload();

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        _oButDeleteSavings.unload();
        _oAreYouSurePanel.unload();
        s_oStage.removeAllChildren();

        clearTimeout(_iIdTimeout);

        s_oMenu = null;
    };

    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onButInfoRelease = function () {
        new CCreditsPanel();
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.enabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };
    
    this._onFullscreenRelease = function(){
        if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    this._onDeleteSavings = function(){
        _oAreYouSurePanel.show(TEXT_CONFIRM_DELETE);
    };
    
    this._onConfirmDelete = function(){
        s_oLocalStorage.clearAllItem();  
        _oButDeleteSavings.setVisible(false);
        
        var oInfo = s_oSocialManager.getLevelInfoByExp(s_iCurExp);
        _oMenuInfoPanel.setExpBar(oInfo);
        
        _oAchievementsPanel.refreshAllProgress();
        
        _oStatsPanel.unload();
        _oStatsPanel = new CStatsPanel(s_oStage);
        
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this._onButLocalRelease = function(){
        if(parent.cmgGameEvent){
            parent.cmgGameEvent("start","clickSingleplayer")
        }
        
        s_bMultiplayer = false;
        s_bPlayWithBot = false;
        
        $(s_oMain).trigger("start_session");

        this.unload();
        
        if(s_oLocalStorage.getStoredTeamSelected() === null){
            s_oMain.gotoSelectTeam();
        }else{
            s_iTeamSelected = s_oLocalStorage.getStoredTeamSelected();
            s_iLastLevel = s_oLocalStorage.getLastLevel();
            
            s_oMain.gotoLevelPanel();
        }
    };

    this._onButMultiplayerRelease = function(){
        if(parent.cmgGameEvent){
            parent.cmgGameEvent("start","clickMultiplayer")
        }
        
        $(s_oMain).trigger("start_session");
        
        s_bMultiplayer = true;
        s_bPlayWithBot = false;

        s_oNetworkManager.addEventListener(ON_GAMEROOM_CONNECTION_SUCCESS, this._onGameStart);
        s_oNetworkManager.addEventListener(ON_MATCHMAKING_CONNECTION_SUCCESS, this._onMatchmakingConnected);
        s_oNetworkManager.connectToSystem();
    };

    this.onRemoteGameStart = function(){
        g_oCTLMultiplayer.closeAllDialog();
        
        s_bMultiplayer = true;
        s_bPlayWithBot = false;
        
        s_oMenu.unload();
        s_oMain.gotoSelectTeamMulti();
    };

    this._onGameStart = function(szMatchType){
        
        if(szMatchType === ROOM_TYPE_MATCHMAKING){
            if(parent.cmgGameEvent){
                parent.cmgGameEvent("start","startRandomMatch");
            }
        }else {
            if(parent.cmgGameEvent){
                parent.cmgGameEvent("start","startPrivateMatch");
            }
        }
        
        _iIdTimeout = setTimeout(function(){
            g_oCTLMultiplayer.closeAllDialog();
            g_oCTLMultiplayer.showGeneralDialog(TEXT_OPPONENT_LEFT, "s_oNetworkManager.gotoLobby");
            s_oNetworkManager.disconnect();
        }, WAITING_PLAYERS_TIMEOUT);
    };

    this._onMatchmakingConnected = function(){
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showLoading(TEXT_FIND_OPPONENT, "s_oNetworkManager._onDisconnectFromARoom");
    };
    /*
    this._checkMatchWithBot = function(){
        var iTime = randomFloatBetween(18000, 26000);
        _iIdTimeout = setTimeout(function(){
            s_bMultiplayer = true;
            s_bPlayWithBot = true;
            
            g_oCTLMultiplayer.closeAllDialog();
            
            s_oNetworkManager.disconnect();
            
            s_oNetworkManager.generateRandomName();
            
            s_oMenu.unload();
            s_oMain.gotoSelectTeamMulti();
        }, iTime);
    };
    
    this.clearBotCheck = function(){
        clearTimeout(_iIdTimeout);
    };
    */
    this.onPlayOffline = function(){
        this._onButLocalRelease();
        g_oCTLMultiplayer.closeAllDialog();
    };
    
    this._generateNewName = function(){
        var szNickName = s_oNetworkManager.generateRandomName();
        g_oCTLMultiplayer.setNickName(szNickName);
        _oMenuInfoPanel.setName(szNickName);
    };
    
    this._onButAchievements = function(){
        _oAchievementsPanel.show();
        if(parent.cmgGameEvent){
            parent.cmgGameEvent("start","clickTrophyRoom")
        }
    };
    
    this._onButStats = function(){
        _oStatsPanel.show();
        if(parent.cmgGameEvent){
            parent.cmgGameEvent("start","clickStatsScreen")
        }
    };
    
    s_oMenu = this;

    this._init();
}

var s_oMenu = null;