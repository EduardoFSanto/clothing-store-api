import { z } from "zod";

export const createProductVariantSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(2, "SKU must have at least 2 characters")
    .max(50, "SKU must have at most 50 characters"),

  size: z
    .string()
    .trim()
    .min(1, "Size is required")
    .max(20, "Size must have at most 20 characters"),

  color: z
    .string()
    .trim()
    .min(1, "Color is required")
    .max(50, "Color must have at most 50 characters"),

  priceInCents: z
    .number()
    .int("Price must be an integer")
    .positive("Price must be greater than zero"),

  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),

  active: z.boolean().optional(),
});

export type CreateProductVariantInput =
  z.infer<typeof createProductVariantSchema>;

export const updateProductVariantSchema = z
  .object({
    sku: z
      .string()
      .trim()
      .min(2, "SKU must have at least 2 characters")
      .max(50, "SKU must have at most 50 characters")
      .optional(),

    size: z
      .string()
      .trim()
      .min(1, "Size is required")
      .max(20, "Size must have at most 20 characters")
      .optional(),

    color: z
      .string()
      .trim()
      .min(1, "Color is required")
      .max(50, "Color must have at most 50 characters")
      .optional(),

    priceInCents: z
      .number()
      .int("Price must be an integer")
      .positive("Price must be greater than zero")
      .optional(),

    stock: z
      .number()
      .int("Stock must be an integer")
      .min(0, "Stock cannot be negative")
      .optional(),

    active: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided",
    },
  );

export type UpdateProductVariantInput =
  z.infer<typeof updateProductVariantSchema>;