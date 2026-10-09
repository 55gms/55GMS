import { Theme, openLevelSettingsAt } from "./inspectorUI.js";
import { evaluatePublishChecklist } from "./validation/publishChecklist.js";
import { showGhostPathDialog } from "./ghostPaths/ghostPathDialog.js";

// Publishing checklist gate. Shown before a Steam Workshop upload.
// - Hard criteria failing -> upload blocked (no proceed button).
// - Soft criteria failing -> a "Skip & continue to upload" button that must be
//   clicked every time (no persisted skip).
// - All passing -> "Continue to upload".

export class PublishChecklistDialog {
  constructor() {
    this.backdrop = null;
    this.dialog = null;
    this.onProceed = null;
  }

  /**
   * @param {Function} onProceed - called when the user chooses to continue to
   *   upload (only available when hard criteria pass).
   */
  show(onProceed = null) {
    this.onProceed = onProceed;
    if (!this.dialog) this.createDialog();
    this.result = evaluatePublishChecklist();
    this.renderContent();
    this.backdrop.classList.add("visible");
    setTimeout(() => this.dialog.classList.add("visible"), 10);
  }

  hide() {
    globalThis._editorScope?.toolbar?.hideTooltip?.();
    if (this.dialog) this.dialog.classList.remove("visible");
    if (this.backdrop) this.backdrop.classList.remove("visible");
  }

  createDialog() {
    this.backdrop = document.createElement("div");
    this.backdrop.className = "publish-checklist-backdrop";

    this.dialog = document.createElement("div");
    this.dialog.className = "publish-checklist-dialog";

    const header = document.createElement("div");
    header.className = "dialog-header";
    const title = document.createElement("h2");
    title.className = "dialog-title";
    title.textContent = "Publishing Checklist";
    header.appendChild(title);
    const close = document.createElement("button");
    close.className = "dialog-close";
    close.innerHTML = "✕";
    close.addEventListener("click", () => this.hide());
    header.appendChild(close);
    this.dialog.appendChild(header);

    const content = document.createElement("div");
    content.className = "publish-checklist-content";
    this.dialog.appendChild(content);

    const footer = document.createElement("div");
    footer.className = "publish-checklist-footer";
    this.dialog.appendChild(footer);

    this.backdrop.appendChild(this.dialog);
    document.body.appendChild(this.backdrop);
    this.setupEventBlocking();
    this.addStyles();
  }

  renderContent() {
    const content = this.dialog.querySelector(".publish-checklist-content");
    const footer = this.dialog.querySelector(".publish-checklist-footer");
    content.innerHTML = "";
    footer.innerHTML = "";

    const r = this.result;

    content.appendChild(
      this.renderSection("Required", r.hard, "These must pass to publish."),
    );
    content.appendChild(
      this.renderSection(
        "Recommended",
        r.soft,
        "These don't block publishing, but you'll be warned each time.",
      ),
    );

    // Footer button (header ✕ / backdrop click also close).
    const btn = document.createElement("button");
    btn.className = "publish-btn primary";

    if (this.onProceed) {
      // Gate mode (opened from the upload flow): proceed / skip, disabled when
      // required checks fail.
      if (r.canPublish) {
        btn.textContent = "CONTINUE TO UPLOAD";
        btn.addEventListener("click", () => {
          this.hide();
          if (typeof this.onProceed === "function") this.onProceed();
        });
      } else {
        btn.textContent = "CONTINUE TO UPLOAD";
        // Styled-disabled (not the `disabled` attribute) so the custom hover
        // tooltip still works; the click is a no-op.
        btn.classList.add("disabled");
        btn.setAttribute("aria-disabled", "true");
        this.attachTooltip(btn, "Fix the required items to publish.");
      }
    } else {
      // Review-only mode (opened outside the upload flow): just close.
      btn.textContent = "OK";
      btn.addEventListener("click", () => this.hide());
    }

    footer.appendChild(btn);
  }

