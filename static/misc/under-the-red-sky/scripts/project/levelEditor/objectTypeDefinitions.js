// Object Type Definitions for Inspector UI
// Defines how different object types are displayed and edited in the inspector
import { Box, Prism, Wedge, Pyramid, CornerOut, CornerIn } from "./iconList.js";
import { getImageFromObject } from "./imageHelper.js";
import { TRANSPARENT_TEXTURES } from "./textureList.js";
// Custom materials live in per-project sharedData. These bindings are only ever
// read at call time (inside the selector `options` getter and the apply path),
// never at module-evaluation time, so the materials<->materialsManager import
// cycle is safe.
import {
  getMaterialsManager,
  resolveMaterial,
} from "./materials/materialsManager.js";
// Generic color coercion (accepts hex / {r,g,b} / {h,s,l} / [r,g,b], all 0–1).
import {
  toRGBArray as colorToRgbArray,
  toHex as colorToHex,
} from "./scripting/api/color.js";
// {keybind:action} / {icon:name} / {key:code} token resolution for Text content
// — keeps level-editor texts in sync with the keybind/input-device glyph system
// (see types.text).
import { resolveIconTokens } from "../inputBindingDisplay.js";

// ============================================
// OBJECT TYPE DEFINITIONS
// ============================================

export const selectableObjects = [
  "GenericShape",
  "GenericScatterShape",
  "Text",

  "levelEditorEndZone",
  "levelEditorStartZone",
  "levelEditorDoor",

  "cctvCamera",
  "cable",
  "Cone",
  "Pipe",
  "cornerTarp",
  "edgeTarp",

  "pole",
  "snowman",
  "railing",
  "wireMesh",
  "brokenConcretePillar",
  "cardboardBoxProp",
  "grass",
  "rocks",
  "trash",
  "trashBag",

  // "spring",
  "SecretShape",

  "levelEditorCharacter",

  "TagSprite",
  "StripesTagTiled",
  "ArrowTagTiled",
  "CrossTagTiled",

  "levelEditorInspectable",
  "pressurePlate1",
  "levelEditorTrigger",
  "levelEditorDeathZone",
  "levelEditorSoundSource",

  "checkpoint",
  "levelEditorOverlapConfirmer",
];

const objectTypeNameMap = {
  GenericShape: "Shape",
  GenericScatterShape: "Scatter Shape",
  Text: "Text",
  levelEditorEndZone: "End Zone",
  levelEditorStartZone: "Start Zone",
  levelEditorDoor: "Door",
  cctvCamera: "Camera",
  cable: "Cable",
  Cone: "Cone",
  Pipe: "Pipe",
  cornerTarp: "Edge Tarp",
  edgeTarp: "Corner Tarp",
  pole: "Pole",
  snowman: "Snowman",
  railing: "Railing",
  wireMesh: "Wire Mesh",
  cardboardBoxProp: "Cardboard Box",
  grass: "Grass",
  rocks: "Rocks",
  trash: "Trash",
  trashBag: "Trash Bag",
  brokenConcretePillar: "Broken Pillar",
  SecretShape: "Secret",
  levelEditorCharacter: "Character Mannequin",
  TagSprite: "Tag",
  TagTiled: "Tiled Tag",
  StripesTagTiled: "Stripes",
  ArrowTagTiled: "Arrows",
  CrossTagTiled: "Crosses",
  levelEditorInspectable: "Inspectable",
  Unknown: "Unknown",
  pressurePlate1: "Pressure Plate",
  levelEditorTrigger: "Trigger",
  levelEditorDeathZone: "Death Zone",
  levelEditorOverlapConfirmer: "Overlap Confirmer",
};

export const getObjectTypeName = (type) => objectTypeNameMap[type] || "Unknown";

// Object types that can be placed like tags (surface-aligned placement)
export const tagPlaceableObjectTypes = [
  "Text",
  "TagSprite",
  "StripesTagTiled",
  "ArrowTagTiled",
  "CrossTagTiled",
];

const models = [
  {
    value: "glb/trafficCone.glb",
    label: "Cone",
  },
  {
    value: "glb/prop_cardboardBox.glb",
    label: "Cardboard Box",
  },
  {
    value: "glb/prop_grass.glb",
    label: "Grass",
  },
  {
    value: "glb/prop_rocks.glb",
    label: "Rocks",
  },
  {
    value: "glb/prop_trash.glb",
    label: "Trash",
  },
  {
    value: "glb/prop_trashBag.glb",
    label: "TrashBag",
  },
  {
    value: "glb/brokenConcretePillar.glb",
    label: "Broken Concrete Pillar",
  },
];

// The Tag object's selectable tags mirror the TagSprite object's animation
// list, so the two can never drift. Rather than hand-maintaining the list, we
// read the animations straight from the Construct 3 runtime: the sprite's
// ObjectClass exposes its animations as `_animations`, each of which reports
// its name via `GetName()`. This is the same runtime access path used by
// imageHelper.js (globalThis.sdk_runtime._objectClassesByName).
const tags = [];
let tagsPopulated = false;

function populateTags() {
  if (tagsPopulated) return tags;

  const objectClass =
    globalThis.sdk_runtime?._objectClassesByName?.get("tagsprite");
  const animations = objectClass?._animations;
  // Runtime not ready yet: leave tags empty and retry on the next access.
  if (!animations || animations.length === 0) return tags;

  // Fill in place so any array reference already handed out (e.g. copied into
  // an inspector component's config) sees the populated entries too.
  tags.length = 0;
  for (const animation of animations) {
    const name = animation.GetName();
    tags.push({
      value: name,
      label: name,
      image: getImageFromObject.bind(null, "TagSprite", name),
    });
  }
  tagsPopulated = true;
  return tags;
}

export const GROUND_TYPES = {
  default: {
    value: "default",
    label: "Default",
  },
  slippery: {
    value: "slippery",
    label: "Slippery",
  },
  bounce: {
    value: "bounce",
    label: "Bounce",
  },
  speed: {
    value: "speed",
    label: "Speed",
  },
  slow: {
    value: "slow",
    label: "Slow",
  },
};

export const SOUND_TYPES = {
  default: {
    value: "default",
    label: "Default",
  },
  metal: {
    value: "metal",
    label: "Metal",
  },
  snow: {
    value: "snow",
    label: "Snow",
  },
};

const SOUNDS = [
  "achievement",
  "boing",
  "bounce",
  "buttonClick",
  "calebdeath",
  "cameraShutter",
  "clack",
  "clack2",
  "clothHit",
  "clunky",
  "coin1",
  "dash",
  "Death",
  "Death-2",
  "door",
  "doorSlam",
  "electricHum",
  "emote",
  "emoteNotification",
  "equip",
  "etheralWoosh",
  "fallLoop",
  "fanfarehi2",
  "finish",
  "flagLoop",
  "footstep",
  "footstepMetal",
  "footstepSnow1",
  "footstepSnow2",
  "ghostBeg0",
  "ghostBeg1",
  "ghostBeg2",
  "glassTickler",
  "glide",
  "glitch0",
  "glitch1",
  "glitch2",
  "glitch3",
  "heartbeat",
  "heavyDrop",
  "highClick",
  "highMenu",
  "iceSqueak",
  "JumpBoost",
  "launch",
  "machineryLoop",
  "mudstep0",
  "mudstep1",
  "oneShot",
  "pickedUp",
  "pickUp",
  "pling",
  "powerUpLoop",
  "powerUpOff",
  "powerUpPickedUp",
  "reload",
  "reset",
  "run",
  "slide",
  "slideLoop",
  "sonar",
  "speedStep",
  "startSlowMo",
  "stinger",
  "stopSlowMo",
  "subwayArriving",
  "travel",
  "unlock",
  "unlocked",
  "wallJump",
];

