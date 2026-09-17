import type {
  InferInsertModel,
  InferSelectModel,
} from "drizzle-orm";

import {
  payments,
} from "../../db/schema/index.js";

export type Payment =
  InferSelectModel<typeof payments>;

export type NewPayment =
  InferInsertModel<typeof payments>;