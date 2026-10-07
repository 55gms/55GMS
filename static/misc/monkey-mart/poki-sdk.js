// Stand-in for the Poki SDK: the game calls these, nothing is shown.
(() => {
  const done = (value) => () => Promise.resolve(value);
  const noop = () => {};
  window.PokiSDK = new Proxy(
    {
      init: done(),
      commercialBreak: done(),
      rewardedBreak: done(true),
      displayAd: noop,
      destroyAd: noop,
      getURLParam: () => "",
      shareableURL: done(""),
      isAdBlocked: () => false,
      getLanguage: () => "en",
    },
    { get: (sdk, name) => (name in sdk ? sdk[name] : noop) },
  );
})();

// The engine evals a host check that sends the page to Poki's site-lock on any
// other domain. Rewrite that code as it is evaluated so it reads a stand-in
// location that reports localhost and ignores writes.
(() => {
  const originalEval = window.eval;
  window.eval = function () {
    arguments[0] = arguments[0].replace("aHR0cHM6Ly9wb2tpLmNvbS9zaXRlbG9jaw==", "Iw==");
    arguments[0] = arguments[0].replace("'location'", "'xlocation'");
    arguments[0] = arguments[0].replace("] = _0x3296f7;", "]==_0x3296f7;");
    arguments[0] = arguments[0].replace("] = window[_0xcdc9(", "]==window[_0xcdc9(");
    return originalEval.apply(this, arguments);
  };

  const fake = { host: "localhost", hostname: "localhost", href: "https://localhost/", origin: "https://localhost/" };
  window.xlocation = new Proxy(location, {
    get: (target, property) => {
      if (property in fake) return fake[property];
      const value = target[property];
      return typeof value === "function" ? (...args) => value.apply(target, args) : value;
    },
    set: () => true,
  });

  navigator.sendBeacon = () => true;
})();
