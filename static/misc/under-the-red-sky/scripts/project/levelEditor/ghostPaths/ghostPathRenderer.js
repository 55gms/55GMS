// Ghost Path Renderer for Level Editor
// Handles visualization of ghost paths using the gizmoRenderer system

import { getGhostPathManager } from "./ghostPathManager.js";

/**
 * Ghost Path Renderer class
 * Renders ghost paths using the existing gizmoManager system
 */
export class GhostPathRenderer {
  constructor() {
    this.ghostPathManager = getGhostPathManager();
    this.gizmoManager = null;
    this.isVisible = true;
    this.renderedPaths = new Map(); // Track rendered ghost paths
    this.ghostVisibility = new Map(); // Track individual ghost visibility
    this.activeAnimations = new Map(); // Track active animations per ghost
    this.animationCubes = new Map(); // Track animation cubes per ghost
    this.isAnimating = false;
    this.animationLoopId = null;

    // Path visualization settings
    this.pathSettings = {
      lineWidth: 3.0,
      pointSize: 5.0,
      segmentLength: 0.2, // Distance between path points for smooth curves
      minPointDistance: 0.1, // Minimum distance between recorded points
    };

    console.log("[GhostPathRenderer] Initialized");
  }

  /**
   * Initialize the renderer and connect to gizmoManager
   */
  initialize() {
    // Get gizmoManager from global scope
    this.gizmoManager = globalThis._editorScope?.gizmoManager;

    if (!this.gizmoManager) {
      console.warn("[GhostPathRenderer] GizmoManager not available");
      return false;
    }

    // Set up event listeners
    this.setupEventListeners();

    console.log(
      "[GhostPathRenderer] Initialized and connected to gizmoManager"
    );
    return true;
  }

  /**
   * Set up event listeners for ghost path changes
   */
  setupEventListeners() {
    this.ghostPathManager.addEventListener("ghostDataLoaded", () => {
      this.refreshAllPaths();
    });

    this.ghostPathManager.addEventListener("customGhostAdded", () => {
      this.refreshAllPaths();
    });

    this.ghostPathManager.addEventListener("customGhostRemoved", () => {
      this.refreshAllPaths();
    });

    this.ghostPathManager.addEventListener("customGhostUpdated", () => {
      this.refreshAllPaths();
    });

    this.ghostPathManager.addEventListener(
      "ghostSettingsUpdated",
      (settings) => {
        if ("pathsVisible" in settings) {
          this.setVisible(settings.pathsVisible);
        }
      }
    );

    this.ghostPathManager.addEventListener("allGhostsCleared", () => {
      this.clearAllPaths();
    });
  }

  /**
   * Set visibility of ghost paths
   * @param {boolean} visible - Whether paths should be visible
   */
  setVisible(visible) {
    this.isVisible = visible;

    if (visible) {
      this.refreshAllPaths();
    } else {
      this.clearAllPaths();
    }
    this.ghostPathManager.notifyListeners("ghostPathsVisibilityChanged", {
      visible: this.isVisible,
    });
  }

  toggleVisible() {
    this.setVisible(!this.isVisible);
  }

  /**
   * Get current visibility state
   * @returns {boolean} Whether paths are visible
   */
  getVisible() {
    return this.isVisible;
  }

  /**
   * Set visibility of a specific ghost
   * @param {string} ghostId - Ghost ID
   * @param {boolean} visible - Whether this ghost should be visible
   */
  setGhostVisible(ghostId, visible) {
    this.ghostVisibility.set(ghostId, visible);

    if (visible && this.isVisible) {
      // Show this ghost if global visibility is on
      const ghostData = this.getGhostDataById(ghostId);
      if (ghostData) {
        this.renderGhostPath(ghostId, ghostData);
      }
    } else {
      // Hide this ghost
      this.clearGhostPath(ghostId);
    }
  }

  /**
   * Get visibility state of a specific ghost
   * @param {string} ghostId - Ghost ID
   * @returns {boolean} Whether this ghost is visible
   */
  isGhostVisible(ghostId) {
    return this.ghostVisibility.get(ghostId) !== false; // Default to true if not set
  }

