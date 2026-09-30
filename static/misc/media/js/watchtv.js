async function getTVShowData() {
  const ID = new URLSearchParams(window.location.search).get("id");
  if (!ID) {
    window.location.href = "/";
    return;
  }
  const season = new URLSearchParams(window.location.search).get("s");
  const episode = new URLSearchParams(window.location.search).get("e");
  if (season && episode) {
    const iframe = document.getElementById("iframe");
    iframe.src = `embed/tv.html?id=${ID}&s=${season}&e=${episode}`;
  } else {
    location.href = `tv.html?id=${ID}&s=1&e=1`;
  }

  const url = `https://api.themoviedb.org/3/tv/${ID}?api_key=9a2954cb0084e80efa20b3729db69067&language=en-US`;
  try {
    const response = await fetch(url);
    const show = await response.json();

    const filteredSeasons = show.seasons.filter(
      (season) => season.name !== "Specials",
    );
    populateSeasonSelector(filteredSeasons, season, episode);
  } catch (error) {
    console.error("Error fetching TV show data:", error);
    document.getElementById("episodeList").textContent =
      "Could not load seasons. Reload to try again.";
  }
}

function populateSeasonSelector(seasons, currentSeason, currentEpisode) {
  const seasonSelector = document.getElementById("seasonSelector");
  const ID = new URLSearchParams(window.location.search).get("id");
  seasonSelector.innerHTML = "";
  seasons.forEach((season) => {
    const option = document.createElement("option");
    option.value = season.season_number;
    option.textContent = season.name;
    seasonSelector.appendChild(option);
  });

  seasonSelector.value = String(
    currentSeason || seasons[0]?.season_number || "",
  );

  seasonSelector.addEventListener("change", () => {
    const seasonNumber = seasonSelector.value;
    document.getElementById("iframe").src =
      `embed/tv.html?id=${ID}&s=${seasonNumber}&e=1`;
    getEpisodes(seasonNumber, 1);
    const url = new URL(location.href);
    url.searchParams.set("s", seasonNumber);
    url.searchParams.set("e", "1");
    history.replaceState(null, "", url);
  });

  if (seasons.length > 0) {
    getEpisodes(currentSeason || seasons[0].season_number, currentEpisode);
  }
}

async function getEpisodes(seasonNumber, currentEpisode) {
  const ID = new URLSearchParams(window.location.search).get("id");
  const url = `https://api.themoviedb.org/3/tv/${ID}/season/${seasonNumber}?api_key=9a2954cb0084e80efa20b3729db69067&language=en-US`;

  try {
    const response = await fetch(url);
    const season = await response.json();
    displayEpisodes(season.episodes, ID, seasonNumber, currentEpisode);
  } catch (error) {
    console.error("Error fetching season data:", error);
    document.getElementById("episodeList").textContent =
      "Could not load episodes. Select a season to try again.";
  }
}

function displayEpisodes(episodes, tmdbId, seasonNumber, currentEpisode) {
  const episodeList = document.getElementById("episodeList");
  episodeList.innerHTML = "";

  episodes.forEach((episode) => {
    const episodeItem = document.createElement("a");
    episodeItem.classList.add("episode-item");
    episodeItem.textContent = `Episode ${episode.episode_number}: ${episode.name}`;

    episodeItem.href = `tv.html?id=${tmdbId}&s=${seasonNumber}&e=${episode.episode_number}`;

    if (episode.episode_number == currentEpisode) {
      episodeItem.classList.add("active");
      episodeItem.setAttribute("aria-current", "true");
    }

    episodeList.appendChild(episodeItem);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  getTVShowData();
});
