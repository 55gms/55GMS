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

  // Initialize notification system
  initializeNotificationSystem();

  // Request notification permission
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
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

// Notification functions
function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function initializeNotificationSystem() {
  // Add notification styles if not already present
  if (!document.getElementById("notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 350px;
      }

      .notification {
        background: #2c2c2c;
        border: 1px solid #444;
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        color: #fff;
        animation: notificationSlideIn 0.3s ease;
        cursor: pointer;
        transition: transform 0.2s ease;
      }

      .notification:hover {
        transform: translateX(-5px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
      }

      @keyframes notificationSlideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .notification-title {
        font-weight: 600;
        font-size: 14px;
        color: #fff;
      }

      .notification-time {
        font-size: 12px;
        color: #aaa;
      }

      .notification-message {
        font-size: 13px;
        color: #ddd;
        line-height: 1.4;
      }

      @media (max-width: 768px) {
        .notification-container {
          top: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Add notification container if not already present
  if (!document.getElementById("notificationContainer")) {
    const container = document.createElement("div");
    container.id = "notificationContainer";
    container.className = "notification-container";
    document.body.appendChild(container);
  }
}

function showNotification(title, message, onClick) {
  console.log("showNotification called:", { title, message });

  // Ensure notification system is initialized
  initializeNotificationSystem();

  const container = document.getElementById("notificationContainer");
  if (!container) {
    console.warn("Notification container not found");
    return;
  }

  console.log("Notification container found, creating notification");

  // Try to show browser notification if permission granted
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      const notification = new Notification(title, {
        body: message,
        icon: "/img/favicon.ico",
      });

      notification.onclick = () => {
        window.focus();
        if (onClick) onClick();
        notification.close();
      };

      console.log("Browser notification created");
    } catch (error) {
      console.log("Browser notification failed:", error);
    }
  } else {
    console.log("Browser notification permission:", Notification.permission);
  }

  const notificationElement = document.createElement("div");
  notificationElement.className = "notification";
  notificationElement.innerHTML = `
    <div class="notification-header">
      <div class="notification-title">${escapeHtml(title)}</div>
      <div class="notification-time">${formatTime(new Date())}</div>
    </div>
    <div class="notification-message">${escapeHtml(message)}</div>
  `;

  if (onClick) {
    notificationElement.onclick = () => {
      onClick();
      notificationElement.remove();
    };
    notificationElement.style.cursor = "pointer";
  }

  container.appendChild(notificationElement);
  console.log("In-page notification added to container");

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notificationElement.parentElement) {
      notificationElement.remove();
      console.log("Notification auto-removed");
    }
  }, 5000);
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Test function for notifications (can be called from browser console)
function testNotification() {
  console.log("Testing notification system...");
  showNotification(
    "Test Notification",
    "This is a test notification to verify the system is working!",
    () => {
      console.log("Test notification clicked!");
    }
  );
}

// Online status tracking for chat system
function initializeOnlineStatus() {
  const uuid = localStorage.getItem("uuid");
  console.log("Initializing online status tracking for UUID:", uuid);

  // Only track if user is logged in and not on chat page (chat page handles its own connection)
  if (
    uuid &&
    !window.location.pathname.startsWith("/chat") &&
    !window.location.pathname.startsWith("/c")
  ) {
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
          console.log("Sending authentication for UUID:", uuid);
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

        // Listen for authentication confirmation
        statusSocket.on("authenticated", (data) => {
          console.log("Status socket authenticated:", data);
        });

        // Handle notifications for new messages
        statusSocket.on("new_message_notification", (data) => {
          console.log("Received new_message_notification:", data);

          // Show in-page notification
          showNotification(
            `New Message from ${data.senderUsername}`,
            data.content,
            () => {
              window.open(`/chat/${data.chatId}`, "_blank");
            }
          );

          console.log(
            "Notification shown for message from",
            data.senderUsername
          );
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
