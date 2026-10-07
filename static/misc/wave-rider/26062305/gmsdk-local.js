// Local stand-in for https://api.azgame.io/static/gmsdkv1.js
//
// The original script does a live server-side domain check
// (GET https://api.azgame.io/sdk/gmadsv1) that returns allow_play:"no"
// for any domain other than the ones azgame.io has on file, and then
// overwrites localStorage["gmsdksigndomain"] with that "no" result and,
// after `unlock_timer` seconds, replaces the *entire* document.body with
// a "locked" splash screen. Since this game is self-hosted here (no
// azgame.io account/whitelisting), that call always fails closed.
//
// This local copy keeps everything the Unity build actually needs
// (GMSOFT_GAME_INFO / GMSOFT_ADS_INFO defaults + the gmsoftSdkReady
// event the game waits for) but skips the remote verification call
// and never touches localStorage["gmsdksigndomain"], so the value
// index.html seeds there is what gets relayed on to the Unity build.
window['GMSOFT_OPTIONS'] = config;

window['GMSOFT_GAME_INFO'] = {
	sdktype: window['GMSOFT_SDKTYPE'],
	more_games_url: '',
	promotion: {}
};

window['GMSOFT_ADS_INFO'] = {
	enable: 'no',
	sdk_type: window['GMSOFT_SDKTYPE'] || 'gm',
	time_show_inter: 60,
	time_show_reward: 60,
	pubid: undefined,
	reward: undefined,
	gd_game_key: '',
	wgLibrary: undefined,
	wgConf: undefined,
	enable_reward: 'yes',
	enable_interstitial: 'yes',
	enable_preroll: 'yes'
};

document.dispatchEvent(new CustomEvent('gmsoftSdkReady'));
