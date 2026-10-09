// Advanced Inspector UI System for Level Editor
// Provides dynamic object property editing with type-specific components

import {
  getObjectTypeName,
  ObjectTypeDefinitions,
  groups as propertyGroups,
} from "./objectTypeDefinitions.js";
import {
  levelSettingsTypes,
  levelSettingsGroups,
} from "./levelSettingsDefinitions.js";
import { ColorPicker } from "./colorPicker.js";
import { showConfirmDialog } from "./confirmDialog.js";
import { createCSSCube, loadCubeFaces } from "./imageHelper.js";
import { getLabelsManager } from "./labels/labelsManager.js";
import { varComponentConfig } from "./labels/labelVarTypes.js";
import { showLabelsDictionaryDialog } from "./labels/labelsDictionaryDialog.js";
import { showLabelVarsDialog } from "./labels/labelVarsDialog.js";
import { showMaterialsDialog } from "./materials/materialsDialog.js";
import * as Icons from "./iconList.js";

// ============================================
// CONSTANTS AND THEME
// ============================================
const VARIES_SYMBOL = "<varies>";

export const Theme = {
  // Primary Colors
  primary: "#4A9EFF",
  primaryHover: "#66B3FF",
  primaryDark: "#3A8EEF",

  // Background Colors
  bodyBackground: "#2a2a2a",
  sidebarBackground: "#1a1a1a",
  componentBackground: "#333333",
  componentHoverBackground: "#3a3a3a",
  componentErrorBackground: "#3a2a2a",
  inputBackground: "#1a1a1a",
  inputFocusBackground: "#222222",
  tooltipBackground: "#333333",
  itemBackground: "#1a1a1a",
  itemHoverBackground: "#222222",

  // Text Colors
  textPrimary: "#ffffff",
  textSecondary: "#999999",
  textMuted: "#777777",
  textError: "#FF4444",
  textVaries: "#FFB844",

  // Border Colors
  borderPrimary: "#333333",
  borderSecondary: "#555555",
  borderFocus: "#4A9EFF",
  borderVaries: "#FFB844",

  // State Colors
  error: "#FF4444",
  success: "#44FF44",
  warning: "#FFB844",

  // Axis Colors
  axisX: "#FF4961",
  axisY: "#11DC68",
  axisZ: "#4A9EFF",

  // Toggle Button Colors
  toggleActive: "#4A9EFF",
  toggleActiveHover: "#66B3FF",
  toggleInactive: "#666666",
  toggleInactiveHover: "#777777",

  // Component Label Colors
  labelDefault: "#4A9EFF",

  // Scrollbar Colors
  scrollbarTrack: "#1a1a1a",
  scrollbarThumb: "#4A9EFF",
  scrollbarThumbHover: "#66B3FF",

  componentDisabledBackground: "#222222",
  borderDisabled: "#373737",

  // Modern design tokens
  inputBackgroundSubtle: "#252525",
  borderHover: "#444444",
};

// ============================================
// NUMBER DRAG HANDLER UTILITY
// ============================================
export class NumberDragHandler {
  constructor(input, options = {}) {
    this.input = input;
    this.options = {
      dragSpeed: options.dragSpeed || 0.1,
      shiftMultiplier: options.shiftMultiplier || 5,
      precision: options.precision !== undefined ? options.precision : null,
      min: options.min !== undefined ? options.min : null,
      max: options.max !== undefined ? options.max : null,
      step: options.step || null,
      onValueChange: options.onValueChange || (() => {}),
      disabled: options.disabled || false,
      ...options,
    };

    this.isDragging = false;
    this.dragStarted = false;
    this.isMouseDown = false;
    this.startValue = 0;
    this.startMouseX = 0;
    this.startMouseY = 0;
    this.lastValue = 0;
    this.mouseDownTime = 0;
    this._dragAccumY = 0;
    this._pointerLockRequested = false;

    this.boundMouseDown = this.onMouseDown.bind(this);
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundMouseUp = this.onMouseUp.bind(this);
    this.boundKeyDown = this.onKeyDown.bind(this);
    this.boundKeyUp = this.onKeyUp.bind(this);

    this.shiftPressed = false;

    this.init();
  }

  init() {
    this.input.addEventListener("mousedown", this.boundMouseDown);
    this.input.title =
      "Click and drag to change value. Hold Shift for faster changes.";

    // Add persistent event listeners to document
    document.addEventListener("mousemove", this.boundMouseMove);
    document.addEventListener("mouseup", this.boundMouseUp);
    this.input.addEventListener("mouseup", this.boundMouseUp);
    document.addEventListener("keydown", this.boundKeyDown);
    document.addEventListener("keyup", this.boundKeyUp);
  }

  onKeyDown(e) {
    if (e.key === "Shift") {
      this.shiftPressed = true;
    }
  }

  onKeyUp(e) {
    if (e.key === "Shift") {
      this.shiftPressed = false;
    }
  }

  onMouseDown(e) {
    if (e.button !== 0) return;
    if (this.options.disabled) return;

    this.isMouseDown = true;
    this.mouseDownTime = Date.now();
    this.startMouseX = e.clientX;
    this.startMouseY = e.clientY;
    this.startValue = parseFloat(this.input.value) || 0;
    this.lastValue = this.startValue;
    this.dragStarted = false;
    this._dragAccumY = 0;
    this._pointerLockRequested = false;
  }

  _isPointerLocked() {
    return document.pointerLockElement === this.input;
  }

  onMouseMove(e) {
    if (!this.isMouseDown || this.options.disabled) return;

    const deltaX = Math.abs(e.clientX - this.startMouseX);
    const deltaY = Math.abs(e.clientY - this.startMouseY);
    // const totalDelta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (!this.dragStarted && deltaY > 3 && deltaX < deltaY) {
      this.dragStarted = true;
      this.isDragging = true;

      this.input.style.cursor = "ns-resize";
      this.input.style.userSelect = "none";
      document.body.style.cursor = "ns-resize";

      e.preventDefault();
      this.input.blur();

      this._dragAccumY = this.startMouseY - e.clientY;
      if (!this._pointerLockRequested) {
        this._pointerLockRequested = true;
        try {
          const p = this.input.requestPointerLock?.();
          if (p && typeof p.catch === "function") p.catch(() => {});
        } catch (_) {}
      }
    }

    if (this.isDragging) {
      e.preventDefault();

      // Locked: integrate movementY. Unlocked: distance from drag start.
      if (this._isPointerLocked()) {
        this._dragAccumY += -(e.movementY || 0);
      } else {
        this._dragAccumY = this.startMouseY - e.clientY;
      }

      const multiplier = this.shiftPressed ? this.options.shiftMultiplier : 1;
      const change = this._dragAccumY * this.options.dragSpeed * multiplier;

      let newValue = this.startValue + change;

      if (this.options.min !== null && this.options.min !== undefined)
        newValue = Math.max(this.options.min, newValue);
      if (this.options.max !== null && this.options.max !== undefined)
        newValue = Math.min(this.options.max, newValue);

      if (this.options.step && this.options.step > 0) {
        newValue = Math.round(newValue / this.options.step) * this.options.step;
        // Clean up floating-point precision errors after step rounding
        newValue = Math.round(newValue * 1e10) / 1e10;
      }

      if (
        this.options.precision !== null &&
        this.options.precision !== undefined
      ) {
        newValue = parseFloat(newValue.toFixed(this.options.precision));
      }

      if (newValue !== this.lastValue) {
        this.input.value = newValue.toString();
        this.lastValue = newValue;

        const inputEvent = new Event("input", { bubbles: true });
        this.input.dispatchEvent(inputEvent);

        this.options.onValueChange(newValue);
      }
    }
  }

  onMouseUp(e) {
    if (!this.isMouseDown) return;

    this.isMouseDown = false;

    if (this.isDragging) {
      this.isDragging = false;
      document.body.style.cursor = "";
      this.input.style.cursor = "";
      this.input.style.userSelect = "";
    }

    if (this._isPointerLocked() && document.exitPointerLock) {
      document.exitPointerLock();
    }
    this._pointerLockRequested = false;

    this.dragStarted = false;
  }

  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
  }

  destroy() {
    this.input.removeEventListener("mousedown", this.boundMouseDown);
    document.removeEventListener("mousemove", this.boundMouseMove);
    document.removeEventListener("mouseup", this.boundMouseUp);
    this.input.removeEventListener("mouseup", this.boundMouseUp);
    document.removeEventListener("keydown", this.boundKeyDown);
    document.removeEventListener("keyup", this.boundKeyUp);

    this.input.style.cursor = "";
    this.input.style.userSelect = "";
    this.input.title = "";
  }
}

// ============================================
// BASE COMPONENT CLASS
// ============================================
class BaseComponent extends EventTarget {
  constructor(config) {
    super();
    this.config = {
      key: "",
      label: "",
      value: null,
      validator: null,
      ...config,
    };
    this.element = null;
    this.errorElement = null;
    this.isValid = true;
    this.variesStates = {};
    this.isVaries = false;
    this.collapsed = config.collapsed || true;

    this.createElement();
    this.setValue(this.config.value);
  }

  isLabelHidden() {
    return this.config.type === "button";
  }

  createElement() {
    const hideLabel = this.isLabelHidden();

    this.element = document.createElement("div");
    this.element.className = "new-prop";

    const inputContainer = document.createElement("div");
    inputContainer.className = "component-input-container";

    this.errorElement = document.createElement("div");
    this.errorElement.className = "component-error";

    if (!hideLabel) {
      const label = document.createElement("div");
      label.className = "new-prop-label";
      label.textContent = this.config.label || this.config.key;

      if (this.supportsCollapse && this.supportsCollapse()) {
        label.style.display = "flex";
        label.style.alignItems = "center";
        this.toggleButton = document.createElement("button");
        this.toggleButton.className = "new-multi-toggle";
        this.toggleButton.innerHTML = "&#9654;";
        this.toggleButton.addEventListener("click", () => {
          this.toggleCollapse();
        });
        label.appendChild(this.toggleButton);
      }

      this.element.appendChild(label);
    }

    this.element.appendChild(inputContainer);
    this.element.appendChild(this.errorElement);

    this.createInput(inputContainer);
  }

  createInput(container) {
    // Override in subclasses
  }

  setValue(value) {
    this.config.value = value;
    this.updateUI();
  }

  getValue() {
    return this.config.value;
  }

  setVariesState() {
    this.isVaries = true;
    this.updateUI();
  }

  clearVariesState(newValue = null) {
    if (this.isVaries) {
      this.isVaries = false;
      if (newValue !== null) {
        this.config.value = newValue;
      }
      this.updateUI();
    }
  }

  setVariesStateForAxis(axis) {
    this.variesStates[axis] = true;
    this.updateUI();
  }

  clearVariesStateForAxis(axis, newValue = null) {
    if (this.variesStates[axis]) {
      this.variesStates[axis] = false;
      if (newValue !== null && this.config.value) {
        this.config.value[axis] = newValue;
      }
      this.updateUI();
    }
  }

  isAxisVaries(axis) {
    return this.variesStates[axis] === true;
  }

  clearAllVariesStates() {
    this.isVaries = false;
    this.variesStates = {};
    this.updateUI();
  }

  updateUI() {
    // Override in subclasses
  }

  validate(value) {
    if (!this.config.validator) return true;

    try {
      const result = this.config.validator(value);
      return result === true || result === undefined ? true : result;
    } catch (error) {
      return error.message;
    }
  }

  showError(message) {
    this.isValid = false;
    this.errorElement.textContent = message;
    this.errorElement.classList.add("show");
    this.element.classList.add("error");
  }

  clearError() {
    this.isValid = true;
    this.errorElement.classList.remove("show");
    this.element.classList.remove("error");
  }

  handleChange(value) {
    const validation = this.validate(value);
    if (validation === true) {
      this.clearError();
      this.config.value = value;
      this.updateUI();
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { key: this.config.key, value, component: this },
        }),
      );
    } else {
      this.showError(validation);
    }
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  supportsCollapse() {
    return false;
  }

  toggleCollapse() {
    // Override in subclasses that support collapsing
  }

  updateToggleButton() {
    if (this.toggleButton) {
      this.toggleButton.innerHTML = this.collapsed ? "&#9654;" : "&#9660;";
      this.toggleButton.title = this.collapsed ? "Expand" : "Collapse";
    }
  }
}

// ============================================
// COMPONENT TYPES
// ============================================

// Number Component
class NumberComponent extends BaseComponent {
  createInput(container) {
    const hasSuffix = !!this.config.suffix;
    const wrapper = hasSuffix ? document.createElement("div") : null;
    if (wrapper) {
      wrapper.className = "new-angle-row";
    }

    this.input = document.createElement("input");
    this.input.type = "number";
    this.input.className = "component-input";

    if (this.config.min !== undefined) this.input.min = this.config.min;
    if (this.config.max !== undefined) this.input.max = this.config.max;
    if (this.config.step !== undefined) this.input.step = this.config.step;
    if (this.config.placeholder)
      this.input.placeholder = this.config.placeholder;

    this.input.addEventListener("input", () => {
      const value = parseFloat(this.input.value);
      if (!isNaN(value)) {
        if (this.isVaries || value !== this.config.value) {
          this.clearVariesState(value);
          this.handleChange(value);
        }
      }
    });

    this.input.addEventListener("focus", () => {
      if (this.isVaries) {
        this.input.value = "";
      }
    });

    this.input.addEventListener("keydown", (e) => {
      e.stopPropagation();
    });

    if (wrapper) {
      wrapper.appendChild(this.input);
      const suffixEl = document.createElement("span");
      suffixEl.className = "new-input-suffix";
      suffixEl.textContent = this.config.suffix;
      wrapper.appendChild(suffixEl);
      container.appendChild(wrapper);
    } else {
      container.appendChild(this.input);
    }

    this.dragHandler = new NumberDragHandler(this.input, {
      dragSpeed: this.config.dragSpeed || 0.1,
      shiftMultiplier: this.config.shiftMultiplier || 5,
      precision:
        this.config.precision !== undefined ? this.config.precision : null,
      min: this.config.min,
      max: this.config.max,
      step: this.config.step,
      onValueChange: (newValue) => {
        if (this.isVaries || newValue !== this.config.value) {
          this.clearVariesState(newValue);
          this.handleChange(newValue);
        }
      },
    });
  }

