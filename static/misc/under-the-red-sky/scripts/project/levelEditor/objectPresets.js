// Object Preset System for Level Editor
// Defines object categories, presets, and their default parameters

import { createInstance } from "./objectTypeDefinitions.js";
import { ObjectTypeDefinitions } from "./objectTypeDefinitions.js";

// Preset categories with icons and descriptions
export const PresetCategories = {
  shapes: {
    id: "shapes",
    name: "Shapes",
    icon: `Box`,
    description: "Generic primitive shapes",
    color: "#1EFFC8",
  },
  objects: {
    id: "objects",
    name: "Objects",
    icon: `Shapes`,
    description:
      "Commonly used objects with preset sizes, colors, and materials.",
    color: "#4A9EFF",
  },
  specialObjects: {
    id: "specialObjects",
    name: "Special",
    icon: `Star`,
    description: "Objects with special behaviors",
    color: "#11DC68",
  },
  models: {
    id: "models",
    name: "Models",
    icon: `Objects`,
    description: "Decorative 3D models",
    color: "#FFD642",
  },
  tags: {
    id: "tags",
    name: "Tags",
    icon: `Sprites`,
    description: "Objects that can be placed on surfaces",
    color: "#FF1E96",
  },
  structures: {
    id: "structures",
    name: "Structures",
    icon: `Structures`,
    description: "Structures and buildings",
    color: "#FF4961",
  },
  customStructures: {
    id: "customStructures",
    name: "Custom",
    icon: `CustomStructures`,
    description: "Custom structures and buildings",
    color: "#FFFFFF",
  },
};