export const materials = {
  default: {
    value: "default",
    label: "Base",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "whiteTexture",
    },
    front: {
      objectType: "whiteTexture",
    },
    left: {
      objectType: "whiteTexture",
    },
    right: {
      objectType: "whiteTexture",
    },
    top: {
      objectType: "whiteTexture",
    },
    bottom: {
      objectType: "whiteTexture",
    },
  },
  yellowWall: {
    value: "yellowWall",
    label: "Yellow Wall",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "whiteTexture",
    },
    front: {
      objectType: "whiteTexture",
    },
    left: {
      objectType: "yellowWhiteTexture",
    },
    right: {
      objectType: "yellowWhiteTexture",
    },
    top: {
      objectType: "yellowWhiteTexture",
    },
    bottom: {
      objectType: "yellowWhiteTexture",
    },
  },
  tiles: {
    value: "tiles",
    label: "Tiles",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "TilesTexture",
    },
    front: {
      objectType: "TilesTexture",
    },
    left: {
      objectType: "TilesTexture",
    },
    right: {
      objectType: "TilesTexture",
    },
    top: {
      objectType: "TilesTexture",
    },
    bottom: {
      objectType: "TilesTexture",
    },
  },
  concrete: {
    value: "concrete",
    label: "Concrete",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "concreteTextureUnderside",
    },
    front: {
      objectType: "concreteTexture",
    },
    left: {
      objectType: "concreteTexture",
    },
    right: {
      objectType: "concreteTexture",
    },
    top: {
      objectType: "concreteTexture",
    },
    bottom: {
      objectType: "concreteTexture",
    },
  },
  tilesDark: {
    value: "tilesDark",
    label: "Tiles Dark",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "TilesTextureDark",
    },
    front: {
      objectType: "TilesTextureDark",
    },
    left: {
      objectType: "TilesTextureDark",
    },
    right: {
      objectType: "TilesTextureDark",
    },
    top: {
      objectType: "TilesTextureDark",
    },
    bottom: {
      objectType: "TilesTextureDark",
    },
  },
  darkTar: {
    value: "darkTar",
    label: "Dark Tar",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "darkTarTexture",
    },
    front: {
      objectType: "darkTarTexture",
    },
    left: {
      objectType: "darkTarTexture",
    },
    right: {
      objectType: "darkTarTexture",
    },
    top: {
      objectType: "darkTarTexture",
    },
    bottom: {
      objectType: "darkTarTexture",
    },
  },
  verticalPanel: {
    value: "verticalPanel",
    label: "Vertical Panel",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "verticalPanelTexture",
    },
    front: {
      objectType: "verticalPanelTexture",
    },
    left: {
      objectType: "verticalPanelTexture",
    },
    right: {
      objectType: "verticalPanelTexture",
    },
    top: {
      objectType: "verticalPanelTexture",
    },
    bottom: {
      objectType: "verticalPanelTexture",
    },
  },
  brick: {
    value: "brick",
    label: "Brick",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "brickTexture",
    },
    front: {
      objectType: "brickTexture",
    },
    left: {
      objectType: "brickTexture",
    },
    right: {
      objectType: "brickTexture",
    },
    top: {
      objectType: "brickTexture",
    },
    bottom: {
      objectType: "brickTexture",
    },
  },
  container: {
    value: "container",
    label: "Container",
    zTilingFactor: 1,
    cubeDepthRatio: 1.5,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.metal.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "containerSides",
    },
    front: {
      objectType: "containerSides",
    },
    left: {
      objectType: "containerShortSide",
    },
    right: {
      objectType: "containerShortSide",
    },
    top: {
      objectType: "containerSides",
    },
    bottom: {
      objectType: "containerSides",
    },
  },
  metal: {
    value: "metal",
    label: "Metal Grate",
    zTilingFactor: 1,
    cubeHeightRatio: 0.2,
    cubeTopVisibility: 20,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.metal.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: true,
    back: {
      objectType: "powerBoxSideTexture",
    },
    front: {
      objectType: "gridTexture",
    },
    left: {
      objectType: "powerBoxSideTexture",
    },
    right: {
      objectType: "powerBoxSideTexture",
    },
    top: {
      objectType: "powerBoxSideTexture",
    },
    bottom: {
      objectType: "powerBoxSideTexture",
    },
  },
  metalGrid: {
    value: "metalGrid",
    label: "Metal Grid",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.metal.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: true,
    back: {
      objectType: "gridTexture",
    },
    front: {
      objectType: "gridTexture",
    },
    left: {
      objectType: "gridTexture",
    },
    right: {
      objectType: "gridTexture",
    },
    top: {
      objectType: "gridTexture",
    },
    bottom: {
      objectType: "gridTexture",
    },
  },
  bounce: {
    value: "bounce",
    label: "Bounce",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.bounce.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "tarpTexture",
    },
    front: {
      objectType: "tarpTexture",
    },
    left: {
      objectType: "tarpTexture",
    },
    right: {
      objectType: "tarpTexture",
    },
    top: {
      objectType: "tarpTexture",
    },
    bottom: {
      objectType: "tarpTexture",
    },
  },
  speed: {
    value: "speed",
    label: "Speed",
    zTilingFactor: 1,
    cubeHeightRatio: 0.2,
    cubeTopVisibility: 20,
    meta: {
      groundType: GROUND_TYPES.speed.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "TilesTexture",
    },
    front: {
      objectType: "speedTexture",
    },
    left: {
      objectType: "TilesTexture",
    },
    right: {
      objectType: "TilesTexture",
    },
    top: {
      objectType: "TilesTexture",
    },
    bottom: {
      objectType: "TilesTexture",
    },
  },
  woodPlanks: {
    value: "woodPlanks",
    label: "Wood Planks",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "woodPlanksTexture",
    },
    front: {
      objectType: "woodPlanksTexture",
    },
    left: {
      objectType: "woodPlanksTexture",
    },
    right: {
      objectType: "woodPlanksTexture",
    },
    top: {
      objectType: "woodPlanksTexture",
    },
    bottom: {
      objectType: "woodPlanksTexture",
    },
  },
  sandstoneBricks: {
    value: "sandstoneBricks",
    label: "Sandstone Bricks",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "sandstoneBricksTexture",
    },
    front: {
      objectType: "sandstoneBricksTexture",
    },
    left: {
      objectType: "sandstoneBricksTexture",
    },
    right: {
      objectType: "sandstoneBricksTexture",
    },
    top: {
      objectType: "sandstoneBricksTexture",
    },
    bottom: {
      objectType: "sandstoneBricksTexture",
    },
  },
  sandstone: {
    value: "sandstone",
    label: "Sandstone",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "sandStoneTexture",
    },
    front: {
      objectType: "sandStoneTexture",
    },
    left: {
      objectType: "sandStoneTexture",
    },
    right: {
      objectType: "sandStoneTexture",
    },
    top: {
      objectType: "sandStoneTexture",
    },
    bottom: {
      objectType: "sandStoneTexture",
    },
  },
  // snowTiles: {
  //   value: "snowTiles",
  //   label: "Snow Tiles",
  //   zTilingFactor: 1,
  //   meta: {
  //     groundType: GROUND_TYPES.default.value,
  //     soundType: SOUND_TYPES.snow.value,
  //     isWallrunable: true,
  //     isWallClimbable: true,
  //   },
  //   transparent: false,
  //   back: {
  //     objectType: "snowTiles9p",
  //   },
  //   front: {
  //     objectType: "snowTopTexture",
  //   },
  //   left: {
  //     objectType: "snowTiles9p",
  //   },
  //   right: {
  //     objectType: "snowTiles9p",
  //   },
  //   top: {
  //     objectType: "snowTiles9p",
  //   },
  //   bottom: {
  //     objectType: "snowTiles9p",
  //   },
  // },
  ice: {
    value: "ice",
    label: "Ice",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.slippery.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "iceTexture",
    },
    front: {
      objectType: "iceTexture",
    },
    left: {
      objectType: "iceTexture",
    },
    right: {
      objectType: "iceTexture",
    },
    top: {
      objectType: "iceTexture",
    },
    bottom: {
      objectType: "iceTexture",
    },
  },
  plank: {
    value: "plank",
    label: "Plank",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "plankTexture",
    },
    front: {
      objectType: "plankTexture",
    },
    left: {
      objectType: "plankTexture",
    },
    right: {
      objectType: "plankTexture",
    },
    top: {
      objectType: "plankTexture",
    },
    bottom: {
      objectType: "plankTexture",
    },
  },
  ventPipe: {
    value: "ventPipe",
    label: "Vent Pipe",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.metal.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "ventShaftTileTexture",
    },
    front: {
      objectType: "vent",
    },
    left: {
      objectType: "ventShaftTileSquashedTexture",
    },
    right: {
      objectType: "ventShaftTileSquashedTexture",
    },
    top: {
      objectType: "ventShaftTileTexture",
    },
    bottom: {
      objectType: "ventShaftTileTexture",
    },
  },
  box: {
    value: "box",
    label: "Box",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "dirtyEdgesTexture",
    },
    front: {
      objectType: "cardBoardBox",
    },
    left: {
      objectType: "dirtyEdgesTexture",
    },
    right: {
      objectType: "dirtyEdgesTexture",
    },
    top: {
      objectType: "dirtyEdgesTexture",
    },
    bottom: {
      objectType: "dirtyEdgesTexture",
    },
  },
  glass: {
    value: "glass",
    label: "Glass",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: true,
    back: {
      objectType: "glassTexture",
    },
    front: {
      objectType: "glassTexture",
    },
    left: {
      objectType: "glassTexture",
    },
    right: {
      objectType: "glassTexture",
    },
    top: {
      objectType: "glassTexture",
    },
    bottom: {
      objectType: "glassTexture",
    },
  },
  powerBox: {
    value: "powerBox",
    label: "Power Box",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.metal.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "powerBoxTopTexture",
    },
    front: {
      objectType: "powerBoxTopTexture",
    },
    left: {
      objectType: "powerBoxSideTexture",
    },
    right: {
      objectType: "powerBoxSideTexture",
    },
    top: {
      objectType: "powerBoxSideTexture",
    },
    bottom: {
      objectType: "powerBoxSideTexture",
    },
  },
  solidColor: {
    value: "solidColor",
    label: "Solid Color",
    zTilingFactor: 1,
    meta: {
      groundType: GROUND_TYPES.default.value,
      soundType: SOUND_TYPES.default.value,
      isWallrunable: true,
      isWallClimbable: true,
    },
    transparent: false,
    back: {
      objectType: "whiteFillTexture",
    },
    front: {
      objectType: "whiteFillTexture",
    },
    left: {
      objectType: "whiteFillTexture",
    },
    right: {
      objectType: "whiteFillTexture",
    },
    top: {
      objectType: "whiteFillTexture",
    },
    bottom: {
      objectType: "whiteFillTexture",
    },
  },
  // edges: {
  //   value: "edges",
  //   label: "Edges",
  //   zTilingFactor: 1,
  //   meta: {
  //     groundType: GROUND_TYPES.default.value,
  //     soundType: SOUND_TYPES.default.value,
  //     isWallrunable: true,
  //     isWallClimbable: true,
  //   },
  //   transparent: true,
  //   back: {
  //     objectType: "edgesTexture",
  //   },
  //   front: {
  //     objectType: "edgesTexture",
  //   },
  //   left: {
  //     objectType: "edgesTexture",
  //   },
  //   right: {
  //     objectType: "edgesTexture",
  //   },
  //   top: {
  //     objectType: "edgesTexture",
  //   },
  //   bottom: {
  //     objectType: "edgesTexture",
  //   },
  // },
};

