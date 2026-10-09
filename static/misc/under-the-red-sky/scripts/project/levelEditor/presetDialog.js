// Preset Selection Dialog for Level Editor
// Displays object presets in a bottom-sliding dialog with category tabs

import { getPresetCategories, getPresetsForCategory } from "./objectPresets.js";
import { Theme } from "./inspectorUI.js";
import * as IconList from "./iconList.js";
import { getObjectTypeName, types } from "./objectTypeDefinitions.js";

export class PresetDialog {
  constructor(container = document.body, options = {}) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;

    this.options = {
      height: options.height || "90%",
      width: options.width || "600px",
      animationDuration: options.animationDuration || 300,
      ...options,
    };

    this.dialog = null;
    this.overlay = null;
    this.isVisible = false;
    this.selectedCategory = null;
    this.categories = [];
    this.presets = {};

    // Event callbacks
    this.onPresetSelect = options.onPresetSelect || null;
    this.onClose = options.onClose || null;

    // UI elements
    this.tabContainer = null;
    this.contentContainer = null;
    this.searchInput = null;
    this.searchQuery = "";
    this.visiblePresets = [];

    this.init();
  }

  init() {
    this.loadCategories();
    this.createDialog();
    this.applyStyles();
    this.setupEventListeners();
    this.hide(); // Start hidden
  }

  loadCategories() {
    this.categories = getPresetCategories();

    // Load presets for each category
    this.categories.forEach((category) => {
      this.presets[category.id] = getPresetsForCategory(category.id);
    });

    // Load and add custom structures to the customStructures category
    this.loadCustomStructures();

    // Set default selected category to first available
    if (this.categories.length > 0) {
      this.selectedCategory = this.categories[0].id;
    }
  }

  loadCustomStructures() {
    const projectManager = globalThis._editorScope?.projectManager;
    let customStructures = [];

    if (projectManager && projectManager.hasProjectLoaded()) {
      // Use project data
      const sharedData = projectManager.getSharedData();
      customStructures = sharedData.customStructures || [];
    } else {
      // No project loaded - no custom structures available
      customStructures = [];
    }

    this.presets.customStructures = [];

    if (customStructures.length > 0) {
      // Sort by color (hex value) and then by name
      customStructures.sort((a, b) => {
        // First sort by color (convert hex to number for comparison)
        const colorA = parseInt(a.color.replace("#", ""), 16);
        const colorB = parseInt(b.color.replace("#", ""), 16);

        if (colorA !== colorB) {
          return colorA - colorB;
        }

        // Then sort by name
        return a.name.localeCompare(b.name);
      });

      // Add to presets
      this.presets.customStructures.push(...customStructures);
    }
  }

  createDialog() {
    // Create overlay
    this.overlay = document.createElement("div");
    this.overlay.className = "preset-dialog-overlay";

    // Create main dialog
    this.dialog = document.createElement("div");
    this.dialog.className = "preset-dialog";

    // Close button (placed in header)
    const closeButton = document.createElement("button");
    closeButton.className = "preset-dialog-close";
    closeButton.innerHTML = "✕";
    closeButton.addEventListener("click", () => this.hide());

    // Dialog header
    const header = document.createElement("div");
    header.className = "preset-dialog-header";

    // Title
    const title = document.createElement("h3");
    title.className = "preset-dialog-title";
    title.textContent = "Select Object Preset";
    header.appendChild(title);

    // Header right-side buttons
    const headerActions = document.createElement("div");
    headerActions.className = "preset-dialog-header-actions";

    // Clear selection button
    const clearPresetButton = document.createElement("button");
    clearPresetButton.className = "preset-dialog-clear";
    clearPresetButton.textContent = "Clear";
    clearPresetButton.addEventListener("click", () => {
      if (this.onPresetSelect) {
        this.onPresetSelect(null);
      }
      this.hide();
    });
    headerActions.appendChild(clearPresetButton);

    // Add close button into the header (flex right)
    headerActions.appendChild(closeButton);
    header.appendChild(headerActions);

    this.dialog.appendChild(header);

    // Search section (separate from header)
    const searchSection = document.createElement("div");
    searchSection.className = "preset-search-section";

    const searchContainer = document.createElement("div");
    searchContainer.className = "preset-search-container";

    this.searchInput = document.createElement("input");
    this.searchInput.type = "text";
    this.searchInput.className = "preset-search-input";
    this.searchInput.placeholder = "Search presets...";

    const searchIcon = document.createElement("div");
    searchIcon.className = "preset-search-icon";
    searchIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14Z"/>
    </svg>`;

    // Clear search button
    const clearButton = document.createElement("button");
    clearButton.className = "preset-search-clear";
    clearButton.innerHTML = "×";
    clearButton.style.display = "none";
    clearButton.addEventListener("click", () => {
      this.searchInput.value = "";
      this.searchQuery = "";
      this.filterPresets();
      clearButton.style.display = "none";
      this.searchInput.focus();
    });

    // Show/hide clear button based on input
    this.searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value;
      clearButton.style.display = this.searchQuery ? "block" : "none";
      this.filterPresets();
      this.updateVisiblePresets();
    });

    searchContainer.appendChild(this.searchInput);
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(clearButton);
    searchSection.appendChild(searchContainer);
    this.dialog.appendChild(searchSection);

    // Category tabs
    this.tabContainer = document.createElement("div");
    this.tabContainer.className = "preset-tabs";
    this.createCategoryTabs();
    this.dialog.appendChild(this.tabContainer);

    // Content area
    this.contentContainer = document.createElement("div");
    this.contentContainer.className = "preset-content";
    this.dialog.appendChild(this.contentContainer);

    // Add dialog to overlay and container
    this.overlay.appendChild(this.dialog);
    this.container.appendChild(this.overlay);

    // Capture all events to prevent propagation to the page
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

          // Handle specific events
          if (eventType === "keydown") {
            this.handleKeydown(e);
          }
        },
        { passive: false }
      );
    });

    // Load initial content
    this.updateContent();
  }

  createCategoryTabs() {
    this.tabContainer.innerHTML = "";

    this.categories.forEach((category) => {
      const tab = document.createElement("button");
      tab.className = "preset-tab";
      tab.dataset.categoryId = category.id;
      tab.style.setProperty("--category-color", category.color);

      // Tab icon
      const iconContainer = document.createElement("div");
      iconContainer.className = "preset-tab-icon";
      iconContainer.innerHTML = IconList[category.icon];
      iconContainer.style.color = "var(--category-color)";
      tab.appendChild(iconContainer);

      // Tab label
      const label = document.createElement("div");
      label.className = "preset-tab-label";
      label.textContent = category.name;
      tab.appendChild(label);

      // Click handler
      tab.addEventListener("click", () => {
        this.selectCategory(category.id);
      });

      // Mark as selected if this is the current category
      if (category.id === this.selectedCategory) {
        tab.classList.add("selected");
      }

      this.tabContainer.appendChild(tab);
    });
  }

  selectCategory(categoryId) {
    if (this.selectedCategory === categoryId) return;

    this.selectedCategory = categoryId;

    // Update tab selection
    this.tabContainer.querySelectorAll(".preset-tab").forEach((tab) => {
      tab.classList.toggle("selected", tab.dataset.categoryId === categoryId);
    });

    // Scroll to the category section
    this.scrollToCategory(categoryId);
  }

  updateContent() {
    this.contentContainer.innerHTML = "";

    // If there's a search query, show filtered results
    if (this.searchQuery) {
      this.showFilteredResults();
      return;
    }

    // Show all categories as sections
    this.categories.forEach((category) => {
      const categoryPresets = this.presets[category.id] || [];
      if (categoryPresets.length === 0) return;

      // Create category section
      const categorySection = document.createElement("div");
      categorySection.className = "preset-category-section";
      categorySection.dataset.categoryId = category.id;
      categorySection.style.setProperty("--category-color", category.color);

      // Category header
      const categoryHeader = document.createElement("div");
      categoryHeader.className = "preset-category-header";

      const categoryIcon = document.createElement("div");
      categoryIcon.className = "preset-category-icon";
      categoryIcon.innerHTML = IconList[category.icon];
      categoryIcon.style.color = category.color;

      const categoryTitle = document.createElement("h4");
      categoryTitle.className = "preset-category-title";
      categoryTitle.textContent = category.name;

      const categoryCount = document.createElement("span");
      categoryCount.className = "preset-category-count";
      categoryCount.textContent = `(${categoryPresets.length})`;

      categoryHeader.appendChild(categoryIcon);
      categoryHeader.appendChild(categoryTitle);
      categoryHeader.appendChild(categoryCount);
      categorySection.appendChild(categoryHeader);

      // Category description
      const categoryDesc = document.createElement("p");
      categoryDesc.className = "preset-category-description";
      categoryDesc.textContent = category.description;
      categorySection.appendChild(categoryDesc);

      // Create preset grid for this category
      const presetGrid = document.createElement("div");
      presetGrid.className = "preset-grid";

      categoryPresets.forEach((preset) => {
        const presetCard = this.createPresetCard(preset);
        presetGrid.appendChild(presetCard);
      });

      categorySection.appendChild(presetGrid);
      this.contentContainer.appendChild(categorySection);
    });

    // Apply current filter if there is one
    if (this.searchQuery) {
      this.filterPresets();
    } else {
      // Ensure empty state is hidden when not searching
      this.hideEmptyState();
    }

    this.updateVisiblePresets();
  }

  updateVisiblePresets() {
    this.visiblePresets = Array.from(
      this.contentContainer.querySelectorAll(
        '.preset-card:not([style*="display: none"])'
      )
    );
  }

  handleKeydown(e) {
    const focusedElement = document.activeElement;
    const isPresetCard =
      focusedElement && focusedElement.classList.contains("preset-card");

    switch (e.key) {
      case "Tab":
        if (e.target === this.searchInput) {
          if (!e.shiftKey) {
            // Tab from search input to first preset
            e.preventDefault();
            this.focusFirstPreset();
          } else {
            // Shift+Tab from search input to last preset of last category
            e.preventDefault();
            this.focusLastPresetFromLastCategory();
          }
        } else if (isPresetCard) {
          if (!e.shiftKey) {
            // Tab from preset card to next category
            e.preventDefault();
            this.focusFirstPresetFromNextCategory();
          } else {
            // Shift+Tab from preset card to previous category
            e.preventDefault();
            this.focusFirstPresetFromPreviousCategory();
          }
        }
        break;

      case "ArrowDown":
        if (isPresetCard) {
          e.preventDefault();
          this.moveFocusGrid("down");
        }
        break;

      case "ArrowUp":
        if (isPresetCard) {
          e.preventDefault();
          this.moveFocusGrid("up");
        }
        break;

      case "ArrowRight":
        if (isPresetCard) {
          e.preventDefault();
          this.moveFocusGrid("right");
        }
        break;

      case "ArrowLeft":
        if (isPresetCard) {
          e.preventDefault();
          this.moveFocusGrid("left");
        }
        break;

      case "Enter":
      case " ":
        if (isPresetCard) {
          e.preventDefault();
          this.selectFocusedPreset();
        }
        break;

      case "Escape":
        if (isPresetCard) {
          e.preventDefault();
          this.searchInput.focus();
        }
        break;
    }
  }

  focusFirstPreset() {
    if (this.visiblePresets.length > 0) {
      this.visiblePresets[0].focus();
    }
  }

  focusFirstPresetFromNextCategory() {
    const focusedElement = document.activeElement;

    // If no element is focused or it's not a preset card, focus the first preset
    if (!focusedElement || !focusedElement.classList.contains("preset-card")) {
      this.focusFirstPreset();
      return;
    }

    // Find the category of the currently focused element
    const currentCategory = focusedElement.closest(".preset-category-section");
    if (!currentCategory) {
      this.focusFirstPreset();
      return;
    }

    const currentCategoryId = currentCategory.dataset.categoryId;
    const currentCategoryIndex = this.categories.findIndex(
      (category) => category.id === currentCategoryId
    );

    // Check if we're at the last category
    if (currentCategoryIndex === this.categories.length - 1) {
      // If we're at the last category, go back to search input
      this.searchInput.focus();
      return;
    }

    // Find the next category
    const nextCategoryIndex = currentCategoryIndex + 1;
    const nextCategoryId = this.categories[nextCategoryIndex].id;

    // Find the first visible preset in the next category
    const nextCategorySection = this.contentContainer.querySelector(
      `.preset-category-section[data-category-id="${nextCategoryId}"]`
    );
    if (nextCategorySection) {
      const firstCard = nextCategorySection.querySelector(
        '.preset-card:not([style*="display: none"])'
      );
      if (firstCard) {
        firstCard.focus();
      }
    }
  }

  focusFirstPresetFromPreviousCategory() {
    const focusedElement = document.activeElement;

    // If no element is focused or it's not a preset card, focus the search input
    if (!focusedElement || !focusedElement.classList.contains("preset-card")) {
      this.searchInput.focus();
      return;
    }

    // Find the category of the currently focused element
    const currentCategory = focusedElement.closest(".preset-category-section");
    if (!currentCategory) {
      this.searchInput.focus();
      return;
    }

    const currentCategoryId = currentCategory.dataset.categoryId;
    const currentCategoryIndex = this.categories.findIndex(
      (category) => category.id === currentCategoryId
    );

    // Find the previous category
    const previousCategoryIndex =
      currentCategoryIndex === 0
        ? this.categories.length - 1
        : currentCategoryIndex - 1;
    const previousCategoryId = this.categories[previousCategoryIndex].id;

    // Find the first visible preset in the previous category
    const previousCategorySection = this.contentContainer.querySelector(
      `.preset-category-section[data-category-id="${previousCategoryId}"]`
    );
    if (previousCategorySection) {
      const firstCard = previousCategorySection.querySelector(
        '.preset-card:not([style*="display: none"])'
      );
      if (firstCard) {
        firstCard.focus();
      }
    }
  }

  focusLastPresetFromLastCategory() {
    // Find the last category
    const lastCategory = this.categories[this.categories.length - 1];
    const lastCategoryId = lastCategory.id;

    // Find the last visible preset in the last category
    const lastCategorySection = this.contentContainer.querySelector(
      `.preset-category-section[data-category-id="${lastCategoryId}"]`
    );
    if (lastCategorySection) {
      const visibleCards = lastCategorySection.querySelectorAll(
        '.preset-card:not([style*="display: none"])'
      );
      if (visibleCards.length > 0) {
        const lastCard = visibleCards[visibleCards.length - 1];
        lastCard.focus();
      }
    }
  }

  moveFocusGrid(direction) {
    const focusedElement = document.activeElement;
    if (!focusedElement || !focusedElement.classList.contains("preset-card"))
      return;

    // Find the current category section and grid
    const currentCategory = focusedElement.closest(".preset-category-section");
    if (!currentCategory) return;

    const currentGrid = currentCategory.querySelector(".preset-grid");
    if (!currentGrid) return;

    // Get all cards in the current category
    const categoryCards = Array.from(
      currentGrid.querySelectorAll('.preset-card:not([style*="display: none"])')
    );
    const currentCategoryIndex = categoryCards.indexOf(focusedElement);

    // Calculate grid dimensions for this category
    const containerWidth = currentGrid.offsetWidth;
    const cardWidth = 170; // card width + gap from CSS
    const columnsPerRow = Math.floor(containerWidth / cardWidth);

    const currentRow = Math.floor(currentCategoryIndex / columnsPerRow);
    const currentCol = currentCategoryIndex % columnsPerRow;

    let newCard = null;

    switch (direction) {
      case "up":
        if (currentRow > 0) {
          // Move up within same category
          const targetIndex = currentCategoryIndex - columnsPerRow;
          newCard = categoryCards[targetIndex];
        } else {
          // Move to previous category's last row, same column
          newCard = this.findCardInAdjacentCategory(
            currentCategory,
            "previous",
            currentCol,
            "last"
          );
        }
        break;

      case "down":
        const nextRowIndex = currentCategoryIndex + columnsPerRow;
        if (nextRowIndex < categoryCards.length) {
          // Move down within same category
          newCard = categoryCards[nextRowIndex];
        } else {
          // Move to next category's first row, same column
          newCard = this.findCardInAdjacentCategory(
            currentCategory,
            "next",
            currentCol,
            "first"
          );
        }
        break;

      case "left":
        if (currentCol > 0) {
          newCard = categoryCards[currentCategoryIndex - 1];
        } else {
          // Wrap to end of previous row in same category, or previous category
          if (currentRow > 0) {
            newCard = categoryCards[currentRow * columnsPerRow - 1];
          } else {
            newCard = this.findCardInAdjacentCategory(
              currentCategory,
              "previous",
              -1,
              "last"
            );
          }
        }
        break;

      case "right":
        if (
          currentCol < columnsPerRow - 1 &&
          currentCategoryIndex + 1 < categoryCards.length
        ) {
          newCard = categoryCards[currentCategoryIndex + 1];
        } else {
          // Wrap to start of next row in same category, or next category
          const nextRowStart = (currentRow + 1) * columnsPerRow;
          if (nextRowStart < categoryCards.length) {
            newCard = categoryCards[nextRowStart];
          } else {
            newCard = this.findCardInAdjacentCategory(
              currentCategory,
              "next",
              0,
              "first"
            );
          }
        }
        break;
    }

    if (newCard) {
      newCard.focus();
    }
  }

  findCardInAdjacentCategory(
    currentCategory,
    direction,
    targetCol,
    rowPosition
  ) {
    const allCategories = Array.from(
      this.contentContainer.querySelectorAll(
        '.preset-category-section:not([style*="display: none"])'
      )
    );
    const currentCategoryIndex = allCategories.indexOf(currentCategory);

    let targetCategoryIndex;
    if (direction === "next") {
      targetCategoryIndex = (currentCategoryIndex + 1) % allCategories.length;
    } else {
      targetCategoryIndex =
        currentCategoryIndex === 0
          ? allCategories.length - 1
          : currentCategoryIndex - 1;
    }

    const targetCategory = allCategories[targetCategoryIndex];
    if (!targetCategory) return null;

    const targetGrid = targetCategory.querySelector(".preset-grid");
    if (!targetGrid) return null;

    const targetCards = Array.from(
      targetGrid.querySelectorAll('.preset-card:not([style*="display: none"])')
    );
    if (targetCards.length === 0) return null;

    // Calculate grid dimensions for target category
    const containerWidth = targetGrid.offsetWidth;
    const cardWidth = 180 + 16;
    const columnsPerRow = Math.floor(containerWidth / cardWidth);

    if (targetCol === -1) {
      // Return last card
      return targetCards[targetCards.length - 1];
    }

    if (rowPosition === "first") {
      // Return card in first row at target column
      const targetIndex = Math.min(targetCol, targetCards.length - 1);
      return targetCards[targetIndex];
    } else if (rowPosition === "last") {
      // Return card in last row at target column
      const totalRows = Math.ceil(targetCards.length / columnsPerRow);
      const lastRowStart = (totalRows - 1) * columnsPerRow;
      const targetIndex = Math.min(
        lastRowStart + targetCol,
        targetCards.length - 1
      );
      return targetCards[targetIndex];
    }

    return targetCards[0]; // fallback
  }

  selectFocusedPreset() {
    const focusedElement = document.activeElement;
    if (!focusedElement || !focusedElement.classList.contains("preset-card"))
      return;

    const presetId = focusedElement.dataset.presetId;

    // Find the preset data
    for (const category of this.categories) {
      const categoryPresets = this.presets[category.id] || [];
      const preset = categoryPresets.find((p) => p.id === presetId);
      if (preset) {
        if (this.onPresetSelect) {
          this.onPresetSelect(preset);
        }
        this.hide();
        return;
      }
    }
  }

  scrollToCategory(categoryId) {
    const categorySection = this.contentContainer.querySelector(
      `.preset-category-section[data-category-id="${categoryId}"]`
    );
    if (categorySection) {
      categorySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  createPresetCard(preset) {
    const card = document.createElement("div");
    card.className = "preset-card";
    card.dataset.presetId = preset.id;
    card.tabIndex = 0;

    const cardContent = document.createElement("div");
    cardContent.className = "preset-card-content";
    card.appendChild(cardContent);

    // Preset icon
    const iconContainer = document.createElement("div");
    iconContainer.className = "preset-card-icon";

    // Use the custom structure's color
    if (preset.color) {
      card.style.setProperty("--category-color", preset.color);
    }
    iconContainer.style.color = "var(--category-color)";
    iconContainer.style.borderColor = "var(--category-color)";

    // Use the custom structure icon
    if (preset.icon && IconList[preset.icon]) {
      iconContainer.innerHTML = IconList[preset.icon];
    } else {
      // Fallback to first available icon
      const defaultIcon = Object.keys(IconList)[0];
      iconContainer.innerHTML = IconList[defaultIcon];
    }

    // Preset info
    const info = document.createElement("div");
    info.className = "preset-card-info";

    const desc = preset?.description?.trim() ?? "";
    const name = document.createElement("div");
    name.className = "preset-card-name";
    name.textContent = preset.name;
    if (desc.length === 0) name.style.marginBottom = "0px";
    info.appendChild(name);

    const description = document.createElement("div");
    description.className = "preset-card-description";
    description.textContent = desc;
    info.appendChild(description);

    cardContent.appendChild(iconContainer);
    cardContent.appendChild(info);

    // Tags container (bottom, scrollable)
    const tagsContainer = document.createElement("div");
    tagsContainer.className = "preset-card-tags";
    // Add type badge (and any future tags)
    const uniqueObjectTypes = new Map();
    for (const object of preset.objects) {
      if (!uniqueObjectTypes.has(object.objectType)) {
        uniqueObjectTypes.set(object.objectType, 1);
      } else {
        uniqueObjectTypes.set(
          object.objectType,
          uniqueObjectTypes.get(object.objectType) + 1
        );
      }
    }
    for (const [objectType, objectTypeCount] of uniqueObjectTypes) {
      const typeBadge = document.createElement("div");
      typeBadge.className = "preset-card-type";
      if (objectTypeCount > 1)
        typeBadge.textContent = `${getObjectTypeName(
          objectType
        )} (${objectTypeCount})`;
      else typeBadge.textContent = `${getObjectTypeName(objectType)}`;
      typeBadge.style.background = "rgba(0,0,0,0.1)";

      if (preset.color) {
        typeBadge.style.color = preset.color;
        typeBadge.style.borderColor = preset.color;
      } else {
        typeBadge.style.color = "var(--category-color)";
        typeBadge.style.borderColor = "var(--category-color)";
      }

      tagsContainer.appendChild(typeBadge);
    }

    // Variable parameter indicator
    if (preset.variableParam) {
      const variableIndicator = document.createElement("div");
      variableIndicator.className = "preset-variable-indicator";
      variableIndicator.innerHTML = IconList.Settings;

      // Enhanced tooltip showing parameter name and description
      let tooltipText = `${
        types[preset.variableParam]?.properties?.label ?? preset.variableParam
      }`;

      variableIndicator.setAttribute("titleTooltip", tooltipText);
      tagsContainer.appendChild(variableIndicator);
    }

    card.appendChild(tagsContainer);

    // Click handler
    card.addEventListener("click", () => {
      this.selectPreset(preset);
    });

    // Hover effects
    card.addEventListener("mouseenter", () => {
      card.classList.add("hover");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("hover");
    });

    // Focus effects
    card.addEventListener("focus", () => {
      // Scroll into view when focused
      setTimeout(() => {
        card.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 50);
    });

    return card;
  }

  selectPreset(preset) {
    // Add selection visual feedback
    this.contentContainer.querySelectorAll(".preset-card").forEach((card) => {
      card.classList.remove("selected");
    });

    const selectedCard = this.contentContainer.querySelector(
      `.preset-card[data-preset-id="${preset.id}"]`
    );
    if (selectedCard) {
      selectedCard.classList.add("selected");
    }

    // Trigger callback
    if (this.onPresetSelect) {
      this.onPresetSelect(preset);
    }

    // Auto-close dialog after selection
    setTimeout(() => {
      this.hide();
    }, 100);
  }

  filterPresets() {
    if (!this.searchQuery || this.searchQuery.trim() === "") {
      // Show all when no search - don't use search system
      this.showAllPresets();
      this.updateCategoryTabs();
      return;
    }

    let nbFound = 0;

    // Filter categories and presets based on search
    this.contentContainer
      .querySelectorAll(".preset-category-section")
      .forEach((section) => {
        const categoryId = section.dataset.categoryId;
        const categoryPresets = this.presets[categoryId] || [];

        // Filter presets in this category
        const matchingPresets = categoryPresets.filter(
          (preset) =>
            preset.name
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) ||
            preset.description
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase())
        );

        if (matchingPresets.length > 0) {
          // Show category if it has matching presets
          section.style.display = "block";

          // Show/hide individual preset cards
          section.querySelectorAll(".preset-card").forEach((card) => {
            const presetId = card.dataset.presetId;
            const hasMatch = matchingPresets.some(
              (preset) => preset.id === presetId
            );
            card.style.display = hasMatch ? "" : "none";
          });
          nbFound += matchingPresets.length;
        } else {
          // Hide entire category if no matching presets
          section.style.display = "none";
        }
      });

    this.updateCategoryTabs();

    // Check if we have any visible results after filtering
    this.checkForEmptyResults(nbFound);
  }

  showAllPresets() {
    this.contentContainer
      .querySelectorAll(".preset-category-section")
      .forEach((section) => {
        section.style.display = "block";
        // Show all preset cards in each category
        section.querySelectorAll(".preset-card").forEach((card) => {
          card.style.display = "";
        });
      });

    // Hide empty state when showing all presets
    this.hideEmptyState();
  }

  checkForEmptyResults(nbFound) {
    if (nbFound === 0) {
      this.showEmptyState();
    } else {
      this.hideEmptyState();
    }
  }

  showEmptyState() {
    // Hide all categories
    this.contentContainer
      .querySelectorAll(".preset-category-section")
      .forEach((section) => {
        section.style.display = "none";
      });

    // Create or show empty state
    let emptyState = this.contentContainer.querySelector(".search-empty-state");
    if (!emptyState) {
      emptyState = document.createElement("div");
      emptyState.className = "search-empty-state";
      emptyState.innerHTML = `
        <div class="search-empty-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14Z"/>
            <path d="M22 22L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="search-empty-title">No presets found</div>
        <div class="search-empty-description">No presets match your search for "<span class="search-query-text"></span>"</div>
        <button class="search-empty-clear-button">Clear Search</button>
      `;

      // Add clear button functionality
      const clearButton = emptyState.querySelector(
        ".search-empty-clear-button"
      );
      clearButton.addEventListener("click", () => {
        this.searchInput.value = "";
        this.searchQuery = "";
        this.filterPresets();
        this.updateVisiblePresets();
        this.searchInput.focus();
      });

      this.contentContainer.appendChild(emptyState);
    }

    // Update search query text
    const queryText = emptyState.querySelector(".search-query-text");
    if (queryText) {
      queryText.textContent = this.searchQuery;
    }

    emptyState.style.display = "flex";
  }

  hideEmptyState() {
    const emptyState = this.contentContainer.querySelector(
      ".search-empty-state"
    );
    if (emptyState) {
      emptyState.style.display = "none";
    }
  }

  updateCategoryTabs() {
    // Show/hide tabs based on whether their categories have visible presets
    this.tabContainer.querySelectorAll(".preset-tab").forEach((tab) => {
      const categoryId = tab.dataset.categoryId;
      const categorySection = this.contentContainer.querySelector(
        `.preset-category-section[data-category-id="${categoryId}"]`
      );

      if (categorySection) {
        const hasVisiblePresets =
          categorySection.style.display !== "none" &&
          categorySection.querySelectorAll(
            '.preset-card:not([style*="display: none"])'
          ).length > 0;
        tab.style.display = hasVisiblePresets ? "flex" : "none";
      } else {
        tab.style.display = "none";
      }
    });
  }

  setupEventListeners() {
    // Close on overlay click
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) {
        this.hide();
      }
    });

    // Prevent clicks within dialog from closing it
    this.dialog.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Escape key to close
    this.boundKeyDown = (e) => {
      if (e.key === "Escape" && this.isVisible) {
        this.hide();
      }
      if (this.isVisible) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };
    document.addEventListener("keydown", this.boundKeyDown);

    // Prevent arrow keys from propagating when search is focused
    this.searchInput.addEventListener("keydown", (e) => {
      e.stopPropagation();
      this.handleKeydown(e);
    });
  }

  show(selectedPresetId = null) {
    this.isVisible = true;
    this.overlay.classList.add("visible");
    this.blockPageInteractions();

    // Refresh custom structures to get any newly created ones
    this.loadCustomStructures();
    this.updateContent();

    // Highlight currently selected preset if provided
    if (selectedPresetId) {
      this.highlightSelectedPreset(selectedPresetId);
    }

    this.updateCategoryTabs();

    // Focus search input after animation
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.focus();
      }
    }, this.options.animationDuration);
  }

  highlightSelectedPreset(presetId) {
    // Remove previous selection
    this.contentContainer.querySelectorAll(".preset-card").forEach((card) => {
      card.classList.remove("selected");
    });

    // Add selection to current preset
    const selectedCard = this.contentContainer.querySelector(
      `.preset-card[data-preset-id="${presetId}"]`
    );
    if (selectedCard) {
      selectedCard.classList.add("selected");

      // Scroll into view
      setTimeout(() => {
        selectedCard.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 150);
    }
  }

  hide() {
    this.isVisible = false;
    this.overlay.classList.remove("visible");
    this.unblockPageInteractions();

    // Clear search
    this.searchQuery = "";
    if (this.searchInput) {
      this.searchInput.value = "";
    }

    // Trigger close callback
    if (this.onClose) {
      this.onClose();
    }
  }

  blockPageInteractions() {
    // Prevent all events from propagating to the page
    this.globalEventBlocker = (e) => {
      // Allow events within the dialog
      if (this.dialog && this.dialog.contains(e.target)) {
        return;
      }
      if (this.isVisible) {
        // Block all other events
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    // Block multiple types of events
    const eventsToBlock = [
      "mousedown",
      "mouseup",
      "mousemove",
      "wheel",
      "keydown",
      //"keyup",
      "keypress",
      "touchstart",
      "touchend",
      "touchmove",
      "contextmenu",
      "selectstart",
      "dragstart",
    ];

    eventsToBlock.forEach((eventType) => {
      this.overlay.addEventListener(eventType, this.globalEventBlocker, {
        capture: true,
        passive: false,
      });
    });

    // Disable page scrolling
    document.body.style.overflow = "hidden";
  }

  unblockPageInteractions() {
    if (this.globalEventBlocker) {
      const eventsToBlock = [
        "mousedown",
        "mouseup",
        "mousemove",
        "wheel",
        "keydown",
        //"keyup",
        "keypress",
        "touchstart",
        "touchend",
        "touchmove",
        "contextmenu",
        "selectstart",
        "dragstart",
      ];

      eventsToBlock.forEach((eventType) => {
        this.overlay.removeEventListener(eventType, this.globalEventBlocker, {
          capture: true,
        });
      });

      this.globalEventBlocker = null;
    }

    // Re-enable page scrolling
    document.body.style.overflow = "";
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  refresh() {
    this.loadCategories();
    this.createCategoryTabs();
    this.updateContent();
  }

  applyStyles() {
    if (!document.querySelector("#preset-dialog-styles")) {
      const style = document.createElement("style");
      style.id = "preset-dialog-styles";
      style.textContent = `
        .preset-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          z-index: 2000;
          opacity: 0;
          visibility: hidden;
          transition: all ${this.options.animationDuration}ms ease;
          backdrop-filter: blur(4px);
          pointer-events: none;
        }

        .preset-dialog-overlay.visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }

        .preset-dialog {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%) scale(0.95);
          width: ${this.options.width};
          height: ${this.options.height};
          background: ${Theme.sidebarBackground};
          border: 1px solid ${Theme.borderPrimary};
          border-radius: 0px;
          transition: transform ${this.options.animationDuration}ms ease, opacity ${this.options.animationDuration}ms ease;
          display: flex;
          flex-direction: column;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          opacity: 0;
        }

        .preset-dialog-overlay.visible .preset-dialog {
          transform: translateX(-50%) translateY(-50%) scale(1);
          opacity: 1;
        }

        .preset-dialog-header {
          padding: 20px 24px;
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        .preset-dialog-title {
          margin: 0;
          color: ${Theme.textPrimary};
          font-size: 1.3rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .preset-dialog-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .preset-dialog-clear {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: ${Theme.textPrimary};
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 4px;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .preset-dialog-clear:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .preset-dialog-close {
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

        .preset-dialog-close:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        .preset-search-section {
          padding: 0px;
          background: ${Theme.primaryDark};
          flex-shrink: 0;
        }

        .preset-search-container {
          position: relative;
          width: 100%;
          padding: 0px;
        }

        .preset-search-input {
          width: 100%;
          padding: 8px 40px 8px 40px;
          background: ${Theme.primaryDark};
          border: none;
          border-radius: 0px;
          color: ${Theme.textPrimary};
          font-size: 0.9rem;
          transition: all 0.2s ease;
          box-sizing: border-box;
          font-family: inherit;
        }

        .preset-search-input:focus {
          outline: none;
        }

        .preset-search-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .preset-search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: rgba(255, 255, 255, 0.7);
          pointer-events: none;
        }

        .preset-search-icon svg {
          width: 100%;
          height: 100%;
          fill: currentColor;
        }

        .preset-search-clear {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0px;
          transition: all 0.2s ease;
          font-weight: normal;
          line-height: 1;
        }

        .preset-search-clear:hover {
          color: ${Theme.textPrimary};
          background: rgba(255, 255, 255, 0.2);
        }

        .preset-tabs {
          display: flex;
          padding: 0 24px;
          border-bottom: 1px solid ${Theme.borderSecondary};
          overflow-x: auto;
          flex-shrink: 0;
        }

        .preset-tabs::-webkit-scrollbar {
          height: 10px;
        }

        .preset-tabs::-webkit-scrollbar-track {
          background: ${Theme.scrollbarTrack};
        }

        .preset-tabs::-webkit-scrollbar-thumb {
          background: ${Theme.scrollbarThumb};
          border-radius: 0px;
          border: 3px solid ${Theme.scrollbarTrack};
          background-clip: content-box;
        }

        .preset-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          position: relative;
          min-width: 70px;
        }

        .preset-tab:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .preset-tab.selected {
          border-bottom-color: ${Theme.primary};
          background: rgba(74, 158, 255, 0.1);
        }

        .preset-tab-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .preset-tab:hover .preset-tab-icon {
          transform: scale(1.1);
        }

        .preset-tab-icon svg {
          width: 100%;
          height: 100%;
          fill: currentColor;
        }

        .preset-tab-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: ${Theme.textSecondary};
          transition: color 0.2s ease;
        }

        .preset-tab.selected .preset-tab-label {
          color: ${Theme.textPrimary};
        }

        .preset-content {
          flex: 1;
          overflow-y: auto;
          padding: 0px 24px;
        }

        .preset-content::-webkit-scrollbar {
          width: 14px;
        }

        .preset-content::-webkit-scrollbar-track {
          background: ${Theme.scrollbarTrack};
        }

        .preset-content::-webkit-scrollbar-thumb {
          background: ${Theme.scrollbarThumb};
          border-radius: 0px;
          border: 4px solid ${Theme.scrollbarTrack};
          background-clip: content-box;
        }

        .preset-content::-webkit-scrollbar-thumb:hover {
          background: ${Theme.scrollbarThumbHover};
          border: 4px solid ${Theme.scrollbarTrack};
          background-clip: content-box;
        }

        .preset-category-section {
          margin-bottom: 32px;
          padding-top: 16px;
        }

        .preset-category-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid ${Theme.borderSecondary};
        }

        .preset-category-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preset-category-icon svg {
          width: 100%;
          height: 100%;
          fill: currentColor;
        }

        .preset-category-section[style*="display: none"] .preset-category-icon svg {
          fill: ${Theme.textMuted};
        }

        .preset-category-title {
          margin: 0;
          color: ${Theme.textPrimary};
          font-size: 1.1rem;
          font-weight: 700;
          flex: 1;
        }

        .preset-category-count {
          color: ${Theme.textSecondary};
          font-size: 0.9rem;
          font-weight: 500;
        }

        .preset-category-description {
          margin: 0 0 16px 0;
          color: ${Theme.textSecondary};
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .preset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 10px;
        }

        .preset-card {
          width: 170px;
          background: ${Theme.componentBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-sizing: border-box;
          display: flex;
          text-align: center;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
          margin-bottom: 0px;
          position: relative;
        }

        .preset-card-content {
          padding: 10px;
          display: flex;
          text-align: center;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex: 1;
          width: calc(100% - 20px);
        }

        .preset-card:hover,
        .preset-card.hover {
          border-color: ${Theme.borderFocus};
          background: ${Theme.componentHoverBackground};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(74, 158, 255, 0.2);
        }

        .preset-card.selected {
          border-color: ${Theme.success};
          background: rgba(17, 220, 104, 0.1);
          transform: scale(1.02);
        }

        .preset-card:focus {
          border-color: ${Theme.primary};
          background: ${Theme.componentBackground};
          box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.5);
          transform: scale(1.02);
          outline: none;
        }

        .preset-card.selected:focus {
          border-color: ${Theme.success};
          background: rgba(17, 220, 104, 0.1);
          box-shadow: 0 0 0 2px rgba(17, 220, 104, 0.7);
          transform: scale(1.04);
          outline: none;
        }

        .preset-card.selected:hover {
          border-color: ${Theme.success};
          background: rgba(17, 220, 104, 0.25);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 4px 16px rgba(17, 220, 104, 0.4);
        }

        .preset-card-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0px;
          background: rgba(0,0,0,0.05);
          border: 1px solid var(--category-color, rgba(74, 158, 255, 0.3));
          color: var(--category-color, #4A9EFF);
        }

        .preset-card-icon svg {
          width: 32px;
          height: 32px;
          fill: currentColor;
        }

        .preset-card-icon img {
          width: 32px;
          height: 32px;
          object-fit: contain;
          border-radius: 4px;
        }

        .preset-card-icon-text {
          background: var(--category-color, ${Theme.primary});
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 0px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
        }

        .preset-variable-indicator {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          background: transparent;
          color: var(--category-color, ${Theme.primary});
          border: 1px solid var(--category-color, ${Theme.primary});
          border-radius: 0px;
          font-size: 0.7rem;
          font-weight: 500;
          height: 20px;
          box-sizing: border-box;
          position: absolute;
          left: 4px;
        }

        .preset-variable-indicator[titleTooltip]::after {
          pointer-events: none;
          content: attr(titleTooltip);
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(4px);
          white-space: nowrap;
          border: 1px solid var(--category-color, ${Theme.primary});
          background-color: ${Theme.componentDisabledBackground};
          color: var(--category-color, ${Theme.primary});
          padding: 3px 6px;
          margin-left: 4px;
          z-index: 10;
          display: block;
          opacity: 0;
          transition: opacity 0.2s ease;
          font-size: 0.65rem;
          font-weight: 600;
        }

        .preset-variable-indicator[titleTooltip]:hover::after {
          opacity: 1;
        }

        .preset-variable-indicator[titleTooltip]::before {
          content: "";
          position: absolute;
          left: 75%;
          top: 50%;
          transform: translateY(-50%) translateX(4px);
          border: 5px solid transparent;
          border-right-color: var(--category-color, ${Theme.primary});
          z-index: 9;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .preset-variable-indicator[titleTooltip]:hover::before {
          opacity: 1;
        }

        .preset-variable-indicator svg {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }

        .preset-card-info {
          flex: 1;
          padding: 0 2px;
        }

        .preset-card-name {
          font-size: 1rem;
          font-weight: 600;
          color: ${Theme.textPrimary};
          margin-bottom: 6px;
          line-height: 1.2;
          word-break: break-word;
        }

        .preset-card-description {
          font-size: 0.8rem;
          color: ${Theme.textSecondary};
          line-height: 1.3;
        }

        .preset-card-type {
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--category-color, ${Theme.primary});
          background: rgba(0,0,0,0.1);
          padding: 3px 6px;
          border-radius: 0px;
          border: 1px solid var(--category-color, rgba(74, 158, 255, 0.3));
          display: inline-block;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .preset-card-tags {
          display: flex;
          flex-direction: row-reverse;
          gap: 4px;
          overflow-x: auto;
          max-width: 100%;
          width: 100%;
          box-sizing: border-box;
          background: ${Theme.componentDisabledBackground};
          border-top: 1px solid ${Theme.borderSecondary};
          padding: 4px;
          scrollbar-width: thin;
          scrollbar-color: ${Theme.scrollbarThumb} ${Theme.scrollbarTrack};
        }

        .preset-card-tags::-webkit-scrollbar {
          height: 8px;
        }

        .preset-card-tags::-webkit-scrollbar-track {
          background: ${Theme.scrollbarTrack};
        }

        .preset-card-tags::-webkit-scrollbar-thumb {
          background: ${Theme.scrollbarThumb};
          border-radius: 0px;
          border: 2px solid ${Theme.scrollbarTrack};
          background-clip: content-box;
        }

        .preset-card-tags::-webkit-scrollbar-thumb:hover {
          background: ${Theme.scrollbarThumbHover};
          border: 2px solid ${Theme.scrollbarTrack};
          background-clip: content-box;
        }

        .preset-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: ${Theme.textMuted};
          text-align: center;
        }

        .preset-empty-icon {
          width: 64px;
          height: 64px;
          opacity: 0.5;
          margin-bottom: 16px;
        }

        .preset-empty-icon svg {
          width: 100%;
          height: 100%;
          fill: currentColor;
        }

        .preset-empty-text {
          font-size: 1rem;
          font-weight: 500;
        }

        .search-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          color: ${Theme.textSecondary};
          text-align: center;
          min-height: 300px;
        }

        .search-empty-icon {
          width: 80px;
          height: 80px;
          opacity: 0.6;
          margin-bottom: 24px;
          color: ${Theme.textMuted};
        }

        .search-empty-icon svg {
          width: 100%;
          height: 100%;
          fill: currentColor;
        }

        .search-empty-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: ${Theme.textPrimary};
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .search-empty-description {
          font-size: 1rem;
          color: ${Theme.textSecondary};
          margin-bottom: 32px;
          line-height: 1.5;
          max-width: 400px;
        }

        .search-query-text {
          color: ${Theme.primary};
          font-weight: 600;
          font-style: italic;
        }

        .search-empty-clear-button {
          padding: 12px 24px;
          background: ${Theme.primary};
          border: none;
          border-radius: 0px;
          color: ${Theme.textPrimary};
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .search-empty-clear-button:hover {
          background: ${Theme.primaryHover};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 158, 255, 0.3);
        }

        .search-empty-clear-button:active {
          transform: translateY(0);
          background: ${Theme.primaryDark};
        }

        /* Animation for preset cards */
        .preset-card {
          animation: presetCardFadeIn 0.3s ease;
        }

        @keyframes presetCardFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  destroy() {
    if (this.boundKeyDown) {
      document.removeEventListener("keydown", this.boundKeyDown);
    }
    this.boundKeyDown = null;

    this.unblockPageInteractions();

    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }

    const styles = document.querySelector("#preset-dialog-styles");
    if (styles) {
      styles.remove();
    }
  }
}

// Global preset dialog instance
export let presetDialog = null;

// Helper function to initialize the preset dialog
export function initializePresetDialog(
  container = document.body,
  options = {}
) {
  if (!presetDialog) {
    presetDialog = new PresetDialog(container, options);
  }
  return presetDialog;
}

export function destroyPresetDialog() {
  if (presetDialog) {
    presetDialog.destroy();
    presetDialog = null;
  }
}

// Helper functions
export function showPresetDialog() {
  if (presetDialog) {
    presetDialog.show();
  }
}

export function hidePresetDialog() {
  if (presetDialog) {
    presetDialog.hide();
  }
}
