var s_iCurExp = 0;
var s_aCurAchiProgress = new Array();

//STAT PAGE 0
var s_aCountryPickCounter = new Array();
var s_iMatchWon = 0;
var s_iMatchLost = 0;

//STAT PAGE 1
var s_iStrikerGoalScored = 0;
var s_iStrikerGoalSaved = 0;
var s_iStrikerGoalMissed = 0;
var s_iPerfectGames = 0;
var s_aStrikerHotZones = new Array();

//STAT PAGE 2
var s_iKeeperShotsSaved = 0;
var s_iKeeperShotsGoal = 0;
var s_iShutOuts = 0;
var s_aKeeperHotZones = new Array();

//STAT PAGE 3
var s_aQuizResults = new Array();

var ACHIEVEMENTS_TARGET = new Array();
var ACHI_HAT_TRICK = 0;
var ACHI_THE_FIRST = 1;
var ACHI_WORLD_CHAMPION = 2;
var ACHI_BRONZE_BOOT = 3;
var ACHI_SILVER_BOOT = 4;
var ACHI_GOLDEN_BOOT = 5;
var ACHI_MATHKICKER = 6;
var ACHI_MATHOFTHEMATCH = 7;
var ACHI_MATHLEGEND = 8;
var ACHI_BRONZE_GLOVE = 9;
var ACHI_SILVER_GLOVE = 10;
var ACHI_GOLDEN_GLOVE = 11;
var ACHI_GOAL_MACHINE = 12;
var ACHI_GOAL_PHENOM = 13;
var ACHI_GOAL_LEGEND = 14;


var EXP_START = 150;
var EXP_FACTOR = 1.03;
var EXP_NUM_LEVELS = 100;
var EXP_LEVELS = new Array();

var ACHIEVEMENT_EXP = new Array();
ACHIEVEMENT_EXP[ACHI_BRONZE_BOOT] = 50;
ACHIEVEMENT_EXP[ACHI_SILVER_BOOT] = 250;
ACHIEVEMENT_EXP[ACHI_GOLDEN_BOOT] = 1000;
ACHIEVEMENT_EXP[ACHI_MATHKICKER] = 50;
ACHIEVEMENT_EXP[ACHI_MATHOFTHEMATCH] = 100;
ACHIEVEMENT_EXP[ACHI_MATHLEGEND] = 500;
ACHIEVEMENT_EXP[ACHI_BRONZE_GLOVE] = 25;
ACHIEVEMENT_EXP[ACHI_SILVER_GLOVE] = 100;
ACHIEVEMENT_EXP[ACHI_GOLDEN_GLOVE] = 500;
ACHIEVEMENT_EXP[ACHI_HAT_TRICK] = 200;
ACHIEVEMENT_EXP[ACHI_GOAL_MACHINE] = 400;
ACHIEVEMENT_EXP[ACHI_GOAL_PHENOM] = 600;
ACHIEVEMENT_EXP[ACHI_GOAL_LEGEND] = 1000;
ACHIEVEMENT_EXP[ACHI_THE_FIRST] = 50;
ACHIEVEMENT_EXP[ACHI_WORLD_CHAMPION] = 1000;

var EXP_FROM_WIN = 50;
var EXP_FROM_LOSS = 25;
var EXP_FROM_GOALS_MULT = 5;
var EXP_FROM_SAVED_MULT = 5;
var EXP_FROM_SHUTOUT = 25;

