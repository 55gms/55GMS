let loadedImages = 0; // Initialize a counter for loaded images
window.addEventListener("load", (event) => {
  const gameContainer = document.getElementById("game-container");
  const text = document.getElementById("text");

  try {
    fetch("/assets/json/load/games.json")
      .then((response) => response.json())
      .then((games) => {
        games.sort((a, b) => a.name.localeCompare(b.name));
        const totalImages = games.length; // Get total number of images

        games.forEach(function (game, gameNum) {
          let gameHtml;
          if (game.usesProxy) {
            gameHtml = `<div class="card" style="padding-top: 5px">
              <a onclick="${game.alert ? `alert('${game.alert}'); ` : ""}hire('${game.url}');">
                <div class="image-container">
                  <img loading="lazy" src="${game.image}" style="border-radius: 25px" 
                       onload="handleImageLoad(${totalImages})">
                  <p class="item-name">${game.name}</p>
                </div>
              </a>
            </div>`;
          } else {
            gameHtml = `<div class="card" style="padding-top: 5px">
              <a href="${game.url}" rel="noopener noreferrer" ${game.alert ? `onclick="alert('${game.alert}');"` : ""}>
                <div class="image-container">
                  <img loading="lazy" src="${game.image}" style="border-radius: 25px" 
                       onload="handleImageLoad(${totalImages})">
                  <p class="item-name">${game.name}</p>
                </div>
              </a>
            </div>`;
          }
          gameContainer.insertAdjacentHTML("beforeend", gameHtml);
        });
      });

    const searchbar = document.getElementById("searchbar");
    if (searchbar)
      searchbar.placeholder = `Click here or type to search through our ${games.length} games!`;
  } catch (error) {
    text.innerHTML = `Error in fetching data<br>${error}`;
    console.error(error);
  }
});

// Function to handle image load
function handleImageLoad(totalImages) {
  loadedImages++; // Increment loaded images counter
  if (loadedImages >= totalImages) {
    text.style.display = "none";
    return;
  }
  text.innerText = `Loading games (${loadedImages}/${totalImages})`; // Update loading text
}
