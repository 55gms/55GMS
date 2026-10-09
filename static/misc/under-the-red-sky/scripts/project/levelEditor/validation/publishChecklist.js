import { validateAllLevels } from "./projectValidator.js";
import { getGhostStatusForLevel } from "../ghostPaths/ghostPathManager.js";

// Publishing checklist evaluation.
//
// Hard criteria block upload entirely:
//   H1 — no errors in any level, nor project-wide.
//   H2 — every (non-hub) level has >= 1 non-obsolete ghost path.
// Soft criteria are shown and must be explicitly skipped each time:
//   S1 — every level has 0 warnings.
//   S2 — every (non-hub) level has star times set up AND a non-obsolete ghost
//        faster than the lowest (fastest) star time.
//   S3 — the workshop item has a preview image.
// Hub levels (levelData.isHub) are untimed and never record ghosts, so H2/S2
// skip them. Project-level criteria carry a `detail` line instead of chips.

function levelStructureForChecks(levelId, level, currentLevelId) {
  // The open level is checked against live editor state (instances + ghosts +
  // level data); other levels against their stored serialized structure.
  if (levelId === currentLevelId) {
    const sm = globalThis._editorScope?.stateManager;
    if (sm) return sm.currentState || sm.exportState();
  }
  return level;
}

/**
 * Evaluate the publishing checklist across all levels.
 * @returns {{
 *   hard: Array<{id,label,pass,failingLevels:Array<{levelId,name}>}>,
 *   soft: Array<{id,label,pass,failingLevels:Array<{levelId,name}>}>,
 *   canPublish: boolean,
 *   hasSoftFailures: boolean,
 *   levels: Object,
 * }}
 */
export function evaluatePublishChecklist() {
  const empty = {
    hard: [],
    soft: [],
    canPublish: false,
    hasSoftFailures: false,
    levels: {},
  };

  const projectManager = globalThis._editorScope?.projectManager;
  if (!projectManager || !projectManager.isProjectLoaded) return empty;

  const validation = validateAllLevels();
  const currentLevelId = validation.currentLevelId;
  const levels = projectManager.getAllLevels();

  const perLevel = {};
  for (const [levelId, level] of Object.entries(levels)) {
    const v = validation.levels[levelId] || {
      name: level?.levelData?.levelName || levelId,
      errors: [],
      warnings: [],
    };
    const structure = levelStructureForChecks(levelId, level, currentLevelId);
    const ghost = getGhostStatusForLevel(structure);

    const times = structure?.levelData?.levelTimes || {};
    const stars = [times.star1, times.star2, times.star3, times.star4];
    const starsSetUp = stars.every((t) => typeof t === "number" && t > 0);
    const lowestStar = starsSetUp ? Math.min(...stars) : null;
    const beatsStar =
      starsSetUp &&
      ghost.fastestNonObsoleteTime != null &&
      ghost.fastestNonObsoleteTime < lowestStar;

    perLevel[levelId] = {
      levelId,
      name: v.name,
      isHub: !!structure?.levelData?.isHub,
      errorCount: v.errors.length,
      warningCount: v.warnings.length,
      hasNonObsoleteGhost: ghost.hasNonObsoleteGhost,
      starsSetUp,
      beatsStar,
    };
  }

  const projectErrors = validation.levels.__project__?.errors?.length || 0;
  const projectWarnings = validation.levels.__project__?.warnings?.length || 0;
  const hasPreview = !!projectManager.currentProject?.workshop?.previewImage;

  const entries = Object.values(perLevel);
  const failing = (pred) =>
    entries
      .filter(pred)
      .map((e) => ({ levelId: e.levelId, name: e.name }));

  const hard = [
    {
      id: "H1",
      label: "No errors in any level or project-wide",
      failingLevels: failing((e) => e.errorCount > 0),
      forceFail: projectErrors > 0,
      detail: projectErrors > 0 ? `${projectErrors} project-wide error${projectErrors === 1 ? "" : "s"}` : "",
    },
    {
      id: "H2",
      label: "Every level has a non-obsolete ghost path",
      failingLevels: failing((e) => !e.isHub && !e.hasNonObsoleteGhost),
    },
  ];
  const soft = [
    {
      id: "S1",
      label: "No warnings in any level or project-wide",
      failingLevels: failing((e) => e.warningCount > 0),
      forceFail: projectWarnings > 0,
      detail: projectWarnings > 0 ? `${projectWarnings} project-wide warning${projectWarnings === 1 ? "" : "s"}` : "",
    },
    {
      id: "S2",
      label: "Star times set, with a ghost faster than the fastest star",
      failingLevels: failing((e) => !e.isHub && !(e.starsSetUp && e.beatsStar)),
    },
    {
      id: "S3",
      label: "Workshop preview image set",
      failingLevels: [],
      forceFail: !hasPreview,
      detail: hasPreview ? "" : "Add a preview image in the workshop dialog.",
    },
  ];

  for (const c of hard) c.pass = c.failingLevels.length === 0 && !c.forceFail;
  for (const c of soft) c.pass = c.failingLevels.length === 0 && !c.forceFail;

  return {
    hard,
    soft,
    canPublish: hard.every((c) => c.pass),
    hasSoftFailures: soft.some((c) => !c.pass),
    levels: perLevel,
  };
}
