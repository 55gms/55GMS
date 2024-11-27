const DegToRad = Math.PI / 180.0;

function Lerp(a,b,t)
{
	return a + t*(b-a);
}

function Repeat(t, length)
{
	return t - Math.floor(t / length) * length;
}

function RandomItem(array)
{
	let idx = Math.floor(MB.Random01() * array.length);
	return array[idx];
}

function Shuffle(array) 
{
	let currentIndex = array.length;
  
	// While there remain elements to shuffle...
	while (currentIndex !== 0) 
	{  
	  // Pick a remaining element...
	  const randomIndex = Math.floor(MB.Random01() * currentIndex);
	  currentIndex--;
  
	  // And swap it with the current element.
	  [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}

function Hash(str) 
{
	let hash = 0;
	for (let i = 0; i < str.length; i++) 
	{
		const chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}

	return hash;
};
  

class Vec2
{
	constructor(x,y)
	{
		this.x = x || 0;
		this.y = y || 0;
	}
	static Zero() { return new Vec2(0,0); }
	static One() { return new Vec2(1,1); }
	static Clone(v) { return new Vec2(v.x, v.y); }

	static Add(a, b) { return new Vec2(a.x + b.x, a.y + b.y); }

}

class Vec3
{
	constructor(x,y,z)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
	static Zero() { return new Vec3(0,0,0); }
	static One() { return new Vec3(1,1,1); }
	static Right() { return new Vec3(1,0,0); }
	static Up() { return new Vec3(0,1,0); }
	static Forward() { return new Vec3(0,0,1); }

	static Clone(v) { return new Vec3(v.x, v.y, v.z); }
	static Add(a, b) { return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z); }
	static Sub(a, b)  { return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z); }
	static Mul(vec, scalar) { return new Vec3(vec.x * scalar, vec.y * scalar, vec.z * scalar); }
	static Negate(vec) { return Vec3.Mul(vec, -1.0); }

	static Scale(a,b, out)
	{
		out.x = a.x * b.x;
		out.y = a.y * b.y;
		out.z = a.z * b.z;
	}

	Set(v)
	{
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
	}

	Lerp(b, t)
	{
		this.x = this.x * (1.0-t) + b.x * t;
		this.y = this.y * (1.0-t) + b.y * t;
		this.z = this.z * (1.0-t) + b.z * t;
	}
}

class Vec4
{
	constructor(x,y,z,w)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = w || 0;
	}
	static Zero() { return new Vec4(0,0,0,0); }
	static One() { return new Vec4(1,1,1,1); }

	static Clone(v) { return new Vec4(v.x, v.y, v.z, v.w); }

	static Scale(a,b, out)
	{
		out.x = a.x * b.x;
		out.y = a.y * b.y;
		out.z = a.z * b.z;
		out.w = a.w * b.w;
		return out;
	}

	Set(v)
	{
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = v.w;
	}
}

class Quat
{
	constructor(x,y,z,w)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = w || 1;
	}
	static Identity() { return new Quat(); }
	static Clone(q) { return new Quat(q.x, q.y, q.z, q.w); }
	static FromAxisAngle(axis, angle)
	{
		angle = angle * DegToRad;
		var sinA = Math.sin(angle / 2.0);
		var cosA = Math.cos(angle / 2.0);
		var xyz = Vec3.Mul(axis, sinA);

		return new Quat(xyz.x, xyz.y, xyz.z, cosA);
	}
	
	static Mul(a, b, out) {
		let x = (a.x * b.w) + (a.y * b.z) - (a.z * b.y) + (a.w * b.x);
		let y = (-a.x * b.z) + (a.y * b.w) + (a.z * b.x) + (a.w * b.y);
		let z = (a.x * b.y) - (a.y * b.x) + (a.z * b.w) + (a.w * b.z);
		let w = (-a.x * b.x) - (a.y * b.y) - (a.z * b.z) + (a.w * b.w);

		out.x = x;
		out.y = y;
		out.z = z;
		out.w = w;
	}

	Set(q)
	{
		this.x = q.x;
		this.y = q.y;
		this.z = q.z;
		this.w = q.w;
	}
}

class Mat4x4
{
	constructor()
	{
		this.col0 = new Vec4(1,0,0,0);
		this.col1 = new Vec4(0,1,0,0);
		this.col2 = new Vec4(0,0,1,0);
		this.col3 = new Vec4(0,0,0,1);
	}

	static Identity() { return new Mat4x4(); }
	static FromScale(scale)
	{
		let M = new Mat4x4();
		M.col0.x = scale.x;
		M.col1.y = scale.y;
		M.col2.z = scale.z;
		return M;
	}

	static FromTranslation(pos)
	{
		let M = new Mat4x4();
		M.col3.x = pos.x;
		M.col3.y = pos.y;
		M.col3.z = pos.z;
		return M;
	}

	static FromQuat(q)
	{
		let a = q.w;
		let b = q.x;
		let c = q.y;
		let d = q.z;
		let a2 = a * a;
		let b2 = b * b;
		let c2 = c * c;
		let d2 = d * d;
		
		let M = new Mat4x4();
		M.col0.x = a2 + b2 - c2 - d2;
		M.col0.y = 2.0 * (b * c + a * d);
		M.col0.z = 2.0 * (b * d - a * c);
		
		M.col1.x = 2.0 * (b * c - a * d);
		M.col1.y = a2 - b2 + c2 - d2;
		M.col1.z = 2.0 * (c * d + a * b);
		
		M.col2.x = 2.0 * (b * d + a * c);
		M.col2.y = 2.0 * (c * d - a * b);
		M.col2.z = a2 - b2 - c2 + d2;
		
		return M;
	}

	static FromTransform(pos, scale, rot)
	{
		let S = Mat4x4.FromScale(scale);
		let T = Mat4x4.FromTranslation(pos);
		let R = Mat4x4.FromQuat(rot);

		let M = new Mat4x4();
		Mat4x4.Multiply(R, S, M);
		Mat4x4.Multiply(T, M, M);
		return M;
	}

	static TransformPoint(mat, p, out)
	{
		out.x = p.x * mat.col0.x  + p.y * mat.col1.x + p.z * mat.col2.x + mat.col3.x;
		out.y = p.x * mat.col0.y  + p.y * mat.col1.y + p.z * mat.col2.y + mat.col3.y;
		out.z = p.x * mat.col0.z  + p.y * mat.col1.z + p.z * mat.col2.z + mat.col3.z;
	}

	static TransformVector(mat, p, out)
	{
		out.x = p.x * mat.col0.x + p.y * mat.col1.x + p.z * mat.col2.x;
		out.y = p.x * mat.col0.y + p.y * mat.col1.y + p.z * mat.col2.y;
		out.z = p.x * mat.col0.z + p.y * mat.col1.z + p.z * mat.col2.z;
	}


	static Multiply(mat1, mat2, out)
	{
		// assumes col0.w == col1.w == col2.w == 0 and col3.w == 1 for both matrices
		let m00 = mat1.col0.x * mat2.col0.x + mat1.col1.x * mat2.col0.y + mat1.col2.x * mat2.col0.z;
		let m01 = mat1.col0.y * mat2.col0.x + mat1.col1.y * mat2.col0.y + mat1.col2.y * mat2.col0.z;
		let m02 = mat1.col0.z * mat2.col0.x + mat1.col1.z * mat2.col0.y + mat1.col2.z * mat2.col0.z;

		let m10 = mat1.col0.x * mat2.col1.x + mat1.col1.x * mat2.col1.y + mat1.col2.x * mat2.col1.z;
		let m11 = mat1.col0.y * mat2.col1.x + mat1.col1.y * mat2.col1.y + mat1.col2.y * mat2.col1.z;
		let m12 = mat1.col0.z * mat2.col1.x + mat1.col1.z * mat2.col1.y + mat1.col2.z * mat2.col1.z;
		
		let m20 = mat1.col0.x * mat2.col2.x + mat1.col1.x * mat2.col2.y + mat1.col2.x * mat2.col2.z;
		let m21 = mat1.col0.y * mat2.col2.x + mat1.col1.y * mat2.col2.y + mat1.col2.y * mat2.col2.z;
		let m22 = mat1.col0.z * mat2.col2.x + mat1.col1.z * mat2.col2.y + mat1.col2.z * mat2.col2.z;

		let m30 = mat1.col0.x * mat2.col3.x + mat1.col1.x * mat2.col3.y + mat1.col2.x * mat2.col3.z + mat1.col3.x;
		let m31 = mat1.col0.y * mat2.col3.x + mat1.col1.y * mat2.col3.y + mat1.col2.y * mat2.col3.z + mat1.col3.y;
		let m32 = mat1.col0.z * mat2.col3.x + mat1.col1.z * mat2.col3.y + mat1.col2.z * mat2.col3.z + mat1.col3.z;

		out.col0.x = m00; out.col0.y = m01; out.col0.z = m02;
		out.col1.x = m10; out.col1.y = m11; out.col1.z = m12;
		out.col2.x = m20; out.col2.y = m21; out.col2.z = m22;
		out.col3.x = m30; out.col3.y = m31; out.col3.z = m32;
	}
}

class AnimCurve
{
	constructor(nodes /*: Vec2[]*/)
	{
		this.nodes = nodes;
	}

	Evaluate(t)
	{
		if(t < this.nodes[0].x)
			return this.nodes[0].y;

		for(let i=1; i<this.nodes.length; ++i)
		{
			const node = this.nodes[i];
			if(t < node.x)
			{
				const prev = this.nodes[i-1];
				const x = (node.x - t) / (node.x - prev.x);
				return node.y + x * (prev.y - node.y);
			}
		}

		return this.nodes[this.nodes.length-1].y;	
	}
}const Easing = 
{
	Linear: 0,
	EaseIn: 1,
	EaseOut: 2,
	EaseInOut: 3,
	EaseInBack: 4,
	EaseOutBack: 5,
	Kick: 6
}

class CTweener
{
	constructor() {
		this.tweens = [];
	}

	AddTween(startVal, endVal, duration, setFunc) 
	{
		var tween = {
			start : startVal,
			end : endVal,
			duration : duration,
			t : 0.0,
			delay : 0.0,
			ease : Easing.Linear,
			setValue : setFunc,
			useScaledTime : false,
			Delay : function(delay) {
				this.delay = delay;
				return this;
			},
			OnCompleted : function(func) {
				this.onCompleted = func;
				return this;
			},
			Ease : function(ease) {
				this.ease = ease;
				return this;
			},
			UseScaledTime() {
				this.useScaledTime = true;
				return this;
			}
		};
		this.tweens.push(tween);
		return tween;
	}

	AddGameTween(startVal, endVal, duration, setFunc) 
	{
		return this.AddTween(startVal, endVal, duration, setFunc).UseScaledTime();
	}

	RemoveTween(tween)
	{
		let tweens = this.tweens;
		for(let i=0; i<tweens.length; ++i)
		{
			if(tweens[i] == tween)
			{
				tweens[i] = tweens[tweens.length-1];
				tweens.pop();
				return;
			}
		}
	}

	ForceComplete(tween)
	{
		if(tween && !tween.completed)
		{
			tween.t = 1.0;
			tween.delay = 0.0;
			tween.completed = true;

			var t = this.CalcEase(tween.t, tween.ease);
			var val = (1.0-t) * tween.start + t * tween.end;
			if(tween.setValue)
				tween.setValue(val);

			if(tween.onCompleted)
				tween.onCompleted();

			this.RemoveTween(tween);
		}
	}

	DelayCall(func, delay) 
	{
		var tween = this.AddTween(0,0,1,null);
		tween.t = 1.0; // mark as completed immediately
		tween.delay = delay;
		tween.onCompleted = func;
	}

	Update(dT, scaledDT)
	{
		var completedSomeTweens = false;
		for(var i=0; i<this.tweens.length; ++i) {
			let tween = this.tweens[i];
			let time = tween.useScaledTime ? scaledDT : dT;

			if(tween.delay > 0.0) {
				tween.delay -= time;
				continue;
			}

			tween.t += time / tween.duration;
			if(tween.t >= 1.0) {
				tween.t = 1.0;
				tween.completed = true;
				completedSomeTweens = true;
			}
			var t = this.CalcEase(tween.t, tween.ease);
			var val = (1.0-t) * tween.start + t * tween.end;
			if(tween.setValue)
				tween.setValue(val);

			if(tween.completed && tween.onCompleted)
				tween.onCompleted();
		}

		if(completedSomeTweens) {
			this.tweens = this.tweens.filter(function(val, idx, array) {
				return !val.completed;
			});
		}
	}

	CalcEase(t, ease) 
	{
		const velocity = 1.7; // gives a default overshoot for ease in/out back.
		switch(ease)
		{
			case Easing.Linear:
				return t;
			case Easing.EaseIn:
				return t*t*t;
			case Easing.EaseOut:
				t = 1.0 - t;
				return 1.0 - t*t*t;
			case Easing.EaseInOut:
				return 3.0*t*t - 2.0*t*t*t;
			case Easing.EaseInBack:
				return t*t*((velocity+1.0)*t - velocity);
			case Easing.EaseOutBack:
				t = t - 1.0;
				return t*t*((velocity+1.0)*t + velocity) + 1.0;
			case Easing.Kick:
				if(t < 0.3)
				{
					t = 1.0 - t / 0.3;
					return 1.0 - t*t*t;
				}
				else
				{
					t = (t-0.3) / 0.7;
					return 1.0 - (3.0*t*t - 2.0*t*t*t);
				}
		}
	}
};

let Tweener = new CTweener();class GameObject
{
	constructor(name)
	{
		this.name = name;
		this.isActive = true;
		this.isVisible = true;

		// local space
		this.pos = Vec3.Zero();
		this.scale = Vec3.One();
		this.rot = Quat.Identity();
		// world space (don't set directly, these get set in UpdateTransform)
		this.wpos = Vec3.Zero();
		this.wscale = Vec3.One();
		this.wrot = Quat.Identity();

		this.localToWorld = Mat4x4.Identity();
		this.transformDirty = false;

		this.components = [];
		this.parent = null;
		this.children = [];
		this.initialised = false;
	}

	SetPosition(pos)
	{
		this.pos.Set(pos);
		this.transformDirty = true;
	}

	SetRotation(rot)
	{
		this.rot.Set(rot);
		this.transformDirty = true;
	}

	SetScale(scale)
	{
		this.scale.Set(scale);
		this.transformDirty = true;
	}

	SetParent(parent)
	{
		// todo: could do with some checks here.
		// if current parent != null, need to unparent first
		this.parent = parent;
		if(parent) {
			parent.children.push(this);
		}

		this.transformDirty = true;
	}

	AddComponent(comp)
	{
		comp.gameObject = this;
		this.components.push(comp);
	}

	Update(dT)
	{
		if(!this.initialised)
		{
			for(let i=0; i<this.components.length; ++i) {
				this.components[i].Start();
			}
		}

		for(let i=0; i<this.components.length; ++i) {
			this.components[i].Update(dT);
		}
	}

	UpdateTransform()
	{
		this.localToWorld = Mat4x4.FromTransform(this.pos, this.scale, this.rot);
		if(this.parent != null) {
			Mat4x4.Multiply(this.parent.localToWorld, this.localToWorld, this.localToWorld);
			Mat4x4.TransformPoint(this.parent.localToWorld, this.pos, this.wpos);
			Quat.Mul(this.parent.wrot, this.rot, this.wrot);
			Vec3.Scale(this.parent.wscale, this.scale, this.wscale);
		} else {
			this.wpos.Set(this.pos);
			this.wrot.Set(this.rot);
			this.wscale.Set(this.scale);
		}

		this.transformDirty = false;
	}
	
	Render()
	{
		for(let i=0; i<this.components.length; ++i) {
			this.components[i].Render();
		}
	}
}

class Component
{
	constructor()
	{
		this.gameObject = null;
	}

	Start() {}
	Update(dT) {}
	Render() {}
}

class MeshRenderer extends Component
{
	constructor(meshId, matId)
	{
		super();
		this.meshId = meshId;
		this.matId = matId;
	}

	Render() {
		let go = this.gameObject;
		MB.SetMaterial(this.matId);
		MB.DrawMesh(this.meshId, go.wpos, go.wrot, go.wscale);
	}
}

class ParticleSystem extends Component
{
	constructor(particleParams) 
	{
		super();

		this.particles = MB.CreateParticleSystem(particleParams);

		// request spawn of initial particles
		this.spawnCounter = particleParams.initialSpawnCount || 0;
		this.spawnRate = particleParams.spawnRate || 0;
	}

	DoBurst(numParticles)
	{
		this.spawnCounter += numParticles;
	}

	Update(dT) {

		// spawn more particles
		this.spawnCounter += dT * this.spawnRate;
		let numNewParticles = Math.floor(this.spawnCounter);
		let dir = new Vec3(0,0,-1); // todo: transform this by localToWorld.
		if(numNewParticles > 0)
		{
			MB.SpawnParticles(this.particles, numNewParticles, this.gameObject.wpos, dir);
		    this.spawnCounter -= numNewParticles;
		}

		MB.UpdateParticles(this.particles);
	}

	Render() {
		MB.DrawParticles(this.particles);
	}
}

class Scene
{
	constructor() {
		this.rootObjects = [];
	}

	AddRootObject(gameObject)
	{
		this.rootObjects.push(gameObject);
	}

	UpdateGameObject(go, dT)
	{
		if(!go.isActive)
			return;

		go.Update(dT);
		let xfmDirty = go.transformDirty;
		if(xfmDirty)
			go.UpdateTransform();
		
		for(let i=0; i<go.children.length; ++i)
		{
			if(xfmDirty)
				go.children[i].transformDirty = true;
			
			this.UpdateGameObject(go.children[i], dT);
		}
	}

	RenderGameObject(go)
	{
		if(!go.isActive || !go.isVisible)
			return;
	
		go.Render();
		for(let i=0; i<go.children.length; ++i)
		{
			this.RenderGameObject(go.children[i]);
		}
	}
	
	UpdateRootObjects(dT)
	{
		for(let i=0; i<this.rootObjects.length; ++i) {
			this.UpdateGameObject(this.rootObjects[i], dT)
		}
	}
	
	RenderRootObjects()
	{
		for(let i=0; i<this.rootObjects.length; ++i) {
			this.RenderGameObject(this.rootObjects[i]);
		}
	}
}


class PokiManager
{
	constructor()
	{
		this.sentLoadFinished = false;
		this.sentGameStarted = false;
		this.shownPrerollAdd = false;

		this.wasMusicPlaying = true;

		this.rewardedCB = null;
		this.adCompletedCB = null;

		this.is_player_playing = false;
		this.adPlaying = false;

		this.pokiAvailable = true;
		this.offlineDebugMode = false;

		this.displayContainer = null;
		this.displaySize = "";
	}

	Init()
	{
		if(this.offlineDebugMode)
		{
			console.log("Poki Not Available");
			this.pokiAvailable = false;
			return;
		}

		console.log("Initialising...")

		if(Game.isMobileBrowser)
		{
			this.displayContainer = document.getElementById('display320x50');
			this.displaySize = '320x50';
		}
		else
		{
			this.displayContainer = document.getElementById('display728x90');
			this.displaySize = '728x90';
		}

		PokiSDK.init().then(
			() => {
				// successfully initialized
				console.log("PokiSDK initialized");

				// for testing.
				PokiSDK.setDebug(false);

				this.pokiAvailable = true;
			}   
		).catch(
			() => {
				// initialized but the user has an adblock
				console.log("Adblock enabled");
				this.pokiAvailable = false;
				// feel free to kindly ask the user to disable AdBlock, like forcing weird usernames or showing a sad face; be creative!
				// continue to the game
			}   
		);
	}

	OnLoadingStart()
	{
		if(!this.pokiAvailable)
			return;
		PokiSDK.gameLoadingStart();
	}

	OnLoadingProgress(percent)
	{
		if(!this.pokiAvailable)
			return;

		var data = {};
		data["percentageDone"] = percent;
		PokiSDK.gameLoadingProgress(data);	
	}

	OnLoadingComplete()
	{
		if(!this.pokiAvailable)
			return;

		PokiSDK.gameLoadingFinished();
	}

	Update()
	{
		if(!this.pokiAvailable)
			return;

		if (Game.state == State.Playing && !this.is_player_playing)
		{
			this.is_player_playing = true;
			PokiSDK.gameplayStart();
		}
		else if (Game.state != State.Playing && this.is_player_playing)
		{
			this.is_player_playing = false;
			PokiSDK.gameplayStop();
		}
	}

	OnAdStarted()
	{
		this.adPlaying = true;

		this.wasMusicPlaying = MB.IsMusicPlaying();
		if(this.wasMusicPlaying)
			MB.PauseMusic();
	}

	OnAdEnded()
	{
		this.adPlaying = false;

		MB.ResetInput();

		if (this.wasMusicPlaying)
			MB.UnPauseMusic();

		if(this.adCompletedCB != null)
		{
			this.adCompletedCB();
			this.adCompletedCB = null;
		}
	}

	OnRewardedAdCompleted(success)
	{
		if (success && this.rewardedCB != null)
		{
			this.rewardedCB(true);
			this.rewardedCB = null;
		}
		this.OnAdEnded();
	}

	MaybeShowAd(callback)
	{
		if(!this.pokiAvailable)
		{
			if(callback)
				callback();
			return;
		}

		this.ShowAdvert(callback);
	}

	ShowAdvert(callback)
	{
		if(!this.pokiAvailable)
		{
			console.log("ShowAd");
			if(callback)
				callback();
			return;
		}

		this.adCompletedCB = callback;
		this.OnAdStarted();

		let poki = this;
		PokiSDK.commercialBreak().then(() => poki.OnAdEnded());
	}

	ShowDisplayAd()
	{
		if(!this.pokiAvailable)
		{
			console.log("ShowDisplayAd");
			return;
		}

		PokiSDK.displayAd(this.displayContainer, this.displaySize);
		this.displayContainer.style.display = "block";
	}

	HideDisplayAd()
	{
		if(!this.pokiAvailable)
		{
			console.log("HideDisplayAd");
			return;
		}
		PokiSDK.destroyAd(this.displayContainer);
		this.displayContainer.style.display = "none";
	}

	/// <summary>
	/// Show a reward advert and get a callback if the player successfully completed watching it
	/// </summary>
	/// <param name="callback"></param>
	ShowRewardedAdvert(callback)
	{
		if(!this.pokiAvailable)
		{
			console.log("ShowRewardAd");
			if(callback)
				callback(true);
			return;
		}

		this.rewardedCB = callback;
		this.OnAdStarted();

		let poki = this;
		PokiSDK.rewardedBreak().then((success) => poki.OnRewardedAdCompleted(success));
	}

	OnStartButtonPressed()
	{
		if (!this.shownPrerollAdd)
		{
			this.shownPrerollAdd = true;
			this.ShowAdvert(null);
		}
	}

	OnPowerUp()
	{
		if(!this.pokiAvailable)
			return;

		let happiness = Math.max(0, Math.min(1.0, (0.1 * Game.cumulativeLevelCount)));
		PokiSDK.happyTime(happiness);
	}
}

let AdManager = new PokiManager();let FontId = -1;
let PanelTex = -1;
let WhiteTex = -1;
let TitleTex = -1;

let Button = -1;
let ButtonSel = -1;
let PlayButton = -1;
let HomeButton = -1;
let RestartButton = -1;
let PauseButton = -1;
let ShipButton = -1;
let AudioOnButton = -1;
let AudioOffButton = -1;
let EasyButton = -1;
let MedButton = -1;
let HardButton = -1;
let VideoButton = -1;
let ArrowLIcon = -1;
let ArrowRIcon = -1;
let GemIcon = -1;
let StarIcon = -1;

const WhiteCol = Vec4.One();

let WindowPanel = -1;
let ButtonPanel = -1;
let ButtonPanelSel = -1;

const HFill = {
	AlignLeft: 0,
	AlignCenter: 1,
	AlignRight: 2,
	Fill: 3
}

