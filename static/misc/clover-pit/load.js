// Adapted from GN-Math 716; upstream analytics and ad injection omitted.
(async () => {
  const loader = GameLoader;
  loader.prepare([
  [
    "Build/CloverPit.data.part1",
    20866662
  ],
  [
    "Build/CloverPit.data.part2",
    20866662
  ],
  [
    "Build/CloverPit.data.part3",
    4268778
  ],
  [
    "Build/CloverPit.wasm.part1",
    20866662
  ],
  [
    "Build/CloverPit.wasm.part2",
    20866662
  ],
  [
    "Build/CloverPit.wasm.part3",
    3444922
  ],
  [
    "Build/CloverPit.framework.js",
    451802
  ]
]);
  const [dataUrl, codeUrl, frameworkUrl] = await Promise.all([
    loader.merge(["Build/CloverPit.data.part1", "Build/CloverPit.data.part2", "Build/CloverPit.data.part3"]),
    loader.merge(["Build/CloverPit.wasm.part1", "Build/CloverPit.wasm.part2", "Build/CloverPit.wasm.part3"], "application/wasm"),
    loader.merge(["Build/CloverPit.framework.js"], "application/javascript"),
  ]);
  await loader.script("Build/CloverPit.loader.js");
  const canvas = document.getElementById("unity-canvas");
  const config = {
    dataUrl, codeUrl, frameworkUrl,
    streamingAssetsUrl: new URL("StreamingAssets", document.baseURI).href,
    companyName: "Panik Arcade",
    productName: "Clover Pit",
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
