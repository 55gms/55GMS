function search() {
  let searchbarVal = document.getElementById("searchbar").value.toLowerCase();
  let gameNames = document.getElementsByClassName("game");
  let results = 0;
  for (let t = 0; t < gameNames.length; t++) {
    if (gameNames[t].innerText.toLowerCase().includes(searchbarVal)) {
      gameNames[t].style.display = "inline-block";
      results++;
    } else {
      gameNames[t].style.display = "none";
    }
  }
}

document.addEventListener("keydown", function (e) {
  if (
    [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
      "Control",
      "Alt",
    ].includes(e.key) ||
    e.metaKey
  )
    return;

  let searchbar = document.getElementById("searchbar");
  searchbar.focus();
});
