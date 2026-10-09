// Script Editor Dialog — modal for authoring a level's global c3script.
//
// Uses Monaco (lazy-loaded from a CDN on first open) wired up via C3Editor for
// highlighting, live parse diagnostics, autocomplete, and hover docs. If Monaco
// can't load (e.g. offline), it falls back to a plain <textarea> that still
// lints via the c3script parser.
//
// Storage: the script lives in levelData.script — read with
// getLevelDataValue("script"), written with updateLevelData("script", ...)
// (which also records an undo step). See scriptRuntime.js for how it runs.

import { Theme } from "../inspectorUI.js";
import { C3Editor } from "./c3Monaco.js";
import { parse } from "./c3script.js";
import { buildApiSchema } from "./gameApi.js";
import { STDLIB_MODULES } from "./stdlib.js";
import {
  RUNTIME_ERRORS_KEY,
  deleteAllRuntimeErrors,
  deleteRuntimeErrorAt,
} from "./runtimeErrorStore.js";
import { collectEnumWarnings } from "./scriptLint.js";

const MONACO_VERSION = "0.45.0";
const MONACO_BASE = `https://cdn.jsdelivr.net/npm/monaco-editor@${MONACO_VERSION}/min`;

// Autocomplete/hover schema. The game API (on/level + the inspector-driven
// object members) is DERIVED from the same definitions the runtime uses, and
// the stdlib modules (Math, Easing, console) are merged in — each carries its
// own __docs__/__events__, so there is no second hand-maintained source to drift.
function buildEditorGlobals() {
  return { ...buildApiSchema(), ...STDLIB_MODULES };
}

// Shown when a level has no script yet. All examples are commented out, so an
// untouched template is a harmless no-op if saved; uncomment to use.
const DEFAULT_SCRIPT_TEMPLATE = `// Level script — runs when the level is played.
//
// Register handlers with level.on(event, handler):
//   level.on("start", () => { ... })   runs once when the level loads
//   level.on("tick", (dt) => { ... })  runs every frame; dt = seconds since last frame
//
// Address placed objects by label with level.find / level.findAll. Pass several
// labels to match objects carrying ALL of them, e.g. level.find("door", "locked").
// A found object's properties mirror its inspector, e.g.
//   obj.position = { x: 100, y: 0, z: 5 }   // or obj.position.x = 100
//   obj.angle = 90                          // degrees
//   obj.size = { x: 64, y: 64, z: 64 }
//   obj.text, obj.isOpen, obj.color (read-only) ...
// Plus: obj.uid, obj.labels.<label>.<var>, obj.destroy(),
//       obj.on/off/emit(event, ...) for built-in AND custom events.
// Level: level.name/width/height, level.find/findAll(...labels), level.objects,
//        level.player, level.time, level.on/off/emit(event, ...).
// Modules: Math, Easing, console (log/warn/error/table), Clock (dt, gameTime,
//          levelTime, wait, interval, paused), Tween (run/value/to),
//          Player (x/y/z, vx/vy/vz, state, jump), Camera (position, isPointVisible),
//          Raycast (cast), LevelSave / PackSave (get/set/has/clear).

// --- Example: tween a labelled object, then await a delay -----------------
// level.on("start", () => {
//   console.log("playing " + level.name)
//   let door = level.find("bigDoor")     // first object labelled "bigDoor"
//   if (door != null) {
//     Tween.to(door, { position: { x: door.position.x + 100 }, angle: 90 },
//              1.0, { easing: Easing.easeInOut })
//     await Clock.wait(2)
//     door.emit("opened")                // a custom event
//   }
// })

// --- Example: spin every labelled object continuously ----------------------
// level.on("tick", (dt) => {
//   for (let spinner of level.findAll("spinner")) {
//     spinner.angle = spinner.angle + 60 * dt   // 60 deg/sec
//   }
// })
`;

let _monacoPromise = null;
function loadMonaco() {
  if (_monacoPromise) return _monacoPromise;
  _monacoPromise = new Promise((resolve, reject) => {
    if (globalThis.monaco) return resolve(globalThis.monaco);
    const loader = document.createElement("script");
    loader.src = `${MONACO_BASE}/vs/loader.js`;
    loader.onload = () => {
      try {
        const req = globalThis.require;
        req.config({ paths: { vs: `${MONACO_BASE}/vs` } });
        req(
          ["vs/editor/editor.main"],
          () => resolve(globalThis.monaco),
          reject,
        );
      } catch (e) {
        reject(e);
      }
    };
    loader.onerror = () => reject(new Error("Failed to load Monaco loader"));
    document.head.appendChild(loader);
  });
  return _monacoPromise;
}

