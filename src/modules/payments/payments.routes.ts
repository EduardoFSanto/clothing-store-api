import { Router } from "express";

import {
  createPaymentController,
  getOrderPaymentsController,
  getPaymentByIdController,
} from "./payments.controller.js";

export const paymentsRoutes =
  Router();

paymentsRoutes.get(
  "/orders/:orderId/payments",
  getOrderPaymentsController,
);

paymentsRoutes.post(
  "/orders/:orderId/payments",
  createPaymentController,
);

paymentsRoutes.get(
  "/payments/:id",
  getPaymentByIdController,
);