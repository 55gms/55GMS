import "./enums.js";
import "./levelEditor/editorIndex.js";
import "./levelEditor/levelBrowser/levelBroserIndex.js";
import "./shadow/shadowMain.js";
import "./staticBake/staticIndex.js";
import { Inputs } from "./inputs.js";
import { GizmoRenderer, GizmoManager } from "./levelEditor/gizmoRenderer.js";
import WorkshopWrapper from "./workshop.js";
import DLCManager from "./dlcManager.js";
import getWorkshopShowcase from "./getWorkshopShowcase.js";

runOnStartup(async (runtime) => {
  runtime.objects.solid.addEventListener("instancecreate", (e) =>
    onSolidCreated(e),
  );
  // runtime.objects.BFC.addEventListener("instancecreate", (e) =>
  //   onBFCCreated(e),
  // );
  runtime.objects.scatterShape.addEventListener("instancecreate", (e) =>
    onScatterShapeCreated(e),
  );

  runtime.addEventListener("beforeprojectstart", () =>
    OnBeforeProjectStart(runtime),
  );
  await _InitWakerWorker(runtime);

  let mouseIsInWindow = false;
  const target = document.body;
  target.addEventListener("mouseleave", () => {
    if (mouseIsInWindow) {
      mouseIsInWindow = false;
      runtime.globalVars.mouseIsInWindow = false;
    }
  });
  target.addEventListener("mouseenter", () => {
    if (!mouseIsInWindow) {
      mouseIsInWindow = true;
      runtime.globalVars.mouseIsInWindow = true;
    }
  });
  target.addEventListener("mousemove", () => {
    if (!mouseIsInWindow) {
      mouseIsInWindow = true;
      runtime.globalVars.mouseIsInWindow = true;
    }
  });
  const REMOVE_LOGS = true;
  if (REMOVE_LOGS && runtime.platformInfo.exportType !== "preview") {
    console.log = () => {};
  }
});

