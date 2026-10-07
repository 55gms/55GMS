function CInfoTurn(iX, iY, iType, oParentContainer){
    
    var _iTimePanelWidth;
    var _iTimePanelHeight;
    var _oPanel;
    var _oTimePanel;
    var _oBg;
    var _oBgHighlight;
    var _oTime;
    var _oPawn;
    var _oScorePanel;
    var _oScoreText;
    var _oParent;
    
  
    this._init = function(iX, iY, iType, oParentContainer){
        
        _oPanel = new createjs.Container();
        _oPanel.x = iX;
        _oPanel.y = iY;
        oParentContainer.addChild(_oPanel);
        
        _oTimePanel = new createjs.Container();
        _oPanel.addChild(_oTimePanel);

        var oSprite = s_oSpriteLibrary.getSprite('bg_turn');
        _iTimePanelWidth = oSprite.width/2;
        _iTimePanelHeight =  oSprite.height;
        var iRegX = _iTimePanelWidth/2;
        var iRegY = _iTimePanelHeight/2;

        var oData = {   // image to use
                        images: [oSprite],
                        framerate: 58,
                        // width, height & registration point of each sprite
                        frames: {width: _iTimePanelWidth, height: _iTimePanelHeight, regX:iRegX,regY:iRegY}, 
                        animations: {  off: [0,0,"on"], on:[1,1,"off"]}
                        
        };
        
        var oSpriteSheet = new createjs.SpriteSheet(oData);        
        _oBg = createSprite(oSpriteSheet,0,iRegX,iRegY,_iTimePanelWidth,_iTimePanelHeight);
        _oBg.stop();
        _oTimePanel.addChild(_oBg);        
       
        
        _oBgHighlight = createSprite(oSpriteSheet,1,iRegX,iRegY,_iTimePanelWidth,_iTimePanelHeight);
        _oBgHighlight.stop();
        _oBgHighlight.alpha = 0;
        _oTimePanel.addChild(_oBgHighlight);

        var oSprite = s_oSpriteLibrary.getSprite(iType + '_king_marker');
        _oPawn = createBitmap(oSprite);
        _oPawn.x = _iTimePanelWidth/2 -oSprite.width/2 - 20;
        _oPawn.y = 0
        _oPawn.regX = oSprite.width/2;
        _oPawn.regY = oSprite.height/2;
        _oTimePanel.addChild(_oPawn);

        _oTime =  new createjs.Text("00:00"," 58px "+PRIMARY_FONT, "#ffffff");
        _oTime.x = 28;
        _oTime.y = 0
        _oTime.textAlign = "center";
        _oTime.textBaseline = "middle";
        _oTime.lineWidth = 200;
        _oTimePanel.addChild(_oTime);

        _oScorePanel = new createjs.Container();
        _oPanel.addChild(_oScorePanel);

        var oSprite = s_oSpriteLibrary.getSprite('score_panel');
        var oScoreBg = createBitmap(oSprite);
        oScoreBg.regX = oSprite.width/2;
        oScoreBg.regY = oSprite.height/2;
        _oScorePanel.addChild(oScoreBg);
        
        _oScoreText = new createjs.Text(START_SCORE," 30px "+PRIMARY_FONT, "#ffffff");
        _oScoreText.x = 90;
        _oScoreText.textAlign = "right";
        _oScoreText.textBaseline = "middle";
        _oScoreText.lineWidth = 200;
        _oScorePanel.addChild(_oScoreText);
        
        
        if(s_iGameType === MODE_HUMAN && iType === BLACK && s_bMobile){
            _oTimePanel.rotation = -180;
            _oScorePanel.rotation = -180;
        }
        
        if(!SHOW_SCORE || (s_iGameType === MODE_COMPUTER && iType === BLACK)){
            _oScorePanel.visible = false;
        }
        
    };
    
    this.refreshTime = function(szTime){
        _oTime.text = szTime;
    };
    
    this.refreshScore = function(szScore){
        _oScoreText.text = szScore;
    };
  
    this.invert = function(){
        _oTime.x = 0;
        _oPawn.x = -100;
    };
    
    this.active = function(bVal){
        if(bVal){
            createjs.Tween.get(_oBg).to({alpha:0}, 750, createjs.Ease.cubicOut).to({alpha:1}, 750, createjs.Ease.cubicIn).call(function(){_oParent.active(bVal);});
            createjs.Tween.get(_oBgHighlight).to({alpha:1}, 750, createjs.Ease.cubicOut).to({alpha:0}, 750, createjs.Ease.cubicIn);//.call(function(){});
        } else {
            _oBg.alpha = 1;
            _oBgHighlight.alpha = 0;
            createjs.Tween.removeTweens(_oBg);
            createjs.Tween.removeTweens(_oBgHighlight);
        } 
    };

    this.unload = function(){
        oParentContainer.removeChild(_oPanel);
    };
    
    this.setBgVisible = function(bVal){
        _oBg.visible = bVal;
        _oScorePanel.visible = bVal;
    };
    
    this.setPanelVisible = function(bVal){
        _oPanel.visible = bVal;
    };
    
    this.setPawn = function(iType){
        _oPawn.gotoAndStop(iType);
    };
    
    this.setScale = function(iScale){
        _oPanel.scaleX = _oPanel.scaleY = iScale;
    };
    
    this.setPos = function(iX, iY){
        _oPanel.x = iX;
        _oPanel.y = iY;
        
        var oSprite = s_oSpriteLibrary.getSprite('score_panel');
        var iOffset = 19;
        
        if(s_bLandscape){
            if(iType === WHITE){
                _oTimePanel.x = -_iTimePanelWidth/2 + iOffset;
                _oTimePanel.y = -_iTimePanelHeight/2 + iOffset;
                _oScorePanel.x = - oSprite.width/2;
                _oScorePanel.y = -_iTimePanelHeight + oSprite.height/2 - iOffset*2//-oSprite.height/2;

            }else {
                _oTimePanel.x = _iTimePanelWidth/2 - iOffset;
                _oTimePanel.y = _iTimePanelHeight/2 - iOffset;
                _oScorePanel.x = oSprite.width/2;
                _oScorePanel.y = _iTimePanelHeight - oSprite.height/2 + iOffset*2;
            }
            
        }else {
            
            if(iType === WHITE){
                _oTimePanel.x = -_iTimePanelWidth/2 + iOffset;
                _oTimePanel.y = _iTimePanelHeight/2 - iOffset;
                _oScorePanel.x = -_iTimePanelWidth - oSprite.width/2 + iOffset;
                _oScorePanel.y = oSprite.height/2;

            }else {
                _oTimePanel.x = _iTimePanelWidth/2 - iOffset;
                _oTimePanel.y = -_iTimePanelHeight/2 + iOffset;
                _oScorePanel.x = _iTimePanelWidth + oSprite.width/2-iOffset;
                _oScorePanel.y = - oSprite.height/2;
            }
        }
        
        
        
    };
    
    _oParent = this;
    this._init(iX, iY, iType, oParentContainer);
    
};


