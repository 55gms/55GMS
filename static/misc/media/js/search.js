function createAndDisplayCard(movie, container, useProxy = false) {
  if (!movie.poster_path || (movie.media_type && !["tv", "movie"].includes(movie.media_type))) return;
  const tv = movie.media_type === "tv" || (!movie.media_type && movie.first_air_date);
  const posterUrl = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
  const card = document.createElement("a");
  card.className = "card";
  card.href = `/misc/media/${tv ? "tv" : "movie"}.html?id=${encodeURIComponent(movie.id)}`;
  const image = document.createElement("img");
  image.src = useProxy ? "/api/music/url=" + encodeURIComponent(posterUrl) : posterUrl;
  image.alt = "";
  image.width = 145;
  image.height = 218;
  image.loading = "lazy";
  image.decoding = "async";
  const name = document.createElement("p");
  name.className = "item-name";
  name.textContent = movie.name || movie.title || "Untitled";
  const meta = document.createElement("p");
  meta.className = "item-meta";
  const date = tv ? movie.first_air_date : movie.release_date;
  const rating = Number(movie.vote_average);
  meta.textContent = `${date ? date.slice(0, 4) : "Year unknown"} · ${tv ? "TV" : "Movie"}${Number.isFinite(rating) ? ` · ★ ${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(rating)}` : ""}`;
  card.append(image, name, meta);
  container.appendChild(card);
}

let activeSearch;
async function searchMedia(searchQuery) {
  activeSearch?.abort();
  const controller = new AbortController();
  activeSearch = controller;
  const bigDiv = document.getElementById("bigDiv");
  bigDiv.setAttribute("aria-busy", "true");
  const status = document.getElementById("media-search-status");
  status.textContent = "Searching…";
  try {
    let url = `https://api.themoviedb.org/3/search/multi?api_key=9a2954cb0084e80efa20b3729db69067&language=en-US&query=${encodeURIComponent(searchQuery)}&page=1&include_adult=false`;
    const accessible = await checkTmdbAccess();
    if (controller.signal.aborted) return;
    if (!accessible) url = `/api/music/url=${encodeURIComponent(url)}`;
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    const data = await response.json();
    if (controller.signal.aborted) return;
    bigDiv.replaceChildren();
    const heading = document.createElement("h2");
    heading.textContent = `Results for “${searchQuery}”`;
    const results = document.createElement("div");
    results.id = "search-results";
    results.className = "search-results-container";
    bigDiv.append(heading, results);
    for (const movie of data.results || []) createAndDisplayCard(movie, results, !accessible);
    status.textContent = results.children.length ? `${results.children.length} titles found.` : "No titles found. Try another name.";
  } catch (error) {
    if (controller.signal.aborted) return;
    console.error("Media search failed:", error);
    status.textContent = "Could not search. Check your connection and try again.";
  } finally {
    if (activeSearch === controller) bigDiv.setAttribute("aria-busy", "false");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("media-search").addEventListener("submit", (event) => {
    event.preventDefault();
    const query = document.getElementById("media-query").value.trim();
    if (query) searchMedia(query);
  });
});
