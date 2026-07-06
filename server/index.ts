import path from "path";
import fs from "fs";
import express from "express";
import { createApp } from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env.PORT;
const port = Number(rawPort ?? 3001);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const app = createApp();

// In production, this same server also serves the built client so the whole
// app runs behind a single port. In development, the client is served by the
// separate Vite dev server (see package.json `dev` script), which proxies
// `/api` requests to this server.
if (process.env.NODE_ENV === "production") {
  const clientDist = path.resolve(import.meta.dirname, "..", "dist", "public");
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) {
        next();
        return;
      }
      res.sendFile(path.join(clientDist, "index.html"));
    });
  } else {
    logger.warn(
      { clientDist },
      "Built client not found; run `npm run build` before starting in production",
    );
  }
}

app.listen(port, () => {
  logger.info({ port }, "Server listening");
});
