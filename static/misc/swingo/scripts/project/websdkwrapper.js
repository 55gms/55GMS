runOnStartup(async (runtime) => {
  globalThis.skymenExexJSOnDomRuntimeSide =
    runtime.objects.ExecuteJsOnDom.getFirstInstance().sdkInst;
  const execJs = globalThis.skymenExexJSOnDomRuntimeSide;

  execJs.CreateFunction(
    "deepCopyObjWithoutFunctions",
    ["obj", "filter"],
    `
		if (obj === null || typeof obj !== 'object') {
			return obj;
		}
		var temp = obj.constructor(); // give temp the original obj's constructor
		if (temp === null || temp === undefined) {
			temp = {};
		}
		for (var key in obj) {
			if (typeof obj[key] === 'function' || filter.some(x=>obj[key] === x)) {
				continue;
			}
			temp[key] = globalThis.skymenExexJSOnDom._OnCallFunction({"name": "deepCopyObjWithoutFunctions", "args": [obj[key]]})
		}
		return temp;
	`
  );

  execJs.CreateFunction(
    "handleInit",
    ["args"],
    `
		let [name, debug = false, data = {}] = args;
		globalThis.WebSdkWrapper.init(name, debug, data).then(() => {
			let currentSdk = globalThis.WebSdkWrapper.currentSdk;
			globalThis.WebSdkWrapper.dispatch("onInit", {
			  enabled: globalThis.WebSdkWrapper.enabled,
			  hasAdblock: globalThis.WebSdkWrapper.hasAdblock(),
			  currentSdk: globalThis.skymenExexJSOnDom._OnCallFunction({"name": "deepCopyObjWithoutFunctions", "args": [globalThis.WebSdkWrapper.currentSdk, [currentSdk.sdk]]}),
			})
		}).catch(e => {
			globalThis.WebSdkWrapper.dispatch("onInit", {err: e})
		})
	`
  );

  execJs._DispatchToDom = function (e) {
    if (execJs.ignoreDispatch) return;
    execJs.PostToDOM("dispatch", e);
  };
  execJs._OnDispatch = function (e) {
    execJs.ignoreDispatch = true;
    globalThis.WebSdkWrapperBridge.dispatch(...e);
    execJs.ignoreDispatch = false;
  };
  execJs.AddDOMMessageHandler("dispatch", (e) => execJs._OnDispatch(e));

  globalThis.WebSdkWrapperBridge.onPause(() => {
    runtime.callFunction("M_Monetisation_OnPause");
  });
  globalThis.WebSdkWrapperBridge.onResume(() => {
    runtime.callFunction("M_Monetisation_OnResume");
  });
  globalThis.WebSdkWrapperBridge.onMute(() => {
    runtime.callFunction("M_Monetisation_OnMute");
  });
  globalThis.WebSdkWrapperBridge.onUnmute(() => {
    runtime.callFunction("M_Monetisation_OnUnmute");
  });
  globalThis.WebSdkWrapperBridge.onUnlockAllLevels(() => {
    runtime.callFunction("M_Monetisation_OnUnlockAllLevels");
  });
  globalThis.WebSdkWrapperBridge.onAdStarted(() => {
    runtime.callFunction("M_Monetisation_OnAdStarted");
  });
});