  /**
   * Toggle visibility of a specific ghost
   * @param {string} ghostId - Ghost ID
   * @returns {boolean} New visibility state
   */
  toggleGhostVisibility(ghostId) {
    const newVisibility = !this.isGhostVisible(ghostId);
    this.setGhostVisible(ghostId, newVisibility);
    return newVisibility;
  }

  /**
   * Get ghost data by ID
   * @param {string} ghostId - Ghost ID
   * @returns {Object|null} Ghost data or null
   */
  getGhostDataById(ghostId) {
    const ghostData = this.ghostPathManager.getCurrentLevelGhosts();
    if (!ghostData) return null;

    if (ghostId === "best") return ghostData.bestGhost;
    if (ghostId === "last") return ghostData.lastGhost;

    return (
      ghostData.customGhosts?.find((ghost) => ghost.id === ghostId) || null
    );
  }

  /**
   * Refresh all ghost path visualizations
   */
  refreshAllPaths() {
    if (!this.isVisible || !this.gizmoManager) {
      return;
    }

    // Clear existing paths
    this.clearAllPaths();

    const ghostData = this.ghostPathManager.getCurrentLevelGhosts();
    if (!ghostData) {
      return;
    }

    // Render best ghost if visible
    if (
      ghostData.bestGhost &&
      ghostData.bestGhost.data &&
      this.isGhostVisible("best")
    ) {
      this.renderGhostPath("best", ghostData.bestGhost);
    }

    // Render last ghost if visible
    if (
      ghostData.lastGhost &&
      ghostData.lastGhost.data &&
      this.isGhostVisible("last")
    ) {
      this.renderGhostPath("last", ghostData.lastGhost);
    }

    // Render custom ghosts if visible
    if (ghostData.customGhosts) {
      ghostData.customGhosts.forEach((ghost) => {
        if (ghost.data && this.isGhostVisible(ghost.id)) {
          this.renderGhostPath(ghost.id, ghost);
        }
      });
    }

    console.log("[GhostPathRenderer] Refreshed all ghost paths");
  }

  /**
   * Render a single ghost path
   * @param {string} ghostId - Unique identifier for this ghost
   * @param {Object} ghostData - Ghost data containing path and visual properties
   */
  renderGhostPath(ghostId, ghostData) {
    if (!this.gizmoManager || !ghostData.data) {
      return;
    }

    // Set default visibility for new ghosts if not already set
    if (!this.ghostVisibility.has(ghostId)) {
      this.ghostVisibility.set(ghostId, true);
    }

    // Convert color and opacity to RGBA
    const color = this.ghostPathManager.colorToRGBA(
      ghostData.color || "#16B0FE",
      ghostData.opacity || 1.0
    );

    // Process path data to create smooth line segments
    const pathPoints = this.processPathData(ghostData.data);

    if (pathPoints.length < 2) {
      console.warn(
        `[GhostPathRenderer] Insufficient path points for ghost ${ghostId}`
      );
      return;
    }

    // Create line segments for the path
    const lineSegments = this.createLineSegments(pathPoints);

    // Create gizmos for each line segment using GizmoManager
    const gizmoIds = [];

    lineSegments.forEach((segment, index) => {
      const gizmoId = this.gizmoManager.createGizmo(
        "line3D",
        {
          x1: segment.start[0],
          y1: segment.start[1],
          z1: segment.start[2],
          x2: segment.end[0],
          y2: segment.end[1],
          z2: segment.end[2],
          color: color,
          thickness: this.pathSettings.lineWidth,
        },
        [`ghostPath`, `ghost_${ghostId}`],
        false, // not interactible
        "Gizmos" // layer name
      );

      gizmoIds.push(gizmoId);
    });

    // Add start and end point markers
    const startMarkerId = this.gizmoManager.createGizmo(
      "box3D",
      {
        x: pathPoints[1][0],
        y: pathPoints[1][1],
        z: pathPoints[1][2],
        width: 32.0,
        height: 32.0,
        depth: 32.0,
        color,
        filled: true,
      },
      [`ghostPath`, `ghost_${ghostId}`, `startMarker`],
      false,
      "Gizmos"
    );
    gizmoIds.push(startMarkerId);

    // End point (red box)
    const endMarkerId = this.gizmoManager.createGizmo(
      "box3D",
      {
        x: pathPoints[pathPoints.length - 1][0],
        y: pathPoints[pathPoints.length - 1][1],
        z: pathPoints[pathPoints.length - 1][2],
        width: 32,
        height: 32,
        depth: 32,
        color, // Red with same opacity
        filled: true,
      },
      [`ghostPath`, `ghost_${ghostId}`, `endMarker`],
      false,
      "Gizmos"
    );
    gizmoIds.push(endMarkerId);

    // Store rendered path info
    this.renderedPaths.set(ghostId, {
      gizmoIds,
      pathPoints,
      ghostData,
    });

    console.log(
      `[GhostPathRenderer] Rendered ghost path ${ghostId} with ${lineSegments.length} segments`
    );
  }

