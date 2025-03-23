let loadedImages = 0;

window.addEventListener("load", (event) => {
  const gameContainer = document.getElementById("game-container");
  const text = document.getElementById("text");
  const loadingBar = document.getElementById("loading-bar");

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
    text.style.display = "none";
    loadingBar.style.display = "none";
    return;
  }
  
  text.innerText = `Loading games (${loadedImages}/${totalImages})`;
  
  width = Math.round(loadedImages / totalImages);
  loadingBar.style.width = width + "%";
  loadingBar.innerHTML = width + "%";
}
