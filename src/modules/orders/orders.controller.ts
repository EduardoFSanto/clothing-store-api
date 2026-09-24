import type { Request, Response } from "express";

import { createOrderSchema } from "./orders.schemas.js";
import { OrdersRepository } from "./orders.repository.js";
import { OrdersService } from "./orders.service.js";

const ordersRepository = new OrdersRepository();

const ordersService = new OrdersService(
  ordersRepository,
);

export async function getOrdersController(
  _req: Request,
  res: Response,
) {
  const orders = await ordersService.findAll();

  return res.json({
    data: orders,
  });
}

export async function getOrderByIdController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid order id",
    });
  }

  const order =
    await ordersService.findById(id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  return res.json({
    data: order,
  });
}

export async function createOrderController(
  req: Request,
  res: Response,
) {
  const input = createOrderSchema.safeParse(
    req.body,
  );

  if (!input.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid order data",
      errors: input.error.flatten(),
    });
  }

  const order =
    await ordersService.create(input.data);

  return res.status(201).json({
    data: order,
  });
}

export async function cancelOrderController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid order id",
    });
  }

  const order =
    await ordersService.cancel(id);

  return res.json({
    data: order,
  });
}