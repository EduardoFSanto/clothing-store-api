import {
  and,
  eq,
} from "drizzle-orm";

import { db } from "../../db/client.js";

import {
  productVariants,
  products,
} from "../../db/schema/index.js";

import type {
  NewProductVariant,
} from "./product-variants.types.js";

export class ProductVariantsRepository {
  async findAllByProductId(
    productId: string,
  ) {
    return db
      .select()
      .from(productVariants)
      .where(
        eq(
          productVariants.productId,
          productId,
        ),
      );
  }

  async findById(
    id: string,
  ) {
    const [variant] =
      await db
        .select()
        .from(productVariants)
        .where(
          eq(
            productVariants.id,
            id,
          ),
        )
        .limit(1);

    return variant ?? null;
  }

  async findBySku(
    sku: string,
  ) {
    const [variant] =
      await db
        .select()
        .from(productVariants)
        .where(
          eq(
            productVariants.sku,
            sku,
          ),
        )
        .limit(1);

    return variant ?? null;
  }

  async findProductById(
    productId: string,
  ) {
    const [product] =
      await db
        .select({
          id: products.id,
          active: products.active,
        })
        .from(products)
        .where(
          eq(
            products.id,
            productId,
          ),
        )
        .limit(1);

    return product ?? null;
  }

  async create(
    data: NewProductVariant,
  ) {
    const [variant] =
      await db
        .insert(productVariants)
        .values(data)
        .returning();

    return variant ?? null;
  }

  async update(
    id: string,
    data: Partial<NewProductVariant>,
  ) {
    const [variant] =
      await db
        .update(productVariants)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(
          eq(
            productVariants.id,
            id,
          ),
        )
        .returning();

    return variant ?? null;
  }

  async delete(
    id: string,
  ) {
    const [variant] =
      await db
        .delete(productVariants)
        .where(
          eq(
            productVariants.id,
            id,
          ),
        )
        .returning();

    return variant ?? null;
  }

  async findActiveByProductId(
    productId: string,
  ) {
    return db
      .select()
      .from(productVariants)
      .where(
        and(
          eq(
            productVariants.productId,
            productId,
          ),
          eq(
            productVariants.active,
            true,
          ),
        ),
      );
  }
}