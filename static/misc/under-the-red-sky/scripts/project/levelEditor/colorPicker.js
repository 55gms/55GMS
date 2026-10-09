import { Theme } from "./inspectorUI.js";
// Normalize any color form (hex / {r,g,b} / {h,s,l} / [r,g,b], 0–1) to a hex string.
import { toHex as colorToHex } from "./scripting/api/color.js";
import {
  PRESET_COLORS,
  getPresetColors,
  getRecentColors,
  getRecentColorsLimit,
} from "./paletteColors.js";

// Re-export the canonical palette default so existing
// `import { PRESET_COLORS } from "./colorPicker.js"` consumers keep working.
export { PRESET_COLORS };

export class ColorPicker {
  constructor(options = {}) {
    this.onChange = options.onChange || (() => {});
    this.value =
      options.value != null
        ? typeof options.value === "string"
          ? options.value
          : colorToHex(options.value)
        : this.getDefaultColor();
    this.showHexInput = options.showHexInput ?? true; // Default to true
    this.recentColors = this.loadRecentColors();
    this.presetColors = this.loadPresetColors();
    this.element = null;
    this.hexInput = null;
    this.popup = null;
    this.isOpen = false;
    this.isVaries = false;
    this.variesSymbol = "<varies>";
    this.isDisabled = options.disabled || false;

    this.applyStyles();
    this.setupProjectListeners();
  }

  loadRecentColors() {
    return getRecentColors();
  }

  loadPresetColors() {
    return getPresetColors();
  }

  getDefaultColor() {
    const presetColors = this.loadPresetColors();
    return presetColors.length > 0 ? presetColors[0] : PRESET_COLORS[0].value;
  }

  saveRecentColors() {
    const projectManager = globalThis._editorScope?.projectManager;

    if (projectManager && projectManager.hasProjectLoaded()) {
      // Use project data
      try {
        projectManager.updateSharedData({ recentColors: this.recentColors });
      } catch (e) {
        console.warn("Failed to save recent colors to project:", e);
      }
    } else {
      // No project loaded - cannot save recent colors
      console.log("No project loaded - recent colors not saved");
    }
  }

  addRecentColor(color) {
    // Remove if already exists
    this.recentColors = this.recentColors.filter((c) => c !== color);
    // Add to front
    this.recentColors.unshift(color);

    // Get the max recent colors limit from project settings
    const maxRecentColors = getRecentColorsLimit();

    // Keep only last N colors
    this.recentColors = this.recentColors.slice(0, maxRecentColors);
    this.saveRecentColors();
  }

  createColorButton(color, isPreset = false) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "color-picker-btn";
    btn.style.backgroundColor = color;
    btn.title = color.toUpperCase();
    if (color === this.value) {
      btn.classList.add("selected");
    }

    btn.addEventListener("click", () => {
      this.setValue(color);
      if (!isPreset) {
        this.addRecentColor(color);
      }
      this.closePopup();
    });

