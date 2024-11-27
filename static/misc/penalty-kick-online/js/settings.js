var CANVAS_WIDTH = 1280;
var CANVAS_HEIGHT = 640;

var CANVAS_WIDTH_HALF = CANVAS_WIDTH/2;
var CANVAS_HEIGHT_HALF = CANVAS_HEIGHT/2;
var START_HAND_SWIPE_POS;
var END_HAND_SWIPE_POS;

var EDGEBOARD_X = 100;
var EDGEBOARD_Y = 40;

var SOUNDTRACK_VOLUME_IN_GAME = 0;
var SOUNDTRACK_GENERAL_VOLUME = 0.6;
var CROWD_GENERAL_VOLUME = 0.75;
var DISABLE_SOUND_MOBILE = false;
var PRIMARY_FONT = "robotobold";
var SECONDARY_FONT = "arialbold";


var GAME_NAME = "penaltychallenge_multiplayer";
var MULTIPLAYER_TEST_LOCAL = false;

var FPS = 60;
var FPS_DESKTOP = 60;

var FPS_TIME = 1000 / FPS_DESKTOP;

///////////CUSTOMIZATION PARAMETERS
var TIME_PER_QUIZ = [13000,12000,11000,10000,9000,9000];                        /////Time a player has to answer a math question (expressed in milliseconds), the 6th is the time for subsequent extra shots

var TIME_PER_MOVE = 7000;                  /////Time a player has to do a move in multiplayer game (expressed in milliseconds), 
                                            /////if the player misses the time, the cpu will do a wrong shot instead
var TIME_HURRYUP_WARNING = 3000;           ////Warning alert of the timer. Below this time (in milliseconds), a player will be notified.

var GAME_PLAYERIO_ID = "penalty-kick-math-bm6aina5bkgfkvrfsjlijq";     ////Unique ID of player.io game. You need to exchange with your own
////////////////////////////////////////////

var ROLL_BALL_RATE = 60 / FPS;

var STATE_LOADING = 0;
var STATE_MENU = 1;
var STATE_HELP = 2;
var STATE_CHOOSE_LEVEL = 3;
var STATE_CHOOSE_TEAM = 4;
var STATE_GAME = 5;
var STATE_OFFLINE    = 6;

var ON_MOUSE_DOWN = 0;
var ON_MOUSE_UP = 1;
var ON_MOUSE_OVER = 2;
var ON_MOUSE_OUT = 3;
var ON_DRAG_START = 4;
var ON_DRAG_END = 5;
var ON_TWEEN_ENDED = 6;
var ON_BUT_NO_DOWN = 7;
var ON_BUT_YES_DOWN = 8;
var ON_ALERT_SKIP = 9;
var ON_NEXT = 10;
var ON_RESTART = 11;
var ON_BACK_MENU = 12;

var SHOOT_STATE_WAITING = 0;
var SHOOT_STATE_SELECTED = 1;
var SHOOT_STATE_ANIM = 2;
var SHOOT_STATE_END = 3;
var SHOOT_STATE_CHANGING_TURN = 4;


var MATH_QUESTION_ADDITION = 0;
var MATH_QUESTION_SUBTRACTION = 1;
var MATH_QUESTION_MULTIPLICATION = 2;
var MATH_QUESTION_DIVISION = 3;
var MATH_OPERATION = ["+", "-", "x", "÷"];

var ON_TIMER_END = 0;
var ON_LAST_TIMER_END = 1;

var ON_ANSWER = 0;
var ON_QUIZ_TIMEOUT = 1;

var QUIZ_SHOW_COUNTDOWN = 1000;
var TIME_SHOW_ANSWER = 1500;
var TIME_SHOW_ANSWER_EXTENDED = 3500;

var STEP_RATE = 1.5;

var TEXT_SIZE = [80, 100, 130];


var MS_TIME_SWIPE_END = 1000;

var MS_TIME_SWIPE_START = 3000;

var MS_TIME_FADE_HELP_TEXT = 500;

var TEXT_EXCELLENT_COLOR = ["#fff", "#5d96fe"];

var TEXT_COLOR = "#ffffff";
var TEXT_COLOR_1 = "#ff2222";



