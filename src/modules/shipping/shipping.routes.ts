import { Router } from "express";

import {
  calculateShippingController,
  lookupCepController,
} from "./shipping.controller.js";

export const shippingRoutes =
  Router();

shippingRoutes.get(
  "/cep",
  lookupCepController,
);

shippingRoutes.post(
  "/quote",
  calculateShippingController,
);