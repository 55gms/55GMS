import { GizmoRenderer, GizmoManager } from "./gizmoRenderer.js";
import { SelectionManager } from "./selectionManager.js";
import { CameraController } from "./cameraController.js";
import { initializeStateManager, destroyStateManager } from "./stateManager.js";
import {
  initializeInspector,
  destroyInspector,
  showInspectorForProject,
} from "./inspectorUI.js";
import { initializeToolbar, destroyToolbar } from "./toolbar.js";
import {
  initializeLevelSettings,
  destroyLevelSettings,
} from "./levelSettings.js";
import {
  initializePlacingSystem,
  destroyPlacingSystem,
} from "./placingSystem.js";
import { initializeGridSystem, destroyGridSystem } from "./gridSystem.js";
import { initializeGridUI, destroyGridUI } from "./gridUI.js";
import {
  initializeProjectManager,
  destroyProjectManager,
} from "./projectManager.js";
import {
  initializeNewProjectDialog,
  destroyNewProjectDialog,
} from "./newProjectDialog.js";
import {
  initializeProjectDataDialog,
  destroyProjectDataDialog,
} from "./projectDataDialog.js";
import {
  initializeSteamWorkshopDialog,
  destroySteamWorkshopDialog,
} from "./steamWorkshopDialog.js";
import {
  initializeColorPaletteManager,
  destroyColorPaletteManager,
} from "./colorPaletteManager.js";
import {
  initializeConfirmDialog,
  destroyConfirmDialog,
} from "./confirmDialog.js";
import {
  initializeSaveChangesDialog,
  destroySaveChangesDialog,
} from "./saveChangesDialog.js";
import {
  initializePublishChecklistDialog,
  destroyPublishChecklistDialog,
} from "./publishChecklistDialog.js";
import {
  initializeWelcomeDialog,
  destroyWelcomeDialog,
} from "./welcomeDialog.js";
import {
  initializeNotifications,
  destroyNotifications,
} from "./notifications.js";
import { initializePlaySystem, destroyPlaySystem } from "./playSystem.js";
import { initRuntimeErrorStore } from "./scripting/runtimeErrorStore.js";
import {
  initializeGhostPathSystem,
  destroyGhostPathSystem,
} from "./ghostPaths/ghostPathSystem.js";
import {
  initializeGroupManager,
  destroyGroupManager,
} from "./groups/groupManager.js";
import { initializeLabelsManager } from "./labels/labelsManager.js";
import { initializeMaterialsManager } from "./materials/materialsManager.js";
import {
  initializeHierarchyPanel,
  destroyHierarchyPanel,
} from "./hierarchyPanel/hierarchyPanel.js";
import { initializeNavGizmo, destroyNavGizmo } from "./navGizmo/navGizmo.js";
import {
  getFirstRayIntersection,
  screenToWorldDirect,
  screenToWorldRay,
  worldToScreenDirect,
} from "./raycast.js";
import { KeyboardShortcuts } from "./keyboardShortcuts.js";
import { selectableObjects } from "./objectTypeDefinitions.js";
import { LevelValidator, ValidationDialog } from "./levelValidator.js";
import { cameraTypeName, PICK_MAX_DISTANCE } from "./globalValues.js";
import { destroyGhostPathDialog } from "./ghostPaths/ghostPathDialog.js";

