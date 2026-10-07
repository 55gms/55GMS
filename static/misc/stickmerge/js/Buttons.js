class Button extends Phaser.GameObjects.Image {
	constructor(x, y, texture, frame, callback, scene, link) {
		super(scene, x, y, texture, frame);

		this.setInteractive({ useHandCursor: true });

		this.currentPointer = null;

		this.on('pointerdown', this.onPointerDown, this);
		this.scene.input.on('pointerup', this.onScenePointerUp, this)

		scene.add.existing(this);

		this.callback = callback;
		this.scene = scene;
		this.link = link;

	}

	enableInput() {
		this.setInteractive();
	}

	disableInput() {
		this.disableInteractive();
	}

	setEnable(bool) {
		if(bool){
			this.setAlpha(1.0);
			this.enableInput();
		}else{
			this.setAlpha(0.6);
			this.disableInput();
		}
	}

	onPointerDown(pointer){
		this.playPressedTween();

		this.currentPointer = pointer;
	}

	onScenePointerUp(pointer, objects) {
		if (this.currentPointer && this.currentPointer === pointer) {
			this.currentPointer = null

			var isPointerOverButton = objects.includes(this);
			if (isPointerOverButton) {
				MainGame.Sfx.play('sound','click');

				if(this.link){
					this.callback.call(this.link);
				}else{
					this.callback.call(this.scene);
				}
			}

			this.playReleasedTween();

		}
	}

	playPressedTween() {
		this.originalScale = 1

		if(this.scene){
			this.scene.tweens.add({
				targets: this,
				scale: this.scale * 0.9,
				ease: Phaser.Math.Easing.Cubic.Out,
				duration: 50,
			})
		}
	}

	playReleasedTween() {
		if(this.scene){
			this.scene.tweens.add({
				targets: this,
				scale: this.originalScale,
				ease: Phaser.Math.Easing.Back.Out,
				duration: 300,
			})
		}
	}
};

class ButtonText extends Phaser.GameObjects.Container {
	constructor(x, y, texture, frame, callback, scene, text, params, link) {
		super(scene);

		this.x = x;
		this.y = y;

		this.currentPointer = null;

		this.callback = callback;
		this.params = params;
		this.scene = scene;
		this.link = link;

		this.addBack(texture, frame);
		if(text != null) this.addText(' '+ text + ' ');
	}

	enableInput() {
		this.back.setInteractive();
	}

	disableInput() {
		this.back.disableInteractive();
	}

	setEnable(bool) {
		if(bool){
			this.back.setAlpha(1.0);
			this.enableInput();
		}else{
			this.back.setAlpha(0.6);
			this.disableInput();
		}
	}

	addBack(texture, frame){
		this.back = this.scene.add.image(0, 0, texture, frame);
		this.back.setInteractive({ useHandCursor: true });
		this.back.on('pointerdown', this.onPointerDown, this);
		this.scene.input.on('pointerup', this.onScenePointerUp, this)

		this.add(this.back);
	}

	addText(text){
		text = text.toUpperCase();

		var txt = this.scene.add.bitmapText(0, -1, 'Panton', text);
        txt.setFontSize(30);
        txt.setOrigin(0.5);

		this.add(txt);
		this.text = txt;
	}

	onPointerDown(pointer){
		this.playPressedTween();

		this.currentPointer = pointer;
	}

	onScenePointerUp(pointer, objects) {
		if (this.currentPointer && this.currentPointer === pointer) {
			this.currentPointer = null

			var isPointerOverButton = objects.includes(this.back);

			if (isPointerOverButton) {
				MainGame.Sfx.play('sound','click');

				if(this.link){
					this.callback.call(this.link, this.params);
				}else{
					this.callback.call(this.scene, this.params);
				}
			}

			this.playReleasedTween();

		}
	}

	playPressedTween() {
		this.originalScale = 1

		if(this.scene){
			this.scene.tweens.add({
				targets: this,
				scale: this.scale * 0.9,
				ease: Phaser.Math.Easing.Cubic.Out,
				duration: 50,
			})
		}
	}

	playReleasedTween() {
		if(this.scene){
			this.scene.tweens.add({
				targets: this,
				scale: this.originalScale,
				ease: Phaser.Math.Easing.Back.Out,
				duration: 300,
			})
		}
	}
};
