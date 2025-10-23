// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";
let is_poki_added = false;
let initalized_poki_sdk = false;

runOnStartup(async runtime =>
{
	// Code to run on the loading screen.
	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'patch/poki-sdk.js';    
	document.head.appendChild(script);
	script.onload = () => {
	is_poki_added = true;
    console.log('Poki SDK loaded successfully!');
  	};
  
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});


async function OnBeforeProjectStart(runtime)
{
	// Code to run just before 'On start of layout' on
	// the first layout. Loading has finished and initial
	// instances are created and available to use here.
	runtime.addEventListener("tick", () => Tick(runtime));
	// Note layouts, objects etc. are not yet available.
	
}


function Tick(runtime)
{
	// Code to run every tick
	if(is_poki_added && !initalized_poki_sdk){
		initPokiSDK();
	}
}

async function initPokiSDK()
{
	window.PokiSDK.init().then(() => {
		console.log("Poki SDK successfully initialized");
		initalized_poki_sdk = true;
		// fire your function to continue to game
		}).catch(() => {
		console.log("Initialized, something went wrong, load you game anyway");
		pokiinitalized_poki_sdk = true;
		// fire your function to continue to game
		});
}