// Object presets with their default parameters
export const ObjectPresets = {
  // 3D Shapes category
  shapes: [
    {
      id: "cube",
      name: "Cube",
      category: "shapes",
      icon: `Box`,
      description: "",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 64, y: 64, z: 64 },
            shape: "box",
            color: "#FFFFFF",
            material: "default",
          },
        },
      ],
    },
    {
      id: "wedge",
      name: "Wedge",
      category: "shapes",
      icon: `Wedge`,
      description: "",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 64, y: 64, z: 64 },
            shape: "wedge",
            color: "#FFFFFF",
            material: "default",
          },
        },
      ],
    },
    {
      id: "prism",
      name: "Prism",
      category: "shapes",
      icon: `Prism`,
      description: "",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 64, y: 64, z: 64 },
            shape: "prism",
            color: "#FFFFFF",
            material: "default",
          },
        },
      ],
    },
    {
      id: "pyramid",
      name: "Pyramid",
      category: "shapes",
      icon: `Pyramid`,
      description: "",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 64, y: 64, z: 64 },
            shape: "pyramid",
            color: "#FFFFFF",
            material: "default",
          },
        },
      ],
    },
    {
      id: "corner-out",
      name: "Corner Out",
      category: "shapes",
      icon: `CornerOut`,
      description: "",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 64, y: 64, z: 64 },
            shape: "corner-out",
            color: "#FFFFFF",
            material: "default",
          },
        },
      ],
    },
    {
      id: "corner-in",
      name: "Corner In",
      category: "shapes",
      icon: `CornerIn`,
      description: "",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 64, y: 64, z: 64 },
            shape: "corner-in",
            color: "#FFFFFF",
            material: "default",
          },
        },
      ],
    },
  ],

  objects: [
    {
      id: "wall",
      name: "Wall",
      category: "objects",
      icon: `BasicSprite`,
      description: "",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 256, y: 64, z: 400 },
            color: "#FFFFFF",
            material: "default",
          },
        },
      ],
    },
    {
      id: "yellowWall",
      name: "Yellow Wall",
      category: "objects",
      icon: `BasicSprite2`,
      description: "",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 256, y: 64, z: 400 },
            color: "#FFFFFF",
            material: "yellowWall",
          },
        },
      ],
    },
    {
      id: "tiledFloor",
      name: "Tiled Floor",
      category: "objects",
      icon: `Grid`,
      description: "",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 256, y: 256, z: 64 },
            color: "#FFFFFF",
            material: "tiles",
          },
        },
      ],
    },
    {
      id: "bounce",
      name: "Bounce Pad",
      category: "objects",
      icon: `Prints`,
      description: "",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 256, y: 256, z: 64 },
            color: "#16B0FE",
            material: "bounce",
          },
        },
      ],
    },
    {
      id: "speed",
      name: "Speed Floor",
      category: "objects",
      icon: `Run`,
      description: "",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 256, y: 256, z: 64 },
            color: "#16B0FE",
            material: "speed",
          },
        },
      ],
    },
    {
      id: "plank",
      name: "Plank",
      category: "objects",
      icon: `ScubaFlag`,
      description: "",
      variableParam: "color",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 96, y: 224, z: 6 },
            color: "#FFD642",
            material: "plank",
          },
        },
      ],
    },
    {
      id: "metalGrate",
      name: "Metal Grate",
      category: "objects",
      icon: `TextureBox2`,
      description: "",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 96, y: 256, z: 16 },
            color: "#FFFFFF",
            material: "metal",
          },
        },
      ],
    },
    {
      id: "container",
      name: "Container",
      category: "objects",
      icon: `Container`,
      description: "",
      variableParam: "color",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 512, y: 200, z: 256 },
            color: "#FFFFFF",
            material: "container",
          },
        },
      ],
    },
    {
      id: "ventPipe",
      name: "Vent Pipe",
      category: "objects",
      icon: `Fan`,
      description: "",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 100, y: 80, z: 300 },
            color: "#FFFFFF",
            material: "ventPipe",
          },
        },
      ],
    },
    {
      id: "powerBox",
      name: "Power Box",
      category: "objects",
      icon: `Bolt`,
      description: "",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 128, y: 64, z: 128 },
            color: "#FFFFFF",
            material: "powerBox",
          },
        },
      ],
    },
    {
      id: "cardboardBox",
      name: "Cardboard Box",
      category: "objects",
      icon: `ZipBox`,
      description: "",
      variableParam: "color",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: { x: 64, y: 64, z: 64 },
            color: "#FFD642",
            material: "box",
          },
        },
      ],
    },
  ],

  specialObjects: [
    {
      id: "startZone",
      name: "Start Zone",
      category: "specialObjects",
      icon: `Flag`,
      description: "Player spawn area",
      objects: [
        {
          objectType: "levelEditorStartZone",
          parameters: {
            size3D: { x: 510, y: 510, z: 512 },
            color: "#FFFFFF",
          },
        },
      ],
    },
    {
      id: "endZone",
      name: "End Zone",
      category: "specialObjects",
      icon: `FlagCheckered`,
      description: "Level completion area",
      objects: [
        {
          objectType: "levelEditorEndZone",
          parameters: {
            size3D: { x: 510, y: 510, z: 512 },
            color: "#16B0FE",
            leadsToDistance: 650,
          },
        },
      ],
    },
    {
      id: "door",
      name: "Door",
      category: "specialObjects",
      icon: `Door`,
      description: "Interactive door object",
      variableParam: "color",
      objects: [
        {
          objectType: "levelEditorDoor",
          parameters: {
            size3D: { x: 12, y: 140, z: 256 },
            color: "#16B0FE",
            isOpen: false,
            canBeInteracted: true,
          },
        },
      ],
    },
    {
      id: "scatterShape",
      name: "Scatter",
      category: "specialObjects",
      icon: `Glitters`,
      description: "Shape that scatters at a distance",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericScatterShape",
          parameters: {
            size3D: { x: 64, y: 64, z: 64 },
            shape: "box",
            material: "default",
            color: "#FFFFFF",
            randomizeX: true,
            randomizeY: true,
            randomizeZ: false,
            randomizeAngle: true,
            animateScale: false,
            randomizationAmount: 128,
          },
        },
      ],
    },
    {
      id: "secret",
      name: "Secret",
      category: "specialObjects",
      icon: `Chest`,
      description: "Hidden secret collectible",
      variableParam: "secretType",
      objects: [
        {
          objectType: "SecretShape",
          parameters: {
            secretType: "crystal",
          },
        },
      ],
    },
    {
      id: "inspectable",
      name: "Inspectable",
      category: "specialObjects",
      icon: `Eye`,
      description: "Displays text when nearby",
      variableParam: "inspectText",
      objects: [
        {
          objectType: "levelEditorInspectable",
          parameters: {
            size3D: { x: 64, y: 64, z: 64 },
            inspectDistance: 200,
            inspectText: "",
          },
        },
      ],
    },
    {
      id: "pressurePlate",
      name: "Pressure Plate",
      category: "specialObjects",
      icon: `Control`,
      description: "Activates when stepped on",
      objects: [
        {
          objectType: "pressurePlate1",
          parameters: {
            size3D: { x: 96, y: 96, z: 16 },
            color: "#16B0FE",
            canBeInteracted: true,
            isPressed: false,
            singleUse: true,
          },
        },
      ],
    },
    {
      id: "trigger",
      name: "Trigger",
      category: "specialObjects",
      icon: `Select`,
      description: "Activates when entered",
      objects: [
        {
          objectType: "levelEditorTrigger",
          parameters: {
            size3D: { x: 128, y: 128, z: 128 },
            color: "#FF1E96",
            singleUse: true,
            isVisible: false,
          },
        },
      ],
    },
    {
      id: "deathZone",
      name: "Death Zone",
      category: "specialObjects",
      icon: `Skull`,
      description: "Kills player when entered",
      objects: [
        {
          objectType: "levelEditorDeathZone",
          parameters: {
            size3D: { x: 128, y: 128, z: 128 },
            color: "#ff0000",
            isVisible: false,
          },
        },
      ],
    },
    {
      id: "soundSource",
      name: "Sound Source",
      category: "specialObjects",
      icon: `Broadcast`,
      description: "Plays a sound",
      variableParam: "sound",
      objects: [
        {
          objectType: "levelEditorSoundSource",
          parameters: {
            size3D: { x: 64, y: 64, z: 64 },
            color: "#16B0FE",
            sound: "powerUpLoop",
            loopSound: true,
            volume: 0,
            isVisible: false,
          },
        },
      ],
    },
    {
      id: "checkpoint",
      name: "Checkpoint",
      category: "specialObjects",
      icon: `CloudDownload`,
      description: "Saves a player's progress",
      variableParam: "checkpointID",
      objects: [
        {
          objectType: "checkpoint",
          parameters: {
            size3D: { x: 256, y: 256, z: 256 },
            color: "#FFD642",
            overlapDuration: 0.5,
            isVisible: true,
            checkpointID: "",
          },
        },
      ],
    },
    {
      id: "overlapConfirmer",
      name: "Overlap Confirmer",
      category: "specialObjects",
      icon: `Update`,
      description: "Activates when entered for a certain duration",
      objects: [
        {
          objectType: "levelEditorOverlapConfirmer",
          parameters: {
            size3D: { x: 96, y: 96, z: 192 },
            color: "#16B0FE",
            enabled: true,
            overlapDuration: 0.5,
            isVisible: false,
          },
        },
      ],
    },
  ],

  // 3D Objects category
  models: [
    {
      id: "cone",
      name: "Traffic Cone",
      category: "models",
      icon: `Cone`,
      description: "",
      variableParam: "color",
      objects: [
        {
          objectType: "Cone",
          parameters: {
            color: "#FFD642",
          },
        },
      ],
    },
    {
      id: "brokenConcretePillar",
      name: "Broken Concrete Pillar",
      category: "models",
      icon: `Pillar`,
      description: "",
      objects: [
        {
          objectType: "brokenConcretePillar",
          parameters: {
            color: "#FFFFFF",
          },
        },
      ],
    },
    {
      id: "cctvCamera",
      name: "CCTV Camera",
      category: "models",
      icon: `CCTV`,
      description: "",
      objects: [
        {
          objectType: "cctvCamera",
          parameters: {
            color: "#C2C2C2",
          },
        },
      ],
    },
    {
      id: "cable",
      name: "Cable",
      category: "models",
      icon: `Cable`,
      description: "",
      objects: [
        {
          objectType: "cable",
          parameters: {
            color: "#404040",
          },
        },
      ],
    },
    {
      id: "pipe",
      name: "Pipe",
      category: "models",
      icon: `Pipe`,
      description: "",
      objects: [
        {
          objectType: "Pipe",
          parameters: {
            color: "#9C9C9C",
          },
        },
      ],
    },
    {
      id: "pole",
      name: "Pole",
      category: "models",
      icon: `PostLamp`,
      description: "",
      objects: [
        {
          objectType: "pole",
          parameters: {
            color: "#8F8F8F",
            collision: true,
          },
        },
      ],
    },
    {
      id: "cornerTarp",
      name: "Edge Tarp",
      category: "models",
      icon: `EdgeTarpSquare`,
      description: "",
      variableParam: "color",
      objects: [
        {
          positionOffset: { x: 20, y: 0, z: -64 },
          objectType: "cornerTarp",
          parameters: {
            color: "#FFD642",
          },
        },
      ],
    },
    {
      id: "edgeTarp",
      name: "Corner Tarp",
      category: "models",
      icon: `CornerTarpSquare`,
      description: "",
      variableParam: "color",
      objects: [
        {
          positionOffset: { x: -20, y: 20, z: -120 },
          objectType: "edgeTarp",
          parameters: {
            color: "#FFD642",
          },
        },
      ],
    },
    {
      id: "snowman",
      name: "Snowman",
      category: "models",
      icon: `Snowman`,
      description: "",
      objects: [
        {
          objectType: "snowman",
          parameters: {
            color: "#FFFFFF",
            collision: true,
          },
        },
      ],
    },
    {
      id: "railing",
      name: "Railing",
      category: "models",
      icon: `Fence`,
      description: "",
      objects: [
        {
          objectType: "railing",
          parameters: {
            color: "#787878",
            collision: true,
          },
        },
      ],
    },
    {
      id: "wireMesh",
      name: "Wire Mesh",
      category: "models",
      icon: `Gate`,
      description: "",
      objects: [
        {
          objectType: "wireMesh",
          parameters: {
            color: "#FFFFFF",
            collision: true,
          },
        },
      ],
    },
    {
      id: "characterMannequin",
      name: "Character Mannequin",
      category: "models",
      icon: `HumanMale`,
      description: "",
      objects: [
        {
          objectType: "levelEditorCharacter",
          parameters: {
            scale: { x: 1, y: 1, z: 1 },
            rotation: { x: 0, y: 0, z: 0 },
            color: "#FFFFFF",
            characterSkin: "Default",
            characterAnimation: "utrs_idle_120",
            characterAnimationSpeed: 1,
            characterBehavior: "none",
          },
        },
      ],
    },
    {
      id: "prop_carboardBox",
      name: "Cardboard Box",
      category: "models",
      icon: `CardboardBox`,
      description: "",
      objects: [
        {
          objectType: "cardboardBoxProp",
          parameters: {
            color: "#FFFFFF",
            collision: true,
          },
        },
      ],
    },
    {
      id: "prop_grass",
      name: "Grass",
      category: "models",
      icon: `Grass`,
      description: "",
      objects: [
        {
          objectType: "grass",
          parameters: {
            color: "#FFFFFF",
            collision: true,
          },
        },
      ],
    },
    {
      id: "prop_rocks",
      name: "Rocks",
      category: "models",
      icon: `Rocks`,
      description: "",
      objects: [
        {
          objectType: "rocks",
          parameters: {
            color: "#FFFFFF",
            collision: true,
          },
        },
      ],
    },
    {
      id: "prop_trash",
      name: "Trash",
      category: "models",
      icon: `TrashCan`,
      description: "",
      objects: [
        {
          objectType: "trash",
          parameters: {
            color: "#FFFFFF",
            collision: true,
          },
        },
      ],
    },
    {
      id: "prop_trashBag",
      name: "Trash Bag",
      category: "models",
      icon: `TrashBag`,
      description: "",
      objects: [
        {
          objectType: "trashBag",
          parameters: {
            color: "#FFFFFF",
            collision: true,
          },
        },
      ],
    },
  ],

  // Tags category
  tags: [
    {
      id: "basic_text",
      name: "Text",
      category: "tags",
      icon: `Text`,
      placeLikeTag: true,
      description: "",
      variableParam: "text",
      objects: [
        {
          objectType: "Text",
          parameters: {
            size2D: { width: 100, height: 50 },
            text: "Lorem ipsum",
            fontSize: 16,
            color: "#FFFFFF",
            textAlignment: "center-center",
          },
        },
      ],
    },
    {
      id: "basic_title",
      name: "Title",
      category: "tags",
      icon: `Text`,
      placeLikeTag: true,
      description: "",
      variableParam: "text",
      objects: [
        {
          objectType: "Text",
          parameters: {
            size2D: { width: 200, height: 100 },
            text: "Lorem ipsum",
            fontSize: 32,
            color: "#FFFFFF",
            textAlignment: "center-center",
          },
        },
      ],
    },
    {
      id: "tagSprite",
      name: "Tag",
      category: "tags",
      icon: `Sprites`,
      placeLikeTag: true,
      description: "",
      variableParam: "tag",
      objects: [
        {
          objectType: "TagSprite",
          parameters: {
            color: "#FFFFFF",
            tag: "Sad Woman",
          },
        },
      ],
    },
    {
      id: "stripes",
      name: "Stripes",
      category: "tags",
      icon: `TextureBox`,
      placeLikeTag: true,
      description: "",
      variableParam: "color",
      objects: [
        {
          objectType: "StripesTagTiled",
          parameters: {
            size2D: { width: 128, height: 128 },
            color: "#FFD642",
          },
        },
      ],
    },
    {
      id: "arrow",
      name: "Arrows",
      category: "tags",
      icon: `ChevronUp`,
      placeLikeTag: true,
      description: "",
      variableParam: "color",
      objects: [
        {
          objectType: "ArrowTagTiled",
          parameters: {
            size2D: { width: 128, height: 128 },
            color: "#FFFFFF",
          },
        },
      ],
    },
    {
      id: "crosses",
      name: "Crosses",
      category: "tags",
      icon: `Cross`,
      placeLikeTag: true,
      description: "",
      variableParam: "color",
      objects: [
        {
          objectType: "CrossTagTiled",
          parameters: {
            size2D: { width: 128, height: 128 },
            color: "#FFFFFF",
          },
        },
      ],
    },
  ],

  // Structures category
  structures: [
    {
      id: "cornerRailing",
      category: "structures",
      name: "Corner Railing",
      description: "",
      icon: "Fence",
      objects: [
        {
          objectType: "railing",
          parameters: {
            scale: {
              x: 1,
              y: 1,
              z: 1,
            },
            color: "#787878",
            collision: true,
          },
          positionOffset: {
            x: -0.00001030550492941984,
            y: 262.5072650041951,
            z: -0.0339403901704145,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        {
          objectType: "railing",
          parameters: {
            scale: {
              x: 1,
              y: 1,
              z: 1,
            },
            color: "#787878",
            collision: true,
          },
          positionOffset: {
            x: 259.99998969449507,
            y: -1.4927349958048808,
            z: -0.0339403901704145,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: -90,
          },
        },
      ],
    },
    {
      id: "cornerWall",
      category: "structures",
      name: "Corner Wall",
      description: "",
      icon: "Box",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 640,
              y: 64,
              z: 400,
            },
            shape: "box",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 320,
            y: -32,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 90,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 704,
              y: 64,
              z: 400,
            },
            shape: "box",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 0,
            y: 320,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
      ],
    },
    {
      id: "cornerWireMesh",
      category: "structures",
      name: "Corner WireMesh",
      description: "",
      icon: "Gate",
      objects: [
        {
          objectType: "wireMesh",
          parameters: {
            scale: {
              x: 1,
              y: 1,
              z: 1,
            },
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: -1.4070138931274414,
            y: 143.8473358154297,
            z: 0.480194091796875,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        {
          objectType: "wireMesh",
          parameters: {
            scale: {
              x: 1,
              y: 1,
              z: 1,
            },
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 148.59298610687256,
            y: -0.1526641845703125,
            z: 0.480194091796875,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 90,
          },
        },
      ],
    },
    {
      id: "roundedCornerSurf",
      category: "structures",
      name: "Rounded Corner (Surf)",
      description: "",
      icon: "CornerIn",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 320,
              y: 640,
              z: 320,
            },
            shape: "wedge",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 382.2943725152286,
            y: 225.7056274847714,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 320,
              y: 640,
              z: 320,
            },
            shape: "wedge",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 206.2943725152286,
            y: -206.2943725152286,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 315,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 320,
              y: 640,
              z: 320,
            },
            shape: "wedge",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: -225.7056274847714,
            y: -382.2943725152286,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
      ],
    },
    {
      id: "sharpCornerSurf",
      category: "structures",
      name: "Sharp Corner (Surf)",
      description: "",
      icon: "CornerIn",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 320,
              y: 320,
              z: 320,
            },
            shape: "corner-in",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 320,
            y: -320,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 320,
              y: 640,
              z: 320,
            },
            shape: "wedge",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: -160,
            y: -320,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 320,
              y: 640,
              z: 320,
            },
            shape: "wedge",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 320,
            y: 160,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
      ],
    },
    {
      id: "stairsBig",
      category: "structures",
      name: "Stairs (Big)",
      description: "",
      icon: "Stairs",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 384,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 352,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 16,
            y: 0,
            z: 32,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 320,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 32,
            y: 0,
            z: 64,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 288,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 48,
            y: 0,
            z: 96,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 256,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 64,
            y: 0,
            z: 128,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 224,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 80,
            y: 0,
            z: 160,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 192,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 96,
            y: 0,
            z: 192,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 160,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 112,
            y: 0,
            z: 224,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 96,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 144,
            y: 0,
            z: 288,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 128,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 128,
            y: 0,
            z: 256,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 64,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 160,
            y: 0,
            z: 320,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 32,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 176,
            y: 0,
            z: 352,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
      ],
    },
    {
      id: "stairsMedium",
      category: "structures",
      name: "Stairs (Medium)",
      description: "",
      icon: "Stairs",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 256,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 224,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 16,
            y: 0,
            z: 32,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 192,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 32,
            y: 0,
            z: 64,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 160,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 48,
            y: 0,
            z: 96,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 96,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 80,
            y: 0,
            z: 160,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 128,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 64,
            y: 0,
            z: 128,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 64,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 96,
            y: 0,
            z: 192,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 32,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 112,
            y: 0,
            z: 224,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
      ],
    },
    {
      id: "stairsSmall",
      category: "structures",
      name: "Stairs (Small)",
      description: "",
      icon: "Stairs",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 96,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 16,
            y: 0,
            z: 32,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 128,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 64,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 32,
            y: 0,
            z: 64,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 384,
              y: 32,
              z: 32,
            },
            shape: "box",
            material: "tiles",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 48,
            y: 0,
            z: 96,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
      ],
    },
    {
      id: "tripleRailing",
      category: "structures",
      name: "Triple Railing",
      description: "",
      icon: "Fence",
      objects: [
        {
          objectType: "railing",
          parameters: {
            scale: {
              x: 1,
              y: 1,
              z: 1,
            },
            color: "#787878",
            collision: true,
          },
          positionOffset: {
            x: 519.9999896944951,
            y: 0,
            z: -0.0339403901704145,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        {
          objectType: "railing",
          parameters: {
            scale: {
              x: 1,
              y: 1,
              z: 1,
            },
            color: "#787878",
            collision: true,
          },
          positionOffset: {
            x: -2.0000103055049294,
            y: 0,
            z: -0.0339403901704145,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        {
          objectType: "railing",
          parameters: {
            scale: {
              x: 1,
              y: 1,
              z: 1,
            },
            color: "#787878",
            collision: true,
          },
          positionOffset: {
            x: -520.0000103055049,
            y: 0,
            z: -0.0339403901704145,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
      ],
    },
    {
      id: "tripleWireMesh",
      category: "structures",
      name: "Triple WireMesh",
      description: "",
      icon: "Gate",
      objects: [
        {
          objectType: "wireMesh",
          parameters: {
            scale: {
              x: 1,
              y: 1,
              z: 1,
            },
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: -296.1526641845703,
            y: 0.18786048889160156,
            z: 0.480194091796875,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        {
          objectType: "wireMesh",
          parameters: {
            scale: {
              x: 1,
              y: 1,
              z: 1,
            },
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: -2.1526641845703125,
            y: 0.18786048889160156,
            z: 0.480194091796875,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        {
          objectType: "wireMesh",
          parameters: {
            scale: {
              x: 1,
              y: 1,
              z: 1,
            },
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 295.8473358154297,
            y: 0.18786048889160156,
            z: 0.480194091796875,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
      ],
    },
    {
      id: "wallRailing",
      category: "structures",
      name: "Wall + Railing",
      description: "A simple railing between two broken walls",
      icon: "Container",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 128,
              y: 64,
              z: 240,
            },
            shape: "box",
            material: "concrete",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 236.89715385437012,
            y: 0,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        {
          objectType: "railing",
          parameters: {
            scale: {
              x: 1,
              y: 1,
              z: 1,
            },
            color: "#787878",
            collision: true,
          },
          positionOffset: {
            x: -3.102846145629883,
            y: 0,
            z: -0.0339403901704145,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        {
          objectType: "brokenConcretePillar",
          parameters: {
            scale: {
              x: 1,
              y: 1,
              z: 1,
            },
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: -275.1028461456299,
            y: 0,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
      ],
    },
    {
      id: "wallJumpSection",
      category: "structures",
      name: "Wall Jump Section",
      description: "",
      icon: "Shapes",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 320,
              y: 640,
              z: 64,
            },
            shape: "box",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: -48,
            y: -992,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 640,
              y: 64,
              z: 400,
            },
            shape: "box",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: -240,
            y: -544,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 90,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 640,
              y: 64,
              z: 400,
            },
            shape: "box",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 240,
            y: 96,
            z: 128,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 90,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 320,
              y: 640,
              z: 64,
            },
            shape: "box",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: -32,
            y: 992,
            z: 128,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
      ],
    },
    {
      id: "crane",
      category: "structures",
      name: "Crane",
      description: "",
      icon: "Crane",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 16,
              y: 16,
              z: 960,
            },
            shape: "box",
            material: "metal",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 256,
            y: 0,
            z: 2000,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 90,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 64,
              y: 288,
              z: 288,
            },
            shape: "box",
            material: "concrete",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 896,
            y: 0,
            z: 2832,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 180,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 160,
              y: 160,
              z: 3200,
            },
            shape: "box",
            material: "ventPipe",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 736,
            y: 0,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 90,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 16,
              y: 16,
              z: 960,
            },
            shape: "box",
            material: "metal",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: -1136,
            y: 0,
            z: 2000,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 90,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 1593.2776240373069,
              y: 160,
              z: 160,
            },
            shape: "box",
            material: "container",
            color: "#ffd642",
            collision: true,
          },
          positionOffset: {
            x: -432,
            y: 0,
            z: 1920,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 180,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 2644,
              y: 158,
              z: 160,
            },
            shape: "box",
            material: "ventPipe",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 0,
            y: 0,
            z: 2896,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 180,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 64,
              y: 288,
              z: 288,
            },
            shape: "box",
            material: "concrete",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 976,
            y: 0,
            z: 2832,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 180,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 64,
              y: 288,
              z: 288,
            },
            shape: "box",
            material: "concrete",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 1056,
            y: 0,
            z: 2832,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 180,
          },
        },
      ],
    },
    {
      id: "speedfloorBouncepad",
      category: "structures",
      name: "Speed Floor + Bounce Pad",
      description: "",
      icon: "Shapes",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 256,
              y: 256,
              z: 64,
            },
            shape: "box",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 1040,
            y: 0,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 640,
              y: 256,
              z: 16,
            },
            shape: "box",
            material: "speed",
            color: "#16b0fe",
            collision: true,
          },
          positionOffset: {
            x: -464,
            y: 0,
            z: 64,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 256,
              y: 256,
              z: 16,
            },
            shape: "box",
            material: "bounce",
            color: "#16b0fe",
            collision: true,
          },
          positionOffset: {
            x: -16,
            y: 0,
            z: 64,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 1280,
              y: 256,
              z: 64,
            },
            shape: "box",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: -528,
            y: 0,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
      ],
    },
    {
      id: "vaultJumpSection",
      category: "structures",
      name: "Vault Jump Section",
      description: "",
      icon: "Pipe",
      variableParam: "material",
      objects: [
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 256,
              y: 256,
              z: 64,
            },
            shape: "box",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 0,
            y: 440,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 256,
              y: 256,
              z: 464,
            },
            shape: "box",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 0,
            y: 184,
            z: 0,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
        {
          objectType: "GenericShape",
          parameters: {
            size3D: {
              x: 256,
              y: 256,
              z: 64,
            },
            shape: "box",
            material: "default",
            color: "#ffffff",
            collision: true,
          },
          positionOffset: {
            x: 0,
            y: -440,
            z: 400,
          },
          rotationOffset: {
            x: 0,
            y: 0,
            z: 270,
          },
        },
      ],
    },
  ],
  // Custom Structures category
};

