export class KeyboardShortcuts {
  constructor(selectionManager, runtime) {
    this.selectionManager = selectionManager;
    this.runtime = runtime;

    // Clipboard storage for copy/paste operations
    this.clipboard = [];

    // Track pressed keys for combination shortcuts
    this.pressedKeys = new Set();

    // Bind event handlers
    this.boundKeyDown = this.onKeyDown.bind(this);
    this.boundKeyUp = this.onKeyUp.bind(this);

    // Initialize event listeners
    this.init();
  }

  init() {
    document.addEventListener("keydown", this.boundKeyDown);
    document.addEventListener("keyup", this.boundKeyUp);
  }

  destroy() {
    document.removeEventListener("keydown", this.boundKeyDown);
    document.removeEventListener("keyup", this.boundKeyUp);
    this.pressedKeys.clear();
    this.clipboard = [];
    this.selectionManager = null;
    this.runtime = null;
  }

  onKeyDown(e) {
    // Track pressed keys
    this.pressedKeys.add(e.code);

    // Check for modifier keys
    const isCtrlCmd = e.ctrlKey || e.metaKey; // Support both Ctrl and Cmd (Mac)
    const isShift = e.shiftKey;
    const isAlt = e.altKey;

    // Handle shortcuts
    if (this.handleShortcut(e.code, isCtrlCmd, isShift, isAlt)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  onKeyUp(e) {
    this.pressedKeys.delete(e.code);
  }

  handleShortcut(keyCode, isCtrlCmd, isShift, isAlt) {
    // Only handle shortcuts if we have selected objects (except for paste)
    const hasSelection = this.selectionManager.selectedObjects.size > 0;

    // First, check if the selection manager wants to handle this key
    // This handles transform mode shortcuts like Tab
    if (this.selectionManager.handleKeyboardInput(keyCode)) {
      return true;
    }

    switch (keyCode) {
      case "KeyC":
        if (isCtrlCmd && hasSelection) {
          this.selectionManager.copySelected();
          return true;
        }
        break;

      case "KeyV":
        if (isCtrlCmd && this.selectionManager.clipboard.length > 0) {
          this.selectionManager.pasteFromClipboard();
          return true;
        }
        break;

      case "KeyX":
        if (isCtrlCmd && hasSelection) {
          this.selectionManager.cutSelected();
          return true;
        }
        break;

      case "KeyD":
        if (isCtrlCmd && hasSelection) {
          this.selectionManager.duplicateSelected();
          return true;
        }
        break;

      case "Delete":
      case "Backspace":
        if (hasSelection) {
          this.selectionManager.deleteSelected(); // Pass shift state to skip confirmation
          return true;
        }
        break;

      case "KeyZ":
        if (isCtrlCmd && !isShift) {
          // Undo: Ctrl+Z (or Cmd+Z on Mac)
          if (globalThis._editorScope?.stateManager) {
            globalThis._editorScope.stateManager.undo();
          }
          return true;
        } else if (isCtrlCmd && isShift) {
          // Redo: Ctrl+Shift+Z (or Cmd+Shift+Z on Mac)
          if (globalThis._editorScope?.stateManager) {
            globalThis._editorScope.stateManager.redo();
          }
          return true;
        }
        break;

      case "KeyY":
        if (isCtrlCmd) {
          // Redo: Ctrl+Y (or Cmd+Y on Mac)
          if (globalThis._editorScope?.stateManager) {
            globalThis._editorScope.stateManager.redo();
          }
          return true;
        }
        break;

      case "KeyG":
        // Ctrl+G: group selection. Ctrl+Shift+G: ungroup.
        // No-op when nothing is selected (matches user spec).
        if (isCtrlCmd && hasSelection) {
          const groupManager = globalThis._editorScope?.groupManager;
          if (!groupManager) return false;
          if (isShift) {
            const dissolved = groupManager.ungroupSelected();
            if (!dissolved) {
              globalThis._editorScope?.notifications?.warning(
                "Selected items don't share a single parent group.",
                { title: "Ungroup" }
              );
            }
          } else {
            groupManager.groupSelected();
          }
          return true;
        }
        break;

      case "KeyS":
        if (isCtrlCmd) {
          // Save: Ctrl+S (or Cmd+S on Mac)
          if (globalThis._editorScope?.projectManager) {
            globalThis._editorScope.projectManager.saveProjectToFile();
          }
          return true;
        }
        break;

      case "F2":
        // F2: rename currently-active group row (hierarchy panel) or the
        // first selected instance. No-op if neither target exists.
        {
          const panel = globalThis._editorScope?.hierarchyPanel;
          if (panel && typeof panel.handleF2 === "function") {
            if (panel.handleF2()) return true;
          }
        }
        break;

      case "F5":
        // F5: last-used play mode (the split button's main action)
        // Shift+F5: Preview from start
        if (globalThis._editorScope?.playSystem) {
          const playSystem = globalThis._editorScope.playSystem;
          const playMode = isShift
            ? "play-project-start"
            : playSystem.getPreferredPlayMode();
          playSystem.handlePlay(playMode);
        }
        return true;

      case "BracketLeft":
        // [ — pickwalk broaden: replace the anchor's contribution to the
        // selection with its parent group's full descendant set. No-op if
        // the anchor has no parent (root) or there's no anchor at all.
        if (!isCtrlCmd && !isShift && this.selectionManager.pickwalkBroaden) {
          this.selectionManager.pickwalkBroaden();
          return true;
        }
        break;

      case "BracketRight":
        // ] — pickwalk narrow: undo the most recent broaden. No-op when
        // the pickwalk stack is empty (e.g., haven't broadened yet, or
        // the user made a fresh selection since).
        if (!isCtrlCmd && !isShift && this.selectionManager.pickwalkNarrow) {
          this.selectionManager.pickwalkNarrow();
          return true;
        }
        break;

      case "KeyF": {
        const cc = globalThis._editorScope?.cameraController;
        if (!cc) break;
        if (!isCtrlCmd && !isAlt) {
          if (isShift) {
            if (cc.flyMode) cc.exitFlyMode();
            else cc.enterFlyMode();
            return true;
          } else if (hasSelection) {
            cc.focusOnSelection();
            return true;
          }
        }
        break;
      }

      case "Escape": {
        const cc = globalThis._editorScope?.cameraController;
        if (cc && cc.flyMode) {
          cc.exitFlyMode();
          return true;
        }
        break;
      }
    }

    return false;
  }
}
