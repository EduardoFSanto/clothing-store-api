import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { authService } from "../modules/auth/auth.controller.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token =
    req.cookies?.saint_marin_session;

  if (!token) {
    return res.status(401).json({
      error: {
        message: "Authentication required",
      },
    });
  }

  const result =
    await authService.findUserBySessionToken(
      token,
    );

  if (!result) {
    return res.status(401).json({
      error: {
        message: "Invalid or expired session",
      },
    });
  }

  req.user = {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    role: result.user.role,
  };

  return next();
}
