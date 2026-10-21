// The play page's cloud save button, beside reload and fullscreen: its icon
// and label show the game's save status (cloud-saves.js), and a click saves
// the game to the cloud now. Hidden for a game cloud saves do not know, and
// on a server without them.
(() => {
  const frame = document.getElementById("iframe");
  const button = document.getElementById("savebtn");
  const saves = window.GMSSaves;
  const gameId = frame?.dataset.gmsGame;
  if (!button || !saves?.gameStatus || !gameId) return;
  const icon = button.querySelector("i");
  const label = button.querySelector(".savebtn-label");
  let off = false;
  let busy = false;
  let timer = 0;

  function ago(time) {
    const seconds = Math.max(0, Math.round((Date.now() - time) / 1000));
    if (seconds < 60) return "just now";
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} h ago`;
    return new Date(time).toLocaleDateString();
  }

  function show(tone, iconName, text, detail) {
    button.dataset.state = tone;
    icon.className = `fa-solid ${iconName}`;
    label.textContent = text;
    button.title = detail;
    button.setAttribute("aria-label", `${text}. ${detail}`);
    button.disabled = tone === "local";
    button.hidden = false;
  }

  async function render() {
    if (off) return;
    let info;
    try {
      info = await saves.gameStatus(gameId);
    } catch {
      return;
    }
    if (!info.support) {
      button.hidden = true;
      return;
    }
    if (info.support === "local-only")
      return show(
        "local",
        "fa-hard-drive",
        "On this device",
        "This game's saves stay in this browser and can't go to the cloud.",
      );
    if (!info.signedIn)
      return show(
        "idle",
        "fa-cloud",
        "Sign in to save",
        "Sign in to keep this game's save in the cloud.",
      );
    const state = info.state;
    if (busy || info.saving || state.status === "saving")
      return show(
        "busy",
        "fa-spinner fa-spin",
        "Saving…",
        "Saving to the cloud.",
      );
    switch (state.status) {
      case "signed-out":
        return show(
          "error",
          "fa-user-lock",
          "Sign in again",
          "Your session ended. Sign in again to save to the cloud.",
        );
      case "offline":
        return show(
          "error",
          "fa-plug-circle-xmark",
          "Offline",
          "Couldn't reach 55GMS. The save is kept here. Click to try again.",
        );
      case "failed":
      case "error":
        return show(
          "error",
          "fa-triangle-exclamation",
          "Not saved",
          `${state.error || "Couldn't save to the cloud"}. Click to try again.`,
        );
      case "cloud-newer":
        return show(
          "warn",
          "fa-cloud-arrow-down",
          "Newer in cloud",
          "Another device saved this game since it started here. Reload the game to play that save.",
        );
    }
    if (info.dirty || (state.status === "synced" && !state.lastSyncedAt))
      return show(
        "pending",
        "fa-cloud-arrow-up",
        "Save",
        "This game has changes that aren't in the cloud yet. Click to save them.",
      );
    if (state.lastSyncedAt)
      return show(
        "ok",
        "fa-circle-check",
        "Saved",
        `Saved to the cloud ${ago(state.lastSyncedAt)}. Click to save again.`,
      );
    show(
      "idle",
      "fa-cloud-arrow-up",
      "Save",
      "Nothing from this game is in the cloud yet. Click to save it.",
    );
  }

  function later() {
    clearTimeout(timer);
    timer = setTimeout(render, 150);
  }

  button.addEventListener("click", async () => {
    if (busy || button.dataset.state === "busy") return;
    const info = await saves.gameStatus(gameId).catch(() => null);
    if (!info?.support || info.support === "local-only") return;
    // A new tab, so the running game is not lost; this page notices the
    // sign-in through the storage event.
    if (!info.signedIn || info.state?.status === "signed-out") {
      window.open("/login", "_blank", "noopener");
      return;
    }
    busy = true;
    render();
    try {
      await saves.saveNow(gameId);
    } catch (error) {
      console.error("[cloud saves] save", error);
    } finally {
      busy = false;
      render();
    }
  });

  saves.on("status", (detail) => {
    if (detail?.gameId === gameId) later();
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "uuid" || event.key === "gms-session") later();
  });
  // Keeps "Saved … ago" current and picks up changes the game makes.
  setInterval(() => {
    if (document.visibilityState === "visible") render();
  }, 30000);

  render();
  saves
    .entitlement()
    .then((entitlement) => {
      if (!entitlement.off) return;
      off = true;
      button.hidden = true;
    })
    .catch(() => {});
})();