const ALL_FACES = ["back", "front", "left", "right", "top", "bottom"];

// True when any face of the material uses a transparent texture.
export function isMaterialTransparent(material) {
  if (!material) return false;
  for (const face of ALL_FACES) {
    const ot = material[face]?.objectType;
    if (ot && TRANSPARENT_TEXTURES.has(ot)) return true;
  }
  return false;
}

// UTRS is Z-up; C3 stores cube faces with its own -Y-up naming, which is
// confusing to author against. These maps let the editor UI and scripting API
// present faces by the names users expect (Z-up) while the stored data keeps
// C3's names untouched. Derived from the (validated) cube-preview remap.
export const FACE_USER_TO_STORAGE = {
  top: "front",
  bottom: "back",
  left: "top",
  right: "bottom",
  front: "left",
  back: "right",
};
export const FACE_STORAGE_TO_USER = Object.fromEntries(
  Object.entries(FACE_USER_TO_STORAGE).map(([u, s]) => [s, u]),
);
// User-facing face order for UI iteration / scripting accessors.
export const USER_FACES = ["top", "bottom", "front", "back", "left", "right"];

// Build a single material selector option (value/label + cube preview). Shared
// by built-in and custom materials. The face remap matches the original
// inspector layout; the cube face thunks are lazy so images load on demand.
function buildMaterialOption(material) {
  return {
    value: material.value,
    label: material.label,
    cube: {
      top: () => getImageFromObject(material.front?.objectType),
      left: () => getImageFromObject(material.top?.objectType),
      right: () => getImageFromObject(material.bottom?.objectType),
      front: () => getImageFromObject(material.left?.objectType),
      back: () => getImageFromObject(material.right?.objectType),
      bottom: () => getImageFromObject(material.back?.objectType),
      // Optional per-material preview tuning.
      height: material.cubeHeightRatio || 1,
      depth: material.cubeDepthRatio || 1,
      topVisibility: material.cubeTopVisibility || 0,
    },
  };
}

// Built-in materials first (read-only), then this project's custom materials.
function buildMaterialOptions() {
  const builtin = Object.values(materials).map(buildMaterialOption);
  const mgr = getMaterialsManager?.();
  const custom = mgr ? mgr.listMaterials().map(buildMaterialOption) : [];
  return [...builtin, ...custom];
}

// End zone "Next Level" — stored on the end zone's own instance variables
// (both the editor and runtime object types carry them):
//   override    = "" | END_ZONE_EXIT | <level id>
//   goToNext    = override === ""     (follow pack order)
//   travelingTo = target level name   (drives the in-level "leads to" UI)
// levelLoader.onLevelComplete(endZone) reads override back at play time.
export const END_ZONE_EXIT = "__exit__";

function projectLevels() {
  return (
    globalThis._editorScope?.projectManager?.getAllLevels?.() ||
    globalThis.levelLoader?.loadedProject?.levels ||
    {}
  );
}

function lookupLevelName(levelId) {
  return projectLevels()[levelId]?.levelData?.levelName || "";
}

function buildNextLevelOptions() {
  const options = [
    { value: "", label: "Default (next in order)" },
    { value: END_ZONE_EXIT, label: "Exit (leave the pack)" },
  ];
  for (const [id, level] of Object.entries(projectLevels())) {
    options.push({ value: id, label: level?.levelData?.levelName || id });
  }
  return options;
}

export function applyMaterialToInstance(instance, materialId) {
  // Resolve against the merged set (built-ins + custom). Fall back to the
  // default material so a stale/dangling id (e.g. a custom material that was
  // deleted) still renders something instead of throwing.
  const material = resolveMaterial(materialId) || materials.default;
  if (!material) {
    return;
  }
  instance.zTilingFactor = material?.zTilingFactor ?? 1;
  instance._materialId = materialId;

  if (isMaterialTransparent(material)) {
    instance.moveToLayer(
      globalThis._editorScope.runtime.layout.getLayer("Main_Transparent"),
    );
  } else {
    instance.moveToLayer(
      globalThis._editorScope.runtime.layout.getLayer("Main"),
    );
  }

  if (material?.back?.objectType) {
    instance.setFaceObject(
      "back",
      globalThis._editorScope.runtime.objects[material.back.objectType],
    );
  } else if (material?.back?.image) {
    instance.setFaceImage("back", material.back.image);
  } else {
    instance.setFaceImage("back", "back");
  }

  if (material?.front?.objectType) {
    instance.setFaceObject(
      "front",
      globalThis._editorScope.runtime.objects[material.front.objectType],
    );
  } else if (material?.front?.image) {
    instance.setFaceImage("front", material.front.image);
  } else {
    instance.setFaceImage("front", "front");
  }

  if (material?.left?.objectType) {
    instance.setFaceObject(
      "left",
      globalThis._editorScope.runtime.objects[material.left.objectType],
    );
  } else if (material?.left?.image) {
    instance.setFaceImage("left", material.left.image);
  } else {
    instance.setFaceImage("left", "left");
  }

  if (material?.right?.objectType) {
    instance.setFaceObject(
      "right",
      globalThis._editorScope.runtime.objects[material.right.objectType],
    );
  } else if (material?.right?.image) {
    instance.setFaceImage("right", material.right.image);
  } else {
    instance.setFaceImage("right", "right");
  }

  if (material?.top?.objectType) {
    instance.setFaceObject(
      "top",
      globalThis._editorScope.runtime.objects[material.top.objectType],
    );
  } else if (material?.top?.image) {
    instance.setFaceImage("top", material.top.image);
  } else {
    instance.setFaceImage("top", "top");
  }

  if (material?.bottom?.objectType) {
    instance.setFaceObject(
      "bottom",
      globalThis._editorScope.runtime.objects[material.bottom.objectType],
    );
  } else if (material?.bottom?.image) {
    instance.setFaceImage("bottom", material.bottom.image);
  } else {
    instance.setFaceImage("bottom", "bottom");
  }
}

export const PlacementConstraintType = {
  NORMAL: "normal", // No constraints (default)
  ONLY_ONE: "only-one", // Exactly one instance must exist
  ZERO_OR_ONE: "zero-or-one", // At most one instance can exist
  ONE_OR_MORE: "one-or-more", // At least one instance must exist
};

// Map object types to their constraint types
export const ObjectConstraints = {
  levelEditorStartZone: PlacementConstraintType.ONE_OR_MORE,
  SecretShape: PlacementConstraintType.ZERO_OR_ONE,
  levelEditorEndZone: PlacementConstraintType.ONE_OR_MORE,
};

function invertScale(value) {
  if (value === 0) {
    return Infinity;
  }
  return 1 / value;
}

export function hexToRgb(hex) {
  // Remove the hash if present
  hex = hex.replace("#", "");

  // Parse the hex string
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  return [r, g, b];
}

/**
 * Get the constraint type for an object type
 * @param {string} objectTypeName - The object type name
 * @returns {string} The constraint type or NORMAL if not constrained
 */
export function getConstraintType(objectTypeName) {
  return ObjectConstraints[objectTypeName] || PlacementConstraintType.NORMAL;
}

/**
 * Check if an object type has a specific constraint
 * @param {string} objectTypeName - The object type name
 * @param {string} constraintType - The constraint type to check
 * @returns {boolean} True if the object has the constraint
 */
export function hasConstraint(objectTypeName, constraintType) {
  return ObjectConstraints[objectTypeName] === constraintType;
}

