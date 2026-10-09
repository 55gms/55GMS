import {
  types,
  materials,
  isMaterialTransparent,
} from "../objectTypeDefinitions.js";
import { toRGBArray as colorToRgbArray } from "../scripting/api/color.js";
import { resolveMaterial } from "../materials/materialsManager.js";
import { onScatterShapeCreated } from "../../main.js";
import { stashEditorType } from "../scripting/gameApi.js";

const typeOverrides = {
  material: (data, instance, runtime) => {
    if (data.value !== undefined)
      applyMaterialToInstance(runtime, instance, data.value);
  },
  color: (data, instance) => {
    if (data.value !== undefined) {
      const effect = instance.effects.find((x) => x.name === "Cutout");
      const color = colorToRgbArray(data.value);
      if (effect) {
        effect.isActive = true;
        effect.setParameter(1, color);
        instance.colorRgb = [1, 1, 1];
      } else {
        instance.colorRgb = color;
      }
    }
  },
  fontColor: (data, instance) => {
    if (data.value !== undefined) {
      const effect = instance.effects.find((x) => x.name === "Cutout");
      const color = colorToRgbArray(data.value);
      if (effect) {
        effect.isActive = true;
        effect.setParameter(1, color);
        instance.fontColor = [1, 1, 1];
      } else {
        instance.fontColor = color;
      }
    }
  },
};

export function applyPropertyToInstance(runtime, instance, data) {
  const property = data.key;
  if (typeOverrides[property]) {
    typeOverrides[property](data, instance, runtime);
  } else {
    types[property].onChange(data, instance, { isEditor: false, runtime });
  }
}

const objectTypeOverrides = {
  GenericShape: "concreteShape",
  GenericScatterShape: "scatterShapeTest",
  levelEditorEndZone: "endZone",
  levelEditorStartZone: "startZone",
  levelEditorDoor: "door",
  levelEditorInspectable: "inspectable",
  SecretShape: "secret",
  levelEditorCharacter: "staticCharacter",
  levelEditorSoundSource: "levelEditorSoundSourceReal",
};

const typeTemplate = {
  door: "basicDoor",
  endZone: "default",
  startZone: "default",
};

function getObjectTypeName(type) {
  return objectTypeOverrides[type] || type;
}

const MATERIAL_FACES = ["back", "front", "left", "right", "top", "bottom"];

// Apply a material DATA object (the shape stored in `materials`) to a cube
// instance. Shared by level-load (by id, below) and the scripting custom-material
// path (which passes a freshly built data object).
export function applyMaterialDataToInstance(runtime, instance, material) {
  if (!material) {
    return;
  }
  instance.zTilingFactor = material?.zTilingFactor ?? 1;

  if (material?.meta?.groundType) {
    instance.instVars.groundType = material.meta.groundType;
  }
  if (material?.meta?.soundType) {
    instance.instVars.groundSoundType = material?.meta?.soundType;
  }

  instance.instVars.isWallrunable =
    material?.meta?.isWallrunable ?? instance.instVars.isWallrunable;

  instance.instVars.isWallClimbable =
    material?.meta?.isWallClimbable ?? instance.instVars.isWallClimbable;

  if (isMaterialTransparent(material)) {
    instance.moveToLayer(
      runtime.layout.getLayer("excludeFromIntermediatePost"),
    );
  } else {
    instance.moveToLayer(runtime.layout.getLayer("environment"));
  }

  for (const face of MATERIAL_FACES) {
    const f = material?.[face];
    if (f?.objectType) {
      instance.setFaceObject(face, runtime.objects[f.objectType]);
    } else if (f?.image) {
      instance.setFaceImage(face, f.image);
    } else {
      instance.setFaceImage(face, face);
    }
  }
}

function applyMaterialToInstance(runtime, instance, materialId) {
  // Resolve against the merged set (built-ins + custom). Fall back to the
  // default material so a deleted/dangling custom id still loads cleanly.
  const material = resolveMaterial(materialId) || materials.default;
  applyMaterialDataToInstance(runtime, instance, material);
}

function createInstanceTransparent(objectTypeName, runtime) {
  return runtime.objects[objectTypeName].createInstance(
    "environmentHigher",
    0,
    0,
    false,
    typeTemplate[objectTypeName],
  );
}

function createInstanceExcludeFromIntermediatePost(objectTypeName, runtime) {
  return runtime.objects[objectTypeName].createInstance(
    "excludeFromIntermediatePost",
    0,
    0,
    false,
    typeTemplate[objectTypeName],
  );
}

function createInstanceBase(objectTypeName, runtime) {
  return runtime.objects[objectTypeName].createInstance(
    "environment",
    0,
    0,
    false,
    typeTemplate[objectTypeName],
  );
}

const ObjectTypeCreator = {
  Text: createInstanceTransparent.bind(null, "Text"),
  TagSprite: createInstanceTransparent.bind(null, "TagSprite"),
  StripesTagTiled: createInstanceTransparent.bind(null, "StripesTagTiled"),
  ArrowTagTiled: createInstanceTransparent.bind(null, "ArrowTagTiled"),
  CrossTagTiled: createInstanceTransparent.bind(null, "CrossTagTiled"),
  startZone: createInstanceTransparent.bind(null, "startZone"),
  endZone: createInstanceTransparent.bind(null, "endZone"),
  wireMesh: createInstanceTransparent.bind(null, "wireMesh"),
  staticCharacter: createInstanceExcludeFromIntermediatePost.bind(
    null,
    "staticCharacter",
  ),
  levelEditorTrigger: createInstanceExcludeFromIntermediatePost.bind(
    null,
    "levelEditorTrigger",
  ),
  levelEditorDeathZone: createInstanceExcludeFromIntermediatePost.bind(
    null,
    "levelEditorDeathZone",
  ),
  levelEditorSoundSourceReal: createInstanceExcludeFromIntermediatePost.bind(
    null,
    "levelEditorSoundSourceReal",
  ),
};

const PostCreate = {
  scatterShapeTest: (instance) => {
    onScatterShapeCreated({ instance });
  },
  secret: (instance) => {
    instance.instVars.pickUpID = globalThis.levelLoader.currentLevelId;
  },
};

export function createInstance(runtime, objectTypeName) {
  if (ObjectTypeCreator[objectTypeName]) {
    return ObjectTypeCreator[objectTypeName](runtime);
  }
  return createInstanceBase(objectTypeName, runtime);
}

export function createInstanceFromData(runtime, instanceData) {
  const objectTypeName = getObjectTypeName(instanceData.objectType);
  if (!objectTypeName) {
    throw new Error(`Unknown object type: ${instanceData.objectType}`);
  }
  const objectType = runtime.objects[objectTypeName];
  if (!objectType) {
    throw new Error(`Unknown object type: ${objectTypeName}`);
  }
  const instance = createInstance(runtime, objectTypeName);
  // Record the EDITOR object-type (e.g. "GenericShape") so the script runtime's
  // facade generator can look up this instance's inspector definition.
  stashEditorType(instance, instanceData.objectType);

  const entries = Object.entries(instanceData.properties || {});
  for (let i = entries.length - 1; i >= 0; i--) {
    const [key, propData] = entries[i];
    applyPropertyToInstance(runtime, instance, propData);
  }

  if (PostCreate[objectTypeName]) {
    PostCreate[objectTypeName](instance);
  }

  return instance;
}
