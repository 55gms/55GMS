async function getMovie() {
  const ID = mediaPlayer.positiveInteger(
    new URLSearchParams(window.location.search).get("id"),
  );
  if (!ID) {
    window.location.href = "/";
    return;
  }

  mediaPlayer.load(ID);

  const titleElement = document.getElementById("titletext");
  if (!titleElement) return;

  try {
    const movie = await mediaPlayer.metadata(`movie/${ID}`);
    titleElement.textContent = movie.title;
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  getMovie();
});
