function CSelectTeamMenu(){
    var _aFlagButs;
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    var _oButExit;
    var _oAudioToggle;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oContainerFlag;
    var _oContainer;
    var _oTeamContainer;
    var _oTextWaiting;
    
    var _oThis = this;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);

        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_levelselect'));
        _oContainer.addChild(oBg);

        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("#000").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        oFade.alpha = 0.5;
        _oContainer.addChild(oFade);

        _oTeamContainer = new createjs.Container();
        //_oTeamContainer.scaleX = _oTeamContainer.scaleY = 0.5;
        _oContainer.addChild(_oTeamContainer);

        var oSpriteMsgBox = s_oSpriteLibrary.getSprite('msg_box');
        var oMsgBox = createBitmap(oSpriteMsgBox);
        oMsgBox.x = CANVAS_WIDTH_HALF;
        oMsgBox.y = CANVAS_HEIGHT_HALF+30;
        oMsgBox.regX = oSpriteMsgBox.width * 0.5;
        oMsgBox.regY = oSpriteMsgBox.height * 0.5;
        _oTeamContainer.addChild(oMsgBox);
        
        
        var oTextTitle = new createjs.Text(TEXT_SELECT_TEAM, "50px " + PRIMARY_FONT, TEXT_COLOR);
        oTextTitle.x = CANVAS_WIDTH_HALF;
        oTextTitle.y = 80;
        oTextTitle.textAlign = "center";
        oTextTitle.textBaseline = "alphabetic";
        oTextTitle.shadow = new createjs.Shadow("#000000", 2, 2, 4);
        _oTeamContainer.addChild(oTextTitle);
        
        _oTextWaiting = new createjs.Text(TEXT_WAIT_OPPONENT, "70px " + PRIMARY_FONT, TEXT_COLOR);
        _oTextWaiting.x = CANVAS_WIDTH_HALF;
        _oTextWaiting.y = CANVAS_HEIGHT_HALF;
        _oTextWaiting.textAlign = "center";
        _oTextWaiting.textBaseline = "alphabetic";
        _oTextWaiting.lineWidth = 800;
        _oTextWaiting.shadow = new createjs.Shadow("#000000", 2, 2, 4);
        _oContainer.addChild(_oTextWaiting);
        
        //INIT BUTTON TEAM
        _oContainerFlag = new createjs.Container();
        _oContainerFlag.x = CANVAS_WIDTH_HALF + 44;
        _oContainerFlag.y = CANVAS_HEIGHT_HALF + 23;
        _oTeamContainer.addChild(_oContainerFlag);
        
        _aFlagButs = new Array();
        var iX = 4;
        var iY = 45;
        for(var i=0;i<NUM_TEAMS;i++){
            var oFlag = new CButTeam(iX,iY,i,_oContainerFlag);
            oFlag.addEventListener(ON_MOUSE_UP,this._onSelectFlag,this);
            
            _aFlagButs[i] = oFlag;
            
            if(i>0 && (i+1)%8 === 0){
                iX = 4;
                iY += 120;
            }else{
                iX += 108;
            }
        }
        
        
        _oContainerFlag.regX = _oContainerFlag.getBounds().width/2;
        _oContainerFlag.regY = _oContainerFlag.getBounds().height/2;
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height / 2) - 10, y: (oSprite.height / 2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _pStartPosAudio = {x: _oButExit.getX() - oSprite.width - 10, y: (oSprite.height / 2) + 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, s_oSpriteLibrary.getSprite('audio_icon'), s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:oSprite.width/4 + 10,y:_pStartPosExit.y};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        if(s_bMultiplayer){
            s_oNetworkManager.addEventListener(ON_STATUS_OFFLINE, this._onConnectionCrashed, this);
            
            _oTextWaiting.visible = false;

        }else {
            _oTextWaiting.visible = false;
        }
        
        this.refreshButtonPos();
    };
    
    this.unload = function(){
        for(var i=0;i<_aFlagButs.length;i++){
            _aFlagButs[i].unload();
        }
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        _oButExit.unload();
        _oButExit = null;
        
        s_oStage.removeAllChildren();
        
        s_oSelectMenu = null;
    };
    /*
    this.playerDisconnectedFromGame = function(){
        
        _oTeamContainer.visible = false;
        _oTextWaiting.visible = true;
        
        _oTextWaiting.text = TEXT_OPPONENT_LEFT;
        
    };
    */
    this.opponentLeaveTheGame = function(){        
        _oTeamContainer.visible = false;
        _oTextWaiting.visible = true;
        
        _oTextWaiting.text = TEXT_OPPONENT_LEFT;
    };
    
    this.refreshButtonPos = function () {
        _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX, _pStartPosExit.y + s_iOffsetY);
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX, s_iOffsetY + _pStartPosAudio.y);
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }

    };
    
    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onExit = function () {
        this.unload();
        s_oMain.gotoMenu();
        
        s_oNetworkManager.disconnect();
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
    
    this._onSelectFlag = function(iTeam){
        s_oSocialManager.onCountryPick(iTeam);
        
        if(!s_bMultiplayer){
            _oThis.unload();
            
            s_oLocalStorage.saveTeam(iTeam);
            s_oMain.gotoLevelPanel();
        }else {
            s_iTeamSelected = iTeam;

            _oTeamContainer.visible = false;
            _oTextWaiting.visible = true;

            if(s_bPlayWithBot){
                setTimeout(function(){
                    ////SELECT RANDOM TEAM
                    s_oSelectMenu.onGameStart([iTeam]);

                }, 1000 + Math.random()*1000);
            }else {
                ///SEND MESSAGE
                var oSelection = {iTeamIndex:iTeam, playerID: s_oNetworkManager.getPlayerOrderID()};
                s_oNetworkManager.sendMsg(MSG_TEAM_SELECTED, JSON.stringify(oSelection));
            }
        }
        
    };
    
    this.gotoTeamSelect = function(iTeamAlreadySelected){
        _aFlagButs[iTeamAlreadySelected].block(true);
        _aFlagButs[iTeamAlreadySelected].setAlpha(0.3);
        
        _oTeamContainer.visible = true;
        _oTextWaiting.visible = false;
    };
    
    this.onGameStart = function(aPlayerTeam){
        this.unload();
        s_aMatches = new Array();
        
        if(s_bPlayWithBot){
            var iBotTeamIndex;
            do{
                iBotTeamIndex = Math.floor( Math.random()*NUM_TEAMS );
            }while(iBotTeamIndex === s_iTeamSelected);
            
            var iRandomDifficulty = 5 + Math.floor( Math.random()*4 );
            
            s_aMatches[iRandomDifficulty-1]= iBotTeamIndex;
            
            s_oMain.gotoGameWithBot(iRandomDifficulty);
        }else {
            if(aPlayerTeam[0] === aPlayerTeam[1]){
                var iNewTeamID = this._chooseRandomTeamExcept(aPlayerTeam[0]);
                aPlayerTeam[0] = iNewTeamID;
                aPlayerTeam[1] = iNewTeamID;
            }
            
            if(s_oNetworkManager.isUserA()){
                s_aMatches.push(aPlayerTeam[1]);
            }else {
                s_aMatches.push(aPlayerTeam[0]);
            }
            s_oMain.gotoGameMulti();
        }
    };
    
    this._chooseRandomTeamExcept = function(iExceptionTeamID){
        var aTeamID = new Array();
        for(var i=0; i<NUM_TEAMS-1; i++){
            if(i===iExceptionTeamID){
                continue;
            }
            aTeamID.push(i);
        }
        
        var iRandomTeamID = aTeamID[Math.floor( Math.random()*aTeamID.length )];
        
        return iRandomTeamID;
    };
    
    this._onConnectionCrashed = function(){
        s_oNetworkManager.disconnect();

        this.unload();

        s_oMain.gotoOfflineMenu();
    };
    
    s_oSelectMenu = this;
    this._init();
}

var s_oSelectMenu = null;