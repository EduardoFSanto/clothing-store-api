import { Router } from "express";

import { requireAuth } from "../../middleware/require-auth.js";

import {
  createCategoryController,
  getCategoriesController,
  getCategoryByIdController,
} from "./categories.controller.js";

export const categoriesRoutes = Router();

categoriesRoutes.get(
  "/",
  getCategoriesController,
);

categoriesRoutes.get(
  "/:id",
  getCategoryByIdController,
);

categoriesRoutes.post(
  "/",
  requireAuth,
  createCategoryController,
);