var OUTLINE_WIDTH = 1.5;

var TIME_INTERVAL_STROBE = 0.2;

var PHYSICS_ACCURACY = 3;

var MOBILE_OFFSET_GLOVES_Y = -70;
var DESKTOP_OFFSET_GLOVES_Y = -70;

var BALL_VELOCITY_MULTIPLIER = 1;

var PHYSICS_STEP = 1 / (FPS * STEP_RATE);

var MS_WAIT_SHOW_GAME_OVER_PANEL = 250;

var STATE_INIT = 0;
var STATE_PLAY = 1;
var STATE_FINISH = 2;
var STATE_PAUSE = 3;

var IDLE = 0;
var RIGHT = 1;
var LEFT = 2;
var CENTER_DOWN = 3;
var CENTER_UP = 4;
var LEFT_DOWN = 5;
var RIGHT_DOWN = 6;

var CENTER = 7;
var SIDE_LEFT = 8;
var SIDE_RIGHT = 9;
var SIDE_LEFT_UP = 10;
var SIDE_RIGHT_UP = 11;
var SIDE_LEFT_DOWN = 12;
var SIDE_RIGHT_DOWN = 13;
var LEFT_UP = 14;
var RIGHT_UP = 15;

var ANIM_GOAL_KEEPER_FAIL_EXCLUSION_LIST = [
    ///////TOP AREA
    [LEFT_UP, LEFT, SIDE_LEFT_UP, SIDE_LEFT],                                   ///AREA 0
    [LEFT_UP, LEFT, SIDE_LEFT_UP, SIDE_LEFT, CENTER_UP],                        ///AREA 1
    [CENTER_UP, CENTER, SIDE_LEFT_UP, SIDE_RIGHT_UP, SIDE_LEFT, SIDE_RIGHT],    ///AREA 2
    [RIGHT_UP, RIGHT, SIDE_RIGHT_UP, SIDE_RIGHT, CENTER_UP],                    ///AREA 3
    [RIGHT_UP, RIGHT, SIDE_RIGHT_UP, SIDE_RIGHT],                               ///AREA 4
    ///////CENTER AREA
    [LEFT_UP, LEFT, SIDE_LEFT_UP, SIDE_LEFT, SIDE_LEFT_DOWN, LEFT_DOWN],        ///AREA 5
    [LEFT_UP, LEFT, SIDE_LEFT_UP, SIDE_LEFT, SIDE_LEFT_DOWN],                   ///AREA 6
    [CENTER_UP, CENTER, SIDE_LEFT_UP, SIDE_RIGHT_UP, CENTER_DOWN, SIDE_RIGHT, SIDE_LEFT],    ///AREA 7
    [RIGHT_UP, RIGHT, SIDE_RIGHT_UP, SIDE_RIGHT, SIDE_RIGHT_DOWN],              ///AREA 8
    [RIGHT_UP, RIGHT, SIDE_RIGHT_UP, SIDE_RIGHT, SIDE_RIGHT_DOWN, RIGHT_DOWN],  ///AREA 9
    ///////BOTTOM AREA
    [LEFT_DOWN, LEFT, SIDE_LEFT_DOWN],                                          ///AREA 10
    [LEFT_DOWN, LEFT, SIDE_LEFT_DOWN, SIDE_LEFT, SIDE_LEFT_UP],                               ///AREA 11
    [CENTER_DOWN, CENTER, CENTER_UP, SIDE_RIGHT, SIDE_LEFT, SIDE_RIGHT_DOWN, SIDE_LEFT_DOWN],    ///AREA 12
    [RIGHT_DOWN, RIGHT, SIDE_RIGHT_DOWN, SIDE_RIGHT, SIDE_RIGHT_UP],                           ///AREA 13
    [RIGHT_DOWN, RIGHT, SIDE_RIGHT_DOWN],                                       ///AREA 14
];

//var ANIM_GOAL_KEEPER_FAIL_ALT = [LEFT, RIGHT, LEFT_DOWN, RIGHT_DOWN];

var NUM_SPRITE_PLAYER = 31;

