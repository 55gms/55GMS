const PRIORITY_THUMBNAILS = 24;
const FAVORITES_KEY = "55gms.favoriteGames.v1";
const RECENT_KEY = "55gms.recentGames.v1";
const RECENT_LIMIT = 24;

const GAME_CATEGORIES = {
  "Action & Fighting": [
    "Alien Hominid", "Amazing Rope Police", "Astro Survivors", "Bacon May Die",
    "Bacon Survivor", "Bad Time Simulator", "Bowmasters", "Brawl Simulator 3D", "Brotato",
    "Cuphead", "Dante", "Day Of Meat: Radiation", "Dino Fighter", "Fruit Ninja",
    "Fruits of Fury", "Gladihoppers", "Hobo", "Hobo 2", "Hobo 3", "Hobo 4", "Hobo 5",
    "Hobo 6", "Hobo 7", "Hotline Miami", "Iron Snout", "Kick The Buddy", "Knife Hit",
    "Knife Merge", "Mortal Kombat", "No Pain No Gain", "Punchy Guy", "Ragdoll Archers",
    "Ragdoll Chaos", "Ragdoll Fight", "Ragdoll Hit", "Stick Fighter", "Street Fighter 2",
    "Street Fighter 3", "Super Foulist", "Whack Your Boss", "Whack Your Computer",
    "Whack Your Ex"
  ],
  "Adventure & Exploration": [
    "Bad Ice Cream", "Bad Ice Cream 2", "Bad Ice Cream 3", "Bob The Robber 2",
    "Digger Escape", "Digging Master", "Dino Bros", "Duck Life", "Duck Life 2",
    "Duck Life 3", "Duck Life 4", "Frying Nemo", "Henry Stickmin - Breaking The Bank",
    "Henry Stickmin - Escaping The Prison", "Henry Stickmin - Fleeing The Complex",
    "Henry Stickmin - Infiltrating The Airship", "Henry Stickmin - Stealing The Diamond",
    "Pokemon Chaos Black", "Pokemon Crystal", "Pokemon Emerald", "Pokemon Fire Red",
    "Pokemon Flora Sky", "Pokemon Ruby Red", "Pokemon Sapphire", "Pokemon Showdown",
    "Pokemon Ultraviolet", "Raft", "Steal A Brainrot"
  ],
  "Arcade & Casual": [
    "Blumgi Bloom", "Blumgi Bounce", "Blumgi Castle", "Blumgi Dragon", "Blumgi Merge",
    "Blumgi Slime", "Blumgi Splash", "Bottle Flip", "Bottle Flip 3D", "Bouncemasters",
    "Buck Bounce", "Crazy Cattle 3D", "Crossy Road", "Cubefield", "Duck Merge", "Dune",
    "Fashion Legends", "Flip Bros", "Flippy Fish", "Gimme the Airpod", "Gobble",
    "Going Balls", "Google Snake", "Gym Stack", "Happy Wheels", "Helix Jump",
    "House Of Hazards", "Jetpack Joyride", "Learn to Fly", "Learn to Fly 2",
    "Learn to Fly 3", "Marble Run 3D", "Paper Plane", "Papery Planes", "Perfect Peel",
    "Plonky", "Ragdoll Fall", "Rise Higher", "Roller", "Sausage Flip", "Slice Master",
    "Slope", "Smash It", "Spiral Roll", "Stack", "Stack Bounce", "Stickman Bike",
    "Subway Surfers", "Toss the Turtle", "Tube Jumpers", "Tunnel Rush", "Tunnel Rush 2",
    "WBWWB", "Zorr.pro"
  ],
  "Card & Board": [
    "Balatro", "Deal or No Deal", "Master Chess", "Poker"
  ],
  "Cooking & Management": [
    "Airplane Manager", "Capitalist Bus Driver", "Cat Pizza", "Cooking Fever", "Gas Station",
    "Goods Master", "Harvest Loop", "Harvest Simulator", "Idle Restaurants", "Monkey Mart",
    "My Perfect Hotel", "Papas Burgeria", "Papas Cheeseria", "Papas Cupcakeria",
    "Papas Donuteria", "Papas Freezeria", "Papas Hot Doggeria", "Papas Pancakeria",
    "Papas Pasteria", "Papas Pizzaria", "Papas Scooperia", "Papas Sushiria",
    "Papas Taco Mia", "Papas Wingeria", "School Cleaning", "Tiny Towers"
  ],
  "Horror": [
    "10 Minutes Till Dawn", "60 Seconds! Reatomized", "Backrooms", "Backrooms Recovery",
    "Baldi's Basics", "Bendy", "Buckshot Roulette", "Clover Pit", "Fear Response",
    "Five Nights at Epstien's", "FNAF", "FNAF 2", "FNAF 3", "FNAF 4",
    "FNAF: Sister Location", "Granny", "Kindergarden", "Kindergarden 2", "Murder", "REPO",
    "Santy is Home", "Thats not my Neighbor", "The Baby In Yellow", "The Binding Of Issac",
    "You Monster"
  ],
  "Idle & Clicker": [
    "Adventure Capitalist", "Adventure Miner", "Bee Swarm Simulator", "Capybara Clicker",
    "Cookie Clicker", "CSGO Clicker", "Doge Miner", "Dogeminer 2", "Grindcraft", "Idle Ants",
    "Idle Breakout", "Idle Cowshed", "Idle Dice", "Idle Digging Tycoon", "Idle Lumber Inc",
    "Idle Mining Empire", "Idle Revolution", "Idle Success", "Kiwi Clicker", "Mine Line",
    "Nut Simulator", "Reel Tycoon", "Spacebar Clicker", "Tiny Fishing",
    "Universal Paperclips"
  ],
  "Multiplayer & .io": [
    "Aquapark.io", "Deeeep.io", "digdig.io", "Ducklings.io", "Fish Eat Fish", "Hole.io",
    "MK48.io", "Paper.io 2", "Ships 3D", "Skribble.IO", "Slither.io", "Smash Karts",
    "Snowball.io", "Stumble Guys", "Webfishing", "Yohoho.io"
  ],
  "Platformer & Parkour": [
    "60 Second Burger Run", "Big Flappy Tower Tiny Square", "Big Tower Tiny Square",
    "Bike Obby", "BoxRob", "Choppy Orc", "Cluster Rush", "Dadish", "Dadish 2", "Dadish 3",
    "Dadish 3D", "Daily Dadish", "Doodle Jump", "Dread Head Parkour", "E Parkour.Io",
    "Edge Not Found", "FancyPants Adventure", "FancyPants Adventure 2", "Getting Over It",
    "Hollow Night", "Hollow Night Silksong", "Jump Only", "Jumping Shell", "Level Devil",
    "Mophead Dash", "N Gon", "Neon Swing", "OvO", "OvO 2", "OvO Dimensions", "Parkour Race",
    "Poor Bunny", "Poor Eddie", "Rainbow Tower", "Red Ball 4", "Roper", "Run 3",
    "Slime Journey", "Stickman Boost", "Stickman Climb 2", "Stickman Climb 3D",
    "Stickman Hook", "Stickman Run", "Super Mario 64", "Swingo", "Tag", "Temple Run 2",
    "Tomb Of The Mask", "Under the Red Sky", "Unfair Mario", "Vex 3", "Vex 4", "Vex 5",
    "Vex 6", "Vex 7", "Vex 8", "Worlds Hardest Game", "Worlds Hardest Game 2"
  ],
  "Puzzle & Brain": [
    "2048", "Apple Worm", "Block Blast", "Bloxrz", "Brain Test", "CircloO",
    "Color Pencil Run", "Core Ball", "Cut The Rope", "Draw The Hill", "Fire Boy Water Girl",
    "Fruit Merge", "Google Feud", "Happy Glass", "Hexellent", "Hextris", "Impossible Quiz",
    "Impossible Quiz 2", "Light The Lamp", "Little Alchemy", "Little Alchemy 2", "Longcat",
    "Marbles Sorting", "Monster Match", "Perfect Shape", "Rescue the Fish", "Riddle School",
    "Riddle School 2", "Riddle School 3", "Riddle School 4", "Riddle School 5",
    "Riddle School Transfer", "Riddle Transfer 2", "Sandtris", "SandTrix", "Snake Pivot",
    "Stacktris", "Tetris", "There Is No Game", "Twitch Tetris", "Who Is?", "Wordle",
    "World of Screw"
  ],
  "Racing & Driving": [
    "2D Rocket League", "Adventure Drivers", "Arcade Car Drift", "Blumgi Racers",
    "Car Circle", "Car Machines", "Carnado Stunt Car", "Crazy Bikes", "Crazy Cars",
    "Deadly Descent", "Drift Boss", "Drift Hunters", "Drive Mad", "Eagle Ride", "Eggy Car",
    "Escape Road", "Escape Road 2", "Escape Road 3", "Escape Road City 2",
    "Free Rider Jumps", "Full Speed Racing", "Grand Prix Hero", "HexGL", "Hill Climb Racing",
    "Jelly Drift", "Mad Skills Motocross 2", "Madalin Stunt Cars 3", "Merge Round Racers",
    "Monster Tracks", "Moto Trap", "MotoX3M", "MotoX3M 2", "MotoX3M Pool Party",
    "MotoX3M Spooky", "MotoX3M Winter", "Mr Racer", "NSR Street Car Racing", "Police Chase",
    "Polytrack", "Polytrack 0.4.1", "Race Survival", "Retro Highway", "Rocket Soccer Derby",
    "Skyriders", "Slowroads", "Snow Rider 3D", "Snow Train Odyssey", "Steel Hills",
    "Stunt Bike Extreme", "Stunt Car Extreme", "Super Star Car", "Supercar Legends",
    "Takuni Sunset", "Turbo Moto Racer", "Vex X3M", "Wave Rider"
  ],
  "Rhythm & Music": [
    "A Dance Of Fire & Ice", "Friday Night Funkin", "Geometry Dash", "Geometry Dash Lite",
    "Geometry Dash SubZero", "Just Shapes & Beats", "Space Waves"
  ],
  "Sandbox & Creative": [
    "Eaglercraft X", "Emulator JS", "GBA Games", "Infinite Craft", "Minecraft",
    "People Playground", "Roblox", "Sandboxels", "Sketchbook", "Slime Rancher",
    "Solar Smash", "The Final Earth 2", "WebGL Fluid"
  ],
  "Shooter": [
    "1v1.lol", "2Doom", "Bank Robbery 2", "Blumgi Paintball", "Boom Slingers Reboom",
    "buildnow.gg", "Bullet Bros", "deadshot.io", "Funny Shooter 2", "Getaway Shootout",
    "Gun Mayhem 2", "Gun Mayhem 3", "Gun Spin", "Gunblood", "Horde Killer You VS 100",
    "Johnny Trigger", "Johnny Trigger Sniper", "Karlson", "KARLSON'T", "kour.io",
    "Mr. Bullet", "Nazi Zombies: Portable", "Raft Wars", "Raft Wars 2", "Recoil",
    "Red Vs. Bluez", "Rooftop Snipers", "Rooftop Snipers 2", "Shell Shockers",
    "Skibidi Shooter", "Superhot", "Temple of Boom", "Time Shooter 1", "Time Shooter 2",
    "Time Shooter 3", "Ultrakill", "Venge.io", "Zombie Derby"
  ],
  "Simulation": [
    "BitLife", "Dino Simulator", "Perfect Landing, Plane Pilot", "Pilot Life",
    "Robo Cleaner Simulator", "Space Company", "Spaceflight Simulator"
  ],
  "Sports": [
    "1 on 1 Soccer", "A Small World Cup", "A Small World Cup 2", "American Football REAL",
    "Archery World Tour", "Baseball Bros", "Basket Random", "Basketball REAL",
    "Basketball Stars", "Basketball Superstars", "Basketbros", "Blumgi Ball",
    "Blumgi Soccer", "Bouncy Basketball", "Boxing Random", "Flick Goal", "Football Bros",
    "Golf Orbit", "Google Baseball", "Penalty Kick Online", "Penalty Shooters 2",
    "Ping Pong Go", "Retro Bowl", "Retro Bowl College", "Rodeo Stampede", "Slime Dunk",
    "Soccer Bros", "Soccer Random", "Soccer REAL", "Speed Stars", "Super Liquid Soccer",
    "Table Tennis: WT", "Unicycle Hero", "Unicycle Legend", "Volley Random"
  ],
  "Strategy & Defense": [
    "Awesome Tanks", "Awesome Tanks 2", "Bloons TD", "Bloons TD 2", "Bloons TD 3",
    "Bloons TD 4", "Magic Battleground", "Path To Glory", "Plants vs. Zombies", "State IO",
    "Stick Defenders", "Stick Merge", "Stick Rush", "Stick War: Legacy", "Stickman Battle",
    "Stickman Merge", "Territorial.io", "War The Knights"
  ],
  "Other": [
    "[!!] Request A Game"
  ],
};

