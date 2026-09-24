import { z } from "zod";

const shippingItemSchema =
  z.object({
    productVariantId: z.uuid(),

    quantity: z
      .number()
      .int()
      .positive(),
  });

export const lookupCepSchema =
  z.object({
    cep: z
      .string()
      .trim()
      .regex(
        /^\d{5}-?\d{3}$/,
        "Invalid CEP",
      ),
  });

export type LookupCepInput =
  z.infer<
    typeof lookupCepSchema
  >;

export const shippingQuoteSchema =
  z.object({
    destinationCep: z
      .string()
      .trim()
      .regex(
        /^\d{5}-?\d{3}$/,
        "Invalid destination CEP",
      ),

    items: z
      .array(shippingItemSchema)
      .min(
        1,
        "At least one item is required",
      ),
  });

export type ShippingQuoteInput =
  z.infer<
    typeof shippingQuoteSchema
  >;