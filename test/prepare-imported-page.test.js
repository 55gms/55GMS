import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import { prepareImportedPage } from "../scripts/lib/prepareImportedPage.js";

test("imports use the existing 55GMS loading UI while preserving required startup hooks", () => {
  const original = `<html><head><title>G+</title></head><body><canvas id="unity-canvas"></canvas><div id="loading-cover"><img id="unity-logo" src="old-drive-logo.png"><div id="unity-progress-bar-full">Drive U 7 loading</div></div><script>window.progress=document.getElementById("unity-progress-bar-full");window.RealGame();</script><!-- Sticky Bottom Center Ad --><div id="ad-container"><iframe src="https://script.google.com/macros/s/ad/exec"></iframe></div><script>showOldPortalAd();</script></body></html>`;
  const html = prepareImportedPage(original, {
    title: "Real Kart",
    engine: "unity",
    files: [],
    total: 0,
    parts: {},
  });
  const doc = new JSDOM(html).window.document;
  assert.equal(doc.title, "Real Kart");
  assert.ok(doc.querySelector('script[src^="/assets/js/loader-ui.js"]'));
  assert.ok(doc.querySelector('script[src^="/assets/js/game-loader.js"]'));
  assert.ok(
    doc.querySelector('script[src^="/assets/js/imported-game-loader.js"]'),
  );
  assert.ok(doc.getElementById("unity-progress-bar-full"));
  assert.ok(
    doc
      .getElementById("loading-cover")
      .classList.contains("gms-legacy-loading-hooks"),
  );
  assert.equal(doc.getElementById("unity-logo").hasAttribute("src"), false);
  assert.equal(doc.getElementById("loading-cover").textContent.trim(), "");
  assert.equal(doc.querySelectorAll("#ad-container,iframe").length, 0);
  assert.ok(html.includes("window.RealGame()"));
  assert.ok(!html.includes("showOldPortalAd()"));
});

test("source reward stubs route through the real 55GMS ad result", () => {
  const html = prepareImportedPage(
    "<html><head></head><body><script>window.ysdk={adv:{showRewardedVideo: (options)=>{ options.callbacks.onRewarded(); }}};</script></body></html>",
    { title: "Game", engine: "unity", parts: {} },
  );
  assert.ok(html.includes("window.GMSImportedAds.yandex(options)"));
  assert.ok(!html.includes("options.callbacks.onRewarded()"));
});

test("custom portal loading hooks are hidden without removing their runtime IDs or the game canvas", () => {
  const html = prepareImportedPage('<html><head></head><body><div id="boot"><img src="portal.png"><span id="btxt">Classroom Resources</span></div><div id="loading"><span>old progress</span></div><div id="root"><canvas></canvas></div></body></html>', {
    title: 'Half-Life', engine: 'web', legacyLoadingSelectors: ['#boot', '#loading', '#root'], parts: {},
  });
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  for (const id of ['boot', 'loading']) {
    assert.ok(doc.getElementById(id).classList.contains('gms-legacy-loading-hooks'));
    assert.equal(doc.getElementById(id).textContent.trim(), '');
  }
  assert.ok(doc.getElementById('btxt'));
  assert.ok(!doc.getElementById('boot').querySelector('img').hasAttribute('src'));
  assert.ok(!doc.getElementById('root').classList.contains('gms-legacy-loading-hooks'));
  dom.window.close();
});

test('import preparation removes external advertising scripts while preserving game scripts and integrity', () => {
  const html = prepareImportedPage('<html><head><script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><script src="game.js" integrity="sha384-game"></script></head><body></body></html>', {title:'Nitro Car',engine:'web',parts:{}});
  const dom = new JSDOM(html);
  assert.equal(dom.window.document.querySelector('script[src*="googlesyndication"]'), null);
  assert.equal(dom.window.document.querySelector('script[src="game.js"]').getAttribute('integrity'), 'sha384-game');
  dom.window.close();
});

test('Unity rewarded stand-ins only send RewardVideo after the real ad callback', () => {
  const html = prepareImportedPage('<html><head></head><body><script>function RewardedShow(id) { if(myGameInstance) { myGameInstance.SendMessage("YandexGame", "OpenVideo"); setTimeout(() => { myGameInstance.SendMessage("YandexGame", "RewardVideo", id); myGameInstance.SendMessage("YandexGame", "CloseVideo"); }, 500); } }</script></body></html>', {title:'Ks2 Teams',engine:'unity',parts:{}});
  const dom = new JSDOM(html, {runScripts:'outside-only'});
  const calls=[];
  let options;
  dom.window.myGameInstance={SendMessage:(...args)=>calls.push(args)};
  dom.window.GMSImportedAds={yandex:value=>{options=value;}};
  const original=[...dom.window.document.scripts].find(script=>script.textContent.includes('function RewardedShow'));
  dom.window.eval(original.textContent);
  dom.window.RewardedShow('armor');
  assert.equal(calls.filter(call=>call[1]==='RewardVideo').length,0);
  assert.ok(options?.callbacks);
  options.callbacks.onOpen();
  options.callbacks.onRewarded();
  options.callbacks.onClose();
  assert.deepEqual(calls.map(call=>Array.from(call)),[['YandexGame','OpenVideo'],['YandexGame','RewardVideo','armor'],['YandexGame','CloseVideo']]);
  dom.window.close();
});
