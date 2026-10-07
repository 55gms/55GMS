function CInterface(oForegroundContainer){

    var _oButExit;
    var _oAudioToggle;
    var _oHelpPanel=null;
    var _oWhitePanel;    
    var _oBlackPanel;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    var _pStartPosFullscreen;
    var _pStartPosExit;
    var _pStartPosAudio;
    
    
    this._init = function(oForegroundContainer){                
        var oExitX;        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 25};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        oExitX = CANVAS_WIDTH - (oSprite.width/2) - 125;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
           
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: oExitX, y: 25+ (oSprite.height/2)}; 
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, s_oStage);
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
            _pStartPosFullscreen = {x:oSprite.width/4 + 10,y:(oSprite.height/2) +25};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _oWhitePanel = new CInfoTurn(1250,1570,WHITE, oForegroundContainer);
        _oBlackPanel = new CInfoTurn(630,350,BLACK, oForegroundContainer);

       
        this.refreshButtonPos();
    };
    
    this.unload = function(){
        _oButExit.unload();
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
        }
        if(_oHelpPanel!==null){
            _oHelpPanel.unload();
        }
        
        _oBlackPanel.unload();
        _oWhitePanel.unload();
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        s_oInterface = null;        
    };
    
    this.refreshButtonPos = function(iBoardScale){
        _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX,s_iOffsetY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,s_iOffsetY + _pStartPosFullscreen.y);
        }
        
        if(s_bLandscape){
            _oWhitePanel.setPos(CANVAS_WIDTH, CANVAS_HEIGHT/2 + 450*iBoardScale);
            _oBlackPanel.setPos(0, CANVAS_HEIGHT/2 - 450*iBoardScale);
            _oWhitePanel.setScale( (1/iBoardScale)+0.16 );
            _oBlackPanel.setScale( (1/iBoardScale)+0.16 );
        }else {
            _oWhitePanel.setPos(CANVAS_WIDTH/2 +446*iBoardScale, CANVAS_HEIGHT/2 + 450*iBoardScale);
            _oBlackPanel.setPos(CANVAS_WIDTH/2 -446*iBoardScale, CANVAS_HEIGHT/2 - 450*iBoardScale);
            _oWhitePanel.setScale(1);
            _oBlackPanel.setScale(1);
        }
    };

    
    this.refreshWhiteTime = function(iTime){
        if(iTime > 50){
            _oWhitePanel.refreshTime(formatTime(iTime));
        }
        
    };
    
    this.refreshBlackTime = function(iTime){
        if(iTime > 50){
            _oBlackPanel.refreshTime(formatTime(iTime));
        }
        
    };
    
    this.refreshWhiteScore = function(iScore){
        _oWhitePanel.refreshScore(iScore);
    };
    
    this.refreshBlackScore = function(iScore){
        _oBlackPanel.refreshScore(iScore);
    };
    
    this.activePlayer = function(iCurPlayer){
        if(iCurPlayer === WHITE){
            _oBlackPanel.active(false);
            _oWhitePanel.active(true);
        } else {
            _oWhitePanel.active(false);
            _oBlackPanel.active(true);
        }
    };

    this.setInfoVisible = function(bVal){
        _oWhitePanel.setPanelVisible(bVal);
        _oBlackPanel.setPanelVisible(bVal);
    };

    this._onButConfigRelease = function(){
        new CConfigPanel();
    };
    
    this._onButRestartRelease = function(){
        s_oGame.restartGame();
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
    };
    
    this._onExit = function(){
        if(!s_oGame.isGameEnd()){
            PokiSDK.gameplayStop();
        }
        
        new CAreYouSurePanel(s_oGame.onExit);
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
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
    
    s_oInterface = this;
    
    this._init(oForegroundContainer);
    
    return this;
}

var s_oInterface = null;