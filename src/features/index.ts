import { Router } from "express";
import { authRoutes } from "./auth/auth.routes";
import { redirect } from "./shorturl/shorturl.controller";
import { shortUrlRoutes } from "./shorturl/shorturl.routes";

export const apiRoutes = Router();
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/urls", shortUrlRoutes);

export const publicRoutes = Router();
publicRoutes.get("/:shortCode", redirect);
