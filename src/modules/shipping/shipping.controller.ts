import type {
  Request,
  Response,
} from "express";

import { TableShippingClient } from "./providers/table/table.client.js";
import { ViaCepClient } from "./providers/viacep/viacep.client.js";

import {
  lookupCepSchema,
  shippingQuoteSchema,
} from "./shipping.schemas.js";

import { ShippingRepository } from "./shipping.repository.js";

import { ShippingService } from "./shipping.service.js";

const viaCepClient =
  new ViaCepClient();

const tableShippingClient =
  new TableShippingClient();

const shippingRepository =
  new ShippingRepository();

const shippingService =
  new ShippingService(
    viaCepClient,
    tableShippingClient,
    shippingRepository,
  );

export async function lookupCepController(
  req: Request,
  res: Response,
) {
  const input =
    lookupCepSchema.parse(
      req.query,
    );

  const address =
    await shippingService
      .findAddressByCep(
        input.cep,
      );

  if (!address) {
    return res.status(404).json({
      error: {
        message:
          "CEP not found",
      },
    });
  }

  return res.json({
    data: address,
  });
}

export async function calculateShippingController(
  req: Request,
  res: Response,
) {
  const input =
    shippingQuoteSchema.parse(
      req.body,
    );

  const quote =
    await shippingService
      .calculateQuote(
        input,
      );

  return res.json({
    data: quote,
  });
}