import { Request } from "@hapi/hapi";
import * as Hapi from "@hapi/hapi";
import * as Glue from "@hapi/glue";

import { manifest } from "./config/manifest";
import initDatabase from "./core/database";

const initProcess = async () => {
  const db = await initDatabase();
  console.info("Database initialized");
  const server = await Glue.compose(manifest, { relativeTo: __dirname });
  process.on("uncaughtException", (err) => {
    throw err;
  });

  process.on("unhandledRejection", (err) => {
    throw err;
  });

  server.events.on("stop", async () => {
    console.log("Server stopped");
    await db.disconnect();
  });

  return server;
};

export const start = async () => {
  const server = await initProcess();
  await server.start();
  console.info("Server listening on port", server.info.port);
};
