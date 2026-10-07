// Everything the game needs to know that is true of the T. rex and of nothing else.
//
// The pack's rule, from script/game/pack.js: anything belonging to exactly one dinosaur
// lives in that dinosaur's folder. Its missions, its customization catalog, its meshes and
// its UI art already did; these numbers did not, and were spread through player.js,
// player_game.js, npc.js, data.js and customize.js as `dinoType === 'trex' ? a : b`. Adding
// a fourth dinosaur meant finding all of them. Now it means writing one of these.
//
// Read through script/game/dino_code.js, which loads one per playable dino at boot.
export default {
	/// pack_a/trex/data.tres. Anything left out falls back to DinoData.gd's script default
	/// -- see DEFAULTS in script/game/data.js.
	stats: {
		walkSpeed: 2.0,
		runSpeed: 6.5,
		swimDepthJuvenile: -0.24,
		swimDepthTeen: -0.61,
		swimDepthAdult: -1.0,
		acceleration: 6.0,
		rotationSpeed: 2.0,
		runThresholdPercent: 0.9,
		maxHealth: 100,
		attackDamage: 20,
		eatDamage: 20,
		isFoodType: 2, // MEAT
		eatsFoodType: 2, // a carnivore: NPCs, supermeat, zwam
	},

	/// Which npc glb this dino wears as its playable mesh.
	glb: 'trex',
	/// `protect_texture` in model.tscn: the map the protect power-up's shine rides on. The
	/// trex names it after its teeth, the others after the effect.
	protectTexture: 'teeth',

	/// The body capsule, nudged forward and shortened to sit under the torso.
	bodyCollider: { forward: 0.3, y: -0.2, heightScale: 0.9 },
	/// The head projects far ahead of the body capsule; a small second probe closes that
	/// visual gap against walls and props.
	headCollider: { forward: 0.92, height: 0.78, radius: 0.24 },

	/// The DetectionArea probe. `offset` is its centre, `radiusScale` multiplies the shared
	/// radius -- pushed further out here for the longer snout. `foodRadius` is a separate
	/// tighter probe for eating; only the Ankylo needs one.
	detection: { offset: [0, 0.6, -1.31], radiusScale: 0.8, foodRadius: null, foodOffset: null },

	combat: {
		/// Milliseconds from the attack starting to its hit landing.
		impactDelay: 500,
		/// Attacks root the dino in place (the Ankylo's tail swing does).
		stationary: false,
		/// Herbivores flee a grown one of these at a run -- PlayerController.is_scary().
		scaryWhenRunning: true,
		/// What a kill's knockback is multiplied by, and whether it is launched into an arc.
		/// Both ramp in with growth where they apply; see NPC._launchCadaver.
		knockbackMultiplier: 1,
		launchesCadavers: false,
	},

	mating: {
		/// The npc type this dino pairs with.
		counterpart: 'trex',
		/// How far in front the counterpart is placed, so both matingdance clips have room.
		distance: 2.7,
	},

	/// Footfalls per animation cycle, and whether the run beat is the gallop drum.
	footsteps: { walk: 8, run: 2, gallopOnRun: false },

	/// Where the sharpening spark sits: the bone it hangs off and its offset on it.
	sharpen: { bone: 'head', sparkOffset: { x: 0.2, z: 0 } },

	/// Where an agroraptor sits when it latches on, following the shape of this dino's back.
	agroLatch: { left: 0.35, forwardPitch: 10 },

	/// How much of the customization preview the dino fills as it grows.
	previewGrowthFraction: 0.3,
}
