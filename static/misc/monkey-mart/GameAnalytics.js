/*
 * Local stand-in for the GameAnalytics HTML5 SDK, shared by every game on the
 * site that shipped with one.
 *
 * The real SDK opens a session on load and POSTs to api.gameanalytics.com for
 * the life of the page -- init, session start/stop, design/progression/resource/
 * error/ad events -- against the game keys the original developer baked into the
 * build. That telemetry (including our hostname) lands in their dashboard, not
 * ours, and nothing in these games reads anything back from it except the remote
 * config, which is optional by design.
 *
 * So: same surface, no network. Two shapes have to keep working, because the
 * builds use both --
 *   gameanalytics.GameAnalytics.addDesignEvent("x")     (namespaced object)
 *   GameAnalytics("addDesignEvent", "x")                (gaCommand string form)
 * -- and Unity/Construct bridges call GameAnalytics.isSdkReady() and
 * getGlobalObject() while wiring themselves up, so those return sane values
 * rather than undefined.
 *
 * Remote config reports "ready" with empty contents: builds that wait on
 * isRemoteConfigsReady() would otherwise hang on a splash screen forever, and a
 * listener that never fires is worse than one that fires with the defaults.
 */
(function (global) {
  "use strict";

  var noop = function () {};
  var FN = [
    "addAdEvent","addAdEventWithDuration","addAdEventWithNoAdReason","addBusinessEvent",
    "addDesignEvent","addErrorEvent","addProgressionEvent","addResourceEvent",
    "addOnBeforeUnloadListener","removeOnBeforeUnloadListener",
    "configureAvailableCustomDimensions01","configureAvailableCustomDimensions02",
    "configureAvailableCustomDimensions03","configureAvailableResourceCurrencies",
    "configureAvailableResourceItemTypes","configureBuild","configureGameEngineVersion",
    "configureSdkGameEngineVersion","configureUserId","configureAutoDetectAppVersion",
    "init","initialize","internalInitialize","newSession","startSession","endSession",
    "onResume","onStop","resumeSessionAndStartQueue","startNewSessionCallback",
    "setCustomDimension01","setCustomDimension02","setCustomDimension03",
    "setEnabledEventSubmission","setEnabledInfoLog","setEnabledManualSessionHandling",
    "setEnabledVerboseLog","setEventProcessInterval","setGlobalCustomEventFields",
    "removeRemoteConfigsListener"
  ];

  var GA = {};
  for (var i = 0; i < FN.length; i++) GA[FN[i]] = noop;

  GA.isSdkReady = function () { return true; };
  GA.getGlobalObject = function () { return GA; };
  GA.getABTestingId = function () { return ""; };
  GA.getABTestingVariantId = function () { return ""; };

  // Remote configs: ready, but empty.
  GA.isRemoteConfigsReady = function () { return true; };
  GA.getRemoteConfigsValueAsString = function (key, defaultValue) {
    return defaultValue === undefined ? null : defaultValue;
  };
  GA.getRemoteConfigsContentAsString = function () { return "{}"; };
  GA.addRemoteConfigsListener = function (listener) {
    if (listener && typeof listener.onRemoteConfigsUpdated === "function") {
      setTimeout(function () { try { listener.onRemoteConfigsUpdated(); } catch (e) {} }, 0);
    } else if (typeof listener === "function") {
      setTimeout(function () { try { listener(); } catch (e) {} }, 0);
    }
  };

  // gaCommand form: GameAnalytics("methodName", arg, ...)
  GA.methodMap = {};
  for (var k in GA) if (typeof GA[k] === "function") GA.methodMap[k] = GA[k];

  function GameAnalytics(name) {
    var fn = GA.methodMap[name];
    return typeof fn === "function" ? fn.apply(GA, [].slice.call(arguments, 1)) : undefined;
  }
  GA.gaCommand = GameAnalytics;
  for (var m in GA) GameAnalytics[m] = GA[m];

  global.gameanalytics = global.gameanalytics || {};
  global.gameanalytics.GameAnalytics = GameAnalytics;
  global.GameAnalytics = GameAnalytics;
  // Enum namespaces some builds reference when constructing events.
  global.gameanalytics.EGAProgressionStatus = { Start: 1, Complete: 2, Fail: 3 };
  global.gameanalytics.EGAResourceFlowType  = { Source: 1, Sink: 2 };
  global.gameanalytics.EGAErrorSeverity     = { Debug: 1, Info: 2, Warning: 3, Error: 4, Critical: 5 };
  global.gameanalytics.EGAAdAction          = { Clicked: 1, Show: 2, FailedShow: 3, RewardReceived: 4 };
  global.gameanalytics.EGAAdType            = { Video: 1, RewardedVideo: 2, Playable: 3, Interstitial: 4, OfferWall: 5, Banner: 6 };
})(window);
