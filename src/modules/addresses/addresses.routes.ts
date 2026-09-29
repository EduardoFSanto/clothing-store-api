import { Router } from "express";

import { requireAuth } from "../../middleware/require-auth.js";

import {
  createAddressController,
  deleteAddressController,
  getAddressByIdController,
  getCustomerAddressesController,
  updateAddressController,
} from "./addresses.controller.js";

export const addressesRoutes =
  Router();

addressesRoutes.get(
  "/customer/:customerId",
  requireAuth,
  getCustomerAddressesController,
);

addressesRoutes.get(
  "/:id",
  requireAuth,
  getAddressByIdController,
);

addressesRoutes.post(
  "/",
  requireAuth,
  createAddressController,
);

addressesRoutes.patch(
  "/:id",
  requireAuth,
  updateAddressController,
);

addressesRoutes.delete(
  "/:id",
  requireAuth,
  deleteAddressController,
);
