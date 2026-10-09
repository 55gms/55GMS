// Grid UI System for Level Editor
// Compact GRID-Z scrub field docked under the orbit nav gizmo.

import { Theme, NumberDragHandler } from "./inspectorUI.js";

// Kept in sync with navGizmo.js so the widget tracks the gizmo.
const GIZMO_TOP_PX = 61;
const GIZMO_HEIGHT_PX = 96;
const GIZMO_GAP_PX = 12;
const GRID_UI_TOP_PX = GIZMO_TOP_PX + GIZMO_HEIGHT_PX + GIZMO_GAP_PX; // 169
const RIGHT_INSET_DEFAULT = 12;
const RIGHT_INSET_INSPECTOR_OPEN = 280 + 12; // 292
const RIGHT_INSET_MINTAB_OPEN = 22 + 12; // 34

export class GridUI {
  constructor(gridSystem) {
    this.gridSystem = gridSystem;
    this.container = document.body;
    this.isVisible = true;

    // UI elements
    this.sliderContainer = null;
    this.zInput = null;
    this.dragHandler = null;

    this._inspectorObserver = null;
    this._pmListeners = null;

    this.init();
  }

  init() {
    this.createSliderUI();
    this.applyStyles();
    this.setupEventListeners();
    this.updateDisplay();
    this.show(); // Show by default
    this._watchInspector();
    this._watchProject();
  }

  createSliderUI() {
    this.sliderContainer = document.createElement("div");
    this.sliderContainer.className = "grid-ui-container";

    const title = document.createElement("div");
    title.className = "grid-ui-title";
    title.textContent = "GRID Z";

    this.zInput = document.createElement("input");
    this.zInput.type = "number";
    this.zInput.className = "grid-ui-input";
    this.zInput.min = "0";
    this.zInput.max = "1000";
    this.zInput.value = "0";
    this.zInput.step = "1";
    this.zInput.title = "Grid height (drag to scrub, scroll, or type)";

    this.sliderContainer.appendChild(title);
    this.sliderContainer.appendChild(this.zInput);
    this.container.appendChild(this.sliderContainer);
  }

  setupEventListeners() {
    this.dragHandler = new NumberDragHandler(this.zInput, {
      min: 0,
      max: 1000,
      step: 1,
      dragSpeed: 1,
      precision: 0,
    });

    this.zInput.addEventListener("input", (e) => {
      const value = parseInt(e.target.value) || 0;
      this.gridSystem.setZPosition(value);
      this.updateDisplay();
    });

    // Input wheel event: scroll to step (Shift = jump to next grid multiple)
    this.zInput.addEventListener("wheel", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const currentValue = parseInt(this.zInput.value) || 0;
      const gridSystem = globalThis._editorScope?.gridSystem;
      const scrollDelta = e.shiftKey ? e.deltaX : -e.deltaY;
      const gridSize = gridSystem.getGridSize().z;
      if (e.shiftKey && gridSystem) {
        const nextGridPos =
          scrollDelta > 0
            ? Math.ceil((currentValue + 1) / gridSize) * gridSize
            : Math.floor((currentValue - 1) / gridSize) * gridSize;
        const newValue = Math.max(0, Math.min(1000, nextGridPos));
        this.gridSystem.setZPosition(newValue);
        this.updateDisplay();
      } else {
        const delta = scrollDelta > 0 ? 1 : -1;
        const newValue = Math.max(0, Math.min(1000, currentValue + delta));
        this.gridSystem.setZPosition(newValue);
        this.updateDisplay();
      }
    });

    // Arrow key handling for the input
    const handleArrowKeys = (e, getValue, setValue) => {
      let value = getValue();
      const gridSystem = globalThis._editorScope?.gridSystem;
      const gridSize = gridSystem.getGridSize().z;
      if (e.key === "ArrowUp") {
        if (e.shiftKey) {
          // Step by grid size
          value = Math.ceil((value + 1) / gridSize) * gridSize;
        } else {
          value = value + 1;
        }
        value = Math.max(0, Math.min(1000, value));
        setValue(value);
        e.preventDefault();
        e.stopPropagation();
      } else if (e.key === "ArrowDown") {
        if (e.shiftKey) {
          value = Math.floor((value - 1) / gridSize) * gridSize;
        } else {
          value = value - 1;
        }
        value = Math.max(0, Math.min(1000, value));
        setValue(value);
        e.preventDefault();
        e.stopPropagation();
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.stopPropagation();
      }
    };
    this.zInput.addEventListener("keydown", (e) => {
      handleArrowKeys(
        e,
        () => parseInt(this.zInput.value) || 0,
        (v) => {
          this.gridSystem.setZPosition(v);
          this.updateDisplay();
        }
      );
    });

    // Focus/unfocus styling for container
    const setFocusState = (focused) => {
      if (focused) {
        this.sliderContainer.classList.add("focused");
      } else {
        this.sliderContainer.classList.remove("focused");
      }
    };
    let focusCount = 0;
    const onFocus = () => {
      focusCount++;
      setFocusState(true);
    };
    const onBlur = () => {
      focusCount = Math.max(0, focusCount - 1);
      if (focusCount === 0) setFocusState(false);
    };
    this.zInput.addEventListener("focus", onFocus);
    this.zInput.addEventListener("blur", onBlur);

