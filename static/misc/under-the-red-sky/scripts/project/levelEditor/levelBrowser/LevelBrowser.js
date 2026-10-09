// Level Browser UI
// Main component for browsing subscribed workshop levels

import { Theme } from "../inspectorUI.js";
import {
  LevelCard,
  applyLevelCardStyles,
  removeLevelCardStyles,
} from "./LevelCard.js";
import {
  Refresh as RefreshIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  FolderOpen as EmptyIcon,
  AlertCircle as ErrorIcon,
  SteamLogo as SteamIcon,
  SortAscending as SortAscIcon,
  SortDescending as SortDescIcon,
  ChevronDown as DropdownIcon,
  FilterOutline as FilterIcon,
} from "../iconList.js";
import { I18n, getCurrentLanguage } from "./i18n/I18n.js";

/**
 * @typedef {import('../../workshop.js').WorkshopItem} WorkshopItem
 */

// ============================================
// DEBUG MODE - Set to true to show fake items
// ============================================
const DEBUG_MODE = false;

/**
 * Generate fake workshop items for testing all card states
 * @returns {WorkshopItem[]}
 */
function generateDebugItems() {
  const now = Math.floor(Date.now() / 1000);
  const day = 86400;

  // Sample author IDs for testing
  const authors = [
    {
      steamId64: "76561198012345678",
      steamId32: "STEAM_0:0:26039975",
      accountId: 52079950,
    },
    {
      steamId64: "76561198087654321",
      steamId32: "STEAM_0:1:63727046",
      accountId: 127454093,
    },
    {
      steamId64: "76561198111222333",
      steamId32: "STEAM_0:1:75496166",
      accountId: 150992333,
    },
  ];

  return [
    // Single level, installed, no difficulty
    {
      publishedFileId: "debug_001",
      title: "Simple Test Level",
      description:
        "A basic single level for testing. This is a short description.",
      previewUrl: "https://picsum.photos/seed/level1/640/360",
      tags: [],
      numUpvotes: 42,
      numDownvotes: 3,
      statistics: { numSubscriptions: 150 },
      timeUpdated: now - day * 2,
      timeCreated: now - day * 30,
      state: 4, // Installed
      owner: authors[0],
    },
    // Level pack, installed, difficulty 3 (easy)
    {
      publishedFileId: "debug_002",
      title: "Beginner's Level Pack",
      description:
        "A collection of easy levels perfect for beginners. Contains 10 levels with gradually increasing difficulty.",
      previewUrl: "https://picsum.photos/seed/level2/640/360",
      tags: ["level_pack", "difficulty_3"],
      numUpvotes: 256,
      numDownvotes: 12,
      statistics: { numSubscriptions: 1250 },
      timeUpdated: now - day * 7,
      timeCreated: now - day * 60,
      state: 4, // Installed
      owner: authors[1],
    },
    // Single level, downloading, difficulty 5 (medium)
    {
      publishedFileId: "debug_003",
      title: "Downloading Level Example",
      description:
        "This level is currently being downloaded to show the downloading state.",
      previewUrl: "https://picsum.photos/seed/level3/640/360",
      tags: ["difficulty_5"],
      numUpvotes: 89,
      numDownvotes: 7,
      statistics: { numSubscriptions: 430 },
      timeUpdated: now - day,
      timeCreated: now - day * 14,
      state: 16, // Downloading
      downloadInfo: { current: "52428800", total: "104857600" }, // 50%
      owner: authors[2],
    },
    // Level pack, needs update, difficulty 7 (hard)
    {
      publishedFileId: "debug_004",
      title: "Advanced Challenge Pack",
      description:
        "Challenging levels for experienced players. An update is available for this pack.",
      previewUrl: "https://picsum.photos/seed/level4/640/360",
      tags: ["level_pack", "difficulty_7"],
      numUpvotes: 512,
      numDownvotes: 45,
      statistics: { numSubscriptions: 2800 },
      timeUpdated: now - day * 3,
      timeCreated: now - day * 90,
      state: 12, // Installed + NeedsUpdate (4 + 8)
      owner: authors[0],
    },
    // Single level, difficulty 10 (extreme), no image
    {
      publishedFileId: "debug_005",
      title: "Extreme Difficulty - No Preview",
      description:
        "The hardest level available. This one has no preview image to test the placeholder.",
      previewUrl: null,
      tags: ["difficulty_10"],
      numUpvotes: 1024,
      numDownvotes: 256,
      statistics: { numSubscriptions: 5000 },
      timeUpdated: now - day * 14,
      timeCreated: now - day * 180,
      state: 4, // Installed
      owner: authors[1],
    },
    // Level pack, no state (not installed yet)
    {
      publishedFileId: "debug_006",
      title: "Not Installed Pack",
      description:
        "This level pack hasn't been installed yet - no state indicator should show.",
      previewUrl: "https://picsum.photos/seed/level6/640/360",
      tags: ["level_pack"],
      numUpvotes: 15,
      numDownvotes: 1,
      statistics: { numSubscriptions: 75 },
      timeUpdated: now,
      timeCreated: now - day * 5,
      state: 0, // Not installed
      owner: authors[2],
    },
    // Single level, very long title and description
    {
      publishedFileId: "debug_007",
      title:
        "This Is A Very Long Level Title That Should Be Truncated Properly In The Card Display",
      description:
        "This is an extremely long description that goes on and on and on. It should be truncated after a certain number of characters to prevent the card from becoming too tall. Let's see how well the truncation works with this very verbose description that just keeps going.",
      previewUrl: "https://picsum.photos/seed/level7/640/360",
      tags: ["difficulty_6"],
      numUpvotes: 33,
      numDownvotes: 2,
      statistics: { numSubscriptions: 200 },
      timeUpdated: now - day * 365, // 1 year ago
      timeCreated: now - day * 400,
      state: 4,
      owner: authors[0],
    },
    // Level with zero votes
    {
      publishedFileId: "debug_008",
      title: "Brand New Level",
      description: "Just uploaded! No votes yet.",
      previewUrl: "https://picsum.photos/seed/level8/640/360",
      tags: [],
      numUpvotes: 0,
      numDownvotes: 0,
      statistics: { numSubscriptions: 3 },
      timeUpdated: now,
      timeCreated: now,
      state: 4,
      owner: authors[1],
    },
    // Level with high numbers (K formatting)
    {
      publishedFileId: "debug_009",
      title: "Super Popular Level",
      description:
        "This level has tons of votes and subscribers to test number formatting.",
      previewUrl: "https://picsum.photos/seed/level9/640/360",
      tags: ["level_pack", "difficulty_4"],
      numUpvotes: 15420,
      numDownvotes: 890,
      statistics: { numSubscriptions: 125000 },
      timeUpdated: now - day * 30,
      timeCreated: now - day * 365,
      state: 4,
      owner: authors[2],
    },
    // Downloading with 0% progress
    {
      publishedFileId: "debug_010",
      title: "Download Starting",
      description: "Download just started, 0% progress.",
      previewUrl: "https://picsum.photos/seed/level10/640/360",
      tags: ["difficulty_2"],
      numUpvotes: 50,
      numDownvotes: 5,
      statistics: { numSubscriptions: 300 },
      timeUpdated: now - day * 10,
      timeCreated: now - day * 50,
      state: 16, // Downloading
      downloadInfo: { current: "0", total: "104857600" }, // 0%
      owner: authors[0],
    },
  ];
}

