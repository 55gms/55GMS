// MaterialsDialog
// ─────────────────────────────────────────────────────────────────────────
// Modal for managing the project's custom material library:
//   - list custom materials (cube thumbnail + name), select to edit
//   - edit: per-face textures (6 faces), zTilingFactor, transparent flag,
//     ground/sound type + wallrun/wallclimb meta, with a live cube preview
//   - create new / duplicate a built-in into an editable custom material
//   - delete (project-wide in-use warning + confirm; NOT undoable)
//   - built-in materials shown read-only for reference (duplicate-only)
//
// All mutations route through MaterialsManager (persists to per-project
// sharedData). The manager dispatches "editor:materials-changed" on every
// mutation so the inspector material selector refreshes itself.
//
// Z-index policy mirrors labelsDictionaryDialog: backdrop/dialog at 1500/1501,
// BELOW confirmDialog (3000), so delete confirms layer on top. The texture
// picker popup is a child of the dialog (so it inherits the stacking context)
// and sits just above the dialog content.
//
// Visual design mirrors the inspector sidebar / labels dialog (dark bg,
// primary accent, uppercase title, small monochrome icon buttons).

import { Theme } from "../inspectorUI.js";
import {
  getMaterialsManager,
  makeDefaultMaterialData,
} from "./materialsManager.js";
import {
  materials,
  GROUND_TYPES,
  SOUND_TYPES,
  FACE_USER_TO_STORAGE,
} from "../objectTypeDefinitions.js";
import {
  getImageFromObject,
  createCSSCube,
  loadCubeFaces,
} from "../imageHelper.js";
import { TEXTURES, textureLabel } from "../textureList.js";
import { showConfirmDialog } from "../confirmDialog.js";
import { getNotifications } from "../notifications.js";
import * as Icons from "../iconList.js";

// Faces shown in the editor, by USER-FACING (Z-up) name. Each maps to its C3
// storage face via FACE_USER_TO_STORAGE — the stored data keeps C3's names.
const FACE_ORDER = ["top", "front", "back", "left", "right", "bottom"];

// Build the cube-preview descriptor for a material data object. Matches the
// face remap used by the inspector material selector (objectTypeDefinitions
// buildMaterialOption) so the preview here looks identical to the selector.
function cubeConfigFor(m) {
  return {
    top: () => getImageFromObject(m.front?.objectType),
    left: () => getImageFromObject(m.top?.objectType),
    right: () => getImageFromObject(m.bottom?.objectType),
    front: () => getImageFromObject(m.left?.objectType),
    back: () => getImageFromObject(m.right?.objectType),
    bottom: () => getImageFromObject(m.back?.objectType),
    height: m.cubeHeightRatio || 1,
    depth: m.cubeDepthRatio || 1,
    topVisibility: m.cubeTopVisibility || 0,
  };
}

// Build a small cube DOM node for a material (async — images load on demand).
async function buildCubeNode(m, size = 44) {
  const cfg = cubeConfigFor(m);
  const faces = await loadCubeFaces(cfg);
  return createCSSCube(
    faces.top,
    faces.left,
    faces.right,
    size,
    cfg.height,
    faces.front,
    faces.back,
    faces.bottom,
    cfg.depth,
    cfg.topVisibility,
  );
}

