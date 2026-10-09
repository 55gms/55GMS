// Default Level Data Template
// This file contains the default structure for new levels

export const DEFAULT_LEVEL_DATA = {
  isHub: false,
  isOnline: true,
  levelName: "Untitled Level",
  skyboxType: "frosty",
  overrideSkyTint: false,
  skyColor: "#FFFFFF",
  overrideFogColor: false,
  fogColor: "#87CEEB",
  overrideFogDensity: false,
  fogDensity: 0.1,
  levelSize: { width: 3000.0, height: 3000.0 },
  levelTimes: {
    star1: 0,
    star2: 0,
    star3: 0,
    star4: 0,
  },
  levelPlaylist: "auto",
  gridSettings: {
    size: { x: 64, y: 64, z: 64 },
    snapToGrid: true,
    angleSnap: 15,
    backgroundColor: "#1a1a1a",
    gridColor: "#4d4d4d",
  },
  cameraSettings: {
    moveSpeed: 800,
    rotationSpeed: 1,
    showTargetGizmo: true,
    targetGizmoColor: "#4A90D9",
    targetPosition: null,
  },
  // Editor-only: nested groups for hierarchy panel.
  // Shape: { [groupId]: { id, name, parentId: string|null, color?: string, hidden: boolean, collapsed: boolean } }
  groups: {},
  // Editor-only: id-based label dictionary.
  // Shape: { [labelId]: { id, name, color } }
  // Instance refs live on instanceMeta.labels as Array<labelId>.
  labelDictionary: {},
  // Per-level global script (c3script source). Runs once when the level loads
  // during play (registers handlers via on("start"/"tick")). Empty = no script.
  script: "",
};

export const SKYBOX_OPTIONS = [
  { key: "frosty", label: "Frosty", icon: null },
  { key: "night", label: "Night Sky", icon: null },
  { key: "deepBlue", label: "Deep Blue", icon: null },
  { key: "cloudy", label: "Cloudy", icon: null },
  { key: "desert", label: "Desert", icon: null },
  { key: "ovoWhite", label: "White", icon: null },
  { key: "ovoBlack", label: "Black", icon: null },
  { key: "snowStorm", label: "Snow Storm", icon: null },
  { key: "BlueStorm", label: "Blue Storm", icon: null },
  { key: "foggyWhite", label: "Foggy White", icon: null },
  { key: "redsky", label: "Red Sky", icon: null },
  { key: "cursed", label: "Cursed", icon: null },
  { key: "noSkybox2", label: "None", icon: null },
];

export const PROJECT_DIFFICULTIES = [
  { key: 1, label: "Very Easy", icon: null },
  { key: 2, label: "Easy", icon: null },
  { key: 3, label: "Medium", icon: null },
  { key: 4, label: "Hard", icon: null },
  { key: 5, label: "Expert", icon: null },
  { key: 6, label: "Nightmare", icon: null },
];

export const PROJECT_PLAYLISTS = [
  { key: "default", label: "Default", icon: null },
  { key: "desert", label: "Desert", icon: null },
  { key: "void", label: "Void", icon: null },
  { key: "OvO", label: "OvO", icon: null },
  { key: "mainmenu", label: "Main Menu", icon: null },
  { key: "CTF", label: "Capture The Flag", icon: null },
  { key: "tuto", label: "Tutorial", icon: null },
];

export const LEVEL_PLAYLISTS = [
  { key: "auto", label: "Auto", icon: null },
  ...PROJECT_PLAYLISTS,
];

export const DEFAULT_LEVEL_STRUCTURE = {
  name: "Untitled Level",
  instances: [],
  levelData: { ...DEFAULT_LEVEL_DATA },
  metaData: {
    created: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  },
};

