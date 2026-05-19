var s_iLastLevel = 1;
var s_iTeamSelected;

var LOCALSTORAGE_CUR_EXP = "cur_exp";
var LOCALSTORAGE_ACHIEVEMENTS = "achievements";

///STATS PAGE 0
var LOCALSTORAGE_MATCH_WON = "match_won";
var LOCALSTORAGE_MATCH_LOST = "match_lost";
var LOCALSTORAGE_MATCH_COUNTRY_PICK = "country_pick";
///STATS PAGE 1
var LOCALSTORAGE_STRIKER_GOALSCORED = "striker_goal_scored";
var LOCALSTORAGE_STRIKER_GOALSAVED = "striker_goal_saved";
var LOCALSTORAGE_STRIKER_GOALMISSED = "striker_goal_missed";
var LOCALSTORAGE_PERFECTGAMES = "perfect_games";
var LOCALSTORAGE_STRIKER_HOTZONES = "striker_hot_zones";
///STATS PAGE 2
var LOCALSTORAGE_KEEPER_SHOTSSAVED = "keeper_shots_saved";
var LOCALSTORAGE_KEEPER_SHOTSGOAL = "keeper_shots_goal";
var LOCALSTORAGE_SHUTOUTS = "shutouts";
var LOCALSTORAGE_KEEPER_HOTZONES = "keeper_hot_zones";
///STATS PAGE 3
var LOCALSTORAGE_QUIZ_RESULTS = "quiz_results";

function CLocalStorage(szName){
    var _bLocalStorage = true;

    this._init = function(szName){   
        try{
            var bFlag = window.localStorage.getItem(szName);
            this.resetData();
            if(bFlag !== null && bFlag !== undefined){  
                this.loadData();
            }
        }catch(e){
            this.resetData();
        }        
        
    };

    this.isUsed = function(){
        var iLevel = localStorage.getItem(szName+"level");
        if(iLevel === null){
            return false;
        }else{
            return true;
        }
    };

    this.isAvailable = function(){
        try{
            window.localStorage.setItem("ls_available","ok");
        }catch(evt){
            _bLocalStorage = false;
        }
        
        return _bLocalStorage;
    };

    this.resetData = function(){
        s_iLastLevel = 1;
        s_iTeamSelected = null;
    };

    this.clearAllMatches = function(){
        for(var i=1;i<NUM_MATCHES+1;i++){
            localStorage.removeItem(szName+"match_"+i);
        }
        localStorage.removeItem(szName+"team");
        localStorage.removeItem(szName+"level");
        localStorage.removeItem(szName+"team");
    };

    this.clearAllStats = function(){
        s_oSocialManager.resetAllStats();
    };

    this.clearAllItem = function(){
        this.clearAllMatches();
        this.clearAllStats();
    };

    this.saveMatch = function(iMatch,iOpponent,szResult,iLevelScore,iScore){
        localStorage.setItem(szName+"match_"+iMatch,JSON.stringify({opponent:iOpponent,result:szResult,score:iScore,level_score:iLevelScore}));
    };

    this.saveTeam = function(iTeam){
        s_iTeamSelected = iTeam;
        localStorage.setItem(szName+"team",s_iTeamSelected);
    };

    this.saveLevel = function(iLevel){
        if(iLevel > s_iLastLevel){
            s_iLastLevel = iLevel;
            localStorage.setItem(szName+"level",s_iLastLevel);
        }
    };


    this.getStoredTeamSelected = function(){
        return localStorage.getItem(szName+"team");
    };

    this.getMatches = function(){
        if(localStorage.getItem(szName+"match_1") === null){
            return null;
        }else{
            var aMatches = new Array();
            for(var i=1;i<NUM_MATCHES+1;i++){
                aMatches.push(JSON.parse(localStorage.getItem(szName+"match_"+i)));
            }
            
            return aMatches;
        }
    };

    this.getLastLevel = function(){
        var iLevel = localStorage.getItem(szName+"level");
        if(iLevel === null){
            return 1;
        }else{
            return iLevel;
        }
    };

    this.getScoreMatch = function(iLevel){
        var oItem = localStorage.getItem(szName+"match_"+iLevel);
        return JSON.parse(oItem).level_score;
    };

    this.getScoreTillLevel = function(iLevel){
        if(!this.isAvailable()){
            return 0;
        }
        
        var iScore = 0;
        for(var i=0;i<iLevel-1;i++){
            iScore += this.getScoreMatch(i+1);
        }
        
        return iScore;
    };

    this.saveGenericVar = function(szKey, szValue){
        var oData = JSON.stringify(szValue)
        localStorage.setItem(szName+szKey,oData);
    };

    this.getGenericVar = function(szKey){
        var oItem = localStorage.getItem(szName+szKey);
        
        return JSON.parse(oItem);
    };

    /*
    this.saveData = function(){
        var oJSONData = {};
        oJSONData[LOCALSTORAGE_TIMES] = s_aTimeScore;
        oJSONData[LOCALSTORAGE_TOTALSCORE] = s_iTotalScore;

        //ADD MORE JSON THIS WAY
        //var randB = "randomboolean";
        //oJSONData[randB] = true;
        //oJSONData["anothernestedjson"] = {pippo: 3, ciccio: 10};
        

        window.localStorage.setItem(szName, JSON.stringify(oJSONData));
        
    };

    this.loadData = function(){
        var szData = JSON.parse(window.localStorage.getItem(szName));
        
        var aLoadedScore = szData[LOCALSTORAGE_TIMES];
        s_aTimeScore = new Array();
        for(var i=0; i<aLoadedScore.length; i++){
            s_aTimeScore[i] = parseInt(aLoadedScore[i]);
        }
        
        var iLoadedScore = szData[LOCALSTORAGE_TOTALSCORE];
        s_iTotalScore = parseInt(iLoadedScore);
        
    };
    */
    this._init(szName);

}