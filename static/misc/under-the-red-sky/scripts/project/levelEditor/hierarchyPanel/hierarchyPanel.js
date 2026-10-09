// Hierarchy Panel
// ----------------
// Left-docked tree view of the current level's groups + every interactive
// instance. Mirrors the inspector in event-handling and theming but lives on
// the opposite side of the viewport.
//
// High-level contract:
//  - Source of truth is levelData.groups (via groupManager) + stateManager's
//    instanceMeta (parentGroupId/labels/name/order). The panel is a render of
//    that state, never an independent cache.
//  - Selection is Set<IInstance> in selectionManager. Clicking an instance row
//    selects that instance; clicking a group row bulk-selects every descendant
//    instance. Group rows never end up in selectionManager themselves; we
//    track "active group ids" locally so the keyboard (rename/F2, delete) has
//    something to target.
//  - Drag-drop uses groupManager.reorderChild with explicit midpoint ordering.
//    The drop zone splits each row into thirds vertically: top/bottom third =
//    drop-between (sibling of hovered row); middle third = drop-into (child of
//    hovered row, if it's a group).
//  - Panel state is persisted on projectManager.editorUI.hierarchyPanel.
//    Currently only `minimized: boolean` is stored.
//
// External refresh API:
//  - refreshHierarchyPanel()        — rebuild DOM from scratch
//  - updateHierarchySelection(list) — selection-only refresh (cheap)

import { Theme } from "../inspectorUI.js";
import { getGroupManager } from "../groups/groupManager.js";
import {
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Delete as DeleteIcon,
} from "../iconList.js";
import { getObjectTypeName } from "../objectTypeDefinitions.js";
import { showConfirmDialog } from "../confirmDialog.js";
import { ColorPicker } from "../colorPicker.js";
import { getIconForInstance, getIconByName } from "./typeIconMap.js";
import { showLabelsDictionaryDialog } from "../labels/labelsDictionaryDialog.js";

const PANEL_WIDTH_PX = 280;
// Height of the main editor toolbar (`.editor-toolbar`) — the panel sits
// directly below it instead of starting at the top of the viewport.
const TOP_OFFSET_PX = 49; // 48px toolbar + 1px border
const MIN_TAB_WIDTH_PX = 22;
const MIN_TAB_HEIGHT_PX = 140;
const STYLE_ID = "hierarchy-panel-styles";

// Cache of group ids the user has explicitly "activated" by clicking on the
// group row (distinct from descendant-instance selection). Used by F2/delete
// context so we can rename/delete a group without requiring descendant
// instances. Reset on selection reshuffles that don't originate in the panel.
let activeGroupIds = new Set();

// Singleton instance for global helper exports.
let hierarchyPanelInstance = null;

/**
 * @typedef {Object} TreeItem
 * @property {'group'|'instance'} kind
 * @property {string} id  - group id ("g_...") or instance uid (as string)
 * @property {number} depth
 * @property {Object} ref - the underlying group object or IInstance
 */

// ---------------------------------------------------------------------------
// Panel class
// ---------------------------------------------------------------------------

export class HierarchyPanel {
  constructor(container = document.body) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;

    // Cached flattened tree of TreeItems (post-sort, respecting collapse).
    this.flatTree = [];
    // Map<rowKey, HTMLElement> for incremental updates.
    this.rowElementsByKey = new Map();
    // Active drag source (instance uid as string, or group id).
    this.dragSource = null;
    // Currently-rename-targeted rowKey so blur events know what to finalize.
    this.renamingKey = null;
    // Last computed selection key set for selection-only refresh.
    this.lastSelectionKeys = new Set();
    // Anchor row for shift-range selection (rowKey of last plain click).
    this.selectionAnchorKey = null;

    this.buildDom();
    this.applyStyles();
    this.applyMinimizedStateFromProject();

    // Re-render rows whenever any label dictionary entry or instance label
    // membership changes (dispatched by labelsManager). Cheap because
    // refresh() rebuilds visible rows only.
    this._onLabelsChanged = () => this.refresh();
    document.addEventListener("editor:labels-changed", this._onLabelsChanged);

