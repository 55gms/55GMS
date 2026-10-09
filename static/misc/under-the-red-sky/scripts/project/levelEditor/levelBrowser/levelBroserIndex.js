// Level Browser Module Index
// Export all level browser components

import { initLevelBrowser, releaseLevelBrowser } from "./LevelBrowser.js";
import { PackCompletionMode } from "../levelLoader/levelLoader.js";

runOnStartup(async (runtime) => {
  globalThis._levelBrowserScope = { runtime };

  globalThis.initLevelBrowser = () =>
    initLevelBrowser({
      // Resolves true once the level loader has requested its layout.
      onPlayLevel: async (item, projectData) => {
        const levelLoader = globalThis.levelLoader;
        if (!levelLoader) {
          console.error("[LevelBrowser] Level loader not available");
          return false;
        }

        try {
          // Load the project into the level loader
          const success = await levelLoader.loadProject(projectData);
          if (!success) {
            console.error("[LevelBrowser] Failed to load project");
            return false;
          }

          // Get the first level ID to start from
          const levelIds = Object.keys(projectData.levels);
          const firstLevelId = levelIds.length > 0 ? levelIds[0] : null;

          if (!firstLevelId) {
            console.error("[LevelBrowser] No levels found in project");
            return false;
          }

          // Configure the level loader for playing from menu
          const configured = levelLoader.configure({
            startLevelId: firstLevelId,
            returnDestination: "levelBrowser",
            targetLayout: "levelEditorPreview",
            packCompletionMode: PackCompletionMode.END_OF_LAST_LEVEL,
          });

          if (!configured) {
            console.error("[LevelBrowser] Failed to configure level loader");
            return false;
          }

          // Start playing
          levelLoader.start();

          console.log(
            `[LevelBrowser] Started playing workshop level: ${projectData.projectName}`
          );
          return true;
        } catch (error) {
          console.error("[LevelBrowser] Error starting level:", error);
          return false;
        }
      },
      onClose: () => {
        runtime.callFunction("closeLevelBrowser");
      },
    });
  globalThis.releaseLevelBrowser = () => releaseLevelBrowser();
});