  updateUI() {
    if (this.input) {
      if (this.isVaries) {
        this.input.value = "";
        this.input.placeholder = VARIES_SYMBOL;
        this.input.style.color = Theme.textVaries;
        this.input.style.borderColor = Theme.borderVaries;
        if (this.dragHandler) {
          this.dragHandler.updateOptions({ disabled: true });
        }
      } else {
        this.input.value = this.config.value ?? "";
        this.input.placeholder = this.config.placeholder || "";
        this.input.style.color = "";
        this.input.style.borderColor = "";
        if (this.dragHandler) {
          this.dragHandler.updateOptions({ disabled: false });
        }
      }
    }
  }

  destroy() {
    if (this.dragHandler && this.dragHandler.destroy) {
      this.dragHandler.destroy();
    }
    super.destroy();
  }
}

// Text Component
class TextComponent extends BaseComponent {
  createInput(container) {
    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.className = "component-input";

    if (this.config.placeholder)
      this.input.placeholder = this.config.placeholder;
    if (this.config.maxLength) this.input.maxLength = this.config.maxLength;

    this.input.addEventListener("input", () => {
      if (this.isVaries || this.input.value !== this.config.value) {
        this.clearVariesState(this.input.value);
        this.handleChange(this.input.value);
      }
    });

    this.input.addEventListener("focus", () => {
      if (this.isVaries) {
        this.input.value = "";
      }
    });

    // Prevent arrow keys from propagating to the scene
    this.input.addEventListener("keydown", (e) => {
      e.stopPropagation();
    });

    container.appendChild(this.input);
  }

  updateUI() {
    if (this.input) {
      if (this.isVaries) {
        this.input.value = "";
        this.input.placeholder = VARIES_SYMBOL;
        this.input.style.color = Theme.textVaries;
        this.input.style.borderColor = Theme.borderVaries;
      } else {
        this.input.value = this.config.value ?? "";
        this.input.placeholder = this.config.placeholder || "";
        this.input.style.color = "";
        this.input.style.borderColor = "";
      }
    }
  }
}

// Multi-value Component Base (for Position, Rotation, Scale)
class MultiValueComponent extends BaseComponent {
  constructor(config) {
    super(config);
    this.inputs = {};
    this.dragHandlers = {};
    this.recreateInput();
  }

  supportsCollapse() {
    return true;
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.updateToggleButton();
    this.recreateInput();
  }

  recreateInput() {
    const container = this.element.querySelector(".component-input-container");
    container.innerHTML = "";
    this.createInput(container);
    this.updateUI();
  }

  getAxes() {
    return this?.config?.axes ?? ["x", "y", "z"];
  }

  getColors() {
    return [Theme.axisX, Theme.axisY, Theme.axisZ];
  }

  getInputProperties() {
    return {
      type: "number",
      step: this.config.step || 0.1,
    };
  }

  getLabelText(axis) {
    return axis.toUpperCase();
  }

  createInput(container) {
    if (!this.inputs || !this.dragHandlers) return;
    const axes = this.getAxes();
    const colors = this.getColors();
    const inputProps = this.getInputProperties();

    if (this.collapsed) {
      const wrapper = document.createElement("div");
      wrapper.className = "new-multi-collapsed";

      axes.forEach((axis, index) => {
        const inputGroup = document.createElement("div");
        inputGroup.className = "new-multi-group";

        const label = document.createElement("span");
        label.className = "axis-label";
        label.textContent = this.getLabelText(axis);
        label.style.color = colors[index];

        const input = document.createElement("input");
        input.type = inputProps.type;
        input.className = "component-input";
        if (inputProps.step) input.step = inputProps.step;
        if (inputProps.min !== undefined) input.min = inputProps.min;
        if (inputProps.max !== undefined) input.max = inputProps.max;

        input.addEventListener("input", () => {
          this.updateValue();
        });

        input.addEventListener("focus", () => {
          if (this.isVaries || this.isAxisVaries(axis)) {
            this.inputs[axis].value = "";
          }
        });

        input.addEventListener("keydown", (e) => {
          e.stopPropagation();
        });

        if (input.type === "number") {
          this.dragHandlers[axis] = new NumberDragHandler(input, {
            dragSpeed: this.config.dragSpeed || 0.1,
            shiftMultiplier: this.config.shiftMultiplier || 5,
            precision:
              this.config.precision !== undefined
                ? this.config.precision
                : null,
            min: input.min !== "" ? parseFloat(input.min) : null,
            max: input.max !== "" ? parseFloat(input.max) : null,
            step: input.step !== "" ? parseFloat(input.step) : null,
            onValueChange: () => {
              this.updateValue();
            },
          });
        }

        this.inputs[axis] = input;

        inputGroup.appendChild(label);
        inputGroup.appendChild(input);
        wrapper.appendChild(inputGroup);
      });

      container.appendChild(wrapper);
    } else {
      const wrapper = document.createElement("div");
      wrapper.className = "new-multi-expanded";

      axes.forEach((axis, index) => {
        const row = document.createElement("div");
        row.className = "pos-row";

        const label = document.createElement("span");
        label.className = "axis-label";
        label.textContent = this.getLabelText(axis);
        label.style.color = colors[index];

        const input = document.createElement("input");
        input.type = inputProps.type;
        input.className = "component-input";
        if (inputProps.step) input.step = inputProps.step;
        if (inputProps.min !== undefined) input.min = inputProps.min;
        if (inputProps.max !== undefined) input.max = inputProps.max;

        input.addEventListener("input", () => {
          this.updateValue();
        });

        input.addEventListener("focus", () => {
          if (this.isVaries || this.isAxisVaries(axis)) {
            this.inputs[axis].value = "";
          }
        });

        input.addEventListener("keydown", (e) => {
          e.stopPropagation();
        });

        if (input.type === "number") {
          this.dragHandlers[axis] = new NumberDragHandler(input, {
            dragSpeed: this.config.dragSpeed || 0.1,
            shiftMultiplier: this.config.shiftMultiplier || 5,
            precision:
              this.config.precision !== undefined
                ? this.config.precision
                : null,
            min: input.min !== "" ? parseFloat(input.min) : null,
            max: input.max !== "" ? parseFloat(input.max) : null,
            step: input.step !== "" ? parseFloat(input.step) : null,
            onValueChange: () => {
              this.updateValue();
            },
          });
        }

        this.inputs[axis] = input;

        row.appendChild(label);
        row.appendChild(input);
        wrapper.appendChild(row);
      });

      container.appendChild(wrapper);
    }

    this.updateToggleButton();
  }

  updateValue() {
    const axes = this.getAxes();
    const changedAxes = [];
    const partialValue = {};
    let hasChanges = false;

    const currentValue = {};
    axes.forEach((axis) => {
      currentValue[axis] = this.config.value ? this.config.value[axis] || 0 : 0;
    });

    axes.forEach((axis) => {
      const inputValue = this.inputs[axis].value;
      const newValue = parseFloat(inputValue) || 0;
      const currentAxisValue = currentValue[axis];

      if (this.isAxisVaries(axis)) {
        if (
          inputValue !== "" &&
          inputValue !== null &&
          inputValue !== undefined
        ) {
          this.clearVariesStateForAxis(axis);
          changedAxes.push(axis);
          partialValue[axis] = newValue;
          hasChanges = true;
        }
      } else {
        if (newValue !== currentAxisValue) {
          changedAxes.push(axis);
          partialValue[axis] = newValue;
          hasChanges = true;
        }
      }
    });

    if (hasChanges || this.isVaries) {
      if (!this.config.value) {
        this.config.value = {};
        axes.forEach((axis) => {
          this.config.value[axis] = 0;
        });
      }

      Object.assign(this.config.value, partialValue);

      this.dispatchEvent(
        new CustomEvent("change", {
          detail: {
            key: this.config.key,
            value: partialValue,
            fullValue: this.config.value,
            changedAxes: changedAxes,
            component: this,
          },
        }),
      );

      this.updateUI();
    }
  }

  setVariesState() {
    const axes = this.getAxes();
    axes.forEach((axis) => {
      this.variesStates[axis] = true;
    });
    this.updateUI();
  }

  clearVariesState(newValue = null) {
    const axes = this.getAxes();
    axes.forEach((axis) => {
      this.variesStates[axis] = false;
    });

    if (newValue !== null) {
      this.config.value = newValue;
    }

    this.updateUI();
  }

  updateUI() {
    const axes = this.getAxes();

    if (this.isVaries) {
      axes.forEach((axis) => {
        if (this.inputs && this.inputs[axis]) {
          this.inputs[axis].value = "";
          this.inputs[axis].placeholder = VARIES_SYMBOL;
          this.inputs[axis].style.color = Theme.textVaries;
          this.inputs[axis].style.borderColor = Theme.borderVaries;

          if (this.dragHandlers && this.dragHandlers[axis]) {
            this.dragHandlers[axis].updateOptions({ disabled: true });
          }
        }
      });
    } else {
      const defaultValue = {};
      axes.forEach((axis) => {
        defaultValue[axis] = 0;
      });
      const value = this.config.value ?? defaultValue;

      axes.forEach((axis) => {
        if (this.inputs && this.inputs[axis]) {
          if (this.isAxisVaries(axis)) {
            this.inputs[axis].value = "";
            this.inputs[axis].placeholder = VARIES_SYMBOL;
            this.inputs[axis].style.color = Theme.textVaries;
            this.inputs[axis].style.borderColor = Theme.borderVaries;

            if (this.dragHandlers && this.dragHandlers[axis]) {
              this.dragHandlers[axis].updateOptions({ disabled: true });
            }
          } else {
            this.inputs[axis].value = value[axis] || 0;
            this.inputs[axis].placeholder = "";
            this.inputs[axis].style.color = "";
            this.inputs[axis].style.borderColor = "";

            if (this.dragHandlers && this.dragHandlers[axis]) {
              this.dragHandlers[axis].updateOptions({ disabled: false });
            }
          }
        }
      });
    }
  }

  destroy() {
    if (this.dragHandlers) {
      Object.values(this.dragHandlers).forEach((handler) => {
        if (handler && handler.destroy) {
          handler.destroy();
        }
      });
      this.dragHandlers = {};
    }

    super.destroy();
  }
}

// Position Component (XYZ)
class PositionComponent extends MultiValueComponent {}

// Rotation Component (XYZ) - renamed to Angle3D
class Angle3DComponent extends MultiValueComponent {
  getInputProperties() {
    return {
      type: "number",
      step: this.config.step ?? 1,
    };
  }

  getLabelText(axis) {
    return `${axis.toUpperCase()}°`;
  }
}

// 1D Angle Component
class Angle1DComponent extends BaseComponent {
  createInput(container) {
    const wrapper = document.createElement("div");
    wrapper.className = "new-angle-row";

    this.input = document.createElement("input");
    this.input.type = "number";
    this.input.className = "component-input";
    this.input.step = this.config.step ?? 1;

    const suffix = document.createElement("span");
    suffix.className = "new-input-suffix";
    suffix.textContent = this.config.suffix || "°";

    this.input.addEventListener("input", () => {
      const value = parseFloat(this.input.value);
      if (!isNaN(value)) {
        if (this.isVaries || value !== this.config.value) {
          this.clearVariesState(value);
          this.handleChange(value);
        }
      }
    });

    this.input.addEventListener("focus", () => {
      if (this.isVaries) {
        this.input.value = "";
      }
    });

    this.input.addEventListener("keydown", (e) => {
      e.stopPropagation();
    });

    this.dragHandler = new NumberDragHandler(this.input, {
      dragSpeed: this.config.dragSpeed || 1.0,
      shiftMultiplier: this.config.shiftMultiplier || 5,
      precision:
        this.config.precision !== undefined ? this.config.precision : 1,
      step: this.config.step,
      onValueChange: (newValue) => {
        if (this.isVaries || newValue !== this.config.value) {
          this.clearVariesState(newValue);
          this.handleChange(newValue);
        }
      },
    });

    wrapper.appendChild(this.input);
    wrapper.appendChild(suffix);
    container.appendChild(wrapper);
  }

  updateUI() {
    if (this.input) {
      if (this.isVaries) {
        this.input.value = "";
        this.input.placeholder = VARIES_SYMBOL;
        this.input.style.color = Theme.textVaries;
        this.input.style.borderColor = Theme.borderVaries;
        if (this.dragHandler) {
          this.dragHandler.updateOptions({ disabled: true });
        }
      } else {
        this.input.value = this.config.value ?? "";
        this.input.placeholder = this.config.placeholder || "";
        this.input.style.color = "";
        this.input.style.borderColor = "";
        if (this.dragHandler) {
          this.dragHandler.updateOptions({ disabled: false });
        }
      }
    }
  }

  destroy() {
    if (this.dragHandler && this.dragHandler.destroy) {
      this.dragHandler.destroy();
    }
    super.destroy();
  }
}

// 3D Scale Component (X, Y, Z) - renamed to Scale3D
class Scale3DComponent extends MultiValueComponent {
  getInputProperties() {
    return {
      type: "number",
      step: 0.01,
      min: 0,
    };
  }
}

// 2D Scale Component (Width, Height)
class Scale2DComponent extends MultiValueComponent {
  getAxes() {
    return this?.config?.axes ?? ["width", "height"];
  }

  getColors() {
    return [Theme.axisX, Theme.axisY];
  }

  getInputProperties() {
    return {
      type: "number",
      step: 0.01,
      min: 0,
    };
  }

  getLabelText(axis) {
    return axis.charAt(0).toUpperCase();
  }
}

