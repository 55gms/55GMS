


const scriptsInEvents = {

		async Epokimanager_Event2_Act4(runtime, localVars)
		{
			runtime.globalVars.PokiHasInitialised = globalThis.PokiHasInitialised;
		},

		async Epokimanager_Event9_Act3(runtime, localVars)
		{
			PokiSDK.commercialBreak().then(
			    () => {
			        console.log("Commercial break finished, proceeding to game");
					runtime.globalVars.GmIsPaused = false;
					runtime.globalVars.gmLaunchSounds = true;
					runtime.globalVars.PokiIsPlayingMidrollAd=false;
					PokiSDK.gameplayStart();
					
			        // your code to continue to game
			    }
			);
		},

		async Epokimanager_Event11_Act3(runtime, localVars)
		{
			PokiSDK.gameplayStop();
			
			PokiSDK.rewardedBreak().then(
			    (success) => {
			        if(success) {
			          // video was displayed, give reward
					  runtime.globalVars.GmIsPaused = false;
					  runtime.globalVars.PokiIsPlayingRewardedAd=false;
					  runtime.globalVars.gmGiveReward=true;
			        }
			        else {
					runtime.globalVars.GmIsPaused = false;
					  runtime.globalVars.PokiIsPlayingRewardedAd=false;
					  runtime.globalVars.gm_GoBackGame=true;
					  
			          // video not displayed, should probably not give reward
					 
			        }
			    }
			);
		},

		async Epokimanager_Event13_Act1(runtime, localVars)
		{
			PokiSDK.gameplayStart();
			console.log("Gameplay has started");
		},

		async Epokimanager_Event15_Act1(runtime, localVars)
		{
			PokiSDK.gameplayStop();
			console.log("Gameplay has stopped");
		},

		async Epokimanager_Event17_Act1(runtime, localVars)
		{
			PokiSDK.gameLoadingStart();
			console.log("gameloading has started");
		},

		async Epokimanager_Event19_Act1(runtime, localVars)
		{
			PokiSDK.gameLoadingFinished();
			console.log ("gameloading has finished");
		},

		async Egameplay_Event2_Act1(runtime, localVars)
		{
			PokiSDK.customEvent('game', 'segment', { segment: runtime.layout.name })
		}

};

self.C3.ScriptsInEvents = scriptsInEvents;

