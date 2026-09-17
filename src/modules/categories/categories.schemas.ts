import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must have at least 2 characters")
    .max(100, "Category name must have at most 100 characters"),

  slug: z
    .string()
    .trim()
    .min(2, "Slug must have at least 2 characters")
    .max(120, "Slug must have at most 120 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers and hyphens",
    ),

  active: z.boolean().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;