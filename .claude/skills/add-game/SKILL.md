---
name: add-game
description: Add a game to the 55GMS repository from a link. Use whenever the user gives a game URL or a GN-Math ID and wants it added, imported, ripped, ported, copied, or installed into 55GMS, even if they only paste a link and say "add this". Covers both sources (a gn-math.dev link or numeric ID, or any website hosting the game), ripping website games with scripts/rip-game.js, cleaning out portal ad code, pointing the page at jsDelivr, finding the cover and author, adding the g.json catalog entry, wiring Unity games into the shared GameLoader loading screen, and committing at most one commit per repo per turn, however many games the turn adds.
---

# Add a Game to 55GMS

Take one link, end with a playable game in the catalog. A game lives in **two repos**, and lands as **one commit in each**. Commit as little as possible: at most one commit per repo per turn. When a turn adds or replaces several games, all their files go in one assets commit and all their listings in one 55GMS commit, never a pair per game:

1. **The files**, in the `55gms/assets` repo (cloned next to 55GMS, at `../assets`): the cleaned game folder `misc/<folder>/` with everything except the pages, plus the cover. This is what jsDelivr serves.
2. **The listing**, in 55GMS: the page(s) `static/misc/<folder>/*.html` with the jsDelivr `<base>`, the catalog entry with author, and the Unity loading screen when the game is Unity.

55GMS holds no game files, only pages: jsDelivr serves HTML as plain text, so pages come from the site, and everything else comes from `cdn.jsdelivr.net/gh/55gms/assets@<commit>/misc/<folder>/`, where `<commit>` is the full hash of the assets commit that holds the game's files. Never write `@main`: jsDelivr keeps asking GitHub whether a branch changed, and when GitHub answers "429: Too Many Requests" jsDelivr can cache that error page in place of the file. A URL on a commit is fetched once and kept for good. Never `git add` a game's non-HTML files in 55GMS. If `../assets` is missing, clone `https://github.com/55gms/assets` there (or set `ASSETS_REPO`); the scripts refuse to run without it.

Read [references/55gms-layout.md](references/55gms-layout.md) before editing; it has the paths, the catalog contract, and the script reference. Commit directly to `main` with semantic messages and leave unrelated worktree changes alone.

## 1. Work out the source

- **GN-Math**: a `gn-math.dev/?id=<N>` URL or a bare number. Follow [references/gn-math.md](references/gn-math.md) to fetch the game, then rejoin this file at step 3.
- **Any other website**: rip it (step 2).

Before fetching anything, search `static/assets/json/load/g.json` and `static/misc/` for the game's name and likely folder. If it is already there, update it rather than adding a second copy.

Pick the folder name now: lowercase, hyphenated, descriptive (`slime-dunk`, not `slimedunk` or `game1`). It becomes part of the CDN URL, so renaming later means re-doing the base.

## 2. Rip a website game

```bash
node scripts/rip-game.js <url> --name <folder> --headless --wait 30
```

The script opens the page in Chrome, follows nested iframes down to the game itself, saves everything the game frame requests, then loads the copy with the network cut off and fetches whatever 404s. When it finishes, the pages (`*.html`) are in `static/misc/<folder>/` and every other file is in `../assets/misc/<folder>/`. It prints a screenshot path; **look at the screenshot**. A rendered game means the copy stands on its own. A black or loading screen means something is still missing, so read the "still missing" and "still requested from other sites" lists it printed.

- Games load later levels and assets on demand, and a headless run only sees what loads by itself. If the game has many levels, or the report looks thin for the kind of game it is, tell the user that a visible run (`node scripts/rip-game.js <url> --name <folder>`, play a while, press Enter) will capture more, and let them decide.
- If the page it landed on is still a portal wrapper rather than the game, rerun with the inner iframe's URL.
- `--force` replaces an existing folder (in both repos).

### Clean the folder

The game should contain nothing that belongs to the site it came from. The files to clean are in `../assets/misc/<folder>/`; the page that references them is `static/misc/<folder>/index.html`. Portals wrap games in their own ad, analytics, and account code, and that code tries to phone home from 55GMS.

