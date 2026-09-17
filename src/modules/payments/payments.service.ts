import type {
  CreatePaymentInput,
} from "./payments.schemas.js";

import {
  PaymentsRepository,
} from "./payments.repository.js";

export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
  ) {}

  async findById(id: string) {
    return this.paymentsRepository.findById(
      id,
    );
  }

  async findByOrderId(
    orderId: string,
  ) {
    const order =
      await this.paymentsRepository.findOrderById(
        orderId,
      );

    if (!order) {
      throw new Error(
        "Order not found",
      );
    }

    return this.paymentsRepository.findByOrderId(
      orderId,
    );
  }

  async create(
    orderId: string,
    input: CreatePaymentInput,
  ) {
    const order =
      await this.paymentsRepository.findOrderById(
        orderId,
      );

    if (!order) {
      throw new Error(
        "Order not found",
      );
    }

    if (order.status !== "pending") {
      throw new Error(
        "Payment can only be created for pending orders",
      );
    }

    const payments =
      await this.paymentsRepository.findByOrderId(
        orderId,
      );

    const pendingPayment =
      payments.find(
        (payment) =>
          payment.status === "pending",
      );

    if (pendingPayment) {
      throw new Error(
        "There is already a pending payment for this order",
      );
    }

    return this.paymentsRepository.createPayment(
      {
        orderId,
        status: "pending",
        method: input.method,
        amountInCents:
          order.totalInCents,
      },
    );
  }
}