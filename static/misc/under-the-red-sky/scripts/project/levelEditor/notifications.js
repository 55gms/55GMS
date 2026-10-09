// Notifications system for the Level Editor
// Renders a stack of toast-like notifications below the top toolbar (top-left)

import { Theme } from "./inspectorUI.js";

export class NotificationsManager {
  constructor(container = document.body) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.root = null;
    this.maxVisible = 6;
    this.counter = 0;

    this.init();
  }

  init() {
    this.ensureStyles();
    this.ensureRoot();
  }

  ensureRoot() {
    if (this.root && document.body.contains(this.root)) return;
    const root = document.createElement("div");
    root.id = "notifications-root";
    root.className = "notifications-root";
    document.body.appendChild(root);
    this.root = root;
  }

  ensureStyles() {
    if (document.getElementById("notifications-styles")) return;
    const style = document.createElement("style");
    style.id = "notifications-styles";
    style.textContent = `
      .notifications-root {
        position: fixed;
        top: 56px; /* below 48px toolbar with small gap */
        left: 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 950; /* above toolbar(900), under tooltips(>1000) */
        z-index: 1100;
        pointer-events: none; /* let clicks pass except on toasts */
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .notification-item {
        min-width: 260px;
        max-width: 440px;
        background: ${Theme.componentDisabledBackground};
        color: ${Theme.textPrimary};
        border: 1px solid ${Theme.borderPrimary};
        border-left-width: 4px;
        border-radius: 4px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.35);
        padding: 10px 12px;
        display: grid;
        grid-template-columns: 20px 1fr auto;
        align-items: start;
        gap: 10px;
        opacity: 0;
        transform: translateY(-6px);
        transition: opacity 160ms ease, transform 160ms ease;
        pointer-events: auto;
      }

      .notification-item.show {
        opacity: 1;
        transform: translateY(0);
      }

      .notification-icon {
        margin-top: 2px;
        width: 18px; height: 18px;
      }

      .notification-title {
        font-weight: 700;
        font-size: 0.9rem;
        line-height: 1.2;
        margin-bottom: 2px;
      }

      .notification-message {
        font-size: 0.85rem;
        color: ${Theme.textSecondary};
        line-height: 1.2;
      }

      .notification-close {
        background: transparent;
        border: none;
        color: ${Theme.textMuted};
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
        padding: 0 2px;
      }

      .notification-item.info    { border-left-color: ${Theme.primary}; }
      .notification-item.success { border-left-color: ${
        Theme.success || "#11dc68"
      }; }
      .notification-item.warning { border-left-color: ${
        Theme.warning || "#ffa500"
      }; }
      .notification-item.error   { border-left-color: ${
        Theme.danger || "#ff4961"
      }; }
    `;
    document.head.appendChild(style);
  }

  // Generic show
  show(message, options = {}) {
    const {
      title = "",
      type = "info", // info | success | warning | error
      duration = 1500,
    } = options;

    this.ensureRoot();

    // enforce max
    const existing = Array.from(
      this.root.querySelectorAll(".notification-item")
    );
    while (existing.length >= this.maxVisible) {
      const first = existing.shift();
      if (first) first.remove();
    }

    const item = document.createElement("div");
    item.className = `notification-item ${type}`;

    const icon = document.createElement("div");
    icon.className = "notification-icon";
    icon.innerHTML = this.getIconSvg(type);

    const content = document.createElement("div");
    const titleEl = document.createElement("div");
    titleEl.className = "notification-title";
    titleEl.textContent = title || this.defaultTitle(type);
    const messageEl = document.createElement("div");
    messageEl.className = "notification-message";
    messageEl.textContent = message;
    content.appendChild(titleEl);
    if (message) content.appendChild(messageEl);

    const close = document.createElement("button");
    close.className = "notification-close";
    close.setAttribute("aria-label", "Close");
    close.textContent = "×";
    close.addEventListener("click", () => this.dismiss(item));

    item.appendChild(icon);
    item.appendChild(content);
    item.appendChild(close);
    this.root.prepend(item);

    // animate in
    requestAnimationFrame(() => item.classList.add("show"));

    // auto-dismiss
    if (duration > 0) {
      const timeoutId = setTimeout(() => this.dismiss(item), duration);
      // Pause on hover
      let remaining = duration;
      let start = Date.now();
      item.addEventListener("mouseenter", () => {
        clearTimeout(timeoutId);
        remaining -= Date.now() - start;
      });
      item.addEventListener(
        "mouseleave",
        () => {
          start = Date.now();
          setTimeout(() => this.dismiss(item), Math.max(600, remaining));
        },
        { once: true }
      );
    }

    return item;
  }

  info(message, options = {}) {
    return this.show(message, { ...options, type: "info" });
  }
  success(message, options = {}) {
    return this.show(message, { ...options, type: "success" });
  }
  warning(message, options = {}) {
    return this.show(message, { ...options, type: "warning" });
  }
  error(message, options = {}) {
    return this.show(message, { ...options, type: "error" });
  }

  dismiss(item) {
    if (!item) return;
    item.classList.remove("show");
    setTimeout(() => item.remove(), 160);
  }

  defaultTitle(type) {
    switch (type) {
      case "success":
        return "Success";
      case "warning":
        return "Warning";
      case "error":
        return "Error";
      default:
        return "Notice";
    }
  }

  getIconSvg(type) {
    const color =
      {
        info: Theme.primary,
        success: Theme.success || "#11dc68",
        warning: Theme.warning || "#ffa500",
        error: Theme.danger || "#ff4961",
      }[type] || Theme.primary;

    // simple circle indicator
    return `<svg viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="6" />
    </svg>`;
  }

  destroy() {
    this.root.remove();
    this.root = null;
    this.container = null;
    const styles = document.getElementById("notifications-styles");
    if (styles) {
      styles.remove();
    }
  }
}

// Singleton helpers
let notificationsInstance = null;

export function initializeNotifications(container = document.body) {
  if (!notificationsInstance) {
    notificationsInstance = new NotificationsManager(container);
  }
  return notificationsInstance;
}

export function destroyNotifications() {
  if (notificationsInstance) {
    notificationsInstance.destroy();
    notificationsInstance = null;
  }
}

export function getNotifications() {
  return notificationsInstance;
}
