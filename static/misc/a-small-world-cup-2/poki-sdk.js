// Stand-in for the Poki SDK: the game calls these, nothing is shown.
(() => {
  const done = (value) => () => Promise.resolve(value);
  const noop = () => {};
  window.PokiSDK = new Proxy(
    {
      init: done(),
      initWithVideoHB: done(),
      commercialBreak: done(),
      rewardedBreak: done(true),
      displayAd: noop,
      destroyAd: noop,
      isAdBlocked: () => false,
      getURLParam: () => "",
      getLanguage: () => "en",
      getIsoLanguage: noop,
      shareableURL: done(""),
      generateScreenshot: done(null),
      getLeaderboard: done([]),
      getUser: done({}),
      getToken: done(null),
      login: () => Promise.reject(new Error("Login is not available")),
      customEvent: () => ({ doNothing: noop }),
    },
    { get: (sdk, name) => (name in sdk ? sdk[name] : noop) },
  );

  // Unity builds call these as window functions and wait for the reply through
  // the bridge object they register with initPokiBridge.
  let bridge = null;
  let initBridge;
  const send = (method, value) => {
    if (!window.unityGame || !bridge) return;
    try {
      if (value === undefined) window.unityGame.SendMessage(bridge, method);
      else window.unityGame.SendMessage(bridge, method, value);
    } catch {}
  };
  Object.defineProperty(window, "initPokiBridge", {
    configurable: true,
    get: () =>
      initBridge &&
      function (name, ...rest) {
        bridge = name;
        return initBridge.call(this, name, ...rest);
      },
    set(value) {
      initBridge = value;
    },
  });
  window.getUser = () => send("getUserResolved", "{}");
  window.getToken = () => send("getTokenRejected");
  window.login = () => send("loginRejected");
  window.properUnityStringify = (value) => {
    if (value == null) return "";
    return typeof value === "string" ? value : JSON.stringify(value);
  };
})();