  /**
   * Process raw path data into usable 3D points
   * @param {Array} pathData - Raw path data: [{time, position: [x, y, z]}, ...]
   * @returns {Array} Array of 3D position vectors
   */
  processPathData(pathData) {
    const points = [];

    for (const dataPoint of pathData) {
      // Extract position - handle the correct format: {time, position: [x, y, z]}
      let position;

      if (
        dataPoint.position &&
        Array.isArray(dataPoint.position) &&
        dataPoint.position.length >= 3
      ) {
        // Correct format: {time, position: [x, y, z]}
        position = [
          dataPoint.position[0],
          dataPoint.position[1],
          dataPoint.position[2],
        ];
      } else if (
        dataPoint.x !== undefined &&
        dataPoint.y !== undefined &&
        dataPoint.z !== undefined
      ) {
        // Legacy direct coordinate format
        position = [dataPoint.x, dataPoint.y, dataPoint.z];
      } else if (Array.isArray(dataPoint) && dataPoint.length >= 3) {
        // Direct array format
        position = [dataPoint[0], dataPoint[1], dataPoint[2]];
      } else {
        console.warn(
          "[GhostPathRenderer] Unrecognized path data format:",
          dataPoint
        );
        continue;
      }

      // Filter out points that are too close to the last point
      if (points.length > 0) {
        const lastPoint = points[points.length - 1];
        const distance = this.calculateDistance(position, lastPoint);

        if (distance < this.pathSettings.minPointDistance) {
          continue; // Skip this point
        }
      }

      points.push(position);
    }

    return points;
  }

  /**
   * Create line segments from path points
   * @param {Array} points - Array of 3D position vectors
   * @returns {Array} Array of line segments
   */
  createLineSegments(points) {
    const segments = [];

    for (let i = 0; i < points.length - 1; i++) {
      segments.push({
        start: points[i],
        end: points[i + 1],
      });
    }

    return segments;
  }

