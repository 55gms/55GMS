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

document.addEventListener("DOMContentLoaded", async () => {
  const gameContainer = document.getElementById("game-container");

  try {
    const response = await fetch("/assets/json/load/apps.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const apps = await readCatalogue(response);
    apps.sort((a, b) => a.name.localeCompare(b.name));

    const fragment = document.createDocumentFragment();
    apps.forEach((app) => fragment.appendChild(createAppCard(app)));
    gameContainer.appendChild(fragment);

    const searchbar = document.querySelector(".searchbar");
    if (searchbar) {
      searchbar.placeholder = `Click here to search through our ${apps.length} apps!`;
    }
  } catch (error) {
    gameContainer.textContent =
      "Unable to load apps. Check your connection and try again.";
    console.error("Error loading apps:", error);
  }
});

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
  image.loading = "eager";
  image.src = app.image;

  const label = document.createElement("p");
  label.className = "text";
  label.textContent = app.name;

  button.append(image, label);
  card.appendChild(button);
  return card;
}
