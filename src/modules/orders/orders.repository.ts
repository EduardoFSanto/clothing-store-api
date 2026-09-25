import { and, eq, gte, sql } from "drizzle-orm";

import { db } from "../../db/client.js";
import {
  customers,
  orderItems,
  orders,
  payments,
  productVariants,
  products,
  stockMovements,
} from "../../db/schema/index.js";

import type { NewOrderItem } from "./orders.types.js";

export class OrdersRepository {
  async findAll() {
    return db
      .select({
        id: orders.id,
        status: orders.status,
        subtotalInCents: orders.subtotalInCents,
        shippingInCents: orders.shippingInCents,
        totalInCents: orders.totalInCents,
        shippingCep: orders.shippingCep,
        shippingStreet: orders.shippingStreet,
        shippingNumber: orders.shippingNumber,
        shippingComplement: orders.shippingComplement,
        shippingNeighborhood: orders.shippingNeighborhood,
        shippingCity: orders.shippingCity,
        shippingState: orders.shippingState,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        customer: {
          id: customers.id,
          name: customers.name,
          email: customers.email,
          phone: customers.phone,
        },
      })
      .from(orders)
      .innerJoin(
        customers,
        eq(orders.customerId, customers.id),
      )
      .orderBy(sql`${orders.createdAt} desc`);
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
      .where(eq(orderItems.orderId, orderId));
  }

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
    shippingCep: string;
    shippingStreet: string;
    shippingNumber: string;
    shippingComplement?: string | null;
    shippingNeighborhood: string;
    shippingCity: string;
    shippingState: string;
    subtotalInCents: number;
    shippingInCents: number;
    totalInCents: number;
    items: Omit<NewOrderItem, "orderId">[];
  }) {
    return db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          customerId: data.customerId,
          shippingCep: data.shippingCep,
          shippingStreet: data.shippingStreet,
          shippingNumber: data.shippingNumber,
          shippingComplement: data.shippingComplement,
          shippingNeighborhood: data.shippingNeighborhood,
          shippingCity: data.shippingCity,
          shippingState: data.shippingState,
          status: "pending",
          subtotalInCents: data.subtotalInCents,
          shippingInCents: data.shippingInCents,
          totalInCents: data.totalInCents,
        })
        .returning();

      if (!order) {
        throw new Error("Failed to create order");
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
              eq(productVariants.id, item.productVariantId),
              gte(productVariants.stock, item.quantity),
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

        const [movement] = await tx
          .insert(stockMovements)
          .values({
            productVariantId: item.productVariantId,
            type: "exit",
            quantity: item.quantity,
            reason: `Order ${order.id}`,
          })
          .returning();

        if (!movement) {
          throw new Error("Failed to create stock movement");
        }
      }

      await tx.insert(orderItems).values(
        data.items.map((item) => ({
          ...item,
          orderId: order.id,
        })),
      );

      return order;
    });
  }

  async cancelOrder(orderId: string) {
    return db.transaction(async (tx) => {
      const [order] = await tx
        .update(orders)
        .set({
          status: "cancelled",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(orders.id, orderId),
            eq(orders.status, "pending"),
          ),
        )
        .returning();

      if (!order) {
        return null;
      }

      const items = await tx
        .select({
          productVariantId: orderItems.productVariantId,
          quantity: orderItems.quantity,
          sku: orderItems.sku,
        })
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));

      for (const item of items) {
        const [updatedVariant] = await tx
          .update(productVariants)
          .set({
            stock: sql`${productVariants.stock} + ${item.quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(productVariants.id, item.productVariantId))
          .returning({
            id: productVariants.id,
            stock: productVariants.stock,
          });

        if (!updatedVariant) {
          throw new Error(
            `Failed to restore stock for SKU ${item.sku}`,
          );
        }

        const [movement] = await tx
          .insert(stockMovements)
          .values({
            productVariantId: item.productVariantId,
            type: "entry",
            quantity: item.quantity,
            reason: `Order ${orderId} cancelled`,
          })
          .returning();

        if (!movement) {
          throw new Error("Failed to create stock restoration movement");
        }
      }

      await tx
        .update(payments)
        .set({
          status: "cancelled",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(payments.orderId, orderId),
            eq(payments.status, "pending"),
          ),
        );

      return order;
    });
  }
}