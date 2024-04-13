window.addEventListener("load", (event) => {
  const gameContainer = document.getElementById("game-container");
  fetch("/assets/json/load/games.json")
    .then((response) => response.json())
    .then((games) => {
      games.sort((a, b) => a.name.localeCompare(b.name));
      games.forEach(function (game) {
        let gameHtml;
        if (game.usesProxy) {
          gameHtml = `<div class="card" style="padding-top: 5px">
          <a onclick="${game.alert ? `alert('${game.alert}');` : ""} hire('${
            game.url
          }');">
            <div class="image-container">
              <img loading="lazy" src="${
                game.image
              }" style="border-radius: 25px">
              <p class="item-name">${game.name}</p>
            </div>
          </a>
        </div>`;
        } else if (!game.usesProxy) {
          gameHtml = `<div class="card" style="padding-top: 5px">
            <a href="${game.url}" rel="noopener noreferrer" ${
            game.alert ? `onclick="alert('${game.alert}');"` : ""
          }>
            <div class="image-container">
              <img loading="lazy" src="${
                game.image
              }" style="border-radius: 25px">
              <p class="item-name">${game.name}</p>
            </div>
          </a>
          </div>`;
        }
        gameContainer.insertAdjacentHTML("beforeend", gameHtml);
      });

      let searchbar = document.getElementById("searchbar");
      if (searchbar)
        searchbar.placeholder = `Click here to search through our ${games.length} games!`;
    });
});
