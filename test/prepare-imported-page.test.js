import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import { prepareImportedPage } from "../scripts/lib/prepareImportedPage.js";

test("imports use the existing 55GMS loading UI while preserving required startup hooks", () => {
  const original = `<html><head><title>G+</title></head><body><canvas id="unity-canvas"></canvas><div id="loading-cover"><img id="unity-logo" src="old-drive-logo.png"><div id="unity-progress-bar-full">Drive U 7 loading</div></div><script>window.progress=document.getElementById("unity-progress-bar-full");window.RealGame();</script><!-- Sticky Bottom Center Ad --><div id="ad-container"><iframe src="https://script.google.com/macros/s/ad/exec"></iframe></div><script>showOldPortalAd();</script></body></html>`;
  const html = prepareImportedPage(original, {title:"Real Kart",engine:"unity",files:[],total:0,parts:{}});
  const doc = new JSDOM(html).window.document;
  assert.equal(doc.title, "Real Kart");
  assert.ok(doc.querySelector('script[src^="/assets/js/loader-ui.js"]'));
  assert.ok(doc.querySelector('script[src^="/assets/js/game-loader.js"]'));
  assert.ok(doc.querySelector('script[src^="/assets/js/imported-game-loader.js"]'));
  assert.ok(doc.getElementById("unity-progress-bar-full"));
  assert.ok(doc.getElementById("loading-cover").classList.contains("gms-legacy-loading-hooks"));
  assert.equal(doc.getElementById("unity-logo").hasAttribute("src"), false);
  assert.equal(doc.getElementById("loading-cover").textContent.trim(), "");
  assert.equal(doc.querySelectorAll("#ad-container,iframe").length, 0);
  assert.ok(html.includes("window.RealGame()"));
  assert.ok(!html.includes("showOldPortalAd()"));
});
