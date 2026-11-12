# Unity games and GameLoader

Every Unity game in 55GMS shows the shared loading screen (55GMS badge, game title, MB progress bar). It is driven by `window.GameLoader`, defined in `static/assets/js/game-loader.js`. Read that file's comments if anything here is unclear; it is the source of truth.

## The two tags

Both paths start with the same two tags in `<head>`, placed **before the `<base>` tag** and before any game script:

```html
<script src="/assets/js/loader-ui.js?v=VERSION"></script>
<script
  src="/assets/js/game-loader.js?v=VERSION"
  data-title="Exact Game Name"
></script>
```

- `data-title` is the catalog `name`, HTML-escaped. Without it the screen falls back to a cleaned-up `<title>`.
- Do not add `defer`, `async`, or `type="module"`. The loader must be installed before the game's scripts run.
- Do not type a version. Leave any value and run `node scripts/bump-loader-version.js`, which rewrites every tag to the current one.
- Never edit `loader-ui.js`, `loader-ui.css`, `game-loader.js`, or `game-loader.css` just to import a game. If one truly has to change, run the bump script afterwards and commit the retagged pages too.

## Path A: the page boots Unity itself

Use when the game's own template calls `createUnityInstance` / `UnityLoader.instantiate` and no file was split. The game's code stays untouched; `GameLoader` watches its requests and startup.

Right after the two tags, still before `<base>`:

```html
<script>
  GameLoader.unity([
    ["Build/game.data.unityweb", 13631488],
    ["Build/game.framework.js.unityweb", 68768],
    ["Build/game.wasm.unityweb", 6029732],
  ]);
</script>
```

List each file the engine downloads with its size in bytes on disk (`stat -f%z <file>` on macOS), using the same relative path the page requests. Those sizes are what make the bar show real MB. `GameLoader.unity([])` works but shows only Unity's own percentage, so fill the list in when the files are local.

If the page downloads something itself before it starts Unity (unpacks a zip, fetches a data file by hand), pass `{ preloads: true }` as the second argument. Without it the screen is released shortly after page load while the port's own loader is still showing.

`static/misc/bankrob2/index.html` and `static/misc/1v1-lol/index.html` are worked examples.

## Path B: files were split, or the page has its own chunk downloader

Use when `scripts/split-game-files.js` split anything, or when the port ships an inline `fetchWithProgress` / `mergeFiles` / `getSize` downloader that writes `LOADING... x MB / y MB` into `#loading-text` (common in GN-Math ports). The page downloads through `GameLoader` and passes Unity blob URLs.

The whole page can be this small (`static/misc/spaceflight-simulator/index.html` is the model):

```html
<script>
  (async () => {
    const data = [
      ["Build/game.data.part1", 10000000],
      ["Build/game.data.part2", 7432110],
    ];
    const wasm = [["Build/game.wasm", 7989860]];
    const framework = [["Build/game.framework.js", 76053]];
    const loader = [["Build/game.loader.js", 106661]];
    GameLoader.prepare([...data, ...wasm, ...framework, ...loader]);

    const paths = (files) => files.map(([path]) => path);
    const [dataUrl, codeUrl, frameworkUrl, loaderUrl] = await Promise.all([
      GameLoader.merge(paths(data)),
      GameLoader.merge(paths(wasm), "application/wasm"),
      GameLoader.merge(paths(framework), "application/javascript"),
      GameLoader.merge(paths(loader), "application/javascript"),
    ]);
    await GameLoader.script(loaderUrl);

    const canvas = document.getElementById("unity-canvas");
    await createUnityInstance(canvas, {
      dataUrl,
      codeUrl,
      frameworkUrl,
      streamingAssetsUrl: new URL("StreamingAssets", document.baseURI).href,
      companyName: "...",
      productName: "...",
      productVersion: "...",
      showBanner(message, type) {
        type === "error"
          ? GameLoader.fail(new Error(message))
          : console.warn(message);
      },
    });
    GameLoader.finish();
    canvas.focus();
  })().catch(GameLoader.fail);
</script>
```

Copy `companyName`, `productName`, `productVersion`, and any other config keys from the original template's config object.

The API:

| Call                                           | Use                                                                                                                                 |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `GameLoader.prepare([[path, bytes], ...])`     | Declare every file and its size up front so the bar has a real total. The JSON from `split-game-files.js` is already in this shape. |
| `GameLoader.expect(bytes)`                     | A known total when per-file sizes are not known.                                                                                    |
| `await GameLoader.measure(paths)`              | Ask the CDN for sizes when nothing is known.                                                                                        |
| `GameLoader.merge(paths, mime)`                | Download the parts in order, return one blob URL. Works for a single unsplit file too.                                              |
| `GameLoader.download(path)`                    | One file as a `Blob`, when the page needs raw bytes.                                                                                |
| `GameLoader.script(url)`                       | Load a script and wait for it.                                                                                                      |
| `GameLoader.status("Extracting assets (3/9)")` | Name a step that is not a download.                                                                                                 |
| `GameLoader.finish()`                          | Hide the screen. Call it exactly where the game is running.                                                                         |
| `GameLoader.fail(error)`                       | Show the failure state. Route every catch here.                                                                                     |

Rules that keep it working:

- Start all merges together with `Promise.all`, so the screen does not flip to "Starting game" between files.
- Keep the original filename's meaning. Unity picks its decompression path from the name (`.br`, `.gz`, `.unityweb`); when passing blob URLs the name is gone, so compressed builds need `decompressionFallback` builds or the right MIME type. If a compressed build will not start from blobs, look at how `static/misc/ultrakill/` and `static/misc/bendy/` handle it.
- When converting a port that had its own downloader, delete all of it: `fetchWithProgress`, `mergeFiles`, `fetchPart`, `getSize`, `formatSize`, the byte counters, the `#loading-text` element and its CSS. Keep everything that is not loading UI (part lists, Unity config, resize handlers, fetch redirects).
- For `UnityLoader.instantiate` (Unity 5 to 2019), call `GameLoader.finish()` from `Module.onRuntimeInitialized`.
- After converting, the page must contain no `loading-text`, `fetchWithProgress`, `mergeFiles`, or `LOADING...` of its own.

## What the check should show

`node scripts/check-game.js <folder> --wait 40` on a Unity game: `loader: not showing`, a canvas with real dimensions, no failed requests, and a screenshot of the game's menu or first scene. An overlay that never clears means Unity started in a way the loader cannot see, or a file failed; report it rather than deleting the loader.
