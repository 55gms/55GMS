const GameLoader = {
    totalSizeBytes: 0,
    totalSizeMB_Str: "0",
    loadedBytes: 0,

    ui: {
        loader: null,
        gameContainer: null,
        fill: null,
        amount: null,
        comment: null,
        title: null
    },

    config: null,

    init: function(config) {
        this.config = config;

        this.ui.loader = document.getElementById("loader");
        this.ui.gameContainer = document.getElementById("game-container");
        this.ui.fill = document.getElementById("progress-fill");
        this.ui.amount = document.getElementById("progress-amount");
        this.ui.comment = document.getElementById("progress-comment");
        this.ui.title = document.getElementById("game-title");

        if (this.ui.title && config.productName) {
            this.ui.title.textContent = config.productName;
        }

        const thumbnail = document.getElementById("thumbnail");
        if (thumbnail && config.icon) {
            thumbnail.src = config.icon;
        }

        const gameName = this._extractGameName(config.dataUrl);

        this._calculateTotalSize(config);
    },

    updateProgress: function(progress) {
        const percent = Math.round(progress * 100);

        if (GameLoader.ui.fill) {
            GameLoader.ui.fill.style.width = percent + "%";
        }

        GameLoader._updateText(percent);

        if (GameLoader.ui.comment) {
            if (percent < 10) {
                GameLoader.ui.comment.textContent = "Initializing...";
            } else if (percent < 30) {
                GameLoader.ui.comment.textContent = "Loading assets...";
            } else if (percent < 70) {
                GameLoader.ui.comment.textContent = "Loading...";
            } else if (percent < 95) {
                GameLoader.ui.comment.textContent = "Almost there...";
            } else {
                GameLoader.ui.comment.textContent = "Starting game...";
            }
        }

        if (progress >= 1) {
            setTimeout(() => {
                GameLoader._hideLoader();
            }, 500);
        }
    },

    _updateText: function(percent) {
        if (!this.ui.amount) return;

        if (this.totalSizeBytes > 0) {
            this.ui.amount.textContent = percent + "% of " + this.totalSizeMB_Str + "MB";
        } else {
            this.ui.amount.textContent = percent + "%";
        }
    },

    _hideLoader: function() {
        if (this.ui.loader) {
            this.ui.loader.classList.add("hidden");
        }
        if (this.ui.gameContainer) {
            this.ui.gameContainer.classList.remove("hidden");
        }
    },

    _extractGameName: function(dataUrl) {
        const match = dataUrl.match(/Build\/(.+?)\.data/);
        return match ? match[1] : "game";
    },

    _calculateTotalSize: function(config) {
        const filesToCheck = [
            config.dataUrl,
            config.frameworkUrl,
            config.codeUrl
        ];

        Promise.all(filesToCheck.map(url => this._getFileSize(url)))
            .then(sizes => {
                this.totalSizeBytes = sizes.reduce((a, b) => a + b, 0);
                this.totalSizeMB_Str = (this.totalSizeBytes / (1024 * 1024)).toFixed(1);
                this._updateText(0);
            })
            .catch(error => {
                console.warn("Could not determine file sizes:", error);
                this.totalSizeMB_Str = "?";
            });
    },

    _getFileSize: function(url) {
        return fetch(url, { method: 'HEAD' })
            .then(res => {
                const size = res.headers.get('Content-Length');
                return size ? parseInt(size) : 0;
            })
            .catch(() => 0);
    }
};

(function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    height: 100%;
    width: 100%;
    background: #202F4E;
    overflow: hidden;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #fff;
}

canvas {
    display: block;
    width: 100%;
    height: 100%;
    touch-action: none;
}

#game-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

#game-container.hidden {
    display: none !important;
}

#loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: #202F4E;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.5s ease;
}

#loader.hidden {
    display: none !important;
    opacity: 0;
    pointer-events: none;
}

#preloader {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

#preloader-top {
    width: 90%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    animation: bounceInDown 0.8s ease-out forwards;
}

#thumbnail {
    width: 120px;
    height: 120px;
    border-radius: 20px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
    margin-bottom: 20px;
    object-fit: cover;
    transition: all 0.3s ease;
}

#preloader-top-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#game-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    letter-spacing: 1px;
}

#progress-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

#progress-bar {
    width: 100%;
    height: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}

#progress-fill {
    height: 100%;
    width: 0%;
    background-color: #3CF7DC;
    border-radius: 10px;
    transition: width 0.2s ease-out;
    box-shadow: 0 0 10px rgba(60, 247, 220, 0.3);
    animation: fillColor 3s infinite linear;
}

@keyframes fillColor {
    0% { background-color: #3CF7DC; }
    25% { background-color: #FFA9BE; }
    50% { background-color: #FFDC00; }
    75% { background-color: #E0AEF5; }
    100% { background-color: #3CF7DC; }
}

#progress-amount {
    font-size: 16px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.9);
    white-space: nowrap;
}

#progress-comment {
    font-size: 13px;
    opacity: 0.6;
    margin-top: 5px;
    min-height: 20px;
}

@keyframes bounceInDown {
    from, 60%, 75%, 90%, to {
        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    }
    0% {
        opacity: 0;
        transform: translate3d(0, -3000px, 0);
    }
    60% {
        opacity: 1;
        transform: translate3d(0, 25px, 0);
    }
    75% {
        transform: translate3d(0, -10px, 0);
    }
    90% {
        transform: translate3d(0, 5px, 0);
    }
    to {
        transform: none;
    }
}

@media screen and (max-height: 500px) {
    #thumbnail { display: none; }
    #game-title { font-size: 20px; margin-bottom: 15px; }
    #preloader-top { max-width: 500px; }
}
    `;
    document.head.appendChild(style);
})();
