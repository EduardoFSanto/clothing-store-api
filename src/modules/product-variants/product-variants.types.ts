import type {
  InferInsertModel,
  InferSelectModel,
} from "drizzle-orm";

import { productVariants } from "../../db/schema/index.js";

export type ProductVariant =
  InferSelectModel<typeof productVariants>;

export type NewProductVariant =
  InferInsertModel<typeof productVariants>;