window.addEventListener("load", (event) => {
  const gameContainer = document.getElementById("game-container");
  fetch("/assets/json/apps.json")
    .then((response) => response.json())
    .then((apps) => {
      apps.sort((a, b) => a.name.localeCompare(b.name));
      apps.forEach(function (game) {
        let gameHtml;
        gameHtml = `<div class="card" style="padding-top: 5px">
          <a onclick="hire('${game.url}');">
            <div class="image-container">
              <img loading="lazy" src="${game.image}" style="border-radius: 25px">
              <p class="item-name">${game.name}</p>
            </div>
          </a>
        </div>`;
        gameContainer.insertAdjacentHTML("beforeend", gameHtml);
      });

      let searchbar = document.getElementById("searchbar");
      if (searchbar)
        searchbar.placeholder = `Click here to search through our ${apps.length} apps!`;
    });
});
