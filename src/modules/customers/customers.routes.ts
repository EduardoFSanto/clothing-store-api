import { Router } from "express";

import {
  createCustomerController,
  findOrCreateCustomerController,
  getCustomerByIdController,
  getCustomersController,
  updateCustomerController,
} from "./customers.controller.js";

export const customersRoutes =
  Router();

customersRoutes.get(
  "/",
  getCustomersController,
);

customersRoutes.get(
  "/:id",
  getCustomerByIdController,
);

customersRoutes.post(
  "/",
  createCustomerController,
);

customersRoutes.post(
  "/find-or-create",
  findOrCreateCustomerController,
);

customersRoutes.patch(
  "/:id",
  updateCustomerController,
);