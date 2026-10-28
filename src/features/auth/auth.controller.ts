import type { Request, Response } from "express";
import { ERRORS } from "../../lib/constant";
import { loginSchema, registerSchema } from "../../types/auth";
import { clearAuthCookie, setAuthCookie } from "./auth.cookie";
import {
  createToken,
  findUserById,
  loginUser,
  registerUser,
} from "./auth.service";

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: ERRORS.INVALID_INPUT, issues: parsed.error.issues });
    return;
  }

  const user = await registerUser(parsed.data);
  if (!user) {
    res.status(409).json({ error: ERRORS.EMAIL_ALREADY_REGISTERED });
    return;
  }

  setAuthCookie(res, await createToken(user.id));
  res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: ERRORS.INVALID_INPUT, issues: parsed.error.issues });
    return;
  }

  const user = await loginUser(parsed.data);
  if (!user) {
    res.status(401).json({ error: ERRORS.INVALID_CREDENTIALS });
    return;
  }

  setAuthCookie(res, await createToken(user.id));
  res.json({ user });
}

export async function logout(_req: Request, res: Response) {
  clearAuthCookie(res);
  res.status(204).send();
}

export async function me(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: ERRORS.UNAUTHORIZED });
    return;
  }

  const user = await findUserById(userId);
  if (!user) {
    res.status(404).json({ error: ERRORS.USER_NOT_FOUND });
    return;
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
}
