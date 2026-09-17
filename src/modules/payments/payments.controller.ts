import type {
  Request,
  Response,
} from "express";

import {
  PaymentsRepository,
} from "./payments.repository.js";

import {
  createPaymentSchema,
} from "./payments.schemas.js";

import {
  PaymentsService,
} from "./payments.service.js";

const paymentsRepository =
  new PaymentsRepository();

const paymentsService =
  new PaymentsService(
    paymentsRepository,
  );

export async function getPaymentByIdController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      error: {
        message: "Invalid payment id",
      },
    });
  }

  const payment =
    await paymentsService.findById(
      id,
    );

  if (!payment) {
    return res.status(404).json({
      error: {
        message: "Payment not found",
      },
    });
  }

  return res.json({
    data: payment,
  });
}

export async function getOrderPaymentsController(
  req: Request,
  res: Response,
) {
  const { orderId } = req.params;

  if (typeof orderId !== "string") {
    return res.status(400).json({
      error: {
        message: "Invalid order id",
      },
    });
  }

  const payments =
    await paymentsService.findByOrderId(
      orderId,
    );

  return res.json({
    data: payments,
  });
}

export async function createPaymentController(
  req: Request,
  res: Response,
) {
  const { orderId } = req.params;

  if (typeof orderId !== "string") {
    return res.status(400).json({
      error: {
        message: "Invalid order id",
      },
    });
  }

  const input =
    createPaymentSchema.parse(
      req.body,
    );

  const payment =
    await paymentsService.create(
      orderId,
      input,
    );

  return res.status(201).json({
    data: payment,
  });
}