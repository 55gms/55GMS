import { JSDOM, VirtualConsole } from "jsdom";
import { routeImportedRewards } from "./routeImportedRewards.js";

const LEGACY_LOADING =
  "#loading-cover,#loading-screen,#unity-loading-bar,#loader-background,#loadingOverlay";

export function prepareImportedPage(html, config) {
  // This portal appends its sticky advertisement after the complete game boot.
  html = html.replace(/<!-- Sticky Bottom Center Ad[\s\S]*?(?=<\/body>)/i, "");
  const dom = new JSDOM(html, { virtualConsole: new VirtualConsole() });
  const document = dom.window.document;
  document.title = config.title;
  for (const node of document.querySelectorAll("#ad-container, #close-ad"))
    node.remove();
  for (const frame of document.querySelectorAll(
    'iframe[src*="script.google.com"]',
  ))
    frame.remove();
  for (const script of document.querySelectorAll("script")) {
    const src = script.getAttribute("src") || "";
    const text = script.textContent;
    if (
      /googletagmanager|google-analytics|script\.google\.com/.test(src) ||
      (/ad-container|close-ad/.test(text) &&
        !/createUnityInstance|UnityLoader|C3_/.test(text))
    ) {
      script.remove();
    } else if (!src) script.textContent = routeImportedRewards(text);
  }
  for (const node of document.querySelectorAll(LEGACY_LOADING)) {
    if (node.querySelector("canvas")) continue;
    node.classList.add("gms-legacy-loading-hooks");
    for (const image of node.querySelectorAll("img"))
      image.removeAttribute("src");
    const walker = document.createTreeWalker(
      node,
      dom.window.NodeFilter.SHOW_TEXT,
    );
    while (walker.nextNode()) walker.currentNode.textContent = "";
  }
  const style = document.createElement("style");
  style.textContent =
    "html,body{margin:0;padding:0;overflow:hidden;background:#000}html body .gms-legacy-loading-hooks{display:none!important;visibility:hidden!important;pointer-events:none!important}";
  document.head.appendChild(style);

  const boot = document.createDocumentFragment();
  const settings = document.createElement("script");
  settings.type = "application/json";
  settings.id = "gms-import-config";
  settings.textContent = JSON.stringify(config).replaceAll("<", "\\u003c");
  boot.appendChild(settings);
  for (const src of [
    "/assets/js/loader-ui.js?v=5gz9swuael",
    "/assets/js/game-loader.js?v=5gz9swuael",
    ...(Object.keys(config.parts || {}).length
      ? ["/assets/js/game-parts.js?v=3"]
      : []),
    "/assets/js/imported-game-loader.js?v=1",
  ]) {
    const script = document.createElement("script");
    script.src = src;
    if (src.includes("game-loader.js?")) script.dataset.title = config.title;
    boot.appendChild(script);
  }
  document.head.prepend(boot);
  const result = dom.serialize();
  dom.window.close();
  return result;
}
