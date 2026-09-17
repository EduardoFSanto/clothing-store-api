import { Router } from "express";

import {
  createCustomerController,
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

customersRoutes.patch(
  "/:id",
  updateCustomerController,
);