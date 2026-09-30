document.addEventListener("DOMContentLoaded", (event) => {
  fetch("/assets/json/motd.json")
    .then((response) => {
      if (!response.ok) throw new Error("Daily updates unavailable");
      return response.json();
    })
    .then((data) => {
      // Alert user if there is unread messages
      ["motd", "qotd"].forEach((type) => {
        if (localStorage.getItem(`${type}-last-body`) != data[type].body) {
          localStorage.setItem(`${type}-viewed`, "false");
        }
        // Change color to red if the message has not been viewed
        if (localStorage.getItem(`${type}-viewed`) != "true") {
          document.getElementById(type).classList.add("notice-unread");
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
          document.getElementById(type).classList.remove("notice-unread");
        });
      };

      document.getElementById("notice-status").textContent = "";
      ["motd", "qotd"].forEach((id) => {
        document.getElementById(id).disabled = false;
      });

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
          title: "Daily updates unavailable",
          text: "Check your connection and reload the page to try again.",
        });
      };
      document.getElementById("notice-status").textContent = "";
      ["motd", "qotd"].forEach((id) => {
        document.getElementById(id).disabled = false;
      });

      document.getElementById("notice-status").textContent =
        "Could not load daily updates. Reload to try again.";
      ["motd", "qotd"].forEach((id) => {
        document.getElementById(id).disabled = false;
      });
      // Set onclick events for motd and qotd to display the error message
      document.getElementById("motd").onclick = displayError;
      document.getElementById("qotd").onclick = displayError;
    });
});