// Selector Component with Tooltip
class SelectorComponent extends BaseComponent {
  createInput(container) {
    this.selectedDisplay = document.createElement("div");
    this.selectedDisplay.className = "selector-display";

    this.selectedDisplay.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.gridTooltip.classList.contains("show")) {
        this.closeGrid();
      } else {
        this.openGrid();
      }
    });

    container.appendChild(this.selectedDisplay);
    this.createTooltip();
  }

  createTooltip() {
    this.gridTooltip = document.createElement("div");
    this.gridTooltip.className = "selector-tooltip";

    const grid = document.createElement("div");
    grid.className = "selector-grid";

    // Set the number of columns per row (default to 3 if not specified)
    const columnsPerRow = this.config.columnsPerRow || 3;
    grid.style.gridTemplateColumns = `repeat(${columnsPerRow}, 1fr)`;

    // Use Promise.all to handle async options properly
    const optionPromises = (this.config.options || []).map(async (option) => {
      const item = document.createElement("div");
      item.className = "selector-item";
      if (this.config.compactItems) item.classList.add("compact");

      if (option.cube) {
        // Handle cube option with all 6 faces
        try {
          const faces = await loadCubeFaces(option.cube);

          const cube = createCSSCube(
            faces.top,
            faces.left,
            faces.right,
            48,
            option.cube.height,
            faces.front,
            faces.back,
            faces.bottom,
            option.cube.depth,
            option.cube.topVisibility,
          );
          item.appendChild(cube);
        } catch (error) {
          console.warn("Failed to load cube images:", error);
          // Fall back to text
          item.style.display = "flex";
          item.style.alignItems = "center";
          item.style.justifyContent = "center";
        }
      } else if (option.svg) {
        const svgContainer = document.createElement("div");
        svgContainer.className = "selector-item-svg";
        svgContainer.innerHTML = option.svg;
        item.appendChild(svgContainer);
      } else if (option.image) {
        let src =
          typeof option.image === "function" ? option.image() : option.image;
        const img = document.createElement("img");
        if (src instanceof Promise) {
          src.then((resolvedSrc) => {
            img.src = resolvedSrc;
          });
        } else {
          img.src = src;
        }
        img.alt = option.label;
        item.appendChild(img);
      } else {
        // if no icon, center text vertically
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.justifyContent = "center";
      }

      const label = document.createElement("div");
      label.className = "selector-item-label";
      label.textContent = option.label;
      item.appendChild(label);

      item.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectOption(option);
      });

      return item;
    });

    // Wait for all option items to be created and then add them to the grid
    Promise.all(optionPromises).then((items) => {
      items.forEach((item) => grid.appendChild(item));
    });

    this.gridTooltip.appendChild(grid);

    // Append to body instead of component element
    document.body.appendChild(this.gridTooltip);

    // Prevent clicks on the tooltip from propagating to the scene
    this.tooltipClickHandler = (e) => {
      e.stopPropagation();
    };
    ["mousedown", "click", "contextmenu"].forEach((event) => {
      this.gridTooltip.addEventListener(event, this.tooltipClickHandler);
    });

    // Block wheel events from propagating to the scene
    this.wheelHandler = (e) => {
      e.stopPropagation();
    };
    this.gridTooltip.addEventListener("wheel", this.wheelHandler);

    // Close when clicking outside
    this.outsideClickHandler = (e) => {
      if (
        !this.gridTooltip.contains(e.target) &&
        !this.selectedDisplay.contains(e.target)
      ) {
        this.closeGrid();
      }
    };
    document.addEventListener("pointerdown", this.outsideClickHandler);

    // Add persistent scroll listener to always keep position updated
    this.scrollListener = () => {
      this.updateTooltipPosition();
    };

    // Find the scrollable content area and add scroll listener
    const scrollable = document.querySelector(
      ".inspector-sidebar .sidebar-content",
    );
    if (scrollable) {
      scrollable.addEventListener("scroll", this.scrollListener);
    }

    // Add resize listener to update position when screen size changes
    this.resizeListener = () => {
      this.updateTooltipPosition();
    };
    window.addEventListener("resize", this.resizeListener);

    // Set initial position
    this.updateTooltipPosition();
  }

  openGrid() {
    // Calculate position relative to the selector display
    this.updateTooltipPosition();

    this.gridTooltip.classList.add("show");
    this.selectedDisplay.classList.add("active");

    // Scroll to selected option if one exists
    this.scrollToSelectedOption();
  }

  scrollToSelectedOption() {
    if (!this.gridTooltip) return;

    // Find the corresponding DOM element
    const grid = this.gridTooltip.querySelector(".selector-grid");
    if (!grid) return;

    const items = grid.querySelectorAll(".selector-item");

    // Remove selector-selected-item class from all items first
    items.forEach((item) => item.classList.remove("selector-selected-item"));

    // Only proceed if we have a selected value
    if (!this.config.value) return;

    const selectedOption = (this.config.options || []).find(
      (opt) => opt.value === this.config.value,
    );

    if (!selectedOption) return;

    const optionIndex = this.config.options.indexOf(selectedOption);

    if (optionIndex >= 0 && optionIndex < items.length) {
      const selectedItem = items[optionIndex];

      // Add the highlight class to show which option is selected
      selectedItem.classList.add("selector-selected-item");

      // Scroll the selected item into view
      selectedItem.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }

  updateTooltipPosition() {
    const rect = this.selectedDisplay.getBoundingClientRect();

    // Measure actual tooltip size safely (even when hidden)
    const prevVisibility = this.gridTooltip.style.visibility;
    const prevTransform = this.gridTooltip.style.transform;
    const prevLeft = this.gridTooltip.style.left;
    const prevTop = this.gridTooltip.style.top;

    // Temporarily neutralize transform and place at origin to get real size
    this.gridTooltip.style.visibility = "hidden";
    this.gridTooltip.style.transform = "none";
    this.gridTooltip.style.left = "0px";
    this.gridTooltip.style.top = "0px";

    const measuredRect = this.gridTooltip.getBoundingClientRect();
    const tooltipWidth = measuredRect.width || 300;
    const tooltipHeight = measuredRect.height || 250;

    // Restore previous styles
    this.gridTooltip.style.visibility = prevVisibility;
    this.gridTooltip.style.transform = prevTransform;
    this.gridTooltip.style.left = prevLeft;
    this.gridTooltip.style.top = prevTop;

    // Position to the left of the sidebar, centered vertically with the selector
    let left = rect.left - tooltipWidth - 20;
    let top = rect.top + rect.height / 2 - tooltipHeight / 2;

    // Ensure tooltip doesn't go off screen
    if (left < 20) {
      left = rect.right + 20; // Position to the right if no space on left
    }
    if (top < 20) {
      top = 20;
    }
    if (top + tooltipHeight > window.innerHeight - 20) {
      top = window.innerHeight - tooltipHeight - 20;
    }

    this.gridTooltip.style.left = left + "px";
    this.gridTooltip.style.top = top + "px";

    // Update arrow position to point precisely at the selector button
    const finalSelectorCenterY = rect.top + rect.height / 2 - 10;
    const finalTooltipTopY = parseInt(this.gridTooltip.style.top);
    const finalArrowOffset = finalSelectorCenterY - finalTooltipTopY;

    // Clamp arrow position to stay within tooltip bounds (15px margin from edges)
    const arrowHeight = 16; // Total height of the arrow (8px border on each side)
    const minArrowTop = 15;
    const maxArrowTop = tooltipHeight - arrowHeight - 15;
    const clampedArrowOffset = Math.max(
      minArrowTop,
      Math.min(maxArrowTop, finalArrowOffset),
    );

    this.gridTooltip.style.setProperty(
      "--arrow-top",
      clampedArrowOffset + "px",
    );
  }

  closeGrid() {
    if (this.gridTooltip) {
      this.gridTooltip.classList.remove("show");

      // Remove selector-selected-item class from all items when closing
      const items = this.gridTooltip.querySelectorAll(".selector-item");
      items.forEach((item) => item.classList.remove("selector-selected-item"));
    }
    this.selectedDisplay.classList.remove("active");
  }

  selectOption(option) {
    this.clearVariesState();
    this.handleChange(option.value);
    this.closeGrid();
  }

  updateUI() {
    if (this.selectedDisplay) {
      this.selectedDisplay.innerHTML = "";

      if (this.isVaries) {
        // Show varies state with icon
        const variesDisplay = document.createElement("div");
        variesDisplay.className = "selector-varies-display";

        const variesIcon = document.createElement("span");
        variesIcon.className = "selector-varies-icon";
        variesIcon.textContent = "?";
        variesDisplay.appendChild(variesIcon);

        const variesText = document.createElement("span");
        variesText.textContent = VARIES_SYMBOL;
        variesDisplay.appendChild(variesText);

        this.selectedDisplay.appendChild(variesDisplay);
        this.selectedDisplay.style.borderColor = Theme.borderVaries;
      } else {
        const value = this.config.value;
        const selected = (this.config.options || []).find(
          (opt) => opt.value === value,
        );

        if (selected) {
          // Add label first
          const label = document.createElement("span");
          label.className = "selector-selected-label";
          label.textContent = selected.label;
          this.selectedDisplay.appendChild(label);

          if (selected.cube) {
            this.loadSelectedCube(selected.cube);
          } else if (selected.svg) {
            const svgContainer = document.createElement("div");
            svgContainer.className = "selector-selected-svg";
            svgContainer.innerHTML = selected.svg;
            this.selectedDisplay.insertBefore(svgContainer, label);
          } else if (selected.image) {
            let src =
              typeof selected.image === "function"
                ? selected.image()
                : selected.image;
            const img = document.createElement("img");
            if (src instanceof Promise) {
              src.then((resolvedSrc) => {
                img.src = resolvedSrc;
              });
            } else {
              img.src = src;
            }
            img.className = "selector-selected-image";
            this.selectedDisplay.insertBefore(img, label);
          }
        } else if (value !== null && value !== undefined && value !== "") {
          // A value that no option matches any more (e.g. a deleted level or
          // material). Show it as missing rather than pretending it's unset.
          const missing = document.createElement("span");
          missing.className = "selector-selected-label selector-missing";
          missing.textContent = `Missing: ${value}`;
          missing.title = `"${value}" is no longer available`;
          this.selectedDisplay.appendChild(missing);
        } else {
          const placeholder = document.createElement("span");
          placeholder.className = "selector-placeholder";
          placeholder.textContent = "Click to select...";
          this.selectedDisplay.appendChild(placeholder);
        }

        this.selectedDisplay.style.borderColor = "";
      }

      // Add dropdown icon
      const icon = document.createElement("span");
      icon.className = "selector-dropdown-icon";
      icon.innerHTML = "▼";
      this.selectedDisplay.appendChild(icon);
    }
  }

  async loadSelectedCube(cubeConfig) {
    // remove old cube if no placeholder provided

    try {
      const faces = await loadCubeFaces(cubeConfig);

      const cube = createCSSCube(
        faces.top,
        faces.left,
        faces.right,
        42,
        cubeConfig.height,
        faces.front,
        faces.back,
        faces.bottom,
        cubeConfig.depth,
        cubeConfig.topVisibility,
      );

      const oldCube = this.selectedDisplay.querySelector(
        ".selector-selected-cube",
      );
      if (oldCube) {
        oldCube.remove();
      }
      cube.classList.add("selector-selected-cube");

      // Insert the cube before the label
      const label = this.selectedDisplay.querySelector(
        ".selector-selected-label",
      );
      if (label) {
        this.selectedDisplay.insertBefore(cube, label);
      } else {
        this.selectedDisplay.appendChild(cube);
      }
    } catch (error) {
      console.warn("Failed to load selected cube images:", error);
      // Don't add anything if loading fails
    }
  }

  destroy() {
    if (this.outsideClickHandler) {
      document.removeEventListener("pointerdown", this.outsideClickHandler);
    }
    if (this.scrollListener) {
      const scrollable = document.querySelector(
        ".inspector-sidebar .sidebar-content",
      );
      if (scrollable) {
        scrollable.removeEventListener("scroll", this.scrollListener);
      }
    }
    if (this.resizeListener) {
      window.removeEventListener("resize", this.resizeListener);
    }
    if (this.gridTooltip) {
      if (this.tooltipClickHandler) {
        ["mousedown", "click", "contextmenu"].forEach((event) => {
          this.gridTooltip.removeEventListener(event, this.tooltipClickHandler);
        });
      }
      if (this.wheelHandler) {
        this.gridTooltip.removeEventListener("wheel", this.wheelHandler);
      }
      if (this.gridTooltip.parentNode) {
        this.gridTooltip.parentNode.removeChild(this.gridTooltip);
      }
    }
    super.destroy();
  }
}

// Color Component
class ColorComponent extends BaseComponent {
  createInput(container) {
    const wrapper = document.createElement("div");
    wrapper.className = "color-wrapper";

    // Create the new ColorPicker component
    this.colorPicker = new ColorPicker({
      showTextInput: true,
      showRecentColors: true,
      onChange: (color) => {
        if (this.isVaries || color !== this.config.value) {
          this.clearVariesState(color);
          this.handleChange(color);
        }
      },
    });

    // Mount the color picker to the wrapper
    this.colorPicker.mount(wrapper);
    container.appendChild(wrapper);
  }

  updateUI() {
    if (this.colorPicker) {
      if (this.isVaries) {
        this.colorPicker.setVariesState();
      } else {
        const value = this.config.value || "#FFFFFF";
        this.colorPicker.setValue(value);
      }
    }
  }

  destroy() {
    if (this.colorPicker) {
      this.colorPicker.destroy();
      this.colorPicker = null;
    }
    super.destroy();
  }
}

// ============================================
// CONFIRMATION MODAL COMPONENT
// ============================================
// ConfirmationModal class removed - using confirmDialog.js instead

// ConfirmationModal removed - using confirmDialog.js instead

// ============================================
// BUTTON COMPONENT
// ============================================
// Button Component
class ButtonComponent extends BaseComponent {
  createInput(container) {
    this.button = document.createElement("button");
    this.button.className =
      "component-button" +
      (this.config.variant ? ` component-button--${this.config.variant}` : "");
    this.button.textContent =
      this.config.buttonText || this.config.label || "Click";

    this.button.addEventListener("click", async () => {
      if (this.config.important) {
        // Show custom confirmation dialog for important buttons
        const message =
          this.config.confirmMessage ||
          `Are you sure you want to ${
            this.config.buttonText || this.config.label || "perform this action"
          }?`;

        const confirmed = await showConfirmDialog({
          title: "Confirm Action",
          message: message,
          confirmText: "Confirm",
          cancelText: "Cancel",
          type: "danger",
        });
        if (confirmed) {
          this.handleChange(true);
        }
      } else {
        this.handleChange(true); // Buttons always emit true when clicked
      }
    });

    this.button.addEventListener("keydown", (e) => {
      e.stopPropagation();
    });

    container.appendChild(this.button);
  }

  updateUI() {}
}

// Checkbox Component
class CheckboxComponent extends BaseComponent {
  createInput(container) {
    const wrapper = document.createElement("div");
    wrapper.className = "checkbox-wrapper";

    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.className = "component-checkbox";
    this.checkbox.id = `checkbox-${this.config.key}`;

    const label = document.createElement("label");
    label.className = "checkbox-label";
    label.htmlFor = this.checkbox.id;
    label.textContent = this.config.checkboxLabel || "Enable";

    this.checkbox.addEventListener("change", () => {
      if (this.isVaries || this.checkbox.checked !== this.config.value) {
        this.clearVariesState();
        this.handleChange(this.checkbox.checked);
      }
    });

    this.checkbox.addEventListener("keydown", (e) => {
      e.stopPropagation();
    });

    wrapper.appendChild(this.checkbox);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  }

