import type {
  InfinitePayCustomer,
  InfinitePayItem,
} from "./infinitepay.types.js";

import { InfinitePayClient } from "./infinitepay.client.js";

export class InfinitePayService {
  constructor(
    private readonly client: InfinitePayClient,
  ) {}

  async createCheckout(data: {
    orderNsu: string;

    items: InfinitePayItem[];

    customer?: InfinitePayCustomer;

    redirectUrl?: string;

    webhookUrl?: string;
  }) {
    const response =
      await this.client.createCheckout({
        order_nsu: data.orderNsu,

        items: data.items,

        customer: data.customer,

        redirect_url:
          data.redirectUrl,

        webhook_url:
          data.webhookUrl,
      });

    return {
      checkoutUrl: response.url,
    };
  }
}