    // Prevent events from propagating to the scene
    this.sliderContainer.addEventListener("mousedown", (e) =>
      e.stopPropagation()
    );
    this.sliderContainer.addEventListener("click", (e) => e.stopPropagation());
    this.sliderContainer.addEventListener("wheel", (e) => e.stopPropagation());
  }

  updateDisplay() {
    const zPosition = this.gridSystem.getZPosition();
    this.zInput.value = zPosition;
  }

  show() {
    this.isVisible = true;
    this.sliderContainer.classList.add("visible");
  }

  hide() {
    this.isVisible = false;
    this.sliderContainer.classList.remove("visible");
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  // Slide with the inspector sidebar / mintab, mirroring navGizmo.
  _watchInspector() {
    const apply = (sidebar, mintab) => {
      if (sidebar) {
        this.sliderContainer.classList.toggle(
          "inspector-open",
          sidebar.classList.contains("visible")
        );
      }
      if (mintab) {
        this.sliderContainer.classList.toggle(
          "mintab-open",
          !mintab.classList.contains("hidden")
        );
      }
    };
    const setup = (sidebar) => {
      if (!sidebar) return;
      const mintab = sidebar.parentElement?.querySelector(".inspector-min-tab");
      apply(sidebar, mintab);
      const targets = [sidebar];
      if (mintab) targets.push(mintab);
      this._inspectorObserver = new MutationObserver(() =>
        apply(sidebar, mintab)
      );
      for (const t of targets) {
        this._inspectorObserver.observe(t, {
          attributes: true,
          attributeFilter: ["class"],
        });
      }
    };
    const sidebar = document.querySelector(".inspector-sidebar");
    if (sidebar) {
      setup(sidebar);
    } else {
      requestAnimationFrame(() => {
        setup(document.querySelector(".inspector-sidebar"));
      });
    }
  }

  // Hide until a project is loaded. Mirrors navGizmo._watchProject.
  _watchProject() {
    const pm =
      globalThis._editorScope && globalThis._editorScope.projectManager;
    this.setVisible(false);
    if (!pm) {
      requestAnimationFrame(() => this._watchProject());
      return;
    }
    const onLoaded = () => this.setVisible(true);
    const onClosed = () => this.setVisible(false);
    pm.addEventListener("projectLoaded", onLoaded);
    pm.addEventListener("projectCreated", onLoaded);
    pm.addEventListener("projectClosed", onClosed);
    this._pmListeners = { pm, onLoaded, onClosed };
    if (typeof pm.hasProjectLoaded === "function" && pm.hasProjectLoaded()) {
      this.setVisible(true);
    }
  }

  setVisible(v) {
    this.sliderContainer.classList.toggle("hidden", !v);
  }

  applyStyles() {
    if (!document.querySelector("#grid-ui-styles")) {
      const style = document.createElement("style");
      style.id = "grid-ui-styles";
      style.textContent = `
        .grid-ui-container {
          position: fixed;
          top: ${GRID_UI_TOP_PX}px;
          right: ${RIGHT_INSET_DEFAULT}px;
          z-index: 998;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          background: transparent;
          border-radius: 6px;
          opacity: 0.7;
          visibility: hidden;
          transition: right 0.3s ease, opacity 0.2s ease, background 0.2s ease;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          user-select: none;
        }
        .grid-ui-container.visible {
          visibility: visible;
        }
        .grid-ui-container.hidden {
          display: none;
        }
        .grid-ui-container.inspector-open {
          right: ${RIGHT_INSET_INSPECTOR_OPEN}px;
        }
        .grid-ui-container.mintab-open {
          right: ${RIGHT_INSET_MINTAB_OPEN}px;
        }
        .grid-ui-container:hover,
        .grid-ui-container.focused {
          opacity: 1;
          background: ${Theme.componentBackground};
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
        }
        .grid-ui-title {
          font-size: 0.6rem;
          font-weight: 600;
          color: ${Theme.labelDefault};
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .grid-ui-input {
          font-size: 0.75rem;
          font-weight: 600;
          color: ${Theme.textPrimary};
          width: 40px;
          background: transparent;
          border: none;
          padding: 2px 4px;
          border-radius: 4px;
          text-align: center;
          outline: none;
          cursor: ns-resize;
          transition: box-shadow 0.2s, background 0.2s;
        }
        .grid-ui-input:focus, .grid-ui-input:focus-visible {
          background: ${Theme.inputBackground};
          box-shadow: 0 0 12px 2px ${Theme.primary}33, 0 2px 8px rgba(0,0,0,0.08);
        }
        .grid-ui-input:hover:not(:focus) {
          background: ${Theme.inputBackground}55;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        input[type=number] {
            -moz-appearance:textfield;
        }
      `;
      document.head.appendChild(style);
    }
  }

  destroy() {
    if (this.dragHandler) {
      this.dragHandler.destroy();
      this.dragHandler = null;
    }
    if (this._inspectorObserver) {
      this._inspectorObserver.disconnect();
      this._inspectorObserver = null;
    }
    if (this._pmListeners) {
      const { pm, onLoaded, onClosed } = this._pmListeners;
      pm.removeEventListener("projectLoaded", onLoaded);
      pm.removeEventListener("projectCreated", onLoaded);
      pm.removeEventListener("projectClosed", onClosed);
      this._pmListeners = null;
    }
    if (this.sliderContainer && this.sliderContainer.parentNode) {
      this.sliderContainer.parentNode.removeChild(this.sliderContainer);
    }

    const style = document.querySelector("#grid-ui-styles");
    if (style) {
      style.remove();
    }
  }
}

// Global grid UI instance
let gridUI = null;

// Initialize grid UI
export function initializeGridUI(gridSystem) {
  if (gridUI) {
    gridUI.destroy();
  }

  gridUI = new GridUI(gridSystem);
  return gridUI;
}

// Get grid UI instance
export function getGridUI() {
  return gridUI;
}

// Destroy grid UI
export function destroyGridUI() {
  if (gridUI) {
    gridUI.destroy();
    gridUI = null;
  }
}
