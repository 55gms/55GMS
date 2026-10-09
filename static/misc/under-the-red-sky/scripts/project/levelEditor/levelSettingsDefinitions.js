import { SKYBOX_OPTIONS, LEVEL_PLAYLISTS } from "./defaultLevelData.js";
import { openScriptEditor } from "./scripting/scriptEditorDialog.js";

function getLevelSettings() {
  return globalThis._editorScope?.levelSettings;
}

function getLevelData() {
  return getLevelSettings()?.levelData;
}

function updateLevelData(key, value) {
  getLevelSettings()?.updateLevelData(key, value);
}

function getValue(key) {
  const data = getLevelData();
  if (!data) return undefined;
  if (key.includes(".")) {
    const keys = key.split(".");
    let current = data;
    for (const k of keys) {
      if (current == null) return undefined;
      current = current[k];
    }
    return current;
  }
  return data[key];
}

export const levelSettingsTypes = [
  // ── General ──
  {
    properties: {
      key: "levelName",
      type: "text",
      label: "Level Name",
      originalKey: "levelName",
      placeholder: "Enter level name",
    },
    getValue: () => getValue("levelName") || "",
    onChange: (data) => updateLevelData("levelName", data.value),
  },
  {
    properties: {
      key: "levelSize",
      type: "scale2d",
      label: "Level Size",
      originalKey: "levelSize",
      axes: ["width", "height"],
      step: 1,
      min: 1,
      max: 100000,
    },
    getValue: () => {
      const s = getValue("levelSize") || { width: 3000, height: 3000 };
      return { width: s.width, height: s.height };
    },
    onChange: (data) => updateLevelData("levelSize", data.fullValue),
  },
  {
    properties: {
      key: "isHub",
      type: "checkbox",
      label: "Hub Level",
      originalKey: "isHub",
      description:
        "Untimed hub: no timer or star times, hub-style transitions, no ghost recording.",
      checkboxLabel: "This level is a hub",
    },
    getValue: () => getValue("isHub") ?? false,
    onChange: (data) => updateLevelData("isHub", !!data.value),
  },
  {
    properties: {
      key: "isOnline",
      type: "checkbox",
      label: "Online",
      originalKey: "isOnline",
      description:
        "Allow online play in this level. Off spawns the game's no-online marker.",
      checkboxLabel: "Level is playable online",
    },
    getValue: () => getValue("isOnline") ?? true,
    onChange: (data) => updateLevelData("isOnline", !!data.value),
  },
  {
    properties: {
      key: "levelPlaylist",
      type: "carousel",
      label: "Playlist",
      originalKey: "levelPlaylist",
      options: LEVEL_PLAYLISTS,
    },
    getValue: () => getValue("levelPlaylist") || "auto",
    onChange: (data) => updateLevelData("levelPlaylist", data.value),
  },

  // ── Environment ──
  {
    properties: {
      key: "skyboxType",
      type: "carousel",
      label: "Skybox",
      originalKey: "skyboxType",
      options: SKYBOX_OPTIONS,
    },
    getValue: () => getValue("skyboxType") || "frosty",
    onChange: (data) => updateLevelData("skyboxType", data.value),
  },
  {
    properties: {
      key: "skyColor",
      type: "colorOverride",
      label: "Sky Color",
      originalKey: "skyColor",
      overrideKey: "overrideSkyTint",
      overrideLabel: "Override",
    },
    getValue: () => ({
      override: getValue("overrideSkyTint") || false,
      color: getValue("skyColor") || "#FFFFFF",
    }),
    onChange: (data) => {
      const val = data.value;
      if (val.override !== undefined) updateLevelData("overrideSkyTint", val.override);
      if (val.color !== undefined) updateLevelData("skyColor", val.color);
    },
  },
  {
    properties: {
      key: "fogColor",
      type: "colorOverride",
      label: "Fog Color",
      originalKey: "fogColor",
      overrideKey: "overrideFogColor",
      overrideLabel: "Override",
    },
    getValue: () => ({
      override: getValue("overrideFogColor") || false,
      color: getValue("fogColor") || "#87CEEB",
    }),
    onChange: (data) => {
      const val = data.value;
      if (val.override !== undefined) updateLevelData("overrideFogColor", val.override);
      if (val.color !== undefined) updateLevelData("fogColor", val.color);
    },
  },
  {
    properties: {
      key: "fogDensity",
      type: "numberOverride",
      label: "Fog Density",
      originalKey: "fogDensity",
      overrideKey: "overrideFogDensity",
      overrideLabel: "Override",
      min: 0,
      max: 1,
      step: 0.01,
      precision: 2,
      dragSpeed: 0.01,
    },
    getValue: () => ({
      override: getValue("overrideFogDensity") || false,
      value: getValue("fogDensity") ?? 0.1,
    }),
    onChange: (data) => {
      const val = data.value;
      if (val.override !== undefined) updateLevelData("overrideFogDensity", val.override);
      if (val.value !== undefined) updateLevelData("fogDensity", val.value);
    },
  },

  // ── Level Times ──
  {
    properties: {
      key: "star1",
      type: "number",
      label: "Star 1",
      originalKey: "star1",
      min: 0,
      step: 1,
      precision: 0,
      dragSpeed: 1,
    },
    getValue: () => getValue("levelTimes.star1") ?? 0,
    onChange: (data) => updateLevelData("levelTimes.star1", data.value),
  },
  {
    properties: {
      key: "star2",
      type: "number",
      label: "Star 2",
      originalKey: "star2",
      min: 0,
      step: 1,
      precision: 0,
      dragSpeed: 1,
    },
    getValue: () => getValue("levelTimes.star2") ?? 0,
    onChange: (data) => updateLevelData("levelTimes.star2", data.value),
  },
  {
    properties: {
      key: "star3",
      type: "number",
      label: "Star 3",
      originalKey: "star3",
      min: 0,
      step: 1,
      precision: 0,
      dragSpeed: 1,
    },
    getValue: () => getValue("levelTimes.star3") ?? 0,
    onChange: (data) => updateLevelData("levelTimes.star3", data.value),
  },
  {
    properties: {
      key: "star4",
      type: "number",
      label: "Star 4",
      originalKey: "star4",
      min: 0,
      step: 1,
      precision: 0,
      dragSpeed: 1,
    },
    getValue: () => getValue("levelTimes.star4") ?? 0,
    onChange: (data) => updateLevelData("levelTimes.star4", data.value),
  },

  // ── Editor Settings ──
  {
    properties: {
      key: "gridSize",
      type: "scale3d",
      label: "Grid Size",
      originalKey: "gridSize",
      step: 1,
      min: 1,
      max: 200,
    },
    getValue: () => {
      const s = getValue("gridSettings.size") || { x: 64, y: 64, z: 64 };
      return { x: s.x, y: s.y, z: s.z };
    },
    onChange: (data) => updateLevelData("gridSettings.size", data.fullValue),
  },
  {
    properties: {
      key: "snapToGrid",
      type: "checkbox",
      label: "Snap to Grid",
      originalKey: "snapToGrid",
      description: "Snap to Grid",
    },
    getValue: () => getValue("gridSettings.snapToGrid") ?? true,
    onChange: (data) => updateLevelData("gridSettings.snapToGrid", data.value),
  },
  {
    properties: {
      key: "angleSnap",
      type: "number",
      label: "Angle Snap",
      originalKey: "angleSnap",
      suffix: "°",
      min: 0,
      max: 90,
      step: 1,
      precision: 0,
      dragSpeed: 1,
    },
    getValue: () => getValue("gridSettings.angleSnap") ?? 15,
    onChange: (data) => updateLevelData("gridSettings.angleSnap", data.value),
  },
  {
    properties: {
      key: "backgroundColor",
      type: "color",
      label: "Background Color",
      originalKey: "backgroundColor",
    },
    getValue: () => getValue("gridSettings.backgroundColor") || "#1a1a1a",
    onChange: (data) => updateLevelData("gridSettings.backgroundColor", data.value),
  },
  {
    properties: {
      key: "gridColor",
      type: "color",
      label: "Grid Color",
      originalKey: "gridColor",
    },
    getValue: () => getValue("gridSettings.gridColor") || "#4d4d4d",
    onChange: (data) => updateLevelData("gridSettings.gridColor", data.value),
  },
  {
    properties: {
      key: "showTargetGizmo",
      type: "checkbox",
      label: "Show Orbit Target",
      originalKey: "showTargetGizmo",
      description: "Show the orbit target crosshair in the viewport",
    },
    getValue: () => getValue("cameraSettings.showTargetGizmo") ?? true,
    onChange: (data) => updateLevelData("cameraSettings.showTargetGizmo", data.value),
  },
  {
    properties: {
      key: "targetGizmoColor",
      type: "color",
      label: "Orbit Target Color",
      originalKey: "targetGizmoColor",
    },
    getValue: () => getValue("cameraSettings.targetGizmoColor") || "#4A90D9",
    onChange: (data) => updateLevelData("cameraSettings.targetGizmoColor", data.value),
  },
  {
    properties: {
      key: "moveSpeed",
      type: "number",
      label: "Camera Speed",
      originalKey: "moveSpeed",
      min: 50,
      max: 1000,
      step: 10,
      precision: 0,
      dragSpeed: 5,
    },
    getValue: () => getValue("cameraSettings.moveSpeed") ?? 800,
    onChange: (data) => updateLevelData("cameraSettings.moveSpeed", data.value),
  },
  {
    properties: {
      key: "rotationSpeed",
      type: "number",
      label: "Rotation Speed",
      originalKey: "rotationSpeed",
      min: 0.1,
      max: 5.0,
      step: 0.1,
      precision: 1,
      dragSpeed: 0.1,
    },
    getValue: () => getValue("cameraSettings.rotationSpeed") ?? 1,
    onChange: (data) => updateLevelData("cameraSettings.rotationSpeed", data.value),
  },

  // ── Scripting ──
  {
    properties: {
      key: "editScript",
      type: "button",
      label: "Script",
      originalKey: "editScript",
      buttonText: "Edit Level Script…",
      variant: "primary",
    },
    getValue: () => false,
    onChange: () => openScriptEditor(),
  },
];

export const levelSettingsGroups = [
  {
    id: "general",
    label: "General",
    keys: ["levelName", "levelSize", "levelPlaylist", "isHub", "isOnline"],
  },
  {
    id: "environment",
    label: "Environment",
    keys: ["skyboxType", "skyColor", "fogColor", "fogDensity"],
  },
  {
    id: "levelTimes",
    label: "Level Times",
    keys: ["star1", "star2", "star3", "star4"],
  },
  {
    id: "editor",
    label: "Editor",
    keys: [
      "gridSize",
      "snapToGrid",
      "angleSnap",
      "backgroundColor",
      "gridColor",
      "showTargetGizmo",
      "targetGizmoColor",
      "moveSpeed",
      "rotationSpeed",
    ],
  },
  {
    id: "scripting",
    label: "Scripting",
    keys: ["editScript"],
  },
];