const VFill = {
	AlignTop: 0,
	AlignCenter: 1,
	AlignBottom: 2,
	Fill: 3
}

class UILayout
{
	constructor()
	{
		this.pos = Vec2.Zero();
		this.size = Vec2.Zero();
		this.scale = 1.0;
		this.hfill = HFill.Fill;
		this.vfill = VFill.Fill;
		this.alpha = 1.0;
		this.isVisible = true;
		this.uiItems = [];	// widgets to layout
		this.children = []; // child layouts
	}

	AddItem(uiItem)
	{
		this.uiItems.push(uiItem);
	}

	AddChild(uiLayout)
	{
		this.children.push(uiLayout);
	}

	FindItemAtPos(hitPos, parentPos, parentSize)
	{
		if(!this.isVisible)
			return null;

		const numItems = this.uiItems.length;
		let contPos = Vec2.Zero();
		let contSize = Vec2.Zero();
		this.calcLayout(parentPos, parentSize, this.pos, this.size, this.scale, this.hfill, this.vfill, contPos, contSize);

		let pos = Vec2.Zero();
		let size = Vec2.Zero();
		let hitItem = null;
		for(let i=0; i<numItems; ++i)
		{
			const item = this.uiItems[i];
			if(!item.blocksRayCast)
				continue;

			this.calcLayout(contPos, contSize, item.pos, item.size, item.scale, item.hfill, item.vfill, pos, size);

			if(	hitPos.x > pos.x && hitPos.x < (pos.x + size.x) && 
				hitPos.y > pos.y && hitPos.y < (pos.y + size.y))
			{
				hitItem = item;
			}
		}

		const numChildren = this.children.length;
		for(let i=0; i<numChildren; ++i)
		{
			const child = this.children[i];
			let hitChildItem = child.FindItemAtPos(hitPos, contPos, contSize);
			if(hitChildItem != null)
				hitItem = hitChildItem;
		}

		return hitItem;
	}

	Render(parentPos, parentSize, alpha)
	{
		if(!this.isVisible)
			return;

		const numItems = this.uiItems.length;
		let contPos = Vec2.Zero();
		let contSize = Vec2.Zero();
		this.calcLayout(parentPos, parentSize, this.pos, this.size, this.scale, this.hfill, this.vfill, contPos, contSize);

		alpha *= this.alpha;
		let pos = Vec2.Zero();
		let size = Vec2.Zero();
		for(let i=0; i<numItems; ++i)
		{
			const item = this.uiItems[i];
			if(item.isVisible)
			{
				this.calcLayout(contPos, contSize, item.pos, item.size, item.scale, item.hfill, item.vfill, pos, size);
				item.Render(pos, size, alpha);
			}
		}

		const numChildren = this.children.length;
		for(let i=0; i<numChildren; ++i)
		{
			const child = this.children[i];
			child.Render(contPos, contSize, alpha);
		}
	}

	calcLayout(parentPos, parentSize, pos, size, scale, hfill, vfill, outPos, outSize)
	{
		outPos.x = parentPos.x + pos.x;
		outSize.x = size.x;
		if(hfill == HFill.AlignCenter)
			outPos.x += (parentSize.x - size.x) / 2;
		else if(hfill == HFill.AlignRight)
			outPos.x += parentSize.x - size.x;
		else if(hfill == HFill.Fill) 
			outSize.x = parentSize.x - size.x - pos.x;

		outPos.y = parentPos.y + pos.y;
		outSize.y = size.y;
		if(vfill == VFill.AlignCenter)
			outPos.y += (parentSize.y - size.y) / 2;
		else if(vfill == VFill.AlignBottom)
			outPos.y += parentSize.y - size.y;
		else if(vfill == VFill.Fill) 
			outSize.y = parentSize.y - size.y - pos.y;

		// scale around the centre of the item, regardless of layout alignments
		if(hfill != HFill.Fill) {
			outPos.x += (1.0 - scale) * 0.5 * size.x;
			outSize.x *= scale;
		}
		if(vfill != VFill.Fill) {
			outPos.y += (1.0 - scale) * 0.5 * size.y;
			outSize.y *= scale;
		}
	}
}

class UIItem
{
	constructor(pos, size)
	{
		this.leftItem = null;
		this.rightItem = null;
		this.upItem = null;
		this.downItem = null;
		this.hfill = HFill.Left;
		this.vfill = VFill.Top;
		this.pos = Vec2.Clone(pos);
		this.size = size || Vec2.Zero();
		this.scale = 1.0;
		this.blocksRayCast = true;
		this.isSelectable = false;
		this.isVisible = true;
	}

	OnSelected() {}
	OnUnselected() {}
	OnClicked() {}
	Render(pos, size, alpha) {}
}

class UILabel extends UIItem
{
	constructor(font, txt, pos, size, col, align)
	{
		super(pos, new Vec2(0, 0));

		this.font = font;
		this.text = txt;
		this.pos = pos;
		this.fontSize = size;
		this.col = col;
		this.align = align;
		this.blocksRayCast = false;
	}

	Render(pos, size, alpha) 
	{
		let col = Vec4.Clone(this.col);
		col.w *= alpha;
		MB.DrawText(this.font, this.text, pos, this.fontSize, this.align, col);
	}
}

class UIImage extends UIItem
{
	constructor(texId, pos, size, col)
	{
		super(pos, size);
		this.texId = texId;
		this.col = col || Vec4.One();
	}

	Render(pos, size, alpha)
	{
		let col = Vec4.Clone(this.col);
		col.w *= alpha;

		MB.DrawUIImage(this.texId, pos, size, col);
	}
}

class UIButton extends UIItem
{
	constructor(texId, pos, size, onClicked)
	{
		super(pos, size);

		this.texId = texId;
		this.onClicked = onClicked;
		this.isSelectable = true;
		this.isSelected = false;
		this.drawButtonBorder = true;
		this.sfx = ButtonOkSfx;
	}

	Render(pos, size, alpha)
	{
		let col = Vec4.One();//Clone(this.col);
		col.w = alpha;

		if(this.drawButtonBorder)
		{
			if(this.isSelected)
				MB.DrawUIPanel(ButtonPanelSel, pos, size, col);
			else
				MB.DrawUIPanel(ButtonPanel, pos, size, col);

			if(this.texId)
				MB.DrawUIImage(this.texId, pos, size, col);
		}
		else
		{
			if(this.texId)
			{
				if(!this.isSelected)
					col.w *= 0.4;

				MB.DrawUIImage(this.texId, pos, size, col);
			}
		}
	}

	OnClicked()
	{
		if(this.sfx != null && this.sfx >= 0)
			MB.PlaySfx(this.sfx);

		if(this.onClicked)
			this.onClicked();
	}

	OnSelected()
	{
		this.isSelected = true;
	}

	OnUnselected()
	{
		this.isSelected = false;
	}
}

class UIPanel extends UIItem
{
	constructor(panelId, topLeftMargin, bottomRightMargin)
	{
		super(topLeftMargin, Vec2.Clone(bottomRightMargin));

		this.panel = panelId;
		this.hfill = HFill.Fill;
		this.vfill = VFill.Fill;
	}

	Render(pos, size, alpha)
	{
		let col = Vec4.One();//Clone(this.col);
		col.w = alpha;

		MB.DrawUIPanel(this.panel, pos, size, col);
	}
}

class MenuScreen
{
	constructor(name)
	{
		this.name = name;
		this.initialFocus = null;
		this.selected = null;
		this.root = new UILayout();
		this.prevMousePos = new Vec2(-1,-1);

		this.isInteractive = true;
		this.isVisible = false;
		this.alpha = 0.0;
	}

	ClearFocus()
	{
		if(this.selected)
			this.selected.OnUnselected();
			
		this.selected = null;
	}

	MoveFocus(nextControl)
	{
		if(nextControl == null)
			return;
			
		if(this.selected)
			this.selected.OnUnselected();

		this.selected = nextControl;	

		if(this.selected)
			this.selected.OnSelected();
	}

	Update(dT)
	{
		this.WhileOpen(dT);

		if(this.isInteractive)
		{
			let screenW = MB.ScreenWidth();
			let screenH = MB.ScreenHeight()
			let aspect = screenW / screenH;
			let menuW = 1080 * aspect;
			let menuH = 1080;

			let mousePos = new Vec2(MB.MouseX(), MB.MouseY());

			// convert mouse coords into menu coord system
			mousePos.x = (mousePos.x / screenW) * menuW;
			mousePos.y = (mousePos.y / screenH) * menuH;

			if (mousePos.x != this.prevMousePos.x || mousePos.y != this.prevMousePos.y)
			{
				this.prevMousePos = mousePos;
				let size = new Vec2(menuW, menuH);
				let pos = Vec2.Zero();
		
				let newHoverItem = this.root.FindItemAtPos(mousePos, pos, size);
				if(newHoverItem != this.hoverItem)
				{
					this.OnPointerLeaveControl(this.hoverItem);
					this.hoverItem = newHoverItem;
					this.OnPointerEnterControl(this.hoverItem);
				}
			}

			if(MB.WasMousePressed(0) && this.hoverItem != null && this.hoverItem.isSelectable)
			{
				this.MoveFocus(this.hoverItem);
				this.hoverItem.OnClicked();
			}
		}
	}

	OnPointerEnterControl(control)
	{
		if(this.selected != control && control != null)
			control.OnSelected();
	}
	OnPointerLeaveControl(control)
	{
		// don't unselect the focused control when the pointer exits.
		if(this.selected != control && control != null)
			control.OnUnselected();
	}

	WhileOpen(dT) {}

	Render()
	{
		let aspect = MB.ScreenWidth() / MB.ScreenHeight();
		let size = new Vec2(aspect * 1080, 1080);
		let pos = Vec2.Zero();

		this.root.Render(pos, size, this.alpha);
	}

	MoveLeft()
	{
		if(this.selected)
			this.MoveFocus(this.selected.leftItem);
	}
	MoveRight()
	{
		if(this.selected)
			this.MoveFocus(this.selected.rightItem);
	}

	MoveUp()
	{
		if(this.selected)
			this.MoveFocus(this.selected.upItem);
	}

	MoveDown()
	{
		if(this.selected)
			this.MoveFocus(this.selected.downItem);
	}

	SetInitialFocus() 
	{
		this.MoveFocus(this.initialFocus);
	}

	OnAboutToShow()
	{		
	}

	OnSubmit()
	{
		if(this.selected)
			this.selected.OnClicked();
	}

	OnBack()
	{
		MenuControl.CloseMenu(this.name);
	}
}

class CMenuControl
{
	constructor()
	{
		this.currentMenu = null;
		this.menuStack = [];
		this.allMenus = [];
	}

	Init(width, height)
	{
		FontId = MB.CreateFont("Acme-Regular.ttf");
		PanelTex = MB.CreateTexture("Window.png");
		WhiteTex = MB.CreateTexture("White.png");
		TitleTex = MB.CreateTexture("Logo.png");
		Button = MB.CreateTexture("Button.png");
		ButtonSel = MB.CreateTexture("ButtonSel.png");
		PlayButton = MB.CreateTexture("ButtonPlay.png");
		HomeButton = MB.CreateTexture("ButtonHome.png");
		RestartButton = MB.CreateTexture("ButtonRestart.png");
		PauseButton = MB.CreateTexture("ButtonPause.png");
		ShipButton = MB.CreateTexture("ButtonShip.png");
		AudioOnButton = MB.CreateTexture("ButtonAudioOn.png");
		AudioOffButton = MB.CreateTexture("ButtonAudioOff.png");
		VideoButton = MB.CreateTexture("ButtonVideo.png");
		ArrowLIcon = MB.CreateTexture("ButtonArrowL.png");
		ArrowRIcon = MB.CreateTexture("ButtonArrowR.png");
		GemIcon = MB.CreateTexture("GemIcon.png");
		StarIcon = MB.CreateTexture("StarIcon.png");

		EasyButton = MB.CreateTexture("ButtonEasy.png");
		MedButton = MB.CreateTexture("ButtonMed.png");
		HardButton = MB.CreateTexture("ButtonHard.png");

		WindowPanel = MB.CreateUIPanel(PanelTex, 30, 30, 30, 30);
		ButtonPanel = MB.CreateUIPanel(Button, 50,50,50,50);
		ButtonPanelSel = MB.CreateUIPanel(ButtonSel, 50,50,50,50);

		this.faderAlpha = 1.0;
		this.inTransition = false;
		this.faderTween = null;

		this.allMenus.push(new MainMenu());
		// this.allMenus.push(new SettingsMenu());
		this.allMenus.push(new RestartMenu());
		this.allMenus.push(new HUD());
		this.allMenus.push(new PauseMenu());
		this.allMenus.push(new ShopMenu());
		this.allMenus.push(new LevelEndMenu());
		// this.allMenus.push(new LevelSelectMenu());
		//this.allMenus.push(new TestMenu());
		//this.OpenMenu("MainMenu");
		//this.FaderFadeOut(1.0);
	}

	FaderFadeIn(duration, callback)
	{
		Tweener.ForceComplete(this.faderTween);
		
		this.faderTween = Tweener.AddTween(0.0, 1.0, duration, function(t){
			MenuControl.faderAlpha = t;
		}).OnCompleted(callback);
	}

	FaderFadeOut(duration, callback)
	{
		Tweener.ForceComplete(this.faderTween);

		this.faderTween = Tweener.AddTween(1.0, 0.0, duration, function(t){
			MenuControl.faderAlpha = t;
		}).OnCompleted(callback);
	}

	animateOut(menu, callback)
	{
		this.inTransition = true;
		Tweener.RemoveTween(this.outTween);

		this.outTween = Tweener.AddTween(menu.alpha, 0.0, 0.2, function(t) {
			menu.alpha = t;
		}).OnCompleted(function() {
			menu.isVisible = false;
			MenuControl.inTransition = false;
			callback();
		});
	}

	animateIn(menu)
	{
		this.inTransition = true;
		Tweener.RemoveTween(this.inTween);

		menu.isVisible = true;
		this.inTween = Tweener.AddTween(0.0, 1.0, 0.4, function(t) {
			menu.alpha = t;
		}).OnCompleted(function(){
			MenuControl.inTransition = false;
		});
	}

	FindMenu(name)
	{
		for(let menu of this.allMenus)
		{
			if(menu.name == name)
				return menu;
		}

		return null;
	}

	showTopScreen()
	{
		let menu = this.menuStack[this.menuStack.length - 1];

		menu.OnAboutToShow();
		menu.SetInitialFocus();
		this.currentMenu = menu;
		this.currentMenu.MoveFocus(this.currentMenu.selected);
		this.animateIn(menu);
	}

	HideAllImmediate()
	{
		if(this.currentMenu)
			this.currentMenu.isVisible = false;
		this.currentMenu = null;
		this.menuStack = [];
		this.inTransition = false;

		Tweener.RemoveTween(this.inTween);
		Tweener.RemoveTween(this.outTween);
		this.inTween = null;
		this.outTween = null;
	}

	OpenMenu(name)
	{
		if(MenuControl.inTransition)
			return;

		let menu = MenuControl.FindMenu(name);
		if(menu == null)
		{
			console.log("No menu found with name: " + name);
			return;
		}

		if(MenuControl.currentMenu)
		{
			MenuControl.animateOut(MenuControl.currentMenu, function() {
				MenuControl.menuStack.push(menu);
				MenuControl.showTopScreen();
			});
		}
		else
		{
			MenuControl.menuStack.push(menu);
			MenuControl.showTopScreen();
		}
	}

	CloseMenu(name)
	{
		if(MenuControl.currentMenu && MenuControl.currentMenu.name == name)
		{
			MenuControl.animateOut(MenuControl.currentMenu, function() {
				MenuControl.menuStack.pop();
				MenuControl.currentMenu = null;
				if(MenuControl.menuStack.length > 0)
				{
					MenuControl.showTopScreen();
				}
			});
		}
	}

	Update(dT)
	{
		if(!this.inTransition && this.currentMenu)
		{
			this.currentMenu.Update(dT);
		}
	}

	renderFader()
	{
		let aspect = MB.ScreenWidth() / MB.ScreenHeight();
		let size = new Vec2(aspect * 1080, 1080);
		let pos = Vec2.Zero();
		let col = Vec4.One();
		col.w = this.faderAlpha;
		MB.DrawUIImage(WhiteTex, pos, size, col);
	}

	Render()
	{
		// could render all visible screens here, if >1 can be visible during transitions?
		if(this.currentMenu)
			this.currentMenu.Render();

		if(this.faderAlpha > 0)
			this.renderFader();
	}

	MoveLeft()
	{
		if(!this.inTransition && this.currentMenu)
			this.currentMenu.MoveLeft();
	}

	MoveRight()
	{
		if(!this.inTransition && this.currentMenu)
			this.currentMenu.MoveRight();
	}

	MoveUp()
	{
		if(!this.inTransition && this.currentMenu)
			this.currentMenu.MoveUp();
	}

	MoveDown()
	{
		if(!this.inTransition && this.currentMenu)
			this.currentMenu.MoveDown();
	}

	OnSubmit()
	{
		if(!this.inTransition && this.currentMenu)
			this.currentMenu.OnSubmit();
	}

	OnBack()
	{
		if(!this.inTransition && this.currentMenu)
			this.currentMenu.OnBack();
	}
}

let MenuControl = new CMenuControl();

/// Menu Screens ///

function GetDifficultyIcon(difficulty) {
	if(difficulty == 0) 
		return EasyButton;
	else if(difficulty == 1) 
		return MedButton;
	else 
		return HardButton;
}

class MainMenu extends MenuScreen
{
	constructor()
	{
		super("MainMenu");

//		let bgDarken = new UIImage(FlareTex, Vec2.Zero(), Vec2.Zero(), new Vec4(0,0,0,0.5));
//		bgDarken.vfill = VFill.Fill;
//		bgDarken.hfill = HFill.Fill;
//		this.root.AddItem(bgDarken);

		let pos = new Vec2(0, -300);
		let size = new Vec2(1024, 512);
		let logo = new UIImage(TitleTex, pos, size);
		logo.vfill = VFill.AlignCenter;
		logo.hfill = HFill.AlignCenter;
		this.root.AddItem(logo);

		let playButton = new UIButton(PlayButton, new Vec2(0, 0), new Vec2(200, 200), function(){
			Game.OnPlayButtonPressed();
		});
		playButton.hfill = HFill.AlignCenter;
		playButton.vfill = VFill.AlignCenter;
		this.root.AddItem(playButton);
		this.playButton = playButton;

		let levelText = new UILabel(FontId, "LEVEL x", new Vec2(0, 160), 7, WhiteCol, MB.HAlign.Center);
		levelText.hfill = HFill.AlignCenter;
		levelText.vfill = VFill.AlignCenter;
		this.levelText = levelText;
		this.root.AddItem(levelText);

		let shopButton = new UIButton(ShipButton, new Vec2(-440, 0), new Vec2(170, 170), function(){
			MenuControl.OpenMenu("ShopMenu");
		});
		shopButton.hfill = HFill.AlignRight;
		shopButton.vfill = VFill.AlignBottom;
		this.root.AddItem(shopButton);
		let shopStar = new UIImage(StarIcon, new Vec2(-440,-100), new Vec2(80,80), new Vec4(0.4,0.9,0.5,1.0));
		shopStar.hfill = HFill.AlignRight;
		shopStar.vfill = VFill.AlignBottom;
		this.root.AddItem(shopStar);
		this.shopStar = shopStar;
		shopStar.isVisible = false;

		let audioButton = new UIButton(AudioOnButton, new Vec2(-40, 0), new Vec2(140, 140), null);
		audioButton.onClicked = function() {
			if(audioButton.texId == AudioOnButton)
			{
				// disable audio
				MB.SetAudioVolume(0.0);
				audioButton.texId = AudioOffButton;
			}
			else
			{
				// enable audio
				MB.SetAudioVolume(1.0);
				audioButton.texId = AudioOnButton;
			}
		}
		audioButton.hfill = HFill.AlignRight;
		audioButton.vfill = VFill.AlignBottom;
		this.root.AddItem(audioButton);

		let difficultyButton = new UIButton(GetDifficultyIcon(Game.GetDifficulty()), new Vec2(-240, 0), new Vec2(140,140), null);
		difficultyButton.onClicked = function() {
			let diff = (Game.GetDifficulty() + 1) % 3;
			Game.SetDifficulty(diff);
			difficultyButton.texId = GetDifficultyIcon(diff);

			console.log("New difficulty = " + diff);
		}
		difficultyButton.hfill = HFill.AlignRight;
		difficultyButton.vfill = VFill.AlignBottom;
		this.root.AddItem(difficultyButton);

		let gemIcon = new UIImage(GemIcon, new Vec2(-140,40), new Vec2(120, 120), WhiteCol);
		gemIcon.hfill = HFill.AlignRight;
		gemIcon.vfill = VFill.AlignTop;
		this.root.AddItem(gemIcon);

		let gemCounter = new UILabel(FontId, "", new Vec2(-140, 120), 8, WhiteCol, MB.HAlign.Left);
		gemCounter.hfill = HFill.AlignRight;
		gemCounter.vfill = VFill.AlignTop;
		this.root.AddItem(gemCounter);
		this.gemCounter = gemCounter;

		// setup keyboard navigation
		playButton.downItem = shopButton;
		playButton.rightItem = shopButton;

		shopButton.leftItem = playButton;
		shopButton.upItem = playButton;
		difficultyButton.upItem = playButton;
		audioButton.upItem = playButton;

		shopButton.rightItem = difficultyButton;
		difficultyButton.rightItem = audioButton;
		difficultyButton.leftItem = shopButton;
		audioButton.leftItem = difficultyButton;

		this.initialFocus = playButton;
		this.animTimer = 0.0;
	}

	CanBuyANewShip()
	{
		for(var i=0; i<AllShips.length; ++i) {
			let ship = AllShips[i];
			if(!ship.owned && ship.price <= Game.GemCount)
				return true;
		}
		return false;
	}

	OnAboutToShow()
	{
		this.gemCounter.text = Game.GemCount.toString();
		this.animTimer = 0.0;

		this.levelText.text = "LEVEL " + (Game.currentLevel+1);

		// check if we can afford a new ship, and show star on shop button if so
		this.shopStar.isVisible = this.CanBuyANewShip();
		if(!ContinuousLevels)
			this.shopStar.isVisible = false;
	}
	WhileOpen(dT)
	{
		// update gem count
		this.gemCounter.text = Game.GemCount.toString();

		this.animTimer += dT;

		if(this.playButton.isSelected)
			this.playButton.scale = 1.0 + 0.05 * Math.max(0, Math.sin(this.animTimer * 5));
		else
			this.playButton.scale = 1.0;

		// animate star on shop button
		this.shopStar.scale = 1.0 + 0.05 * Math.sin(this.animTimer * 10);
	}
	OnBack()
	{
		// don't allow going back from main menu
	}
}

