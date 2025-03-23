async function getMovie() {
  const ID = new URLSearchParams(window.location.search).get("id");
  if (!ID) {
    window.location.href = "/";
    return;
  }
  url = `https://player.autoembed.cc/embed/movie/${ID}`;
  visit(url);  
}

document.addEventListener("DOMContentLoaded", function () {
  getMovie();
});
