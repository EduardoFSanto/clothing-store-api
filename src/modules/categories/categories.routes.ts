import { Router } from "express";

import {
  createCategoryController,
  getCategoriesController,
  getCategoryByIdController,
} from "./categories.controller.js";

export const categoriesRoutes = Router();

categoriesRoutes.get("/", getCategoriesController);

categoriesRoutes.get("/:id", getCategoryByIdController);

categoriesRoutes.post("/", createCategoryController);