class RestartMenu extends MenuScreen
{
	constructor()
	{
		super("RestartMenu");

		let pos = new Vec2(0, 0);
		let panel = new UIPanel(WindowPanel, pos, pos);
		panel.vfill = VFill.AlignCenter;
		panel.hfill = HFill.AlignCenter;
		panel.size = new Vec2(1250, 450);
		this.root.AddItem(panel);

		let title = new UILabel(FontId, "LEVEL x: FAILED", new Vec2(0, -80), 16, WhiteCol, MB.HAlign.Center);
		title.hfill = HFill.AlignCenter;
		title.vfill = VFill.AlignCenter;
		this.root.AddItem(title);
		this.title = title;

		let gemIcon = new UIImage(GemIcon, new Vec2(-140,40), new Vec2(120, 120), WhiteCol);
		gemIcon.hfill = HFill.AlignRight;
		gemIcon.vfill = VFill.AlignTop;
		this.root.AddItem(gemIcon);

		let gemCounter = new UILabel(FontId, "", new Vec2(-140, 120), 8, WhiteCol, MB.HAlign.Left);
		gemCounter.hfill = HFill.AlignRight;
		gemCounter.vfill = VFill.AlignTop;
		this.root.AddItem(gemCounter);
		this.gemCounter = gemCounter;

		let distance = new UILabel(FontId, "Distance: 50%", new Vec2(0, 10), 8, WhiteCol, MB.HAlign.Center);
		distance.hfill = HFill.AlignCenter;
		distance.vfill = VFill.AlignCenter;
		this.root.AddItem(distance);
		this.distance = distance;
		let gemsCollected = new UILabel(FontId, "Gems Collected: 77", new Vec2(0, 80), 8, WhiteCol, MB.HAlign.Center);
		gemsCollected.hfill = HFill.AlignCenter;
		gemsCollected.vfill = VFill.AlignCenter;
		this.root.AddItem(gemsCollected);
		this.gemsCollected = gemsCollected;

		let progressBarLayout = new UILayout();
		progressBarLayout.pos = new Vec2(0, 20);
		progressBarLayout.size = new Vec2(900, 10);
		progressBarLayout.hfill = HFill.AlignCenter;
		progressBarLayout.vfill = VFill.AlignTop;
		this.root.AddChild(progressBarLayout);
		let progressBG = new UIImage(WhiteTex, new Vec2(0, 0), new Vec2(900, 10), new Vec4(0,0,0,0.5));
		progressBG.hfill = HFill.AlignLeft;
		progressBG.vfill = VFill.AlignCenter;
		progressBarLayout.AddItem(progressBG);
		let progressBar = new UIImage(WhiteTex, new Vec2(0, 0), new Vec2(0, 10), WhiteRGBA);
		progressBar.hfill = HFill.AlignLeft;
		progressBar.vfill = VFill.AlignCenter;
		progressBarLayout.AddItem(progressBar);
		let progressShip = new UIImage(PlayButton, new Vec2(-900/2, 0), new Vec2(60,60), WhiteCol);
		progressShip.hfill = HFill.AlignCenter;
		progressShip.vfill = VFill.AlignCenter;
		progressBarLayout.AddItem(progressShip);
		this.progressBar = progressBar;
		this.progressShip = progressShip;

		let continueLayout = new UILayout();
		continueLayout.pos = new Vec2(0, 230);
		continueLayout.size = new Vec2(400, 200);
		continueLayout.hfill = HFill.AlignCenter;
		continueLayout.vfill = VFill.AlignCenter;
		this.root.AddChild(continueLayout);
		this.continueLayout = continueLayout;

		let continueButton = new UIButton(null, new Vec2(0, 0), new Vec2(400, 200), null);
		continueButton.hfill = HFill.AlignCenter;
		continueButton.vfill = VFill.AlignCenter;
		continueLayout.AddItem(continueButton);
		this.continueButton = continueButton;

		let continueIcon = new UIImage(VideoButton, new Vec2(-150, 0), new Vec2(140,140), WhiteCol);
		continueIcon.hfill = HFill.AlignCenter;
		continueIcon.vfill = VFill.AlignCenter;
		continueLayout.AddItem(continueIcon);
		let watchLabel = new UILabel(FontId, "Watch Ad", new Vec2(20, -40), 4, WhiteCol, MB.HAlign.Center);
		watchLabel.hfill = HFill.AlignCenter;
		watchLabel.vfill = VFill.AlignCenter;
		continueLayout.AddItem(watchLabel);
		let continueLabel = new UILabel(FontId, "Watch Ad", new Vec2(20, 10), 6, WhiteCol, MB.HAlign.Center);
		continueLabel.hfill = HFill.AlignCenter;
		continueLabel.vfill = VFill.AlignCenter;
		continueLayout.AddItem(continueLabel);
		let continueLabel2 = new UILabel(FontId, "To Continue", new Vec2(20, 60), 6, WhiteCol, MB.HAlign.Center);
		continueLabel2.hfill = HFill.AlignCenter;
		continueLabel2.vfill = VFill.AlignCenter;
		continueLayout.AddItem(continueLabel2);
		this.continueLabel = continueLabel;
		this.continueLabel2 = continueLabel2;

		let replayButton = new UIButton(RestartButton, new Vec2(-280, 230), new Vec2(160, 160), function(){
			AdManager.HideDisplayAd();
			AdManager.MaybeShowAd(()=>Game.OnStartGamePressed());
		});		
		replayButton.hfill = HFill.AlignCenter;
		replayButton.vfill = VFill.AlignCenter;
		this.root.AddItem(replayButton);
		this.replayButton = replayButton;

		let homeButton = new UIButton(HomeButton, new Vec2(280, 230), new Vec2(160, 160), function(){
			AdManager.HideDisplayAd();
			Game.OnShowMainMenu();
		});
		homeButton.hfill = HFill.AlignCenter;
		homeButton.vfill = VFill.AlignCenter;
		this.root.AddItem(homeButton);
		this.homeButton = homeButton;

		continueButton.leftItem = replayButton;
		continueButton.rightItem = homeButton;
		this.initialFocus = this.replayButton;
	}

	OnAboutToShow()
	{
		AdManager.ShowDisplayAd();

		const maxRevives = 1;
		let canContinue = Game.player1.reviveCount < maxRevives;
		let inLastPartOfLevel = true;//(Game.levelManager.zOffset / Game.levelLength) > 0.6;
		inLastPartOfLevel = inLastPartOfLevel || Game.cumulativeLevelCount > 0;
		canContinue = canContinue && inLastPartOfLevel; // only show continue-with-ad button if we're in the last part of the level.

		let canBoost = Game.CrashCount >= 2;
		let canDoubleGems = Game.GemsThisRun >= 20;

		let adText1 = "";
		let adText2 = "";
		let rewardFunc = null;
		let showAdButton = false;

		// ad types:
		// 1: if player has crashed in this level >= 2 times: offer start with boost
		// 2: if player is in last 3rd: offer continue
		// 3: if player has earned > 20 gems: offer double gems
		let adTypes = Shuffle([1,2,3]);
		for(let i=0; i<3; ++i)
		{
			let adType = adTypes[i];
			if(adType == 1 && canBoost)
			{
				adText1 = "Start With";
				adText2 = "Boost";
				showAdButton = true;
				rewardFunc = function() {
					AdManager.HideDisplayAd();
					Game.startLevelWithBoost = true;
					Game.OnStartGamePressed();
				};
			}
			else if(adType == 2 && canContinue)
			{
				adText1 = "Continue";
				adText2 = "From Here";
				showAdButton = true;
				rewardFunc = function() {
					AdManager.HideDisplayAd();
					Game.ReviveAndContinue();
				};
			}
			else if(adType == 3 && canDoubleGems)
			{
				adText1 = "Double";
				adText2 = "Your Gems";
				showAdButton = true;
				rewardFunc = function() {
					AdManager.HideDisplayAd();
					Game.DoubleCollectedGems();
					Game.OnShowMainMenu();
				};
			}

			if(showAdButton)
				break; // we found an available ad type
		}


		if(showAdButton)
		{
			this.continueLayout.isVisible = true;
			this.replayButton.rightItem = this.continueButton;
			this.homeButton.leftItem = this.continueButton;

			this.continueLabel.text = adText1;
			this.continueLabel2.text = adText2;
			this.continueButton.onClicked = function() {
				AdManager.ShowRewardedAdvert((success) => {
					if(success)
						rewardFunc();
				});		
			};
		}
		else
		{
			this.continueLayout.isVisible = false;
			this.replayButton.rightItem = this.homeButton;
			this.homeButton.leftItem = this.replayButton;
		}

		const levelProgress = Game.levelManager.zOffset;
		const progressPercent = levelProgress / Game.levelLength;
		const progressBarW = 900;

		this.progressBar.size.x = progressPercent * progressBarW;
		this.progressShip.pos.x = progressPercent * progressBarW - progressBarW / 2;

		this.title.text = "LEVEL " + (Game.currentLevel+1) + ": FAILED";
		this.distance.text = "Distance: " + Math.floor(progressPercent * 100) + "%";
		this.gemsCollected.text = "Gems Collected: " + Game.GemsThisRun;
		this.gemCounter.text = Game.GemsThisRun.toString();
	}

	OnBack()
	{
		// don't allow going back from restart menu
	}
}

class LevelEndMenu extends MenuScreen
{
	constructor()
	{
		super("LevelEndMenu");

		let pos = new Vec2(0, 0);
		let panel = new UIPanel(WindowPanel, pos, pos);
		panel.vfill = VFill.AlignCenter;
		panel.hfill = HFill.AlignCenter;
		panel.size = new Vec2(1250, 450);
		this.root.AddItem(panel);

		let title = new UILabel(FontId, "LEVEL x: COMPLETED!", new Vec2(0, -80), 16, WhiteCol, MB.HAlign.Center);
		title.hfill = HFill.AlignCenter;
		title.vfill = VFill.AlignCenter;
		this.root.AddItem(title);
		this.title = title;

		let gemIcon = new UIImage(GemIcon, new Vec2(-140,40), new Vec2(120, 120), WhiteCol);
		gemIcon.hfill = HFill.AlignRight;
		gemIcon.vfill = VFill.AlignTop;
		this.root.AddItem(gemIcon);

		let gemCounter = new UILabel(FontId, "", new Vec2(-140, 120), 8, WhiteCol, MB.HAlign.Left);
		gemCounter.hfill = HFill.AlignRight;
		gemCounter.vfill = VFill.AlignTop;
		this.root.AddItem(gemCounter);
		this.gemCounter = gemCounter;

		let gemsCollected = new UILabel(FontId, "Gems Collected: 77", new Vec2(0, 10), 8, WhiteCol, MB.HAlign.Center);
		gemsCollected.hfill = HFill.AlignCenter;
		gemsCollected.vfill = VFill.AlignCenter;
		this.root.AddItem(gemsCollected);
		this.gemsCollected = gemsCollected;

		let levelsUntil = new UILabel(FontId, "Levels Until Next Ship Unlocked: 4", new Vec2(0, 80), 8, WhiteCol, MB.HAlign.Center);
		levelsUntil.hfill = HFill.AlignCenter;
		levelsUntil.vfill = VFill.AlignCenter;
		this.root.AddItem(levelsUntil);
		this.levelsUntil = levelsUntil;

		let homeButton = new UIButton(HomeButton, new Vec2(-280, 230), new Vec2(160, 160), function(){
			AdManager.HideDisplayAd();
			Game.AdvanceLevel();
			Game.OnShowMainMenu();
		});
		homeButton.hfill = HFill.AlignCenter;
		homeButton.vfill = VFill.AlignCenter;
		this.root.AddItem(homeButton);

		let continueButton = new UIButton(PlayButton, new Vec2(280, 230), new Vec2(160, 160), function(){
			AdManager.HideDisplayAd();
			AdManager.MaybeShowAd(() => {
				Game.AdvanceLevel();
				Game.OnStartGamePressed();
			});
		});

		continueButton.hfill = HFill.AlignCenter;
		continueButton.vfill = VFill.AlignCenter;
		this.root.AddItem(continueButton);

		continueButton.leftItem = homeButton;
		homeButton.rightItem = continueButton;

		this.initialFocus = continueButton;
	}

	OnAboutToShow()
	{
		AdManager.ShowDisplayAd();

		this.title.text = "LEVEL " + (Game.currentLevel+1) + ": COMPLETED!";
		this.gemsCollected.text = "Gems Collected: " + Game.GemsThisRun;
		this.gemCounter.text = Game.GemsThisRun.toString();

		const ship = Game.NextShipToUnlock();
		if(ship == null)
		{
			this.levelsUntil.isVisible = false;
		}
		else
		{
			this.levelsUntil.isVisible = true;
			let levelCount = ship.unlockLevel - Game.currentLevel - 2;
			if(levelCount <= 0)
			{
				this.levelsUntil.text = "New Ship Unlocked!";

				// unlock the next ship
				Game.BuyShip(ship);
				Game.SetActiveShip(ship);
				Game.player1.SetShip(ship);

				MB.SpawnParticles(TriggerParticles, 50, Game.player1.ship.pos);
			}
			else
			{
				this.levelsUntil.text = "Next Ship Unlocks in " + levelCount + " Levels";
			}
		}
	}

	OnBack()
	{
		// don't allow going back
	}
}

class HUD extends MenuScreen
{
	constructor()
	{
		super("HUD");

		let pauseButton = new UIButton(PauseButton, new Vec2(0, 0), new Vec2(160, 160), function(){
			console.log("Pause!");
			Game.PauseGame();
		});		
		pauseButton.hfill = HFill.AlignLeft;
		pauseButton.vfill = VFill.AlignTop;
		this.root.AddItem(pauseButton);

		let gemIcon = new UIImage(GemIcon, new Vec2(-140,40), new Vec2(120, 120), WhiteCol);
		gemIcon.hfill = HFill.AlignRight;
		gemIcon.vfill = VFill.AlignTop;
		this.root.AddItem(gemIcon);

		let gemCounter = new UILabel(FontId, "", new Vec2(-140, 120), 8, WhiteCol, MB.HAlign.Left);
		gemCounter.hfill = HFill.AlignRight;
		gemCounter.vfill = VFill.AlignTop;
		this.root.AddItem(gemCounter);
		this.gemCounter = gemCounter;

		let countdown = new UILabel(FontId, "3", new Vec2(0,0), 25, WhiteCol, MB.HAlign.Center);
		countdown.hfill = HFill.AlignCenter;
		countdown.vfill = VFill.AlignCenter;
		countdown.isVisible = false;
		this.root.AddItem(countdown);
		this.countdown = countdown;

		let progressBarLayout = new UILayout();
		progressBarLayout.pos = new Vec2(0, 20);
		progressBarLayout.size = new Vec2(900, 10);
		progressBarLayout.hfill = HFill.AlignCenter;
		progressBarLayout.vfill = VFill.AlignTop;
		this.root.AddChild(progressBarLayout);
		let progressBG = new UIImage(WhiteTex, new Vec2(0, 0), new Vec2(900, 10), new Vec4(0,0,0,0.5));
		progressBG.hfill = HFill.AlignLeft;
		progressBG.vfill = VFill.AlignCenter;
		progressBarLayout.AddItem(progressBG);
		let progressBar = new UIImage(WhiteTex, new Vec2(0, 0), new Vec2(0, 10), WhiteRGBA);
		progressBar.hfill = HFill.AlignLeft;
		progressBar.vfill = VFill.AlignCenter;
		progressBarLayout.AddItem(progressBar);
		let progressShip = new UIImage(PlayButton, new Vec2(-900/2, 0), new Vec2(60,60), WhiteCol);
		progressShip.hfill = HFill.AlignCenter;
		progressShip.vfill = VFill.AlignCenter;
		progressBarLayout.AddItem(progressShip);
		this.progressBar = progressBar;
		this.progressShip = progressShip;

		this.initialFocus = pauseButton;
	}

	OnAboutToShow()
	{
		this.gemCounter.text = Game.GemsThisRun.toString();
	}
	WhileOpen(dT)
	{
		// update gem count
		this.gemCounter.text = Game.GemsThisRun.toString();

		if(Game.state == State.Playing)
		{
			const levelProgress = Game.levelManager.zOffset;
			const progressPercent = levelProgress / Game.levelLength;
			const progressBarW = 900;

			this.progressBar.size.x = progressPercent * progressBarW;
			this.progressShip.pos.x = progressPercent * progressBarW - progressBarW / 2;
			this.countdown.isVisible = false;
		}
		else if(Game.state == State.Countdown)
		{
			const timer = Game.countdownTimer;
			const secs = Math.ceil(timer);
			const t = secs - timer;
			this.countdown.text = secs.toFixed(0);
			// this.countdown.alpha = 1.0 - t;
			// let scale = 1.0 - t + 1.5*t;
			// this.countdownText.scaleX = scale;
			// this.countdownText.scaleY = scale;
			this.countdown.isVisible = (secs > 0 && secs <= 3);
		}
	}
}

class PauseMenu extends MenuScreen
{
	constructor()
	{
		super("PauseMenu");

		let bgDarken = new UIImage(FlareTex, Vec2.Zero(), Vec2.Zero(), new Vec4(0,0,0,0.5));
		bgDarken.vfill = VFill.Fill;
		bgDarken.hfill = HFill.Fill;
		this.root.AddItem(bgDarken);

		let title = new UILabel(FontId, "PAUSED", new Vec2(0, 400), 25, WhiteCol, MB.HAlign.Center);
		title.hfill = HFill.AlignCenter;
		title.vfill = VFill.AlignTop;
		this.root.AddItem(title);

		let replayButton = new UIButton(RestartButton, new Vec2(-250, 160), new Vec2(160, 160), function(){
			AdManager.MaybeShowAd(()=>Game.OnStartGamePressed());
		});		
		replayButton.hfill = HFill.AlignCenter;
		replayButton.vfill = VFill.AlignCenter;
		this.root.AddItem(replayButton);

		let continueButton = new UIButton(PlayButton, new Vec2(0, 160), new Vec2(160, 160), function(){
			Game.ResumeGame();
		});
		continueButton.hfill = HFill.AlignCenter;
		continueButton.vfill = VFill.AlignCenter;
		this.root.AddItem(continueButton);

		let homeButton = new UIButton(HomeButton, new Vec2(250, 160), new Vec2(160, 160), function(){
			Game.OnShowMainMenu();
		});
		homeButton.hfill = HFill.AlignCenter;
		homeButton.vfill = VFill.AlignCenter;
		this.root.AddItem(homeButton);

		// setup keyboard navigation
		replayButton.rightItem = continueButton;
		continueButton.leftItem = replayButton;
		continueButton.rightItem = homeButton;
		homeButton.leftItem = continueButton;

		this.initialFocus = continueButton;	
	}

	OnBack()
	{
		Game.ResumeGame();
	}
}

class ShopMenu extends MenuScreen
{
	constructor()
	{
		super("ShopMenu");

		const menu = this;
		let backButton = new UIButton(HomeButton, new Vec2(0, 0), new Vec2(160, 160), function(){
			menu.OnBack();
		});
		backButton.hfill = HFill.AlignLeft;
		backButton.vfill = VFill.AlignTop;
		this.root.AddItem(backButton);

		let leftButton = new UIButton(ArrowLIcon, new Vec2(200, 100), new Vec2(360, 360), function(){
			// prev ship
			let shipIdx = menu.currentShipIdx - 1;
			if(shipIdx < 0) shipIdx = AllShips.length - 1;
			menu.SetShip(shipIdx);
		});
		leftButton.hfill = HFill.AlignLeft;
		leftButton.vfill = VFill.AlignCenter;
		leftButton.drawButtonBorder = false;
		this.root.AddItem(leftButton);
		this.leftButton = leftButton;

		let rightButton = new UIButton(ArrowRIcon, new Vec2(-200, 100), new Vec2(360, 360), function(){
			// next ship
			let shipIdx = menu.currentShipIdx + 1;
			if(shipIdx >= AllShips.length) shipIdx = 0;
			menu.SetShip(shipIdx);
		});
		rightButton.hfill = HFill.AlignRight;
		rightButton.vfill = VFill.AlignCenter;
		rightButton.drawButtonBorder = false;
		this.root.AddItem(rightButton);
		this.rightButton = rightButton;

		let panel = new UIPanel(WindowPanel, new Vec2(0,50), new Vec2(1000,300));
		panel.hfill = HFill.AlignCenter;
		panel.vfill = VFill.AlignTop;
		this.root.AddItem(panel);

		// ship name
		let title = new UILabel(FontId, "", new Vec2(0, 160), 10, WhiteCol, MB.HAlign.Center);
		title.hfill = HFill.AlignCenter;
		title.vfill = VFill.AlignTop;
		this.root.AddItem(title);
		this.title = title;

		// ship stats
		let speed = new UILabel(FontId, "top speed", new Vec2(-400, 250), 6, WhiteCol, MB.HAlign.Left);
		speed.hfill = HFill.AlignCenter;
		speed.vfill = VFill.AlignTop;
		this.root.AddItem(speed);
		let handling = new UILabel(FontId, "handling", new Vec2(-400, 310), 6, WhiteCol, MB.HAlign.Left);
		handling.hfill = HFill.AlignCenter;
		handling.vfill = VFill.AlignTop;
		this.root.AddItem(handling);

		let speedBar = new UILayout();
		speedBar.pos = new Vec2(0, 220);
		speedBar.size = new Vec2(400, 30);
		speedBar.hfill = HFill.AlignCenter;
		speedBar.vfill = VFill.AlignTop;
		this.root.AddChild(speedBar);
		let spdBarBG = new UIImage(WhiteTex, new Vec2(0, 0), new Vec2(400, 20), new Vec4(0,0,0,0.5));
		spdBarBG.hfill = HFill.AlignLeft;
		spdBarBG.vfill = VFill.AlignCenter;
		speedBar.AddItem(spdBarBG);
		let spdBar = new UIImage(WhiteTex, new Vec2(0, 0), new Vec2(0, 20), WhiteRGBA);
		spdBar.hfill = HFill.AlignLeft;
		spdBar.vfill = VFill.AlignCenter;
		speedBar.AddItem(spdBar);

		let handleBar = new UILayout();
		handleBar.pos = new Vec2(0, 280);
		handleBar.size = new Vec2(400, 30);
		handleBar.hfill = HFill.AlignCenter;
		handleBar.vfill = VFill.AlignTop;
		this.root.AddChild(handleBar);
		let hndBarBG = new UIImage(WhiteTex, new Vec2(0, 0), new Vec2(400, 20), new Vec4(0,0,0,0.5));
		hndBarBG.hfill = HFill.AlignLeft;
		hndBarBG.vfill = VFill.AlignCenter;
		handleBar.AddItem(hndBarBG);
		let hndBar = new UIImage(WhiteTex, new Vec2(0, 0), new Vec2(0, 20), WhiteRGBA);
		hndBar.hfill = HFill.AlignLeft;
		hndBar.vfill = VFill.AlignCenter;
		handleBar.AddItem(hndBar);

		this.spdBar = spdBar;
		this.hndBar = hndBar;
		this.barLen = 400;

		// show 'ACTIVE' if this is the active ship
		// show lock icon & 'BUY %price%' if this ship is not owned
		// show 'SELECT' button if ship is owned but not active
		let buyButton = new UIButton(null, new Vec2(0, -50), new Vec2(400, 120), function(){
			menu.BuyOrActivateShip();
		});
		buyButton.hfill = HFill.AlignCenter;
		buyButton.vfill = VFill.AlignBottom;
		buyButton.sfx = null; // we'll do our own sfx
		this.root.AddItem(buyButton);
		this.buyButton = buyButton;

		let buyLabel = new UILabel(FontId, "", new Vec2(0, -100), 6, WhiteCol, MB.HAlign.Center);
		buyLabel.hfill = HFill.AlignCenter;
		buyLabel.vfill = VFill.AlignBottom;
		this.root.AddItem(buyLabel);
		this.buyLabel = buyLabel;

		let shopStar = new UIImage(StarIcon, new Vec2(-160,-110), new Vec2(80,80), new Vec4(0.4,0.9,0.5,1.0));
		shopStar.hfill = HFill.AlignCenter;
		shopStar.vfill = VFill.AlignBottom;
		this.root.AddItem(shopStar);
		this.shopStar = shopStar;
		shopStar.isVisible = false;

		let buyGemIcon = new UIImage(GemIcon, new Vec2(130,-72), new Vec2(80, 80), WhiteCol);
		buyGemIcon.hfill = HFill.AlignCenter;
		buyGemIcon.vfill = VFill.AlignBottom;
		this.root.AddItem(buyGemIcon);
		this.buyGemIcon = buyGemIcon;

		let gemIcon = new UIImage(GemIcon, new Vec2(-140,40), new Vec2(120, 120), WhiteCol);
		gemIcon.hfill = HFill.AlignRight;
		gemIcon.vfill = VFill.AlignTop;
		this.root.AddItem(gemIcon);

		let gemCounter = new UILabel(FontId, "", new Vec2(-140, 120), 8, WhiteCol, MB.HAlign.Left);
		gemCounter.hfill = HFill.AlignRight;
		gemCounter.vfill = VFill.AlignTop;
		this.root.AddItem(gemCounter);
		this.gemCounter = gemCounter;

		backButton.downItem = leftButton;
		leftButton.upItem = backButton;
		rightButton.upItem = backButton;
		leftButton.rightItem = rightButton;
		rightButton.leftItem = leftButton;
		rightButton.downItem = buyButton;
		leftButton.downItem = buyButton;
		buyButton.upItem = leftButton;

		this.initialFocus = backButton;	
	}

