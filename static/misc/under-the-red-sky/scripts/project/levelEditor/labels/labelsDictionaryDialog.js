// LabelsDictionaryDialog
// ─────────────────────────────────────────────────────────────────────────
// Modal for managing the level's label dictionary:
//   - rename (inline text input, commit on blur/Enter)
//   - recolor (inline color picker)
//   - delete (cascade-strips from every instance, with confirm)
//   - create new (input row at bottom)
//   - variables ("n vars" button → labelVarsDialog, the per-label schema editor)
//
// All mutations route through LabelsManager so undo descriptions stay
// readable. The dialog re-renders its own list after each mutation; the
// caller-provided `onClose` callback fires once when the modal is dismissed.
// labelsManager dispatches `editor:labels-changed` on every mutation so the
// inspector + hierarchy panel refresh themselves without callers needing to
// orchestrate it.
//
// Z-index policy: the dialog backdrop/dialog sit at 1500/1501 — ABOVE the
// inspector sidebar (~10) but BELOW confirmDialog (3000) and ColorPicker
// popup (10000) so those layer correctly above us.
//
// Visual design mirrors the inspector sidebar (dark bg, primary accent,
// uppercase title, small monochrome icon buttons). Only icons from
// iconList.js are used — no emojis.

import { Theme } from "../inspectorUI.js";
import { getLabelsManager } from "./labelsManager.js";
import { showConfirmDialog } from "../confirmDialog.js";
import { ColorPicker } from "../colorPicker.js";
import { showLabelVarsDialog } from "./labelVarsDialog.js";
import * as Icons from "../iconList.js";

