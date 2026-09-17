import { eq } from "drizzle-orm";

import { db } from "../../db/client.js";

import {
  orders,
  payments,
} from "../../db/schema/index.js";

export class PaymentsRepository {
  async findOrderById(
    orderId: string,
  ) {
    const [order] = await db
      .select({
        id: orders.id,
        customerId: orders.customerId,
        status: orders.status,
        totalInCents:
          orders.totalInCents,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    return order ?? null;
  }

  async createPayment(data: {
    orderId: string;
    status: string;
    method: string;
    amountInCents: number;
    provider?: string;
    providerPaymentId?: string;
  }) {
    const [payment] = await db
      .insert(payments)
      .values({
        orderId: data.orderId,
        status: data.status,
        method: data.method,
        amountInCents:
          data.amountInCents,
        provider: data.provider,
        providerPaymentId:
          data.providerPaymentId,
      })
      .returning();

    return payment;
  }

  async findById(id: string) {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, id))
      .limit(1);

    return payment ?? null;
  }

  async findByOrderId(
    orderId: string,
  ) {
    return db
      .select()
      .from(payments)
      .where(
        eq(payments.orderId, orderId),
      );
  }
}