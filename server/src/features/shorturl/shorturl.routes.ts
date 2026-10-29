import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware";
import { create, list, remove } from "./shorturl.controller";

export const shortUrlRoutes = Router();

shortUrlRoutes.use(requireAuth);
shortUrlRoutes.post("/", create);
shortUrlRoutes.get("/", list);
shortUrlRoutes.delete("/:id", remove);
