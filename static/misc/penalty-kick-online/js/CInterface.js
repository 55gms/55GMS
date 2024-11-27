function CInterface(iLevel,_iTotScore,oParentContainer,oFGContainer) {
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _pStartPosExit;

    var _oButExit;
    var _oButFullscreen;
    var _oAudioToggle;
    var _oScoreBoard;
    //var _oResultPanel;
    var _oHelpText;
    var _oMatchPointText;
    var _oFinalPanel;
    var _oVsPanel;
    var _oAreYouSurePanel;
    var _oParentContainer = oParentContainer;
    var _oWaitingPanel;

    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    this._init = function (iLevel) {
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height / 2) - 10, y: (oSprite.height / 2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, _oParentContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _pStartPosExit.x - oSprite.width/2 - 10, y:_pStartPosExit.y};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive,_oParentContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
            _pStartPosFullscreen = {x:  _pStartPosAudio.x - oSprite.width / 2 - 10, y: _pStartPosAudio.y};
        }else{
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
            _pStartPosFullscreen = {x: _pStartPosExit.x - oSprite.width/2 - 10, y:_pStartPosExit.y};
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (ENABLE_FULLSCREEN === false) {
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.enabled) {
           
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, false, _oParentContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _oScoreBoard = new CScoreBoard(iLevel,{x: 140, y: 4},_oParentContainer);

        _oHelpText = new CHelpText(_oParentContainer);
        
        _oMatchPointText = new CHelpText(s_oStage);
        _oMatchPointText.setColor("#1c39ab","#fed718");
        _oMatchPointText.setPos(CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 30);
        _oMatchPointText.setSize(52);
        
        _oWaitingPanel = new CWaitingPanel(_oParentContainer);
        
        _oVsPanel = new CVersusPanel(_oParentContainer);
        
        _oFinalPanel = new CFinalPanel(iLevel,oFGContainer);
        
        _oAreYouSurePanel = new CAreYouSurePanel(s_oStage);
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN,this._onConfirmExit,this);
      
        this.refreshButtonPos();
    };

    this.refreshButtonPos = function () {
         _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX, _pStartPosExit.y + s_iOffsetY);
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX, s_iOffsetY + _pStartPosAudio.y);
        }

        if (_fRequestFullScreen && screenfull.enabled) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - s_iOffsetX, _pStartPosFullscreen.y + s_iOffsetY);
        }
        
        _oScoreBoard.refreshButtonPos();

        if(s_bMultiplayer && s_oGame){
            s_oGame.refreshPos();
        }
    };

    this.unload = function () {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }

        if (_fRequestFullScreen && screenfull.enabled) {
            _oButFullscreen.unload();
            _oButFullscreen = null;
        }
        
        _oButExit.unload();
        _oButExit = null;
        
        _oFinalPanel.unload();
        _oAreYouSurePanel.unload();
        
        _oScoreBoard.unload();
        
        s_oInterface = null;
    };
    
    this.reset = function(iOpponent,iLevel){
        //_oResultPanel.reset(iOpponent);
        _oScoreBoard.reset(iOpponent);
        _oWaitingPanel.hide();
    };

    this.setFinalPanel = function(){
        _oFinalPanel.addEventListener(ON_BACK_MENU, s_oGame.onExit, s_oGame);
        _oFinalPanel.addEventListener(ON_NEXT, s_oGame.nextRound, s_oGame);
        _oFinalPanel.addEventListener(ON_RESTART, s_oGame.retryLevel, s_oGame);
    };
    
    this.setFinalPanelMultiplayer = function(){
        _oFinalPanel.addEventListener(ON_BACK_MENU, s_oGame.onExit, s_oGame);
        _oFinalPanel.addEventListener(ON_RESTART, s_oGame.onConfirmRematch, s_oGame);
    };
    
    this.hideFinalPanelScore = function(){
        _oFinalPanel.hideLevelScore();
    };
    
    this.changeFinalMessage = function(szMsg){
        _oFinalPanel.changeMessage(szMsg);
    };
    
    this.hideFinalButtons = function(){
        _oFinalPanel.hideButtons();
    };
    
    this.showFinalButtons = function(){
        _oFinalPanel.showButtons();
    };

    this.hideFinalPanel = function(){
        _oFinalPanel.hide();
    };
    
    this.centerFinalHomeButton = function(){
        _oFinalPanel.centerHomeButton();
    };

    this.showVsPanel = function(iOpponent,iLevel){
        _oVsPanel.show(iOpponent,iLevel);
    };
    
    this.onExitVersusPanel = function(){
        if(s_bMultiplayer){
            s_oGame.onBeginShot();
        }
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
    
    this.refreshScoreBoard = function(szResult,iPlayerGoals,iCpuGoals){
        _oScoreBoard.setScore(iPlayerGoals,iCpuGoals);
        //_oResultPanel.show(szResult,iPlayerGoals,iCpuGoals);
    };
    
    this.setPlayersInfo = function(szPlayer, szOpponent){
        _oScoreBoard.setPlayersName(szPlayer, szOpponent);
    };
    
    this.setPlayersLevels = function(iPlayerLevel, iOpponentLevel){
        _oScoreBoard.setLevels(iPlayerLevel, iOpponentLevel);
    };
    
    this.setExtraScore = function(){
        _oScoreBoard.setExtraScore();
    };
    
    this.refreshKicks = function(iPlayerType, aListKicks){
        var szResult = aListKicks[aListKicks.length-1];
        if(iPlayerType === PLAYER){
            _oScoreBoard.refreshPlayerKicks(szResult);
        } else {
            _oScoreBoard.refreshOpponentKicks(szResult);
        }
    };

    this.setBonusGoal = function(iPlayerType){
        _oScoreBoard.setBonusGoal(iPlayerType);
    };

    this.showHelpText = function(szText){
        _oHelpText.show(szText);
    };
    
    this.showMatchPointText = function(szText){
        _oMatchPointText.show(szText);
    };
    
    this.showGoalkeeperWaiting = function(){
        _oWaitingPanel.showGoalkeeperWaiting();
    };
    
    this.hideGoalkeeperWaiting = function(){
        _oWaitingPanel.hideGoalkeeperWaiting();
    };
    
    this.showStrikerWaiting = function(){
        _oWaitingPanel.showStrikerWaiting();
    };
    
    this.hideStrikerWaiting = function(){
        _oWaitingPanel.hideStrikerWaiting();
    };
    
    this.hideHelpText = function () {
        _oHelpText.hide();
    };
    
    this.hideMatchPointText = function(){
        _oMatchPointText.hide();
    };
    
    this.showFinalPanel = function(iPlayerGoals,iOpponentGoals,iTotScore,iLevelScore,bGameOver,bLastLevel){
        _oFinalPanel.show(iPlayerGoals,iOpponentGoals,iTotScore,iLevelScore,bGameOver,bLastLevel);
    };

    this.showLeaveMsg = function(bVal){
        _oFinalPanel.showLeaveMsg(bVal);
    };

    this.showAgainMsg = function(bVal){
        _oFinalPanel.showAgainMsg(bVal);
    };

    this.showFinalRestartBut = function(bVal){
        _oFinalPanel.showRestart(bVal);
    };
    
    this.isHelpTextVisible = function(){
        return _oHelpText.visible;
    };

    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function () {
        _oAreYouSurePanel.show(TEXT_ARE_SURE);        
    };
    
    this._onConfirmExit = function(){
        s_oGame.onExit();
    };
    
    s_oInterface = this;

    this._init(iLevel);
}

var s_oInterface = null;