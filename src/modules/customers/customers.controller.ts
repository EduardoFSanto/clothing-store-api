import type { Request, Response } from "express";

import { CustomersRepository } from "./customers.repository.js";

import {
  createCustomerSchema,
  updateCustomerSchema,
} from "./customers.schemas.js";

import { CustomersService } from "./customers.service.js";

const customersRepository =
  new CustomersRepository();

const customersService =
  new CustomersService(
    customersRepository,
  );

export async function getCustomersController(
  _req: Request,
  res: Response,
) {
  const customers =
    await customersService.findAll();

  return res.json({
    data: customers,
  });
}

export async function getCustomerByIdController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      error: {
        message: "Invalid customer id",
      },
    });
  }

  const customer =
    await customersService.findById(id);

  if (!customer) {
    return res.status(404).json({
      error: {
        message: "Customer not found",
      },
    });
  }

  return res.json({
    data: customer,
  });
}

export async function createCustomerController(
  req: Request,
  res: Response,
) {
  const input =
    createCustomerSchema.parse(req.body);

  const customer =
    await customersService.create(input);

  return res.status(201).json({
    data: customer,
  });
}

export async function findOrCreateCustomerController(
  req: Request,
  res: Response,
) {
  const input =
    createCustomerSchema.parse(req.body);

  const customer =
    await customersService.findOrCreate(
      input,
    );

  return res.status(200).json({
    data: customer,
  });
}

export async function updateCustomerController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      error: {
        message: "Invalid customer id",
      },
    });
  }

  const input =
    updateCustomerSchema.parse(req.body);

  const customer =
    await customersService.update(
      id,
      input,
    );

  if (!customer) {
    return res.status(404).json({
      error: {
        message: "Customer not found",
      },
    });
  }

  return res.json({
    data: customer,
  });
}