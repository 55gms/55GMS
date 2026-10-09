// LabelVarsDialog + LabelVarEditDialog
// ─────────────────────────────────────────────────────────────────────────
// Two modals for ONE label's variable schema (`label.vars`, labelVarTypes.js):
//
//   LabelVarsDialog   — the list. One row per variable (drag handle, name,
//                       type, edit, delete). Rows reorder by drag and drop
//                       (same top/bottom drop-line convention as the hierarchy
//                       panel). "Add variable" opens the editor.
//   LabelVarEditDialog — add / edit a single variable: name, type, default
//                       (the inspector widget for that type), dropdown options,
//                       number range. Nothing is written until Save, so an
//                       edit is exactly one undo entry.
//
// Both route every mutation through labelsManager (undo descriptions,
// `editor:labels-changed`). The editor dialog carries the `inspector-widgets`
// class so the inspector component styles (scoped to that class) apply.
//
// Z-index: list 1600/1601 (above the labels dictionary at 1500/1501), editor
// 1700/1701; both below confirmDialog (3000) and the ColorPicker popup (10000).

import { Theme, ComponentFactory } from "../inspectorUI.js";
import { getLabelsManager } from "./labelsManager.js";
import {
  LABEL_VAR_TYPES,
  LABEL_VAR_TYPE_IDS,
  isValidVarKey,
  varComponentConfig,
  varDefault,
  normalizeVarDefs,
} from "./labelVarTypes.js";
import * as Icons from "../iconList.js";

