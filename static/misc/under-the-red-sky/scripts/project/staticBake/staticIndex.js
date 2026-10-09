// staticBake/staticIndex.js
// Wires the static Shape3D baker into the runtime:
//  - one StaticShapeBaker on globalThis.staticBake (console: staticBake.stats,
//    staticBake.serialize(), staticBake.config.cullMode = "none", ...)
//  - hand-authored layouts bake on "beforelayoutstart" (initial instances only:
//    anything spawned by events or scripts afterwards stays dynamic)
//  - manual layouts (level-editor preview/play) are baked by levelLoader right
//    after it has created the level's objects
//  - every bake is torn down on "beforelayoutend"
//
// Requirements in the project (editor-side):
//  - a Shape3D family named in `sources` (default "StaticBakeable") holding the
//    object types that are never moved/resized/recoloured/hidden by events or
//    behaviors. Without it the module logs once and does nothing.

import { StaticShapeBaker } from "./staticShapeBaker.js";

export const STATIC_BAKE_CONFIG = {
  enabled: true,
  sources: ["StaticBakeable"],
  excludeLayouts: ["levelEditor", "levelEditorBank", "levelBrowser"],
  manualLayouts: ["levelEditorPreview"],
  excludeLayers: ["excludeFromIntermediatePost"],
  staticLayerPrefix: "static:",
  cullMode: "back",
  frontFaceWinding: "cw",
  chunkSize: 2048,
  frustumCull: true,
  log: true,
};

runOnStartup(async (runtime) => {
  const baker = new StaticShapeBaker(runtime, STATIC_BAKE_CONFIG);
  globalThis.staticBake = baker;

  runtime.addEventListener("beforeprojectstart", () => {
    for (const layout of runtime.getAllLayouts()) {
      layout.addEventListener("beforelayoutstart", () => {
        if (baker.isManualLayout(layout.name)) return;
        baker.bakeCurrentLayout("layoutstart");
      });
      layout.addEventListener("beforelayoutend", () => baker.onLayoutEnd());
    }
  });
});