export const types = {
  position: {
    properties: {
      key: "position",
      type: "position",
      label: "Position",
      originalKey: "position",
      dragSpeed: 0.1,
      precision: 2,
    },
    getValue: (instance) => ({
      x: instance.x || 0,
      y: instance.y || 0,
      z:
        instance.originalZElevation !== undefined
          ? instance.originalZElevation
          : instance.zElevation || 0,
    }),
    onChange: (data, instance) => {
      if (data.value.x !== undefined) instance.x = data.value.x;
      if (data.value.y !== undefined) instance.y = data.value.y;
      if (data.value.z !== undefined)
        if (instance.originalZElevation !== undefined) {
          instance.originalZElevation = data.value.z;
        } else {
          instance.zElevation = data.value.z;
        }
    },
  },
  rotation: {
    properties: {
      key: "rotation",
      type: "angle3d",
      label: "Rotation",
      originalKey: "rotation",
      dragSpeed: 1.0,
      precision: 1,
    },
    getValue: (instance) => ({
      x: instance.xAngle || 0,
      y: instance.yAngle || 0,
      z: instance.zAngle || 0,
    }),
    onChange: (data, instance) => {
      if (data.value.x !== undefined) instance.xAngle = data.value.x;
      if (data.value.y !== undefined) instance.yAngle = data.value.y;
      if (data.value.z !== undefined) instance.zAngle = data.value.z;
    },
  },
  size2D: {
    properties: {
      key: "size2D",
      type: "scale2d",
      label: "Size",
      originalKey: "size2D",
      dragSpeed: 0.1,
      precision: 2,
    },
    getValue: (instance) => ({
      width: instance.width ?? 1,
      height: instance.height ?? 1,
    }),
    onChange: (data, instance) => {
      if (data.value.width !== undefined) instance.width = data.value.width;
      if (data.value.height !== undefined) instance.height = data.value.height;
      if (instance.behaviors && instance.behaviors.MeshRotate) {
        instance.behaviors.MeshRotate.SetRotation(
          -instance.meshAngleX || 0,
          -instance.meshAngleY || 0,
          -instance.meshAngleZ || 0,
        );
      }
    },
  },
  size3D: {
    properties: {
      key: "size3D",
      type: "scale3d",
      label: "Size",
      originalKey: "size3D",
      dragSpeed: 0.1,
      precision: 2,
    },
    getValue: (instance) => ({
      x: instance.width ?? 1,
      y: instance.height ?? 1,
      z: instance.zHeight ?? 1,
    }),
    onChange: (data, instance) => {
      if (data.value.x !== undefined) instance.width = data.value.x;
      if (data.value.y !== undefined) instance.height = data.value.y;
      if (data.value.z !== undefined) instance.zHeight = data.value.z;
    },
  },
  scale: {
    properties: {
      key: "scale",
      type: "scale3d",
      label: "Scale",
      originalKey: "scale",
      dragSpeed: 0.01,
      precision: 2,
    },
    getValue: (instance) => ({
      x: invertScale(instance.xScale) ?? 1,
      y: invertScale(instance.yScale) ?? 1,
      z: invertScale(instance.zScale) ?? 1,
    }),
    onChange: (data, instance) => {
      if (data.value.x !== undefined)
        instance.xScale = invertScale(data.value.x);
      if (data.value.y !== undefined)
        instance.yScale = invertScale(data.value.y);
      if (data.value.z !== undefined)
        instance.zScale = invertScale(data.value.z);
    },
  },
  color: {
    properties: {
      key: "color",
      type: "color",
      label: "Color",
      originalKey: "color",
    },
    getValue: (instance) => {
      return colorToHex(instance.colorRgb || [1, 1, 1]);
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) {
        instance.colorRgb = colorToRgbArray(data.value);
      }
    },
  },
  shape: {
    properties: {
      key: "shape",
      type: "selector",
      label: "Shape",
      originalKey: "shape",
      options: [
        {
          value: "box",
          label: "Box",
          svg: Box,
        },
        {
          value: "prism",
          label: "Prism",
          svg: Prism,
        },
        {
          value: "wedge",
          label: "Wedge",
          svg: Wedge,
        },
        {
          value: "pyramid",
          label: "Pyramid",
          svg: Pyramid,
        },
        {
          value: "corner-out",
          label: "Corner Out",
          svg: CornerOut,
        },
        {
          value: "corner-in",
          label: "Corner In",
          svg: CornerIn,
        },
      ],
    },
    getValue: (instance) => {
      return instance.shape || "box";
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) {
        instance.shape = data.value;
      }
    },
  },
  angle: {
    properties: {
      key: "angle",
      type: "angle1d",
      label: "Angle",
      originalKey: "angle",
      suffix: "°",
      dragSpeed: 1.0,
      precision: 1,
    },
    getValue: (instance) => {
      let value = instance.angleDegrees || 0;
      return Math.round(value * 1e10) / 1e10;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.angleDegrees = data.value;
    },
  },
  text: {
    properties: {
      key: "text",
      type: "text",
      label: "Text Content",
      originalKey: "text",
    },
    getValue: (instance) => instance.instVars.rawText || "",
    onChange: (data, instance, ctx) => {
      if (data.value === undefined) return;
      instance.instVars.rawText = data.value;
      const runtime = ctx?.runtime || globalThis._editorScope?.runtime;
      if (runtime) {
        instance.text = runtime.callFunction(
          "resolveIconTokens",
          data.value,
          instance.uid,
        );
      }
    },
  },
  fontSize: {
    properties: {
      key: "fontSize",
      type: "number",
      label: "Font Size",
      originalKey: "fontSize",
      suffix: "pt",
      min: 1,
      dragSpeed: 1,
      precision: 0,
    },
    getValue: (instance) => instance.sizePt || 12,
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.sizePt = data.value;
    },
  },
  fontColor: {
    properties: {
      key: "color",
      type: "color",
      label: "Font Color",
      originalKey: "fontColor",
    },
    getValue: (instance) => {
      return colorToHex(instance.fontColor || [1, 1, 1]);
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) {
        instance.fontColor = colorToRgbArray(data.value);
      }
    },
  },
  fontFace: {
    properties: {
      key: "fontFace",
      type: "selector",
      label: "Font Face",
      originalKey: "fontFace",
      columnsPerRow: 1,
      options: [
        {
          value: "ProtestStrike-Regular",
          label: "ProtestStrike",
        },
        {
          value: "MartianMono-ExtraBold",
          label: "Martian",
        },
        {
          value: "MartianMono_Condensed-ExtraLight",
          label: "Martian Condensed",
        },
        {
          value: "serif",
          label: "Serif",
        },
        {
          value: "sans-serif",
          label: "Sans Serif",
        },
        {
          value: "monospace",
          label: "Monospace",
        },
      ],
    },
    getValue: (instance) => instance.fontFace || "arial",
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.fontFace = data.value;
    },
  },
  meshRotation: {
    properties: {
      key: "rotation",
      type: "angle3d",
      label: "Rotation",
      originalKey: "meshRotation",
      dragSpeed: 1.0,
      precision: 1,
    },
    getValue: (instance) => ({
      x: instance.meshAngleX || 0,
      y: instance.meshAngleY || 0,
      z: instance.meshAngleZ || 0,
    }),
    onChange: (data, instance) => {
      if (data.value.x !== undefined)
        instance.meshAngleX = ((data.value.x % 360) + 360) % 360;
      if (data.value.y !== undefined)
        instance.meshAngleY = ((data.value.y % 360) + 360) % 360;
      if (data.value.z !== undefined)
        instance.meshAngleZ = ((data.value.z % 360) + 360) % 360;
      instance.behaviors.MeshRotate.SetRotation(
        -instance.meshAngleX || 0,
        -instance.meshAngleY || 0,
        -instance.meshAngleZ || 0,
      );
    },
  },
  meshRotation2: {
    properties: {
      key: "rotation",
      type: "angle3d",
      label: "Rotation",
      originalKey: "meshRotation2",
      dragSpeed: 1.0,
      precision: 1,
    },
    getValue: (instance) => instance.getRotation3D(),
    onChange: (data, instance) => {
      let rotation = instance.getRotation3D();
      if (data.value.x !== undefined)
        rotation.x = ((data.value.x % 360) + 360) % 360;
      if (data.value.y !== undefined)
        rotation.y = ((data.value.y % 360) + 360) % 360;
      if (data.value.z !== undefined)
        rotation.z = ((data.value.z % 360) + 360) % 360;
      instance.setRotation3D(rotation.x, rotation.y, rotation.z);
    },
  },
  deleteButton: {
    properties: {
      key: "deleteButton",
      type: "button",
      label: "Actions",
      originalKey: "deleteButton",
      buttonText: "DELETE INSTANCE",
      important: true,
      confirmMessage: "Are you sure you want to delete this instance?",
      undoMessage: "Delete Objects",
    },
    getValue: (instance) => {
      // Buttons don't have values, but this is required
      return false;
    },
    onChange: (data, instance) => {
      // Handle the delete action
      if (data.value === true) {
        // Delete the instance from the layout using selectionManager
        if (globalThis._editorScope.selectionManager) {
          globalThis._editorScope.selectionManager.destroyInstance(instance);
        }
      }
    },
  },
  tagAngle: {
    properties: {
      key: "angle",
      type: "angle1d",
      label: "Angle",
      originalKey: "tagAngle",
      suffix: "°",
      dragSpeed: 1.0,
      precision: 1,
    },
    getValue: (instance) => {
      let value = instance?.getRotationZExtra3D() || 0;
      return Math.round(value * 1e10) / 1e10;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance?.setRotationZExtra3D(data.value);
    },
  },
  tagOffset: {
    properties: {
      key: "offset",
      type: "number",
      label: "Offset",
      originalKey: "tagOffset",
      dragSpeed: 0.1,
      precision: 2,
    },
    getValue: (instance) => {
      return instance?.getOffset3D() || 0;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance?.setOffset3D(data.value);
    },
  },
  textAlignment: {
    properties: {
      key: "textAlignment",
      type: "selector",
      label: "Text Alignment",
      originalKey: "textAlignment",
      options: [
        {
          value: "top-left",
          label: "Top Left",
        },
        {
          value: "top-center",
          label: "Top Center",
        },
        {
          value: "top-right",
          label: "Top Right",
        },
        {
          value: "center-left",
          label: "Center Left",
        },
        {
          value: "center-center",
          label: "Center",
        },
        {
          value: "center-right",
          label: "Center Right",
        },
        {
          value: "bottom-left",
          label: "Bottom Left",
        },
        {
          value: "bottom-center",
          label: "Bottom Center",
        },
        {
          value: "bottom-right",
          label: "Bottom Right",
        },
      ],
    },
    getValue: (instance) => {
      return `${instance?.verticalAlign || "center"}-${
        instance?.horizontalAlign || "center"
      }`;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) {
        const [vertical, horizontal] = data.value.split("-");
        instance.horizontalAlign = horizontal;
        instance.verticalAlign = vertical;
      }
    },
  },
  model: {
    properties: {
      key: "model",
      type: "selector",
      label: "Model",
      originalKey: "model",
      columnsPerRow: 1,
      options: models,
    },
    getValue: (instance) => {
      return instance?.__modelPath || models[0].value;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) {
        const sdkInst = globalThis._editorScope.sdk_runtime.GetInstanceByUID(
          instance.uid,
        )._sdkInst;
        sdkInst.CallAction(
          sdkInst.GetPlugin().constructor.Acts.LoadModel,
          data.value,
        );
        instance.__modelPath = data.value;
      }
    },
  },
  tag: {
    properties: {
      key: "tag",
      type: "selector",
      label: "Tag",
      originalKey: "tag",
      // Generated lazily from the TagSprite animations the first time the tag
      // selector is rendered (the runtime is guaranteed ready by then).
      get options() {
        return populateTags();
      },
      columnsPerRow: 2,
    },
    getValue: (instance) => {
      return instance?.animationName;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.setAnimation(data.value);
    },
  },
  material: {
    properties: {
      key: "material",
      type: "selector",
      label: "Material",
      originalKey: "material",
      // Dynamic: built-in materials + this project's custom materials. Read as a
      // getter so the list is rebuilt every time the inspector reconstructs a
      // SelectorComponent (which spreads `...config`). This only runs at
      // inspector-build time (post project-load), so custom materials from
      // sharedData are available. The inspector re-renders on
      // "editor:materials-changed" to pick up edits live.
      get options() {
        return buildMaterialOptions();
      },
      columnsPerRow: 2,
    },
    getValue: (instance) => {
      return instance?._materialId || materials.default.value;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined)
        applyMaterialToInstance(instance, data.value);
    },
  },
  collision: {
    properties: {
      key: "collision",
      type: "checkbox",
      label: "Collision",
      originalKey: "collision",
      description: "Enable or disable collision for this instance.",
    },
    getValue: (instance) => {
      return instance.instVars.spawnCollision ?? true;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined)
        instance.instVars.spawnCollision = data.value;
    },
  },
  shapeCollision: {
    properties: {
      key: "collision",
      type: "checkbox",
      label: "Collision",
      originalKey: "shapeCollision",
      description: "Enable or disable collision for this instance.",
    },
    getValue: (instance) => {
      return instance.instVars.isEnabled ?? true;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) {
        instance.instVars.isEnabled = data.value;
        instance.isCollisionEnabled = data.value;
      }
    },
  },
  isOpen: {
    properties: {
      key: "isOpen",
      type: "checkbox",
      label: "Open",
      originalKey: "isOpen",
      description: "Whether the door is open.",
    },
    getValue: (instance) => {
      return instance.instVars.isOpen ?? false;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.isOpen = data.value;
    },
  },
  canBeInteracted: {
    properties: {
      key: "canBeInteracted",
      type: "checkbox",
      label: "Can Be Interacted",
      originalKey: "canBeInteracted",
      description: "Whether the door can be interacted with.",
    },
    getValue: (instance) => {
      return instance.instVars.canBeInteracted ?? true;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined)
        instance.instVars.canBeInteracted = data.value;
    },
  },
  randomizeX: {
    properties: {
      key: "randomizeX",
      type: "checkbox",
      label: "Randomize X",
      originalKey: "randomizeX",
      description: "Whether to randomize the X position.",
    },
    getValue: (instance) => {
      return instance.instVars.randomizeX ?? false;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.randomizeX = data.value;
    },
  },
  randomizeY: {
    properties: {
      key: "randomizeY",
      type: "checkbox",
      label: "Randomize Y",
      originalKey: "randomizeY",
      description: "Whether to randomize the Y position.",
    },
    getValue: (instance) => {
      return instance.instVars.randomizeY ?? false;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.randomizeY = data.value;
    },
  },
  randomizeZ: {
    properties: {
      key: "randomizeZ",
      type: "checkbox",
      label: "Randomize Z",
      originalKey: "randomizeZ",
      description: "Whether to randomize the Z position.",
    },
    getValue: (instance) => {
      return instance.instVars.randomizeZ ?? false;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.randomizeZ = data.value;
    },
  },
  randomizeAngle: {
    properties: {
      key: "randomizeAngle",
      type: "checkbox",
      label: "Randomize Angle",
      originalKey: "randomizeAngle",
      description: "Whether to randomize the angle.",
    },
    getValue: (instance) => {
      return instance.instVars.randomizeAngle ?? false;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined)
        instance.instVars.randomizeAngle = data.value;
    },
  },
  animateScale: {
    properties: {
      key: "animateScale",
      type: "checkbox",
      label: "Animate Scale",
      originalKey: "animateScale",
      description: "Whether to animate the scale.",
    },
    getValue: (instance) => {
      return instance.instVars.animateScale ?? false;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.animateScale = data.value;
    },
  },
  randomizationAmount: {
    properties: {
      key: "randomizationAmount",
      type: "number",
      label: "Randomization Amount",
      originalKey: "randomizationAmount",
      description: "The amount of randomization to apply.",
    },
    getValue: (instance) => {
      return instance.instVars.randomizationAmount ?? 0;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined)
        instance.instVars.randomizationAmount = data.value;
    },
  },
  animationType: {
    properties: {
      key: "animationType",
      type: "selector",
      label: "Animation Type",
      originalKey: "animationType",
      options: [
        {
          value: "distance",
          label: "Distance",
        },
        {
          value: "trigger",
          label: "Trigger",
        },
      ],
    },
    getValue: (instance) => {
      return instance.instVars.animationType || "distance";
    },
    onChange: (data, instance) => {
      if (data.value !== undefined)
        instance.instVars.animationType = data.value;
    },
  },
  triggerId: {
    properties: {
      key: "triggerId",
      type: "text",
      label: "Trigger ID",
      originalKey: "triggerId",
      description: "The ID of the trigger to use for the animation.",
    },
    getValue: (instance) => {
      return instance.instVars.triggerID || "";
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.triggerID = data.value;
    },
  },
  imageOffset: {
    properties: {
      key: "imageOffset",
      type: "scale2d",
      label: "Image Offset",
      originalKey: "imageOffset",
      description: "The offset of the image.",
      dragSpeed: 0.1,
      precision: 2,
      axes: ["x", "y"],
    },
    getValue: (instance) => {
      return {
        x: instance.imageOffsetX ?? 0,
        y: instance.imageOffsetY ?? 0,
      };
    },
    onChange: (data, instance) => {
      if (data.value.x !== undefined) instance.imageOffsetX = data.value.x;
      if (data.value.y !== undefined) instance.imageOffsetY = data.value.y;
    },
  },
  imageScale: {
    properties: {
      key: "imageScale",
      type: "scale2d",
      label: "Image Scale",
      originalKey: "imageScale",
      description: "The scale of the image.",
      dragSpeed: 0.1,
      precision: 2,
      axes: ["x", "y"],
    },
    getValue: (instance) => {
      return {
        x: instance.imageScaleX ?? 0,
        y: instance.imageScaleY ?? 0,
      };
    },
    onChange: (data, instance) => {
      if (data.value.x !== undefined) instance.imageScaleX = data.value.x;
      if (data.value.y !== undefined) instance.imageScaleY = data.value.y;
    },
  },
  imageAngle: {
    properties: {
      key: "imageAngle",
      type: "number",
      label: "Image Angle",
      originalKey: "imageAngle",
      suffix: "°",
      description: "The angle of the image.",
      dragSpeed: 0.1,
      precision: 2,
    },
    getValue: (instance) => {
      let value = instance.imageAngleDegrees || 0;
      return Math.round(value * 1e10) / 1e10;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.imageAngleDegrees = data.value;
    },
  },
  enableTileRandomization: {
    properties: {
      key: "enableTileRandomization",
      type: "checkbox",
      label: "Tile Randomization",
      originalKey: "enableTileRandomization",
      description: "Whether to enable randomization for tiled objects.",
    },
    getValue: (instance) => {
      return instance.enableTileRandomization ?? false;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined)
        instance.enableTileRandomization = data.value;
    },
  },
  tileRandom: {
    properties: {
      key: "tileRandom",
      type: "scale3d",
      label: "Tile Randomization Amount",
      originalKey: "tileRandom",
      description: "The amount of randomization to apply to tiled objects.",
      axes: ["x", "y", "angle"],
      min: 0,
      max: 1,
    },
    getValue: (instance) => {
      return {
        x: instance.tileXRandom ?? 0,
        y: instance.tileYRandom ?? 0,
        angle: instance.tileAngleRandom ?? 0,
      };
    },
    onChange: (data, instance) => {
      if (data.value.x !== undefined) instance.tileXRandom = data.value.x;
      if (data.value.y !== undefined) instance.tileYRandom = data.value.y;
      if (data.value.angle !== undefined)
        instance.tileAngleRandom = data.value.angle;
    },
  },
  tileBlend: {
    properties: {
      key: "tileBlend",
      type: "scale2d",
      label: "Tile Blend",
      originalKey: "tileBlend",
      description: "The blend amount for tiled objects.",
      axes: ["x", "y"],
      min: 0,
      max: 1,
    },
    getValue: (instance) => {
      return {
        x: instance.tileBlendMarginX ?? 0,
        y: instance.tileBlendMarginY ?? 0,
      };
    },
    onChange: (data, instance) => {
      if (data.value.x !== undefined) instance.tileBlendMarginX = data.value.x;
      if (data.value.y !== undefined) instance.tileBlendMarginY = data.value.y;
    },
  },
  characterAnimation: {
    properties: {
      key: "characterAnimation",
      type: "selector",
      label: "Animation",
      originalKey: "characterAnimation",
      columnsPerRow: 1,
      options: [
        {
          value: "utrs_dash_run_120",
          label: "Dash Run",
        },
        {
          value: "utrs_dash_wall_120",
          label: "Dash Wall",
        },
        {
          value: "utrs_fall_60",
          label: "Fall",
        },
        {
          value: "utrs_idle_120",
          label: "Idle",
        },
        {
          value: "utrs_jump_50",
          label: "Jump",
        },
        {
          value: "utrs_land_60",
          label: "Land",
        },
        {
          value: "utrs_roll_40",
          label: "Roll",
        },
        {
          value: "utrs_run_60",
          label: "Run",
        },
        {
          value: "utrs_surf_left_60",
          label: "Surf Left",
        },
        {
          value: "utrs_surf_right_60",
          label: "Surf Right",
        },
        {
          value: "utrs_wall_climb_60",
          label: "Wall Climb",
        },
        {
          value: "utrs_wall_run_left_60",
          label: "Wall Run Left",
        },
        {
          value: "utrs_wall_run_right_60",
          label: "Wall Run Right",
        },
        // Emote animations (from files/jsons/emoteData.json). Point uses its loop
        // variant — the held pose — since the start is just a transition.
        {
          value: "utrs_emote_wave_120",
          label: "Emote Wave",
        },
        {
          value: "utrs_emote_pointing_loop_30",
          label: "Emote Point",
        },
        {
          value: "utrs_emote_sit_30",
          label: "Emote Sit",
        },
        {
          value: "utrs_emote_warmup_180",
          label: "Emote Warmup",
        },
        {
          value: "utrs_emote_drama_160",
          label: "Emote Drama",
        },
        {
          value: "utrs_emote_like_180",
          label: "Emote Like",
        },
        {
          value: "utrs_emote_salute_100",
          label: "Emote Salute",
        },
        {
          value: "utrs_emote_joke_220",
          label: "Emote Joke",
        },
        {
          value: "utrs_emote_anger_120",
          label: "Emote Anger",
        },
      ],
    },
    getValue: (instance) => {
      return instance.instVars.animation || "utrs_idle_120";
    },
    onChange: (data, instance, ctx) => {
      if (data.value !== undefined) {
        instance.instVars.animation = data.value;
        const runtime = ctx?.runtime || globalThis._editorScope?.runtime;
        if (runtime) {
          runtime.callFunction(
            "setAnimationFunction",
            instance.uid,
            data.value,
            0.1,
          );
        }
      }
    },
  },
  characterAnimationSpeed: {
    properties: {
      key: "characterAnimationSpeed",
      type: "number",
      label: "Animation Speed",
      originalKey: "characterAnimationSpeed",
      min: 0,
      dragSpeed: 0.1,
      precision: 2,
    },
    getValue: (instance) => {
      return instance.instVars.animspeed ?? 1;
    },
    onChange: (data, instance, ctx) => {
      if (data.value !== undefined) {
        instance.instVars.animspeed = data.value;
        ctx.runtime?.callFunction(
          "c3Script_setAnimationSpeed",
          instance.uid,
          data.value,
        );
      }
    },
  },
  characterBehavior: {
    properties: {
      key: "characterBehavior",
      type: "selector",
      label: "Behavior",
      originalKey: "characterBehavior",
      columnsPerRow: 1,
      options: [
        {
          value: "none",
          label: "None",
        },
        {
          value: "rotate",
          label: "Rotate",
        },
        {
          value: "lookAtPlayer",
          label: "Look at Player",
        },
      ],
    },
    getValue: (instance) => {
      const showcase = instance.instVars.Showcase ?? false;
      const lookatplayer = instance.instVars.lookatplayer ?? false;

      if (lookatplayer) return "lookAtPlayer";
      if (showcase) return "rotate";
      return "none";
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) {
        // Reset both booleans first
        instance.instVars.Showcase = false;
        instance.instVars.lookatplayer = false;

        // Set the appropriate boolean based on selection
        if (data.value === "rotate") {
          instance.instVars.Showcase = true;
        } else if (data.value === "lookAtPlayer") {
          instance.instVars.lookatplayer = true;
        }
        // "none" leaves both false
      }
    },
  },
  inspectDistance: {
    properties: {
      key: "inspectDistance",
      type: "number",
      label: "Inspect Distance",
      originalKey: "inspectDistance",
      min: 0,
      dragSpeed: 1,
      precision: 0,
    },
    getValue: (instance) => {
      return instance.instVars.inspectDistance ?? 200;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) {
        instance.instVars.inspectDistance = data.value;
        instance.inspectDistSq = data.value * data.value;
      }
    },
  },
  inspectText: {
    properties: {
      key: "text",
      type: "text",
      label: "Inspect Text",
      originalKey: "inspectText",
    },
    getValue: (instance) => instance.instVars.textOverride || "",
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.textOverride = data.value;
    },
  },
  characterSkin: {
    properties: {
      key: "characterSkin",
      type: "selector",
      label: "Skin",
      originalKey: "characterSkin",
      columnsPerRow: 1,
      options: [
        {
          value: "Buns",
          label: "Buns",
        },
        {
          value: "ChinoAlphaWolf",
          label: "Chino Alpha Wolf",
        },
        {
          value: "Default",
          label: "Default",
        },
        {
          value: "Egg",
          label: "Egg",
        },
        {
          value: "Frankie",
          label: "Frankie",
        },
        {
          value: "IceMan",
          label: "Ice Man",
        },
        {
          value: "KarimCheese",
          label: "Karim Cheese",
        },
        {
          value: "NvLL",
          label: "NvLL",
        },
        {
          value: "OvO",
          label: "OvO",
        },
        {
          value: "Phantom",
          label: "Red",
        },
        {
          value: "Techwear",
          label: "Techwear",
        },
        {
          value: "Valentine",
          label: "ValentineXO",
        },
        {
          value: "Winter",
          label: "Winter",
        },
        {
          value: "Worker",
          label: "Worker",
        },
      ],
    },
    getValue: (instance) => {
      return instance.instVars.skinType || "Default";
    },
    onChange: (data, instance, ctx) => {
      if (data.value !== undefined) {
        instance.instVars.skinType = data.value;
        const runtime = ctx?.runtime || globalThis._editorScope?.runtime;
        if (runtime) {
          runtime.callFunction("setSkinFunction", instance.uid, data.value);
        }
      }
    },
  },
  isPressed: {
    properties: {
      key: "isPressed",
      type: "checkbox",
      label: "Is Pressed",
      originalKey: "isPressed",
      description: "Whether the button is currently pressed.",
    },
    getValue: (instance) => {
      return instance.instVars.isDepressed ?? false;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.isDepressed = data.value;
    },
  },
  singleUse: {
    properties: {
      key: "singleUse",
      type: "checkbox",
      label: "Single Use",
      originalKey: "singleUse",
      description: "Whether the button can only be pressed once.",
    },
    getValue: (instance) => {
      return instance.instVars.singleUse ?? false;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.singleUse = data.value;
    },
  },
  isVisible: {
    properties: {
      key: "isVisible",
      type: "checkbox",
      label: "Is Visible",
      originalKey: "isVisible",
      description: "Whether the object is visible.",
    },
    getValue: (instance) => {
      return instance._editorIsVisible ?? instance.isVisible ?? true;
    },
    onChange: (data, instance, ctx) => {
      if (data.value === undefined) return;
      // Store the intent so it round-trips through save/load and stays visible
      // in the editor; only actually hide the instance when playing the level.
      instance._editorIsVisible = data.value;
      if (!ctx?.isEditor) instance.isVisible = data.value;
    },
  },
  sound: {
    properties: {
      key: "sound",
      type: "selector",
      label: "Sound",
      originalKey: "sound",
      columnsPerRow: 1,
      options: SOUNDS.map((sound) => ({
        value: sound,
        label: sound,
      })),
    },
    getValue: (instance) => {
      return instance.instVars.soundName || SOUNDS[0];
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.soundName = data.value;
    },
  },
  volume: {
    properties: {
      key: "volume",
      type: "number",
      label: "Volume",
      originalKey: "volume",
      dragSpeed: 0.1,
      precision: 2,
    },
    getValue: (instance) => {
      return instance.instVars.volume ?? 1;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.volume = data.value;
    },
  },
  loopSound: {
    properties: {
      key: "loopSound",
      type: "checkbox",
      label: "Loop Sound",
      originalKey: "loopSound",
      description: "Whether the sound should loop.",
    },
    getValue: (instance) => {
      return instance.instVars.loopSound ?? false;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.loopSound = data.value;
    },
  },
  previewSound: {
    properties: {
      key: "previewSound",
      type: "button",
      label: "Preview Sound",
      variant: "primary",
      originalKey: "previewSound",
      buttonText: "Preview Sound",
    },
    getValue: (instance) => {
      // Buttons don't have values, but this is required
      return false;
    },
    onChange: (data, instance, ctx) => {
      if (data.value === true) {
        const soundName = instance.instVars.soundName;
        const volume = instance.instVars.volume;
        ctx.runtime.callFunction(
          "levelEditor_previewSound",
          soundName,
          volume,
          1,
          1,
        );
      }
    },
  },
  stopPreviewSound: {
    properties: {
      key: "stopPreviewSound",
      type: "button",
      label: "Stop Preview",
      variant: "primary",
      originalKey: "stopPreviewSound",
      buttonText: "Stop Preview",
    },
    getValue: (instance) => {
      // Buttons don't have values, but this is required
      return false;
    },
    onChange: (data, instance, ctx) => {
      if (data.value === true) {
        ctx.runtime.callFunction("levelEditor_stopPreviewSound");
      }
    },
  },
  secretType: {
    properties: {
      key: "secretType",
      type: "selector",
      label: "Secret Type",
      originalKey: "secretType",
      options: [
        {
          value: "crystal",
          label: "Crystal",
        },
        {
          value: "coin",
          label: "Coin",
        },
      ],
    },
    getValue: (instance) => {
      return instance.instVars.assetType || "crystal";
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.assetType = data.value;
    },
  },
  deathSound: {
    properties: {
      key: "deathSound",
      type: "selector",
      label: "Death Sound",
      originalKey: "deathSound",
      columnsPerRow: 1,
      options: [
        {
          value: "none",
          label: "None",
        },
        {
          value: "gasp",
          label: "Gasp",
        },
        {
          value: "ovo",
          label: "OvO Death",
        },
        {
          value: "boneBreaking",
          label: "Bone Breaking",
        },
      ],
    },
    getValue: (instance) => {
      return instance.instVars.deathSound || "none";
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.deathSound = data.value;
    },
  },
  previewDeathSound: {
    properties: {
      key: "previewDeathSound",
      type: "button",
      label: "Preview Death Sound",
      variant: "primary",
      originalKey: "previewDeathSound",
      buttonText: "Preview Death Sound",
    },
    getValue: (instance) => {
      // Buttons don't have values, but this is required
      return false;
    },
    onChange: (data, instance, ctx) => {
      if (data.value === true) {
        const deathSound = instance.instVars.deathSound;
        ctx.runtime.callFunction("playDeathSound", deathSound);
      }
    },
  },
  gracePeriod: {
    properties: {
      key: "gracePeriod",
      type: "number",
      label: "Grace Period",
      originalKey: "gracePeriod",
      description:
        "The grace period in seconds before the player can die again after respawning.",
      min: 0,
      dragSpeed: 0.1,
      precision: 2,
    },
    getValue: (instance) => {
      return instance.instVars.gracePeriod ?? 0;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.gracePeriod = data.value;
    },
  },
  timeToFadeOut: {
    properties: {
      key: "timeToFadeOut",
      type: "number",
      label: "Time to Fade Out",
      originalKey: "timeToFadeOut",
      description:
        "The time in seconds it takes for the screen to fade out after dying.",
      min: 0,
      dragSpeed: 0.1,
      precision: 2,
    },
    getValue: (instance) => {
      return instance.instVars.timeToFadeOut ?? 0;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined)
        instance.instVars.timeToFadeOut = data.value;
    },
  },
  timeToRestart: {
    properties: {
      key: "timeToRestart",
      type: "number",
      label: "Time to Restart",
      originalKey: "timeToRestart",
      description:
        "The time in seconds it takes for the level to restart after the screen fades out.",
      min: 0,
      dragSpeed: 0.1,
      precision: 2,
    },
    getValue: (instance) => {
      return instance.instVars.timeToRestart ?? 0;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined)
        instance.instVars.timeToRestart = data.value;
    },
  },
  fadeDuration: {
    properties: {
      key: "fadeDuration",
      type: "number",
      label: "Fade Duration",
      originalKey: "fadeDuration",
      description:
        "The duration in seconds it takes for the screen to fade out.",
      min: 0,
      dragSpeed: 0.1,
      precision: 2,
    },
    getValue: (instance) => {
      return instance.instVars.fadeDuration ?? 0;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.fadeDuration = data.value;
    },
  },
  overlapDuration: {
    properties: {
      key: "overlapDuration",
      type: "number",
      label: "Overlap Duration",
      originalKey: "overlapDuration",
      description:
        "The duration in seconds it takes for it to trigger on overlap.",
      min: 0,
      dragSpeed: 0.1,
      precision: 2,
    },
    getValue: (instance) => {
      return instance.instVars.overlapDuration ?? 0;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined)
        instance.instVars.overlapDuration = data.value;
    },
  },
  nextLevel: {
    properties: {
      key: "nextLevel",
      type: "selector",
      label: "Next Level",
      originalKey: "nextLevel",
      description:
        "Level to load when this end zone is reached. Default follows the pack order; Exit ends the pack.",
      columnsPerRow: 1,
      get options() {
        return buildNextLevelOptions();
      },
    },
    // "" (not null) so the value round-trips through exportInstanceState,
    // which skips null/undefined.
    getValue: (instance) => instance.instVars?.override ?? "",
    onChange: (data, instance) => {
      if (data.value === undefined || !instance.instVars) return;
      const v = typeof data.value === "string" ? data.value : "";
      instance.instVars.override = v;
      instance.instVars.goToNext = v === "";
      instance.instVars.travelingTo =
        v && v !== END_ZONE_EXIT ? lookupLevelName(v) : "";
    },
  },
  zoneId: {
    properties: {
      key: "zoneId",
      type: "text",
      label: "Zone ID",
      originalKey: "zoneId",
      description:
        "Identifies this start zone. Leave empty for the default spawn; end zones can target a specific ID. Must be unique within the level.",
      placeholder: "default",
    },
    getValue: (instance) => instance.instVars?.zoneId ?? "",
    onChange: (data, instance) => {
      if (data.value !== undefined && instance.instVars)
        instance.instVars.zoneId = String(data.value ?? "").trim();
    },
  },
  startZoneId: {
    properties: {
      key: "startZoneId",
      type: "text",
      label: "Arrive At Start Zone",
      originalKey: "startZoneId",
      description:
        "Zone ID of the start zone to spawn at in the destination level. Empty = the default start zone.",
      placeholder: "default",
    },
    getValue: (instance) => instance.instVars?.startZoneId ?? "",
    onChange: (data, instance) => {
      if (data.value !== undefined && instance.instVars)
        instance.instVars.startZoneId = String(data.value ?? "").trim();
    },
  },
  leadsToDistance: {
    properties: {
      key: "leadsToDistance",
      type: "number",
      label: "Leads To Distance",
      originalKey: "leadsToDistance",
      description:
        "How close the player must be for this end zone's destination to show in the HUD.",
      min: 0,
      step: 10,
      dragSpeed: 5,
      precision: 0,
    },
    getValue: (instance) => instance.instVars?.leadsToDistanceThreshold ?? 0,
    onChange: (data, instance) => {
      if (data.value !== undefined && instance.instVars)
        instance.instVars.leadsToDistanceThreshold = Number(data.value) || 0;
    },
  },
  checkpointID: {
    properties: {
      key: "checkpointID",
      type: "text",
      label: "Checkpoint ID",
      originalKey: "checkpointID",
      description: "The ID of the checkpoint, must be unique.",
      min: 0,
      dragSpeed: 0.1,
      precision: 2,
    },
    getValue: (instance) => {
      return instance.instVars.checkpointID ?? 0;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.checkpointID = data.value;
    },
  },
  enabled: {
    properties: {
      key: "enabled",
      type: "checkbox",
      label: "Enabled",
      originalKey: "enabled",
      description: "Whether the interaction is enabled.",
    },
    getValue: (instance) => {
      return instance.instVars.enabled ?? true;
    },
    onChange: (data, instance) => {
      if (data.value !== undefined) instance.instVars.enabled = data.value;
    },
  },
};