globalThis.WebSdkWrapperBridge = (function () {
  /*
  ==============  EVENT DISPATCHER  =================
  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  */
  const events = {};

  function listen(event, fn, { once = false } = {}) {
    events[event] = events[event] || [];
    events[event].push({
      fn,
      once,
    });
  }

  function listenOnce(event, fn) {
    listen(event, fn, { once: true });
  }

  function dispatch(event, ...data) {
    (events[event] || []).forEach((fnObj) => {
      fnObj.fn(...data);
    });
    events[event] = (events[event] || []).filter((fnObj) => !fnObj.once);
    globalThis.skymenExexJSOnDomRuntimeSide._DispatchToDom([event, ...data]);
  }
  /*
  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ==============  EVENT DISPATCHER  =================
  */
  const sdkContext = {};

  let currentSdk = null;
  let enabled = false;
  let hasAdblock = false;
  const Wrapper = {
    get enabled() {
      return enabled;
    },
    get currentSdk() {
      return currentSdk;
    },
    async init(name, debug = false, data = {}) {
      return new Promise((resolve, reject) => {
        listenOnce("onInit", (e) => {
          if (e.err) reject(e.err);
          else {
            enabled = e.enabled;
            hasAdblock = e.hasAdblock;
            currentSdk = e.currentSdk;
            resolve(e);
          }
        });
        globalThis.skymenExexJSOnDomRuntimeSide.CallFunction("handleInit", [
          [name, debug, data],
        ]);
      });
    },
    onPause(fn) {
      listen("pause", fn);
    },
    pause() {
      dispatch("pause");
    },
    onResume(fn) {
      listen("resume", fn);
    },
    resume() {
      dispatch("resume");
    },
    onMute(fn) {
      listen("mute", fn);
    },
    mute() {
      dispatch("mute");
    },
    onUnmute(fn) {
      listen("unmute", fn);
    },
    unmute() {
      dispatch("unmute");
    },
    onUnlockAllLevels(fn) {
      listen("unlockAllLevels", fn);
      globalThis.skymenExexJSOnDomRuntimeSide
        .Eval(`globalThis.WebSdkWrapper.onUnlockAllLevels(() => {
		globalThis.WebSdkWrapper.dispatch("unlockAllLevels");
	  })`);
    },
    hasAdblock() {
      return hasAdblock;
    },
    loadingStart() {
      dispatch("loadingStart");
    },
    loadingProgress(progress) {
      progress = Math.min(Math.max(0, progress), 100);
      dispatch("loadingProgress", progress);
    },
    loadingEnd() {
      dispatch("loadingEnd");
    },
    gameplayStart() {
      dispatch("gameplayStart");
    },
    gameplayStop() {
      dispatch("gameplayStop");
    },
    happyTime() {
      dispatch("happyTime");
    },
    levelStart(level) {
      dispatch("levelStart", level);
    },
    replayLevel(level) {
      dispatch("replayLevel", level);
    },
    score(score) {
      dispatch("score", score);
    },
    banner(data) {
      dispatch("banner", data);
    },
    interstitial(handleGameplayStart = false) {
      sdkContext.lastRequestedAd = "interstitial";
      if (!currentSdk || !currentSdk.hasAds) {
        dispatch("adStarted", sdkContext.lastRequestedAd);
        return Promise.resolve(false);
      }
      return new Promise((resolve) => {
        let gameplayStarted = sdkContext.gameplayStarted;
        // listen for ad start
        listenOnce("adStarted", () => {
          if (handleGameplayStart && gameplayStarted) Wrapper.gameplayStop();
          Wrapper.mute();
        });
        listenOnce("interstitialEnd", (...args) => {
          if (handleGameplayStart && gameplayStarted) Wrapper.gameplayStart();
          Wrapper.unmute();
          resolve(...args);
        });
        dispatch("interstitial");
      });
    },
    rewarded(handleGameplayStart = false) {
      sdkContext.lastRequestedAd = "rewarded";
      if (!currentSdk || !currentSdk.hasAds) {
        dispatch("adStarted", sdkContext.lastRequestedAd);
        return Promise.resolve(false);
      }
      return new Promise((resolve) => {
        let gameplayStarted = sdkContext.gameplayStarted;
        // listen for ad start
        listenOnce("adStarted", () => {
          if (handleGameplayStart && gameplayStarted) Wrapper.gameplayStop();
          Wrapper.mute();
        });
        listenOnce("rewardedEnd", (...args) => {
          if (handleGameplayStart && gameplayStarted) Wrapper.gameplayStart();
          Wrapper.unmute();
          resolve(...args);
        });
        dispatch("rewarded");
      });
    },
    onAdStarted(fn) {
      listen("adStarted", fn);
    },
    hasAds() {
      return currentSdk && currentSdk.hasAds;
    },
    listen,
    listenOnce,
    dispatch,
  };
  return Wrapper;
})();
