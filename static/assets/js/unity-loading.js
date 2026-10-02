// Loading screen for Unity games that boot from their own page template rather
// than game-loader.js or unity-cdn-loader.js. Include it right after
// loader-ui.js, before the page's <base> and game scripts. It only observes
// Unity's own progress and startup; the game's loading code is left untouched.
(() => {
  const overlay = document.createElement("div");
  overlay.id = "unity-loading";
  const title = document.currentScript?.dataset.title;
  // data-preloads: the page downloads files itself before it starts Unity, so
  // the screen must stay up through that wait instead of being released.
  const preloads = document.currentScript?.dataset.preloads !== undefined;
  if (title) overlay.dataset.title = title;
  document.documentElement.appendChild(overlay);
  const ui = LoaderUI.mount(overlay);
  ui.busy();
  let started = false;
  let finished = false;

  function start() {
    started = true;
    if (!finished) overlay.hidden = false;
  }

  // Unity reports 0.9 once every file is in, then 1 when the game is running.
  function progress(amount) {
    if (!finished) ui.ratio(amount / 0.9, amount >= 0.9);
  }

  function ready() {
    finished = true;
    overlay.hidden = true;
  }

  function fail() {
    if (finished) return;
    overlay.hidden = false;
    ui.fail();
  }

  function watchGlobal(name, wrap) {
    let value = window[name];
    // A global an earlier script declared (`var UnityLoader`) cannot be
    // redefined. It is already set, so wrap it where it stands.
    if (Object.getOwnPropertyDescriptor(window, name)?.configurable === false) {
      try {
        window[name] = wrap(value);
      } catch {}
      return;
    }
    Object.defineProperty(window, name, {
      configurable: true,
      enumerable: true,
      get: () => value,
      set(next) {
        value = wrap(next);
      },
    });
    if (value) value = wrap(value);
  }

  // Unity 2020+: createUnityInstance(canvas, config, onProgress).
  const wrappedFactories = new WeakSet();
  function wrapFactory(create) {
    if (typeof create !== "function" || wrappedFactories.has(create))
      return create;
    const wrapped = function (canvas, config, onProgress, ...rest) {
      start();
      const report = (amount) => {
        onProgress?.(amount);
        progress(amount);
      };
      const result = create.call(this, canvas, config, report, ...rest);
      Promise.resolve(result).then(ready, fail);
      return result;
    };
    wrappedFactories.add(wrapped);
    return wrapped;
  }
  watchGlobal("createUnityInstance", wrapFactory);
  // A function declaration can replace the accessor above. Capture script load
  // before the game's onload handler calls the newly declared Unity factory.
  document.addEventListener(
    "load",
    (event) => {
      if (event.target.tagName === "SCRIPT" && window.createUnityInstance) {
        window.createUnityInstance = wrapFactory(window.createUnityInstance);
      }
    },
    true,
  );

  // Unity 2017-2019: UnityLoader.instantiate(container, url, { onProgress }).
  watchGlobal("UnityLoader", (loader) => {
    if (!loader?.instantiate) return loader;
    const instantiate = loader.instantiate;
    loader.instantiate = function (container, config, options = {}) {
      start();
      const onProgress = options.onProgress;
      return instantiate.call(this, container, config, {
        ...options,
        onProgress(instance, amount) {
          onProgress?.(instance, amount);
          progress(amount);
          if (amount === 1) ready();
        },
      });
    };
    return loader;
  });

  // Unity 5.x exposes a global Module and reports no usable progress.
  watchGlobal("Module", (module) => {
    if (!module || typeof module !== "object") return module;
    start();
    let postRun = module.postRun || [];
    if (typeof postRun === "function") postRun = [postRun];
    Object.defineProperty(module, "postRun", {
      configurable: true,
      get: () => postRun,
      set(callbacks) {
        postRun = [
          ...(Array.isArray(callbacks) ? callbacks : [callbacks]),
          ready,
        ];
      },
    });
    module.postRun = postRun;
    return module;
  });

  // Never trap a page whose startup these hooks did not see, such as a game
  // that waits for a click. The screen comes back if Unity starts later.
  if (!preloads)
    window.addEventListener("load", () =>
      setTimeout(() => {
        if (!started) overlay.hidden = true;
      }, 1500),
    );
})();
