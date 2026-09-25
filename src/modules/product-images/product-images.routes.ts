import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth.js";
import { createProductImageController, deleteProductImageController, listProductImagesController } from "./product-images.controller.js";

export const productImagesRoutes = Router();
productImagesRoutes.get("/:id/images", listProductImagesController);
productImagesRoutes.post("/:id/images", requireAuth, createProductImageController);
productImagesRoutes.delete("/:id/images/:imageId", requireAuth, deleteProductImageController);