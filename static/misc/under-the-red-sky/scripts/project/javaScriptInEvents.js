import {
  pushGhostPosition,
  saveGhostData,
  getGhostDataCopy,
  startGhostPlayback,
  interpolateGhostPosition,
  clearGhostData,
  getGhostDataJSON,
  loadGhostData,
} from "./ghost.js";

import { Inputs } from "./inputs.js";
import { isScriptInputOverridden } from "./scriptInputOverrides.js";
import {
  getBindingIcon,
  resolveIconTokens,
  getGamepadBrand,
  inputFontIconForBinding,
  inputFontIconForCode,
} from "./inputBindingDisplay.js";
import { gameIconTag } from "./gameIconsGenerated.js";
import { updateCollisionSpace, castRay } from "./collision.js";
import Utils from "./utils.js";
import Vec3 from "./fedVector3.js";
import Vec2 from "./fedVector2.js";
import { getBestEndpoint } from "./getColyseusEndpoint.js";
import {
  pushRemoteSnapshot,
  sampleRemotePosition,
  dropRemotePlayer,
  resetRemoteInterp,
} from "./remoteInterp.js";
import getWorkshopShowcase from "./getWorkshopShowcase.js";

import {
  getDataFromStorage,
  saveDataToStorage,
  clearDataFromStorage,
} from "./main.js";

import {
  getFirstRayIntersection,
  getRayIntersectionReflectAndNormal,
} from "./levelEditor/raycast.js";
import {
  createDebugLine,
  createDebugGizmoForInstanceTris,
  updateDebugGizmoForInstanceTris,
  deleteDebugGizmoIds,
} from "./levelEditor/debugGizmos.js";
import * as lookTouchCamera from "./lookTouchCamera.js";