export function initEditor(runtime) {
  globalThis._editorScope = {};
  globalThis._editorScope.runtime = runtime;
  globalThis._editorScope.sdk_runtime = globalThis.sdk_runtime;
  globalThis._editorScope.cameraType = runtime.objects[cameraTypeName];
  initEditorMethods(runtime);
  initEditorSystems(runtime);
  initEditorLayout(runtime, runtime.layout);
}
function initEditorMethods(runtime) {
  globalThis._editorScope.uiViewport = () =>
    runtime.layout.getLayer("UI").getViewport();

  // Mouse position helper.
  //   getMousePosition()           → raw values (the original behaviour). Use for
  //       mouse-DELTA math (camera rotation/pan/orbit): a constant offset cancels
  //       in the delta, and the layer's zoom must NOT scale the delta.
  //   getMousePosition(layerName)  → exact position in that layer's coordinate
  //       space, which stays correct even when the canvas is resized (e.g.
  //       low-graphics mode shrinks it). Use when the precise point matters:
  //       picking rays, placement, selection-box corners, gizmo hit-testing.
  globalThis._editorScope.getMousePosition = (layerName) => {
    if (layerName) {
      const pos = runtime.mouse.getMousePosition(layerName);
      const viewport = runtime.layout.getLayer(layerName).getViewport();
      return [pos[0] - viewport.left, pos[1] - viewport.top];
    }
    const pos = runtime.mouse.getMousePosition();
    const uiViewport = globalThis._editorScope.uiViewport();
    return [pos[0] - uiViewport.left, pos[1] - uiViewport.top];
  };

  globalThis._editorScope.screenToWorld = function (x, y, distance = 100) {
    const camera = globalThis._editorScope.cameraType;
    const uiViewport = globalThis._editorScope.uiViewport();
    return screenToWorldDirect(
      x,
      y,
      uiViewport.width,
      uiViewport.height,
      camera.getCameraPosition(),
      camera.getLookVector(),
      camera.getUpVector(),
      camera.fieldOfView,
      distance,
    );
  };

  globalThis._editorScope.worldToScreen = function (x, y, z) {
    const camera = globalThis._editorScope.cameraType;
    const cameraPos = camera.getCameraPosition();
    const lookVector = camera.getLookVector();
    const upVector = camera.getUpVector();
    const uiViewport = globalThis._editorScope.uiViewport();
    return worldToScreenDirect(
      x,
      y,
      z,
      cameraPos,
      lookVector,
      upVector,
      camera.fieldOfView,
      uiViewport.width,
      uiViewport.height,
    );
  };

  globalThis._editorScope.getScreenRay = function (x, y) {
    const camera = globalThis._editorScope.cameraType;
    const cameraPos = camera.getCameraPosition();
    const uiViewport = globalThis._editorScope.uiViewport();
    const normalizedRay = screenToWorldRay(
      x,
      y,
      uiViewport.width,
      uiViewport.height,
      camera.getLookVector(),
      camera.getUpVector(),
      camera.fieldOfView,
    );
    return {
      origin: cameraPos,
      direction: normalizedRay,
    };
  };
}