const CATEGORY_SHORT_NAMES = {
  "Action & Fighting": "Action",
  "Adventure & Exploration": "Adventure",
  "Arcade & Casual": "Arcade",
  "Card & Board": "Cards",
  "Cooking & Management": "Cooking",
  "Horror": "Horror",
  "Idle & Clicker": "Idle",
  "Multiplayer & .io": ".io",
  "Platformer & Parkour": "Parkour",
  "Puzzle & Brain": "Puzzle",
  "Racing & Driving": "Racing",
  "Rhythm & Music": "Rhythm",
  "Sandbox & Creative": "Sandbox",
  "Shooter": "Shooter",
  "Simulation": "Sim",
  "Sports": "Sports",
  "Strategy & Defense": "Strategy",
  "Other": "Other",
};

const GAME_CATEGORY_BY_NAME = new Map(
  Object.entries(GAME_CATEGORIES).flatMap(([category, names]) =>
    names.map((name) => [name, category]),
  ),
);

function getGameCategory(game) {
  return GAME_CATEGORY_BY_NAME.get(game.name) || "Other";
}

function populateGameCategories(games) {
  const select = document.getElementById("game-view-select");
  if (!select) return;
  select.querySelectorAll("option[data-game-category]").forEach((option) => option.remove());

  const counts = new Map(Object.keys(GAME_CATEGORIES).map((name) => [name, 0]));

  games.forEach((game) => {
    const category = getGameCategory(game);
    counts.set(category, (counts.get(category) || 0) + 1);
  });

  counts.forEach((count, category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = `${category} (${count})`;
    option.dataset.gameCategory = "true";
    select.appendChild(option);
  });
}

