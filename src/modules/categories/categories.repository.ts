import { eq } from "drizzle-orm";

import { db } from "../../db/client.js";
import { categories } from "../../db/schema/index.js";

import type { NewCategory } from "./categories.types.js";

export class CategoriesRepository {
  async findAll() {
    return db
      .select()
      .from(categories);
  }

  async findById(id: string) {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    return category ?? null;
  }

  async findBySlug(slug: string) {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    return category ?? null;
  }

  async create(data: NewCategory) {
    const [category] = await db
      .insert(categories)
      .values(data)
      .returning();

    return category;
  }
}