import type { CreateOrderInput } from "./orders.schemas.js";

import { OrdersRepository } from "./orders.repository.js";

export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async findAll() {
    return this.ordersRepository.findAll();
  }

  async findById(id: string) {
    const order =
      await this.ordersRepository.findById(id);

    if (!order) {
      return null;
    }

    const items =
      await this.ordersRepository.findItemsByOrderId(
        id,
      );

    return {
      ...order,
      items,
    };
  }

  async create(input: CreateOrderInput) {
    const customer =
      await this.ordersRepository.findCustomerById(
        input.customerId,
      );

    if (!customer) {
      throw new Error("Customer not found");
    }

    const variants = [];

    for (const item of input.items) {
      const variant =
        await this.ordersRepository.findVariantById(
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

      if (variant.stock < item.quantity) {
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
        (total, { input, variant }) => {
          return (
            total +
            variant.priceInCents *
              input.quantity
          );
        },
        0,
      );

    const shippingInCents =
      input.shippingInCents;

    const totalInCents =
      subtotalInCents +
      shippingInCents;

    const items = variants.map(
      ({ input, variant }) => ({
        productVariantId: variant.id,
        productName: variant.productName,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        unitPriceInCents:
          variant.priceInCents,
        quantity: input.quantity,
        totalInCents:
          variant.priceInCents *
          input.quantity,
      }),
    );

    const order =
      await this.ordersRepository.createOrder({
        customerId: input.customerId,
        subtotalInCents,
        shippingInCents,
        totalInCents,
        items,
      });

    return this.findById(order.id);
  }
}