export const groups = [
  {
    id: "transform",
    label: "Transform",
    keys: [
      "position",
      "size3D",
      "size2D",
      "scale",
      "angle",
      "rotation",
      "meshRotation",
      "meshRotation2",
    ],
  },
  {
    id: "appearance",
    label: "Appearance",
    keys: [
      "shape",
      "material",
      "color",
      "fontColor",
      "fontFace",
      "text",
      "fontSize",
      "textAlignment",
      "tag",
      "characterSkin",
      "characterAnimation",
      "characterAnimationSpeed",
      "characterBehavior",
      "secretType",
      "isVisible",
    ],
  },
  {
    id: "audio",
    label: "Audio",
    keys: [
      "sound",
      "volume",
      "loopSound",
      "previewSound",
      "stopPreviewSound",
      "deathSound",
      "previewDeathSound",
    ],
  },
  {
    id: "physics",
    label: "Physics",
    keys: ["collision", "shapeCollision"],
  },
  {
    id: "placement",
    label: "Placement",
    keys: [
      "tagAngle",
      "tagOffset",
      "imageOffset",
      "imageScale",
      "imageAngle",
      "enableTileRandomization",
      "tileRandom",
      "tileBlend",
    ],
  },
  {
    id: "scatter",
    label: "Scatter",
    keys: [
      "randomizeX",
      "randomizeY",
      "randomizeZ",
      "randomizeAngle",
      "animateScale",
      "randomizationAmount",
      "animationType",
      "triggerId",
    ],
  },
  {
    id: "interaction",
    label: "Interaction",
    keys: [
      "nextLevel",
      "startZoneId",
      "leadsToDistance",
      "zoneId",
      "isOpen",
      "canBeInteracted",
      "inspectDistance",
      "inspectText",
      "isPressed",
      "singleUse",
      "gracePeriod",
      "timeToFadeOut",
      "fadeDuration",
      "timeToRestart",
      "checkpointID",
      "enabled",
      "overlapDuration",
    ],
  },
  {
    id: "actions",
    label: "Actions",
    keys: ["deleteButton"],
  },
];