// Preset management class
export class PresetManager {
  constructor() {
    this.categories = { ...PresetCategories };
    this.presets = { ...ObjectPresets };
    this.customPresets = {}; // User-defined presets
  }

  // Get all categories
  getCategories() {
    return Object.values(this.categories);
  }

  // Get category by ID
  getCategory(categoryId) {
    return this.categories[categoryId];
  }

  // Get all presets for a category
  getPresetsForCategory(categoryId) {
    const builtInPresets = this.presets[categoryId] || [];
    const customPresets = this.customPresets[categoryId] || [];
    return [...builtInPresets, ...customPresets];
  }

  // Get all presets (flattened)
  getAllPresets() {
    const allPresets = [];
    Object.keys(this.presets).forEach((categoryId) => {
      allPresets.push(...this.getPresetsForCategory(categoryId));
    });
    return allPresets;
  }

  // Get preset by ID
  getPreset(presetId) {
    const allPresets = this.getAllPresets();
    return allPresets.find((preset) => preset.id === presetId);
  }

  // Search presets by name or description
  searchPresets(query) {
    const allPresets = this.getAllPresets();
    const lowercaseQuery = query.toLowerCase();

    return allPresets.filter(
      (preset) =>
        preset.name.toLowerCase().includes(lowercaseQuery) ||
        preset.description.toLowerCase().includes(lowercaseQuery),
    );
  }

