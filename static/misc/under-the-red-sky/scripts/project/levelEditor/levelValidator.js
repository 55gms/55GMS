import {
  PlacementConstraintType,
  getConstraintType,
  getObjectTypeName,
  selectableObjects,
} from "./objectTypeDefinitions.js";
import { Theme } from "./inspectorUI.js";
import { containsBannedWord } from "./bannedWords.js";
import { createSerializedRuntime } from "./validation/serializedRuntimeShim.js";
import { validateAllLevels } from "./validation/projectValidator.js";
import { parse } from "./scripting/c3script.js";
import { openScriptEditor } from "./scripting/scriptEditorDialog.js";
import { getRuntimeErrors } from "./scripting/runtimeErrorStore.js";
import { collectEnumWarnings } from "./scripting/scriptLint.js";
import { buildApiSchema } from "./scripting/gameApi.js";
import { END_ZONE_EXIT } from "./objectTypeDefinitions.js";
import { normalizeVarDefs, isValidIdentifier } from "./labels/labelVarTypes.js";
import { resolveMaterial } from "./materials/materialsManager.js";

// Zone IDs of every start zone in a level (live editor state when it's the
// open level, else its stored structure). Exported for the project-wide rules.
export function startZoneIdsOf(level, levelId, currentLevelId) {
  let structure = level;
  if (levelId && levelId === currentLevelId) {
    const sm = globalThis._editorScope?.stateManager;
    structure = sm?.currentState || sm?.exportState?.() || level;
  }
  const ids = new Set();
  for (const inst of structure?.instances || []) {
    if (inst?.objectType !== "levelEditorStartZone") continue;
    ids.add(String(inst.properties?.zoneId?.value ?? "").trim());
  }
  return ids;
}

// Zone IDs that end zones anywhere in the project arrive at in `levelId`:
// override end zones naming it, plus default end zones on the level before it
// in pack order.
export function targetedStartZoneIds(levelId) {
  const out = new Set();
  const pm = globalThis._editorScope?.projectManager;
  const levels = pm?.getAllLevels?.() || {};
  const order = Object.keys(levels);
  const currentLevelId = pm?.currentProject?.currentLevelId || null;
  const myIndex = order.indexOf(levelId);
  for (const [otherId, level] of Object.entries(levels)) {
    let structure = level;
    if (otherId === currentLevelId) {
      const sm = globalThis._editorScope?.stateManager;
      structure = sm?.currentState || sm?.exportState?.() || level;
    }
    const isPrev = myIndex > 0 && order[myIndex - 1] === otherId;
    for (const inst of structure?.instances || []) {
      if (inst?.objectType !== "levelEditorEndZone") continue;
      const override = String(inst.properties?.nextLevel?.value ?? "");
      const leadsHere = override ? override === levelId : isPrev;
      if (!leadsHere) continue;
      out.add(String(inst.properties?.startZoneId?.value ?? "").trim());
    }
  }
  return out;
}

export class ValidationError {
  constructor(message, type, objectType = null, instance = null) {
    this.message = message;
    this.type = type; // Error type category (e.g., "constraint", "content", etc.)
    this.objectType = objectType; // The object type name associated with the error (if applicable)
    this.instance = instance; // The specific instance associated with the error (if applicable)
    this.timestamp = Date.now();
  }
}

export class ValidationWarning {
  constructor(message, type, objectType = null, instance = null) {
    this.message = message;
    this.type = type; // Warning type category (e.g., "instance", "positioning", etc.)
    this.objectType = objectType; // The object type name associated with the warning (if applicable)
    this.instance = instance; // The specific instance associated with the warning (if applicable)
    this.timestamp = Date.now();
  }
}

export class LevelValidator {
  constructor() {
    // `runtime` and `levelData` are the *serialized* target for the current
    // validation pass. They are (re)built per `validateLevel()` call from the
    // serialized level under test — the rules always run against serialized data,
    // never a live C3 runtime. See `validateLevel()` / `getLevelData()`.
    this.runtime = null;
    this.levelData = null;
    this.errors = [];
    this.warnings = [];
    this.validationRules = [];
    this.isValid = true;

    // Initialize with default validation rules
    this.initDefaultRules();
  }