var SPRITE_NAME_GOALKEEPER = [  "gk_idle", "gk_save_right", "gk_save_left", "gk_save_center_down", "gk_save_center_up", "gk_save_down_left", "gk_save_down_right",
                                "gk_save_center", "gk_save_side_left", "gk_save_side_right", "gk_save_side_up_left", "gk_save_side_up_right",
                                "gk_save_side_low_left", "gk_save_side_low_right", "gk_save_up_left", "gk_save_up_right"
];

var NUM_SPRITE_GOALKEEPER = [   24, 34, 34, 51, 25, 34, 34, 
                                25, 30, 30, 30, 30,
                                51, 51, 36, 36
];

var OFFSET_CONTAINER_GOALKEEPER = [ {x: 0, y: 0}, {x: 15, y: -29}, {x: -360, y: -29}, {x: -15, y: -15}, {x: -20, y: -85}, {x: -355, y: 20}, {x: 21, y: 20},
                                    {x: 10, y: -10}, {x: -140, y: -30}, {x: 10, y: -30}, {x: -120, y: -75}, {x: 14, y: -75}, 
                                    {x:-140, y: -10}, {x: 30, y: -10}, {x:-430, y: -56}, {x:-8, y: -56}, 
];

var ORIGIN_POINT_IMPACT_ANIMATION = [   {x: null, y: null}, {x: 295.74, y: 3.76}, {x: -324.82, y: 3.76}, {x: 4.8, y: /*84*/null}, {x: 5, y: /*-131*/null}, {x: -354, y: null}, {x: 334.5, y: /*95*/null},
                                        {x: 4.8, y: /*3.76*/null}, {x: -198.77, y: /*40.5*/null}, {x: 189, y: /*22*/null}, {x:-208.4/*null*/, y: /*-88*/null}, {x: 189, y: /*-75*/null},
                                        {x: -150, y: /*84*/null}, {x: 101.8, y: /*95*/null}, {x: -344, y: -88}, {x: 315, y: -88}    
]

var BALL_MASS = 0.5;



var BALL_LINEAR_DAMPING = 0.2;

var OBJECT;

var TIME_TRY_TO_SHOT_BALL_OPPONENT = 0.7;

var STRIKER_START_BALL_POS = {x: CANVAS_WIDTH_HALF + 55, y: CANVAS_HEIGHT_HALF + 168}; 

var START_POS_FLAG = {x: 277, y: 268};

var FLAG_ADDED_POS = {x: 61, y: 69};

var FLAG_LIMIT_POS_X = 690;

var TOT_TEAM = 32;

var MIN_BALL_VEL_ROTATION = 0.1;


var SHOOT_FRAME = 7;

var HAND_KEEPER_ANGLE_RATE = 0.15;

var TIME_POLE_COLLISION_RESET = 1000;

var LIMIT_HAND_RANGE_POS = {x: 20, zMax: 7, zMin: -8.5};



var LEFT_RIGHT_WALL_GOAL_SIZE;

var NUM_AREA_GOAL = {h: 3, w: 5};


var AREA_GOALS_ANIM = [ LEFT_UP, SIDE_LEFT_UP, CENTER_UP, SIDE_RIGHT_UP, RIGHT_UP,
                        LEFT, SIDE_LEFT, CENTER, SIDE_RIGHT, RIGHT,
                        LEFT_DOWN, SIDE_LEFT_DOWN, CENTER_DOWN, SIDE_RIGHT_DOWN, RIGHT_DOWN
                    ];



var BUFFER_ANIM_PLAYER = 30;

var MS_EFFECT_ADD = 1500;

var MS_ROLLING_SCORE = 500;

var MAX_PERCENT_PROBABILITY = 100;

var GOAL_KEEPER_TOLLERANCE_LEFT = -4;
var GOAL_KEEPER_TOLLERANCE_RIGHT = 4;

var TIME_RESET_AFTER_BALL_OUT = 250;

var TIME_RESET_AFTER_SAVE = 500;

var AREA_GOAL_PROPERTIES = {width: 4, depth: 1, height: 2.4};




var POLE_RIGHT_LEFT_SIZE;