  // Create object instance from preset
  createInstanceFromPreset(preset, position = null) {
    try {
      // Create the base instance
      const instance = createInstance(preset.objectType);
      if (!instance) {
        console.error(
          `Failed to create instance of type: ${preset.objectType}`,
        );
        return null;
      }

      // Apply preset parameters
      this.applyPresetParameters(instance, preset, position);

      return instance;
    } catch (error) {
      console.error(`Error creating instance from preset ${preset.id}:`, error);
      return null;
    }
  }

  // Apply preset parameters to an instance
  applyPresetParameters(instance, preset, positionOverride = null) {
    if (!preset.parameters) return;

    // Use position override if provided, otherwise use preset position
    const position = positionOverride || preset.parameters.position;

    // Apply parameters based on object type
    const parameters = { ...preset.parameters };

    // Override position if specified
    if (position) {
      parameters.position = position;
    }

    // Apply each parameter
    const entries = Object.entries(parameters);
    for (let i = entries.length - 1; i >= 0; i--) {
      const [key, value] = entries[i];
      try {
        this.setInstanceProperty(instance, key, value);
      } catch (error) {
        console.warn(`Failed to set property ${key} on instance:`, error);
      }
    }
  }

  // Set a property on an instance (simplified version of inspector logic)
  setInstanceProperty(instance, propertyKey, value) {
    const objectTypeName = instance.objectType?.name;
    if (!objectTypeName) return;
    const definition = ObjectTypeDefinitions[objectTypeName];
    if (definition && definition.onChange) {
      definition.onChange({ value }, instance, propertyKey);
    }
  }

