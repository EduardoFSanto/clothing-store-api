import type { InferInsertModel } from "drizzle-orm";

import { addresses } from "../../db/schema/index.js";

export type NewAddress =
  InferInsertModel<typeof addresses>;