document.addEventListener("DOMContentLoaded", loadPacks);
async function loadPacks() {
  const container = document.getElementById("game-container");
  container.textContent = "Loading packs…";
  try {
    const response = await fetch("/assets/json/load/packs.json");
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    const packs = await response.json();
    packs.sort((a, b) => a.name.localeCompare(b.name));
    container.replaceChildren();
    for (const pack of packs) {
      const card = document.createElement("div");
      card.className = "game";
      const link = document.createElement("a");
      link.className = "game-link";
      link.href = pack.url;
      if (pack.alert)
        link.addEventListener("click", () => window.alert(pack.alert));
      const image = document.createElement("img");
      image.src = pack.image;
      image.alt = "";
      image.width = image.height = 175;
      image.loading = "lazy";
      const label = document.createElement("p");
      label.className = "text";
      label.textContent = pack.name;
      link.append(image, label);
      card.appendChild(link);
      container.appendChild(card);
    }
    search();
  } catch (error) {
    container.textContent = "Could not load packs. Check your connection. ";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gs";
    button.textContent = "Try again";
    button.addEventListener("click", loadPacks);
    container.appendChild(button);
  }
}
