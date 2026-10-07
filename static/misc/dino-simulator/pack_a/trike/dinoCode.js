// Everything the game needs to know that is true of the Triceratops and of nothing else.
// See pack_a/trex/dinoCode.js for what each field means.
export default {
	/// pack_a/trike/data.tres. The herbivore: eats plants, bites softly (eatDamage stays the
	/// default 1, so bushes take several).
	stats: {
		walkSpeed: 2.0,
		runSpeed: 6.4,
		swimDepthJuvenile: -0.16,
		swimDepthTeen: -0.33,
		swimDepthAdult: -0.65,
		rotationSpeed: 2.0,
		maxHealth: 100,
		attackDamage: 20,
		isFoodType: 2,
		eatsFoodType: 1, // VEG
	},

	/// The trike player wears the triceratops mesh.
	glb: 'triceratops',
	/// Named after the effect rather than the body part: the trike's is its frill.
	protectTexture: 'protect',

	/// No body-capsule adjustment: the shared capsule already sits under this torso.
	bodyCollider: null,
	headCollider: { forward: 0.72, height: 0.68, radius: 0.24 },

	detection: { offset: [0, 0.688, -0.953], radiusScale: 1, foodRadius: null, foodOffset: null },

	combat: {
		impactDelay: 350,
		stationary: false,
		scaryWhenRunning: false,
		/// A charge sends the kill along the attack direction in a short arc, then lets it
		/// make one grounded bounce before becoming edible. Juveniles launch at a third
		/// strength, rising linearly with growth -- see TRIKE_JUVENILE_LAUNCH_MULTIPLIER.
		knockbackMultiplier: 1,
		launchesCadavers: true,
	},

	mating: { counterpart: 'triceratops', distance: 2.5 },

	/// The run beat is the gallop drum -- the one clip whose track calls play_gallop_sfx.
	footsteps: { walk: 2, run: 1, gallopOnRun: true },

	sharpen: { bone: 'head', sparkOffset: { x: 0.11, z: 0.1 } },

	agroLatch: { left: 0.3, forwardPitch: 0 },

	previewGrowthFraction: 0.6,
}