function initEditorSystems(runtime) {
  globalThis._editorScope.gizmoManager = new GizmoManager(
    new GizmoRenderer(runtime.renderer),
  );
  globalThis._editorScope.inspectorUI = initializeInspector();
  globalThis._editorScope.levelSettings = initializeLevelSettings();
  globalThis._editorScope.projectManager = initializeProjectManager();
  globalThis._editorScope.notifications = initializeNotifications();
  globalThis._editorScope.stateManager = initializeStateManager(runtime);
  globalThis._editorScope.newProjectDialog = initializeNewProjectDialog();
  globalThis._editorScope.projectDataDialog = initializeProjectDataDialog();
  globalThis._editorScope.steamWorkshopDialog = initializeSteamWorkshopDialog();
  globalThis._editorScope.colorPaletteManager = initializeColorPaletteManager();
  globalThis._editorScope.confirmDialog = initializeConfirmDialog();
  globalThis._editorScope.saveChangesDialog = initializeSaveChangesDialog();
  globalThis._editorScope.welcomeDialog = initializeWelcomeDialog();
  globalThis._editorScope.levelValidator = new LevelValidator();
  globalThis._editorScope.validationDialog = new ValidationDialog();
  initializePublishChecklistDialog();
  globalThis._editorScope.validationDialog.setValidator(
    globalThis._editorScope.levelValidator,
  );
  globalThis._editorScope.gridSystem = initializeGridSystem(
    runtime,
    globalThis._editorScope.gizmoManager,
  );
  globalThis._editorScope.gridUI = initializeGridUI(
    globalThis._editorScope.gridSystem,
  );
  globalThis._editorScope.selectionManager = new SelectionManager(
    globalThis._editorScope.gizmoManager,
    runtime,
  );
  globalThis._editorScope.placingSystem = initializePlacingSystem(runtime, {
    slotCount: 7,
    autoShow: true, // Always show placing system
  });
  setupProjectSystemCallbacks();

  const construct3Camera = globalThis._editorScope.cameraType;
  globalThis._editorScope.cameraController = new CameraController(
    construct3Camera,
    runtime,
    globalThis._editorScope.selectionManager, // Pass selection manager for 2D selection box support
  );

  globalThis._editorScope.cameraController.setCameraChangeCallback((camera) => {
    // Update camera-facing elements when camera moves
    if (globalThis._editorScope.selectionManager) {
      globalThis._editorScope.selectionManager.updateCameraFacing(camera);
    }
    if (globalThis._editorScope.gizmoManager) {
      const [mouseX, mouseY] = globalThis._editorScope.getMousePosition("UI");
      const isMouseDown = runtime.mouse.isMouseButtonDown(0);
      if (!isMouseDown) {
        const uiViewport = globalThis._editorScope.uiViewport();
        globalThis._editorScope.gizmoManager.updateMouse(
          mouseX,
          mouseY,
          false,
          camera,
          uiViewport.width,
          uiViewport.height,
        );
      }
    }
  });

  // Initialize keyboard shortcuts system
  globalThis._editorScope.keyboardShortcuts = new KeyboardShortcuts(
    globalThis._editorScope.selectionManager,
    runtime,
  );

  runtime.addEventListener("tick", tick);

  runtime.addEventListener("mousedown", mouseDown);

  // Setup window close confirmation
  setupWindowCloseConfirmation();
  globalThis._editorScope.ghostPathSystem = initializeGhostPathSystem();
  // Import c3script runtime errors stashed during play on return to the editor.
  initRuntimeErrorStore();
  globalThis._editorScope.groupManager = initializeGroupManager();
  globalThis._editorScope.labelsManager = initializeLabelsManager();
  globalThis._editorScope.materialsManager = initializeMaterialsManager();
  globalThis._editorScope.hierarchyPanel = initializeHierarchyPanel();
  globalThis._editorScope.navGizmo = initializeNavGizmo();
  globalThis._editorScope.navGizmo.attach(
    globalThis._editorScope.cameraController,
    runtime,
  );
  globalThis._editorScope.playSystem = initializePlaySystem();
  globalThis._editorScope.toolbar = initializeToolbar();
  globalThis._editorScope.toolbar.setSelectionManager(
    globalThis._editorScope.selectionManager,
  );
  globalThis._editorScope.gridSystem.onGridSettingsChanged = () => {
    // Update toolbar grid button state
    if (globalThis._editorScope.toolbar) {
      globalThis._editorScope.toolbar.updateGridButtonState();
    }
  };
  globalThis._editorScope.toolbar.updateGridButtonState();

  // Show the welcome dialog if no project is loaded. Must run AFTER the toolbar
  // and inspector exist, otherwise welcomeDialog.show()'s chrome-hide calls
  // (toolbar/inspector .hide()) optional-chain to no-ops and the chrome mounts
  // visible over the welcome screen.
  showStartupProjectDialog();
}

function setupProjectSystemCallbacks() {
  const projectManager = globalThis._editorScope.projectManager;
  const newProjectDialog = globalThis._editorScope.newProjectDialog;

  if (newProjectDialog) {
    newProjectDialog.onConfirm = (result) => {
      // Fully close welcome dialog (overlay + animation)
      const welcomeDialog = globalThis._editorScope?.welcomeDialog;
      if (welcomeDialog) {
        welcomeDialog.hide();
      }
      // Create new project
      if (projectManager) {
        const project = projectManager.createNewProject(
          result.projectName,
          result.levelName,
        );
        console.log("[Main] Created new project:", project.projectName);
      }
    };

    newProjectDialog.onCancel = () => {
      // If no project is loaded, restore welcome dialog UI over existing overlay
      if (projectManager && !projectManager.hasProjectLoaded()) {
        const welcomeDialog = globalThis._editorScope.welcomeDialog;
        if (welcomeDialog) {
          welcomeDialog.show();
        }
      }
      console.log("[Main] New project dialog cancelled");
    };
  }

  // Set up project event listeners
  if (projectManager) {
    projectManager.addEventListener("projectCreated", (project) => {
      console.log("[Main] Project created:", project.projectName);
      updateUIForProject();
      globalThis._editorScope?.notifications?.success(
        `Project "${project.projectName}" created`,
        { title: "Project" },
      );
    });

    projectManager.addEventListener("projectLoaded", (project) => {
      console.log("[Main] Project loaded:", project.projectName);
      updateUIForProject();
      globalThis._editorScope?.notifications?.success(
        `Project "${project.projectName}" loaded`,
        { title: "Project" },
      );
    });

    projectManager.addEventListener(
      "levelSwitched",
      ({ levelId, levelData }) => {
        console.log("[Main] Switched to level:", levelData.levelData.levelName);
        updateUIForProject();
        globalThis._editorScope?.notifications?.info(
          `Now editing "${levelData.levelData.levelName}"`,
          { title: "Level Loaded" },
        );
      },
    );

    projectManager.addEventListener("projectSaved", ({ filename }) => {
      globalThis._editorScope?.notifications?.success(`Saved as ${filename}`, {
        title: "Project",
      });
    });
  }
}

