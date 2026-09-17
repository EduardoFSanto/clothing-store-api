import type {
  Request,
  Response,
} from "express";

import { OrdersRepository } from "./orders.repository.js";

import {
  createOrderSchema,
} from "./orders.schemas.js";

import {
  OrdersService,
} from "./orders.service.js";

const ordersRepository =
  new OrdersRepository();

const ordersService =
  new OrdersService(
    ordersRepository,
  );

export async function getOrdersController(
  _req: Request,
  res: Response,
) {
  const orders =
    await ordersService.findAll();

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
      error: {
        message: "Invalid order id",
      },
    });
  }

  const order =
    await ordersService.findById(id);

  if (!order) {
    return res.status(404).json({
      error: {
        message: "Order not found",
      },
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
  const input =
    createOrderSchema.parse(
      req.body,
    );

  const order =
    await ordersService.create(
      input,
    );

  return res.status(201).json({
    data: order,
  });
}