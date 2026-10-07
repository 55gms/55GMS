/*
 * pizzaedition: local stand-in for cdn2.unblocked-games-free.com/data/game_.js,
 * which was the real 170 KB Yandex Games SDK (YaGames). Off yandex.ru it can
 * only fail its own network calls while handing Yandex our hostname, and this
 * page uses exactly two things from it:
 *
 *   YaGames.init(opts).then(ysdk => window.ysdk = ysdk)
 *   ysdk.adv.showFullscreenAdv({})   // via ShowYaBanner(), already in try/catch
 *
 * So resolve init() with an object carrying that shape. The game runs the same;
 * the ad call becomes a no-op that still fires its onClose callback, which is
 * what the build waits on before unpausing.
 */
var YaGames = (function () {
  "use strict";
  function noopAdv(opts) {
    opts = opts || {};
    var cb = opts.callbacks || {};
    // Defer so callers finish their current turn before being resumed.
    setTimeout(function () {
      try { cb.onClose && cb.onClose(false); } catch (e) {}
      try { cb.onRewarded && cb.onRewarded(); } catch (e) {}
    }, 0);
  }
  return {
    init: function () {
      return Promise.resolve({
        adv: {
          showFullscreenAdv: noopAdv,
          showRewardedVideo: noopAdv,
          showBannerAdv: function () { return Promise.resolve({ stickyAdvIsShowing: false }); },
          hideBannerAdv: function () { return Promise.resolve({ stickyAdvIsShowing: false }); },
          getBannerAdvStatus: function () { return Promise.resolve({ stickyAdvIsShowing: false }); }
        },
        features: { LoadingAPI: { ready: function () {} } },
        getPlayer: function () { return Promise.reject(new Error("no Yandex player")); },
        getLeaderboards: function () { return Promise.reject(new Error("no Yandex leaderboards")); },
        getStorage: function () { return Promise.resolve(window.localStorage); },
        screen: { fullscreen: { request: function () {}, exit: function () {} } },
        environment: { i18n: { lang: "en" }, app: { id: "" } },
        deviceInfo: { isMobile: function () { return false; }, isDesktop: function () { return true; } },
        isAvailableMethod: function () { return Promise.resolve(false); }
      });
    }
  };
})();
