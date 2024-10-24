function fetchTmdbId() {
  let search = document.getElementById("searchbar").value;
  let link;
  let poster;
  let encodedSearch = encodeURIComponent(search);
  let url =
    "https://api.themoviedb.org/3/search/multi?api_key=d93115754010beb32ae8956c26dbc590&language=en-US&query=" +
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
            return;
          } else {
            poster = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
          }

          let gameHtml;
          let rating = Math.round(movie.vote_average * 10) / 10;
          let year = movie.release_date
            ? movie.release_date.slice(0, 4)
            : "N/A";
          if (movie.media_type === "tv") {
            year = movie.first_air_date
              ? movie.first_air_date.slice(0, 4)
              : "N/A";
            gameHtml = `<div class="card" style="padding-top: 5px">
              <a onclick="promptForSeasonAndEpisode(${movie.id})"> 
              <div class="rating">★ ${rating}</div>
              <div class="year">${year}</div>
                <div class="image-container">
                  <img loading="eager" src="${poster}" style="border-radius: 25px">
                  <div class="play-button"></div>
                  <p class="item-name">${movie.name || movie.title}</p> 
                </div>
              </a>
            </div>`;
          } else if (movie.media_type === "movie") {
            let link = `https://moviesapi.club/movie/${movie.id}`;
            gameHtml = `<div class="card" style="padding-top: 5px">
              <div class="rating">★ ${rating}</div>
              <div class="year">${year}</div>
              <a onclick="hire('${link}');"> 
                <div class="image-container">
                  <img loading="eager" src="${poster}" style="border-radius: 25px">
                  <div class="play-button"></div>
                  <p class="item-name">${movie.name || movie.title}</p> 
                </div>
              </a>
            </div>`;
          }
          gameContainer.insertAdjacentHTML("beforeend", gameHtml);
        });
      });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function displayPopular() {
  const response = await fetch(
    "https://api.themoviedb.org/3/trending/all/week?api_key=d93115754010beb32ae8956c26dbc590",
  );
  const data = await response.json();
  const popular = data.results;

  const gameContainer = document.getElementById("game-container");
  gameContainer.innerHTML = "";
  popular.forEach(function (movie) {
    let poster;
    if (movie.poster_path === null || !movie.poster_path) {
      poster = "/img/no-media.svg";
    } else {
      poster = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
    }

    let gameHtml;
    let rating = Math.round(movie.vote_average * 10) / 10;
    let year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
    if (movie.media_type === "tv") {
      year = movie.first_air_date ? movie.first_air_date.slice(0, 4) : "N/A";
      gameHtml = `<div class="card" style="padding-top: 5px">
        <div class="rating">★ ${rating}</div>
        <div class="year">${year}</div>
        <div class="image-container">
          <a onclick="promptForSeasonAndEpisode(${movie.id})"> 
            <div class="image-container">
              <img loading="eager" src="${poster}" style="border-radius: 25px">
              <div class="play-button"></div>
              <p class="item-name">${movie.name || movie.title}</p> 
            </div>
          </a>
        </div>
      </div>`;
    } else if (movie.media_type === "movie") {
      let link = `https://moviesapi.club/movie/${movie.id}`;
      gameHtml = `<div class="card" style="padding-top: 5px">
        <div class="rating">★ ${rating}</div>
        <div class="year">${year}</div>
        <a onclick="hire('${link}');"> 
          <div class="image-container">
            <img loading="eager" src="${poster}" style="border-radius: 25px">
            <div class="play-button"></div>
            <p class="item-name">${movie.name || movie.title}</p> 
          </div>
        </a>
      </div>`;
    }
    gameContainer.insertAdjacentHTML("beforeend", gameHtml);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  let cooldown = false;
  let popularText = document.getElementById("popular");
  document
    .getElementById("searchbar")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        popularText.style.display = "none";
        if (cooldown) {
          document.getElementById("cooldownNotice").style.display = "block";
        } else {
          fetchTmdbId();
          document.getElementById("cooldownNotice").style.display = "none";
          cooldown = true;
          setTimeout(function () {
            cooldown = false;
            document.getElementById("cooldownNotice").style.display = "none";
          }, 2000);
        }
      }
    });
  displayPopular();
});

function promptForSeasonAndEpisode(videoId) {
  const season = prompt("Enter season number:");
  const episode = prompt("Enter episode number:");
  if (!season || !episode) {
    return;
  } else if (isNaN(season) || isNaN(episode)) {
    alert("Season and episode must be numbers");
    return;
  } else if (season < 1 || episode < 1) {
    alert("Season and episode must be greater than 0");
    return;
  } else if (season.includes(".") || episode.includes(".")) {
    alert("Season and episode must be whole numbers");
    return;
  }

  const link = `https://moviesapi.club/tv/${videoId}-${season}-${episode}`;
  hire(link);
}
