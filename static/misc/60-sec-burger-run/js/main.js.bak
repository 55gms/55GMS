var screenWidth = 512;
var screenHeight = 288;
var rotDevice;
var world;
var levl = 0;
var mu;
var vol = 1;
var ld;
var wait = 0;
var clickFX;

function unlockAllLevels() {
    if (!game) {
        return;
    }
    game.ldat = 16;
    if (levl == -1) {
        newState();
    }
}
var MainState = {
    preload: function() {
        world = this;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        game.stage.backgroundColor = "#000000";
        game.load.image('black', 'assets/img/black.gif');
        game.load.image('rotateDevice', 'assets/img/rotateDevice.gif');
        game.load.image('loading1', 'assets/img/loading1.gif');
        game.load.image('preloadBar', 'assets/img/preloadBar.gif');
    },
    create: function() {
        game.splashCT = 60 * 3;
        storageAvailable();
        if (game.storageAvailable) {
            game.ldat = localStorage.getItem('ldat');
        }
        if (!game.ldat) {
            game.ldat = 1;
        }
        game.scale.onSizeChange.add(onSizeChange);
        game.scale.setResizeCallback(onSizeChange);
        onSizeChange();
    },
    update: function() {
        game.state.start('Loader');
        game.scale.onOrientationChange.add(oriChange, game);
    	oriChange();
    }
};

function oriChange(e) {
    var ori = 'landscape';
    if (game.scale.screenOrientation === 'portrait-primary' || game.scale.screenOrientation === 'portrait-secondary') {
        ori = 'portrait';
    }
    if (ori == 'landscape') {
        if (rotDevice) {
            rotDevice.destroy();
            rotDevice = null;
        }
        if (!game.keepPaused) {
            game.paused = false;
            muResume();
        }
    } else {
        game.keepPaused = null;
        if (game.paused) {
            game.keepPaused = true;
        }
        muPause();
        rotDevice = game.add.group();
        rotDevice.bg = rotDevice.create(0, 0, 'black');
        rotDevice.bg.anchor.setTo(0);
        rotDevice.bg.width = screenWidth;
        rotDevice.bg.height = screenHeight;
        rotDevice.rd = rotDevice.create(0, 0, 'rotateDevice');
        rotDevice.rd.anchor.setTo(0.5);
        rotDevice.rd.x = screenWidth / 2;
        rotDevice.rd.y = screenHeight / 2;
        game.paused = true;
    }
}

function storageAvailable() {
    game.storageAvailable = true;
    if (typeof localStorage === 'object') {
        try {
            localStorage.setItem('localStorage', 1);
            localStorage.removeItem('localStorage');
        } catch (e) {
            Storage.prototype._setItem = Storage.prototype.setItem;
            Storage.prototype.setItem = function() {};
            game.storageAvailable = false;
        }
    } else {
        game.storageAvailable = false;
    }
}

function newState() {
    game.paused = false;
    game.world.setBounds(0, 0, screenWidth, screenHeight);
    if (levl > 16) {
        levl = -9;
    }
    if (levl > 0) {
        game.state.start('Level');
        return;
    }
    if (levl == 0) {
        game.state.start('Title');
        return;
    }
    if (levl == -1) {
        game.state.start('LevelSelect');
        return;
    }
    if (levl == -9) {
        game.state.start('GameOver');
        return;
    }
}

function click() {}

function setDimensionsDesktop() {
    if (window.innerWidth > window.innerHeight && window.innerWidth > 512 && window.innerWidth < 801) {
        screenWidth = window.innerWidth;
        screenHeight = Math.ceil(screenWidth / 16 * 9);
    }
}
setDimensionsDesktop();
var game = new Phaser.Game(screenWidth, screenHeight, Phaser.AUTO);
game.preserveDrawingBuffer = true;
game.state.add('Main', MainState);
game.state.add('Loader', LoaderState);
game.state.add('Title', TitleState);
game.state.add('Level', LevelState);
game.state.add('GameOver', GameOverState);
game.state.start('Main');

function settings(st) {
    st.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    onSizeChange();
    st.scale.pageAlignHorizontally = true;
    st.scale.pageAlignVertically = true;
    game.stage.backgroundColor = "#000000";
}

function onSizeChange() {
    prevScreenHeight = screenHeight;
    screenHeight = Math.ceil(screenWidth / window.innerWidth * window.innerHeight);
    if (prevScreenHeight != screenHeight) {
        game.scale.setGameSize(screenWidth, screenHeight);
        resetGamePad();
        if (rotDevice) {
            rotDevice.bg.width = screenWidth;
            rotDevice.bg.height = screenHeight;
            rotDevice.rd.x = screenWidth / 2;
            rotDevice.rd.y = screenHeight / 2;
        }
    }
}

function muPlay(st, vol, loop) {
    var m = false;
    if (mu && mu.key != st) {
        var m = mu.mute;
        mu.stop();
        mu.destroy();
        mu = null;
    }
    if (!mu) {
        mu = game.add.audio(st);
        mu.loop = false;
        if (loop) {
            mu.loop = true;
        }
        mu.mute = m;
        mu.xVol = vol;
        game.sound.setDecodedCallback([mu], soundsDecoded, game);
    }
}

function fxPlay(fx) {
    if (!game.muteFX) {
        fx.play();
    }
}

function clickSound() {
    if (!game.muteFX) {
        clickFX.play();
    }
}

function muPause() {
    if (mu) {
        mu.pause();
    }
}

function muResume() {
    if (mu) {
        mu.resume();
    }
}

function soundsDecoded() {
    mu.play(null, 0, vol * mu.xVol, mu.loop);
    setMuFXBtns();
}
