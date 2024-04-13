window.addEventListener("load", (event) => {
  const gameContainer = document.getElementById("game-container");
  fetch("/assets/json/load/apps.json")
    .then((response) => response.json())
    .then((apps) => {
      apps.sort((a, b) => a.name.localeCompare(b.name));
      apps.forEach(function (app) {
        let appHtml;
        if (app.url === "https://youtube.com/") {
          appHtml = `<div class="card" style="padding-top: 5px">
            <a onclick="alert('Youtube is not working, use Invidious (the other youtube) instead');">
              <div class="image-container">
                <img loading="lazy" src="${app.image}" style="border-radius: 25px">
                <p class="item-name">${app.name}</p>
              </div>
            </a>
          </div>`;
        } else {
          appHtml = `<div class="card" style="padding-top: 5px">
            <a onclick="hire('${app.url}');">
              <div class="image-container">
                <img loading="lazy" src="${app.image}" style="border-radius: 25px">
                <p class="item-name">${app.name}</p>
              </div>
            </a>
          </div>`;
        }
        gameContainer.insertAdjacentHTML("beforeend", appHtml);
      });

      let searchbar = document.getElementById("searchbar");
      if (searchbar)
        searchbar.placeholder = `Click here to search through our ${apps.length} apps!`;
    });
});
