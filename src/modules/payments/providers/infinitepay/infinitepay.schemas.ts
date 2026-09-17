import { z } from "zod";

export const infinitePayItemSchema = z.object({
  quantity: z
    .number()
    .int()
    .positive(),

  price: z
    .number()
    .int()
    .positive(),

  description: z
    .string()
    .trim()
    .min(1)
    .max(255),
});

export const infinitePayCustomerSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(150),

    email: z
      .string()
      .trim()
      .email()
      .max(255),

    phone_number: z
      .string()
      .trim()
      .max(30)
      .optional(),
  });

export const createInfinitePayCheckoutSchema =
  z.object({
    handle: z
      .string()
      .trim()
      .min(1),

    items: z
      .array(infinitePayItemSchema)
      .min(1),

    order_nsu: z
      .string()
      .trim()
      .min(1)
      .max(150),

    redirect_url: z
      .string()
      .url()
      .optional(),

    webhook_url: z
      .string()
      .url()
      .optional(),

    customer:
      infinitePayCustomerSchema.optional(),
  });

export const infinitePayCheckoutResponseSchema =
  z.object({
    url: z
      .string()
      .url(),
  });

export type CreateInfinitePayCheckoutInput =
  z.infer<
    typeof createInfinitePayCheckoutSchema
  >;