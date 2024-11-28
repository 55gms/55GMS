


const scriptsInEvents = {

	async MMonetisation_Event5_Act1(runtime, localVars)
	{
		localVars.enabled = globalThis.WebSdkWrapperBridge.enabled
	},

	async MMonetisation_Event9_Act1(runtime, localVars)
	{
		localVars.hasAdblocks = globalThis.WebSdkWrapperBridge.hasAdblock()
	},

	async MMonetisation_Event13_Act1(runtime, localVars)
	{
		localVars.hasAds = globalThis.WebSdkWrapperBridge.hasAds()
	},

	async MMonetisation_Event16_Act1(runtime, localVars)
	{
		runtime.setReturnValue(globalThis.WebSdkWrapperBridge.currentSdk.name);
	},

	async MMonetisation_Event20_Act1(runtime, localVars)
	{
		const signal = localVars.signal;
		globalThis.WebSdkWrapperBridge.rewarded().then(result => {
			runtime.globalVars.M_Monetisation_AdSuccess = !!result;
			runtime.callFunction("M_Monetisation_Signal", signal)
		})
		globalThis.WebSdkWrapperBridge.dispatch("adStarted");
	},

	async MMonetisation_Event23_Act1(runtime, localVars)
	{
		const signal = localVars.signal;
		globalThis.WebSdkWrapperBridge.interstitial().then(result => {
			runtime.globalVars.M_Monetisation_AdSuccess = !!result;
			runtime.callFunction("M_Monetisation_Signal", signal)
		})
		globalThis.WebSdkWrapperBridge.dispatch("adStarted");
	},

	async MMonetisation_Event25_Act2(runtime, localVars)
	{
		const config = JSON.parse(localVars.config);
		localVars.name = config['platform']
		
		if (config['extraData'][localVars.name]) {
			const data = config['extraData'][localVars.name]['data'];
			let debugData = config['extraData'][localVars.name]['debugData'];
		
			if (debugData === undefined) debugData = data
		
			localVars.data = JSON.stringify(data);
			localVars.debugData = JSON.stringify(debugData);
		}
	},

	async MMonetisation_Event26_Act1(runtime, localVars)
	{
		const signal = localVars.signal;
		globalThis.WebSdkWrapperBridge.init(localVars.name, true, JSON.parse(localVars.debugData)).then(() => {
			runtime.callFunction("M_Monetisation_Signal", signal)
		})
	},

	async MMonetisation_Event27_Act1(runtime, localVars)
	{
		const signal = localVars.signal;
		globalThis.WebSdkWrapperBridge.init(localVars.name, false, JSON.parse(localVars.data)).then(() => {
			runtime.callFunction("M_Monetisation_Signal", signal)
		})
	},

	async MMonetisation_Event28_Act1(runtime, localVars)
	{
		globalThis.WebSdkWrapperBridge.banner(JSON.parse(localVars.data))
	},

	async MMonetisation_Event30_Act1(runtime, localVars)
	{
		globalThis.WebSdkWrapperBridge.happyTime(localVars.scale)
	},

	async MMonetisation_Event31_Act1(runtime, localVars)
	{
		globalThis.WebSdkWrapperBridge.gameplayStart()
	},

	async MMonetisation_Event32_Act1(runtime, localVars)
	{
		globalThis.WebSdkWrapperBridge.gameplayStop()
	},

	async MMonetisation_Event33_Act1(runtime, localVars)
	{
		globalThis.WebSdkWrapperBridge.loadingStart()
	},

	async MMonetisation_Event34_Act1(runtime, localVars)
	{
		globalThis.WebSdkWrapperBridge.loadingEnd()
	},

	async MMonetisation_Event35_Act1(runtime, localVars)
	{
		globalThis.WebSdkWrapperBridge.loadingProgress(localVars.progress)
	},

	async MMonetisation_Event36_Act1(runtime, localVars)
	{
		globalThis.WebSdkWrapperBridge.levelStart(localVars.level)
	},

	async MMonetisation_Event37_Act1(runtime, localVars)
	{
		globalThis.WebSdkWrapperBridge.replayLevel(localVars.level)
	},

	async MMonetisation_Event38_Act1(runtime, localVars)
	{
		globalThis.WebSdkWrapperBridge.score(localVars.score)
	},

	async Shared_Event2_Act2(runtime, localVars)
	{
		self.addEventListener('keydown', ev => {
		    if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
		        ev.preventDefault();
		    }
		});
		self.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });
	},

	async Shared_Event23_Act2(runtime, localVars)
	{
		//let inst = runtime.objects.Mouse_Cursor.getFirstInstance();
		let inst = runtime.objects.Mouse_Cursor.getFirstPickedInstance();
		inst.x = runtime.mouse.getMouseX("UI");
		inst.y = runtime.mouse.getMouseY("UI");
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

