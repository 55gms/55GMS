// Difficulty Selector Component
// Reusable component for selecting difficulty (0-10 scale)

import { Theme } from "./inspectorUI.js";

/**
 * Creates a difficulty selector component
 * @param {Object} options - Configuration options
 * @param {number} options.currentValue - Current difficulty value (0-10)
 * @param {Function} options.onChange - Callback when difficulty changes (value) => void
 * @param {boolean} options.disabled - Whether the selector is disabled
 * @returns {HTMLElement} The difficulty selector container element
 */
export function createDifficultySelector(options = {}) {
  const { currentValue = 5, onChange = () => {}, disabled = false } = options;

  const container = document.createElement("div");
  container.className = "difficulty-selector-container";

  const label = document.createElement("label");
  label.className = "difficulty-selector-label";
  label.textContent = "Difficulty";

  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "difficulty-buttons-container";

  // Create buttons 0-10
  for (let i = 0; i <= 10; i++) {
    const button = document.createElement("button");
    button.className = "difficulty-button";
    button.setAttribute("data-value", i);
    button.disabled = disabled;

    if (currentValue === i) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      if (disabled) return;

      // Remove active class from all buttons
      buttonsContainer.querySelectorAll(".difficulty-button").forEach((btn) => {
        btn.classList.remove("active");
      });

      // Add active class to clicked button
      button.classList.add("active");

      // Call onChange callback
      onChange(i);
    });

    buttonsContainer.appendChild(button);
  }

  container.appendChild(label);
  container.appendChild(buttonsContainer);

  // Add method to update value programmatically
  container.updateValue = (newValue) => {
    buttonsContainer.querySelectorAll(".difficulty-button").forEach((btn) => {
      const value = parseInt(btn.getAttribute("data-value"));
      if (value === newValue) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  };

  // Add method to enable/disable
  container.setDisabled = (isDisabled) => {
    buttonsContainer.querySelectorAll(".difficulty-button").forEach((btn) => {
      btn.disabled = isDisabled;
    });
  };

  return container;
}

/**
 * Apply styles for the difficulty selector component
 * This should be called once when the component is first used
 */
export function applyDifficultySelectorStyles() {
  if (!document.querySelector("#difficulty-selector-styles")) {
    const style = document.createElement("style");
    style.id = "difficulty-selector-styles";
    style.textContent = `
      /* Difficulty Selector Component Styles */
      .difficulty-selector-container {
        display: flex;
        flex-direction: row;
        gap: 2px;
        align-items: center;
        margin-bottom: -2px;
      }

      .difficulty-selector-label {
        font-weight: 600;
        color: ${Theme.textSecondary};
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .difficulty-buttons-container {
        display: flex;
        gap: 2px;
        flex-wrap: wrap;
        margin-left: auto;
      }

      .difficulty-button {
        position: relative;
        width: 28px;
        height: 36px;
        min-width: 28px;
        min-height: 36px;
        padding: 0;
        border: none;
        background: transparent;
        color: ${Theme.textSecondary};
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .difficulty-button::before {
        content: '';
        position: absolute;
        bottom: 2;
        left: 0;
        right: 0;
        height: 6px;
        // background: ${Theme.borderSecondary};
        border-radius: 0;
        transition: all 0.1s ease;
      }

      .difficulty-button::after {
        content: attr(data-value);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 0;
        transition: all 0.1s linear;
        transform: translateY(0);
        box-shadow: 0 4px 0 ${Theme.borderSecondary};
      }

      .difficulty-button:hover:not(:disabled)::after {
        border-color: ${Theme.primary};
        background: ${Theme.componentBackgroundHover};
        transform: translateY(-2px);
        box-shadow: 0 6px 0 ${Theme.borderSecondary};
      }

      .difficulty-button.active::before {
        // background: ${Theme.primary};
        box-shadow: 0 0 10px ${Theme.primary}66;
      }

      .difficulty-button.active::after {
        border-color: ${Theme.primary};
        background: ${Theme.primary};
        color: ${Theme.textPrimary};
        transform: translateY(4px);
        box-shadow: 0 0 0 ${Theme.primary};
      }

      .difficulty-button.active:hover:not(:disabled)::after {
        border-color: ${Theme.primaryHover};
        background: ${Theme.primaryHover};
        transform: translateY(4px);
        box-shadow: 0 0 0 ${Theme.borderSecondary};
      }

      .difficulty-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  }
}
