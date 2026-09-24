import { z } from "zod";

export const createProductVariantSchema =
  z.object({
    productId: z.uuid(),

    sku: z
      .string()
      .trim()
      .min(
        1,
        "SKU is required",
      )
      .max(
        50,
        "SKU must have at most 50 characters",
      ),

    size: z
      .string()
      .trim()
      .min(
        1,
        "Size is required",
      )
      .max(
        20,
        "Size must have at most 20 characters",
      ),

    color: z
      .string()
      .trim()
      .min(
        1,
        "Color is required",
      )
      .max(
        50,
        "Color must have at most 50 characters",
      ),

    priceInCents: z
      .number()
      .int(
        "Price must be an integer",
      )
      .positive(
        "Price must be greater than zero",
      ),

    stock: z
      .number()
      .int(
        "Stock must be an integer",
      )
      .min(
        0,
        "Stock cannot be negative",
      ),

    weightInGrams: z
      .number()
      .int(
        "Weight must be an integer",
      )
      .positive(
        "Weight must be greater than zero",
      ),

    lengthInCentimeters: z
      .number()
      .int(
        "Length must be an integer",
      )
      .positive(
        "Length must be greater than zero",
      ),

    heightInCentimeters: z
      .number()
      .int(
        "Height must be an integer",
      )
      .positive(
        "Height must be greater than zero",
      ),

    widthInCentimeters: z
      .number()
      .int(
        "Width must be an integer",
      )
      .positive(
        "Width must be greater than zero",
      ),
  });

export type CreateProductVariantInput =
  z.infer<
    typeof createProductVariantSchema
  >;

export const updateProductVariantSchema =
  createProductVariantSchema
    .omit({
      productId: true,
    })
    .partial()
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          "At least one field must be provided",
      },
    );

export type UpdateProductVariantInput =
  z.infer<
    typeof updateProductVariantSchema
  >;