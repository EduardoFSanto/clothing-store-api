import type {
  Request,
  Response,
} from "express";

import {
  AddressesRepository,
} from "./addresses.repository.js";

import {
  createAddressSchema,
  updateAddressSchema,
} from "./addresses.schemas.js";

import {
  AddressesService,
} from "./addresses.service.js";

const addressesRepository =
  new AddressesRepository();

const addressesService =
  new AddressesService(
    addressesRepository,
  );

export async function getCustomerAddressesController(
  req: Request,
  res: Response,
) {
  const { customerId } = req.params;

  if (
    typeof customerId !== "string"
  ) {
    return res.status(400).json({
      error: {
        message:
          "Invalid customer id",
      },
    });
  }

  const addresses =
    await addressesService.findAllByCustomerId(
      customerId,
    );

  return res.json({
    data: addresses,
  });
}

export async function getAddressByIdController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      error: {
        message:
          "Invalid address id",
      },
    });
  }

  const address =
    await addressesService.findById(id);

  if (!address) {
    return res.status(404).json({
      error: {
        message: "Address not found",
      },
    });
  }

  return res.json({
    data: address,
  });
}

export async function createAddressController(
  req: Request,
  res: Response,
) {
  const input =
    createAddressSchema.parse(
      req.body,
    );

  const address =
    await addressesService.create(
      input,
    );

  return res.status(201).json({
    data: address,
  });
}

export async function updateAddressController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      error: {
        message:
          "Invalid address id",
      },
    });
  }

  const input =
    updateAddressSchema.parse(
      req.body,
    );

  const address =
    await addressesService.update(
      id,
      input,
    );

  if (!address) {
    return res.status(404).json({
      error: {
        message: "Address not found",
      },
    });
  }

  return res.json({
    data: address,
  });
}

export async function deleteAddressController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      error: {
        message:
          "Invalid address id",
      },
    });
  }

  const address =
    await addressesService.delete(id);

  if (!address) {
    return res.status(404).json({
      error: {
        message: "Address not found",
      },
    });
  }

  return res.status(204).send();
}