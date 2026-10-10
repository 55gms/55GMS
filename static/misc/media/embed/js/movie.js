async function getMovie() {
  const ID = new URLSearchParams(window.location.search).get("id");
  if (!ID) {
    window.location.href = "/";
    return;
  }
  url = `/embed.html#https://vidsrc.party/embed/movie/${ID}`;
  location.href = url;
}

document.addEventListener("DOMContentLoaded", function () {
  getMovie();
});
