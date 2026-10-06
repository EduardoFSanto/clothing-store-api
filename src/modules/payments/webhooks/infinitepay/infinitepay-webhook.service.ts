import type {
  InfinitePayWebhookInput,
} from "./infinitepay-webhook.schemas.js";

import { EmailNotificationService } from "../../../notifications/email-notification.service.js";

import {
  PaymentsRepository,
} from "../../payments.repository.js";

const emailNotificationService =
  new EmailNotificationService();

export class InfinitePayWebhookService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
  ) {}

  async process(
    input: InfinitePayWebhookInput,
  ) {
    /*
     * 1. Localiza o pedido pelo order_nsu
     * enviado pela InfinitePay.
     */
    const order =
      await this.paymentsRepository.findOrderById(
        input.order_nsu,
      );

    if (!order) {
      throw new Error(
        "Order not found",
      );
    }

    /*
     * 2. O valor recebido pela InfinitePay
     * precisa corresponder ao valor do pedido.
     *
     * `amount` representa o valor da transação.
     * `paid_amount` representa o valor efetivamente pago.
     */
    if (
      input.amount !==
      order.totalInCents
    ) {
      throw new Error(
        "Payment amount does not match order total",
      );
    }

    if (
      input.paid_amount <
      order.totalInCents
    ) {
      throw new Error(
        "Paid amount is lower than order total",
      );
    }

    /*
     * 3. Verifica se esse transaction_nsu
     * já foi processado.
     *
     * Webhooks podem ser enviados mais de uma vez.
     */
    const existingPayment =
      await this.paymentsRepository.findByTransactionNsu(
        input.transaction_nsu,
      );

    if (existingPayment) {
      /*
       * O transaction_nsu é único globalmente.
       * Antes de tratar como idempotente, confirmamos
       * que ele pertence ao pedido recebido.
       */
      if (
        existingPayment.orderId !==
        order.id
      ) {
        throw new Error(
          "Transaction already belongs to another order",
        );
      }

      /*
       * Se já foi processado como pago,
       * tratamos o webhook como idempotente.
       */
      if (
        existingPayment.status ===
        "paid"
      ) {
        return existingPayment;
      }
    }

    /*
     * 4. Localiza o pagamento criado
     * quando o checkout foi iniciado.
     */
    const payment =
      await this.paymentsRepository.findPendingByOrderIdAndProvider(
        input.order_nsu,
        "infinitepay",
      );

    if (!payment) {
      throw new Error(
        "Payment not found",
      );
    }

    /*
     * 5. Se o pagamento já estiver pago,
     * não fazemos nenhuma alteração.
     */
    if (
      payment.status ===
      "paid"
    ) {
      return payment;
    }

    /*
     * 6. Confirma que o valor armazenado
     * no payment também corresponde ao
     * valor recebido.
     */
    if (
      payment.amountInCents !==
      input.amount
    ) {
      throw new Error(
        "Payment amount does not match stored payment",
      );
    }

    /*
     * 7. O pedido precisa estar pendente
     * para receber uma confirmação de pagamento.
     */
    if (
      order.status !==
      "pending"
    ) {
      throw new Error(
        `Order cannot be paid from status ${order.status}`,
      );
    }

    /*
     * 8. Atualiza payment + order dentro
     * de uma única transação.
     */
    let result;

    try {
      result =
        await this.paymentsRepository.markPaymentAsPaid(
          payment.id,
          order.id,
          {
            method:
              input.capture_method,

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
    } catch (error) {
      /*
       * Dois webhooks iguais podem chegar
       * simultaneamente. Se outro processamento
       * acabou de confirmar este transaction_nsu,
       * o segundo deve ser tratado como idempotente.
       */
      const processedPayment =
        await this.paymentsRepository.findByTransactionNsu(
          input.transaction_nsu,
        );

      if (
        processedPayment &&
        processedPayment.orderId === order.id &&
        processedPayment.status === "paid"
      ) {
        return processedPayment;
      }

      throw error;
    }

    const customer =
      await this.paymentsRepository.findCustomerById(
        order.customerId,
      );

    const orderItems =
      await this.paymentsRepository.findOrderItems(
        order.id,
      );

    if (customer) {
      try {
        await emailNotificationService.sendPaidOrderNotification({
          orderId: order.id,
          customerName: customer.name,
          customerEmail: customer.email,
          totalInCents: order.totalInCents,
          paymentMethod: input.capture_method,
          receiptUrl: input.receipt_url,
          items: orderItems,
        });
      } catch (error) {
        console.error(
          "Paid order email notification error:",
          error,
        );
      }
    }

    return result.payment;
  }
}