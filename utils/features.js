import "dotenv/config";

// Values EXAMPLE.env ships with. A .env copied from it without being filled
// in counts as empty.
const PLACEHOLDERS = {
  POSTGRES_URL: "postgresql://username:password@localhost:5432/55gms_chat",
  workerAUTH: "your_worker_auth_token",
  hcaptchaSecret: "your_hcaptcha_secret",
};

export const inCodespaces = process.env.CODESPACES === "true";

function withAccountsAndChat(features) {
  features.accounts =
    process.env.ACCOUNT_BACKEND === "postgres"
      ? features.database
      : Boolean(process.env.workerAUTH);
  features.chat = features.database && features.accounts;
  return features;
}

// Which optional parts of the site the env asks for. Games, apps and the
// proxy need nothing. Accounts need their backend (the local database, or the
// Worker and its token) and chat needs the database and accounts. With no
// .env at all, both are off. The build reads this to leave their links out of
// the navbar.
export function configuredFeatures() {
  for (const [name, placeholder] of Object.entries(PLACEHOLDERS)) {
    if (process.env[name]?.trim() === placeholder) delete process.env[name];
  }

  return withAccountsAndChat({ database: Boolean(process.env.POSTGRES_URL) });
}

// What the server runs: the configured features, once the database has
// answered. The models are loaded only when it is configured.
export async function loadFeatures() {
  const features = { ...configuredFeatures(), database: false, models: null };

  if (process.env.POSTGRES_URL) {
    try {
      // Imported only here: config/database.js connects as it loads.
      const models = await import("../models/index.js");
      await models.initDatabase();
      features.database = true;
      features.models = models;
    } catch (error) {
      // A Codespace is a throwaway host, so it carries on without the
      // database. Anywhere else a configured database that fails is fatal.
      if (!inCodespaces) throw error;
      console.warn("⚠️  Database unreachable; starting without it.");
    }
  }

  return withAccountsAndChat(features);
}

// Pages that only work with the feature they belong to.
const ACCOUNT_PAGES = [
  "/login",
  "/signup",
  "/profile",
  "/account",
  "/admin",
  "/choose-handle",
  "/handles",
];
const CHAT_PAGES = ["/c", "/chat"];

// Sends visitors home from the pages of a feature that is turned off.
export function disabledPageRedirect(features) {
  const disabled = [
    ...(features.accounts ? [] : ACCOUNT_PAGES),
    ...(features.chat ? [] : CHAT_PAGES),
  ];

  return (req, res, next) => {
    const page = req.path.replace(/\.html$/, "").replace(/(.)\/+$/, "$1");
    const off = disabled.some(
      (prefix) => page === prefix || page.startsWith(prefix + "/"),
    );
    if (off && req.method === "GET") return res.redirect("/");
    next();
  };
}
