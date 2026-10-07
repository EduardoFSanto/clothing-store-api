import { Router } from "express";

import { loginRateLimiter } from "../../middleware/rate-limit.js";
import { requireAuth } from "../../middleware/require-auth.js";

import {
  loginController,
  logoutController,
  meController,
} from "./auth.controller.js";

export const authRoutes =
  Router();

authRoutes.post(
  "/login",
  loginRateLimiter,
  loginController,
);

authRoutes.get(
  "/me",
  requireAuth,
  meController,
);

authRoutes.post(
  "/logout",
  requireAuth,
  logoutController,
);
