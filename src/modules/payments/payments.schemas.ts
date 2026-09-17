import { z } from "zod";

export const createPaymentSchema =
  z.object({
    method: z.enum([
      "pix",
      "credit_card",
      "debit_card",
      "boleto",
    ]),
  });

export type CreatePaymentInput =
  z.infer<
    typeof createPaymentSchema
  >;