  /**
   * Initialize default validation rules
   */
  initDefaultRules() {
    // Object type constraint rules
    this.addRule({
      id: "objectConstraints",
      name: "Object Placement Constraints",
      description:
        "Validates object placement constraints (Only One, Zero Or One, One Or More)",
      validate: (runtime) => {
        const errors = [];
        const objectTypes = runtime.objects;

        // Skip if constraint types aren't available
        if (!PlacementConstraintType) {
          return errors;
        }

        // Check all object types for constraints
        selectableObjects.forEach((objectTypeName) => {
          const constraintType = getConstraintType(objectTypeName);
          if (constraintType === PlacementConstraintType.NORMAL) {
            return; // Skip normal objects
          }

          const instances = objectTypes[objectTypeName].getAllInstances();

          // Check based on constraint type
          switch (constraintType) {
            case PlacementConstraintType.ONLY_ONE:
              if (instances.length === 0) {
                errors.push(
                  new ValidationError(
                    `Level requires exactly one '${getObjectTypeName(
                      objectTypeName
                    )}' object, but none were found`,
                    "constraint",
                    objectTypeName
                  )
                );
              } else if (instances.length > 1) {
                errors.push(
                  new ValidationError(
                    `Level requires exactly one '${getObjectTypeName(
                      objectTypeName
                    )}' object, but ${instances.length} were found`,
                    "constraint",
                    objectTypeName
                  )
                );
              }
              break;

            case PlacementConstraintType.ZERO_OR_ONE:
              if (instances.length > 1) {
                errors.push(
                  new ValidationError(
                    `Level can have at most one '${getObjectTypeName(
                      objectTypeName
                    )}' object, but ${instances.length} were found`,
                    "constraint",
                    objectTypeName
                  )
                );
              }
              break;

            case PlacementConstraintType.ONE_OR_MORE:
              if (instances.length === 0) {
                errors.push(
                  new ValidationError(
                    `Level requires at least one '${getObjectTypeName(
                      objectTypeName
                    )}' object, but none were found`,
                    "constraint",
                    objectTypeName
                  )
                );
              }
              break;
          }
        });

        return errors;
      },
    });

    // Text content banned words check
    this.addRule({
      id: "textBannedWords",
      name: "Text content banned words check",
      description:
        "Checks all Text instances and reports each instance whose text contains banned words",
      validate: (runtime) => {
        const errors = [];
        const textType = runtime.objects?.Text;
        if (!textType) return errors;

        const instances = textType.getAllInstances();
        for (const instance of instances) {
          const raw = instance?.text ?? "";
          if (typeof raw === "string") {
            const bannedWord = containsBannedWord(raw);
            if (bannedWord) {
              errors.push(
                new ValidationError(
                  `Text contains the forbidden word '${bannedWord}'`,
                  "content",
                  "Text",
                  instance
                )
              );
            }
          }
        }
        return errors;
      },
    });

    // Level times validation rule
    this.addRule({
      id: "levelTimes",
      name: "Level Times Validation",
      description:
        "Validates that level times are in correct order (1 star > 2 star > 3 star > 4 star)",
      validate: (runtime) => {
        const errors = [];
        const levelData = this.getLevelData();

        if (!levelData) {
          return errors;
        }

        const levelTimes = levelData.levelTimes;

        // Hubs are untimed: star times are ignored entirely.
        if (!levelTimes || levelData.isHub) {
          return errors;
        }

        const { star1, star2, star3, star4 } = levelTimes;

        // Check that times are in descending order (1 star should be longest)
        if (star1 < star2) {
          errors.push(
            new ValidationError(
              `1 Star time (${star1}s) must be greater than 2 Star time (${star2}s)`,
              "levelTimes",
              null,
              null
            )
          );
        }

        if (star2 < star3) {
          errors.push(
            new ValidationError(
              `2 Star time (${star2}s) must be greater than 3 Star time (${star3}s)`,
              "levelTimes",
              null,
              null
            )
          );
        }

        if (star3 < star4) {
          errors.push(
            new ValidationError(
              `3 Star time (${star3}s) must be greater than 4 Star time (${star4}s)`,
              "levelTimes",
              null,
              null
            )
          );
        }

        return errors;
      },
    });

    // Level script (c3script) parse-error rule
    this.addRule({
      id: "scriptErrors",
      name: "Level Script Errors",
      description:
        "Reports parse/compile errors in the level's c3script so coding mistakes count as level issues",
      validate: (runtime) => {
        const errors = [];
        const levelData = this.getLevelData();
        const source = levelData?.script;

        if (!source || typeof source !== "string" || source.trim() === "") {
          return errors;
        }

        try {
          parse(source);
        } catch (e) {
          const detail =
            e && typeof e.format === "function"
              ? e.format()
              : e?.message || String(e);
          const error = new ValidationError(
            `Script error: ${detail}`,
            "script",
            null,
            null
          );
          // Carry source location when available (LangError.line/column).
          if (e && e.line != null) error.line = e.line;
          if (e && e.column != null) error.column = e.column;
          errors.push(error);
        }

        return errors;
      },
    });

    // Level script (c3script) runtime-error rule. Errors thrown while the script
    // ran during play are captured and persisted to extraData (see
    // runtimeErrorStore.js); surface them as blocking errors so a level that
    // crashed at runtime can't be played or published until it's re-run cleanly.
    this.addRule({
      id: "scriptRuntimeErrors",
      name: "Level Script Runtime Errors",
      description:
        "Reports errors thrown by the level's c3script during play so runtime crashes count as level issues",
      validate: () => {
        const errors = [];
        const levelData = this.getLevelData();
        for (const rec of getRuntimeErrors(levelData)) {
          const where = rec.line != null ? ` (line ${rec.line})` : "";
          const error = new ValidationError(
            `Runtime error${where}: ${rec.message}`,
            "script",
            null,
            null,
          );
          if (rec.line != null) error.line = rec.line;
          if (rec.column != null) error.column = rec.column;
          errors.push(error);
        }
        return errors;
      },
    });

    // End zone "Next Level" pointing at a level missing from the project
    // (deleted since). An error: the author picked a destination that no
    // longer exists.
    this.addRule({
      id: "endZoneNextLevel",
      name: "End Zone Next Level",
      description:
        "Errors when an end zone's Next Level points to a level missing from the project",
      validate: (runtime) => {
        const errors = [];
        const type = runtime?.objects?.levelEditorEndZone;
        if (!type || typeof type.getAllInstances !== "function") return errors;
        const pm = globalThis._editorScope?.projectManager;
        const levels = pm?.getAllLevels?.() || {};
        for (const inst of type.getAllInstances()) {
          const id =
            inst?._source?.properties?.nextLevel?.value ??
            inst?.instVars?.override ??
            "";
          if (!id || id === END_ZONE_EXIT || levels[id]) continue;
          errors.push(
            new ValidationError(
              `An end zone's "Next Level" points to a level that no longer exists in the project.`,
              "endZone",
              "levelEditorEndZone",
              inst,
            ),
          );
        }
        return errors;
      },
    });

    // Start zone ids — with several start zones each needs its own Zone ID
    // (one may stay empty: the default spawn).
    this.addRule({
      id: "startZoneIds",
      name: "Start Zone IDs",
      description: "Errors when start zones in a level share a Zone ID",
      validate: (runtime) => {
        const errors = [];
        const type = runtime?.objects?.levelEditorStartZone;
        if (!type || typeof type.getAllInstances !== "function") return errors;
        const byId = new Map();
        for (const inst of type.getAllInstances()) {
          const id = String(inst?._source?.properties?.zoneId?.value ?? "").trim();
          if (!byId.has(id)) byId.set(id, []);
          byId.get(id).push(inst);
        }
        for (const [id, insts] of byId) {
          if (insts.length < 2) continue;
          const label = id ? `Zone ID "${id}"` : "an empty Zone ID (default spawn)";
          for (const inst of insts) {
            errors.push(
              new ValidationError(
                `${insts.length} start zones share ${label}; give each start zone a unique Zone ID.`,
                "startZone",
                "levelEditorStartZone",
                inst,
              ),
            );
          }
        }
        return errors;
      },
    });

    // Default spawn — a level with start zones must keep one with an empty
    // Zone ID: that's where the player lands when nothing targets a specific
    // zone (first entry, restart, "play from start"). Zero start zones is
    // already an error from objectConstraints (ONE_OR_MORE).
    this.addRule({
      id: "defaultStartZone",
      name: "Default Start Zone",
      description: "Errors when no start zone has an empty Zone ID (the default spawn)",
      validate: (runtime) => {
        const errors = [];
        const type = runtime?.objects?.levelEditorStartZone;
        if (!type || typeof type.getAllInstances !== "function") return errors;
        const insts = type.getAllInstances();
        if (insts.length === 0) return errors;
        const hasDefault = insts.some(
          (inst) => String(inst?._source?.properties?.zoneId?.value ?? "").trim() === "",
        );
        if (!hasDefault) {
          errors.push(
            new ValidationError(
              "No default start zone: leave one start zone's Zone ID empty so the level has a spawn point.",
              "startZone",
              "levelEditorStartZone",
              insts[0],
            ),
          );
        }
        return errors;
      },
    });

    // End zone → start zone: "Arrive At Start Zone" must name a Zone ID that
    // exists in the destination level (Next Level override, else the next
    // level in pack order).
    this.addRule({
      id: "endZoneStartZone",
      name: "End Zone Arrival",
      description:
        "Errors when an end zone's Arrive At Start Zone doesn't exist in its destination level",
      validate: (runtime) => {
        const errors = [];
        const type = runtime?.objects?.levelEditorEndZone;
        if (!type || typeof type.getAllInstances !== "function") return errors;
        const pm = globalThis._editorScope?.projectManager;
        const levels = pm?.getAllLevels?.() || {};
        const order = Object.keys(levels);
        const myIndex = this.levelId ? order.indexOf(this.levelId) : -1;
        for (const inst of type.getAllInstances()) {
          const props = inst?._source?.properties || {};
          const wanted = String(props.startZoneId?.value ?? "").trim();
          if (!wanted) continue;
          const override = String(props.nextLevel?.value ?? "");
          let targetId = null;
          if (override === END_ZONE_EXIT) {
            errors.push(
              new ValidationError(
                `An end zone that exits the pack can't target start zone "${wanted}".`,
                "endZone",
                "levelEditorEndZone",
                inst,
              ),
            );
            continue;
          } else if (override) {
            targetId = levels[override] ? override : null;
          } else if (myIndex !== -1 && myIndex < order.length - 1) {
            targetId = order[myIndex + 1];
          }
          if (!targetId) {
            // Missing override level is already an error (endZoneNextLevel);
            // a default end zone on the last level exits the pack.
            if (!override)
              errors.push(
                new ValidationError(
                  `An end zone on the last level targets start zone "${wanted}" but leads to the end of the pack.`,
                  "endZone",
                  "levelEditorEndZone",
                  inst,
                ),
              );
            continue;
          }
          const ids = startZoneIdsOf(levels[targetId], targetId, this.levelId);
          if (!ids.has(wanted)) {
            const name = levels[targetId]?.levelData?.levelName || targetId;
            errors.push(
              new ValidationError(
                `An end zone targets start zone "${wanted}" but "${name}" has no start zone with that Zone ID.`,
                "endZone",
                "levelEditorEndZone",
                inst,
              ),
            );
          }
        }
        return errors;
      },
    });

    // Missing materials — a custom material that was deleted while still
    // referenced by an object's Material property or by a material-typed label
    // variable (default or per-instance value). Rendering falls back to the
    // default material; the reference itself is an error.
    this.addRule({
      id: "missingMaterials",
      name: "Missing Materials",
      description:
        "Errors when an object or a label variable references a material that no longer exists",
      validate: (runtime) => {
        const errors = [];
        const missing = (id) => !!id && !resolveMaterial(id);
        const levelData = this.getLevelData();
        const dict = levelData?.labelDictionary || {};

        // Label var schema defaults.
        const materialVars = new Map(); // labelId -> [varDef]
        for (const l of Object.values(dict)) {
          const vars = normalizeVarDefs(l?.vars).filter((v) => v.type === "material");
          if (vars.length === 0) continue;
          materialVars.set(l.id, vars);
          for (const v of vars) {
            if (missing(v.default)) {
              errors.push(
                new ValidationError(
                  `Label "${l.name}" variable "${v.key}" defaults to a material that no longer exists.`,
                  "material",
                ),
              );
            }
          }
        }

        const objectTypes = runtime?.objects || {};
        for (const typeName of selectableObjects) {
          const type = objectTypes[typeName];
          if (!type || typeof type.getAllInstances !== "function") continue;
          for (const inst of type.getAllInstances()) {
            const src = inst?._source;
            const mat = src?.properties?.material?.value;
            if (missing(mat)) {
              errors.push(
                new ValidationError(
                  `A '${getObjectTypeName(typeName)}' uses a material that no longer exists.`,
                  "material",
                  typeName,
                  inst,
                ),
              );
            }
            const lv = src?.labelVars;
            if (!lv) continue;
            for (const [labelId, bucket] of Object.entries(lv)) {
              const vars = materialVars.get(labelId);
              if (!vars || !bucket) continue;
              for (const v of vars) {
                if (missing(bucket[v.key])) {
                  errors.push(
                    new ValidationError(
                      `A '${getObjectTypeName(typeName)}' sets label variable "${dict[labelId]?.name}.${v.key}" to a material that no longer exists.`,
                      "material",
                      typeName,
                      inst,
                    ),
                  );
                }
              }
            }
          }
        }
        return errors;
      },
    });

    // Label variables — a label that defines variables is exposed to scripts
    // as obj.labels.<labelName>.<var>. Warn when the name can't be reached
    // with dot access (not an identifier).
    this.addRule({
      id: "labelVarNames",
      name: "Label Variable Names",
      description:
        "Warns when a label with variables has a name scripts can't reach as obj.labels.<label>",
      isWarning: true,
      validate: () => {
        const warnings = [];
        const levelData = this.getLevelData();
        const dict = levelData?.labelDictionary || {};
        for (const l of Object.values(dict)) {
          const name = l?.name;
          if (!name || normalizeVarDefs(l.vars).length === 0) continue;
          if (isValidIdentifier(name)) continue;
          warnings.push(
            new ValidationWarning(
              `Label "${name}" defines variables but its name is not an identifier — scripts must use obj.labels["${name}"].<var>. Rename it (letters, digits, _ only) for obj.labels.${name.replace(/\W+/g, "_")}.`,
              "labels",
            ),
          );
        }
        return warnings;
      },
    });

    // Start zones nobody arrives at — a Zone ID that no end zone in the
    // project (override or pack-order default) targets. The default (empty)
    // zone is always implicitly used.
    this.addRule({
      id: "unusedStartZones",
      name: "Unused Start Zones",
      description:
        "Warns when a start zone's Zone ID is not targeted by any end zone in the project",
      isWarning: true,
      validate: (runtime) => {
        const warnings = [];
        const type = runtime?.objects?.levelEditorStartZone;
        if (!type || typeof type.getAllInstances !== "function") return warnings;
        const zones = type
          .getAllInstances()
          .map((inst) => ({ inst, id: String(inst?._source?.properties?.zoneId?.value ?? "").trim() }))
          .filter((z) => z.id);
        if (zones.length === 0) return warnings;
        const targeted = targetedStartZoneIds(this.levelId);
        for (const z of zones) {
          if (targeted.has(z.id)) continue;
          warnings.push(
            new ValidationWarning(
              `Start zone "${z.id}" is not targeted by any end zone.`,
              "startZone",
              "levelEditorStartZone",
              z.inst,
            ),
          );
        }
        return warnings;
      },
    });

    // Level script lint warnings — the same pass as the script editor's
    // Problems tab (unknown enum string literals, e.g. level.find("label")
    // naming a label no object carries). Warnings, not blocking errors. The
    // find/findAll label enum is rebuilt from the level under test's own
    // labelDictionary: labels are per-level, and buildApiSchema reads the
    // labels manager, which only knows the currently open level.
    this.addRule({
      id: "scriptLintWarnings",
      name: "Level Script Warnings",
      description:
        "Surfaces script lint warnings (unknown labels / enum values) as level issues",
      isWarning: true,
      validate: () => {
        const warnings = [];
        const levelData = this.getLevelData();
        const source = levelData?.script;
        if (!source || typeof source !== "string" || source.trim() === "") {
          return warnings;
        }
        let globals;
        try {
          globals = buildApiSchema();
          const labelNames = Object.values(levelData?.labelDictionary || {})
            .map((l) => l?.name)
            .filter(Boolean);
          const argEnums = { ...globals.level.__argEnums__ };
          if (labelNames.length) {
            argEnums.find = labelNames;
            argEnums.findAll = labelNames;
          } else {
            delete argEnums.find;
            delete argEnums.findAll;
          }
          globals.level.__argEnums__ = argEnums;
        } catch (_) {
          return warnings;
        }
        for (const w of collectEnumWarnings(source, globals)) {
          const where = w.line != null ? ` (line ${w.line})` : "";
          const warning = new ValidationWarning(
            `Script warning${where}: ${w.message}`,
            "script",
            null,
            null,
          );
          if (w.line != null) warning.line = w.line;
          if (w.column != null) warning.column = w.column;
          warnings.push(warning);
        }
        return warnings;
      },
    });

    // Warning rules - these don't prevent play but show as warnings

    // Instance size validation (warning)
    this.addRule({
      id: "instanceSizeWarnings",
      name: "Instance Size Warnings",
      description:
        "Checks for instances with problematic sizes (2+ components set to 0)",
      isWarning: true,
      validate: (runtime) => {
        const warnings = [];
        const objectTypes = runtime.objects;

        selectableObjects.forEach((objectTypeName) => {
          const instances = objectTypes[objectTypeName].getAllInstances();

          instances.forEach((instance) => {
            let zeroComponents = 0;
            let sizeProperties = [];

            // Check different size property patterns based on object type
            if (
              instance.xScale !== undefined &&
              instance.yScale !== undefined &&
              instance.zScale !== undefined
            ) {
              // 3D object with scale properties
              if (instance.xScale === 0) {
                zeroComponents++;
                sizeProperties.push("X scale");
              }
              if (instance.yScale === 0) {
                zeroComponents++;
                sizeProperties.push("Y scale");
              }
              if (instance.zScale === 0) {
                zeroComponents++;
                sizeProperties.push("Z scale");
              }
            } else {
              // Regular object with width/height/zHeight
              if (instance.width !== undefined && instance.width === 0) {
                zeroComponents++;
                sizeProperties.push("width");
              }
              if (instance.height !== undefined && instance.height === 0) {
                zeroComponents++;
                sizeProperties.push("height");
              }
              if (instance.zHeight !== undefined && instance.zHeight === 0) {
                zeroComponents++;
                sizeProperties.push("Z height");
              }
            }

            if (zeroComponents >= 2) {
              warnings.push(
                new ValidationWarning(
                  `Instance has ${zeroComponents} size components set to 0 (${sizeProperties.join(
                    ", "
                  )}), which may cause rendering issues`,
                  "instance",
                  objectTypeName,
                  instance
                )
              );
            }
          });
        });

        return warnings;
      },
    });

    // Instance positioning validation (warning)
    this.addRule({
      id: "instancePositionWarnings",
      name: "Instance Position Warnings",
      description: "Checks for instances positioned far outside level bounds",
      isWarning: true,
      validate: (runtime) => {
        const warnings = [];
        const objectTypes = runtime.objects;

        // Get level bounds
        const levelData = this.getLevelData();
        if (!levelData) return warnings;

        const levelSize = levelData?.levelSize;
        if (!levelSize || !levelSize.width || !levelSize.height)
          return warnings;

        // Calculate warning bounds (half level size away from bounds)
        const halfWidth = levelSize.width / 2;
        const halfHeight = levelSize.height / 2;
        const warningBounds = {
          left: -halfWidth - halfWidth, // -1.5 * half width
          right: halfWidth + halfWidth, // 1.5 * half width
          top: -halfHeight - halfHeight, // -1.5 * half height
          bottom: halfHeight + halfHeight, // 1.5 * half height
        };

        selectableObjects.forEach((objectTypeName) => {
          const instances = objectTypes[objectTypeName].getAllInstances();

          instances.forEach((instance) => {
            if (instance.x === undefined || instance.y === undefined) return;

            const isOutside =
              instance.x < warningBounds.left ||
              instance.x > warningBounds.right ||
              instance.y < warningBounds.top ||
              instance.y > warningBounds.bottom;

            if (isOutside) {
              warnings.push(
                new ValidationWarning(
                  `Instance is positioned far outside level bounds (${Math.round(
                    instance.x
                  )}, ${Math.round(instance.y)})`,
                  "positioning",
                  objectTypeName,
                  instance
                )
              );
            }
          });
        });

        return warnings;
      },
    });
  }

