import { initEditor, releaseEditor } from "./editorMain.js";
import { initializeLevelLoader } from "./levelLoader/levelLoader.js";

runOnStartup(async (runtime) => {
    globalThis.initEditor = () => initEditor(runtime);
    globalThis.releaseEditor = () => releaseEditor(runtime);

    globalThis.levelLoader = initializeLevelLoader(runtime);

    runtime.addEventListener("beforeprojectstart", () => {
        const previewLayout = runtime.getLayout("levelEditorPreview");
        previewLayout.addEventListener("beforelayoutstart", (e) => {
            globalThis.levelLoader.loadCurrentLevel();
        });
        // Tear down the running level script (and its tick listener) when
        // leaving the preview, so it never leaks across levels/layouts.
        previewLayout.addEventListener("beforelayoutend", (e) => {
            globalThis.levelLoader.disposeLevelScript();
        });
    }
    );
});
