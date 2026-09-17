import type {
  InferInsertModel,
  InferSelectModel,
} from "drizzle-orm";

import {
  stockMovements,
} from "../../db/schema/index.js";

export type StockMovement =
  InferSelectModel<typeof stockMovements>;

export type NewStockMovement =
  InferInsertModel<typeof stockMovements>;