	SetShip(shipIdx)
	{
		this.currentShipIdx = shipIdx;
		const ship = AllShips[shipIdx];

		Game.player1.SetShip(ship);
		Game.player1.SetShipCol(ShipCols[shipIdx % ShipCols.length]);
		Game.triggerGlare = 1.0;

		// set title, which buttons should be acive etc.
		this.title.text = ship.name;

		const minSpd = 0.8;
		const maxSpd = 2.1;
		const minHnd = 0.92;
		const maxHnd = 1.1;
		const spdW = this.barLen * (ship.speed - minSpd) / (maxSpd - minSpd);
		const hndW = this.barLen * (ship.handling - minHnd) / (maxHnd - minHnd);

		let spdBarSize = this.spdBar.size;
		let hndBarSize = this.hndBar.size;

		Tweener.RemoveTween(this.spdTween);
		Tweener.RemoveTween(this.hndTween);
		this.spdTween = Tweener.AddTween(spdBarSize.x, spdW, 0.5, function(x) {
			spdBarSize.x = x;
		});
		this.hndTween = Tweener.AddTween(hndBarSize.x, hndW, 0.5, function(x) {
			hndBarSize.x = x;
		});

		this.buyButton.isVisible = true;
		this.buyLabel.isVisible = true;

		this.buyGemIcon.isVisible = false;
		this.shopStar.isVisible = false;

		if(!ContinuousLevels)
		{
			if(!ship.owned)
				ship.owned = Game.HighestLevel() >= ship.unlockLevel;
		}

		this.buyLabel.col = WhiteCol;
		if(shipIdx == Game.GetActiveShipIdx())
		{
			this.buyButton.isVisible = false;
			this.buyLabel.text = "ACTIVE";
		}
		else if(ship.owned)
		{
			this.buyLabel.text = "ACTIVATE";
		}
		else
		{
			if(ContinuousLevels)
			{
				this.buyLabel.text = "BUY     " + ship.price;
				this.buyGemIcon.isVisible = true;

				if(ship.price > Game.GemCount) {
					this.buyLabel.col = new Vec4(1.0, 0.3, 0.2, 1.0);
				}
				else {
					// show a star by the BUY button
					this.shopStar.isVisible = true;
				}
			}
			else
			{
				this.buyButton.isVisible = false;
				this.buyLabel.text = "Unlocks at Level " + ship.unlockLevel;
			}
		}
	}

	BuyOrActivateShip()
	{
		const ship = AllShips[this.currentShipIdx];
		if(!ship.owned)
		{
			let price = ship.price;

			if(Game.GemCount >= price)
			{
				Game.BuyShip(ship);
			}
			else
			{
				// show not enough cash dialog?
				// play bad sfx
				MB.PlaySfx(ButtonCancelSfx);
				console.log("Not enough gems");
			}
		}

		if(ship.owned)
		{
			Game.SetActiveShipIdx(this.currentShipIdx);
			this.SetShip(this.currentShipIdx);
			MB.PlaySfx(ButtonOkSfx);
		}
	}

	OnAboutToShow()
	{
		this.SetShip(Game.GetActiveShipIdx());

		this.gemCounter.text = Game.GemCount.toString();
		Tweener.AddTween(0.0, 1.0, 0.5, function(x){
			Game.shipFocus = x;
		});

		this.animTimer = 0.0;
	}

	WhileOpen(dT)
	{
		// update gem count
		this.gemCounter.text = Game.GemCount.toString();

		if(MB.WasKeyPressed('a'))
			this.leftButton.OnClicked();
		if(MB.WasKeyPressed('d'))
			this.rightButton.OnClicked();

		// animate star on shop button
		this.animTimer += dT;
		this.shopStar.scale = 1.0 + 0.05 * Math.sin(this.animTimer * 10);
	}

	OnBack()
	{
		// set the correct ship for playing.
		Game.player1.SetShip(AllShips[Game.GetActiveShipIdx()]);

		super.OnBack();
		Tweener.AddTween(1.0, 0.0, 0.5, function(x){
			Game.shipFocus = x;
		});
	}
}

// low lod models for raycasts

function RotatePosition(pos, sinR, cosR)
{
	// rotate position about z-axis
	return new Vec3(pos.x * cosR - pos.y * sinR, pos.y * cosR + pos.x * sinR, pos.z);
}

// back and forth (triangle)
const CurveTri = new AnimCurve([new Vec2(0,0), new Vec2(0.5, 1), new Vec2(1,0)]);
// saw-tooth
const CurveSaw = new AnimCurve([new Vec2(0,0), new Vec2(1, 1)]);
// back and forth with delay
const CurveSqr = new AnimCurve([new Vec2(0,0), new Vec2(0.3, 0), new Vec2(0.5, 1), new Vec2(0.8,1), new Vec2(1.0, 0)]);
// surprise!
const CurveSurprise = new AnimCurve([new Vec2(0,0), new Vec2(0.4, 1), new Vec2(0.7, 1), new Vec2(0.8, 0), new Vec2(1.0, 0)]);
const CurveSine = new AnimCurve([new Vec2(0,0), new Vec2(0.25, 1), new Vec2(0.5, 0), new Vec2(0.75, -1), new Vec2(1,0)]);

const SideWidth = 22;

class Generator
{
	static CreateTrigger(zPos, col)
	{
		Game.allTriggers.push(new Trigger(zPos, col));
	}

	static CreateEndTrigger(zPos)
	{
		Game.allTriggers.push(new Trigger(zPos, EndTrigger));
	}

	static CreateGemSection(zPos, doDouble, doSwirl)
	{
		let z = 0;
		let angle = 90 * Math.floor(MB.Random01() * 4);
		let angleInc = doSwirl ? (MB.Random01() < 0.5 ? -18 : 18) : 0;
		for(let i=0; i<10; ++i)
		{
			Game.allTriggers.push(new Gem(zPos + z, angle));
			Game.allTriggers.push(new Gem(zPos + z, angle + 180));
			if(doDouble)
			{
				Game.allTriggers.push(new Gem(zPos + z, angle + 90));
				Game.allTriggers.push(new Gem(zPos + z, angle + 270));
			}

			z += 15;
			angle += angleInc;
		}

		return z;
	}

	static CreateBoost(zPos, angle)
	{
		if(!angle)
			angle = 90 * Math.floor(MB.Random01() * 4);

		const booster = new Booster(zPos + 25, angle);
		Game.allTriggers.push(booster);

		return 50;
	}

	static CreateSide1(zPos, mesh, col)
	{
		let mat = ObstacleMats[col];
		const rot =  Quat.Identity();
		const scale =  new Vec3(1,1,1);

		let xPos = -SideWidth * MB.Random01();
		let spacing = SideWidth * (0.5 + 0.5 * MB.Random01());

		let mesh1 = new Node(zPos, mesh, mat, new Vec3(xPos, 0, 0), rot, scale);
		let mesh2 = new Node(zPos, mesh, mat, new Vec3(xPos + spacing, 0, 0), rot, scale);
		Game.allObstacles.push(mesh1);
		Game.allObstacles.push(mesh2);

		Game.allTriggers.push(new Gem(zPos, xPos + spacing * (0.25 + 0.5 * MB.Random01())));
	}

	static CreateSide2(zPos, mesh, col, move)
	{
		let mat = ObstacleMats[col];
		const rot =  Quat.Identity();
		const scale1 = 0.75 + 1.5 * MB.Random01();
		const scale2 = 0.75 + 1.5 * MB.Random01();
		const yPos = move ? -6 : -10;

		let xPos = -SideWidth * MB.Random01();
		let spacing = SideWidth * (0.5 + 0.5 * MB.Random01());

		let mesh1 = new Node(zPos, mesh, mat, new Vec3(xPos, yPos, 0), rot, new Vec3(scale1, scale1, scale1));
		let mesh2 = new Node(zPos, mesh, mat, new Vec3(xPos + spacing, yPos, 0), rot, new Vec3(scale2, scale2, scale2));
		Game.allObstacles.push(mesh1);
		Game.allObstacles.push(mesh2);

		if(move)
		{
			const yDir = Vec3.Up();
			Game.allUpdaters.push(new Mover(zPos, [mesh1], 0.5 + 0.5 * MB.Random01(), 2, CurveSine, yDir, true));
			Game.allUpdaters.push(new Mover(zPos, [mesh2], 0.5 + 0.5 * MB.Random01(), 2, CurveSine, yDir, true));
		}
	}

	static CreateSide3(zPos, mesh, col)
	{
		let mat = ObstacleMats[col];
		const rot =  Quat.Identity();
		const scale1 = 0.75 + 1.5 * MB.Random01();
		const scale2 = 0.75 + 1.5 * MB.Random01();
		const yPos = -6;

		let xPos = -SideWidth * MB.Random01();
		let spacing = SideWidth * (0.5 + 0.5 * MB.Random01());

		let mesh1 = new Node(zPos, mesh, mat, new Vec3(xPos, yPos, 0), rot, new Vec3(scale1, scale1, scale1));
		let mesh2 = new Node(zPos, mesh, mat, new Vec3(xPos + spacing, yPos, 10), rot, new Vec3(scale2, scale2, scale2));
		Game.allObstacles.push(mesh1);
		Game.allObstacles.push(mesh2);

		const yDir = Vec3.Up();
		Game.allUpdaters.push(new Mover(zPos, [mesh1], 0.5 + 0.5 * MB.Random01(), 2, CurveSine, yDir, true));
		Game.allUpdaters.push(new Mover(zPos, [mesh2], 0.5 + 0.5 * MB.Random01(), 2, CurveSine, yDir, true));
	}

	static CreateSideEdge(zPos, mesh, col)
	{
		let mat = ObstacleMats[col];
		const rot =  Quat.Identity();
		const scale =  new Vec3(1,1,1);

		let mesh1 = new Node(zPos, mesh, mat, new Vec3(-SideWidth, 0, 0), rot, scale);
		let mesh2 = new Node(zPos, mesh, mat, new Vec3(SideWidth, 0, 10), rot, scale);
		Game.allObstacles.push(mesh1);
		Game.allObstacles.push(mesh2);
	}

	static CreateRing360(zPos, col1, col2, rot)
	{
		let mat1 = ObstacleMats[col1];
		let mat2 = ObstacleMats[col2];
		const scale =  new Vec3(1,1,1);
		const zero =  new Vec3(0,0,0);

		for(let i=0; i<2; ++i)
		{
			let segment1 = new Node(zPos, RingSection90, mat1, zero, Quat.FromAxisAngle(Vec3.Forward(), rot + 180*i), scale);
			let segment2 = new Node(zPos, RingSection90, mat2, zero, Quat.FromAxisAngle(Vec3.Forward(), rot + 180*i + 90), scale);
			Game.allObstacles.push(segment1);
			Game.allObstacles.push(segment2);
		}
	}

	static Create2RingA(zPos, col1, col2, rot)
	{
		let mat1 = ObstacleMats[col1];
		let mat2 = ObstacleMats[col2];
		const scale =  new Vec3(1,1,1);
		const zero =  new Vec3(0,0,0);

		for(let i=0; i<3; ++i)
		{
			let segment1 = new Node(zPos, RingSection60, mat1, zero, Quat.FromAxisAngle(Vec3.Forward(), rot + 120*i), scale);
			let segment2 = new Node(zPos+0.1, RingSection30, mat2, zero, Quat.FromAxisAngle(Vec3.Forward(), rot + 135 + 120*i), scale);
			Game.allObstacles.push(segment1);
			Game.allObstacles.push(segment2);
		}
	}

	static Create2RingB(zPos, col1, col2, rot)
	{
		let mat1 = ObstacleMats[col1];
		let mat2 = ObstacleMats[col2];
		const scale =  new Vec3(1,1,1);
		const zero =  new Vec3(0,0,0);

		for(let i=0; i<2; ++i)
		{
			let segment1 = new Node(zPos, RingSection90, mat1, zero, Quat.FromAxisAngle(Vec3.Forward(), 90 + rot + 180*i), scale);
			let segment2 = new Node(zPos, RingSection60, mat2, zero, Quat.FromAxisAngle(Vec3.Forward(), rot + 180*i), scale);
			let segment3 = new Node(zPos, RingSection30, mat1, zero, Quat.FromAxisAngle(Vec3.Forward(), rot + 180*i), scale);
			Game.allObstacles.push(segment1);
			Game.allObstacles.push(segment2);
			Game.allObstacles.push(segment3);
		}
	}

	static Create2RingCyl(zPos, col1, col2, rot)
	{
		const scale = new Vec3(1.1,1.1,1.1);
		const quat = Quat.FromAxisAngle(Vec3.Forward(), rot);
		const pos = Vec3.Zero();

		let mat1 = ObstacleMats[col1];
		let mat2 = ObstacleMats[col2];

		const sinR = Math.sin(rot * DegToRad);
		const cosR = Math.cos(rot * DegToRad);

		let segment1 = new Node(zPos, RingSection90, mat1, pos, Quat.FromAxisAngle(Vec3.Forward(), rot + 45), scale);
		let segment2 = new Node(zPos, RingSection90, mat1, pos, Quat.FromAxisAngle(Vec3.Forward(), rot + 225), scale);
		let cyl1 = new Node(zPos, Cylinder, mat2, RotatePosition(new Vec3(-2.2, 0,0), sinR, cosR), quat, scale);
		let cyl2 = new Node(zPos, Cylinder, mat2, RotatePosition(new Vec3(2.2, 0,0), sinR, cosR), quat, scale);
		Game.allObstacles.push(segment1);
		Game.allObstacles.push(segment2);
		Game.allObstacles.push(cyl1);
		Game.allObstacles.push(cyl2);
	}

	static Create2RingCyl2(zPos, col1, col2, rot)
	{
		const scale =  Vec3.One();
		const pos = Vec3.Zero();

		let mat1 = ObstacleMats[col1];
		let mat2 = ObstacleMats[col2];

		const sinR = Math.sin(rot * DegToRad);
		const cosR = Math.cos(rot * DegToRad);

		let segment1 = new Node(zPos, RingSection60, mat1, pos, Quat.FromAxisAngle(Vec3.Forward(), rot + 60), scale);
		let segment2 = new Node(zPos, RingSection60, mat1, pos, Quat.FromAxisAngle(Vec3.Forward(), rot + 60 + 90), scale);
		let segment3 = new Node(zPos, RingSection60, mat1, pos, Quat.FromAxisAngle(Vec3.Forward(), rot + 60 + 180), scale);
		let segment4 = new Node(zPos, RingSection60, mat1, pos, Quat.FromAxisAngle(Vec3.Forward(), rot + 60 - 90), scale);
		let cyl1 = new Node(zPos, Cylinder, mat2, pos, Quat.FromAxisAngle(Vec3.Forward(), rot + 45), scale);
		let cyl2 = new Node(zPos, Cylinder, mat2, pos, Quat.FromAxisAngle(Vec3.Forward(), rot + 135), scale);
		Game.allObstacles.push(segment1);
		Game.allObstacles.push(segment2);
		Game.allObstacles.push(segment3);
		Game.allObstacles.push(segment4);
		Game.allObstacles.push(cyl1);
		Game.allObstacles.push(cyl2);
	}
/*	static Create4Ring(zPos, col1, col2, rot)
	{
		const scale =  Vec3.One();
		let cols = [ColRed, ColBlue, ColRed, ColRed];
		let rings = [];
		for(let i=0; i<4; ++i)
		{
			rings[i] = new Node(zPos + 10 * i, RingSection1, ObstacleMats[cols[i]], Vec3.Zero(), Quat.FromAxisAngle(Vec3.Forward(), rot + 90*i), scale);
			Game.allObstacles.push(rings[i]);
		}

		Game.allUpdaters.push(new Rotator(zPos, rings, Vec3.Forward(), null));
	} */

	static CreateCyl1(zPos, col1, col2, rot)
	{
		const scale =  Vec3.One();
		const scale2 = new Vec3(2,1,2);
		const quat = Quat.FromAxisAngle(Vec3.Forward(), rot);

		let mat1 = ObstacleMats[col1];
		let mat2 = ObstacleMats[col2];

		const sinR = Math.sin(rot * DegToRad);
		const cosR = Math.cos(rot * DegToRad);

		let cyl1 = new Node(zPos, Cylinder, mat1, RotatePosition(new Vec3(7,0,0), sinR, cosR), quat, scale);
		let cyl2 = new Node(zPos, Cylinder, mat1, RotatePosition(new Vec3(-7,0,0), sinR, cosR), quat, scale);
		let bigcyl = new Node(zPos, Cylinder, mat2, new Vec3(0,0,0), quat, scale2);
		Game.allObstacles.push(cyl1);
		Game.allObstacles.push(cyl2);
		Game.allObstacles.push(bigcyl);
	}

	static CreateSphere90(zPos, col1, col2, rot)
	{
		const scale =  new Vec3(3,3,3);
		const quat = Quat.Identity();

		let mat1 = ObstacleMats[col1];
		let mat2 = ObstacleMats[col2];

		for(let i=0; i<4; ++i)
		{
			let angle = rot + 90 * i;
			const sinR = Math.sin(angle * DegToRad);
			const cosR = Math.cos(angle * DegToRad);

			const mat = i%2 == 0 ? mat1 : mat2;

			let sphere = new Node(zPos, IcoSphere, mat, RotatePosition(new Vec3(9,0,0), sinR, cosR), quat, scale);
			Game.allObstacles.push(sphere);
		}
	}

	static CreateSpikes(zPos, col1, col2, rot)
	{
		const scale =  new Vec3(1,0.6,1);

		let mat1 = ObstacleMats[col1];
		let mat2 = ObstacleMats[col2];
		const spacing = 10;
		for(let i=0; i<6; ++i)
		{
			let angle = rot + 60 * i;
			const sinR = Math.sin(angle * DegToRad);
			const cosR = Math.cos(angle * DegToRad);
			const quat = Quat.FromAxisAngle(Vec3.Forward(), angle);
			const quat2 = Quat.FromAxisAngle(Vec3.Forward(), angle + 180);

			const mat = i%3 == 0 ? mat1 : mat2;

			let spike1 = new Node(zPos + spacing * i, Cone, mat, RotatePosition(new Vec3(0, -10, 0), sinR, cosR), quat, scale);
			let spike2 = new Node(zPos + spacing * i, Cone, mat, RotatePosition(new Vec3(0, 10, 0), sinR, cosR), quat2, scale);
			Game.allObstacles.push(spike1);
			Game.allObstacles.push(spike2);
		}

		return spacing * 6; // length of block
	}

	static CreateRingsRot1(zPos, col1, col2, rot, ccw)
	{
		const scale =  Vec3.One();
		const pos = Vec3.Zero();

		let mat1 = ObstacleMats[col1];
		let mat2 = ObstacleMats[col2];

		let segment1 = new Node(zPos, RingSection90, mat1, pos, Quat.FromAxisAngle(Vec3.Forward(), rot), scale);
		let segment2 = new Node(zPos, RingSection90, mat1, pos, Quat.FromAxisAngle(Vec3.Forward(), rot + 180), scale);
		let segment3 = new Node(zPos, RingSection90, mat2, pos, Quat.FromAxisAngle(Vec3.Forward(), rot + 90), scale);
		let segment4 = new Node(zPos, RingSection90, mat2, pos, Quat.FromAxisAngle(Vec3.Forward(), rot + 270), scale);
		Game.allObstacles.push(segment1);
		Game.allObstacles.push(segment2);
		Game.allObstacles.push(segment3);
		Game.allObstacles.push(segment4);

		Game.allUpdaters.push(new RotateRelative(zPos, [segment1,segment2,segment3,segment4], 0.25, ccw ? -180 : 180, CurveSaw));
	}
	
	static CreateRingsRot2(zPos, col1, col2, rot)
	{
		Generator.CreateRingsRot1(zPos, col1, col2, rot, true);
	}

	static CreateRingsRot3(zPos, col1, col2, rot)
	{
		const scale =  Vec3.One();
		const quat = Quat.FromAxisAngle(Vec3.Forward(), rot);
		const pos = Vec3.Zero();

		let mat1 = ObstacleMats[col1];
		let mat2 = ObstacleMats[col2];

		let segment1 = new Node(zPos, RingSection60, mat1, pos, Quat.FromAxisAngle(Vec3.Forward(), rot + 60), scale);
		let segment2 = new Node(zPos, RingSection60, mat1, pos, Quat.FromAxisAngle(Vec3.Forward(), rot + 240), scale);
		let cyl1 = new Node(zPos, Cylinder, mat2, pos, quat, scale);
		Game.allObstacles.push(segment1);
		Game.allObstacles.push(segment2);
		Game.allObstacles.push(cyl1);

		Game.allUpdaters.push(new RotateRelative(zPos, [segment1], 1.5, 20, CurveSine));
		Game.allUpdaters.push(new RotateRelative(zPos, [segment2], 1.5, -20, CurveSine));
	}

	static CreateSlabs1(zPos, col1, col2, rot)
	{
		const scale =  Vec3.One();
		const quat = Quat.FromAxisAngle(Vec3.Forward(), rot);
		const pos = Vec3.Zero();

		let mat1 = ObstacleMats[col1];
		let mat2 = ObstacleMats[col2];

		const sinR = Math.sin(rot * DegToRad);
		const cosR = Math.cos(rot * DegToRad);

		let slab1 = new Node(zPos, Slab, mat1, RotatePosition(new Vec3(-16, 0, 0), sinR, cosR), quat, scale);
		let slab2 = new Node(zPos, Slab, mat1, RotatePosition(new Vec3(16, 16, 0), sinR, cosR), quat, scale);
		let segment1 = new Node(zPos, RingSection90, mat2, pos, Quat.FromAxisAngle(Vec3.Forward(), rot), scale);
		let segment2 = new Node(zPos, RingSection90, mat2, pos, Quat.FromAxisAngle(Vec3.Forward(), rot + 180), scale);
		Game.allObstacles.push(slab1);
		Game.allObstacles.push(slab2);
		Game.allObstacles.push(segment1);
		Game.allObstacles.push(segment2);
	}
	
	static CreateSlabs2(zPos, col1, col2, rot)
	{
		const scale =  new Vec3(0.5,1,1);
		const quat = Quat.FromAxisAngle(Vec3.Forward(), rot);

		let mat1 = ObstacleMats[col1];
		let mat2 = ObstacleMats[col2];

		const sinR = Math.sin(rot * DegToRad);
		const cosR = Math.cos(rot * DegToRad);
		const xDir = RotatePosition(Vec3.Right(), sinR, cosR);

		let slabsTop = [];
		slabsTop[0] = new Node(zPos, Slab, mat1, RotatePosition(new Vec3(-8, -2, 0), sinR, cosR), quat, scale);
		slabsTop[1] = new Node(zPos, Slab, mat2, RotatePosition(new Vec3(8, -2, 0), sinR, cosR), quat, scale);
		slabsTop[2] = new Node(zPos, Slab, mat1, RotatePosition(new Vec3(24, -2, 0), sinR, cosR), quat, scale);
		Game.allObstacles.push(slabsTop[0]);
		Game.allObstacles.push(slabsTop[1]);
		Game.allObstacles.push(slabsTop[2]);

		let slabsBot = [];
		slabsBot[0] = new Node(zPos, Slab, mat1, RotatePosition(new Vec3(-24, 18, 0), sinR, cosR), quat, scale);
		slabsBot[1] = new Node(zPos, Slab, mat2, RotatePosition(new Vec3(-8, 18, 0), sinR, cosR), quat, scale);
		slabsBot[2] = new Node(zPos, Slab, mat1, RotatePosition(new Vec3(8, 18, 0), sinR, cosR), quat, scale);
		Game.allObstacles.push(slabsBot[0]);
		Game.allObstacles.push(slabsBot[1]);
		Game.allObstacles.push(slabsBot[2]);

		Game.allUpdaters.push(new Mover(zPos, slabsTop, 0.25, -16, CurveSaw, xDir, true));
		Game.allUpdaters.push(new Mover(zPos, slabsBot, 0.25, 16, CurveSaw, xDir, true));
	}