const STOP_EVENTS = [
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

function buildFrame(className, titleText, onClose) {
  const backdrop = document.createElement("div");
  backdrop.className = `${className}-backdrop lvd-backdrop`;
  backdrop.addEventListener("click", onClose);

  const dialog = document.createElement("div");
  dialog.className = `${className} lvd-dialog`;

  const stop = (e) => e.stopPropagation();
  for (const ev of STOP_EVENTS) {
    backdrop.addEventListener(ev, stop);
    dialog.addEventListener(ev, stop);
  }

  const header = document.createElement("div");
  header.className = "lvd-header";
  const title = document.createElement("h3");
  title.className = "lvd-title";
  title.textContent = titleText;
  header.appendChild(title);
  const closeBtn = document.createElement("button");
  closeBtn.className = "lvd-close";
  closeBtn.type = "button";
  closeBtn.title = "Close";
  closeBtn.innerHTML = "✕";
  closeBtn.addEventListener("click", onClose);
  header.appendChild(closeBtn);
  dialog.appendChild(header);

  return { backdrop, dialog, title };
}

function mountFrame(frame) {
  document.body.appendChild(frame.backdrop);
  document.body.appendChild(frame.dialog);
  requestAnimationFrame(() => {
    frame.backdrop.classList.add("visible");
    frame.dialog.classList.add("visible");
  });
}

function unmountFrame(frame) {
  const { backdrop, dialog } = frame;
  backdrop.classList.remove("visible");
  dialog.classList.remove("visible");
  setTimeout(() => {
    backdrop.remove();
    dialog.remove();
  }, 250);
}

function typeSelect(current) {
  const sel = document.createElement("select");
  sel.className = "lvd-input lvd-type";
  for (const id of LABEL_VAR_TYPE_IDS) {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = LABEL_VAR_TYPES[id].label;
    if (id === current) opt.selected = true;
    sel.appendChild(opt);
  }
  return sel;
}

// ═══════════════════════════════════════════════════════════════════════════
// List
// ═══════════════════════════════════════════════════════════════════════════

class LabelVarsDialog {
  constructor() {
    this.frame = null;
    this.listEl = null;
    this.isVisible = false;
    this.labelId = null;
    this.onCloseCb = null;
    this.dragKey = null;
  }

  show({ labelId, onClose } = {}) {
    if (!labelId) return;
    if (this.isVisible) this.hide(true);
    this.labelId = labelId;
    this.onCloseCb = typeof onClose === "function" ? onClose : null;
    applyStyles();

    this.frame = buildFrame("label-vars-dialog", "", () => this.hide());
    const body = document.createElement("div");
    body.className = "lvd-body";
    this.listEl = document.createElement("div");
    this.listEl.className = "lv-list";
    body.appendChild(this.listEl);
    this.frame.dialog.appendChild(body);

    const footer = document.createElement("div");
    footer.className = "lvd-footer";
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "lvd-primary";
    addBtn.textContent = "Add variable";
    addBtn.addEventListener("click", () => this._openEditor(null));
    footer.appendChild(addBtn);
    this.frame.dialog.appendChild(footer);

    this.isVisible = true;
    mountFrame(this.frame);
    this.render();
    document.addEventListener("keydown", this._onKeyDown, true);
    document.addEventListener("editor:labels-changed", this._onLabelsChanged);
  }

  hide(silent = false) {
    if (!this.isVisible) return;
    this.isVisible = false;
    document.removeEventListener("keydown", this._onKeyDown, true);
    document.removeEventListener("editor:labels-changed", this._onLabelsChanged);
    unmountFrame(this.frame);
    this.frame = null;
    this.listEl = null;
    const cb = this.onCloseCb;
    this.onCloseCb = null;
    if (!silent && cb) {
      try {
        cb();
      } catch (e) {
        console.error(e);
      }
    }
  }

  _onKeyDown = (e) => {
    if (e.key === "Escape" && !editInstance?.isVisible) {
      e.preventDefault();
      e.stopPropagation();
      this.hide();
    }
  };

  _onLabelsChanged = () => this.render();

  _openEditor(def) {
    showLabelVarEditDialog({ labelId: this.labelId, def });
  }

  render() {
    if (!this.listEl || !this.frame) return;
    const lm = getLabelsManager();
    const label = lm?.getLabel(this.labelId);
    if (!lm || !label) {
      this.hide();
      return;
    }
    this.frame.title.textContent = `${label.name} variables`;
    this.listEl.innerHTML = "";

    const vars = lm.getVars(label.id);
    if (vars.length === 0) {
      const empty = document.createElement("div");
      empty.className = "lvd-empty";
      const access = isValidVarKey(label.name)
        ? `obj.labels.${label.name}.<var>`
        : `obj.labels["${label.name}"].<var>`;
      empty.textContent = `No variables yet. Every object with this label gets its own value per variable; scripts use ${access}.`;
      this.listEl.appendChild(empty);
      return;
    }
    vars.forEach((def, idx) => this.listEl.appendChild(this._buildRow(def, idx)));
  }

  _buildRow(def, idx) {
    const lm = getLabelsManager();
    const row = document.createElement("div");
    row.className = "lv-row";
    row.draggable = true;
    row.dataset.key = def.key;
    row.dataset.index = String(idx);

    const lineTop = document.createElement("div");
    lineTop.className = "lv-drop-line top";
    const lineBottom = document.createElement("div");
    lineBottom.className = "lv-drop-line bottom";
    row.appendChild(lineTop);
    row.appendChild(lineBottom);

    const handle = document.createElement("span");
    handle.className = "lv-handle";
    handle.title = "Drag to reorder";
    handle.innerHTML = "&#8942;&#8942;";
    row.appendChild(handle);

    const key = document.createElement("span");
    key.className = "lv-key";
    key.textContent = def.key;
    row.appendChild(key);

    const type = document.createElement("span");
    type.className = "lv-type-badge";
    type.textContent = LABEL_VAR_TYPES[def.type]?.label || def.type;
    row.appendChild(type);

    const actions = document.createElement("div");
    actions.className = "lv-actions";
    const mk = (title, html, cls, onClick) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `lvd-icon-btn ${cls}`.trim();
      b.title = title;
      b.innerHTML = html;
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        onClick();
      });
      return b;
    };
    actions.appendChild(
      mk("Edit variable", Icons.Settings, "", () => this._openEditor(def)),
    );
    actions.appendChild(
      mk("Remove variable", Icons.Delete, "danger", () => {
        lm?.removeVar(this.labelId, def.key);
        this.render();
      }),
    );
    row.appendChild(actions);

    row.addEventListener("dblclick", () => this._openEditor(def));

    // ── drag & drop reorder
    row.addEventListener("dragstart", (e) => {
      this.dragKey = def.key;
      row.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      try {
        e.dataTransfer.setData("text/plain", def.key);
      } catch (_) {}
    });
    row.addEventListener("dragend", () => {
      this.dragKey = null;
      row.classList.remove("dragging");
      this._clearDropLines();
    });
    row.addEventListener("dragover", (e) => {
      if (!this.dragKey || this.dragKey === def.key) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      this._clearDropLines();
      const r = row.getBoundingClientRect();
      const above = e.clientY < r.top + r.height / 2;
      (above ? lineTop : lineBottom).classList.add("visible");
    });
    row.addEventListener("dragleave", () => {
      lineTop.classList.remove("visible");
      lineBottom.classList.remove("visible");
    });
    row.addEventListener("drop", (e) => {
      if (!this.dragKey || this.dragKey === def.key) return;
      e.preventDefault();
      e.stopPropagation();
      const r = row.getBoundingClientRect();
      const above = e.clientY < r.top + r.height / 2;
      const vars = lm?.getVars(this.labelId) || [];
      const from = vars.findIndex((v) => v.key === this.dragKey);
      let to = idx + (above ? 0 : 1);
      if (from !== -1 && from < to) to -= 1;
      this._clearDropLines();
      const moved = lm?.moveVar(this.labelId, this.dragKey, to);
      this.dragKey = null;
      if (moved) this.render();
    });

    return row;
  }

  _clearDropLines() {
    this.listEl
      ?.querySelectorAll(".lv-drop-line.visible")
      .forEach((el) => el.classList.remove("visible"));
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Editor (add / edit one variable)
// ═══════════════════════════════════════════════════════════════════════════

class LabelVarEditDialog {
  constructor() {
    this.frame = null;
    this.isVisible = false;
    this.labelId = null;
    this.originalKey = null; // null = adding
    this.draft = null; // { key, type, default, options, min, max, step }
    this.component = null;
    this.defaultHolder = null;
    this.optionsField = null;
    this.rangeField = null;
    this.errorEl = null;
  }

  show({ labelId, def } = {}) {
    if (!labelId) return;
    if (this.isVisible) this.hide();
    this.labelId = labelId;
    this.originalKey = def ? def.key : null;
    this.draft = def
      ? { ...def, options: [...(def.options || [])] }
      : { key: "", type: "number", options: [] };
    if (this.draft.default === undefined) this.draft.default = varDefault(this.draft);
    applyStyles();

    const lm = getLabelsManager();
    const labelName = lm?.getLabel(labelId)?.name || "";
    this.frame = buildFrame(
      "label-var-edit-dialog",
      def ? `Edit ${def.key}` : `New variable (${labelName})`,
      () => this.hide(),
    );
    // Inspector component styles are scoped to this class.
    this.frame.dialog.classList.add("inspector-widgets");

    const body = document.createElement("div");
    body.className = "lvd-body lve-body";

    // Name
    const nameField = this._field("Name");
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "lvd-input lve-key";
    nameInput.placeholder = "e.g. speed";
    nameInput.spellcheck = false;
    nameInput.value = this.draft.key;
    nameInput.addEventListener("input", () => {
      this.draft.key = nameInput.value.trim();
      this._setError("");
    });
    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this._save();
      }
    });
    nameField.appendChild(nameInput);
    body.appendChild(nameField);

    // Type
    const typeField = this._field("Type");
    const sel = typeSelect(this.draft.type);
    sel.addEventListener("change", () => {
      this.draft.type = sel.value;
      if (this.draft.type !== "dropdown") this.draft.options = [];
      this.draft.default = varDefault({ ...this.draft, default: undefined });
      this._renderTypeSpecific();
    });
    typeField.appendChild(sel);
    body.appendChild(typeField);

    // Options (dropdown only)
    this.optionsField = this._field("Options (one per line)");
    const ta = document.createElement("textarea");
    ta.className = "lvd-input lve-options";
    ta.rows = 4;
    ta.spellcheck = false;
    ta.value = (this.draft.options || []).join("\n");
    ta.addEventListener("input", () => {
      this.draft.options = ta.value
        .split("\n")
        .map((o) => o.trim())
        .filter(Boolean);
      // Keep the default valid for the new option list.
      this.draft.default = varDefault({ ...this.draft });
      this._renderDefault();
    });
    this.optionsField.appendChild(ta);
    body.appendChild(this.optionsField);

    // Range (number only)
    this.rangeField = this._field("Range (min / max / step)");
    const range = document.createElement("div");
    range.className = "lve-range";
    for (const name of ["min", "max", "step"]) {
      const inp = document.createElement("input");
      inp.type = "number";
      inp.className = "lvd-input lve-bound";
      inp.placeholder = name;
      inp.title = name;
      if (typeof this.draft[name] === "number") inp.value = String(this.draft[name]);
      inp.addEventListener("input", () => {
        const n = inp.value.trim() === "" ? undefined : parseFloat(inp.value);
        if (Number.isFinite(n)) this.draft[name] = n;
        else delete this.draft[name];
      });
      range.appendChild(inp);
    }
    this.rangeField.appendChild(range);
    body.appendChild(this.rangeField);

    // Default
    this.defaultHolder = this._field("Default value");
    body.appendChild(this.defaultHolder);

    this.errorEl = document.createElement("div");
    this.errorEl.className = "lvd-error";
    body.appendChild(this.errorEl);

    this.frame.dialog.appendChild(body);

    const footer = document.createElement("div");
    footer.className = "lvd-footer";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "lvd-secondary";
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", () => this.hide());
    const save = document.createElement("button");
    save.type = "button";
    save.className = "lvd-primary";
    save.textContent = def ? "Save" : "Add";
    save.addEventListener("click", () => this._save());
    footer.appendChild(cancel);
    footer.appendChild(save);
    this.frame.dialog.appendChild(footer);

    this.isVisible = true;
    mountFrame(this.frame);
    this._renderTypeSpecific();
    document.addEventListener("keydown", this._onKeyDown, true);
    setTimeout(() => nameInput.focus(), 50);
  }

  hide() {
    if (!this.isVisible) return;
    this.isVisible = false;
    document.removeEventListener("keydown", this._onKeyDown, true);
    this.component?.destroy?.();
    this.component = null;
    unmountFrame(this.frame);
    this.frame = null;
  }

  _onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      this.hide();
    }
  };

  _field(labelText) {
    const wrap = document.createElement("div");
    wrap.className = "lvd-field";
    const l = document.createElement("div");
    l.className = "lvd-field-label";
    l.textContent = labelText;
    wrap.appendChild(l);
    return wrap;
  }

  _setError(msg) {
    if (this.errorEl) this.errorEl.textContent = msg || "";
  }

  _renderTypeSpecific() {
    this.optionsField.hidden = this.draft.type !== "dropdown";
    this.rangeField.hidden = this.draft.type !== "number";
    this._renderDefault();
  }

  _renderDefault() {
    if (!this.defaultHolder) return;
    this.component?.destroy?.();
    this.component = null;
    this.defaultHolder.querySelectorAll(".new-prop").forEach((el) => el.remove());
    const cfg = varComponentConfig(this.draft, {
      label: "",
      value: this.draft.default,
    });
    if (!cfg) return;
    try {
      const comp = ComponentFactory.create(cfg.type, cfg);
      comp.addEventListener("change", (e) => {
        const d = e.detail;
        this.draft.default = d.fullValue !== undefined ? d.fullValue : d.value;
      });
      // The widget's own label duplicates the field label — hide it.
      comp.element.querySelector(".new-prop-label")?.remove();
      this.defaultHolder.appendChild(comp.element);
      this.component = comp;
    } catch (err) {
      console.warn("[labels] default editor failed", this.draft, err);
    }
  }

  _save() {
    const lm = getLabelsManager();
    if (!lm) return;
    const key = String(this.draft.key || "").trim();
    if (!isValidVarKey(key)) {
      this._setError(
        "Name must be an identifier: letters, digits and _ only, no spaces.",
      );
      return;
    }
    const others = lm
      .getVars(this.labelId)
      .filter((v) => v.key !== this.originalKey);
    if (others.some((v) => v.key === key)) {
      this._setError(`"${key}" already exists on this label.`);
      return;
    }
    if (this.draft.type === "dropdown" && (this.draft.options || []).length === 0) {
      this._setError("A dropdown needs at least one option.");
      return;
    }
    const [normalized] = normalizeVarDefs([{ ...this.draft, key }]);
    if (!normalized) {
      this._setError("Invalid variable definition.");
      return;
    }
    const patch = {
      key: normalized.key,
      type: normalized.type,
      default: normalized.default,
      options: normalized.options,
      min: normalized.min,
      max: normalized.max,
      step: normalized.step,
    };
    let ok;
    if (this.originalKey === null) {
      ok = !!lm.addVar(this.labelId, patch);
    } else {
      ok = lm.updateVar(this.labelId, this.originalKey, patch);
      if (!ok) {
        // updateVar returns false when nothing changed as well; treat as done.
        ok = true;
      }
    }
    if (!ok) {
      this._setError("Could not save variable.");
      return;
    }
    this.hide();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Styles
// ═══════════════════════════════════════════════════════════════════════════

function applyStyles() {
  if (document.getElementById("label-vars-dialog-styles")) return;
  const style = document.createElement("style");
  style.id = "label-vars-dialog-styles";
  style.textContent = `
    .lvd-backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.45);
      opacity: 0; visibility: hidden;
      transition: all 0.25s ease;
    }
    .lvd-backdrop.visible { opacity: 1; visibility: visible; }
    .label-vars-dialog-backdrop { z-index: 1600; }
    .label-var-edit-dialog-backdrop { z-index: 1700; }

    .lvd-dialog {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) scale(0.95);
      width: 460px;
      max-width: 94vw;
      max-height: 84vh;
      background: ${Theme.sidebarBackground};
      border: 1px solid ${Theme.borderPrimary};
      box-shadow: 0 12px 32px rgba(0,0,0,0.55);
      display: flex; flex-direction: column;
      overflow: hidden;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 0.85rem;
      color: ${Theme.textPrimary};
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .lvd-dialog.visible { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    .label-vars-dialog { z-index: 1601; }
    .label-var-edit-dialog { z-index: 1701; width: 400px; }

    .lvd-header {
      display: flex; align-items: center; justify-content: space-between;
      gap: 8px;
      padding: 14px 20px 12px;
      background: ${Theme.primary};
      color: ${Theme.textPrimary};
      flex: 0 0 auto;
    }
    .lvd-title {
      margin: 0;
      font-size: 1.05rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 1px;
      min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .lvd-close {
      background: transparent; border: none; color: ${Theme.textPrimary};
      font-size: 20px; font-weight: bold; cursor: pointer;
      width: 36px; height: 36px; padding: 0;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s ease;
    }
    .lvd-close:hover { background: rgba(255,255,255,0.1); transform: scale(1.1); }

    .lvd-body { flex: 1 1 auto; overflow-y: auto; min-height: 0; }
    .lvd-footer {
      flex: 0 0 auto;
      display: flex; justify-content: flex-end; gap: 8px;
      padding: 12px 14px;
      border-top: 1px solid ${Theme.borderPrimary};
      background: ${Theme.componentBackground};
    }
    .lvd-primary {
      background: ${Theme.primary}; color: ${Theme.textPrimary};
      border: none; padding: 6px 16px;
      font-size: 0.8rem; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.5px;
      border-radius: 2px; cursor: pointer;
    }
    .lvd-primary:hover { background: ${Theme.primaryHover}; }
    .lvd-secondary {
      background: transparent; color: ${Theme.textMuted};
      border: 1px solid ${Theme.borderSecondary}; padding: 6px 14px;
      font-size: 0.8rem; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.5px;
      border-radius: 2px; cursor: pointer;
    }
    .lvd-secondary:hover { color: ${Theme.textPrimary}; border-color: ${Theme.primary}; }
    .lvd-empty {
      padding: 22px 14px; text-align: center;
      color: ${Theme.textMuted}; font-style: italic; line-height: 1.5;
    }
    .lvd-error { color: ${Theme.error}; font-size: 0.75rem; min-height: 1em; }

    .lvd-input {
      width: 100%;
      background: ${Theme.inputBackground};
      border: 1px solid ${Theme.borderSecondary};
      color: ${Theme.textPrimary};
      font-family: inherit;
      font-size: 0.82rem;
      padding: 6px 8px;
      border-radius: 2px;
      outline: none;
      box-sizing: border-box;
    }
    .lvd-input:focus { border-color: ${Theme.borderFocus}; }
    .lvd-icon-btn {
      background: transparent; border: 1px solid transparent;
      color: ${Theme.textMuted}; cursor: pointer;
      width: 24px; height: 24px; padding: 0; border-radius: 2px;
      display: inline-flex; align-items: center; justify-content: center;
    }
    .lvd-icon-btn:hover { color: ${Theme.textPrimary}; border-color: ${Theme.borderSecondary}; }
    .lvd-icon-btn.danger:hover {
      color: ${Theme.error}; border-color: ${Theme.error};
      background: ${Theme.componentErrorBackground};
    }
    .lvd-icon-btn svg { width: 13px; height: 13px; display: block; }

    /* ── list ── */
    .lv-list { display: flex; flex-direction: column; padding: 6px 0; }
    .lv-row {
      position: relative;
      display: flex; align-items: center; gap: 8px;
      padding: 6px 14px 6px 8px;
      border-left: 3px solid transparent;
      cursor: grab;
      user-select: none;
    }
    .lv-row:hover {
      background: ${Theme.componentHoverBackground};
      border-left-color: ${Theme.primary};
    }
    .lv-row.dragging { opacity: 0.4; }
    .lv-drop-line {
      position: absolute; left: 8px; right: 8px; height: 2px;
      background: ${Theme.primary}; opacity: 0; pointer-events: none;
    }
    .lv-drop-line.top { top: -1px; }
    .lv-drop-line.bottom { bottom: -1px; }
    .lv-drop-line.visible { opacity: 1; }
    .lv-handle {
      color: ${Theme.textMuted}; font-size: 0.8rem; letter-spacing: -3px;
      flex: 0 0 14px; text-align: center;
    }
    .lv-key {
      flex: 1 1 auto; min-width: 0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      font-family: 'MartianMono-ExtraBold', 'Courier New', monospace;
      font-size: 0.8rem;
    }
    .lv-type-badge {
      flex: 0 0 auto;
      font-size: 0.68rem; font-weight: 600; letter-spacing: 0.5px;
      text-transform: uppercase; color: ${Theme.textMuted};
      border: 1px solid ${Theme.borderSecondary};
      padding: 2px 6px; border-radius: 2px;
    }
    .lv-actions { display: flex; gap: 2px; flex: 0 0 auto; }

    /* ── editor ── */
    .lve-body { display: flex; flex-direction: column; gap: 12px; padding: 14px; }
    .lvd-field { display: flex; flex-direction: column; gap: 5px; }
    .lvd-field[hidden] { display: none; }
    .lvd-field-label {
      font-size: 0.7rem; font-weight: 600; letter-spacing: 0.5px;
      text-transform: uppercase; color: ${Theme.textMuted};
    }
    .lve-key { font-family: 'MartianMono-ExtraBold', 'Courier New', monospace; }
    .lve-options { resize: vertical; }
    .lve-range { display: flex; gap: 6px; }
    .lve-bound { flex: 1 1 0; min-width: 0; }
    .label-var-edit-dialog .new-prop { padding: 0; margin: 0; }
  `;
  document.head.appendChild(style);
}

// ═══════════════════════════════════════════════════════════════════════════

let listInstance = null;
let editInstance = null;

export function showLabelVarsDialog(opts = {}) {
  if (!listInstance) listInstance = new LabelVarsDialog();
  listInstance.show(opts);
}

export function showLabelVarEditDialog(opts = {}) {
  if (!editInstance) editInstance = new LabelVarEditDialog();
  editInstance.show(opts);
}