  /**
   * Resolve the level data the rules should validate against — the level data of
   * the serialized level currently under test (set by `validateLevel()`). Falls
   * back to the live `levelSettings` singleton if called before any validation
   * pass.
   * @returns {Object|null}
   */
  getLevelData() {
    if (this.levelData) {
      return this.levelData;
    }
    const levelSettings = globalThis._editorScope?.levelSettings;
    return levelSettings ? levelSettings.getLevelData() : null;
  }

  /**
   * Add a validation rule
   * @param {Object} rule - The validation rule to add
   */
  addRule(rule) {
    if (
      !rule.id ||
      !rule.name ||
      !rule.validate ||
      typeof rule.validate !== "function"
    ) {
      console.error("Invalid validation rule:", rule);
      return;
    }

    this.validationRules.push(rule);
  }

  /**
   * Remove a validation rule by ID
   * @param {string} ruleId - The ID of the rule to remove
   */
  removeRule(ruleId) {
    const index = this.validationRules.findIndex((rule) => rule.id === ruleId);
    if (index !== -1) {
      this.validationRules.splice(index, 1);
    }
  }

  /**
   * Build the serialized structure for the currently open level from the live
   * editor state (instances + level data). Shape matches a stored level:
   * `{ instances, levelData, metaData }` (see `stateManager.exportState`).
   * @returns {Object|null}
   */
  getCurrentLevelStructure() {
    const stateManager = globalThis._editorScope?.stateManager;
    if (!stateManager) return null;
    // Reuse the serialized snapshot the undo/redo system already maintains
    // (`currentState` is refreshed on every change via `pushUndoState`), so we
    // don't re-serialize the whole level on each validation pass. Fall back to a
    // fresh export only if no snapshot exists yet.
    return stateManager.currentState || stateManager.exportState();
  }

