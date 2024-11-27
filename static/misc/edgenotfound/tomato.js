//TOMATO

//TIMING
class Timing {
	constructor(minFrameLength, maxFrameLength) {
		this.minFrameLength = minFrameLength;
		this.maxFrameLength = maxFrameLength;
		this.lastUpdate = new Date();

		this.currentFrameLength = 0;
		this.stepsProcessed = 0;
		this.timePlaying = 0;
	}

	update(overwrite = null) {
		const newUpdate = new Date();

		if (!overwrite) {
			this.currentFrameLength = (newUpdate - this.lastUpdate) / 1000;
		} else {
			this.currentFrameLength = overwrite;
		}

		this.lastUpdate = newUpdate;
		this.timePlaying += this.currentFrameLength;
		this.stepsProcessed += 1;
	}

	fps() {
		return (1 / this.currentFrameLength)
	}

	perSecond(v) {
		return v * this.currentFrameLength;
	}
}

//COLLISIONS
/*class Vector2 {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	//Returns a new Vector2 with the x and y axis swapped around.
	swap() {return new Vector2(this.y, this.x)}
}

class Hitbox {
	constructor(xOffset, yOffset, width, height) {
		this.origin = new Vector2(xOffset, yOffset); //Topleft corner
		this.width = width;
		this.height = height;
	}

	//Render this hitbox for debugging purposes. If the point falls in the hitbox, change appearance.
	render(ctx, point = null) {
		ctx.beginPath();

		if (point != null && PointInRectangle(point, this)) {
			console.log("True!");
			ctx.lineWidth = 5;
		} else {
			ctx.lineWidth = 1;
		}

		ctx.rect(this.origin.x, this.origin.y, this.width, this.height);
		ctx.stroke();
	}
}

//A square hitbox with the origin in the center.
function HitboxSquare(xOffset, yOffset, size) {
	return new Hitbox(xOffset, yOffset, size, size, size, size);
}

function PointInRectangle(point, hitbox) {
	return (point.x > hitbox.origin.x && point.x < hitbox.origin.x + hitbox.width 
		&& point.y > hitbox.origin.y && point.y < hitbox.origin.y + hitbox.height )
}*/

//INPUT
const pressedState = {
	IDLE: 0,
	PRESSED: 1,
	HELD: 2,
	RELEASED: 3
};

class InputHandler {
	constructor(positiveKeys, negativeKeys = null, timer = null, timeForRefiring = 0, extraTimeForFirstRefire = 0) {
		this.delta = 0;
		this.posKeysHeld = [];
		this.negKeysHeld = [];
		this.timer = timer;
		this.prevHeldTime = 0;
		this.heldTime = 0;
		this.fired = false;

		this.waitForRefiring = timeForRefiring;
		this.firstWaitForRefiring = timeForRefiring + extraTimeForFirstRefire;
		this.timeSinceLastRefire = 0;
		this.timesFired = 0;

		this.state = pressedState.IDLE;

		if (positiveKeys) {
			positiveKeys.forEach((element) => {
				window.addEventListener('keydown', (event) => {
					if (this.change(event, element)) {
						var push = PushUnique(this.posKeysHeld, element);
						if (push.changed) {
							this.posKeysHeld = push.array;
							this.updateDelta();
						}
					}
				});
				window.addEventListener('keyup', (event) => {
					if (this.change(event, element)) {
						this.posKeysHeld = SpliceUnique(this.posKeysHeld, element);
						this.updateDelta();
					}
				});
			});
		}
		this.positiveKeys = positiveKeys;

		if (negativeKeys) {
			negativeKeys.forEach((element) => {
				window.addEventListener('keydown', (event) => {
					if (this.change(event, element)) {
						var push = PushUnique(this.negKeysHeld, element);
						if (push.changed) {
							this.negKeysHeld = push.array;
							this.updateDelta();
						}
					}
				});
				window.addEventListener('keyup', (event) => {
					if (this.change(event, element)) {
						this.negKeysHeld = SpliceUnique(this.negKeysHeld, element);
						this.updateDelta();
					}
				});
			});
		}
		this.negativeKeys = negativeKeys;
	}

	change(event, element) {
		return (event.code == element || event.keyCode == element);
	}

	updateDelta() {
		const diff = this.posKeysHeld.length - this.negKeysHeld.length;
		if (diff > 0 && this.delta != 1) {
			this.delta = 1;
			this.heldTime = 0;
			this.timesFired = 0;
			this.timeSinceLastRefire = 0;
		} else if (diff < 0 && this.delta != -1) {
			this.delta = -1;
			this.heldTime = 0;
			this.timesFired = 0;
			this.timeSinceLastRefire = 0;
		} else if (this.delta != 0) {
			this.delta = 0;
			this.heldTime = 0;
			this.timesFired = 0;
			this.timeSinceLastRefire = 0;
		}
	}

	update() {
		if (this.timer && this.delta != 0) {
			this.heldTime += this.timer.currentFrameLength;
			this.timeSinceLastRefire += this.timer.currentFrameLength;

			if (this.prevHeldTime == 0 || (this.timesFired > 1 && this.timeSinceLastRefire >= this.waitForRefiring) || (this.timesFired <= 1 && this.timeSinceLastRefire >= this.firstWaitForRefiring)) {
				this.fired = true;
				this.timesFired += 1;
				this.timeSinceLastRefire = 0;
			} else {
				this.fired = false;
			}
		} else {
			this.fired = false;
		}

		//Set state
		if (this.delta == 0) {
			if (this.prevHeldTime != 0) {
				this.state = pressedState.RELEASED;
			} else {
				this.state = pressedState.IDLE;
			}
		} else {
			if (this.prevHeldTime == 0) {
				this.state = pressedState.PRESSED;
			} else {
				this.state = pressedState.HELD;
			}
		}

		this.prevHeldTime = this.heldTime;

		//console.log("State: " + this.state + " Fired: " + this.timeSinceLastRefire);
	}

	reset() {
		this.posKeysHeld = [];
		this.negKeysHeld = [];
		this.state = pressedState.IDLE;
		this.fired = false;
		this.delta = 0;
		this.heldTime = 0;
		this.timesFired = 0;
		this.timeSinceLastRefire = 0;
	}
}

///MISC
function Clamp(nr, min, max) {
	return Math.max(min, Math.min(nr, max));
}

function PushUnique(array, newEntry) {
	var changed = false;
	if (array.indexOf(newEntry) === -1) {
		array.push(newEntry);
		changed = true;
	}
	return {array: array, changed: changed};
}

function SpliceUnique(array, EntryToSplice) {
	const index = array.indexOf(EntryToSplice);
	if (index > -1) {
		array.splice(index, 1);
	}
	return array;
}

//console.log("🍅 Tomato loaded successfully! Version 0.1.0");