1. Look at `_ext/`. It holds everything that came from a host other than the game's own directory. For each file, decide: does the game need it (an engine library from a CDN, a font), or is it the portal's (ad SDKs, `save-sync`, analytics, consent banners)? Delete the portal's files. Move the ones the game needs into the game folder proper and fix the reference, so the page no longer contains `/misc/<folder>/_ext/` paths; those are absolute and would not go through the CDN base.
2. If the game calls an ad SDK (`grep -ro "PokiSDK\.[a-zA-Z]*\|CrazyGames\.SDK[.a-zA-Z]*\|gdsdk\.[a-zA-Z]*\|YaGames\|famobi\.[a-zA-Z]*"`), it will crash without one. Replace the portal's SDK script with a stand-in that answers every call and shows nothing. [assets/poki-sdk-stub.js](assets/poki-sdk-stub.js) is a working Poki one: copy it to `../assets/misc/<folder>/poki-sdk.js` and point the script tag at it. For other SDKs write the equivalent, resolving the promises the game awaits.
   **A stand-in never grants a reward.** Its rewarded call must answer "not watched" (Poki `rewardedBreak` resolves `false`, CrazyGames `requestAd("rewarded")` calls `adError`, Yandex `showRewardedVideo` calls `onOpen`/`onClose` but never `onRewarded`, Famobi `rewardedAd` reports `rewardGranted: false`, GameDistribution `showAd("rewarded")` rejects), and never asks the player through `confirm()`. Real rewarded ads come from 55GMS Ads: `scripts/add-ads-sdk.js` (step 6) puts the gms-ads `sdk.min.js` tag in the page, and its adapters replace the stand-in's rewarded call with a real ad that grants the reward only when the ad does. The adapters cover Poki, CrazyGames (v2/v3 SDK), GameDistribution, Yandex and Famobi; keep the stand-in under those globals so they find it. A rewarded path they cannot reach (a Unity template's own `RewardedShow`, a v1 CrazyGames gameframe, another portal) gets a hook in the game's code that calls `GMSAds.showRewardedAd({ placement: "rewarded" })` and sends the reward only when the result has `rewardGranted` (it always resolves, never rejects); `misc/war-the-knights/load.js` in the assets repo is an example. If there is no hook and no adapter, the rewarded call simply fails: that is correct, a free reward is not.
3. Remove tags that point at files that do not exist (`<link rel="manifest">`, missing icons), tracker snippets, and any remaining mention of the source site (`grep -rl <source-domain>`).
4. Run `node scripts/split-game-files.js <folder>`. jsDelivr refuses files over 20 MB, so anything larger is split into 10 MB `.partN` pieces; keep the JSON it prints, step 5 needs it. If it split anything, the page must be converted to download the parts (Unity: step 5; other engines: write the equivalent with `GameLoader.merge`, or stop and tell the user).
5. Run `node scripts/check-game.js <folder>` and look at the screenshot. The cleaned copy has to still run before it is committed.

## 3. Commit one: the files

Add the cover first (see Cover in step 4), so it goes in with the files. Then, in the assets repo:

```bash
git -C ../assets add misc/<folder>
git -C ../assets commit -m "feat: add <Game Name> game files"
```

Only the game folder. No page lands here: the pages are already in `static/misc/<folder>/` and are committed in step 6.

For a GN-Math game whose assets stay on GN-Math's own CDN, there is nothing but the cover to commit here.

Now take the commit's full hash. It is the `<commit>` in every 55gms/assets URL you write in step 4 (the base and the catalog image):

```bash
git -C ../assets log -1 --format=%H -- misc/<folder>
```

The hash names this exact commit, so it stays valid when the commit is pushed as it is. It changes if the commit is amended or rebased; whenever that happens, take the new hash and update the base and the image to it.

**Pushing.** A pinned URL only works on the CDN once its commit is on GitHub. Push `../assets` now if the user has said to push; otherwise carry on (the checker below reads the clone and does not need the push) and say clearly at the end that the game will not load on the live site until both repos are pushed. Push assets before 55GMS, so the page never goes live ahead of its files. Push with a plain `git push`. If it is rejected because the remote moved, `git pull --rebase` gives the commit a new hash: update the URLs, or run `node scripts/pin-game-assets.js ../assets` after the push, which pins every 55gms/assets URL in 55GMS to the last pushed commit that changed its folder. Before pushing 55GMS, check that the hash is on the remote: `git -C ../assets branch -r --contains <commit>` must list `origin/main`.

