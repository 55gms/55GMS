CTLText.prototype = {
    
    constructor : CTLText,
    
    __autofit : function(){
        if(this._bFitText){
            
            var iFontSize = this._iFontSize;            

            while(
                    this._oText.getBounds().height > (this._iHeight -this._iPaddingV*2) ||
                    this._oText.getBounds().width > (this._iWidth-this._iPaddingH*2)                
                 ){
                iFontSize--;
                   
                this._oText.font = iFontSize+"px "+this._szFont;
                this._oText.lineHeight = Math.round(iFontSize*this._fLineHeightFactor);   
                
                this.__updateY();        
                this.__verticalAlign();                                
         
                if ( iFontSize < 8 ){
                    break;
                }
            };
            
            //this._iFontSize = iFontSize;
        }       
        
        //trace(this._oText.text + "-->fontsizedebug:"+iFontSize);
    },
    
    __verticalAlign : function(){
        if(this._bVerticalAlign){
            var iCurHeight = this._oText.getBounds().height;          
            this._oText.y -= (iCurHeight-this._iHeight)/2 + (this._iPaddingV);            
        }        
    },

    __updateY : function(){

        this._oText.y = this._y + this._iPaddingV;

        switch(this._oText.textBaseline){
            case "middle":{
                this._oText.y += (this._oText.lineHeight/2) +
                                 (this._iFontSize*this._fLineHeightFactor-this._iFontSize);                    
            }break;
        }
    },

    __createText : function(szMsg){
        
        if (this._bDebug){
            this._oDebugShape = new createjs.Shape();
            this._oDebugShape.graphics.beginFill("rgba(255,0,0,0.5)").drawRect(
                    this._x, this._y, this._iWidth, this._iHeight);
            this._oContainer.addChild(this._oDebugShape);
        }

        this._oText = new createjs.Text(szMsg, this._iFontSize+"px "+this._szFont, this._szColor);
        this._oText.textBaseline = "middle";
        this._oText.lineHeight = Math.round(this._iFontSize*this._fLineHeightFactor);
        this._oText.textAlign = this._szAlign;
        
        
        if ( this._bMultiline ){
            this._oText.lineWidth = this._iWidth - (this._iPaddingH*2);
        }else{
            this._oText.lineWidth = null;
        }
        
        switch(this._szAlign){
            case "center":{
                this._oText.x = this._x+(this._iWidth/2);
            }break;
            case "left":{
                this._oText.x = this._x+this._iPaddingH;
            }break;   
            case "right":{
                this._oText.x = this._x+this._iWidth-this._iPaddingH;
            }break;       
        }

        this._oContainer.addChild(this._oText);  
        
        this.refreshText(szMsg);

    },    
    
    setVerticalAlign : function( bVerticalAlign ){
        this._bVerticalAlign = bVerticalAlign;
    },
    
    setOutline : function(iSize){
        if ( this._oText !== null ){
            this._oText.outline = iSize;
        }
    },
    
    setShadow : function(szColor,iOffsetX,iOffsetY,iBlur){
        if ( this._oText !== null ){
            this._oText.shadow = new createjs.Shadow(szColor, iOffsetX,iOffsetY,iBlur);
        }
    },
    
    setColor : function(szColor){
        this._oText.color = szColor;
    },
    
    setRotation: function(iRot){
        this._oText.rotation = iRot;
    },
    
    setAlpha : function(iAlpha){
        this._oText.alpha = iAlpha;
    },
    
    setVisible : function(bVal){
        this._oText.visible = bVal;
    },
    
    setScale : function(iScale){
        this._oText.scale = iScale;
    },
    
    setY : function(iNewY){
        this._oText.y = iNewY;
        this._y = iNewY;
    },
    
    setX : function(iNewX){
        this._oText.x = iNewX;
        this._x = iNewX;
        
        if (this._bDebug){
            this._oDebugShape.graphics.clear();
            
            this._oDebugShape = new createjs.Shape();
            this._oDebugShape.graphics.beginFill("rgba(255,0,0,0.5)").drawRect(
                    this._x, this._y, this._iWidth, this._iHeight);
            this._oContainer.addChild(this._oDebugShape);
        }
    },
    
    setWidth : function(iWidth){
        this._iWidth = iWidth;
        
        if (this._bDebug){
            this._oDebugShape.graphics.clear();
            
            this._oDebugShape = new createjs.Shape();
            this._oDebugShape.graphics.beginFill("rgba(255,0,0,0.5)").drawRect(
                    this._x, this._y, this._iWidth, this._iHeight);
            this._oContainer.addChild(this._oDebugShape);
        }

        switch(this._szAlign){
            case "center":{
                this._oText.x = this._x+(this._iWidth/2);
            }break;
            case "left":{
                this._oText.x = this._x+this._iPaddingH;
            }break;   
            case "right":{
                this._oText.x = this._x+this._iWidth-this._iPaddingH;
            }break;       
        }
    },
    
    setFont : function(szFont){
        this._oText.font = this._iFontSize+"px "+ szFont;
        this._szFont = szFont;
    },
    
    removeTweens : function(){
        createjs.Tween.removeTweens(this._oText);
    },
    
    getText : function(){
        return this._oText;
    },
    
    getY : function(){
        return this._y;
    },
    
    getFontSize : function(){
        return this._iFontSize;
    },
    
    setFontSize : function(iFontSize){
        this._iFontSize = iFontSize;
        this._oText.font = this._iFontSize+"px "+ this._szFont;
        
        this.__autofit();
        this.__updateY();        
        this.__verticalAlign();
    },
    
    setHeight : function(iHeight){
        this._iHeight = iHeight;
        
        this.__autofit();
        this.__updateY();        
        this.__verticalAlign();
    },
    
    refreshText : function(szMsg){    
        if(szMsg === ""){
            szMsg = " ";
        }
        if ( this._oText === null ){
            this.__createText(szMsg);
        }
        
        this._oText.text = szMsg;

        this._oText.font = this._iFontSize+"px "+this._szFont;
        this._oText.lineHeight = Math.round(this._iFontSize*this._fLineHeightFactor);   
        
        this.__autofit();
        this.__updateY();        
        this.__verticalAlign();
    }
}; 

function CTLText( oContainer, 
                    x, y, iWidth, iHeight, 
                    iFontSize, szAlign, szColor, szFont,iLineHeightFactor,
                    iPaddingH, iPaddingV,
                    szMsg,
                    bFitText, bVerticalAlign, bMultiline,
                    bDebug ){

    this._oContainer = oContainer;

    this._x = x;
    this._y = y;
    this._iWidth  = iWidth;
    this._iHeight = iHeight;
    
    this._bMultiline = bMultiline;

    this._iFontSize = iFontSize;
    this._szAlign   = szAlign;
    this._szColor   = szColor;
    this._szFont    = szFont;

    this._iPaddingH = iPaddingH;
    this._iPaddingV = iPaddingV;

    this._bVerticalAlign = bVerticalAlign;
    this._bFitText       = bFitText;
    this._bDebug         = bDebug;
    //this._bDebug         = true;

    // RESERVED
    this._oDebugShape = null; 
    this._fLineHeightFactor = iLineHeightFactor;
    
    this._oText = null;
    if ( szMsg ){
        this.__createText(szMsg);
        
    }
}