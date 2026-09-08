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

fetch("/api/me", { credentials: "same-origin" })
  .then((response) => (response.ok ? response.json() : null))
  .then((user) => {
    if (user?.admin) {
      document.querySelectorAll(".navbar").forEach((navbar) => {
        let link = navbar.querySelector("#adminLink");
        if (!link) {
          link = document.createElement("a");
          link.id = "adminLink";
          link.href = "/admin";
          link.textContent = "Admin";
          const chatLink = navbar.querySelector('a[href="/chat"]');
          const profileLink = navbar.querySelector('a[href="/profile"]');
          navbar.insertBefore(link, chatLink || profileLink || null);
        }
        link.style.display = "inline-block";
      });
    }
  })
  .catch(() => {});

async function promptForPendingNameRequests() {
  const uuid = localStorage.getItem("uuid");
  if (!uuid || window.location.pathname.startsWith("/chat")) return;

  try {
    const response = await fetch("/api/name-requests/pending", {
      headers: { "X-User-UUID": uuid },
    });
    if (!response.ok) return;

    const requests = await response.json();
    for (const request of requests) {
      const firstName = window.prompt(
        `${request.requesterUsername} wants to know your first name. What should I tell them?`,
      );
      if (!firstName?.trim()) continue;

      await fetch(`/api/name-requests/${request.id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-User-UUID": uuid },
        body: JSON.stringify({ firstName: firstName.trim() }),
      });
    }
  } catch (error) {
    console.error("Error handling pending name request:", error);
  }
}

document.addEventListener("DOMContentLoaded", promptForPendingNameRequests);

// ====================================
// SCRIPT INJECTION
// ====================================
// Ad/tracking scripts intentionally disabled.

script("Site scripts loaded without external ad injection.");

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
      alert("Please allow popups and redirects for about:blank cloak to work.");
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
