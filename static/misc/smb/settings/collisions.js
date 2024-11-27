/// <reference path="../FullScreenMario.ts" />
var FullScreenMario;
(function (FullScreenMario) {
    "use strict";
    FullScreenMario.FullScreenMario.settings.collisions = {
        "groupNames": ["Solid", "Character"],
        "keyGroupName": "groupType",
        "globalCheckGenerators": {
            "Character": FullScreenMario.FullScreenMario.prototype.generateCanThingCollide,
            "Solid": FullScreenMario.FullScreenMario.prototype.generateCanThingCollide
        },
        "hitCheckGenerators": {
            "Character": {
                "Character": FullScreenMario.FullScreenMario.prototype.generateIsCharacterTouchingCharacter,
                "Solid": FullScreenMario.FullScreenMario.prototype.generateIsCharacterTouchingSolid
            }
        },
        "hitFunctionGenerators": {
            "Character": {
                "Solid": FullScreenMario.FullScreenMario.prototype.generateHitCharacterSolid,
                "Character": FullScreenMario.FullScreenMario.prototype.generateHitCharacterCharacter
            }
        }
    };
})(FullScreenMario || (FullScreenMario = {}));
