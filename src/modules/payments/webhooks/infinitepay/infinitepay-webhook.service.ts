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
      input.paid_amount !==
      order.totalInCents
    ) {
      throw new Error(
        "Paid amount does not match order total",
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
       * Se já foi processado como pago,
       * tratamos o webhook como idempotente.
       */
      if (
        existingPayment.status ===
        "paid"
      ) {
        return existingPayment;
      }

      /*
       * O mesmo transaction_nsu não deve
       * ser associado a outro pagamento.
       */
      if (
        existingPayment.orderId !==
        order.id
      ) {
        throw new Error(
          "Transaction already belongs to another order",
        );
      }
    }

    /*
     * 4. Localiza o pagamento criado
     * quando o checkout foi iniciado.
     */
    const payment =
      await this.paymentsRepository.findByOrderIdAndProvider(
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
    const result =
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

    return result.payment;
  }
}