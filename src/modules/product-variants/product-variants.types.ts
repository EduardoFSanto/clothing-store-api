import type { InferInsertModel } from "drizzle-orm";

import { productVariants } from "../../db/schema/index.js";

export type NewProductVariant =
  InferInsertModel<typeof productVariants>;