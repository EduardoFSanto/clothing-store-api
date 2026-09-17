import type { Request, Response } from "express";

import { CategoriesRepository } from "./categories.repository.js";
import { createCategorySchema } from "./categories.schemas.js";
import { CategoriesService } from "./categories.service.js";

const categoriesRepository = new CategoriesRepository();

const categoriesService = new CategoriesService(
  categoriesRepository,
);

export async function getCategoriesController(
  _req: Request,
  res: Response,
) {
  const categories = await categoriesService.findAll();

  return res.json({
    data: categories,
  });
}

export async function getCategoryByIdController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      error: {
        message: "Invalid category id",
      },
    });
  }

  const category = await categoriesService.findById(id);

  if (!category) {
    return res.status(404).json({
      error: {
        message: "Category not found",
      },
    });
  }

  return res.json({
    data: category,
  });
}

export async function createCategoryController(
  req: Request,
  res: Response,
) {
  const input = createCategorySchema.parse(req.body);

  const category = await categoriesService.create(input);

  return res.status(201).json({
    data: category,
  });
}