import {
  and,
  eq,
  gte,
  sql,
} from "drizzle-orm";

import { db } from "../../db/client.js";

import {
  customers,
  orderItems,
  orders,
  productVariants,
  products,
} from "../../db/schema/index.js";

export class OrdersRepository {
  async findCustomerById(customerId: string) {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);

    return customer ?? null;
  }

  async findVariantById(variantId: string) {
    const [variant] = await db
      .select({
        id: productVariants.id,
        productId: productVariants.productId,
        sku: productVariants.sku,
        size: productVariants.size,
        color: productVariants.color,
        priceInCents: productVariants.priceInCents,
        stock: productVariants.stock,
        active: productVariants.active,
        productName: products.name,
        productActive: products.active,
      })
      .from(productVariants)
      .innerJoin(
        products,
        eq(productVariants.productId, products.id),
      )
      .where(eq(productVariants.id, variantId))
      .limit(1);

    return variant ?? null;
  }

  async createOrder(data: {
    customerId: string;
    subtotalInCents: number;
    shippingInCents: number;
    totalInCents: number;

    items: Array<{
      productVariantId: string;
      productName: string;
      sku: string;
      size: string;
      color: string;
      unitPriceInCents: number;
      quantity: number;
      totalInCents: number;
    }>;
  }) {
    return db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          customerId: data.customerId,
          status: "pending",
          subtotalInCents: data.subtotalInCents,
          shippingInCents: data.shippingInCents,
          totalInCents: data.totalInCents,
        })
        .returning();

      if (!order) {
        throw new Error(
          "Failed to create order",
        );
      }

      for (const item of data.items) {
        const [updatedVariant] = await tx
          .update(productVariants)
          .set({
            stock: sql`${productVariants.stock} - ${item.quantity}`,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(
                productVariants.id,
                item.productVariantId,
              ),
              gte(
                productVariants.stock,
                item.quantity,
              ),
            ),
          )
          .returning({
            id: productVariants.id,
            stock: productVariants.stock,
          });

        if (!updatedVariant) {
          throw new Error(
            `Insufficient stock for SKU ${item.sku}`,
          );
        }

        await tx
          .insert(orderItems)
          .values({
            orderId: order.id,
            productVariantId:
              item.productVariantId,
            productName: item.productName,
            sku: item.sku,
            size: item.size,
            color: item.color,
            unitPriceInCents:
              item.unitPriceInCents,
            quantity: item.quantity,
            totalInCents: item.totalInCents,
          });
      }

      return order;
    });
  }

  async findAll() {
    return db
      .select()
      .from(orders);
  }

  async findById(id: string) {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    return order ?? null;
  }

  async findItemsByOrderId(orderId: string) {
    return db
      .select()
      .from(orderItems)
      .where(
        eq(orderItems.orderId, orderId),
      );
  }
}