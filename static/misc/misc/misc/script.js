function random() {
  var WAIT_MS = 01; // 10 seconds
  var PERCENT = 0.5; // 15% chance
  setTimeout(function () {
    if (Math.random() <= PERCENT) {
      window.location = "/misc/misc/misc/uwu.html";
    } else {
      window.location = "/misc/misc/misc/lmao.html";
    }
  }, WAIT_MS);
}
