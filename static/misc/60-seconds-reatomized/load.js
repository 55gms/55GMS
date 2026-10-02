// Adapted from GN-Math 858; upstream analytics and ad injection omitted.
// Match the loading screen accent to the site theme chosen in settings.
try {
  document.documentElement.dataset.theme =
    localStorage.getItem("siteTheme") || "legacy";
} catch {}

(async () => {
  const loader = GameLoader;
  loader.prepare([
  [
    "Build/Build.data.unityweb.0",
    20971520
  ],
  [
    "Build/Build.data.unityweb.1",
    20971520
  ],
  [
    "Build/Build.data.unityweb.2",
    20971520
  ],
  [
    "Build/Build.data.unityweb.3",
    20971520
  ],
  [
    "Build/Build.data.unityweb.4",
    20971520
  ],
  [
    "Build/Build.data.unityweb.5",
    11224551
  ],
  [
    "Build/Build.wasm.unityweb",
    10251491
  ],
  [
    "Build/Build.framework.js.unityweb",
    120325
  ]
]);
  const [dataUrl, codeUrl, frameworkUrl] = await Promise.all([
    loader.merge(["Build/Build.data.unityweb.0", "Build/Build.data.unityweb.1", "Build/Build.data.unityweb.2", "Build/Build.data.unityweb.3", "Build/Build.data.unityweb.4", "Build/Build.data.unityweb.5"]),
    loader.merge(["Build/Build.wasm.unityweb"], "application/wasm"),
    loader.merge(["Build/Build.framework.js.unityweb"], "application/javascript"),
  ]);
  await loader.script("Build/Build.loader.js");
  const canvas = document.getElementById("unity-canvas");
  const config = {
    dataUrl, codeUrl, frameworkUrl,
    streamingAssetsUrl: new URL("StreamingAssets", document.baseURI).href,
    companyName: "Robot Gentleman",
    productName: "60 Seconds! Reatomized",
    productVersion: "1.0",
    devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    showBanner(message, type) {
      if (type === "error") loader.fail(new Error(message));
      else console.warn(message);
    },
  };
  window.unityInstance = await createUnityInstance(canvas, config);
  loader.finish();
})().catch(GameLoader.fail);
