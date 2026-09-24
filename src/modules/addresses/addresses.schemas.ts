import { z } from "zod";

export const createAddressSchema = z.object({
  customerId: z.uuid(),

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
    .min(1, "Number is required")
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

export type CreateAddressInput =
  z.infer<typeof createAddressSchema>;

export const updateAddressSchema =
  createAddressSchema
    .omit({
      customerId: true,
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

export type UpdateAddressInput =
  z.infer<typeof updateAddressSchema>;