export type InfinitePayItem = {
  quantity: number;
  price: number;
  description: string;
};

export type InfinitePayCustomer = {
  name: string;
  email: string;
  phone_number?: string;
};

export type CreateInfinitePayCheckoutPayload = {
  handle: string;
  items: InfinitePayItem[];
  order_nsu: string;
  redirect_url?: string;
  webhook_url?: string;
  customer?: InfinitePayCustomer;
};

export type InfinitePayCheckoutResponse = {
  url: string;
};