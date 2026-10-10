
const PRIORITY_THUMBNAILS = 24;
const FAVORITES_KEY = "55gms.favoriteGames.v1";
const RECENT_KEY = "55gms.recentGames.v1";
const RECENT_LIMIT = 24;
let loadingFadeTimer;
let loadingHideTimer;
let progressFrame = 0;
let progressShown = 0;
let gameRevealObserver = null;
let gameCards = [];
let activeGameView = "all";
let orderedGameView = "all";
let favoriteGameIds = new Set(readStoredIds(FAVORITES_KEY));
let recentGameIds = readStoredIds(RECENT_KEY).slice(0, RECENT_LIMIT);

function readStoredIds(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeStoredIds(key, values) {
  try {
    localStorage.setItem(key, JSON.stringify(values));
  } catch {
  }
}

function gameId(game) {
  return `${game.name}|${game.url || game.image || game.author || ""}`;
}

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
  document.querySelectorAll("[data-game-view]").forEach((button) => {
    button.addEventListener("click", () => {
      activeGameView = button.dataset.gameView;
      applyGameFilters();
    });
  });
  window.search = applyGameFilters;
  document.querySelector(".searchbar")?.addEventListener("input", applyGameFilters);
  window.addEventListener("storage", (event) => {
    if (event.key === FAVORITES_KEY || event.key === RECENT_KEY) {
      favoriteGameIds = new Set(readStoredIds(FAVORITES_KEY));
      recentGameIds = readStoredIds(RECENT_KEY).slice(0, RECENT_LIMIT);
      gameCards.forEach(updateFavoriteButton);
      applyGameFilters();
    }
  });
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
  gameRevealObserver?.disconnect();
  gameRevealObserver = null;
  gameCards = [];
  orderedGameView = "all";
  gameContainer.replaceChildren();
  document.getElementById("game-empty").hidden = true;
  loadingContainer.classList.remove("is-leaving");
  loadingContainer.style.height = "";
  loadingContainer.style.display = "flex";
  loadingText.textContent = "Loading games…";
  progressShown = 0;
  drawProgress();
  retryButton.hidden = true;
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
    const revealCards =
      "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (revealCards) {
      gameRevealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -20px 0px", threshold: 0.08 },
      );
    }

    cards.forEach(({ card, image, imageUrl }, index) => {
      if (revealCards) {
        card.classList.add("game-reveal");
        card.style.setProperty("--reveal-delay", `${(index % 6) * 50}ms`);
      }
      if (index < PRIORITY_THUMBNAILS) image.fetchPriority = "high";
      image.addEventListener(
        "error",
        () => card.classList.add("game-image-error"),
        { once: true },
      );
      image.src = imageUrl;
      fragment.appendChild(card);
    });

    gameCards = cards;
    gameContainer.appendChild(fragment);
    if (gameRevealObserver) {
      cards.forEach(({ card }) => gameRevealObserver.observe(card));
    }

    const searchbar = document.querySelector(".searchbar");
    if (searchbar) {
      searchbar.placeholder = `Click here or type to search through our ${games.length} games!`;
    }
    applyGameFilters();

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

