import { Router } from "express";

import {
  createStockMovementController,
  getStockMovementsController,
} from "./stock.controller.js";

export const stockRoutes =
  Router();

stockRoutes.get(
  "/:variantId",
  getStockMovementsController,
);

stockRoutes.post(
  "/:variantId",
  createStockMovementController,
);