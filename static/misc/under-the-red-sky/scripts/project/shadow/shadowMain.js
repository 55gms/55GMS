/**
 * lightingMain.js — Project-specific wiring for the shadow & day/night systems.
 *
 * Importing this file is all that's needed — it self-registers with
 * Construct 3's `runOnStartup` and hooks into the layout lifecycle.
 *
 * To use in another project, change the config constants below.
 */

import { installDepthBiasOverrides } from "./rendererOverrides.js";
import { ShadowSystem } from "./shadowSystem.js";
import { DayNightSystem } from "./dayNight.js";
import { createShadowDebugUI } from "./debugUI.js";

// ═══════════════════════════════════════════════════════════════════
// PROJECT CONFIG — change these for your project
// ═══════════════════════════════════════════════════════════════════

const CASTER_FAMILIES = ["ShadowCaster3DShape"];
const RECEIVER_FAMILIES = ["ShadowReceiver3DShape", "ShadowReceiverSprites"];
const SHADOW_LAYER_PARENT = "intermediatePost";
const SHADOW_LAYER = "__shadowLayer";

const INITIAL_LIGHT = [0.3, 0.3, -1];
const SHADOW_COLOR = [0, 0, 0];
const SHADOW_OPACITY = 1;

const ENABLE_DEBUG_AND_DAYNIGHT = false;

// ═══════════════════════════════════════════════════════════════════
// SETUP (no need to edit below this line)
// ═══════════════════════════════════════════════════════════════════

installDepthBiasOverrides();

const shadowSystem = new ShadowSystem();
const dayNightSystem = ENABLE_DEBUG_AND_DAYNIGHT ? new DayNightSystem() : null;
if (dayNightSystem) {
  dayNightSystem.setEnabled(true);
}

// Create debug UI after DOM is ready
let debugUI = null;
if (ENABLE_DEBUG_AND_DAYNIGHT && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      debugUI = createShadowDebugUI(shadowSystem, dayNightSystem, {
        lightX: INITIAL_LIGHT[0],
        lightY: INITIAL_LIGHT[1],
        lightZ: INITIAL_LIGHT[2],
      });
    });
  } else {
    debugUI = createShadowDebugUI(shadowSystem, dayNightSystem, {
      lightX: INITIAL_LIGHT[0],
      lightY: INITIAL_LIGHT[1],
      lightZ: INITIAL_LIGHT[2],
    });
  }
}

function collectInstances(runtime, families) {
  const out = [];
  for (const name of families) {
    if (runtime.objects[name]) {
      const instances = runtime.objects[name].instances();
      // Filter out invisible or transparent instances
      for (const inst of instances) {
        if (inst.isVisible && inst.opacity >= 1) {
          out.push(inst);
        }
      }
    }
  }
  return out;
}

runOnStartup(async (runtime) => {
  runtime.addEventListener("beforeprojectstart", () => {
    shadowSystem.setLight(INITIAL_LIGHT);
    shadowSystem.setColor(SHADOW_COLOR, SHADOW_OPACITY);
    shadowSystem.setShadowConfigCallback(() => {
      return "none";
      let data = runtime.objects.save.getFirstInstance().getJsonDataCopy();
      return data?.settings?.shadowQuality ?? "none";
    });

    // Update day/night system each frame
    if (ENABLE_DEBUG_AND_DAYNIGHT && dayNightSystem) {
      runtime.addEventListener("tick", () => {
        const result = dayNightSystem.update(
          runtime.dt,
          shadowSystem,
          null, // mainLayer - set to null, can be configured if needed
          [], // tintInstances - empty for now, can be configured if needed
        );
        // Sync debug UI sliders when day/night auto-plays
        if (result && debugUI) {
          debugUI.updateLight(
            result.lightDir[0],
            result.lightDir[1],
            result.lightDir[2],
          );
          debugUI.updateTime(result.timeOfDay);
        }
      });
    }

    runtime.getAllLayouts().forEach((layout) => {
      layout.addEventListener("beforelayoutstart", () => {
        // Clear current frame data but preserve layout cache
        shadowSystem.clear();

        // Set layout name first - this may restore from cache
        const curLayoutName = layout.name;
        if (curLayoutName === "levelEditorPreview") {
          shadowSystem.setCurLayoutName(
            globalThis?.levelLoader?.currentLevelId ?? "",
          );
        } else {
          shadowSystem.setCurLayoutName(layout.name);
        }

        // Mark for rebuild (will use cache if available)
        shadowSystem.invalidate();

        const shadowLayerParent = layout.getLayer(SHADOW_LAYER_PARENT);
        if (!shadowLayerParent) {
          return;
        }
        let shadowLayer = layout.getLayer(SHADOW_LAYER);
        if (!shadowLayer) {
          layout.addLayer(SHADOW_LAYER, shadowLayerParent, "top-sublayer");
          shadowLayer = layout.getLayer(SHADOW_LAYER);
        }
        shadowLayer.opacity = 0.45;
        shadowLayer.renderingMode = "3d";

        if (shadowLayer) {
          const handler = (e) => {
            if (shadowSystem.getShadowConfig() === "none") return;
            shadowSystem.setCasters(collectInstances(runtime, CASTER_FAMILIES));
            shadowSystem.setReceivers(
              collectInstances(runtime, RECEIVER_FAMILIES),
            );
            shadowSystem.draw(e.renderer);
          };
          shadowLayer.addEventListener("afterdraw", handler);
          shadowLayer.__shadowHandler = handler;
        }
      });

      layout.addEventListener("beforelayoutend", () => {
        const shadowLayer = layout.getLayer(SHADOW_LAYER);
        if (shadowLayer?.__shadowHandler) {
          shadowLayer.removeEventListener(
            "afterdraw",
            shadowLayer.__shadowHandler,
          );
          delete shadowLayer.__shadowHandler;
        }
        // Clear current frame data but preserve layout cache for reuse
        shadowSystem.clear();
      });
    });
  });
});
