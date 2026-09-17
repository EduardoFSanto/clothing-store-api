import { Router } from "express";

import {
  createProductVariantController,
  deleteProductVariantController,
  getProductVariantByIdController,
  getProductVariantsController,
  updateProductVariantController,
} from "./product-variants.controller.js";

export const productVariantsRoutes =
  Router();

productVariantsRoutes.get(
  "/:productId/variants",
  getProductVariantsController,
);

productVariantsRoutes.get(
  "/:productId/variants/:id",
  getProductVariantByIdController,
);

productVariantsRoutes.post(
  "/:productId/variants",
  createProductVariantController,
);

productVariantsRoutes.patch(
  "/:productId/variants/:id",
  updateProductVariantController,
);

productVariantsRoutes.delete(
  "/:productId/variants/:id",
  deleteProductVariantController,
);