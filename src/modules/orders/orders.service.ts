import type { CreateOrderInput } from "./orders.schemas.js";

import { OrdersRepository } from "./orders.repository.js";

import { ShippingRepository } from "../shipping/shipping.repository.js";
import { ShippingService } from "../shipping/shipping.service.js";
import { TableShippingClient } from "../shipping/providers/table/table.client.js";
import { ViaCepClient } from "../shipping/providers/viacep/viacep.client.js";

const viaCepClient =
  new ViaCepClient();

const tableShippingClient =
  new TableShippingClient();

const shippingRepository =
  new ShippingRepository();

const shippingService =
  new ShippingService(
    viaCepClient,
    tableShippingClient,
    shippingRepository,
  );

export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async findAll() {
    return this.ordersRepository.findAll();
  }

  async findById(
    id: string,
  ) {
    const order =
      await this.ordersRepository
        .findById(id);

    if (!order) {
      return null;
    }

    const items =
      await this.ordersRepository
        .findItemsByOrderId(id);

    return {
      ...order,
      items,
    };
  }

  async create(
    input: CreateOrderInput,
  ) {
    const customer =
      await this.ordersRepository
        .findCustomerById(
          input.customerId,
        );

    if (!customer) {
      throw new Error(
        "Customer not found",
      );
    }

    const variants = [];

    for (
      const item of input.items
    ) {
      const variant =
        await this.ordersRepository
          .findVariantById(
            item.productVariantId,
          );

      if (!variant) {
        throw new Error(
          `Product variant ${item.productVariantId} not found`,
        );
      }

      if (!variant.active) {
        throw new Error(
          `Product variant ${variant.sku} is inactive`,
        );
      }

      if (!variant.productActive) {
        throw new Error(
          `Product ${variant.productName} is inactive`,
        );
      }

      if (
        variant.stock <
        item.quantity
      ) {
        throw new Error(
          `Insufficient stock for SKU ${variant.sku}`,
        );
      }

      variants.push({
        input: item,
        variant,
      });
    }

    const subtotalInCents =
      variants.reduce(
        (
          total,
          { input, variant },
        ) =>
          total +
          variant.priceInCents *
            input.quantity,
        0,
      );

    const shippingQuote =
      await shippingService
        .calculateQuote({
          destinationCep:
            input.shippingAddress
              .cep,

          items:
            input.items,
        });

    const shippingInCents =
      shippingQuote.amountInCents;

    const totalInCents =
      subtotalInCents +
      shippingInCents;

    const shippingCep =
      input.shippingAddress.cep
        .replace(/\D/g, "");

    const items =
      variants.map(
        ({ input, variant }) => ({
          productVariantId:
            variant.id,

          productName:
            variant.productName,

          sku:
            variant.sku,

          size:
            variant.size,

          color:
            variant.color,

          unitPriceInCents:
            variant.priceInCents,

          quantity:
            input.quantity,

          totalInCents:
            variant.priceInCents *
            input.quantity,
        }),
      );

    const order =
      await this.ordersRepository
        .createOrder({
          customerId:
            input.customerId,

          shippingCep,

          shippingStreet:
            input.shippingAddress
              .street,

          shippingNumber:
            input.shippingAddress
              .number,

          shippingComplement:
            input.shippingAddress
              .complement ||
            null,

          shippingNeighborhood:
            input.shippingAddress
              .neighborhood,

          shippingCity:
            input.shippingAddress
              .city,

          shippingState:
            input.shippingAddress
              .state,

          subtotalInCents,

          shippingInCents,

          totalInCents,

          items,
        });

    return this.findById(
      order.id,
    );
  }

  async cancel(
    id: string,
  ) {
    const order =
      await this.ordersRepository
        .findById(id);

    if (!order) {
      throw new Error(
        "Order not found",
      );
    }

    if (
      order.status ===
      "paid"
    ) {
      throw new Error(
        "Paid orders cannot be cancelled through this endpoint",
      );
    }

    if (
      order.status ===
      "cancelled"
    ) {
      return order;
    }

    if (
      order.status !==
      "pending"
    ) {
      throw new Error(
        `Order cannot be cancelled from status ${order.status}`,
      );
    }

    const cancelledOrder =
      await this.ordersRepository
        .cancelOrder(id);

    if (!cancelledOrder) {
      throw new Error(
        "Order could not be cancelled",
      );
    }

    return this.findById(
      id,
    );
  }
}