async function OnBeforeProjectStart(runtime) {
  let pipelab = runtime.objects.Pipelab.getFirstInstance();
  let dedraSDK = runtime.objects.DedraSDKWrapper.getFirstInstance();
  if (dedraSDK && dedraSDK.enabled) {
    runtime.globalVars.Piplab_ready = false;
  } else {
    await pipelab._Initialize();
    runtime.globalVars.Piplab_ready = pipelab._isInitialized;
  }

  // Initialize WorkshopWrapper on global scope
  globalThis.workshopWrapper = new WorkshopWrapper(runtime);
  globalThis.dlcManager = new DLCManager(runtime);
  const promises = [];
  promises.push(globalThis.dlcManager.preloadDLCStatus());
  if (dedraSDK.enabled) {
    promises.push(getWorkshopShowcase());
  }

  maybeCreateManager(runtime);

  //avoid scrolling page with arrow keys
  self.addEventListener("keydown", (ev) => {
    if (["ArrowDown", "ArrowUp", " "].includes(ev.key)) {
      ev.preventDefault();
    }
  });

  //load project files into json instances
  promises.push(
    loadJsonIntoInst(
      "jsons/levelData.json",
      runtime.objects.levelData.getFirstInstance(),
    ),
  );
  promises.push(
    loadJsonIntoInst(
      "jsons/achievementData.json",
      runtime.objects.achievementData.getFirstInstance(),
    ),
  );
  promises.push(
    loadJsonIntoInst(
      "jsons/emoteData.json",
      runtime.objects.EmoteData.getFirstInstance(),
    ),
  );
  promises.push(
    loadJsonIntoInst(
      "jsons/nameTemplate.json",
      runtime.objects.names.getFirstInstance(),
    ),
  );
  promises.push(
    loadJsonIntoInst(
      "jsons/skinData.json",
      runtime.objects.skinData.getFirstInstance(),
    ),
  );

  //try loading save
  await Promise.all(promises);
  try {
    const saveState = await getDataFromStorage(runtime);
    if (!saveState) await loadDefaultSave(runtime);
    else
      runtime.objects.save
        .getFirstInstance()
        .setJsonDataCopy(JSON.parse(saveState));
  } catch (e) {
    await loadDefaultSave(runtime);
  }

  //load poki leaderboard mappings (level name <-> leaderboard id)
  await loadPokiLeaderboards(runtime);

  //initialize keybinds
  const response = await fetch("jsons/keybinds.json");
  const json = await response.json();
  Inputs._setDefaultKeybinds(json);
  //load custom keybinds if the exist
  const saveData = runtime.objects.save.getFirstInstance().getJsonDataCopy();

  if ("customKeybinds" in saveData) {
    Inputs.setKeybinds(saveData.customKeybinds);
    //making sure none customize keybinds or keybinds added later in development are added to the custom keybinds
    if (Inputs.combineKeybindsWithDefault()) {
      //persist the merged/cleaned binds (added defaults, dropped stale actions)
      saveData.customKeybinds = Inputs.getKeybinds();
      runtime.objects.save.getFirstInstance().setJsonDataCopy(saveData);
      await saveDataToStorage(runtime);
    }
  } else {
    Inputs.resetKeybindsToDefault();
  }

  //scroll wheel is bindable (e.g. photo-mode focus); latch wheel events for the
  //release-less pulse model in Inputs.isBindDown
  Inputs.initScrollCapture(runtime);

  function addLayerEventListeners(layer) {
    const handler = () => {
      const camera = globalThis._editorScope.cameraType;
      globalThis._editorScope.gizmoManager.renderAll(layer.name, camera);
    };
    layer.addEventListener("beforedraw", handler);
    layer.__gizmoHandler = handler;
  }

  function removeLayerEventListeners(layer) {
    if (layer.__gizmoHandler) {
      layer.removeEventListener("beforedraw", layer.__gizmoHandler);
      delete layer.__gizmoHandler;
    }
  }
  runtime.getAllLayouts().forEach((layout) => {
    layout.addEventListener("beforelayoutstart", async (e) => {
      const isCTF = runtime.objects.isCTFSprite.getFirstInstance();
      if (isCTF) {
        globalThis._editorScope = globalThis._editorScope || {};
        globalThis._editorScope.cameraType = runtime.objects.camera;
        globalThis._editorScope.gizmoManager = new GizmoManager(
          new GizmoRenderer(runtime.renderer),
        );
        layout.getAllLayers().forEach((layer) => {
          addLayerEventListeners(layer);
        });
      }
      const isCustomMap = runtime.objects.isCustomMapSprite.getFirstInstance();

      let shouldClearLevelSaves = layout.name !== "levelEditorPreview";
      if (isCustomMap) {
        let CustomLevelFile = null;
        if (isCustomMap.instVars.getMapFromServer) {
          let res = await getWorkshopShowcase();
          if (res.exists) {
            CustomLevelFile = res.content;
          }
        }
        if (!CustomLevelFile) {
          CustomLevelFile = await runtime.assets.fetchJson(
            await runtime.assets.getProjectFileUrl(
              isCustomMap.instVars.mapPath,
            ),
          );
        }

        if (CustomLevelFile) {
          globalThis.levelLoader.loadProject(CustomLevelFile);
          globalThis.levelLoader.configure({
            returnDestination: isCustomMap.instVars.returnDestination,
            targetLayout: "levelEditorPreview",
            packCompletionMode: "end_of_last_level",
          });
          globalThis.levelLoader.start();
          shouldClearLevelSaves = false;
        } else {
          runtime.goToLayout(isCustomMap.instVars.returnDestination);
        }
      }

      if (shouldClearLevelSaves) {
        globalThis.levelLoader?.scriptRuntime?.clearLevelSave();
        globalThis.levelLoader?.scriptRuntime?.clearPackSave();
      }
    });
    layout.addEventListener("beforelayoutend", (e) => {
      const isCTF = runtime.objects.isCTFSprite.getFirstInstance();
      if (isCTF) {
        layout.getAllLayers().forEach((layer) => {
          removeLayerEventListeners(layer);
        });
        globalThis._editorScope.gizmoManager.destroy();
        globalThis._editorScope.gizmoManager = null;
      }
    });
  });
}

const localStorageKey = "save";
const saveFileName = "UTRS_mainSave.sav";

function getSaveFilePath(pipelab) {
  return pipelab._appDataFolder + "/com.dedra.utrs/" + saveFileName;
}

export async function getDataFromStorage(runtime) {
  let pipelab = runtime.objects.Pipelab.getFirstInstance();
  if (pipelab._isInitialized) {
    await pipelab._ReadTextFile(getSaveFilePath(pipelab));
    if (pipelab._ReadTextFileResult()) return pipelab._ReadFile();
    else return null;
  } else {
    return await runtime.storage.getItem(localStorageKey);
  }
}

export async function saveDataToStorage(runtime) {
  let json = JSON.stringify(
    runtime.objects.save.getFirstInstance().getJsonDataCopy(),
  );
  let pipelab = runtime.objects.Pipelab.getFirstInstance();
  if (pipelab._isInitialized) {
    await pipelab._WriteTextFile(getSaveFilePath(pipelab), json);
  } else {
    await runtime.storage.setItem(localStorageKey, json);
  }
}

export async function clearDataFromStorage(runtime) {
  let pipelab = runtime.objects.Pipelab.getFirstInstance();
  if (pipelab._isInitialized) {
    pipelab._DeleteFile(getSaveFilePath(pipelab));
  } else {
    await runtime.storage.clear();
  }
}

async function loadJsonIntoInst(path, inst) {
  const json = await inst.runtime.assets.fetchJson(path);
  inst.setJsonDataCopy(json);
}

