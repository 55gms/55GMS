


const scriptsInEvents = {

		async MUpgradeButton_Event3_Act1(runtime, localVars)
		{
			let btn = runtime.objects.UIButton.getFirstPickedInstance();
			
			let id = btn.instVars.id;
			let price = btn.instVars.price;
			
			if (runtime.money().compare(price) >= 0) {
				runtime.money().subtract(price);
				switch(id) {
					case "speed":
						runtime.curWorld().upgradeSpeed()
						localVars.lvl = runtime.curWorld().speedLevel;
						break;
					case "workers":
						runtime.curWorld().upgradeWorker()
						localVars.lvl = runtime.curWorld().workerLevel
						break;
					case "strength":
						runtime.curWorld().upgradeStrength()
						localVars.lvl = runtime.curWorld().strengthLevel
						break;
				}
			}
		},

		async MUpgradeButton_Event13_Act1(runtime, localVars)
		{
			let btn = runtime.objects.UIButton.getFirstPickedInstance();
			
			let id = btn.instVars.id;
			switch(id) {
				case "speed":
					localVars.lvl = runtime.curWorld().speedLevel
					localVars.price = runtime.speedUpgradePrice(runtime.curWorldId(), localVars.lvl);
					localVars.isMax = runtime.curWorld().isMaxSpeed()
					break;
				case "workers":
					localVars.lvl = runtime.curWorld().workerLevel
					localVars.price = runtime.workerUpgradePrice(runtime.curWorldId(), localVars.lvl);
					localVars.isMax = runtime.curWorld().isMaxWorker()
					break;
				case "strength":
					localVars.lvl = runtime.curWorld().strengthLevel
					localVars.price = runtime.strengthUpgradePrice(runtime.curWorldId(), localVars.lvl);
					localVars.isMax = runtime.curWorld().isMaxStrength()
					break;
			}
			
			localVars.formatedPrice = runtime.formatPrice(localVars.price);
		},

		async MUpgradeButton_Event37_Act1(runtime, localVars)
		{
			const buttons = runtime.objects.UIButton.getAllInstances();
			
			let smallestPrice = Infinity;
			
			buttons.forEach(button => {
				const price = button.instVars.price;
				const isMax = button.instVars.isMax;
			// 	console.log(isMax)
				if (!isMax && runtime.money().compare(price) >= 0) {
					runtime.callFunction("M_Upgrade_Button_CallFunction", button.uid, "Enable");
					if (price < smallestPrice) {
						smallestPrice = price;
						localVars.smallestEnabledUID = button.uid;
					}
				} else {
					runtime.callFunction("M_Upgrade_Button_CallFunction", button.uid, "Disable");
				}
			})
		},

		async MVfx_Event25_Act1(runtime, localVars)
		{
			let parents = runtime.objects.ShopAnimation.getPickedInstances()
			
			let setOpacityRecurively = (parent, opacity) => {
				let len = parent.getChildCount()
				for(let i = 0; i < len; i++) {
					let child = parent.getChildAt(i);
					child.opacity = opacity;
					setOpacityRecurively(child, opacity);
				}
			}
			
			parents.forEach(parent => {
				setOpacityRecurively(parent, parent.opacity);
			})
		},

		async MVfx_Event28_Act1(runtime, localVars)
		{
			let parents = runtime.objects.ShopConditional.getPickedInstances()
			
			let setVisibleRecurively = (parent, visible) => {
				let len = parent.getChildCount()
				for(let i = 0; i < len; i++) {
					let child = parent.getChildAt(i);
					child.isVisible = visible;
					setVisibleRecurively(child, visible);
				}
			}
			
			parents.forEach(parent => {
				setVisibleRecurively(parent, false);
			})
		},

		async MVfx_Event29_Act1(runtime, localVars)
		{
			let parents = runtime.objects.ShopConditional.getPickedInstances()
			
			let setVisibleRecurively = (parent, visible) => {
				let len = parent.getChildCount()
				for(let i = 0; i < len; i++) {
					let child = parent.getChildAt(i);
					child.isVisible = visible;
					setVisibleRecurively(child, visible);
				}
			}
			
			parents.forEach(parent => {
				setVisibleRecurively(parent, true);
			})
		},

		async MWorldMenu_Event27_Act1(runtime, localVars)
		{
			runtime.setReturnValue(localVars.M_World_Menu_IsOpen?1:0)
		},

		async MWorldMenu_Event29_Act2(runtime, localVars)
		{
			localVars.maxUnlocked = runtime.saveData.worlds.findIndex(x=>!x.unlocked);
			if (localVars.maxUnlocked === -1) localVars.maxUnlocked = runtime.saveData.worlds.length;
		},

		async MWorldMenu_Event48_Act2(runtime, localVars)
		{
			localVars.val = runtime.formatPrice(Math.round(runtime.passiveIncomePerMinute(localVars.id)/60))
		},

		async MWorldMenu_Event56_Act1(runtime, localVars)
		{
			const worldIcon = runtime.objects.WorldIcon.getFirstPickedInstance();
			const id = worldIcon.animationFrame;
			const unlocked  = runtime.saveData.worlds[id].unlocked;
			if (unlocked) {
				runtime.callFunction("M_World_SetWorld", id, true)
			}
		},

		async MPopup_Event10_Act1(runtime, localVars)
		{
			// console.log(localVars.M_PopUp_CollectDoubleAmount * 2, runtime.money().fullNumber())
			runtime.money().add(localVars.M_PopUp_CollectDoubleAmount * 2)
			// console.log(runtime.money().fullNumber())
		},

		async MPopup_Event13_Act1(runtime, localVars)
		{
			// console.log(localVars.M_PopUp_WelcomeBackAmount, runtime.money().fullNumber())
			runtime.money().add(localVars.M_PopUp_WelcomeBackAmount)
			// console.log(runtime.money().fullNumber())
		},

		async MPopup_Event39_Act4(runtime, localVars)
		{
			localVars.M_PopUp_CollectDoubleAmount = runtime.getEndOfLevelBonus(runtime.curLevelId() - 1);
		},

		async MPopup_Event40_Act1(runtime, localVars)
		{
			const textObj = runtime.objects.UIText.getFirstPickedInstance()
			textObj.text = runtime.formatPrice(localVars.M_PopUp_CollectDoubleAmount)
		},

		async MPopup_Event41_Act1(runtime, localVars)
		{
			const textObj = runtime.objects.UIText.getFirstPickedInstance()
			textObj.text = runtime.formatPrice(localVars.M_PopUp_CollectDoubleAmount * 3)
		},

		async MPopup_Event42_Act1(runtime, localVars)
		{
			localVars.M_PopUp_WelcomeBackAmount = runtime.getWelcomeBackAmount();
		},

		async MPopup_Event45_Act1(runtime, localVars)
		{
			const textObj = runtime.objects.UIText.getFirstPickedInstance()
			textObj.text = runtime.formatPrice(localVars.M_PopUp_WelcomeBackAmount)
		},

		async MPopup_Event46_Act1(runtime, localVars)
		{
			const textObj = runtime.objects.UIText.getFirstPickedInstance()
			textObj.text = runtime.formatPrice(localVars.M_PopUp_WelcomeBackAmount * 2)
		},

		async MPopup_Event66_Act1(runtime, localVars)
		{
			let text = runtime.objects.Text.getFirstPickedInstance();
			
			text.text = runtime.saveData.specialAnts.flash.watchedRewardeds + "[b]/[/b]" + runtime.saveData.specialAnts.flash.staticData.rewardedCount
		},

		async MPopup_Event67_Act1(runtime, localVars)
		{
			let text = runtime.objects.Text.getFirstPickedInstance();
			
			text.text = runtime.saveData.specialAnts.robo.watchedRewardeds + "[b]/[/b]" + runtime.saveData.specialAnts.robo.staticData.rewardedCount
		},

		async MPopup_Event68_Act1(runtime, localVars)
		{
			let text = runtime.objects.Text.getFirstPickedInstance();
			
			text.text = runtime.saveData.specialAnts.gold.watchedRewardeds + "[b]/[/b]" + runtime.saveData.specialAnts.gold.staticData.rewardedCount
		},

		async MPopup_Event84_Act1(runtime, localVars)
		{
			runtime.money().add(localVars.M_PopUp_WelcomeBackAmount)
		},

		async MPopup_Event85_Act1(runtime, localVars)
		{
			runtime.money().add(localVars.M_PopUp_CollectDoubleAmount)
		},

		async MPopup_Event96_Act1(runtime, localVars)
		{
			const ant = runtime.getNextSpecialAntPopUp()
			
			if (ant) {
				localVars.specialPopupName = ant.staticData.name;
				localVars.specialPopupDesc = ant.staticData.description;
				localVars.specialPopupFrame = ant.staticData.icon;
			}
		},

		async MAudio_Event16_Act1(runtime, localVars)
		{
			let rand = Math.random() * localVars.rand * 2 + (1- localVars.rand)
			let boost = runtime.globalVars.G_Audio_Boost;
			
			runtime.setReturnValue((20/Math.log(10)) * Math.log((Math.pow(10, localVars.base/20) + boost) * rand));
		},

		async MLanguage_Event2_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.getLanguage(localVars.key, Object.values(JSON.parse(localVars.params))))
		},

		async MLanguage_Event3_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.keyExists(localVars.key)? 1 : 0)
		},

		async MLanguage_Event4_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.getNbLangs())
		},

		async MLanguage_Event5_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.getLangAt(localVars.id))
		},

		async MLanguage_Event6_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.getCurLang())
		},

		async MLanguage_Event7_Act1(runtime, localVars)
		{
			runtime.setLanguage(localVars.lang)
		},

		async MFood_Event10_Act1(runtime, localVars)
		{
			const inst = runtime.objects.FoodFront3.getFirstPickedInstance();
			const foodParent = runtime.objects.FoodSpawner.getFirstPickedInstance();
			const {width, height} = inst;
			const bbox = inst.getBoundingBox();
			const nbFragments = localVars.nbFragments;
			
			const cols = Math.floor(width / Math.sqrt(width * height / (nbFragments / 2)));
			const fragWidth = width/cols;
			const rows = Math.floor(height/fragWidth);
			const fragHeight =  height/rows;
			localVars.cols = cols;
			localVars.rows = rows;
			localVars.fragWidth = fragWidth;
			localVars.fragHeight = fragHeight;
			
			for (let x = 0; x < cols; x++) {
				for (let y = 0; y < rows; y++) {
					let inst = runtime.objects.Mask.createInstance("ObjectFront", 
						bbox.left + x * fragWidth + fragWidth/2,
						bbox.top + y * fragHeight + fragHeight/2);
					inst.setAnimation("Front");
					inst.width = fragWidth;
					inst.height = fragHeight;
					inst.instVars.col = x;
					inst.instVars.row = y;
					inst.opacity = 0;
					
					let inst2 = runtime.objects.Mask.createInstance("ObjectBack", 
						bbox.left + x * fragWidth + fragWidth/2,
						bbox.top + y * fragHeight + fragHeight/2);
					//inst2.setAnimation("Back");
					inst2.width = fragWidth;
					inst2.height = fragHeight;
					inst2.instVars.col = x;
					inst2.instVars.row = y;
					inst2.opacity = 0;
					
					foodParent.addChild(inst, {
						transformX: true,
						transformY: true,
						transformWidth: true,
						transformHeight: true,
						transformAngle: true,
						transformZElevation:true
					})
					
					foodParent.addChild(inst2, {
						transformX: true,
						transformY: true,
						transformWidth: true,
						transformHeight: true,
						transformAngle: true,
						transformZElevation:true
					})
					
				}
			}
		},

		async MFood_Event19(runtime, localVars)
		{
			if (localVars.progress > 0) {
				const progress = Math.min(1, Math.max(0, localVars.progress/100));
				let instances = runtime.objects.Mask.getAllInstances()
				const distance = (a) => Math.sqrt(Math.pow(a.x - localVars.holeXstatic, 2) + Math.pow(a.y - localVars.holeYstatic, 2));
				instances.sort((a, b) => distance(a) - distance(b))
				for(let i = 0; i < instances.length * progress; i++) {
					const inst = instances[i];
					inst.instVars.targeted = true;
					inst.width = 0;
					inst.height = 0;
					inst.destroy()
				}
			}
		},

		async MAnts_Event3_Act1(runtime, localVars)
		{
			runtime.boostRandomSpecialAnt()
		},

		async MAnts_Event18_Act1(runtime, localVars)
		{
			let ret = runtime.computeProfileMultiplier(localVars.profile, localVars.fn, localVars.input)
			runtime.setReturnValue(ret)
		},

		async MAnts_Event19_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.getProfileValue(localVars.profile, localVars.key, localVars.default))
		},

		async MAnts_Event20_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.getProfileValue(localVars.profile, localVars.key, localVars.default))
		},

		async MAnts_Event21_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.getSpecialAntUnlocked(localVars.profile) ? 1 : 0)
		},

		async MAnts_Event34_Act1(runtime, localVars)
		{
			localVars.profile = runtime.getAvailableSpecialAntProfile()
		},

		async MAnts_Event40_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.curWorld().workerLevel + 1)
		},

		async MAnts_Event41_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.getNbAvailableSpecialAnts())
		},

		async MAnts_Event42_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.curWorld().strengthLevel + 1)
		},

		async MAnts_Event43_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.speedValue(runtime.curWorld().speedLevel)) 
		},

		async MAnts_Event45_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.eatingDuration(runtime.curWorld().strengthLevel)) 
		},

		async MAnts_Event56_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.spawnDuration(runtime.curWorld().speedLevel)) 
		},

		async MAnts_Event92_Act1(runtime, localVars)
		{
			runtime.eatBit(true, localVars.profile)
		},

		async MAnts_Event93_Act1(runtime, localVars)
		{
			runtime.eatBit(false, localVars.profile)
		},

		async MAnts_Event169_Act2(runtime, localVars)
		{
			runtime.profileCameBackToHole(localVars.profile)
		},

		async MProgress_Event22_Act1(runtime, localVars)
		{
			localVars.worldId = runtime.curWorldId() + 1
		},

		async MTuto_Event12_Act6(runtime, localVars)
		{
			runtime.addBaseCashPool()
		},

		async MTuto_Event16_Act1(runtime, localVars)
		{
			runtime.setReturnValue(localVars.M_Tuto_Layer_Visible?1:0)
		},

		async MSave_Event2_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.money().toString())
		},

		async MSave_Event4_Act1(runtime, localVars)
		{
			localVars.data = runtime.saveData.save();
		},

		async MSave_Event7_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.saveData.hasSeenTuto?1:0)
		},

		async MSave_Event8_Act1(runtime, localVars)
		{
			runtime.setReturnValue(runtime.saveData.audio?1:0)
		},

		async MSave_Event9_Act1(runtime, localVars)
		{
			runtime.saveData.audio = localVars.value
		},

		async MSave_Event10_Act1(runtime, localVars)
		{
			runtime.saveData.hasSeenTuto = localVars.value
		},

		async MSave_Event12_Act2(runtime, localVars)
		{
			runtime.saveData.load(localVars.data);
		},

		async MWorld_Event5_Act1(runtime, localVars)
		{
			runtime.saveData.setWorld(localVars.worldId)
		},

		async MWorld_Event7_Act1(runtime, localVars)
		{
			runtime.saveData.unlockWorld(localVars.worldId)
		},

		async MWorld_Event8_Act1(runtime, localVars)
		{
			runtime.addPassiveIncome()
		},

		async MWorld_Event10_Act1(runtime, localVars)
		{
			localVars.id = runtime.saveData.curWorldId
		},

		async MWorld_Event12_Act1(runtime, localVars)
		{
			localVars.id = runtime.saveData.getLastUnlockedWorld()
		},

		async MWorld_Event14_Act1(runtime, localVars)
		{
			let data = runtime.curWorld().staticData;
			localVars.holeColor = data.holeColor;
			localVars.layerColor = data.layerColor;
			localVars.shadowColor = data.color;
			localVars.layoutBG = data.bgLayer;
		},

		async MMonetisation_Event2_Act1(runtime, localVars)
		{
			const signal = localVars.signal
			globalThis.WebSdkWrapper.rewarded().then(res => {
				localVars.M_Monetisation_AdSuccess = !!res;
				runtime.callFunction("M_Monetisation_AdEnd", signal);
			})
		},

		async MMonetisation_Event3_Act1(runtime, localVars)
		{
			const signal = localVars.signal
			globalThis.WebSdkWrapper.interstitial().then(res => {
				localVars.M_Monetisation_AdSuccess = !!res;
				runtime.callFunction("M_Monetisation_AdEnd", signal);
			})
		},

		async MMonetisation_Event5_Act1(runtime, localVars)
		{
			runtime.setReturnValue(localVars.M_Monetisation_AdSuccess?1:0)
		},

		async MMonetisation_Event6_Act1(runtime, localVars)
		{
			runtime.setReturnValue(globalThis.WebSdkWrapper.hasAdblock()?1:0)
		},

		async MMonetisation_Event28_Act2(runtime, localVars)
		{
			let ant = runtime.saveData.specialAnts[localVars.profile];
			localVars.isAlreadyUnlocked = !ant || ant.unlocked;
		},

		async MMonetisation_Event30_Act1(runtime, localVars)
		{
			runtime.watchSpecialAntRewarded(localVars.profile)
		},

		async MMonetisation_Event39_Act1(runtime, localVars)
		{
			runtime.initWebSdkWrapper(runtime, "Poki", true)
		},

		async MMonetisation_Event40_Act1(runtime, localVars)
		{
			runtime.initWebSdkWrapper(runtime, "Poki", false)
		},

		async MMonetisation_Event41_Act1(runtime, localVars)
		{
			globalThis.WebSdkWrapper.happyTime()
		},

		async MMonetisation_Event42_Act1(runtime, localVars)
		{
			globalThis.WebSdkWrapper.gameplayStart()
		},

		async MMonetisation_Event43_Act1(runtime, localVars)
		{
			globalThis.WebSdkWrapper.gameplayStop()
		},

		async MMonetisation_Event44_Act1(runtime, localVars)
		{
			globalThis.WebSdkWrapper.loadingStart()
		},

		async MMonetisation_Event45_Act1(runtime, localVars)
		{
			globalThis.WebSdkWrapper.loadingEnd()
		},

		async MMonetisation_Event46_Act1(runtime, localVars)
		{
			globalThis.WebSdkWrapper.loadingProgress(localVars.progress)
		},

		async MMonetisation_Event50_Act1(runtime, localVars)
		{
			let moneyBag = runtime.objects.MoneyBag.getFirstInstance()
			moneyBag.instVars.amount = runtime.getAllPassiveIncome(true) * 3;
			
			localVars.amountStr = runtime.formatPrice(moneyBag.instVars.amount)
		},

		async MMonetisation_Event52_Act4(runtime, localVars)
		{
			runtime.saveData.freeMoneyBagHasHappened = true;
		},

		async MMonetisation_Event80_Act14(runtime, localVars)
		{
			let moneyBag = runtime.objects.MoneyBag.getFirstInstance()
			runtime.moneyBag(moneyBag.instVars.amount)
		},

		async MMonetisation_Event84_Act1(runtime, localVars)
		{
			localVars.M_Monetisation_FreeMoneyBagHasHappened = runtime.saveData.freeMoneyBagHasHappened;
		},

		async CLevel_Event5_Act1(runtime, localVars)
		{
			let lvl = runtime.curLevel().data;
			let progress = runtime.curWorld().lastProgress;
			// console.log(progress, lvl)
			let hole = runtime.objects.hole.getFirstInstance();
			runtime.callFunction("M_Food_Create", lvl.item, lvl.hasFg, lvl.hasBg, lvl.fragments/runtime.globalVars.G_AB_FragmentBoost, progress, hole.x, hole.y, lvl.offsetX, lvl.offsetY, !localVars.immediate, lvl.slideOffsetX, lvl.slideOffsetY, lvl.slideDuration);
		},

		async CLevel_Event7_Act1(runtime, localVars)
		{
			localVars.nbLevels = runtime.staticData.worlds[runtime.curWorldId()].nbLevelsToComplete
			localVars.curLevelId = (runtime.curLevel().id-1);
			if (runtime.curWorld().finished) localVars.curLevelId = localVars.nbLevels
			localVars.progress = 100 * (localVars.curLevelId) / localVars.nbLevels
		},

		async CLevel_Event11_Act1(runtime, localVars)
		{
			localVars.openWorldMenu = runtime.saveData.nextLevel()
		}

};

self.C3.ScriptsInEvents = scriptsInEvents;