function makeInspector(types) {
  const properties = [];
  const keys = [];
  const typeByKey = {};
  for (const type of types) {
    keys.push(type.properties.key);
    typeByKey[type.properties.key] = type;
    if (type.properties) {
      properties.push(type.properties);
    }
  }
  return {
    properties: properties,
    getValue: (instance, propertyKey) => {
      if (typeByKey[propertyKey].getValue) {
        const value = typeByKey[propertyKey].getValue(instance);
        if (value !== undefined) {
          return value;
        }
      }
      return instance[propertyKey] ?? null;
    },
    onChange: (data, instance, propertyKey, ctx) => {
      if (typeByKey[propertyKey].onChange) {
        // Default to editor context so existing editor call sites are unchanged.
        typeByKey[propertyKey].onChange(
          data,
          instance,
          ctx ?? { isEditor: true, runtime: globalThis.sdk_runtime._iRuntime },
        );
      }
    },
  };
}

const shape3DBase = [
  types.position,
  types.size3D,
  types.angle,
  types.shape,
  types.material,
  types.color,
  types.isVisible,
  types.shapeCollision,
];

const genericShape = [...shape3DBase, types.deleteButton];
const scatterShape = [
  ...shape3DBase,
  types.randomizeX,
  types.randomizeY,
  types.randomizeZ,
  types.randomizeAngle,
  types.animateScale,
  types.randomizationAmount,
  types.animationType,
  types.triggerId,
  types.deleteButton,
];

