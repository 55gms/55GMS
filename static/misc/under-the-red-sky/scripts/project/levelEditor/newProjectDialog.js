// New Project Dialog for Level Editor
// Allows users to create new projects with custom names

import { Theme } from "./inspectorUI.js";

export class NewProjectDialog {
  constructor(container = document.body) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.dialog = null;
    this.backdrop = null;
    this.isVisible = false;
    this.onConfirm = null; // Callback for when project is created
    this.onCancel = null; // Callback for when dialog is cancelled

    this.applyStyles();
  }

  show() {
    if (this.isVisible) {
      return;
    }

    this.createDialog();
    this.isVisible = true;

    // Hide tooltip if toolbar is available
    if (globalThis._editorScope?.toolbar) {
      globalThis._editorScope.toolbar.hideTooltip();
    }

    // Focus the project name input
    setTimeout(() => {
      const projectNameInput = this.dialog.querySelector("#projectNameInput");
      if (projectNameInput) {
        projectNameInput.focus();
        projectNameInput.select();
      }
    }, 100);
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

  createDialog() {
    // Create backdrop
    this.backdrop = document.createElement("div");
    this.backdrop.className = "new-project-dialog-backdrop";
    // If no project is loaded (shown over welcome), make overlay invisible to keep welcome overlay
    const hasProject =
      globalThis._editorScope?.projectManager?.hasProjectLoaded?.();
    if (!hasProject) {
      this.backdrop.classList.add("overlay-invisible");
    }
    this.backdrop.addEventListener("click", (e) => {
      if (e.target === this.backdrop) {
        this.handleCancel();
      }
    });

    // Create main dialog
    this.dialog = document.createElement("div");
    this.dialog.className = "new-project-dialog";

    // Create header
    const header = document.createElement("div");
    header.className = "dialog-header";

    const title = document.createElement("h2");
    title.className = "dialog-title";
    title.textContent = "Create New Project";

    const closeButton = document.createElement("button");
    closeButton.className = "dialog-close";
    closeButton.innerHTML = "✕";
    closeButton.addEventListener("click", () => this.handleCancel());

    header.appendChild(title);
    header.appendChild(closeButton);

    // Create content
    const content = document.createElement("div");
    content.className = "dialog-content";

    // Welcome message
    const welcomeMessage = document.createElement("p");
    welcomeMessage.className = "welcome-message";
    welcomeMessage.textContent =
      "Create a new level editor project. You can add multiple levels and manage shared resources.";

    // Project name section
    const projectNameSection = document.createElement("div");
    projectNameSection.className = "input-section";

    const projectNameLabel = document.createElement("label");
    projectNameLabel.className = "input-label";
    projectNameLabel.textContent = "Project Name";
    projectNameLabel.setAttribute("for", "projectNameInput");

    const projectNameInput = document.createElement("input");
    projectNameInput.type = "text";
    projectNameInput.id = "projectNameInput";
    projectNameInput.className = "dialog-input";
    projectNameInput.value = "My Project";
    projectNameInput.placeholder = "Enter project name";

    projectNameSection.appendChild(projectNameLabel);
    projectNameSection.appendChild(projectNameInput);

    // Initial level name section
    const levelNameSection = document.createElement("div");
    levelNameSection.className = "input-section";

    const levelNameLabel = document.createElement("label");
    levelNameLabel.className = "input-label";
    levelNameLabel.textContent = "Initial Level Name";
    levelNameLabel.setAttribute("for", "levelNameInput");

    const levelNameInput = document.createElement("input");
    levelNameInput.type = "text";
    levelNameInput.id = "levelNameInput";
    levelNameInput.className = "dialog-input";
    levelNameInput.value = "Level 1";
    levelNameInput.placeholder = "Enter initial level name";

    levelNameSection.appendChild(levelNameLabel);
    levelNameSection.appendChild(levelNameInput);

    content.appendChild(welcomeMessage);
    content.appendChild(projectNameSection);
    content.appendChild(levelNameSection);

    // Create footer with buttons
    const footer = document.createElement("div");
    footer.className = "dialog-footer";

    const cancelButton = document.createElement("button");
    cancelButton.className = "dialog-button dialog-button-secondary";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", () => this.handleCancel());

    const createButton = document.createElement("button");
    createButton.className = "dialog-button dialog-button-primary";
    createButton.textContent = "Create Project";
    createButton.addEventListener("click", () => this.handleConfirm());

    footer.appendChild(cancelButton);
    footer.appendChild(createButton);

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
  }

  setupEventHandlers() {
    // Block all events to the page comprehensively like welcome dialog
    const eventsToBlock = [
      "mousedown",
      "mouseup",
      "mousemove",
      "click",
      "contextmenu",
      "wheel",
      "keydown",
      "keypress",
      "touchstart",
      "touchend",
      "touchmove",
    ];

    eventsToBlock.forEach((eventType) => {
      // Block at dialog level
      this.dialog.addEventListener(
        eventType,
        (e) => {
          e.stopPropagation();
        },
        { passive: false }
      );
      // Block at backdrop level to prevent clicks going through
      this.backdrop.addEventListener(
        eventType,
        (e) => {
          e.stopPropagation();
        },
        { passive: false }
      );
    });

    // Handle Enter key to confirm
    this.dialog.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.handleConfirm();
      } else if (e.key === "Escape") {
        e.preventDefault();
        this.handleCancel();
      }
    });

    // Auto-validate inputs
    const projectNameInput = this.dialog.querySelector("#projectNameInput");
    const levelNameInput = this.dialog.querySelector("#levelNameInput");
    const createButton = this.dialog.querySelector(".dialog-button-primary");

    const validateInputs = () => {
      const projectName = projectNameInput.value.trim();
      const levelName = levelNameInput.value.trim();
      createButton.disabled = !projectName || !levelName;
    };

    projectNameInput.addEventListener("input", validateInputs);
    levelNameInput.addEventListener("input", validateInputs);

    // Initial validation
    validateInputs();
  }

  handleConfirm() {
    const projectNameInput = this.dialog.querySelector("#projectNameInput");
    const levelNameInput = this.dialog.querySelector("#levelNameInput");

    const projectName = projectNameInput.value.trim();
    const levelName = levelNameInput.value.trim();

    if (!projectName || !levelName) {
      this.showError("Please enter both project name and level name.");
      return;
    }

    const result = {
      projectName,
      levelName,
    };

    if (this.onConfirm) {
      this.onConfirm(result);
    }

    this.hide();
  }

  handleCancel() {
    if (this.onCancel) {
      this.onCancel();
    }
    this.hide();
  }

  showError(message) {
    // Remove existing error
    const existingError = this.dialog.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Create error element
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;

    // Insert before footer
    const footer = this.dialog.querySelector(".dialog-footer");
    this.dialog.insertBefore(errorElement, footer);

    // Remove error after 5 seconds
    setTimeout(() => {
      if (errorElement && errorElement.parentNode) {
        errorElement.remove();
      }
    }, 5000);
  }

  applyStyles() {
    if (!document.querySelector("#new-project-dialog-styles")) {
      const style = document.createElement("style");
      style.id = "new-project-dialog-styles";
      style.textContent = `
        /* New Project Dialog Styles */
        .new-project-dialog-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 1001; /* == editor toolbar (1001); appended later, so it paints above it */
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* When stacked on top of the welcome overlay, don't render its own overlay visuals */
        .new-project-dialog-backdrop.overlay-invisible {
          background: transparent;
          backdrop-filter: none;
        }

        .new-project-dialog-backdrop.visible {
          opacity: 1;
          visibility: visible;
        }

        .new-project-dialog {
          background: ${Theme.sidebarBackground};
          border: 1px solid ${Theme.borderPrimary};
          border-radius: 0px;
          width: 500px;
          max-width: 90vw;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          transform: scale(0.9) translateY(-20px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .new-project-dialog.visible {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        .new-project-dialog .dialog-header {
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 0px 0px 0 0;
        }

        .new-project-dialog .dialog-title {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: ${Theme.textPrimary};
        }

        .new-project-dialog .dialog-close {
          background: transparent;
          border: none;
          color: ${Theme.textPrimary};
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 0px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .new-project-dialog .dialog-close:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        .new-project-dialog .dialog-content {
          padding: 24px;
          overflow-y: auto;
          max-height: calc(80vh - 160px);
        }

        .new-project-dialog .welcome-message {
          margin: 0 0 24px 0;
          color: ${Theme.textSecondary};
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .new-project-dialog .input-section {
          margin-bottom: 20px;
        }

        .new-project-dialog .input-label {
          display: block;
          font-weight: 600;
          color: ${Theme.textPrimary};
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 8px 0;
        }

        .new-project-dialog .dialog-input {
          width: 100%;
          padding: 12px 16px;
          background: ${Theme.inputBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0px;
          color: ${Theme.textPrimary};
          font-size: 0.95rem;
          transition: all 0.2s ease;
          box-sizing: border-box;
          font-family: inherit;
        }

        .new-project-dialog .dialog-input:focus {
          outline: none;
          border-color: ${Theme.borderFocus};
          background: ${Theme.inputFocusBackground};
          box-shadow: 0 0 0 3px rgba(0, 122, 204, 0.1);
        }

        .new-project-dialog .dialog-input::placeholder {
          color: ${Theme.textMuted};
        }

        .new-project-dialog .features-info {
          margin-top: 24px;
          padding: 16px;
          background: ${Theme.componentBackground};
          border-radius: 0px;
          border: 1px solid ${Theme.borderSecondary};
        }

        .new-project-dialog .features-info h4 {
          margin: 0 0 12px 0;
          color: ${Theme.textPrimary};
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .new-project-dialog .features-info ul {
          margin: 0;
          padding: 0 0 0 20px;
          color: ${Theme.textSecondary};
          font-size: 0.85rem;
          line-height: 1.6;
        }

        .new-project-dialog .features-info li {
          margin-bottom: 4px;
        }

        .new-project-dialog .dialog-footer {
          padding: 20px 24px;
          background: ${Theme.componentBackground};
          border-top: 1px solid ${Theme.borderSecondary};
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .new-project-dialog .dialog-button {
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

        .new-project-dialog .dialog-button-secondary {
          background: ${Theme.componentBackground};
          color: ${Theme.textSecondary};
          border: 1px solid ${Theme.borderSecondary};
        }

        .new-project-dialog .dialog-button-secondary:hover {
          background: ${Theme.componentHoverBackground};
          color: ${Theme.textPrimary};
          border-color: ${Theme.primary};
        }

        .new-project-dialog .dialog-button-primary {
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
          border: 1px solid ${Theme.primary};
        }

        .new-project-dialog .dialog-button-primary:hover:not(:disabled) {
          background: ${Theme.primaryHover};
          border-color: ${Theme.primaryHover};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .new-project-dialog .dialog-button-primary:disabled {
          background: ${Theme.componentDisabledBackground};
          color: ${Theme.textMuted};
          border-color: ${Theme.borderDisabled};
          cursor: not-allowed;
          opacity: 0.6;
        }

        .new-project-dialog .error-message {
          background: #ff4444;
          color: white;
          padding: 12px 16px;
          margin: 16px 0 0 0;
          border-radius: 0px;
          font-size: 0.85rem;
          font-weight: 500;
          animation: slideInError 0.3s ease;
        }

        @keyframes slideInError {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive design */
        @media (max-width: 568px) {
          .new-project-dialog {
            width: 95vw;
            margin: 20px;
          }
          
          .new-project-dialog .dialog-content {
            padding: 20px;
          }
          
          .new-project-dialog .dialog-footer {
            padding: 16px 20px;
            flex-direction: column;
          }
          
          .new-project-dialog .dialog-button {
            width: 100%;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .new-project-dialog-backdrop,
          .new-project-dialog,
          .new-project-dialog .dialog-button {
            transition: none;
          }
          
          .new-project-dialog .dialog-button-primary:hover:not(:disabled) {
            transform: none;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  destroy() {
    this.hide();

    const styles = document.querySelector("#new-project-dialog-styles");
    if (styles) {
      styles.remove();
    }
  }
}

// Singleton for easier access
let newProjectDialogInstance = null;

export function initializeNewProjectDialog() {
  if (!newProjectDialogInstance) {
    newProjectDialogInstance = new NewProjectDialog();
  }
  return newProjectDialogInstance;
}

export function getNewProjectDialog() {
  return newProjectDialogInstance;
}

export function destroyNewProjectDialog() {
  if (newProjectDialogInstance) {
    newProjectDialogInstance.destroy();
    newProjectDialogInstance = null;
  }
}
