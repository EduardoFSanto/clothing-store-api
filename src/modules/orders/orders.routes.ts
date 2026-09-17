import { Router } from "express";

import {
  createOrderController,
  getOrderByIdController,
  getOrdersController,
} from "./orders.controller.js";

export const ordersRoutes =
  Router();

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