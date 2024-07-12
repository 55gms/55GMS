function fetchTmdbId() {
  let search = document.getElementById("searchbar").value;
  let link;
  let poster;
  let encodedSearch = encodeURIComponent(search);
  let url =
    "https://api.themoviedb.org/3/search/multi?api_key=66ca93aa37686b7a47476585271855c6&language=en-US&query=" +
    encodedSearch +
    "&page=1&include_adult=false";
  const gameContainer = document.getElementById("game-container");
  gameContainer.innerHTML = "";

  try {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const results = data.results;
        console.log(results);
        results.forEach(function (movie) {
          if (movie.poster_path === null) {
            poster = "/img/no-media.svg";
          } else if (!movie.poster_path) {
            poster = "/img/no-media.svg";
          } else {
            poster = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
          }
          if (movie.media_type === "tv") {
            link = "https://vidsrc.xyz/embed/tv/";
          } else if (movie.media_type === "movie") {
            link = "https://vidsrc.xyz/embed/movie/";
          }
          let gameHtml = `<div class="card" style="padding-top: 5px">
          <a onclick="hire('${link}${movie.id}'); "> 
            <div class="image-container">
              <img loading="eager" src="${poster}" style="border-radius: 25px">
              <p class="item-name">${movie.name || movie.title}</p> 
            </div>
          </a>
        </div>`;
          gameContainer.insertAdjacentHTML("beforeend", gameHtml);
        });
      });
  } catch (error) {
    text.innerHTML = `Error in fetching data<br>${error}`;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let cooldown = false;

  document
    .getElementById("searchbar")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        if (cooldown) {
          document.getElementById("cooldownNotice").style.display = "block";
        } else {
          fetchTmdbId();
          document.getElementById("cooldownNotice").style.display = "none";
          cooldown = true;
          setTimeout(function () {
            cooldown = false;
            document.getElementById("cooldownNotice").style.display = "none";
          }, 3000);
        }
      }
    });
});
