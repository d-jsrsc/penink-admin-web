const { createServer } = require("http");
const { parse } = require("url");
const config = require("config");
const next = require("next");
const httpProxy = require("http-proxy");
const axios = require("axios");

const PORT = config.get("port");
const API_SERVER = config.get("api_server");

Object.assign(process.env, {
  PORT,
  API_SERVER,
});

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const proxy = httpProxy.createProxyServer({});

app.prepare().then(() => {
  createServer(async (req, res) => {
    // console.log("-->", req.method, req.url);
    const url = `${API_SERVER}/api/user/admin/check`;
    if (!req.headers.cookie) {
      res.statusCode = 401;
      res.end("401");
      return;
    }
    try {
      await axios.get(url, {
        headers: {
          cookie: req.headers.cookie,
        },
        // params: {
        //   ID: 12345,
        // },
      });
    } catch (error) {
      const code = error.response?.status || 500;
      res.statusCode = code;
      res.end(`${code}`);
      return;
    }
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
    console.log(`> api_server ${process.env.API_SERVER}`);
  });
});
