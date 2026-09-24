import type {
  Request,
  Response,
} from "express";

import {
  createProductVariantSchema,
  updateProductVariantSchema,
} from "./product-variants.schemas.js";

import {
  ProductVariantsRepository,
} from "./product-variants.repository.js";

import {
  ProductVariantsService,
} from "./product-variants.service.js";

const productVariantsRepository =
  new ProductVariantsRepository();

const productVariantsService =
  new ProductVariantsService(
    productVariantsRepository,
  );

export async function getProductVariantsController(
  req: Request,
  res: Response,
) {
  const { productId } =
    req.params;

  if (
    typeof productId !==
    "string"
  ) {
    return res.status(400).json({
      error: {
        message:
          "Invalid product id",
      },
    });
  }

  const variants =
    await productVariantsService
      .findAllByProductId(
        productId,
      );

  return res.json({
    data: variants,
  });
}

export async function getProductVariantByIdController(
  req: Request,
  res: Response,
) {
  const { id } =
    req.params;

  if (
    typeof id !==
    "string"
  ) {
    return res.status(400).json({
      error: {
        message:
          "Invalid product variant id",
      },
    });
  }

  const variant =
    await productVariantsService
      .findById(id);

  if (!variant) {
    return res.status(404).json({
      error: {
        message:
          "Product variant not found",
      },
    });
  }

  return res.json({
    data: variant,
  });
}

export async function createProductVariantController(
  req: Request,
  res: Response,
) {
  const input =
    createProductVariantSchema.parse(
      req.body,
    );

  const variant =
    await productVariantsService
      .create(input);

  return res.status(201).json({
    data: variant,
  });
}

export async function updateProductVariantController(
  req: Request,
  res: Response,
) {
  const { id } =
    req.params;

  if (
    typeof id !==
    "string"
  ) {
    return res.status(400).json({
      error: {
        message:
          "Invalid product variant id",
      },
    });
  }

  const input =
    updateProductVariantSchema.parse(
      req.body,
    );

  const variant =
    await productVariantsService
      .update(
        id,
        input,
      );

  if (!variant) {
    return res.status(404).json({
      error: {
        message:
          "Product variant not found",
      },
    });
  }

  return res.json({
    data: variant,
  });
}

export async function deleteProductVariantController(
  req: Request,
  res: Response,
) {
  const { id } =
    req.params;

  if (
    typeof id !==
    "string"
  ) {
    return res.status(400).json({
      error: {
        message:
          "Invalid product variant id",
      },
    });
  }

  const variant =
    await productVariantsService
      .delete(id);

  if (!variant) {
    return res.status(404).json({
      error: {
        message:
          "Product variant not found",
      },
    });
  }

  return res.status(204).send();
}