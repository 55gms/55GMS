/// <reference path="../FullScreenMario.ts" />

module FullScreenMario {
    "use strict";

    FullScreenMario.settings.collisions = {
        "groupNames": ["Solid", "Character"],
        "keyGroupName": "groupType",
        "globalCheckGenerators": {
            "Character": FullScreenMario.prototype.generateCanThingCollide,
            "Solid": FullScreenMario.prototype.generateCanThingCollide
        },
        "hitCheckGenerators": {
            "Character": {
                "Character": FullScreenMario.prototype.generateIsCharacterTouchingCharacter,
                "Solid": FullScreenMario.prototype.generateIsCharacterTouchingSolid
            }
        },
        "hitFunctionGenerators": {
            "Character": {
                "Solid": FullScreenMario.prototype.generateHitCharacterSolid,
                "Character": FullScreenMario.prototype.generateHitCharacterCharacter
            }
        }
    };
}
