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
  { path: "/l", file: "/assets/404/loading.html" },
];

routes.forEach((route) => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, "static", route.file));
  });
});

app.get("/misc/*", async (req, res, next) => {
  const baseUrl = "https://raw.githubusercontent.com/kfm5/a/main";
  const secondaryUrl = "https://raw.githubusercontent.com/22yeets22/a/main";
  await fetchDataFromGithub(req, res, next, baseUrl, secondaryUrl);
});

async function fetchDataFromGithub(
  req,
  res,
  next,
  baseUrl,
  secondaryUrl = null,
) {
  function isAFile(urlString) {
    return urlString.trim().split("/").pop().length !== 0;
  }

  async function fetchDataOneSource(req, res, next, url) {
    if (isAFile(req.params[0])) {
      const reqTarget = `${url}/${req.params[0]}`;
      const asset = await fetch(reqTarget);
      if (asset.ok) {
        const data = await asset.arrayBuffer();
        res.end(Buffer.from(data));
        return true;
      }
    } else {
      const indexReqTarget = `${url}/${req.params[0]}/index.html`;
      const indexAsset = await fetch(indexReqTarget);
      if (indexAsset.ok) {
        const indexData = await indexAsset.arrayBuffer();
        res.end(Buffer.from(indexData));
        return true;
      }
    }
    return false;
  }

  try {
    if (await fetchDataOneSource(req, res, next, baseUrl)) return;
    if (secondaryUrl) {
      if (await fetchDataOneSource(req, res, next, secondaryUrl)) return;
    }
    res.status(404).send("Resource not found");
  } catch (error) {
    console.error("Error fetching data, internal server error:", error);
    res.status(500).send("Internal Server Error");
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
