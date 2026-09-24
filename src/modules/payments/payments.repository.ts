import { and, eq } from "drizzle-orm";

import { db } from "../../db/client.js";

import {
  customers,
  orderItems,
  orders,
  payments,
} from "../../db/schema/index.js";

export class PaymentsRepository {
  async findOrderById(orderId: string) {
    const [order] = await db
      .select({
        id: orders.id,
        customerId: orders.customerId,
        status: orders.status,
        totalInCents: orders.totalInCents,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    return order ?? null;
  }

  async findCustomerById(customerId: string) {
    const [customer] = await db
      .select({
        id: customers.id,
        name: customers.name,
        email: customers.email,
        phone: customers.phone,
      })
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);

    return customer ?? null;
  }

  async findOrderItems(orderId: string) {
    return db
      .select({
        id: orderItems.id,
        productName: orderItems.productName,
        sku: orderItems.sku,
        size: orderItems.size,
        color: orderItems.color,
        unitPriceInCents: orderItems.unitPriceInCents,
        quantity: orderItems.quantity,
        totalInCents: orderItems.totalInCents,
      })
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }

  async createPayment(data: {
    orderId: string;
    status: string;
    method: string;
    amountInCents: number;
    provider?: string;
    providerPaymentId?: string;
    checkoutUrl?: string;
    invoiceSlug?: string;
    transactionNsu?: string;
    receiptUrl?: string;
  }) {
    const [payment] = await db
      .insert(payments)
      .values({
        orderId: data.orderId,
        status: data.status,
        method: data.method,
        amountInCents: data.amountInCents,
        provider: data.provider,
        providerPaymentId: data.providerPaymentId,
        checkoutUrl: data.checkoutUrl,
        invoiceSlug: data.invoiceSlug,
        transactionNsu: data.transactionNsu,
        receiptUrl: data.receiptUrl,
      })
      .returning();

    return payment;
  }

  async updatePayment(
    id: string,
    data: {
      status?: string;
      method?: string;
      providerPaymentId?: string;
      checkoutUrl?: string;
      invoiceSlug?: string;
      transactionNsu?: string;
      receiptUrl?: string;
    },
  ) {
    const [payment] = await db
      .update(payments)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, id))
      .returning();

    return payment ?? null;
  }

  async updateOrderStatus(
    orderId: string,
    status: string,
  ) {
    const [order] = await db
      .update(orders)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    return order ?? null;
  }

  async markPaymentAsPaid(
    paymentId: string,
    orderId: string,
    data: {
      method: string;
      providerPaymentId: string;
      invoiceSlug: string;
      transactionNsu: string;
      receiptUrl: string;
    },
  ) {
    return db.transaction(async (tx) => {
      const [order] = await tx
        .update(orders)
        .set({
          status: "paid",
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
        throw new Error(
          "Order cannot be marked as paid",
        );
      }

      const [payment] = await tx
        .update(payments)
        .set({
          status: "paid",
          method: data.method,
          providerPaymentId:
            data.providerPaymentId,
          invoiceSlug: data.invoiceSlug,
          transactionNsu: data.transactionNsu,
          receiptUrl: data.receiptUrl,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(payments.id, paymentId),
            eq(payments.orderId, orderId),
            eq(payments.status, "pending"),
          ),
        )
        .returning();

      if (!payment) {
        throw new Error(
          "Payment cannot be marked as paid",
        );
      }

      return {
        payment,
        order,
      };
    });
  }

  async findById(id: string) {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, id))
      .limit(1);

    return payment ?? null;
  }

  async findByOrderId(orderId: string) {
    return db
      .select()
      .from(payments)
      .where(eq(payments.orderId, orderId));
  }

  async findByTransactionNsu(
    transactionNsu: string,
  ) {
    const [payment] = await db
      .select()
      .from(payments)
      .where(
        eq(
          payments.transactionNsu,
          transactionNsu,
        ),
      )
      .limit(1);

    return payment ?? null;
  }

  async findByOrderIdAndProvider(
    orderId: string,
    provider: string,
  ) {
    const [payment] = await db
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.orderId, orderId),
          eq(payments.provider, provider),
        ),
      )
      .limit(1);

    return payment ?? null;
  }
}