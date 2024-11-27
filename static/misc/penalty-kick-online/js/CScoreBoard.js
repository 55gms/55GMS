function CScoreBoard(iLevel,pContainerPos,oParentContainer) {
    var _pStartPos;
    var _oFlagOpponent;
    var _oNicknameText;
    var _oOpponentText;
    var _oPlayerScoreText;
    var _oOpponentScoreText;
    var _oContainerText;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    var _aPlayerKickIcons;
    var _aOpponentKickIcons;
    
    var _iPlayerIndex;
    var _iOpponentIndex;
    
    var _oExtraText;
    var _oPlayerLevel;
    var _oOpponentLevel;
    

    this._init = function (iLevel,pContainerPos) {
        _pStartPos = pContainerPos;
        _oContainer = new createjs.Container();
        _oContainer.x = pContainerPos.x;
        _oContainer.y = pContainerPos.y;
        _oParentContainer.addChild(_oContainer);

        var oSpriteBg = s_oSpriteLibrary.getSprite("name_panel");
        var oNamePanel = createBitmap(oSpriteBg);
        oNamePanel.regX = oSpriteBg.width/2;
        oNamePanel.y = 100;
        //oNamePanel.regY = oSpriteBg.width/2;
        _oContainer.addChild(oNamePanel);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("score_side_bg");
        var oBg = createBitmap(oSpriteBg);
        oBg.regX = oSpriteBg.width/2;
        _oContainer.addChild(oBg);
        
        _oContainerText = new createjs.Container();
        _oContainerText.x = -1;
        _oContainerText.y = 42;
        _oContainer.addChild(_oContainerText);
        
        var oBarText = new createjs.Text("-",  "30px " + PRIMARY_FONT, TEXT_COLOR);
        oBarText.textAlign = "center";
        oBarText.textBaseline = "middle";
        oBarText.shadow = new createjs.Shadow("#000000", 1, 1, 4);
        _oContainerText.addChild(oBarText);
        

        _oPlayerScoreText = new createjs.Text("0",  "30px " + PRIMARY_FONT, TEXT_COLOR);
        _oPlayerScoreText.x = - 8;
        _oPlayerScoreText.textAlign = "right";
        _oPlayerScoreText.textBaseline = "middle";
        _oPlayerScoreText.shadow = new createjs.Shadow("#000000", 1, 1, 4);
        _oContainerText.addChild(_oPlayerScoreText);

        _oOpponentScoreText = new createjs.Text("0",  "30px " + PRIMARY_FONT, TEXT_COLOR);
        _oOpponentScoreText.x = + 8;
        _oOpponentScoreText.textAlign = "left";
        _oOpponentScoreText.textBaseline = "middle";
        _oOpponentScoreText.shadow = new createjs.Shadow("#000000", 1, 1, 4);
        _oContainerText.addChild(_oOpponentScoreText);
        
        var oSprite = s_oSpriteLibrary.getSprite("flag_"+TEAM_LABEL[s_iTeamSelected]);
        var oFlagPlayer = createBitmap(oSprite);
        oFlagPlayer.regX = oSprite.width/2;
        oFlagPlayer.regY = oSprite.height/2;
        oFlagPlayer.scaleX = oFlagPlayer.scaleY = 0.86;
        oFlagPlayer.x = -89;
        oFlagPlayer.y = 42;
        _oContainer.addChild(oFlagPlayer);

        var oSprite = s_oSpriteLibrary.getSprite("flag_"+TEAM_LABEL[s_aMatches[iLevel-1]]);
        _oFlagOpponent = createBitmap(oSprite);
        _oFlagOpponent.regX = oSprite.width/2;
        _oFlagOpponent.regY = oSprite.height/2;
        _oFlagOpponent.scaleX = _oFlagOpponent.scaleY = 0.86;
        _oFlagOpponent.x = 90;
        _oFlagOpponent.y = 42;
        _oContainer.addChild(_oFlagOpponent);

        var oSpriteKick = s_oSpriteLibrary.getSprite("ball_kick");
        var iWidth = oSpriteKick.width / 4;
        var iHeight = oSpriteKick.height;
        var oData = {
            images: [oSpriteKick],
            // width, height & registration point of each sprite
            frames: {width: iWidth, height: iHeight, regX: iWidth / 2, regY: iHeight / 2},
            animations: {empty: 0, state_1: 1,state_0:2, state_2:3}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        var iX = -120;
        var iY = 100;
        _aPlayerKickIcons = new Array();
        for(var i=0;i<NUM_KICKS/4;i++){
            var oKick = new CKickIcon(iX,iY,oSpriteSheet,_oContainer);
            _aPlayerKickIcons.push(oKick);
            
            iX += iWidth + 5;
        }
        
        _aOpponentKickIcons = new Array();
        var iX = 120;
        for(var i=0;i<NUM_KICKS/4;i++){
            var oKick = new CKickIcon(iX,iY,oSpriteSheet,_oContainer);
            _aOpponentKickIcons.push(oKick);
            
            iX -= iWidth + 5;
        }
        
        _iPlayerIndex = 0;
        _iOpponentIndex = 0;
        
        _oExtraText = new createjs.Text(TEXT_EXTRA, "12px " + PRIMARY_FONT, TEXT_COLOR);
        _oExtraText.x = 0;
        _oExtraText.y = 100;
        _oExtraText.textAlign = "center";
        _oExtraText.textBaseline = "middle";
        _oExtraText.shadow = new createjs.Shadow("#000000", 1, 1, 4);
        _oExtraText.visible = false;
        _oContainer.addChild(_oExtraText);

        var iWidth = 122;
        var iHeight = 42;
        var iX = -126;
        var iY = 89;
        _oNicknameText = new CTLText(_oContainerText, 
                    iX, iY-iHeight/2, iWidth, iHeight, 
                    20, "left", TEXT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_PLAYER,
                    true, true, true,
                    false );
        _oNicknameText.setShadow("#000000", 1, 1, 4);
       
        
        var iX = 128;
        _oOpponentText = new CTLText(_oContainerText, 
                    iX-iWidth, iY-iHeight/2, iWidth, iHeight, 
                    20, "right", TEXT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_CPU,
                    true, true, true,
                    false );
        _oOpponentText.setShadow("#000000", 1, 1, 4);
        
        
        var oSprite = s_oSpriteLibrary.getSprite("label_cur_level");
        _oPlayerLevel = new CTextLabel(-108,iY+42, oSprite, _oContainer);
        _oPlayerLevel.setScale(0.9);
        _oPlayerLevel.setVisible(false);
        
        var oSprite = s_oSpriteLibrary.getSprite("label_cur_level");
        _oOpponentLevel = new CTextLabel(108,iY+42, oSprite, _oContainer);
        _oOpponentLevel.setScale(0.9);
        _oOpponentLevel.setVisible(false);
    };
    
    this.unload = function(){
        _oParentContainer.removeChild(_oContainer);
    };
    
    this.reset = function(iOpponent){
        _oExtraText.visible = false;
        _iPlayerIndex = 0;
        _iOpponentIndex = 0;
        
        _oFlagOpponent.image = s_oSpriteLibrary.getSprite("flag_"+TEAM_LABEL[iOpponent])

        _oPlayerScoreText.text = 0;
        _oOpponentScoreText.text = 0;
        for(var i=0;i<NUM_KICKS/4;i++){
            _aPlayerKickIcons[i].changeState("empty");
            _aOpponentKickIcons[i].changeState("empty");
            _aPlayerKickIcons[i].setVisible(true);
            _aOpponentKickIcons[i].setVisible(true);
        }
    };
    
    this.refreshButtonPos = function () {
        _oContainer.x = _pStartPos.x + s_iOffsetX;
        _oContainer.y = _pStartPos.y + s_iOffsetY;
    };
    
    this.setScore = function(iPlayerScore,iOpponentScore){
        _oPlayerScoreText.text = iPlayerScore;
        _oOpponentScoreText.text = iOpponentScore;
    };
    
    this.darken = function(){
        _oContainer.alpha = 0.7;
    };
    
    this.show = function(){
        _oContainer.visible = true;
    };
    
    this.hide = function(){
        _oContainer.visible = false;
    };
    
    this.setExtraScore = function(){
        _oExtraText.visible = true;
        for(var i=0; i<_aPlayerKickIcons.length; i++){
            _aPlayerKickIcons[i].changeState("empty");
            if(i>0){
                _aPlayerKickIcons[i].setVisible(false);
            }
        }
        for(var i=0; i<_aOpponentKickIcons.length; i++){
            _aOpponentKickIcons[i].changeState("empty");
            if(i>0){
                _aOpponentKickIcons[i].setVisible(false);
            }
        }
        _iPlayerIndex = 0;
        _iOpponentIndex = 0;
    };
    
    this.refreshPlayerKicks = function(szResult){
        _aPlayerKickIcons[_iPlayerIndex].changeState("state_"+szResult);
        _iPlayerIndex++;
    };
    
    this.refreshOpponentKicks = function(szResult){
        _aOpponentKickIcons[_iOpponentIndex].changeState("state_"+szResult);
        _iOpponentIndex++;
    };
    
    this.setBonusGoal = function(iTurn){
        if(iTurn === PLAYER){
            _aPlayerKickIcons[_iPlayerIndex-1].changeState("state_2");
        }else {
            _aOpponentKickIcons[_iOpponentIndex-1].changeState("state_2");
        }
    };  
    
    this.setPlayersName = function(szPlayer, szOpponent){
        _oNicknameText.refreshText( szPlayer );
        _oOpponentText.refreshText( szOpponent );
    };
    
    this.setLevels = function(iPlayerLevel, iOpponentLevel){
        _oNicknameText.setWidth(80);
        _oNicknameText.setX(-84);
        _oOpponentText.setWidth(80);
        
        _oPlayerLevel.setVisible(true);
        _oOpponentLevel.setVisible(true);
        
        _oPlayerLevel.refreshText(iPlayerLevel);
        _oOpponentLevel.refreshText(iOpponentLevel);
    };  
    
    this._init(iLevel,pContainerPos);

    return this;
}