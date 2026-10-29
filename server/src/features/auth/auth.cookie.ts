import type { CookieOptions, Response } from "express";
import { env } from "../../../env";
import { AUTH_COOKIE } from "../../lib/constant";

const baseOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.NODE_ENV === "production",
  path: "/",
};

export function setAuthCookie(res: Response, token: string) {
  res.cookie(AUTH_COOKIE.NAME, token, {
    ...baseOptions,
    maxAge: AUTH_COOKIE.MAX_AGE_MS,
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(AUTH_COOKIE.NAME, baseOptions);
}
