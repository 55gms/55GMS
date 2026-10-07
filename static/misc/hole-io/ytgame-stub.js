/*
 * Local stand-in for the YouTube Playables SDK (`ytgame`), for games ripped from
 * a YouTube Playables build.
 *
 * The real SDK is injected by the YouTube Playables host frame. Off-platform the
 * global simply does not exist, and the Unity glue calls it WITHOUT guarding:
 *
 *     function _CheckIsAudioEnabled(){ return Boolean(ytgame.system.isAudioEnabled()) }
 *     function _GetYTGameSDKVersion(){ var v = ytgame.SDK_VERSION; ... }
 *     function _LoadGameData(){ ytgame.game.loadData().then(...) }
 *
 * Those throw a ReferenceError, Unity swallows it via _JS_CallAsLongAsNoExceptionsSeen,
 * the C# side receives null, and the next use throws NullReferenceException -- which
 * is what surfaced as "click Play -> NullReferenceException".
 *
 * The glue also talks to `unityGameInstance` / `gameInstance`, while this site's
 * loader exposes `window.unityGame`, so those aliases are provided too.
 *
 * Ads are routed to whatever PokiSDK shim is present so they still function.
 * Save data is kept in localStorage, keyed per game path.
 */
(function () {
    'use strict';
    if (window.ytgame) return;

    var KEY = 'ytgame:save:' + location.pathname;
    var noop = function () {};
    var unset = function () { return noop; };

    function poki() { return (typeof window.PokiSDK !== 'undefined') ? window.PokiSDK : null; }
    function adPromise(kind) {
        var p = poki();
        try {
            if (p && kind === 'rewarded' && p.rewardedBreak) return Promise.resolve(p.rewardedBreak()).then(function (r) { return r !== false; });
            if (p && p.commercialBreak) return Promise.resolve(p.commercialBreak()).then(function () { return true; });
        } catch (e) {}
        return Promise.resolve(true);
    }

    window.ytgame = {
        // false: this is not the YouTube host, so the game should prefer its own
        // platform path. Every member below is still implemented, because the glue
        // calls several of them regardless of this flag.
        IN_PLAYABLES_ENV: false,
        SDK_VERSION: '1.0.0',
        system: {
            isAudioEnabled: function () { return true; },
            onAudioEnabledChange: unset,
            onPause: unset,
            onResume: unset
        },
        game: {
            firstFrameReady: noop,
            gameReady: noop,
            loadData: function () {
                var v = '';
                try { v = window.localStorage.getItem(KEY) || ''; } catch (e) {}
                return Promise.resolve(v);
            },
            saveData: function (data) {
                try { window.localStorage.setItem(KEY, String(data == null ? '' : data)); } catch (e) {}
                return Promise.resolve();
            }
        },
        ads: {
            requestInterstitialAd: function () { return adPromise('interstitial'); },
            requestRewardedAd: function () { return adPromise('rewarded'); }
        },
        engagement: {
            sendScore: function () { return Promise.resolve(); }
        },
        health: { logError: noop, logWarning: noop }
    };

    // The glue expects these names; this site's loader sets window.unityGame.
    function alias() {
        if (window.unityGame && !window.unityGameInstance) window.unityGameInstance = window.unityGame;
        if (window.unityGame && !window.gameInstance) window.gameInstance = window.unityGame;
    }
    alias();
    var tries = 0;
    var t = setInterval(function () { alias(); if (window.unityGameInstance || ++tries > 900) clearInterval(t); }, 100);

    console.info('[ytgame-stub] YouTube Playables SDK stub installed');
})();
