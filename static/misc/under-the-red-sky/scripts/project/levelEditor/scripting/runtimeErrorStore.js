// runtimeErrorStore.js — editor side of the c3script runtime-error round-trip.
//
// During play, scriptRuntime captures errors thrown by a level's script and
// stashes them in the temp-data bridge keyed "scriptErrors:<levelId>" (the same
// channel ghost data uses). On return to the editor we import those buffers into
// each level's `levelData.extraData.scriptRuntimeErrors`, so the validator can
// surface them as blocking errors and the script dialog can list them.
//
// Semantics: replace-on-run. Every played level hands back a buffer (empty if the
// run was clean), so importing it OVERWRITES the stored record — a clean
// playthrough clears stale errors. Records persist in the project otherwise, and
// are only removed by a clean re-run or an explicit delete in the script dialog
// (which also invalidates the level's ghost; see deleteAllRuntimeErrors).

// Must match SCRIPT_ERRORS_TEMP_PREFIX in scriptRuntime.js.
const TEMP_PREFIX = "scriptErrors:";
export const RUNTIME_ERRORS_KEY = "scriptRuntimeErrors";

/** Read the captured runtime errors out of a level's data block. */
export function getRuntimeErrors(levelData) {
  const rec = levelData?.extraData?.[RUNTIME_ERRORS_KEY];
  return rec && Array.isArray(rec.errors) ? rec.errors : [];
}

/**
 * Import any runtime-error buffers stashed in temp data during play into the
 * project (replace-on-run). The open level is written through `levelSettings`
 * (live editor state); other levels into their stored structures. Mirrors
 * ghostPathManager.importOtherLevelTempGhosts.
 */
export function importRuntimeErrorsFromTemp() {
  const levelLoader = globalThis?.levelLoader;
  const projectManager = globalThis._editorScope?.projectManager;
  const levelSettings = globalThis._editorScope?.levelSettings;
  if (!levelLoader || !projectManager?.isProjectLoaded) return;
  if (typeof levelLoader.getTempDataKeys !== "function") return;

  const levels = projectManager.currentProject?.levels || {};
  const currentLevelId = projectManager.currentProject?.currentLevelId;
  let changed = false;

  for (const key of levelLoader.getTempDataKeys()) {
    if (!key.startsWith(TEMP_PREFIX)) continue;
    const levelId = key.slice(TEMP_PREFIX.length);
    const errors = levelLoader.getTempData(key) || [];
    levelLoader.removeTempData(key);

    const level = levels[levelId];
    if (!level) continue; // level no longer exists

    const record = errors.length
      ? { errors, timestamp: Date.now() }
      : null;

    if (levelId === currentLevelId && levelSettings) {
      // Open level — write through the live settings so the dialog + validator
      // (which read live editor state) see it immediately.
      if (record) levelSettings.setLevelExtraData(RUNTIME_ERRORS_KEY, record);
      else levelSettings.removeLevelExtraData(RUNTIME_ERRORS_KEY);
    } else {
      if (!level.levelData) level.levelData = {};
      if (!level.levelData.extraData) level.levelData.extraData = {};
      if (record) level.levelData.extraData[RUNTIME_ERRORS_KEY] = record;
      else delete level.levelData.extraData[RUNTIME_ERRORS_KEY];
    }
    changed = true;
    console.log(
      `[RuntimeErrorStore] Imported ${errors.length} runtime error(s) for level ${levelId}`,
    );
  }

  if (changed && typeof projectManager.markAsUnsaved === "function") {
    projectManager.markAsUnsaved();
  }
  return changed;
}

// Invalidate the open level's ghosts (best/last/custom). Any deletion of runtime
// errors does this: the errors and the ghost came from the same (errored) run, so
// dismissing the errors must not leave a ghost that satisfies the publish
// checklist — you have to re-run cleanly.
function invalidateGhost() {
  const ghostManager = globalThis._editorScope?.ghostPathSystem?.manager;
  if (ghostManager && typeof ghostManager.clearAllGhosts === "function") {
    ghostManager.clearAllGhosts();
  }
}

/** Delete ALL of the open level's persisted runtime errors (and its ghosts). */
export function deleteAllRuntimeErrors() {
  const levelSettings = globalThis._editorScope?.levelSettings;
  const cleared = levelSettings
    ? levelSettings.removeLevelExtraData(RUNTIME_ERRORS_KEY)
    : false;
  invalidateGhost();
  return cleared;
}

/** Delete a single persisted runtime error by index (and invalidate the ghosts). */
export function deleteRuntimeErrorAt(index) {
  const levelSettings = globalThis._editorScope?.levelSettings;
  if (!levelSettings) return;
  const rec = levelSettings.getLevelExtraData(RUNTIME_ERRORS_KEY);
  const errors = Array.isArray(rec?.errors) ? rec.errors.slice() : [];
  if (index < 0 || index >= errors.length) return;
  errors.splice(index, 1);
  if (errors.length) {
    levelSettings.setLevelExtraData(RUNTIME_ERRORS_KEY, { ...rec, errors });
  } else {
    levelSettings.removeLevelExtraData(RUNTIME_ERRORS_KEY);
  }
  invalidateGhost();
}

/** Subscribe to project loads so errors stashed during play are imported on return. */
export function initRuntimeErrorStore() {
  const projectManager = globalThis._editorScope?.projectManager;
  if (!projectManager || typeof projectManager.addEventListener !== "function") {
    return;
  }
  // Fires on return from play (the project is restored, firing projectLoaded).
  // A normal open is a no-op: there are no scriptErrors temp keys without a prior
  // play session in the same context.
  projectManager.addEventListener("projectLoaded", () => {
    importRuntimeErrorsFromTemp();
  });
}
