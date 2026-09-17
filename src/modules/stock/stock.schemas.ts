import { z } from "zod";

export const createStockMovementSchema =
  z.object({
    type: z.enum(["entry", "exit"]),

    quantity: z
      .number()
      .int("Quantity must be an integer")
      .positive(
        "Quantity must be greater than zero",
      ),

    reason: z
      .string()
      .trim()
      .min(
        2,
        "Reason must have at least 2 characters",
      )
      .max(
        255,
        "Reason must have at most 255 characters",
      ),
  });

export type CreateStockMovementInput =
  z.infer<
    typeof createStockMovementSchema
  >;