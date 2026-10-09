# Deploying 55GMS

Production is one server (SSH host `55gms`): the app in `/root/55gms`, run by
pm2 as `55gms` (10 cluster workers, port 8080), behind Caddy.

## What happens on a push to main

The `Deploy` workflow (`.github/workflows/deploy.yml`) runs:

1. **tidy** formats changed `.js` and `.md` files with Prettier and pushes a
   commit if anything changed. A failure here does not block the deploy.
2. **check** takes the tip of `main` (games excluded), installs, syntax-checks
   the server code and deploy scripts, runs `npm run build --if-present`, and
   runs `scripts/build/check-output.js` on the result. If the built tree still
   exposes readable catalogue titles or page text, the job fails and nothing
   is deployed (see [The build](#the-build)).
3. **deploy** SSHes to the server and asks for that commit.

On the server, `/root/deploy/entry.sh` checks the commit is on `main`, takes a
lock, then runs that commit's `deploy/deploy.sh`, which:

- refuses to run if tracked files on the server have local changes;
- checks the commit out in place;
- runs `npm install` if `package-lock.json` changed;
- runs `npm run build --if-present`;
- reloads only if something outside `static/`, `docs/`, `scripts/`,
  `deploy/`, `.github/`, `test(s)/` and `*.md` changed, or the build output
  appeared or disappeared. Before reloading it boots the new code on port 8099
  (the preflight); if that fails, no live worker is touched;
- checks `/` and `/s` on port 8080.

If any step fails, the previous commit is put back and the workflow run goes
red. Commits that only add or change games do not reload the app, so chat and
proxy connections are not dropped.

## Rolling back

Actions tab → Deploy → Run workflow → `rollback`. This deploys the previous
successful commit. Running it twice returns to where you started.

## Looking at the server

- `/root/deploy/releases.log`: every successful deploy, newest last.
- `/root/deploy/deploy.log`: full output of every deploy.
- `/root/deploy/preflight.log`: output of the last preflight boot.
- `pm2 logs 55gms`: the app.

To run a deploy by hand on the server:

    SSH_ORIGINAL_COMMAND="deploy $(git -C /root/55gms rev-parse origin/main)" /root/deploy/entry.sh

## The build

`npm run build` (`scripts/build.js`) writes a transformed copy of `static/`
for production to serve. It hides the site's own text and code from anyone
reading the files: catalogue titles, page text, and the app scripts. The
sources in `static/` stay as they are, and are what you edit. CI and every
deploy run the build; it takes a few seconds.

### What is served

`index.js` picks the static root once, at boot:

1. `STATIC_ROOT`, if set (pm2 sets it from `ecosystem.config.cjs`:
   `dist/current/static` when that exists, else `static`);
2. else `dist/current/static`, if it exists;
3. else `static/`.

So after a local `npm run build`, plain `node .` serves the built copy, and
edits under `static/` do not show until the next build. To serve the sources,
run `STATIC_ROOT=static node .` or delete `dist/`. The startup log prints the
root in use (`Static: ...`).

### Stages

The stages live in `scripts/build/` and run in this order. Each one edits the
copy in place.

1. **prepare** (`prepare.js`) copies `static/` into the build directory.
   `misc/` and `img/` are not copied: the build gets absolute symlinks to
   `static/misc` and `static/img`. Games and images are therefore never
   transformed, and a change to them is live as soon as it is checked out.
   A checkout without `static/misc/` (CI) builds fine.
2. **javascript** (`javascript.js`) minifies (terser) and obfuscates
   (javascript-obfuscator: encoded string table, split strings, control-flow
   flattening) every `.js` file directly in `assets/js/`. It skips
   `easteregg.min.js`, `frame-runtime.js` and the `sdks/` directory, and fails
   if that skip list no longer matches what is on disk.
3. **catalogue** (`catalogue.js`) encodes every `.json` file in
   `assets/json/load/` (`g.json`, `apps.json`, `packs.json`) and fails unless
   decoding gives back the source. The other JSON files are left as they are.
4. **html** (`html.js`) works on the pages at the top level (`static/*.html`):
   obfuscates inline scripts, minifies the page and its inline CSS, then
   rewrites visible text, and the `alt`, `aria-label`, `title`, `placeholder`
   and `value` attributes, as numeric entities (`&#71;&#97;...`). The contents
   of `script`, `style`, `pre`, `textarea` and `template` are not encoded. It
   fails if a page's visible text is not the same before and after.
5. **asset-version** (`asset-version.js`) rewrites references to
   `/assets/....js` and `/assets/....css` so they carry `?v=<assetVersion>`,
   replacing any query the source had. It fails unless every reference it
   found ends up versioned.

Then `manifest.json` is written and `dist/current` is swapped. A stage that
fails stops the build before the swap, so the previous build stays live.

Never changed by any stage: `sw.js`, `assets/sj/`,
`assets/js/frame-runtime.js`, `assets/js/easteregg.min.js` and
`assets/js/sdks/` are byte-for-byte the source files. CSS files, fonts and
images are copied as they are. One caveat: the asset-version stage reads
`frame-runtime.js` and `easteregg.min.js` too, and would rewrite a literal
`/assets/....js` reference if one were ever added to them. Today their only
such references are to `/assets/lib/vendor-*`, which are exempt.

### Catalogue format

A built catalogue file is one base64url string. Decoded, the first 16 bytes
are a key and the rest is the JSON, XORed with that key (byte `i` with key
byte `i % 16`). The key is random per build and is the same for the three
files of one build.

The key is inside each file, so this hides the titles from a text search or a
content filter, not from someone who reads the decoder. There is no separate
boot script carrying the key, although the design spec describes one. The
browser decodes it in `readCatalogue`, which `games.js`, `apps.js`, `packs.js`
and `loader-ui.js` each carry; it reads plain JSON as it is, so the same
scripts work on the unbuilt sources. Anything new that fetches a catalogue
needs the same decoder.

### What stays readable, by design

- Top-level function names in the app scripts (such as `loadGames`). Global
  renaming is off so that inline handlers in pages (`onclick="..."`) and
  globals shared between scripts (`$`, `io`, `frameRuntime`) keep resolving.
- `<meta name="description">` content, and other attributes outside the five
  listed above (`href`, `class`, `id`, inline handler code).
- The export names of `unity-cdn-loader.js` and `unity-cdn-assets.js`. These
  two are ES modules loaded by game pages under `static/misc/`, which are
  never rebuilt, so their file names and export names must stay stable. The
  build parses a file as a classic script first and as a module only if that
  fails; either way exports keep their names.

### Asset versions

Each build draws a new random `assetVersion`. The asset-version stage applies
it to references in every `.html` file of the copy (below the top level too,
such as `assets/404/loading.html`) and to references still readable in the
scripts directly in `assets/js/`. Not affected:

- `/assets/lib/vendor-*` (the proxy bundles) and `/assets/js/sdks/*` keep
  their own versions;
- URLs that app scripts build at runtime keep their source versions. Their
  strings are already encoded when this stage runs. The loader assets are the
  main case: `loader-ui.js` has its own `VERSION`, still bumped with
  `scripts/bump-loader-version.js`;
- game pages under `static/misc/` keep the `?v=` they were written with.

Every build has a new version, so after every deploy, a games-only one
included, browsers fetch the pages' scripts and stylesheets again.

### The dist directory

    dist/
      current -> builds/<id>         symlink, swapped by rename
      builds/<id>/manifest.json      id, assetVersion, catalogueKey, routes
      builds/<id>/static/            the tree that is served
      builds/<id>/static/misc -> <repo>/static/misc
      builds/<id>/static/img  -> <repo>/static/img

`dist/` is git-ignored. `<id>` is random, 16 hex characters. A build is not
reproducible: two builds of the same commit differ in id, version and key.

The three newest builds are kept (by directory time; the new build and the one
`dist/current` points at are never removed). Nothing uses the older ones
automatically: a rollback checks out the previous commit and builds it again.

The server resolves `dist/current/static` on every request, so a swap is
served at once, without a reload. The first deploy that produces
`dist/current` does reload the app, because the static root itself changes.
`manifest.json` is read at boot only; nothing consumes it yet (`routes` is
empty, reserved for the later phases).

The build tools (`terser`, `javascript-obfuscator`, `html-minifier-terser`)
are `devDependencies`. The server's `npm install` must keep installing them:
do not add `--omit=dev` or set `NODE_ENV=production` for the install.

### Checking a build by hand

    npm run build
    node scripts/build/check-output.js

The second command is what the CI `check` job runs after its own build. It
compares `dist/current/static` with `static/` and exits non-zero, listing each
problem, if:

- a catalogue file is not base64url, or a title from its source can be read in
  it (as it is, or after plain base64 decoding);
- a word of a page's visible text can be read as raw text in the built page,
  outside scripts, styles and tags, or the page has no numeric entities;
- an app script is identical to its source, or still contains the plain
  catalogue path `/assets/json/load/`.

It takes the two directories as arguments, so
`node scripts/build/check-output.js static` shows what a failure looks like.
It proves text is hidden, not that the site works. For that, serve the build
and look:

    PORT=8099 node .          # log line "Static: .../dist/current/static"
    curl -s localhost:8099/assets/json/load/g.json | head -c 40   # no "[" or "{"
    curl -s localhost:8099/ | grep -c '&#'                         # at least 1

Then open `/`, `/g`, `/a` and `/s` in a browser: the catalogues must list and
search, a game must start, and the console must be free of errors.

### Not yet verified on a built tree

Check these by eye before the first production deploy of the build, or right
after it:

- the pages behind login: chat and account;
- proxied browsing through `/b`;
- the deploy path end to end: the first deploy that produces `dist/current`
  reloads the app, the health check passes, and a later games-only deploy
  swaps the build without a reload.

### Not built

Phases 3 to 5, which cover the proxy surface, are not built. The plan for them
is `docs/superpowers/specs/2026-10-08-build-phases-3-5.md`. The design of what
exists is `docs/superpowers/specs/2026-10-08-deploy-and-build-design.md`, and
the implementation plan is
`docs/superpowers/plans/2026-10-08-build-obfuscation.md`; where they differ
from this page (the boot script, for one), the code and this page are right.

## Setting it up again

- `/root/deploy/entry.sh` and `/root/deploy/deploy.sh` are copies of the files
  in `deploy/`. Copy `entry.sh` again whenever `deploy/entry.sh` changes; the
  `deploy.sh` copy is only a fallback for commits older than the pipeline.
- The deploy key's line in `/root/.ssh/authorized_keys` starts with
  `command="/root/deploy/entry.sh",no-pty,no-port-forwarding,no-agent-forwarding,no-X11-forwarding`.
- Repository secrets: `DEPLOY_SSH_KEY` (private key), `DEPLOY_HOST`,
  `DEPLOY_KNOWN_HOSTS` (output of `ssh-keyscan -t ed25519 <host>`).
- pm2 is started with `pm2 start ecosystem.config.cjs && pm2 save`.

## Custom domains

Caddy's catch-all block proxies every hostname to `localhost:8080` and issues
certificates on demand. Deploys never touch Caddy; they only need port 8080
to keep answering, which the rolling reload does.
