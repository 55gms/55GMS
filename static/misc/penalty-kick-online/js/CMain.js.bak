function CMain(oData) {
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    
    var _oData;
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oLevelMenu;
    var _oSelectMenu;

    this.initContainer = function () {
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(canvas);
        createjs.Touch.enable(s_oStage);
        s_oStage.preventSelection = false;

        s_bMobile = jQuery.browser.mobile;
        if (s_bMobile === false) {
            s_oStage.enableMouseOver(20);
            $('body').on('contextmenu', '#canvas', function (e) {
                return false;
            });
            FPS = FPS_DESKTOP;
            FPS_TIME = 1000 / FPS;
            PHYSICS_STEP = 1 / (FPS * STEP_RATE);
            ROLL_BALL_RATE = 60 / FPS;
        } else {
            BALL_VELOCITY_MULTIPLIER = 0.8;
        }

        s_iPrevTime = new Date().getTime();

        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;

        if (navigator.userAgent.match(/Windows Phone/i)) {
            DISABLE_SOUND_MOBILE = true;
        }

        s_oSpriteLibrary = new CSpriteLibrary();
        
        s_oLocalStorage = new CLocalStorage(LOCALSTORAGE_STRING);
        
        s_oNetworkManager = new CNetworkManager();
        
        s_oSocialManager = new CSocialManager();
        
        s_oCMGApi = new CCMGApi();
        
        //ADD PRELOADER
        _oPreloader = new CPreloader();

        _bUpdate = true;
    };

    this.soundLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);
    };
    
    this._initSounds = function(){
        s_aSoundsInfo = new Array();
        s_aSoundsInfo.push({path: './sounds/',filename:'drop_bounce_grass',loop:false,volume:1, ingamename: 'drop_bounce_grass'});
        s_aSoundsInfo.push({path: './sounds/',filename:'click',loop:false,volume:1, ingamename: 'click'});
        s_aSoundsInfo.push({path: './sounds/',filename:'kick',loop:false,volume:1, ingamename: 'kick'});
        s_aSoundsInfo.push({path: './sounds/',filename:'ball_saved',loop:false,volume:1, ingamename: 'ball_saved'});
        s_aSoundsInfo.push({path: './sounds/',filename:'goal_keeper',loop:false,volume:1, ingamename: 'goal_keeper'});
        s_aSoundsInfo.push({path: './sounds/',filename:'goal_striker',loop:false,volume:1, ingamename: 'goal_striker'});
        s_aSoundsInfo.push({path: './sounds/',filename:'keep_ball',loop:false,volume:1, ingamename: 'keep_ball'});
        s_aSoundsInfo.push({path: './sounds/',filename:'pole',loop:false,volume:1, ingamename: 'pole'});
        s_aSoundsInfo.push({path: './sounds/',filename:'win',loop:false,volume:1, ingamename: 'win'});
        s_aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        s_aSoundsInfo.push({path: './sounds/',filename:'crowd',loop:true,volume:1, ingamename: 'crowd'});
        s_aSoundsInfo.push({path: './sounds/',filename:'hurryup',loop:true,volume:1, ingamename: 'hurryup'});
        
        s_aSoundsInfo.push({path: './sounds/',filename:'totalwinning',loop:true,volume:1, ingamename: 'totalwinning'});
        s_aSoundsInfo.push({path: './sounds/',filename:'level_up',loop:false,volume:1, ingamename: 'level_up'});
        s_aSoundsInfo.push({path: './sounds/',filename:'achie_win',loop:false,volume:1, ingamename: 'achie_win'});
        
        RESOURCE_TO_LOAD += s_aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<s_aSoundsInfo.length; i++){
            this.tryToLoadSound(s_aSoundsInfo[i], false);
        }
        
        Howler.volume(0.5);
        
    };  
    
    this.tryToLoadSound = function(oSoundInfo, bDelay){
        
       setTimeout(function(){        
            s_aSounds[oSoundInfo.ingamename] = new Howl({ 
                                                            src: [oSoundInfo.path+oSoundInfo.filename+'.mp3'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: oSoundInfo.loop, 
                                                            volume: oSoundInfo.volume,
                                                            onload: s_oMain.soundLoaded,
                                                            onloaderror: function(szId,szMsg){
                                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                         s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                                                                                         break;
                                                                                     }
                                                                                }
                                                                        },
                                                            onplayerror: function(szId) {
                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                          s_aSounds[s_aSoundsInfo[i].ingamename].once('unlock', function() {
                                                                                            s_aSounds[s_aSoundsInfo[i].ingamename].play();
                                                                                            if(s_aSoundsInfo[i].ingamename === "soundtrack" && s_oGame !== null){
                                                                                                setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
                                                                                            }

                                                                                          });
                                                                                         break;
                                                                                     }
                                                                                 }
                                                                       
                                                            } 
                                                        });

            
        }, (bDelay ? 200 : 0) );
    };
    
    this._loadImages = function () {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);

        s_oSpriteLibrary.addSprite("logo", "./sprites/logo.png");
        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("but_local","./sprites/but_local.png");
        s_oSpriteLibrary.addSprite("but_multiplayer","./sprites/but_multiplayer.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("ball", "./sprites/ball.png");
        s_oSpriteLibrary.addSprite("ball_shadow", "./sprites/ball_shadow.png");
        s_oSpriteLibrary.addSprite("start_ball", "./sprites/start_ball.png");
        s_oSpriteLibrary.addSprite("hand_touch", "./sprites/hand_touch.png");
        s_oSpriteLibrary.addSprite("cursor", "./sprites/cursor.png");
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("msg_box_small", "./sprites/msg_box_small.png");
        s_oSpriteLibrary.addSprite("bg_levelselect", "./sprites/bg_levelselect.jpg");
        s_oSpriteLibrary.addSprite("but_level", "./sprites/but_level.png");
        s_oSpriteLibrary.addSprite("but_info", "./sprites/but_info.png");
        s_oSpriteLibrary.addSprite("logo_ctl", "./sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_no", "./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_level_locked", "./sprites/but_level_locked.png");
        s_oSpriteLibrary.addSprite("but_next", "./sprites/but_next.png");
        s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_restart_small", "./sprites/but_restart_small.png");
        s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("but_delete_savings", "./sprites/but_delete_savings.png");
        s_oSpriteLibrary.addSprite("ball_kick", "./sprites/ball_kick.png");
        s_oSpriteLibrary.addSprite("score_side_bg", "./sprites/score_side_bg.png");
        
        
        s_oSpriteLibrary.addSprite("empty_flag", "./sprites/social/empty_flag.png");
        for(var k=0;k<NUM_TEAMS;k++){
            s_oSpriteLibrary.addSprite("flag_"+k, "./sprites/flags/flag_"+k+".png");
        }
        
        
        //PENALTY KICKS
        s_oSpriteLibrary.addSprite("bg_game_striker", "./sprites/striker/bg_game_striker.jpg");
        s_oSpriteLibrary.addSprite("goal_0", "./sprites/striker/goal_0.png");
        
        for(var t=0;t<22;t++){
            for(var s=0;s<=30;s++){
                s_oSpriteLibrary.addSprite("player_"+t+"_"+s, "./sprites/striker/player/player_"+t+"_"+s+".png");
            }
            
        }
        
        var k=0;
        for(var n=0; n<SPRITE_NAME_GOALKEEPER.length; n++){
            for(var i=0;i<NUM_SPRITE_GOALKEEPER[n];i++){
                s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[n]+"_"+k+"_"+i, "./sprites/striker/goalkeeper/"+SPRITE_NAME_GOALKEEPER[n]+"/"+SPRITE_NAME_GOALKEEPER[n]+"_"+k+"_"+i+".png");
            }
        }   

        //GOALKEEPER
        s_oSpriteLibrary.addSprite("bg_game_gk", "./sprites/goalkeeper/bg_game_gk.jpg");
        s_oSpriteLibrary.addSprite("gloves", "./sprites/goalkeeper/gloves.png");
        s_oSpriteLibrary.addSprite("goal_1", "./sprites/goalkeeper/goal_1.png");
        s_oSpriteLibrary.addSprite("help_mouse", "./sprites/goalkeeper/help_mouse.png");
        s_oSpriteLibrary.addSprite("help_touch", "./sprites/goalkeeper/help_touch.png");
        for(var k=0;k<NUM_TEAMS;k++){
            s_oSpriteLibrary.addSprite("opponent_"+k, "./sprites/goalkeeper/opponent_"+k+".png");
        }

        s_oSpriteLibrary.addSprite("but_generic", "./sprites/but_generic.png");
        s_oSpriteLibrary.addSprite("msg_box_narrow", "./sprites/msg_box_narrow.png");
        s_oSpriteLibrary.addSprite("but_correct", "./sprites/but_correct.png");
        s_oSpriteLibrary.addSprite("but_incorrect", "./sprites/but_incorrect.png");

        s_oSpriteLibrary.addSprite("bonus_shot", "./sprites/bonus_shot.png");
        s_oSpriteLibrary.addSprite("label_info", "./sprites/label_info.png");

        s_oSpriteLibrary.addSprite("end_panel", "./sprites/end_panel.png");
        s_oSpriteLibrary.addSprite("end_summary_panel", "./sprites/social/end_summary_panel.png");

        ///SOCIAL
        s_oSpriteLibrary.addSprite("menu_info_panel", "./sprites/social/menu_info_panel.png");
        s_oSpriteLibrary.addSprite("menu_info_panel_small", "./sprites/social/menu_info_panel_small.png");
        s_oSpriteLibrary.addSprite("label_name", "./sprites/social/label_name.png");
        s_oSpriteLibrary.addSprite("but_refresh", "./sprites/social/but_refresh.png");
        s_oSpriteLibrary.addSprite("label_cur_level", "./sprites/social/label_cur_level.png");
        s_oSpriteLibrary.addSprite("experience_bar_bg", "./sprites/social/experience_bar_bg.png");
        s_oSpriteLibrary.addSprite("experience_bar_fill", "./sprites/social/experience_bar_fill.png");
        s_oSpriteLibrary.addSprite("experience_bar_frame", "./sprites/social/experience_bar_frame.png");
        s_oSpriteLibrary.addSprite("but_achievements", "./sprites/social/but_achievements.png");
        s_oSpriteLibrary.addSprite("but_stats", "./sprites/social/but_stats.png");
        s_oSpriteLibrary.addSprite("achievement_off_panel", "./sprites/social/achievement_off_panel.png");
        s_oSpriteLibrary.addSprite("achievement_on_panel", "./sprites/social/achievement_on_panel.png");
        for(var i=0; i<1; i++){
            s_oSpriteLibrary.addSprite("achi"+i+"_off", "./sprites/social/achievements/achi"+i+"_off.png");
            s_oSpriteLibrary.addSprite("achi"+i+"_on", "./sprites/social/achievements/achi"+i+"_on.png");
        }
        for(var i=0; i<4; i++){
            s_oSpriteLibrary.addSprite("panel_stat_"+i, "./sprites/social/panel_stat_"+i+".png");
        }
        s_oSpriteLibrary.addSprite("name_panel", "./sprites/social/name_panel.png");
        s_oSpriteLibrary.addSprite("but_right", "./sprites/social/but_right.png");
        s_oSpriteLibrary.addSprite("but_left", "./sprites/social/but_left.png");
        s_oSpriteLibrary.addSprite("stat_simple_bg", "./sprites/social/stat_simple_bg.png");
        

        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();

        s_oSpriteLibrary.loadSprites();
    };

    this._onImagesLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);
    };

    this._onAllImagesLoaded = function () {

    };
    
    this.preloaderReady = function () {
        _iCurResource = 0;

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            this._initSounds();
        }

        this._loadImages();
        _bUpdate = true;
    };
    
    
    this._onRemovePreloader = function(){
        _oPreloader.unload();
        
        this.gotoMenu();

        s_oSoundtrack = playSound("soundtrack",SOUNDTRACK_GENERAL_VOLUME,true);
    };
    
    this.gotoMenu = function () {
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
    
    this.gotoLevelPanel = function(){
        _oLevelMenu = new CLevelMenu();
        _iState = STATE_CHOOSE_LEVEL;
    };
    
    this.gotoSelectTeam = function(){
        _oSelectMenu = new CSelectTeamMenu();
        
        _iState = STATE_CHOOSE_TEAM;
    };
    
    this.gotoSelectTeamMulti = function(){
        _oSelectMenu = new CSelectTeamMenu();
        
        _iState = STATE_CHOOSE_TEAM;
    };
    
    this.gotoGame = function(iLevel){
        s_oGame = new CGameSingle(_oData,iLevel);
        s_oGame.addEventListener(ON_STRIKER_RESULT, s_oSocialManager.onStrikerResult, s_oSocialManager);
        s_oGame.addEventListener(ON_KEEPER_RESULT, s_oSocialManager.onKeeperResult, s_oSocialManager);
        s_oGame.addEventListener(ON_QUIZ_RESULT, s_oSocialManager.onQuizResult, s_oSocialManager);
        s_oGame.addEventListener(ON_MATCH_RESULT, s_oSocialManager.onMatchResult, s_oSocialManager);
        
        _iState = STATE_GAME;
    };
    
    this.gotoGameWithBot = function(iLevel){
        s_oGame = new CGameSingleWithBot(_oData,iLevel);
        _iState = STATE_GAME;
    };
    
    this.gotoGameMulti = function(){
        s_oGame = new CGameMulti(_oData,1);
        s_oGame.addEventListener(ON_STRIKER_RESULT, s_oSocialManager.onStrikerResult, s_oSocialManager);
        s_oGame.addEventListener(ON_KEEPER_RESULT, s_oSocialManager.onKeeperResult, s_oSocialManager);
        s_oGame.addEventListener(ON_QUIZ_RESULT, s_oSocialManager.onQuizResult, s_oSocialManager);
        s_oGame.addEventListener(ON_MATCH_RESULT, s_oSocialManager.onMatchResult, s_oSocialManager);
        
        _iState = STATE_GAME;
    };

    this.gotoOfflineMenu = function(){
        _iState = STATE_OFFLINE;
        
        var oOfflineMenu = new COfflineMenu();
    };

    this.gotoHelp = function () {
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
    
    this.stopUpdateNoBlock = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
    };

    this.startUpdateNoBlock = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false; 
    };

    this.stopUpdate = function(){
        /*
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        */
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            Howler.mute(true);
        }
        
    };

    this.startUpdate = function(){
        /*
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
        */
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(s_bAudioActive){
                Howler.mute(false);
            }
        }
        
    };

    this._update = function (event) {
        if (_bUpdate === false) {
            return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;

        if (s_iCntTime >= 1000) {
            s_iCurFps = s_iCntFps;
            s_iCntTime -= 1000;
            s_iCntFps = 0;
        }

        if (_iState === STATE_GAME) {
            s_oGame.update();
        }

        s_oStage.update(event);

    };

    s_oMain = this;

    _oData = oData;
    ENABLE_FULLSCREEN = false;
    ENABLE_CHECK_ORIENTATION = false;
    
    GAME_PLAYERIO_ID = oData.playerio_id;
    
    GOAL_SCORED = 10;
    GOAL_MISSED = -5;
    GOAL_SAVED = 5;
    GOAL_SUFFERED = oData.score_goal_opponent;
   
    //GAME_PLAYERIO_ID = "coolmath-penalty-bwakn52hoe65kpjx1jggq";
    
    AREAS_INFO = [  {id: 0, probability: 100}, {id: 1, probability: 80}, {id: 2, probability: 60},{id: 3, probability: 80}, {id: 4, probability: 100}, 
                    {id: 5, probability: 75}, {id: 6, probability: 60}, {id: 7, probability: 50}, {id: 8, probability: 60}, {id: 9, probability: 75}, 
                    {id: 10, probability: 80}, {id: 11, probability: 65},{id: 12, probability: 70}, {id: 13, probability: 65}, {id: 14, probability: 80}]; 
                    ////PROBABILITY AREA GOALS START TO LEFT UP TO RIGHT DOWN 
                    //0 1 2 3 4
                    //5 6 7 8 9
                    //10 11 12 13 14
    
    s_iCurLang = getCookie("cmg_translation");
    //s_iCurLang = LANG_FR;
    refreshLanguage();
    
    this.initContainer();
}
var s_bMobile;
var s_bAudioActive = true;
var s_bFullscreen = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_oPhysicsController;
var s_iCanvasResizeHeight;
var s_iCanvasResizeWidth;
var s_iCanvasOffsetHeight;
var s_iCanvasOffsetWidth;

var s_oDrawLayer;
var s_oStage;
var s_oCanvas;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundtrack = null;


var s_aSounds;
var s_aSoundsInfo;
var s_oLocalStorage;
var s_oSocialManager;

var s_oNetworkManager;
var s_bMultiplayer;
var s_bPlayWithBot;
var s_oGame;

var s_iCurLang = LANG_EN;