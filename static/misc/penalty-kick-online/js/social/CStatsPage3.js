function CStatsPage3(){
    var _oContainer;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        
        var aQuizResults = s_oSocialManager.getQuizPercent();
        //aQuizResults = [100,100,100,100,100]
        
        var oHistogram = new CStatHistogram(0,0,_oContainer);
        oHistogram.addValue(TEXT_STATS3_ADDITION, "#fc484e", aQuizResults[MATH_QUESTION_ADDITION]);
        oHistogram.addValue(TEXT_STATS3_SUBTRACTION, "#ffd042", aQuizResults[MATH_QUESTION_SUBTRACTION]);
        oHistogram.addValue(TEXT_STATS3_MULTIPLICATION, "#19e29f", aQuizResults[MATH_QUESTION_MULTIPLICATION]);
        oHistogram.addValue(TEXT_STATS3_DIVISION, "#68cdfc", aQuizResults[MATH_QUESTION_DIVISION]);
        oHistogram.addValue(TEXT_STATS3_TOTAL, "#9c68fc", aQuizResults[4]);       
       
    };

    this.unload = function(){
        _oContainer.removeAllChildren();
    };
    
    this.getContent = function(){
        return _oContainer;
    };

    this._init();
}