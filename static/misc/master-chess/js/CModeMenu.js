function CModeMenu(){
    
    var _iModeSelected;
    
    var _oTextHead;
    
    var _oButHuman;
    var _oButComputer;
    var _oButExit;
    var _oAudioToggle = null;
    var _oToggleEasy;
    var _oToggleMedium;
    var _oToggleHard;
    var _oButFullscreen;
    var _oHumanContainer;
    var _oComputerContainer;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosFullscreen;
    
    this._init = function(){

        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_mod_menu'));
        s_oStage.addChild(oBg);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 25};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        var oExitX = CANVAS_WIDTH - (oSprite.width/2) - 125;
        _pStartPosAudio = {x: oExitX, y: (oSprite.height/2) + 25};
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){            
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
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
            _pStartPosFullscreen = {x:oSprite.width/4 + 10,y:_pStartPosExit.y};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _oTextHead = new createjs.Text(TEXT_MODE,"bold 80px "+PRIMARY_FONT, "#ffffff");
        _oTextHead.x = CANVAS_WIDTH/2;
        _oTextHead.y = 400;
        _oTextHead.textAlign = "center";
        _oTextHead.textBaseline = "middle";
        _oTextHead.lineWidth = 600;            
        s_oStage.addChild(_oTextHead);
        
        _oHumanContainer = new createjs.Container();
        _oHumanContainer.x = CANVAS_WIDTH/2;
        _oHumanContainer.y = 800;
        s_oStage.addChild(_oHumanContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_vs_man');
        _oButHuman = new CGfxButton(0,0,oSprite,_oHumanContainer);
        _oButHuman.addEventListener(ON_MOUSE_UP, this._onButHumanRelease, this);

        _oComputerContainer = new createjs.Container();
        _oComputerContainer.x = CANVAS_WIDTH/2;
        _oComputerContainer.y = 1300;
        s_oStage.addChild(_oComputerContainer);

        var oSprite = s_oSpriteLibrary.getSprite('message');
        var oDiffPanel = createBitmap(oSprite);
        oDiffPanel.regX = oSprite.width/2;
        oDiffPanel.regY = oSprite.height/2;
        oDiffPanel.y = 232;
        _oComputerContainer.addChild(oDiffPanel);
        
        var iYOffset = 250;
        var oSprite = s_oSpriteLibrary.getSprite('toggle_easy');
        _oToggleEasy = new CToggle(-130 +2,iYOffset,oSprite,false,_oComputerContainer);
        _oToggleEasy.addEventListenerWithParams(ON_MOUSE_UP, this._onDifficultyToggle, this, EASY_MODE); 
      
        var oSprite = s_oSpriteLibrary.getSprite('toggle_medium');
        _oToggleMedium = new CToggle(2,iYOffset,oSprite,true,_oComputerContainer);
        _oToggleMedium.addEventListenerWithParams(ON_MOUSE_UP, this._onDifficultyToggle, this, MEDIUM_MODE); 
        
        var oSprite = s_oSpriteLibrary.getSprite('toggle_hard');
        _oToggleHard = new CToggle(130 +2,iYOffset,oSprite,false,_oComputerContainer);
        _oToggleHard.addEventListenerWithParams(ON_MOUSE_UP, this._onDifficultyToggle, this, HARD_MODE);
      
        var oSprite = s_oSpriteLibrary.getSprite('but_vs_pc');
        _oButComputer = new CGfxButton(0,0,oSprite,_oComputerContainer);
        _oButComputer.addEventListener(ON_MOUSE_UP, this._onButComputerRelease, this);
        
        this._onDifficultyToggle(MEDIUM_MODE);
      
        this.refreshButtonPos();
        
    };
    
    this.unload = function(){
        
        _oButHuman.unload();
        _oButComputer.unload();
        _oButExit.unload();

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        s_oModeMenu = null;
        s_oStage.removeAllChildren();
    };
    
    this._onDifficultyToggle = function(iMode){

        switch(iMode){
            case EASY_MODE: {
                    _oToggleEasy.setActive(true);
                    _oToggleMedium.setActive(false);
                    _oToggleHard.setActive(false);
                    _iModeSelected = EASY_MODE;
                    SEARCH_DEPTH = 1;
                    break;
            }
            case MEDIUM_MODE: {
                    _oToggleEasy.setActive(false);
                    _oToggleMedium.setActive(true);
                    _oToggleHard.setActive(false);
                    _iModeSelected = MEDIUM_MODE;
                    SEARCH_DEPTH = 2;
                    break;                    
            }
            case HARD_MODE: {
                    _oToggleEasy.setActive(false);
                    _oToggleMedium.setActive(false);
                    _oToggleHard.setActive(true);
                    _iModeSelected = HARD_MODE;
                    SEARCH_DEPTH = 3;
                    break;
            }            
        }
    };
    
    this.refreshButtonPos = function(){
        _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX,s_iOffsetY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,s_iOffsetY + _pStartPosFullscreen.y);
        }
        
        if(s_bLandscape){
            _oTextHead.y = 640;
            
            _oHumanContainer.x = CANVAS_WIDTH/2 - 400;
            _oHumanContainer.y = CANVAS_HEIGHT/2 + 100;
            
            _oComputerContainer.x = CANVAS_WIDTH/2 + 400;
            _oComputerContainer.y = CANVAS_HEIGHT/2 + 100;
        }else {
            _oTextHead.y = 400;
            
            _oHumanContainer.x = CANVAS_WIDTH/2;
            _oHumanContainer.y = 800;
            
            _oComputerContainer.x = CANVAS_WIDTH/2;
            _oComputerContainer.y = 1300;
        }
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
    
    this._onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
    };
    
    this._onButHumanRelease = function(){
        this.unload();
        s_oMain.gotoGame(MODE_HUMAN);
    };
    
    this._onButComputerRelease = function(){
        this.unload();
        s_oMain.gotoGame(MODE_COMPUTER, _iModeSelected);
    };
    
    s_oModeMenu = this;
    this._init();
};

var s_oModeMenu = null;