import { Router } from "express";

import { requireAuth } from "../../middleware/require-auth.js";

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
  requireAuth,
  getCustomersController,
);

customersRoutes.get(
  "/:id",
  requireAuth,
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
  requireAuth,
  updateCustomerController,
);
