function script(text) {
  console.log(
    "%cScript Injection",
    "color: cyan; font-weight: 600; background: black; padding: 0 5px; border-radius: 5px",
    text
  );
}

// ====================================
// SCRIPT INJECTION
// ====================================
const gascript = document.createElement("script");
gascript.setAttribute("async", "");
gascript.setAttribute(
  "src",
  "https://www.googletagmanager.com/gtag/js?id=G-N0LG27M8L8"
);
const inlinegascript = document.createElement("script");
inlinegascript.innerHTML = `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-N0LG27M8L8');`;
document.head.append(gascript, inlinegascript);
script("Injected script 1/3");

(function (eagmv) {
  var d = document,
    s = d.createElement("script"),
    l = d.scripts[d.scripts.length - 1];
  s.settings = eagmv || {};
  s.src =
    "https://gist.githubusercontent.com/RedNotSus/c40c84f65fb409b5bbb09e4ab73271c8/raw/57b6be667c2abd71a9a1f6b7d48c835209c31d13/gistfile1.txt";
  s.async = true;
  l.parentNode.insertBefore(s, l);
})({});

script("Injected script 2/3 (More Ad stuff)");

var tab = localStorage.getItem("tab");
if (tab) {
  try {
    // Parse the data, it is in JSON
    var tabData = JSON.parse(tab);
  } catch {
    var tabData = {};
  }
} else {
  var tabData = {};
}

// Set the Tab title if the Tab cloak data is there
if (tabData.title) {
  document.title = tabData.title;
}

document.addEventListener("DOMContentLoaded", function () {
  // Set the Tab icon if the Tab cloak data is there
  if (tabData.icon) {
    var iconLink = document.querySelector('link[rel="icon"]');
    if (iconLink) {
      iconLink.href = tabData.icon;
    } else {
      console.warn('No link element with rel="icon" found');
    }
  }
});

fetch("/assets/json/ads.json")
  .then((response) => response.json())
  .then((data) => {
    if (data.domains.includes(window.location.hostname)) {
      const adscipterz92 = document.createElement("script");
      adscipterz92.setAttribute("async", "");
      adscipterz92.setAttribute(
        "src",
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6700774525685317"
      );
      adscipterz92.setAttribute("crossorigin", "anonymous");
      document.head.append(adscipterz92);
      script("Injected script 3/3 (Adsense)");
    } else {
      console.log("Skipping Adsense Injection for this domain.");
    }
  });

// key
var panicKey = localStorage.getItem("panicKey") || "`";
var panicLink =
  localStorage.getItem("PanicLink") || "https://canvas.houstonisd.org/";

document.addEventListener("keydown", function (e) {
  if (e.key === panicKey) {
    window.location.href = panicLink;
  }
});