	static CreateLoops1(zPos, col1, col2, rot)
	{
		const scale =  new Vec3(1.8,1.8,1);
		const quat = Quat.FromAxisAngle(Vec3.Forward(), rot);

		let mat1 = ObstacleMats[col1];
		let mat2 = ObstacleMats[col2];

		const sinR = Math.sin(rot * DegToRad);
		const cosR = Math.cos(rot * DegToRad);

		let segment1 = new Node(zPos+0.1, Loop, mat1, RotatePosition(new Vec3(-20, 0, 5), sinR, cosR), quat, scale);
		let segment2 = new Node(zPos, Loop, mat2, RotatePosition(new Vec3(-12, 0, -5), sinR, cosR), quat, scale);
		let segment3 = new Node(zPos+0.1, Loop, mat1, RotatePosition(new Vec3(12, 0, 5), sinR, cosR), quat, scale);
		let segment4 = new Node(zPos, Loop, mat2, RotatePosition(new Vec3(20, 0, 5), sinR, cosR), quat, scale);
		Game.allObstacles.push(segment1);
		Game.allObstacles.push(segment2);
		Game.allObstacles.push(segment3);
		Game.allObstacles.push(segment4);
	}

	static CreateLoops2(zPos, col1, col2, rot)
	{
		const scale1 =  new Vec3(1.8,1.8,1);
		const scale2 = Vec3.One();
		const quat = Quat.FromAxisAngle(Vec3.Forward(), rot);
		const pos = Vec3.Zero();

		let mat1 = ObstacleMats[col1];
		let mat2 = ObstacleMats[col2];

		const sinR = Math.sin(rot * DegToRad);
		const cosR = Math.cos(rot * DegToRad);
		const xDir = RotatePosition(Vec3.Right(), sinR, cosR);

		let segment1 = new Node(zPos, Loop, mat1, RotatePosition(new Vec3(-12, 0, 5), sinR, cosR), quat, scale1);
		let segment2 = new Node(zPos+0.1, Loop, mat1, RotatePosition(new Vec3(12, 0, -5), sinR, cosR), quat, scale1);
		let tri1 = new Node(zPos, Triangle, mat2, pos, Quat.FromAxisAngle(Vec3.Forward(), rot + 90), scale2);
		let tri2 = new Node(zPos+0.1, Triangle, mat2, pos, Quat.FromAxisAngle(Vec3.Forward(), rot - 90), scale2);
		Game.allObstacles.push(segment1);
		Game.allObstacles.push(segment2);
		Game.allObstacles.push(tri1);
		Game.allObstacles.push(tri2);

		Game.allUpdaters.push(new Mover(zPos, [tri1], 0.4, 10, CurveSurprise, xDir, true));
		Game.allUpdaters.push(new Mover(zPos, [tri2], 0.4, -10, CurveSurprise, xDir, true));
		Game.allUpdaters.push(new Mover(zPos, [segment1], 0.5, 6, CurveTri, xDir, true));
		Game.allUpdaters.push(new Mover(zPos, [segment2], 0.5, -6, CurveTri, xDir, true));
	}
}

class Levels
{
	static GenerateLevel(levelIdx)
	{
		const DebugSectionFunc = null;//Generator.Create2RingB;

		MB.RandomSetSeed(levelIdx * 12345);

		var sideMode = false;

		if(sideMode)
		{
			Game.initialShipCol = ColRed;
			Game.tunnelMesh = TunnelWide;
			Game.controlMode = Control_SideToSide;

			BendAmpX = 0;
			BendAmpY = 20;

			for(let z = 50; z < 800; z += 60)
			{
				Generator.CreateSide1(z, Cylinder, ColBlue);
			}
			for(let z = 70; z < 800; z += 160)
			{
				Generator.CreateSideEdge(z, Cylinder, ColGreen);
			}
			// for(let z = 650; z < 1000; z += 40)
			// {
			// 	Generator.CreateSide2(z, IcoSphere, ColYellow, true);
			// }
			// for(let z = 670; z < 1000; z += 160)
			// {
			// 	Generator.CreateSideEdge(z, Cylinder, ColGreen);
			// }

			for(let z = 1000; z < 1400; z += 50)
			{
				Generator.CreateSide2(z, Cone, ColBlue, false);
			}
			for(let z = 1000; z < 1400; z += 100)
			{
				Generator.CreateSideEdge(z, Cylinder, ColGreen);
			}

			return 2000;
		}

		Game.controlMode = Control_Rotate;
		if(DebugSectionFunc)
		{
			Game.initialShipCol = ColBlue;
			Game.tunnelMesh = Tunnel6Side;
			Levels.GenerateLevelSectionSpiral(ColBlue, ColRed, DebugSectionFunc, 150, 100, 20, 4);
			return 10000;
		}

		let distanceToEnd = 0;
		if(levelIdx == 0)
		{
			distanceToEnd = Levels.GenerateLevel0();
		}
		else if(levelIdx == 1)
		{
			distanceToEnd = Levels.GenerateLevel1();
		}
		else
		{
			const levelFuncs = [Levels.GenerateCircleLevel,
								Levels.Generate6SideLevel,
//								Levels.Generate5SideLevel,
								Levels.GenerateCircleLevel,
								Levels.Generate4SideLevel];

			// generate normal level of some kind
			distanceToEnd = levelFuncs[levelIdx % levelFuncs.length](levelIdx);
		}

		return distanceToEnd;
	}

	static GenerateLevelSectionRnd(col1, col2, sectionFuncs, zPos, length, rotCount)
	{
		let z = 0;
		let defaultSpacing = 100;
		while (z < length)
		{
			let generateFunc = RandomItem(sectionFuncs);
			let rot = (360 / rotCount) * Math.floor(MB.Random01() * rotCount);
			let len = generateFunc(zPos + z, col1, col2, rot);
			z += (len || 0) + defaultSpacing;
		}

		return z;
	}

	static GenerateLevelSectionSpiral(col1, col2, sectionFunc, zPos, spacing, sectionCount, rotCount)
	{
		let z = 0;
		for(let i=0; i<sectionCount; ++i)
		{
			let rot = (360 / rotCount) * i;
			let len = sectionFunc(zPos + z, col1, col2, rot);
			z += (len || 0) + spacing;
		}

		return z;
	}

	static GenerateLevelSectionRepeat(col1, col2, sectionFunc, zPos, sectionCount)
	{
		let z = 0;
		const spacing = 20;
		const rot = 0;
		const currentUpdaterCount = Game.allUpdaters.length;
		for(let i=0; i<sectionCount; ++i)
		{
			let len = sectionFunc(zPos + z, col1, col2, rot);
			z += (len || 0) + spacing;

			// don't create close repeats of moving sections - it's too hard.
			if(Game.allUpdaters.length != currentUpdaterCount)
				break;
		}

		return z;
	}

	static GenerateLevelSectionOffset90(col1, col2, sectionFunc, zPos, rotOffset)
	{
		let z = 0;
		const spacing = 75;
		let rot1 = Math.floor(8*MB.Random01());
		let rot2 = MB.Random01() < 0.5 ? rot1 - 1 : rot1 + 1;

		let len = sectionFunc(zPos + z, col1, col2, rot1 * rotOffset);
		z += (len || 0) + spacing;
		len = sectionFunc(zPos + z, col1, col2, rot2 * rotOffset);
		z += (len || 0) + spacing;

		if(MB.Random01() < 0.4)
		{
			len = sectionFunc(zPos + z, col1, col2, rot1 * rotOffset);
			z += (len || 0) + spacing;
		}

		return z;
	}

	static GenerateLevelSectionSwapCols(col1, col2, sectionFunc, zPos)
	{
		let z = 0;
		const spacing = 75;

		let len = sectionFunc(zPos + z, col1, col2, 0);
		z += (len || 0) + spacing;
		len = sectionFunc(zPos + z, col2, col1, 0);
		z += (len || 0) + spacing;

		if(MB.Random01() < 0.4)
		{
			len = sectionFunc(zPos + z, col1, col2, 0);
			z += (len || 0) + spacing;
		}

		return z;
	}

	static GenerateLevel0()
	{
		Game.initialShipCol = ColBlue;
		Game.tunnelMesh = TunnelSmooth;

		Generator.CreateRing360(150, ColBlue, ColBlue, 0);
		Generator.Create2RingA(300, ColBlue, ColRed, 0);
		Generator.Create2RingA(450, ColBlue, ColRed, 45);

		Generator.CreateTrigger(600, ColRed);

		Generator.CreateRing360(750, ColRed, ColRed, 0);
		Generator.Create2RingA(900, ColRed, ColBlue,  0);
		Generator.Create2RingA(1000, ColRed, ColBlue, 45);
		Generator.Create2RingA(1100, ColRed, ColBlue, 0);

		Generator.CreateTrigger(1200, ColYellow);

		Generator.CreateRing360(1350, ColRed, ColYellow, 0);
		Generator.Create2RingA(1500, ColYellow, ColBlue,  0);
		Generator.Create2RingA(1600, ColRed, ColYellow, 45);
		Generator.Create2RingA(1700, ColYellow, ColBlue, 0);

		Generator.CreateGemSection(1800, true, false);

		const triggerPos = 2000;
		Generator.CreateEndTrigger(triggerPos);
		return triggerPos;
	}

	static GenerateLevel1()
	{
		Game.initialShipCol = ColGreen;
		Game.tunnelMesh = Tunnel6Side;

		let z = 0;
		Generator.CreateSlabs1(z + 150, ColGreen, ColBlue, 0);
		Generator.CreateSphere90(z + 300, ColGreen, ColBlue, 0);
		Generator.CreateSlabs1(z + 450, ColGreen, ColBlue, 45);
		z += 600;

		Generator.CreateBoost(z, 0);
		Generator.CreateBoost(z, 90);
		Generator.CreateBoost(z, 180);
		Generator.CreateBoost(z, -90);
		Generator.CreateTrigger(z + 50, ColRed);
		z += 200;

		Generator.CreateLoops1(z + 20, ColRed, ColYellow, 0);
		Generator.CreateSlabs1(z + 140, ColRed, ColYellow,  0);
		Generator.CreateSlabs1(z + 260, ColRed, ColYellow, 45);
		z += 380;

		z += Generator.CreateGemSection(z, true, true);
		Generator.CreateTrigger(z + 50, ColYellow);
		z += 200;

		Generator.Create2RingCyl(z + 20, ColYellow, ColBlue, 0);
		Generator.CreateSphere90(z + 140, ColYellow, ColBlue,  0);
		Generator.CreateLoops1(z + 260, ColYellow, ColBlue, 45);
		Generator.CreateSphere90(z + 380, ColYellow, ColBlue, 0);
		z += 500;

		Generator.CreateTrigger(z + 50, ColRed);
		z += 200;

		Generator.CreateLoops1(z + 20, ColRed, ColGreen, 0);
		Generator.CreateSlabs1(z + 140, ColRed, ColGreen,  0);
		Generator.CreateSlabs1(z + 260, ColRed, ColGreen, 45);
		Generator.CreateSlabs1(z + 380, ColRed, ColGreen, 0);
		z += 500;

		z += Generator.CreateGemSection(z, true, false);
		const triggerPos = z + 20;
		Generator.CreateEndTrigger(triggerPos);
		return triggerPos;	
	}

	static GenerateCircleLevel(levelIdx)
	{
		Game.initialShipCol = ColBlue;
		Game.tunnelMesh = TunnelSmooth;

		const levelLength = 2500 + 2500 * Math.min(1.0, levelIdx / 10);

		let allBlocks = [
			Generator.CreateRing360,
			Generator.Create2RingA,
			Generator.Create2RingCyl,
		];

		if(levelIdx > 1)
		{
			allBlocks.push(Generator.Create2RingB);
			allBlocks.push(Generator.CreateCyl1);
			allBlocks.push(Generator.CreateSphere90);
			allBlocks.push(Generator.CreateSpikes);
		}
		if(levelIdx > 5)
		{
			allBlocks.push(Generator.CreateRingsRot1);
			allBlocks.push(Generator.CreateRingsRot2);
			allBlocks.push(Generator.CreateRingsRot3);
			allBlocks.push(Generator.CreateSlabs1);
		}

		return Levels.GenerateLevelProcedural(levelIdx, allBlocks, levelLength, 8);
	}

	static Generate4SideLevel(levelIdx)
	{
		Game.initialShipCol = ColYellow;
		Game.tunnelMesh = Tunnel4Side;

		const levelLength = 2500 + 2500 * Math.min(1.0, levelIdx / 10);

		let allBlocks = [
			Generator.CreateSlabs1,
			Generator.CreateSphere90,
			Generator.CreateLoops1,
		];

		if(levelIdx > 4)
		{
			allBlocks.push(Generator.CreateSlabs2);
			allBlocks.push(Generator.CreateLoops2);
			allBlocks.push(Generator.Create2RingCyl);
			allBlocks.push(Generator.Create2RingCyl2);
		}

		return Levels.GenerateLevelProcedural(levelIdx, allBlocks, levelLength, 4);
	}

	static Generate5SideLevel(levelIdx)
	{
		Game.initialShipCol = ColRed;
		Game.tunnelMesh = Tunnel5Side;

		const levelLength = 2500 + 2500 * Math.min(1.0, levelIdx / 10);

		let allBlocks = [
			Generator.CreateRing360,
			Generator.Create2RingA,
			Generator.Create2RingB,
			Generator.CreateCyl1,
			Generator.CreateSphere90,
			Generator.CreateSpikes
		];

		return Levels.GenerateLevelProcedural(levelIdx, allBlocks, levelLength, 5);
	}

	static Generate6SideLevel(levelIdx)
	{
		Game.initialShipCol = ColGreen;
		Game.tunnelMesh = Tunnel6Side;

		const levelLength = 2500 + 2500 * Math.min(1.0, levelIdx / 10);

		let allBlocks = [
			Generator.CreateSlabs1,
			Generator.CreateSphere90,
			Generator.CreateLoops1,
			Generator.Create2RingCyl,
		];

		if(levelIdx > 5)
		{
			allBlocks.push(Generator.CreateSlabs2);
			allBlocks.push(Generator.CreateLoops2);
			allBlocks.push(Generator.Create2RingCyl2);
			allBlocks.push(Generator.CreateSphere90);
		}

		return Levels.GenerateLevelProcedural(levelIdx, allBlocks, levelLength, 6);
	}

	static GenerateLevelProcedural(levelIdx, allBlocks, levelLength, rotCount)
	{
		// make sure we have at least 5 blocks, otherwise things break.
		let extraNeeded = 5 - allBlocks.length;
		for(var i=0; i < extraNeeded; ++i)
			allBlocks.push(allBlocks[i]);

		Shuffle(allBlocks);
		const spiralBlock = allBlocks[0];
		const repeatBlock = allBlocks[3];
		const randomBlocks1 = [ allBlocks[1], allBlocks[2] ];
		const randomBlocks2 = [ allBlocks[3], allBlocks[4] ];

		let currentCol = Game.initialShipCol;

		let spiralCW = MB.Random01() < 0.5;

		let doBoost = levelIdx % 2 == 0;

		let z = 200; // initial distance before any obstacles
		while(z < levelLength)
		{
			let otherCol = RandomItem(OtherCols[currentCol]);
			let sectionLength = 500 + 500 * MB.Random01();

			const swapCols = MB.Random01() < 0.3;

			const col1 = swapCols ? otherCol : currentCol;
			const col2 = swapCols ? currentCol : otherCol;

			const doSpecial = MB.Random01() < 0.3;

			if(doSpecial)
			{
				const sectionType = Math.floor(MB.Random01() * 4);

				// generate a spiral or random section
				if(sectionType == 0 && levelIdx > 2)
				{
					// repeat same section in quick succession
					const numObstacles = 4 + 4 * MB.Random01();
					z += Levels.GenerateLevelSectionRepeat(col1, col2, repeatBlock, z, numObstacles);
				}
				else if(sectionType == 1)
				{
					// create spiral of same section
					const spacing = 100 + 40 * MB.Random01();
					rotCount = spiralCW ? rotCount : -rotCount;
					spiralCW = !spiralCW; // flip spin dir for next spiral
					const numObstacles = 2 + 4 * MB.Random01();
					z += Levels.GenerateLevelSectionSpiral(col1, col2, spiralBlock, z, spacing, numObstacles, rotCount);
				}
				else if(sectionType == 2)
				{
					// rock one section back and forth
					const rotAngle = 360 / rotCount;
					const rotOffset = rotCount > 5 ? 2 * rotAngle : rotAngle;
					z += Levels.GenerateLevelSectionOffset90(col1, col2, allBlocks[2], z, rotOffset);
				}
				else //if(sectionType == 3)
				{
					// swap cols on one section
					z += Levels.GenerateLevelSectionSwapCols(col1, col2, allBlocks[3], z);
				}
			}
			else
			{
				const spacing = 90 + 30 * MB.Random01();
			//	const rotCount = Math.floor(6 + 3 * MB.Random01());
				const blocks = (MB.Random01() < 0.5) ? randomBlocks1 : randomBlocks2;
				z += Levels.GenerateLevelSectionRnd(col1, col2, blocks, z, spacing, sectionLength, rotCount)
			}

			if(MB.Random01() < 0.4)
			{
				// do some gems
				z += Generator.CreateGemSection(z, false, MB.Random01() < 0.5);
			}
			else if(doBoost)
			{
				if(z < levelLength - 500) // don't create a boost near the end of the level
				{
					let rnd = MB.Random01();
					if(rnd < 0.3) {
						Generator.CreateBoost(z, 0);
						Generator.CreateBoost(z, 90);
						Generator.CreateBoost(z, 180);
						z += Generator.CreateBoost(z, -90);
					}
					else if(rnd < 0.8) {
						Generator.CreateBoost(z, 90);
						z += Generator.CreateBoost(z, -90);
					}
					else {
						z += Generator.CreateBoost(z);
					}
					doBoost = false; // only one boost per level
				}
			}

			z += 200;
			if(z < levelLength)
			{
				// generate trigger
				currentCol = RandomItem(OtherCols[currentCol]);
				Generator.CreateTrigger(z - 150, currentCol);
			}
		}

		z -= 150;
		z += Generator.CreateGemSection(z, true, MB.Random01() < 0.5);

		// add final portal
		const triggerPos = z + 20;
		Generator.CreateEndTrigger(triggerPos);

		return triggerPos;
	}
}

const Canvas = document.getElementById("canvas");

// *test inset model
// *create vertex colour material
// *test inset model with vcol
// *test inset model with vcol & ao
// *rebuild a bunch more models
//   *export fbx of obstacles
//   *apply vo and save meshes in unity
//   *export to mbm
// *change brightness of tunnel shader
// add different tunnel colours
// *add menu screen at end of level
//	*show gems collected, levels until next ship unlocked (or 'new ship unlocked!')
//  *actually unlock (and activate) ship if this is >= the level it unlocks at
// remove ship purchasing from shop:
//   don't show gem count
//	 *only show activate button for owned ships
//	 *if not owned, show "Unlocks at Level x"
// *re-enable tunnel fog with distance param
// *increase fog distance for obstacles
// make ships have different colours in shop
// add ao to ships
// investigate uses for vcol in ships
// add ship decals with procedural uvs

// outside mode:
//  x-racer controls
//  inside wider(+taller?) cube tunnel

const ContinuousLevels = true;
const CaptureMode = false;

let TunnelSmooth = -1;
let Tunnel4Side = -1;
let Tunnel5Side = -1;
let Tunnel6Side = -1;
let TunnelWide = -1;
let DefaultMat = -1;

const ColRed = 0;
const ColBlue = 1;
const ColGreen = 2;
const ColYellow = 3;
const ColGrey = 4;
const EndTrigger = 5;
const ShipCols = [ColBlue, ColRed, ColGreen, ColYellow];
let OtherCols = [];

let AllShips = [];

const RedRGBA = {x:0.8, y:0.2, z: 0.4, w: 1.0};
const BlueRGBA = {x:0.3, y:0.2, z: 0.8, w: 1.0};
const GreenRGBA = {x:0.2, y:0.6, z: 0.4, w: 1.0};
const YellowRGBA = {x:0.8, y:0.6, z: 0.2, w: 1.0};
const WhiteRGBA = {x:1.0, y:1.0, z:1.0, w:1.0};

const TunnelColours = [
	{x:0.1, y:0.15, z: 0.2, w: 0.0},
	{x:0.2, y:0.1, z: 0.1, w: 0.0},
	{x:0.05, y:0.2, z: 0.1, w: 0.0},
	{x:0.2, y:0.15, z: 0.02, w: 0.0},
];

const DefaultTunnelBend = 50.0;
let BendAmpX = DefaultTunnelBend;
let BendAmpY = DefaultTunnelBend;

const BehindCameraZ = -100;
const TooFarAwayZ = 800;

const Control_Rotate = 1;
const Control_SideToSide = 2;

let ObstacleMats = [];
let TriggerMats = [];

// should these be defined somewhere in the api?
const TunnelShaderId = 2;
const TunnelTransShaderId = 3;
const TunnelParticlesShaderId = 4;
const ShipShaderId = 5;
const SpriteShaderId = 6;
const TunnelVColShaderId = 7;

let TunnelTex = -1;
let BlackTex = -1;
let LightTex = -1;
let LightTexGlossy = -1;
let GlareTex = -1;
let FlareTex = -1;
let NoiseTex = -1;
let PortalTex = -1;
let GlowTex = -1;
let TunnelDetailTex = -1;
let SheenGradTex = -1;

let SpriteQuad = -1;

let RingSection1 = -1;
let RingSection90 = -1;
let RingSection60 = -1;
let RingSection30 = -1;
let Cylinder = -1;
let IcoSphere = -1;
let Cone = -1;
let Cube = -1;
let Slab = -1;
let Loop = -1;
let Triangle = -1;
let Star = -1;

let Ship1 = -1;
let Ship2 = -1;
let Ship3 = -1;
let Ship4 = -1;
let Ship5 = -1;
let Ring1 = -1;
let Ring2 = -1;
let Ring3 = -1;

let GemModel = -1;
let GemMat = -1;
let BoostMat = -1;

let GlowMat = -1;
let Ship1Mat = -1;
let Ship2Mat = -1;
let Ship3Mat = -1;
let Ship4Mat = -1;
let Ship5Mat = -1;
let Ring1Mat = -1;
let Ring2Mat = -1;
let Ring3Mat = -1;

let ObstacleParticles = -1;
let TriggerParticles = -1;
let ShipParticles = -1;

let ButtonOkSfx = -1;
let ButtonCancelSfx = -1;
let CrashSfx = -1;
let SmashSfx = -1;
let GemSfx = -1;
let TriggerSfx = -1;
let LevelEndSfx = -1;

let GameLoop = -1;
let MenuLoop = -1;

let MatColours = {};

let Game = null;
let MainScene = null;

let CollisionMeshes = {};

let TimeScale = 1.0;

