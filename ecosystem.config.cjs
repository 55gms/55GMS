const { existsSync } = require("node:fs");
const path = require("node:path");

// Once a build step writes dist/current/static (npm run build), the server
// serves that instead of static/. pm2 reads this file on every reload.
const BUILT_STATIC = "dist/current/static";
const hasBuild = existsSync(path.join(__dirname, BUILT_STATIC));

// pm2 settings for production. `pm2 reload ecosystem.config.cjs` replaces
// workers one at a time; wait_ready makes pm2 wait for index.js to report
// that it is listening before it retires the old worker.
module.exports = {
  apps: [
    {
      name: "55gms",
      script: "index.js",
      cwd: __dirname,
      exec_mode: "cluster",
      instances: 10,
      wait_ready: true,
      listen_timeout: 15000,
      // index.js gives itself 5 seconds to shut down.
      kill_timeout: 6000,
      env: {
        STATIC_ROOT: hasBuild ? BUILT_STATIC : "static",
      },
    },
  ],
};
