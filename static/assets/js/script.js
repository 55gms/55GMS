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
const newScript = document.createElement("script");
newScript.setAttribute(
  "src",
  "https://www.googletagmanager.com/gtag/js?id=G-N0LG27M8L8"
);
const inlinegascript = document.createElement("script");
inlinegascript.innerHTML = `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-N0LG27M8L8');`;
document.head.append(newScript, inlinegascript);
script("Injected script 1/3");

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
  // Set the Tab icon if the Tab cloak data is there
  if (tabData.icon) {
    var iconLink = document.querySelector('link[rel="icon"]');
    if (iconLink) {
      iconLink.href = tabData.icon;
    } else {
      console.warn('No link element with rel="icon" found');
    }
  }

  // Initialize online status tracking for logged-in users
  initializeOnlineStatus();
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

var panicKey = localStorage.getItem("panicKey") || "`";
var panicLink = localStorage.getItem("PanicLink") || "https://google.com";

document.addEventListener("keydown", function (e) {
  if (e.key === panicKey) {
    window.location.href = panicLink;
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

// Online status tracking for chat system
function initializeOnlineStatus() {
  const uuid = localStorage.getItem("uuid");
  console.log("Initializing online status tracking for UUID:", uuid);

  // Only track if user is logged in and not on chat page (chat page handles its own connection)
  if (uuid && !window.location.pathname.startsWith("/chat")) {
    console.log("Setting up status socket connection (not on chat page)");
    let statusSocket;

    function connectStatusSocket() {
      try {
        console.log("Attempting to connect status socket for user:", uuid);

        // Check if socket.io is available
        if (typeof io === "undefined") {
          console.error("Socket.IO library not loaded");
          throw new Error("Socket.IO library not available");
        }

        console.log("Socket.IO library is available, creating connection...");
        statusSocket = io();

        statusSocket.on("connect", () => {
          console.log("Status socket connected successfully");
          statusSocket.emit("authenticate", { uuid });
        });

        statusSocket.on("disconnect", () => {
          console.log("Status socket disconnected");
        });

        statusSocket.on("connect_error", (error) => {
          console.error("Status socket connection error:", error);
        });

        statusSocket.on("error", (error) => {
          console.error("Status socket error:", error);
        });

        // Handle notifications for new messages
        statusSocket.on("new_message", (data) => {
          if (Notification.permission === "granted") {
            new Notification("New Message", {
              body: data.content,
              icon: "/img/favicon.ico",
            }).onclick = () => {
              window.open(`/chat/${data.chatId}`, "_blank");
            };
          }
        });

        // Heartbeat to keep connection alive
        setInterval(() => {
          if (statusSocket && statusSocket.connected) {
            statusSocket.emit("heartbeat", { uuid });
          } else {
            console.warn(
              "Status socket not connected during heartbeat attempt"
            );
          }
        }, 30000); // Every 30 seconds

        console.log("Status socket setup completed");
      } catch (error) {
        console.error("Error setting up chat system:", error);
        console.log("Chat system not available");
      }
    }

    connectStatusSocket();

    window.addEventListener("beforeunload", () => {
      if (statusSocket) {
        statusSocket.disconnect();
      }
    });
  } else {
    console.log(
      "Status socket not initialized - either no UUID or on chat page"
    );
    if (!uuid) {
      console.log("No UUID found in localStorage");
    }
    if (window.location.pathname.startsWith("/chat")) {
      console.log("On chat page - status socket handled by chat system");
    }
  }
}
