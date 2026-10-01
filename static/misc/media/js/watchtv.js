"use strict";

let episodeRequest = 0;
let currentSeason = "1";
let currentEpisode = "1";
let showId;

function readSelection() {
  const params = new URLSearchParams(window.location.search);
  currentSeason = mediaPlayer.positiveInteger(params.get("s"), "1");
  currentEpisode = mediaPlayer.positiveInteger(params.get("e"), "1");
}

function selectEpisode(season, episode, updateHistory = true) {
  currentSeason = String(season);
  currentEpisode = String(episode);
  if (updateHistory) {
    const url = new URL(window.location.href);
    url.searchParams.set("s", currentSeason);
    url.searchParams.set("e", currentEpisode);
    history.pushState(null, "", url);
  }
  mediaPlayer.load(showId, currentSeason, currentEpisode);
  document.getElementById("seasonSelector").value = currentSeason;
  for (const item of document.querySelectorAll(".episode-item")) {
    item.classList.toggle("active", item.dataset.episode === currentEpisode);
  }
}

async function getTVShowData() {
  showId = mediaPlayer.positiveInteger(
    new URLSearchParams(window.location.search).get("id"),
  );
  if (!showId) {
    window.location.href = "/";
    return;
  }
  readSelection();
  selectEpisode(currentSeason, currentEpisode, false);
  // Neither the player nor episode list depends on the show-details request.
  getEpisodes(currentSeason);
  try {
    const show = await mediaPlayer.metadata(`tv/${showId}`);
    populateSeasonSelector(
      show.seasons.filter((season) => season.season_number > 0),
    );
  } catch (error) {
    console.error("Error fetching TV show data:", error);
  }
}

function populateSeasonSelector(seasons) {
  const selector = document.getElementById("seasonSelector");
  selector.innerHTML = "";
  for (const season of seasons) {
    const option = document.createElement("option");
    option.value = season.season_number;
    option.textContent = season.name;
    selector.appendChild(option);
  }
  selector.value = currentSeason;
  selector.addEventListener("change", () => {
    selectEpisode(selector.value, "1");
    getEpisodes(currentSeason);
  });
}

async function getEpisodes(seasonNumber) {
  const request = ++episodeRequest;
  document.getElementById("episodeList").innerHTML = "";
  try {
    const season = await mediaPlayer.metadata(
      `tv/${showId}/season/${seasonNumber}`,
    );
    // A previous season can finish after a newer selection.
    if (request !== episodeRequest) return;
    displayEpisodes(season.episodes, seasonNumber);
  } catch (error) {
    console.error("Error fetching season data:", error);
  }
}

function displayEpisodes(episodes, seasonNumber) {
  const list = document.getElementById("episodeList");
  list.innerHTML = "";
  for (const episode of episodes) {
    const item = document.createElement("div");
    item.classList.add("episode-item");
    item.dataset.episode = String(episode.episode_number);
    item.textContent = `Episode ${episode.episode_number}: ${episode.name}`;
    item.addEventListener("click", () =>
      selectEpisode(seasonNumber, episode.episode_number),
    );
    item.classList.toggle("active", item.dataset.episode === currentEpisode);
    list.appendChild(item);
  }
}

window.addEventListener("popstate", () => {
  const previousSeason = currentSeason;
  readSelection();
  selectEpisode(currentSeason, currentEpisode, false);
  if (previousSeason !== currentSeason) getEpisodes(currentSeason);
});

document.addEventListener("DOMContentLoaded", getTVShowData);
