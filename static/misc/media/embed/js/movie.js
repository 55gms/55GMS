async function getMovie() {
  const ID = new URLSearchParams(window.location.search).get("id");
  if (!ID) {
    window.location.href = "/";
    return;
  }
  url = `/embed.html#https://vidfast.pro/movie/${ID}?title=false`;
  location.href = url;
}

document.addEventListener("DOMContentLoaded", function () {
  getMovie();
});
