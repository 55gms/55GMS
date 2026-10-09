// textureList.js — the canonical texture lists, kept dependency-free so both the
// object-type definitions (objectTypeDefinitions.js) and the scripting enums
// (scripting/c3script_enums.js) can import them without an import cycle.

// Texture object-type names usable as cube-face materials. Sourced from the
// objectTypes/textures/ folder (plus whiteFillTexture, referenced by the
// solidColor material but living outside that folder). Some entries are clearly
// UI/decoration, not cube textures — flagged `// uncertain`; prune as needed.
export const TEXTURES = [
  "brickTexture",
  "blackFillTexture",
  "whiteTexture",
  "whiteFillTexture",
  "concreteTexture",
  "concreteTextureUnderside",
  "containerShortSide",
  "containerSides",
  "darkTarTexture",
  "dirtyEdgesTexture",
  "edgesTexture",
  "edgesTexture2",
  "edgesTexture3",
  "glassTexture",
  "gridTexture",
  "iceTexture",
  "plankTexture",
  "powerBoxSideTexture",
  "powerBoxTopTexture",
  "pressurePlateTopTexture",
  "sandstoneBricksTexture",
  "sandStoneTexture",
  "snowTiles9p",
  "snowTilesSprite",
  "snowTopTexture",
  "solarPanelTexture",
  "speedTexture",
  "tarpTexture",
  "TilesTexture",
  "TilesTextureDark",
  "vent",
  "ventShaftTileSquashedTexture",
  "ventShaftTileTexture",
  "verticalPanelTexture",
  "woodPlanksTexture",
  "yellowWhiteTexture",
  "cardBoardBox",
  "brightCornersTexture",
  "crossPatternTexture",
  "upPatternTexture",
  "stripesTexture",
  "doorTexture",
  "doorTextureMirrored",
  "FakeView", // uncertain
  "OvOClassicThumbnail1Comicsmin", // uncertain
  "OvoDimensions_Banner_8min", // uncertain
];

// Display names for textures whose engine (object type) name is too long or
// cryptic for a picker. Anything not listed falls back to the engine name.
export const TEXTURE_LABELS = {
  brickTexture: "Brick",
  blackFillTexture: "Black",
  whiteTexture: "White",
  whiteFillTexture: "White fill",
  concreteTexture: "Concrete",
  concreteTextureUnderside: "Concrete underside",
  containerShortSide: "Container end",
  containerSides: "Container side",
  darkTarTexture: "Dark tar",
  dirtyEdgesTexture: "Dirty edges",
  edgesTexture: "Edges",
  edgesTexture2: "Edges 2",
  edgesTexture3: "Edges 3",
  glassTexture: "Glass",
  gridTexture: "Grid",
  iceTexture: "Ice",
  plankTexture: "Plank",
  powerBoxSideTexture: "Power box side",
  powerBoxTopTexture: "Power box top",
  pressurePlateTopTexture: "Pressure plate",
  sandstoneBricksTexture: "Sandstone bricks",
  sandStoneTexture: "Sandstone",
  snowTiles9p: "Snow tiles (9p)",
  snowTilesSprite: "Snow tiles",
  snowTopTexture: "Snow top",
  solarPanelTexture: "Solar panel",
  speedTexture: "Speed",
  tarpTexture: "Tarp",
  TilesTexture: "Tiles",
  TilesTextureDark: "Tiles dark",
  vent: "Vent",
  ventShaftTileSquashedTexture: "Vent shaft (squashed)",
  ventShaftTileTexture: "Vent shaft",
  verticalPanelTexture: "Vertical panel",
  woodPlanksTexture: "Wood planks",
  yellowWhiteTexture: "Yellow / white",
  cardBoardBox: "Cardboard box",
  brightCornersTexture: "Bright corners",
  crossPatternTexture: "Cross pattern",
  upPatternTexture: "Up pattern",
  stripesTexture: "Stripes",
  doorTexture: "Door",
  doorTextureMirrored: "Door (mirrored)",
  FakeView: "Fake view",
  OvOClassicThumbnail1Comicsmin: "OvO classic thumbnail",
  OvoDimensions_Banner_8min: "OvO Dimensions banner",
};

/** Human-readable name for a texture engine name. */
export function textureLabel(name) {
  return TEXTURE_LABELS[name] || name;
}

// Textures that contain alpha/holes. A material is rendered on the transparent
// layer if ANY of its faces use one of these — transparency is DERIVED from the
// textures, never stored/edited directly. Keep this in sync with TEXTURES above.
export const TRANSPARENT_TEXTURES = new Set([
  "glassTexture",
  "gridTexture",
  "edgesTexture",
  "edgesTexture3",
  "crossPatternTexture",
  "upPatternTexture",
  "stripesTexture",
]);
