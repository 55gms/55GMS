import { LevelValidator, ValidationError } from "../levelValidator.js";
import { END_ZONE_EXIT } from "../objectTypeDefinitions.js";

// Project-wide rules: issues that don't belong to one level. They appear in
// the issues tracker under a "Project" entry (key `__project__`) and count
// toward totals / play gating like level errors.
export const PROJECT_LEVEL_KEY = "__project__";

function structureOf(level, levelId, currentLevelId) {
  if (levelId === currentLevelId) {
    const sm = globalThis._editorScope?.stateManager;
    return sm?.currentState || sm?.exportState?.() || level;
  }
  return level;
}

function endZonesOf(structure) {
  return (structure?.instances || []).filter(
    (i) => i?.objectType === "levelEditorEndZone",
  );
}

/**
 * Run the project-wide rules.
 * @returns {{ errors: ValidationError[], warnings: Array }}
 */
export function validateProject(levels, currentLevelId) {
  const errors = [];
  const warnings = [];
  const order = Object.keys(levels);
  if (order.length === 0) return { errors, warnings };

  // Rule: the pack must be completable — starting at the first level, follow
  // every end zone into levels not yet seen; succeed as soon as an end zone
  // leads to the end of the pack (Exit, or default on the last level), fail
  // when there is nothing left to explore.
  const lastId = order[order.length - 1];
  const seen = new Set([order[0]]);
  const queue = [order[0]];
  let reachesEnd = false;
  while (queue.length && !reachesEnd) {
    const levelId = queue.shift();
    const structure = structureOf(levels[levelId], levelId, currentLevelId);
    const i = order.indexOf(levelId);
    for (const ez of endZonesOf(structure)) {
      const override = String(ez.properties?.nextLevel?.value ?? "");
      let targetId = null;
      if (override === END_ZONE_EXIT) {
        reachesEnd = true;
      } else if (override) {
        if (levels[override]) targetId = override;
      } else if (levelId === lastId) {
        reachesEnd = true;
      } else if (i !== -1) {
        targetId = order[i + 1];
      }
      if (!targetId) continue;
      if (!seen.has(targetId)) {
        seen.add(targetId);
        queue.push(targetId);
      }
    }
  }
  if (!reachesEnd) {
    errors.push(
      new ValidationError(
        `The pack can't be completed: no end zone reachable from the start of the pack leads to the end of the pack.`,
        "project",
      ),
    );
  }

  return { errors, warnings };
}

// Project-wide validation: run the issues tracker across every level in the
// project (not just the open one).
//
// The open level is validated from the live editor state (freshest), every other
// level from its stored serialized structure. Nothing here mutates project state
// (no saveCurrentLevelState), so it is safe to call on every issues-tracker open
// or play attempt.

/**
 * Validate all levels in the current project.
 * @returns {{
 *   levels: Object,            // { [levelId]: { levelId, name, errors, warnings, isCurrent } }
 *   currentLevelId: string|null,
 *   totalErrors: number,
 *   totalWarnings: number,
 *   levelsWithErrors: string[],
 * }}
 */
export function validateAllLevels() {
  const result = {
    levels: {},
    currentLevelId: null,
    totalErrors: 0,
    totalWarnings: 0,
    levelsWithErrors: [],
  };

  const projectManager = globalThis._editorScope?.projectManager;
  if (!projectManager || !projectManager.isProjectLoaded) {
    return result;
  }

  const currentLevelId = projectManager.currentProject?.currentLevelId || null;
  result.currentLevelId = currentLevelId;

  const levels = projectManager.getAllLevels();

  // One throwaway validator reused across levels (its state is overwritten each
  // pass, so we snapshot the results per level before moving on).
  const validator = new LevelValidator();

  // Project-wide issues first so the tracker lists them at the top.
  const project = validateProject(levels, currentLevelId);
  result.levels[PROJECT_LEVEL_KEY] = {
    levelId: PROJECT_LEVEL_KEY,
    name: "Project",
    errors: project.errors,
    warnings: project.warnings,
    isCurrent: false,
    isProject: true,
  };
  result.totalErrors += project.errors.length;
  result.totalWarnings += project.warnings.length;
  if (project.errors.length > 0)
    result.levelsWithErrors.push(PROJECT_LEVEL_KEY);

  for (const [levelId, level] of Object.entries(levels)) {
    if (levelId === currentLevelId) {
      // Live editor state (uses stateManager.currentState under the hood).
      validator.validateLevel(null, levelId);
    } else {
      validator.validateLevel(level, levelId);
    }

    const errors = validator.getErrors().slice();
    const warnings = validator.getWarnings().slice();

    result.levels[levelId] = {
      levelId,
      name: level?.levelData?.levelName || levelId,
      errors,
      warnings,
      isCurrent: levelId === currentLevelId,
    };
    result.totalErrors += errors.length;
    result.totalWarnings += warnings.length;
    if (errors.length > 0) result.levelsWithErrors.push(levelId);
  }

  validator.destroy();
  return result;
}

/**
 * @returns {boolean} true if any level in the project has at least one error.
 */
export function projectHasErrors() {
  return validateAllLevels().levelsWithErrors.length > 0;
}
