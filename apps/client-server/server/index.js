#!/usr/bin/env node

const path = require("node:path");
const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const { createRequestHandler } = require("expo-server/adapter/express");

const isProduction = (process.env.NODE_ENV ?? "production") === "production";
const CLIENT_BUILD_DIR = path.join(process.cwd(), "dist/client");
const SERVER_BUILD_DIR = path.join(process.cwd(), "dist/server");
const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

const allowedHosts = process.env.ALLOWED_HOSTS
  ? process.env.ALLOWED_HOSTS.split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  : null;

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        frameSrc: ["'self'", "https://www.youtube.com/"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https:",
          "http://file.koreafilm.or.kr/thm/",
        ],
        fontSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "https:", "wss:"],
        upgradeInsecureRequests: isProduction ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts: isProduction
      ? { maxAge: 31_536_000, includeSubDomains: true, preload: false }
      : false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
);

if (allowedHosts?.length) {
  app.use((req, res, next) => {
    if (!allowedHosts.includes(req.hostname)) {
      res.status(421).end();
      return;
    }
    next();
  });
}

app.use((req, res, next) => {
  if (req.method === "TRACE" || req.method === "TRACK" || req.method === "CONNECT") {
    res.status(405).end();
    return;
  }
  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(compression({ threshold: 1024 }));
app.use(
  express.static(CLIENT_BUILD_DIR, {
    maxAge: isProduction ? "1h" : 0,
    extensions: ["html"],
    dotfiles: "ignore",
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  }),
);
app.use(morgan(isProduction ? "combined" : "dev"));

const ssrLimiter = rateLimit({
  windowMs: 60_000,
  max: Number(process.env.SSR_RATE_LIMIT_MAX ?? 120),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests" },
});

app.all(
  "/{*all}",
  ssrLimiter,
  createRequestHandler({
    build: SERVER_BUILD_DIR,
    environment: "production",
  }),
);

app.use((err, _req, res, _next) => {
  if (res.headersSent) {
    return;
  }

  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).send(isProduction ? "Internal Server Error" : String(err?.stack ?? err));
});

const server = app.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`Expo SSR server listening on ${host}:${port}`);
});

server.requestTimeout = 30_000;
server.headersTimeout = 35_000;
server.keepAliveTimeout = 5_000;

function shutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`${signal} received, closing server`);
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => {
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
