// Save Changes Dialog for Level Editor
// Prompts users to save unsaved changes before performing destructive actions

import { Theme } from "./inspectorUI.js";

export class SaveChangesDialog {
  constructor(container = document.body) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.dialog = null;
    this.backdrop = null;
    this.isVisible = false;
    this.onSave = null;
    this.onDontSave = null;
    this.onCancel = null;

    this.applyStyles();
  }

  show(options = {}) {
    const {
      title = "Unsaved Changes",
      message = "You have unsaved changes. What would you like to do?",
      actionDescription = "continuing",
      onSave = () => {},
      onDontSave = () => {},
      onCancel = () => {},
    } = options;

    if (this.isVisible) {
      return;
    }

    this.onSave = onSave;
    this.onDontSave = onDontSave;
    this.onCancel = onCancel;

    this.createDialog(title, message, actionDescription);
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

  createDialog(title, message, actionDescription) {
    // Create backdrop
    this.backdrop = document.createElement("div");
    this.backdrop.className = "save-changes-dialog-backdrop";
    this.backdrop.addEventListener("click", (e) => {
      if (e.target === this.backdrop) {
        this.handleCancel();
      }
    });

    // Create main dialog
    this.dialog = document.createElement("div");
    this.dialog.className = "save-changes-dialog";

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

    const actionElement = document.createElement("p");
    actionElement.className = "dialog-action-description";
    actionElement.textContent = `Any unsaved changes will be lost when ${actionDescription}.`;

    content.appendChild(messageElement);
    content.appendChild(actionElement);

    // Create footer
    const footer = document.createElement("div");
    footer.className = "dialog-footer";

    const cancelButton = document.createElement("button");
    cancelButton.className = "dialog-button dialog-button-secondary";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", () => this.handleCancel());

    const dontSaveButton = document.createElement("button");
    dontSaveButton.className = "dialog-button dialog-button-warning";
    dontSaveButton.textContent = "Don't Save";
    dontSaveButton.addEventListener("click", () => this.handleDontSave());

    const saveButton = document.createElement("button");
    saveButton.className = "dialog-button dialog-button-primary";
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => this.handleSave());

    footer.appendChild(cancelButton);
    footer.appendChild(dontSaveButton);
    footer.appendChild(saveButton);

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

    // Focus the save button by default
    setTimeout(() => {
      saveButton.focus();
    }, 100);
  }

  setupEventHandlers() {
    // Prevent event bubbling
    this.dialog.addEventListener("click", (e) => e.stopPropagation());
    this.dialog.addEventListener("keydown", (e) => e.stopPropagation());

    // Handle keyboard navigation
    this.dialog.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        this.handleCancel();
      }
    });
  }

  handleSave() {
    if (this.onSave) {
      this.onSave();
    }
    this.hide();
  }

  handleDontSave() {
    if (this.onDontSave) {
      this.onDontSave();
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
    if (!document.querySelector("#save-changes-dialog-styles")) {
      const style = document.createElement("style");
      style.id = "save-changes-dialog-styles";
      style.textContent = `
        /* Save Changes Dialog Styles */
        .save-changes-dialog-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 1002;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .save-changes-dialog-backdrop.visible {
          opacity: 1;
          visibility: visible;
        }

        .save-changes-dialog {
          background: ${Theme.sidebarBackground};
          border: 1px solid ${Theme.borderPrimary};
          border-radius: 0px;
          width: 450px;
          max-width: 90vw;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          transform: scale(0.9) translateY(-20px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .save-changes-dialog.visible {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        .save-changes-dialog .dialog-header {
          background: #f0ad4e;
          color: #212529;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .save-changes-dialog .dialog-title {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          text-align: center;
          text-transform: uppercase;
        }

        .save-changes-dialog .dialog-content {
          padding: 24px 20px;
        }

        .save-changes-dialog .dialog-message {
          margin: 0 0 12px 0;
          color: ${Theme.textPrimary};
          font-size: 0.95rem;
          line-height: 1.5;
          text-align: center;
          font-weight: 500;
        }

        .save-changes-dialog .dialog-action-description {
          margin: 0;
          color: ${Theme.textSecondary};
          font-size: 0.85rem;
          line-height: 1.4;
          text-align: center;
          font-style: italic;
        }

        .save-changes-dialog .dialog-footer {
          padding: 20px 24px;
          background: ${Theme.componentBackground};
          border-top: 1px solid ${Theme.borderSecondary};
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .save-changes-dialog .dialog-button {
          padding: 10px 20px;
          border: none;
          border-radius: 0px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 100px;
          font-family: inherit;
        }

        .save-changes-dialog .dialog-button-secondary {
          background: ${Theme.componentBackground};
          color: ${Theme.textSecondary};
          border: 1px solid ${Theme.borderSecondary};
        }

        .save-changes-dialog .dialog-button-secondary:hover {
          background: ${Theme.componentHoverBackground};
          color: ${Theme.textPrimary};
          border-color: ${Theme.primary};
        }

        .save-changes-dialog .dialog-button-primary {
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
          border: 1px solid ${Theme.primary};
        }

        .save-changes-dialog .dialog-button-primary:hover {
          background: ${Theme.primaryHover};
          border-color: ${Theme.primaryHover};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .save-changes-dialog .dialog-button-warning {
          background: #f0ad4e;
          color: #212529;
          border: 1px solid #f0ad4e;
        }

        .save-changes-dialog .dialog-button-warning:hover {
          background: #ec971f;
          border-color: #ec971f;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(240, 173, 78, 0.3);
        }

        .save-changes-dialog .dialog-button:focus {
          outline: 2px solid ${Theme.borderFocus};
          outline-offset: 2px;
        }

        /* Responsive design */
        @media (max-width: 500px) {
          .save-changes-dialog {
            width: 95vw;
            margin: 20px;
          }
          
          .save-changes-dialog .dialog-footer {
            flex-direction: column;
          }
          
          .save-changes-dialog .dialog-button {
            width: 100%;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  destroy() {
    this.hide();

    const styles = document.querySelector("#save-changes-dialog-styles");
    if (styles) {
      styles.remove();
    }
  }
}

// Global instance for easy access
let saveChangesDialogInstance = null;

export function showSaveChangesDialog(options) {
  if (!saveChangesDialogInstance) {
    saveChangesDialogInstance = new SaveChangesDialog();
  }

  return new Promise((resolve) => {
    const originalOnSave = options.onSave || (() => {});
    const originalOnDontSave = options.onDontSave || (() => {});
    const originalOnCancel = options.onCancel || (() => {});

    saveChangesDialogInstance.show({
      ...options,
      onSave: () => {
        originalOnSave();
        resolve("save");
      },
      onDontSave: () => {
        originalOnDontSave();
        resolve("dontSave");
      },
      onCancel: () => {
        originalOnCancel();
        resolve("cancel");
      },
    });
  });
}

export function initializeSaveChangesDialog() {
  if (!saveChangesDialogInstance) {
    saveChangesDialogInstance = new SaveChangesDialog();
    globalThis._editorScope.saveChangesDialog = saveChangesDialogInstance;
  }
  return saveChangesDialogInstance;
}

export function destroySaveChangesDialog() {
  if (saveChangesDialogInstance) {
    saveChangesDialogInstance.destroy();
    saveChangesDialogInstance = null;
  }
}
