import { Router } from "express";

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
  getCustomerAddressesController,
);

addressesRoutes.get(
  "/:id",
  getAddressByIdController,
);

addressesRoutes.post(
  "/",
  createAddressController,
);

addressesRoutes.patch(
  "/:id",
  updateAddressController,
);

addressesRoutes.delete(
  "/:id",
  deleteAddressController,
);