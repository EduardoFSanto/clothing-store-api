import { Router } from "express";

import { requireAuth } from "../../middleware/require-auth.js";
import { requireAdmin } from "../../middleware/require-admin.js";

import {
  createStockMovementController,
  getStockMovementsController,
} from "./stock.controller.js";

export const stockRoutes = Router();

stockRoutes.get("/:variantId", requireAuth, requireAdmin, getStockMovementsController);
stockRoutes.post("/:variantId", requireAuth, requireAdmin, createStockMovementController);
