import type {
  InferInsertModel,
  InferSelectModel,
} from "drizzle-orm";

import { customers } from "../../db/schema/index.js";

export type Customer =
  InferSelectModel<typeof customers>;

export type NewCustomer =
  InferInsertModel<typeof customers>;