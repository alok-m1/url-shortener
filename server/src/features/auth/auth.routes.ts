import { Router } from "express";
import { login, logout, me, register } from "./auth.controller";
import { requireAuth } from "./auth.middleware";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/me", requireAuth, me);