  // Add custom preset
  addCustomPreset(categoryId, preset) {
    if (!this.customPresets[categoryId]) {
      this.customPresets[categoryId] = [];
    }

    // Ensure unique ID
    const existingIds = this.getPresetsForCategory(categoryId).map((p) => p.id);
    if (existingIds.includes(preset.id)) {
      console.warn(
        `Preset ID ${preset.id} already exists in category ${categoryId}`,
      );
      return false;
    }

    this.customPresets[categoryId].push({
      ...preset,
      category: categoryId,
      custom: true,
    });

    return true;
  }

  // Remove custom preset
  removeCustomPreset(categoryId, presetId) {
    if (!this.customPresets[categoryId]) return false;

    const index = this.customPresets[categoryId].findIndex(
      (p) => p.id === presetId,
    );
    if (index !== -1) {
      this.customPresets[categoryId].splice(index, 1);
      return true;
    }

    return false;
  }

  // Export custom presets to JSON
  exportCustomPresets() {
    return JSON.stringify(this.customPresets, null, 2);
  }

  // Import custom presets from JSON
  importCustomPresets(jsonData) {
    try {
      const customPresets = JSON.parse(jsonData);
      this.customPresets = customPresets;
      return true;
    } catch (error) {
      console.error("Failed to import custom presets:", error);
      return false;
    }
  }

