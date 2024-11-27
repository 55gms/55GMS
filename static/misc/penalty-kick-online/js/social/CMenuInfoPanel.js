function CMenuInfoPanel(iX, iY, oParentContainer){
    var _aCbCompleted;
    var _aCbOwner;
    
    var _oContainer;
    var _oButRefresh;

    var _oName;
    var _oExperiencePanel;

    this._init = function(){
        _aCbCompleted = new Array();
        _aCbOwner = new Array();
        
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("menu_info_panel_small");
        var iPanelX = -oSprite.width/2;
        var oNamePanel = createBitmap(oSprite);
        oNamePanel.x = iPanelX
        oNamePanel.regX = oSprite.width/2;
        oNamePanel.regY = oSprite.height/2;
        _oContainer.addChild(oNamePanel);
        
        var oSprite = s_oSpriteLibrary.getSprite("label_name");
        _oName = new CTextLabel(iPanelX-30,0, oSprite, _oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("but_refresh");
        _oButRefresh = new CGfxButton(iPanelX+132, 0, oSprite, _oContainer);
        _oButRefresh.addEventListener(ON_MOUSE_UP, this._onButRefresh, this);
        
        var oSprite = s_oSpriteLibrary.getSprite("menu_info_panel_small");
        iPanelX = oSprite.width/2;
        var oExpPanel = createBitmap(oSprite);
        oExpPanel.x = iPanelX;
        oExpPanel.regX = oSprite.width/2;
        oExpPanel.regY = oSprite.height/2;
        _oContainer.addChild(oExpPanel);
        _oExperiencePanel = new CExperiencePanel(iPanelX-138, 0, _oContainer);
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oContainer);
        _oButRefresh.unload();
    };
    
    this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };
    
    this.setPos = function(iX, iY){
        _oContainer.x = iX;
        _oContainer.y = iY;
    };
    
    this.setName = function(szName){
        _oName.refreshText(szName);
    };

    this.setExpBar = function(oInfo){
        var iCurExp = oInfo.partialexp;
        var iNextLevelExp = oInfo.totlevelexp;
        var iCurLevel = oInfo.curlevel;
        
        _oExperiencePanel.setBar(iCurExp, iNextLevelExp);
        _oExperiencePanel.setLevel(iCurLevel);
    };
    
    this._onButRefresh = function(){
        if (_aCbCompleted[ON_REFRESH]) {
            _aCbCompleted[ON_REFRESH].call(_aCbOwner[ON_REFRESH], "");
        }
    };
    
    this._init();
}


