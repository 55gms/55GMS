// Welcome Dialog for Level Editor
// Shows on startup with options to create, open, or select recent projects

import { Theme } from "./inspectorUI.js";
import { NewProject, Open, Sign, Cross, Book, Eye } from "./iconList.js";
import { getWelcomeState } from "./welcomeState.js";
import { showConfirmDialog } from "./confirmDialog.js";
import { getExampleProject } from "./exampleProject.js";
import {
  MAX_RECENT_PROJECTS,
  RECENT_PROJECTS_KEY,
  INDEXEDDB_NAME,
  INDEXEDDB_VERSION,
  STORE_NAME,
  MANUAL_URL,
  WELCOME_QUOTES,
} from "./globalValues.js";

/**
 * Get the username of the current player
 * @returns {string|null} The username, or null/undefined if not available
 */
function getPlayerUsername() {
  return (
    globalThis?._editorScope?.runtime?.callFunction("GetPlayerName", false) ||
    null
  );
}

export class WelcomeDialog {
  constructor(container = document.body) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.dialog = null;
    this.backdrop = null;
    this.isVisible = false;
    this.onNewProject = null;
    this.onOpenProject = null;
    this.projectManager = null;
    this.isHiding = false;
    this.showAgain = false;

    // Orbit parameters and state
    this.orbitParams = {
      radius: 1300,
      height: 600,
      speed: 0.3, // radians per second
      target: [0, 0, 0],
    };
    this._orbitRAF = null;
    this._orbitStartTime = 0;

