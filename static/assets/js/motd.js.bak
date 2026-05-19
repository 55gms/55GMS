window.addEventListener("load", (event) => {
  fetch("/assets/json/motd.json")
    .then((response) => response.json())
    .then((data) => {
      // Alert user if there is unread messages
      ["motd", "qotd"].forEach((type) => {
        if (localStorage.getItem(`${type}-last-body`) != data[type].body) {
          localStorage.setItem(`${type}-viewed`, "false");
        }
        // Change color to red if the message has not been viewed
        if (localStorage.getItem(`${type}-viewed`) != "true") {
          document.getElementById(type).style.color = "#fc8585";
          document.getElementById(type).classList.add("pulse");
        }
      });

      // Function to create SweetAlert modal
      const createModal = (type, title, body, footer) => {
        return Swal.fire({
          icon: "info",
          title: title,
          html: body,
          footer: `<i style='font-size: 11px;'>submitted by ${footer}</i>`,
        }).then((response) => {
          localStorage.setItem(`${type}-last-body`, body);
          localStorage.setItem(`${type}-viewed`, "true");
          document.getElementById(type).style.color = "#f8f4f4";
          document.getElementById(type).classList.remove("pulse");
        });
      };

      // Set onclick events for motd and qotd
      document.getElementById("motd").onclick = () =>
        createModal(
          "motd",
          "Message Of The Day",
          data.motd.body,
          data.motd.footer,
        );
      document.getElementById("qotd").onclick = () =>
        createModal(
          "qotd",
          "Quote Of The Day",
          data.qotd.body,
          data.qotd.footer,
        );
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      // Display a generic error message to the user
      const displayError = () => {
        Swal.fire({
          icon: "error",
          title: "uh oh",
          html: "well oh no, prob error occurred while fetching or parsing data",
          footer: `<i style='font-size: 11px;'>${error}</i>`,
        });
      };
      // Set onclick events for motd and qotd to display the error message
      document.getElementById("motd").onclick = displayError;
      document.getElementById("qotd").onclick = displayError;
    });
});
