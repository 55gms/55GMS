# Microsoft Edge's _Let's Surf_

The _Let's Surf_ game from `edge://surf`

<p align="center">
  <img src="https://i.imgur.com/9ybOdy7.png"/>
</p>

The game is created by Microsoft – please see the **Credits** in the game menu for more information. The files in this repo are from Microsoft Edge; however, some of them have been modified so the game can function independently from Edge.

## Play

Play the game online at https://surf.jackbuehner.com

### Features

- Endless mode: Surf as far as you can while avoiding obstacles and the kraken. You can switch modes via the game settings menu.
- Time trials: Reach the end of the course as fast as you can! Collect coins to shorten your time. The course is always the same, so can you find the shortest route?
- Zig zag mode: Surf through as many gates as you can in a row! Your streak will reset if you miss a gate, but you can keep playing until your lives run out.
- High scores: Each game mode keeps a record of your high score, and we’ll let you know whenever you set a new record. Reset your stats any time for a fresh start.
- Reduced speed mode: If you prefer a more relaxed pace or need extra time to pull off those surfing moves, enable reduced speed mode to slow down the game speed.
- Themes: Choose between a summer surfing theme or a winter skiing theme. Choose your favorite theme in the game settings menu.
- And surprises! With support for keyboard, mouse, touch, and controllers you can play the game your way... and you may find one of the many Easter Eggs and fun surprises!

## Changes

- Added picker to choose between "Let's surf" and "Let's ski" in the game settings menu.
- Changed file paths so the repo is more organized.
- Added an SVG favicon.
- Added the `manifest.json` file so the site can be installed as a PWA app.
- Pretty-printed the `surf.bundle.js` file to ease the modification process.
  - Use `localStorage` function to save the stats instead of the original [WebUI](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/webui_explainer.md) ones (`chrome.send` in particular).
- Added mobile support. The game is responsive to most screen sizes.

More information can be seen in past [pull requests](https://github.com/jackbuehner/MicrosoftEdge-S.U.R.F./pulls?q=is%3Apr+is%3Aclosed) and [releases](https://github.com/jackbuehner/MicrosoftEdge-S.U.R.F./releases).

## Contribute

If you know how to fix anything that is not working, feel free to open a pull request. I'll merge it as soon as I see it and confirm it does not break anything.
