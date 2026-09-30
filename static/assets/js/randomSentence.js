document.addEventListener("DOMContentLoaded", function () {
  fetch("/assets/json/quotes.json")
    .then((response) => response.json())
    .then((data) => {
      const randomQuote = data[Math.floor(Math.random() * data.length)];
      document.getElementById("sub").textContent = randomQuote;

      document.getElementById("sub").addEventListener("click", function () {
        const randomQuote = data[Math.floor(Math.random() * data.length)];
        document.getElementById("sub").textContent = randomQuote;
      });
    })
    .catch((error) => {
      document.getElementById("sub").textContent =
        "Browse games, apps, and more.";
    });
});
