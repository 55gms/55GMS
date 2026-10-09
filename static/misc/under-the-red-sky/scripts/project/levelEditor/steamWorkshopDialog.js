// Steam Workshop Upload Dialog for Level Editor
// Manages uploading levels to Steam Workshop

import { Theme } from "./inspectorUI.js";
import { SteamLogo, Upload, DiscordLogo, AlertCircle } from "./iconList.js";
import { mountUploadSpinner } from "./uploadSpinner.js";
import { evaluatePublishChecklist } from "./validation/publishChecklist.js";
import { DISCORD_URL } from "./globalValues.js";
import {
  createDifficultySelector,
  applyDifficultySelectorStyles,
} from "./difficultySelector.js";
import { showConfirmDialog } from "./confirmDialog.js";

export class SteamWorkshopDialog {
  constructor(container = document.body) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.dialog = null;
    this.backdrop = null;
    this.isVisible = false;
    this.workshopWrapper = null;
    this.isOwner = false;
    this.workshopItemData = null;
    this.isRefreshing = false;
    this.isClosingBlocked = false;

    this.applyStyles();
  }

  async show() {
    if (this.isVisible) {
      return;
    }

    // Use global workshop wrapper instance
    this.workshopWrapper = globalThis.workshopWrapper;
    if (!this.workshopWrapper) {
      console.error("[SteamWorkshopDialog] WorkshopWrapper not available");
      return;
    }

    // Get project manager
    const projectManager = globalThis._editorScope?.projectManager;
    if (!projectManager || !projectManager.hasProjectLoaded()) {
      alert("Please create or open a project before accessing Workshop.");
      return;
    }

    // Create dialog with loading state
    await this.createDialog();
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

    // Prevent closing while refreshing or blocked
    if (this.isRefreshing || this.isClosingBlocked) {
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

  async createDialog() {
    // Create backdrop
    this.backdrop = document.createElement("div");
    this.backdrop.className = "steam-workshop-dialog-backdrop";
    this.backdrop.addEventListener("click", (e) => {
      if (e.target === this.backdrop) {
        this.hide();
      }
    });
    // Block events on backdrop so they don't reach the editor underneath
    [
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
    ].forEach((eventType) => {
      this.backdrop.addEventListener(
        eventType,
        (e) => {
          e.stopPropagation();
        },
        { passive: false },
      );
    });

    // Create main dialog
    this.dialog = document.createElement("div");
    this.dialog.className = "steam-workshop-dialog";

    // Create header
    this.createHeader();

    // Add to backdrop and container first
    this.backdrop.appendChild(this.dialog);
    this.container.appendChild(this.backdrop);

    // Setup event handlers
    this.setupEventHandlers();

    // Animate in
    setTimeout(() => {
      this.backdrop.classList.add("visible");
      this.dialog.classList.add("visible");
    }, 10);

    // Load content with loading state
    await this.refreshContent();
  }

  createHeader() {
    const header = document.createElement("div");
    header.className = "dialog-header";

    const titleContainer = document.createElement("div");
    titleContainer.className = "dialog-title-container";

    const icon = document.createElement("div");
    icon.className = "dialog-icon";
    icon.innerHTML = SteamLogo;

    const title = document.createElement("h2");
    title.className = "dialog-title";
    title.textContent = "Steam Workshop";

    titleContainer.appendChild(icon);
    titleContainer.appendChild(title);

    const closeButton = document.createElement("button");
    closeButton.className = "dialog-close";
    closeButton.innerHTML = "✕";
    closeButton.addEventListener("click", () => this.hide());

    header.appendChild(titleContainer);
    header.appendChild(closeButton);
    this.dialog.appendChild(header);
  }

  async refreshContent() {
    // Prevent multiple simultaneous refreshes
    if (this.isRefreshing) {
      return;
    }

    this.isRefreshing = true;
    this.isClosingBlocked = true;

    // Get or create content container
    let content = this.dialog.querySelector(".dialog-content");
    if (!content) {
      content = document.createElement("div");
      content.className = "dialog-content";
      this.dialog.appendChild(content);
    }

    // Show loading spinner
    content.innerHTML = "";
    this.createLoadingUI(content);

    try {
      // Load actual content
      await this.createContent(content);
    } finally {
      this.isRefreshing = false;
      this.isClosingBlocked = false;
    }
  }

  async createContent(content) {
    const projectManager = globalThis._editorScope?.projectManager;
    const project = projectManager.currentProject;
    const workshopData = project.workshop;

    // Check if project has workshop ID
    if (!workshopData.itemId) {
      // Clear loading and show create UI
      content.innerHTML = "";
      this.createNoItemUI(content);
    } else {
      // Has workshop ID - fetch item data and check ownership
      try {
        const item = await this.workshopWrapper.getItemInfo(
          workshopData.itemId,
        );

        // Clear loading and show actual content
        content.innerHTML = "";

        if (!item) {
          this.createErrorUI(
            content,
            "Workshop item not found or could not be retrieved.",
          );
        } else {
          this.workshopItemData = item;
          this.isOwner = await this.workshopWrapper.isItemMine(
            workshopData.itemId,
          );
          this.createWorkshopUI(content, workshopData);
        }
      } catch (err) {
        content.innerHTML = "";
        this.createErrorUI(content, err.message);
      }
    }
  }

  createLoadingUI(content) {
    const loadingSection = document.createElement("div");
    loadingSection.className = "workshop-section loading-section";

    const spinnerContainer = document.createElement("div");
    spinnerContainer.className = "loading-spinner-container";

    const spinner = document.createElement("div");
    spinner.className = "loading-spinner";
    spinner.innerHTML = SteamLogo;

    spinnerContainer.appendChild(spinner);

    const loadingText = document.createElement("p");
    loadingText.className = "loading-text";
    loadingText.textContent = "Loading workshop data...";

    loadingSection.appendChild(spinnerContainer);
    loadingSection.appendChild(loadingText);
    content.appendChild(loadingSection);
  }

  createNoItemUI(content) {
    const section = document.createElement("div");
    section.className = "workshop-section";

    const title = document.createElement("h3");
    title.className = "section-title";
    title.textContent = "No Workshop Item";

    const message = document.createElement("p");
    message.className = "section-message";
    message.textContent =
      "This project is not linked to a Steam Workshop item. Create a new item or attach to an existing one.";

    section.appendChild(title);
    section.appendChild(message);

    // Create new item section
    const createSection = document.createElement("div");
    createSection.className = "create-attach-section";

    const createTitle = document.createElement("h4");
    createTitle.className = "subsection-title";
    createTitle.textContent = "Create New Item";

    const createDesc = document.createElement("p");
    createDesc.className = "subsection-description";
    createDesc.textContent =
      "Create a brand new Workshop item for this project.";

    const createButton = document.createElement("button");
    createButton.className = "dialog-button dialog-button-primary";
    createButton.textContent = "Create New Workshop Item";
    createButton.addEventListener("click", () => this.handleCreateNewItem());

    createSection.appendChild(createTitle);
    createSection.appendChild(createDesc);
    createSection.appendChild(createButton);

    // Attach existing item section
    const attachSection = document.createElement("div");
    attachSection.className = "create-attach-section";

    const attachTitle = document.createElement("h4");
    attachTitle.className = "subsection-title";
    attachTitle.textContent = "Attach to Existing Item";

    const attachDesc = document.createElement("p");
    attachDesc.className = "subsection-description";
    attachDesc.textContent =
      "Link this project to a Workshop item you already own.";

    const attachInputLabel = document.createElement("label");
    attachInputLabel.className = "input-label";
    attachInputLabel.textContent = "Workshop Item ID";

    const attachInput = document.createElement("input");
    attachInput.type = "text";
    attachInput.className = "text-input";
    attachInput.placeholder = "Enter Workshop Item ID...";
    attachInput.id = "attach-item-id-input";

    const attachButton = document.createElement("button");
    attachButton.className = "dialog-button dialog-button-secondary";
    attachButton.textContent = "Attach to Item";
    attachButton.addEventListener("click", () => {
      const itemId = attachInput.value.trim();
      if (itemId) {
        this.handleAttachExisting(itemId);
      } else {
        this.showError("Please enter a Workshop Item ID");
      }
    });

    attachSection.appendChild(attachTitle);
    attachSection.appendChild(attachDesc);
    attachSection.appendChild(attachInputLabel);
    attachSection.appendChild(attachInput);
    attachSection.appendChild(attachButton);

    section.appendChild(createSection);
    section.appendChild(attachSection);
    content.appendChild(section);

    // Publishing checklist warning banner (shown even before an item is linked).
    const banner = this.makePublishGateBanner(evaluatePublishChecklist());
    if (banner) content.insertBefore(banner, content.firstChild);
  }

  createErrorUI(content, errorMessage) {
    const section = document.createElement("div");
    section.className = "workshop-section error-section";

    const title = document.createElement("h3");
    title.className = "section-title error-title";
    title.textContent = "Error";

    const message = document.createElement("p");
    message.className = "section-message error-message";
    message.textContent = errorMessage;

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const unlinkButton = document.createElement("button");
    unlinkButton.className = "dialog-button dialog-button-secondary";
    unlinkButton.textContent = "Unlink Item";
    unlinkButton.addEventListener("click", () => this.handleUnlink());

    buttonContainer.appendChild(unlinkButton);

    section.appendChild(title);
    section.appendChild(message);
    section.appendChild(buttonContainer);
    content.appendChild(section);
  }

  createWorkshopUI(content, workshopData) {
    const projectManager = globalThis._editorScope?.projectManager;
    const project = projectManager.currentProject;

    // Item info section
    if (this.workshopItemData) {
      const infoSection = document.createElement("div");
      infoSection.className = "workshop-section info-section";

      const infoHeader = document.createElement("div");
      infoHeader.className = "section-header";

      const infoTitle = document.createElement("h3");
      infoTitle.className = "section-title";
      infoTitle.textContent = "Workshop Item Info";

      const viewButton = document.createElement("button");
      viewButton.className = "add-level-button";
      viewButton.innerHTML = `${SteamLogo} View in Workshop`;
      viewButton.addEventListener("click", () => {
        this.workshopWrapper.openItemUrl(this.workshopItemData.publishedFileId);
      });

      infoHeader.appendChild(infoTitle);
      infoHeader.appendChild(viewButton);

      const itemId = document.createElement("p");
      itemId.className = "item-info";
      itemId.innerHTML = `<strong>Item ID:</strong> ${this.workshopItemData.publishedFileId}`;

      const ownerRow = document.createElement("div");
      ownerRow.className = "item-info owner-row";
      ownerRow.innerHTML = `<strong>Owner:</strong>`;

      if (this.isOwner) {
        const ownerName = document.createElement("span");
        ownerName.className = "owner-name";
        ownerName.textContent = "You";
        ownerRow.appendChild(ownerName);
      } else {
        // Create clickable owner element with avatar
        const ownerLink = document.createElement("button");
        ownerLink.className = "owner-link";
        ownerLink.innerHTML = `<span class="owner-avatar-placeholder"></span><span class="owner-name-text">Loading...</span>`;
        ownerLink.title = "Click to view profile";
        ownerLink.addEventListener("click", () => {
          if (this.workshopItemData?.owner?.steamId64) {
            this.workshopWrapper.openProfilePage(
              this.workshopItemData.owner.steamId64,
            );
          }
        });
        ownerRow.appendChild(ownerLink);

        // Fetch owner profile asynchronously
        this.fetchOwnerProfile(ownerLink);
      }

      infoSection.appendChild(infoHeader);
      infoSection.appendChild(itemId);
      infoSection.appendChild(ownerRow);

      if (!this.isOwner) {
        const warning = document.createElement("p");
        warning.className = "warning-message";
        warning.innerHTML = `<span class="warning-icon">${AlertCircle}</span> You don't own this item. You can view the data but cannot upload changes.`;
        infoSection.appendChild(warning);
      }

      // Unlink button
      const unlinkButton = document.createElement("button");
      unlinkButton.className =
        "dialog-button dialog-button-secondary small-button unlink-button";
      unlinkButton.textContent = "Unlink from Item";
      unlinkButton.addEventListener("click", () => this.handleUnlink());

      infoSection.appendChild(unlinkButton);

      content.appendChild(infoSection);
    }

    // Metadata section
    const metadataSection = document.createElement("div");
    metadataSection.className = "workshop-section metadata-section";

    const metadataHeader = document.createElement("div");
    metadataHeader.className = "section-header";

    const metadataTitle = document.createElement("h3");
    metadataTitle.className = "section-title";
    metadataTitle.textContent = "Workshop Metadata";

    // Publishing checklist status (owners only). Used to warn under the header
    // and grey out the upload button only when the project genuinely can't be
    // published (required checks failing). Soft-only failures still allow upload.
    const checklist = this.isOwner ? evaluatePublishChecklist() : null;
    const uploadBlocked = !!checklist && !checklist.canPublish;

    // Upload button (moved to header)
    const uploadButton = document.createElement("button");
    uploadButton.className = "add-level-button";
    uploadButton.innerHTML = `${Upload} Upload`;
    // Non-owners are hard-disabled. Owners stay clickable even when greyed so the
    // checklist still opens on click.
    uploadButton.disabled = !this.isOwner;
    if (uploadBlocked) {
      uploadButton.style.opacity = "0.5";
      this.attachTooltip(
        uploadButton,
        "Required checks are failing, click to review.",
      );
    }
    uploadButton.addEventListener("click", () => this.handleUpload());

    metadataHeader.appendChild(metadataTitle);
    metadataHeader.appendChild(uploadButton);

    // Title input (editable, syncs with project name)
    const titleLabel = document.createElement("label");
    titleLabel.className = "input-label";
    titleLabel.textContent = "Title";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.className = "text-input";
    titleInput.value = project.projectName;
    titleInput.disabled = !this.isOwner;
    titleInput.addEventListener("input", (e) => {
      project.projectName = e.target.value;
      projectManager.updateLastModified();
      projectManager.markAsUnsaved();
    });

    // Description textarea (will be added to settings column)
    const descLabel = document.createElement("label");
    descLabel.className = "input-label";
    descLabel.textContent = "Description";

    const descInput = document.createElement("textarea");
    descInput.className = "text-area";
    descInput.rows = 6;
    descInput.value = workshopData.description || "";
    descInput.disabled = !this.isOwner;
    descInput.addEventListener("input", (e) => {
      workshopData.description = e.target.value;
      projectManager.markAsUnsaved();
    });

    const descContainer = document.createElement("div");
    descContainer.className = "description-container";
    descContainer.appendChild(descLabel);
    descContainer.appendChild(descInput);

    // Visibility select
    const visLabel = document.createElement("label");
    visLabel.className = "input-label";
    visLabel.textContent = "Visibility";

    const visSelect = document.createElement("select");
    visSelect.className = "select-input";
    visSelect.disabled = !this.isOwner;
    const visibilityOptions = [
      { value: 0, label: "Public" },
      { value: 1, label: "Friends Only" },
      { value: 2, label: "Private" },
      { value: 3, label: "Unlisted" },
    ];
    visibilityOptions.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.label;
      option.selected = workshopData.visibility === opt.value;
      visSelect.appendChild(option);
    });
    visSelect.addEventListener("change", (e) => {
      workshopData.visibility = parseInt(e.target.value);
      projectManager.markAsUnsaved();
    });

    const visRow = document.createElement("div");
    visRow.className = "workshop-input-row compact-row";
    visRow.appendChild(visLabel);
    visRow.appendChild(visSelect);

    // Difficulty selector (reads from and writes to project data)
    const currentDifficulty =
      project.sharedData?.projectDifficulty !== undefined
        ? project.sharedData.projectDifficulty
        : 5;

    const difficultySelector = createDifficultySelector({
      currentValue: currentDifficulty,
      onChange: (value) => {
        if (!project.sharedData) {
          project.sharedData = {};
        }
        project.sharedData.projectDifficulty = value;
        projectManager.updateLastModified();
        projectManager.markAsUnsaved();
      },
      disabled: !this.isOwner,
      compact: true, // Use compact mode in workshop dialog
    });

    // Preview image
    const previewLabel = document.createElement("label");
    previewLabel.className = "input-label";
    previewLabel.textContent = "Preview Image";

    const previewContainer = document.createElement("div");
    previewContainer.className = "preview-container";

    if (workshopData.previewImage) {
      const previewImg = document.createElement("img");
      previewImg.src = workshopData.previewImage;
      previewImg.className = "preview-image";
      previewContainer.appendChild(previewImg);
    } else {
      const previewPlaceholder = document.createElement("div");
      previewPlaceholder.className = "preview-placeholder";
      previewPlaceholder.textContent = "No preview image";
      previewContainer.appendChild(previewPlaceholder);
    }

    const previewButton = document.createElement("button");
    previewButton.className =
      "dialog-button dialog-button-secondary small-button";
    previewButton.textContent = "Choose Image";
    previewButton.disabled = !this.isOwner;
    previewButton.addEventListener("click", () =>
      this.handleChoosePreviewImage(),
    );

    // Title section (above preview)
    metadataSection.appendChild(metadataHeader);

    const titleRow = document.createElement("div");
    titleRow.className = "workshop-input-row";
    titleRow.appendChild(titleLabel);
    titleRow.appendChild(titleInput);
    metadataSection.appendChild(titleRow);

    // Preview and settings row
    const previewRow = document.createElement("div");
    previewRow.className = "preview-row";

    // Preview image wrapper (left side)
    const previewWrapper = document.createElement("div");
    previewWrapper.className = "preview-wrapper";

    // Preview image - make it clickable
    const newPreviewContainer = document.createElement("div");
    newPreviewContainer.className = `preview-container square-preview${
      !this.isOwner ? " disabled" : ""
    }`;
    newPreviewContainer.title = this.isOwner
      ? "Click to change preview image"
      : "";

    if (workshopData.previewImage) {
      const previewImg = document.createElement("img");
      previewImg.src = workshopData.previewImage;
      previewImg.className = "preview-image";
      newPreviewContainer.appendChild(previewImg);

      // Remove preview button (red X at top left)
      if (this.isOwner) {
        const removePreviewButton = document.createElement("button");
        removePreviewButton.className = "remove-preview-button";
        removePreviewButton.innerHTML = "✕";
        removePreviewButton.title = "Remove preview image";
        removePreviewButton.addEventListener("click", (e) => {
          e.stopPropagation();
          this.handleRemovePreview();
        });
        previewWrapper.appendChild(removePreviewButton);
      }
    } else {
      const previewPlaceholder = document.createElement("div");
      previewPlaceholder.className = "preview-placeholder";
      previewPlaceholder.textContent = this.isOwner
        ? "Click to add preview"
        : "No preview image";
      newPreviewContainer.appendChild(previewPlaceholder);
    }

    if (this.isOwner) {
      newPreviewContainer.addEventListener("click", () =>
        this.handleChoosePreviewImage(),
      );
    }

    previewWrapper.appendChild(newPreviewContainer);

    // Settings column (right side)
    const settingsColumn = document.createElement("div");
    settingsColumn.className = "settings-column";

    settingsColumn.appendChild(visRow);
    settingsColumn.appendChild(difficultySelector);
    settingsColumn.appendChild(descContainer);

    previewRow.appendChild(previewWrapper);
    previewRow.appendChild(settingsColumn);

    metadataSection.appendChild(previewRow);

    content.appendChild(metadataSection);

    // Publishing checklist warning banner, hugging the header.
    const banner = this.makePublishGateBanner(checklist);
    if (banner) content.insertBefore(banner, content.firstChild);
  }

  /**
   * Hover tooltip reusing the toolbar's shared tooltip (matching styling/font).
   * Falls back to the native `title` if the toolbar isn't available.
   */
  attachTooltip(el, text) {
    const toolbar = globalThis._editorScope?.toolbar;
    if (!toolbar || typeof toolbar.showTooltip !== "function") {
      el.title = text;
      return;
    }
    el.addEventListener("mouseenter", () => toolbar.showTooltip(el, text));
    el.addEventListener("mouseleave", () => {
      if (typeof toolbar.hideTooltipDelayed === "function") {
        toolbar.hideTooltipDelayed();
      } else {
        toolbar.hideTooltip();
      }
    });
  }

  /**
   * Build the publishing-checklist warning banner for the workshop dialog, or
   * null when the project is publish-ready. Clicking it opens the checklist.
   */
  makePublishGateBanner(checklist) {
    if (!checklist || (!checklist.hard.length && !checklist.soft.length)) {
      return null;
    }
    if (checklist.canPublish && !checklist.hasSoftFailures) return null;

    const banner = document.createElement("div");
    banner.className = "warning-message publish-gate-banner";
    const failedHard = checklist.hard.filter((c) => !c.pass).length;
    const failedSoft = checklist.soft.filter((c) => !c.pass).length;
    const msg = checklist.canPublish
      ? `${failedSoft} recommended check${failedSoft === 1 ? "" : "s"} not met. You can still upload.`
      : `${failedHard} required check${failedHard === 1 ? "" : "s"} failing, fix to publish.`;

    const text = document.createElement("span");
    text.className = "publish-gate-text";
    text.innerHTML = `<span class="warning-icon">${AlertCircle}</span> ${msg}`;

    const reviewBtn = document.createElement("button");
    reviewBtn.className = "publish-gate-review-btn";
    reviewBtn.textContent = "Review";
    reviewBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Review-only: open the checklist without a proceed callback (shows "OK").
      globalThis._editorScope?.publishChecklistDialog?.show();
    });

    banner.appendChild(text);
    banner.appendChild(reviewBtn);
    return banner;
  }

  async handleCreateNewItem() {
    try {
      const result = await this.workshopWrapper.createItem();

      if (!result) {
        this.showError("Failed to create workshop item. No result returned.");
        return;
      }

      if (result.needsAgreement) {
        this.showAgreementRequired();
        return;
      }

      if (!result.itemId) {
        this.showError("Failed to create workshop item. No item ID returned.");
        return;
      }

      // Save item ID to project
      const projectManager = globalThis._editorScope?.projectManager;
      const project = projectManager.currentProject;
      project.workshop.itemId = result.itemId;
      projectManager.markAsUnsaved();

      this.showSuccess("Workshop item created successfully!");

      // Refresh dialog content to show the workshop UI
      await this.refreshContent();
    } catch (error) {
      this.showError(`Error creating item: ${error.message || error}`);
    }
  }

  async handleAttachExisting(itemId) {
    try {
      // Check if user owns this item
      const isOwner = await this.workshopWrapper.isItemMine(itemId);

      if (!isOwner) {
        this.showError("You don't own this Workshop item. Cannot attach.");
        return;
      }

      // Get item data to verify it exists
      const item = await this.workshopWrapper.getItemInfo(itemId);

      if (!item) {
        this.showError("Workshop item not found or could not be retrieved.");
        return;
      }

      // Save item ID to project
      const projectManager = globalThis._editorScope?.projectManager;
      const project = projectManager.currentProject;
      project.workshop.itemId = itemId;
      projectManager.markAsUnsaved();

      this.showSuccess("Project attached to Workshop item!");

      // Refresh dialog
      await this.refreshContent();
    } catch (error) {
      this.showError(`Error attaching item: ${error.message || error}`);
    }
  }

  async handleUnlink() {
    const confirmed = await showConfirmDialog({
      title: "Unlink Workshop Item",
      message:
        "Are you sure you want to unlink this project from the Workshop item? This won't delete the Workshop item.",
      confirmText: "Unlink",
      cancelText: "Cancel",
      type: "warning",
    });

    if (!confirmed) return;

    const projectManager = globalThis._editorScope?.projectManager;
    const project = projectManager.currentProject;
    project.workshop.itemId = null;
    projectManager.markAsUnsaved();

    // Refresh dialog
    this.refreshContent();
  }

  async handleChoosePreviewImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const projectManager = globalThis._editorScope?.projectManager;
        const project = projectManager.currentProject;
        project.workshop.previewImage = event.target.result;
        projectManager.markAsUnsaved();

        // Refresh dialog content
        this.refreshContent();
      };
      reader.readAsDataURL(file);
    });
    input.click();
  }

  async handleRemovePreview() {
    const confirmed = await showConfirmDialog({
      title: "Remove Preview Image",
      message: "Are you sure you want to remove the preview image?",
      confirmText: "Remove",
      cancelText: "Cancel",
      type: "warning",
    });
    if (!confirmed) return;

    const projectManager = globalThis._editorScope?.projectManager;
    const project = projectManager.currentProject;
    project.workshop.previewImage = null;
    projectManager.markAsUnsaved();

    // Refresh dialog content
    this.refreshContent();
  }

  async handleUpload() {
    // Gate on the publishing checklist: hard criteria block upload entirely;
    // soft criteria are shown and must be skipped each time. The actual upload
    // runs only when the user proceeds from the checklist.
    const checklist = globalThis._editorScope?.publishChecklistDialog;
    if (checklist) {
      checklist.show(() => this.performUpload());
      return;
    }
    // Fallback if the checklist dialog isn't available for some reason.
    return this.performUpload();
  }

  async performUpload() {
    try {
      // Show change notes dialog
      const changeNote = await this.showChangeNotesDialog();
      if (changeNote === null) return; // User cancelled

      const projectManager = globalThis._editorScope?.projectManager;

      const project = projectManager.exportProject(false);

      // Show progress UI
      this.showUploadProgress();

      // Upload to workshop without progress callback
      const uploadResult = await this.workshopWrapper.uploadProject(
        project,
        changeNote,
      );

      // Hide progress UI
      this.hideUploadProgress();

      if (uploadResult.needsAgreement) {
        this.showAgreementRequired();
        return;
      }

      if (!uploadResult.success) {
        this.showError(
          `Upload failed: ${uploadResult.error || "Unknown error"}`,
        );
        return;
      }

      this.showSuccess("Project uploaded to Steam Workshop successfully!");
    } catch (error) {
      this.hideUploadProgress();
      this.showError(`Error during upload: ${error.message || error}`);
    }
  }

  showUploadProgress() {
    const progressOverlay = document.createElement("div");
    progressOverlay.className = "upload-progress-overlay";
    progressOverlay.id = "upload-progress-overlay";

    const progressContainer = document.createElement("div");
    progressContainer.className = "upload-progress-container";

    const spinnerContainer = document.createElement("div");
    spinnerContainer.className = "upload-spinner-container";

    const title = document.createElement("h3");
    title.className = "upload-progress-title";
    title.textContent = "Uploading to Steam Workshop";

    // Animated skeletal runner (spinner above, title below).
    this._uploadSpinner = mountUploadSpinner(spinnerContainer, {
      primary: Theme.primary,
      background: Theme.sidebarBackground,
    });

    progressContainer.appendChild(spinnerContainer);
    progressContainer.appendChild(title);

    progressOverlay.appendChild(progressContainer);
    this.dialog.appendChild(progressOverlay);
  }

  hideUploadProgress() {
    if (this._uploadSpinner) {
      this._uploadSpinner.stop();
      this._uploadSpinner = null;
    }
    const progressOverlay = document.getElementById("upload-progress-overlay");
    if (progressOverlay) {
      progressOverlay.remove();
    }
  }

  async showChangeNotesDialog() {
    return new Promise((resolve) => {
      // Backdrop overlay covering the workshop dialog, with a themed card.
      const overlay = document.createElement("div");
      overlay.className = "change-notes-overlay";

      const card = document.createElement("div");
      card.className = "change-notes-card";

      const header = document.createElement("div");
      header.className = "change-notes-header";
      const title = document.createElement("h3");
      title.textContent = "Change Notes";
      title.className = "change-notes-title";
      header.appendChild(title);

      const content = document.createElement("div");
      content.className = "change-notes-content";
      const hint = document.createElement("p");
      hint.className = "change-notes-hint";
      hint.textContent = "Optional — describe what changed in this update.";
      const textarea = document.createElement("textarea");
      textarea.className = "change-notes-textarea";
      textarea.rows = 6;
      textarea.placeholder = "e.g. Added two new levels, fixed spawn point…";
      content.appendChild(hint);
      content.appendChild(textarea);

      const footer = document.createElement("div");
      footer.className = "change-notes-footer";

      const finish = (value) => {
        overlay.remove();
        resolve(value);
      };

      const cancelBtn = document.createElement("button");
      cancelBtn.className = "dialog-button dialog-button-secondary";
      cancelBtn.textContent = "Cancel";
      cancelBtn.addEventListener("click", () => finish(null));

      const uploadBtn = document.createElement("button");
      uploadBtn.className = "dialog-button dialog-button-primary";
      uploadBtn.textContent = "Upload";
      uploadBtn.addEventListener("click", () => finish(textarea.value));

      footer.appendChild(cancelBtn);
      footer.appendChild(uploadBtn);

      card.appendChild(header);
      card.appendChild(content);
      card.appendChild(footer);
      overlay.appendChild(card);

      this.dialog.appendChild(overlay);
      requestAnimationFrame(() => {
        overlay.classList.add("visible");
        textarea.focus();
      });
    });
  }

  async showAgreementRequired() {
    const confirmed = await showConfirmDialog({
      title: "Steam Workshop Agreement Required",
      message:
        "You need to accept the Steam Workshop agreement before you can create or upload items.",
      confirmText: "Open Agreement Page",
      cancelText: "Close",
    });

    if (!confirmed) return;

    const itemId =
      globalThis._editorScope?.projectManager?.currentProject?.workshop?.itemId;
    if (itemId) {
      // Item's own Workshop page shows the in-context "accept the Workshop
      // Legal Agreement" banner when the item is yours and unaccepted.
      this.workshopWrapper.openItemUrl(itemId);
    } else {
      this.workshopWrapper.openWebPage(
        "https://steamcommunity.com/workshop/workshoplegalagreement/",
      );
    }
  }

  async fetchOwnerProfile(ownerLink) {
    const steamId64 = this.workshopItemData?.owner?.steamId64;
    if (!steamId64 || !this.workshopWrapper) {
      const nameEl = ownerLink.querySelector(".owner-name-text");
      if (nameEl) {
        nameEl.textContent = `...${steamId64?.slice(-6) || "Unknown"}`;
      }
      return;
    }

    try {
      const profile = await this.workshopWrapper.getProfile(steamId64);
      if (profile && this.dialog) {
        const nameEl = ownerLink.querySelector(".owner-name-text");
        const avatarEl = ownerLink.querySelector(".owner-avatar-placeholder");

        // Check for valid username
        const hasValidUsername =
          profile.username &&
          profile.username.length > 0 &&
          !profile.username.includes("CDATA");

        if (nameEl) {
          nameEl.textContent = hasValidUsername
            ? profile.username
            : `...${steamId64.slice(-6)}`;
        }

        ownerLink.title = hasValidUsername
          ? `Click to view ${profile.username}'s profile`
          : `Click to view profile (ID: ${steamId64})`;

        // Use avatar if available
        if (profile.avatarMedium && avatarEl) {
          const avatarImg = document.createElement("img");
          avatarImg.src = profile.avatarMedium;
          avatarImg.alt = profile.username || "Owner avatar";
          avatarImg.className = "owner-avatar";
          avatarEl.replaceWith(avatarImg);
        }
      }
    } catch (error) {
      console.warn(
        "[SteamWorkshopDialog] Failed to fetch owner profile:",
        error,
      );
      const nameEl = ownerLink.querySelector(".owner-name-text");
      if (nameEl) {
        nameEl.textContent = `...${steamId64.slice(-6)}`;
      }
    }
  }

  showError(message) {
    const notifications = globalThis._editorScope?.notifications;
    if (notifications) {
      notifications.show(message, { type: "error", title: "Workshop Error" });
    } else {
      alert(message);
    }
  }

  showSuccess(message) {
    const notifications = globalThis._editorScope?.notifications;
    if (notifications) {
      notifications.show(message, { type: "success", title: "Workshop" });
    } else {
      alert(message);
    }
  }

  setupEventHandlers() {
    // Prevent event bubbling
    this.dialog.addEventListener("click", (e) => e.stopPropagation());
    this.dialog.addEventListener("keydown", (e) => e.stopPropagation());

    // Handle Escape key
    this.dialog.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        this.hide();
      }
    });
  }

  applyStyles() {
    // Apply difficulty selector styles
    applyDifficultySelectorStyles();

    if (!document.querySelector("#steam-workshop-dialog-styles")) {
      const style = document.createElement("style");
      style.id = "steam-workshop-dialog-styles";
      style.textContent = `
        /* Steam Workshop Dialog Styles */
        .steam-workshop-dialog-backdrop {
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

        .steam-workshop-dialog-backdrop.visible {
          opacity: 1;
          visibility: visible;
        }

        .steam-workshop-dialog {
          background: ${Theme.sidebarBackground};
          border: 1px solid ${Theme.borderPrimary};
          border-radius: 0px;
          width: 700px;
          max-width: 90vw;
          max-height: 85vh;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          transform: scale(0.9) translateY(-20px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .steam-workshop-dialog.visible {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        .steam-workshop-dialog .dialog-header {
          background: linear-gradient(135deg, #1b2838 0%, #2a475e 100%);
          color: ${Theme.textPrimary};
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 0px 0px 0 0;
        }

        .steam-workshop-dialog .dialog-title-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .steam-workshop-dialog .dialog-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .steam-workshop-dialog .dialog-icon svg {
          width: 32px;
          height: 32px;
          fill: #c7d5e0;
        }

        .steam-workshop-dialog .dialog-title {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: ${Theme.textPrimary};
        }

        .steam-workshop-dialog .dialog-close {
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

        .steam-workshop-dialog .dialog-close:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        .steam-workshop-dialog .dialog-content {
          padding: 24px;
          overflow-y: auto;
          max-height: calc(85vh - 100px);
        }

        /* Publishing gate banner: break out of the content padding to hug the
           header and span full width, with a gap below it. */
        .steam-workshop-dialog .publish-gate-banner {
          margin: -24px -24px 20px -24px;
          margin-top: -24px !important;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .steam-workshop-dialog .publish-gate-text {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .steam-workshop-dialog .publish-gate-review-btn {
          flex-shrink: 0;
          padding: 6px 16px;
          cursor: pointer;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: #ffa500;
          color: #1a1a1a;
          border: 1px solid #ffa500;
        }
        .steam-workshop-dialog .publish-gate-review-btn:hover {
          filter: brightness(1.1);
        }

        .steam-workshop-dialog .dialog-content::-webkit-scrollbar {
          width: 14px;
        }

        .steam-workshop-dialog .dialog-content::-webkit-scrollbar-track {
          background: ${Theme.scrollbarTrack};
        }

        .steam-workshop-dialog .dialog-content::-webkit-scrollbar-thumb {
          background: ${Theme.scrollbarThumb};
          border-radius: 0px;
          border: 4px solid ${Theme.scrollbarTrack};
          background-clip: content-box;
        }

        .steam-workshop-dialog .dialog-content::-webkit-scrollbar-thumb:hover {
          background: ${Theme.scrollbarThumbHover};
          border: 4px solid ${Theme.scrollbarTrack};
          background-clip: content-box;
        }

        .steam-workshop-dialog .workshop-section {
          margin-bottom: 24px;
          padding: 0px;
        }

        .steam-workshop-dialog .workshop-section:last-child {
          margin-bottom: 0;
        }

        .steam-workshop-dialog .section-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .steam-workshop-dialog .section-title {
          margin: 0 0 16px 0;
          color: ${Theme.textPrimary};
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding-bottom: 8px;
          border-bottom: 2px solid ${Theme.primary};
          position: relative;
          flex: 1;
        }

        .steam-workshop-dialog .section-title::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 40px;
          height: 2px;
          background: ${Theme.primaryHover};
        }

        .steam-workshop-dialog .add-level-button {
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
          border: none;
          padding: 8px 16px;
          border-radius: 0px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .steam-workshop-dialog .add-level-button:hover:not(:disabled) {
          background: ${Theme.primaryHover};
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .steam-workshop-dialog .add-level-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .steam-workshop-dialog .add-level-button svg {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          margin: -4px 0px -4px -8px;
        }

        .steam-workshop-dialog .section-message {
          margin: 0 0 16px 0;
          color: ${Theme.textSecondary};
          line-height: 1.5;
        }

        .steam-workshop-dialog .create-attach-section {
          margin: 20px 0;
          padding: 16px 0;
        }

        .steam-workshop-dialog .subsection-title {
          margin: 0 0 8px 0;
          font-size: 1rem;
          font-weight: 600;
          color: ${Theme.textPrimary};
        }

        .steam-workshop-dialog .subsection-description {
          margin: 0 0 12px 0;
          font-size: 0.9rem;
          color: ${Theme.textSecondary};
          line-height: 1.4;
        }

        .steam-workshop-dialog .button-container {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .steam-workshop-dialog .dialog-button {
          padding: 10px 24px;
          border: none;
          border-radius: 0px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .steam-workshop-dialog .dialog-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .steam-workshop-dialog .dialog-button-primary {
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
          border: 1px solid ${Theme.primary};
        }

        .steam-workshop-dialog .dialog-button-primary:hover:not(:disabled) {
          background: ${Theme.primaryHover};
          border-color: ${Theme.primaryHover};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .steam-workshop-dialog .dialog-button-secondary {
          background: ${Theme.componentBackground};
          color: ${Theme.textPrimary};
          border: 1px solid ${Theme.borderPrimary};
        }

        .steam-workshop-dialog .dialog-button-secondary:hover:not(:disabled) {
          background: ${Theme.componentHoverBackground};
          transform: translateY(-1px);
        }

        .steam-workshop-dialog .small-button {
          padding: 8px 16px;
          font-size: 0.85rem;
        }

        .steam-workshop-dialog .error-section {
        }

        .steam-workshop-dialog .error-title {
          color: #ff5252;
          border-bottom-color: #ff5252;
        }

        .steam-workshop-dialog .error-title::after {
          background: #ff5252;
        }

        .steam-workshop-dialog .error-message {
          color: #ff8a80;
        }

        .steam-workshop-dialog .warning-message {
          color: #ffa726;
          background: rgba(255, 167, 38, 0.1);
          padding: 12px;
          margin-top: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .steam-workshop-dialog .warning-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .steam-workshop-dialog .warning-icon svg {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }

        .steam-workshop-dialog .owner-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .steam-workshop-dialog .owner-name {
          color: ${Theme.textPrimary};
          margin-left: 4px;
        }

        .steam-workshop-dialog .owner-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          padding: 0px 0px 2px 0px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          font-size: 0.9rem;
          color: ${Theme.textPrimary};
        }

        .steam-workshop-dialog .owner-link:hover {
          color: ${Theme.primary};
          text-shadow: 0 0 10px ${Theme.primary};
          box-shadow: 0 2px 0 ${Theme.primary};
        }

        .steam-workshop-dialog .owner-avatar-placeholder {
          width: 24px;
          height: 24px;
          background: ${Theme.borderSecondary};
        }

        .steam-workshop-dialog .owner-avatar {
          width: 24px;
          height: 24px;
          object-fit: cover;
        }

        .steam-workshop-dialog .item-info-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .steam-workshop-dialog .item-info {
          margin: 8px 0;
          color: ${Theme.textSecondary};
          flex: 1;
        }

        .steam-workshop-dialog .item-info strong {
          color: ${Theme.textPrimary};
        }

        .steam-workshop-dialog .unlink-button {
          margin-top: 12px;
        }

        .steam-workshop-dialog .workshop-input-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .steam-workshop-dialog .workshop-input-row .input-label {
          margin: 0;
          padding-top: 10px;
          font-weight: 600;
          color: ${Theme.textSecondary};
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .steam-workshop-dialog .workshop-input-row .text-input,
        .steam-workshop-dialog .workshop-input-row .text-area,
        .steam-workshop-dialog .workshop-input-row .select-input {
          flex: 1;
          margin-bottom: 0;
        }

        .steam-workshop-dialog .workshop-input-row.compact-row {
          margin: 0;
        }

        .steam-workshop-dialog .workshop-input-row.compact-row .input-label {
          flex: 0 0 80px;
        }

        .steam-workshop-dialog .input-label {
          display: block;
          margin: 6px 0 0 0;
          font-weight: 600;
          color: ${Theme.textSecondary};
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .steam-workshop-dialog .text-input,
        .steam-workshop-dialog .text-area,
        .steam-workshop-dialog .select-input {
          width: calc(100% - 20px);
          padding: 6px;
          background: ${Theme.inputBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0px;
          color: ${Theme.textPrimary};
          font-family: inherit;
          font-size: 0.9rem;
          margin-bottom: 10px;
          transition: all 0.2s ease;
        }

        .steam-workshop-dialog .text-input:focus,
        .steam-workshop-dialog .text-area:focus,
        .steam-workshop-dialog .select-input:focus {
          outline: none;
          border-color: ${Theme.borderFocus};
          background: ${Theme.inputFocusBackground};
        }

        .steam-workshop-dialog .text-input:disabled,
        .steam-workshop-dialog .text-area:disabled,
        .steam-workshop-dialog .select-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .steam-workshop-dialog .info-value {
          padding: 10px 12px;
          background: ${Theme.componentBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0px;
          color: ${Theme.textPrimary};
          font-size: 0.9rem;
          margin-bottom: 10px;
        }

        .steam-workshop-dialog .preview-row {
          display: flex;
          gap: 12px;
          margin: 16px 0 0 0;
        }

        .steam-workshop-dialog .preview-wrapper {
          position: relative;
          width: 220px;
          height: 220px;
          flex-shrink: 0;
        }

        .steam-workshop-dialog .preview-container {
          min-height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${Theme.inputBackground};
          border: 1px solid ${Theme.borderSecondary};
          overflow: hidden;
        }

        .steam-workshop-dialog .square-preview {
          width: 220px;
          height: 220px;
          min-width: 220px;
          min-height: 220px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .steam-workshop-dialog .square-preview:hover:not(.disabled) {
          border-color: ${Theme.primary};
          box-shadow: 0 0 0 2px ${Theme.primary}33;
        }

        .steam-workshop-dialog .square-preview.disabled {
          cursor: default;
        }

        .steam-workshop-dialog .remove-preview-button {
          position: absolute;
          top: 6px;
          right: 4px;
          width: 22px;
          height: 22px;
          background: ${Theme.error}33;
          color: ${Theme.error};
          border: 1px solid ${Theme.error};
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          opacity: 0;
          pointer-events: none;
        }

        .steam-workshop-dialog .preview-wrapper:hover .remove-preview-button {
          opacity: 1;
          pointer-events: auto;
        }

        .steam-workshop-dialog .remove-preview-button:hover {
          background: ${Theme.error};
          color: ${Theme.textPrimary};
        }

        .steam-workshop-dialog .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .steam-workshop-dialog .preview-placeholder {
          color: ${Theme.textSecondary};
          font-style: italic;
          text-align: center;
          padding: 16px;
        }

        .steam-workshop-dialog .settings-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .steam-workshop-dialog .description-container {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .steam-workshop-dialog .description-container .text-area {
          min-height: 97px;
          resize: none;
          height: 97px;
          margin-bottom: 0;
        }

        /* Change notes (changelog) sub-dialog — themed card with a backdrop */
        .steam-workshop-dialog .change-notes-overlay {
          position: absolute;
          inset: 0;
          z-index: 50;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .steam-workshop-dialog .change-notes-overlay.visible {
          opacity: 1;
        }
        .steam-workshop-dialog .change-notes-card {
          width: 460px;
          max-width: 90%;
          background: ${Theme.sidebarBackground};
          border: 1px solid ${Theme.borderPrimary};
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transform: scale(0.96) translateY(-10px);
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .steam-workshop-dialog .change-notes-overlay.visible .change-notes-card {
          transform: scale(1) translateY(0);
        }
        .steam-workshop-dialog .change-notes-header {
          background: ${Theme.primary};
          padding: 14px 20px;
          text-transform: uppercase;
        }
        .steam-workshop-dialog .change-notes-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: ${Theme.textPrimary};
          letter-spacing: 0.5px;
        }
        .steam-workshop-dialog .change-notes-content {
          padding: 20px;
        }
        .steam-workshop-dialog .change-notes-hint {
          margin: 0 0 10px 0;
          font-size: 0.85rem;
          color: ${Theme.textSecondary};
        }
        .steam-workshop-dialog .change-notes-textarea {
          width: 100%;
          box-sizing: border-box;
          resize: vertical;
          min-height: 120px;
          padding: 10px 12px;
          background: ${Theme.inputBackground};
          color: ${Theme.textPrimary};
          border: 1px solid ${Theme.borderSecondary};
          font-family: inherit;
          font-size: 0.9rem;
          line-height: 1.5;
          outline: none;
        }
        .steam-workshop-dialog .change-notes-textarea:focus {
          border-color: ${Theme.borderFocus};
        }
        .steam-workshop-dialog .change-notes-footer {
          padding: 14px 20px;
          background: ${Theme.componentBackground};
          border-top: 1px solid ${Theme.borderSecondary};
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        /* Upload Progress Overlay */
        .steam-workshop-dialog .upload-progress-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .steam-workshop-dialog .upload-progress-container {
          background: ${Theme.sidebarBackground};
          border: 1px solid ${Theme.borderPrimary};
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          padding: 36px 40px;
          min-width: 360px;
          max-width: 90%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .steam-workshop-dialog .upload-progress-title {
          margin: 24px 0 0 0;
          font-size: 1.05rem;
          font-weight: 600;
          color: ${Theme.textPrimary};
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .steam-workshop-dialog .upload-spinner-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 230px;
          height: 150px;
        }

        /* A calm spinning ring around a static, softly pulsing Steam logo. */
        .steam-workshop-dialog .upload-spinner {
          position: relative;
          width: 84px;
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .steam-workshop-dialog .upload-spinner::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid ${Theme.borderSecondary};
          border-top-color: ${Theme.primary};
          animation: uploadRing 0.9s linear infinite;
        }

        .steam-workshop-dialog .upload-spinner svg {
          width: 44px;
          height: 44px;
          fill: ${Theme.primary};
          filter: drop-shadow(0 0 8px ${Theme.primary}66);
          animation: uploadPulse 2s ease-in-out infinite;
        }

        @keyframes uploadRing {
          to { transform: rotate(360deg); }
        }

        @keyframes uploadPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .steam-workshop-dialog .upload-progress-text {
          margin: 0;
          font-size: 1rem;
          color: ${Theme.textSecondary};
          text-align: center;
          font-weight: 500;
        }

        /* Loading Spinner */
        .steam-workshop-dialog .loading-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .steam-workshop-dialog .loading-spinner-container {
          margin-bottom: 20px;
        }

        /* Shares the same calm ring style as .upload-spinner. */
        .steam-workshop-dialog .loading-spinner {
          position: relative;
          width: 84px;
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .steam-workshop-dialog .loading-spinner::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid ${Theme.borderSecondary};
          border-top-color: ${Theme.primary};
          animation: uploadRing 0.9s linear infinite;
        }

        .steam-workshop-dialog .loading-spinner svg {
          width: 44px;
          height: 44px;
          fill: ${Theme.primary};
          filter: drop-shadow(0 0 8px ${Theme.primary}66);
          animation: uploadPulse 2s ease-in-out infinite;
        }

        .steam-workshop-dialog .loading-text {
          margin: 0;
          font-size: 1rem;
          color: ${Theme.textSecondary};
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .steam-workshop-dialog {
            width: 95vw;
            max-height: 90vh;
          }

          .steam-workshop-dialog .dialog-content {
            padding: 16px;
          }

          .steam-workshop-dialog .change-notes-card {
            min-width: 90%;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  destroy() {
    this.hide();

    const styles = document.querySelector("#steam-workshop-dialog-styles");
    if (styles) {
      styles.remove();
    }
  }
}

// Singleton for easier access
let steamWorkshopDialogInstance = null;

export function initializeSteamWorkshopDialog() {
  if (!steamWorkshopDialogInstance) {
    steamWorkshopDialogInstance = new SteamWorkshopDialog();
  }
  return steamWorkshopDialogInstance;
}

export function getSteamWorkshopDialog() {
  return steamWorkshopDialogInstance;
}

export function destroySteamWorkshopDialog() {
  if (steamWorkshopDialogInstance) {
    steamWorkshopDialogInstance.destroy();
    steamWorkshopDialogInstance = null;
  }
}
