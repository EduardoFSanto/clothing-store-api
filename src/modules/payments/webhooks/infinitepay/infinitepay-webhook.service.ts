import type {
  InfinitePayWebhookInput,
} from "./infinitepay-webhook.schemas.js";

import {
  PaymentsRepository,
} from "../../payments.repository.js";

export class InfinitePayWebhookService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
  ) {}

  async process(
    input: InfinitePayWebhookInput,
  ) {
    const order =
      await this.paymentsRepository.findOrderById(
        input.order_nsu,
      );

    if (!order) {
      throw new Error("Order not found");
    }

    if (
      order.totalInCents !== input.amount
    ) {
      throw new Error(
        "Payment amount does not match order total",
      );
    }

    const existingPayment =
      await this.paymentsRepository.findByTransactionNsu(
        input.transaction_nsu,
      );

    if (
      existingPayment &&
      existingPayment.status === "paid"
    ) {
      return existingPayment;
    }

    const payment =
      await this.paymentsRepository.findByOrderIdAndProvider(
        input.order_nsu,
        "infinitepay",
      );

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status === "paid") {
      return payment;
    }

    if (
      payment.amountInCents !== input.amount
    ) {
      throw new Error(
        "Payment amount does not match stored payment",
      );
    }

    const updatedPayment =
      await this.paymentsRepository.updatePayment(
        payment.id,
        {
          status: "paid",
          method: input.capture_method,
          providerPaymentId:
            input.transaction_nsu,
          invoiceSlug:
            input.invoice_slug,
          transactionNsu:
            input.transaction_nsu,
          receiptUrl:
            input.receipt_url,
        },
      );

    if (!updatedPayment) {
      throw new Error(
        "Failed to update payment",
      );
    }

    const updatedOrder =
      await this.paymentsRepository.updateOrderStatus(
        order.id,
        "paid",
      );

    if (!updatedOrder) {
      throw new Error(
        "Failed to update order status",
      );
    }

    return updatedPayment;
  }
}