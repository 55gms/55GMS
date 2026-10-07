/// Poki Bacon May Die

var adStarted = false;
var gameplayStarted = false;

function poki_loading_finished() {
	poki_log("Loading finished");
	sdk.gameLoadingFinished();
	
	poki_loading(1);
}

function poki_loading_update(percents) {
	poki_log("Loading update");    
	sdk.gameLoadingProgress({percentageDone: percents});
}

function poki_gameplay_start(reason) {
    if (!gameplayStarted) {
        poki_log("Gameplay Start: " + reason);
        sdk.gameplayStart(reason);	
        gameplayStarted = true;
    }
}

function poki_adblock_send() {
    poki_callback("poki.adblock", adsAreDisabled);   
}

function poki_gameplay_stop(reason) {
    if (gameplayStarted) {
	    poki_log("Gameplay Stop: " + reason);
        sdk.gameplayStop(reason);
        gameplayStarted = false;        
    }
}

function poki_happy(value) {
	sdk.happyTime(value);
}

function poki_break(tag) {
    if (!adStarted) {
        poki_callback("poki.break.started", tag);
        sdk.commercialBreak().then(function(){
            poki_callback("poki.break.completed", tag);
            setTimeout(poki_ad_reset, 1000)
        });
        adStarted = true;
    } 
}

function poki_ad_reset() {
    adStarted = false;
}

function poki_rewarded_break(tag) {
	poki_callback("poki.rewarded.started", tag);
	sdk.rewardedBreak().then(
		(success) => {
			if (success) {
				poki_callback("poki.rewarded.completed", tag);
			} else {
				poki_callback("poki.rewarded.failed", tag);		
			}
		}
	);
}

function poki_block_check() {
	// host lock removed
}

var gameReady = false;

function game_ready(resize) {
	gameReady = true;
}

function poki_callback(event, args) {
	gmCallback.game_callback(event, args);	
}