const defaultInstances = [
  {
    objectType: "GenericShape",
    properties: {
      position: {
        value: {
          x: 1500,
          y: 1500,
          z: 0,
        },
        type: "position",
        label: "Position",
        key: "position",
      },
      size3D: {
        value: {
          x: 1024,
          y: 256,
          z: 64,
        },
        type: "scale3d",
        label: "Size",
        key: "size3D",
      },
      angle: {
        value: 0,
        type: "angle1d",
        label: "Angle",
        key: "angle",
      },
      shape: {
        value: "box",
        type: "selector",
        label: "Shape",
        key: "shape",
      },
      material: {
        value: "tiles",
        type: "selector",
        label: "Material",
        key: "material",
      },
      color: {
        value: "#ffffff",
        type: "color",
        label: "Color",
        key: "color",
      },
      deleteButton: {
        value: false,
        type: "button",
        label: "Actions",
        key: "deleteButton",
      },
    },
    uid: 999999,
  },
  {
    objectType: "GenericShape",
    properties: {
      position: {
        value: {
          x: 2250,
          y: 1500,
          z: 0,
        },
        type: "position",
        label: "Position",
        key: "position",
      },
      size3D: {
        value: {
          x: 512,
          y: 512,
          z: 64,
        },
        type: "scale3d",
        label: "Size",
        key: "size3D",
      },
      angle: {
        value: 0,
        type: "angle1d",
        label: "Angle",
        key: "angle",
      },
      shape: {
        value: "box",
        type: "selector",
        label: "Shape",
        key: "shape",
      },
      material: {
        value: "tiles",
        type: "selector",
        label: "Material",
        key: "material",
      },
      color: {
        value: "#ffffff",
        type: "color",
        label: "Color",
        key: "color",
      },
      deleteButton: {
        value: false,
        type: "button",
        label: "Actions",
        key: "deleteButton",
      },
    },
    uid: 1000000,
  },
  {
    objectType: "GenericShape",
    properties: {
      position: {
        value: {
          x: 750,
          y: 1500,
          z: 0,
        },
        type: "position",
        label: "Position",
        key: "position",
      },
      size3D: {
        value: {
          x: 512,
          y: 512,
          z: 64,
        },
        type: "scale3d",
        label: "Size",
        key: "size3D",
      },
      angle: {
        value: 0,
        type: "angle1d",
        label: "Angle",
        key: "angle",
      },
      shape: {
        value: "box",
        type: "selector",
        label: "Shape",
        key: "shape",
      },
      material: {
        value: "tiles",
        type: "selector",
        label: "Material",
        key: "material",
      },
      color: {
        value: "#ffffff",
        type: "color",
        label: "Color",
        key: "color",
      },
      deleteButton: {
        value: false,
        type: "button",
        label: "Actions",
        key: "deleteButton",
      },
    },
    uid: 1000001,
  },
  {
    objectType: "levelEditorEndZone",
    properties: {
      position: {
        value: {
          x: 750,
          y: 1500,
          z: 64,
        },
        type: "position",
        label: "Position",
        key: "position",
      },
      size3D: {
        value: {
          x: 510,
          y: 510,
          z: 512,
        },
        type: "scale3d",
        label: "Size",
        key: "size3D",
      },
      angle: {
        value: 0,
        type: "angle1d",
        label: "Angle",
        key: "angle",
      },
      color: {
        value: "#16b0fe",
        type: "color",
        label: "Color",
        key: "color",
      },
      deleteButton: {
        value: false,
        type: "button",
        label: "Actions",
        key: "deleteButton",
      },
    },
    uid: 1000002,
  },
  {
    objectType: "levelEditorStartZone",
    properties: {
      position: {
        value: {
          x: 2250,
          y: 1500,
          z: 64,
        },
        type: "position",
        label: "Position",
        key: "position",
      },
      size3D: {
        value: {
          x: 510,
          y: 510,
          z: 512,
        },
        type: "scale3d",
        label: "Size",
        key: "size3D",
      },
      angle: {
        value: 180,
        type: "angle1d",
        label: "Angle",
        key: "angle",
      },
      color: {
        value: "#ffffff",
        type: "color",
        label: "Color",
        key: "color",
      },
      deleteButton: {
        value: false,
        type: "button",
        label: "Actions",
        key: "deleteButton",
      },
    },
    uid: 1000003,
  },
];

/**
 * Create a new empty level with default settings
 * @param {string} levelName - Name for the new level
 * @returns {Object} New level structure
 */
/**
 * Create a new level from the project's template sources. Starts from the
 * built-in defaults, overlays the settings source's levelData (everything but
 * ghost runs), and takes the objects source's instances. When the two sources
 * differ, the objects source's groups + labelDictionary travel with its
 * instances (they are referenced by id). Either source may be null.
 * @param {string} levelName
 * @param {{settingsSource?: Object|null, objectsSource?: Object|null}} sources
 */
export function createLevelFromTemplate(
  levelName = "Untitled Level",
  { settingsSource = null, objectsSource = null } = {},
) {
  const clone = (v) => structuredClone(v);
  const level = createEmptyLevel(levelName);
  level.instances = clone(defaultInstances);
  level.levelData = clone(DEFAULT_LEVEL_DATA);

  if (settingsSource?.levelData) {
    const settings = clone(settingsSource.levelData);
    if (settings.extraData) delete settings.extraData.ghostPaths;
    level.levelData = { ...level.levelData, ...settings };
  }

  if (objectsSource) {
    level.instances = clone(objectsSource.instances || []);
    if (objectsSource !== settingsSource && objectsSource.levelData) {
      level.levelData.groups = clone(objectsSource.levelData.groups ?? []);
      level.levelData.labelDictionary = clone(
        objectsSource.levelData.labelDictionary ?? {},
      );
    }
    level.metaData.cameraTransform = clone(
      objectsSource.metaData?.cameraTransform || {},
    );
  }

  level.levelData.levelName = levelName;
  level.name = levelName;
  return level;
}

export function createEmptyLevel(levelName = "Untitled Level") {
  return {
    ...DEFAULT_LEVEL_STRUCTURE,
    name: levelName,
    instances: defaultInstances,
    levelData: {
      ...DEFAULT_LEVEL_DATA,
      levelName: levelName,
    },
    metaData: {
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    },
  };
}

/**
 * Create a new level by deep-copying an existing level (instances, level
 * settings incl. script/labels/ghost paths). Nothing is shared with the source.
 * @param {Object} existingLevel - Existing level to copy from
 * @param {string} newLevelName - Name for the new level
 * @returns {Object} New level structure with copied data
 */
export function createLevelFromExisting(
  existingLevel,
  newLevelName = "Copy of Level",
) {
  const clone = (v) => structuredClone(v);
  const now = new Date().toISOString();
  const levelData = clone(existingLevel.levelData || {});
  levelData.levelName = newLevelName;
  return {
    name: newLevelName,
    instances: clone(existingLevel.instances || []),
    levelData,
    metaData: {
      created: now,
      lastModified: now,
      cameraTransform: clone(existingLevel.metaData?.cameraTransform || {}),
    },
  };
}
