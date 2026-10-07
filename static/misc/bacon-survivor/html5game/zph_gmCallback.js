//======= GM Callback v1.1 ========
//By JacksonYarr
//Website: http://JacksonYarr.com/
//License: Creative Commons Attribution 3.0 Unported License
//=================================

var gmCallback = new Object();

function callback_script(extname,numargs)
{
	if(gmCallback[extname] != undefined)
	{return true;}
	
	var obFunc = window["callback_script"].caller.name;

	if(obFunc == undefined) //IE always makes things difficult.
	{obFunc = arguments.callee.caller.toString().match(/function ([^\(]+)/)[1];}
	
	var args = "";
	var gmres = "0,0";
	
	if(numargs > 0)
	{
		while(numargs > 0)
		{
			args = "arg"+numargs+","+args;
			numargs--;
		}
		
		args = args.slice(0,-1);
		gmres = gmres+",";
	}
	
	gmCallback[extname] = eval("(function("+ args +"){"+ obFunc +"("+ gmres + args +");})");
	
	return false;
}

function callback_define_script(extname,gmscript)
{
	if(gmCallback[extname] != undefined)
	{return true;}
	
	return false;
}