class Node
{
	constructor(z, mesh, mat, p, r, s) 
	{
		this.pos = p ? Vec3.Clone(p) : Vec3.Zero();
		this.rot = r ? Quat.Clone(r) :  Quat.Identity();
		this.scale = s ? Vec3.Clone(s) : Vec3.One();
		this.pos.z += z;
		this.meshId = mesh || -1;
		this.collisionMesh = CollisionMeshes[mesh];
		this.matId = mat || -1;
		this.smashed = false;
	}
}

class Trigger
{
	constructor(z, col)
	{
		this.zPos = z;
		this.col = col;
		this.isEndTrigger = col == EndTrigger;
	}
}

class Gem
{
	constructor(z, angle)
	{
		this.zPos = z;
		this.angle = angle;
		this.isGem = true;

		const posR = 8.0;
		const theta = angle * DegToRad;

		if(Game.controlMode == Control_SideToSide)
			this.pos = new Vec3(angle, -posR, 0.0);
		else
			this.pos = new Vec3(posR * Math.sin(theta), -posR * Math.cos(theta), 0.0);
	}
}

class Booster
{
	constructor(z, angle)
	{
		this.zPos = z;
		this.angle = angle;
		this.isBoost = true;

		const posR = 6.0;
		const theta = angle * DegToRad;
		this.pos = new Vec3(posR * Math.sin(theta), -posR * Math.cos(theta), 0.0);
	}
}

class Updater
{
	constructor(z, nodes) {
		this.z = z;
		this.nodes = nodes;
	}
	Update(dT, zOffset) {}
}

class Rotator extends Updater
{
	constructor(z, nodes, axis, speed) {
		super(z, nodes);
		this.axis = axis;
		this.speed = speed;
	}

	Update(dT, zOffset) {
		let deltaRot = Quat.FromAxisAngle(this.axis, this.speed * dT);
		for(let i=0; i<this.nodes.length; ++i)
		{
			let q = this.nodes[i].rot;
			Quat.Mul(q, deltaRot, q);
		}
	}
}

class RotateRelative extends Updater
{
	constructor(z, nodes, speed, amp, curve)
	{
		super(z, nodes);

		this.speed = speed;
		this.amp = amp;
		this.curve = curve;

		this.startRotations = [];
		for(let i=0; i<nodes.length; ++i)
			this.startRotations[i] = Quat.Clone(nodes[i].rot);

		this.tPos = 0.0;
	}

	Update(dT, zOffset)
	{
		let zPos = this.z - zOffset;
		this.tPos = this.speed * zPos * -0.01;
		this.tPos = this.tPos - Math.floor(this.tPos);

		let rotOffset = this.amp * this.curve.Evaluate(this.tPos);
		let newRot = Quat.FromAxisAngle(Vec3.Forward(), rotOffset);

		for(let i=0; i<this.nodes.length; ++i)
		{
			let start = this.startRotations[i];
			let node = this.nodes[i];
			Quat.Mul(start, newRot, node.rot);
		}
	}
}

class Mover extends Updater
{
	constructor(z, nodes, speed, amp, curve, moveDir, lockToPos)
	{
		super(z, nodes);

		this.speed = speed;
		this.amp = amp;
		this.curve = curve;
		this.lockToPosition = lockToPos;

		this.startPositions = [];
		for(let i=0; i<nodes.length; ++i)
			this.startPositions[i] = Vec3.Clone(nodes[i].pos);

		this.moveDir = moveDir;
		this.tPos = 0.0;
	}

	Update(dT, zOffset)
	{
		let zPos = this.z - zOffset;
		if(this.lockToPosition)
			this.tPos = this.speed * zPos * -0.01;
		else
			this.tPos += this.speed * dT;
		this.tPos = this.tPos - Math.floor(this.tPos);

		let yOffset = this.curve.Evaluate(this.tPos);
		let dir = this.moveDir;
		let offsetX = this.amp * yOffset * dir.x;
		let offsetY = this.amp * yOffset * dir.y;
		let offsetZ = this.amp * yOffset * dir.z;

		for(let i=0; i<this.nodes.length; ++i)
		{
			let start = this.startPositions[i];
			let node = this.nodes[i];
			node.pos.x = start.x + offsetX;
			node.pos.y = start.y + offsetY;
			node.pos.z = start.z + offsetZ;
		}
	}
}

class LevelManager
{
	constructor() 
	{
		this.zOffset = 0.0;
		this.cameraOffset = Vec3.Zero();
	}

	CalcOffset(zPos)
	{		
		const BendFreq = 0.35;

		// sum up some sine waves to create a wiggly tunnel shape
		let z = 0.01 * BendFreq * (zPos + this.zOffset);
		let sin0 = Math.sin(z);
		let sin1 = Math.sin(z * 1.77);
		let sin2 = Math.sin(z * 0.57);
		let sin3 = Math.sin(z * 0.31);
		let xOffset = (1.0 + sin2 * (sin0 * sin1)) - (sin0 * sin2) + sin3;
		let yOffset = (sin2 * sin1) - (sin0 * sin3);

		return new Vec3(xOffset * BendAmpX, yOffset * BendAmpY, 0.0);
	}

	Reset()
	{
		this.zOffset = 0.0;
		this.cameraOffset = Vec3.Zero();
//		this.currentZ = 0.0;
//		this.currentSectionIdx = 0;
//		this.enableGeneration = true;
//		this.levelCompleted = false;

	}

	Update(dT, scrollSpeed)
	{
		let deltaZ = scrollSpeed * dT;

		this.zOffset += deltaZ;
		this.cameraOffset = this.CalcOffset(0.0);
	}

	Render(tunnelMesh, zoom)
	{
		const pos = {x:0.0, y:0.0, z:0.0};
		const rot = {x:0, y:0, z:0, w:1};
		const scale = {x:zoom, y:zoom, z:zoom};
		const sectionLength = 50 * zoom;

		MB.SetMaterial(DefaultMat);
		var zOffset = Repeat(this.zOffset, sectionLength);

		for(let i=-1; i<15; i++)
		{
			pos.z = i * sectionLength - zOffset;
			MB.DrawMesh(tunnelMesh, pos, rot, scale);
		}
	}
}

class ShipRingAnim extends Component
{
	constructor(player, rings)
	{
		super();
		this.player = player;
		this.rings = rings;
		this.rot = 0;
	}

	Update(dT) 
	{
		const idleSpeed = 20.0;
		const steerSpeed = -8 * this.player.shipTilt;
		this.rot += dT * (idleSpeed + steerSpeed);

		for(let i=0; i < this.rings.length; ++i)
		{
			const ring = this.rings[i];
			const angle = ring.mRotSpeed * this.rot;
			ring.SetRotation(Quat.FromAxisAngle(Vec3.Forward(), angle));
		}
	}
}

function CreateShip1(player)
{
	const scale = new Vec3(1.0, 1.0, 1.0);

	let ship = new GameObject("FALCON");
	ship.SetScale(scale);
	let meshRenderer = new MeshRenderer(Ship1, Ship1Mat);
	ship.AddComponent(meshRenderer);
	player.renderers.push(meshRenderer);

	let ringPos = [new Vec3(0,0,-1.2), new Vec3(0,0.05, -1.95), new Vec3(0,0.05, -2.05)];
	let ringScales = [new Vec3(1.8,1.8,1.8), new Vec3(0.67,0.67,0.67), new Vec3(0.55,0.55,0.55)];
	let ringRotSpeeds = [1, -0.6, 1.4];

	let rings = [];
	for(let i=0; i<ringPos.length; ++i)
	{
		let ring = new GameObject("Ring");
		ring.SetPosition(ringPos[i]);
		ring.SetScale(ringScales[i]);
		ring.mRotSpeed = ringRotSpeeds[i];
		ring.SetParent(ship);
		meshRenderer = new MeshRenderer(Ring1, Ring1Mat);
		ring.AddComponent(meshRenderer);
		player.renderers.push(meshRenderer);
		rings.push(ring);
	}

	let glowSprite = new GameObject("Glow");
	glowSprite.SetPosition(new Vec3(0,0.07,-2.1));
	glowSprite.SetScale(new Vec3(4,1,1));
	glowSprite.SetParent(ship);
	meshRenderer = new MeshRenderer(SpriteQuad, GlowMat);
	glowSprite.AddComponent(meshRenderer);

	ship.AddComponent(new ShipRingAnim(player, rings));

	ship.speed = 1.0;
	ship.handling = 1.0;

	ship.price = 0;
	ship.owned = true;
	ship.unlockLevel = 0;

	return ship;
}

function CreateShip2(player)
{
	const scale = new Vec3(1.0, 1.0, 1.0);

	let ship = new GameObject("MUSTANG");
	ship.SetScale(scale);
	let meshRenderer = new MeshRenderer(Ship3, Ship3Mat);
	ship.AddComponent(meshRenderer);
	player.renderers.push(meshRenderer);

	let ringPos = [new Vec3(0,0,-1.23), new Vec3(0,0,-1.38), new Vec3(0,0, -1.52)];
	let ringScales = [new Vec3(1.2,1.2,1.2), new Vec3(0.9,0.9,0.9), new Vec3(0.7,0.7,0.7)];
	let ringRotSpeeds = [1, -0.7, 1.4];

	let rings = [];
	for(let i=0; i<ringPos.length; ++i)
	{
		let ring = new GameObject("Ring");
		ring.SetPosition(ringPos[i]);
		ring.SetScale(ringScales[i]);
		ring.mRotSpeed = ringRotSpeeds[i];
		ring.SetParent(ship);
		meshRenderer = new MeshRenderer(Ring3, Ring3Mat);
		ring.AddComponent(meshRenderer);
		player.renderers.push(meshRenderer);
		rings.push(ring);
	}

	let glowSprite = new GameObject("Glow");
	glowSprite.SetPosition(new Vec3(0,0,-1.7));
	glowSprite.SetScale(new Vec3(3,0.6,1));
	glowSprite.SetParent(ship);
	meshRenderer = new MeshRenderer(SpriteQuad, GlowMat);
	glowSprite.AddComponent(meshRenderer);

	ship.AddComponent(new ShipRingAnim(player, rings));

	ship.speed = 1.3;
	ship.handling = 1.04;

	ship.price = 100;
	ship.owned = MB.LoadObject(ship.name, 0) > 0; // could have == hash(ship.name) for more security.
	ship.unlockLevel = 3;

	return ship;
}

function CreateShip3(player)
{
	const scale = new Vec3(1.0, 1.0, 1.0);

	let ship = new GameObject("PHASOR");
	ship.SetScale(scale);
	let meshRenderer = new MeshRenderer(Ship2, Ship2Mat);
	ship.AddComponent(meshRenderer);
	player.renderers.push(meshRenderer);

	let ringPos = [new Vec3(1,-0.18,-1.3), new Vec3(1,-0.18,-1.3), new Vec3(-1, -0.18, -1.3), new Vec3(-1, -0.18, -1.3)];
	let ringScales = [new Vec3(1,1,1), new Vec3(0.6,0.6,0.6), new Vec3(1,1,1), new Vec3(0.6,0.6,0.6)];
	let ringRotSpeeds = [1, -1, -1, 1];

	let rings = [];
	for(let i=0; i<ringPos.length; ++i)
	{
		let ring = new GameObject("Ring");
		ring.SetPosition(ringPos[i]);
		ring.SetScale(ringScales[i]);
		ring.mRotSpeed = ringRotSpeeds[i];
		ring.SetParent(ship);
		meshRenderer = new MeshRenderer(Ring2, Ring2Mat);
		ring.AddComponent(meshRenderer);
		player.renderers.push(meshRenderer);
		rings.push(ring);
	}

	let glowSprite = new GameObject("GlowL");
	glowSprite.SetPosition(new Vec3(-1,-0.18,-1.32));
	glowSprite.SetScale(new Vec3(2,0.5,1));
	glowSprite.SetParent(ship);
	meshRenderer = new MeshRenderer(SpriteQuad, GlowMat);
	glowSprite.AddComponent(meshRenderer);

	glowSprite = new GameObject("GlowR");
	glowSprite.SetPosition(new Vec3(1,-0.18,-1.32));
	glowSprite.SetScale(new Vec3(2,0.5,1));
	glowSprite.SetParent(ship);
	meshRenderer = new MeshRenderer(SpriteQuad, GlowMat);
	glowSprite.AddComponent(meshRenderer);

	ship.AddComponent(new ShipRingAnim(player, rings));

	ship.speed = 1.5;
	ship.handling = 0.97;

	ship.price = 300;
	ship.owned = MB.LoadObject(ship.name, 0) > 0; // could have == hash(ship.name) for more security.
	ship.unlockLevel = 10;

	return ship;
}

function CreateShip4(player)
{
	const scale = new Vec3(1.0, 1.0, 1.0);

	let ship = new GameObject("DRAGON");
	ship.SetScale(scale);
	let meshRenderer = new MeshRenderer(Ship4, Ship4Mat);
	ship.AddComponent(meshRenderer);
	player.renderers.push(meshRenderer);

	let ringPos = [new Vec3(0.55,0.25,-0.95), new Vec3(-0.55,0.25,-0.95), new Vec3(0.55,0.25,-1.02), new Vec3(-0.55,0.25,-1.02)];
	let ringScales = [new Vec3(0.55,0.55,0.55), new Vec3(0.55,0.55,0.55), new Vec3(0.4,0.4,0.4), new Vec3(0.4,0.4,0.4)];
	let ringRotSpeeds = [1, -1, 1.4, -1.4];

	let rings = [];
	for(let i=0; i<ringPos.length; ++i)
	{
		let ring = new GameObject("Ring");
		ring.SetPosition(ringPos[i]);
		ring.SetScale(ringScales[i]);
		ring.mRotSpeed = ringRotSpeeds[i];
		ring.SetParent(ship);
		meshRenderer = new MeshRenderer(Ring1, Ring1Mat);
		ring.AddComponent(meshRenderer);
		player.renderers.push(meshRenderer);
		rings.push(ring);
	}

	let glowSprite = new GameObject("Glow");
	glowSprite.SetPosition(new Vec3(0.0,0.2,-1.25));
	glowSprite.SetScale(new Vec3(2,0.5,1));
	glowSprite.SetParent(ship);
	meshRenderer = new MeshRenderer(SpriteQuad, GlowMat);
	glowSprite.AddComponent(meshRenderer);

	ship.AddComponent(new ShipRingAnim(player, rings));

	ship.speed = 1.7;
	ship.handling = 1.03;

	ship.price = 750;
	ship.owned = MB.LoadObject(ship.name, 0) > 0; // could have == hash(ship.name) for more security.
	ship.unlockLevel = 25;

	return ship;
}

function CreateShip5(player)
{
	const scale = new Vec3(1.0, 1.0, 1.0);

	let ship = new GameObject("VIPER");
	ship.SetScale(scale);
	let meshRenderer = new MeshRenderer(Ship5, Ship5Mat);
	ship.AddComponent(meshRenderer);
	player.renderers.push(meshRenderer);

	let ringPos = [new Vec3(0.0,0.08,-1.95), new Vec3(0.0,0.08,-2.05)];
	let ringScales = [new Vec3(0.55,0.55,0.55), new Vec3(0.35,0.35,0.35)];
	let ringRotSpeeds = [1, -1];

	let rings = [];
	for(let i=0; i<ringPos.length; ++i)
	{
		let ring = new GameObject("Ring");
		ring.SetPosition(ringPos[i]);
		ring.SetScale(ringScales[i]);
		ring.mRotSpeed = ringRotSpeeds[i];
		ring.SetParent(ship);
		meshRenderer = new MeshRenderer(Ring3, Ring3Mat);
		ring.AddComponent(meshRenderer);
		player.renderers.push(meshRenderer);
		rings.push(ring);
	}

	let glowSprite = new GameObject("Glow");
	glowSprite.SetPosition(new Vec3(0.0,0.1,-2.2));
	glowSprite.SetScale(new Vec3(2,0.5,1));
	glowSprite.SetParent(ship);
	meshRenderer = new MeshRenderer(SpriteQuad, GlowMat);
	glowSprite.AddComponent(meshRenderer);

	ship.AddComponent(new ShipRingAnim(player, rings));

	ship.speed = 2.0;
	ship.handling = 0.98;

	ship.price = 1500;
	ship.owned = MB.LoadObject(ship.name, 0) > 0; // could have == hash(ship.name) for more security.
	ship.unlockLevel = 50;

	return ship;
}

class Player
{
	constructor()
	{
		OtherCols[ColRed] = [ColBlue, ColYellow, ColGreen];
		OtherCols[ColBlue] = [ColRed, ColYellow, ColGreen];
		OtherCols[ColYellow] = [ColBlue, ColRed, ColGreen];
		OtherCols[ColGreen] = [ColBlue, ColYellow, ColRed];

		this.crashed = false;
		this.crashJustHappened = false;
		this.speedMultiplier = 1.0;
		this.acceleration = 1.0;
		this.reviveCount = 0;
		this.rotation = 0;
		this.shipTilt = 0;
		this.shipZOffset = 0;
		this.currentSteer = 0;
		this.currentShipCol = ColBlue;
		this.lastSmashTime = 0.0;
		this.speedBoostMult = 1.0;
		this.cameraFov = 60.0;
		this.renderers = [];
	
		this.ship = null;


		// if we add 2-player mode, this needs to be altered.
		AllShips[0] = CreateShip1(this);
		AllShips[1] = CreateShip2(this);
		AllShips[2] = CreateShip3(this);
		AllShips[3] = CreateShip4(this);
		AllShips[4] = CreateShip5(this);

		for(let i=0; i<AllShips.length; ++i)
		{
			MainScene.AddRootObject(AllShips[i]);
			AllShips[i].isActive = false;
		}

		this.SetShip(AllShips[Game.activeShipIdx]);
		this.SetShipCol(ColBlue);
	}

	SetShip(ship)
	{
		if(this.ship)
			this.ship.isActive = false;
		this.ship = ship;
		if(this.ship)
			this.ship.isActive = true;
	}

	SetShipCol(col)
	{
		this.currentShipCol = col;
		const rgba = MatColours[ObstacleMats[col]]
		for(let i=0; i<this.renderers.length; ++i)
		{
	//		this.renderers[i].matId = ObstacleMats[col];
			MB.SetMaterial(this.renderers[i].matId);
			MB.SetUniformFloat4(MB.ShaderStage.Vertex, 4, rgba);
		}
	}

	Speed()
	{
		if (this.crashed)
			return 0.0;

		const baseSpeed = 90.0;
		let speed = this.acceleration * this.speedMultiplier * this.speedBoostMult * baseSpeed;

		// to stop the speed being too constant we add a little noise to give a tiny bit of variability
	//	float noise = 2.0f * Mathf.PerlinNoise(Time.time, 0.0f) - 1.0f;
		let noise = 2.0 * MB.Random01() - 1.0;
		speed += 2.0 * noise;
		return speed;
	}

	SteerSpeed()
	{
		if (this.crashed)
			return 0.0;

		const baseSteerSpeed = 105 * this.ship.handling;
		return this.acceleration * this.speedMultiplier * baseSteerSpeed;
	}

	Reset()
	{
		this.crashed = false;
		this.crashJustHappened = false;
		this.acceleration = 0.5;
		this.shakeAmount = 0.0;
		this.lastSmashTime = 0.0;
		this.cameraFov = 60.0;
		this.speedBoostMult = 1.0;

		const levelRamping = 0.04;
		//const levelSpeed = 1.0 - Math.exp(-levelRamping * Game.currentLevel);

		this.speedMultiplier = 0.4 + 0.2 * this.ship.speed;

		const difficulty = Game.GetDifficulty();
		if (difficulty == Difficulty.Easy)
			this.speedMultiplier += 0.5;
		else if (difficulty == Difficulty.Medium)
			this.speedMultiplier += 0.75;
		else
			this.speedMultiplier += 1.0;

		// ramp up the difficulty a little more slowly
		if(Game.currentLevel < 5)
			this.speedMultiplier *= 0.9;
		else if(Game.currentLevel < 10)
			this.speedMultiplier *= 0.95;

		this.reviveCount = 0;
		this.rotation = 0;
		this.shipTilt = 0;
		this.shipZOffset = 0;
		this.currentSteer = 0;

		// todo: this should come from current level?
		this.SetShipCol(ColBlue);
	}

	Revive()
	{
		this.crashed = false;
		this.crashJustHappened = false;
		this.acceleration = 0.5;
		this.reviveCount++;
		this.currentSteer = 0;

		// make the player invincible for 2 seconds so they have a chance to recover.
		//	this.invincibleTimer = 2.0f;
	}

	Rotate(dir)
	{
		let steerSpeed = this.SteerSpeed();
		this.rotation += dir * steerSpeed;
		this.currentSteer = dir < 0 ? -1.0 : 1.0;
	}

	OnCrashed()
	{
		this.crashed = true;
		this.crashJustHappened = true;

		// SoundManager.PlaySfx("Explode");

		// // come to a complete stop and shake the camera
		this.shakeAmount = 5.0;
	}

	SetTunnelBoostColors(blend)
	{
		MB.SetMaterial(DefaultMat);
		MB.SetUniformFloat(MB.ShaderStage.Pixel, 0, blend);
		for(let i=0; i<ObstacleMats.length; ++i)
		{
			MB.SetMaterial(ObstacleMats[i]);
			MB.SetUniformFloat(MB.ShaderStage.Pixel, 0, blend);
		}
	}

	DoBoost()
	{
		if(this.isBoosting)
			return;

		Game.ShowMessage("SUPER BOOST!", 16, 400);
		MB.PlaySfx(TriggerSfx, 1.0);

		const boostFactor = Math.min(2.0, 3.0 / this.speedMultiplier);
		const boostTime = 3.0;
		const player = this;

		player.isBoosting = true;

		// accel up to full boost speed
		Tweener.AddGameTween(player.speedBoostMult, boostFactor, 0.5, function(x) { player.speedBoostMult=x; });
		Tweener.AddGameTween(player.cameraFov, 100, 0.5, function(x) { player.cameraFov=x; });		
		Tweener.AddGameTween(0.0, 0.3, 2.0, function(x) { player.shakeAmount=x; });
		Tweener.AddGameTween(0.0, 1.0, 0.5, function(x) { player.SetTunnelBoostColors(x); });

		// accel down again
		Tweener.AddGameTween(player.speedBoostMult, 1.0, 0.6, function(x) { player.speedBoostMult=x; }).Delay(boostTime).OnCompleted(()=>player.isBoosting = false);
		Tweener.AddGameTween(90, 60, 0.6, function(x) { player.cameraFov=x; }).Delay(boostTime);
		Tweener.AddGameTween(0.3, 0.0, 0.6, function(x) { player.shakeAmount=x; }).Delay(boostTime);
		Tweener.AddGameTween(1.0, 0.0, 0.4, function(x) { player.SetTunnelBoostColors(x); }).Delay(boostTime);
	}

	Update(dT)
	{
		if(this.crashJustHappened)
		{
			this.crashJustHappened = false;

			// inform the game manager of the incident
			// this is delayed by one frame from the actual crash so we can detect a draw in 2-player mode.
			Game.OnPlayerCrashed(this);
		}
		
		if (this.crashed || Game.state != State.Playing)
			return;

		const accelTime = 3.0;
		this.acceleration = Math.min(1.0, this.acceleration + dT / accelTime);

		let maxShipTilt = 30.0;
		if(this.currentSteer == 0.0)
			this.shipTilt = Lerp(this.shipTilt, 0.0, 6.0 * dT);
		else
		{
			this.shipTilt = Lerp(this.shipTilt, this.currentSteer * maxShipTilt, 10.0 * dT);
		}
		this.currentSteer = 0.0;

/*		const distMoved = 1.1 * this.Speed() * dT;
		const offset = 4.0;

		let start = this.camera.globalPosition;//.subtract(new Vector3(0,0,offset));
		let dir = new Vector3(0,0,1);
		let length = distMoved + offset;
		let ray = new Ray(start, dir, length);

		let hit = Game.instance.scene.pickWithRay(ray);

		if(hit.hit && hit.pickedMesh['layer'] !== undefined)
		{
			if(hit.pickedMesh['layer'] == "obstacle")
			{
		//		RayHelper.CreateAndShow(ray, this.camera.getScene(), new Color3(1,1,0));
				this.OnCrashed();
			}
		} */
	}	
}

