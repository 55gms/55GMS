var CANVAS_WIDTH = 1920;
var CANVAS_HEIGHT = 1920;

var EDGEBOARD_X = 570;
var EDGEBOARD_Y = 540;

var FPS = 60;
var FPS_TIME      = 1000/FPS;
var DISABLE_SOUND_MOBILE = false;

var PRIMARY_FONT = "arialrounded";

var STATE_LOADING = 0;
var STATE_MENU    = 1;
var STATE_HELP    = 1;
var STATE_GAME    = 3;

var ON_MOUSE_DOWN  = 0;
var ON_MOUSE_UP    = 1;
var ON_MOUSE_OVER  = 2;
var ON_MOUSE_OUT   = 3;
var ON_DRAG_START  = 4;
var ON_DRAG_END    = 5;

var MODE_HUMAN     = 0;
var MODE_COMPUTER  = 1;

var EASY_MODE = 0;
var MEDIUM_MODE = 1;
var HARD_MODE = 2;


var WHITE = "white";
var BLACK = "black";

var PAWN = "pawn";
var ROOK = "rook";
var KNIGHT = "knight";
var BISHOP = "bishop";
var QUEEN = "queen";
var KING = "king";


var PLAYER_STATE_WAIT = 0;
var PLAYER_STATE_SELECTED = 1;
var PLAYER_STATE_MOVING = 2;

var BOARD_STATE_STALEMATE = 0;
var BOARD_STATE_CHECK = 1;
var BOARD_STATE_PROMOTION = 2;
var BOARD_STATE_CHECKMATE = 3;

var BOARD_SPECIAL_CASTLING_RIGHT = 0;
var BOARD_SPECIAL_CASTLING_LEFT = 1;
var BOARD_SPECIAL_ENPASSANT = 2;


var NUM_CELL = 8;      
var BOARD_LENGTH  = 815;
var CELL_LENGTH   = BOARD_LENGTH/NUM_CELL;

var DRAW = -1;

var TIME_MOVE = 1000;

var TIME_LOOP_WAIT = 1000;
var MIN_AI_THINKING   = 1000;
var MAX_AI_THINKING   = 1500;

var INFINITE = 99999;

var SEARCH_DEPTH;
var DRAW_COUNTER = 50;

var START_SCORE;
var SCORE_DECREASE_PER_SECOND;
var SHOW_SCORE;

var ENABLE_CHECK_ORIENTATION;
var ENABLE_FULLSCREEN;