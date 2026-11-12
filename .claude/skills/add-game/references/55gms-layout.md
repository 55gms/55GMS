# 55GMS game layout

## Paths

- Catalog: `static/assets/json/load/g.json` (the user may call it `games.json`)
- Catalog renderer: `static/assets/js/games.js`
- Game page: `static/misc/<folder>/index.html` (55GMS holds only the pages)
- Game files: `../assets/misc/<folder>/` (the `55gms/assets` clone next to 55GMS; `ASSETS_REPO` overrides the location)
- Cover: `../assets/misc/<folder>/img.webp`
- Generic launcher: `static/misc/play/index.html`, nested frame `static/misc/misc/frame.html`
- Shared loading screen: `static/assets/js/loader-ui.js`, `static/assets/css/loader-ui.css`
- Unity loader: `static/assets/js/game-loader.js`, `static/assets/css/game-loader.css`
- CDN base for a game's files: `https://cdn.jsdelivr.net/gh/55gms/assets@<commit>/misc/<folder>/`, where `<commit>` is the full hash of the assets commit holding the game's files (`git -C ../assets log -1 --format=%H -- misc/<folder>`). Never `@main`.
- Fallback: a `/misc/<folder>/<file>` request to the site for a file not on disk is relayed from that CDN (`utils/gameAssets.js`), so a stray same-origin request still works, at the cost of the site's bandwidth. Files over the CDN's size limit cannot be relayed.

## Scripts (run from the repo root)

| Script                                                                            | What it does                                                                                                                                                                                                                                                                                        |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node scripts/rip-game.js <url> --name <folder> [--headless --wait 30] [--force]` | Copies a web game: pages into `static/misc/<folder>/`, every other file into `../assets/misc/<folder>/`. Follows nested iframes, saves what the game frame requests, refetches 404s, screenshots the offline copy. Without `--headless` it opens Chrome so a person can play before pressing Enter. |
| `node scripts/check-game.js <folder> [--wait 15] [--live]`                        | Loads the game page in headless Chrome with the 55gms/assets jsDelivr base answered from `../assets/misc/<folder>/`. Reports failed requests, errors, loader state, cover, catalog entry, other sites contacted, and a screenshot. `--live` uses the real CDN, for after a push.                    |
| `node scripts/split-game-files.js <folder>`                                       | In `../assets/misc/<folder>/`, splits files over 20 MB into 10 MB `.partN` pieces and prints `[path, bytes]` lists for `GameLoader`.                                                                                                                                                                |
| `node scripts/bump-loader-version.js`                                             | Rewrites every loader `?v=` tag to the current version.                                                                                                                                                                                                                                             |
| `node scripts/pin-game-assets.js ../assets`                                       | Pins every 55gms/assets jsDelivr URL in 55GMS (pages, `<base>`, catalogue covers), `@main` included, to the last pushed commit that changed its folder. Run it after pushing the assets repo if a rebase changed the commit's hash, and commit the result.                                          |
| `node scripts/build-save-registry.js && node scripts/add-save-agent.js`           | Regenerates the cloud saves game registry (`static/assets/json/saves.json`) and loads the save agent in every game page. Run after adding a game.                                                                                                                                                   |
| `node scripts/add-ads-sdk.js [../assets]`                                         | Puts the pinned gms-ads `sdk.min.js` tag after the save agent in every game page, with `data-compat` read from the game's files (hand fixes in its `COMPAT` table). Routes the stand-ins' rewarded calls to real 55GMS Ads. Run after the two above.                                                |

`rip-game.js` and `check-game.js` drive the installed Google Chrome through `playwright-core` (a devDependency). If the import fails, run `npm install`.

## Catalog contract

```json
{
  "name": "Exact public game name",
  "author": "Factual author name",
  "image": "https://cdn.jsdelivr.net/gh/55gms/assets@<commit>/misc/<folder>/img.webp",
  "usesProxy": false
}
```

No `url`. `games.js` sees `author` without `url`, takes the folder from the image's parent directory, and opens:

```text
/misc/play/?title=<name>&author=<author>&link=<folder>
```

The launcher shows the title, author, and the cover from jsDelivr, waits for the Play overlay, then loads `/misc/<folder>/index.html` in its frame. Entries are sorted at runtime, so append and leave the rest of the file alone.

## jsDelivr facts

- Serves only what is on GitHub. The commit must be pushed to `main` of `55gms/assets` before the base works on the live site.
- A branch URL (`@main`) makes jsDelivr keep asking GitHub whether the branch moved; when GitHub answers 429 Too Many Requests, jsDelivr can cache that page in place of the file. A commit URL is fetched once and cached for good, which is why every 55gms/assets URL names a commit.
- Refuses files over about 20 MiB.
- Sends `Access-Control-Allow-Origin: *`, so `fetch`, module scripts, and WASM work cross-origin. Workers created from a relative URL and service workers do not.
- A fix to an already-pushed file is a new commit, so it shows up only once the page's URLs name that commit: update the hash (or run `pin-game-assets.js`) after pushing the fix.

## Done means

- `check-game.js` shows the game rendered in its screenshot, loader not showing, no unexplained failed requests or errors, one catalog entry with the right name and author, `img.webp` present.
- No portal, ad, or tracker hosts under "Other sites contacted".
- One commit per repo for the turn (several games share them): the files in `55gms/assets`, then the listing in 55GMS, with no non-HTML game file added to 55GMS.