const State = 
{
	InMenus: 0,
	Playing: 1,
	Paused: 2,
	Countdow: 3,
	Dead: 4,
	TestMode: 5
}

const Difficulty = 
{
	Easy: 0,
	Medium: 1,
	Hard: 2
}

class CGame
{
	constructor() {
		Game = this;

		this.isMobileBrowser = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
		console.log("Mobile : " + this.isMobileBrowser);
		
		Canvas.addEventListener('keypress',function(evt) { evt.preventDefault(); },false);
		Canvas.addEventListener('keydown',function(evt) { evt.preventDefault(); },false);
		Canvas.addEventListener('keyup',function(evt) { evt.preventDefault(); }, false);
		Canvas.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });

		Canvas.addEventListener("blur", function(evt) { Game.OnLostFocus() });

		AdManager.Init();
		AdManager.OnLoadingStart();
	
		this.state = State.InMenus;
		this.currentLevel = this.HighestLevel();
		this.difficulty = MB.LoadObject("Difficulty", Difficulty.Medium);
		this.LoadGemCount();
		this.activeShipIdx = MB.LoadObject("ActiveShip", 0);
		this.controlMode = Control_Rotate;

		this.Time = 0.0;

		this.materials = [];
		this.playerPos;

		this.allObstacles = [];
		this.allUpdaters = [];
		this.allTriggers = [];

		this.triggerGlare = 0.0;
		this.shipFocus = 0.0;
		this.levelLength = 0.0;

		this.startLevelWithBoost = false;
		this.CrashCount = 0;
		this.GemsThisRun = 0;

		TunnelTex = MB.CreateTexture("Tunnel.png");
		BlackTex = MB.CreateTexture("Black.png");
		LightTex = MB.CreateTexture("matcap.jpg");
		LightTexGlossy = MB.CreateTexture("matcap_glossy.jpg");
		NoiseTex = MB.CreateTexture("Noise.jpg");
		PortalTex = MB.CreateTexture("Burst2.jpg");
		GlareTex = MB.CreateTexture("LightLeak4.jpg");
		FlareTex = MB.CreateTexture("LightLeak19.jpg");
		GlowTex = MB.CreateTexture("Glow.png");
		TunnelDetailTex = MB.CreateTexture("TunnelPattern.jpg");
		SheenGradTex = MB.CreateTexture("SheenGrad.jpg");

		ButtonOkSfx = MB.CreateSfx("ButtonOk.mp3");
		ButtonCancelSfx = MB.CreateSfx("ButtonCancel.mp3");
		SmashSfx = MB.CreateSfx("Smash1.mp3");
		CrashSfx = MB.CreateSfx("Crash.mp3");
		GemSfx = MB.CreateSfx("Gem1.mp3");
		LevelEndSfx = MB.CreateSfx("LevelEndSfx.mp3");
		TriggerSfx = MB.CreateSfx("TriggerSfx.mp3");

		GameLoop = MB.CreateMusic("XerxesRevenge.mp3");
		MenuLoop = MB.CreateMusic("XerxesRevengeIntro.mp3");

		MenuControl.Init();
		this.Init();

		this.player1 = new Player();
		this.levelManager = new LevelManager();

		const resetLevel = false;
		const resetGems = false;
		const resetShips = false;
		const resetAll = false;
		if(resetLevel || resetAll)
		{
			this.currentLevel = 0;
			this.SetHighestLevel(0);
		}
		if(resetGems || resetAll)
		{
			this.GemCount = 0;
			this.SaveGemCount();
		}
		if(resetShips || resetAll)
		{
			for(let i=0; i<AllShips.length; ++i)
			{
				MB.SaveObject(AllShips[i].name, 0);
				AllShips[i].owned = i == 0;
			}
		}

		AdManager.OnLoadingComplete();
	}

	CreateMat(shaderId, col, texId, tex2Id, tex3Id)
	{
		const matID = MB.CreateMaterial(shaderId);
		MB.SetMaterial(matID);
		MB.SetUniformFloat4(MB.ShaderStage.Vertex, 4, col);

		if(texId)
			MB.SetTexture(texId, 0);
		if(tex2Id)
			MB.SetTexture(tex2Id, 1);
		if(tex3Id)
			MB.SetTexture(tex3Id, 2);

		this.materials.push(matID);
		return matID;
	}

	Init()
	{
		let RingTex = MB.CreateTexture("Ring.png");
		let Ship1Tex = MB.CreateTexture("Ship1AO.png");
		let Ship2Tex = MB.CreateTexture("Ship2AO.png");
		let Ship3Tex = MB.CreateTexture("Ship3AO.png");
		let Ship4Tex = MB.CreateTexture("Ship4AO.png");
		let Ship5Tex = MB.CreateTexture("Ship5AO.png");
		let Ring1Tex = MB.CreateTexture("ShipRing1AO.jpg");
		let Ring2Tex = MB.CreateTexture("ShipRing2AO.jpg");
		let Ring3Tex = MB.CreateTexture("ShipRing3AO.jpg");
	
		DefaultMat = MB.CreateMaterial(TunnelShaderId);
		this.materials.push(DefaultMat);
	
		GlowMat = this.CreateMat(SpriteShaderId, WhiteRGBA, GlowTex)
		Ship1Mat = this.CreateMat(ShipShaderId, BlueRGBA, Ship1Tex, LightTexGlossy, SheenGradTex)
		Ship2Mat = this.CreateMat(ShipShaderId, BlueRGBA, Ship2Tex, LightTexGlossy, SheenGradTex)
		Ship3Mat = this.CreateMat(ShipShaderId, BlueRGBA, Ship3Tex, LightTexGlossy, SheenGradTex)
		Ship4Mat = this.CreateMat(ShipShaderId, BlueRGBA, Ship4Tex, LightTexGlossy, SheenGradTex)
		Ship5Mat = this.CreateMat(ShipShaderId, BlueRGBA, Ship5Tex, LightTexGlossy, SheenGradTex)
		Ring1Mat = this.CreateMat(ShipShaderId, BlueRGBA, Ring1Tex, LightTexGlossy, SheenGradTex)
		Ring2Mat = this.CreateMat(ShipShaderId, BlueRGBA, Ring2Tex, LightTexGlossy, SheenGradTex)
		Ring3Mat = this.CreateMat(ShipShaderId, BlueRGBA, Ring3Tex, LightTexGlossy, SheenGradTex)

		GemMat = this.CreateMat(TunnelTransShaderId, {x:1.0, y:1.0, z: 0.5, w: 0.3}, NoiseTex, NoiseTex)
		BoostMat = this.CreateMat(TunnelVColShaderId, {x:1.0, y:1.0, z: 0.2, w: 1.0}, WhiteTex, SheenGradTex)

		ObstacleMats[ColRed] = this.CreateMat(TunnelVColShaderId, RedRGBA, WhiteTex, LightTex, BlackTex)
		ObstacleMats[ColBlue] = this.CreateMat(TunnelVColShaderId, BlueRGBA, WhiteTex, LightTex, BlackTex)
		ObstacleMats[ColGreen] = this.CreateMat(TunnelVColShaderId, GreenRGBA, WhiteTex, LightTex, BlackTex)
		ObstacleMats[ColYellow] = this.CreateMat(TunnelVColShaderId, YellowRGBA, WhiteTex, LightTex, BlackTex)
		ObstacleMats[ColGrey] = this.CreateMat(TunnelVColShaderId, WhiteRGBA, WhiteTex, LightTex, BlackTex)
		TriggerMats[ColRed] = this.CreateMat(TunnelTransShaderId, RedRGBA, NoiseTex, NoiseTex)
		TriggerMats[ColBlue] = this.CreateMat(TunnelTransShaderId, BlueRGBA, NoiseTex, NoiseTex)
		TriggerMats[ColGreen] = this.CreateMat(TunnelTransShaderId, GreenRGBA, NoiseTex, NoiseTex)
		TriggerMats[ColYellow] = this.CreateMat(TunnelTransShaderId, YellowRGBA, NoiseTex, NoiseTex)
		TriggerMats[ColGrey] = this.CreateMat(TunnelTransShaderId, WhiteRGBA, NoiseTex, NoiseTex)
		TriggerMats[EndTrigger] = this.CreateMat(TunnelTransShaderId, WhiteRGBA, NoiseTex, PortalTex)

		for(let i=0; i<TriggerMats.length; ++i)
		{
			let mat = TriggerMats[i];
			MB.SetMaterial(mat);
			MB.SetUniformFloat(MB.ShaderStage.Pixel, 0, 0.1);	// distort amount
			MB.SetUniformFloat(MB.ShaderStage.Pixel, 1, 2);		// uv scale
			MB.SetUniformFloat(MB.ShaderStage.Pixel, 2, 1.0);	// tint amount
		}

		// setup end trigger mat
		MB.SetMaterial(TriggerMats[EndTrigger]);
		MB.SetUniformFloat(MB.ShaderStage.Pixel, 0, 0.1);	// distort amount
		MB.SetUniformFloat(MB.ShaderStage.Pixel, 1, 0.7); // scale up
		MB.SetUniformFloat(MB.ShaderStage.Pixel, 2, 0.0); // don't tint

		MB.SetMaterial(GemMat);
		MB.SetUniformFloat(MB.ShaderStage.Pixel, 0, 0.1);	// distort amount
		MB.SetUniformFloat(MB.ShaderStage.Pixel, 1, 1); // scale up
		MB.SetUniformFloat(MB.ShaderStage.Pixel, 2, 0.0); // don't tint
		// MB.SetMaterial(BoostMat);
		// MB.SetUniformFloat(MB.ShaderStage.Pixel, 0, 0.1);	// distort amount
		// MB.SetUniformFloat(MB.ShaderStage.Pixel, 1, 1); // scale up
		// MB.SetUniformFloat(MB.ShaderStage.Pixel, 2, 0.0); // don't tint

		MatColours[ObstacleMats[ColRed]] = RedRGBA;
		MatColours[ObstacleMats[ColBlue]] = BlueRGBA;
		MatColours[ObstacleMats[ColGreen]] = GreenRGBA;
		MatColours[ObstacleMats[ColYellow]] = YellowRGBA;
	
		SpriteQuad = MB.CreateMesh("Quad.mbm");
		TunnelSmooth = MB.CreateMesh("Tunnel.mbm");
		Tunnel4Side = MB.CreateMesh("Tunnel4.mbm");
		Tunnel5Side = MB.CreateMesh("Tunnel5.mbm");
		Tunnel6Side = MB.CreateMesh("Tunnel6.mbm");
		TunnelWide = MB.CreateMesh("Tunnel_Wide.mbm");
		RingSection1 = MB.CreateMesh("RingSection1.mbm");
		RingSection90 = MB.CreateMesh("RingSection90.mbm");
		RingSection60 = MB.CreateMesh("RingSection60.mbm");
		RingSection30 = MB.CreateMesh("RingSection30.mbm");
		Cylinder = MB.CreateMesh("Cylinder.mbm");
		IcoSphere = MB.CreateMesh("Icosphere.mbm");
		Cube = MB.CreateMesh("Cube.mbm");
		Cone = MB.CreateMesh("Cone.mbm");
		Slab = MB.CreateMesh("Slab.mbm");
		Loop = MB.CreateMesh("Loop.mbm");
		Triangle = MB.CreateMesh("Triangle.mbm");
		Star = MB.CreateMesh("Star.mbm");

		Ship1 = MB.CreateMesh("Ship1.mbm");
		Ship2 = MB.CreateMesh("Ship2.mbm");
		Ship3 = MB.CreateMesh("Ship3.mbm");
		Ship4 = MB.CreateMesh("Ship4.mbm");
		Ship5 = MB.CreateMesh("Ship5.mbm");
		Ring1 = MB.CreateMesh("ShipRing1.mbm");
		Ring2 = MB.CreateMesh("ShipRing2.mbm");
		Ring3 = MB.CreateMesh("ShipRing3.mbm");
		
		GemModel = MB.CreateMesh("GemBox.mbm");

		let particleParams = { 
			lifetime: new Vec2(1,2), 
			faceCamera : false, 
			startCol : new Vec4(1,1,0,1),
			startSize : new Vec2(0.2, 1.2),
			maxParticles : 500 
		};
		ObstacleParticles = MB.CreateParticleSystem(particleParams);

		particleParams.texId = RingTex;
		TriggerParticles = MB.CreateParticleSystem(particleParams);

		particleParams.texId = -1;
		particleParams.startSize = new Vec2(0.1, 0.2);
		ShipParticles = MB.CreateParticleSystem(particleParams);
	
		MB.SetMaterial(DefaultMat);

		// set tunnel colour
		MB.SetUniformFloat4(MB.ShaderStage.Vertex, 4, {x:0.1, y:0.15, z: 0.2, w: 0.0});
		MB.SetTexture(TunnelTex, 0);
		MB.SetTexture(LightTex, 1);
		MB.SetTexture(TunnelDetailTex, 2);
	}

	GetDifficulty() { return this.difficulty; }
	SetDifficulty(difficulty)
	{
		this.difficulty = difficulty;
		MB.SaveObject("Difficulty", this.difficulty);
	}

	HighestLevel() { return MB.LoadObject("MaxLevel", 0); }
	SetHighestLevel(levelIdx)
	{
		MB.SaveObject("MaxLevel", levelIdx);
	}

	LoadGemCount() { this.GemCount = MB.LoadObject("EggSize", 0); }
	SaveGemCount() { MB.SaveObject("EggSize", this.GemCount); }

	GetActiveShipIdx() { return this.activeShipIdx; }
	SetActiveShipIdx(idx) 
	{
		console.log("Set Ship Idx " + idx);
		 if(idx >= 0 && idx < AllShips.length) 
		 {
			 this.activeShipIdx = idx;
			 MB.SaveObject("ActiveShip", idx);
		 }
	}
	SetActiveShip(ship)
	{
		console.log("Set Ship");
		for(let i=0; i<AllShips.length; ++i)
		{
			if(AllShips[i] == ship)
			{
				this.SetActiveShipIdx(i);
			}
		}
	}

	NextShipToUnlock()
	{
		for(let i=0; i<AllShips.length; ++i)
		{
			let ship = AllShips[i];
			if(!ship.owned)
			{
				return ship;
			}
		}

		return null;
	}

	BuyShip(ship)
	{
		let price = ContinuousLevels ? ship.price : 0;

		if(this.GemCount >= price)
		{
			this.GemCount -= price;
			ship.owned = true;

			this.SaveGemCount();
			MB.SaveObject(ship.name, 1);
		}
	}


	ClearLevel()
	{
		this.allObstacles = [];
		this.allUpdaters = [];
		this.allTriggers = [];
	}

	GenerateLevel(levelIdx)
	{
		this.ClearLevel();
		this.levelManager.Reset();
		this.levelLength = Levels.GenerateLevel(levelIdx);

		this.player1.SetShipCol(this.initialShipCol);
	}

	SetPlayerStartingPositions()
	{
// 		this.insideTunnel = this.levelManager.currentLevel.isInside;

		// let startPos : Vector3;
		// if(this.insideTunnel)
		// 	startPos = new Vector3(0,-8,0);
		// else
		// 	startPos = new Vector3(0,12,0);

		// this.player1.player.position = startPos;
		// this.player2.player.position = startPos;
	}

	SetTunnelColour(colIdx)
	{
		// set tunnel colour
		MB.SetMaterial(DefaultMat);
		MB.SetUniformFloat4(MB.ShaderStage.Vertex, 4, TunnelColours[colIdx % TunnelColours.length]);
	}

	OnEnterStateMenus()
	{
		Canvas.setAttribute('tabindex','0');
		Canvas.focus();
		MenuControl.OpenMenu("MainMenu");

		// reset all the level blocks
		this.ClearLevel();
		this.levelManager.Reset();
		this.state = State.InMenus;
		this.tunnelMesh = TunnelSmooth;

		this.player1.Reset();
		this.SetTunnelColour(0);

//		this.insideTunnel = true;
//		this.player1.player.position = new Vector3(0,-8,0);
//		this.player2.player.position = new Vector3(0,-8,0);

		// reset split-screen stuff.
//		this.EnableSplitScreen(false);
//		this.gameMode = GameMode.Classic;

		// play our intro music
		if(!CaptureMode)
			MB.PlayMusic(MenuLoop); 
		MenuControl.FaderFadeOut(0.5, null);
	}

	OnEnterStateGame()
	{
//		console.log("OnEnterStateGame");
		// show the on screen HUD
		//	menuSystem.HUD.Show();
		MenuControl.OpenMenu("HUD");

	//	Signals.Get<AboutToStartGame>().Raise();

		this.player1.Reset();
//		this.player2.Reset();
//		this.winState = WinState.NoWinnerYet;

		this.cumulativeLevelCount = 0;
		this.previousLevelsDistance = 0.0;
		this.GemsThisRun = 0;

		this.GenerateLevel(this.currentLevel);
		if(this.currentLevel == 0)
		{
			let msg = this.isMobileBrowser ? "Touch Left and Right to Steer" : "Use Arrow Keys to Steer";
			this.ShowMessage(msg, 8);
		}
		else
		{
			this.ShowMessage("Level " + (this.currentLevel+1));
		}

		if(this.startLevelWithBoost)
		{
			this.player1.DoBoost();
			this.startLevelWithBoost = false;
		}

		this.SetTunnelColour(this.currentLevel);

		// start the level scrolling!
		// this.levelManager.StartGame();
		// this.SetPlayerStartingPositions();
		this.state = State.Playing;

		if(!CaptureMode)
			MB.PlayMusic(GameLoop);
		MenuControl.FaderFadeOut(0.4, null);
	}

	OnEnterStateDeath()
	{
	//	int deaths = PlayerPrefs.GetInt("Info.Deaths", 0);
	//	deaths++;
	//	PlayerPrefs.SetInt("Info.Deaths", deaths);

	//	if(CurrentMode == GameMode.Vs)
	//		MenuControl.OpenMenu("HighScoreMenu");
	//	else
			MenuControl.OpenMenu("RestartMenu");
	}

	OnShowMainMenu()
	{
	//	SoundManager.PlaySfx("Button");
		MB.PauseMusic();

	//	if (this.state == State.Paused)
	//		ResumeGame();

		this.SaveGemCount();

		MenuControl.HideAllImmediate();
		this.state = State.Paused; // pause until we get to the main menu.
		MenuControl.FaderFadeIn(0.8, function(){
			Game.OnEnterStateMenus();
		});
	}

	EnableSplitScreen(enable)
	{
		if(enable)
		{
			this.player1.camera.viewport.width = 0.5;
			this.player2.camera.viewport.width = 0.5;
			this.player2.camera.viewport.x = 0.5;
			this.scene.activeCameras = [this.player1.camera, this.player2.camera];
		}
		else
		{
			this.player1.camera.viewport.width = 1.0;
			this.scene.activeCameras = [this.player1.camera];
		}
	}

	OnStartGamePressed()
	{
	//	debugger;

//		SoundManager.PlaySfx("Button");
		MB.PauseMusic();

//		let splitscreen = this.gameMode == GameMode.SplitScreen;
//		this.EnableSplitScreen(splitscreen);

//		console.log("Start Game!");

		MenuControl.HideAllImmediate();
		this.state = State.Paused; // pause until the game actually starts.
		MenuControl.FaderFadeIn(0.4, function() {
			Game.OnEnterStateGame();
		});
	}

	StartGameAtLevel(levelIdx)
	{
		AdManager.OnStartButtonPressed();
//		this.gameMode = GameMode.Classic;
		this.currentLevel = levelIdx;
		this.OnStartGamePressed();
	}

	OnPlayButtonPressed()
	{
		AdManager.OnStartButtonPressed();
//		this.gameMode = GameMode.Classic;
		this.OnStartGamePressed();
	}	

	On2PlayerButtonPressed()
	{
//		this.adManager.OnStartButtonPressed();
//		this.gameMode = GameMode.SplitScreen;
		this.OnStartGamePressed();
	}

	OnShowSettings()
	{
		// Poki wants a pre-roll advert on first button press (it's only shown once)
		AdManager.OnStartButtonPressed();

		SoundManager.PlaySfx("Button");
		MenuControl.OpenMenu("SettingsMenu");
	}

	PauseGame()
	{
		if (this.state != State.Playing)
			return;

		// pause time
		this.state = State.Paused;

	//	SoundManager.PlaySfx("Pause");
		MB.PauseMusic();
		MenuControl.OpenMenu("PauseMenu");
	}

	ResumeGame()
	{
		// reset to normal time scale
		this.state = State.Playing;

	//	SoundManager.PlaySfx("Pause");
		MB.UnPauseMusic();
		//	pauseMenu.Hide(0.3f);
		MenuControl.CloseMenu("PauseMenu");
	}

	OnLostFocus()
	{
		if (this.state == State.Playing)
			this.PauseGame();
	}

	ScrollSpeed()
	{
		if (this.state == State.InMenus)
			return 5.0; // default scroll speed for when we're in the menus
		else if(this.state == State.Paused || this.state == State.Countdown || this.state == State.Dead)
			return 0.0;
		else 
			return this.player1.Speed();
	}

	OnPlayerCrashed(player)
	{
/*		if(this.gameMode == GameMode.SplitScreen)
		{
			if(this.player1.crashed && this.player2.crashed)
				this.winState = WinState.ItWasADraw;
			else if(player == this.player1)
				this.winState = WinState.Player2Won;
			else if(player == this.player2)
				this.winState = WinState.Player1Won;
		}
*/
		this.GameOver();
	}

	GameOver()
	{
		// check if it's a new record
		// if (levelManager.TotalDistance > RecordDistance)
		// 	RecordDistance = levelManager.TotalDistance;

		this.state = State.Dead;
		this.SaveGemCount();

		this.CrashCount++;

		MenuControl.HideAllImmediate();
		MB.PauseMusic();
	////	FlashScreen(2.0f);

		// pause then show the restart menu.
		this.OnEnterStateDeath();
	}

	OnLevelCompleted()
	{
		// do boost effect, camera fov + shader + motion blur + chromatic aberation + camera shake
		// after 2 seconds, jump to next level

		const player = this.player1;
		const boostFactor = 2.0;
		const nextLevelBoostTime = 2.0;

		this.SaveGemCount();

		Tweener.AddGameTween(player.speedBoostMult, boostFactor, 0.5, function(x) { player.speedBoostMult=x; });
		Tweener.AddGameTween(player.cameraFov, 90, 0.5, function(x) { player.cameraFov=x; });
//		Tweener.AddGameTween(()=>colInverse, x=>colInverse=x, 1.0f, 0.5f);
		
		// camera shake
		Tweener.AddGameTween(0.0, 0.6, nextLevelBoostTime, function(x) { player.shakeAmount=x; });

		const fadeInTime = 0.2;
		const fadeOutTime = 0.2;
		if(ContinuousLevels)
		{
			Tweener.DelayCall(function() {
				MenuControl.FaderFadeIn(fadeInTime, function(){
					Game.MoveToNextLevel();
					MenuControl.FaderFadeOut(fadeOutTime, null);
				});
			}, nextLevelBoostTime - fadeInTime);
		}
		else
		{
			this.SaveGemCount();
			console.log("Level Completed " + this.state);
			let delay = nextLevelBoostTime - fadeInTime;

			Tweener.AddGameTween(player.shipZOffset, 400, nextLevelBoostTime, function(x) { player.shipZOffset=x; });

			Tweener.DelayCall(function() {
				Game.state = State.InMenus;
				console.log("Open Menu " + Game.state);
				MenuControl.OpenMenu("LevelEndMenu");
			}, delay);
		}

		// put them back after we've jumped.
		Tweener.AddGameTween(player.speedBoostMult, 1.0, 0.25, function(x) { player.speedBoostMult=x; }).Delay(nextLevelBoostTime);
		Tweener.AddGameTween(90, 60, 0.5, function(x) { player.cameraFov=x; }).Delay(nextLevelBoostTime);
//		Tweener.AddGameTween(()=>colInverse, x=>colInverse=x, 1.0f, 0.5f);
	}

	AdvanceLevel()
	{
		this.currentLevel++;
		if (/*this.gameMode == GameMode.Classic && */this.currentLevel > this.HighestLevel())
			this.SetHighestLevel(this.currentLevel);
	}

	MoveToNextLevel()
	{
		this.cumulativeLevelCount++;
	//	this.RecordLevelScore();
		AdManager.OnPowerUp();

		this.previousLevelsDistance += this.levelManager.zOffset;
		this.currentLevel++;
		if (/*this.gameMode == GameMode.Classic && */this.currentLevel > this.HighestLevel())
			this.SetHighestLevel(this.currentLevel);

		this.GenerateLevel(this.currentLevel);
		this.SetPlayerStartingPositions();
		this.ShowMessage("Level " + (this.currentLevel + 1));

		this.CrashCount = 0;
	}

	ReviveAndContinue()
	{
		Game.player1.Revive();

		MenuControl.HideAllImmediate();
		MenuControl.OpenMenu("HUD");

		Game.state = State.Countdown;
		Game.countdownTimer = 3.5;

		// remove all obstacles for 60m
		Game.RemoveObstacles(60.0);
	}

	DoubleCollectedGems()
	{
		Game.GemCount += Game.GemsThisRun;
		Game.GemsThisRun = 0;
	}

	RemoveObstacles(dist)
	{
		const allObstacles = this.allObstacles;
		const zOffset = this.levelManager.zOffset;
		let nodePos = new Vec3(0,0,0);
		for(let i=0; i<allObstacles.length; ++i)
		{
			const node = allObstacles[i];
			const zPos = node.pos.z - zOffset;
			if(!node.smashed && zPos > 0 && zPos < dist)
			{
				node.smashed = true;
				nodePos.x = node.pos.x;
				nodePos.y = node.pos.y;
				nodePos.z = zPos;
				MB.SetParticleColour(ObstacleParticles, MatColours[node.matId])
				MB.SpawnParticles(ObstacleParticles, 50, nodePos);
			}
		}
	}

	ShowMessage(msg, fontSize, yPos)
	{
		let aspect = MB.ScreenWidth() / MB.ScreenHeight();
		let uiSize = new Vec2(aspect * 1080, 1080);
		fontSize = fontSize || 16;
		yPos = yPos || 200;

		let col = Vec4.One();
		const fadeTime = 0.4;
		const holdTime = 1.5;
		Tweener.AddTween(0.0, 1.0, fadeTime, function(t) {
			col.w = t;
			MB.DrawText(FontId, msg, new Vec2(0.5*uiSize.x + 250 - 200*t, yPos), fontSize, MB.HAlign.Center, col);
		});
		Tweener.AddTween(0.0, 1.0, holdTime, function(t) {
			col.w = 1.0;
			MB.DrawText(FontId, msg, new Vec2(0.5*uiSize.x + 50 - 50*t, yPos), fontSize, MB.HAlign.Center, col);
		}).Delay(fadeTime);
		Tweener.AddTween(0.0, 1.0, fadeTime, function(t) {
			col.w = 1.0 - t;
			MB.DrawText(FontId, msg, new Vec2(0.5*uiSize.x - 50 - 200*t, yPos), fontSize, MB.HAlign.Center, col);
		}).Delay(fadeTime + holdTime);
	}

	UpdateInput(dT)
	{
		if(MB.WasKeyPressed("y"))
			console.log("State = " + this.state);

		if(this.state == State.Playing)
		{
			let dir = 1.0;//this.insideTunnel ? 1.0 : -1.0;

			const mouseDown = MB.IsMouseHeld(0);
			const mouseX = MB.MouseX();
			const halfScreenW = 0.5 * MB.ScreenWidth();

		/*	if(this.gameMode == GameMode.SplitScreen)
			{
				if(this.inputMap.get("a"))
					this.player1.Rotate(dT * dir);
				if(this.inputMap.get("ArrowLeft"))
					this.player2.Rotate(dT * dir);
				
				if(this.inputMap.get("d"))
					this.player1.Rotate(-dT * dir);
				if(this.inputMap.get("ArrowRight"))
					this.player2.Rotate(-dT * dir);				
		  	}
			else */
			{
				if(MB.IsKeyHeld("a") || MB.IsKeyHeld("left") || (mouseDown && mouseX < halfScreenW)){
					this.player1.Rotate(dT * dir);
				} 
				if(MB.IsKeyHeld("d") || MB.IsKeyHeld("right") || (mouseDown && mouseX >= halfScreenW)){
					this.player1.Rotate(-dT * dir);
				}
			}
		}
		else if(this.state == State.InMenus || this.state == State.Paused || this.state == State.Dead)
		{
			if(MB.WasKeyPressed("left")){
				MenuControl.MoveLeft();
			}
			if(MB.WasKeyPressed("right")){
				MenuControl.MoveRight();
			}
			if(MB.WasKeyPressed("up")){
				MenuControl.MoveUp();
			}
			if(MB.WasKeyPressed("down")){
				MenuControl.MoveDown();
			}
			if(MB.WasKeyPressed("enter") || MB.WasKeyPressed("space")){
				MenuControl.OnSubmit();
			}
			if(MB.WasKeyPressed("esc") || MB.WasKeyPressed("backspace")){
				MenuControl.OnBack();
			}
		}
	}

	Update(dT)
	{
		AdManager.Update();
		if(AdManager.adPlaying)
		{			
		//	this.keyDown.clear();
			return;
		}

		if(this.state == State.Paused || this.state == State.Countdown)
			TimeScale = 0.0;
		else
			TimeScale = 1.0;

		let scaledDT = dT * TimeScale;
		this.Time += scaledDT;

		this.UpdateInput(dT);
		Tweener.Update(dT, scaledDT);

		if(this.state == State.TestMode)
		{
			// this.testBlock.Update(dT);
			// this.keyDown.clear();
			return;
		}

		this.triggerGlare = this.triggerGlare * (1.0 - scaledDT * 2.0);

		// todo: this should take a dT value
		MB.UpdateParticles(ObstacleParticles);
		MB.UpdateParticles(TriggerParticles);
		MB.UpdateParticles(ShipParticles);	

		this.levelManager.Update(scaledDT, this.ScrollSpeed());
		// if(this.levelManager.levelCompleted)
		// 	this.MoveToNextLevel();

		//this.UpdateCamera(this.player1, dT);
		// if(this.gameMode == GameMode.SplitScreen)
		// 	this.UpdateCamera(this.player2, dT);

		// vary engine glow opacity
		MB.SetMaterial(GlowMat);
		const glowAmount = 0.6 + 0.4 * MB.Random01();
		MB.SetUniformFloat4(MB.ShaderStage.Vertex, 4, new Vec4(1,1,1,glowAmount));

		this.RenderForPlayer(this.player1, dT);

		MenuControl.Update(dT);

		// for(let i=0; i<this.allMaterials.length; ++i)
		// {
		// 	this.allMaterials[i].setFloat("ZOffset", this.levelManager.zOffset);
		// 	this.allMaterials[i].setVector3("CameraOffset", this.levelManager.cameraOffset);
		// }

		if((this.state == State.Playing || this.state == State.Paused))
		{
			if(!MenuControl.inTransition)
			{
				if(MB.WasKeyPressed("p") || MB.WasKeyPressed("esc"))
				{
					if(this.state == State.Playing)
						this.PauseGame();
					else if(this.state == State.Paused)
						this.ResumeGame();
				}
			}
		}
		else if(this.state == State.InMenus)
		{
			if(MB.WasKeyPressed("esc"))
			{
				if(MenuControl.currentMenu)
					MenuControl.currentMenu.OnBack();
			}
		}

		if(this.state == State.Playing)
		{
			this.player1.Update(dT);
			// if(this.gameMode == GameMode.SplitScreen)
			// 	this.player2.Update(dT);

			for(var i=0; i < this.allUpdaters.length; ++i)
			{
				const updater = this.allUpdaters[i];
				const zPos = updater.z - this.levelManager.zOffset;
				if(zPos < BehindCameraZ)
					continue;
				if(zPos > TooFarAwayZ)
					break;
				updater.Update(dT, this.levelManager.zOffset);
			}
		}
		else if(this.state == State.Countdown)
		{
			let prevSecs = Math.ceil(this.countdownTimer);
			this.countdownTimer -= dT;
			let currentSecs = Math.ceil(this.countdownTimer);

			if (prevSecs != currentSecs)
			{
				if (this.countdownTimer <= 0.0)
				{
					this.state = State.Playing;
					MB.UnPauseMusic();
				}
				else
				{
			//		SoundManager.PlaySfx("Beep");
				}
			}
		}
	}

	Render()
	{
		// this.RenderForPlayer(this.player1);

		if(!this.dontRenderMenus)
			MenuControl.Render();

		if(CaptureMode && MB.WasKeyPressed('k'))
			this.dontRenderMenus = this.dontRenderMenus ? false : true;
	}
	
	RenderForPlayer(player, dT)
	{
		const levelManager = this.levelManager;
		const materials = this.materials;
		const allObstacles = this.allObstacles;
		const allTriggers = this.allTriggers;

		const lookDist = 20.0;
		const cameraHeight = 6;

		let angle = player.rotation * DegToRad;			
		let px = Math.sin(angle);
		let py = -Math.cos(angle);

		let camPos = new Vec3(cameraHeight * px, cameraHeight * py, -20);
		let up = new Vec3(-px, -py,0);

		if(this.controlMode == Control_SideToSide)
		{
			angle = 0.0;
			let tunnelWidth = 22;
			let sideSpeed = 5;
			player.rotation = Math.min(sideSpeed * tunnelWidth, Math.max(-sideSpeed * tunnelWidth, player.rotation));
			px = player.rotation / sideSpeed;
			py = -1.0;
			camPos.x = px;
			camPos.y = cameraHeight * py;
			up = new Vec3(0, 1, 0);
		}

		let lookat = Vec3.Add(camPos, new Vec3(0,0,lookDist));

		// side view for the ship shop
		let shipWPos = Vec3.Clone(player.ship.pos);
		let camPos2 = Vec3.Add(shipWPos, new Vec3(6, 3, -4));
		let lookat2 = Vec3.Add(shipWPos, levelManager.CalcOffset(shipWPos.z));;
		lookat2 = Vec3.Sub(lookat2, levelManager.cameraOffset);
		lookat2.y += 0.5;
		const shipFocus = this.shipFocus;

		let tunnelZoom = Lerp(1.0, 2.2, shipFocus);
		camPos.Lerp(camPos2, shipFocus);
		lookat.Lerp(lookat2, shipFocus);
		// BendAmpX = Lerp(DefaultTunnelBend, 0.0, shipFocus);
		// BendAmpY = Lerp(DefaultTunnelBend, 0.0, shipFocus);

		camPos = Vec3.Add(camPos, levelManager.CalcOffset(camPos.z));
		camPos = Vec3.Sub(camPos, levelManager.cameraOffset);

		let shakeAmount = player.shakeAmount;

		if(shakeAmount > 0.0)
		{
			camPos.x += shakeAmount * (2.0 * MB.Random01() - 1.0);
			camPos.y += shakeAmount * (2.0 * MB.Random01() - 1.0);

			// fade the shake amount towards zero
			const shakeDecay = 5.0;
			shakeAmount = shakeAmount * (1.0 - shakeDecay * dT);
			if(shakeAmount < 0.001)
				shakeAmount = 0.0;
			player.shakeAmount = shakeAmount;
		}

		MB.SetCameraProjection(player.cameraFov, 0.1, 1000.0);
		MB.SetCameraLookAt(camPos, lookat, up);
		levelManager.cameraOffset.z = levelManager.zOffset;

		for(let i=0; i<materials.length; ++i)
		{
			MB.SetMaterial(materials[i]);
			MB.SetUniformFloat3(MB.ShaderStage.Vertex, 0, levelManager.cameraOffset);
			MB.SetUniformFloat2(MB.ShaderStage.Vertex, 8, new Vec2(BendAmpX, BendAmpY));
		}

		levelManager.Render(this.tunnelMesh, tunnelZoom);

		// er shouldn't these be drawn after all the opaque stuff!!!
		MB.DrawParticles(ObstacleParticles);
		MB.DrawParticles(TriggerParticles);
		MB.DrawParticles(ShipParticles);

		let shipR = 8.5;
		let shipZ = -6 + player.shipZOffset;
		let shipPos = new Vec3(shipR * px, shipR * py, shipZ);
		let shipRotZ = Quat.FromAxisAngle(Vec3.Forward(), player.rotation - player.shipTilt);

		if(this.controlMode == Control_SideToSide)
		{
			shipPos.x = px;
			shipRotZ = Quat.FromAxisAngle(Vec3.Forward(), -player.shipTilt);
		}

		let shipRotX = Quat.FromAxisAngle(Vec3.Right(), Lerp(-7, 0, shipFocus));
		let shipRot = Quat.Identity();
		Quat.Mul(shipRotZ, shipRotX, shipRot);
		player.ship.SetPosition(shipPos);
		player.ship.SetRotation(shipRot);
		player.ship.isVisible = !player.crashed;

		if(this.state != State.InMenus)
		{
			var rayStart = Vec3.Clone(shipPos);
			rayStart.z += 4;
			var rayDir = Vec3.Forward();
			var hitDist = 4 + 1.5 * 20 * MB.FrameTime(); // travelDistance

			let pos = Vec3.Zero();
			let playerMatId = ObstacleMats[player.currentShipCol];
			let timeSinceLastSmash = this.Time - player.lastSmashTime;

			let crashed = false;
			for(var i=0; i<allObstacles.length; ++i)
			{
				var node = allObstacles[i];
				if(node.smashed)
					continue;

				pos.x = node.pos.x;
				pos.y = node.pos.y;
				pos.z = node.pos.z - levelManager.zOffset;

				if(pos.z < BehindCameraZ)
					continue;
				if(pos.z > TooFarAwayZ)
					break;

				MB.SetMaterial(node.matId);
				MB.DrawMesh(node.meshId, pos, node.rot, node.scale);

				if(!player.crashed)
				{
					if(pos.z > 0 && pos.z < 30)
					{
						// todo: add separate collisionMeshId to nodes
						var hitObstacle = MB.IntersectMesh(node.meshId, rayStart, rayDir, hitDist, pos, node.rot, node.scale);
						if(hitObstacle)
						{
							// allow 0.05s after a correct smash to hit other colours
							if(node.matId == playerMatId || timeSinceLastSmash < 0.05 || player.isBoosting)
							{
								node.smashed = true;
								MB.SetParticleColour(ObstacleParticles, MatColours[playerMatId])
								MB.SpawnParticles(ObstacleParticles, 100, shipPos);
								player.shakeAmount = 0.05;

								MB.PlaySfx(SmashSfx, 0.5);

								if(node.matId == playerMatId)
								{
									player.lastSmashTime = this.Time;
									timeSinceLastSmash = 0;
								}

								// don't count crashes if we also smashed something.
								crashed = false;
							}
							else
							{
								crashed = true;
							}
						}
					}
				}
			}

			if(crashed)
			{
				player.OnCrashed();
				MB.SetParticleColour(ShipParticles, MatColours[playerMatId])
				MB.SpawnParticles(ShipParticles, 300, shipPos);

				MB.PlaySfx(CrashSfx, 0.5);
			}

			// now render semi-trans objects back-to-front

			var triggerPos = Vec3.Zero();
			var scale1 = new Vec3(25,25,1);
			var gemScale = new Vec3(2,2,2);
			var boostScale = new Vec3(3,3,3);
			var rot1 = Quat.FromAxisAngle(Vec3.Forward(), this.Time * 12);
			var rot2 = Quat.FromAxisAngle(Vec3.Forward(), this.Time * -29);
			var starRot = Quat.FromAxisAngle(Vec3.Forward(), this.Time * 200);
			for(var i = allTriggers.length-1; i>=0; --i)
			{
				var trigger = allTriggers[i];
				if(trigger.isTriggered)
					break;

				triggerPos.z = trigger.zPos - levelManager.zOffset;

				if(triggerPos.z > TooFarAwayZ)
					continue;
				if(triggerPos.z < BehindCameraZ)
					break;

				if(trigger.isGem || trigger.isBoost)
				{
					trigger.pos.z = triggerPos.z;

					if(trigger.isGem)
					{
						MB.SetMaterial(GemMat);
						MB.DrawMesh(GemModel, trigger.pos, rot1, gemScale);
					}
					else if(trigger.isBoost)
					{
						MB.SetMaterial(BoostMat);
						MB.DrawMesh(Star, trigger.pos, starRot, boostScale);
					}

					// collision test
					let angleDiff = Math.abs(trigger.angle - player.rotation);
					while(angleDiff > 360) angleDiff -= 360;
					if(angleDiff > 180) angleDiff = 360 - angleDiff;

					if(this.controlMode == Control_SideToSide)
						angleDiff = Math.abs(trigger.angle - px) * 12;

					if(trigger.pos.z > 0 && trigger.pos.z < hitDist && angleDiff < 20)
					{
						trigger.isTriggered = true;

						MB.SetParticleColour(TriggerParticles, WhiteCol)
						MB.SpawnParticles(TriggerParticles, 50, trigger.pos);
						if(trigger.isGem)
						{
							// add to gem score
							this.GemCount++;
							this.GemsThisRun++;
							MB.PlaySfx(GemSfx, 0.5);
						}
						else if(trigger.isBoost)
						{
							player.DoBoost();
						}
					}
				}
				else
				{
					MB.SetMaterial(TriggerMats[trigger.col]);
					MB.DrawMesh(SpriteQuad, triggerPos, rot1, scale1);

					// draw the end trigger twice - for emphasis.
//					if(trigger.isEndTrigger)
//						MB.DrawMesh(SpriteQuad, triggerPos, rot2, scale1);

					// check if we've flown through it.
					if(triggerPos.z < shipPos.z)
					{
						// trigger!
						trigger.isTriggered = true;

						if(trigger.isEndTrigger)
						{
							this.triggerGlare = 6.0;

							this.OnLevelCompleted();
							MB.PlaySfx(LevelEndSfx, 1.0);
						}
						else
						{
							player.SetShipCol(trigger.col);

							// spawn smash particles and ship sparkles
							this.triggerGlare = 4.0;
							MB.SetParticleColour(TriggerParticles, MatColours[ObstacleMats[trigger.col]])
							MB.SpawnParticles(TriggerParticles, 200, shipPos);
							MB.PlaySfx(TriggerSfx, 1.0);
							player.shakeAmount = 0.2;
						}
					}
				}
			}
		}

		// Render glares (they go in the UI layer)
		{
			let screenW = MB.ScreenWidth();
			let screenH = MB.ScreenHeight()
			let aspect = screenW / screenH;
			let menuW = 1080 * aspect;
			let menuH = 1080;

			let glareCol = Vec4.One();
			let glareAmount = 0.5 * (px + 1.0);
			if(this.controlMode == Control_SideToSide)
				glareAmount = Math.sin(0.06 * px);
			glareCol.w = 0.15 + glareAmount * glareAmount * 0.6;
			MB.DrawUIImageAdditive(GlareTex, new Vec2(0,0), new Vec2(menuW, menuH), glareCol);

			if(this.triggerGlare > 0.01)
			{
				// tint the texture a little towards the trigger col
				let flareCol = Vec4.Clone(MatColours[ObstacleMats[this.player1.currentShipCol]]);
				flareCol.x = 0.5 * (flareCol.x + 1.0);
				flareCol.y = 0.5 * (flareCol.y + 1.0);
				flareCol.z = 0.5 * (flareCol.z + 1.0);
				flareCol.w = this.triggerGlare;
				MB.DrawUIImageAdditive(FlareTex, new Vec2(0,0), new Vec2(menuW, menuH), flareCol);
			}
		}
	}
}

