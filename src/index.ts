import express from "express";
import cookieParser from "cookie-parser";
import type { ErrorRequestHandler } from "express";
import { env } from "../env";
import { apiRoutes, publicRoutes } from "./features";
import { ERRORS } from "./lib/constant";

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

app.listen(env.PORT, () => {
  console.log(`Server running at http://localhost:${env.PORT}`);
});