  /**
   * Validate a level against all rules. Validation always runs against
   * *serialized* data via the runtime shim — including the currently open level,
   * which is serialized on the fly from the live editor state.
   * @param {Object|null} level - serialized level `{ instances, levelData, ... }`.
   *   Omit / pass null to validate the currently open level.
   * @returns {Array} Array of validation errors (warnings are stored separately)
   */
  validateLevel(level = null, levelId = null) {
    const levelStructure = level || this.getCurrentLevelStructure();
    // Which project level this pass is about (rules that look at "the next
    // level in pack order" need it). Defaults to the open level.
    this.levelId =
      levelId ||
      globalThis._editorScope?.projectManager?.currentProject?.currentLevelId ||
      null;

    // (Re)build the serialized runtime + level data for this pass so the rules
    // and getLevelData() target this level.
    this.runtime = createSerializedRuntime(levelStructure);
    this.levelData = this.runtime.levelData;

    this.errors = [];
    this.warnings = [];

    // Run all validation rules
    for (const rule of this.validationRules) {
      try {
        const ruleResults = rule.validate(this.runtime);
        if (ruleResults && ruleResults.length > 0) {
          if (rule.isWarning) {
            this.warnings.push(...ruleResults);
          } else {
            this.errors.push(...ruleResults);
          }
        }
      } catch (error) {
        console.error(`Error running validation rule '${rule.id}':`, error);
      }
    }

    this.isValid = this.errors.length === 0;
    return this.errors;
  }

