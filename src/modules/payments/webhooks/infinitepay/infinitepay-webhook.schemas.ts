import { z } from "zod";

export const infinitePayWebhookItemSchema =
  z.object({
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
      .min(1),
  });

export const infinitePayWebhookSchema =
  z.object({
    invoice_slug: z
      .string()
      .trim()
      .min(1),

    amount: z
      .number()
      .int()
      .positive(),

    paid_amount: z
      .number()
      .int()
      .positive(),

    installments: z
      .number()
      .int()
      .positive(),

    capture_method: z.enum([
      "credit_card",
      "pix",
    ]),

    transaction_nsu: z
      .string()
      .trim()
      .min(1),

    order_nsu: z
      .string()
      .trim()
      .min(1),

    receipt_url: z
      .string()
      .url(),

    items: z
      .array(infinitePayWebhookItemSchema),
  });

export type InfinitePayWebhookInput =
  z.infer<
    typeof infinitePayWebhookSchema
  >;