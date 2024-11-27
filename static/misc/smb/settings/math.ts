/// <reference path="../FullScreenMario.ts" />

module FullScreenMario {
    "use strict";

    FullScreenMario.settings.math = {
        "equations": {
            /**
             * Decreases a player's jumping yvel based on whether it's running.
             */
            "decreasePlayerJumpingYvel": function (
                constants: IMapScreenr,
                equations: MathDecidr.IEquationContainer,
                player: IPlayer): void {
                var jumpmod: number = player.FSM.MapScreener.jumpmod - player.xvel * .0014,
                    power: number = Math.pow(player.keys.jumplev, jumpmod),
                    dy: number = player.FSM.unitsize / power;

                player.yvel = Math.max(player.yvel - dy, constants.maxyvelinv);
            },
            /**
             * Decreases a player's running xvel based on whether it's sprinting.
             * @returns {Boolean} True if the player started or stopped skidding,
             *                    or false if the skidding status was unchanged.
             */
            "decreasePlayerRunningXvel": function (
                constants: IMapScreenr,
                equations: MathDecidr.IEquationContainer,
                player: IPlayer): boolean {
                // If a button is pressed, hold/increase speed
                if (player.keys.run !== 0 && !player.crouching) {
                    var dir: number = player.keys.run,
                        // No sprinting underwater
                        sprinting: number = Number(player.keys.sprint && !player.FSM.MapScreener.underwater) || 0,
                        adder: number = dir * (.098 * (Number(sprinting) + 1)),
                        decel: number = 0,
                        skiddingChanged: boolean = false;

                    // Reduce the speed, both by subtracting and dividing a little
                    player.xvel += adder || 0;
                    player.xvel *= .98;
                    decel = .0007;

                    // If you're accelerating in the opposite direction from your current velocity, that's a skid
                    if ((player.keys.run > 0) === player.moveleft) {
                        if (!player.skidding) {
                            player.skidding = true;
                            skiddingChanged = true;
                        }
                    } else if (player.skidding) {
                        // Not accelerating: make sure you're not skidding
                        player.skidding = false;
                        skiddingChanged = true;
                    }
                } else {
                    // Otherwise slow down a bit
                    player.xvel *= .98;
                    decel = .035;
                }

                if (player.xvel > decel) {
                    player.xvel -= decel;
                } else if (player.xvel < -decel) {
                    player.xvel += decel;
                } else if (player.xvel !== 0) {
                    player.xvel = 0;
                    if (!player.FSM.MapScreener.nokeys && player.keys.run === 0) {
                        if (player.keys.leftDown) {
                            player.keys.run = -1;
                        } else if (player.keys.rightDown) {
                            player.keys.run = 1;
                        }
                    }
                }

                return skiddingChanged;
            },
            /**
             * @return A player's yvel for when it's riding up a springboard.
             */
            "springboardYvelUp": function (
                constants: IMapScreenr,
                equations: MathDecidr.IEquationContainer,
                thing: ISpringboard): number {
                return Math.max(thing.FSM.unitsize * -2, thing.tensionSave * -.98);
            }
        }
    };
}
