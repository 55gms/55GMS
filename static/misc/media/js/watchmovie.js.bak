async function getMovie() {
  const ID = new URLSearchParams(window.location.search).get("id");
  if (!ID) {
    window.location.href = "/";
    return;
  }

  const url = `https://api.themoviedb.org/3/movie/${ID}?api_key=9a2954cb0084e80efa20b3729db69067&language=en-US`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const movie = await response.json();
    const titleElement = document.getElementById("titletext");
    if (titleElement) {
      titleElement.innerHTML = movie.title;
    }
    const iframe = document.getElementById("iframe");
    if (iframe) {
      iframe.src = `embed/movie.html?id=${ID}`;
    }
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  getMovie();
});
