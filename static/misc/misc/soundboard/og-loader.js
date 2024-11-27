let audioElements = {};

// Select the spinner and container elements
const spinnerElement = document.querySelector(".spinner");
const containerElement = document.querySelector(".flex-container");

// Fetch the JSON file
let hasLoaded = false;
let time = Date.now();
// Adding the time bit is for cache busting
fetch("sounds.json?t=" + time)
  .then((response) => response.json())
  .then((data) => {
    // Loop through each sound in the JSON data
    data.sounds.forEach((sound) => {
      // Create a new sound element
      const soundElement = document.createElement("div");
      soundElement.classList.add("sound");

      // Create the button element
      const buttonElement = document.createElement("button");
      buttonElement.classList.add("small-button");
      buttonElement.style.backgroundColor = sound.color;
      buttonElement.addEventListener("click", () => {
        if (audioElements[sound.name]) {
          audioElements[sound.name].currentTime = 0;
          audioElements[sound.name].play();
        }
      });
      soundElement.appendChild(buttonElement);

      // Create the name element
      const nameElement = document.createElement("p");
      nameElement.classList.add("name");
      nameElement.innerText = sound.name;
      soundElement.appendChild(nameElement);

      // Create the audio element and add it to the document
      const audioElement = document.createElement("audio");
      audioElement.src = sound.mp3;
      audioElement.preload = "auto";
      audioElements[sound.name] = audioElement;
      document.body.appendChild(audioElement);

      // Append the sound element to the container
      const containerElement = document.querySelector(".flex-container");
      containerElement.appendChild(soundElement);
    });
    // Remove the spinner element once the JSON file has been loaded
    spinnerElement.remove();
    hasLoaded = true;
    console.log(data.sounds.length + " sounds loaded!");
  })
  .catch((error) => {
    const errorMessageElement = document.createElement("h3");
    errorMessageElement.style.color = "red";
    errorMessageElement.innerText = "Error loading soundboard: " + error;

    containerElement.appendChild(errorMessageElement);
    spinnerElement.remove();
  });

setTimeout(() => {
  if (!hasLoaded) {
    // Create an error message element
    const errorMessageElement = document.createElement("h3");
    errorMessageElement.style.color = "red";
    errorMessageElement.innerText =
      "A unknown error occured while trying to load the soundboard.";

    // Add the error message element to the container and remove the spinner
    containerElement.appendChild(errorMessageElement);
    spinnerElement.remove();
  }
}, 7000);

// functions for audio control menu
function playAll() {
  for (const name in audioElements) {
    if (Object.hasOwnProperty.call(audioElements, name)) {
      const el = audioElements[name];
      el.play();
    }
  }
}
function stopAll() {
  for (const name in audioElements) {
    if (Object.hasOwnProperty.call(audioElements, name)) {
      const el = audioElements[name];
      el.pause();
      el.currentTime = 0;
    }
  }
}
