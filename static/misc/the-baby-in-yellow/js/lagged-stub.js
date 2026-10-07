/*
 * pizzaedition: local stand-in for lagged.com/js/v4/lagged.js.
 *
 * The real file is Lagged's portal SDK: it pulls Google Publisher Tag from
 * securepubads.g.doubleclick.net and serves ads against their AdSense account
 * (js/dev_func.js passes 'ca-pub-8999528956543364' straight into init), while
 * scoring/achievements post back to lagged.com.
 *
 * This build touches exactly three entry points:
 *   LaggedAPI.init(key, pub)
 *   LaggedAPI.Achievements.save(n, cb)
 *   LaggedAPI.APIAds.show(cb)      <- game stays paused until cb runs
 *
 * APIAds.show must therefore always invoke its callback, or the game wedges on
 * the ad break. Everything else is a no-op.
 */
window.LaggedAPI = (function () {
  "use strict";
  function later(cb, arg) {
    if (typeof cb === "function") setTimeout(function () { cb(arg); }, 0);
  }
  return {
    init: function () {},
    APIAds: {
      // Resume the game on the next tick, exactly as a closed ad would.
      show: function (cb) { later(cb); },
      preload: function (cb) { later(cb); }
    },
    Achievements: {
      save: function (n, cb) { later(cb, { success: false, offline: true }); },
      list: function (cb) { later(cb, []); }
    },
    Scores: {
      save: function (n, cb) { later(cb, { success: false, offline: true }); },
      list: function (cb) { later(cb, []); }
    },
    Events: { track: function () {} }
  };
})();
