// Adapted from GN-Math 826; upstream analytics and ad injection omitted.
(async () => {
  const loader = GameLoader;
  loader.prepare([
  [
    "Build/jsab.data.unityweb.part1",
    20866662
  ],
  [
    "Build/jsab.data.unityweb.part2",
    20866662
  ],
  [
    "Build/jsab.data.unityweb.part3",
    20866662
  ],
  [
    "Build/jsab.data.unityweb.part4",
    2125413
  ],
  [
    "Build/jsab.wasm.code.unityweb.part1",
    20866662
  ],
  [
    "Build/jsab.wasm.code.unityweb.part2",
    9667414
  ],
  [
    "Build/jsab.wasm.framework.unityweb",
    548555
  ],
  [
    "StreamingAssets/aa/WebGL/fonts_tmp_assets_all_c2712a523e390d12249a703a5257c93b.bundle.part1",
    20866662
  ],
  [
    "StreamingAssets/aa/WebGL/fonts_tmp_assets_all_c2712a523e390d12249a703a5257c93b.bundle.part2",
    20866662
  ],
  [
    "StreamingAssets/aa/WebGL/fonts_tmp_assets_all_c2712a523e390d12249a703a5257c93b.bundle.part3",
    2281329
  ]
]);
  const [dataUrl, codeUrl, frameworkUrl, bundleUrl] = await Promise.all([
    loader.merge(["Build/jsab.data.unityweb.part1", "Build/jsab.data.unityweb.part2", "Build/jsab.data.unityweb.part3", "Build/jsab.data.unityweb.part4"]),
    loader.merge(["Build/jsab.wasm.code.unityweb.part1", "Build/jsab.wasm.code.unityweb.part2"], "application/wasm"),
    loader.merge(["Build/jsab.wasm.framework.unityweb"], "application/javascript"),
    loader.merge(["StreamingAssets/aa/WebGL/fonts_tmp_assets_all_c2712a523e390d12249a703a5257c93b.bundle.part1", "StreamingAssets/aa/WebGL/fonts_tmp_assets_all_c2712a523e390d12249a703a5257c93b.bundle.part2", "StreamingAssets/aa/WebGL/fonts_tmp_assets_all_c2712a523e390d12249a703a5257c93b.bundle.part3"]),
  ]);
  await loader.script("Build/UnityLoader.js");
  // The source port splits this addressable bundle too. Keep the game's
  // StreamingAssets URL intact and redirect only the reconstructed bundle.
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    if (String(url).includes("fonts_tmp_assets_all_c2712a523e390d12249a703a5257c93b.bundle")) url = bundleUrl;
    return originalOpen.call(this, method, url, ...rest);
  };
  const config = await (await fetch("Build/jsab.json")).json();
  Object.assign(config, { dataUrl, wasmCodeUrl: codeUrl, wasmFrameworkUrl: frameworkUrl,
    streamingAssetsUrl: new URL("StreamingAssets", document.baseURI).href });
  UnityLoader.instantiate("unityContainer", loader.objectUrl(new Blob([JSON.stringify(config)], { type: "application/json" })), {
    onProgress(instance, progress) { if (progress === 1) loader.finish(); },
  });
})().catch(GameLoader.fail);
