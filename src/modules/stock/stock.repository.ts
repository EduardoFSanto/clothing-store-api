import {
  and,
  eq,
  gte,
  sql,
} from "drizzle-orm";

import { db } from "../../db/client.js";

import {
  productVariants,
  products,
  stockMovements,
} from "../../db/schema/index.js";

export class StockRepository {
  async findVariantById(
    productVariantId: string,
  ) {
    const [variant] = await db
      .select({
        id: productVariants.id,
        productId:
          productVariants.productId,
        sku: productVariants.sku,
        size: productVariants.size,
        color: productVariants.color,
        stock: productVariants.stock,
        active: productVariants.active,
        productName: products.name,
        productActive: products.active,
      })
      .from(productVariants)
      .innerJoin(
        products,
        eq(
          productVariants.productId,
          products.id,
        ),
      )
      .where(
        eq(
          productVariants.id,
          productVariantId,
        ),
      )
      .limit(1);

    return variant ?? null;
  }

  async createMovement(data: {
    productVariantId: string;
    type: "entry" | "exit";
    quantity: number;
    reason: string;
  }) {
    return db.transaction(async (tx) => {
      let updatedVariant;

      if (data.type === "entry") {
        [updatedVariant] = await tx
          .update(productVariants)
          .set({
            stock: sql`${productVariants.stock} + ${data.quantity}`,
            updatedAt: new Date(),
          })
          .where(
            eq(
              productVariants.id,
              data.productVariantId,
            ),
          )
          .returning({
            id: productVariants.id,
            stock: productVariants.stock,
          });
      } else {
        [updatedVariant] = await tx
          .update(productVariants)
          .set({
            stock: sql`${productVariants.stock} - ${data.quantity}`,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(
                productVariants.id,
                data.productVariantId,
              ),
              gte(
                productVariants.stock,
                data.quantity,
              ),
            ),
          )
          .returning({
            id: productVariants.id,
            stock: productVariants.stock,
          });
      }

      if (!updatedVariant) {
        throw new Error(
          "Insufficient stock",
        );
      }

      const [movement] = await tx
        .insert(stockMovements)
        .values({
          productVariantId:
            data.productVariantId,
          type: data.type,
          quantity: data.quantity,
          reason: data.reason,
        })
        .returning();

      if (!movement) {
        throw new Error(
          "Failed to create stock movement",
        );
      }

      return {
        movement,
        stock: updatedVariant.stock,
      };
    });
  }

  async findMovementsByVariantId(
    productVariantId: string,
  ) {
    return db
      .select()
      .from(stockMovements)
      .where(
        eq(
          stockMovements.productVariantId,
          productVariantId,
        ),
      );
  }
}