let loadedImages = 0;
let text; // Declare in global scope
let loadingBar; // Declare in global scope
let loadingBarContainer; // Add container reference
let loadingText; // Add text element reference

window.addEventListener("load", (event) => {
  const gameContainer = document.getElementById("game-container");
  text = document.getElementById("text"); // Assign to global variable
  loadingBar = document.getElementById("loading-bar"); // Assign to global variable
  loadingBarContainer = document.getElementById("loading-bar-container"); // Get container
  loadingText = document.getElementById("loading-text"); // Get text element
  
  try {
    fetch("/assets/json/load/games-test.json")
      .then((response) => response.json())
      .then((categories) => {
        let totalImages = 0;
        categories.forEach(category => totalImages += category.games.length);
        categories.forEach(category => {
          if (category.games.length > 0) {
            const categoryHeader = `<h2 class="category-header">${category.category}</h2>`;
            gameContainer.insertAdjacentHTML("beforeend", categoryHeader);
          }
          category.games.sort((a, b) => a.name.localeCompare(b.name));
          
          category.games.forEach(game => {
            let gameHtml;
            if (game.usesProxy) {
              gameHtml = `<div class="game">
                <a onclick="${game.alert ? `alert('${game.alert}'); ` : ""}hire('${game.url}');">
                    <img loading="eager" src="${game.image}"
                         onload="handleImageLoad(${totalImages})">
                    <p class="text">${game.name}</p>
                </a>
              </div>`;
            } else {
              gameHtml = `<div class="game">
                <a href="${game.url}" rel="noopener noreferrer" ${game.alert ? `onclick="alert('${game.alert}');"` : ""}>
                    <img loading="eager" src="${game.image}"
                         onload="handleImageLoad(${totalImages})">
                    <p class="text">${game.name}</p>
                </a>
              </div>`;
            }
            gameContainer.insertAdjacentHTML("beforeend", gameHtml);
          });
        });
        const searchbar = document.getElementById("searchbar");
        if (searchbar)
          searchbar.placeholder = `Click here or type to search through our ${totalImages} games!`;
      });
  } catch (error) {
    text.innerHTML = `Error in fetching data<br>${error}`;
    console.error(error);
  }
});

function handleImageLoad(totalImages) {
  loadedImages++;
  if (loadedImages >= totalImages) {
    loadingBarContainer.style.display = "none";
    return;
  }
  let width = Math.round(loadedImages / totalImages * 100);
  loadingBar.style.width = width + "%";
  loadingText.textContent = width + "%"; // Update the text content
}
