// Bridges imported engine startup to the same loading UI used by existing games.
(() => {
  window.GMSImportedAds = {
    async yandex(options) {
      const callbacks = options?.callbacks || {};
      const ads = window.GMSAds;
      if (!ads) {
        callbacks.onError?.(new Error("Ads are unavailable"));
        callbacks.onClose?.();
        return;
      }
      let opened = false;
      const pause = () => {
        if (!opened) {
          opened = true;
          callbacks.onOpen?.();
        }
      };
      ads.on("pause", pause);
      try {
        const result = await ads.showRewardedAd({ placement: "rewarded" });
        if (result.rewardGranted) callbacks.onRewarded?.();
        else if (!opened) callbacks.onError?.(new Error("No ad was completed"));
      } catch (error) {
        callbacks.onError?.(error);
      } finally {
        ads.off("pause", pause);
        callbacks.onClose?.();
      }
    },
  };
  const config = JSON.parse(
    document.getElementById("gms-import-config").textContent,
  );
  const files = config.files || [];
  const loader = window.GameLoader;
  if (config.engine === "unity") {
    loader.unity(files, { preloads: Boolean(config.preloads) });
    loader.expect(
      config.total || files.reduce((sum, [, size]) => sum + size, 0),
    );
  } else {
    loader.track(
      files.map(([file]) => file),
      config.total || 0,
    );
    if (config.engine === "construct3") {
      const wrapped = new WeakSet();
      const wrap = (Runtime) => {
        const prototype = Runtime?.prototype;
        const ready = prototype?._OnRuntimeReady;
        if (typeof ready !== "function" || wrapped.has(prototype))
          return Runtime;
        wrapped.add(prototype);
        prototype._OnRuntimeReady = function (...args) {
          const result = ready.apply(this, args);
          loader.finish();
          return result;
        };
        return Runtime;
      };
      let Runtime = window.RuntimeInterface;
      Object.defineProperty(window, "RuntimeInterface", {
        configurable: true,
        get: () => Runtime,
        set: (value) => (Runtime = wrap(value)),
      });
      if (Runtime) Runtime = wrap(Runtime);
    } else if (config.engine === "construct2") {
      // Minified C2 builds rename runtime fields. This exported callback is
      // invoked after the first layout starts, including in those builds.
      let registerSW = window.C2_RegisterSW;
      const ready = function (...args) {
        const result = registerSW?.apply(this, args);
        loader.finish();
        return result;
      };
      Object.defineProperty(window, "C2_RegisterSW", {
        configurable: true,
        get: () => ready,
        set: (callback) => {
          registerSW = callback;
        },
      });
      const poll = setInterval(() => {
        const runtime = window.cr_getC2Runtime?.();
        if (runtime && runtime.isLoading === false) {
          clearInterval(poll);
          loader.finish();
        }
      }, 50);
      window.addEventListener("pagehide", () => clearInterval(poll), {
        once: true,
      });
    }
  }
  if (config.parts && Object.keys(config.parts).length) {
    loader.prepare(config.partSizes || []);
    window.GameParts.serve(config.parts);
  }
})();
