import { readFileSync } from "node:fs";

// Games used to have a play page each (/misc/play/1v1lol.html). They now all
// open on the shared one, /misc/play/?title=…&link=…, and the old addresses
// redirect there. Keys are the old file names, lowercased, without `.html`.
const TARGETS = JSON.parse(
  readFileSync(new URL("./legacy-play-pages.json", import.meta.url), "utf8"),
);

export function mountLegacyPlayRedirects(app) {
  app.get(/^\/misc\/play\/([^/]+?)(?:\.html)?$/i, (req, res, next) => {
    const name = req.params[0].toLowerCase();
    if (!Object.hasOwn(TARGETS, name)) return next();
    res.redirect(301, TARGETS[name]);
  });
}
