document.addEventListener("DOMContentLoaded", loadApps);

async function loadApps() {
  const gameContainer = document.getElementById("game-container");

  try {
    gameContainer.replaceChildren();
    const response = await fetch("/assets/json/load/apps.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const apps = await response.json();
    apps.sort((a, b) => a.name.localeCompare(b.name));

    const fragment = document.createDocumentFragment();
    apps.forEach((app) => fragment.appendChild(createAppCard(app)));
    gameContainer.appendChild(fragment);
    search();

    const searchbar = document.querySelector(".searchbar");
    if (searchbar) {
      searchbar.placeholder = `Search ${apps.length} apps…`;
    }
  } catch (error) {
    gameContainer.textContent =
      "Unable to load apps. Check your connection and try again.";
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "loading-retry";
    retry.textContent = "Try again";
    retry.addEventListener("click", loadApps);
    gameContainer.appendChild(retry);
    console.error("Error loading apps:", error);
  }
}

function createAppCard(app) {
  const card = document.createElement("div");
  card.className = "game";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "game-link";
  button.addEventListener("click", () => {
    if (app.alert) window.alert(app.alert);
    hire(app.url);
  });

  const image = document.createElement("img");
  image.alt = "";
  image.width = 175;
  image.height = 175;
  image.loading = "lazy";
  image.decoding = "async";
  image.src = app.image;

  const label = document.createElement("p");
  label.className = "text";
  label.textContent = app.name;

  button.append(image, label);
  card.appendChild(button);
  return card;
}
