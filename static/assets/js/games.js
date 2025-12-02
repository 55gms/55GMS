let loadedImages = 0;
window.addEventListener("load", (event) => {
  const gameContainer = document.getElementById("game-container");
  const text = document.getElementById("text");
  const loadingContainer = document.getElementById("loading-container");
  const progressBar = document.getElementById("progress-bar");
  const progressPercentage = document.getElementById("progress-percentage");
  const loadingText = document.getElementById("loading-text");

  try {
    fetch("/assets/json/load/g.json")
      .then((response) => response.json())
      .then((games) => {
        games.sort((a, b) => a.name.localeCompare(b.name));
        const totalImages = games.length;

        loadingText.textContent = `Loading ${totalImages} games...`;

        games.forEach(function (game, gameNum) {
          let gameHtml;
          if (game.usesProxy) {
            gameHtml = `<div class="game">
              <a onclick="${
                game.alert ? `alert('${game.alert}'); ` : ""
              }hire('${game.url}');">
                  <img loading="eager" src="${game.image}"
                       onload="handleImageLoad(${totalImages})">
                  <p class="text">${game.name}</p>
              </a>
            </div>`;
          } else {
            if (!game.author && game.url) {
              gameHtml = `<div class="game">
              <a href="${game.url}" rel="noopener noreferrer" ${
                game.alert ? `onclick="alert('${game.alert}');"` : ""
              }>
                  <img loading="eager" src="${game.image}"
                       onload="handleImageLoad(${totalImages})">
                  <p class="text">${game.name}</p>
              </a>
            </div>`;
            } else if (game.author && !game.url) {
              gameLink = game.image.split("/").filter(Boolean).at(-2);
              gameHtml = `<div class="game">
              <a href="/misc/play/?title=${encodeURIComponent(
                game.name
              )}&author=${encodeURIComponent(
                game.author
              )}&link=${encodeURIComponent(
                gameLink
              )}" rel="noopener noreferrer" ${
                game.alert ? `onclick="alert('${game.alert}');"` : ""
              }>
                  <img loading="eager" src="${game.image}"
                       onload="handleImageLoad(${totalImages})">
                  <p class="text">${game.name}</p>
              </a>
            </div>`;
            }
          }
          gameContainer.insertAdjacentHTML("beforeend", gameHtml);
          const searchbar = document.querySelector(".searchbar");
          if (searchbar)
            searchbar.placeholder = `Click here or type to search through our ${games.length} games!`;
        });
      });
  } catch (error) {
    text.innerHTML = `Error in fetching data<br>${error}`;
    console.error(error);
  }
});

function handleImageLoad(totalImages) {
  loadedImages++;
  const progressBar = document.getElementById("progress-bar");
  const progressPercentage = document.getElementById("progress-percentage");
  const loadingContainer = document.getElementById("loading-container");
  const loadingText = document.getElementById("loading-text");

  const percentage = Math.round((loadedImages / totalImages) * 100);

  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }

  if (progressPercentage) {
    progressPercentage.textContent = `${percentage}%`;
  }

  if (loadingText) {
    if (percentage === 100) {
      loadingText.textContent = "All games loaded!";
    } else {
      loadingText.textContent = `Loading games... (${loadedImages}/${totalImages})`;
    }
  }

  if (loadedImages >= totalImages) {
    setTimeout(() => {
      if (loadingContainer) {
        loadingContainer.style.opacity = "0";
        loadingContainer.style.transition = "opacity 0.5s ease";
        setTimeout(() => {
          loadingContainer.style.display = "none";
        }, 500);
      }
    }, 800);
    return;
  }
}