function CSocialManager(){
    
    var _iGoalMissedAsStrikerInAMatch;
    var _iThreeGoalsInARow;
    var _iShotsSaved;
    
    var _aTrophiesGainedInTheMatch;
    
    var _aAchievementsReached;
    
    this._init = function(){
        this._initExpLevels();
        this._initAchievements();
        this._initStats();
        
        this.resetMatchVar();
        this._resumeData();
        this._setAchievementsAlreadyReached();
        
    };
    
    this.resetAllStats = function(){
        this._initExpLevels();
        this._initAchievements();
        this._initStats();
        
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_CUR_EXP, s_iCurExp);
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_ACHIEVEMENTS, s_aCurAchiProgress);
        
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_MATCH_WON, s_iMatchWon);
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_MATCH_LOST, s_iMatchLost);
         s_oLocalStorage.saveGenericVar(LOCALSTORAGE_MATCH_COUNTRY_PICK, s_aCountryPickCounter);
        
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_STRIKER_GOALSCORED, s_iStrikerGoalScored);
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_STRIKER_GOALSAVED, s_iStrikerGoalSaved);
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_STRIKER_GOALMISSED, s_iStrikerGoalMissed);
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_PERFECTGAMES, s_iPerfectGames);
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_STRIKER_HOTZONES, s_aStrikerHotZones);
        
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_KEEPER_SHOTSSAVED, s_iKeeperShotsSaved);
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_KEEPER_SHOTSGOAL, s_iKeeperShotsGoal);
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_SHUTOUTS, s_iShutOuts);
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_KEEPER_HOTZONES, s_aKeeperHotZones);
        
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_QUIZ_RESULTS, s_aQuizResults);
    };
    
    this.resetMatchVar = function(){
        _iGoalMissedAsStrikerInAMatch = 0;
        _iThreeGoalsInARow = 0;
        _iShotsSaved = 0;
        
        _aTrophiesGainedInTheMatch = new Array();
    };
    
    this._resumeData = function(){
        s_iCurExp  = s_oLocalStorage.getGenericVar(LOCALSTORAGE_CUR_EXP) || s_iCurExp;
        s_aCurAchiProgress  = s_oLocalStorage.getGenericVar(LOCALSTORAGE_ACHIEVEMENTS) || s_aCurAchiProgress;
        
        s_iMatchWon = s_oLocalStorage.getGenericVar(LOCALSTORAGE_MATCH_WON) || s_iMatchWon;
        s_iMatchLost = s_oLocalStorage.getGenericVar(LOCALSTORAGE_MATCH_LOST) || s_iMatchLost;
        s_aCountryPickCounter = s_oLocalStorage.getGenericVar(LOCALSTORAGE_MATCH_COUNTRY_PICK) || s_aCountryPickCounter;
        
        s_iStrikerGoalScored = s_oLocalStorage.getGenericVar(LOCALSTORAGE_STRIKER_GOALSCORED) || s_iStrikerGoalScored;
        s_iStrikerGoalSaved = s_oLocalStorage.getGenericVar(LOCALSTORAGE_STRIKER_GOALSAVED) || s_iStrikerGoalSaved;
        s_iStrikerGoalMissed = s_oLocalStorage.getGenericVar(LOCALSTORAGE_STRIKER_GOALMISSED) || s_iStrikerGoalMissed;
        s_iPerfectGames = s_oLocalStorage.getGenericVar(LOCALSTORAGE_PERFECTGAMES) || s_iPerfectGames;
        s_aStrikerHotZones = s_oLocalStorage.getGenericVar(LOCALSTORAGE_STRIKER_HOTZONES) || s_aStrikerHotZones;
        
        s_iKeeperShotsSaved = s_oLocalStorage.getGenericVar(LOCALSTORAGE_KEEPER_SHOTSSAVED) || s_iKeeperShotsSaved;
        s_iKeeperShotsGoal = s_oLocalStorage.getGenericVar(LOCALSTORAGE_KEEPER_SHOTSGOAL) || s_iKeeperShotsGoal;
        s_iShutOuts = s_oLocalStorage.getGenericVar(LOCALSTORAGE_SHUTOUTS) || s_iShutOuts;
        s_aKeeperHotZones = s_oLocalStorage.getGenericVar(LOCALSTORAGE_KEEPER_HOTZONES) || s_aKeeperHotZones;
        
        s_aQuizResults = s_oLocalStorage.getGenericVar(LOCALSTORAGE_QUIZ_RESULTS) || s_aQuizResults;
    };
    
    ////EXPERIENCE
    this._initExpLevels = function(){
        var iStartXP = EXP_START;
        
        EXP_LEVELS.push(EXP_START);
        
        var iTotalXP = iStartXP;
        for(var i=1; i<EXP_NUM_LEVELS-1; i++){
            iStartXP *= EXP_FACTOR;
            
            var iRoundedXP = Math.round(iStartXP)
            EXP_LEVELS.push( iRoundedXP );
            
            iTotalXP += iRoundedXP;
        }

        s_iCurExp = 0;

        //console.log("iTotalXP:"+iTotalXP)
        //console.log(EXP_LEVELS)
    };
    
    this.getLevelByExp = function(iExp){
        var iSum = 0;
        var iCurLevel = 0;
        for(var i=0; i<=EXP_LEVELS.length; i++){
            iSum += EXP_LEVELS[i];
            iCurLevel++;
            if(iSum>iExp){
                break;
            }
        }
        
        return iCurLevel;
    };
    
    this.getTotalExpNeedForLevel = function(iLevel){
        if(iLevel>EXP_NUM_LEVELS){
            iLevel = EXP_NUM_LEVELS
        }
        var iTotalXP = 0;
        for(var i=0; i<iLevel-1; i++){
            iTotalXP += EXP_LEVELS[i];
        }
        
        return iTotalXP;
    };
    
    this.getPartialExp = function(iExp){
        var iCurLevel = this.getLevelByExp(iExp);
        
        var iExpForCurLevel = this.getTotalExpNeedForLevel(iCurLevel);
        
        var iPartialExp = iExp - iExpForCurLevel;
        
        return iPartialExp;
    };
    
    this.getLevelInfoByExp = function(iExp){
        var iCurLevel = s_oSocialManager.getLevelByExp(iExp);
        var iNextLevel = iCurLevel+1;
        if(iCurLevel >= EXP_NUM_LEVELS){
            var iPartialExp = 0;
            var iTotalExpForLevel = 0;
        }else {
            var iPartialExp = s_oSocialManager.getPartialExp(iExp);
            var iTotalExpForLevel = EXP_LEVELS[iCurLevel-1];
        }

        return {curlevel: iCurLevel, nextlevel: iNextLevel, partialexp:iPartialExp, totlevelexp: iTotalExpForLevel};
    };
    
    this.addExp = function(iQty){
        s_iCurExp += iQty;
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_CUR_EXP, s_iCurExp);
    };
    ////////////////////
    
    ////ACHIEVEMENTS
    this._initAchievements = function(){
        ACHIEVEMENTS_TARGET[ACHI_BRONZE_BOOT] = 50;
        ACHIEVEMENTS_TARGET[ACHI_SILVER_BOOT] = 250;
        ACHIEVEMENTS_TARGET[ACHI_GOLDEN_BOOT] = 1000;
        ACHIEVEMENTS_TARGET[ACHI_MATHKICKER] = 25;
        ACHIEVEMENTS_TARGET[ACHI_MATHOFTHEMATCH] = 100;
        ACHIEVEMENTS_TARGET[ACHI_MATHLEGEND] = 500;
        ACHIEVEMENTS_TARGET[ACHI_BRONZE_GLOVE] = 25;
        ACHIEVEMENTS_TARGET[ACHI_SILVER_GLOVE] = 100;
        ACHIEVEMENTS_TARGET[ACHI_GOLDEN_GLOVE] = 500;
        ACHIEVEMENTS_TARGET[ACHI_HAT_TRICK] = 3;
        ACHIEVEMENTS_TARGET[ACHI_GOAL_MACHINE] = 3;
        ACHIEVEMENTS_TARGET[ACHI_GOAL_PHENOM] = 15;
        ACHIEVEMENTS_TARGET[ACHI_GOAL_LEGEND] = 50;
        ACHIEVEMENTS_TARGET[ACHI_THE_FIRST] = 1;
        ACHIEVEMENTS_TARGET[ACHI_WORLD_CHAMPION] = 10;
        

        s_aCurAchiProgress = new Array();
        for(var i=0; i<ACHIEVEMENTS_TARGET.length; i++){
            s_aCurAchiProgress[i] = 0;
        }
        
        _aAchievementsReached = new Array();
        for(var i=0; i<ACHIEVEMENTS_TARGET.length; i++){
            _aAchievementsReached[i] = false;
        }
         
    };
    
    this._setAchievementsAlreadyReached = function(){
        for(var i=0; i<s_aCurAchiProgress.length; i++){
            if(s_aCurAchiProgress[i]>=ACHIEVEMENTS_TARGET[i]){
                _aAchievementsReached[i] = true;
            }
        }
    };
    
    this.increaseAchievement = function(iType, iQty){
        s_aCurAchiProgress[iType] += iQty;
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_ACHIEVEMENTS, s_aCurAchiProgress);

        if(!_aAchievementsReached[iType]){
            this._checkAchievementReached(iType);
        }
    };
    
    this.completeAchievement = function(iType){
        s_aCurAchiProgress[iType] = 1;
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_ACHIEVEMENTS, s_aCurAchiProgress);

        if(!_aAchievementsReached[iType]){
            this._checkAchievementReached(iType);
        }
    };
    
    this._checkAchievementReached = function(iType){
        if(s_aCurAchiProgress[iType] >= ACHIEVEMENTS_TARGET[iType]){
            _aAchievementsReached[iType] = true;

            s_iCurExp += ACHIEVEMENT_EXP[iType];
            s_oLocalStorage.saveGenericVar(LOCALSTORAGE_CUR_EXP, s_iCurExp);
            

            var oAchievementData = TEXT_LIST_ACHIEVEMENTS[iType];
            this.showPopUpMessage(oAchievementData);
            
            _aTrophiesGainedInTheMatch.push(iType);
        }
    };

   
    ///STATS 
    this._initStats = function(){
        for(var i=0; i<TEAM_LABEL.length; i++){
            s_aCountryPickCounter[i] = 0;
        }
        s_iMatchWon = 0;
        s_iMatchLost = 0;
        
        s_iStrikerGoalScored = 0;
        s_iStrikerGoalSaved = 0;
        s_iStrikerGoalMissed = 0;
        s_iPerfectGames = 0;
        s_aStrikerHotZones = new Array();
        for(var i=0; i<NUM_AREA_GOAL_FOR_STATS.h;i++){
            s_aStrikerHotZones[i] = new Array();
            for(var j=0; j<NUM_AREA_GOAL_FOR_STATS.w;j++){
                s_aStrikerHotZones[i][j] = {goal:0, saved:0};
            }
        }
        
        s_iKeeperShotsSaved = 0;
        s_iKeeperShotsGoal = 0;
        s_iShutOuts = 0;
        s_aKeeperHotZones = new Array();
        for(var i=0; i<NUM_AREA_GOAL_FOR_STATS.h;i++){
            s_aKeeperHotZones[i] = new Array();
            for(var j=0; j<NUM_AREA_GOAL_FOR_STATS.w;j++){
                s_aKeeperHotZones[i][j] = {goal:0, saved:0};
            }
        }
        
        s_aQuizResults = new Array();
        for(var i=0; i<MATH_OPERATION.length;i++){
            s_aQuizResults[i] = {right:0, wrong:0};
        }
    };
    
    this.getFavouriteCountry = function(){
        var iFavouriteTeamID;
        iFavouriteTeamID = indexOfMax(s_aCountryPickCounter);

        if(s_aCountryPickCounter[iFavouriteTeamID]===0){
            iFavouriteTeamID = null;
        }
        
        return iFavouriteTeamID;
    };
    
    this.getHotZonesPercent = function(aHotZones, bGoalParameter){
        var aMatrix = new Array();
        for(var i=0; i<NUM_AREA_GOAL_FOR_STATS.h;i++){
            aMatrix[i] = new Array();
            for(var j=0; j<NUM_AREA_GOAL_FOR_STATS.w;j++){
                //s_aStrikerHotZones[i][j]
                var iGoal = aHotZones[i][j].goal;
                var iSaved = aHotZones[i][j].saved;
                var iTot = iGoal + iSaved;
                var iPercent;
                if(bGoalParameter){
                    iPercent = iGoal / iTot * 100;
                }else {
                    iPercent = iSaved / iTot * 100;
                }
                
                if(isNaN(iPercent)){
                    aMatrix[i][j] = null; 
                }else {
                   aMatrix[i][j] = iPercent; 
                }
            }
        }
        
        return aMatrix;
    };
    
    this.getQuizPercent = function(){
        var iTotRight = 0;
        var iTotWrong = 0;
        
        var aQuizPercent = new Array();
        for(var i=0; i<s_aQuizResults.length; i++){
            iTotRight += s_aQuizResults[i].right;
            iTotWrong += s_aQuizResults[i].wrong;
            
            var iPartialTot = s_aQuizResults[i].right + s_aQuizResults[i].wrong;
            var iPercent = s_aQuizResults[i].right / iPartialTot * 100;
            if(isNaN(iPercent)){
                iPercent = 0;
            }
            aQuizPercent[i] = iPercent;
        }
        
        
        var iTot = iTotRight + iTotWrong;
        var iTotPercent = iTotRight/iTot*100;
        if(isNaN(iTotPercent)){
            iTotPercent = 0;
        }
        aQuizPercent.push(iTotPercent);
        
        return aQuizPercent;
    };
    
    //EVENTS
    this.onStrikerResult = function(oData){
        console.log(oData)
        
        switch(oData.res){
            case RES_GOAL:{
                    s_iStrikerGoalScored++;
                    s_oLocalStorage.saveGenericVar(LOCALSTORAGE_STRIKER_GOALSCORED, s_iStrikerGoalScored);
                    
                    var oCoord = this.getAreaShotStriker(oData.pos);
                    s_aStrikerHotZones[oCoord.row][oCoord.col].goal++;
                    s_oLocalStorage.saveGenericVar(LOCALSTORAGE_STRIKER_HOTZONES, s_aStrikerHotZones);
                    
                    this.increaseAchievement(ACHI_BRONZE_BOOT, 1);
                    this.increaseAchievement(ACHI_SILVER_BOOT, 1);
                    this.increaseAchievement(ACHI_GOLDEN_BOOT, 1);
                    
                    _iThreeGoalsInARow++;
                    if(_iThreeGoalsInARow === 3){
                        _iThreeGoalsInARow = 0;
                        this.increaseAchievement(ACHI_HAT_TRICK, 1);
                    }
                    
                    break;
            }
            case RES_SAVED:{
                    _iGoalMissedAsStrikerInAMatch++;
                    _iThreeGoalsInARow = 0;
                    
                    s_iStrikerGoalSaved++;
                    s_oLocalStorage.saveGenericVar(LOCALSTORAGE_STRIKER_GOALSAVED, s_iStrikerGoalSaved);
                    
                    var oCoord = this.getAreaShotStriker(oData.pos);
                    s_aStrikerHotZones[oCoord.row][oCoord.col].saved++;
                    s_oLocalStorage.saveGenericVar(LOCALSTORAGE_STRIKER_HOTZONES, s_aStrikerHotZones);
                    
                    break;
            }
            case RES_OUT:{
                    _iGoalMissedAsStrikerInAMatch++;
                    _iThreeGoalsInARow = 0;
                    
                    s_iStrikerGoalMissed++;
                    s_oLocalStorage.saveGenericVar(LOCALSTORAGE_STRIKER_GOALMISSED, s_iStrikerGoalMissed);
                    
                    break;
            }
            default :{
                    break;
            }
        }
    };
    
    this.onKeeperResult = function(oData){
        console.log(oData)
        
        switch(oData.res){
            case RES_GOAL:{
                    s_iKeeperShotsGoal++;
                    s_oLocalStorage.saveGenericVar(LOCALSTORAGE_KEEPER_SHOTSGOAL, s_iKeeperShotsGoal);
                    
                    var oCoord = this.getAreaShotKeeper(oData.pos);
                    s_aKeeperHotZones[oCoord.row][oCoord.col].goal++;
                    s_oLocalStorage.saveGenericVar(LOCALSTORAGE_KEEPER_HOTZONES, s_aKeeperHotZones);

                    break;
            }
            case RES_SAVED:{
                    _iShotsSaved++;
                    s_iKeeperShotsSaved++;
                    s_oLocalStorage.saveGenericVar(LOCALSTORAGE_KEEPER_SHOTSSAVED, s_iKeeperShotsSaved);
                    
                    var oCoord = this.getAreaShotKeeper(oData.pos);
                    s_aKeeperHotZones[oCoord.row][oCoord.col].saved++;
                    s_oLocalStorage.saveGenericVar(LOCALSTORAGE_KEEPER_HOTZONES, s_aKeeperHotZones);

                    this.increaseAchievement(ACHI_BRONZE_GLOVE, 1);
                    this.increaseAchievement(ACHI_SILVER_GLOVE, 1);
                    this.increaseAchievement(ACHI_GOLDEN_GLOVE, 1);
                    
                    break;
            }
            case RES_OUT:{
                    break;
            }
            default :{
                    break;
            }
        }
    };
    
    this.onQuizResult = function(oData){
        if(oData.isPlayer){
            var iOperation = MATH_OPERATION.indexOf(oData.type);
            var bResult = oData.res;

            this.increaseAchievement(ACHI_MATHKICKER, 1);
            this.increaseAchievement(ACHI_MATHOFTHEMATCH, 1);
            this.increaseAchievement(ACHI_MATHLEGEND, 1);
            
            if(bResult){
                s_aQuizResults[iOperation].right++;
            }else {
                s_aQuizResults[iOperation].wrong++;
            }

            s_oLocalStorage.saveGenericVar(LOCALSTORAGE_QUIZ_RESULTS, s_aQuizResults);
        }
    };
    
    this.onMatchResult = function(oData){
        console.log(oData);
        if(oData.res){
            s_iMatchWon++;
            s_oLocalStorage.saveGenericVar(LOCALSTORAGE_MATCH_WON, s_iMatchWon);
            
            if(oData.opponentgoals === 0){
                s_iShutOuts++;
                s_oLocalStorage.saveGenericVar(LOCALSTORAGE_SHUTOUTS, s_iShutOuts);
            }
            //{res: true, playergoals: 1, opponentgoals: 0, level: 1}
            
            this.completeAchievement(ACHI_THE_FIRST);
            
            if(oData.level > s_aCurAchiProgress[ACHI_WORLD_CHAMPION]){
                //s_aCurAchiProgress[ACHI_WORLD_CHAMPION] = oData.level;
                this.increaseAchievement(ACHI_WORLD_CHAMPION, 1);
            }
            
        }else{
            s_iMatchLost++;
            s_oLocalStorage.saveGenericVar(LOCALSTORAGE_MATCH_LOST, s_iMatchLost);
        }
        
        if(_iGoalMissedAsStrikerInAMatch===0){
            s_iPerfectGames++;
            s_oLocalStorage.saveGenericVar(LOCALSTORAGE_PERFECTGAMES, s_iPerfectGames);
        }
        
        if(oData.playergoals >= 5){
            this.increaseAchievement(ACHI_GOAL_MACHINE, 1);
            this.increaseAchievement(ACHI_GOAL_PHENOM, 1);
            this.increaseAchievement(ACHI_GOAL_LEGEND, 1);
        }
    };
    
    this.onCountryPick = function(iTeamID){
        s_aCountryPickCounter[iTeamID]++;
        
        s_oLocalStorage.saveGenericVar(LOCALSTORAGE_MATCH_COUNTRY_PICK, s_aCountryPickCounter);
    };
    
    
    ///UTILS
    this.showPopUpMessage = function(oAchievementData){
        playSound("achie_win", 1, false);

        var iScale = 1.4;

        var oSprite = s_oSpriteLibrary.getSprite("achievement_off_panel");
        var szTitle = oAchievementData[0];
        var szDesc = oAchievementData[1];
        var iX = CANVAS_WIDTH + oSprite.width/2;
        var iY = CANVAS_HEIGHT-s_iOffsetY-(oSprite.height/2*iScale) - 10;
        var oAchi = new CAchievementWidget(iX,iY,s_oStage, szTitle, szDesc);
        oAchi.setScale(iScale);
        oAchi.setProgress(1,1);
        
        var iLastX = CANVAS_WIDTH-s_iOffsetX-(oSprite.width/2*iScale) - 10;
        
        createjs.Tween.get(oAchi.getContainer()).to({x:iLastX}, 250, createjs.Ease.cubicOut)
                .wait(3000).to({alpha:0}, 1500).call(function(){
                    oAchi.unload();
                });
    };
    
    this.getAreaShotStriker = function(oPos){
        var iOffset = 30;
        var iStartX = -GOAL_AREA_SIZE_STRIKER.w/2;
        var iStartY = -GOAL_AREA_SIZE_STRIKER.h/2+iOffset;
        var iEndX = iStartX+GOAL_AREA_SIZE_STRIKER.w;
        var iEndY = iStartY+GOAL_AREA_SIZE_STRIKER.h;

        var oData = this._calculateMatrixIndex(oPos, iStartX, iEndX, iStartY, iEndY);
        
        return oData;
    };
    
    this.getAreaShotKeeper = function(oPos){
        var iStartX = -GOAL_AREA_SIZE_KEEPER.w/2;
        var iStartY = -GOAL_AREA_SIZE_KEEPER.h/2;
        var iEndX = iStartX+GOAL_AREA_SIZE_KEEPER.w;
        var iEndY = iStartY+GOAL_AREA_SIZE_KEEPER.h;

        var oData = this._calculateMatrixIndex(oPos, iStartX, iEndX, iStartY, iEndY);
        
        return oData;
    };
    
    this._calculateMatrixIndex = function(oPos, iStartX, iEndX, iStartY, iEndY){
        var iCol = linearFunction(oPos.x, iStartX, iEndX, 0, NUM_AREA_GOAL_FOR_STATS.w);
        iCol = Math.floor(iCol);
        if(iCol > NUM_AREA_GOAL_FOR_STATS.w-1){
            iCol = NUM_AREA_GOAL_FOR_STATS.w-1;
        }else if(iCol < 0) {
            iCol = 0;
        }

        var iRow = linearFunction(oPos.y, iStartY, iEndY, 0, NUM_AREA_GOAL_FOR_STATS.h);
        iRow = Math.floor(iRow);
        if(iRow > NUM_AREA_GOAL_FOR_STATS.h-1){
            iRow = NUM_AREA_GOAL_FOR_STATS.h-1;
        }else if(iRow < 0) {
            iRow = 0;
        }

        //iRow = 1

        //var iArea = iRow*NUM_AREA_GOAL_FOR_STATS.w + iCol;

        //console.log("iCol:"+ iCol, "iRow:"+iRow);
        //console.log(oPos);

        return {row: iRow, col:iCol};
    };
    
    this.getShotsSavedInThisMatch = function(){
        return _iShotsSaved;
    };
    
    this.getTrophiesGainedInThisMatch = function(){
        return _aTrophiesGainedInTheMatch;
    };
    
    this._init();
};



