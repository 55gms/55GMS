fetch("./assets/motd.json")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("motd").onclick = function() {
      Swal.fire({icon: 'info', title: 'Message Of The Day', html: data.motd.body, footer: `<i style='font-size: 11px;'>submitted by ${data.motd.footer}</i>`});
    }
    document.getElementById("qotd").onclick = function() {
      Swal.fire({icon: 'info', title: 'Quote Of The Day', html: data.qotd.body, footer: `<i style='font-size: 11px;'>submitted by ${data.qotd.footer}</i>`});
    }
  }).catch((error) => {
    document.getElementById("motd").onclick = function() {
      Swal.fire({icon: 'error', title: 'Error', html: 'Well oh no', footer: `<i style='font-size: 11px;'>${error}</i>`});
    }
    document.getElementById("qotd").onclick = function() {
      Swal.fire({icon: 'error', title: 'Error', html: 'Well oh no', footer: `<i style='font-size: 11px;'>${error}</i>`});
    }
  });