const door = [
  types.position,
  types.size3D,
  types.angle,
  types.color,
  types.isVisible,
  types.isOpen,
  types.canBeInteracted,
  types.deleteButton,
];

const startZone = [
  types.position,
  types.size3D,
  types.angle,
  types.color,
  types.isVisible,
  types.zoneId,
  types.deleteButton,
];

const endZone = [
  types.position,
  types.size3D,
  types.angle,
  types.color,
  types.isVisible,
  types.nextLevel,
  types.startZoneId,
  types.leadsToDistance,
  types.deleteButton,
];

const spriteBase = [
  types.position,
  types.size2D,
  types.meshRotation2,
  types.tag,
  types.tagAngle,
  types.tagOffset,
  types.color,
  types.isVisible,
  types.deleteButton,
];

const tiledBase = [
  types.position,
  types.size2D,
  types.meshRotation2,
  types.tagAngle,
  types.tagOffset,
  types.color,
  types.isVisible,
  types.imageOffset,
  types.imageScale,
  types.enableTileRandomization,
  types.tileRandom,
  types.tileBlend,
  types.deleteButton,
];

const textBase = [
  types.position,
  types.size2D,
  types.meshRotation2,
  types.tagAngle,
  types.tagOffset,
  types.text,
  types.fontSize,
  types.fontColor,
  types.fontFace,
  types.textAlignment,
  types.isVisible,
  types.deleteButton,
];

