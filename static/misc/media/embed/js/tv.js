
window.addEventListener("chemicalLoaded", async function(e) {
  ID = new URLSearchParams(window.location.search).get("id");
  season = new URLSearchParams(window.location.search).get("s");
  episode = new URLSearchParams(window.location.search).get("e");
  if (!ID && !season && !episode) {
    window.location.href = "/";
    return;
  }
    url = `https://vidfast.pro/tv/${ID}/${season}/${episode}?title=false`;

    location.href = await chemical.encode(url)
});