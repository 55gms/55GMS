var donePlayingIntro = false;

/**
 * Play the Armor Games intro
 * @param {string} windowHandle the canvas element 
 * @param {string} directory Directory to find the armor games intros in. A / will be automatically added
 */
function playArmorGamesIntro(windowHandle, onDone) {
    donePlayingIntro = false;

    var videoElementA = document.createElement("a");
    videoElementA.style.textDecoration = "none";
    videoElementA.href = "https://amazinggames.io";
    videoElementA.target = "_blank";

    var directory = "site-specific/armorgames";

    var videoElement = document.createElement("video");
    if (videoElement == null) {
        donePlayingIntro = true;
        return;
    }

    if (videoElement.canPlayType("video/ogg")) {
        videoElement.setAttribute("src", directory + "/armorIntro.ogv");
    } else if (videoElement.canPlayType("video/x-m4v")) {
        videoElement.setAttribute("src", directory + "/armorIntro.m4v");
    } else if (videoElement.canPlayType("video/webm")) {
        videoElement.setAttribute("src", directory + "/armorIntro.webm");
    } else {
        console.log("Cannot play Armor Games intro, skipping!");
        donePlayingIntro = true;
        return;
    }

    videoElement.setAttribute("width", windowHandle.width);
    videoElement.setAttribute("height", windowHandle.height);
    videoElement.style.backgroundColor = "black";
    videoElement.style.position = "fixed";
    var rect = windowHandle.getBoundingClientRect();
    videoElement.style.left = rect.left + "px";
    videoElement.style.top = rect.top + "px";
    var promise = videoElement.play();
    if (promise !== undefined) {
        promise.catch(function(err) {
            videoElement.muted = true;
            promise = videoElement.play();
            promise.catch(function(err) {
                //Failed, skip the intro
                finalizeIntro();
            });
        });
    }

    videoElement.addEventListener("ended", function() {
        finalizeIntro();
    });
    videoElementA.appendChild(videoElement);
    document.body.appendChild(videoElementA);

    /**
     * Finalize the intro animation.
     */
    function finalizeIntro() {
        document.body.removeChild(videoElementA);
        donePlayingIntro = true;
        videoElement = null;
        onDone();
    }

    window.resizeArmorGamesIntro = function() {
        if (donePlayingIntro) return;

        videoElement.setAttribute("width", windowHandle.width);
        videoElement.setAttribute("height", windowHandle.height);
        videoElement.style.backgroundColor = "black";
        videoElement.style.position = "fixed";
        var rect = windowHandle.getBoundingClientRect();
        videoElement.style.left = rect.left + "px";
        videoElement.style.top = rect.top + "px";
    }
}