# GN-Math games

GN-Math games are single-page HTML ports whose assets usually live on GN-Math's own CDN, so there is nothing to rip. This replaces step 2 of SKILL.md; rejoin at step 3.

## Fetch

1. Extract the numeric ID from a number or a URL such as `https://gn-math.dev/?id=166`.
2. Run `node <skill-dir>/scripts/inspect-game.mjs <ID-or-URL>`. It reads the live site's configuration and reports the exact name, author, HTML filename, cover, and which asset sources respond. Treat it as discovery, not proof.
3. Fetch the exact HTML file it names from the public `gn-math/html` repository (the raw GitHub source). Do not copy the GN-Math launcher page.
4. Save it as `static/misc/<folder>/index.html`.
5. Inspect remote scripts, popups, trackers, and navigation in the page. Keep what the game needs; remove ads and trackers, as for any other game.

## Source roles

- `gn-math/html`: the entry files, usually `<ID>.html`, sometimes with a suffix such as `-fix`.
- `gn-math/assets`: directories for multi-file games. Not every ID has one.
- `gn-math/covers`: canonical covers named `<ID>.png`.
- The live `gn-math.dev` zone metadata maps IDs to names, authors, HTML filenames, and covers.

jsDelivr has at times answered `gn-math` requests with a blocked-user message while the live site used a mirror namespace. This drifts; check actual responses rather than trusting this note.

## Base

GN-Math games keep their assets where GN-Math hosts them rather than in this repo, so the base is not the 55gms one. Decide in this order:

1. `https://cdn.jsdelivr.net/gh/gn-math/assets@main/<ID>/` when that directory exists and representative files come back with real content.
2. If that namespace is blocked, the mirror the live `gn-math.dev` configuration currently uses, when the same ID directory exists there.
3. If there is no GN-Math asset directory but the HTML already has a working upstream base, keep it. Game 166 is the example: replacing its base breaks it.
4. If the page is self-contained with no relative requests, add no base.

Never point the base at the `html` repository just because the page came from there. A status code is not enough to trust a CDN response: check the content type and reject tiny bodies and block pages.

`check-game.js` only maps the 55gms base to local files, so for these games it tests against the real upstream CDN. That is what you want here.

## Cover and author

- Cover: `https://raw.githubusercontent.com/gn-math/covers/main/<ID>.png`, viewed and confirmed to be this game, converted to `img.webp` as in SKILL.md.
- Author: the one in GN-Math metadata. If it is absent or a placeholder, find the real developer as SKILL.md describes.

## Commits

Same as SKILL.md: at most one commit per repo per turn. The fetched and cleaned page, the base decision, cover, catalog entry and Unity loader all go in the single 55GMS commit (the cover in the assets commit when there is one). Many GN-Math Unity ports ship their own chunk downloader, which is path B in `unity-loader.md`.
