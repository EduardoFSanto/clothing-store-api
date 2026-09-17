import { z } from "zod";

export const createOrderSchema = z.object({
  customerId: z.uuid(),

  items: z
    .array(
      z.object({
        productVariantId: z.uuid(),

        quantity: z
          .number()
          .int("Quantity must be an integer")
          .positive("Quantity must be greater than zero"),
      }),
    )
    .min(1, "Order must have at least one item"),

  shippingInCents: z
    .number()
    .int("Shipping must be an integer")
    .min(0, "Shipping cannot be negative")
    .default(0),
});

export type CreateOrderInput = z.infer<
  typeof createOrderSchema
>;