function script(text) {
  console.log(
    "%cScript Injection",
    "color: cyan; font-weight: 600; background: black; padding: 0 5px; border-radius: 5px",
    text,
  );
}

(function applySavedTheme() {
  const allowedThemes = new Set([
    "blue",
    "legacy",
    "midnight",
    "forest",
    "sunset",
    "contrast",
  ]);
  const savedTheme = localStorage.getItem("siteTheme") || "legacy";
  const theme =
    savedTheme === "classic"
      ? "legacy"
      : allowedThemes.has(savedTheme)
        ? savedTheme
        : "legacy";
  document.documentElement.dataset.theme = theme;
})();

// ====================================
// SCRIPT INJECTION
// ====================================
const newScript = document.createElement("script");
newScript.setAttribute(
  "src",
  "https://www.googletagmanager.com/gtag/js?id=G-N0LG27M8L8",
);
const inlinegascript = document.createElement("script");
inlinegascript.innerHTML = `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-N0LG27M8L8');`;
document.head.append(newScript, inlinegascript);
script("Injected script 1/3");

// One "game_play" event per game opened, so Google Analytics can rank games by
// name. Game pages send it on load; games.js sends it for proxied games.
function trackGamePlay(name, type) {
  const gameName = String(name || "").trim();
  if (!gameName || typeof gtag !== "function") return;
  gtag("event", "game_play", {
    game_name: gameName.slice(0, 100),
    game_type: type,
  });
}

if (location.pathname.startsWith("/misc/play/")) {
  document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector("#gameframe .titletext");
    if (title) trackGamePlay(title.textContent, "hosted");
  });
}

script("Injected script 2/3 (USE AN AD BLOCKER PLEASE)");

var tab = localStorage.getItem("tab");
if (tab) {
  try {
    var tabData = JSON.parse(tab);
  } catch {
    var tabData = {};
  }
} else {
  var tabData = {};
}

if (tabData.title) {
  document.title = tabData.title;
}

document.addEventListener("DOMContentLoaded", function () {
  // Set the Tab icon if saved tab data is there
  if (tabData.icon) {
    var iconLink = document.querySelector('link[rel="icon"]');
    if (iconLink) {
      iconLink.href = tabData.icon;
    } else {
      console.warn('No link element with rel="icon" found');
    }
  }
});

// ====================================
// ADS (premium accounts choose theirs in settings)
// ====================================
// The flag is "true" from login or "1" from the account page.
function hasPremium() {
  const premium = localStorage.getItem("premium");
  return premium === "true" || premium === "1";
}

// True when the site is opened through a GitHub Codespace's forwarded port.
function inCodespace() {
  return /\.(app\.github\.dev|githubpreview\.dev)$/.test(
    window.location.hostname,
  );
}

// Which ad sources this visitor gets. Everyone without premium gets all of
// them; premium accounts get none until they turn ads on in settings, then
// whichever sources they picked there (stored in "adPrefs"). A Codespace
// shows none at all.
function adChoices() {
  if (inCodespace()) return { partner: false, adsense: false, banners: false };
  if (!hasPremium()) return { partner: true, adsense: true, banners: true };

  let prefs = null;
  try {
    prefs = JSON.parse(localStorage.getItem("adPrefs"));
  } catch (error) {
    prefs = null;
  }
  if (!prefs || !prefs.enabled) {
    return { partner: false, adsense: false, banners: false };
  }
  return {
    partner: prefs.partner !== false,
    adsense: prefs.adsense !== false,
    banners: prefs.banners !== false,
  };
}

function whenDomReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

