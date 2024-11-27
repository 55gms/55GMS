function CHelpText(oParentContainer) {

    var _oParentContainer = oParentContainer;
    var _oHelpText;
    var _oHelpTextStroke;
    var _oContainer;

    this._init = function () {
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);

        _oHelpText = new createjs.Text(TEXT_HELP, "42px " + PRIMARY_FONT, TEXT_COLOR);
        _oHelpText.x = CANVAS_WIDTH / 2;
        _oHelpText.y = CANVAS_HEIGHT_HALF + 100;
        _oHelpText.textAlign = "center";
        _oHelpText.lineWidth = 800;
        _oContainer.addChild(_oHelpText);

        _oHelpTextStroke = new createjs.Text(TEXT_HELP, "42px " + PRIMARY_FONT, "#003470");
        _oHelpTextStroke.x = CANVAS_WIDTH / 2;
        _oHelpTextStroke.y = _oHelpText.y;
        _oHelpTextStroke.textAlign = "center";
        _oHelpTextStroke.outline = OUTLINE_WIDTH;
        _oHelpTextStroke.lineWidth = 800;
        _oContainer.addChild(_oHelpTextStroke);
        _oContainer.alpha = 0;
    };

    this.show = function (szText) {
        _oHelpText.text = _oHelpTextStroke.text = szText;
        
        _oContainer.alpha = 0;
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer).to({alpha: 1}, MS_TIME_FADE_HELP_TEXT);
    };
    
    this.setColor = function(szStrokeColor, szColor){
        _oHelpText.color = szColor;
        _oHelpTextStroke.color = szStrokeColor;
    };
    
    this.setPos = function(iX, iY){
        _oHelpText.x = iX;
        _oHelpTextStroke.x = _oHelpText.x;
        
        _oHelpText.y = iY;
        _oHelpTextStroke.y = _oHelpText.y;
    };
    
    this.setSize = function(iSize){
        _oHelpText.font = iSize+ "px " + PRIMARY_FONT;
        _oHelpTextStroke.font = _oHelpText.font;
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({alpha: 0}, MS_TIME_FADE_HELP_TEXT).call(function () {
                _oContainer.visible = false;
        });
    };

    this.unload = function () {
        createjs.Tween.removeTweens(_oContainer);
        _oParentContainer.removeChild(_oContainer);
    };

    this._init();

    return this;
}