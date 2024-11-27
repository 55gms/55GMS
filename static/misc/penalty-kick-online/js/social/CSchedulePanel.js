function CSchedulePanel(iX, iY, oParentContainer, aSchedulesSprite, aTitles, iTextSize){
    
    var _iWidth;
    var _iHeight;
    
    var _oParent;
    var _oContainer;
    var _aSchedule;
    var _aTitleText;
    
    this._init = function(iX, iY, oParentContainer, aSchedulesSprite, aTitles, iTextSize){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);

        _iWidth = aSchedulesSprite[0].width;
        _iHeight = aSchedulesSprite[0].height;
        
        this._buildSchedule();
        this._buildTitlesIndex();
        
        this.setPageVisible(0);
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oContainer);
    };
    
    this._buildSchedule = function(){
        _aSchedule = new Array();
        
        for(var i=0; i<aSchedulesSprite.length; i++){
            var oSchedule = new createjs.Container();
            _oContainer.addChild(oSchedule);
            
            var oSpriteBg = aSchedulesSprite[i];
            var oBg = createBitmap(oSpriteBg);
            oBg.regX = oSpriteBg.width/2;
            oBg.regY = oSpriteBg.height/2;
            oSchedule.addChild(oBg);
            
            _aSchedule.push(oSchedule);
        }
    };
    
    this._buildTitlesIndex = function(){
        _aTitleText = new Array();
        
        var iTitleWidth = _iWidth/aTitles.length;
        var iTitleHeight = 52//_iHeight/aTitles.length;
        var iY = -_iHeight/2 + iTitleHeight/2;
        //var iX = -_iWidth/2 + iTitleWidth/2;
        for(var i=0; i<aTitles.length; i++){
            
            var oHitArea = new createjs.Shape();
            var iX = -_iWidth/2 + iTitleWidth/2 + i*iTitleWidth;
            //var iY = -_iHeight/2 + iTitleHeight/2 +i*iTitleHeight;
            oHitArea.graphics.beginFill(getRandomRGB(0.01)).drawRect(iX-iTitleWidth/2,iY-iTitleHeight/2,iTitleWidth,iTitleHeight);
            oHitArea.on("mousedown", this._onTitle, this, false, i);
            _oContainer.addChild(oHitArea);
            
            var iWidth = iTitleWidth-10;
            var iHeight = iTextSize*1.5;

            var oMsgText = new CTLText(_oContainer, 
                        iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                        iTextSize, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                        2, 2,
                        aTitles[i],
                        true, true, true,
                        false );
            //oMsgText.setRotation(-90);
            oMsgText.setShadow("#000",1,1,2);
                        
            _aTitleText.push(oMsgText);

        }
    };
    
    this.setPageVisible = function(iIndex){
        for(var i=0; i<_aSchedule.length; i++){
            if(iIndex === i){
                _aSchedule[i].visible = true;
                _aTitleText[i].setColor(TEXT_COLOR);
            }else {
                _aSchedule[i].visible = false;
                _aTitleText[i].setColor("#aaa");
            }
        }
    };
    
    this._onTitle = function(evt, iIndex){
        _oParent.setPageVisible(iIndex);
    };
    
    this.addContentToPage = function(iPage, oContent){
        _aSchedule[iPage].addChild(oContent);
    };
    
    _oParent = this;
    this._init(iX, iY, oParentContainer, aSchedulesSprite, aTitles, iTextSize);
}


