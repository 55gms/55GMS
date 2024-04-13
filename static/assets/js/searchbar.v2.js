function search() {
  let e = document.getElementById("searchbar").value.toLowerCase();
  let n = document.getElementsByClassName("card");
  for (let t = 0; t < n.length; t++)
    n[t].innerHTML.toLowerCase().includes(e)
      ? (n[t].style.display = "block")
      : (n[t].style.display = "none");
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
  if (e.toLowerCase() != e.toUpperCase()) searchbar.value += e.key;
});