class LabelsDictionaryDialog {
  constructor() {
    this.container = null;
    this.backdrop = null;
    this.dialog = null;
    this.listEl = null;
    this.isVisible = false;
    this.onCloseCb = null;
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────

  show({ onClose } = {}) {
    if (this.isVisible) return;
    this.onCloseCb = typeof onClose === "function" ? onClose : null;
    this.applyStyles();
    this.createDialog();
    this.isVisible = true;
    document.body.appendChild(this.backdrop);
    document.body.appendChild(this.dialog);
    this.renderList();
    requestAnimationFrame(() => {
      this.backdrop?.classList.add("visible");
      this.dialog?.classList.add("visible");
    });
    document.addEventListener("keydown", this._onKeyDown, true);
    document.addEventListener("editor:labels-changed", this._onLabelsChanged);
  }

  hide() {
    if (!this.isVisible) return;
    this.isVisible = false;
    document.removeEventListener("keydown", this._onKeyDown, true);
    document.removeEventListener("editor:labels-changed", this._onLabelsChanged);
    if (this.backdrop) this.backdrop.classList.remove("visible");
    if (this.dialog) this.dialog.classList.remove("visible");
    const backdrop = this.backdrop;
    const dialog = this.dialog;
    setTimeout(() => {
      backdrop?.remove();
      dialog?.remove();
    }, 300);
    this.backdrop = null;
    this.dialog = null;
    this.listEl = null;
    if (this.onCloseCb) {
      const cb = this.onCloseCb;
      this.onCloseCb = null;
      try {
        cb();
      } catch (e) {
        console.error(e);
      }
    }
  }

  // Undo/redo (and edits from other dialogs) re-render the list in place —
  // skipped while a name field is being edited so typing isn't interrupted.
  _onLabelsChanged = () => {
    if (this.listEl?.contains(document.activeElement)) return;
    this.renderList();
  };

  _onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      this.hide();
    }
  };

  // ─── DOM construction ───────────────────────────────────────────────

  createDialog() {
    this.backdrop = document.createElement("div");
    this.backdrop.className = "labels-dict-backdrop";
    this.backdrop.addEventListener("click", () => this.hide());

    this.dialog = document.createElement("div");
    this.dialog.className = "labels-dict-dialog";

    const blockEvents = [
      "mousedown",
      "mouseup",
      "click",
      "dblclick",
      "contextmenu",
      "wheel",
      "keydown",
      "keyup",
      "keypress",
    ];
    const stop = (e) => e.stopPropagation();
    blockEvents.forEach((ev) => {
      this.backdrop.addEventListener(ev, stop);
      this.dialog.addEventListener(ev, stop);
    });

    const header = document.createElement("div");
    header.className = "ld-header";
    const title = document.createElement("h3");
    title.className = "ld-title";
    title.textContent = "Manage Labels";
    header.appendChild(title);
    const closeBtn = document.createElement("button");
    closeBtn.className = "ld-close";
    closeBtn.type = "button";
    closeBtn.title = "Close";
    // Use the same `✕` glyph + sizing convention as projectDataDialog,
    // newProjectDialog, etc. — borderless square button with text X.
    closeBtn.innerHTML = "✕";
    closeBtn.addEventListener("click", () => this.hide());
    header.appendChild(closeBtn);

    const body = document.createElement("div");
    body.className = "ld-body";

    this.listEl = document.createElement("div");
    this.listEl.className = "ld-list";
    body.appendChild(this.listEl);

    // "Create new" row sits at the bottom — Enter creates the label and
    // pushes it into the list (auto-color via LabelsManager.createLabel).
    const createRow = document.createElement("div");
    createRow.className = "ld-create-row";
    const createInput = document.createElement("input");
    createInput.type = "text";
    createInput.className = "ld-create-input";
    createInput.placeholder = "New label name…";
    const createBtn = document.createElement("button");
    createBtn.className = "ld-create-btn";
    createBtn.type = "button";
    createBtn.textContent = "Create";
    const doCreate = () => {
      const lm = getLabelsManager();
      const name = createInput.value.trim();
      if (!name || !lm) return;
      lm.createLabel(name);
      createInput.value = "";
      createInput.focus();
      this.renderList();
    };
    createBtn.addEventListener("click", doCreate);
    createInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        doCreate();
      }
    });
    createRow.appendChild(createInput);
    createRow.appendChild(createBtn);
    body.appendChild(createRow);

    this.dialog.appendChild(header);
    this.dialog.appendChild(body);
  }

  // ─── List rendering ─────────────────────────────────────────────────

  renderList() {
    if (!this.listEl) return;
    const lm = getLabelsManager();
    this.listEl.innerHTML = "";
    if (!lm) return;
    const labels = lm.listLabels();
    if (labels.length === 0) {
      const empty = document.createElement("div");
      empty.className = "ld-empty";
      empty.textContent = "No labels yet. Create one below.";
      this.listEl.appendChild(empty);
      return;
    }
    for (const l of labels) {
      this.listEl.appendChild(this._buildRow(l));
    }
  }

  _buildRow(label) {
    const lm = getLabelsManager();
    const row = document.createElement("div");
    row.className = "ld-row";

    // Color swatch — clicking opens a transient ColorPicker popup anchored
    // to the swatch (same trick used by hierarchyPanel group chips). We
    // bypass ColorPicker.mount() by setting `picker.element = swatch` and
    // calling showPopup() directly; `showHexInput:false` is required when
    // bypassing mount (see colorPicker.js setValue line 251 quirk).
    const swatch = document.createElement("button");
    swatch.className = "ld-swatch";
    swatch.type = "button";
    swatch.style.background = label.color || "#888";
    swatch.title = "Click to change color";
    swatch.addEventListener("click", (e) => {
      e.stopPropagation();
      this._openColorPicker(label, swatch);
    });
    row.appendChild(swatch);

    // Inline editable name. Commit on Enter or blur; Escape reverts.
    const nameInput = document.createElement("input");
    nameInput.className = "ld-name";
    nameInput.type = "text";
    nameInput.value = label.name;
    let original = label.name;
    const commit = () => {
      const v = nameInput.value.trim();
      if (!v || v === original) {
        nameInput.value = original;
        return;
      }
      lm?.renameLabel(label.id, v);
      original = v;
      this.renderList();
    };
    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        nameInput.blur();
      } else if (e.key === "Escape") {
        e.preventDefault();
        nameInput.value = original;
        nameInput.blur();
      }
    });
    nameInput.addEventListener("blur", commit);
    row.appendChild(nameInput);

    // Variables — opens the schema editor for this label (its own dialog).
    const varCount = lm ? lm.getVars(label.id).length : 0;
    const varsBtn = document.createElement("button");
    varsBtn.className = "ld-vars";
    varsBtn.type = "button";
    varsBtn.title = "Edit this label's variables";
    varsBtn.textContent = `${varCount} var${varCount === 1 ? "" : "s"}`;
    varsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showLabelVarsDialog({
        labelId: label.id,
        onClose: () => this.renderList(),
      });
    });
    row.appendChild(varsBtn);

    // Delete button — confirms with a count of affected instances when > 0.
    const delBtn = document.createElement("button");
    delBtn.className = "ld-delete";
    delBtn.type = "button";
    delBtn.title = "Delete label";
    delBtn.innerHTML = Icons.Delete;
    delBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const count = this._countInstancesUsing(label.id);
      const proceed =
        count === 0
          ? true
          : await new Promise((resolve) => {
              showConfirmDialog({
                title: `Delete label "${label.name}"?`,
                message: `This label is currently applied to ${count} object${count === 1 ? "" : "s"}. It will be removed from all of them.`,
                confirmText: "Delete",
                cancelText: "Cancel",
                type: "danger",
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false),
              });
            });
      if (!proceed) return;
      lm?.deleteLabel(label.id);
      this.renderList();
    });
    row.appendChild(delBtn);

    return row;
  }

  _countInstancesUsing(labelId) {
    const sm = globalThis._editorScope?.stateManager;
    if (!sm) return 0;
    let n = 0;
    for (const meta of sm.instanceMeta.values()) {
      if (meta?.labels?.includes(labelId)) n++;
    }
    return n;
  }

  _openColorPicker(label, swatchEl) {
    const lm = getLabelsManager();
    const picker = new ColorPicker({
      label: "",
      initialColor: label.color || "#888888",
      showHexInput: false, // required when bypassing mount(); see colorPicker.js:251
      onChange: (hex) => {
        if (!hex) return;
        swatchEl.style.background = hex;
        lm?.setLabelColor(label.id, hex);
      },
    });
    // Anchor popup directly to swatch.
    picker.element = swatchEl;
    picker.showPopup();
  }

  // ─── Styles ─────────────────────────────────────────────────────────

  applyStyles() {
    if (document.getElementById("labels-dict-dialog-styles")) return;
    const style = document.createElement("style");
    style.id = "labels-dict-dialog-styles";
    // Z-index sits BELOW confirmDialog (3000) and ColorPicker popup
    // (10000) so cascade-delete confirms and color popups appear on top.
    style.textContent = `
      .labels-dict-backdrop {
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(4px);
        z-index: 1500;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }
      .labels-dict-backdrop.visible {
        opacity: 1;
        visibility: visible;
      }
      .labels-dict-dialog {
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        width: 460px;
        max-width: 92vw;
        max-height: 80vh;
        background: ${Theme.sidebarBackground};
        border: 1px solid ${Theme.borderPrimary};
        border-radius: 0;
        box-shadow: 0 12px 32px rgba(0,0,0,0.55);
        z-index: 1501;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 0.85rem;
        color: ${Theme.textPrimary};
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .labels-dict-dialog.visible {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
      /* Header EXACTLY matches inspector .sidebar-header: same padding,
         same font weight/size/letter-spacing/uppercase. */
      .labels-dict-dialog .ld-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 18px 20px 14px;
        background: ${Theme.primary};
        color: ${Theme.textPrimary};
      }
      .labels-dict-dialog .ld-title {
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: ${Theme.textPrimary};
      }
      /* Close button matches projectDataDialog/newProjectDialog convention:
         borderless 36×36 square, large text glyph, hover = subtle bg. */
      .labels-dict-dialog .ld-close {
        background: transparent;
        border: none;
        color: ${Theme.textPrimary};
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        width: 36px;
        height: 36px;
        border-radius: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        padding: 0;
      }
      .labels-dict-dialog .ld-close:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: scale(1.1);
      }
      .labels-dict-dialog .ld-body {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .labels-dict-dialog .ld-list {
        flex: 1 1 auto;
        overflow-y: auto;
        padding: 6px 0;
      }
      .labels-dict-dialog .ld-empty {
        padding: 24px 14px;
        text-align: center;
        color: ${Theme.textMuted};
        font-style: italic;
      }
      .labels-dict-dialog .ld-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 5px 14px;
        border-left: 3px solid transparent;
      }
      .labels-dict-dialog .ld-row:hover {
        background: ${Theme.componentHoverBackground};
        border-left-color: ${Theme.primary};
      }
      .labels-dict-dialog .ld-swatch {
        width: 16px;
        height: 16px;
        border-radius: 2px;
        border: 1px solid ${Theme.borderSecondary};
        flex: 0 0 16px;
        cursor: pointer;
        padding: 0;
      }
      .labels-dict-dialog .ld-name {
        flex: 1 1 auto;
        background: transparent;
        border: 1px solid transparent;
        color: ${Theme.textPrimary};
        font-size: 0.85rem;
        padding: 4px 6px;
        border-radius: 2px;
        outline: none;
      }
      .labels-dict-dialog .ld-name:hover {
        border-color: ${Theme.borderSecondary};
      }
      .labels-dict-dialog .ld-name:focus {
        border-color: ${Theme.borderFocus};
        background: ${Theme.inputBackground};
      }
      .labels-dict-dialog .ld-vars {
        flex: 0 0 auto;
        background: transparent;
        border: 1px solid ${Theme.borderSecondary};
        color: ${Theme.textMuted};
        font-size: 0.72rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 3px 8px;
        border-radius: 2px;
        cursor: pointer;
        white-space: nowrap;
      }
      .labels-dict-dialog .ld-vars:hover {
        color: ${Theme.textPrimary};
        border-color: ${Theme.primary};
      }
      .labels-dict-dialog .ld-delete {
        background: transparent;
        border: 1px solid transparent;
        color: ${Theme.textMuted};
        cursor: pointer;
        padding: 3px;
        border-radius: 2px;
        width: 22px;
        height: 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .labels-dict-dialog .ld-delete:hover {
        color: ${Theme.error};
        border-color: ${Theme.error};
        background: ${Theme.componentErrorBackground};
      }
      .labels-dict-dialog .ld-delete svg {
        width: 14px;
        height: 14px;
        display: block;
      }
      .labels-dict-dialog .ld-create-row {
        display: flex;
        gap: 8px;
        padding: 12px 14px;
        border-top: 1px solid ${Theme.borderPrimary};
        background: ${Theme.componentBackground};
      }
      .labels-dict-dialog .ld-create-input {
        flex: 1 1 auto;
        background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderSecondary};
        color: ${Theme.textPrimary};
        font-size: 0.85rem;
        padding: 6px 8px;
        border-radius: 2px;
        outline: none;
      }
      .labels-dict-dialog .ld-create-input:focus {
        border-color: ${Theme.borderFocus};
      }
      .labels-dict-dialog .ld-create-btn {
        background: ${Theme.primary};
        color: ${Theme.textPrimary};
        border: none;
        padding: 6px 16px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-radius: 2px;
        cursor: pointer;
      }
      .labels-dict-dialog .ld-create-btn:hover {
        background: ${Theme.primaryHover};
      }
    `;
    document.head.appendChild(style);
  }
}

let _instance = null;
export function showLabelsDictionaryDialog(opts = {}) {
  if (!_instance) _instance = new LabelsDictionaryDialog();
  _instance.show(opts);
}