const scriptsInEvents = {

	async Utils_Event1_Act1(runtime, localVars)
	{
		runtime.setReturnValue(Utils.angleClamp(localVars.angle1, localVars.minimum, localVars.maximum))
	},

	async Utils_Event2_Act1(runtime, localVars)
	{
		const temp = Utils.remap(localVars.value, localVars.fromMin, localVars.fromMax, localVars.toMin, localVars.toMax);
		runtime.setReturnValue(Utils.clamp(temp, localVars.toMin, localVars.toMax))
	},

	async Utils_Event4_Act1(runtime, localVars)
	{
		runtime.setReturnValue(Utils.wrap0(localVars.value, localVars.maxValue))
	},

	async Utils_Event5_Act1(runtime, localVars)
	{
		runtime.setReturnValue(1);
		try {
		    JSON.parse(localVars.jsonString);
		} catch (e) {
		    runtime.setReturnValue(0);
		}
	},

	async Utils_Event7_Act1(runtime, localVars)
	{
		const inst = runtime.getInstanceByUid(localVars.uid);
		const player = runtime.objects.player.getFirstInstance();
		if (player.totalZElevation <= inst.totalZElevation + inst.zHeight && player.totalZElevation + player.instVars.standHeight >= inst.totalZElevation) runtime.setReturnValue(1);
	},

	async Utils_Event8_Act1(runtime, localVars)
	{
		const inst = runtime.getInstanceByUid(localVars.uid);
		const inst2 = runtime.getInstanceByUid(localVars.uid2);
		if (inst2.totalZElevation <= inst.totalZElevation + inst.zHeight && inst2.totalZElevation + inst2.zHeight >= inst.totalZElevation) runtime.setReturnValue(1);
	},

	async Utils_Event10_Act1(runtime, localVars)
	{
		runtime.setReturnValue(Utils.pixelToMeter(localVars.pixel))
	},

	async Utils_Event11_Act1(runtime, localVars)
	{
		runtime.setReturnValue(Utils.meterToPixel(localVars.meter))
	},

	async Utils_Event12_Act1(runtime, localVars)
	{
		let rndtxt = "";
		const len = localVars.length;
		for (let i = 0; i < len; i++) {
		  rndtxt += String.fromCodePoint(Math.floor(Math.random()*65535));
		}
		runtime.setReturnValue(rndtxt)
	},

	async Utils_Event13_Act1(runtime, localVars)
	{
		const colors = {
			"red": -270204982526975, //245,0,0
			"offWhite": -259225688129535, //235,235,235
			"almostBlack": -4398314972159, //4, 4, 6
			"blue": -11443110911, //0, 170, 255
			"lightGrey": -231736219611135, //210, 210, 210
			"midGrey": -178681545370623, //162, 162, 162
			"yellow": -281489388611583, //255, 214, 66
			"lime": -199578540393471 //181, 255, 20
			};
		
		runtime.setReturnValue(colors[localVars.colorName])
	},

	async Utils_Event14_Act1(runtime, localVars)
	{
		const tokens = localVars.tokens.split(",");
		const isMatch = (element) => element == localVars.curToken;
		const tokenIndex = tokens.findIndex(isMatch);
		runtime.setReturnValue(tokens[Utils.wrap0(tokenIndex + localVars.progress, tokens.length)])
	},

	async Utils_Event15_Act1(runtime, localVars)
	{
		const colorValue = localVars.colorValue;
		const r = Math.round(parseInt(-colorValue / 2 ** 38) % 2048 * 255 / 1024);
		const g = Math.round(parseInt(-colorValue / 2 ** 24) % 2048 * 255 / 1024);
		const b = Math.round(parseInt(-colorValue / 2 ** 10) % 2048 * 255 / 1024);
		const hex = "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
		
		runtime.setReturnValue(hex)
	},

	async Utils_Event16_Act1(runtime, localVars)
	{
		const o = runtime.getInstanceByUid(localVars.UID).getJsonDataCopy();
		if (localVars.path == "") runtime.setReturnValue(Object.keys(o).length);
		else runtime.setReturnValue(Object.keys(o[localVars.path]).length);
		
	},

	async Utils_Event44_Act2(runtime, localVars)
	{
		const fallback = "1";
		
		try{
			const level = localVars.lastLevel;
			if (runtime.getLayout(level)){
		 		runtime.setReturnValue(level)
			}
			else runtime.setReturnValue(fallback)
		} catch(_) {
			runtime.setReturnValue(fallback)
		}
		
	},

	async Utils_Event46_Act2(runtime, localVars)
	{
		const fallback = "mainHub";
		
		try{
			const level = localVars.lastHub;
			if (runtime.getLayout(level)){
		 		runtime.setReturnValue(level)
			}
			else runtime.setReturnValue(fallback)
		} catch(_) {
			runtime.setReturnValue(fallback)
		}
		
	},

	async Utils_Event48(runtime, localVars)
	{
		let chaptersKeys = Object.keys(runtime.objects.levelData.getFirstInstance().getJsonDataCopy().chapters);
		const filteredChapters = chaptersKeys.filter((chapter) => runtime.callFunction("isChapterVisible", chapter));
		let nextChapter = filteredChapters[0];
		let breakNext = false;
		for (const chapter of filteredChapters) {
		    if (breakNext) {
		        nextChapter = chapter;
		        break
		    }
		    if (localVars.chapter === chapter) breakNext = true;
		}
		runtime.setReturnValue(nextChapter)
	},

	async Utils_Event49_Act1(runtime, localVars)
	{
		
	},

	async Utils_Event50(runtime, localVars)
	{
		const chaptersKeys = Object.keys(runtime.objects.levelData.getFirstInstance().getJsonDataCopy().chapters);
		const filteredChapters = chaptersKeys.filter((chapter) => runtime.callFunction("isChapterVisible", chapter));
		let previousChapter = filteredChapters[filteredChapters.length - 1];
		runtime.setReturnValue(previousChapter);
		
		for (const chapter of filteredChapters) {
		    if (localVars.chapter === chapter) {
		        runtime.setReturnValue(previousChapter);
		        break;
		    }
		    previousChapter = chapter;
		}
	},

	async Devcheats_Event39_Act1(runtime, localVars)
	{
		window.onkeypress = function(event)
		    {
		    if(event.keyCode==123)
		    {
		        //alert('Entered F12');
		        return false;
		    }
		    else if(event.ctrlKey && event.shiftKey && event.keyCode==73)
		    {
		        //alert('Entered ctrl+shift+i')
		        return false;  //Prevent from ctrl+shift+i
		    }
		    else if(event.ctrlKey && event.keyCode==73)
		    {
		        //alert('Entered ctrl+shift+i')
		        return false;  //Prevent from ctrl+shift+i
		    }
		    else if(event.keyCode==27)
		    {
		        //alert('Entered ESC');
		        return false;
		    }
		    else if(event.keyCode==122)
		    {
		        //alert('Entered F11');
		        return false;
		    }
		}
		
		window.onkeydown = function(event)
		    {
		    if(event.keyCode==123)
		    {
		        //alert('Entered F12');
		        return false;
		    }
		    else if(event.ctrlKey && event.shiftKey && event.keyCode==73)
		    {
		        //alert('Entered ctrl+shift+i')
		        return false;  //Prevent from ctrl+shift+i
		    }
		    else if(event.ctrlKey && event.keyCode==73)
		    {
		        //alert('Entered ctrl+shift+i')
		        return false;  //Prevent from ctrl+shift+i
		    }
		    else if(event.keyCode==27)
		    {
		        //alert('Entered ESC');
		        return false;
		    }
		    else if(event.keyCode==122)
		    {
		        //alert('Entered F11');
		        return false;
		    }
		}
		
		//document.oncontextmenu = function(e)
		//{
		//alert('Right Click Not Allowed')
		//e.preventDefault();
		//}
	},

	async E_cursed_Event2(runtime, localVars)
	{
		const levels = new Set([
			"GT-1",
			"GT-2",
			"GT-3",
			"GT-4",
			"GT-5",
			"GT-6",
			"GT-7",
			"Cursed_hub",
			"BAD REDIRECTION",
			"Tower"
		]);
		
		if (levels.has(runtime.layout.name)) {
			runtime.setReturnValue(1)
		}
	},

	async E_cursed_Event4(runtime, localVars)
	{
		const levels = new Set([
			"NT1",
			"NT2",
			"NT3",
			"NT4",
			"NT5",
			"1",
			"TutorialHub",
			"Prehub"
		]);
		
		if (levels.has(runtime.layout.name)) {
			runtime.setReturnValue(1)
		}
	},

	async Workshopshowcase_Event2_Act1(runtime, localVars)
	{
		let res = await getWorkshopShowcase();
		localVars.name = res.name;
		localVars.exists = res.exists;
	},

	async Leaderboards_Event1_Act1(runtime, localVars)
	{
		runtime.setReturnValue(globalThis.pokiLeaderboards.getLeaderboardId(localVars.level))
	},

	async Leaderboards_Event2_Act1(runtime, localVars)
	{
		runtime.setReturnValue(globalThis.pokiLeaderboards.getLevelName(localVars.leaderboard))
	},

	async Leaderboards_Event3_Act1(runtime, localVars)
	{
		runtime.setReturnValue(globalThis.pokiLeaderboards.hasLeaderboard(localVars.level)? 1 : 0)
	},

	async E_uicomponents_Event29_Act1(runtime, localVars)
	{
		localVars.levelEditor_returnDestination = globalThis.levelLoader.returnDestination;
	},

	async E_dialogs_Event82_Act1(runtime, localVars)
	{
		const save = runtime.objects.save.getFirstInstance().getJsonDataCopy();
		const levels = runtime.objects.levelData.getFirstInstance().getJsonDataCopy();
		
		let stars = 0;
		for (const level of Object.keys(save.levels)) {
		    if (level in levels && typeof save.levels[level].bestTime === "number") {
		        const bestTime = save.levels[level].bestTime;
		        
		        if (levels[level]["4Star"] >= bestTime) {
		            stars += 4;
		        }
				else if (levels[level]["3Star"] >= bestTime) {
		            stars += 3;
		        }
				else if (levels[level]["2Star"] >= bestTime) {
		            stars += 2;
		        }
				else if (levels[level]["1Star"] >= bestTime) {
		            stars += 1;
		        }
		    }
		}
		
		runtime.setReturnValue(stars)
	},

	async E_dialogs_Event83_Act1(runtime, localVars)
	{
		const save = runtime.objects.save.getFirstInstance().getJsonDataCopy();
		
		let secrets = 0;
		for (const level of Object.keys(save.levels)) {
		    if (save.levels[level].foundSecret) {secrets += 1};
		}
		
		runtime.setReturnValue(secrets)
	},

	async E_dialogs_Event84_Act1(runtime, localVars)
	{
		const leveldata = runtime.objects.levelData.getFirstInstance().getJsonDataCopy();
		
		let secrets = 0;
		for (const level of Object.keys(leveldata)) {
		    if (!leveldata[level].noSecret) {secrets += 1};
		}
		
		runtime.setReturnValue(secrets)
	},

	async E_dialogs_Event85_Act1(runtime, localVars)
	{
		const leveldata = runtime.objects.levelData.getFirstInstance().getJsonDataCopy();
		
		let stars = 0;
		for (const level of Object.keys(leveldata)) {
		    if (leveldata[level].hasStars) {stars += 1};
		}
		
		runtime.setReturnValue(stars)
	},

	async E_game_Event10_Act2(runtime, localVars)
	{
		for (const solid of runtime.objects.solid.instances()){
			solid.zElevation += Math.abs(Math.sin(solid.iid) * 43758.5453123 % 1) - 0.5;
			if(Math.sign(solid.width) + Math.sign(solid.height)) {
				solid.isBackFaceCulling = true;
				}
			}
	},

	async E_game_Event37_Act1(runtime, localVars)
	{
		for (let inst of runtime.objects.solidCollisionShape.pickedInstances()) {
			inst.isCollisionEnabled = false;
		}
	},

	async E_game_Event39_Act1(runtime, localVars)
	{
		for (let inst of runtime.objects.solidCollisionShape.pickedInstances()) {
			inst.isCollisionEnabled = true;
		}
	},

	async E_game_Event41_Act4(runtime, localVars)
	{
		globalThis?.levelLoader?.scriptRuntime?.fireGlobal("fail")
	},

	async E_game_Event56_Act1(runtime, localVars)
	{
		globalThis.levelLoader.cancelPendingTransition();
	},

	async E_game_Event171_Act1(runtime, localVars)
	{
		saveGhostData(runtime.objects.tempGhost.getFirstInstance())
	},

	async E_game_Event172_Act1(runtime, localVars)
	{
		const ghostData = getGhostDataCopy();
		const manager = runtime.objects.globalManager.getFirstInstance()
		globalThis.levelLoader.setTempData(manager.instVars.curLayoutId, {
			time: runtime.globalVars.timerTime,
			ghostData
		})
	},

	async E_game_Event173_Act1(runtime, localVars)
	{
		localVars.lastStepTime = 0;
		clearGhostData();
		pushGhostPosition(runtime.objects.player.getFirstInstance(), runtime.globalVars.timerTime)
	},

	async E_game_Event174_Act3(runtime, localVars)
	{
		const save = runtime.objects.save.getFirstInstance().getJsonDataCopy();
		const ghost = save.levels[localVars.layoutId].ghost;
		startGhostPlayback(ghost);
	},

	async E_game_Event175_Act1(runtime, localVars)
	{
		const ghost = runtime.objects.GhostShape.getFirstInstance();
		const player = runtime.objects.player.getFirstInstance();
		
		interpolateGhostPosition(ghost, runtime.globalVars.timerTime);
		ghost.opacity = (Vec3.fromInst(ghost).distance(Vec3.fromInst(player)) - 32) * 0.001;
	},

	async E_game_Event176_Act1(runtime, localVars)
	{
		pushGhostPosition(runtime.objects.player.getFirstInstance(), runtime.globalVars.timerTime)
	},

	async E_game_Event213_Act1(runtime, localVars)
	{
		const water = runtime.objects.deformPlane.getFirstPickedInstance();
		water.createMesh(32, 32);
		water.currentScroll = 0;
	},

	async E_game_Event215(runtime, localVars)
	{
		const water = runtime.objects.deformPlane.getFirstInstance();
		const waveHeight = 1500;
		water.currentScroll += water.dt * 12;
		const meshSize = water.getMeshSize();
		const scale = 12;
		const rng = runtime.objects.AdvancedRandom;
		
		for (let collumn = 0; collumn < meshSize[0]; collumn++)
		{
			for (let row = 0; row < meshSize[1]; row++)
				{
				water.setMeshPoint(collumn, row, 
				{mode:"relative", 
				x:0, y:0, 
				zElevation: rng.classic2d(water.currentScroll + row * scale, water.currentScroll + collumn * scale) * waveHeight} )	
				}
		}
	},

	async E_game_Event217(runtime, localVars)
	{
		const water = runtime.objects.sandDune.getFirstInstance();
		const waveHeight = 1600;
		const meshSize = water.getMeshSize();
		const scale = 0.02;
		
		for (let collumn = 0; collumn < meshSize[0]; collumn++)
		{
			for (let row = 0; row < meshSize[1]; row++)
				{
				water.setMeshPoint(collumn, row, 
				{mode:"relative", 
				x:0, y:0, 
				zElevation: runtime.objects.AdvancedRandom.classic2d((water.y + (row / meshSize[1]) * water.height) * scale, (water.x + (collumn / meshSize[0]) * water.width) * scale) * waveHeight} )	
				}
		}
	},

	async E_game_Event219(runtime, localVars)
	{
		const camPos = Vec3.fromArray(runtime.objects.camera.getCameraPosition());
		const distanceLimitSquared = 4000 * 4000;
		for(const inst of runtime.objects.distanceCull3DObject.instances()){
			inst.isVisible = camPos.distanceSquared(Vec3.fromInst(inst)) < distanceLimitSquared
		}
	},

	async E_game_Event226_Act3(runtime, localVars)
	{
		const inst = runtime.objects.worldHudMarker.getFirstPickedInstance();
		const target = runtime.objects.worldHudTarget.getFirstPickedInstance();
		
		inst.targetUID = target.uid;
		inst.instVars.targetUID = target.uid;
		target.offset = target.instVars.offset;
		
		
	},

	async E_game_Event245(runtime, localVars)
	{
		const camPos = Vec3.fromArray(runtime.objects.camera.getCameraPosition());
		const camLook = Vec3.fromArray(runtime.objects.camera.getLookVector());
		
		for (const inst of runtime.objects.worldHudMarker.instances()) {
			
		    const target = runtime?.getInstanceByUid(inst.targetUID);
		
			if(!target) {
				inst.destroy();
				continue;
			}
		
			if(!target.instVars.shouldBeMarkedInHud) {
				inst.isVisible = false;
				continue
			}
		
			const textInst = inst.getChildAt(0);
		    const targetPos = new Vec3(target.x, target.y, target.totalZElevation + 256 + target.offset);
		    const hudPos = Utils.worldPosToHudPos(runtime, camPos, camLook, target.x, target.y, target.totalZElevation + 256 + target.offset, true);
			inst.isVisible = !!hudPos;
			inst.setPosition(hudPos.x, hudPos.y);
		
			inst.instVars.isOffscreen = hudPos.isOffscreen ? 1: 0;
		
		    const distance = camPos.distance(targetPos);
		    textInst.text = String(Math.ceil(Utils.pixelToMeter(distance))) + "m"
		}
	},

	async E_game_Event266_Act1(runtime, localVars)
	{
		const inst = runtime.objects.inspectables.getFirstPickedInstance();
		inst.inspectDistSq = inst.instVars.inspectDistance * inst.instVars.inspectDistance;
	},

	async E_game_Event269_Act1(runtime, localVars)
	{
		const playerInst = runtime.objects.player.getFirstPickedInstance();
		if (playerInst) {
		    const playerPosition = Vec3.fromInst(playerInst);
		
		    for (const inst of runtime.objects.inspectables.instances()) {
		        if (inst.inspectDistSq > playerPosition.distanceSquared(Vec3.fromInst(inst))) {
		            runtime.setReturnValue(inst.uid);
		            break;
		        }
		    }
		}
	},

	async E_game_Event293_Act7(runtime, localVars)
	{
		globalThis?.levelLoader?.scriptRuntime?.fireForPickedObjects("pressurePlates", "pressed")
	},

	async E_game_Event294_Act5(runtime, localVars)
	{
		globalThis?.levelLoader?.scriptRuntime?.fireForPickedObjects("pressurePlates", "released")
	},

	async E_game_Event301_Act7(runtime, localVars)
	{
		globalThis?.levelLoader?.scriptRuntime?.fireForPickedObjects("doors", "opened")
	},

	async E_game_Event302_Act4(runtime, localVars)
	{
		globalThis?.levelLoader?.scriptRuntime?.fireForPickedObjects("doors", "closed")
	},

	async E_game_Event330(runtime, localVars)
	{
		const inst = runtime.getInstanceByUid(localVars.uid);
		if (inst) {
		    const camPos = Vec3.fromArray(runtime.objects.camera.getCameraPosition());
		    const instPos = new Vec3(inst.x, inst.y, inst.totalZElevation + 8);
		    if (inst.isOnScreen() && instPos.distance(camPos) <= localVars.castDistance && castRay(runtime, camPos, instPos, runtime.objects.solid)) {
		        runtime.setReturnValue(1);
		    }
		}
	},

	async E_game_Event332(runtime, localVars)
	{
		const camPos = Vec3.fromArray(runtime.objects.camera.getCameraPosition());
		const camLook = Vec3.fromArray(runtime.objects.camera.getLookVector());
		if (!castRay(runtime, camPos, camLook.multiply(camPos), [runtime.objects.solid, runtime.objects[localVars.objectType]])) {
			runtime.setReturnValue(runtime.objects.rayCastData.getFirstInstance().instVars.hitUID);
		} else runtime.setReturnValue(0)
	},

	async E_game_Event334_Act1(runtime, localVars)
	{
		const distanceThreshold = localVars.distanceThreshold;
		const thresholdSquared = (distanceThreshold + localVars.preFinish) * (distanceThreshold + localVars.preFinish);
		const player = Vec3.fromInst(runtime.objects.player.getFirstInstance());
		let tempX = 0;
		let tempY = 0;
		let tempZ = 0;
		let distanceSquared = 0;
		let alpha = 0;
		
		for (const inst of runtime.objects.scatterShape.instances()) {
		    if (inst.animationType === "distance") {
		        tempX = inst.targetX - player.x;
		        tempY = inst.targetY - player.y;
		        tempZ = inst.targetZ - player.z;
		        distanceSquared = tempX * tempX + tempY * tempY + tempZ * tempZ;
		        if (distanceSquared > thresholdSquared) continue;
		        alpha = 1 - Math.max(Math.sqrt(distanceSquared) - localVars.preFinish, 0) / distanceThreshold;
		
		    } else if (inst.animationType === "trigger") {
		        if (inst.instVars.state === "none") continue;
		        inst.instVars.time = Math.max(0, inst.instVars.time - inst.dt);
		        if (inst.instVars.state === "wait") {
		            if (inst.instVars.time === 0) {
		                inst.instVars.state = "animate";
		                inst.instVars.time = 1.5
		            } else continue;
		        } else if (inst.instVars.state === "animate")
		            alpha = 1 - (inst.instVars.time / 1.5);
		        if (inst.instVars.time === 0) inst.instVars.state = "none"
		    }
		
		    if (inst.randomizeX) inst.x = Utils.lerp(inst.randomX, inst.targetX, alpha);
		    if (inst.randomizeY) inst.y = Utils.lerp(inst.randomY, inst.targetY, alpha);
		    if (inst.randomizeZ) inst.zElevation = Utils.lerp(inst.randomZ, inst.targetZ, alpha);
		    if (inst.randomizeAngle) inst.angleDegrees = Utils.lerp(inst.randomAngle, inst.targetAngle, alpha);
		    if (inst.animateScale) {
		        inst.height = inst.targetHeight * alpha;
		        inst.width = inst.targetWidth * alpha;
		        inst.zHeight = inst.targetZHeight * alpha;
		    }
		}
	},

	async E_game_Event337_Act1(runtime, localVars)
	{
		const playerPos = Vec3.fromInst(runtime.objects.player.getFirstInstance());
		for (const inst of runtime.objects.proximityFadeText.instances()){
			const dist = Vec3.fromInst(inst).distance(playerPos);
			if (dist > inst.instVars.fadeStart + inst.instVars.fullVisibleDistance) {
				inst.isVisible = false;
				continue;}
			inst.isVisible = true;
			const remappedDist = 1 - (dist - inst.instVars.fullVisibleDistance) / inst.instVars.fadeStart;
			inst.effects[0].setParameter(2, Utils.clamp(remappedDist, 0, 1));
		}
	},

	async E_game_Event371_Act2(runtime, localVars)
	{
		globalThis?.levelLoader?.scriptRuntime?.fireGlobal("fail")
	},

	async E_game_Event375_Act1(runtime, localVars)
	{
		const inst = runtime.objects.flags.getFirstPickedInstance();
		inst.createMesh(inst.width / inst.instVars.meshPointPerPixels, inst.height / inst.instVars.meshPointPerPixels);
		inst.isConnectedLeft = inst.instVars.isConnectedLeft;
		inst.isConnectedRight = inst.instVars.isConnectedRight;
		inst.isConnectedBottom = inst.instVars.isConnectedBottom;
		inst.isConnectedTop = inst.instVars.isConnectedTop;
		inst.windSpeed = inst.instVars.windSpeed;
		inst.movementScale = inst.instVars.movementScale;
		inst.progress = 0;
	},

	async E_game_Event376(runtime, localVars)
	{
		const rng = runtime.objects.AdvancedRandom;
		const dt = runtime.dt;
		for (const flag of runtime.objects.flags.instances()) {
			if (!flag.isOnScreen()) continue;
			flag.progress += flag.windSpeed * dt;
			const scale = flag.movementScale;
			const meshSize = flag.getMeshSize();
			const height = flag.height;
		    for (let x = 0; x < meshSize[0]; x++) {
		        for (let y = 0; y < meshSize[1]; y++) {
		            let connectFactor = 1;
					if (flag.isConnectedLeft) connectFactor = x / (meshSize[0] - 1);
					if (flag.isConnectedRight) connectFactor *= (meshSize[0] - 1 - x) / (meshSize[0] - 1);
					if (flag.isConnectedBottom) connectFactor *= y / (meshSize[1] - 1);
					if (flag.isConnectedTop) connectFactor *= (meshSize[1] - 1 - y) / (meshSize[1] - 1);
					
		            const random = (rng.classic2d((x + flag.progress + flag.uid) * scale, (y + flag.progress + flag.uid) * scale) * 1.6 - 1) * connectFactor;
		            flag.setMeshPoint(x, y, {
		                mode: "relative",
		                x: random,
		                y: random - y / (meshSize[1] -1),
		                zElevation: random * 25 + (y / meshSize[1] * height),
		                u: 0,
		                v: 0
		            })
		        }
		    }
		}
	},

	async E_game_Event378_Act1(runtime, localVars)
	{
		let string = " ";
		for (let i = 0; i < 5; i++){
			string += i < localVars.difficulty ? gameIconTag("starFilled") : gameIconTag("star")
		}
		runtime.setReturnValue(string)
	},

	async E_game_Event379_Act1(runtime, localVars)
	{
		let UID = -1;
		let closestDist = Infinity;
		const playerZ = runtime.objects.player.getFirstPickedInstance().totalZElevation;
		const playerPos = Vec2.fromInst(runtime.objects.player.getFirstPickedInstance());
		
		for(const inst of runtime.objects.endZone.instances()){
			if (inst.instVars.goToNext || inst.instVars.travelingTo === "") {continue};
			const dist = playerPos.distance(Vec2.fromInst(inst));
			if(dist < closestDist && dist <= inst.instVars.leadsToDistanceThreshold && Math.abs(inst.totalZElevation - playerZ) < inst.zHeight * 1.1){
				closestDist = dist;
				UID = inst.uid
			}
		}
		runtime.setReturnValue(UID)
	},

	async E_game_Event418_Act1(runtime, localVars)
	{
		for (const inst of runtime.objects.autoFontSize.getPickedInstances()) {
		    for (let i = 0; i < 32; i++) {
		        if (inst.textWidth > inst.width || inst.textHeight > inst.height)
		            inst.sizePt -= 3
		        else {
		            break
		        }
		    }
		}
	},

	async E_game_Event428_Act1(runtime, localVars)
	{
		globalThis?.levelLoader?.scriptRuntime?.fireForPickedObjects("levelEditorOverlapConfirmer", "interact")
	},

	async E_game_Event430(runtime, localVars)
	{
		const camPos = Vec2.fromArray(runtime.objects.camera.getCameraPosition());
		const camZ = runtime.objects.camera.getCameraPosition()[2];
		const tickCountMod = runtime.tickCount % 2;
		let i = -1;
		let pos = new Vec2(0, 0);
		let angle = 0;
		let normal = new Vec2(0, 0);
		let instX = 0;
		let instY = 0;
		let instZ = 0;
		let instTopZ = 0;
		let halfWidth = 0;
		let halfHeight = 0;
		let rX = 0;
		let rY = 0;
		const instances = runtime.objects.BFC.getAllInstances();
		const halfLen = Math.floor(instances.length / 2);
		const offset = tickCountMod * halfLen;
		let inst = {};
		
		for (let i = 0; i < halfLen; i++) {
		    inst = instances[i + offset]; 
		    if (!inst.enableBFC || !inst.isOnScreen()) continue;
		
			instZ = inst.totalZElevation;
		
			if (inst.isBox){
				angle = Utils.toRadians(inst.angleDegrees);
				[instX, instY] = inst.getPosition();
				instTopZ = instZ + inst.zHeight;
				[halfWidth, halfHeight] = inst.getSize();
				halfWidth *= 0.5;
				halfHeight *= 0.5;
		
				//X
				normal.set(Math.cos(angle), Math.sin(angle));
				rX = normal.x * halfWidth;
				rY = normal.y * halfWidth;
				pos.set(instX + rX, instY + rY).subtract(camPos);
				inst.setFaceVisible("right", normal.dot(pos) < 0);
				pos.set(instX - rX, instY - rY).subtract(camPos);
				inst.setFaceVisible("left", normal.dot(pos) > 0);
		
				//Y
				normal.set(-normal.y, normal.x);
				rX = normal.x * halfHeight;
				rY = normal.y * halfHeight;
				pos.set(instX + rX, instY + rY).subtract(camPos);
				inst.setFaceVisible("bottom", normal.dot(pos) < 0);
				pos.set(instX - rX, instY - rY).subtract(camPos);
				inst.setFaceVisible("top", normal.dot(pos) > 0);
		
				//Z
				inst.setFaceVisible("front", instTopZ < camZ);
			}
			//this works for any shape
			inst.setFaceVisible("back", instZ > camZ);
		}
	},

	async E_game_Event460_Act1(runtime, localVars)
	{
		globalThis?.levelLoader?.scriptRuntime?.fireForPickedObjects("levelEditorTrigger", "entered")
	},

	async E_game_Event463_Act2(runtime, localVars)
	{
		globalThis?.levelLoader?.scriptRuntime?.fireForPickedObjects("levelEditorTrigger", "exited")
	},

	async E_game_Event464_Act2(runtime, localVars)
	{
		globalThis?.levelLoader?.scriptRuntime?.fireForPickedObjects("levelEditorTrigger", "exited")
	},

	async E_game_Event470_Act3(runtime, localVars)
	{
		runtime.globalVars.lastCheckpointGhostData = getGhostDataJSON();
	},

	async E_inputs_Event1_Act1(runtime, localVars)
	{
		runtime.setReturnValue(getBindingIcon(runtime, localVars.action, localVars.bindIndex) ?? "")
	},

	async E_inputs_Event2_Act1(runtime, localVars)
	{
		runtime.setReturnValue(resolveIconTokens(runtime, localVars.text))
	},

	async E_inputs_Event3_Act1(runtime, localVars)
	{
		runtime.setReturnValue(resolveIconTokens(runtime, localVars.text))
	},

	async E_inputs_Event8_Act1(runtime, localVars)
	{
		runtime.setReturnValue(getGamepadBrand(runtime))
	},

	async E_inputs_Event15_Act1(runtime, localVars)
	{
		runtime.setReturnValue(isScriptInputOverridden(localVars.inputName) ? 1 : 0)
	},

	async E_inputs_Event16_Act4(runtime, localVars)
	{
		lookTouchCamera.resetLookTouchCamera()
	},

	async E_inputs_Event24_Act2(runtime, localVars)
	{
		lookTouchCamera.onLookTouchEnd()
		lookTouchCamera.onPinchEnd()
	},

	async E_inputs_Event25_Act2(runtime, localVars)
	{
		lookTouchCamera.onPinchEnd()
	},

	async E_inputs_Event29_Act1(runtime, localVars)
	{
		Inputs.resetKeybindsToDefault()
	},

	async E_inputs_Event30_Act7(runtime, localVars)
	{
		Inputs.listenToKBM(runtime, localVars.input)
	},

	async E_inputs_Event35_Act1(runtime, localVars)
	{
		Inputs.setKeybind(localVars.listeningToInputType, localVars.listeningToInput, localVars.listeningToInputIndex, parseInt(localVars.code))
	},

	async E_inputs_Event36_Act1(runtime, localVars)
	{
		Inputs.setKeybind(localVars.listeningToInputType, localVars.listeningToInput, localVars.listeningToInputIndex, localVars.code)
	},

	async E_inputs_Event37_Act1(runtime, localVars)
	{
		localVars.JSONString = Inputs.getKeybindJSONString(localVars.listeningToInputType, localVars.listeningToInput)
	},

	async E_inputs_Event39_Act1(runtime, localVars)
	{
		localVars.isValid = !Inputs.isCodeBoundToAction("gamepad", localVars.listeningToInput, localVars.buttonIndex)
	},

	async E_inputs_Event40_Act1(runtime, localVars)
	{
		Inputs.setKeybind(localVars.listeningToInputType, localVars.listeningToInput, localVars.listeningToInputIndex, localVars.buttonIndex)
		localVars.JSONString = Inputs.getKeybindJSONString(localVars.listeningToInputType, localVars.listeningToInput)
	},

	async E_inputs_Event53_Act1(runtime, localVars)
	{
		Inputs.cancelKBMListen(runtime)
	},

	async E_inputs_Event54_Act1(runtime, localVars)
	{
		Inputs.cancelKBMListen(runtime)
		Inputs.clearKeybind(localVars.listeningToInputType, localVars.listeningToInput, localVars.listeningToInputIndex)
	},

	async E_inputs_Event55_Act1(runtime, localVars)
	{
		runtime.setReturnValue(inputFontIconForBinding(runtime, localVars.inputType, localVars.action, localVars.index) ?? "")
	},

	async E_inputs_Event56_Act1(runtime, localVars)
	{
		runtime.setReturnValue(inputFontIconForCode(runtime, localVars.inputType, localVars.code) ?? "")
	},

	async E_inputs_Event57_Act1(runtime, localVars)
	{
		runtime.setReturnValue(Inputs.getSlotConflictStatus(localVars.inputType, localVars.action, localVars.index))
	},

	async E_inputs_Event58_Act2(runtime, localVars)
	{
		runtime.objects.tempJSON.getFirstInstance().setJsonDataCopy(Inputs.getKeybinds())
	},

	async E_inputs_Event72_Act1(runtime, localVars)
	{
		localVars.deviceCategory = globalThis.getDeviceCategory()
	},

	async E_inputs_Event92_Act1(runtime, localVars)
	{
		runtime.setReturnValue(Inputs.isBindDown(runtime, localVars.keybindName))
	},

	async E_inputs_Event160_Act3(runtime, localVars)
	{
		lookTouchCamera.onLookTouchStart(localVars.touchX, localVars.touchY)
	},

	async E_inputs_Event163_Act5(runtime, localVars)
	{
		lookTouchCamera.onPinchStart(localVars.touchX, localVars.touchY, localVars.touchX2, localVars.touchY2)
	},

	async E_inputs_Event170_Act3(runtime, localVars)
	{
		lookTouchCamera.updateTouchPosition(localVars.touchX, localVars.touchY)
	},

	async E_inputs_Event172_Act5(runtime, localVars)
	{
		lookTouchCamera.updatePinch(localVars.touchX, localVars.touchY, localVars.touchX2, localVars.touchY2)
	},

	async E_inputs_Event174_Act1(runtime, localVars)
	{
		let cameraMovement = lookTouchCamera.getCameraMovement(runtime.dt)
		localVars.movementX = cameraMovement.moveX
		localVars.movementY = cameraMovement.moveY
		
		let pinch = lookTouchCamera.consumePinch()
		localVars.pinchDelta = pinch.delta
		localVars.pinchTrigger = pinch.trigger
		localVars.pinchDragX = pinch.dragX
		localVars.pinchDragY = pinch.dragY
	},

	async E_player_Event9_Act12(runtime, localVars)
	{
		loadGhostData(runtime.globalVars.lastCheckpointGhostData)
	},

	async E_player_Event13_Act1(runtime, localVars)
	{
		updateCollisionSpace(runtime)
	},

	async E_player_Event13_Act4(runtime, localVars)
	{
		globalThis?.levelLoader?.scriptRuntime?.fireGlobal("load")
	},

	async E_player_Event15_Act1(runtime, localVars)
	{
		updateCollisionSpace(runtime)
	},

	async E_player_Event185_Act1(runtime, localVars)
	{
		
	},

	async E_player_Event289_Act1(runtime, localVars)
	{
		const strength = localVars.BOUNCE_GROUND_STRENGTH;
		const player = runtime.objects.player.getFirstInstance();
		const normal = Vec3.fromAngle(Utils.toRadians(player.instVars.slideAngle), Utils.toRadians(player.instVars.floorAngle));
		player.behaviors.Movement.vectorX = normal.x * strength;
		player.behaviors.Movement.vectorY = normal.y * strength;
		player.instVars.vectorZ = normal.z * strength;
		
		
	},

	async E_player_Event293_Act1(runtime, localVars)
	{
		const strength = localVars.force;
		const player = runtime.objects.player.getFirstInstance();
		
		const x = localVars.vx;
		const y = localVars.vy;
		const z = localVars.vz;
		
		const len = Math.hypot(x, y, z) || 1;
		
		player.behaviors.Movement.vectorX = (x/len) * strength;
		player.behaviors.Movement.vectorY = (y/len) * strength;
		player.instVars.vectorZ = (z/len) * strength;
		
		
	},

	async E_camera_Event41_Act2(runtime, localVars)
	{
		const tweener = runtime.objects.globalManager.getFirstInstance().behaviors.Tween;
		tweener.startTween("value", 0, localVars.shakeLength, localVars.decayEase, {tags: ["shake"], startValue: localVars.shakeStrength})
	},

	async E_camera_Event43_Act1(runtime, localVars)
	{
		const player = runtime.objects.player.getFirstInstance();
		localVars.playerSpeed = new Vec3(player.behaviors.Movement.vectorX, player.behaviors.Movement.vectorY, player.instVars.vectorZ).magnitude
	},

	async E_camera_Event76(runtime, localVars)
	{
		const player = runtime.objects.player.getFirstInstance();
		const camWorldY = Utils.toRadians(runtime.globalVars.camWorldY);
		const lookRads = Utils.toRadians(player.instVars.lookAngle);
		const from = new Vec3(player.x, player.y, player.totalZElevation + player.instVars.currentHeight);
		const to = new Vec3(from.x + Math.cos(lookRads) * Math.cos(camWorldY) * -localVars.camPlayerTargetDist, from.y + Math.sin(lookRads) * Math.cos(camWorldY) * -localVars.camPlayerTargetDist, from.z + Math.sin(-camWorldY) * -localVars.camPlayerTargetDist)
		
		castRay(runtime, from, to, runtime.objects.solid, 2)
	},

	async E_levelprogress_Event22_Act1(runtime, localVars)
	{
		const chapters = runtime.objects.levelData.getFirstInstance().getJsonDataCopy().chapters;
		const manager = runtime.objects.globalManager.getFirstInstance();
		const layoutName = manager.instVars.curLayoutId;
		//setting a fallback level
		let nextLevel = "BAD REDIRECTION";
		//setting a fallback chapter
		manager.instVars.curChapter = "onboarding";
		
		let breakNext = false;
		loop: for (const [chapter, content] of Object.entries(chapters)) {
		    let index = 0;
		    for (const level of content.levels) {
		        index++
		        if (breakNext) {
		            if (chapter === manager.instVars.curChapter) // only go to next if in the same section
		                nextLevel = level;
		            break loop;
		        }
		        if (layoutName === level) {
		            breakNext = true;
		            manager.instVars.curChapter = chapter;
		            manager.instVars.curChapterProgress = index;
		            manager.instVars.curChapterMaxProgress = content.levels.length;
		        }
		    }
		}
		manager.instVars.nextLevel = nextLevel;
		
		
		
		
		
		
	},

	async E_levelprogress_Event28_Act11(runtime, localVars)
	{
		globalThis?.levelLoader?.scriptRuntime?.fireGlobal("start")
	},

	async E_levelprogress_Event29_Act2(runtime, localVars)
	{
		globalThis?.levelLoader?.scriptRuntime?.fireGlobal("end")
	},

	async E_levelprogress_Event30_Act1(runtime, localVars)
	{
		localVars.levelEditor_nextState = globalThis.levelLoader.onLevelComplete(runtime.objects.endZone.getFirstPickedInstance())
		localVars.levelEditor_returnDestination = globalThis.levelLoader.returnDestination;
	},

	async E_levelprogress_Event44_Act2(runtime, localVars)
	{
		runtime.globalVars.arrivalSetFor = globalThis.levelLoader.pendingTransition.id
	},

	async E_levelprogress_Event49_Act7(runtime, localVars)
	{

	},

	async E_savesystem_Event12_Act1(runtime, localVars)
	{
		localVars.deviceCategory = globalThis.getDeviceCategory()
	},

	async E_savesystem_Event25_Act2(runtime, localVars)
	{
		saveDataToStorage(runtime);
	},

	async E_savesystem_Event27_Act4(runtime, localVars)
	{
		await clearDataFromStorage(runtime);
	},

	async E_savesystem_Event27_Act6(runtime, localVars)
	{
		const save = runtime.objects.save.getFirstInstance();
		    const saveDataUrl = await runtime.assets.getProjectFileUrl("jsons/saveState.json");
		    const saveDataResponse = await fetch(saveDataUrl);
		    save.setJsonDataCopy(await saveDataResponse.json());
	},

	async E_debug_Event4_Act1(runtime, localVars)
	{
		runtime.layout.getLayer("debugUI").isVisible = localVars.isDebugUIEnabled
	},

	async E_debug_Event5_Act1(runtime, localVars)
	{
		localVars.isDebugUIEnabled = !localVars.isDebugUIEnabled;
		runtime.layout.getLayer("debugUI").isVisible = localVars.isDebugUIEnabled
	},

	async E_remoteplayer_Event8_Act2(runtime, localVars)
	{
		resetRemoteInterp();
	},

	async E_remoteplayer_Event24_Act1(runtime, localVars)
	{
		runtime.callFunction("SetEndPoint", await getBestEndpoint(true, runtime.globalVars.forceEndpoint))
	},

	async E_remoteplayer_Event25_Act1(runtime, localVars)
	{
		runtime.callFunction("SetEndPoint", await getBestEndpoint(false, runtime.globalVars.forceEndpoint))
	},

	async E_remoteplayer_Event27_Act1(runtime, localVars)
	{
		runtime.callFunction("SetEndPoint", await getBestEndpoint(true))
	},

	async E_remoteplayer_Event28_Act1(runtime, localVars)
	{
		runtime.callFunction("SetEndPoint", await getBestEndpoint())
	},

	async E_remoteplayer_Event43_Act1(runtime, localVars)
	{
		globalThis._wakerWorker && globalThis._wakerWorker.postMessage("start");
	},

	async E_remoteplayer_Event44_Act1(runtime, localVars)
	{
		globalThis._wakerWorker && globalThis._wakerWorker.postMessage("stop");
	},

	async E_remoteplayer_Event50_Act2(runtime, localVars)
	{
		dropRemotePlayer(localVars.sessionID);
	},

	async E_remoteplayer_Event53_Act1(runtime, localVars)
	{
		runtime.setReturnValue(globalThis.valToEnum(localVars.enum, localVars.value))
	},

	async E_remoteplayer_Event54_Act1(runtime, localVars)
	{
		runtime.setReturnValue(globalThis.enumToVal(localVars.enum, localVars.value))
	},

	async E_remoteplayer_Event67_Act4(runtime, localVars)
	{
const players = JSON.parse(localVars.stateJSON);
const sessionID = localVars.sessionID;
const remotePlayers = runtime.objects.RemotePlayer.getPickedInstances();

for (const [key, value] of Object.entries(players)) {
	if (sessionID == key) continue;

	// Buffered before the instance lookup so a peer joining this patch
	// already has a snapshot by the time its RemotePlayer exists.
	pushRemoteSnapshot(key, value.x, value.y, value.z);

	let foundPlayer = false;
	for (const remoteInst of remotePlayers) {
		if (remoteInst.instVars.sessionId != key) continue;
		remoteInst.instVars.inState = true;
		remoteInst.angleDegrees = runtime.callFunction("AngUnpack", value.angle);
		remoteInst.instVars.vx = value.vx;
		remoteInst.instVars.vy = value.vy;
		remoteInst.instVars.vz = value.vz;
		remoteInst.instVars.animation = globalThis.enumToVal("animation", value.animation);
		remoteInst.instVars.team = value.team ?? 0;
		remoteInst.instVars.isInvincible = value.isInvincible ?? false;
		remoteInst.instVars.isDead = value.isDead ?? false;
		remoteInst.instVars.emote = globalThis.enumToVal("emote", value.emote);
		
		
		if (remoteInst.instVars.skin != value.skin) {
			remoteInst.instVars.skin = globalThis.enumToVal("skin", value.skin);
			remoteInst.signal("updateSkin");	
		}
		
		if (value.isSteam){
			const name = value.name;
			runtime.callFunction("updateRemotePlayerName", name, remoteInst.uid)
		}
		else{
			const name = `${globalThis.enumToVal("firstName", value.firstName)} ${globalThis.enumToVal("secondName", value.secondName)}`;
			if (remoteInst.instVars.playerName != name) {
				runtime.callFunction("updateRemotePlayerName", name, remoteInst.uid)
			}
		}


		foundPlayer = true;
		break;
	}
	if (!foundPlayer) runtime.callFunction("createRemotePlayer", key)
}
	},

	async E_remoteplayer_Event76_Act1(runtime, localVars)
	{

	},

	async E_remoteplayer_Event78_Act1(runtime, localVars)
	{
		const now = performance.now();
		const pos = { x: 0, y: 0, z: 0 };
		
		for (const inst of runtime.objects.RemotePlayer.getPickedInstances()) {
			if (!sampleRemotePosition(inst.instVars.sessionId, now, pos)) continue;
			inst.setPosition(pos.x, pos.y);
			inst.zElevation = pos.z;
		}
	},

	async E_remoteplayer_Event141(runtime, localVars)
	{
		const camPos = Vec3.fromArray(runtime.objects.camera.getCameraPosition());
		const camLook = Vec3.fromArray(runtime.objects.camera.getLookVector());
		
		for (const inst of runtime.objects.remotePlayerHudParent.instances()) {
		    const target = runtime.getInstanceByUid(inst.instVars.belongsToUid);
			const hudPos = Utils.worldPosToHudPos(runtime, camPos, camLook, target.x, target.y, target.totalZElevation + target.zHeight + 20);
		    inst.setPosition(hudPos.x, hudPos.y);
		    inst.instVars.shouldBeVisible = !!hudPos;
		}
	},

	async E_remoteplayer_Event147_Act1(runtime, localVars)
	{
		const camPos = Vec3.fromArray(runtime.objects.camera.getCameraPosition());
		let threshold = 160 * 160;
		for(const inst of runtime.objects.hasSkin.instances()){
			const instPos = Vec3.fromInst(inst);
			instPos.z += 140;
			let dist = camPos.distanceSquared(instPos);
		
			if (inst.instVars && inst.instVars.isPlayer) {
				if (inst.effects[0].isActive) {
					inst.effects[0].isActive = false;
					inst.opacity = 1
				}
				continue;
			}
			
			let tweenParam = 1;
			if (inst?.behaviors?.Tween){
				for (const tween of inst.behaviors.Tween.tweensByTags(["fade"])) {
					tweenParam = tween.value;
					break
				}
			}	
			if (dist < threshold || tweenParam < 1) {
				inst.effects[0].isActive = true;
				dist = Math.sqrt(dist);
				inst.effects[0].setParameter(2, Math.min(Utils.remap(dist, 10, 160, 0.1, 1), tweenParam));
				inst.opacity = 0.99;
			}
			else if (inst.effects[0].isActive) {
				inst.effects[0].isActive = false;
				inst.opacity = 1
			}
		}
	},

	async E_skin_Event106_Act1(runtime, localVars)
	{
		const res = globalThis.dlcManager.hasDLC(localVars.appID);
		if (res instanceof Promise) runtime.setReturnValue(0);
		else runtime.setReturnValue(res? 1 : 0);
	},

	async E_leveleditor_Event3_Act7(runtime, localVars)
	{
		globalThis.initEditor()
	},

	async E_leveleditor_Event3_Act8(runtime, localVars)
	{
		globalThis.levelLoader
	},

	async E_leveleditor_Event4_Act1(runtime, localVars)
	{
		globalThis.releaseEditor()
	},

	async E_leveleditorlevelloader_Event5_Act1(runtime, localVars)
	{
		localVars.levelEditor_returnDestination = globalThis.levelLoader.returnDestination;
	},

	async E_layoutidinit_Event2_Act1(runtime, localVars)
	{
		const levelLoader = globalThis.levelLoader;
		localVars.id = levelLoader.currentLevelId;
		localVars.name = levelLoader.loadedProject.levels[levelLoader.currentLevelId].levelData.levelName;
	},

	async E_levelbrowser_Event1_Act7(runtime, localVars)
	{
		globalThis.initLevelBrowser()
	},

	async E_levelbrowser_Event2_Act1(runtime, localVars)
	{
		globalThis.releaseLevelBrowser()
	},

	async M_ctf_Event8_Act4(runtime, localVars)
	{
		let layer = runtime.layout.getLayer("shots")
		const handler = () => {
			const camera = globalThis._editorScope.cameraType;
			globalThis._editorScope.gizmoManager.renderAll(layer.name, camera);
		};
		layer.addEventListener("beforedraw", handler);
		layer.__gizmoHandler = handler;
	},

	async M_ctf_Event84_Act3(runtime, localVars)
	{
		const players = JSON.parse(localVars.stateJSON);
		const sessionID = localVars.sessionID;
		const remoteInst = runtime.objects.RemotePlayer.getFirstPickedInstance();
		
		for (const [key, value] of Object.entries(players)) {
			if (sessionID !== key) continue;
			remoteInst.instVars.team = value.team ?? 0;
			remoteInst.instVars.isInvincible = value.isInvincible ?? false;
			remoteInst.instVars.isDead = value.isDead ?? false;
		}
	},

	async M_ctf_Event94_Act2(runtime, localVars)
	{
		let shotSource = runtime.objects.playerShotSource.getFirstInstance();
		let camPos = runtime.objects.camera.getCameraPosition();
		let camLook = runtime.objects.camera.getLookVector();
		let distance = 10000
		let enemies = runtime.objects.RemotePlayer.getAllInstances().filter(x=> 
			x.instVars.team !== 2 && x.instVars.team !== localVars.ctf_team
		)
		let enemyHitboxes = enemies.map(x=>x.hitboxes).flat();
		let intersection = getFirstRayIntersection(
		  [...runtime.objects.solid.getAllInstances(), ...enemyHitboxes],
		  camPos,
		  camLook,
		  distance
		)
		if (intersection && enemyHitboxes.includes(intersection.instance)) {
			runtime.callFunction("CTF_kill", intersection.instance.remotePlayerId, intersection.instance.bone)
		} else if (intersection && intersection.point) {
			const value = getRayIntersectionReflectAndNormal(intersection.triangle, camLook)
			runtime.callFunction("CTF_bullethole", intersection.point[0], intersection.point[1], intersection.point[2], value.normal[0], value.normal[1], value.normal[2], Math.random()*360)
		}
		let endPoint = (intersection && intersection.point)? intersection.point : [camPos[0] + camLook[0] * distance, camPos[1] + camLook[1] * distance, camPos[2] + camLook[2] * distance]
		debugger
		runtime.callFunction("CTF_dispatchShot", shotSource.getImagePointX(1)
		, shotSource.getImagePointY(1), shotSource.zElevation, endPoint[0], endPoint[1], endPoint[2])
	},

	async M_ctf_Event106_Act2(runtime, localVars)
	{
		createDebugLine(
		  localVars.fromX,
		  localVars.fromY,
		  localVars.fromZ,
		  localVars.toX,
		  localVars.toY,
		  localVars.toZ,
		  "shots",
		  localVars.team === 0? [0,150/255,1,1] : [245/255,0,0,1],
		)
	},

	async M_ctf_Event123_Act1(runtime, localVars)
	{
let text = runtime.objects.Text_CTF.getFirstPickedInstance();

let homeBlue = localVars.team_1_has_flag? "[icon=homebluenoflag]" : "[icon=homeblueflag]"
let homeRed = localVars.team_0_has_flag? "[icon=homerednoflag]" : "[icon=homeredflag]"
let blue = localVars.team_0_has_flag? "[icon=redflag]" : "[icon=rednoflag]"
let red = localVars.team_1_has_flag? "[icon=blueflag]" : "[icon=bluenoflag]"

let scoreSecondSize = 18;
let maxScore = 3
let scoreFormat = `[size=${scoreSecondSize}]/${maxScore}[/size]`

const newText = `[color=#0096FF]${localVars.team_0_score}[/color]${scoreFormat} ${homeBlue}${blue} - ${red}${homeRed} [color=#F50000]${localVars.team_1_score}[/color]${scoreFormat}`
if (text.text !== newText) text.text = newText;
	},

	async M_ctf_Event124_Act2(runtime, localVars)
	{
let text = runtime.objects.Text_CTF.getFirstPickedInstance();

const tint = (hex, icon) => `[color=${hex}]${icon}[/color]`;
const BLUE = "#0096FF", RED = "#F50000";
let nameSize=18;
let heartSize=36;
let bulletSize=25;

let heartValue = localVars.ctf_team === 0 ? tint(BLUE, gameIconTag("heart")) : tint(RED, gameIconTag("heart"));
let bulletValue = gameIconTag("bullet");
const newText = `[size=${nameSize}]${localVars.name}[/size]
[size=${heartSize}]${heartValue.repeat(localVars.hp)}[/size]
[size=${bulletSize}]${bulletValue.repeat(localVars.ammo)}[/size]`
if (text.text !== newText) text.text = newText;
	},

	async M_ctf_Event134_Act1(runtime, localVars)
	{
		for (const remotePlayer of runtime.objects.RemotePlayer.instances()) {
			if (!remotePlayer.hitboxes) continue;
			for (const hitbox of remotePlayer.hitboxes) {
				const bonePos = remotePlayer.playerModel?.getBoneWorldPosition(hitbox.bone) ?? [0,0,0];
				hitbox.x = bonePos[0];
				hitbox.y = bonePos[1];
				hitbox.zElevation = bonePos[2] - (hitbox.bone === "head"? 0:hitbox.zHeight/2);
				hitbox.totalZElevation = hitbox.zElevation;
				hitbox.angle = remotePlayer.angle;
				//updateDebugGizmoForInstanceTris(hitbox, hitbox.gizmoIds)
			}
		}
	},

	async M_ctf_Event136_Act1(runtime, localVars)
	{
		let bones = [
			// "root",
			"spine1",
			"spine2",
			"spine3",
			"neck",
			"head",
			// "shoulder.L",
			"armA1.L",
			"armB1.L",
			"armB2.L",
			"hand.L",
			// "fingerB.L",
			// "fingerC.L",
			// "fingerA.L",
			"armA2.L",
			// "shoulder.R",
			"armA1.R",
			"armB1.R",
			"armB2.R",
			"hand.R",
			// "fingerB.R",
			// "fingerC.R",
			// "fingerA.R",
			"armA2.R",
			// "necklace",
			"legA1.L",
			"legB1.L",
			"legB2.L",
			"footA.L",
			"footB.L",
			"legA2.L",
			// "leg_hammer",
			"legA1.R",
			"legB1.R",
			"legB2.R",
			"footA.R",
			"footB.R",
			"legA2.R"
		]
		let remotePlayer = runtime.objects.RemotePlayer.getFirstPickedInstance();
		// if (remotePlayer.hitboxes) {
		// 	remotePlayer.hitboxes.forEach(x=> {
		// 		deleteDebugGizmoIds(x.gizmoIds);
		// 	})
		// }
		remotePlayer.hitboxes = [];
		if (!remotePlayer.playerModel) remotePlayer.playerModel = runtime.objects.remotePlayerModel.getFirstPickedInstance();
		for (const bone of bones) {
			let size = bone === "head" ? 30 : 20;
			let inst = {
				isFake3DShape: true,
				shape: "box",
				width: size,
				height: size,
				x: 0,
				y: 0,
				originX: 0.5,
				originY: 0.5,
				angle: 0,
				zElevation: 0,
				totalZElevation: 0,
				zHeight: size,
				bone,
				isBone: true,
				remotePlayerId: remotePlayer.instVars.sessionId,
				team: remotePlayer.instVars.team,
				getBoundingBox:function() {
					return {
						left: inst.x - inst.width/2,
						right: inst.x + inst.width/2,
						top: inst.y - inst.height/2,
						bottom: inst.y + inst.height/2
					}
				}
			};
			// let gizmoIds = createDebugGizmoForInstanceTris(inst, "excludeFromIntermediatePost");
			// inst.gizmoIds = gizmoIds;
			remotePlayer.hitboxes.push(inst)
		}
	},

	async M_ctf_Event199_Act1(runtime, localVars)
	{
		runtime.setReturnValue(Date.now());
	},

	async M_ctf_Event202_Act1(runtime, localVars)
	{
		const camPos = Vec3.fromArray(runtime.objects.camera.getCameraPosition());
		let threshold = 90 * 90;
		let ghostFadeOutThreshold = localVars.ghostFadeOutThreshold - 100;
		let fadeOutThreshold = ghostFadeOutThreshold * ghostFadeOutThreshold; // Adjust this distance as needed
		
		for(const inst of runtime.objects.ghost.instances()){
			const instPos = Vec3.fromInst(inst);
			instPos.z += 140;
			let dist = camPos.distanceSquared(instPos);
		
			if (inst.instVars && inst.instVars.isPlayer) {
				if (inst.effects[0].isActive) {
					inst.effects[0].isActive = false;
					inst.opacity = 1
				}
				continue;
			}
			
			let tweenParam = 1;
			if (inst?.behaviors?.Tween){
				for (const tween of inst.behaviors.Tween.tweensByTags(["fade"])) {
					tweenParam = tween.value;
					break
				}
			}
			
			const distSqrt = Math.sqrt(dist);
			
			// Completely fade out if too close (< 60 units)
			if (distSqrt < 60) {
				inst.opacity = 0;
				if (inst.effects[0].isActive) {
					inst.effects[0].isActive = false;
				}
			}
			// Handle fade out for distant objects
			else if (dist > fadeOutThreshold) {
				const fadeOutStart = Math.sqrt(fadeOutThreshold);
				const fadeOutEnd = fadeOutStart + 100; // Fade over 100 units
				inst.opacity = Math.max(0, 1 - Utils.remap(distSqrt, fadeOutStart, fadeOutEnd, 0, 1));
				
				// Disable effect if too far
				if (inst.effects[0].isActive) {
					inst.effects[0].isActive = false;
				}
			}
			// Handle close proximity effect
			else if (dist < threshold || tweenParam < 1) {
				inst.effects[0].isActive = true;
				inst.effects[0].setParameter(2, Math.min(Utils.remap(distSqrt, 10, 160, 0.1, 1), tweenParam));
				inst.opacity = 0.99;
			}
			// Reset to normal
			else if (inst.effects[0].isActive) {
				inst.effects[0].isActive = false;
				inst.opacity = 1
			}
		}
		
	}
};

globalThis.C3.JavaScriptInEvents = scriptsInEvents;
