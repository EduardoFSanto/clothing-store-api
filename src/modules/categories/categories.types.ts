import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { categories } from "../../db/schema/index.js";

export type Category = InferSelectModel<typeof categories>;

export type NewCategory = InferInsertModel<typeof categories>;