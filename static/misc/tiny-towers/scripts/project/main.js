// Neutralized for self-hosting on games.pizzaedition.com. The original build
// unconditionally loaded Poki's real production SDK
// (https://game-cdn.poki.com/scripts/v2/poki-sdk.js) here with no domain
// gating -- confirmed via a live network capture to trigger Poki's own
// "Possible Unauthorized Game Hosting Detected" check (devs-api.poki.com/
// gameinfo/@sdk) and pull in Poki's full ad stack (Google Ad Manager, IMA,
// Amazon APS/Prebid) on every load, none of which is authorized or wanted on
// this domain. Worse: if the game-cdn.poki.com request is blocked by a
// network filter (school content filters commonly block ad/analytics
// domains), the <script> tag's load event never fires, so PokiSDK stays
// undefined forever and every later call to it
// (scriptsInEvents.js's Epokimanager_Event* handlers, including
// PokiSDK.gameLoadingFinished() on the loading screen) throws an unhandled
// ReferenceError. Confirmed via CDP with game-cdn.poki.com blocked.
//
// UPDATE 2026-09-14: the local no-op stub that used to live here (defining
// its own window.PokiSDK) also silently killed this game's real rewarded ads
// -- its rewardedBreak always resolved false, so this game never requested a
// single ad despite scriptsInEvents.js correctly calling it (owner-reported,
// confirmed via GA4: ad_requested for this game collapsed to ~0 right around
// when this stub was deployed). window.PokiSDK is now provided by the site's
// real shared /scripts/sdk.js (loaded in index.html, before this file),
// which already handles the exact same game-cdn.poki.com/network-filter
// problem this stub was built for, plus routes rewardedBreak through the
// real AppLixir/GPT/house-video chain instead of a dead end. Do not redefine
// window.PokiSDK here again.
globalThis.PokiHasInitialised = true;

window.addEventListener('keydown', ev => {
    if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
        ev.preventDefault();
    }
});
window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });
