let audioFile = document.createElement("audio");
audioFile.muted = true;
audioFile.autoplay = true;

function setSrc(fileLocation) {
  audioFile.src = fileLocation;
}

function allowSound() {
  audioFile.play();
  document.removeEventListener("click", allowSound, false);
}

document.addEventListener("click", allowSound, false);