  /**
   * Validate the currently open level. Thin alias kept for existing callers.
   * @returns {Array} Array of validation errors (warnings are stored separately)
   */
  validate() {
    return this.validateLevel();
  }

  /**
   * Get all validation errors
   * @returns {Array} Array of validation errors
   */
  getErrors() {
    return this.errors;
  }

  /**
   * Get all validation warnings
   * @returns {Array} Array of validation warnings
   */
  getWarnings() {
    return this.warnings;
  }

  /**
   * Get all validation issues (errors and warnings combined)
   * @returns {Array} Array of all validation issues
   */
  getAllIssues() {
    return [...this.errors, ...this.warnings];
  }

  /**
   * Check if the level is valid (no errors, warnings are okay)
   * @returns {boolean} True if the level is valid (no errors)
   */
  isLevelValid() {
    return this.isValid;
  }

  /**
   * Check if there are any warnings
   * @returns {boolean} True if there are warnings
   */
  hasWarnings() {
    return this.warnings.length > 0;
  }

  destroy() {
    this.errors = [];
    this.warnings = [];
    this.validationRules = [];
    this.isValid = true;
  }
}

/**
 * Create a dialog to display validation errors
 */
export class ValidationDialog {
  constructor() {
    this.dialog = null;
    this.validator = null;
  }

  /**
   * Set the validator instance
   * @param {LevelValidator} validator - The validator instance
   */
  setValidator(validator) {
    this.validator = validator;
  }

  onObjectTypeClick(objectTypeName) {
    // Fallback: select all instances of the object type
    const objectType = globalThis._editorScope.runtime.objects[objectTypeName];
    if (objectType) {
      const instances = objectType.getAllInstances();
      if (instances.length > 0) {
        globalThis._editorScope.selectionManager.setSelection(...instances);
      } else {
        // Try to find a preset that contains only this object type
        const placingSystem = globalThis._editorScope?.placingSystem;
        const presetManager = placingSystem?.presetManager;

        if (presetManager) {
          // Get all presets and find one with only the specified object type
          const allPresets = presetManager.getAllPresets();
          const matchingPreset = allPresets.find((preset) => {
            // Check if preset has exactly one object and it matches the object type
            return (
              preset.objects &&
              preset.objects.length === 1 &&
              preset.objects[0].objectType === objectTypeName
            );
          });

          if (matchingPreset) {
            // Show preset dialog and focus the matching preset
            const presetDialog = placingSystem.presetDialog;
            if (presetDialog) {
              placingSystem.currentSlotForDialog =
                placingSystem.inventoryBar?.selectedSlotIndex;
              presetDialog.show(matchingPreset.id);
              this.hide();
              return;
            }
          }
        }
      }
    }
  }

