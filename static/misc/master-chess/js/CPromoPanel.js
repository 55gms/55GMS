function CPromoPanel(szCurPlayer, oPawnPos){
    
    var _aPieceButton;
    
    var _oBg;
    var _oMsgText;
    var _oFade;
    var _oParent;
    var _oHitArea;
    var _oContainer;
    var _oListener;
    
    this._init = function(szCurPlayer, oPawnPos){
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        s_oStage.addChild(_oFade);
        new createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        var oSpriteMsgBox = s_oSpriteLibrary.getSprite('msg_box');
        _oContainer = new createjs.Container();
        _oContainer.y = CANVAS_HEIGHT + oSpriteMsgBox.height/2; 
        s_oStage.addChild(_oContainer);

        _oBg = createBitmap(oSpriteMsgBox);
        _oBg.regX = oSpriteMsgBox.width/2;
        _oBg.regY = oSpriteMsgBox.height/2;
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        _oContainer.addChild(_oBg);
        
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        _oListener = _oHitArea.on("click", function(){});
        _oContainer.addChild(_oHitArea);

        _oMsgText = new createjs.Text(TEXT_PROMOTION, "40px " + PRIMARY_FONT, "#402604");
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
	_oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = CANVAS_HEIGHT/2 - 300;
        _oMsgText.lineWidth = 700;
	_oContainer.addChild(_oMsgText);

        var oPiecesContainer = new createjs.Container();
        oPiecesContainer.x = CANVAS_WIDTH/2;
        oPiecesContainer.y = CANVAS_HEIGHT/2;
        _oContainer.addChild(oPiecesContainer);

        var aPieces = new Array();
        aPieces[0] = BISHOP;
        aPieces[1] = ROOK;
        aPieces[2] = KNIGHT;
        aPieces[3] = QUEEN;
        
        var iWidth = 400;
        _aPieceButton = new Array();
        for(var i=0; i<aPieces.length; i++){
            var oSprite = s_oSpriteLibrary.getSprite(szCurPlayer + "_" +aPieces[i]);         
            _aPieceButton[i] = new CToggle(-iWidth/2 + i*(iWidth/(aPieces.length-1)),0,oSprite,true,oPiecesContainer);
            _aPieceButton[i].addEventListenerWithParams(ON_MOUSE_UP, this._onPieceSelected, this, aPieces[i]);
        }
        
	new createjs.Tween.get(_oContainer).to({y:0},750, createjs.Ease.cubicOut);       
        
    };
    
    this.unload = function(){
        _oHitArea.off("click", _oListener);
        
        s_oStage.removeChild(_oFade);
        s_oStage.removeChild(_oContainer);

    };
    
    this._onPieceSelected = function(szPiece){
        
        s_oGame.changePiece(szPiece, oPawnPos);
        
        var oSpriteMsgBox = s_oSpriteLibrary.getSprite('msg_box');
        var iEndPos = CANVAS_HEIGHT + oSpriteMsgBox.height/2; 
        
        new createjs.Tween.get(_oFade).to({alpha:0},500);
        new createjs.Tween.get(_oContainer).to({y:iEndPos},500, createjs.Ease.backIn).call(function(){
            _oParent.unload();
            s_oGame.onExitPromoPanel();
        });

    };
    
    this._init(szCurPlayer, oPawnPos);
    _oParent = this;
    
};