async function loadPokiLeaderboards(runtime) {
  // levelToLeaderboard: level name -> leaderboard id
  // leaderboardToLevel: leaderboard id -> level name
  const levelToLeaderboard = await runtime.assets.fetchJson(
    "jsons/pokiLeaderboards.json",
  );
  const leaderboardToLevel = {};
  for (const [level, id] of Object.entries(levelToLeaderboard)) {
    leaderboardToLevel[id] = level;
  }

  globalThis.pokiLeaderboards = {
    levelToLeaderboard,
    leaderboardToLevel,
    getLeaderboardId: (level) => levelToLeaderboard[level] ?? null,
    getLevelName: (id) => leaderboardToLevel[id] ?? null,
    hasLeaderboard: (level) =>
      Object.prototype.hasOwnProperty.call(levelToLeaderboard, level),
  };
}

function maybeCreateManager(runtime) {
  const manager = runtime.objects.globalManager.getFirstInstance();
  if (!manager) {
    runtime.objects.globalManager.createInstance(0, 0, 0);
  }
}

async function loadDefaultSave(runtime) {
  const save = runtime.objects.save.getFirstInstance();
  const saveDataResponse = await fetch("jsons/saveState.json");
  save.setJsonDataCopy(await saveDataResponse.json());
  runtime.callFunction("newSave");
}

function onSolidCreated(e) {
  const inst = e.instance;
  inst.isCollisionEnabled = inst.instVars.isEnabled;
}

function onBFCCreated(e) {
  const inst = e.instance;
  inst.enableBFC = inst.instVars.enableBFC;
  inst.isBackFaceCulling = inst.enableBFC;
  inst.isBox = inst.shape === "box";
}

export function onScatterShapeCreated(e) {
  const inst = e.instance;
  inst.animationType = inst.instVars.animationType;
  inst.targetX = inst.x;
  inst.targetY = inst.y;
  inst.targetZ = inst.zElevation;
  inst.targetAngle = inst.angleDegrees;
  inst.targetWidth = inst.width;
  inst.targetHeight = inst.height;
  inst.targetZHeight = inst.zHeight;
  inst.randomizeX = inst.instVars.randomizeX;
  if (inst.randomizeX) {
    inst.randomX =
      inst.x + (Math.random() * 2 - 1) * inst.instVars.randomizationAmount;
    inst.x = inst.randomX;
  }
  inst.randomizeY = inst.instVars.randomizeY;
  if (inst.randomizeY) {
    inst.randomY =
      inst.y + (Math.random() * 2 - 1) * inst.instVars.randomizationAmount;
    inst.y = inst.randomY;
  }
  inst.randomizeZ = inst.instVars.randomizeZ;
  if (inst.randomizeZ) {
    inst.randomZ =
      inst.zElevation +
      (Math.random() * 2 - 1) * inst.instVars.randomizationAmount;
    inst.zElevation = inst.randomZ;
  }
  inst.randomizeAngle = inst.instVars.randomizeAngle;
  if (inst.randomizeAngle) {
    inst.randomAngle = inst.angle + (Math.random() * 2 - 1) * 180;
    inst.angleDegrees = inst.angle;
  }
  inst.animateScale = inst.instVars.animateScale;
  if (inst.animateScale) {
    inst.setSize(0, 0);
    inst.zHeight = 0;
  }
}

// code to keep the multiplayer on
async function _InitWakerWorker(runtime) {
  globalThis._wakerWorker = await runtime.createWorker("background-waker.js");
  globalThis._wakerWorker.onmessage = (e) => {
    if (e.data === "tick" && globalThis.sdk_runtime.IsSuspended())
      globalThis.sdk_runtime.Tick(null, false, "background-wake");
  };
  globalThis._wakerWorker.postMessage("");
}

(() => {
  // Same as: https://developers.cloudflare.com/automatic-platform-optimization/reference/cache-device-type/
  const MOBILE_REGEX =
    /(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot) .+? mobile|palm|windows\s+ce|opera mini|avantgo|mobilesafari|docomo|kaios)/i;
  const TABLET_REGEX = /(?:ipad|playbook|android|bb\d+|meego|silk)/i;
  const TABLET_NOT_REGEX = /(?:android|bb\d+|meego|silk) .+? mobile/i;

  function isIPadOS() {
    if (typeof navigator === "undefined") {
      return false;
    }

    return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  }

  function getDeviceCategory() {
    if (isIPadOS()) return "tablet";
    if (MOBILE_REGEX.test(navigator.userAgent)) return "mobile";
    if (
      TABLET_REGEX.test(navigator.userAgent) &&
      !TABLET_NOT_REGEX.test(navigator.userAgent)
    )
      return "tablet";
    return "desktop";
  }

  globalThis.getDeviceCategory = getDeviceCategory;
})();
