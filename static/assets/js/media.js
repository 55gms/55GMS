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
        results.forEach(function (movie) {
          let poster;
          if (movie.poster_path === null || !movie.poster_path) {
            poster = "/img/no-media.svg";
          } else {
            poster = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
          }

          let link;
          if (movie.media_type === "tv") {
            let gameHtml = `<div class="card" style="padding-top: 5px">
          <a onclick="promptForSeasonAndEpisode(${movie.id})"> 
            <div class="image-container">
              <img loading="eager" src="${poster}" style="border-radius: 25px">
              <p class="item-name">${movie.name || movie.title}</p> 
            </div>
          </a>
        </div>`;
            gameContainer.insertAdjacentHTML("beforeend", gameHtml);
          } else if (movie.media_type === "movie") {
            link = `https://multiembed.mov/?video_id=${movie.id}&tmdb=1`;
            let gameHtml = `<div class="card" style="padding-top: 5px">
          <a onclick="hire('${link}');"> 
            <div class="image-container">
              <img loading="eager" src="${poster}" style="border-radius: 25px">
              <p class="item-name">${movie.name || movie.title}</p> 
            </div>
          </a>
        </div>`;
            gameContainer.insertAdjacentHTML("beforeend", gameHtml);
          }
        });
      });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
function promptForSeasonAndEpisode(videoId) {
  const season = prompt("Enter season number:");
  const episode = prompt("Enter episode number:");
  const link = `https://multiembed.mov/directstream.php?video_id=${videoId}&tmdb=1&s=${season}&e=${episode}`;
  hire(link);
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
