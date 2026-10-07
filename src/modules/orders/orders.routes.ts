import { Router } from "express";

import { orderRateLimiter } from "../../middleware/rate-limit.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { requireAdmin } from "../../middleware/require-admin.js";

import {
  cancelOrderController,
  createOrderController,
  getOrderByIdController,
  getOrdersController,
} from "./orders.controller.js";

export const ordersRoutes = Router();

ordersRoutes.get("/", requireAuth, requireAdmin, getOrdersController);
ordersRoutes.get("/:id", requireAuth, requireAdmin, getOrderByIdController);
ordersRoutes.post("/", orderRateLimiter, createOrderController);
ordersRoutes.patch("/:id/cancel", requireAuth, requireAdmin, cancelOrderController);