    return btn;
  }

  createPopup() {
    const popup = document.createElement("div");
    popup.className = "color-picker-popup";

    // Block propagation when clicking inside the popup
    ["click", "mousedown", "mouseup"].forEach((event) => {
      popup.addEventListener(event, (e) => {
        e.stopPropagation();
      });
    });

    // Preset colors section
    const presetSection = document.createElement("div");
    presetSection.className = "color-picker-section";

    const presetLabel = document.createElement("div");
    presetLabel.className = "color-picker-label";
    presetLabel.textContent = "Preset Colors";
    presetSection.appendChild(presetLabel);

    const presetGrid = document.createElement("div");
    presetGrid.className = "color-picker-grid";
    this.presetColors.forEach((color) => {
      presetGrid.appendChild(this.createColorButton(color, true));
    });
    presetSection.appendChild(presetGrid);
    popup.appendChild(presetSection);

    // Recent colors section (if any)
    if (this.recentColors.length > 0) {
      const recentSection = document.createElement("div");
      recentSection.className = "color-picker-section";

      const recentLabel = document.createElement("div");
      recentLabel.className = "color-picker-label";
      recentLabel.textContent = "Recent Colors";
      recentSection.appendChild(recentLabel);

      const recentGrid = document.createElement("div");
      recentGrid.className = "color-picker-grid";
      this.recentColors.forEach((color) => {
        recentGrid.appendChild(this.createColorButton(color));
      });
      recentSection.appendChild(recentGrid);
      popup.appendChild(recentSection);
    }

    // Custom color picker section
    const customSection = document.createElement("div");
    customSection.className = "color-picker-section";

    const customLabel = document.createElement("div");
    customLabel.className = "color-picker-label";
    customLabel.textContent = "Custom Color";
    customSection.appendChild(customLabel);

    const customInput = document.createElement("input");
    customInput.type = "color";
    customInput.className = "color-picker-input";
    customInput.value = this.value;
    customInput.addEventListener("input", (e) => {
      this.setValue(e.target.value);
    });
    customInput.addEventListener("change", (e) => {
      this.setValue(e.target.value);
      this.addRecentColor(e.target.value);
      this.closePopup();
    });
    customSection.appendChild(customInput);
    popup.appendChild(customSection);

    return popup;
  }

  showPopup() {
    if (this.isOpen) return;

    this.popup = this.createPopup();
    document.body.appendChild(this.popup);
    this.isOpen = true;

    // Position popup above the color picker
    const rect = this.element.getBoundingClientRect();
    this.popup.style.bottom = `${window.innerHeight - rect.top + 8}px`;
    this.popup.style.left = `${rect.left}px`;

    // Add click outside handler
    this.clickOutsideHandler = (e) => {
      if (!this.popup.contains(e.target) && !this.element.contains(e.target)) {
        this.closePopup();
      }
    };
    document.addEventListener("pointerdown", this.clickOutsideHandler);

    // Animate in
    requestAnimationFrame(() => {
      this.popup.classList.add("visible");
    });
  }

  closePopup() {
    if (!this.isOpen) return;

    this.popup.classList.remove("visible");
    this.isOpen = false;

    // Remove click outside handler
    document.removeEventListener("pointerdown", this.clickOutsideHandler);
    this.clickOutsideHandler = null;

    setTimeout(() => {
      if (this.popup && this.popup.parentNode) {
        this.popup.parentNode.removeChild(this.popup);
      }
      this.popup = null;
    }, 200);
  }

  setValue(color) {
    if (!color) return;
    // Accept any color form: non-strings (rgb/hsl/array) become hex. A hex string
    // passes through unchanged so equality checks (and the updateUI round-trip:
    // setValue → onChange guard `color !== config.value`) stay stable — converting
    // it (e.g. changing case) would make the guard always fire and loop forever.
    if (typeof color !== "string") color = colorToHex(color);
    this.value = color;
    this.isVaries = false;
    if (this.element) {
      this.element.style.backgroundColor = color;
      this.element.classList.remove("varies");
      // Update hex input if it exists
      if (this.showHexInput) {
        this.hexInput.value = color.toUpperCase();
        this.hexInput.placeholder = "";
        this.hexInput.style.color = "";
        this.hexInput.style.borderColor = "";
      }
    }
    this.onChange(color);
  }

  setVariesState() {
    this.isVaries = true;
    if (this.element) {
      this.element.style.backgroundColor = "#333333";
      this.element.classList.add("varies");
      // Update hex input to show varies state
      if (this.showHexInput) {
        this.hexInput.classList.add("varies");
        this.hexInput.value = "";
        this.hexInput.placeholder = this.variesSymbol;
        this.hexInput.style.color = "#FFB844";
        this.hexInput.style.borderColor = "#FFB844";
      }
    }
  }

  clearVariesState(newValue = null) {
    if (this.isVaries) {
      this.isVaries = false;
      if (this.element) {
        this.element.classList.remove("varies");
        if (this.showHexInput) {
          this.hexInput.classList.remove("varies");
          this.hexInput.style.color = "";
          this.hexInput.style.borderColor = "";
          this.hexInput.placeholder = "";
        }
      }
      if (newValue) {
        this.setValue(newValue);
      }
    }
  }

  setDisabled(disabled) {
    this.isDisabled = disabled;
    if (this.element) {
      this.element.disabled = disabled;
      this.element.classList.toggle("disabled", disabled);
      if (this.showHexInput && this.hexInput) {
        this.hexInput.disabled = disabled;
      }
    }
    // Close popup if disabled
    if (disabled && this.isOpen) {
      this.closePopup();
    }
  }

  getDisabled() {
    return this.isDisabled;
  }

  mount(container) {
    // Create wrapper for color picker and hex input
    const wrapper = document.createElement("div");
    wrapper.className = "color-picker-wrapper";

    // Create color button
    this.element = document.createElement("button");
    this.element.type = "button";
    this.element.className = "color-picker";
    this.element.style.backgroundColor = this.value;
    this.element.disabled = this.isDisabled;
    if (this.isDisabled) {
      this.element.classList.add("disabled");
    }

    this.element.addEventListener("click", () => {
      if (this.isDisabled) return;
      if (this.isOpen) {
        this.closePopup();
      } else {
        this.showPopup();
      }
    });

    wrapper.appendChild(this.element);

    // Create hex input if enabled
    if (this.showHexInput) {
      this.hexInput = document.createElement("input");
      this.hexInput.type = "text";
      this.hexInput.className = "color-picker-hex";
      this.hexInput.value = this.value.toUpperCase();
      this.hexInput.disabled = this.isDisabled;
      this.hexInput.addEventListener("input", (e) => {
        if (this.isDisabled) return;
        let value = e.target.value;
        // Clear varies state when user starts typing
        if (this.isVaries && value) {
          this.clearVariesState();
        }
        // Add # if missing
        if (value && !value.startsWith("#")) {
          value = "#" + value;
          this.hexInput.value = value;
        }
        // Update color as soon as it's valid
        if (/^#[0-9A-F]{6}$/i.test(value)) {
          this.setValue(value);
        }
      });
      this.hexInput.addEventListener("focus", () => {
        if (this.isDisabled) return;
        // Clear input value when varies state is active
        if (this.isVaries) {
          this.hexInput.value = "";
        }
      });
      this.hexInput.addEventListener("blur", () => {
        if (this.isDisabled) return;
        // Reset to current value if invalid or varies state is active
        if (this.isVaries) {
          this.hexInput.value = "";
        } else {
          this.hexInput.value = this.value.toUpperCase();
        }
      });
      this.hexInput.addEventListener("keydown", (e) => {
        e.stopPropagation();
      });
      wrapper.appendChild(this.hexInput);
    }

    container.appendChild(wrapper);

    // Add escape key handler
    this.boundKeyDown = (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closePopup();
      }
    };

    document.addEventListener("keydown", this.boundKeyDown);

    return wrapper;
  }

  setupProjectListeners() {
    // Listen for project changes to reload colors
    const projectManager = globalThis._editorScope?.projectManager;
    if (projectManager) {
      projectManager.addEventListener("projectLoaded", () => {
        this.recentColors = this.loadRecentColors();
        this.presetColors = this.loadPresetColors();
      });
      projectManager.addEventListener("projectCreated", () => {
        this.recentColors = this.loadRecentColors();
        this.presetColors = this.loadPresetColors();
      });
      projectManager.addEventListener("sharedDataChanged", () => {
        this.recentColors = this.loadRecentColors();
        this.presetColors = this.loadPresetColors();
      });
    }
  }

  applyStyles() {
    if (document.querySelector("#color-picker-styles")) return;

    const style = document.createElement("style");
    style.id = "color-picker-styles";
    style.textContent = `
      .color-picker-wrapper {
        display: flex;
        align-items: center;
        gap: 6px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .color-picker {
        width: 32px;
        height: 32px;
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 0;
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 0;
        position: relative;
        flex-shrink: 0;
      }

      .color-picker:hover {
        border-color: ${Theme.borderFocus};
        transform: translateY(-1px);
      }

      .color-picker.varies {
        border-color: #FFB844;
        opacity: 0.8;
      }

      .color-picker.varies::after {
        content: '~';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #FFB844;
        font-weight: bold;
        font-size: 14px;
        pointer-events: none;
      }

      .color-picker.disabled,
      .color-picker:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      .color-picker.disabled:hover,
      .color-picker:disabled:hover {
        border-color: ${Theme.borderSecondary};
        transform: none;
      }

      .color-picker-hex {
        width: 80px;
        height: 32px;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 0;
        color: ${Theme.textPrimary};
        font-family: inherit;
        font-size: 0.9rem;
        padding: 0 8px;
        text-transform: uppercase;
      }

      .color-picker-hex.varies::placeholder {
        text-transform: none;
      }

      .color-picker-hex:focus {
        border-color: ${Theme.borderFocus};
        outline: none;
      }

      .color-picker-hex:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: ${Theme.componentDisabledBackground};
        color: ${Theme.textMuted};
      }

      .color-picker-popup {
        position: fixed;
        background: ${Theme.sidebarBackground};
        border: 1px solid ${Theme.borderPrimary};
        border-radius: 0;
        padding: 12px;
        min-width: 180px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transform: translateY(4px);
        transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
        z-index: 10000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .color-picker-popup.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .color-picker-section {
        margin-bottom: 12px;
      }

      .color-picker-section:last-child {
        margin-bottom: 0;
      }

      .color-picker-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: ${Theme.textSecondary};
        margin-bottom: 8px;
      }

      .color-picker-grid {
        display: grid;
        grid-template-columns: repeat(6, 24px);
        justify-content: start;
        gap: 4px;
      }

      .color-picker-btn {
        width: 24px;
        height: 24px;
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 0;
        cursor: pointer;
        transition: all 0.15s ease;
        padding: 0;
      }

      .color-picker-btn:hover {
        border-color: ${Theme.borderFocus};
        transform: translateY(-1px);
      }

      .color-picker-btn.selected {
        border-color: ${Theme.primary};
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .color-picker-input {
        width: 100%;
        height: 32px;
        padding: 0;
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 0;
        cursor: pointer;
        background: ${Theme.inputBackground};
        transition: border-color 0.15s ease;
      }

      .color-picker-input:hover {
        border-color: ${Theme.borderFocus};
      }

      .color-picker-input::-webkit-color-swatch-wrapper {
        padding: 0;
      }

      .color-picker-input::-webkit-color-swatch {
        border: none;
        border-radius: 0;
      }
    `;
    document.head.appendChild(style);
  }

  destroy() {
    if (this.popup) {
      this.closePopup();
    }
    if (this.element && this.element.parentNode) {
      // Remove the whole wrapper
      const wrapper = this.element.parentNode;
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    }
    if (this.boundKeyDown) {
      document.removeEventListener("keydown", this.boundKeyDown);
    }
    if (this.clickOutsideHandler) {
      document.removeEventListener("pointerdown", this.clickOutsideHandler);
    }
  }
}
