// Thumbnails above the fold get high fetch priority; all thumbnails load eagerly.
const PRIORITY_THUMBNAILS = 24;
let loadingFadeTimer;
let loadingHideTimer;
let progressFrame = 0;
let progressShown = 0;

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
  loadingContainer.classList.remove("is-leaving");
  loadingContainer.style.height = "";
  loadingContainer.style.display = "flex";
  loadingText.textContent = "Loading games…";
  progressShown = 0;
  drawProgress();
  retryButton.hidden = true;
  // The catalog is one request with no byte progress to report, so the bar
  // eases most of the way while it is in flight and finishes when it lands.
  glideProgress(0.85, 700);

  try {
    const response = await fetch("/assets/json/load/g.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const games = await readCatalogue(response);
    games.sort((a, b) => a.name.localeCompare(b.name));

    const cards = games.map(createGameCard).filter(Boolean);
    const fragment = document.createDocumentFragment();

    cards.forEach(({ card, image, imageUrl }, index) => {
      if (index < PRIORITY_THUMBNAILS) image.fetchPriority = "high";
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

    await glideProgress(1, 110);
    finishLoading(cards.length);
  } catch (error) {
    cancelAnimationFrame(progressFrame);
    loadingText.textContent =
      "Unable to load games. Check your connection and try again.";
    progressPercentage.textContent = "Load failed";
    retryButton.hidden = false;
    console.error("Error loading games:", error);
  }
}

function drawProgress() {
  const progressBar = document.getElementById("progress-bar");
  const whole = Math.floor(progressShown * 100 + 0.01);
  progressBar.style.width = `${progressShown * 100}%`;
  progressBar.setAttribute("aria-valuenow", whole);
  document.getElementById("progress-percentage").textContent = `${whole}%`;
}

// Glides the bar and the percentage toward a 0-1 target every frame; a larger
// pace is slower. Resolves once the target is reached.
function glideProgress(target, pace) {
  cancelAnimationFrame(progressFrame);
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  return new Promise((resolve) => {
    let lastFrame = performance.now();
    const step = (now) => {
      // A frame timestamp can predate the performance.now() taken before it.
      const elapsed = Math.min(Math.max(now - lastFrame, 0), 100);
      lastFrame = now;
      progressShown +=
        (target - progressShown) * (1 - Math.exp(-elapsed / pace));
      if (still || Math.abs(target - progressShown) < 0.005)
        progressShown = target;
      drawProgress();
      if (progressShown !== target) {
        progressFrame = requestAnimationFrame(step);
        return;
      }
      progressFrame = 0;
      resolve();
    };
    progressFrame = requestAnimationFrame(step);
  });
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
  if (game.preview) control.dataset.preview = game.preview;

  const image = document.createElement("img");
  image.alt = "";
  image.width = 175;
  image.height = 175;
  image.loading = "eager";

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

  // Pin the current height so it can animate to zero: the bar fades and the
  // games slide up into its place instead of jumping.
  loadingFadeTimer = setTimeout(() => {
    loadingContainer.style.height = `${loadingContainer.offsetHeight}px`;
    loadingContainer.offsetHeight;
    loadingContainer.classList.add("is-leaving");
    loadingContainer.style.height = "0px";
    loadingHideTimer = setTimeout(() => {
      loadingContainer.style.display = "none";
    }, 650);
  }, 450);
}