  /**
   * Hover tooltip for an element, reusing the toolbar's shared tooltip (so styling
   * and font match). Falls back to the native `title` if the toolbar isn't around.
   */
  attachTooltip(el, text) {
    const toolbar = globalThis._editorScope?.toolbar;
    if (!toolbar || typeof toolbar.showTooltip !== "function") {
      el.title = text;
      return;
    }
    el.addEventListener("mouseenter", () => toolbar.showTooltip(el, text));
    el.addEventListener("mouseleave", () => {
      if (typeof toolbar.hideTooltipDelayed === "function") {
        toolbar.hideTooltipDelayed();
      } else {
        toolbar.hideTooltip();
      }
    });
  }

  renderSection(title, criteria, subtitle) {
    const section = document.createElement("div");
    section.className = "publish-section";

    const head = document.createElement("div");
    head.className = "publish-section-title";
    head.textContent = title;
    section.appendChild(head);

    const sub = document.createElement("div");
    sub.className = "publish-section-subtitle";
    sub.textContent = subtitle;
    section.appendChild(sub);

    for (const c of criteria) {
      const row = document.createElement("div");
      row.className = `publish-criterion ${c.pass ? "pass" : "fail"}`;

      const icon = document.createElement("span");
      icon.className = "publish-criterion-icon";
      icon.textContent = c.pass ? "✓" : "✕";
      row.appendChild(icon);

      const body = document.createElement("div");
      body.className = "publish-criterion-body";

      const label = document.createElement("div");
      label.className = "publish-criterion-label";
      label.textContent = c.label;
      body.appendChild(label);

      if (!c.pass && c.detail) {
        const detail = document.createElement("div");
        detail.className = "publish-criterion-detail";
        detail.textContent = c.detail;
        body.appendChild(detail);
      }

      if (!c.pass && c.failingLevels.length > 0) {
        const chips = document.createElement("div");
        chips.className = "publish-level-chips";
        for (const lvl of c.failingLevels) {
          const chip = document.createElement("span");
          chip.className = "publish-level-chip";
          chip.textContent = lvl.name;
          chip.addEventListener("click", () =>
            this.onLevelChip(c.id, lvl.levelId),
          );
          chips.appendChild(chip);
        }
        body.appendChild(chips);
      }

      row.appendChild(body);
      section.appendChild(row);
    }

    return section;
  }

  onLevelChip(criterionId, levelId) {
    this.hide();
    // Navigating away to fix something — close the workshop dialog behind us too.
    globalThis._editorScope?.steamWorkshopDialog?.hide();

    // Error/warning criteria -> open the issues tracker on that level.
    if (criterionId === "H1" || criterionId === "S1") {
      const vd = globalThis._editorScope?.validationDialog;
      if (vd) vd.show(levelId);
      return;
    }

    // Ghost / star criteria -> switch to that level first so the fix targets it.
    const pm = globalThis._editorScope?.projectManager;
    if (
      pm &&
      typeof pm.switchToLevel === "function" &&
      pm.currentProject?.currentLevelId !== levelId
    ) {
      pm.switchToLevel(levelId);
    }

    if (criterionId === "H2") {
      // Missing ghost path -> open the ghost path manager.
      showGhostPathDialog();
    } else if (criterionId === "S2") {
      // Star times / qualifying ghost -> open level settings at the star times.
      openLevelSettingsAt("levelTimes");
    }
  }

  setupEventBlocking() {
    ["mousedown", "click", "contextmenu", "keydown", "wheel"].forEach((t) => {
      this.dialog.addEventListener(t, (e) => e.stopPropagation());
    });
    ["mousedown", "contextmenu", "keydown", "wheel"].forEach((t) => {
      this.backdrop.addEventListener(t, (e) => {
        e.stopPropagation();
        if (t === "mousedown" && e.target === this.backdrop) this.hide();
      });
    });
  }

