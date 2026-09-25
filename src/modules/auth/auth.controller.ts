import type {
  Request,
  Response,
} from "express";

import { loginSchema } from "./auth.schemas.js";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";

const authRepository =
  new AuthRepository();

const authService =
  new AuthService(authRepository);

const isProduction =
  process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction
    ? ("none" as const)
    : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export async function loginController(
  req: Request,
  res: Response,
) {
  const input =
    loginSchema.parse(req.body);

  const result =
    await authService.login(input);

  res.cookie(
    "saint_marin_session",
    result.token,
    cookieOptions,
  );

  return res.json({
    data: {
      user: result.user,
      expiresAt: result.expiresAt,
    },
  });
}

export async function meController(
  req: Request,
  res: Response,
) {
  return res.json({
    data: req.user,
  });
}

export async function logoutController(
  req: Request,
  res: Response,
) {
  const token =
    req.cookies?.saint_marin_session;

  if (token) {
    await authService.logout(token);
  }

  res.clearCookie(
    "saint_marin_session",
    cookieOptions,
  );

  return res.status(204).send();
}

export { authService };