function tick() {
  const runtime = globalThis._editorScope.runtime;
  const [mouseX, mouseY] = globalThis._editorScope.getMousePosition("UI");
  const camera = globalThis._editorScope.cameraType;
  const isMouseDown = runtime.mouse.isMouseButtonDown(0);
  const uiViewport = globalThis._editorScope.uiViewport();
  globalThis._editorScope.gizmoManager.updateMouse(
    mouseX,
    mouseY,
    false,
    camera,
    uiViewport.width,
    uiViewport.height,
  );

  // Update selection manager mouse tracking
  globalThis._editorScope.selectionManager.updateMouseTracking(
    mouseX,
    mouseY,
    isMouseDown,
    camera,
  );
  globalThis._editorScope.sdk_runtime.UpdateRender();
}

function mouseDown(e) {
  const runtime = globalThis._editorScope.runtime;
  const [mouseX, mouseY] = globalThis._editorScope.getMousePosition("UI");
  const camera = globalThis._editorScope.cameraType;
  const uiViewport = globalThis._editorScope.uiViewport();
  globalThis._editorScope.gizmoManager.updateMouse(
    mouseX,
    mouseY,
    e.button === 0,
    camera,
    uiViewport.width,
    uiViewport.height,
  );

  // Update selection manager for mouse down events
  globalThis._editorScope.selectionManager.updateMouseTracking(
    mouseX,
    mouseY,
    e.button === 0,
    camera,
  );

  // Handle selection on left mouse button down
  if (e.button === 0) {
    // Check if we're interacting with gizmos - if so, don't update selection
    if (globalThis._editorScope.selectionManager.isGizmoInteractionActive()) {
      return; // Skip selection logic when gizmo interaction is active
    }

    const ray = globalThis._editorScope.getScreenRay(mouseX, mouseY);
    const candidates = [];
    for (const objectTypeName of selectableObjects) {
      const objectType = runtime.objects[objectTypeName];
      if (objectType) {
        candidates.push(
          ...objectType
            .getAllInstances()
            .filter((instance) => instance.isVisible),
        );
      }
    }

    const intersection = getFirstRayIntersection(
      candidates,
      ray.origin,
      ray.direction,
      PICK_MAX_DISTANCE,
    );

    let shiftPressed =
      runtime.keyboard.isKeyDown("ShiftLeft") ||
      runtime.keyboard.isKeyDown("ShiftRight") ||
      runtime.keyboard.isKeyDown("Shift");

    if (intersection && intersection.instance) {
      const instance = intersection.instance;
      if (shiftPressed) {
        globalThis._editorScope.selectionManager.toggleSelection(instance);
      } else {
        globalThis._editorScope.selectionManager.setSelection(instance);
      }
      // Pickwalk anchor — the instance the user just clicked in the viewport
      // becomes the starting point for `[` / `]`. setLastAnchor also clears
      // any prior pickwalk stack since this is a fresh user choice.
      globalThis._editorScope.selectionManager.setLastAnchor({
        kind: "instance",
        id: instance.uid,
      });
    } else {
      // If no intersection, clear selection
      if (!shiftPressed) {
        globalThis._editorScope.selectionManager.clearSelection();
      }
    }
  }
}

function showStartupProjectDialog() {
  const projectManager = globalThis._editorScope.projectManager;
  const welcomeDialog = globalThis._editorScope.welcomeDialog;

  // Only show if no project is loaded
  if (projectManager && !projectManager.hasProjectLoaded() && welcomeDialog) {
    welcomeDialog.show();
  }
}

function updateUIForProject() {
  // This function can be extended to update various UI elements based on project state
  const projectManager = globalThis._editorScope.projectManager;

  if (projectManager && projectManager.hasProjectLoaded()) {
    const projectInfo = projectManager.getProjectInfo();

    // Update document title
    document.title = `Level Editor - ${projectInfo.projectName} (${projectInfo.currentLevelName})`;

    // Sync shared data with systems that still use localStorage
    projectManager.applySharedDataToSystems();

    // Fast-access play button follows the project's last-used play mode.
    const playSystem = globalThis._editorScope.playSystem;
    const toolbar = globalThis._editorScope.toolbar;
    if (playSystem && toolbar) {
      toolbar.setSplitMainTool("playSplit", playSystem.getPreferredPlayMode());
    }

    showInspectorForProject();
  } else {
    document.title = "Level Editor";
  }
}