(function loadAds() {
  const ads = adChoices();

  if (!ads.banners) {
    // The slots are in the page markup, so hide them here. (Game pages make
    // theirs in game-page.js, which leaves them out.)
    const hideAds = document.createElement("style");
    hideAds.textContent =
      "#adleft, #adright, .bottom-addisplay, .ad-box, .site-ad, .site-ad-rail { display: none !important; }";
    document.head.append(hideAds);
  }

  if (ads.banners) {
    whenDomReady(() => {
      // 55GMS Ads are served from this origin (/_ads), so they work on every
      // domain. Game pages get their slots from game-page.js. The other pages
      // carry theirs in the markup (.site-ad and .site-ad-rail). One the
      // stylesheet hides at this screen size is removed, so no ad is
      // requested for a slot nobody can see.
      document.querySelectorAll(".site-ad, .site-ad-rail").forEach((ad) => {
        if (getComputedStyle(ad).display === "none") ad.remove();
      });
      if (!document.querySelector("[data-55gms-ad]")) return;

      const adsScript = document.createElement("script");
      adsScript.async = true;
      adsScript.src =
        "https://cdn.jsdelivr.net/gh/55gms/gms-ads@1.2.1/embed/dist/ads.min.js";
      adsScript.integrity =
        "sha384-mQ/P4Pg92IA0slUqUgSpo8vMyWjV0gnjECz0xZrc1lSmEJ6wF2u43pGJbDSXo26m";
      adsScript.crossOrigin = "anonymous";
      // Google is not approved on Bunny pull zones, and the server cannot tell
      // them from 55gms.com, so they ask for campaign ads only (utils/ads.js).
      if (/\.b-cdn\.net$/i.test(window.location.hostname)) {
        adsScript.setAttribute("data-endpoint", "/_ads/no-google");
      }
      document.head.append(adsScript);
    });
  }

  // The partner script runs only on the main pages (home, games, apps, media,
  // settings, profile) and the game pages (/misc/play/). The game inside them
  // (/misc/<game>/), the proxy pages (/b, /embed) and the rest of the site
  // load this file too but don't get it.
  const partnerPages = [
    "/",
    "/index",
    "/g",
    "/games",
    "/a",
    "/apps",
    "/-",
    "/m",
    "/media",
    "/s",
    "/settings",
    "/profile",
    "/account",
  ];
  const pagePath =
    window.location.pathname.replace(/\.html$/, "").replace(/(.)\/+$/, "$1") ||
    "/";
  const onPartnerPage =
    partnerPages.includes(pagePath) ||
    window.location.pathname.startsWith("/misc/play/");

  if (ads.partner && onPartnerPage) {
    whenDomReady(() => {
      const partnerScript = document.createElement("script");
      partnerScript.src =
        "https://cdn.jsdelivr.net/gh/docklib/partners@master/partner-7a44b4ab.js?v=1";
      document.body.append(partnerScript);
    });
  }

  if (ads.adsense) {
    fetch("/assets/json/ads.json")
      .then((response) => response.json())
      .then((data) => {
        if (data.domains.includes(window.location.hostname)) {
          const adscipterz92 = document.createElement("script");
          adscipterz92.setAttribute("async", "");
          adscipterz92.setAttribute(
            "src",
            "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6700774525685317",
          );
          adscipterz92.setAttribute("crossorigin", "anonymous");
          document.head.append(adscipterz92);
          script("Injected script 3/3 (Adsense)");
        } else {
          console.log("Skipping Adsense Injection for this domain.");
        }
      });
  }

  if (!ads.partner && !ads.adsense && !ads.banners) {
    script(
      inCodespace()
        ? "Codespace, skipping ads"
        : "Premium account, skipping ads",
    );
  }
})();

// Keep the stored flag in step with the server, so a grant or revoke from
// /admin applies on the next page load.
(function refreshPremium() {
  const uuid = localStorage.getItem("uuid");
  if (!uuid) return;

  fetch("/api/checkPremium", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uuid }),
  })
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      if (data) localStorage.setItem("premium", Boolean(data.premium));
    })
    .catch(() => {});
})();

var panicKey = localStorage.getItem("panicKey") || "`";
var panicLink = localStorage.getItem("PanicLink") || "https://google.com";

document.addEventListener("keydown", function (e) {
  if (e.key === panicKey) {
    window.top.location.href = panicLink;
  }
});

var blankerCheck = localStorage.getItem("aboutBlank");
if (blankerCheck === "true") {
  let inFrame;
  try {
    inFrame = window !== top;
  } catch (e) {
    inFrame = true;
  }
  if (!inFrame && !navigator.userAgent.includes("Firefox")) {
    const popup = open("about:blank", "_blank");
    if (!popup || popup.closed) {
      alert("Please allow popups and redirects for about:blank mode to work.");
    } else {
      popup.document.title = "My Drive - Google Drive";
      const link = popup.document.createElement("link");
      link.rel = "icon";
      link.href =
        "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png";
      popup.document.head.appendChild(link);
      const iframe = popup.document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.top =
        iframe.style.bottom =
        iframe.style.left =
        iframe.style.right =
          "0";
      iframe.style.width = iframe.style.height = "100%";
      iframe.style.margin = "0";
      iframe.style.border = iframe.style.outline = "none";
      iframe.src = location.href;
      popup.document.body.appendChild(iframe);
      location.replace("https://www.google.com");
    }
  }
}

// Notification functions
function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
