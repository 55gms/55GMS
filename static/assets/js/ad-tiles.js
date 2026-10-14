// Ad tiles: ads the size and shape of a game tile, for the games page
// (games.js) and the tiles around a game (game-page.js). They come from 55GMS
// Ads on this origin (/_ads), asked for directly because the embed draws
// banners, not tiles. A campaign's square creative becomes the tile's image
// and its alt text the label, so the tile hovers like a game. On a host where
// Google fills the ads, the tile holds an AdSense unit instead, and a campaign
// takes its place when Google has nothing for it. Both kinds hover the same.
//
//   requestAdTiles(count)          -> Promise of up to `count` ads
//   fillAdTile(box, ad, options)   draws `ad` inside `box`
(() => {
  const BASE = "/_ads";
  const SIZE = "250x250";
  const GOOGLE_MIN = 120; // AdSense takes no unit narrower than this
  const VIEW_MS = 1000;

  const adsOn = () => typeof adChoices !== "function" || adChoices().banners;

  let viewed = []; // serve ids seen, waiting to be reported
  let reportTimer = 0;
  const viewTimers = new WeakMap();

  function report() {
    clearTimeout(reportTimer);
    reportTimer = 0;
    if (!viewed.length) return;
    const body = JSON.stringify({ serveIds: viewed.splice(0) });
    try {
      if (!navigator.sendBeacon?.(`${BASE}/i`, body)) {
        fetch(`${BASE}/i`, { method: "POST", body, keepalive: true }).catch(
          () => {},
        );
      }
    } catch {}
  }

  // An impression counts once the tile has been half on screen for a second,
  // as the embed counts its banners.
  const viewObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach(({ target, intersectionRatio }) => {
              const timer = viewTimers.get(target);
              if (intersectionRatio < 0.5) {
                clearTimeout(timer);
                viewTimers.delete(target);
                return;
              }
              if (timer) return;
              viewTimers.set(
                target,
                setTimeout(() => {
                  viewObserver.unobserve(target);
                  viewTimers.delete(target);
                  if (!target.dataset.serve) return;
                  viewed.push(target.dataset.serve);
                  reportTimer ||= setTimeout(report, 1500);
                }, VIEW_MS),
              );
            });
          },
          { threshold: [0, 0.5, 1] },
        )
      : null;
  window.addEventListener("pagehide", report);

  // `fallback` asks a Google host for campaigns, for a tile Google left empty.
  async function requestAdTiles(count, fallback = false) {
    if (count < 1 || !adsOn() || !viewObserver) return [];
    try {
      const slots = Array(count).fill(SIZE).join(";");
      const response = await fetch(
        `${BASE}/serve?slots=${encodeURIComponent(slots)}${
          fallback ? "&fallback=1" : ""
        }`,
        { credentials: "omit" },
      );
      if (!response.ok || response.status === 204) return [];
      const data = await response.json();
      if (!fallback && data.google?.client && data.google.slot) {
        return Array.from({ length: count }, () => ({ google: data.google }));
      }
      // The same creative twice on one page is one too many.
      const seen = new Set();
      return (data.ads || []).filter((ad) => {
        if (!ad?.serveId || seen.has(ad.imageUrl)) return false;
        seen.add(ad.imageUrl);
        return true;
      });
    } catch {
      return [];
    }
  }

  let googleScript = null;
  let googleFailed = false;

  function loadGoogle(client) {
    googleScript ||= document.querySelector('script[src*="adsbygoogle.js"]');
    if (googleScript) return googleScript;
    googleScript = document.createElement("script");
    googleScript.async = true;
    googleScript.crossOrigin = "anonymous";
    googleScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
      client,
    )}`;
    googleScript.addEventListener("error", () => {
      googleFailed = true;
    });
    document.head.append(googleScript);
    return googleScript;
  }

  // A Google unit is a fixed size in pixels, so it is made once the tile has
  // a width, at that width, and scaled if the tile changes size later.
  function fillGoogle(box, google, options) {
    if (googleFailed) return options.onEmpty?.();
    const frame = document.createElement("span");
    frame.className = "ad-tile-window";
    const fit = document.createElement("div");
    fit.className = "ad-tile-fit";
    frame.append(fit);
    // Google names no advertiser, so the hover label is a plain one. It lets
    // clicks through to the ad under it.
    const label = document.createElement(options.labelTag || "span");
    label.className = options.labelClass || "";
    label.textContent = "Sponsored";
    box.classList.add("ad-tile--google");
    box.replaceChildren(frame, label);

    let size = 0;
    let done = false;
    const sizer = new ResizeObserver(() => {
      const width = frame.clientWidth;
      if (!width || done) return;
      if (!size) {
        size = Math.max(GOOGLE_MIN, Math.round(width));
        mount();
      }
      fit.style.transform = `scale(${width / size})`;
    });
    sizer.observe(frame);

    function finish() {
      done = true;
      sizer.disconnect();
      box.classList.remove("ad-tile--google");
    }
    function empty() {
      if (done) return;
      finish();
      options.onEmpty?.();
    }

    function mount() {
      fit.style.width = fit.style.height = `${size}px`;
      const unit = document.createElement("ins");
      unit.className = "adsbygoogle";
      // Unseen until Google has an ad: its empty frame is a white box.
      unit.style.cssText = `display:inline-block;opacity:0;width:${size}px;height:${size}px`;
      unit.setAttribute("data-ad-client", google.client);
      unit.setAttribute("data-ad-slot", google.slot);
      fit.append(unit);
      new MutationObserver(async () => {
        const status = unit.getAttribute("data-ad-status");
        if (status === "filled") unit.style.opacity = "";
        if (status !== "unfilled" || done) return;
        finish();
        const [ad] = await requestAdTiles(1, true);
        if (ad) fillAdTile(box, ad, options);
        else options.onEmpty?.();
      }).observe(unit, {
        attributes: true,
        attributeFilter: ["data-ad-status"],
      });
      loadGoogle(google.client).addEventListener("error", empty);
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        empty();
      }
    }
  }

  // options: linkClass, labelTag and labelClass name the page's own tile
  // markup; onEmpty runs when the tile ends up with no ad to show.
  function fillAdTile(box, ad, options = {}) {
    box.classList.add("ad-tile");
    if (ad.google) return fillGoogle(box, ad.google, options);

    const name = ad.alt || "Sponsored";
    const link = document.createElement("a");
    link.className = options.linkClass || "";
    link.href = ad.clickUrl;
    link.target = "_blank";
    link.rel = "noopener sponsored";
    link.setAttribute("aria-label", `Ad: ${name}`);

    const image = document.createElement("img");
    image.alt = "";
    image.decoding = "async";
    image.addEventListener("error", () => options.onEmpty?.(), { once: true });
    image.src = ad.imageUrl;

    const label = document.createElement(options.labelTag || "span");
    label.className = options.labelClass || "";
    label.textContent = name;

    const badge = document.createElement("span");
    badge.className = "ad-tile-badge";
    badge.textContent = "Ad";
    badge.setAttribute("aria-hidden", "true");

    link.append(image, label);
    box.replaceChildren(link, badge);
    box.dataset.serve = ad.serveId;
    viewObserver.observe(box);
  }

  window.requestAdTiles = requestAdTiles;
  window.fillAdTile = fillAdTile;
})();
