function CAchievementsPanel(oParentContainer){
    var _aAchievements;
    
    var _oContainer;
    var _oFade;
    var _oButExit;
    var _oContentContainer;
    
    var _pStartPosExit;
    
    var _aListPages;
    var _oButRight;
    var _oButLeft;
    var _iCurPageShown;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('bg_levelselect');
        var oBg = createBitmap(oSprite);
        _oContainer.addChild(oBg);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.7;
        _oFade.on("mousedown", function(){}, this);
        _oContainer.addChild(_oFade);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height / 2) - 10, y: (oSprite.height / 2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.hide, this);

        var oTextTitle = new createjs.Text(TEXT_ACHIEVEMENTS, "50px " + PRIMARY_FONT, TEXT_COLOR);
        oTextTitle.x = CANVAS_WIDTH_HALF;
        oTextTitle.y = 80;
        oTextTitle.textAlign = "center";
        oTextTitle.textBaseline = "alphabetic";
        oTextTitle.shadow = new createjs.Shadow("#000000", 2, 2, 4);
        _oContainer.addChild(oTextTitle);
        
        _oContentContainer = new createjs.Container();
        _oContentContainer.x = CANVAS_WIDTH/2;
        _oContentContainer.y = CANVAS_HEIGHT/2+30;
        _oContainer.addChild(_oContentContainer);
        
        var oSpriteMsgBox = s_oSpriteLibrary.getSprite('msg_box');
        var oMsgBox = createBitmap(oSpriteMsgBox);
        oMsgBox.regX = oSpriteMsgBox.width * 0.5;
        oMsgBox.regY = oSpriteMsgBox.height * 0.5;
        _oContentContainer.addChild(oMsgBox);
        
        

        /*
        var iNumCol = 4;
        var iStartY = -186;
        var iYOffset = 104;
        var iWidth = 640;
        var iCurCol = 0;
        */
       
        var iNumCol = 3;
        var iStartY = -130;
        var iYOffset = 90;
        var iWidth = 400;
        var iCurCol = 0;
        var iNumPerPage = 12;
        var iNumPage =  Math.ceil( TEXT_LIST_ACHIEVEMENTS.length/iNumPerPage );

        _aListPages = new Array();
        for(var i=0; i<iNumPage; i++){
            var oPageContainer = new createjs.Container();
            oPageContainer.scale = 1.4;
            _oContentContainer.addChild(oPageContainer);
            
            _aListPages.push(oPageContainer);
        }
        
        var iCurPage = 0;
        var iCurY = iStartY;
        _aAchievements = new Array();
        for(var i=0; i<TEXT_LIST_ACHIEVEMENTS.length; i++){
            if(i!==0 && i%iNumPerPage === 0){
                iCurPage++;
                iCurCol = 0;
                iCurY = iStartY;
            }
            
            var iX = -iWidth/2 + iCurCol*(iWidth/(iNumCol-1));
            var szTitle = TEXT_LIST_ACHIEVEMENTS[i][0];
            var szDesc = TEXT_LIST_ACHIEVEMENTS[i][1];
            _aAchievements[i] = new CAchievementWidget(iX,iCurY,_aListPages[iCurPage], szTitle, szDesc);
            _aAchievements[i].setProgress(s_aCurAchiProgress[i], ACHIEVEMENTS_TARGET[i]);
            
            iCurCol++;
            if(iCurCol === iNumCol){  
                iCurCol = 0;
                iCurY+= iYOffset;
            }  
        }
        
        _iCurPageShown = 0;
        
        var oSprite = s_oSpriteLibrary.getSprite('but_right');
        _oButRight = new CGfxButton(480, 0, oSprite, _oContentContainer);
        _oButRight.addEventListener(ON_MOUSE_UP, this._onButRight, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_left');
        _oButLeft = new CGfxButton(-480, 0, oSprite, _oContentContainer);
        _oButLeft.addEventListener(ON_MOUSE_UP, this._onButLeft, this);
        
        this._showCurPage();
        
        //_aAchievements[3].setActive();
    };
    
    this.unload = function(){
        _oFade.removeAllEventListeners();
        _oButExit.unload();
        oParentContainer.removeChild(_oContainer);
    };
    
    this.refreshButtonPos = function(){
        _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX, _pStartPosExit.y + s_iOffsetY);
    };
    
    this.show = function(){
        _oContainer.visible = true;
    };
    
    this.hide = function(){
        _oContainer.visible = false;
    };
    
    this._onButRight = function(){
        _iCurPageShown++;
        if(_iCurPageShown === _aListPages.length){
            _iCurPageShown = 0;
        }
        this._showCurPage();
    };
    
    this._onButLeft = function(){
        _iCurPageShown--;
        if(_iCurPageShown < 0){
            _iCurPageShown = _aListPages.length-1;
        }
        this._showCurPage();
    };
    
    this._showCurPage = function(){
        for(var i=0; i<_aListPages.length; i++){
            _aListPages[i].visible = false;
        }
        
        _aListPages[_iCurPageShown].visible = true;
        
        _oButRight.setVisible(true);
        _oButLeft.setVisible(true);
        
        if(_iCurPageShown === 0){
            _oButLeft.setVisible(false);
        }else if(_iCurPageShown === _aListPages.length-1){
            _oButRight.setVisible(false);
        }
    };
    
    this.refreshAllProgress = function(){
        for(var i=0; i<_aAchievements.length; i++){
            _aAchievements[i].setProgress(s_aCurAchiProgress[i], ACHIEVEMENTS_TARGET[i]);
            _aAchievements[i].setToComplete();
        }
    };
    
    this._init();
}

