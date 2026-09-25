import { Router } from "express";

import { requireAuth } from "../../middleware/require-auth.js";

import {
  createProductController,
  getProductByIdController,
  getProductsController,
} from "./products.controller.js";

export const productsRoutes = Router();

productsRoutes.get("/", getProductsController);

productsRoutes.get(
  "/:id",
  getProductByIdController,
);

productsRoutes.post(
  "/",
  requireAuth,
  createProductController,
);