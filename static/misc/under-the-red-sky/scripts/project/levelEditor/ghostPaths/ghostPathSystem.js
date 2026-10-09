// Ghost Path System Initialization
// Initializes and coordinates all ghost path components

import {
  initializeGhostPathManager,
  destroyGhostPathManager,
} from "./ghostPathManager.js";
import {
  initializeGhostPathRenderer,
  destroyGhostPathRenderer,
} from "./ghostPathRenderer.js";

/**
 * Initialize the complete Ghost Path system
 * This function should be called when the level editor starts
 */
export function initializeGhostPathSystem() {
  const manager = initializeGhostPathManager();
  const renderer = initializeGhostPathRenderer();
  return { manager, renderer };
}

/**
 * Destroy the Ghost Path system
 * This function should be called when the level editor shuts down
 */
export function destroyGhostPathSystem() {
  destroyGhostPathRenderer();
  destroyGhostPathManager();
}

/**
 * Get the Ghost Path system components
 * @returns {Object|null} System components or null if not initialized
 */
export function getGhostPathSystem() {
  return globalThis._editorScope?.ghostPathSystem || null;
}

/**
 * Check if the Ghost Path system is initialized
 * @returns {boolean} Whether the system is initialized
 */
export function isGhostPathSystemInitialized() {
  const system = getGhostPathSystem();
  return system && system.manager && system.renderer;
}

/**
 * Restart the Ghost Path system
 * Useful for reloading after configuration changes
 */
export function restartGhostPathSystem() {
  console.log("[GhostPathSystem] Restarting Ghost Path system...");

  try {
    destroyGhostPathSystem();
    return initializeGhostPathSystem();
  } catch (error) {
    console.error(
      "[GhostPathSystem] Failed to restart Ghost Path system:",
      error
    );
    throw error;
  }
}
