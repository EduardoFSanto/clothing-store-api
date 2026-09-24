import { z } from "zod";

const shippingAddressSchema = z.object({
  cep: z
    .string()
    .trim()
    .regex(
      /^\d{5}-?\d{3}$/,
      "Invalid CEP",
    ),

  street: z
    .string()
    .trim()
    .min(
      2,
      "Street must have at least 2 characters",
    )
    .max(
      200,
      "Street must have at most 200 characters",
    ),

  number: z
    .string()
    .trim()
    .min(
      1,
      "Number is required",
    )
    .max(
      20,
      "Number must have at most 20 characters",
    ),

  complement: z
    .string()
    .trim()
    .max(
      100,
      "Complement must have at most 100 characters",
    )
    .optional(),

  neighborhood: z
    .string()
    .trim()
    .min(
      2,
      "Neighborhood must have at least 2 characters",
    )
    .max(
      100,
      "Neighborhood must have at most 100 characters",
    ),

  city: z
    .string()
    .trim()
    .min(
      2,
      "City must have at least 2 characters",
    )
    .max(
      100,
      "City must have at most 100 characters",
    ),

  state: z
    .string()
    .trim()
    .toUpperCase()
    .length(
      2,
      "State must have 2 characters",
    ),
});

const orderItemSchema = z.object({
  productVariantId: z.uuid(),

  quantity: z
    .number()
    .int(
      "Quantity must be an integer",
    )
    .positive(
      "Quantity must be greater than zero",
    ),
});

export const createOrderSchema =
  z.object({
    customerId: z.uuid(),

    shippingAddress:
      shippingAddressSchema,

    items: z
      .array(orderItemSchema)
      .min(
        1,
        "Order must have at least one item",
      ),
  });

export type CreateOrderInput =
  z.infer<
    typeof createOrderSchema
  >;