class MaterialsDialog {
  constructor() {
    this.backdrop = null;
    this.dialog = null;
    this.listEl = null;
    this.editorEl = null;
    this.isVisible = false;
    this.selectedId = null;
    this.onCloseCb = null;
    this._texPopup = null;
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────

  show({ onClose, selectMaterialId } = {}) {
    if (this.isVisible) return;
    this.onCloseCb = typeof onClose === "function" ? onClose : null;
    this.applyStyles();
    this.createDialog();
    this.isVisible = true;
    document.body.appendChild(this.backdrop);
    document.body.appendChild(this.dialog);
    // Prefer the requested material (e.g. the inspector's current selection,
    // built-in or custom). Otherwise fall back to the first custom material so
    // the editor isn't empty.
    const mgr = getMaterialsManager();
    const exists =
      selectMaterialId &&
      (!!materials[selectMaterialId] || !!mgr?.getMaterial?.(selectMaterialId));
    if (exists) {
      this.selectedId = selectMaterialId;
    } else {
      const first = mgr?.listMaterials?.()[0];
      this.selectedId = first ? first.value : null;
    }
    this.renderList();
    this.renderEditor();
    // Bring the pre-selected row into view (it may be among the built-ins).
    this.listEl
      ?.querySelector(".mm-row.selected")
      ?.scrollIntoView?.({ block: "nearest" });
    requestAnimationFrame(() => {
      this.backdrop?.classList.add("visible");
      this.dialog?.classList.add("visible");
    });
    document.addEventListener("keydown", this._onKeyDown, true);
  }

  hide() {
    if (!this.isVisible) return;
    this.isVisible = false;
    this._closeTexPopup();
    document.removeEventListener("keydown", this._onKeyDown, true);
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
    this.editorEl = null;
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

  _onKeyDown = (e) => {
    if (e.key === "Escape") {
      if (this._texPopup) {
        e.preventDefault();
        e.stopPropagation();
        this._closeTexPopup();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      this.hide();
    }
  };

  // ─── DOM construction ───────────────────────────────────────────────

  createDialog() {
    this.backdrop = document.createElement("div");
    this.backdrop.className = "mm-backdrop";
    this.backdrop.addEventListener("click", () => this.hide());

    this.dialog = document.createElement("div");
    this.dialog.className = "mm-dialog";

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
    header.className = "mm-header";
    const title = document.createElement("h3");
    title.className = "mm-title";
    title.textContent = "Materials Manager";
    header.appendChild(title);
    const closeBtn = document.createElement("button");
    closeBtn.className = "mm-close";
    closeBtn.type = "button";
    closeBtn.title = "Close";
    closeBtn.innerHTML = "✕";
    closeBtn.addEventListener("click", () => this.hide());
    header.appendChild(closeBtn);

    const body = document.createElement("div");
    body.className = "mm-body";

    this.listEl = document.createElement("div");
    this.listEl.className = "mm-list";
    body.appendChild(this.listEl);

    this.editorEl = document.createElement("div");
    this.editorEl.className = "mm-editor";
    body.appendChild(this.editorEl);

    this.dialog.appendChild(header);
    this.dialog.appendChild(body);
  }

  // ─── List rendering ─────────────────────────────────────────────────

  renderList() {
    if (!this.listEl) return;
    const mgr = getMaterialsManager();
    this.listEl.innerHTML = "";

    const hasProject =
      !!globalThis._editorScope?.projectManager?.hasProjectLoaded?.();
    if (!hasProject) {
      const note = document.createElement("div");
      note.className = "mm-empty";
      note.textContent = "Open a project to manage custom materials.";
      this.listEl.appendChild(note);
      return;
    }

    // ── Custom materials ─────────────────────────────────────────────
    const customHeader = document.createElement("div");
    customHeader.className = "mm-list-section";
    customHeader.textContent = "Custom";
    this.listEl.appendChild(customHeader);

    const custom = mgr ? mgr.listMaterials() : [];
    if (custom.length === 0) {
      const empty = document.createElement("div");
      empty.className = "mm-empty";
      empty.textContent = "No custom materials yet.";
      this.listEl.appendChild(empty);
    } else {
      for (const m of custom) {
        this.listEl.appendChild(this._buildRow(m, false));
      }
    }

    const newBtn = document.createElement("button");
    newBtn.className = "mm-new-btn";
    newBtn.type = "button";
    newBtn.textContent = "+ New Material";
    newBtn.addEventListener("click", () => {
      const created = mgr?.createMaterial("New Material");
      if (created) {
        this.selectedId = created.value;
        this.renderList();
        this.renderEditor();
      }
    });
    this.listEl.appendChild(newBtn);

    // ── Built-in materials (read-only, duplicate-to-edit) ────────────
    const builtinHeader = document.createElement("div");
    builtinHeader.className = "mm-list-section";
    builtinHeader.textContent = "Built-in (read-only)";
    this.listEl.appendChild(builtinHeader);
    for (const m of Object.values(materials)) {
      this.listEl.appendChild(this._buildRow(m, true));
    }
  }

  _buildRow(m, isBuiltin) {
    const row = document.createElement("div");
    row.className = "mm-row";
    if (m.value === this.selectedId) row.classList.add("selected");

    const thumb = document.createElement("div");
    thumb.className = "mm-thumb";
    buildCubeNode(m, 28)
      .then((node) => {
        if (thumb.isConnected) thumb.appendChild(node);
      })
      .catch(() => {});
    row.appendChild(thumb);

    const name = document.createElement("span");
    name.className = "mm-row-name";
    name.textContent = m.label || m.value;
    row.appendChild(name);

    // Both built-in and custom rows are selectable. Built-ins open a read-only
    // detail pane (big preview + Clone); custom rows open the editor.
    row.addEventListener("click", () => {
      this.selectedId = m.value;
      this.renderList();
      this.renderEditor();
    });

    // Clone any material (built-in or custom) straight from the list.
    const cloneBtn = document.createElement("button");
    cloneBtn.className = "mm-row-icon";
    cloneBtn.type = "button";
    cloneBtn.title = "Clone into a new material";
    cloneBtn.innerHTML = Icons.Copy;
    cloneBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this._clone(m);
    });
    row.appendChild(cloneBtn);

    if (!isBuiltin) {
      const delBtn = document.createElement("button");
      delBtn.className = "mm-row-icon mm-row-del";
      delBtn.type = "button";
      delBtn.title = "Delete material";
      delBtn.innerHTML = Icons.Delete;
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this._deleteMaterial(m);
      });
      row.appendChild(delBtn);
    }

