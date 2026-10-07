// gamesnacks-mock.js

// Эмуляция GameSnacks API
window.GameSnacks = {
    game: {
        firstFrameReady: function() {
            console.log("Mock: GameSnacks.game.firstFrameReady called");
        },
        ready: function() {
            console.log("Mock: GameSnacks.game.ready called");
        },
        levelComplete: function(zoneClearedCant) {
            console.log("Mock: GameSnacks.game.levelComplete called with zoneClearedCant:", zoneClearedCant);
            const progress = window.loadGameProgress() || {};
            progress.lastCompletedZone = zoneClearedCant;
            window.saveGameProgress(progress);
        },
        gameOver: function() {
            console.log("Mock: GameSnacks.game.gameOver called");
            const progress = window.loadGameProgress() || {};
            progress.gameOver = true;
            window.saveGameProgress(progress);
        }
    },
    audio: {
        subscribe: function(callback) {
            console.log("Mock: GameSnacks.audio.subscribe called");
            callback(window.loadAudioState());
        },
        isEnabled: function() {
            console.log("Mock: GameSnacks.audio.isEnabled called");
            return window.loadAudioState();
        }
    },
    ad: {
        break: function(options) {
            console.log("Mock: GameSnacks.ad.break called with options:", options);
            if (options.beforeAd) {
                options.beforeAd();
            }
            if (options.beforeReward) {
                options.beforeReward({});
            }
            if (options.adViewed) {
                options.adViewed();
            }
            if (options.adBreakDone) {
                options.adBreakDone({ completed: true });
            }
            if (options.name === "button_doubleReward") {
                const progress = window.loadGameProgress() || {};
                progress.doubleReward = true;
                window.saveGameProgress(progress);
                console.log("Double reward activated and saved");
            }
        }
    },
    saveProgress: function(data) {
        window.saveGameProgress(data);
    },
    loadProgress: function() {
        return window.loadGameProgress();
    }
};

// Отключаем флаг enGoogle, чтобы избежать ненужных вызовов GameSnacks
window.enGoogle = false;

// Функции для сохранения и загрузки прогресса в localStorage
window.saveGameProgress = function(data) {
    try {
        localStorage.setItem('FullSpeedRacingV3_Progress', JSON.stringify(data));
        console.log("Game progress saved:", data);
    } catch (e) {
        console.error("Error saving game progress:", e);
    }
};

window.loadGameProgress = function() {
    try {
        const data = localStorage.getItem('FullSpeedRacingV3_Progress');
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error("Error loading game progress:", e);
        return null;
    }
};

// Функции для управления звуком
window.saveAudioState = function(enabled) {
    try {
        localStorage.setItem('FullSpeedRacingV3_AudioEnabled', JSON.stringify(enabled));
        console.log("Audio state saved:", enabled);
    } catch (e) {
        console.error("Error saving audio state:", e);
    }
};

window.loadAudioState = function() {
    try {
        const state = localStorage.getItem('FullSpeedRacingV3_AudioEnabled');
        return state !== null ? JSON.parse(state) : true; // true по умолчанию
    } catch (e) {
        console.error("Error loading audio state:", e);
        return true;
    }
};

window.setAudioState = function(enabled) {
    console.log("Setting audio state:", enabled);
    window.saveAudioState(enabled);
    const menu = window._menu;
    if (menu) {
        const soundButton = menu.pausePanel.findByName("muteSound");
        const musicButton = menu.pausePanel.findByName("muteMusic");
        if (enabled) {
            window.muteValSound = 0;
            window.muteValMusic = 0;
            window.mutear(0, "sound");
            window.mutear(0, "music");
            if (soundButton) {
                soundButton.children[0].enabled = true;
                soundButton.children[1].enabled = false;
            }
            if (musicButton) {
                musicButton.children[0].enabled = true;
                musicButton.children[1].enabled = false;
            }
        } else {
            window.muteValSound = 1;
            window.muteValMusic = 1;
            window.mutear(1, "sound");
            window.mutear(1, "music");
            if (soundButton) {
                soundButton.children[1].enabled = true;
                soundButton.children[0].enabled = false;
            }
            if (musicButton) {
                musicButton.children[1].enabled = true;
                musicButton.children[0].enabled = false;
            }
        }
    }
};

window.mutear = function(value, type) {
    console.log(`Muting ${type} with value ${value}`);
    const app = window.pc && window.pc.app;
    if (app && type === "sound") {
        const soundComponents = app.root.findComponents('sound');
        soundComponents.forEach(component => {
            component.volume = value === 0 ? 1 : 0;
        });
    } else if (app && type === "music") {
        const music = app.root.findByName('menuMusic');
        if (music && music.sound) {
            music.sound.volume = value === 0 ? 1 : 0;
        }
    }
};

window.getAllVars = function() {
    const progress = window.loadGameProgress();
    if (progress) {
        window.autoElegido = progress.autoElegido || 0;
        window.lastCompletedZone = progress.lastCompletedZone || 0;
        window.doubleReward = progress.doubleReward || false;
        window.gameOver = progress.gameOver || false;
        console.log("Loaded game progress:", progress);
    }
};

window.guardaAllVars = function() {
    const progress = window.loadGameProgress() || {};
    progress.monedas = window.monedas || 0;
    progress.autoElegido = window.autoElegido || 0;
    progress.lastCompletedZone = window.lastCompletedZone || 0;
    progress.doubleReward = window.doubleReward || false;
    progress.gameOver = window.gameOver || false;
    window.saveGameProgress(progress);
    console.log("guardaAllVars called, progress saved:", progress);
};

// Принудительно отключаем enGoogle после всех скриптов
setTimeout(() => {
    window.enGoogle = false;
    console.log("enGoogle forced to false");
}, 0);
