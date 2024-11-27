function CPlayer(iX, iY, oParentContainer) {
    var _pStartPos;
    var _oPlayer;
    var _oParentContainer = oParentContainer;
    var _oContainer;
    var _iAnimPlayer = 0;
    var _fBuffer = 0;

    this._init = function (iX, iY) {
        _pStartPos = {x: iX, y: iY};
        _oContainer = new createjs.Container();
        _oContainer.x = _pStartPos.x;
        _oContainer.y = _pStartPos.y;
        _oParentContainer.addChild(_oContainer);
/*
        for (var i = 0; i < NUM_SPRITE_PLAYER; i++) {
            _aPlayer.push(createBitmap(s_oSpriteLibrary.getSprite("player_" +TEAM_INFO[s_iTeamSelected].player + "_"+ i)));
            _aPlayer[i].visible = false;
            _oContainer.addChild(_aPlayer[i]);
        }

        var oSprite = s_oSpriteLibrary.getSprite("player_" +TEAM_INFO[s_iTeamSelected].player + "_0");

*/

        var aSprite = new Array();
        for(var i=0; i<=30; i++){
            aSprite.push(s_oSpriteLibrary.getSprite("player_"+TEAM_INFO[s_iTeamSelected].player+"_"+i));
        }

        var iWidth = aSprite[0].width;
        var iHeight = aSprite[0].height;

        var oData = {
            images: aSprite,
            // width, height & registration point of each sprite
           "frames": {width:iWidth, height:iHeight, regX:0, regY:0},
                        
                    animations: {start: 0, anim:[0,30,"hide"],hide:31}
        };

        /*
        var oData = {
            images: [s_oSpriteLibrary.getSprite("player_"+TEAM_INFO[s_iTeamSelected].player+"-0"),
                     s_oSpriteLibrary.getSprite("player_"+TEAM_INFO[s_iTeamSelected].player+"-1"),
                     s_oSpriteLibrary.getSprite("player_"+TEAM_INFO[s_iTeamSelected].player+"-2"),
                     s_oSpriteLibrary.getSprite("player_"+TEAM_INFO[s_iTeamSelected].player+"-3")],
            // width, height & registration point of each sprite
           "frames": [
                        [1, 1, 233, 485, 0, -509, -155],
    [236, 1, 337, 640, 0, -405, 0],
    [575, 1, 374, 640, 0, -368, 0],
    [951, 1, 337, 640, 0, -405, 0],
    [1290, 1, 438, 640, 0, -304, 0],
    [1, 643, 655, 640, 0, -87, 0],
    [658, 643, 658, 640, 0, -83, 0],
    [1318, 643, 633, 640, 0, -98, 0],
    [1, 1285, 626, 640, 0, -81, 0],
    [629, 1285, 604, 640, 0, -103, 0],
    [1235, 1285, 663, 640, 0, -47, 0],
    [1, 1, 688, 640, 1, -42, 0],
    [691, 1, 705, 640, 1, -37, 0],
    [1, 643, 660, 640, 1, -82, 0],
    [663, 643, 712, 640, 1, -30, 0],
    [1, 1285, 699, 640, 1, -43, 0],
    [702, 1285, 695, 640, 1, -47, 0],
    [1, 1, 671, 640, 2, -71, 0],
    [674, 1, 691, 640, 2, -51, 0],
    [1, 643, 698, 640, 2, -44, 0],
    [701, 643, 705, 640, 2, -37, 0],
    [1408, 643, 336, 640, 2, -406, 0],
    [1, 1285, 311, 640, 2, -431, 0],
    [314, 1285, 285, 640, 2, -457, 0],
    [601, 1285, 258, 640, 2, -484, 0],
    [861, 1285, 263, 640, 2, -479, 0],
    [1126, 1285, 271, 640, 2, -471, 0],
    [1399, 1285, 277, 640, 2, -465, 0],
    [1678, 1285, 278, 640, 2, -464, 0],
    [1, 1, 275, 640, 3, -467, 0],
    [278, 1, 273, 640, 3, -469, 0]
                    ],
            animations: {start: 0, anim:[0,30,"hide"],hide:31}
        };
        */

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oPlayer = new createjs.Sprite(oSpriteSheet,"start");
        _oContainer.addChild(_oPlayer);
        
    };

    this.setPosition = function (iX, iY) {
        _oContainer.x = iX;
        _oContainer.y = iY;
    };

    this.getX = function () {
        return _oContainer.x;
    };

    this.getY = function () {
        return _oContainer.y;
    };

    this.getStartPos = function () {
        return _pStartPos;
    };

    this.setVisible = function (bVal) {
        _oContainer.visible = bVal;
    };

    this.animFade = function (fAlpha) {
        var oParent = this;
        createjs.Tween.get(_oContainer).to({alpha: fAlpha}, 250).call(function () {
            if (fAlpha === 0) {
                _oContainer.visible = false;
                oParent.viewCharacter(_iAnimPlayer);
            }
        });
    };

    this.viewCharacter = function (iFrame) {
        _oPlayer.gotoAndStop(iFrame);
    };


    this.getFrame = function () {
        return _oPlayer.currentFrame;
    };

    this.animPlayer = function () {
        _fBuffer += s_iTimeElaps;
        if (_fBuffer > BUFFER_ANIM_PLAYER) {

            if (_iAnimPlayer + 1 < NUM_SPRITE_PLAYER) {
                this.viewCharacter(_iAnimPlayer + 1);
                _iAnimPlayer++;
            } else {
                this.viewCharacter(_iAnimPlayer);
                _iAnimPlayer = 0;
                _fBuffer = 0;
                return false;
            }
           
            _fBuffer = 0;
        }
        return true;
    };

    this._init(iX, iY);

    return this;
}