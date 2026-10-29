import express from "express";
import cookieParser from "cookie-parser";
import type { ErrorRequestHandler } from "express";
import { env } from "../env";
import { apiRoutes, publicRoutes } from "./features";
import { ERRORS } from "./lib/constant";
import { startKafka, stopKafka } from "./lib/kafka";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", apiRoutes);
app.use(publicRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: ERRORS.NOT_FOUND });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: ERRORS.INTERNAL_SERVER_ERROR });
};

app.use(errorHandler);

await startKafka();

const server = app.listen(env.PORT, () => {
  console.log(`Server running at http://localhost:${env.PORT}`);
});

async function shutdown() {
  server.close();
  await stopKafka();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
