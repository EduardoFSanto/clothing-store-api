import { Router } from "express";

import { requireAuth } from "../../middleware/require-auth.js";

import {
  createStockMovementController,
  getStockMovementsController,
} from "./stock.controller.js";

export const stockRoutes = Router();

stockRoutes.get(
  "/:variantId",
  getStockMovementsController,
);

stockRoutes.post(
  "/:variantId",
  requireAuth,
  createStockMovementController,
);