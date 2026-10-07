// Everything the game needs to know that is true of the Ankylosaurus and of nothing else.
// See pack_a/trex/dinoCode.js for what each field means.
//
// This one uses the shipped NPC model as its playable mesh, and its starter art is
// deliberately placeholder Trike art under pack_a/ankylo, so it can be replaced without
// touching game code or the picker and customization UI.
export default {
	stats: {
		/// 20% slower than the Trike, matching its deliberately heavy movement feel.
		walkSpeed: 1.6,
		runSpeed: 5.12,
		/// Raised slightly so the juvenile's body remains visible above the water.
		swimDepthJuvenile: -0.12,
		swimDepthTeen: -0.35,
		swimDepthAdult: -0.6,
		acceleration: 4.0,
		rotationSpeed: 2.0,
		maxHealth: 300,
		attackDamage: 35,
		/// Match Trike's food pacing: normal plant bite damage and nutrition per bite.
		eatDamage: 1,
		consumeValue: 10,
		isFoodType: 2,
		eatsFoodType: 1, // VEG
	},

	glb: 'ankylo',
	protectTexture: 'protect',

	/// Squat: the shared capsule is far taller than this body, so it is cut to just over
	/// half height and left centred.
	bodyCollider: { forward: 0, y: 0, heightScale: 0.55 },
	/// No second head probe: this one's head does not project past its body capsule.
	headCollider: null,

	/// The tail attack swings across its left side, so the combat probe sits off-centre.
	/// That broad probe reaches well past its short head, so eating uses a tighter snout
	/// probe instead -- otherwise the prompt and the bite fire while the food is still in
	/// open air.
	detection: {
		offset: [-0.25, 0.688, -0.953], radiusScale: 1,
		foodRadius: 0.42, foodOffset: [0, 0.5, -0.72],
	},

	combat: {
		impactDelay: 500,
		/// The tail swing plants its feet.
		stationary: true,
		/// ...but a swing STARTED at a run keeps a little of that momentum instead of
		/// stopping dead: this fraction of the normal move speed, for the swing's duration.
		attackSlideMultiplier: 0.12,
		scaryWhenRunning: false,
		/// Three times the normal force at full growth, ramping in from the juvenile's
		/// ordinary swing -- see ANKYLO_KNOCKBACK_MULTIPLIER.
		knockbackMultiplier: 3,
		launchesCadavers: false,
	},

	/// The shorter dance is authored at two world units.
	mating: { counterpart: 'ankylo', distance: 2 },

	footsteps: { walk: 2, run: 1, gallopOnRun: true },

	/// It sharpens its tail club, not its head.
	sharpen: { bone: 'tail3', sparkOffset: { x: 0.2, z: 0 } },

	agroLatch: { left: 0.4, forwardPitch: 20 },

	previewGrowthFraction: 0.6,
}