    this.applyStyles();
  }

  // Public API to set orbit parameters
  setOrbitParameters({ radius, height, speed } = {}) {
    if (typeof radius === "number") this.orbitParams.radius = radius;
    if (typeof height === "number") this.orbitParams.height = height;
    if (typeof speed === "number") this.orbitParams.speed = speed;
  }

  startOrbitAnimation() {
    const cameraController = globalThis._editorScope?.cameraController;
    if (!cameraController) return;

    // Set initial camera target and position directly (no orbit mode)
    const [tx, ty, tz] = this.orbitParams.target;
    cameraController.setCameraTransform({
      position: [
        tx + this.orbitParams.radius,
        ty,
        tz + this.orbitParams.height,
      ],
      target: [tx, ty, tz],
      up: [0, 0, 1],
    });

    this._orbitStartTime = performance.now();
    const animate = (t) => {
      const elapsed = (t - this._orbitStartTime) / 1000;
      const angle = elapsed * this.orbitParams.speed;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      cameraController.setCameraTransform({
        position: [
          tx + this.orbitParams.radius * cosA,
          ty + this.orbitParams.radius * sinA,
          tz + this.orbitParams.height,
        ],
        target: [tx, ty, tz],
        up: [0, 0, 1],
      });
      this._orbitRAF = requestAnimationFrame(animate);
    };
    this._orbitRAF = requestAnimationFrame(animate);
  }
  stopOrbitAnimation() {
    if (this._orbitRAF) {
      cancelAnimationFrame(this._orbitRAF);
      this._orbitRAF = null;
    }
  }

  show() {
    if (this.isHiding) {
      this.showAgain = true;
      return;
    }

    this.showAgain = false;
    if (this.isVisible) {
      // If overlay is present but dialog is gone, rebuild dialog only
      if (!this.dialog && this.backdrop) {
        this.showDialogOnly();
      }
      return;
    }

    this.projectManager = globalThis._editorScope?.projectManager;
    this.createDialog();
    this.isVisible = true;

    // Hide editor chrome (toolbar, inspector, inventory bar) when welcome is visible
    try {
      globalThis._editorScope?.toolbar?.hide();
      globalThis._editorScope?.inspectorUI?.hide();
      globalThis._editorScope?.placingSystem?.inventoryBar?.hide();
    } catch (e) {}

    // Load predefined welcome state
    try {
      const state = getWelcomeState();
      globalThis._editorScope?.stateManager?.loadFromState(state, {
        destructive: true,
        recordUndo: false,
        preventUnsavedChanges: true,
      });
      this.orbitParams.target = [
        state.levelData.levelSize.width / 2,
        state.levelData.levelSize.height / 2,
        0,
      ];
    } catch (e) {
      console.warn("[WelcomeDialog] Failed to load welcome state:", e);
    }
    // Start camera orbit animation
    this.startOrbitAnimation();

    // Hide tooltip if toolbar is available
    if (globalThis._editorScope?.toolbar) {
      globalThis._editorScope.toolbar.hideTooltip();
    }

    // Focus the new project button by default
    setTimeout(() => {
      const newProjectButton = this.dialog.querySelector(
        ".welcome-action-button"
      );
      if (newProjectButton) {
        newProjectButton.focus();
      }
    }, 100);
  }

  hide() {
    if (!this.isVisible) {
      return;
    }
    this.isHiding = true;

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
      this.isHiding = false;
      if (this.showAgain) {
        this.show();
      }
    }, 300);

    this.isVisible = false;

    // Show editor chrome (toolbar, inspector, inventory bar) again
    try {
      globalThis._editorScope?.toolbar?.show();
      globalThis._editorScope?.inspectorUI?.show();
      globalThis._editorScope?.placingSystem?.inventoryBar?.show();
    } catch (e) {}

    // Stop orbit animation
    this.stopOrbitAnimation();
  }

  createDialog() {
    // Create backdrop
    this.backdrop = document.createElement("div");
    this.backdrop.className = "welcome-dialog-backdrop";
    // No click to close on backdrop for welcome dialog

    // Create main dialog
    this.dialog = document.createElement("div");
    this.dialog.className = "welcome-dialog";

    // Create header
    this.createHeader();

    // Create content
    this.createContent();

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

  // Recreate only the dialog within existing backdrop (no overlay/state changes)
  showDialogOnly() {
    if (!this.backdrop || this.dialog) return;
    this.dialog = document.createElement("div");
    this.dialog.className = "welcome-dialog";
    this.createHeader();
    this.createContent();
    this.backdrop.appendChild(this.dialog);
    this.setupEventHandlers();
    setTimeout(() => {
      this.dialog.classList.add("visible");
    }, 10);
  }

  createHeader() {
    const header = document.createElement("div");
    header.className = "welcome-header";

    // Eye button for temporary hide
    const eyeButton = document.createElement("button");
    eyeButton.className = "welcome-eye-button";
    eyeButton.innerHTML = Eye;
    this.setupEyeButton(eyeButton);

    const title = document.createElement("h1");
    title.className = "welcome-title";

    // Get username and customize the welcome message
    const username = getPlayerUsername();
    if (username && username.trim() !== "") {
      // Create a personalized greeting with emphasized username
      title.innerHTML = `Welcome, <span class="welcome-username">${this.escapeHtml(
        username
      )}</span>`;
    } else {
      title.textContent = "Welcome to Level Editor™";
    }

    header.appendChild(eyeButton);
    header.appendChild(title);

    // Create separate quote section
    const quoteSection = document.createElement("div");
    quoteSection.className = "welcome-quote-section";

    const subtitle = document.createElement("p");
    subtitle.className = "welcome-subtitle";

    quoteSection.appendChild(subtitle);
    header.appendChild(quoteSection);

    // Store reference for later use
    this.quoteElement = subtitle;
    this.quoteSection = quoteSection;

    // Add click handler to quote section to get a new quote
    quoteSection.addEventListener("click", () => {
      this.animateQuote();
    });
    quoteSection.style.cursor = "pointer";

    this.dialog.appendChild(header);

    // Animate the initial quote
    setTimeout(() => {
      this.animateQuote();
    }, 100);
  }

  // Animate the inspirational quote with a typing effect
  animateQuote() {
    if (!this.quoteElement) return;

    // Pick a random quote
    const randomQuote =
      WELCOME_QUOTES[Math.floor(Math.random() * WELCOME_QUOTES.length)];

    // Clear current text
    this.quoteElement.textContent = "";

    // Add animating class
    this.quoteElement.classList.add("quote-animating");

    // Animation parameters
    const totalDuration = 1300; // total animation time in ms
    const startTime = performance.now();

    // Easing function (ease-in-out cubic for smooth acceleration and deceleration)
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    // Animation frame function
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      // Apply easing to progress
      const easedProgress = easeInOutCubic(progress);

      // Calculate how many characters to show
      const charsToShow = Math.floor(easedProgress * randomQuote.length);

      // Update text
      this.quoteElement.textContent = randomQuote.substring(0, charsToShow);

      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete
        this.quoteElement.textContent = randomQuote;
        this.quoteElement.classList.remove("quote-animating");
      }
    };

    requestAnimationFrame(animate);
  }

  // Helper method to escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  createContent() {
    const content = document.createElement("div");
    content.className = "welcome-content";

    // Create main actions section
    this.createActionsSection(content);

    // Create recent projects section
    this.createRecentProjectsSection(content);

    this.dialog.appendChild(content);
  }

  setupEyeButton(eyeButton) {
    let isHiding = false;

    const startHide = () => {
      if (isHiding) return;
      isHiding = true;

      // Fade out dialog and backdrop
      if (this.dialog) {
        this.dialog.style.transition = "opacity 0.3s ease";
        this.dialog.style.opacity = "0";
      }
      if (this.backdrop) {
        this.backdrop.style.transition = "opacity 0.3s ease";
        this.backdrop.style.opacity = "0.1";
      }
    };

    const endHide = () => {
      if (!isHiding) return;
      isHiding = false;

      // Fade back in
      if (this.dialog) {
        this.dialog.style.opacity = "1";
      }
      if (this.backdrop) {
        this.backdrop.style.opacity = "1";
      }
    };

    // Mouse events
    eyeButton.addEventListener("mousedown", startHide);
    eyeButton.addEventListener("mouseup", endHide);
    eyeButton.addEventListener("mouseleave", endHide);

    // Touch events for mobile
    eyeButton.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startHide();
    });
    eyeButton.addEventListener("touchend", (e) => {
      e.preventDefault();
      endHide();
    });
    eyeButton.addEventListener("touchcancel", endHide);
  }

  createActionsSection(parent) {
    const section = document.createElement("div");
    section.className = "welcome-section";

    // Button group for secondary actions (exit, manual, example)
    const buttonGroup = document.createElement("div");
    buttonGroup.className = "welcome-button-group";

    // Exit editor button
    const exitButton = document.createElement("button");
    exitButton.className = "welcome-small-button exit-button";
    exitButton.innerHTML = `
      ${Cross}
      <span>Close Editor</span>
    `;
    exitButton.addEventListener("click", () => this.handleExit());

    const gap = document.createElement("div");
    gap.style.flex = "1";

    // Manual button
    const manualButton = document.createElement("button");
    const isManualAvailable = MANUAL_URL && MANUAL_URL.trim() !== "";
    manualButton.className = `welcome-small-button${
      !isManualAvailable ? " disabled" : ""
    }`;
    manualButton.innerHTML = `
      ${Book}
      <span>Open Manual</span>
    `;
    if (isManualAvailable) {
      manualButton.addEventListener("click", () => this.openManual());
    } else {
      manualButton.disabled = true;
      // Add tooltip for disabled state
      const tooltip = document.createElement("div");
      tooltip.className = "welcome-button-tooltip";
      tooltip.textContent = "Sorry, the manual is not available yet";
      manualButton.appendChild(tooltip);
    }

    // Example project button
    const exampleButton = document.createElement("button");
    exampleButton.className = "welcome-small-button";
    exampleButton.innerHTML = `
      ${Sign}
      <span>Open Example Project</span>
    `;
    exampleButton.addEventListener("click", () => this.handleOpenExample());

    buttonGroup.appendChild(exitButton);
    buttonGroup.appendChild(gap);
    buttonGroup.appendChild(manualButton);
    buttonGroup.appendChild(exampleButton);

    // Create header with title only
    const sectionHeader = document.createElement("div");
    sectionHeader.className = "section-header";

    const title = document.createElement("h2");
    title.className = "section-title";
    title.textContent = "Get Started";

    sectionHeader.appendChild(title);

    const actionsGrid = document.createElement("div");
    actionsGrid.className = "welcome-actions-grid";

    // New project button
    const newProjectButton = document.createElement("button");
    newProjectButton.className = "welcome-action-button primary";
    newProjectButton.innerHTML = `
      ${NewProject}
      <div class="action-content">
        <div class="action-title">Create New Project</div>
        <div class="action-description">Start with a fresh new project</div>
      </div>
    `;
    newProjectButton.addEventListener("click", () => this.handleNewProject());

    // Open project button
    const openProjectButton = document.createElement("button");
    openProjectButton.className = "welcome-action-button";
    openProjectButton.innerHTML = `
      ${Open}
      <div class="action-content">
        <div class="action-title">Open Project</div>
        <div class="action-description">Load an existing project file</div>
      </div>
    `;
    openProjectButton.addEventListener("click", () => this.handleOpenProject());

    actionsGrid.appendChild(newProjectButton);
    actionsGrid.appendChild(openProjectButton);

    section.appendChild(buttonGroup);
    section.appendChild(sectionHeader);
    section.appendChild(actionsGrid);
    parent.appendChild(section);
  }

  createRecentProjectsSection(parent) {
    const recentProjects = this.getRecentProjects();

    if (recentProjects.length === 0) {
      return; // Don't show section if no recent projects
    }

    const section = document.createElement("div");
    section.className = "welcome-section";

    const title = document.createElement("h2");
    title.className = "section-title";
    title.textContent = "Recent Projects";

    const projectsList = document.createElement("div");
    projectsList.className = "recent-projects-list";

    recentProjects.forEach((project, index) => {
      const projectItem = this.createRecentProjectItem(project, index);
      projectsList.appendChild(projectItem);
    });

    const footerRow = document.createElement("div");
    footerRow.className = "section-footer-row";
    const clearLinkButton = document.createElement("button");
    clearLinkButton.className = "section-link-button";
    clearLinkButton.textContent = "Clear recent projects";
    clearLinkButton.addEventListener("click", () =>
      this.handleClearRecentProjects()
    );
    footerRow.appendChild(clearLinkButton);

    section.appendChild(title);
    section.appendChild(projectsList);
    section.appendChild(footerRow);
    parent.appendChild(section);
  }

  createRecentProjectItem(project, index) {
    const item = document.createElement("button");
    item.className = "recent-project-item";

    const info = document.createElement("div");
    info.className = "project-info";

    const name = document.createElement("div");
    name.className = "project-name";
    name.textContent = project.name;

    const meta = document.createElement("div");
    meta.className = "project-meta";

    const lastOpened = new Date(project.lastOpened);
    const now = new Date();
    const diffTime = Math.abs(now - lastOpened);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let timeText;
    if (diffDays === 0) {
      timeText = "Today";
    } else if (diffDays === 1) {
      timeText = "Yesterday";
    } else if (diffDays < 7) {
      timeText = `${diffDays} days ago`;
    } else {
      timeText = lastOpened.toLocaleDateString();
    }

    const fileNameText = (project.fileName || "").trim();
    const filePrefix = fileNameText ? `${fileNameText} • ` : "";
    meta.textContent = `${filePrefix}${project.levelCount} levels • ${timeText}`;

    info.appendChild(name);
    info.appendChild(meta);

    const openIcon = document.createElement("div");
    openIcon.className = "project-open-icon";
    openIcon.innerHTML = "→";

    item.appendChild(info);
    item.appendChild(openIcon);

    item.addEventListener("click", () => this.handleOpenRecentProject(project));

    return item;
  }

  refreshContent() {
    if (!this.dialog) return;
    const content = this.dialog.querySelector(".welcome-content");
    if (!content) return;
    content.innerHTML = "";
    this.createActionsSection(content);
    this.createRecentProjectsSection(content);
  }

  async handleClearRecentProjects() {
    try {
      const proceed = await showConfirmDialog({
        title: "Clear Recent Projects",
        message: "Are you sure you want to clear all recent projects?",
        confirmText: "Clear",
        cancelText: "Cancel",
        type: "warning",
      });
      if (proceed) {
        await this.clearRecentProjects();
        this.refreshContent();
      }
    } catch (e) {}
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
      // Block at dialog level
      this.dialog.addEventListener(
        eventType,
        (e) => {
          e.stopPropagation();
        },
        { passive: false }
      );
      // Block at backdrop level so overlay-only also blocks
      this.backdrop.addEventListener(
        eventType,
        (e) => {
          e.stopPropagation();
        },
        { passive: false }
      );
    });

    // Handle keyboard navigation
    // this.dialog.addEventListener("keydown", (e) => {
    //   if (e.key === "Escape") {
    //     // For welcome dialog, escape creates a default project
    //     e.preventDefault();
    //     this.handleNewProject();
    //   }
    // });
  }

  // Hide just the dialog, keep backdrop present and animation running
  collapseToOverlay() {
    if (!this.isVisible) return;
    if (this.dialog) {
      this.dialog.classList.remove("visible");
      this.isHiding = true;
      // Remove dialog element after animation but keep backdrop
      setTimeout(() => {
        if (this.dialog && this.dialog.parentNode) {
          this.dialog.parentNode.removeChild(this.dialog);
        }
        this.dialog = null;
        this.isHiding = false;
        if (this.showAgain) {
          this.show();
        }
      }, 300);
    }
  }

  async handleNewProject() {
    // Collapse to overlay only: keep overlay + orbit running
    this.collapseToOverlay();

    // Show new project dialog
    const newProjectDialog = globalThis._editorScope?.newProjectDialog;
    if (newProjectDialog) {
      newProjectDialog.show();
    }
  }

  async handleOpenProject() {
    // Collapse to overlay only while file picker is open
    this.collapseToOverlay();

    // Open project file
    if (this.projectManager) {
      const success = await this.projectManager.openProjectFile();
      if (!success) {
        // Recreate welcome dialog if user cancelled
        this.showDialogOnly();
      } else {
        // Fully close welcome dialog on success
        this.hide();
      }
    }
  }

  handleExit() {
    globalThis._editorScope.runtime.callFunction("closeEditor");
  }

  handleOpenExample() {
    try {
      // Get the example project data
      const exampleData = getExampleProject();

      // Load the example project using project manager
      if (this.projectManager) {
        const success = this.projectManager.loadProject(exampleData);
        if (success) {
          // Close welcome dialog on success
          this.hide();
        } else {
          console.error("Failed to load example project");
          alert("Failed to load example project. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error loading example project:", error);
      alert("Error loading example project. Please try again.");
    }
  }

  openManual() {
    // Open the manual URL in a new tab
    window.open(MANUAL_URL, "_blank");
  }

  async handleOpenRecentProject(project) {
    // Try to get the stored file handle
    const fileHandle = await this.getStoredFileHandle(project.id);
    if (!fileHandle) {
      // No file handle stored, fall back to regular open
      this.handleOpenProject();
      return;
    }
    this.hide();

    try {
      // Check if we still have permission and the file exists
      const permission = await fileHandle.queryPermission();
      if (permission !== "granted") {
        const requestPermission = await fileHandle.requestPermission();
        if (requestPermission !== "granted") {
          this.showErrorAndRemoveProject(
            project,
            "Permission denied to access the file."
          );
          return;
        }
      }

      // Try to read the file
      const file = await fileHandle.getFile();
      const text = await file.text();

      // Load the project
      const success = this.projectManager.loadProject(text);
      if (success) {
        // Update the file handle in project manager
        this.projectManager.currentFileHandle = fileHandle;

        // Update the recent project's last opened time
        this.updateRecentProjectLastOpened(project.id);
      } else {
        this.showErrorAndRemoveProject(
          project,
          "Failed to load project file. The file may be corrupted."
        );
      }
    } catch (error) {
      console.error("[WelcomeDialog] Failed to open recent project:", error);

      if (error.name === "NotFoundError" || error.name === "NotAllowedError") {
        this.showErrorAndRemoveProject(
          project,
          "The file no longer exists or cannot be accessed."
        );
      } else {
        this.showErrorAndRemoveProject(
          project,
          "An error occurred while opening the file."
        );
      }
    }
  }

  async showErrorAndRemoveProject(project, message) {
    // Remove from recent projects first
    await this.removeRecentProject(project.id);

    // Show error message using the confirm dialog (just for display)
    const confirmDialog = globalThis._editorScope?.confirmDialog;
    if (confirmDialog) {
      confirmDialog.show({
        title: "File Not Found",
        message: `Error opening "${project.name}": ${message}\n\nThe project has been removed from recent projects.`,
        confirmText: "OK",
        type: "warning",
        onConfirm: () => {
          // Show welcome dialog again after user acknowledges
          this.show();
        },
      });
    } else {
      // Fallback to alert if confirm dialog not available
      alert(
        `Error opening "${project.name}": ${message}\n\nThe project will be removed from recent projects.`
      );
      this.show();
    }
  }

  getRecentProjects() {
    try {
      const stored = localStorage.getItem(RECENT_PROJECTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("[WelcomeDialog] Failed to load recent projects:", e);
      return [];
    }
  }

  async addRecentProject(projectInfo) {
    try {
      let recentProjects = this.getRecentProjects();

      // Prefer deduplication by file handle identity to avoid duplicates across renames/time
      let projectId = projectInfo.id;

      // Remove any existing entry for this id or name to avoid duplicates
      recentProjects = recentProjects.filter(
        (p) => p.id !== projectId && p.name !== projectInfo.name
      );

      // Add to beginning of list
      const newProject = {
        id: projectId,
        name: projectInfo.name,
        levelCount: projectInfo.levelCount || 1,
        lastOpened: new Date().toISOString(),
        fileName: projectInfo?.fileHandle?.name ?? "",
      };

      recentProjects.unshift(newProject);

      // Keep only the most recent projects
      recentProjects = recentProjects.slice(0, MAX_RECENT_PROJECTS);

      localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify(recentProjects));

      // Store or update file handle if available and File System API is supported
      if (projectInfo.fileHandle && "showOpenFilePicker" in window) {
        await this.upsertStoredFileHandle(projectId, projectInfo.fileHandle);
      }
    } catch (e) {
      console.warn("[WelcomeDialog] Failed to save recent project:", e);
    }
  }

  /**
   * Find existing stored handle ID that represents the same file system entry.
   * Returns the matching record id, or null if none.
   */
  async findStoredHandleIdForSameEntry(fileHandle) {
    try {
      if (!fileHandle || !("showOpenFilePicker" in window)) {
        return null;
      }
      const db = await this.openIndexedDB();
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const allRecords = await new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
      for (const rec of allRecords) {
        if (rec && rec.fileHandle) {
          try {
            const same = await fileHandle.isSameEntry(rec.fileHandle);
            if (same) {
              return rec.id;
            }
          } catch (_e) {
            // Ignore comparison failures
          }
        }
      }
      return null;
    } catch (e) {
      console.warn("[WelcomeDialog] Failed to search stored handles:", e);
      return null;
    }
  }

  /**
   * Insert or update a stored file handle. If a handle with the same filename
   * already exists under a different ID, migrate it to the provided projectId.
   * @param {string} projectId
   * @param {FileSystemFileHandle} fileHandle
   */
  async upsertStoredFileHandle(projectId, fileHandle) {
    try {
      if (!fileHandle || !("showOpenFilePicker" in window)) {
        return;
      }
      // Compute same-entry match BEFORE opening a write transaction to avoid it going inactive
      const sameId = await this.findStoredHandleIdForSameEntry(fileHandle);

      const db = await this.openIndexedDB();
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      if (sameId && sameId !== projectId) {
        await new Promise((resolve, reject) => {
          const delReq = store.delete(sameId);
          delReq.onsuccess = () => resolve();
          delReq.onerror = () => reject(delReq.error);
        });
        if (globalThis._editorScope._fileHandleCache) {
          globalThis._editorScope._fileHandleCache.delete(sameId);
        }
      }

      const record = {
        id: projectId,
        fileHandle: fileHandle,
        name: fileHandle.name,
        stored: new Date().toISOString(),
      };
      await new Promise((resolve, reject) => {
        const putReq = store.put(record);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      });

      // Update session cache
      if (!globalThis._editorScope._fileHandleCache) {
        globalThis._editorScope._fileHandleCache = new Map();
      }
      globalThis._editorScope._fileHandleCache.set(projectId, fileHandle);
    } catch (e) {
      console.warn("[WelcomeDialog] Failed to upsert file handle:", e);
    }
  }

  async removeRecentProject(projectId) {
    try {
      let recentProjects = this.getRecentProjects();
      recentProjects = recentProjects.filter((p) => p.id !== projectId);
      localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify(recentProjects));

      // Also remove the stored file handle
      await this.removeStoredFileHandle(projectId);
    } catch (e) {
      console.warn("[WelcomeDialog] Failed to remove recent project:", e);
    }
  }

  updateRecentProjectLastOpened(projectId) {
    try {
      let recentProjects = this.getRecentProjects();
      const projectIndex = recentProjects.findIndex((p) => p.id === projectId);

      if (projectIndex !== -1) {
        recentProjects[projectIndex].lastOpened = new Date().toISOString();

        // Move to front of list
        const project = recentProjects.splice(projectIndex, 1)[0];
        recentProjects.unshift(project);

        localStorage.setItem(
          RECENT_PROJECTS_KEY,
          JSON.stringify(recentProjects)
        );
      }
    } catch (e) {
      console.warn("[WelcomeDialog] Failed to update recent project:", e);
    }
  }

  async clearRecentProjects() {
    try {
      localStorage.removeItem(RECENT_PROJECTS_KEY);

      // Clear IndexedDB
      const db = await this.openIndexedDB();
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const clearRequest = store.clear();
      await new Promise((resolve, reject) => {
        clearRequest.onsuccess = () => resolve();
        clearRequest.onerror = () => reject(clearRequest.error);
      });

      // Clear session cache
      if (globalThis._editorScope._fileHandleCache) {
        globalThis._editorScope._fileHandleCache.clear();
      }
    } catch (e) {
      console.warn("[WelcomeDialog] Failed to clear recent projects:", e);
    }
  }

  async storeFileHandle(projectId, fileHandle) {
    try {
      if (!("showOpenFilePicker" in window)) {
        return; // File System API not supported
      }

      // Store file handle in IndexedDB for persistence across sessions
      const db = await this.openIndexedDB();
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const putRequest = store.put({
        id: projectId,
        fileHandle: fileHandle,
        name: fileHandle.name,
        stored: new Date().toISOString(),
      });

      await new Promise((resolve, reject) => {
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      });

      // Also keep in session cache for faster access
      if (!globalThis._editorScope._fileHandleCache) {
        globalThis._editorScope._fileHandleCache = new Map();
      }
      globalThis._editorScope._fileHandleCache.set(projectId, fileHandle);

      console.log(
        `[WelcomeDialog] Stored file handle for project: ${projectId}`
      );
    } catch (e) {
      console.warn("[WelcomeDialog] Failed to store file handle:", e);
    }
  }

  async getStoredFileHandle(projectId) {
    try {
      if (!("showOpenFilePicker" in window)) {
        return null; // File System API not supported
      }

      // Check session cache first for faster access
      if (
        globalThis._editorScope._fileHandleCache &&
        globalThis._editorScope._fileHandleCache.has(projectId)
      ) {
        return globalThis._editorScope._fileHandleCache.get(projectId);
      }

      // Try to get from IndexedDB
      const db = await this.openIndexedDB();
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);

      const getRequest = store.get(projectId);
      const result = await new Promise((resolve, reject) => {
        getRequest.onsuccess = () => resolve(getRequest.result);
        getRequest.onerror = () => reject(getRequest.error);
      });

      if (result && result.fileHandle) {
        // Add to session cache for faster future access
        if (!globalThis._editorScope._fileHandleCache) {
          globalThis._editorScope._fileHandleCache = new Map();
        }
        globalThis._editorScope._fileHandleCache.set(
          projectId,
          result.fileHandle
        );

        console.log(
          `[WelcomeDialog] Retrieved file handle for project: ${projectId}`
        );
        return result.fileHandle;
      }

      return null; // No handle available
    } catch (e) {
      console.warn("[WelcomeDialog] Failed to get stored file handle:", e);
      return null;
    }
  }

  async removeStoredFileHandle(projectId) {
    try {
      // Remove from session cache
      if (globalThis._editorScope._fileHandleCache) {
        globalThis._editorScope._fileHandleCache.delete(projectId);
      }

      // Remove from IndexedDB
      const db = await this.openIndexedDB();
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const deleteRequest = store.delete(projectId);
      await new Promise((resolve, reject) => {
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      });

      console.log(
        `[WelcomeDialog] Removed file handle for project: ${projectId}`
      );
    } catch (e) {
      console.warn("[WelcomeDialog] Failed to remove stored file handle:", e);
    }
  }

  /**
   * Open IndexedDB connection for storing file handles
   * @returns {Promise<IDBDatabase>}
   */
  async openIndexedDB() {
    // Strategy:
    // 1) Try opening without specifying a version. If DB is new, onupgradeneeded will fire and we'll create the store.
    // 2) If DB exists but is missing the store, perform a version bump to add it.
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(INDEXEDDB_NAME);
      request.onerror = () => {
        reject(new Error("Failed to open IndexedDB"));
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("name", "name", { unique: false });
          store.createIndex("stored", "stored", { unique: false });
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        if (db.objectStoreNames.contains(STORE_NAME)) {
          resolve(db);
          return;
        }
        // Store missing in an existing DB. Bump version to add it.
        const nextVersion = Math.max(db.version + 1, 1);
        db.close();
        const upgradeRequest = indexedDB.open(INDEXEDDB_NAME, nextVersion);
        upgradeRequest.onerror = () => {
          reject(new Error("Failed to upgrade IndexedDB schema"));
        };
        upgradeRequest.onupgradeneeded = (event) => {
          const upDb = event.target.result;
          if (!upDb.objectStoreNames.contains(STORE_NAME)) {
            const store = upDb.createObjectStore(STORE_NAME, { keyPath: "id" });
            store.createIndex("name", "name", { unique: false });
            store.createIndex("stored", "stored", { unique: false });
          }
        };
        upgradeRequest.onsuccess = () => {
          resolve(upgradeRequest.result);
        };
      };
    });
  }

  applyStyles() {
    if (!document.querySelector("#welcome-dialog-styles")) {
      const style = document.createElement("style");
      style.id = "welcome-dialog-styles";
      style.textContent = `
        /* Welcome Dialog Styles */
        .welcome-dialog-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, rgba(0, 122, 204, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%);
          backdrop-filter: blur(8px);
          z-index: 1001; /* == editor toolbar (1001); appended later, so it paints above it */
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .welcome-dialog-backdrop.visible {
          opacity: 1;
          visibility: visible;
        }

        .welcome-dialog {
          background: ${Theme.sidebarBackground};
          border: 1px solid ${Theme.borderPrimary};
          border-radius: 0px;
          width: 700px;
          max-width: 90vw;
          max-height: 85vh;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
          transform: scale(0.8) translateY(-40px);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .welcome-dialog.visible {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        .welcome-header {
          background: linear-gradient(0deg, 
            ${Theme.primary}36 0%,
            ${Theme.sidebarBackground} 100%
          );
          color: ${Theme.textPrimary};
          padding: 26px 56px 4px 56px;
          text-align: center;
          position: relative;
          overflow: hidden;
          margin-bottom: 12px;
          border-radius: 0px;
          box-shadow: 
            0 8px 32px ${Theme.primary}40,
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 ${Theme.primary}30;
        }

        .welcome-header::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle at center,
            ${Theme.primary}25 0%,
            transparent 70%
          );
          animation: headerGlow 8s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes headerGlow {
          0%, 100% {
            transform: translate(0%, 0%) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(10%, 10%) scale(1.1);
            opacity: 0.8;
          }
        }

        .welcome-eye-button {
          position: absolute;
          top: 16px;
          right: 16px;
          background: ${Theme.componentBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 50%;
          width: 36px;
          height: 36px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 2;
          color: ${Theme.textSecondary};
        }

        .welcome-eye-button:hover {
          background: ${Theme.componentHoverBackground};
          border-color: ${Theme.primary};
          color: ${Theme.textPrimary};
          transform: scale(1.1);
        }

        .welcome-eye-button:active {
          transform: scale(0.95);
        }

        .welcome-eye-button svg {
          width: 18px;
          height: 18px;
          color: inherit;
        }

        .welcome-title {
          margin: 0 0 0 0;
          font-size: 2rem;
          font-weight: 300;
          text-transform: none;
          letter-spacing: 0.5px;
          position: relative;
          z-index: 1;
          line-height: 1.2;
          color: ${Theme.textPrimary};
        }

        .welcome-quote-section {
          margin-top: 12px;
          padding: 8px 5px 5px 5px;
          border-top: 1px solid ${Theme.primary}20;
          position: relative;
          z-index: 1;
          user-select: none;
          transition: all 0.3s ease;
          background: linear-gradient(180deg, ${Theme.primary}00, ${Theme.primary}00);
        }

        .welcome-quote-section:hover {
          background: linear-gradient(180deg, ${Theme.primary}15, ${Theme.primary}00);
          border-top-color: ${Theme.primary}40;
        }

        .welcome-quote-section:active {
          background: linear-gradient(180deg, ${Theme.primary}25, ${Theme.primary}05);
        }

        .welcome-username {
          display: inline-block;
          background: transparent;
          padding: 0;
          border-radius: 0;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-shadow: 
            0 0 20px ${Theme.primary}80,
            0 0 40px ${Theme.primary}60,
            0 2px 4px rgba(0, 0, 0, 0.3);
          border: none;
          animation: usernameGlow 3s ease-in-out infinite;
          margin: 0 4px;
          color: ${Theme.textPrimary};
        }

        @keyframes usernameGlow {
          0%, 100% {
            text-shadow: 
              0 0 20px ${Theme.primary}80,
              0 0 40px ${Theme.primary}60,
              0 2px 4px rgba(0, 0, 0, 0.3);
          }
          50% {
            text-shadow: 
              0 0 30px ${Theme.primary}100,
              0 0 60px ${Theme.primary}80,
              0 2px 4px rgba(0, 0, 0, 0.3);
          }
        }

        .welcome-subtitle {
          margin: 0 auto;
          max-width: 500px;
          font-size: 0.9rem;
          opacity: 0.9;
          font-weight: 400;
          position: relative;
          z-index: 1;
          line-height: 1.6;
          font-style: italic;
          color: ${Theme.textPrimary}CC;
          padding: 0;
          text-shadow: none;
          min-height: 1.6em;
          transition: opacity 0.2s ease;
        }

        .welcome-subtitle.quote-animating {
          opacity: 1;
        }

        .welcome-subtitle::before {
          content: '"';
          font-size: 1.8rem;
          opacity: 0.66;
          position: relative;
          left: 0px;
          top: 3px;
          font-family: Georgia, serif;
          color: ${Theme.primary};
          font-weight: bold;
          line-height: 0;
          margin-right: 2px;
        }

        .welcome-subtitle::after {
          content: '"';
          font-size: 1.8rem;
          opacity: 0.66;
          position: relative;
          right: -3px;
          top: 3px;
          font-family: Georgia, serif;
          color: ${Theme.primary};
          font-weight: bold;
          line-height: 0;
          margin-left: 2px;
          display: inline-block;
          transform: rotate(180deg);
        }

        .welcome-content {
          padding: 32px;
          overflow-y: auto;
          max-height: calc(85vh - 200px);
        }

        .welcome-content::-webkit-scrollbar {
          width: 14px;
        }

        .welcome-content::-webkit-scrollbar-track {
          background: ${Theme.scrollbarTrack};
        }

        .welcome-content::-webkit-scrollbar-thumb {
          background: ${Theme.scrollbarThumb};
          border-radius: 0px;
          border: 4px solid ${Theme.scrollbarTrack};
          background-clip: content-box;
        }

        .welcome-content::-webkit-scrollbar-thumb:hover {
          background: ${Theme.scrollbarThumbHover};
          border: 4px solid ${Theme.scrollbarTrack};
          background-clip: content-box;
        }

        .welcome-section {
          margin-bottom: 40px;
        }

        .welcome-section:last-child {
          margin-bottom: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .section-title {
          margin: 0 0 20px 0;
          font-size: 1.3rem;
          font-weight: 600;
          color: ${Theme.textPrimary};
          text-transform: uppercase;
          letter-spacing: 1px;
          padding-bottom: 8px;
          border-bottom: 2px solid ${Theme.primary};
          position: relative;
          flex: 1;
        }
        .section-footer-row {
          margin-top: 8px;
          display: flex;
          justify-content: flex-start;
        }

        .section-link-button {
          appearance: none;
          background: transparent;
          border: none;
          padding: 0;
          margin: 0;
          color: ${Theme.textMuted};
          cursor: pointer;
          font-size: 0.85rem;
        }

        .section-link-button:hover {
          color: ${Theme.textSecondary};
        }


        .section-title::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 60px;
          height: 2px;
          background: ${Theme.primaryHover};
        }

        .welcome-actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .welcome-button-group {
          display: flex;
          gap: 8px;
          margin-top: -14px;
          margin-bottom: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .welcome-small-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 16px;
          background: ${Theme.componentBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          font-family: inherit;
          font-size: 0.85rem;
          color: ${Theme.textSecondary};
          min-width: 100px;
          position: relative;
        }

        .welcome-small-button:hover {
          background: ${Theme.componentHoverBackground};
          border-color: ${Theme.primary};
          color: ${Theme.textPrimary};
          transform: translateY(-1px);
        }

        .welcome-small-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .welcome-small-button.disabled:hover {
          background: ${Theme.componentBackground};
          border-color: ${Theme.borderSecondary};
          color: ${Theme.textSecondary};
          transform: none;
        }

        .welcome-button-tooltip {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 0.8rem;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 1001;
        }

        .welcome-button-tooltip::after {
          content: '';
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-bottom-color: rgba(0, 0, 0, 0.9);
        }

        .welcome-small-button.disabled:hover .welcome-button-tooltip {
          opacity: 1;
        }

        .welcome-small-button.exit-button:hover {
          background: rgba(255, 107, 107, 0.1);
          border-color: #ff6b6b;
          color: #ff6b6b;
        }

        .welcome-small-button svg {
          width: 16px;
          height: 16px;
          color: inherit;
        }

        .welcome-action-button {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          background: ${Theme.componentBackground};
          border: 2px solid ${Theme.borderSecondary};
          border-radius: 0px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          font-family: inherit;
        }

        .welcome-action-button:hover {
          background: ${Theme.componentHoverBackground};
          border-color: ${Theme.primary};
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .welcome-action-button.primary {
          border-color: ${Theme.primary};
          background: linear-gradient(135deg, ${Theme.primary}15 0%, ${Theme.componentBackground} 100%);
        }

        .welcome-action-button.primary:hover {
          background: linear-gradient(135deg, ${Theme.primary}25 0%, ${Theme.componentHoverBackground} 100%);
          border-color: ${Theme.primaryHover};
        }

        .welcome-action-button svg {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          color: ${Theme.primary};
        }

        .action-content {
          flex: 1;
        }

        .action-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: ${Theme.textPrimary};
          margin-bottom: 4px;
        }

        .action-description {
          font-size: 0.9rem;
          color: ${Theme.textSecondary};
          line-height: 1.4;
        }

        .welcome-manual-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: ${Theme.componentBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          font-size: 0.8rem;
          color: ${Theme.textSecondary};
          white-space: nowrap;
          margin-bottom: 16px;
        }

        .welcome-manual-button:hover {
          background: ${Theme.componentHoverBackground};
          border-color: ${Theme.primary};
          color: ${Theme.textPrimary};
          transform: translateY(-1px);
        }

        .welcome-manual-button svg {
          width: 14px;
          height: 14px;
          color: inherit;
        }

        .recent-projects-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 200px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .recent-projects-list::-webkit-scrollbar {
          width: 8px;
        }

        .recent-projects-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .recent-projects-list::-webkit-scrollbar-thumb {
          background: ${Theme.scrollbarThumb};
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .recent-projects-list::-webkit-scrollbar-thumb:hover {
          background: ${Theme.scrollbarThumbHover};
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .recent-project-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: ${Theme.componentBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          font-family: inherit;
        }

        .recent-project-item:hover {
          background: ${Theme.componentHoverBackground};
          border-color: ${Theme.primary};
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .project-info {
          flex: 1;
        }

        .project-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: ${Theme.textPrimary};
          margin-bottom: 2px;
        }

        .project-meta {
          font-size: 0.8rem;
          color: ${Theme.textSecondary};
        }

        .project-open-icon {
          font-size: 1.2rem;
          color: ${Theme.textSecondary};
          transition: all 0.2s ease;
          transform: translateX(0);
        }

        .recent-project-item:hover .project-open-icon {
          color: ${Theme.primary};
          transform: translateX(4px);
        }

        /* Responsive design */
        @media (max-width: 1000px) {
          .welcome-actions-grid {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
        }

        @media (max-width: 768px) {
          .welcome-dialog {
            width: 95vw;
            max-height: 90vh;
          }

          .welcome-header {
            padding: 24px 20px;
          }

          .welcome-title {
            font-size: 1.8rem;
          }

          .welcome-subtitle {
            font-size: 1rem;
          }

          .welcome-content {
            padding: 20px;
          }

          .welcome-actions-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .welcome-action-button {
            padding: 20px;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  destroy() {
    this.hide();

    const styles = document.querySelector("#welcome-dialog-styles");
    if (styles) {
      styles.remove();
    }
  }
}

// Singleton for easier access
let welcomeDialogInstance = null;

export function initializeWelcomeDialog() {
  if (!welcomeDialogInstance) {
    welcomeDialogInstance = new WelcomeDialog();
  }
  return welcomeDialogInstance;
}

export function getWelcomeDialog() {
  return welcomeDialogInstance;
}

export function destroyWelcomeDialog() {
  if (welcomeDialogInstance) {
    welcomeDialogInstance.destroy();
    welcomeDialogInstance = null;
  }
}
