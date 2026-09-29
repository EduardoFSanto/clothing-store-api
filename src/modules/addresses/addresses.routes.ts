import { Router } from "express";

import { requireAuth } from "../../middleware/require-auth.js";
import { requireAdmin } from "../../middleware/require-admin.js";

import {
  createAddressController,
  deleteAddressController,
  getAddressByIdController,
  getCustomerAddressesController,
  updateAddressController,
} from "./addresses.controller.js";

export const addressesRoutes = Router();

addressesRoutes.get("/customer/:customerId", requireAuth, requireAdmin, getCustomerAddressesController);
addressesRoutes.get("/:id", requireAuth, requireAdmin, getAddressByIdController);
addressesRoutes.post("/", requireAuth, requireAdmin, createAddressController);
addressesRoutes.patch("/:id", requireAuth, requireAdmin, updateAddressController);
addressesRoutes.delete("/:id", requireAuth, requireAdmin, deleteAddressController);