    return row;
  }

  async _deleteMaterial(m) {
    const mgr = getMaterialsManager();
    if (!mgr) return;
    const usage = mgr.findUsage(m.value);
    let proceed = true;
    if (usage.total > 0) {
      const levelCount = usage.otherLevels.length + (usage.open.length ? 1 : 0);
      proceed = await new Promise((resolve) => {
        showConfirmDialog({
          title: `Delete material "${m.label}"?`,
          message:
            `This material is used by ${usage.total} object` +
            `${usage.total === 1 ? "" : "s"}` +
            (levelCount > 1 ? ` across ${levelCount} levels` : "") +
            `. These objects will have a missing material. This cannot be undone.`,
          confirmText: "Delete",
          cancelText: "Cancel",
          type: "danger",
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });
    }
    if (!proceed) return;

    // Deliberately NOT reassigning users to the default material: instances
    // (and label variables) keep the dangling id so the inspector shows
    // "Missing" and the validator errors, while rendering falls back to the
    // default material (applyMaterialToInstance).
    mgr.deleteMaterial(m.value);
    if (this.selectedId === m.value) this.selectedId = null;
    getNotifications()?.warning(`Material "${m.label}" deleted`);
    // Re-select the first remaining custom material for convenience.
    if (!this.selectedId) {
      const first = mgr.listMaterials()[0];
      this.selectedId = first ? first.value : null;
    }
    this.renderList();
    this.renderEditor();
  }

  // ─── Editor pane ────────────────────────────────────────────────────

  _isBuiltin(id) {
    return !!materials[id];
  }

  // Selected material data (built-in OR custom).
  _selectedData() {
    if (!this.selectedId) return null;
    if (materials[this.selectedId]) return materials[this.selectedId];
    return getMaterialsManager()?.getMaterial(this.selectedId) || null;
  }

  renderEditor() {
    if (!this.editorEl) return;
    this._closeTexPopup();
    this.editorEl.innerHTML = "";
    const data = this._selectedData();
    if (!data) {
      const placeholder = document.createElement("div");
      placeholder.className = "mm-editor-empty";
      placeholder.textContent =
        "Select a material to preview, or create a new one to edit.";
      this.editorEl.appendChild(placeholder);
      return;
    }
    if (this._isBuiltin(this.selectedId)) this._renderBuiltinDetail(data);
    else this._renderCustomEditor(data);
  }

  // Read-only detail for a built-in material: large preview + Clone-to-custom.
  _renderBuiltinDetail(m) {
    const wrap = document.createElement("div");
    wrap.className = "mm-builtin-detail";

    const big = document.createElement("div");
    big.className = "mm-preview mm-preview-big";
    buildCubeNode(m, 150)
      .then((node) => {
        if (big.isConnected) big.appendChild(node);
      })
      .catch(() => {});
    wrap.appendChild(big);

    const name = document.createElement("div");
    name.className = "mm-builtin-name";
    name.textContent = m.label || m.value;
    wrap.appendChild(name);

    const note = document.createElement("div");
    note.className = "mm-builtin-note";
    note.textContent =
      "Built-in material — read-only. Clone it to make an editable copy.";
    wrap.appendChild(note);

    const cloneBtn = document.createElement("button");
    cloneBtn.className = "mm-clone-btn";
    cloneBtn.type = "button";
    cloneBtn.textContent = "Clone";
    cloneBtn.addEventListener("click", () => this._clone(m));
    wrap.appendChild(cloneBtn);

    this.editorEl.appendChild(wrap);
  }

  // Editor for a custom material.
  _renderCustomEditor(m) {
    // Name row.
    const nameRow = document.createElement("div");
    nameRow.className = "mm-field mm-name-row";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "mm-name-input";
    nameInput.value = m.label || "";
    let original = m.label || "";
    const commitName = () => {
      const v = nameInput.value.trim();
      if (!v || v === original) {
        nameInput.value = original;
        return;
      }
      getMaterialsManager()?.updateMaterial(m.value, { label: v });
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
    nameInput.addEventListener("blur", commitName);
    nameRow.appendChild(nameInput);
    this.editorEl.appendChild(nameRow);

    // Preview + faces.
    const top = document.createElement("div");
    top.className = "mm-editor-top";

    this._previewEl = document.createElement("div");
    this._previewEl.className = "mm-preview";
    top.appendChild(this._previewEl);
    this._renderPreview();

    const faceGrid = document.createElement("div");
    faceGrid.className = "mm-face-grid";
    for (const face of FACE_ORDER) {
      faceGrid.appendChild(this._buildFaceButton(m, face));
    }
    top.appendChild(faceGrid);
    this.editorEl.appendChild(top);

    // Meta fields — two per row so everything fits without scrolling. Order is
    // column-major: Ground Type above Sound Type (left), Wall-runnable above
    // Wall-climbable (right).
    const grid = document.createElement("div");
    grid.className = "mm-meta-grid";
    grid.appendChild(
      this._buildSelectField(
        "Ground Type",
        Object.values(GROUND_TYPES),
        m.meta?.groundType ?? GROUND_TYPES.default.value,
        (v) => this._updateMeta(m, { groundType: v }),
      ),
    );
    grid.appendChild(
      this._buildCheckboxField(
        "Wall-runnable",
        m.meta?.isWallrunable ?? true,
        (checked) => this._updateMeta(m, { isWallrunable: checked }),
      ),
    );
    grid.appendChild(
      this._buildSelectField(
        "Sound Type",
        Object.values(SOUND_TYPES),
        m.meta?.soundType ?? SOUND_TYPES.default.value,
        (v) => this._updateMeta(m, { soundType: v }),
      ),
    );
    grid.appendChild(
      this._buildCheckboxField(
        "Wall-climbable",
        m.meta?.isWallClimbable ?? true,
        (checked) => this._updateMeta(m, { isWallClimbable: checked }),
      ),
    );
    this.editorEl.appendChild(grid);

    // Preview-cube tuning — shapes the little cube icon in the selector/preview
    // only; these do NOT change the placed block (applyMaterialToInstance never
    // reads them). Stored top-level like the built-ins (objectTypeDefinitions).
    const cubeTitle = document.createElement("div");
    cubeTitle.className = "mm-section-title";
    cubeTitle.textContent = "Preview Cube";
    this.editorEl.appendChild(cubeTitle);

    const cubeGrid = document.createElement("div");
    cubeGrid.className = "mm-meta-grid";
    // Live-preview on input (no persistence/instance churn); commit persists +
    // refreshes the list thumbnails.
    const cubeField = (label, key, value, opts) =>
      this._buildNumberField(
        label,
        value,
        opts,
        (v) => this._renderPreview({ [key]: v }),
        (v) => {
          getMaterialsManager()?.updateMaterial(m.value, { [key]: v });
          this._renderPreview();
          this.renderList();
        },
      );
    cubeGrid.appendChild(
      cubeField("Height Ratio", "cubeHeightRatio", m.cubeHeightRatio ?? 1, {
        min: 0.1,
        max: 1.5,
        step: 0.05,
      }),
    );
    cubeGrid.appendChild(
      cubeField("Depth Ratio", "cubeDepthRatio", m.cubeDepthRatio ?? 1, {
        min: 0.1,
        max: 1.5,
        step: 0.05,
      }),
    );
    cubeGrid.appendChild(
      cubeField(
        "Top Visibility",
        "cubeTopVisibility",
        m.cubeTopVisibility ?? 0,
        {
          min: -110,
          max: 70,
          step: 1,
        },
      ),
    );
    this.editorEl.appendChild(cubeGrid);
  }

  // Fork a material (built-in or custom) into a new editable custom material.
  _clone(m) {
    const mgr = getMaterialsManager();
    const { value, label, ...rest } = m;
    const created = mgr?.createMaterial(`${label || value} Copy`, rest);
    if (created) {
      this.selectedId = created.value;
      this.renderList();
      this.renderEditor();
    }
  }

  _updateMeta(m, patch) {
    const cur = this._selectedData() || m;
    getMaterialsManager()?.updateMaterial(m.value, {
      meta: { ...(cur.meta || {}), ...patch },
    });
  }

  async _renderPreview(overrides) {
    const base = this._selectedData();
    if (!base || !this._previewEl) return;
    // `overrides` lets live edits (e.g. cube ratios being typed) preview without
    // persisting to the material yet.
    const m = overrides ? { ...base, ...overrides } : base;
    this._previewEl.innerHTML = "";
    try {
      const node = await buildCubeNode(m, 88);
      if (this._previewEl.isConnected) this._previewEl.appendChild(node);
    } catch {
      /* ignore preview failures */
    }
  }

  // `userFace` is the Z-up name shown to the user; it maps to a C3 storage face.
  _buildFaceButton(m, userFace) {
    const storage = FACE_USER_TO_STORAGE[userFace];
    const wrap = document.createElement("button");
    wrap.type = "button";
    wrap.className = `mm-face mm-face-${userFace}`;
    wrap.title = `${userFace} face`;

    const label = document.createElement("span");
    label.className = "mm-face-label";
    label.textContent = userFace;
    wrap.appendChild(label);

    const objectType = m[storage]?.objectType;
    if (objectType) {
      getImageFromObject(objectType)
        .then((src) => {
          if (src && wrap.isConnected)
            wrap.style.backgroundImage = `url(${src})`;
        })
        .catch(() => {});
    }

    wrap.addEventListener("click", (e) => {
      e.stopPropagation();
      this._openTexPopup(m, userFace, wrap);
    });
    return wrap;
  }

  // ─── Texture picker popup ───────────────────────────────────────────

  _openTexPopup(m, userFace, anchorEl) {
    this._closeTexPopup();
    const storage = FACE_USER_TO_STORAGE[userFace];
    const popup = document.createElement("div");
    popup.className = "mm-tex-popup";
    this._texPopup = popup;

    const grid = document.createElement("div");
    grid.className = "mm-tex-grid";
    for (const tex of TEXTURES) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "mm-tex-cell";
      cell.title = textureLabel(tex);
      if (m[storage]?.objectType === tex) cell.classList.add("selected");
      getImageFromObject(tex)
        .then((src) => {
          if (src && cell.isConnected)
            cell.style.backgroundImage = `url(${src})`;
        })
        .catch(() => {});
      cell.addEventListener("click", (e) => {
        e.stopPropagation();
        getMaterialsManager()?.updateMaterial(m.value, {
          [storage]: { objectType: tex },
        });
        this._closeTexPopup();
        // Reflect the change live without losing the editor's other inputs.
        this.renderEditor();
        this.renderList();
      });
      grid.appendChild(cell);
    }
    popup.appendChild(grid);

    // Position near the anchored face button, clamped into the dialog.
    this.dialog.appendChild(popup);
    const a = anchorEl.getBoundingClientRect();
    const d = this.dialog.getBoundingClientRect();
    const popupW = popup.offsetWidth || 300;
    const popupH = popup.offsetHeight || 280;
    let left = a.left - d.left;
    left = Math.max(8, Math.min(left, d.width - popupW - 8));
    // Prefer below the anchor; flip above when there isn't room, then clamp
    // into the dialog so the (now taller) list is never cut off.
    const below = a.bottom - d.top + 4;
    const above = a.top - d.top - popupH - 4;
    let topPx = below;
    if (below + popupH > d.height - 8 && above >= 8) {
      topPx = above;
    }
    topPx = Math.max(8, Math.min(topPx, d.height - popupH - 8));
    popup.style.left = `${left}px`;
    popup.style.top = `${topPx}px`;

    // Close on outside click (next tick so this click doesn't immediately fire).
    setTimeout(() => {
      this._texOutside = (ev) => {
        if (this._texPopup && !this._texPopup.contains(ev.target)) {
          this._closeTexPopup();
        }
      };
      document.addEventListener("mousedown", this._texOutside, true);
    }, 0);
  }

  _closeTexPopup() {
    if (this._texOutside) {
      document.removeEventListener("mousedown", this._texOutside, true);
      this._texOutside = null;
    }
    if (this._texPopup) {
      this._texPopup.remove();
      this._texPopup = null;
    }
  }

  // ─── Field builders ─────────────────────────────────────────────────

  _buildCheckboxField(labelText, checked, onChange) {
    const field = document.createElement("div");
    field.className = "mm-field mm-field-check";
    const label = document.createElement("label");
    label.className = "mm-field-label";
    label.textContent = labelText;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "mm-field-checkbox";
    input.checked = checked;
    input.addEventListener("change", () => onChange(input.checked));
    field.appendChild(label);
    field.appendChild(input);
    return field;
  }

  // Number input. `onLive` fires on every keystroke (for live preview);
  // `onCommit` fires on blur/enter/spinner with the clamped value (to persist).
  _buildNumberField(
    labelText,
    value,
    { min, max, step } = {},
    onLive,
    onCommit,
  ) {
    const field = document.createElement("div");
    field.className = "mm-field";
    const label = document.createElement("label");
    label.className = "mm-field-label";
    label.textContent = labelText;
    field.appendChild(label);
    const input = document.createElement("input");
    input.type = "number";
    input.className = "mm-field-input";
    if (min != null) input.min = String(min);
    if (max != null) input.max = String(max);
    if (step != null) input.step = String(step);
    input.value = String(value);
    const clamp = (v) => {
      if (min != null) v = Math.max(min, v);
      if (max != null) v = Math.min(max, v);
      return v;
    };
    input.addEventListener("input", () => {
      const v = parseFloat(input.value);
      if (Number.isFinite(v)) onLive?.(clamp(v));
    });
    input.addEventListener("change", () => {
      let v = parseFloat(input.value);
      if (!Number.isFinite(v)) v = value;
      v = clamp(v);
      input.value = String(v);
      onCommit?.(v);
    });
    field.appendChild(input);
    return field;
  }

  _buildSelectField(labelText, options, value, onChange) {
    const field = document.createElement("div");
    field.className = "mm-field";
    const label = document.createElement("label");
    label.className = "mm-field-label";
    label.textContent = labelText;
    field.appendChild(label);
    const select = document.createElement("select");
    select.className = "mm-field-input";
    for (const opt of options) {
      const o = document.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;
      if (opt.value === value) o.selected = true;
      select.appendChild(o);
    }
    select.addEventListener("change", () => onChange(select.value));
    field.appendChild(select);
    return field;
  }

  // ─── Styles ─────────────────────────────────────────────────────────

  applyStyles() {
    if (document.getElementById("materials-dialog-styles")) return;
    const style = document.createElement("style");
    style.id = "materials-dialog-styles";
    style.textContent = `
      .mm-backdrop {
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(4px);
        z-index: 1500;
        opacity: 0; visibility: hidden;
        transition: all 0.3s ease;
      }
      .mm-backdrop.visible { opacity: 1; visibility: visible; }
      .mm-dialog {
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        width: 760px; max-width: 94vw;
        height: 560px; max-height: 86vh;
        background: ${Theme.sidebarBackground};
        border: 1px solid ${Theme.borderPrimary};
        box-shadow: 0 12px 32px rgba(0,0,0,0.55);
        z-index: 1501;
        display: flex; flex-direction: column;
        overflow: hidden;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 0.85rem;
        color: ${Theme.textPrimary};
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .mm-dialog.visible { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      /* Square corners on every button in the dialog. */
      .mm-dialog button { border-radius: 0; }
      .mm-header {
        display: flex; align-items: center; justify-content: space-between;
        gap: 8px; padding: 18px 20px 14px;
        background: ${Theme.primary}; color: ${Theme.textPrimary};
        flex: 0 0 auto;
      }
      .mm-title {
        margin: 0; font-size: 1.2rem; font-weight: 700;
        text-transform: uppercase; letter-spacing: 1px;
      }
      .mm-close {
        background: transparent; border: none; color: ${Theme.textPrimary};
        font-size: 20px; font-weight: bold; cursor: pointer;
        width: 36px; height: 36px; display: flex; align-items: center;
        justify-content: center; transition: all 0.2s ease; padding: 0;
      }
      .mm-close:hover { background: rgba(255,255,255,0.1); transform: scale(1.1); }
      .mm-body { flex: 1 1 auto; display: flex; overflow: hidden; min-height: 0; }
      .mm-list {
        flex: 0 0 240px; overflow-y: auto;
        border-right: 1px solid ${Theme.borderPrimary};
        padding: 6px 0;
      }
      .mm-list-section {
        padding: 10px 14px 4px; font-size: 0.7rem; font-weight: 700;
        text-transform: uppercase; letter-spacing: 0.6px;
        color: ${Theme.textMuted};
      }
      .mm-empty {
        padding: 10px 14px; color: ${Theme.textMuted}; font-style: italic;
        font-size: 0.8rem;
      }
      .mm-row {
        display: flex; align-items: center; gap: 8px;
        padding: 5px 12px; cursor: pointer;
        border-left: 3px solid transparent;
      }
      .mm-row:hover { background: ${Theme.componentHoverBackground}; }
      .mm-row.selected {
        background: ${Theme.componentHoverBackground};
        border-left-color: ${Theme.primary};
      }
      .mm-thumb {
        width: 30px; height: 30px; flex: 0 0 40px;
        display: flex; align-items: center; justify-content: center;
      }
      .mm-row-name { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .mm-row-icon {
        background: transparent; border: 1px solid transparent;
        color: ${Theme.textMuted}; cursor: pointer; padding: 3px;
        width: 22px; height: 22px; display: inline-flex;
        align-items: center; justify-content: center; flex: 0 0 auto;
        opacity: 0;
      }
      .mm-row:hover .mm-row-icon,
      .mm-row.selected .mm-row-icon { opacity: 1; }
      .mm-row-icon:hover { color: ${Theme.textPrimary}; border-color: ${Theme.primary}; }
      .mm-row-del:hover { color: ${Theme.error}; border-color: ${Theme.error}; }
      .mm-row-icon svg { width: 14px; height: 14px; display: block; }
      .mm-new-btn {
        display: block; width: calc(100% - 24px); margin: 8px 12px;
        background: ${Theme.primary}; color: ${Theme.textPrimary};
        border: none; padding: 7px; font-size: 0.8rem; font-weight: 600;
        text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer;
      }
      .mm-new-btn:hover { background: ${Theme.primaryHover}; }
      .mm-editor {
        flex: 1 1 auto; overflow-y: auto; padding: 14px 18px;
        position: relative;
      }
      .mm-editor-empty {
        padding: 40px 14px; text-align: center; color: ${Theme.textMuted};
        font-style: italic;
      }
      .mm-name-row { margin-bottom: 12px; }
      .mm-name-input {
        width: 100%; background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderSecondary}; color: ${Theme.textPrimary};
        font-size: 1rem; font-weight: 600; padding: 8px 10px;
        border-radius: 2px; outline: none;
      }
      .mm-name-input:focus { border-color: ${Theme.borderFocus}; }
      .mm-editor-top { display: flex; gap: 18px; margin-bottom: 16px; align-items: flex-start; }
      .mm-preview {
        flex: 0 0 110px; height: 110px;
        display: flex; align-items: center; justify-content: center;
      }
      .mm-face-grid {
        flex: 1 1 auto; display: grid;
        grid-template-columns: repeat(3, 1fr); gap: 6px;
      }
      .mm-face {
        position: relative; aspect-ratio: 1 / 1;
        background-size: cover; background-position: center;
        background-color: ${Theme.componentBackground};
        border: 1px solid ${Theme.borderSecondary}; cursor: pointer;
        min-height: 40px;
      }
      .mm-face:hover { border-color: ${Theme.primary}; }
      .mm-face-label {
        position: absolute; left: 0; bottom: 0; right: 0;
        font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.4px;
        background: rgba(0,0,0,0.55); color: #fff; text-align: center;
        padding: 1px 0;
      }
      .mm-field {
        display: flex; align-items: center; justify-content: space-between;
        gap: 10px; padding: 6px 0;
        border-bottom: 1px solid ${Theme.borderPrimary};
      }
      .mm-field-label { color: ${Theme.textSecondary || Theme.textMuted}; }
      .mm-field-input {
        flex: 0 0 130px; background: ${Theme.inputBackground};
        border: 1px solid ${Theme.borderSecondary}; color: ${Theme.textPrimary};
        padding: 5px 8px; border-radius: 2px; outline: none;
      }
      .mm-field-input:focus { border-color: ${Theme.borderFocus}; }
      .mm-field-checkbox { width: 16px; height: 16px; cursor: pointer; }
      /* Meta fields laid out two per row to keep the editor short. */
      .mm-meta-grid {
        display: grid; grid-template-columns: 1fr 1fr;
        gap: 0 16px; margin-top: 8px;
      }
      .mm-meta-grid .mm-field { border-bottom: none; padding: 5px 0; }
      .mm-meta-grid .mm-field-input { flex: 0 0 96px; }
      /* Section header inside the editor pane (e.g. "Preview Cube"). */
      .mm-section-title {
        margin-top: 14px; padding-top: 10px;
        border-top: 1px solid ${Theme.borderPrimary};
        font-size: 0.7rem; font-weight: 700;
        text-transform: uppercase; letter-spacing: 0.6px;
        color: ${Theme.textMuted};
      }
      /* Built-in read-only detail pane (big preview + Clone). */
      .mm-builtin-detail {
        display: flex; flex-direction: column; align-items: center;
        justify-content: center; gap: 16px; height: 100%;
        text-align: center; padding: 20px;
      }
      /* Extra space below the preview: the cube rotates and its corners can
         otherwise sweep over the name. */
      .mm-preview-big { width: 170px; height: 170px; flex: 0 0 auto; margin-bottom: 24px; }
      .mm-builtin-name { font-size: 1.1rem; font-weight: 600; }
      .mm-builtin-note {
        font-size: 0.8rem; color: ${Theme.textMuted}; max-width: 280px;
        line-height: 1.4;
      }
      .mm-clone-btn {
        background: ${Theme.primary}; color: ${Theme.textPrimary}; border: none;
        padding: 8px 28px; font-size: 0.85rem; font-weight: 600;
        text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer;
      }
      .mm-clone-btn:hover { background: ${Theme.primaryHover}; }
      .mm-tex-popup {
        position: absolute; z-index: 1600;
        background: ${Theme.sidebarBackground};
        border: 1px solid ${Theme.borderPrimary};
        box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        padding: 8px; width: 300px; max-height: 300px; overflow-y: auto;
      }
      .mm-tex-grid {
        display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px;
      }
      .mm-tex-cell {
        aspect-ratio: 1 / 1; background-size: cover; background-position: center;
        background-color: ${Theme.componentBackground};
        border: 1px solid ${Theme.borderSecondary}; cursor: pointer; padding: 0;
      }
      .mm-tex-cell:hover { border-color: ${Theme.primary}; }
      .mm-tex-cell.selected { border-color: ${Theme.primary}; box-shadow: 0 0 0 1px ${Theme.primary}; }
    `;
    document.head.appendChild(style);
  }
}

let _instance = null;
export function showMaterialsDialog(opts = {}) {
  if (!_instance) _instance = new MaterialsDialog();
  _instance.show(opts);
}