  addStyles() {
    if (document.querySelector("#publish-checklist-styles")) return;
    const styleEl = document.createElement("style");
    styleEl.id = "publish-checklist-styles";
    styleEl.textContent = `
      .publish-checklist-backdrop {
        position: fixed; inset: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
        z-index: 3100; opacity: 0; visibility: hidden;
        transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;
      }
      .publish-checklist-backdrop.visible { opacity: 1; visibility: visible; }
      .publish-checklist-dialog {
        background: ${Theme.sidebarBackground};
        border: 1px solid ${Theme.borderPrimary};
        width: 560px; max-width: 90vw; max-height: 80vh;
        display: flex; flex-direction: column; overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        transform: scale(0.9) translateY(-20px); opacity: 0;
        transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .publish-checklist-dialog.visible { transform: scale(1) translateY(0); opacity: 1; }
      .publish-checklist-dialog .dialog-header {
        background: ${Theme.primary}; color: ${Theme.textPrimary};
        padding: 18px 22px; display: flex; align-items: center; justify-content: space-between;
        flex-shrink: 0;
      }
      .publish-checklist-dialog .dialog-title {
        margin: 0; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
      }
      .publish-checklist-dialog .dialog-close {
        background: transparent; border: none; color: ${Theme.textPrimary};
        font-size: 18px; cursor: pointer; width: 32px; height: 32px;
      }
      .publish-checklist-dialog .dialog-close:hover { background: rgba(255,255,255,0.1); }
      .publish-checklist-content { padding: 18px 22px; overflow-y: auto; flex: 1; }
      .publish-section { margin-bottom: 20px; }
      .publish-section-title {
        font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;
        color: ${Theme.textPrimary}; font-weight: 700; margin-bottom: 2px;
      }
      .publish-section-subtitle { font-size: 0.82rem; color: ${Theme.textSecondary}; margin-bottom: 10px; }
      .publish-criterion {
        display: flex; gap: 10px; align-items: flex-start;
        padding: 10px 12px; margin-bottom: 8px;
        background: ${Theme.componentBackground};
        border: 1px solid ${Theme.borderSecondary}; border-left: 4px solid #51cf66;
      }
      .publish-criterion.fail { border-left-color: #ff6b6b; }
      .publish-criterion-icon { font-weight: 700; line-height: 1.4; }
      .publish-criterion.pass .publish-criterion-icon { color: #51cf66; }
      .publish-criterion.fail .publish-criterion-icon { color: #ff6b6b; }
      .publish-criterion-body { flex: 1; min-width: 0; }
      .publish-criterion-label { color: ${Theme.textPrimary}
      .publish-criterion-detail {
        font-size: 0.75rem; opacity: 0.75; margin-top: 2px;
      }; font-weight: 500; }
      .publish-level-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
      .publish-level-chip {
        font-size: 0.8rem; padding: 2px 8px; cursor: pointer;
        background: ${Theme.sidebarBackground}; color: ${Theme.primary};
        border: 1px solid ${Theme.borderSecondary}; text-decoration: underline;
      }
      .publish-level-chip:hover { color: ${Theme.primaryHover}; }
      .publish-checklist-footer {
        display: flex; gap: 10px; align-items: center; justify-content: flex-end;
        padding: 14px 22px; border-top: 1px solid ${Theme.borderPrimary}; flex-shrink: 0;
      }
      .publish-btn {
        padding: 8px 16px; cursor: pointer; font-weight: 600; border: 1px solid ${Theme.borderSecondary};
      }
      .publish-btn.secondary { background: ${Theme.componentBackground}; color: ${Theme.textPrimary}; }
      .publish-btn.primary { background: ${Theme.primary}; color: ${Theme.textPrimary}; border-color: ${Theme.primary}; }
      .publish-btn:hover { filter: brightness(1.1); }
      .publish-btn.disabled { opacity: 0.5; cursor: not-allowed; }
      .publish-btn.disabled:hover { filter: none; }
      .publish-blocked-note { color: #ff6b6b; font-size: 0.85rem; }
    `;
    document.head.appendChild(styleEl);
  }

  destroy() {
    if (this.backdrop && this.backdrop.parentNode) {
      this.backdrop.parentNode.removeChild(this.backdrop);
    }
    this.backdrop = null;
    this.dialog = null;
  }
}

let _instance = null;

export function initializePublishChecklistDialog() {
  if (!_instance) _instance = new PublishChecklistDialog();
  if (globalThis._editorScope) {
    globalThis._editorScope.publishChecklistDialog = _instance;
  }
  return _instance;
}

export function destroyPublishChecklistDialog() {
  if (_instance) {
    _instance.destroy();
    _instance = null;
  }
}
