import { Router } from "express";

import { paymentRateLimiter } from "../../middleware/rate-limit.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { requireAdmin } from "../../middleware/require-admin.js";

import {
  createPaymentController,
  getOrderPaymentsController,
  getPaymentByIdController,
} from "./payments.controller.js";

import { infinitePayWebhookController } from "./webhooks/infinitepay/infinitepay-webhook.controller.js";

export const paymentsRoutes = Router();

paymentsRoutes.get("/orders/:orderId/payments", requireAuth, requireAdmin, getOrderPaymentsController);
paymentsRoutes.post("/orders/:orderId/payments", paymentRateLimiter, createPaymentController);
paymentsRoutes.get("/payments/:id", requireAuth, requireAdmin, getPaymentByIdController);
paymentsRoutes.post("/webhooks/infinitepay", infinitePayWebhookController);
