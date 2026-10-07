


const scriptsInEvents = {

	async Epokimanager_Event10_Act2(runtime, localVars)
	{
		// Neutralized: Poki's own level-data analytics beacon, not wanted on
		// this domain. See scripts/project/main.js for the matching PokiSDK fix.
	},

	async Epokimanager_Event15_Act1(runtime, localVars)
	{
		PokiSDK.customEvent('game','segment',{segment:runtime.layout.name})
	},

	async Epokimanager_Event17_Act4(runtime, localVars)
	{
		PokiSDK.commercialBreak().then(
		    () => {
		        console.log("Commercial break finished, proceeding to game");
				runtime.globalVars.PokiIsPaused = false;
				runtime.globalVars.PokiNoAdsPlaying = true;
				
				runtime.globalVars.PokiIsPlayingMidrollAd=false;
				//PokiSDK.gameplayStart();
				//runtime.globalVars.SDKStart=true;
		
		        // your code to continue to game
		    }
		);
	},

	async Epokimanager_Event19_Act4(runtime, localVars)
	{
		//PokiSDK.gameplayStop();
		
		PokiSDK.rewardedBreak().then(
		    (success) => {
		        if(success) {
		          // video was displayed, give reward
				  runtime.globalVars.PokiIsPaused = false;
				  runtime.globalVars.PokiNoAdsPlaying = true;
				  runtime.globalVars.PokiIsPlayingRewardedAd=false;
				  //PokiSDK.gameplayStart();	
				  runtime.globalVars.PokiGiveReward=true;
		
		        }
		        else {
				runtime.globalVars.PokiIsPaused = false;
				runtime.globalVars.PokiNoAdsPlaying = true;
				  runtime.globalVars.PokiIsPlayingRewardedAd=false;
				  //PokiSDK.gameplayStart();
				  //runtime.globalVars.PokiGiveReward=true;
				  //runtime.globalVars.gm_GoBackGame=true;
				  
		          // video not displayed, should probably not give reward
				 
		        }
		    }
		);
	},

	async Epokimanager_Event21_Act2(runtime, localVars)
	{
		PokiSDK.gameplayStart();
		console.log("Gameplay has started");
	},

	async Epokimanager_Event23_Act2(runtime, localVars)
	{
		PokiSDK.gameplayStop();
		console.log("Gameplay has stopped");
	},

	async Epokimanager_Event25_Act1(runtime, localVars)
	{
		PokiSDK.gameLoadingFinished();
	},

	async Eloading_Event4_Act3(runtime, localVars)
	{
		runtime.globalVars.PokiHasInitialised = globalThis.PokiHasInitialised;
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

