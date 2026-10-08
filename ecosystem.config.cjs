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
        // Serve the built site (npm run build). Unset, the server serves static/.
        STATIC_ROOT: "dist/current/static",
      },
    },
  ],
};