  onInstanceClick(instance) {
    if (!instance) return;
    const sm = globalThis._editorScope?.selectionManager;
    if (!sm) return;

    // Issues carry a *serialized* instance wrapper. Resolve it to the live
    // instance by uid. `_source.uid` reflects the freshly-assigned uid after a
    // level load (cross-level case); fall back to the wrapper's own uid.
    let target = instance;
    const uid = instance._source?.uid ?? instance.uid;
    const runtime = globalThis._editorScope?.runtime;
    if (uid !== undefined && uid !== null && runtime?.getInstanceByUid) {
      const live = runtime.getInstanceByUid(uid);
      if (live) target = live;
      else return; // not in the open level — nothing to select
    }

    sm.setSelection(target);
  }

  onLevelTimesClick() {
    const sm = globalThis._editorScope?.selectionManager;
    if (sm) sm.clearSelection();
  }

  /**
   * Show the issues tracker. Validates every level in the project, renders a
   * sidebar of levels, and shows the selected level's issues in the main panel.
   * @param {string|null} focusLevelId - level to select (defaults to current level)
   * @param {Object|null} projectResult - precomputed validateAllLevels() result
   */
  show(focusLevelId = null, projectResult = null) {
    // Create or clear the dialog
    if (!this.dialog) {
      this.createDialog();
    } else {
      this.clearDialog();
    }

    this.projectResult = projectResult || validateAllLevels();
    const levelEntries = this.projectResult.levels;
    const levelIds = Object.keys(levelEntries);

    // Default selection: requested level → current level → first level.
    const currentId = this.projectResult.currentLevelId;
    this.selectedLevelId =
      focusLevelId && levelEntries[focusLevelId]
        ? focusLevelId
        : currentId && levelEntries[currentId]
          ? currentId
          : levelIds[0] || null;

    const dialogTitle = this.dialog.querySelector(".dialog-title");
    if (dialogTitle) {
      dialogTitle.textContent = "Issues";
      dialogTitle.classList.remove("error", "success");
    }

    this.renderSidebar();
    this.renderLevelIssues(this.selectedLevelId);

    // Show the dialog with proper animation
    this.backdrop.classList.add("visible");
    setTimeout(() => {
      this.dialog.classList.add("visible");
    }, 10);
  }

  /**
   * Render the level list in the sidebar from `this.projectResult`.
   */
  renderSidebar() {
    const listEl = this.dialog.querySelector(".validation-level-list");
    if (!listEl || !this.projectResult) return;
    listEl.innerHTML = "";

    const levels = this.projectResult.levels;
    for (const levelId of Object.keys(levels)) {
      const entry = levels[levelId];
      const row = document.createElement("div");
      row.className = "validation-level-row";
      if (levelId === this.selectedLevelId) row.classList.add("selected");
      if (entry.errors.length > 0) row.classList.add("has-errors");
      else if (entry.warnings.length > 0) row.classList.add("has-warnings");

      const nameEl = document.createElement("span");
      nameEl.className = "validation-level-name";
      nameEl.textContent = entry.name + (entry.isCurrent ? " (current)" : "");
      row.appendChild(nameEl);

      const badges = document.createElement("span");
      badges.className = "validation-level-badges";
      if (entry.errors.length > 0) {
        const b = document.createElement("span");
        b.className = "validation-badge error";
        b.textContent = String(entry.errors.length);
        badges.appendChild(b);
      }
      if (entry.warnings.length > 0) {
        const b = document.createElement("span");
        b.className = "validation-badge warning";
        b.textContent = String(entry.warnings.length);
        badges.appendChild(b);
      }
      if (entry.errors.length === 0 && entry.warnings.length === 0) {
        const b = document.createElement("span");
        b.className = "validation-badge ok";
        b.textContent = "✓";
        badges.appendChild(b);
      }
      row.appendChild(badges);

      row.addEventListener("click", () => this.selectLevel(levelId));
      listEl.appendChild(row);
    }
  }

  /**
   * Switch the main panel to a different level (sidebar click).
   */
  selectLevel(levelId) {
    if (!this.projectResult || !this.projectResult.levels[levelId]) return;
    this.selectedLevelId = levelId;
    this.renderSidebar();
    this.renderLevelIssues(levelId);
  }

  /**
   * Render the issues list for a single level into the main panel.
   */
  renderLevelIssues(levelId) {
    const errorList = this.dialog.querySelector(".validation-error-list");
    const summaryEl = this.dialog.querySelector(".validation-issue-summary");
    if (!errorList) return;
    errorList.innerHTML = "";

    const entry = levelId ? this.projectResult?.levels[levelId] : null;
    const errors = entry ? entry.errors : [];
    const warnings = entry ? entry.warnings : [];
    const allIssues = [...errors, ...warnings];
    const isCurrent = entry ? entry.isCurrent : false;

    if (summaryEl) {
      if (!entry) {
        summaryEl.textContent = "";
      } else if (allIssues.length === 0) {
        // Merged into the single centered "no issues" message below.
        summaryEl.textContent = "";
      } else {
        const parts = [];
        if (errors.length > 0)
          parts.push(`${errors.length} ${errors.length === 1 ? "error" : "errors"}`);
        if (warnings.length > 0)
          parts.push(
            `${warnings.length} ${warnings.length === 1 ? "warning" : "warnings"}`
          );
        summaryEl.textContent = `${entry.name}: ${parts.join(", ")} found`;
      }
    }

    if (allIssues.length === 0) {
      const noErrorsMessage = document.createElement("div");
      noErrorsMessage.className = "validation-success-message";
      noErrorsMessage.textContent = entry
        ? `${entry.name}: no issues found`
        : "No issues found";
      errorList.appendChild(noErrorsMessage);
      return;
    }

    // Errors first, then warnings.
    [...errors, ...warnings].forEach((issue) => {
      errorList.appendChild(this.createIssueItem(issue, isCurrent, levelId));
    });
  }

