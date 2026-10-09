// Inventory Bar Component for Level Editor
// Provides Minecraft-style inventory UI for object placement presets

import { Theme } from "./inspectorUI.js";
import { PresetCategories } from "./objectPresets.js";
import { CUSTOM_STRUCTURE_ICONS } from "./iconList.js";
import { types } from "./objectTypeDefinitions.js";
import * as IconList from "./iconList.js";
import { createCSSCube, loadCubeFaces } from "./imageHelper.js";
import { ColorPicker } from "./colorPicker.js";

export class InventoryBar {
  constructor(container = document.body, options = {}) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;

    this.options = {
      slotCount: options.slotCount || 3,
      position: options.position || "bottom",
      height: options.height || "80px",
      ...options,
    };

    this.slots = [];
    this.selectedSlotIndex = 0;
    this.inventoryBar = null;
    this.isVisible = false;

    // Event callbacks
    this.onSlotSelect = options.onSlotSelect || null;
    this.onSlotClick = options.onSlotClick || null;
    this.onSlotsChange = options.onSlotsChange || null;

    // Internal flag to suppress change emit during programmatic sync
    this._suppressChangeEvents = false;

    this.init();
    //this.setupInspectorIntegration();
  }

  init() {
    this.createInventoryBar();
    this.applyStyles();
    this.setupEventListeners();
    this.updateDisplay();
    this.hide(); // Start hidden
  }

  createInventoryBar() {
    this.inventoryBar = document.createElement("div");
    this.inventoryBar.className = "inventory-bar";

    // Block pointer events from reaching the editor underneath
    ["mousedown", "click", "contextmenu"].forEach((eventType) => {
      this.inventoryBar.addEventListener(
        eventType,
        (e) => {
          e.stopPropagation();
        },
        { passive: false },
      );
    });

    const slotsContainer = document.createElement("div");
    slotsContainer.className = "inventory-slots";

    // Create slots
    for (let i = 0; i < this.options.slotCount; i++) {
      const slot = this.createSlot(i);
      this.slots.push({
        element: slot,
        preset: null, // Will store the selected preset
        parameterOverrides: {}, // Will store parameter overrides for variable presets
        index: i,
      });
      slotsContainer.appendChild(slot);
    }

    this.inventoryBar.appendChild(slotsContainer);
    this.container.appendChild(this.inventoryBar);

    // Select first slot by default
    this.selectSlot(0);
  }

  createSlot(index) {
    const slot = document.createElement("div");
    slot.className = "inventory-slot";
    slot.dataset.slotIndex = index;

    // Slot number label
    const numberLabel = document.createElement("div");
    numberLabel.className = "slot-number";
    numberLabel.textContent = (index + 1).toString();
    if (index === 9) {
      numberLabel.textContent = "0"; // 10th slot is '0'
    }
    if (index > 9) {
      numberLabel.textContent = ""; // No label for slots beyond 10
    }
    slot.appendChild(numberLabel);

    // Preset preview container
    const previewContainer = document.createElement("div");
    previewContainer.className = "slot-preview";
    slot.appendChild(previewContainer);

    // Empty state placeholder
    const placeholder = document.createElement("div");
    placeholder.className = "slot-placeholder";
    placeholder.textContent = "+";
    previewContainer.appendChild(placeholder);

    // Click handler for the main slot area
    slot.addEventListener("click", (e) => {
      e.stopPropagation();
      // Check if click was on variable indicator icon
      if (
        e.target.classList.contains("slot-variable-indicator") ||
        e.target.closest(".slot-variable-indicator")
      ) {
        e.stopPropagation();
        this.handleVariableIndicatorClick(index, e);
      }
      // Check if click was on edit icon
      else if (
        e.target.classList.contains("slot-edit-icon") ||
        e.target.closest(".slot-edit-icon")
      ) {
        e.stopPropagation();
        this.handleSlotClick(index, true);
      } else {
        this.handleSlotClick(index);
      }
    });

    // Right-click handler for parameter customization
    slot.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleSlotRightClick(index, e);
    });

    // Prevent drag gestures from starting editor interactions
    ["mousedown", "touchstart"].forEach((eventType) => {
      slot.addEventListener(
        eventType,
        (e) => {
          e.stopPropagation();
        },
        { passive: false },
      );
    });

    return slot;
  }

  setupEventListeners() {
    // Number key shortcuts (1, 2, 3, etc.)
    this.boundKeyDown = (e) => {
      if (this.isVisible && !this.isInputFocused()) {
        const keyNum = parseInt(e.key);
        if (keyNum >= 1 && keyNum <= this.options.slotCount) {
          e.preventDefault();
          e.stopPropagation();
          this.selectSlot(keyNum - 1);
        }
        if (keyNum === 0 && this.options.slotCount >= 10) {
          e.preventDefault();
          e.stopPropagation();
          this.selectSlot(9); // Select 10th slot for '0' key
        }
      }
    };
    document.addEventListener("keydown", this.boundKeyDown);

    // Scroll wheel support for slot cycling (only when over inventory bar)
    this.boundWheel = (e) => {
      if (globalThis._editorScope?.placingSystem?.placementSystem?.isPlacing) {
        return;
      }
      if (this.isVisible && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        const direction = e.deltaY > 0 ? 1 : -1;
        this.cycleSlots(direction);
      }
    };
    this.inventoryBar.addEventListener("wheel", this.boundWheel, {
      passive: false,
    });

    // Prevent right-click context menu on inventory bar
    this.inventoryBar.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }

  handleSlotClick(slotIndex, isEditClick = false) {
    this.closeParameterTooltip();
    if (isEditClick || !this.slots[slotIndex].preset) {
      if (slotIndex !== this.selectedSlotIndex) {
        this.selectSlot(slotIndex);
      }
      // Edit icon clicked or clicking empty selected slot opens the preset dialog
      if (this.onSlotClick) {
        this.onSlotClick(slotIndex, this.slots[slotIndex]);
      }
    } else {
      // Clicking a different slot selects it
      this.selectSlot(slotIndex);
    }
  }

  handleVariableIndicatorClick(slotIndex, event) {
    const slot = this.slots[slotIndex];

    // Only show tooltip for variable presets
    if (!slot.preset || !slot.preset.variableParam) {
      return;
    }

    // Select the slot first
    this.selectSlot(slotIndex);

    // Show parameter tooltip
    this.showParameterTooltip(slotIndex, event);
  }

  handleSlotRightClick(slotIndex, event) {
    const slot = this.slots[slotIndex];

    // Only show context menu for variable presets
    if (!slot.preset || !slot.preset.variableParam) {
      return;
    }

    // Select the slot first
    this.selectSlot(slotIndex);

    // Create tooltip menu for parameter customization
    this.showParameterTooltip(slotIndex, event);
  }

  showParameterTooltip(slotIndex, event) {
    const slot = this.slots[slotIndex];
    const preset = slot.preset;

    if (!preset || !preset.variableParam) return;

    // Remove any existing tooltip
    const existingTooltip = document.querySelector(".slot-parameter-tooltip");
    if (existingTooltip) {
      existingTooltip.remove();
    }

    // Get parameter type definition from objectTypeDefinitions
    const parameterName = preset.variableParam;
    const paramType = types[parameterName];
    if (!paramType) {
      console.warn(`No parameter type found for: ${parameterName}`);
      return;
    }

    const currentValue = this.getSlotParameterOverride(
      slotIndex,
      parameterName,
    );
    const defaultValue = this.getDefaultParameterValue(preset, parameterName);
    const effectiveValue = currentValue || defaultValue;

    // Check parameter type from the parameter definition
    const parameterType = paramType.properties.type;

    // Show appropriate tooltip based on parameter type
    if (parameterType === "text") {
      this.showTextInputTooltip(slotIndex, effectiveValue, parameterName);
      return;
    }

    if (parameterType === "number") {
      this.showNumberInputTooltip(slotIndex, effectiveValue, parameterName);
      return;
    }

    if (parameterType === "color") {
      this.showColorInputTooltip(slotIndex, effectiveValue, parameterName);
      return;
    }

    if (parameterType === "checkbox") {
      this.showCheckboxTooltip(
        slotIndex,
        effectiveValue,
        parameterName,
        paramType,
      );
      return;
    }

    if (parameterType === "selector") {
      this.showSelectorTooltip(
        slotIndex,
        effectiveValue,
        paramType,
        parameterName,
      );
      return;
    }
  }

  showSelectorTooltip(
    slotIndex,
    effectiveValue,
    paramType,
    parameterName = "selector",
  ) {
    // Create tooltip menu styled like SelectorComponent for other parameter types
    const tooltip = document.createElement("div");
    tooltip.className = "slot-parameter-tooltip";

    const grid = document.createElement("div");
    grid.className = "slot-parameter-grid";

    // Get options from parameter definition
    if (!paramType.properties.options) {
      console.warn(`No options found for parameter: ${parameterName}`);
      return;
    }

    const options = paramType.properties.options;

    // Set grid columns based on parameter type
    const columnsPerRow = paramType.properties.columnsPerRow || 3;
    grid.style.gridTemplateColumns = `repeat(${columnsPerRow}, 1fr)`;

    // Create option items
    let selectedItem = null;
    options.forEach((option) => {
      const item = document.createElement("div");
      item.className = "slot-parameter-item";

      if (effectiveValue === option.value) {
        item.classList.add("selected");
        selectedItem = item;
      }

      // Add option content based on type
      if (option.cube) {
        // Handle cube display for materials
        try {
          const cubePromise = loadCubeFaces(option.cube);
          cubePromise
            .then((faces) => {
              const cube = createCSSCube(
                faces.top,
                faces.left,
                faces.right,
                48,
                option.cube.height || 1,
                faces.front,
                faces.back,
                faces.bottom,
                option.cube.depth || 1,
                option.cube.topVisibility || 0,
              );

              // Replace the placeholder if it exists
              const existingCube = item.querySelector(
                ".parameter-cube-display",
              );
              if (existingCube) {
                item.replaceChild(cube, existingCube);
              } else {
                item.insertBefore(cube, item.firstChild);
              }
            })
            .catch((error) => {
              console.warn("Failed to load cube images:", error);
              // Keep the fallback display
            });

          // Create placeholder while loading
          const cubeDisplay = document.createElement("div");
          cubeDisplay.className = "parameter-cube-display";
          item.appendChild(cubeDisplay);
        } catch (error) {
          // Fallback to label
          item.style.display = "flex";
          item.style.alignItems = "center";
          item.style.justifyContent = "center";
        }
      } else if (option.image) {
        // Handle image display for tags
        const img = document.createElement("img");
        if (typeof option.image === "function") {
          const src = option.image();
          if (src instanceof Promise) {
            src.then((resolvedSrc) => (img.src = resolvedSrc));
          } else {
            img.src = src;
          }
        } else {
          img.src = option.image;
        }
        img.alt = option.label;
        item.appendChild(img);
      } else if (option.svg) {
        const svgContainer = document.createElement("div");
        svgContainer.innerHTML = option.svg;
        item.appendChild(svgContainer);
      } else {
        // Text-only option
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.justifyContent = "center";
      }

      const label = document.createElement("div");
      label.className = "slot-parameter-label";
      label.textContent = option.label;
      item.appendChild(label);

      item.addEventListener("click", (e) => {
        e.stopPropagation();
        this.setSlotParameterOverride(slotIndex, parameterName, option.value);
        this.closeParameterTooltip();
      });

      grid.appendChild(item);
    });

    if (selectedItem) {
      setTimeout(() => {
        selectedItem.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }, 30);
    }

    tooltip.appendChild(grid);
    document.body.appendChild(tooltip);

    // Position tooltip relative to the slot
    this.positionParameterTooltip(tooltip, slotIndex);

    // Block events from propagating to the scene
    const eventsToBlock = ["mousedown", "click", "contextmenu", "wheel"];
    this.tooltipEventHandlers = eventsToBlock.map((eventType) => {
      const handler = (e) => e.stopPropagation();
      tooltip.addEventListener(eventType, handler);
      return { eventType, handler };
    });

    // Close when clicking outside
    this.outsideClickHandler = (e) => {
      if (
        !tooltip.contains(e.target) &&
        !this.slots[slotIndex].element.contains(e.target)
      ) {
        this.closeParameterTooltip();
      }
    };
    setTimeout(
      () => document.addEventListener("pointerdown", this.outsideClickHandler),
      10,
    );

    // Show tooltip
    setTimeout(() => tooltip.classList.add("show"), 10);
  }

  showTextInputTooltip(slotIndex, currentValue, parameterName = "text") {
    // Create tooltip with text input
    const tooltip = document.createElement("div");
    tooltip.className = "slot-parameter-tooltip text-input-tooltip";

    const inputContainer = document.createElement("div");
    inputContainer.className = "text-input-container";

    const label = document.createElement("div");
    label.className = "text-input-label";
    label.textContent = "Enter text:";
    inputContainer.appendChild(label);

    const input = document.createElement("input");
    input.type = "text";
    input.className = "text-input-field";
    input.value = currentValue || "";
    input.placeholder = "Enter custom text...";
    inputContainer.appendChild(input);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "text-input-buttons";

    const confirmButton = document.createElement("button");
    confirmButton.className = "text-input-confirm";
    confirmButton.textContent = "OK";
    buttonContainer.appendChild(confirmButton);

    const cancelButton = document.createElement("button");
    cancelButton.className = "text-input-cancel";
    cancelButton.textContent = "Cancel";
    buttonContainer.appendChild(cancelButton);

    inputContainer.appendChild(buttonContainer);
    tooltip.appendChild(inputContainer);

    document.body.appendChild(tooltip);

    // Position tooltip relative to the slot
    this.positionParameterTooltip(tooltip, slotIndex);

    // Focus input and select text
    setTimeout(() => {
      input.focus();
      input.select();
    }, 100);

    // Event handlers
    const handleConfirm = () => {
      const value = input.value.trim();
      this.setSlotParameterOverride(slotIndex, parameterName, value);
      this.closeParameterTooltip();
    };

    const handleCancel = () => {
      this.closeParameterTooltip();
    };

    confirmButton.addEventListener("click", (e) => {
      e.stopPropagation();
      handleConfirm();
    });

    cancelButton.addEventListener("click", (e) => {
      e.stopPropagation();
      handleCancel();
    });

    input.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Enter") {
        handleConfirm();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    });

    // Block events from propagating to the scene
    const eventsToBlock = ["mousedown", "click", "contextmenu", "wheel"];
    this.tooltipEventHandlers = eventsToBlock.map((eventType) => {
      const handler = (e) => e.stopPropagation();
      tooltip.addEventListener(eventType, handler);
      return { eventType, handler };
    });

    // Close when clicking outside
    this.outsideClickHandler = (e) => {
      if (
        !tooltip.contains(e.target) &&
        !this.slots[slotIndex].element.contains(e.target)
      ) {
        this.closeParameterTooltip();
      }
    };
    setTimeout(
      () => document.addEventListener("pointerdown", this.outsideClickHandler),
      10,
    );

    // Show tooltip
    setTimeout(() => tooltip.classList.add("show"), 10);
  }

  showNumberInputTooltip(slotIndex, currentValue, parameterName = "number") {
    // Create tooltip with number input
    const tooltip = document.createElement("div");
    tooltip.className = "slot-parameter-tooltip number-input-tooltip";

    const inputContainer = document.createElement("div");
    inputContainer.className = "number-input-container";

    const label = document.createElement("div");
    label.className = "number-input-label";
    label.textContent = "Enter number:";
    inputContainer.appendChild(label);

    const input = document.createElement("input");
    input.type = "number";
    input.className = "number-input-field";
    input.value = currentValue || 0;
    input.placeholder = "Enter number...";
    input.step = "0.01";
    inputContainer.appendChild(input);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "number-input-buttons";

    const confirmButton = document.createElement("button");
    confirmButton.className = "number-input-confirm";
    confirmButton.textContent = "OK";
    buttonContainer.appendChild(confirmButton);

    const cancelButton = document.createElement("button");
    cancelButton.className = "number-input-cancel";
    cancelButton.textContent = "Cancel";
    buttonContainer.appendChild(cancelButton);

    inputContainer.appendChild(buttonContainer);
    tooltip.appendChild(inputContainer);
    document.body.appendChild(tooltip);

    this.positionParameterTooltip(tooltip, slotIndex);

    setTimeout(() => {
      input.focus();
      input.select();
    }, 100);

    const handleConfirm = () => {
      const value = parseFloat(input.value) || 0;
      this.setSlotParameterOverride(slotIndex, parameterName, value);
      this.closeParameterTooltip();
    };

    const handleCancel = () => {
      this.closeParameterTooltip();
    };

    confirmButton.addEventListener("click", (e) => {
      e.stopPropagation();
      handleConfirm();
    });

    cancelButton.addEventListener("click", (e) => {
      e.stopPropagation();
      handleCancel();
    });

    input.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Enter") {
        handleConfirm();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    });

    this.setupTooltipEventHandlers(tooltip, slotIndex);
  }

  showColorInputTooltip(
    slotIndex,
    currentValue,
    parameterName = "variableColor",
  ) {
    // Create tooltip with ColorPicker
    const tooltip = document.createElement("div");
    tooltip.className = "slot-parameter-tooltip color-input-tooltip";

    const inputContainer = document.createElement("div");
    inputContainer.className = "color-input-container";

    const label = document.createElement("div");
    label.className = "color-input-label";
    label.textContent = "Choose color:";
    inputContainer.appendChild(label);

    // Create ColorPicker container
    const colorPickerContainer = document.createElement("div");
    colorPickerContainer.className = "color-picker-container";
    colorPickerContainer.style.marginBottom = "8px";
    inputContainer.appendChild(colorPickerContainer);

    // Initialize ColorPicker
    const colorPicker = new ColorPicker({
      value: currentValue || "#ffffff",
      onChange: (newColor) => {
        // Auto-confirm on color change
        this.setSlotParameterOverride(slotIndex, parameterName, newColor);
        this.closeParameterTooltip();
      },
    });

    colorPicker.mount(colorPickerContainer);

    tooltip.appendChild(inputContainer);
    document.body.appendChild(tooltip);

    this.positionParameterTooltip(tooltip, slotIndex);
    this.setupTooltipEventHandlers(tooltip, slotIndex);
  }

  showCheckboxTooltip(
    slotIndex,
    currentValue,
    parameterName = "checkbox",
    paramType = null,
  ) {
    // Create tooltip with checkbox
    const tooltip = document.createElement("div");
    tooltip.className = "slot-parameter-tooltip checkbox-tooltip";

    const inputContainer = document.createElement("div");
    inputContainer.className = "checkbox-container";

    const checkboxWrapper = document.createElement("div");
    checkboxWrapper.className = "checkbox-wrapper";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox-field";
    checkbox.checked = currentValue === true;
    checkbox.id = `checkbox-${slotIndex}`;

    const label = document.createElement("label");
    label.className = "checkbox-label";
    label.htmlFor = `checkbox-${slotIndex}`;

    // Use parameter label if available, otherwise fallback to "Enable"
    const labelText = paramType?.properties?.label || "Enable";
    label.textContent = labelText;

    checkboxWrapper.appendChild(checkbox);
    checkboxWrapper.appendChild(label);
    inputContainer.appendChild(checkboxWrapper);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "checkbox-buttons";

    const confirmButton = document.createElement("button");
    confirmButton.className = "checkbox-confirm";
    confirmButton.textContent = "OK";
    buttonContainer.appendChild(confirmButton);

    const cancelButton = document.createElement("button");
    cancelButton.className = "checkbox-cancel";
    cancelButton.textContent = "Cancel";
    buttonContainer.appendChild(cancelButton);

    inputContainer.appendChild(buttonContainer);
    tooltip.appendChild(inputContainer);
    document.body.appendChild(tooltip);

    this.positionParameterTooltip(tooltip, slotIndex);

    const handleConfirm = () => {
      const value = checkbox.checked;
      this.setSlotParameterOverride(slotIndex, parameterName, value);
      this.closeParameterTooltip();
    };

    const handleCancel = () => {
      this.closeParameterTooltip();
    };

    confirmButton.addEventListener("click", (e) => {
      e.stopPropagation();
      handleConfirm();
    });

    cancelButton.addEventListener("click", (e) => {
      e.stopPropagation();
      handleCancel();
    });

    checkbox.addEventListener("change", (e) => {
      e.stopPropagation();
      // Auto-confirm on checkbox change
      setTimeout(handleConfirm, 100);
    });

    this.setupTooltipEventHandlers(tooltip, slotIndex);
  }

  setupTooltipEventHandlers(tooltip, slotIndex) {
    // Block events from propagating to the scene
    const eventsToBlock = ["mousedown", "click", "contextmenu", "wheel"];
    this.tooltipEventHandlers = eventsToBlock.map((eventType) => {
      const handler = (e) => e.stopPropagation();
      tooltip.addEventListener(eventType, handler);
      return { eventType, handler };
    });

    // Close when clicking outside
    this.outsideClickHandler = (e) => {
      // Check if click is on ColorPicker popup
      const colorPickerPopup = document.querySelector(".color-picker-popup");
      const isColorPickerClick =
        colorPickerPopup && colorPickerPopup.contains(e.target);

      if (
        !tooltip.contains(e.target) &&
        !this.slots[slotIndex].element.contains(e.target) &&
        !isColorPickerClick
      ) {
        this.closeParameterTooltip();
      }
    };
    setTimeout(
      () => document.addEventListener("pointerdown", this.outsideClickHandler),
      10,
    );

    // Show tooltip
    setTimeout(() => tooltip.classList.add("show"), 10);
  }

  positionParameterTooltip(tooltip, slotIndex) {
    const slotElement = this.slots[slotIndex].element;
    const rect = slotElement.getBoundingClientRect();

    // Measure tooltip size
    const prevVisibility = tooltip.style.visibility;
    tooltip.style.visibility = "hidden";
    tooltip.style.left = "0px";
    tooltip.style.top = "0px";

    const measuredRect = tooltip.getBoundingClientRect();
    const tooltipWidth = measuredRect.width || 300;
    const tooltipHeight = measuredRect.height || 250;

    tooltip.style.visibility = prevVisibility;

    // Position above the slot, centered horizontally
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    let top = rect.top - tooltipHeight - 20;

    // Ensure tooltip doesn't go off screen
    if (left < 20) {
      left = 20;
    }
    if (left + tooltipWidth > window.innerWidth - 20) {
      left = window.innerWidth - tooltipWidth - 20;
    }
    if (top < 20) {
      top = rect.bottom + 20; // Position below if no space above
    }

    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";

    // Update arrow position
    const slotCenterX = rect.left + rect.width / 2;
    const tooltipLeftX = parseInt(tooltip.style.left);
    const arrowOffset = slotCenterX - tooltipLeftX;

    const arrowWidth = 16;
    const minArrowLeft = 15;
    const maxArrowLeft = tooltipWidth - arrowWidth - 15;
    const clampedArrowOffset = Math.max(
      minArrowLeft,
      Math.min(maxArrowLeft, arrowOffset),
    );

    tooltip.style.setProperty("--arrow-left", clampedArrowOffset + "px");
  }

  closeParameterTooltip() {
    const tooltip = document.querySelector(".slot-parameter-tooltip");
    if (tooltip) {
      tooltip.remove();
    }

    // Clean up event handlers
    if (this.tooltipEventHandlers) {
      this.tooltipEventHandlers.forEach(({ eventType, handler }) => {
        // Handlers were added to tooltip which is being removed
      });
      this.tooltipEventHandlers = null;
    }

    if (this.outsideClickHandler) {
      document.removeEventListener("pointerdown", this.outsideClickHandler);
      this.outsideClickHandler = null;
    }
  }

  selectSlot(index) {
    if (index < 0 || index >= this.options.slotCount) return;

    const previousIndex = this.selectedSlotIndex;
    this.selectedSlotIndex = index;

    // Update visual selection
    this.slots.forEach((slot, i) => {
      slot.element.classList.toggle("selected", i === index);
    });

    // Trigger callback if selection actually changed
    if (previousIndex !== index && this.onSlotSelect) {
      this.onSlotSelect(index, this.slots[index]);
    }
  }

  cycleSlots(direction) {
    let newIndex = this.selectedSlotIndex + direction;

    // Wrap around
    if (newIndex < 0) {
      newIndex = this.options.slotCount - 1;
    } else if (newIndex >= this.options.slotCount) {
      newIndex = 0;
    }

    this.selectSlot(newIndex);
  }

  setSlotPreset(slotIndex, preset) {
    if (slotIndex < 0 || slotIndex >= this.options.slotCount) return;

    const slot = this.slots[slotIndex];
    slot.preset = preset;

    // Clear any existing parameter overrides when setting a new preset
    slot.parameterOverrides = {};

    // Set category color CSS variable
    if (preset && preset.category) {
      const category = PresetCategories[preset.category];
      if (preset.color) {
        slot.element.style.setProperty("--category-color", preset.color);
      } else if (category && category.color) {
        slot.element.style.setProperty("--category-color", category.color);
      } else {
        slot.element.style.removeProperty("--category-color");
      }
    } else if (preset && preset.color) {
      slot.element.style.setProperty("--category-color", preset.color);
    } else {
      slot.element.style.removeProperty("--category-color");
    }

    const previewContainer = slot.element.querySelector(".slot-preview");
    previewContainer.innerHTML = "";

    if (preset) {
      // Show preset preview
      const presetPreview = document.createElement("div");
      presetPreview.className = "preset-preview";

      // Preset icon (SVG or image)
      const iconContainer = document.createElement("div");
      iconContainer.className = "preset-icon";
      iconContainer.innerHTML =
        CUSTOM_STRUCTURE_ICONS[
          preset.icon || Object.keys(CUSTOM_STRUCTURE_ICONS)[0]
        ];
      iconContainer.style.color = preset.color || "var(--category-color)";
      presetPreview.appendChild(iconContainer);

      // Preset name label
      const nameLabel = document.createElement("div");
      nameLabel.className = "preset-name";
      nameLabel.textContent = preset.name;
      presetPreview.appendChild(nameLabel);

      // Variable parameter indicator (gear icon) - styled like preset dialog
      if (preset.variableParam) {
        const variableIndicator = document.createElement("div");
        variableIndicator.className = "slot-variable-indicator";
        variableIndicator.innerHTML = IconList.Settings;

        // Enhanced tooltip showing parameter name and current value
        const parameterName = preset.variableParam;
        const currentOverride = this.getSlotParameterOverride(
          slotIndex,
          parameterName,
        );
        const defaultValue = this.getDefaultParameterValue(
          preset,
          parameterName,
        );
        const effectiveValue = currentOverride || defaultValue;

        let tooltipText = `${
          types[parameterName]?.properties?.label ?? parameterName
        }`;
        if (effectiveValue) {
          // Get parameter type from types definition
          const paramType = types[parameterName];
          const parameterType = paramType
            ? paramType.properties.type
            : parameterName;

          if (parameterType === "text") {
            tooltipText += `\nCurrent: "${effectiveValue}"`;
          } else if (parameterType === "number") {
            tooltipText += `\nCurrent: ${effectiveValue}`;
          } else if (parameterType === "color") {
            tooltipText += `\nCurrent: ${effectiveValue}`;
          } else if (parameterType === "checkbox") {
            tooltipText += `\nCurrent: ${
              effectiveValue ? "Enabled" : "Disabled"
            }`;
          } else {
            // For other parameters, try to get the label from options
            if (
              paramType &&
              paramType.properties &&
              paramType.properties.options
            ) {
              const option = paramType.properties.options.find(
                (opt) => opt.value === effectiveValue,
              );
              const displayValue = option ? option.label : effectiveValue;
              tooltipText += `\nCurrent: ${displayValue}`;
            } else {
              tooltipText += `\nCurrent: ${effectiveValue}`;
            }
          }

          variableIndicator.setAttribute("titleTooltip", tooltipText);
        }

        presetPreview.appendChild(variableIndicator);
        presetPreview.style.paddingBottom = "18px";
      }

      // Parameter override value display at bottom
      const valueDisplay = document.createElement("div");
      valueDisplay.className = "slot-value-display";
      this.updateSlotValueDisplay(slotIndex, valueDisplay);
      presetPreview.appendChild(valueDisplay);

      // Edit icon for filled slots
      const editIcon = document.createElement("div");
      editIcon.className = "slot-edit-icon";
      editIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"/>
      </svg>`;
      presetPreview.appendChild(editIcon);

      previewContainer.appendChild(presetPreview);
    } else {
      // Show empty placeholder
      const placeholder = document.createElement("div");
      placeholder.className = "slot-placeholder";
      placeholder.textContent = "+";
      previewContainer.appendChild(placeholder);
    }

    // Update visual indicator
    this.updateSlotVisualIndicator(slotIndex);

    // Notify listeners of slot content changes
    this.emitSlotsChange();
  }

  getSelectedSlot() {
    return this.slots[this.selectedSlotIndex];
  }

  getSelectedPreset() {
    const selectedSlot = this.getSelectedSlot();
    return selectedSlot ? selectedSlot.preset : null;
  }

  clearSlot(slotIndex) {
    this.setSlotPreset(slotIndex, null);
  }

  // Parameter Override Methods
  setSlotParameterOverride(slotIndex, paramName, value) {
    if (slotIndex < 0 || slotIndex >= this.options.slotCount) return;

    const slot = this.slots[slotIndex];
    if (!slot.preset || !slot.preset.variableParam) return;

    // Set the override value
    slot.parameterOverrides[paramName] = value;

    // Update value display
    this.updateSlotValueDisplay(slotIndex);

    // Update gear icon tooltip
    this.updateSlotVariableTooltip(slotIndex);

    // Update visual indicator if needed
    this.updateSlotVisualIndicator(slotIndex);

    // Notify listeners of change
    this.emitSlotsChange();
  }

  getSlotParameterOverride(slotIndex, paramName) {
    if (slotIndex < 0 || slotIndex >= this.options.slotCount) return null;

    const slot = this.slots[slotIndex];
    return slot.parameterOverrides[paramName] || null;
  }

  updateSlotValueDisplay(slotIndex, valueDisplayElement = null) {
    if (slotIndex < 0 || slotIndex >= this.options.slotCount) return;

    const slot = this.slots[slotIndex];
    if (!slot.preset || !slot.preset.variableParam) return;

    // Find the value display element if not provided
    if (!valueDisplayElement) {
      valueDisplayElement = slot.element.querySelector(".slot-value-display");
    }

    if (!valueDisplayElement) return;

    const parameterName = slot.preset.variableParam;
    const overrideValue = this.getSlotParameterOverride(
      slotIndex,
      parameterName,
    );

    let displayValue,
      isDefault = false;

    // Get parameter type from types definition
    const paramType = types[parameterName];
    const parameterType = paramType ? paramType.properties.type : parameterName;

    if (parameterType === "text") {
      if (overrideValue) {
        displayValue = `"${overrideValue}"`;
      } else {
        // Show default value from preset data
        const defaultValue = this.getDefaultParameterValue(
          slot.preset,
          parameterName,
        );
        if (defaultValue) {
          displayValue = `"${defaultValue}"`;
          isDefault = true;
        }
      }
    } else if (parameterType === "number") {
      if (overrideValue !== null && overrideValue !== undefined) {
        displayValue = overrideValue.toString();
      } else {
        const defaultValue = this.getDefaultParameterValue(
          slot.preset,
          parameterName,
        );
        if (defaultValue !== null && defaultValue !== undefined) {
          displayValue = defaultValue.toString();
          isDefault = true;
        }
      }
    } else if (parameterType === "color") {
      if (overrideValue) {
        displayValue = overrideValue;
        // Add color preview dot
        valueDisplayElement.style.setProperty("--color-preview", overrideValue);
        valueDisplayElement.classList.add("has-color-preview");
      } else {
        const defaultValue = this.getDefaultParameterValue(
          slot.preset,
          parameterName,
        );
        if (defaultValue) {
          displayValue = defaultValue;
          valueDisplayElement.style.setProperty(
            "--color-preview",
            defaultValue,
          );
          valueDisplayElement.classList.add("has-color-preview");
          isDefault = true;
        }
      }
    } else if (parameterType === "checkbox") {
      const boolValue =
        overrideValue !== null && overrideValue !== undefined
          ? overrideValue
          : this.getDefaultParameterValue(slot.preset, parameterName);
      displayValue = boolValue ? "✓ Enabled" : "✗ Disabled";
      if (overrideValue === null || overrideValue === undefined) {
        isDefault = true;
      }
    } else {
      // Handle other parameter types with options
      if (!paramType || !paramType.properties.options) {
        valueDisplayElement.style.display = "none";
        return;
      }

      const options = paramType.properties.options;

      if (overrideValue) {
        // Show override value
        const option = options.find((opt) => opt.value === overrideValue);
        displayValue = option ? option.label : overrideValue;
      } else {
        // Show default value from preset data
        const defaultValue = this.getDefaultParameterValue(
          slot.preset,
          parameterName,
        );
        if (defaultValue) {
          const option = options.find((opt) => opt.value === defaultValue);
          displayValue = option ? option.label : defaultValue;
          isDefault = true;
        }
      }
    }

    if (displayValue) {
      valueDisplayElement.textContent = displayValue;
      valueDisplayElement.style.display = "block";

      // Same styling for both default and override values
      valueDisplayElement.style.background = "rgba(0, 0, 0, 0.8)";
      valueDisplayElement.style.color = "#ffffff";
    } else {
      valueDisplayElement.style.display = "none";
    }
  }

  getDefaultParameterValue(preset, paramName) {
    // Look for the default value in the preset's objects
    if (preset.objects && preset.objects.length > 0) {
      for (const obj of preset.objects) {
        if (obj.parameters && obj.parameters[paramName]) {
          return obj.parameters[paramName];
        }
      }
    }
    return null;
  }

  updateSlotVariableTooltip(slotIndex) {
    if (slotIndex < 0 || slotIndex >= this.options.slotCount) return;

    const slot = this.slots[slotIndex];
    if (!slot.preset || !slot.preset.variableParam) return;

    // Find the variable indicator element
    const variableIndicator = slot.element.querySelector(
      ".slot-variable-indicator",
    );
    if (!variableIndicator) return;

    const parameterName = slot.preset.variableParam;
    const currentOverride = this.getSlotParameterOverride(
      slotIndex,
      parameterName,
    );
    const defaultValue = this.getDefaultParameterValue(
      slot.preset,
      parameterName,
    );
    const effectiveValue = currentOverride || defaultValue;

    let tooltipText = `${
      types[parameterName]?.properties?.label ?? parameterName
    }`;
    if (effectiveValue !== null && effectiveValue !== undefined) {
      // Get parameter type from types definition
      const paramType = types[parameterName];
      const parameterType = paramType
        ? paramType.properties.type
        : parameterName;

      if (parameterType === "text") {
        tooltipText += `\nCurrent: "${effectiveValue}"`;
      } else if (parameterType === "number") {
        tooltipText += `\nCurrent: ${effectiveValue}`;
      } else if (parameterType === "color") {
        tooltipText += `\nCurrent: ${effectiveValue}`;
      } else if (parameterType === "checkbox") {
        tooltipText += `\nCurrent: ${effectiveValue ? "Enabled" : "Disabled"}`;
      } else {
        // For other parameters, try to get the label from options
        if (paramType && paramType.properties && paramType.properties.options) {
          const option = paramType.properties.options.find(
            (opt) => opt.value === effectiveValue,
          );
          const displayValue = option ? option.label : effectiveValue;
          tooltipText += `\nCurrent: ${displayValue}`;
        } else {
          tooltipText += `\nCurrent: ${effectiveValue}`;
        }
      }
    }

    variableIndicator.setAttribute("titleTooltip", tooltipText);
  }

  getEffectiveSlotPreset(slotIndex) {
    if (slotIndex < 0 || slotIndex >= this.options.slotCount) return null;

    const slot = this.slots[slotIndex];
    if (!slot.preset) return null;

    // If there are no overrides, return the original preset
    if (Object.keys(slot.parameterOverrides).length === 0) {
      return slot.preset;
    }

    // Create a deep copy of the preset with parameter overrides applied
    const effectivePreset = JSON.parse(JSON.stringify(slot.preset));

    // Apply parameter overrides to each object in the preset
    if (effectivePreset.objects) {
      for (const obj of effectivePreset.objects) {
        if (obj.parameters) {
          for (const [paramName, value] of Object.entries(
            slot.parameterOverrides,
          )) {
            obj.parameters[types[paramName].properties.key] = value;
          }
        }
      }
    }

    return effectivePreset;
  }

  updateSlotVisualIndicator(slotIndex) {
    if (slotIndex < 0 || slotIndex >= this.options.slotCount) return;

    const slot = this.slots[slotIndex];
    const hasOverrides = Object.keys(slot.parameterOverrides).length > 0;

    // Update value display to reflect override status
    this.updateSlotValueDisplay(slotIndex);
  }

  clearAllSlots() {
    for (let i = 0; i < this.options.slotCount; i++) {
      this.clearSlot(i);
    }
  }

  clearInvalidCustomStructureSlots() {
    const projectManager = globalThis._editorScope?.projectManager;
    const presetManager = globalThis._editorScope?.placingSystem?.presetManager;
    const builtInPresetIds = new Set(
      (presetManager?.getAllPresets?.() || []).map((p) => p.id),
    );
    let customStructures = [];

    if (projectManager && projectManager.hasProjectLoaded()) {
      // Use project data
      const sharedData = projectManager.getSharedData();
      customStructures = sharedData.customStructures || [];
    } else {
      // No project loaded - clear all custom structure slots
      // But preserve any built-in presets
      let changed = false;
      this.slots.forEach((slot, index) => {
        const id = slot?.preset?.id;
        if (!id) return;
        // If this is NOT a built-in preset, treat it as custom and clear it
        if (!builtInPresetIds.has(id)) {
          this.setSlotPreset(index, null);
          changed = true;
        }
      });
      if (changed) {
        this.emitSlotsChange();
      }
      return;
    }

    const validCustomStructureIds = new Set(customStructures.map((s) => s.id));

    // Check each slot and clear any that reference deleted custom structures
    let changed = false;
    this.slots.forEach((slot, index) => {
      const id = slot?.preset?.id;
      if (!id) return;
      // If it's a built-in preset, always keep it
      if (builtInPresetIds.has(id)) return;
      // Otherwise treat as custom structure; clear if it's no longer valid
      if (!validCustomStructureIds.has(id)) {
        this.setSlotPreset(index, null);
        changed = true;
      }
    });
    if (changed) this.emitSlotsChange();
  }

  setSlotCount(newCount) {
    if (newCount < 1 || newCount > 10) return; // Reasonable limits

    const oldCount = this.options.slotCount;
    this.options.slotCount = newCount;

    const slotsContainer = this.inventoryBar.querySelector(".inventory-slots");

    if (newCount > oldCount) {
      // Add new slots
      for (let i = oldCount; i < newCount; i++) {
        const slot = this.createSlot(i);
        this.slots.push({
          element: slot,
          preset: null,
          index: i,
        });
        slotsContainer.appendChild(slot);
      }
    } else if (newCount < oldCount) {
      // Remove excess slots
      for (let i = newCount; i < oldCount; i++) {
        const slot = this.slots[i];
        if (slot && slot.element.parentNode) {
          slot.element.parentNode.removeChild(slot.element);
        }
      }
      this.slots = this.slots.slice(0, newCount);

      // Adjust selected slot if necessary
      if (this.selectedSlotIndex >= newCount) {
        this.selectSlot(newCount - 1);
      }
    }

    this.updateDisplay();
    this.emitSlotsChange();
  }

  show() {
    this.isVisible = true;
    this.inventoryBar.classList.add("visible");

    // Clean up any invalid custom structure slots when showing
    this.clearInvalidCustomStructureSlots();
  }

  hide() {
    this.isVisible = false;
    this.inventoryBar.classList.remove("visible");
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  updateDisplay() {
    // Refresh the visual state
    this.selectSlot(this.selectedSlotIndex);
  }

  isInputFocused() {
    const activeElement = document.activeElement;
    return (
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.contentEditable === "true")
    );
  }

  applyStyles() {
    if (!document.querySelector("#inventory-bar-styles")) {
      const style = document.createElement("style");
      style.id = "inventory-bar-styles";
      style.textContent = `
        .inventory-bar {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 900;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          pointer-events: none;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .inventory-bar.inspector-open {
          left: calc(50% - 175px);
        }

        .inventory-bar.visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }

        .inventory-slots {
          display: flex;
          gap: 8px;
          padding: 12px;
          background: rgba(26, 26, 26, 0.95);
          border: 1px solid ${Theme.borderPrimary};
          border-radius: 4px;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .inventory-slot {
          position: relative;
          width: 90px;
          height: 80px;
          background: ${Theme.componentBackground};
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          user-select: none;
        }

        .inventory-slot:hover {
          border-color: ${Theme.borderFocus};
          background: ${Theme.componentHoverBackground};
        }

        .inventory-slot.selected {
          border-color: ${Theme.primary};
          background: ${Theme.componentHoverBackground};
          box-shadow: 0 0 12px rgba(74, 158, 255, 0.3);
        }

        .slot-number {
          position: absolute;
          top: 2px;
          left: 4px;
          font-size: 12px;
          font-weight: 700;
          color: ${Theme.textSecondary};
          background: rgba(0, 0, 0, 0.7);
          padding: 1px 4px;
          border-radius: 0px;
          line-height: 1;
        }

        .inventory-slot.selected .slot-number {
          color: ${Theme.primary};
        }

        .slot-preview {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .slot-placeholder {
          font-size: 24px;
          font-weight: 300;
          color: ${Theme.textMuted};
          opacity: 0.6;
        }

        .preset-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          padding: 4px;
          box-sizing: border-box;
        }

        .preset-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2px;
        }

        .preset-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 2px;
        }

        .preset-icon svg {
          width: 100%;
          height: 100%;
        }

        .preset-icon-text {
          background: var(--category-color);
          color: white;
          border-radius: 0px;
          font-size: 18px;
          font-weight: 700;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preset-name {
          font-size: 12px;
          font-weight: 600;
          color: ${Theme.textPrimary};
          text-align: center;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .slot-edit-icon {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 20px;
          height: 20px;
          background: rgba(74, 158, 255, 0.9);
          border-radius: 0px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .inventory-slot:hover .slot-edit-icon {
          opacity: 1;
        }

        .slot-edit-icon:hover {
          background: ${Theme.primaryHover};
          transform: scale(1.1);
        }

        .slot-edit-icon svg {
          width: 14px;
          height: 14px;
          fill: white;
        }

        /* Variable parameter indicator - styled like preset dialog */
        .slot-variable-indicator {
          position: absolute;
          bottom: 0px;
          left: 0px;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          color: var(--category-color, ${Theme.primary});
          border: 1px solid var(--category-color, ${Theme.primary});
          border-radius: 0px;
          cursor: pointer;
          z-index: 11;
          transition: all 0.2s ease;
        }

        .slot-variable-indicator:hover {
          background: var(--category-color, ${Theme.primary});
          color: white;
          transform: scale(1.1);
        }

        .slot-variable-indicator svg {
          width: 12px;
          height: 12px;
          fill: currentColor;
        }

        .slot-variable-indicator[titleTooltip]::after {
          pointer-events: none;
          content: attr(titleTooltip);
          position: absolute;
          bottom: 150%;
          transform: translateY(-4px);
          white-space: pre;
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

        .slot-variable-indicator[titleTooltip]:hover::after {
          opacity: 1;
        }

        .slot-variable-indicator[titleTooltip]::before {
          content: "";
          position: absolute;
          left: 25%;
          bottom: 88%;
          transform: translateY(-4px);
          border: 5px solid transparent;
          border-top-color: var(--category-color, ${Theme.primary});
          z-index: 9;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .slot-variable-indicator[titleTooltip]:hover::before {
          opacity: 1;
        }

        /* Value display at bottom of slot */
        .slot-value-display {
          position: absolute;
          bottom: 0px;
          left: 18px;
          right: 0px;
          color: ${Theme.textPrimary};
          font-size: 10px;
          font-weight: 600;
          text-align: left;
          padding: 1px 3px;
          border-radius: 0px;
          z-index: 5;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        /* Show value display for all variable parameter slots */
        .slot-value-display {
          display: block;
        }

        /* Parameter Tooltip - styled like inspector SelectorComponent */
        .slot-parameter-tooltip {
          position: fixed;
          background: ${Theme.sidebarBackground};
          border: 1px solid ${Theme.primary};
          border-radius: 0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.5);
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transform: translateY(4px);
          transition: opacity 0.15s, transform 0.15s ease-out, visibility 0.15s;
          width: 300px;
          max-height: 400px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .slot-parameter-tooltip::before {
          content: '';
          position: absolute;
          left: var(--arrow-left, 50%);
          bottom: -10px;
          margin-left: -5px;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 10px 8px 0 8px;
          border-color: ${Theme.primary} transparent transparent transparent;
        }

        .slot-parameter-tooltip::after {
          content: '';
          position: absolute;
          left: var(--arrow-left, 50%);
          bottom: -8px;
          margin-left: -4px;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 9px 7px 0 7px;
          border-color: ${Theme.sidebarBackground} transparent transparent transparent;
        }

        .slot-parameter-tooltip.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .slot-parameter-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          padding: 12px;
          max-height: 340px;
          overflow-y: auto;
        }

        .slot-parameter-grid::-webkit-scrollbar { width: 10px; }
        .slot-parameter-grid::-webkit-scrollbar-track { background: ${Theme.scrollbarTrack}; }
        .slot-parameter-grid::-webkit-scrollbar-thumb {
          background: ${Theme.scrollbarThumb};
          border: 3px solid ${Theme.scrollbarTrack};
          background-clip: content-box;
        }

        .slot-parameter-item {
          text-align: center;
          padding: 10px;
          border: 1px solid ${Theme.borderPrimary};
          border-radius: 0;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          background: ${Theme.itemBackground};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .slot-parameter-item.selected {
          border-color: ${Theme.borderFocus};
        }

        .slot-parameter-item:hover {
          border-color: ${Theme.borderFocus};
          background: ${Theme.itemHoverBackground};
        }
        
        .slot-parameter-item .css-cube {
          margin-bottom: 16px !important;
          margin-top: 4px !important;
        }

        .slot-parameter-item img {
          max-width: 100%;
          max-height: 80px;
          object-fit: contain;
          border-radius: 0;
          margin-bottom: 8px;
          border: 1px solid ${Theme.borderPrimary};
        }

        .slot-parameter-item svg {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          margin-bottom: 8px;
          border: 1px solid ${Theme.borderSecondary};
          background: ${Theme.componentBackground};
        }

        .parameter-cube-display {
          width: 48px;
          height: 48px;
          border-radius: 2px;
          margin-bottom: 8px;
          border: 1px solid ${Theme.borderSecondary};
          background: ${Theme.componentBackground};
        }

        .slot-parameter-label {
          font-size: 0.7rem;
          color: ${Theme.textPrimary};
          font-weight: 600;
          line-height: 1.2;
          text-transform: uppercase;
          height: 2em;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Text input tooltip styles */
        .text-input-tooltip {
          width: 280px !important;
          max-height: 200px !important;
        }

        .text-input-container {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .text-input-label {
          font-size: 0.9rem;
          color: ${Theme.textPrimary};
          font-weight: 600;
          margin-bottom: 4px;
        }

        .text-input-field {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0;
          background: ${Theme.componentBackground};
          color: ${Theme.textPrimary};
          font-size: 0.9rem;
          font-family: inherit;
          box-sizing: border-box;
        }

        .text-input-field:focus {
          outline: none;
          border-color: ${Theme.borderFocus};
          background: ${Theme.inputBackground};
        }

        .text-input-buttons {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .text-input-confirm,
        .text-input-cancel {
          padding: 6px 16px;
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0;
          background: ${Theme.componentBackground};
          color: ${Theme.textPrimary};
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }

        .text-input-confirm {
          background: ${Theme.primary};
          color: white;
          border-color: ${Theme.primary};
        }

        .text-input-confirm:hover {
          background: ${Theme.primaryHover};
          border-color: ${Theme.primaryHover};
        }

        .text-input-cancel:hover {
          background: ${Theme.itemHoverBackground};
          border-color: ${Theme.borderFocus};
        }

        /* Number input tooltip styles */
        .number-input-tooltip {
          width: 280px !important;
          max-height: 200px !important;
        }

        .number-input-container {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .number-input-label {
          font-size: 0.9rem;
          color: ${Theme.textPrimary};
          font-weight: 600;
          margin-bottom: 4px;
        }

        .number-input-field {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0;
          background: ${Theme.componentBackground};
          color: ${Theme.textPrimary};
          font-size: 0.9rem;
          font-family: inherit;
          box-sizing: border-box;
        }

        .number-input-field:focus {
          outline: none;
          border-color: ${Theme.borderFocus};
          background: ${Theme.inputBackground};
        }

        .number-input-buttons {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .number-input-confirm,
        .number-input-cancel {
          padding: 6px 16px;
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0;
          background: ${Theme.componentBackground};
          color: ${Theme.textPrimary};
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }

        .number-input-confirm {
          background: ${Theme.primary};
          color: white;
          border-color: ${Theme.primary};
        }

        .number-input-confirm:hover {
          background: ${Theme.primaryHover};
          border-color: ${Theme.primaryHover};
        }

        .number-input-cancel:hover {
          background: ${Theme.itemHoverBackground};
          border-color: ${Theme.borderFocus};
        }

        /* Color input tooltip styles */
        .color-input-tooltip {
          width: 280px !important;
          max-height: 200px !important;
        }

        .color-input-container {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .color-input-label {
          font-size: 0.9rem;
          color: ${Theme.textPrimary};
          font-weight: 600;
          margin-bottom: 4px;
        }

        .color-input-field {
          width: 100%;
          height: 40px;
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0;
          background: ${Theme.componentBackground};
          cursor: pointer;
          box-sizing: border-box;
        }

        .color-input-field:focus {
          outline: none;
          border-color: ${Theme.borderFocus};
        }

        .color-input-buttons {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .color-input-confirm,
        .color-input-cancel {
          padding: 6px 16px;
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0;
          background: ${Theme.componentBackground};
          color: ${Theme.textPrimary};
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }

        .color-input-confirm {
          background: ${Theme.primary};
          color: white;
          border-color: ${Theme.primary};
        }

        .color-input-confirm:hover {
          background: ${Theme.primaryHover};
          border-color: ${Theme.primaryHover};
        }

        .color-input-cancel:hover {
          background: ${Theme.itemHoverBackground};
          border-color: ${Theme.borderFocus};
        }

        /* Checkbox tooltip styles */
        .checkbox-tooltip {
          width: 250px !important;
          max-height: 180px !important;
        }

        .checkbox-container {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .checkbox-field {
          width: 16px;
          height: 16px;
          accent-color: ${Theme.primary};
        }

        .checkbox-label {
          font-size: 0.9rem;
          color: ${Theme.textPrimary};
          font-weight: 600;
          cursor: pointer;
        }

        .checkbox-buttons {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .checkbox-confirm,
        .checkbox-cancel {
          padding: 6px 16px;
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0;
          background: ${Theme.componentBackground};
          color: ${Theme.textPrimary};
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }

        .checkbox-confirm {
          background: ${Theme.primary};
          color: white;
          border-color: ${Theme.primary};
        }

        .checkbox-confirm:hover {
          background: ${Theme.primaryHover};
          border-color: ${Theme.primaryHover};
        }

        .checkbox-cancel:hover {
          background: ${Theme.itemHoverBackground};
          border-color: ${Theme.borderFocus};
        }

        /* Color preview in slot value display */
        .slot-value-display.has-color-preview::before {
          content: '';
          display: inline-block;
          width: 12px;
          height: 12px;
          background: var(--color-preview, #ffffff);
          border: 1px solid rgba(255, 255, 255, 0.3);
          margin-right: 2px;
          vertical-align: middle;
        }

        /* Animation when preset is added */
        .preset-preview {
          animation: presetAdded 0.3s ease;
        }

        @keyframes presetAdded {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  destroy() {
    // Clean up parameter tooltip
    this.closeParameterTooltip();

    if (this.inventoryBar && this.inventoryBar.parentNode) {
      this.inventoryBar.parentNode.removeChild(this.inventoryBar);
    }

    const styles = document.querySelector("#inventory-bar-styles");
    if (styles) {
      styles.remove();
    }
    if (this.boundKeyDown) {
      document.removeEventListener("keydown", this.boundKeyDown);
    }
    this.boundKeyDown = null;
    if (this.boundWheel) {
      this.inventoryBar.removeEventListener("wheel", this.boundWheel);
    }
    this.boundWheel = null;
  }

  // Change notification helpers
  emitSlotsChange() {
    if (this._suppressChangeEvents) return;
    if (typeof this.onSlotsChange === "function") {
      try {
        this.onSlotsChange(this.getPresetIds());
      } catch (err) {
        console.error("[InventoryBar] onSlotsChange callback failed:", err);
      }
    }
  }

  setSuppressChangeEvents(suppress) {
    this._suppressChangeEvents = !!suppress;
  }

  getPresetIds() {
    return this.slots.map((slot) => {
      if (!slot?.preset) return null;

      const slotData = {
        id: slot.preset.id || null,
        parameterOverrides:
          Object.keys(slot.parameterOverrides).length > 0
            ? slot.parameterOverrides
            : undefined,
      };

      return slotData;
    });
  }

  setupInspectorIntegration() {
    // Listen for inspector UI state changes
    const checkInspectorState = () => {
      const inspectorUI = globalThis._editorScope?.inspectorUI;
      if (inspectorUI && this.inventoryBar) {
        if (inspectorUI.isVisible) {
          this.inventoryBar.classList.add("inspector-open");
        } else {
          this.inventoryBar.classList.remove("inspector-open");
        }
      }
    };

    // Check periodically for inspector state changes
    setInterval(checkInspectorState, 100);

    // Initial check
    setTimeout(checkInspectorState, 500);
  }
}

// Global inventory bar instance
export let inventoryBar = null;

// Helper function to initialize the inventory bar
export function initializeInventoryBar(
  container = document.body,
  options = {},
) {
  if (!inventoryBar) {
    inventoryBar = new InventoryBar(container, options);
  }
  return inventoryBar;
}

export function destroyInventoryBar() {
  if (inventoryBar) {
    inventoryBar.destroy();
    inventoryBar = null;
  }
}

// Helper functions for integration
export function showInventoryBar() {
  if (inventoryBar) {
    inventoryBar.show();
  }
}

export function hideInventoryBar() {
  if (inventoryBar) {
    inventoryBar.hide();
  }
}

export function getSelectedPreset() {
  if (inventoryBar) {
    return inventoryBar.getSelectedPreset();
  }
  return null;
}

export function getSelectedEffectivePreset() {
  if (inventoryBar) {
    const selectedSlotIndex = inventoryBar.selectedSlotIndex;
    return inventoryBar.getEffectiveSlotPreset(selectedSlotIndex);
  }
  return null;
}

export function setSelectedSlotParameterOverride(paramName, value) {
  if (inventoryBar) {
    const selectedSlotIndex = inventoryBar.selectedSlotIndex;
    inventoryBar.setSlotParameterOverride(selectedSlotIndex, paramName, value);
  }
}