    // The panel is constructed once at editor boot — BEFORE the user
    // opens a saved project file. `applyMinimizedStateFromProject()`
    // therefore reads an empty editorUI and falls back to default-true.
    // Re-apply only when a project is FRESHLY LOADED (file open) or
    // CREATED, NOT on every projectChanged (which fires for every level
    // switch / mutation and would clobber a mid-session user toggle).
    const pm = globalThis._editorScope?.projectManager;
    if (pm && typeof pm.addEventListener === "function") {
      this._onProjectStateChanged = () => this.setVisible(true);
      this._onProjectClosed = () => this.setVisible(false);
      pm.addEventListener("projectLoaded", this._onProjectStateChanged);
      pm.addEventListener("projectCreated", this._onProjectStateChanged);
      // Hide the panel (and its edge tab) when the project closes — otherwise
      // it lingers over the welcome screen. Matches gridUI / navGizmo.
      pm.addEventListener("projectClosed", this._onProjectClosed);
    }
    // Default hidden until a project is loaded; if the editor booted with a
    // project already open, show it right away.
    this.setVisible(!!pm?.isProjectLoaded);
  }

  destroy() {
    if (this.rootEl && this.rootEl.parentNode) {
      this.rootEl.parentNode.removeChild(this.rootEl);
    }
    if (this.minButtonEl && this.minButtonEl.parentNode) {
      this.minButtonEl.parentNode.removeChild(this.minButtonEl);
    }
    if (this._onLabelsChanged) {
      document.removeEventListener("editor:labels-changed", this._onLabelsChanged);
      this._onLabelsChanged = null;
    }
    if (this._onProjectStateChanged) {
      const pm = globalThis._editorScope?.projectManager;
      if (pm?.removeEventListener) {
        pm.removeEventListener("projectLoaded", this._onProjectStateChanged);
        pm.removeEventListener("projectCreated", this._onProjectStateChanged);
        if (this._onProjectClosed) {
          pm.removeEventListener("projectClosed", this._onProjectClosed);
        }
      }
      this._onProjectStateChanged = null;
      this._onProjectClosed = null;
    }
    this.rowElementsByKey.clear();
    this.flatTree = [];
    activeGroupIds.clear();
  }

  // -------------------------------------------------------------------------
  // DOM construction
  // -------------------------------------------------------------------------

  buildDom() {
    // Expanded panel root (fixed left dock).
    this.rootEl = document.createElement("div");
    this.rootEl.className = "hierarchy-panel";

    this.rootEl.innerHTML = `
      <div class="hierarchy-header">
        <div class="hierarchy-title">Hierarchy</div>
        <button class="hierarchy-collapse-btn" title="Minimize">&#x2190;</button>
      </div>
      <div class="hierarchy-toolbar">
        <button class="hierarchy-btn hierarchy-btn-create-group" title="New group (Ctrl+G on selection)">+ Group</button>
        <button class="hierarchy-btn hierarchy-btn-manage-labels" title="Manage labels…">Labels…</button>
      </div>
      <div class="hierarchy-content" role="tree"></div>
    `;

    this.contentEl = this.rootEl.querySelector(".hierarchy-content");
    this.collapseBtn = this.rootEl.querySelector(".hierarchy-collapse-btn");
    this.createGroupBtn = this.rootEl.querySelector(
      ".hierarchy-btn-create-group"
    );
    this.manageLabelsBtn = this.rootEl.querySelector(
      ".hierarchy-btn-manage-labels"
    );

    // Collapsed-state "tab" on the left edge. Renders as a thin vertical
    // strip with the text "Hierarchy" rotated 90° CCW (reads bottom-to-top).
    this.minButtonEl = document.createElement("button");
    this.minButtonEl.className = "hierarchy-min-tab";
    this.minButtonEl.title = "Show hierarchy";
    this.minButtonEl.innerHTML = `<span class="hierarchy-min-tab-label">Hierarchy</span>`;

    // Attach both to the page.
    this.container.appendChild(this.rootEl);
    this.container.appendChild(this.minButtonEl);

    // Event handlers.
    this.collapseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.setMinimized(true);
    });
    for (const ev of ["click", "pointerdown", "mousedown"]) {
      this.minButtonEl.addEventListener(ev, (e) => e.stopPropagation());
    }
    this.minButtonEl.addEventListener("click", () => this.setMinimized(false));
    this.createGroupBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const groupManager = globalThis._editorScope?.groupManager;
      if (!groupManager) return;
      // Group current selection (or create an empty group under the root).
      const sel = globalThis._editorScope?.selectionManager;
      if (sel && sel.hasSelection()) {
        groupManager.groupSelected();
      } else {
        groupManager.createGroup({});
      }
      this.refresh();
    });
    this.manageLabelsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // No onClose handler needed — labelsManager dispatches
      // `editor:labels-changed` after every mutation, which both this
      // panel and the inspector subscribe to.
      showLabelsDictionaryDialog();
    });

    // Prevent scene propagation. mouseup is excluded so a drag started in the
    // viewport still ends cleanly when it releases over this panel.
    ["mousedown", "click", "contextmenu", "wheel"].forEach((eventType) => {
      this.rootEl.addEventListener(eventType, (e) => e.stopPropagation());
    });

    // Drop-onto-empty-space = drop to root parent.
    this.contentEl.addEventListener("dragover", (e) => {
      if (!this.dragSource) return;
      // Ignore when the event is already handled by a row.
      if (e.target.closest(".hierarchy-row")) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      this.clearDropIndicators();
      this.contentEl.classList.add("drop-into-root");
    });
    this.contentEl.addEventListener("dragleave", (e) => {
      if (e.target === this.contentEl) {
        this.contentEl.classList.remove("drop-into-root");
      }
    });
    this.contentEl.addEventListener("drop", (e) => {
      if (!this.dragSource) return;
      if (e.target.closest(".hierarchy-row")) return;
      e.preventDefault();
      this.contentEl.classList.remove("drop-into-root");
      this.performDrop({ targetParentId: null, beforeId: null, afterId: null });
    });
  }

  // -------------------------------------------------------------------------
  // Style block
  // -------------------------------------------------------------------------

  applyStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .hierarchy-panel {
        position: fixed;
        top: ${TOP_OFFSET_PX}px;
        left: 0;
        width: ${PANEL_WIDTH_PX}px;
        height: calc(100vh - ${TOP_OFFSET_PX}px);
        background: ${Theme.sidebarBackground};
        border-right: 1px solid ${Theme.borderPrimary};
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: ${Theme.textPrimary};
        z-index: 1000;
        display: flex;
        flex-direction: column;
        transform: translateX(-100%);
        transition: transform 0.2s ease;
      }
      .hierarchy-panel.visible { transform: translateX(0); }

      .hierarchy-header {
        padding: 14px 16px;
        background: ${Theme.primary};
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .hierarchy-title {
        font-size: 1rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .hierarchy-collapse-btn {
        background: transparent;
        border: none;
        color: ${Theme.textPrimary};
        font-size: 1rem;
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 2px;
      }
      .hierarchy-collapse-btn:hover { background: rgba(0,0,0,0.2); }

      .hierarchy-toolbar {
        padding: 8px 12px;
        background: ${Theme.bodyBackground};
        border-bottom: 1px solid ${Theme.borderPrimary};
        display: flex;
        gap: 6px;
      }
      .hierarchy-btn {
        background: ${Theme.componentBackground};
        border: 1px solid ${Theme.borderPrimary};
        color: ${Theme.textPrimary};
        font-size: 0.82rem;
        padding: 4px 10px;
        cursor: pointer;
        border-radius: 2px;
      }
      .hierarchy-btn:hover { background: ${Theme.componentHoverBackground}; }

      .hierarchy-content {
        flex: 1;
        overflow-y: auto;
        padding: 4px 0 24px 0;
      }
      .hierarchy-content::-webkit-scrollbar { width: 12px; }
      .hierarchy-content::-webkit-scrollbar-track { background: ${Theme.scrollbarTrack}; }
      .hierarchy-content::-webkit-scrollbar-thumb {
        background: ${Theme.scrollbarThumb};
        border: 3px solid ${Theme.scrollbarTrack};
        background-clip: content-box;
      }
      .hierarchy-content.drop-into-root {
        background: rgba(74,158,255,0.08);
        outline: 1px dashed ${Theme.primary};
        outline-offset: -3px;
      }

      .hierarchy-row {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 2px 6px 2px 4px;
        font-size: 0.85rem;
        cursor: default;
        user-select: none;
        position: relative;
        min-height: 22px;
        border-left: 3px solid transparent;
      }
      .hierarchy-row:hover { background: ${Theme.componentHoverBackground}; }
      .hierarchy-row.selected {
        background: rgba(74,158,255,0.18);
        border-left-color: ${Theme.primary};
      }
      .hierarchy-row.partial-selected {
        border-left-color: ${Theme.warning};
      }
      .hierarchy-row.active-group {
        outline: 1px solid ${Theme.primary};
        outline-offset: -1px;
      }
      .hierarchy-row.drop-into {
        background: rgba(74,158,255,0.28);
      }
      .hierarchy-row.dim {
        opacity: 0.45;
        font-style: italic;
      }

      .hierarchy-row .disclosure {
        width: 14px;
        height: 14px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: ${Theme.textSecondary};
        flex: 0 0 14px;
      }
      .hierarchy-row .disclosure svg { width: 12px; height: 12px; }
      .hierarchy-row .disclosure.placeholder { visibility: hidden; }

      /* Depth guides: thin vertical bars marking each ancestor group.
         Tinted by the ancestor group's color when set, otherwise a faint
         neutral. Lets you trace which group an instance belongs to without
         relying on its own (always-empty) chip. */
      .hierarchy-row .depth-guide {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 2px;
        pointer-events: none;
        opacity: 0.55;
      }

      .hierarchy-row .color-chip {
        width: 8px;
        height: 16px;
        flex: 0 0 8px;
        border-radius: 1px;
        background: transparent;
        border: 1px solid ${Theme.borderSecondary};
        cursor: pointer;
      }
      .hierarchy-row .color-chip:hover {
        border-color: ${Theme.borderPrimary};
      }
      .hierarchy-row .color-chip.placeholder {
        visibility: hidden;
        cursor: default;
      }

      /* Per-row type/structure icon. Sits between the chip column and the
         label. Inherits the row's text color via currentColor so it dims
         with hidden rows and brightens with selected rows in lockstep with
         the label text. Rows that have no icon to show simply omit the
         element (no reserved gap) so labels tuck flush to the chip column. */
      .hierarchy-row .row-icon {
        width: 18px;
        height: 18px;
        flex: 0 0 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: ${Theme.textSecondary};
        opacity: 0.85;
      }
      .hierarchy-row.selected .row-icon { color: ${Theme.textPrimary}; opacity: 1; }
      .hierarchy-row .row-icon svg {
        width: 18px;
        height: 18px;
        display: block;
      }

      .hierarchy-row .row-label {
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .hierarchy-row .row-label .type-tag {
        color: ${Theme.textSecondary};
        font-size: 0.78rem;
        margin-right: 4px;
      }
      .hierarchy-row.kind-group .row-label { font-weight: 600; }

      .hierarchy-row .row-input {
        flex: 1 1 auto;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderFocus};
        color: ${Theme.textPrimary};
        font-size: 0.85rem;
        padding: 1px 4px;
        outline: none;
      }

      .hierarchy-row .row-labels {
        display: inline-flex;
        gap: 3px;
        margin-left: 6px;
        align-items: center;
        position: relative;
      }
      .hierarchy-row .row-label-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex: 0 0 7px;
        border: 1px solid rgba(0,0,0,0.4);
      }
      .hierarchy-row .row-label-more {
        font-size: 0.6rem;
        color: ${Theme.textSecondary};
        line-height: 1;
        margin-left: 1px;
      }
      /* Tooltip-style label list, shown on row hover. Anchored under the
         dot strip via absolute positioning relative to .row-labels. */
      .hierarchy-row .row-labels-tip {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 4px;
        z-index: 200;
        background: ${Theme.sidebarBackground};
        border: 1px solid ${Theme.borderPrimary};
        border-radius: 2px;
        padding: 4px 6px;
        display: none;
        flex-direction: column;
        gap: 2px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        pointer-events: none;
        white-space: nowrap;
      }
      .hierarchy-row .row-labels:hover .row-labels-tip { display: flex; }
      .hierarchy-row .row-labels-tip .tip-row {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.7rem;
        color: ${Theme.textPrimary};
      }
      .hierarchy-row .row-labels-tip .tip-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex: 0 0 7px;
        border: 1px solid rgba(0,0,0,0.4);
      }

      .hierarchy-row .eye-btn {
        background: transparent;
        border: none;
        color: ${Theme.textSecondary};
        cursor: pointer;
        padding: 0 2px;
        flex: 0 0 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .hierarchy-row .eye-btn svg { width: 14px; height: 14px; }
      .hierarchy-row .eye-btn.hidden { color: ${Theme.textMuted}; }
      .hierarchy-row .eye-btn:hover { color: ${Theme.primary}; }

      .hierarchy-row .drop-line {
        position: absolute;
        left: 0;
        right: 0;
        height: 2px;
        background: ${Theme.primary};
        pointer-events: none;
        display: none;
        z-index: 2;
      }
      .hierarchy-row .drop-line.top { top: -1px; }
      .hierarchy-row .drop-line.bottom { bottom: -1px; }
      .hierarchy-row .drop-line.visible { display: block; }

      .hierarchy-context-menu {
        position: fixed;
        background: ${Theme.componentBackground};
        border: 1px solid ${Theme.borderPrimary};
        border-radius: 2px;
        padding: 4px 0;
        min-width: 160px;
        z-index: 2000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 0.85rem;
      }
      .hierarchy-context-menu button {
        display: block;
        width: 100%;
        text-align: left;
        background: transparent;
        border: none;
        color: ${Theme.textPrimary};
        padding: 6px 12px;
        cursor: pointer;
        font-size: 0.85rem;
      }
      .hierarchy-context-menu button:hover { background: ${Theme.componentHoverBackground}; }
      .hierarchy-context-menu button.danger { color: ${Theme.error}; }
      .hierarchy-context-menu .menu-separator {
        height: 1px;
        background: ${Theme.borderPrimary};
        margin: 4px 0;
      }

      .hierarchy-min-tab {
        position: fixed;
        top: ${TOP_OFFSET_PX + 12}px;
        left: 0;
        width: ${MIN_TAB_WIDTH_PX}px;
        height: ${MIN_TAB_HEIGHT_PX}px;
        background: ${Theme.sidebarBackground};
        border: 1px solid ${Theme.borderPrimary};
        border-left: none;
        color: ${Theme.textPrimary};
        border-radius: 0 4px 4px 0;
        cursor: pointer;
        z-index: 999;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s ease;
      }
      .hierarchy-min-tab:hover { background: ${Theme.componentHoverBackground}; }
      .hierarchy-min-tab.hidden { display: none; }
      .hierarchy-min-tab-label {
        transform: rotate(-90deg);
        white-space: nowrap;
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: ${Theme.textSecondary};
      }
      .hierarchy-min-tab:hover .hierarchy-min-tab-label {
        color: ${Theme.textPrimary};
      }
    `;
    document.head.appendChild(style);
  }

  // -------------------------------------------------------------------------
  // Minimize state (persisted in project editorUI)
  // -------------------------------------------------------------------------

  applyMinimizedStateFromProject() {
    const pm = globalThis._editorScope?.projectManager;
    const state = pm?.getEditorUIState?.("hierarchyPanel") ?? {};
    const minimized = state.minimized !== false; // default true
    this.setMinimized(minimized, { persist: false });
  }

  setMinimized(minimized, { persist = true } = {}) {
    this.isMinimized = !!minimized;
    if (this.isMinimized) {
      this.rootEl.classList.remove("visible");
      this.minButtonEl.classList.remove("hidden");
    } else {
      this.rootEl.classList.add("visible");
      this.minButtonEl.classList.add("hidden");
      // Rebuild tree when opening so we're in sync if mutations happened while hidden.
      this.refresh();
    }
    if (persist) {
      const pm = globalThis._editorScope?.projectManager;
      if (pm && pm.isProjectLoaded) {
        pm.updateEditorUIState("hierarchyPanel", { minimized: this.isMinimized });
      }
    }
  }

  // Fully show or hide the panel AND its minimized edge tab. Unlike
  // setMinimized (which always leaves the tab on screen), hiding here removes
  // both so nothing lingers when no project is open. Showing restores the
  // project's persisted minimized/expanded state.
  setVisible(visible) {
    if (visible) {
      this.applyMinimizedStateFromProject();
    } else {
      this.rootEl.classList.remove("visible");
      this.minButtonEl.classList.add("hidden");
    }
  }

  // -------------------------------------------------------------------------
  // Refresh (full rebuild)
  // -------------------------------------------------------------------------

  refresh() {
    // Even when minimized, keep a fresh cached tree in memory so opening is snappy.
    this.flatTree = this.buildFlatTree();

    if (this.isMinimized) {
      // Skip DOM work until the panel is visible.
      return;
    }

    // Drop active group ids that no longer exist.
    const gm = globalThis._editorScope?.groupManager;
    if (gm) {
      for (const id of Array.from(activeGroupIds)) {
        if (!gm.getGroup(id)) activeGroupIds.delete(id);
      }
    }

    // Rebuild DOM.
    this.contentEl.innerHTML = "";
    this.rowElementsByKey.clear();
    for (const item of this.flatTree) {
      const row = this.buildRow(item);
      this.contentEl.appendChild(row);
      this.rowElementsByKey.set(rowKey(item), row);
    }
    this.applySelectionClasses();
  }

  // Selection-only incremental update.
  updateSelection() {
    if (this.isMinimized) return;
    this.applySelectionClasses();
  }

  // -------------------------------------------------------------------------
  // Tree flattening
  // -------------------------------------------------------------------------

  buildFlatTree() {
    const gm = globalThis._editorScope?.groupManager;
    if (!gm) return [];
    const out = [];
    const walk = (parentId, depth) => {
      const children = gm.getSortedChildren(parentId);
      for (const child of children) {
        if (child.kind === "group") {
          const g = child.ref;
          out.push({ kind: "group", id: g.id, depth, ref: g });
          if (!g.collapsed) walk(g.id, depth + 1);
        } else {
          const inst = child.ref;
          out.push({
            kind: "instance",
            id: String(inst.uid),
            depth,
            ref: inst,
          });
        }
      }
    };
    walk(null, 0);
    return out;
  }

  // -------------------------------------------------------------------------
  // Row builder
  // -------------------------------------------------------------------------

  buildRow(item) {
    const row = document.createElement("div");
    row.className = `hierarchy-row kind-${item.kind}`;
    row.dataset.kind = item.kind;
    row.dataset.id = item.id;
    row.style.paddingLeft = `${6 + item.depth * 14}px`;
    row.draggable = true;

    // Greyed-out appearance if the item or any of its ancestor groups is hidden.
    if (this.isItemEffectivelyHidden(item)) row.classList.add("dim");

    // Drop-line indicators (two absolutely-positioned bars, one above, one below).
    const dropTop = document.createElement("div");
    dropTop.className = "drop-line top";
    const dropBottom = document.createElement("div");
    dropBottom.className = "drop-line bottom";
    row.appendChild(dropTop);
    row.appendChild(dropBottom);

    // Depth guides — one thin vertical bar per ancestor group, tinted with
    // that ancestor's color. Provides a visual trail back to the owning
    // group(s) without needing a chip on instance rows.
    //
    // Positioned at the same x-offset that ancestor's disclosure column
    // occupies (matches `paddingLeft = 6 + depth * 14` math used below).
    const ancestorIds = this.getAncestorGroupIdsForItem(item);
    if (ancestorIds.length > 0) {
      const gm = globalThis._editorScope?.groupManager;
      ancestorIds.forEach((aid, depth) => {
        const ag = gm?.getGroup?.(aid);
        const guide = document.createElement("span");
        guide.className = "depth-guide";
        guide.style.left = `${6 + depth * 14 + 6}px`;
        guide.style.background = ag?.color || Theme.borderSecondary;
        row.appendChild(guide);
      });
    }

    // Disclosure triangle (groups only when they have children).
    const disclosure = document.createElement("span");
    disclosure.className = "disclosure";
    if (item.kind === "group") {
      const gm = globalThis._editorScope?.groupManager;
      const hasChildren =
        gm && gm.getSortedChildren(item.id).length > 0;
      if (hasChildren) {
        disclosure.innerHTML = item.ref.collapsed ? ChevronRight : ChevronDown;
        disclosure.style.cursor = "pointer";
        disclosure.addEventListener("click", (e) => {
          e.stopPropagation();
          gm.setGroupCollapsed(item.id, !item.ref.collapsed);
          this.refresh();
        });
      } else {
        disclosure.classList.add("placeholder");
      }
    } else {
      disclosure.classList.add("placeholder");
    }
    row.appendChild(disclosure);

    // Color chip — groups only.
    //
    // Per design, instance rows have no interactive chip (their type tag
    // already signals what they are). Group rows show a small swatch that:
    //   - displays the group's user-set color, or a neutral grey when none.
    //   - on click: opens a transient ColorPicker popup anchored to the chip.
    //   - on right-click: clears the group color back to neutral.
    //
    // Instance rows skip the chip entirely (no placeholder) so their label
    // tucks closer to the disclosure column. Vertical alignment between
    // group and instance siblings is fine without it — the type tag on
    // instance labels already adds visual weight in roughly that slot.
    if (item.kind === "group") {
      const chip = document.createElement("span");
      chip.className = "color-chip";
      if (item.ref.color) {
        chip.style.background = item.ref.color;
        chip.style.borderColor = item.ref.color;
      }
      chip.title = item.ref.color
        ? "Click to change color · Right-click to clear"
        : "Click to set group color";
      chip.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openGroupColorPicker(item, chip);
      });
      chip.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const gm = getGroupManager();
        if (gm) gm.setGroupColor(item.id, null);
      });
      row.appendChild(chip);
    }

    // Type icon — instance rows always (looked up by objectType/shape);
    // group rows only when the group carries an `iconName` (set when it was
    // auto-created from a preset placement). Rows with no icon to show
    // simply skip emitting the element (no reserved gap) so the label
    // tucks flush against the chip column.
    let iconSvg = "";
    if (item.kind === "instance") {
      iconSvg = getIconForInstance(item.ref);
    } else if (item.ref?.iconName) {
      iconSvg = getIconByName(item.ref.iconName);
    }
    if (iconSvg) {
      const iconEl = document.createElement("span");
      iconEl.className = "row-icon";
      iconEl.innerHTML = iconSvg;
      row.appendChild(iconEl);
    }

    // Label.
    const label = document.createElement("span");
    label.className = "row-label";
    label.appendChild(this.buildLabelContent(item));
    row.appendChild(label);

    // Label dots (instance labels). Compact rendering: up to 3 colored
    // dots inline; if there are more, a "+N" suffix appears. Full names
    // are revealed in a hover tooltip anchored to the row. meta.labels
    // stores label IDs; the dictionary lookup yields display name + color.
    // Orphan ids (label was deleted from the dictionary) are silently
    // filtered — cleanup happens lazily next time the instance's labels
    // are mutated.
    if (item.kind === "instance") {
      const sm = globalThis._editorScope?.stateManager;
      const meta = sm ? sm.getInstanceMeta(item.ref.uid) : { labels: [] };
      if (meta.labels && meta.labels.length > 0) {
        const levelData =
          globalThis._editorScope?.levelSettings?.getLevelData?.() || {};
        const dict = levelData.labelDictionary || {};
        const visibleLabels = meta.labels
          .map((id) => dict[id])
          .filter(Boolean);
        if (visibleLabels.length > 0) {
          const labelsEl = document.createElement("span");
          labelsEl.className = "row-labels";

          const MAX_DOTS = 3;
          const shown = visibleLabels.slice(0, MAX_DOTS);
          const overflow = visibleLabels.length - shown.length;
          for (const l of shown) {
            const dot = document.createElement("span");
            dot.className = "row-label-dot";
            dot.style.background = l.color || "#888";
            // No native `title` — the custom .row-labels-tip below shows
            // the full names on hover; double-tooltips are noisy.
            labelsEl.appendChild(dot);
          }
          if (overflow > 0) {
            const more = document.createElement("span");
            more.className = "row-label-more";
            more.textContent = `+${overflow}`;
            labelsEl.appendChild(more);
          }

          // Hover tooltip lists all label names with their swatches.
          const tip = document.createElement("span");
          tip.className = "row-labels-tip";
          for (const l of visibleLabels) {
            const tipRow = document.createElement("span");
            tipRow.className = "tip-row";
            const tipDot = document.createElement("span");
            tipDot.className = "tip-dot";
            tipDot.style.background = l.color || "#888";
            tipRow.appendChild(tipDot);
            const tipName = document.createElement("span");
            tipName.textContent = l.name;
            tipRow.appendChild(tipName);
            tip.appendChild(tipRow);
          }
          labelsEl.appendChild(tip);

          row.appendChild(labelsEl);
        }
      }
    }

    // Eye (visibility) toggle.
    const eye = document.createElement("button");
    eye.className = "eye-btn";
    const hidden = this.isItemHidden(item);
    eye.innerHTML = hidden ? EyeOff : Eye;
    if (hidden) eye.classList.add("hidden");
    eye.title = hidden ? "Show" : "Hide";
    eye.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleItemHidden(item);
    });
    row.appendChild(eye);

    // Interaction.
    row.addEventListener("click", (e) => this.onRowClick(e, item));
    row.addEventListener("dblclick", (e) => this.onRowDoubleClick(e, item));
    row.addEventListener("contextmenu", (e) => this.onRowContextMenu(e, item));
    row.addEventListener("dragstart", (e) => this.onRowDragStart(e, item));
    row.addEventListener("dragend", () => this.onRowDragEnd());
    row.addEventListener("dragover", (e) => this.onRowDragOver(e, item, row));
    row.addEventListener("dragleave", () => {
      row.classList.remove("drop-into");
      row.querySelectorAll(".drop-line").forEach((l) => l.classList.remove("visible"));
    });
    row.addEventListener("drop", (e) => this.onRowDrop(e, item, row));

    return row;
  }

  buildLabelContent(item) {
    const frag = document.createDocumentFragment();
    if (item.kind === "group") {
      frag.append(item.ref.name || "(group)");
      return frag;
    }
    // Instance: "<TypeName> #<uid>" unless a custom name is set.
    const sm = globalThis._editorScope?.stateManager;
    const meta = sm ? sm.getInstanceMeta(item.ref.uid) : { name: "" };
    const typeName = getObjectTypeName(item.ref.objectType?.name) || "Object";
    if (meta.name) {
      const typeTag = document.createElement("span");
      typeTag.className = "type-tag";
      typeTag.textContent = typeName;
      frag.appendChild(typeTag);
      frag.append(meta.name);
    } else {
      frag.append(`${typeName} #${item.ref.uid}`);
    }
    return frag;
  }

  // -------------------------------------------------------------------------
  // Selection reflection
  // -------------------------------------------------------------------------

  applySelectionClasses() {
    const sel = globalThis._editorScope?.selectionManager;
    const gm = globalThis._editorScope?.groupManager;
    const selectedUids = new Set();
    if (sel) {
      for (const inst of sel.getSelection()) {
        selectedUids.add(String(inst.uid));
      }
    }

    // Precompute each group's total and selected descendant-instance counts in a
    // SINGLE pass over all instances, walking each instance's ancestor chain.
    // This replaces a per-group-row gm.getDescendantInstances() call, which was
    // O(rows × allInstances) — and getDescendantInstances itself re-gathers every
    // instance and does an O(groups²) descendant-group walk on each call, so the
    // old path was the dominant cost of every selection change.
    const sm = globalThis._editorScope?.stateManager;
    const totalByGroup = new Map();
    const selectedByGroup = new Map();
    if (gm && sm) {
      for (const inst of sm.getAllInteractiveInstances()) {
        const parentId = gm.getInstanceParent(inst);
        if (!parentId) continue;
        const isSelected = selectedUids.has(String(inst.uid));
        // getAncestorChain returns [self, parent, ...] — i.e. every group this
        // instance is a descendant of.
        for (const g of gm.getAncestorChain(parentId)) {
          totalByGroup.set(g.id, (totalByGroup.get(g.id) || 0) + 1);
          if (isSelected) {
            selectedByGroup.set(g.id, (selectedByGroup.get(g.id) || 0) + 1);
          }
        }
      }
    }

    for (const [key, row] of this.rowElementsByKey.entries()) {
      const { kind, id } = parseRowKey(key);

      // Compute the desired selection classes for this row, as a stable string.
      let desired = "";
      if (kind === "instance") {
        if (selectedUids.has(id)) desired = "selected";
      } else {
        const parts = [];
        if (activeGroupIds.has(id)) parts.push("active-group");
        const total = totalByGroup.get(id) || 0;
        if (total > 0) {
          const selectedCount = selectedByGroup.get(id) || 0;
          if (selectedCount === total) parts.push("selected");
          else if (selectedCount > 0) parts.push("partial-selected");
        }
        desired = parts.join(" ");
      }

      // Diff against what's already applied to THIS element. Skipping unchanged
      // rows avoids classList churn across all rendered rows on every selection
      // (a single-object click changes only a handful). State is stored on the
      // element itself, so freshly-rendered rows (undefined) always apply, and
      // it never goes stale across panel re-renders.
      if (row._appliedSelClass === desired) continue;
      row.classList.remove("selected", "partial-selected", "active-group");
      if (desired) row.classList.add(...desired.split(" "));
      row._appliedSelClass = desired;
    }
  }

  // -------------------------------------------------------------------------
  // Row interactions
  // -------------------------------------------------------------------------

  onRowClick(e, item) {
    // Ignore clicks originating from interactive children (button, input).
    if (
      e.target.closest(".eye-btn") ||
      e.target.classList.contains("row-input") ||
      e.target.closest(".disclosure")
    )
      return;
    e.stopPropagation();

    const sel = globalThis._editorScope?.selectionManager;
    if (!sel) return;

    const isShift = e.shiftKey;
    const isToggle = e.ctrlKey || e.metaKey;

    // Shift-range select operates on the currently-visible flat tree.
    if (isShift && this.selectionAnchorKey) {
      const anchorIdx = this.flatTree.findIndex(
        (t) => rowKey(t) === this.selectionAnchorKey
      );
      const targetIdx = this.flatTree.findIndex(
        (t) => rowKey(t) === rowKey(item)
      );
      if (anchorIdx >= 0 && targetIdx >= 0) {
        const [lo, hi] =
          anchorIdx <= targetIdx
            ? [anchorIdx, targetIdx]
            : [targetIdx, anchorIdx];
        const range = this.flatTree.slice(lo, hi + 1);
        const instances = [];
        const gm = globalThis._editorScope?.groupManager;
        activeGroupIds.clear();
        for (const t of range) {
          if (t.kind === "instance") {
            instances.push(t.ref);
          } else if (gm) {
            activeGroupIds.add(t.id);
            for (const inst of gm.getDescendantInstances(t.id)) {
              instances.push(inst);
            }
          }
        }
        sel.setSelection(...instances);
        // The shift-range target row becomes the new pickwalk anchor.
        sel.setLastAnchor({
          kind: item.kind,
          id: item.kind === "instance" ? item.ref.uid : item.id,
        });
        this.applySelectionClasses();
        return;
      }
    }

    // Any non-shift click resets the anchor.
    this.selectionAnchorKey = rowKey(item);

    // Pickwalk anchor — clicking a row in the hierarchy panel makes that
    // row the new starting point for `[` / `]`. Both instance and group
    // rows are valid anchors. setLastAnchor also clears any prior pickwalk
    // stack since this is a fresh user choice.
    sel.setLastAnchor({
      kind: item.kind,
      id: item.kind === "instance" ? item.ref.uid : item.id,
    });

    if (item.kind === "group") {
      // Bulk-select descendants. Track this group as active for rename/delete.
      if (!isToggle) activeGroupIds.clear();
      activeGroupIds.add(item.id);
      const gm = globalThis._editorScope?.groupManager;
      const descendants = gm ? gm.getDescendantInstances(item.id) : [];
      if (isToggle) {
        for (const inst of descendants) sel.addToSelection(inst);
      } else {
        sel.setSelection(...descendants);
      }
      this.applySelectionClasses();
      return;
    }

    // Instance: clicking clears active groups unless holding modifier.
    if (!isToggle) activeGroupIds.clear();

    if (isToggle) sel.toggleSelection(item.ref);
    else sel.setSelection(item.ref);
  }

  onRowDoubleClick(e, item) {
    e.stopPropagation();
    // Only rename when the dblclick lands on the row label itself. Dblclicks
    // originating on the disclosure chevron, color chip, eye toggle, or any
    // other interactive control would otherwise spuriously open the rename
    // editor while the user is just clicking that control twice.
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.closest(".row-label")) {
      this.beginRename(item);
    }
  }

  onRowContextMenu(e, item) {
    e.preventDefault();
    e.stopPropagation();
    this.showContextMenu(e.clientX, e.clientY, item);
  }

  // -------------------------------------------------------------------------
  // Drag and drop
  // -------------------------------------------------------------------------

  onRowDragStart(e, item) {
    // Multi-drag: if the grabbed row participates in the current selection,
    // drag the entire selection. Otherwise drag just this row.
    //
    // Selection sources:
    //   - instances: selectionManager.getSelection()
    //   - groups:    activeGroupIds (panel-local, populated by row clicks)
    //
    // Sources are returned in flat-tree (visual) order so the drop logic can
    // chain neighbors to preserve relative order at the destination.
    const sel = globalThis._editorScope?.selectionManager;
    const selectedInstances = new Set(sel?.getSelection?.() ?? []);
    const isInMulti =
      (item.kind === "instance" && selectedInstances.has(item.ref)) ||
      (item.kind === "group" && activeGroupIds.has(item.id));

    let sources;
    if (
      isInMulti &&
      (selectedInstances.size + activeGroupIds.size > 1)
    ) {
      sources = [];
      for (const t of this.flatTree) {
        if (t.kind === "instance" && selectedInstances.has(t.ref)) {
          sources.push({ kind: "instance", id: t.id });
        } else if (t.kind === "group" && activeGroupIds.has(t.id)) {
          sources.push({ kind: "group", id: t.id });
        }
      }
    } else {
      sources = [{ kind: item.kind, id: item.id }];
    }

    this.dragSource = sources[0]; // legacy single-source field (cycle checks)
    this.dragSources = sources;
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData(
        "text/plain",
        sources.map((s) => `${s.kind}:${s.id}`).join(",")
      );
    } catch {}
  }

  onRowDragEnd() {
    this.dragSource = null;
    this.dragSources = null;
    this.clearDropIndicators();
    this.contentEl.classList.remove("drop-into-root");
  }

  onRowDragOver(e, item, row) {
    if (!this.dragSource) return;
    const sources = this.dragSources ?? [this.dragSource];

    // Disallow dropping onto any of the dragged rows themselves.
    for (const s of sources) {
      if (s.kind === item.kind && s.id === item.id) return;
    }
    // Disallow dropping a dragged group onto its own descendant (cycle).
    if (item.kind === "group") {
      const gm = globalThis._editorScope?.groupManager;
      if (gm) {
        for (const s of sources) {
          if (s.kind !== "group") continue;
          if (gm.getDescendantGroupIds(s.id).includes(item.id)) return;
        }
      }
    }

    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    this.clearDropIndicators();

    const zone = computeDropZone(e, row);
    const dropTop = row.querySelector(".drop-line.top");
    const dropBottom = row.querySelector(".drop-line.bottom");
    if (zone === "into") {
      // Only meaningful over a group (or over an instance -> fallback: treat
      // as sibling insertion below it). If the hovered row isn't a group, we
      // snap "into" zones to "after" to keep behavior predictable.
      if (item.kind === "group") {
        row.classList.add("drop-into");
      } else if (dropBottom) {
        dropBottom.classList.add("visible");
      }
    } else if (zone === "above" && dropTop) {
      dropTop.classList.add("visible");
    } else if (dropBottom) {
      dropBottom.classList.add("visible");
    }
  }

  onRowDrop(e, item, row) {
    if (!this.dragSource) return;
    e.preventDefault();
    e.stopPropagation();

    const zone = computeDropZone(e, row);
    const gm = globalThis._editorScope?.groupManager;
    this.clearDropIndicators();

    let targetParentId = null;
    let beforeId = null;
    let afterId = null;

    if (zone === "into" && item.kind === "group") {
      targetParentId = item.id;
      // Append at end (no neighbors) -> handled by reorderChild's end logic.
    } else {
      // Sibling of hovered item. Parent = item's parent.
      if (item.kind === "group") {
        targetParentId = item.ref.parentId ?? null;
      } else {
        const sm = globalThis._editorScope?.stateManager;
        const meta = sm ? sm.getInstanceMeta(item.ref.uid) : { parentGroupId: null };
        targetParentId = meta.parentGroupId ?? null;
      }
      // Determine neighbor ids by finding item's position in flatTree among siblings.
      const siblings = gm ? gm.getSortedChildren(targetParentId) : [];
      const itemSiblingIndex = siblings.findIndex((s) =>
        s.kind === item.kind &&
        (s.kind === "group" ? s.ref.id === item.id : String(s.ref.uid) === item.id)
      );
      if (zone === "above") {
        afterId = item.kind === "group" ? item.id : Number(item.id);
        if (itemSiblingIndex > 0) {
          const prev = siblings[itemSiblingIndex - 1];
          beforeId = prev.kind === "group" ? prev.ref.id : Number(prev.ref.uid);
        }
      } else {
        beforeId = item.kind === "group" ? item.id : Number(item.id);
        if (itemSiblingIndex >= 0 && itemSiblingIndex < siblings.length - 1) {
          const next = siblings[itemSiblingIndex + 1];
          afterId = next.kind === "group" ? next.ref.id : Number(next.ref.uid);
        }
      }
    }

    this.performDrop({ targetParentId, beforeId, afterId });
  }

  performDrop({ targetParentId, beforeId, afterId }) {
    const sources = this.dragSources ?? (this.dragSource ? [this.dragSource] : []);
    if (sources.length === 0) return;
    const gm = globalThis._editorScope?.groupManager;
    if (!gm) return;

    // Move each source in turn, chaining neighbors so the dragged set stays
    // contiguous at the destination AND preserves its visual order.
    //
    //   "above target":  [src0, src1, ...] go between (beforeId, target).
    //                    src0 inserts between beforeId and target;
    //                    src1 between src0 and target; etc.
    //
    //   "below target" / "into": [src0, src1, ...] go after target.
    //                    src0 inserts between target and afterId;
    //                    src1 between src0 and afterId; etc.
    //
    // The "above" case needs the sources walked in original order placing each
    // one *after* the previously-placed source (which sits just above target).
    // The "below"/"into" case needs the same — each new source lands between
    // the previously-placed source and the original `afterId` neighbor. So
    // both cases share the same chaining shape: prevId becomes the new
    // `beforeId` for the next iteration; the trailing neighbor is whatever
    // sits "below" our growing block (target itself for "above", original
    // `afterId` for "below"/"into").
    let chainBefore = beforeId;
    const chainAfterFinal =
      afterId !== null && afterId !== undefined ? afterId : null;

    for (const src of sources) {
      const id = src.kind === "group" ? src.id : Number(src.id);
      const ok = gm.reorderChild(
        { kind: src.kind, id },
        targetParentId,
        chainBefore,
        chainAfterFinal
      );
      // If a single source fails (e.g. cycle), skip it and continue with the
      // rest — partial moves are still useful and reorderChild's per-call
      // commits stay coalesced into one undo entry by the change-coalesce
      // window in stateManager.
      if (ok) {
        chainBefore = src.kind === "group" ? src.id : Number(src.id);
      }
    }

    this.dragSource = null;
    this.dragSources = null;
    this.refresh();
  }

  clearDropIndicators() {
    for (const row of this.rowElementsByKey.values()) {
      row.classList.remove("drop-into");
      row.querySelectorAll(".drop-line").forEach((l) => l.classList.remove("visible"));
    }
  }

  // -------------------------------------------------------------------------
  // Rename (F2 / double-click)
  // -------------------------------------------------------------------------

  beginRename(item) {
    const row = this.rowElementsByKey.get(rowKey(item));
    if (!row) return;
    const labelEl = row.querySelector(".row-label");
    if (!labelEl) return;

    const currentValue =
      item.kind === "group"
        ? item.ref.name || ""
        : this.getCurrentInstanceName(item);

    const input = document.createElement("input");
    input.type = "text";
    input.className = "row-input";
    input.value = currentValue;

    this.renamingKey = rowKey(item);
    labelEl.replaceWith(input);
    input.focus();
    input.select();

    const finish = (commit) => {
      if (this.renamingKey !== rowKey(item)) return;
      this.renamingKey = null;
      if (commit) {
        const newValue = input.value.trim();
        if (item.kind === "group") {
          const gm = globalThis._editorScope?.groupManager;
          if (gm) gm.renameGroup(item.id, newValue || item.ref.name);
        } else {
          const sm = globalThis._editorScope?.stateManager;
          if (sm) sm.setInstanceMeta(item.ref.uid, { name: newValue });
        }
      }
      this.refresh();
    };

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        finish(true);
      } else if (e.key === "Escape") {
        e.preventDefault();
        finish(false);
      }
      e.stopPropagation();
    });
    input.addEventListener("blur", () => finish(true));
    input.addEventListener("click", (e) => e.stopPropagation());
  }

  getCurrentInstanceName(item) {
    const sm = globalThis._editorScope?.stateManager;
    return sm ? sm.getInstanceMeta(item.ref.uid).name || "" : "";
  }

  // -------------------------------------------------------------------------
  // Visibility
  // -------------------------------------------------------------------------

  // Does the row represent an item whose OWN hidden flag is true?
  isItemHidden(item) {
    if (item.kind === "group") return !!item.ref.hidden;
    const sm = globalThis._editorScope?.stateManager;
    if (!sm) return false;
    const meta = sm.getInstanceMeta(item.ref.uid);
    return !!meta.hidden;
  }

  // Is the row EFFECTIVELY hidden — either its own hidden flag, or any
  // ancestor group's hidden flag? Used for the greyed-out row style.
  isItemEffectivelyHidden(item) {
    if (this.isItemHidden(item)) return true;
    const gm = globalThis._editorScope?.groupManager;
    if (!gm) return false;
    if (item.kind === "group") {
      const chain = gm.getAncestorChain(item.ref.parentId);
      return chain.some((g) => g.hidden);
    }
    // Instance: walk ancestor groups.
    const ancestorIds = gm.getInstanceAncestorGroupIds(item.ref);
    for (const gid of ancestorIds) {
      const g = gm.getGroup(gid);
      if (g?.hidden) return true;
    }
    return false;
  }

  /**
   * Return ancestor group ids for an item, ordered ROOT-FIRST (so index N
   * corresponds to depth N in the tree). Excludes the item itself for
   * groups — i.e. only its strict ancestors. Used to render depth guides.
   */
  getAncestorGroupIdsForItem(item) {
    const gm = globalThis._editorScope?.groupManager;
    if (!gm) return [];
    let chainDeepestFirst;
    if (item.kind === "group") {
      // getAncestorChain(parentId) returns parentId's chain (deepest-first).
      chainDeepestFirst = gm.getAncestorChain(item.ref.parentId).map((g) => g.id);
    } else {
      chainDeepestFirst = gm.getInstanceAncestorGroupIds(item.ref);
    }
    return chainDeepestFirst.slice().reverse(); // root-first
  }

  toggleItemHidden(item) {
    if (item.kind === "group") {
      const gm = globalThis._editorScope?.groupManager;
      if (gm) gm.setGroupHidden(item.id, !item.ref.hidden);
      applyInstanceVisibility();
      this.refresh();
      return;
    }
    const sm = globalThis._editorScope?.stateManager;
    if (!sm) return;
    const meta = sm.getInstanceMeta(item.ref.uid);
    sm.setInstanceMeta(item.ref.uid, { hidden: !meta.hidden });
    sm.pushUndoState(meta.hidden ? "Show Instance" : "Hide Instance");
    applyInstanceVisibility();
    this.refresh();
  }

  /**
   * Open a transient ColorPicker popup anchored to the chip element of a
   * group row. The picker writes through groupManager.setGroupColor on every
   * change (which pushes its own undo entry per change — acceptable since the
   * user is actively scrubbing/clicking colors and expects each commit to be
   * undoable).
   *
   * Implementation note: ColorPicker.showPopup() positions itself using
   * `this.element.getBoundingClientRect()`. We don't need a separate trigger
   * button — we set `picker.element = chip` so the popup anchors directly to
   * the chip the user clicked.
   */
  openGroupColorPicker(item, chipEl) {
    if (item.kind !== "group") return;
    const gm = getGroupManager();
    if (!gm) return;

    // ColorPicker tracks its own "isOpen" state; if we re-create one per
    // click that's fine since we discard the picker after close.
    //
    // showHexInput MUST be false here: ColorPicker.setValue() unconditionally
    // touches `this.hexInput.value` when showHexInput is true, but we bypass
    // mount() (no hex input was ever created), so leaving it true throws
    // before onChange runs — meaning the chosen color paints the chip but
    // never persists, and the next refresh "resets" it.
    const picker = new ColorPicker({
      value: item.ref.color || "#9d9885",
      showHexInput: false,
      onChange: (color) => {
        gm.setGroupColor(item.id, color);
      },
    });
    // Bypass mount() — we want the chip itself as the anchor, not a new
    // button injected into the DOM.
    picker.element = chipEl;
    picker.showPopup();
  }

  // -------------------------------------------------------------------------
  // Context menu
  // -------------------------------------------------------------------------

  showContextMenu(x, y, item) {
    // Remove any existing menu.
    const existing = document.querySelector(".hierarchy-context-menu");
    if (existing) existing.remove();

    const menu = document.createElement("div");
    menu.className = "hierarchy-context-menu";
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    const gm = globalThis._editorScope?.groupManager;

    const addItem = (label, handler, { danger = false, separator = false } = {}) => {
      if (separator) {
        const sep = document.createElement("div");
        sep.className = "menu-separator";
        menu.appendChild(sep);
        return;
      }
      const btn = document.createElement("button");
      btn.textContent = label;
      if (danger) btn.classList.add("danger");
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.remove();
        handler();
      });
      menu.appendChild(btn);
    };

    addItem("Rename", () => this.beginRename(item));

    if (item.kind === "group") {
      addItem("New subgroup", () => {
        if (!gm) return;
        gm.createGroup({ parentId: item.id });
        this.refresh();
      });
      addItem(item.ref.hidden ? "Show" : "Hide", () => {
        this.toggleItemHidden(item);
      });
      addItem("separator", () => {}, { separator: true });
      addItem(
        "Ungroup (dissolve)",
        () => {
          if (!gm) return;
          gm.dissolveGroup(item.id);
          this.refresh();
        },
      );
      addItem(
        "Delete group + contents",
        () => {
          if (!gm) return;
          const descendants = gm.getDescendantInstances(item.id);
          const descendantGroups = gm.getDescendantGroupIds(item.id);
          // Silent delete for empty groups (no instances, no child groups).
          if (descendants.length === 0 && descendantGroups.length === 0) {
            gm.deleteGroupRecursive(item.id);
            this.refresh();
            return;
          }
          const doDelete = () => {
            gm.deleteGroupRecursive(item.id);
            this.refresh();
          };
          if (typeof showConfirmDialog === "function") {
            showConfirmDialog({
              title: "Delete group?",
              message: `This will destroy "${item.ref.name}" and all instances inside it.`,
              confirmText: "Delete",
              isDangerous: true,
              onConfirm: doDelete,
            });
          } else {
            doDelete();
          }
        },
        { danger: true }
      );
    } else {
      // Instance row.
      const sel = globalThis._editorScope?.selectionManager;
      const selectionList = sel?.getSelection?.() ?? [];
      const selectionSet = new Set(selectionList);
      const rightClickedIsSelected = selectionSet.has(item.ref);
      const multiSelected = rightClickedIsSelected && selectionList.length > 1;

      // Group selection (mirrors Ctrl+G). Only meaningful for multi-selection
      // and only when the right-clicked row participates in that selection —
      // otherwise the menu would silently group some other set of instances.
      if (multiSelected && gm) {
        addItem(`Group selection (${selectionList.length})`, () => {
          gm.groupSelected();
          this.refresh();
        });
      }

      addItem("separator", () => {}, { separator: true });

      // Delete: route through selectionManager so group-prune + undo path are
      // identical to keyboard Delete. If the right-clicked instance isn't
      // part of the current selection, we momentarily reduce the selection
      // to just that instance so we delete what the user actually clicked.
      const deleteLabel = multiSelected
        ? `Delete selection (${selectionList.length})`
        : "Delete";
      addItem(
        deleteLabel,
        () => {
          if (!sel) return;
          if (!rightClickedIsSelected) {
            sel.clearSelection();
            sel.addToSelection(item.ref);
          }
          sel.deleteSelected();
          this.refresh();
        },
        { danger: true }
      );
    }

    document.body.appendChild(menu);

    // Auto-dismiss on next click anywhere.
    const dismiss = (ev) => {
      if (!menu.contains(ev.target)) {
        menu.remove();
        document.removeEventListener("mousedown", dismiss, true);
      }
    };
    setTimeout(() => document.addEventListener("mousedown", dismiss, true), 0);
  }

  // -------------------------------------------------------------------------
  // External key handling (hook for F2 rename of active group).
  // -------------------------------------------------------------------------

  handleF2() {
    // Priority: first active group, else first selected instance.
    for (const gid of activeGroupIds) {
      const item = this.flatTree.find(
        (t) => t.kind === "group" && t.id === gid
      );
      if (item) {
        this.beginRename(item);
        return true;
      }
    }
    const sel = globalThis._editorScope?.selectionManager;
    const first = sel?.getSelection?.()[0];
    if (first) {
      const item = this.flatTree.find(
        (t) => t.kind === "instance" && t.id === String(first.uid)
      );
      if (item) {
        this.beginRename(item);
        return true;
      }
    }
    return false;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function rowKey(item) {
  return `${item.kind}:${item.id}`;
}
function parseRowKey(key) {
  const idx = key.indexOf(":");
  return { kind: key.slice(0, idx), id: key.slice(idx + 1) };
}

/**
 * Decide which drop zone of a row is under the cursor.
 * Top 25% = "above", bottom 25% = "below", middle 50% = "into".
 * Returns "above" | "into" | "below".
 */
function computeDropZone(e, row) {
  const rect = row.getBoundingClientRect();
  const y = e.clientY - rect.top;
  if (y < rect.height * 0.25) return "above";
  if (y > rect.height * 0.75) return "below";
  return "into";
}

// ---------------------------------------------------------------------------
// Module-level singleton + helpers exported for use by other modules
// ---------------------------------------------------------------------------

export function initializeHierarchyPanel(container) {
  if (hierarchyPanelInstance) return hierarchyPanelInstance;
  hierarchyPanelInstance = new HierarchyPanel(container);
  globalThis._editorScope = globalThis._editorScope || {};
  globalThis._editorScope.hierarchyPanel = hierarchyPanelInstance;
  return hierarchyPanelInstance;
}

export function destroyHierarchyPanel() {
  if (hierarchyPanelInstance) {
    hierarchyPanelInstance.destroy();
    hierarchyPanelInstance = null;
  }
}

export function getHierarchyPanel() {
  return hierarchyPanelInstance;
}

/** Full rebuild; call after any structural change (groups/instances/meta). */
export function refreshHierarchyPanel() {
  applyInstanceVisibility();
  if (hierarchyPanelInstance) hierarchyPanelInstance.refresh();
}

/** Selection-only refresh; cheap. Called from selectionManager. */
export function updateHierarchySelection() {
  if (hierarchyPanelInstance) hierarchyPanelInstance.updateSelection();
}

/**
 * Apply effective visibility (self-hidden || any-ancestor-hidden) to every
 * interactive instance's `isVisible` flag. Called after any mutation that can
 * change an instance's effective visibility (group hide, instance hide,
 * reparent, structural load, etc.).
 *
 * Runtime consequences:
 *  - `instance.isVisible = false` removes the instance from rendering.
 *  - Raycast callers already filter by `instance.isVisible` (see
 *    selectionManager.js:1402, editorMain.js:386), so hidden instances are
 *    also excluded from picks / marquee selection automatically.
 */
export function applyInstanceVisibility() {
  const sm = globalThis._editorScope?.stateManager;
  const gm = globalThis._editorScope?.groupManager;
  if (!sm || !gm) return;
  // Precompute the hidden flag for every group so ancestor walks are O(depth).
  const groups = gm.getGroups();
  const groupHiddenCache = Object.create(null);
  const isGroupEffectivelyHidden = (gid) => {
    if (gid in groupHiddenCache) return groupHiddenCache[gid];
    const g = groups[gid];
    if (!g) return (groupHiddenCache[gid] = false);
    if (g.hidden) return (groupHiddenCache[gid] = true);
    return (groupHiddenCache[gid] = g.parentId
      ? isGroupEffectivelyHidden(g.parentId)
      : false);
  };

  const all = sm.getAllInteractiveInstances();
  for (const inst of all) {
    const meta = sm.getInstanceMeta(inst.uid);
    const ownHidden = !!meta.hidden;
    const parentId = meta.parentGroupId ?? null;
    const ancestorHidden = parentId ? isGroupEffectivelyHidden(parentId) : false;
    const shouldBeVisible = !(ownHidden || ancestorHidden);
    // Only write when the flag actually changes so we don't thrash engines
    // that do work in the `isVisible` setter.
    if (inst.isVisible !== shouldBeVisible) {
      try {
        inst.isVisible = shouldBeVisible;
      } catch {
        /* some instance types may reject writes to isVisible during shutdown */
      }
    }
  }
}
