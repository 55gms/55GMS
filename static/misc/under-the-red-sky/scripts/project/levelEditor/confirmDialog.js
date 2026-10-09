// Confirmation Dialog for Level Editor
// A modern replacement for the browser's confirm() dialog

import { Theme } from "./inspectorUI.js";

export class ConfirmDialog {
  constructor(container = document.body) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.dialog = null;
    this.backdrop = null;
    this.isVisible = false;
    this.onConfirm = null;
    this.onCancel = null;

    this.applyStyles();
  }

  show(options = {}) {
    const {
      title = "Confirm Action",
      message = "Are you sure you want to continue?",
      confirmText = "Confirm",
      cancelText = "Cancel",
      type = "default", // default, danger, warning
      onConfirm = () => {},
      onCancel = () => {},
    } = options;

    if (this.isVisible) {
      return;
    }

    this.onConfirm = onConfirm;
    this.onCancel = onCancel;

    this.createDialog(title, message, confirmText, cancelText, type);
    this.isVisible = true;

    // Hide tooltip if toolbar is available
    if (globalThis._editorScope?.toolbar) {
      globalThis._editorScope.toolbar.hideTooltip();
    }
  }

  hide() {
    if (!this.isVisible) {
      return;
    }

    if (this.backdrop) {
      this.backdrop.classList.remove("visible");
    }
    if (this.dialog) {
      this.dialog.classList.remove("visible");
    }

    // Remove elements after animation
    setTimeout(() => {
      if (this.backdrop && this.backdrop.parentNode) {
        this.backdrop.parentNode.removeChild(this.backdrop);
      }
      this.backdrop = null;
      this.dialog = null;
    }, 300);

    this.isVisible = false;
  }

  createDialog(title, message, confirmText, cancelText, type) {
    // Create backdrop
    this.backdrop = document.createElement("div");
    this.backdrop.className = "confirm-dialog-backdrop";
    this.backdrop.addEventListener("click", (e) => {
      if (e.target === this.backdrop) {
        this.handleCancel();
      }
    });

    // Create main dialog
    this.dialog = document.createElement("div");
    this.dialog.className = `confirm-dialog confirm-dialog-${type}`;

    // Create header
    const header = document.createElement("div");
    header.className = "dialog-header";

    const titleElement = document.createElement("h2");
    titleElement.className = "dialog-title";
    titleElement.textContent = title;

    header.appendChild(titleElement);

    // Create content
    const content = document.createElement("div");
    content.className = "dialog-content";

    const messageElement = document.createElement("p");
    messageElement.className = "dialog-message";
    messageElement.textContent = message;

    content.appendChild(messageElement);

    // Create footer
    const footer = document.createElement("div");
    footer.className = "dialog-footer";

    const cancelButton = document.createElement("button");
    cancelButton.className = "dialog-button dialog-button-secondary";
    cancelButton.textContent = cancelText;
    cancelButton.addEventListener("click", () => this.handleCancel());

    const confirmButton = document.createElement("button");
    confirmButton.className = `dialog-button dialog-button-${
      type === "danger" ? "danger" : "primary"
    }`;
    confirmButton.textContent = confirmText;
    confirmButton.addEventListener("click", () => this.handleConfirm());

    footer.appendChild(cancelButton);
    footer.appendChild(confirmButton);

    // Assemble dialog
    this.dialog.appendChild(header);
    this.dialog.appendChild(content);
    this.dialog.appendChild(footer);

    // Add to backdrop and container
    this.backdrop.appendChild(this.dialog);
    this.container.appendChild(this.backdrop);

    // Setup event handlers
    this.setupEventHandlers();

    // Animate in
    setTimeout(() => {
      this.backdrop.classList.add("visible");
      this.dialog.classList.add("visible");
    }, 10);

    // Focus the appropriate button
    setTimeout(() => {
      if (type === "danger") {
        cancelButton.focus();
      } else {
        confirmButton.focus();
      }
    }, 100);
  }

  setupEventHandlers() {
    // Block all events to the page
    const eventsToBlock = [
      "mousedown",
      "mouseup",
      "mousemove",
      "click",
      "contextmenu",
      "wheel",
      "keydown",
      //"keyup",
      "keypress",
      "touchstart",
      "touchend",
      "touchmove",
    ];
    eventsToBlock.forEach((eventType) => {
      this.dialog.addEventListener(
        eventType,
        (e) => {
          e.stopPropagation();
        },
        { passive: false }
      );
    });

    // Handle keyboard navigation
    this.dialog.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        this.handleCancel();
      } else if (e.key === "Enter") {
        e.preventDefault();
        this.handleConfirm();
      }
    });
  }

  handleConfirm() {
    if (this.onConfirm) {
      this.onConfirm();
    }
    this.hide();
  }

  handleCancel() {
    if (this.onCancel) {
      this.onCancel();
    }
    this.hide();
  }

  applyStyles() {
    if (!document.querySelector("#confirm-dialog-styles")) {
      const style = document.createElement("style");
      style.id = "confirm-dialog-styles";
      style.textContent = `
        /* Confirm Dialog Styles */
        .confirm-dialog-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 3000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .confirm-dialog-backdrop.visible {
          opacity: 1;
          visibility: visible;
        }

        .confirm-dialog {
          background: ${Theme.sidebarBackground};
          border: 1px solid ${Theme.borderPrimary};
          border-radius: 0px;
          width: 400px;
          max-width: 90vw;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          transform: scale(0.9) translateY(-20px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .confirm-dialog.visible {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        .confirm-dialog-danger .dialog-header {
          background: ${Theme.error};
          color: ${Theme.textPrimary};
        }

        .confirm-dialog-warning .dialog-header {
          background: ${Theme.warning};
          color: ${Theme.componentBackground};
        }

        .confirm-dialog-default .dialog-header {
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
        }

        .confirm-dialog .dialog-header {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
        }

        .confirm-dialog .dialog-title {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          text-align: center;
        }

        .confirm-dialog .dialog-content {
          padding: 24px 20px;
        }

        .confirm-dialog .dialog-message {
          margin: 0;
          color: ${Theme.textPrimary};
          font-size: 0.95rem;
          line-height: 1.5;
          text-align: center;
        }

        .confirm-dialog .dialog-footer {
          padding: 20px 24px;
          background: ${Theme.componentBackground};
          border-top: 1px solid ${Theme.borderSecondary};
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .confirm-dialog .dialog-button {
          padding: 10px 20px;
          border: none;
          border-radius: 0px;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 100px;
          font-family: inherit;
        }

        .confirm-dialog .dialog-button-secondary {
          background: ${Theme.componentBackground};
          color: ${Theme.textSecondary};
          border: 1px solid ${Theme.borderSecondary};
        }

        .confirm-dialog .dialog-button-secondary:hover {
          background: ${Theme.componentHoverBackground};
          color: ${Theme.textPrimary};
          border-color: ${Theme.primary};
        }

        .confirm-dialog .dialog-button-primary {
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
          border: 1px solid ${Theme.primary};
        }

        .confirm-dialog .dialog-button-primary:hover {
          background: ${Theme.primaryHover};
          border-color: ${Theme.primaryHover};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .confirm-dialog .dialog-button-danger {
          background: #dc3545;
          color: white;
          border: 1px solid #dc3545;
        }

        .confirm-dialog .dialog-button-danger:hover {
          background: #c82333;
          border-color: #c82333;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }

        .confirm-dialog .dialog-button:focus {
          outline: 2px solid ${Theme.borderFocus};
          outline-offset: 2px;
        }

        /* Responsive design */
        @media (max-width: 468px) {
          .confirm-dialog {
            width: 95vw;
            margin: 20px;
          }
          
          .confirm-dialog .dialog-footer {
            flex-direction: column;
          }
          
          .confirm-dialog .dialog-button {
            width: 100%;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  destroy() {
    this.hide();

    const styles = document.querySelector("#confirm-dialog-styles");
    if (styles) {
      styles.remove();
    }
  }
}

// Global instance for easy access
let confirmDialogInstance = null;

export function showConfirmDialog(options) {
  if (!confirmDialogInstance) {
    confirmDialogInstance = new ConfirmDialog();
  }

  return new Promise((resolve) => {
    const originalOnConfirm = options.onConfirm || (() => {});
    const originalOnCancel = options.onCancel || (() => {});

    confirmDialogInstance.show({
      ...options,
      onConfirm: () => {
        originalOnConfirm();
        resolve(true);
      },
      onCancel: () => {
        originalOnCancel();
        resolve(false);
      },
    });
  });
}

export function initializeConfirmDialog() {
  if (!confirmDialogInstance) {
    confirmDialogInstance = new ConfirmDialog();
    globalThis._editorScope.confirmDialog = confirmDialogInstance;
  }
  return confirmDialogInstance;
}

export function destroyConfirmDialog() {
  if (confirmDialogInstance) {
    confirmDialogInstance.destroy();
    confirmDialogInstance = null;
  }
}