function getLevelSettings() {
  return globalThis._editorScope?.levelSettings;
}

export class ScriptEditorDialog {
  constructor(container = document.body) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.backdrop = null;
    this.dialog = null;
    this.isVisible = false;
    this.c3editor = null; // Monaco-backed editor (when available)
    this.textarea = null; // fallback editor
    // Error-drawer state, remembered across dialog open/close (singleton).
    this.drawerOpen = false;
    this.errorDrawerTab = "problems";
    this.drawerListHeight = 180;
    this._refreshTimer = null;
    this._contentSub = null; // Monaco content-change subscription
    this._resizing = false; // true while the drawer grip is being dragged
    this.applyStyles();
  }

  /**
   * @param {{line:number, column?:number}|null} target - optional caret position
   *   to reveal once the editor is ready (e.g. jump to a script error).
   */
  show(target = null) {
    if (this.isVisible) {
      if (target) {
        this.gotoPosition(target.line, target.column);
        if (target.peek) this.showProblemAt(target.line, target.column);
      }
      return;
    }
    const ls = getLevelSettings();
    if (!ls) {
      console.warn("[ScriptEditor] No level settings available");
      return;
    }
    this.source = ls.getLevelDataValue("script") || DEFAULT_SCRIPT_TEMPLATE;
    // Built once per open (labels can't change while the modal is up); shared
    // by Monaco (completion/hover/markers) and the Problems lint pass.
    this._lintGlobals = buildEditorGlobals();
    this.pendingGoto = target;
    this.createDialog();
    this.isVisible = true;
    if (globalThis._editorScope?.toolbar) {
      globalThis._editorScope.toolbar.hideTooltip();
    }
  }

  /**
   * Move the caret / reveal a line. Works with the Monaco editor; best-effort for
   * the textarea fallback.
   */
  gotoPosition(line) {
    if (!line) return;

    if (this.c3editor && this.c3editor.editor) {
      const ed = this.c3editor.editor;
      // Defer a frame so Monaco has laid out (the dialog animates in); reveal /
      // focus can no-op if run before the editor has real dimensions.
      requestAnimationFrame(() => {
        if (!this.c3editor || this.c3editor.editor !== ed) return;
        const model = ed.getModel();
        const endCol = model ? model.getLineMaxColumn(line) : 1;
        ed.revealLineInCenter(line);
        // Place the caret at the end of the error line (no selection).
        ed.setPosition({ lineNumber: line, column: endCol });
        ed.focus();
      });
    } else if (this.textarea) {
      const lines = this.textarea.value.split("\n");
      let start = 0;
      for (let i = 0; i < line - 1 && i < lines.length; i++) {
        start += lines[i].length + 1;
      }
      const lineEnd = start + (lines[line - 1]?.length ?? 0);
      this.textarea.focus();
      this.textarea.setSelectionRange(lineEnd, lineEnd);
    }
  }

  hide() {
    if (!this.isVisible) return;
    if (this._contentSub) {
      this._contentSub.dispose();
      this._contentSub = null;
    }
    if (this._refreshTimer) {
      clearTimeout(this._refreshTimer);
      this._refreshTimer = null;
    }
    if (this.c3editor) {
      this.c3editor.dispose();
      this.c3editor = null;
    }
    this.textarea = null;
    this.errorDrawer = null;
    this.footer = null;
    if (this.backdrop) this.backdrop.classList.remove("visible");
    if (this.dialog) this.dialog.classList.remove("visible");
    setTimeout(() => {
      if (this.backdrop && this.backdrop.parentNode) {
        this.backdrop.parentNode.removeChild(this.backdrop);
      }
      this.backdrop = null;
      this.dialog = null;
    }, 250);
    this.isVisible = false;
  }

  createDialog() {
    this.backdrop = document.createElement("div");
    this.backdrop.className = "script-dialog-backdrop";
    this.backdrop.addEventListener("click", (e) => {
      if (e.target === this.backdrop) this.hide();
    });

    this.dialog = document.createElement("div");
    this.dialog.className = "script-dialog";

    // Header
    const header = document.createElement("div");
    header.className = "script-dialog-header";
    const title = document.createElement("h2");
    title.className = "script-dialog-title";
    title.textContent = "Level Script";
    header.appendChild(title);

    // Editor body
    const body = document.createElement("div");
    body.className = "script-dialog-body";
    const editorHost = document.createElement("div");
    editorHost.className = "script-editor-host";
    body.appendChild(editorHost);

    // Footer
    const footer = document.createElement("div");
    footer.className = "script-dialog-footer";
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "script-dialog-button secondary";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", () => this.hide());
    const saveBtn = document.createElement("button");
    saveBtn.className = "script-dialog-button primary";
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", () => this.save());
    footer.appendChild(cancelBtn);
    footer.appendChild(saveBtn);
    this.footer = footer;

    this.dialog.appendChild(header);
    this.dialog.appendChild(body);
    // Runtime errors captured during play shouldn't be missed: force the drawer
    // open on that tab. Otherwise keep the remembered open/collapsed state.
    if (this.getRuntimeErrorList().length) {
      this.drawerOpen = true;
      this.errorDrawerTab = "runtime";
    }
    this.buildErrorDrawer();
    this.dialog.appendChild(footer);
    this.backdrop.appendChild(this.dialog);
    this.container.appendChild(this.backdrop);

    this.blockEventLeak();

    setTimeout(() => {
      this.backdrop.classList.add("visible");
      this.dialog.classList.add("visible");
    }, 10);

    // Try Monaco; fall back to a textarea if it can't load.
    loadMonaco()
      .then((monaco) => {
        if (!this.isVisible) return; // closed while loading
        this.c3editor = new C3Editor(editorHost, {
          monaco,
          globals: this._lintGlobals || buildEditorGlobals(),
          // Enums and docs now ride on the schema graph via the
          // __argEnums__ / __events__ / __docs__ conventions.
          argEnums: {},
          docs: {},
          source: this.source,
        });
        // Monaco already re-lints inline markers on this event (c3Monaco.js);
        // piggyback on the same model event to keep the Problems tab live.
        this._contentSub = this.c3editor.model.onDidChangeContent(() =>
          this.scheduleErrorRefresh(),
        );
        // Runtime errors captured during play show as inline error markers too.
        this.c3editor.setExtraMarkers(this.runtimeErrorMarkers());
        if (this.pendingGoto) {
          this.gotoPosition(this.pendingGoto.line, this.pendingGoto.column);
          if (this.pendingGoto.peek) {
            this.showProblemAt(this.pendingGoto.line, this.pendingGoto.column);
          }
          this.pendingGoto = null;
        }
      })
      .catch((err) => {
        console.warn("[ScriptEditor] Monaco unavailable, using textarea:", err);
        if (this.isVisible) {
          this.buildTextareaFallback(editorHost);
          if (this.pendingGoto) {
            this.gotoPosition(this.pendingGoto.line, this.pendingGoto.column);
            this.pendingGoto = null;
          }
        }
      });
  }

  buildTextareaFallback(host) {
    const ta = document.createElement("textarea");
    ta.className = "script-dialog-textarea";
    ta.spellcheck = false;
    ta.value = this.source;
    ta.addEventListener("keydown", (e) => e.stopPropagation());
    ta.addEventListener("input", () => this.scheduleErrorRefresh());
    host.appendChild(ta);
    this.textarea = ta;
  }

  // Read the current level's captured runtime errors (persisted during play).
  getRuntimeErrorList() {
    const ls = getLevelSettings();
    const rec = ls?.getLevelExtraData?.(RUNTIME_ERRORS_KEY);
    return Array.isArray(rec?.errors) ? rec.errors : [];
  }

  // Runtime errors as inline editor markers (entries without a line can't be
  // anchored; they still show in the drawer).
  runtimeErrorMarkers() {
    return this.getRuntimeErrorList()
      .filter((err) => err.line != null)
      .map((err) => ({
        message: `Runtime error: ${err.message || "Unknown error"}`,
        line: err.line,
        column: err.column ?? null,
        severity: "error",
      }));
  }

  // Open Monaco's "view problem" peek at the marker on that line (deferred a
  // frame so it runs after gotoPosition's reveal; no-op for the textarea).
  showProblemAt(line, column) {
    if (line == null || !this.c3editor) return;
    requestAnimationFrame(() => {
      this.c3editor?.showProblemAt(line, column);
    });
  }

  // Problems found right now in the current source (the ones surfaced
  // immediately, vs. runtime errors captured during play): the parse error if
  // the source doesn't parse (the c3script parser throws on the first error,
  // so 0 or 1 entry), otherwise unknown-enum-value warnings from the lint pass
  // (e.g. level.find("label") with a label no object carries).
  getProblemList() {
    let source = this.source;
    try {
      source = this.getSource();
    } catch (_) {}
    if (!source || !String(source).trim()) return [];
    try {
      parse(source);
    } catch (e) {
      return [
        {
          message: e?.langMessage || e?.message || String(e),
          line: e?.line ?? null,
          column: e?.column ?? null,
          severity: "error",
        },
      ];
    }
    return collectEnumWarnings(source, this._lintGlobals || buildEditorGlobals());
  }

  // Tabbed drawer at the bottom of the dialog: runtime errors (captured during
  // play) and problems (parse errors found immediately, live-updated while
  // typing). Always rendered between the editor body and the footer; the
  // open/collapsed state lives in this.drawerOpen.
  buildErrorDrawer() {
    if (this.errorDrawer) {
      this.errorDrawer.remove();
      this.errorDrawer = null;
    }
    const runtimeErrors = this.getRuntimeErrorList();
    const problems = this.getProblemList();

    let active = this.errorDrawerTab || "problems";
    if (active === "compile") active = "problems"; // legacy key
    this.errorDrawerTab = active;

    const drawer = document.createElement("div");
    drawer.className =
      "script-error-drawer" + (this.drawerOpen ? "" : " collapsed");

    // Drag grip along the top edge: resizes the list (only visible when open).
    // Pointer capture keeps the drag on the grip itself — blockEventLeak stops
    // mouse events from bubbling out of the dialog, so document-level move/up
    // listeners would never fire.
    const grip = document.createElement("div");
    grip.className = "script-error-resize-grip";
    grip.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      e.preventDefault();
      grip.setPointerCapture(e.pointerId);
      const startY = e.clientY;
      const startHeight = this.drawerListHeight;
      this._resizing = true;
      const onMove = (ev) => {
        const max = Math.round(window.innerHeight * 0.5);
        this.drawerListHeight = Math.min(
          max,
          Math.max(60, startHeight + (startY - ev.clientY)),
        );
        list.style.height = `${this.drawerListHeight}px`;
      };
      const onUp = () => {
        this._resizing = false;
        grip.removeEventListener("pointermove", onMove);
        grip.removeEventListener("pointerup", onUp);
        grip.removeEventListener("pointercancel", onUp);
      };
      grip.addEventListener("pointermove", onMove);
      grip.addEventListener("pointerup", onUp);
      grip.addEventListener("pointercancel", onUp);
    });
    drawer.appendChild(grip);

    // Header: tab buttons (toggle the drawer open) + a Delete All button.
    const header = document.createElement("div");
    header.className = "script-error-drawer-header";

    const tabs = document.createElement("div");
    tabs.className = "script-error-tabs";
    const makeTab = (key, label, count, badgeKind) => {
      const t = document.createElement("button");
      t.className =
        "script-error-tab" + (active === key ? " active" : "");
      t.textContent = label;
      const badge = document.createElement("span");
      badge.className = "script-error-tab-badge" + (badgeKind || "");
      badge.textContent = count;
      t.appendChild(badge);
      t.addEventListener("click", (e) => {
        e.stopPropagation();
        this.errorDrawerTab = key;
        // Opening the drawer if collapsed feels right when picking a tab.
        this.drawerOpen = true;
        this.buildErrorDrawer();
      });
      return t;
    };
    // Problems badge: red when a parse error is present, amber for warnings only.
    const hasProblemError = problems.some((p) => p.severity !== "warning");
    const problemsKind = hasProblemError
      ? " has-errors"
      : problems.length
        ? " has-warnings"
        : "";
    tabs.appendChild(
      makeTab(
        "runtime",
        "Runtime errors",
        runtimeErrors.length,
        runtimeErrors.length ? " has-errors" : "",
      ),
    );
    tabs.appendChild(makeTab("problems", "Problems", problems.length, problemsKind));

    header.appendChild(tabs);

    // Resolving applies to the runtime tab only (problems clear by fixing code).
    if (active === "runtime" && runtimeErrors.length) {
      const clearAll = document.createElement("button");
      clearAll.className = "script-error-clear";
      clearAll.textContent = "Mark all as resolved";
      clearAll.title =
        "Runtime errors only — problems clear by fixing the code";
      clearAll.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteAllRuntimeErrors();
        this.afterErrorChange();
      });
      header.appendChild(clearAll);
    }

    // Clicking empty header space toggles the drawer.
    header.addEventListener("click", () => {
      this.drawerOpen = !this.drawerOpen;
      drawer.classList.toggle("collapsed", !this.drawerOpen);
    });

    const list = document.createElement("div");
    list.className = "script-error-drawer-list";
    list.style.height = `${this.drawerListHeight}px`;
    const rows = active === "runtime" ? runtimeErrors : problems;
    if (!rows.length) {
      const empty = document.createElement("div");
      empty.className = "script-error-empty";
      empty.textContent =
        active === "runtime" ? "No runtime errors" : "No problems";
      list.appendChild(empty);
    }
    rows.forEach((err, i) => {
      const row = document.createElement("div");
      row.className =
        "script-error-row" + (err.severity === "warning" ? " warning" : "");

      const msg = document.createElement("span");
      msg.className = "script-error-msg";
      msg.textContent = err.message || "Unknown error";
      row.appendChild(msg);

      if (err.line != null) {
        const goto = document.createElement("button");
        goto.className = "script-error-goto";
        goto.textContent = `line ${err.line}`;
        goto.addEventListener("click", (e) => {
          e.stopPropagation();
          this.gotoPosition(err.line, err.column);
          this.showProblemAt(err.line, err.column);
        });
        row.appendChild(goto);
      }

      // Per-row resolve only for runtime errors (problems are live).
      if (active === "runtime") {
        const del = document.createElement("button");
        del.className = "script-error-del";
        del.textContent = "✓";
        del.title = "Mark this runtime error as resolved";
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          deleteRuntimeErrorAt(i);
          this.afterErrorChange();
        });
        row.appendChild(del);
      }

      list.appendChild(row);
    });

    drawer.appendChild(header);
    drawer.appendChild(list);
    this.errorDrawer = drawer;
    // Insert just above the footer.
    if (this.footer && this.footer.parentNode === this.dialog) {
      this.dialog.insertBefore(drawer, this.footer);
    } else {
      this.dialog.appendChild(drawer);
    }
  }

  // Rebuild the drawer after deleting errors, sync the inline runtime-error
  // markers, and refresh the toolbar badge.
  afterErrorChange() {
    this.refreshErrorDrawer();
    if (this.c3editor) {
      this.c3editor.setExtraMarkers(this.runtimeErrorMarkers());
    }
    globalThis._editorScope?.toolbar?.updateValidatorButtonState?.();
  }

  // Rebuild the drawer in place (open/collapsed state rides on this.drawerOpen).
  refreshErrorDrawer() {
    if (!this.isVisible || !this.dialog) return;
    // Rebuilding mid-drag would replace the grip under the captured pointer.
    if (this._resizing) return;
    this.buildErrorDrawer();
  }

  // Debounced refresh for content changes (Monaco or textarea) so the Problems
  // tab tracks the source as it is typed without re-parsing on every keystroke.
  scheduleErrorRefresh() {
    if (this._refreshTimer) clearTimeout(this._refreshTimer);
    this._refreshTimer = setTimeout(() => {
      this._refreshTimer = null;
      this.refreshErrorDrawer();
    }, 250);
  }

  getSource() {
    if (this.c3editor) return this.c3editor.getSource();
    if (this.textarea) return this.textarea.value;
    return this.source;
  }

  save() {
    const ls = getLevelSettings();
    if (ls) ls.updateLevelData("script", this.getSource());
    this.hide();
  }

  // Stop editor input from leaking into the 3D viewport / camera shortcuts.
  // stopPropagation on the dialog fires while the event bubbles up AFTER
  // Monaco's own inner handlers have run, so typing still works.
  blockEventLeak() {
    const events = [
      "mousedown",
      "mouseup",
      "mousemove",
      "click",
      "contextmenu",
      "wheel",
      "keydown",
      "keypress",
      "touchstart",
      "touchend",
      "touchmove",
    ];
    events.forEach((type) => {
      this.dialog.addEventListener(type, (e) => e.stopPropagation(), {
        passive: false,
      });
    });
    this.dialog.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        this.hide();
      }
    });
  }

  applyStyles() {
    if (document.querySelector("#script-dialog-styles")) return;
    const style = document.createElement("style");
    style.id = "script-dialog-styles";
    style.textContent = `
      .script-dialog-backdrop {
        position: fixed; inset: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
        z-index: 3000; opacity: 0; visibility: hidden;
        transition: all 0.25s ease; display: flex;
        align-items: center; justify-content: center;
      }
      .script-dialog-backdrop.visible { opacity: 1; visibility: visible; }
      .script-dialog {
        background: ${Theme.sidebarBackground};
        border: 1px solid ${Theme.borderPrimary};
        width: 860px; max-width: 92vw; height: 600px; max-height: 88vh;
        display: flex; flex-direction: column; overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        transform: scale(0.95) translateY(-12px); opacity: 0;
        transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .script-dialog.visible { transform: scale(1) translateY(0); opacity: 1; }
      .script-dialog-header {
        padding: 14px 20px; background: ${Theme.primary};
        color: ${Theme.textPrimary}; text-transform: uppercase;
      }
      .script-dialog-title { margin: 0; font-size: 1rem; font-weight: 600; }
      .script-dialog-body {
        flex: 1; display: flex; flex-direction: column; min-height: 0;
        padding: 0;
      }
      .script-editor-host { flex: 1; min-height: 0; width: 100%; }
      .script-dialog-textarea {
        width: 100%; height: 100%; box-sizing: border-box; resize: none;
        border: none; outline: none; padding: 12px;
        background: #1e1e1e; color: #d4d4d4;
        font-family: Consolas, 'Courier New', monospace; font-size: 14px;
        line-height: 1.5; tab-size: 2;
      }
      .script-dialog-footer {
        padding: 14px 20px; background: ${Theme.componentBackground};
        border-top: 1px solid ${Theme.borderSecondary};
        display: flex; justify-content: flex-end; gap: 12px;
      }
      .script-dialog-button {
        padding: 9px 20px; border: none; font-size: 0.85rem; font-weight: 600;
        text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer;
        min-width: 96px; font-family: inherit; transition: all 0.2s ease;
      }
      .script-dialog-button.secondary {
        background: ${Theme.componentBackground}; color: ${Theme.textSecondary};
        border: 1px solid ${Theme.borderSecondary};
      }
      .script-dialog-button.secondary:hover {
        background: ${Theme.componentHoverBackground}; color: ${Theme.textPrimary};
        border-color: ${Theme.primary};
      }
      .script-dialog-button.primary {
        background: ${Theme.primary}; color: ${Theme.textPrimary};
        border: 1px solid ${Theme.primary};
      }
      .script-dialog-button.primary:hover { background: ${Theme.primaryHover}; }
      .script-error-drawer {
        border-top: 1px solid ${Theme.borderSecondary};
        background: ${Theme.componentBackground}; flex-shrink: 0;
        position: relative;
      }
      .script-error-resize-grip {
        position: absolute; top: -3px; left: 0; right: 0; height: 6px;
        cursor: ns-resize; z-index: 1;
      }
      .script-error-resize-grip:hover { background: ${Theme.primary}; opacity: 0.5; }
      .script-error-drawer.collapsed .script-error-resize-grip { display: none; }
      .script-error-drawer-header {
        display: flex; align-items: center; gap: 8px;
        padding: 0 10px; cursor: pointer; user-select: none;
      }
      .script-error-tabs { display: flex; gap: 2px; flex: 1; }
      .script-error-tab {
        padding: 9px 14px; border: none; cursor: pointer; font-family: inherit;
        font-size: 0.74rem; font-weight: 600; text-transform: uppercase;
        letter-spacing: 0.4px; color: ${Theme.textSecondary};
        background: transparent; border-bottom: 2px solid transparent;
        transition: all 0.15s ease;
      }
      .script-error-tab:hover { color: ${Theme.textPrimary}; }
      .script-error-tab.active {
        color: ${Theme.textPrimary}; border-bottom-color: ${Theme.primary};
      }
      .script-error-tab-badge {
        display: inline-block; min-width: 16px; padding: 1px 5px;
        margin-left: 6px; font-size: 0.68rem; text-align: center;
        background: ${Theme.sidebarBackground}; color: ${Theme.textSecondary};
      }
      .script-error-tab-badge.has-errors {
        background: ${Theme.error}; color: ${Theme.textPrimary};
      }
      .script-error-tab-badge.has-warnings {
        background: ${Theme.warning}; color: rgba(0,0,0,0.85);
      }
      .script-error-row.warning .script-error-msg { color: ${Theme.warning}; }
      .script-error-empty {
        padding: 14px 12px; font-size: 12px; font-style: italic;
        font-family: Consolas, monospace; color: ${Theme.textSecondary};
      }
      .script-error-clear {
        padding: 4px 12px; border: 1px solid ${Theme.borderSecondary};
        background: ${Theme.sidebarBackground}; color: ${Theme.textSecondary};
        font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
        letter-spacing: 0.4px; cursor: pointer; font-family: inherit;
        transition: all 0.2s ease;
      }
      .script-error-clear:hover { color: ${Theme.primary}; border-color: ${Theme.primary}; }
      .script-error-drawer-header::after {
        content: "▾"; color: ${Theme.textSecondary}; font-size: 0.7rem;
        transition: transform 0.2s ease; padding-left: 2px;
      }
      .script-error-drawer.collapsed .script-error-drawer-header::after {
        transform: rotate(-90deg);
      }
      .script-error-drawer-list {
        overflow-y: auto;
        border-top: 1px solid ${Theme.borderSecondary};
      }
      .script-error-drawer.collapsed .script-error-drawer-list { display: none; }
      .script-error-row {
        display: flex; align-items: center; gap: 10px; padding: 8px 12px;
        border-bottom: 1px solid ${Theme.borderPrimary};
      }
      .script-error-row:last-child { border-bottom: none; }
      .script-error-msg {
        flex: 1; font-family: Consolas, monospace; font-size: 12px;
        color: ${Theme.textPrimary}; white-space: pre-wrap; word-break: break-word;
      }
      .script-error-goto {
        flex-shrink: 0; padding: 3px 10px; border: 1px solid ${Theme.borderSecondary};
        background: ${Theme.sidebarBackground}; color: ${Theme.primary};
        font-size: 0.72rem; cursor: pointer; font-family: inherit;
        white-space: nowrap; transition: all 0.2s ease;
      }
      .script-error-goto:hover { border-color: ${Theme.primary}; background: ${Theme.componentHoverBackground}; }
      .script-error-del {
        flex-shrink: 0; width: 24px; height: 24px; line-height: 1;
        border: 1px solid ${Theme.borderSecondary}; background: ${Theme.sidebarBackground};
        color: ${Theme.textSecondary}; cursor: pointer; font-family: inherit;
        font-size: 12px; transition: all 0.2s ease;
      }
      .script-error-del:hover { color: ${Theme.primary}; border-color: ${Theme.primary}; }
    `;
    document.head.appendChild(style);
  }

  destroy() {
    this.hide();
    const styles = document.querySelector("#script-dialog-styles");
    if (styles) styles.remove();
  }
}

let _instance = null;

/**
 * Open the level-script editor modal. Lazily creates the singleton dialog.
 * @param {{line:number, column?:number}|null} target - optional caret position
 */
export function openScriptEditor(target = null) {
  if (!_instance) _instance = new ScriptEditorDialog();
  _instance.show(target);
}

export function initializeScriptEditorDialog() {
  if (!_instance) _instance = new ScriptEditorDialog();
  if (globalThis._editorScope) {
    globalThis._editorScope.scriptEditorDialog = _instance;
  }
  return _instance;
}

export function destroyScriptEditorDialog() {
  if (_instance) {
    _instance.destroy();
    _instance = null;
  }
}
