import type { NextFunction, Request, Response } from "express";
import { AUTH_COOKIE, ERRORS } from "../../lib/constant";
import { verifyToken } from "./auth.service";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.[AUTH_COOKIE.NAME];
  if (!token) {
    res.status(401).json({ error: ERRORS.UNAUTHORIZED });
    return;
  }

  const userId = await verifyToken(token);
  if (!userId) {
    res.status(401).json({ error: ERRORS.UNAUTHORIZED });
    return;
  }

  req.userId = userId;
  next();
}
