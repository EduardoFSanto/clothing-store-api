import { Router } from "express";

import {
  loginController,
  logoutController,
  meController,
} from "./auth.controller.js";

import { requireAuth } from "../../middleware/require-auth.js";

export const authRoutes =
  Router();

authRoutes.post(
  "/login",
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
