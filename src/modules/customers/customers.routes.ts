import { Router } from "express";

import { customerRateLimiter } from "../../middleware/rate-limit.js";
import { requireAuth } from "../../middleware/require-auth.js";
import { requireAdmin } from "../../middleware/require-admin.js";

import {
  createCustomerController,
  findOrCreateCustomerController,
  getCustomerByIdController,
  getCustomersController,
  updateCustomerController,
} from "./customers.controller.js";

export const customersRoutes = Router();

customersRoutes.get("/", requireAuth, requireAdmin, getCustomersController);
customersRoutes.get("/:id", requireAuth, requireAdmin, getCustomerByIdController);
customersRoutes.post("/", createCustomerController);
customersRoutes.post("/find-or-create", customerRateLimiter, findOrCreateCustomerController);
customersRoutes.patch("/:id", requireAuth, requireAdmin, updateCustomerController);