  updateUI() {
    if (this.checkbox) {
      if (this.isVaries) {
        this.checkbox.indeterminate = true;
        this.checkbox.checked = false;
        this.checkbox.style.accentColor = Theme.textVaries;
      } else {
        this.checkbox.indeterminate = false;
        this.checkbox.checked = this.config.value || false;
        this.checkbox.style.accentColor = "";
      }
    }
  }
}

// Carousel Component
class CarouselComponent extends BaseComponent {
  createInput(container) {
    this.options = this.config.options || [];
    this.currentIndex = 0;

    const initialValue = this.config.value;
    const foundIndex = this.options.findIndex((o) => o.key === initialValue);
    if (foundIndex !== -1) this.currentIndex = foundIndex;

    this.carouselContainer = document.createElement("div");
    this.carouselContainer.className = "carousel-container";
    this.carouselContainer.tabIndex = 0;

    this.prevBtn = document.createElement("button");
    this.prevBtn.className = "carousel-nav carousel-prev";
    this.prevBtn.innerHTML = "&#8249;";
    this.prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.navigate(-1);
    });

    this.nextBtn = document.createElement("button");
    this.nextBtn.className = "carousel-nav carousel-next";
    this.nextBtn.innerHTML = "&#8250;";
    this.nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.navigate(1);
    });

    this.track = document.createElement("div");
    this.track.className = "carousel-track";

    this.options.forEach((option) => {
      const optionEl = document.createElement("div");
      optionEl.className = "carousel-option";
      optionEl.dataset.value = option.key;
      const label = document.createElement("div");
      label.className = "option-label";
      label.textContent = option.label;
      optionEl.appendChild(label);
      this.track.appendChild(optionEl);
    });

    this.carouselContainer.appendChild(this.prevBtn);
    this.carouselContainer.appendChild(this.track);
    this.carouselContainer.appendChild(this.nextBtn);

    this.indicator = document.createElement("div");
    this.indicator.className = "carousel-indicator";

    container.appendChild(this.carouselContainer);
    container.appendChild(this.indicator);

    this.carouselContainer.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "ArrowLeft") this.navigate(-1);
      else if (e.key === "ArrowRight") this.navigate(1);
    });

    let touchStartX = 0;
    this.carouselContainer.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    });
    this.carouselContainer.addEventListener("touchend", (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) this.navigate(diff > 0 ? 1 : -1);
    });

    this.updateCarousel();
  }

  navigate(direction) {
    const len = this.options.length;
    if (len === 0) return;
    this.currentIndex = (this.currentIndex + direction + len) % len;
    this.updateCarousel();
    this.handleChange(this.options[this.currentIndex].key);
  }

  updateCarousel() {
    this.track.style.transform = `translateX(${-this.currentIndex * 100}%)`;
    const optionEls = this.track.querySelectorAll(".carousel-option");
    optionEls.forEach((el, i) => {
      el.classList.toggle("active", i === this.currentIndex);
    });
    this.indicator.textContent = `${this.currentIndex + 1} / ${this.options.length}`;
  }

  updateUI() {
    if (!this.options) return;
    const value = this.config.value;
    const idx = this.options.findIndex((o) => o.key === value);
    if (idx !== -1 && idx !== this.currentIndex) {
      this.currentIndex = idx;
      this.updateCarousel();
    }
  }
}

// Color with Override Component
class ColorOverrideComponent extends BaseComponent {
  createElement() {
    this._buildOverrideToggle();
    super.createElement();
    const label = this.element.querySelector(".new-prop-label");
    if (label) {
      label.classList.add("override-label-row");
      label.appendChild(this._overrideToggleEl);
    }
  }

  _buildOverrideToggle() {
    this._overrideToggleEl = document.createElement("div");
    this._overrideToggleEl.className = "override-toggle";
    this.overrideCheckbox = document.createElement("input");
    this.overrideCheckbox.type = "checkbox";
    this.overrideCheckbox.className = "component-checkbox";
    const overrideLabel = document.createElement("label");
    overrideLabel.className = "checkbox-label";
    overrideLabel.textContent = this.config.overrideLabel || "Override";
    overrideLabel.addEventListener("click", () => {
      this.overrideCheckbox.checked = !this.overrideCheckbox.checked;
      this.overrideCheckbox.dispatchEvent(new Event("change"));
    });
    this._overrideToggleEl.appendChild(this.overrideCheckbox);
    this._overrideToggleEl.appendChild(overrideLabel);
  }

  createInput(container) {
    this.colorWrapper = document.createElement("div");
    this.colorWrapper.className = "color-wrapper";

    this.colorPicker = new ColorPicker({
      showTextInput: true,
      showRecentColors: true,
      onChange: (color) => {
        this.handleChange({ override: this.overrideCheckbox.checked, color });
      },
    });

    this.colorPicker.mount(this.colorWrapper);
    container.appendChild(this.colorWrapper);

    this.overrideCheckbox.addEventListener("change", () => {
      const isOverridden = this.overrideCheckbox.checked;
      this.colorWrapper.classList.toggle("override-disabled", !isOverridden);
      this.colorPicker.setDisabled(!isOverridden);
      this.handleChange({
        override: isOverridden,
        color: this.config.value?.color,
      });
    });
  }

  updateUI() {
    if (!this.colorPicker || this._updating) return;
    this._updating = true;
    const val = this.config.value || { override: false, color: "#FFFFFF" };
    this.overrideCheckbox.checked = val.override;
    this.colorPicker.setValue(val.color || "#FFFFFF");
    this.colorWrapper.classList.toggle("override-disabled", !val.override);
    this.colorPicker.setDisabled(!val.override);
    this._updating = false;
  }

  destroy() {
    if (this.colorPicker) {
      this.colorPicker.destroy();
      this.colorPicker = null;
    }
    super.destroy();
  }
}

// Number with Override Component
class NumberOverrideComponent extends BaseComponent {
  createElement() {
    this._buildOverrideToggle();
    super.createElement();
    const label = this.element.querySelector(".new-prop-label");
    if (label) {
      label.classList.add("override-label-row");
      label.appendChild(this._overrideToggleEl);
    }
  }

  _buildOverrideToggle() {
    this._overrideToggleEl = document.createElement("div");
    this._overrideToggleEl.className = "override-toggle";
    this.overrideCheckbox = document.createElement("input");
    this.overrideCheckbox.type = "checkbox";
    this.overrideCheckbox.className = "component-checkbox";
    const overrideLabel = document.createElement("label");
    overrideLabel.className = "checkbox-label";
    overrideLabel.textContent = this.config.overrideLabel || "Override";
    overrideLabel.addEventListener("click", () => {
      this.overrideCheckbox.checked = !this.overrideCheckbox.checked;
      this.overrideCheckbox.dispatchEvent(new Event("change"));
    });
    this._overrideToggleEl.appendChild(this.overrideCheckbox);
    this._overrideToggleEl.appendChild(overrideLabel);
  }

  createInput(container) {
    this.numberInput = document.createElement("input");
    this.numberInput.type = "number";
    this.numberInput.className = "component-input";
    if (this.config.min !== undefined) this.numberInput.min = this.config.min;
    if (this.config.max !== undefined) this.numberInput.max = this.config.max;
    if (this.config.step !== undefined)
      this.numberInput.step = this.config.step;

    this.numberInput.addEventListener("input", () => {
      this.handleChange({
        override: this.overrideCheckbox.checked,
        value: parseFloat(this.numberInput.value),
      });
    });

    this.numberInput.addEventListener("keydown", (e) => e.stopPropagation());

    this.dragHandler = new NumberDragHandler(this.numberInput, {
      dragSpeed: this.config.dragSpeed || 0.01,
      precision: this.config.precision ?? 2,
      min: this.config.min,
      max: this.config.max,
      step: this.config.step,
      onValueChange: (val) => {
        this.handleChange({
          override: this.overrideCheckbox.checked,
          value: val,
        });
      },
    });

    container.appendChild(this.numberInput);

    this.overrideCheckbox.addEventListener("change", () => {
      const isOverridden = this.overrideCheckbox.checked;
      this.numberInput.disabled = !isOverridden;
      this.handleChange({
        override: isOverridden,
        value: parseFloat(this.numberInput.value),
      });
    });
  }

  updateUI() {
    if (!this.numberInput || this._updating) return;
    this._updating = true;
    const val = this.config.value || { override: false, value: 0 };
    this.overrideCheckbox.checked = val.override;
    this.numberInput.value = val.value ?? 0;
    this.numberInput.disabled = !val.override;
    this._updating = false;
  }
}

// ============================================
// COMPONENT FACTORY
// ============================================
export class ComponentFactory {
  static create(type, config) {
    const components = {
      number: NumberComponent,
      text: TextComponent,
      position: PositionComponent,
      angle1d: Angle1DComponent,
      angle3d: Angle3DComponent,
      scale2d: Scale2DComponent,
      scale3d: Scale3DComponent,
      selector: SelectorComponent,
      color: ColorComponent,
      button: ButtonComponent,
      checkbox: CheckboxComponent,
      carousel: CarouselComponent,
      colorOverride: ColorOverrideComponent,
      numberOverride: NumberOverrideComponent,
      // Legacy aliases for backwards compatibility
      rotation: Angle3DComponent,
      scale: Scale3DComponent,
    };

    const ComponentClass = components[type];
    if (!ComponentClass) {
      throw new Error(`Unknown component type: ${type}`);
    }

    return new ComponentClass(config);
  }
}

// ============================================
// INSPECTOR UI CLASS
// ============================================
export class InspectorUI {
  constructor(container, options = {}) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.options = {
      width: options.width || "280px",
      position: options.position || "right",
      title: options.title || "Inspector",
      ...options,
    };

    this.sidebar = null;
    this.headerTitleEl = null;
    this.headerSubtitleEl = null;
    this.components = new Map();
    // Per-label variable editors: [{ component, labelId, key, isMulti }].
    // Kept OUT of `this.components` (that map is keyed by object-type
    // property keys and drives getPropertyValues/handlePropertyChange).
    this.labelVarComponents = [];
    this.labelVarsEl = null;
    // Collapsed group ids ("transform", "other", "label:<id>", "ls:<id>").
    // Mirrored into the project's editorUI.inspector.collapsed so it survives
    // reloads; kept here too so it works before a project is loaded.
    this.collapsedGroups = new Set();
    this.selectedInstances = [];
    this.lastSelectionIds = []; // Track selection UIDs to detect changes
    // Signature (key:type of every common property) of the currently-built
    // components. Lets setSelection reuse components when the schema is
    // unchanged (e.g. clicking between two objects of the same type) instead
    // of rebuilding the whole inspector DOM.
    this.lastSchemaSig = null;
    this.isVisible = false;

