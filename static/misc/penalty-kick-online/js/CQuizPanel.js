function CQuizPanel(oParentContainer){
    var _bSpectatorMode;
    var _iEventToLaunch;
    var _iIDListener;
    var _iBarWidth;
    var _iStartTime;
    var _iTimer;
    var _iCorrectAnswer;
    var _aCbCompleted;
    var _aCbOwner;
    var _aAnswerButtons;
    var _oListener;
    
    var _oFade;
    var _oTitleText;
    var _oExplText1;
    var _oMask;
    var _oSpectatorFrame;
    var _oCountDown;
    var _oContentContainer;
    //var _oScorePlayer2Text;
    var _oSubtractionTextContainer;

    var _oContainer;
    var _oContainerPanel;
    var _oThis;
    //var _oLabelContainer;

    this._init = function(){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        oParentContainer.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oListener = _oFade.on("click", function () {});
        _oContainer.addChild(_oFade);

        
        _oContainerPanel = new createjs.Container();
        _oContainerPanel.x = CANVAS_WIDTH/2;
        _oContainer.addChild(_oContainerPanel);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box_narrow");
        var oBg = createBitmap(oSpriteBg);
        oBg.regX = oSpriteBg.width/2;
        oBg.regY = oSpriteBg.height/2;
        _oContainerPanel.addChild(oBg);
        
        _oContentContainer = new createjs.Container();
        _oContainerPanel.addChild(_oContentContainer);
        
        _oSubtractionTextContainer = new createjs.Container();
        _oContainerPanel.addChild(_oSubtractionTextContainer);
        
       
        var iWidth = oSpriteBg.width -100;
        var iHeight = 100;
        var oRect = new createjs.Rectangle(- iWidth/2, -60-iHeight/2, iWidth, iHeight);
        _oTitleText = new CTLText(   _oContainerPanel, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    50, "center", "#ffffff", PRIMARY_FONT, 1.1,
                                    0,0,
                                    " ",
                                    true, true, false,
                                    false
                                );


        var iWidth = 170;
        var iHeight = 60;
        var oRect = new createjs.Rectangle(-iWidth-80, 10-iHeight/2, iWidth, iHeight);
        _oExplText1 = new CTLText(   _oContentContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    50, "right", "#ffffff", PRIMARY_FONT, 1,
                                    0,0,
                                    " ",
                                    true, true, false,
                                    false
                                );
                        
        /*
        var iWidth = oSpriteBg.width -100;
        var iHeight = 100;
        var oRect = new createjs.Rectangle(oSpriteBg.width/2 - iWidth/2, oSpriteBg.height/2+70-iHeight/2, iWidth, iHeight);
        _oScorePlayer2Text = new CTLText(   _oContainerPanel, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    50, "center", "#ffffff", PRIMARY_FONT,
                                    0,0,
                                    " ",
                                    true, true, false,
                                    false
                                );
        */
       
        _aAnswerButtons = new Array();
        var iCenterX = 90;
        var iCenterY = 10;
        var oSprite = s_oSpriteLibrary.getSprite("but_generic");

        var iWindowSize = 250;

        for(var i=0; i<4; i++){
            _aAnswerButtons[i] = new CTextButton(iCenterX -iWindowSize/2 + i*(iWindowSize/(3) ), iCenterY, oSprite, " ", PRIMARY_FONT, "#FFFFFF", 30, _oContentContainer);
            _aAnswerButtons[i].addEventListenerWithParams(ON_MOUSE_UP,this._onAnswer,this, i);
        }
        
        _oCountDown = new CRadialWipeWidget(iCenterX, iCenterY, _oContainerPanel);
        
        
        var oTimeContainer = new createjs.Container();
        oTimeContainer.x = 0;
        oTimeContainer.y = 70;
        _oContentContainer.addChild(oTimeContainer);
        
        _iBarWidth = oSpriteBg.width - 98;
        var iBarHeight = 20;
        
        var oBgTime = new createjs.Shape();
        oBgTime.graphics.beginFill("#284361").drawRoundRect(-_iBarWidth/2, -iBarHeight/2, _iBarWidth, iBarHeight, 10);
        oTimeContainer.addChild(oBgTime);
        
        var oTimeBar = new createjs.Shape();
        oTimeBar.graphics.beginFill("#3497eb").drawRoundRect(-_iBarWidth/2, -iBarHeight/2, _iBarWidth, iBarHeight, 10);
        oTimeContainer.addChild(oTimeBar);
        
        _oMask = new createjs.Shape();
        _oMask.graphics.beginFill("#ffff00").drawRect(-_iBarWidth/2, -iBarHeight/2, _iBarWidth, iBarHeight);
        _oMask.alpha = 0.01;
        oTimeContainer.addChild(_oMask);
        oTimeBar.mask = _oMask;

        _oSpectatorFrame = new createjs.Shape();
        _oSpectatorFrame.graphics.beginFill("#000000").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oSpectatorFrame.alpha = 0.3;
        _oSpectatorFrame.visible = false;
        _oListener = _oSpectatorFrame.on("click", function () {});
        _oContainer.addChild(_oSpectatorFrame);

        //_oContainerPanel.regX = oSpriteBg.width/2;
        //_oContainerPanel.regY = oSpriteBg.height/2;
        
        /*
        var oSprite = s_oSpriteLibrary.getSprite('label_info');
        _oLabelContainer = new createjs.Container();
        //_oLabelContainer.x = CANVAS_WIDTH/2;
        _oLabelContainer.y = oSpriteBg.height/2 + oSprite.height/2;
        _oLabelContainer.visible = false;
        _oContainerPanel.addChild(_oLabelContainer);
        
        
        var oLabel = createBitmap(oSprite);
        oLabel.regX = oSprite.width/2;
        oLabel.regY = oSprite.height/2;
        _oLabelContainer.addChild(oLabel);
        
        var iWidth = oSprite.width -20;
        var iHeight = oSprite.height-10;
        var iX = 0;
        var iY = 0;
        var oRect = new createjs.Rectangle(iX- iWidth/2, iY-iHeight/2, iWidth, iHeight);
        var oLabelText = new CTLText(   _oLabelContainer, 
                                    oRect.x, oRect.y, oRect.width, oRect.height, 
                                    30, "center", "#ffffff", SECONDARY_FONT, 1.1,
                                    0,0,
                                    TEXT_OPPONENT_BONUS_QUESTION,
                                    true, true, false,
                                    false
                                );
        */
    };
    
    this.unload = function(){
        _oFade.off("click", _oListener);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.show = function(aScores, szOperation, iCorrectAnswer, aAnswers, iTime){
        _oFade.alpha=0.01;
        _oContainerPanel.y = CANVAS_HEIGHT/2;
        _oContainer.visible = true;
        _oContainer.alpha = 1;
        _oContentContainer.visible = false;
        
        _bSpectatorMode = false;
        //_oSpectatorFrame.alpha = 0.3;
        _oSpectatorFrame.visible = false;
        
        //_oTitleText.refreshText( TEXT_GET_A_BONUS_SHOT );
        this.changeMessage(TEXT_GET_A_BONUS_SHOT, "#FFF");
        
        _iStartTime = QUIZ_SHOW_COUNTDOWN;
        _iTimer = _iStartTime;
        
        _oCountDown.setVisible(false);
       
        createjs.Tween.get(_oContainer).wait(QUIZ_SHOW_COUNTDOWN).call(function(){
            _oCountDown.setVisible(false);
            _oThis._showAnswer(aScores, szOperation, iCorrectAnswer, aAnswers, iTime);
        }).addEventListener("change",_oThis._countDown);
       
        //this._showAnswer(aScores, iCorrectAnswer, aAnswers, iTime);
    };
    
    this._showAnswer = function(aScores, szOperation, iCorrectAnswer, aAnswers, iTime){
        _oContentContainer.visible = true;
        
        var iExplText = aScores[0] + " " +szOperation+ " " + aScores[1] + " =";
        
        _oExplText1.refreshText(iExplText);

        _iCorrectAnswer = parseInt(iCorrectAnswer);
        
        for(var i=0; i<4; i++){
            _aAnswerButtons[i].changeText(aAnswers[i]);
            _aAnswerButtons[i].reset();
            _aAnswerButtons[i].enable();
        }

        _iStartTime = iTime;
        _iTimer = _iStartTime;
        
        _iIDListener = setInterval(function(){
            _oThis.update();
        },FPS_TIME);
    };


    this.setSpectatorMode = function(){
        _bSpectatorMode = true;
        
        //_oTitleText.refreshText( TEXT_PLAYER_TURN.format(s_oNetworkManager.getEnemyNickname().toUpperCase()) );
        //_oExplText1.refreshText(TEXT_PLAYER_WAIT_TO_CALCULATE);
        var szPlayerName = TEXT_CPU;
        if(s_bMultiplayer){
            szPlayerName = s_oNetworkManager.getEnemyNickname().toUpperCase();
        }
        this.changeMessage( /*sprintf(TEXT_PLAYER_TURN, szPlayerName*/TEXT_OPPONENT_BONUS_QUESTION, "#FFF");
        
        _oSpectatorFrame.visible = true;
        //_oLabelContainer.visible = true;
    };
    
    /*
    this.setSpectatorFrameAlpha = function(iVal){
        _oSpectatorFrame.alpha = iVal;
    };
    */
   
    this.setAnswer = function(iAnswerIndex){
        clearInterval(_iIDListener);

        //_oSpectatorFrame.visible = true;
        /*
        var aPossibleAnswer = new Array();
        for(var i=0; i<_aAnswerButtons.length; i++){
            aPossibleAnswer[i] = parseInt(_aAnswerButtons[i].getText());
            if(aPossibleAnswer[i] === _iCorrectAnswer){
                _aAnswerButtons[i].highlight();
            }
        }

        if(aPossibleAnswer[iAnswerIndex] !== _iCorrectAnswer){
            ///INCCORRECT
            //_aAnswerButtons[iAnswerIndex].highlight();
            _aAnswerButtons[iAnswerIndex].turnOff();
        }
        */
       
        if(iAnswerIndex === -1){
            /////// ANSWER TIMEOUT
            _iTimer = 0;
            
            _oMask.x = -_iBarWidth;
            
            this._turnOnTheRightAnswer(_iCorrectAnswer);
            _oSubtractionTextContainer.removeAllChildren();
            
            s_oGame.setQuizTimeoutPanel();
        } else {
            //_aAnswerButtons[iAnswerIndex].highlight(this._onFinishAnimation, iAnswerIndex);
            
            this._onFinishAnimation(iAnswerIndex);
        }

    };
    
    this._onFinishAnimation = function(iAnswerIndex){
        var bCorrect = true;
        
        _oThis._turnOnTheRightAnswer(_iCorrectAnswer);
        
        //_oExplText1.refreshText("");
        _oSubtractionTextContainer.removeAllChildren();

        if(parseInt( _aAnswerButtons[iAnswerIndex].getText() ) !== _iCorrectAnswer){
            ///INCORRECT
            _aAnswerButtons[iAnswerIndex].turnOff();
            bCorrect = false;
        }
        
        s_oGame.onQuizEnd(bCorrect);
    };
    
    this._turnOnTheRightAnswer = function(iCorrectAnswer){
        var aPossibleAnswer = new Array();
        for(var i=0; i<_aAnswerButtons.length; i++){
            aPossibleAnswer[i] = parseInt(_aAnswerButtons[i].getText());
            if(aPossibleAnswer[i] === iCorrectAnswer){
                _aAnswerButtons[i].turnOn();
            }
        }
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({alpha: 0}, 500, createjs.Ease.quartOut).call(function(){
            _oContainer.visible = false;
            //_oLabelContainer.visible = false;
            _oContainerPanel.y = CANVAS_HEIGHT_HALF;
        });
    };

    this.changeMessage = function(szMsg, szColor){
        _oTitleText.refreshText( szMsg );
        if(szColor){
            _oTitleText.setColor(szColor);
        }
        
    };
    
    
    this.setExplMessage = function(szMessage){
        _oExplText1.refreshText(szMessage);
    };
    
   
    this._onAnswer = function(iIndex){
        clearInterval(_iIDListener);

        for(var i=0; i<_aAnswerButtons.length; i++){
            _aAnswerButtons[i].disable();
        }
        
        _iEventToLaunch = ON_ANSWER;
        if(_aCbCompleted[_iEventToLaunch]){
            _aCbCompleted[_iEventToLaunch].call(_aCbOwner[_iEventToLaunch], iIndex);
        }
    };
    
    this._onEndTimer = function(){
        _iTimer = 0;
            
        _oMask.x = -_iBarWidth;

        //_oSpectatorFrame.visible = true;

        clearInterval(_iIDListener);
        
        for(var i=0; i<_aAnswerButtons.length; i++){
            _aAnswerButtons[i].disable();
        }
        
        if(!_bSpectatorMode){
            _iEventToLaunch = ON_QUIZ_TIMEOUT;
            if(_aCbCompleted[_iEventToLaunch]){
                _aCbCompleted[_iEventToLaunch].call(_aCbOwner[_iEventToLaunch]);
            }
        };
    };


    this._countDown = function(){
        _iTimer -= s_iTimeElaps;
        if(_iTimer < 0){
            _iTimer = 0;
        }
        _oCountDown.update(_iTimer, _iStartTime);
    };
    
    this.animDown = function(){
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box_narrow");
        var iY = CANVAS_HEIGHT_HALF + oSpriteBg.height/2;
        createjs.Tween.get(_oContainerPanel).to({y: iY}, 500, createjs.Ease.quartOut);
    };
    
    this.update = function(){
        //_oMask.x -= 0.5;
        
        _iTimer -= s_iTimeElaps;

        _oMask.x = linearFunction(_iTimer, 0, _iStartTime, -_iBarWidth, 0);

        if(_iTimer < 0 ){
            this._onEndTimer();
        }
    };
    
    _oThis = this;
    this._init();
}