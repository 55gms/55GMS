// Navigation Gizmo wrapper
// -------------------------
// Hosts the gimbal nav gizmo (orbital rings + axis caps) in a
// fixed-position container at the top-right of the editor viewport.
// Slides left when the inspector sidebar opens so it isn't hidden
// behind the 280px-wide right dock. Hidden until a project is loaded
// so it doesn't float over the welcome screen.
//
// Impl interface (see ./impls/gimbal.js):
//   constructor(host)                         — append your DOM into host
//   attach(cameraController, runtime)         — start the per-frame loop
//   destroy()                                 — full teardown

import { GimbalGizmo } from "./impls/gimbal.js";

const TOP_OFFSET_PX = 49;
const TOP_INSET_PX = 12;
const RIGHT_INSET_DEFAULT = 12;
const INSPECTOR_WIDTH_PX = 280;
const RIGHT_INSET_INSPECTOR_OPEN = INSPECTOR_WIDTH_PX + 12;
const MINTAB_WIDTH_PX = 22;
const RIGHT_INSET_MINTAB_OPEN = MINTAB_WIDTH_PX + 12;

const CONTAINER_ID = "nav-gizmo-root";
const STYLE_ID = "nav-gizmo-host-styles";

let navGizmoInstance = null;

class NavGizmoHost {
  constructor() {
    this.impl = null;
    this._inspectorObserver = null;
    this._pmListeners = null;
    this._injectStyles();
    this._buildHost();
    this._mountImpl();
    this._watchInspector();
    this._watchProject();
  }

  _injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${CONTAINER_ID} {
        position: fixed;
        top: ${TOP_OFFSET_PX + TOP_INSET_PX}px;
        right: ${RIGHT_INSET_DEFAULT}px;
        /* Below dialogs (z-index 1000+) so they naturally cover it. */
        z-index: 999;
        pointer-events: none;
        user-select: none;
        transition: right 0.3s ease;
      }
      #${CONTAINER_ID}.inspector-open {
        right: ${RIGHT_INSET_INSPECTOR_OPEN}px;
      }
      #${CONTAINER_ID}.mintab-open {
        right: ${RIGHT_INSET_MINTAB_OPEN}px;
      }
      #${CONTAINER_ID}.hidden { display: none; }
    `;
    document.head.appendChild(style);
  }

  _buildHost() {
    this.root = document.createElement("div");
    this.root.id = CONTAINER_ID;
    // Block ALL input events at the gizmo root so the editor's
    // document-level listeners (cameraController uses legacy
    // mouse/wheel events; selectionManager uses click; etc.) never
    // see anything that started on the gizmo. We mirror the list used
    // by the project dialogs (see ghostPathDialog.js) for consistency.
    //
    // Important: stopPropagation only — we do NOT preventDefault here,
    // so the synthesised `click` on inner axis caps still fires on its
    // target, and bubbles up where our root `click` listener also
    // stops it from reaching document-level handlers.
    const stop = (e) => e.stopPropagation();
    // mouseup/pointerup and move events are NOT blocked, so a drag started
    // elsewhere can move/end over the gizmo. mousedown stays blocked so a click
    // can't start a camera gesture on the gizmo.
    const eventsToBlock = [
      "mousedown",
      "click",
      "dblclick",
      "contextmenu",
      "wheel",
      "keydown",
      "keypress",
      "touchstart",
      "touchend",
      "touchmove",
      "pointerdown",
    ];
    for (const ev of eventsToBlock) {
      this.root.addEventListener(ev, stop, { passive: false });
    }
    document.body.appendChild(this.root);
  }

  _mountImpl() {
    this.impl = new GimbalGizmo(this.root);
  }

  _watchInspector() {
    const apply = (sidebar, mintab) => {
      if (sidebar) {
        this.root.classList.toggle(
          "inspector-open",
          sidebar.classList.contains("visible")
        );
      }
      if (mintab) {
        this.root.classList.toggle(
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
      this._inspectorObserver = new MutationObserver(() => apply(sidebar, mintab));
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

  // Hide the gizmo whenever no project is loaded (welcome screen) and
  // re-show it on projectLoaded / projectCreated. This avoids the gizmo
  // floating over the welcome dialog. We also pre-hide on construction
  // so the gizmo doesn't flicker in before the welcome dialog opens.
  _watchProject() {
    const pm = globalThis._editorScope && globalThis._editorScope.projectManager;
    // Default to hidden; the project listeners (or the immediate
    // hasProjectLoaded check below) will reveal it when appropriate.
    this.setVisible(false);
    if (!pm) {
      // projectManager isn't ready yet — try once next frame.
      requestAnimationFrame(() => this._watchProject());
      return;
    }
    const onLoaded = () => this.setVisible(true);
    const onClosed = () => this.setVisible(false);
    pm.addEventListener("projectLoaded", onLoaded);
    pm.addEventListener("projectCreated", onLoaded);
    // projectManager doesn't currently fire a "projectClosed" event, but
    // listen for it defensively in case one is added later.
    pm.addEventListener("projectClosed", onClosed);
    this._pmListeners = { pm, onLoaded, onClosed };
    if (typeof pm.hasProjectLoaded === "function" && pm.hasProjectLoaded()) {
      this.setVisible(true);
    }
  }

  attach(cc, runtime) {
    if (this.impl) this.impl.attach(cc, runtime);
  }

  setVisible(v) {
    this.root.classList.toggle("hidden", !v);
  }

  destroy() {
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
    if (this.impl) this.impl.destroy();
    this.impl = null;
    if (this.root && this.root.parentNode) {
      this.root.parentNode.removeChild(this.root);
    }
    const styleEl = document.getElementById(STYLE_ID);
    if (styleEl) styleEl.remove();
  }
}

// ---------------------------------------------------------------------------
// Module-level helpers (matches groupManager / labelsManager pattern)
// ---------------------------------------------------------------------------

export function initializeNavGizmo() {
  if (navGizmoInstance) return navGizmoInstance;
  navGizmoInstance = new NavGizmoHost();
  return navGizmoInstance;
}

export function getNavGizmo() {
  return navGizmoInstance;
}

export function destroyNavGizmo() {
  if (navGizmoInstance) {
    navGizmoInstance.destroy();
    navGizmoInstance = null;
  }
}
