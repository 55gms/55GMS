function CPreloader() {
    var _iMaskWidth;
    var _iMaskHeight;
    var _oLoadingText;
    var _oProgressBar;
    var _oMaskPreloader;
    var _oFade;
    var _oIcon;
    var _oIconMask;
    var _oButStart;
    var _oContainer;

    this._init = function () {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
        s_oSpriteLibrary.addSprite("progress_bar", "./sprites/progress_bar.png");
        s_oSpriteLibrary.addSprite("200x200", "./sprites/200x200.jpg");
        s_oSpriteLibrary.addSprite("but_start", "./sprites/but_start.png");
        s_oSpriteLibrary.loadSprites();

        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
    };

    this.unload = function () {
        _oContainer.removeAllChildren();
        _oButStart.unload();
    };

    this._onImagesLoaded = function () {

    };

    this._onAllImagesLoaded = function () {
        this.attachSprites();

        s_oMain.preloaderReady();
    };

    this.attachSprites = function () {
        var oBg = new createjs.Shape();
        oBg.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oContainer.addChild(oBg);

        var oSprite = s_oSpriteLibrary.getSprite('200x200');
        _oIcon = createBitmap(oSprite);
        _oIcon.regX = oSprite.width * 0.5;
        _oIcon.regY = oSprite.height * 0.5;
        _oIcon.x = CANVAS_WIDTH/2;
        _oIcon.y = CANVAS_HEIGHT/2 - 130;
        _oContainer.addChild(_oIcon);

        _oIconMask = new createjs.Shape();
        _oIconMask.graphics.beginFill("rgba(0,0,0,0.01)").drawRoundRect(_oIcon.x - 100, _oIcon.y - 100, 200, 200, 10);
        _oContainer.addChild(_oIconMask);
        
        _oIcon.mask = _oIconMask;

        var oSprite = s_oSpriteLibrary.getSprite('progress_bar');
        _oProgressBar = createBitmap(oSprite);
        _oProgressBar.x = CANVAS_WIDTH/2 - (oSprite.width / 2);
        _oProgressBar.y = CANVAS_HEIGHT/2 + 50;
        _oContainer.addChild(_oProgressBar);

        _iMaskWidth = oSprite.width;
        _iMaskHeight = oSprite.height;
        _oMaskPreloader = new createjs.Shape();
        _oMaskPreloader.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(_oProgressBar.x, _oProgressBar.y, 1, _iMaskHeight);

        _oContainer.addChild(_oMaskPreloader);

        _oProgressBar.mask = _oMaskPreloader;

        _oLoadingText = new createjs.Text("", "30px " + PRIMARY_FONT, "#fff");
        _oLoadingText.x = CANVAS_WIDTH/2;
        _oLoadingText.y = CANVAS_HEIGHT/2 + 100;
        _oLoadingText.textBaseline = "alphabetic";
        _oLoadingText.textAlign = "center";
        _oContainer.addChild(_oLoadingText);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_start');
        _oButStart = new CTextButton(CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 50, oSprite, TEXT_PRELOADER_CONTINUE, "Arial", "#000", 50, _oContainer);        
        _oButStart.addEventListener(ON_MOUSE_UP, this._onButStartRelease, this);
        _oButStart.setVisible(false);
        //_oButStart.removeShadow();
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oContainer.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha: 0}, 500).call(function () {            
            createjs.Tween.removeTweens(_oFade);
            _oContainer.removeChild(_oFade);
        });        
    };

    this._onButStartRelease = function(){
        $(s_oMain).trigger("show_preroll_ad");
        s_oMain._onRemovePreloader();
    };

    this.refreshLoader = function (iPerc) {
        _oLoadingText.text = iPerc + "%";
        
        if (iPerc === 100) {
            $(s_oMain).trigger("show_preroll_ad");
            s_oMain._onRemovePreloader();
                
            _oLoadingText.visible = false;
            _oProgressBar.visible = false;
        };     

        _oMaskPreloader.graphics.clear();
        var iNewMaskWidth = Math.floor((iPerc * _iMaskWidth) / 100);
        _oMaskPreloader.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(_oProgressBar.x, _oProgressBar.y, iNewMaskWidth, _iMaskHeight);
    };

    this._init();
}