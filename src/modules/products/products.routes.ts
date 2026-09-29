import { Router } from "express";

import { requireAuth } from "../../middleware/require-auth.js";
import { requireAdmin } from "../../middleware/require-admin.js";

import {
  createProductController,
  getProductByIdController,
  getProductsController,
  updateProductController,
  deactivateProductController,
} from "./products.controller.js";

export const productsRoutes = Router();

productsRoutes.get("/", getProductsController);
productsRoutes.get("/:id", getProductByIdController);
productsRoutes.post("/", requireAuth, requireAdmin, createProductController);
productsRoutes.patch("/:id", requireAuth, requireAdmin, updateProductController);
productsRoutes.delete("/:id", requireAuth, requireAdmin, deactivateProductController);