    this.init();
  }

  init() {
    this.createSidebar();
    this.applyStyles();
    this.showLevelSettings();
    this.hide();
  }

  createSidebar() {
    this.sidebar = document.createElement("div");
    this.sidebar.className = "inspector-sidebar";
    this.sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-header-row">
          <h3 class="sidebar-title">${this.options.title}</h3>
          <button class="inspector-collapse-btn" title="Minimize inspector">&#x2192;</button>
        </div>
        <div class="sidebar-subtitle"></div>
        <div class="sidebar-labels"><div class="sidebar-labels-chips"></div></div>
      </div>
      <div class="sidebar-content">
        <!-- Components will be added here -->
      </div>
    `;

    this.minTabEl = document.createElement("button");
    this.minTabEl.className = "inspector-min-tab hidden";
    this.minTabEl.innerHTML = `<span class="inspector-min-tab-label">Inspector</span>`;
    const stopEvent = (e) => e.stopPropagation();
    for (const ev of ["click", "pointerdown", "mousedown"]) {
      this.minTabEl.addEventListener(ev, stopEvent);
    }
    this.minTabEl.addEventListener("click", () => this.setMinimized(false));

    this.sidebar
      .querySelector(".inspector-collapse-btn")
      .addEventListener("click", () => this.setMinimized(true));

    // Cache header element references and set initial title
    this.headerTitleEl = this.sidebar.querySelector(
      ".sidebar-header .sidebar-title",
    );
    this.headerSubtitleEl = this.sidebar.querySelector(
      ".sidebar-header .sidebar-subtitle",
    );
    // Labels strip lives INSIDE the header so it visually merges with the
    // title bar and survives component rebuilds. The "Manage labels" gear
    // lives inside the +Add dropdown menu — NOT in the inspector header —
    // so the header stays clean (matches design feedback).
    this.labelsSectionEl = this.sidebar.querySelector(".sidebar-labels");
    this.labelsChipsEl = this.sidebar.querySelector(".sidebar-labels-chips");
    // Listen for any label dictionary/membership change → re-render chips.
    this._onLabelsChanged = () => {
      this._renderLabelsSection();
      this._renderLabelVarSections();
    };
    document.addEventListener("editor:labels-changed", this._onLabelsChanged);
    // Per-instance label VARIABLE value edits (from this inspector or undo):
    // refresh in place, never rebuild — see labelsManager._emitVars.
    this._onLabelVarsChanged = () => this._refreshLabelVarValues();
    document.addEventListener(
      "editor:label-vars-changed",
      this._onLabelVarsChanged,
    );
    // Project (re)loaded → restore which groups were folded.
    this._onProjectLoaded = () => this._loadCollapsedFromProject();
    document.addEventListener("editor:project-projectLoaded", this._onProjectLoaded);
    // Project level list changed (add/delete/rename) → rebuild so end zones'
    // "Next Level" selector lists the current levels.
    this._onLevelsChanged = () => {
      if (!this.selectedInstances?.length) return;
      const hasEndZone = this.selectedInstances.some(
        (i) => i.objectType?.name === "levelEditorEndZone",
      );
      if (hasEndZone) this.updateComponents();
    };
    for (const ev of ["levelAdded", "levelDeleted", "levelRenamed"]) {
      document.addEventListener(`editor:project-${ev}`, this._onLevelsChanged);
    }
    // Material library changed (create/edit/delete) → rebuild components so the
    // material selector reflects the new custom-material list.
    this._onMaterialsChanged = () => {
      if (this.selectedInstances && this.selectedInstances.length > 0) {
        this.updateComponents();
      }
    };
    document.addEventListener(
      "editor:materials-changed",
      this._onMaterialsChanged,
    );
    this.updateHeader();

    // Prevent mouse events from propagating to the scene, but allow mouseup to reach document
    // for drag handlers that rely on document mouseup events
    ["mousedown", "click", "contextmenu", "wheel"].forEach((eventType) => {
      this.sidebar.addEventListener(eventType, (e) => {
        e.stopPropagation();
      });
    });

    // For mouseup, only stop propagation if we're not in a drag operation
    this.sidebar.addEventListener("mouseup", (e) => {
      // Check if any NumberDragHandler is currently dragging
      const isDragging = Array.from(this.components.values()).some(
        (component) => {
          if (component.dragHandler && component.dragHandler.isDragging) {
            return true;
          }
          if (component.dragHandlers) {
            return Object.values(component.dragHandlers).some(
              (handler) => handler && handler.isDragging,
            );
          }
          return false;
        },
      );

      // If no drag operation is active, stop propagation
      if (!isDragging) {
        //e.stopPropagation();
      }
    });

    this.container.appendChild(this.sidebar);
    this.container.appendChild(this.minTabEl);
  }

  // Update header title based on current selection
  updateHeader() {
    if (!this.headerTitleEl) return;

    if (this.isShowingLevelSettings) {
      this.headerTitleEl.textContent = "Level Settings";
      if (this.headerSubtitleEl) {
        this.headerSubtitleEl.textContent = "";
        this.headerSubtitleEl.style.display = "none";
      }
      if (this.labelsSectionEl)
        this.labelsSectionEl.classList.remove("visible");
      return;
    }

    this.headerTitleEl.textContent = `${this.options.title}`;
    if (this.headerSubtitleEl) this.headerSubtitleEl.style.display = "";
    if (this.headerSubtitleEl) {
      let subtitle = "";
      if (this.selectedInstances && this.selectedInstances.length === 1) {
        const inst = this.selectedInstances[0];
        const typeName = getObjectTypeName(inst?.objectType?.name);
        const uid = inst?.uid;
        subtitle =
          uid !== undefined && uid !== null
            ? `${typeName} - ${uid}`
            : `${typeName}`;
      } else if (this.selectedInstances && this.selectedInstances.length > 1) {
        subtitle = `${this.selectedInstances.length} objects selected`;
      }
      this.headerSubtitleEl.textContent = subtitle;
    }
    this._renderLabelsSection?.();
  }

  // Helper method to get selection IDs for comparison
  getSelectionIds(instances) {
    return instances
      .map((instance) => instance.uid || instance.toString())
      .sort();
  }

  // Check if selection has changed
  hasSelectionChanged(instances) {
    const newSelectionIds = this.getSelectionIds(instances);
    const changed =
      JSON.stringify(newSelectionIds) !== JSON.stringify(this.lastSelectionIds);
    this.lastSelectionIds = newSelectionIds;
    return changed;
  }

  applyStyles() {
    if (!document.querySelector("#inspector-ui-styles")) {
      const style = document.createElement("style");
      style.id = "inspector-ui-styles";
      style.textContent = `
        .inspector-sidebar {
          position: fixed;
          top: 49px;
          ${this.options.position}: 0;
          width: ${this.options.width};
          height: calc(100vh - 49px);
          background: ${Theme.sidebarBackground};
          border-left: 1px solid ${Theme.borderPrimary};
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          transform: translateX(${
            this.options.position === "right" ? "100%" : "-100%"
          });
          transition: transform 0.3s ease;
        }

        .inspector-sidebar.visible {
          transform: translateX(0);
        }

        .sidebar-header {
          padding: 14px 16px;
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
          flex: 0 0 auto;
        }

        .sidebar-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sidebar-header h3 {
          margin: 0;
          color: ${Theme.textPrimary};
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .inspector-collapse-btn {
          background: transparent;
          border: none;
          color: ${Theme.textPrimary};
          font-size: 1rem;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 2px;
        }
        .inspector-collapse-btn:hover {
          background: rgba(0,0,0,0.2);
        }

        .sidebar-header .sidebar-subtitle {
          margin-top: 6px;
          color: ${Theme.textPrimary};
          font-size: 0.9rem;
          font-weight: 700;
          line-height: 1;
        }

        .inspector-min-tab {
          position: fixed;
          top: ${49 + 12}px;
          right: 0;
          width: 22px;
          height: 140px;
          background: ${Theme.sidebarBackground};
          border: 1px solid ${Theme.borderPrimary};
          border-right: none;
          color: ${Theme.textPrimary};
          border-radius: 4px 0 0 4px;
          cursor: pointer;
          z-index: 999;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
        }
        .inspector-min-tab:hover { background: ${Theme.componentHoverBackground}; }
        .inspector-min-tab.hidden { display: none; }
        .inspector-min-tab-label {
          transform: rotate(90deg);
          white-space: nowrap;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: ${Theme.textSecondary};
        }
        .inspector-min-tab:hover .inspector-min-tab-label {
          color: ${Theme.textPrimary};
        }

        /* ─── Labels strip ─── */
        .sidebar-header .sidebar-labels {
          margin: 14px -16px -14px;
          padding: 8px 16px;
          background: ${Theme.componentBackground};
          border-top: 1px solid ${Theme.borderPrimary};
          border-bottom: 1px solid ${Theme.borderPrimary};
          display: none;
        }
        .sidebar-header .sidebar-labels.visible { display: block; }
        .sidebar-header .sidebar-labels-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          align-items: center;
        }
        .sidebar-header .ls-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          padding: 1px 4px 1px 6px;
          border-radius: 0;
          background: ${Theme.sidebarBackground};
          border: 1px solid currentColor;
          outline: 1px solid ${Theme.borderPrimary};
          outline-offset: 0;
          color: ${Theme.textPrimary};
          line-height: 1.4;
        }
        .sidebar-header .ls-chip .ls-chip-x {
          background: transparent;
          border: none;
          color: inherit;
          opacity: 0.7;
          cursor: pointer;
          padding: 0;
          width: 12px;
          height: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .sidebar-header .ls-chip .ls-chip-x:hover { opacity: 1; }
        .sidebar-header .ls-chip .ls-chip-x svg { width: 10px; height: 10px; }
        .sidebar-header .ls-add-wrap {
          position: relative;
          display: inline-flex;
        }
        .sidebar-header .ls-add {
          font-family: inherit;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 2px 8px;
          border-radius: 0;
          background: transparent;
          border: 1px dashed ${Theme.borderSecondary};
          color: ${Theme.textSecondary};
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .sidebar-header .ls-add:hover {
          color: ${Theme.textPrimary};
          border-color: ${Theme.borderFocus};
        }
        .sidebar-header .ls-add:active {
          background: ${Theme.componentBackground};
        }

        /* ─── Labels add menu ─── */
        .ls-add-menu {
          position: fixed;
          min-width: 220px;
          max-width: 280px;
          max-height: min(320px, 60vh);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: ${Theme.sidebarBackground};
          border: 1px solid ${Theme.borderPrimary};
          border-radius: 0;
          z-index: 10000;
          padding: 0;
          box-shadow: 0 6px 16px rgba(0,0,0,0.5);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: ${Theme.textPrimary};
        }
        .ls-add-menu .ls-menu-input {
          flex: 0 0 auto;
          display: block;
          box-sizing: border-box;
          width: 100%;
          margin: 0;
          padding: 8px 10px;
          background: ${Theme.inputBackground};
          color: ${Theme.textPrimary};
          border: none;
          border-bottom: 1px solid ${Theme.borderPrimary};
          border-radius: 0;
          font-family: inherit;
          font-size: 0.8rem;
          outline: none;
        }
        .ls-add-menu .ls-menu-input:focus {
          border-bottom-color: ${Theme.borderFocus};
        }
        .ls-add-menu .ls-menu-scroll {
          flex: 1 1 auto;
          overflow-y: auto;
          min-height: 0;
        }
        .ls-add-menu .ls-menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          font-size: 0.8rem;
          color: ${Theme.textPrimary};
          cursor: pointer;
        }
        .ls-add-menu .ls-menu-item:hover {
          background: ${Theme.componentHoverBackground};
        }
        .ls-add-menu .ls-menu-swatch {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex: 0 0 10px;
        }
        .ls-add-menu .ls-menu-divider {
          height: 1px;
          background: ${Theme.borderSecondary};
          margin: 0;
        }
        .ls-add-menu .ls-menu-empty {
          padding: 8px 10px;
          font-size: 0.75rem;
          color: ${Theme.textMuted};
          font-style: italic;
        }
        .ls-add-menu .ls-menu-manage {
          color: ${Theme.textMuted};
        }
        .ls-add-menu .ls-menu-manage:hover {
          color: ${Theme.textPrimary};
        }
        .ls-add-menu .ls-menu-gear {
          width: 12px;
          height: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 12px;
          color: inherit;
        }
        .ls-add-menu .ls-menu-gear svg {
          width: 12px;
          height: 12px;
        }

        /* ─── Scrollable content ─── */
        .sidebar-content {
          padding: 0;
          overflow-y: auto;
          scrollbar-gutter: stable;
          flex: 1 1 auto;
        }

        .sidebar-content::-webkit-scrollbar {
          width: 10px;
        }

        .sidebar-content::-webkit-scrollbar-track {
          background: ${Theme.scrollbarTrack};
        }

        .sidebar-content::-webkit-scrollbar-thumb {
          background: ${Theme.scrollbarThumb};
          border: 3px solid ${Theme.scrollbarTrack};
          background-clip: content-box;
        }

        /* ─── Groups ─── */
        .new-group {
          border-bottom: 1px solid ${Theme.borderPrimary};
        }
        .new-group.group-flash {
          animation: groupFlash 1.5s ease-out;
        }
        @keyframes groupFlash {
          0%, 30% { background: ${Theme.primary}33; }
          100% { background: transparent; }
        }
        .new-group-header {
          padding: 10px 12px 0 8px;
          user-select: none;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }
        .new-group-chevron {
          flex: 0 0 10px;
          width: 10px;
          font-size: 0.5rem;
          line-height: 1;
          color: ${Theme.textMuted};
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .new-group-title {
          font-weight: 600;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          color: ${Theme.borderSecondary};
          flex: 1 1 auto;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .new-group-header:hover .new-group-title { color: ${Theme.textSecondary}; }
        .new-group-meta {
          flex: 0 0 auto;
          display: none;
          font-size: 0.72rem;
          letter-spacing: 0.3px;
          color: ${Theme.textSecondary};
          font-variant-numeric: tabular-nums;
        }
        .new-group.collapsed .new-group-meta { display: inline; }
        .new-group.collapsed .new-group-header { padding-bottom: 8px; }
        .new-group.collapsed .new-group-body { display: none; }
        .new-group-edit {
          flex: 0 0 auto;
          background: transparent; border: 1px solid transparent;
          color: ${Theme.textMuted}; cursor: pointer;
          width: 20px; height: 20px; padding: 0; border-radius: 2px;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .new-group-edit:hover { border-color: ${Theme.borderSecondary}; }
        .new-group-edit svg { width: 12px; height: 12px; display: block; }
        /* Label variable sections: 1px hairline down the left (the right edge
           sits against the scrollbar), and the chevron / title / gear take the
           label colour. */
        .new-group.label-var-group { border-left: 1px solid var(--label-color); }
        .new-group.label-var-group .new-group-chevron,
        .new-group.label-var-group .new-group-title,
        .new-group.label-var-group .new-group-edit { color: var(--label-color); }
        .new-group.label-var-group .new-group-header:hover .new-group-title { color: var(--label-color); }
        .new-group.label-var-group .new-group-edit:hover {
          border-color: color-mix(in srgb, var(--label-color) 50%, transparent);
        }
        .new-group-body {
          padding: 8px 12px 12px;
        }

        /* ─── Property rows ─── */
        .new-prop {
          margin-bottom: 0;
          padding-bottom: 8px;
          border-bottom: 1px solid ${Theme.inputFocusBackground};
        }
        .new-prop:last-child { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }
        .new-prop + .new-prop { padding-top: 8px; }

        .new-prop-label {
          font-weight: 600;
          color: ${Theme.textSecondary};
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 6px;
        }

        /* ─── Inputs ─── */
        :is(.inspector-sidebar, .inspector-widgets) .component-input {
          width: 100%;
          padding: 7px 8px;
          background: ${Theme.inputBackgroundSubtle};
          border: 1px solid transparent;
          border-radius: 0;
          color: ${Theme.textPrimary};
          font-size: 0.85rem;
          line-height: 1;
          transition: border-color 0.15s, background 0.15s;
          box-sizing: border-box;
          font-family: inherit;
        }
        :is(.inspector-sidebar, .inspector-widgets) .component-input:hover { border-color: ${Theme.borderSecondary}; }
        :is(.inspector-sidebar, .inspector-widgets) .component-input:focus {
          outline: none;
          border-color: ${Theme.borderFocus};
          background: ${Theme.inputFocusBackground};
        }
        :is(.inspector-sidebar, .inspector-widgets) .component-input::placeholder {
          color: ${Theme.textMuted};
        }

        .component-error {
          color: ${Theme.textError};
          font-size: 0.7rem;
          margin-top: 4px;
          display: none;
          font-weight: 600;
          text-transform: uppercase;
        }
        .component-error.show { display: block; }

        /* ─── Multi-value collapsed (embedded axis labels) ─── */
        .new-multi-collapsed {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .new-multi-collapsed .new-multi-group {
          flex: 1;
          display: flex;
          align-items: stretch;
          position: relative;
        }
        .new-multi-collapsed .new-multi-group input[type="number"] {
          flex: 1;
          padding: 7px 6px 7px 16px;
          text-align: center;
          font-size: 0.85rem;
          min-width: 0;
        }
        .new-multi-collapsed .axis-label {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.65rem;
          pointer-events: none;
          z-index: 1;
        }

        /* ─── Multi-value expanded ─── */
        .new-multi-expanded .pos-row {
          display: flex;
          align-items: stretch;
          margin-bottom: 6px;
          position: relative;
        }
        .new-multi-expanded .pos-row:last-child { margin-bottom: 0; }
        .new-multi-expanded .pos-row .axis-label {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.65rem;
          pointer-events: none;
          z-index: 1;
        }
        .new-multi-expanded .pos-row input { flex: 1; padding-left: 22px; }

        /* ─── Toggle collapsed/expanded ─── */
        .new-multi-toggle {
          background: transparent;
          border: none;
          color: ${Theme.primary};
          width: 20px;
          height: 20px;
          cursor: pointer;
          font-size: 0.7rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
        }

        /* ─── Angle / suffix ─── */
        .new-angle-row {
          display: flex;
          align-items: center;
        }
        .new-angle-row input { flex: 1; }
        .new-input-suffix {
          font-weight: 700;
          color: ${Theme.labelDefault};
          font-size: 0.9rem;
          padding: 4px 6px;
        }

        /* ─── Selector ─── */
        .selector-display {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          max-width: 100%;
          overflow: hidden;
          padding: 8px 10px;
          background: ${Theme.inputBackgroundSubtle};
          border: 1px solid transparent;
          border-radius: 0;
          cursor: pointer;
          min-height: 56px;
          transition: border-color 0.15s;
          position: relative;
        }
        .selector-display:hover {
          border-color: ${Theme.borderSecondary};
        }
        .selector-display.active {
          border-color: ${Theme.primary};
          background: ${Theme.bodyBackground};
        }

        .selector-selected-image {
          width: 42px;
          height: 42px;
          object-fit: contain;
          border-radius: 0;
          border: 1px solid ${Theme.borderSecondary};
        }

        .selector-selected-svg {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0;
          border: 1px solid ${Theme.borderSecondary};
          background: ${Theme.componentBackground};
        }

        .selector-selected-svg svg {
          width: 32px;
          height: 32px;
          fill: ${Theme.primary};
        }

        .selector-selected-label {
          flex: 1 1 0;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: ${Theme.textPrimary};
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.85rem;
        }
        .selector-selected-label.selector-missing {
          color: ${Theme.error};
          text-transform: none;
        }

        .selector-placeholder {
          flex: 1;
          color: ${Theme.textMuted};
          font-style: normal;
          text-transform: uppercase;
          font-size: 0.85rem;
        }

        .selector-dropdown-icon {
          color: ${Theme.textMuted};
          font-size: 0.65rem;
          transition: transform 0.2s ease;
        }

        /* ─── Selector tooltip ─── */
        .selector-tooltip {
          position: fixed;
          background: ${Theme.sidebarBackground};
          border: 1px solid ${Theme.primary};
          border-radius: 0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.5);
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-4px);
          transition: opacity 0.15s, transform 0.15s ease-out, visibility 0.15s;
          width: 300px;
          max-height: 400px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .selector-tooltip::before {
          content: '';
          position: absolute;
          right: -10px;
          top: var(--arrow-top, 20px);
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 8px 0 8px 10px;
          border-color: transparent transparent transparent ${Theme.primary};
        }

        .selector-tooltip::after {
          content: '';
          position: absolute;
          right: -8px;
          top: calc(var(--arrow-top, 20px) + 1px);
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 7px 0 7px 9px;
          border-color: transparent transparent transparent ${Theme.sidebarBackground};
        }

        .selector-tooltip.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .selector-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          padding: 12px;
          max-height: 340px;
          overflow-y: auto;
        }

        .selector-grid::-webkit-scrollbar { width: 10px; }
        .selector-grid::-webkit-scrollbar-track { background: ${Theme.scrollbarTrack}; }
        .selector-grid::-webkit-scrollbar-thumb {
          background: ${Theme.scrollbarThumb};
          border: 3px solid ${Theme.scrollbarTrack};
          background-clip: content-box;
        }

        .selector-item {
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
        .selector-selected-item { border-color: ${Theme.borderFocus}; }
        .selector-item:hover {
          border-color: ${Theme.borderFocus};
          background: ${Theme.itemHoverBackground};
        }

        .selector-item img {
          max-width: 100%;
          max-height: 80px;
          object-fit: contain;
          border-radius: 0;
          margin-bottom: 8px;
          border: 1px solid ${Theme.borderPrimary};
        }

        .selector-item.compact { padding: 4px; }
        .selector-item.compact img {
          max-height: 36px;
          margin-bottom: 3px;
        }
        .selector-item.compact .selector-item-label {
          font-size: 0.55rem;
          height: 2.2em;
          text-transform: none;
          word-break: normal;
          overflow-wrap: anywhere;
          hyphens: auto;
        }

        .selector-item-svg {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0;
          margin-bottom: 8px;
          border: 1px solid ${Theme.borderPrimary};
          background: ${Theme.componentBackground};
        }
        .selector-item-svg svg {
          width: 40px;
          height: 40px;
          fill: ${Theme.primary};
          transition: fill 0.15s;
        }
        .selector-item:hover .selector-item-svg svg {
          fill: ${Theme.primaryHover};
        }

        .selector-item-label {
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

        /* ─── CSS Cube ─── */
        .css-cube {
          display: inline-block;
          --cube-x-rotation: -15deg;
          animation: cubeRotate 8s infinite linear;
        }
        .cube-face-left { filter: brightness(80%); }
        .cube-face-right { filter: brightness(90%); }
        .cube-face-bottom { filter: brightness(60%); }
        .cube-face-back { filter: brightness(80%); }
        .cube-face-top { filter: brightness(105%); }
        .cube-face-front { }

        @keyframes cubeRotate {
          0% { transform: rotateX(var(--cube-x-rotation, -15deg)) rotateY(25deg); }
          100% { transform: rotateX(var(--cube-x-rotation, -15deg)) rotateY(385deg); }
        }

        .cube-face {
          backface-visibility: hidden;
          box-sizing: border-box;
          position: relative;
        }
        .cube-face::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          mix-blend-mode: multiply;
        }
        .cube-face-left::after { background: linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%); }
        .cube-face-right::after { background: linear-gradient(270deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 100%); }
        .cube-face-bottom::after { background: linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 100%); }
        .cube-face-top::after { background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%); }

        .selector-item .css-cube {
          margin-bottom: 16px !important;
          margin-top: 4px !important;
        }
        .selector-selected-cube { margin-right: 10px; }
        .selector-display .css-cube:not(:hover) {
          animation: none;
          transform: rotateX(-15deg) rotateY(25deg);
        }
        .selector-display .css-cube {
          margin-right: 16px !important;
          margin-left: 8px !important;
        }

        /* ─── Varies states ─── */
        .selector-varies-item {
          background: ${Theme.warning} !important;
          color: ${Theme.textPrimary} !important;
          border-color: ${Theme.borderVaries} !important;
          position: relative;
        }
        .selector-varies-item:hover {
          background: ${Theme.warning} !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 184, 68, 0.3);
        }
        .selector-varies-item .selector-item-label {
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }
        .selector-varies-display {
          color: ${Theme.textVaries};
          font-weight: 700;
          font-style: italic;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .selector-varies-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: ${Theme.textVaries};
          color: ${Theme.componentBackground};
          border-radius: 50%;
          font-size: 0.8rem;
          font-weight: 900;
          font-style: normal;
        }
        :is(.inspector-sidebar, .inspector-widgets) .component-input.varies {
          color: ${Theme.textVaries} !important;
          border-color: ${Theme.borderVaries} !important;
          font-style: italic;
        }
        :is(.inspector-sidebar, .inspector-widgets) .component-checkbox:indeterminate {
          accent-color: ${Theme.textVaries};
        }

        /* ─── Color ─── */
        :is(.inspector-sidebar, .inspector-widgets) .color-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        :is(.inspector-sidebar, .inspector-widgets) .color-picker {
          width: 32px;
          height: 32px;
          border: 1px solid ${Theme.borderSecondary};
          border-radius: 0;
          cursor: pointer;
          padding: 0;
          background: transparent;
          flex-shrink: 0;
          transform: none;
        }
        :is(.inspector-sidebar, .inspector-widgets) .color-picker:hover {
          transform: none;
        }

        :is(.inspector-sidebar, .inspector-widgets) .color-text {
          flex: 1;
          text-transform: uppercase;
          font-family: 'Courier New', monospace;
          font-weight: 600;
        }

        /* ─── Checkbox ─── */
        :is(.inspector-sidebar, .inspector-widgets) .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        :is(.inspector-sidebar, .inspector-widgets) .component-checkbox {
          width: 18px;
          height: 18px;
          accent-color: ${Theme.primary};
          cursor: pointer;
          transform: none;
        }
        :is(.inspector-sidebar, .inspector-widgets) .checkbox-label {
          flex: 1;
          color: ${Theme.textPrimary};
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          user-select: none;
          transition: none;
        }
        :is(.inspector-sidebar, .inspector-widgets) .checkbox-label:hover {
          color: ${Theme.textPrimary};
        }

        /* ─── Carousel ─── */
        .carousel-container {
          position: relative;
          overflow: hidden;
          height: 52px;
          display: flex;
          align-items: center;
          background: ${Theme.inputBackgroundSubtle};
          border: 1px solid transparent;
          transition: border-color 0.15s;
        }
        .carousel-container:hover { border-color: ${Theme.borderSecondary}; }
        .carousel-container:focus-within { border-color: ${Theme.borderFocus}; }
        .carousel-track {
          display: flex;
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          height: 100%;
          width: 100%;
        }
        .carousel-option {
          box-sizing: border-box;
          min-width: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }
        .carousel-option.active {
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
        }
        .option-label {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.6);
          color: ${Theme.textPrimary};
          border: none;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          padding: 0;
          line-height: 1;
        }
        .carousel-nav:hover { background: rgba(0,0,0,0.8); }
        .carousel-prev { left: 4px; }
        .carousel-next { right: 4px; }
        .carousel-indicator {
          text-align: center;
          margin-top: 4px;
          font-size: 0.7rem;
          color: ${Theme.textMuted};
        }

        /* ─── Override label row (colorOverride / numberOverride) ─── */
        .override-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .override-toggle {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .override-toggle .component-checkbox {
          width: 12px;
          height: 12px;
        }
        .override-toggle .checkbox-label {
          font-size: 0.65rem;
          font-weight: 500;
          color: ${Theme.textMuted};
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .override-disabled {
          opacity: 0.35;
          pointer-events: none;
        }

        /* ─── Button (outlined danger) ─── */
        .component-button {
          width: 100%;
          padding: 8px 14px;
          border: 1px solid ${Theme.error};
          background: transparent;
          color: ${Theme.error};
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          font-size: 0.8rem;
          font-family: inherit;
          border-radius: 0;
          transition: background 0.15s, color 0.15s;
        }
        .component-button:hover {
          background: ${Theme.error};
          color: ${Theme.textPrimary};
        }
        .component-button:active {
          background: ${Theme.error};
          color: ${Theme.textPrimary};
        }

        /* Non-danger (primary) button variant */
        .component-button--primary {
          border-color: ${Theme.primary};
          color: ${Theme.primary};
        }
        .component-button--primary:hover,
        .component-button--primary:active {
          background: ${Theme.primary};
          color: ${Theme.textPrimary};
        }

        /* ─── Confirmation modal ─── */
        .confirmation-modal {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          z-index: 10000;
          display: none;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .confirmation-modal.show { opacity: 1; }
        .confirmation-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
        }
        .confirmation-dialog {
          background: ${Theme.sidebarBackground};
          border: 2px solid ${Theme.error};
          border-radius: 4px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
          transform: scale(0.9);
          transition: transform 0.2s ease;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .confirmation-modal.show .confirmation-dialog { transform: scale(1); }
        .confirmation-header {
          padding: 20px 20px 0 20px;
          border-bottom: 1px solid ${Theme.borderSecondary};
        }
        .confirmation-title {
          margin: 0;
          color: ${Theme.error};
          font-size: 1.2rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .confirmation-body { padding: 20px; }
        .confirmation-message {
          margin: 0;
          color: ${Theme.textPrimary};
          font-size: 1rem;
          line-height: 1.5;
        }
        .confirmation-footer {
          padding: 0 20px 20px 20px;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .confirmation-button {
          padding: 10px 20px;
          border: none;
          border-radius: 2px;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          min-width: 100px;
        }
        .confirmation-cancel {
          background: ${Theme.componentBackground};
          color: ${Theme.textPrimary};
          border: 1px solid ${Theme.borderSecondary};
        }
        .confirmation-cancel:hover {
          background: ${Theme.componentHoverBackground};
          border-color: ${Theme.borderFocus};
        }
        .confirmation-confirm {
          background: ${Theme.error};
          color: ${Theme.textPrimary};
        }
        .confirmation-confirm:hover {
          background: #FF6666;
          transform: translateY(-1px);
        }
        .confirmation-confirm:active {
          background: #DD2222;
          transform: translateY(0);
        }
        .confirmation-confirm:focus,
        .confirmation-cancel:focus {
          outline: 2px solid ${Theme.primary};
          outline-offset: 2px;
        }

        /* ─── Empty state ─── */
        .inspector-empty {
          text-align: center;
          padding: 40px 20px;
          color: ${Theme.textMuted};
        }
        .inspector-empty h4 {
          margin: 0 0 10px 0;
          color: ${Theme.textSecondary};
          font-size: 1rem;
        }
        .inspector-empty p {
          margin: 0;
          font-size: 0.9rem;
        }
      `;
      document.head.appendChild(style);
    }
  }

  show() {
    if (this.isMinimized) return;
    this.isVisible = true;
    this.sidebar.classList.add("visible");

    if (globalThis._editorScope?.toolbar) {
      globalThis._editorScope.toolbar.setInspectorState(true);
    }
  }

  hide() {
    this.isVisible = false;
    this.sidebar.classList.remove("visible");

    if (globalThis._editorScope?.toolbar) {
      globalThis._editorScope.toolbar.setInspectorState(false);
    }
  }

  setMinimized(minimized, { persist = true } = {}) {
    this.isMinimized = !!minimized;
    if (this.isMinimized) {
      this.hide();
      this.minTabEl.classList.remove("hidden");
    } else {
      this.minTabEl.classList.add("hidden");
      this.show();
    }
    if (persist) {
      const pm = globalThis._editorScope?.projectManager;
      if (pm && pm.isProjectLoaded) {
        pm.setEditorUIState?.("inspector", { minimized: this.isMinimized });
      }
    }
  }

  applyMinimizedStateFromProject() {
    const pm = globalThis._editorScope?.projectManager;
    const state = pm?.getEditorUIState?.("inspector") ?? {};
    const minimized = state.minimized === true;
    this._loadCollapsedFromProject();
    this.setMinimized(minimized, { persist: false });
  }

  _loadCollapsedFromProject() {
    const pm = globalThis._editorScope?.projectManager;
    const state = pm?.getEditorUIState?.("inspector") ?? {};
    this.collapsedGroups = new Set(
      Object.entries(state.collapsed || {})
        .filter(([, v]) => v === true)
        .map(([k]) => k),
    );
  }

  // ─── Collapsible groups ─────────────────────────────────────────────
  //
  // Every inspector group (object property groups, "Other", label variable
  // sections, level settings groups) is built by _buildGroup so they all
  // fold the same way: a chevron on the left toggles the body, the header
  // shows a count while folded, and the state is remembered per group id.

  isGroupCollapsed(id) {
    return this.collapsedGroups.has(id);
  }

  setGroupCollapsed(id, collapsed) {
    if (collapsed) this.collapsedGroups.add(id);
    else this.collapsedGroups.delete(id);
    const pm = globalThis._editorScope?.projectManager;
    if (pm?.isProjectLoaded && pm.updateEditorUIState) {
      const collapsedMap = {};
      for (const k of this.collapsedGroups) collapsedMap[k] = true;
      // updateEditorUIState shallow-merges one level, so send the whole map.
      pm.updateEditorUIState("inspector", { collapsed: collapsedMap });
    }
  }

  /**
   * Build a group shell. Returns { groupEl, body }; the caller fills `body`.
   * @param {object} o
   * @param {string} o.id          stable id for the collapse state
   * @param {string} o.label       header title
   * @param {string} [o.color]     label colour → coloured chevron/title/gear + right hairline
   * @param {number} [o.count]     items inside (shown while collapsed)
   * @param {string} [o.countNoun] "props" | "vars"
   * @param {Function} [o.onEdit]  adds a gear button calling this
   * @param {string} [o.editTitle]
   */
  _buildGroup({ id, label, color, count, countNoun = "props", onEdit, editTitle }) {
    const groupEl = document.createElement("div");
    groupEl.className = "new-group";
    groupEl.dataset.groupId = id;
    if (color) {
      groupEl.classList.add("label-var-group");
      groupEl.style.setProperty("--label-color", color);
    }

    const header = document.createElement("div");
    header.className = "new-group-header";
    header.title = "Click to collapse / expand";

    const chevron = document.createElement("span");
    chevron.className = "new-group-chevron";
    header.appendChild(chevron);

    const title = document.createElement("span");
    title.className = "new-group-title";
    title.textContent = label;
    header.appendChild(title);

    const meta = document.createElement("span");
    meta.className = "new-group-meta";
    if (typeof count === "number") {
      meta.textContent = `${count} ${countNoun}`;
    }
    header.appendChild(meta);

    if (onEdit) {
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "new-group-edit";
      editBtn.title = editTitle || "Edit";
      editBtn.innerHTML = Icons.Settings;
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        onEdit();
      });
      header.appendChild(editBtn);
    }
    groupEl.appendChild(header);

    const body = document.createElement("div");
    body.className = "new-group-body";
    groupEl.appendChild(body);

    const apply = () => {
      const collapsed = this.isGroupCollapsed(id);
      groupEl.classList.toggle("collapsed", collapsed);
      chevron.innerHTML = collapsed ? "&#9654;" : "&#9660;";
    };
    header.addEventListener("click", () => {
      this.setGroupCollapsed(id, !this.isGroupCollapsed(id));
      apply();
    });
    apply();

    return { groupEl, body };
  }

  setSelection(instances) {
    const instanceArray = Array.isArray(instances) ? instances : [instances];

    // Check if selection has actually changed (by instance uids).
    const changed = this.hasSelectionChanged(instanceArray);
    this.selectedInstances = instanceArray;

    if (!changed) {
      // Exact same instances — just refresh values in the existing components.
      this.updateComponentValues();
    } else {
      const commonProperties = this.findCommonProperties();
      const sig = commonProperties.map((p) => `${p.key}:${p.type}`).join("|");
      if (sig && sig === this.lastSchemaSig && this.components.size > 0) {
        // Different instances but IDENTICAL property schema (e.g. clicking from
        // one object to another of the same type). The components are
        // structurally the same, so reuse them and only refresh values + the
        // per-instance labels, skipping the expensive full DOM rebuild.
        this.updateComponentValues();
        this._renderLabelsSection();
        this._renderLabelVarSections();
      } else {
        // Schema changed — rebuild components (updateComponents records the
        // new schema signature).
        this.updateComponents(commonProperties);
      }
    }

    this.show();

    // Update the header after changing selection visibility
    this.updateHeader();
  }

  clearSelection() {
    this.selectedInstances = [];
    this.lastSelectionIds = []; // Reset selection tracking
    this.lastSchemaSig = null; // Force a rebuild on the next selection
    this.clearComponents();
    const pm = globalThis._editorScope?.projectManager;
    if (
      pm &&
      typeof pm.hasProjectLoaded === "function" &&
      pm.hasProjectLoaded()
    ) {
      this.showLevelSettings();
      this.show();
      this.updateHeader();
    }
  }

  updateComponents(commonProperties = this.findCommonProperties()) {
    this.clearComponents();

    if (this.selectedInstances.length === 0) {
      this.lastSchemaSig = null; // No components built — rebuild next time.
      this.showLevelSettings();
      return;
    }
    this.isShowingLevelSettings = false;

    // Record the schema these components are built for, so setSelection can
    // reuse them for a later same-schema selection.
    this.lastSchemaSig = commonProperties.map((p) => `${p.key}:${p.type}`).join("|");

    this._renderLabelsSection();

    if (commonProperties.length === 0) {
      const note = document.createElement("div");
      note.className = "inspector-empty";
      note.innerHTML =
        "<h4>No Common Properties</h4><p>Selected objects share no editable properties.</p>";
      this.sidebar.querySelector(".sidebar-content").appendChild(note);
      this._renderLabelVarSections();
      return;
    }

    const content = this.sidebar.querySelector(".sidebar-content");

    const createComponent = (propDef) => {
      const component = ComponentFactory.create(propDef.type, propDef);
      const values = this.getPropertyValues(propDef.key);
      this.setComponentValue(component, values);
      component.addEventListener("change", (event) => {
        this.handlePropertyChange(event.detail, propDef.key);
      });
      this.components.set(propDef.key, component);
      // Entry point to the Material Manager: a small link below the material
      // selector so custom materials can be created/edited without leaving the
      // inspector. The selector itself refreshes via "editor:materials-changed".
      if (propDef.key === "material") {
        const manage = document.createElement("button");
        manage.type = "button";
        manage.className = "inspector-manage-materials";
        manage.textContent = "Manage materials…";
        manage.style.cssText = `
          display: block; width: 100%; margin-top: 6px;
          background: transparent; border: 1px solid ${Theme.borderSecondary};
          color: ${Theme.textMuted}; font-size: 0.75rem; padding: 4px 6px;
          border-radius: 2px; cursor: pointer;`;
        manage.addEventListener("mouseenter", () => {
          manage.style.color = Theme.textPrimary;
          manage.style.borderColor = Theme.primary;
        });
        manage.addEventListener("mouseleave", () => {
          manage.style.color = Theme.textMuted;
          manage.style.borderColor = Theme.borderSecondary;
        });
        manage.addEventListener("click", (e) => {
          e.stopPropagation();
          // Open the manager focused on the selection's material. When the
          // selection mixes materials (varies), pass null → the dialog falls
          // back to the first material in the list.
          const ids = [...new Set(this.getPropertyValues("material"))];
          const selectMaterialId = ids.length === 1 ? ids[0] : null;
          showMaterialsDialog({ selectMaterialId });
        });
        component.element.appendChild(manage);
      }
      return component;
    };

    const originalKeySet = new Set(commonProperties.map((p) => p.originalKey));
    const placed = new Set();

    for (const group of propertyGroups) {
      const groupProps = commonProperties.filter(
        (p) => group.keys.includes(p.originalKey) && !placed.has(p.originalKey),
      );
      if (groupProps.length === 0) continue;

      const { groupEl, body } = this._buildGroup({
        id: group.id,
        label: group.label,
        count: groupProps.length,
      });
      for (const propDef of groupProps) {
        const component = createComponent(propDef);
        body.appendChild(component.element);
        placed.add(propDef.originalKey);
      }
      content.appendChild(groupEl);
    }

    const ungrouped = commonProperties.filter(
      (p) => !placed.has(p.originalKey),
    );
    if (ungrouped.length > 0) {
      const { groupEl, body } = this._buildGroup({
        id: "other",
        label: "Other",
        count: ungrouped.length,
      });
      for (const propDef of ungrouped) {
        const component = createComponent(propDef);
        body.appendChild(component.element);
      }
      content.appendChild(groupEl);
    }

    this._renderLabelVarSections();
  }

  // ─── Label variable sections ─────────────────────────────────────────
  //
  // One group per label shared by the whole selection (same intersection the
  // chip strip shows), holding one editor per variable in that label's
  // schema. Values are per-instance overrides (default when unset); editing
  // writes through labelsManager.setInstanceLabelVar so undo/redo and the
  // hierarchy stay in sync. Rebuilt on selection/schema change; value-only
  // edits refresh in place (see _refreshLabelVarValues) so drags aren't
  // interrupted by a DOM rebuild.

  _destroyLabelVarComponents() {
    for (const entry of this.labelVarComponents) entry.component.destroy();
    this.labelVarComponents = [];
    if (this.labelVarsEl) {
      this.labelVarsEl.remove();
      this.labelVarsEl = null;
    }
  }

  _renderLabelVarSections() {
    this._destroyLabelVarComponents();
    if (this.isShowingLevelSettings) return;
    if (!this.selectedInstances || this.selectedInstances.length === 0) return;
    const lm = getLabelsManager();
    if (!lm) return;
    const content = this.sidebar?.querySelector(".sidebar-content");
    if (!content) return;

    const uids = this.selectedInstances.map((i) => i.uid);
    const dict = lm.getDictionaryRef();
    const sharedIds = lm.intersectionOfLabels(uids);
    if (sharedIds.length === 0) return;

    const root = document.createElement("div");
    root.className = "inspector-label-vars";

    for (const labelId of sharedIds) {
      const label = dict[labelId];
      if (!label) continue;
      const vars = lm.getVars(labelId);
      if (vars.length === 0) continue;

      const { groupEl, body } = this._buildGroup({
        id: `label:${labelId}`,
        label: label.name,
        color: label.color || "#888",
        count: vars.length,
        countNoun: "vars",
        onEdit: () => showLabelVarsDialog({ labelId }),
        editTitle: `Edit "${label.name}" variables`,
      });
      for (const def of vars) {
        const cfg = varComponentConfig(def, { value: null });
        if (!cfg) continue;
        let component;
        try {
          component = ComponentFactory.create(cfg.type, cfg);
        } catch (err) {
          console.warn("[inspector] label var editor failed", def, err);
          continue;
        }
        const isMulti = component instanceof MultiValueComponent;
        const entry = { component, labelId, key: def.key, isMulti };
        this._setLabelVarComponentValue(entry, uids);
        component.addEventListener("change", (e) => {
          const d = e.detail;
          const partial = d.value;
          const next = isMulti
            ? (uid, cur) => ({ ...(cur || {}), ...partial })
            : partial;
          lm.setInstanceLabelVar(uids, labelId, def.key, next);
          this._setLabelVarComponentValue(entry, uids);
        });
        body.appendChild(component.element);
        this.labelVarComponents.push(entry);
      }
      root.appendChild(groupEl);
    }

    if (root.childElementCount === 0) return;
    content.appendChild(root);
    this.labelVarsEl = root;
  }

  _setLabelVarComponentValue(entry, uids) {
    const lm = getLabelsManager();
    if (!lm) return;
    const values = uids
      .map((uid) => lm.getInstanceVarValue(uid, entry.labelId, entry.key))
      .filter((v) => v !== undefined);
    this.setComponentValue(entry.component, values);
  }

  _refreshLabelVarValues() {
    if (this.labelVarComponents.length === 0) return;
    const uids = this.selectedInstances.map((i) => i.uid);
    for (const entry of this.labelVarComponents) {
      this._setLabelVarComponentValue(entry, uids);
    }
  }

  // ─── Labels section ──────────────────────────────────────────────────
  //
  // The labels strip lives inside the sidebar header (built in
  // createSidebar). `_renderLabelsSection()` paints chips for the current
  // selection's intersection of labels; reacting to:
  //   - selection change           (called from updateComponents)
  //   - label add/remove on inst   (called inline + via editor:labels-changed)
  //   - dictionary edits           (via editor:labels-changed)

  _renderLabelsSection() {
    if (!this.labelsChipsEl || !this.labelsSectionEl) return;
    const lm = getLabelsManager();
    this.labelsChipsEl.innerHTML = "";

    // Hide the entire strip when there's no selection.
    if (this.selectedInstances.length === 0) {
      this.labelsSectionEl.classList.remove("visible");
      return;
    }
    this.labelsSectionEl.classList.add("visible");

    const uids = this.selectedInstances.map((i) => i.uid);
    const dict = lm ? lm.getDictionary() : {};
    const sharedIds = lm ? lm.intersectionOfLabels(uids) : [];

    // Render each shared label as a removable outline pill. The color is
    // applied via `currentColor` (border + X icon inherit) so we can keep
    // text white for legibility regardless of swatch hue.
    for (const id of sharedIds) {
      const l = dict[id];
      if (!l) continue;
      const chip = document.createElement("span");
      chip.className = "ls-chip";
      if (l.color) chip.style.color = l.color; // border via currentColor
      const txt = document.createElement("span");
      txt.textContent = l.name;
      txt.style.color = Theme.textPrimary; // keep label readable
      chip.appendChild(txt);

      const x = document.createElement("button");
      x.className = "ls-chip-x";
      x.type = "button";
      x.title = `Remove "${l.name}" from selection`;
      x.innerHTML = Icons.Close;
      x.addEventListener("click", (e) => {
        e.stopPropagation();
        lm.removeLabelFromInstances(uids, id);
        // editor:labels-changed event re-renders both inspector + hierarchy.
      });
      chip.appendChild(x);
      this.labelsChipsEl.appendChild(chip);
    }

    // "+ Add" button -> dropdown listing all dictionary labels not already
    // present on the entire selection (i.e. complement of intersection).
    const addWrap = document.createElement("span");
    addWrap.className = "ls-add-wrap";
    const addBtn = document.createElement("button");
    addBtn.className = "ls-add";
    addBtn.type = "button";
    addBtn.textContent = "+ Add";
    addWrap.appendChild(addBtn);
    this.labelsChipsEl.appendChild(addWrap);

    let menu = null;
    const closeMenu = () => {
      if (menu) {
        menu.remove();
        menu = null;
        document.removeEventListener("click", onDocClick, true);
      }
    };
    const onDocClick = (e) => {
      if (menu && !menu.contains(e.target) && e.target !== addBtn) {
        // Clicking away with text still in the input commits it as a label.
        menu._commitTyped?.();
        closeMenu();
      }
    };
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (menu) {
        closeMenu();
        return;
      }
      menu = this._buildAddLabelMenu(uids, sharedIds, () => {
        closeMenu();
        // editor:labels-changed handles inspector + hierarchy refresh.
      });
      // Append to body so the fixed-position menu escapes the inspector
      // sidebar's scroll/overflow context. Position: prefer left-aligned
      // with the add button; if that would overflow the viewport on the
      // right, switch to right-aligning the menu's right edge with the
      // button's right edge instead. We never need a left-overflow guard
      // because the inspector sidebar is anchored on the right side of
      // the screen, so the button is always near the right of the viewport.
      document.body.appendChild(menu);
      const rect = addBtn.getBoundingClientRect();
      // Measure menu after insertion (display:flex with set max-width).
      const menuRect = menu.getBoundingClientRect();
      const margin = 8;
      const top = Math.round(rect.bottom + 4);
      let left = Math.round(rect.left);
      if (left + menuRect.width + margin > window.innerWidth) {
        left = Math.round(rect.right - menuRect.width);
      }
      if (left < margin) left = margin;
      menu.style.top = `${top}px`;
      menu.style.left = `${left}px`;
      // Defer doc listener so the click that opened the menu doesn't close it.
      setTimeout(() => document.addEventListener("click", onDocClick, true), 0);
    });
  }

  _buildAddLabelMenu(uids, sharedIds, onPicked) {
    const lm = getLabelsManager();
    const menu = document.createElement("div");
    menu.className = "ls-add-menu";
    // Capture clicks/keys so they don't bubble out to the editor scene.
    ["mousedown", "click", "wheel", "contextmenu", "keydown"].forEach((ev) =>
      menu.addEventListener(ev, (e) => e.stopPropagation()),
    );

    // Inline create-new field — Enter creates the label AND applies it
    // to the current selection in one undo entry pair.
    const input = document.createElement("input");
    input.className = "ls-menu-input";
    input.type = "text";
    input.placeholder = "Create new label…";
    input.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Enter") {
        e.preventDefault();
        const name = input.value.trim();
        if (!name) return;
        const created = lm?.createLabel(name);
        if (created) {
          lm.addLabelToInstances(uids, created.id);
          onPicked();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onPicked(); // closes
      }
    });
    menu.appendChild(input);

    const divider = document.createElement("div");
    divider.className = "ls-menu-divider";
    menu.appendChild(divider);

    // Scrollable middle section so only the LIST scrolls, not the whole
    // menu (keeps input + footer pinned). See ls-add-menu CSS for details.
    const scroll = document.createElement("div");
    scroll.className = "ls-menu-scroll";
    menu.appendChild(scroll);

    // Render the candidate list, filtered live by the input query. Re-callable
    // so typing in the input re-paints only the list (input + footer stay put).
    const sharedSet = new Set(sharedIds);
    const renderCandidates = (query = "") => {
      if (!lm) return;
      scroll.innerHTML = "";
      const all = lm.listLabels();
      const candidates = all
        .filter((l) => !sharedSet.has(l.id))
        .filter((l) => !query || l.name.toLowerCase().includes(query));

      if (candidates.length === 0) {
        const empty = document.createElement("div");
        empty.className = "ls-menu-empty";
        empty.textContent =
          all.length === 0
            ? "No labels yet. Type a name above to create one."
            : query
              ? "No labels match."
              : "All labels already applied to selection.";
        scroll.appendChild(empty);
        return;
      }
      for (const l of candidates) {
        const item = document.createElement("div");
        item.className = "ls-menu-item";
        const sw = document.createElement("span");
        sw.className = "ls-menu-swatch";
        if (l.color) sw.style.background = l.color;
        item.appendChild(sw);
        const txt = document.createElement("span");
        txt.textContent = l.name;
        item.appendChild(txt);
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          lm.addLabelToInstances(uids, l.id);
          onPicked();
        });
        scroll.appendChild(item);
      }
    };
    renderCandidates();

    // Filter as you type.
    input.addEventListener("input", () =>
      renderCandidates(input.value.trim().toLowerCase()),
    );

    // Commit on click-away: if the input still holds text when the menu is
    // dismissed by clicking elsewhere, create-if-new + apply it (createLabel
    // dedupes by name, addLabelToInstances is idempotent). Exposed for the
    // click-away handler in _renderLabelsSection; NOT called on Enter/Escape.
    menu._commitTyped = () => {
      if (!lm) return;
      const name = input.value.trim();
      if (!name) return;
      const label = lm.createLabel(name);
      if (label) lm.addLabelToInstances(uids, label.id);
    };

    // Footer: divider + "Manage labels…" entry that opens the dictionary
    // dialog. Lives here (not in the inspector header) per design feedback.
    const footDiv = document.createElement("div");
    footDiv.className = "ls-menu-divider";
    menu.appendChild(footDiv);

    const manage = document.createElement("div");
    manage.className = "ls-menu-item ls-menu-manage";
    const gear = document.createElement("span");
    gear.className = "ls-menu-gear";
    gear.innerHTML = Icons.Settings;
    manage.appendChild(gear);
    const mTxt = document.createElement("span");
    mTxt.textContent = "Manage labels…";
    manage.appendChild(mTxt);
    manage.addEventListener("click", (e) => {
      e.stopPropagation();
      onPicked(); // close menu first
      showLabelsDictionaryDialog();
    });
    menu.appendChild(manage);

    // Focus the input so users can immediately type a new label name.
    setTimeout(() => input.focus(), 0);
    return menu;
  }

  /**
   * Public hook: re-render only the labels chip strip in place. Called by
   * the dictionary dialog after edits so chips reflect the new names/colors
   * without rebuilding all property components.
   */
  refreshLabelsSection() {
    if (this.labelsSectionEl) {
      this._renderLabelsSection();
    }
  }

  // Update component values without rebuilding HTML
  updateComponentValues() {
    if (this.selectedInstances.length === 0) {
      return;
    }

    // Update each existing component with new values
    this.components.forEach((component, propertyKey) => {
      const values = this.getPropertyValues(propertyKey);
      this.setComponentValue(component, values);
    });
    this._refreshLabelVarValues();
  }

  findCommonProperties() {
    if (this.selectedInstances.length === 0) return [];

    // Get object type definitions for all selected instances
    const instanceDefinitions = this.selectedInstances
      .map((instance) => {
        const objectTypeName = instance.objectType?.name;
        return ObjectTypeDefinitions[objectTypeName];
      })
      .filter((def) => def);

    if (instanceDefinitions.length === 0) return [];

    // Find properties that exist in ALL selected object types
    const firstDefinition = instanceDefinitions[0];
    if (!firstDefinition) return [];

    return firstDefinition.properties.filter((prop) => {
      return instanceDefinitions.every((def) =>
        def.properties.some((p) => p.key === prop.key && p.type === prop.type),
      );
    });
  }

  getPropertyValues(propertyKey) {
    return this.selectedInstances
      .map((instance) => {
        const objectTypeName = instance.objectType?.name;
        const definition = ObjectTypeDefinitions[objectTypeName];
        if (!definition || !definition.getValue) return null;

        // Use the object type's getValue function
        return definition.getValue(instance, propertyKey);
      })
      .filter((value) => value !== null);
  }

  setComponentValue(component, values) {
    if (values.length === 0) {
      component.setVariesState();
      return;
    }

    // Check if all values are the same
    const firstValue = values[0];
    const allSame = values.every((value) => {
      if (typeof firstValue === "object" && typeof value === "object") {
        return JSON.stringify(firstValue) === JSON.stringify(value);
      }
      return firstValue === value;
    });

    // Components are reused across selection changes (same-schema fast path in
    // setSelection), so a previous multi-selection's varies flags must be reset
    // here — setValue() alone never clears them. Reset silently; the setValue()
    // below repaints.
    const resetVaries = () => {
      component.isVaries = false;
      component.variesStates = {};
    };

    if (allSame) {
      resetVaries();
      component.setValue(firstValue);
    } else {
      // Check for varies by axis in multi-value components
      if (
        typeof firstValue === "object" &&
        component instanceof MultiValueComponent
      ) {
        const axes = component.getAxes();
        const variesAxes = [];

        axes.forEach((axis) => {
          const axisValues = values.map((v) => v[axis]);
          const firstAxisValue = axisValues[0];
          const axisAllSame = axisValues.every((v) => v === firstAxisValue);

          if (!axisAllSame) {
            variesAxes.push(axis);
          }
        });

        resetVaries();
        component.setValue(firstValue);
        variesAxes.forEach((axis) => {
          component.setVariesStateForAxis(axis);
        });
      } else {
        component.setVariesState();
      }
    }
  }

  handlePropertyChange(data, key) {
    const component = this.components.get(key);
    const propConfig = component?.config;

    // Apply changes to all selected instances
    this.selectedInstances.forEach((instance) => {
      const objectTypeName = instance.objectType?.name;
      const definition = ObjectTypeDefinitions[objectTypeName];

      if (definition && definition.onChange) {
        definition.onChange(data, instance, key);
      }
    });

    // Refresh the selection visuals (this will trigger gizmo updates)
    if (globalThis._editorScope.selectionManager) {
      globalThis._editorScope.selectionManager.updateSelectionGizmos();
    }

    if (!propConfig?.skipUndo && globalThis._editorScope?.stateManager) {
      const msg = propConfig?.undoMessage || `Change ${key}`;
      globalThis._editorScope.stateManager.pushUndoState(msg);
    }
  }

  refresh() {
    if (this.isShowingLevelSettings) {
      this.showLevelSettings();
      return;
    }
    if (this.selectedInstances.length > 0) {
      this.updateComponentValues();
      this._renderLabelVarSections();
    }
  }

  clearComponents() {
    this.components.forEach((component) => component.destroy());
    this.components.clear();
    this._destroyLabelVarComponents();

    const content = this.sidebar.querySelector(".sidebar-content");
    content.innerHTML = "";
    // labelsSectionEl lives in .sidebar-header (NOT .sidebar-content), so
    // it's preserved across selection changes — no need to null it.
  }

  showEmptyState(message = null) {
    const content = this.sidebar.querySelector(".sidebar-content");
    content.innerHTML = `
      <div class="inspector-empty">
        <h4>No Selection</h4>
        <p>${message || "Select an object to view its properties."}</p>
      </div>
    `;
  }

  showLevelSettings(focusGroupId = null) {
    this.isShowingLevelSettings = true;
    this.updateHeader();

    const content = this.sidebar.querySelector(".sidebar-content");
    content.innerHTML = "";

    const typeByKey = {};
    for (const typeDef of levelSettingsTypes) {
      typeByKey[typeDef.properties.originalKey] = typeDef;
    }

    const allProps = levelSettingsTypes.map((t) => t.properties);
    const placed = new Set();

    const createLevelComponent = (propDef) => {
      const typeDef = typeByKey[propDef.originalKey];
      const component = ComponentFactory.create(propDef.type, propDef);

      const value = typeDef.getValue();
      component.setValue(value);

      component.addEventListener("change", (event) => {
        typeDef.onChange(event.detail);
      });
      this.components.set(propDef.key, component);
      return component;
    };

    for (const group of levelSettingsGroups) {
      const groupProps = allProps.filter(
        (p) => group.keys.includes(p.originalKey) && !placed.has(p.originalKey),
      );
      if (groupProps.length === 0) continue;

      const { groupEl, body } = this._buildGroup({
        id: `ls:${group.id}`,
        label: group.label,
        count: groupProps.length,
      });
      // Keep the plain id too: the publishing checklist scrolls to it.
      groupEl.dataset.groupId = group.id;
      for (const propDef of groupProps) {
        const component = createLevelComponent(propDef);
        body.appendChild(component.element);
        placed.add(propDef.originalKey);
      }
      content.appendChild(groupEl);
    }

    if (focusGroupId) {
      // Scroll the requested settings group into view and flash it (used by the
      // publishing checklist "star times" link).
      requestAnimationFrame(() => {
        const el = content.querySelector(`[data-group-id="${focusGroupId}"]`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("group-flash");
          setTimeout(() => el.classList.remove("group-flash"), 1500);
        }
      });
    }
  }

  destroy() {
    this.clearComponents();

    if (this.sidebar) {
      this.sidebar.remove();
    }

    const styles = document.querySelector("#inspector-ui-styles");
    if (styles) {
      styles.remove();
    }
  }
}

// Global inspector instance (will be created in main.js)
export let inspectorUI = null;

// Helper function to initialize the inspector
export function initializeInspector(container = document.body) {
  if (!inspectorUI) {
    inspectorUI = new InspectorUI(container);
  }
  return inspectorUI;
}

export function destroyInspector() {
  if (inspectorUI) {
    inspectorUI.destroy();
    inspectorUI = null;
  }
}

// Helper functions for integration with selection manager
export function refreshInspector() {
  if (inspectorUI) {
    inspectorUI.refresh();
  }
}

export function showInspectorForProject() {
  if (inspectorUI) {
    inspectorUI.showLevelSettings();
    inspectorUI.show();
  }
}

/**
 * Open the inspector on the level settings and scroll to a specific group
 * (e.g. "levelTimes" for star times). Clears selection so the settings view
 * sticks.
 * @param {string} groupId - level settings group id from levelSettingsDefinitions
 */
export function openLevelSettingsAt(groupId) {
  if (!inspectorUI) return;
  const sm = globalThis._editorScope?.selectionManager;
  if (sm && typeof sm.clearSelection === "function") sm.clearSelection();
  if (typeof inspectorUI.setMinimized === "function") {
    inspectorUI.setMinimized(false);
  }
  inspectorUI.show();
  inspectorUI.showLevelSettings(groupId);
}

/**
 * Re-render only the inspector's labels chip strip in place. Cheap; safe to
 * call from the labels dictionary dialog or any code that mutates label
 * dictionary entries / instance label membership.
 */
export function refreshInspectorLabels() {
  if (inspectorUI) inspectorUI.refreshLabelsSection();
}

export function updateInspectorSelection(instances) {
  if (inspectorUI) {
    if (instances && instances.length > 0) {
      inspectorUI.setSelection(instances);
    } else {
      inspectorUI.clearSelection();
    }
  }
}
