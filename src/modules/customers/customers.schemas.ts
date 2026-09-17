import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Customer name must have at least 2 characters")
    .max(150, "Customer name must have at most 150 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email")
    .max(255, "Email must have at most 255 characters"),

  phone: z
    .string()
    .trim()
    .max(30, "Phone must have at most 30 characters")
    .optional(),
});

export type CreateCustomerInput =
  z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Customer name must have at least 2 characters")
      .max(150, "Customer name must have at most 150 characters")
      .optional(),

    email: z
      .string()
      .trim()
      .email("Invalid email")
      .max(255, "Email must have at most 255 characters")
      .optional(),

    phone: z
      .string()
      .trim()
      .max(30, "Phone must have at most 30 characters")
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided",
    },
  );

export type UpdateCustomerInput =
  z.infer<typeof updateCustomerSchema>;