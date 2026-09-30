// Adapted from GN-Math 666; upstream analytics and ad injection omitted.
(async () => {
  const loader = GameLoader;
  loader.prepare([
  [
    "Build/WebGL.data.zip",
    4786534
  ],
  [
    "Build/WebGL.wasm.zip",
    11250073
  ],
  [
    "Build/WebGL.framework.js",
    417514
  ]
]);
  await Promise.all([
    loader.script("unarchiver.min.js"),
    loader.script("https://cdn.jsdelivr.net/gh/bubbls/youtube-playables@main/ytgame.js"),
  ]);
  async function unzip(path, name, type) {
    const archive = await Unarchiver.open(await loader.download(path));
    const entry = archive.entries.find(entry => entry.is_file && entry.name === name);
    if (!entry) throw new Error(`Missing ${name} in ${path}`);
    return loader.objectUrl(new Blob([await entry.read()], { type }));
  }
  const [dataUrl, codeUrl, frameworkUrl] = await Promise.all([
    unzip("Build/WebGL.data.zip", "WebGL.data", "application/octet-stream"),
    unzip("Build/WebGL.wasm.zip", "WebGL.wasm", "application/wasm"),
    loader.merge(["Build/WebGL.framework.js"], "application/javascript"),
  ]);
  await loader.script("Build/WebGL.loader.js");
  const canvas = document.getElementById("unity-canvas");
  const config = {
    dataUrl, codeUrl, frameworkUrl,
    streamingAssetsUrl: new URL("StreamingAssets", document.baseURI).href,
    companyName: "Max Games Studios",
    productName: "Stick War: Legacy",
    productVersion: "1.0",
    devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    showBanner(message, type) {
      if (type === "error") loader.fail(new Error(message));
      else console.warn(message);
    },
  };
  window.unityGameInstance = await createUnityInstance(canvas, config);
  loader.finish();
})().catch(GameLoader.fail);
