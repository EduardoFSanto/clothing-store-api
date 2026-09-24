import { Router } from "express";

import {
  cancelOrderController,
  createOrderController,
  getOrderByIdController,
  getOrdersController,
} from "./orders.controller.js";

export const ordersRoutes = Router();

ordersRoutes.get(
  "/",
  getOrdersController,
);

ordersRoutes.get(
  "/:id",
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