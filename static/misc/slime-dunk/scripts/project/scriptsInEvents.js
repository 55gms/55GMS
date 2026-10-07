


const scriptsInEvents = {

	async Sdk_Event50_Act1(runtime, localVars)
	{
		PokiSDK.measure(localVars.Category,localVars.Action,localVars.Label);
	},

	async Loader_Event17(runtime, localVars)
	{
		const dict = runtime.objects.Locals.getPickedInstances()[0].getDataMap();
		const levelName = dict.get("Level");
		
		try {
		  // Attempt to get the layout. If it doesn't exist, runtime.getLayout() might throw an error
		  // or return a falsy value depending on its implementation.
		  // Assuming runtime.getLayout() throws an error or returns null/undefined if not found.
		  if (runtime.getLayout(levelName)) {
		    runtime.goToLayout(levelName);
		  } else {
		    // If runtime.getLayout(levelName) returns a falsy value but doesn't throw an error
		    // (e.g., null or undefined when the layout doesn't exist), we go to Level_1.
		    runtime.goToLayout("Level_1");
		  }
		} catch (error) {
		  // This catch block will execute if runtime.getLayout(levelName) throws an actual error.
		  //console.error("Error checking layout existence:", error);
		  runtime.goToLayout("Level_1");
		}
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

