let tmdbAccessible = null;
const CACHE_KEY = "tmdb_accessibility";
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

async function checkTmdbAccess() {
  if (tmdbAccessible !== null) return tmdbAccessible;

  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { value, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      tmdbAccessible = value;
      return tmdbAccessible;
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const [apiResponse, imageResponse] = await Promise.all([
      fetch(
        "https://api.themoviedb.org/3/configuration?api_key=9a2954cb0084e80efa20b3729db69067",
        {
          method: "HEAD",
          signal: controller.signal,
        }
      ),
      fetch("https://image.tmdb.org/t/p/w92/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", {
        method: "HEAD",
        signal: controller.signal,
      }),
    ]);
    clearTimeout(timeoutId);
    tmdbAccessible = apiResponse.ok && imageResponse.ok;
  } catch (error) {
    tmdbAccessible = false;
  }

  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      value: tmdbAccessible,
      timestamp: Date.now(),
    })
  );

  return tmdbAccessible;
}

async function displayPopular() {
  let url = "https://api.themoviedb.org/3/trending/all/week?api_key=d93115754010beb32ae8956c26dbc590";
  const isAccessible = await checkTmdbAccess();
  if (!isAccessible) {
    url = `/api/music/url=${encodeURIComponent(url)}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  const popular = data.results;

  const gameContainer = document.getElementById("game-container");
  gameContainer.innerHTML = "";
  popular.forEach(function (movie) {
    let poster;
    if (movie.poster_path === null || !movie.poster_path) {
      return;
    } else {
      let posterUrl = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
      if (!isAccessible) {
        poster = "/api/music/url=" + encodeURIComponent(posterUrl);
      } else {
        poster = posterUrl;
      }
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
          <a href='/misc/media/tv.html?id=${movie.id}'"> 
            <div class="image-container">
              <img loading="eager" src="${poster}" style="border-radius: 10px">
              <div class="play-button"></div>
              <p class="item-name">${movie.name || movie.title}</p> 
            </div>
          </a>
        </div>
      </div>`;
    } else if (movie.media_type === "movie") {
      gameHtml = `<div class="card" style="padding-top: 5px">
        <div class="rating">★ ${rating}</div>
        <div class="year">${year}</div>
        <a href="/misc/media/movie.html?id=${movie.id}"> 
          <div class="image-container">
            <img loading="eager" src="${poster}" style="border-radius: 10px">
            <div class="play-button"></div>
            <p class="item-name">${movie.name || movie.title}</p> 
          </div>
        </a>
      </div>`;
    }
    gameContainer.insertAdjacentHTML("beforeend", gameHtml);
  });
}
async function displayMovies() {
  let url = "https://api.themoviedb.org/3/trending/movie/day?language=en-US&api_key=9a2954cb0084e80efa20b3729db69067";
  const isAccessible = await checkTmdbAccess();
  if (!isAccessible) {
    url = `/api/music/url=${encodeURIComponent(url)}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  const popular = data.results;

  const gameContainer = document.getElementById("movie-container");
  gameContainer.innerHTML = "";
  popular.forEach(function (movie) {
    let poster;
    if (movie.poster_path === null || !movie.poster_path) {
      return;
    } else {
      let posterUrl = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
      if (!isAccessible) {
        poster = "/api/music/url=" + encodeURIComponent(posterUrl);
      } else {
        poster = posterUrl;
      }
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
          <a href='/misc/media/tv.html?id=${movie.id}'"> 
            <div class="image-container">
              <img loading="eager" src="${poster}" style="border-radius: 10px">
              <div class="play-button"></div>
              <p class="item-name">${movie.name || movie.title}</p> 
            </div>
          </a>
        </div>
      </div>`;
    } else if (movie.media_type === "movie") {
      gameHtml = `<div class="card" style="padding-top: 5px">
        <div class="rating">★ ${rating}</div>
        <div class="year">${year}</div>
        <a href='/misc/media/movie.html?id=${movie.id}'"> 
          <div class="image-container">
            <img loading="eager" src="${poster}" style="border-radius: 10px">
            <div class="play-button"></div>
            <p class="item-name">${movie.name || movie.title}</p> 
          </div>
        </a>
      </div>`;
    }
    gameContainer.insertAdjacentHTML("beforeend", gameHtml);
  });
}
async function displayTV() {
  let url = "https://api.themoviedb.org/3/trending/tv/day?language=en-US&api_key=d93115754010beb32ae8956c26dbc590";
  const isAccessible = await checkTmdbAccess();
  if (!isAccessible) {
    url = `/api/music/url=${encodeURIComponent(url)}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  const popular = data.results;

  const gameContainer = document.getElementById("tv-container");

  popular.forEach(function (movie) {
    let poster;
    if (movie.poster_path === null || !movie.poster_path) {
      return;
    } else {
      let posterUrl = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
      if (!isAccessible) {
        poster = "/api/music/url=" + encodeURIComponent(posterUrl);
      } else {
        poster = posterUrl;
      }
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
          <a href='/misc/media/tv.html?id=${movie.id}'"> 
            <div class="image-container">
              <img loading="eager" src="${poster}" style="border-radius: 10px">
              <div class="play-button"></div>
              <p class="item-name">${movie.name || movie.title}</p> 
            </div>
          </a>
        </div>
      </div>`;
    } else if (movie.media_type === "movie") {
      gameHtml = `<div class="card" style="padding-top: 5px">
        <div class="rating">★ ${rating}</div>
        <div class="year">${year}</div>
        <a href="/misc/media/movie.html?id=${movie.id}"> 
          <div class="image-container">
            <img loading="eager" src="${poster}" style="border-radius: 10px">
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
  displayPopular();
  displayMovies();
  displayTV();
  startAutoScroll();
});

function startAutoScroll() {
  const scrollContainers = document.querySelectorAll(".scroll-container");

  scrollContainers.forEach((container) => {
    let scrollInterval;

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth
        ) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({
            left: container.clientWidth,
            behavior: "smooth",
          });
        }
      }, 5000);
    };

    const stopScrolling = () => {
      clearInterval(scrollInterval);
    };

    container.addEventListener("mouseenter", stopScrolling);
    container.addEventListener("mouseleave", startScrolling);

    startScrolling();
  });
}
