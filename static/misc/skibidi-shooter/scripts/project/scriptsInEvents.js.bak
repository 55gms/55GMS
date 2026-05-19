


const scriptsInEvents = {

	async Bulletcontrol_Event7_Act13(runtime, localVars)
	{
		let bullet = runtime.objects.bullet.getAllInstances()
		bullet = bullet[bullet.length - 1]
		let detector = runtime.objects.bullet_ray.getAllInstances()
		detector = detector[detector.length - 1]
		
		let z_elev = bullet.zElevation
		let x = bullet.x
		let y = bullet.y
		for(let i=0; i<runtime.globalVars.min_distance_slow_mo; i++)
		{
			z_elev += Math.cos(bullet.instVars.yAngle * Math.PI / 180) * runtime.globalVars.BULLET_SPEED * 60 * runtime.dt;
			x += Math.cos(bullet.instVars.xAngle * Math.PI / 180) * runtime.globalVars.BULLET_SPEED * 60 * runtime.dt;
			y += Math.sin(bullet.instVars.xAngle * Math.PI / 180) * runtime.globalVars.BULLET_SPEED * 60 * runtime.dt;
		}
		detector.x = x
		detector.y = y
		detector.zElevation = z_elev
		detector.instVars.xAngle = bullet.instVars.xAngle
		detector.instVars.yAngle = bullet.instVars.yAngle
	},

	async Ads_functions_Event1_Act1(runtime, localVars)
	{
		// pause your game here if it isn't already
		PokiSDK.commercialBreak(() => {
		  // you can pause any background music or other audio here
		}).then(() => {
		  console.log("Commercial break finished, proceeding to game");
		  // if the audio was paused you can resume it here (keep in mind that the function above to pause it might not always get called)
		  // continue your game here
		});
		
	},

	async Ads_functions_Event2_Act1(runtime, localVars)
	{
		// pause your game here if it isn't already
		PokiSDK.rewardedBreak(() => {
		  // you can pause any background music or other audio here
		  runtime.globalVars.pause=1;
		}).then((success) => {
		    if(success) {
		        // video was displayed, give reward
				runtime.globalVars.store=1;
				  runtime.globalVars.preventer=1;
				  
		    } else {
		        // video not displayed, should not give reward
				runtime.globalVars.store=-1;
		    }
		    // if the audio was paused you can resume it here (keep in mind that the function above to pause it might not always get called)
		    console.log("Rewarded break finished, proceeding to game");
			runtime.globalVars.pause=-1;
			
		    // continue your game here
		});
		
	},

	async Ads_functions_Event3_Act1(runtime, localVars)
	{
		// pause your game here if it isn't already
		PokiSDK.rewardedBreak(() => {
		  // you can pause any background music or other audio here
		  runtime.globalVars.pause=1;
		}).then((success) => {
		    if(success) {
		        // video was displayed, give reward
				runtime.globalVars.head_sniper+=10;
				 
				 
		    } else {
		        // video not displayed, should not give reward
				runtime.globalVars.pause=-1;
		    }
		    // if the audio was paused you can resume it here (keep in mind that the function above to pause it might not always get called)
		    console.log("Rewarded break finished, proceeding to game");
			runtime.globalVars.pause=-1;
		runtime.globalVars.rewaredede_response=1;
		    // continue your game here
		});
		
	},

	async Ads_functions_Event4_Act1(runtime, localVars)
	{
		// pause your game here if it isn't already
		PokiSDK.rewardedBreak(() => {
		  // you can pause any background music or other audio here
		  runtime.globalVars.pause=1;
		}).then((success) => {
		    if(success) {
		        // video was displayed, give reward
				runtime.globalVars.sniper_ammo=5;
				
				
		    } else {
		        // video not displayed, should not give reward
				
		    }
		    // if the audio was paused you can resume it here (keep in mind that the function above to pause it might not always get called)
		    console.log("Rewarded break finished, proceeding to game");
			runtime.globalVars.pause=-1;
			runtime.globalVars.rewaredede_response=1;
		    // continue your game here
		});
		
	},

	async Ads_functions_Event5_Act1(runtime, localVars)
	{
		// pause your game here if it isn't already
		PokiSDK.rewardedBreak(() => {
		  // you can pause any background music or other audio here
		  runtime.globalVars.pause=1;
		}).then((success) => {
		    if(success) {
		        // video was displayed, give reward
				runtime.globalVars.head_ak+=120;
				 
		    } else {
		        // video not displayed, should not give reward
				runtime.globalVars.pause=-1;
		    }
		    // if the audio was paused you can resume it here (keep in mind that the function above to pause it might not always get called)
		    console.log("Rewarded break finished, proceeding to game");
			runtime.globalVars.pause=-1;
			runtime.globalVars.rewaredede_response=1;
		    // continue your game here
		});
		
	},

	async Ads_functions_Event6_Act1(runtime, localVars)
	{
		// pause your game here if it isn't already
		PokiSDK.rewardedBreak(() => {
		  // you can pause any background music or other audio here
		  runtime.globalVars.pause=1;
		}).then((success) => {
		    if(success) {
		        // video was displayed, give reward
				runtime.globalVars.ak47_ammo=20;
				
			
		    } else {
		        // video not displayed, should not give reward
				
		    }
		    // if the audio was paused you can resume it here (keep in mind that the function above to pause it might not always get called)
		    console.log("Rewarded break finished, proceeding to game");
			runtime.globalVars.pause=-1;
			runtime.globalVars.rewaredede_response=1;
		    // continue your game here
		});
		
	},

	async Ads_functions_Event7_Act1(runtime, localVars)
	{
		PokiSDK.gameplayStart();
	},

	async Ads_functions_Event8_Act1(runtime, localVars)
	{
		PokiSDK.gameplayStop();
	},

	async Ads_functions_Event11_Act1(runtime, localVars)
	{
		PokiSDK.init().then(() => {
		    console.log("Poki SDK successfully initialized");
		    // fire your function to continue to game
		}).catch(() => {
		    console.log("Initialized, something went wrong, load you game anyway");
		    // fire your function to continue to game
		});
		
	},

	async Ads_functions_Event11_Act3(runtime, localVars)
	{
		// fire loading function here
		PokiSDK.gameLoadingFinished();
		
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