export class LevelBrowser {
  /**
   * @param {Object} options
   * @param {HTMLElement} [options.container] - Container element (defaults to document.body)
   * @param {Function} [options.onPlayLevel] - Callback when a level is selected to play (receives item and projectData)
   * @param {Function} [options.onClose] - Callback when browser is closed
   */
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.onPlayLevel = options.onPlayLevel;
    this.onClose = options.onClose;

    // Initialize internationalization
    const language = getCurrentLanguage();
    this.i18n = new I18n(language);

    this.element = null;
    this.backdrop = null;
    this.isVisible = false;
    this.isLoading = false;
    this.searchQuery = "";

    // Sorting state
    this.sortBy = "title"; // title, upvotes, downvotes, subscribers, rating, updated
    this.sortReversed = false;

    // Filter state (parsed from search query)
    this.filters = {
      text: "",
      author: null,
      type: null, // "single" or "pack"
      difficulty: null, // { min, max }
      state: null, // "installed", "downloading", "update", "none"
    };

    /** @type {WorkshopItem[]} */
    this.items = [];
    /** @type {Map<string, LevelCard>} */
    this.cardInstances = new Map();

    this.applyStyles();
    applyLevelCardStyles();
  }

  /**
   * Show the level browser
   */
  async show() {
    if (this.isVisible) return;

    this._clearHideTimer();
    this.createUI();
    this.isVisible = true;

    // Animate in
    requestAnimationFrame(() => {
      this.backdrop?.classList.add("visible");
      this.element?.classList.add("visible");
    });

    // Load items
    await this.loadItems();
  }

  /**
   * Hide the level browser
   * @param {Object} [options]
   * @param {boolean} [options.notifyClose=true] - Fire onClose (which sends the
   *   player back to the main menu). The play path and layout teardown pass
   *   false: a level is already loading, so a deferred "go to MainMenu" would
   *   race the level's own layout change and bounce the player to the title.
   */
  hide({ notifyClose = true } = {}) {
    if (!this.isVisible) return;

    this.backdrop?.classList.remove("visible");
    this.element?.classList.remove("visible");

    this._clearHideTimer();
    this._hideTimer = setTimeout(() => {
      this._hideTimer = null;
      this.destroyUI();
      this.isVisible = false;
      if (notifyClose && this.onClose) {
        this.onClose();
      }
    }, 100);
  }

  _clearHideTimer() {
    if (this._hideTimer) {
      clearTimeout(this._hideTimer);
      this._hideTimer = null;
    }
  }

  /**
   * Create the browser UI
   */
  createUI() {
    // Backdrop
    this.backdrop = document.createElement("div");
    this.backdrop.className = "level-browser-backdrop";
    this.backdrop.addEventListener("click", (e) => {
      if (e.target === this.backdrop) this.hide();
    });

    // Main container
    this.element = document.createElement("div");
    this.element.className = "level-browser";

    // Header
    const header = this.createHeader();
    this.element.appendChild(header);

    // Content area
    this.contentArea = document.createElement("div");
    this.contentArea.className = "level-browser-content";
    this.element.appendChild(this.contentArea);

    // Add to DOM
    this.backdrop.appendChild(this.element);
    this.container.appendChild(this.backdrop);

    // Setup keyboard handlers
    this.setupKeyboardHandlers();
  }

  /**
   * Create the header section
   * @returns {HTMLElement}
   */
  createHeader() {
    const header = document.createElement("div");
    header.className = "level-browser-header";

    // Top row: title and main controls
    const topRow = document.createElement("div");
    topRow.className = "level-browser-header-top";

    // Close button (on the left)
    const closeBtn = document.createElement("button");
    closeBtn.className = "level-browser-btn close";
    closeBtn.innerHTML = CloseIcon;
    closeBtn.title = this.i18n.t("header.closeTooltip");
    closeBtn.addEventListener("click", () => this.hide());
    topRow.appendChild(closeBtn);

    // Title section
    const titleSection = document.createElement("div");
    titleSection.className = "level-browser-title-section";

    const title = document.createElement("h1");
    title.className = "level-browser-title";
    title.innerHTML = `${SteamIcon}<span>${this.i18n.t("header.title")}</span>`;
    titleSection.appendChild(title);

    topRow.appendChild(titleSection);

    // Main controls (refresh, browse)
    const mainControls = document.createElement("div");
    mainControls.className = "level-browser-main-controls";

    // Refresh button
    const refreshBtn = document.createElement("button");
    refreshBtn.className = "level-browser-btn";
    refreshBtn.innerHTML = `${RefreshIcon}<span>${this.i18n.t(
      "header.refresh"
    )}</span>`;
    refreshBtn.title = this.i18n.t("header.refreshTooltip");
    refreshBtn.addEventListener("click", () => this.loadItems(true));
    this.refreshBtn = refreshBtn;
    mainControls.appendChild(refreshBtn);

    // Browse Workshop button
    const browseBtn = document.createElement("button");
    browseBtn.className = "level-browser-btn steam";
    browseBtn.innerHTML = `${SteamIcon}<span>${this.i18n.t(
      "header.browseWorkshop"
    )}</span>`;
    browseBtn.title = this.i18n.t("header.browseWorkshopTooltip");
    browseBtn.addEventListener("click", () => this.openWorkshopPage());
    mainControls.appendChild(browseBtn);

    topRow.appendChild(mainControls);
    header.appendChild(topRow);

    // Bottom row: search and sort controls
    const bottomRow = document.createElement("div");
    bottomRow.className = "level-browser-header-bottom";

    // Search input with filter help
    const searchWrapper = document.createElement("div");
    searchWrapper.className = "level-browser-search";
    searchWrapper.innerHTML = SearchIcon;

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = this.i18n.t("search.placeholder");
    searchInput.className = "level-browser-search-input";
    searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value;
      this.parseSearchQuery();
      this.renderItems();
    });
    this.searchInput = searchInput;
    searchWrapper.appendChild(searchInput);

    // Advanced search button and menu
    const advancedSearchDropdown = document.createElement("div");
    advancedSearchDropdown.className = "level-browser-advanced-dropdown";

    const advancedBtn = document.createElement("button");
    advancedBtn.className = "level-browser-advanced-btn";
    advancedBtn.innerHTML = FilterIcon;
    advancedBtn.title = this.i18n.t("search.advancedFiltersTooltip");
    advancedBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      advancedSearchDropdown.classList.toggle("open");
    });
    advancedSearchDropdown.appendChild(advancedBtn);

    const advancedMenu = document.createElement("div");
    advancedMenu.className = "level-browser-advanced-menu";

    // Type filter
    const typeSection = this.createFilterSection(this.i18n.t("filters.type"), [
      { label: this.i18n.t("filters.singleLevel"), filter: "type:single" },
      { label: this.i18n.t("filters.levelPack"), filter: "type:pack" },
    ]);
    advancedMenu.appendChild(typeSection);

    // State filter
    const stateSection = this.createFilterSection(
      this.i18n.t("filters.state"),
      [
        { label: this.i18n.t("filters.installed"), filter: "state:installed" },
        {
          label: this.i18n.t("filters.downloading"),
          filter: "state:downloading",
        },
        {
          label: this.i18n.t("filters.updateAvailable"),
          filter: "state:update",
        },
        { label: this.i18n.t("filters.notInstalled"), filter: "state:none" },
      ]
    );
    advancedMenu.appendChild(stateSection);

    // Difficulty filter
    const diffSection = document.createElement("div");
    diffSection.className = "level-browser-filter-section";
    const diffLabel = document.createElement("div");
    diffLabel.className = "level-browser-filter-label";
    diffLabel.textContent = this.i18n.t("filters.difficulty");
    diffSection.appendChild(diffLabel);

    const diffRow = document.createElement("div");
    diffRow.className = "level-browser-filter-row difficulty";

    const diffMinInput = document.createElement("input");
    diffMinInput.type = "number";
    diffMinInput.min = "0";
    diffMinInput.max = "10";
    diffMinInput.placeholder = "0";
    diffMinInput.className = "level-browser-filter-input";

    const diffSeparator = document.createElement("span");
    diffSeparator.textContent = this.i18n.t("filters.difficultyTo");
    diffSeparator.className = "level-browser-filter-separator";

    const diffMaxInput = document.createElement("input");
    diffMaxInput.type = "number";
    diffMaxInput.min = "0";
    diffMaxInput.max = "10";
    diffMaxInput.placeholder = "10";
    diffMaxInput.className = "level-browser-filter-input";

    const diffAddBtn = document.createElement("button");
    diffAddBtn.className = "level-browser-filter-add";
    diffAddBtn.textContent = this.i18n.t("filters.add");
    diffAddBtn.addEventListener("click", () => {
      const min = diffMinInput.value || "0";
      const max = diffMaxInput.value || "10";
      this.addFilterToSearch(`difficulty:${min}-${max}`);
      advancedSearchDropdown.classList.remove("open");
    });

    diffRow.appendChild(diffMinInput);
    diffRow.appendChild(diffSeparator);
    diffRow.appendChild(diffMaxInput);
    diffRow.appendChild(diffAddBtn);
    diffSection.appendChild(diffRow);
    advancedMenu.appendChild(diffSection);

    // Author filter
    const authorSection = document.createElement("div");
    authorSection.className = "level-browser-filter-section";
    const authorLabel = document.createElement("div");
    authorLabel.className = "level-browser-filter-label";
    authorLabel.textContent = this.i18n.t("filters.authorId");
    authorSection.appendChild(authorLabel);

    const authorRow = document.createElement("div");
    authorRow.className = "level-browser-filter-row";

    const authorInput = document.createElement("input");
    authorInput.type = "text";
    authorInput.placeholder = this.i18n.t("filters.authorPlaceholder");
    authorInput.className = "level-browser-filter-input wide";

    const authorAddBtn = document.createElement("button");
    authorAddBtn.className = "level-browser-filter-add";
    authorAddBtn.textContent = this.i18n.t("filters.add");
    authorAddBtn.addEventListener("click", () => {
      if (authorInput.value.trim()) {
        this.addFilterToSearch(`author:${authorInput.value.trim()}`);
        authorInput.value = "";
        advancedSearchDropdown.classList.remove("open");
      }
    });

    authorRow.appendChild(authorInput);
    authorRow.appendChild(authorAddBtn);
    authorSection.appendChild(authorRow);
    advancedMenu.appendChild(authorSection);

    advancedSearchDropdown.appendChild(advancedMenu);
    searchWrapper.appendChild(advancedSearchDropdown);

    bottomRow.appendChild(searchWrapper);

    // Sort controls
    const sortControls = document.createElement("div");
    sortControls.className = "level-browser-sort-controls";

    // Sort dropdown
    const sortDropdown = document.createElement("div");
    sortDropdown.className = "level-browser-sort-dropdown";

    const sortBtn = document.createElement("button");
    sortBtn.className = "level-browser-sort-btn";
    sortBtn.innerHTML = `<span class="sort-label">${this.i18n.t(
      "sort.label"
    )} ${this.i18n.t("sort.alphabetical")}</span>${DropdownIcon}`;
    sortBtn.addEventListener("click", () => {
      sortDropdown.classList.toggle("open");
    });
    this.sortBtn = sortBtn;
    sortDropdown.appendChild(sortBtn);

    const sortMenu = document.createElement("div");
    sortMenu.className = "level-browser-sort-menu";

    const sortOptions = [
      { value: "title", label: this.i18n.t("sort.alphabetical") },
      { value: "upvotes", label: this.i18n.t("sort.mostUpvoted") },
      { value: "downvotes", label: this.i18n.t("sort.mostDownvoted") },
      { value: "subscribers", label: this.i18n.t("sort.mostSubscribed") },
      { value: "rating", label: this.i18n.t("sort.highestRated") },
      { value: "updated", label: this.i18n.t("sort.recentlyUpdated") },
    ];

    sortOptions.forEach((opt) => {
      const item = document.createElement("button");
      item.className = "level-browser-sort-option";
      item.dataset.value = opt.value;
      item.textContent = opt.label;
      if (opt.value === this.sortBy) item.classList.add("active");
      item.addEventListener("click", () => {
        this.sortBy = opt.value;
        sortMenu
          .querySelectorAll(".level-browser-sort-option")
          .forEach((el) => el.classList.remove("active"));
        item.classList.add("active");
        this.updateSortButtonLabel();
        sortDropdown.classList.remove("open");
        this.renderItems();
      });
      sortMenu.appendChild(item);
    });

    sortDropdown.appendChild(sortMenu);
    sortControls.appendChild(sortDropdown);

    // Sort direction toggle
    const sortDirBtn = document.createElement("button");
    sortDirBtn.className = "level-browser-sort-dir-btn";
    sortDirBtn.innerHTML = this.sortReversed ? SortDescIcon : SortAscIcon;
    sortDirBtn.title = this.sortReversed
      ? this.i18n.t("sort.descending")
      : this.i18n.t("sort.ascending");
    sortDirBtn.addEventListener("click", () => {
      this.sortReversed = !this.sortReversed;
      sortDirBtn.innerHTML = this.sortReversed ? SortDescIcon : SortAscIcon;
      sortDirBtn.title = this.sortReversed
        ? this.i18n.t("sort.descending")
        : this.i18n.t("sort.ascending");
      this.renderItems();
    });
    this.sortDirBtn = sortDirBtn;
    sortControls.appendChild(sortDirBtn);

    bottomRow.appendChild(sortControls);
    header.appendChild(bottomRow);

    // Close dropdowns when clicking outside - store handler for cleanup
    this._dropdownClickOutsideHandler = (e) => {
      if (!sortDropdown.contains(e.target)) {
        sortDropdown.classList.remove("open");
      }
      if (!advancedSearchDropdown.contains(e.target)) {
        advancedSearchDropdown.classList.remove("open");
      }
    };
    document.addEventListener("pointerdown", this._dropdownClickOutsideHandler);

    return header;
  }

  /**
   * Create a filter section with buttons
   * @param {string} label
   * @param {Array<{label: string, filter: string}>} options
   * @returns {HTMLElement}
   */
  createFilterSection(label, options) {
    const section = document.createElement("div");
    section.className = "level-browser-filter-section";

    const labelEl = document.createElement("div");
    labelEl.className = "level-browser-filter-label";
    labelEl.textContent = label;
    section.appendChild(labelEl);

    const buttonsRow = document.createElement("div");
    buttonsRow.className = "level-browser-filter-buttons";

    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "level-browser-filter-btn";
      btn.textContent = opt.label;
      btn.addEventListener("click", () => {
        this.addFilterToSearch(opt.filter);
        // Close the dropdown
        const dropdown = btn.closest(".level-browser-advanced-dropdown");
        if (dropdown) dropdown.classList.remove("open");
      });
      buttonsRow.appendChild(btn);
    });

    section.appendChild(buttonsRow);
    return section;
  }

  /**
   * Add a filter to the search input
   * @param {string} filter
   */
  addFilterToSearch(filter) {
    const currentValue = this.searchInput.value.trim();
    // Check if this type of filter already exists and replace it
    const filterType = filter.split(":")[0];
    const regex = new RegExp(`${filterType}:\\S+`, "gi");

    let newValue;
    if (regex.test(currentValue)) {
      // Replace existing filter of same type
      newValue = currentValue.replace(regex, filter);
    } else {
      // Add new filter
      newValue = currentValue ? `${currentValue} ${filter}` : filter;
    }

    this.searchInput.value = newValue;
    this.searchQuery = newValue;
    this.parseSearchQuery();
    this.renderItems();
  }

  /**
   * Update the sort button label
   */
  updateSortButtonLabel() {
    if (!this.sortBtn) return;
    const labels = {
      title: this.i18n.t("sort.alphabetical"),
      upvotes: this.i18n.t("sort.mostUpvoted"),
      downvotes: this.i18n.t("sort.mostDownvoted"),
      subscribers: this.i18n.t("sort.mostSubscribed"),
      rating: this.i18n.t("sort.highestRated"),
      updated: this.i18n.t("sort.recentlyUpdated"),
    };
    this.sortBtn.innerHTML = `<span class="sort-label">${this.i18n.t(
      "sort.label"
    )} ${labels[this.sortBy]}</span>${DropdownIcon}`;
  }

  /**
   * Parse the search query for filters
   */
  parseSearchQuery() {
    const query = this.searchQuery;

    // Reset filters
    this.filters = {
      text: "",
      author: null,
      type: null,
      difficulty: null,
      state: null,
    };

    // Extract filters using regex
    let remainingText = query;

    // author:ID
    const authorMatch = query.match(/author:(\S+)/i);
    if (authorMatch) {
      this.filters.author = authorMatch[1];
      remainingText = remainingText.replace(authorMatch[0], "");
    }

    // type:single or type:pack
    const typeMatch = query.match(/type:(single|pack)/i);
    if (typeMatch) {
      this.filters.type = typeMatch[1].toLowerCase();
      remainingText = remainingText.replace(typeMatch[0], "");
    }

    // difficulty:N or difficulty:N-M
    const diffMatch = query.match(/difficulty:(\d+)(?:-(\d+))?/i);
    if (diffMatch) {
      const min = parseInt(diffMatch[1], 10);
      const max = diffMatch[2] ? parseInt(diffMatch[2], 10) : min;
      this.filters.difficulty = {
        min: Math.min(min, max),
        max: Math.max(min, max),
      };
      remainingText = remainingText.replace(diffMatch[0], "");
    }

    // state:installed/downloading/update/none
    const stateMatch = query.match(
      /state:(installed|downloading|update|none)/i
    );
    if (stateMatch) {
      this.filters.state = stateMatch[1].toLowerCase();
      remainingText = remainingText.replace(stateMatch[0], "");
    }

    // Remaining text is the search term
    this.filters.text = remainingText.trim().toLowerCase();
  }

  /**
   * Setup keyboard event handlers
   */
  setupKeyboardHandlers() {
    this._keyHandler = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        this.hide();
      }
    };
    document.addEventListener("keydown", this._keyHandler);

    // Block events from propagating to the game engine
    const eventsToBlock = [
      "mousedown",
      "mouseup",
      "click",
      "contextmenu",
      "wheel",
      "keydown",
      "keyup",
      "keypress",
    ];
    eventsToBlock.forEach((eventType) => {
      this.element?.addEventListener(eventType, (e) => e.stopPropagation(), {
        passive: false,
      });
    });
  }

  /**
   * Load workshop items
   * @param {boolean} [forceRefresh=false]
   */
  async loadItems(forceRefresh = false) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showLoading();

    try {
      // Debug mode: use fake items instead of real workshop items
      if (DEBUG_MODE) {
        console.log("[LevelBrowser] DEBUG MODE: Using fake items");
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading
        this.items = generateDebugItems();
        this.renderItems();
        return;
      }

      const workshopWrapper = globalThis.workshopWrapper;
      if (!workshopWrapper) {
        throw new Error("Workshop wrapper not available");
      }

      this.items = await workshopWrapper.getSubscribedWorkshopItems(
        forceRefresh
      );
      this.renderItems();
    } catch (error) {
      console.error("[LevelBrowser] Failed to load items:", error);
      this.showError(error.message || "Failed to load workshop items");
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Render the items grid
   */
  renderItems() {
    if (!this.contentArea) return;

    // Clear existing cards
    this.cardInstances.forEach((card) => card.destroy());
    this.cardInstances.clear();
    this.contentArea.innerHTML = "";

    // Filter items
    let filteredItems = this.filterItems(this.items);

    // Sort items
    filteredItems = this.sortItems(filteredItems);

    // Show empty state if no items
    if (filteredItems.length === 0) {
      this.showEmpty(
        this.searchQuery
          ? this.i18n.t("empty.noMatch")
          : this.i18n.t("empty.noSubscribed")
      );
      return;
    }

    // Create grid
    const grid = document.createElement("div");
    grid.className = "level-browser-grid";

    // Create cards
    filteredItems.forEach((item) => {
      const card = new LevelCard(item, {
        i18n: this.i18n,
        onPlay: (item) => this.handlePlayLevel(item),
        onOpenInSteam: (item) => this.handleOpenInSteam(item),
        onRefresh: (item) => this.handleRefreshItem(item),
        onDownload: (item) => this.handleDownloadItem(item),
        onOpenFolder: (item) => this.handleOpenFolder(item),
        onFilterByAuthor: (authorId) => this.handleFilterByAuthor(authorId),
      });
      this.cardInstances.set(item.publishedFileId, card);
      grid.appendChild(card.render());
    });

    // Add subtitle/count at the top of the content
    const subtitle = document.createElement("p");
    subtitle.className = "level-browser-subtitle";
    const total = this.items.length;
    const shown = filteredItems.length;
    subtitle.textContent = this.searchQuery
      ? this.i18n.t("search.showingResults", { shown, total })
      : total !== 1
      ? this.i18n.t("search.subscribedCountPlural", { count: total })
      : this.i18n.t("search.subscribedCount", { count: total });
    this.contentArea.appendChild(subtitle);

    this.contentArea.appendChild(grid);

    // Re-enable refresh button after rendering
    if (this.refreshBtn) {
      this.refreshBtn.disabled = false;
      this.refreshBtn.classList.remove("loading");
    }
  }

  /**
   * Filter items based on current filters
   * @param {WorkshopItem[]} items
   * @returns {WorkshopItem[]}
   */
  filterItems(items) {
    return items.filter((item) => {
      // Text search (title and description)
      if (this.filters.text) {
        const title = (item.title || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        if (
          !title.includes(this.filters.text) &&
          !desc.includes(this.filters.text)
        ) {
          return false;
        }
      }

      // Author filter
      if (this.filters.author) {
        const authorId = item.owner?.steamId64 || "";
        if (!authorId.includes(this.filters.author)) {
          return false;
        }
      }

      // Type filter (single or pack)
      if (this.filters.type) {
        const tags = item.tags || [];
        const isLevelPack = tags.includes("level_pack");
        if (this.filters.type === "pack" && !isLevelPack) return false;
        if (this.filters.type === "single" && isLevelPack) return false;
      }

      // Difficulty filter
      if (this.filters.difficulty) {
        const tags = item.tags || [];
        let difficulty = null;
        for (const tag of tags) {
          if (tag.startsWith("difficulty_")) {
            difficulty = parseInt(tag.replace("difficulty_", ""), 10);
            break;
          }
        }
        if (difficulty === null) return false; // No difficulty tag
        if (
          difficulty < this.filters.difficulty.min ||
          difficulty > this.filters.difficulty.max
        ) {
          return false;
        }
      }

      // State filter
      if (this.filters.state) {
        const itemState = item.state ?? 0;
        const isInstalled = (itemState & 4) !== 0;
        const isDownloading = (itemState & 16) !== 0;
        const isNeedsUpdate = (itemState & 8) !== 0;

        switch (this.filters.state) {
          case "installed":
            if (!isInstalled || isDownloading || isNeedsUpdate) return false;
            break;
          case "downloading":
            if (!isDownloading) return false;
            break;
          case "update":
            if (!isNeedsUpdate) return false;
            break;
          case "none":
            if (isInstalled || isDownloading) return false;
            break;
        }
      }

      return true;
    });
  }

  /**
   * Sort items based on current sort settings
   * @param {WorkshopItem[]} items
   * @returns {WorkshopItem[]}
   */
  sortItems(items) {
    const sorted = [...items].sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case "title":
          comparison = (a.title || "").localeCompare(b.title || "");
          break;
        case "upvotes":
          comparison = (b.numUpvotes || 0) - (a.numUpvotes || 0);
          break;
        case "downvotes":
          comparison = (b.numDownvotes || 0) - (a.numDownvotes || 0);
          break;
        case "subscribers":
          const subsA =
            a.statistics?.numSubscriptions ||
            a.statistics?.numUniqueSubscriptions ||
            0;
          const subsB =
            b.statistics?.numSubscriptions ||
            b.statistics?.numUniqueSubscriptions ||
            0;
          comparison = subsB - subsA;
          break;
        case "rating":
          const totalA = (a.numUpvotes || 0) + (a.numDownvotes || 0);
          const totalB = (b.numUpvotes || 0) + (b.numDownvotes || 0);
          const ratingA = totalA > 0 ? (a.numUpvotes || 0) / totalA : 0;
          const ratingB = totalB > 0 ? (b.numUpvotes || 0) / totalB : 0;
          comparison = ratingB - ratingA;
          break;
        case "updated":
          comparison =
            (b.timeUpdated || b.timeCreated || 0) -
            (a.timeUpdated || a.timeCreated || 0);
          break;
        default:
          comparison = 0;
      }

      return this.sortReversed ? -comparison : comparison;
    });

    return sorted;
  }

  /**
   * Show loading state
   */
  showLoading() {
    if (!this.contentArea) return;
    this.contentArea.innerHTML = "";

    const loading = document.createElement("div");
    loading.className = "level-browser-loading";

    const spinner = document.createElement("div");
    spinner.className = "level-browser-spinner";
    loading.appendChild(spinner);

    const text = document.createElement("p");
    text.textContent = this.i18n.t("loading.text");
    loading.appendChild(text);

    this.contentArea.appendChild(loading);

    // Disable refresh button
    if (this.refreshBtn) {
      this.refreshBtn.disabled = true;
      this.refreshBtn.classList.add("loading");
    }
  }

  /**
   * Show empty state
   * @param {string} message
   */
  showEmpty(message) {
    if (!this.contentArea) return;
    this.contentArea.innerHTML = "";

    const hasSearch = this.searchQuery && this.searchQuery.trim().length > 0;

    const empty = document.createElement("div");
    empty.className = "level-browser-empty";

    if (hasSearch) {
      empty.innerHTML = `
        <div class="empty-icon">${EmptyIcon}</div>
        <h3>${message}</h3>
        <p class="empty-hint">${this.i18n.t("empty.searchHint")}</p>
      `;
    } else {
      empty.innerHTML = `
        <div class="empty-icon">${EmptyIcon}</div>
        <h3>${message}</h3>
        <p class="empty-hint">${this.i18n.t("empty.subscribeHint")}</p>
      `;
    }

    // Add browse workshop button
    const browseBtn = document.createElement("button");
    browseBtn.className = "level-browser-browse-btn";
    browseBtn.innerHTML = hasSearch
      ? `${SteamIcon}<span>${this.i18n.t("empty.searchOnWorkshop")}</span>`
      : `${SteamIcon}<span>${this.i18n.t("empty.browseWorkshop")}</span>`;
    browseBtn.addEventListener("click", () =>
      this.openWorkshopPageWithSearch()
    );
    empty.appendChild(browseBtn);

    this.contentArea.appendChild(empty);

    // Re-enable refresh button
    if (this.refreshBtn) {
      this.refreshBtn.disabled = false;
      this.refreshBtn.classList.remove("loading");
    }
  }

  /**
   * Open the Steam Workshop page with optional search query and filters
   * Uses author profile URL if author filter is set (without text search)
   * Otherwise uses the workshop browse URL with all applicable filters
   */
  openWorkshopPageWithSearch() {
    const workshopWrapper = globalThis.workshopWrapper;
    const appId = workshopWrapper?.pipelab?._steam_AppId;
    if (!workshopWrapper || !appId) return;

    let url;

    // If author filter is set and no text search, use the author's workshop files page
    // (Author search doesn't support text search, so if both are present, ignore author)
    if (this.filters.author && !this.filters.text) {
      url = `https://steamcommunity.com/profiles/${this.filters.author}/myworkshopfiles?browsefilter=myfiles&sortmethod=creationorder&section=items&appid=${appId}`;

      // Add required tags
      url += `&requiredtags%5B%5D=level`;

      // Add type filter
      if (this.filters.type === "pack") {
        url += `&requiredtags%5B%5D=level_pack`;
      } else if (this.filters.type === "single") {
        url += `&requiredtags%5B%5D=single_level`;
      }

      // Add difficulty filter (use min value if range is set)
      if (this.filters.difficulty) {
        url += `&requiredtags%5B%5D=difficulty_${this.filters.difficulty.min}`;
      }
    } else {
      // Use the general workshop browse URL
      url = `https://steamcommunity.com/workshop/browse/?appid=${appId}&browsesort=trend&section=readytouseitems`;

      // Add search text if available
      if (this.filters.text) {
        url += `&searchtext=${encodeURIComponent(this.filters.text)}`;
      }

      // Add type filter as required tag
      if (this.filters.type === "pack") {
        url += `&requiredtags%5B%5D=level_pack`;
      } else if (this.filters.type === "single") {
        url += `&requiredtags%5B%5D=single_level`;
      }

      // Add difficulty filter (use min value if range is set)
      if (this.filters.difficulty) {
        url += `&requiredtags%5B%5D=difficulty_${this.filters.difficulty.min}`;
      }
    }

    workshopWrapper.openWebPage(url);
  }

  /**
   * Show error state
   * @param {string} message
   */
  showError(message) {
    if (!this.contentArea) return;
    this.contentArea.innerHTML = "";

    const error = document.createElement("div");
    error.className = "level-browser-error";
    error.innerHTML = `
      <div class="error-icon">${ErrorIcon}</div>
      <h3>${this.i18n.t("error.title")}</h3>
      <p>${message}</p>
      <button class="level-browser-retry-btn">${this.i18n.t(
        "error.tryAgain"
      )}</button>
    `;

    const retryBtn = error.querySelector(".level-browser-retry-btn");
    retryBtn?.addEventListener("click", () => this.loadItems(true));

    this.contentArea.appendChild(error);

    // Re-enable refresh button
    if (this.refreshBtn) {
      this.refreshBtn.disabled = false;
      this.refreshBtn.classList.remove("loading");
    }
  }

  /**
   * Handle playing a level
   * @param {WorkshopItem} item
   */
  async handlePlayLevel(item) {
    const itemState = item.state ?? 0;
    const isInstalled = (itemState & 4) !== 0; // k_EItemStateInstalled
    const isDownloading = (itemState & 16) !== 0; // k_EItemStateDownloading

    // If already downloading, just refresh to show progress
    if (isDownloading) {
      console.log("[LevelBrowser] Item is downloading, refreshing...");
      await this.handleRefreshItem(item);
      return;
    }

    // If not installed, trigger download
    if (!isInstalled) {
      console.log("[LevelBrowser] Item not installed, triggering download...");
      await this.handleDownloadItem(item);
      return;
    }

    // Item is installed, read the content.utrsproj and play
    console.log("[LevelBrowser] Loading level content:", item.title);

    const workshopWrapper = globalThis.workshopWrapper;
    if (!workshopWrapper) {
      console.error("[LevelBrowser] Workshop wrapper not available");
      return;
    }

    // Get the install folder path
    const installFolder = item.installInfo?.folder;
    if (!installFolder) {
      console.error("[LevelBrowser] No install folder found for item");
      return;
    }

    try {
      // Read content.utrsproj from the content subfolder
      const contentPath = `${installFolder}/content.utrsproj`;
      const { content, error } = await workshopWrapper.readTextFile(
        contentPath
      );

      if (error || !content) {
        console.error("[LevelBrowser] Failed to read content.utrsproj:", error);
        return;
      }

      // Parse the project data
      const projectData = JSON.parse(content);
      console.log(
        "[LevelBrowser] Loaded project data:",
        projectData.projectName
      );

      // Start the level. The callback returns true once the level loader has
      // requested its layout; only then close the browser, and close it
      // without notifying, since the level's own layout change is pending.
      const started = await this.onPlayLevel?.(item, projectData);
      if (started !== true) {
        this.showError(this.i18n.t("error.playFailed"));
        return;
      }

      this.hide({ notifyClose: false });
    } catch (error) {
      console.error("[LevelBrowser] Error loading level content:", error);
      this.showError(this.i18n.t("error.playFailed"));
    }
  }

  /**
   * Handle downloading/installing a workshop item
   * @param {WorkshopItem} item
   */
  async handleDownloadItem(item) {
    const workshopWrapper = globalThis.workshopWrapper;
    if (!workshopWrapper) {
      console.error("[LevelBrowser] Workshop wrapper not available");
      return;
    }

    try {
      // Trigger the download
      const result = await workshopWrapper._pipelab_DownloadWorkshopItem(
        item.publishedFileId,
        true // high priority
      );

      if (!result.success) {
        console.error("[LevelBrowser] Failed to start download:", result.error);
      }

      // Refresh the item to get updated state (should show downloading)
      await this.handleRefreshItem(item);
    } catch (error) {
      console.error("[LevelBrowser] Error downloading item:", error);
    }
  }

  /**
   * Handle opening item in Steam
   * @param {WorkshopItem} item
   */
  handleOpenInSteam(item) {
    const workshopWrapper = globalThis.workshopWrapper;
    if (workshopWrapper) {
      workshopWrapper.openItemUrl(item.publishedFileId);
    } else {
      // Fallback to opening in browser
      window.open(
        `https://steamcommunity.com/sharedfiles/filedetails/?id=${item.publishedFileId}`,
        "_blank"
      );
    }
  }

  /**
   * Handle opening the install folder for an item
   * @param {WorkshopItem} item
   */
  async handleOpenFolder(item) {
    console.log("[LevelBrowser] handleOpenFolder called", item);

    const workshopWrapper = globalThis.workshopWrapper;
    if (!workshopWrapper) {
      console.error("[LevelBrowser] Workshop wrapper not available");
      return;
    }

    const installFolder = item.installInfo?.folder;
    console.log("[LevelBrowser] Install folder:", installFolder);

    if (!installFolder) {
      console.error("[LevelBrowser] No install folder found for item");
      return;
    }

    try {
      const result = await workshopWrapper.pipelab_ExplorerOpen(
        installFolder + "/content.utrsproj"
      );
      console.log("[LevelBrowser] Explorer open result:", result);
      if (!result.success) {
        console.error("[LevelBrowser] Failed to open folder:", result.error);
      }
    } catch (error) {
      console.error("[LevelBrowser] Error opening folder:", error);
    }
  }

  /**
   * Open the Steam Workshop page for the game
   */
  openWorkshopPage() {
    const workshopWrapper = globalThis.workshopWrapper;
    const appId = workshopWrapper?.pipelab?._steam_AppId;
    if (workshopWrapper && appId) {
      workshopWrapper.openWorkshopPage(appId);
    }
  }

  /**
   * Handle refreshing a single item
   * @param {WorkshopItem} item
   */
  async handleRefreshItem(item) {
    const workshopWrapper = globalThis.workshopWrapper;
    if (!workshopWrapper) return;

    try {
      const updatedItem = await workshopWrapper.getItemInfo(
        item.publishedFileId,
        true
      );
      if (updatedItem) {
        // Update in our items array
        const index = this.items.findIndex(
          (i) => i.publishedFileId === item.publishedFileId
        );
        if (index !== -1) {
          this.items[index] = updatedItem;
        }

        // Update the card
        const card = this.cardInstances.get(item.publishedFileId);
        if (card) {
          card.update(updatedItem);
        }
      }
    } catch (error) {
      console.error("[LevelBrowser] Failed to refresh item:", error);
    }
  }

  /**
   * Handle filtering by author
   * @param {string} authorId
   */
  handleFilterByAuthor(authorId) {
    this.addFilterToSearch(`author:${authorId}`);
  }

  /**
   * Destroy the UI
   */
  destroyUI() {
    // Remove keyboard handler
    if (this._keyHandler) {
      document.removeEventListener("keydown", this._keyHandler);
      this._keyHandler = null;
    }

    // Remove dropdown click outside handler
    if (this._dropdownClickOutsideHandler) {
      document.removeEventListener(
        "pointerdown",
        this._dropdownClickOutsideHandler
      );
      this._dropdownClickOutsideHandler = null;
    }

    // Destroy cards
    this.cardInstances.forEach((card) => card.destroy());
    this.cardInstances.clear();

    // Remove elements
    if (this.backdrop && this.backdrop.parentNode) {
      this.backdrop.parentNode.removeChild(this.backdrop);
    }

    this.element = null;
    this.backdrop = null;
    this.contentArea = null;
    this.searchInput = null;
    this.refreshBtn = null;
  }

  /**
   * Destroy the browser completely
   */
  destroy() {
    // Called when the levelBrowser layout ends; the layout change that ended
    // it is already decided, so never queue another one from here.
    this._clearHideTimer();
    this.destroyUI();
    this.isVisible = false;
    removeLevelCardStyles();
    this.removeStyles();
  }

  /**
   * Apply browser styles
   */
  applyStyles() {
    if (document.querySelector("#level-browser-styles")) return;

    const style = document.createElement("style");
    style.id = "level-browser-styles";
    style.textContent = `
      /* Level Browser Styles */
      .level-browser-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        z-index: 2000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .level-browser-backdrop.visible {
        opacity: 1;
        visibility: visible;
      }

      .level-browser {
        background: ${Theme.sidebarBackground};
        border: none;
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: scale(0.98);
        opacity: 0;
        transition: transform 0.15s ease, opacity 0.15s ease;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .level-browser.visible {
        transform: scale(1);
        opacity: 1;
      }

      /* Header */
      .level-browser-header {
        padding: 16px 20px;
        background: ${Theme.componentBackground};
        border-bottom: 1px solid ${Theme.borderPrimary};
        display: flex;
        flex-direction: column;
        gap: 12px;
        flex-shrink: 0;
      }

      .level-browser-header-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .level-browser-header-bottom {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .level-browser-title-section {
        flex: 1;
        min-width: 0;
      }

      .level-browser-title {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 600;
        color: ${Theme.textPrimary};
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .level-browser-title svg {
        width: 24px;
        height: 24px;
        color: ${Theme.primary};
      }

      .level-browser-subtitle {
        margin: 0 0 16px 0;
        font-size: 0.85rem;
        color: ${Theme.textSecondary};
      }

      .level-browser-main-controls {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      /* Search */
      .level-browser-search {
        position: relative;
        display: flex;
        align-items: center;
        flex: 1;
      }

      .level-browser-search > svg {
        position: absolute;
        left: 12px;
        width: 16px;
        height: 16px;
        color: ${Theme.textMuted};
        pointer-events: none;
      }

      .level-browser-search-input {
        width: 100%;
        padding: 9px 40px 9px 38px;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderPrimary};
        color: ${Theme.textPrimary};
        font-size: 0.85rem;
        font-family: inherit;
        transition: all 0.15s ease;
      }

      .level-browser-search-input:focus {
        outline: none;
        border-color: ${Theme.primary};
      }

      .level-browser-search-input::placeholder {
        color: ${Theme.textMuted};
        font-size: 0.8rem;
      }

      /* Advanced Search Dropdown */
      .level-browser-advanced-dropdown {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1000;
      }

      .level-browser-advanced-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        margin-right: 4px;
        background: transparent;
        border: none;
        color: ${Theme.textMuted};
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .level-browser-advanced-btn:hover {
        color: ${Theme.textPrimary};
      }

      .level-browser-advanced-dropdown.open .level-browser-advanced-btn {
        color: ${Theme.primary};
      }

      .level-browser-advanced-btn svg {
        width: 18px;
        height: 18px;
      }

      .level-browser-advanced-menu {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        min-width: 260px;
        background: ${Theme.componentBackground};
        border: 1px solid ${Theme.borderPrimary};
        padding: 12px;
        display: none;
        flex-direction: column;
        gap: 14px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .level-browser-advanced-dropdown.open .level-browser-advanced-menu {
        display: flex;
      }

      .level-browser-filter-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .level-browser-filter-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: ${Theme.textSecondary};
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .level-browser-filter-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .level-browser-filter-btn {
        padding: 6px 10px;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderPrimary};
        color: ${Theme.textPrimary};
        font-size: 0.8rem;
        font-family: inherit;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .level-browser-filter-btn:hover {
        background: ${Theme.componentHoverBackground};
        border-color: ${Theme.primary};
      }

      .level-browser-filter-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .level-browser-filter-row.difficulty {
        display: grid;
        grid-template-columns: 1fr auto 1fr auto;
        gap: 8px;
        align-items: center;
      }

      .level-browser-filter-input {
        padding: 6px 8px;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderPrimary};
        color: ${Theme.textPrimary};
        font-size: 0.8rem;
        font-family: inherit;
        width: 50px;
      }

      .level-browser-filter-input.wide {
        flex: 1;
        width: auto;
      }

      .level-browser-filter-input:focus {
        outline: none;
        border-color: ${Theme.primary};
      }

      .level-browser-filter-input::placeholder {
        color: ${Theme.textMuted};
      }

      .level-browser-filter-separator {
        color: ${Theme.textMuted};
        font-size: 0.8rem;
      }

      .level-browser-filter-add {
        padding: 6px 12px;
        background: ${Theme.primary};
        border: 1px solid ${Theme.primary};
        color: white;
        font-size: 0.8rem;
        font-family: inherit;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .level-browser-filter-add:hover {
        background: ${Theme.primaryHover};
      }

      /* Sort Controls */
      .level-browser-sort-controls {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .level-browser-sort-dropdown {
        position: relative;
      }

      .level-browser-sort-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 9px 12px;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderPrimary};
        color: ${Theme.textPrimary};
        font-size: 0.85rem;
        font-family: inherit;
        cursor: pointer;
        transition: all 0.15s ease;
        white-space: nowrap;
      }

      .level-browser-sort-btn:hover {
        background: ${Theme.componentHoverBackground};
        border-color: ${Theme.primary};
      }

      .level-browser-sort-btn svg {
        width: 14px;
        height: 14px;
        color: ${Theme.textSecondary};
        transition: transform 0.15s ease;
      }

      .level-browser-sort-dropdown.open .level-browser-sort-btn svg {
        transform: rotate(180deg);
      }

      .level-browser-sort-menu {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 4px;
        background: ${Theme.componentBackground};
        border: 1px solid ${Theme.borderPrimary};
        min-width: 180px;
        z-index: 100;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-8px);
        transition: all 0.15s ease;
      }

      .level-browser-sort-dropdown.open .level-browser-sort-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .level-browser-sort-option {
        display: block;
        width: 100%;
        padding: 10px 14px;
        background: none;
        border: none;
        color: ${Theme.textSecondary};
        font-size: 0.85rem;
        font-family: inherit;
        text-align: left;
        cursor: pointer;
        transition: all 0.1s ease;
      }

      .level-browser-sort-option:hover {
        background: ${Theme.componentHoverBackground};
        color: ${Theme.textPrimary};
      }

      .level-browser-sort-option.active {
        color: ${Theme.primary};
        background: rgba(74, 158, 255, 0.1);
      }

      .level-browser-sort-dir-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderPrimary};
        color: ${Theme.textSecondary};
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .level-browser-sort-dir-btn:hover {
        background: ${Theme.componentHoverBackground};
        border-color: ${Theme.primary};
        color: ${Theme.textPrimary};
      }

      .level-browser-sort-dir-btn svg {
        width: 18px;
        height: 18px;
      }

      /* Buttons */
      .level-browser-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderPrimary};
        color: ${Theme.textPrimary};
        font-size: 0.9rem;
        font-weight: 500;
        font-family: inherit;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .level-browser-btn:hover {
        background: ${Theme.componentHoverBackground};
        border-color: ${Theme.primary};
      }

      .level-browser-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .level-browser-btn.loading svg {
        animation: spin 1s linear infinite;
      }

      .level-browser-btn svg {
        width: 18px;
        height: 18px;
      }

      .level-browser-btn.close {
        padding: 10px;
        color: ${Theme.textSecondary};
      }

      .level-browser-btn.close:hover {
        background: rgba(255, 100, 100, 0.15);
        border-color: #ff6464;
        color: #ff6464;
      }

      .level-browser-btn.steam {
        color: ${Theme.textPrimary};
      }

      .level-browser-btn.steam:hover {
        background: #1b2838;
        border-color: #66c0f4;
        color: #66c0f4;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* Content */
      .level-browser-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }

      .level-browser-content::-webkit-scrollbar {
        width: 12px;
      }

      .level-browser-content::-webkit-scrollbar-track {
        background: ${Theme.scrollbarTrack};
      }

      .level-browser-content::-webkit-scrollbar-thumb {
        background: ${Theme.scrollbarThumb};
        border: 3px solid ${Theme.scrollbarTrack};
      }

      .level-browser-content::-webkit-scrollbar-thumb:hover {
        background: ${Theme.scrollbarThumbHover};
      }

      /* Grid */
      .level-browser-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
      }

      /* Loading State */
      .level-browser-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 300px;
        gap: 16px;
        color: ${Theme.textSecondary};
      }

      .level-browser-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid ${Theme.borderPrimary};
        border-top-color: ${Theme.primary};
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      /* Empty State */
      .level-browser-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 300px;
        text-align: center;
        color: ${Theme.textSecondary};
      }

      .level-browser-empty .empty-icon {
        margin-bottom: 16px;
      }

      .level-browser-empty .empty-icon svg {
        width: 56px;
        height: 56px;
        color: ${Theme.textMuted};
        opacity: 0.5;
      }

      .level-browser-empty h3 {
        margin: 0 0 8px 0;
        font-size: 1.1rem;
        color: ${Theme.textPrimary};
      }

      .level-browser-empty p {
        margin: 0;
        font-size: 0.9rem;
      }

      .level-browser-empty .empty-hint {
        margin-top: 16px;
        font-size: 0.8rem;
        color: ${Theme.textMuted};
      }

      /* Error State */
      .level-browser-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 300px;
        text-align: center;
        color: ${Theme.textSecondary};
      }

      .level-browser-error .error-icon {
        margin-bottom: 16px;
      }

      .level-browser-error .error-icon svg {
        width: 56px;
        height: 56px;
        color: ${Theme.warning};
      }

      .level-browser-error h3 {
        margin: 0 0 8px 0;
        font-size: 1.1rem;
        color: ${Theme.textPrimary};
      }

      .level-browser-error p {
        margin: 0;
        font-size: 0.9rem;
      }

      .level-browser-retry-btn,
      .level-browser-browse-btn {
        margin-top: 20px;
        padding: 10px 24px;
        background: ${Theme.primary};
        border: 1px solid ${Theme.primary};
        color: white;
        font-size: 0.9rem;
        font-weight: 500;
        font-family: inherit;
        cursor: pointer;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .level-browser-retry-btn:hover,
      .level-browser-browse-btn:hover {
        background: ${Theme.primaryHover};
      }

      .level-browser-browse-btn {
        background: #1b2838;
        border-color: #66c0f4;
        color: #66c0f4;
      }

      .level-browser-browse-btn:hover {
        background: #2a475e;
      }

      .level-browser-browse-btn svg {
        width: 18px;
        height: 18px;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .level-browser-header {
          padding: 12px 16px;
          gap: 10px;
        }

        .level-browser-header-top {
          flex-direction: column;
          align-items: stretch;
          gap: 10px;
        }

        .level-browser-header-bottom {
          flex-direction: column;
          gap: 8px;
        }

        .level-browser-main-controls {
          justify-content: flex-end;
        }

        .level-browser-sort-controls {
          width: 100%;
        }

        .level-browser-sort-dropdown {
          flex: 1;
        }

        .level-browser-sort-btn {
          width: 100%;
          justify-content: space-between;
        }

        .level-browser-content {
          padding: 16px;
        }

        .level-browser-grid {
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 14px;
        }
      }

      @media (max-width: 480px) {
        .level-browser-grid {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Remove browser styles
   */
  removeStyles() {
    const style = document.querySelector("#level-browser-styles");
    if (style) style.remove();
  }
}

// Singleton instance
let levelBrowserInstance = null;

/**
 * Initialize and show the level browser
 * @param {Object} options
 * @returns {LevelBrowser}
 */
export function initLevelBrowser(options = {}) {
  if (!levelBrowserInstance) {
    levelBrowserInstance = new LevelBrowser(options);
  }
  levelBrowserInstance.show();
  return levelBrowserInstance;
}

/**
 * Release/destroy the level browser
 */
export function releaseLevelBrowser() {
  if (levelBrowserInstance) {
    levelBrowserInstance.destroy();
    levelBrowserInstance = null;
  }
}
