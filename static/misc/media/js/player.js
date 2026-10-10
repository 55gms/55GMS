"use strict";

window.mediaPlayer = {
  positiveInteger(value, fallback = null) {
    return /^[1-9]\d*$/.test(value || "") ? value : fallback;
  },

  // Must match the codec in /assets/js/frame-runtime.js.
  token(target) {
    const bytes = new TextEncoder().encode(target);
    let out = "";
    for (let i = 0; i < bytes.length; i++)
      out += String.fromCharCode(bytes[i] ^ (37 + (i % 7)));
    return btoa(out).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  },

  load(id, season, episode) {
    const path = season
      ? `tv/${id}/${season}/${episode}`
      : `movie/${id}`;
    const iframe = document.getElementById("iframe");
    iframe.allow = "fullscreen; autoplay; encrypted-media; picture-in-picture";
    // Only the hash changes between episodes, keeping the embed and its
    // transport alive instead of rebuilding the entire watch screen.
    const url = `/embed.html#~${this.token(`https://vidsrc.party/embed/${path}`)}`;
    if (iframe.dataset.playerMounted) {
      // Replace the child entry so Back/Forward follows the watch-page URL.
      iframe.contentWindow.location.replace(url);
    } else {
      iframe.src = url;
      iframe.dataset.playerMounted = "true";
    }
  },

  async metadata(path) {
    const url = new URL(`https://api.themoviedb.org/3/${path}`);
    url.searchParams.set("api_key", "9a2954cb0084e80efa20b3729db69067");
    url.searchParams.set("language", "en-US");
    // The catalog already uses this allowlisted route on blocked networks.
    const response = await fetch(`/api/music/url=${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      throw new Error(`Metadata request failed (${response.status})`);
    return response.json();
  },
};
