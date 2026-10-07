function addScript(src, id, onload) {
	if (document.getElementById(id)) return;
	let fjs = document.getElementsByTagName("script")[0];
	let js = document.createElement("script");
	js.id = id;
	fjs.parentNode.insertBefore(js, fjs);
	js.onload = onload;
	js.onerror = onload;
	js.src = src;
}

addScript('poki-sdk.js', "poki-sdk", () => {
	try {
		PokiSDK.init().then(
	    () => {
	        console.log("Poki SDK successfully initialized");
	        globalThis.PokiHasInitialised = true;

	    }
		).catch(
			() => {
				console.log("Initialized, but the user likely has adblock");
				globalThis.PokiHasInitialised = true;
			}
		);
		PokiSDK.setDebug(false);
	} catch (err) {
		console.error("[patched] Poki SDK unavailable, proceeding anyway:", err);
		globalThis.PokiHasInitialised = true;
	}
})

window.addEventListener('keydown', ev => {
    if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
        ev.preventDefault();
    }
});
window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });



/*[patched] Poki sitelock disabled*/
