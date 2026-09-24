import { eq, inArray } from "drizzle-orm";

import { db } from "../../db/client.js";

import {
  productVariants,
  products,
} from "../../db/schema/index.js";

export class ShippingRepository {
  async findVariantsByIds(
    variantIds: string[],
  ) {
    if (variantIds.length === 0) {
      return [];
    }

    return db
      .select({
        id: productVariants.id,

        productId:
          productVariants.productId,

        productName:
          products.name,

        weightInGrams:
          productVariants.weightInGrams,

        lengthInCentimeters:
          productVariants.lengthInCentimeters,

        heightInCentimeters:
          productVariants.heightInCentimeters,

        widthInCentimeters:
          productVariants.widthInCentimeters,

        active:
          productVariants.active,

        productActive:
          products.active,
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
        inArray(
          productVariants.id,
          variantIds,
        ),
      );
  }
}