  // Get preset statistics
  getStats() {
    const stats = {
      categories: Object.keys(this.categories).length,
      totalPresets: 0,
      builtInPresets: 0,
      customPresets: 0,
      presetsByCategory: {},
    };

    Object.keys(this.categories).forEach((categoryId) => {
      const categoryPresets = this.getPresetsForCategory(categoryId);
      const builtIn = this.presets[categoryId]?.length || 0;
      const custom = this.customPresets[categoryId]?.length || 0;

      stats.presetsByCategory[categoryId] = {
        total: categoryPresets.length,
        builtIn,
        custom,
      };

      stats.totalPresets += categoryPresets.length;
      stats.builtInPresets += builtIn;
      stats.customPresets += custom;
    });

    return stats;
  }

  destroy() {
    // Clean up resources
    this.categories = {};
    this.presets = {};
    this.customPresets = {};
  }
}

// Global preset manager instance
export let presetManager = null;

// Initialize preset manager
export function initializePresetManager() {
  if (!presetManager) {
    presetManager = new PresetManager();
  }
  return presetManager;
}

export function destroyPresetManager() {
  if (presetManager) {
    presetManager.destroy();
    presetManager = null;
  }
}

// Helper functions for easy access
export function getPresetCategories() {
  return presetManager ? presetManager.getCategories() : [];
}

export function getPresetsForCategory(categoryId) {
  return presetManager ? presetManager.getPresetsForCategory(categoryId) : [];
}

export function getPreset(presetId) {
  return presetManager ? presetManager.getPreset(presetId) : null;
}

export function createInstanceFromPreset(preset, position = null) {
  if (!presetManager) return null;

  if (!preset) return null;

  return presetManager.createInstanceFromPreset(preset, position);
}
