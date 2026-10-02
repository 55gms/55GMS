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
  const bundle = "fonts_tmp_assets_all_c2712a523e390d12249a703a5257c93b.bundle";
  const [dataUrl, codeUrl, bundleUrl] = await Promise.all([
    loader.merge(["Build/jsab.data.unityweb.part1", "Build/jsab.data.unityweb.part2", "Build/jsab.data.unityweb.part3", "Build/jsab.data.unityweb.part4"]),
    loader.merge(["Build/jsab.wasm.code.unityweb.part1", "Build/jsab.wasm.code.unityweb.part2"]),
    loader.merge([`StreamingAssets/aa/WebGL/${bundle}.part1`, `StreamingAssets/aa/WebGL/${bundle}.part2`, `StreamingAssets/aa/WebGL/${bundle}.part3`]),
  ]);
  await loader.script("Build/UnityLoader.js");
  // Start Unity from the port's own build config, as the source port does, and
  // hand it the reconstructed files when it asks for the split ones. Everything
  // else (framework, StreamingAssets) resolves against the CDN as usual.
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    url = String(url);
    if (url.includes("jsab.data.unityweb")) url = dataUrl;
    else if (url.includes("jsab.wasm.code.unityweb")) url = codeUrl;
    else if (url.includes(bundle)) url = bundleUrl;
    return originalOpen.call(this, method, url, ...rest);
  };
  UnityLoader.instantiate("unityContainer", "Build/jsab.json", {
    onProgress(instance, progress) { if (progress === 1) loader.finish(); },
    Module: { onRuntimeInitialized: loader.finish },
  });
})().catch(GameLoader.fail);
