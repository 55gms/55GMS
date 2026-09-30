let tmdbAccessible = null;
let tmdbAccessPromise;
const CACHE_KEY = "tmdb_accessibility";
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000;

async function checkTmdbAccess() {
  if (tmdbAccessible !== null) return tmdbAccessible;
  if (tmdbAccessPromise) return tmdbAccessPromise;
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (cached && typeof cached.value === "boolean" && Date.now() - cached.timestamp < CACHE_DURATION) {
      tmdbAccessible = cached.value;
      return tmdbAccessible;
    }
  } catch { /* Ignore damaged cache entries. */ }
  tmdbAccessPromise = (async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    try {
      const responses = await Promise.all([
        fetch("https://api.themoviedb.org/3/configuration?api_key=9a2954cb0084e80efa20b3729db69067", { method: "HEAD", signal: controller.signal }),
        fetch("https://image.tmdb.org/t/p/w92/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", { method: "HEAD", signal: controller.signal }),
      ]);
      tmdbAccessible = responses.every((response) => response.ok);
    } catch { tmdbAccessible = false; }
    finally { clearTimeout(timeoutId); }
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ value: tmdbAccessible, timestamp: Date.now() }));
    } catch { /* Browsing still works when storage is unavailable. */ }
    return tmdbAccessible;
  })();
  return tmdbAccessPromise;
}

async function displayMediaSection(containerId, path) {
  const container = document.getElementById(containerId);
  container.setAttribute("aria-busy", "true");
  container.textContent = "Loading titles…";
  try {
    const accessible = await checkTmdbAccess();
    let url = `https://api.themoviedb.org/3/${path}?api_key=9a2954cb0084e80efa20b3729db69067&language=en-US`;
    if (!accessible) url = `/api/music/url=${encodeURIComponent(url)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    const data = await response.json();
    if (!container.isConnected) return;
    container.replaceChildren();
    for (const movie of data.results || []) createAndDisplayCard(movie, container, !accessible);
    if (!container.children.length) container.textContent = "No titles available right now.";
  } catch (error) {
    console.error("Media loading failed:", error);
    if (!container.isConnected) return;
    container.textContent = "Could not load titles. Check your connection. ";
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "gs";
    retry.textContent = "Try again";
    retry.addEventListener("click", () => displayMediaSection(containerId, path));
    container.appendChild(retry);
  } finally { container.setAttribute("aria-busy", "false"); }
}

document.addEventListener("DOMContentLoaded", () => {
  displayMediaSection("game-container", "trending/all/week");
  displayMediaSection("movie-container", "trending/movie/day");
  displayMediaSection("tv-container", "trending/tv/day");
});
