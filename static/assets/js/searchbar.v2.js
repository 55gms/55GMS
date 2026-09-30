function search() {
  const input = document.querySelector("input.searchbar");
  const value = input.value.trim().toLowerCase();
  let results = 0;
  const cards = document.querySelectorAll("#game-container .game");
  cards.forEach((card) => {
    card.hidden = !card.textContent.toLowerCase().includes(value);
    if (!card.hidden) results++;
  });
  const status = document.getElementById("search-status");
  if (status) {
    status.textContent = results
      ? `${results} ${document.querySelector(".page-header h1").textContent.toLowerCase()}${value ? " found" : " available"}`
      : value
        ? "No matches. Try a different search."
        : "";
  }
  const url = new URL(window.location.href);
  if (input.value) url.searchParams.set("q", input.value);
  else url.searchParams.delete("q");
  history.replaceState(null, "", url);
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("input.searchbar");
  input.value = new URLSearchParams(location.search).get("q") || "";
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      input.value = "";
      search();
    }
  });
});

// A deliberate shortcut never steals Tab, Space, or another control's input.
document.addEventListener("keydown", (event) => {
  if (
    event.key !== "/" ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.isComposing ||
    event.target.closest(
      'input, textarea, select, button, a, [contenteditable="true"]',
    )
  )
    return;
  event.preventDefault();
  document.querySelector("input.searchbar")?.focus();
});
