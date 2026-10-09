// Level Card Component for Level Browser
// A rich, visually appealing card for displaying workshop level items

import { Theme } from "../inspectorUI.js";
import {
  Download as DownloadIcon,
  ThumbUp as UpvoteIcon,
  ThumbDown as DownvoteIcon,
  Play as PlayIcon,
  SteamLogo as SteamIcon,
  AccountGroup as SubscribersIcon,
  CalendarMonth as CalendarIcon,
  PlayProjectFromStart as LevelPackIcon,
  PlayProject as SingleLevelIcon,
  Fire as DifficultyIcon,
  CheckCircle as InstalledIcon,
  CloudDownload as CloudDownloadIcon,
  Update as UpdateIcon,
  Account as AuthorIcon,
  FilterOutline as FilterIcon,
  OpenInNew as OpenInNewIcon,
} from "../iconList.js";

/**
 * @typedef {import('../../workshop.js').WorkshopItem} WorkshopItem
 */

/**
 * Difficulty color scale from easy (green) to hard (red)
 * @param {number} difficulty - 0-10 scale
 * @returns {string} CSS color
 */
function getDifficultyColor(difficulty) {
  const clampedDiff = Math.max(0, Math.min(10, difficulty));
  // Green -> Yellow -> Orange -> Red
  if (clampedDiff <= 3) {
    // Green to Yellow
    const t = clampedDiff / 3;
    return `hsl(${120 - t * 60}, 70%, 50%)`;
  } else if (clampedDiff <= 6) {
    // Yellow to Orange
    const t = (clampedDiff - 3) / 3;
    return `hsl(${60 - t * 30}, 80%, 50%)`;
  } else {
    // Orange to Red
    const t = (clampedDiff - 6) / 4;
    return `hsl(${30 - t * 30}, 90%, 50%)`;
  }
}

/**
 * Format a timestamp to a relative or absolute date string
 * @param {number} timestamp - Unix timestamp in seconds
 * @param {import('./i18n/I18n.js').I18n} [i18n] - Optional i18n instance for translations
 * @returns {string}
 */
function formatDate(timestamp, i18n) {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (i18n) {
    if (diffDays === 0) return i18n.t("dates.today");
    if (diffDays === 1) return i18n.t("dates.yesterday");
    if (diffDays < 7) return i18n.t("dates.daysAgo", { count: diffDays });
    if (diffDays < 30)
      return i18n.t("dates.weeksAgo", { count: Math.floor(diffDays / 7) });
    if (diffDays < 365)
      return i18n.t("dates.monthsAgo", { count: Math.floor(diffDays / 30) });
  } else {
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  }
  return date.toLocaleDateString();
}

/**
 * Format large numbers with K/M suffixes
 * @param {number|string} num
 * @returns {string}
 */
