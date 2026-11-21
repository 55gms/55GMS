if (new Date().getMonth() === 11) {
  document.addEventListener("DOMContentLoaded", () => {

    const lights = document.createElement("div");
    lights.className = "gms-christmas-lights";

    const wire = document.createElementNS(
      "http://www.w3.org/2000/svg", "svg"
    );
    wire.classList.add("gms-christmas-wire");
    wire.setAttribute("viewBox", "0 0 1200 43");
    wire.setAttribute("preserveAspectRatio", "none");

    const path = document.createElementNS(
      "http://www.w3.org/2000/svg", "path"
    );

    let d = "M 0 2";
    for (let i = 0; i < 24; i++) {
      const start = i * 50;
      d += ` Q ${start + 25} 34 ${start + 50} 2`;
    }
    path.setAttribute("d", d);
    wire.appendChild(path);
    lights.appendChild(wire);

    const colors = [
      "#ff5a60", "#ffd35c", "#60e7a1",
      "#77c8ff", "#f5a0ff", "#ff9d59"
    ];

    for (let i = 0; i < 24; i++) {
      const bulb = document.createElement("span");
      bulb.className = "gms-christmas-bulb";

      bulb.style.setProperty(
        "--gms-light-x", `${(i + .5) * 100 / 24}%`
      );
      bulb.style.setProperty(
        "--gms-light-color", colors[i % colors.length]
      );
      bulb.style.setProperty(
        "--gms-light-speed", `${2.4 + (i % 5) * .38}s`
      );
      bulb.style.setProperty(
        "--gms-light-delay", `${-(i % 9) * .43}s`
      );

      lights.appendChild(bulb);
    }

    const snow = document.createElement("div");
    snow.className = "gms-christmas-snow";

    for (let i = 0; i < 38; i++) {
      const flake = document.createElement("span");
      flake.className = "gms-christmas-flake";

      const duration = 14 + Math.random() * 17;

      flake.style.setProperty(
        "--gms-snow-x", `${Math.random() * 100}%`
      );
      flake.style.setProperty(
        "--gms-snow-size", `${1.9 + Math.random() * 2.7}px`
      );
      flake.style.setProperty(
        "--gms-snow-opacity", `${.25 + Math.random() * .46}`
      );
      flake.style.setProperty(
        "--gms-snow-drift", `${(Math.random() - .5) * 130}px`
      );
      flake.style.setProperty(
        "--gms-snow-duration", `${duration}s`
      );
      flake.style.setProperty(
        "--gms-snow-delay", `${-Math.random() * duration}s`
      );

      snow.appendChild(flake);
    }

    lights.setAttribute("aria-hidden", "true");
    snow.setAttribute("aria-hidden", "true");

    document.body.append(lights, snow);
  });
}
