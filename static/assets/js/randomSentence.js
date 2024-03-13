window.addEventListener("load", (event) => {
  fetch("/assets/json/quotes.json")
    .then((response) => response.json())
    .then((data) => {
      const totalFrequency = data.reduce(
        (acc, item) => acc + item.frequency,
        0,
      );
      const rng = Math.random() * totalFrequency;

      let cumulativeFrequency = 0;
      for (const item of data) {
        cumulativeFrequency += item.frequency;
        if (rng < cumulativeFrequency) {
          document.getElementById("sub").innerHTML =
            item.msg || "nothing to see here<br>no quotes";
          break;
        }
      }
    })
    .catch((error) => {
      document.getElementById("sub").innerHTML =
        "idk what happened something broke";
    });
});
