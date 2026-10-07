import { shippingRateLimiter } from "../../middleware/rate-limit.js";
import { Router } from "express";

import {
  calculateShippingController,
  lookupCepController,
} from "./shipping.controller.js";

export const shippingRoutes =
  Router();

shippingRoutes.get(
  "/cep",
  shippingRateLimiter,
  lookupCepController,
);

shippingRoutes.post(
  "/quote",
  shippingRateLimiter,
  calculateShippingController,
);