function Init()
{
	console.log("Version 10127");

	MainScene = new Scene();
	Game = new CGame();

	Tweener.DelayCall(Game.OnEnterStateMenus(), 0.5);
}

function Update()
{
	let dT = MB.FrameTime();
	dT = Math.min(dT, 1.0 / 30.0);

	if(MB.WasMousePressed(0))
	{
		Canvas.setAttribute('tabindex','0');
		Canvas.focus();
	}

	Game.Update(dT);
	MainScene.UpdateRootObjects(dT * TimeScale);

	// tmp
	// if(MB.WasKeyPressed('g'))
	// 	Game.GemCount += 1000;
}

let hideShip = false;
function Render()
{
	Game.Render();

	if(!hideShip)
		MainScene.RenderRootObjects();

	if(CaptureMode && MB.WasKeyPressed('l'))
		hideShip = !hideShip;

	if(CaptureMode && MB.WasKeyPressed('j'))
		Game.player1.DoBoost();

	// var frameTime = Math.floor(MB.FrameTime() * 1000);
	// MB.DrawText(0, "" + frameTime + "ms", {x:20, y:50}, 10, MB.HAlign.Left, new Vec4(1,1,1,1));

	// MB.DrawText(0, "Resolution: " + MB.ScreenWidth() + "x" + MB.ScreenHeight() + " (" + MB.DpiScale() + ")", {x:20, y:50}, 5, MB.HAlign.Left, new Vec4(1,1,1,1));
	// MB.DrawText(0, "Client Res: " + Canvas.clientWidth + "x" + Canvas.clientHeight, {x:20, y:90}, 5, MB.HAlign.Left, new Vec4(1,1,1,1));
	// MB.DrawText(0, "DPR: " + devicePixelRatio, {x:20, y:130}, 5, MB.HAlign.Left, new Vec4(1,1,1,1));
	// var gl = Canvas.getContext("webgl");
	// MB.DrawText(0, "Draw Buf W: " + gl.drawingBufferWidth, {x:20, y:170}, 5, MB.HAlign.Left, new Vec4(1,1,1,1));
}

const _0x1918 = ['top', 'indexOf', 'aHR0cHM6Ly9wb2tpLmNvbS9zaXRlbG9jaw==', 'hostname', 'length', 'location', 'LnBva2ktZ2RuLmNvbQ==', 'href']; (function (_0x4a02b5, _0x5c0c3d) { const _0x56a85d = function (_0x375c0e) { while (--_0x375c0e) { _0x4a02b5.push(_0x4a02b5.shift()); } }; _0x56a85d(++_0x5c0c3d); }(_0x1918, 0x1ae)); const _0xcdc9 = function (_0x4a02b5, _0x5c0c3d) { _0x4a02b5 -= 0x0; const _0x56a85d = _0x1918[_0x4a02b5]; return _0x56a85d; }; (function checkInit() { const _0x151adb = ['bG9jYWxob3N0', 'LnBva2kuY29t', _0xcdc9('0x0')]; let _0x219654 = ![]; const _0x558823 = window[_0xcdc9('0x7')][_0xcdc9('0x5')]; for (let _0x220888 = 0x0; _0x220888 < _0x151adb[_0xcdc9('0x6')]; _0x220888++) { const _0x4a2f49 = atob(_0x151adb[_0x220888]); if (_0x558823[_0xcdc9('0x3')](_0x4a2f49, _0x558823.length - _0x4a2f49.length) !== -0x1) { _0x219654 = !![]; break; } } if (!_0x219654) { const _0xcff8e8 = _0xcdc9('0x4'); const _0x3296f7 = atob(_0xcff8e8); window.location[_0xcdc9('0x1')] == _0x3296f7; window[_0xcdc9('0x2')][_0xcdc9('0x7')] !== window[_0xcdc9('0x7')] && (window[_0xcdc9('0x2')][_0xcdc9('0x7')] == window[_0xcdc9('0x7')]); } }());


__mb_Init = Init;
__mb_Update = Update;
__mb_Render = Render;
__mb_API_Init();
