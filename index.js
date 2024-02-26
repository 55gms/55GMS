const express = require("express");
const http = require("http");
const { createBareServer } = require("@tomphttp/bare-server-node");
const path = require("path");
const cors = require("cors");

const server = http.createServer();
const app = express(server);
const bareServer = createBareServer("/t/");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "static")));

const routes = [
  { path: "/a", file: "apps.html" },
  { path: "/g", file: "art.html" },
  { path: "/s", file: "settings.html" },
  { path: "/p", file: "science.html" },
  { path: "/!", file: "!.html" },
  { path: "/", file: "index.html" },
  { path: "/d", file: "dashboard.html" },
  { path: "/e", file: "english.html" },
  { path: "/-", file: "math.html" },
];

routes.forEach((route) => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, "static", route.file));
  });
});

app.get("/misc/*", (req, res, next) => {
  const baseUrl = "https://raw.githubusercontent.com/kfm5/a/main";
  fetchData(req, res, next, baseUrl);
});

async function fetchData(req, res, next, baseUrl) {
  const reqTarget = `${baseUrl}/${req.params[0]}`;
  const asset = await fetch(reqTarget);

  if (asset.ok) {
    const data = await asset.arrayBuffer();
    res.end(Buffer.from(data));
  } else {
    const indexReqTarget = `${baseUrl}/${req.params[0]}/index.html`;
    const indexAsset = await fetch(indexReqTarget);
    if (indexAsset.ok) {
      const indexData = await indexAsset.arrayBuffer();
      res.end(Buffer.from(indexData));
    } else {
      res
        .status(404)
        .send(
          "Not found, please clear your cache, or email me at support@rednotsus.xyz, If this issue persists, try clicking <a href='index.html'>here</a> and if it works, change your bookmark to the new link."
        );
      console.log("Could not Fetch", reqTarget);
    }
  }
}

server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "static/404.html"), function (err) {
    if (err) {
      res.status(404).send(err);
    }
  });
});

server.on("listening", () => {
  console.log(`Running at http://localhost:8080`);
});

server.listen({
  port: 8080,
});
