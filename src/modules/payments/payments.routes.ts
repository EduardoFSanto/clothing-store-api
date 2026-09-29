import { Router } from "express";

import { requireAuth } from "../../middleware/require-auth.js";

import {
  createPaymentController,
  getOrderPaymentsController,
  getPaymentByIdController,
} from "./payments.controller.js";

import {
  infinitePayWebhookController,
} from "./webhooks/infinitepay/infinitepay-webhook.controller.js";

export const paymentsRoutes =
  Router();

paymentsRoutes.get(
  "/orders/:orderId/payments",
  requireAuth,
  getOrderPaymentsController,
);

paymentsRoutes.post(
  "/orders/:orderId/payments",
  createPaymentController,
);

paymentsRoutes.get(
  "/payments/:id",
  requireAuth,
  getPaymentByIdController,
);

paymentsRoutes.post(
  "/webhooks/infinitepay",
  infinitePayWebhookController,
);
