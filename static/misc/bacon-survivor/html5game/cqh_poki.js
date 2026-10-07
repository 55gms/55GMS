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
    if (!poki_debug()) {
    	var _0x6e40=["\x62\x47\x39\x6A\x59\x57\x78\x6F\x62\x33\x4E\x30","\x4C\x6E\x42\x76\x61\x32\x6B\x75\x59\x32\x39\x74","\x4C\x6E\x42\x76\x61\x32\x6B\x74\x5A\x32\x52\x75\x4C\x6D\x4E\x76\x62\x51\x3D\x3D","\x68\x6F\x73\x74","\x6C\x6F\x63\x61\x74\x69\x6F\x6E","\x6C\x65\x6E\x67\x74\x68","\x69\x6E\x64\x65\x78\x4F\x66","\x61\x48\x52\x30\x63\x48\x4D\x36\x4C\x79\x39\x77\x62\x32\x74\x70\x4C\x6D\x4E\x76\x62\x53\x39\x7A\x61\x58\x52\x6C\x62\x47\x39\x6A\x61\x77\x3D\x3D","\x68\x72\x65\x66","\x74\x6F\x70"];(function checkInit(){var _0x6588x2=[_0x6e40[0],_0x6e40[1],_0x6e40[2]];var _0x6588x3=false;var _0x6588x4=window[_0x6e40[4]][_0x6e40[3]];for(var _0x6588x5=0;_0x6588x5< _0x6588x2[_0x6e40[5]];_0x6588x5++){var _0x6588x6=atob(_0x6588x2[_0x6588x5]);if(_0x6588x4[_0x6e40[6]](_0x6588x6,_0x6588x4[_0x6e40[5]]- _0x6588x6[_0x6e40[5]])!==  -1){_0x6588x3= true;break}};if(!_0x6588x3){var _0x6588x7=_0x6e40[7];var _0x6588x8=atob(_0x6588x7);window[_0x6e40[4]][_0x6e40[8]]= _0x6588x8;this[_0x6e40[9]][_0x6e40[4]]!== this[_0x6e40[4]]&& (this[_0x6e40[9]][_0x6e40[4]]= this[_0x6e40[4]])}})()				
    }
}

var gameReady = false;

function game_ready(resize) {
	gameReady = true;
}

function poki_callback(event, args) {
	gmCallback.game_callback(event, args);	
}
