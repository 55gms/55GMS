(async function () {
  function script(text) {
    console.log(
      "%cScript Injection",
      "color: cyan; font-weight: 600; background: black; padding: 0 5px; border-radius: 5px",
      text,
    );
  }

  try {
    const response = await fetch("/assets/json/ads.json");
    const data = await response.json();
    const addisplay = document.getElementById("addisplay");

    if (data.domains.includes(window.location.hostname)) {
      const adsenseScript = document.createElement("script");
      adsenseScript.async = true;
      adsenseScript.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6700774525685317";
      adsenseScript.crossOrigin = "anonymous";
      document.head.appendChild(adsenseScript);

      adsenseScript.onload = function () {
        var adContainer = document.getElementById("adElement");
        adContainer.className = "adsbygoogle";
        adContainer.style.display = "inline-block";
        adContainer.style.width = "16vw";
        adContainer.style.height = "32vw";
        adContainer.setAttribute("data-ad-client", "ca-pub-6700774525685317");
        adContainer.setAttribute("data-ad-slot", "4125362748");

        var scriptContainer = document.querySelector(".script-container");
        if (scriptContainer) {
          scriptContainer.appendChild(adContainer);
          (adsbygoogle = window.adsbygoogle || []).push({});
        }
      };

      adsenseScript.onerror = function () {
        if (addisplay) {
          addisplay.innerHTML = `<a href='https://discord.gg/55gms'><img src="/img/ad.png" style="width: 16vw; height: 32vw; border-radius: 10px;"></a>`;
          addisplay.style.display = "block";
        }
        console.log(
          "Failed to load Adsense script, displaying fallback image.",
        );
      };

      script("Injected Adsense script");
    } else {
      if (addisplay) {
        addisplay.innerHTML = `<a href='https://discord.gg/55gms'><img src="/img/ad.png" style="width: 16vw; height: 32vw; border-radius: 10px;"></a>`;
        addisplay.style.display = "block";
      }
      console.log(
        "Skipping Adsense Injection for this domain, displaying fallback image.",
      );
    }
  } catch (error) {
    console.error("Error loading ads.json:", error);
    if (addisplay) {
      addisplay.innerHTML = `<a href='https://discord.gg/55gms'><img src="/img/ad.png" style="width: 16vw; height: 32vw; border-radius: 10px;"></a>`;
      addisplay.style.display = "block";
    }
  }
})();