const object3DBase = [
  types.position,
  types.scale,
  types.rotation,
  types.color,
  types.isVisible,
];

const genericObject3D = [...object3DBase, types.deleteButton];

const object3DCollision = [
  ...object3DBase,
  types.collision,
  types.deleteButton,
];

const secretObject3D = [
  types.position,
  types.angle,
  types.secretType,
  types.isVisible,
  types.deleteButton,
];

const characterMannequin = [
  types.position,
  types.scale,
  types.rotation,
  types.color,
  types.isVisible,
  types.characterSkin,
  types.characterAnimation,
  types.characterAnimationSpeed,
  types.characterBehavior,
  types.deleteButton,
];

const inspectable = [
  types.position,
  types.size3D,
  types.angle,
  types.inspectDistance,
  types.inspectText,
  types.deleteButton,
];

const pressurePlate = [
  types.position,
  types.size3D,
  types.angle,
  types.color,
  types.isVisible,
  types.canBeInteracted,
  types.isPressed,
  types.singleUse,
  types.deleteButton,
];

const trigger = [
  types.position,
  types.size3D,
  types.angle,
  types.color,
  types.isVisible,
  types.singleUse,
  types.deleteButton,
];

const deathZone = [
  types.position,
  types.size3D,
  types.angle,
  types.color,
  types.isVisible,
  types.deathSound,
  types.previewDeathSound,
  types.gracePeriod,
  types.timeToFadeOut,
  types.fadeDuration,
  types.timeToRestart,
  types.deleteButton,
];

const soundSource = [
  types.position,
  types.size3D,
  types.angle,
  types.color,
  types.isVisible,
  types.sound,
  types.loopSound,
  types.volume,
  types.previewSound,
  types.stopPreviewSound,
  types.deleteButton,
];

const checkpoint = [
  types.position,
  types.size3D,
  types.angle,
  types.color,
  types.isVisible,
  types.checkpointID,
  types.overlapDuration,
  types.deleteButton,
];

const overlapConfirmer = [
  types.position,
  types.size3D,
  types.angle,
  types.color,
  types.isVisible,
  types.enabled,
  types.overlapDuration,
  types.deleteButton,
];

export const ObjectTypeDefinitions = {
  GenericShape: makeInspector(genericShape),
  GenericScatterShape: makeInspector(scatterShape),
  Text: makeInspector(textBase),

  levelEditorEndZone: makeInspector(endZone),
  levelEditorStartZone: makeInspector(startZone),
  levelEditorDoor: makeInspector(door),

  cctvCamera: makeInspector(genericObject3D),
  cable: makeInspector(genericObject3D),
  Cone: makeInspector(genericObject3D),
  Pipe: makeInspector(genericObject3D),
  cornerTarp: makeInspector(genericObject3D),
  edgeTarp: makeInspector(genericObject3D),

  pole: makeInspector(object3DCollision),
  snowman: makeInspector(object3DCollision),
  railing: makeInspector(object3DCollision),
  wireMesh: makeInspector(object3DCollision),
  brokenConcretePillar: makeInspector(object3DCollision),
  cardboardBoxProp: makeInspector(object3DCollision),
  grass: makeInspector(object3DCollision),
  rocks: makeInspector(object3DCollision),
  trash: makeInspector(object3DCollision),
  trashBag: makeInspector(object3DCollision),

  // spring: makeInspector(genericObject3D),
  SecretShape: makeInspector(secretObject3D),

  levelEditorCharacter: makeInspector(characterMannequin),

  TagSprite: makeInspector(spriteBase),
  StripesTagTiled: makeInspector(tiledBase),
  ArrowTagTiled: makeInspector(tiledBase),
  CrossTagTiled: makeInspector(tiledBase),

  levelEditorInspectable: makeInspector(inspectable),

  pressurePlate1: makeInspector(pressurePlate),
  levelEditorTrigger: makeInspector(trigger),
  levelEditorDeathZone: makeInspector(deathZone),
  levelEditorSoundSource: makeInspector(soundSource),
  checkpoint: makeInspector(checkpoint),
  levelEditorOverlapConfirmer: makeInspector(overlapConfirmer),
};

function createInstanceTransparent(objectTypeName) {
  return globalThis._editorScope.runtime.objects[objectTypeName].createInstance(
    "Main_Transparent",
    0,
    0,
  );
}

function createInstanceBase(objectTypeName, template = null) {
  return globalThis._editorScope.runtime.objects[objectTypeName].createInstance(
    "Main",
    0,
    0,
    false,
    template,
  );
}

function createInstanceTransparentWithHierarchy(
  objectTypeName,
  template = null,
) {
  return globalThis._editorScope.runtime.objects[objectTypeName].createInstance(
    "Main_Transparent",
    0,
    0,
    true,
    template,
  );
}

export const ObjectTypeCreator = {
  Text: createInstanceTransparent.bind(null, "Text"),
  SecretShape: createInstanceTransparentWithHierarchy.bind(null, "SecretShape"),
  TagSprite: createInstanceTransparent.bind(null, "TagSprite"),
  StripesTagTiled: createInstanceTransparent.bind(null, "StripesTagTiled"),
  ArrowTagTiled: createInstanceTransparent.bind(null, "ArrowTagTiled"),
  CrossTagTiled: createInstanceTransparent.bind(null, "CrossTagTiled"),
  wireMesh: createInstanceTransparent.bind(null, "wireMesh"),
  levelEditorTrigger: createInstanceTransparent.bind(
    null,
    "levelEditorTrigger",
  ),
  levelEditorDeathZone: createInstanceTransparent.bind(
    null,
    "levelEditorDeathZone",
  ),
  levelEditorSoundSource: createInstanceTransparent.bind(
    null,
    "levelEditorSoundSource",
  ),
  pressurePlate1: createInstanceBase.bind(null, "pressurePlate1", "noHelper"),
  checkpoint: createInstanceTransparent.bind(null, "checkpoint"),
  levelEditorOverlapConfirmer: createInstanceTransparent.bind(
    null,
    "levelEditorOverlapConfirmer",
  ),
};

export function createInstance(objectTypeName) {
  if (ObjectTypeCreator[objectTypeName]) {
    return ObjectTypeCreator[objectTypeName]();
  }
  return createInstanceBase(objectTypeName);
}
