function CStatsPanel(oParentContainer){
    var _oContainer;
    var _oFade;
    var _oButExit;
    var _oContentContainer;
    var _oSchedule;
    
    var _oPage0;
    var _oPage1;
    var _oPage2;
    var _oPage3;
    
    var _pStartPosExit;
    
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
    
        var oTextTitle = new createjs.Text(TEXT_STATS, "50px " + PRIMARY_FONT, TEXT_COLOR);
        oTextTitle.x = CANVAS_WIDTH_HALF+20;
        oTextTitle.y = 80;
        oTextTitle.textAlign = "center";
        oTextTitle.textBaseline = "alphabetic";
        oTextTitle.shadow = new createjs.Shadow("#000000", 2, 2, 4);
        _oContainer.addChild(oTextTitle);
        
        _oContentContainer = new createjs.Container();
        _oContentContainer.x = CANVAS_WIDTH/2;
        _oContentContainer.y = CANVAS_HEIGHT/2+30;
        _oContainer.addChild(_oContentContainer);
        
        var aSpriteBg = [   s_oSpriteLibrary.getSprite('panel_stat_0'),  
                            s_oSpriteLibrary.getSprite('panel_stat_1'),
                            s_oSpriteLibrary.getSprite('panel_stat_2'),  
                            s_oSpriteLibrary.getSprite('panel_stat_3')
                        ];
        var aTitles = [ TEXT_STATS_LABEL_0, TEXT_STATS_LABEL_1,TEXT_STATS_LABEL_2,TEXT_STATS_LABEL_3];
        _oSchedule = new CSchedulePanel(0, 0, _oContentContainer, aSpriteBg, aTitles, 26);
        
        
        _oPage0 = new CStatsPage0();
        _oSchedule.addContentToPage(0,_oPage0.getContent());
        
        _oPage1 = new CStatsPage1();
        _oSchedule.addContentToPage(1,_oPage1.getContent());
        
        _oPage2 = new CStatsPage2();
        _oSchedule.addContentToPage(2,_oPage2.getContent());
        
        _oPage3 = new CStatsPage3();
        _oSchedule.addContentToPage(3,_oPage3.getContent());
        
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
    
    this._init();
}