  /**
   * Build one issue row. Clickable references act on the live editor only when
   * the issue belongs to the currently open level; otherwise they switch to that
   * level first.
   */
  createIssueItem(issue, isCurrentLevel, levelId) {
    const errorItem = document.createElement("div");
    errorItem.className = `validation-error-item ${
      issue instanceof ValidationWarning ? "warning" : "error"
    }`;

    const messageEl = document.createElement("div");
    messageEl.className = "validation-error-message";
    const messageText = document.createElement("span");
    messageText.textContent = issue.message;
    messageEl.appendChild(messageText);
    errorItem.appendChild(messageEl);

    // `action` performs the navigation (select instance, open script, etc.). For
    // the current level it runs immediately; for another level we switch to that
    // level first, then run the same action — by then the level is loaded and the
    // serialized instance's uid has been remapped to the live one (see
    // `goToLevel` / `wrapSerializedInstance._source`).
    const addRef = (label, text, action) => {
      const el = document.createElement("div");
      el.className = "validation-error-objecttype";
      el.textContent = label;
      const link = document.createElement("span");
      link.className = "clickable-reference";
      link.textContent = text;
      link.addEventListener("click", () => {
        if (isCurrentLevel) {
          action();
          this.hide();
        } else {
          this.goToLevel(levelId, action);
        }
      });
      el.appendChild(link);
      errorItem.appendChild(el);
    };

    // Object type reference
    if (issue.objectType && !issue.instance) {
      addRef("Object Type: ", getObjectTypeName(issue.objectType), () =>
        this.onObjectTypeClick(issue.objectType)
      );
    }

    // Instance reference
    if (issue.instance) {
      addRef(
        "Instance: ",
        `${getObjectTypeName(issue.objectType)} (${issue.instance.uid || "Unknown"})`,
        () => this.onInstanceClick(issue.instance)
      );
    }

    // Level times reference
    if (issue.type === "levelTimes") {
      addRef("Fix in: ", "Level Settings", () => this.onLevelTimesClick());
    }

    // Script error reference — open the script editor at the offending line.
    if (issue.type === "script") {
      const label = issue.line != null ? `Open script (line ${issue.line})` : "Open script";
      addRef("Fix in: ", label, () =>
        this.openScriptAt(issue.line, issue.column)
      );
    }

    return errorItem;
  }

  /**
   * Open the level-script editor, optionally jumping to a line/column and
   * opening Monaco's problem peek at the corresponding marker.
   */
  openScriptAt(line, column) {
    openScriptEditor(line != null ? { line, column, peek: true } : null);
  }

  /**
   * Switch the editor to a level (for issues that belong to another level), then
   * run the link's action against the now-loaded level. `switchToLevel` is
   * synchronous and remaps the level's instance uids in place, so an action that
   * resolves by uid works once we're here.
   */
  goToLevel(levelId, action) {
    this.hide();
    const pm = globalThis._editorScope?.projectManager;
    if (pm && typeof pm.switchToLevel === "function") {
      pm.switchToLevel(levelId);
    }
    if (typeof action === "function") {
      action();
    }
  }

  /**
   * Hide the validation dialog
   */
  hide() {
    if (this.dialog) {
      this.dialog.classList.remove("visible");
      this.backdrop.classList.remove("visible");
    }
  }

  /**
   * Create the validation dialog
   */
  createDialog() {
    // Create backdrop
    this.backdrop = document.createElement("div");
    this.backdrop.className = "validation-dialog-backdrop";

    // Create dialog container
    this.dialog = document.createElement("div");
    this.dialog.className = "validation-dialog";

    // Create dialog header
    const dialogHeader = document.createElement("div");
    dialogHeader.className = "dialog-header";

    const dialogTitle = document.createElement("h2");
    dialogTitle.className = "dialog-title";
    dialogTitle.textContent = "Level Validation";
    dialogHeader.appendChild(dialogTitle);

    const closeButton = document.createElement("button");
    closeButton.className = "dialog-close";
    closeButton.innerHTML = "✕";
    closeButton.addEventListener("click", () => this.hide());
    dialogHeader.appendChild(closeButton);

    this.dialog.appendChild(dialogHeader);

    // Create dialog content: sidebar (level list) + main (issues for selection)
    const dialogContent = document.createElement("div");
    dialogContent.className = "dialog-content";

    // Sidebar: one row per level in the project
    const sidebar = document.createElement("div");
    sidebar.className = "validation-sidebar";
    const sidebarTitle = document.createElement("div");
    sidebarTitle.className = "validation-sidebar-title";
    sidebarTitle.textContent = "Levels";
    sidebar.appendChild(sidebarTitle);
    const levelList = document.createElement("div");
    levelList.className = "validation-level-list";
    sidebar.appendChild(levelList);
    dialogContent.appendChild(sidebar);

    // Main panel: summary + issue list for the selected level
    const main = document.createElement("div");
    main.className = "validation-main";
    const summary = document.createElement("div");
    summary.className = "validation-issue-summary";
    main.appendChild(summary);
    const errorList = document.createElement("div");
    errorList.className = "validation-error-list";
    main.appendChild(errorList);
    dialogContent.appendChild(main);

    this.dialog.appendChild(dialogContent);

    // Add dialog to backdrop
    this.backdrop.appendChild(this.dialog);

    // Add backdrop to document
    document.body.appendChild(this.backdrop);

    // Add event blocking
    this.setupEventBlocking();

    // Add styles
    this.addStyles();
  }

  /**
   * Set up event blocking for the dialog
   */
  setupEventBlocking() {
    // Block the same events that the inspector blocks
    ["mousedown", "click", "contextmenu", "keydown", "wheel"].forEach(
      (eventType) => {
        this.dialog.addEventListener(eventType, (e) => {
          e.stopPropagation();
        });
      }
    );

    // Also block events on backdrop but allow click to close
    ["mousedown", "contextmenu", "keydown", "wheel"].forEach((eventType) => {
      this.backdrop.addEventListener(eventType, (e) => {
        e.stopPropagation();
        if (eventType === "mousedown" && e.target === this.backdrop) {
          this.hide();
        }
      });
    });
  }

  /**
   * Clear the dialog content
   */
  clearDialog() {
    const errorList = this.dialog.querySelector(".validation-error-list");
    if (errorList) {
      errorList.innerHTML = "";
    }
    const levelList = this.dialog.querySelector(".validation-level-list");
    if (levelList) {
      levelList.innerHTML = "";
    }
  }

