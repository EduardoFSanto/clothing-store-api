import type {
  Request,
  Response,
} from "express";

import {
  StockRepository,
} from "./stock.repository.js";

import {
  createStockMovementSchema,
} from "./stock.schemas.js";

import {
  StockService,
} from "./stock.service.js";

const stockRepository =
  new StockRepository();

const stockService =
  new StockService(
    stockRepository,
  );

export async function getStockMovementsController(
  req: Request,
  res: Response,
) {
  const { variantId } = req.params;

  if (typeof variantId !== "string") {
    return res.status(400).json({
      error: {
        message:
          "Invalid product variant id",
      },
    });
  }

  const movements =
    await stockService.findMovementsByVariantId(
      variantId,
    );

  return res.json({
    data: movements,
  });
}

export async function createStockMovementController(
  req: Request,
  res: Response,
) {
  const { variantId } = req.params;

  if (typeof variantId !== "string") {
    return res.status(400).json({
      error: {
        message:
          "Invalid product variant id",
      },
    });
  }

  const input =
    createStockMovementSchema.parse(
      req.body,
    );

  const result =
    await stockService.createMovement(
      variantId,
      input,
    );

  return res.status(201).json({
    data: result,
  });
}