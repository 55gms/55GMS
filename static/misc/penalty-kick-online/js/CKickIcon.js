function CKickIcon(iX,iY,oSpriteSheet,oParentContainer){
    
    var _oSprite;
    var _oParentContainer = oParentContainer;
    
    this._init = function(iX,iY,oSpriteSheet){
        var iWidth = oSpriteSheet.getFrameBounds(0).width/3; 
        var iHeight = oSpriteSheet.getFrameBounds(0).height;
        _oSprite = createSprite(oSpriteSheet,"empty",iWidth/2,iHeight/2,iWidth,iHeight);
        _oSprite.x = iX;
        _oSprite.y = iY;
        _oParentContainer.addChild(_oSprite);
    };
    
    this.changeState = function(szState){
        _oSprite.gotoAndStop(szState);
    };
    
    this.setVisible = function(bVal){
        _oSprite.visible = bVal;
    };
    
    this._init(iX,iY,oSpriteSheet);
}