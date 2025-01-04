function createAndDisplayCard(movie, container) {
  let poster;
  if (movie.poster_path === null || !movie.poster_path) {
    return;
  } else {
    poster = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
  }

  let gameHtml;
  let rating = Math.round(movie.vote_average * 10) / 10;
  let year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";

  if (
    movie.media_type === "tv" ||
    (!movie.media_type && movie.first_air_date)
  ) {
    year = movie.first_air_date ? movie.first_air_date.slice(0, 4) : "N/A";
    gameHtml = `<div class="card" style="padding-top: 5px">
      <a href='/misc/media/tv.html?id=${movie.id}'> 
        <div class="rating">★ ${rating}</div>
        <div class="year">${year}</div>
        <div class="image-container">
          <img loading="eager" src="${poster}" style="border-radius: 10px">
          <div class="play-button"></div>
          <p class="item-name">${movie.name || movie.title}</p> 
        </div>
      </a>
    </div>`;
  } else {
    gameHtml = `<div class="card" style="padding-top: 5px">
      <a href="/misc/media/movie.html?id=${movie.id}"> 
        <div class="rating">★ ${rating}</div>
        <div class="year">${year}</div>
        <div class="image-container">
          <img loading="eager" src="${poster}" style="border-radius: 10px">
          <div class="play-button"></div>
          <p class="item-name">${movie.name || movie.title}</p> 
        </div>
      </a>
    </div>`;
  }
  container.insertAdjacentHTML("beforeend", gameHtml);
}

async function searchMedia(searchQuery) {
  try {
    const encodedSearch = encodeURIComponent(searchQuery);
    const url = `https://api.themoviedb.org/3/search/multi?api_key=9a2954cb0084e80efa20b3729db69067&language=en-US&query=${encodedSearch}&page=1&include_adult=false`;

    const response = await fetch(url);
    const data = await response.json();

    const bigDiv = document.getElementById("bigDiv");
    bigDiv.innerHTML = ``;

    const resultsContainer = document.createElement("div");
    resultsContainer.id = "search-results";
    resultsContainer.className = "search-results-container";
    bigDiv.appendChild(resultsContainer);

    data.results.forEach((movie) =>
      createAndDisplayCard(movie, resultsContainer)
    );

    if (resultsContainer.innerHTML.trim() === "") {
      resultsContainer.innerHTML = '<p class="no-results">No results found</p>';
    }
  } catch (error) {
    console.error("Error fetching search results:", error);
    const bigDiv = document.getElementById("bigDiv");
    bigDiv.innerHTML =
      '<p class="error">Error fetching search results. Please try again.</p>';
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let cooldown = false;
  const searchbar = document.getElementById("searchbar");
  const cooldownNotice = document.getElementById("cooldownNotice");

  searchbar.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      if (cooldown) {
        cooldownNotice.style.display = "block";
        return;
      }

      const searchQuery = searchbar.value.trim();
      if (searchQuery) {
        searchMedia(searchQuery);
        cooldownNotice.style.display = "none";
        cooldown = true;
        setTimeout(function () {
          cooldown = false;
          cooldownNotice.style.display = "none";
        }, 2000);
      }
    }
  });
});
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
