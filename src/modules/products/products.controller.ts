import type { Request, Response } from "express";

import { ProductsRepository } from "./products.repository.js";
import {
  createProductSchema,
  updateProductSchema,
} from "./products.schemas.js";
import { ProductsService } from "./products.service.js";

const productsRepository = new ProductsRepository();

const productsService = new ProductsService(
  productsRepository,
);

export async function getProductsController(
  _req: Request,
  res: Response,
) {
  const products = await productsService.findAll();

  return res.json({
    data: products,
  });
}

export async function getProductByIdController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      error: {
        message: "Invalid product id",
      },
    });
  }

  const product = await productsService.findById(id);

  if (!product) {
    return res.status(404).json({
      error: {
        message: "Product not found",
      },
    });
  }

  return res.json({
    data: product,
  });
}

export async function updateProductController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      error: { message: "Invalid product id" },
    });
  }

  const input = updateProductSchema.parse(req.body);
  const product = await productsService.update(id, input);

  if (!product) {
    return res.status(404).json({
      error: { message: "Product not found" },
    });
  }

  return res.json({ data: product });
}

export async function deactivateProductController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      error: { message: "Invalid product id" },
    });
  }

  const product = await productsService.deactivate(id);

  if (!product) {
    return res.status(404).json({
      error: { message: "Product not found" },
    });
  }

  return res.json({ data: product });
}

export async function createProductController(
  req: Request,
  res: Response,
) {
  const input = createProductSchema.parse(req.body);

  const product = await productsService.create(input);

  return res.status(201).json({
    data: product,
  });
}