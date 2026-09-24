import type { CreatePaymentInput } from "./payments.schemas.js";

import { PaymentsRepository } from "./payments.repository.js";

import { InfinitePayClient } from "./providers/infinitepay/infinitepay.client.js";
import { InfinitePayService } from "./providers/infinitepay/infinitepay.service.js";

const infinitePayClient = new InfinitePayClient();

const infinitePayService = new InfinitePayService(infinitePayClient);

export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
  ) {}

  async findById(id: string) {
    return this.paymentsRepository.findById(id);
  }

  async findByOrderId(orderId: string) {
    const order =
      await this.paymentsRepository.findOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    return this.paymentsRepository.findByOrderId(orderId);
  }

  async create(
    orderId: string,
    _input: CreatePaymentInput,
  ) {
    const order =
      await this.paymentsRepository.findOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "pending") {
      throw new Error(
        "Payment can only be created for pending orders",
      );
    }

    const existingPayments =
      await this.paymentsRepository.findByOrderId(orderId);

    const pendingPayment =
      existingPayments.find(
        (payment) =>
          payment.status === "pending" &&
          payment.checkoutUrl,
      );

    if (pendingPayment) {
      return {
        payment: pendingPayment,
        checkoutUrl: pendingPayment.checkoutUrl,
      };
    }

    const customer =
      await this.paymentsRepository.findCustomerById(
        order.customerId,
      );

    if (!customer) {
      throw new Error("Customer not found");
    }

    const orderItems =
      await this.paymentsRepository.findOrderItems(
        orderId,
      );

    if (orderItems.length === 0) {
      throw new Error("Order has no items");
    }

    const payment =
      await this.paymentsRepository.createPayment({
        orderId,
        status: "pending",
        method: "checkout",
        amountInCents: order.totalInCents,
        provider: "infinitepay",
      });

    if (!payment) {
      throw new Error("Failed to create payment");
    }

    const items = orderItems.map((item) => ({
      quantity: item.quantity,
      price: item.unitPriceInCents,
      description:
        `${item.productName} - ${item.color} - ${item.size}`,
    }));

    try {
      const checkout =
        await infinitePayService.createCheckout({
          orderNsu: order.id,
          items,

          customer: {
            name: customer.name,
            email: customer.email,
            ...(customer.phone
              ? {
                  phone_number: customer.phone,
                }
              : {}),
          },

          redirectUrl:
            process.env.FRONTEND_URL || undefined,

          webhookUrl:
            process.env.INFINITEPAY_WEBHOOK_URL ||
            undefined,
        });

      const updatedPayment =
        await this.paymentsRepository.updatePayment(
          payment.id,
          {
            checkoutUrl: checkout.checkoutUrl,
          },
        );

      if (!updatedPayment) {
        throw new Error(
          "Failed to update payment",
        );
      }

      return {
        payment: updatedPayment,
        checkoutUrl: checkout.checkoutUrl,
      };
    } catch (error) {
      await this.paymentsRepository.updatePayment(
        payment.id,
        {
          status: "failed",
        },
      );

      throw error;
    }
  }
}