function formatNumber(num) {
  const n = parseInt(num, 10) || 0;
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

/**
 * Extract tags info from workshop item
 * @param {WorkshopItem} item
 * @returns {{ isLevelPack: boolean, difficulty: number | null }}
 */
function parseItemTags(item) {
  const tags = item.tags || [];
  const isLevelPack = tags.includes("level_pack");
  let difficulty = null;

  for (const tag of tags) {
    if (tag.startsWith("difficulty_")) {
      const d = parseInt(tag.replace("difficulty_", ""), 10);
      if (!isNaN(d)) difficulty = d;
    }
  }

  return { isLevelPack, difficulty };
}

export class LevelCard {
  /**
   * @param {WorkshopItem} item
   * @param {Object} options
   * @param {import('./i18n/I18n.js').I18n} [options.i18n] - Internationalization instance
   * @param {Function} [options.onPlay] - Callback when play button is clicked
   * @param {Function} [options.onOpenInSteam] - Callback when Steam button is clicked
   * @param {Function} [options.onRefresh] - Callback when refresh button is clicked
   * @param {Function} [options.onDownload] - Callback when download/install button is clicked
   * @param {Function} [options.onOpenFolder] - Callback when open folder button is clicked (installed items)
   */
  constructor(item, options = {}) {
    this.item = item;
    this.options = options;
    this.i18n = options.i18n;
    this.element = null;
    this.imageLoaded = false;
    this.isPolling = false;
  }

  /**
   * Get translated string, with fallback if i18n not available
   * @param {string} key
   * @param {Object} [params]
   * @returns {string}
   */
  t(key, params = {}) {
    if (this.i18n) {
      return this.i18n.t(key, params);
    }
    // Fallback: return the last part of the key
    return key.split(".").pop() || key;
  }

  /**
   * Start polling for download progress updates
   */
  startDownloadPolling() {
    if (this.isPolling) return; // Already polling

    // Remember key state flags when polling started
    const startState = this.item.state ?? 0;
    this.pollingStartedInstalled = (startState & 4) !== 0;
    this.pollingStartedNeedsUpdate = (startState & 8) !== 0;
    this.isPolling = true;
    this.shownDownloadingState = false; // Track if we've shown downloading UI yet

    this.pollDownloadProgress();
  }

  /**
   * Poll for download progress (recursive, schedules next poll after completion)
   */
  async pollDownloadProgress() {
    if (!this.isPolling) return;

    // Fetch updated item info
    const workshopWrapper = globalThis.workshopWrapper;
    if (!workshopWrapper) {
      this.isPolling = false;
      return;
    }

    try {
      const updatedItem = await workshopWrapper.getItemInfo(
        this.item.publishedFileId,
        true
      );
      if (!updatedItem || !this.isPolling) return;

      // Update our item reference
      this.item = updatedItem;

      // Check state flags
      const itemState = updatedItem.state ?? 0;
      const isInstalled = (itemState & 4) !== 0;
      const isNeedsUpdate = (itemState & 8) !== 0;
      const isDownloading = (itemState & 16) !== 0;

      // Not downloading - determine if we should stop polling
      // Stop conditions:
      // 1. Started as "needs update" and now installed without needing update
      // 2. Started as "not installed" and now installed
      const shouldStop =
        (this.pollingStartedNeedsUpdate && isInstalled && !isNeedsUpdate) ||
        (!this.pollingStartedInstalled && isInstalled);

      if (shouldStop) {
        // Download completed - stop polling and do full update
        this.isPolling = false;
        this.fullUpdate(updatedItem);
        return;
      }

      // Still waiting or downloading - need to show downloading UI
      if (!this.shownDownloadingState) {
        // First time showing downloading state - do a full update with fake downloading state
        this.shownDownloadingState = true;
        // Temporarily set downloading flag so render shows downloading UI
        const fakeItem = {
          ...updatedItem,
          state: (updatedItem.state ?? 0) | 16,
          downloadInfo: { current: "0", total: "1" },
        };
        this.item = fakeItem;
        this.fullUpdate(fakeItem);
      } else if (isDownloading) {
        // Already showing downloading UI, just update progress
        this.updateDownloadProgress(updatedItem);
      }
      // else: waiting for download to start, UI already shows downloading with 0%

      // Keep polling
      if (this.isPolling) {
        setTimeout(() => this.pollDownloadProgress(), 16);
      }
    } catch (error) {
      console.error("[LevelCard] Error polling download progress:", error);
      // On error, retry after a short delay
      if (this.isPolling) {
        setTimeout(() => this.pollDownloadProgress(), 100);
      }
    }
  }

  /**
   * Stop polling for download progress
   */
  stopDownloadPolling() {
    this.isPolling = false;
    this.pollingStartedInstalled = null;
    this.pollingStartedNeedsUpdate = null;
  }

  /**
   * Update only the download progress display (no full re-render)
   * @param {WorkshopItem} item
   */
  updateDownloadProgress(item) {
    if (!this.element) return;

    const stateBtn = this.element.querySelector(".level-card-state-btn");
    if (!stateBtn) return;

    // Calculate progress
    let progressPercent = "0%";
    if (item.downloadInfo && Number(item.downloadInfo.total) > 0) {
      const progress = Math.round(
        (Number(item.downloadInfo.current) / Number(item.downloadInfo.total)) *
          100
      );
      progressPercent = `${progress}%`;
    }

    // Update just the progress text
    const progressEl = stateBtn.querySelector(".state-progress");
    if (progressEl) {
      progressEl.textContent = progressPercent;
    }
  }

  /**
   * Do a full card update (re-render)
   * @param {WorkshopItem} newItem
   */
  fullUpdate(newItem) {
    this.item = newItem;
    const oldElement = this.element;
    if (oldElement && oldElement.parentNode) {
      const parent = oldElement.parentNode;

      // Preserve the loaded image to prevent blinking
      const oldImageContainer = oldElement.querySelector(".level-card-image");
      const oldImg = oldImageContainer?.querySelector("img");
      const wasImageLoaded = this.imageLoaded && oldImg;

      const newElement = this.render();

      // If image was already loaded, restore it to prevent reload/blink
      if (wasImageLoaded) {
        const newImageContainer = newElement.querySelector(".level-card-image");
        const newImg = newImageContainer?.querySelector("img");
        if (newImg && newImageContainer) {
          newImg.replaceWith(oldImg);
          newImageContainer.classList.add("loaded");
          this.imageLoaded = true;
        }
      }

      parent.replaceChild(newElement, oldElement);
    }
  }

  /**
   * Create and return the card DOM element
   * @returns {HTMLElement}
   */
  render() {
    const item = this.item;
    const { isLevelPack, difficulty } = parseItemTags(item);

    const card = document.createElement("div");
    card.className = "level-card";
    card.dataset.itemId = item.publishedFileId;

    // Preview image section
    const imageContainer = document.createElement("div");
    imageContainer.className = "level-card-image";

    if (item.previewUrl) {
      const img = document.createElement("img");
      img.src = item.previewUrl;
      img.alt = item.title;
      img.loading = "lazy";
      img.addEventListener("load", () => {
        imageContainer.classList.add("loaded");
        this.imageLoaded = true;
      });
      img.addEventListener("error", () => {
        imageContainer.classList.add("error");
      });
      imageContainer.appendChild(img);
    } else {
      imageContainer.classList.add("no-image");
      const placeholder = document.createElement("div");
      placeholder.className = "level-card-placeholder";
      placeholder.innerHTML = isLevelPack ? LevelPackIcon : SingleLevelIcon;
      imageContainer.appendChild(placeholder);
    }

    // Info bar at bottom of image (type + difficulty)
    const infoBar = document.createElement("div");
    infoBar.className = "level-card-info-bar";

    // Type indicator
    const typeEl = document.createElement("div");
    typeEl.className = `level-card-type ${isLevelPack ? "pack" : "single"}`;
    typeEl.innerHTML = isLevelPack
      ? `${LevelPackIcon}<span>${this.t("card.levelPack")}</span>`
      : `${SingleLevelIcon}<span>${this.t("card.singleLevel")}</span>`;
    infoBar.appendChild(typeEl);

    // Difficulty indicator (if available)
    if (difficulty !== null) {
      const diffEl = document.createElement("div");
      diffEl.className = "level-card-diff";
      diffEl.style.setProperty("--diff-color", getDifficultyColor(difficulty));
      diffEl.innerHTML = `${DifficultyIcon}<span>${this.t("card.difficulty", {
        value: difficulty,
      })}</span>`;
      infoBar.appendChild(diffEl);
    }

    imageContainer.appendChild(infoBar);

    // Overlay with play button
    const overlay = document.createElement("div");
    overlay.className = "level-card-overlay";

    const playBtn = document.createElement("button");
    playBtn.className = "level-card-play-btn";
    playBtn.innerHTML = PlayIcon;
    playBtn.title = this.t("card.playTooltip");
    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.options.onPlay?.(item);
    });
    overlay.appendChild(playBtn);

    imageContainer.appendChild(overlay);
    card.appendChild(imageContainer);

    // Content section
    const content = document.createElement("div");
    content.className = "level-card-content";

    // Title
    const title = document.createElement("h3");
    title.className = "level-card-title";
    title.textContent = item.title || this.t("card.untitled");
    title.title = item.title;
    content.appendChild(title);

    // Description (truncated)
    if (item.description) {
      const desc = document.createElement("p");
      desc.className = "level-card-description";
      desc.textContent =
        item.description.slice(0, 120) +
        (item.description.length > 120 ? "..." : "");
      desc.title = item.description;
      content.appendChild(desc);
    }

    // Stats row
    const stats = document.createElement("div");
    stats.className = "level-card-stats";

    // Votes
    const votes = document.createElement("div");
    votes.className = "level-card-stat";
    const upvotes = item.numUpvotes || 0;
    const downvotes = item.numDownvotes || 0;
    const totalVotes = upvotes + downvotes;
    const voteRatio =
      totalVotes > 0 ? Math.round((upvotes / totalVotes) * 100) : 0;
    votes.innerHTML = `
      <span class="stat-icon upvote">${UpvoteIcon}</span>
      <span class="stat-value">${formatNumber(upvotes)}</span>
      <span class="stat-separator">·</span>
      <span class="stat-icon downvote">${DownvoteIcon}</span>
      <span class="stat-value">${formatNumber(downvotes)}</span>
    `;
    votes.title = this.t("card.voteRatio", {
      percent: voteRatio,
      up: upvotes,
      down: downvotes,
    });
    stats.appendChild(votes);

    // Subscribers
    const subs =
      item.statistics?.numSubscriptions ||
      item.statistics?.numUniqueSubscriptions;
    if (subs) {
      const subsEl = document.createElement("div");
      subsEl.className = "level-card-stat";
      subsEl.innerHTML = `
        <span class="stat-icon">${SubscribersIcon}</span>
        <span class="stat-value">${formatNumber(subs)}</span>
      `;
      subsEl.title = this.t("card.subscribers", { count: subs });
      stats.appendChild(subsEl);
    }

    // Author
    if (item.owner?.steamId64) {
      const authorWrapper = document.createElement("div");
      authorWrapper.className = "level-card-author-wrapper";

      const authorEl = document.createElement("button");
      authorEl.className = "level-card-author";
      const authorId = item.owner.steamId64;
      authorEl.innerHTML = `<span class="stat-icon author-icon-placeholder">${AuthorIcon}</span><span class="author-name">${this.t(
        "card.authorLoading"
      )}</span>`;
      authorEl.title = this.t("card.authorOptions");
      authorEl.addEventListener("click", (e) => {
        e.stopPropagation();
        authorWrapper.classList.toggle("open");
      });
      authorWrapper.appendChild(authorEl);

      // Fetch author profile asynchronously
      this.fetchAuthorProfile(authorId, authorEl);

      // Author dropdown menu
      const authorMenu = document.createElement("div");
      authorMenu.className = "level-card-author-menu";

      // Show Profile Page
      const profileBtn = document.createElement("button");
      profileBtn.className = "level-card-author-option";
      profileBtn.innerHTML = `${OpenInNewIcon}<span>${this.t(
        "card.showProfile"
      )}</span>`;
      profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        globalThis.workshopWrapper.openProfilePage(authorId);
        authorWrapper.classList.remove("open");
      });
      authorMenu.appendChild(profileBtn);

      // Filter by this author
      const filterBtn = document.createElement("button");
      filterBtn.className = "level-card-author-option";
      filterBtn.innerHTML = `${FilterIcon}<span>${this.t(
        "card.filterByAuthor"
      )}</span>`;
      filterBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.options.onFilterByAuthor?.(authorId);
        authorWrapper.classList.remove("open");
      });
      authorMenu.appendChild(filterBtn);

      // More from this author
      const moreBtn = document.createElement("button");
      moreBtn.className = "level-card-author-option";
      moreBtn.innerHTML = `${SteamIcon}<span>${this.t(
        "card.moreFromAuthor"
      )}</span>`;
      moreBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        globalThis.workshopWrapper.openMoreFromAuthorPage(
          authorId,
          globalThis.workshopWrapper?.pipelab?._steam_AppId
        );
        authorWrapper.classList.remove("open");
      });
      authorMenu.appendChild(moreBtn);

      authorWrapper.appendChild(authorMenu);
      stats.appendChild(authorWrapper);

      // Store reference for cleanup
      this._authorWrapper = authorWrapper;

      // Close menu when clicking outside - use bound handler for cleanup
      this._authorClickOutsideHandler = (e) => {
        if (!authorWrapper.contains(e.target)) {
          authorWrapper.classList.remove("open");
        }
      };
      document.addEventListener("pointerdown", this._authorClickOutsideHandler);
    }

    content.appendChild(stats);

    // Meta row (date + actions)
    const meta = document.createElement("div");
    meta.className = "level-card-meta";

    const dateEl = document.createElement("div");
    dateEl.className = "level-card-date";
    dateEl.innerHTML = `${CalendarIcon}<span>${formatDate(
      item.timeUpdated || item.timeCreated,
      this.i18n
    )}</span>`;
    dateEl.title = `Updated: ${new Date(
      (item.timeUpdated || item.timeCreated) * 1000
    ).toLocaleString()}`;
    meta.appendChild(dateEl);

    // Action buttons
    const actions = document.createElement("div");
    actions.className = "level-card-actions";

    // Determine state from item.state flags
    const itemState = item.state ?? 0;
    const isInstalled = (itemState & 4) !== 0; // k_EItemStateInstalled
    const isDownloading = (itemState & 16) !== 0; // k_EItemStateDownloading
    const isNeedsUpdate = (itemState & 8) !== 0; // k_EItemStateNeedsUpdate

    // State button (combines installed/downloading/update status with actions)
    const stateBtn = document.createElement("button");
    stateBtn.className = "level-card-state-btn";
    stateBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log("[LevelCard] State button clicked", {
        isInstalled,
        isDownloading,
        isNeedsUpdate,
        hasOnOpenFolder: !!this.options.onOpenFolder,
      });
      if (!isInstalled && !isDownloading) {
        // Not installed - trigger download
        console.log("[LevelCard] Triggering download");
        this.options.onDownload?.(item);
        // Start polling for download progress
        this.startDownloadPolling();
      } else if (isNeedsUpdate && !isDownloading) {
        // Needs update - trigger download to get the update
        console.log("[LevelCard] Triggering update download");
        this.options.onDownload?.(item);
        // Start polling for download progress
        this.startDownloadPolling();
      } else if (isInstalled && !isDownloading) {
        // Installed - open folder
        console.log("[LevelCard] Opening folder");
        this.options.onOpenFolder?.(item);
      } else {
        // Downloading - refresh to show progress
        console.log("[LevelCard] Refreshing");
        this.options.onRefresh?.(item);
      }
    });

    if (isDownloading) {
      stateBtn.classList.add("downloading");
      let progressPercent = "0%";
      if (item.downloadInfo && Number(item.downloadInfo.total) > 0) {
        const progress = Math.round(
          (Number(item.downloadInfo.current) /
            Number(item.downloadInfo.total)) *
            100
        );
        progressPercent = `${progress}%`;
      }
      stateBtn.innerHTML = `<span class="state-icon">${CloudDownloadIcon}</span><span class="state-progress">${progressPercent}</span><span class="state-label">${this.t(
        "card.stateDownloading"
      )}</span>`;
      stateBtn.title = this.t("card.stateDownloadingTooltip");
    } else if (isNeedsUpdate) {
      stateBtn.classList.add("needs-update");
      stateBtn.innerHTML = `<span class="state-icon">${UpdateIcon}</span><span class="state-label">${this.t(
        "card.stateUpdate"
      )}</span>`;
      stateBtn.title = this.t("card.stateUpdateTooltip");
    } else if (isInstalled) {
      stateBtn.classList.add("installed");
      stateBtn.innerHTML = `<span class="state-icon">${InstalledIcon}</span><span class="state-label">${this.t(
        "card.stateInstalled"
      )}</span>`;
      stateBtn.title = this.t("card.stateInstalledTooltip");
    } else {
      // Not installed
      stateBtn.classList.add("not-installed");
      stateBtn.innerHTML = `<span class="state-icon">${CloudDownloadIcon}</span><span class="state-label">${this.t(
        "card.stateInstall"
      )}</span>`;
      stateBtn.title = this.t("card.stateInstallTooltip");
    }

    actions.appendChild(stateBtn);

    // Steam button (expands on hover like state button)
    const steamBtn = document.createElement("button");
    steamBtn.className = "level-card-steam-btn";
    steamBtn.innerHTML = `<span class="steam-icon">${SteamIcon}</span><span class="steam-label">${this.t(
      "card.showInWorkshop"
    )}</span>`;
    steamBtn.title = this.t("card.showInWorkshop");
    steamBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.options.onOpenInSteam?.(item);
    });
    actions.appendChild(steamBtn);

    meta.appendChild(actions);
    content.appendChild(meta);

    card.appendChild(content);

    // Card click handler
    card.addEventListener("click", () => {
      this.options.onPlay?.(item);
    });

    this.element = card;
    return card;
  }

  /**
   * Update the card with new item data
   * @param {WorkshopItem} newItem
   */
  update(newItem) {
    // If we're polling, let the polling handle updates
    // This prevents external refresh calls from interfering
    if (this.isPolling) {
      return;
    }
    this.fullUpdate(newItem);
  }

  /**
   * Fetch author profile and update the author element
   * @param {string} authorId - Steam ID 64
   * @param {HTMLElement} authorEl - The author button element
   */
  async fetchAuthorProfile(authorId, authorEl) {
    const workshopWrapper = globalThis.workshopWrapper;
    if (!workshopWrapper) {
      // No workshop wrapper, show shortened ID as fallback
      const nameEl = authorEl.querySelector(".author-name");
      if (nameEl) {
        nameEl.textContent = `...${authorId.slice(-6)}`;
      }
      return;
    }

    try {
      const profile = await workshopWrapper.getProfile(authorId);
      if (profile && this.element) {
        const nameEl = authorEl.querySelector(".author-name");
        const iconEl = authorEl.querySelector(".stat-icon");
        // Check for valid username (not empty, not CDATA artifacts)
        const hasValidUsername =
          profile.username &&
          profile.username.length > 0 &&
          !profile.username.includes("CDATA");
        if (nameEl) {
          nameEl.textContent = hasValidUsername
            ? profile.username
            : `...${authorId.slice(-6)}`;
        }
        authorEl.title = hasValidUsername
          ? this.t("card.authorTooltip", { name: profile.username })
          : this.t("card.authorIdTooltip", { id: authorId });

        // Use avatar if available
        const avatarUrl = profile.avatarIcon || profile.avatarSmall;
        if (avatarUrl && iconEl) {
          const avatarImg = document.createElement("img");
          avatarImg.src = avatarUrl;
          avatarImg.alt = profile.username || "Author";
          avatarImg.className = "author-avatar";
          avatarImg.addEventListener("error", () => {
            // Fallback to SVG icon on error
            avatarImg.remove();
            iconEl.innerHTML = AuthorIcon;
            iconEl.classList.remove("has-avatar");
          });
          iconEl.innerHTML = "";
          iconEl.appendChild(avatarImg);
          iconEl.classList.add("has-avatar");
        }
      }
    } catch (error) {
      console.error("[LevelCard] Failed to fetch author profile:", error);
      const nameEl = authorEl.querySelector(".author-name");
      if (nameEl) {
        nameEl.textContent = `...${authorId.slice(-6)}`;
      }
    }
  }

  /**
   * Destroy the card and clean up
   */
  destroy() {
    this.stopDownloadPolling();

    // Remove click outside handler for author menu
    if (this._authorClickOutsideHandler) {
      document.removeEventListener(
        "pointerdown",
        this._authorClickOutsideHandler
      );
      this._authorClickOutsideHandler = null;
    }
    this._authorWrapper = null;

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}

