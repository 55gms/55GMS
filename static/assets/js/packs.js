// The deployed catalogue is encoded by scripts/build/catalogue.js: base64url
// of a 16-byte key followed by the JSON XORed with that key. Plain JSON
// (development, or an older deploy) is read as-is.
async function readCatalogue(response) {
  const text = (await response.text()).trim();
  if (text[0] === "[" || text[0] === "{") return JSON.parse(text);
  const raw = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(raw.length - 16);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = raw.charCodeAt(i + 16) ^ raw.charCodeAt(i % 16);
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

window.addEventListener("load", (event) => {
  const gameContainer = document.getElementById("game-container");
  fetch("/assets/json/load/packs.json")
    .then(readCatalogue)
    .then((apps) => {
      apps.sort((a, b) => a.name.localeCompare(b.name));
      apps.forEach(function (game) {
        let gameHtml;
        gameHtml = `<div class="game">
                <a onclick="${
                  game.alert ? `alert('${game.alert}'); ` : ""
                }window.location.href='${game.url}';">
                    <img loading="eager" src="${game.image}">
                    <p class="text">${game.name}</p>
                </a>
              </div>`;
        gameContainer.insertAdjacentHTML("beforeend", gameHtml);
      });

      let searchbar = document.querySelector(".searchbar");
      if (searchbar)
        searchbar.placeholder = `Click here to search through our ${apps.length} packs!`;
    });
});
