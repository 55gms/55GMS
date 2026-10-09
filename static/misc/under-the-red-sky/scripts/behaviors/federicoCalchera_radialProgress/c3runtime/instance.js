
const C3 = globalThis.C3;

C3.Behaviors.federicoCalchera_radialProgress.Instance = class RadialProgressInstance extends globalThis.ISDKBehaviorInstanceBase {
	constructor() {
		super();
		this._isEnabled = true;

		const properties = this._getInitProperties();
		if (properties) {
			this.progress = properties[0];
		}

		if (this._isEnabled)
			this._setTicking(true);
	}

	_release() {
		super._release();
	}

	_setMeshPoint(c, r, x, y) {
		const inst = this.instance
		inst.setMeshPoint(c, r, {
			mode: "absolute",
			x: x,
			y: y,
			zElevation: 0,
			u: x,
			v: y
		})
	}

	_tick() {
		const inst = this.instance
		const meshColumns = 2 + Math.max(0, Math.ceil((this._progress - 1 / 8) / (2 / 8)));
		
		inst.createMesh(meshColumns, 2);

		this._setMeshPoint(0, 0, 0.5, 0);

		if (this._progress > 1 / 8) this._setMeshPoint(1, 0, 1, 0);
		if (this._progress > 3 / 8) this._setMeshPoint(2, 0, 1, 1);
		if (this._progress > 5 / 8) this._setMeshPoint(3, 0, 0, 1);
		if (this._progress > 7 / 8) this._setMeshPoint(4, 0, 0, 0);

		let curAngle = Math.PI * (this._progress * 2 - 0.5);
		let curAngleX = Math.cos(curAngle);
		let curAngleY = Math.sin(curAngle);
		let magnitude = Math.max(Math.abs(curAngleX), Math.abs(curAngleY));

		curAngleX /= magnitude;
		curAngleY /= magnitude;

		this._setMeshPoint(meshColumns - 1, 0, (curAngleX + 1) / 2, (curAngleY + 1) / 2);

		for (let i = 0; i < meshColumns; i++) this._setMeshPoint(i, 1, 0.5, 0.5);
	}

	_saveToJson() {
		return {
			"progress": this._progress,
			"enabled": this._isEnabled
		};
	}

	_loadFromJson(o) {
		this._progress = o["progress"];
		this.isEnabled = o["enabled"];
	}

	set progress(s) {
		this._progress = Math.min(Math.max(s, 0), 1);
	}

	get progress() {
		return this._progress;
	}

	set isEnabled(e) {
		this._isEnabled = !!e;

		this._setTicking(this._isEnabled);
	}

	get isEnabled() {
		return this._isEnabled;
	}

	_getDebuggerProperties() {
		const prefix = "behaviors.federicocalchera_radialprogress";
		return [{
			title: "$" + this.behaviorType.name,
			properties: [
				{ name: prefix + ".properties.progress.name", value: this.progress * 100, onedit: v => this.progress = v / 100},
			]
		}];
	}
};
