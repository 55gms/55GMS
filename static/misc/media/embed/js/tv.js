async function getMovie() {
  ID = new URLSearchParams(window.location.search).get("id");
  season = new URLSearchParams(window.location.search).get("s");
  episode = new URLSearchParams(window.location.search).get("e");
  if (!ID && !season && !episode) {
    window.location.href = "/";
    return;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  getMovie();
});


 function play() {
  location.href = `/embed.html#/https://player.videasy.net/${ID}/${season}/${episode}`;
}