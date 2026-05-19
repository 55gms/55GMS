function CTextButton(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize,oAttach){
    var _bDisable;
    var _iWidth;
    var _iHeight;
    var _aCbCompleted;
    var _aCbOwner;
    var _oParams;
    var _oButton;
    var _oTextBack;
    var _oText;
    var _oButtonBg;
    
    this._init =function(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize,oAttach){
        _bDisable = false;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();

        _oButtonBg = createBitmap( oSprite);
	_iWidth = oSprite.width;
        _iHeight = oSprite.height;
		
        var iStepShadow = Math.ceil(iFontSize/20);

        _oTextBack = new createjs.Text(szText,iFontSize+"px "+szFont, "#000000");
        var oBounds = _oTextBack.getBounds();
        _oTextBack.textAlign = "center";
        _oTextBack.lineWidth = _iWidth *0.9;
        _oTextBack.textBaseline = "alphabetic";
        _oTextBack.x = oSprite.width/2 + iStepShadow;
        _oTextBack.y = Math.floor((oSprite.height)/2) +(oBounds.height/3) + iStepShadow;

        _oText = new createjs.Text(szText,iFontSize+"px "+szFont, szColor);
        _oText.textAlign = "center";
        _oText.textBaseline = "alphabetic";  
        _oText.lineWidth = _iWidth *0.9;
        _oText.x = oSprite.width/2;
        _oText.y = Math.floor((oSprite.height)/2) +(oBounds.height/3);

        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;
	if (!s_bMobile){
            _oButton.cursor = "pointer";
	}
        _oButton.addChild(_oButtonBg,_oTextBack,_oText);
        
        if(oAttach){
            oAttach.addChild(_oButton);
        }
        
        this._initListener();
    };
    
    this.unload = function(){
       _oButton.removeAllEventListeners();
       
       oAttach.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this.setAlign = function(szAlign){
        _oText.textAlign = szAlign;
        _oTextBack.textAlign = szAlign;
    };
    
    this.enable = function(){
        _bDisable = false;
        _oButton.cursor = "pointer";
		/*
	_oButtonBg.filters = [];

        _oButtonBg.cache(0,0,_iWidth,_iHeight);
        */
    };
    
    this.disable = function(){
        _bDisable = true;
        _oButton.cursor = "cursor";
		
                /*
	var matrix = new createjs.ColorMatrix().adjustSaturation(-100).adjustBrightness(40);
        _oButtonBg.filters = [
                                new createjs.ColorMatrixFilter(matrix)
                             ];
        _oButtonBg.cache(0,0,_iWidth,_iHeight);
        */
    };
    
    this._initListener = function(){
       _oButton.on("mousedown", this.buttonDown);
       _oButton.on("pressup" , this.buttonRelease);      
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,oParams){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        
        _oParams = oParams;
    };
    
    this.buttonRelease = function(){
        if(_bDisable){
            return;
        }
        
        playSound("click",1,false);
        
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_oParams);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisable){
            return;
        }
        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
       }
    };
    
    this.highlight = function(oFunc, iParam){
        var oSpriteGeneric = s_oSpriteLibrary.getSprite("but_generic");
        var oSpriteCorrect = s_oSpriteLibrary.getSprite("but_correct");
        var oSpriteIncorrect = s_oSpriteLibrary.getSprite("but_incorrect");
        
        
        _oButtonBg.image = oSpriteIncorrect;
        
        var iTime = 200;
        createjs.Tween.get(_oButtonBg).wait(iTime).call(function(){
            _oButtonBg.image = oSpriteGeneric;
            createjs.Tween.get(_oButtonBg).wait(iTime/2).call(function(){
                _oButtonBg.image = oSpriteIncorrect;
                createjs.Tween.get(_oButtonBg).wait(iTime/2).call(function(){
                    _oButtonBg.image = oSpriteGeneric;
                    createjs.Tween.get(_oButtonBg).wait(iTime/3).call(function(){
                        _oButtonBg.image = oSpriteIncorrect;
                        createjs.Tween.get(_oButtonBg).wait(iTime/3).call(function(){
                            //_oButtonBg.image = oSpriteCorrect;
                            oFunc(iParam);
                        });
                    });
                });
            });
        });
    };
    
    this.reset = function(){
        var oSprite = s_oSpriteLibrary.getSprite("but_generic");
        _oButtonBg.image = oSprite;
    };
    
    this.turnOn = function(){
        var oSprite = s_oSpriteLibrary.getSprite("but_correct");
        _oButtonBg.image = oSprite;
    };
    
    this.turnOff = function(){
        var oSprite = s_oSpriteLibrary.getSprite("but_incorrect");
        _oButtonBg.image = oSprite;
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.changeText = function(szText){
        _oText.text = szText;
        _oTextBack.text = szText;
    };
    
    this.getText = function(){
        return _oText.text;
    };
    
    this.setX = function(iXPos){
         _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos){
         _oButton.y = iYPos;
    };
    
    this.setTextY = function(iNewY){
        _oText.y = iNewY;
        _oTextBack.y = iNewY+2
    };
    
    this.getButtonImage = function(){
        return _oButton;
    };

    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };
    
    this.getSprite = function(){
        return _oButton;
    };

    this._init(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize,oAttach);
    
    return this;
    
}