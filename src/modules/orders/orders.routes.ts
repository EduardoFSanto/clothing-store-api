import { Router } from "express";

import { requireAuth } from "../../middleware/require-auth.js";

import {
  cancelOrderController,
  createOrderController,
  getOrderByIdController,
  getOrdersController,
} from "./orders.controller.js";

export const ordersRoutes = Router();

ordersRoutes.get(
  "/",
  requireAuth,
  getOrdersController,
);

ordersRoutes.get(
  "/:id",
  requireAuth,
  getOrderByIdController,
);

ordersRoutes.post(
  "/",
  createOrderController,
);

ordersRoutes.patch(
  "/:id/cancel",
  cancelOrderController,
);