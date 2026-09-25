import { z } from "zod";

export const createProductImageSchema = z.object({
  imageUrl: z.url("Image URL must be valid"),
  position: z.number().int().min(0).optional(),
});