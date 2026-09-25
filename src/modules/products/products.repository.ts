import { eq } from "drizzle-orm";

import { db } from "../../db/client.js";
import {
  categories,
  products,
} from "../../db/schema/index.js";

import type { NewProduct } from "./products.types.js";

export class ProductsRepository {
  async findAll() {
    return db
      .select({
        id: products.id,
        categoryId: products.categoryId,
        name: products.name,
        slug: products.slug,
        description: products.description,
        imageUrl: products.imageUrl,
        active: products.active,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          active: categories.active,
        },
      })
      .from(products)
      .innerJoin(
        categories,
        eq(
          products.categoryId,
          categories.id,
        ),
      );
  }

  async findById(id: string) {
    const [product] = await db
      .select({
        id: products.id,
        categoryId: products.categoryId,
        name: products.name,
        slug: products.slug,
        description: products.description,
        imageUrl: products.imageUrl,
        active: products.active,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          active: categories.active,
        },
      })
      .from(products)
      .innerJoin(
        categories,
        eq(
          products.categoryId,
          categories.id,
        ),
      )
      .where(eq(products.id, id))
      .limit(1);

    return product ?? null;
  }

  async findBySlug(slug: string) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    return product ?? null;
  }

  async create(data: NewProduct) {
    const [product] = await db
      .insert(products)
      .values(data)
      .returning();

    return product;
  }

  async update(id: string, data: Partial<NewProduct>) {
    const [product] = await db
      .update(products)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    return product ?? null;
  }
}