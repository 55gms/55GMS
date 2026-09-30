// Thumbnails above the fold load immediately; the rest load as they scroll in.
const EAGER_THUMBNAILS = 24;
let loadingFadeTimer;
let loadingHideTimer;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("retry-games")?.addEventListener("click", loadGames);
  loadGames();
});

async function loadGames() {
  const gameContainer = document.getElementById("game-container");
  const loadingContainer = document.getElementById("loading-container");
  const progressBar = document.getElementById("progress-bar");
  const progressPercentage = document.getElementById("progress-percentage");
  const loadingText = document.getElementById("loading-text");
  const retryButton = document.getElementById("retry-games");

  clearTimeout(loadingFadeTimer);
  clearTimeout(loadingHideTimer);
  gameContainer.replaceChildren();
  loadingContainer.style.display = "flex";
  loadingContainer.style.opacity = "1";
  loadingText.textContent = "Loading games…";
  progressBar.style.width = "0%";
  progressBar.setAttribute("aria-valuenow", "0");
  progressPercentage.textContent = "0%";
  retryButton.hidden = true;

  try {
    const response = await fetch("/assets/json/load/g.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const games = await response.json();
    games.sort((a, b) => a.name.localeCompare(b.name));

    const cards = games.map(createGameCard).filter(Boolean);
    const fragment = document.createDocumentFragment();

    progressBar.style.width = "100%";
    progressBar.setAttribute("aria-valuenow", "100");
    progressPercentage.textContent = "100%";

    cards.forEach(({ card, image, imageUrl }, index) => {
      if (index >= EAGER_THUMBNAILS) image.loading = "lazy";
      image.addEventListener(
        "error",
        () => card.classList.add("game-image-error"),
        { once: true },
      );
      image.src = imageUrl;
      fragment.appendChild(card);
    });

    gameContainer.appendChild(fragment);

    const searchbar = document.querySelector(".searchbar");
    if (searchbar) {
      searchbar.placeholder = `Click here or type to search through our ${games.length} games!`;
    }

    finishLoading(cards.length);
  } catch (error) {
    loadingText.textContent =
      "Unable to load games. Check your connection and try again.";
    progressPercentage.textContent = "Load failed";
    retryButton.hidden = false;
    console.error("Error loading games:", error);
  }
}

function createGameCard(game) {
  const card = document.createElement("div");
  card.className = "game";

  let control;
  if (game.usesProxy) {
    control = document.createElement("button");
    control.type = "button";
    control.addEventListener("click", () => {
      if (game.alert) window.alert(game.alert);
      hire(game.url);
    });
  } else {
    let href = game.url;
    if (game.author && !game.url) {
      const gameLink = game.image.split("/").filter(Boolean).at(-2);
      href = `/misc/play/?title=${encodeURIComponent(
        game.name,
      )}&author=${encodeURIComponent(game.author)}&link=${encodeURIComponent(
        gameLink,
      )}`;
    }

    if (!href) return null;

    control = document.createElement("a");
    control.href = href;
    control.rel = "noopener noreferrer";
    if (game.alert) {
      control.addEventListener("click", () => window.alert(game.alert));
    }
  }

  control.className = "game-link";

  const image = document.createElement("img");
  image.alt = "";
  image.width = 175;
  image.height = 175;
  image.decoding = "async";

  const label = document.createElement("p");
  label.className = "text";
  label.textContent = game.name;

  control.append(image, label);
  card.appendChild(control);

  return { card, image, imageUrl: game.image };
}

function finishLoading(totalGames) {
  const loadingContainer = document.getElementById("loading-container");
  const loadingText = document.getElementById("loading-text");

  loadingText.textContent = `${totalGames} games ready!`;

  loadingFadeTimer = setTimeout(() => {
    loadingContainer.style.opacity = "0";
    loadingHideTimer = setTimeout(() => {
      loadingContainer.style.display = "none";
    }, 500);
  }, 300);
}
