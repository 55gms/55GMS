async function getMovie() {
  const ID = new URLSearchParams(window.location.search).get("id");
  if (!ID) {
    window.location.href = "/";
    return;
  }
  url = `/embed.html#https://player.videasy.net/movie/${ID}?title=false`;
  location.href = url;
}

document.addEventListener("DOMContentLoaded", function () {
  getMovie();
});
