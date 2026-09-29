import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth.js";
import { requireAdmin } from "../../middleware/require-admin.js";

import {
  createProductImageController,
  deleteProductImageController,
  listProductImagesController,
} from "./product-images.controller.js";

export const productImagesRoutes = Router();

productImagesRoutes.get("/:id/images", listProductImagesController);
productImagesRoutes.post("/:id/images", requireAuth, requireAdmin, createProductImageController);
productImagesRoutes.delete("/:id/images/:imageId", requireAuth, requireAdmin, deleteProductImageController);
