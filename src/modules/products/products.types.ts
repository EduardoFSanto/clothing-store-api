import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { products } from "../../db/schema/index.js";

export type Product = InferSelectModel<typeof products>;

export type NewProduct = InferInsertModel<typeof products>;