  /**
   * Add styles for the validation dialog
   */
  addStyles() {
    if (document.querySelector("#validation-dialog-styles")) return;

    const styleEl = document.createElement("style");
    styleEl.id = "validation-dialog-styles";
    styleEl.textContent = `
      /* Validation Dialog Styles */
      .validation-dialog-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
        z-index: 3000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .validation-dialog-backdrop.visible {
        opacity: 1;
        visibility: visible;
      }

      .validation-dialog {
        background: ${Theme.sidebarBackground};
        border: 1px solid ${Theme.borderPrimary};
        border-radius: 0px;
        width: 820px;
        max-width: 90vw;
        max-height: 80vh;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        transform: scale(0.9) translateY(-20px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        display: flex;
        flex-direction: column;
      }

      .validation-dialog.visible {
        transform: scale(1) translateY(0);
        opacity: 1;
      }

      .validation-dialog .dialog-header {
        background: ${Theme.primary};
        color: ${Theme.textPrimary};
        padding: 20px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 0px 0px 0 0;
        flex-shrink: 0;
      }

      .validation-dialog .dialog-title {
        margin: 0;
        font-size: 1.3rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: ${Theme.textPrimary};
      }

      .validation-dialog .dialog-title.error {
        color: #ff6b6b;
      }

      .validation-dialog .dialog-title.success {
        color: #51cf66;
      }

      .validation-dialog .dialog-close {
        background: transparent;
        border: none;
        color: ${Theme.textPrimary};
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        width: 36px;
        height: 36px;
        border-radius: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .validation-dialog .dialog-close:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: scale(1.1);
      }

      .validation-dialog .dialog-content {
        padding: 0;
        overflow: hidden;
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: row;
        background: ${Theme.sidebarBackground};
      }

      /* Sidebar: level list */
      .validation-sidebar {
        width: 230px;
        flex-shrink: 0;
        border-right: 1px solid ${Theme.borderPrimary};
        background: ${Theme.componentBackground};
        overflow-y: auto;
        padding: 12px 0;
      }

      .validation-sidebar-title {
        color: ${Theme.textSecondary};
        text-transform: uppercase;
        font-size: 0.72rem;
        letter-spacing: 1px;
        padding: 4px 16px 10px;
      }

      .validation-level-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 9px 14px;
        cursor: pointer;
        color: ${Theme.textPrimary};
        border-left: 3px solid transparent;
      }

      .validation-level-row:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      .validation-level-row.selected {
        background: rgba(255, 255, 255, 0.09);
        border-left-color: ${Theme.primary};
      }

      .validation-level-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.9rem;
      }

      .validation-level-badges {
        display: flex;
        gap: 4px;
        flex-shrink: 0;
      }

      .validation-badge {
        min-width: 18px;
        text-align: center;
        padding: 1px 6px;
        font-size: 0.76rem;
        font-weight: 700;
      }

      .validation-badge.error {
        background: #ff6b6b;
        color: #1a1a1a;
      }

      .validation-badge.warning {
        background: #ffa500;
        color: #1a1a1a;
      }

      .validation-badge.ok {
        background: transparent;
        color: #51cf66;
      }

      /* Main panel: selected level's issues */
      .validation-main {
        flex: 1;
        min-width: 0;
        min-height: 0;
        display: flex;
        flex-direction: column;
        padding: 20px 10px 20px 20px;
        overflow: hidden;
      }

      .validation-dialog .dialog-content::-webkit-scrollbar {
        width: 14px;
      }

      .validation-dialog .dialog-content::-webkit-scrollbar-track {
        background: ${Theme.scrollbarTrack};
      }

      .validation-dialog .dialog-content::-webkit-scrollbar-thumb {
        background: ${Theme.scrollbarThumb};
        border-radius: 0px;
        border: 4px solid ${Theme.scrollbarTrack};
        background-clip: content-box;
      }

      .validation-dialog .dialog-content::-webkit-scrollbar-thumb:hover {
        background: ${Theme.scrollbarThumbHover};
        border: 4px solid ${Theme.scrollbarTrack};
        background-clip: content-box;
      }

      .validation-issue-summary {
        color: ${Theme.textSecondary};
        margin-bottom: 12px;
      }

      .validation-error-list {
        margin: 0;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        scrollbar-gutter: stable;
      }

      .validation-error-list::-webkit-scrollbar {
        width: 14px;
      }

      .validation-error-list::-webkit-scrollbar-track {
        background: ${Theme.scrollbarTrack};
      }

      .validation-error-list::-webkit-scrollbar-thumb {
        background: ${Theme.scrollbarThumb};
        border-radius: 0px;
        border: 4px solid ${Theme.scrollbarTrack};
        background-clip: content-box;
      }

      .validation-error-list::-webkit-scrollbar-thumb:hover {
        background: ${Theme.scrollbarThumbHover};
        border: 4px solid ${Theme.scrollbarTrack};
        background-clip: content-box;
      }

      .validation-error-item {
        margin-bottom: 12px;
        padding: 14px 16px;
        background: ${Theme.componentBackground};
        border: 1px solid ${Theme.borderSecondary};
        border-radius: 0px;
        border-left: 4px solid #ff6b6b;
      }

      .validation-error-item.warning {
        border-left: 4px solid #ffa500;
      }

      .validation-error-item:last-child {
        margin-bottom: 0;
      }

      .validation-error-message {
        font-weight: 500;
        color: ${Theme.textPrimary};
        margin-bottom: 8px;
        line-height: 1.4;
      }

      .validation-error-objecttype,
      .validation-error-instance {
        font-size: 0.9em;
        color: ${Theme.textSecondary};
        margin-top: 6px;
      }

      .clickable-reference {
        color: ${Theme.primary};
        cursor: pointer;
        text-decoration: underline;
        font-weight: 500;
        transition: color 0.2s;
      }

      .clickable-reference:hover {
        color: ${Theme.primaryHover};
      }

      .validation-success-message {
        text-align: center;
        color: ${Theme.textSecondary};
        font-style: italic;
        font-size: 1.1em;
        font-weight: 500;
        padding: 24px;
      }

      /* Animation for error items */
      .validation-error-item {
        animation: slideInFade 0.3s ease-out;
      }

      @keyframes slideInFade {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(styleEl);
  }

  destroy() {
    this.hide();

    if (this.backdrop) {
      this.backdrop.remove();
    }

    if (this.dialog) {
      this.dialog.remove();
    }

    const styles = document.querySelector("#validation-dialog-styles");
    if (styles) {
      styles.remove();
    }
  }
}