## 4. Point the page at jsDelivr, add the cover and the catalog entry

### Base

Put this as early in `<head>` as possible, after the charset meta and before any tag with a relative URL:

```html
<base href="https://cdn.jsdelivr.net/gh/55gms/assets@<commit>/misc/<folder>/" />
```

`<commit>` is the full 40-character hash from step 3, never `main` and never a short hash.

Root-relative site resources (`/assets/js/...`) are unaffected by the base and keep coming from the site, which is what the loader tags in step 5 rely on. A link or frame to another page of the same game must not go through the base (it would open as plain text from the CDN): write it as `/misc/<folder>/<page>.html`. GN-Math games use a different base; see the reference.

A cross-origin base breaks a few things that worked same-origin. The checker will show them as errors: `new Worker("relative.js")`, service worker registration, and `fetch` with credentials. Fix what the game needs (for a worker, fetch the script and start it from a blob URL); delete service worker registration outright, since a game inside the 55GMS frame has no use for one.

### Cover

The launcher requires `misc/<folder>/img.webp` in the assets repo, by that exact name; it loads it from jsDelivr. Find a real cover for this game, in this order:

1. GN-Math's canonical cover (GN-Math games).
2. The source site's own thumbnail for the game: look for `og:image`, the game's tile on the portal, or an icon the page references.
3. The developer's or a major portal's official icon for the same game.
4. A clean screenshot of the game running (`check-game.js` writes one).

View the image before using it and make sure it is this game, not a placeholder or a different game with a similar name. Convert to a 512x512 WebP:

```bash
cwebp -quiet -q 85 -resize 512 512 <source> -o ../assets/misc/<folder>/img.webp
```

Crop to square first if the source is not square, rather than letting it stretch.

### Preview clip

Game tiles play a short muted clip on hover (`hover-preview.js`), from the catalog entry's `preview` field. Every clip there is Poki's own animated tile video (a 314x314, ~6 s MP4), so check Poki for every game, whatever the source:

```bash
node scripts/poki-preview.js "<Game Name>" [<poki.com/en/g/... url or slug>]
```

Without a URL it tries `poki.com/en/g/<name as a slug>` and keeps the clip only if Poki's title is the same game. When the source was Poki, or the slug differs from the name (`stickman-climb` for "Stickman Climb!"), pass the URL or slug. It saves `static/img/videos/preview/<name in lowercase letters and digits>.mp4` and prints the value for `preview`. Exit 2 means Poki has no clip for this game: leave `preview` out, and say so in the report. Do not make a clip any other way. If it reports a different title, open the Poki page and pass `--force` only if it really is the same game.

### Author

Use the real developer. Sources, in order: GN-Math metadata, `<meta name="author">` in the game's HTML, credits shown in the game itself (the checker screenshot often shows them), the engine config (`companyName` in a Unity build), then the developer listed on a reliable portal or store page. Use the short public name ("Venturous", not "Venturous Handelsbolag"). Never guess, and never credit the site the game was ripped from. If no source gives an author, ask the user.

### Catalog entry

Append one object to `static/assets/json/load/g.json`, matching the file's existing formatting:

```json
{
  "name": "Game Name",
  "author": "Author Name",
  "image": "https://cdn.jsdelivr.net/gh/55gms/assets@<commit>/misc/<folder>/img.webp",
  "preview": "/img/videos/preview/<file>.mp4",
  "usesProxy": false
}
```

`preview` only when `poki-preview.js` saved a clip. No `url` field. An entry with `author` and no `url` is routed through the generic launcher, which derives the folder from the image path. Use the game's public name without decoration (`Slime Dunk`, not `Slime Dunk!` or `Unity WebGL Player | Slime Dunk`). Do not reorder or reformat the rest of the file; the frontend sorts at runtime.

## 5. Unity games: the shared loading screen

Skip this for anything that is not Unity (Construct, Godot, PlayCanvas, plain HTML5); the loader only understands Unity.

A game is Unity if it has `createUnityInstance(`, `UnityLoader.instantiate(`, a `Build/*.loader.js` or `UnityLoader.js`, or `.unityweb` files. Every Unity game in 55GMS shows the same loading screen with a real MB progress bar, driven by `GameLoader` (`static/assets/js/game-loader.js`). Read [references/unity-loader.md](references/unity-loader.md) and follow the path that matches the page:

