import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import {
  orderItems,
  orders,
} from "../../db/schema/index.js";

export type Order = InferSelectModel<typeof orders>;

export type NewOrder = InferInsertModel<typeof orders>;

export type OrderItem = InferSelectModel<typeof orderItems>;

export type NewOrderItem = InferInsertModel<typeof orderItems>;