let loadingFadeTimer;
let loadingHideTimer;
let progressFrame = 0;
let progressShown = 0;
let gameCards = [];
let activeGameView = "all";
let orderedGameView = "all";
let favoriteGameIds = new Set(readStoredIds(FAVORITES_KEY));
let recentGameIds = readStoredIds(RECENT_KEY).slice(0, RECENT_LIMIT);

function readStoredIds(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value)
      ? value.filter((item) => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function writeStoredIds(key, values) {
  try {
    localStorage.setItem(key, JSON.stringify(values));
  } catch {}
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
  document
    .getElementById("game-view-select")
    ?.addEventListener("change", (event) => {
      activeGameView = event.target.value;
      applyGameFilters();
    });
  document
    .querySelector(".searchbar")
    ?.addEventListener("input", applyGameFilters);
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

    gameCards = cards;
    gameContainer.appendChild(fragment);
    populateGameCategories(cards.map(({ game }) => game));

    const searchbar = document.querySelector(".searchbar");
    if (searchbar) {
      searchbar.placeholder = `Click here or type to search through our ${games.length} games!`;
    }
    applyGameFilters();
    animateFirstScreen(cards);

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

function animateFirstScreen(cards) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  requestAnimationFrame(() => {
    const rows = [];
    const viewportHeight = window.innerHeight;
    cards.forEach(({ card }) => {
      if (card.style.display === "none") return;
      const box = card.getBoundingClientRect();
      if (box.top >= viewportHeight || box.bottom <= 0) return;
      let rowIndex = rows.findIndex((top) => Math.abs(top - box.top) < 8);
      if (rowIndex < 0) {
        rowIndex = rows.length;
        rows.push(box.top);
      }
      card.style.setProperty("--load-delay", `${rowIndex * 110}ms`);
      card.classList.add("game-first-load");
      card.addEventListener(
        "animationend",
        () => {
          card.classList.remove("game-first-load");
          card.style.removeProperty("--load-delay");
        },
        { once: true },
      );
    });
  });
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
  recentGameIds = [id, ...recentGameIds.filter((item) => item !== id)].slice(
    0,
    RECENT_LIMIT,
  );
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
      if (typeof trackGamePlay === "function") {
        trackGamePlay(game.name, "proxy");
      }
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

  const category = getGameCategory(game);
  const categoryBadge = document.createElement("span");
  categoryBadge.className = "game-category-badge";
  categoryBadge.textContent = CATEGORY_SHORT_NAMES[category] || category;
  categoryBadge.title = category;

  const favoriteButton = document.createElement("button");
  favoriteButton.type = "button";
  favoriteButton.className = "game-favorite";
  favoriteButton.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.9 2.8 5.7 6.3.9-4.55 4.44 1.08 6.27L12 17.25l-5.63 2.96 1.08-6.27L2.9 9.5l6.3-.9z"/></svg>';

  control.append(image, label, categoryBadge);
  card.append(control, favoriteButton);
  const entry = { id, game, card, image, imageUrl: game.image, favoriteButton };
  favoriteButton.addEventListener("click", () => toggleFavorite(entry));
  updateFavoriteButton(entry);
  return entry;
}

function applyGameFilters() {
  const gameContainer = document.getElementById("game-container");
  if (!gameContainer) return;
  const query =
    document.querySelector(".searchbar")?.value.toLowerCase().trim() || "";
  const recentPositions = new Map(
    recentGameIds.map((id, index) => [id, index]),
  );

  if (orderedGameView !== activeGameView) {
    const reordered =
      activeGameView === "recent"
        ? [...gameCards].sort(
            (a, b) =>
              (recentPositions.get(a.id) ?? Infinity) -
              (recentPositions.get(b.id) ?? Infinity),
          )
        : gameCards;
    gameContainer.append(...reordered.map((entry) => entry.card));
    orderedGameView = activeGameView;
  }

  let visible = 0;
  gameCards.forEach((entry) => {
    const matchesView =
      activeGameView === "all" ||
      (activeGameView === "favorites" && favoriteGameIds.has(entry.id)) ||
      (activeGameView === "recent" && recentPositions.has(entry.id)) ||
      getGameCategory(entry.game) === activeGameView;
    const shows = matchesView && entry.game.name.toLowerCase().includes(query);
    entry.card.style.display = shows ? "inline-block" : "none";
    if (shows) visible++;
  });

  const favoritesCount = gameCards.filter((entry) =>
    favoriteGameIds.has(entry.id),
  ).length;
  const recentCount = gameCards.filter((entry) =>
    recentPositions.has(entry.id),
  ).length;
  const counts = {
    all: gameCards.length,
    favorites: favoritesCount,
    recent: recentCount,
  };
  const viewSelector = document.getElementById("game-view-select");
  if (viewSelector) {
    viewSelector.value = activeGameView;
    viewSelector.options[0].textContent = `All Games (${counts.all})`;
    viewSelector.options[1].textContent = `Favorites (${counts.favorites})`;
    viewSelector.options[2].textContent = `Recently Played (${counts.recent})`;
  }

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
