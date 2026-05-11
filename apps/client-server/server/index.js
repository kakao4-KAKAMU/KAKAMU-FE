#!/usr/bin/env node

const path = require("node:path");
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const { createRequestHandler } = require("expo-server/adapter/express");

const CLIENT_BUILD_DIR = path.join(process.cwd(), "dist/client");
const SERVER_BUILD_DIR = path.join(process.cwd(), "dist/server");
const port = Number(process.env.PORT ?? 3000);

const app = express();

app.disable("x-powered-by");
app.use(compression());
app.use(
  express.static(CLIENT_BUILD_DIR, {
    maxAge: "1h",
    extensions: ["html"],
  })
);
app.use(morgan("tiny"));

app.all(
  "/{*all}",
  createRequestHandler({
    build: SERVER_BUILD_DIR,
    environment: process.env.NODE_ENV ?? "production",
  })
);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Expo SSR server listening on port ${port}`);
});