var COLOR_AREA_GOAL = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xf0f0f0, 0x0f0f0f,
    0xffbb99, 0xffffff, 0x569910, 0x99dd22, 0x102080, 0x801020, 0x899869];//15

var OFFSET_FIELD_Y = 35;
var OFFSET_FIELD_X = 35;

var FORCE_RATE = 0.0014;



//var FORCE_MULTIPLIER_AXIS = {x: 0.12, y: 0.4, z: 0.08};
var FORCE_MULTIPLIER_AXIS = {x: 0.10, y: 0.4, z: 0.09};

var FORCE_MAX = 0.5;

var FIELD_POSITION;

var MAX_FORCE_Y = 66;

var MIN_FORCE_Y = 50;

/*
var CALCULATE_PROBABILITY = [{xMax: -7, xMin: -11, zMax: 11, zMin: 8}, {xMax: -3.6, xMin: -7, zMax: 11, zMin: 8},
    {xMax: 3.6, xMin: -3.6, zMax: 11, zMin: 8}, {xMax: 7, xMin: 3.6, zMax: 11, zMin: 8}, {xMax: 11, xMin: 7, zMax: 11, zMin: 8},
    {xMax: -7, xMin: -7, zMax: 8, zMin: 5}, {xMax: -3.6, xMin: -7, zMax: 8, zMin: 5},
    {xMax: 3.6, xMin: -3.6, zMax: 8, zMin: 5}, {xMax: 7, xMin: 3.6, zMax: 8, zMin: 5}, {xMax: 11, xMin: 7, zMax: 8, zMin: 5},
    {xMax: -7, xMin: -11, zMax: 5, zMin: 0}, {xMax: -3.6, xMin: -7, zMax: 5, zMin: 0},
    {xMax: 3.6, xMin: -3.6, zMax: 5, zMin: 0}, {xMax: 7, xMin: 3.6, zMax: 5, zMin: 0}, {xMax: 11, xMin: 7, zMax: 5, zMin: 0}];
*/

var SHOW_AREAS_GOAL = false;
var SHOW_3D_RENDER = false;
var CANVAS_3D_OPACITY = 0.5;

var CAMERA_TEST_TRACKBALL = false;

var CAMERA_TEST_TRANSFORM = false;



var MOUSE_SENSIBILTY = 0.03;

var CAMERA_TEST_LOOK_AT = {x: 0, y: -500, z: -100};

var BALL_SCALE_FACTOR = 0.007;
var SHADOWN_FACTOR = 1.1;


var FORCE_BALL_DISPLAY_SHOCK = [{max: 55, min: MIN_FORCE_Y - 1}, {max: 58, min: 55}, {max: 62, min: 58}, {max: MAX_FORCE_Y, min: 62}];

var GOALKEEPER_MODE = 0;
var STRIKER_MODE = 1;

var ENABLE_FULLSCREEN;
var ENABLE_CHECK_ORIENTATION;

var NUM_MATCHES = 10;
var OFFSET_BALL_POS_X = 10;
var HAND_KEEPER_SIZE = {width: 1.8, depth: 0.5, height: 1.5};
var HAND_KEEPER_POSITION = {x: 0, y: 36, z: 0};
var CAMERA_TEST = false;
var BALL_Z_FORCE_RANGE = {min: 3, max: 10};
var GOAL_POSITION = {x: 0, y: 33, z: -2.7};
var TIME_RESET_AFTER_KEEPER_SAVED = 2000;
var TIME_RESET_AFTER_PERFECT_KEEPER_SAVED = 2000;
var TIME_BALL_IN_HAND = 1000;
var NUM_KICKS = 20;
var BALL_FORCE_X = [5, 6, 7, 8, 9, 10, 7, 12, 10, 12];
var BALL_FORCE_Z = [{min: 6, max: 9}, {min: 5, max: 9}, {min: 3, max: 9}, {min: 1, max: 8}, {min: 2, max: 8}, {min: 4, max: 8},
                        {min: 3, max: 9}, {min: 1, max: 10}, {min: 5, max: 8}, {min: 5, max: 10.5}] //DIRECTION BALL FORCE UP