/**
 * Apply level card styles to the document
 */
export function applyLevelCardStyles() {
  if (document.querySelector("#level-card-styles")) return;

  const style = document.createElement("style");
  style.id = "level-card-styles";
  style.textContent = `
    /* Level Card Styles */
    .level-card {
      background: ${Theme.componentBackground};
      border: 1px solid ${Theme.borderPrimary};
      overflow: hidden;
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .level-card:hover {
      border-color: ${Theme.primary};
    }

    .level-card:active {
      background: ${Theme.componentHoverBackground};
    }

    /* Image Section */
    .level-card-image {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      background: ${Theme.inputBackground};
      overflow: hidden;
    }

    .level-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .level-card-image.loaded img {
      opacity: 1;
    }

    .level-card-image.error img,
    .level-card-image.no-image img {
      display: none;
    }

    .level-card-placeholder {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${Theme.inputBackground};
    }

    .level-card-placeholder svg {
      width: 48px;
      height: 48px;
      color: ${Theme.textMuted};
      opacity: 0.5;
    }

    /* Overlay */
    .level-card-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.15s ease;
    }

    .level-card:hover .level-card-overlay {
      opacity: 1;
    }

    .level-card-play-btn {
      width: 48px;
      height: 48px;
      background: ${Theme.primary};
      border: 1px solid ${Theme.primary};
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: scale(0.9);
      opacity: 0;
      transition: all 0.15s ease;
    }

    .level-card:hover .level-card-play-btn {
      transform: scale(1);
      opacity: 1;
    }

    .level-card-play-btn:hover {
      background: ${Theme.primaryHover};
    }

    .level-card-play-btn:active {
      transform: scale(0.95) !important;
    }

    .level-card-play-btn svg {
      width: 24px;
      height: 24px;
      margin-left: 2px;
    }

    /* Info Bar (Type & Difficulty) - at bottom of image */
    .level-card-info-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      background: rgba(0, 0, 0, 0.75);
      z-index: 2;
    }

    .level-card-type {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      color: ${Theme.textPrimary};
    }

    .level-card-type svg {
      width: 16px;
      height: 16px;
    }

    .level-card-type.pack {
      color: ${Theme.primary};
    }

    .level-card-type.pack svg {
      color: ${Theme.primary};
    }

    .level-card-diff {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--diff-color, ${Theme.textPrimary});
    }

    .level-card-diff svg {
      width: 16px;
      height: 16px;
      color: var(--diff-color, ${Theme.textPrimary});
    }

    /* Content Section */
    .level-card-content {
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }

    .level-card-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: ${Theme.textPrimary};
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .level-card-description {
      margin: 0;
      font-size: 0.85rem;
      color: ${Theme.textSecondary};
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }

    /* Stats */
    .level-card-stats {
      display: flex;
      align-items: center;
      gap: 14px;
      padding-top: 10px;
      border-top: 1px solid ${Theme.borderPrimary};
    }

    .level-card-stat {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      color: ${Theme.textSecondary};
    }

    .level-card-stat .stat-icon {
      display: flex;
      align-items: center;
    }

    .level-card-stat .stat-icon svg {
      width: 14px;
      height: 14px;
    }

    .level-card-stat .stat-icon.upvote svg {
      color: #4CAF50;
    }

    .level-card-stat .stat-icon.downvote svg {
      color: #f44336;
    }

    .level-card-stat .stat-separator {
      color: ${Theme.textMuted};
      margin: 0 2px;
    }

    .level-card-stat .stat-value {
      font-weight: 600;
    }

    /* Author with dropdown */
    .level-card-author-wrapper {
      position: relative;
    }

    .level-card-author {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      color: ${Theme.textSecondary};
      background: transparent;
      border: none;
      padding: 2px 4px;
      margin: -2px -4px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .level-card-author:hover {
      color: ${Theme.textPrimary};
      background: ${Theme.componentHoverBackground};
    }

    .level-card-author .stat-icon {
      display: flex;
      align-items: center;
    }

    .level-card-author .stat-icon svg {
      width: 13px;
      height: 13px;
    }

    .level-card-author .stat-icon.has-avatar {
      width: 16px;
      height: 16px;
      border-radius: 2px;
      overflow: hidden;
    }

    .level-card-author .author-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .level-card-author .author-name {
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.7rem;
    }

    .level-card-author-menu {
      position: absolute;
      bottom: calc(100% + 4px);
      left: 50%;
      transform: translateX(-50%);
      min-width: 180px;
      background: ${Theme.componentBackground};
      border: 1px solid ${Theme.borderPrimary};
      display: none;
      flex-direction: column;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .level-card-author-wrapper.open .level-card-author-menu {
      display: flex;
    }

    .level-card-author-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: transparent;
      border: none;
      color: ${Theme.textPrimary};
      font-size: 0.8rem;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
      transition: background 0.15s ease;
    }

    .level-card-author-option:hover {
      background: ${Theme.componentHoverBackground};
    }

    .level-card-author-option svg {
      width: 14px;
      height: 14px;
      color: ${Theme.textSecondary};
    }

    /* Meta Row */
    .level-card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .level-card-date {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.75rem;
      color: ${Theme.textMuted};
    }

    .level-card-date svg {
      width: 13px;
      height: 13px;
    }

    .level-card-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* State Button - expands on hover to show label */
    .level-card-state-btn {
      height: 26px;
      padding: 0 8px;
      background: ${Theme.inputBackground};
      border: 1px solid ${Theme.borderPrimary};
      color: ${Theme.textSecondary};
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0;
      font-size: 0.75rem;
      font-weight: 500;
      font-family: inherit;
      white-space: nowrap;
      overflow: hidden;
      transition: all 0.15s ease;
    }

    .level-card-state-btn .state-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .level-card-state-btn .state-icon svg {
      width: 15px;
      height: 15px;
    }

    .level-card-state-btn .state-label {
      max-width: 0;
      opacity: 0;
      overflow: hidden;
      transition: all 0.15s ease;
    }

    .level-card-state-btn:hover .state-label {
      max-width: 90px;
      opacity: 1;
      margin-left: 6px;
    }

    .level-card-state-btn:hover {
      padding: 0 10px;
    }

    /* Installed state - dim by default, green on hover */
    .level-card-state-btn.installed {
      color: ${Theme.textMuted};
      border-color: transparent;
      background: transparent;
      opacity: 0.6;
    }

    .level-card-state-btn.installed:hover {
      opacity: 1;
      color: #4CAF50;
      background: rgba(76, 175, 80, 0.15);
      border-color: #4CAF50;
    }

    /* Downloading state - shows % always, "Downloading" label on hover */
    .level-card-state-btn.downloading {
      color: ${Theme.primary};
      border-color: rgba(74, 158, 255, 0.4);
    }

    .level-card-state-btn.downloading .state-icon svg {
      animation: bounce 1s ease-in-out infinite;
    }

    .level-card-state-btn.downloading .state-progress {
      margin-left: 6px;
    }

    .level-card-state-btn.downloading:hover {
      background: rgba(74, 158, 255, 0.15);
      border-color: ${Theme.primary};
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
    }

    /* Needs update state */
    .level-card-state-btn.needs-update {
      color: ${Theme.warning};
      border-color: rgba(255, 193, 7, 0.4);
    }

    .level-card-state-btn.needs-update:hover {
      background: rgba(255, 193, 7, 0.15);
      border-color: ${Theme.warning};
    }

    /* Not installed state */
    .level-card-state-btn.not-installed {
      color: ${Theme.textMuted};
      border-color: ${Theme.borderPrimary};
    }

    .level-card-state-btn.not-installed:hover {
      background: ${Theme.componentHoverBackground};
      border-color: ${Theme.textSecondary};
      color: ${Theme.textSecondary};
    }

    /* Steam Button - expands on hover like state button */
    .level-card-steam-btn {
      height: 26px;
      padding: 0 8px;
      background: ${Theme.inputBackground};
      border: 1px solid ${Theme.borderPrimary};
      color: ${Theme.textSecondary};
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0;
      font-size: 0.75rem;
      font-weight: 500;
      font-family: inherit;
      white-space: nowrap;
      overflow: hidden;
      transition: all 0.15s ease;
    }

    .level-card-steam-btn .steam-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .level-card-steam-btn .steam-icon svg {
      width: 15px;
      height: 15px;
    }

    .level-card-steam-btn .steam-label {
      max-width: 0;
      opacity: 0;
      overflow: hidden;
      transition: all 0.15s ease;
    }

    .level-card-steam-btn:hover {
      padding: 0 10px;
      background: #1b2838;
      border-color: #66c0f4;
      color: #66c0f4;
    }

    .level-card-steam-btn:hover .steam-label {
      max-width: 130px;
      opacity: 1;
      margin-left: 6px;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    /* Responsive */
    @media (max-width: 600px) {
      .level-card-play-btn {
        width: 44px;
        height: 44px;
      }

      .level-card-play-btn svg {
        width: 22px;
        height: 22px;
      }

      .level-card-content {
        padding: 12px;
      }

      .level-card-title {
        font-size: 0.95rem;
      }
    }
  `;

  document.head.appendChild(style);
}

export function removeLevelCardStyles() {
  const style = document.querySelector("#level-card-styles");
  if (style) style.remove();
}
