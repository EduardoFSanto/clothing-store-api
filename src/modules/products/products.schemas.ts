import { z } from "zod";

export const createProductSchema = z.object({
  categoryId: z.uuid(),

  name: z
    .string()
    .trim()
    .min(2, "Product name must have at least 2 characters")
    .max(150, "Product name must have at most 150 characters"),

  slug: z
    .string()
    .trim()
    .min(2, "Slug must have at least 2 characters")
    .max(180, "Slug must have at most 180 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers and hyphens",
    ),

  description: z
    .string()
    .trim()
    .max(1000, "Description must have at most 1000 characters")
    .optional(),

  active: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;