  /**
   * Calculate distance between two 3D points
   * @param {Array} point1 - First point [x, y, z]
   * @param {Array} point2 - Second point [x, y, z]
   * @returns {number} Distance between points
   */
  calculateDistance(point1, point2) {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    const dz = point1[2] - point2[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Clear all rendered ghost paths
   */
  clearAllPaths() {
    if (!this.gizmoManager) {
      return;
    }

    // Remove all gizmos for each rendered path
    this.renderedPaths.forEach((pathInfo, ghostId) => {
      pathInfo.gizmoIds.forEach((gizmoId) => {
        this.gizmoManager.deleteGizmo(gizmoId);
      });
    });

    // Clear the rendered paths map
    this.renderedPaths.clear();

    // Stop any active animations
    this.stopAllAnimations();

    console.log("[GhostPathRenderer] Cleared all ghost paths");
  }

  /**
   * Clear a specific ghost path
   * @param {string} ghostId - ID of ghost to clear
   */
  clearGhostPath(ghostId) {
    if (!this.gizmoManager || !this.renderedPaths.has(ghostId)) {
      return;
    }

    const pathInfo = this.renderedPaths.get(ghostId);
    pathInfo.gizmoIds.forEach((gizmoId) => {
      this.gizmoManager.deleteGizmo(gizmoId);
    });

    this.renderedPaths.delete(ghostId);

    // Also stop any animation for this ghost
    this.stopGhostAnimation(ghostId);

    console.log(`[GhostPathRenderer] Cleared ghost path ${ghostId}`);
  }

  /**
   * Start playback animation for a specific ghost
   * @param {string} ghostId - ID of ghost to animate
   * @param {number} speedMultiplier - Speed multiplier for animation (default: 1.0)
   */
  startAnimation(ghostId, speedMultiplier = 1.0) {
    if (!this.gizmoManager || !this.renderedPaths.has(ghostId)) {
      console.warn(
        `[GhostPathRenderer] Cannot animate ghost ${ghostId} - not found`
      );
      return false;
    }

    // If this ghost is already animating, stop it first
    if (this.activeAnimations.has(ghostId)) {
      this.stopGhostAnimation(ghostId);
    } else {
      this.restartActiveAnimations();
    }

    const pathInfo = this.renderedPaths.get(ghostId);
    const ghostData = pathInfo.ghostData;

    // Set up animation data for this ghost
    const animationData = {
      ghostId,
      pathPoints: pathInfo.pathPoints,
      duration: (ghostData.time || 10) * 1000, // Convert seconds to milliseconds, default to 10 seconds
      speedMultiplier,
      color: this.ghostPathManager.colorToRGBA(
        ghostData.color,
        ghostData.opacity
      ),
      startTime: performance.now(),
      originalAnimationDuration: (ghostData.time || 10) * 1000,
      animationDuration: ((ghostData.time || 10) * 1000) / speedMultiplier, // Convert seconds to milliseconds
    };

    this.activeAnimations.set(ghostId, animationData);

    // Start the global animation loop if not already running
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.globalAnimationLoop();
    }

    console.log(
      `[GhostPathRenderer] Started animation for ghost ${ghostId} (${animationData.animationDuration}ms)`
    );
    return true;
  }

  restartActiveAnimations() {
    for (const [ghostId, animationData] of this.activeAnimations) {
      animationData.startTime = performance.now();
    }
  }

  setActiveAnimationsPlaybackSpeed(speed = 1) {
    for (const [ghostId, animationData] of this.activeAnimations) {
      animationData.speedMultiplier = speed;
      animationData.animationDuration =
        animationData.originalAnimationDuration / speed;
    }
  }

  /**
   * Stop animation for a specific ghost
   * @param {string} ghostId - ID of ghost to stop
   */
  stopGhostAnimation(ghostId) {
    if (!this.activeAnimations.has(ghostId)) {
      return false;
    }

    // Remove from active animations
    this.activeAnimations.delete(ghostId);

    // Remove the animation cube for this ghost
    if (this.animationCubes.has(ghostId)) {
      const cubeId = this.animationCubes.get(ghostId);
      if (this.gizmoManager) {
        this.gizmoManager.deleteGizmo(cubeId);
      }
      this.animationCubes.delete(ghostId);
    }

    // Stop global animation loop if no more animations
    if (this.activeAnimations.size === 0) {
      this.isAnimating = false;
      if (this.animationLoopId) {
        cancelAnimationFrame(this.animationLoopId);
        this.animationLoopId = null;
      }
    } else {
      // otherwise restart the loop
      this.restartActiveAnimations();
    }

    console.log(`[GhostPathRenderer] Stopped animation for ghost ${ghostId}`);
    return true;
  }

  /**
   * Toggle animation for a specific ghost
   * @param {string} ghostId - ID of ghost to toggle
   * @param {number} speedMultiplier - Speed multiplier for animation
   * @returns {boolean} Whether animation is now active
   */
  toggleGhostAnimation(ghostId, speedMultiplier = 1.0) {
    if (this.isGhostAnimating(ghostId)) {
      this.stopGhostAnimation(ghostId);
      return false;
    } else {
      return this.startAnimation(ghostId, speedMultiplier);
    }
  }

  /**
   * Check if a specific ghost is currently animating
   * @param {string} ghostId - Ghost ID to check
   * @returns {boolean} Whether this ghost is animating
   */
  isGhostAnimating(ghostId) {
    return this.activeAnimations.has(ghostId);
  }

  /**
   * Global animation loop for all active animations
   */
  globalAnimationLoop() {
    if (!this.isAnimating || this.activeAnimations.size === 0) {
      this.isAnimating = false;
      return;
    }

    const currentTime = performance.now();
    const completedAnimations = [];

    // Update all active animations
    for (const [ghostId, animationData] of this.activeAnimations) {
      const elapsed = currentTime - animationData.startTime;
      const progress = Math.min(elapsed / animationData.animationDuration, 1.0);

      // Interpolate position along the path
      const position = this.interpolatePathPosition(animationData, progress);

      if (position) {
        // Update or create animated cube position
        if (this.animationCubes.has(ghostId)) {
          const cubeId = this.animationCubes.get(ghostId);
          this.gizmoManager.updateGizmo(cubeId, {
            x: position[0],
            y: position[1],
            z: position[2] + 70,
            color: animationData.color,
          });
        } else {
          const cubeId = this.gizmoManager.createGizmo(
            "box3D",
            {
              x: position[0],
              y: position[1],
              z: position[2] + 70,
              width: 45.0,
              height: 45.0,
              depth: 140.0,
              color: animationData.color,
              filled: false,
            },
            [`ghostPath`, `animatedCube`, `ghost_${ghostId}`],
            false,
            "Gizmos"
          );
          this.animationCubes.set(ghostId, cubeId);
        }
      }

      // Check if animation is complete
      if (progress >= 1.0) {
        completedAnimations.push(ghostId);
        if (this.animationCubes.has(ghostId)) {
          const cubeId = this.animationCubes.get(ghostId);
          this.gizmoManager.deleteGizmo(cubeId);
        }
      }
    }

    // Handle completed animations
    if (completedAnimations.length > 0) {
      // If all visible ghosts are done, restart all of them for looping
      const allAnimationsComplete =
        completedAnimations.length === this.activeAnimations.size;

      if (allAnimationsComplete) {
        // Restart all animations for looping
        const restartData = [];
        for (const ghostId of completedAnimations) {
          const animationData = this.activeAnimations.get(ghostId);
          restartData.push({
            ghostId,
            speedMultiplier: animationData.speedMultiplier,
          });
        }

        // Clear completed animations
        for (const ghostId of completedAnimations) {
          this.stopGhostAnimation(ghostId);
        }

        // Restart all animations after a brief pause
        setTimeout(() => {
          for (const { ghostId, speedMultiplier } of restartData) {
            this.startAnimation(ghostId, speedMultiplier);
          }
        }, 500); // 500ms pause between loops
      }
    }

    // Continue animation loop if still animating
    if (this.isAnimating) {
      this.animationLoopId = requestAnimationFrame(() =>
        this.globalAnimationLoop()
      );
    }
  }

  /**
   * Interpolate position along path based on progress for specific animation data
   * @param {Object} animationData - Animation data for specific ghost
   * @param {number} progress - Progress value 0-1
   * @returns {Array|null} Interpolated position [x, y, z]
   */
  interpolatePathPosition(animationData, progress) {
    if (!animationData || !animationData.pathPoints) {
      return null;
    }

    const points = animationData.pathPoints;
    if (points.length < 2) {
      return points[0] || null;
    }

    // Calculate target index in path
    const targetIndex = progress * (points.length - 1);
    const index = Math.floor(targetIndex);
    const fraction = targetIndex - index;

    // Handle end of path
    if (index >= points.length - 1) {
      return points[points.length - 1];
    }

    // Interpolate between two points
    const point1 = points[index];
    const point2 = points[index + 1];

    return [
      point1[0] + (point2[0] - point1[0]) * fraction,
      point1[1] + (point2[1] - point1[1]) * fraction,
      point1[2] + (point2[2] - point1[2]) * fraction,
    ];
  }

  /**
   * Stop all animations
   */
  stopAllAnimations() {
    const ghostIds = Array.from(this.activeAnimations.keys());
    for (const ghostId of ghostIds) {
      this.stopGhostAnimation(ghostId);
    }
    console.log("[GhostPathRenderer] Stopped all animations");
  }

  /**
   * Start animations for all visible ghosts
   * @param {number} speedMultiplier - Speed multiplier for animations
   */
  startAllVisibleAnimations(speedMultiplier = 1.0) {
    const ghostData = this.ghostPathManager.getCurrentLevelGhosts();
    if (!ghostData) return;

    let startedCount = 0;

    // Start best ghost animation if visible
    if (ghostData.bestGhost && this.isGhostVisible("best")) {
      if (this.startAnimation("best", speedMultiplier)) startedCount++;
    }

    // Start last ghost animation if visible
    if (ghostData.lastGhost && this.isGhostVisible("last")) {
      if (this.startAnimation("last", speedMultiplier)) startedCount++;
    }

    // Start custom ghost animations if visible
    if (ghostData.customGhosts) {
      ghostData.customGhosts.forEach((ghost) => {
        if (this.isGhostVisible(ghost.id)) {
          if (this.startAnimation(ghost.id, speedMultiplier)) startedCount++;
        }
      });
    }

    console.log(
      `[GhostPathRenderer] Started animations for ${startedCount} visible ghosts`
    );
    return startedCount > 0;
  }

  /**
   * Stop current animation (legacy method for backward compatibility)
   */
  stopAnimation(ghostId) {
    this.stopGhostAnimation(ghostId);
  }

  /**
   * Check if animation is currently running
   * @returns {boolean} Whether animation is active
   */
  isAnimationActive() {
    return this.isAnimating;
  }

  /**
   * Get list of currently playing/animating ghosts
   * @returns {Array<string>} Array of ghost IDs that are currently animating
   */
  getPlayingGhosts() {
    return Array.from(this.activeAnimations.keys());
  }

  /**
   * Get current animation progress (0-1)
   * @returns {number} Animation progress
   */
  getAnimationProgress() {
    if (!this.isAnimating || !this.animationData) {
      return 0;
    }

    const elapsed = performance.now() - this.animationStartTime;
    return Math.min(elapsed / this.animationDuration, 1.0);
  }

  /**
   * Update path visualization settings
   * @param {Object} settings - Settings to update
   */
  updatePathSettings(settings) {
    Object.assign(this.pathSettings, settings);

    // Refresh paths to apply new settings
    if (this.isVisible) {
      this.refreshAllPaths();
    }
  }

  /**
   * Get current path settings
   * @returns {Object} Current path settings
   */
  getPathSettings() {
    return { ...this.pathSettings };
  }

  /**
   * Get render statistics
   * @returns {Object} Render statistics
   */
  getRenderStats() {
    let totalSegments = 0;
    let totalGizmos = 0;

    this.renderedPaths.forEach((pathInfo) => {
      totalGizmos += pathInfo.gizmoIds.length;
      // Segments are all gizmos minus start/end markers
      totalSegments += Math.max(0, pathInfo.gizmoIds.length - 2);
    });

    return {
      pathCount: this.renderedPaths.size,
      totalSegments,
      totalGizmos,
      isVisible: this.isVisible,
      isAnimating: this.isAnimating,
    };
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stopAllAnimations();
    this.clearAllPaths();
    this.gizmoManager = null;
    this.ghostPathManager = null;
    this.renderedPaths.clear();
    this.ghostVisibility.clear();
    this.activeAnimations.clear();
    this.animationCubes.clear();

    console.log("[GhostPathRenderer] Destroyed");
  }
}

// Singleton instance
let ghostPathRendererInstance = null;

/**
 * Get or create the singleton ghost path renderer instance
 * @returns {GhostPathRenderer} The ghost path renderer instance
 */
export function getGhostPathRenderer() {
  if (!ghostPathRendererInstance) {
    ghostPathRendererInstance = new GhostPathRenderer();
  }
  return ghostPathRendererInstance;
}

/**
 * Initialize ghost path renderer
 * @returns {GhostPathRenderer} The ghost path renderer instance
 */
export function initializeGhostPathRenderer() {
  const renderer = getGhostPathRenderer();
  renderer.initialize();
  return renderer;
}

/**
 * Destroy the ghost path renderer instance
 */
export function destroyGhostPathRenderer() {
  if (ghostPathRendererInstance) {
    ghostPathRendererInstance.destroy();
    ghostPathRendererInstance = null;
  }
}
