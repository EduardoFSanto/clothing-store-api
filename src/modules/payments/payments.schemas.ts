import { z } from "zod";

export const createPaymentSchema = z.object({});

export type CreatePaymentInput = z.infer<
  typeof createPaymentSchema
>;