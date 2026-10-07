import {CoroutineYield} from "./CoroutineYield.js"
import staticData from "./staticData.js"
import SaveData from "./saveData.js"
import FastBigInt from "./FastBigInt.js"
import initWebSdkWrapper from "./websdkwrapper.js"
import language from "./language.js"

let tickCallbacks = {}
let tickId = 0

function Tick(runtime){
	//console.log('Tick')
	Object.values(tickCallbacks).forEach(fn => {
		fn()
	})
}

const BASE_CASH_POOL = 50;

let saveData = new SaveData(staticData, new FastBigInt(0,0, 0), Object.keys(language));

function calculateArithmeticoGeometricTerm(a, b, u0, n) {
	if (a === 1){
		return u0 + b * n;
	}
	let r = b/(1-a);
	return Math.round(Math.pow(a, n) * (u0-r) + r);
}

const RuntimeMixin = {
	startCoroutine(coroutine) {
		const coroutineId = tickId++
		return new Promise((resolve, reject) => {
			function progress(){
				let ret = coroutine.next()
				if(ret.done){
					resolve()
					delete tickCallbacks[coroutineId]
				} else {
					let promise
					let usePromise = true
					if(ret.value instanceof Promise){
						promise = ret.value
					} else if(ret.value instanceof CoroutineYield) {
						promise = ret.value.process()
					}

					if(promise != undefined){
						delete tickCallbacks[coroutineId]
						promise.then(()=>{
							tickCallbacks[coroutineId] = progress
							progress()
						})
					}
				}
			}
			tickCallbacks[coroutineId] = progress
			progress()
		})
	},
	getNextSpecialAntPopUp() {
		let antsToPopUp = Object.keys(this.saveData.specialAnts).filter(key => this.saveData.specialAnts[key].needPopUp);
		if (antsToPopUp.length === 0) return null;
		const ant = this.saveData.specialAnts[antsToPopUp[0]];
		ant.needPopUp = false;
		return ant;
	},
	getNbAvailableSpecialAnts() {
		let availableAnts = Object.keys(this.saveData.specialAnts).filter(key => this.saveData.specialAnts[key].isAvailable(this) || this.saveData.specialAnts[key].inUse)
		return availableAnts.length;
	},
	getAvailableSpecialAntProfile() {
		let availableAnts = Object.keys(this.saveData.specialAnts).filter(key => this.saveData.specialAnts[key].isAvailable(this))
		if (availableAnts.length === 0) return "";
		let selectedAnt = availableAnts[Math.floor(Math.random() * availableAnts.length)];
		this.saveData.specialAnts[selectedAnt].onUsed();
		return selectedAnt;
	},
	boostRandomSpecialAnt() {
		let unavailableAnts = Object.keys(this.saveData.specialAnts).filter(key => this.saveData.specialAnts[key].isInCooldown())
		if (unavailableAnts.length === 0) return;
		let selectedAnt = unavailableAnts[Math.floor(Math.random() * unavailableAnts.length)];
		this.saveData.specialAnts[selectedAnt].onBoost(this);
	},
	profileCameBackToHole(profile) {
		let ant = this.saveData.specialAnts[profile];
		if (!!ant) {
			ant.onEnterHole(this);
		}
	},
	watchSpecialAntRewarded(profile) {
		let ant = this.saveData.specialAnts[profile];
		if (!!ant) {
			ant.watchRewarded(this);
		}
	},
	getSpecialAntUnlocked(profile) {
		return !!saveData.specialAnts[profile] && !!saveData.specialAnts[profile].unlocked;
	},
	computeProfileMultiplier(profile, fnName, input) {
		if (!staticData.specialAnts.hasOwnProperty(profile)) return input;
		
		let fn = staticData.specialAnts[profile][fnName];
		if (typeof fn === "function") return fn(input);
		
		return input;
	},
	getProfileValue(profile, key, def) {
		if (
			!staticData.specialAnts.hasOwnProperty(profile) 
		 || !staticData.specialAnts[profile].hasOwnProperty(key)
		) {
		  return def;
		}
		
		return staticData.specialAnts[profile][key];
	},
	getLanguage(key, params) {
		let languageKey = language[saveData.language][key];
		if (languageKey && typeof languageKey === "function") return languageKey(...params);
		return languageKey.toString();
	},
	keyExists(key) {
		let languageKey = language[saveData.language][key];
		if (languageKey && typeof languageKey !== "function") return true;
		return false;
	},
	setLanguage(lang) {
		saveData.setLanguage(lang);
	},
	getCurLang() {
		return saveData.language;
	},
	getNbLangs() {
		return saveData.langs.length;
	},
	getLangAt(id) {
		if (id >= 0 && id < saveData.langs.length)
			return saveData.langs[id];
		return "en"
	},
	addBaseCashPool() {
		this.money().add(BASE_CASH_POOL);
	},
	initWebSdkWrapper,
	saveData,
	staticData,
	getEndOfLevelBonus(id) {
		const levels = this.staticData.worlds[this.curWorldId()].levels;
		id = ((id%levels.length) + levels.length)%levels.length;
		const money = levels[id].money();
		return Math.round(money * 0.1);
	},
	money() {return this.saveData.money},
	formatPrice(price) {return new FastBigInt(0, 0, price).toString()},
	curWorldId() {return this.saveData.curWorldId},
	curWorld() {return this.saveData.worlds[this.curWorldId()]},
	curLevelId() {
		return this.curWorld().curLevel;
	},
	curLevel() {
		return this.staticData.worlds[this.curWorldId()].levels[this.curWorld().curLevel];
	},
	lerp(start, end, x){
	  return (1 - x) * start + x * end;
	},
	unlerp(start, end, x){
	  return (x - start) / (end - start);
	},
	welcomeBackIncome() {
		let now = Date.now();
		let lastDate = this.saveData.timestamp;
	},
	getAllPassiveIncome(includeCurWorld = false) {
		let ret = 0;
		this.saveData.worlds.forEach((world, i) => {
			if (!world.unlocked || (i === this.curWorldId() && !includeCurWorld)) return;
			ret += this.passiveIncomePerMinute(i);
		})
		return ret;
	},
	addPassiveIncome() {
		this.money().add(Math.round(this.getAllPassiveIncome()/90));
	},
	passiveIncomePerMinute(worldId) {
		if (worldId === undefined) worldId = this.curWorldId();
		let world = this.saveData.worlds[worldId];
		let nbAnts = world.workerLevel + 1;
		let antSpeed = world.speedLevel;
		let moneyPerFrag = world.staticData.moneyPerFragment;
		
		return Math.round(moneyPerFrag * nbAnts * (this.lerp(2, 20, this.unlerp(0, 100, antSpeed))));
	},
	getWelcomeBackAmount() {
		return Math.round(this.saveData.awayTime() * this.getAllPassiveIncome(true));
	},
	moneyBag(amount) {
		this.money().add(Math.round(amount));
	},
	eatBit(double = false, profile) {
		let money = this.curWorld().eatBit(this.globalVars.G_AB_FragmentBoost);
		money = this.computeProfileMultiplier(profile, "moneyFunction", money);
		this.money().add(double? money * 2: money);
	},
	workerUpgradePrice(worldId, upgradeLevel) {
		let a = 1.115;
		let b = 4;
		let u0 = 5;
		let price = calculateArithmeticoGeometricTerm(a, b, u0, upgradeLevel);
		return Math.pow(10, worldId) * price;
	},
	speedUpgradePrice(worldId, upgradeLevel) {
		let a = 1.165;
		let b = 7;
		let u0 = 10;
		let price = calculateArithmeticoGeometricTerm(a, b, u0, upgradeLevel);
		return Math.pow(10, worldId) * price;
	},
	strengthUpgradePrice(worldId, upgradeLevel) {
		let a = 1.85;
		let b = 450;
		let u0 = 300;
		let price = calculateArithmeticoGeometricTerm(a, b, u0, upgradeLevel);
		return Math.pow(10, worldId) * price;
	},
	eatingDuration(upgradeLevel) {
		let a = 1;
		let b = -0.1;
		let u0 = 4;
		let value = calculateArithmeticoGeometricTerm(a, b, u0, upgradeLevel);
		return Math.max(value, 0.1);
	},
	spawnDuration(upgradeLevel) {
		let a = 1;
		let b = -0.02;
		let u0 = 0.6;
		let value = calculateArithmeticoGeometricTerm(a, b, u0, upgradeLevel);
		return Math.max(value, 0.05);
	},
	speedValue(upgradeLevel) {
		let a = 1;
		let b = 0.27;
		let u0 = 1.8;
		let value = calculateArithmeticoGeometricTerm(a, b, u0, upgradeLevel);
		return value * 1.3;
	},
}

runOnStartup(async runtime =>
			 {
	// Code to run on the loading screen
	runtime.addEventListener("tick", () => Tick(runtime));
	extend(runtime, RuntimeMixin);
	globalThis.runtime = runtime
});

function extend(obj1, obj2){
	Object.keys(obj2).forEach(key => {
		if(obj1.hasOwnProperty(key) || obj1.__proto__.hasOwnProperty(key)){
			console.warn("key " + key + " already exists")
			delete obj2[key]
		}
	})
	Object.assign(obj1, obj2);
}

export default RuntimeMixin;