var BALL_FORCE_Y = [30, 40, 50, 60, 65, 60, 70, 64, 68, 65]; //BALL FORCE VELOCITY
var BALL_SAVED_POINT =  {x: 0.7, z: 0.6};
var GOAL_SCORED;
var GOAL_MISSED;
var GOAL_SAVED;
var GOAL_SUFFERED;
var LOCALSTORAGE_STRING = GAME_NAME;


//////////////////////MULTIPLAYER SETTINGS
//var GOALKEEPER_GOAL_SHOOTAREA = {x: 0.233, z: 0.23};
var GOALKEEPER_GOAL_SHOOTAREA = {lx: -0.24, rx: 0.26, z: 0.23};
//var STRIKER_GOAL_SHOOTAREA = {x: 0.1765, z: 0.186};
var STRIKER_GOAL_SHOOTAREA = {lx:-0.2, rx: 0.195, zmin:0.07, zmax: 0.1865};
var GOALKEEPER_SHOOTPOWER_LIMITS = {min: 50, max:60};  ///// THIS SETS THE DIFFICULTY FOR THE GOALKEEPER TO SAVE A BALL
var GOALKEEPER_RESULTS_GOAL = 0;
var GOALKEEPER_RESULTS_SAVED = 1;
var GOALKEEPER_RESULTS_BALLOUT = 2;
var GOALKEEPER_RESULTS_POSTHIT = 3;
var TIME_LOOP_WAIT = 500;
var PLAYER = 0;
var OPPONENT = 1;
var SCORE_NORMAL = 100;
var SCORE_NOBONUS = 50;
var SCORE_BONUS = 200;

//////////////////////SOCIAL SETTINGS
var GOAL_AREA_SIZE_STRIKER = {w:0, h:0};
var GOAL_AREA_SIZE_KEEPER = {x:CANVAS_WIDTH/2, y:CANVAS_HEIGHT/2 +20,w:950, h:390};
var NUM_AREA_GOAL_FOR_STATS = {h: 2, w: 3};

var ON_REFRESH = 0;

var ON_STRIKER_RESULT = 0;
var ON_KEEPER_RESULT = 1;
var ON_QUIZ_RESULT = 2;
var ON_MATCH_RESULT = 3;
var ON_COUNTRY_PICK = 4;

var RES_GOAL = "goal";
var RES_SAVED = "saved";
var RES_OUT = "out";


var TEXT_COLOR_SOCIAL = "#003e84";
var TEXT_COLOR_SOCIAL2 = "#77a3c2";
var TEXT_COLOR_SOCIAL_DISABLED = "#e5e4e4";

var PIECHART_RADIUS = 126;
var PIECHART_LABEL_LINE_LENGTH = 100;

/////////////////////////////////////

var TEXT_COLOR_STROKE;
var BALL_RADIUS;
var TIME_RESET_AFTER_GOAL;
var BACK_WALL_GOAL_SIZE;
var UP_WALL_GOAL_SIZE;
var BACK_WALL_GOAL_POSITION;
var GOAL_LINE_POS;
var GOAL_SPRITE_SWAP_Y;
var GOAL_SPRITE_SWAP_Z;
var FIRST_AREA_GOAL_POS;
var GOAL_KEEPER_DEPTH_Y;
var BALL_OUT_Y;
var POSITION_BALL;
var POLE_UP_SIZE;
var HIT_BALL_MAX_FORCE;
var HIT_BALL_MIN_FORCE;
var INTENSITY_DISPLAY_SHOCK;
var CAMERA_POSITION;
var FOV;
var NEAR; 
var FAR;

var LANG_EN = "en";
var LANG_ES = "es";
var LANG_FR = "fr";
var LANG_PT = "pt-br";
var LANG_IT = "it";

