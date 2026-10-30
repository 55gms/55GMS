// Complete local SWFs run in a pinned, shared Ruffle runtime.
(async () => {
  const config = JSON.parse(
    document.getElementById("gms-flash-config").textContent,
  );
  try {
    GameLoader.track([config.file], config.bytes);
    const player = RufflePlayer.newest().createPlayer();
    document.getElementById("game").appendChild(player);
    window.gmsFlashPlayer = player;
    await player
      .ruffle()
      .load({ url: config.file });
    GameLoader.finish();
    document.body.dataset.gmsReady = "true";
  } catch (error) {
    GameLoader.fail(error);
    document.body.dataset.gmsError = String(error);
  }
})();
