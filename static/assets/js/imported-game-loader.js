// Bridges imported engine startup to the same loading UI used by existing games.
(() => {
  const config = JSON.parse(document.getElementById("gms-import-config").textContent);
  const files = config.files || [];
  const loader = window.GameLoader;
  if (config.engine === "unity") {
    loader.unity(files, { preloads: Boolean(config.preloads) });
    loader.expect(config.total || files.reduce((sum, [, size]) => sum + size, 0));
  } else {
    loader.track(files.map(([file]) => file), config.total || 0);
    if (config.engine === "construct3") {
      const wrapped = new WeakSet();
      const wrap = (Runtime) => {
        const prototype = Runtime?.prototype;
        const ready = prototype?._OnRuntimeReady;
        if (typeof ready !== "function" || wrapped.has(prototype)) return Runtime;
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
      const poll = setInterval(() => {
        const runtime = window.cr_getC2Runtime?.();
        if (runtime && runtime.isLoading === false) {
          clearInterval(poll);
          loader.finish();
        }
      }, 50);
      window.addEventListener("pagehide", () => clearInterval(poll), { once: true });
    }
  }
  if (config.parts && Object.keys(config.parts).length) {
    loader.prepare(config.partSizes || []);
    window.GameParts.serve(config.parts);
  }
})();
