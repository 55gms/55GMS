function CUnderlinedTextBut(iXPos, iYPos, szText, szFont, szColor, iFontSize,oParentContainer){
    var _aCbCompleted;
    var _aCbOwner;
    var _oContainer;
    var _oText;
    var _oTextBack;
    var _oParentContainer = oParentContainer;
    var _oListenerMouseDown;
    var _oListenerMouseUp;

    this._init = function (iXPos, iYPos, szText, szFont, szColor, iFontSize) {

        _aCbCompleted = new Array();
        _aCbOwner = new Array();

        _oContainer = new createjs.Container();
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
        _oParentContainer.addChild( _oContainer);
        
        var oFade = new createjs.Shape();
        _oContainer.addChild(oFade);
        
        _oText = new createjs.Text(szText, iFontSize+"px " + szFont, szColor);
        _oText.textAlign = "left";
        _oText.textBaseline = "alphabetic";
        _oContainer.addChild(_oText);
        
        var iTextWidth = _oText.getBounds().width;
        var oUnderline = new createjs.Shape();
        oUnderline.graphics.s("black").mt(_oText.x, _oText.y+4).lt(_oText.x+iTextWidth, _oText.y+4);
        _oContainer.addChild(oUnderline);
        
        _oContainer.cursor = "pointer";
        _oContainer.regX = iTextWidth / 2;
        _oContainer.regY = _oText.getMeasuredHeight() / 2;
        oFade.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0,-_oText.getMeasuredHeight(),iTextWidth,_oText.getMeasuredHeight()+10);
        
        this._initListener();
    };

    this.unload = function () {
        _oContainer.off("mousedown", _oListenerMouseDown);
        _oContainer.off("pressup", _oListenerMouseUp);

        _oParentContainer.removeChild(_oContainer);
    };

    this.setVisible = function (bVisible) {
        _oContainer.visible = bVisible;
    };

    this._initListener = function () {
       
        _oListenerMouseDown = _oContainer.on("mousedown", this.buttonDown);
        _oListenerMouseUp = _oContainer.on("pressup", this.buttonRelease);
    };

    this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this.buttonRelease = function () {
        _oContainer.scaleX = 1;
        _oContainer.scaleY = 1;
        
        playSound("click", 1, 0);
        
        if (_aCbCompleted[ON_MOUSE_UP]) {
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP]);
        }
    };

    this.buttonDown = function () {
        _oContainer.scaleX = 0.9;
        _oContainer.scaleY = 0.9;

        if (_aCbCompleted[ON_MOUSE_DOWN]) {
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
        }
    };


    this.setTextPosition = function (iY) {
        _oText.y = iY;
        _oTextBack.y = iY + 2;
    };

    this.setPosition = function (iXPos, iYPos) {
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
    };

    this.setX = function (iXPos) {
        _oContainer.x = iXPos;
    };

    this.setY = function (iYPos) {
        _oContainer.y = iYPos;
    };

    this.getX = function () {
        return _oContainer.x;
    };

    this.getY = function () {
        return _oContainer.y;
    };

    this._init(iXPos, iYPos, szText, szFont, szColor, iFontSize);
}