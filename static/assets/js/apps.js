window.addEventListener("load", (event) => {
  const gameContainer = document.getElementById("game-container");
  fetch("/assets/json/load/apps.json")
    .then((response) => response.json())
    .then((apps) => {
      apps.sort((a, b) => a.name.localeCompare(b.name));
      apps.forEach(function (game) {
        let gameHtml;
        gameHtml = `<div class="game">
              <a onclick="${
                game.alert ? `alert('${game.alert}'); ` : ""
              }hire('${game.url}');">
                  <img loading="eager" src="${game.image}">
                  <p class="text">${game.name}</p>
              </a>
            </div>`;
        gameContainer.insertAdjacentHTML("beforeend", gameHtml);
      });

      let searchbar = document.querySelector(".searchbar");
      if (searchbar)
        searchbar.placeholder = `Click here to search through our ${apps.length} apps!`;
    });
});