- **A**: the page boots Unity from its own template and nothing was split. Two tags and one `GameLoader.unity([...])` call; the game's code is untouched.
- **B**: files were split into `.partN`, or the page ships its own chunk downloader. The page downloads through `GameLoader.merge` and hands Unity blob URLs.

Finish with `node scripts/bump-loader-version.js` so the `?v=` tags carry the current version.

## 6. Wire saves and ads, check, then commit two

Wire the new pages to cloud saves and to 55GMS Ads' rewarded SDK. All three are idempotent and touch only what needs it:

```bash
node scripts/build-save-registry.js && node scripts/add-save-agent.js && node scripts/add-ads-sdk.js
```

`add-ads-sdk.js` reads the game's files in `../assets` to fill the tag's `data-compat` with the stand-ins the game both loads and calls a rewarded ad through. Check what it wrote for this game (`grep -n "data-compat" static/misc/<folder>/*.html`): a game with a Poki stand-in and a `rewardedBreak` call should say `poki`, and so on. If it read the game wrong (several portals' code in one build, an obfuscated SDK, a hook in the game's own code), add the folder to the `COMPAT` table at the top of the script and run it again.

```bash
node -e 'JSON.parse(require("node:fs").readFileSync("static/assets/json/load/g.json","utf8"))'
git diff --check
node scripts/check-game.js <folder>
```

`check-game.js` loads the page in headless Chrome and answers requests for the 55gms/assets jsDelivr base from `../assets/misc/<folder>/` exactly as the CDN would (404 for missing files, 403 over 20 MB), so it tests the page and the files as they sit in the two repos before anything is pushed. It needs no running site and no database. Read all of its output:

- `cdn:` should show requests answered from local files. Zero means the base is wrong or missing.
- `loader:` must say `not showing`. `STILL SHOWING` on a Unity game means the game never reported that it started; give big games a longer `--wait` before concluding the wiring is wrong.
- `cover:` and `catalog:` must show `img.webp` and exactly one entry with the right name and author.
- `Failed requests` and `Errors` must be empty, or each one explained (a game's own optional request to a dead leaderboard is fine; a missing asset is not).
- `Other sites contacted` should list nothing from the source portal or ad networks.
- **Open the screenshot.** It must show the game itself, past any loading screen.

Fix and rerun until it is clean. Do not call the game working on the strength of exit code 0 alone; a blank canvas also exits 0.

```bash
git add static/assets/json/load/g.json static/assets/json/saves.json static/misc/<folder> static/img/videos/preview/<file>.mp4   # the clip only if there is one
git status --short   # only .html files under static/misc/<folder> and the clip; add anything else the scripts above changed (scripts/add-ads-sdk.js COMPAT, save-agent.js RENAMED)
git commit -m "feat: list <Game Name> in the catalog and load it from jsDelivr"
```

For a Unity game say so in the message: `feat: list <Game Name> with the shared Unity loader`.

One commit per repo per turn, no more: the assets commit from step 3 and this one, each covering every game the turn adds. Never add a follow-up commit to fix something in the same turn; amend instead (while unpushed). If the check turns up a problem in the files after commit one, fix it and amend the assets commit (as long as it has not been pushed) instead of adding another. Amending changes the hash, so take the new one (step 3) and update the base and the catalog image before the 55GMS commit. Before committing, `grep -rn "55gms/assets@main" static/misc/<folder> static/assets/json/load/g.json` must find nothing for this game.

## 7. Report

Tell the user, briefly:

- the game's name, folder, author, and where each of those came from
- whether it got a Poki preview clip, and if not, why (no Poki page, no clip on it)
- the two commit hashes, and which repo each is in
- what was removed or replaced during cleanup (portal SDK swapped for a stub, files split)
- how rewarded ads reach the game: the `data-compat` it got, a hand-written hook, or none (no rewarded path, or one no adapter covers)
- what the check showed, and anything in it that was not clean
- whether both repos have been pushed, since the game cannot load on the live site until they have
- anything the rip could not capture (later levels, missing files) and whether a visible run would help