function glideProgress(target, pace) {
  cancelAnimationFrame(progressFrame);
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  return new Promise((resolve) => {
    let lastFrame = performance.now();
    const step = (now) => {
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

function updateFavoriteButton(entry) {
  const chosen = favoriteGameIds.has(entry.id);
  entry.favoriteButton.classList.toggle("is-favorite", chosen);
  entry.favoriteButton.setAttribute("aria-pressed", String(chosen));
  const label = `${chosen ? "Remove" : "Add"} ${entry.game.name} ${chosen ? "from" : "to"} favorites`;
  entry.favoriteButton.setAttribute("aria-label", label);
  entry.favoriteButton.title = label;
}

function toggleFavorite(entry) {
  if (favoriteGameIds.has(entry.id)) {
    favoriteGameIds.delete(entry.id);
  } else {
    favoriteGameIds.add(entry.id);
  }
  writeStoredIds(FAVORITES_KEY, [...favoriteGameIds]);
  updateFavoriteButton(entry);
  applyGameFilters();
}

function recordGamePlayed(id) {
  recentGameIds = [id, ...recentGameIds.filter((item) => item !== id)].slice(0, RECENT_LIMIT);
  writeStoredIds(RECENT_KEY, recentGameIds);
  applyGameFilters();
}

function createGameCard(game) {
  const card = document.createElement("div");
  card.className = "game";
  const id = gameId(game);

  let control;
  if (game.usesProxy) {
    control = document.createElement("button");
    control.type = "button";
    control.addEventListener("click", () => {
      recordGamePlayed(id);
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
    control.addEventListener("click", () => {
      recordGamePlayed(id);
      if (game.alert) window.alert(game.alert);
    });
  }

  control.className = "game-link";
  control.setAttribute("aria-label", `Play ${game.name}`);
  if (game.preview) control.dataset.preview = game.preview;

  const image = document.createElement("img");
  image.alt = "";
  image.width = 175;
  image.height = 175;
  image.loading = "eager";

  const label = document.createElement("p");
  label.className = "text";
  label.textContent = game.name;

  const favoriteButton = document.createElement("button");
  favoriteButton.type = "button";
  favoriteButton.className = "game-favorite";
  favoriteButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.9 2.8 5.7 6.3.9-4.55 4.44 1.08 6.27L12 17.25l-5.63 2.96 1.08-6.27L2.9 9.5l6.3-.9z"/></svg>';

  control.append(image, label);
  card.append(control, favoriteButton);
  const entry = { id, game, card, image, imageUrl: game.image, favoriteButton };
  favoriteButton.addEventListener("click", () => toggleFavorite(entry));
  updateFavoriteButton(entry);
  return entry;
}

function applyGameFilters() {
  const gameContainer = document.getElementById("game-container");
  if (!gameContainer) return;
  const query = document.querySelector(".searchbar")?.value.toLowerCase().trim() || "";
  const recentPositions = new Map(recentGameIds.map((id, index) => [id, index]));

  if (orderedGameView !== activeGameView) {
    const reordered = activeGameView === "recent"
      ? [...gameCards].sort((a, b) => (recentPositions.get(a.id) ?? Infinity) - (recentPositions.get(b.id) ?? Infinity))
      : gameCards;
    gameContainer.append(...reordered.map((entry) => entry.card));
    orderedGameView = activeGameView;
  }

  let visible = 0;
  gameCards.forEach((entry) => {
    const matchesView = activeGameView === "all" ||
      (activeGameView === "favorites" && favoriteGameIds.has(entry.id)) ||
      (activeGameView === "recent" && recentPositions.has(entry.id));
    const shows = matchesView && entry.game.name.toLowerCase().includes(query);
    entry.card.style.display = shows ? "inline-block" : "none";
    if (shows) visible++;
  });

  const favoritesCount = gameCards.filter((entry) => favoriteGameIds.has(entry.id)).length;
  const recentCount = gameCards.filter((entry) => recentPositions.has(entry.id)).length;
  const counts = { all: gameCards.length, favorites: favoritesCount, recent: recentCount };
  document.querySelectorAll("[data-count]").forEach((count) => {
    count.textContent = counts[count.dataset.count];
  });
  document.querySelectorAll("[data-game-view]").forEach((button) => {
    const selected = button.dataset.gameView === activeGameView;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  const empty = document.getElementById("game-empty");
  empty.hidden = visible !== 0 || gameCards.length === 0;
  if (!empty.hidden) {
    const title = document.getElementById("game-empty-title");
    const text = document.getElementById("game-empty-text");
    if (query) {
      title.textContent = "No matching games";
      text.textContent = "Try another search or switch views.";
    } else if (activeGameView === "favorites") {
      title.textContent = "No favorites yet";
      text.textContent = "Tap the star on any game to save it here.";
    } else if (activeGameView === "recent") {
      title.textContent = "No recently played games";
      text.textContent = "Open a game from All Games to see it here.";
    } else {
      title.textContent = "No games found";
      text.textContent = "Try again in a moment.";
    }
  }
}

function finishLoading(totalGames) {
  const loadingContainer = document.getElementById("loading-container");
  const loadingText = document.getElementById("loading-text");

  loadingText.textContent = `${totalGames} games ready!`;

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