function refreshSettings(iMode){
    if(iMode === GOALKEEPER_MODE){
        TEXT_COLOR_STROKE = "#000000";
        BALL_RADIUS = 1;
        TIME_RESET_AFTER_GOAL = 1000;
        BACK_WALL_GOAL_SIZE = {width: 21, depth: 0.1, height: 11};
        UP_WALL_GOAL_SIZE = {width: 21, depth: 25, height: 0.1};
        POLE_RIGHT_LEFT_SIZE = {radius_top: 0.5, radius_bottom: 0.5, height: 21.5, segments: 10};
        BACK_WALL_GOAL_POSITION = {x: 0, y: 8, z: -2.7};
        GOAL_LINE_POS = {x: 0, y: 31, z: -2.7};
        POSITION_BALL = {x: 0, y: 125, z: -9};
        POLE_UP_SIZE = {radius_top: 0.5, radius_bottom: 0.5, height: 42, segments: 10};
        LEFT_RIGHT_WALL_GOAL_SIZE = {width: 0.1, depth: 25, height: 11};
        HIT_BALL_MAX_FORCE = 100;
        HIT_BALL_MIN_FORCE = 0.01;
        INTENSITY_DISPLAY_SHOCK = [{x: 30, y: 20, time: 75}, {x: 50, y: 25, time: 75}, {x: 70, y: 30, time: 75}, {x: 90, y: 40, time: 75}];
        CAMERA_POSITION = {x: 0, y: 0, z: 100};
        FOV = 45;
        NEAR = 10;
        FAR = 2000;
    }else{
        TEXT_COLOR_STROKE = "#002a59";
        BALL_RADIUS = 0.68;
        TIME_RESET_AFTER_GOAL = 1000;
        BACK_WALL_GOAL_SIZE = {width: 20.5, depth: 1, height: 7.5};
        UP_WALL_GOAL_SIZE = {width: 20.5, depth: 25, height: 0.1};
        BACK_WALL_GOAL_POSITION = {x: 0, y: 155, z: -2.7};
        GOAL_LINE_POS = {x: 0, y: BACK_WALL_GOAL_POSITION.y - UP_WALL_GOAL_SIZE.depth + 2, z: BACK_WALL_GOAL_POSITION.z};
        POSITION_BALL = {x: 0.05, y: 15.4, z: -9 + BALL_RADIUS};
        POLE_UP_SIZE = {radius_top: 0.5, radius_bottom: 0.5, height: 40.5, segments: 10};
        POLE_RIGHT_LEFT_SIZE = {radius_top: 0.5, radius_bottom: 0.5, height: 15, segments: 10};
        LEFT_RIGHT_WALL_GOAL_SIZE = {width: 0.1, depth: 25, height: 7.5};
        HIT_BALL_MAX_FORCE = 130;
        HIT_BALL_MIN_FORCE = 5;
        INTENSITY_DISPLAY_SHOCK = [{x: 10, y: 7.5, time: 50}, {x: 20, y: 9, time: 50}, {x: 30, y: 12, time: 50}, {x: 33, y: 15, time: 50}];
        CAMERA_POSITION = {x: 0, y: 0, z: -7};
        FOV = 15;
        NEAR = 1;
        FAR = 2000;
    }
    
    GOAL_SPRITE_SWAP_Y = GOAL_LINE_POS.y;
    GOAL_SPRITE_SWAP_Z = BACK_WALL_GOAL_POSITION.z + LEFT_RIGHT_WALL_GOAL_SIZE.height;
    FIRST_AREA_GOAL_POS = {x: -14 - (AREA_GOAL_PROPERTIES.width * 0.5),
                            y: BACK_WALL_GOAL_POSITION.y - UP_WALL_GOAL_SIZE.depth + 1.1,
                            z: 3.1 - (AREA_GOAL_PROPERTIES.height * 0.5)};
    BALL_OUT_Y = BACK_WALL_GOAL_POSITION.y + 3;
    GOAL_KEEPER_DEPTH_Y = BACK_WALL_GOAL_POSITION.y - UP_WALL_GOAL_SIZE.depth;
    START_HAND_SWIPE_POS = {x: CANVAS_WIDTH_HALF, y: CANVAS_HEIGHT_HALF + 200};
    END_HAND_SWIPE_POS = [{x: CANVAS_WIDTH_HALF - 250, y: CANVAS_HEIGHT_HALF - 200}, {x: CANVAS_WIDTH_HALF, y: CANVAS_HEIGHT_HALF - 200},
    {x: CANVAS_WIDTH_HALF + 250, y: CANVAS_HEIGHT_HALF - 200}];
    
}

