import { Router } from "express";

import { requireAuth } from "../../middleware/require-auth.js";

import {
  createProductVariantController,
  deleteProductVariantController,
  getProductVariantByIdController,
  getProductVariantsController,
  updateProductVariantController,
} from "./product-variants.controller.js";

export const productVariantsRoutes = Router();

productVariantsRoutes.get(
  "/:productId/variants",
  getProductVariantsController,
);

productVariantsRoutes.get(
  "/variants/:id",
  getProductVariantByIdController,
);

productVariantsRoutes.post(
  "/:productId/variants",
  requireAuth,
  createProductVariantController,
);

productVariantsRoutes.patch(
  "/variants/:id",
  requireAuth,
  updateProductVariantController,
);

productVariantsRoutes.delete(
  "/variants/:id",
  requireAuth,
  deleteProductVariantController,
);