function addLayerEventListeners(layer, runtime) {
  const handler = () => {
    const camera = globalThis._editorScope.cameraType;
    globalThis._editorScope.gizmoManager.renderAll(layer.name, camera);
  };
  layer.addEventListener("beforedraw", handler);
  layer.__gizmoHandler = handler;
}

function removeLayerEventListeners(layer) {
  if (layer.__gizmoHandler) {
    layer.removeEventListener("beforedraw", layer.__gizmoHandler);
    delete layer.__gizmoHandler;
  }
}

function initEditorLayout(runtime, layout) {
  // Clear all gizmos when the layout starts
  globalThis._editorScope.gizmoManager.clear();

  // Update grid system with layout size
  if (globalThis._editorScope.gridSystem) {
    globalThis._editorScope.gridSystem.setLevelSize({
      width: layout.width,
      height: layout.height,
    });
    globalThis._editorScope.gridSystem.createGridGizmo();
  }

  // Clear selection when layout starts
  globalThis._editorScope.selectionManager.clearSelection();
  // Add event listeners for all other layers
  layout.getAllLayers().forEach((layer) => {
    addLayerEventListeners(layer, runtime);
  });

  globalThis._editorScope.cameraController.initCamera();
}

function setupWindowCloseConfirmation() {
  window.addEventListener("beforeunload", (e) => {
    const projectManager = globalThis._editorScope?.projectManager;
    if (projectManager && projectManager.getHasUnsavedChanges()) {
      // This will show the browser's default confirmation dialog
      e.preventDefault();
      e.returnValue =
        "You have unsaved changes. Are you sure you want to leave?";
      return e.returnValue;
    }
  });
}

export function releaseEditor(runtime) {
  releaseEditorLayout(runtime, runtime.layout);
  releaseEditorSystems(runtime);
  releaseEditorMethods(runtime);
  globalThis._editorScope = null;
}

function releaseEditorLayout(runtime, layout) {
  // Remove event listeners for all layers
  layout.getAllLayers().forEach((layer) => {
    removeLayerEventListeners(layer);
  });
  // Clear all gizmos when the layout ends
  globalThis._editorScope.gizmoManager.clear();
  // Clear selection when layout ends
  globalThis._editorScope.selectionManager.clearSelection();
  // Clean up camera controller if needed
  if (globalThis._editorScope.cameraController) {
    globalThis._editorScope.cameraController.destroy();
  }
}

function releaseEditorSystems(runtime) {
  runtime.removeEventListener("tick", tick);
  runtime.removeEventListener("mousedown", mouseDown);

  destroyInspector();
  destroyToolbar();
  destroyGhostPathDialog();
  destroyNotifications();
  destroyLevelSettings();
  destroyStateManager();
  destroyProjectManager();
  destroyNewProjectDialog();
  destroyProjectDataDialog();
  destroySteamWorkshopDialog();
  destroyColorPaletteManager();
  destroyConfirmDialog();
  destroySaveChangesDialog();
  destroyWelcomeDialog();
  globalThis._editorScope.levelValidator.destroy();
  globalThis._editorScope.validationDialog.destroy();
  destroyPublishChecklistDialog();
  destroyPlaySystem();
  destroyGridSystem();
  destroyGridUI();
  globalThis._editorScope.selectionManager.destroy();
  destroyPlacingSystem();
  destroyGhostPathSystem();
  destroyHierarchyPanel();
  destroyNavGizmo();
  destroyGroupManager();
  globalThis._editorScope.cameraController.destroy();
  globalThis._editorScope.keyboardShortcuts.destroy();
  globalThis._editorScope.gizmoManager.destroy();
}

function releaseEditorMethods(runtime) {
  globalThis._editorScope.uiViewport = null;
  globalThis._editorScope.getMousePosition = null;
  globalThis._editorScope.screenToWorld = null;
  globalThis._editorScope.worldToScreen = null;
  globalThis._editorScope.getScreenRay = null;
}
