# Unity CDN loading screens

The 21 games listed in `scripts/prepare-unity-cdn.py` use a shared black loading
screen with centered Comic Sans text and download progress. Their existing Unity
builds and game SDK startup scripts are retained in an inert HTML template and
run after oversized assets have been reconstructed.

Game assets resolve against the page's jsDelivr base for
`55gms/assets@main/misc/<folder>/` (the [55gms/assets](https://github.com/55gms/assets) repo). The shared loading code and site-wide
resources stay on the app origin. Changes to game assets must reach GitHub's
`main` branch before these CDN URLs can serve them; deploying the HTML alone is
insufficient.

Files larger than 20,000,000 bytes are split into parts of at most 10,000,000
bytes. `unity-assets.json` records their paths, lengths and original SHA-256
hashes. The preparation script verifies reconstructed bytes before removing an
oversized original. Drift Hunters keeps its existing six-file Unity assembly;
each oversized source chunk is split again for CDN delivery.

The browser fetches the parts, combines them into blobs and routes Unity's fetch
and XHR requests to those blobs. It preserves the filenames Unity uses to select
its decompression path. JavaScript frameworks with `.js.br` filenames also use
JavaScript blobs because jsDelivr serves those files with a binary MIME type.
Missing or truncated chunks stop startup with a visible retry message.

After replacing a build with its new original files, regenerate the manifests
and chunks:

```sh
python3 scripts/prepare-unity-cdn.py
node --test tests/unity-cdn-assets.test.js tests/unity-cdn-games.test.js
```

The native tests check chunk reconstruction, every payload hash, file size
limits, inline script syntax, CDN bases, site resource routing and failure cases.
For a browser check before publication, mirror the CDN game-folder requests to
the local files without changing the page's base URL. Verify actual Unity
startup and the loading screen, then verify the real CDN again after publication.
